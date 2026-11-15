import { chromium, THEMES, newCtx, nav, save } from './common.mjs';
const out = { script: 'probe-3d-diagnose.mjs', runs: [] };
const b = await chromium.launch();
try { for (const [preset, vw] of [['sartorial', 390], ['sartorial', 1280], ['archive', 1280]]) {
  const ctx = await newCtx(b, vw, 800); const page = await ctx.newPage();
  await nav(page, '/products/fixture-media-3d-video', THEMES[preset], 2000);
  const chain = await page.evaluate(() => { const m = document.querySelector('model-viewer'); const a = []; for (let n = m; n && n !== document.body; n = n.parentElement) { const cs = getComputedStyle(n), r = n.getBoundingClientRect(); a.push({ el: n.tagName.toLowerCase() + '.' + String(n.className).split(' ').slice(0, 3).join('.'), w: Math.round(r.width), h: Math.round(r.height), display: cs.display, position: cs.position, width: cs.width, flex: cs.flex, overflow: cs.overflow, gridCols: cs.gridTemplateColumns.slice(0, 40), attrs: [...n.attributes].map((x) => x.name).filter((x) => /inert|hidden|data-/.test(x)).join(',').slice(0, 80) }); } return a; });
  const rules = await page.evaluate(() => { const hits = []; for (const ss of document.styleSheets) { let rs; try { rs = ss.cssRules; } catch { continue; } for (const r of rs) { if (r.selectorText && /model-viewer/.test(r.selectorText)) hits.push({ sel: r.selectorText.slice(0, 120), css: r.style.cssText.slice(0, 200), href: (ss.href || 'inline').split('/').pop().split('?')[0] }); } } return hits; });
  out.runs.push({ preset, vw, chain, rules }); await ctx.close(); } } finally { await b.close(); save('03b-3d-diagnose.json', out); }
