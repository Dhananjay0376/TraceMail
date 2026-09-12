"""
Forwarding module to app.services
"""
from app.services.tfidf_predictor import TfidfPredictor, get_tfidf_predictor, CLASS_NAMES
from app.services.distilbert_predictor import DistilBertPredictor, get_distilbert_predictor
from app.services import ml_service

__all__ = [
    "TfidfPredictor", "get_tfidf_predictor", "CLASS_NAMES",
    "DistilBertPredictor", "get_distilbert_predictor",
    "ml_service",
]
