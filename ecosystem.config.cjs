/**
 * PM2 Ecosystem Configuration
 * ============================
 * Manages two Next.js apps on one Contabo VPS.
 *
 * Setup:
 *   npm run build && npm run build:testlab
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup
 *
 * Logs:
 *   pm2 logs
 *   pm2 logs main-site
 *   pm2 logs testlab
 */

module.exports = {
  apps: [
    {
      name: 'main-site',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/elevate-learning',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      out_file: './logs/main-out.log',
      error_file: './logs/main-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'testlab',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: '/var/www/elevate-learning/apps/testlab',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: '384M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: '0.0.0.0',
      },
      out_file: '/var/www/elevate-learning/logs/testlab-out.log',
      error_file: '/var/www/elevate-learning/logs/testlab-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'ai-backend',
      script: '/var/www/elevate-learning/backend/.venv/bin/uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8000',
      cwd: '/var/www/elevate-learning/backend',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        PYTHONUNBUFFERED: '1',
      },
      out_file: '/var/www/elevate-learning/logs/backend-out.log',
      error_file: '/var/www/elevate-learning/logs/backend-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
