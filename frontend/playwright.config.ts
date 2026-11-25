
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  fullyParallel: false,

  timeout: 30_000,

  expect: {
    timeout: 10_000,
  },

  reporter: 'list',

  use: {
    baseURL: 'http://127.0.0.1:3000',

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    ...devices['Desktop Chrome'],
  },

  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3000 --strictPort',

    url: 'http://127.0.0.1:3000',

    reuseExistingServer: !process.env.CI,

    timeout: 120_000,
  },
});
