import React, { useEffect, useMemo, useState } from 'react';
import { ATTRACTIONS, CATEGORY_META } from './data.js';
import { loadTrip, saveTrip, defaultTrip, crpId } from './storage.js';
import Schedule from './Schedule.jsx';
import Weather from './Weather.jsx';
import TripMap from './TripMap.jsx';

const TABS = [
  { id: 'plan', label: 'Plan', ico: '\u25C8' },
  { id: 'weather', label: 'Weather', ico: '\u2600' },
  { id: 'map', label: 'Map', ico: '\u25B2' }
];

export default function App() {
  const [tab, setTab] = useState('plan');
  const [trip, setTrip] = useState(() => loadTrip() || defaultTrip());

  // Persist on every change — this is our "database".
  useEffect(() => { saveTrip(trip); }, [trip]);

  const attractionById = useMemo(() => {
    const m = {};
    for (const a of ATTRACTIONS) m[a.id] = a;
    return m;
  }, []);

  // Every attraction referenced by the plan, for the map markers.
  const plannedStops = useMemo(() => {
    const seen = new Set();
    const out = [];
    trip.days.forEach((day, di) => {
      day.stops.forEach((s) => {
        const a = attractionById[s.attractionId];
        if (a && !seen.has(a.id)) { seen.add(a.id); out.push({ ...a, dayIndex: di }); }
      });
    });
    return out;
  }, [trip, attractionById]);

  return (
    <div className="app">
      <header className="hero">
        <div className="kicker">City of Pines</div>
        <h1>Baguio Trip</h1>
        <p>Build your days, watch the highland weather, map every stop.</p>
      </header>

      {tab === 'plan' && (
        <Schedule trip={trip} setTrip={setTrip} attractionById={attractionById} />
      )}
      {tab === 'weather' && <Weather trip={trip} />}
      {tab === 'map' && <TripMap stops={plannedStops} />}

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
            aria-label={t.label}
          >
            <span className="ico">{t.ico}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export { CATEGORY_META, crpId };
