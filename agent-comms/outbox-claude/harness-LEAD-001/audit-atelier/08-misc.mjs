import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const out = {};
const browser = await launch();
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await unlock(ctx, BASE);
  const page = await ctx.newPage();
  await page.goto(BASE + '/collections/all', { waitUntil: 'load' }); await page.waitForTimeout(2000);
  out.gridLabel = await page.evaluate(() => { const e = [...document.querySelectorAll('main *')].find(x => x.childElementCount === 0 && x.textContent.trim() === 'Grid'); if (!e) return null; const cs = getComputedStyle(e); return { tag: e.tagName, cls: e.className, color: cs.color, fs: cs.fontSize, bg: getComputedStyle(document.body).backgroundColor }; });
  out.allProducts = await page.evaluate(async () => { const r = await fetch('/products.json?limit=250'); const j = await r.json(); return j.products.map(p => p.handle + ' [' + p.vendor + ']'); });
  await page.locator('.site-header__menu-button').click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: 'header-mobile-drawer-open-v2.png' });
  const tog = page.locator('.mobile-nav__toggle').first();
  out.mobileToggles = await page.locator('.mobile-nav__toggle').count();
  if (out.mobileToggles) { await tog.click(); await page.waitForTimeout(900); await page.screenshot({ path: 'header-mobile-drawer-catalog-expanded.png' }); }
  out.drawerLinks = await page.evaluate(() => [...document.querySelectorAll('[data-drawer-panel] a, [data-drawer-panel] button')].filter(a => a.offsetParent).map(a => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)));
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(ctx, BASE);
  const page = await ctx.newPage();
  await page.goto(BASE + '/products/does-not-exist', { waitUntil: 'load' }); await page.waitForTimeout(1500);
  out.input404 = await page.evaluate(() => { const i = document.querySelector('main input[type=search], main input[name=q]'); return i && { w: Math.round(i.getBoundingClientRect().width), ph: i.placeholder, scrollW: i.scrollWidth }; });
  await ctx.close();
}
await browser.close();
fs.writeFileSync('results-08-misc.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
