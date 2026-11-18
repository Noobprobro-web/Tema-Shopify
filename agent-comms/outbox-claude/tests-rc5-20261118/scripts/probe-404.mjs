import { chromium, newCtx, nav, axe, THEMES } from './common.mjs';
const b = await chromium.launch();
for (const k of ['pkg', 'sartorial']) { const ctx = await newCtx(b, 1280, 800); const page = await ctx.newPage(); let id = null; try { await nav(page, '/404x', THEMES[k], 800); } catch (e) { id = String(e).slice(0, 120); }
  const a = await axe(page); console.log(k, id, JSON.stringify(a.violations.map((v) => [v.id, v.targets]))); await ctx.close(); }
await b.close();
