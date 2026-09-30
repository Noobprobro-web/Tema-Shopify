// Eje 1: contraste real de texto y controles que se pintan SOBRE imagen/vídeo/gradiente.
// Método: se vuelve transparente el texto candidato, se captura la página completa y se compara el color
// computado del texto contra cada píxel del fondo real (imagen + scrim) dentro de su caja.
// Se informa el peor píxel (min), el percentil 5 y la mediana. Umbral 4.5:1 (3:1 si texto grande).
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const COLLECT = () => {
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).map(Number); return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; };
  const out = [];
  const seen = new Set();
  const isMedia = (n) => /^(img|video|picture|canvas)$/.test(n.localName) || (/url\(|gradient\(/.test(getComputedStyle(n).backgroundImage));
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('[hidden], [inert], .visually-hidden, [aria-hidden="true"], script, style, noscript, template')) continue;
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!hasText) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    if (r.right <= 0 || r.left >= document.documentElement.clientWidth) continue;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cy < 0 || cy > window.innerHeight) continue; // se llama por tramos de scroll
    const stack = document.elementsFromPoint(cx, cy);
    const idx = stack.indexOf(el);
    const below = (idx >= 0 ? stack.slice(idx + 1) : stack).filter((n) => !el.contains(n));
    // Hay medio detrás si, antes de topar con un fondo opaco sólido, aparece una imagen/vídeo/gradiente.
    let media = null;
    for (const n of [el, ...(idx >= 0 ? stack.slice(idx + 1) : stack)]) {
      if (n !== el && isMedia(n)) { media = n; break; }
      const bg = parse(getComputedStyle(n).backgroundColor);
      if (n !== el && bg && bg.a >= 0.99 && !/url\(|gradient\(/.test(getComputedStyle(n).backgroundImage)) break;
      if (n === el && /url\(|gradient\(/.test(cs.backgroundImage)) { media = n; break; }
    }
    if (!media) continue;
    const key = Math.round(r.left) + ',' + Math.round(r.top + window.scrollY) + ',' + el.textContent.trim().slice(0, 20);
    if (seen.has(key)) continue;
    seen.add(key);
    const id = 'ctr-' + Math.random().toString(36).slice(2, 9);
    el.setAttribute('data-ctr', id);
    const color = parse(cs.color);
    const fs = parseFloat(cs.fontSize), fw = parseInt(cs.fontWeight, 10) || 400;
    out.push({
      id, text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 48), tag: el.localName + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
      section: (el.closest('[id^="shopify-section-"]')?.id || '').split('__').pop(), color: color.rgb, alpha: color.a, fs, fw,
      large: fs >= 24 || (fs >= 18.66 && fw >= 700),
      media: media.localName + (media.className && typeof media.className === 'string' ? '.' + media.className.trim().split(/\s+/)[0] : ''),
      elBg: parse(cs.backgroundColor),
      rect: { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
      interactive: !!el.closest('a, button'),
    });
  }
  return out;
};

// Decodifica un PNG (dataURL) en una página en blanco y calcula el contraste por caja.
const ANALYZE = async ({ dataUrl, items, scale }) => {
  const img = new Image();
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const ctx = c.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0);
  const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  return items.map((it) => {
    const x = Math.max(0, Math.round(it.rect.x * scale)), y = Math.max(0, Math.round(it.rect.y * scale));
    const w = Math.min(c.width - x, Math.round(it.rect.w * scale)), h = Math.min(c.height - y, Math.round(it.rect.h * scale));
    if (w <= 0 || h <= 0) return { id: it.id, skip: 'fuera de captura' };
    const d = ctx.getImageData(x, y, w, h).data;
    const ratios = [];
    let sr = 0, sg = 0, sb = 0, n = 0;
    for (let i = 0; i < d.length; i += 4 * 2) {
      // Texto con alfa: se compone sobre el propio píxel de fondo.
      const a = it.alpha;
      const tr = it.color[0] * a + d[i] * (1 - a), tg = it.color[1] * a + d[i + 1] * (1 - a), tb = it.color[2] * a + d[i + 2] * (1 - a);
      const l1 = lum(tr, tg, tb), l2 = lum(d[i], d[i + 1], d[i + 2]);
      ratios.push((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
      sr += d[i]; sg += d[i + 1]; sb += d[i + 2]; n++;
    }
    ratios.sort((a, b) => a - b);
    const q = (p) => +ratios[Math.min(ratios.length - 1, Math.floor(ratios.length * p))].toFixed(2);
    return { id: it.id, min: q(0), p5: q(0.05), p50: q(0.5), avgBg: [Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)] };
  });
};

const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '768', width: 768, height: 1024 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await unlock(context, store.url);
    const blank = await context.newPage();
    await blank.goto('about:blank');
    const page = await context.newPage();
    for (const p of ['/', '/collections/all', '/products/' + store.products[0]]) {
      const resp = await page.goto(store.url + p, { waitUntil: 'load', timeout: 60000 });
      if (resp.status() === 429) { out.push({ store: name, vp: vp.n, path: p, error: '429' }); continue; }
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      // Congelar animaciones/marquesina y el sticky header para que la captura completa sea estable.
      await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;scroll-behavior:auto!important}' });
      const items = [];
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += Math.round(vp.height * 0.8)) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(250);
        items.push(...(await page.evaluate(COLLECT)));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      // Ocultar solo los glifos (no sus fondos) y capturar.
      await page.addStyleTag({ content: '[data-ctr]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;text-decoration-color:transparent!important}[data-ctr] *{color:transparent!important;-webkit-text-fill-color:transparent!important}' });
      // El header sticky se pinta arriba en la captura completa; se deja estático para no tapar candidatos.
      await page.addStyleTag({ content: '.section-header,.shopify-section-group-header-group{position:static!important}' });
      await page.waitForTimeout(200);
      // La posición puede cambiar al volver estático el header: se re-miden las cajas.
      const rects = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-ctr]')].map((el) => { const r = el.getBoundingClientRect(); return [el.getAttribute('data-ctr'), { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }]; })));
      const uniq = [...new Map(items.map((i) => [i.id, i])).values()].filter((i) => rects[i.id]).map((i) => ({ ...i, rect: rects[i.id] }));
      const shot = await page.screenshot({ fullPage: true, type: 'png' });
      const res = await blank.evaluate(ANALYZE, { dataUrl: 'data:image/png;base64,' + shot.toString('base64'), items: uniq, scale: 1 });
      const byId = Object.fromEntries(res.map((r) => [r.id, r]));
      for (const it of uniq) {
        const r = byId[it.id];
        if (!r || r.skip) continue;
        const need = it.large ? 3 : 4.5;
        out.push({ store: name, vp: vp.n, path: p, section: it.section, tag: it.tag, text: it.text, fs: it.fs, fw: it.fw, color: it.color.join(','), alpha: it.alpha, media: it.media, need, min: r.min, p5: r.p5, p50: r.p50, avgBg: r.avgBg.join(','), verdict: r.p5 >= need ? (r.min >= need ? 'PASS' : 'PASS(p5)/peor-píxel<umbral') : 'FAIL' });
      }
    }
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-02c-contrast' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) {
  if (r.error) { console.log(r.store, r.vp, r.path, 'ERROR', r.error); continue; }
  console.log(`${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.path.padEnd(22).slice(0, 22)} ${(r.section || '').padEnd(17).slice(0, 17)} ${r.verdict.padEnd(26)} min=${String(r.min).padEnd(6)} p5=${String(r.p5).padEnd(6)} p50=${String(r.p50).padEnd(6)} need=${r.need} ${r.fs}px/${r.fw} rgb(${r.color})${r.alpha < 1 ? ' a=' + r.alpha : ''} bg~(${r.avgBg}) <${r.media}> ${r.tag} "${r.text}"`);
}
