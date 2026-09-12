// Comprehensive Mock Store for TraceMail Cybersecurity Intelligence Platform
// TODO: connect to backend API for live ingestion, threat intelligence feeds, and cases

export const DEMO_USER = {
  id: "demo-shri",
  isDemo: true,
  name: "Shri",
  email: "shri@tracemail.ai",
  org: "Apex Global Forensics",
  role: "analyst",
  avatar: "https://ui-avatars.com/api/?name=Shri&background=1d4ed8&color=fff",
  isFirstTime: false,
};

export const Demo_User = DEMO_USER;

export const MOCK_STATS = {
  totalScanned: 14892,
  scannedGrowth: "+12.4% this week",
  highRiskCount: 142,
  highRiskGrowth: "+8 new today",
  activeCases: 9,
  casesGrowth: "3 awaiting triage",
  avgResponseTime: "1.4 min",
  responseGrowth: "24% faster than SLA",
  attackOriginsCount: 38,
  cleanRate: "94.2%",
};

export const MOCK_ATTACK_ORIGINS = [
  { id: 1, city: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173, threatCount: 48, topThreat: "CEO Wire Spoofing", level: "critical" },
  { id: 2, city: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, threatCount: 36, topThreat: "DocuSign Credential Harvester", level: "critical" },
  { id: 3, city: "Bucharest", country: "Romania", lat: 44.4268, lon: 26.1025, threatCount: 22, topThreat: "Lookalike Invoicing", level: "high" },
  { id: 4, city: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041, threatCount: 19, topThreat: "Bulletproof Relay Proxy", level: "high" },
  { id: 5, city: "Shenzhen", country: "China", lat: 22.5431, lon: 114.0579, threatCount: 15, topThreat: "Spear Phishing Probe", level: "medium" },
  { id: 6, city: "Sao Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333, threatCount: 11, topThreat: "Banking Trojan Lures", level: "medium" },
];

export const MOCK_SAMPLES = [
  {
    id: "sample-wire-fraud",
    name: "Executive Wire Transfer Request (CEO Spoof)",
    subject: "URGENT: Confidential Acquisition Wire Instructions - Act Today",
    sender: "Sarah Jenkins <s.jenkins@corp-apexdefense.com>",
    fromDisplay: "Sarah Jenkins, Chief Executive Officer",
    replyTo: "exec-payments88@protonmail-gateway.top",
    recipient: "david.miller@apexdefense.com (CFO)",
    date: "Sep 11, 2026, 09:42 AM EST",
    clientIp: "185.220.101.44",
    riskScore: 96,
    verdict: "FRAUD_CONFIRMED",
    verdictLabel: "Fraud / Phishing Confirmed",
    verdictColor: "red",
    urgencyLevel: "Extreme (Coercive Financial Transfer)",
    plainEnglishSummary: "This email is a targeted CEO Impersonation (Business Email Compromise). The attacker registered an unregistered lookalike domain 'corp-apexdefense.com', forced Reply-To to an anonymous encrypted inbox in Russia, and failed both SPF and DMARC verification.",
    executiveNotes: [
      "Spoofed Executive: From address displays CEO name but routes through bulletproof hosting.",
      "Hidden Reply-To Trap: Replies will silently go to an offshore ProtonMail clone address.",
      "Psychological Manipulation: High urgency, secrecy demand ('Keep this strictly confidential until closing').",
      "Banking Instructions: Contains fraudulent SWIFT routing numbers linked to money-mule accounts in Cyprus."
    ],
    auth: {
      spf: { status: "FAIL", detail: "IP 185.220.101.44 is not authorized in SPF record for apexdefense.com", explanation: "The server sending this email has no legitimate permission from the domain owner." },
      dkim: { status: "FAIL", detail: "Signature header present but cryptographic hash mismatch (body altered or forged key)", explanation: "The digital signature does not match, meaning the email was tampered with in transit." },
      dmarc: { status: "FAIL", detail: "Policy: p=reject; Strict alignment failed for both From & Return-Path", explanation: "The organization has explicitly instructed mail servers worldwide to reject this forged mail." },
      ptr: { status: "WARN", detail: "Reverse DNS resolves to dynamic-dialup-tor.spidernet.ru (not an enterprise mail server)", explanation: "The sending machine is a compromised personal or TOR exit node, not an official mail server." }
    },
    geo: {
      originIp: "185.220.101.44",
      city: "Moscow",
      region: "Central Federal District",
      country: "Russian Federation",
      countryCode: "RU",
      asn: "AS49453 (Global Telehost LLC)",
      isp: "SpiderNet Bulletproof Operations",
      lat: 55.7558,
      lon: 37.6173,
      isHosting: true,
      isVpn: true,
      isTor: true,
      isBotnet: true,
      threatFeeds: ["AbuseIPDB 100% confidence of abuse", "Spamhaus DROP List", "AlienVault OTX Malicious Node"]
    },
    relayHops: [
      { hop: 1, ip: "185.220.101.44", host: "tor-exit-04.spidernet.ru", city: "Moscow", country: "RU", lat: 55.7558, lon: 37.6173, delay: "0s", org: "AS49453 Bulletproof ISP" },
      { hop: 2, ip: "91.214.124.8", host: "relay-ams-nl.darknodes.is", city: "Amsterdam", country: "NL", lat: 52.3676, lon: 4.9041, delay: "+1.4s", org: "AS20860 Hostserver Europe" },
      { hop: 3, ip: "104.244.42.1", host: "mail-mta-inbound.apexdefense.com", city: "Ashburn", country: "US", lat: 39.0438, lon: -77.4874, delay: "+0.8s", org: "Corporate Perimeter Gateway" }
    ],
    domainIntel: {
      registeredDomain: "corp-apexdefense.com",
      canonicalDomain: "apexdefense.com",
      similarityScore: "94% Typosquatting Match",
      registrar: "RegTime Ltd (RU)",
      createdDate: "Sep 7, 2026 (4 days ago)",
      expiresDate: "Sep 7, 2027",
      domainAge: "4 days (Extreme Anomaly)",
      privacyProtected: true,
      mxRecords: ["10 mail.corp-apexdefense.com (IP: 185.220.101.44)"],
      dnsSec: "Disabled"
    },
    correlation: {
      campaignId: "CAMP-2026-CYRUS-WIRE",
      campaignName: "Operation Velvet Falcon (Executive BEC)",
      confidence: 94,
      threatActor: "TA505 / FIN7 Affiliate Cluster",
      similarCases: ["CASE-1042", "CASE-1088"],
      indicators: [
        { type: "domain", value: "corp-apexdefense.com", risk: "critical" },
        { type: "ip", value: "185.220.101.44", risk: "critical" },
        { type: "reply_to", value: "exec-payments88@protonmail-gateway.top", risk: "critical" },
        { type: "iban", value: "CY12 0020 0128 0000 0012 3456 78", risk: "high" }
      ]
    },
    rawHeaders: `Delivered-To: david.miller@apexdefense.com
Received: by 2002:a05:6e02:1189:: with SMTP id o9csp1245802
        Wed, 11 Sep 2026 09:42:15 -0400 (EDT)
X-Received: by 2002:a17:907:9512:: with SMTP id u18mr112948
        Wed, 11 Sep 2026 09:42:14 -0400 (EDT)
ARC-Authentication-Results: i=1; mx.google.com;
       spf=fail (google.com: domain of s.jenkins@corp-apexdefense.com does not designate 185.220.101.44 as permitted sender)
       dkim=fail header.i=@corp-apexdefense.com header.s=default header.b=invalid;
       dmarc=fail (p=REJECT sp=REJECT dis=REJECT) header.from=apexdefense.com
Return-Path: <bounce-9482@corp-apexdefense.com>
Received: from tor-exit-04.spidernet.ru (tor-exit-04.spidernet.ru. [185.220.101.44])
        by mail-mta-inbound.apexdefense.com with ESMTP id q1948275819
        for <david.miller@apexdefense.com>; Wed, 11 Sep 2026 09:42:12 -0400
From: "Sarah Jenkins" <s.jenkins@corp-apexdefense.com>
Reply-To: exec-payments88@protonmail-gateway.top
To: david.miller@apexdefense.com
Subject: URGENT: Confidential Acquisition Wire Instructions - Act Today
Date: Wed, 11 Sep 2026 09:42:08 -0400
Message-ID: <849204128.20260911094208@corp-apexdefense.com>
X-Mailer: Custom CyberBot v4.19
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8`
  },
  {
    id: "sample-docusign-phish",
    name: "DocuSign Signature Request (Credential Harvester)",
    subject: "Action Required: Please DocuSign: Q3 Employee Stock Purchase Agreement.pdf",
    sender: "DocuSign Automated Notifications <dse@docusign-secure-verify.net>",
    fromDisplay: "DocuSign Signatures Engine",
    replyTo: "no-reply@docusign-secure-verify.net",
    recipient: "all-staff@apexdefense.com",
    date: "Sep 11, 2026, 08:15 AM EST",
    clientIp: "102.129.144.92",
    riskScore: 92,
    verdict: "FRAUD_CONFIRMED",
    verdictLabel: "Fraud / Phishing Confirmed",
    verdictColor: "red",
    urgencyLevel: "High (Immediate Signatures Demanded)",
    plainEnglishSummary: "This email impersonates DocuSign to steal corporate SSO passwords. The target link does not point to docusign.com, but to a Russian-hosted credential harvesting landing page cloned with high visual fidelity.",
    executiveNotes: [
      "Brand Abuse: Stole authentic DocuSign logos and email templates.",
      "Phishing Link: Button routes through a bit.ly shortener to https://docusign-secure-verify.net/sso-login.",
      "Broad Distribution: Sent to all-staff alias in an attempt to compromise any employee credentials.",
      "Immediate Remediation: Security operations has already purged this message from mailboxes."
    ],
    auth: {
      spf: { status: "FAIL", detail: "IP 102.129.144.92 is outside authorized CIDR blocks for docusign.com", explanation: "DocuSign publishes strict sender lists; this IP is entirely unauthorized." },
      dkim: { status: "FAIL", detail: "Domain key selector dse_2026 not found on author domain DNS", explanation: "The email claimed to have a cryptographic signature from DocuSign, but verification failed." },
      dmarc: { status: "FAIL", detail: "Policy: p=reject; Alignment failed on author address", explanation: "DMARC rejected the message because the sender claimed to be DocuSign without proof." },
      ptr: { status: "FAIL", detail: "No reverse DNS record exists for 102.129.144.92", explanation: "The server has no legitimate hostname configured in internet registry." }
    },
    geo: {
      originIp: "102.129.144.92",
      city: "Lagos",
      region: "Lagos State",
      country: "Nigeria",
      countryCode: "NG",
      asn: "AS37148 (MainOne Cable Company)",
      isp: "Cobalt Shield Residential VPN",
      lat: 6.5244,
      lon: 3.3792,
      isHosting: false,
      isVpn: true,
      isTor: false,
      isBotnet: true,
      threatFeeds: ["OpenPhish Feed (Confirmed Active Target)", "PhishTank ID #8849102"]
    },
    relayHops: [
      { hop: 1, ip: "102.129.144.92", host: "client-102-129.mainone.net", city: "Lagos", country: "NG", lat: 6.5244, lon: 3.3792, delay: "0s", org: "AS37148 West Africa" },
      { hop: 2, ip: "198.51.100.22", host: "proxy-transit-us.cloud.net", city: "New York", country: "US", lat: 40.7128, lon: -74.0060, delay: "+0.4s", org: "AS15169 Transit" },
      { hop: 3, ip: "104.244.42.1", host: "mail-mta-inbound.apexdefense.com", city: "Ashburn", country: "US", lat: 39.0438, lon: -77.4874, delay: "+0.3s", org: "Corporate Perimeter Gateway" }
    ],
    domainIntel: {
      registeredDomain: "docusign-secure-verify.net",
      canonicalDomain: "docusign.com",
      similarityScore: "98% Brand Impersonation",
      registrar: "NameCheap Inc (Private Registration)",
      createdDate: "Sep 9, 2026 (2 days ago)",
      expiresDate: "Sep 9, 2027",
      domainAge: "2 days (Brand Impersonation Threat)",
      privacyProtected: true,
      mxRecords: ["No MX records configured (Send-Only Engine)"],
      dnsSec: "Disabled"
    },
    correlation: {
      campaignId: "CAMP-2026-DOCU-HARVEST",
      campaignName: "DocuPhish Corporate Credential Scrape",
      confidence: 96,
      threatActor: "Unknown Syndicate (West Africa / Telegram PhishHub)",
      similarCases: ["CASE-1011", "CASE-1034", "CASE-1067"],
      indicators: [
        { type: "domain", value: "docusign-secure-verify.net", risk: "critical" },
        { type: "url", value: "https://docusign-secure-verify.net/sso-login?session=728", risk: "critical" },
        { type: "ip", value: "102.129.144.92", risk: "high" }
      ]
    },
    rawHeaders: `Delivered-To: all-staff@apexdefense.com
Received: from mail-proxy.docusign-secure-verify.net (client-102-129.mainone.net [102.129.144.92])
        by mail-mta-inbound.apexdefense.com with ESMTP id d91823901
        for <all-staff@apexdefense.com>; Wed, 11 Sep 2026 08:15:10 -0400
Authentication-Results: mail-mta-inbound.apexdefense.com;
       spf=fail (sender IP 102.129.144.92 not in docusign.com record);
       dkim=fail (bad signature);
       dmarc=fail (p=reject) header.from=docusign.com
From: "DocuSign Automation" <dse@docusign-secure-verify.net>
Reply-To: no-reply@docusign-secure-verify.net
Subject: Action Required: Please DocuSign: Q3 Employee Stock Purchase Agreement.pdf
Date: Wed, 11 Sep 2026 08:15:02 -0400`
  },
  {
    id: "sample-vendor-invoice",
    name: "Vendor Invoice Overdue (Typo-squatted Domain)",
    subject: "OVERDUE NOTICE: Final Demand - Invoice #INV-2026-9041A for Server Hardware",
    sender: "Billing Department <accounts@dell-enteprise-support.com>",
    fromDisplay: "Dell Enterprise Logistics Dept",
    replyTo: "collections@dell-enteprise-support.com",
    recipient: "procurement@apexdefense.com",
    date: "Sep 10, 2026, 04:30 PM EST",
    clientIp: "185.193.88.19",
    riskScore: 84,
    verdict: "HIGH_RISK",
    verdictLabel: "High Risk Threat",
    verdictColor: "orange",
    urgencyLevel: "Elevated (Threat of Service Disconnection)",
    plainEnglishSummary: "This email uses a subtle lookalike domain ('dell-enteprise-support.com' missing the 'r' in enterprise). The attached PDF contains malicious macros designed to install an infostealer.",
    executiveNotes: [
      "Typosquatting: Missing 'r' in 'enteprise'. Difficult for busy accountants to spot.",
      "Malicious Attachment: PDF 'INV-2026-9041A.pdf' embeds an active obfuscated JavaScript payload.",
      "Origin: Routed from an unregulated VPS in Bucharest, Romania.",
      "Financial Risk: Demands $48,500 immediate wire payment."
    ],
    auth: {
      spf: { status: "PASS", detail: "SPF passes for the fraudulent domain itself (dell-enteprise-support.com)", explanation: "Attacker configured SPF for their lookalike domain to bypass basic spam filters." },
      dkim: { status: "PASS", detail: "Valid cryptographic signature from the rogue domain", explanation: "Attacker owns the lookalike domain and generated their own valid key." },
      dmarc: { status: "WARN", detail: "Domain has no DMARC record published (p=none)", explanation: "The fake domain was created recently and lacks full DMARC governance." },
      ptr: { status: "PASS", detail: "Resolves to vps-bucharest-node19.datacenter.ro", explanation: "Standard hosting server." }
    },
    geo: {
      originIp: "185.193.88.19",
      city: "Bucharest",
      region: "Ilfov",
      country: "Romania",
      countryCode: "RO",
      asn: "AS57169 (M247 Ltd Europe)",
      isp: "M247 Cloud Hosting Solutions",
      lat: 44.4268,
      lon: 26.1025,
      isHosting: true,
      isVpn: false,
      isTor: false,
      isBotnet: false,
      threatFeeds: ["VirusTotal 12/70 Malicious Vendors", "URLHaus Malicious Payload Host"]
    },
    relayHops: [
      { hop: 1, ip: "185.193.88.19", host: "vps-bucharest.m247.ro", city: "Bucharest", country: "RO", lat: 44.4268, lon: 26.1025, delay: "0s", org: "AS57169 Hosting" },
      { hop: 2, ip: "104.244.42.1", host: "mail-mta-inbound.apexdefense.com", city: "Ashburn", country: "US", lat: 39.0438, lon: -77.4874, delay: "+0.6s", org: "Perimeter Gateway" }
    ],
    domainIntel: {
      registeredDomain: "dell-enteprise-support.com",
      canonicalDomain: "dell.com",
      similarityScore: "96% Levenshtein Distance Typo Match",
      registrar: "Hostinger Operations UAB",
      createdDate: "Aug 28, 2026 (14 days ago)",
      expiresDate: "Aug 28, 2027",
      domainAge: "14 days (Brand Impersonation)",
      privacyProtected: true,
      mxRecords: ["10 mail.dell-enteprise-support.com"],
      dnsSec: "Disabled"
    },
    correlation: {
      campaignId: "CAMP-2026-INVOICE-RO",
      campaignName: "Operation Ghost Ledger (Hardware Invoice Scams)",
      confidence: 88,
      threatActor: "Carbanak Financial Syndicate",
      similarCases: ["CASE-1082"],
      indicators: [
        { type: "domain", value: "dell-enteprise-support.com", risk: "critical" },
        { type: "sha256", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", risk: "high" }
      ]
    },
    rawHeaders: `Delivered-To: procurement@apexdefense.com
Received: from vps-bucharest.m247.ro ([185.193.88.19])
        by mail-mta-inbound.apexdefense.com with ESMTP id v948192
        for <procurement@apexdefense.com>; Thu, 10 Sep 2026 16:30:11 -0400
From: "Billing Dept" <accounts@dell-enteprise-support.com>
Subject: OVERDUE NOTICE: Final Demand - Invoice #INV-2026-9041A for Server Hardware
Date: Thu, 10 Sep 2026 16:30:00 -0400`
  },
  {
    id: "sample-google-security",
    name: "Google Workspace Security Notice (Authentic)",
    subject: "Security Alert: New sign-in detected on Windows machine (Chrome)",
    sender: "Google Cloud Identity <no-reply@accounts.google.com>",
    fromDisplay: "Google Security Operations Team",
    replyTo: "no-reply@accounts.google.com",
    recipient: "admin@apexdefense.com",
    date: "Sep 11, 2026, 11:00 AM EST",
    clientIp: "209.85.220.41",
    riskScore: 8,
    verdict: "SAFE_LEGITIMATE",
    verdictLabel: "Safe / Legitimate",
    verdictColor: "green",
    urgencyLevel: "Informational Only",
    plainEnglishSummary: "This email is authentic and verified. Cryptographic signatures match Google LLC's official identity keys. Originating IP resides securely within Google's Autonomous System (AS15169).",
    executiveNotes: [
      "Cryptographically Verified: SPF, DKIM, and DMARC all passed with 100% strict alignment.",
      "Known Infrastructure: Sent directly from official Google Mountain View servers.",
      "Safe Links: All URLs navigate directly to myaccount.google.com over secure TLS.",
      "Action: Safe to view; no malicious indicators detected."
    ],
    auth: {
      spf: { status: "PASS", detail: "Pass: IP 209.85.220.41 is designated in _spf.google.com", explanation: "Google officially authorizes this IP address to transmit mail." },
      dkim: { status: "PASS", detail: "Signature verified with public key from 20230601._domainkey.google.com", explanation: "Digital signature matches the sender private key. Zero tampering detected." },
      dmarc: { status: "PASS", detail: "Strict DMARC pass with policy p=reject", explanation: "Passes the highest security threshold for sender identity." },
      ptr: { status: "PASS", detail: "mail-sor-f41.google.com", explanation: "Valid and verified reverse DNS." }
    },
    geo: {
      originIp: "209.85.220.41",
      city: "Mountain View",
      region: "California",
      country: "United States",
      countryCode: "US",
      asn: "AS15169 (Google LLC)",
      isp: "Google LLC Backbone Network",
      lat: 37.3861,
      lon: -122.0839,
      isHosting: false,
      isVpn: false,
      isTor: false,
      isBotnet: false,
      threatFeeds: ["Clean - Zero Vendor Flagging across 80+ intelligence feeds"]
    },
    relayHops: [
      { hop: 1, ip: "209.85.220.41", host: "mail-sor-f41.google.com", city: "Mountain View", country: "US", lat: 37.3861, lon: -122.0839, delay: "0s", org: "AS15169 Google LLC" },
      { hop: 2, ip: "104.244.42.1", host: "mail-mta-inbound.apexdefense.com", city: "Ashburn", country: "US", lat: 39.0438, lon: -77.4874, delay: "+0.2s", org: "Perimeter Gateway" }
    ],
    domainIntel: {
      registeredDomain: "google.com",
      canonicalDomain: "google.com",
      similarityScore: "Exact Official Domain",
      registrar: "MarkMonitor Inc",
      createdDate: "Sep 15, 1997 (29 years ago)",
      expiresDate: "Sep 14, 2028",
      domainAge: "29 years (High Reputation)",
      privacyProtected: false,
      mxRecords: ["10 aspmx.l.google.com", "20 alt1.aspmx.l.google.com"],
      dnsSec: "Active & Signed"
    },
    correlation: {
      campaignId: "LEGIT-GOOGLE-WORKSPACE",
      campaignName: "Google Account Notifications",
      confidence: 99,
      threatActor: "None (Legitimate Service)",
      similarCases: [],
      indicators: []
    },
    rawHeaders: `Delivered-To: admin@apexdefense.com
Received: by 2002:a05:6e02:1189 with SMTP id o9csp1245802
        Wed, 11 Sep 2026 11:00:15 -0400 (EDT)
ARC-Authentication-Results: i=1; mx.google.com;
       spf=pass (google.com: domain of 3j7asytqkb4s@gaia.bounces.google.com designates 209.85.220.41 as permitted sender)
       dkim=pass header.i=@accounts.google.com header.s=20230601;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=accounts.google.com
From: "Google Cloud Identity" <no-reply@accounts.google.com>
To: admin@apexdefense.com
Subject: Security Alert: New sign-in detected on Windows machine (Chrome)
Date: Wed, 11 Sep 2026 11:00:12 -0400`
  }
];

export const MOCK_CASES = [
  {
    id: "CASE-2026-081",
    title: "Executive Wire Transfer Impersonation Campaign",
    severity: "critical",
    status: "investigating",
    assignedTo: "Shri (Senior Threat Analyst)",
    createdAt: "2 hours ago",
    updatedAt: "12 minutes ago",
    linkedEmailsCount: 4,
    threatActor: "TA505 / FIN7 Affiliate",
    origin: "Moscow, Russia (AS49453)",
    summary: "Attacker spoofing CEO email address using lookalike domain corp-apexdefense.com. Targeting finance department with urgent SWIFT transfer demands.",
    indicators: ["corp-apexdefense.com", "185.220.101.44", "exec-payments88@protonmail-gateway.top"],
    timeline: [
      { time: "09:42 AM", author: "System Sentinel", text: "Email intercepted at inbound MTA. Threat score: 96/100." },
      { time: "09:44 AM", author: "Shri", text: "Confirmed CEO impersonation. Lookalike domain registered 4 days ago." },
      { time: "10:15 AM", author: "Shri", text: "Dispatched emergency gateway block rule on IP 185.220.101.44 and domain." },
      { time: "11:02 AM", author: "Sarah Jenkins (CEO)", text: "Confirmed she did not authorize any wire transfer." }
    ]
  },
  {
    id: "CASE-2026-079",
    title: "DocuSign SSO Credential Harvesting Swarm",
    severity: "critical",
    status: "contained",
    assignedTo: "Marcus Vance (Incident Lead)",
    createdAt: "Yesterday, 04:20 PM",
    updatedAt: "1 hour ago",
    linkedEmailsCount: 18,
    threatActor: "PhishKit-v4 West Africa Cluster",
    origin: "Lagos, Nigeria (AS37148)",
    summary: "Mass credential harvester impersonating DocuSign ESPP agreement. Purged 18 instances from employee mailboxes.",
    indicators: ["docusign-secure-verify.net", "102.129.144.92"],
    timeline: [
      { time: "Yesterday 04:20 PM", author: "System Sentinel", text: "18 messages detected matching phishing signature." },
      { time: "Yesterday 04:35 PM", author: "Marcus Vance", text: "Automated mailbox purge executed via Microsoft 365 API integration." },
      { time: "Today 08:30 AM", author: "Marcus Vance", text: "Zero credential leaks identified. 2 employees who clicked had passwords reset." }
    ]
  },
  {
    id: "CASE-2026-074",
    title: "Hardware Logistics Typo-squatting Invoices",
    severity: "high",
    status: "new",
    assignedTo: "Unassigned (In Queue)",
    createdAt: "3 hours ago",
    updatedAt: "3 hours ago",
    linkedEmailsCount: 2,
    threatActor: "Ghost Ledger Group",
    origin: "Bucharest, Romania (AS57169)",
    summary: "Overdue hardware invoice from dell-enteprise-support.com demanding $48k payment. Malicious PDF macro embedded.",
    indicators: ["dell-enteprise-support.com", "185.193.88.19"],
    timeline: [
      { time: "10:30 AM", author: "David Miller (CFO)", text: "Reported suspicious invoice from supposed Dell representative." },
      { time: "10:32 AM", author: "System Sentinel", text: "Automated sandbox detected macro payload in PDF." }
    ]
  },
  {
    id: "CASE-2026-068",
    title: "HR Benefits Enrollment Payroll Redirect Attempt",
    severity: "medium",
    status: "resolved",
    assignedTo: "Elena Rostova",
    createdAt: "Sep 9, 2026",
    updatedAt: "Sep 10, 2026",
    linkedEmailsCount: 1,
    threatActor: "Opportunistic Threat Actor",
    origin: "Ashburn, VA, United States",
    summary: "Employee direct deposit update link redirecting to external phishing form. Form host suspended.",
    indicators: ["hr-payroll-portal-secure.info"],
    timeline: [
      { time: "Sep 9", author: "Elena Rostova", text: "Takedown notice sent to domain registrar." },
      { time: "Sep 10", author: "Elena Rostova", text: "Registrar confirmed domain suspended. Case closed." }
    ]
  }
];

export const MOCK_ALERTS = [
  { id: "ALT-9041", title: "CEO Wire Transfer Request Spoof", sender: "s.jenkins@corp-apexdefense.com", recipient: "david.miller@apexdefense.com", score: 96, severity: "critical", time: "12m ago", status: "unread", sampleId: "sample-wire-fraud" },
  { id: "ALT-9040", title: "DocuSign Stock Plan Credential Trap", sender: "dse@docusign-secure-verify.net", recipient: "all-staff@apexdefense.com", score: 92, severity: "critical", time: "1h ago", status: "investigating", sampleId: "sample-docusign-phish" },
  { id: "ALT-9039", title: "Lookalike Dell Hardware Invoicing", sender: "accounts@dell-enteprise-support.com", recipient: "procurement@apexdefense.com", score: 84, severity: "high", time: "3h ago", status: "unread", sampleId: "sample-vendor-invoice" },
  { id: "ALT-9038", title: "Suspicious Office365 Re-Authentication Link", sender: "admin-portal@m365-security-session.com", recipient: "engineering@apexdefense.com", score: 78, severity: "high", time: "5h ago", status: "acknowledged", sampleId: "sample-docusign-phish" },
  { id: "ALT-9037", title: "Internal Payroll Portal Update Request", sender: "hr-support@payroll-apex.net", recipient: "l.martinez@apexdefense.com", score: 58, severity: "medium", time: "1d ago", status: "investigating", sampleId: "sample-vendor-invoice" },
  { id: "ALT-9036", title: "Unrecognized IP Login for Service Account", sender: "no-reply@accounts.google.com", recipient: "admin@apexdefense.com", score: 8, severity: "low", time: "1d ago", status: "resolved", sampleId: "sample-google-security" },
  { id: "ALT-9035", title: "Marketing Newsletter with Tracking Pixels", sender: "updates@techinsider-news.com", recipient: "dev-team@apexdefense.com", score: 14, severity: "low", time: "2d ago", status: "dismissed", sampleId: "sample-google-security" },
];

export const MOCK_AUDIT_LOGS = [
  { id: "AUD-881", timestamp: "Sep 11, 2026, 11:24 AM", user: "Shri (Lead Analyst)", action: "Firewall Block Rule Created", details: "Added 185.220.101.44 and corp-apexdefense.com to gateway blocklist" },
  { id: "AUD-880", timestamp: "Sep 11, 2026, 10:48 AM", user: "Shri (Lead Analyst)", action: "Forensic PDF Exported", details: "Generated full forensic dossier for CASE-2026-081" },
  { id: "AUD-879", timestamp: "Sep 11, 2026, 09:44 AM", user: "System Automated Triage", action: "Threat Incident Created", details: "Automated ingestion flagged High-Confidence BEC attack from Moscow node" },
  { id: "AUD-878", timestamp: "Sep 11, 2026, 08:35 AM", user: "Marcus Vance (Lead)", action: "Batch Mailbox Purge", details: "Purged 18 phishing emails matching hash #d91823901" },
  { id: "AUD-877", timestamp: "Sep 10, 2026, 05:12 PM", user: "Admin System", action: "API Token Rotated", details: "Splunk SIEM ingestion token refreshed by security policy" },
];

export const MOCK_USERS = [
  { id: "USR-1", name: "Shri", email: "shri.analyst@apexdefense.com", role: "Lead Security Analyst", status: "Active", mfa: "FIDO2 Hardware Key", lastActive: "Just now" },
  { id: "USR-2", name: "Marcus Vance", email: "m.vance@apexdefense.com", role: "Incident Lead / Admin", status: "Active", mfa: "Authenticator App", lastActive: "5m ago" },
  { id: "USR-3", name: "Elena Rostova", email: "e.rostova@apexdefense.com", role: "Security Analyst", status: "Active", mfa: "Authenticator App", lastActive: "1h ago" },
  { id: "USR-4", name: "David Miller", email: "david.miller@apexdefense.com", role: "Employee / Reporter", status: "Active", mfa: "SMS Verified", lastActive: "3h ago" },
  { id: "USR-5", name: "Sarah Jenkins", email: "s.jenkins@apexdefense.com", role: "Employee / Reporter (Executive)", status: "Active", mfa: "FIDO2 Hardware Key", lastActive: "Yesterday" },
];

export const MOCK_SYSTEM_HEALTH = {
  aiModelEngine: { status: "Optimal", latency: "42ms", uptime: "99.98%", version: "DistilBERT-Phish-v3" },
  ipGeolocationDb: { status: "Optimal", latency: "6ms", database: "MaxMind GeoIP2 Enterprise (Sep 2026 Update)" },
  whoisResolver: { status: "Optimal", latency: "120ms", rateLimit: "4,820/5,000 req/hr" },
  threatIntelFeeds: { status: "Optimal", sources: "AbuseIPDB, Spamhaus, AlienVault OTX, URLHaus", lastSync: "3 min ago" },
  inboundMtaQueue: { status: "Optimal", queueLength: 0, processingRate: "840 emails/min" }
};

export const MOCK_GLOSSARY = [
  {
    term: "SPF (Sender Policy Framework)",
    plainEnglish: "A DNS record that lists which computer IP addresses are allowed to send emails on behalf of a company domain. If an attacker sends mail from their own server claiming to be your CEO, SPF fails because their server is not on the approved list."
  },
  {
    term: "DKIM (DomainKeys Identified Mail)",
    plainEnglish: "A cryptographic tamper-evident seal placed on an email. The sender server signs the email with a private digital key, and the recipient verifies it using a public key published on the domain. If someone modifies the text or fakes the sender, the seal breaks."
  },
  {
    term: "DMARC (Domain-based Message Authentication)",
    plainEnglish: "The overarching enforcement rulebook. It tells email providers: 'If an email claiming to be from my company fails SPF or DKIM, REJECT it immediately and do not deliver it to the user.'"
  },
  {
    term: "Typosquatting & Lookalike Domains",
    plainEnglish: "When attackers register domain names that look almost identical to legitimate companies (like 'micros0ft.com' or 'dell-enteprise.com') to deceive recipients at a glance."
  },
  {
    term: "MTA Relay Hops",
    plainEnglish: "Mail Transfer Agents (MTAs) are the postal sorting centers of the internet. Every time an email hops from one server to another, each server stamps a 'Received:' line in the headers, allowing investigators to trace the email all the way back to the true origin computer."
  },
  {
    term: "Autonomous System Number (ASN)",
    plainEnglish: "A large network identifier controlled by internet service providers, cloud datacenters, or telecom operators. Cyber attackers often purchase bulletproof VPS hosting in foreign ASNs that ignore legal copyright or crime takedown requests."
  }
];

export const DEMO_USER = {
  id: "demo-user-001",
  email: "shri@tracemail.security",
  name: "Shri",
  org: "TraceMail Cyber Defense Unit",
  role: "analyst",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  isFirstTime: false,
  isDemo: true,
};

