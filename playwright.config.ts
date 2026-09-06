import { defineConfig, devices } from '@playwright/test';

// One build serves one theme; the port follows the theme so a 2.0 server is never reused for a 3.0 run.
const theme = process.env.NEXT_PUBLIC_THEME === 'mcd3' ? 'mcd3' : 'mcd2';
const port = theme === 'mcd3' ? 3101 : 3100;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : undefined,
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  // Tests run against a production build so headers and metadata match Vercel.
  webServer: {
    command: `pnpm build && pnpm start -p ${port}`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // A test container id so the consent path can be exercised; the loader request itself is blocked in tests.
    env: { NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TEST0000', ...(theme === 'mcd3' ? { NEXT_PUBLIC_THEME: 'mcd3' } : {}) },
  },
});
