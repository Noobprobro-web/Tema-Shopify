import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = process.env.HARNESS_DIR || path.dirname(fileURLToPath(import.meta.url));

export default {
  testDir: DIR,
  testMatch: 'fixes5a3.spec.mjs',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 5000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8111',
    ...(process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {}),
  },
  webServer: {
    command: `python3 -m http.server 8111 --bind 127.0.0.1 --directory "${DIR}"`,
    url: 'http://127.0.0.1:8111/site/pdp-plan.html',
    reuseExistingServer: true,
  },
};
