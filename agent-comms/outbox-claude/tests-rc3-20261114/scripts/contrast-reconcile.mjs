// A-03 v2: reconcilia el conteo de `color-contrast` incomplete del arnes (01) con el script 05 y mide TODOS los nodos.
// Condicion A = como el arnes: domcontentloaded, misma pagina reutilizada 390 -> 1280, keyboardSmoke (32 Tab + Shift+Tab), axe de inmediato.
// Condicion B = como 05: networkidle + 1200 ms, sin teclado.
// Mejoras sobre 05: (1) nodos marcados con data-cc-n en la misma instancia que axe (se miden exactamente los nodos del arnes);
// (2) pseudo-elementos ::before/::after con content se miden como elemento aparte y se ocultan al muestrear el fondo;
// (3) scrollIntoView centrado + se ocultan elementos fixed/sticky ajenos al nodo (cabecera fija) antes de la captura.
import fs from 'fs';
import { OUTDIR, chromium, THEMES, newCtx, nav, save, presets, sleep } from './common.mjs';
const axeSrc = fs.readFileSync('/home/user/Tema-Shopify/tests/vendor/axe.min.js', 'utf8');
const PAGES = { home: '/', collection: '/collections/permanent-collection', product: '/products/serra-coat' };
const VPS = [{ width: 390, height: 844 }, { width: 1280, height: 800 }];
const out = { script: 'contrast-reconcile.mjs', at: new Date().toISOString(), pages: [], nodes: [] };
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

async function injectAxe(page) {
  await page.addScriptTag({ content: `(()=>{const module={exports:{}};const define=undefined;const prev=Object.getOwnPropertyDescriptor(window,'axe');${axeSrc}\n;window.__ccAxe=module.exports;if(prev)Object.defineProperty(window,'axe',prev);else delete window.axe;})();` });
}
async function keyboardSmoke(page) {
  await page.keyboard.press('Escape');
  await page.evaluate(() => { const p = document.body.getAttribute('tabindex'); document.body.setAttribute('tabindex', '-1'); document.body.focus(); if (p === null) document.body.removeAttribute('tabindex'); else document.body.setAttribute('tabindex', p); });
  for (let i = 0; i < 32; i++) await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
}
async function collect(page) {
  return page.evaluate(async () => {
    const r = await window.__ccAxe.run(document, { elementRef: true, runOnly: { type: 'rule', values: ['color-contrast'] } });
    const rows = []; let i = 0;
    for (const rule of r.incomplete) for (const n of rule.nodes) {
      const el = n.element; const inMain = el && el.ownerDocument === document;
      if (inMain) el.setAttribute('data-cc-n', String(i));
      rows.push({ n: inMain ? i : null, target: n.target.map((t) => (Array.isArray(t) ? t.join(' >> ') : t)).join(' | '), html: n.html.slice(0, 160), messageKey: n.any[0]?.data?.messageKey ?? null, frame: inMain ? 'main' : 'other-frame' });
      i++;
    }
    return { rows, violations: r.violations.reduce((a, v) => a + v.nodes.length, 0), v: window.__ccAxe.version };
  });
}
const PROBE_CSS = '*{transition:none!important;animation:none!important}#preview-bar-iframe,[id*=preview-bar]{display:none!important}' +
  '[data-cc-probe],[data-cc-probe] *,[data-cc-probe]::before,[data-cc-probe]::after,[data-cc-probe] *::before,[data-cc-probe] *::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}' +
  '[data-cc-probe]::placeholder,[data-cc-probe] *::placeholder{color:transparent!important;-webkit-text-fill-color:transparent!important}[data-cc-hide]{visibility:hidden!important}';

async function measure(page, row, vw) {
  const sel = `[data-cc-n="${row.n}"]`;
  const loc = page.locator(sel).first();
  if (!(await loc.count())) { row.error = 'nodo sin marca'; return; }
  await loc.evaluate((e) => e.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' }));
  await page.evaluate(async () => { await Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); })))); });
  await page.waitForTimeout(500);
  const info = await loc.evaluate((e) => {
    // oculta fixed/sticky que no contienen ni estan dentro del nodo
    document.querySelectorAll('[data-cc-hide]').forEach((x) => x.removeAttribute('data-cc-hide'));
    let hidden = 0;
    for (const x of document.body.querySelectorAll('*')) {
      const p = getComputedStyle(x).position;
      if ((p === 'fixed' || p === 'sticky') && !x.contains(e) && !e.contains(x)) { x.setAttribute('data-cc-hide', '1'); hidden++; }
    }
    const rc = (x) => x.getBoundingClientRect();
    const parse = (c) => { let v = c.match(/[\d.]+/g).map(Number); if (c.startsWith('color(srgb')) v = v.map((q, i) => (i < 3 ? Math.round(q * 255) : q)); return v; };
    let op = 1; for (let x = e; x; x = x.parentElement) op *= parseFloat(getComputedStyle(x).opacity);
    const r = rc(e); const cs = getComputedStyle(e);
    const items = [];
    const text = (e.textContent || '').trim();
    if (text) items.push({ kind: 'element', color: parse(cs.color), fs: parseFloat(cs.fontSize), fw: cs.fontWeight, text: text.slice(0, 50) });
    for (const ps of ['::before', '::after']) {
      const pc = getComputedStyle(e, ps); const content = pc.content;
      if (content && content !== 'none' && content !== 'normal' && content !== '""' && pc.display !== 'none' && pc.visibility !== 'hidden') items.push({ kind: ps, color: parse(pc.color), fs: parseFloat(pc.fontSize), fw: pc.fontWeight, text: content.slice(0, 50) });
    }
    return { items, op, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, hidden, fixedAncestor: (() => { for (let x = e; x; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'fixed' || p === 'sticky') return true; } return false; })() };
  });
  row.hiddenFixed = info.hidden; row.inFixedOrSticky = info.fixedAncestor;
  if (!info.items.length) { row.error = 'sin texto ni pseudo-contenido'; return; }
  const R = info.rect;
  if (R.w < 1 || R.h < 1) { row.error = 'sin caja visible'; return; }
  const ins = R.w > 12 && R.h > 12 ? 3 : 0;
  const x0 = Math.max(0, R.x), y0 = Math.max(0, R.y);
  const clip = { x: x0 + ins, y: y0 + ins, width: Math.min(R.x + R.w, vw) - x0 - 2 * ins, height: Math.min(R.y + R.h, 800) - y0 - 2 * ins };
  if (clip.width < 1 || clip.height < 1) { row.error = 'fuera de viewport'; return; }
  await loc.evaluate((e) => e.setAttribute('data-cc-probe', '1'));
  const buf = await page.screenshot({ clip }); await loc.evaluate((e) => e.removeAttribute('data-cc-probe'));
  const px = await page.evaluate(async (b64) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; const o = []; const step = Math.max(1, Math.floor(d.length / 4 / 600)); for (let i = 0; i < d.length / 4; i += step) o.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]); return o; }, buf.toString('base64'));
  row.measures = info.items.map((it) => {
    const large = it.fs >= 24 || (it.fs >= 18.66 && Number(it.fw) >= 700); const threshold = large ? 3 : 4.5;
    const a = (it.color[3] ?? 1) * info.op;
    const rs = px.map((bg) => ratio([0, 1, 2].map((k) => it.color[k] * a + bg[k] * (1 - a)), bg)).sort((x, y) => x - y);
    const p05 = rs[Math.floor(rs.length * 0.05)];
    return { kind: it.kind, text: it.text, fontPx: it.fs, fontWeight: it.fw, large, threshold, fg: it.color.slice(0, 3).join(','), fgAlpha: +a.toFixed(2), samples: rs.length, ratioMin: +rs[0].toFixed(2), ratioP05: +p05.toFixed(2), ratioMed: +rs[Math.floor(rs.length / 2)].toFixed(2), below: p05 < threshold, belowMin: rs[0] < threshold };
  });
  row.below = row.measures.some((m) => m.below);
  if (row.below || row.measures.some((m) => m.belowMin)) {
    const f = `contrast-evidence/v2-${row.preset}-${vw}-${row.page}-${row.cond}-${row.n}.png`; fs.mkdirSync(OUTDIR + '/contrast-evidence', { recursive: true });
    fs.writeFileSync(OUTDIR + '/' + f, await page.screenshot({ clip: { x: Math.max(0, clip.x - 20), y: Math.max(0, clip.y - 20), width: Math.min(clip.width + 40, vw), height: Math.min(clip.height + 40, 400) } })); row.evidence = f;
  }
}

const b = await chromium.launch();
try {
  for (const cond of ['A', 'B']) for (const preset of presets) {
    const ctx = await newCtx(b, VPS[0].width, VPS[0].height, { reducedMotion: 'reduce', serviceWorkers: 'block' });
    const page = await ctx.newPage(); page.setDefaultTimeout(15000);
    try {
      for (const vp of VPS) {
        await page.setViewportSize(vp);
        for (const [pn, pp] of Object.entries(PAGES)) {
          try {
            if (cond === 'A') {
              await sleep(2200);
              await page.goto(`https://sartorial-theme-kvkzl39t.myshopify.com${pp}?preview_theme_id=${THEMES[preset]}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
              await page.waitForFunction(() => document.readyState !== 'loading');
              await keyboardSmoke(page);
            } else await nav(page, pp, THEMES[preset], 1200);
            await injectAxe(page);
            const res = await collect(page);
            out.pages.push({ cond, preset, vw: vp.width, page: pn, incomplete: res.rows.length, mainFrame: res.rows.filter((r) => r.frame === 'main').length, violations: res.violations });
            // ahora si: dejar cargar y medir
            await page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
            await page.addStyleTag({ content: PROBE_CSS });
            for (const r of res.rows) {
              const row = { cond, preset, vw: vp.width, page: pn, ...r };
              if (r.frame !== 'main') { row.error = 'otro frame (barra de preview)'; out.nodes.push(row); continue; }
              try { await measure(page, row, vp.width); } catch (e) { row.error = String(e.message).slice(0, 120); }
              out.nodes.push(row);
            }
            console.log(cond, preset, vp.width, pn, 'incomplete', res.rows.length);
          } catch (e) { console.log('ERR', cond, preset, vp.width, pn, String(e.message).slice(0, 100)); out.pages.push({ cond, preset, vw: vp.width, page: pn, error: String(e.message).slice(0, 150) }); }
        }
      }
    } finally { await ctx.close(); }
  }
} finally { await b.close(); save('14-contrast-reconcile.json', out); }
