// R3 regressions about predictive search, collection filters and variant prices:
// AS-03, AS-05, AS-09, AS-10, FB-33, FO-05.
// The real assets/theme.js runs against markup that mirrors snippets/predictive-search.liquid,
// sections/main-collection.liquid and sections/main-product.liquid.
import { expect, test } from '@playwright/test';
import {
  afterFrames,
  gate,
  mountPage,
  optionRadios,
  pageShell,
  variantJsonScript,
  variantRecord,
} from './support/r3-support.mjs';

// ---------------------------------------------------------------------------------------------
// Predictive search (snippets/predictive-search.liquid with the strings already translated).
// ---------------------------------------------------------------------------------------------
const predictiveSearchMarkup = `<predictive-search class="predictive-search js-only"
  data-predictive-search-url="/search/suggest" data-search-url="/search" data-money-format="\${{amount}}"
  data-loading-text="Loading" data-no-results-text="No results" data-error-text="Search is not available right now"
  data-products-heading="Products" data-collections-heading="Collections" data-articles-heading="Articles"
  data-pages-heading="Pages" data-sold-out-text="Sold out" data-in-stock-text="In stock"
  data-regular-price-text="Regular price" data-price-from-text="From" data-sale-price-text="Sale price" data-view-all-template="View all [terms]"
  data-results-count-one="1 result" data-results-count-other="[count] results">
  <button class="icon-button predictive-search__trigger" type="button" aria-label="Search" aria-expanded="false"
    aria-controls="PredictiveSearchPanel-header" data-predictive-search-open>Search</button>
  <div class="predictive-search__overlay" data-predictive-search-overlay hidden>
    <div id="PredictiveSearchPanel-header" class="predictive-search__panel" role="dialog" aria-modal="true"
      aria-label="Search" aria-hidden="true" tabindex="-1" data-predictive-search-panel inert>
      <div class="predictive-search__header">
        <button class="icon-button" type="button" aria-label="Close" data-predictive-search-close>x</button>
      </div>
      <form class="predictive-search__form" action="/search" method="get" role="search" data-predictive-search-form>
        <input id="PredictiveSearchInput-header" class="predictive-search__input" type="text" name="q"
          role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-autocomplete="list"
          aria-controls="predictive-search-results-header" autocomplete="off" data-predictive-search-input>
        <button class="predictive-search__clear" type="button" aria-label="Clear" data-predictive-search-clear hidden>x</button>
        <button class="button predictive-search__submit" type="submit">Search</button>
      </form>
      <p class="visually-hidden" role="status" aria-live="polite" aria-atomic="true" data-predictive-search-status></p>
      <div id="predictive-search-results-header" class="predictive-search__results" role="listbox"
        aria-label="Results" data-predictive-search-results hidden></div>
      <div class="predictive-search__footer" data-predictive-search-footer hidden></div>
    </div>
  </div>
</predictive-search>`;

const hatResult = { title: 'Hat', url: '/products/hat', price: '10.00' };
const resultsBody = (results = {}) => JSON.stringify({ resources: { results } });

// `behavior(state)` returns what the suggestions endpoint does for the next request.
async function mountSearch(page, behavior) {
  const state = { requests: 0, hold: null, status: 200, body: resultsBody({ products: [hatResult] }) };
  Object.assign(state, behavior);
  await mountPage(page, pageShell(`<header>${predictiveSearchMarkup}</header>`), {
    onRequest: async (route, url) => {
      if (url.pathname !== '/search/suggest.json') return false;
      state.requests += 1;
      await state.hold?.promise;
      // The shopper may have cancelled the request meanwhile; answering it then is harmless.
      await route.fulfill({ status: state.status, contentType: 'application/json', body: state.body }).catch(() => {});
      return true;
    },
  });
  return state;
}

const results = (page) => page.locator('[data-predictive-search-results]');

test.describe('AS-03 predictive search cancelled queries', () => {
  test('AS-03 closing during the debounce and reopening relaunches the query and clears the busy state', async ({ page }) => {
    const state = await mountSearch(page);
    await page.locator('[data-predictive-search-open]').click();
    await page.locator('[data-predictive-search-input]').fill('hat');
    await page.keyboard.press('Escape'); // inside the 200 ms debounce
    await expect(results(page)).not.toHaveAttribute('aria-busy', 'true');

    // Wait out the debounce window: the cancelled query must send nothing.
    await page.waitForTimeout(350);
    expect(state.requests, 'a cancelled query sends nothing').toBe(0);

    await page.locator('[data-predictive-search-open]').click();
    await expect(results(page).locator('a')).toHaveCount(1);
    await expect(results(page)).toHaveAttribute('aria-busy', 'false');
    expect(state.requests).toBe(1);
  });

  test('AS-03 closing while the request is in flight and reopening relaunches it and clears the busy state', async ({ page }) => {
    const state = await mountSearch(page, { hold: gate() });
    await page.locator('[data-predictive-search-open]').click();
    await page.locator('[data-predictive-search-input]').fill('hat');
    await expect.poll(() => state.requests).toBe(1); // debounce passed, the request is parked

    await page.keyboard.press('Escape');
    await expect(results(page)).not.toHaveAttribute('aria-busy', 'true');

    await page.locator('[data-predictive-search-open]').click();
    await expect.poll(() => state.requests, { message: 'reopening asks again' }).toBe(2);
    state.hold.open();
    await expect(results(page).locator('a')).toHaveCount(1);
    await expect(results(page)).toHaveAttribute('aria-busy', 'false');
  });

  test('AS-03 a failed request says the search failed, not "no results"; an empty answer still says "no results"', async ({ page }) => {
    const state = await mountSearch(page, { status: 500, body: 'boom' });
    const footer = page.locator('[data-predictive-search-footer]');
    await page.locator('[data-predictive-search-open]').click();
    await page.locator('[data-predictive-search-input]').fill('hat');

    await expect(footer).toContainText('Search is not available right now');
    await expect(footer).not.toContainText('No results');
    await expect(page.locator('[data-predictive-search-status]')).toHaveText('Search is not available right now');

    // Control inside the same flow: a successful but empty answer keeps the usual message.
    Object.assign(state, { status: 200, body: resultsBody({}) });
    await page.locator('[data-predictive-search-input]').fill('hatx');
    await expect(footer).toContainText('No results');
  });
});

test.describe('L5 predictive search price range', () => {
  test('L5 a product whose variants differ in price reads "From"; a single price does not', async ({ page }) => {
    await mountSearch(page, {
      body: resultsBody({
        products: [
          { title: 'Range', url: '/products/range', price: '89.00', price_min: '89.00', price_max: '109.75' },
          { title: 'Single', url: '/products/single', price: '50.00', price_min: '50.00', price_max: '50.00' },
        ],
      }),
    });
    await page.locator('[data-predictive-search-open]').click();
    await page.locator('[data-predictive-search-input]').fill('x1');
    await expect(results(page).locator('a')).toHaveCount(2);
    const prices = results(page).locator('.predictive-search__price');
    await expect(prices.nth(0)).toHaveText('From $89.00');
    await expect(prices.nth(1)).toHaveText('$50.00');
  });
});

test.describe('AS-10 predictive search sale price', () => {
  test('AS-10 a strike-through price only appears when both amounts belong to the same offer', async ({ page }) => {
    await mountSearch(page, {
      body: resultsBody({
        products: [
          // A: the cheapest variant is the one on sale -> strike 15.
          { title: 'A', url: '/products/a', price: '10.00', price_min: '10.00', price_max: '20.00',
            compare_at_price_min: '15.00', compare_at_price_max: '15.00',
            variants: [{ price: '10.00', compare_at_price: '15.00' }, { price: '20.00', compare_at_price: null }] },
          // B: the compare-at price belongs to the dearer variant -> no strike.
          { title: 'B', url: '/products/b', price: '10.00', price_min: '10.00', price_max: '20.00',
            compare_at_price_min: '30.00', compare_at_price_max: '30.00',
            variants: [{ price: '10.00', compare_at_price: null }, { price: '20.00', compare_at_price: '30.00' }] },
          // C: no variants in the payload and prices vary, so the aggregate compare-at is ambiguous -> no strike.
          { title: 'C', url: '/products/c', price: '10.00', price_min: '10.00', price_max: '20.00',
            compare_at_price_min: '15.00', compare_at_price_max: '15.00' },
          // D: no variants but a single price and a single compare-at -> strike.
          { title: 'D', url: '/products/d', price: '10.00', price_min: '10.00', price_max: '10.00',
            compare_at_price_min: '15.00', compare_at_price_max: '15.00' },
        ],
      }),
    });
    await page.locator('[data-predictive-search-open]').click();
    await page.locator('[data-predictive-search-input]').fill('x1');
    await expect(results(page).locator('a')).toHaveCount(4);

    const struck = await results(page).locator('a').evaluateAll((links) =>
      links.map((link) => [
        link.querySelector('.predictive-search__result-title').textContent,
        link.querySelector('s')?.textContent.replace(/\s+/g, ' ').trim() || null,
      ]));
    expect(struck).toEqual([['A', 'Regular price $15.00'], ['B', null], ['C', null], ['D', 'Regular price $15.00']]);
  });
});

// ---------------------------------------------------------------------------------------------
// Collection filters (sections/main-collection.liquid).
// ---------------------------------------------------------------------------------------------
const facetsMarkup = (render) => `<facet-filters-form data-section-id="facets" data-default-grid-columns="4">
  <section class="section collection-main" data-facet-section>
    <form class="facets" action="/collections/all" method="get" aria-label="Filters" data-facet-form>
      <details class="facets__disclosure">
        <summary class="facets__disclosure-summary"><span>Filters</span></summary>
        <details class="facet" open>
          <summary class="facet__summary"><span>Color</span></summary>
          <div class="facet__content"><ul class="facet__values unstyled-list">
            <li><label class="facet__value" for="Filter-facets-color-1">
              <input id="Filter-facets-color-1" type="checkbox" name="filter.p.m.custom.color" value="red"><span>Red</span></label></li>
            <li><label class="facet__value" for="Filter-facets-color-2">
              <input id="Filter-facets-color-2" type="checkbox" name="filter.p.m.custom.color" value="blue"><span>Blue</span></label></li>
          </ul></div>
        </details>
        <details class="facet" open>
          <summary class="facet__summary"><span>Price</span></summary>
          <div class="facet__content"><div class="facet__price-range">
            <div><label for="Filter-facets-filter.v.price.gte">From</label>
              <div class="facet__price-input"><span aria-hidden="true">$</span>
                <input id="Filter-facets-filter.v.price.gte" type="number" name="filter.v.price.gte" min="0" max="100" step="any"></div></div>
            <div><label for="Filter-facets-filter.v.price.lte">To</label>
              <div class="facet__price-input"><span aria-hidden="true">$</span>
                <input id="Filter-facets-filter.v.price.lte" type="number" name="filter.v.price.lte" min="0" max="100" step="any"></div></div>
          </div></div>
        </details>
        <div class="facets__actions cluster"><button class="button" type="submit">Apply</button></div>
      </details>
    </form>
    <div class="collection-products" data-product-grid aria-busy="false" data-render="${render}">
      <p class="collection-products__count" data-results-status tabindex="-1">24 products</p>
      <a class="product-link" href="/products/p" data-card-link>Product</a>
    </div>
  </section>
</facet-filters-form>`;

// The section answers every filter request with the next render number; `hold` parks it.
async function mountFilters(page, { hold = null } = {}) {
  const state = { renders: 0, queries: [], hold };
  const html = pageShell(`<a id="Link" href="/pages/about">About</a>${facetsMarkup(0)}`);
  await mountPage(page, html, {
    path: '/collections/all',
    onRequest: async (route, url) => {
      if (url.searchParams.get('section_id') !== 'facets') return false;
      state.queries.push(url.search);
      await state.hold?.promise;
      state.renders += 1;
      await route.fulfill({ contentType: 'text/html', body: facetsMarkup(state.renders) }).catch(() => {});
      return true;
    },
  });
  return state;
}

const swapped = (page, render) => expect(page.locator('[data-product-grid]')).toHaveAttribute('data-render', String(render));

test.describe('AS-05 focus after a slow filter response', () => {
  test('AS-05 focus that moved to another control meanwhile is not pulled back, and untouched focus still returns to its control', async ({ page }) => {
    const state = await mountFilters(page, { hold: gate() });
    const red = page.locator('#Filter-facets-color-1');
    const blue = page.locator('#Filter-facets-color-2');

    await red.click();
    await expect.poll(() => state.queries.length).toBe(1);
    await blue.focus(); // the shopper moves on while the answer is still on its way
    state.hold.open();
    await swapped(page, 1);
    await afterFrames(page);
    await expect(blue).toBeFocused();

    // Control: when nothing else took the focus, it stays on the control that started the request
    // (the control is replaced by the swap, so the theme has to put the focus back on its twin).
    state.hold = gate();
    await red.click();
    await expect.poll(() => state.queries.length).toBe(2);
    state.hold.open();
    await swapped(page, 2);
    await afterFrames(page);
    await expect(page.locator('#Filter-facets-color-1')).toBeFocused();
  });

  test('AS-05 focus that moved to a product link inside the component returns to the control that started the request', async ({ page }) => {
    const state = await mountFilters(page, { hold: gate() });
    await page.locator('#Filter-facets-color-1').click();
    await expect.poll(() => state.queries.length).toBe(1);
    // The results grid is part of the component, but the link has no id or name to be found by.
    await page.locator('.product-link').focus();
    state.hold.open();
    await swapped(page, 1);
    await afterFrames(page);
    await expect(page.locator('#Filter-facets-color-1')).toBeFocused();
  });

  test('AS-05 focus that moved outside the filters is respected too', async ({ page }) => {
    const state = await mountFilters(page, { hold: gate() });
    await page.locator('#Filter-facets-color-1').click();
    await expect.poll(() => state.queries.length).toBe(1);
    await page.locator('#Link').focus();
    state.hold.open();
    await swapped(page, 1);
    await afterFrames(page);
    await expect(page.locator('#Link')).toBeFocused();
  });
});

test.describe('FB-33 price over the maximum', () => {
  test('FB-33 a price above the range maximum is clamped and still reaches the AJAX request', async ({ page }) => {
    const state = await mountFilters(page);
    await page.locator('#Filter-facets-filter\\.v\\.price\\.lte').fill('5000');
    // Typing waits for a pause (600 ms) before sending; native validation must not swallow it.
    await expect.poll(() => state.queries.length, { timeout: 5000 }).toBeGreaterThan(0);
    expect(state.queries[0]).toContain('filter.v.price.lte=100');
    await swapped(page, 1);
    await expect(page.locator('[data-facet-form]')).toHaveJSProperty('noValidate', true);
  });
});

// ---------------------------------------------------------------------------------------------
// Variant prices and quantity rule (sections/main-product.liquid, snippets/price.liquid,
// snippets/quantity-rule.liquid).
// ---------------------------------------------------------------------------------------------
const productBlock = (variants, selectedId) => `<variant-selects class="product-main__details"
  data-product-url="/products/p" data-initial-variant-id="${selectedId}" data-money-format="{{amount}}"
  data-add-to-cart-text="Add to cart" data-sold-out-text="Sold out" data-unavailable-text="Unavailable">
  ${optionRadios(variants, selectedId)}
  <div class="price" data-price-wrapper data-label-sale="Sale price" data-label-regular="Regular price">
    <div class="price__values">
      <span class="visually-hidden">Regular price</span>
      <span data-current-price></span>
      <s class="price__compare" data-compare-price hidden></s>
    </div>
  </div>
  <div class="product-form__quantity">
    <div class="quantity-stepper product-form__stepper" data-quantity-stepper>
      <button class="quantity-stepper__button" type="button" name="minus" aria-label="Decrease"
        aria-controls="Quantity" data-quantity-button="decrease" disabled>-</button>
      <input id="Quantity" class="quantity-stepper__input" type="number" name="quantity" value="1" min="1" step="1"
        inputmode="numeric" required data-quantity-input>
      <button class="quantity-stepper__button" type="button" name="plus" aria-label="Increase"
        aria-controls="Quantity" data-quantity-button="increase">+</button>
    </div>
    <p class="product-form__tax-note product-form__quantity-rule" data-quantity-rule
      data-quantity-rule-min-template="Minimum of [quantity]"
      data-quantity-rule-increment-template="Sold in multiples of [quantity]"
      data-quantity-rule-max-template="Maximum of [quantity]" hidden>
      <span data-quantity-rule-part="min" hidden></span>
      <span data-quantity-rule-part="increment" hidden></span>
      <span data-quantity-rule-part="max" hidden></span>
    </p>
  </div>
  ${variantJsonScript(variants)}
</variant-selects>`;

test.describe('AS-09 money strings from Liquid', () => {
  test('AS-09 prices that arrive with HTML entities or markup are painted as plain text', async ({ page }) => {
    const variants = [
      // `money` with a money format that uses an entity, printed raw and printed escape_once'd.
      variantRecord({ id: 1, options: ['A'], price: '&pound;10.00', compare_at_price: '&amp;pound;12.00' }),
      // An app that wraps amounts in markup.
      variantRecord({ id: 2, options: ['B'], price: '<span class="money">£20.00</span>' }),
      // Already plain text must come through untouched.
      variantRecord({ id: 3, options: ['C'], price: '£30.00' }),
    ];
    await mountPage(page, pageShell(productBlock(variants, 1)), { path: '/products/p' });

    const current = page.locator('[data-current-price]');
    const compare = page.locator('[data-compare-price]');
    await expect(current).toHaveText('£10.00');
    await expect(compare).toHaveText('£12.00');

    await page.locator('#Size-2').check();
    await expect(current).toHaveText('£20.00');
    await expect(compare).toBeHidden();

    await page.locator('#Size-3').check();
    await expect(current).toHaveText('£30.00');
  });
});

test.describe('FO-05 quantity rule text', () => {
  test('FO-05 the quantity rule shows only what applies to the selected variant', async ({ page }) => {
    const variants = [
      variantRecord({ id: 1, options: ['A'], quantity_min: 6, quantity_increment: 6 }),
      variantRecord({ id: 2, options: ['B'] }),
      variantRecord({ id: 3, options: ['C'], quantity_increment: 2, quantity_max: 10 }),
    ];
    await mountPage(page, pageShell(productBlock(variants, 2)), { path: '/products/p' });

    const rule = page.locator('[data-quantity-rule]');
    const part = (name) => page.locator(`[data-quantity-rule-part="${name}"]`);

    // B has the trivial rule: nothing is shown.
    await expect(rule).toBeHidden();

    await page.locator('#Size-1').check();
    await expect(rule).toBeVisible();
    await expect(part('min')).toHaveText('Minimum of 6');
    await expect(part('increment')).toHaveText('Sold in multiples of 6');
    await expect(part('max')).toBeHidden();

    await page.locator('#Size-2').check();
    await expect(rule).toBeHidden();

    await page.locator('#Size-3').check();
    await expect(rule).toBeVisible();
    await expect(part('min')).toBeHidden();
    await expect(part('increment')).toHaveText('Sold in multiples of 2');
    await expect(part('max')).toHaveText('Maximum of 10');
  });

  test('FO-05 a template that repeats the marker is filled everywhere (Spanish increment text)', async ({ page }) => {
    const variants = [variantRecord({ id: 1, options: ['A'], quantity_min: 6, quantity_increment: 6 }), variantRecord({ id: 2, options: ['B'] })];
    // The Spanish string is "De {{ quantity }} en {{ quantity }}": the marker appears twice.
    const html = pageShell(productBlock(variants, 2)).replace(
      'Sold in multiples of [quantity]',
      'De [quantity] en [quantity]'
    );
    await mountPage(page, html, { path: '/products/p' });
    await page.locator('#Size-1').check();
    await expect(page.locator('[data-quantity-rule-part="increment"]')).toHaveText('De 6 en 6');
  });
});
