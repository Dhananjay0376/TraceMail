import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Globe2, AlertOctagon, Server, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom Pin Marker Factory
const createPin = (color, label) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 0 12px ${color}; color: #000; font-weight: 800; font-size: 11px; font-family: monospace;">
          ${label}
        </div>
        <div style="width: 2px; height: 6px; background-color: ${color};"></div>
      </div>
    `,
    iconSize: [26, 32],
    iconAnchor: [13, 32],
    popupAnchor: [0, -32],
  });
};

function AutoFitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    }
  }, [positions, map]);
  return null;
}

export default function LeafletGeoMap({ hops = [], originGeo, originIp }) {
  const validHops = hops.filter((h) => h.lat && h.lon);
  const positions = validHops.map((h) => [h.lat, h.lon]);
  const defaultCenter = positions.length > 0 ? positions[0] : [20.0, 10.0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden flex flex-col h-full shadow-xl">
      {/* Geolocation Header Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Origin Infrastructure
              </span>
              {originGeo?.isHosting && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-semibold flex items-center gap-1 font-mono">
                  <AlertOctagon className="h-2.5 w-2.5" />
                  <span>Cloud VPS / Hosting</span>
                </span>
              )}
              {originGeo?.isTor && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold font-mono">
                  TOR Exit Node
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-2 font-mono mt-0.5">
              <span>{originIp || originGeo?.originIp || 'Unknown IP'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">
                {originGeo?.city || 'Unknown City'}, {originGeo?.country || 'Unknown Country'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs font-mono">
          <div className="text-slate-400 truncate max-w-xs">{originGeo?.asn || 'AS Pending'}</div>
          <div className="text-cyan-400 font-bold mt-0.5">
            {positions.length} Geocoded Hop{positions.length === 1 ? '' : 's'} Traced
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="relative flex-1 min-h-[380px] w-full">
        <MapContainer
          center={defaultCenter}
          zoom={3}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', minHeight: '380px', backgroundColor: '#070b14' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {positions.length > 1 && (
            <Polyline
              positions={positions}
              pathOptions={{
                color: '#06b6d4',
                weight: 3,
                dashArray: '8, 8',
                opacity: 0.85,
              }}
            />
          )}

          {validHops.map((hop, idx) => {
            const isOrigin = idx === 0;
            const isTarget = idx === validHops.length - 1;
            const color = isOrigin ? '#ef4444' : isTarget ? '#10b981' : '#06b6d4';

            return (
              <Marker
                key={idx}
                position={[hop.lat, hop.lon]}
                icon={createPin(color, hop.hop || idx + 1)}
              >
                <Popup className="cyber-popup">
                  <div className="p-2 font-mono text-xs text-slate-200">
                    <div className="font-bold text-white mb-1">
                      Hop #{hop.hop || idx + 1}: {hop.ip}
                    </div>
                    <div className="text-cyan-400 text-[11px]">
                      {hop.city}, {hop.country}
                    </div>
                    <div className="text-slate-400 text-[10px] mt-1">{hop.org}</div>
                    {hop.delay && (
                      <div className="text-slate-500 text-[10px] mt-0.5">Transit Delay: {hop.delay}</div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <AutoFitBounds positions={positions} />
        </MapContainer>
      </div>

      {/* Relay Hops Timeline Strip */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase font-bold mb-2">
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>MTA Relay Hop Journey (Chronological Order)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {validHops.map((hop, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border text-xs font-mono ${
                i === 0
                  ? 'bg-red-950/30 border-red-800/60 text-red-200'
                  : i === validHops.length - 1
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">Hop {hop.hop || i + 1}</span>
                <span className="text-[10px] opacity-75">{hop.delay || '0s'}</span>
              </div>
              <div className="font-bold truncate mt-1 text-white">{hop.ip}</div>
              <div className="text-[11px] opacity-80 truncate">{hop.city}, {hop.country}</div>
              <div className="text-[10px] opacity-60 truncate mt-0.5">{hop.org}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
