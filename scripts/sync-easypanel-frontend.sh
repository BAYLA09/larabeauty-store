#!/usr/bin/env bash
# Push latest larabeauty-store → lara-beauty-store-gcc/laragccfrontend (branch frontend)
# Easypanel pulls from laragccfrontend/frontend — run this once, then Deploy in Easypanel.
set -euo pipefail

SOURCE_REPO="${SOURCE_REPO:-https://github.com/BAYLA09/larabeauty-store.git}"
SOURCE_BRANCH="${SOURCE_BRANCH:-frontend}"
TARGET_REPO="${TARGET_REPO:-https://github.com/lara-beauty-store-gcc/laragccfrontend.git}"
TARGET_BRANCH="${TARGET_BRANCH:-frontend}"

WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

echo "→ Cloning source: ${SOURCE_REPO} (${SOURCE_BRANCH})"
git clone --depth 1 -b "$SOURCE_BRANCH" "$SOURCE_REPO" "$WORKDIR/source"

echo "→ Cloning target: ${TARGET_REPO} (${TARGET_BRANCH})"
git clone --depth 1 -b "$TARGET_BRANCH" "$TARGET_REPO" "$WORKDIR/target"

echo "→ Copying files..."
find "$WORKDIR/target" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
tar -C "$WORKDIR/source" \
  --exclude=.git \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=out \
  -cf - . | tar -xf - -C "$WORKDIR/target"

cd "$WORKDIR/target"
git add -A

if git diff --staged --quiet; then
  echo "✓ laragccfrontend/frontend already up to date"
  exit 0
fi

SHA=$(git -C "$WORKDIR/source" rev-parse --short HEAD)
git config user.name "${GIT_USER_NAME:-Lara Beauty Deploy}"
git config user.email "${GIT_USER_EMAIL:-deploy@larabeauty.store}"
git commit -m "deploy(frontend): sync from BAYLA09/larabeauty-store@${SHA}

EasyPanel: branch frontend, port 3000, Dockerfile
Auto-sync script — $(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "→ Pushing to ${TARGET_BRANCH}..."
git push origin "$TARGET_BRANCH"

echo ""
echo "✓ Done! Sir Easypanel → frontend → Deploy"
echo "  ${TARGET_REPO} branch ${TARGET_BRANCH}"
