import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await unlock(ctx, BASE);
const page = await ctx.newPage();
const out = {};
for (const p of ['/', '/collections/all']) {
  await page.goto(BASE + p, { waitUntil: 'load' }); await page.waitForTimeout(2000);
  out[p] = await page.evaluate(() => document.querySelector('.site-header__desktop-nav')?.outerHTML.replace(/\s+/g, ' ').slice(0, 4000));
}
// interact with Catalog on current page
const trig = page.locator('.site-header__desktop-nav li:has-text("Catalog") >> summary, .site-header__desktop-nav li:has-text("Catalog") >> button').first();
const n = await trig.count();
out.trigCount = n;
const cat = page.locator('.site-header__desktop-nav').getByText('Catalog', { exact: false }).first();
await cat.hover(); await page.waitForTimeout(900);
await page.screenshot({ path: 'header-desktop-catalog-hover-v2.png', clip: { x: 0, y: 0, width: 1440, height: 700 } });
out.hoverState = await page.evaluate(() => ({ open: [...document.querySelectorAll('.site-header__desktop-nav details, .site-header__desktop-nav [aria-expanded]')].map(e => e.tagName + ':' + (e.open ?? e.getAttribute('aria-expanded'))) }));
if (n) { await trig.click(); await page.waitForTimeout(900); }
else { await cat.click(); await page.waitForTimeout(1500); }
out.afterClickUrl = page.url();
out.clickState = await page.evaluate(() => ({ open: [...document.querySelectorAll('.site-header__desktop-nav details, .site-header__desktop-nav [aria-expanded]')].map(e => e.tagName + ':' + (e.open ?? e.getAttribute('aria-expanded'))) }));
await page.screenshot({ path: 'header-desktop-catalog-click-v2.png', clip: { x: 0, y: 0, width: 1440, height: 700 } });
await browser.close();
fs.writeFileSync('results-04-header-recheck.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
