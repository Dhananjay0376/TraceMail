import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function AuthPill({ type, status, detail, explanation }) {
  const [showDetail, setShowDetail] = useState(false);

  const statusConfig = {
    PASS: {
      bg: 'bg-redrob-lime/15 border-redrob-lime/40 text-redrob-lime',
      dot: 'bg-redrob-lime',
      icon: CheckCircle2,
      label: 'PASS',
    },
    FAIL: {
      bg: 'bg-redrob-coral/15 border-redrob-coral/40 text-redrob-coral',
      dot: 'bg-redrob-coral',
      icon: XCircle,
      label: 'FAIL',
    },
    WARN: {
      bg: 'bg-redrob-amber/15 border-redrob-amber/40 text-redrob-amber',
      dot: 'bg-redrob-amber',
      icon: AlertTriangle,
      label: 'WARN',
    },
  }[status] || {
    bg: 'bg-white/5 border-white/10 text-slate-400',
    dot: 'bg-slate-500',
    icon: HelpCircle,
    label: 'NONE',
  };

  const Icon = statusConfig.icon;

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDetail(!showDetail)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase transition-all spring-hover cursor-pointer ${statusConfig.bg}`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="text-white font-extrabold">{type}:</span>
        <span>{statusConfig.label}</span>
      </button>

      {showDetail && (
        <div className="absolute z-30 top-full mt-2 left-0 w-80 p-3.5 rounded-2xl bg-[#0b1026] backdrop-blur-xl border border-white/10 shadow-redrob-card text-left font-sans animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-redrob-blue">{type} Cryptographic Check</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${statusConfig.bg}`}>
              {status}
            </span>
          </div>
          {detail && (
            <p className="text-[11px] font-mono text-slate-300 bg-[#050814] p-2.5 rounded-xl border border-white/5 break-words mb-2">
              {detail}
            </p>
          )}
          {explanation && (
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-white font-semibold">Plain English: </span>
              {explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
