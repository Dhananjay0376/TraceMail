import React, { useState } from 'react';
import { Globe, ShieldAlert, Navigation } from 'lucide-react';
import { MOCK_ATTACK_ORIGINS } from '../../mock/mockData';

export default function MiniWorldMap({ onSelectOrigin }) {
  const [hoveredOrigin, setHoveredOrigin] = useState(null);

  // Convert lat/lon to percentage position on simple Mercator projection
  const getCoordinates = (lat, lon) => {
    // lon: -180 to 180 -> 0 to 100%
    const x = ((lon + 180) / 360) * 100;
    // lat: -85 to 85 approx
    const y = ((85 - lat) / 170) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)) };
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Global Threat Origin Matrix
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
          6 Active Geopolitical Hotspots
        </span>
      </div>

      {/* SVG Stylized World Map Container */}
      <div className="relative flex-1 min-h-[200px] my-3 rounded-xl bg-[#070b14] border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(#06b6d4 1px, transparent 1px), radial-gradient(#06b6d4 1px, #070b14 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Global Continent Outlines (Stylized Vector) */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain opacity-25"
          fill="#1e293b"
        >
          {/* North America */}
          <path d="M150,80 Q220,70 280,110 Q250,180 200,220 Q170,240 130,170 Q110,120 150,80 Z" />
          {/* South America */}
          <path d="M260,250 Q330,270 320,380 Q280,450 250,440 Q220,360 240,290 Z" />
          {/* Europe */}
          <path d="M480,90 Q560,80 570,140 Q530,170 480,150 Q450,120 480,90 Z" />
          {/* Africa */}
          <path d="M460,180 Q560,190 550,300 Q510,380 470,350 Q430,260 460,180 Z" />
          {/* Asia */}
          <path d="M580,70 Q800,60 850,180 Q780,260 650,220 Q580,180 580,70 Z" />
          {/* Australia */}
          <path d="M780,310 Q870,300 860,390 Q790,410 770,360 Z" />
        </svg>

        {/* Pulsating Attack Nodes */}
        {MOCK_ATTACK_ORIGINS.map((origin) => {
          const { x, y } = getCoordinates(origin.lat, origin.lon);
          const isSelected = hoveredOrigin?.id === origin.id;

          const colorMap = {
            critical: { dot: 'bg-red-500', ping: 'bg-red-400', shadow: 'shadow-red-500' },
            high: { dot: 'bg-orange-500', ping: 'bg-orange-400', shadow: 'shadow-orange-500' },
            medium: { dot: 'bg-amber-500', ping: 'bg-amber-400', shadow: 'shadow-amber-500' },
          }[origin.level] || { dot: 'bg-cyan-500', ping: 'bg-cyan-400', shadow: 'shadow-cyan-500' };

          return (
            <div
              key={origin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredOrigin(origin)}
              onMouseLeave={() => setHoveredOrigin(null)}
              onClick={() => onSelectOrigin && onSelectOrigin(origin)}
            >
              <span className={`absolute -inset-1 rounded-full animate-ping opacity-60 ${colorMap.ping}`} />
              <div
                className={`relative w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center transition-all group-hover:scale-125 shadow-lg ${colorMap.dot} ${colorMap.shadow}`}
              />

              {/* Tooltip on hover */}
              {isSelected && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 w-48 p-2.5 rounded-xl bg-slate-950/95 backdrop-blur-md border border-cyan-500/50 shadow-2xl text-left pointer-events-none font-mono">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{origin.city}</span>
                    <span className="text-[10px] text-slate-400">{origin.country}</span>
                  </div>
                  <div className="text-[10px] text-red-400 mt-1 truncate">
                    {origin.topThreat}
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">
                    {origin.threatCount} Inbound Attacks
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Origin City Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
        {MOCK_ATTACK_ORIGINS.slice(0, 6).map((o) => (
          <div
            key={o.id}
            onClick={() => onSelectOrigin && onSelectOrigin(o)}
            className="p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 cursor-pointer transition-all flex items-center justify-between text-[11px] font-mono"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  o.level === 'critical'
                    ? 'bg-red-500'
                    : o.level === 'high'
                    ? 'bg-orange-500'
                    : 'bg-amber-500'
                }`}
              />
              <span className="text-slate-200 truncate">{o.city}</span>
            </div>
            <span className="text-cyan-400 font-bold ml-1">{o.threatCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
