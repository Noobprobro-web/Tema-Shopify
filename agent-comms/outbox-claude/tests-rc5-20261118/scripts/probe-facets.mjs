import { chromium, newCtx, nav, THEMES } from './common.mjs';
const browser = await chromium.launch(); const ctx = await newCtx(browser, 1280, 800); const page = await ctx.newPage();
for (const p of ['/collections/permanent-collection', '/collections/all', '/collections/tailoring', '/collections/knitwear', '/collections/outerwear']) {
  await nav(page, p, THEMES.sartorial, 500);
  console.log(p, JSON.stringify(await page.evaluate(() => ({ products: document.querySelectorAll('.product-card').length, facets: [...document.querySelectorAll('details.facet')].map((f) => f.querySelector('summary').textContent.trim() + ':' + f.querySelectorAll('input[type=checkbox]').length), vendors: [...new Set([...document.querySelectorAll('.product-card__vendor')].map((v) => v.textContent.trim()))].slice(0, 5), sort: !!document.querySelector('[data-facet-sort]') }))));
}
await nav(page, '/collections/vendors', THEMES.sartorial, 300).catch((e) => console.log(String(e).slice(0, 100)));
await browser.close();
