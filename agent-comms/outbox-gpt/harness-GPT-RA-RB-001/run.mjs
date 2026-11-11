import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

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
const AXE_SHA256 = 'b511cd9dec01c76f4b2ad1723b66b6db37d4c2eb4ed199076e1829d9ee7b75e3';
const AXE_VERSION = '4.10.2';
const AXE_RULES = Object.freeze(['aria-allowed-attr', 'aria-hidden-focus', 'aria-required-attr', 'aria-valid-attr', 'aria-valid-attr-value', 'button-name', 'color-contrast', 'document-title', 'duplicate-id-active', 'duplicate-id-aria', 'frame-title', 'heading-order', 'html-has-lang', 'html-lang-valid', 'image-alt', 'input-button-name', 'input-image-alt', 'label', 'label-content-name-mismatch', 'landmark-no-duplicate-main', 'landmark-one-main', 'landmark-unique', 'link-name', 'nested-interactive', 'page-has-heading-one', 'role-img-alt', 'scrollable-region-focusable', 'select-name', 'tabindex']);
const EXTERNAL_HEADERS = Object.freeze({ Accept: '*/*', 'User-Agent': 'Codex-RA-RB-ReadOnly-Harness' });
const READ_HOSTS = new Set(['tema-qkqpke0j.myshopify.com', 'cdn.shopify.com', 'fonts.shopifycdn.com']);
const ANALYTICS_WARNING_HOSTS = new Set(['monorail-edge.shopifysvc.com', 'www.google-analytics.com', 'region1.google-analytics.com', 'analytics.google.com', 'www.googletagmanager.com', 'stats.g.doubleclick.net', 'connect.facebook.net', 'www.facebook.com', 'analytics.tiktok.com']);
const PLATFORM_WARNING_HOSTS = new Set(['bugsnag.com', 'notify.bugsnag.com', 'sessions.bugsnag.com', 'shop.app', 'www.shop.app', 'pay.shopify.com', 'checkout.shopify.com', 'accounts.shopify.com']);
const CART_POST_PATHS = new Set(['/cart/add.js', '/cart/update.js', '/cart/clear.js']);
const MAX_429_RETRIES = 3;
const CART_REQUEST_INTERVAL_MS = 1000;
const KNOWN_STATIC_SUFFIX = /\.(?:css|m?js|svg|png|jpe?g|webp|avif|gif|ico|woff2?|ttf|otf|eot|mp4|webm|mov)$/i;
const DENIAL_REASONS = new Set(['HOST_NOT_ALLOWED', 'ANALYTICS_HOST_BLOCKED', 'PLATFORM_HOST_BLOCKED', 'REQUEST_ADDRESS_NOT_ALLOWED', 'MUTATION_BLOCKED', 'WEBSOCKET_BLOCKED']);
const DENIED_SOURCE_SUFFIXES = Object.freeze({ 'base.css': 'base_css', 'theme.js': 'theme_js', 'shopify-xr.js': 'shopify_xr_js', 'product-zoom.js': 'product_zoom_js' });
const INVENTORY_HOSTS = new Set(['tema-qkqpke0j.myshopify.com', 'cdn.shopify.com', 'cdn.shopifycdn.net', 'fonts.shopifycdn.com', 'fonts.googleapis.com', 'fonts.gstatic.com']);
const INVENTORY_KINDS = new Set(['script', 'stylesheet', 'image', 'font', 'media', 'texttrack']);
const INVENTORY_LIMIT = 100;
// Kept only in process memory; it is distinct from every emitted run/file ID.
const INVENTORY_HASH_SALT = randomUUID();
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
  interventionRequired: false,
  historicalIncidents: [{ code: 'ARCHIVE_ORPHANED_CART_20261106', preset: 'archive', themeId: '190232363251', initiallyEmptyVerified: true, finalCartState: 'unknown', contextClosed: true, disposition: 'LEAVE_TO_EXPIRE', blocksLote0: false, sourceReport: 'RA-RB-cart-20261106T112804500Z-605bdcd0-07ef-43aa-a9f5-6e0d5038b634.json' }],
};
let expect;
let inventorySecretGuard = null;
const runtimeSessions = [];
const hostRetryNotBefore = new Map();
let cartRequestQueue = Promise.resolve();
let lastCartRequestStartedAt = 0;

class CheckError extends Error {
  constructor(code) { super(code); this.code = code; }
}
class SkipCheck extends CheckError {}
class PolicyBlocked extends CheckError {}
const requireThat = (condition, code) => { if (!condition) throw new CheckError(code); };
function isCartAddress(rawAddress) {
  try { const address = new URL(rawAddress); return address.origin === ORIGIN && /^\/cart(?:\.js|\/|$)/.test(address.pathname); } catch { return false; }
}
async function waitUntil(timestamp) {
  while (Date.now() < timestamp) await delay(Math.min(timestamp - Date.now(), 30000));
}
function retryAfterDelayMs(value, retryIndex) {
  let serverDelay = 0;
  if (typeof value === 'string' && /^\s*\d+\s*$/.test(value)) {
    const seconds = Number(value.trim());
    requireThat(Number.isSafeInteger(seconds) && seconds <= Math.floor(Number.MAX_SAFE_INTEGER / 1000), 'RETRY_AFTER_UNREPRESENTABLE');
    serverDelay = seconds * 1000;
  } else if (typeof value === 'string') {
    const date = Date.parse(value);
    if (Number.isFinite(date)) serverDelay = Math.max(0, date - Date.now());
  }
  return Math.max(1000 * (2 ** retryIndex), serverDelay);
}
async function fetchAttempt(session, method, rawAddress, retryIndex, operation) {
  const address = new URL(rawAddress);
  const perform = async () => {
    while ((hostRetryNotBefore.get(address.hostname) || 0) > Date.now()) await waitUntil(hostRetryNotBefore.get(address.hostname));
    if (isCartAddress(rawAddress)) {
      await waitUntil(lastCartRequestStartedAt + CART_REQUEST_INTERVAL_MS);
      while ((hostRetryNotBefore.get(address.hostname) || 0) > Date.now()) await waitUntil(hostRetryNotBefore.get(address.hostname));
      lastCartRequestStartedAt = Date.now();
    }
    if (method === 'POST' && address.origin === ORIGIN && address.pathname === '/cart/add.js') requireThat(session.cartWriteEnabled && !session.cleanupInProgress && !session.cartStopRequested, 'CART_ADD_STOPPED_FOR_CLEANUP');
    const response = await operation();
    if (response.status() === 429) {
      const waitMs = retryAfterDelayMs(response.headers()['retry-after'], retryIndex);
      hostRetryNotBefore.set(address.hostname, Math.max(hostRetryNotBefore.get(address.hostname) || 0, Date.now() + waitMs));
      if (session.rateLimitEvents.length < 100) session.rateLimitEvents.push({ method: ['GET', 'HEAD', 'POST'].includes(method) ? method : 'OTHER', phase: session.cleanupInProgress ? 'cleanup' : 'workflow', httpStatus: 429, attempt: retryIndex + 1, retriesRemaining: Math.max(0, MAX_429_RETRIES - retryIndex), delayMs: waitMs, ...safeWarningSource(rawAddress) });
      else session.rateLimitEventsOmitted += 1;
    }
    return response;
  };
  if (!isCartAddress(rawAddress)) return perform();
  const previous = cartRequestQueue;
  let release;
  cartRequestQueue = new Promise((resolveQueue) => { release = resolveQueue; });
  await previous;
  try { return await perform(); } finally { release(); }
}
async function fetchWith429Retries(session, method, rawAddress, operation) {
  const address = new URL(rawAddress);
  const isAdd = method === 'POST' && address.origin === ORIGIN && address.pathname === '/cart/add.js';
  for (let retryIndex = 0; retryIndex <= MAX_429_RETRIES; retryIndex += 1) {
    if (isAdd) requireThat(session.cartWriteEnabled && !session.cleanupInProgress && !session.cartStopRequested, 'CART_ADD_STOPPED_FOR_CLEANUP');
    const response = await fetchAttempt(session, method, rawAddress, retryIndex, operation);
    if (response.status() !== 429) return response;
    if (isAdd) {
      // Reconcile in this same session before replaying a non-idempotent add.
      // The expected variant/plan and cart body remain in process memory only.
      const state = await cartState(session.page, session);
      if (state.ok && state.expectedLinePresent) {
        session.cartAddReconciled = true;
        return response; // Preserve Shopify's real HTTP response; never fake one.
      }
      if (!state.ok || state.itemCount !== 0 || state.lineCount !== 0 || !state.noteEmpty || !session.expectedCartLine) {
        session.cartStopRequested = true;
        await response.dispose().catch(() => {});
        throw new CheckError('CART_ADD_RECONCILIATION_UNCERTAIN');
      }
    }
    if (retryIndex === MAX_429_RETRIES) {
      session.routeOperationFailed = true;
      recordRouteFailure(session, 'fetch', method, rawAddress, new CheckError('HTTP_429_RETRIES_EXHAUSTED'));
      return response;
    }
    await response.dispose().catch(() => {});
  }
  throw new CheckError('RATE_LIMIT_RETRY_STATE_INVALID');
}
function safeCode(error) {
  if (error instanceof CheckError && /^[A-Z][A-Z0-9_]+$/.test(error.code)) return error.code;
  if (error?.name === 'TimeoutError') return 'PLAYWRIGHT_TIMEOUT';
  if (['MODULE_NOT_FOUND', 'ERR_MODULE_NOT_FOUND'].includes(error?.code)) return 'MODULE_NOT_FOUND';
  const chromiumCode = typeof error?.message === 'string' ? error.message.match(/\bnet::(ERR_[A-Z0-9_]+)\b/)?.[1] : null;
  if (chromiumCode && new Set(['ERR_ABORTED', 'ERR_BLOCKED_BY_CLIENT', 'ERR_CONNECTION_CLOSED', 'ERR_CONNECTION_RESET', 'ERR_CONNECTION_TIMED_OUT', 'ERR_FAILED', 'ERR_INTERNET_DISCONNECTED', 'ERR_NAME_NOT_RESOLVED', 'ERR_NETWORK_CHANGED', 'ERR_SSL_PROTOCOL_ERROR', 'ERR_TUNNEL_CONNECTION_FAILED']).has(chromiumCode)) return `CHROMIUM_${chromiumCode}`;
  if (new Set(['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN']).has(error?.code)) return `NETWORK_${error.code}`;
  return 'HARNESS_OPERATION_FAILED';
}
async function saveReport() {
  await mkdir(dirname(outputFile), { recursive: true });
  // Each write uses one detached diagnostic snapshot, including writes after
  // context/browser closure. Late handlers cannot mutate only its event list.
  for (const session of runtimeSessions) {
    const events = session.routeFailureEvents.map((event) => ({ ...event }));
    const omitted = session.routeFailureEventsOmitted;
    session.publicSession.routeFailureEvents = events;
    session.publicSession.routeFailureEventsOmitted = omitted;
    session.publicSession.routeOperationFailed = Boolean(session.routeOperationFailed || events.length > 0 || omitted > 0);
    session.publicSession.routeWarningEvents = session.routeWarningEvents.map((event) => ({ ...event }));
    session.publicSession.routeWarningEventsOmitted = session.routeWarningEventsOmitted;
    session.publicSession.rateLimitEvents = session.rateLimitEvents.map((event) => ({ ...event }));
    session.publicSession.rateLimitEventsOmitted = session.rateLimitEventsOmitted;
  }
  if (report.finishedAt !== null) {
    // Final outcomes are derived from the same reconciled snapshot serialized
    // below, after main() has awaited context and browser closure.
    const failed = report.checks.some((entry) => entry.result === 'failed') || report.sessions.some((session) => session.routeOperationFailed);
    report.executionResult = failed ? 'failed' : 'completed';
    report.scopeResult = mode === 'inventory' ? 'inventory_only' : failed ? 'failed' : 'completed_with_limits';
  }
  if (mode === 'inventory') validateInventoryBeforeSave();
  validateWarningSourcesBeforeSave();
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
  requireThat(matches && AUTHORIZED_THEME_IDS.has(session.themeId), 'PREVIEW_ID_NOT_VERIFIED');
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
  // One authentication operation, with manual retries only after HTTP 429.
  // Transport retries/redirects remain zero; no secret is replayed to a hop.
  session.authPostAllowed = true;
  const response = await requestViaPolicy(session, 'POST', '/password', { form: { form_type: 'storefront_password', utf8: '\u2713', password } });
  requireThat([302, 303].includes(response.status()), 'AUTH_RESPONSE_NOT_ACCEPTED');
  requireThat(Boolean(response.headers().location), 'AUTH_REDIRECT_LOCATION_MISSING');
  session.authSubmitted = true;
  await goto(page, preview, 'home', session);
}
function requestDecision(session, method, rawAddress, kind, context, primaryFrame) {
  const decision = { method: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method) ? method : 'OTHER', kind: ['document', 'stylesheet', 'image', 'media', 'font', 'script', 'texttrack', 'xhr', 'fetch', 'eventsource', 'websocket', 'manifest', 'other', 'api'].includes(kind) ? kind : 'other', context, hostClass: 'external', pathClass: 'blocked_host', queryRemoved: false, allowed: false, severity: 'warning', reason: 'HOST_NOT_ALLOWED' };
  let address;
  try { address = new URL(rawAddress); } catch { decision.reason = 'REQUEST_ADDRESS_NOT_ALLOWED'; return decision; }
  const sameStore = address.origin === ORIGIN;
  decision.hostClass = sameStore ? 'store' : address.hostname === 'cdn.shopify.com' ? 'shopify_cdn' : address.hostname === 'fonts.shopifycdn.com' ? 'shopify_font' : 'external';
  if (address.protocol !== 'https:' || address.port || address.username || address.password) { decision.reason = 'REQUEST_ADDRESS_NOT_ALLOWED'; return decision; }
  if (!READ_HOSTS.has(address.hostname)) {
    if (ANALYTICS_WARNING_HOSTS.has(address.hostname)) decision.reason = 'ANALYTICS_HOST_BLOCKED';
    else if (PLATFORM_WARNING_HOSTS.has(address.hostname) || address.hostname.endsWith('.bugsnag.com')) decision.reason = 'PLATFORM_HOST_BLOCKED';
    return decision;
  }
  if (method === 'GET' || method === 'HEAD') {
    decision.allowed = true;
    decision.severity = null;
    decision.pathClass = sameStore && kind === 'document' ? 'store_document' : sameStore ? 'store_read' : 'trusted_cdn_read';
    decision.reason = 'HOST_READ_ALLOWED';
    return decision;
  }
  decision.pathClass = 'blocked_mutation';
  decision.reason = 'MUTATION_BLOCKED';
  if (sameStore && method === 'POST' && address.pathname === '/password' && !address.search && !address.hash && context === 'api' && session.authPostAllowed) {
    decision.allowed = true; decision.severity = null; decision.pathClass = 'password_auth'; decision.reason = 'AUTH_POST_ALLOWED';
  } else if (sameStore && method === 'POST' && CART_POST_PATHS.has(address.pathname) && !address.search && !address.hash && session.mode === 'cart' && session.cartWriteEnabled && session.cartAuthorization && (!session.cleanupInProgress || address.pathname !== '/cart/add.js') && (session.previewVerified || session.cleanupInProgress) && (context === 'api' || primaryFrame)) {
    decision.allowed = true; decision.severity = null; decision.pathClass = 'cart_post'; decision.reason = 'CART_POST_ALLOWED';
  }
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
    recordNetworkWarning(session, decision, rawAddress);
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
function safeWarningSource(rawAddress) {
  const source = { host: null, pathname: null, redacted: true, redactionReason: 'UNSAFE_ADDRESS' };
  let address;
  try { address = new URL(rawAddress); } catch { return source; }
  if (!/^[a-z0-9.-]{1,253}$/.test(address.hostname) || address.username || address.password) return source;
  if (!inventorySecretGuard || inventorySecretGuard.unavailable) { source.redactionReason = 'GUARD_UNAVAILABLE'; return source; }
  if (inventorySecretGuard.matches(address.hostname)) { source.redactionReason = 'SECRET_MATCH'; return source; }
  source.host = address.hostname;
  if (address.pathname.length > 1024) { source.redactionReason = 'PATH_TOO_LONG'; return source; }
  if (inventorySecretGuard.matches(address.pathname)) { source.redactionReason = 'SECRET_MATCH'; return source; }
  if (!/^[A-Za-z0-9_@+.,~/%-]+$/.test(address.pathname)) { source.redactionReason = 'UNSAFE_PATH_FORMAT'; return source; }
  source.pathname = address.pathname;
  source.redacted = false;
  source.redactionReason = null;
  return source;
}
function recordNetworkWarning(session, decision, rawAddress) {
  const source = safeWarningSource(rawAddress);
  const entry = { severity: 'warning', method: decision.method, resourceKind: decision.kind, reason: DENIAL_REASONS.has(decision.reason) ? decision.reason : 'RESOURCE_BLOCKED', ...source, count: 1 };
  session.warningOccurrences += 1;
  const key = JSON.stringify([entry.method, entry.resourceKind, entry.reason, entry.host, entry.pathname, entry.redactionReason]);
  const existing = session.networkWarnings.get(key);
  if (existing) existing.count += 1;
  else if (session.networkWarnings.size < 200) session.networkWarnings.set(key, entry);
  else session.warningOccurrencesOmitted += 1;
}
function validateWarningSourcesBeforeSave() {
  for (const session of report.sessions) for (const entry of [...(session.networkWarnings || []), ...(session.routeFailureEvents || []), ...(session.routeWarningEvents || []), ...(session.rateLimitEvents || [])]) {
    if (!inventorySecretGuard || inventorySecretGuard.unavailable) { entry.host = null; entry.pathname = null; entry.redacted = true; entry.redactionReason = 'GUARD_UNAVAILABLE'; continue; }
    if (entry.host && inventorySecretGuard.matches(entry.host)) { entry.host = null; entry.pathname = null; entry.redacted = true; entry.redactionReason = 'SECRET_MATCH'; }
    else if (entry.pathname && inventorySecretGuard.matches(entry.pathname)) { entry.pathname = null; entry.redacted = true; entry.redactionReason = 'SECRET_MATCH'; }
  }
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
  if (!(method === 'POST' && path === '/password') && !(session.mode === 'cart' && session.cartAuthorization && (CART_POST_PATHS.has(path) || path === '/cart.js'))) assertStorePage(session.page, session);
  const decision = requestDecision(session, method, `${ORIGIN}${path}`, 'api', 'api', false);
  recordRequest(session, decision, `${ORIGIN}${path}`);
  requireThat(decision.allowed, 'API_REQUEST_BLOCKED_BY_POLICY');
  if (decision.pathClass === 'password_auth') session.authPostAllowed = false;
  if (decision.pathClass === 'cart_post') { session.cartTouched = true; session.publicSession.cartTouched = true; }
  const response = await fetchWith429Retries(session, method, `${ORIGIN}${path}`, () => session.api.fetch(`${ORIGIN}${path}`, { ...options, method, timeout: 12000, maxRedirects: 0, maxRetries: 0 }));
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
  recordRequest(session, decision, target.href);
  if (!decision.allowed) throw new PolicyBlocked('REDIRECT_DESTINATION_BLOCKED');
  return target;
}
function browserFetchAddress(rawAddress) {
  const address = new URL(rawAddress);
  address.hash = '';
  return address;
}
function routeEvent(session, stage, method, rawAddress, error) {
  const stages = new Set(['request_setup', 'policy_abort', 'preview_validation', 'fetch', 'redirect_validation', 'fulfill', 'redirect_limit']);
  let pageKind = 'other';
  try {
    const path = new URL(session.page.url()).pathname;
    pageKind = Object.entries(ROUTES).find(([, route]) => route === path)?.[0] || 'other';
  } catch { /* Only the fixed page-kind category is emitted. */ }
  return { stage: stages.has(stage) ? stage : 'request_setup', code: safeCode(error), pageKind, method: ['GET', 'HEAD', 'POST'].includes(method) ? method : 'OTHER', ...safeWarningSource(rawAddress) };
}
function recordRouteFailure(session, stage, method, rawAddress, error) {
  if (session.routeFailureEvents.length >= 50) { session.routeFailureEventsOmitted += 1; return; }
  session.routeFailureEvents.push(routeEvent(session, stage, method, rawAddress, error));
}
function isExternalHostFetchFailure(stage, fetchInProgress, method, rawAddress, error) {
  if (stage !== 'fetch' || !fetchInProgress || !['GET', 'HEAD'].includes(method) || error instanceof CheckError) return false;
  try {
    const address = new URL(rawAddress);
    const isThemeAsset = /^\/cdn\/shop\/t\/(?:190232297715|190232330483|190232363251)\//.test(address.pathname)
      || address.pathname.startsWith('/cdn/shop/files/');
    // Johandry's criterion: a network error only fails this gate when it comes
    // from the store host or a theme asset. A failed read from another host is
    // retained as a warning with safe host/path, except the exact theme asset
    // roots which may be served by Shopify's CDN.
    return address.origin !== ORIGIN && !address.username && !address.password && !isThemeAsset;
  } catch { return false; }
}
function recordRouteWarning(session, stage, method, rawAddress, error) {
  if (session.routeWarningEvents.length >= 50) { session.routeWarningEventsOmitted += 1; return; }
  session.routeWarningEvents.push({ severity: 'warning', reason: 'NON_STORE_HOST_FETCH_WARNING_ONLY', ...routeEvent(session, stage, method, rawAddress, error) });
}
function createRouter(session) {
  return async (route) => {
    let stage = 'request_setup';
    let failureAddress;
    let method = 'OTHER';
    let fetchInProgress = false;
    let cartAddRequest = false;
    try {
      const request = route.request();
      failureAddress = request.url();
      method = request.method();
      try { const address = new URL(failureAddress); cartAddRequest = method === 'POST' && address.origin === ORIGIN && address.pathname === '/cart/add.js'; } catch { /* The policy below rejects invalid addresses. */ }
      if (cartAddRequest) session.cartAddInFlight = true;
      let primaryFrame = false;
      try { primaryFrame = request.frame() === session.page.mainFrame(); } catch { /* Worker/frame-less requests are denied. */ }
      const decision = requestDecision(session, request.method(), request.url(), request.resourceType(), 'browser', primaryFrame);
      recordRequest(session, decision, request.url());
      if (!decision.allowed) { stage = 'policy_abort'; await route.abort('blockedbyclient'); return; }
      if (request.isNavigationRequest() && primaryFrame) session.previewVerified = false;
      if (decision.pathClass === 'cart_post') {
        stage = 'preview_validation';
        await verifyPreview(session.page, session);
        session.cartTouched = true;
        session.publicSession.cartTouched = true;
      }
      // Never let Chromium automatically follow a server redirect. Fetch one
      // read hop at a time, validating before each hop, then fulfill a final body.
      let address = browserFetchAddress(request.url());
      for (let hop = 0; hop < 6; hop += 1) {
        let externalClient = null;
        let response = null;
        try {
          stage = 'fetch';
          fetchInProgress = false;
          failureAddress = address.href;
          if (address.origin !== ORIGIN) {
            // A fresh empty-cookie client per hop cannot inherit browser Cookie,
            // Authorization, Referer, Origin or custom request headers.
            externalClient = await session.createExternalClient();
            fetchInProgress = true;
            response = await fetchWith429Retries(session, request.method(), address.href, () => externalClient.fetch(address.href, { method: request.method(), headers: EXTERNAL_HEADERS, maxRedirects: 0, maxRetries: 0, timeout: 15000 }));
          } else {
            fetchInProgress = true;
            response = await fetchWith429Retries(session, request.method(), address.href, () => route.fetch({ url: address.href, method: request.method(), maxRedirects: 0, maxRetries: 0, timeout: 15000 }));
          }
          fetchInProgress = false;
          stage = 'redirect_validation';
          const location = response.headers().location;
          if (location) {
            try { failureAddress = new URL(location, address).href; } catch { failureAddress = undefined; }
            const next = validatedRedirect(session, address.href, location, request.resourceType(), 'browser', primaryFrame);
            requireThat(['GET', 'HEAD'].includes(request.method()), 'POST_REDIRECT_NOT_ALLOWED');
            requireThat([301, 302, 303, 307, 308].includes(response.status()), 'REDIRECT_STATUS_NOT_ALLOWED');
            address = browserFetchAddress(next.href);
            continue;
          }
          requireThat(response.status() < 300 || response.status() >= 400 || response.status() === 304, 'REDIRECT_LOCATION_MISSING');
          stage = 'fulfill';
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
      stage = 'redirect_limit';
      throw new CheckError('REDIRECT_LIMIT_EXCEEDED');
    } catch (error) {
      if (isExternalHostFetchFailure(stage, fetchInProgress, method, failureAddress, error)) {
        recordRouteWarning(session, stage, method, failureAddress, error);
      } else if (!(error instanceof PolicyBlocked)) {
        session.routeOperationFailed = true;
        recordRouteFailure(session, stage, method, failureAddress, error);
      }
      try { await route.abort('failed'); } catch { /* A closed request is already settled. */ }
    } finally {
      if (cartAddRequest) { session.cartAddInFlight = false; session.resolveCartAddCompletion?.(); }
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
      const result = await controlled.run(document, { elementRef: true, runOnly: { type: 'rule', values: selectedRules }, rules: hasNameRule ? { 'label-content-name-mismatch': { enabled: true } } : {} });
      // Only fixed categories/booleans leave the page. Attribute values and
      // iframe addresses are read in memory, never returned or serialized.
      const tags = new Set(['a', 'area', 'article', 'aside', 'audio', 'body', 'button', 'canvas', 'caption', 'col', 'colgroup', 'dd', 'details', 'dialog', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'html', 'iframe', 'img', 'input', 'label', 'legend', 'li', 'main', 'nav', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'progress', 'section', 'select', 'source', 'span', 'summary', 'svg', 'table', 'tbody', 'td', 'textarea', 'th', 'thead', 'time', 'tr', 'ul', 'video']);
      const sectionFamilies = [['header', 'header.site-header'], ['footer', 'footer.site-footer'], ['main_product', 'section.product-main'], ['main_collection', 'section.collection-main'], ['hero_editorial', 'section.hero-editorial'], ['curated_showcase', 'section.curated-showcase'], ['brand_manifesto', 'section.brand-manifesto'], ['bento_discovery', 'section.bento-discovery'], ['lookbook', 'section.lookbook'], ['complete_the_look', 'complete-the-look'], ['newsletter', 'section.newsletter-section'], ['marquee', 'marquee-banner'], ['cart_drawer', 'cart-drawer']];
      const nodeEvidence = (node) => {
        try {
          const element = node.element;
          if (!element || element.nodeType !== 1 || !element.ownerDocument) return { tag: 'unresolved', frameContext: 'unresolved', withinShopifySection: null, sectionFamily: 'unresolved', controlFamily: 'unresolved', iframeSourceFamily: 'unset', diagnosticCode: 'ELEMENT_REFERENCE_UNAVAILABLE' };
          const tag = String(element.localName).toLowerCase();
          let iframeSourceCategory = 'unset';
          let iframeSourceFamily = 'unset';
          if (tag === 'iframe' && element.getAttribute('src')) {
            iframeSourceCategory = 'other';
            iframeSourceFamily = 'other';
            try {
              const address = new URL(element.getAttribute('src'), element.ownerDocument.baseURI);
              if (address.origin === 'https://tema-qkqpke0j.myshopify.com') iframeSourceCategory = 'store';
              else if (address.hostname === 'cdn.shopify.com') iframeSourceCategory = 'shopify_cdn';
              else if (address.hostname === 'hcaptcha.com' || address.hostname.endsWith('.hcaptcha.com')) iframeSourceCategory = 'captcha';
              const safeAddress = address.protocol === 'https:' && !address.port && !address.username && !address.password && /^[a-z0-9.-]{1,253}$/.test(address.hostname) && address.pathname.length <= 1024 && /^[A-Za-z0-9_@+.,~/%-]+$/.test(address.pathname);
              if (safeAddress && address.hostname === 'cdn.shopify.com' && /^\/shopifycloud\/(?:preview-bar|storefront-preview-bar)(?:\/|$)/.test(address.pathname)) iframeSourceFamily = 'shopify_preview_bar';
              else if (safeAddress && address.hostname === 'cdn.shopify.com' && address.pathname.startsWith('/shopifycloud/')) iframeSourceFamily = 'shopify_cloud_other';
              else if (safeAddress && address.origin === 'https://tema-qkqpke0j.myshopify.com') iframeSourceFamily = 'store';
            } catch { /* Invalid addresses retain a fixed category. */ }
          }
          const sectionFamily = sectionFamilies.find(([, root]) => element.closest(root))?.[0] || 'other_or_none';
          const controlFamily = element.matches('button[data-sticky-submit]') ? 'sticky_add_button' : element.matches('a.bento-card') ? 'bento_discovery_link' : 'other';
          return { tag: tags.has(tag) ? tag : 'other', frameContext: element.ownerDocument === document ? 'main_document' : 'iframe_document', iframeTitlePresent: tag === 'iframe' ? Boolean(element.getAttribute('title')?.trim()) : null, iframeSourceCategory, iframeSourceFamily, sectionFamily, controlFamily, landmarkRegion: element.closest('header.site-header') ? 'header' : element.closest('main') ? 'main' : 'other_or_none', withinShopifySection: Boolean(element.closest('[id^="shopify-section-"]')), hasAriaLabel: ['a', 'button'].includes(tag) ? element.hasAttribute('aria-label') : null, diagnosticCode: null };
        } catch { return { tag: 'unresolved', frameContext: 'unresolved', withinShopifySection: null, sectionFamily: 'unresolved', controlFamily: 'unresolved', iframeSourceFamily: 'unset', diagnosticCode: 'NODE_CLASSIFICATION_FAILED' }; }
      };
      let previewBarWarningOnlyNodeCount = 0;
      const summarize = (list, previewWarningsOnly = false) => list.map((rule) => {
        const sourceNodes = Array.isArray(rule.nodes) ? rule.nodes : [];
        let nodeCount = 0;
        let previewWarningCount = 0;
        const nodes = [];
        for (const node of sourceNodes) {
          const evidence = nodeEvidence(node);
          if (previewWarningsOnly && evidence.iframeSourceFamily === 'shopify_preview_bar') {
            previewWarningCount += 1;
            previewBarWarningOnlyNodeCount += 1;
            continue;
          }
          nodeCount += 1;
          if (nodes.length < 30) nodes.push(evidence);
        }
        // Drop a rule only when all of its nodes were positively identified as
        // the Shopify preview bar. Unknown/other frames and mixed rules remain.
        if (previewWarningCount > 0 && nodeCount === 0) return null;
        const ruleId = allow.has(rule.id) ? rule.id : 'unclassified';
        return { rule: ruleId, ruleId, impact: ['minor', 'moderate', 'serious', 'critical'].includes(rule.impact) ? rule.impact : null, nodeCount, nodes, nodesOmitted: Math.max(0, nodeCount - nodes.length) };
      }).filter((rule) => rule !== null);
      const violations = summarize(result.violations, true);
      const incomplete = summarize(result.incomplete);
      return { valid: true, axeVersion: version, selectedRuleCount: selectedRules.length, unavailableFixedRuleCount: allowedRules.length - selectedRules.length, labelNameRuleAvailable: hasNameRule, violations, incomplete, passes: Array.isArray(result.passes) ? result.passes.length : 0, previewBarWarningOnlyNodeCount };
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
  const drawer = page.locator('cart-drawer');
  const drawerRendered = await drawer.count() > 0;
  const sectionId = drawerRendered ? await drawer.getAttribute('data-section-id') : null;
  requireThat(!drawerRendered || Boolean(sectionId), 'CART_DRAWER_SECTION_ID_MISSING');
  // Register before opening. Query values only identify the expected response
  // in memory and are never returned in check details or diagnostics.
  const synchronized = drawerRendered ? page.waitForResponse((response) => {
    try {
      const address = new URL(response.url());
      return response.request().method() === 'GET' && address.origin === ORIGIN && address.pathname === '/cart' && address.searchParams.get('section_id') === sectionId;
    } catch { return false; }
  }, { timeout: 30000 }).then(async (response) => {
    const finished = await response.finished();
    if (!response.ok()) return { ok: false, code: 'CART_SECTION_RENDERING_HTTP_FAILED' };
    return finished === null ? { ok: true, code: null } : { ok: false, code: 'CART_SECTION_RENDERING_INCOMPLETE' };
  }).catch((error) => ({ ok: false, code: safeCode(error) })) : null;
  try {
    await link.click();
    await page.waitForFunction(() => location.pathname === '/cart' || document.querySelector('cart-drawer')?.hasAttribute('data-open'));
    if (new URL(page.url()).pathname === '/cart') {
      await verifyPreview(page, session);
      requireThat(!drawerRendered, 'CART_DRAWER_NAVIGATED_TO_CART_PAGE');
      throw new SkipCheck('CART_PAGE_CONFIGURED');
    }
    requireThat(Boolean(synchronized), 'CART_DRAWER_NOT_RENDERED');
    const synced = await synchronized;
    requireThat(synced.ok, synced.code);
    await expect(drawer).toHaveAttribute('data-open', '');
    await expect(drawer.locator('[data-cart-drawer-panel]')).toBeVisible();
    const focus = await focusedState(page);
    requireThat(focus.usable, 'CART_DRAWER_FOCUS_NOT_USABLE');
    await drawer.locator('[data-cart-drawer-close]').click();
    await expect(drawer).not.toHaveAttribute('data-open', '');
    await expect(page.locator('body')).not.toHaveAttribute('data-drawer-open', '');
    return { opened: true, closed: true, usableInitialFocus: true, sectionRenderingResponseVerified: true };
  } finally { await synchronized; }
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
        // Preserve rule/count and fixed node categories; HTML, selectors and node values stay in memory.
        report.checks.push({ preset: preview.preset, themeId: preview.id, name: 'axe_rule_summary', result: 'observed', reason: 'AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW', details: { ...context, ...measured } });
        if (measured.previewBarWarningOnlyNodeCount > 0) report.checks.push({ preset: preview.preset, themeId: preview.id, name: 'axe_platform_warning', result: 'observed', reason: 'SHOPIFY_PREVIEW_BAR_WARNING_ONLY', details: { ...context, nodeOccurrences: measured.previewBarWarningOnlyNodeCount } });
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
async function cartState(page, session, expectedNote) {
  let httpStatus = null;
  try {
    const response = await requestViaPolicy(session, 'GET', '/cart.js', { headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' } });
    httpStatus = response.status();
    if (!response.ok()) return { ok: false, httpStatus };
    const cart = await response.json();
    const valid = cart !== null && typeof cart === 'object' && typeof cart.item_count === 'number' && Number.isSafeInteger(cart.item_count) && cart.item_count >= 0 && Array.isArray(cart.items) && (cart.note === null || typeof cart.note === 'string') && cart.items.every((item) => item !== null && typeof item === 'object' && typeof item.quantity === 'number' && Number.isSafeInteger(item.quantity) && item.quantity > 0) && cart.items.reduce((sum, item) => sum + item.quantity, 0) === cart.item_count;
    if (!valid) return { ok: false, httpStatus };
    const expected = session.expectedCartLine;
    const expectedLinePresent = expected ? cart.item_count === 1 && cart.items.length === 1 && cart.items[0].quantity === 1 && String(cart.items[0].variant_id) === expected.variantId && (expected.sellingPlanId === null ? !cart.items[0].selling_plan_allocation : String(cart.items[0].selling_plan_allocation?.selling_plan?.id) === expected.sellingPlanId) : null;
    return { ok: true, httpStatus, itemCount: cart.item_count, lineCount: cart.items.length, noteEmpty: cart.note === null || cart.note === '', noteMatches: typeof expectedNote === 'string' ? cart.note === expectedNote : null, expectedLinePresent };
  } catch { return { ok: false, httpStatus }; }
}
async function cartSuite(page, preview, session) {
  await page.setViewportSize(VIEWPORTS[0]);
  await goto(page, preview, 'product', session);
  await verifyPreview(page, session);
  const initial = await cartState(page, session);
  requireThat(initial.ok && initial.itemCount === 0 && initial.lineCount === 0 && initial.noteEmpty, 'SESSION_CART_NOT_EMPTY_AT_START');
  session.cartAuthorization = true;
  session.cartWriteEnabled = true;
  session.publicSession.cartInitiallyEmptyVerified = true;
  await saveReport(); // Local report must be writable before the first mutation.
  const added = await check(preview, 'cart_pdp_add_one_line', { width: VIEWPORTS[0].width }, async () => {
    const form = page.locator('main form[data-cart-add-form]').first();
    requireThat(await form.count() > 0, 'PDP_ADD_FORM_MISSING');
    const button = form.locator('button[name="add"]').first();
    if (!(await button.isEnabled())) throw new SkipCheck('PDP_ADD_BUTTON_UNAVAILABLE');
    const expected = await form.evaluate((element, origin) => {
      const action = new URL(element.action, location.href);
      const data = new FormData(element);
      const quantity = data.get('quantity');
      const variantId = String(data.get('id') || '');
      const sellingPlanId = String(data.get('selling_plan') || '') || null;
      return { valid: action.origin === origin && ['/cart/add', '/cart/add.js'].includes(action.pathname) && /^\d+$/.test(variantId) && (sellingPlanId === null || /^\d+$/.test(sellingPlanId)) && (quantity === null || quantity === '1'), variantId, sellingPlanId };
    }, ORIGIN);
    requireThat(expected.valid, 'PDP_TEST_FORM_NOT_SUPPORTED');
    session.expectedCartLine = { variantId: expected.variantId, sellingPlanId: expected.sellingPlanId };
    await verifyPreview(page, session);
    session.cartAddCompletion = new Promise((resolveAdd) => { session.resolveCartAddCompletion = resolveAdd; });
    const requested = page.waitForRequest((request) => {
      try { const address = new URL(request.url()); return request.method() === 'POST' && address.origin === ORIGIN && address.pathname === '/cart/add.js'; } catch { return false; }
    }, { timeout: 15000 }).then(() => true).catch(() => false);
    await button.click();
    requireThat(await requested, 'PDP_ADD_REQUEST_NOT_OBSERVED');
    await session.cartAddCompletion;
    requireThat(!session.cartStopRequested, 'CART_ADD_RECONCILIATION_UNCERTAIN');
    await expect(form).not.toHaveAttribute('data-cart-add-pending', 'true', { timeout: 30000 });
    const state = await cartState(page, session);
    requireThat(state.ok && state.expectedLinePresent, 'CART_ADD_NOT_EXACTLY_ONE_LINE');
    return { oneLineVerified: true, oneItemVerified: true, httpStatus: state.httpStatus, reconciledAfter429: session.cartAddReconciled };
  });
  if (!added) return;
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await check(preview, 'populated_cart_drawer_viewport', { width: viewport.width, height: viewport.height }, async () => {
      const drawer = page.locator('cart-drawer');
      if (await drawer.count() === 0) throw new SkipCheck('CART_DRAWER_NOT_RENDERED');
      if ((await drawer.getAttribute('data-open')) === null) await page.locator('header a.site-header__cart').first().click();
      await expect(drawer).toHaveAttribute('data-open', '');
      await expect(drawer.locator('[data-cart-drawer-panel]')).toBeVisible();
      return { width: viewport.width, height: viewport.height, visible: true };
    });
  }
  await check(preview, 'cart_note_exact_api_echo', null, async () => {
    await verifyPreview(page, session);
    const note = `${randomUUID()}\n  \u{1F642}`;
    const response = await requestViaPolicy(session, 'POST', '/cart/update.js', { data: { note }, headers: { Accept: 'application/json' } });
    requireThat(response.ok(), 'CART_NOTE_UPDATE_HTTP_FAILED');
    const state = await cartState(page, session, note);
    requireThat(state.ok && state.noteMatches && state.itemCount === 1, 'CART_NOTE_ECHO_MISMATCH');
    return { exactEchoVerified: true, httpStatus: response.status(), noteValueStored: false };
  });
}
async function cleanupCart(session) {
  const result = { attempted: false, clearHttpStatus: null, updateHttpStatus: null, readHttpStatus: null, itemCount: null, emptyVerified: null, noteEmptyVerified: null };
  if (!session.cartAuthorization) return result;
  session.cleanupInProgress = true;
  session.cartWriteEnabled = false;
  if (session.cartAddInFlight) await session.cartAddCompletion;
  session.cartWriteEnabled = true;
  result.attempted = true;
  try {
    for (const [path, data, key] of [['/cart/clear.js', {}, 'clearHttpStatus'], ['/cart/update.js', { note: '' }, 'updateHttpStatus']]) {
      try { result[key] = (await requestViaPolicy(session, 'POST', path, { data, headers: { Accept: 'application/json' } })).status(); } catch { /* Keep unknown and continue to final read. */ }
    }
    const state = await cartState(session.page, session);
    result.readHttpStatus = state.httpStatus;
    if (state.ok) { result.itemCount = state.itemCount; result.emptyVerified = state.itemCount === 0 && state.lineCount === 0; result.noteEmptyVerified = state.noteEmpty; }
  } finally { session.cartWriteEnabled = false; session.cleanupInProgress = false; }
  return result;
}
function cleanupVerified(cleaned) {
  return cleaned?.emptyVerified === true && cleaned?.noteEmptyVerified === true;
}
async function holdForManualCleanup(session, browser) {
  session.interventionOccurred = true;
  report.interventionRequired = true;
  report.executionResult = 'awaiting_intervention';
  report.scopeResult = 'awaiting_intervention';
  const incident = session.publicSession.cleanupIncident ||= { code: 'CART_CLEANUP_UNVERIFIED', status: 'awaiting_intervention', initiallyEmptyVerified: session.publicSession.cartInitiallyEmptyVerified === true, manualCleanupAttempts: 0, contextPreserved: !session.page.isClosed(), browserPreserved: browser.isConnected(), emptyVerified: false, noteEmptyVerified: false };
  const persist = async () => {
    incident.contextPreserved = !session.page.isClosed();
    incident.browserPreserved = browser.isConnected();
    try { await saveReport(); } catch { console.log('incident_write=FAILED_CONTEXT_HELD'); }
  };
  await persist();
  console.log(`intervention_required=CART_CLEANUP_UNVERIFIED report=${basename(outputFile)} manual_command=retry-cleanup`);
  // No expiration, automatic retry or context/browser closure while unverified.
  // Input is a fixed operator command; arbitrary input is discarded, never echoed.
  let input = '';
  let busy = false;
  const keepAlive = setInterval(() => {}, 30000);
  return new Promise((resolveIntervention) => {
    const onInput = (chunk) => {
      if (chunk.length > 128 || input.length + chunk.length > 128) { input = ''; return; }
      input += chunk;
      let newline;
      while ((newline = input.indexOf('\n')) !== -1) {
        const command = input.slice(0, newline).trim();
        input = input.slice(newline + 1);
        if (command !== 'retry-cleanup' || busy) continue;
        busy = true;
        void (async () => {
          incident.manualCleanupAttempts += 1;
          try {
            const cleaned = await cleanupCart(session);
            session.publicSession.finalCartCleanup = cleaned;
            incident.emptyVerified = cleaned.emptyVerified === true;
            incident.noteEmptyVerified = cleaned.noteEmptyVerified === true;
            if (cleanupVerified(cleaned)) {
              incident.status = 'recovered_by_operator';
              report.interventionRequired = false;
              report.checks.push({ preset: session.preset, themeId: session.themeId, name: 'manual_same_session_cart_cleanup', result: 'passed', reason: null, details: cleaned });
              await persist();
              process.stdin.off('data', onInput);
              process.stdin.pause();
              clearInterval(keepAlive);
              resolveIntervention(cleaned);
              return;
            }
            incident.status = 'awaiting_intervention';
          } catch { incident.status = 'awaiting_intervention'; }
          await persist();
          console.log('intervention_required=CART_CLEANUP_UNVERIFIED context_held=true');
          busy = false;
        })();
      }
    };
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', onInput);
    process.stdin.resume();
  });
}
async function main() {
  requireThat(mode && args.filter((arg) => ['--read-only', '--inventory', '--cart'].includes(arg)).length === 1, 'SELECT_EXACTLY_ONE_MODE');
  requireThat(args.every((arg) => ['--read-only', '--inventory', '--cart'].includes(arg) || arg.startsWith('--theme=')), 'ARGUMENT_NOT_SUPPORTED');
  requireThat(selected.length > 0 && (!themeArg || /^\d+$/.test(themeArg)), 'THEME_NOT_ALLOWED');
  requireThat(Boolean(process.env.STOREFRONT_PASSWORD) && Boolean(process.env.SHOPIFY_CLI_THEME_TOKEN), 'REQUIRED_CREDENTIAL_ENV_MISSING');
  const password = process.env.STOREFRONT_PASSWORD;
  inventorySecretGuard = buildInventorySecretGuard(process.env);
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
      const publicSession = { preset: preview.preset, themeId: preview.id, cartMutationsAllowed: mode === 'cart', unpublishedPreflight: 'required_external_coordinator_check', cartInitiallyEmptyVerified: null, cartTouched: false, finalCartCleanup: null, contextClosed: false, blockedRequests: 0, blockedWebSockets: 0, popupsClosed: 0, routeOperationFailed: false, routeFailureEvents: [], routeFailureEventsOmitted: 0, routeWarningEvents: [], routeWarningEventsOmitted: 0, rateLimitEvents: [], rateLimitEventsOmitted: 0, requestDecisions: [], requestDecisionsOmitted: 0, networkWarnings: [], warningOccurrences: 0, warningOccurrencesOmitted: 0, deniedResourceSummary: [], inventoryResources: [], inventoryCounters: { maxEntries: INVENTORY_LIMIT, eligibleOccurrences: 0, redactedOccurrences: 0, truncatedOccurrences: 0 } };
      const session = { mode, preset: preview.preset, themeId: preview.id, page, context, api: context.request, createExternalClient: () => playwright.request.newContext({ storageState: { cookies: [], origins: [] }, userAgent: EXTERNAL_HEADERS['User-Agent'], extraHTTPHeaders: EXTERNAL_HEADERS }), publicSession, authPostAllowed: false, authSubmitted: false, previewVerified: false, cartAuthorization: false, cartWriteEnabled: false, cartTouched: false, cleanupInProgress: false, expectedCartLine: null, cartAddReconciled: false, cartStopRequested: false, cartAddInFlight: false, cartAddCompletion: Promise.resolve(), resolveCartAddCompletion: null, interventionOccurred: false, blockedRequests: 0, blockedWebSockets: 0, popupsClosed: 0, routeOperationFailed: false, routeFailureEvents: [], routeFailureEventsOmitted: 0, routeWarningEvents: [], routeWarningEventsOmitted: 0, rateLimitEvents: [], rateLimitEventsOmitted: 0, requestDecisions: [], requestDecisionsOmitted: 0, networkWarnings: new Map(), warningOccurrences: 0, warningOccurrencesOmitted: 0, deniedResourceSummary: new Map(), inventoryResources: new Map(), inventoryCounters: { maxEntries: INVENTORY_LIMIT, eligibleOccurrences: 0, redactedOccurrences: 0, truncatedOccurrences: 0 } };
      report.sessions.push(publicSession);
      runtimeSessions.push(session);
      await context.route('**/*', createRouter(session));
      await context.routeWebSocket('**/*', (socket) => {
        session.blockedWebSockets += 1;
        let address;
        try { if (typeof socket.url === 'function') address = socket.url(); } catch { /* No raw error. */ }
        recordRequest(session, { method: 'OTHER', kind: 'websocket', context: 'browser', hostClass: 'external', pathClass: 'blocked_websocket', allowed: false, severity: 'warning', reason: 'WEBSOCKET_BLOCKED' }, address);
        try { socket.close({ code: 1008, reason: 'Harness request policy' }); } catch { /* Blocked transports are warnings only. */ }
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
          else if (mode === 'cart') await cartSuite(page, preview, session);
          else await readOnlySuite(page, preview, axeSource, session);
        }
      } catch (error) {
        report.checks.push({ preset: preview.preset, themeId: preview.id, name: 'preview_suite', result: 'failed', reason: safeCode(error), details: null });
      } finally {
        session.authPostAllowed = false;
        if (mode === 'cart' && session.cartAuthorization) {
          let cleaned;
          try { cleaned = await cleanupCart(session); } catch { cleaned = { attempted: true, clearHttpStatus: null, updateHttpStatus: null, readHttpStatus: null, itemCount: null, emptyVerified: null, noteEmptyVerified: null }; }
          publicSession.finalCartCleanup = cleaned;
          const verified = cleaned.emptyVerified === true && cleaned.noteEmptyVerified === true;
          const writesOk = [cleaned.clearHttpStatus, cleaned.updateHttpStatus].every((status) => Number.isInteger(status) && status >= 200 && status < 300);
          report.checks.push({ preset: preview.preset, themeId: preview.id, name: 'final_same_session_cart_cleanup', result: verified && writesOk ? 'passed' : 'failed', reason: !verified ? 'CART_CLEANUP_NOT_VERIFIED' : !writesOk ? 'CART_CLEANUP_HTTP_FAILED' : null, details: cleaned });
          if (session.cartTouched && !verified) publicSession.finalCartCleanup = await holdForManualCleanup(session, browser);
        }
        session.cartWriteEnabled = false;
        publicSession.cartTouched = session.cartTouched;
        publicSession.blockedRequests = session.blockedRequests;
        publicSession.blockedWebSockets = session.blockedWebSockets;
        publicSession.popupsClosed = session.popupsClosed;
        publicSession.requestDecisions = session.requestDecisions;
        publicSession.requestDecisionsOmitted = session.requestDecisionsOmitted;
        publicSession.networkWarnings = [...session.networkWarnings.values()];
        publicSession.warningOccurrences = session.warningOccurrences;
        publicSession.warningOccurrencesOmitted = session.warningOccurrencesOmitted;
        publicSession.deniedResourceSummary = [...session.deniedResourceSummary.values()];
        publicSession.inventoryResources = [...session.inventoryResources.values()];
        publicSession.inventoryCounters = { ...session.inventoryCounters };
        requireThat(!session.cartTouched || cleanupVerified(publicSession.finalCartCleanup), 'CART_CONTEXT_MUST_REMAIN_OPEN');
        await context.close();
        publicSession.contextClosed = true;
      }
      await saveReport();
      if (session.interventionOccurred) break;
    }
  } finally {
    // Last guard also covers an unexpected exception on the ordinary exit path.
    for (const session of runtimeSessions) {
      if (session.cartTouched && !session.publicSession.contextClosed && !cleanupVerified(session.publicSession.finalCartCleanup)) {
        session.publicSession.finalCartCleanup = await holdForManualCleanup(session, browser);
        await session.context.close();
        session.publicSession.contextClosed = true;
      }
    }
    await browser.close();
  }
}

try {
  await main();
} catch (error) {
  report.checks.push({ preset: null, themeId: null, name: 'harness_preflight_or_runtime', result: 'failed', reason: safeCode(error), details: null });
} finally {
  report.finishedAt = new Date().toISOString();
  try {
    await saveReport();
    console.log(`report=${basename(outputFile)} scope_result=${report.scopeResult}`);
  } catch { console.log('report_write=FAILED'); process.exitCode = 2; }
  if (report.executionResult === 'failed' && process.exitCode !== 2) process.exitCode = 1;
}
