import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { MapPin, Server, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix default leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function GeoMap({ trace }) {
  if (!trace || trace.length === 0) {
    return (
      <div className=\"card\" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
        <Navigation size={32} style={{ margin: '0 auto 8px auto' }} />
        <p>No relay IP hops available to plot.</p>
      </div>
    );
  }

  // Filter valid coordinates
  const validHops = trace.filter(h => h.lat && h.lon && (h.lat !== 0 || h.lon !== 0));
  const defaultCenter = validHops.length > 0 ? [validHops[0].lat, validHops[0].lon] : [20, 0];
  const polylinePositions = validHops.map(h => [h.lat, h.lon]);

  return (
    <div className=\"card\">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={20} color=\"#ef4444\" /> Transmission Relay Path & Geolocation Map
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          {trace.length} IP Hop{trace.length > 1 ? 's' : ''} Reconstructed
        </span>
      </div>

      {validHops.length > 0 ? (
        <div style={{ borderRadius: 8, overflow: 'hidden', height: 360, width: '100%', marginBottom: 16 }}>
          <MapContainer center={defaultCenter} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>'
              url=\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\"
            />
            {polylinePositions.length > 1 && (
              <Polyline positions={polylinePositions} color=\"#ef4444\" weight={3} dashArray=\"6, 6\" />
            )}
            {validHops.map((h, i) => (
              <Marker key={i} position={[h.lat, h.lon]}>
                <Popup>
                  <div style={{ color: '#0f172a', fontSize: '0.85rem' }}>
                    <strong>{h.is_origin ? '📍 Earliest Originating Node' : Hop #}</strong><br />
                    <b>IP:</b> {h.ip}<br />
                    <b>Location:</b> {h.city}, {h.country}<br />
                    <b>ISP/ASN:</b> {h.org}
                    {h.is_hosting && <div style={{ color: '#b91c1c', fontWeight: 700 }}>⚠️ Cloud / VPS Infrastructure</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
          Hop IPs resolved to private/intranet addresses or lack geolocation coordinates.
        </div>
      )}

      {/* Relay Hops Sequence Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '8px 6px' }}>Hop</th>
              <th style={{ padding: '8px 6px' }}>IP Address</th>
              <th style={{ padding: '8px 6px' }}>Estimated Location</th>
              <th style={{ padding: '8px 6px' }}>Network / ASN Org</th>
              <th style={{ padding: '8px 6px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((h, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '8px 6px' }}>
                  <span className={adge }>
                    {h.is_origin ? 'ORIGIN' : #}
                  </span>
                </td>
                <td style={{ padding: '8px 6px' }}><code>{h.ip}</code></td>
                <td style={{ padding: '8px 6px' }}>{h.city ? ${h.city},  : 'Unknown'}</td>
                <td style={{ padding: '8px 6px' }}>{h.org || 'Unknown'}</td>
                <td style={{ padding: '8px 6px' }}>
                  {h.is_hosting ? (
                    <span style={{ color: '#f87171', fontWeight: 600 }}>VPS / DataCenter</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>ISP / Mail Gateway</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
