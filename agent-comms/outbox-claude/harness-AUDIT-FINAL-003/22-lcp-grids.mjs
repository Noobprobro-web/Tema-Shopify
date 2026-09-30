// Agente 2 (P-04 y P-06): atributos de carga de la imagen LCP y de las primeras tarjetas en home,
// colección, lista de colecciones, búsqueda y 404, a 375 / 768 / 1440 px.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const INIT = () => { window.__lcp = null; try { new PerformanceObserver((l) => { const e = l.getEntries().pop(); const n = e.element; window.__lcp = { t: Math.round(e.startTime), el: n ? n.localName + '.' + String(n.className).trim().split(/\s+/).slice(0, 2).join('.') : null, loading: n?.getAttribute?.('loading') ?? null, fp: n?.getAttribute?.('fetchpriority') ?? null, src: (e.url || '').split('?')[0].split('/').pop() }; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch (e) {} };
const CARDS = () => [...document.querySelectorAll('main .product-card__image--primary, main .collection-directory__image')].slice(0, 6).map((i) => { const r = i.getBoundingClientRect(); return { loading: i.getAttribute('loading'), fp: i.getAttribute('fetchpriority'), aboveFold: r.top < innerHeight && r.bottom > 0, top: Math.round(r.top + scrollY) }; });
const FEATURED = () => { const s = document.querySelector('[id$="__featured_product"]'); const i = s && s.querySelector('img'); return i ? { loading: i.getAttribute('loading'), fp: i.getAttribute('fetchpriority'), top: Math.round(i.getBoundingClientRect().top + scrollY) } : null; };

const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '768', width: 768, height: 1024 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await context.addInitScript(INIT);
    await unlock(context, store.url);
    const page = await context.newPage();
    for (const p of ['/', '/collections/all', '/collections', '/search?q=a', '/pages/no-existe-404']) {
      await page.goto(store.url + p, { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      out.push({ store: name, vp: vp.n, path: p, lcp: await page.evaluate(() => window.__lcp), cards: await page.evaluate(CARDS), featured: p === '/' ? await page.evaluate(FEATURED) : undefined });
    }
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-22-lcp-grids' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) console.log(`${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.path.padEnd(22)} LCP=${r.lcp ? r.lcp.el + ' ld=' + r.lcp.loading + ' fp=' + r.lcp.fp : '-'} | primeras tarjetas: ${r.cards.map((c) => (c.loading || '-') + '/' + (c.fp || '-') + (c.aboveFold ? '*' : '')).join(' ')}${r.featured ? ' | destacado: ' + r.featured.loading + '/' + r.featured.fp + '@' + r.featured.top : ''}`);
