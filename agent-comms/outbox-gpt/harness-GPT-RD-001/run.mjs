#!/usr/bin/env node

// Read-only Lighthouse sampling for the three unpublished Shopify previews.
// Credentials are read only from local environment variables and never emitted.

import { randomUUID } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const PREVIEWS = [
  { preset: 'sartorial', themeId: '190232297715' },
  { preset: 'imprint', themeId: '190232330483' },
  { preset: 'archive', themeId: '190232363251' },
];
const ROUTES = [
  { page: 'home', path: '/' },
  { page: 'collection', env: 'STOREFRONT_COLLECTION_PATH' },
  { page: 'product', env: 'STOREFRONT_PRODUCT_PATH' },
];
const READ_HOSTS = new Set(['tema-qkqpke0j.myshopify.com', 'cdn.shopify.com', 'fonts.shopifycdn.com']);
const STORE_HOST = 'tema-qkqpke0j.myshopify.com';
const SHOP_LOGIN_PATH = '/services/login_with_shop/authorize';
const KNOWN_WARNING_HOSTS = new Set([
  'monorail-edge.shopifysvc.com', 'error-analytics-sessions-production.shopifysvc.com', 'otlp-http-production.shopifysvc.com',
  'www.google-analytics.com', 'region1.google-analytics.com', 'analytics.google.com', 'www.googletagmanager.com',
  'stats.g.doubleclick.net', 'connect.facebook.net', 'www.facebook.com', 'analytics.tiktok.com',
  'shop.app', 'www.shop.app', 'pay.shopify.com', 'checkout.shopify.com', 'accounts.shopify.com',
  'notify.bugsnag.com', 'sessions.bugsnag.com', 'js.hcaptcha.com',
]);
const EXTERNAL_HEADERS = Object.freeze({ Accept: '*/*', 'User-Agent': 'Codex Shopify audit; Lighthouse 13.4.1' });
const RESULT_DIR = path.resolve('agent-comms/outbox-gpt/harness-GPT-RD-001/results');
const PROFILE_CACHE_DIR = path.resolve('node_modules/.cache');
const PROFILE_PREFIX = 'gpt-rd-profile-';
const SECRET_ENV = ['SHOPIFY_CLI_THEME_TOKEN', 'STOREFRONT_PASSWORD'];
const CDP_NETWORK_ERROR_REASONS = new Set([
  'Failed', 'Aborted', 'TimedOut', 'AccessDenied', 'ConnectionClosed', 'ConnectionReset',
  'ConnectionRefused', 'ConnectionAborted', 'ConnectionFailed', 'NameNotResolved',
  'InternetDisconnected', 'AddressUnreachable', 'BlockedByClient', 'BlockedByResponse',
]);
const MAX_429_RETRIES = 3;
const PAGE_TIMEOUT_MS = 45000;
const PREVIEW_URL_PARAM = 'preview_theme_id';
let finalSecretGuard = () => false;

function codeOf(error) {
  if (error?.code && ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN'].includes(error.code)) return `NETWORK_${error.code}`;
  const rawDiagnostic = typeof error?.message === 'string' ? error.message : typeof error?.errorText === 'string' ? error.errorText : '';
  const chromium = rawDiagnostic.match(/\bnet::(ERR_[A-Z0-9_]+)\b/)?.[1] || null;
  if (chromium && ['ERR_ABORTED', 'ERR_CONNECTION_CLOSED', 'ERR_CONNECTION_RESET', 'ERR_CONNECTION_TIMED_OUT', 'ERR_FAILED', 'ERR_INTERNET_DISCONNECTED', 'ERR_NAME_NOT_RESOLVED', 'ERR_NETWORK_CHANGED', 'ERR_SSL_PROTOCOL_ERROR', 'ERR_TUNNEL_CONNECTION_FAILED'].includes(chromium)) return `CHROMIUM_${chromium}`;
  if (error?.name === 'TimeoutError') return 'PLAYWRIGHT_TIMEOUT';
  return 'AUDIT_OPERATION_FAILED';
}

function validateText(name, value) {
  if (typeof value !== 'string' || value.length === 0) throw Object.assign(new Error(), { safeCode: `MISSING_${name}` });
  if (/[\s\r\n]/u.test(value)) throw Object.assign(new Error(), { safeCode: `INVALID_${name}` });
  return value;
}

function normalize(value) {
  let out = String(value ?? '');
  for (let i = 0; i < 4; i += 1) {
    out = out.normalize('NFKC').trim().toLowerCase();
    try { const decoded = decodeURIComponent(out); if (decoded === out) break; out = decoded; } catch { break; }
  }
  return out.normalize('NFKC').trim().toLowerCase();
}

function createSecretGuard(values) {
  const needles = values.filter(Boolean).map(normalize).filter((v) => v.length > 0);
  return (text) => needles.some((needle) => normalize(text).includes(needle));
}

function safeSource(raw, secretGuard) {
  if (typeof raw !== 'string') return { host: null, path: null, scheme: null, redacted: true };
  try {
    const url = new URL(raw);
    const scheme = ['http:', 'https:', 'data:', 'blob:', 'about:', 'file:', 'ws:', 'wss:'].includes(url.protocol) ? url.protocol.slice(0, -1) : 'other';
    // Non-HTTP URLs can embed payloads or local paths; retain only a fixed scheme enum.
    if (!['http', 'https'].includes(scheme)) return { host: null, path: null, scheme, redacted: true };
    const host = url.hostname.toLowerCase();
    const pathname = url.pathname;
    if (url.username || url.password || secretGuard(host) || secretGuard(pathname)) return { host: null, path: null, scheme, redacted: true };
    return { host, path: pathname, scheme, redacted: false };
  } catch { return { host: null, path: null, scheme: null, redacted: true }; }
}

function responseFilterError(error) {
  const protocolCode = [error?.code, error?.cause?.code].find((value) => Number.isInteger(value)) ?? null;
  const diagnostic = typeof error?.message === 'string' ? error.message : '';
  let code = 'RESPONSE_FILTER_OPERATION_FAILED';
  if (['RESPONSE_STATUS_MISSING', 'RESPONSE_HEADERS_MISSING'].includes(error?.safeFilterCode)) code = error.safeFilterCode;
  else if (protocolCode === -32601 || /method.+(?:not found|wasn't found)|wasn't found.+method/i.test(diagnostic)) code = 'PROTOCOL_METHOD_NOT_FOUND';
  else if (protocolCode === -32602 || /invalid parameters/i.test(diagnostic)) code = 'PROTOCOL_INVALID_PARAMETERS';
  else if (/invalid interception|invalid.*requestid|interception.+(?:not found|invalid)/i.test(diagnostic)) code = 'PROTOCOL_INTERCEPTION_ID_INVALID';
  else if (/target closed/i.test(diagnostic)) code = 'PROTOCOL_TARGET_CLOSED';
  else if (/session closed|session.+not found/i.test(diagnostic)) code = 'PROTOCOL_SESSION_CLOSED';
  else if (error?.name === 'ProtocolError') code = 'PROTOCOL_ERROR';
  else if (error?.name === 'TimeoutError') code = 'PROTOCOL_TIMEOUT';
  return { code, protocolCode };
}

function sanitizeReport(value, secretGuard, state = { redactions: 0 }) {
  if (typeof value === 'string') {
    if (secretGuard(value)) { state.redactions += 1; return '[REDACTED_SECRET]'; }
    return value;
  }
  if (Array.isArray(value)) return value.map((entry) => sanitizeReport(entry, secretGuard, state));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeReport(entry, secretGuard, state)]));
  }
  return value;
}

function isKnownCdnHost(host) {
  return host === 'cdn.shopify.com' || /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+shopifycdn\.com$/.test(host ?? '');
}

function isStoreCdnPath(pathname) {
  return pathname?.startsWith('/cdn/fonts/') || pathname?.startsWith('/cdn/shop/files/');
}

function isThemeAsset(pathname) {
  return /^\/cdn\/shop\/t\/\d+\//.test(pathname)
    || /^\/s\/files\/(?:\d+\/)+t\/\d+\//.test(pathname);
}

function isAuthenticationPath(pathname) {
  return pathname === '/password' || pathname === SHOP_LOGIN_PATH;
}

function classifyNetworkSource(raw, source, kind, detail) {
  if (source.redacted || source.scheme !== 'https' || !source.host || !source.path) return 'failure';
  if (new URL(raw).port !== '') return 'failure';

  if (kind === 'http') {
    if (!Number.isInteger(detail) || detail < 400 || detail === 429) return 'failure';
  } else if (kind === 'cdp') {
    if (!safeCdpNetworkReason(detail)) return 'failure';
  } else if (kind === 'requestfailed') {
    if (!/^(?:CHROMIUM_ERR_|NETWORK_)/.test(detail)) return 'failure';
  } else {
    return 'failure';
  }

  if (isThemeAsset(source.path)) return 'failure';

  if (source.host === STORE_HOST) {
    const favicon404 = source.path === '/favicon.ico' && kind === 'http' && detail === 404;
    const shopLoginAborted = source.path === SHOP_LOGIN_PATH
      && ((kind === 'requestfailed' && detail === 'CHROMIUM_ERR_ABORTED') || (kind === 'cdp' && detail === 'Aborted'));
    return favicon404 || shopLoginAborted || isStoreCdnPath(source.path) ? 'warning' : 'failure';
  }

  if (isAuthenticationPath(source.path)) return 'failure';
  return isKnownCdnHost(source.host) ? 'warning' : 'failure';
}

function recordNetworkEvent(raw, source, kind, detail, warningKeys, failureKeys) {
  const category = classifyNetworkSource(raw, source, kind, detail);
  const code = kind === 'cdp' ? `CDP_${detail || 'UNRECOGNIZED'}`
    : kind === 'http' ? `HTTP_${detail}` : detail;
  const key = `${source.host || 'redacted'}:${source.path || 'redacted'}:${code}`;
  (category === 'warning' ? warningKeys : failureKeys).add(key);
  return category;
}

function blockedRequestReason(url, method, blockedNav) {
  if (blockedNav) return 'CHECKOUT_NAVIGATION_BLOCKED';
  if (!['http:', 'https:'].includes(url.protocol)) return 'NON_HTTP_URL_BLOCKED_BY_POLICY';
  if (url.port !== '' && url.port !== '443') return 'PORT_BLOCKED_BY_POLICY';
  if (url.protocol !== 'https:') return 'HTTPS_REQUIRED_BY_POLICY';
  if (!['GET', 'HEAD'].includes(method)) return 'METHOD_BLOCKED_BY_POLICY';
  return 'HOST_OR_URL_BLOCKED_BY_POLICY';
}

function classifyBlockedHost(source) {
  if (source.reason === 'CHECKOUT_NAVIGATION_BLOCKED') return 'checkout_navigation_blocked';
  if (source.reason === 'NON_HTTP_URL_BLOCKED_BY_POLICY') return 'non_http_url_blocked_by_policy';

  if (source.reason === 'PORT_BLOCKED_BY_POLICY' || source.reason === 'HTTPS_REQUIRED_BY_POLICY'
    || isAuthenticationPath(source.path)) return 'unclassified_blocked_host';

  const cdn = isKnownCdnHost(source.host) || (source.host === STORE_HOST && isStoreCdnPath(source.path));
  if ((cdn || source.host === STORE_HOST) && isThemeAsset(source.path)) return 'theme_asset_blocked';
  if (source.reason === 'METHOD_BLOCKED_BY_POLICY') return 'method_blocked_by_policy';
  if (cdn || KNOWN_WARNING_HOSTS.has(source.host) || source.host?.endsWith('.bugsnag.com')) return 'known_external_warning';
  return source.host === STORE_HOST ? 'store_url_blocked_by_policy' : 'unclassified_blocked_host';
}

function executionOutcome(report) {
  const anyFailed = report.results.some((result) => result.result === 'failed');
  const anyIncomplete = report.results.some((result) => result.result !== 'measured');
  const fatalNetworkFailure = report.networkFailures.length > 0
    || report.previews?.some((preview) => !preview.contextClosed || !preview.browserClosed)
    || report.blockedHosts.some((event) => event.category === 'theme_asset_blocked');
  const blockedHostAttention = report.blockedHosts.some((event) => event.category === 'unclassified_blocked_host');
  const executionResult = anyFailed || fatalNetworkFailure ? 'failed'
    : anyIncomplete || blockedHostAttention ? 'incomplete' : 'completed';
  return { blockedHostAttention, executionResult };
}

function safeCdpNetworkReason(value) {
  return CDP_NETWORK_ERROR_REASONS.has(value) ? value : null;
}

function parseRetryAfter(value) {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    const milliseconds = Math.ceil(seconds * 1000);
    return Number.isSafeInteger(milliseconds) && milliseconds <= 2147483647 ? { milliseconds } : { unrepresentable: true };
  }
  const date = Date.parse(value);
  if (Number.isFinite(date)) {
    const milliseconds = Math.max(0, date - Date.now());
    return milliseconds <= 2147483647 ? { milliseconds } : { unrepresentable: true };
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeHttpError(error) {
  return error?.safeCode || codeOf(error);
}

function exactStoreOrigin(value) {
  const url = new URL(value);
  if (url.origin !== 'https://tema-qkqpke0j.myshopify.com' || value !== url.origin || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw Object.assign(new Error(), { safeCode: 'INVALID_STOREFRONT_ORIGIN' });
  }
  return url.origin;
}

function canonicalPath(name, value, prefix) {
  const pathValue = validateText(name, value);
  const pattern = prefix === '/collections/' ? /^\/collections\/[a-z0-9][a-z0-9-]*$/i : /^\/products\/[a-z0-9][a-z0-9-]*$/i;
  if (!pattern.test(pathValue)) {
    throw Object.assign(new Error(), { safeCode: `INVALID_${name}` });
  }
  return pathValue;
}

function allowedRead(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && READ_HOSTS.has(url.hostname.toLowerCase()) && !url.username && !url.password && (url.port === '' || url.port === '443');
  } catch { return false; }
}

async function loadModules(lighthouseRoot) {
  const root = path.resolve(lighthouseRoot);
  const [{ default: puppeteer }, { default: lighthouse }, { default: desktopConfig }, playwrightModule] = await Promise.all([
    import(pathToFileURL(path.join(root, 'node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js'))),
    import(pathToFileURL(path.join(root, 'node_modules/lighthouse/core/index.js'))),
    import(pathToFileURL(path.join(root, 'node_modules/lighthouse/core/config/desktop-config.js'))),
    import('playwright'),
  ]);
  const lighthousePackage = JSON.parse(await readFile(path.join(root, 'node_modules/lighthouse/package.json'), 'utf8'));
  return { puppeteer, lighthouse, desktopConfig, playwright: playwrightModule, lighthouseVersion: lighthousePackage.version };
}

function freshCell(themeId, page, viewport) {
  return { themeId, page, viewport, result: 'incomplete', reason: 'NOT_RUN', identityVerified: false, httpStatus: null, scores: null, metrics: null, failedAuditIds: null, runtimeError: null };
}

function findPageId(url) {
  const parsed = new URL(url);
  return `${parsed.origin}${parsed.pathname}`;
}

function createPasswordGateEvent() {
  return { workflowResult: 'not_started', initialHttpStatus: null, passwordFormInitiallyPresent: null, passwordPostHttpStatus: null, reloadHttpStatus: null, passwordFormVisibleAfterReload: null };
}

function passwordGateSnapshot(event) {
  return {
    workflowResult: event.workflowResult === 'in_progress' ? 'incomplete' : event.workflowResult,
    initialHttpStatus: event.initialHttpStatus,
    passwordFormInitiallyPresent: event.passwordFormInitiallyPresent,
    passwordPostHttpStatus: event.passwordPostHttpStatus,
    reloadHttpStatus: event.reloadHttpStatus,
    passwordFormVisibleAfterReload: event.passwordFormVisibleAfterReload,
  };
}

async function createAuthContext(playwright, browserContext, page, origin, themeId, password, secretGuard, passwordGateEvent) {
  passwordGateEvent.workflowResult = 'in_progress';
  const entryUrl = new URL('/', origin);
  entryUrl.searchParams.set(PREVIEW_URL_PARAM, themeId);
  const initial = await page.goto(entryUrl.href, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS });
  const initialStatus = initial?.status() ?? null;
  passwordGateEvent.initialHttpStatus = initialStatus;
  const hasPassword = await page.$('input[type="password"]');
  passwordGateEvent.passwordFormInitiallyPresent = Boolean(hasPassword);
  if (hasPassword) {
    const formData = await page.evaluate(() => {
      const input = document.querySelector('input[type="password"]');
      const form = input?.form;
      if (!form) return null;
      const fields = {};
      for (const [key, value] of new FormData(form).entries()) fields[key] = String(value);
      return { action: form.action, fields, passwordName: input.name };
    });
    if (!formData || !formData.passwordName) throw Object.assign(new Error(), { safeCode: 'PASSWORD_FORM_MISSING' });
    let formAction;
    try { formAction = new URL(formData.action, origin); } catch { throw Object.assign(new Error(), { safeCode: 'PASSWORD_FORM_ACTION_INVALID' }); }
    if (formAction.origin !== origin || formAction.pathname !== '/password' || formAction.search || formAction.hash || formAction.username || formAction.password) {
      throw Object.assign(new Error(), { safeCode: 'PASSWORD_FORM_ACTION_NOT_ALLOWED' });
    }

    const browserCookies = await browserContext.cookies(origin);
    const apiCookies = browserCookies.map((cookie) => ({
      name: cookie.name, value: cookie.value, domain: cookie.domain, path: cookie.path,
      expires: cookie.expires > 0 ? cookie.expires : -1, httpOnly: cookie.httpOnly, secure: cookie.secure,
      sameSite: cookie.sameSite === 'None' ? 'None' : cookie.sameSite === 'Strict' ? 'Strict' : 'Lax',
    }));
    const api = await playwright.request.newContext({
      storageState: { cookies: apiCookies, origins: [] },
      extraHTTPHeaders: { Accept: 'text/html,application/xhtml+xml' },
    });
    try {
      formData.fields[formData.passwordName] = password;
      let response;
      for (let attempt = 0; attempt <= MAX_429_RETRIES; attempt += 1) {
        response = await api.post(new URL('/password', origin).href, {
          form: formData.fields, timeout: PAGE_TIMEOUT_MS, maxRedirects: 0, maxRetries: 0,
          headers: { Origin: origin, Referer: new URL('/password', origin).href },
        });
        passwordGateEvent.passwordPostHttpStatus = response.status();
        if (response.status() !== 429) break;
        const retryAfter = parseRetryAfter(response.headers()['retry-after']);
        if (retryAfter?.unrepresentable) throw Object.assign(new Error(), { safeCode: 'RETRY_AFTER_UNREPRESENTABLE' });
        if (attempt === MAX_429_RETRIES) throw Object.assign(new Error(), { safeCode: 'HTTP_429_RETRIES_EXHAUSTED' });
        await response.dispose().catch(() => {});
        await sleep(Math.max([1000, 2000, 4000][attempt], retryAfter?.milliseconds ?? 0));
      }
      if (![302, 303].includes(response.status())) throw Object.assign(new Error(), { safeCode: response.status() === 429 ? 'HTTP_429_RETRIES_EXHAUSTED' : 'PASSWORD_RESPONSE_NOT_ACCEPTED' });
      const location = response.headers().location;
      if (!location) throw Object.assign(new Error(), { safeCode: 'PASSWORD_REDIRECT_MISSING' });
      let destination;
      try { destination = new URL(location, new URL('/password', origin)); } catch { throw Object.assign(new Error(), { safeCode: 'PASSWORD_REDIRECT_INVALID' }); }
      if (destination.origin !== origin || destination.pathname !== '/' || destination.username || destination.password) {
        throw Object.assign(new Error(), { safeCode: 'PASSWORD_REDIRECT_NOT_ALLOWED' });
      }
      // Discard server-supplied query/fragment and reconstruct the preview URL.
      destination.search = '';
      destination.hash = '';
      const state = await api.storageState();
      const browserStateCookies = state.cookies.map((cookie) => ({
        name: cookie.name, value: cookie.value, domain: cookie.domain, path: cookie.path,
        expires: cookie.expires > 0 ? cookie.expires : -1, httpOnly: cookie.httpOnly, secure: cookie.secure,
        sameSite: cookie.sameSite === 'None' ? 'None' : cookie.sameSite === 'Strict' ? 'Strict' : 'Lax',
      }));
      if (browserStateCookies.length) await browserContext.setCookie(...browserStateCookies);
      const reloaded = await page.goto(entryUrl.href, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS });
      passwordGateEvent.reloadHttpStatus = reloaded?.status() ?? null;
      const stillLocked = Boolean(await page.$('input[type="password"]'));
      passwordGateEvent.passwordFormVisibleAfterReload = stillLocked;
      if (stillLocked) throw Object.assign(new Error(), { safeCode: 'STOREFRONT_REMAINS_LOCKED' });
      passwordGateEvent.workflowResult = 'completed';
    } finally {
      await api.dispose();
    }
  } else {
    passwordGateEvent.workflowResult = 'form_not_present';
  }
  const identity = await page.evaluate(() => String(window.Shopify?.theme?.id ?? ''));
  if (identity !== themeId) throw Object.assign(new Error(), { safeCode: 'THEME_IDENTITY_MISMATCH' });
  return { entryUrl, identityVerified: true };
}

function scoreOf(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 100) : null;
}

function finiteMetric(audits, id) {
  const value = audits?.[id]?.numericValue;
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value * 1000) / 1000 : null;
}

function failedAuditIds(audits) {
  return Object.values(audits || {}).filter((audit) => typeof audit?.score === 'number' && audit.score < 1 && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'manual').map((audit) => audit.id).filter((id) => /^[a-z0-9-]+$/i.test(id)).slice(0, 30);
}

async function runCell({ lighthouse, page, url, themeId, pageKind, viewportName, viewport, identityBefore, desktopConfig, rateLimits }) {
  const cell = freshCell(themeId, pageKind, viewportName);
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: viewport.deviceScaleFactor, isMobile: viewport.isMobile, hasTouch: viewport.isMobile });
  const desktop = viewportName === 'desktop';
  const config = desktop ? structuredClone(desktopConfig) : { extends: 'lighthouse:default' };
  config.settings = { ...config.settings, formFactor: desktop ? 'desktop' : 'mobile' };
  config.settings.screenEmulation = {
    ...(config.settings.screenEmulation || {}),
    mobile: !desktop, width: viewport.width, height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor, disabled: false,
  };
  const flags = { output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], disableStorageReset: true, maxWaitForLoad: PAGE_TIMEOUT_MS };
  let result;
  let retryIndex = 0;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS });
    identityBefore = await page.evaluate(() => String(window.Shopify?.theme?.id ?? ''));
  } catch (error) {
    cell.result = 'failed'; cell.reason = codeOf(error); return cell;
  }
  if (identityBefore !== themeId) { cell.result = 'failed'; cell.reason = 'THEME_IDENTITY_MISMATCH_BEFORE'; return cell; }
  while (true) {
    const attemptRateLimitIndex = rateLimits.length;
    try { result = await lighthouse(url, flags, config, page); }
    catch (error) {
      const currentRateLimits = rateLimits.slice(attemptRateLimitIndex);
      if (currentRateLimits.some((entry) => entry.unrepresentable)) { cell.result = 'failed'; cell.reason = 'RETRY_AFTER_UNREPRESENTABLE'; return cell; }
      if (currentRateLimits.length > 0 && retryIndex < MAX_429_RETRIES) {
        const waitMs = Math.max([1000, 2000, 4000][retryIndex], ...currentRateLimits.map((entry) => entry.retryAfterMs ?? 0));
        retryIndex += 1;
        await sleep(waitMs);
        continue;
      }
      if (currentRateLimits.length > 0) { cell.result = 'incomplete'; cell.reason = 'HTTP_429_RETRIES_EXHAUSTED'; return cell; }
      cell.result = 'failed'; cell.reason = codeOf(error); return cell;
    }
    const currentRateLimits = rateLimits.slice(attemptRateLimitIndex);
    if (currentRateLimits.length === 0) break;
    if (currentRateLimits.some((entry) => entry.unrepresentable)) { cell.result = 'failed'; cell.reason = 'RETRY_AFTER_UNREPRESENTABLE'; return cell; }
    if (retryIndex >= MAX_429_RETRIES) { cell.result = 'incomplete'; cell.reason = 'HTTP_429_RETRIES_EXHAUSTED'; return cell; }
    const waitMs = Math.max([1000, 2000, 4000][retryIndex], ...currentRateLimits.map((entry) => entry.retryAfterMs ?? 0));
    retryIndex += 1;
    await sleep(waitMs);
  }
  const lhr = result?.lhr ?? result;
  if (!lhr || lhr.runtimeError) {
    cell.result = 'incomplete'; cell.reason = 'LIGHTHOUSE_RUNTIME_ERROR';
    cell.runtimeError = lhr?.runtimeError?.code && /^[A-Z0-9_]+$/.test(lhr.runtimeError.code) ? lhr.runtimeError.code : 'RUNTIME_ERROR';
    return cell;
  }
  const pageUrl = new URL(page.url());
  const requested = new URL(url);
  const expectedPath = requested.pathname;
  const actualId = await page.evaluate(() => String(window.Shopify?.theme?.id ?? ''));
  const expectedIdentity = actualId === themeId && identityBefore === themeId;
  cell.identityVerified = expectedIdentity;
  cell.httpStatus = null;
  cell.requestedPath = findPageId(lhr.requestedUrl || url).slice(new URL(url).origin.length) || '/';
  cell.finalPath = `${pageUrl.pathname}`;
  cell.lighthouseVersion = typeof lhr.lighthouseVersion === 'string' ? lhr.lighthouseVersion : null;
  const effective = lhr.configSettings || {};
  const effectiveScreen = effective.screenEmulation || {};
  const effectiveUa = typeof effective.emulatedUserAgent === 'string' ? effective.emulatedUserAgent : '';
  const expectedThrottle = config.settings.throttlingMethod || 'simulate';
  const effectiveConfigMatches = effective.formFactor === config.settings.formFactor
    && Number(effectiveScreen.width) === viewport.width && Number(effectiveScreen.height) === viewport.height
    && Number(effectiveScreen.deviceScaleFactor) === viewport.deviceScaleFactor
    && Boolean(effectiveScreen.mobile) === Boolean(viewport.isMobile)
    && (effective.throttlingMethod || expectedThrottle) === expectedThrottle
    && /(?:Chrome|Chromium)\//i.test(effectiveUa);
  cell.config = {
    requested: { formFactor: config.settings.formFactor, viewport: `${viewport.width}x${viewport.height}`, deviceScaleFactor: viewport.deviceScaleFactor, throttlingMethod: expectedThrottle },
    effective: { formFactor: effective.formFactor || null, viewport: Number.isFinite(Number(effectiveScreen.width)) && Number.isFinite(Number(effectiveScreen.height)) ? `${Number(effectiveScreen.width)}x${Number(effectiveScreen.height)}` : null, deviceScaleFactor: Number.isFinite(Number(effectiveScreen.deviceScaleFactor)) ? Number(effectiveScreen.deviceScaleFactor) : null, mobile: typeof effectiveScreen.mobile === 'boolean' ? effectiveScreen.mobile : null, throttlingMethod: effective.throttlingMethod || null, userAgentFamily: /(?:Chrome|Chromium)\//i.test(effectiveUa) ? 'Chromium' : null },
  };
  cell.scores = {
    performance: scoreOf(lhr.categories?.performance?.score),
    accessibility: scoreOf(lhr.categories?.accessibility?.score),
    bestPractices: scoreOf(lhr.categories?.['best-practices']?.score),
    seo: scoreOf(lhr.categories?.seo?.score),
  };
  cell.metrics = {
    firstContentfulPaintMs: finiteMetric(lhr.audits, 'first-contentful-paint'),
    largestContentfulPaintMs: finiteMetric(lhr.audits, 'largest-contentful-paint'),
    totalBlockingTimeMs: finiteMetric(lhr.audits, 'total-blocking-time'),
    cumulativeLayoutShift: finiteMetric(lhr.audits, 'cumulative-layout-shift'),
    speedIndexMs: finiteMetric(lhr.audits, 'speed-index'),
  };
  cell.failedAuditIds = {
    performance: failedAuditIds(lhr.categories?.performance?.auditRefs?.reduce((out, ref) => { out[ref.id] = lhr.audits?.[ref.id]; return out; }, {}) || {}),
    accessibility: failedAuditIds(lhr.categories?.accessibility?.auditRefs?.reduce((out, ref) => { out[ref.id] = lhr.audits?.[ref.id]; return out; }, {}) || {}),
  };
  const categoryScoresValid = Object.values(cell.scores).every((score) => Number.isInteger(score));
  const metricsValid = Object.values(cell.metrics).every((metric) => typeof metric === 'number' && Number.isFinite(metric));
  const routeMatches = pageUrl.origin === requested.origin && pageUrl.pathname === expectedPath;
  if (!expectedIdentity) { cell.result = 'failed'; cell.reason = 'THEME_IDENTITY_MISMATCH'; }
  else if (!routeMatches) { cell.result = 'failed'; cell.reason = 'FINAL_ROUTE_MISMATCH'; }
  else if (!effectiveConfigMatches) { cell.result = 'incomplete'; cell.reason = 'LIGHTHOUSE_EFFECTIVE_CONFIG_MISMATCH'; }
  else if (!categoryScoresValid || !metricsValid || !lhr.fetchTime) { cell.result = 'incomplete'; cell.reason = 'LIGHTHOUSE_METRICS_INCOMPLETE'; }
  else { cell.result = 'measured'; cell.reason = null; }
  cell.mobilePerformanceRisk = viewportName === 'mobile' && Number.isInteger(cell.scores?.performance) && cell.scores.performance < 70;
  return cell;
}

async function main() {
  const runId = randomUUID();
  const themeArg = process.argv.slice(2);
  const report = {
    schema: 'gpt-rd-lighthouse-v3', runId, startedAt: new Date().toISOString(), mode: 'read-only',
    executionResult: 'incomplete', results: [], networkWarnings: [], networkFailures: [], blockedHosts: [], responseFilterFailures: [], responseNetworkErrors: [],
    limits: { presets: [], pages: ROUTES.map((r) => r.page), viewports: ['mobile', 'desktop'], repetitionsPerCell: 1, cartMutations: 0, checkoutSubmitted: false, credentialsWritten: false, popupTargets: 'paused by CDP auto-attach and closed before resume' },
  };
  let outputFile = null;
  const finalize = async () => {
    report.finishedAt = new Date().toISOString();
    await mkdir(RESULT_DIR, { recursive: true });
    const stamp = report.startedAt.replaceAll(':', '').replaceAll('-', '');
    outputFile = path.join(RESULT_DIR, `lighthouse-${stamp}-${runId}.json`);
    const state = { redactions: 0 };
    const sanitized = sanitizeReport(report, finalSecretGuard, state);
    sanitized.security = { ...(sanitized.security || {}), secretValueRedactions: state.redactions };
    const serialized = `${JSON.stringify(sanitized, null, 2)}\n`;
    if (finalSecretGuard(serialized)) throw new Error('REPORT_SECRET_GUARD_FAILED');
    await writeFile(outputFile, serialized, { flag: 'wx' });
  };

  try {
    if (themeArg.length !== 1 || !/^--theme=(?:190232297715|190232330483|190232363251)$/.test(themeArg[0])) throw Object.assign(new Error(), { safeCode: 'THEME_ARGUMENT_REQUIRED' });
    const selectedThemeId = themeArg[0].slice('--theme='.length);
    const selectedPreview = PREVIEWS.find((preview) => preview.themeId === selectedThemeId);
    const configuredThemeId = validateText('STOREFRONT_THEME_ID', process.env.STOREFRONT_THEME_ID);
    if (configuredThemeId !== selectedThemeId) throw Object.assign(new Error(), { safeCode: 'THEME_ID_ENV_MISMATCH' });
    const secrets = SECRET_ENV.map((name) => [name, process.env[name]]);
    for (const [name, value] of secrets) validateText(name, value);
    const origin = exactStoreOrigin(validateText('STOREFRONT_ORIGIN', process.env.STOREFRONT_ORIGIN));
    const collectionPath = canonicalPath('STOREFRONT_COLLECTION_PATH', process.env.STOREFRONT_COLLECTION_PATH, '/collections/');
    const productPath = canonicalPath('STOREFRONT_PRODUCT_PATH', process.env.STOREFRONT_PRODUCT_PATH, '/products/');
    const password = process.env.STOREFRONT_PASSWORD;
    const secretGuard = createSecretGuard([process.env.STOREFRONT_PASSWORD, process.env.SHOPIFY_CLI_THEME_TOKEN]);
    finalSecretGuard = secretGuard;
    const lighthouseRoot = validateText('LIGHTHOUSE_ROOT', process.env.LIGHTHOUSE_ROOT);
    const { puppeteer, lighthouse, desktopConfig, playwright, lighthouseVersion } = await loadModules(lighthouseRoot);
    report.lighthouseVersion = lighthouseVersion;
    report.limits.presets = [selectedPreview.preset];
    report.preflight = { credentials: { SHOPIFY_CLI_THEME_TOKEN: 'present', STOREFRONT_PASSWORD: 'present' }, originValidated: true, themeInventory: 'externally_confirmed_unpublished' };

    for (const preview of [selectedPreview]) {
      let browser = null;
      let browserClosedForProfileCleanup = false;
      let context = null;
      let page = null;
      let cdp = null;
      let browserCdp = null;
      let profileDir = null;
      const warningKeys = new Set();
      const failureKeys = new Set();
      const blockedKeys = new Set();
      const rateLimits = [];
      let rateLimitCount = 0;
      const pendingHandlers = new Set();
      const track = (promise) => {
        const tracked = Promise.resolve(promise).catch(() => {}).finally(() => pendingHandlers.delete(tracked));
        pendingHandlers.add(tracked);
        return tracked;
      };
      try {
      try {
        await mkdir(PROFILE_CACHE_DIR, { recursive: true });
        profileDir = await mkdtemp(path.join(PROFILE_CACHE_DIR, PROFILE_PREFIX));
        browser = await puppeteer.launch({
          executablePath: process.env.LIGHTHOUSE_CHROME_EXECUTABLE || playwright.chromium.executablePath(),
          userDataDir: profileDir,
          headless: true,
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        });
        report.browserVersion = await browser.version();
        context = await browser.createBrowserContext();
        page = await context.newPage();
        await page.setBypassServiceWorker(true);
        cdp = await page.createCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.setBlockedURLs', { urls: ['ws://*', 'wss://*'] });
        await cdp.send('Fetch.enable', { patterns: [
          { urlPattern: 'https://cdn.shopify.com/*', requestStage: 'Response' },
          { urlPattern: 'https://fonts.shopifycdn.com/*', requestStage: 'Response' },
        ] });
        await page.setRequestInterception(true);
        const mainPageInfo = (await cdp.send('Target.getTargetInfo')).targetInfo;
        if (!mainPageInfo?.targetId || !mainPageInfo?.browserContextId) throw Object.assign(new Error(), { safeCode: 'PAGE_TARGET_IDENTITY_UNAVAILABLE' });
        browserCdp = await browser.target().createCDPSession();
        const targets = await browserCdp.send('Target.getTargets', { filter: [{ type: 'tab', exclude: false }, { exclude: true }] });
        const matchingTabs = (targets.targetInfos || []).filter((info) => info.type === 'tab' && info.browserContextId === mainPageInfo.browserContextId);
        if (matchingTabs.length !== 1) throw Object.assign(new Error(), { safeCode: 'PRIMARY_TAB_MAPPING_AMBIGUOUS' });
        const mainTabId = matchingTabs[0].targetId;
        const mainTabSessionIds = new Set();
        browserCdp.on('Target.attachedToTarget', (event) => track((async () => {
          const info = event.targetInfo;
          if (info.type !== 'tab') return;
          if (info.targetId !== mainTabId) {
            blockedKeys.add(JSON.stringify({ host: null, path: null, method: 'POPUP', reason: 'UNEXPECTED_TAB_BLOCKED_BEFORE_RESUME', redacted: false }));
            const closed = await browserCdp.send('Target.closeTarget', { targetId: info.targetId });
            if (closed.success === false) failureKeys.add('target_policy:POPUP_CLOSE_FAILED');
            return;
          }
          if (mainTabSessionIds.has(event.sessionId)) return;
          mainTabSessionIds.add(event.sessionId);
          const tabSession = browserCdp.connection()?.session(event.sessionId);
          if (!tabSession) { failureKeys.add('target_policy:PRIMARY_TAB_SESSION_MISSING'); return; }
          tabSession.on('Target.attachedToTarget', (childEvent) => track((async () => {
            const childInfo = childEvent.targetInfo;
            if (childInfo.type !== 'page') return;
            if (childInfo.targetId !== mainPageInfo.targetId) {
              blockedKeys.add(JSON.stringify({ host: null, path: null, method: 'POPUP', reason: 'UNEXPECTED_PAGE_BLOCKED_BEFORE_RESUME', redacted: false }));
              const closed = await tabSession.send('Target.closeTarget', { targetId: childInfo.targetId });
              if (closed.success === false) failureKeys.add('target_policy:POPUP_PAGE_CLOSE_FAILED');
              return;
            }
            const pageSession = tabSession.connection()?.session(childEvent.sessionId);
            if (!pageSession) { failureKeys.add('target_policy:PRIMARY_PAGE_SESSION_MISSING'); return; }
            await pageSession.send('Runtime.runIfWaitingForDebugger');
          })().catch(() => { failureKeys.add('target_policy:PAGE_RESUME_OR_CLOSE_FAILED'); })));
          await tabSession.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true, filter: [{ type: 'page', exclude: false }, { exclude: true }] });
          if (event.waitingForDebugger === true) await tabSession.send('Runtime.runIfWaitingForDebugger');
        })().catch(() => { failureKeys.add('target_policy:TAB_GUARD_FAILED'); })));
        await browserCdp.send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: true, flatten: true, filter: [{ type: 'tab', exclude: false }, { exclude: true }] });
      } catch (error) {
        let contextClosed = context === null;
        let browserClosed = null;
        if (context) { try { await context.close(); contextClosed = true; } catch { contextClosed = false; } }
        await Promise.allSettled([...pendingHandlers]);
        if (browser) { try { await browser.close(); browserClosed = true; browserClosedForProfileCleanup = true; } catch { browserClosed = false; } }
        report.results.push({ preset: preview.preset, themeId: preview.themeId, page: 'preview_setup', viewport: 'none', result: 'failed', reason: safeHttpError(error), identityVerified: false });
        report.previews = report.previews || [];
        // browserCreated records only whether Puppeteer returned a handle, not process existence.
        report.previews.push({ preset: preview.preset, themeId: preview.themeId, passwordGate: passwordGateSnapshot(createPasswordGateEvent()), identityVerified: false, contextCreated: context !== null, contextClosed, browserCreated: browser !== null, browserClosed });
        continue;
      }
      const passwordGateEvent = createPasswordGateEvent();
      const pageInFlight = new WeakSet();
      const blockedRequests = new WeakSet();
      cdp.on('Fetch.requestPaused', (event) => {
        let stage = 'validate_response_metadata';
        let headersModified = false;
        return track((async () => {
          const source = safeSource(event.request.url, secretGuard);
          if (!['http', 'https'].includes(source.scheme)) {
            const method = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(event.request.method) ? event.request.method : 'OTHER';
            blockedKeys.add(JSON.stringify({ host: null, path: null, scheme: source.scheme, method, reason: 'NON_HTTP_URL_BLOCKED_BY_POLICY', redacted: true }));
            try { await cdp.send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'BlockedByClient' }); }
            catch { failureKeys.add('non_http_resolution:FETCH_FAIL_REQUEST_FAILED'); }
            return;
          }
          if (event.responseErrorReason != null) {
            const reason = safeCdpNetworkReason(event.responseErrorReason);
            const category = recordNetworkEvent(event.request.url, source, 'cdp', reason, warningKeys, failureKeys);
            const entry = {
              preset: preview.preset, host: source.host, path: source.path, scheme: source.scheme,
              errorReason: reason || 'UNRECOGNIZED', category, redacted: source.redacted, resolution: 'pending',
            };
            if (report.responseNetworkErrors.length < 200) report.responseNetworkErrors.push(entry);
            try {
              // Preserve recognized CDP errors; an unknown reason is safely failed without echoing it.
              await cdp.send('Fetch.failRequest', { requestId: event.requestId, errorReason: reason || 'Failed' });
              entry.resolution = 'failed_request';
            } catch (error) {
              entry.resolution = 'resolution_failed';
              entry.resolutionError = responseFilterError(error);
              failureKeys.add('response_error_resolution:FETCH_FAIL_REQUEST_FAILED');
            }
            return;
          }
          if (!Number.isInteger(event.responseStatusCode)) throw Object.assign(new Error(), { safeFilterCode: 'RESPONSE_STATUS_MISSING' });
          if (!Array.isArray(event.responseHeaders)) throw Object.assign(new Error(), { safeFilterCode: 'RESPONSE_HEADERS_MISSING' });
          stage = 'prepare_response_headers';
          const rawHeaders = event.responseHeaders;
          const responseHeaders = rawHeaders.filter((header) => !['set-cookie', 'set-cookie2', 'www-authenticate', 'proxy-authenticate'].includes(String(header.name).toLowerCase()));
          headersModified = responseHeaders.length !== rawHeaders.length;
          const response = { requestId: event.requestId };
          if (headersModified) {
            // CDP requires the original status together with modified response headers.
            response.responseCode = event.responseStatusCode;
            response.responseHeaders = responseHeaders;
            if (typeof event.responseStatusText === 'string') response.responsePhrase = event.responseStatusText;
          }
          stage = 'continue_response';
          await cdp.send('Fetch.continueResponse', response);
          if (!source.host || source.redacted) warningKeys.add(`external_response_redacted:${source.host || 'redacted'}:${source.path || 'redacted'}`);
        })().catch(async (error) => {
          const source = safeSource(event.request.url, secretGuard);
          const failureCode = stage === 'validate_response_metadata' ? 'RESPONSE_METADATA_INVALID'
            : stage === 'continue_response' ? (headersModified ? 'COOKIE_FILTER_FAILED' : 'CONTINUE_RESPONSE_FAILED')
              : 'RESPONSE_HEADER_FILTER_FAILED';
          failureKeys.add(`external_response_filter:${source.host || 'redacted'}:${source.path || 'redacted'}:${failureCode}`);
          if (report.responseFilterFailures.length < 200) {
            report.responseFilterFailures.push({
              preset: preview.preset, host: source.host, path: source.path, scheme: source.scheme,
              stage, command: stage === 'continue_response' ? 'Fetch.continueResponse' : null,
              ...responseFilterError(error),
              responseStatusCode: Number.isInteger(event.responseStatusCode) ? event.responseStatusCode : null,
              hasResponseHeaders: Array.isArray(event.responseHeaders), headersModified,
              hasResponseErrorReason: typeof event.responseErrorReason === 'string' && event.responseErrorReason.length > 0,
            });
          }
          await cdp.send('Fetch.failRequest', { requestId: event.requestId, errorReason: 'BlockedByClient' }).catch(() => {});
        }));
      });

      page.on('request', (request) => track((async () => {
        if (pageInFlight.has(request)) return;
        pageInFlight.add(request);
        const method = request.method().toUpperCase();
        const raw = request.url();
        let url;
        try { url = new URL(raw); } catch { await request.abort('blockedbyclient').catch(() => {}); return; }
        const source = safeSource(raw, secretGuard);
        const key = `${method}:${source.host || 'redacted'}:${source.path || 'redacted'}`;
        const readAllowed = ['GET', 'HEAD'].includes(method) && allowedRead(raw);
        const blockedNav = request.isNavigationRequest() && (/^\/(?:checkout|checkouts)(?:\/|$)/i.test(url.pathname));
        if (!readAllowed || blockedNav) {
          const reason = blockedRequestReason(url, method, blockedNav);
          blockedKeys.add(JSON.stringify({ host: source.host, path: source.path, scheme: source.scheme, method, reason, redacted: source.redacted }));
          blockedRequests.add(request);
          await request.abort('blockedbyclient').catch(() => {});
          return;
        }
        if (url.hostname.toLowerCase() !== STORE_HOST) {
          await request.continue({ headers: { ...EXTERNAL_HEADERS } }).catch(() => {});
          return;
        }
        await request.continue().catch(() => {});
      })()));

      page.on('requestfailed', (request) => {
        if (blockedRequests.has(request)) return;
        const source = safeSource(request.url(), secretGuard);
        const code = codeOf(request.failure() || {});
        recordNetworkEvent(request.url(), source, 'requestfailed', code, warningKeys, failureKeys);
      });
      page.on('response', (response) => {
        if (response.status() === 429) {
          const source = safeSource(response.url(), secretGuard);
          const retryAfter = response.headers()['retry-after'];
          const parsedWait = parseRetryAfter(retryAfter);
          const key = `${source.host || 'redacted'}:${source.path || 'redacted'}`;
          rateLimitCount += 1;
          rateLimits.push({ source: key, retryAfterMs: parsedWait?.milliseconds ?? null, unrepresentable: Boolean(parsedWait?.unrepresentable) });
        }
        if (response.status() === 429) return;
        if (response.status() < 400) return;
        const source = safeSource(response.url(), secretGuard);
        recordNetworkEvent(response.url(), source, 'http', response.status(), warningKeys, failureKeys);
      });

      try {
        const auth = await createAuthContext(playwright, context, page, origin, preview.themeId, password, secretGuard, passwordGateEvent);
        const identity = preview.themeId;
        const paths = ROUTES.map((route) => ({ page: route.page, path: route.path || (route.env === 'STOREFRONT_COLLECTION_PATH' ? collectionPath : productPath) }));
        const mobile = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true };
        const desktop = { width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false };
        for (const route of paths) {
          const url = new URL(route.path, origin);
          url.searchParams.set(PREVIEW_URL_PARAM, preview.themeId);
          if (url.origin !== origin) throw Object.assign(new Error(), { safeCode: 'ROUTE_ORIGIN_NOT_ALLOWED' });
          for (const [viewportName, viewport] of [['mobile', mobile], ['desktop', desktop]]) {
            const cell = await runCell({ lighthouse, page, url: url.href, themeId: preview.themeId, pageKind: route.page, viewportName, viewport, identityBefore: identity, desktopConfig, rateLimits });
            report.results.push({ preset: preview.preset, ...cell });
          }
        }
        report.previews = report.previews || [];
        report.previews.push({ preset: preview.preset, themeId: preview.themeId, passwordGate: passwordGateSnapshot(passwordGateEvent), identityVerified: auth.identityVerified, contextClosed: false });
      } catch (error) {
        report.results.push({ preset: preview.preset, themeId: preview.themeId, page: 'preview_setup', viewport: 'none', result: 'failed', reason: safeHttpError(error), identityVerified: false });
        report.previews = report.previews || [];
        report.previews.push({ preset: preview.preset, themeId: preview.themeId, passwordGate: passwordGateSnapshot(passwordGateEvent), identityVerified: false, contextClosed: false });
      } finally {
        await Promise.allSettled([...pendingHandlers]);
        let contextClosed = false;
        let browserClosed = false;
        try { await context.close(); contextClosed = true; } catch { failureKeys.add('context_close:CONTEXT_CLOSE_FAILED'); }
        try { await browser.close(); browserClosed = true; browserClosedForProfileCleanup = true; } catch { failureKeys.add('browser_close:BROWSER_CLOSE_FAILED'); }
        await Promise.allSettled([...pendingHandlers]);
        report.networkWarnings.push(...[...warningKeys].slice(0, 200).map((key) => ({ source: key })));
        report.networkFailures.push(...[...failureKeys].slice(0, 200).map((key) => ({ source: key })));
        report.blockedHosts.push(...[...blockedKeys].slice(0, 200).map((key) => {
          const source = JSON.parse(key);
          const category = classifyBlockedHost(source);
          return { host: source.host, path: source.path, scheme: source.scheme ?? null, method: source.method, reason: source.reason, category, redacted: source.redacted };
        }));
        report.rateLimits = report.rateLimits || [];
        report.rateLimits.push({ preset: preview.preset, occurrences: rateLimitCount, events: rateLimits.slice(0, 100).map(({ source, retryAfterMs }) => ({ source, retryAfterMs })), omittedEvents: Math.max(0, rateLimits.length - 100) });
        const last = report.previews?.at(-1);
        if (last?.themeId === preview.themeId) { last.contextClosed = contextClosed; last.browserClosed = browserClosed; }
      }
      } finally {
        if (!browserClosedForProfileCleanup && browser !== null) {
          try { await browser.close(); browserClosedForProfileCleanup = true; }
          catch { report.networkFailures.push({ source: 'profile_cleanup:BROWSER_CLOSE_FAILED' }); }
        }
        if (profileDir !== null) {
          const resolvedProfile = path.resolve(profileDir);
          if (path.dirname(resolvedProfile) !== PROFILE_CACHE_DIR || !path.basename(resolvedProfile).startsWith(PROFILE_PREFIX) || path.basename(resolvedProfile).length <= PROFILE_PREFIX.length) {
            report.networkFailures.push({ source: 'profile_cleanup:PROFILE_PATH_VALIDATION_FAILED' });
          } else if (!browserClosedForProfileCleanup) {
            report.networkFailures.push({ source: 'profile_cleanup:PROFILE_RETAINED_BROWSER_NOT_CLOSED' });
          } else {
            try { await rm(resolvedProfile, { recursive: true, force: true }); }
            catch { report.networkFailures.push({ source: 'profile_cleanup:PROFILE_CLEANUP_FAILED' }); }
          }
        }
      }
    }
    Object.assign(report, executionOutcome(report));
  } catch (error) {
    report.executionResult = 'failed';
    report.setupFailure = safeHttpError(error);
  }

  try { await finalize(); } catch { report.executionResult = 'failed'; }
  const measured = report.results.filter((r) => r.result === 'measured').length;
  const mobileRisks = report.results.filter((r) => r.mobilePerformanceRisk).length;
  const base = path.basename(outputFile || 'report-not-written.json');
  process.stdout.write(`report=${base} measured=${measured}/${report.results.length} mobile_below_70=${mobileRisks} execution=${report.executionResult}\n`);
  if (report.executionResult !== 'completed' || report.results.length !== 6) process.exitCode = 1;
}

export { allowedRead, blockedRequestReason, classifyBlockedHost, codeOf, createSecretGuard, executionOutcome, recordNetworkEvent, safeSource };

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
