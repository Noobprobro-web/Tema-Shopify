import { expect, test } from '@playwright/test';

const section = (qty) => `<cart-drawer data-item-count="${qty}" data-cart-count-label="${qty} items">
  <div data-cart-drawer-content>
    <textarea id="CartNote" name="note"></textarea>
    <input id="DrawerQuantity-1" type="number" name="updates[]" value="${qty}" min="1" step="1" required data-cart-quantity data-line="1">
  </div>
  <span data-cart-drawer-count>${qty}</span>
</cart-drawer>`;

// Controllable fetch: section GETs can be held open; mutations resolve immediately.
async function install(page, { transportFails = false } = {}) {
  await page.goto('/fixture.html');
  await page.waitForFunction(() => customElements.get('cart-drawer') !== undefined);
  await page.evaluate(({ transportFails }) => {
    window.__log = [];
    window.__held = [];
    window.__cartQty = 1;
    window.__section = (qty) => `<cart-drawer data-item-count="${qty}" data-cart-count-label="${qty} items">
  <div data-cart-drawer-content>
    <textarea id="CartNote" name="note"></textarea>
    <input id="DrawerQuantity-1" type="number" name="updates[]" value="${qty}" min="1" step="1" required data-cart-quantity data-line="1">
  </div>
  <span data-cart-drawer-count>${qty}</span>
</cart-drawer>`;

    window.fetch = (input, init = {}) => {
      const url = String(input);
      const isMutation = url.includes('/cart/add') || url.includes('/cart/change');
      window.__log.push({ url, isMutation });

      if (transportFails && isMutation) return Promise.reject(new TypeError('Failed to fetch'));

      if (isMutation) {
        const body = init.body && typeof init.body === 'string' ? JSON.parse(init.body) : null;
        if (body && typeof body.quantity === 'number') window.__cartQty = body.quantity;
        return Promise.resolve(new Response(
          JSON.stringify({ sections: { 'cart-drawer': window.__section(window.__cartQty) } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ));
      }

      // section GET — capture the quantity at REQUEST time, and hold if asked
      const snapshot = window.__cartQty;
      let release;
      const promise = new Promise((resolve) => {
        release = () => resolve(new Response(window.__section(snapshot), {
          status: 200, headers: { 'Content-Type': 'text/html' },
        }));
      });
      const entry = { url, snapshot, release, held: window.__holdSections === true };
      window.__held.push(entry);
      if (!entry.held) release();
      return promise;
    };
  }, { transportFails });
}

const qtyInDom = (page) => page.evaluate(() => document.querySelector('[data-cart-quantity]')?.value ?? null);
const sectionGets = (page) => page.evaluate(() => window.__log.filter((c) => !c.isMutation).length);

test.describe('4B-007 remediation', () => {
  test('R01: a held syncCart response cannot revert a later mutation', async ({ page }) => {
    await install(page);
    await page.evaluate(() => { window.__holdSections = true; });

    // open() fires syncCart; its response is held with the cart still at quantity 1
    await page.click('#page-cart-link');
    await page.waitForFunction(() => window.__held.length === 1);

    // mutate to 2 while that read is still in flight
    await page.evaluate(async () => {
      await document.querySelector('cart-drawer').changeLine(1, 2);
    });
    expect(await qtyInDom(page)).toBe('2');

    // now release the stale read, which carries quantity 1
    await page.evaluate(() => { window.__held[0].release(); });
    await page.waitForTimeout(250);

    expect(await qtyInDom(page)).toBe('2');
    expect(await page.evaluate(() => window.__cartQty)).toBe(2);
  });

  test('R01: an add-to-cart does not trigger a second, redundant section request', async ({ page }) => {
    await install(page);
    await page.evaluate(() => { window.__holdSections = false; });

    // The real path: addItem renders fresh HTML from result.sections and then calls
    // open(), whose syncCart() lands while the mutation is still counted as pending.
    await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      const form = document.querySelector('#add-form');
      await drawer.addItem(form, form.querySelector('[data-add-to-cart]'));
    });
    await page.waitForTimeout(300);

    expect(await page.evaluate(() => window.__log.filter((c) => !c.isMutation).length)).toBe(0);
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
  });

  test('R01: a mutation that fails to render still leaves a deferred sync to run', async ({ page }) => {
    await install(page);
    await page.evaluate(() => { window.__holdSections = true; });
    await page.click('#page-cart-link');
    await page.waitForFunction(() => window.__held.length === 1);
    await page.evaluate(() => { window.__held[0].release(); });
    await page.waitForTimeout(150);

    const sectionGetsAfterFailure = await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      window.__holdSections = false;
      const before = window.__log.filter((c) => !c.isMutation).length;
      const realFetch = window.fetch;
      window.fetch = (url, init) => (String(url).includes('/cart/change')
        ? Promise.reject(new TypeError('Failed to fetch'))
        : realFetch(url, init));
      drawer.syncCart().catch(() => {});           // deferred by nothing yet
      try { await drawer.changeLine(1, 5); } catch (_e) { /* expected */ }
      await new Promise((r) => setTimeout(r, 200));
      return window.__log.filter((c) => !c.isMutation).length - before;
    });
    // the read the mutation invalidated is re-issued once the mutation fails
    expect(sectionGetsAfterFailure).toBeGreaterThanOrEqual(1);
  });

  test('R02: opening predictive search closes the cart drawer', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');

    await page.evaluate(() => document.querySelector('predictive-search').setOpen(true));
    await expect(page.locator('predictive-search')).toHaveAttribute('data-open', '');
    await expect(page.locator('cart-drawer')).not.toHaveAttribute('data-open', '');

    const trapped = await page.evaluate(() => {
      const panel = document.querySelector('[data-predictive-search-panel]');
      if (panel.inert) return 'panel inert';
      let el = document.querySelector('predictive-search');
      while (el) { if (el.hasAttribute?.('inert')) return el.tagName; el = el.parentElement; }
      return null;
    });
    expect(trapped).toBeNull();
  });

  test('R03: a transport failure shows the localized message, not "Failed to fetch"', async ({ page }) => {
    await install(page, { transportFails: true });
    await page.evaluate(() => { window.__holdSections = false; });

    const message = await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      try { await drawer.changeLine(1, 2); return null; } catch (error) { return error.message; }
    });
    expect(message).toBe('Cart is unavailable. Please try again.');
    expect(message).not.toContain('Failed to fetch');
  });

  test('R04: removing a closed drawer does not release the open cart scroll lock', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    expect(await page.getAttribute('body', 'data-drawer-open')).not.toBeNull();

    await page.evaluate(() => document.querySelector('theme-drawer').remove());
    await page.waitForTimeout(100);

    expect(await page.getAttribute('body', 'data-drawer-open')).not.toBeNull();
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
  });

  test('R04: closing the last dialog does release the lock', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    await page.click('[data-cart-drawer-close]');
    expect(await page.getAttribute('body', 'data-drawer-open')).toBeNull();
    expect(await page.getAttribute('body', 'data-modal-open')).toBeNull();
  });
});
