import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';

// Fresh runner written for the permitted previews. No storageState, trace, HAR,
// screenshots, raw exceptions, response bodies, DOM text or form values are saved.
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../../..');
const ORIGIN = 'https://tema-qkqpke0j.myshopify.com';
const PREVIEWS = Object.freeze([
  { preset: 'sartorial', id: '190232297715' },
  { preset: 'imprint', id: '190232330483' },
  { preset: 'archive', id: '190232363251' },
]);
const AUTHORIZED_THEME_IDS = new Set(PREVIEWS.map((preview) => preview.id));
const ROUTES = Object.freeze({ home: '/', collection: '/collections/the-permanent-collection', product: '/products/wool-waistcoat', cart: '/cart' });
const AXE_SHA256 = '3e34029d5a3db40742dde7ea7445e5101eb5073860f8698b2a92f091af4d7481';
const AXE_VERSION = '4.10.2';
const AXE_RULES = Object.freeze(['aria-allowed-attr', 'aria-hidden-focus', 'aria-required-attr', 'aria-valid-attr', 'aria-valid-attr-value', 'button-name', 'color-contrast', 'document-title', 'duplicate-id-active', 'duplicate-id-aria', 'frame-title', 'heading-order', 'html-has-lang', 'html-lang-valid', 'image-alt', 'input-button-name', 'input-image-alt', 'label', 'label-content-name-mismatch', 'landmark-no-duplicate-main', 'landmark-one-main', 'landmark-unique', 'link-name', 'nested-interactive', 'page-has-heading-one', 'role-img-alt', 'scrollable-region-focusable', 'select-name', 'tabindex']);
const EXTERNAL_HEADERS = Object.freeze({ Accept: '*/*', 'User-Agent': 'Codex-RA-RB-ReadOnly-Harness' });
const KNOWN_STATIC_SUFFIX = /\.(?:css|m?js|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|eot|mp4|webm|mov)$/i;
const DENIAL_REASONS = new Set(['REQUEST_OUTSIDE_ALLOWLIST', 'REQUEST_ADDRESS_NOT_ALLOWED', 'CHECKOUT_PAYMENT_ACCOUNT_ADMIN_BLOCKED', 'NON_PRIMARY_FRAME_BLOCKED', 'PREVIEW_QUERY_NOT_ALLOWED', 'MUTATION_BLOCKED', 'DOCUMENT_OUTSIDE_ALLOWLIST', 'PREVIEW_NOT_VERIFIED', 'CROSS_ORIGIN_REDIRECT_BLOCKED', 'WEBSOCKET_BLOCKED']);
const DENIED_SOURCE_SUFFIXES = Object.freeze({ 'base.css': 'base_css', 'theme.js': 'theme_js', 'shopify-xr.js': 'shopify_xr_js', 'product-zoom.js': 'product_zoom_js' });
const INVENTORY_HOSTS = new Set(['tema-qkqpke0j.myshopify.com', 'cdn.shopify.com', 'cdn.shopifycdn.net', 'fonts.shopifycdn.com', 'fonts.googleapis.com', 'fonts.gstatic.com']);
const INVENTORY_KINDS = new Set(['script', 'stylesheet', 'image', 'font', 'media', 'texttrack']);
const INVENTORY_LIMIT = 100;
// Kept only in process memory; it is distinct from every emitted run/file ID.
const INVENTORY_HASH_SALT = randomUUID();
const STATIC_HOSTS = Object.freeze({
  // Fixed reviewed repo reference; page-discovered paths never extend this list.
  'cdn.shopify.com': { label: 'shopify_cdn', paths: Object.freeze(['/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css']) },
});
const VIEWPORTS = Object.freeze([{ width: 390, height: 844 }, { width: 1280, height: 800 }]);
const CROSSES = Object.freeze([
  [{ width: 390, height: 844 }, { width: 1280, height: 800 }, { width: 390, height: 844 }],
  [{ width: 820, height: 1180 }, { width: 1180, height: 820 }],
  [{ width: 390, height: 844 }, { width: 844, height: 390 }],
]);
const args = process.argv.slice(2);
const mode = args.includes('--read-only') ? 'read-only' : args.includes('--inventory') ? 'inventory' : args.includes('--cart') ? 'cart' : null;
const themeArg = args.find((arg) => arg.startsWith('--theme='))?.slice(8);
const selected = themeArg ? PREVIEWS.filter((preview) => preview.id === themeArg) : PREVIEWS;
const stamp = new Date().toISOString().replace(/[-:.]/g, '');
const outputFile = resolve(HERE, 'results', `RA-RB-${mode || 'invalid'}-${stamp}-${randomUUID()}.json`);
const report = {
  schema: 1,
  mode,
  scopeResult: mode === 'inventory' ? 'inventory_only' : 'not_run',
  executionResult: 'not_run',
  startedAt: new Date().toISOString(),
  finishedAt: null,
  target: { host: 'tema-qkqpke0j.myshopify.com', themeIds: selected.map((preview) => preview.id) },
  limits: [
    'SCOPED_HARNESS_NOT_FULL_RA_RB_CERTIFICATION',
    'NO_THEME_SETTINGS_OR_CATALOG_WRITES',
    'NO_CHECKOUT_OR_PAYMENT',
    'NO_SCREEN_READER_OR_VISUAL_CONTRAST_CERTIFICATION',
    'RESOURCE_FILTERING_CAN_AFFECT_RESULTS',
    'C_R0_4_SUBSCRIPTION_FIXTURE_PENDING_JOHANDRY',
  ],
  checks: [],
  sessions: [],
};
let expect;
let inventorySecretGuard = null;

class CheckError extends Error {
  constructor(code) { super(code); this.code = code; }
}
class SkipCheck extends CheckError {}
const requireThat = (condition, code) => { if (!condition) throw new CheckError(code); };
function safeCode(error) {
  if (error instanceof CheckError && /^[A-Z][A-Z0-9_]+$/.test(error.code)) return error.code;
  if (error?.name === 'TimeoutError') return 'PLAYWRIGHT_TIMEOUT';
  if (['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error?.code)) return 'MODULE_NOT_FOUND';
  return 'HARNESS_OPERATION_FAILED';
}
async function saveReport() {
  if (mode === 'inventory') validateInventoryBeforeSave();
  await mkdir(dirname(outputFile), { recursive: true });
  // Direct replacement avoids the Windows destination-rename failure mode.
  // Inventory emits guarded known hosts and salted fingerprints, never paths.
  await writeFile(outputFile, `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', flag: 'w' });
}
async function check(preview, name, details, operation) {
  const entry = { preset: preview?.preset || null, themeId: preview?.id || null, name, result: 'running', reason: null, details };
  report.checks.push(entry);
  try {
    const measured = await operation();
    entry.result = 'passed';
    if (measured !== undefined) entry.details = measured;
    return true;
  } catch (error) {
    entry.result = error instanceof SkipCheck ? 'not_run' : 'failed';
    entry.reason = safeCode(error);
    return false;
  }
}
function assertStorePage(page, session) {
  const current = new URL(page.url());
  requireThat(current.origin === ORIGIN, 'NAVIGATION_ORIGIN_NOT_ALLOWED');
  requireThat(!/^\/(password|challenge)\/?$/.test(current.pathname), 'STOREFRONT_LOCKED');
  requireThat(!current.searchParams.has('preview_theme_id') || current.searchParams.get('preview_theme_id') === session.themeId, 'PREVIEW_QUERY_NOT_ALLOWED');
}
async function verifyPreview(page, session) {
  assertStorePage(page, session);
  const matches = await page.evaluate((expected) => typeof window.Shopify?.theme?.id !== 'undefined' && String(window.Shopify.theme.id) === expected, session.themeId);
  requireThat(matches, 'PREVIEW_ID_NOT_VERIFIED');
  session.previewVerified = true;
}
async function goto(page, preview, route, session) {
  const response = await page.goto(`${ORIGIN}${ROUTES[route]}?preview_theme_id=${preview.id}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  requireThat(Boolean(response?.ok()), 'PAGE_HTTP_NON_2XX');
  await expect(page.locator('main')).toBeVisible();
  await page.waitForFunction(() => document.readyState !== 'loading');
  await verifyPreview(page, session);
}
async function authenticate(page, preview, password, session) {
  // A single API POST stores any session cookie in this BrowserContext only.
  // maxRedirects/maxRetries are zero: the password is never replayed to a hop.
  session.authPostAllowed = true;
  const response = await requestViaPolicy(session, 'POST', '/password', { form: { form_type: 'storefront_password', utf8: '\u2713', password } });
  requireThat([302, 303].includes(response.status()), 'AUTH_RESPONSE_NOT_ACCEPTED');
  requireThat(Boolean(response.headers().location), 'AUTH_REDIRECT_LOCATION_MISSING');
  session.authSubmitted = true;
  await goto(page, preview, 'home', session);
}
function requestDecision(session, method, rawAddress, kind, context, primaryFrame) {
  const decision = { method: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method) ? method : 'OTHER', kind: ['document', 'stylesheet', 'image', 'media', 'font', 'script', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other', 'api'].includes(kind) ? kind : 'other', context, hostClass: 'invalid', pathClass: 'outside_allowlist', queryRemoved: false, allowed: false, reason: 'REQUEST_OUTSIDE_ALLOWLIST' };
  let address;
  let path;
  try { address = new URL(rawAddress); path = address.pathname; } catch { return decision; }
  const sameStore = address.origin === ORIGIN;
  const staticHost = Object.hasOwn(STATIC_HOSTS, address.hostname) ? STATIC_HOSTS[address.hostname] : null;
  decision.hostClass = sameStore ? 'store' : staticHost?.label || 'external';
  decision.queryRemoved = !sameStore && Boolean(address.search);
  if (address.protocol !== 'https:' || address.port || address.username || address.password || /[\u0000-\u0020\\%]/.test(path) || /(?:^|\/)\.\.?\//.test(path)) { decision.reason = 'REQUEST_ADDRESS_NOT_ALLOWED'; return decision; }
  if (/(?:checkout|payments?|shop[-_]?pay)/i.test(address.hostname) || /(?:^|\/)(?:checkouts?|payments?|pay|accounts?|admin)(?:[-_.\/]|$)/i.test(path)) { decision.pathClass = 'restricted_commerce_account_admin'; decision.reason = 'CHECKOUT_PAYMENT_ACCOUNT_ADMIN_BLOCKED'; return decision; }
  if (context === 'browser' && !primaryFrame) { decision.reason = 'NON_PRIMARY_FRAME_BLOCKED'; return decision; }
  const preview = address.searchParams.get('preview_theme_id');
  if (sameStore && preview !== null && preview !== session.themeId) { decision.reason = 'PREVIEW_QUERY_NOT_ALLOWED'; return decision; }
  const reads = method === 'GET' || method === 'HEAD';
  if (!reads) {
    if (sameStore && method === 'POST' && path === '/password' && !address.search && !address.hash && context === 'api' && kind === 'api' && session.authPostAllowed) { decision.pathClass = 'password_auth'; decision.allowed = true; decision.reason = 'AUTH_POST_ALLOWED'; return decision; }
    decision.pathClass = /^\/cart(?:\/|\.|$)/.test(path) ? 'cart_other' : 'outside_allowlist';
    decision.reason = 'MUTATION_BLOCKED';
    return decision;
  }
  if (kind === 'document') {
    if (sameStore && Object.values(ROUTES).includes(path) && (preview === session.themeId || session.previewVerified || session.authSubmitted)) { decision.pathClass = 'store_document'; decision.allowed = true; decision.reason = 'DOCUMENT_READ_ALLOWED'; return decision; }
    if (sameStore && path === '/password' && preview === session.themeId) { decision.pathClass = 'password_page'; decision.allowed = true; decision.reason = 'PASSWORD_READ_ALLOWED'; return decision; }
    decision.reason = 'DOCUMENT_OUTSIDE_ALLOWLIST';
    return decision;
  }
  if (sameStore) {
    if (path === '/cart.js') { decision.pathClass = 'cart_read'; decision.allowed = session.previewVerified; decision.reason = decision.allowed ? 'STORE_READ_ALLOWED' : 'PREVIEW_NOT_VERIFIED'; return decision; }
    if (Object.values(ROUTES).includes(path) || path === `${ROUTES.product}.js` || /^\/(?:search\/suggest(?:\.json)?|recommendations\/products(?:\.json)?)$/.test(path)) { decision.pathClass = 'store_read'; decision.allowed = true; decision.reason = 'STORE_READ_ALLOWED'; return decision; }
    const themeRoots = PREVIEWS.map((preview) => new RegExp(`^/cdn/shop/t/${preview.id}/`));
    if (isStaticResourcePath(path, themeRoots)) { decision.pathClass = 'authorized_preview_theme_asset'; decision.allowed = true; decision.reason = 'STATIC_READ_ALLOWED'; return decision; }
    if (isStaticResourcePath(path, [/^\/cdn\/shop\/(?:files|products)\//])) { decision.pathClass = 'store_media_asset'; decision.allowed = true; decision.reason = 'STATIC_READ_ALLOWED'; return decision; }
    if (isStaticResourcePath(path, [/^\/(?:cdn\/)?shopifycloud\//])) { decision.pathClass = 'store_platform_asset'; decision.allowed = true; decision.reason = 'STATIC_READ_ALLOWED'; return decision; }
  } else if (staticHost?.paths.includes(path)) { decision.pathClass = 'static_asset'; decision.allowed = true; decision.reason = 'STATIC_READ_ALLOWED'; return decision; }
  return decision;
}
function isStaticResourcePath(path, roots) {
  return path.length <= 1024 && !path.includes('//') && /^[A-Za-z0-9_@+.,~/-]+$/.test(path) && KNOWN_STATIC_SUFFIX.test(path) && roots.some((root) => root.test(path));
}
function deniedResourceCategory(session, rawAddress, reason) {
  const category = { rootCategory: 'external', extensionClass: 'other', sourceSuffix: 'other', asciiAllowed: false, lengthWithinLimit: false, reason: DENIAL_REASONS.has(reason) ? reason : 'UNCLASSIFIED_DENIAL' };
  try {
    const address = new URL(rawAddress);
    const path = address.pathname;
    const suffix = path.slice(path.lastIndexOf('/') + 1);
    if (Object.hasOwn(DENIED_SOURCE_SUFFIXES, suffix)) category.sourceSuffix = DENIED_SOURCE_SUFFIXES[suffix];
    if (address.origin === ORIGIN) {
      const themeRoot = /^\/cdn\/shop\/t\/(\d+)\//.exec(path);
      if (themeRoot) category.rootCategory = AUTHORIZED_THEME_IDS.has(themeRoot[1]) ? 'authorized_preview_theme_root' : 'other_theme_root';
      else if (path.startsWith('/cdn/shop/files/')) category.rootCategory = 'files';
      else if (path.startsWith('/cdn/shop/products/')) category.rootCategory = 'products';
      else if (/^\/(?:cdn\/)?shopifycloud\//.test(path)) category.rootCategory = 'platform';
      else category.rootCategory = 'other_store';
    }
    category.extensionClass = KNOWN_STATIC_SUFFIX.test(path) ? 'known_static' : 'other';
    category.asciiAllowed = /^[A-Za-z0-9_@+.,~/-]+$/.test(path);
    category.lengthWithinLimit = path.length <= 1024;
  } catch { /* Unparseable addresses keep fail-closed fixed categories only. */ }
  return category;
}
function recordRequest(session, decision, rawAddress) {
  if (!decision.allowed) {
    session.blockedRequests += 1;
    const category = deniedResourceCategory(session, rawAddress, decision.reason);
    const key = [category.rootCategory, category.extensionClass, category.sourceSuffix, category.asciiAllowed, category.lengthWithinLimit, category.reason].join('|');
    const previous = session.deniedResourceSummary.get(key);
    if (previous) previous.count += 1;
    else session.deniedResourceSummary.set(key, { ...category, count: 1 });
    if (session.mode === 'inventory') recordInventoryResource(session, decision, rawAddress, category.rootCategory);
  }
  if (decision.method !== 'GET' || !decision.allowed || decision.queryRemoved || decision.redirectHop) {
    if (session.requestDecisions.length < 1000) session.requestDecisions.push(decision);
    else session.requestDecisionsOmitted += 1;
  }
}
function normalizedForms(value) {
  const forms = new Set();
  let current = String(value);
  for (let pass = 0; pass < 4; pass += 1) {
    const normalized = current.normalize('NFKC').trim().toLowerCase().replaceAll('\u00df', 'ss').replaceAll('\u03c2', '\u03c3');
    if (normalized) forms.add(normalized);
    if (pass === 3) break;
    let decoded;
    try { decoded = decodeURIComponent(current.replaceAll('+', ' ')); } catch { break; }
    if (decoded === current) break;
    current = decoded;
  }
  return forms;
}
function buildInventorySecretGuard(environment) {
  const secrets = new Set();
  let unavailable = false;
  for (const [name, value] of Object.entries(environment)) {
    if (!/(?:token|password|passwd|pwd|cookie|secret|auth|credential|key)/i.test(name) || !value) continue;
    if (value.length > 16384) { unavailable = true; continue; }
    for (const form of normalizedForms(value)) secrets.add(form);
  }
  return {
    unavailable,
    matches(value) {
      if (unavailable) return true;
      for (const candidate of normalizedForms(value)) for (const secret of secrets) if (candidate.includes(secret)) return true;
      return false;
    },
  };
}
function inventoryEntry(decision, rawAddress, rootCategory) {
  const entry = { method: decision.method, resourceKind: decision.kind, hostCategory: 'other_host', host: null, resourceFingerprint: null, rootCategory, blockReason: DENIAL_REASONS.has(decision.reason) ? decision.reason : 'UNCLASSIFIED_DENIAL', redacted: true, redactionReason: 'UNSAFE_ADDRESS', count: 1 };
  let address;
  try { address = new URL(rawAddress); } catch { return entry; }
  if (!INVENTORY_HOSTS.has(address.hostname)) { entry.redactionReason = 'UNKNOWN_HOST'; return entry; }
  entry.hostCategory = address.origin === ORIGIN ? 'store' : 'known_static_host';
  if (address.protocol !== 'https:' || address.port || address.username || address.password) return entry;
  if (!inventorySecretGuard || inventorySecretGuard.unavailable) { entry.redactionReason = 'GUARD_UNAVAILABLE'; return entry; }
  if (inventorySecretGuard.matches(address.hostname) || inventorySecretGuard.matches(address.pathname)) { entry.redactionReason = 'SECRET_MATCH'; return entry; }
  if (address.pathname.length > 1024) { entry.redactionReason = 'PATH_TOO_LONG'; return entry; }
  if (!/^[A-Za-z0-9_@+.,~/-]+$/.test(address.pathname) || address.pathname.includes('//') || /(?:^|\/)\.\.?(?:\/|$)/.test(address.pathname)) { entry.redactionReason = 'UNSAFE_PATH_FORMAT'; return entry; }
  if (!KNOWN_STATIC_SUFFIX.test(address.pathname)) { entry.redactionReason = 'NON_STATIC_SUFFIX'; return entry; }
  entry.host = address.hostname;
  entry.resourceFingerprint = createHash('sha256').update(INVENTORY_HASH_SALT).update('\0').update(address.hostname).update('\0').update(address.pathname).digest('hex');
  entry.redacted = false;
  entry.redactionReason = null;
  return entry;
}
function recordInventoryResource(session, decision, rawAddress, rootCategory) {
  if (!['GET', 'HEAD'].includes(decision.method) || decision.context !== 'browser' || !INVENTORY_KINDS.has(decision.kind)) return;
  session.inventoryCounters.eligibleOccurrences += 1;
  const entry = inventoryEntry(decision, rawAddress, rootCategory);
  if (entry.redacted) session.inventoryCounters.redactedOccurrences += 1;
  const key = JSON.stringify([entry.method, entry.resourceKind, entry.hostCategory, entry.host, entry.resourceFingerprint, entry.rootCategory, entry.blockReason, entry.redactionReason]);
  const existing = session.inventoryResources.get(key);
  if (existing) { existing.count += 1; return; }
  if (session.inventoryResources.size >= INVENTORY_LIMIT) { session.inventoryCounters.truncatedOccurrences += 1; return; }
  session.inventoryResources.set(key, entry);
}
function validateInventoryBeforeSave() {
  for (const session of report.sessions) for (const entry of session.inventoryResources || []) {
    if (!inventorySecretGuard || inventorySecretGuard.unavailable) { entry.host = null; entry.resourceFingerprint = null; entry.redacted = true; entry.redactionReason = 'GUARD_UNAVAILABLE'; continue; }
    if ((entry.host && inventorySecretGuard.matches(entry.host)) || (entry.resourceFingerprint && inventorySecretGuard.matches(entry.resourceFingerprint))) { entry.host = null; entry.resourceFingerprint = null; entry.redacted = true; entry.redactionReason = 'SECRET_MATCH'; }
  }
}
async function requestViaPolicy(session, method, path, options = {}) {
  if (!(method === 'POST' && path === '/password')) assertStorePage(session.page, session);
  const decision = requestDecision(session, method, `${ORIGIN}${path}`, 'api', 'api', false);
  recordRequest(session, decision, `${ORIGIN}${path}`);
  requireThat(decision.allowed, 'API_REQUEST_BLOCKED_BY_POLICY');
  if (decision.pathClass === 'password_auth') session.authPostAllowed = false;
  const response = await session.api.fetch(`${ORIGIN}${path}`, { ...options, method, timeout: 12000, maxRedirects: 0, maxRetries: 0 });
  const location = response.headers().location;
  if (decision.pathClass === 'password_auth') {
    requireThat([302, 303].includes(response.status()), 'AUTH_RESPONSE_NOT_ACCEPTED');
    requireThat(Boolean(location), 'AUTH_REDIRECT_LOCATION_MISSING');
    let landing;
    try { landing = new URL(location, `${ORIGIN}/password`); } catch { throw new CheckError('AUTH_REDIRECT_DESTINATION_NOT_ALLOWED'); }
    // The server's query/fragment are neither accepted as navigation inputs nor
    // serialized. Only origin/path are validated; goto() builds the next URL.
    landing.search = '';
    landing.hash = '';
    requireThat(landing.origin === ORIGIN && landing.pathname === '/' && !landing.username && !landing.password, 'AUTH_REDIRECT_DESTINATION_NOT_ALLOWED');
    recordRequest(session, { method: 'GET', kind: 'api', context: 'api', hostClass: 'store', pathClass: 'store_document', queryRemoved: false, redirectHop: true, validationOnly: true, allowed: true, reason: 'AUTH_HOME_DESTINATION_VALIDATED' });
    return response;
  }
  if (location) {
    validatedRedirect(session, `${ORIGIN}${path}`, location, 'api', 'api', false);
    throw new CheckError('API_REDIRECT_NOT_ALLOWED');
  }
  return response;
}
function validatedRedirect(session, source, location, kind, context, primaryFrame) {
  let from;
  let target;
  try { from = new URL(source); target = new URL(location, from); } catch { throw new CheckError('REDIRECT_ADDRESS_NOT_ALLOWED'); }
  const decision = requestDecision(session, 'GET', target.href, kind, context, primaryFrame);
  decision.redirectHop = true;
  if (target.origin !== from.origin) { decision.allowed = false; decision.reason = 'CROSS_ORIGIN_REDIRECT_BLOCKED'; }
  recordRequest(session, decision, target.href);
  requireThat(decision.allowed, 'REDIRECT_DESTINATION_NOT_ALLOWED');
  return target;
}
function browserFetchAddress(rawAddress) {
  const address = new URL(rawAddress);
  if (address.origin !== ORIGIN) address.search = '';
  address.hash = '';
  return address;
}
function createRouter(session) {
  return async (route) => {
    try {
      const request = route.request();
      let primaryFrame = false;
      try { primaryFrame = request.frame() === session.page.mainFrame(); } catch { /* Worker/frame-less requests are denied. */ }
      const decision = requestDecision(session, request.method(), request.url(), request.resourceType(), 'browser', primaryFrame);
      recordRequest(session, decision, request.url());
      if (!decision.allowed) { await route.abort('blockedbyclient'); return; }
      if (decision.pathClass === 'store_document' || decision.pathClass === 'password_page') session.previewVerified = false;
      // Never let Chromium automatically follow a server redirect. Fetch one
      // read hop at a time, validating before each hop, then fulfill a final body.
      let address = browserFetchAddress(request.url());
      for (let hop = 0; hop < 6; hop += 1) {
        let externalClient = null;
        let response = null;
        try {
          if (address.origin !== ORIGIN) {
            // A fresh empty-cookie client per hop cannot inherit browser Cookie,
            // Authorization, Referer, Origin or custom request headers.
            externalClient = await session.createExternalClient();
            response = await externalClient.fetch(address.href, { method: request.method(), headers: EXTERNAL_HEADERS, maxRedirects: 0, maxRetries: 0, timeout: 15000 });
          } else response = await route.fetch({ url: address.href, method: request.method(), maxRedirects: 0, maxRetries: 0, timeout: 15000 });
          const location = response.headers().location;
          if (location) {
            const next = validatedRedirect(session, address.href, location, request.resourceType(), 'browser', primaryFrame);
            requireThat([301, 302, 303, 307, 308].includes(response.status()), 'REDIRECT_STATUS_NOT_ALLOWED');
            address = browserFetchAddress(next.href);
            continue;
          }
          requireThat(response.status() < 300 || response.status() >= 400 || response.status() === 304, 'REDIRECT_LOCATION_MISSING');
          const headers = { ...response.headers() };
          delete headers.location;
          delete headers.refresh;
          if (externalClient) { delete headers['set-cookie']; delete headers['www-authenticate']; }
          await route.fulfill({ response, headers });
          return;
        } finally {
          if (response) await response.dispose().catch(() => {});
          if (externalClient) await externalClient.dispose().catch(() => {});
        }
      }
      throw new CheckError('REDIRECT_LIMIT_EXCEEDED');
    } catch {
      session.routeOperationFailed = true;
      try { await route.abort('failed'); } catch { /* A closed request is already settled. */ }
    }
  };
}
async function layout(page) {
  return page.evaluate(() => ({
    viewportWidth: innerWidth,
    documentWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
    h1Count: document.querySelectorAll('main h1').length,
  }));
}
async function focusedState(page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!element || element === document.body || element === document.documentElement) return { usable: false, indicator: false, body: true };
    if (element.tagName === 'IFRAME') return { usable: true, indicator: false, externalFrame: true };
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      usable: rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && !element.closest('[inert], [aria-hidden="true"]'),
      indicator: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none',
      body: false,
    };
  });
}
async function keyboardSmoke(page) {
  const counts = { tabSteps: 0, usableFocusSteps: 0, cssIndicatorSteps: 0, externalFrameSteps: 0, bodySteps: 0 };
  await page.keyboard.press('Escape');
  await page.evaluate(() => {
    const previous = document.body.getAttribute('tabindex');
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();
    if (previous === null) document.body.removeAttribute('tabindex');
    else document.body.setAttribute('tabindex', previous);
  });
  for (let index = 0; index < 32; index += 1) {
    await page.keyboard.press('Tab');
    const state = await focusedState(page);
    counts.tabSteps += 1;
    if (state.externalFrame) { counts.externalFrameSteps += 1; continue; }
    if (state.body) { counts.bodySteps += 1; continue; }
    requireThat(state.usable, 'TAB_FOCUS_HIDDEN_OR_INERT');
    counts.usableFocusSteps += 1;
    if (state.indicator) counts.cssIndicatorSteps += 1;
  }
  await page.keyboard.press('Shift+Tab');
  const reverse = await focusedState(page);
  requireThat(reverse.usable || reverse.externalFrame, 'REVERSE_TAB_FOCUS_HIDDEN_OR_INERT');
  requireThat(counts.usableFocusSteps > 0, 'NO_USABLE_TAB_FOCUS');
  return { ...counts, cssIndicatorIsObservationOnly: true, visualContrastStillRequired: true };
}
async function runAxe(page, axeSource) {
  const alias = `__raRbAxe_${randomUUID().replaceAll('-', '')}`;
  // Capture CommonJS exports from the hash-pinned local source. The scan never
  // uses a pre-existing window.axe or arbitrary rule IDs supplied by the page.
  const wrapped = `(() => { const module = { exports: {} }; const define = undefined; const previous = Object.getOwnPropertyDescriptor(window, 'axe'); ${axeSource}\n; const controlled = module.exports; if (previous) Object.defineProperty(window, 'axe', previous); else delete window.axe; Object.defineProperty(window, ${JSON.stringify(alias)}, { value: controlled, configurable: true, writable: false }); })();`;
  await page.addScriptTag({ content: wrapped });
  try {
    const measured = await page.evaluate(async ({ key, allowedRules, version }) => {
      const controlled = window[key];
      if (!controlled || controlled.version !== version || typeof controlled.run !== 'function' || typeof controlled.getRules !== 'function') return { valid: false };
      const allow = new Set(allowedRules);
      const known = new Set(controlled.getRules().map((rule) => rule.ruleId));
      const selectedRules = allowedRules.filter((id) => known.has(id));
      const hasNameRule = selectedRules.includes('label-content-name-mismatch');
      const result = await controlled.run({ exclude: [['#preview-bar-iframe']] }, { runOnly: { type: 'rule', values: selectedRules }, rules: hasNameRule ? { 'label-content-name-mismatch': { enabled: true } } : {} });
      const summarize = (list) => list.map((rule) => ({ rule: allow.has(rule.id) ? rule.id : 'unclassified', impact: ['minor', 'moderate', 'serious', 'critical'].includes(rule.impact) ? rule.impact : null, nodeCount: Array.isArray(rule.nodes) ? rule.nodes.length : 0 }));
      return { valid: true, axeVersion: version, selectedRuleCount: selectedRules.length, unavailableFixedRuleCount: allowedRules.length - selectedRules.length, labelNameRuleAvailable: hasNameRule, violations: summarize(result.violations), incomplete: summarize(result.incomplete), passes: Array.isArray(result.passes) ? result.passes.length : 0, previewBarIframeExcluded: true };
    }, { key: alias, allowedRules: AXE_RULES, version: AXE_VERSION });
    requireThat(measured.valid, 'CONTROLLED_AXE_INSTANCE_NOT_VERIFIED');
    return measured;
  } finally { await page.evaluate((key) => { delete window[key]; }, alias).catch(() => {}); }
}
async function languageLabels(page) {
  return page.locator('localization-form button[name="language_code"]').evaluateAll((buttons) => {
    const visible = buttons.filter((button) => button.getClientRects().length > 0);
    const normalize = (value) => value.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
    return { visibleControls: visible.length, labelsContainVisibleText: visible.every((button) => normalize(button.getAttribute('aria-label') || '').startsWith(normalize(button.textContent || ''))) };
  });
}
async function drawerCross(page, sequence) {
  await page.setViewportSize(sequence[0]);
  const trigger = page.locator('theme-drawer [data-drawer-trigger]').first();
  if (!(await trigger.isVisible())) throw new SkipCheck('MOBILE_MENU_TRIGGER_NOT_RENDERED');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('theme-drawer [data-drawer-panel]').first()).toBeVisible();
  const outcomes = [];
  for (const viewport of sequence.slice(1)) {
    await page.setViewportSize(viewport);
    const visible = await trigger.isVisible();
    if (!visible) {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('body')).not.toHaveAttribute('data-drawer-open', '');
      const focus = await focusedState(page);
      requireThat(focus.usable || focus.externalFrame, 'DRAWER_CROSS_FOCUS_NOT_USABLE');
      const mainInert = await page.locator('main').evaluate((main) => Boolean(main.closest('[inert]')));
      requireThat(!mainInert, 'DRAWER_CROSS_BACKGROUND_STILL_INERT');
    }
    outcomes.push({ width: viewport.width, height: viewport.height, triggerVisible: visible, expanded: (await trigger.getAttribute('aria-expanded')) === 'true' });
  }
  if ((await trigger.getAttribute('aria-expanded')) === 'true') await page.locator('theme-drawer [data-drawer-close]').first().click();
  await expect(page.locator('body')).not.toHaveAttribute('data-drawer-open', '');
  return { startWidth: sequence[0].width, startHeight: sequence[0].height, outcomes };
}
async function emptyCartDrawer(page, session) {
  const initial = await cartState(page, session);
  requireThat(initial.ok, 'CART_INITIAL_STATE_UNREADABLE');
  if (initial.itemCount !== 0 || !initial.noteEmpty) throw new SkipCheck('SESSION_CART_NOT_EMPTY');
  const link = page.locator('header a.site-header__cart').first();
  await link.click();
  await page.waitForFunction(() => location.pathname === '/cart' || document.querySelector('cart-drawer')?.hasAttribute('data-open'));
  if (new URL(page.url()).pathname === '/cart') { await verifyPreview(page, session); throw new SkipCheck('CART_PAGE_CONFIGURED'); }
  const drawer = page.locator('cart-drawer');
  await expect(drawer).toHaveAttribute('data-open', '');
  await expect(drawer.locator('[data-cart-drawer-panel]')).toBeVisible();
  const focus = await focusedState(page);
  requireThat(focus.usable, 'CART_DRAWER_FOCUS_NOT_USABLE');
  await drawer.locator('[data-cart-drawer-close]').click();
  await expect(drawer).not.toHaveAttribute('data-open', '');
  await expect(page.locator('body')).not.toHaveAttribute('data-drawer-open', '');
  return { opened: true, closed: true, usableInitialFocus: true };
}
async function readOnlySuite(page, preview, axeSource, session) {
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const route of ['home', 'collection', 'product']) {
      const context = { page: route, width: viewport.width, height: viewport.height };
      const navigated = await check(preview, 'page_access', context, async () => { await goto(page, preview, route, session); return context; });
      if (!navigated) continue;
      await check(preview, 'horizontal_overflow', context, async () => {
        const measured = await layout(page);
        requireThat(measured.documentWidth <= measured.viewportWidth + 1, 'HORIZONTAL_OVERFLOW');
        return { ...context, ...measured };
      });
      await check(preview, 'keyboard_tab_smoke', context, async () => ({ ...context, ...await keyboardSmoke(page) }));
      await check(preview, 'axe_smoke', context, async () => {
        const measured = await runAxe(page, axeSource);
        // Preserve only rule/count summaries; HTML, selectors and node values stay in memory.
        report.checks.push({ preset: preview.preset, themeId: preview.id, name: 'axe_rule_summary', result: 'observed', reason: 'AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW', details: { ...context, ...measured } });
        requireThat(measured.violations.length === 0, 'AXE_VIOLATIONS_PRESENT');
        return { ...context, axeVersion: measured.axeVersion, passes: measured.passes };
      });
    }
    await goto(page, preview, 'home', session);
    await check(preview, 'language_visible_name_match', { width: viewport.width }, async () => {
      const measured = await languageLabels(page);
      if (measured.visibleControls === 0) throw new SkipCheck('LANGUAGE_CONTROL_NOT_RENDERED');
      requireThat(measured.labelsContainVisibleText, 'LANGUAGE_VISIBLE_NAME_MISMATCH');
      return { width: viewport.width, ...measured, actualLanguageChangeNotTested: true };
    });
  }
  await goto(page, preview, 'home', session);
  for (const [index, sequence] of CROSSES.entries()) await check(preview, 'menu_viewport_cross', { sequence: index + 1 }, async () => ({ sequence: index + 1, ...await drawerCross(page, sequence) }));
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await check(preview, 'empty_cart_drawer_keyboard_state', { width: viewport.width }, async () => ({ width: viewport.width, ...await emptyCartDrawer(page, session) }));
  }
}
async function inventorySuite(page, preview, session) {
  // Authentication already loaded the locally constructed home preview. These
  // are resource-loading probes only; no functional/axe/keyboard suite is run.
  await check(preview, 'inventory_home_load', { page: 'home' }, async () => {
    await page.waitForLoadState('load', { timeout: 15000 });
    await verifyPreview(page, session);
    return { page: 'home', previewIdVerified: true };
  });
  for (const route of ['collection', 'product']) await check(preview, 'inventory_page_load', { page: route }, async () => {
    await goto(page, preview, route, session);
    await page.waitForLoadState('load', { timeout: 15000 });
    return { page: route, previewIdVerified: true };
  });
}
async function cartState(page, session) {
  let httpStatus = null;
  try {
    const response = await requestViaPolicy(session, 'GET', '/cart.js', { headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' } });
    httpStatus = response.status();
    if (!response.ok()) return { ok: false, httpStatus };
    const cart = await response.json();
    const valid = cart !== null && typeof cart === 'object' && typeof cart.item_count === 'number' && Number.isSafeInteger(cart.item_count) && cart.item_count >= 0 && Array.isArray(cart.items) && (cart.note === null || typeof cart.note === 'string') && cart.items.every((item) => item !== null && typeof item === 'object' && typeof item.quantity === 'number' && Number.isSafeInteger(item.quantity) && item.quantity > 0) && cart.items.reduce((sum, item) => sum + item.quantity, 0) === cart.item_count;
    if (!valid) return { ok: false, httpStatus };
    return { ok: true, httpStatus, itemCount: cart.item_count, lineCount: cart.items.length, noteEmpty: cart.note === null || cart.note === '' };
  } catch { return { ok: false, httpStatus }; }
}
async function main() {
  requireThat(mode && args.filter((arg) => ['--read-only', '--inventory', '--cart'].includes(arg)).length === 1, 'SELECT_EXACTLY_ONE_MODE');
  requireThat(mode !== 'cart', 'CART_MODE_DISABLED_PENDING_REVIEW');
  requireThat(args.every((arg) => ['--read-only', '--inventory', '--cart'].includes(arg) || arg.startsWith('--theme=')), 'ARGUMENT_NOT_SUPPORTED');
  requireThat(selected.length > 0 && (!themeArg || /^\d+$/.test(themeArg)), 'THEME_NOT_ALLOWED');
  requireThat(Boolean(process.env.STOREFRONT_PASSWORD) && Boolean(process.env.SHOPIFY_CLI_THEME_TOKEN), 'REQUIRED_CREDENTIAL_ENV_MISSING');
  const password = process.env.STOREFRONT_PASSWORD;
  if (mode === 'inventory') inventorySecretGuard = buildInventorySecretGuard(process.env);
  const playwright = await import('@playwright/test');
  expect = playwright.expect;
  const axeSource = mode === 'read-only' ? await readFile(resolve(ROOT, 'tests/vendor/axe.min.js'), 'utf8') : null;
  if (mode === 'read-only') requireThat(createHash('sha256').update(axeSource).digest('hex') === AXE_SHA256, 'AXE_SOURCE_DIGEST_NOT_EXPECTED');
  const browser = await playwright.chromium.launch({ headless: true });
  try {
    for (const preview of selected) {
      const context = await browser.newContext({ viewport: VIEWPORTS[0], reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const publicSession = { preset: preview.preset, themeId: preview.id, cartMutationsAllowed: false, contextClosed: false, blockedRequests: 0, blockedWebSockets: 0, popupsClosed: 0, routeOperationFailed: false, requestDecisions: [], requestDecisionsOmitted: 0, deniedResourceSummary: [], inventoryResources: [], inventoryCounters: { maxEntries: INVENTORY_LIMIT, eligibleOccurrences: 0, redactedOccurrences: 0, truncatedOccurrences: 0 } };
      const session = { mode, preset: preview.preset, themeId: preview.id, page, api: context.request, createExternalClient: () => playwright.request.newContext({ storageState: { cookies: [], origins: [] }, userAgent: EXTERNAL_HEADERS['User-Agent'], extraHTTPHeaders: EXTERNAL_HEADERS }), publicSession, authPostAllowed: false, authSubmitted: false, previewVerified: false, blockedRequests: 0, blockedWebSockets: 0, popupsClosed: 0, routeOperationFailed: false, requestDecisions: [], requestDecisionsOmitted: 0, deniedResourceSummary: new Map(), inventoryResources: new Map(), inventoryCounters: { maxEntries: INVENTORY_LIMIT, eligibleOccurrences: 0, redactedOccurrences: 0, truncatedOccurrences: 0 } };
      report.sessions.push(publicSession);
      await context.route('**/*', createRouter(session));
      await context.routeWebSocket('**/*', (socket) => {
        session.blockedWebSockets += 1;
        recordRequest(session, { method: 'OTHER', kind: 'websocket', context: 'browser', hostClass: 'external', pathClass: 'outside_allowlist', allowed: false, reason: 'WEBSOCKET_BLOCKED' });
        try { socket.close({ code: 1008, reason: 'Harness request policy' }); } catch { session.routeOperationFailed = true; }
      });
      context.on('page', (popup) => {
        if (popup === page) return;
        session.popupsClosed += 1;
        popup.close().catch(() => {});
      });
      try {
        const authenticated = await check(preview, 'storefront_access', null, async () => { await authenticate(page, preview, password, session); return { unlocked: true, previewIdVerified: true }; });
        if (authenticated) {
          if (mode === 'inventory') await inventorySuite(page, preview, session);
          else await readOnlySuite(page, preview, axeSource, session);
        }
      } catch (error) {
        report.checks.push({ preset: preview.preset, themeId: preview.id, name: 'preview_suite', result: 'failed', reason: safeCode(error), details: null });
      } finally {
        session.authPostAllowed = false;
        publicSession.blockedRequests = session.blockedRequests;
        publicSession.blockedWebSockets = session.blockedWebSockets;
        publicSession.popupsClosed = session.popupsClosed;
        publicSession.requestDecisions = session.requestDecisions;
        publicSession.requestDecisionsOmitted = session.requestDecisionsOmitted;
        publicSession.deniedResourceSummary = [...session.deniedResourceSummary.values()];
        publicSession.inventoryResources = [...session.inventoryResources.values()];
        publicSession.inventoryCounters = { ...session.inventoryCounters };
        publicSession.routeOperationFailed = session.routeOperationFailed;
        await context.close();
        publicSession.contextClosed = true;
      }
      await saveReport();
    }
  } finally { await browser.close(); }
}

try {
  await main();
  const failed = report.checks.some((entry) => entry.result === 'failed') || report.sessions.some((session) => session.routeOperationFailed);
  report.executionResult = failed ? 'failed' : 'completed';
  report.scopeResult = mode === 'inventory' ? 'inventory_only' : failed ? 'failed' : 'completed_with_limits';
} catch (error) {
  report.executionResult = 'failed';
  report.scopeResult = mode === 'inventory' ? 'inventory_only' : 'failed';
  report.checks.push({ preset: null, themeId: null, name: 'harness_preflight_or_runtime', result: 'failed', reason: safeCode(error), details: null });
} finally {
  report.finishedAt = new Date().toISOString();
  try {
    await saveReport();
    console.log(`report=${basename(outputFile)} scope_result=${report.scopeResult}`);
  } catch { console.log('report_write=FAILED'); process.exitCode = 2; }
  if (report.executionResult === 'failed' && process.exitCode !== 2) process.exitCode = 1;
}
