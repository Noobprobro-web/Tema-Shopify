// Runner minimo B-02 sin JavaScript. Reutiliza capture.mjs y la politica D28 de
// harness-GPT-RA-RB-001/run.mjs sin cambiarla.
//
// Reglas (REVIEW-B02H-001, C1 y C3):
// - Modo unico "b02-no-js". --cart, --read-only e --inventory se rechazan. La sesion
//   fija mode, cartWriteEnabled y cartAuthorization como propiedades no escribibles, asi
//   la regla de carrito de D28 (run.mjs:260) nunca autoriza /cart/add.js ni otro POST.
// - BrowserContext con javaScriptEnabled: false, comprobado en cada caso con una sonda.
// - Rutas en orden fijo: router D28 primero y captura despues (Playwright ejecuta antes
//   la ultima registrada, asi la captura ve el POST nativo y lo aborta sin enviarlo).
// - Cada caso carga de nuevo la pagina: tras el aborto queda en chrome-error.
// - Credenciales solo por entorno (STOREFRONT_PASSWORD, SHOPIFY_CLI_THEME_TOKEN); si
//   faltan, falla cerrado antes de abrir el navegador. Ningun argumento lleva secretos.
// - El informe se arma por lista blanca: codigos, ids, conteos. Sin cookies, cabeceras,
//   cuerpos ni valores de propiedades. Nunca se serializa el log de capturas.
//
// Uso en tienda (solo tras preflight de CLI, ver README):
//   node run-b02.mjs --fixture=<fixture.json>
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { installNativeCartAddCapture, runNoJsVariantCase, casePreconditionFailures } from './capture.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const D28_RUNNER_PATH = resolve(HERE, '../../outbox-gpt/harness-GPT-RA-RB-001/run.mjs');
// SHA-256 de run.mjs revisado. Si D28 cambia, este runner no arranca hasta revisarlo.
export const D28_RUNNER_SHA256 = '9682dc26e682e88a86bb07e91869959b6f9cfe1c7c60afc95268fd7a4c2d1324';
export const B02_MODE = 'b02-no-js';
export const CASE_INTERVAL_MS = 1000;
const MAX_CASES = 24;
const CREDENTIAL_NAME = /(?:token|password|passwd|pwd|cookie|secret|auth|credential|key)/i;

export class B02Error extends Error {
  constructor(code) { super(code); this.code = code; }
}
const requireThat = (condition, code) => { if (!condition) throw new B02Error(code); };
const safeCode = (error) => (typeof error?.code === 'string' && /^[A-Z][A-Z0-9_]{1,63}$/.test(error.code) ? error.code : error?.name === 'TimeoutError' ? 'PLAYWRIGHT_TIMEOUT' : 'UNEXPECTED_ERROR');

// ---------- argumentos y entorno ----------
export function parseArgs(argv) {
  if (argv.includes('--cart')) throw new B02Error('B02_CART_MODE_REJECTED');
  if (argv.some((arg) => arg === '--read-only' || arg === '--inventory')) throw new B02Error('B02_MODE_NOT_SUPPORTED');
  if (argv.some((arg) => CREDENTIAL_NAME.test(arg.split('=')[0]))) throw new B02Error('CREDENTIAL_ARGUMENT_NOT_ALLOWED');
  requireThat(argv.every((arg) => arg.startsWith('--fixture=')), 'ARGUMENT_NOT_SUPPORTED');
  requireThat(argv.length === 1 && argv[0].length > '--fixture='.length, 'FIXTURE_ARGUMENT_REQUIRED');
  return { fixturePath: argv[0].slice('--fixture='.length) };
}

export function readCredentials(env) {
  requireThat(typeof env.STOREFRONT_PASSWORD === 'string' && env.STOREFRONT_PASSWORD.length > 0 && typeof env.SHOPIFY_CLI_THEME_TOKEN === 'string' && env.SHOPIFY_CLI_THEME_TOKEN.length > 0, 'REQUIRED_CREDENTIAL_ENV_MISSING');
  // El token solo se exige presente, igual que D28; este runner no lo envia.
  return { password: env.STOREFRONT_PASSWORD };
}

// ---------- fixture ----------
const CASE_KEYS = new Set(['id', 'surface', 'path', 'formSelector', 'variantA', 'variantB', 'loadVariantInUrl', 'quantity', 'sellingPlan', 'productHasSellingPlans', 'properties']);
function rejectCredentialKeys(value) {
  if (Array.isArray(value)) { value.forEach(rejectCredentialKeys); return; }
  if (value && typeof value === 'object') for (const [key, inner] of Object.entries(value)) { requireThat(!CREDENTIAL_NAME.test(key), 'FIXTURE_CREDENTIAL_KEY_NOT_ALLOWED'); rejectCredentialKeys(inner); }
}
export function validateFixture(fixture, { authorizedThemeIds }) {
  requireThat(fixture && typeof fixture === 'object' && !Array.isArray(fixture), 'FIXTURE_INVALID');
  rejectCredentialKeys(fixture);
  requireThat(Object.keys(fixture).every((key) => ['themeId', 'cases'].includes(key)), 'FIXTURE_KEY_NOT_SUPPORTED');
  requireThat(typeof fixture.themeId === 'string' && /^\d+$/.test(fixture.themeId) && authorizedThemeIds.has(fixture.themeId), 'THEME_NOT_ALLOWED');
  requireThat(Array.isArray(fixture.cases) && fixture.cases.length > 0 && fixture.cases.length <= MAX_CASES, 'FIXTURE_CASES_INVALID');
  const ids = new Set();
  for (const item of fixture.cases) {
    requireThat(item && typeof item === 'object' && Object.keys(item).every((key) => CASE_KEYS.has(key)), 'FIXTURE_CASE_KEY_NOT_SUPPORTED');
    requireThat(typeof item.id === 'string' && /^[a-z0-9-]{1,40}$/.test(item.id) && !ids.has(item.id), 'FIXTURE_CASE_ID_INVALID');
    ids.add(item.id);
    requireThat(item.surface === 'pdp' || item.surface === 'featured', 'FIXTURE_SURFACE_INVALID');
    requireThat(typeof item.path === 'string' && /^\/[A-Za-z0-9_\-/]*$/.test(item.path) && !item.path.includes('//'), 'FIXTURE_PATH_INVALID');
    requireThat(typeof item.formSelector === 'string' && /^form[#.][A-Za-z0-9_-]{1,80}$/.test(item.formSelector), 'FIXTURE_FORM_SELECTOR_INVALID');
    requireThat(item.loadVariantInUrl === undefined || (typeof item.loadVariantInUrl === 'boolean' && (item.surface === 'pdp' || !item.loadVariantInUrl)), 'FIXTURE_LOAD_VARIANT_INVALID');
    requireThat(item.quantity === undefined || (Number.isSafeInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 99), 'FIXTURE_QUANTITY_INVALID');
    requireThat(item.sellingPlan === undefined || item.sellingPlan === null || (typeof item.sellingPlan === 'string' && /^\d+$/.test(item.sellingPlan)), 'FIXTURE_SELLING_PLAN_INVALID');
    const failures = casePreconditionFailures({ variantA: item.variantA, variantB: item.variantB, expected: expectedFor(item) });
    requireThat(failures.length === 0, failures[0] || 'FIXTURE_CASE_INVALID');
  }
  return fixture;
}
export const expectedFor = (item) => ({ variantId: item.variantB, quantity: item.quantity ?? 1, sellingPlan: item.sellingPlan ?? null, productHasSellingPlans: item.productHasSellingPlans, properties: item.properties ?? {} });

// ---------- politica D28 sin cambios ----------
// run.mjs no exporta nada y ejecuta main() al cargarse. Se lee el archivo, se exige su
// SHA-256 revisado, se quita solo la invocacion final de main() y se anaden exports. La
// logica de politica (requestDecision, createRouter, 429) queda byte a byte igual. La
// copia vive en un directorio temporal propio que se borra tras importarla.
export async function loadD28Policy({ runnerPath = D28_RUNNER_PATH, expectedSha256 = D28_RUNNER_SHA256 } = {}) {
  const source = await readFile(runnerPath, 'utf8');
  requireThat(createHash('sha256').update(source).digest('hex') === expectedSha256, 'D28_SOURCE_DIGEST_NOT_EXPECTED');
  const marker = '\ntry {\n  await main();\n}';
  const cut = source.lastIndexOf(marker);
  requireThat(cut > 0 && source.indexOf(marker) === cut, 'D28_SOURCE_LAYOUT_NOT_EXPECTED');
  const module = `${source.slice(0, cut)}
export { ORIGIN, AUTHORIZED_THEME_IDS, CART_POST_PATHS, EXTERNAL_HEADERS, createRouter, requestDecision, requestViaPolicy, assertStorePage, recordRequest, buildInventorySecretGuard };
export function installSecretGuard(environment) { inventorySecretGuard = buildInventorySecretGuard(environment); return inventorySecretGuard; }
`;
  const dir = await mkdtemp(join(tmpdir(), 'b02-d28-'));
  try {
    const file = join(dir, 'd28-policy.mjs');
    await writeFile(file, module, { mode: 0o600 });
    return await import(`${pathToFileURL(file).href}?v=${randomUUID()}`);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// ---------- sesion no cart ----------
const LOCKED = (value) => ({ value, writable: false, configurable: false, enumerable: true });
export function createB02Session({ page, context, api, createExternalClient, themeId, preset = 'b02' }) {
  const publicSession = { cartTouched: false };
  const session = { preset, themeId, page, context, api, createExternalClient, publicSession, authPostAllowed: false, authSubmitted: false, previewVerified: false, cartTouched: false, expectedCartLine: null, cartAddReconciled: false, cartStopRequested: false, cartAddInFlight: false, cartAddCompletion: Promise.resolve(), resolveCartAddCompletion: null, interventionOccurred: false, blockedRequests: 0, blockedWebSockets: 0, popupsClosed: 0, routeOperationFailed: false, routeFailureEvents: [], routeFailureEventsOmitted: 0, routeWarningEvents: [], routeWarningEventsOmitted: 0, rateLimitEvents: [], rateLimitEventsOmitted: 0, requestDecisions: [], requestDecisionsOmitted: 0, networkWarnings: new Map(), warningOccurrences: 0, warningOccurrencesOmitted: 0, deniedResourceSummary: new Map(), inventoryResources: new Map(), inventoryCounters: { maxEntries: 0, eligibleOccurrences: 0, redactedOccurrences: 0, truncatedOccurrences: 0 } };
  Object.defineProperties(session, { mode: LOCKED(B02_MODE), cartWriteEnabled: LOCKED(false), cartAuthorization: LOCKED(false), cleanupInProgress: LOCKED(false) });
  return session;
}
export function assertNonCartSession(session) {
  for (const [name, value] of [['mode', B02_MODE], ['cartWriteEnabled', false], ['cartAuthorization', false], ['cleanupInProgress', false]]) {
    const descriptor = Object.getOwnPropertyDescriptor(session, name);
    requireThat(descriptor && descriptor.value === value && !descriptor.writable && !descriptor.configurable && !descriptor.get && !descriptor.set, 'B02_CART_MODE_NOT_ALLOWED');
  }
}

// D28 primero, captura despues. Devuelve el log en memoria y el orden registrado.
export async function installRoutes(context, session, policy, origin) {
  assertNonCartSession(session);
  const routeOrder = [];
  await context.route('**/*', policy.createRouter(session));
  routeOrder.push('d28');
  const log = await installNativeCartAddCapture(context, { origin, mainFrameOf: () => session.page.mainFrame() });
  routeOrder.push('capture');
  requireThat(routeOrder.length === 2 && routeOrder[0] === 'd28' && routeOrder[1] === 'capture', 'ROUTE_ORDER_NOT_EXPECTED');
  return { log, routeOrder };
}

// ---------- comprobaciones por pagina ----------
// true si un script insertado llega a ejecutarse (JS activo). Sin JS debe dar false.
export async function probeJavaScriptRan(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    root.removeAttribute('data-b02-js-probe');
    const script = document.createElement('script');
    script.textContent = 'document.documentElement.setAttribute("data-b02-js-probe", "1")';
    (document.head || root).appendChild(script);
    const ran = root.hasAttribute('data-b02-js-probe');
    script.remove();
    root.removeAttribute('data-b02-js-probe');
    return ran;
  });
}

// Sin JS window.Shopify no existe: la identidad se lee del texto del script inline
// "Shopify.theme = {...};" y debe coincidir con el ID y el rol unpublished.
export async function verifyPreviewNoJs(page, session, policy) {
  policy.assertStorePage(page, session);
  const theme = await page.evaluate(() => {
    for (const script of document.scripts) {
      const match = /Shopify\.theme\s*=\s*(\{.*?\})\s*;/s.exec(script.textContent || '');
      if (!match) continue;
      try { const parsed = JSON.parse(match[1]); return { id: String(parsed.id), role: typeof parsed.role === 'string' ? parsed.role : null }; } catch { return { id: null, role: null }; }
    }
    return null;
  });
  requireThat(Boolean(theme) && theme.id === session.themeId, 'PREVIEW_ID_NOT_VERIFIED');
  requireThat(theme.role === 'unpublished', 'PREVIEW_ROLE_NOT_UNPUBLISHED');
  session.previewVerified = true;
}

export function caseAddress(origin, themeId, item) {
  const address = new URL(item.path, origin);
  address.searchParams.set('preview_theme_id', themeId);
  if (item.surface === 'pdp' && item.loadVariantInUrl) address.searchParams.set('variant', item.variantA);
  return address.href;
}

// ---------- informe seguro ----------
const CODE = /^[A-Z][A-Z0-9_]{1,63}$/;
const ids = (list) => (Array.isArray(list) ? list.map((value) => (/^\d{0,20}$/.test(String(value)) ? String(value) : 'NON_NUMERIC')) : []);
export function safeCaseResult(item, outcome, counters) {
  const evidence = outcome.evidence || {};
  return {
    caseId: item.id,
    surface: item.surface,
    result: outcome.result === 'PASS' ? 'PASS' : 'FAIL',
    failures: (outcome.failures || []).map((code) => (CODE.test(code) ? code : 'UNCLASSIFIED_FAILURE')),
    evidence: {
      loadedVariant: ids([evidence.loaded?.selectedOptionValue ?? ''])[0] || null,
      displayedVariant: ids([evidence.displayed?.selectedOptionValue ?? ''])[0] || null,
      sentId: ids(evidence.sentId),
      sentQuantity: ids(evidence.sentQuantity),
      sentSellingPlan: ids(evidence.sentSellingPlan),
      propertyKeyCount: Array.isArray(evidence.propertyKeys) ? evidence.propertyKeys.length : 0,
    },
    capturedNotSent: counters.captured,
    reachedServer: counters.reachedServer,
    nonCaptureMutations: counters.nonCaptureMutations,
    javaScriptRan: counters.javaScriptRan,
  };
}
// Ultimo filtro: ninguna cadena del informe puede contener un valor sensible del entorno.
export function redactReport(report, guard) {
  let redactions = 0;
  const walk = (value) => {
    if (typeof value === 'string') { if (!guard || guard.unavailable || guard.matches(value)) { redactions += 1; return null; } return value; }
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, walk(inner)]));
    return value;
  };
  const clean = walk(report);
  clean.redactions = redactions;
  return clean;
}

// ---------- ejecucion ----------
export async function runB02({ browser, policy, origin, fixture, authenticate = null, createExternalClient = null, caseIntervalMs = CASE_INTERVAL_MS, timeoutMs = 5000 }) {
  const report = { harness: 'B-02-STORE-001', mode: B02_MODE, cartModeRejected: true, javaScriptEnabled: false, routeOrder: [], themeId: fixture.themeId, cases: [], totals: null, stoppedReason: null };
  const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: 'block', viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const session = createB02Session({ page, context, api: context.request, createExternalClient, themeId: fixture.themeId });
    const { log, routeOrder } = await installRoutes(context, session, policy, origin);
    report.routeOrder = routeOrder;
    await context.routeWebSocket('**/*', (socket) => { session.blockedWebSockets += 1; try { socket.close({ code: 1008, reason: 'Harness request policy' }); } catch { /* bloqueado */ } });
    context.on('page', (popup) => { if (popup !== page) { session.popupsClosed += 1; popup.close().catch(() => {}); } });
    if (authenticate) await authenticate(session);
    let lastStart = 0;
    for (const item of fixture.cases) {
      assertNonCartSession(session);
      if (session.routeOperationFailed) { report.stoppedReason = 'D28_ROUTE_OPERATION_FAILED'; break; }
      while (Date.now() < lastStart + caseIntervalMs) await new Promise((r) => setTimeout(r, Math.max(1, lastStart + caseIntervalMs - Date.now())));
      lastStart = Date.now();
      const before = { captured: log.captures.length, reached: log.reachedServer.length, mutations: log.nonCaptureMutations.length };
      let outcome;
      let javaScriptRan = null;
      try {
        // Recarga obligatoria: el aborto del caso anterior deja chrome-error.
        const response = await page.goto(caseAddress(origin, fixture.themeId, item), { waitUntil: 'domcontentloaded', timeout: 30000 });
        requireThat(Boolean(response?.ok()), 'PAGE_HTTP_NON_2XX');
        requireThat(new URL(page.url()).origin === origin, 'PAGE_NOT_RELOADED');
        javaScriptRan = await probeJavaScriptRan(page);
        requireThat(javaScriptRan === false, 'JAVASCRIPT_NOT_DISABLED');
        await verifyPreviewNoJs(page, session, policy);
        outcome = await runNoJsVariantCase(page, log, { formSelector: item.formSelector, variantA: item.variantA, variantB: item.variantB, expected: expectedFor(item), timeoutMs });
      } catch (error) {
        outcome = { result: 'FAIL', failures: [safeCode(error)], evidence: {} };
      }
      report.cases.push(safeCaseResult(item, outcome, { captured: log.captures.length - before.captured, reachedServer: log.reachedServer.length - before.reached, nonCaptureMutations: log.nonCaptureMutations.length - before.mutations, javaScriptRan }));
    }
    report.totals = {
      cases: report.cases.length,
      passed: report.cases.filter((c) => c.result === 'PASS').length,
      capturedNotSent: log.captures.length,
      reachedServer: log.reachedServer.length,
      nonCaptureMutations: log.nonCaptureMutations.length,
      d28BlockedRequests: session.blockedRequests,
      d28RouteOperationFailed: session.routeOperationFailed,
      rateLimitEvents: session.rateLimitEvents.length,
      blockedWebSockets: session.blockedWebSockets,
      popupsClosed: session.popupsClosed,
    };
    report.result = report.stoppedReason || report.totals.passed !== fixture.cases.length || report.totals.reachedServer ? 'FAIL' : 'PASS';
    return report;
  } finally {
    await context.close().catch(() => {});
  }
}

// ---------- CLI (solo tienda) ----------
async function main() {
  const { fixturePath } = parseArgs(process.argv.slice(2));
  const { password } = readCredentials(process.env);
  const policy = await loadD28Policy();
  const guard = policy.installSecretGuard(process.env);
  const fixture = validateFixture(JSON.parse(await readFile(resolve(fixturePath), 'utf8')), { authorizedThemeIds: policy.AUTHORIZED_THEME_IDS });
  const playwright = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : '@playwright/test');
  const browser = await playwright.chromium.launch({ headless: true });
  let report;
  try {
    report = await runB02({
      browser,
      policy,
      origin: policy.ORIGIN,
      fixture,
      createExternalClient: () => playwright.request.newContext({ storageState: { cookies: [], origins: [] }, userAgent: policy.EXTERNAL_HEADERS['User-Agent'], extraHTTPHeaders: policy.EXTERNAL_HEADERS }),
      authenticate: async (session) => {
        // Una operacion de acceso por la politica D28 (POST /password con reintentos solo
        // tras 429). La contrasena no sale de memoria ni entra en el informe.
        session.authPostAllowed = true;
        await policy.requestViaPolicy(session, 'POST', '/password', { form: { form_type: 'storefront_password', utf8: '✓', password } });
        session.authPostAllowed = false;
        session.authSubmitted = true;
      },
    });
  } finally {
    await browser.close();
  }
  const output = resolve(HERE, 'results', `B02-${new Date().toISOString().replace(/[-:.]/g, '')}-${randomUUID()}.json`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(redactReport(report, guard), null, 2)}\n`);
  console.log(`report=${basename(output)} result=${report.result}`);
  if (report.result !== 'PASS') process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.log(`b02_failed=${safeCode(error)}`); process.exitCode = 2; });
}
