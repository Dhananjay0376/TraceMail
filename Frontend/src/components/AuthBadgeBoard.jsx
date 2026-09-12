import React from 'react'
import { ShieldCheck, ShieldAlert, KeyRound, Clock, AlertTriangle, UserX, Check, MailCheck } from 'lucide-react'

export default function AuthBadgeBoard({ auth, domainIntel, replyDomainIntel, anomalies }) {
  if (!auth) return null

  const { spf, dkim, dmarc } = auth
  const isSpfPass = spf.toLowerCase() === 'pass'
  const isDkimPass = dkim.toLowerCase() === 'pass'
  const isDmarcPass = dmarc.toLowerCase() === 'pass'

  const domainAge = domainIntel?.domain_age_days ?? 999
  const isNewDomain = domainIntel?.is_new_domain || domainAge < 30

  const hasAnomalies = anomalies?.anomaly_flags && anomalies.anomaly_flags.length > 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* SPF Card */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
        isSpfPass 
          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
          : 'bg-red-950/20 border-red-800/40 text-red-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">SPF Protocol</span>
          {isSpfPass ? <ShieldCheck className="h-5 w-5 text-emerald-400" /> : <ShieldAlert className="h-5 w-5 text-red-400" />}
        </div>
        <div className="mt-2">
          <div className="text-base font-bold font-mono uppercase">{spf}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isSpfPass ? 'Relay IP authorized by sender domain SPF' : 'Sending IP unauthorized by domain record'}
          </p>
        </div>
      </div>

      {/* DKIM Card */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
        isDkimPass 
          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
          : 'bg-red-950/20 border-red-800/40 text-red-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">DKIM Signature</span>
          <KeyRound className={`h-5 w-5 ${isDkimPass ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>
        <div className="mt-2">
          <div className="text-base font-bold font-mono uppercase">{dkim}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isDkimPass ? 'Cryptographic header signature valid' : 'Missing or invalid cryptographic signature'}
          </p>
        </div>
      </div>

      {/* DMARC Card */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
        isDmarcPass 
          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300' 
          : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">DMARC Policy</span>
          <MailCheck className={`h-5 w-5 ${isDmarcPass ? 'text-emerald-400' : 'text-amber-400'}`} />
        </div>
        <div className="mt-2">
          <div className="text-base font-bold font-mono uppercase">{dmarc}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isDmarcPass ? 'Domain alignment validated' : 'DMARC alignment check failed'}
          </p>
        </div>
      </div>

      {/* Domain Age & WHOIS Card */}
      <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
        isNewDomain 
          ? 'bg-red-950/30 border-red-700/50 text-red-300' 
          : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">WHOIS Domain Age</span>
          <Clock className={`h-5 w-5 ${isNewDomain ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
        </div>
        <div className="mt-2">
          <div className="text-base font-bold font-mono">
            {domainAge < 9000 ? `${domainAge} Days Old` : 'Age Unknown'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isNewDomain ? 'CRITICAL: Fresh lookalike domain (<30d)' : 'Mature registered domain'}
          </p>
        </div>
      </div>

      {/* Anomalies Banner (if any) */}
      {hasAnomalies && (
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 p-3 rounded-xl bg-red-950/30 border border-red-800/60 text-xs text-red-200 flex flex-col gap-1">
          <div className="flex items-center space-x-2 font-bold text-red-400">
            <UserX className="h-4 w-4" />
            <span>Sender Identity Inconsistencies Flagged:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1 opacity-90">
            {anomalies.anomaly_flags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
