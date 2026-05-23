// Free, keyless driving routes via OSRM (Open Source Routing Machine).
// Public demo server: https://router.project-osrm.org
// We use it to get real road distance + duration between two stops.
// Note: OSRM routes for cars/driving — it does NOT model jeepney routes,
// so we present its time as a rough guide and hand off to Google Maps
// (transit mode) for actual public-transport directions.

export async function fetchRoute(from, to) {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OSRM responded ${res.status}`);
  const json = await res.json();
  if (!json.routes || !json.routes.length) throw new Error('No route found');
  const r = json.routes[0];
  return {
    meters: r.distance,
    seconds: r.duration
  };
}

// Build a Google Maps directions URL between two stops, defaulting to
// transit (public transport) mode since that's how the trip is planned.
export function directionsUrl(from, to, mode = 'transit') {
  const origin = `${from.lat},${from.lng}`;
  const dest = `${to.lat},${to.lng}`;
  const params = new URLSearchParams({
    api: '1',
    origin,
    destination: dest,
    travelmode: mode
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

export function fmtKm(meters) {
  const km = meters / 1000;
  if (km < 1) return `${Math.round(meters)} m`;
  return `${km.toFixed(1)} km`;
}

export function fmtMins(seconds) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}