import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const res = {}; const errs = [];
const browser = await launch();
const cartState = async (page) => page.evaluate(async () => { for (let a = 0; a < 6; a++) { const resp = await fetch('/cart.js', { headers: { Accept: 'application/json' } }); const t = await resp.text(); try { const c = JSON.parse(t); return { count: c.item_count, total: c.total_price, items: c.items.map(i => i.handle + ' x' + i.quantity + ' ' + i.final_line_price) }; } catch (e) { await new Promise(r => setTimeout(r, 15000)); if (a === 5) return { error: resp.status + ' ' + t.slice(0, 120) }; } } });
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  await unlock(ctx, BASE);
  const page = await ctx.newPage(); attachConsole(page, errs);
  const r = {}; res[vp] = r;
  await page.goto(`${BASE}/products/nove-blazer`, { waitUntil: 'load' }); await page.waitForTimeout(2500);
  await page.evaluate(async () => { const r = await fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } }); return r.status; }).then(s => console.log('clear', s));
  r.start = await cartState(page);
  await page.locator('main form[data-cart-add-form] button[type=submit], main button[name=add]').first().click();
  await page.waitForTimeout(3000);
  r.drawerOpen = await page.evaluate(() => { const o = document.querySelector('[data-cart-drawer-overlay]'); return o && !o.hidden; });
  await page.screenshot({ path: `cart-drawer-${vp}-added.png` });
  r.afterAdd = await cartState(page);
  r.drawerText = await page.evaluate(() => document.querySelector('[data-cart-drawer-panel]')?.innerText.replace(/\s+/g, ' ').slice(0, 800));
  const plus = page.locator('[data-cart-drawer-panel] [data-quantity-button="increase"]').first();
  if (await plus.count()) { await plus.click(); await page.waitForTimeout(3500); }
  r.afterPlus = await cartState(page);
  r.drawerTextAfterPlus = await page.evaluate(() => document.querySelector('[data-cart-drawer-panel]')?.innerText.replace(/\s+/g, ' ').slice(0, 800));
  await page.screenshot({ path: `cart-drawer-${vp}-qty2.png` });
  r.drawerScrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  await page.goto(`${BASE}/cart`, { waitUntil: 'load' }); await page.waitForTimeout(2500);
  await page.screenshot({ path: `cart-page-${vp}.png`, fullPage: true });
  r.cartPage = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, text: document.querySelector('main')?.innerText.replace(/\s+/g, ' ').slice(0, 900) }));
  await page.evaluate(async () => { const r = await fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } }); return r.status; }).then(s => console.log('clear', s));
  r.end = await cartState(page);
  await ctx.close();
}
await browser.close();
fs.writeFileSync('results-06-cart.json', JSON.stringify({ res, errs: errs.filter(e => !/shop\.app|pay\.shopify|403/.test(e.text)) }, null, 2));
console.log(JSON.stringify(res, null, 1));
console.log('ERRS', JSON.stringify(errs.filter(e => !/shop\.app|pay\.shopify|403/.test(e.text))));
