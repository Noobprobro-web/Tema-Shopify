import { chromium, newCtx, nav, THEMES, axe } from './common.mjs';
const b = await chromium.launch(); const ctx = await newCtx(b, 1280, 800); const page = await ctx.newPage();
await nav(page, '/collections/permanent-collection', THEMES.sartorial, 1000);
const r = await axe(page); console.log(JSON.stringify(r.violations));
console.log(await page.evaluate(() => { const h = [...document.querySelectorAll('h2')].find((x) => /Filter/.test(x.textContent)); const cs = h && getComputedStyle(h); const p = h?.closest('details,div[hidden],aside,form'); return { disp: cs?.display, vis: cs?.visibility, rect: h && JSON.stringify(h.getBoundingClientRect()), anc: p ? p.tagName + '.' + p.className + ' open=' + p.open + ' hidden=' + p.hidden : null }; }));
await b.close();
