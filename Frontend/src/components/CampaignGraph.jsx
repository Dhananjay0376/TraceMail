import React, { useState, useEffect } from 'react'
import { Share2, AlertTriangle, ShieldCheck, Server, Globe, Mail, ChevronRight, Layers } from 'lucide-react'

export default function CampaignGraph({ graphData, onSelectCase }) {
  const [selectedEntity, setSelectedEntity] = useState(null)

  if (!graphData || !graphData.nodes) {
    return (
      <div className="p-8 text-center text-slate-500">
        <Share2 className="h-10 w-10 mx-auto mb-2 opacity-50 animate-pulse" />
        <p>Loading correlation knowledge graph...</p>
      </div>
    )
  }

  const { nodes, links, campaigns, total_cases } = graphData

  // Categorize nodes
  const caseNodes = nodes.filter(n => n.type === 'case')
  const ipNodes = nodes.filter(n => n.type === 'ip')
  const domainNodes = nodes.filter(n => n.type === 'domain')

  return (
    <div className="space-y-6">
      {/* Top Campaign Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1222]">
          <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase font-semibold">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Correlated Ingestion</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-white">{total_cases}</span>
            <span className="text-xs text-slate-400">Total Investigated Cases</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-red-800/40 bg-red-950/20">
          <div className="flex items-center space-x-2 text-red-400 text-xs uppercase font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Active Threat Clusters</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-red-400">{campaigns.length}</span>
            <span className="text-xs text-slate-400">Multi-Target Campaigns</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0c1222]">
          <div className="flex items-center space-x-2 text-slate-400 text-xs uppercase font-semibold">
            <Server className="h-4 w-4 text-cyan-400" />
            <span>Mapped Infrastructure</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">{ipNodes.length + domainNodes.length}</span>
            <span className="text-xs text-slate-400">Unique IPs & Lookalike Domains</span>
          </div>
        </div>
      </div>

      {/* Discovered Campaigns List */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Share2 className="h-5 w-5 text-red-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Coordinated Fraud Campaigns Detected (NetworkX Graph Attribution)
            </h3>
          </div>
          <span className="text-xs text-cyan-400 font-mono">Algorithm: In-degree entity clustering</span>
        </div>

        <div className="mt-4 space-y-3">
          {campaigns.length > 0 ? (
            campaigns.map((camp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-red-800/60 bg-gradient-to-r from-red-950/40 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-900 text-red-200 border border-red-700">
                      {camp.campaign_id}
                    </span>
                    <h4 className="text-sm font-bold text-white">{camp.name}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{camp.description}</p>
                  <div className="text-xs text-slate-400 font-mono">
                    Shared Threat Node: <span className="text-red-400 font-bold">{camp.threat_entity}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-mono">Linked Targets:</span>
                  <div className="flex space-x-1">
                    {camp.linked_cases.map((cid, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => onSelectCase && onSelectCase(cid)}
                        className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>#{cid}</span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              No overlapping infrastructure identified between current cases yet.
            </div>
          )}
        </div>
      </div>

      {/* Visual Relationship Node Matrix */}
      <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Attribution Knowledge Graph Entities & Edges
          </h4>
          <span className="text-xs text-slate-500 font-mono">{nodes.length} Nodes • {links.length} Relations</span>
        </div>

        {/* Nodes Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cases Column */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 flex items-center space-x-1">
              <Mail className="h-3.5 w-3.5 text-cyan-400" />
              <span>Investigated Cases ({caseNodes.length})</span>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {caseNodes.map(c => {
                const isHigh = (c.score || 0) >= 70
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCase && onSelectCase(c.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isHigh ? 'bg-red-950/20 border-red-800/40 hover:bg-red-900/30' : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>#{c.id}</span>
                      <span className={`font-mono ${isHigh ? 'text-red-400' : 'text-emerald-400'}`}>
                        {c.score}/100
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.subject || c.label}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Infrastructure IPs Column */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 flex items-center space-x-1">
              <Server className="h-3.5 w-3.5 text-amber-400" />
              <span>Observed IPs ({ipNodes.length})</span>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {ipNodes.map(ip => (
                <div
                  key={ip.id}
                  className="p-2.5 rounded-lg border bg-slate-900/60 border-slate-800 text-xs"
                >
                  <div className="font-mono font-bold text-amber-300 flex items-center justify-between">
                    <span>{ip.label}</span>
                    {ip.is_hosting && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                        VPS
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{ip.org || ip.country}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Domains Column */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-slate-400 flex items-center space-x-1">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>Targeted / Claimed Domains ({domainNodes.length})</span>
            </div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {domainNodes.map(dom => (
                <div
                  key={dom.id}
                  className="p-2.5 rounded-lg border bg-slate-900/60 border-slate-800 text-xs font-mono text-emerald-300"
                >
                  {dom.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
