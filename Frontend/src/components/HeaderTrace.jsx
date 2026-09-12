import React, { useState } from 'react'
import { GitCommit, Clock, Server, ChevronDown, ChevronUp, Terminal } from 'lucide-react'

export default function HeaderTrace({ hops, originIp }) {
  const [expandedIndex, setExpandedIndex] = useState(null)

  if (!hops || hops.length === 0) return null

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitCommit className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Reconstructed Relay Path ({hops.length} Hops, Chronological)
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">Oldest (Origin) → Newest (Recipient)</span>
      </div>

      <div className="divide-y divide-slate-800/60">
        {hops.map((hop, idx) => {
          const isOrigin = idx === 0
          const isDest = idx === hops.length - 1 && hops.length > 1
          const isExpanded = expandedIndex === idx

          return (
            <div key={idx} className="p-3.5 hover:bg-slate-900/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                {/* Hop Header & Host info */}
                <div className="flex items-start space-x-3">
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isOrigin
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : isDest
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {hop.hop_number || idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">
                        {isOrigin ? 'Originating Server' : isDest ? 'Recipient Mail Gateway' : `Intermediate Relay MTA`}
                      </span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {hop.protocol || 'SMTP'}
                      </span>
                    </div>

                    <div className="text-slate-400 font-mono text-[11px] mt-0.5 flex items-center space-x-2">
                      <span>from: <strong className="text-slate-300">{hop.from_host}</strong></span>
                      <span>→</span>
                      <span>by: <strong className="text-slate-300">{hop.by_host}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Hop IP, Location & Delay */}
                <div className="flex items-center space-x-4 ml-10 md:ml-0">
                  <div className="text-right font-mono">
                    <div className="text-cyan-400 font-semibold">{hop.ip || 'Internal IP'}</div>
                    <div className="text-slate-500 text-[10px]">{hop.city ? `${hop.city}, ${hop.country}` : 'No Geo'}</div>
                  </div>

                  {hop.delay_seconds > 0 ? (
                    <div className="flex items-center space-x-1 text-amber-400 font-mono text-[11px] bg-amber-950/30 px-2 py-1 rounded border border-amber-800/40">
                      <Clock className="h-3 w-3" />
                      <span>+{hop.delay_seconds}s</span>
                    </div>
                  ) : (
                    <div className="text-slate-600 text-[11px] font-mono">&lt;1s</div>
                  )}

                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title="View Raw Header"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Raw Header Drawer */}
              {isExpanded && (
                <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 break-all">
                  <div className="text-cyan-400 text-[10px] uppercase font-bold mb-1 flex items-center space-x-1">
                    <Terminal className="h-3 w-3" />
                    <span>Raw RFC 5322 Received Header</span>
                  </div>
                  {hop.raw_header}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
