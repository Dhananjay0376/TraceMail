import os
import uuid
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

from app.schemas import (
    AnalyzeResponse, ClassifyRequest, DetectionResult, HeaderDetails,
    AuthResults, RelayHop, DomainIntel, FraudScoreBreakdown, CampaignMatch
)
from app.detection import classify_email
from app.forensics import parse_eml_bytes, extract_hops, check_authentication_records
from app.geointel import geolocate_ip, domain_intel
from app.correlation import compute_fraud_score, record_and_correlate

app = FastAPI(
    title=\"TraceMail Forensics & Intelligence API\",
    description=\"AI-Powered Email Threat Detection, Geolocation & Forensic Intelligence Platform (SIH 2026 - PS26106)\",
    version=\"1.0.0\"
)

# Enable CORS for local and deployed frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"*\"],
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

# In-memory past analysis store
_analyzed_cases: List[AnalyzeResponse] = []

@app.get(\"/health\")
def health_check():
    return {
        \"status\": \"healthy\",
        \"timestamp\": datetime.utcnow().isoformat(),
        \"service\": \"TraceMail Backend Engine\"
    }

@app.post(\"/classify\", response_model=DetectionResult)
def classify_text_endpoint(req: ClassifyRequest):
    \"\"\"Quick text-only classification endpoint for subject and body.\"\"\"
    result = classify_email(req.text)
    return DetectionResult(**result)

@app.post(\"/analyze\", response_model=AnalyzeResponse)
async def analyze_email_endpoint(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    \"\"\"
    Full forensic analysis endpoint:
    Parses .eml headers, runs ML detection, checks SPF/DKIM/DMARC,
    geolocates relay path, performs WHOIS lookup, and calculates the explainable fraud score.
    \"\"\"
    case_id = f\"CASE-{uuid.uuid4().hex[:8].upper()}\"
    timestamp = datetime.utcnow().isoformat()

    if file:
        content = await file.read()
    elif raw_text:
        content = raw_text.encode(\"utf-8\")
    else:
        raise HTTPException(status_code=400, detail=\"Either an .eml file or raw_text is required.\")

    # 1. Header and MIME parsing
    parsed = parse_eml_bytes(content)
    body_text = parsed.get(\"body\") or \"\"

    # 2. NLP / ML Text Classification
    text_to_classify = f\"{parsed.get('subject', '')} {body_text}\".strip() or \"No body text\"
    detection_raw = classify_email(text_to_classify)
    detection = DetectionResult(**detection_raw)

    # 3. Relay path & IP extraction
    hop_ips = extract_hops(parsed.get(\"received_chain\", []))
    
    # 4. Domain & Auth checks
    from_header = parsed.get(\"from\", \"\")
    sender_domain = from_header.split(\"@\")[-1].rstrip(\">\").strip() if \"@\" in from_header else \"\"
    return_path = parsed.get(\"return_path\", \"\")
    return_domain = return_path.split(\"@\")[-1].rstrip(\">\").strip() if \"@\" in return_path else \"\"
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
            city=geo.get(\"city\"),
            region=geo.get(\"region\"),
            country=geo.get(\"country\"),
            org=geo.get(\"org\"),
            lat=geo.get(\"lat\"),
            lon=geo.get(\"lon\"),
            is_origin=(idx == 0),
            is_hosting=geo.get(\"is_hosting\", False)
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
        is_phishing_label=(detection.label in [\"Phishing\", \"Suspicious\", \"BEC\"]),
        spf_status=auth_results.spf_status,
        dkim_status=auth_results.dkim_status,
        dmarc_status=auth_results.dmarc_status,
        domain_age_days=dom_age,
        is_hosting_ip=origin_is_hosting,
        sender_return_path_mismatch=mismatch
    )
    fraud_score = FraudScoreBreakdown(**score_dict)

    # 8. Campaign graph matching
    campaign_raw = record_and_correlate(
        case_id=case_id,
        domain=sender_domain,
        originating_ip=origin_hop.ip if origin_hop else None
    )
    campaign = CampaignMatch(**campaign_raw) if campaign_raw else None

    response = AnalyzeResponse(
        id=case_id,
        timestamp=timestamp,
        detection=detection,
        headers=HeaderDetails(
            from_header=parsed.get(\"from\"),
            return_path=parsed.get(\"return_path\"),
            reply_to=parsed.get(\"reply_to\"),
            message_id=parsed.get(\"message_id\"),
            subject=parsed.get(\"subject\"),
            date=parsed.get(\"date\"),
            auth_results=auth_results,
            received_chain=parsed.get(\"received_chain\", [])
        ),
        trace=trace_hops,
        domain_intel=dom_intel,
        fraud_score=fraud_score,
        campaign=campaign,
        raw_body_preview=body_text[:400] + (\"...\" if len(body_text) > 400 else \"\")
    )

    _analyzed_cases.insert(0, response)
    return response

@app.get(\"/cases\", response_model=List[AnalyzeResponse])
def list_cases():
    \"\"\"Returns recent analyzed cases for the analyst dashboard history.\"\"\"
    return _analyzed_cases[:20]
