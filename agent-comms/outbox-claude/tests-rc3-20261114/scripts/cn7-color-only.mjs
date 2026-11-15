// CN7: swatches visibles en fixture-color-only (solo opcion Color, 8 valores) -> rama data-swatch-fit-px.
import { chromium, THEMES, newCtx, nav, save, setFont, setGrid2, measureCards, presets } from './common.mjs';
const out = { script: 'cn7-color-only.mjs', at: new Date().toISOString(), rows: [] };
const b = await chromium.launch();
try { for (const preset of presets) for (const vw of [320, 390]) { const ctx = await newCtx(b, vw, 700); const page = await ctx.newPage();
  for (const scale of [100, 125, 150]) {
    await nav(page, '/collections/fixtures', THEMES[preset]); await setFont(page, scale); await setGrid2(page);
    for (let t = 0; t < 3; t++) { const c = await page.evaluate(() => getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns.split(' ').length); if (c === 2) break; await page.evaluate(() => { document.querySelector('[data-grid-view="4"]')?.click(); }); await page.waitForTimeout(700); }
    const m = await page.evaluate(measureCards);
    const c = m.cards.find((x) => /Fixture color only/i.test(x.title));
    const sw = await page.evaluate(() => { const card = [...document.querySelectorAll('.product-card')].find((e) => /Fixture color only/i.test(e.textContent)); const g = card?.querySelector('.product-card__swatch-group'); return g ? { attrs: [...g.attributes].map((a) => a.name + '=' + a.value).join(' ').slice(0, 160), groupW: Math.round(g.getBoundingClientRect().width), cardW: Math.round(card.getBoundingClientRect().width), more: g.querySelector('.product-card__swatch-more, [class*=more]')?.textContent.trim() ?? null } : null; });
    out.rows.push({ preset, vw, scale, cols: m.cols, found: !!c, card: c, swatchGroup: sw, docOverflowX: m.docOverflowX });
    console.log(preset, vw, scale, 'cols', m.cols, 'found', !!c, c ? `${c.swVisible}/${c.swTotal} ${c.swAttr} groupOverflow=${c.groupOverflow}` : '', JSON.stringify(sw?.more));
  } await ctx.close(); } } finally { await b.close(); save('07-cn7-color-only.json', out); }
