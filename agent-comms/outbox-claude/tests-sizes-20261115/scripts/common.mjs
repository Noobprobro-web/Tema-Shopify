import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire('/home/user/Tema-Shopify/');
export const { chromium, request } = require('playwright');
export const H = 'sartorial-theme-kvkzl39t.myshopify.com';
export const O = 'https://' + H;
export const THEMES = { sartorial: '190317920560', imprint: '190317953328', archive: '190317986096' };
export const OUTDIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
export async function pace(ms = 2200) { const w = Math.max(0, ms - (Date.now() - last)); if (w) await sleep(w); last = Date.now(); }
export async function newCtx(browser, vw = 390, vh = 844, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, ...extra });
  for (let a = 0; a < 3; a++) {
    await pace();
    const r = await ctx.request.post(`${O}/password`, { form: { form_type: 'storefront_password', utf8: '✓', password: process.env.STOREFRONT_PASSWORD }, maxRedirects: 0 });
    if (r.status() === 429) { await sleep((Number(r.headers()['retry-after']) || 30) * 1000); continue; }
    if (r.status() !== 302 && r.status() !== 303) throw new Error('auth ' + r.status());
    return ctx;
  }
  throw new Error('429 persistente en auth');
}
export async function nav(page, p, id, settle = 600) {
  for (let a = 0; a < 3; a++) {
    await pace();
    const r = await page.goto(`${O}${p}${p.includes('?') ? '&' : '?'}preview_theme_id=${id}`, { waitUntil: 'load' });
    if (r && r.status() === 429) { await sleep((Number(r.headers()['retry-after']) || 30 * (a + 1)) * 1000); continue; }
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
    await sleep(settle);
    const ident = await page.evaluate(() => ({ id: String(window.Shopify?.theme?.id), role: window.Shopify?.theme?.role })).catch(() => ({}));
    if (ident.role !== 'unpublished' || ident.id !== String(id)) throw new Error('PREVIEW_IDENTITY ' + JSON.stringify(ident));
    return r ? r.status() : 0;
  }
  throw new Error('429 persistente');
}
export function save(name, obj) { fs.writeFileSync(path.join(OUTDIR, name), JSON.stringify(obj, null, 2)); console.log('saved', name); }
export const presets = (process.env.PRESETS || 'sartorial,imprint,archive').split(',');
export async function setFont(page, scale) { await page.addStyleTag({ content: `html{font-size:${scale}% !important}` }); await sleep(400); }
export async function setGrid2(page) {
  await page.evaluate(() => { try { localStorage.setItem('theme:grid-columns', '4'); } catch {} });
  const btn = page.locator('[data-grid-view="4"]').first(); if (await btn.count()) await btn.click({ force: true }).catch(() => {}); await sleep(300);
}
// Medidas por tarjeta: caja, boton de accion, titulo, swatches; y desfase de titulos por fila.
export function measureCards() {
  const cards = [...document.querySelectorAll('.product-card')];
  const de = document.documentElement;
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
  const rows = cards.map((c) => {
    const cr = c.getBoundingClientRect(), t = c.querySelector('.product-card__title'), m = c.querySelector('.product-card__media');
    const a = c.querySelector('.product-card__action .button, .product-card__action a, .product-card__action button, .product-card__action');
    const ar = a ? a.getBoundingClientRect() : null; const g = c.querySelector('.product-card__swatch-group');
    const v = c.querySelector('.product-card__vendor');
    return {
      title: (t?.textContent || '').trim().slice(0, 30), vendor: v ? v.textContent.trim().slice(0, 30) : null,
      left: Math.round(cr.left), right: Math.round(cr.right), width: Math.round(cr.width), top: Math.round(cr.top + scrollY),
      action: ar ? { text: (a.textContent || '').trim().slice(0, 24), w: Math.round(ar.width), overflowRight: Math.round((ar.right - cr.right) * 10) / 10, overflowLeft: Math.round((cr.left - ar.left) * 10) / 10 } : null,
      mediaW: m ? Math.round(m.getBoundingClientRect().width) : null,
      titleTop: t ? Math.round((t.getBoundingClientRect().top + scrollY) * 10) / 10 : null,
      swVisible: g ? [...g.querySelectorAll('.card-swatch')].filter(vis).length : null, swTotal: g ? g.querySelectorAll('.card-swatch').length : null,
      swAttr: g ? (g.hasAttribute('data-swatch-fit-px') ? 'px=' + g.getAttribute('data-swatch-fit-px') : 'fit=' + g.getAttribute('data-swatch-fit')) : null,
      groupOverflow: g ? g.scrollWidth - g.clientWidth : null,
    };
  });
  const byTop = {}; rows.forEach((r) => { (byTop[r.top] ||= []).push(r); });
  let maxDelta = 0; const rowDeltas = [];
  Object.values(byTop).forEach((rs) => { if (rs.length > 1) { const ts = rs.map((r) => r.titleTop).filter((x) => x != null); const d = Math.round((Math.max(...ts) - Math.min(...ts)) * 10) / 10; rowDeltas.push(d); maxDelta = Math.max(maxDelta, d); } });
  const g = document.querySelector('.product-grid');
  return { docOverflowX: de.scrollWidth - de.clientWidth, cols: g ? getComputedStyle(g).gridTemplateColumns.split(' ').length : null, n: cards.length,
    maxActionOverflow: Math.max(0, ...rows.map((r) => r.action ? Math.max(r.action.overflowRight, r.action.overflowLeft) : 0)), maxTitleDelta: maxDelta, rowDeltas, cards: rows };
}
