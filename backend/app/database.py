import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

DB_PATH = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "..", "tracemail.db"))

def get_connection():
    """Establishes a connection to the SQLite database with dict row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the SQLite schema for cases, campaigns, and evidence audit logs."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        evidence_sha256 TEXT NOT NULL,
        evidence_md5 TEXT,
        from_header TEXT,
        subject TEXT,
        sender_domain TEXT,
        originating_ip TEXT,
        label TEXT,
        confidence REAL,
        fraud_score INTEGER,
        risk_level TEXT,
        campaign_id TEXT,
        full_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaigns (
        campaign_id TEXT PRIMARY KEY,
        shared_ip TEXT,
        shared_domain TEXT,
        first_seen TEXT,
        last_seen TEXT,
        case_count INTEGER DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_cases_domain ON cases(sender_domain);
    CREATE INDEX IF NOT EXISTS idx_cases_ip ON cases(originating_ip);
    CREATE INDEX IF NOT EXISTS idx_cases_sha256 ON cases(evidence_sha256);
    """)

    conn.commit()
    conn.close()
    logger.info(f"SQLite database initialized at {DB_PATH}")

def save_case(case_dict: Dict[str, Any]):
    """Persists an analyzed case and updates campaign statistics in SQLite."""
    conn = get_connection()
    cursor = conn.cursor()

    case_id = case_dict.get("id")
    timestamp = case_dict.get("timestamp", datetime.now(timezone.utc).isoformat())
    seal = case_dict.get("evidence_seal", {})
    sha256 = seal.get("sha256", "")
    md5 = seal.get("md5", "")
    
    headers = case_dict.get("headers", {})
    from_header = headers.get("from_header", "")
    subject = headers.get("subject", "")
    
    domain_intel = case_dict.get("domain_intel") or {}
    sender_domain = domain_intel.get("domain", "")
    
    trace = case_dict.get("trace", [])
    originating_ip = trace[0].get("ip") if trace else None

    detection = case_dict.get("detection", {})
    label = detection.get("label", "")
    confidence = detection.get("confidence", 0.0)

    fraud_score_data = case_dict.get("fraud_score", {})
    fraud_score = fraud_score_data.get("score", 0)
    risk_level = fraud_score_data.get("risk_level", "Low")

    campaign_data = case_dict.get("campaign") or {}
    campaign_id = campaign_data.get("campaign_id")

    full_json = json.dumps(case_dict)

    cursor.execute("""
    INSERT OR REPLACE INTO cases (
        id, timestamp, evidence_sha256, evidence_md5, from_header, subject,
        sender_domain, originating_ip, label, confidence, fraud_score,
        risk_level, campaign_id, full_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        case_id, timestamp, sha256, md5, from_header, subject,
        sender_domain, originating_ip, label, confidence, fraud_score,
        risk_level, campaign_id, full_json
    ))

    # Update campaign record if a campaign is associated
    if campaign_id:
        cursor.execute("SELECT case_count, first_seen FROM campaigns WHERE campaign_id = ?", (campaign_id,))
        row = cursor.fetchone()
        if row:
            new_count = row["case_count"] + 1
            cursor.execute("""
            UPDATE campaigns SET last_seen = ?, case_count = ? WHERE campaign_id = ?
            """, (timestamp, new_count, campaign_id))
        else:
            cursor.execute("""
            INSERT INTO campaigns (campaign_id, shared_ip, shared_domain, first_seen, last_seen, case_count)
            VALUES (?, ?, ?, ?, ?, 1)
            """, (campaign_id, originating_ip, sender_domain, timestamp, timestamp))

    conn.commit()
    conn.close()

def get_all_cases(limit: int = 50) -> List[Dict[str, Any]]:
    """Fetches the most recent analyzed cases as dictionaries."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT full_json FROM cases ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    cases = []
    for r in rows:
        try:
            cases.append(json.loads(r["full_json"]))
        except Exception:
            pass
    return cases

def get_case_by_id(case_id: str) -> Optional[Dict[str, Any]]:
    """Fetches a single case by its Case ID."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT full_json FROM cases WHERE id = ?", (case_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        try:
            return json.loads(row["full_json"])
        except Exception:
            return None
    return None

def get_all_campaigns() -> List[Dict[str, Any]]:
    """Returns all recorded multi-case campaign clusters."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM campaigns ORDER BY last_seen DESC")
    rows = cursor.fetchall()
    conn.close()

    return [dict(r) for r in rows]

# Auto-initialize database on import
init_db()

