// LEAD-001 (copia de AUDIT-FINAL-003/21, B-03 tras el push): Agente 4 (comercio adversarial): piezas únicas de Archive, tallas de Atelier, tope de cantidad frente a
// stock real (regresión posible del parche T-09), fuga de stock en el JSON del producto destacado y
// Quick Buy desde la colección. Cada mutación de carrito se compara contra /cart.js y el carrito se vacía.
import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../harness-AUDIT-FINAL-003/lib.mjs';

const QTY = () => { const m = document.querySelector('main [id$="__main"]'); const i = m.querySelector('[data-quantity-input]'); const inc = m.querySelector('[data-quantity-button="increase"]'); const inv = m.querySelector('product-inventory'); return { value: i.value, min: i.getAttribute('min'), max: i.getAttribute('max'), valid: i.checkValidity(), validation: i.validationMessage.slice(0, 70), incDisabled: inc ? inc.disabled : null, inventory: inv ? inv.dataset.stockState + ':' + (inv.querySelector('.product-inventory__message')?.textContent.trim() || '') : null, lineTotal: m.querySelector('[data-line-total]')?.textContent.replace(/\s+/g, ' ').trim() || null }; };
const VJSON = (sel) => { const n = document.querySelector(sel); if (!n) return null; try { return JSON.parse(n.textContent).map((v) => ({ id: String(v.id), title: v.title, available: v.available, inventory_management: v.inventory_management, inventory_policy: v.inventory_policy, inventory_quantity: v.inventory_quantity, quantity_max: v.quantity_max })); } catch (e) { return 'json-error ' + e.message; } };
const CART = async () => { const c = await (await fetch('/cart.js', { cache: 'no-store' })).json(); const p = document.querySelector('.cart-drawer__panel'); return { api: { count: c.item_count, total: c.total_price, lines: c.items.map((i) => i.handle + (i.variant_title ? '[' + i.variant_title + ']' : '') + '×' + i.quantity) }, dom: { lines: [...p.querySelectorAll('[data-cart-item-key]')].map((n) => n.querySelector('[data-cart-quantity]')?.value), subtotal: p.querySelector('.cart-summary__subtotal strong')?.textContent.trim() || null, badge: document.querySelector('.site-header__cart-count')?.textContent.trim(), status: p.querySelector('[data-cart-status]')?.hidden ? null : p.querySelector('[data-cart-status]')?.textContent.trim(), error: p.querySelector('[data-cart-error]')?.hidden ? null : p.querySelector('[data-cart-error]')?.textContent.trim() } }; };
const money = (cents) => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 });

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const o = (out[name] = { pdp: {} });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  const logs = []; attachConsole(page, logs);
  const clear = () => page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await clear();
  const products = name === 'atelier' ? ['nove-blazer', 'pleated-wide-trouser', 'serra-coat', 'silk-charmeuse-blouse'] : store.products;

  for (const h of products) {
    await page.goto(store.url + '/products/' + h, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const r = (o.pdp[h] = {});
    r.variantJson = await page.evaluate(VJSON, 'main [data-variant-json]');
    r.js = await page.evaluate(async (hh) => { const p = await (await fetch('/products/' + hh + '.js')).json(); return { options: p.options.map((x) => x.name + ':' + x.values.join('/')), variants: p.variants.map((v) => ({ id: String(v.id), title: v.title, sku: v.sku, price: v.price, available: v.available })) }; }, h);
    r.skuShown = await page.evaluate(() => { const n = document.querySelector('main [data-sku], main .product__sku, main [class*="sku"]'); return n ? n.textContent.trim() : null; });
    r.initial = await page.evaluate(QTY);
    // + hasta que se deshabilite (máx. 30 clics)
    const inc = page.locator('main [id$="__main"] [data-quantity-button="increase"]').first();
    let clicks = 0;
    for (; clicks < 30; clicks++) { if (await inc.isDisabled()) break; await inc.click(); await page.waitForTimeout(40); }
    r.afterPlus = { clicks, ...(await page.evaluate(QTY)) };
    // Escribir una cantidad mayor que el tope
    const qi = page.locator('main [id$="__main"] [data-quantity-input]').first();
    await qi.fill('10'); await page.keyboard.press('Tab'); await page.waitForTimeout(200);
    r.typed10 = await page.evaluate(QTY);
    // Stock vendible real: intento directo por la API de carrito (se vacía después)
    const vid = r.js.variants[0].id;
    r.realStockProbe = await page.evaluate(async (id) => { const res = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: [{ id: Number(id), quantity: 50 }] }) }); const body = await res.json().catch(() => ({})); const c = await (await fetch('/cart.js')).json(); return { status: res.status, description: body.description || null, inCart: c.item_count }; }, vid);
    await clear();
    // Cambio de talla / variante: id, precio, disponibilidad, URL, región viva
    const inputs = await page.locator('main [id$="__main"] .variant-picker__input').all();
    r.changes = [];
    await page.goto(store.url + '/products/' + h, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    for (const input of await page.locator('main [id$="__main"] .variant-picker__input').all()) {
      if (await input.isChecked()) continue;
      const id = await input.getAttribute('id'); const value = await input.getAttribute('value');
      const disabled = await input.isDisabled();
      await page.locator(`label[for="${id}"]`).first().click().catch(() => {});
      await page.waitForTimeout(450);
      const st = await page.evaluate(() => { const m = document.querySelector('main [id$="__main"]'); const atc = m.querySelector('.product-form__submit'); return { url: location.search, id: m.querySelector('form[action*="/cart/add"] [name="id"]')?.value, price: [...m.querySelectorAll('.price *')].filter((n) => n.children.length === 0 && n.offsetParent && n.textContent.trim() && !n.closest('.visually-hidden')).map((n) => n.textContent.trim()).join(' | '), atc: atc.textContent.replace(/\s+/g, ' ').trim() + (atc.disabled ? ' (off)' : ''), live: m.querySelector('[data-variant-status]')?.textContent.trim(), selected: [...m.querySelectorAll('[data-selected-option]')].map((n) => n.textContent.trim()).join(' / '), max: m.querySelector('[data-quantity-input]').getAttribute('max') }; });
      const expect = r.js.variants.find((v) => v.id === st.id);
      r.changes.push({ value, disabled, ...st, expected: expect ? expect.title + ' ' + money(expect.price) + (expect.available ? '' : ' AGOTADA') + ' sku=' + (expect.sku || '∅') : 'SIN VARIANTE' });
      if (r.changes.length >= 8) break;
    }
    // Añadir con la cantidad máxima permitida por la UI y comparar drawer vs /cart.js
    await page.goto(store.url + '/products/' + h, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.locator('main [id$="__main"] [data-quantity-input]').first().fill('2');
    await page.keyboard.press('Tab');
    const reqs = [];
    const onReq = (q) => { if (q.method() === 'POST' && /cart\/add/.test(q.url())) reqs.push(q.url().split('?')[0].split('/').pop()); };
    page.on('request', onReq);
    await page.locator('main [id$="__main"] .product-form__submit').first().click();
    await page.waitForTimeout(2600);
    page.off('request', onReq);
    r.add2 = { qtyField: await page.evaluate(QTY), addRequests: reqs, cart: await page.evaluate(CART) };
    await page.keyboard.press('Escape');
    await clear();
  }

  // Producto destacado de la home: ¿el JSON publica el stock exacto?
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  o.featuredJson = await page.evaluate(VJSON, '[id$="__featured_product"] [data-variant-json]');
  o.featuredQty = await page.evaluate(() => { const s = document.querySelector('[id$="__featured_product"]'); const i = s && s.querySelector('[data-quantity-input]'); return i ? { max: i.getAttribute('max'), value: i.value } : null; });

  // Bundle / cápsula
  try {
    await page.goto(store.url + '/', { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const bundle = page.locator('.complete-the-look__submit:visible').first();
    if (await bundle.count()) {
      o.bundlePre = await page.evaluate(() => { const s = document.querySelector('complete-the-look'); return { btn: s.querySelector('.complete-the-look__submit').textContent.replace(/\s+/g, ' ').trim(), items: [...s.querySelectorAll('[data-bundle-item]')].map((i) => ({ title: i.querySelector('a:not([aria-hidden])')?.textContent.trim(), checked: i.querySelector('[data-bundle-select]')?.checked, select: i.querySelector('select') ? [...i.querySelector('select').options].map((op) => op.textContent.trim() + (op.disabled ? '(off)' : '')).join('/') : null, fallback: i.hasAttribute('data-product-page-fallback') })) }; });
      await bundle.scrollIntoViewIfNeeded(); await bundle.click(); await page.waitForTimeout(3500);
      o.bundle = await page.evaluate(CART);
      await page.keyboard.press('Escape'); await clear();
    } else o.bundle = 'sin cápsula visible en esta home';
  } catch (e) { o.bundle = 'ERROR ' + String(e.message).split(String.fromCharCode(10))[0]; }

  // Quick Buy desde la colección
  await page.goto(store.url + '/collections/all', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  o.quickBuy = [];
  const modes = await page.evaluate(() => [...document.querySelectorAll('product-card-variants')].map((c) => c.dataset.quickBuyMode).reduce((a, m) => ((a[m] = (a[m] || 0) + 1), a), {}));
  o.quickBuyModes = modes;
  for (const mode of ['picker', 'single', 'direct']) {
    const card = page.locator(`product-card-variants[data-quick-buy-mode="${mode}"]`).first();
    if (!(await card.count())) continue;
    // product-card-variants usa display: contents (sin caja propia): se desplaza hasta su botón.
    await card.locator('[data-quick-buy-trigger], button[name="add"]').first().scrollIntoViewIfNeeded().catch(() => {});
    const title = await card.evaluate((c) => c.closest('article')?.querySelector('.product-card__title')?.textContent.trim());
    let step = {};
    if (mode === 'picker') {
      const trig = card.locator('[data-quick-buy-trigger]');
      await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
      step.opened = await card.evaluate((c) => { const p = c.querySelector('[data-quick-buy-panel]'); const t = c.querySelector('[data-quick-buy-trigger]'); return { panelVisible: !!p && !p.hidden && getComputedStyle(p).display !== 'none', expanded: t.getAttribute('aria-expanded'), focusInPanel: p ? p.contains(document.activeElement) : false, values: [...c.querySelectorAll('.quick-buy__value')].map((b) => b.dataset.optionValue + (b.disabled ? '(off)' : '')) }; });
      const val = card.locator('.quick-buy__value:not([disabled])').first();
      step.chosen = await val.getAttribute('data-option-value');
      await val.click();
    } else {
      await card.locator('button[name="add"]').first().click();
    }
    await page.waitForTimeout(2800);
    step.cart = await page.evaluate(CART);
    step.focus = await page.evaluate(() => { const a = document.activeElement; return a.localName + '.' + String(a.className).split(/\s+/)[0] + '|' + (a.getAttribute('aria-label') || a.textContent.trim()).slice(0, 40); });
    o.quickBuy.push({ mode, title, ...step });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await clear();
    await page.goto(store.url + '/collections/all', { waitUntil: 'load' });
    await page.waitForTimeout(800);
  }
  o.console = logs.filter((l) => l.type !== 'warning').map((l) => l.type + ': ' + l.text.slice(0, 110));
  await clear();
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-21-commerce-edge' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const [s, o] of Object.entries(out)) {
  console.log(`\n## ${s}`);
  for (const [h, r] of Object.entries(o.pdp)) {
    const v0 = Array.isArray(r.variantJson) ? r.variantJson[0] : r.variantJson;
    console.log(` PDP ${h}: opciones=${JSON.stringify(r.js.options)} variantes=${r.js.variants.length} skuVisible=${r.skuShown}`);
    console.log(`   JSON variante[0]: ${JSON.stringify(v0)}`);
    console.log(`   inicial ${JSON.stringify(r.initial)}`);
    console.log(`   + ×${r.afterPlus.clicks} → value=${r.afterPlus.value} max=${r.afterPlus.max} incOff=${r.afterPlus.incDisabled} total="${r.afterPlus.lineTotal}"`);
    console.log(`   teclear 10 → value=${r.typed10.value} valid=${r.typed10.valid} "${r.typed10.validation}"`);
    console.log(`   stock vendible real (pedir 50 por API): status=${r.realStockProbe.status} "${r.realStockProbe.description}" en carrito=${r.realStockProbe.inCart}`);
    for (const c of r.changes) console.log(`   → ${c.value}${c.disabled ? ' (input off)' : ''}: url=${c.url} id=${c.id} (${c.expected}) precio="${c.price}" atc="${c.atc}" max=${c.max} sel="${c.selected}" live="${c.live}"`);
    console.log(`   añadir con cantidad 2: campo=${JSON.stringify(r.add2.qtyField)} peticiones=${r.add2.addRequests.length} carrito=${JSON.stringify(r.add2.cart)}`);
  }
  console.log(' featured JSON:', JSON.stringify(o.featuredJson), 'featured qty:', JSON.stringify(o.featuredQty));
  console.log(' bundle pre:', JSON.stringify(o.bundlePre));
  console.log(' bundle:', JSON.stringify(o.bundle));
  console.log(' quick buy modos:', JSON.stringify(o.quickBuyModes));
  for (const q of o.quickBuy) console.log(`  quick buy [${q.mode}] "${q.title}": ${JSON.stringify(q.opened || {})} elegido=${q.chosen || '-'} carrito=${JSON.stringify(q.cart)} foco=${q.focus}`);
  console.log(' consola:', JSON.stringify(o.console.slice(0, 6)));
}
