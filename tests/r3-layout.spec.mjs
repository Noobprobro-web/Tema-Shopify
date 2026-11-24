// R3 layout regressions measured with the real stylesheets (assets/base.css and
// assets/section-standard-a.css): FB-06, FB-07, FB-08, FB-13, FB-16, FB-17 and the cart rewards
// and quantity rule rules. No store and no JavaScript: minimal markup that mirrors the Liquid.
// Viewports follow the original measurements: 1440 and 390 wide, plus 320 for the narrowest case.
import { expect, test } from '@playwright/test';
import { baseCss, standardACss } from './support/r3-support.mjs';

const mount = (page, body) =>
  page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>${baseCss()}</style><style>${standardACss()}</style></head>
<body><main>${body}</main></body></html>`);

// Width of an element, and of the first match of `selector`, in CSS pixels.
const box = (page, selector, index = 0) =>
  page.locator(selector).nth(index).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
  });

const noHorizontalScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

// A product card as snippets/product-card.liquid prints it (only the parts that take space here).
const productCard = (title) => `<article class="product-card">
  <div class="product-card__media" style="aspect-ratio:4/5"></div>
  <div class="product-card__content">
    <h3 class="product-card__title"><a href="/products/x" data-card-link>${title}</a></h3>
  </div>
</article>`;

const longWord = 'Kaschmirrollkragenpulloverdunkelblauextralang';

// ---------------------------------------------------------------------------------------------
test.describe('FB-07 long product titles', () => {
  for (const width of [390, 320]) {
    test(`FB-07 a very long unbroken title breaks inside a two-column card at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await mount(page, `<section class="section std-section" style="--std-columns-mobile: 2">
        <div class="std-section__inner"><ul class="std-grid">
          <li class="product-grid__item">${productCard(longWord)}</li>
          <li class="product-grid__item">${productCard('B')}</li>
        </ul></div></section>`);

      expect(await noHorizontalScroll(page), 'the page must not scroll sideways').toBe(true);
      const item = await box(page, '.product-grid__item', 0);
      const link = await box(page, '.product-card__title a', 0);
      expect(link.right, 'the title stays inside its own card').toBeLessThanOrEqual(item.right + 1);
      // The second card keeps its own column instead of being pushed out by the first one.
      const sibling = await box(page, '.product-grid__item', 1);
      expect(sibling.left).toBeGreaterThanOrEqual(item.right - 1);
      expect(sibling.right).toBeLessThanOrEqual(width + 1);
    });
  }
});

// ---------------------------------------------------------------------------------------------
test.describe('FB-08 a lone card in a std-grid', () => {
  // featured-collection.liquid asks for 4 / 3 / 2 columns and prints std-grid--single for one card.
  for (const width of [1440, 800, 390]) {
    test(`FB-08 the single card takes the whole capped track at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await mount(page, `<section class="section std-section featured-collection"
        style="--std-columns-mobile: 2; --std-columns-tablet: 3; --std-columns-desktop: 4;">
        <div class="std-section__inner container"><ul class="std-grid std-grid--single">
          <li class="product-grid__item">${productCard('One')}</li>
        </ul></div></section>`);

      const grid = await box(page, '.std-grid');
      const card = await box(page, '.std-grid > li');
      expect(grid.width, 'capped at 28rem (448px)').toBeLessThanOrEqual(448 + 0.5);
      expect(card.width, 'one track: the card is as wide as the grid').toBeGreaterThanOrEqual(grid.width - 1);
      if (width > 600) expect(card.width).toBeGreaterThan(400);
    });
  }
});

// ---------------------------------------------------------------------------------------------
test.describe('FB-13 legal page without an index', () => {
  const policy = `<section class="section main-policy"><div class="container container--narrow">
    <div class="main-policy__layout">
      <anchor-nav class="main-policy__nav" hidden><nav><ol class="anchor-nav__list unstyled-list"><li><a href="#a">A</a></li></ol></nav></anchor-nav>
      <div id="MainPolicyBody" class="main-policy__body rte"><h2 id="a">Terms</h2><p>${'Legal text. '.repeat(40)}</p></div>
    </div></div></section>`;

  test('FB-13 with the index hidden the text uses the full width; once it shows, two columns return', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await mount(page, policy);

    const layout = await box(page, '.main-policy__layout');
    const body = await box(page, '.main-policy__body');
    // The body is capped at a 70ch reading measure; with no index it must reach that measure (or the
    // whole layout when that is narrower) instead of being squeezed into a narrow second column.
    const measure = await page.locator('.main-policy__body').evaluate((element) => {
      const probe = document.createElement('div');
      probe.style.cssText = `width:70ch;font-size:${getComputedStyle(element).fontSize};visibility:hidden`;
      element.parentElement.append(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      return width;
    });
    expect(body.width, 'body keeps its full reading measure while the index is hidden')
      .toBeGreaterThanOrEqual(Math.min(layout.width, measure) - 1);

    await page.locator('.main-policy__nav').evaluate((nav) => nav.removeAttribute('hidden'));
    const withIndex = await box(page, '.main-policy__body');
    const nav = await box(page, '.main-policy__nav');
    expect(withIndex.width, 'the index takes its own column').toBeLessThan(layout.width * 0.85);
    expect(nav.right).toBeLessThanOrEqual(withIndex.left + 1);
  });
});

// ---------------------------------------------------------------------------------------------
test.describe('FB-16 embeds in rich text', () => {
  test('FB-16 a video iframe is capped to the column and keeps a 16:9 box; other embeds only get capped', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await mount(page, `<div class="container"><div class="rte">
      <iframe id="video" src="https://www.youtube.com/embed/abc" width="560" height="315"></iframe>
      <iframe id="map" src="https://www.google.com/maps/embed?pb=x" width="600" height="450"></iframe>
    </div></div>`);

    expect(await noHorizontalScroll(page)).toBe(true);
    const column = await box(page, '.rte');
    const video = await box(page, '#video');
    expect(video.width).toBeLessThanOrEqual(column.width + 0.5);
    expect(video.width / video.height).toBeCloseTo(16 / 9, 1);

    const map = await box(page, '#map');
    expect(map.width).toBeLessThanOrEqual(column.width + 0.5);
    expect(map.height, 'a map keeps the height its markup asks for').toBeGreaterThan(400);
  });
});

// ---------------------------------------------------------------------------------------------
// sections/bento-discovery.liquid writes data-count (blocks that will draw something).
const bentoItem = {
  featured: `<div class="bento-discovery__item bento-discovery__item--featured">
    <a class="bento-card bento-card--featured" href="/collections/all"><div style="height:140px"></div></a></div>`,
  editorial: `<div class="bento-discovery__item bento-discovery__item--editorial">
    <div class="bento-card bento-card--editorial"><div style="height:140px"></div></div></div>`,
  product: `<div class="bento-discovery__item bento-discovery__item--product">${productCard('Item')}</div>`,
};

const bento = (kinds) => `<section class="section bento-discovery"><div class="bento-discovery__inner">
  <div class="bento-discovery__grid" data-count="${kinds.length}">${kinds.map((kind) => bentoItem[kind]).join('')}</div>
</div></section>`;

const bentoRects = (page) =>
  page.locator('.bento-discovery__item').evaluateAll((items) =>
    items.map((item) => {
      const rect = item.getBoundingClientRect();
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
    }));

test.describe('FB-17 bento grid adapts to the number of blocks', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('FB-17 one block spans the whole grid', async ({ page }) => {
    await mount(page, bento(['featured']));
    const grid = await box(page, '.bento-discovery__grid');
    const [only] = await bentoRects(page);
    expect(only.width).toBeGreaterThanOrEqual(grid.width - 1);
  });

  test('FB-17 two blocks share one row in two equal columns', async ({ page }) => {
    await mount(page, bento(['featured', 'editorial']));
    const grid = await box(page, '.bento-discovery__grid');
    const [first, second] = await bentoRects(page);
    expect(Math.abs(first.top - second.top), 'same row').toBeLessThanOrEqual(1);
    expect(Math.abs(first.width - second.width), 'equal columns').toBeLessThanOrEqual(2);
    expect(second.right).toBeGreaterThanOrEqual(grid.right - 1);
  });

  test('FB-17 three blocks keep the tall collection card on the left; a fourth runs full width below', async ({ page }) => {
    await mount(page, bento(['featured', 'editorial', 'product']));
    const three = await bentoRects(page);
    expect(Math.abs(three[0].top - three[1].top)).toBeLessThanOrEqual(1);
    expect(three[2].top, 'the third block sits under the second').toBeGreaterThan(three[1].bottom - 1);
    expect(three[0].height, 'the collection card spans both rows').toBeGreaterThanOrEqual(three[1].height + three[2].height);

    await mount(page, bento(['featured', 'editorial', 'product', 'product']));
    const grid = await box(page, '.bento-discovery__grid');
    const four = await bentoRects(page);
    expect(four[3].width, 'the fourth block spans the full width').toBeGreaterThanOrEqual(grid.width - 1);
    expect(four[3].top, 'and sits below the other three').toBeGreaterThanOrEqual(Math.max(four[0].bottom, four[2].bottom) - 1);
  });

  // Four blocks where the collection card is not the first one: a clean 2x2 with no empty cell.
  for (const kinds of [
    ['editorial', 'product', 'product', 'product'],
    ['editorial', 'product', 'product', 'featured'],
    ['editorial', 'featured', 'product', 'product'],
  ]) {
    test(`FB-17 four blocks (${kinds.join(', ')}) fill a 2x2 with no gap`, async ({ page }) => {
      await mount(page, bento(kinds));
      const grid = await box(page, '.bento-discovery__grid');
      const [a, b, c, d] = await bentoRects(page);
      expect(Math.abs(a.top - b.top), 'first row').toBeLessThanOrEqual(1);
      expect(Math.abs(c.top - d.top), 'second row').toBeLessThanOrEqual(1);
      expect(c.top, 'second row sits under the first').toBeGreaterThanOrEqual(Math.max(a.bottom, b.bottom) - 1);
      expect(Math.abs(a.left - c.left), 'same first column').toBeLessThanOrEqual(1);
      expect(Math.abs(b.left - d.left), 'same second column').toBeLessThanOrEqual(1);
      expect(d.right, 'the last cell reaches the right edge').toBeGreaterThanOrEqual(grid.right - 1);
      expect(d.width, 'and is not stretched over the row').toBeLessThan(grid.width - 100);
    });
  }

  test('FB-17 a collection card in the last of three blocks is a regular tile and the odd block takes the row', async ({ page }) => {
    await mount(page, bento(['editorial', 'product', 'featured']));
    const grid = await box(page, '.bento-discovery__grid');
    const [first, second, third] = await bentoRects(page);
    expect(Math.abs(first.top - second.top)).toBeLessThanOrEqual(1);
    expect(third.width, 'no half-empty row').toBeGreaterThanOrEqual(grid.width - 1);
    expect(third.top).toBeGreaterThanOrEqual(Math.max(first.bottom, second.bottom) - 1);
  });

  test('FB-17 without a collection card an odd last block takes the whole row', async ({ page }) => {
    await mount(page, bento(['editorial', 'product', 'product']));
    const grid = await box(page, '.bento-discovery__grid');
    const [first, second, third] = await bentoRects(page);
    expect(Math.abs(first.top - second.top)).toBeLessThanOrEqual(1);
    expect(third.width).toBeGreaterThanOrEqual(grid.width - 1);
    expect(third.top).toBeGreaterThanOrEqual(Math.max(first.bottom, second.bottom) - 1);
  });
});

// ---------------------------------------------------------------------------------------------
test.describe('FB-06 curated showcase with a single product', () => {
  const panel = (single) => `<section class="section curated-showcase"><div class="container">
    <div class="curated-showcase__panels">
      <div class="curated-showcase__panel${single ? ' curated-showcase__panel--single' : ''}" role="tabpanel">
        <article class="curated-showcase__spotlight">
          <a class="curated-showcase__spotlight-media" href="/products/x"></a>
          <div class="curated-showcase__spotlight-details"><h3 class="curated-showcase__spotlight-title">Spotlight</h3></div>
        </article>
        ${single ? '' : '<div class="curated-showcase__supporting"><div style="height:200px"></div></div>'}
      </div>
    </div></div></section>`;

  test('FB-06 a lone spotlight is capped at 44rem, centered and shorter; two products keep the wide layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await mount(page, panel(true));
    const panels = await box(page, '.curated-showcase__panels');
    const single = await box(page, '.curated-showcase__panel');
    const media = await box(page, '.curated-showcase__spotlight-media');
    expect(single.width, '44rem').toBeCloseTo(704, 0);
    expect(single.left - panels.left, 'centered').toBeCloseTo((panels.width - 704) / 2, 0);
    expect(media.width / media.height, 'box of 4:3').toBeCloseTo(4 / 3, 1);

    await mount(page, panel(false));
    const wide = await box(page, '.curated-showcase__panel');
    expect(wide.width, 'with supporting cards the panel keeps the full container').toBeGreaterThan(900);
  });
});

// ---------------------------------------------------------------------------------------------
test.describe('Cart rewards with a single stage', () => {
  const rewards = (labels) => `<div style="width:380px"><div class="cart-rewards">
    <div class="cart-rewards__milestones" aria-hidden="true">${labels.map((label) => `<span>${label}</span>`).join('')}</div>
  </div></div>`;

  test('a single milestone label sits at the end of the bar, where its marker is; two labels keep both ends', async ({ page }) => {
    await mount(page, rewards(['Free shipping at $50']));
    const bar = await box(page, '.cart-rewards__milestones');
    const only = await box(page, '.cart-rewards__milestones span');
    expect(only.right, 'at the end of the bar').toBeGreaterThanOrEqual(bar.right - 1);

    await mount(page, rewards(['Free shipping at $50', 'Gift at $100']));
    const pair = await box(page, '.cart-rewards__milestones');
    const first = await box(page, '.cart-rewards__milestones span', 0);
    const last = await box(page, '.cart-rewards__milestones span', 1);
    expect(first.left, 'first label stays at the start').toBeLessThanOrEqual(pair.left + 1);
    expect(last.right, 'last label stays at the end').toBeGreaterThanOrEqual(pair.right - 1);
  });
});

// ---------------------------------------------------------------------------------------------
test.describe('Quantity rule text', () => {
  test('each visible part of the quantity rule takes its own line and hidden parts take none', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await mount(page, `<div class="container"><p class="product-form__tax-note product-form__quantity-rule" data-quantity-rule>
      <span data-quantity-rule-part="min">Minimum of 6</span>
      <span data-quantity-rule-part="increment">Sold in multiples of 6</span>
      <span data-quantity-rule-part="max" hidden></span>
    </p></div>`);

    const minimum = await box(page, '[data-quantity-rule-part="min"]');
    const increment = await box(page, '[data-quantity-rule-part="increment"]');
    expect(increment.top, 'the second part starts below the first').toBeGreaterThanOrEqual(minimum.bottom - 1);
    await expect(page.locator('[data-quantity-rule-part="max"]')).toBeHidden();
  });
});
