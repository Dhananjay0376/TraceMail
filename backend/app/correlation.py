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
    sender_return_path_mismatch: bool = False
) -> Dict[str, Any]:
    \"\"\"
    Transparent, explainable fraud-confidence score (0 - 100)
    as required by SIH PS26106.
    \"\"\"
    score = 0.0
    factors = []

    # 1. NLP / ML Detection Model (0 - 45 pts)
    if is_phishing_label:
        ml_points = round(model_prob * 45.0, 1)
        score += ml_points
        factors.append({
            \"name\": \"NLP Model Threat Detection\",
            \"points\": ml_points,
            \"reason\": f\"Text classification flagged high threat patterns ({round(model_prob*100, 1)}% confidence)\"
        })
    else:
        ml_points = round((1.0 - model_prob) * 10.0, 1)
        score += ml_points

    # 2. Email Authentication (SPF, DKIM, DMARC) (Up to 30 pts)
    if spf_status.lower() == 'fail':
        score += 10.0
        factors.append({
            \"name\": \"SPF Authentication Failure\",
            \"points\": 10.0,
            \"reason\": \"Originating IP is not authorized by the domain's SPF DNS record\"
        })
    
    if dkim_status.lower() == 'fail':
        score += 10.0
        factors.append({
            \"name\": \"DKIM Cryptographic Failure\",
            \"points\": 10.0,
            \"reason\": \"DKIM signature does not match or was altered in transit\"
        })

    if dmarc_status.lower() == 'fail':
        score += 10.0
        factors.append({
            \"name\": \"DMARC Alignment Failure\",
            \"points\": 10.0,
            \"reason\": \"Domain policy alignment failed on receiving gateway\"
        })

    # 3. Domain Age (< 30 days old = suspicious) (15 pts)
    if domain_age_days is not None and domain_age_days < 30:
        score += 15.0
        factors.append({
            \"name\": \"Newly Registered Domain\",
            \"points\": 15.0,
            \"reason\": f\"Sender domain was registered only {domain_age_days} days ago (lookalike/burner domain indicator)\"
        })

    # 4. Originating IP in Hosting / Data Center (10 pts)
    if is_hosting_ip:
        score += 10.0
        factors.append({
            \"name\": \"Origin from Cloud / VPS Relay\",
            \"points\": 10.0,
            \"reason\": \"Earliest sending node originates from a VPS/cloud hosting network instead of corporate mail server\"
        })

    # 5. Mismatched Sender & Return-Path (10 pts)
    if sender_return_path_mismatch:
        score += 10.0
        factors.append({
            \"name\": \"From & Return-Path Header Mismatch\",
            \"points\": 10.0,
            \"reason\": \"Display sender domain does not match technical Return-Path bounce domain\"
        })

    final_score = int(min(round(score), 100))

    if final_score >= 75:
        risk_level = \"Critical\"
    elif final_score >= 50:
        risk_level = \"High\"
    elif final_score >= 25:
        risk_level = \"Medium\"
    else:
        risk_level = \"Low\"

    return {
        \"score\": final_score,
        \"risk_level\": risk_level,
        \"factors\": factors
    }

def record_and_correlate(case_id: str, domain: str, originating_ip: Optional[str]) -> Optional[Dict[str, Any]]:
    \"\"\"
    Updates the NetworkX campaign correlation graph and checks for multi-case links.
    \"\"\"
    global _campaign_graph

    _campaign_graph.add_node(case_id, type=\"case\")
    
    if domain:
        _campaign_graph.add_node(domain, type=\"domain\")
        _campaign_graph.add_edge(case_id, domain, relation=\"sender_domain\")

    if originating_ip:
        _campaign_graph.add_node(originating_ip, type=\"ip\")
        _campaign_graph.add_edge(case_id, originating_ip, relation=\"originating_ip\")

    # Check how many cases share this domain or IP
    related_cases = set()
    if originating_ip and _campaign_graph.has_node(originating_ip):
        for predecessor in _campaign_graph.predecessors(originating_ip):
            if predecessor != case_id and _campaign_graph.nodes[predecessor].get(\"type\") == \"case\":
                related_cases.add(predecessor)

    if domain and _campaign_graph.has_node(domain):
        for predecessor in _campaign_graph.predecessors(domain):
            if predecessor != case_id and _campaign_graph.nodes[predecessor].get(\"type\") == \"case\":
                related_cases.add(predecessor)

    if len(related_cases) > 0:
        return {
            \"campaign_id\": f\"CMP-{abs(hash(originating_ip or domain)) % 10000:04d}\",
            \"shared_ip\": originating_ip,
            \"shared_domain\": domain,
            \"related_cases_count\": len(related_cases)
        }
    return None
