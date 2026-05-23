import React, { useEffect, useMemo, useState } from 'react';
import { fetchRoute, directionsUrl, fmtKm, fmtMins } from './routing.js';

// Flatten the trip into ordered legs: each consecutive pair of stops
// within a day becomes one leg (from -> to). Days don't chain into each
// other (you presumably go home / to your hotel between days).
function buildLegs(trip, attractionById) {
  const legs = [];
  trip.days.forEach((day, di) => {
    for (let i = 0; i < day.stops.length - 1; i++) {
      const a = attractionById[day.stops[i].attractionId];
      const b = attractionById[day.stops[i + 1].attractionId];
      if (a && b) legs.push({ key: `${di}-${i}`, dayTitle: day.title, from: a, to: b });
    }
  });
  return legs;
}

function Leg({ leg }) {
  const [route, setRoute] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchRoute(leg.from, leg.to)
      .then((r) => { if (alive) setRoute(r); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [leg.from, leg.to]);

  return (
    <div className="leg">
      <div className="leg-route">
        <span className="leg-dot" />
        <div className="leg-names">
          <span className="leg-from">{leg.from.name}</span>
          <span className="leg-arrow">{'\u2193'}</span>
          <span className="leg-to">{leg.to.name}</span>
        </div>
      </div>

      <div className="leg-meta">
        {!route && !error && <span className="leg-loading">measuring\u2026</span>}
        {error && <span className="leg-loading">distance unavailable</span>}
        {route && (
          <>
            <span className="leg-stat">{fmtKm(route.meters)}</span>
            <span className="leg-sep">{'\u00B7'}</span>
            <span className="leg-stat">~{fmtMins(route.seconds)} by road</span>
          </>
        )}
      </div>

      <a
        className="leg-dir"
        href={directionsUrl(leg.from, leg.to, 'transit')}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get directions {'\u2197'}
      </a>
    </div>
  );
}

export default function Travel({ trip, attractionById }) {
  const legs = useMemo(() => buildLegs(trip, attractionById), [trip, attractionById]);

  return (
    <section className="section">
      <div className="section-title">
        Getting Around
        <small>{legs.length} leg{legs.length !== 1 ? 's' : ''} \u00B7 jeepney-friendly</small>
      </div>

      {legs.length === 0 ? (
        <div className="card">
          <div className="empty">
            <span className="em-glyph">{'\u2193'}</span>
            Add at least two stops to a day in the Plan tab and the hops between
            them will show up here, with distances and one-tap directions.
          </div>
        </div>
      ) : (
        <>
          {legs.map((leg, i) => {
            const prev = i > 0 ? legs[i - 1] : null;
            const showDay = !prev || prev.dayTitle !== leg.dayTitle;
            return (
              <React.Fragment key={leg.key}>
                {showDay && <div className="leg-day">{leg.dayTitle}</div>}
                <Leg leg={leg} />
              </React.Fragment>
            );
          })}
          <div className="card" style={{ marginTop: 14 }}>
            <div className="notice">
              Distances and times are driving estimates from OpenStreetMap data.
              Jeepneys don&rsquo;t follow these exactly, so tap <em>Get directions</em> for
              real public-transport routing in Google Maps. Fares are cheap in the
              city core; far stops like Mt. Camisong are best reached by taxi or a
              chartered ride \u2014 and arrange your trip back.
            </div>
          </div>
        </>
      )}
    </section>
  );
}