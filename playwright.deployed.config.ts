import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'node:fs';

const { homepage } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);
export default defineConfig({
  testDir: './e2e-deployed',
  timeout: 60000,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: homepage,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
