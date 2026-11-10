// B-02 sin JavaScript: captura y aborto del POST nativo a /cart/add.
//
// Sin JS, el formulario de producto navega con un POST nativo a /cart/add (sin .js).
// La politica D28 (harness-GPT-RA-RB-001/run.mjs:26 y :260) solo autoriza POST a
// /cart/add.js, /cart/update.js y /cart/clear.js en modo --cart; cualquier otro POST
// se aborta como MUTATION_BLOCKED y Chromium lo ve como error de red. Este modulo NO
// amplia esa lista: registra una ruta adicional que se ejecuta antes que el router D28
// (Playwright ejecuta las rutas en orden inverso al de registro), reconoce solo la
// navegacion nativa del formulario, guarda id/quantity/selling_plan/properties en
// memoria y responde route.abort() sin enviar nada. Toda otra peticion vuelve al
// router D28 con route.fallback(). El carrito nunca recibe la peticion (DP-004).
//
// Este archivo no envia, reenvia ni simula respuestas: no hay continue/fetch/fulfill.

export const CAPTURE_REASON = 'CAPTURED_NOT_SENT';
export const ABORT_ERROR_CODE = 'blockedbyclient';
// routes.cart_add_url de Shopify: /cart/add, o /<locale>/cart/add con mercados/idiomas.
const NATIVE_CART_ADD_PATH = /^\/(?:[a-z]{2,3}(?:-[a-z0-9]{2,4})?\/)?cart\/add$/i;
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);

export function assertOrigin(origin) {
  const address = new URL(origin);
  const secure = address.protocol === 'https:';
  const loopback = address.protocol === 'http:' && LOOPBACK_HOSTS.has(address.hostname);
  if (!(secure || loopback) || address.username || address.password || address.pathname !== '/' || address.search || address.hash || address.origin !== origin) {
    throw new Error('CAPTURE_ORIGIN_NOT_ALLOWED');
  }
  return address.origin;
}

// Clasifica sin efectos. Solo una navegacion de documento del marco principal, POST,
// mismo origen exacto y ruta exacta (sin query ni fragmento) es captura nativa.
export function classifyRequest({ origin, method, url, resourceType, isNavigation, primaryFrame }) {
  let address;
  try { address = new URL(url); } catch { return { capture: false, reason: 'ADDRESS_UNPARSEABLE' }; }
  if (method !== 'POST') return { capture: false, reason: 'NOT_POST' };
  if (address.origin !== origin) return { capture: false, reason: 'OTHER_ORIGIN' };
  if (address.pathname.endsWith('.js')) return { capture: false, reason: 'AJAX_ENDPOINT' };
  if (!NATIVE_CART_ADD_PATH.test(address.pathname) || address.search || address.hash) return { capture: false, reason: 'NOT_NATIVE_CART_ADD' };
  if (resourceType !== 'document' || !isNavigation || !primaryFrame) return { capture: false, reason: 'NOT_PRIMARY_DOCUMENT_NAVIGATION' };
  return { capture: true, reason: CAPTURE_REASON };
}

function parseMultipart(buffer, boundary) {
  const fields = [];
  const text = buffer.toString('utf8');
  for (const part of text.split(`--${boundary}`)) {
    const split = part.indexOf('\r\n\r\n');
    if (split < 0) continue;
    const head = part.slice(0, split);
    const name = /name="([^"]*)"/i.exec(head)?.[1];
    if (name === undefined || /filename="/i.test(head)) continue;
    fields.push([name, part.slice(split + 4).replace(/\r\n$/, '')]);
  }
  return fields;
}

// Devuelve solo los campos de compra. form_type, utf8, add y demas quedan fuera.
export function parseCartAddPayload(buffer, contentType) {
  const type = String(contentType || '').toLowerCase();
  let fields;
  if (type.startsWith('multipart/form-data')) {
    const boundary = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType);
    if (!boundary) throw new Error('MULTIPART_BOUNDARY_MISSING');
    fields = parseMultipart(buffer, (boundary[1] || boundary[2]).trim());
  } else if (type.startsWith('application/x-www-form-urlencoded')) {
    fields = [...new URLSearchParams(buffer.toString('utf8'))];
  } else {
    throw new Error('PAYLOAD_TYPE_NOT_SUPPORTED');
  }
  const payload = { id: [], quantity: [], sellingPlan: [], properties: {} };
  for (const [name, value] of fields) {
    if (name === 'id') payload.id.push(value);
    else if (name === 'quantity') payload.quantity.push(value);
    else if (name === 'selling_plan') payload.sellingPlan.push(value);
    else {
      const property = /^properties\[(.+)\]$/.exec(name);
      if (property) (payload.properties[property[1]] ||= []).push(value);
    }
  }
  return payload;
}

const sameList = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
const VARIANT_ID = /^[0-9]+$/;
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

// Regla de plan (selling_plan), sin filtrar valores vacios:
// - expected.productHasSellingPlans es obligatorio y booleano; si falta, FAIL.
// - Con expected.sellingPlan: lo enviado debe ser exactamente [plan].
// - Sin plan esperado: se acepta [] siempre, y [""] solo si el producto no tiene planes.
// - Cualquier otro valor, varios valores o un plan esperado en un producto sin planes: FAIL.
// - Lo enviado debe coincidir ademas con FormData(form).getAll('selling_plan').
export function sellingPlanFailures(expected, sent, formDataPlans) {
  const failures = [];
  if (typeof expected.productHasSellingPlans !== 'boolean') return ['PRODUCT_SELLING_PLANS_UNDECLARED'];
  const plan = expected.sellingPlan === undefined || expected.sellingPlan === null || expected.sellingPlan === '' ? null : String(expected.sellingPlan);
  if (plan !== null && !expected.productHasSellingPlans) failures.push('EXPECTED_PLAN_WITHOUT_PRODUCT_PLANS');
  const accepted = plan !== null ? sameList(sent, [plan]) : sent.length === 0 || (!expected.productHasSellingPlans && sameList(sent, ['']));
  if (!accepted) failures.push('PAYLOAD_SELLING_PLAN_MISMATCH');
  if (!Array.isArray(formDataPlans) || !sameList(sent, formDataPlans)) failures.push('PAYLOAD_SELLING_PLAN_NOT_FORMDATA');
  return failures;
}

// Regla de propiedades: expected.properties null o ausente equivale a {} (ninguna).
// Una clave enviada que no se espera da PAYLOAD_PROPERTIES_UNEXPECTED; una clave
// esperada ausente, repetida o con otro valor da PAYLOAD_PROPERTIES_MISMATCH.
export function propertyFailures(expected, sent) {
  const wanted = expected.properties ?? {};
  if (!isPlainObject(wanted)) return ['EXPECTED_PROPERTIES_INVALID'];
  const failures = [];
  if (Object.keys(sent).some((key) => !Object.hasOwn(wanted, key))) failures.push('PAYLOAD_PROPERTIES_UNEXPECTED');
  if (Object.keys(wanted).some((key) => !Object.hasOwn(sent, key) || !sameList(sent[key], [String(wanted[key])]))) failures.push('PAYLOAD_PROPERTIES_MISMATCH');
  return failures;
}

// PASS solo si: hay exactamente una captura nativa; el id enviado es exactamente
// [expected.variantId], igual a la opcion seleccionada del select visible y a FormData;
// cantidad coincide; plan y propiedades cumplen las reglas de arriba.
export function evaluateCase({ expected, displayed, captures, blockedOther, reachedServer = [] }) {
  const failures = [];
  const expectedId = expected.variantId === undefined || expected.variantId === null ? '' : String(expected.variantId);
  if (!VARIANT_ID.test(expectedId)) failures.push('EXPECTED_VARIANT_MISSING');
  if (reachedServer.length) failures.push('REQUEST_REACHED_SERVER');
  if (captures.length !== 1) failures.push(captures.length === 0 ? 'NO_NATIVE_CART_ADD_CAPTURED' : 'MULTIPLE_NATIVE_CART_ADD_CAPTURED');
  if (blockedOther.length) failures.push('UNEXPECTED_MUTATION_REQUEST');
  const payload = captures[0]?.payload;
  if (payload) {
    if (payload.id.length !== 1) failures.push('PAYLOAD_ID_NOT_SINGLE');
    if (!sameList(payload.id, [expectedId])) failures.push('PAYLOAD_ID_NOT_EXPECTED_VARIANT');
    if (payload.id[0] !== displayed.selectedOptionValue) failures.push('PAYLOAD_ID_NOT_DISPLAYED_VARIANT');
    if (!sameList(payload.id, displayed.formDataIds)) failures.push('PAYLOAD_ID_NOT_FORMDATA');
    if (displayed.selectedOptionDisabled) failures.push('DISPLAYED_OPTION_DISABLED');
    const quantity = payload.quantity.length ? payload.quantity : ['1'];
    if (!sameList(quantity, [String(expected.quantity ?? 1)])) failures.push('PAYLOAD_QUANTITY_MISMATCH');
    failures.push(...sellingPlanFailures(expected, payload.sellingPlan, displayed.formDataSellingPlans));
    failures.push(...propertyFailures(expected, payload.properties));
  }
  return {
    result: failures.length ? 'FAIL' : 'PASS',
    failures,
    // Solo identificadores y conteos; los valores de propiedades no salen de memoria.
    evidence: payload ? { sentId: payload.id, sentQuantity: payload.quantity, sentSellingPlan: payload.sellingPlan, propertyKeys: Object.keys(payload.properties).sort(), displayed: { selectedOptionValue: displayed.selectedOptionValue, formDataIds: displayed.formDataIds }, captureReason: captures[0].reason } : { displayed: { selectedOptionValue: displayed.selectedOptionValue, formDataIds: displayed.formDataIds } },
  };
}

// Instala la captura en un BrowserContext. Debe llamarse DESPUES de registrar el router
// D28 para ejecutarse primero. Devuelve un registro por contexto.
export async function installNativeCartAddCapture(context, { origin, mainFrameOf }) {
  const exactOrigin = assertOrigin(origin);
  const log = { captures: [], fallbacks: 0, nonCaptureMutations: [], reachedServer: [] };
  // Una mutacion que obtiene respuesta llego al servidor (reenviada por otra ruta o
  // sin interceptar). Las abortadas emiten requestfailed y no entran aqui.
  context.on('requestfinished', (request) => {
    if (request.method() === 'GET' || request.method() === 'HEAD') return;
    let pathname = 'unparseable';
    try { pathname = new URL(request.url()).pathname; } catch { /* fijo */ }
    log.reachedServer.push({ method: request.method(), pathname });
  });
  await context.route('**/*', async (route) => {
    const request = route.request();
    let primaryFrame = false;
    try { primaryFrame = request.frame() === mainFrameOf(request); } catch { primaryFrame = false; }
    const decision = classifyRequest({ origin: exactOrigin, method: request.method(), url: request.url(), resourceType: request.resourceType(), isNavigation: request.isNavigationRequest(), primaryFrame });
    if (!decision.capture) {
      if (request.method() !== 'GET' && request.method() !== 'HEAD') {
        let pathname = 'unparseable';
        try { pathname = new URL(request.url()).pathname; } catch { /* fijo */ }
        log.nonCaptureMutations.push({ method: request.method(), pathname, reason: decision.reason });
      }
      log.fallbacks += 1;
      await route.fallback();
      return;
    }
    // El aborto va en finally: la ruta queda resuelta sin salir del navegador aunque
    // leer el cuerpo o la cabecera lance. El analisis se hace despues del aborto.
    let buffer = Buffer.alloc(0);
    let contentType = null;
    let readError = null;
    try {
      buffer = request.postDataBuffer() || Buffer.alloc(0);
      contentType = await request.headerValue('content-type');
    } catch {
      readError = 'REQUEST_BODY_UNREADABLE';
    } finally {
      await route.abort(ABORT_ERROR_CODE).catch(() => {});
    }
    const entry = { reason: CAPTURE_REASON, pathname: new URL(request.url()).pathname, payload: null, parseError: readError };
    if (!readError) { try { entry.payload = parseCartAddPayload(buffer, contentType); } catch (error) { entry.parseError = String(error.message).slice(0, 60); } }
    log.captures.push(entry);
  });
  return log;
}

// Lee lo que la pagina muestra justo antes de enviar: valor y estado de la opcion
// seleccionada del select nativo y FormData(form).getAll('id').
export async function readDisplayed(page, formSelector) {
  return page.evaluate((selector) => {
    const form = document.querySelector(selector);
    const select = form?.querySelector('select[name="id"]');
    const option = select?.selectedOptions?.[0] || null;
    const visible = Boolean(select && select.getClientRects().length && getComputedStyle(select).visibility !== 'hidden');
    return {
      formFound: Boolean(form),
      selectVisible: visible,
      selectedOptionValue: option ? option.value : null,
      selectedOptionDisabled: option ? option.disabled : null,
      formDataIds: form ? new FormData(form).getAll('id').map(String) : [],
      formDataSellingPlans: form ? new FormData(form).getAll('selling_plan').map(String) : [],
    };
  }, formSelector);
}

// Precondiciones del caso, antes de tocar la pagina. Falla cerrado: sin ellas no se
// selecciona ni se envia nada.
export function casePreconditionFailures({ variantA, variantB, expected }) {
  const failures = [];
  const a = typeof variantA === 'string' ? variantA : '';
  const b = typeof variantB === 'string' ? variantB : '';
  if (!VARIANT_ID.test(a) || !VARIANT_ID.test(b)) failures.push('VARIANT_A_OR_B_INVALID');
  else if (a === b) failures.push('VARIANT_A_EQUALS_B');
  if (!expected || String(expected.variantId ?? '') !== b || !VARIANT_ID.test(b)) failures.push('EXPECTED_ID_NOT_VARIANT_B');
  if (!expected || typeof expected.productHasSellingPlans !== 'boolean') failures.push('PRODUCT_SELLING_PLANS_UNDECLARED');
  if (expected && expected.properties !== undefined && expected.properties !== null && !isPlainObject(expected.properties)) failures.push('EXPECTED_PROPERTIES_INVALID');
  return failures;
}

// Un caso A->B sin JS sobre una pagina recien cargada. El llamador ya verifico
// identidad de tema/pagina con su propia politica (D28 en tienda). Exige que A y B
// sean distintas, que la pagina muestre A antes del cambio, que el id esperado sea B y
// que el id enviado sea exactamente ese.
export async function runNoJsVariantCase(page, log, { formSelector, variantA, variantB, expected, timeoutMs = 5000 }) {
  const preconditions = casePreconditionFailures({ variantA, variantB, expected });
  if (preconditions.length) return { result: 'FAIL', failures: preconditions, evidence: {} };
  const before = log.captures.length;
  const beforeMutations = log.nonCaptureMutations.length;
  const beforeReached = log.reachedServer.length;
  const loaded = await readDisplayed(page, formSelector);
  if (!loaded.formFound || !loaded.selectVisible) {
    return { result: 'FAIL', failures: [loaded.formFound ? 'NATIVE_VARIANT_SELECTOR_NOT_VISIBLE' : 'PRODUCT_FORM_NOT_FOUND'], evidence: { loaded: { selectedOptionValue: loaded.selectedOptionValue } } };
  }
  if (loaded.selectedOptionValue !== variantA) {
    return { result: 'FAIL', failures: ['PAGE_NOT_LOADED_ON_VARIANT_A'], evidence: { loaded: { selectedOptionValue: loaded.selectedOptionValue } } };
  }
  const select = page.locator(`${formSelector} select[name="id"]`);
  try { await select.selectOption(variantB, { timeout: timeoutMs }); } catch {
    return { result: 'FAIL', failures: ['VARIANT_B_NOT_SELECTABLE'], evidence: { loaded: { selectedOptionValue: loaded.selectedOptionValue } } };
  }
  const displayed = await readDisplayed(page, formSelector);
  if (!displayed.formFound || !displayed.selectVisible) {
    return { result: 'FAIL', failures: [displayed.formFound ? 'NATIVE_VARIANT_SELECTOR_NOT_VISIBLE' : 'PRODUCT_FORM_NOT_FOUND'], evidence: { displayed: { selectedOptionValue: displayed.selectedOptionValue } } };
  }
  const submit = page.locator(`${formSelector} [type="submit"]`).first();
  // El aborto deja la navegacion fallida a proposito; no es un error de red del caso.
  await Promise.allSettled([
    page.waitForEvent('requestfailed', { predicate: (request) => request.method() === 'POST', timeout: timeoutMs }),
    submit.click({ timeout: timeoutMs, noWaitAfter: true }),
  ]);
  const deadline = Date.now() + timeoutMs;
  while (log.captures.length === before && log.nonCaptureMutations.length === beforeMutations && log.reachedServer.length === beforeReached && Date.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 25));
  // Margen corto para que un reenvio tardio tambien quede registrado.
  await new Promise((resolve) => setTimeout(resolve, 150));
  const captures = log.captures.slice(before);
  const reachedServer = log.reachedServer.slice(beforeReached);
  const parseFailed = captures.find((capture) => capture.parseError);
  if (parseFailed) return { result: 'FAIL', failures: ['PAYLOAD_PARSE_FAILED', ...(reachedServer.length ? ['REQUEST_REACHED_SERVER'] : [])], evidence: { parseError: parseFailed.parseError } };
  const outcome = evaluateCase({ expected, displayed, captures, blockedOther: log.nonCaptureMutations.slice(beforeMutations), reachedServer });
  outcome.evidence.loaded = { selectedOptionValue: loaded.selectedOptionValue };
  return outcome;
}
