// A-03: nodos color-contrast en `incomplete` de axe + ratio medido a mano (color computado vs fondo muestreado por captura sin texto).
import fs from 'fs';
import { OUTDIR, chromium, THEMES, newCtx, nav, save, presets } from './common.mjs';
const axeSrc = fs.readFileSync('/home/user/Tema-Shopify/tests/vendor/axe.min.js', 'utf8');
const PAGES = { home: '/', collection: '/collections/permanent-collection', product: '/products/serra-coat' };
const out = { script: 'contrast-incomplete.mjs', at: new Date().toISOString(), method: 'rect interior inset 3px (evita bordes), barra de preview oculta; ratio WCAG sobre pixeles muestreados; p05 = peor 5% de pixeles, med = mediana', nodes: [], pages: [] };
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const b = await chromium.launch();
try {
  for (const preset of presets) for (const vw of [390, 1280]) {
    const ctx = await newCtx(b, vw, vw === 390 ? 844 : 800, { reducedMotion: 'reduce', serviceWorkers: 'block' }); const page = await ctx.newPage();
    for (const [pn, pp] of Object.entries(PAGES)) {
      try {
        await nav(page, pp, THEMES[preset], 1200);
        await page.addScriptTag({ content: `(()=>{const module={exports:{}};const define=undefined;${axeSrc}\n})()` }).catch(() => {});
        const hasAxe = await page.evaluate(() => typeof window.axe !== 'undefined');
        if (!hasAxe) { await page.evaluate((s) => { (0, eval)(s); }, axeSrc); }
        const res = await page.evaluate(async () => { const r = await window.axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] }, resultTypes: ['incomplete', 'violations'] });
          const f = (list) => list.flatMap((rule) => rule.nodes.map((n) => ({ target: n.target, html: n.html.slice(0, 140), messageKey: n.any[0]?.data?.messageKey ?? null, data: n.any[0] ? { fgColor: n.any[0].data?.fgColor, bgColor: n.any[0].data?.bgColor, contrastRatio: n.any[0].data?.contrastRatio, fontSize: n.any[0].data?.fontSize, fontWeight: n.any[0].data?.fontWeight, expectedContrastRatio: n.any[0].data?.expectedContrastRatio } : null, message: n.any[0]?.message?.slice(0, 160) })));
          return { incomplete: f(r.incomplete), violations: f(r.violations), v: window.axe.version }; });
        out.pages.push({ preset, vw, page: pn, axe: res.v, incomplete: res.incomplete.length, violations: res.violations.length });
        // sin animaciones para medir
        await page.addStyleTag({ content: '*{transition:none!important;animation:none!important}#preview-bar-iframe,[id*=preview-bar]{display:none!important}[data-cc-probe],[data-cc-probe] *{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}' });
        for (const n of res.incomplete) {
          const row = { preset, vw, page: pn, ...n };
          try {
            const sel = Array.isArray(n.target[0]) ? n.target[0][0] : n.target[0];
            const el = page.locator(sel).first();
            if (!(await el.count())) { row.error = 'selector sin nodo'; out.nodes.push(row); continue; }
            await el.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {}); await page.evaluate(async () => { await Promise.all([...document.images].map((i) => i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); }))); }); await page.waitForTimeout(700);
            const info = await el.evaluate((e) => { const cs = getComputedStyle(e); let op = 1; for (let x = e; x; x = x.parentElement) op *= parseFloat(getComputedStyle(x).opacity); const r = e.getBoundingClientRect();
              let col = cs.color.match(/[\d.]+/g).map(Number); if (cs.color.startsWith('color(srgb')) col = col.map((v, i) => (i < 3 ? Math.round(v * 255) : v)); return { color: col, op, fs: parseFloat(cs.fontSize), fw: cs.fontWeight, text: (e.textContent || '').trim().slice(0, 50), rect: { x: r.x, y: r.y, w: r.width, h: r.height }, vis: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden', filter: cs.filter }; });
            row.text = info.text; row.fontPx = info.fs; row.fontWeight = info.fw; row.opacityChain = info.op;
            const large = info.fs >= 24 || (info.fs >= 18.66 && Number(info.fw) >= 700); row.large = large; row.threshold = large ? 3 : 4.5;
            if (!info.vis || info.rect.w < 1 || info.rect.h < 1) { row.error = 'sin caja visible'; out.nodes.push(row); continue; }
            const ins = (info.rect.w > 12 && info.rect.h > 12) ? 3 : 0; const clip = { x: Math.max(0, info.rect.x) + ins, y: Math.max(0, info.rect.y) + ins, width: Math.min(info.rect.w, vw - Math.max(0, info.rect.x)) - 2 * ins, height: Math.min(info.rect.h, 400) - 2 * ins };
            if (clip.width < 1 || clip.height < 1) { row.error = 'fuera de viewport'; out.nodes.push(row); continue; }
            await el.evaluate((e) => e.setAttribute('data-cc-probe', '1'));
            const buf = await page.screenshot({ clip }); await el.evaluate((e) => e.removeAttribute('data-cc-probe'));
            const px = await page.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; const o = []; const step = Math.max(1, Math.floor(d.length / 4 / 600)); for (let i = 0; i < d.length / 4; i += step) o.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]); return o; }, buf.toString('base64'));
            const a = (info.color[3] ?? 1) * info.op; const rs = px.map((bg) => { const fg = [0, 1, 2].map((k) => info.color[k] * a + bg[k] * (1 - a)); return ratio(fg, bg); }).sort((x, y) => x - y);
            row.samples = rs.length; row.ratioMin = +rs[0].toFixed(2); row.ratioP05 = +rs[Math.floor(rs.length * 0.05)].toFixed(2); row.ratioMed = +rs[Math.floor(rs.length / 2)].toFixed(2);
            if (rs[Math.floor(rs.length * 0.05)] < row.threshold) { const f = `contrast-evidence/${preset}-${vw}-${pn}-${out.nodes.length}.png`; fs.mkdirSync(OUTDIR + '/contrast-evidence', { recursive: true }); fs.writeFileSync(OUTDIR + '/' + f, await page.screenshot({ clip: { x: Math.max(0, clip.x - 15), y: Math.max(0, clip.y - 15), width: Math.min(clip.width + 30, vw), height: clip.height + 30 } })); row.evidence = f; }
            row.fg = info.color.slice(0, 3).join(','); row.fgAlpha = +a.toFixed(2); row.below = row.ratioP05 < row.threshold;
          } catch (e) { row.error = String(e.message).slice(0, 120); }
          out.nodes.push(row);
        }
        console.log(preset, vw, pn, 'incomplete', res.incomplete.length, 'violations', res.violations.length);
      } catch (e) { console.log('ERR', preset, vw, pn, String(e.message).slice(0, 100)); out.pages.push({ preset, vw, page: pn, error: String(e.message).slice(0, 150) }); }
    }
    await ctx.close();
  }
} finally { await b.close(); save('05-contrast-incomplete.json', out); }
