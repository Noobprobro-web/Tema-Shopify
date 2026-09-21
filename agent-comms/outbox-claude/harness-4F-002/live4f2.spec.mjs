import { test, expect } from '@playwright/test';
import fs from 'node:fs';

/* Sprint 4F-002. Paginas renderizadas desde el Liquid real (r4f2/render4f2.mjs). Con
   BUILD=before corren contra el arbol previo al sprint para demostrar que cada guarda muerde. */
const ROOT = '/tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/harness';
const DIR = process.env.BUILD === 'before' ? '/r4f2-before' : '/r4f2';
const EMPTY = JSON.parse(fs.readFileSync(`${ROOT}${DIR}/sections-empty.json`, 'utf8'));
const go = async (page, file, w, h) => {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${DIR}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.waitForTimeout(200);
};

test.describe('4F-002 fricciones comerciales de GPT-AUDIT-002', () => {
  test('T1 la barra fija confirma cantidad y total, y vuelve al precio unitario con 1', async ({ page }) => {
    await go(page, 'pdp-multi.html', 390, 690);
    const bar = async () => page.evaluate(() => {
      const b = document.querySelector('sticky-cart-bar');
      const total = b.querySelector('[data-sticky-total]');
      const meta = b.querySelector('.sticky-cart-bar__meta');
      return {
        price: b.querySelector('[data-sticky-price]').textContent.trim(),
        total: total && !total.hidden ? total.textContent.trim() : null,
        totalFits: total && !total.hidden ? total.getBoundingClientRect().right <= meta.getBoundingClientRect().right + 0.5 : null,
        aria: b.querySelector('[data-sticky-submit]').getAttribute('aria-label'),
        pdpTotal: document.querySelector('[data-line-total-current]').textContent.trim(),
      };
    });
    expect((await bar()).price).toBe('$980.00');
    await page.click('[data-quantity-button="increase"]');
    await page.waitForTimeout(100);
    let r = await bar();
    expect(r.price).toBe('2 × $980.00');
    expect(r.total).toBe('Total $1,960.00');
    expect(r.total).toContain(r.pdpTotal);
    expect(r.totalFits).toBe(true);
    expect(r.aria).toContain('quantity 2');
    await page.fill('[data-quantity-input]', '3');
    await page.dispatchEvent('[data-quantity-input]', 'change');
    await page.waitForTimeout(100);
    r = await bar();
    expect([r.price, r.total]).toEqual(['3 × $980.00', 'Total $2,940.00']);
    await page.fill('[data-quantity-input]', '1');
    await page.dispatchEvent('[data-quantity-input]', 'change');
    await page.waitForTimeout(100);
    r = await bar();
    expect([r.price, r.total]).toEqual(['$980.00', null]);
    expect(r.aria).not.toContain('quantity');
  });

  for (const file of ['cart.html', 'cart-long.html']) {
    for (const w of [1440, 1280, 1024, 768, 390, 360]) {
      test(`T2 /cart sin desborde horizontal: ${file} a ${w}px`, async ({ page }) => {
        await go(page, file, w, 900);
        const r = await page.evaluate(() => {
          const de = document.documentElement;
          const edges = [...document.querySelectorAll('.cart-item__controls > *')].map((e) => Math.round(e.getBoundingClientRect().right));
          return { sw: de.scrollWidth, cw: de.clientWidth, maxRight: Math.max(...edges) };
        });
        expect(r.sw).toBe(r.cw);
        expect(r.maxRight).toBeLessThanOrEqual(r.cw);
      });
    }
  }

  test('T2 borrar desde el cajon en /cart actualiza tambien la pagina, en la misma llamada', async ({ page }) => {
    await go(page, 'cart.html', 1440, 900);
    let body = null;
    await page.route('**/cart/change.js', async (route) => {
      body = JSON.parse(route.request().postData() || '{}');
      const sections = {};
      for (const id of body.sections || []) if (EMPTY[id]) sections[id] = EMPTY[id];
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 0, items: [], sections }) });
    });
    await page.route('**/cart?section_id=*', (route) => route.fulfill({ contentType: 'text/html', body: '' }));
    await page.click('.site-header__cart');
    await page.waitForTimeout(400);
    await page.click('cart-drawer [data-cart-remove]');
    await page.waitForTimeout(600);
    expect(body.sections).toEqual(['sections--t__cart-drawer', 'template--t__cart']);
    expect(await page.locator('main .cart-item').count()).toBe(0);
    expect(await page.locator('main .cart-empty').count()).toBe(1);
  });

  test('T2 si la respuesta no trae la pagina, se pide aparte y la pagina queda igual al cajon', async ({ page }) => {
    await go(page, 'cart.html', 1440, 900);
    let pageRequests = 0;
    await page.route('**/cart/change.js', (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ item_count: 0, items: [], sections: { 'sections--t__cart-drawer': EMPTY['sections--t__cart-drawer'] } }) }));
    await page.route('**/cart?section_id=template--t__cart', (route) => { pageRequests += 1; return route.fulfill({ contentType: 'text/html', body: EMPTY['template--t__cart'] }); });
    await page.click('.site-header__cart');
    await page.waitForTimeout(400);
    await page.click('cart-drawer [data-cart-remove]');
    await page.waitForTimeout(600);
    expect(pageRequests).toBe(1);
    expect(await page.locator('main .cart-empty').count()).toBe(1);
  });

  test('T3 acordeones de la ficha: cerrados, se abren con clic y con teclado, flecha girada', async ({ page }) => {
    await go(page, 'pdp-multi.html', 1440, 900);
    const tabs = page.locator('details.product-details__accordion');
    expect(await tabs.count()).toBe(2);
    expect(await tabs.first().getAttribute('open')).toBeNull();
    const h = await page.locator('.product-details__summary').first().evaluate((e) => e.getBoundingClientRect().height);
    expect(h).toBeGreaterThanOrEqual(44);
    await page.locator('.product-details__summary').first().click();
    // La flecha gira con --motion-base (0.68 s en el modo subtle).
    await page.waitForTimeout(900);
    expect(await tabs.first().getAttribute('open')).toBe('');
    const rot = await page.locator('.product-details__icon').first().evaluate((e) => getComputedStyle(e).transform);
    expect(rot.startsWith('matrix(-1')).toBe(true);
    await page.locator('.product-details__summary').nth(1).focus();
    await page.keyboard.press('Enter');
    expect(await tabs.nth(1).getAttribute('open')).toBe('');
    const vis = await page.locator('.product-details__content').nth(1).isVisible();
    expect(vis).toBe(true);
  });

  test('T4 el bundle dice "1 of 3 items selected" con una sola pieza marcada', async ({ page }) => {
    await go(page, 'bundle.html', 1440, 900);
    const boxes = page.locator('complete-the-look input[type="checkbox"]');
    await boxes.nth(1).uncheck();
    await boxes.nth(2).uncheck();
    await page.waitForTimeout(150);
    expect((await page.textContent('[data-bundle-count]')).trim()).toBe('1 of 3 items selected');
    await boxes.nth(1).check();
    await page.waitForTimeout(150);
    expect((await page.textContent('[data-bundle-count]')).trim()).toBe('2 of 3 items selected');
  });

  for (const w of [360, 390, 430]) {
    test(`Cabecera movil: "LINEA NOVE" no pisa los iconos a ${w}px`, async ({ page }) => {
      await go(page, 'home.html', w, 690);
      const r = await page.evaluate(() => {
        const brand = document.querySelector('.site-header__brand-text').getBoundingClientRect();
        const actions = document.querySelector('.site-header__actions').getBoundingClientRect();
        const menu = document.querySelector('.site-header__menu-button');
        return { overlap: Math.max(0, brand.right - actions.left), menuName: menu.textContent.trim(), menuW: Math.round(menu.getBoundingClientRect().width) };
      });
      expect(r.overlap).toBe(0);
      expect(r.menuName).toBe('Menu');
      expect(r.menuW).toBeGreaterThanOrEqual(44);
    });
  }
});
