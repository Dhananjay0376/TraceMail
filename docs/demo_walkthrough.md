# TraceMail: SIH Jury Presentation & Demo Walkthrough Script

This guide gives your 6-person team a scripted 90-second live demonstration narrative and rehearsed answers for common judge questions.

---

## ⏱️ 90-Second Live Demo Narrative

### Phase 1: The Problem & The Phishing Attack (0–30s)
1. **Presenter**: *"Good morning esteemed jury. Traditional email security filters stop at simple keyword blocking. When advanced threat actors launch spoofed or Business Email Compromise attacks, organizations have no easy way to trace origin infrastructure or link campaigns. We built TraceMail."*
2. **Action**: Click **"RBI Urgent KYC Verification Phish"** on the Quick-Demo bar.
3. **Presenter**: *"Here is an email pretending to be an urgent KYC alert from the Reserve Bank of India. TraceMail immediately flags this with a **95/100 Critical Risk Score**. Notice the transparent breakdown: our fine-tuned DistilBERT transformer detected 99% phishing probability, SPF and DKIM failed, and our WHOIS module discovered the sending domain was registered only 3 days ago. On the interactive map, our Received header parser walked back through the relay chain to geolocate the origin: an offshore bulletproof hosting server in Moscow."*

### Phase 2: The BEC & Borderline Nuance (30–60s)
1. **Presenter**: *"Now look at the hardest attack in modern enterprise security: Business Email Compromise (BEC)."*
2. **Action**: Click **"CEO Wire Transfer & Invoice BEC"** on the Quick-Demo bar.
3. **Presenter**: *"A BEC email contains no viruses or obvious spam words—it’s a polite request from a CEO asking for a confidential wire transfer. Traditional filters let this through. But TraceMail caught it: our NLP heuristics flagged the payment cutoff cues, our forensics detected display-name spoofing with a divergent Reply-To routing to a fresh lookalike domain, and the origin IP maps directly to a generic DigitalOcean VPS in Amsterdam. Score: 87/100."*
4. **Action**: Click **"Advisory Mailing List Forward"**.
5. **Presenter**: *"Notice our system's nuance: this is a legitimate forwarded email. It failed SPF due to forwarding, but because DKIM passed and the domain is 5 years old, TraceMail scores it as a safe borderline (45/100) instead of blocking it. That solves the false-positive problem."*

### Phase 3: The Campaign Correlation Payoff (60–90s)
1. **Presenter**: *"Finally, our defining capability: Graph-based threat attribution."*
2. **Action**: Switch to the **"Campaign Correlation"** tab.
3. **Presenter**: *"When an attacker launches multiple attacks targeting different departments, they often reuse underlying infrastructure. Using NetworkX, TraceMail models relationships between cases, IPs, and domains. Here, the system automatically identified **Threat Cluster CAMP-001**: both the Banking Phish and the IT Credential Expiry Phish originated from the exact same rogue IP (`185.220.101.5`) and share the same Reply-To collector. We don't just stop single emails; we expose full cybercrime campaigns."*
4. **Action**: Click **"Forensic Report"** and show the cryptographic SHA-256 evidence digest and PII masking toggle.
5. **Presenter**: *"Every investigation produces a NIST-compliant evidentiary report with a SHA-256 chain-of-custody stamp, ready for law enforcement and CERT-In coordination. Thank you."*

---

## 🎯 Tough Judge Questions & Winning Answers

### Q1: "Why not just use Gmail's or Microsoft's built-in spam filter?"
> **Answer**: *"Commercial email gateways are black boxes designed to silently drop or move mail to junk. They do not provide origin IP tracing, hop latency reconstruction, WHOIS domain age correlation, or cross-incident campaign clustering. When a bank or government department is targeted by BEC fraud, security teams and law enforcement need forensic evidence—not just a spam folder."*

### Q2: "How do you avoid high false-positive rates on forwarded emails?"
> **Answer**: *"We do not rely on binary SPF checks. Legitimate forwarded emails frequently fail SPF because the forwarding server's IP is not in the original sender's SPF record. TraceMail uses an explainable weighted matrix where DKIM cryptographic signatures (which survive forwarding unaltered) and domain age prevent legitimate emails from exceeding the malicious threshold."*

### Q3: "What if the venue has no internet or external APIs are blocked?"
> **Answer**: *"TraceMail was built with complete offline resilience. The backend includes both a fine-tuned DistilBERT transformer and a serialized local TF-IDF + Logistic Regression engine (`baseline_model.pkl`). Geolocation and WHOIS also include pre-cached offline intelligence for all test vectors, ensuring the platform never crashes or spins indefinitely even with no Wi-Fi."*

### Q4: "How do you protect employee privacy and handle compliance?"
> **Answer**: *"TraceMail includes configurable data minimisation and PII masking toggles built directly into the forensic reporting module. Personal names and email usernames are redacted before exporting reports, while preserving cryptographic SHA-256 hashes to maintain evidence integrity under legal standards."*
