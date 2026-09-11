import React, { useState } from 'react'
import { FolderArchive, Search, ShieldAlert, ChevronRight, Filter } from 'lucide-react'

export default function CaseList({ cases, onSelectCase, activeCaseId }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('ALL')

  if (!cases || cases.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 rounded-2xl border border-slate-800 bg-[#0c1222]">
        <FolderArchive className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No historical cases stored yet.</p>
      </div>
    )
  }

  const filtered = cases.filter(c => {
    const matchesSearch = (
      (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.sender || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.case_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.origin_ip || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesRisk = filterRisk === 'ALL' || c.risk_level === filterRisk
    return matchesSearch && matchesRisk
  })

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <FolderArchive className="h-5 w-5 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Investigated Email Cases Directory ({filtered.length})
          </h3>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search sender, IP, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          </div>

          {/* Risk filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low / Safe Only</option>
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/80 text-xs text-left">
          <thead className="bg-slate-900/40 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Case Ref</th>
              <th className="px-4 py-3">Subject & Target</th>
              <th className="px-4 py-3">Claimed Sender</th>
              <th className="px-4 py-3">Origin IP / Country</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3">Verdict</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filtered.map((c) => {
              const isActive = activeCaseId === c.case_id
              const isCrit = c.risk_level === 'CRITICAL'
              const isHigh = c.risk_level === 'HIGH'
              const isMed = c.risk_level === 'MEDIUM'

              let badgeStyle = 'bg-emerald-950 text-emerald-300 border-emerald-800'
              if (isCrit) badgeStyle = 'bg-red-950 text-red-300 border-red-800 font-bold'
              else if (isHigh) badgeStyle = 'bg-red-950/70 text-red-300 border-red-800/60'
              else if (isMed) badgeStyle = 'bg-amber-950 text-amber-300 border-amber-800'

              return (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                    isActive ? 'bg-cyan-950/20 border-l-4 border-l-cyan-400' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-bold text-cyan-300 whitespace-nowrap">
                    #{c.case_id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-semibold text-slate-100 truncate">{c.subject || 'No Subject'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{c.timestamp ? new Date(c.timestamp).toLocaleString() : ''}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300 truncate max-w-[180px]">
                    {c.sender}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300 whitespace-nowrap">
                    <div>{c.origin_ip || 'Internal'}</div>
                    <div className="text-[10px] text-slate-500 font-sans">{c.country || 'Unknown'}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-xs ${
                      c.fraud_score >= 70 ? 'text-red-400' : c.fraud_score >= 40 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {c.fraud_score}/100
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase border ${badgeStyle}`}>
                      {c.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectCase(c.case_id); }}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-all cursor-pointer inline-flex items-center space-x-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
