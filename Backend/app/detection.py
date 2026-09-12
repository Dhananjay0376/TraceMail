"""
TraceMail Detection Engine
Combines Fine-Tuned DistilBERT with local TF-IDF + Logistic Regression Baseline
Augmented with Rule-Based NLP Urgency, Financial & BEC (Business Email Compromise) Heuristics
"""

import os
import re
import logging
from typing import Dict, Any, List, Optional
import joblib

logger = logging.getLogger("tracemail.detection")

# Path to local baseline artifacts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_DIR = os.path.join(BASE_DIR, "Model")
BASELINE_MODEL_PATH = os.path.join(MODEL_DIR, "baseline_model.pkl")
BASELINE_VEC_PATH = os.path.join(MODEL_DIR, "baseline_vectorizer.pkl")

HF_MODEL_NAME = os.getenv("HF_MODEL_NAME", "Dhananjay-N/tracemail-distilbert-phishing-v2")

# Global singleton storage
_baseline_model = None
_baseline_vectorizer = None
_transformer_pipeline = None
_transformer_attempted = False

# BEC & Social Engineering Vocabulary
URGENCY_KEYWORDS = [
    r"\burgent\b", r"\bimmediately\b", r"\bwithin \d+ hours\b", r"\bsuspended\b",
    r"\blockout\b", r"\blocked\b", r"\bexpire[s]? in\b", r"\bact now\b",
    r"\bfinal notice\b", r"\bcritical alert\b", r"\baction required\b",
    r"\bdeadline\b", r"\bfreeze\b", r"\bimmediate\b"
]

FINANCIAL_KEYWORDS = [
    r"\bwire transfer\b", r"\binvoice\b", r"\boverdue\b", r"\bpayment\b",
    r"\brouting account\b", r"\bbank account\b", r"\bkyc verification\b",
    r"\botp\b", r"\bconfidential\b", r"\bgift card\b", r"\btransact(?:ion)?\b",
    r"\bdebit card\b", r"\bvendor\b", r"\bcutoff\b"
]

AUTHORITY_TITLES = [
    r"\bceo\b", r"\bcfo\b", r"\bmanaging director\b", r"\bdirector\b",
    r"\bpresident\b", r"\bvice president\b", r"\bboard approval\b",
    r"\bhelp desk\b", r"\bit support\b", r"\bsecurity division\b",
    r"\badministrator\b", r"\bcentral security\b"
]

SUSPICIOUS_URL_PATTERNS = [
    r"http[s]?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}",  # Raw IP URL
    r"\.php\b", r"\blogin\b", r"\bauth\b", r"\bverify\b", r"\bupdate\b",
    r"\.(?:ru|xyz|top|biz|tk|pw|club|vip)\b"
]


def load_baseline():
    """Load local TF-IDF vectorizer and Logistic Regression baseline."""
    global _baseline_model, _baseline_vectorizer
    if _baseline_model is None or _baseline_vectorizer is None:
        if os.path.exists(BASELINE_MODEL_PATH) and os.path.exists(BASELINE_VEC_PATH):
            try:
                _baseline_model = joblib.load(BASELINE_MODEL_PATH)
                _baseline_vectorizer = joblib.load(BASELINE_VEC_PATH)
                logger.info("Loaded baseline TF-IDF + Logistic Regression model.")
            except Exception as e:
                logger.error(f"Failed loading baseline model: {e}")
        else:
            logger.warning(f"Baseline files not found at {BASELINE_MODEL_PATH}")
    return _baseline_model, _baseline_vectorizer


def load_transformer():
    """Attempt to load DistilBERT fine-tuned model via Hugging Face pipeline."""
    global _transformer_pipeline, _transformer_attempted
    if _transformer_pipeline is None and not _transformer_attempted:
        _transformer_attempted = True
        try:
            from transformers import pipeline
            logger.info(f"Attempting to load DistilBERT model: {HF_MODEL_NAME}")
            _transformer_pipeline = pipeline(
                "text-classification",
                model=HF_MODEL_NAME,
                tokenizer=HF_MODEL_NAME,
                device=-1  # CPU by default
            )
            logger.info("DistilBERT model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load Hugging Face transformer ({e}). Falling back to baseline.")
            _transformer_pipeline = None
    return _transformer_pipeline


def extract_nlp_cues(text: str) -> Dict[str, Any]:
    """Scan text for urgency, BEC, financial, and authority social engineering indicators."""
    text_lower = text.lower()
    
    found_urgency = [pat.replace(r"\b", "").replace(r"\d+", "*") 
                     for pat in URGENCY_KEYWORDS if re.search(pat, text_lower)]
    found_financial = [pat.replace(r"\b", "") 
                       for pat in FINANCIAL_KEYWORDS if re.search(pat, text_lower)]
    found_authority = [pat.replace(r"\b", "") 
                       for pat in AUTHORITY_TITLES if re.search(pat, text_lower)]
    found_suspicious_urls = [pat.replace(r"\b", "") 
                             for pat in SUSPICIOUS_URL_PATTERNS if re.search(pat, text_lower)]
    
    # Calculate BEC urgency score from presence of patterns
    bec_score = 0.0
    if found_urgency:
        bec_score += min(len(found_urgency) * 0.15, 0.40)
    if found_financial:
        bec_score += min(len(found_financial) * 0.15, 0.40)
    if found_authority:
        bec_score += 0.20
    
    bec_score = round(min(bec_score, 1.0), 2)
    
    return {
        "urgency_keywords": found_urgency,
        "financial_keywords": found_financial,
        "authority_titles": found_authority,
        "suspicious_url_flags": found_suspicious_urls,
        "bec_heuristic_score": bec_score,
        "is_bec_suspect": bec_score >= 0.45 and (len(found_financial) > 0 or len(found_authority) > 0)
    }


def predict_text(text: str) -> Dict[str, Any]:
    """
    Run ML prediction on email text.
    Uses DistilBERT if available; falls back to TF-IDF baseline.
    """
    cleaned = text.strip() if text else ""
    if not cleaned:
        return {
            "prediction": "legitimate",
            "phishing_prob": 0.0,
            "legitimate_prob": 1.0,
            "confidence": 1.0,
            "engine": "empty_input",
            "bec_cues": extract_nlp_cues("")
        }

    cues = extract_nlp_cues(cleaned)
    transformer = load_transformer()
    
    if transformer is not None:
        try:
            # DistilBERT inference
            res = transformer(cleaned[:512], truncation=True)[0]
            label = res.get("label", "")
            score = float(res.get("score", 0.5))
            
            # Map labels
            if "1" in label or "phish" in label.lower():
                phishing_prob = score
                legit_prob = 1.0 - score
                pred_label = "phishing"
            else:
                legit_prob = score
                phishing_prob = 1.0 - score
                pred_label = "legitimate"
                
            return {
                "prediction": pred_label,
                "phishing_prob": round(phishing_prob, 4),
                "legitimate_prob": round(legit_prob, 4),
                "confidence": round(score, 4),
                "engine": "distilbert",
                "model_name": HF_MODEL_NAME,
                "bec_cues": cues
            }
        except Exception as e:
            logger.warning(f"DistilBERT inference error ({e}), falling back to baseline.")
            
    # Baseline fallback
    model, vectorizer = load_baseline()
    if model is not None and vectorizer is not None:
        try:
            vec = vectorizer.transform([cleaned])
            probs = model.predict_proba(vec)[0]  # [p(0), p(1)]
            legit_prob = float(probs[0])
            phish_prob = float(probs[1])
            pred_class = int(model.predict(vec)[0])
            
            return {
                "prediction": "phishing" if pred_class == 1 else "legitimate",
                "phishing_prob": round(phish_prob, 4),
                "legitimate_prob": round(legit_prob, 4),
                "confidence": round(phish_prob if pred_class == 1 else legit_prob, 4),
                "engine": "tfidf_logistic_regression",
                "bec_cues": cues
            }
        except Exception as e:
            logger.error(f"Baseline inference failed: {e}")
            
    # Fallback to rule-based heuristics if no model is available
    is_phish = cues["bec_heuristic_score"] >= 0.35
    prob = cues["bec_heuristic_score"]
    return {
        "prediction": "phishing" if is_phish else "legitimate",
        "phishing_prob": prob,
        "legitimate_prob": round(1.0 - prob, 4),
        "confidence": prob if is_phish else round(1.0 - prob, 4),
        "engine": "heuristic_fallback",
        "bec_cues": cues
    }
