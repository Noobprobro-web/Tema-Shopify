import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  allowedRead, blockedRequestReason, classifyBlockedHost, codeOf, createSecretGuard, executionOutcome,
  recordNetworkEvent, safeSource,
} from './run.mjs';

const store = 'https://tema-qkqpke0j.myshopify.com';
const cdn = 'https://cdn.shopify.com';
const authorize = '/services/login_with_shop/authorize';
const externalFonts = [
  '/shop-assets/static_uploads/shoplift/GTStandard-MMedium.woff2',
  '/shopify-marketing_assets/static/ShopifySans--bold.woff2',
  '/shopify-marketing_assets/static/ShopifySans--light.woff2',
  '/shopify-marketing_assets/static/ShopifySans--regular.woff',
];
const classify = (raw, kind, detail, guard = () => false) => {
  const source = safeSource(raw, guard);
  const warnings = new Set();
  const failures = new Set();
  const category = recordNetworkEvent(raw, source, kind, detail, warnings, failures);
  assert.equal(warnings.size, category === 'warning' ? 1 : 0);
  assert.equal(failures.size, category === 'failure' ? 1 : 0);
  return { category, source, key: [...warnings, ...failures][0] };
};

test('only the exact store favicon HTTP 404 is a warning', () => {
  assert.equal(classify(store + '/favicon.ico?cache=1#fragment', 'http', 404).category, 'warning');
  for (const [raw, kind, detail] of [
    [store + '/favicon.ico', 'http', 403],
    [store + '/favicon.ico', 'http', 429],
    [store + '/favicon.ico', 'http', 500],
    [store + '/favicon.ico', 'requestfailed', 'CHROMIUM_ERR_ABORTED'],
    [store + '/favicon.ico/', 'http', 404],
    [store + '/es/favicon.ico', 'http', 404],
    [store + ':8443/favicon.ico', 'http', 404],
    [store.replace('https:', 'http:') + '/favicon.ico', 'http', 404],
    ['https://unapproved.invalid/favicon.ico', 'http', 404],
  ]) assert.equal(classify(raw, kind, detail).category, 'failure');
});

test('only the exact Shop login abort maps to a warning', () => {
  const aborted = codeOf({ errorText: 'net::ERR_ABORTED' });
  assert.equal(aborted, 'CHROMIUM_ERR_ABORTED');
  assert.equal(classify(store + authorize, 'requestfailed', aborted).category, 'warning');
  assert.equal(classify(store + authorize, 'cdp', 'Aborted').category, 'warning');
  for (const [raw, kind, detail] of [
    [store + authorize + '/', 'requestfailed', aborted],
    [store + '/es' + authorize, 'requestfailed', aborted],
    [store + '/password', 'requestfailed', aborted],
    [store + authorize, 'requestfailed', 'CHROMIUM_ERR_FAILED'],
    [store + authorize, 'cdp', 'ConnectionAborted'],
    [store + authorize, 'http', 404],
    [cdn + authorize, 'requestfailed', aborted],
    [store + authorize, 'requestfailed', codeOf({ name: 'TimeoutError' })],
  ]) assert.equal(classify(raw, kind, detail).category, 'failure');
});

test('known CDN and store font/file families warn across CDP, requestfailed and HTTP', () => {
  const resources = [
    ...externalFonts.map((pathname) => cdn + pathname),
    cdn + '/shopifycloud/assets/platform.css',
    cdn + '/cdn/shop/files/merchant-fixture.webp',
    'https://fonts.shopifycdn.com/fixture.woff2',
    'https://shopify-assets.shopifycdn.com/fixture.svg',
    store + '/cdn/fonts/fixture.woff2',
    store + '/cdn/shop/files/merchant-fixture.webp',
  ];
  for (const raw of resources) {
    for (const [kind, detail] of [['cdp', 'Failed'], ['requestfailed', 'CHROMIUM_ERR_FAILED'], ['http', 503]]) {
      assert.equal(classify(raw, kind, detail).category, 'warning');
    }
    assert.equal(classify(raw, 'http', 429).category, 'failure');
  }
  assert.equal(classify(cdn + externalFonts[0], 'http', 429).category, 'failure');
  assert.equal(classify(cdn + externalFonts[0], 'requestfailed', 'AUDIT_OPERATION_FAILED').category, 'failure');
  assert.equal(classify(cdn + externalFonts[0], 'cdp', null).category, 'failure');
});

test('theme assets, near-match store paths and unrelated hosts remain fatal', () => {
  for (const raw of [
    cdn + '/cdn/shop/t/190232297715/assets/theme.js',
    cdn + '/cdn/shop/t/4/compiled_assets/styles.css',
    cdn + '/s/files/1/981037/246908/t/7/assets/theme-fixture-8f31c2.css',
    store + '/cdn/shop/t/190232330483/assets/theme.js',
    'https://shopify-assets.shopifycdn.com/cdn/shop/t/190232363251/assets/base.css',
    store + '/cdn/fonts-extra/fixture.woff2',
    store + '/cdn/shop/files-extra/fixture.webp',
    'https://shopifycdn.com/fixture.svg',
    'https://shopifycdn.com.evil.invalid/fixture.svg',
    'https://unapproved.invalid' + externalFonts[0],
  ]) {
    for (const [kind, detail] of [['cdp', 'Failed'], ['requestfailed', 'CHROMIUM_ERR_FAILED'], ['http', 404]]) {
      assert.equal(classify(raw, kind, detail).category, 'failure');
    }
  }
});

test('all three channels log only sanitized host and pathname plus the fixed code', () => {
  const query = 'fixture-redaction-query-8f31c2';
  const fragment = 'fixture-redaction-fragment-7ad893';
  const guard = createSecretGuard([query, fragment]);
  const raw = cdn + externalFonts[0] + '?value=' + query + '#' + fragment;
  for (const [kind, detail, code] of [
    ['http', 404, 'HTTP_404'],
    ['cdp', 'Failed', 'CDP_Failed'],
    ['requestfailed', 'CHROMIUM_ERR_FAILED', 'CHROMIUM_ERR_FAILED'],
  ]) {
    const event = classify(raw, kind, detail, guard);
    assert.equal(event.key, 'cdn.shopify.com:' + externalFonts[0] + ':' + code);
    assert.deepEqual(event.source, { host: 'cdn.shopify.com', path: externalFonts[0], scheme: 'https', redacted: false });
    assert.equal(JSON.stringify(event).includes(query), false);
    assert.equal(JSON.stringify(event).includes(fragment), false);
  }
  const redacted = classify(cdn + '/' + query, 'http', 404, guard);
  assert.equal(redacted.category, 'failure');
  assert.equal(redacted.key, 'redacted:redacted:HTTP_404');
  assert.equal(safeSource('data:text/plain,' + query, guard).path, null);
});

test('known CDN blocks are warnings without expanding the read allowlist', () => {
  for (const raw of [store, cdn, 'https://fonts.shopifycdn.com/a']) assert.equal(allowedRead(raw), true);
  for (const raw of [
    'https://shopify-assets.shopifycdn.com/icon.svg',
    'https://cdn.shopify.com.evil.invalid/asset',
    'http://cdn.shopify.com/asset',
    'https://cdn.shopify.com:444/asset',
    'https://username:password@cdn.shopify.com/asset',
    'data:text/plain,offline',
  ]) assert.equal(allowedRead(raw), false);
  const category = (host, reason, path = '/fixture.svg') => classifyBlockedHost({ host, reason, path });
  assert.equal(category('shopify-assets.shopifycdn.com', 'HOST_OR_URL_BLOCKED_BY_POLICY'), 'known_external_warning');
  assert.equal(category('tema-qkqpke0j.myshopify.com', 'HOST_OR_URL_BLOCKED_BY_POLICY', '/cdn/fonts/fixture.woff2'), 'known_external_warning');
  assert.equal(category('tema-qkqpke0j.myshopify.com', 'HOST_OR_URL_BLOCKED_BY_POLICY', '/cdn/shop/files/merchant-fixture.webp'), 'known_external_warning');
  assert.equal(category('shopify-assets.shopifycdn.com', 'HOST_OR_URL_BLOCKED_BY_POLICY', '/cdn/shop/t/190232297715/assets/theme.js'), 'theme_asset_blocked');
  assert.equal(category('shopifycdn.com.evil.invalid', 'HOST_OR_URL_BLOCKED_BY_POLICY'), 'unclassified_blocked_host');
  assert.equal(category('www.google-analytics.com', 'HOST_OR_URL_BLOCKED_BY_POLICY'), 'known_external_warning');
  assert.equal(category('tema-qkqpke0j.myshopify.com', 'CHECKOUT_NAVIGATION_BLOCKED'), 'checkout_navigation_blocked');
  assert.equal(category('tema-qkqpke0j.myshopify.com', 'METHOD_BLOCKED_BY_POLICY'), 'method_blocked_by_policy');
  assert.equal(category(null, 'NON_HTTP_URL_BLOCKED_BY_POLICY'), 'non_http_url_blocked_by_policy');
});

const blocked = (raw, method = 'GET') => {
  const source = safeSource(raw, () => false);
  const reason = blockedRequestReason(new URL(raw), method, false);
  return { reason, category: classifyBlockedHost({ ...source, reason }) };
};

test('blocked authentication paths never inherit the CDN warning', () => {
  for (const path of ['/password', authorize]) {
    assert.deepEqual(blocked('https://shopify-assets.shopifycdn.com' + path), {
      reason: 'HOST_OR_URL_BLOCKED_BY_POLICY', category: 'unclassified_blocked_host',
    });
    assert.deepEqual(blocked(store + path, 'POST'), {
      reason: 'METHOD_BLOCKED_BY_POLICY', category: 'unclassified_blocked_host',
    });
  }
});

test('blocked CDN ports preserve the cause while standard HTTPS keeps existing severity', () => {
  const blockedCdn = 'https://shopify-assets.shopifycdn.com';
  const unsafe = blocked(blockedCdn + ':444/fixture-port.svg');
  assert.equal(allowedRead(blockedCdn + ':444/fixture-port.svg'), false);
  assert.deepEqual(unsafe, {
    reason: 'PORT_BLOCKED_BY_POLICY', category: 'unclassified_blocked_host',
  });
  assert.deepEqual(blocked('http://shopify-assets.shopifycdn.com/fixture-port.svg'), {
    reason: 'HTTPS_REQUIRED_BY_POLICY', category: 'unclassified_blocked_host',
  });
  assert.equal(allowedRead(blockedCdn + ':443/fixture-port.svg'), false);
  assert.deepEqual(blocked(blockedCdn + ':443/fixture-port.svg'), {
    reason: 'HOST_OR_URL_BLOCKED_BY_POLICY', category: 'known_external_warning',
  });
  assert.deepEqual(blocked(blockedCdn + ':443/cdn/shop/t/190232297715/assets/theme.js'), {
    reason: 'HOST_OR_URL_BLOCKED_BY_POLICY', category: 'theme_asset_blocked',
  });
});

test('browser, cleanup, authentication and 429 still affect execution outcome', () => {
  const base = {
    results: [{ result: 'measured' }],
    previews: [{ contextClosed: true, browserClosed: true }],
    networkFailures: [],
    networkWarnings: [{ source: 'known-warning' }],
    blockedHosts: [],
  };
  assert.deepEqual(executionOutcome(base), { blockedHostAttention: false, executionResult: 'completed' });
  assert.equal(executionOutcome({ ...base, results: [{ result: 'failed', reason: 'AUTH_FAILED' }] }).executionResult, 'failed');
  assert.equal(executionOutcome({ ...base, results: [{ result: 'incomplete', reason: 'HTTP_429_RETRY_LIMIT' }] }).executionResult, 'incomplete');
  assert.equal(executionOutcome({ ...base, previews: [{ contextClosed: true, browserClosed: false }] }).executionResult, 'failed');
  assert.equal(executionOutcome({ ...base, previews: [{ contextClosed: false, browserClosed: true }] }).executionResult, 'failed');
  assert.equal(executionOutcome({ ...base, networkFailures: [{ source: 'profile_cleanup:PROFILE_CLEANUP_FAILED' }] }).executionResult, 'failed');
  assert.deepEqual(executionOutcome({
    ...base, blockedHosts: [{ category: 'known_external_warning' }],
  }), { blockedHostAttention: false, executionResult: 'completed' });
  assert.deepEqual(executionOutcome({
    ...base, blockedHosts: [{ category: 'unclassified_blocked_host' }],
  }), { blockedHostAttention: true, executionResult: 'incomplete' });
  assert.equal(executionOutcome({
    ...base, blockedHosts: [{ category: 'theme_asset_blocked' }],
  }).executionResult, 'failed');
});
