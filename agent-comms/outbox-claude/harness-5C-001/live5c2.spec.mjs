import { test, expect } from '@playwright/test';

/* 5C-002. Comprobaciones de la auditoria en vivo que la tienda no deja hacer: E1 con varios
   desplegables (la tienda solo tiene uno), foco tapado por el panel (WCAG 2.4.11) y la copia
   que se elige para una tarjeta 4:5 con foto apaisada. Mismo arnes que 5C-001:
   SITE=site-live (theme.js y mega-menu.liquid de d5a7d62) o site-patch (con los parches).
   SPEC=live5c2.spec.mjs para ejecutar este archivo. */
const SITE = process.env.SITE || 'site-live';

async function go(page, file = 'mega.html', w = 1280, h = 900) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`/${SITE}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
const toggle = (page, name) => page.locator('.desktop-nav__toggle', { hasText: name });
const disclosure = (page, name) => page.locator('.desktop-nav__disclosure', { has: toggle(page, name) });
const panel = (page, name) => disclosure(page, name).locator('[data-disclosure-panel]');
const openNames = (page) => page.$$eval('.desktop-nav theme-disclosure[data-open] .desktop-nav__toggle', (els) => els.map((el) => el.textContent.trim()));

test.describe(`5C-002 en laboratorio (${SITE})`, () => {
  test('E1 teclado, flecha, raton y editor: abrir un desplegable cierra el que estaba abierto', async ({ page }) => {
    await go(page);
    // Enter en Catalog y, sin cerrarlo, Enter en Journal.
    await toggle(page, 'Catalog').focus();
    await page.keyboard.press('Enter');
    await toggle(page, 'Journal').focus();
    await page.keyboard.press('Enter');
    expect(await openNames(page)).toEqual(['Journal']);
    await expect(panel(page, 'Catalog')).toBeHidden();

    // Flecha abajo desde Atelier con Journal abierto: abre Atelier, entra en el y cierra Journal.
    await toggle(page, 'Atelier').focus();
    await page.keyboard.press('ArrowDown');
    expect(await openNames(page)).toEqual(['Atelier']);
    await expect(panel(page, 'Atelier').locator('a').first()).toBeFocused();

    // Raton.
    await page.keyboard.press('Escape');
    await toggle(page, 'Catalog').click();
    await toggle(page, 'Journal').click();
    expect(await openNames(page)).toEqual(['Journal']);

    // Editor de temas (E2): seleccionar el bloque de Atelier abre Atelier y cierra Journal;
    // deseleccionarlo lo cierra.
    const block = panel(page, 'Atelier').locator('.mega-menu__promos');
    await block.evaluate((el) => el.dispatchEvent(new CustomEvent('shopify:block:select', { bubbles: true })));
    expect(await openNames(page)).toEqual(['Atelier']);
    await block.evaluate((el) => el.dispatchEvent(new CustomEvent('shopify:block:deselect', { bubbles: true })));
    expect(await openNames(page)).toEqual([]);
  });

  test('2.4.11 con Catalog abierto, Tab hasta el contenido: el panel se cierra y el enlace enfocado se ve entero', async ({ page }) => {
    await go(page);
    await toggle(page, 'Catalog').focus();
    await page.keyboard.press('Enter');
    let steps = 0;
    while (steps < 60 && !(await page.evaluate(() => document.activeElement?.matches('main a[href="/after"]')))) {
      await page.keyboard.press('Tab');
      steps += 1;
    }
    expect(steps).toBeLessThan(60);
    const r = await page.evaluate(() => {
      const a = document.activeElement;
      const box = a.getBoundingClientRect();
      const covers = [...document.querySelectorAll('[data-disclosure-panel]')].filter((p) => !p.hidden).map((p) => {
        const q = p.getBoundingClientRect();
        const w = Math.max(0, Math.min(box.right, q.right) - Math.max(box.left, q.left));
        const h = Math.max(0, Math.min(box.bottom, q.bottom) - Math.max(box.top, q.top));
        return Math.round((w * h * 100) / (box.width * box.height));
      });
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return { covered: Math.max(0, ...covers), hitIsTarget: a === hit || a.contains(hit) };
    });
    expect(await openNames(page)).toEqual([]);
    expect(r.covered).toBe(0);
    expect(r.hitIsTarget).toBe(true);
  });

  test('2.4.11 dentro de la cabecera nada cambia: Tab al siguiente disparador deja el panel y Shift+Tab vuelve a el', async ({ page }) => {
    await go(page);
    await toggle(page, 'Catalog').focus();
    await page.keyboard.press('Enter');
    await panel(page, 'Catalog').locator('a').last().focus();
    await page.keyboard.press('Tab');
    await expect(toggle(page, 'Journal')).toBeFocused();
    expect(await openNames(page)).toEqual(['Catalog']);
    await page.keyboard.press('Shift+Tab');
    await expect(panel(page, 'Catalog').locator('a').last()).toBeFocused();
  });

  for (const dpr of [1.25, 2]) {
    test(`Tarjeta 4:5 con foto apaisada a DPR ${dpr}: la copia elegida cubre el ancho pintado`, async ({ browser }) => {
      const context = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`/${SITE}/mega-landscape.html`, { waitUntil: 'networkidle' });
      await toggle(page, 'Catalog').click();
      await page.waitForFunction(() => [...document.querySelectorAll('#' + CSS.escape(document.querySelector('.desktop-nav__toggle[aria-expanded="true"]').getAttribute('aria-controls')) + ' .mega-menu__promo-image')].every((img) => img.complete && img.naturalWidth > 0));
      await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))));
      const cards = await page.$$eval('.desktop-nav__disclosure[data-open] .mega-menu__promo-image', (imgs, ratio) => imgs.map((img) => {
        const box = img.getBoundingClientRect();
        // Proporcion de la foto por sus atributos width y height (naturalWidth sale redondeado
        // tras aplicar la densidad del srcset).
        const aspect = img.getAttribute('width') / img.getAttribute('height');
        const painted = aspect > 0.8 ? box.height * aspect : box.width;
        const chosen = Number(new URL(img.currentSrc).searchParams.get('width'));
        const largest = Math.max(...img.srcset.split(',').map((c) => parseInt(c.trim().split(' ')[1], 10)));
        return { src: img.currentSrc.split('/').pop(), box: Math.round(box.width), painted: Math.round(painted), need: Math.round(painted * ratio), chosen, largest };
      }), dpr);
      console.log(JSON.stringify({ dpr, cards }));
      expect(cards).toHaveLength(2);
      for (const c of cards) expect(c.chosen >= c.need || c.chosen === c.largest).toBe(true);
      // La foto apaisada necesita mas que la de su caja: 537 px pintados en una tarjeta de 240.
      expect(cards[0].painted).toBeGreaterThan(cards[0].box * 2);
      await context.close();
    });
  }
});
