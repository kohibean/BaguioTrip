// Tiny localStorage-backed store for the itinerary. No backend needed —
// the whole trip plan lives in the browser and survives reloads + offline.

const KEY = 'baguio-trip-v1';

export function loadTrip() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveTrip(trip) {
  try {
    localStorage.setItem(KEY, JSON.stringify(trip));
  } catch {
    // storage full or disabled — fail quietly, app still works in-memory
  }
}

export function defaultTrip() {
  return {
    days: [
      { id: crpId(), title: 'Day 10', stops: [] },
      { id: crpId(), title: 'Day 2', stops: [] }
    ]
  };
}

export function crpId() {
  return 'id-' + Math.random().toString(36).slice(2, 9);
}
