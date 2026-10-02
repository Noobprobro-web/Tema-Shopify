import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.edition.url;
const out = {};
const browser = await launch();
const go = async (page, p) => { const r = await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(2000); return r && r.status(); };
const state = (page) => page.evaluate(() => {
  const info = document.querySelector('.product__info, [class*="product__info"], .product-info') || document.querySelector('main');
  const lt = document.querySelector('[data-line-total]');
  const price = document.querySelector('main .price');
  const atc = document.querySelector('main [name="add"], main button[type="submit"]');
  const img = document.querySelector('main .product-media img, main [class*="product-media"] img, main [class*="gallery"] img');
  const q = document.querySelector('main [data-quantity-input]');
  const ltBox = lt?.getBoundingClientRect();
  const vh = lt ? [...lt.querySelectorAll('.visually-hidden')].map(e => ({ t: e.textContent, w: e.getBoundingClientRect().width, clip: getComputedStyle(e).clip, pos: getComputedStyle(e).position })) : [];
  return {
    url: location.pathname + location.search,
    priceText: price?.innerText.replace(/\s+/g, ' '), priceVisible: price ? [...price.querySelectorAll('*')].filter(e => e.children.length === 0 && e.getBoundingClientRect().width > 2 && getComputedStyle(e).clip === 'auto').map(e => e.textContent.trim()).filter(Boolean) : null,
    qty: q?.value, lineTotalEmpty: lt?.hasAttribute('data-empty'), lineTotalText: lt?.innerText.replace(/\s+/g, ' '), lineTotalTextContent: lt?.textContent.replace(/\s+/g, ' ').trim(), lineTotalBox: ltBox && [Math.round(ltBox.left), Math.round(ltBox.top), Math.round(ltBox.width), Math.round(ltBox.height)], lineTotalDisplay: lt && getComputedStyle(lt).display, vh,
    atcText: atc?.innerText.replace(/\s+/g, ' '), img: img?.currentSrc?.split('/').pop().split('?')[0],
    checked: [...document.querySelectorAll('main input[type="radio"]:checked')].map(i => i.value),
    sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
  };
});
async function clipInfo(page, name) {
  const el = page.locator('[data-line-total]').first();
  await el.evaluate(e => e.closest('.product-form, [class*="product__info"], section')?.scrollIntoView ? window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 350) : null);
  await page.waitForTimeout(600);
  await page.screenshot({ path: name });
}
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport: size });
  await unlock(context, BASE);
  const page = await context.newPage();
  for (const h of ['structured-tote', 'milled-brass-paperweight']) {
    const k = h + '-' + vp; out[k] = {};
    out[k].status = await go(page, '/products/' + h);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `pdp-${h}-${vp}.png`, fullPage: true });
    out[k].before = await state(page);
    await clipInfo(page, `pdp-${h}-${vp}-qty1.png`);
    const plus = page.locator('main [data-quantity-button="increase"]').first();
    await plus.click(); await page.waitForTimeout(400); await plus.click(); await page.waitForTimeout(900);
    out[k].after3 = await state(page);
    await clipInfo(page, `pdp-${h}-${vp}-qty3.png`);
    if (h === 'structured-tote') {
      const tan = page.locator('main label:has-text("Saddle tan")').first();
      if (await tan.count()) { await tan.click(); await page.waitForTimeout(1500); out[k].afterTan = await state(page); }
      const compact = page.locator('main label:has-text("Compact")').first();
      if (await compact.count()) { await compact.click(); await page.waitForTimeout(1500); out[k].afterCompact = await state(page); await clipInfo(page, `pdp-${h}-${vp}-tan-compact-qty3.png`); }
      // add to cart
      const atc = page.locator('main [name="add"]').first();
      await atc.click(); await page.waitForTimeout(3000);
      await page.screenshot({ path: `cart-drawer-${vp}.png` });
      out[k].drawer = await page.evaluate(() => { const d = document.querySelector('#cart-drawer, .cart-drawer'); const p = d?.querySelector('[class*="panel"], .drawer-panel') || d; return { open: d?.hasAttribute('open') || d?.classList.toString(), text: p?.innerText.replace(/\s+/g, ' ').slice(0, 600) }; });
      const dplus = page.locator('#cart-drawer [data-quantity-button="increase"], .cart-drawer button[name="plus"], .cart-drawer [aria-label*="ncrease"]').first();
      out[k].drawerPlus = await dplus.count();
      if (out[k].drawerPlus) { await dplus.click(); await page.waitForTimeout(3000); await page.screenshot({ path: `cart-drawer-${vp}-qty-changed.png` }); out[k].drawerAfter = await page.evaluate(() => document.querySelector('#cart-drawer, .cart-drawer')?.innerText.replace(/\s+/g, ' ').slice(0, 600)); }
      await go(page, '/cart');
      await page.screenshot({ path: `cart-page-${vp}.png`, fullPage: true });
      out[k].cartPage = await page.evaluate(() => ({ text: document.querySelector('main')?.innerText.replace(/\s+/g, ' ').slice(0, 700), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      out[k].cartJs = await page.evaluate(async () => { const c = await (await fetch('/cart.js')).json(); return { count: c.item_count, total: c.total_price, items: c.items.map(i => i.title + ' x' + i.quantity + ' =' + i.final_line_price) }; });
      await page.evaluate(async () => { await fetch('/cart/clear.js', { method: 'POST' }); });
      out[k].cleared = await page.evaluate(async () => (await (await fetch('/cart.js')).json()).item_count);
    }
  }
  await context.close();
}
await browser.close();
fs.writeFileSync('results-04.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
