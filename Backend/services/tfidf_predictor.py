"""
Forwarding module to app.services.tfidf_predictor
"""
from app.services.tfidf_predictor import (
    TfidfPredictor,
    get_tfidf_predictor,
    CLASS_NAMES
)

__all__ = ["TfidfPredictor", "get_tfidf_predictor", "CLASS_NAMES"]
