import { BAGUIO_CENTER } from './data.js';

// WMO weather interpretation codes -> friendly label + glyph.
// https://open-meteo.com/en/docs
const WMO = {
  0:  ['Clear', '\u2600'],
  1:  ['Mostly clear', '\u1F324'],
  2:  ['Partly cloudy', '\u26C5'],
  3:  ['Overcast', '\u2601'],
  45: ['Fog', '\u1F32B'],
  48: ['Rime fog', '\u1F32B'],
  51: ['Light drizzle', '\u1F327'],
  53: ['Drizzle', '\u1F327'],
  55: ['Heavy drizzle', '\u1F327'],
  61: ['Light rain', '\u1F327'],
  63: ['Rain', '\u1F327'],
  65: ['Heavy rain', '\u26C8'],
  80: ['Rain showers', '\u1F326'],
  81: ['Rain showers', '\u1F326'],
  82: ['Violent showers', '\u26C8'],
  95: ['Thunderstorm', '\u26C8'],
  96: ['Thunderstorm', '\u26C8'],
  99: ['Thunderstorm', '\u26C8']
};

export function describeCode(code) {
  const [label, glyph] = WMO[code] || ['\u2014', '\u2601'];
  return { label, glyph };
}

// Fetch a multi-day daily forecast for Baguio. No API key required.
export async function fetchForecast(days = 7) {
  const { lat, lng } = BAGUIO_CENTER;
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Asia/Manila',
    forecast_days: String(days)
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
  const json = await res.json();
  const d = json.daily;
  return d.time.map((date, i) => ({
    date,
    code: d.weather_code[i],
    tMax: Math.round(d.temperature_2m_max[i]),
    tMin: Math.round(d.temperature_2m_min[i]),
    rain: d.precipitation_probability_max[i]
  }));
}
