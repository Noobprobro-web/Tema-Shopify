// Eje 4: variantes, stock, cantidad, drawer de carrito, bundle, nota y checkout en las 3 tiendas.
import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from './lib.mjs';

const PDP_STATE = () => {
  const main = document.querySelector('main [id$="__main"]') || document.querySelector('main');
  const t = (sel, root = main) => { const n = root.querySelector(sel); return n ? n.textContent.replace(/\s+/g, ' ').trim() : null; };
  const vis = (n) => n && !n.hidden && !n.closest('[hidden]') && getComputedStyle(n).display !== 'none';
  const price = main.querySelector('.price');
  const inv = main.querySelector('product-inventory');
  const atc = main.querySelector('[data-add-to-cart], .product-form__submit');
  const bin = main.querySelector('.shopify-payment-button__button');
  return {
    url: location.search,
    idInput: main.querySelector('form[action*="/cart/add"] [name="id"]')?.value || null,
    checked: [...main.querySelectorAll('.variant-picker__input:checked')].map((i) => i.value),
    selectedLabels: [...main.querySelectorAll('[data-selected-option]')].map((n) => n.textContent.trim()),
    unavailable: [...main.querySelectorAll('.variant-picker__input')].filter((i) => { const l = main.querySelector(`label[for="${CSS.escape(i.id)}"]`); const u = l && l.querySelector('[data-unavailable-label]'); return (u && !u.hidden) || i.classList.contains('is-unavailable') || i.disabled; }).map((i) => i.value),
    priceVisible: price ? [...price.querySelectorAll('*')].filter((n) => n.children.length === 0 && vis(n) && n.textContent.trim() && !n.closest('.visually-hidden')).map((n) => n.textContent.trim()).join(' | ') : null,
    badges: price ? [...price.querySelectorAll('.price__badges > *')].filter(vis).map((n) => n.textContent.trim()) : null,
    inventory: inv ? { state: inv.dataset.stockState, msg: t('.product-inventory__message', inv), visible: vis(inv) } : null,
    atc: atc ? { text: atc.textContent.replace(/\s+/g, ' ').trim(), disabled: atc.disabled, ariaDisabled: atc.getAttribute('aria-disabled') } : null,
    buyNow: bin ? { disabled: bin.disabled, visible: vis(bin) } : null,
    qty: main.querySelector('[data-quantity-input]')?.value,
    lineTotal: t('[data-line-total]'),
    sticky: (() => { const s = document.querySelector('sticky-cart-bar'); return s ? { price: t('[data-sticky-price]', s), variant: t('[data-sticky-variant]', s), total: t('[data-sticky-total]', s) } : null; })(),
    liveStatus: t('[data-variant-status]'),
  };
};

const CART_STATE = async () => {
  const panel = document.querySelector('.cart-drawer__panel');
  const cart = await (await fetch('/cart.js', { cache: 'no-store' })).json();
  const t = (sel, root = panel) => { const n = root.querySelector(sel); return n ? n.textContent.replace(/\s+/g, ' ').trim() : null; };
  const a = document.activeElement;
  return {
    open: !panel.inert && panel.getAttribute('aria-hidden') !== 'true',
    api: { count: cart.item_count, total: cart.total_price, note: cart.note, items: cart.items.map((i) => ({ h: i.handle, v: i.variant_title, q: i.quantity, line: i.final_line_price })) },
    dom: {
      items: [...panel.querySelectorAll('[data-cart-item-key]')].map((n) => ({ title: t('a:not([aria-hidden])', n), qty: n.querySelector('[data-cart-quantity]')?.value, decDisabled: n.querySelector('[data-quantity-button="decrease"]')?.disabled, incDisabled: n.querySelector('[data-quantity-button="increase"]')?.disabled })),
      countLabel: t('[data-cart-drawer-count]'),
      subtotal: t('.cart-summary__subtotal strong'),
      headerBadge: document.querySelector('.site-header__cart-count')?.textContent.trim(),
      headerBadgeHidden: document.querySelector('.site-header__cart-count')?.hidden,
      headerLabel: document.querySelector('.site-header__cart')?.getAttribute('aria-label'),
      status: (() => { const n = panel.querySelector('[data-cart-status]'); return n ? { hidden: n.hidden, txt: n.textContent.trim() } : null; })(),
      error: (() => { const n = panel.querySelector('[data-cart-error]'); return n ? { hidden: n.hidden, txt: n.textContent.trim() } : null; })(),
      rewards: t('.cart-rewards__message'),
      rewardsNow: panel.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'),
      noteField: !!panel.querySelector('textarea[name="note"]'),
      empty: t('.cart-drawer__empty p'),
      checkoutBtn: !!panel.querySelector('button[name="checkout"]'),
      dynamicCheckout: !!panel.querySelector('.cart__dynamic-checkout'),
      crossSell: panel.querySelectorAll('[data-cross-sell-add]').length,
    },
    focus: a ? a.localName + '.' + String(a.className).split(/\s+/).slice(0, 2).join('.') + '|' + (a.getAttribute('aria-label') || a.textContent.trim()).slice(0, 40) : null,
    focusInPanel: panel.contains(a),
  };
};

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const o = (out[name] = { pdp: {}, steps: [] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  const logs = []; const failed = [];
  attachConsole(page, logs);
  page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(store.url, '').slice(0, 90)); });
  // networkidle no siempre llega (telemetría de Shopify); se navega con load y se da un margen acotado.
  const nav = async (p) => { for (let i = 0; i < 6; i++) { const r = await page.goto(store.url + p, { waitUntil: 'load', timeout: 60000 }).catch(() => null); const ok = r && r.status() < 400 && (await page.evaluate(() => !!document.querySelector('main')).catch(() => false)); if (ok) break; console.error('  [nav] ' + p + ' → ' + (r ? r.status() : 'sin respuesta') + ', reintento en 45 s'); await page.waitForTimeout(45000); } await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {}); await page.waitForTimeout(600); };
  const step = async (label, extra = {}) => { const s = { label, ...(await page.evaluate(CART_STATE)), ...extra }; o.steps.push(s); return s; };
  await nav('/');
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));

  // --- A. Variantes en cada PDP clave ---
  for (const handle of (process.argv.includes('--skip-pdp') ? [] : store.products)) {
    await nav('/products/' + handle);
    const json = await page.evaluate(async (h) => { let p = null; for (let i = 0; i < 6 && !p; i++) { const r = await fetch('/products/' + h + '.js'); if (r.ok && /javascript|json/.test(r.headers.get('content-type') || '')) p = await r.json(); else await new Promise((res) => setTimeout(res, 45000)); } return { options: p.options.map((x) => ({ name: x.name, values: x.values })), variants: p.variants.map((v) => ({ id: String(v.id), title: v.title, price: v.price, compare: v.compare_at_price, available: v.available, qty: v.inventory_quantity, opts: v.options })) }; }, handle);
    const rec = (o.pdp[handle] = { json, initial: await page.evaluate(PDP_STATE), changes: [] });
    const inputs = await page.locator('main [id$="__main"] .variant-picker__input').all();
    for (const input of inputs) {
      if (await input.isChecked()) continue;
      const id = await input.getAttribute('id');
      const value = await input.getAttribute('value');
      const reqs = [];
      const onReq = (r) => { if (/\/products\/|section_id|variant=/.test(r.url())) reqs.push(r.url().replace(store.url, '').slice(0, 80)); };
      page.on('request', onReq);
      const t0 = Date.now();
      await page.locator(`label[for="${id}"]`).first().click();
      // Tiempo hasta que el input oculto name=id cambia (actualización percibida).
      const before = rec.changes.at(-1)?.state.idInput || rec.initial.idInput;
      await page.waitForFunction((b) => { const m = document.querySelector('main [id$="__main"]'); const v = m.querySelector('form[action*="/cart/add"] [name="id"]')?.value; return v && v !== b; }, before, { timeout: 4000 }).catch(() => {});
      const ms = Date.now() - t0;
      await page.waitForTimeout(500);
      page.off('request', onReq);
      const state = await page.evaluate(PDP_STATE);
      const v = json.variants.find((x) => x.id === state.idInput);
      rec.changes.push({ clicked: value, ms, reqs, state, expect: v ? { title: v.title, price: v.price, available: v.available } : null });
    }
    // Teclado: flechas dentro del primer grupo de radios.
    const first = page.locator('main [id$="__main"] .variant-picker__input').first();
    if (await first.count()) {
      await nav('/products/' + handle);
      await first.focus();
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(600);
      rec.arrowKey = await page.evaluate(PDP_STATE);
      rec.arrowFocus = await page.evaluate(() => document.activeElement.value || document.activeElement.localName);
    }
    // Cantidad: +, +, -, y valor inválido.
    await nav('/products/' + handle);
    const inc = page.locator('main [id$="__main"] [data-quantity-button="increase"]').first();
    const q = {};
    q.start = await page.evaluate(PDP_STATE);
    await inc.click(); await inc.click(); await page.waitForTimeout(300);
    q.plus2 = await page.evaluate(PDP_STATE);
    q.incDisabled = await inc.isDisabled();
    await page.locator('main [id$="__main"] [data-quantity-button="decrease"]').first().click().catch(() => {}); await page.waitForTimeout(300);
    q.minus1 = (await page.evaluate(PDP_STATE)).qty;
    const qi = page.locator('main [id$="__main"] [data-quantity-input]').first();
    await qi.fill('0'); await qi.blur(); await page.waitForTimeout(300);
    q.zero = (await page.evaluate(PDP_STATE)).qty;
    await qi.fill('-3'); await qi.blur(); await page.waitForTimeout(300);
    q.negative = (await page.evaluate(PDP_STATE)).qty;
    q.attrs = await qi.evaluate((n) => ({ min: n.min, max: n.max, step: n.step, type: n.type, inputmode: n.inputMode, label: n.getAttribute('aria-label') || (n.labels[0] && n.labels[0].textContent.trim()) }));
    rec.quantity = { start: q.start.qty + ' / ' + q.start.lineTotal, plus2: q.plus2.qty + ' / ' + q.plus2.lineTotal, incDisabled: q.incDisabled, minus1: q.minus1, zero: q.zero, negative: q.negative, attrs: q.attrs };
  }

  // --- B. Añadir producto simple y operar el drawer ---
  const h0 = store.products[0];
  await nav('/products/' + h0);
  await page.locator('.product-form__submit').first().click();
  await page.waitForTimeout(2500);
  await step('B1 add simple (' + h0 + ')');
  const panel = page.locator('.cart-drawer__panel');
  // + una vez
  await panel.locator('[data-quantity-button="increase"]').first().click({ timeout: 5000 }).catch((e) => o.steps.push({ label: 'B2 click + falló', err: String(e.message).slice(0, 120) }));
  await page.waitForTimeout(2200);
  await step('B2 qty +1');
  // Ráfaga: 4 clics rápidos en + (mutaciones concurrentes)
  for (let i = 0; i < 4; i++) { await panel.locator('[data-quantity-button="increase"]').first().click({ timeout: 3000, force: true }).catch(() => {}); await page.waitForTimeout(60); }
  await page.waitForTimeout(4000);
  await step('B3 ráfaga 4×+ (concurrencia)');
  // Escribir una cantidad directa
  const dq = panel.locator('[data-cart-quantity]').first();
  await dq.fill('2').catch(() => {}); await dq.press('Tab').catch(() => {}); // Enter se prueba aparte (paso H): envía el formulario
  await page.waitForTimeout(2500);
  await step('B4 qty tecleada = 2');
  // Cantidad absurda (supera stock donde haya seguimiento)
  await panel.locator('[data-cart-quantity]').first().fill('999').catch(() => {}); await page.keyboard.press('Tab');
  await page.waitForTimeout(3000);
  await step('B5 qty tecleada = 999');
  // Nota de pedido
  const note = panel.locator('textarea[name="note"]');
  if (await note.count()) { await note.fill('Entrega en portería — prueba <b>QA</b> & "comillas"'); await note.blur(); await page.waitForTimeout(1800); await step('B6 nota escrita'); }
  else o.steps.push({ label: 'B6 nota: textarea ausente en el drawer (settings.show_cart_note=false en esta tienda)' });
  // Eliminar
  await panel.locator('[data-cart-remove]').first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await step('B7 remove → vacío');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);

  // --- C. Bundle (complete-the-look) en home ---
  await nav('/');
  const bundle = page.locator('.complete-the-look__submit').first();
  if (await bundle.count()) {
    const pre = await page.evaluate(() => { const s = document.querySelector('complete-the-look'); return { btn: s.querySelector('.complete-the-look__submit').textContent.replace(/\s+/g, ' ').trim(), checks: [...s.querySelectorAll('[data-bundle-select]')].map((c) => c.checked + (c.disabled ? ':disabled' : '')), summary: s.querySelector('.complete-the-look__summary-heading')?.textContent.replace(/\s+/g, ' ').trim(), labelBox: [...s.querySelectorAll('.complete-the-look__check')].map((l) => Math.round(l.getBoundingClientRect().width) + 'x' + Math.round(l.getBoundingClientRect().height)) }; });
    // Desmarcar uno y volver a marcar: total reactivo
    const chk = page.locator('[data-bundle-select]').first();
    await chk.uncheck({ force: true }); await page.waitForTimeout(400);
    const un = await page.evaluate(() => { const s = document.querySelector('complete-the-look'); return { btn: s.querySelector('.complete-the-look__submit').textContent.replace(/\s+/g, ' ').trim(), summary: s.querySelector('.complete-the-look__summary-heading')?.textContent.replace(/\s+/g, ' ').trim() }; });
    await chk.check({ force: true }); await page.waitForTimeout(400);
    await bundle.scrollIntoViewIfNeeded();
    await bundle.click();
    await page.waitForTimeout(3500);
    const st = await page.evaluate(() => ({ status: document.querySelector('[id^="BundleStatus-"]')?.textContent.trim(), error: document.querySelector('[id^="BundleError-"]')?.textContent.trim() }));
    await step('C1 bundle completo', { pre, unchecked: un, bundleMsg: st });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  } else o.steps.push({ label: 'C1 bundle: sección complete-the-look no presente en la home de este preset' });

  // --- D. Featured product en home ---
  const fp = page.locator('[id$="__featured_product"] .product-form__submit').first();
  if (await fp.count()) {
    const fpInputs = await page.locator('[id$="__featured_product"] .variant-picker__input').all();
    let changed = null;
    for (const input of fpInputs) { if (!(await input.isChecked())) { const id = await input.getAttribute('id'); const pre = await page.evaluate(() => { const s = document.querySelector('[id$="__featured_product"]'); return { id: s.querySelector('[name="id"]')?.value, price: s.querySelector('.price')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 60), url: location.search }; }); await page.locator(`label[for="${id}"]`).first().click(); await page.waitForTimeout(700); const post = await page.evaluate(() => { const s = document.querySelector('[id$="__featured_product"]'); return { id: s.querySelector('[name="id"]')?.value, price: s.querySelector('.price')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 60), url: location.search, inv: s.querySelector('.product-inventory__message')?.textContent.trim() }; }); changed = { value: await input.getAttribute('value'), pre, post }; break; } }
    await fp.scrollIntoViewIfNeeded(); await fp.click(); await page.waitForTimeout(2500);
    await step('D1 featured product → add', { variantChange: changed });
  }

  // --- E. Página /cart ---
  await nav('/cart');
  o.cartPage = await page.evaluate(() => { const m = document.querySelector('main'); return { h1: m.querySelector('h1')?.textContent.trim(), items: m.querySelectorAll('[data-cart-item-key], .cart-item').length, note: !!m.querySelector('textarea[name="note"]'), checkout: !!m.querySelector('button[name="checkout"]'), dynamic: !!m.querySelector('.cart__dynamic-checkout, .additional-checkout-buttons'), subtotal: m.querySelector('.cart-summary__subtotal strong, .cart-summary strong')?.textContent.trim() }; });

  // --- F. Checkout desde el drawer ---
  await nav('/');
  await page.locator('a.site-header__cart').first().click(); await page.waitForTimeout(900);
  const co = page.locator('.cart-drawer__panel button[name="checkout"]').first();
  if (await co.count()) {
    await Promise.all([page.waitForURL(/checkouts|checkout|password/, { timeout: 25000 }).catch(() => {}), co.click()]);
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(2500);
    o.checkout = { url: page.url().replace(/\/cn\/[^/?]+/, '/cn/<token>').replace(/checkouts\/[^/?]+\/[^/?]+/, 'checkouts/<token>').slice(0, 120), title: await page.title(), h: await page.evaluate(() => [...document.querySelectorAll('h1, h2')].slice(0, 4).map((n) => n.textContent.trim().slice(0, 50))) };
  } else o.checkout = { error: 'sin botón de checkout en el drawer' };

  // --- G. Buy it now ---
  await nav('/products/' + h0);
  const bin = page.locator('main [id$="__main"] .shopify-payment-button__button').first();
  if (await bin.count()) {
    await Promise.all([page.waitForURL(/checkouts|checkout/, { timeout: 25000 }).catch(() => {}), bin.click()]);
    await page.waitForTimeout(2000);
    o.buyNow = { url: page.url().replace(/\/cn\/[^/?]+/, '/cn/<token>').slice(0, 100), title: await page.title() };
  }
  // --- H. Enter dentro del campo de cantidad del drawer (envío implícito del formulario) ---
  await nav('/');
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  await nav('/products/' + h0);
  await page.locator('.product-form__submit').first().click();
  await page.waitForTimeout(2500);
  const hq = page.locator('.cart-drawer__panel [data-cart-quantity]').first();
  if (await hq.count()) {
    const startUrl = page.url();
    await hq.fill('3');
    await Promise.all([page.waitForNavigation({ timeout: 8000 }).catch(() => null), hq.press('Enter')]);
    await page.waitForTimeout(2500);
    const cart = await page.evaluate(() => fetch('/cart.js').then((r) => r.json()).then((c) => c.item_count).catch(() => 'n/d'));
    o.enterInQty = { navigated: page.url() !== startUrl, url: page.url().replace(/checkouts\/.*/, 'checkouts/<token>').replace(store.url, ''), title: await page.title(), cartCount: cart, implicitSubmitButton: null };
  }
  await nav('/');
  o.implicitSubmit = await page.evaluate(() => { const f = document.querySelector('.cart-drawer__panel form[data-cart-form]'); if (!f) return 'sin formulario (carrito vacío)'; const b = [...f.elements].find((e) => e.type === 'submit' && !e.closest('noscript')); return b ? b.name + ':' + b.textContent.trim() : null; });
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  o.console = logs.filter((l) => l.type !== 'warning');
  o.warnings = [...new Set(logs.filter((l) => l.type === 'warning').map((l) => l.text.slice(0, 110)))];
  o.failed = failed;
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-03-transactional' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));

for (const [store, o] of Object.entries(out)) {
  console.log(`\n## ${store}`);
  for (const [h, r] of Object.entries(o.pdp)) {
    console.log(` PDP ${h}: opciones=${r.json.options.map((x) => x.name + '(' + x.values.length + ')').join(',')} variantes=${r.json.variants.length} disponibles=${r.json.variants.filter((v) => v.available).length}`);
    console.log(`   inicial: id=${r.initial.idInput} precio="${r.initial.priceVisible}" badges=${JSON.stringify(r.initial.badges)} inv=${JSON.stringify(r.initial.inventory)} atc=${JSON.stringify(r.initial.atc)} lineTotal="${r.initial.lineTotal}"`);
    for (const c of r.changes) console.log(`   → ${c.clicked}: ${c.ms}ms reqs=${c.reqs.length} url=${c.state.url} id=${c.state.idInput} (${c.expect ? c.expect.title + ' ' + c.expect.price + ' avail=' + c.expect.available : 'SIN VARIANTE'}) precio="${c.state.priceVisible}" inv=${c.state.inventory?.state}:"${c.state.inventory?.msg}" atc="${c.state.atc?.text}"${c.state.atc?.disabled ? ' DISABLED' : ''} sel=${JSON.stringify(c.state.selectedLabels)} sticky=${JSON.stringify(c.state.sticky)} live="${c.state.liveStatus}"`);
    if (r.arrowKey) console.log(`   flecha→: foco=${r.arrowFocus} checked=${JSON.stringify(r.arrowKey.checked)} id=${r.arrowKey.idInput}`);
    console.log(`   cantidad: ${JSON.stringify(r.quantity)}`);
  }
  for (const s of o.steps) {
    if (!s.api) { console.log(' STEP', s.label, s.err || ''); continue; }
    console.log(` STEP ${s.label}: open=${s.open} api{count=${s.api.count} total=${s.api.total} items=${s.api.items.map((i) => i.h + '×' + i.q).join(',')}} dom{items=${s.dom.items.map((i) => i.qty + (i.incDisabled ? '(+off)' : '') + (i.decDisabled ? '(-off)' : '')).join(',')} count="${s.dom.countLabel}" subtotal="${s.dom.subtotal}" badge=${s.dom.headerBadge}${s.dom.headerBadgeHidden ? '(hidden)' : ''} label="${s.dom.headerLabel}" status=${JSON.stringify(s.dom.status)} error=${JSON.stringify(s.dom.error)} rewards="${s.dom.rewards}" now=${s.dom.rewardsNow} note=${s.dom.noteField} empty="${s.dom.empty}" xsell=${s.dom.crossSell} dyn=${s.dom.dynamicCheckout}} focus=${s.focus} inPanel=${s.focusInPanel}`);
    if (s.pre) console.log('    bundle pre', JSON.stringify(s.pre), 'unchecked', JSON.stringify(s.unchecked), 'msg', JSON.stringify(s.bundleMsg));
    if (s.variantChange) console.log('    featured variant', JSON.stringify(s.variantChange));
  }
  console.log(' /cart:', JSON.stringify(o.cartPage));
  console.log(' checkout:', JSON.stringify(o.checkout));
  console.log(' buyNow:', JSON.stringify(o.buyNow));
  console.log(' Enter en cantidad del drawer:', JSON.stringify(o.enterInQty), 'botón por defecto del form:', JSON.stringify(o.implicitSubmit));
  console.log(' console errors:', JSON.stringify(o.console.slice(0, 6)));
  console.log(' failed:', JSON.stringify(o.failed.slice(0, 10)));
}
