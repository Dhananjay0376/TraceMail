import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Globe } from 'lucide-react';
import { MOCK_ATTACK_ORIGINS } from '../../mock/mockData';
import 'leaflet/dist/leaflet.css';

// Custom Tactical Red Pin Marker for Leaflet
const createPinIcon = (level) => {
  const colorMap = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
  };
  const pinColor = colorMap[level] || '#ef4444';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="position: absolute; top: -5px; width: 34px; height: 34px; border-radius: 50%; background: ${pinColor}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="background: linear-gradient(135deg, ${pinColor}, #7f1d1d); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 0 14px ${pinColor}; color: #ffffff; font-weight: 800; font-size: 10px; font-family: monospace; z-index: 10;">
          📍
        </div>
        <div style="width: 3px; height: 8px; background-color: ${pinColor}; box-shadow: 0 0 6px ${pinColor}; z-index: 9;"></div>
      </div>
    `,
    iconSize: [34, 38],
    iconAnchor: [17, 38],
    popupAnchor: [0, -38],
  });
};

function AutoFitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    try {
      const validPos = (positions || []).filter(
        (p) => Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && typeof p[1] === 'number' && !isNaN(p[0]) && !isNaN(p[1])
      );
      if (validPos && validPos.length > 0) {
        const bounds = L.latLngBounds(validPos);
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });
      }
    } catch (e) {
      console.warn("Leaflet auto-fit bounds suppressed:", e);
    }
  }, [positions, map]);
  return null;
}

export default function MiniWorldMap({ onSelectOrigin, origins = null }) {
  const rawOrigins = origins !== null ? origins : MOCK_ATTACK_ORIGINS;
  const activeOrigins = (rawOrigins || []).filter(
    (o) => o && typeof o.lat === 'number' && typeof o.lon === 'number' && !isNaN(o.lat) && !isNaN(o.lon)
  );
  const positions = activeOrigins.map((o) => [o.lat, o.lon]);
  const defaultCenter = positions.length > 0 ? positions[0] : [20.0, 10.0];

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c1222] flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Global Threat Origin Map (Leaflet)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
          {activeOrigins.length} Active Threat Hotspots
        </span>
      </div>

      {/* Real Interactive Leaflet Map */}
      <div className="relative flex-1 min-h-[260px] my-3 rounded-xl border border-slate-800 overflow-hidden z-0">
        <MapContainer
          center={defaultCenter}
          zoom={2}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', minHeight: '260px', backgroundColor: '#070b14' }}
        >
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          />

          {activeOrigins.map((origin) => (
            <Marker
              key={origin.id}
              position={[origin.lat, origin.lon]}
              icon={createPinIcon(origin.level)}
              eventHandlers={{
                click: () => onSelectOrigin && onSelectOrigin(origin),
              }}
            >
              <Popup>
                <div className="p-2 font-mono text-xs text-slate-200">
                  <div className="font-bold text-white mb-0.5">
                    {origin.city}, {origin.country}
                  </div>
                  <div className="text-red-400 text-[11px] font-bold">
                    {origin.topThreat}
                  </div>
                  <div className="text-cyan-400 text-[10px] mt-1">
                    {origin.threatCount} Inbound Attacks Logged
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {positions.length > 0 && <AutoFitBounds positions={positions} />}
        </MapContainer>
      </div>

      {/* Origin City Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
        {activeOrigins.length === 0 ? (
          <div className="col-span-full py-2 text-center text-xs text-slate-400 font-sans">
            No active threat origins detected yet. Scan emails to map originating MTA relays.
          </div>
        ) : (
          activeOrigins.slice(0, 6).map((o) => (
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
          ))
        )}
      </div>
    </div>
  );
}
