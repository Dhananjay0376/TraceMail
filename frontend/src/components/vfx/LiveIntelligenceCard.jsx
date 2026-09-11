import React from 'react';
import { ShieldCheck, AlertOctagon, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LiveIntelligenceCard({
  type = 'threat', // 'threat' | 'verified' | 'geo' | 'score'
  title = 'Threat Intercepted',
  subtitle = 'Urgent CEO Wire Request',
  badge = 'High Risk 96/100',
  meta = '3 seconds ago',
  className = '',
}) {
  const configs = {
    threat: {
      icon: AlertOctagon,
      iconColor: 'text-redrob-coral',
      iconBg: 'bg-redrob-coral/10 border-redrob-coral/30',
      badgeColor: 'bg-redrob-coral/20 text-redrob-coral border-redrob-coral/40',
      glow: 'hover:border-redrob-coral/40 hover:shadow-redrob-glow',
    },
    verified: {
      icon: CheckCircle2,
      iconColor: 'text-redrob-lime',
      iconBg: 'bg-redrob-lime/10 border-redrob-lime/30',
      badgeColor: 'bg-redrob-lime/20 text-redrob-lime border-redrob-lime/40',
      glow: 'hover:border-redrob-lime/40',
    },
    geo: {
      icon: Globe2,
      iconColor: 'text-redrob-aqua',
      iconBg: 'bg-redrob-aqua/10 border-redrob-aqua/30',
      badgeColor: 'bg-redrob-aqua/20 text-redrob-aqua border-redrob-aqua/40',
      glow: 'hover:border-redrob-aqua/40 hover:shadow-redrob-aqua-glow',
    },
    score: {
      icon: Sparkles,
      iconColor: 'text-redrob-violet',
      iconBg: 'bg-redrob-violet/10 border-redrob-violet/30',
      badgeColor: 'bg-redrob-violet/20 text-redrob-violet border-redrob-violet/40',
      glow: 'hover:border-redrob-violet/40 hover:shadow-redrob-violet-glow',
    },
  };

  const cfg = configs[type] || configs.threat;
  const Icon = cfg.icon;

  return (
    <div
      className={`relative p-3 sm:p-4 rounded-2xl bg-[#0b1026]/90 border border-white/10 backdrop-blur-xl shadow-redrob-card spring-hover cursor-default transition-all ${cfg.glow} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[11px] font-mono text-slate-400 font-medium tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-redrob-lime animate-ping" />
              Live Intelligence
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {meta}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
            {title}
          </h4>
          <p className="text-[11px] text-slate-400 truncate mb-2">
            {subtitle}
          </p>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${cfg.badgeColor}`}>
              {badge}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Auto-quarantine active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
