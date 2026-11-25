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
  await gallery.evaluate((element) => {
    element.scrollIntoView = (options) => { element.dataset.scrollBehavior = options.behavior; };
    element.closest('[data-section-id]').dispatchEvent(new CustomEvent('theme:variant-change', {
      bubbles: true, detail: { variant: { featured_media_id: '7' } },
    }));
  });
  await expect(page.locator('[data-gallery-track]').locator(':scope > :first-child')).toHaveAttribute('data-product-media-id', '7');
  await expect(page.locator('[data-media-control="7"]')).toBeFocused();
  expect(await gallery.getAttribute('data-scroll-behavior')).toBe('auto');
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
