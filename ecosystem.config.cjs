// PM2 process file. Start with: pm2 start ecosystem.config.cjs && pm2 save
// The standalone server is produced by `npm run build` in .next/standalone.
module.exports = {
  apps: [
    {
      name: 'felibest',
      cwd: '/var/www/felibest',
      script: '.next/standalone/server.js',
      instances: 1, // SQLite and the in-memory rate limiter assume a single process
      exec_mode: 'fork',
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '127.0.0.1',
        // Secrets and paths are read from /var/www/felibest/.env by `node --env-file`, see README.
      },
      node_args: '--env-file=/var/www/felibest/.env',
      time: true,
    },
  ],
};
