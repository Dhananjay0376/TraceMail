import React from 'react';

export default function StatCard({ title, value, growth, icon: Icon, color = 'blue', subtitle }) {
  const colorStyles = {
    blue: {
      border: 'hover:border-redrob-blue/50 hover:shadow-redrob-glow',
      iconBg: 'bg-redrob-blue/10 border-redrob-blue/30 text-redrob-blue',
      val: 'text-white',
    },
    cyan: {
      border: 'hover:border-redrob-aqua/50 hover:shadow-redrob-aqua-glow',
      iconBg: 'bg-redrob-aqua/10 border-redrob-aqua/30 text-redrob-aqua',
      val: 'text-white',
    },
    violet: {
      border: 'hover:border-redrob-violet/50 hover:shadow-redrob-violet-glow',
      iconBg: 'bg-redrob-violet/10 border-redrob-violet/30 text-redrob-violet',
      val: 'text-white',
    },
    red: {
      border: 'hover:border-redrob-coral/50',
      iconBg: 'bg-redrob-coral/10 border-redrob-coral/30 text-redrob-coral',
      val: 'text-redrob-coral',
    },
    amber: {
      border: 'hover:border-redrob-amber/50',
      iconBg: 'bg-redrob-amber/10 border-redrob-amber/30 text-redrob-amber',
      val: 'text-redrob-amber',
    },
    emerald: {
      border: 'hover:border-redrob-lime/50',
      iconBg: 'bg-redrob-lime/10 border-redrob-lime/30 text-redrob-lime',
      val: 'text-redrob-lime',
    },
  }[color] || {
    border: 'hover:border-redrob-blue/50',
    iconBg: 'bg-redrob-blue/10 border-redrob-blue/30 text-redrob-blue',
    val: 'text-white',
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-[#0b1026] border border-white/10 transition-all duration-300 ${colorStyles.border} shadow-redrob-card spring-hover relative overflow-hidden`}
    >
      <div className="flex items-center justify-between gap-4 relative z-10">
        <span className="text-xs uppercase font-mono font-semibold tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${colorStyles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2 relative z-10">
        <span className={`text-3xl font-black font-mono tracking-tight ${colorStyles.val}`}>
          {value}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs relative z-10">
        {growth && <span className="font-mono text-redrob-aqua font-medium">{growth}</span>}
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
}
