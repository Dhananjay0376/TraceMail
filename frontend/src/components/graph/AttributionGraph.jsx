import React, { useState } from 'react';
import { Share2, ShieldAlert, Server, Globe, Mail, ChevronRight, Hash, Layers } from 'lucide-react';

export default function AttributionGraph({ sample, onSelectCase }) {
  const [activeNode, setActiveNode] = useState(null);

  if (!sample || !sample.correlation) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        <Share2 className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse text-cyan-400" />
        <p>No correlation graph data available for this scan.</p>
      </div>
    );
  }

  const { correlation, geo, domainIntel, sender } = sample;

  // Graph nodes
  const nodes = [
    {
      id: 'campaign',
      label: correlation.campaignName,
      type: 'campaign',
      x: 350,
      y: 80,
      color: '#ef4444',
      icon: ShieldAlert,
      meta: { Actor: correlation.threatActor, Confidence: `${correlation.confidence}%` },
    },
    {
      id: 'domain',
      label: domainIntel.registeredDomain,
      type: 'domain',
      x: 180,
      y: 200,
      color: '#f97316',
      icon: Globe,
      meta: { Registrar: domainIntel.registrar, Age: domainIntel.domainAge },
    },
    {
      id: 'ip',
      label: geo.originIp,
      type: 'ip',
      x: 520,
      y: 200,
      color: '#f97316',
      icon: Server,
      meta: { Location: `${geo.city}, ${geo.country}`, ASN: geo.asn },
    },
    {
      id: 'sender',
      label: sender.split('<')[0].trim() || 'Spoofed Sender',
      type: 'sender',
      x: 200,
      y: 330,
      color: '#06b6d4',
      icon: Mail,
      meta: { Target: sample.recipient, Header: sample.sender },
    },
    {
      id: 'case',
      label: 'CASE-2026-081 (Active)',
      type: 'case',
      x: 500,
      y: 330,
      color: '#06b6d4',
      icon: Hash,
      meta: { Status: 'Under Active Investigation', Priority: 'P0 Critical' },
    },
  ];

  const links = [
    { from: 'campaign', to: 'domain' },
    { from: 'campaign', to: 'ip' },
    { from: 'domain', to: 'sender' },
    { from: 'ip', to: 'case' },
    { from: 'sender', to: 'case' },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-xl font-mono">
      {/* Attribution Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Threat Campaign Attribution & Network Correlation
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Network graph linking malicious infrastructure, lookalikes, and known APT clusters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 font-bold">
            {correlation.confidence}% Confidence
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-bold">
            {correlation.campaignId}
          </span>
        </div>
      </div>

      {/* Interactive SVG Graph Area */}
      <div className="relative my-6 rounded-2xl bg-[#070b14] border border-slate-800/90 h-[400px] overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <svg viewBox="0 0 700 400" className="w-full h-full">
          <defs>
            <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Render Lines */}
          {links.map((link, i) => {
            const fromNode = nodes.find((n) => n.id === link.from);
            const toNode = nodes.find((n) => n.id === link.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#grad-line)"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isSelected = activeNode?.id === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setActiveNode(node)}
              >
                {/* Node Outer Glow */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 32 : 24}
                  fill={node.color}
                  fillOpacity={isSelected ? '0.35' : '0.15'}
                  stroke={node.color}
                  strokeWidth={isSelected ? '3' : '1.5'}
                  className="transition-all duration-300"
                />

                {/* Node Center */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 14 : 10}
                  fill={node.color}
                />

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y + 40}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="drop-shadow-md select-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {activeNode && (
          <div className="absolute top-4 right-4 w-72 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 shadow-2xl text-xs z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-cyan-400 uppercase tracking-wider">
                Node: {activeNode.type}
              </span>
              <button
                onClick={() => setActiveNode(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 text-white font-bold truncate">{activeNode.label}</div>
            <div className="mt-3 space-y-1.5 text-slate-300">
              {Object.entries(activeNode.meta || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 text-[11px]">
                  <span className="text-slate-400">{k}:</span>
                  <span className="text-cyan-300 font-bold truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shared Threat Indicators list */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <h4 className="text-xs font-bold uppercase text-slate-300 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Shared Indicators of Compromise (IOCs)</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(correlation.indicators || []).map((ioc, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">{ioc.type}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                  {ioc.risk}
                </span>
              </div>
              <div className="mt-1 font-bold text-white truncate text-[11px]">{ioc.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
