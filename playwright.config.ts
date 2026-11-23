import { defineConfig } from '@playwright/test';

const port = 3100;
export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  webServer: {
    command: `node scripts/reset-e2e-db.mjs && npx cross-env NEXT_PUBLIC_SITE_URL=https://felibestplumbing.co.ke PORT=${port} DATABASE_PATH=./data/e2e.db UPLOAD_DIR=./data/e2e-uploads SESSION_SECRET=e2e-session-secret-e2e-session-secret-1234 ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=E2eAdminPass#1 ANALYTICS_SALT=e2e-salt npm run e2e:serve`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
