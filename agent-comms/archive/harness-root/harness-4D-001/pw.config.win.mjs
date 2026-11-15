
export default {
  testDir: "C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify/harness-4D-001",
  testMatch: '*.spec.mjs',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8099'
  }
};
