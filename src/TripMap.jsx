import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BAGUIO_CENTER, CATEGORY_META } from './data.js';

// Build a small inline divIcon so we don't depend on Leaflet's default
// marker image assets (which often break under bundlers).
function pinIcon(label) {
  return L.divIcon({
    className: 'pine-pin',
    html: `<div style="
      background:#1f3326;color:#f4f1e9;width:30px;height:30px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);display:grid;place-items:center;
      box-shadow:0 4px 10px -3px rgba(0,0,0,0.5);border:2px solid #6b8f5e;">
      <span style="transform:rotate(45deg);font-size:14px;line-height:1;">${label}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26]
  });
}

export default function TripMap({ stops }) {
  const center = stops.length ? [stops[0].lat, stops[0].lng] : [BAGUIO_CENTER.lat, BAGUIO_CENTER.lng];
  const line = stops.map((s) => [s.lat, s.lng]);

  return (
    <section className="section">
      <div className="section-title">
        Trip Map
        <small>{stops.length} stop{stops.length !== 1 ? 's' : ''} \u00B7 OpenStreetMap</small>
      </div>

      {stops.length === 0 ? (
        <div className="card">
          <div className="empty">
            <span className="em-glyph">{'\u25B2'}</span>
            Add stops in the Plan tab and they&rsquo;ll appear here, pinned and connected
            in visiting order.
          </div>
        </div>
      ) : (
        <>
          <div className="map-wrap">
            <MapContainer center={center} zoom={13} scrollWheelZoom>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {line.length > 1 && (
                <Polyline positions={line} pathOptions={{ color: '#b23a48', weight: 3, dashArray: '6 8', opacity: 0.8 }} />
              )}
              {stops.map((s, i) => (
                <Marker key={s.id} position={[s.lat, s.lng]} icon={pinIcon(String(i + 1))}>
                  <Popup>
                    <strong>{s.name}</strong>
                    <br />
                    <span style={{ color: '#5d6b58', fontSize: 12 }}>
                      {CATEGORY_META[s.category].label}
                    </span>
                    <br />
                    {s.blurb}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div className="map-legend">
            <span><span className="dot" /> numbered in visiting order</span>
            <span>dashed line = your route</span>
          </div>
        </>
      )}
    </section>
  );
}
