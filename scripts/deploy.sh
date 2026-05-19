#!/bin/bash
set -e

APP_DIR="/var/www/elevate-learning"

echo "→ Pulling latest code..."
cd "$APP_DIR"
git pull origin main

echo "→ Installing dependencies..."
npm ci

echo "→ Building..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "→ Copying static assets into standalone..."
cp -r .next/static   .next/standalone/.next/static
cp -r public         .next/standalone/public

echo "→ Restarting service..."
sudo systemctl restart elevate

echo "✓ Deployed. Check status: sudo systemctl status elevate"
