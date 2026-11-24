// R3 regressions about the cart drawer and the cart page: AS-02, FB-02, FB-20, FB-30.
// The real assets/theme.js runs against markup that mirrors sections/cart-drawer.liquid and
// sections/main-cart-items.liquid; the cart endpoints are answered by a tiny in-test "server".
import { expect, test } from '@playwright/test';
import {
  afterFrames,
  cartDrawerMarkup,
  cartPageMarkup,
  headerCartLink,
  mountPage,
  pageShell,
} from './support/r3-support.mjs';

// The server state the fake endpoints render from; both sections always agree with it.
async function mountCart(page, { onCart = true, note = '' } = {}) {
  const server = { quantity: 1, pageSectionRequests: 0, changeRequests: 0 };
  const render = (sectionId) =>
    sectionId === 'main-cart'
      ? cartPageMarkup({ quantity: server.quantity, note: '' })
      : cartDrawerMarkup({ quantity: server.quantity });

  const html = pageShell(`${headerCartLink}
    <main>${onCart ? cartPageMarkup({ quantity: 1, note }) : ''}</main>
    ${cartDrawerMarkup({ quantity: 1 })}`);

  await mountPage(page, html, {
    path: onCart ? '/cart' : '/',
    onRequest: async (route, url) => {
      if (url.pathname === '/cart/change.js') {
        server.changeRequests += 1;
        const body = route.request().postDataJSON();
        server.quantity = body.quantity;
        const sections = Object.fromEntries((body.sections || []).map((id) => [id, render(id)]));
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify({
            items: server.quantity > 0 ? [{ key: body.id, quantity: server.quantity }] : [],
            item_count: server.quantity,
            sections,
          }),
        });
        return true;
      }
      if (url.pathname === '/cart' && url.searchParams.has('section_id')) {
        const sectionId = url.searchParams.get('section_id');
        if (sectionId === 'main-cart') server.pageSectionRequests += 1;
        await route.fulfill({ contentType: 'text/html', body: render(sectionId) });
        return true;
      }
      return false;
    },
  });
  return server;
}

// Opens the drawer the way a shopper does and waits until its first server sync has been painted.
async function openDrawer(page) {
  await page.evaluate(() => {
    document.querySelector('[data-cart-drawer-content]').dataset.probe = 'before-sync';
  });
  await page.locator('#HeaderCart').click();
  await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
  await expect(page.locator('[data-cart-drawer-content][data-probe]')).toHaveCount(0);
}

// A round trip through the fake origin plus two frames: whatever the page fired right after the
// last paint has reached the route handler by now. Used before asserting that nothing happened.
const settle = async (page) => {
  await page.evaluate(() => fetch('/__settle').catch(() => null));
  await afterFrames(page);
};

test.describe('AS-02 the drawer and the cart page share the cart', () => {
  test('AS-02 opening the drawer keeps unsent edits on the cart page, and a clean page is still refreshed', async ({ page }) => {
    const server = await mountCart(page);
    await page.evaluate(() => {
      document.getElementById('CartNote').value = 'gift please';
      document.getElementById('CartQuantity-1').value = '3';
      document.querySelector('[data-cart-page]').dataset.marker = 'original';
    });

    await openDrawer(page);
    await settle(page);

    // Unsent edits: the page is left exactly as the shopper left it, and no request replaces it.
    await expect(page.locator('#CartNote')).toHaveValue('gift please');
    await expect(page.locator('#CartQuantity-1')).toHaveValue('3');
    await expect(page.locator('[data-cart-page]')).toHaveAttribute('data-marker', 'original');
    expect(server.pageSectionRequests, 'no page section request while the page has unsent edits').toBe(0);

    // Without unsent edits the page is refreshed on open, as before (another tab may have changed it).
    await page.locator('[data-cart-drawer-close]').click();
    await expect(page.locator('cart-drawer')).not.toHaveAttribute('data-open', '');
    await page.evaluate(() => {
      document.getElementById('CartNote').value = '';
      document.getElementById('CartQuantity-1').value = '1';
    });
    await page.locator('#HeaderCart').click();
    await expect(page.locator('[data-cart-page]')).not.toHaveAttribute('data-marker', 'original');
    expect(server.pageSectionRequests).toBe(1);
  });

  test('AS-02 a change made in the drawer refreshes the cart page but keeps the note typed there', async ({ page }) => {
    await mountCart(page);
    await openDrawer(page);
    await page.evaluate(() => {
      document.getElementById('CartNote').value = 'gift please';
    });

    await page.locator('#DrawerQuantity-1').fill('2');
    await page.locator('#DrawerQuantity-1').press('Tab');

    // The page was refreshed from the server (its line now says 2) and the note survived.
    await expect(page.locator('#CartQuantity-1')).toHaveValue('2');
    await expect(page.locator('#CartNote')).toHaveValue('gift please');
  });
});

test.describe('FB-02 cart changes are announced', () => {
  test('FB-02 a quantity change is announced in the status region, and a removal keeps its own message', async ({ page }) => {
    await mountCart(page, { onCart: false });
    await openDrawer(page);
    const status = page.locator('[data-cart-status]');

    await page.locator('#DrawerQuantity-1').fill('2');
    await page.locator('#DrawerQuantity-1').press('Tab');
    await expect(status).toHaveText('Updated Blue Hat to 2');

    await page.locator('#DrawerQuantity-1').fill('0');
    await page.locator('#DrawerQuantity-1').press('Tab');
    await expect(status).toHaveText(/^Removed Blue Hat/);
  });
});

test.describe('FB-20 focus survives a repaint of the drawer', () => {
  for (const [key, selector] of [
    ['checkout', 'button[data-focus-key="checkout"]'],
    ['dynamic-checkout', '[data-focus-key="dynamic-checkout"] button'],
  ]) {
    test(`FB-20 focus stays on ${key} when the drawer repaints`, async ({ page }) => {
      await mountCart(page, { onCart: false });
      await openDrawer(page);
      await page.locator(selector).focus();

      // Any late sync repaints the whole body of the drawer (here: the same call the theme makes
      // when the page becomes visible again and the cart may have changed in another tab).
      await page.evaluate(() => {
        document.querySelector('[data-cart-drawer-content]').dataset.probe = 'before-repaint';
        document.querySelector('cart-drawer').syncCart();
      });
      await expect(page.locator('[data-cart-drawer-content][data-probe]')).toHaveCount(0);
      await afterFrames(page);

      await expect(page.locator('[data-cart-drawer-close]')).not.toBeFocused();
      await expect(page.locator(selector)).toBeFocused();
    });
  }
});

test.describe('FB-30 zero on the cart page is a removal command', () => {
  test('FB-30 typing 0 in a cart page quantity field is kept instead of being snapped to the minimum', async ({ page }) => {
    await mountCart(page);
    const field = page.locator('#CartQuantity-1');
    await field.fill('0');
    await field.press('Tab');
    await expect(field).toHaveValue('0');
  });
});
