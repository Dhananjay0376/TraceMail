import os
import logging
import warnings
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# 3-class mapping matching TraceMail convention
CLASS_NAMES = {
    0: "legitimate",
    1: "phishing",
    2: "spam",
}

# HF label format → class index
LABEL_TO_IDX = {
    "LABEL_0": 0,
    "LABEL_1": 1,
    "LABEL_2": 2,
}


class DistilBertPredictor:
    """
    Singleton prediction service for the fine-tuned DistilBERT 3-class model
    hosted on Hugging Face (ANMOLGOLA/TraceMail-DistilBERT-3Class).
    Loads the model once at application startup via transformers pipeline.
    """

    HF_REPO = "ANMOLGOLA/TraceMail-DistilBERT-3Class"

    def __init__(self):
        self._pipeline = None
        self._is_loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def load(self, force_reload: bool = False) -> bool:
        """Download (once) and cache the HF model, then build a classification pipeline."""
        if self._is_loaded and not force_reload:
            return True

        repo = os.getenv("DISTILBERT_MODEL_NAME", self.HF_REPO)

        try:
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=UserWarning)
                from transformers import pipeline as hf_pipeline

                logger.info(f"Loading DistilBERT 3-class model from: {repo}")
                self._pipeline = hf_pipeline(
                    "text-classification",
                    model=repo,
                    tokenizer=repo,
                    top_k=3,           # return probabilities for all 3 classes
                    truncation=True,
                    max_length=512,
                )
            self._is_loaded = True
            logger.info("DistilBERT 3-class prediction engine initialized successfully.")
            return True

        except Exception as e:
            logger.error(f"Failed to load DistilBERT model: {e}", exc_info=True)
            self._is_loaded = False
            return False

    def predict(self, email_text: str) -> Dict[str, Any]:
        """
        Runs inference on raw email text and returns predictions with
        per-class probabilities.  Does NOT retrain anything.
        """
        if not self._is_loaded:
            success = self.load()
            if not success or self._pipeline is None:
                raise RuntimeError(
                    "DistilBERT model is not loaded and could not be initialized."
                )

        cleaned = (email_text or "").strip() or " "

        try:
            raw_results = self._pipeline(cleaned[:512])
            if isinstance(raw_results, list) and len(raw_results) > 0 and isinstance(raw_results[0], list):
                raw_results = raw_results[0]

            # Build probability dict
            class_probs = {"legitimate": 0.0, "phishing": 0.0, "spam": 0.0}
            best_label = "legitimate"
            best_score = 0.0

            for item in raw_results:
                label_key = item["label"]
                score = float(item["score"])
                idx = LABEL_TO_IDX.get(label_key)
                if idx is not None:
                    name = CLASS_NAMES[idx]
                else:
                    # Handle human-readable labels if model exposes them
                    name = label_key.lower()
                class_probs[name] = round(score, 4)
                if score > best_score:
                    best_score = score
                    best_label = name

            return {
                "predicted_label": best_label,
                "confidence": round(best_score, 4),
                "class_probabilities": class_probs,
            }

        except Exception as e:
            logger.error(f"DistilBERT inference error: {e}", exc_info=True)
            raise RuntimeError(f"DistilBERT prediction failed: {str(e)}") from e


# Singleton
_distilbert_instance = DistilBertPredictor()


def get_distilbert_predictor() -> DistilBertPredictor:
    """Returns the singleton DistilBERT predictor instance."""
    return _distilbert_instance
