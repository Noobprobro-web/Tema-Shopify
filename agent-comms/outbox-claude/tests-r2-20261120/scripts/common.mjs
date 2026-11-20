import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const require = createRequire('/home/user/Tema-Shopify/');
export const { chromium, request } = require('playwright');
export const H = 'sartorial-theme-kvkzl39t.myshopify.com';
export const O = 'https://' + H;
export const THEMES = { sartorial: '190453317936', imprint: '190453350704', archive: '190453383472', pkg: '190453285168' };
export const OUTDIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SHOTS = process.env.SHOTS_DIR || '/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots';
export const AXE_PATH = process.env.AXE_PATH || '/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/wt-t6res/tests/vendor/axe.min.js';
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'];
// Recoge errores de consola, errores de pagina, peticiones fallidas y hosts de terceros.
export function watch(page) {
  const w = { console: [], pageerrors: [], failed: [], requests: [] };
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') w.console.push({ type: m.type(), text: m.text().slice(0, 300), url: m.location()?.url?.slice(0, 160) }); });
  page.on('pageerror', (e) => w.pageerrors.push(String(e.stack || e).slice(0, 600)));
  page.on('requestfailed', (r) => w.failed.push({ url: r.url().slice(0, 160), err: r.failure()?.errorText }));
  page.on('request', (r) => w.requests.push(r.url()));
  return w;
}
export async function axe(page) {
  const src = fs.readFileSync(AXE_PATH, 'utf8');
  await page.evaluate(src);
  return page.evaluate(async (tags) => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
    const slim = (a) => a.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 6).map((n) => n.target.join(' ')) }));
    return { version: window.axe.version, violations: slim(r.violations), incomplete: slim(r.incomplete) };
  }, AXE_TAGS);
}
export const overflowX = (page) => page.evaluate(() => { const de = document.documentElement; const bad = [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > de.clientWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('[data-gallery-track],.slideshow__track,[class*=marquee],[class*=carousel],[data-scroll-x]'); }).slice(0, 5).map((e) => e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 50)); return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, overflow: de.scrollWidth - de.clientWidth, offenders: bad }; });
export const shot = async (page, name, opts = {}) => { fs.mkdirSync(SHOTS, { recursive: true }); const f = path.join(SHOTS, name + '.png'); await page.screenshot({ path: f, ...opts }); return f; };
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
export const MOB = { deviceScaleFactor: 2, hasTouch: true, isMobile: true };
export const ctxFor = (browser, mode, extra = {}) => newCtx(browser, mode === 'mobile' ? 390 : 1280, mode === 'mobile' ? 844 : 800, mode === 'mobile' ? { ...MOB, ...extra } : extra);
export const platformNoise = (c) => /ERR_TUNNEL_CONNECTION_FAILED|shopifysvc|shop\.app|preview-bar|bugsnag|postMessage|shopify-xr\.js|Refused to execute script/.test((c.text || '') + (c.url || ''));
export const themeConsole = (w) => [...w.console.filter((c) => c.type === 'error' && !platformNoise(c)), ...w.pageerrors.filter((e) => !/shopifycloud|shopifysvc|trekkie|monorail|storefront-features|preview-bar|web-pixels|shop\.app/.test(e)).map((e) => ({ type: 'pageerror', text: e }))];
export const axeTheme = (a) => a.violations.filter((v) => !v.targets.every((x) => /#PBarNextFrame|preview-bar|PBar/.test(x)));
