import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;
if (!STORE_PASSWORD) {
  console.error('[SECURITY FATAL] STOREFRONT_PASSWORD environment variable is required.');
  process.exit(1);
}
const STATE_DIR = path.join(os.tmpdir(), 'sartorial-audit-final-002');
fs.mkdirSync(STATE_DIR, { recursive: true });

async function unlockAndMeasure(storeUrl, reduced) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference'
  });

  const stateFile = path.join(STATE_DIR, new URL(storeUrl).host + '.cookies.json');
  if (fs.existsSync(stateFile)) {
    try { await context.addCookies(JSON.parse(fs.readFileSync(stateFile, 'utf8'))); } catch (e) {}
  }

  const page = await context.newPage();

  // Unlock if needed
  await page.goto(`${storeUrl}/cart`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  if (page.url().includes('/password')) {
    const input = page.locator('input[type="password"]');
    if ((await input.count()) > 0) {
      await input.first().fill(STORE_PASSWORD);
      await Promise.all([page.waitForLoadState('domcontentloaded'), input.first().press('Enter')]);
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    }
    fs.writeFileSync(stateFile, JSON.stringify(await context.cookies(storeUrl)));
  }

  // Now measure CLS on homepage
  await page.addInitScript(() => {
    window.__shifts = [];
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cls += entry.value;
          const sources = (entry.sources || []).map(s => {
            const node = s.node;
            return {
              tag: node ? node.tagName : null,
              className: node ? (node.className || '').toString() : null,
              outerHTML: node ? node.outerHTML.slice(0, 160) : null,
              previousRect: s.previousRect ? { x: Math.round(s.previousRect.x), y: Math.round(s.previousRect.y), width: Math.round(s.previousRect.width), height: Math.round(s.previousRect.height) } : null,
              currentRect: s.currentRect ? { x: Math.round(s.currentRect.x), y: Math.round(s.currentRect.y), width: Math.round(s.currentRect.width), height: Math.round(s.currentRect.height) } : null
            };
          });
          window.__shifts.push({
            value: entry.value,
            startTime: Math.round(entry.startTime),
            sources
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(`${storeUrl}/`, { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Recorrido de scroll idéntico a 13-motion-check.mjs
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(2600);

  const res = await page.evaluate(() => ({
    cls: Number(window.__cls.toFixed(4)),
    shifts: window.__shifts
  }));

  await browser.close();
  return res;
}

async function run() {
  console.log('--- Testing Live Edition (reduced: false) ---');
  const edNormal = await unlockAndMeasure('https://sartorial-edition.myshopify.com', false);
  console.log('Edition Normal CLS:', edNormal.cls);

  console.log('--- Testing Live Edition (reduced: true) ---');
  const edReduced = await unlockAndMeasure('https://sartorial-edition.myshopify.com', true);
  console.log('Edition Reduced CLS:', edReduced.cls);
  console.log('Edition Reduced shifts:', JSON.stringify(edReduced.shifts, null, 2));

  console.log('\n--- Testing Live Atelier (reduced: false) ---');
  const atNormal = await unlockAndMeasure('https://sartorial-atelier.myshopify.com', false);
  console.log('Atelier Normal CLS:', atNormal.cls);

  console.log('--- Testing Live Atelier (reduced: true) ---');
  const atReduced = await unlockAndMeasure('https://sartorial-atelier.myshopify.com', true);
  console.log('Atelier Reduced CLS:', atReduced.cls);
  console.log('Atelier Reduced shifts:', JSON.stringify(atReduced.shifts, null, 2));
}

run().catch(console.error);
