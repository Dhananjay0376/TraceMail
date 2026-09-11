import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    resp = client.get(\"/health\")
    assert resp.status_code == 200
    assert resp.json()[\"status\"] == \"healthy\"

def test_classify_phishing():
    payload = {\"text\": \"URGENT: Your bank account will be suspended in 24 hours. Verify your account immediately.\"}
    resp = client.post(\"/classify\", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert \"label\" in data
    assert \"confidence\" in data

def test_analyze_raw_text():
    sample_email = \"\"\"From: security@paypal-verification.com
Return-Path: bounce@attacker-vps.net
Subject: Urgent: Verify Account
Received: from mail.attacker-vps.net (198.51.100.24) by mx.google.com with ESMTPS; Fri, 11 Sep 2026 10:00:00 -0000

Dear customer, your account has been suspended. Please click here to login.\"\"\"
    resp = client.post(\"/analyze\", data={\"raw_text\": sample_email})
    assert resp.status_code == 200
    data = resp.json()
    assert \"id\" in data
    assert \"detection\" in data
    assert \"headers\" in data
    assert \"fraud_score\" in data
    assert data[\"fraud_score\"][\"score\"] > 0
