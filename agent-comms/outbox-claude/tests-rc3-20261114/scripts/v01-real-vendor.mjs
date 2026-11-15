// V01 real: show_vendor=true en Sartorial rc3 (cambio documentado en 06-show-vendor-change.md). Sin inyeccion de DOM.
import { chromium, THEMES, newCtx, nav, save, setFont, setGrid2, measureCards } from './common.mjs';
const out = { script: 'v01-real-vendor.mjs', at: new Date().toISOString(), theme: THEMES.sartorial, rows: [] };
const b = await chromium.launch();
try { for (const vw of [320, 390]) { const ctx = await newCtx(b, vw, 700); const page = await ctx.newPage();
  for (const path of ['/collections/fixtures', '/collections/permanent-collection']) for (const scale of [100, 125, 150]) {
    await nav(page, path, THEMES.sartorial); await setFont(page, scale); await setGrid2(page);
    for (let t = 0; t < 3; t++) { const c = await page.evaluate(() => getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns.split(' ').length); if (c === 2) break; await page.evaluate(() => { document.querySelector('[data-grid-view="4"]')?.click(); }); await page.waitForTimeout(700); }
    const m = await page.evaluate(measureCards);
    const withV = m.cards.filter((c) => c.vendor); const lens = withV.map((c) => c.vendor.length);
    out.rows.push({ vw, path, scale, cols: m.cols, n: m.n, cardsWithVendor: withV.length, vendorLenMin: Math.min(...lens, 999), vendorLenMax: Math.max(0, ...lens), maxTitleDelta: m.maxTitleDelta, rowDeltas: m.rowDeltas, docOverflowX: m.docOverflowX, maxActionOverflow: m.maxActionOverflow, vendors: [...new Set(withV.map((c) => c.vendor))].slice(0, 8) });
    console.log(vw, path, scale, 'cols', m.cols, 'vendors', withV.length + '/' + m.n, 'len', Math.min(...lens, 999) + '-' + Math.max(0, ...lens), 'titleDelta', m.maxTitleDelta, 'docX', m.docOverflowX);
  } await ctx.close(); } } finally { await b.close(); save('06-v01-real-vendor.json', out); }
