#!/bin/bash
# ── Contabo VPS — One-Time Server Setup ──────────────────────────────────────
# Run once on a fresh Ubuntu 22.04 VPS as root or with sudo.
# Usage: bash scripts/server-setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "=== 1. System update ==="
apt update && apt upgrade -y

echo "=== 2. Core packages ==="
apt install -y git curl wget nginx postgresql postgresql-contrib certbot python3-certbot-nginx ufw build-essential python3-pip python3-venv

echo "=== 3. Node.js 20 via NVM ==="
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
npm install -g pm2

echo "=== 4. PostgreSQL — create database and user ==="
# Edit the password below before running
PG_PASSWORD="change_this_password"
sudo -u postgres psql <<EOF
CREATE USER elevate WITH PASSWORD '$PG_PASSWORD';
CREATE DATABASE elevate_ai OWNER elevate;
GRANT ALL PRIVILEGES ON DATABASE elevate_ai TO elevate;
EOF
echo "PostgreSQL database 'elevate_ai' created."

echo "=== 5. Firewall (UFW) ==="
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp   # Test Lab (temporary until domain + SSL is ready)
# Block direct access to internal app ports and AI backend
ufw deny 3000/tcp
ufw deny 3001/tcp
ufw deny 8000/tcp
ufw --force enable
echo "UFW configured."

echo "=== 6. Deploy directory ==="
mkdir -p /var/www/elevate-learning/logs
# Clone the repo (replace with your actual repo URL)
# git clone https://github.com/your-org/elevate-learning.git /var/www/elevate-learning

echo "=== 7. Nginx site config ==="
echo "  Copy nginx.conf to /etc/nginx/sites-available/elevate"
echo "  then run:"
echo "    sudo ln -s /etc/nginx/sites-available/elevate /etc/nginx/sites-enabled/"
echo "    sudo nginx -t && sudo systemctl reload nginx"

echo "=== 8. SSL — run after DNS is pointing to this server ==="
echo "  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d testlab.yourdomain.com"

echo ""
echo "=== Setup complete ==="
echo "Next steps:"
echo "  1. Clone your repo to /var/www/elevate-learning"
echo "  2. Copy .env.production to /var/www/elevate-learning/.env.local"
echo "  3. Copy apps/testlab/.env.example to apps/testlab/.env.local and fill in values"
echo "  4. Run: bash scripts/deploy.sh"
echo "  5. Run: pm2 startup && pm2 save"
echo "  6. Configure Nginx and get SSL cert"
