import { expect, test } from '@playwright/test';
import { baseCss, pageShell } from './support/r3-support.mjs';

const mount = async (page, selector, { width, height }) => {
  await page.setViewportSize({ width, height });
  const layoutClass = selector === 'product' ? 'product-main__layout' : 'featured-product__layout';
  await page.setContent(pageShell(`<main class="container ${layoutClass}">
    ${selector === 'product' ? '<product-gallery data-layout="grid"></product-gallery>' : '<div class="featured-product__gallery"></div>'}
    <${selector === 'product' ? 'div' : 'variant-selects'} class="${selector === 'product' ? 'product-main__details' : 'featured-product__details'}"
      style="height:800px">Buy</${selector === 'product' ? 'div' : 'variant-selects'}>
  </main>`, { head: `<style>${baseCss()}</style><style>:root{--header-offset:101px}</style>` }));
};

for (const selector of ['product', 'featured']) {
  test(`R4 C1a ${selector} details stick only when they fit below the header`, async ({ page }) => {
    await mount(page, selector, { width: 1440, height: 674 });
    const details = page.locator(selector === 'product' ? '.product-main__details' : '.featured-product__details');
    await expect(details).not.toHaveAttribute('data-sticky-fits', '');
    expect(await details.evaluate((element) => getComputedStyle(element).position)).toBe('static');

    await page.setViewportSize({ width: 1440, height: 1100 });
    await expect(details).toHaveAttribute('data-sticky-fits', '');
    expect(await details.evaluate((element) => getComputedStyle(element).position)).toBe('sticky');

    await page.setViewportSize({ width: 390, height: 844 });
    expect(await details.evaluate((element) => getComputedStyle(element).position)).toBe('static');
  });
}
