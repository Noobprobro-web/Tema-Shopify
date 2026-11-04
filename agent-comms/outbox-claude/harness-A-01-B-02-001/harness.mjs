// A-01 / B-02 (CLAUDE-DIRECTIVA-A-01-B-02-001 + R-D CLAUDE-REVIEW-A-01-B-02-RD-001).
// Harness SINTETICO, local y sin tienda: Chromium de Playwright + un servidor Node que sirve el
// assets/theme.js REAL (sin copiarlo ni modificarlo) y paginas HTML que TRADUCEN A MANO el Liquid
// de main-product.liquid, featured-product.liquid, snippets/variant-no-js-select.liquid,
// snippets/pickup-availability.liquid (solo el elemento) y el script en linea de layout/theme.liquid.
// No demuestra como interpreta Shopify el payload. Sin credenciales, sin red externa.
//
// Uso:  node harness.mjs [repo] [fix|base] [BASE_SHA]
//   fix  (defecto): Liquid y theme.js de la copia de trabajo. Sale con codigo 1 si algun caso falla.
//   base: theme.js, layout y Liquid del commit BASE_SHA (H-17: los casos de B-02/A-01 deben FALLAR).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const mode = process.argv[3] || 'fix';
const BASE = process.argv[4] || 'c81cbcb';
const FIX = mode === 'fix';
const { chromium } = await import(pathToFileURL(path.join(repo, 'node_modules/playwright/index.mjs')).href);
const git = (p) => execFileSync('git', ['-C', repo, 'show', `${BASE}:${p}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
const read = (p) => (FIX ? fs.readFileSync(path.join(repo, p), 'utf8') : git(p));
const THEME_JS = read('assets/theme.js');
const LAYOUT = read('layout/theme.liquid');
const a = LAYOUT.indexOf("document.documentElement.classList.remove('no-js');");
const b = LAYOUT.indexOf('window.theme = window.theme || {};');
if (a < 0 || b < a) throw new Error('script en linea de layout/theme.liquid no encontrado');
const INLINE_SCRIPT = LAYOUT.slice(a, b); // tal cual el Liquid real (incluye S-5 en modo fix)

// ---------- catalogo sintetico ----------
const money = (c) => `€${(c / 100).toFixed(2).replace('.', ',')} EUR`;
const plan = (id, g = 9) => ({ id, name: `Plan ${id}`, group_id: g, price: money(id * 1000), price_cents: id * 1000, compare_at_price: null, compare_at_price_cents: null, per_delivery_price: money(id * 1000), unit_price: null });
const V = (id, options, extra = {}) => ({ id, title: options.join(' / '), available: true, inventory_management: null, inventory_quantity: 1, inventory_policy: 'deny', options, price: money(5000), price_cents: 5000, compare_at_price: null, compare_at_price_cents: null, unit_price: null, unit_reference_value: null, unit_reference_unit: null, featured_media_id: null, quantity_min: 1, quantity_increment: 1, quantity_max: null, requires_selling_plan: false, selling_plan_allocations: [], ...extra });
const many = (n, first) => Array.from({ length: n }, (_, i) => V(first + i, [`C${Math.floor(i / 10)}`, `S${i % 10}`]));
const P = {
  p1: { options: ['Size'], groups: [{ id: 9, name: 'Delivery', plans: [plan(1), plan(2), plan(3)] }], variants: [V(101, ['S'], { selling_plan_allocations: [plan(1), plan(2)] }), V(102, ['M'], { selling_plan_allocations: [plan(1), plan(2)] }), V(103, ['L'], { selling_plan_allocations: [plan(3)] }), V(104, ['XL'], { available: false })] },
  p2: { options: ['Size'], groups: [{ id: 9, name: 'Delivery', plans: [plan(1), plan(2)] }], variants: [V(201, ['S'], { requires_selling_plan: true, selling_plan_allocations: [plan(1), plan(2)] }), V(202, ['M'], { requires_selling_plan: true })] },
  p3: { options: ['Title'], groups: [], variants: [V(301, ['Default Title'], { requires_selling_plan: true })], defaultOnly: true },
  p4: { options: ['Title'], groups: [], variants: [V(401, ['Default Title'])], defaultOnly: true },
  p5: { options: ['Color', 'Size'], groups: [], variants: many(40, 5000) },
  p6: { options: ['Color', 'Size'], groups: [], variants: many(250, 6000) },
  p7: { options: ['Size'], groups: [], variants: [V(701, ['X'.repeat(120)]), V(702, ['Y'.repeat(120)], { price: money(987654321), price_cents: 987654321 })] },
  p8: { options: ['Color', 'Size'], groups: [], variants: [V(801, ['Red', 'S']), V(802, ['Red', 'M'], { available: false }), V(803, ['Blue', 'S']), V(804, ['Blue', 'M'])] },
  p9: { options: ['Color', 'Size'], groups: [], variants: many(300, 9000) },
};

// ---------- traduccion del Liquid (una funcion por superficie compartida) ----------
function render(key, surface, sid, q) {
  const pdp = surface === 'pdp';
  const p = P[key];
  if (q.noproduct === '1' && !pdp) return `<section data-section-id="${sid}"><p>onboarding</p></section>`; // featured sin producto: sin formulario
  const cap = p.variants.slice(0, 250); // product.variants: 250 como maximo en Liquid
  const sel = p.variants.find((v) => v.id === Number(q.variant)) || p.variants.find((v) => v.available) || p.variants[0];
  let alloc = sel.selling_plan_allocations.find((x) => x.id === Number(q.selling_plan)) || null;
  if (!alloc && sel.requires_selling_plan) alloc = sel.selling_plan_allocations[0] || null;
  const planId = alloc ? alloc.id : '';
  const sub = Boolean(planId);
  const planReq = sel.requires_selling_plan && sel.selling_plan_allocations.length === 0;
  const canAdd = sel.available && !planReq;
  const hasPickerBlock = q.nopicker !== '1';
  // render_variant_no_js: has_only_default_variant == false y bloque variant_picker (modo base: no existe)
  const noJs = FIX && !p.defaultOnly && hasPickerBlock;
  const jsOnly = FIX ? ' js-only' : '';
  const radioName = (o) => (pdp ? `options[${o}]` : `featured-options-${sid}[${o}]`);
  // --- bloque variant_picker ---
  const picker = p.defaultOnly || !hasPickerBlock ? '' : `<div class="variant-picker flow${jsOnly}">${p.options.map((o, oi) => {
    const values = [...new Set(p.variants.map((v) => v.options[oi]))];
    return `<fieldset class="variant-picker__group" role="radiogroup"><legend>${o}:</legend><div class="variant-picker__values">${values.map((val, vi) => {
      const avail = p.variants.some((v) => v.available && v.options[oi] === val);
      const id = `${pdp ? 'option' : 'featured-option'}-${sid}-${oi + 1}-${vi + 1}`;
      return `<input class="variant-picker__input visually-hidden" type="radio" id="${id}" name="${radioName(o)}" value="${val}" data-option-position="${oi + 1}" ${sel.options[oi] === val ? 'checked' : ''} aria-disabled="${!avail}" ${avail ? '' : 'disabled'}><label for="${id}">${val}</label>`;
    }).join('')}</div></fieldset>`;
  }).join('')}</div>`;
  // --- snippets/variant-no-js-select.liquid ---
  const optText = (v) => `${v.title} / ${v.price}${v.available ? '' : ' / Sold out'}`;
  let listed = false;
  let opts = cap.map((v) => { if (v.id === sel.id) listed = true; return `<option value="${v.id}" ${v.id === sel.id ? 'selected' : ''} ${v.available === false && v.id !== sel.id ? 'disabled' : ''}>${optText(v)}</option>`; }).join('');
  if (!listed) opts += `<option value="${sel.id}" selected>${optText(sel)}</option>`;
  const selId = `${pdp ? 'ProductVariantNoJs' : 'FeaturedProductVariantNoJs'}-${sid}`;
  const noJsSelect = noJs ? `<div class="form-field no-js-only"><label for="${selId}">Choose options</label><select id="${selId}" name="id" autocomplete="off" data-no-js-control>${opts}</select></div>` : '';
  // --- planes de venta ---
  const pn = pdp ? 'purchase-option' : 'featured-purchase-option';
  const spId = `${pdp ? '' : 'Featured'}SellingPlanNoJs-${sid}`;
  const nojsAttr = FIX ? ' autocomplete="off" data-no-js-control' : '';
  const plans = p.groups.length ? `<div class="selling-plans" data-selling-plans>
      <fieldset class="selling-plans__fieldset js-only"><legend>Purchase options</legend>
        <div class="selling-plans__choices">
        <label class="selling-plans__choice"><input type="radio" name="${pn}-${sid}" value="one_time" data-purchase-option="one_time" ${sub ? '' : 'checked'} ${sel.requires_selling_plan ? 'disabled' : ''}><span class="selling-plans__choice-copy"><strong>One-time</strong><span data-one-time-price>${sel.price}</span></span></label>
        <label class="selling-plans__choice"><input type="radio" name="${pn}-${sid}" value="subscription" data-purchase-option="subscription" ${sub ? 'checked' : ''} ${sel.selling_plan_allocations.length === 0 ? 'disabled' : ''}><span class="selling-plans__choice-copy"><strong>Subscribe</strong><span data-subscription-price>${alloc ? alloc.price : 'Unavailable'}</span></span></label>
        </div>
        <div class="selling-plans__details" data-selling-plan-details ${sub ? '' : 'hidden'}><label for="SellingPlan-${sid}">Delivery</label><select id="SellingPlan-${sid}" data-selling-plan-select>${p.groups.map((g) => `<optgroup label="${g.name}" data-selling-plan-group>${g.plans.map((pl) => { const has = sel.selling_plan_allocations.some((x) => x.id === pl.id); return `<option value="${pl.id}" data-selling-plan-option ${pl.id === planId ? 'selected' : ''} ${has ? '' : 'disabled hidden'}>${pl.name}</option>`; }).join('')}</optgroup>`).join('')}</select><p class="selling-plans__status" aria-live="polite" data-selling-plan-status>${alloc ? `${alloc.name} / ${alloc.price}` : ''}</p><p class="selling-plans__per-delivery" data-selling-plan-per-delivery hidden></p></div>
      </fieldset>
      <input type="hidden" name="selling_plan" value="${planId}" data-selling-plan-input disabled>
      <div class="selling-plans__no-js no-js-only"><label for="${spId}">Purchase options</label><select id="${spId}" name="selling_plan"${nojsAttr}>${sel.requires_selling_plan ? '' : `<option value=""${sub ? '' : ' selected'}>One-time</option>`}${p.groups.map((g) => `<optgroup label="${g.name}">${sel.selling_plan_allocations.filter((x) => x.group_id === g.id).map((x) => `<option value="${x.id}" ${x.id === planId ? 'selected' : ''}>${x.name} / ${x.price}</option>`).join('')}</optgroup>`).join('')}</select></div>
    </div>` : '';
  const json = q.badjson === '1' ? '[' : JSON.stringify(cap);
  const attrs = `${pdp ? `data-product-url="/products/${key}" data-money-format="{{amount_with_comma_separator}} EUR" data-line-total-template="[quantity]"` : ''} data-add-to-cart-text="Add" data-sold-out-text="Sold out" data-unavailable-text="Unavailable" data-available-status="ok" data-sold-out-status="so" data-one-time-text="One-time" data-selling-plan-unavailable-text="Plan unavailable" data-per-delivery-template="[price]"`;
  return `<section data-section-id="${sid}"><variant-selects ${attrs}>
  ${picker}
  <div class="product-form"><form method="post" action="/cart/add" id="${pdp ? 'product-form' : 'featured-product-form'}-${sid}" accept-charset="UTF-8" enctype="multipart/form-data" class="product-form__form" data-cart-add-form>
    <input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓">
    <input type="hidden" name="id" value="${sel.id}" data-variant-id${noJs ? ' disabled' : ''}>${noJsSelect}
    ${plans}
    <button type="submit" name="add" class="product-form__submit" data-add-to-cart ${canAdd ? '' : 'disabled'}><span data-add-to-cart-text>${sel.available === false ? 'Sold out' : planReq ? 'Plan unavailable' : 'Add'}</span></button>
    <p class="form-message" data-plan-required-notice ${planReq && sel.available ? '' : 'hidden'}>plan required</p>
    <div class="product-form__dynamic-checkout" ${canAdd ? '' : 'hidden'}></div>
  </form><pickup-availability data-variant-id="${sel.id}" hidden></pickup-availability></div>
  <script type="application/json" data-variant-json>${json}</script>
</variant-selects></section>`;
}
const page = (q) => {
  const surface = q.surface || 'pdp';
  const body = q.two === '1' ? render(q.product, 'featured', 'fa', q) + render(q.product, 'featured', 'fb', q) : render(q.product, surface, surface === 'pdp' ? 'main' : 'fs', q);
  return `<!doctype html><html class="no-js"><head><meta charset="utf-8"><style>.js .no-js-only,.no-js .js-only{display:none!important}.visually-hidden{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}[hidden]{display:none!important}</style>
${q.js === 'late' ? `<script>document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){var s=document.createElement('script');s.src='/assets/theme.js?m=ok';document.head.appendChild(s);},300);});</script>` : `<script src="/assets/theme.js?m=${q.js || 'ok'}" defer="defer"></script>`}
<script>${INLINE_SCRIPT}</script></head><body>${body}</body></html>`;
};

// ---------- servidor ----------
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const q = Object.fromEntries(u.searchParams);
  if (u.pathname === '/assets/theme.js') {
    if (q.m === '404') { res.writeHead(404); return res.end(); }
    if (q.m === 'throw') { res.writeHead(200, { 'content-type': 'text/javascript' }); return res.end('(() => { error de sintaxis'); }
    if (q.m === 'slow') await new Promise((r) => setTimeout(r, 1500));
    res.writeHead(200, { 'content-type': 'text/javascript' });
    return res.end(THEME_JS);
  }
  if (u.pathname === '/page') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(page(q)); }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
browser.on('disconnected', () => {});

// ---------- utilidades de prueba ----------
const results = [];
const rec = (id, surface, label, ok, detail) => { results.push({ id, surface, ok }); console.log(`${ok ? 'PASS' : 'FAIL'} ${id} [${surface}] ${label} :: ${JSON.stringify(detail)}`); };
const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);
const parse = (body) => { const o = {}; for (const m of (body || '').matchAll(/name="([^"]+)"\r\n\r\n([^\r]*)/g)) (o[m[1]] ||= []).push(m[2]); return o; };
async function open(qs, { js = true } = {}) {
  const ctx = await browser.newContext({ javaScriptEnabled: js });
  const pg = await ctx.newPage();
  pg.setDefaultTimeout(2500);
  const errors = [];
  pg.on('pageerror', (e) => errors.push(String(e).slice(0, 80)));
  let body = null;
  await pg.route('**/cart/add', async (r) => { body = r.request().postData(); await r.fulfill({ status: 200, body: 'ok' }); });
  await pg.goto(`${origin}/page?${qs}`, { waitUntil: 'load' });
  return { ctx, pg, errors, post: async () => {
    await Promise.all([pg.waitForRequest('**/cart/add'), pg.locator('[data-add-to-cart]').first().click({ force: true })]);
    return parse(body);
  } };
}
const ready = (pg) => pg.waitForFunction(() => window.customElements.get('variant-selects') && document.querySelector('input[data-variant-id]') && !document.querySelector('input[data-variant-id]').disabled, null, { timeout: 4000 }).catch(() => {});
const fd = (pg) => pg.evaluate(() => { const f = new FormData(document.querySelector('form[data-cart-add-form]')); return { id: f.getAll('id'), sp: f.getAll('selling_plan') }; });
const btn = (pg) => pg.evaluate(() => ({ disabled: document.querySelector('[data-add-to-cart]').disabled, notice: !document.querySelector('[data-plan-required-notice]')?.hidden, checkoutHidden: document.querySelector('.product-form__dynamic-checkout')?.hidden ?? null }));
// Elige la variante como lo haria una persona: con el select nativo si existe; si no (base), con los radios visibles.
const choose = async (pg, id, values) => { if (await pg.locator('select[name="id"]').count()) await pg.selectOption('select[name="id"]', id); else for (const v of values) await pg.locator(`.variant-picker__input[value="${v}"]`).check({ force: true }); };
const pick = (pg, v) => pg.locator(`.variant-picker__input[value="${v}"]`).check({ force: true });

for (const surface of ['pdp', 'featured']) {
  const S = `surface=${surface}`;
  // H-1 / H-2 / H-3 / H-4 con JS (p1: plan opcional)
  try {
  { const t = await open(`${S}&product=p1`); await ready(t.pg);
    const h1 = await fd(t.pg); rec('H-1', surface, 'compra unica (JS)', same(h1, { id: ['101'], sp: [] }), h1);
    const seq = [];
    await t.pg.check('[data-purchase-option="subscription"]'); seq.push(await fd(t.pg));
    await t.pg.selectOption('[data-selling-plan-select]', '2'); seq.push(await fd(t.pg));
    await t.pg.check('[data-purchase-option="one_time"]', { force: true }); seq.push(await fd(t.pg));
    rec('H-2', surface, 'plan 1 -> plan 2 -> compra unica (JS)', same(seq.map((x) => x.sp), [['1'], ['2'], []]) && seq.every((x) => x.id.length === 1), seq);
    await t.pg.check('[data-purchase-option="subscription"]'); await t.pg.selectOption('[data-selling-plan-select]', '2');
    await pick(t.pg, 'L'); const l = await fd(t.pg);
    const t2 = await open(`${S}&product=p1&variant=104`); await ready(t2.pg); const xl = await fd(t2.pg); const xb = await btn(t2.pg);
    rec('H-3', surface, 'plan 2 y variante L solo con plan 3; agotada sin plan', same(l, { id: ['103'], sp: ['3'] }) && same(xl.sp, []) && xb.disabled, { L: l, XL: xl, btn: xb });
    await t.ctx.close(); await t2.ctx.close(); }
  } catch (e) { rec('H-1', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  { const t = await open(`${S}&product=p1&selling_plan=1`); await ready(t.pg);
    const c1 = await fd(t.pg); await t.pg.check('[data-purchase-option="one_time"]', { force: true }); const c2 = await fd(t.pg);
    rec('H-4', surface, 'caso C: ?selling_plan=1 y luego compra unica (JS)', same(c1.sp, ['1']) && same(c2.sp, []) && c2.id.length === 1, { carga: c1.sp, tras: c2.sp, id: c2.id });
    await t.ctx.close(); }
  } catch (e) { rec('H-4', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-5 requires_selling_plan (p2) y H-6 (p3)
  try {
  { const t = await open(`${S}&product=p2`); await ready(t.pg);
    const r1 = await fd(t.pg); await t.pg.selectOption('[data-selling-plan-select]', '2'); const r2 = await fd(t.pg);
    await pick(t.pg, 'M'); const r3 = await fd(t.pg); const b3 = await btn(t.pg);
    rec('H-5', surface, 'requires_selling_plan (JS)', same(r1.sp, ['1']) && same(r2.sp, ['2']) && same(r3.sp, []) && b3.disabled && b3.notice && b3.checkoutHidden === true, { r1: r1.sp, r2: r2.sp, M: r3, btn: b3 });
    await t.ctx.close(); }
  } catch (e) { rec('H-5', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  for (const js of [true, false]) { const t = await open(`${S}&product=p3`, { js }); const b3 = await btn(t.pg);
    rec(`H-6${js ? 'a' : 'b'}`, surface, `p3 requires sin grupos (${js ? 'JS' : 'sin JS'})`, b3.disabled && b3.notice, b3); await t.ctx.close(); }
  } catch (e) { rec('H-6', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-7 sin JS: cargar A, elegir B en el select nativo (p1 y p8)
  try {
  for (const [pk, target, exp, vals] of [['p1', '102', '102', ['M']], ['p8', '804', '804', ['Blue', 'M']]]) {
    const t = await open(`${S}&product=${pk}`, { js: false });
    const st = await t.pg.evaluate(() => ({ html: document.documentElement.className, selectDisplay: document.querySelector('select[name="id"]') ? getComputedStyle(document.querySelector('select[name="id"]').closest('.form-field')).display : 'sin select', pickerDisplay: getComputedStyle(document.querySelector('.variant-picker')).display, hiddenDisabled: document.querySelector('input[data-variant-id]').disabled }));
    await choose(t.pg, target, vals); const po = await t.post();
    rec('H-7', surface, `sin JS ${pk}: elegir ${target} en el select`, same(po.id, [exp]) && st.pickerDisplay === 'none' && st.selectDisplay !== 'none', { post_id: po.id, ...st }); await t.ctx.close(); }
  } catch (e) { rec('H-7', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-8 / H-18 theme.js caido (404), con error de sintaxis y lento
  try {
  for (const [m, hid] of [['404', 'H-8'], ['throw', 'H-18b']]) {
    try {
    const t = await open(`${S}&product=p8&js=${m}`);
    const st = await t.pg.evaluate(() => ({ html: document.documentElement.className, selectDisplay: document.querySelector('select[name="id"]') ? getComputedStyle(document.querySelector('select[name="id"]').closest('.form-field')).display : 'sin select' }));
    await choose(t.pg, '804', ['Blue', 'M']); const po = await t.post();
    rec(hid, surface, `theme.js ${m}`, st.html === 'no-js' && st.selectDisplay !== 'none' && same(po.id, ['804']), { ...st, post_id: po.id }); await t.ctx.close(); } catch (e) { rec(hid, surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
    }
  } catch (e) { rec('H-?', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  { const t = await open(`${S}&product=p1&js=late`); await t.pg.waitForTimeout(900);
    const st = await t.pg.evaluate(() => ({ html: document.documentElement.className, picker: getComputedStyle(document.querySelector('.variant-picker')).display, nativeSelectVisible: getComputedStyle(document.querySelector('select[data-no-js-control]')?.closest('.form-field') || document.body).display !== 'none', hiddenIdEnabled: !document.querySelector('input[data-variant-id]').disabled }));
    await pick(t.pg, 'M'); const f = await fd(t.pg);
    rec('H-18c', surface, 'theme.js tardio (tras DOMContentLoaded): vuelve a js y el comprador elige variante', st.html === 'js' && st.picker !== 'none' && !st.nativeSelectVisible && st.hiddenIdEnabled && same(f.id, ['102']), { ...st, id: f.id }); await t.ctx.close(); }
  } catch (e) { rec('H-18c', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  { const t = await open(`${S}&product=p1&js=slow`); await ready(t.pg);
    const st = await t.pg.evaluate(() => ({ html: document.documentElement.className, hiddenDisabled: document.querySelector('input[data-variant-id]').disabled, native: [...document.querySelectorAll('[data-no-js-control]')].map((c) => c.disabled) }));
    rec('H-18a', surface, 'theme.js lento (1,5 s): sin vuelta falsa a no-js', st.html === 'js' && !st.hiddenDisabled && st.native.every(Boolean), st); await t.ctx.close(); }
  } catch (e) { rec('H-18a', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-9 ?variant=B (solo PDP: el destacado no recibe la URL de la pagina)
  try {
  if (surface === 'pdp') for (const js of [true, false]) { const t = await open(`${S}&product=p1&variant=102`, { js }); if (js) await ready(t.pg);
    const po = await t.post(); rec(`H-9${js ? 'a' : 'b'}`, surface, `?variant=102 (${js ? 'JS' : 'sin JS'})`, same(po.id, ['102']), po.id); await t.ctx.close(); }
  } catch (e) { rec('H-9', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-10 sin JS, ?selling_plan=1 y compra unica en el select nativo
  try {
  { const t = await open(`${S}&product=p1&selling_plan=1`, { js: false }); await t.pg.selectOption(`select[name="selling_plan"]`, ''); const po = await t.post();
    rec('H-10', surface, 'sin JS: plan de la URL y compra unica (limite 4.3.2: selling_plan vacio)', same(po.selling_plan, ['']) && po.id.length === 1, { id: po.id, selling_plan: po.selling_plan }); await t.ctx.close(); }
  } catch (e) { rec('H-10', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-11 sin JS: opciones agotadas
  try {
  { const t = await open(`${S}&product=p1`, { js: false });
    const o = await t.pg.evaluate(() => [...document.querySelectorAll('select[name="id"] option')].map((x) => ({ v: x.value, d: x.disabled, s: x.selected, t: x.textContent })));
    const t2 = await open(`${S}&product=p1&variant=104`, { js: false });
    const o2 = await t2.pg.evaluate(() => [...document.querySelectorAll('select[name="id"] option')].map((x) => ({ v: x.value, d: x.disabled, s: x.selected })));
    const ok = o.find((x) => x.v === '104').d && /Sold out$/.test(o.find((x) => x.v === '104').t) && o.filter((x) => x.v !== '104').every((x) => !x.d) && o2.find((x) => x.v === '104').s && !o2.find((x) => x.v === '104').d;
    rec('H-11', surface, 'sin JS: agotadas disabled salvo la seleccionada, con sufijo', ok, { agotada: o.find((x) => x.v === '104'), seleccionadaAgotada: o2.find((x) => x.v === '104') }); await t.ctx.close(); await t2.ctx.close(); }
  } catch (e) { rec('H-11', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-12 p4 solo variante por defecto
  try {
  for (const js of [false, true]) { const t = await open(`${S}&product=p4`, { js }); if (js) await ready(t.pg);
    const n = await t.pg.evaluate(() => ({ names: document.querySelectorAll('[name="id"]').length, selects: document.querySelectorAll('select[name="id"],[data-no-js-control]').length })); const po = await t.post();
    rec(`H-12${js ? 'b' : 'a'}`, surface, `p4 (${js ? 'JS' : 'sin JS'})`, n.names === 1 && n.selects === 0 && same(po.id, ['401']), { ...n, post_id: po.id }); await t.ctx.close(); }
  } catch (e) { rec('H-12', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-13 p5 / p6 y H-13b p9
  try {
  for (const [k, n, last] of [['p5', 40, '5039'], ['p6', 250, '6249']]) {
    const t = await open(`${S}&product=${k}`, { js: false });
    const cnt = await t.pg.evaluate(() => ({ opts: document.querySelectorAll('select[name="id"] option').length, bytes: document.querySelector('select[name="id"]').closest('.form-field').outerHTML.length }));
    await t.pg.selectOption('select[name="id"]', last); const po = await t.post(); await t.ctx.close();
    const tj = await open(`${S}&product=${k}`); await ready(tj.pg); const j = await fd(tj.pg); await tj.pg.locator('.variant-picker__input[value="C1"]').check({ force: true }); const j2 = await fd(tj.pg); await tj.ctx.close();
    rec('H-13', surface, `${k} (${n} variantes)`, cnt.opts === n && same(po.id, [last]) && j.id.length === 1 && j2.id.length === 1, { ...cnt, sinJS_post: po.id, jsId: j.id, jsId_tras_C1: j2.id }); }
  } catch (e) { rec('H-13', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  { const t = await open(`${S}&product=p9&variant=9260`, { js: false }); const cnt = await t.pg.evaluate(() => document.querySelectorAll('select[name="id"] option').length); const po = await t.post();
    rec('H-13b', surface, 'p9 300 variantes, ?variant=9260 fuera de las 250', same(po.id, ['9260']) && cnt === 251, { opciones: cnt, post_id: po.id }); await t.ctx.close(); }
  } catch (e) { rec('H-13b', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-14 texto largo
  try {
  { const t = await open(`${S}&product=p7`, { js: false });
    const txt = await t.pg.evaluate(() => document.querySelector('select[name="id"] option[value="702"]').textContent);
    await t.pg.selectOption('select[name="id"]', '702'); const po = await t.post();
    rec('H-14', surface, 'p7 titulo de 120 caracteres y precio largo', txt.includes('Y'.repeat(120)) && txt.includes(money(987654321)) && same(po.id, ['702']), { longitud: txt.length, post_id: po.id }); await t.ctx.close(); }
  } catch (e) { rec('H-14', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-15 p8 combinacion agotada
  try {
  { const t = await open(`${S}&product=p8`, { js: false });
    const o = await t.pg.evaluate(() => { const x = document.querySelector('select[name="id"] option[value="802"]'); return { disabled: x.disabled, text: x.textContent }; });
    const po = await t.post(); await t.ctx.close();
    const tj = await open(`${S}&product=p8`); await ready(tj.pg); await pick(tj.pg, 'Red'); await pick(tj.pg, 'M'); const bj = await btn(tj.pg); await tj.ctx.close();
    rec('H-15', surface, 'p8 Red/M agotada', o.disabled && /Sold out$/.test(o.text) && same(po.id, ['801']) && bj.disabled, { opcion: o, sinJS_post_id: po.id, jsBtn: bj }); }
  } catch (e) { rec('H-15', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // H-16 regresion con JS: control tomado y acceso por nombre unico
  try {
  { const t = await open(`${S}&product=p1&selling_plan=1`); await ready(t.pg);
    await pick(t.pg, 'M'); await t.pg.check('[data-purchase-option="subscription"]');
    const r = await t.pg.evaluate(() => {
      const f = document.querySelector('form[data-cart-add-form]'); const hid = f.querySelector('input[data-variant-id]'); const sp = f.querySelector('[data-selling-plan-input]');
      const n = f.elements.namedItem('id'); const ns = f.elements.namedItem('selling_plan');
      return { native: [...f.querySelectorAll('[data-no-js-control]')].map((c) => ({ disabled: c.disabled, name: c.getAttribute('name') })), hiddenEnabled: !hid.disabled,
        namedId: n && n.constructor.name, namedIdIsHidden: n === hid, namedIdValue: n && n.value, namedSp: ns && ns.constructor.name, namedSpIsHidden: ns === sp, namedSpValue: ns && ns.value,
        qsIsHidden: f.querySelector('[name="id"]') === hid, formDotId: f.id === hid, pickupDisabledProp: document.querySelector('pickup-availability').disabled ?? null, nameIdCount: f.querySelectorAll('[name="id"]').length, nameSpCount: f.querySelectorAll('[name="selling_plan"]').length };
    });
    const src = THEME_JS.slice(THEME_JS.indexOf('handOffFocus('), THEME_JS.indexOf('handOffFocus(') + 900);
    const focusFilter = /!element\.disabled/.test(src);
    rec('H-16', surface, 'JS toma el control (name retirado, desactivados)', r.native.length === 2 && r.native.every((c) => c.disabled && c.name === null) && r.hiddenEnabled && r.namedId === 'HTMLInputElement' && r.namedIdIsHidden && r.namedIdValue === '102' && r.namedSp === 'HTMLInputElement' && r.namedSpIsHidden && r.namedSpValue === '1' && r.qsIsHidden && r.nameIdCount === 1 && r.nameSpCount === 1 && r.pickupDisabledProp === null && focusFilter, { ...r, handOffFocusFiltraDisabled: focusFilter }); await t.ctx.close(); }
  } catch (e) { rec('H-16', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  // Estados degenerados extra: sin bloque variant_picker, JSON roto, destacado sin producto
  try {
  { const t = await open(`${S}&product=p1&nopicker=1`, { js: false }); const n = await t.pg.evaluate(() => document.querySelectorAll('[name="id"]').length); const po = await t.post();
    rec('H-19', surface, 'sin bloque variant_picker: se conserva el comportamiento actual', n === 1 && same(po.id, ['101']), { names: n, post_id: po.id }); await t.ctx.close(); }
  } catch (e) { rec('H-19', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  { const t = await open(`${S}&product=p1&selling_plan=1&badjson=1`); const f = await fd(t.pg);
    rec('H-20', surface, 'JSON de variantes roto: un valor por nombre (estado del servidor)', f.id.length === 1 && f.sp.length === 1, f); await t.ctx.close(); }
  } catch (e) { rec('H-20', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }
  try {
  if (surface === 'featured') { const t = await open(`${S}&noproduct=1&product=p1`); rec('H-21', surface, 'destacado sin producto: sin formulario ni errores', (await t.pg.locator('form').count()) === 0 && t.errors.length === 0, { errores: t.errors }); await t.ctx.close(); }
  } catch (e) { rec('H-21', surface, 'EXCEPCION', false, String(e.message).split('\n')[0].slice(0, 110)); }

}
{ const t = await open('product=p1&two=1'); const dup = await t.pg.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map((e) => e.id); return ids.filter((x, i) => ids.indexOf(x) !== i); });
  rec('H-22', 'featured x2', 'dos productos destacados: ids unicos', dup.length === 0, dup); await t.ctx.close(); }

// ---------- coherencia Liquid real frente al HTML traducido (conteos) ----------
if (FIX) {
  const count = (files, re) => files.reduce((s, f) => s + (fs.readFileSync(path.join(repo, f), 'utf8').match(re) || []).length, 0);
  // El snippet de pickup se cuenta solo para data-variant-id: el harness no traduce su contenido interno.
  const tokens = [['name="id"', /name="id"/g], ['data-no-js-control', /data-no-js-control/g], ['no-js-only', /no-js-only/g], ['js-only (sin no-js-only)', /(?<![-\w])js-only/g], ['data-selling-plan-input', /data-selling-plan-input/g], ['data-variant-id', /data-variant-id/g, true]];
  for (const [surface, sect] of [['pdp', 'sections/main-product.liquid'], ['featured', 'sections/featured-product.liquid']]) {
    const t = await open(`surface=${surface}&product=p1`, { js: false });
    const html = await t.pg.evaluate(() => document.documentElement.outerHTML.replace(/<(script|style)[\s\S]*?<\/\1>/g, '')); await t.ctx.close();
    const rows = tokens.map(([n, re, pickup]) => ({ token: n, liquid: count([sect, 'snippets/variant-no-js-select.liquid', ...(pickup ? ['snippets/pickup-availability.liquid'] : [])], re), html: (html.match(re) || []).length }));
    // El comentario del Liquid no debe contar: se comparan solo los atributos emitidos (los conteos coinciden si no hay menciones en comentarios).
    rec('H-23', surface, 'ocurrencias de atributos clave: Liquid real = HTML traducido', rows.every((r) => r.liquid === r.html), rows);
  }
}

await browser.close(); server.close();
const fails = results.filter((r) => !r.ok);
console.log(`\nMODO=${mode} total=${results.length} pass=${results.length - fails.length} fail=${fails.length}`);
console.log(`FALLAN: ${JSON.stringify([...new Set(fails.map((f) => `${f.id}[${f.surface}]`))])}`);
if (!FIX) {
  const need = ['H-1', 'H-2', 'H-4', 'H-7', 'H-8'];
  const ok = ['pdp', 'featured'].every((s) => need.every((n) => fails.some((f) => f.id === n && f.surface === s)));
  console.log(`H-17 (la base reproduce los fallos de H-1, H-2, H-4, H-7 y H-8 en las dos superficies): ${ok ? 'PASS' : 'FAIL'}`);
  process.exit(ok ? 0 : 1);
}
process.exit(fails.length ? 1 : 0);
