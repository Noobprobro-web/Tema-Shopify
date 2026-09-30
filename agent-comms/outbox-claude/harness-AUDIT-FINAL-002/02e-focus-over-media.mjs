// Eje 1: visibilidad real del indicador de foco en controles que viven SOBRE fotografía
// (WCAG 2.4.7 y 1.4.11). Se captura el control sin foco y con :focus-visible, se aíslan los píxeles que
// cambian (el anillo) y se calcula su contraste contra el píxel que tenían debajo.
// También mide el contraste no textual del propio hotspot contra la foto que lo rodea.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const DIFF = async ({ a, b }) => {
  const load = async (u) => { const i = new Image(); await new Promise((res, rej) => { i.onload = res; i.onerror = rej; i.src = u; }); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, c.width, c.height); };
  const A = await load(a), B = await load(b);
  const lum = (r, g, bb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bb); };
  const ratios = [];
  for (let i = 0; i < A.data.length; i += 4) {
    const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d < 24) continue;
    const l1 = lum(A.data[i], A.data[i + 1], A.data[i + 2]), l2 = lum(B.data[i], B.data[i + 1], B.data[i + 2]);
    ratios.push((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
  }
  ratios.sort((x, y) => x - y);
  const q = (p) => (ratios.length ? +ratios[Math.min(ratios.length - 1, Math.floor(ratios.length * p))].toFixed(2) : null);
  return { changedPx: ratios.length, totalPx: A.data.length / 4, p10: q(0.1), p50: q(0.5), below3Pct: ratios.length ? Math.round((ratios.filter((r) => r < 3).length / ratios.length) * 100) : null };
};

const TARGETS = {
  '/': ['.hero-editorial__button', '.lookbook-hotspot__trigger', '.curated-showcase__spotlight-media', '.bento-card--featured', '.marquee-banner__toggle', '.product-card__media'],
  pdp: ['.product-gallery__zoom-trigger'],
};

const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    await unlock(context, store.url);
    const blank = await context.newPage(); await blank.goto('about:blank');
    const page = await context.newPage();
    for (const [key, sels] of Object.entries(TARGETS)) {
      const path = key === 'pdp' ? '/products/' + store.products[0] : key;
      const resp = await page.goto(store.url + path, { waitUntil: 'load', timeout: 60000 });
      if (resp.status() >= 400) { out.push({ store: name, vp: vp.n, path, error: resp.status() }); continue; }
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
      await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important;transition:none!important;scroll-behavior:auto!important}' });
      for (const sel of sels) {
        const n = Math.min(await page.locator(sel).count(), sel.includes('hotspot') ? 4 : 2);
        for (let i = 0; i < n; i++) {
          const loc = page.locator(sel).nth(i);
          if (!(await loc.isVisible().catch(() => false))) continue;
          await loc.scrollIntoViewIfNeeded();
          await page.evaluate(() => document.activeElement && document.activeElement.blur());
          await page.waitForTimeout(250);
          const box = await loc.boundingBox();
          if (!box) continue;
          const pad = 10;
          const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: Math.min(vp.width - Math.max(0, box.x - pad), box.width + pad * 2), height: Math.min(vp.height - Math.max(0, box.y - pad), box.height + pad * 2) };
          if (clip.width <= 0 || clip.height <= 0) continue;
          const a = await page.screenshot({ clip, type: 'png' });
          // Una pulsación de teclado fija la modalidad "teclado": el foco programático casa con :focus-visible.
          await page.keyboard.press('Shift');
          await loc.focus();
          await page.waitForTimeout(200);
          const meta = await loc.evaluate((el) => { const cs = getComputedStyle(el); return { fv: el.matches(':focus-visible'), outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} off=${cs.outlineOffset}`, label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36), bg: cs.backgroundColor, border: cs.borderTopWidth + ' ' + cs.borderTopColor, shadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 70) }; });
          const b = await page.screenshot({ clip, type: 'png' });
          const d = await blank.evaluate(DIFF, { a: 'data:image/png;base64,' + a.toString('base64'), b: 'data:image/png;base64,' + b.toString('base64') });
          out.push({ store: name, vp: vp.n, path, sel, i, ...meta, ring: d });
          await page.evaluate(() => document.activeElement && document.activeElement.blur());
        }
      }
    }
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-02e-focus-over-media' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) console.log(r.error ? `${r.store} ${r.vp} ${r.path} ERROR ${r.error}` : `${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.sel.padEnd(36)} #${r.i} fv=${r.fv} anillo: px=${r.ring.changedPx} p10=${r.ring.p10} p50=${r.ring.p50} <3:1=${r.ring.below3Pct}% ${r.ring.p50 !== null && r.ring.p50 < 3 ? '<<< FLAG' : ''} | ${r.outline} | bg=${r.bg} border=${r.border} shadow=${r.shadow} | "${r.label}"`);
