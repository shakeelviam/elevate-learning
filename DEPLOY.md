# Deployment Guide — Elevate Learning

## Phase 1: Deploy now (IP only, no domain)

### 1. Get your VPS
Buy **Contabo Cloud VPS M** (4 vCPU, 8 GB RAM, Ubuntu 22.04).
Note your server IP — referred to as `YOUR_IP` below.

---

### 2. Connect and run one-time setup
```bash
ssh root@YOUR_IP
bash <(curl -s https://raw.githubusercontent.com/your-org/elevate-learning/main/scripts/server-setup.sh)
# OR after cloning the repo:
bash /var/www/elevate-learning/scripts/server-setup.sh
```

Or manually, step by step:
```bash
apt update && apt upgrade -y
apt install -y git nginx postgresql postgresql-contrib certbot python3-certbot-nginx ufw build-essential python3-venv

# Node.js 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20 && nvm alias default 20
npm install -g pm2

# PostgreSQL — set a strong password
sudo -u postgres psql -c "CREATE USER elevate WITH PASSWORD 'YOUR_DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE elevate_ai OWNER elevate;"

# Firewall
ufw allow ssh && ufw allow 80 && ufw allow 443 && ufw allow 8080
ufw deny 3000 && ufw deny 3001 && ufw deny 8000
ufw --force enable
```

---

### 3. Clone the repo
```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/your-org/elevate-learning.git
cd elevate-learning
mkdir -p logs
```

---

### 4. Create environment files

**Main site** — `/var/www/elevate-learning/.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://YOUR_IP
NEXT_PUBLIC_TEST_LAB_URL=http://YOUR_IP:8080

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

NEXT_PUBLIC_SANITY_PROJECT_ID=7vl4bc10
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_WRITE_TOKEN=sk1n...

RESEND_API_KEY=re_...
RESEND_FROM_ADDRESS=noreply@yourdomain.com
```

**Test Lab** — `/var/www/elevate-learning/apps/testlab/.env.local`:
```env
DATABASE_URL=postgresql://elevate:YOUR_DB_PASSWORD@localhost:5432/elevate_ai

ADMIN_USERNAME=admin
ADMIN_PASSWORD=pick_a_strong_password

# Generate with: openssl rand -hex 32
ADMIN_SESSION_SECRET=paste_32_byte_hex_here

# Disable secure cookies (no HTTPS yet — remove this line when domain + SSL is set up)
COOKIE_SECURE=false

FASTAPI_URL=http://localhost:8000
# Must match SECRET_KEY in backend/.env
FASTAPI_JWT_SECRET=insecure-dev-key-change-in-production

NEXT_PUBLIC_TEST_LAB_API_URL=http://localhost:8000
```

**FastAPI backend** — `/var/www/elevate-learning/backend/.env`:
```env
DATABASE_URL=postgresql://elevate:YOUR_DB_PASSWORD@localhost:5432/elevate_ai
SECRET_KEY=insecure-dev-key-change-in-production   # must match FASTAPI_JWT_SECRET above
ALLOWED_ORIGINS=http://YOUR_IP,http://YOUR_IP:8080
```

---

### 5. Install & build
```bash
cd /var/www/elevate-learning

# Main site
npm ci
npm run build

# Test Lab
cd apps/testlab
npm ci
npx prisma db push        # creates tl_credentials and tl_sessions tables
npm run build
cd /var/www/elevate-learning

# Python backend
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cd /var/www/elevate-learning
```

---

### 6. Configure Nginx (IP mode)
```bash
sudo cp nginx-ip.conf /etc/nginx/sites-available/elevate
sudo ln -sf /etc/nginx/sites-available/elevate /etc/nginx/sites-enabled/elevate
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

### 7. Start all processes with PM2
```bash
cd /var/www/elevate-learning
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed command to enable auto-start on reboot
```

Check everything is running:
```bash
pm2 status
pm2 logs --lines 50
```

---

### 8. Verify
- Main site: `http://YOUR_IP`
- Test Lab: `http://YOUR_IP:8080`
- Test Lab admin: `http://YOUR_IP:8080/admin`

---

## Phase 2: Upgrade to domain + SSL (when domain is ready)

### 1. Point DNS
Add two A records at your domain registrar:
```
A   yourdomain.com        →  YOUR_IP
A   www.yourdomain.com    →  YOUR_IP
A   testlab.yourdomain.com →  YOUR_IP
```
Wait for propagation (usually 15–60 min). Verify: `dig yourdomain.com`

### 2. Update env files

**Main site** `.env.local` — change these two lines:
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_TEST_LAB_URL=https://testlab.yourdomain.com
```

**Test Lab** `.env.local` — remove the COOKIE_SECURE line:
```env
# Delete this line:
# COOKIE_SECURE=false
```

**FastAPI backend** `.env` — update ALLOWED_ORIGINS:
```env
ALLOWED_ORIGINS=https://yourdomain.com,https://testlab.yourdomain.com
```

### 3. Switch Nginx to domain + SSL config
```bash
sudo cp nginx.conf /etc/nginx/sites-available/elevate
# Replace "yourdomain.com" with your actual domain in the file
sudo sed -i 's/yourdomain.com/youractualdomain.com/g' /etc/nginx/sites-available/elevate
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d testlab.yourdomain.com
```

### 4. Rebuild and restart
```bash
cd /var/www/elevate-learning
bash scripts/deploy.sh
```

### 5. Close port 8080
```bash
sudo ufw deny 8080
sudo ufw reload
```

Done — the site is now running over HTTPS with proper subdomains.

---

## Useful commands

```bash
pm2 status              # see all processes
pm2 logs                # live logs (all)
pm2 logs testlab        # test lab logs only
pm2 restart testlab     # restart just the test lab
pm2 restart main-site   # restart just the main site
pm2 restart ai-backend  # restart the FastAPI backend

sudo systemctl status nginx
sudo nginx -t           # test nginx config before reloading
sudo systemctl reload nginx
```
