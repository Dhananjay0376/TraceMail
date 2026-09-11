import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Global model classifier holder
_classifier = None

def get_classifier():
    global _classifier
    if _classifier is not None:
        return _classifier

    model_path = os.getenv("LOCAL_MODEL_PATH", "./model/sih26106-model")
    hf_model_name = os.getenv("HF_MODEL_NAME", "distilbert-base-uncased")

    # Try local model directory first
    if os.path.exists(model_path):
        try:
            from transformers import pipeline
            logger.info(f"Loading model from local path: {model_path}")
            _classifier = pipeline("text-classification", model=model_path, tokenizer=model_path)
            return _classifier
        except Exception as e:
            logger.warning(f"Failed to load local model from {model_path}: {e}")

    # Fallback to Hugging Face Hub or stub
    try:
        from transformers import pipeline
        logger.info(f"Attempting to load model from HF Hub: {hf_model_name}")
        _classifier = pipeline("text-classification", model=hf_model_name)
        return _classifier
    except Exception as e:
        logger.warning(f"Could not load Hugging Face model ({e}). Using heuristic/stub fallback.")
        _classifier = None
        return None

def classify_email(text: str) -> Dict[str, Any]:
    \"\"\"
    Classify email text using DistilBERT model if available,
    or a robust heuristic fallback for local/offline testing.
    \"\"\"
    clf = get_classifier()
    
    if clf is not None:
        try:
            res = clf(text[:512], truncation=True)[0]
            label_map = {
                "LABEL_0": "Legitimate",
                "LABEL_1": "Phishing",
                "Safe Email": "Legitimate",
                "Phishing Email": "Phishing"
            }
            mapped_label = label_map.get(res["label"], res["label"])
            return {
                "label": mapped_label,
                "confidence": round(float(res["score"]), 4),
                "model_version": "DistilBERT-FineTuned"
            }
        except Exception as e:
            logger.error(f"Inference error: {e}")

    # Heuristic fallback if model not yet trained or loaded
    lower_text = text.lower()
    phishing_keywords = [
        "urgent", "suspended", "verify your account", "wire transfer", "unauthorized login",
        "immediate action", "reset password", "invoice attached", "tax refund", "security alert"
    ]
    matches = [kw for kw in phishing_keywords if kw in lower_text]
    
    if len(matches) >= 2:
        return {
            "label": "Phishing",
            "confidence": 0.88,
            "model_version": "Heuristic-Fallback"
        }
    elif len(matches) == 1:
        return {
            "label": "Suspicious",
            "confidence": 0.65,
            "model_version": "Heuristic-Fallback"
        }
    else:
        return {
            "label": "Legitimate",
            "confidence": 0.92,
            "model_version": "Heuristic-Fallback"
        }
