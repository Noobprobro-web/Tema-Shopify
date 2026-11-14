// B-03 (RC-12 / TT-102). Arnes SINTETICO (Chromium local, servidor de carrito simulado, sin tienda).
// Sirve el assets/theme.js REAL y una pagina que traduce a mano el markup relevante de
// sections/cart-drawer.liquid:35-92,155-285. page.route deja que el POST llegue al servidor
// (el alta se aplica) y despues pierde la respuesta. Sin red externa, sin credenciales.
// Uso: node agent-comms/outbox-claude/harness-B-03-001/cart-lost-response.mjs <repo> <fix|base> [SHA]
//   fix  = lee assets/theme.js de la copia de trabajo.
//   base = lo lee con `git show <SHA>:assets/theme.js` (SHA por defecto: 4e5c6d6, la base fija de B-03).
// Sin parches en memoria, sin rutas absolutas, servidor solo en 127.0.0.1 (puerto 0).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const mode = process.argv[3] || 'fix';
const SHA = process.argv[4] || '4e5c6d6';
if (!['fix', 'base'].includes(mode)) throw new Error('modo: fix | base');
const { chromium } = await import(pathToFileURL(path.join(repo, 'node_modules/playwright/index.mjs')).href);
const themeJs = mode === 'base'
  ? execFileSync('git', ['-C', repo, 'show', `${SHA}:assets/theme.js`], { encoding: 'utf8', maxBuffer: 1 << 26 })
  : fs.readFileSync(path.join(repo, 'assets/theme.js'), 'utf8');

const CATALOG = {
  101: { product: 'coat', title: 'Wool coat', variant: 'M' },
  201: { product: 'scarf', title: 'Silk scarf', variant: 'Default Title' },
  202: { product: 'belt', title: 'Leather belt', variant: 'Default Title' },
};
let lines = [];
let posts = { add: 0, change: 0, cartjs: 0 };
const reset = (initial = []) => { lines = initial.map((l) => ({ ...l })); posts = { add: 0, change: 0, cartjs: 0 }; };
const qtyOf = (id) => lines.filter((l) => l.variant_id === id).reduce((s, l) => s + l.quantity, 0);
const itemCount = () => lines.reduce((s, l) => s + l.quantity, 0);
const addLine = (id, quantity) => {
  const line = lines.find((l) => l.variant_id === id);
  if (line) line.quantity += quantity; else lines.push({ key: `${id}:h${id}`, variant_id: id, quantity });
  return lines.find((l) => l.variant_id === id);
};
const lineJson = (l) => ({ key: l.key, id: l.variant_id, variant_id: l.variant_id, quantity: l.quantity,
  product_title: CATALOG[l.variant_id].title, variant_title: CATALOG[l.variant_id].variant, url: `/products/${CATALOG[l.variant_id].product}?variant=${l.variant_id}` });

const drawerHtml = () => `<cart-drawer class="cart-drawer" data-section-id="cart-drawer" data-cart-url="/cart"
  data-cart-add-url="/cart/add.js" data-cart-change-url="/cart/change.js" data-cart-update-url="/cart/update.js"
  data-item-count="${itemCount()}" data-cart-count-label="Cart (${itemCount()})"
  data-error-message="We could not update your cart. Please try again." data-added-message="Item added to your cart."
  data-removed-template="[title] removed." data-add-failed-message="This item could not be added to your cart."
  data-update-unconfirmed-message="We could not confirm the update.">
  <div class="cart-drawer__overlay" data-cart-drawer-overlay hidden>
   <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1" data-cart-drawer-panel inert>
    <header><p data-cart-drawer-count>${itemCount()} items</p><h2 id="CartDrawerTitle" tabindex="-1">Cart</h2>
      <button type="button" aria-label="Close" data-cart-drawer-close>x</button></header>
    <p role="status" aria-live="polite" data-cart-status hidden></p>
    <p role="alert" data-cart-error hidden></p>
    <div data-cart-uncertain hidden><button type="button" data-cart-check>Check cart</button></div>
    <div data-cart-drawer-content><div data-cart-scroll><div role="list">
    ${lines.map((l) => `<div class="cart-drawer-item" role="listitem" data-cart-item-key="${l.key}" data-cart-item-title="${CATALOG[l.variant_id].title}">
      <h3 class="cart-drawer-item__title"><a href="/products/${CATALOG[l.variant_id].product}?variant=${l.variant_id}">${CATALOG[l.variant_id].title}</a></h3>
      <div data-quantity-stepper><input type="number" min="0" value="${l.quantity}" data-cart-quantity aria-label="Quantity"></div>
      <button type="button" data-cart-remove>Remove</button></div>`).join('')}
    ${lines.length ? '' : '<p data-cart-empty-message tabindex="-1">Your cart is empty</p>'}
    </div></div></div>
   </div></div></cart-drawer>`;

let noDrawer = false;
const page = () => `<!doctype html><html class="js"><head><meta charset="utf-8"><title>b03</title></head><body>
<header><a href="/cart" data-cart-count-enabled>Cart <span class="site-header__cart-count">${itemCount()}</span></a></header>
<main>
 <form method="post" action="/cart/add" id="product-form-main" data-cart-add-form>
  <input type="hidden" name="form_type" value="product"><input type="hidden" name="id" value="101" data-variant-id>
  <input type="number" name="quantity" value="1" min="1">
  <button type="submit" name="add" data-add-to-cart>Add to cart</button>
  <p role="alert" data-product-form-error hidden></p>
 </form>
 <complete-the-look data-cart-add-url="/cart/add.js" data-cart-url="/cart" data-money-format="\${{amount}}"
   data-error-message="We could not add this look. Review the selected options and try again." data-added-message="Look added.">
  <div data-bundle-item><input type="checkbox" data-bundle-select checked><input type="hidden" data-bundle-variant value="201" data-price="1000" data-quantity="1"></div>
  <div data-bundle-item><input type="checkbox" data-bundle-select checked><input type="hidden" data-bundle-variant value="202" data-price="2000" data-quantity="1"></div>
  <button type="button" data-complete-look-submit><span data-complete-look-label>Add</span></button>
  <p role="status" data-bundle-status hidden></p><p role="alert" data-bundle-error hidden></p>
 </complete-the-look>
</main>
${noDrawer ? '' : drawerHtml()}
<script src="/assets/theme.js" defer></script></body></html>`;

const readBody = (req) => new Promise((res) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => res(Buffer.concat(c).toString('utf8'))); });
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const json = (status, data) => { res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(data)); };
  if (url.pathname === '/assets/theme.js') { res.writeHead(200, { 'content-type': 'text/javascript' }); return res.end(themeJs); }
  if (url.pathname === '/' ) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page()); }
  if (url.pathname === '/cart.js') { posts.cartjs += 1; } if (url.pathname === '/cart.js') return json(200, { item_count: itemCount(), items: lines.map(lineJson) });
  if (url.pathname === '/cart' && url.searchParams.get('section_id')) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(drawerHtml()); }
  if (url.pathname === '/cart/add.js' && req.method === 'POST') {
    posts.add += 1;
    const body = await readBody(req);
    let items;
    if ((req.headers['content-type'] || '').includes('application/json')) {
      items = JSON.parse(body).items.map((i) => ({ id: Number(i.id), quantity: Number(i.quantity) || 1 }));
    } else {
      const field = (n) => body.match(new RegExp(`name="${n}"\\r\\n\\r\\n([^\\r]*)`))?.[1];
      items = [{ id: Number(field('id')), quantity: Number(field('quantity')) || 1 }];
    }
    const added = items.map((i) => lineJson(addLine(i.id, i.quantity)));
    const sections = { 'cart-drawer': drawerHtml() };
    return json(200, items.length > 1 || (req.headers['content-type'] || '').includes('application/json') ? { items: added, sections } : { ...added[0], sections });
  }
  if (url.pathname === '/cart/change.js' && req.method === 'POST') {
    posts.change += 1;
    const { id, quantity } = JSON.parse(await readBody(req));
    const line = lines.find((l) => l.key === id);
    if (line) line.quantity = quantity;
    lines = lines.filter((l) => l.quantity > 0);
    return json(200, { item_count: itemCount(), items: lines.map(lineJson), sections: { 'cart-drawer': drawerHtml() } });
  }
  res.writeHead(404); res.end('nf');
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const log = (...a) => console.log(a.join(' '));
log(`SINTETICO (Chromium local, servidor de carrito simulado, sin tienda) | modo=${mode}${mode === 'base' ? ` ${SHA}` : ''}`);
let failures = 0;
const results = [];
let current = '';
let currentFails = 0;
const check = (what, cond) => { if (!cond) { failures += 1; currentFails += 1; } log(`  ${cond ? 'OK  ' : 'FAIL'} ${what}`); };

// mode: 'ok' | 'lost' (aplica en servidor y corta la conexion) | '504' (aplica y responde HTML) | 'hang' (aplica y nunca responde)
async function scenario(name, { initial = [], mode, run, nodrawer = false }) {
  reset(initial); noDrawer = nodrawer;
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  const errors = []; const navs = [];
  pg.on('pageerror', (e) => errors.push(String(e)));
  let addMode = 'ok'; let changeMode = 'ok'; let attempts = 0;
  const pending = [];
  await pg.route('**/cart/add.js', async (route) => {
    const m = addMode; addMode = 'ok'; attempts += 1;
    if (m === 'ok') return route.continue();
    if (m === 'drop') return route.abort('connectionreset'); // nunca llega al servidor
    if (m === '200empty') return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    if (m === 'late') { setTimeout(() => { addLine(101, 1); route.abort('connectionreset').catch(() => {}); }, 11000); return; }
    if (m === '504noapply') return route.fulfill({ status: 504, contentType: 'text/html', body: '<html>Gateway Timeout</html>' });
    if (m === '429noapply') return route.fulfill({ status: 429, contentType: 'text/html', body: '<html>Too many</html>' });
    if (m === 'race') { setTimeout(() => addLine(101, 1), 400); return route.abort('connectionreset'); }
    if (m === '502noapply') return route.fulfill({ status: 502, contentType: 'text/html', body: '<html>Bad Gateway</html>' });
    if (m === '422') return route.fulfill({ status: 422, contentType: 'application/json', body: JSON.stringify({ status: 422, message: 'Cart Error', description: 'All 1 Wool coat - M are in your cart.' }) });
    const resp = await route.fetch(); // el servidor aplica el cambio
    if (m === 'lost') return route.abort('connectionreset');
    if (m === '504') return route.fulfill({ status: 504, contentType: 'text/html', body: '<html><body>Gateway Timeout</body></html>' });
    if (m === 'hang') { pending.push(route); return; }
    return route.fulfill({ response: resp });
  });
  await pg.route('**/cart/change.js', async (route) => {
    const m = changeMode; changeMode = 'ok';
    if (m === 'ok') return route.continue();
    await route.fetch();
    return route.abort('connectionreset');
  });
  let cartJsMode = 'ok';
  await pg.route('**/cart.js', async (route) => {
    if (cartJsMode === 'fail') return route.abort('internetdisconnected');
    if (cartJsMode === 'delay') await new Promise((r) => setTimeout(r, 1500));
    return route.continue();
  });
  let sectionMode = 'ok';
  await pg.route('**/cart?section_id=*', async (route) => {
    if (sectionMode === 'fail') return route.abort('internetdisconnected');
    return route.continue();
  });
  await pg.goto(`${base}/`);
  await pg.waitForFunction(() => customElements.get('cart-drawer'));
  pg.on('framenavigated', (f) => { if (f === pg.mainFrame() && new URL(f.url()).pathname !== '/') navs.push(new URL(f.url()).pathname); });
  const api = {
    pg,
    setAdd: (m) => { addMode = m; },
    setChange: (m) => { changeMode = m; },
    setCartJs: (m) => { cartJsMode = m; },
    setSection: (m) => { sectionMode = m; },
    serverAdd: (id, q) => addLine(id, q),
    serverSet: (initial) => { lines = initial.map((l) => ({ ...l })); },
    serverQty: (id) => qtyOf(id),
    posts: () => ({ ...posts }),
    attempts: () => attempts,
    navs: () => navs.join(',') || '-',
    state: () => pg.evaluate(() => ({
      formError: document.querySelector('[data-product-form-error]')?.hidden ? null : document.querySelector('[data-product-form-error]')?.textContent,
      drawerOpen: !!document.querySelector('cart-drawer')?.hasAttribute('data-open'),
      drawerError: document.querySelector('[data-cart-error]')?.hidden ? null : document.querySelector('[data-cart-error]')?.textContent,
      drawerStatus: document.querySelector('[data-cart-status]')?.hidden ? null : document.querySelector('[data-cart-status]')?.textContent,
      uncertainVisible: !!document.querySelector('[data-cart-uncertain]') && !document.querySelector('[data-cart-uncertain]').hidden,
      headerCount: document.querySelector('.site-header__cart-count')?.textContent,
      drawerQty: Array.from(document.querySelectorAll('[data-cart-quantity]')).map((i) => i.value).join(','),
      addDisabled: document.querySelector('[data-add-to-cart]')?.disabled ?? null,
      focus: document.activeElement ? (document.activeElement.tagName === 'BUTTON' ? document.activeElement.textContent.trim().slice(0, 30) : document.activeElement.tagName.toLowerCase()) : null,
      pendingFlag: document.querySelector('#product-form-main')?.dataset.cartAddPending || null,
      bundleError: document.querySelector('[data-bundle-error]')?.hidden ? null : document.querySelector('[data-bundle-error]')?.textContent,
      bundleStatus: document.querySelector('[data-bundle-status]')?.hidden ? null : document.querySelector('[data-bundle-status]')?.textContent,
    })),
  };
  current = name.split(' ')[0]; currentFails = 0;
  log(`\n## ${name}`);
  try { await run(api); } catch (e) { log('EXCEPCION', e.message); check('sin excepcion del escenario', false); }
  check('sin pageerror', errors.length === 0);
  if (errors.length) log('  pageerror:', errors.join(' | '));
  results.push(`${current}=${currentFails ? 'FAIL' : 'OK'}`);
  pending.forEach((r) => r.abort().catch(() => {}));
  await ctx.close();
}

const settle = (pg, ms = 600) => pg.waitForTimeout(ms);
const CONFIRM = 'We could not confirm the update.';
const AGAIN = 'We could not update your cart. Please try again.';
const fact = async (a, extra = '') => {
  const st = await a.state();
  log(`  101=${a.serverQty(101)} 201/202=${a.serverQty(201)}/${a.serverQty(202)} POSTadd=${a.attempts()} GETcart=${a.posts().cartjs} nav=${a.navs()} ${extra}`.trimEnd());
  log(`  estado ${JSON.stringify(st)}`);
  return st;
};
const submit = (a) => a.pg.evaluate(() => document.querySelector('#product-form-main').requestSubmit(document.querySelector('[data-add-to-cart]')));
const submitLook = (a) => a.pg.evaluate(() => document.querySelector('[data-complete-look-submit]').click());
// El comprador reintenta solo si el tema se lo pide.
const retryProduct = async (a, st) => { if (st.formError?.includes('try again')) { await submit(a); await settle(a.pg); log('  (el comprador reintenta)'); return fact(a); } return st; };
const retryLook = async (a, st) => { if (st.bundleError?.includes('try again')) { await submitLook(a); await settle(a.pg); log('  (el comprador reintenta)'); return fact(a); } return st; };
const successProduct = (st) => st.drawerOpen && st.drawerStatus === 'Item added to your cart. Wool coat - M' && st.formError === null && st.drawerError === null;
const uncertainShown = (st) => st.drawerOpen && st.drawerError === CONFIRM && st.uncertainVisible && st.focus === 'Check cart';

await scenario('D0 control: alta normal, cajon cerrado', { run: async (a) => {
  await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('101=1, cajon abierto y estado de exito', a.serverQty(101) === 1 && st.drawerOpen && st.drawerStatus === 'Item added to your cart. Wool coat - M');
} });

await scenario('D1 PDP, respuesta perdida tras aplicar, cajon cerrado', { run: async (a) => {
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await retryProduct(a, await fact(a));
  check('101=1 (sin duplicar), un solo POST de alta', a.serverQty(101) === 1 && a.attempts() === 1);
  check('cajon abierto con exito, sin error de formulario, contador 1', successProduct(st) && st.headerCount === '1');
} });

await scenario('D2 PDP, 504 HTML tras aplicar, cajon cerrado', { run: async (a) => {
  a.setAdd('504'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await retryProduct(a, await fact(a));
  check('101=1 (sin duplicar), un solo POST de alta', a.serverQty(101) === 1 && a.attempts() === 1);
  check('cajon abierto con exito, sin error de formulario', successProduct(st));
} });

await scenario('D3 PDP con linea previa (101 x2), respuesta perdida tras aplicar', { initial: [{ key: '101:h101', variant_id: 101, quantity: 2 }], run: async (a) => {
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await retryProduct(a, await fact(a));
  check('101=3 y contador 3', a.serverQty(101) === 3 && st.headerCount === '3');
  check('cajon abierto con exito, sin error de formulario', successProduct(st));
} });

await scenario('D4 PDP, peticion colgada (aplicada, sin respuesta), 12 s', { run: async (a) => {
  a.setAdd('hang'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 12000);
  const st = await fact(a);
  check('101=1, cajon abierto con exito', a.serverQty(101) === 1 && successProduct(st));
  check('boton habilitado y sin data-cart-add-pending', st.addDisabled === false && st.pendingFlag === null);
} });

await scenario('D5 complete the look, respuesta perdida tras aplicar', { run: async (a) => {
  a.setAdd('lost'); await a.pg.click('[data-complete-look-submit]'); await settle(a.pg);
  const st = await retryLook(a, await fact(a));
  check('201/202=1/1 (sin duplicar), un solo POST de alta', a.serverQty(201) === 1 && a.serverQty(202) === 1 && a.attempts() === 1);
  check('cajon abierto, "Look added." en cajon y en el bloque', st.drawerOpen && st.drawerStatus === 'Look added.' && st.bundleStatus === 'Look added.' && st.bundleError === null);
} });

await scenario('D6 control changeLine: cajon abierto, 1 a 3, respuesta perdida; reintento', { initial: [{ key: '101:h101', variant_id: 101, quantity: 1 }], run: async (a) => {
  await a.pg.click('header a[href="/cart"]'); await settle(a.pg);
  a.setChange('lost');
  await a.pg.fill('[data-cart-quantity]', '3'); await a.pg.dispatchEvent('[data-cart-quantity]', 'change'); await settle(a.pg, 1000);
  await a.pg.fill('[data-cart-quantity]', '3'); await a.pg.dispatchEvent('[data-cart-quantity]', 'change'); await settle(a.pg, 1000);
  log(`  101=${a.serverQty(101)} POSTchange=${a.posts().change}`);
  check('cantidad absoluta: 101=3 tras el reintento (no se suma)', a.serverQty(101) === 3);
} });

await scenario('E1 respuesta perdida SIN aplicar (no llega al servidor)', { run: async (a) => {
  a.setAdd('drop'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('101=0 y 1 GET a /cart.js', a.serverQty(101) === 0 && a.posts().cartjs === 1);
  check('cajon abierto con "We could not confirm the update.", Check cart visible y enfocado', uncertainShown(st));
  check('sin error de formulario ("try again")', st.formError === null);
  const check1 = await a.pg.$('[data-cart-check]:not([hidden])');
  if (check1 && await check1.isVisible()) { await check1.click(); await settle(a.pg, 800); }
  await submit(a); await settle(a.pg);
  log(`  tras Check cart y una nueva alta: 101=${a.serverQty(101)}`);
  check('una nueva alta deja 101=1', a.serverQty(101) === 1);
} });

await scenario('E2 perdida tras aplicar con /cart.js y seccion caidos; luego vuelve la red y Check cart', { run: async (a) => {
  a.setAdd('lost'); a.setCartJs('fail'); a.setSection('fail');
  await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 1200);
  const st = await fact(a);
  check('cajon con aviso, Check cart visible y enfocado, sin error de formulario', uncertainShown(st) && st.formError === null);
  a.setCartJs('ok'); a.setSection('ok');
  const c = await a.pg.$('[data-cart-check]:not([hidden])');
  if (c && await c.isVisible()) { await c.click(); await settle(a.pg, 800); }
  const st2 = await fact(a, '(tras Check cart)');
  check('tras Check cart: 101=1, POST add=1, cantidad 1 en el cajon', a.serverQty(101) === 1 && a.attempts() === 1 && st2.drawerQty === '1');
} });

await scenario('E3 422 JSON (fallo confirmado): sin lectura de reconciliacion', { run: async (a) => {
  a.setAdd('422'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('mensaje del servidor en el formulario y 0 GET', st.formError === 'All 1 Wool coat - M are in your cart.' && a.posts().cartjs === 0);
} });

await scenario('E4 alta normal: sin coste extra', { run: async (a) => {
  await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  await fact(a);
  check('0 GET a /cart.js y 1 POST de alta', a.posts().cartjs === 0 && a.attempts() === 1);
} });

await scenario('E5 cantidad 3, respuesta perdida tras aplicar', { run: async (a) => {
  await a.pg.fill('input[name="quantity"]', '3');
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await retryProduct(a, await fact(a));
  check('101=3 y exito', a.serverQty(101) === 3 && successProduct(st));
} });

await scenario('E6 doble envio durante la reconciliacion (/cart.js lento 1,5 s)', { run: async (a) => {
  a.setAdd('lost'); a.setCartJs('delay');
  await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 300);
  const mid = await a.state();
  await submit(a); await settle(a.pg, 2500);
  await fact(a);
  log(`  durante: pendingFlag=${mid.pendingFlag} addDisabled=${mid.addDisabled}`);
  check('durante la reconciliacion: pendiente y boton deshabilitado', mid.pendingFlag === 'true' && mid.addDisabled === true);
  check('final: 101=1 y un solo POST de alta', a.serverQty(101) === 1 && a.attempts() === 1);
} });

await scenario('E7 otra pestana ANADE la misma variante tras cargar (visible); perdida tras aplicar', { run: async (a) => {
  a.serverAdd(101, 1);
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('101=2 y exito', a.serverQty(101) === 2 && successProduct(st));
} });

await scenario('E8 otra ventana visible QUITA la linea tras cargar; perdida tras aplicar', { initial: [{ key: '101:h101', variant_id: 101, quantity: 1 }], run: async (a) => {
  a.serverSet([]);
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await retryProduct(a, await fact(a));
  check('101=1 (sin duplicar)', a.serverQty(101) === 1);
  check('Check cart y nada invita a reintentar ("try again")', st.uncertainVisible && st.formError === null);
} });

await scenario('E8b igual con la pestana oculta entre medias (visibilitychange)', { initial: [{ key: '101:h101', variant_id: 101, quantity: 1 }], run: async (a) => {
  const vis = (s) => a.pg.evaluate((v) => { Object.defineProperty(document, 'visibilityState', { value: v, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }, s);
  await vis('hidden'); a.serverSet([]); await vis('visible');
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('2 GET (linea base y reconciliacion), exito y 101=1', a.posts().cartjs === 2 && a.serverQty(101) === 1 && successProduct(st));
} });

await scenario('E9 complete the look, respuesta perdida SIN aplicar', { run: async (a) => {
  a.setAdd('drop'); await a.pg.click('[data-complete-look-submit]'); await settle(a.pg);
  const st = await fact(a);
  check('201/202=0/0', a.serverQty(201) === 0 && a.serverQty(202) === 0);
  check('cajon con el aviso y sin error del look', st.drawerOpen && st.drawerError === CONFIRM && st.uncertainVisible && st.bundleError === null);
} });

await scenario('E10 complete the look, perdida tras aplicar con /cart.js y seccion caidos', { run: async (a) => {
  a.setAdd('lost'); a.setCartJs('fail'); a.setSection('fail');
  await a.pg.click('[data-complete-look-submit]'); await settle(a.pg, 1200);
  const st = await fact(a);
  check('cajon con aviso y Check cart; sin error del look', st.drawerOpen && st.drawerError === CONFIRM && st.uncertainVisible && st.bundleError === null);
} });

await scenario('E11 200 {} (variante que exige plan, forma medida F06): fallo confirmado', { run: async (a) => {
  a.setAdd('200empty'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('"This item could not be added to your cart." y 0 GET', st.formError === 'This item could not be added to your cart.' && a.posts().cartjs === 0);
} });

await scenario('E12 colgada SIN aplicar; el servidor la aplica a los 11 s (tras el plazo de 10 s)', { run: async (a) => {
  a.setAdd('late'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 10600);
  const st = await fact(a, '(a 10,6 s)');
  check('a 10,6 s: cajon con aviso y Check cart, sin "try again"', uncertainShown(st) && st.formError === null);
  await settle(a.pg, 900);
  const st2 = await retryProduct(a, await fact(a, '(final)'));
  check('final: 101=1 y ningun POST extra', a.serverQty(101) === 1 && a.attempts() === 1);
  check('el boton queda libre', st2.addDisabled === false && st2.pendingFlag === null);
} });

await scenario('E13 504 HTML SIN aplicar (pasarela): puede entrar despues', { run: async (a) => {
  a.setAdd('504noapply'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('Check cart, 1 GET, sin "try again"', st.uncertainVisible && a.posts().cartjs === 1 && st.formError === null);
} });

await scenario('E14 502 HTML SIN aplicar: cualquier 5xx puede entrar despues', { run: async (a) => {
  a.setAdd('502noapply'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('Check cart, 1 GET, sin "try again"', st.uncertainVisible && a.posts().cartjs === 1 && st.formError === null);
} });

await scenario('E15 complete the look SIN cajon, perdida tras aplicar', { nodrawer: true, run: async (a) => {
  a.setAdd('lost'); await a.pg.click('[data-complete-look-submit]'); await settle(a.pg, 1200);
  await fact(a);
  check('navega a /cart; 201/202=1/1; un solo POST', a.navs() === '/cart' && a.serverQty(201) === 1 && a.serverQty(202) === 1 && a.attempts() === 1);
} });

await scenario('E16 complete the look SIN cajon, perdida SIN aplicar', { nodrawer: true, run: async (a) => {
  a.setAdd('drop'); await a.pg.click('[data-complete-look-submit]'); await settle(a.pg, 1200);
  await fact(a);
  check('navega a /cart (muestra el carrito real); 201/202=0/0', a.navs() === '/cart' && a.serverQty(201) === 0 && a.serverQty(202) === 0);
} });

await scenario('E17 tras un alta sin confirmar con red caida (cajon obsoleto), 2.a alta perdida tras aplicar', { run: async (a) => {
  a.setAdd('lost'); a.setCartJs('fail'); a.setSection('fail');
  await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 1200);
  a.setCartJs('ok'); a.setSection('fail');
  await a.pg.click('[data-cart-drawer-close]').catch(() => {}); await settle(a.pg, 300);
  const before = a.posts().cartjs;
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 1200);
  const st = await fact(a, `GETen2a=${a.posts().cartjs - before}`);
  check('2 GET en la 2.a alta (linea base y reconciliacion), exito, 101=2', a.posts().cartjs - before === 2 && a.serverQty(101) === 2 && st.drawerStatus === 'Item added to your cart. Wool coat - M');
} });

await scenario('E18 muchos: 40 lineas y la variante en 2 lineas (1+2); perdida tras aplicar', { initial: [{ key: '101:a', variant_id: 101, quantity: 1 }, { key: '101:b', variant_id: 101, quantity: 2 }, ...Array.from({ length: 38 }, (_, i) => ({ key: `20${i % 2 + 1}:x${i}`, variant_id: 201 + (i % 2), quantity: 1 }))], run: async (a) => {
  a.setAdd('lost'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 1000);
  const st = await retryProduct(a, await fact(a));
  check('101=4, exito, contador 42 y 1 GET', a.serverQty(101) === 4 && successProduct(st) && st.headerCount === '42' && a.posts().cartjs === 1);
} });

await scenario('R1 429 HTML SIN aplicar: la unica rama que invita a reintentar', { run: async (a) => {
  a.setAdd('429noapply'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg);
  const st = await fact(a);
  check('"try again", 1 GET, 101=0', st.formError === AGAIN && a.posts().cartjs === 1 && a.serverQty(101) === 0);
} });

await scenario('R5 carrera: la conexion se corta y el servidor aplica 400 ms despues', { run: async (a) => {
  a.setAdd('race'); await a.pg.click('[data-add-to-cart]'); await settle(a.pg, 1000);
  const st = await retryProduct(a, await fact(a));
  check('Check cart, sin "try again"', st.uncertainVisible && st.formError === null);
  check('101=1 y ningun POST extra', a.serverQty(101) === 1 && a.attempts() === 1);
} });

await browser.close();
server.close();
log(`\nresultados ${results.join(' ')}`);
log(`resumen fallos=${failures}`);
process.exitCode = failures ? 1 : 0;
