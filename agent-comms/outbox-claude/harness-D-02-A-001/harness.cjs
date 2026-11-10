// D-02-A (RC-13, TT-106). Harness SINTETICO, local y sin tienda: Chromium de Playwright y un
// servidor Node que sirve el assets/theme.js REAL y paginas que TRADUCEN A MANO el Liquid de
// main-product.liquid y featured-product.liquid (boton, aviso de plan, region de estado, precio
// con insignias, bloque de inventario, planes de venta, cantidad y barra sticky de la PDP).
// Derivado de harness-A-01-B-02-001 sin copiarle cambios. Solo JS. Sin credenciales ni red externa.
//
// Uso:  node harness.cjs [repo] [fix|base] [BASE_SHA]
// P-1..P-6 (X1, P3 de REVIEW-D02A-001): con &ann=1 la pagina lleva data-available-price-status, como
// el Liquid actual; sin el, el tema cae al texto anterior y los 57 casos originales no cambian.
//   fix  (defecto): theme.js de la copia de trabajo.
//   base: theme.js del commit BASE_SHA (por defecto d8703c5, punta de task/b01).
// Sale con 1 si algun caso falla.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const repo = path.resolve(process.argv[2] || '.');
const mode = process.argv[3] || 'fix';
const BASE = process.argv[4] || 'd8703c5';
const THEME_JS = mode === 'fix'
  ? fs.readFileSync(path.join(repo, 'assets/theme.js'), 'utf8')
  : execFileSync('git', ['-C', repo, 'show', `${BASE}:assets/theme.js`], { encoding: 'utf8', maxBuffer: 1 << 26 });

// ---------- textos (locales/en.default.json) ----------
const T = {
  add: 'Add to cart', soldOut: 'Sold out', unavailable: 'Unavailable', loading: 'Loading variant…',
  availStatus: 'Variant available.', soldStatus: 'Variant sold out.', oneTime: 'One-time',
  availPrice: '[title], [price]: Variant available.', // P3: locales variant_available_with_price
  planUnavailable: 'This purchase option is unavailable',
  planRequired: 'This option requires a subscription plan that is not available right now.',
  inv: { in_stock: 'In stock', preorder: 'Available for pre-order', sold_out: 'Sold out', unavailable: 'This option is unavailable', low: 'Only a few left' },
};
const THRESHOLD = 5; // bloque inventory_status; inventory_cap = threshold + 1
const money = (c) => `€${(c / 100).toFixed(2).replace('.', ',')} EUR`;
const plan = (id, g = 9) => ({ id, name: `Plan ${id}`, group_id: g, price: money(id * 1000), price_cents: id * 1000, compare_at_price: null, compare_at_price_cents: null, per_delivery_price: money(id * 1000), unit_price: null });
const V = (id, options, extra = {}) => ({ id, title: options.join(' / '), available: true, inventory_management: 'shopify', inventory_quantity: 10, inventory_policy: 'deny', options, price: money(5000), price_cents: 5000, compare_at_price: null, compare_at_price_cents: null, unit_price: null, unit_reference_value: null, unit_reference_unit: null, featured_media_id: null, quantity_min: 1, quantity_increment: 1, quantity_max: null, requires_selling_plan: false, selling_plan_allocations: [], ...extra });
const G = [{ id: 9, name: 'Delivery', plans: [plan(1), plan(2), plan(3)] }];

// pa: matriz de carga (una opcion; las agotadas solo se alcanzan por ?variant=, como en la tienda)
// pb: dos opciones sin planes (disponible -> agotada -> vuelta, e inexistente)
// pd: dos opciones con planes (agotada + plan exigido, plan exigido con y sin plan)
// pc: variante por defecto que exige plan y producto sin grupos
const P = {
  pa: { options: ['Size'], groups: G, variants: [
    V(101, ['S'], { selling_plan_allocations: [plan(1), plan(2)] }),
    V(102, ['M'], { available: false, inventory_quantity: 0, price: money(6000), price_cents: 6000 }),
    V(103, ['L'], { inventory_policy: 'continue', inventory_quantity: 0, price: money(7000), price_cents: 7000 }),
    V(104, ['XL'], { requires_selling_plan: true, selling_plan_allocations: [plan(1)] }),
    V(105, ['XXL'], { requires_selling_plan: true }),
    V(106, ['3XL'], { available: false, inventory_quantity: 0, requires_selling_plan: true }),
    V(107, ['T'], { selling_plan_allocations: [plan(3)] }),
  ] },
  pb: { options: ['Color', 'Size'], groups: [], variants: [
    V(201, ['Blue', 'S']), V(202, ['Blue', 'L'], { available: false, inventory_quantity: 0, price: money(6500), price_cents: 6500 }),
    V(203, ['Red', 'S'], { price: money(5500), price_cents: 5500 }), V(204, ['Red', 'L']), V(205, ['Blue', 'M']),
  ] }, // Red/M no existe
  pd: { options: ['Color', 'Size'], groups: G, variants: [
    V(401, ['Red', 'S'], { selling_plan_allocations: [plan(1), plan(2)] }),
    V(402, ['Red', 'M'], { available: false, inventory_quantity: 0, requires_selling_plan: true }),
    V(403, ['Blue', 'M'], { requires_selling_plan: true, selling_plan_allocations: [plan(1)] }),
    V(404, ['Blue', 'S'], { requires_selling_plan: true }),
  ] },
  pc: { options: ['Title'], groups: [], defaultOnly: true, variants: [V(301, ['Default Title'], { requires_selling_plan: true })] },
};

// ---------- traduccion del Liquid ----------
function inventoryState(v) {
  if (!v) return 'unavailable';
  if (v.available === false) return 'sold_out';
  if (v.inventory_management === 'shopify') {
    if (v.inventory_policy === 'continue' && v.inventory_quantity <= 0) return 'preorder';
    if (v.inventory_quantity > 0 && v.inventory_quantity <= THRESHOLD) return 'low_stock';
  }
  return 'in_stock';
}
function render(key, surface, sid, q) {
  const pdp = surface === 'pdp';
  const p = P[key];
  const sel = p.variants.find((v) => v.id === Number(q.variant)) || p.variants.find((v) => v.available) || p.variants[0];
  let alloc = sel.selling_plan_allocations.find((x) => x.id === Number(q.selling_plan)) || null;
  if (!alloc && sel.requires_selling_plan) alloc = sel.selling_plan_allocations[0] || null;
  const planId = alloc ? alloc.id : '';
  const sub = Boolean(planId);
  const planReq = sel.requires_selling_plan && sel.selling_plan_allocations.length === 0;
  const canAdd = sel.available && !planReq;
  const formId = `${pdp ? 'product-form' : 'featured-product-form'}-${sid}`;
  const label = sel.available === false ? T.soldOut : planReq ? T.planUnavailable : T.add;
  const radioName = (o) => (pdp ? `options[${o}]` : `featured-options-${sid}[${o}]`);
  const priceBlock = `<div class="price" data-price-wrapper data-label-sale="Sale price" data-label-regular="Regular price"><div class="price__values"><span class="visually-hidden">Regular price</span><span data-current-price>${sel.price}</span><s class="price__compare" data-compare-price hidden></s></div>
    <div class="price__badges" aria-live="polite"><span class="badge" data-sale-badge hidden>Sale</span><span class="badge" data-sold-out-badge ${sel.available ? 'hidden' : ''}>${T.soldOut}</span></div></div>`;
  const picker = p.defaultOnly ? '' : `<div class="variant-picker flow" data-variant-picker>${p.options.map((o, oi) => {
    const values = [...new Set(p.variants.map((v) => v.options[oi]))];
    return `<fieldset class="variant-picker__group" role="radiogroup"><legend>${o}: <span data-selected-option="${oi + 1}">${sel.options[oi]}</span></legend>${values.map((val, vi) => {
      const avail = p.variants.some((v) => v.available && v.options[oi] === val);
      const id = `${pdp ? 'option' : 'featured-option'}-${sid}-${oi + 1}-${vi + 1}`;
      return `<input class="variant-picker__input visually-hidden" type="radio" id="${id}" name="${radioName(o)}" value="${val}" data-option-position="${oi + 1}" ${sel.options[oi] === val ? 'checked' : ''} aria-disabled="${!avail}" ${avail ? '' : 'disabled'}><label for="${id}">${val}<span data-unavailable-label ${avail ? 'hidden' : ''}>×</span></label>`;
    }).join('')}</fieldset>`;
  }).join('')}</div>`;
  const quantity = pdp ? `<div class="product-form__quantity"><div class="quantity-stepper" data-quantity-stepper>
    <button type="button" name="minus" data-quantity-button="decrease" disabled>-</button>
    <input id="Quantity-${sid}" type="number" name="quantity" form="${formId}" value="1" min="1" step="1" inputmode="numeric" required data-quantity-input>
    <button type="button" name="plus" data-quantity-button="increase">+</button></div>
    <p class="product-form__line-total" data-line-total data-empty aria-live="polite" aria-atomic="true"><span data-line-total-label></span><s data-line-total-compare hidden><span data-line-total-compare-value></span></s><span data-line-total-current></span></p></div>` : '';
  const pn = pdp ? 'purchase-option' : 'featured-purchase-option';
  const plans = p.groups.length ? `<div class="selling-plans" data-selling-plans>
      <fieldset class="selling-plans__fieldset"><legend>Purchase options</legend>
        <label><input type="radio" name="${pn}-${sid}" value="one_time" data-purchase-option="one_time" ${sub ? '' : 'checked'} ${sel.requires_selling_plan ? 'disabled' : ''}>One-time <span data-one-time-price>${sel.price}</span></label>
        <label><input type="radio" name="${pn}-${sid}" value="subscription" data-purchase-option="subscription" ${sub ? 'checked' : ''} ${sel.selling_plan_allocations.length === 0 ? 'disabled' : ''}>Subscribe <span data-subscription-price>${alloc ? alloc.price : T.planUnavailable}</span></label>
        <div class="selling-plans__details" data-selling-plan-details ${sub ? '' : 'hidden'}><select id="SellingPlan-${sid}" data-selling-plan-select>${p.groups.map((g) => `<optgroup label="${g.name}" data-selling-plan-group>${g.plans.map((pl) => { const has = sel.selling_plan_allocations.some((x) => x.id === pl.id); return `<option value="${pl.id}" data-selling-plan-option ${pl.id === planId ? 'selected' : ''} ${has ? '' : 'disabled hidden'}>${pl.name}</option>`; }).join('')}</optgroup>`).join('')}</select>
          <p class="selling-plans__status" aria-live="polite" data-selling-plan-status>${alloc ? `${alloc.name} / ${alloc.price}` : ''}</p><p data-selling-plan-per-delivery hidden></p></div>
      </fieldset>
      <input type="hidden" name="selling_plan" value="${planId}" data-selling-plan-input disabled>
    </div>` : '';
  const invState = inventoryState(sel);
  const inventory = `<product-inventory class="product-inventory" data-stock-state="${invState}" data-threshold="${THRESHOLD}" data-show-count="false" data-low-stock-template="Only [count] left" data-low-stock-generic="${T.inv.low}" data-in-stock="${T.inv.in_stock}" data-preorder="${T.inv.preorder}" data-sold-out="${T.inv.sold_out}" data-unavailable="${T.inv.unavailable}"><span class="product-inventory__message" role="status" aria-live="polite" data-inventory-message>${invState === 'low_stock' ? T.inv.low : T.inv[invState]}</span></product-inventory>`;
  const json = JSON.stringify(p.variants.map((v) => ({ ...v, inventory_quantity: Math.min(v.inventory_quantity, THRESHOLD + 1) })));
  const attrs = `${pdp ? `data-product-url="/products/${key}" data-money-format="€{{amount_with_comma_separator}} EUR" data-line-total-template="Total for [quantity]" data-variant-loading-text="${T.loading}"` : ''} data-initial-variant-id="${sel.id}" data-add-to-cart-text="${T.add}" data-sold-out-text="${T.soldOut}" data-unavailable-text="${T.unavailable}" data-available-status="${T.availStatus}" ${q.ann ? `data-available-price-status="${T.availPrice}" ` : ''}data-sold-out-status="${T.soldStatus}" data-one-time-text="${T.oneTime}" data-selling-plan-unavailable-text="${T.planUnavailable}" data-per-delivery-template="[price] per delivery"`;
  const sticky = pdp ? `<div style="height:3000px"></div><sticky-cart-bar class="sticky-cart-bar" data-product-form-id="${formId}" data-unavailable-text="${T.unavailable}" data-quantity-price-template="[quantity] × [price]" data-total-template="Total [total]" data-action-label-template="[action]: [product]" data-quantity-label-template="[action]: [quantity] × [product]" aria-hidden="true" inert>
      <p class="sticky-cart-bar__title">Synthetic ${key}</p><p><span data-sticky-variant>${sel.title}</span> / <span data-sticky-price>${sel.price}</span></p><p data-sticky-total hidden></p>
      <button class="button" type="button" aria-label="${label}: Synthetic ${key}" data-sticky-submit ${canAdd ? '' : 'disabled'}><span data-sticky-label>${label}</span><span data-loading-icon hidden></span></button></sticky-cart-bar>` : '';
  return `<section data-section-id="${sid}"><variant-selects ${attrs}><div class="flow">
    <h1>Synthetic ${key}</h1>${priceBlock}${picker}${quantity}
    <div class="product-form"><form method="post" action="/cart/add" id="${formId}" data-cart-add-form>
      <input type="hidden" name="form_type" value="product"><input type="hidden" name="id" value="${sel.id}" data-variant-id>
      ${plans}
      <button type="submit" name="add" class="product-form__submit" data-add-to-cart ${canAdd ? '' : 'disabled'}><span data-add-to-cart-text>${label}</span><span class="button__spinner" data-loading-icon hidden></span></button>
      <p class="form-message" data-plan-required-notice ${planReq && sel.available ? '' : 'hidden'}>${T.planRequired}</p>
      <div class="product-form__dynamic-checkout" ${canAdd ? '' : 'hidden'}>pay</div>
      <p class="form-message" role="alert" data-product-form-error hidden></p>
    </form></div>
    ${inventory}
    <p class="visually-hidden" aria-live="polite" aria-atomic="true" data-variant-status></p></div>
    <script type="application/json" data-variant-json>${json}</script>
  </variant-selects>${sticky}</section>`;
}
const page = (q) => `<!doctype html><html class="js"><head><meta charset="utf-8"><style>.visually-hidden{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}[hidden]{display:none!important}.sticky-cart-bar{position:fixed;bottom:0;left:0;right:0;background:#fff}</style>
<script src="/assets/theme.js" defer></script></head><body>${render(q.product, q.surface || 'pdp', q.surface === 'featured' ? 'fs' : 'main', q)}</body></html>`;

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/assets/theme.js') { res.writeHead(200, { 'content-type': 'text/javascript' }); return res.end(THEME_JS); }
  if (u.pathname === '/page') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(page(Object.fromEntries(u.searchParams))); }
  res.writeHead(404); res.end();
});

// ---------- estado observado y esperado ----------
const read = (pg) => pg.evaluate(() => {
  const $ = (s) => document.querySelector(s);
  const vis = (el) => Boolean(el) && !el.hidden && !el.closest('[hidden]');
  const b = $('[data-add-to-cart]');
  const st = $('sticky-cart-bar');
  return {
    btn: b.querySelector('[data-add-to-cart-text]').textContent.trim(), disabled: b.disabled,
    notice: vis($('[data-plan-required-notice]')), status: $('[data-variant-status]').textContent.trim(),
    badge: vis($('[data-sold-out-badge]')), inventory: $('[data-inventory-message]').textContent.trim(),
    checkout: vis($('.product-form__dynamic-checkout')), priceShown: vis($('[data-price-wrapper]')),
    price: $('[data-current-price]').textContent.trim(),
    plan: (() => { const i = $('[data-selling-plan-input]'); return i && !i.disabled ? i.value : ''; })(),
    id: (() => { const i = $('input[data-variant-id]'); return i.disabled ? '' : i.value; })(),
    qtyMaxed: (() => { const i = $('[data-quantity-input]'); return i ? i.max !== '' && Number(i.max) <= Number(i.min) : null; })(),
    sticky: st ? { label: st.querySelector('[data-sticky-label]').textContent.trim(), disabled: st.querySelector('[data-sticky-submit]').disabled, aria: st.querySelector('[data-sticky-submit]').getAttribute('aria-label'), variant: st.querySelector('[data-sticky-variant]').textContent.trim(), price: st.querySelector('[data-sticky-price]').textContent.trim(), visible: st.hasAttribute('data-visible') } : null,
  };
});
// kind: avail | preorder | sold | planMissing | planOk | none
function expected(kind, v, planObj) {
  const title = v ? v.title : '';
  const E = {
    avail: { btn: T.add, disabled: false, notice: false, status: `${title}: ${T.availStatus}`, badge: false, inventory: T.inv.in_stock, checkout: true },
    preorder: { btn: T.add, disabled: false, notice: false, status: `${title}: ${T.availStatus}`, badge: false, inventory: T.inv.preorder, checkout: true },
    sold: { btn: T.soldOut, disabled: true, notice: false, status: `${title}: ${T.soldStatus}`, badge: true, inventory: T.inv.sold_out, checkout: false },
    planMissing: { btn: T.planUnavailable, disabled: true, notice: true, status: T.planUnavailable, badge: false, inventory: T.inv.in_stock, checkout: false },
    none: { btn: T.unavailable, disabled: true, notice: false, status: T.unavailable, badge: false, inventory: T.inv.unavailable, checkout: false },
  };
  const e = { ...(E[kind === 'planOk' ? 'avail' : kind]) };
  if (v) { e.price = (planObj || v).price; e.id = String(v.id); }
  if (kind === 'none') e.id = '';
  e.plan = planObj ? String(planObj.id) : '';
  return e;
}
function compare(obs, exp, { initial, surface }) {
  const bad = [];
  for (const k of ['btn', 'disabled', 'notice', 'badge', 'inventory', 'checkout', 'plan', 'id']) if (obs[k] !== exp[k]) bad.push(`${k}=${JSON.stringify(obs[k])}≠${JSON.stringify(exp[k])}`);
  // En la carga la region de estado nace vacia (el servidor ya pinta el estado; no se anuncia nada).
  if (initial ? !(obs.status === '' || obs.status === exp.status) : obs.status !== exp.status) bad.push(`status=${JSON.stringify(obs.status)}≠${JSON.stringify(exp.status)}`);
  if (exp.price !== undefined && obs.price !== exp.price) bad.push(`price=${obs.price}≠${exp.price}`);
  if (exp.id === '' && obs.priceShown) bad.push('precio visible sin variante');
  if (surface === 'pdp') {
    const s = obs.sticky;
    if (!s) bad.push('sin barra sticky');
    else {
      if (s.label !== obs.btn) bad.push(`sticky.label=${s.label}≠${obs.btn}`);
      if (s.disabled !== obs.disabled) bad.push(`sticky.disabled=${s.disabled}`);
      if (!s.aria || !s.aria.startsWith(`${obs.btn}:`)) bad.push(`sticky.aria=${s.aria}`);
      if (exp.price !== undefined && s.price !== exp.price) bad.push(`sticky.price=${s.price}≠${exp.price}`);
    }
    // Agotada: la cantidad queda bloqueada en el minimo (D-02-Q). Disponible: no.
    if (exp.btn === T.soldOut && obs.qtyMaxed !== true) bad.push('cantidad no bloqueada en agotada');
  }
  return bad;
}

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const results = [];
  const rec = (id, surface, label, bad, extra) => { const ok = bad.length === 0; results.push({ id, surface, ok }); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} [${surface}] ${label}${ok ? '' : ` :: ${bad.join('; ')}`}${extra ? ` :: ${JSON.stringify(extra)}` : ''}`); };
  const open = async (qs) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    pg.setDefaultTimeout(2500);
    const errors = [];
    pg.on('pageerror', (e) => errors.push(String(e).slice(0, 100)));
    // Registro de las regiones vivas: cada texto nuevo que reciben durante la prueba.
    await pg.addInitScript(() => {
      window.__live = [];
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[aria-live],[role="status"]').forEach((el) => {
          new MutationObserver(() => { const hiddenNow = el.hidden || el.closest('[hidden]'); window.__live.push({ region: el.dataset.variantStatus !== undefined ? 'variant-status' : el.hasAttribute('data-inventory-message') ? 'inventory' : el.classList.contains('price__badges') ? 'badges' : el.hasAttribute('data-selling-plan-status') ? 'plan-status' : el.hasAttribute('data-line-total') ? 'line-total' : el.className, text: [...el.querySelectorAll('*')].length && el.classList.contains('price__badges') ? [...el.children].filter((c) => !c.hidden).map((c) => c.textContent.trim()).join('|') : el.textContent.trim(), hidden: Boolean(hiddenNow) }); }).observe(el, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['hidden'] });
        });
      });
    });
    await pg.goto(`${origin}/page?${qs}`, { waitUntil: 'load' });
    await pg.waitForFunction(() => customElements.get('variant-selects'));
    return { ctx, pg, errors };
  };
  const pick = (pg, v) => pg.locator(`.variant-picker__input[value="${v}"]`).check({ force: true });
  const V_ = (k, id) => P[k].variants.find((v) => v.id === id);

  for (const surface of ['pdp', 'featured']) {
    const S = `surface=${surface}`;
    // M-1 .. M-7: matriz de carga (?variant=) para pa
    const matrix = [
      ['M-1', 101, 'avail', null, 'disponible'],
      ['M-2', 102, 'sold', null, 'agotada'],
      ['M-3', 103, 'preorder', null, 'inventory_policy continue (preventa, stock 0)'],
      ['M-4', 104, 'planOk', plan(1), 'requiere plan, con plan'],
      ['M-5', 105, 'planMissing', null, 'requiere plan, sin plan'],
      ['M-6', 106, 'sold', null, 'agotada que ademas requiere plan sin plan (gana agotado)'],
      ['M-7', 107, 'avail', null, 'plan solo 3; ?selling_plan=1 no valido para la variante -> compra unica'],
      ['M-9', 101, 'planOk', plan(2), 'plan opcional elegido por URL (?selling_plan=2)'],
    ];
    for (const [id, vid, kind, pl, label] of matrix) {
      try {
        const t = await open(`${S}&product=pa&variant=${vid}${id === 'M-7' ? '&selling_plan=1' : id === 'M-9' ? '&selling_plan=2' : ''}`);
        const o = await read(t.pg);
        rec(id, surface, label, [...compare(o, expected(kind, V_('pa', vid), pl), { initial: true, surface }), ...t.errors]);
        await t.ctx.close();
      } catch (e) { rec(id, surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }
    }
    try {
      const t = await open(`${S}&product=pc`);
      const o = await read(t.pg);
      rec('M-8', surface, 'variante por defecto que exige plan, producto sin grupos', [...compare(o, expected('planMissing', V_('pc', 301), null), { initial: true, surface }), ...t.errors]);
      await t.ctx.close();
    } catch (e) { rec('M-8', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }

    // C-1: A disponible -> B agotada -> A, y combinacion inexistente (pb, sin planes)
    try {
      const t = await open(`${S}&product=pb&variant=201`);
      const steps = [];
      await pick(t.pg, 'L'); steps.push(['Blue/L agotada', compare(await read(t.pg), expected('sold', V_('pb', 202)), { surface })]);
      await pick(t.pg, 'S'); steps.push(['vuelta a Blue/S', compare(await read(t.pg), expected('avail', V_('pb', 201)), { surface })]);
      await pick(t.pg, 'Red'); steps.push(['Red/S precio distinto', compare(await read(t.pg), expected('avail', V_('pb', 203)), { surface })]);
      await pick(t.pg, 'M'); steps.push(['Red/M inexistente', compare(await read(t.pg), expected('none', null), { surface })]);
      await pick(t.pg, 'L'); steps.push(['Red/L disponible', compare(await read(t.pg), expected('avail', V_('pb', 204)), { surface })]);
      const live = await t.pg.evaluate(() => window.__live);
      for (const [n, bad] of steps) rec('C-1', surface, n, bad);
      // Anuncios: la region de estado recibe un texto por cambio, en el orden esperado.
      const status = live.filter((x) => x.region === 'variant-status').map((x) => x.text);
      const expStatus = ['Blue / L: Variant sold out.', 'Blue / S: Variant available.', 'Red / S: Variant available.', T.unavailable, 'Red / L: Variant available.'];
      rec('A-1', surface, 'region de estado: un anuncio por cambio y sin contradicciones', JSON.stringify(status) === JSON.stringify(expStatus) ? [] : [`anuncios=${JSON.stringify(status)}`]);
      const badges = live.filter((x) => x.region === 'badges').map((x) => x.text);
      rec('A-2', surface, 'insignia Sold out en region viva solo con la agotada', badges[0] === T.soldOut && badges.slice(1).every((x) => x !== T.soldOut) ? [] : [`insignias=${JSON.stringify(badges)}`]);
      const inv = live.filter((x) => x.region === 'inventory').map((x) => x.text).filter((x, i, a) => x !== a[i - 1]);
      rec('A-3', surface, 'inventario (role=status) coherente', JSON.stringify(inv) === JSON.stringify([T.inv.sold_out, T.inv.in_stock, T.inv.unavailable, T.inv.in_stock]) ? [] : [`inventario=${JSON.stringify(inv)}`]);
      // Precio: se registra que region viva (si alguna) lo lleva al cambiar de variante.
      const priceLive = live.filter((x) => /€/.test(x.text) && !x.hidden).map((x) => `${x.region}:${x.text}`);
      console.log(`INFO P-1 [${surface}] precio en regiones vivas visibles durante C-1: ${JSON.stringify(priceLive)}`);
      rec('C-1e', surface, 'sin errores de pagina', t.errors);
      await t.ctx.close();
    } catch (e) { rec('C-1', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }

    // C-2: con planes (pd): plan 2 -> agotada+plan exigido -> plan exigido con plan -> sin plan -> vuelta
    try {
      const t = await open(`${S}&product=pd&variant=401`);
      const steps = [];
      await t.pg.check('[data-purchase-option="subscription"]');
      await t.pg.selectOption('[data-selling-plan-select]', '2');
      steps.push(['Red/S plan 2', compare(await read(t.pg), expected('planOk', V_('pd', 401), plan(2)), { surface })]);
      await pick(t.pg, 'M'); steps.push(['Red/M agotada y exige plan (gana agotado)', compare(await read(t.pg), expected('sold', V_('pd', 402)), { surface })]);
      await pick(t.pg, 'Blue'); steps.push(['Blue/M exige plan y lo tiene', compare(await read(t.pg), expected('planOk', V_('pd', 403), plan(1)), { surface })]);
      await pick(t.pg, 'S'); steps.push(['Blue/S exige plan sin plan', compare(await read(t.pg), expected('planMissing', V_('pd', 404)), { surface })]);
      await pick(t.pg, 'Red'); steps.push(['vuelta a Red/S (compra unica)', compare(await read(t.pg), expected('avail', V_('pd', 401)), { surface })]);
      const status = (await t.pg.evaluate(() => window.__live)).filter((x) => x.region === 'variant-status').map((x) => x.text);
      for (const [n, bad] of steps) rec('C-2', surface, n, bad);
      const want = ['Red / S: Variant available.', 'Red / M: Variant sold out.', 'Blue / M: Variant available.', T.planUnavailable, 'Red / S: Variant available.'];
      const dedup = status.filter((x, i) => x !== status[i - 1]);
      rec('A-4', surface, 'anuncios con planes: agotado frente a plan no disponible', JSON.stringify(dedup) === JSON.stringify(want) ? [] : [`anuncios=${JSON.stringify(status)}`]);
      rec('C-2e', surface, 'sin errores de pagina', t.errors);
      await t.ctx.close();
    } catch (e) { rec('C-2', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }

    // C-3: plan no valido tras cambio (pa: S con plan 2 -> T, que solo tiene plan 3)
    try {
      const t = await open(`${S}&product=pa&variant=101`);
      await t.pg.check('[data-purchase-option="subscription"]');
      await t.pg.selectOption('[data-selling-plan-select]', '2');
      await pick(t.pg, 'T');
      rec('C-3', surface, 'plan 2 no vale para T: pasa a plan 3, boton y anuncio coherentes', compare(await read(t.pg), expected('planOk', V_('pa', 107), plan(3)), { surface }));
      await t.ctx.close();
    } catch (e) { rec('C-3', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }

    // C-4: envio bloqueado en agotada y en plan ausente (el submit no sale)
    try {
      for (const [vid, n] of [[102, 'agotada'], [105, 'plan ausente']]) {
        const t = await open(`${S}&product=pa&variant=${vid}`);
        let sent = false;
        await t.pg.route('**/cart/add**', (r) => { sent = true; r.abort(); });
        await t.pg.evaluate(() => document.querySelector('form[data-cart-add-form]').requestSubmit());
        await t.pg.waitForTimeout(150);
        rec('C-4', surface, `envio bloqueado: ${n}`, sent ? ['se envio /cart/add'] : []);
        await t.ctx.close();
      }
    } catch (e) { rec('C-4', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }

    // P-1..P-6 (P3): el precio se anuncia una vez por cambio de variante, con y sin plan.
    const priceAnn = (live) => live.filter((x) => !x.hidden && /€/.test(x.text)).map((x) => `${x.region}:${x.text}`);
    const stepLive = async (pg, fn) => { await pg.evaluate(() => { window.__live = []; }); await fn(); await pg.waitForTimeout(30); return pg.evaluate(() => window.__live); };
    const once = (live, want) => { const pr = priceAnn(live); const st = live.filter((x) => x.region === 'variant-status').map((x) => x.text);
      const bad = []; if (pr.length !== 1 || pr[0] !== want) bad.push(`precio=${JSON.stringify(pr)}≠${JSON.stringify([want])}`);
      if (st.length > 1) bad.push(`estado x${st.length}`); return bad; };
    try {
      const t = await open(`${S}&product=pb&variant=201&ann=1`);
      const seq = [
        ['L', 'Blue/L agotada: sin precio, solo agotado', (l) => (priceAnn(l).length === 0 && JSON.stringify(l.filter((x) => x.region === 'variant-status').map((x) => x.text)) === JSON.stringify(['Blue / L: Variant sold out.']) ? [] : [`anuncios=${JSON.stringify(l)}`])],
        ['S', 'vuelta a Blue/S con precio', (l) => once(l, `variant-status:Blue / S, ${money(5000)}: Variant available.`)],
        ['Red', 'Red/S precio distinto', (l) => once(l, `variant-status:Red / S, ${money(5500)}: Variant available.`)],
        ['M', 'Red/M inexistente: solo no disponible', (l) => (priceAnn(l).length === 0 ? [] : [`precio=${JSON.stringify(priceAnn(l))}`])],
      ];
      for (const [val, n, fn] of seq) rec('P-1', surface, n, fn(await stepLive(t.pg, () => pick(t.pg, val))));
      rec('P-1e', surface, 'sin errores de pagina', t.errors);
      await t.ctx.close();
    } catch (e) { rec('P-1', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }
    try {
      // pa S con plan 1 -> XL (exige plan 1, mismo texto de plan): el precio del plan va en la region de estado.
      const t = await open(`${S}&product=pa&variant=101&ann=1`);
      await t.pg.check('[data-purchase-option="subscription"]'); await t.pg.waitForTimeout(30);
      rec('P-2', surface, 'S -> XL con plan 1: precio del plan una vez, en la region de estado', once(await stepLive(t.pg, () => pick(t.pg, 'XL')), `variant-status:XL, ${money(1000)}: Variant available.`));
      // XL -> S y plan 2 -> T (solo plan 3): el estado del plan cambia y ya lleva el precio; no se repite.
      await pick(t.pg, 'S'); await t.pg.selectOption('[data-selling-plan-select]', '2'); await t.pg.waitForTimeout(30);
      const l3 = await stepLive(t.pg, () => pick(t.pg, 'T'));
      const st3 = l3.filter((x) => x.region === 'variant-status').map((x) => x.text);
      rec('P-3', surface, 'plan 2 -> T (plan 3): precio una vez (estado del plan) y disponibilidad una vez', [...once(l3, `plan-status:Plan 3: ${money(3000)}`), ...(JSON.stringify(st3) === JSON.stringify(['T: Variant available.']) ? [] : [`estado=${JSON.stringify(st3)}`])]);
      // Cambio de plan sin cambio de variante: no se reanuncia la disponibilidad.
      await pick(t.pg, 'S'); await t.pg.waitForTimeout(30);
      const l4 = await stepLive(t.pg, () => t.pg.selectOption('[data-selling-plan-select]', '2'));
      rec('P-4', surface, 'cambio de plan: precio una vez y sin repetir la disponibilidad', [...once(l4, `plan-status:Plan 2: ${money(2000)}`), ...(l4.some((x) => x.region === 'variant-status') ? ['region de estado reanunciada'] : [])]);
      const l5 = await stepLive(t.pg, () => t.pg.check('[data-purchase-option="one_time"]'));
      rec('P-5', surface, 'paso a compra unica: sin reanunciar disponibilidad', l5.some((x) => x.region === 'variant-status') ? [`estado=${JSON.stringify(l5)}`] : []);
      rec('P-2e', surface, 'sin errores de pagina', t.errors);
      await t.ctx.close();
    } catch (e) { rec('P-2', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }
    try {
      // Secuencia de C-2 con la plantilla: el texto de cada paso y un unico anuncio de precio por cambio de variante.
      const t = await open(`${S}&product=pd&variant=401&ann=1`);
      await t.pg.check('[data-purchase-option="subscription"]'); await t.pg.selectOption('[data-selling-plan-select]', '2'); await t.pg.waitForTimeout(30);
      const out = [];
      for (const val of ['M', 'Blue', 'S', 'Red']) { const l = await stepLive(t.pg, () => pick(t.pg, val)); out.push({ st: l.filter((x) => x.region === 'variant-status').map((x) => x.text), pr: priceAnn(l) }); }
      const want = [
        { st: ['Red / M: Variant sold out.'], pr: [] },
        { st: ['Blue / M: Variant available.'], pr: [`plan-status:Plan 1: ${money(1000)}`] },
        { st: [T.planUnavailable], pr: [] },
        { st: [`Red / S, ${money(5000)}: Variant available.`], pr: [`variant-status:Red / S, ${money(5000)}: Variant available.`] },
      ];
      rec('P-6', surface, 'C-2 con plantilla: textos y un precio por cambio', JSON.stringify(out) === JSON.stringify(want) ? [] : [`obs=${JSON.stringify(out)}`]);
      await t.ctx.close();
    } catch (e) { rec('P-6', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }

    // S-1: barra sticky visible fuera de vista del boton y coherente tras cambiar a agotada y volver
    if (surface === 'pdp') {
      try {
        const t = await open(`${S}&product=pb&variant=201`);
        await t.pg.mouse.wheel(0, 2500); await t.pg.waitForTimeout(250);
        const v1 = (await read(t.pg)).sticky;
        await pick(t.pg, 'L'); await t.pg.waitForTimeout(50); const o2 = await read(t.pg);
        await pick(t.pg, 'S'); await t.pg.waitForTimeout(50); const o3 = await read(t.pg);
        const bad = [];
        if (!v1.visible) bad.push('barra no visible al hacer scroll');
        if (o2.sticky.label !== T.soldOut || !o2.sticky.disabled || o2.sticky.variant !== 'Blue / L' || o2.sticky.aria !== `${T.soldOut}: Synthetic pb`) bad.push(`agotada=${JSON.stringify(o2.sticky)}`);
        if (o3.sticky.label !== T.add || o3.sticky.disabled || o3.sticky.variant !== 'Blue / S' || o3.sticky.aria !== `${T.add}: Synthetic pb`) bad.push(`vuelta=${JSON.stringify(o3.sticky)}`);
        rec('S-1', surface, 'barra sticky: visible, agotada y vuelta', bad);
        await t.ctx.close();
      } catch (e) { rec('S-1', surface, 'EXCEPCION', [String(e.message).split('\n')[0].slice(0, 120)]); }
    }
  }

  await browser.close(); server.close();
  const fails = results.filter((r) => !r.ok);
  console.log(`\nMODO=${mode}${mode === 'base' ? ` BASE=${BASE}` : ''} total=${results.length} pass=${results.length - fails.length} fail=${fails.length}`);
  console.log(`FALLAN: ${JSON.stringify([...new Set(fails.map((f) => `${f.id}[${f.surface}]`))])}`);
  process.exit(fails.length ? 1 : 0);
})();
