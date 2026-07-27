#!/usr/bin/env bash
# Production deploy script — run on server after git pull
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Pulling latest main..."
git fetch origin main
git reset --hard origin/main

echo "→ Installing dependencies..."
npm ci

echo "→ Building static export..."
export NEXT_PUBLIC_SITE_URL=https://larabeauty.store
export NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
export NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
npm run build

echo "→ Restarting static server..."
if command -v docker >/dev/null && [ -f Dockerfile ]; then
  docker build -t larabeauty-store:latest .
  docker stop larabeauty 2>/dev/null || true
  docker rm larabeauty 2>/dev/null || true
  docker run -d --name larabeauty --restart unless-stopped -p 80:80 larabeauty-store:latest
elif command -v pm2 >/dev/null; then
  pm2 delete larabeauty 2>/dev/null || true
  pm2 serve out 3000 --name larabeauty --spa
elif command -v systemctl >/dev/null; then
  sudo systemctl restart larabeauty
else
  npx --yes serve out -l 3000 -s &
fi

echo "✓ Deploy complete — https://larabeauty.store"
