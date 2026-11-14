// C-08: bloques de entrega (shipping_lead_time) y devoluciones (trust_badges) en la PDP. Plantillas alternas temporales product.c08short/long.
import fs from 'fs';
import { chromium, THEMES, newCtx, nav, save, setFont, presets } from './common.mjs';
const axeSrc = fs.readFileSync('/home/user/Tema-Shopify/tests/vendor/axe.min.js', 'utf8');
const out = { script: 'c08-trust-blocks.mjs', at: new Date().toISOString(), rows: [] };
const b = await chromium.launch();
try { for (const preset of presets) { const ctx = await newCtx(b, 390, 844, { reducedMotion: 'reduce' }); const page = await ctx.newPage();
  for (const [variant, q] of [['as_shipped_empty', ''], ['short', '?view=c08short'], ['long', '?view=c08long']]) for (const [vw, vh, scale] of [[390, 844, 100], [1280, 800, 100], [320, 640, 150]]) {
    await page.setViewportSize({ width: vw, height: vh });
    await nav(page, '/products/serra-coat' + q, THEMES[preset], 900); if (scale !== 100) await setFont(page, scale);
    const m = await page.evaluate(() => { const ts = [...document.querySelectorAll('.product-trust')]; const de = document.documentElement; return { template: document.querySelector('main section.product-main') ? 'main-product' : '?', count: ts.length, blocks: ts.map((t) => { const r = t.getBoundingClientRect(); const p = t.parentElement.getBoundingClientRect(); const icon = t.querySelector('.product-trust__icon svg'); return { text: t.textContent.trim().slice(0, 60), len: t.textContent.trim().length, w: Math.round(r.width), h: Math.round(r.height), overflowRight: Math.round(r.right - p.right), iconAriaHidden: t.querySelector('.product-trust__icon')?.getAttribute('aria-hidden'), hasIcon: !!icon, fs: getComputedStyle(t).fontSize, color: getComputedStyle(t).color }; }), docOverflowX: de.scrollWidth - de.clientWidth }; });
    let ax = null;
    if (scale === 100) { await page.evaluate((s) => { (0, eval)(s); }, axeSrc); ax = await page.evaluate(async () => { const r = await window.axe.run(document, { resultTypes: ['violations', 'incomplete'] }); const f = (l) => l.map((x) => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, onTrust: x.nodes.filter((n) => /product-trust/.test(n.html)).length })); return { v: window.axe.version, violations: f(r.violations), incompleteOnTrust: r.incomplete.filter((x) => x.nodes.some((n) => /product-trust/.test(n.html))).map((x) => x.id) }; }); }
    out.rows.push({ preset, variant, vw, scale, ...m, axe: ax });
    console.log(preset, variant, vw, scale, 'trust blocks', m.count, 'overflowRight', Math.max(0, ...m.blocks.map((x) => x.overflowRight)), 'docX', m.docOverflowX, ax ? 'axeViol=' + JSON.stringify(ax.violations.map((v) => v.id + ':' + v.onTrust)) : '');
  } await ctx.close(); } } finally { await b.close(); save('12-c08-trust-blocks.json', out); }
