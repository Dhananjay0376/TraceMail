import logging
from typing import Dict, Any, Optional

from app.services.tfidf_predictor import get_tfidf_predictor
from app.services.distilbert_predictor import get_distilbert_predictor

logger = logging.getLogger(__name__)

# Combination weights — DistilBERT is the stronger model (99% accuracy)
DISTILBERT_WEIGHT = 0.7
TFIDF_WEIGHT = 0.3

CLASS_LABELS = ["legitimate", "phishing", "spam"]


def _combine_nlp_analysis(
    tfidf_result: Optional[Dict[str, Any]],
    distilbert_result: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Produces a combined NLP analysis from the two model outputs using
    weighted probability averaging.  Falls back to whichever model is
    available if only one loaded.
    """
    if tfidf_result and distilbert_result:
        combined_probs = {}
        tfidf_probs = tfidf_result["class_probabilities"]
        db_probs = distilbert_result["class_probabilities"]

        for label in CLASS_LABELS:
            t_p = tfidf_probs.get(label, 0.0) if isinstance(tfidf_probs, dict) else 0.0
            d_p = db_probs.get(label, 0.0) if isinstance(db_probs, dict) else 0.0
            combined_probs[label] = TFIDF_WEIGHT * t_p + DISTILBERT_WEIGHT * d_p

        final_label = max(combined_probs, key=combined_probs.get)
        final_confidence = round(combined_probs[final_label], 4)

        return {"final_label": final_label, "confidence": final_confidence}

    # Only one model available
    single = distilbert_result or tfidf_result
    if single:
        return {
            "final_label": single["predicted_label"],
            "confidence": single["confidence"],
        }

    return {"final_label": "legitimate", "confidence": 0.0}


def predict_all(email_text: str) -> Dict[str, Any]:
    """
    Runs both TF-IDF and DistilBERT predictors on the email text,
    collects individual model results, and returns a combined response.
    """
    models: Dict[str, Any] = {}
    tfidf_result = None
    distilbert_result = None

    # --- TF-IDF ---
    tfidf = get_tfidf_predictor()
    if tfidf.is_loaded:
        try:
            raw = tfidf.predict(email_text)
            tfidf_result = {
                "predicted_label": raw["predicted_label"],
                "confidence": raw["confidence"],
                "class_probabilities": raw["class_probabilities"],
            }
            models["tfidf"] = tfidf_result
        except Exception as e:
            logger.warning(f"TF-IDF prediction failed: {e}")

    # --- DistilBERT ---
    distilbert = get_distilbert_predictor()
    if distilbert.is_loaded:
        try:
            raw = distilbert.predict(email_text)
            distilbert_result = {
                "predicted_label": raw["predicted_label"],
                "confidence": raw["confidence"],
                "class_probabilities": raw["class_probabilities"],
            }
            models["distilbert"] = distilbert_result
        except Exception as e:
            logger.warning(f"DistilBERT prediction failed: {e}")

    if not models:
        raise RuntimeError("No ML model is loaded — cannot produce predictions.")

    nlp_analysis = _combine_nlp_analysis(tfidf_result, distilbert_result)

    return {
        "models": models,
        "nlp_analysis": nlp_analysis,
    }
