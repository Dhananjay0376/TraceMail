import os
import uuid
import asyncio
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from app.schemas import (
    AnalyzeResponse, ClassifyRequest, DetectionResult, HeaderDetails,
    AuthResults, RelayHop, DomainIntel, FraudScoreBreakdown, CampaignMatch,
    EvidenceSeal, URLThreatDetails, AttachmentDetails, CampaignGraphResponse,
    PredictRequest, PredictResponse
)
from app.services.tfidf_predictor import get_tfidf_predictor
from app.services.distilbert_predictor import get_distilbert_predictor
from app.services import ml_service
from app.detection import classify_email
from app.forensics import parse_eml_bytes, extract_hops, check_authentication_records
from app.geointel import geolocate_ip, domain_intel
from app.correlation import compute_fraud_score, record_and_correlate, get_campaign_graph_data, rehydrate_graph_from_db
from app.database import init_db, save_case, get_all_cases, get_case_by_id, get_all_campaigns
from app.auth import router as auth_router
from app.mailbox_worker import router as mailbox_router, background_mailbox_sync_loop

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes SQLite schema, rehydrates graph, preloads ML models, and starts real-time mailbox background worker."""
    init_db()
    existing_cases = get_all_cases(limit=100)
    rehydrate_graph_from_db(existing_cases)

    # Preload the TF-IDF model once at application startup
    tfidf_predictor = get_tfidf_predictor()
    tfidf_predictor.load()

    # DistilBERT model preloading disabled at startup to prevent Windows PyTorch C++ DLL crashes
    # Falling back smoothly to TF-IDF baseline + NLP heuristics engine
    pass
    
    # Launch automated background mailbox watcher loop
    sync_task = asyncio.create_task(background_mailbox_sync_loop(poll_interval_seconds=15))
    try:
        yield
    finally:
        sync_task.cancel()

app = FastAPI(
    title="TraceMail Forensics & Intelligence API",
    description="AI-Powered Email Threat Detection, Geolocation & Forensic Intelligence Platform (SIH 2026 - PS26106)",
    version="1.3.0",
    lifespan=lifespan
)

# Enable CORS for local and deployed frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(auth_router)
app.include_router(mailbox_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "TraceMail Backend Engine",
        "version": "1.3.0"
    }

@app.post("/classify", response_model=DetectionResult)
def classify_text_endpoint(req: ClassifyRequest):
    """Quick text-only classification endpoint for subject and body."""
    result = classify_email(req.text)
    return DetectionResult(**result)

@app.post("/predict", response_model=PredictResponse)
def predict_endpoint(req: PredictRequest):
    """
    Multi-model email threat prediction endpoint.
    Runs both TF-IDF and DistilBERT 3-class models, returns per-model
    predictions plus a combined NLP analysis.
    """
    text = req.get_content()
    if not text:
        raise HTTPException(status_code=400, detail="Field 'email_text' or 'text' must not be empty.")

    try:
        result = ml_service.predict_all(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_email_endpoint(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    """
    Full forensic analysis endpoint:
    - Computes cryptographic SHA-256 evidence chain-of-custody seal
    - Parses RFC-822 MIME headers and multi-part bodies
    - Extracts and analyzes embedded URLs & attachments
    - Validates SPF, DKIM, and DMARC protocol alignment
    - Reconstructs server relay hops and geolocates originating IP
    - Executes WHOIS domain age and DNS MX cross-checks
    - Calculates transparent, explainable fraud risk score
    - Persists investigation into SQLite and updates NetworkX campaign graph
    """
    case_id = f"CASE-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now(timezone.utc).isoformat()

    if file:
        content = await file.read()
    elif raw_text:
        content = raw_text.encode("utf-8")
    else:
        raise HTTPException(status_code=400, detail="Either an .eml file or raw_text is required.")

    # 1. Header, MIME, URL, Attachment & Evidence Seal parsing
    parsed = parse_eml_bytes(content)
    body_text = parsed.get("body") or ""
    evidence_seal = EvidenceSeal(**parsed["evidence_seal"])
    extracted_urls = [URLThreatDetails(**u) for u in parsed.get("extracted_urls", [])]
    attachments = [AttachmentDetails(**a) for a in parsed.get("attachments", [])]

    # 2. NLP / ML Text Threat Classification
    text_to_classify = f"{parsed.get('subject', '')} {body_text}".strip() or "No body text"
    detection_raw = classify_email(text_to_classify)
    detection = DetectionResult(**detection_raw)

    # 3. Relay path & IP extraction
    hop_ips = extract_hops(parsed.get("received_chain", []))
    
    # 4. Domain & Auth checks
    from_header = parsed.get("from", "")
    sender_domain = from_header.split("@")[-1].rstrip(">").strip() if "@" in from_header else ""
    return_path = parsed.get("return_path", "")
    return_domain = return_path.split("@")[-1].rstrip(">").strip() if "@" in return_path else ""
    mismatch = bool(sender_domain and return_domain and sender_domain.lower() != return_domain.lower())

    auth_raw = check_authentication_records(sender_domain, content)
    auth_results = AuthResults(**auth_raw)

    # 5. Geolocation for relay hops
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

    # 6. WHOIS & DNS Intel
    dom_intel_raw = domain_intel(sender_domain) if sender_domain else None
    dom_intel = DomainIntel(**dom_intel_raw) if dom_intel_raw else None

    # 7. Correlation & Fraud Score
    origin_hop = trace_hops[0] if trace_hops else None
    origin_is_hosting = origin_hop.is_hosting if origin_hop else False
    dom_age = dom_intel.age_days if dom_intel else None

    score_dict = compute_fraud_score(
        model_prob=detection.confidence,
        is_phishing_label=(detection.label in ["Phishing", "Suspicious", "BEC"]),
        spf_status=auth_results.spf_status,
        dkim_status=auth_results.dkim_status,
        dmarc_status=auth_results.dmarc_status,
        domain_age_days=dom_age,
        is_hosting_ip=origin_is_hosting,
        sender_return_path_mismatch=mismatch,
        extracted_urls=[u.model_dump() for u in extracted_urls],
        attachments=[a.model_dump() for a in attachments]
    )
    fraud_score = FraudScoreBreakdown(**score_dict)

    # 8. Campaign graph matching
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
        extracted_urls=extracted_urls,
        attachments=attachments,
        fraud_score=fraud_score,
        campaign=campaign,
        raw_body_preview=body_text[:400] + ("..." if len(body_text) > 400 else "")
    )

    # 9. Persist to SQLite Database
    save_case(response.model_dump())

    return response

@app.get("/cases", response_model=List[AnalyzeResponse])
def list_cases():
    """Returns recent analyzed cases from the SQLite persistent database."""
    return get_all_cases(limit=30)

@app.get("/cases/{case_id}", response_model=AnalyzeResponse)
def get_case(case_id: str):
    """Fetches a specific investigation case by ID."""
    case = get_case_by_id(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.get("/campaign-graph", response_model=CampaignGraphResponse)
def campaign_graph_endpoint():
    """Returns the full interconnected threat graph (nodes & edges) for network visualization."""
    return get_campaign_graph_data()

@app.get("/campaigns", response_model=List[Dict[str, Any]])
def list_campaigns():
    """Returns all multi-target campaigns discovered across cases."""
    return get_all_campaigns()
