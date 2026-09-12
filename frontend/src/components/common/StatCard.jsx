import React from 'react';

export default function StatCard({ title, value, growth, icon: Icon, color = 'blue', subtitle }) {
  const colorStyles = {
    blue: {
      bg: 'from-[#0A4174] to-[#001D39]',
      border: 'border-[#7BBDE8]/30 hover:border-[#7BBDE8]/60',
      iconBg: 'bg-[#4E8EA2]/20 text-[#7BBDE8] border-[#7BBDE8]/40',
      val: 'text-[#BDD8E9]',
      accent: 'bg-[#7BBDE8]',
    },
    coral: {
      bg: 'from-[#001D39] to-[#0A4174]',
      border: 'border-red-400/40 hover:border-red-400/70',
      iconBg: 'bg-red-500/20 text-red-300 border-red-400/30',
      val: 'text-red-300',
      accent: 'bg-red-400',
    },
    violet: {
      bg: 'from-[#0A4174] to-[#49769F]',
      border: 'border-[#6EA2B3]/30 hover:border-[#6EA2B3]/60',
      iconBg: 'bg-[#6EA2B3]/20 text-[#BDD8E9] border-[#6EA2B3]/40',
      val: 'text-[#BDD8E9]',
      accent: 'bg-[#6EA2B3]',
    },
    lime: {
      bg: 'from-[#001D39] to-[#0A4174]',
      border: 'border-emerald-400/40 hover:border-emerald-400/70',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      val: 'text-emerald-300',
      accent: 'bg-emerald-400',
    },
  }[color] || {
    bg: 'from-[#0A4174] to-[#001D39]',
    border: 'border-[#7BBDE8]/30',
    iconBg: 'bg-[#4E8EA2]/20 text-[#7BBDE8] border-[#7BBDE8]/40',
    val: 'text-[#BDD8E9]',
    accent: 'bg-[#7BBDE8]',
  };

  return (
    <div
      className={`p-5 rounded-[22px] bg-gradient-to-br ${colorStyles.bg} border ${colorStyles.border} transition-all duration-300 paper-cut-shadow spring-hover relative overflow-hidden group`}
    >
      {/* Decorative Paper Wave Inset Corner Curve */}
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#49769F]/10 blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-10">
        <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#BDD8E9]/80">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${colorStyles.iconBg} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2 relative z-10">
        <span className={`text-3xl font-black font-mono tracking-tight drop-shadow ${colorStyles.val}`}>
          {value}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs relative z-10 font-sans">
        {growth && <span className="font-mono text-[#7BBDE8] font-bold">{growth}</span>}
        {subtitle && <span className="text-[#6EA2B3] font-medium">{subtitle}</span>}
      </div>
    </div>
  );
}

