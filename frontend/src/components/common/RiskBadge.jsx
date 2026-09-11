import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

export function getRiskLevel(score, verdict) {
  if (verdict === 'FRAUD_CONFIRMED' || score >= 86) {
    return {
      level: 'critical',
      label: 'Fraud / Phishing Confirmed',
      color: 'coral',
      bg: 'bg-redrob-coral/15 border-redrob-coral/40 text-redrob-coral',
      badgeDot: 'bg-redrob-coral shadow-[0_0_10px_#ff4050]',
      icon: Flame,
    };
  }
  if (verdict === 'HIGH_RISK' || score >= 61) {
    return {
      level: 'high',
      label: 'High Risk Threat',
      color: 'orange',
      bg: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
      badgeDot: 'bg-orange-400 shadow-[0_0_10px_#f78800]',
      icon: AlertOctagon,
    };
  }
  if (verdict === 'SUSPICIOUS' || score >= 31) {
    return {
      level: 'medium',
      label: 'Suspicious Anomaly',
      color: 'amber',
      bg: 'bg-redrob-amber/15 border-redrob-amber/40 text-redrob-amber',
      badgeDot: 'bg-redrob-amber shadow-[0_0_10px_#ffb300]',
      icon: AlertTriangle,
    };
  }
  return {
    level: 'safe',
    label: 'Safe / Legitimate',
    color: 'lime',
    bg: 'bg-redrob-lime/15 border-redrob-lime/40 text-redrob-lime',
    badgeDot: 'bg-redrob-lime shadow-[0_0_10px_#53e097]',
    icon: ShieldCheck,
  };
}

export default function RiskBadge({ score, verdict, showScore = true, size = 'md' }) {
  const risk = getRiskLevel(score, verdict);
  const Icon = risk.icon;

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
    lg: 'px-4 py-1.5 text-sm gap-2.5 font-bold',
  }[size] || 'px-3 py-1 text-xs gap-2';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono uppercase tracking-wider font-semibold transition-all ${risk.bg} ${sizeClasses}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${risk.badgeDot}`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{risk.label}</span>
      {showScore && typeof score === 'number' && (
        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/50 text-white font-bold text-[10px]">
          {score}/100
        </span>
      )}
    </span>
  );
}
