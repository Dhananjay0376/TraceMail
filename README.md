# TraceMail 🛡️
### AI-Powered Email Threat Detection, Origin GeoLocation & Forensic Intelligence Platform
**Smart India Hackathon 2026 | Problem Statement: SIH26106 | Sponsor: AICTE**

TraceMail is a next-generation cybersecurity platform designed to protect organizations from phishing, spoofed identities, Business Email Compromise (BEC), and infrastructure evasion. Beyond conventional spam filtering, TraceMail performs deep RFC 5322 header forensics, reconstructs relay transit paths, geolocates originating mail infrastructure, and models cross-case threat intelligence using graph correlation.

---

## 🌟 Key Pillars & Capabilities

1. **Dual-Engine AI / NLP Threat Detection**:
   - **Transformer Engine**: Fine-tuned DistilBERT model (`Dhananjay-N/tracemail-distilbert-phishing-v2`) providing deep contextual text classification.
   - **Local High-Performance Baseline**: Serialized TF-IDF + Logistic Regression classifier (`Model/baseline_model.pkl` & `baseline_vectorizer.pkl`) ensuring instant CPU inference and 100% offline demo resilience.
   - **BEC & Social Engineering Heuristics**: Extracts financial urgency cues (wire transfers, overdue invoices, confidential payment cutoff, executive title impersonation).

2. **Email Header & Protocol Forensics**:
   - RFC 5322 MIME parsing of `From`, `Return-Path`, `Reply-To`, `Message-ID`, and `Received` chains.
   - Chronological relay path reconstruction (from oldest origin MTA to recipient).
   - Transit latency delay calculation between hops.
   - Protocol authentication checks: **SPF**, **DKIM** cryptographic signature validation via `dkimpy`, and **DMARC** alignment.
   - Identity anomaly detection (display-name spoofing, `Reply-To` mismatch, and `Return-Path` bounce divergence).

3. **Origin Traceability & Domain Intelligence**:
   - Origin IP geolocation (Country, City, Coordinates, ISP, ASN).
   - Datacenter / Bulletproof VPS infrastructure detection (AWS, DigitalOcean, Hetzner, OVH, etc.).
   - WHOIS domain age computation (flagging high-risk lookalike domains registered `< 30 days` ago).
   - DNS MX record consistency verification.

4. **NetworkX Campaign Correlation & Explainable Fraud Scoring**:
   - **Explainable 0–100 Fraud Score Matrix**: Transparent point-by-point breakdown (ML risk, SPF fail, DKIM fail, DMARC fail, domain age, hosting IP, spoofing divergence, BEC urgency).
   - **Multi-Case Campaign Graph**: In-memory NetworkX directed graph linking Cases, IPs, Domains, and Senders to detect coordinated multi-target attacks sharing bulletproof infrastructure.

5. **Chain of Custody & Evidentiary Standards**:
   - SHA-256 cryptographic digest of raw email.
   - PII masking toggle for data privacy compliance.
   - Printable / exportable forensic incident evidence report.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+ (accessible via `py` on Windows)
- **Node.js**: v18+ (v22 recommended) and `npm`

### 1. Start the Backend API (FastAPI)
```powershell
# Open Terminal 1
cd "D:\TraceMail demo"
$env:PYTHONPATH = "backend"
py -m uvicorn app.main:app --reload --port 8000
```
- API will start at: `http://localhost:8000`
- Interactive Swagger API Documentation: `http://localhost:8000/docs`

### 2. Start the Frontend Dashboard (React + Vite)
```powershell
# Open Terminal 2
cd "D:\TraceMail demo/frontend"
npm run dev
```
- Open your browser at: `http://localhost:5173`

---

## 🧪 Pre-Loaded 1-Click Demo Scenarios

The platform includes 5 curated test cases in `data/sample/` that can be loaded with **1 click** from the dashboard:

| # | Scenario | Highlights | Expected Risk |
|---|---|---|---|
| **1** | **RBI KYC Phishing** | Origin: Moscow bulletproof VPS (`185.220.101.5`), SPF/DKIM fail, urgent account freeze, lookalike domain (`3 days old`). | **CRITICAL (90–98)** |
| **2** | **CEO Wire Transfer (BEC)** | Origin: Amsterdam DigitalOcean VPS (`159.65.112.44`), CEO display name spoof, `Reply-To` mismatch to fresh lookalike domain (`5 days old`), invoice wire request. | **CRITICAL (85–92)** |
| **3** | **Legitimate Internal Update** | Origin: Mumbai corporate network, passing SPF/DKIM, legitimate MX, mature domain (`6 years old`). | **SAFE (< 25)** |
| **4** | **Forwarded Borderline Mail** | Mailing list forward showing SPF softfail but valid DKIM signature and established domain. Demonstrates explainable scoring nuance. | **SUSPICIOUS (45–55)** |
| **5** | **IT Helpdesk Phish (Campaign Link)** | Corporate password expiry lure sharing the **EXACT SAME rogue IP (`185.220.101.5`) and Reply-To collector** as Sample #1. Open the **Campaign Correlation** tab to see NetworkX automatically cluster these two attacks into a coordinated campaign! | **CRITICAL (90–98)** |

---

## 📊 Automated Testing

To run the full test suite verifying forensics parsing, detection models, geointel, and REST endpoints:
```powershell
$env:PYTHONPATH = "backend"
py -m pytest backend/tests -v
```
*(All 12 automated unit and integration tests pass successfully).*
