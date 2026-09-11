"""
TraceMail Unit Tests for Forensics & Geo Intel Modules (Sandeep's Task 5)
Verifies EML parsing, relay hop reconstruction, authentication/anomaly detection,
IP geolocation, and domain WHOIS/MX intelligence.
"""

import pytest
from app import forensics, geointel

SAMPLE_RAW_EML = b"""From: "Reserve Bank Alert" <security@reservebank-online-verify.com>
To: target@company.com
Subject: URGENT: Account Suspension Notice
Date: Wed, 09 Sep 2026 12:00:00 +0000
Message-ID: <alert123@reservebank-online-verify.com>
Return-Path: <bounces@phish-server.ru>
Reply-To: <credentials@stealer-domain.xyz>
Authentication-Results: mx.google.com; spf=fail; dkim=fail; dmarc=fail
Received: from mail.company.com ([10.0.0.1]) by recipient.internal; Wed, 09 Sep 2026 12:00:10 +0000
Received: from rogue.bulletproof.ru ([185.220.101.5]) by mail.company.com; Wed, 09 Sep 2026 12:00:05 +0000

Dear Customer, your bank account has been flagged. Click here immediately to verify.
"""


def test_parse_eml_bytes_structure():
    """Task 1: Verify EML raw byte parsing into structured forensic metadata."""
    parsed = forensics.parse_eml_bytes(SAMPLE_RAW_EML)
    assert len(parsed["sha256_hash"]) == 64
    assert parsed["from"]["display_name"] == "Reserve Bank Alert"
    assert parsed["from"]["email"] == "security@reservebank-online-verify.com"
    assert parsed["return_path"] == "<bounces@phish-server.ru>"
    assert "credentials@stealer-domain.xyz" in parsed["reply_to"]
    assert "account has been flagged" in parsed["body_text"]


def test_extract_relay_hops():
    """Task 2: Verify relay path reconstruction from Received headers."""
    headers = [
        "from mail.company.com ([10.0.0.1]) by recipient.internal; Wed, 09 Sep 2026 12:00:10 +0000",
        "from rogue.bulletproof.ru ([185.220.101.5]) by mail.company.com; Wed, 09 Sep 2026 12:00:05 +0000"
    ]
    hops, origin_ip = forensics.extract_relay_hops(headers)
    assert len(hops) == 2
    assert origin_ip == "185.220.101.5"
    assert hops[0]["ip"] == "185.220.101.5"
    assert hops[0]["hop_number"] == 1


def test_detect_header_anomalies():
    """Task 3: Verify detection of Return-Path mismatch, Reply-To mismatch, and display name spoofing."""
    anomalies = forensics.detect_header_anomalies(
        sender_name="Reserve Bank Alert",
        sender_email="security@fake-domain.com",
        return_path="<bounces@other-domain.com>",
        reply_to="<phish@stealer.com>",
        origin_ip="185.220.101.5"
    )
    assert anomalies["reply_to_mismatch"] is True
    assert anomalies["return_path_mismatch"] is True
    assert anomalies["display_name_spoofing"] is True
    assert len(anomalies["anomaly_flags"]) >= 3


def test_geolocate_ip_intelligence():
    """Task 4a: Verify IP geolocation, ASN classification, and fallback handling."""
    # Test public hosting IP (from demo fallback)
    geo_ru = geointel.geolocate_ip("185.220.101.5")
    assert geo_ru["country"] == "Russia"
    assert geo_ru["is_hosting"] is True

    # Test local/private IP handling
    geo_private = geointel.geolocate_ip("127.0.0.1")
    assert geo_private["country"] == "Unknown"
    assert geo_private["is_hosting"] is False


def test_domain_intel_whois_and_mx():
    """Task 4b: Verify WHOIS domain age resolution and MX record checks."""
    # Test newly registered phishing domain
    dom_new = geointel.domain_intel("reservebank-online-verify.com")
    assert dom_new["is_new_domain"] is True
    assert dom_new["domain_age_days"] < 30
    assert dom_new["has_mx"] is True

    # Test established domain
    dom_old = geointel.domain_intel("corporate-apex.in")
    assert dom_old["is_new_domain"] is False
    assert dom_old["domain_age_days"] > 365
