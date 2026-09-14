export default {
  testDir: '/tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/harness',
  testMatch: '**/verify.spec.mjs',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8099',
    launchOptions: { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' },
  },
  webServer: {
    command: 'python3 -m http.server 8099 --bind 127.0.0.1 --directory /tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/harness',
    url: 'http://127.0.0.1:8099/fixture.html',
    reuseExistingServer: true,
  },
};
