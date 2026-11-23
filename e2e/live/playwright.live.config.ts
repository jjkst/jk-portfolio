import { defineConfig, devices } from '@playwright/test';

// Live end-to-end suite: drives the real UI against a real RukuServiceApi + MariaDB
// (RukuApiService/docker-compose.local.yml). Nothing is mocked, so it is kept out of
// the default suite in ../playwright.config.ts, which runs in CI without a backend.
export default defineConfig({
  testDir: './',
  outputDir: './test-results',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: './playwright-report', open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
