import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const products = ['nove-blazer', 'silk-charmeuse-blouse'];
const res = {}; const errs = [];
const browser = await launch();
const probe = () => {
  const vis = (e) => { if (!e) return false; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 1 && r.height > 1 && !(cs.clip && cs.clip.startsWith('rect(0')) && cs.clipPath !== 'inset(50%)'; };
  const sec = document.querySelector('main [data-section-id], main');
  const price = document.querySelector('main .price, main [class*="product__price"], main [data-price]');
  const lt = document.querySelector('[data-line-total]');
  const q = document.querySelector('main [data-quantity-input], main input[name="quantity"]');
  const mainImg = document.querySelector('main .product-gallery__image, main .product-media img, main img');
  // text visible near price
  const visText = (root) => { if (!root) return null; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let s = ''; let n; while ((n = w.nextNode())) { if (n.textContent.trim() && vis(n.parentElement)) s += n.textContent.trim() + ' | '; } return s; };
  const sticky = document.querySelector('[class*="sticky"][class*="cart"], sticky-atc, [class*="sticky-add"]');
  return {
    priceHTML: price?.outerHTML.replace(/\s+/g, ' ').slice(0, 900), priceVisibleText: visText(price),
    qty: q?.value,
    lineTotalVisible: vis(lt) && !lt.hasAttribute('data-empty'), lineTotalText: visText(lt), lineTotalHTML: lt?.outerHTML.replace(/\s+/g, ' ').slice(0, 600),
    lineTotalBox: lt && (() => { const r = lt.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; })(),
    mainImg: mainImg?.currentSrc?.split('/').pop().slice(0, 80),
    selectedOpts: [...document.querySelectorAll('main input[type=radio]:checked, main select')].map(e => e.name + '=' + e.value).slice(0, 6),
    stickyText: sticky ? visText(sticky) : null,
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  };
};
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  await unlock(ctx, BASE);
  const page = await ctx.newPage(); attachConsole(page, errs);
  for (const handle of products) {
    const k = `${handle}-${vp}`; res[k] = {};
    await page.goto(`${BASE}/products/${handle}`, { waitUntil: 'load' }); await page.waitForTimeout(2500);
    res[k].productJson = await page.evaluate(async (h) => { const r = await fetch(`/products/${h}.js`); const j = await r.json(); return j.variants.map(v => ({ id: v.id, title: v.title, price: v.price, compare: v.compare_at_price, avail: v.available, img: v.featured_image?.src?.split('/').pop().slice(0, 60) })); }, handle);
    await page.screenshot({ path: `pdp-${handle}-${vp}-full.png`, fullPage: true });
    res[k].before = await page.evaluate(probe);
    // locate quantity area and screenshot
    const qwrap = page.locator('main .product-form__quantity').first();
    await qwrap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `pdp-${handle}-${vp}-qty1.png` });
    const plus = page.locator('main [data-quantity-button="increase"]').first();
    await plus.click(); await page.waitForTimeout(400); await plus.click(); await page.waitForTimeout(900);
    res[k].after3 = await page.evaluate(probe);
    await qwrap.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `pdp-${handle}-${vp}-qty3.png` });
    // variant switch: pick an option value not currently selected
    const switched = await page.evaluate(() => {
      const radios = [...document.querySelectorAll('main input[type=radio]:not(:checked):not(:disabled)')];
      const sel = document.querySelector('main select[name^="options"], main variant-selects select');
      if (radios.length) { const r = radios[radios.length - 1]; const lab = document.querySelector(`label[for="${r.id}"]`); (lab || r).click(); return 'radio ' + r.name + '=' + r.value; }
      if (sel && sel.options.length > 1) { sel.selectedIndex = sel.options.length - 1; sel.dispatchEvent(new Event('change', { bubbles: true })); return 'select ' + sel.value; }
      return null;
    });
    await page.waitForTimeout(2500);
    res[k].switched = switched; res[k].afterSwitch = await page.evaluate(probe); res[k].urlAfterSwitch = page.url().replace(BASE, '');
    await page.screenshot({ path: `pdp-${handle}-${vp}-variant-switched.png` });
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync('results-05-pdp.json', JSON.stringify({ res, errs: errs.filter(e => !/shop\.app|pay\.shopify|403/.test(e.text)) }, null, 2));
console.log(JSON.stringify(res, null, 1).slice(0, 15000));
console.log('ERRS', JSON.stringify(errs.filter(e => !/shop\.app|pay\.shopify|403/.test(e.text))));
