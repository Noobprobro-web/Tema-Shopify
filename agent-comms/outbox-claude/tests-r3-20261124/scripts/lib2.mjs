import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/home/user/Tema-Shopify/');
export const { chromium, devices } = require('playwright');
export const H = process.env.SHOPIFY_FLAG_STORE;
export const DEV = process.env.DEV !== '0';
export const O = DEV ? 'http://127.0.0.1:9292' : 'https://' + H;
export const TID = '190692557104';
export const SH = '<scratchpad>/shots';
export const sleep = ms => new Promise(r => setTimeout(r, ms));
let last = 0;
export async function pace(ms = DEV ? 500 : 2600) { const w = Math.max(0, ms - (Date.now() - last)); if (w) await sleep(w); last = Date.now(); }
export const DESK = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 };
export const MOB = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' };
export async function newCtx(browser, opts = DESK, authed = true) {
  const ctx = await browser.newContext(opts);
  if (authed && !DEV) for (let a = 0; a < 6; a++) {
    await pace();
    const r = await ctx.request.post(`${O}/password`, { form: { form_type: 'storefront_password', utf8: '✓', password: process.env.STOREFRONT_PASSWORD }, maxRedirects: 0 });
    if (r.status() === 429) { await sleep(30000); continue; }
    if (![302, 303].includes(r.status())) throw new Error('auth ' + r.status());
    break;
  }
  return ctx;
}
export function watch(page) {
  const w = { console: [], pageerrors: [], failed: [] };
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) w.console.push(m.type() + ': ' + m.text().slice(0, 240)); });
  page.on('pageerror', e => w.pageerrors.push(String(e.message || e).slice(0, 300)));
  page.on('requestfailed', r => w.failed.push(r.url().slice(0, 140) + ' ' + r.failure()?.errorText));
  return w;
}
export async function nav(page, p, { settle = 700 } = {}) {
  for (let a = 0; a < 6; a++) {
    await pace();
    const u = DEV ? `${O}${p}` : `${O}${p}${p.includes('?') ? '&' : '?'}preview_theme_id=${TID}`;
    const r = await page.goto(u, { waitUntil: 'load' });
    if (r && r.status() === 429) { await sleep(45000); continue; }
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await sleep(settle);
    return r ? r.status() : 0;
  }
  throw new Error('429');
}
export const ident = page => page.evaluate(() => ({ id: String(window.Shopify?.theme?.id), role: window.Shopify?.theme?.role }));
export async function bad(page) {
  return page.evaluate(() => {
    const html = document.documentElement.outerHTML;
    const text = document.body.innerText || '';
    const out = [];
    const re = [[/Liquid (error|syntax error)[^<]{0,120}/gi, 'liquid'], [/translation missing[^<]{0,100}/gi, 'translation'], [/\bt:[a-z0-9_]+\.[a-z0-9_.]+/g, 't-key'], [/&amp;(pound|euro|#\d+);/g, 'double-escaped-entity']];
    for (const [r, k] of re) { const src = k === 't-key' ? text : html; const m = src.match(r); if (m) out.push(k + ': ' + [...new Set(m)].slice(0, 4).join(' | ')); }
    return out;
  });
}
export const shot = (page, name, o = {}) => page.screenshot({ path: `${SH}/${name}.png`, ...o });
export const out = (name, o) => fs.writeFileSync(`${SH}/../${name}.json`, JSON.stringify(o, null, 2));
export async function cartCall(page, url, body, tries = 6) {
  for (let i = 0; i < tries; i++) {
    const r = await page.evaluate(async ([u, b]) => { const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }); return [r.status, (await r.text()).slice(0, 400)]; }, [url, body]);
    if (r[0] !== 429) return r;
    await sleep(6000 * (i + 1));
  }
  return [429, 'persistent'];
}
