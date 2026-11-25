// R3 regressions about dialogs, overlays and focus: AS-01, FB-04, FB-21, FB-35.
// No store needed: the real assets/theme.js runs against minimal markup that mirrors the Liquid.
import { expect, test } from '@playwright/test';
import {
  afterFrames,
  cartDrawerMarkup,
  gate,
  headerCartLink,
  mountPage,
  optionRadios,
  pageShell,
  variantJsonScript,
  variantRecord,
} from './support/r3-support.mjs';

const hiddenRule = '<style>[hidden]{display:none!important}</style>';

// ---------------------------------------------------------------------------------------------
// AS-01: opening the pickup panel while the variant request is in flight.
// ---------------------------------------------------------------------------------------------
// snippets/pickup-availability.liquid, with the dialog markup the section request returns.
const pickupMarkup = (label) => `
  <div class="pickup-availability__content" data-pickup-content>
    <div class="pickup-availability__summary" aria-live="polite">
      <button class="pickup-availability__open js-only" type="button" aria-controls="PickupAvailability-s1-Drawer"
        aria-expanded="false" aria-haspopup="dialog" data-pickup-open>${label}</button>
    </div>
    <div class="pickup-availability__overlay" data-pickup-overlay>
      <section id="PickupAvailability-s1-Drawer" class="pickup-availability__drawer" role="dialog" aria-modal="false"
        aria-hidden="false" tabindex="-1" data-pickup-panel>
        <header><h2>Pickup</h2>
          <button class="icon-button js-only" type="button" aria-label="Close" data-pickup-close>x</button></header>
        <ul><li><a href="/pages/stores">Store details</a></li></ul>
      </section>
    </div>
  </div>`;

test.describe('AS-01 pickup panel and the variant request', () => {
  test('AS-01 opening the panel while the variant request is in flight leaves no trap, inert page or scroll lock', async ({ page }) => {
    const variants = [variantRecord({ id: 1, options: ['A'] }), variantRecord({ id: 2, options: ['B'] })];
    const response = gate();
    const requested = gate();
    const html = pageShell(`${hiddenRule}
      <header><a href="/pages/about">Header link</a></header>
      <main>
        <variant-selects data-product-url="/products/p" data-initial-variant-id="1">
          ${optionRadios(variants, 1)}
          <pickup-availability class="pickup-availability" data-product-url="/products/p" data-section-id="s1"
            data-variant-id="1" data-update-error="Could not update">${pickupMarkup('Check A')}</pickup-availability>
          ${variantJsonScript(variants)}
        </variant-selects>
        <button id="after" type="button">After</button>
      </main>`);

    await mountPage(page, html, {
      path: '/products/p',
      onRequest: async (route, url) => {
        if (url.pathname !== '/products/p' || url.searchParams.get('section_id') !== 's1') return false;
        requested.open();
        await response.promise;
        await route.fulfill({
          contentType: 'text/html',
          body: `<html><body><pickup-availability class="pickup-availability" data-product-url="/products/p"
            data-section-id="s1" data-variant-id="2">${pickupMarkup('Check B')}</pickup-availability></body></html>`,
        });
        return true;
      },
    });

    const pickup = page.locator('pickup-availability');
    // Change the variant through the real picker; the request is now parked on the gate.
    await page.locator('#Size-2').check();
    await requested.promise;
    await expect(pickup).toHaveAttribute('aria-busy', 'true');

    // The shopper presses the old panel's button while the content is about to be replaced.
    await page.locator('[data-pickup-open]').click();
    await expect(pickup, 'the panel must not open while its content is being replaced').not.toHaveAttribute('data-open', '');

    response.open();
    await expect(pickup).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('[data-pickup-open]')).toHaveText('Check B');

    // Nothing is left locked behind the replaced panel: no scroll lock, no inert page.
    await expect(page.locator('body')).not.toHaveAttribute('data-modal-open', '');
    await expect(page.locator('[inert]:not([data-pickup-panel])')).toHaveCount(0);

    // The new panel still works as a dialog: it opens, traps Tab and closes with Escape.
    await page.locator('[data-pickup-open]').click();
    await expect(pickup).toHaveAttribute('data-open', '');
    for (let press = 0; press < 3; press += 1) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => Boolean(document.activeElement.closest('[data-pickup-panel]')))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(pickup).not.toHaveAttribute('data-open', '');
    await expect(page.locator('body')).not.toHaveAttribute('data-modal-open', '');
    await expect(page.locator('[inert]:not([data-pickup-panel])')).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------------------------
// FB-04: tapping the backdrop of a dialog must not click what lies underneath.
// ---------------------------------------------------------------------------------------------
const overlayStyle = `<style>
  [hidden]{display:none!important}
  #under{position:fixed;left:0;top:0;width:120px;height:120px}
  .backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4)}
  .panel{position:absolute;left:50%;top:50%;width:260px;height:180px;margin:-90px 0 0 -130px;background:#fff}
</style>`;

// Each entry mirrors the dialog markup of its Liquid file; `open` is the real trigger.
const backdropDialogs = [
  {
    id: 'size guide',
    open: '[data-size-guide-open]',
    markup: `<size-guide-modal class="size-guide" data-default-unit="cm">
      <button class="size-guide__trigger" type="button" aria-expanded="false" aria-haspopup="dialog"
        aria-controls="SizeGuide" data-size-guide-open>Size guide</button>
      <div class="size-guide-modal__overlay backdrop" data-size-guide-overlay hidden>
        <section id="SizeGuide" class="size-guide-modal__panel panel" role="dialog" aria-modal="true" aria-hidden="true"
          tabindex="-1" data-size-guide-panel inert>
          <header><button class="icon-button" type="button" aria-label="Close" data-size-guide-close>x</button></header>
        </section>
      </div>
    </size-guide-modal>`,
  },
  {
    id: 'password',
    open: '[data-password-open]',
    markup: `<password-modal><section>
      <button class="main-password__access-trigger js-only" type="button" aria-controls="PasswordModal"
        aria-expanded="false" data-password-open>Enter using password</button>
      <div class="password-modal__overlay backdrop" data-password-overlay>
        <section id="PasswordModal" class="password-modal__panel panel" role="dialog" aria-modal="false"
          aria-hidden="false" tabindex="-1" data-password-panel>
          <button class="icon-button password-modal__close js-only" type="button" aria-label="Close" data-password-close>x</button>
          <form action="/password" method="post"><input type="password" name="password" aria-label="Password"></form>
        </section>
      </div>
    </section></password-modal>`,
  },
  {
    id: 'predictive search',
    open: '[data-predictive-search-open]',
    markup: `<predictive-search class="predictive-search js-only" data-predictive-search-url="/search/suggest"
      data-search-url="/search" data-money-format="\${{amount}}">
      <button class="icon-button predictive-search__trigger" type="button" aria-label="Search" aria-expanded="false"
        aria-controls="PredictiveSearchPanel" data-predictive-search-open>Search</button>
      <div class="predictive-search__overlay backdrop" data-predictive-search-overlay hidden>
        <div id="PredictiveSearchPanel" class="predictive-search__panel panel" role="dialog" aria-modal="true"
          aria-label="Search" aria-hidden="true" tabindex="-1" data-predictive-search-panel inert>
          <button class="icon-button" type="button" aria-label="Close" data-predictive-search-close>x</button>
          <form data-predictive-search-form><input type="text" name="q" data-predictive-search-input></form>
          <div data-predictive-search-results hidden></div>
        </div>
      </div>
    </predictive-search>`,
  },
];

test.describe('FB-04 backdrop tap does not click through', () => {
  test.use({ hasTouch: true, viewport: { width: 600, height: 500 } });

  for (const dialog of backdropDialogs) {
    test(`FB-04 tapping the ${dialog.id} backdrop closes it and the synthesized click never reaches the page`, async ({ page }) => {
      const html = pageShell(`${hiddenRule}${overlayStyle}
        <button id="under" type="button" onclick="window.__underClicks = (window.__underClicks || 0) + 1">Under</button>
        <div style="margin-top:200px">${dialog.markup}</div>`);
      await mountPage(page, html);

      const host = page.locator(dialog.open).locator('xpath=ancestor::*[contains(local-name(), "-")][1]');
      await page.locator(dialog.open).click();
      await expect(host).toHaveAttribute('data-open', '');

      // A real touch tap on the backdrop, at a point that has the page button underneath.
      await page.touchscreen.tap(20, 20);
      await expect(host).not.toHaveAttribute('data-open', '');

      // The click that a tap synthesizes after pointerdown would land on #under now that the
      // backdrop is hidden. Give the browser its frames, then look at what the page received.
      await afterFrames(page);
      expect(await page.evaluate(() => window.__underClicks || 0)).toBe(0);
    });
  }
});

// ---------------------------------------------------------------------------------------------
// FB-21: after a failed add (422) focus returns to the button that submitted.
// ---------------------------------------------------------------------------------------------
test.describe('FB-21 focus after a rejected add', () => {
  test('FB-21 after a 422 the focus is handed back to the add button, which is usable again', async ({ page }) => {
    const variants = [variantRecord({ id: 11, options: ['A'] })];
    const requested = gate();
    const response = gate();
    const html = pageShell(`${hiddenRule}${headerCartLink}
      <variant-selects data-product-url="/products/p" data-initial-variant-id="11"
        data-add-to-cart-text="Add to cart" data-sold-out-text="Sold out" data-unavailable-text="Unavailable">
        ${optionRadios(variants, 11)}
        <form method="post" action="/cart/add" id="product-form" class="product-form__form" data-cart-add-form>
          <input type="hidden" name="id" value="11" data-variant-id>
          <input type="number" name="quantity" value="1" min="1" data-quantity-input>
          <button id="atc" class="button button--full product-form__submit" type="submit" name="add" data-add-to-cart>
            <span data-add-to-cart-text>Add to cart</span>
            <span class="button__spinner" data-loading-icon hidden>...</span>
          </button>
          <p class="form-message" role="alert" data-product-form-error hidden></p>
        </form>
        ${variantJsonScript(variants)}
      </variant-selects>
      ${cartDrawerMarkup()}`);

    await mountPage(page, html, {
      path: '/products/p',
      onRequest: async (route, url) => {
        if (url.pathname === '/cart/add.js') {
          requested.open();
          await response.promise;
          await route.fulfill({
            status: 422,
            contentType: 'application/json',
            body: JSON.stringify({ status: 422, message: 'Cart Error', description: 'All 3 are in your cart.' }),
          });
          return true;
        }
        if (url.pathname === '/cart.js') {
          await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ items: [], item_count: 0 }) });
          return true;
        }
        return false;
      },
    });

    await page.locator('#atc').focus();
    await page.keyboard.press('Enter');
    await requested.promise;
    // While the request runs the button is disabled and the browser drops focus to the body.
    await expect(page.locator('#atc')).toBeDisabled();

    response.open();
    await expect(page.locator('[data-product-form-error]')).toHaveText('All 3 are in your cart.');
    await expect(page.locator('#atc')).toBeEnabled();
    await expect(page.locator('#atc')).toBeFocused();
  });
});

// ---------------------------------------------------------------------------------------------
// FB-35: the no-JS submit button is removed once JavaScript runs.
// ---------------------------------------------------------------------------------------------
test.describe('FB-35 no-JavaScript submit button', () => {
  test('FB-35 with JavaScript only the enhanced add button remains and Enter submits through it', async ({ page }) => {
    const variants = [variantRecord({ id: 5, options: ['A'] })];
    // snippets/product-submit-button.liquid prints this pair for a sold-out selection without
    // links: the plain button first, then the enhanced one.
    const html = pageShell(`${hiddenRule}
      <variant-selects data-product-url="/products/p" data-initial-variant-id="5"
        data-add-to-cart-text="Add to cart" data-sold-out-text="Sold out" data-unavailable-text="Unavailable">
        ${optionRadios(variants, 5)}
        <form method="post" action="/cart/add" id="product-form" data-cart-add-form>
          <input type="hidden" name="id" value="5" data-variant-id>
          <input id="qty" type="text" name="quantity" value="1" data-quantity-input>
          <button class="button button--full product-form__submit no-js-only" type="submit" name="add">Add to cart</button>
          <button class="button button--full product-form__submit js-only" type="submit" name="add" data-add-to-cart>
            <span data-add-to-cart-text>Add to cart</span>
            <span class="button__spinner" data-loading-icon hidden>...</span>
          </button>
        </form>
        ${variantJsonScript(variants)}
      </variant-selects>`);
    await mountPage(page, html, { path: '/products/p' });

    // Record which button submits; the form is not sent anywhere.
    await page.evaluate(() => {
      document.addEventListener('submit', (event) => {
        event.preventDefault();
        window.__submitter = event.submitter?.hasAttribute('data-add-to-cart') ? 'enhanced' : 'other';
      });
    });

    await expect(page.locator('button.no-js-only')).toHaveCount(0);
    await expect(page.locator('[data-add-to-cart]')).toBeEnabled();

    await page.locator('#qty').focus();
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => window.__submitter)).toBe('enhanced');
  });
});
