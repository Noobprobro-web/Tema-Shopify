import { chromium, THEMES, newCtx, nav, save, setFont, setGrid2, measureCards, presets } from './common.mjs';
const out = { script: 'probe-choose-options-320.mjs', at: new Date().toISOString(), rows: [] };
const b = await chromium.launch();
try { for (const preset of presets) { const ctx = await newCtx(b, 320, 640); const page = await ctx.newPage();
  for (const path of ['/collections/fixtures', '/collections/permanent-collection']) for (const scale of [100, 150]) {
    await nav(page, path, THEMES[preset]); await setFont(page, scale); await setGrid2(page);
    const m = await page.evaluate(measureCards);
    out.rows.push({ preset, path, scale, ...m, cards: m.cards.slice(0, 8) });
    console.log(preset, path, scale, 'cols', m.cols, 'n', m.n, 'actionOverflow', m.maxActionOverflow, 'titleDelta', m.maxTitleDelta, 'docX', m.docOverflowX);
  } await ctx.close(); } } finally { await b.close(); save('04-choose-options-320.json', out); }
