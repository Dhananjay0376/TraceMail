import React, { useState } from 'react'
import { Printer, Shield, Eye, EyeOff, X, FileCheck, CheckCircle2 } from 'lucide-react'

export default function ForensicReport({ caseData, onClose }) {
  const [maskPii, setMaskPii] = useState(false)

  if (!caseData) return null

  const {
    case_id,
    sha256_hash,
    subject,
    sender,
    to,
    date,
    origin_ip,
    geolocation,
    domain_intel,
    fraud_scoring,
    authentication,
    anomalies,
    relay_hops,
    timestamp
  } = caseData

  const maskStr = (str) => {
    if (!maskPii || !str) return str
    if (str.includes('@')) {
      const [u, d] = str.split('@')
      return (u[0] || '') + '***@' + d
    }
    return str.slice(0, 2) + '***'
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c1222] border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Header Controls (Hidden during print) */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-cyan-400">
            <FileCheck className="h-5 w-5" />
            <span className="font-bold text-sm uppercase tracking-wider text-slate-200">
              Chain of Custody & Forensic Report
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMaskPii(!maskPii)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all cursor-pointer ${
                maskPii
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Mask PII in accordance with organizational privacy policies"
            >
              {maskPii ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{maskPii ? 'PII Masking: ON' : 'Mask PII'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Forensic Document Content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto text-slate-200 bg-[#0c1222] print:bg-white print:text-black print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-700 print:border-black pb-4 flex flex-wrap justify-between items-end gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-cyan-400 print:text-black" />
                <span className="text-xl font-bold font-mono tracking-wider">TRACEMAIL FORENSIC EVIDENCE RECORD</span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Generated per SIH26106 Digital Forensics & Origin Attribution Protocol
              </p>
            </div>
            <div className="text-right text-xs font-mono">
              <div className="font-bold text-cyan-400 print:text-black">CASE REF: #{case_id}</div>
              <div className="text-slate-400 print:text-gray-600">{timestamp}</div>
            </div>
          </div>

          {/* Cryptographic Hash / Chain of Custody Stamp */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 print:border-gray-300 print:bg-gray-100 font-mono text-xs space-y-1.5">
            <div className="font-bold text-cyan-300 print:text-black uppercase text-[11px] flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Cryptographic Integrity Verification (SHA-256)</span>
            </div>
            <div className="text-slate-300 print:text-black break-all select-all font-semibold">
              {sha256_hash}
            </div>
            <div className="text-[11px] text-slate-500 print:text-gray-500 pt-1">
              Standard Compliance: NIST SP 800-86 | RFC 5322 | RFC 7208 | RFC 6376 | RFC 7489
            </div>
          </div>

          {/* Incident Case Overview Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black">
              Incident Identity & Routing Attributes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/40 print:bg-transparent space-y-1">
                <div className="text-slate-400 print:text-gray-600">Claimed Sender (From):</div>
                <div className="font-semibold text-white print:text-black">
                  {maskStr(sender?.display_name)} &lt;{maskStr(sender?.email)}&gt;
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/40 print:bg-transparent space-y-1">
                <div className="text-slate-400 print:text-gray-600">Intended Recipient (To):</div>
                <div className="font-semibold text-white print:text-black">{maskStr(to)}</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/40 print:bg-transparent space-y-1">
                <div className="text-slate-400 print:text-gray-600">Subject Line:</div>
                <div className="font-semibold text-white print:text-black">{subject}</div>
              </div>

              <div className="p-3 rounded-lg border border-slate-800 print:border-gray-300 bg-slate-900/40 print:bg-transparent space-y-1">
                <div className="text-slate-400 print:text-gray-600">Earliest Reliable Originating IP:</div>
                <div className="font-semibold font-mono text-cyan-300 print:text-black">
                  {origin_ip || 'Internal Host'} ({geolocation?.city}, {geolocation?.country})
                </div>
              </div>
            </div>
          </div>

          {/* Forensic Triage Verdict */}
          <div className="p-4 rounded-xl border border-slate-800 print:border-gray-300 bg-slate-900/60 print:bg-transparent space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-600">
                Composite Threat Verdict
              </span>
              <span className="text-sm font-mono font-bold" style={{ color: fraud_scoring?.verdict_color }}>
                Score: {fraud_scoring?.fraud_score} / 100 ({fraud_scoring?.risk_level})
              </span>
            </div>
            <div className="text-base font-bold text-white print:text-black">
              {fraud_scoring?.verdict}
            </div>
          </div>

          {/* Authentication & Technical Evidence Findings */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 print:text-black">
              Technical Verification Matrix
            </h4>
            <table className="min-w-full divide-y divide-slate-800 print:divide-gray-300 border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 print:bg-gray-100 text-slate-400 print:text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left">Protocol / Check</th>
                  <th className="px-3 py-2 text-left">Result Status</th>
                  <th className="px-3 py-2 text-left">Forensic Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200 font-mono text-[11px]">
                <tr>
                  <td className="px-3 py-2 font-bold">SPF (RFC 7208)</td>
                  <td className="px-3 py-2 uppercase">{authentication?.spf}</td>
                  <td className="px-3 py-2 font-sans">{authentication?.spf === 'pass' ? 'Authorized sending MTA' : 'IP not permitted in SPF record'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold">DKIM (RFC 6376)</td>
                  <td className="px-3 py-2 uppercase">{authentication?.dkim}</td>
                  <td className="px-3 py-2 font-sans">{authentication?.dkim === 'pass' ? 'Cryptographic header signature valid' : 'Signature missing or modified in transit'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold">DMARC (RFC 7489)</td>
                  <td className="px-3 py-2 uppercase">{authentication?.dmarc}</td>
                  <td className="px-3 py-2 font-sans">{authentication?.dmarc === 'pass' ? 'Aligned' : 'DMARC alignment check failed'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold">WHOIS Domain Age</td>
                  <td className="px-3 py-2">{domain_intel?.domain_age_days} days</td>
                  <td className="px-3 py-2 font-sans">{domain_intel?.is_new_domain ? 'CRITICAL: Fresh lookalike domain (<30d)' : 'Established domain'}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold">Origin ASN Hosting</td>
                  <td className="px-3 py-2">{geolocation?.is_hosting ? 'Cloud / VPS' : 'Corporate/ISP'}</td>
                  <td className="px-3 py-2 font-sans">{geolocation?.org || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal Certification Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-gray-400 text-[11px] text-slate-500 print:text-gray-600 flex justify-between items-center">
            <div>
              Evidentiary Preservation Certified By: <strong>TraceMail Automated Incident Forensics Engine</strong>
            </div>
            <div>
              Page 1 of 1
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
