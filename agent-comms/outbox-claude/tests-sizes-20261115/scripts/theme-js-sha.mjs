// SHA-256 de assets/theme.js servido por cada rc3 (lectura GET) frente al del repo en 1c111bc.
import { chromium, THEMES, newCtx, nav, save, presets } from './common.mjs';
const out = { script: 'theme-js-sha.mjs', expected: '1665b7e53266bb7e3a1ed56f0a86b9d71bfb5748834d76d933d12ab9b032689e', rows: [] };
const b = await chromium.launch();
try { for (const p of presets) { const ctx = await newCtx(b, 390, 844); const page = await ctx.newPage(); await nav(page, '/', THEMES[p], 300);
  const r = await page.evaluate(async () => { const s = [...document.scripts].map((x) => x.src).find((u) => /assets\/theme\.js/.test(u)); const t = await (await fetch(s)).arrayBuffer(); const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', t))].map((x) => x.toString(16).padStart(2, '0')).join(''); return { src: s.replace(/\?.*/, ''), bytes: t.byteLength, sha256: h }; });
  out.rows.push({ preset: p, ...r, match: r.sha256 === out.expected }); console.log(p, r.bytes, r.sha256, r.sha256 === out.expected); await ctx.close(); } } finally { await b.close(); save('05-theme-js-sha256.json', out); }
