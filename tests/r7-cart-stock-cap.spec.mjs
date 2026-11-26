import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { cartDrawerMarkup, cartPageMarkup, mountPage, pageShell } from './support/r3-support.mjs';

const first = { key: '100:a', title: 'Blue Hat', quantity: 8, stockMax: 8 };
const cartPage = (page) => page.locator('[data-cart-page]');
const line = (page, key) => cartPage(page).locator(`[data-cart-item-key="${key}"]`);
const field = (page, key = first.key) => line(page, key).getByRole('spinbutton', { name: 'Quantity' });
const plusPage = (page, key = first.key) => line(page, key).getByRole('button', { name: 'Increase quantity' });
const stockError = { description: 'Only 8 items were added to your cart due to availability.', message: 'Stock is limited.' };
const legacyStockCap = process.env.R7_LEGACY_STOCK_CAP === '1';

async function mountCart(page, { drawer = false, lines = [first], failure, noJs = false } = {}) {
  const state = { lines: lines.map((item) => ({ ...item })), updates: [], reads: [], native: [] };
  const total = () => state.lines.reduce((sum, item) => sum + item.quantity, 0);
  const render = (id) => {
    if (id === 'main-cart') return cartPageMarkup({ lines: state.lines, legacyStockCap });
    const line = state.lines[0] || {};
    return cartDrawerMarkup({ ...line, quantity: line.quantity || 0, legacyStockCap });
  };
  let html = pageShell(`<a class="site-header__cart" href="/cart" data-cart-count-enabled>Cart</a>
    ${render('main-cart')}${drawer ? render('cart-drawer') : ''}`);
  if (noJs) html = html.replace(/<script>[\s\S]*?<\/script>/, '');
  await mountPage(page, html, {
    path: '/cart',
    onRequest: async (route, url) => {
      if (url.pathname === '/cart/change.js') {
        const request = route.request().postDataJSON();
        state.updates.push(request);
        const failed = typeof failure === 'function' ? failure(request, state) : failure;
        const target = state.lines.find((item) => item.key === request.id) || state.lines[0];
        if (failed) {
          if (target?.stockMax !== undefined && request.quantity > target.stockMax) target.quantity = target.stockMax;
          await route.fulfill({ status: 422, json: failed });
          return true;
        }
        if (target) target.quantity = request.quantity;
        state.lines = state.lines.filter((item) => item.quantity > 0);
        const sections = Object.fromEntries(request.sections.map((id) => [id, render(id)]));
        await route.fulfill({ json: { items: state.lines, item_count: total(), sections } });
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
        state.native.push(body.getAll('updates[]'));
        await route.fulfill({ contentType: 'text/html', body: '<p>Native cart submitted</p>' });
        return true;
      }
      return false;
    },
  });
  return state;
}

const requestQuantity = (state, index = 0) => state.updates[index]?.quantity;

test('a stock-capped cart line sends 20, shows Shopify error, and repaints to 8', async ({ page }) => {
  const state = await mountCart(page, { failure: stockError });
  const quantity = field(page);
  if (legacyStockCap) await expect(quantity).toHaveAttribute('max', '8');
  else {
    await expect(quantity).not.toHaveAttribute('max');
    await expect(quantity).toHaveAttribute('data-quantity-stock-max', '8');
  }
  await quantity.fill('20');
  await quantity.dispatchEvent('change');
  await expect.poll(() => requestQuantity(state)).toBe(20);
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(stockError.description);
  await expect(field(page)).toHaveValue('8');
});

test('an open stock-capped drawer sends 20 and shows Shopify error after the line returns to 8', async ({ page }) => {
  const state = await mountCart(page, { drawer: true, failure: stockError });
  const drawer = page.locator('cart-drawer');
  await drawer.evaluate((element) => element.open());
  const quantity = drawer.locator('[data-cart-quantity]');
  if (legacyStockCap) await expect(quantity).toHaveAttribute('max', '8');
  else {
    await expect(quantity).not.toHaveAttribute('max');
    await expect(quantity).toHaveAttribute('data-quantity-stock-max', '8');
  }
  await quantity.fill('20');
  await quantity.dispatchEvent('change');
  await expect.poll(() => requestQuantity(state)).toBe(20);
  await expect(drawer.locator('[data-cart-error]')).toBeVisible();
  await expect(drawer.locator('[data-cart-error]')).toHaveText(stockError.description);
  await expect(drawer.locator('[data-cart-quantity]')).toHaveValue('8');
});

test('the plus button stays disabled at and above the stock cap after input on both surfaces', async ({ page }) => {
  await mountCart(page, { drawer: true });
  const pageQuantity = field(page);
  const drawer = page.locator('cart-drawer');
  await drawer.evaluate((element) => element.open());
  const drawerQuantity = drawer.locator('[data-cart-quantity]');
  const pagePlus = plusPage(page);
  const drawerPlus = drawer.getByRole('button', { name: 'Increase quantity' });
  await expect(pagePlus).toBeDisabled();
  await expect(drawerPlus).toBeDisabled();
  await pageQuantity.fill('20');
  await pageQuantity.dispatchEvent('input');
  await drawerQuantity.fill('20');
  await drawerQuantity.dispatchEvent('input');
  await expect(pagePlus).toBeDisabled();
  await expect(drawerPlus).toBeDisabled();
});

for (const surface of ['page', 'drawer']) {
  test(`quantity_rule max and increment remain intact on the ${surface}`, async ({ page }) => {
    const state = await mountCart(page, {
      drawer: surface === 'drawer',
      lines: [{ key: first.key, title: first.title, quantity: 4, min: 2, step: 2, max: 10, stockMax: 8 }],
    });
    const drawer = page.locator('cart-drawer');
    if (surface === 'drawer') await drawer.evaluate((element) => element.open());
    const quantity = surface === 'drawer' ? drawer.locator('[data-cart-quantity]') : field(page);
    const plus = surface === 'drawer' ? drawer.getByRole('button', { name: 'Increase quantity' }) : plusPage(page);
    await expect(quantity).toHaveAttribute('max', '10');
    await expect(quantity).not.toHaveAttribute('data-quantity-stock-max');
    await quantity.fill('20');
    await quantity.dispatchEvent('change');
    await expect.poll(() => requestQuantity(state)).toBe(10);
    await expect(quantity).toHaveValue('10');
    await expect(plus).toBeDisabled();
    await quantity.fill('5');
    await quantity.dispatchEvent('change');
    await expect.poll(() => requestQuantity(state, 1)).toBe(4);
    await expect(quantity).toHaveValue('4');
    expect(state.updates.map((request) => request.quantity)).toEqual([10, 4]);
  });
}

test('a line below its stock cap has no input max and still follows the R6 422 path', async ({ page }) => {
  const state = await mountCart(page, { lines: [{ ...first, quantity: 5 }], failure: stockError });
  const quantity = field(page);
  await expect(quantity).not.toHaveAttribute('max');
  await expect(quantity).not.toHaveAttribute('data-quantity-stock-max');
  await expect(plusPage(page)).toBeEnabled();
  await quantity.fill('20');
  await quantity.dispatchEvent('change');
  await expect.poll(() => requestQuantity(state)).toBe(20);
  await expect(line(page, first.key).locator('[data-cart-line-error]')).toHaveText(stockError.description);
  await expect(field(page)).toHaveValue('8');
});

test('a stock-capped error in an eleven-line cart stays with its line key', async ({ page }) => {
  const lines = Array.from({ length: 11 }, (_, index) => ({
    key: `line:${index}`,
    title: `Item ${index}`,
    quantity: index === 7 ? 8 : 1,
    ...(index === 7 ? { stockMax: 8 } : {}),
  }));
  const state = await mountCart(page, { lines, failure: stockError });
  const quantity = field(page, 'line:7');
  if (legacyStockCap) await expect(quantity).toHaveAttribute('max', '8');
  else await expect(quantity).toHaveAttribute('data-quantity-stock-max', '8');
  await quantity.fill('20');
  await quantity.dispatchEvent('change');
  await expect.poll(() => requestQuantity(state)).toBe(20);
  await expect(line(page, 'line:7').locator('[data-cart-line-error]')).toHaveText(stockError.description);
  await expect(cartPage(page).locator('[data-cart-line-error]')).toHaveCount(1);
  await expect(field(page, 'line:6')).toHaveValue('1');
});

for (const inventoryCase of ['unmanaged inventory', 'continue policy']) {
  test(`no stock-only cap is emitted with ${inventoryCase}; typed 20 is sent`, async ({ page }) => {
    const state = await mountCart(page, {
      lines: [{
        key: first.key,
        title: first.title,
        quantity: 1,
        inventoryManagement: inventoryCase === 'unmanaged inventory' ? null : 'shopify',
        inventoryPolicy: inventoryCase === 'continue policy' ? 'continue' : 'deny',
      }],
    });
    const quantity = field(page);
    await expect(quantity).not.toHaveAttribute('max');
    await expect(quantity).not.toHaveAttribute('data-quantity-stock-max');
    await expect(plusPage(page)).toBeEnabled();
    await quantity.fill('20');
    await quantity.dispatchEvent('change');
    await expect.poll(() => requestQuantity(state)).toBe(20);
    await expect(field(page)).toHaveValue('20');
  });
}

test('single-unit stock is still editable for the 422 but keeps plus disabled', async ({ page }) => {
  const oneUnit = { key: 'piece:one', title: 'Unique piece', quantity: 1, stockMax: 1 };
  const state = await mountCart(page, { lines: [oneUnit], failure: { description: 'Only one remains.' } });
  const quantity = field(page, oneUnit.key);
  if (legacyStockCap) await expect(quantity).toHaveAttribute('max', '1');
  else {
    await expect(quantity).not.toHaveAttribute('max');
    await expect(quantity).toHaveAttribute('data-quantity-stock-max', '1');
  }
  await expect(plusPage(page, oneUnit.key)).toBeDisabled();
  await quantity.fill('2');
  await quantity.dispatchEvent('change');
  await expect.poll(() => requestQuantity(state)).toBe(2);
  await expect(line(page, oneUnit.key).locator('[data-cart-line-error]')).toHaveText('Only one remains.');
  await expect(field(page, oneUnit.key)).toHaveValue('1');
  await expect(plusPage(page, oneUnit.key)).toBeDisabled();
});

test('the cart page form remains a no-JavaScript submission path for stock-capped input', async ({ page }) => {
  const state = await mountCart(page, { noJs: true });
  const quantity = field(page);
  await expect(cartPage(page).locator('form')).toHaveAttribute('novalidate', '');
  if (legacyStockCap) await expect(quantity).toHaveAttribute('max', '8');
  else await expect(quantity).not.toHaveAttribute('max');
  await quantity.fill('20');
  await cartPage(page).getByRole('button', { name: 'Update cart' }).click();
  await expect(page.getByText('Native cart submitted')).toBeVisible();
  expect(state.native).toEqual([['20']]);
});

test('both Liquid cart surfaces distinguish rule maximum from stock-only maximum', () => {
  for (const path of ['../sections/main-cart-items.liquid', '../sections/cart-drawer.liquid']) {
    const liquid = readFileSync(new URL(path, import.meta.url), 'utf8');
    expect(liquid).toMatch(/assign stock_max = ''/);
    expect(liquid).toMatch(/if quantity_max == blank and item\.variant\.inventory_management == 'shopify' and item\.variant\.inventory_policy == 'deny' and item\.variant\.inventory_quantity <= item\.quantity/);
    expect(liquid).toMatch(/elsif stock_max != blank[^\n]*data-quantity-stock-max=/);
    expect(liquid).toMatch(/quantity_button_max != blank and item\.quantity >= quantity_button_max/);
  }
});
