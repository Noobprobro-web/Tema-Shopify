import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { cartDrawerMarkup, cartPageMarkup, gate, mountPage, pageShell } from './support/r3-support.mjs';

const first = { key: '100:a', title: 'Blue Hat', quantity: 1 };
const second = { key: '100:b', title: 'Blue Hat with gift note', quantity: 1 };
const cartPage = (page) => page.locator('[data-cart-page]');
const row = (page, key) => cartPage(page).locator(`[data-cart-item-key="${key}"]`);
const field = (page, key) => row(page, key).getByRole('spinbutton', { name: 'Quantity' });
const plus = (page, key = first.key) => row(page, key).getByRole('button', { name: 'Increase quantity' });
const status = (page) => page.getByRole('status');

async function mountCart(page, { drawer = false, lines = [first], hold, error, beforeChange, rotateKey } = {}) {
  const state = { lines: lines.map((line) => ({ ...line })), updates: [], native: [], nativeQuantities: [], reads: [] };
  const total = () => state.lines.reduce((sum, line) => sum + line.quantity, 0);
  const render = (id) => id === 'main-cart'
    ? cartPageMarkup({ lines: state.lines }) : cartDrawerMarkup({ quantity: total() });
  const html = pageShell(`<a class="site-header__cart" href="/cart" data-cart-count-enabled>Cart</a>
    ${render('main-cart')}${drawer ? render('cart-drawer') : ''}`);
  const apply = (updates) => {
    for (const line of state.lines) if (line.key in updates) line.quantity = updates[line.key];
    state.lines = state.lines.filter((line) => line.quantity > 0);
  };
  await mountPage(page, html, {
    path: '/cart',
    onRequest: async (route, url) => {
      if (url.pathname === '/cart/change.js') {
        const request = route.request().postDataJSON();
        state.updates.push(request);
        await beforeChange?.(request);
        if (hold && state.updates.length === 1) await hold.promise;
        if (error) {
          await route.fulfill(error);
          return true;
        }
        apply({ [request.id]: request.quantity });
        const changed = state.lines.find((line) => line.key === request.id);
        if (rotateKey && changed) changed.key = rotateKey;
        await route.fulfill({ json: { items: state.lines, item_count: total(), sections: Object.fromEntries(request.sections.map((id) => [id, render(id)])) } });
        return true;
      }
      if (url.pathname === '/cart' && url.searchParams.has('section_id')) {
        const id = url.searchParams.get('section_id');
        state.reads.push(id);
        await route.fulfill({ contentType: 'text/html', body: render(id) });
        return true;
      }
      if (url.pathname === '/cart' && route.request().method() === 'POST') {
        const body = new URLSearchParams(route.request().postData());
        state.native.push(Object.fromEntries(body));
        state.nativeQuantities.push(body.getAll('updates[]'));
        await route.fulfill({ contentType: 'text/html', body: '<p>Native cart submitted</p>' });
        return true;
      }
      return false;
    },
  });
  return state;
}

for (const drawer of [true, false]) {
  test(`cart updates prices, focus, note and count with ${drawer ? 'a' : 'no'} drawer`, async ({ page }) => {
    const state = await mountCart(page, { drawer });
    await cartPage(page).getByRole('textbox', { name: 'Order note' }).fill('Gift please');
    await plus(page).focus();
    await page.keyboard.press('Enter');
    await expect(cartPage(page).locator('[data-cart-subtotal]')).toHaveText('$20.00');
    await expect(row(page, first.key).locator('[data-line-price]')).toHaveText('$20.00');
    await expect(plus(page)).toBeFocused();
    await expect(status(page)).toHaveText('Updated Blue Hat to 2');
    await expect(cartPage(page).getByRole('textbox', { name: 'Order note' })).toHaveValue('Gift please');
    expect(state.updates).toEqual([{ id: first.key, quantity: 2, sections: drawer ? ['cart-drawer', 'main-cart'] : ['main-cart'], sections_url: '/cart' }]);
    if (drawer) {
      await expect(page.locator('cart-drawer [data-cart-quantity]')).toHaveValue('2');
      await expect(page.locator('cart-drawer')).not.toHaveAttribute('data-open', '');
    } else {
      await expect(page.getByRole('link', { name: 'Cart, 2 items' })).toHaveText('Cart2');
    }
  });
}

test('rapid changes batch by line key through a cart with eleven items', async ({ page }) => {
  const title = 'A'.repeat(120);
  const lines = [first, { ...second, title, image: false }, ...Array.from({ length: 9 }, (_, i) => ({ key: `${i}:c`, title: `Item ${i}`, quantity: 1, image: true }))];
  const state = await mountCart(page, { lines });
  await plus(page).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await plus(page, second.key).focus();
  await page.keyboard.press('Enter');
  await expect(cartPage(page).locator('[data-cart-subtotal]')).toHaveText('$150.00');
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 4], [second.key, 2]]);
  await expect(row(page, second.key).getByText(title)).toBeVisible();
  await expect(row(page, second.key).locator('img')).toHaveCount(0);
});

test('an edit during a request waits and only the final response repaints the page', async ({ page }) => {
  const hold = gate();
  const state = await mountCart(page, { hold });
  await cartPage(page).evaluate((el) => {
    window.cartPaintedQuantities = [];
    new MutationObserver(() => {
      const next = document.querySelector('[data-cart-page] input');
      if (next && !el.isConnected) window.cartPaintedQuantities.push(next.defaultValue);
    }).observe(el.parentNode, { childList: true });
  });
  await plus(page).click();
  await expect.poll(() => state.updates.length).toBe(1);
  await plus(page).click();
  expect(state.updates).toHaveLength(1);
  hold.open();
  await expect(cartPage(page).locator('[data-cart-subtotal]')).toHaveText('$30.00');
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 2], [first.key, 3]]);
  expect(await page.evaluate(() => window.cartPaintedQuantities)).toEqual(['3']);
});

test('a drawer mutation during the debounce keeps the pending page edit by key', async ({ page }) => {
  const state = await mountCart(page, { drawer: true, lines: [first, second] });
  await plus(page).click();
  await page.evaluate((key) => document.querySelector('cart-drawer').changeLine(key, 3), second.key);
  await expect(cartPage(page).locator('[data-cart-subtotal]')).toHaveText('$50.00');
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[second.key, 3], [first.key, 2]]);
  await expect(field(page, second.key)).toHaveValue('3');
});

test('quantity zero and Remove hand focus to the next line or to the empty state', async ({ page }) => {
  const state = await mountCart(page, { lines: [first, second] });
  const firstField = field(page, first.key);
  await firstField.fill('0');
  await firstField.press('Tab');
  await expect(firstField).toHaveCount(0);
  await expect(field(page, second.key)).toBeFocused();
  await expect(status(page)).toHaveText('Removed Blue Hat');
  await row(page, second.key).getByRole('link', { name: 'Remove' }).focus();
  await page.keyboard.press('Enter');
  await expect(cartPage(page).getByText('Your cart is empty')).toBeFocused();
  await expect(status(page)).toHaveText('Removed Blue Hat with gift note');
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 0], [second.key, 0]]);
});

test('a key changed by a discount still announces an update for a nonzero request', async ({ page }) => {
  const rotated = '100:discount';
  const state = await mountCart(page, { rotateKey: rotated });
  await plus(page).click();
  await expect(field(page, rotated)).toHaveValue('2');
  await expect(status(page)).toHaveText('Updated Blue Hat to 2');
  expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 2]]);
  await expect(cartPage(page).getByRole('heading', { name: 'Cart', exact: true })).toBeFocused();
});

for (const [code, response, message] of [
  [422, { json: { description: 'No more inventory' } }, 'No more inventory'],
  [503, { contentType: 'text/html', body: '<h1>Unavailable</h1>' }, 'Something went wrong'],
]) {
  test(`change.js ${code} reloads the server quantity and announces the error`, async ({ page }) => {
    const state = await mountCart(page, { error: { status: code, ...response } });
    await plus(page).click();
    await expect(status(page)).toHaveText(message);
    await expect(field(page, first.key)).toHaveValue('1');
    await expect(plus(page)).toBeFocused();
    expect(state.reads).toEqual(['main-cart']);
    expect(state.updates.map(({ id, quantity }) => [id, quantity])).toEqual([[first.key, 2]]);
  });
}

test('Checkout waits for the fresh form and includes its native submitter and note', async ({ page }) => {
  const hold = gate();
  const state = await mountCart(page, { hold });
  await cartPage(page).getByRole('textbox', { name: 'Order note' }).fill('Keep this note');
  await plus(page).click();
  await cartPage(page).getByRole('button', { name: 'Checkout' }).click();
  await expect.poll(() => state.updates.length).toBe(1);
  expect(state.native).toHaveLength(0);
  hold.open();
  await expect(page.getByText('Native cart submitted')).toBeVisible();
  expect(state.native).toEqual([{ 'updates[]': '2', note: 'Keep this note', checkout: '' }]);
});

test('Checkout waits for an overlapping drawer change and submits quantities from both requests', async ({ page }) => {
  const pageResponse = gate();
  const drawerResponse = gate();
  const state = await mountCart(page, {
    drawer: true,
    lines: [first, second],
    beforeChange: ({ id }) => id === first.key ? pageResponse.promise : drawerResponse.promise,
  });
  await cartPage(page).getByRole('textbox', { name: 'Order note' }).fill('Keep this note');
  await plus(page).click();
  await expect.poll(() => state.updates.length).toBe(1);
  await page.evaluate((key) => { document.querySelector('cart-drawer').changeLine(key, 3); }, second.key);
  await expect.poll(() => state.updates.length).toBe(2);
  await cartPage(page).getByRole('button', { name: 'Checkout' }).click();
  pageResponse.open();
  await expect(cartPage(page).locator('[data-cart-subtotal]')).toHaveText('$30.00');
  expect(state.native).toHaveLength(0);
  drawerResponse.open();
  await expect(page.getByText('Native cart submitted')).toBeVisible();
  expect(state.native[0]).toMatchObject({ checkout: '', note: 'Keep this note' });
  expect(state.nativeQuantities).toEqual([['2', '3']]);
});

test('native cart markup keeps its action, updates, Update cart and Checkout', () => {
  const liquid = readFileSync(new URL('../sections/main-cart-items.liquid', import.meta.url), 'utf8');
  expect(liquid).toMatch(/<form\b[^>]*action="{{ routes\.cart_url }}"[^>]*method="post"/);
  expect(liquid).toMatch(/<input\b[^>]*name="updates\[\]"/);
  for (const name of ['update', 'checkout']) {
    expect(liquid).toMatch(new RegExp(`<button\\b[^>]*type="submit"[^>]*name="${name}"`));
  }
});
