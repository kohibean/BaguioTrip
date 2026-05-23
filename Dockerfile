# ---- Stage 1: build the static PWA ---------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---- Stage 2: serve with a tiny Nginx ------------------------------
FROM nginx:1.27-alpine AS runtime

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html
# PWA-aware Nginx config (SPA fallback + no-cache for the service worker)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
