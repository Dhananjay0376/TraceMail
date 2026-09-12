import React, { useState } from 'react';
import { ShieldCheck, Flame, AlertOctagon, AlertTriangle, ArrowUpRight, Copy, Check, Sparkles } from 'lucide-react';
import { getRiskLevel } from './RiskBadge';

export default function VerdictBanner({ sample, onActionClick, isEmployeeMode = false }) {
  const [copied, setCopied] = useState(false);

  if (!sample) return null;

  const risk = getRiskLevel(sample.riskScore, sample.verdict);
  const isDangerous = sample.riskScore >= 61;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(sample.plainEnglishSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simplified view for non-technical employees
  if (isEmployeeMode) {
    return (
      <div
        className={`rounded-[32px] p-6 sm:p-8 border relative overflow-hidden transition-all paper-cut-shadow ${
          isDangerous
            ? 'bg-gradient-to-r from-red-950/80 via-[#001D39] to-[#0A4174] border-red-500/40'
            : 'bg-gradient-to-r from-[#0A4174] via-[#001D39] to-[#49769F] border-[#7BBDE8]/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-md ${
                isDangerous
                  ? 'bg-red-500/20 border-red-400/40 text-red-400'
                  : 'bg-[#7BBDE8]/20 border-[#7BBDE8]/40 text-[#7BBDE8]'
              }`}
            >
              {isDangerous ? <Flame className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] uppercase font-mono font-bold tracking-wider px-3.5 py-1 rounded-full border paper-pill ${
                    isDangerous
                      ? 'bg-red-500/20 text-red-300 border-red-400/40'
                      : 'bg-[#7BBDE8] text-[#001D39] font-extrabold border-white'
                  }`}
                >
                  {isDangerous ? 'Malicious Threat Detected' : 'Verified Legitimate'}
                </span>
                <span className="text-xs text-[#6EA2B3] font-sans">• Employee Defense Shield</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {isDangerous ? 'Dangerous Email — Do Not Click Links' : 'Safe to Read, Click & Reply'}
              </h2>
              <p className="text-[#BDD8E9] text-sm mt-2 max-w-2xl leading-relaxed font-sans">
                {sample.plainEnglishSummary}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {isDangerous ? (
              <button
                onClick={() => onActionClick && onActionClick('delete')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:bg-red-500 text-white font-bold text-sm transition-all cursor-pointer paper-pill spring-hover shadow-lg"
              >
                Delete & Purge from Inbox
              </button>
            ) : (
              <button
                onClick={() => onActionClick && onActionClick('safe')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] font-extrabold text-sm transition-all cursor-pointer paper-pill spring-hover shadow-lg"
              >
                Mark as Trusted
              </button>
            )}
            <button
              onClick={() => onActionClick && onActionClick('report')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#0A4174] hover:bg-[#49769F] border border-[#7BBDE8]/30 text-[#BDD8E9] text-sm font-medium transition-all cursor-pointer paper-pill spring-hover"
            >
              Report to Security Helpdesk
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full Security Analyst banner
  return (
    <div
      className={`rounded-[32px] p-6 sm:p-7 border relative overflow-hidden transition-all paper-cut-shadow ${
        sample.riskScore >= 86
          ? 'bg-gradient-to-r from-red-950/90 via-[#001D39] to-[#0A4174] border-red-500/40'
          : sample.riskScore >= 61
          ? 'bg-gradient-to-r from-orange-950/80 via-[#001D39] to-[#0A4174] border-orange-500/40'
          : sample.riskScore >= 31
          ? 'bg-gradient-to-r from-amber-950/80 via-[#001D39] to-[#0A4174] border-amber-500/40'
          : 'bg-gradient-to-r from-[#0A4174] via-[#001D39] to-[#49769F] border-[#7BBDE8]/40'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Score Dial & High-Level Verdict */}
        <div className="flex items-start sm:items-center gap-5">
          {/* Circular Score Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center rounded-3xl bg-[#00152b] border border-[#49769F]/30 paper-cut-shadow">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#0A4174]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={
                  sample.riskScore >= 86
                    ? 'text-red-400'
                    : sample.riskScore >= 61
                    ? 'text-orange-400'
                    : sample.riskScore >= 31
                    ? 'text-amber-400'
                    : 'text-[#7BBDE8]'
                }
                strokeDasharray={`${sample.riskScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-mono font-black text-white leading-none">
                {sample.riskScore}
              </span>
              <span className="text-[10px] font-mono text-[#6EA2B3] uppercase tracking-wider">/100</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border paper-pill ${
                  sample.riskScore >= 86
                    ? 'bg-red-500/20 text-red-300 border-red-400/40'
                    : sample.riskScore >= 61
                    ? 'bg-orange-500/20 text-orange-300 border-orange-400/40'
                    : sample.riskScore >= 31
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'bg-[#7BBDE8] text-[#001D39] font-extrabold border-white'
                }`}
              >
                {sample.verdictLabel}
              </span>
              <span className="text-xs font-mono text-[#BDD8E9] bg-[#0A4174] px-3 py-1 rounded-full border border-[#7BBDE8]/30 paper-pill">
                {sample.correlation?.campaignName || 'Single Incident'}
              </span>
              <span className="text-xs text-[#6EA2B3] font-mono">
                {sample.geo?.city}, {sample.geo?.country}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
              {sample.subject}
            </h2>

            <p className="text-[#BDD8E9] text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {sample.plainEnglishSummary}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 justify-end">
          <button
            onClick={() => onActionClick && onActionClick('case')}
            className="px-5 py-2.5 rounded-full bg-[#7BBDE8] hover:bg-white text-[#001D39] font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer paper-pill spring-hover shadow-lg"
          >
            <span>Create Case</span>
            <ArrowUpRight className="w-4 h-4 text-[#001D39]" />
          </button>
          <button
            onClick={() => onActionClick && onActionClick('pdf')}
            className="px-5 py-2.5 rounded-full bg-[#0A4174] hover:bg-[#49769F] border border-[#7BBDE8]/30 text-[#BDD8E9] font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer paper-pill spring-hover"
          >
            <span>Export Forensic PDF</span>
          </button>
          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-full bg-[#00152b] hover:bg-[#0A4174] border border-[#49769F]/30 text-[#6EA2B3] hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer paper-pill"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#7BBDE8]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

