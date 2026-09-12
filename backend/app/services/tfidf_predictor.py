import os
import sys
import logging
import warnings
from pathlib import Path
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Standard 3-class mapping for TraceMail
CLASS_NAMES = {
    0: "legitimate",
    1: "phishing",
    2: "spam"
}

class TfidfPredictor:
    """
    Production-ready singleton prediction service for the trained TF-IDF model.
    Loads the vectorizer and classifier once at application startup.
    Keeps ML prediction strictly separate from the forensic/BEC analysis layer.
    """
    def __init__(self):
        self._vectorizer = None
        self._model = None
        self._is_loaded = False
        self._model_source = None

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def _resolve_paths(self) -> tuple[Optional[Path], Optional[Path], Optional[Path]]:
        """
        Locates the model and vectorizer .pkl files across standard TraceMail locations.
        Returns: (single_model_path, vectorizer_path, model_path)
        """
        # 1. Environment variables
        env_single = os.getenv("TFIDF_COMBINED_MODEL_PATH")
        if env_single and Path(env_single).is_file():
            return Path(env_single), None, None

        env_vec = os.getenv("TFIDF_VECTORIZER_PATH")
        env_model = os.getenv("TFIDF_MODEL_PATH")
        if env_vec and env_model and Path(env_vec).is_file() and Path(env_model).is_file():
            return None, Path(env_vec), Path(env_model)

        # Base directories to search
        current_file = Path(__file__).resolve()
        search_dirs = [
            current_file.parent.parent.parent / "Model",             # <root>/Model
            current_file.parent.parent.parent / "models",            # <root>/models
            current_file.parent.parent / "models",                   # Backend/models
            Path("Model"),
            Path("../Model"),
            Path("models"),
            Path("../models")
        ]

        # Check for unified model file
        for d in search_dirs:
            for fname in ["existing_tfidf_model.pkl", "tfidf_model.pkl", "baseline_pipeline.pkl"]:
                p = (d / fname).resolve()
                if p.is_file():
                    return p, None, None

        # Check for separated baseline_vectorizer.pkl & baseline_model.pkl
        for d in search_dirs:
            vec_p = (d / "baseline_vectorizer.pkl").resolve()
            model_p = (d / "baseline_model.pkl").resolve()
            if vec_p.is_file() and model_p.is_file():
                return None, vec_p, model_p

        return None, None, None

    def load(self, force_reload: bool = False) -> bool:
        """Loads the pre-trained vectorizer and model once into memory."""
        if self._is_loaded and not force_reload:
            return True

        single_path, vec_path, model_path = self._resolve_paths()

        if not single_path and not (vec_path and model_path):
            logger.warning("TF-IDF model or vectorizer files not found in standard paths.")
            return False

        try:
            import joblib
            # Suppress sklearn version mismatch warnings safely
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

                if single_path:
                    logger.info(f"Loading TF-IDF model package from: {single_path}")
                    obj = joblib.load(single_path)
                    if hasattr(obj, "predict") and hasattr(obj, "named_steps"):
                        # Pipeline object
                        self._model = obj
                        self._vectorizer = None
                    elif isinstance(obj, dict):
                        self._vectorizer = obj.get("vectorizer")
                        self._model = obj.get("model") or obj.get("classifier")
                    elif isinstance(obj, (tuple, list)) and len(obj) == 2:
                        first, second = obj
                        if hasattr(first, "transform"):
                            self._vectorizer, self._model = first, second
                        else:
                            self._model, self._vectorizer = first, second
                    else:
                        self._model = obj
                        self._vectorizer = None
                    self._model_source = str(single_path)

                elif vec_path and model_path:
                    logger.info(f"Loading TF-IDF vectorizer from: {vec_path}")
                    self._vectorizer = joblib.load(vec_path)
                    logger.info(f"Loading TF-IDF classifier from: {model_path}")
                    self._model = joblib.load(model_path)
                    self._model_source = f"{vec_path.name} + {model_path.name}"

            self._is_loaded = True
            logger.info("TF-IDF prediction engine initialized successfully.")
            return True

        except Exception as e:
            logger.error(f"Failed to load TF-IDF model: {e}", exc_info=True)
            self._is_loaded = False
            return False

    def predict(self, email_text: str) -> Dict[str, Any]:
        """
        Runs inference on raw email text and returns predictions with class probabilities.
        Does NOT fit the vectorizer again and does NOT retrain anything.
        """
        if not self._is_loaded:
            success = self.load()
            if not success or self._model is None:
                raise RuntimeError("TF-IDF model is not loaded and could not be initialized.")

        cleaned_text = (email_text or "").strip()
        if not cleaned_text:
            cleaned_text = " "

        try:
            # Transform text using pre-fitted vectorizer
            if self._vectorizer is not None:
                features = self._vectorizer.transform([cleaned_text])
            else:
                # If pipeline was loaded
                features = [cleaned_text]

            # Predict label index and probability distributions
            pred_idx = int(self._model.predict(features)[0])

            # Class probabilities extraction
            class_probs = {"legitimate": 0.0, "phishing": 0.0, "spam": 0.0}

            if hasattr(self._model, "predict_proba"):
                probs = self._model.predict_proba(features)[0]
                classes = getattr(self._model, "classes_", [0, 1])

                for idx, c in enumerate(classes):
                    c_int = int(c)
                    name = CLASS_NAMES.get(c_int, f"class_{c_int}")
                    class_probs[name] = round(float(probs[idx]), 4)

                # Confidence is the probability of the predicted class
                class_list = list(classes)
                if pred_idx in class_list:
                    confidence = round(float(probs[class_list.index(pred_idx)]), 4)
                else:
                    confidence = round(float(max(probs)), 4)
            else:
                # Fallback for models without predict_proba
                pred_label_name = CLASS_NAMES.get(pred_idx, "legitimate")
                class_probs[pred_label_name] = 1.0
                confidence = 1.0

            predicted_label = CLASS_NAMES.get(pred_idx, "legitimate")

            return {
                "model": "TF-IDF",
                "predicted_label": predicted_label,
                "confidence": confidence,
                "class_probabilities": class_probs
            }

        except Exception as e:
            logger.error(f"Inference error during TF-IDF prediction: {e}", exc_info=True)
            raise RuntimeError(f"Prediction failed: {str(e)}") from e


# Singleton instance
_predictor_instance = TfidfPredictor()

def get_tfidf_predictor() -> TfidfPredictor:
    """Returns the singleton instance of the TF-IDF predictor."""
    return _predictor_instance
