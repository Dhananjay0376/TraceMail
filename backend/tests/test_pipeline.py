"""
TraceMail Backend Pipeline Tests
Validates Forensics Parsing, Detection Engine, GeoIntel, Scoring, and NetworkX Campaign Clustering.
"""

import os
import glob
import pytest
from app import forensics, geointel, detection, correlation

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "sample")


def test_sample_files_exist():
    """Verify all 5 sample .eml files are present."""
    samples = glob.glob(os.path.join(SAMPLE_DIR, "*.eml"))
    assert len(samples) >= 5, f"Expected at least 5 sample emails, found {len(samples)}"


def test_forensics_parsing():
    """Test MIME parsing, SHA-256 hash calculation, and relay hops extraction."""
    phishing_file = os.path.join(SAMPLE_DIR, "01_phishing_credential_theft.eml")
    with open(phishing_file, "rb") as f:
        raw = f.read()

    parsed = forensics.parse_eml_bytes(raw)
    assert len(parsed["sha256_hash"]) == 64
    assert "reservebank" in parsed["from"]["domain"]
    assert parsed["origin_ip"] == "185.220.101.5"
    assert parsed["hop_count"] >= 2
    assert parsed["anomalies"]["reply_to_mismatch"] is True
    assert parsed["anomalies"]["display_name_spoofing"] is True


def test_detection_engine():
    """Test ML detection prediction and BEC social engineering heuristics."""
    phishing_text = "URGENT: Your bank account will be suspended within 24 hours. Click here immediately to verify."
    res = detection.predict_text(phishing_text)
    assert res["prediction"] == "phishing"
    assert res["phishing_prob"] > 0.70
    assert "immediately" in res["bec_cues"]["urgency_keywords"]
    assert res["bec_cues"]["bec_heuristic_score"] > 0.20


def test_geointel_and_domain_intel():
    """Test IP geolocation and domain age intelligence."""
    geo = geointel.geolocate_ip("185.220.101.5")
    assert geo["country"] == "Russia"
    assert geo["is_hosting"] is True

    dom = geointel.domain_intel("reservebank-online-verify.com")
    assert dom["is_new_domain"] is True
    assert dom["domain_age_days"] < 30


def test_explainable_scoring_and_campaign_correlation():
    """Verify scoring logic and multi-case NetworkX campaign clustering."""
    samples = sorted(glob.glob(os.path.join(SAMPLE_DIR, "*.eml")))
    
    # Fresh graph manager for testing
    mgr = correlation.CampaignGraphManager()
    case_results = []

    for path in samples:
        with open(path, "rb") as f:
            raw = f.read()
        parsed = forensics.parse_eml_bytes(raw)
        ml_res = detection.predict_text(parsed["body_text"])
        geo = geointel.geolocate_ip(parsed["origin_ip"])
        dom = geointel.domain_intel(parsed["from"]["domain"])
        
        reply_dom = parsed["anomalies"]["reply_to_domain"]
        reply_intel = geointel.domain_intel(reply_dom) if reply_dom else None
        
        score_res = correlation.compute_fraud_score(
            model_prob=ml_res["phishing_prob"],
            spf_status=parsed["authentication"]["spf"],
            dkim_status=parsed["authentication"]["dkim"],
            dmarc_status=parsed["authentication"]["dmarc"],
            domain_age_days=dom["domain_age_days"],
            is_hosting_ip=geo.get("is_hosting", False),
            reply_to_mismatch=parsed["anomalies"]["reply_to_mismatch"],
            return_path_mismatch=parsed["anomalies"]["return_path_mismatch"],
            display_name_spoofing=parsed["anomalies"]["display_name_spoofing"],
            bec_cues=ml_res["bec_cues"],
            reply_domain_age_days=reply_intel["domain_age_days"] if reply_intel else None
        )
        
        case_id = parsed["sha256_hash"][:8]
        mgr.add_case(
            case_id=case_id,
            subject=parsed["subject"],
            fraud_score=score_res["fraud_score"],
            verdict=score_res["verdict"],
            sender_email=parsed["from"]["email"],
            sender_domain=parsed["from"]["domain"],
            reply_to_email=parsed["reply_to"],
            origin_ip=parsed["origin_ip"],
            hops=parsed["relay_hops"],
            geo=geo
        )
        case_results.append((os.path.basename(path), score_res["fraud_score"], score_res["risk_level"]))

    # Check that sample 1 and sample 5 (both phishing) score high
    scores = {name: score for name, score, _ in case_results}
    assert scores["01_phishing_credential_theft.eml"] >= 75
    assert scores["02_bec_executive_wire_transfer.eml"] >= 70
    assert scores["03_legitimate_internal_update.eml"] < 40  # Clean/safe
    assert scores["05_campaign_cluster_variant.eml"] >= 70

    # Verify campaign detection
    graph_export = mgr.export_graph_json()
    assert len(graph_export["campaigns"]) >= 1
    # Sample 1 and Sample 5 share rogue IP 185.220.101.5
    ip_campaigns = [c for c in graph_export["campaigns"] if "185.220.101.5" in c["threat_entity"]]
    assert len(ip_campaigns) == 1
    assert ip_campaigns[0]["case_count"] == 2
