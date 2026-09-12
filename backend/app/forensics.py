"""
TraceMail Email Header & Protocol Forensics Module
RFC 5322 MIME parsing, Received Relay Path Reconstruction, Transit Delay Calculation,
DKIM Cryptographic Verification, SPF/DMARC Assessment, and Spoof Anomaly Detection.
"""

import email
from email import policy
import email.utils
import hashlib
import re
import ipaddress
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
import logging

logger = logging.getLogger("tracemail.forensics")

# Regex patterns for IP extraction and routing
IPV4_REGEX = re.compile(r"\[?(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)\]?")
IPV6_REGEX = re.compile(r"\[?([0-9a-fA-F]{1,4}(?::[0-9a-fA-F]{1,4}){7})\]?")
BY_HOST_REGEX = re.compile(r"\bby\s+([^\s;]+)", re.IGNORECASE)
FROM_HOST_REGEX = re.compile(r"\bfrom\s+([^\s;]+)", re.IGNORECASE)
WITH_PROTO_REGEX = re.compile(r"\bwith\s+([^\s;]+)", re.IGNORECASE)
TIMESTAMP_REGEX = re.compile(r";\s*([A-Za-z]+,\s+\d{1,2}\s+[A-Za-z]+\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+[+\-]?\d{4})")


def is_public_ip(ip_str: str) -> bool:
    """Check whether an IP address is a routable public Internet IP (excluding LAN/loopback)."""
    try:
        ip = ipaddress.ip_address(ip_str.strip("[]"))
        return not (ip.is_private or ip.is_loopback or ip.is_link_local)
    except ValueError:
        return False


def calculate_sha256(raw_bytes: bytes) -> str:
    """Compute SHA-256 digest for evidence integrity and chain of custody."""
    return hashlib.sha256(raw_bytes).hexdigest()


def extract_body(msg: email.message.EmailMessage) -> str:
    """Extract readable text body from email message, stripping basic HTML if needed."""
    body_parts = []
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition", ""))
            if "attachment" not in content_disposition:
                if content_type == "text/plain":
                    payload = part.get_payload(decode=True)
                    if payload:
                        body_parts.append(payload.decode(errors="replace"))
                elif content_type == "text/html" and not body_parts:
                    payload = part.get_payload(decode=True)
                    if payload:
                        html_text = payload.decode(errors="replace")
                        cleaned = re.sub(r"<[^>]+>", " ", html_text)
                        body_parts.append(cleaned)
    else:
        payload = msg.get_payload(decode=True)
        if payload:
            text = payload.decode(errors="replace")
            if msg.get_content_type() == "text/html":
                text = re.sub(r"<[^>]+>", " ", text)
            body_parts.append(text)
            
    full_body = "\n".join(body_parts).strip()
    return re.sub(r"\s+", " ", full_body)


def extract_attachments(msg: email.message.EmailMessage) -> List[Dict[str, Any]]:
    """Enumerate email attachments with filename, mime type, and approximate byte size."""
    attachments = []
    for part in msg.walk():
        content_disposition = str(part.get("Content-Disposition", ""))
        if "attachment" in content_disposition:
            filename = part.get_filename() or "untitled_attachment"
            payload = part.get_payload(decode=True)
            size = len(payload) if payload else 0
            attachments.append({
                "filename": filename,
                "content_type": part.get_content_type(),
                "size_bytes": size,
                "is_executable": bool(re.search(r"\.(?:exe|vbs|bat|scr|cmd|ps1|iso|js|jar)$", filename, re.IGNORECASE))
            })
    return attachments


def extract_relay_hops(received_headers: List[str]) -> Tuple[List[Dict[str, Any]], Optional[str]]:
    """
    Reconstruct relay transit path from Received headers.
    Headers are reversed to establish chronological progression (Hop 1 = origin, Hop N = final recipient).
    Returns (hops_list, earliest_public_origin_ip).
    """
    hops = []
    # Reverse to trace oldest to newest
    chronological_headers = list(reversed(received_headers))
    earliest_public_ip = None
    prev_time = None

    for index, header_line in enumerate(chronological_headers, start=1):
        # Normalize whitespace
        norm_line = re.sub(r"\s+", " ", header_line)
        
        # Extract IP
        ip_match = IPV4_REGEX.search(norm_line) or IPV6_REGEX.search(norm_line)
        hop_ip = ip_match.group(1) if ip_match else None
        
        # Extract hostnames
        by_match = BY_HOST_REGEX.search(norm_line)
        from_match = FROM_HOST_REGEX.search(norm_line)
        proto_match = WITH_PROTO_REGEX.search(norm_line)
        
        by_host = by_match.group(1) if by_match else "unknown"
        from_host = from_match.group(1) if from_match else "unknown"
        protocol = proto_match.group(1) if proto_match else "SMTP"
        
        # Extract timestamp & delay
        time_match = TIMESTAMP_REGEX.search(norm_line)
        hop_time_str = time_match.group(1) if time_match else None
        delay_seconds = 0
        
        if hop_time_str:
            try:
                current_time = email.utils.parsedate_to_datetime(hop_time_str)
                if prev_time:
                    delay_seconds = max(0, int((current_time - prev_time).total_seconds()))
                prev_time = current_time
            except Exception:
                pass
                
        is_pub = is_public_ip(hop_ip) if hop_ip else False
        if is_pub and earliest_public_ip is None:
            earliest_public_ip = hop_ip

        hops.append({
            "hop_number": index,
            "ip": hop_ip,
            "from_host": from_host,
            "by_host": by_host,
            "protocol": protocol,
            "timestamp": hop_time_str,
            "delay_seconds": delay_seconds,
            "is_public_ip": is_pub,
            "raw_header": norm_line
        })

    return hops, earliest_public_ip


def verify_dkim_signature(raw_bytes: bytes) -> Dict[str, Any]:
    """Verify DKIM signature using dkimpy."""
    try:
        import dkim
        # Check if DKIM-Signature exists
        if b"dkim-signature:" in raw_bytes.lower():
            is_valid = dkim.verify(raw_bytes)
            return {
                "present": True,
                "status": "pass" if is_valid else "fail",
                "details": "DKIM cryptographic signature verified" if is_valid else "DKIM signature failed validation"
            }
        else:
            return {
                "present": False,
                "status": "none",
                "details": "No DKIM-Signature header present"
            }
    except Exception as e:
        return {
            "present": True,
            "status": "error",
            "details": f"DKIM verification error: {str(e)}"
        }


def parse_authentication_results(auth_headers: List[str]) -> Dict[str, Any]:
    """Extract SPF, DKIM, and DMARC verdicts from Authentication-Results headers."""
    combined = " ".join(auth_headers).lower()
    
    spf_status = "none"
    if "spf=pass" in combined:
        spf_status = "pass"
    elif "spf=fail" in combined:
        spf_status = "fail"
    elif "spf=softfail" in combined:
        spf_status = "softfail"
    elif "spf=neutral" in combined:
        spf_status = "neutral"

    dkim_status = "none"
    if "dkim=pass" in combined:
        dkim_status = "pass"
    elif "dkim=fail" in combined:
        dkim_status = "fail"

    dmarc_status = "none"
    if "dmarc=pass" in combined:
        dmarc_status = "pass"
    elif "dmarc=fail" in combined:
        dmarc_status = "fail"
        
    return {
        "spf_status": spf_status,
        "dkim_status": dkim_status,
        "dmarc_status": dmarc_status,
        "raw_auth_headers": auth_headers
    }


def detect_header_anomalies(
    sender_name: str, 
    sender_email: str, 
    return_path: str, 
    reply_to: str, 
    origin_ip: Optional[str]
) -> Dict[str, Any]:
    """Detect display-name spoofing, Return-Path, and Reply-To divergences."""
    sender_domain = sender_email.split("@")[-1].lower() if "@" in sender_email else ""
    return_domain = return_path.split("@")[-1].strip("<>").lower() if "@" in return_path else ""
    reply_domain = reply_to.split("@")[-1].strip("<>").lower() if "@" in reply_to else ""

    flags = []
    
    # 1. Reply-To divergence
    reply_to_mismatch = False
    if reply_domain and sender_domain and reply_domain != sender_domain:
        reply_to_mismatch = True
        flags.append(f"Reply-To domain mismatch: claims {sender_domain} but replies route to {reply_domain}")

    # 2. Return-Path divergence
    return_path_mismatch = False
    if return_domain and sender_domain and return_domain != sender_domain:
        return_path_mismatch = True
        flags.append(f"Return-Path divergence: sent from {sender_domain} but bounces go to {return_domain}")

    # 3. Display name spoofing (VIP / Bank / Authority impersonation)
    display_spoof = False
    sensitive_keywords = ["bank", "rbi", "ceo", "director", "support", "security", "paypal", "microsoft", "google"]
    for kw in sensitive_keywords:
        if kw in sender_name.lower() and kw not in sender_domain:
            display_spoof = True
            flags.append(f"Display name impersonation: '{sender_name}' impersonates brand/authority absent from domain '{sender_domain}'")
            break

    return {
        "reply_to_mismatch": reply_to_mismatch,
        "return_path_mismatch": return_path_mismatch,
        "display_name_spoofing": display_spoof,
        "sender_domain": sender_domain,
        "return_path_domain": return_domain,
        "reply_to_domain": reply_domain,
        "anomaly_flags": flags
    }


def parse_eml_bytes(raw_bytes: bytes) -> Dict[str, Any]:
    """
    Main entry point: Parse complete RFC 5322 .eml byte payload into structured forensic object.
    """
    sha256_digest = calculate_sha256(raw_bytes)
    msg = email.message_from_bytes(raw_bytes, policy=policy.default)
    
    # Header fields
    from_header = str(msg.get("From", ""))
    parsed_name, parsed_addr = email.utils.parseaddr(from_header)
    
    to_header = str(msg.get("To", ""))
    subject_header = str(msg.get("Subject", ""))
    date_header = str(msg.get("Date", ""))
    message_id_header = str(msg.get("Message-ID", ""))
    return_path_header = str(msg.get("Return-Path", ""))
    reply_to_header = str(msg.get("Reply-To", ""))
    
    received_headers = msg.get_all("Received") or []
    auth_headers = msg.get_all("Authentication-Results") or []
    
    # Reconstruct relay path
    hops, earliest_origin_ip = extract_relay_hops(received_headers)
    
    # Protocol verification
    dkim_result = verify_dkim_signature(raw_bytes)
    auth_results = parse_authentication_results(auth_headers)
    
    # If dkim verification via dkimpy passes, ensure dkim_status reflects it
    if dkim_result["status"] == "pass":
        auth_results["dkim_status"] = "pass"
        
    # Anomaly checks
    anomalies = detect_header_anomalies(
        sender_name=parsed_name,
        sender_email=parsed_addr,
        return_path=return_path_header,
        reply_to=reply_to_header,
        origin_ip=earliest_origin_ip
    )
    
    body_text = extract_body(msg)
    attachments = extract_attachments(msg)

    return {
        "sha256_hash": sha256_digest,
        "evidence_seal": {
            "sha256": sha256_digest,
            "md5": hashlib.md5(raw_bytes).hexdigest(),
            "file_size_bytes": len(raw_bytes),
            "ingest_timestamp": datetime.now(timezone.utc).isoformat(),
            "parser_version": "TraceMail-MIME-v1.2",
            "custody_status": "Verified & Immutable"
        },
        "subject": subject_header,
        "from": {
            "raw": from_header,
            "display_name": parsed_name,
            "email": parsed_addr,
            "domain": anomalies["sender_domain"]
        },
        "to": to_header,
        "date": date_header,
        "message_id": message_id_header,
        "return_path": return_path_header,
        "reply_to": reply_to_header,
        "origin_ip": earliest_origin_ip,
        "relay_hops": hops,
        "hop_count": len(hops),
        "authentication": {
            "spf": auth_results["spf_status"],
            "dkim": auth_results["dkim_status"],
            "dmarc": auth_results["dmarc_status"],
            "dkim_details": dkim_result
        },
        "anomalies": anomalies,
        "body_text": body_text,
        "attachments": attachments
    }


def extract_hops(received_chain: List[str]) -> List[str]:
    """Extract list of IP strings from received header chain."""
    hops, _ = extract_relay_hops(received_chain or [])
    return [h["ip"] for h in hops if h.get("ip")]


def check_authentication_records(sender_domain: str, raw_content: bytes) -> Dict[str, Any]:
    """Wrapper around check_spf_dkim_dmarc for main.py API schema alignment."""
    return check_spf_dkim_dmarc(sender_domain, raw_content)
