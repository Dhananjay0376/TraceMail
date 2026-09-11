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
        className={`rounded-[28px] p-6 sm:p-8 border relative overflow-hidden transition-all shadow-redrob-card shimmer-card ${
          isDangerous
            ? 'bg-gradient-to-r from-redrob-coral/15 via-[#0b1026] to-[#070c20] border-redrob-coral/30'
            : 'bg-gradient-to-r from-redrob-lime/15 via-[#0b1026] to-[#070c20] border-redrob-lime/30'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-md ${
                isDangerous
                  ? 'bg-redrob-coral/20 border-redrob-coral/40 text-redrob-coral'
                  : 'bg-redrob-lime/20 border-redrob-lime/40 text-redrob-lime'
              }`}
            >
              {isDangerous ? <Flame className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] uppercase font-mono font-bold tracking-wider px-3 py-0.5 rounded-full border ${
                    isDangerous
                      ? 'bg-redrob-coral/20 text-redrob-coral border-redrob-coral/40'
                      : 'bg-redrob-lime/20 text-redrob-lime border-redrob-lime/40'
                  }`}
                >
                  {isDangerous ? 'Malicious Threat Detected' : 'Verified Legitimate'}
                </span>
                <span className="text-xs text-slate-400 font-sans">• Employee Defense Shield</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {isDangerous ? 'Dangerous Email — Do Not Click Links' : 'Safe to Read, Click & Reply'}
              </h2>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed font-sans">
                {sample.plainEnglishSummary}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {isDangerous ? (
              <button
                onClick={() => onActionClick && onActionClick('delete')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-redrob-coral to-red-600 hover:shadow-redrob-coral-glow text-white font-bold text-sm transition-all cursor-pointer spring-hover"
              >
                Delete & Purge from Inbox
              </button>
            ) : (
              <button
                onClick={() => onActionClick && onActionClick('safe')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-redrob-lime to-emerald-500 hover:shadow-lg text-slate-950 font-bold text-sm transition-all cursor-pointer spring-hover"
              >
                Mark as Trusted
              </button>
            )}
            <button
              onClick={() => onActionClick && onActionClick('report')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0b1026] hover:bg-[#0f1738] border border-white/10 text-slate-200 text-sm font-medium transition-all cursor-pointer spring-hover"
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
      className={`rounded-[28px] p-6 sm:p-7 border relative overflow-hidden transition-all shadow-redrob-card shimmer-card ${
        sample.riskScore >= 86
          ? 'bg-gradient-to-r from-redrob-coral/15 via-[#0b1026] to-[#070c20] border-redrob-coral/30'
          : sample.riskScore >= 61
          ? 'bg-gradient-to-r from-orange-500/15 via-[#0b1026] to-[#070c20] border-orange-500/30'
          : sample.riskScore >= 31
          ? 'bg-gradient-to-r from-redrob-amber/15 via-[#0b1026] to-[#070c20] border-redrob-amber/30'
          : 'bg-gradient-to-r from-redrob-lime/15 via-[#0b1026] to-[#070c20] border-redrob-lime/30'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Score Dial & High-Level Verdict */}
        <div className="flex items-start sm:items-center gap-5">
          {/* Circular Score Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center rounded-2xl bg-[#050814] border border-white/10 shadow-inner">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={
                  sample.riskScore >= 86
                    ? 'text-redrob-coral'
                    : sample.riskScore >= 61
                    ? 'text-orange-500'
                    : sample.riskScore >= 31
                    ? 'text-redrob-amber'
                    : 'text-redrob-lime'
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
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">/100</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                  sample.riskScore >= 86
                    ? 'bg-redrob-coral/20 text-redrob-coral border-redrob-coral/40'
                    : sample.riskScore >= 61
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : sample.riskScore >= 31
                    ? 'bg-redrob-amber/20 text-redrob-amber border-redrob-amber/40'
                    : 'bg-redrob-lime/20 text-redrob-lime border-redrob-lime/40'
                }`}
              >
                {sample.verdictLabel}
              </span>
              <span className="text-xs font-mono text-redrob-aqua bg-redrob-blue/15 px-2.5 py-0.5 rounded-full border border-redrob-blue/30">
                {sample.correlation?.campaignName || 'Single Incident'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {sample.geo?.city}, {sample.geo?.country}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
              {sample.subject}
            </h2>

            <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {sample.plainEnglishSummary}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-row lg:flex-col gap-2.5 shrink-0 justify-end">
          <button
            onClick={() => onActionClick && onActionClick('case')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-redrob-blue to-[#1d3fe8] hover:shadow-redrob-glow text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer spring-hover"
          >
            <span>Create Case</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onActionClick && onActionClick('pdf')}
            className="px-4 py-2.5 rounded-xl bg-[#0b1026] hover:bg-[#0f1738] border border-white/10 hover:border-redrob-blue/40 text-slate-200 font-semibold text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer spring-hover"
          >
            <span>Export Forensic PDF</span>
          </button>
          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-redrob-lime" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
