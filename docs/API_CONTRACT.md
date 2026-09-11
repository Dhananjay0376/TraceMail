# TraceMail — API Contract & Data Specification

This document defines the contract between the **Backend API (FastAPI)** and the **Frontend Dashboard (React)**, as well as the sub-module interfaces for **ML Detection**, **Header Forensics**, and **Geo/WHOIS Intelligence**.

---

## 1. Endpoints

### GET /health
* **Purpose**: Verifies that the API service is alive.
* **Response**:
`json
{
  \"status\": \"healthy\",
  \"timestamp\": \"2026-09-11T07:15:00Z\",
  \"service\": \"TraceMail Backend Engine\"
}
`

---

### POST /classify
* **Purpose**: Fast text-only classification for subject/body text.
* **Request**:
`json
{
  \"text\": \"Urgent: Your account is suspended. Verify credentials now.\"
}
`
* **Response**:
`json
{
  \"label\": \"Phishing\",
  \"confidence\": 0.942,
  \"model_version\": \"DistilBERT-FineTuned\"
}
`

---

### POST /analyze
* **Purpose**: Full end-to-end forensic analysis of raw email (.eml file upload or raw multipart form text).
* **Request**: Multipart Form Data (ile: UploadFile or aw_text: string)
* **Response (Schema: AnalyzeResponse)**:
`json
{
  \"id\": \"CASE-A1B2C3D4\",
  \"timestamp\": \"2026-09-11T07:15:00Z\",
  \"detection\": {
    \"label\": \"Phishing\",
    \"confidence\": 0.92,
    \"model_version\": \"DistilBERT-FineTuned\"
  },
  \"headers\": {
    \"from_header\": \"security@bank-alert.com\",
    \"return_path\": \"bounce@attacker-vps.net\",
    \"reply_to\": \"collector@phish-node.org\",
    \"message_id\": \"<202609110830.abc@vps.net>\",
    \"subject\": \"Urgent: Account Suspended\",
    \"date\": \"Fri, 11 Sep 2026 08:30:00 +0000\",
    \"auth_results\": {
      \"spf_status\": \"fail\",
      \"dkim_status\": \"fail\",
      \"dmarc_status\": \"fail\",
      \"spf_record\": \"v=spf1 -all\",
      \"dmarc_record\": \"v=DMARC1; p=reject;\"
    },
    \"received_chain\": [
      \"from vps.attacker.net (194.135.25.40) by mx.google.com ...\"
    ]
  },
  \"trace\": [
    {
      \"hop_index\": 1,
      \"ip\": \"194.135.25.40\",
      \"city\": \"Frankfurt\",
      \"region\": \"Hesse\",
      \"country\": \"DE\",
      \"org\": \"DigitalOcean VPS\",
      \"lat\": 50.1109,
      \"lon\": 8.6821,
      \"is_origin\": true,
      \"is_hosting\": true
    }
  ],
  \"domain_intel\": {
    \"domain\": \"bank-alert.com\",
    \"registrar\": \"NameCheap Inc.\",
    \"creation_date\": \"2026-09-07\",
    \"age_days\": 4,
    \"is_new_domain\": true,
    \"mx_records\": [\"mail.bank-alert.com\"]
  },
  \"fraud_score\": {
    \"score\": 92,
    \"risk_level\": \"Critical\",
    \"factors\": [
      {
        \"name\": \"NLP Model Threat Detection\",
        \"points\": 41.4,
        \"reason\": \"Text classification flagged high threat patterns (92% confidence)\"
      },
      {
        \"name\": \"SPF Authentication Failure\",
        \"points\": 10.0,
        \"reason\": \"Originating IP is not authorized by domain SPF record\"
      },
      {
        \"name\": \"Newly Registered Domain\",
        \"points\": 15.0,
        \"reason\": \"Sender domain was registered only 4 days ago\"
      },
      {
        \"name\": \"Origin from Cloud / VPS Relay\",
        \"points\": 10.0,
        \"reason\": \"Earliest hop originates from a VPS/cloud hosting network\"
      }
    ]
  },
  \"campaign\": {
    \"campaign_id\": \"CMP-4092\",
    \"shared_ip\": \"194.135.25.40\",
    \"shared_domain\": \"bank-alert.com\",
    \"related_cases_count\": 2
  },
  \"raw_body_preview\": \"Dear customer, your account has been suspended...\"
}
`
"@ -Encoding utf8

Set-Content -Path "docs/TEAM_PLAYBOOK.md" -Value @"
# TraceMail — 4-Member Team Playbook & Git Workflow

## 1. Branch Strategy

| Member Role | Git Branch Name | Working Directory Scope |
| :--- | :--- | :--- |
| **Member 1: ML Model Training** | eature/ml-model | 
otebooks/, model/, ackend/app/detection.py |
| **Member 2: Backend & Integration** | eature/backend-api | ackend/app/main.py, ackend/app/correlation.py, ackend/tests/ |
| **Member 3: Forensics & Geo Intel** | eature/forensics-geointel | ackend/app/forensics.py, ackend/app/geointel.py, data/ |
| **Member 4: Frontend & Visualization** | eature/frontend-dashboard | rontend/ |

---

## 2. Playbook for Each Team Member

### 👨‍💻 Member 1: ML & NLP Lead (eature/ml-model)
* **Objective**: Train the TF-IDF baseline and fine-tune DistilBERT on Google Colab, export weights to model/sih26106-model/, and update ackend/app/detection.py.
* **Dataset**: Kaggle subhajournal/phishingemails (Binary classification: Safe vs. Phishing).
* **Key Steps**:
  1. Open Google Colab, mount GPU (T4).
  2. Train baseline TF-IDF + LogisticRegression first for quick baseline comparison numbers.
  3. Fine-tune distilbert-base-uncased (3 epochs, learning_rate=2e-5).
  4. Generate confusion matrix, precision, recall, and F1 metrics for the pitch deck.
  5. Save model locally and push to Hugging Face Hub (	rainer.save_model('./sih26106-model')).

---

### ⚙️ Member 2: Backend & API Integration (eature/backend-api)
* **Objective**: Coordinate FastAPI endpoints, implement the explainable fraud scoring algorithm and NetworkX campaign graph correlation.
* **Key Steps**:
  1. Maintain ackend/app/main.py and ackend/app/schemas.py.
  2. Implement the weighted fraud scoring formula in ackend/app/correlation.py.
  3. Wire in detection.py, orensics.py, and geointel.py as they become available from other branches.
  4. Run automated tests: pytest backend/tests/test_api.py.

---

### 🔍 Member 3: Header Forensics & Geo/Domain Intel (eature/forensics-geointel)
* **Objective**: Build robust MIME email parser, relay hop IP extractor, SPF/DKIM/DMARC validation, and WHOIS/IPinfo integration.
* **Key Steps**:
  1. Implement ackend/app/forensics.py: parse Received header chain in reverse order to identify the earliest originating IP node.
  2. Add cryptographic DKIM verification using dkimpy and SPF/DMARC lookups via checkdmarc.
  3. Implement ackend/app/geointel.py: IP geolocation via IPinfo API, WHOIS domain registration date/age calculation, and DNS MX cross-checking.
  4. Validate against real samples in data/sample/.

---

### 🎨 Member 4: Frontend Dashboard & Maps (eature/frontend-dashboard)
* **Objective**: Build the interactive analyst dashboard in React + Vite with Leaflet map visualization and fraud score breakdown.
* **Key Steps**:
  1. Work inside rontend/. Run 
pm install and 
pm run dev.
  2. Build and polish UploadPanel.jsx, FraudScoreCard.jsx, HeaderTrace.jsx, GeoMap.jsx, and CaseList.jsx.
  3. Test with the mock API response first, then connect directly to http://localhost:8000/analyze.
  4. Verify the Leaflet map smoothly plots hops and renders the originating server in red.
