import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

def test_classify_phishing():
    payload = {"text": "URGENT: Your bank account will be suspended in 24 hours. Verify your account immediately."}
    resp = client.post("/classify", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["label"] in ["Phishing", "Suspicious"]
    assert data["confidence"] > 0.5

def test_analyze_raw_text_with_urls_and_evidence():
    sample_email = """From: security@paypal-verification.com
Return-Path: bounce@attacker-vps.net
Reply-To: collector@shadowphish.org
Subject: Urgent: Verify Account Immediately
Received: from mail.attacker-vps.net (194.135.25.40) by mx.google.com with ESMTPS; Fri, 11 Sep 2026 10:00:00 -0000

Dear customer, your account has been suspended. Please click here to login:
http://194.135.25.40/login?token=abc"""

    resp = client.post("/analyze", data={"raw_text": sample_email})
    assert resp.status_code == 200
    data = resp.json()
    
    # 1. Evidence Seal Verification
    assert "evidence_seal" in data
    assert len(data["evidence_seal"]["sha256"]) == 64
    assert len(data["evidence_seal"]["md5"]) == 32
    assert data["evidence_seal"]["custody_status"] == "Verified & Immutable"

    # 2. Header & Forensic Verification
    assert data["headers"]["from_header"] == "security@paypal-verification.com"
    assert data["headers"]["return_path"] == "bounce@attacker-vps.net"
    assert len(data["trace"]) > 0
    assert data["trace"][0]["ip"] == "194.135.25.40"

    # 3. URL Threat Verification
    assert len(data["extracted_urls"]) > 0
    assert data["extracted_urls"][0]["is_ip_based"] is True

    # 4. Fraud Score Verification
    assert data["fraud_score"]["score"] >= 50
    assert data["fraud_score"]["risk_level"] in ["High", "Critical"]

def test_campaign_correlation_and_graph():
    # Ingest Email 1 sharing IP 198.51.100.99
    email_1 = """From: admin@company-verify.xyz
Subject: Invoice #1
Received: from relay.badnet.org (198.51.100.99) by mx.target1.com; Fri, 11 Sep 2026 09:00:00 -0000

Payment needed immediately."""
    resp1 = client.post("/analyze", data={"raw_text": email_1})
    assert resp1.status_code == 200

    # Ingest Email 2 sharing same IP 198.51.100.99
    email_2 = """From: billing@company-verify.xyz
Subject: Invoice #2
Received: from relay.badnet.org (198.51.100.99) by mx.target2.com; Fri, 11 Sep 2026 10:00:00 -0000

Wire transfer overdue."""
    resp2 = client.post("/analyze", data={"raw_text": email_2})
    assert resp2.status_code == 200
    data2 = resp2.json()

    # Campaign correlation check
    assert data2["campaign"] is not None
    assert data2["campaign"]["campaign_id"] is not None
    assert data2["campaign"]["shared_ip"] == "198.51.100.99"
    assert data2["campaign"]["related_cases_count"] >= 2

    # Query /campaign-graph endpoint
    graph_resp = client.get("/campaign-graph")
    assert graph_resp.status_code == 200
    graph_data = graph_resp.json()
    assert len(graph_data["nodes"]) > 0
    assert len(graph_data["edges"]) > 0
    assert graph_data["total_campaigns"] >= 1

def test_get_cases_and_by_id():
    resp = client.get("/cases")
    assert resp.status_code == 200
    cases = resp.json()
    assert len(cases) > 0
    
    first_id = cases[0]["id"]
    single_resp = client.get(f"/cases/{first_id}")
    assert single_resp.status_code == 200
    assert single_resp.json()["id"] == first_id

