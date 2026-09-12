"""
TraceMail Correlation Engine & Explainable Fraud Scoring
Calculates an explainable 0-100 fraud confidence score with transparent attribution factors.
Maintains a NetworkX knowledge graph to correlate infrastructure across multiple cases
and reveal coordinated cybercrime / fraud campaigns.
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import networkx as nx
import logging

logger = logging.getLogger("tracemail.correlation")


class CampaignGraphManager:
    """Manages cross-case relationship graph using NetworkX."""

    def __init__(self):
        self.G = nx.DiGraph()
        self.cases_store: Dict[str, Dict[str, Any]] = {}

    def add_case(
        self,
        case_id: str,
        subject: str,
        fraud_score: int,
        verdict: str,
        sender_email: str,
        sender_domain: str,
        reply_to_email: Optional[str],
        origin_ip: Optional[str],
        hops: List[Dict[str, Any]],
        geo: Dict[str, Any]
    ) -> None:
        """Register an analyzed case and wire its infrastructure into the graph."""
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # 1. Add Case Node
        self.G.add_node(
            case_id,
            id=case_id,
            type="case",
            label=f"Case #{case_id[:8]}",
            subject=subject,
            fraud_score=fraud_score,
            verdict=verdict,
            timestamp=timestamp
        )

        # 2. Add Sender Node
        if sender_email:
            sender_id = f"sender:{sender_email.lower()}"
            self.G.add_node(sender_id, id=sender_id, type="sender", label=sender_email)
            self.G.add_edge(case_id, sender_id, relation="sent_by")

        # 3. Add Domain Node
        if sender_domain:
            domain_id = f"domain:{sender_domain.lower()}"
            self.G.add_node(domain_id, id=domain_id, type="domain", label=sender_domain)
            self.G.add_edge(case_id, domain_id, relation="claimed_domain")
            if sender_email:
                self.G.add_edge(sender_id, domain_id, relation="domain_of")

        # 4. Add Reply-To Domain if divergent
        if reply_to_email and "@" in reply_to_email:
            reply_domain = reply_to_email.split("@")[-1].strip("<>").lower()
            reply_domain_id = f"domain:{reply_domain}"
            self.G.add_node(reply_domain_id, id=reply_domain_id, type="domain", label=reply_domain)
            self.G.add_edge(case_id, reply_domain_id, relation="routes_reply_to")

        # 5. Add Origin IP & Relay Hops
        if origin_ip:
            ip_id = f"ip:{origin_ip}"
            self.G.add_node(
                ip_id,
                id=ip_id,
                type="ip",
                label=origin_ip,
                country=geo.get("country", "Unknown"),
                city=geo.get("city", "Unknown"),
                org=geo.get("org", "Unknown"),
                is_hosting=geo.get("is_hosting", False)
            )
            self.G.add_edge(case_id, ip_id, relation="originating_ip")

        # Track hops
        for hop in hops:
            h_ip = hop.get("ip")
            if h_ip and h_ip != origin_ip:
                hip_id = f"ip:{h_ip}"
                self.G.add_node(hip_id, id=hip_id, type="ip", label=h_ip, is_relay=True)
                self.G.add_edge(case_id, hip_id, relation="relayed_through")

    def get_campaign_clusters(self) -> List[Dict[str, Any]]:
        """Identify shared infrastructure across distinct cases to detect coordinated campaigns."""
        campaigns = []
        # Find all IP and Domain nodes that have in-degree > 1 from cases
        shared_entities = {}
        for node, data in self.G.nodes(data=True):
            node_type = data.get("type")
            if node_type in ("ip", "domain"):
                # Find connected cases
                connected_cases = [
                    u for u, v, attrs in self.G.in_edges(node, data=True)
                    if self.G.nodes[u].get("type") == "case"
                ]
                if len(connected_cases) > 1:
                    shared_entities[node] = {
                        "entity": node,
                        "entity_type": node_type,
                        "label": data.get("label", node),
                        "details": data,
                        "linked_cases": connected_cases
                    }

        if shared_entities:
            campaign_id = 1
            for entity_key, info in shared_entities.items():
                campaigns.append({
                    "campaign_id": f"CAMP-{campaign_id:03d}",
                    "name": f"Infrastructure Cluster ({info['label']})",
                    "threat_entity": info["label"],
                    "entity_type": info["entity_type"],
                    "case_count": len(info["linked_cases"]),
                    "linked_cases": info["linked_cases"],
                    "severity": "CRITICAL" if info["entity_type"] == "ip" else "HIGH",
                    "description": f"Shared {info['entity_type']} observed across {len(info['linked_cases'])} independent email attacks."
                })
                campaign_id += 1

        return campaigns

    def export_graph_json(self) -> Dict[str, Any]:
        """Format the NetworkX graph for React frontend node-link visualization."""
        nodes = []
        for n, d in self.G.nodes(data=True):
            nodes.append({
                "id": str(n),
                "label": d.get("label", str(n)),
                "type": d.get("type", "unknown"),
                "score": d.get("fraud_score", None),
                "verdict": d.get("verdict", None),
                "country": d.get("country", None),
                "org": d.get("org", None),
                "is_hosting": d.get("is_hosting", False)
            })

        links = []
        for u, v, d in self.G.edges(data=True):
            links.append({
                "source": str(u),
                "target": str(v),
                "relation": d.get("relation", "linked_to")
            })

        return {
            "nodes": nodes,
            "links": links,
            "campaigns": self.get_campaign_clusters(),
            "total_cases": sum(1 for _, d in self.G.nodes(data=True) if d.get("type") == "case"),
            "total_nodes": len(nodes),
            "total_links": len(links)
        }


# Global singleton instance
graph_manager = CampaignGraphManager()


def compute_fraud_score(
    model_prob: float,
    spf_status: str,
    dkim_status: str,
    dmarc_status: str,
    domain_age_days: int,
    is_hosting_ip: bool,
    reply_to_mismatch: bool,
    display_name_spoofing: bool,
    bec_cues: Dict[str, Any],
    return_path_mismatch: bool = False,
    reply_domain_age_days: Optional[int] = None
) -> Dict[str, Any]:
    """
    Compute transparent, explainable 0-100 fraud confidence score with point-by-point attribution.
    """
    breakdown = []
    
    # 1. NLP / Machine Learning Base (0 - 40 pts)
    ml_pts = int(round(model_prob * 40))
    breakdown.append({
        "category": "AI / NLP Threat Classifier",
        "points": ml_pts,
        "max_points": 40,
        "flagged": ml_pts > 15,
        "detail": f"Model evaluated email text as {round(model_prob * 100, 1)}% phishing risk"
    })

    # 2. SPF Protocol Verification (10 pts)
    spf_fail = spf_status.lower() in ("fail", "softfail")
    spf_pts = 10 if spf_fail else 0
    breakdown.append({
        "category": "SPF Authentication",
        "points": spf_pts,
        "max_points": 10,
        "flagged": spf_fail,
        "detail": f"SPF status is '{spf_status.upper()}' (sending IP not authorized)" if spf_fail else "SPF passed or neutral"
    })

    # 3. DKIM Cryptographic Signature (10 pts)
    dkim_fail = dkim_status.lower() in ("fail", "none")
    dkim_pts = 10 if dkim_fail else 0
    breakdown.append({
        "category": "DKIM Cryptographic Seal",
        "points": dkim_pts,
        "max_points": 10,
        "flagged": dkim_fail,
        "detail": "DKIM signature invalid or missing" if dkim_fail else "DKIM signature verified"
    })

    # 4. DMARC Alignment & Policy (10 pts)
    dmarc_fail = dmarc_status.lower() == "fail"
    dmarc_pts = 10 if dmarc_fail else 0
    breakdown.append({
        "category": "DMARC Alignment Policy",
        "points": dmarc_pts,
        "max_points": 10,
        "flagged": dmarc_fail,
        "detail": "DMARC check failed" if dmarc_fail else "DMARC aligned or unconfigured"
    })

    # 5. Newly Registered Domain (< 30 days) (15 pts)
    effective_age = domain_age_days
    if reply_domain_age_days is not None and reply_to_mismatch:
        effective_age = min(domain_age_days, reply_domain_age_days)
    new_domain = effective_age < 30
    domain_pts = 15 if new_domain else 0
    breakdown.append({
        "category": "Domain Age / WHOIS",
        "points": domain_pts,
        "max_points": 15,
        "flagged": new_domain,
        "detail": f"Domain registered only {effective_age} days ago (lookalike domain pattern)" if new_domain else f"Established domain ({effective_age} days old)"
    })

    # 6. Generic Cloud VPS / Datacenter Origin (10 pts)
    hosting_pts = 10 if is_hosting_ip else 0
    breakdown.append({
        "category": "Infrastructure Hosting Flag",
        "points": hosting_pts,
        "max_points": 10,
        "flagged": is_hosting_ip,
        "detail": "Mail originated directly from a generic cloud VPS / bulletproof datacenter ASN" if is_hosting_ip else "Residential or corporate enterprise route"
    })

    # 7. Identity & Header Divergence Spoofing (15 pts)
    spoof_flags = []
    spoof_pts = 0
    if reply_to_mismatch:
        spoof_pts += 8
        spoof_flags.append("Reply-To domain mismatch")
    if return_path_mismatch:
        spoof_pts += 4
        spoof_flags.append("Return-Path bounce divergence")
    if display_name_spoofing:
        spoof_pts += 5
        spoof_flags.append("VIP / brand display name impersonation")
        
    actual_spoof_pts = min(spoof_pts, 15)
    breakdown.append({
        "category": "Sender Identity Alignment",
        "points": actual_spoof_pts,
        "max_points": 15,
        "flagged": len(spoof_flags) > 0,
        "detail": ", ".join(spoof_flags) if spoof_flags else "Sender identities aligned"
    })

    # 8. BEC / Urgency & Financial Cues (15 pts)
    bec_score = bec_cues.get("bec_heuristic_score", 0.0)
    bec_pts = int(round(bec_score * 15))
    has_bec = bec_cues.get("is_bec_suspect", False)
    breakdown.append({
        "category": "Social Engineering & BEC Signals",
        "points": bec_pts,
        "max_points": 15,
        "flagged": has_bec or bec_pts > 5,
        "detail": f"Detected urgency keywords and financial/wire transfer indicators (score {bec_score})" if bec_pts > 0 else "Normal conversational tone"
    })

    # Total summation
    total_raw = ml_pts + spf_pts + dkim_pts + dmarc_pts + domain_pts + hosting_pts + actual_spoof_pts + bec_pts
    final_score = min(100, max(0, total_raw))

    # Determine Verdict & Severity
    if final_score >= 90:
        verdict = "CRITICAL: High-Risk Fraud / BEC Attack"
        risk_level = "CRITICAL"
        verdict_color = "#dc2626"
    elif final_score >= 70:
        verdict = "MALICIOUS: Confirmed Phishing Attack"
        risk_level = "HIGH"
        verdict_color = "#ef4444"
    elif final_score >= 40:
        verdict = "SUSPICIOUS: Security Policy Anomaly"
        risk_level = "MEDIUM"
        verdict_color = "#f59e0b"
    else:
        verdict = "LEGITIMATE: Clean Communication"
        risk_level = "LOW"
        verdict_color = "#10b981"

    return {
        "fraud_score": final_score,
        "score": final_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "verdict_color": verdict_color,
        "breakdown": breakdown,
        "factors": [{"name": b["category"], "points": b["points"], "reason": b["detail"]} for b in breakdown if b.get("flagged")]
    }


# Singleton manager
_campaign_graph_mgr = CampaignGraphManager()

def record_and_correlate(case_id: str, domain: str, originating_ip: Optional[str], label: str, score: int, risk_level: str) -> Dict[str, Any]:
    _campaign_graph_mgr.add_case(
        case_id=case_id,
        subject=f"Investigation {case_id}",
        fraud_score=score,
        verdict=risk_level,
        sender_email=f"sender@{domain}" if domain else "unknown@email.com",
        sender_domain=domain or "unknown.com",
        reply_to_email=None,
        origin_ip=originating_ip,
        hops=[{"ip": originating_ip}] if originating_ip else [],
        geo={"is_hosting": False}
    )
    return {
        "campaign_id": f"CAMP-{domain.upper()}" if domain else None,
        "shared_ip": originating_ip,
        "shared_domain": domain,
        "related_cases_count": 1
    }

def get_campaign_graph_data() -> Dict[str, Any]:
    return _campaign_graph_mgr.export_graph_json()

def rehydrate_graph_from_db(cases: List[Dict[str, Any]]) -> None:
    pass
