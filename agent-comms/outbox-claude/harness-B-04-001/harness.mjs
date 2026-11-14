// B-04 (TT-103 / RC-11 / S-06). Arnes SINTETICO (Chromium local, sin red externa ni tienda).
// Sirve el assets/theme.js REAL (sin parches en memoria) y un HTML que traduce a mano
// sections/cart-drawer.liquid:35-92 (atributos y avisos), 132-139 (vacio) y 146-370 (form, linea,
// nota, Checkout, View cart). Todo el trafico va por page.route a un origen ficticio.
// Uso: node agent-comms/outbox-claude/harness-B-04-001/harness.mjs <repo> <fix|base> [SHA]
//   fix  = theme.js y cart-drawer.liquid de la copia de trabajo.
//   base = ambos con `git show <SHA>:...` (SHA por defecto: 9834bac, la base fija de B-04).
// Control de deriva: cuenta en el cart-drawer.liquid real los hooks que el HTML generado reproduce.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const mode = process.argv[3] || 'fix';
const SHA = process.argv[4] || '9834bac';
if (!['fix', 'base'].includes(mode)) throw new Error('modo: fix | base');
const FINAL = mode === 'fix';
const { chromium } = await import(pathToFileURL(path.join(repo, 'node_modules/playwright/index.mjs')).href);
const readFile = (rel) => (FINAL
  ? fs.readFileSync(path.join(repo, rel), 'utf8')
  : execFileSync('git', ['-C', repo, 'show', `${SHA}:${rel}`], { encoding: 'utf8', maxBuffer: 1 << 26 }));
const themeJs = readFile('assets/theme.js');
const liquid = readFile('sections/cart-drawer.liquid');

const ORIGIN = 'http://shop.test';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Traduccion manual minima de cart-drawer.liquid:35-92 (atributos/avisos), 132-139 (vacio),
// 146-370 (form, linea, nota 315-320, checkout 351, View cart 366-368).
function drawerHtml(state) {
  const items = state.items.map((it) => `
    <div class="cart-drawer-item" role="listitem" data-cart-item-key="${it.key}" data-cart-item-title="${esc(it.title)}">
      <h3><a href="/products/${it.key}">${esc(it.title)}</a></h3>
      <input id="DrawerQuantity-1" type="number" name="updates[]" value="${it.qty}" min="1" step="1" required data-quantity-input data-cart-quantity>
      <button type="button" aria-label="Remove" data-cart-remove>x</button>
    </div>`).join('');
  const viewCartAttrs = FINAL ? ' id="CartDrawerViewCart" data-cart-view-cart' : '';
  const content = state.items.length === 0
    ? `<div class="cart-drawer__empty"><p tabindex="-1" data-cart-empty-message>Empty</p><a class="button" href="/collections/all">Continue</a></div>`
    : `<form id="CartCrossSellOptions-cd" hidden></form>
      <form class="cart-drawer__form" action="/cart" method="post" data-cart-form>
        <div data-cart-scroll><div class="cart-drawer__items" role="list">${items}</div>
          <div data-cross-sell-item data-product-id="77"><h3 class="cart-cross-sell__title"><a href="/products/xsell">Xsell</a></h3>
            <a data-cross-sell-view href="/products/xsell">View product</a></div>
        </div>
        <footer class="cart-drawer__footer">
          ${state.showNote ? `<div class="cart-note"><label for="CartDrawerNote">Note</label><textarea id="CartDrawerNote" name="note">${esc(state.note)}</textarea></div>` : ''}
          <noscript><button type="submit" name="update">Update</button></noscript>
          <button class="button" type="submit" name="checkout">Checkout</button>
          <a class="cart-drawer__view-cart"${viewCartAttrs} href="/cart">View cart</a>
        </footer>
      </form>`;
  return `<cart-drawer class="cart-drawer" data-section-id="cd" data-cart-url="/cart" data-cart-add-url="/cart/add.js"
    data-cart-change-url="/cart/change.js" data-item-count="${state.items.length}" data-cart-count-label="Cart"
    data-error-message="Generic error" data-added-message="Added" data-removed-template="[title] removed"
    data-add-failed-message="Add failed" data-cart-update-url="/cart/update.js" data-update-unconfirmed-message="Unconfirmed"
    data-saving-note-message="Saving your cart note" data-note-unconfirmed-message="We could not confirm that your cart note was saved.">
    <div class="cart-drawer__overlay" data-cart-drawer-overlay hidden>
      <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1" data-cart-drawer-panel inert>
        <header><h2 id="CartDrawerTitle" tabindex="-1">Cart</h2><button type="button" aria-label="Close" data-cart-drawer-close>X</button></header>
        <p role="status" aria-live="polite" data-cart-status hidden></p>
        <p role="alert" data-cart-error hidden></p>
        <div data-cart-uncertain hidden><button type="button" data-cart-check>Check</button></div>
        <div class="cart-drawer__content" data-cart-drawer-content>${content}</div>
      </div>
    </div></cart-drawer>`;
}

const page0 = (state) => `<!doctype html><html class="js"><head><meta charset="utf-8"><title>h</title></head><body>
<header><a id="hdr" href="/cart">Cart</a></header><main><p>home</p></main>${drawerHtml(state)}
<script src="/theme.js" defer></script></body></html>`;

async function scenario(browser, name, opts, run) {
  const state = { note: opts.serverNote ?? '', showNote: opts.showNote ?? true, items: opts.items ?? [{ key: 'k1', title: 'Shirt', qty: 1 }] };
  const ctx = await browser.newContext({ javaScriptEnabled: opts.js ?? true });
  const page = await ctx.newPage();
  const log = { updates: [], sections: 0, changes: [], navs: [], cartPost: null };
  const handlers = { update: opts.update || (async (route, body) => { state.note = body.note; await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ note: body.note, item_count: state.items.length }) }); }) };
  await page.route('**/*', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.pathname === '/theme.js') return route.fulfill({ contentType: 'text/javascript', body: themeJs });
    if (url.pathname === '/cart/update.js') { const body = JSON.parse(req.postData() || '{}'); log.updates.push({ body, keepalive: true }); return handlers.update(route, body, state); }
    if (url.pathname === '/cart/change.js') { const body = JSON.parse(req.postData() || '{}'); log.changes.push(body); if (opts.change) return opts.change(route, body, state); }
    if (url.pathname === '/cart' && url.searchParams.get('section_id')) { log.sections += 1; return route.fulfill({ contentType: 'text/html', body: drawerHtml(state) }); }
    if (url.pathname === '/cart' && req.method() === 'POST') { log.cartPost = req.postData(); return route.fulfill({ contentType: 'text/html', body: '<p>checkout redirect</p>' }); }
    if (req.isNavigationRequest()) { log.navs.push(url.pathname); return route.fulfill({ contentType: 'text/html', body: url.pathname === '/' ? page0(state) : `<p id="dest">${url.pathname}</p>` }); }
    return route.fulfill({ status: 404, body: '' });
  });
  page.setDefaultTimeout(2000);
  await page.goto(`${ORIGIN}/`);
  log.navs = [];
  const res = { name };
  try {
    if (opts.js !== false) {
      await page.click('#hdr');
      await page.waitForSelector('cart-drawer[data-open]');
      await page.waitForTimeout(150);
    }
    await run(page, log, state, res);
  } catch (e) { res.error = String(e.message).split('\n')[0]; }
  res.updates = log.updates.length; res.navs = log.navs.join(',') || '-'; res.sections = log.sections;
  if (log.cartPost) res.cartPost = log.cartPost;
  await ctx.close();
  return res;
}

const dirty = async (page, text) => { await page.fill('#CartDrawerNote', text); };
const snap = async (page) => page.evaluate(() => {
  const t = document.querySelector('cart-drawer textarea[name="note"]');
  const err = document.querySelector('[data-cart-error]');
  const a = document.activeElement;
  return { url: location.pathname, note: t ? t.value : null, dirty: t ? t.dataset.dirty || null : null,
    error: err && !err.hidden ? err.textContent : null,
    focus: a ? (a.id || a.getAttribute('aria-label') || a.textContent.trim().slice(0, 20) || a.tagName) : null };
});
const delayed = (ms, fn) => async (route, body, state) => { await new Promise((r) => setTimeout(r, ms)); try { await fn(route, body, state); } catch {} };
const ok = (route, body, state) => { state.note = body.note; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ note: body.note }) }); };
const VC = 'a.cart-drawer__view-cart';

const browser = await chromium.launch();
const out = [];
const S = (...a) => scenario(browser, ...a).then((r) => out.push(r));

await S('T01 nota sucia + View cart', {}, async (page, log, st, r) => {
  await dirty(page, 'Gift wrap please'); await page.click(VC); await page.waitForTimeout(800);
  Object.assign(r, await snap(page)); r.sent = log.updates[0]?.body?.note ?? '-'; r.serverNote = st.note;
});
await S('T02 nota limpia + View cart', { serverNote: 'old' }, async (page, log, st, r) => {
  await page.click(VC); await page.waitForTimeout(500); Object.assign(r, await snap(page));
});
await S('T03 setting oculto (sin textarea)', { showNote: false }, async (page, log, st, r) => {
  await page.click(VC); await page.waitForTimeout(500); Object.assign(r, await snap(page));
});
await S('T04 doble clic con pendiente', { update: delayed(600, ok) }, async (page, log, st, r) => {
  await dirty(page, 'twice'); await page.click(VC); await page.click(VC, { force: true }); await page.waitForTimeout(1200);
  Object.assign(r, await snap(page));
});
await S('T05 pendiente (View cart) + clic en View product', { update: delayed(600, ok) }, async (page, log, st, r) => {
  await dirty(page, 'first'); await page.click(VC); await page.click('[data-cross-sell-view]'); await page.waitForTimeout(1200);
  Object.assign(r, await snap(page));
});
await S('T06 pendiente (View product) + clic en View cart', { update: delayed(600, ok) }, async (page, log, st, r) => {
  await dirty(page, 'first'); await page.click('[data-cross-sell-view]'); await page.click(VC); await page.waitForTimeout(1200);
  Object.assign(r, await snap(page));
});
await S('T07 edicion en vuelo', { update: delayed(600, ok) }, async (page, log, st, r) => {
  await dirty(page, 'abc'); await page.click(VC); await page.type('#CartDrawerNote', 'X'); await page.waitForTimeout(1200);
  Object.assign(r, await snap(page));
});
await S('T08 HTTP 500', { update: (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{"description":"x"}' }) }, async (page, log, st, r) => {
  await dirty(page, 'n500'); await page.click(VC); await page.waitForTimeout(800); Object.assign(r, await snap(page));
});
await S('T09 JSON invalido', { update: (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '<html>' }) }, async (page, log, st, r) => {
  await dirty(page, 'njson'); await page.click(VC); await page.waitForTimeout(800); Object.assign(r, await snap(page));
});
await S('T10 eco distinto', { update: (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"note":"other"}' }) }, async (page, log, st, r) => {
  await dirty(page, 'necho'); await page.click(VC); await page.waitForTimeout(800); Object.assign(r, await snap(page));
});
await S('T11 red caida', { update: (route) => route.abort('failed') }, async (page, log, st, r) => {
  await dirty(page, 'nnet'); await page.click(VC); await page.waitForTimeout(800); Object.assign(r, await snap(page));
});
await S('T12 timeout 3000 ms', { update: delayed(4500, ok) }, async (page, log, st, r) => {
  await dirty(page, 'nslow'); await page.click(VC); await page.waitForTimeout(3600); Object.assign(r, await snap(page));
});
await S('T13 clic con Ctrl (modificado)', {}, async (page, log, st, r) => {
  await dirty(page, 'mod');
  await page.evaluate(() => { window.__prevented = null; window.addEventListener('click', (e) => { window.__prevented = e.defaultPrevented; e.preventDefault(); }); });
  await page.click(VC, { modifiers: ['Control'] }); await page.waitForTimeout(400);
  Object.assign(r, await snap(page)); r.defaultPrevented = await page.evaluate(() => window.__prevented);
});
await S('T14 Checkout nativo con nota sucia', {}, async (page, log, st, r) => {
  await dirty(page, 'via checkout'); await page.click('button[name="checkout"]'); await page.waitForTimeout(600);
});
await S('T15 mutacion en vuelo (cantidad) + View cart', { change: delayed(800, (route, body, state) => { state.items[0].qty = 2; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ item_count: 2, items: [], sections: { cd: drawerHtml(state) } }) }); }) }, async (page, log, st, r) => {
  await dirty(page, 'during mutation');
  await page.fill('#DrawerQuantity-1', '2'); await page.dispatchEvent('#DrawerQuantity-1', 'change');
  await page.waitForTimeout(50); await page.click(VC, { force: true }); await page.waitForTimeout(1500);
  Object.assign(r, await snap(page)); r.changes = log.changes.length;
});
await S('T16 re-render de mutacion durante pendiente', { update: delayed(900, ok), change: delayed(200, (route, body, state) => { state.items[0].qty = 3; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ item_count: 3, items: [], sections: { cd: drawerHtml(state) } }) }); }) }, async (page, log, st, r) => {
  await dirty(page, 'kept');
  await page.click(VC);
  await page.evaluate(() => { const i = document.querySelector('#DrawerQuantity-1'); i.value = '3'; i.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.waitForTimeout(1500); Object.assign(r, await snap(page)); r.changes = log.changes.length; r.serverNote = st.note;
});
await S('T17 eliminar ultimo articulo con nota sucia', { change: (route, body, state) => { state.items = []; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ item_count: 0, items: [], sections: { cd: drawerHtml(state) } }) }); } }, async (page, log, st, r) => {
  await dirty(page, 'lost?'); await page.click('[data-cart-remove]'); await page.waitForTimeout(600);
  Object.assign(r, await snap(page)); r.viewCart = await page.locator(VC).count(); r.serverNote = st.note;
});
await S('T18 nota muy larga (70.000 car.)', {}, async (page, log, st, r) => {
  await page.evaluate(() => { const t = document.querySelector('#CartDrawerNote'); t.value = 'x'.repeat(70000); t.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click(VC); await page.waitForTimeout(800); const s = await snap(page); s.note = s.note ? `len ${s.note.length}` : s.note; Object.assign(r, s);
});
await S('T19 fallo y reintento manual', { update: (() => { let n = 0; return (route, body, state) => (n++ === 0 ? route.fulfill({ status: 500, body: '{}' }) : ok(route, body, state)); })() }, async (page, log, st, r) => {
  await dirty(page, 'retry'); await page.click(VC); await page.waitForTimeout(800);
  r.afterFail = JSON.stringify(await snap(page));
  await page.click(VC); await page.waitForTimeout(800); Object.assign(r, await snap(page));
});
await S('T21 teclado: Enter sobre View cart', {}, async (page, log, st, r) => {
  await dirty(page, 'keyboard'); await page.focus(VC); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
  Object.assign(r, await snap(page)); r.serverNote = st.note;
});
await S('T20 sin JS: View cart y Checkout', { js: false }, async (page, log, st, r) => {
  r.drawerHidden = await page.evaluate(() => document.querySelector('[data-cart-drawer-overlay]').hidden);
  await page.click('#hdr'); await page.waitForTimeout(300); Object.assign(r, await snap(page));
});

const MODS = [['Ctrl', { modifiers: ['Control'] }], ['Meta', { modifiers: ['Meta'] }], ['Shift', { modifiers: ['Shift'] }], ['Alt', { modifiers: ['Alt'] }], ['Middle', { button: 'middle' }]];
for (const [label, clickOpts] of MODS) {
  await S(`X-${label} clic modificado`, {}, async (page, log, st, r) => {
    await dirty(page, 'mod');
    await page.evaluate(() => { window.__p = []; for (const t of ['click', 'auxclick']) document.addEventListener(t, (e) => window.__p.push(`${t}:${e.defaultPrevented}`)); });
    const pages0 = page.context().pages().length;
    await page.click(VC, clickOpts); await page.waitForTimeout(500);
    Object.assign(r, await snap(page)); r.events = await page.evaluate(() => (window.__p || ['(navego)']).join(','));
    r.newPages = page.context().pages().length - pages0;
  });
}
for (const [label, mod] of [['Ctrl+Enter', 'Control+Enter'], ['Shift+Enter', 'Shift+Enter']]) {
  await S(`X-${label} teclado`, {}, async (page, log, st, r) => {
    await dirty(page, 'kmod');
    await page.evaluate(() => { window.__p = []; document.addEventListener('click', (e) => window.__p.push(`click:${e.defaultPrevented}`)); });
    const pages0 = page.context().pages().length;
    await page.focus(VC); await page.keyboard.press(mod); await page.waitForTimeout(500);
    Object.assign(r, await snap(page)); r.events = await page.evaluate(() => (window.__p || ['(navego)']).join(','));
    r.newPages = page.context().pages().length - pages0;
  });
}
const longNote = ('Línea uno\nsegunda 🎁 línea  \n').repeat(70).slice(0, 2000);
await S('X-H15 nota 2000 car. saltos/emoji + 12 lineas', { items: Array.from({ length: 12 }, (_, i) => ({ key: `k${i}`, title: 'T'.repeat(120), qty: 1 })) }, async (page, log, st, r) => {
  await page.fill('#CartDrawerNote', longNote); await page.click(VC); await page.waitForTimeout(800);
  Object.assign(r, await snap(page)); r.exact = (log.updates[0]?.body?.note === longNote);
});
await S('X-T02b nota del servidor no vacia sin editar', { serverNote: 'saved' }, async (page, log, st, r) => {
  await page.evaluate(() => { window.__p = []; document.addEventListener('click', (e) => window.__p.push(e.defaultPrevented)); });
  await page.click(VC); await page.waitForTimeout(400); Object.assign(r, await snap(page));
});
await S('X-H17 View product sucia', {}, async (page, log, st, r) => {
  await dirty(page, 'vp'); await page.click('[data-cross-sell-view]'); await page.waitForTimeout(800); Object.assign(r, await snap(page)); r.serverNote = st.note;
});
await S('X-Checkout teclado Enter sucia', {}, async (page, log, st, r) => {
  await dirty(page, 'kb checkout'); await page.focus('button[name="checkout"]'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
});

await browser.close();
const tokens = ['data-cart-view-cart', 'id="CartDrawerViewCart"', 'name="note"', 'name="checkout"', 'data-cart-drawer-content'];
const html = drawerHtml({ note: '', showNote: true, items: [{ key: 'k1', title: 'Shirt', qty: 1 }] });
const count = (t, x) => t.split(x).length - 1;
const drift = tokens.map((t) => ({ t, liquid: count(liquid, t), html: count(html, t) }));
console.log('DERIVA ' + JSON.stringify(drift) + ' ' + (drift.every((d) => d.liquid === d.html) ? 'OK' : 'DERIVA DETECTADA'));
console.log(`MODO: ${FINAL ? 'FIX (copia de trabajo)' : 'BASE ' + SHA} (sintetico)`);
for (const r of out) console.log(JSON.stringify(r));
