// Eje 2: resiliencia de textos (título/proveedor/enlaces muy largos) y reflow a 320 px.
// Las tiendas demo no tienen catálogo hostil, así que el texto largo se inyecta en el DOM servido
// (no se crea ni se modifica ningún producto). Mide desbordamiento del documento, recorte y solapes.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const LONG = 'Double-Faced Cashmere and Virgin Wool Blend Unstructured Longline Overcoat with Hand-Finished Horn Buttons and Detachable Shearling Collar — Édition Limitée';
const TOKEN = 'Donaudampfschifffahrtsgesellschaftskapitänsmützenabzeichenhersteller-Hochleistungswollmantel';
const VENDOR = 'Maison de Couture Internationale des Ateliers Réunis de Paris, Milano & Kyoto Société Anonyme';

const INJECT = ({ targets, LONG, TOKEN, VENDOR }) => {
  const d = (el) => el.localName + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const de = document.documentElement;
  const res = [];
  for (const t of targets) {
    const els = [...document.querySelectorAll(t.sel)].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).slice(0, t.max || 2);
    for (const el of els) {
      const leaf = [...el.querySelectorAll('*')].reverse().find((n) => n.children.length === 0 && n.textContent.trim()) || el;
      const target = el.children.length === 0 ? el : leaf;
      for (const [kind, text] of [['largo', t.vendor ? VENDOR : LONG], ['sin-espacios', TOKEN]]) {
        const original = target.textContent;
        const before = { docSW: de.scrollWidth };
        target.textContent = text;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const parent = el.parentElement.getBoundingClientRect();
        // Solape con el hermano siguiente visible.
        let overlap = null;
        const sib = el.nextElementSibling;
        if (sib) { const s = sib.getBoundingClientRect(); if (s.width > 0 && s.height > 0 && r.right > s.left + 1 && r.left < s.right - 1 && r.bottom > s.top + 1 && r.top < s.bottom - 1) overlap = d(sib); }
        res.push({
          target: t.name, el: d(el), kind,
          docOverflow: de.scrollWidth - de.clientWidth,
          clippedX: el.scrollWidth > el.clientWidth + 1 ? el.scrollWidth - el.clientWidth : 0,
          clippedY: el.scrollHeight > el.clientHeight + 1 && cs.overflowY !== 'visible' ? el.scrollHeight - el.clientHeight : 0,
          overflowsParent: Math.max(0, Math.round(r.right - parent.right)),
          outOfViewport: Math.max(0, Math.round(r.right - de.clientWidth)),
          lines: Math.round(r.height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2)),
          h: Math.round(r.height), overflowWrap: cs.overflowWrap, wordBreak: cs.wordBreak, hyphens: cs.hyphens, textOverflow: cs.textOverflow, whiteSpace: cs.whiteSpace, lineClamp: cs.webkitLineClamp,
          overlap,
        });
        target.textContent = original;
      }
    }
    if (els.length === 0) res.push({ target: t.name, missing: true });
  }
  return res;
};

const PAGES = (store) => [
  { path: '/products/' + store.products[0], targets: [
    { name: 'PDP título (h1)', sel: 'main h1' },
    { name: 'PDP proveedor', sel: 'main [id$="__main"] .eyebrow, main [id$="__main"] .product__vendor', vendor: true, max: 1 },
    { name: 'PDP etiqueta de opción', sel: 'main .variant-picker__label', max: 1 },
    { name: 'PDP acordeón summary', sel: 'main .product-details__summary', max: 1 },
    { name: 'Tarjeta recomendada título', sel: 'product-recommendations .product-card__title, product-recommendations .product-card h3', max: 1 },
  ] },
  { path: '/collections/all', targets: [
    { name: 'Colección título (h1)', sel: 'main h1' },
    { name: 'Tarjeta título', sel: '.product-card__title, .product-card h3', max: 2 },
    { name: 'Tarjeta proveedor', sel: '.product-card__vendor', vendor: true, max: 1 },
  ] },
  { path: '/', targets: [
    { name: 'Header marca', sel: '.site-header__brand', max: 1 },
    { name: 'Header enlace nav', sel: '.desktop-nav__link', max: 1 },
    { name: 'Barra de anuncios', sel: '.announcement-bar__link, .announcement-bar__text', max: 1 },
    { name: 'Hero título', sel: '.hero-editorial__heading', max: 1 },
    { name: 'Hero botón', sel: '.hero-editorial__button', max: 1 },
    { name: 'Showcase spotlight título', sel: '.curated-showcase__spotlight-title', max: 1 },
    { name: 'Featured product título', sel: '[id$="__featured_product"] h2, [id$="__featured_product"] h3', max: 1 },
    { name: 'Bundle item título', sel: '.complete-the-look__item a:not([aria-hidden])', max: 1 },
    { name: 'Footer enlace', sel: '.site-footer a', max: 1 },
  ] },
];

const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '320', width: 320, height: 640 }, { n: '375', width: 375, height: 667 }, { n: '768', width: 768, height: 1024 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    await unlock(context, store.url);
    const page = await context.newPage();
    for (const pg of PAGES(store)) {
      const resp = await page.goto(store.url + pg.path, { waitUntil: 'load', timeout: 60000 });
      if (resp.status() >= 400) { out.push({ store: name, vp: vp.n, path: pg.path, error: resp.status() }); await page.waitForTimeout(30000); continue; }
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(500);
      const base = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      if (vp.n === '320') { out.push({ store: name, vp: vp.n, path: pg.path, reflow320: base.sw - base.cw }); continue; }
      const r = await page.evaluate(INJECT, { targets: pg.targets, LONG, TOKEN, VENDOR });
      for (const x of r) out.push({ store: name, vp: vp.n, path: pg.path, ...x });
    }
    // Carrito con artículo: título largo dentro del drawer.
    if (vp.n !== '320') {
      await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
      await page.locator('.product-form__submit').first().click().catch(() => {});
      await page.waitForTimeout(2500);
      const r = await page.evaluate(INJECT, { targets: [{ name: 'Drawer título de línea', sel: '.cart-drawer__panel [data-cart-item-key] a:not([aria-hidden])', max: 1 }, { name: 'Drawer opciones de línea', sel: '.cart-drawer__panel [data-cart-item-key] dl, .cart-drawer__panel .cart-drawer-item__variant, .cart-drawer__panel [data-cart-item-key] p', max: 1 }], LONG, TOKEN, VENDOR });
      for (const x of r) out.push({ store: name, vp: vp.n, path: 'drawer', ...x });
      await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
    }
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-05-resilience' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) {
  if (r.error) console.log(r.store, r.vp, r.path, 'ERROR', r.error);
  else if (r.reflow320 !== undefined) console.log(`${r.store.padEnd(8)} 320  ${r.path.padEnd(34)} reflow overflow=${r.reflow320}`);
  else if (r.missing) console.log(`${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.path.padEnd(34).slice(0, 34)} ${r.target.padEnd(28)} (elemento no presente)`);
  else console.log(`${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.path.padEnd(34).slice(0, 34)} ${r.target.padEnd(28)} ${r.kind.padEnd(12)} doc=${r.docOverflow} clipX=${r.clippedX} clipY=${r.clippedY} >parent=${r.overflowsParent} >vw=${r.outOfViewport} líneas=${r.lines} h=${r.h} wrap=${r.overflowWrap}/${r.wordBreak}/${r.hyphens} clamp=${r.lineClamp} ellipsis=${r.textOverflow}/${r.whiteSpace} ${r.overlap ? 'SOLAPA ' + r.overlap : ''} ${(r.docOverflow > 0 || r.clippedX > 0 || r.overflowsParent > 1 || r.outOfViewport > 0 || r.overlap) ? '<<< FLAG' : ''}`);
}
