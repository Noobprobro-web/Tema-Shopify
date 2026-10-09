// Agente 3 (T-01 re-verificación): el parche P-01 dibuja un indicador de DOS tonos (contorno oscuro entre
// bandas del color de fondo). El método de 02e (contraste del píxel enfocado contra la foto que tapa) no
// sirve para un indicador de dos tonos: lo que exige WCAG 1.4.11 es 3:1 entre el indicador y sus colores
// adyacentes. Aquí se muestrea la captura real en 8 ángulos (hotspot) o 8 puntos del marco (galería) y se
// mide, en cada punto, el contraste entre el trazo oscuro y la banda clara que lo flanquea por dentro y por fuera.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const SAMPLE = async ({ dataUrl, rays }) => {
  const img = new Image(); await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = dataUrl; });
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const inside = (p) => p[0] >= 0 && p[1] >= 0 && p[0] < c.width && p[1] < c.height;
  const px = (p) => { const d = x.getImageData(Math.round(p[0]), Math.round(p[1]), 1, 1).data; return [d[0], d[1], d[2]]; };
  const lum = (c3) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c3[0]) + 0.7152 * f(c3[1]) + 0.0722 * f(c3[2]); };
  const cr = (a, b) => +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
  return rays.map((ray) => {
    const pts = ray.points.filter(inside);
    if (pts.length < ray.points.length) return { at: ray.label, skipped: 'fuera de la captura (el control es más alto que la ventana)' };
    const ls = pts.map((p) => lum(px(p)));
    const dark = Math.min(...ls), light = Math.max(...ls);
    const photo = inside(ray.photo) ? lum(px(ray.photo)) : null;
    return { at: ray.label, ringVsBand: cr(dark, light), bandVsPhoto: photo === null ? null : cr(light, photo), ringVsPhoto: photo === null ? null : cr(dark, photo) };
  });
};

const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  await unlock(context, store.url);
  const blank = await context.newPage(); await blank.goto('about:blank');
  const page = await context.newPage();
  const targets = [{ path: '/products/' + store.products[0], sel: '.product-gallery__zoom-trigger', n: 1 }, { path: '/', sel: '.lookbook-hotspot__trigger', n: 4 }];
  for (const t of targets) {
    await page.goto(store.url + t.path, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    const count = Math.min(await page.locator(t.sel).count(), t.n);
    for (let i = 0; i < count; i++) {
      const loc = page.locator(t.sel).nth(i);
      await loc.scrollIntoViewIfNeeded();
      await page.keyboard.press('Shift'); await loc.focus(); await page.waitForTimeout(250);
      const geo = await loc.evaluate((el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { x: r.left, y: r.top, w: r.width, h: r.height, fv: el.matches(':focus-visible'), outline: cs.outlineColor + ' ' + cs.outlineWidth + ' off ' + cs.outlineOffset, shadow: cs.boxShadow, radius: cs.borderTopLeftRadius }; });
      const pad = 16;
      const clip = { x: Math.max(0, geo.x - pad), y: Math.max(0, geo.y - pad), width: Math.min(1440, geo.w + pad * 2), height: Math.min(900, geo.h + pad * 2) };
      const shot = await page.screenshot({ clip, type: 'png' });
      const ox = geo.x - clip.x, oy = geo.y - clip.y;
      let rays;
      const along = (from, dir, d0, d1) => { const p = []; for (let d = d0; d <= d1; d += 0.5) p.push([from[0] + dir[0] * d, from[1] + dir[1] * d]); return p; };
      if (t.sel.includes('hotspot')) {
        // Círculo de radio r: banda + trazo + banda ocupan r .. r+6 px hacia fuera; la foto empieza en r+8.
        const cx = ox + geo.w / 2, cy = oy + geo.h / 2, r = geo.w / 2;
        rays = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => { const a = (deg * Math.PI) / 180; const dir = [Math.cos(a), Math.sin(a)]; return { label: deg + '°', points: along([cx, cy], dir, r + 0.5, r + 6), photo: [cx + dir[0] * (r + 10), cy + dir[1] * (r + 10)] }; });
      } else {
        // Marco interior: banda + trazo + banda ocupan 0 .. 7 px hacia dentro; la foto empieza en 9 px.
        const L = ox, T = oy, R = ox + geo.w, B = oy + geo.h, mx = ox + geo.w / 2, my = oy + geo.h / 2;
        const ray = (label, from, dir) => ({ label, points: along(from, dir, 0.5, 7), photo: [from[0] + dir[0] * 14, from[1] + dir[1] * 14] });
        rays = [ray('arriba', [mx, T], [0, 1]), ray('abajo', [mx, B], [0, -1]), ray('izquierda', [L, my], [1, 0]), ray('derecha', [R, my], [-1, 0]), ray('arriba-izq.', [L + 40, T], [0, 1]), ray('arriba-der.', [R - 40, T], [0, 1]), ray('izq.-abajo', [L, B - 40], [1, 0]), ray('der.-abajo', [R, B - 40], [-1, 0])];
      }
      const samples = await blank.evaluate(SAMPLE, { dataUrl: 'data:image/png;base64,' + shot.toString('base64'), rays });
      const measured = samples.filter((q) => !q.skipped);
      const minBand = measured.length ? Math.min(...measured.map((q) => q.ringVsBand)) : null;
      out.push({ store: name, path: t.path, sel: t.sel, i, focusVisible: geo.fv, outline: geo.outline, shadow: geo.shadow.slice(0, 60), measuredRays: measured.length, skippedRays: samples.length - measured.length, minRingVsBands: minBand, minRingVsPhoto: measured.length ? Math.min(...measured.map((q) => q.ringVsPhoto)) : null, samples });
      await page.evaluate(() => document.activeElement && document.activeElement.blur());
    }
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-25-two-tone-ring' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) console.log(`${r.store.padEnd(8)} ${r.sel.padEnd(32)} #${r.i} fv=${r.focusVisible} | trazo vs banda, mínimo en ${r.measuredRays} rayos = ${r.minRingVsBands}:1 ${r.minRingVsBands >= 3 ? 'PASA' : 'FALLA'} (rayos fuera de captura: ${r.skippedRays}) | trazo vs foto, mínimo = ${r.minRingVsPhoto}:1 (referencia del estado anterior) | ${r.outline}`);
