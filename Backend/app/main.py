"""
TraceMail Backend API (FastAPI)
Exposes forensic email analysis, dual ML threat detection, IP geolocation,
NetworkX threat campaign correlation, and evidentiary export endpoints.
"""

import os
import glob
import re
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import forensics, geointel, detection, correlation
from app.schemas import (
    AnalyzeResponse,
    SampleEmailMeta,
    ReportExportRequest
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAMPLE_DIR = os.path.join(BASE_DIR, "data", "sample")

# In-memory store for analyzed cases
analyzed_cases: Dict[str, Dict[str, Any]] = {}

SAMPLE_METADATA = [
    {
        "id": "sample-1",
        "filename": "01_phishing_credential_theft.eml",
        "title": "RBI Urgent KYC Verification Phish",
        "description": "High-urgency bank spoofing from an overseas bulletproof host IP, failing SPF/DKIM with credential theft link.",
        "category": "Credential Harvesting",
        "expected_risk": "CRITICAL / PHISHING",
        "origin_location": "Moscow, Russia"
    },
    {
        "id": "sample-2",
        "filename": "02_bec_executive_wire_transfer.eml",
        "title": "CEO Wire Transfer & Invoice BEC",
        "description": "Executive impersonation requesting urgent confidential wire transfer to overseas routing account via DigitalOcean VPS.",
        "category": "Business Email Compromise (BEC)",
        "expected_risk": "CRITICAL / BEC",
        "origin_location": "Amsterdam, Netherlands"
    },
    {
        "id": "sample-3",
        "filename": "03_legitimate_internal_update.eml",
        "title": "Corporate Strategy Meeting Notes",
        "description": "Normal enterprise email with passing SPF/DKIM, legitimate company leased-line IP and mature domain.",
        "category": "Legitimate Ham",
        "expected_risk": "SAFE",
        "origin_location": "Mumbai, India"
    },
    {
        "id": "sample-4",
        "filename": "04_forwarded_borderline_spf_fail.eml",
        "title": "Advisory Mailing List Forward",
        "description": "Legitimate inter-firm document forwarded via mailman list. Shows SPF softfail but valid DKIM and established domain.",
        "category": "Borderline Forwarded",
        "expected_risk": "SUSPICIOUS / BORDERLINE",
        "origin_location": "Redmond, USA"
    },
    {
        "id": "sample-5",
        "filename": "05_campaign_cluster_variant.eml",
        "title": "IT Helpdesk Credential Expiry Phish",
        "description": "Corporate password reset lure sharing the EXACT rogue VPS IP and Reply-To collector as Sample #1 (Coordinated Campaign).",
        "category": "Campaign Cluster (Phishing)",
        "expected_risk": "CRITICAL / CAMPAIGN LINK",
        "origin_location": "Moscow, Russia"
    }
]


def process_email_bytes(raw_bytes: bytes, original_filename: str = "uploaded_email.eml") -> Dict[str, Any]:
    """Execute complete analysis pipeline across all forensics and ML modules."""
    parsed = forensics.parse_eml_bytes(raw_bytes)
    
    # 1. Text ML Prediction & BEC Urgency Extraction
    ml_res = detection.predict_text(parsed["body_text"])
    
    # 2. Geolocation for Origin and Hops
    origin_geo = geointel.geolocate_ip(parsed["origin_ip"])
    
    # Enrich hops with geolocation details
    enriched_hops = []
    for h in parsed["relay_hops"]:
        h_copy = dict(h)
        if h.get("is_public_ip") and h.get("ip"):
            h_geo = geointel.geolocate_ip(h["ip"])
            h_copy["city"] = h_geo.get("city")
            h_copy["country"] = h_geo.get("country")
            h_copy["lat"] = h_geo.get("lat")
            h_copy["lon"] = h_geo.get("lon")
            h_copy["org"] = h_geo.get("org")
        enriched_hops.append(h_copy)
        
    # 3. Domain Intelligence
    from_domain = parsed["from"]["domain"]
    dom_intel = geointel.domain_intel(from_domain)
    
    # Check Reply-To domain if divergent
    reply_domain = parsed["anomalies"]["reply_to_domain"]
    reply_dom_intel = geointel.domain_intel(reply_domain) if reply_domain else None
    
    # 4. Explainable Fraud Score Calculation
    scoring = correlation.compute_fraud_score(
        model_prob=ml_res["phishing_prob"],
        spf_status=parsed["authentication"]["spf"],
        dkim_status=parsed["authentication"]["dkim"],
        dmarc_status=parsed["authentication"]["dmarc"],
        domain_age_days=dom_intel["domain_age_days"],
        is_hosting_ip=origin_geo.get("is_hosting", False),
        reply_to_mismatch=parsed["anomalies"]["reply_to_mismatch"],
        return_path_mismatch=parsed["anomalies"]["return_path_mismatch"],
        display_name_spoofing=parsed["anomalies"]["display_name_spoofing"],
        bec_cues=ml_res["bec_cues"],
        reply_domain_age_days=reply_dom_intel["domain_age_days"] if reply_dom_intel else None
    )
    
    case_id = parsed["sha256_hash"][:12]
    now_iso = datetime.now(timezone.utc).isoformat()
    
    # 5. Add to NetworkX Knowledge Graph
    correlation.graph_manager.add_case(
        case_id=case_id,
        subject=parsed["subject"] or original_filename,
        fraud_score=scoring["fraud_score"],
        verdict=scoring["verdict"],
        sender_email=parsed["from"]["email"],
        sender_domain=from_domain,
        reply_to_email=parsed["reply_to"],
        origin_ip=parsed["origin_ip"],
        hops=enriched_hops,
        geo=origin_geo
    )
    
    result = {
        "case_id": case_id,
        "filename": original_filename,
        "timestamp": now_iso,
        "sha256_hash": parsed["sha256_hash"],
        "subject": parsed["subject"],
        "sender": parsed["from"],
        "to": parsed["to"],
        "date": parsed["date"],
        "message_id": parsed["message_id"],
        "return_path": parsed["return_path"],
        "reply_to": parsed["reply_to"],
        "origin_ip": parsed["origin_ip"],
        "geolocation": origin_geo,
        "domain_intel": dom_intel,
        "reply_domain_intel": reply_dom_intel,
        "relay_hops": enriched_hops,
        "hop_count": len(enriched_hops),
        "authentication": parsed["authentication"],
        "anomalies": parsed["anomalies"],
        "detection": ml_res,
        "fraud_scoring": scoring,
        "body_preview": parsed["body_text"][:400] + ("..." if len(parsed["body_text"]) > 400 else ""),
        "full_body_text": parsed["body_text"],
        "attachments": parsed["attachments"]
    }
    
    analyzed_cases[case_id] = result
    return result


def preload_demo_samples():
    """Pre-populate store with the 5 curated demo sample emails."""
    logger = logging.getLogger("uvicorn.info")
    for meta in SAMPLE_METADATA:
        fpath = os.path.join(SAMPLE_DIR, meta["filename"])
        if os.path.exists(fpath):
            try:
                with open(fpath, "rb") as fp:
                    raw = fp.read()
                process_email_bytes(raw, meta["filename"])
                logger.info(f"Preloaded demo case: {meta['title']}")
            except Exception as e:
                logger.warning(f"Could not preload {meta['filename']}: {e}")

# Preload on import so cases and campaigns are available immediately
preload_demo_samples()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for FastAPI."""
    if len(analyzed_cases) < len(SAMPLE_METADATA):
        preload_demo_samples()
    yield
    logging.getLogger("uvicorn.info").info("Shutting down TraceMail Engine.")


app = FastAPI(
    title="TraceMail AI Forensic Intelligence API",
    description="SIH26106 AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "TraceMail AI Forensics API",
        "sih_problem_statement": "SIH26106",
        "version": "2.0.0",
        "endpoints": {
            "analyze": "/api/analyze",
            "samples": "/api/samples",
            "cases": "/api/cases",
            "campaign_graph": "/api/campaigns/graph",
            "docs": "/docs"
        }
    }


@app.get("/api/samples")
def get_samples() -> List[Dict[str, Any]]:
    """Enumerate pre-loaded sample emails for 1-click evaluation."""
    return SAMPLE_METADATA


@app.get("/api/samples/{sample_id}")
def get_sample_content(sample_id: str):
    """Retrieve raw sample email content by ID."""
    match = next((s for s in SAMPLE_METADATA if s["id"] == sample_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Sample email not found")
    fpath = os.path.join(SAMPLE_DIR, match["filename"])
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail="Sample file missing from disk")
    with open(fpath, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()
    return {"meta": match, "raw_eml": content}


@app.post("/api/analyze")
async def analyze_email(
    file: Optional[UploadFile] = File(None),
    raw_eml: Optional[str] = Form(None)
):
    """
    Core forensic analysis endpoint.
    Accepts .eml file upload OR raw MIME email text string.
    """
    if file is not None:
        raw_bytes = await file.read()
        filename = file.filename or "uploaded.eml"
    elif raw_eml is not None and raw_eml.strip():
        raw_bytes = raw_eml.encode("utf-8")
        filename = "pasted_email.eml"
    else:
        raise HTTPException(status_code=400, detail="Must provide either an uploaded .eml file or raw_eml text.")
        
    try:
        result = process_email_bytes(raw_bytes, filename)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forensic parsing failure: {str(e)}")


@app.get("/api/cases")
def list_cases() -> List[Dict[str, Any]]:
    """Retrieve historical analyzed cases list."""
    summary_list = []
    for cid, c in analyzed_cases.items():
        summary_list.append({
            "case_id": cid,
            "filename": c.get("filename", ""),
            "subject": c.get("subject", ""),
            "timestamp": c.get("timestamp", ""),
            "fraud_score": c["fraud_scoring"]["fraud_score"],
            "risk_level": c["fraud_scoring"]["risk_level"],
            "verdict": c["fraud_scoring"]["verdict"],
            "sender": c["sender"]["email"],
            "origin_ip": c.get("origin_ip"),
            "country": c["geolocation"].get("country")
        })
    return summary_list


@app.get("/api/cases/{case_id}")
def get_case(case_id: str):
    """Fetch full forensic report of an analyzed case."""
    if case_id not in analyzed_cases:
        raise HTTPException(status_code=404, detail="Case ID not found")
    return analyzed_cases[case_id]


@app.get("/api/campaigns/graph")
def get_campaign_graph():
    """Retrieve the NetworkX threat attribution & infrastructure correlation graph."""
    return correlation.graph_manager.export_graph_json()


@app.post("/api/report/export")
def export_evidentiary_report(req: ReportExportRequest):
    """
    Generate verifiable evidentiary report fulfilling legal and compliance standards.
    Supports PII masking toggle to redact sensitive names/emails.
    """
    if req.case_id not in analyzed_cases:
        raise HTTPException(status_code=404, detail="Case ID not found")
    case = dict(analyzed_cases[req.case_id])
    
    sender_email = case["sender"]["email"]
    recipient_email = case["to"]
    display_name = case["sender"]["display_name"]
    
    if req.mask_pii:
        def mask_str(s: str) -> str:
            if not s:
                return s
            if "@" in s:
                user, domain = s.split("@", 1)
                return (user[0] + "***@" + domain) if len(user) > 1 else "***@" + domain
            return s[:2] + "***" if len(s) > 2 else "***"
        sender_email = mask_str(sender_email)
        recipient_email = mask_str(recipient_email)
        display_name = mask_str(display_name)

    return {
        "report_id": f"FORENSIC-TRACEMAIL-{req.case_id.upper()}",
        "evidence_sha256": case["sha256_hash"],
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "standards_compliance": ["RFC 5322", "RFC 7208 (SPF)", "RFC 6376 (DKIM)", "RFC 7489 (DMARC)", "NIST SP 800-86 (Digital Forensics)"],
        "chain_of_custody": {
            "ingestion_timestamp": case["timestamp"],
            "hash_algorithm": "SHA-256",
            "evidence_digest": case["sha256_hash"],
            "pii_redacted": req.mask_pii,
            "engine_version": "TraceMail 2.0.0-SIH26106"
        },
        "investigator_notes": req.investigator_notes or "Standard automated forensic triage.",
        "case_summary": {
            "case_id": req.case_id,
            "subject": case["subject"],
            "sender_display_name": display_name,
            "sender_address": sender_email,
            "recipient": recipient_email,
            "origin_ip": case.get("origin_ip"),
            "geolocation": case["geolocation"],
            "domain_intel": case["domain_intel"],
            "fraud_score": case["fraud_scoring"]["fraud_score"],
            "verdict": case["fraud_scoring"]["verdict"],
            "risk_level": case["fraud_scoring"]["risk_level"],
            "score_breakdown": case["fraud_scoring"]["breakdown"],
            "relay_hops": case["relay_hops"]
        }
    }
