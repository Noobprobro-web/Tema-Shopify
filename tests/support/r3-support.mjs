// Shared plumbing for the R3 regression specs (tests/r3-*.spec.mjs).
//
// These specs need no store: they load the real theme assets from this repository and mount
// minimal HTML on a fake origin whose requests are answered through page.route(). The markup
// fixtures mirror what the Liquid files emit (data-* hooks, classes, structure); when a Liquid
// file changes a hook, the fixture below must follow it.
//
// Mutation checks: each asset can be swapped for another build through an optional environment
// variable (R3_THEME_JS, R3_BASE_CSS, R3_STANDARD_A_CSS). When the variable is not set, the
// assets of this repository are always used.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const assetsDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets');

const readAsset = (name, overrideVariable) =>
  readFileSync(process.env[overrideVariable] || join(assetsDir, name), 'utf8');

export const themeJs = () => readAsset('theme.js', 'R3_THEME_JS');
export const baseCss = () => readAsset('base.css', 'R3_BASE_CSS');
export const standardACss = () => readAsset('section-standard-a.css', 'R3_STANDARD_A_CSS');

export const ORIGIN = 'http://theme.test';

// A document that carries theme.js at the end of the body, the way layout/theme.liquid loads it.
export const pageShell = (body, { head = '' } = {}) => `<!doctype html>
<html lang="en" class="js"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">${head}</head>
<body>${body}<script>${themeJs()}</script></body></html>`;

// Serves `html` for the document and hands every other request to `onRequest(route, url)`, which
// returns true when it fulfilled the request. Anything unhandled answers 404 so a missing route
// shows up as a failed assertion instead of a hang.
export async function mountPage(page, html, { path = '/', onRequest } = {}) {
  await page.route(`${ORIGIN}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (onRequest && (await onRequest(route, url))) return;
    if (route.request().resourceType() === 'document' && url.pathname === path) {
      return route.fulfill({ contentType: 'text/html', body: html });
    }
    return route.fulfill({ status: 404, contentType: 'text/plain', body: 'not found' });
  });
  await page.goto(`${ORIGIN}${path}`);
}

// A promise that the test resolves by hand: holds a response until the scenario is ready for it.
export const gate = () => {
  let open;
  const promise = new Promise((resolve) => {
    open = resolve;
  });
  return { promise, open };
};

// Two frames: lets code that restores focus in requestAnimationFrame run before the assertion.
export const afterFrames = (page) =>
  page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

// The Liquid shows the cart drawer through this exact element (sections/cart-drawer.liquid). Only
// the data the scenarios need is variable; hooks, classes and nesting follow the section.
export const cartDrawerMarkup = ({ quantity = 1, note = '' } = {}) => `<cart-drawer
  class="cart-drawer color-scheme-1" data-section-id="cart-drawer"
  data-cart-url="/cart" data-cart-add-url="/cart/add.js" data-cart-change-url="/cart/change.js"
  data-item-count="${quantity}" data-cart-count-label="${quantity} items"
  data-error-message="Something went wrong" data-added-message="Added to cart"
  data-removed-template="Removed [title]"
  data-quantity-updated-template="Updated [title] to [quantity]"
  data-add-failed-message="Could not add" data-cart-update-url="/cart/update.js"
  data-recommendations-url="/recommendations/products"
  data-update-unconfirmed-message="Unconfirmed" data-saving-note-message="Saving"
  data-note-unconfirmed-message="Note unconfirmed">
  <div class="cart-drawer__overlay" data-cart-drawer-overlay hidden>
    <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-hidden="true"
      aria-labelledby="CartDrawerTitle" tabindex="-1" data-cart-drawer-panel inert>
      <header class="cart-drawer__header">
        <div>
          <p class="eyebrow" data-cart-drawer-count>${quantity} items</p>
          <h2 id="CartDrawerTitle" class="cart-drawer__title" tabindex="-1">Cart</h2>
        </div>
        <button class="icon-button" type="button" aria-label="Close" data-cart-drawer-close>x</button>
      </header>
      <p class="cart-drawer__message" role="status" aria-live="polite" data-cart-status hidden></p>
      <p class="cart-drawer__message" role="alert" data-cart-error hidden></p>
      <div class="cart-drawer__uncertain" data-cart-uncertain hidden>
        <button type="button" class="button button--secondary cart-drawer__check" data-cart-check>Check cart</button>
      </div>
      <div class="cart-drawer__content" data-cart-drawer-content>
        ${quantity === 0 ? `<div class="cart-drawer__empty flow">
          <p tabindex="-1" data-cart-empty-message>Your cart is empty</p>
          <a class="button" href="/collections/all">Continue shopping</a>
        </div>` : `<form id="CartCrossSellOptions-cart-drawer" hidden></form>
        <form class="cart-drawer__form" action="/cart" method="post" data-cart-form>
          <div class="cart-drawer__scroll" data-cart-scroll>
            <div class="cart-drawer__items" role="list">
              <div class="cart-drawer-item" role="listitem" data-cart-item-key="k1:abc"
                data-cart-item-title="Blue Hat" style="--item-index: 0;">
                <div class="cart-drawer-item__details">
                  <h3 class="cart-drawer-item__title"><a href="/products/blue-hat">Blue Hat</a></h3>
                  <label for="DrawerQuantity-1">Quantity</label>
                  <div class="quantity-stepper cart-drawer-item__stepper" data-quantity-stepper>
                    <button id="DrawerQuantityMinus-1" class="quantity-stepper__button" type="button" name="minus"
                      aria-label="Decrease quantity" aria-controls="DrawerQuantity-1"
                      data-quantity-button="decrease"${quantity <= 1 ? ' disabled' : ''}>-</button>
                    <input id="DrawerQuantity-1" class="quantity-stepper__input" type="number" name="updates[]"
                      value="${quantity}" min="1" step="1" inputmode="numeric" required
                      data-quantity-input data-cart-quantity>
                    <button id="DrawerQuantityPlus-1" class="quantity-stepper__button" type="button" name="plus"
                      aria-label="Increase quantity" aria-controls="DrawerQuantity-1"
                      data-quantity-button="increase">+</button>
                  </div>
                </div>
                <button class="icon-button cart-drawer-item__remove" type="button"
                  aria-label="Remove Blue Hat" data-cart-remove>x</button>
              </div>
            </div>
          </div>
          <footer class="cart-drawer__footer flow">
            <div class="cart-note">
              <label for="CartDrawerNote">Order note</label>
              <textarea id="CartDrawerNote" name="note">${note}</textarea>
            </div>
            <button class="button button--full" type="submit" name="checkout" data-focus-key="checkout">Check out</button>
            <div class="cart__dynamic-checkout" data-focus-key="dynamic-checkout">
              <button type="button">Express pay</button>
            </div>
            <a id="CartDrawerViewCart" class="cart-drawer__view-cart" href="/cart" data-cart-view-cart>View cart</a>
          </footer>
        </form>`}
      </div>
    </div>
  </div>
</cart-drawer>`;

// Header link the shopper (and handleDocumentClick in theme.js) uses to open the drawer.
export const headerCartLink = '<header><a id="HeaderCart" href="/cart">Cart</a></header>';

// One entry of the variant JSON printed by snippets/variant-no-js-select.liquid (mode "state").
export const variantRecord = (overrides = {}) => ({
  id: 1,
  title: 'A',
  available: true,
  inventory_management: null,
  inventory_quantity: 0,
  inventory_policy: 'deny',
  options: ['A'],
  price: '10.00',
  price_cents: 1000,
  compare_at_price: null,
  compare_at_price_cents: null,
  unit_price: null,
  unit_reference_value: null,
  unit_reference_unit: null,
  featured_media_id: null,
  quantity_min: 1,
  quantity_increment: 1,
  quantity_max: null,
  requires_selling_plan: false,
  selling_plan_allocations: [],
  ...overrides,
});

// <script type="application/json" data-variant-json>, as main-product.liquid prints it.
export const variantJsonScript = (variants) =>
  `<script type="application/json" data-variant-json>${JSON.stringify(variants)}</script>`;

// The option radios of the picker: one radio per variant (single option "Size"), the way
// snippets/variant-picker emits the hooks theme.js reads.
export const optionRadios = (variants, selectedId) =>
  variants
    .map(
      (variant) => `<input type="radio" name="Size" id="Size-${variant.id}" value="${variant.options[0]}"
        data-option-position="1"${variant.id === selectedId ? ' checked' : ''}>`,
    )
    .join('');

// sections/main-cart-items.liquid: the cart page section the drawer refreshes while on /cart.
export const cartPageMarkup = ({ quantity = 1, note = '', lines = quantity > 0
  ? [{ key: 'k1:abc', title: 'Blue Hat', quantity }]
  : [] } = {}) => {
  const total = lines.reduce((sum, line) => sum + line.quantity, 0);
  return `<p class="visually-hidden" role="status" data-cart-page-status="main-cart"></p>
  <section class="section cart-page" data-cart-page data-section-id="main-cart"
    data-cart-change-url="/cart/change.js" data-cart-url="/cart" data-item-count="${total}"
    data-cart-count-label="Cart, ${total} item${total === 1 ? '' : 's'}"
    data-error-message="Something went wrong" data-removed-template="Removed [title]"
    data-quantity-updated-template="Updated [title] to [quantity]">
  <div class="container flow">
    <h1 tabindex="-1">Cart</h1>
    ${lines.length ? `<form class="cart-form" action="/cart" method="post" novalidate>
      <div class="cart-items" role="list">
        ${lines.map(({ key, title, quantity, min = 1, step = 1, max, image = false }, index) => `<div class="cart-item" role="listitem" data-cart-item-key="${key}" data-cart-item-title="${title}">
          ${image ? '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">' : ''}
          <div class="cart-item__details flow">
            <h2>${title}</h2>
            <p data-line-price>$${quantity * 10}.00</p>
          </div>
          <div class="cart-item__controls">
            <label for="CartQuantity-${index + 1}">Quantity</label>
            <div class="quantity-stepper cart-item__stepper" data-quantity-stepper>
              <button class="quantity-stepper__button" type="button" name="minus" aria-label="Decrease quantity"
                aria-controls="CartQuantity-${index + 1}" data-quantity-button="decrease"${quantity <= min ? ' disabled' : ''}>-</button>
              <input id="CartQuantity-${index + 1}" class="quantity-stepper__input" type="number" name="updates[]"
                value="${quantity}" min="${min}" step="${step}"${max === undefined ? '' : ` max="${max}"`} inputmode="numeric"
                data-quantity-input data-cart-quantity>
              <button class="quantity-stepper__button" type="button" name="plus" aria-label="Increase quantity"
                aria-controls="CartQuantity-${index + 1}" data-quantity-button="increase"${quantity >= max ? ' disabled' : ''}>+</button>
            </div>
            <a href="/cart/change?id=${key}&amp;quantity=0" data-cart-remove>Remove</a>
          </div>
        </div>`).join('')}
      </div>
      <footer class="cart-page__footer">
        <div class="cart-note">
          <label for="CartNote">Order note</label>
          <textarea id="CartNote" name="note">${note}</textarea>
        </div>
        <p data-cart-subtotal>$${total * 10}.00</p>
        <button class="button" type="submit" name="update">Update cart</button>
        <button class="button" type="submit" name="checkout">Checkout</button>
      </footer>
    </form>` : '<p tabindex="-1" data-cart-empty-message>Your cart is empty</p>'}
  </div>
</section>`;
};
