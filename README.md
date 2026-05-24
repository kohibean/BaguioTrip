<<<<<<< HEAD
# Baguio Trip — City of Pines Planner

An interactive **PWA** for planning a trip to Baguio City. Build a day-by-day
itinerary, check the highland weather, and see every stop pinned on a map —
all installable to your phone's home screen and usable offline.

Built as a "just for fun" project with an automated Docker + GitLab CI/CD
pipeline.

## Features

- **Day-by-day schedule builder** — add/reorder/remove stops across multiple days, with auto-calculated time estimates. Your plan is saved to the browser (no account, no backend) and survives reloads and offline use.
- **Weather forecast** — 7-day forecast for Baguio via the free **Open-Meteo** API (no API key required).
- **Map of stops** — interactive **Leaflet + OpenStreetMap** map (no API key, no billing) with numbered pins in visiting order and a dashed route line.
- **Offline support** — a service worker (via `vite-plugin-pwa`) precaches the app shell and runtime-caches weather responses and map tiles you've already viewed.

## Free APIs used

| Purpose | Service | Key needed? |
|---|---|---|
| Weather forecast | [Open-Meteo](https://open-meteo.com/) | No |
| Map tiles | [OpenStreetMap](https://www.openstreetmap.org/) | No |

## Tech stack

React 18 + Vite, `vite-plugin-pwa` (Workbox), `react-leaflet`. Served in
production by Nginx from a multi-stage Docker image.

## Run locally (dev)

```bash
npm install
npm run dev        # http://localhost:5173
```

## Run with Docker

```bash
docker compose up --build
# open http://localhost:8080
```

## Quality checks

```bash
npm run lint       # ESLint (zero-warning policy)
npm run test       # Vitest unit tests
npm run build      # production build -> dist/
```

## CI/CD (GitLab)

`.gitlab-ci.yml` defines four stages:

1. **install** — `npm ci`, caches `node_modules`.
2. **quality** — `lint` and `test` run in parallel.
3. **build** — builds the production bundle and a Docker image, then pushes it to the project's **Container Registry** (`$CI_REGISTRY_IMAGE`). Runs only on the default branch.
4. **deploy** — builds with the correct subpath base and publishes the PWA to **GitLab Pages** (free static hosting) at `https://<namespace>.gitlab.io/<project>/`.

No CI variables need to be set manually — the registry credentials
(`$CI_REGISTRY_*`) and project metadata are injected by GitLab automatically.

### Notes

- The Pages build sets `PUBLIC_BASE=/<project>/` so asset URLs resolve under the project subpath. If you host at a root domain instead, leave `PUBLIC_BASE` unset.
- The pulled Docker image can be run anywhere: `docker run -p 8080:80 <registry-image>:latest`.

## Project layout

```
.
├── public/              # static assets (icons, manifest source)
├── src/
│   ├── App.jsx          # shell + tab navigation + trip state
│   ├── Schedule.jsx     # day-by-day builder
│   ├── Weather.jsx      # Open-Meteo forecast view
│   ├── TripMap.jsx      # Leaflet/OSM map
│   ├── data.js          # curated Baguio attractions (with coords)
│   ├── weather.js       # Open-Meteo client + WMO code mapping
│   ├── storage.js       # localStorage trip persistence
│   └── __tests__/       # Vitest unit tests
├── Dockerfile           # multi-stage: Node build -> Nginx serve
├── nginx.conf           # SPA fallback + PWA-aware caching headers
├── docker-compose.yml
└── .gitlab-ci.yml       # install / quality / build / deploy
```


