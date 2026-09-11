import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Terminal, ShieldAlert } from 'lucide-react';

export default function LoadingScreen({ onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState([]);

  const steps = [
    { title: 'Parsing RFC 822 MIME headers & message boundaries', delay: 600 },
    { title: 'Validating cryptographic SPF, DKIM & DMARC alignments', delay: 700 },
    { title: 'Tracing MTA relay hops & resolving originating IP geolocation', delay: 800 },
    { title: 'Querying threat intelligence feeds & typosquatting databases', delay: 700 },
    { title: 'Synthesizing forensic intelligence dossier & risk score', delay: 600 },
  ];

  useEffect(() => {
    let timer;
    if (currentStepIndex < steps.length) {
      timer = setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          `[+] ${new Date().toISOString().split('T')[1].slice(0, 8)} [OK] ${steps[currentStepIndex].title}`,
        ]);
        setCurrentStepIndex((prev) => prev + 1);
      }, steps[currentStepIndex].delay);
    } else {
      timer = setTimeout(() => {
        onComplete && onComplete();
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const percent = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-xl p-8 rounded-[28px] bg-[#0b1026] border border-white/10 shadow-redrob-card space-y-6 shimmer-card">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-redrob-blue">
            <Loader2 className="w-5 h-5 animate-spin" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Forensic Synthesis Engine Active
            </h3>
          </div>
          <span className="text-xs font-bold text-redrob-aqua">{percent}%</span>
        </div>

        {/* Progress Bar with Redrob Glow */}
        <div className="w-full h-2 rounded-full bg-[#050814] overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-redrob-blue via-[#3385ff] to-redrob-aqua transition-all duration-300 shadow-redrob-glow"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Step-by-Step List */}
        <div className="space-y-3 text-xs">
          {steps.map((st, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-redrob-lime/10 border-redrob-lime/30 text-redrob-lime'
                    : isCurrent
                    ? 'bg-redrob-blue/15 border-redrob-blue/40 text-white font-bold animate-pulse'
                    : 'bg-[#050814]/50 border-white/5 text-slate-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-redrob-lime shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-redrob-aqua animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                )}
                <span className="truncate">{st.title}</span>
              </div>
            );
          })}
        </div>

        {/* Mini Terminal Output Box */}
        <div className="rounded-2xl bg-[#050814] p-3.5 border border-white/5 text-[11px] text-slate-400 font-mono space-y-1 max-h-28 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] pb-1 border-b border-white/5">
            <Terminal className="w-3 h-3 text-redrob-aqua" />
            <span>STDOUT / TRACE LOG</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="text-redrob-aqua/90 truncate">
              {log}
            </div>
          ))}
          <div className="text-slate-500 animate-pulse">&gt; Analyzing memory buffer...</div>
        </div>
      </div>
    </div>
  );
}
