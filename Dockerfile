# EasyPanel: branch frontend OR main, empty source path, port 3000
# Bump CACHEBUST to force full rebuild after deploy issues
ARG CACHEBUST=larabeauty-frontend-v3-push-2026-07-27

FROM node:20-alpine AS base
RUN echo "BUILD ${CACHEBUST}" && apk add --no-cache libc6-compat curl
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV VERCEL=1
ENV NEXT_PUBLIC_SITE_URL=https://larabeauty.store
ENV NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
ENV NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
RUN npm run build && test -d .next

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:3000/api/health" || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
