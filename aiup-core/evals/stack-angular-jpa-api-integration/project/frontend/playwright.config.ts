import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:4200' },
  webServer: { command: 'npm start', url: 'http://localhost:4200', reuseExistingServer: true },
});
