import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = process.env.HARNESS_DIR || path.dirname(fileURLToPath(import.meta.url));

export default {
  testDir: DIR,
  testMatch: process.env.SPEC || 'mega5c.spec.mjs',
  outputDir: process.env.PW_OUTPUT || path.join(os.tmpdir(), 'pw-5c-results'),
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 5000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8113',
    ...(process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {}),
  },
  webServer: {
    command: `python3 -m http.server 8113 --bind 127.0.0.1 --directory "${DIR}"`,
    url: 'http://127.0.0.1:8113/site/mega.html',
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'ignore',
  },
};
