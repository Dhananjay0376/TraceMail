"""
Tests for TraceMail FastAPI REST Endpoints
"""

import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "TraceMail AI Forensics API"


def test_get_samples_endpoint():
    resp = client.get("/api/samples")
    assert resp.status_code == 200
    samples = resp.json()
    assert len(samples) == 5
    assert samples[0]["id"] == "sample-1"


def test_get_sample_content():
    resp = client.get("/api/samples/sample-1")
    assert resp.status_code == 200
    data = resp.json()
    assert "reservebank" in data["raw_eml"]


def test_cases_preloaded():
    resp = client.get("/api/cases")
    assert resp.status_code == 200
    cases = resp.json()
    assert len(cases) >= 5


def test_campaign_graph_endpoint():
    resp = client.get("/api/campaigns/graph")
    assert resp.status_code == 200
    graph = resp.json()
    assert "nodes" in graph
    assert "links" in graph
    assert "campaigns" in graph
    assert len(graph["campaigns"]) >= 1


def test_analyze_with_raw_eml():
    raw_email = """From: "Bank Alert" <security@fake-bank.biz>
To: target@company.com
Subject: Immediate Account Action Required
Date: Wed, 09 Sep 2026 12:00:00 +0000
Message-ID: <test1234@fake-bank.biz>
Received: from rogue.vps.net ([185.220.101.5]) by mail.company.com; Wed, 09 Sep 2026 12:00:05 +0000

Dear User, your account is suspended. Click immediately to update your credentials.
"""
    resp = client.post("/api/analyze", data={"raw_eml": raw_email})
    assert resp.status_code == 200
    data = resp.json()
    assert "case_id" in data
    assert data["fraud_scoring"]["fraud_score"] >= 60


def test_export_evidentiary_report():
    cases_resp = client.get("/api/cases")
    case_id = cases_resp.json()[0]["case_id"]

    resp = client.post("/api/report/export", json={"case_id": case_id, "mask_pii": True})
    assert resp.status_code == 200
    report = resp.json()
    assert "FORENSIC-TRACEMAIL-" in report["report_id"]
    assert "chain_of_custody" in report
    assert report["chain_of_custody"]["pii_redacted"] is True
