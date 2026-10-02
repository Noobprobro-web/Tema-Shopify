// LEAD-001 · B-01: envío real de prueba del formulario de soporte publicado (un único envío).
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/04-support-form-e2e.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const URL_SUPPORT = 'https://noobprobro-web.github.io/sartorial-docs/support.html';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const posts = [];
page.on('response', (r) => {
  if (r.url().includes('formspree.io')) posts.push({ url: r.url(), status: r.status(), method: r.request().method() });
});
const nav = await page.goto(URL_SUPPORT, { waitUntil: 'load' });
await page.fill('#name', 'LEAD-001 QA (test)');
await page.fill('#email', 'qa-test@example.com');
await page.fill('#store_url', 'sartorial-atelier.myshopify.com');
await page.selectOption('#category', 'other');
await page.fill('#message', 'Automated end-to-end test of the Sartorial support form (CLAUDE-REPORT-LEAD-001). No action needed.');
await page.click('button[type="submit"]');
const status = page.locator('[data-form-status]');
await page.waitForFunction(() => {
  const el = document.querySelector('[data-form-status]');
  return el && ['success', 'error'].includes(el.dataset.state);
}, null, { timeout: 30000 });
const result = {
  page: nav?.status(),
  state: await status.getAttribute('data-state'),
  role: await status.getAttribute('role'),
  message: (await status.textContent())?.trim(),
  formCleared: (await page.inputValue('#name')) === '',
  posts,
};
console.log(JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(here, 'results-04-support-form-e2e.json'), JSON.stringify(result, null, 2));
await browser.close();
