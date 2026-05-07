# e-Arzuhal Frontend Web Dockerfile
# Multi-stage: build CRA bundle, serve with nginx

# ── Build stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /build

# CRA bakes env vars at build time, so they must be present here
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runtime stage ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
