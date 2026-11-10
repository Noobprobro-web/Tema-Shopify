// Pruebas locales de las condiciones C1-C3 de REVIEW-B02H-001 y de los negativos del
// revisor adaptados a la API nueva. Sin tienda ni credenciales reales: servidor Node
// local y un router que imita la regla de mutaciones de D28 (la regla real de carrito se
// prueba aparte con requestDecision cargado de run.mjs, sin red).
//
// Uso: PLAYWRIGHT_MODULE=/ruta/node_modules/playwright/index.mjs node conditions-test.mjs
import http from 'node:http';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { installNativeCartAddCapture, runNoJsVariantCase, evaluateCase } from './capture.mjs';
import { parseArgs, readCredentials, validateFixture, loadD28Policy, createB02Session, assertNonCartSession, installRoutes, probeJavaScriptRan, runB02, redactReport, D28_RUNNER_PATH } from './run-b02.mjs';

const playwrightModule = process.env.PLAYWRIGHT_MODULE || resolve(process.cwd(), 'node_modules/playwright/index.mjs');
const { chromium } = await import(pathToFileURL(playwrightModule).href);

const THEME = '190232297715';
const SECRET_PROPERTY = 'tok-PROP-9f3';
const COOKIE_VALUE = 'COOKIEVAL-77ab';
const results = [];
const record = (group, id, ok, detail) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${group} ${id} :: ${JSON.stringify(detail)}`); };
const codeOf = (fn) => { try { fn(); return null; } catch (error) { return error.code || error.name; } };
const asyncCodeOf = async (fn) => { try { await fn(); return null; } catch (error) { return error.code || error.name; } };

// ---------- servidor ----------
const hits = [];
const opts = (ids, sel) => ids.map((v) => `<option value="${v}"${v === sel ? ' selected' : ''}>${v || 'vacio'}</option>`).join('');
const themeScript = (id = THEME, role = 'unpublished') => `<script>var Shopify = Shopify || {};\nShopify.theme = {"name":"T; x","id":${id},"schema_name":"S","role":"${role}","style":{"id":null,"handle":null}};\ndocument.documentElement.setAttribute('data-inline-js','1');</script>`;
function productForm({ id = 'pf', action = '/cart/add', extra = '', inner = '', selected = '1101', ids = ['1101', '1103'], enctype = 'multipart/form-data' } = {}) {
  return `<form method="post" action="${action}" id="${id}" enctype="${enctype}"${extra}><input type="hidden" name="id" value="${selected}" disabled><select name="id">${opts(ids, selected)}</select>${inner}<button type="submit" name="add">Add</button></form>`;
}
const PAGES = {
  // runner B-02
  '/products/base': (q) => productForm({ selected: q.get('variant') || '1101' }),
  '/': () => '<h1>Home</h1>' + productForm({ id: 'featured-fs' }),
  '/products/plans-empty': () => productForm({ inner: '<input type="hidden" name="selling_plan" value="">' }),
  '/products/plan-5': () => productForm({ inner: '<select name="selling_plan"><option value="">once</option><option value="5" selected>5</option></select>' }),
  '/products/prop': () => productForm({ inner: `<input type="text" name="properties[_secret]" value="${SECRET_PROPERTY}">` }),
  '/products/ajax': () => productForm({ action: '/cart/add.js' }),
  '/products/wrongtheme': () => productForm(),
  '/products/published': () => productForm(),
  // negativos del revisor
  '/p/base': () => productForm(),
  '/p/iframe': () => productForm({ extra: ' target="f"' }) + '<iframe name="f" title="f"></iframe>',
  '/p/blank': () => productForm({ extra: ' target="_blank"' }),
  '/p/plans': () => productForm({ inner: '<input type="hidden" name="selling_plan" value="5"><input type="hidden" name="selling_plan" value="">' }),
  '/p/props': () => productForm({ inner: `<input type="text" name="properties[_secret]" value="${SECRET_PROPERTY}">` }),
  '/p/formattr': () => productForm() + '<input type="hidden" name="id" value="1101" form="pf">',
  '/p/textplain': () => productForm({ enctype: 'text/plain' }),
};
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  hits.push({ m: req.method, p: u.pathname });
  const render = PAGES[u.pathname];
  if (req.method === 'GET' && render) {
    const theme = u.pathname === '/products/wrongtheme' ? themeScript('999') : u.pathname === '/products/published' ? themeScript(THEME, 'main') : themeScript();
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'set-cookie': `cart_sess=${COOKIE_VALUE}; Path=/` });
    res.end(`<!doctype html><html lang="es"><head><title>t</title>${theme}</head><body><main>${render(u.searchParams)}</main></body></html>`);
    return;
  }
  res.writeHead(200, { 'content-type': 'text/plain' }); res.end('ok');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const posts = () => hits.filter((h) => h.m !== 'GET' && h.m !== 'HEAD').length;

// Router que imita D28: lectura del origen permitida; POST a CART_POST_PATHS solo con la
// misma condicion de modo cart que run.mjs:260; todo lo demas abortado.
const CART_POST_PATHS = new Set(['/cart/add.js', '/cart/update.js', '/cart/clear.js']);
const stubPolicy = {
  AUTHORIZED_THEME_IDS: new Set([THEME]),
  createRouter(session) {
    return async (route) => {
      const r = route.request();
      const u = new URL(r.url());
      let primary = false;
      try { primary = r.frame() === session.page.mainFrame(); } catch { primary = false; }
      if ((r.method() === 'GET' || r.method() === 'HEAD') && u.origin === origin) { await route.continue(); return; }
      if (r.method() === 'POST' && u.origin === origin && CART_POST_PATHS.has(u.pathname) && session.mode === 'cart' && session.cartWriteEnabled && session.cartAuthorization && primary) { await route.continue(); return; }
      session.blockedRequests += 1;
      await route.abort('blockedbyclient');
    };
  },
  assertStorePage(page, session) {
    const u = new URL(page.url());
    if (u.origin !== origin) throw Object.assign(new Error('x'), { code: 'NAVIGATION_ORIGIN_NOT_ALLOWED' });
    if (u.searchParams.get('preview_theme_id') !== session.themeId) throw Object.assign(new Error('x'), { code: 'PREVIEW_QUERY_NOT_ALLOWED' });
  },
};
const browser = await chromium.launch();
const baseCase = { surface: 'pdp', path: '/products/base', formSelector: 'form#pf', variantA: '1101', variantB: '1103', productHasSellingPlans: false };

// ================= C1: modo cart rechazado =================
record('C1', '--cart rechazado', codeOf(() => parseArgs(['--cart'])) === 'B02_CART_MODE_REJECTED', {});
record('C1', '--cart con fixture rechazado', codeOf(() => parseArgs(['--fixture=f.json', '--cart'])) === 'B02_CART_MODE_REJECTED', {});
record('C1', '--read-only/--inventory rechazados', codeOf(() => parseArgs(['--read-only'])) === 'B02_MODE_NOT_SUPPORTED' && codeOf(() => parseArgs(['--inventory'])) === 'B02_MODE_NOT_SUPPORTED', {});
{
  const session = createB02Session({ themeId: THEME });
  const flips = ['mode', 'cartWriteEnabled', 'cartAuthorization'].map((name) => codeOf(() => { session[name] = name === 'mode' ? 'cart' : true; }));
  record('C1', 'sesion: mode/cartWriteEnabled/cartAuthorization no escribibles', flips.every((c) => c === 'TypeError') && codeOf(() => assertNonCartSession(session)) === null, { flips });
  record('C1', 'sesion cart ajena falla cerrado', codeOf(() => assertNonCartSession({ mode: 'cart', cartWriteEnabled: true, cartAuthorization: true, cleanupInProgress: false })) === 'B02_CART_MODE_NOT_ALLOWED' && codeOf(() => assertNonCartSession({ mode: 'b02-no-js', cartWriteEnabled: false, cartAuthorization: false, cleanupInProgress: false })) === 'B02_CART_MODE_NOT_ALLOWED', {});
}
{
  // Politica D28 real, sin red: la regla de run.mjs:260 con la sesion B-02.
  const policy = await loadD28Policy();
  const b02 = createB02Session({ themeId: THEME });
  b02.previewVerified = true;
  const decide = (session, path) => policy.requestDecision(session, 'POST', `${policy.ORIGIN}${path}`, 'document', 'browser', true);
  const ajax = decide(b02, '/cart/add.js');
  const native = decide(b02, '/cart/add');
  const read = policy.requestDecision(b02, 'GET', `${policy.ORIGIN}/products/x`, 'document', 'browser', true);
  const cartSession = { mode: 'cart', cartWriteEnabled: true, cartAuthorization: true, cleanupInProgress: false, previewVerified: true };
  const hazard = decide(cartSession, '/cart/add.js');
  record('C1', 'D28 real: navegacion POST /cart/add.js bloqueada en sesion B-02', ajax.allowed === false && ajax.reason === 'MUTATION_BLOCKED', { reason: ajax.reason });
  record('C1', 'D28 real: POST /cart/add bloqueado; GET permitido', native.allowed === false && read.allowed === true, { native: native.reason, read: read.reason });
  record('C1', 'D28 real en modo cart si permite /cart/add.js (motivo del rechazo)', hazard.allowed === true, { reason: hazard.reason });
  const dir = await mkdtemp(join(tmpdir(), 'b02-tamper-'));
  const tampered = join(dir, 'run.mjs');
  await writeFile(tampered, (await readFile(D28_RUNNER_PATH, 'utf8')).replace("const CART_POST_PATHS = new Set(['/cart/add.js',", "const CART_POST_PATHS = new Set(['/cart/add', '/cart/add.js',"));
  const tamperCode = await asyncCodeOf(() => loadD28Policy({ runnerPath: tampered }));
  await rm(dir, { recursive: true, force: true });
  record('C1', 'run.mjs alterado no se carga', tamperCode === 'D28_SOURCE_DIGEST_NOT_EXPECTED', { tamperCode });
}
{
  const before = posts();
  const report = await runB02({ browser, policy: stubPolicy, origin, fixture: { themeId: THEME, cases: [{ ...baseCase, id: 'ajax', path: '/products/ajax' }] }, caseIntervalMs: 0 });
  const c = report.cases[0];
  record('C1', 'navegador: form a /cart/add.js en runner B-02 da FAIL sin envio', c.result === 'FAIL' && c.failures.includes('NO_NATIVE_CART_ADD_CAPTURED') && posts() === before && report.totals.d28BlockedRequests === 1, { failures: c.failures, posts: posts() - before, d28Blocked: report.totals.d28BlockedRequests });
}

// ================= C2: precondiciones y reglas de payload =================
async function caseRun(pagePath, args, { order = 'after', capture = true } = {}) {
  const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: 'block' });
  const policy = { blocked: 0 };
  const d28 = async (route) => { const r = route.request(); if ((r.method() === 'GET' || r.method() === 'HEAD') && new URL(r.url()).origin === origin) return route.continue(); policy.blocked += 1; return route.abort('blockedbyclient'); };
  const page = await context.newPage();
  page.setDefaultTimeout(3000);
  let log = { captures: [], fallbacks: 0, nonCaptureMutations: [], reachedServer: [] };
  if (order === 'before' && capture) log = await installNativeCartAddCapture(context, { origin, mainFrameOf: () => page.mainFrame() });
  await context.route('**/*', d28);
  if (order === 'after' && capture) log = await installNativeCartAddCapture(context, { origin, mainFrameOf: () => page.mainFrame() });
  context.on('page', (p) => { if (p !== page) p.close().catch(() => {}); });
  const before = posts();
  try {
    await page.goto(`${origin}${pagePath}`);
    const res = await runNoJsVariantCase(page, log, { formSelector: 'form#pf', variantA: '1101', variantB: '1103', timeoutMs: 2500, ...args });
    return { res, posts: posts() - before, blocked: policy.blocked };
  } finally { await context.close(); }
}
const expectFail = async (group, id, pagePath, args, code, extra) => {
  try {
    const { res, posts: p, blocked } = await caseRun(pagePath, args, extra);
    record(group, id, res.result === 'FAIL' && (!code || res.failures.includes(code)) && p === 0, { failures: res.failures, posts: p, d28Blocked: blocked });
  } catch (error) { record(group, id, false, { exception: String(error.message).split('\n')[0].slice(0, 120) }); }
};
const noPlans = { variantId: '1103', productHasSellingPlans: false };
await expectFail('C2', 'A igual a B', '/p/base', { variantB: '1101', expected: { ...noPlans, variantId: '1101' } }, 'VARIANT_A_EQUALS_B');
await expectFail('C2', 'id esperado distinto de B', '/p/base', { expected: { ...noPlans, variantId: '1101' } }, 'EXPECTED_ID_NOT_VARIANT_B');
await expectFail('C2', 'pagina no cargada en A (carga muestra B)', '/products/base?variant=1103', { expected: noPlans }, 'PAGE_NOT_LOADED_ON_VARIANT_A');
await expectFail('C2', 'productHasSellingPlans sin declarar', '/p/base', { expected: { variantId: '1103' } }, 'PRODUCT_SELLING_PLANS_UNDECLARED');
await expectFail('C2', 'selling_plan vacio con producto con planes', '/products/plans-empty', { expected: { variantId: '1103', productHasSellingPlans: true } }, 'PAYLOAD_SELLING_PLAN_MISMATCH');
await expectFail('C2', 'plan esperado en producto sin planes', '/products/plan-5', { expected: { variantId: '1103', productHasSellingPlans: false, sellingPlan: '5' } }, 'EXPECTED_PLAN_WITHOUT_PRODUCT_PLANS');
await expectFail('C2', 'propiedad no esperada con properties {}', '/products/prop', { expected: { ...noPlans, properties: {} } }, 'PAYLOAD_PROPERTIES_UNEXPECTED');
for (const [id, pagePath, expected] of [
  ['selling_plan vacio aceptado si el producto no tiene planes', '/products/plans-empty', noPlans],
  ['plan 5 esperado y enviado', '/products/plan-5', { variantId: '1103', productHasSellingPlans: true, sellingPlan: '5' }],
]) {
  const { res, posts: p } = await caseRun(pagePath, { expected });
  record('C2', id, res.result === 'PASS' && p === 0, { result: res.result, failures: res.failures, sentSellingPlan: res.evidence.sentSellingPlan, posts: p });
}
{
  const displayed = { selectedOptionValue: '1103', formDataIds: ['1103'], formDataSellingPlans: ['6'], selectedOptionDisabled: false };
  const captures = [{ reason: 'CAPTURED_NOT_SENT', payload: { id: ['1103'], quantity: [], sellingPlan: ['5'], properties: {} } }];
  const out = evaluateCase({ expected: { variantId: '1103', productHasSellingPlans: true, sellingPlan: '5' }, displayed, captures, blockedOther: [] });
  record('C2', 'plan enviado distinto de FormData', out.failures.includes('PAYLOAD_SELLING_PLAN_NOT_FORMDATA'), { failures: out.failures });
  const numeric = evaluateCase({ expected: { variantId: 1103, productHasSellingPlans: false }, displayed: { ...displayed, formDataSellingPlans: [] }, captures: [{ ...captures[0], payload: { ...captures[0].payload, sellingPlan: [] } }], blockedOther: [] });
  record('C2', 'id enviado exactamente igual al esperado (normalizado)', numeric.result === 'PASS', { failures: numeric.failures });
}

// ================= Negativos del revisor (neg-review.mjs), API nueva =================
const REV = 'REV';
await expectFail(REV, 'R1 orden invertido falla cerrado', '/p/base', { expected: noPlans }, 'NO_NATIVE_CART_ADD_CAPTURED', { order: 'before' });
await expectFail(REV, 'R2 sin captura falla cerrado', '/p/base', { expected: noPlans }, 'NO_NATIVE_CART_ADD_CAPTURED', { capture: false });
await expectFail(REV, 'R3 target=iframe', '/p/iframe', { expected: noPlans }, 'NO_NATIVE_CART_ADD_CAPTURED');
await expectFail(REV, 'R4 target=_blank', '/p/blank', { expected: noPlans }, null);
await expectFail(REV, 'R5 id vacio como B', '/p/base', { variantB: '', expected: { ...noPlans, variantId: '' } }, 'VARIANT_A_OR_B_INVALID');
await expectFail(REV, 'R6 id extra con form=', '/p/formattr', { expected: noPlans }, 'PAYLOAD_ID_NOT_SINGLE');
await expectFail(REV, 'R7 text/plain', '/p/textplain', { expected: noPlans }, 'PAYLOAD_PARSE_FAILED');
await expectFail(REV, 'R8 selling_plan no esperado', '/p/plans', { expected: noPlans }, 'PAYLOAD_SELLING_PLAN_MISMATCH');
await expectFail(REV, 'W1 ["5",""] contra 5 ahora FAIL', '/p/plans', { expected: { variantId: '1103', productHasSellingPlans: true, sellingPlan: '5' } }, 'PAYLOAD_SELLING_PLAN_MISMATCH');
await expectFail(REV, 'W2 propiedad no esperada con properties null ahora FAIL', '/p/props', { expected: { ...noPlans, properties: null } }, 'PAYLOAD_PROPERTIES_UNEXPECTED');
await expectFail(REV, 'W3 B igual a A ahora FAIL', '/p/base', { variantB: '1101', expected: { ...noPlans, variantId: '1101' } }, 'VARIANT_A_EQUALS_B');
{
  // R9 + m1: un fallo al leer el cuerpo ya no deja la ruta sin resolver.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  page.setDefaultTimeout(3000);
  await context.route('**/*', async (route) => { const r = route.request(); if (r.method() === 'GET') return route.continue(); return route.abort('blockedbyclient'); });
  const log = await installNativeCartAddCapture(context, { origin, mainFrameOf: () => page.mainFrame() });
  let unhandled = 0;
  const onUnhandled = () => { unhandled += 1; };
  process.on('unhandledRejection', onUnhandled);
  context.on('request', (request) => { if (request.method() === 'POST') request.headerValue = async () => { throw new Error('boom'); }; });
  const before = posts();
  await page.goto(`${origin}/p/base`);
  const res = await runNoJsVariantCase(page, log, { formSelector: 'form#pf', variantA: '1101', variantB: '1103', expected: noPlans, timeoutMs: 2500 });
  await new Promise((r) => setTimeout(r, 300));
  process.off('unhandledRejection', onUnhandled);
  record(REV, 'R9/m1 cabecera que lanza: aborto en finally, sin envio ni rechazo sin manejar', posts() === before && unhandled === 0 && res.result === 'FAIL', { failures: res.failures, posts: posts() - before, unhandled, parseError: log.captures[0]?.parseError ?? null });
  await context.close();
}

// ================= C3: runner B-02 =================
record('C3', 'credenciales: sin entorno falla cerrado', codeOf(() => readCredentials({})) === 'REQUIRED_CREDENTIAL_ENV_MISSING' && codeOf(() => readCredentials({ STOREFRONT_PASSWORD: 'x' })) === 'REQUIRED_CREDENTIAL_ENV_MISSING' && codeOf(() => readCredentials({ STOREFRONT_PASSWORD: '', SHOPIFY_CLI_THEME_TOKEN: 'y' })) === 'REQUIRED_CREDENTIAL_ENV_MISSING', {});
{
  const creds = readCredentials({ STOREFRONT_PASSWORD: 'p', SHOPIFY_CLI_THEME_TOKEN: 't' });
  record('C3', 'credenciales: solo password en memoria, token no se devuelve', JSON.stringify(Object.keys(creds)) === '["password"]', {});
}
record('C3', 'credenciales por argumento rechazadas', codeOf(() => parseArgs(['--password=x'])) === 'CREDENTIAL_ARGUMENT_NOT_ALLOWED' && codeOf(() => parseArgs(['--token=x'])) === 'CREDENTIAL_ARGUMENT_NOT_ALLOWED', {});
record('C3', 'argumentos: fixture obligatorio y unico', codeOf(() => parseArgs([])) === 'FIXTURE_ARGUMENT_REQUIRED' && codeOf(() => parseArgs(['--x'])) === 'ARGUMENT_NOT_SUPPORTED' && parseArgs(['--fixture=a.json']).fixturePath === 'a.json', {});
{
  const auth = { authorizedThemeIds: new Set([THEME]) };
  const ok = (f) => codeOf(() => validateFixture(f, auth));
  const good = { themeId: THEME, cases: [{ ...baseCase, id: 'a' }] };
  record('C3', 'fixture valido', ok(good) === null, {});
  record('C3', 'fixture: A=B, tema no autorizado, clave de credencial, plan sin declarar', ok({ ...good, cases: [{ ...baseCase, id: 'a', variantB: '1101' }] }) === 'VARIANT_A_EQUALS_B' && ok({ ...good, themeId: '1' }) === 'THEME_NOT_ALLOWED' && ok({ ...good, password: 'x' }) === 'FIXTURE_CREDENTIAL_KEY_NOT_ALLOWED' && ok({ ...good, cases: [{ ...baseCase, id: 'a', productHasSellingPlans: undefined }] }) === 'PRODUCT_SELLING_PLANS_UNDECLARED', {});
}
{
  const context = await browser.newContext({ javaScriptEnabled: true });
  const page = await context.newPage();
  await page.goto(`${origin}/p/base`);
  const ranWithJs = await probeJavaScriptRan(page);
  await context.close();
  record('C3', 'sonda JS detecta un contexto con JS activo', ranWithJs === true, { ranWithJs });
}
{
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const session = createB02Session({ page, context, api: context.request, themeId: THEME });
  const { routeOrder } = await installRoutes(context, session, stubPolicy, origin);
  await context.close();
  record('C3', 'orden de rutas D28 -> captura', JSON.stringify(routeOrder) === '["d28","capture"]', { routeOrder });
}
{
  const before = posts();
  const fixture = validateFixture({ themeId: THEME, cases: [
    { ...baseCase, id: 'pdp-a-b', loadVariantInUrl: true },
    { ...baseCase, id: 'featured-a-b', surface: 'featured', path: '/', formSelector: 'form#featured-fs' },
    { ...baseCase, id: 'pdp-plan-vacio', path: '/products/plans-empty' },
    { ...baseCase, id: 'pdp-a-b-otra-vez' },
  ] }, { authorizedThemeIds: stubPolicy.AUTHORIZED_THEME_IDS });
  const started = Date.now();
  const report = await runB02({ browser, policy: stubPolicy, origin, fixture, caseIntervalMs: 200 });
  const elapsed = Date.now() - started;
  const allPass = report.cases.every((c) => c.result === 'PASS' && c.capturedNotSent === 1 && c.javaScriptRan === false && c.reachedServer === 0);
  record('C3', 'runner: 4 casos seguidos PASS con recarga entre casos', report.result === 'PASS' && allPass && posts() === before && report.totals.capturedNotSent === 4, { result: report.result, cases: report.cases.map((c) => [c.caseId, c.result, c.failures]), posts: posts() - before });
  record('C3', 'runner: javaScriptEnabled false y sonda sin ejecucion en cada caso', report.javaScriptEnabled === false && report.cases.every((c) => c.javaScriptRan === false), {});
  record('C3', 'runner: espaciado entre casos', elapsed >= 600, { elapsed });
}
{
  const before = posts();
  const env = { STOREFRONT_PASSWORD: 'pw-local-31x', SHOPIFY_CLI_THEME_TOKEN: SECRET_PROPERTY };
  const policy = await loadD28Policy();
  const guard = policy.installSecretGuard(env);
  const fixture = { themeId: THEME, cases: [
    { ...baseCase, id: 'prop-esperada', path: '/products/prop', properties: { _secret: SECRET_PROPERTY } },
    { ...baseCase, id: 'prop-no-esperada', path: '/products/prop' },
    { ...baseCase, id: 'tema-incorrecto', path: '/products/wrongtheme' },
    { ...baseCase, id: 'tema-publicado', path: '/products/published' },
    { ...baseCase, id: 'carga-en-b', path: '/products/base?variant=1103'.split('?')[0], loadVariantInUrl: true, variantA: '1103', variantB: '1101' },
  ] };
  // Ultimo caso: el fixture dice A=1103 y la URL carga 1103, debe pasar; sirve de control.
  const raw = await runB02({ browser, policy: stubPolicy, origin, fixture, caseIntervalMs: 0 });
  const safe = redactReport(raw, guard);
  const text = JSON.stringify(safe);
  const byId = Object.fromEntries(safe.cases.map((c) => [c.caseId, c]));
  record('C3', 'propiedad esperada PASS sin guardar su valor', byId['prop-esperada'].result === 'PASS' && byId['prop-esperada'].evidence.propertyKeyCount === 1, { r: byId['prop-esperada'].result });
  record('C3', 'propiedad no esperada FAIL', byId['prop-no-esperada'].failures.includes('PAYLOAD_PROPERTIES_UNEXPECTED'), { failures: byId['prop-no-esperada'].failures });
  record('C3', 'identidad sin JS: tema incorrecto o publicado no se envia', byId['tema-incorrecto'].failures.includes('PREVIEW_ID_NOT_VERIFIED') && byId['tema-publicado'].failures.includes('PREVIEW_ROLE_NOT_UNPUBLISHED') && byId['tema-incorrecto'].capturedNotSent === 0 && byId['tema-publicado'].capturedNotSent === 0, { a: byId['tema-incorrecto'].failures, b: byId['tema-publicado'].failures });
  record('C3', 'control B->A cargado por URL PASS', byId['carga-en-b'].result === 'PASS', { failures: byId['carga-en-b'].failures });
  const leaks = [COOKIE_VALUE, SECRET_PROPERTY, 'pw-local-31x', 'cart_sess', 'set-cookie', 'Cookie'].filter((value) => text.includes(value));
  record('C3', 'informe sin cookies, valores ni secretos', leaks.length === 0 && posts() === before, { leaks, redactions: safe.redactions, posts: posts() - before });
}

await browser.close();
server.close();
const failed = results.filter((ok) => !ok).length;
console.log(`\nRESUMEN ${results.length - failed}/${results.length} comprobaciones correctas; POST recibidos por el servidor: ${posts()}`);
process.exit(failed ? 1 : 0);
