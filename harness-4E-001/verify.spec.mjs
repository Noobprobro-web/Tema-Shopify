import { expect, test } from '@playwright/test';

const SECTION = (opts = {}) => {
  const { count = 1, label = '1 item', note = '', qty = 2 } = opts;
  return `<cart-drawer data-item-count="${count}" data-cart-count-label="${label}">
    <div data-cart-drawer-content>
      <textarea id="CartNote" name="note">${note}</textarea>
      <input id="DrawerQuantity-1" type="number" name="updates[]" value="${qty}" min="1" step="1" required data-cart-quantity data-line="1">
    </div>
    <span data-cart-drawer-count>${count}</span>
  </cart-drawer>`;
};

async function install(page, { addResponse } = {}) {
  await page.goto('/fixture.html');
  await page.waitForFunction(() => customElements.get('cart-drawer') !== undefined);
  await page.evaluate(([sectionHtml, addResponse]) => {
    window.__calls = [];
    window.fetch = async (input, init = {}) => {
      const url = String(input);
      window.__calls.push({ url, body: init.body ? String(init.body) : null });

      if (url.includes('/cart/add') || url.includes('/cart/change')) {
        if (addResponse === 'html-500') {
          return new Response('<html><body>502 Bad Gateway</body></html>', {
            status: 502, headers: { 'Content-Type': 'text/html' },
          });
        }
        return new Response(JSON.stringify({ sections: { 'cart-drawer': sectionHtml } }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(sectionHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });
    };
  }, [SECTION(), addResponse ?? null]);
}

test.describe('4B-006 hardening', () => {
  test('F01: opening the cart from the menu closes the menu and keeps the drawer state', async ({ page }) => {
    await install(page);
    await page.click('[data-drawer-trigger]');
    expect(await page.getAttribute('body', 'data-drawer-open')).not.toBeNull();

    await page.click('#menu-cart-link');
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
    await expect(page.locator('theme-drawer')).not.toHaveAttribute('data-open', '');
    // body scroll-lock must survive the menu closing after the cart opened
    expect(await page.getAttribute('body', 'data-drawer-open')).not.toBeNull();

    const blocked = await page.evaluate(() => {
      const panel = document.querySelector('[data-cart-drawer-panel]');
      if (panel.inert) return 'panel inert';
      let el = document.querySelector('cart-drawer');
      while (el) { if (el.hasAttribute?.('inert')) return el.tagName; el = el.parentElement; }
      return null;
    });
    expect(blocked).toBeNull();
  });

  test('F01: opening the menu while the cart is open keeps body[data-drawer-open]', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');

    // The inert background already blocks a *click* on the menu trigger here, which the
    // previous run confirmed. What stays reachable is the programmatic open: the theme
    // editor, a deferred handler, or any trigger outside the inert subtree.
    await page.evaluate(() => document.querySelector('theme-drawer').setOpen(true));
    await expect(page.locator('theme-drawer')).toHaveAttribute('data-open', '');
    await expect(page.locator('cart-drawer')).not.toHaveAttribute('data-open', '');
    // the ordering trap: CartDrawer.close() removes the attribute ThemeDrawer just set
    expect(await page.getAttribute('body', 'data-drawer-open')).not.toBeNull();
  });

  test('F01: the size guide and the cart never hold the trap at the same time', async ({ page }) => {
    await install(page);
    await page.click('[data-size-guide-open]');
    expect(await page.getAttribute('body', 'data-modal-open')).not.toBeNull();

    await page.evaluate(() => document.querySelector('cart-drawer').open());
    await expect(page.locator('size-guide-modal')).not.toHaveAttribute('data-open', '');
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
    expect(await page.getAttribute('body', 'data-modal-open')).toBeNull();
  });

  test('F01: a cart opened from the menu returns focus to the menu trigger', async ({ page }) => {
    await install(page);
    await page.click('[data-drawer-trigger]');
    await page.click('#menu-cart-link');
    await page.click('[data-cart-drawer-close]');
    const focused = await page.evaluate(() => document.activeElement?.dataset?.drawerTrigger !== undefined);
    expect(focused).toBe(true);
  });

  test('F03: the drawer re-renders on every open, not only when item_count moves', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    await page.waitForFunction(() => window.__calls.length > 0);
    const first = await page.evaluate(() => window.__calls.length);
    await page.click('[data-cart-drawer-close]');
    await page.click('#page-cart-link');
    await page.waitForFunction((n) => window.__calls.length > n, first);
    const calls = await page.evaluate(() => window.__calls.map((c) => c.url));
    expect(calls.filter((u) => u.includes('section_id=cart-drawer')).length).toBeGreaterThanOrEqual(2);
    expect(calls.some((u) => u.endsWith('/cart.js'))).toBe(false);
  });

  test('F04: an unsaved order note and focus survive a re-render', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    await page.waitForFunction(() => window.__calls.length > 0);

    await page.fill('#CartNote', 'Please gift wrap');
    await page.evaluate(() => document.querySelector('#CartNote').focus());
    await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      drawer.renderSection(await (await fetch('/cart?section_id=cart-drawer')).text());
    });

    await expect(page.locator('#CartNote')).toHaveValue('Please gift wrap');
    const active = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
    expect(active).toBe('CartNote');
  });

  test('F05: an emptied quantity field does not delete the line', async ({ page }) => {
    await install(page);
    await page.click('#page-cart-link');
    await page.waitForFunction(() => window.__calls.length > 0);
    await page.evaluate(() => { window.__calls.length = 0; });

    await page.evaluate(() => {
      const input = document.querySelector('[data-cart-quantity]');
      input.value = '';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    expect(await page.evaluate(() => window.__calls.filter((c) => c.url.includes('change')).length)).toBe(0);

    await page.evaluate(() => {
      const input = document.querySelector('[data-cart-quantity]');
      input.value = '0';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForFunction(() => window.__calls.some((c) => c.url.includes('change')));
    const body = await page.evaluate(() => JSON.parse(window.__calls.find((c) => c.url.includes('change')).body));
    expect(body.quantity).toBe(0);
  });

  test('F10: an HTML error page surfaces the localized message, not a SyntaxError', async ({ page }) => {
    await install(page, { addResponse: 'html-500' });
    await page.click('#page-cart-link');
    await page.waitForFunction(() => window.__calls.length > 0);

    const message = await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      try { await drawer.changeLine(1, 3); return null; } catch (error) { return error.message; }
    });
    expect(message).toBe('Cart is unavailable. Please try again.');
    expect(message).not.toContain('Unexpected token');
  });

  test('F07: formatMoney covers all eight Shopify tokens through a real consumer', async ({ page }) => {
    await install(page);
    const results = await page.evaluate(() => {
      const ctl = document.querySelector('complete-the-look');
      const out = document.querySelector('[data-bundle-total]');
      const run = (format) => {
        if (format === null) delete ctl.dataset.moneyFormat;
        else ctl.dataset.moneyFormat = format;
        ctl.updateSummary();
        return out.textContent;
      };
      window.theme = { moneyFormat: '€{{amount_with_comma_separator}}' };
      return {
        amount: run('${{amount}}'),
        no_decimals: run('${{amount_no_decimals}}'),
        comma: run('{{amount_with_comma_separator}} €'),
        no_dec_comma: run('{{amount_no_decimals_with_comma_separator}} kr'),
        apostrophe: run("CHF {{amount_with_apostrophe_separator}}"),
        no_dec_space: run('{{amount_no_decimals_with_space_separator}} Ft'),
        space: run('{{amount_with_space_separator}} €'),
        period_space: run('{{amount_with_period_and_space_separator}} CHF'),
        entity: run('&pound;{{amount}}'),
        two_tokens: run('{{amount}} ({{amount}})'),
        garbage_falls_back: run('no token here'),
        missing_falls_back: run(null),
      };
    });

    expect(results.amount).toBe('$1,299.00');
    expect(results.no_decimals).toBe('$1,299');
    expect(results.comma).toBe('1.299,00 €');
    expect(results.no_dec_comma).toBe('1.299 kr');
    expect(results.apostrophe).toBe("CHF 1'299.00");
    expect(results.no_dec_space).toBe('1 299 Ft');
    expect(results.space).toBe('1 299,00 €');
    expect(results.period_space).toBe('1 299.00 CHF');
    expect(results.entity).toBe('£1,299.00');
    expect(results.two_tokens).toBe('1,299.00 (1,299.00)');
    // an unusable format must fall through to the shop format, never render empty
    expect(results.garbage_falls_back).toBe('€1.299,00');
    expect(results.missing_falls_back).toBe('€1.299,00');
  });

  test('F07 (regression guard, passes on both builds): no usable format still renders a price', async ({ page }) => {
    await install(page);
    const results = await page.evaluate(() => {
      const ctl = document.querySelector('complete-the-look');
      const out = document.querySelector('[data-bundle-total]');
      const variant = document.querySelector('[data-bundle-variant]');
      const run = (price) => { variant.dataset.price = price; ctl.updateSummary(); return out.textContent; };
      delete window.theme;
      document.documentElement.dataset.moneyFormat = '';
      ctl.dataset.moneyFormat = 'broken';
      const noFormatAtAll = run('129900');
      ctl.dataset.moneyFormat = '${{amount}}';
      // note: CompleteTheLook coerces price with Number(...) || 0 before formatMoney,
      // so this path cannot exercise the string guard inside formatMoney.
      return { noFormatAtAll, zero: run('0'), garbagePrice: run('abc') };
    });
    // last-resort template, rather than an empty price node
    expect(results.noFormatAtAll).toBe('$1,299.00');
    expect(results.zero).toBe('$0.00');
    expect(results.garbagePrice).toBe('$0.00');
  });
});
