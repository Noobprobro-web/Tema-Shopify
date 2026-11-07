// A-03: arnes SINTETICO del anillo de foco por motion_style (Chromium local, sin tienda).
// Uso (desde la raiz del repo):
//   node agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs <ruta-css> config/settings_data.json [--label X]
//   node agent-comms/outbox-claude/harness-A-03-001/focus-contrast.mjs <ruta-css> --rules [--label X]
// Evidencia preliminar: fondos solidos de cada esquema, sin secciones reales ni imagenes (RULES 3.7).
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const args = process.argv.slice(2);
const rulesMode = args.includes('--rules');
const li = args.indexOf('--label');
const label = li >= 0 ? args[li + 1] : '';
const pos = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--label');
const cssPath = pos[0];
const settingsPath = pos[1];
const css = fs.readFileSync(cssPath, 'utf8');

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => { const x = lum(a); const y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const rgb = (s) => s.match(/[\d.]+/g).map(Number).slice(0, 3);

const browser = await chromium.launch();

if (rulesMode) {
  // Paridad de parseo (criterio 7): reglas CSS que Chromium obtiene, contadas de forma recursiva.
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body></body></html>`);
  const res = await page.evaluate(() => {
    let total = 0;
    const focusRules = [];
    const walk = (list) => {
      for (const r of list) {
        total++;
        if (r.cssRules) walk(r.cssRules);
        if (r.selectorText && /data-motion-style=["'](technical|heritage)["']\] \.button:focus-visible/.test(r.selectorText)) {
          focusRules.push({ sel: r.selectorText.split(',')[0], usa: r.cssText.includes('var(--color-foreground)') });
        }
      }
    };
    for (const sh of document.styleSheets) walk(sh.cssRules);
    return { total, focusRules };
  });
  console.log(`SINTETICO (Chromium local, sin tienda) ${label}`.trim());
  console.log(`reglas_css=${res.total}`);
  for (const f of res.focusRules) console.log(`regla_foco ${f.sel} usa_var_color_foreground=${f.usa}`);
  await browser.close();
  process.exit(0);
}

const presets = JSON.parse(fs.readFileSync(settingsPath, 'utf8')).presets;
const LONG = 'Texto muy largo de boton '.repeat(5).slice(0, 120);
const CONTROLS = [
  '<button class="button" type="button">Primary</button>',
  '<button class="button button--secondary" type="button">Secondary</button>',
  '<input type="email" aria-label="e">',
  '<select aria-label="s"><option>A</option></select>',
  '<input type="checkbox" aria-label="c">',
  '<a href="#">Link</a>',
  '<button class="icon-button" type="button" aria-label="i">x</button>',
  '<div class="quantity-stepper"><input class="quantity-stepper__input" type="number" value="1" aria-label="q"></div>',
  `<button class="button" type="button" data-long="1" style="width:200px">${LONG}</button>`,
].join('');
const TARGET = ['btn', 'btn2', 'email', 'select', 'checkbox', 'stepper', 'btnlong'];

const rows = [];
for (const [pn, p] of Object.entries(presets)) {
  const ids = Object.keys(p.color_schemes);
  const vars = ids.map((id) => {
    const s = p.color_schemes[id].settings;
    return `.color-${id}{--color-background:${s.background};--color-foreground:${s.text};--color-button:${s.button};--color-button-label:${s.button_label};--color-link:${s.secondary_button_label};--color-border:${s.border};--color-shadow:${s.shadow};}`;
  }).join('\n');
  const body = ids.map((id) => `<section class="color-${id}" data-s="${id}" style="background:var(--color-background);padding:24px">${CONTROLS}</section>`).join('');
  for (const motion of ['atelier', 'technical', 'heritage']) {
    for (const pref of ['no-preference', 'reduce']) {
      const page = await browser.newPage();
      await page.emulateMedia({ reducedMotion: pref });
      await page.setContent(`<!doctype html><html data-motion-style="${motion}"><head><style>${css}</style><style>${vars}</style></head><body class="color-scheme-1">${body}</body></html>`);
      const n = await page.evaluate(() => document.querySelectorAll('section button, section input, section select, section a').length);
      for (let i = 0; i < n; i++) {
        await page.keyboard.press('Tab');
        const r = await page.evaluate(() => {
          const e = document.activeElement; const c = getComputedStyle(e); const s = e.closest('section');
          const k = e.dataset.long ? 'btnlong' : e.matches('.button--secondary') ? 'btn2' : e.matches('.button') ? 'btn'
            : e.matches('.icon-button') ? 'icon' : e.matches('.quantity-stepper__input') ? 'stepper'
            : e.tagName === 'A' ? 'a' : e.type === 'checkbox' ? 'checkbox' : e.type === 'email' ? 'email' : e.tagName.toLowerCase();
          return { k, s: s.dataset.s, fv: e.matches(':focus-visible'), col: c.outlineColor, st: c.outlineStyle, w: c.outlineWidth, off: c.outlineOffset, bg: getComputedStyle(s).backgroundColor, box: Math.round(e.getBoundingClientRect().width) };
        });
        rows.push({ pn, motion, pref, ...r, ratio: cr(rgb(r.col), rgb(r.bg)) });
      }
      await page.close();
    }
  }
}
await browser.close();

const isFail = (r) => r.ratio < 3 || r.st !== 'solid' || parseFloat(r.w) < 2 || !r.fv;
const targets = rows.filter((r) => TARGET.includes(r.k));
const bad = targets.filter(isFail);
console.log(`SINTETICO (Chromium local, sin tienda) ${label}`.trim());
console.log('preset | motion | preferencia | esquema | control | color | fondo | ratio | grosor | offset | focus-visible');
for (const r of rows) console.log([r.pn, r.motion, r.pref, r.s, r.k, r.col, r.bg, r.ratio.toFixed(2), r.w, r.off, r.fv].join(' | '));
console.log(`filas=${rows.length} fallos=${bad.length}`);
const per = {}; for (const r of bad) per[r.k] = (per[r.k] || 0) + 1;
console.log(`fallos_por_control=${JSON.stringify(per)}`);
console.log(`combinaciones_estilo_esquema_con_fallo=${new Set(bad.map((r) => `${r.pn}|${r.motion}|${r.s}`)).size}`);
console.log(`fallos_con_reduce=${bad.filter((r) => r.pref === 'reduce').length}`);
console.log(`ratio_minimo_controles_objetivo=${Math.min(...targets.map((r) => r.ratio)).toFixed(2)}`);
console.log(`anchos_btnlong=${[...new Set(rows.filter((r) => r.k === 'btnlong').map((r) => r.box))].join(',')}`);
console.log('--- offsets por estilo y preferencia (btn / stepper) ---');
for (const k of ['btn', 'stepper']) console.log(k + ': ' + [...new Set(rows.filter((r) => r.k === k).map((r) => `${r.motion}/${r.pref}=${r.off}`))].join(' '));
console.log('--- ratio minimo por preset | motion | esquema (controles objetivo, no-preference) ---');
const seen = new Map();
for (const r of targets.filter((x) => x.pref === 'no-preference')) {
  const key = `${r.pn} | ${r.motion} | ${r.s}`;
  seen.set(key, Math.min(seen.get(key) ?? 99, r.ratio));
}
for (const [k, v] of seen) console.log(`${k} | ${v.toFixed(2)}${v < 3 ? ' FALLA' : ''}`);
