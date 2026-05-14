/**
 * PM2 Ecosystem Configuration
 * ============================
 * VPS Deployment with PM2 (Node.js 20+)
 *
 * Usage:
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *   pm2 startup   # Enable auto-restart on server reboot
 *
 * With Docker instead, see Dockerfile in project root.
 */

module.exports = {
  apps: [
    {
      name: 'elevate-learning',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: process.cwd(),

      // Number of instances (use 'max' to use all CPU cores)
      instances: 1,
      exec_mode: 'fork', // use 'cluster' if instances > 1

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },

      // Auto-restart settings
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,

      // Memory limit — restart if process exceeds this
      max_memory_restart: '512M',

      // Log files
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
