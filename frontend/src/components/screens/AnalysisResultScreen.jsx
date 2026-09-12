import React, { useState } from 'react';
import {
  FileText,
  Lock,
  Globe2,
  Share2,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Server,
  ShieldCheck,
  Flame,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  ShieldAlert,
  Send,
  Ban,
  FileCheck,
} from 'lucide-react';
import VerdictBanner from '../common/VerdictBanner';
import AuthPill from '../common/AuthPill';
import Tabs from '../common/Tabs';
import LeafletGeoMap from '../map/LeafletGeoMap';
import AttributionGraph from '../graph/AttributionGraph';
import RiskBadge from '../common/RiskBadge';

export default function AnalysisResultScreen({
  sample,
  currentRole = 'analyst',
  onActionTrigger,
  onOpenCase,
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRawHeaders, setShowRawHeaders] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState(null);

  if (!sample) return null;

  const isEmployee = currentRole === 'employee';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'headers', label: 'Header Forensics', icon: Lock },
    { id: 'geo', label: 'Origin & GeoMap', icon: Globe2 },
    { id: 'domain', label: 'Domain Intel', icon: Server },
    { id: 'attribution', label: 'Attribution Graph', icon: Share2 },
    { id: 'actions', label: 'Containment Actions', icon: Zap },
  ];

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(sample.rawHeaders || '');
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleTriggerAction = (actionName, message) => {
    setActionSuccessNotice(message);
    setTimeout(() => setActionSuccessNotice(null), 3500);
    onActionTrigger && onActionTrigger(actionName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Action Notification Toast */}
      {actionSuccessNotice && (
        <div className="p-4 rounded-2xl bg-[#0b1026] border border-redrob-blue text-white text-xs font-mono shadow-redrob-glow flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-redrob-aqua" />
            <span className="font-bold">{actionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActionSuccessNotice(null)}
            className="text-slate-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Flagship Verdict Banner */}
      <VerdictBanner
        sample={sample}
        isEmployeeMode={isEmployee}
        onActionClick={(action) => {
          if (action === 'case') onActionTrigger('create_case');
          if (action === 'pdf') onActionTrigger('export_pdf');
          if (action === 'delete') handleTriggerAction('delete', 'Email purged from mailbox.');
          if (action === 'safe') handleTriggerAction('safe', 'Sender marked as safe.');
          if (action === 'report') handleTriggerAction('report', 'Reported to Incident Command.');
        }}
      />

      {/* For Employee Mode: Keep it simple & clean */}
      {isEmployee ? (
        <div className="p-7 rounded-[32px] bg-gradient-to-b from-[#0A4174] to-[#001D39] border border-[#49769F]/30 paper-cut-shadow font-mono text-xs space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Employee Safety Check Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#00152b] border border-[#49769F]/20 space-y-2 paper-inset-well">
              <div className="font-bold text-[#7BBDE8]">Why was this email flagged?</div>
              <ul className="space-y-1.5 text-[#BDD8E9] font-sans list-disc list-inside">
                {sample.executiveNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#00152b] border border-[#49769F]/20 space-y-2 paper-inset-well">
              <div className="font-bold text-[#7BBDE8]">What should you do?</div>
              <div className="space-y-2 text-[#BDD8E9] font-sans">
                {sample.riskScore >= 61 ? (
                  <>
                    <p className="text-red-400 font-bold">
                      ⚠️ Do NOT reply, do NOT click any links, and do NOT open attachments.
                    </p>
                    <p>
                      The security operations center has automatically quarantined this domain across the company firewall.
                    </p>
                  </>
                ) : (
                  <p className="text-emerald-300 font-bold">
                    ✓ This email is safe. Cryptographic signatures verify it was sent by the legitimate sender.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Technical Forensic Workspace for Security Analysts */
        <div className="space-y-6">
          {/* Cyber Tab Switcher */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 font-mono text-xs animate-fade-in">
              {/* Key Envelope Facts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 paper-cut-shadow">
                  <span className="text-[#BDD8E9]/80 uppercase text-[10px] font-bold">Claimed From</span>
                  <div className="text-white font-bold text-sm truncate mt-1">{sample.fromDisplay}</div>
                  <div className="text-[#7BBDE8] text-[11px] truncate mt-0.5">{sample.sender}</div>
                </div>

                <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 paper-cut-shadow">
                  <span className="text-[#BDD8E9]/80 uppercase text-[10px] font-bold">Reply-To Address</span>
                  <div
                    className={`font-bold text-sm truncate mt-1 ${
                      sample.replyTo.includes('proton') || sample.replyTo.includes('top')
                        ? 'text-red-400'
                        : 'text-white'
                    }`}
                  >
                    {sample.replyTo}
                  </div>
                  <div className="text-[#6EA2B3] text-[11px] truncate mt-0.5">
                    {sample.replyTo !== sample.sender ? '⚠️ Reply-To Mismatch Detected' : 'Aligned'}
                  </div>
                </div>

                <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 paper-cut-shadow">
                  <span className="text-[#BDD8E9]/80 uppercase text-[10px] font-bold">Originating IP</span>
                  <div className="text-white font-bold text-sm truncate mt-1">{sample.geo.originIp}</div>
                  <div className="text-[#7BBDE8] text-[11px] truncate mt-0.5">
                    {sample.geo.city}, {sample.geo.country}
                  </div>
                </div>

                <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#0A4174] to-[#001D39] border border-[#7BBDE8]/30 paper-cut-shadow">
                  <span className="text-[#BDD8E9]/80 uppercase text-[10px] font-bold">Social Engineering Triggers</span>
                  <div className="text-white font-bold text-sm truncate mt-1">{sample.urgencyLevel}</div>
                  <div className="text-[#6EA2B3] text-[11px] truncate mt-0.5">NLP Urgency Heuristic</div>
                </div>
              </div>

              {/* Forensic Executive Analysis Points */}
              <div className="p-6 sm:p-7 rounded-[32px] bg-gradient-to-b from-[#0A4174] to-[#001D39] border border-[#49769F]/30 paper-cut-shadow space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#49769F]/30">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Forensic Findings & Key Threat Indicators
                  </h3>
                  <span className="text-xs text-[#7BBDE8]">Model: DistilBERT NLP + Header Heuristic v3</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                  {sample.executiveNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#00152b] border border-[#49769F]/20 text-[#BDD8E9] leading-relaxed flex items-start gap-3 paper-inset-well"
                    >
                      <span className="w-6 h-6 rounded-xl bg-[#7BBDE8] text-[#001D39] flex items-center justify-center text-xs shrink-0 font-mono font-black shadow">
                        {idx + 1}
                      </span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HEADER FORENSICS */}
          {activeTab === 'headers' && (
            <div className="space-y-6 font-mono text-xs animate-fade-in">
              {/* Auth Pills Row */}
              <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Cryptographic Authentication Alignments
                </h3>
                <div className="flex flex-wrap gap-3">
                  <AuthPill
                    type="SPF"
                    status={sample.auth.spf.status}
                    detail={sample.auth.spf.detail}
                    explanation={sample.auth.spf.explanation}
                  />
                  <AuthPill
                    type="DKIM"
                    status={sample.auth.dkim.status}
                    detail={sample.auth.dkim.detail}
                    explanation={sample.auth.dkim.explanation}
                  />
                  <AuthPill
                    type="DMARC"
                    status={sample.auth.dmarc.status}
                    detail={sample.auth.dmarc.detail}
                    explanation={sample.auth.dmarc.explanation}
                  />
                  <AuthPill
                    type="PTR (Reverse DNS)"
                    status={sample.auth.ptr.status}
                    detail={sample.auth.ptr.detail}
                    explanation={sample.auth.ptr.explanation}
                  />
                </div>
              </div>

              {/* Raw Headers Collapsible Viewer */}
              <div className="p-6 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      RFC 822 Raw Inbound Header Stream
                    </span>
                    <span className="text-[10px] text-slate-400">({sample.rawHeaders.length} bytes)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyRaw}
                      className="px-3 py-1.5 rounded-full bg-[#050814] hover:bg-white/10 text-slate-200 text-xs flex items-center gap-1.5 cursor-pointer border border-white/5 spring-hover"
                    >
                      {copiedRaw ? <Check className="w-3.5 h-3.5 text-redrob-lime" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRaw ? 'Copied' : 'Copy Headers'}</span>
                    </button>
                    <button
                      onClick={() => setShowRawHeaders(!showRawHeaders)}
                      className="p-1.5 rounded-full bg-[#050814] border border-white/5 text-slate-400 hover:text-white spring-hover cursor-pointer"
                    >
                      {showRawHeaders ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {showRawHeaders ? (
                  <pre className="mt-4 p-4 rounded-2xl bg-[#050814] border border-white/5 text-redrob-aqua font-mono text-[11px] overflow-x-auto leading-relaxed max-h-96">
                    {sample.rawHeaders}
                  </pre>
                ) : (
                  <div
                    onClick={() => setShowRawHeaders(true)}
                    className="mt-3 p-3 rounded-2xl bg-[#050814] border border-white/5 text-slate-400 hover:text-white text-xs cursor-pointer text-center spring-hover"
                  >
                    Click to expand full RFC 822 MIME headers viewer...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ORIGIN & GEOLOCATION */}
          {activeTab === 'geo' && (
            <div className="space-y-6 animate-fade-in">
              <LeafletGeoMap
                hops={sample.relayHops}
                originGeo={sample.geo}
                originIp={sample.clientIp}
              />
            </div>
          )}

          {/* TAB 4: DOMAIN INTELLIGENCE */}
          {activeTab === 'domain' && (
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-mono text-xs space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    WHOIS & DNS Reputation Intel
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Domain age, registrar provenance, and typosquatting proximity analysis.
                  </p>
                </div>
                <span className="text-xs text-orange-400 font-bold px-3 py-1 rounded-full bg-orange-950/60 border border-orange-800">
                  {sample.domainIntel.similarityScore}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase">Registered Domain</span>
                  <div className="text-white font-bold text-sm mt-1">{sample.domainIntel.registeredDomain}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase">Target Lookalike Entity</span>
                  <div className="text-redrob-aqua font-bold text-sm mt-1">{sample.domainIntel.canonicalDomain}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase">Domain Age</span>
                  <div className="text-redrob-coral font-bold text-sm mt-1">{sample.domainIntel.domainAge}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase">Registrar</span>
                  <div className="text-slate-200 font-bold mt-1">{sample.domainIntel.registrar}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase">Creation Date</span>
                  <div className="text-slate-200 font-bold mt-1">{sample.domainIntel.createdDate}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                  <span className="text-slate-500 text-[10px] uppercase">DNSSEC Signature</span>
                  <div className="text-slate-200 font-bold mt-1">{sample.domainIntel.dnsSec}</div>
                </div>
              </div>

              {/* MX Records */}
              <div className="p-4 rounded-2xl bg-[#050814] border border-white/5">
                <span className="text-slate-400 text-xs font-bold block mb-2 font-mono">Configured MX Mail Records:</span>
                <div className="space-y-1">
                  {sample.domainIntel.mxRecords.map((mx, i) => (
                    <div key={i} className="text-redrob-aqua font-mono text-xs">
                      • {mx}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ATTRIBUTION GRAPH */}
          {activeTab === 'attribution' && (
            <div className="animate-fade-in">
              <AttributionGraph sample={sample} onSelectCase={onOpenCase} />
            </div>
          )}

          {/* TAB 6: ACTIONS */}
          {activeTab === 'actions' && (
            <div className="p-6 sm:p-7 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card font-mono text-xs space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Automated Threat Containment & Response
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Execute 1-click containment playbooks across gateway, firewall, and SOC ticketing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleTriggerAction('block_domain', `Domain ${sample.domainIntel.registeredDomain} blocked on gateway.`)}
                  className="p-5 rounded-[24px] bg-[#050814] border border-redrob-coral/30 hover:border-redrob-coral hover:bg-redrob-coral/10 text-left transition-all cursor-pointer group spring-hover"
                >
                  <div className="flex items-center justify-between text-redrob-coral font-bold mb-2">
                    <span className="text-sm">Block Threat Domain</span>
                    <Ban className="w-5 h-5 group-hover:scale-110 transition-all" />
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Push immediate block rule to Microsoft 365, Cloudflare, and Palo Alto perimeter gateways.
                  </p>
                </button>

                <button
                  onClick={() => handleTriggerAction('block_ip', `Origin IP ${sample.geo.originIp} blacklisted.`)}
                  className="p-5 rounded-[24px] bg-[#050814] border border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 text-left transition-all cursor-pointer group spring-hover"
                >
                  <div className="flex items-center justify-between text-orange-400 font-bold mb-2">
                    <span className="text-sm">Blacklist Originating IP</span>
                    <ShieldAlert className="w-5 h-5 group-hover:scale-110 transition-all" />
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Add {sample.geo.originIp} ({sample.geo.city}, {sample.geo.country}) to global firewall drop list.
                  </p>
                </button>

                <button
                  onClick={() => {
                    onActionTrigger('create_case');
                    handleTriggerAction('create_case', 'Case created and assigned to Shri.');
                  }}
                  className="p-5 rounded-[24px] bg-[#050814] border border-redrob-blue/30 hover:border-redrob-blue hover:bg-redrob-blue/10 text-left transition-all cursor-pointer group spring-hover"
                >
                  <div className="flex items-center justify-between text-redrob-blue font-bold mb-2">
                    <span className="text-sm">Create Incident Case</span>
                    <FileCheck className="w-5 h-5 group-hover:scale-110 transition-all" />
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Open a new P0 incident in TraceMail Case Queue with all forensic indicators attached.
                  </p>
                </button>

                <button
                  onClick={() => handleTriggerAction('notify_slack', 'Alert dispatched to #soc-incidents Slack channel.')}
                  className="p-5 rounded-[24px] bg-[#050814] border border-white/10 hover:border-white/20 text-left transition-all cursor-pointer group spring-hover"
                >
                  <div className="flex items-center justify-between text-slate-200 font-bold mb-2">
                    <span className="text-sm">Notify SOC on Slack / Teams</span>
                    <Send className="w-5 h-5 text-redrob-aqua group-hover:scale-110 transition-all" />
                  </div>
                  <p className="text-slate-400 font-sans text-xs">
                    Dispatch an emergency alert card with IOCs to the on-call incident response channel.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
