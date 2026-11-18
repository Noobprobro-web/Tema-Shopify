import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { expect, test } from '@playwright/test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
const css = readFileSync(join(root, 'section-standard-b.css'), 'utf8');
const script = readFileSync(join(root, 'section-standard-b.js'), 'utf8');

const slides = [1, 2, 3, 4]
  .map(
    (n) => `<div class="slideshow__slide" data-slideshow-slide><div class="slideshow__content"><p>Slide ${n}</p></div></div>`
  )
  .join('');

const markup = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>:root{--tap-target-min:44px;--content-width:700px;--space-xs:4px;--space-sm:8px;--space-md:16px}
.visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}</style>
<style>${css}</style></head>
<body>
<theme-slideshow class="slideshow-wrapper" id="show" data-autoplay="false" data-delay="5000"
  data-pause-label="Pause" data-play-label="Play" data-status-template="Slide __current__ of __total__">
  <section class="section slideshow">
    <div class="slideshow__track" data-slideshow-track tabindex="0">${slides}</div>
    <p class="visually-hidden" aria-live="polite" aria-atomic="true" data-slideshow-status></p>
    <div class="slideshow__controls" data-slideshow-controls hidden>
      <div class="slideshow__nav">
        <button type="button" class="slideshow__arrow" aria-label="Previous" data-slideshow-previous></button>
        <button type="button" class="slideshow__arrow" aria-label="Next" data-slideshow-next></button>
      </div>
      <ul class="slideshow__dots unstyled-list">
        ${[1, 2, 3, 4].map(() => '<li><button type="button" class="slideshow__dot" data-slideshow-dot></button></li>').join('')}
      </ul>
    </div>
  </section>
</theme-slideshow>
<script>${script}</script>
</body></html>`;

const activeIndex = (page) =>
  page.evaluate(() => [...document.querySelectorAll('[data-slideshow-slide]')].findIndex((s) => s.hasAttribute('data-active')));

test.describe('slideshow connection lifecycle', () => {
  test.use({ viewport: { width: 800, height: 700 } });

  test.beforeEach(async ({ page }) => {
    await page.setContent(markup);
    await expect(page.locator('#show')).toHaveAttribute('data-ready', '');
  });

  test('next advances exactly one slide after the node is moved and reconnected', async ({ page }) => {
    await page.evaluate(() => {
      const node = document.getElementById('show');
      for (let round = 0; round < 3; round += 1) {
        const parent = node.parentNode;
        node.remove();
        parent.insertBefore(node, parent.firstChild);
      }
    });
    await expect(page.locator('#show')).toHaveAttribute('data-ready', '');
    expect(await activeIndex(page)).toBe(0);

    await page.locator('[data-slideshow-next]').click();
    await expect.poll(() => activeIndex(page)).toBe(1);
    // Duplicated listeners would have moved past slide 2 by now.
    await page.waitForTimeout(400);
    expect(await activeIndex(page)).toBe(1);
  });

  test('announces the slide only when the visitor navigates', async ({ page }) => {
    const status = page.locator('[data-slideshow-status]');
    await expect(status).toHaveText('');
    await page.locator('[data-slideshow-next]').click();
    await expect(status).toHaveText('Slide 2 of 4');
    await page.locator('[data-slideshow-dot]').nth(3).click();
    await expect(status).toHaveText('Slide 4 of 4');
  });
});
