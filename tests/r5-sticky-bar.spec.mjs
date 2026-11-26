import { expect, test } from '@playwright/test';
import { afterFrames, baseCss, pageShell } from './support/r3-support.mjs';

const primarySelector = '[data-add-to-cart]';
const barSelector = 'sticky-cart-bar';
const visibilityTimeout = { timeout: 2500 };

async function mount(page, { width, height, offset = 77, useObserver = true, variants = 1, unavailable = false, missingForm = false }) {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const title = variants > 1 ? 'Jacket '.repeat(18).trim().slice(0, 120) : 'Jacket';
  const options = Array.from({ length: variants }, (_, index) => `<option value="${index + 1}">Variant ${index + 1}</option>`).join('');
  const form = missingForm ? '' : `<form id="product-form-product">
    <label>Variant <select name="id">${options}</select></label>
    <button type="button" data-add-to-cart ${unavailable ? 'disabled' : ''}>Add to cart</button>
  </form>`;
  await page.setContent(pageShell(`
    <header class="fixture-header">Shop header</header><div style="height:900px"></div>
    <section data-section-id="product">
      ${form}
      <sticky-cart-bar class="sticky-cart-bar" data-product-form-id="product-form-product"
        data-action-label-template="[action] [product]" data-quantity-label-template="[action] [product] [quantity]"
        data-quantity-price-template="[quantity] × [price]" data-total-template="Total [total]"
        aria-hidden="true" inert>
        <p class="sticky-cart-bar__title">${title}</p>
        ${unavailable ? '' : '<p data-sticky-price>$100</p>'}
        <button data-sticky-submit><span data-sticky-label>Add to cart</span></button>
      </sticky-cart-bar>
    </section>
    <div style="height:1600px"></div>`, {
    head: `<style>${baseCss()}
      :root { --header-offset: ${offset}px; }
      .fixture-header { position: fixed; inset: 0 0 auto; height: var(--header-offset); z-index: 10; }
      ${primarySelector} { height: 100px; }
    </style>${useObserver ? '' : '<script>delete window.IntersectionObserver;</script>'}`,
  }));
  await afterFrames(page);
}

async function setButtonBottom(page, bottom) {
  const primary = page.locator(primarySelector);
  await primary.evaluate((button, targetBottom) => {
    window.scrollTo({ top: window.scrollY + button.getBoundingClientRect().bottom - targetBottom, behavior: 'instant' });
  }, bottom);
  const bounds = await primary.boundingBox();
  expect(bounds.y + bounds.height).toBeCloseTo(bottom, 0);
}

async function setHeaderOffset(page, offset) {
  await page.evaluate((height) => {
    document.documentElement.style.setProperty('--header-offset', `${height}px`);
  }, offset);
}

for (const width of [1440, 1536]) {
  test(`R5 B sticky cart appears when the header covers the primary button at ${width}×674`, async ({ page }) => {
    await mount(page, { width, height: 674, variants: width === 1536 ? 40 : 1 });
    const bar = page.locator(barSelector);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');
    expect((await page.locator(primarySelector).boundingBox()).y).toBeGreaterThan(674);

    await setButtonBottom(page, 180);
    await afterFrames(page);
    await setButtonBottom(page, 70);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);

    const stickyButton = bar.locator('[data-sticky-submit]');
    await expect(stickyButton).toBeVisible();
    await stickyButton.evaluate((button) => button.focus({ preventScroll: true }));
    await expect(stickyButton).toBeFocused();

    await setHeaderOffset(page, 60);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator(primarySelector)).toBeFocused();

    await setHeaderOffset(page, 77);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);
    await setButtonBottom(page, 85);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');
  });
}

for (const useObserver of [true, false]) {
  test(`R5 B uses the viewport top when the mobile header is not fixed (observer: ${useObserver})`, async ({ page }) => {
    await mount(page, { width: 390, height: 844, offset: 0, useObserver });
    const bar = page.locator(barSelector);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');

    await setButtonBottom(page, 180);
    await afterFrames(page);
    await setButtonBottom(page, -10);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);
    await setButtonBottom(page, 70);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');

    await setHeaderOffset(page, 77);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);
    await setHeaderOffset(page, 0);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');
  });
}

test('R5 B leaves the incomplete purchase form inert', async ({ page }) => {
  await mount(page, { width: 1440, height: 674, missingForm: true });
  await expect(page.locator(barSelector)).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator(barSelector)).toHaveAttribute('inert', '');
});

test('R5 B preserves an unavailable button and clears the sticky offset on removal', async ({ page }) => {
  await mount(page, { width: 1440, height: 674, unavailable: true });
  await setButtonBottom(page, 180);
  await afterFrames(page);
  await setButtonBottom(page, -10);
  await expect(page.locator(barSelector)).toHaveAttribute('data-visible', '', visibilityTimeout);
  await expect(page.locator('[data-sticky-submit]')).toBeDisabled();

  await page.locator(barSelector).evaluate((bar) => bar.remove());
  await expect(page.locator('body')).not.toHaveAttribute('data-sticky-cart-visible', '');
  expect(await page.locator('html').evaluate((root) => root.style.getPropertyValue('--sticky-cart-offset'))).toBe('0px');
});
