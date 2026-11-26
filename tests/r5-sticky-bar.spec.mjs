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
    <header class="fixture-header">${offset ? '<a class="site-header__brand" href="/">Shop header</a>' : 'Shop header'}</header><div style="height:900px"></div>
    <section data-section-id="product">
      ${form}
      <sticky-cart-bar class="sticky-cart-bar" data-product-form-id="product-form-product"
        data-action-label-template="[action] [product]" data-quantity-label-template="[action] [product] [quantity]"
        data-quantity-price-template="[quantity] × [price]" data-total-template="Total [total]"
        aria-hidden="true" inert>
        <div class="sticky-cart-bar__inner">
          <div class="sticky-cart-bar__media" aria-hidden="true"></div>
          <div class="sticky-cart-bar__details">
            <p class="sticky-cart-bar__title">${title}</p>
            ${unavailable ? '' : '<p class="sticky-cart-bar__meta"><span data-sticky-price>$100</span></p>'}
          </div>
          <button class="button sticky-cart-bar__submit" data-sticky-submit><span data-sticky-label>Add to cart</span></button>
        </div>
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

  test(`R5 B keeps the visible bar's reserved offset in sync on resize (observer: ${useObserver})`, async ({ page }) => {
    await mount(page, { width: 390, height: 844, offset: 0, useObserver });
    const bar = page.locator(barSelector);
    const size = () => bar.evaluate((element) => ({
      height: element.offsetHeight,
      offset: parseFloat(document.documentElement.style.getPropertyValue('--sticky-cart-offset')),
    }));
    await setButtonBottom(page, 180);
    await afterFrames(page);
    await setButtonBottom(page, -40);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);
    const mobile = await size();
    expect(mobile.offset).toBe(mobile.height);

    await page.evaluate(() => {
      const style = document.documentElement.style;
      const setProperty = style.setProperty.bind(style);
      window.stickyOffsetWrites = [];
      style.setProperty = (name, value, priority) => {
        if (name === '--sticky-cart-offset') window.stickyOffsetWrites.push(value);
        return setProperty(name, value, priority);
      };
    });
    await page.setViewportSize({ width: 1440, height: 844 });
    await expect.poll(async () => (await size()).height).toBeGreaterThan(mobile.height);
    const desktopHeight = (await size()).height;
    await expect.poll(async () => (await size()).offset, visibilityTimeout).toBe(desktopHeight);
    await expect(bar).toHaveAttribute('data-visible', '');

    await page.setViewportSize({ width: 1460, height: 844 });
    await afterFrames(page);
    expect(await size()).toEqual({ height: desktopHeight, offset: desktopHeight });
    expect(await page.evaluate(() => window.stickyOffsetWrites)).toEqual([`${desktopHeight}px`]);
  });
}

for (const { width, height, offset } of [
  { width: 1440, height: 674, offset: 77 },
  { width: 390, height: 844, offset: 0 },
]) {
  test(`R5 B skipped intersection activates the bar after a downward jump at ${width}px`, async ({ page }) => {
    await mount(page, { width, height, offset });
    const bar = page.locator(barSelector);
    expect((await page.locator(primarySelector).boundingBox()).y).toBeGreaterThan(height);
    await expect(bar).toHaveAttribute('aria-hidden', 'true');

    // Jump from wholly below the viewport to above the usable area in one scroll.
    await setButtonBottom(page, offset - 30);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);
    await expect(bar).not.toHaveAttribute('inert', '');
  });

  test(`R5 B skipped intersection hides the bar after an upward jump at ${width}px`, async ({ page }) => {
    await mount(page, { width, height, offset });
    const bar = page.locator(barSelector);
    const initial = await page.locator(primarySelector).boundingBox();
    expect(initial.y).toBeGreaterThan(height);
    await setButtonBottom(page, 180);
    await afterFrames(page);
    await setButtonBottom(page, offset - 30);
    await expect(bar).toHaveAttribute('data-visible', '', visibilityTimeout);

    if (offset) await bar.locator('[data-sticky-submit]').evaluate((button) => button.focus({ preventScroll: true }));
    await setButtonBottom(page, initial.y + initial.height);
    await expect(bar).toHaveAttribute('aria-hidden', 'true', visibilityTimeout);
    await expect(bar).toHaveAttribute('inert', '');
    if (offset) {
      const safeFocus = page.getByRole('link', { name: 'Shop header' });
      await expect(safeFocus).toBeFocused();
      await expect(safeFocus).toBeInViewport();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    }
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
