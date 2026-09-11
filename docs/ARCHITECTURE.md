# TraceMail Architecture Specification

## End-to-End System Pipeline

`
 [ Ingested Raw .EML / Text ]
              │
              ▼
   ┌──────────────────────┐
   │    FastAPI Server    │
   └──────────┬───────────┘
              │
   ┌──────────┴────────────────────────┐
   │ Multi-Dimensional Threat Engine   │
   ├───────────────────────────────────┤
   │ 1. NLP / DistilBERT Detector      │ ──► Text classification & urgency detection
   │ 2. Email Header Forensics Parser  │ ──► Received hops, SPF/DKIM/DMARC status
   │ 3. Geo & WHOIS Threat Intel       │ ──► IP geolocation, hosting ASN, domain age
   └──────────┬────────────────────────┘
              │
              ▼
   ┌───────────────────────────────────┐
   │ Correlation & Fraud Score Engine  │
   │ - Explainable Weighted Scoring    │
   │ - NetworkX Multi-Case Link Graph  │
   └──────────┬────────────────────────┘
              │
              ▼
   ┌───────────────────────────────────┐
   │ React + Leaflet Analyst Dashboard │
   │ - Visual Relay Trace Map          │
   │ - Header Forensic Breakdown       │
   │ - Case History & Campaign Alerts  │
   └───────────────────────────────────┘
`
"@ -Encoding utf8

Set-Content -Path "README.md" -Value @"
# TraceMail — AI-Powered Email Threat Detection, Geolocation & Forensic Intelligence Platform

> **Smart India Hackathon 2026 (SIH 2026) — Problem Statement PS26106**  
> *Theme: Blockchain & Cybersecurity | Sponsoring Organization: AICTE*

---

## 📌 Project Overview
TraceMail is a digital forensics and threat intelligence platform designed to uncover sophisticated email attacks, including Business Email Compromise (BEC), spoofing, impersonation, and phishing campaigns. Unlike traditional spam filters that only inspect content keywords, TraceMail combines:
1. **Transformer-based NLP (DistilBERT)** to detect deceptive language, urgency cues, and impersonation.
2. **Email Header Forensics** to validate SPF, DKIM, and DMARC protocol alignment and reconstruct SMTP relay hops.
3. **IP Geolocation & Domain Intelligence (WHOIS/DNS)** to pinpoint the originating server infrastructure and identify burner domains.
4. **Graph-based Correlation (NetworkX)** to connect multiple incidents sharing infrastructure into unified campaign investigations.
5. **Interactive Analyst Dashboard (React + Leaflet)** with visual map tracing and explainable confidence scoring.

---

## 🚀 Repository Structure

`
TraceMail/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── main.py           # Core FastAPI API routes (/analyze, /classify, /cases)
│   │   ├── schemas.py        # Pydantic data schemas
│   │   ├── detection.py      # DistilBERT model inference wrapper
│   │   ├── forensics.py      # MIME & header parsing, SPF/DKIM/DMARC validation
│   │   ├── geointel.py       # IP geolocation & WHOIS/DNS lookups
│   │   └── correlation.py    # NetworkX campaign graph & explainable fraud scoring
│   ├── tests/                # Pytest test suite
│   ├── requirements.txt      # Python dependencies
│   └── .env.example
├── frontend/                 # React + Vite Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadPanel.jsx     # File drag-and-drop & raw text input
│   │   │   ├── FraudScoreCard.jsx  # Score badge & explainable factor list
│   │   │   ├── HeaderTrace.jsx     # Headers & SPF/DKIM/DMARC badges
│   │   │   ├── GeoMap.jsx          # Leaflet geographic relay route map
│   │   │   └── CaseList.jsx        # Past analyzed cases & campaign history
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── notebooks/                # Google Colab / Kaggle training scripts
├── data/
│   ├── sample/               # Ground-truth sample .eml files
│   └── raw/                  # Large datasets (.gitignored)
├── docs/                     # Architecture, API contracts, and team playbook
└── README.md
`

---

## 👥 4-Member Team Branches & Responsibilities

| Role | Member Focus | Git Branch |
| :--- | :--- | :--- |
| **Member 1** | ML Model Training (TF-IDF baseline + DistilBERT) | eature/ml-model |
| **Member 2** | Backend API & Correlation Engine | eature/backend-api |
| **Member 3** | Email Header Forensics & Geo/Domain Intel | eature/forensics-geointel |
| **Member 4** | React Analyst Dashboard & Leaflet Mapping | eature/frontend-dashboard |

*Refer to [docs/TEAM_PLAYBOOK.md](docs/TEAM_PLAYBOOK.md) for individual task guides and [docs/API_CONTRACT.md](docs/API_CONTRACT.md) for data schemas.*

---

## 🛠️ Quick Start

### 1. Backend Setup
`ash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
`
*API docs available at: http://localhost:8000/docs*

### 2. Frontend Setup
`ash
cd frontend
npm install
npm run dev
`
*Dashboard available at: http://localhost:5173*
