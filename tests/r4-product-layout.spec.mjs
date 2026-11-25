import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
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

const mediaFigures = (count = 7) => Array.from({ length: count }, (_, index) => `<figure class="product-gallery__item"
  data-product-media-id="${index + 1}"><button type="button" data-media-control="${index + 1}">Zoom ${index + 1}</button></figure>`).join('');

const productGallery = `<section data-section-id="product"><product-gallery class="product-gallery" data-layout="grid"
  aria-label="Product media"><div class="product-gallery__items" data-gallery-track>${mediaFigures()}</div>
  <div class="product-gallery__pager" data-gallery-pager data-view-media-template="View [number]">
    <button type="button" data-gallery-step="-1">Previous</button><span data-gallery-current>1</span>
    <button type="button" data-gallery-step="1">Next</button><span data-gallery-status></span>
  </div></product-gallery><variant-selects></variant-selects></section>`;

test('R4 C1b desktop moves the selected figure first, preserves focus and scrolls with reduced motion respected', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setContent(pageShell(`<div style="height:1100px"></div>${productGallery}`, {
    head: `<style>${baseCss()}</style>`,
  }));
  const gallery = page.locator('product-gallery');
  await page.locator('[data-media-control="7"]').evaluate((element) => element.focus({ preventScroll: true }));
  const selectedFigure = page.locator('[data-product-media-id="7"]');
  await selectedFigure.evaluate((element) => {
    element.scrollIntoView = (options) => { element.dataset.scrollBehavior = options.behavior; };
    element.closest('[data-section-id]').dispatchEvent(new CustomEvent('theme:variant-change', {
      bubbles: true, detail: { variant: { featured_media_id: '7' } },
    }));
  });
  await expect(page.locator('[data-gallery-track]').locator(':scope > :first-child')).toHaveAttribute('data-product-media-id', '7');
  await expect(page.locator('[data-media-control="7"]')).toBeFocused();
  expect(await selectedFigure.getAttribute('data-scroll-behavior')).toBe('auto');
  expect(await page.locator('[data-gallery-current]').textContent()).toBe('1');
});

test('R4A-5 scrolls the selected media into view when its gallery is already partly visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const tallGallery = `<div style="height:1000px"></div><section data-section-id="product"><product-gallery class="product-gallery" data-layout="grid">
    <div class="product-gallery__items" data-gallery-track style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
      ${Array.from({ length: 7 }, (_, index) => `<figure style="height:420px" class="product-gallery__item" data-product-media-id="${index + 1}"><button>Media ${index + 1}</button></figure>`).join('')}
    </div><div class="product-gallery__pager" data-gallery-pager><span data-gallery-current>1</span><span data-gallery-status></span></div>
  </product-gallery></section>`;
  await page.setContent(pageShell(tallGallery, { head: `<style>${baseCss()}</style><style>:root{--header-offset:101px}</style>` }));
  const gallery = page.locator('product-gallery');
  await page.evaluate(() => window.scrollTo(0, 1300));
  const before = await page.locator('[data-product-media-id="7"]').evaluate((element) => ({
    mediaTop: element.getBoundingClientRect().top,
    galleryTop: element.closest('product-gallery').getBoundingClientRect().top,
    galleryBottom: element.closest('product-gallery').getBoundingClientRect().bottom,
  }));
  expect(before.mediaTop).toBeGreaterThan(900);
  expect(before.galleryTop).toBeLessThan(0);
  expect(before.galleryBottom).toBeGreaterThan(0);
  await gallery.evaluate((element) => element.closest('[data-section-id]').dispatchEvent(new CustomEvent('theme:variant-change', {
    bubbles: true, detail: { variant: { featured_media_id: '7' } },
  })));
  const selectedBounds = await page.locator('[data-product-media-id="7"]').evaluate((element) => {
    const { top, bottom } = element.getBoundingClientRect();
    return { top, bottom };
  });
  expect(selectedBounds.top).toBeGreaterThanOrEqual(95);
  expect(selectedBounds.bottom).toBeLessThanOrEqual(900);
});

test('R4A-5 does not scroll when the selected media is taller than the window but its top is already visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const markup = `<div style="height:200px"></div><section data-section-id="product"><product-gallery class="product-gallery" data-layout="grid">
    <div class="product-gallery__items" data-gallery-track style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
      ${Array.from({ length: 7 }, (_, index) => `<figure style="height:${index === 6 ? 1400 : 420}px" class="product-gallery__item" data-product-media-id="${index + 1}"><button>Media ${index + 1}</button></figure>`).join('')}
    </div><div class="product-gallery__pager" data-gallery-pager><span data-gallery-current>1</span><span data-gallery-status></span></div>
  </product-gallery></section>`;
  await page.setContent(pageShell(markup, { head: `<style>${baseCss()}</style><style>:root{--header-offset:101px}</style>` }));
  await page.locator('product-gallery').evaluate((element) => element.closest('[data-section-id]').dispatchEvent(new CustomEvent('theme:variant-change', {
    bubbles: true, detail: { variant: { featured_media_id: '7' } },
  })));
  const after = await page.locator('[data-product-media-id="7"]').evaluate((element) => {
    const { top, bottom } = element.getBoundingClientRect();
    return { top, bottom, scrollY: window.scrollY };
  });
  expect(after.top).toBeGreaterThanOrEqual(101);
  expect(after.top).toBeLessThan(900);
  expect(after.bottom).toBeGreaterThan(900);
  expect(after.scrollY).toBe(0);
});

for (const width of [1440, 1536]) {
  test(`R4A-7 sticky cart bar appears below the primary button at ${width}x674`, async ({ page }) => {
    await page.setViewportSize({ width, height: 674 });
    const markup = `<div style="height:900px"></div><section data-section-id="product" class="product-main__layout">
      <product-gallery class="product-gallery" data-layout="grid" style="display:block;height:3000px"></product-gallery>
      <div class="product-main__details" style="height:800px">
        <form id="product-form-product"><button type="button" data-add-to-cart>Add to cart</button></form>
      </div>
      <sticky-cart-bar data-product-form-id="product-form-product" data-action-label-template="[action] [product]"
        data-quantity-label-template="[action] [product] [quantity]" data-quantity-price-template="[quantity] × [price]"
        data-total-template="Total [total]" data-unavailable-text="Unavailable" aria-hidden="true" inert>
        <p class="sticky-cart-bar__title">Jacket</p><p data-sticky-variant>Black</p><p data-sticky-price>$100</p>
        <p data-sticky-total hidden></p><button data-sticky-submit><span data-sticky-label>Add to cart</span></button>
      </sticky-cart-bar></section>`;
    await page.setContent(pageShell(markup, { head: `<style>${baseCss()}</style><style>:root{--header-offset:101px}</style>` }));
    const details = page.locator('.product-main__details');
    // At this height the column does not fit below the header: it must stay in flow, not sticky.
    await expect(details).not.toHaveAttribute('data-sticky-fits', '');
    expect(await details.evaluate((element) => getComputedStyle(element).position)).toBe('static');
    await expect(page.locator('sticky-cart-bar')).not.toHaveAttribute('data-visible', '');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(page.locator('sticky-cart-bar')).toHaveAttribute('data-visible', '');
    expect(await page.locator('[data-add-to-cart]').evaluate((button) => button.getBoundingClientRect().bottom)).toBeLessThanOrEqual(0);
  });
}

test('R4A-7 product details use sticky positioning in a tall 1440x1100 viewport', async ({ page }) => {
  await mount(page, 'product', { width: 1440, height: 1100 });
  const details = page.locator('.product-main__details');
  await expect(details).toHaveAttribute('data-sticky-fits', '');
  expect(await details.evaluate((element) => getComputedStyle(element).position)).toBe('sticky');
});

test('R4 C1b mobile keeps carousel DOM order and moves the index to the selected variant', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setContent(pageShell(productGallery, { head: `<style>${baseCss()}</style>` }));
  const gallery = page.locator('product-gallery');
  await gallery.evaluate((element) => element.closest('[data-section-id]').dispatchEvent(
    new CustomEvent('theme:variant-change', { bubbles: true, detail: { variant: { featured_media_id: '7' } } }),
  ));
  await expect(page.locator('[data-gallery-track]').locator(':scope > :first-child')).toHaveAttribute('data-product-media-id', '1');
  await expect(page.locator('[data-gallery-current]')).toHaveText('7');
  await expect(page.locator('[data-product-media-id="7"]')).not.toHaveAttribute('inert', '');
});

test('R4 C1b keeps zoom trigger indices tied to the original image order', async () => {
  const liquid = readFileSync(new URL('../sections/main-product.liquid', import.meta.url), 'utf8');
  expect(liquid).toContain("assign selected_media = product.media | where: 'id', selected_media_id");
  expect(liquid).toContain("assign gallery_media = selected_media | concat: remaining_media");
  expect(liquid).toContain('{%- for media in gallery_media -%}');
  expect(liquid).toContain('{%- for zoom_image in zoom_images -%}');
  expect(liquid).toContain('data-zoom-open="{{ zoom_index }}"');
  expect(liquid).toContain('{%- assign zoom_index = forloop.index0 -%}');
  expect(liquid).toContain('data-zoom-label-template=');
});

test('R4A-17 zoom labels follow the visual media order while modal indices keep the original order', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const zoomFigures = Array.from({ length: 7 }, (_, index) => `<figure class="product-gallery__item" data-product-media-id="${index + 1}">
    <button type="button" data-zoom-label-template="Zoom image [index] of [total]" aria-label="Zoom image ${index + 1} of 7"
      data-zoom-open="${index}">Open zoom ${index + 1}</button></figure>`).join('');
  await page.setContent(pageShell(`<section data-section-id="product"><product-gallery class="product-gallery" data-layout="grid">
    <div class="product-gallery__items" data-gallery-track>${zoomFigures}</div><div class="product-gallery__pager" data-gallery-pager>
      <span data-gallery-current>1</span><span data-gallery-status></span></div></product-gallery></section>`, {
    head: `<style>${baseCss()}</style>`,
  }));
  await page.locator('[data-product-media-id="7"]').evaluate((figure) => figure.closest('[data-section-id]').dispatchEvent(
    new CustomEvent('theme:variant-change', { bubbles: true, detail: { variant: { featured_media_id: '7' } } }),
  ));
  const selectedTrigger = page.locator('[data-product-media-id="7"] [data-zoom-open]');
  await expect(selectedTrigger).toHaveAttribute('aria-label', 'Zoom image 1 of 7');
  await expect(selectedTrigger).toHaveAttribute('data-zoom-open', '6');
  await expect(page.locator('[data-product-media-id="1"] [data-zoom-open]')).toHaveAttribute('aria-label', 'Zoom image 2 of 7');
});

test('R4 C1b featured product moves its selected medium to the DOM start on variant change', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const gallery = `<section data-section-id="featured"><div class="featured-product__gallery">
    ${mediaFigures()}</div><variant-selects class="featured-product__details"></variant-selects></section>`;
  await page.setContent(pageShell(gallery, { head: `<style>${baseCss()}</style>` }));
  await page.locator('variant-selects').evaluate((element) => element.updateMedia({ featured_media_id: '7' }));
  await expect(page.locator('.featured-product__gallery > :first-child')).toHaveAttribute('data-product-media-id', '7');
});

const responsiveMediaFigures = (count = 7, featured = false) => Array.from({ length: count }, (_, index) => {
  const sizes = index === 0
    ? `(min-width: 62rem) 60vw, ${featured ? '85vw' : '100vw'}`
    : `(min-width: 62rem) 30vw, ${featured ? '85vw' : '100vw'}`;
  return `<figure class="${featured ? 'featured-product__media' : 'product-gallery__item'}" data-product-media-id="${index + 1}">
    <picture><source sizes="${sizes}" srcset="/media-${index + 1}.webp"><img sizes="${sizes}" src="/media-${index + 1}.webp" alt="Media ${index + 1}"></picture></figure>`;
}).join('');

test('R4A-2 variant figure and its former lead exchange responsive sizes in the product grid', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setContent(pageShell(`<section data-section-id="product"><product-gallery class="product-gallery" data-layout="grid">
    <div class="product-gallery__items" data-gallery-track>${responsiveMediaFigures()}</div>
    <div class="product-gallery__pager" data-gallery-pager><span data-gallery-current>1</span><span data-gallery-status></span></div>
  </product-gallery><variant-selects></variant-selects></section>`, { head: `<style>${baseCss()}</style>` }));
  await page.locator('section').evaluate((section) => section.dispatchEvent(new CustomEvent('theme:variant-change', {
    bubbles: true, detail: { variant: { featured_media_id: '7' } },
  })));
  const selected = page.locator('[data-product-media-id="7"]');
  const formerLead = page.locator('[data-product-media-id="1"]');
  await expect(page.locator('[data-gallery-track] > :first-child')).toHaveAttribute('data-product-media-id', '7');
  await expect(selected.locator('img')).toHaveAttribute('sizes', '(min-width: 62rem) 60vw, 100vw');
  await expect(selected.locator('source')).toHaveAttribute('sizes', '(min-width: 62rem) 60vw, 100vw');
  await expect(formerLead.locator('img')).toHaveAttribute('sizes', '(min-width: 62rem) 30vw, 100vw');
  await expect(formerLead.locator('source')).toHaveAttribute('sizes', '(min-width: 62rem) 30vw, 100vw');
});

test('R4A-2 featured product exchanges responsive sizes with the selected figure', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setContent(pageShell(`<section data-section-id="featured"><div class="featured-product__gallery">
    ${responsiveMediaFigures(7, true)}</div><variant-selects class="featured-product__details"></variant-selects></section>`, {
    head: `<style>${baseCss()}</style>`,
  }));
  await page.locator('variant-selects').evaluate((element) => element.updateMedia({ featured_media_id: '7' }));
  const selected = page.locator('[data-product-media-id="7"]');
  const formerLead = page.locator('[data-product-media-id="1"]');
  await expect(selected.locator('img')).toHaveAttribute('sizes', '(min-width: 62rem) 60vw, 85vw');
  await expect(selected.locator('source')).toHaveAttribute('sizes', '(min-width: 62rem) 60vw, 85vw');
  await expect(formerLead.locator('img')).toHaveAttribute('sizes', '(min-width: 62rem) 30vw, 85vw');
  await expect(formerLead.locator('source')).toHaveAttribute('sizes', '(min-width: 62rem) 30vw, 85vw');
});
