import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './solutions',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000/health',
    reuseExistingServer: !process.env.CI,
  },
});
