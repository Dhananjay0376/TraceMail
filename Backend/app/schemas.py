"""
TraceMail Pydantic Schemas for API Requests and Responses
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class EmailAddressInfo(BaseModel):
    raw: str
    display_name: str
    email: str
    domain: str


class RelayHopInfo(BaseModel):
    hop_number: int
    ip: Optional[str] = None
    from_host: str
    by_host: str
    protocol: str
    timestamp: Optional[str] = None
    delay_seconds: int = 0
    is_public_ip: bool = False
    city: Optional[str] = None
    country: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    org: Optional[str] = None


class AuthenticationVerdicts(BaseModel):
    spf: str
    dkim: str
    dmarc: str
    dkim_details: Optional[Dict[str, Any]] = None


class AnomalyReport(BaseModel):
    reply_to_mismatch: bool
    return_path_mismatch: bool
    display_name_spoofing: bool
    sender_domain: str
    return_path_domain: str
    reply_to_domain: str
    anomaly_flags: List[str]


class DetectionResult(BaseModel):
    prediction: str
    phishing_prob: float
    legitimate_prob: float
    confidence: float
    engine: str
    model_name: Optional[str] = None
    bec_cues: Dict[str, Any]


class ScoreCategoryBreakdown(BaseModel):
    category: str
    points: int
    max_points: int
    flagged: bool
    detail: str


class FraudScoringResult(BaseModel):
    fraud_score: int
    risk_level: str
    verdict: str
    verdict_color: str
    breakdown: List[ScoreCategoryBreakdown]


class AnalyzeResponse(BaseModel):
    case_id: str
    timestamp: str
    sha256_hash: str
    subject: str
    sender: EmailAddressInfo
    to: str
    date: str
    message_id: str
    return_path: str
    reply_to: str
    origin_ip: Optional[str] = None
    geolocation: Dict[str, Any]
    domain_intel: Dict[str, Any]
    relay_hops: List[RelayHopInfo]
    hop_count: int
    authentication: AuthenticationVerdicts
    anomalies: AnomalyReport
    detection: DetectionResult
    fraud_scoring: FraudScoringResult
    body_preview: str
    attachments: List[Dict[str, Any]]


class SampleEmailMeta(BaseModel):
    id: str
    filename: str
    title: str
    description: str
    category: str
    expected_risk: str
    origin_location: str


class ReportExportRequest(BaseModel):
    case_id: str
    mask_pii: bool = False
    investigator_notes: Optional[str] = ""
