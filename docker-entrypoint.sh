#!/bin/sh
set -e

echo "========================================"
echo " Lara Beauty Store — container start"
echo " Port: ${PORT:-3000}"
echo "========================================"

if [ ! -f "package.json" ]; then
  echo "[FATAL] package.json missing"
  exit 1
fi

if [ ! -d ".next" ]; then
  echo "[FATAL] .next/ missing — image was not built correctly"
  exit 1
fi

echo "[OK] Starting Next.js on 0.0.0.0:${PORT:-3000}"
exec npx next start -H 0.0.0.0 -p "${PORT:-3000}"
