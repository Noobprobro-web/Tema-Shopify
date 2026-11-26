import { expect, test } from '@playwright/test';
import { baseCss, pageShell } from './support/r3-support.mjs';

const square = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100"/></svg>')}`;
const video = `<video class="product-gallery__media" controls poster="${square}"></video>`;
const external = '<iframe class="product-gallery__media" title="External product video" srcdoc=""></iframe>';
const image = `<picture><img class="product-gallery__image" src="${square}" width="100" height="100" alt="Jacket"></picture>`;
const model = (arVisible = false) => `<div class="shopify-model-viewer-ui">
    <model-viewer class="product-gallery__media" tabindex="0"></model-viewer>
  </div>
  <button type="button" class="product-gallery__view-in-space" data-shopify-xr data-shopify-model3d-id="1"
    data-shopify-title="Jacket" ${arVisible ? '' : 'data-shopify-xr-hidden'}>View in your space</button>`;

async function mount(page, { width, height = 900, layout = 'grid', ratio = 1, media, longTitle = false }) {
  await page.setViewportSize({ width, height });
  const figures = media.map((medium, index) => `<figure class="product-gallery__item" data-product-media-id="${index + 1}">${medium}</figure>`);
  const title = longTitle ? 'Tailored jacket '.repeat(8).slice(0, 120) : 'Tailored jacket';
  await page.setContent(pageShell(`<section class="section product-main" data-section-id="fixture">
    <div class="container product-main__layout product-main__layout--${layout}">
      <product-gallery class="product-gallery" data-layout="${layout}" ${ratio === null ? '' : `style="--gallery-ratio: ${ratio}"`}>
        <div class="product-gallery__items" data-gallery-track>
          ${figures.join('') || '<div class="product-gallery__placeholder" aria-hidden="true"></div>'}
        </div>
      </product-gallery>
      <div class="product-main__details"><h1>${title}</h1></div>
    </div>
  </section>`, { head: `<style>${baseCss()}</style>` }));
}

async function bounds(locator) {
  const rect = await locator.boundingBox();
  expect(rect).not.toBeNull();
  return rect;
}

function withinPixel(actual, expected) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);
}

async function assertFills(figure, selector, ratio) {
  const figureRect = await bounds(figure);
  const mediaRect = await bounds(figure.locator(selector));
  withinPixel(mediaRect.width, figureRect.width);
  withinPixel(mediaRect.height, figureRect.height);
  withinPixel(mediaRect.height, mediaRect.width / ratio);
  return figureRect;
}

for (const width of [1440, 1536]) {
  test(`R5 D grid video and 3D fill their cells at ${width}px`, async ({ page }) => {
    await mount(page, { width, media: [model(), video, external, image] });
    const cells = page.locator('.product-gallery__item');
    const [modelCell, videoCell] = await Promise.all([bounds(cells.nth(0)), bounds(cells.nth(1))]);
    withinPixel(modelCell.y, videoCell.y);
    withinPixel(modelCell.height, videoCell.height);
    await assertFills(cells.nth(1), 'video', 1);
    await assertFills(cells.nth(0), 'model-viewer', 1);
    await assertFills(cells.nth(2), 'iframe', 1);
    await expect(cells.nth(1).locator('video')).toHaveCSS('object-fit', 'contain');
    await expect(page.getByRole('button', { name: 'View in your space', includeHidden: true })).toBeHidden();
  });
}

test('R5 D2 rich media follows a row made taller by a vertical photo at 1536px', async ({ page }) => {
  const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="200"><rect width="100" height="200"/></svg>')}`;
  const photo = `<picture><img class="product-gallery__image" src="${portrait}" width="100" height="200" alt="Vertical jacket photograph"></picture>`;
  const unwrappedModel = '<model-viewer class="product-gallery__media" tabindex="0"></model-viewer>';
  const pairs = [
    [model(), 'model-viewer'],
    [video, 'video'],
    [external, 'iframe'],
    [unwrappedModel, 'model-viewer'],
    [model(true), 'model-viewer'],
  ];
  await mount(page, { width: 1536, media: pairs.flatMap(([medium]) => [photo, medium]) });
  const cells = page.locator('.product-gallery__item');
  const photoCells = await Promise.all(pairs.map((_, index) => bounds(cells.nth(index * 2))));

  for (const [index, [, selector]] of pairs.entries()) {
    const photoCell = photoCells[index];
    const cell = cells.nth(index * 2 + 1);
    const medium = cell.locator(selector);
    const [cellRect, mediumRect] = await Promise.all([bounds(cell), bounds(medium)]);
    const xr = cell.getByRole('button', { name: 'View in your space' });
    const xrRect = await xr.isVisible() ? await bounds(xr) : null;

    withinPixel(photoCell.height, photoCell.width * 2);
    withinPixel(cellRect.y, photoCell.y);
    withinPixel(cellRect.height, photoCell.height);
    withinPixel(mediumRect.y, cellRect.y);
    withinPixel(mediumRect.width, cellRect.width);
    withinPixel(mediumRect.height + (xrRect?.height || 0), cellRect.height);
    if (xrRect) withinPixel(xrRect.y, mediumRect.y + mediumRect.height);
    if (selector === 'video') await expect(medium).toHaveCSS('object-fit', 'contain');
    if (selector === 'iframe') {
      expect(await medium.evaluate((frame) => frame.contentWindow.innerHeight)).toBe(
        await medium.evaluate((frame) => frame.clientHeight),
      );
    }
  }
});
test('R5 D keeps the first 3D model full width with an odd gallery and missing media ratio', async ({ page }) => {
  await mount(page, { width: 1536, ratio: null, media: [model(), ...Array.from({ length: 10 }, (_, index) => index % 2 ? external : video)], longTitle: true });
  const gallery = page.locator('product-gallery');
  const cells = gallery.locator('.product-gallery__item');
  await expect(cells).toHaveCount(11);
  expect((await page.getByRole('heading', { level: 1 }).textContent()).length).toBe(120);
  expect(await page.locator('.product-main__layout').evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(
    await page.locator('.product-main__layout').evaluate((element) => element.clientWidth),
  );
  const first = await assertFills(cells.first(), 'model-viewer', 0.8);
  withinPixel(first.width, (await bounds(gallery)).width);
  const lastVideo = await assertFills(cells.nth(9), 'video', 0.8);
  const lastExternal = await assertFills(cells.nth(10), 'iframe', 0.8);
  expect(lastVideo.width).toBeLessThan(first.width);
  withinPixel(lastVideo.y, lastExternal.y);
});

test('R5 D fits a single 3D viewer and preserves focus and the separate AR button', async ({ page }) => {
  await mount(page, { width: 1440, ratio: 1.5, media: [model(true)] });
  const cell = page.locator('.product-gallery__item');
  const viewer = cell.locator('model-viewer');
  const xr = page.getByRole('button', { name: 'View in your space' });
  await expect(xr).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(viewer).toBeFocused();
  await expect(viewer).toHaveCSS('outline-offset', '-4px');
  await page.keyboard.press('Tab');
  await expect(xr).toBeFocused();

  const [cellRect, viewerRect, xrRect] = await Promise.all([bounds(cell), bounds(viewer), bounds(xr)]);
  withinPixel(cellRect.width, (await bounds(page.locator('product-gallery'))).width);
  withinPixel(viewerRect.width, cellRect.width);
  withinPixel(viewerRect.height, viewerRect.width / 1.5);
  withinPixel(xrRect.y, viewerRect.y + viewerRect.height);
  withinPixel(cellRect.height, viewerRect.height + xrRect.height);
  expect(xrRect.height).toBeGreaterThanOrEqual(44);
});

test('R5 D retains the full-width placeholder on a product without media', async ({ page }) => {
  await mount(page, { width: 1440, media: [] });
  const gallery = page.locator('product-gallery');
  const placeholder = gallery.locator('.product-gallery__placeholder');
  await expect(gallery.locator('.product-gallery__item')).toHaveCount(0);
  withinPixel((await bounds(placeholder)).width, (await bounds(gallery)).width);
  expect((await bounds(placeholder)).height).toBeGreaterThan(0);
});

for (const { layout, width, height, modelMinHeight } of [
  { layout: 'split_screen', width: 1536, height: 900, modelMinHeight: '768px' },
  { layout: 'stack', width: 1536, height: 900, modelMinHeight: '768px' },
  { layout: 'grid', width: 390, height: 844, modelMinHeight: '384px' },
]) {
  test(`R5 D preserves the original ${layout} media geometry at ${width}px`, async ({ page }) => {
    await mount(page, { width, height, layout, ratio: 1.5, media: [model(), video] });
    const gallery = page.locator('product-gallery');
    const viewer = gallery.locator('model-viewer');
    await expect(viewer).toHaveCSS('aspect-ratio', 'auto');
    await expect(viewer).toHaveCSS('min-height', modelMinHeight);
    const videoRect = await bounds(gallery.locator('video'));
    withinPixel(videoRect.height, videoRect.width);
    const cells = gallery.locator('.product-gallery__item');
    const [first, second] = await Promise.all([bounds(cells.nth(0)), bounds(cells.nth(1))]);
    withinPixel(first.width, second.width);
    if (width === 390) {
      withinPixel(first.y, second.y);
      expect(second.x).toBeGreaterThanOrEqual(first.x + first.width);
      await expect(gallery.locator('[data-gallery-track]')).toHaveCSS('scroll-snap-type', 'x mandatory');
    } else {
      withinPixel(first.x, second.x);
      expect(second.y).toBeGreaterThanOrEqual(first.y + first.height);
    }
  });
}
