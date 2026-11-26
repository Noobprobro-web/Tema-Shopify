import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { baseCss } from './support/r3-support.mjs';

const copy = (file) => JSON.parse(readFileSync(new URL(`../locales/${file}`, import.meta.url), 'utf8')).not_found;
const languages = { en: copy('en.default.json'), es: copy('es.json') };

function template(lang, { direction = 'ltr', products = [] } = {}) {
  const text = languages[lang];
  const cards = products.map(({ title, image }) => `<li><article class="product-card">
    <div class="product-card__media">${image ? '<img alt="" width="100" height="100">' : '<div class="product-card__media-placeholder"></div>'}</div>
    <h3 class="product-card__title">${title}</h3>
  </article></li>`).join('');
  return `<!doctype html><html lang="${lang}" dir="${direction}"><head><meta charset="utf-8">
    <style>${baseCss()}</style></head><body>
    <section class="section main-404 color-scheme-1" aria-labelledby="NotFoundTitle-fixture">
      <div class="container main-404__layout">
        <div class="main-404__message flow">
          <p class="eyebrow">${text.eyebrow}</p>
          <p class="main-404__code" aria-hidden="true">404</p>
          <h1 id="NotFoundTitle-fixture">${text.title}</h1>
          <p class="lede">${text.message}</p>
          <form class="main-404__search" action="/search" method="get" role="search">
            <label for="NotFoundSearch-fixture">${text.search_label}</label>
            <div class="main-404__search-row">
              <input id="NotFoundSearch-fixture" type="search" name="q" placeholder="${text.search_placeholder}" required>
              <input type="hidden" name="options[prefix]" value="last">
              <button class="button" type="submit">${text.search_submit}</button>
            </div>
          </form>
          <a class="button button--secondary" href="/collections/all">${text.return_to_collection}</a>
        </div>
        ${cards ? `<section class="main-404__recommendations" aria-labelledby="NotFoundRecommendations-fixture">
          <h2 id="NotFoundRecommendations-fixture" class="main-404__recommendations-heading">${text.recommendations}</h2>
          <ul class="main-404__product-grid unstyled-list">${cards}</ul>
        </section>` : ''}
      </div>
    </section></body></html>`;
}

async function measureSearch(page, maxWidth) {
  return page.getByRole('searchbox').evaluate((input, pageWidth) => {
    document.documentElement.style.setProperty('--page-width', `${pageWidth}px`);
    const row = input.parentElement;
    const button = row.querySelector('button');
    const [fieldRect, buttonRect, rowRect] = [input, button, row].map((element) => element.getBoundingClientRect());
    const style = getComputedStyle(input);
    const context = document.createElement('canvas').getContext('2d');
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.letterSpacing = style.letterSpacing;
    return {
      usable: input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      placeholder: Math.ceil(context.measureText(input.placeholder).width),
      buttonHeight: buttonRect.height,
      hiddenWidth: row.querySelector('input[type="hidden"]').offsetWidth,
      sameRow: Math.abs(buttonRect.top - fieldRect.top) < 1,
      overflow: Math.max(
        rowRect.left - Math.min(fieldRect.left, buttonRect.left),
        Math.max(fieldRect.right, buttonRect.right) - rowRect.right,
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    };
  }, maxWidth);
}

const product = { title: 'Wool coat', image: true };

for (const lang of Object.keys(languages)) {
  test(`404 search fits the ${lang} placeholder at desktop and smaller widths`, async ({ page }) => {
    await page.setContent(template(lang, { products: [product] }));
    for (const width of [390, 800, 1024, 1280, 1440, 1536]) {
      await page.setViewportSize({ width, height: 900 });
      for (const maxWidth of [1000, 1600]) {
        const geometry = await measureSearch(page, maxWidth);
        const setup = `${lang} at ${width}px with page width ${maxWidth}px`;
        expect.soft(geometry.usable, `${setup}: usable space for the full placeholder`).toBeGreaterThanOrEqual(geometry.placeholder);
        expect.soft(geometry.buttonHeight, setup).toBeGreaterThanOrEqual(44);
        expect.soft(geometry.hiddenWidth, setup).toBe(0);
        expect.soft(geometry.overflow, setup).toBeLessThanOrEqual(1);
        expect.soft(geometry.sameRow, setup).toBe(width === 800);
      }
    }
  });
}

test('404 search fits in RTL with no recommendations or four varied recommendations', async ({ page }) => {
  const longTitle = 'A long product title '.repeat(6).trim().slice(0, 120);
  for (const products of [[], [product, product, { title: longTitle, image: false }, product]]) {
    await page.setContent(template('es', { direction: 'rtl', products }));
    await expect(page.locator('.main-404__product-grid > li')).toHaveCount(products.length);
    for (const width of [390, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await measureSearch(page, 1000);
      expect.soft(geometry.usable).toBeGreaterThanOrEqual(geometry.placeholder);
      expect.soft(geometry.overflow).toBeLessThanOrEqual(1);
    }
  }
});
