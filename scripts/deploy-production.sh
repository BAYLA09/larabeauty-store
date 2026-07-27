#!/usr/bin/env bash
# Production deploy script — run on server after git pull
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Pulling latest main..."
git fetch origin main
git reset --hard origin/main

echo "→ Installing dependencies..."
npm ci

echo "→ Building..."
export NEXT_PUBLIC_SITE_URL=https://larabeauty.store
export NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
export NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
export DEPLOY_WEBHOOK_SECRET=lara-beauty-secret-2026
export VERCEL=1
npm run build

echo "→ Restarting app..."
if command -v pm2 >/dev/null; then
  pm2 restart larabeauty || pm2 start npm --name larabeauty -- start
elif command -v systemctl >/dev/null; then
  sudo systemctl restart larabeauty
else
  npm start &
fi

echo "✓ Deploy complete — https://larabeauty.store"
