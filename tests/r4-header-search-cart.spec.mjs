import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { baseCss, mountPage, pageShell } from './support/r3-support.mjs';

const searchMarkup = `<predictive-search data-predictive-search-url="/search/suggest" data-search-url="/search"
  data-money-format="\${{amount}}" data-loading-text="Loading" data-no-results-text="No results"
  data-error-text="Search error" data-products-heading="Products" data-collections-heading="Collections"
  data-articles-heading="Articles" data-pages-heading="Pages" data-sold-out-text="Sold out"
  data-in-stock-text="In stock" data-results-count-one="1 result" data-results-count-other="[count] results">
  <button type="button" aria-label="Search" aria-expanded="false" data-predictive-search-open>Search</button>
  <div data-predictive-search-overlay hidden><div role="dialog" aria-modal="true" aria-hidden="true" inert tabindex="-1"
    data-predictive-search-panel><button type="button" data-predictive-search-close>Close</button>
    <form action="/search"><input type="text" name="q" value="coat" data-predictive-search-input>
      <button type="button" data-predictive-search-clear hidden>Clear</button><button>Search</button></form>
    <p role="status" aria-live="polite" data-predictive-search-status></p>
    <div id="search-results" role="listbox" data-predictive-search-results hidden></div>
    <div data-predictive-search-footer hidden></div></div></div></predictive-search>`;

test('R4 M-16 opening predictive search selects the previous term so typing replaces it', async ({ page }) => {
  await mountPage(page, pageShell(searchMarkup), {
    onRequest: async (route, url) => {
      if (url.pathname !== '/search/suggest.json') return false;
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ resources: { results: {} } }) });
      return true;
    },
  });
  const input = page.locator('[data-predictive-search-input]');
  await page.locator('[data-predictive-search-open]').click();
  await expect.poll(() => input.evaluate((element) => [element.selectionStart, element.selectionEnd])).toEqual([0, 4]);
  await input.pressSequentially('silk');
  await expect(input).toHaveValue('silk');
});

test('R4 M-19 collection suggestions use the group heading once', async ({ page }) => {
  await mountPage(page, pageShell(searchMarkup), {
    onRequest: async (route, url) => {
      if (url.pathname !== '/search/suggest.json') return false;
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ resources: {
        results: { collections: [{ title: 'Tailoring', url: '/collections/tailoring' }] },
      } }) });
      return true;
    },
  });
  await page.locator('[data-predictive-search-open]').click();
  await expect(page.locator('.predictive-search__group-title')).toHaveText('Collections');
  await expect(page.locator('.predictive-search__result-title')).toHaveText('Tailoring');
  await expect(page.locator('.predictive-search__result-type')).toHaveCount(0);
});

test('R4 M-13 country chevron stays inside the select wrapper and clear of the submit button in LTR and RTL', async ({ page }) => {
  await page.setContent(`<!doctype html><html><head><style>${baseCss()}</style></head><body>
    <form class="localization-form__form"><div class="localization-form__country-wrapper">
      <div class="localization-form__country-select-wrapper"><label class="visually-hidden" for="country">Country</label>
        <select id="country" class="localization-form__country"><option>United States (USD $)</option></select></div>
      <button type="button" class="button button--secondary localization-form__country-submit">Update preferences</button>
    </div></form></body></html>`);
  for (const width of [1440, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    for (const direction of ['ltr', 'rtl']) {
      await page.locator('html').evaluate((html, value) => { html.dir = value; }, direction);
      const geometry = await page.evaluate(() => {
        const wrapper = document.querySelector('.localization-form__country-select-wrapper');
        const submit = document.querySelector('.localization-form__country-submit');
        const rect = wrapper.getBoundingClientRect();
        const button = submit.getBoundingClientRect();
        const chevron = getComputedStyle(wrapper, '::after');
        const start = document.documentElement.dir === 'rtl'
          ? rect.left + Number.parseFloat(chevron.left)
          : rect.right - Number.parseFloat(chevron.right) - Number.parseFloat(chevron.width);
        return { direction: document.documentElement.dir, wrapper: { left: rect.left, right: rect.right },
          button: { left: button.left, right: button.right }, chevron: { left: start, right: start + Number.parseFloat(chevron.width) } };
      });
      expect(geometry.chevron.left).toBeGreaterThanOrEqual(geometry.wrapper.left);
      expect(geometry.chevron.right).toBeLessThanOrEqual(geometry.wrapper.right);
      if (direction === 'ltr') expect(geometry.wrapper.right).toBeLessThanOrEqual(geometry.button.left);
      else expect(geometry.button.right).toBeLessThanOrEqual(geometry.wrapper.left);
    }
  }
});

test('R4 M-13 Liquid scopes the chevron wrapper to the country select', () => {
  const liquid = readFileSync(new URL('../snippets/localization-selectors.liquid', import.meta.url), 'utf8');
  expect(liquid).toContain('<div class="localization-form__country-select-wrapper">');
  expect(liquid).toContain('<button type="submit" class="button button--secondary localization-form__country-submit">');
});
