import { chromium, THEMES, newCtx, nav, save } from './common.mjs';
const out = { script: 'probe-3d-proposed-fix.mjs (CSS inyectado en runtime, no edita el tema)', runs: [] };
const b = await chromium.launch();
try { for (const [preset, vw] of [['sartorial', 390], ['sartorial', 1280]]) {
  const ctx = await newCtx(b, vw, 800); const page = await ctx.newPage();
  await nav(page, '/products/fixture-media-3d-video', THEMES[preset], 1500);
  await page.addStyleTag({ content: '.product-gallery__item .shopify-model-viewer-ui,.featured-product__media .shopify-model-viewer-ui{display:block;width:100%}' });
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => { const e = document.querySelector('model-viewer'); const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), inert: e.inert }; });
  const hits = []; for (let i = 0; i < 45; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(80); const r = await page.evaluate(() => { const e = document.activeElement; if (e?.tagName.toLowerCase() !== 'model-viewer') return null; const rc = e.getBoundingClientRect(); return { w: Math.round(rc.width), h: Math.round(rc.height), inert: e.inert }; }); if (r) hits.push({ step: i + 1, ...r }); }
  out.runs.push({ preset, vw, model: m, focusOnModel: hits }); await ctx.close(); } } finally { await b.close(); save('03c-3d-proposed-fix.json', out); }
