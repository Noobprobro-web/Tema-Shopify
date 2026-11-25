import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { baseCss, mountPage, pageShell } from './support/r3-support.mjs';

test('R4 M-17 the 404 search field receives the flexible track and the approved English heading', async ({ page }) => {
  await page.setContent(`<!doctype html><html><head><style>${baseCss()}</style></head><body>
    <div class="container"><form class="main-404__search-row"><input placeholder="Search products and stories">
      <button>Search</button></form></div></body></html>`);
  for (const width of [1440, 1536]) {
    await page.setViewportSize({ width, height: 900 });
    const fields = await page.evaluate(() => {
      const row = document.querySelector('.main-404__search-row');
      return Array.from(row.children, (element) => element.getBoundingClientRect().width);
    });
    expect(fields[0]).toBeGreaterThan(fields[1]);
    expect(await page.locator('input').getAttribute('placeholder')).toBe('Search products and stories');
  }
  const english = JSON.parse(readFileSync(new URL('../locales/en.default.json', import.meta.url), 'utf8'));
  const spanish = JSON.parse(readFileSync(new URL('../locales/es.json', import.meta.url), 'utf8'));
  expect(english.not_found.recommendations).toBe('Popular pieces');
  expect(spanish.not_found.recommendations).toBe('Piezas populares');
});

test('R4 M-18 the gift-card product template copies the root product without the care accordion', () => {
  const root = JSON.parse(readFileSync(new URL('../templates/product.json', import.meta.url), 'utf8'));
  const giftCard = JSON.parse(readFileSync(new URL('../templates/product.gift-card.json', import.meta.url), 'utf8'));
  delete root.sections.main.blocks.composition_care;
  root.sections.main.block_order = root.sections.main.block_order.filter((id) => id !== 'composition_care');
  expect(giftCard).toEqual(root);
  expect(giftCard.sections.main.blocks.composition_care).toBeUndefined();
});

test('R4A-16 Sartorial has its own gift-card listing template with split-screen media', () => {
  const root = JSON.parse(readFileSync(new URL('../templates/product.gift-card.json', import.meta.url), 'utf8'));
  const listing = JSON.parse(readFileSync(new URL('../listings/sartorial/templates/product.gift-card.json', import.meta.url), 'utf8'));
  root.sections.main.settings.media_layout = 'split_screen';
  expect(listing).toEqual(root);
  expect(listing.sections.main.blocks.composition_care).toBeUndefined();
});

test('R4 M-27 distinguishes an out-of-range page from a genuinely empty blog', () => {
  const liquid = readFileSync(new URL('../sections/main-blog.liquid', import.meta.url), 'utf8');
  expect(liquid).toContain('paginate.current_page > paginate.pages and paginate.items > 0');
  expect(liquid).toContain('blogs.blog.page_out_of_range');
  expect(liquid).toContain('paginate.items == 0');
  expect(liquid).toContain("blogs.blog.empty");
  const english = JSON.parse(readFileSync(new URL('../locales/en.default.json', import.meta.url), 'utf8'));
  const spanish = JSON.parse(readFileSync(new URL('../locales/es.json', import.meta.url), 'utf8'));
  expect(english.blogs.blog.page_out_of_range).toBe('There are no essays on this page.');
  expect(spanish.blogs.blog.page_out_of_range).toBe('No hay ensayos en esta página.');
  expect(english.blogs.blog.page_out_of_range).not.toMatch(/journal|return|browse/i);
  expect(spanish.blogs.blog.page_out_of_range).not.toMatch(/diario|volver|consultar/i);
});

test('R4A-14 no-JS localization select comment matches the native-arrow fallback', () => {
  const css = readFileSync(new URL('../assets/base.css', import.meta.url), 'utf8');
  expect(css).toContain('Without JS the select uses its native arrow');
});

test('R4 M-28 an empty predictive search names the actual query in the proposed copy', async ({ page }) => {
  const markup = `<predictive-search data-predictive-search-url="/search/suggest" data-search-url="/search"
    data-no-results-text="No matches for “[terms]”. Try another search or view all results."
    data-loading-text="Searching" data-products-heading="Products" data-collections-heading="Collections"
    data-articles-heading="Articles" data-pages-heading="Pages" data-results-count-one="1 result"
    data-results-count-other="[count] results">
    <button type="button" data-predictive-search-open aria-expanded="false">Search</button>
    <div data-predictive-search-overlay hidden><div data-predictive-search-panel role="dialog" aria-modal="true" inert>
      <button type="button" data-predictive-search-close>Close</button><input data-predictive-search-input value="">
      <button type="button" data-predictive-search-clear hidden>Clear</button>
      <p data-predictive-search-status role="status" aria-live="polite"></p>
      <div id="empty-results" role="listbox" data-predictive-search-results hidden></div>
      <div data-predictive-search-footer hidden></div></div></div></predictive-search>`;
  await mountPage(page, pageShell(markup), {
    onRequest: async (route, url) => {
      if (url.pathname !== '/search/suggest.json') return false;
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ resources: { results: {} } }) });
      return true;
    },
  });
  await page.locator('[data-predictive-search-open]').click();
  await page.locator('[data-predictive-search-input]').fill('tailoring');
  await expect(page.locator('.predictive-search__empty')).toHaveText('No matches for “tailoring”. Try another search or view all results.');
});
