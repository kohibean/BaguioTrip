import React, { useState } from 'react';
import { ATTRACTIONS, CATEGORY_META } from './data.js';
import { crpId } from './storage.js';

function totalMins(day, attractionById) {
  return day.stops.reduce((sum, s) => {
    const a = attractionById[s.attractionId];
    return sum + (a ? a.suggestedMins : 0);
  }, 0);
}

function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function Schedule({ trip, setTrip, attractionById }) {
  const [pickerDay, setPickerDay] = useState(null); // index or null

  const renameDay = (i, title) => {
    const days = trip.days.map((d, idx) => (idx === i ? { ...d, title } : d));
    setTrip({ ...trip, days });
  };

  const addDay = () => {
    setTrip({
      ...trip,
      days: [...trip.days, { id: crpId(), title: `Day ${trip.days.length + 1}`, stops: [] }]
    });
  };

  const removeDay = (i) => {
    if (trip.days.length === 1) return;
    setTrip({ ...trip, days: trip.days.filter((_, idx) => idx !== i) });
  };

  const addStop = (dayIndex, attractionId) => {
    const days = trip.days.map((d, idx) =>
      idx === dayIndex ? { ...d, stops: [...d.stops, { id: crpId(), attractionId }] } : d
    );
    setTrip({ ...trip, days });
    setPickerDay(null);
  };

  const removeStop = (dayIndex, stopId) => {
    const days = trip.days.map((d, idx) =>
      idx === dayIndex ? { ...d, stops: d.stops.filter((s) => s.id !== stopId) } : d
    );
    setTrip({ ...trip, days });
  };

  const moveStop = (dayIndex, stopId, dir) => {
    const day = trip.days[dayIndex];
    const i = day.stops.findIndex((s) => s.id === stopId);
    const j = i + dir;
    if (j < 0 || j >= day.stops.length) return;
    const stops = [...day.stops];
    [stops[i], stops[j]] = [stops[j], stops[i]];
    const days = trip.days.map((d, idx) => (idx === dayIndex ? { ...d, stops } : d));
    setTrip({ ...trip, days });
  };

  return (
    <section className="section">
      <div className="section-title">
        Your Itinerary
        <small>{trip.days.length} day{trip.days.length > 1 ? 's' : ''}</small>
      </div>

      {trip.days.map((day, di) => {
        const mins = totalMins(day, attractionById);
        return (
          <div className="day" key={day.id}>
            <div className="day-head">
              <input
                value={day.title}
                onChange={(e) => renameDay(di, e.target.value)}
                aria-label="Day title"
              />
              <span className="day-meta">
                {day.stops.length} stop{day.stops.length !== 1 ? 's' : ''}
                {mins > 0 ? ` \u00B7 ~${fmtDuration(mins)}` : ''}
              </span>
              {trip.days.length > 1 && (
                <button className="icon-btn danger" onClick={() => removeDay(di)} aria-label="Remove day">
                  &times;
                </button>
              )}
            </div>

            {day.stops.length === 0 && (
              <div className="empty" style={{ padding: '14px' }}>
                Nothing planned yet — add your first stop.
              </div>
            )}

            {day.stops.map((s) => {
              const a = attractionById[s.attractionId];
              if (!a) return null;
              const meta = CATEGORY_META[a.category];
              return (
                <div className="stop" key={s.id}>
                  <span className="glyph">{meta.glyph}</span>
                  <div className="body">
                    <h4>{a.name}</h4>
                    <p>{a.blurb}</p>
                    <span className="tag">{meta.label} \u00B7 ~{fmtDuration(a.suggestedMins)}</span>
                  </div>
                  <div className="actions">
                    <button className="icon-btn" onClick={() => moveStop(di, s.id, -1)} aria-label="Move up">&uarr;</button>
                    <button className="icon-btn" onClick={() => moveStop(di, s.id, 1)} aria-label="Move down">&darr;</button>
                    <button className="icon-btn danger" onClick={() => removeStop(di, s.id)} aria-label="Remove stop">&times;</button>
                  </div>
                </div>
              );
            })}

            <button className="add-btn" onClick={() => setPickerDay(di)}>
              + Add a stop to {day.title}
            </button>
          </div>
        );
      })}

      <button className="day-add" onClick={addDay}>+ Add another day</button>

      {pickerDay !== null && (
        <PickerSheet
          onPick={(id) => addStop(pickerDay, id)}
          onClose={() => setPickerDay(null)}
        />
      )}
    </section>
  );
}

function PickerSheet({ onPick, onClose }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <h3>Add a stop</h3>
        <p className="hint">Tap a place to drop it into your day.</p>
        {ATTRACTIONS.map((a) => {
          const meta = CATEGORY_META[a.category];
          return (
            <button className="pick" key={a.id} onClick={() => onPick(a.id)}>
              <span className="glyph">{meta.glyph}</span>
              <div className="body">
                <h4>{a.name}</h4>
                <p>{meta.label}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
