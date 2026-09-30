// Agente 1 (Theme Store compliance): URLs de documentación/soporte (con y sin sesión), checkout con
// pasarela de prueba hasta "Pay now" SIN pagar, marcas ajenas e idioma del catálogo, políticas y
// enlace de Shopify. Solo lectura: no se envía ningún formulario de pago ni se crea ningún pedido.
import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from './lib.mjs';

const ROOT = new URL('../../../', import.meta.url);
const schema = JSON.parse(fs.readFileSync(new URL('config/settings_schema.json', ROOT), 'utf8'));
const info = schema.find((x) => x.name === 'theme_info');
const DOC_URLS = { documentation: info.theme_documentation_url, support: info.theme_support_url };
fs.mkdirSync(new URL('./evidence/', import.meta.url), { recursive: true });
const file = (n) => new URL('./evidence/' + n, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/%20/g, ' ');

const BRANDS = /\b(gucci|herm[eè]s|chanel|louis\s*vuitton|prada|dior|fendi|burberry|balenciaga|versace|cartier|rolex|bottega\s*veneta|c[eé]line|givenchy|valentino|saint\s*laurent|ysl|armani|loro\s*piana|brunello\s*cucinelli|zegna|tom\s*ford|miu\s*miu|loewe|moncler|max\s*mara|nike|adidas|montblanc|tiffany|bulgari|chlo[eé]|jil\s*sander|the\s*row|acne\s*studios|maison\s*margiela|comme\s*des\s*gar[cç]ons|yohji|issey\s*miyake|patek|omega|apple|coach|kate\s*spade|michael\s*kors|ralph\s*lauren|polo)\b/i;
const ES = /\b(el|la|los|las|del|con|para|una|unos|piel|lana|seda|algod[oó]n|hecho|hecha|mano|dise[nñ]o|talla|tallas|bolso|cuero|forro|botones|cuello|manga|mangas|largo|corte|tejido|lavar|seco|confecci[oó]n|pieza|colecci[oó]n)\b/gi;
const EN = /\b(the|and|with|for|made|hand|wool|silk|cotton|leather|lined|buttons|collar|sleeve|length|cut|fabric|dry|clean|piece|collection|in|of|a)\b/gi;
const strip = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

const out = { docUrls: DOC_URLS, stores: {} };
const browser = await launch();

// 1) Documentación y soporte SIN sesión (lo que ve un comerciante o el revisor desde el formulario de envío).
{
  const context = await browser.newContext();
  const page = await context.newPage();
  out.publicAccess = {};
  for (const [k, url] of Object.entries(DOC_URLS)) {
    const chain = [];
    page.on('response', (r) => { if (r.request().isNavigationRequest()) chain.push(r.status() + ' ' + r.url().split('?')[0]); });
    const resp = await page.goto(url, { waitUntil: 'load' }).catch((e) => null);
    await page.waitForTimeout(800);
    out.publicAccess[k] = { requested: url, finalUrl: page.url().split('?')[0], finalStatus: resp ? resp.status() : null, chain: [...new Set(chain)], title: await page.title(), text: (await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 160))) };
    page.removeAllListeners('response');
  }
  await context.close();
}

for (const [name, store] of Object.entries(STORES)) {
  const o = (out.stores[name] = {});
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  const logs = [];
  attachConsole(page, logs);

  // 2) Documentación y soporte CON sesión (si viven en esta tienda).
  o.docPages = {};
  for (const [k, url] of Object.entries(DOC_URLS)) {
    const path = new URL(url).pathname;
    const resp = await page.goto(store.url + path, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    o.docPages[k] = await page.evaluate(() => { const m = document.querySelector('main') || document.body; const txt = m.innerText.replace(/\s+/g, ' ').trim(); return { title: document.title, h1: [...m.querySelectorAll('h1')].map((h) => h.textContent.trim()), headings: [...m.querySelectorAll('h2,h3')].map((h) => h.textContent.trim().slice(0, 50)).slice(0, 14), words: txt.split(' ').length, forms: [...m.querySelectorAll('form')].map((f) => (f.getAttribute('action') || '') + ' [' + [...f.querySelectorAll('input,textarea,select')].map((i) => i.name || i.type).filter(Boolean).join(',') + ']'), sample: txt.slice(0, 220), template: document.body.className }; });
    o.docPages[k].status = resp.status();
  }

  // 3) Políticas y pie.
  o.policies = {};
  for (const p of ['privacy-policy', 'refund-policy', 'shipping-policy', 'terms-of-service', 'contact-information']) {
    const r = await page.goto(store.url + '/policies/' + p, { waitUntil: 'domcontentloaded' });
    o.policies[p] = { status: r.status(), title: (await page.title()).slice(0, 60) };
  }
  await page.goto(store.url + '/', { waitUntil: 'load' });
  o.footer = await page.evaluate(() => ({ links: [...document.querySelectorAll('.site-footer a')].map((a) => a.textContent.trim() + '→' + (a.getAttribute('href') || '').slice(0, 50) + (a.rel ? ' rel=' + a.rel : '')), headerNav: [...new Set([...document.querySelectorAll('.desktop-nav__link')].map((a) => a.textContent.trim()))], currency: window.Shopify && Shopify.currency ? Shopify.currency.active : null, locale: document.documentElement.lang }));

  // 4) Catálogo: marcas ajenas, idioma y moneda.
  o.catalog = await page.evaluate(async () => {
    const ps = (await (await fetch('/products.json?limit=250')).json()).products;
    const cs = (await (await fetch('/collections.json?limit=250')).json()).collections;
    return { products: ps.map((p) => ({ h: p.handle, title: p.title, vendor: p.vendor, type: p.product_type, tags: p.tags, body: p.body_html, images: p.images.map((i) => i.src.split('/').pop().split('?')[0]), alts: p.images.map((i) => i.alt), options: p.options.map((x) => x.name + ':' + x.values.join('/')), variants: p.variants.length, prices: [...new Set(p.variants.map((v) => v.price))] })), collections: cs.map((c) => ({ h: c.handle, title: c.title, body: c.body_html })) };
  });
  const brandHits = [];
  const langRows = [];
  for (const p of o.catalog.products) {
    const hay = [p.title, p.vendor, p.type, (p.tags || []).join(' '), strip(p.body), p.images.join(' '), p.alts.join(' ')].join(' | ');
    const m = hay.match(BRANDS);
    if (m) brandHits.push({ product: p.h, match: m[0], context: hay.slice(Math.max(0, hay.search(BRANDS) - 40), hay.search(BRANDS) + 40) });
    const body = strip(p.body);
    const es = (body.match(ES) || []).length, en = (body.match(EN) || []).length;
    langRows.push({ product: p.h, words: body.split(' ').length, es, en, spanishLikely: es > 3 && es > en * 0.5 });
  }
  for (const c of o.catalog.collections) { const hay = c.title + ' ' + strip(c.body); const m = hay.match(BRANDS); if (m) brandHits.push({ collection: c.h, match: m[0] }); const es = (strip(c.body).match(ES) || []).length; if (es > 3) langRows.push({ collection: c.h, es, spanishLikely: true }); }
  o.brandHits = brandHits;
  o.spanish = langRows.filter((r) => r.spanishLikely);
  o.emptyDescriptions = langRows.filter((r) => r.words !== undefined && r.words < 8).map((r) => r.product);
  o.catalogSummary = { products: o.catalog.products.length, multiVariant: o.catalog.products.filter((p) => p.variants > 1).length, options: [...new Set(o.catalog.products.flatMap((p) => p.options.map((x) => x.split(':')[0])))], imageFiles: [...new Set(o.catalog.products.flatMap((p) => p.images))] };
  delete o.catalog; // el catálogo completo no hace falta en el resultado, solo lo derivado

  // 5) Checkout hasta "Pay now" (sin rellenar ni pagar).
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.locator('main [id$="__main"] .product-form__submit').first().click();
  await page.waitForTimeout(2500);
  const co = page.locator('.cart-drawer__panel button[name="checkout"]').first();
  await Promise.all([page.waitForURL(/checkouts/, { timeout: 40000 }).catch(() => {}), co.click()]);
  await page.waitForLoadState('load').catch(() => {});
  await page.waitForTimeout(7000);
  o.checkout = await page.evaluate(() => {
    const txt = document.body.innerText.replace(/\s+/g, ' ');
    const payBtn = [...document.querySelectorAll('button')].find((b) => /pay now|complete order|place order|pagar/i.test(b.textContent));
    return {
      reached: /checkouts/.test(location.pathname),
      cantAcceptPayments: /can.t accept payments|cannot accept payments|isn.t accepting payments/i.test(txt),
      paymentErrors: (txt.match(/[^.]{0,60}(payment|gateway)[^.]{0,60}(error|unavailable|not available|can.t)[^.]{0,40}/gi) || []).slice(0, 3),
      bogus: /bogus|\(for testing\)|test gateway|test mode/i.test(txt),
      payNow: payBtn ? { text: payBtn.textContent.trim(), disabled: payBtn.disabled || payBtn.getAttribute('aria-disabled') === 'true' } : null,
      paymentSectionText: (() => { const m = txt.match(/Payment.{0,260}/i); return m ? m[0].slice(0, 260) : null; })(),
      currency: (txt.match(/\b(USD|EUR|GBP|CAD)\b/) || [])[0] || null,
    };
  });
  await page.screenshot({ path: file(`${name}-checkout-1440.jpg`), type: 'jpeg', quality: 55, fullPage: true }).catch(() => {});
  await page.goto(store.url + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  o.pageErrors = logs.filter((l) => l.type === 'pageerror').map((l) => l.text.slice(0, 120) + ' @' + l.url.replace(store.url, '').replace(/checkouts\/.*/, 'checkouts/<token>'));
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-20-compliance.json', import.meta.url), JSON.stringify(out, null, 1));
console.log('URLs declaradas:', JSON.stringify(out.docUrls));
console.log('Acceso público (sin sesión):', JSON.stringify(out.publicAccess, null, 1));
for (const [s, o] of Object.entries(out.stores)) {
  console.log(`\n## ${s}`);
  for (const [k, d] of Object.entries(o.docPages)) console.log(`  ${k}: ${d.status} "${d.title}" h1=${JSON.stringify(d.h1)} palabras=${d.words} formularios=${JSON.stringify(d.forms)} secciones=${JSON.stringify(d.headings)}`);
  console.log('  políticas:', JSON.stringify(o.policies));
  console.log('  pie:', JSON.stringify(o.footer));
  console.log('  catálogo:', JSON.stringify({ ...o.catalogSummary, imageFiles: o.catalogSummary.imageFiles.length }), 'marcas:', JSON.stringify(o.brandHits), 'español:', JSON.stringify(o.spanish), 'sin descripción:', JSON.stringify(o.emptyDescriptions));
  console.log('  checkout:', JSON.stringify(o.checkout));
  console.log('  pageerrors:', JSON.stringify(o.pageErrors));
}
