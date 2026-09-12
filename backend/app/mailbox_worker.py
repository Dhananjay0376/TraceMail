import base64
import json
import asyncio
import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
try:
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
except ImportError:
    Credentials = None
    build = None

from app.database import (
    get_all_monitored_mailboxes,
    save_case,
    update_mailbox_last_synced,
    save_monitored_mailbox
)
from app.forensics import (
    parse_eml_bytes,
    extract_hops,
    check_authentication_records
)
from app.geointel import geolocate_ip, domain_intel
from app.detection import classify_email
from app.correlation import compute_fraud_score, record_and_correlate
from app.schemas import (
    AnalyzeResponse, DetectionResult, HeaderDetails, AuthResults,
    RelayHop, DomainIntel, FraudScoreBreakdown, CampaignMatch,
    EvidenceSeal, URLThreatDetails, AttachmentDetails
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/mailbox", tags=["mailbox"])

# In-memory registry of active mailbox credentials and sync locks
ACTIVE_MAILBOXES: Dict[str, Credentials] = {}
_sync_lock = asyncio.Lock()

def register_monitored_mailbox(email: str, creds: Credentials):
    """Registers or updates a mailbox in the active worker memory."""
    ACTIVE_MAILBOXES[email] = creds
    logger.info(f"Mailbox registered for real-time monitoring: {email}")

def unregister_monitored_mailbox(email: str):
    """Removes a mailbox from active worker memory."""
    ACTIVE_MAILBOXES.pop(email, None)
    logger.info(f"Mailbox unregistered: {email}")

def rehydrate_mailboxes_from_db():
    """Loads all active monitored mailboxes from SQLite on backend startup."""
    try:
        mailboxes = get_all_monitored_mailboxes()
        for m in mailboxes:
            email = m["email"]
            token_data = json.loads(m["token_json"])
            creds = Credentials(
                token=token_data.get("token"),
                refresh_token=token_data.get("refresh_token"),
                token_uri=token_data.get("token_uri", "https://oauth2.googleapis.com/token"),
                client_id=token_data.get("client_id"),
                client_secret=token_data.get("client_secret"),
                scopes=token_data.get("scopes")
            )
            ACTIVE_MAILBOXES[email] = creds
        logger.info(f"Rehydrated {len(ACTIVE_MAILBOXES)} monitored mailbox(es) from database.")
    except Exception as e:
        logger.exception(f"Failed to rehydrate mailboxes from DB: {e}")

async def process_single_email(service, msg_id: str, email_account: str) -> Optional[Dict[str, Any]]:
    """
    Executes the 2-Stage Automated Ingestion & Triage Pipeline on a single incoming email:
    Stage 1: Fast Header Forensics (SPF, DKIM, DMARC, Sender Spoofing, Relay Anomalies).
    Stage 2: Deep Dual-Model Analysis (NLP Threat Detection + GeoIntel Infrastructure Correlation).
    """
    try:
        # Fetch RAW RFC 822 format (headers, MIME parts, signatures intact)
        msg_raw_data = service.users().messages().get(userId='me', id=msg_id, format='raw').execute()
        raw_b64 = msg_raw_data.get('raw', '')
        raw_bytes = base64.urlsafe_b64decode(raw_b64.encode('ASCII'))

        # =========================================================================
        # STAGE 1: Fast-Gate Header Forensics Triage
        # =========================================================================
        parsed = parse_eml_bytes(raw_bytes)
        body_text = parsed.get("body") or ""
        extracted_urls = parsed.get("extracted_urls", [])
        attachments = parsed.get("attachments", [])

        from_header = parsed.get("from", "")
        sender_domain = from_header.split("@")[-1].rstrip(">").strip() if "@" in from_header else ""
        return_path = parsed.get("return_path", "")
        return_domain = return_path.split("@")[-1].rstrip(">").strip() if "@" in return_path else ""
        sender_mismatch = bool(sender_domain and return_domain and sender_domain.lower() != return_domain.lower())

        hop_ips = extract_hops(parsed.get("received_chain", []))
        auth_raw = check_authentication_records(sender_domain, raw_bytes)
        auth_results = AuthResults(**auth_raw)

        # Evaluate Stage 1 Header Health
        spf_fail = auth_results.spf_status in ["fail", "softfail"]
        dkim_fail = auth_results.dkim_status == "fail"
        dmarc_fail = auth_results.dmarc_status == "fail"
        has_suspicious_urls = any(u.get("is_suspicious") for u in extracted_urls)
        has_suspicious_attachments = any(a.get("is_suspicious") for a in attachments)

        # Determine if header inspection failed or was flagged suspicious
        stage1_failed = (
            spf_fail or
            dkim_fail or
            dmarc_fail or
            sender_mismatch or
            has_suspicious_urls or
            has_suspicious_attachments
        )

        logger.info(
            f"[STAGE 1 TRIAGE] Email ID: {msg_id} | From: {from_header} | "
            f"SPF: {auth_results.spf_status} | DKIM: {auth_results.dkim_status} | "
            f"DMARC: {auth_results.dmarc_status} | Mismatch: {sender_mismatch} | "
            f"Result: {'FAIL -> ESCALATING TO STAGE 2' if stage1_failed else 'PASS (CLEAN)'}"
        )

        # Mark message as read so it's not processed repeatedly
        try:
            service.users().messages().modify(
                userId='me',
                id=msg_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
        except Exception as e:
            logger.warning(f"Could not remove UNREAD label from message {msg_id}: {e}")

        # If Stage 1 Passed cleanly, save a lightweight clean record and return
        if not stage1_failed:
            case_id = f"AUTO-{uuid.uuid4().hex[:8].upper()}"
            timestamp = datetime.now(timezone.utc).isoformat()
            evidence_seal = EvidenceSeal(**parsed["evidence_seal"])

            clean_response = AnalyzeResponse(
                id=case_id,
                timestamp=timestamp,
                evidence_seal=evidence_seal,
                detection=DetectionResult(
                    label="Legitimate",
                    confidence=0.99,
                    model_version="stage1-header-check"
                ),
                headers=HeaderDetails(
                    from_header=parsed.get("from"),
                    return_path=parsed.get("return_path"),
                    reply_to=parsed.get("reply_to"),
                    message_id=parsed.get("message_id"),
                    subject=parsed.get("subject"),
                    date=parsed.get("date"),
                    auth_results=auth_results,
                    received_chain=parsed.get("received_chain", [])
                ),
                trace=[],
                domain_intel=None,
                extracted_urls=[URLThreatDetails(**u) for u in extracted_urls],
                attachments=[AttachmentDetails(**a) for a in attachments],
                fraud_score=FraudScoreBreakdown(
                    score=0,
                    risk_level="Low",
                    factors=[]
                ),
                campaign=None,
                raw_body_preview=(parsed.get("body") or "")[:400]
            )
            save_case(clean_response.model_dump())
            logger.info(f"[STAGE 1 CLEAN] Saved clean email case {case_id} from {from_header}")
            return {
                "message_id": msg_id,
                "case_id": case_id,
                "status": "stage_1_passed",
                "verdict": "Verified Clean Header",
                "from": from_header,
                "subject": parsed.get("subject", "")
            }

        # =========================================================================
        # STAGE 2: Deep Dual-Model Threat Analysis & Correlation
        # =========================================================================
        logger.info(f"[STAGE 2 DEEP ANALYSIS] Executing Dual AI Models for email: {msg_id}...")

        case_id = f"AUTO-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.now(timezone.utc).isoformat()
        evidence_seal = EvidenceSeal(**parsed["evidence_seal"])
        url_threat_objs = [URLThreatDetails(**u) for u in extracted_urls]
        attachment_objs = [AttachmentDetails(**a) for a in attachments]

        # Model 1: NLP / Transformer Threat Classifier
        text_to_classify = f"{parsed.get('subject', '')} {body_text}".strip() or "No body text"
        detection_raw = classify_email(text_to_classify)
        detection = DetectionResult(**detection_raw)

        # Model 2: GeoLocation, Infrastructure & Threat Intel
        trace_hops: List[RelayHop] = []
        for idx, ip in enumerate(hop_ips):
            geo = geolocate_ip(ip)
            trace_hops.append(RelayHop(
                hop_index=idx + 1,
                ip=ip,
                city=geo.get("city"),
                region=geo.get("region"),
                country=geo.get("country"),
                org=geo.get("org"),
                lat=geo.get("lat"),
                lon=geo.get("lon"),
                is_origin=(idx == 0),
                is_hosting=geo.get("is_hosting", False)
            ))

        dom_intel_raw = domain_intel(sender_domain) if sender_domain else None
        dom_intel = DomainIntel(**dom_intel_raw) if dom_intel_raw else None

        origin_hop = trace_hops[0] if trace_hops else None
        origin_is_hosting = origin_hop.is_hosting if origin_hop else False
        dom_age = dom_intel.age_days if dom_intel else None

        # Calculate Explainable Fraud Confidence Score
        score_dict = compute_fraud_score(
            model_prob=detection.confidence,
            is_phishing_label=(detection.label in ["Phishing", "Suspicious", "BEC"]),
            spf_status=auth_results.spf_status,
            dkim_status=auth_results.dkim_status,
            dmarc_status=auth_results.dmarc_status,
            domain_age_days=dom_age,
            is_hosting_ip=origin_is_hosting,
            sender_return_path_mismatch=sender_mismatch,
            extracted_urls=[u.model_dump() for u in url_threat_objs],
            attachments=[a.model_dump() for a in attachment_objs]
        )
        fraud_score = FraudScoreBreakdown(**score_dict)

        # Correlate in Campaign Graph
        campaign_raw = record_and_correlate(
            case_id=case_id,
            domain=sender_domain,
            originating_ip=origin_hop.ip if origin_hop else None,
            label=detection.label,
            score=fraud_score.score,
            risk_level=fraud_score.risk_level
        )
        campaign = CampaignMatch(**campaign_raw) if campaign_raw else None

        response = AnalyzeResponse(
            id=case_id,
            timestamp=timestamp,
            evidence_seal=evidence_seal,
            detection=detection,
            headers=HeaderDetails(
                from_header=parsed.get("from"),
                return_path=parsed.get("return_path"),
                reply_to=parsed.get("reply_to"),
                message_id=parsed.get("message_id"),
                subject=parsed.get("subject"),
                date=parsed.get("date"),
                auth_results=auth_results,
                received_chain=parsed.get("received_chain", [])
            ),
            trace=trace_hops,
            domain_intel=dom_intel,
            extracted_urls=url_threat_objs,
            attachments=attachment_objs,
            fraud_score=fraud_score,
            campaign=campaign,
            raw_body_preview=body_text[:400] + ("..." if len(body_text) > 400 else "")
        )

        # Persist automatically discovered threat case in SQLite
        save_case(response.model_dump())
        logger.info(f"[STAGE 2 COMPLETE] Registered case {case_id} for email from {from_header} (Score: {fraud_score.score})")

        return {
            "message_id": msg_id,
            "case_id": case_id,
            "status": "stage_2_analyzed",
            "fraud_score": fraud_score.score,
            "risk_level": fraud_score.risk_level,
            "prediction": detection.label
        }

    except Exception as e:
        logger.exception(f"Error processing email message {msg_id}: {e}")
        return None

async def poll_all_monitored_mailboxes():
    """Polls all active monitored mailboxes for unread emails and runs triage."""
    async with _sync_lock:
        for email, creds in list(ACTIVE_MAILBOXES.items()):
            try:
                # Refresh expired token before making any API call
                if creds.expired or not creds.valid:
                    if creds.refresh_token:
                        try:
                            from google.auth.transport.requests import Request
                            creds.refresh(Request())
                            ACTIVE_MAILBOXES[email] = creds
                            # Persist the refreshed token back to DB
                            import json as _json
                            refreshed_token = _json.dumps({
                                "token": creds.token,
                                "refresh_token": creds.refresh_token,
                                "token_uri": creds.token_uri,
                                "client_id": creds.client_id,
                                "client_secret": creds.client_secret,
                                "scopes": list(creds.scopes) if creds.scopes else []
                            })
                            save_monitored_mailbox(email, refreshed_token)
                            logger.info(f"Token refreshed and persisted for mailbox: {email}")
                        except Exception as refresh_err:
                            logger.error(f"Token refresh failed for {email}: {refresh_err}. Skipping.")
                            continue
                    else:
                        logger.warning(f"No refresh_token available for {email}. Skipping — re-auth required.")
                        continue

                service = build("gmail", "v1", credentials=creds)
                results = service.users().messages().list(userId='me', q='is:unread', maxResults=10).execute()
                messages = results.get('messages', [])

                if messages:
                    logger.info(f"Discovered {len(messages)} unread email(s) in mailbox: {email}")
                    for m in messages:
                        await process_single_email(service, m['id'], email)
                else:
                    logger.debug(f"No unread emails in mailbox: {email}")

                update_mailbox_last_synced(email)
            except Exception as e:
                logger.warning(f"Mailbox sync check failed for {email}: {e}")

async def background_mailbox_sync_loop(poll_interval_seconds: int = 15):
    """Continuous background worker loop that periodically inspects connected inboxes."""
    logger.info(f"Starting background mailbox sync loop (polling every {poll_interval_seconds}s)...")
    rehydrate_mailboxes_from_db()

    while True:
        try:
            if ACTIVE_MAILBOXES:
                await poll_all_monitored_mailboxes()
        except Exception as e:
            logger.exception(f"Unexpected error in mailbox background worker loop: {e}")
        
        await asyncio.sleep(poll_interval_seconds)

@router.post("/sync")
async def trigger_manual_sync():
    """Triggers an immediate scan and triage of all connected mailboxes on demand."""
    if not ACTIVE_MAILBOXES:
        raise HTTPException(status_code=400, detail="No active mailboxes connected. Please connect via OAuth first.")
    
    await poll_all_monitored_mailboxes()
    return {
        "status": "success",
        "message": f"Synchronized and triaged {len(ACTIVE_MAILBOXES)} connected mailbox(es)."
    }
