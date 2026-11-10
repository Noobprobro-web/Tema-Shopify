// Verificacion local de capture.mjs, sin tienda ni credenciales.
// Servidor Node que sirve paginas de producto sinteticas con el marcado sin JS del tema
// (form POST /cart/add multipart, input hidden id deshabilitado, select name=id nativo,
// opciones agotadas deshabilitadas, boton deshabilitado si la variante cargada no se
// puede comprar). Chromium con JavaScript desactivado. Un router previo imita la parte
// de D28 que importa aqui: GET/HEAD al origen pasan y toda mutacion se bloquea.
//
// Uso: PLAYWRIGHT_MODULE=/ruta/node_modules/playwright/index.mjs node local-test.mjs
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { installNativeCartAddCapture, runNoJsVariantCase, readDisplayed, evaluateCase, classifyRequest, parseCartAddPayload } from './capture.mjs';

const playwrightModule = process.env.PLAYWRIGHT_MODULE || resolve(process.cwd(), 'node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightModule).href);

// ---------- catalogo y marcado sintetico ----------
const PRESETS = {
  sartorial: { action: '/cart/add', quantityInput: false, properties: null },
  imprint: { action: '/cart/add', quantityInput: false, properties: { Engraving: 'AB' } },
  archive: { action: '/es/cart/add', quantityInput: true, properties: null },
};
const CATALOGS = {
  available: [{ id: 1101, title: 'S', available: true }, { id: 1102, title: 'M', available: true }, { id: 1103, title: 'L', available: true }],
  'sold-out': [{ id: 2201, title: 'S', available: true }, { id: 2202, title: 'M', available: false }, { id: 2203, title: 'L', available: true }],
};
const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function form({ preset, surface, variants, selected, mutate, otherOrigin }) {
  const config = PRESETS[preset];
  const sid = surface === 'pdp' ? 'main' : 'fs';
  const canAdd = selected.available;
  let action = config.action;
  if (mutate === 'ajax-endpoint') action = '/cart/add.js';
  if (mutate === 'other-origin') action = `${otherOrigin}/cart/add`;
  const options = variants.map((v) => `<option value="${v.id}"${v.id === selected.id ? ' selected' : ''}${!v.available && v.id !== selected.id ? ' disabled' : ''}>${esc(v.title)}${v.available ? '' : ' / Sold out'}</option>`).join('');
  // Payload incorrecto: el hidden id queda habilitado, asi FormData lleva A y B.
  const hiddenDisabled = mutate === 'stale-hidden-id' ? '' : ' disabled';
  const selectName = mutate === 'select-without-name' ? '' : ' name="id"';
  const quantity = config.quantityInput ? '<input type="number" name="quantity" value="2" min="1">' : '';
  const properties = config.properties ? Object.entries(config.properties).map(([k, v]) => `<input type="text" name="properties[${esc(k)}]" value="${esc(v)}">`).join('') : '';
  return `<section data-section-id="${sid}" data-preset="${preset}"><div class="variant-picker js-only"><input type="radio" name="options[Size]" value="S"></div>
  <form method="post" action="${esc(action)}" id="${surface === 'pdp' ? 'product-form' : 'featured-product-form'}-${sid}" accept-charset="UTF-8" enctype="multipart/form-data" data-cart-add-form>
    <input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="&#10003;">
    <input type="hidden" name="id" value="${selected.id}" data-variant-id${hiddenDisabled}>
    <div class="form-field no-js-only"><label for="V-${sid}">Choose options</label><select id="V-${sid}"${selectName} autocomplete="off" data-no-js-control>${options}</select></div>
    ${quantity}${properties}
    <button type="submit" name="add" data-add-to-cart${canAdd ? '' : ' disabled'}>${canAdd ? 'Add' : 'Sold out'}</button>
  </form></section>`;
}

function page(query, otherOrigin) {
  const preset = query.get('preset');
  const surface = query.get('surface');
  const variants = CATALOGS[query.get('catalog')];
  // ?variant= solo aplica a la PDP; el destacado usa su variante por defecto.
  const requested = surface === 'pdp' ? variants.find((v) => String(v.id) === query.get('variant')) : null;
  const selected = requested || variants.find((v) => v.available);
  const body = form({ preset, surface, variants, selected, mutate: query.get('mutate'), otherOrigin });
  return `<!doctype html><html class="no-js" lang="es"><head><meta charset="utf-8"><title>${preset}</title>
<style>.js .no-js-only,.no-js .js-only{display:none!important}</style></head><body><main>${surface === 'featured' ? '<h1>Home</h1>' : ''}${body}</main></body></html>`;
}

function createServer(label, getOtherOrigin) {
  const log = [];
  const server = http.createServer((req, res) => {
    const address = new URL(req.url, 'http://local');
    log.push({ method: req.method, pathname: address.pathname });
    if (req.method === 'GET' && address.pathname === '/page') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(page(address.searchParams, getOtherOrigin()));
      return;
    }
    // Si algo llega aqui, la prueba lo cuenta como envio real.
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end(`${label} recibido`);
  });
  return { server, log };
}

const primary = createServer('primary', () => secondaryOrigin);
const secondary = createServer('secondary', () => '');
await new Promise((r) => primary.server.listen(0, '127.0.0.1', r));
await new Promise((r) => secondary.server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${primary.server.address().port}`;
const secondaryOrigin = `http://127.0.0.1:${secondary.server.address().port}`;

const browser = await chromium.launch();
const results = [];
const record = (group, id, ok, detail) => { results.push({ group, id, ok }); console.log(`${ok ? 'PASS' : 'FAIL'} ${group} ${id} :: ${JSON.stringify(detail)}`); };

// Router previo con la regla de mutaciones de D28: lectura permitida, el resto bloqueado.
async function newContext({ leaky = false } = {}) {
  const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: 'block' });
  const policy = { blocked: [] };
  await context.route('**/*', async (route) => {
    const request = route.request();
    if ((request.method() === 'GET' || request.method() === 'HEAD') && new URL(request.url()).origin === origin) { await route.continue(); return; }
    policy.blocked.push({ method: request.method(), pathname: new URL(request.url()).pathname });
    await route.abort('blockedbyclient');
  });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  const log = await installNativeCartAddCapture(context, { origin, mainFrameOf: () => page.mainFrame() });
  if (leaky) {
    // Solo para el caso negativo: una ruta registrada despues (se ejecuta primero) que
    // reenvia el POST. El arnes debe detectarlo como REQUEST_REACHED_SERVER.
    await context.route('**/*', async (route) => { if (route.request().method() === 'POST') await route.continue(); else await route.fallback(); });
  }
  return { context, page, log, policy };
}
const formSelector = (surface) => (surface === 'pdp' ? 'form#product-form-main' : 'form#featured-product-form-fs');
const load = (page, params) => page.goto(`${origin}/page?${new URLSearchParams(params)}`, { waitUntil: 'load' });

// ---------- reglas puras: clasificacion y parseo ----------
{
  const base = { origin, method: 'POST', resourceType: 'document', isNavigation: true, primaryFrame: true };
  const cases = [
    ['/cart/add nativo', { ...base, url: `${origin}/cart/add` }, true],
    ['/fr-ca/cart/add nativo', { ...base, url: `${origin}/fr-ca/cart/add` }, true],
    ['/cart/add con query', { ...base, url: `${origin}/cart/add?x=1` }, false],
    ['/cart/add.js', { ...base, url: `${origin}/cart/add.js` }, false],
    ['/cart/update', { ...base, url: `${origin}/cart/update` }, false],
    ['GET /cart/add', { ...base, method: 'GET', url: `${origin}/cart/add` }, false],
    ['fetch, no navegacion', { ...base, resourceType: 'fetch', isNavigation: false, url: `${origin}/cart/add` }, false],
    ['iframe', { ...base, primaryFrame: false, url: `${origin}/cart/add` }, false],
    ['otro origen', { ...base, url: 'https://example.com/cart/add' }, false],
  ];
  for (const [label, input, capture] of cases) record('REGLA', label, classifyRequest(input).capture === capture, classifyRequest(input));
  const urlencoded = parseCartAddPayload(Buffer.from('form_type=product&id=42&quantity=3&selling_plan=7&properties%5BNote%5D=x'), 'application/x-www-form-urlencoded');
  record('REGLA', 'parseo urlencoded', JSON.stringify(urlencoded) === JSON.stringify({ id: ['42'], quantity: ['3'], sellingPlan: ['7'], properties: { Note: ['x'] } }), urlencoded);
}

// ---------- 12 casos A->B: 3 presets x PDP/destacado x catalogo disponible/con agotada ----------
const postsBefore = primary.log.filter((e) => e.method !== 'GET').length;
for (const preset of Object.keys(PRESETS)) {
  for (const surface of ['pdp', 'featured']) {
    for (const catalog of ['available', 'sold-out']) {
      const variants = CATALOGS[catalog];
      const a = variants[0];
      const b = variants[2]; // B disponible; en "sold-out" la intermedia esta agotada
      const { context, page, log, policy } = await newContext();
      try {
        await load(page, { preset, surface, catalog, ...(surface === 'pdp' ? { variant: a.id } : {}) });
        const loaded = await readDisplayed(page, formSelector(surface));
        const soldOutOption = catalog === 'sold-out' ? await page.locator(`${formSelector(surface)} select option[value="${variants[1].id}"]`).isDisabled() : null;
        const expected = { variantId: String(b.id), quantity: PRESETS[preset].quantityInput ? 2 : 1, sellingPlan: null, productHasSellingPlans: false, properties: PRESETS[preset].properties };
        const outcome = await runNoJsVariantCase(page, log, { formSelector: formSelector(surface), variantA: String(a.id), variantB: String(b.id), expected });
        const ok = outcome.result === 'PASS' && loaded.selectedOptionValue === String(a.id) && (soldOutOption === null || soldOutOption === true) && policy.blocked.length === 0 && log.captures.length === 1;
        record('A->B', `${preset}/${surface}/${catalog}`, ok, { loadedA: loaded.selectedOptionValue, soldOutOptionDisabled: soldOutOption, ...outcome, d28Blocked: policy.blocked.length });
      } catch (error) {
        record('A->B', `${preset}/${surface}/${catalog}`, false, { exception: String(error.message).split('\n')[0].slice(0, 120) });
      } finally { await context.close(); }
    }
  }
}
const capturedCount = results.filter((r) => r.group === 'A->B' && r.ok).length;
const postsAfter = primary.log.filter((e) => e.method !== 'GET').length;
const cartHits = primary.log.filter((e) => e.pathname.includes('/cart')).length;
record('TOTAL', 'capturados 12/12', capturedCount === 12, { capturedCount });
record('TOTAL', 'cero peticiones de mutacion o /cart en el servidor', postsAfter - postsBefore === 0 && cartHits === 0, { posts: postsAfter - postsBefore, cartHits });

// ---------- control: variante agotada cargada por URL no se puede enviar sin JS ----------
{
  const { context, page, log } = await newContext();
  try {
    await load(page, { preset: 'sartorial', surface: 'pdp', catalog: 'sold-out', variant: 2202 });
    const disabled = await page.locator(`${formSelector('pdp')} [type="submit"]`).isDisabled();
    record('CONTROL', 'URL de variante agotada: boton deshabilitado y sin captura', disabled && log.captures.length === 0, { disabled, captures: log.captures.length });
  } finally { await context.close(); }
}

// ---------- negativos: deben dar FAIL del caso, sin llegar al servidor ----------
const NEGATIVES = [
  { id: 'payload con id A y B (hidden habilitado)', mutate: 'stale-hidden-id', expectFailure: 'PAYLOAD_ID_NOT_SINGLE' },
  { id: 'select sin name: no se envia ningun id', mutate: 'select-without-name', expectFailure: 'PAYLOAD_ID_NOT_EXPECTED_VARIANT' },
  { id: 'id esperado distinto de B', mutate: null, wrongExpected: true, expectFailure: 'EXPECTED_ID_NOT_VARIANT_B' },
  { id: 'POST a /cart/add.js', mutate: 'ajax-endpoint', expectFailure: 'NO_NATIVE_CART_ADD_CAPTURED' },
  { id: 'POST a otro origen', mutate: 'other-origin', expectFailure: 'NO_NATIVE_CART_ADD_CAPTURED' },
  { id: 'peticion reenviada', mutate: null, leaky: true, expectFailure: 'REQUEST_REACHED_SERVER' },
];
for (const negative of NEGATIVES) {
  const before = { primary: primary.log.filter((e) => e.method !== 'GET').length, secondary: secondary.log.length };
  const { context, page, log, policy } = await newContext({ leaky: Boolean(negative.leaky) });
  try {
    await load(page, { preset: 'sartorial', surface: 'pdp', catalog: 'available', variant: 1101, ...(negative.mutate ? { mutate: negative.mutate } : {}) });
    const selector = formSelector('pdp');
    let outcome;
    if (negative.mutate === 'select-without-name') {
      await page.locator(`${selector} select`).selectOption('1103');
      // Sin name=id el arnes no encuentra el selector nativo: se envia igual para medir el payload.
      const displayed = await readDisplayed(page, selector);
      await Promise.allSettled([page.waitForEvent('requestfailed', { timeout: 3000 }), page.locator(`${selector} [type="submit"]`).click({ noWaitAfter: true })]);
      outcome = evaluateCase({ expected: { variantId: '1103', productHasSellingPlans: false }, displayed: { ...displayed, selectedOptionValue: '1103' }, captures: log.captures, blockedOther: log.nonCaptureMutations, reachedServer: log.reachedServer });
    } else {
      outcome = await runNoJsVariantCase(page, log, { formSelector: selector, variantA: '1101', variantB: '1103', expected: { variantId: negative.wrongExpected ? '1102' : '1103', productHasSellingPlans: false } });
    }
    const after = { primary: primary.log.filter((e) => e.method !== 'GET').length, secondary: secondary.log.length };
    const serverHits = after.primary - before.primary + after.secondary - before.secondary;
    const reachedExpected = negative.leaky ? serverHits === 1 : serverHits === 0;
    const ok = outcome.result === 'FAIL' && outcome.failures.includes(negative.expectFailure) && reachedExpected;
    record('NEG', negative.id, ok, { result: outcome.result, failures: outcome.failures, serverHits, d28Blocked: policy.blocked.length });
  } catch (error) {
    record('NEG', negative.id, false, { exception: String(error.message).split('\n')[0].slice(0, 120) });
  } finally { await context.close(); }
}

await browser.close();
primary.server.close();
secondary.server.close();
const failed = results.filter((r) => !r.ok);
console.log(`\nRESUMEN ${results.length - failed.length}/${results.length} comprobaciones del arnes correctas`);
process.exit(failed.length ? 1 : 0);
