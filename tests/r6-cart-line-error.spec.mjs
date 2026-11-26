import { expect, test } from '@playwright/test';
import { baseCss, cartDrawerMarkup, cartPageMarkup, mountPage, pageShell } from './support/r3-support.mjs';

const first = { key: '100:a', title: 'Blue Hat', quantity: 1 };
const second = { key: '100:b', title: 'Blue Hat with gift note', quantity: 1 };
const cartPage = (page) => page.locator('[data-cart-page]');
const line = (page, key) => cartPage(page).locator(`[data-cart-item-key="${key}"]`);
const field = (page, key) => line(page, key).getByRole('spinbutton', { name: 'Quantity' });

async function mountCart(page, { drawer = false, lines = [first], failure, readFailure = false, head = '' } = {}) {
  const state = { lines: lines.map((item) => ({ ...item })), updates: [], reads: [] };
  state.consoleErrors = [];
  page.on('console', (message) => { if (message.type() === 'error') state.consoleErrors.push(message.text()); });
  const total = () => state.lines.reduce((sum, item) => sum + item.quantity, 0);
  const render = (id) => id === 'main-cart'
    ? cartPageMarkup({ lines: state.lines })
    : cartDrawerMarkup({ quantity: total() });
  const html = pageShell(`<a class="site-header__cart" href="/cart" data-cart-count-enabled>Cart</a>
    ${render('main-cart')}${drawer ? render('cart-drawer') : ''}`, { head });
  await mountPage(page, html, {
    path: '/cart',
    onRequest: async (route, url) => {
      if (url.pathname === '/cart/change.js') {
        const request = route.request().postDataJSON();
        state.updates.push(request);
        const failed = typeof failure === 'function' ? failure(request, state) : failure;
        if (failed) {
          const target = state.lines.find((item) => item.key === request.id);
          if (target && request.quantity > 8) target.quantity = 8;
          await route.fulfill({ status: 422, json: failed });
          return true;
        }
        const target = state.lines.find((item) => item.key === request.id);
        if (target) target.quantity = request.quantity;
        state.lines = state.lines.filter((item) => item.quantity > 0);
        await route.fulfill({ json: { items: state.lines, item_count: total(), sections: {} } });
        return true;
      }
      if (url.pathname === '/cart' && url.searchParams.has('section_id')) {
        const id = url.searchParams.get('section_id');
        state.reads.push(id);
        const mode = typeof readFailure === 'function' ? readFailure(state) : readFailure;
        if (mode && id === 'main-cart') {
          // 'abort' makes the request itself reject (network failure); any other truthy value is a 503.
          if (mode === 'abort') await route.abort('failed');
          else await route.fulfill({ status: 503, contentType: 'text/html', body: 'unavailable' });
        } else {
          await route.fulfill({ contentType: 'text/html', body: render(id) });
        }
        return true;
      }
      return false;
    },
  });
  return state;
}

const stockError = (description = 'Only 8 items were added to your cart due to availability.', message = description) => ({ description, message });

test('visible line error uses Shopify text as text, including HTML-looking content', async ({ page }) => {
  const error = stockError('Only 8 items were added to your cart. <b>x</b>', 'Fallback');
  await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: error });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  const message = line(page, first.key).locator('[data-cart-line-error]');
  await expect(message).toBeVisible();
  await expect(message).toHaveText(error.description);
  await expect(message.locator('b')).toHaveCount(0);
});

test('visible error is associated with the recut field without a second live announcement', async ({ page }) => {
  const error = stockError();
  await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: error });
  const quantity = field(page, first.key);
  await quantity.evaluate((input) => input.setAttribute('aria-describedby', 'quantity-help'));
  await quantity.fill('20');
  await quantity.dispatchEvent('change');
  const message = line(page, first.key).locator('[data-cart-line-error]');
  await expect(message).toBeVisible();
  await expect(quantity).toHaveValue('8');
  await expect(quantity).toBeFocused();
  const id = await message.getAttribute('id');
  expect(id).toBeTruthy();
  expect((await quantity.getAttribute('aria-describedby') || '').split(/\s+/)).toEqual(['quantity-help', id]);
  await expect(message).not.toHaveAttribute('role', /.+/);
  await expect(message).not.toHaveAttribute('aria-live', /.+/);
});

test('line error appears once visibly and once in the existing status region', async ({ page }) => {
  const error = stockError();
  await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: error });
  await field(page, first.key).fill('20');
  await field(page, first.key).press('Tab');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveCount(1);
  await expect(page.locator('[data-cart-page-status]')).toHaveText(error.description);
  await expect(page.locator('[data-cart-page-status]')).toHaveCount(1);
  await expect(cartPage(page).getByRole('alert')).toHaveCount(0);
});

test('a successful change clears the line error, while another line failure keeps it', async ({ page }) => {
  const error = stockError();
  let failedOnce = false;
  const state = await mountCart(page, {
    lines: [{ ...first, quantity: 8 }, second],
    failure: (request) => {
      if (request.id === second.key && !failedOnce) { failedOnce = true; return { description: 'The gift note line is limited to 8.' }; }
      return request.id === first.key && request.quantity > 8 ? error : null;
    },
  });
  await field(page, first.key).evaluate((input) => input.setAttribute('aria-describedby', 'quantity-help'));
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  await field(page, second.key).fill('20');
  await field(page, second.key).press('Tab');
  // Wait for the repaint caused by the failed second line first, so the check on the first
  // line's message runs after the page was rebuilt and not before the request was sent.
  await expect(field(page, second.key)).toHaveValue('8');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  await field(page, first.key).fill('3');
  await field(page, first.key).dispatchEvent('change');
  await expect.poll(() => state.updates.length).toBe(3);
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveCount(0);
  await expect(field(page, first.key)).toHaveAttribute('aria-describedby', 'quantity-help');
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 20], [second.key, 20], [first.key, 3]]);
});

test('the cart page shows its line error through drawer.renderCartResponse when a drawer is present', async ({ page }) => {
  const error = stockError();
  await mountCart(page, { drawer: true, lines: [{ ...first, quantity: 8 }], failure: error });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toBeVisible();
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  await expect(field(page, first.key)).toHaveValue('8');
});

test('the line error is inserted in the current row when the cart section reread fails', async ({ page }) => {
  const error = stockError();
  const state = await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: error, readFailure: true });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toBeVisible();
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  expect(state.reads).toEqual(['main-cart']);
});

test('the drawer keeps its existing visible error and clears it after a successful change', async ({ page }) => {
  const error = stockError();
  await mountCart(page, { drawer: true, lines: [{ ...first, quantity: 8 }], failure: (request) => request.quantity > 8 ? error : null });
  const drawer = page.locator('cart-drawer');
  await drawer.evaluate((element) => element.open());
  const quantity = drawer.locator('[data-cart-quantity]');
  await quantity.fill('20');
  await quantity.press('Tab');
  const visibleError = drawer.locator('[data-cart-error]');
  await expect(visibleError).toBeVisible();
  await expect(visibleError).toHaveText(error.description);
  await quantity.fill('3');
  await quantity.press('Tab');
  await expect(visibleError).toBeHidden();
});

test('empty cart after removing its only row has no residual line error or page error', async ({ page }) => {
  const state = await mountCart(page);
  await field(page, first.key).fill('0');
  await field(page, first.key).press('Tab');
  await expect(cartPage(page).getByText('Your cart is empty')).toBeVisible();
  await expect(page.locator('[data-cart-line-error]')).toHaveCount(0);
  await expect(page.locator('[data-cart-page-status]')).toHaveText('Removed Blue Hat');
  expect(state.consoleErrors).toEqual([]);
});

test('one row receives a single associated error and a server message-only response is supported', async ({ page }) => {
  const message = 'Only 8 items were added.';
  await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: { message } });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(message);
  const id = await line(page, first.key).locator('[data-cart-line-error]').getAttribute('id');
  await expect(field(page, first.key)).toHaveAttribute('aria-describedby', id);
});

test('many rows keep the error keyed to the changed row and leave other rows untouched', async ({ page }) => {
  const lines = Array.from({ length: 11 }, (_, index) => ({ key: `line:${index}`, title: `Item ${index}`, quantity: index === 7 ? 8 : 1 }));
  await mountCart(page, { lines, failure: stockError() });
  await field(page, 'line:7').fill('20');
  await field(page, 'line:7').dispatchEvent('change');
  await expect(line(page, 'line:7').locator('[data-cart-line-error]')).toBeVisible();
  await expect(line(page, 'line:7').locator('[data-cart-line-error]')).toHaveText(/Only 8/);
  await expect(cartPage(page).locator('[data-cart-line-error]')).toHaveCount(1);
  await expect(field(page, 'line:6')).toHaveValue('1');
});

test('long server message and title wrap at mobile and desktop width without horizontal overflow', async ({ page }) => {
  const message = 'Availability detail '.repeat(15).trim();
  const title = 'Tailored piece '.repeat(8).trim();
  await page.setViewportSize({ width: 375, height: 812 });
  // base.css is loaded and the row has an image, so the fixture lays out like the real cart.
  await mountCart(page, {
    lines: [{ ...first, title, quantity: 8, image: true }],
    failure: stockError(message),
    head: `<style>${baseCss()}</style>`,
  });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(message);
  for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
    expect(widths.viewport).toBe(width);
    expect(widths.page).toBeLessThanOrEqual(widths.viewport);
  }
});

test('the line error still appears when the cart section reread throws instead of answering', async ({ page }) => {
  const error = stockError();
  const state = await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: error, readFailure: 'abort' });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  await expect(field(page, first.key)).toHaveAttribute('aria-describedby', /CartLineError/);
  await expect(page.locator('[data-cart-page-status]')).toHaveText(error.description);
  expect(state.updates).toHaveLength(1);
});

test('a successful change clears the line error even when the section reread fails and nothing is repainted', async ({ page }) => {
  const error = stockError();
  let readsFail = false;
  const state = await mountCart(page, {
    lines: [{ ...first, quantity: 8 }],
    failure: (request) => request.quantity > 8 ? error : null,
    readFailure: () => readsFail,
  });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  readsFail = true;
  await field(page, first.key).fill('3');
  await field(page, first.key).dispatchEvent('change');
  await expect.poll(() => state.updates.length).toBe(2);
  await expect.poll(() => state.reads.length).toBe(2);
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveCount(0);
  await expect(field(page, first.key)).not.toHaveAttribute('aria-describedby', /CartLineError/);
});

test('missing server error text falls back to the existing localized cart error', async ({ page }) => {
  await mountCart(page, { lines: [{ ...first, quantity: 8 }], failure: {} });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText('Something went wrong');
});

test('a correct change on another line clears the earlier line error and keeps the server quantity', async ({ page }) => {
  // Accepted behaviour (D87): the notice is dropped on the next successful repaint, whichever line changed.
  const error = stockError();
  const state = await mountCart(page, {
    lines: [{ ...first, quantity: 8 }, second],
    failure: (request) => request.id === first.key && request.quantity > 8 ? error : null,
  });
  await field(page, first.key).fill('20');
  await field(page, first.key).dispatchEvent('change');
  await expect(field(page, first.key)).toHaveValue('8');
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(error.description);
  await field(page, second.key).fill('3');
  await field(page, second.key).dispatchEvent('change');
  await expect.poll(() => state.updates.length).toBe(2);
  await expect(field(page, second.key)).toHaveValue('3');
  await expect(cartPage(page).locator('[data-cart-line-error]')).toHaveCount(0);
  await expect(field(page, first.key)).toHaveValue('8');
  await expect(field(page, first.key)).not.toHaveAttribute('aria-describedby', /CartLineError/);
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 20], [second.key, 3]]);
});
