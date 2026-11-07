import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import capture from '../harness-GPT-C01-COLLECTION-001/capture.mjs';

const require = createRequire(resolve(process.argv[2] || '.', 'package.json'));
const { chromium } = require('playwright');
const { Liquid } = require('liquidjs');
const engine = new Liquid();
engine.registerFilter('money', (cents) => String(cents ?? 0));
engine.registerFilter('json', (value) => JSON.stringify(value ?? null));
const messages = JSON.parse(await readFile('locales/en.default.json', 'utf8')).products.product;
engine.registerFilter('t', (key) => messages[key.split('.').at(-1)] ?? key);
const snippet = (await readFile('snippets/variant-no-js-select.liquid', 'utf8'))
  .replace(/{% doc %}[\s\S]*?{% enddoc %}/, '');
const theme = await readFile('assets/theme.js', 'utf8');
const css = await readFile('assets/base.css', 'utf8');

const origin = 'https://theme.test';
const productPath = '/products/featured';
const productId = 14;
const initialValues = [101, 202, 302];
const validValues = [102, 202, 302];
const invalidValues = [103, 202, 302];
const groups = [
  ['Color', [[101, 'Red'], [102, 'Blue'], [103, 'Missing']]],
  ['Size', [[201, 'Small'], [202, 'Medium']]],
  ['Finish', [[301, 'Matte'], [302, 'Satin']]],
];
const optionLabels = (ids) => ids.map((id, index) => groups[index][1].find(([valueId]) => valueId === id)[1]);
const product = (ids, variantCount = 300) => ({
  id: productId,
  url: productPath + '?variant=901',
  variants_count: variantCount,
  options_with_values: groups.map(([name, values], index) => ({
    position: index + 1,
    name,
    selected_value: optionLabels(ids)[index],
    values: values.map(([id, label]) => ({ id, label, selected: id === ids[index], available: id !== 103 })),
  })),
});
const variant = (id, ids, min = 1) => ({
  id, title: optionLabels(ids).join(' / '), options: optionLabels(ids), available: true,
  inventory_management: 'shopify', inventory_quantity: 125, inventory_policy: 'deny',
  price: 1000, quantity_rule: { min, increment: min, max: 8 }, selling_plan_allocations: [],
});
const red = variant(901, initialValues);
const blue = variant(902, validValues, 2);
const section = { id: 'main-product-instance' };
const render = (mode, ids, selectedVariant, extra = {}) => engine.parseAndRender(snippet, {
  mode, product: product(ids), selected_variant: selectedVariant, section, inventory_cap: 3, ...extra,
});
const urlFor = (values) => productPath + '?option_values=' + values.join(',');
const noticeId = 'featured-variant-notice';
const links = await render('option_links', initialValues, red, { notice_id: noticeId });
assert.match(links, /href="\/products\/featured\?option_values=102,202,302"/);
assert.match(links, /href="\/products\/featured\?option_values=101,201,302"/);
assert.match(links, /href="\/products\/featured\?option_values=101,202,301"/);
assert.doesNotMatch(links, /no-js-only|name="id"/);
assert.ok(links.includes(`id="${noticeId}">${messages.variant_navigation_notice}</p>`));
assert.ok(links.includes(`aria-describedby="${noticeId}"`));
const nativeNull = await render(undefined, invalidValues, null, { show_options: true, server_variants: true });
assert.match(nativeNull, /name="id"[^>]*disabled/);
const featuredInitial = await render('state', initialValues, red, { inventory_cap: 2 });
assert.equal(JSON.parse(featuredInitial).inventory_quantity, 2);
assert.equal(JSON.parse(await render('state', initialValues, red, { inventory_cap: 1 })).inventory_quantity, 1);
const featured = await readFile('sections/featured-product.liquid', 'utf8');
assert.match(featured, /assign selected_variant = featured_product\.selected_or_first_available_variant/);
assert.match(featured, /mode: 'option_links', product: featured_product/);
assert.doesNotMatch(featured, /data-variant-state-url|section_id.*variant-state/);
console.log('PASS Liquid sandbox: three ordered option IDs, independent links, capped initial stock and null ID guard');

const browser = await chromium.launch({ headless: true });
try {
  const radios = (ids) => groups.map(([name, values], index) => `<fieldset>
    ${values.map(([id, label]) => `<label><input type="radio" name="${name}" value="${label}"
      data-option-position="${index + 1}" data-option-value-id="${id}" ${id === ids[index] ? 'checked' : ''}>${label}</label>`).join('')}
    </fieldset>`).join('');
  const form = async (ids, selectedVariant, withLinks = false) => `<form data-cart-add-form>
    ${await render(undefined, ids, selectedVariant, { show_options: withLinks, server_variants: withLinks })}
    <input aria-label="Quantity" type="number" name="quantity" data-quantity-input
      value="${selectedVariant?.quantity_rule.min || 1}" min="${selectedVariant?.quantity_rule.min || 1}"
      step="${selectedVariant?.quantity_rule.increment || 1}" max="8">
    <button type="submit" name="add" data-add-to-cart ${selectedVariant ? '' : 'disabled'}>
      <span data-add-to-cart-text>${selectedVariant ? 'Add to cart' : 'Unavailable'}</span>
    </button>
  </form>`;
  const labels = 'data-unavailable-text="Unavailable" data-add-to-cart-text="Add to cart" data-available-status="Available"';
  const script = '<script defer src="/assets/theme.js"></script>';
  const featuredPage = `<link rel="stylesheet" href="/assets/base.css">
    <style>:root { --color-button: rgb(20, 30, 40); --color-button-label: white; }</style>
    <variant-selects ${labels} data-initial-variant-id="901">
    ${links}${await form(initialValues, red)}
    <script type="application/json" data-variant-json>[${featuredInitial}]</script>
  </variant-selects>${script}`;
  const pdp = async (ids, selectedVariant) => `<variant-selects ${labels} data-product-url="${productPath}"
    data-variant-state-url="${productPath}" data-variant-state-section="${section.id}"
    data-product-id="${productId}" data-initial-variant-id="${selectedVariant?.id || ''}"
    data-variant-loading-text="${messages.variant_loading}">
    <div data-variant-picker>${radios(ids)}</div>
    ${await form(ids, selectedVariant, true)}
    ${await render('response', ids, selectedVariant)}
  </variant-selects>${script}`;
  const formValues = (page, field) => page.locator('form')
    .evaluate((formElement, name) => new FormData(formElement).getAll(name), field);
  const pdpMarkup = new Map([
    [initialValues.join(','), await pdp(initialValues, red)],
    [validValues.join(','), await pdp(validValues, blue)],
    [invalidValues.join(','), await pdp(invalidValues, null)],
  ]);
  const pdpSection = await render('response', validValues, blue);
  assert.equal(JSON.parse(pdpSection.match(/data-resolved-variant>([\s\S]*?)<\/script>/)[1]).inventory_quantity, 3);
  const routePage = async (page, requests, sectionResponseGate) => {
    await page.route(origin + '/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname === '/assets/theme.js') {
        return route.fulfill({ contentType: 'application/javascript', body: theme });
      }
      if (url.pathname === '/assets/base.css') {
        return route.fulfill({ contentType: 'text/css', body: css });
      }
      if (sectionResponseGate && url.searchParams.has('section_id')) await sectionResponseGate;
      requests.push({ path: url.pathname, search: url.search, navigation: route.request().isNavigationRequest() });
      const options = url.searchParams.get('option_values');
      const body = url.pathname === productPath
        ? (url.searchParams.has('section_id') ? pdpSection : pdpMarkup.get(options) || pdpMarkup.get(initialValues.join(',')))
        : featuredPage;
      return route.fulfill({ contentType: 'text/html; charset=utf-8', body });
    });
  };

  for (const javaScriptEnabled of [true, false]) {
    for (const host of ['/', '/products/other?variant=777']) {
      const context = await browser.newContext({ javaScriptEnabled });
      const page = await context.newPage();
      const requests = [];
      await routePage(page, requests);
      for (const [values, valid] of [[validValues, true], [invalidValues, false]]) {
        await page.goto(origin + host);
        const href = urlFor(values);
        const link = page.locator(`a[href="${href}"]`);
        assert.equal(await link.isVisible(), true);
        const notice = page.getByText(messages.variant_navigation_notice, { exact: true });
        assert.equal(await notice.isVisible(), true);
        assert.equal(await notice.getAttribute('id'), await link.getAttribute('aria-describedby'));
        const selected = page.locator('a.variant-picker__label[aria-current]').first();
        assert.equal(await selected.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(20, 30, 40)');
        assert.notEqual(await link.evaluate((element) => getComputedStyle(element).backgroundColor), 'rgb(20, 30, 40)');
        await Promise.all([page.waitForURL(origin + href), link.click()]);
        assert.deepEqual(requests.at(-1), { path: productPath, search: '?option_values=' + values.join(','), navigation: true });
        assert.deepEqual(await formValues(page, 'id'), valid ? ['902'] : []);
        assert.equal(await page.locator('[data-add-to-cart]').isDisabled(), !valid);
        if (valid) {
          assert.deepEqual(await formValues(page, 'quantity'), ['2']);
          assert.equal(await page.getByRole('spinbutton', { name: 'Quantity' }).getAttribute('step'), '2');
        }
      }
      assert.equal(requests.some(({ search }) => search.includes('section_id')), false);
      await context.close();
    }
  }
  console.log('PASS Chromium: featured selected style and linked notice; full navigation with/without JS, quantity 2 and null-safe form');

  const page = await browser.newPage();
  const requests = [];
  let releaseSection;
  const sectionResponseGate = new Promise((resolve) => { releaseSection = resolve; });
  await routePage(page, requests, sectionResponseGate);
  await page.goto(origin + productPath + '?option_values=102');
  assert.deepEqual(await formValues(page, 'id'), []);
  assert.equal(await page.locator('[data-add-to-cart]').isDisabled(), true);
  await page.goto(origin + productPath + '?variant=901');
  assert.deepEqual(await formValues(page, 'id'), ['901']);
  await page.getByRole('radio', { name: 'Blue', exact: true }).check();
  const loading = page.getByRole('button', { name: messages.variant_loading, exact: true });
  assert.equal(await loading.isDisabled(), true);
  assert.equal(await loading.getAttribute('aria-busy'), 'true');
  assert.deepEqual(await formValues(page, 'id'), []);
  releaseSection();
  await page.waitForFunction(() => !document.querySelector('[data-variant-picker]').hasAttribute('aria-busy'));
  const add = page.getByRole('button', { name: 'Add to cart', exact: true });
  assert.equal(await add.isEnabled(), true);
  assert.equal(await add.getAttribute('aria-busy'), 'false');
  assert.deepEqual(await formValues(page, 'id'), ['902']);
  assert.deepEqual(await formValues(page, 'quantity'), ['2']);
  const stateRequest = requests.at(-1);
  assert.equal(new URLSearchParams(stateRequest.search).get('section_id'), section.id);
  assert.equal(stateRequest.navigation, false);
  await page.getByRole('radio', { name: 'Missing', exact: true }).check({ force: true });
  await page.waitForFunction(() => !document.querySelector('[data-variant-picker]').hasAttribute('aria-busy'));
  assert.equal(await page.getByRole('button', { name: 'Unavailable', exact: true }).isDisabled(), true);
  assert.deepEqual(await formValues(page, 'id'), []);
  await page.close();
  console.log('PASS Chromium: PDP deep link, loading with no ID, resolved purchase and Unavailable only after rejected response');

  const inline = await browser.newPage();
  const inlineJson = await Promise.all([
    render('state', initialValues, red), render('state', validValues, blue),
  ]);
  await inline.route(origin + '/**', (route) => route.fulfill({
    contentType: 'text/html; charset=utf-8',
    body: `<variant-selects ${labels} data-initial-variant-id="901">${radios(initialValues)}
      ${'<form data-cart-add-form><input type="hidden" name="id" value="901" data-variant-id></form>'}
      <script type="application/json" data-variant-json>[${inlineJson.join(',')}]</script>
    </variant-selects>`,
  }));
  await inline.goto(origin + '/');
  await inline.addScriptTag({ content: theme });
  await inline.getByRole('radio', { name: 'Blue', exact: true }).check();
  assert.deepEqual(await formValues(inline, 'id'), ['902']);
  assert.equal(inline.url(), origin + '/');
  await inline.close();
  console.log('PASS Chromium: featured inline picker for 250 or fewer keeps its page and selected form ID');

  const collection = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await collection.setContent(`<form data-facet-form></form><ul data-product-list>
    <li><article class="promotion-tile" style="height: 80px"></article></li>
    <li><article class="product-card" data-product-id="42" style="height: 40px"></article></li>
  </ul>`);
  const options = { preset: 'Sartorial', stage: 'before', themeId: '1', width: 390, height: 844, dpr: 1, previewBar: 'hidden' };
  const actualTop = await collection.locator('article.product-card').evaluate((card) => card.getBoundingClientRect().top);
  const result = await collection.evaluate(capture, options);
  assert.equal(result.firstCardProductId, '42');
  assert.equal(result.firstCardTop, actualTop);
  await collection.locator('article.product-card').evaluate((card) => card.remove());
  await assert.rejects(collection.evaluate(capture, options), /contains no product card/);
  console.log('PASS Chromium: C01 measures first real card and rejects promotion-only grids');
} finally {
  await browser.close();
}
