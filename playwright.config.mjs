import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.mjs',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['line']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:9292',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
});
