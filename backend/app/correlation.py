import networkx as nx
from typing import Dict, Any, List, Optional
import uuid

# In-memory graph of analyzed entities
_campaign_graph = nx.DiGraph()

def compute_fraud_score(
    model_prob: float,
    is_phishing_label: bool,
    spf_status: str,
    dkim_status: str,
    dmarc_status: str,
    domain_age_days: Optional[int],
    is_hosting_ip: bool,
    sender_return_path_mismatch: bool = False,
    extracted_urls: Optional[List[Dict[str, Any]]] = None,
    attachments: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Transparent, explainable fraud-confidence score (0 - 100)
    combining ML detection, protocol validation, domain intel, URL analysis, and attachment threats.
    """
    score = 0.0
    factors = []

    # 1. NLP / ML Detection Model (Up to 40 pts)
    if is_phishing_label:
        ml_points = round(model_prob * 40.0, 1)
        score += ml_points
        factors.append({
            "name": "NLP Model Threat Detection",
            "points": ml_points,
            "reason": f"Text classification flagged high threat patterns ({round(model_prob*100, 1)}% confidence)"
        })
    else:
        ml_points = round((1.0 - model_prob) * 5.0, 1)
        score += ml_points

    # 2. Email Authentication (SPF, DKIM, DMARC) (Up to 25 pts)
    if spf_status.lower() == 'fail':
        score += 10.0
        factors.append({
            "name": "SPF Authentication Failure",
            "points": 10.0,
            "reason": "Originating IP is not authorized by the domain's SPF DNS record"
        })
    
    if dkim_status.lower() == 'fail':
        score += 10.0
        factors.append({
            "name": "DKIM Cryptographic Failure",
            "points": 10.0,
            "reason": "DKIM signature does not match or was altered in transit"
        })

    if dmarc_status.lower() == 'fail':
        score += 10.0
        factors.append({
            "name": "DMARC Alignment Failure",
            "points": 10.0,
            "reason": "Domain policy alignment failed on receiving gateway"
        })

    # 3. Domain Age (< 30 days old = suspicious) (15 pts)
    if domain_age_days is not None and domain_age_days < 30:
        score += 15.0
        factors.append({
            "name": "Newly Registered Domain",
            "points": 15.0,
            "reason": f"Sender domain was registered only {domain_age_days} days ago (lookalike/burner domain indicator)"
        })

    # 4. Originating IP in Hosting / Data Center (10 pts)
    if is_hosting_ip:
        score += 10.0
        factors.append({
            "name": "Origin from Cloud / VPS Relay",
            "points": 10.0,
            "reason": "Earliest sending node originates from a VPS/cloud hosting network instead of corporate mail server"
        })

    # 5. Mismatched Sender & Return-Path (10 pts)
    if sender_return_path_mismatch:
        score += 10.0
        factors.append({
            "name": "From & Return-Path Header Mismatch",
            "points": 10.0,
            "reason": "Display sender domain does not match technical Return-Path bounce domain"
        })

    # 6. Deep URL Threat Indicators (Up to 20 pts)
    if extracted_urls:
        high_risk_urls = [u for u in extracted_urls if u.get('risk_score', 0) >= 30.0]
        if high_risk_urls:
            url_pts = 15.0 if any(u.get('is_mismatched_anchor') or u.get('is_ip_based') for u in high_risk_urls) else 10.0
            score += url_pts
            top_flags = high_risk_urls[0].get('threat_flags', ['Suspicious URL structure'])
            factors.append({
                "name": "Deceptive Embedded Hyperlinks",
                "points": url_pts,
                "reason": f"Detected {len(high_risk_urls)} deceptive URL(s): {', '.join(top_flags[:2])}"
            })

    # 7. Malicious / Dangerous Attachment Extension (Up to 25 pts)
    if attachments:
        dangerous_att = [a for a in attachments if a.get('is_suspicious_extension')]
        if dangerous_att:
            att_pts = 20.0
            score += att_pts
            names = [a.get('filename') for a in dangerous_att]
            factors.append({
                "name": "High-Risk Executable / Script Attachment",
                "points": att_pts,
                "reason": f"Email contains hazardous file attachment(s): {', '.join(names[:2])}"
            })

    final_score = int(min(round(score), 100))

    if final_score >= 75:
        risk_level = "Critical"
    elif final_score >= 50:
        risk_level = "High"
    elif final_score >= 25:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "score": final_score,
        "risk_level": risk_level,
        "factors": factors
    }

def record_and_correlate(
    case_id: str,
    domain: str,
    originating_ip: Optional[str],
    label: str = "Investigation",
    score: int = 50,
    risk_level: str = "Medium"
) -> Optional[Dict[str, Any]]:
    """
    Updates the NetworkX campaign correlation graph and detects multi-case threat links.
    """
    global _campaign_graph

    # Add Case Node
    _campaign_graph.add_node(
        case_id,
        label=f"Case: {case_id}",
        type="case",
        score=score,
        risk_level=risk_level
    )
    
    if domain:
        _campaign_graph.add_node(domain, label=f"Domain: {domain}", type="domain")
        _campaign_graph.add_edge(case_id, domain, relation="sender_domain")

    if originating_ip:
        _campaign_graph.add_node(originating_ip, label=f"IP: {originating_ip}", type="ip")
        _campaign_graph.add_edge(case_id, originating_ip, relation="originating_ip")

    # Check how many cases share this domain or IP
    related_cases = set()
    if originating_ip and _campaign_graph.has_node(originating_ip):
        for predecessor in _campaign_graph.predecessors(originating_ip):
            if predecessor != case_id and _campaign_graph.nodes[predecessor].get("type") == "case":
                related_cases.add(predecessor)

    if domain and _campaign_graph.has_node(domain):
        for predecessor in _campaign_graph.predecessors(domain):
            if predecessor != case_id and _campaign_graph.nodes[predecessor].get("type") == "case":
                related_cases.add(predecessor)

    if len(related_cases) > 0:
        camp_id = f"CMP-{abs(hash(originating_ip or domain)) % 10000:04d}"
        
        # Add Campaign Node and link
        _campaign_graph.add_node(camp_id, label=f"Campaign: {camp_id}", type="campaign", risk_level="Critical")
        _campaign_graph.add_edge(camp_id, case_id, relation="campaign_target")
        for rel_case in related_cases:
            _campaign_graph.add_edge(camp_id, rel_case, relation="campaign_target")

        return {
            "campaign_id": camp_id,
            "shared_ip": originating_ip,
            "shared_domain": domain,
            "related_cases_count": len(related_cases) + 1
        }
    return None

def get_campaign_graph_data() -> Dict[str, Any]:
    """
    Exports the NetworkX graph as structured nodes and edges for Cytoscape / D3 frontend visualization.
    """
    global _campaign_graph

    nodes = []
    for node_id, data in _campaign_graph.nodes(data=True):
        nodes.append({
            "id": str(node_id),
            "label": data.get("label", str(node_id)),
            "type": data.get("type", "entity"),
            "risk_level": data.get("risk_level"),
            "score": data.get("score"),
            "details": {k: v for k, v in data.items() if k not in ["label", "type", "risk_level", "score"]}
        })

    edges = []
    for u, v, data in _campaign_graph.edges(data=True):
        edges.append({
            "source": str(u),
            "target": str(v),
            "relation": data.get("relation", "connected_to")
        })

    case_count = sum(1 for n in nodes if n["type"] == "case")
    campaign_count = sum(1 for n in nodes if n["type"] == "campaign")

    return {
        "nodes": nodes,
        "edges": edges,
        "total_cases": case_count,
        "total_campaigns": campaign_count
    }

def rehydrate_graph_from_db(cases: List[Dict[str, Any]]):
    """
    Rebuilds the in-memory NetworkX graph from persisted cases on server startup.
    """
    global _campaign_graph
    _campaign_graph.clear()
    
    for c in reversed(cases):
        case_id = c.get("id")
        headers = c.get("headers", {})
        from_hdr = headers.get("from_header", "")
        domain = from_hdr.split("@")[-1].rstrip(">").strip() if "@" in from_hdr else ""
        trace = c.get("trace", [])
        orig_ip = trace[0].get("ip") if trace else None
        
        fraud_score = c.get("fraud_score", {})
        score = fraud_score.get("score", 50)
        risk = fraud_score.get("risk_level", "Low")
        
        record_and_correlate(case_id, domain, orig_ip, score=score, risk_level=risk)

