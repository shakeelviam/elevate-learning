#!/bin/bash
# ── Elevate Learning — Production Deploy Script ───────────────────────────────
# Usage:  bash scripts/deploy.sh
#         bash scripts/deploy.sh testlab   (testlab only)
#         bash scripts/deploy.sh mainsite  (main site only)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="/var/www/elevate-learning"
TARGET="${1:-all}"

cd "$APP_DIR"

echo "→ Pulling latest code..."
git pull origin main

echo "→ Installing dependencies..."
npm ci

if [[ "$TARGET" == "all" || "$TARGET" == "mainsite" ]]; then
  echo "→ Building main site..."
  NODE_OPTIONS="--max-old-space-size=2048" npm run build
  echo "→ Restarting main-site..."
  pm2 restart main-site
fi

if [[ "$TARGET" == "all" || "$TARGET" == "testlab" ]]; then
  echo "→ Building Test Lab..."
  cd "$APP_DIR/apps/testlab"
  npm ci
  npx prisma migrate deploy
  NODE_OPTIONS="--max-old-space-size=1024" npm run build
  cd "$APP_DIR"
  echo "→ Restarting testlab..."
  pm2 restart testlab
fi

echo "→ Saving PM2 process list..."
pm2 save

echo ""
echo "✓ Deploy complete."
echo "  Main site:  https://yourdomain.com"
echo "  Test Lab:   https://testlab.yourdomain.com"
echo ""
echo "  pm2 logs         — live logs"
echo "  pm2 status       — process status"
