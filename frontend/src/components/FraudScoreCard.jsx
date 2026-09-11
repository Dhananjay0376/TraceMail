import React from 'react'
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu, FileText, Info } from 'lucide-react'

export default function FraudScoreCard({ scoring, detection, onOpenReport }) {
  if (!scoring) return null

  const { fraud_score, risk_level, verdict, verdict_color, breakdown } = scoring

  // Determine styling based on score
  let bgGradient = 'from-emerald-950/40 to-slate-900 border-emerald-800/40'
  let scoreText = 'text-emerald-400'
  let ringColor = '#10b981'
  if (fraud_score >= 90) {
    bgGradient = 'from-red-950/60 to-slate-900 border-red-700/60 glow-red'
    scoreText = 'text-red-500'
    ringColor = '#dc2626'
  } else if (fraud_score >= 70) {
    bgGradient = 'from-red-950/40 to-slate-900 border-red-800/40'
    scoreText = 'text-red-400'
    ringColor = '#ef4444'
  } else if (fraud_score >= 40) {
    bgGradient = 'from-amber-950/40 to-slate-900 border-amber-800/40'
    scoreText = 'text-amber-400'
    ringColor = '#f59e0b'
  }

  // Calculate circumference for radial score gauge
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (fraud_score / 100) * circumference

  return (
    <div className={`rounded-2xl border p-5 bg-gradient-to-b ${bgGradient} relative overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Explainable Fraud Assessment
          </h2>
        </div>
        <button
          onClick={onOpenReport}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-cyan-300 transition-all cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Forensic Report</span>
        </button>
      </div>

      {/* Main Score Display */}
      <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Radial Score Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold font-mono ${scoreText}`}>
              {fraud_score}
            </span>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">/ 100 Risk</span>
          </div>
        </div>

        {/* Verdict & Model Engine Details */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
               style={{ backgroundColor: `${verdict_color}22`, color: verdict_color, border: `1px solid ${verdict_color}55` }}>
            {risk_level === 'CRITICAL' && <AlertTriangle className="h-3.5 w-3.5" />}
            {risk_level === 'HIGH' && <AlertTriangle className="h-3.5 w-3.5" />}
            {risk_level === 'MEDIUM' && <Info className="h-3.5 w-3.5" />}
            {risk_level === 'LOW' && <CheckCircle className="h-3.5 w-3.5" />}
            <span>{risk_level} RISK LEVEL</span>
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">{verdict}</h3>
          
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
            <span className="flex items-center space-x-1 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
              <Cpu className="h-3 w-3 text-cyan-400" />
              <span className="font-mono text-slate-300">Model: {detection?.engine}</span>
            </span>
            <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 font-mono text-slate-300">
              NLP Threat Conf: {(detection?.phishing_prob * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Point-by-Point Transparent Attribution Breakdown */}
      <div className="mt-2 pt-3 border-t border-slate-800/80">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Attribution Factor Breakdown (0–100 Weighted Matrix)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-xs transition-all flex items-start justify-between gap-2 ${
                item.flagged
                  ? 'bg-red-950/20 border-red-800/40 text-red-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.flagged ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                  <span>{item.category}</span>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">{item.detail}</p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className={`font-mono font-bold ${item.points > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                  +{item.points}
                </span>
                <span className="text-[10px] text-slate-500"> / {item.max_points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
