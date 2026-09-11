import React, { useState } from 'react';
import {
  FileCheck,
  Download,
  Printer,
  ShieldAlert,
  Calendar,
  Lock,
  Server,
  Globe2,
  Check,
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function ForensicReportScreen({ sample }) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!sample) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-redrob-blue/15 border border-redrob-blue/30 flex items-center justify-center text-redrob-blue">
              <FileCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Forensic Intelligence Dossier
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Court &amp; SOC Audit-Ready Technical Evidence Document (RFC 822 Forensics).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-sans text-white font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="px-6 py-2 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-redrob-glow"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-white font-black" />
                <span>Downloaded PDF</span>
              </>
            ) : isExporting ? (
              <span>Generating PDF...</span>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Export PDF Dossier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Document Canvas Preview */}
      <div className="rounded-[32px] bg-[#080d1f] border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(43,82,255,0.1)] p-8 sm:p-12 font-sans text-xs text-slate-300 space-y-8 print:bg-white print:text-black print:border-none">
        {/* Formal Investigative Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="text-[10px] text-redrob-blue font-mono font-bold uppercase tracking-widest">
              TRACEMAIL CYBER FORENSICS LABORATORY
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              EMAIL THREAT AUDIT REPORT
            </h2>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              DOCUMENT REFERENCE: TM-EV-{sample.id.toUpperCase()}-2026
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#ff4050]/15 text-[#ff6b78] border border-[#ff4050]/30 text-[10px] font-mono font-bold uppercase tracking-wider inline-block">
              RESTRICTED // LAW ENFORCEMENT &amp; SOC ONLY
            </span>
            <div className="text-[10px] text-slate-400 font-mono">Generated: {sample.date}</div>
            <div className="text-[10px] text-slate-400 font-mono">Investigator ID: OP-CHEN-8492</div>
          </div>
        </div>

        {/* Executive Verdict Block */}
        <div className="p-6 rounded-[24px] bg-[#0b1026] border border-white/10 space-y-3 shadow-redrob-card">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 uppercase text-[10px] font-mono font-bold tracking-wider">
              Automated Forensic Finding
            </span>
            <RiskBadge score={sample.riskScore} verdict={sample.verdict} size="md" />
          </div>

          <h3 className="text-lg font-bold text-white">{sample.subject}</h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">{sample.plainEnglishSummary}</p>
        </div>

        {/* Technical Identity Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
            <Lock className="w-4 h-4 text-redrob-blue" />
            <span>1. Identity Verification &amp; Cryptographic Seals</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">SPF Check</span>
              <div
                className={`font-mono font-bold text-sm mt-1 ${
                  sample.auth.spf.status === 'PASS' ? 'text-redrob-lime' : 'text-[#ff6b78]'
                }`}
              >
                {sample.auth.spf.status}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">DKIM Signature</span>
              <div
                className={`font-mono font-bold text-sm mt-1 ${
                  sample.auth.dkim.status === 'PASS' ? 'text-redrob-lime' : 'text-[#ff6b78]'
                }`}
              >
                {sample.auth.dkim.status}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">DMARC Policy</span>
              <div
                className={`font-mono font-bold text-sm mt-1 ${
                  sample.auth.dmarc.status === 'PASS' ? 'text-redrob-lime' : 'text-[#ff6b78]'
                }`}
              >
                {sample.auth.dmarc.status}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">PTR Reverse DNS</span>
              <div className="font-mono font-bold text-sm mt-1 text-slate-200">{sample.auth.ptr.status}</div>
            </div>
          </div>
        </div>

        {/* Origin Geolocation Telemetry */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
            <Globe2 className="w-4 h-4 text-redrob-blue" />
            <span>2. Originating Physical &amp; Network Infrastructure</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Origin IP Address</span>
              <div className="font-mono font-bold text-white text-sm mt-1">{sample.geo.originIp}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Physical Geolocation</span>
              <div className="font-bold text-redrob-aqua text-sm mt-1">
                {sample.geo.city}, {sample.geo.country}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050814] border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase font-mono">ISP / Autonomous System</span>
              <div className="font-mono font-bold text-slate-300 text-sm mt-1 truncate">{sample.geo.asn}</div>
            </div>
          </div>
        </div>

        {/* MTA Relay Hops Journey Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2 font-mono">
            <Server className="w-4 h-4 text-redrob-blue" />
            <span>3. Reconstructed MTA Transit Journey</span>
          </h4>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#050814]">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#0b1026] text-slate-400 text-[10px] font-mono uppercase border-b border-white/10">
                <tr>
                  <th className="p-3">Hop #</th>
                  <th className="p-3">Server Host / IP</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Transit Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sample.relayHops.map((h, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-mono font-bold text-redrob-blue">Hop {h.hop}</td>
                    <td className="p-3 font-mono text-white">{h.ip} ({h.host})</td>
                    <td className="p-3 text-slate-300">{h.city}, {h.country}</td>
                    <td className="p-3 font-mono text-slate-400">{h.delay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Forensics Sign-off Block */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[11px] text-slate-500 font-mono">
          <div>
            <p>Hash Integrity Verification: SHA256-4820a4b81c900e281</p>
            <p className="mt-0.5">Automated Evidence Seal generated by TraceMail Forensic Node</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-300">Digital Signature: Alex Chen, GCFA</div>
            <div className="text-slate-500 font-sans">Certified Forensic Threat Analyst</div>
          </div>
        </div>
      </div>
    </div>
  );
}
