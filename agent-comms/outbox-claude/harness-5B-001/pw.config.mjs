import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = process.env.HARNESS_DIR || path.dirname(fileURLToPath(import.meta.url));

export default {
  testDir: DIR,
  testMatch: 'zoom5b.spec.mjs',
  outputDir: process.env.PW_OUTPUT || path.join(os.tmpdir(), 'pw-5b-results'),
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 5000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8112',
    ...(process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {}),
  },
  webServer: {
    command: `python3 -m http.server 8112 --bind 127.0.0.1 --directory "${DIR}"`,
    url: 'http://127.0.0.1:8112/site/pdp-zoom.html',
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'ignore',
  },
};
