import { expect, test } from '@playwright/test';
import { baseCss } from './support/r3-support.mjs';

test('R4 C1c all 12 featured-product images remain visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const figures = Array.from({ length: 12 }, (_, index) => `<figure class="featured-product__media"
    data-product-media-id="${index + 1}" data-media-type="image"><div style="height:100px"></div></figure>`).join('');
  await page.setContent(`<!doctype html><html><head><style>${baseCss()}</style></head><body>
    <div class="featured-product__layout"><div class="featured-product__gallery">${figures}</div></div></body></html>`);
  const displays = await page.locator('.featured-product__media').evaluateAll((items) => items.map((item) => getComputedStyle(item).display));
  expect(displays).toHaveLength(12);
  expect(displays.every((display) => display !== 'none')).toBe(true);
});
