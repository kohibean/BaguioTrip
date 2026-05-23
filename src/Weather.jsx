import React, { useEffect, useState } from 'react';
import { fetchForecast, describeCode } from './weather.js';

function dow(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

export default function Weather() {
  const [days, setDays] = useState(null);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchForecast(7)
      .then((d) => { if (alive) { setDays(d); setFromCache(!navigator.onLine); } })
      .catch((e) => { if (alive) setError(e.message); });
    return () => { alive = false; };
  }, []);

  return (
    <section className="section">
      <div className="section-title">
        Baguio Forecast
        <small>7 days \u00B7 Open-Meteo</small>
      </div>

      {!days && !error && <div className="spinner" />}

      {error && (
        <div className="card">
          <div className="notice">
            Couldn&rsquo;t reach the weather service. If you&rsquo;ve opened this view before,
            a cached forecast will appear once offline caching kicks in.
          </div>
        </div>
      )}

      {days && (
        <>
          <div className="wx-row">
            {days.map((d) => {
              const w = describeCode(d.code);
              return (
                <div className="wx-card" key={d.date}>
                  <div className="dow">{dow(d.date)}</div>
                  <div className="big">{w.glyph}</div>
                  <div className="temp">{d.tMax}&deg; <span className="lo">/ {d.tMin}&deg;</span></div>
                  <div className="lbl">{w.label}</div>
                  {d.rain != null && <div className="rain">{d.rain}% rain</div>}
                </div>
              );
            })}
          </div>
          <div className="card" style={{ marginTop: 14 }}>
            <div className="notice">
              Baguio sits ~1,500 m up, so pack a light jacket even in summer — evenings
              dip into the teens (&deg;C) and fog rolls in fast.
              {fromCache && <span className="offline-pill">&#9679; showing cached data</span>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
