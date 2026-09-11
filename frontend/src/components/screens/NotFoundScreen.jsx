import React from 'react';
import { ShieldAlert, Home, LayoutDashboard, ArrowLeft, Terminal, AlertTriangle } from 'lucide-react';

export default function NotFoundScreen({ invalidRoute, onNavigate }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl p-8 sm:p-12 rounded-[32px] bg-[#0b1026] border border-red-500/30 shadow-2xl text-center space-y-6 shimmer-card relative overflow-hidden">
        {/* Glowing Radar Beacon */}
        <div className="w-20 h-20 rounded-3xl bg-red-500/15 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center shadow-lg shadow-red-500/20">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>404 • Threat Vector Not Found</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security Route Undefined
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The requested forensic route{' '}
            <code className="px-2 py-0.5 rounded bg-[#050814] text-red-300 font-mono border border-white/10">
              {invalidRoute || window.location.hash || '#unknown'}
            </code>{' '}
            does not exist on the TraceMail Sentinel network perimeter.
          </p>
        </div>

        {/* Terminal diagnostic info */}
        <div className="rounded-2xl bg-[#050814] p-4 border border-white/10 text-left font-mono text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] pb-1 border-b border-white/5">
            <Terminal className="w-3 h-3 text-redrob-aqua" />
            <span>ROUTER STATUS DIAGNOSTIC</span>
          </div>
          <div className="text-red-400">ERR_NODE_UNREACHABLE: No matching screen handler.</div>
          <div className="text-slate-500">&gt; Target Hash: {invalidRoute || window.location.hash}</div>
          <div className="text-slate-500">&gt; Timestamp: {new Date().toISOString()}</div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-full bg-redrob-blue hover:bg-redrob-blueHover text-white font-bold text-xs uppercase tracking-wider shadow-redrob-glow transition-all cursor-pointer flex items-center gap-2 spring-hover"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('landing')}
            className="px-6 py-3 rounded-full bg-[#050814] hover:bg-white/10 border border-white/10 text-slate-200 text-xs transition-all cursor-pointer flex items-center gap-2 spring-hover"
          >
            <Home className="w-4 h-4 text-redrob-aqua" />
            <span>Return to Landing (#home)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
