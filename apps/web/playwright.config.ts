import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';
import { BSAS_TIME_ZONE } from '@scout/shared/time';

// Credenciales E2E_EMAIL/E2E_PASSWORD y API_URL viven en .env.local.
const ENV_FILE = '.env.local';
if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);

/**
 * E2E contra `pnpm dev` (4201, único origin que acepta el CORS del backend) y el
 * backend LOCAL (http://localhost:3001/api/v1). Nunca contra producción.
 * Serial: los specs comparten la DB de dev/test del backend.
 */
const WEB_URL = 'http://localhost:4201';
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: WEB_URL,
    locale: 'es-AR',
    timezoneId: BSAS_TIME_ZONE,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: WEB_URL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
