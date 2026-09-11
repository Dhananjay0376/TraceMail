import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Global model classifier holder
_classifier = None
_tried_loading = False

def get_classifier():
    global _classifier, _tried_loading
    if _tried_loading:
        return _classifier

    _tried_loading = True
    model_path = os.getenv("LOCAL_MODEL_PATH", "./model/sih26106-model")
    
    # Check if local model folder exists with actual model config
    if os.path.exists(model_path) and os.path.exists(os.path.join(model_path, "config.json")):
        try:
            from transformers import pipeline
            logger.info(f"Loading model from local path: {model_path}")
            _classifier = pipeline("text-classification", model=model_path, tokenizer=model_path)
            return _classifier
        except Exception as e:
            logger.warning(f"Failed to load local model from {model_path}: {e}")

    # If offline mode or Hub download not explicitly requested, use heuristic
    if os.getenv("ENABLE_HF_HUB_DOWNLOAD", "false").lower() == "true":
        hf_model_name = os.getenv("HF_MODEL_NAME", "distilbert-base-uncased")
        try:
            from transformers import pipeline
            logger.info(f"Attempting to load model from HF Hub: {hf_model_name}")
            _classifier = pipeline("text-classification", model=hf_model_name)
            return _classifier
        except Exception as e:
            logger.warning(f"Could not load Hugging Face Hub model: {e}")

    _classifier = None
    return None

def classify_email(text: str) -> Dict[str, Any]:
    """
    Classify email text using fine-tuned DistilBERT if loaded,
    or a high-precision multi-class heuristic detector (Legitimate, Phishing, BEC, Suspicious).
    """
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

    # Heuristic & Regex Classifier
    lower_text = text.lower()

    # BEC Indicators: payment diversion, urgency, authority pretext, secrecy
    bec_keywords = [
        "wire transfer", "overdue invoice", "process the attached", "client call",
        "beneficiary account", "updated bank details", "executive meeting", "do not call",
        "payment before end of day", "confidential request"
    ]
    bec_matches = sum(1 for kw in bec_keywords if kw in lower_text)

    # Phishing Indicators: credential theft, account restriction, verification links
    phish_keywords = [
        "urgent", "suspended", "verify your account", "unauthorized login",
        "immediate action", "reset password", "security alert", "confirm your identity",
        "temporarily restricted", "avoid permanent loss"
    ]
    phish_matches = sum(1 for kw in phish_keywords if kw in lower_text)

    if bec_matches >= 2:
        return {
            "label": "BEC",
            "confidence": 0.89,
            "model_version": "Heuristic-Threat-Engine"
        }
    elif phish_matches >= 2:
        return {
            "label": "Phishing",
            "confidence": 0.93,
            "model_version": "Heuristic-Threat-Engine"
        }
    elif phish_matches == 1 or bec_matches == 1:
        return {
            "label": "Suspicious",
            "confidence": 0.68,
            "model_version": "Heuristic-Threat-Engine"
        }
    else:
        return {
            "label": "Legitimate",
            "confidence": 0.95,
            "model_version": "Heuristic-Threat-Engine"
        }

