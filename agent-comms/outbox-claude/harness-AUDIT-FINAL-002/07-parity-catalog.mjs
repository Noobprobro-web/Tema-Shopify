// Paridad código local ↔ tema publicado, inventario de estados de catálogo por tienda y peso de página.
// Responde a: ¿las citas archivo:línea del informe describen lo que realmente está desplegado?
import fs from 'node:fs';
import crypto from 'node:crypto';
import { STORES, launch, unlock } from './lib.mjs';

const ROOT = new URL('../../../', import.meta.url);
const local = (p) => fs.readFileSync(new URL(p, ROOT), 'utf8');
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');
const MARKERS = {
  'theme.js': ["rootMargin: '0px 0px 300px 0px'", 'overlappingMutations', 'class RecentlyViewed', 'updateOptionAvailability'],
  'base.css': ['@view-transition', 'product-recommendations:not([hidden]):empty', '--sticky-cart-offset'],
  'product-zoom.js': ['disconnectedCallback'],
};

const out = {};
const browser = await launch();
for (const [name, store] of Object.entries(STORES)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  const o = (out[name] = {});
  o.theme = await page.evaluate(() => ({ id: Shopify.theme.id, name: Shopify.theme.name, role: Shopify.theme.role, schema: Shopify.theme.schema_name + ' ' + Shopify.theme.schema_version }));
  const assets = await page.evaluate(() => [...document.querySelectorAll('script[src], link[rel="stylesheet"]')].map((n) => n.src || n.href).filter((u) => /\/assets\/(theme\.js|base\.css|product-zoom\.js)/.test(u)));
  o.assets = {};
  for (const url of assets) {
    const file = url.split('?')[0].split('/').pop();
    const body = await page.evaluate(async (u) => (await fetch(u)).text(), url);
    const src = local('assets/' + file);
    const norm = (s) => s.replace(/\r\n/g, '\n');
    o.assets[file] = { servedBytes: body.length, localBytes: src.length, servedMd5: md5(norm(body)), localMd5: md5(norm(src)), identical: norm(body) === norm(src), markers: Object.fromEntries((MARKERS[file] || []).map((m) => [m, body.includes(m)])) };
  }
  o.pdpTransfer = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => /\/assets\/(theme\.js|base\.css|product-zoom\.js)/.test(r.name)).map((r) => ({ f: r.name.split('?')[0].split('/').pop(), transferKb: +(r.transferSize / 1024).toFixed(1), encodedKb: +(r.encodedBodySize / 1024).toFixed(1), decodedKb: +(r.decodedBodySize / 1024).toFixed(1), blocking: r.renderBlockingStatus })));
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  o.homeWeight = await page.evaluate(() => { const rs = performance.getEntriesByType('resource'); const by = {}; for (const r of rs) { const t = r.initiatorType; by[t] = +((by[t] || 0) + r.transferSize / 1024).toFixed(1); } const n = performance.getEntriesByType('navigation')[0]; return { requests: rs.length, totalKb: +(rs.reduce((a, r) => a + r.transferSize, 0) / 1024).toFixed(1), by, ttfb: Math.round(n.responseStart), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), htmlKb: +(n.transferSize / 1024).toFixed(1), domNodes: document.querySelectorAll('*').length, themeScripts: [...document.querySelectorAll('script[src]')].filter((s) => /\/assets\//.test(s.src)).map((s) => s.src.split('?')[0].split('/').pop() + (s.defer ? ':defer' : '') + (s.async ? ':async' : '') + (s.type === 'module' ? ':module' : '')), inlineScriptsInBody: document.querySelectorAll('body script:not([src]):not([type="application/json"]):not([type="application/ld+json"])').length }; });
  o.catalog = await page.evaluate(async () => {
    const j = await (await fetch('/products.json?limit=250')).json();
    const c = await (await fetch('/collections.json?limit=250')).json();
    const ps = j.products;
    return {
      products: ps.length,
      multiVariant: ps.filter((p) => p.variants.length > 1).length,
      onSale: ps.filter((p) => p.variants.some((v) => v.compare_at_price && Number(v.compare_at_price) > Number(v.price))).map((p) => p.handle),
      soldOutProducts: ps.filter((p) => p.variants.every((v) => !v.available)).map((p) => p.handle),
      productsWithSoldOutVariant: ps.filter((p) => p.variants.some((v) => !v.available)).length,
      multiImage: ps.filter((p) => p.images.length > 1).length,
      noImage: ps.filter((p) => p.images.length === 0).length,
      vendors: [...new Set(ps.map((p) => p.vendor))],
      types: [...new Set(ps.map((p) => p.product_type))],
      maxTitleChars: Math.max(...ps.map((p) => p.title.length)),
      optionNames: [...new Set(ps.flatMap((p) => p.options.map((x) => x.name)))],
      collections: c.collections.map((x) => x.handle + ':' + x.products_count),
      distinctImageFiles: new Set(ps.flatMap((p) => p.images.map((i) => i.src.split('/').pop().split('?')[0]))).size,
      imageFiles: [...new Set(ps.flatMap((p) => p.images.map((i) => i.src.split('/').pop().split('?')[0])))].slice(0, 30),
    };
  });
  o.nav = await page.evaluate(() => ({ header: [...new Set([...document.querySelectorAll('.desktop-nav__link, .mobile-nav__link')].map((a) => a.textContent.trim() + '→' + a.getAttribute('href')))], megaMenus: document.querySelectorAll('.mega-menu, [class*="mega-menu"]').length, footerLinks: [...document.querySelectorAll('.site-footer a')].map((a) => a.textContent.trim() + '→' + (a.getAttribute('href') || '').slice(0, 40)), localizationForms: document.querySelectorAll('localization-form').length, cartNote: !!document.querySelector('textarea[name="note"]') }));
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-07-parity-catalog.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
