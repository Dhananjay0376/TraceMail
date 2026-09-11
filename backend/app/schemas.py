from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ClassifyRequest(BaseModel):
    text: str = Field(..., description="Raw text or email body to classify")

class DetectionResult(BaseModel):
    label: str = Field(..., description="Predicted label: Legitimate, Phishing, Spam, or BEC")
    confidence: float = Field(..., description="Confidence probability between 0.0 and 1.0")
    model_version: str = Field("distilbert-base-uncased", description="Model identifier used")

class AuthResults(BaseModel):
    spf_status: str = Field("neutral", description="SPF check result: pass, fail, softfail, none")
    dkim_status: str = Field("neutral", description="DKIM check result: pass, fail, none")
    dmarc_status: str = Field("neutral", description="DMARC check result: pass, fail, none")
    spf_record: Optional[str] = None
    dmarc_record: Optional[str] = None

class HeaderDetails(BaseModel):
    from_header: Optional[str] = None
    return_path: Optional[str] = None
    reply_to: Optional[str] = None
    message_id: Optional[str] = None
    subject: Optional[str] = None
    date: Optional[str] = None
    auth_results: AuthResults
    received_chain: List[str] = []

class RelayHop(BaseModel):
    hop_index: int
    ip: str
    city: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None
    org: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    is_origin: bool = False
    is_hosting: bool = False

class DomainIntel(BaseModel):
    domain: str
    registrar: Optional[str] = None
    creation_date: Optional[str] = None
    age_days: Optional[int] = None
    is_new_domain: bool = False
    mx_records: List[str] = []

class ScoreFactor(BaseModel):
    name: str
    points: float
    reason: str

class FraudScoreBreakdown(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Overall risk score from 0 (Safe) to 100 (Critical)")
    risk_level: str = Field(..., description="Low, Medium, High, or Critical")
    factors: List[ScoreFactor] = []

class CampaignMatch(BaseModel):
    campaign_id: Optional[str] = None
    shared_ip: Optional[str] = None
    shared_domain: Optional[str] = None
    related_cases_count: int = 0

class EvidenceSeal(BaseModel):
    sha256: str = Field(..., description="Cryptographic SHA-256 evidence digest")
    md5: str = Field(..., description="MD5 legacy hash digest")
    file_size_bytes: int = Field(..., description="Byte size of the ingested evidence file")
    ingest_timestamp: str = Field(..., description="ISO-8601 UTC timestamp of ingestion")
    parser_version: str = Field("TraceMail-MIME-v1.2", description="Forensics parser engine version")
    custody_status: str = Field("Verified & Immutable", description="Evidentiary integrity status")

class URLThreatDetails(BaseModel):
    url: str
    domain: str
    is_ip_based: bool = False
    is_shortened: bool = False
    is_mismatched_anchor: bool = False
    anchor_text: Optional[str] = None
    risk_score: float = 0.0
    threat_flags: List[str] = []

class AttachmentDetails(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    sha256: str
    is_suspicious_extension: bool = False
    threat_level: str = "Safe"

class AnalyzeResponse(BaseModel):
    id: str
    timestamp: str
    evidence_seal: EvidenceSeal
    detection: DetectionResult
    headers: HeaderDetails
    trace: List[RelayHop]
    domain_intel: Optional[DomainIntel] = None
    extracted_urls: List[URLThreatDetails] = []
    attachments: List[AttachmentDetails] = []
    fraud_score: FraudScoreBreakdown
    campaign: Optional[CampaignMatch] = None
    raw_body_preview: Optional[str] = None

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "case", "domain", "ip", "campaign"
    risk_level: Optional[str] = None
    score: Optional[int] = None
    details: Optional[Dict[str, Any]] = None

class GraphEdge(BaseModel):
    source: str
    target: str
    relation: str

class CampaignGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_cases: int
    total_campaigns: int

