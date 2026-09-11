import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Navigation, Server, Globe2, AlertOctagon } from 'lucide-react'

// Custom DivIcons for Leaflet to eliminate Vite asset resolution bugs
const createPinIcon = (color, label) => {
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
    popupAnchor: [0, -32]
  })
}

// Helper to auto-fit map bounds when hops change
function AutoFitBounds({ positions }) {
  const map = useMap()
  useEffect(() => {
    if (positions && positions.length > 0) {
      const bounds = L.latLngBounds(positions)
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 })
    }
  }, [positions, map])
  return null
}

export default function GeoMap({ hops, originGeo, originIp }) {
  // Filter hops that have valid coordinates
  const validHops = (hops || []).filter(h => h.lat && h.lon && (h.lat !== 0 || h.lon !== 0))
  
  // If no hops with lat/lon but originGeo has coordinates, build a point
  const mapPoints = validHops.length > 0 
    ? validHops 
    : (originGeo && originGeo.lat ? [{
        hop_number: 1,
        ip: originIp || originGeo.ip,
        city: originGeo.city,
        country: originGeo.country,
        org: originGeo.org,
        lat: originGeo.lat,
        lon: originGeo.lon,
        is_origin: true
      }] : [])

  const positions = mapPoints.map(p => [p.lat, p.lon])
  const defaultCenter = positions.length > 0 ? positions[0] : [20.5937, 78.9629]

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden flex flex-col h-full">
      {/* Geolocation Origin Banner */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Globe2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Originating Infrastructure
              </span>
              {originGeo?.is_hosting && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-semibold flex items-center space-x-1">
                  <AlertOctagon className="h-2.5 w-2.5" />
                  <span>Cloud / Datacenter VPS</span>
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-white flex items-center space-x-2 font-mono">
              <span>{originIp || 'Unknown IP'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300">{originGeo?.city || 'Unknown'}, {originGeo?.country || 'Unknown'}</span>
            </div>
          </div>
        </div>

        <div className="text-right text-xs">
          <div className="text-slate-400 font-mono text-[11px] truncate max-w-xs">{originGeo?.org || 'Autonomous System N/A'}</div>
          <div className="text-cyan-400 font-medium">{positions.length} Geocoded Hop{positions.length === 1 ? '' : 's'} Traced</div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="relative flex-1 min-h-[360px] w-full">
        {positions.length > 0 ? (
          <MapContainer
            center={defaultCenter}
            zoom={3}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%', minHeight: '360px' }}
          >
            {/* Dark Mode CartoDB TileLayer */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Polyline Path between hops */}
            {positions.length > 1 && (
              <Polyline
                positions={positions}
                color="#06b6d4"
                weight={3}
                opacity={0.8}
                dashArray="6, 8"
              />
            )}

            {/* Hop Markers */}
            {mapPoints.map((hop, index) => {
              const isOrigin = index === 0
              const isDest = index === mapPoints.length - 1 && mapPoints.length > 1
              const pinColor = isOrigin ? '#ef4444' : (isDest ? '#10b981' : '#f59e0b')
              const pinLabel = isOrigin ? 'O' : (isDest ? 'D' : `${hop.hop_number || index + 1}`)

              return (
                <Marker
                  key={index}
                  position={[hop.lat, hop.lon]}
                  icon={createPinIcon(pinColor, pinLabel)}
                >
                  <Popup>
                    <div className="p-2 space-y-1.5 text-xs">
                      <div className="font-bold text-slate-100 flex items-center justify-between border-b border-slate-700 pb-1">
                        <span>{isOrigin ? '🔴 Origin Server' : (isDest ? '🟢 Destination MX' : `Relay Hop #${hop.hop_number || index + 1}`)}</span>
                        <span className="font-mono text-[10px] text-cyan-400">{hop.protocol || 'SMTP'}</span>
                      </div>
                      <div className="font-mono text-cyan-300 font-semibold">{hop.ip}</div>
                      <div className="text-slate-300">{hop.city}, {hop.country}</div>
                      <div className="text-slate-400 text-[11px] leading-tight">{hop.org || hop.by_host}</div>
                      {hop.delay_seconds > 0 && (
                        <div className="text-amber-400 text-[11px] font-mono">Transit delay: +{hop.delay_seconds}s</div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            <AutoFitBounds positions={positions} />
          </MapContainer>
        ) : (
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <MapPin className="h-10 w-10 text-slate-600 mb-2 animate-bounce" />
            <p className="text-sm">No external IP routing hops found for this message.</p>
          </div>
        )}
      </div>
    </div>
  )
}
