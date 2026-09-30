// ¿El tema publicado en cada demo es el mismo código que el ZIP / repositorio (HEAD 1779ec2)?
// Compara marcadores de JS/CSS servidos y la salida HTML de piezas cuyo Liquid cambió o no cambió.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const out = {};
const browser = await launch();
for (const [name, store] of Object.entries(STORES)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  await page.goto(store.url + '/collections/all', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const o = (out[name] = {});
  o.theme = await page.evaluate(() => ({ id: Shopify.theme.id, name: Shopify.theme.name, role: Shopify.theme.role }));
  o.firstCards = await page.evaluate(() => [...document.querySelectorAll('main .product-card__image--primary')].slice(0, 5).map((i) => i.outerHTML.replace(/src(set)?="[^"]*"/g, '').replace(/\s+/g, ' ').slice(0, 170)));
  const assets = await page.evaluate(() => [...document.querySelectorAll('script[src], link[rel="stylesheet"]')].map((n) => n.src || n.href).filter((u) => /\/assets\/(theme\.js|base\.css)/.test(u)));
  o.assets = {};
  for (const u of assets) {
    const body = await page.evaluate(async (x) => (await fetch(x)).text(), u);
    const f = u.split('?')[0].split('/').pop();
    o.assets[f] = { bytes: body.length, pageswap: body.includes('pageswap'), effectiveMax: body.includes('effectiveMax'), margin200: /rootMargin:\s*["']0px 0px 200% 0px["']/.test(body), twoToneZoom: /inset 0 0 0 7px/.test(body), hotspotFocus: /lookbook-hotspot__trigger:focus-visible/.test(body), marqueeWrap: /overflow-wrap:\s*anywhere/.test(body) };
  }
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  o.lookbookLabel = await page.evaluate(() => document.querySelector('.lookbook-hotspot__trigger')?.getAttribute('aria-label') || null);
  o.lookbookModal = await page.evaluate(() => document.querySelector('.lookbook-popover')?.getAttribute('aria-modal') || null);
  o.featuredImg = await page.evaluate(() => { const i = document.querySelector('[id$="__featured_product"] img'); return i ? i.getAttribute('loading') + '/' + i.getAttribute('fetchpriority') : null; });
  await page.goto(store.url + '/password', { waitUntil: 'load' });
  o.passwordTitle = await page.title();
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-24-deploy-parity.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
