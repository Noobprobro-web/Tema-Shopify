import { test, expect } from '@playwright/test';

/* Sprint 5A-003. Paginas renderizadas desde el Liquid real (render5a3.mjs) con theme.js y
   base.css reales. SITE=site (ingles), site-es (espanol) o site-before (arbol previo, para
   ver que las pruebas detectan los defectos). */
const SITE = process.env.SITE || 'site';
const ES = SITE === 'site-es';
const L = ES
  ? {
    add: 'Añadir al carrito', sold: 'Agotado', planUnavailable: 'Esta opción de compra no está disponible',
    planNotice: 'Esta opción requiere un plan de suscripción que ahora no está disponible.',
    addFailed: 'No se pudo añadir este artículo al carrito.', added: 'Artículo añadido a tu carrito.',
    empty: 'Esta colección está vacía.', browseAll: 'Ver todos los productos',
    noMatch: 'Ningún producto coincide con tu selección.', clearAll: 'Borrar todo',
    rewardsUnlocked: 'Envío gratuito y obsequio desbloqueados',
    decrease: 'Reducir la cantidad de', search: (t) => `Resultados de búsqueda para «${t}»`,
  }
  : {
    add: 'Add to cart', sold: 'Sold out', planUnavailable: 'This purchase option is unavailable',
    planNotice: 'This option requires a subscription plan that is not available right now.',
    addFailed: 'This item could not be added to your cart.', added: 'Item added to your cart.',
    empty: 'This collection is empty.', browseAll: 'Browse all products',
    noMatch: 'No products match your selection.', clearAll: 'Clear all',
    rewardsUnlocked: 'Free shipping and gift unlocked',
    decrease: 'Decrease quantity for', search: (t) => `Search results for “${t}”`,
  };
const TITLE = 'O\'Brien & Co "Care" kit';

async function go(page, file, w = 1280, h = 900) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`/${SITE}/${file}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => customElements.get('cart-drawer') !== undefined);
  await page.evaluate(() => document.fonts.ready);
}
async function countAdds(page, respond) {
  const posts = [];
  await page.route('**/cart/add.js', async (route) => {
    posts.push(route.request().postData() || '');
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(await respond(page)) });
  });
  return posts;
}
// El cajon tal como esta ahora (vacio), con o sin una linea de la variante dada.
const drawerHtml = (page, variantId = null, url = '/products/x') => page.evaluate(({ variantId, url }) => {
  const html = document.querySelector('cart-drawer').outerHTML;
  if (!variantId) return html;
  // outerHTML serializa el atributo vacio como data-cart-drawer-content="".
  return html.replace(/data-cart-drawer-content(="")?>/, `data-cart-drawer-content><h3 class="cart-drawer-item__title"><a href="${url}?variant=${variantId}">x</a></h3>`);
}, { variantId, url });
const sectionId = 'sections--t__cart-drawer';

test.describe(`5A-003 (${SITE})`, () => {
  // ---------- Tarea 1: selling plan sin asignacion ----------
  test('T1a F06 sin plan: boton inactivo, aviso visible, sin pago acelerado ni barra activa', async ({ page }) => {
    await go(page, 'pdp-plan.html');
    const button = page.locator('.product-form__submit');
    await expect(button).toBeDisabled();
    await expect(button.locator('[data-add-to-cart-text]')).toHaveText(L.planUnavailable);
    await expect(page.locator('[data-plan-required-notice]')).toBeVisible();
    await expect(page.locator('[data-plan-required-notice]')).toHaveText(L.planNotice);
    await expect(page.locator('.product-form__dynamic-checkout')).toBeHidden();
    await expect(page.locator('[data-sticky-submit]')).toBeDisabled();
    await expect(page.locator('[data-sticky-label]')).toHaveText(L.planUnavailable);
  });

  test('T1b F06 sin JavaScript: el HTML del servidor ya falla cerrado', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto(`/${SITE}/pdp-plan.html`);
    await expect(page.locator('.product-form__submit')).toBeDisabled();
    await expect(page.locator('[data-plan-required-notice]')).toBeVisible();
    await expect(page.locator('.product-form__dynamic-checkout')).toBeHidden();
    await context.close();
  });

  test('T1c cambio de variante: M exige plan sin asignacion, S vuelve a comprar, L agotada', async ({ page }) => {
    await go(page, 'pdp-plan-mixed.html');
    const button = page.locator('.product-form__submit');
    const label = button.locator('[data-add-to-cart-text]');
    const notice = page.locator('[data-plan-required-notice]');
    const express = page.locator('.product-form__dynamic-checkout');
    await expect(button).toBeEnabled();
    await expect(notice).toBeHidden();
    await expect(express).toBeVisible();
    await page.locator('label[for$="-1-2"]').click();
    await expect(button).toBeDisabled();
    await expect(label).toHaveText(L.planUnavailable);
    await expect(notice).toBeVisible();
    await expect(express).toBeHidden();
    await expect(page.locator('[data-sticky-submit]')).toBeDisabled();
    await page.locator('label[for$="-1-1"]').click();
    await expect(button).toBeEnabled();
    await expect(label).toHaveText(L.add);
    await expect(notice).toBeHidden();
    await expect(express).toBeVisible();
    await expect(page.locator('[data-sticky-submit]')).toBeEnabled();
  });

  test('T1d respuesta 200 sin la linea (forma medida con F06): error localizado, sin exito ni cajon', async ({ page }) => {
    await go(page, 'pdp-normal.html');
    const posts = await countAdds(page, async (p) => ({ sections: { [sectionId]: await drawerHtml(p) } }));
    await page.locator('.product-form__submit').click();
    const error = page.locator('.product-form__form [data-product-form-error]');
    await expect(error).toBeVisible();
    await expect(error).toHaveText(L.addFailed);
    expect(posts).toHaveLength(1);
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(0);
    await expect(page.locator('[data-cart-status]')).toBeHidden();
    await expect(page.locator('.product-form__submit')).toBeEnabled();
  });

  test('T1e respuesta con la variante pero carrito fresco sin su linea: tampoco anuncia exito', async ({ page }) => {
    await go(page, 'pdp-normal.html');
    const id = await page.locator('[data-variant-id]').first().inputValue();
    await countAdds(page, async (p) => ({ variant_id: Number(id), sections: { [sectionId]: await drawerHtml(p) } }));
    await page.locator('.product-form__submit').click();
    await expect(page.locator('.product-form__form [data-product-form-error]')).toHaveText(L.addFailed);
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(0);
  });

  test('T1f alta real (variante en la respuesta y en el cajon): exito y cajon abierto', async ({ page }) => {
    await go(page, 'pdp-normal.html');
    const id = await page.locator('[data-variant-id]').first().inputValue();
    await countAdds(page, async (p) => ({ variant_id: Number(id), sections: { [sectionId]: await drawerHtml(p, id, '/products/wool-waistcoat-5a3') } }));
    await page.locator('.product-form__submit').click();
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    await expect(page.locator('[data-cart-status]')).toHaveText(L.added);
    await expect(page.locator('.product-form__form [data-product-form-error]')).toBeHidden();
  });

  // ---------- Tarea 3: doble escape ----------
  test('T3a titulo con apostrofo, & y comillas: aria-label y plantillas con el texto real', async ({ page }) => {
    await go(page, 'pdp-plan-mixed.html');
    const decrease = await page.locator('[data-quantity-button="decrease"]').first().getAttribute('aria-label');
    expect(decrease).toBe(`${L.decrease} ${TITLE}`);
    const sticky = await page.locator('[data-sticky-submit]').getAttribute('aria-label');
    expect(sticky).toContain(TITLE);
    expect(sticky).not.toMatch(/&(amp|#39|quot);/);
    const template = await page.locator('sticky-cart-bar').evaluate((el) => el.dataset.quantityLabelTemplate);
    expect(template).toContain(TITLE);
  });

  test('T3b busqueda con & y <b>: el titulo visible no muestra entidades ni inyecta HTML', async ({ page }) => {
    await go(page, 'search-escape.html');
    const h1 = page.locator('main h1');
    await expect(h1).toHaveText(L.search('Niño & O\'Brien <b>'));
    await expect(h1.locator('b')).toHaveCount(0);
  });

  // ---------- Tarea 4: ancho del logo ----------
  for (const ratio of ['wide', 'square', 'tall']) {
    test(`T4 logo ${ratio}: el ajuste cambia el ancho pintado (80 y 240 px) en escritorio`, async ({ page }) => {
      const widths = {};
      for (const setting of [80, 240]) {
        await go(page, `header-logo-${ratio}-${setting}.html`);
        const box = await page.locator('.site-header__logo-image').boundingBox();
        widths[setting] = box;
        expect(Math.round(box.width)).toBe(setting);
      }
      const aspect = { wide: 4, square: 1, tall: 0.5 }[ratio];
      expect(Math.abs(widths[240].width / widths[240].height - aspect)).toBeLessThan(0.02);
    });
  }

  test('T4 movil 390: un logo ancho a 240 px se contiene en su columna, sin tapar los iconos', async ({ page }) => {
    await go(page, 'header-logo-wide-240.html', 390, 800);
    const logo = await page.locator('.site-header__logo-image').boundingBox();
    const actions = await page.locator('.site-header__actions').boundingBox();
    expect(logo.x + logo.width).toBeLessThanOrEqual(actions.x + 0.5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test('T4 movil 390: un logo vertical o cuadrado a 240 px no agranda la cabecera fija (alto 3rem, sin deformar)', async ({ page }) => {
    for (const [ratio, aspect] of [['tall', 0.5], ['square', 1]]) {
      await go(page, `header-logo-${ratio}-240.html`, 390, 800);
      const logo = await page.locator('.site-header__logo-image').boundingBox();
      const header = await page.locator('.site-header').boundingBox();
      expect(Math.round(logo.height)).toBe(48);
      expect(Math.abs(logo.width / logo.height - aspect)).toBeLessThan(0.02);
      expect(header.height).toBeLessThanOrEqual(80);
    }
  });

  // ---------- Tarea 5: menu secundario ----------
  test('T5 secondary_menu por defecto (igual al principal) no se duplica; un menu propio si se pinta', async ({ page }) => {
    await go(page, 'header-default.html');
    await expect(page.locator('.site-header__secondary')).toHaveCount(0);
    await expect(page.locator('.drawer-panel__secondary')).toHaveCount(0);
    await go(page, 'header-secondary.html');
    await expect(page.locator('.site-header__secondary a')).toHaveText(['About', 'FAQ', 'Support']);
    await expect(page.locator('.drawer-panel__secondary a')).toHaveCount(3);
  });

  // ---------- Tarea 6: cajon neutro ----------
  test('T6 progreso por niveles apagado por defecto; encendido, copy neutro sin doble escape', async ({ page }) => {
    await go(page, 'drawer-default.html');
    await expect(page.locator('.cart-rewards')).toHaveCount(0);
    await go(page, 'drawer-tiered.html');
    await expect(page.locator('.cart-rewards__message')).toHaveText(L.rewardsUnlocked);
    expect(await page.locator('.cart-rewards__track').getAttribute('aria-valuetext')).toBe(L.rewardsUnlocked);
    expect(await page.locator('cart-drawer').innerHTML()).not.toMatch(/atelier/i);
  });

  // ---------- Tarea 7: marca en la cabecera movil ----------
  for (const [w, file] of [[360, 'header-default.html'], [390, 'header-default.html'], [360, 'header-count.html'], [390, 'header-count.html']]) {
    test(`T7 ${w}px ${file}: LINEA NOVE entera, iconos de 44 px, contador fuera de flujo`, async ({ page }) => {
      await go(page, file, w, 800);
      const m = await page.evaluate(() => {
        const text = document.querySelector('.site-header__brand-text');
        const box = (s) => document.querySelector(s)?.getBoundingClientRect();
        const count = document.querySelector('.site-header__cart-count');
        return {
          truncated: text.scrollWidth > text.clientWidth, font: getComputedStyle(text).fontSize,
          brandRight: box('.site-header__brand').right, actionsLeft: box('.site-header__actions').left,
          cart: box('.site-header__cart'), count: count && !count.hidden ? count.getBoundingClientRect() : null,
          countText: count?.textContent, overflow: document.documentElement.scrollWidth - innerWidth,
          targets: Array.from(document.querySelectorAll('.site-header__actions > *, .site-header__menu-button')).map((el) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }).filter(([a, b]) => a && b),
        };
      });
      expect(m.truncated).toBe(false);
      expect(m.font).toBe('17.6px');
      expect(m.brandRight).toBeLessThanOrEqual(m.actionsLeft + 0.5);
      expect(m.overflow).toBeLessThanOrEqual(0);
      for (const [tw, th] of m.targets) { expect(tw).toBeGreaterThanOrEqual(44); expect(th).toBeGreaterThanOrEqual(44); }
      expect(Math.round(m.cart.width)).toBe(44);
      if (file === 'header-count.html') {
        expect(m.countText).toBe('3');
        expect(m.count.left).toBeGreaterThanOrEqual(m.cart.left);
        expect(m.count.right).toBeLessThanOrEqual(m.cart.right + 0.5);
        expect(m.count.top).toBeGreaterThanOrEqual(m.cart.top);
      } else {
        expect(m.count).toBeNull();
      }
    });
  }

  test('T7 escritorio: la marca conserva su tamano (1.6rem) y el contador no ensancha el carrito', async ({ page }) => {
    await go(page, 'header-count.html', 1280, 900);
    const font = await page.locator('.site-header__brand-text').evaluate((el) => getComputedStyle(el).fontSize);
    expect(font).toBe('25.6px');
    expect(Math.round((await page.locator('.site-header__cart').boundingBox()).width)).toBe(44);
  });

  // ---------- Tarea 8: coleccion vacia ----------
  test('T8a coleccion vacia sin filtros: lo dice y lleva a todo el catalogo', async ({ page }) => {
    await go(page, 'collection-empty.html');
    const empty = page.locator('.collection-products__empty');
    await expect(empty.locator('p')).toHaveText(L.empty);
    await expect(empty.locator('a')).toHaveText(L.browseAll);
    await expect(empty.locator('a')).toHaveAttribute('href', '/collections/all');
  });

  test('T8b sin resultados con un filtro activo: "sin coincidencias" y "Borrar todo" con el orden', async ({ page }) => {
    await go(page, 'collection-empty-filtered.html');
    const empty = page.locator('.collection-products__empty');
    await expect(empty.locator('p')).toHaveText(L.noMatch);
    await expect(empty.locator('a')).toHaveText(L.clearAll);
    await expect(empty.locator('a')).toHaveAttribute('href', '/collections/winter-edit?sort_by=price-ascending');
  });

  test('T8c la coleccion "all" vacia no enlaza a si misma', async ({ page }) => {
    await go(page, 'collection-all-empty.html');
    await expect(page.locator('.collection-products__empty p')).toHaveText(L.empty);
    await expect(page.locator('.collection-products__empty a')).toHaveCount(0);
  });

  // ---------- axe en las superficies tocadas ----------
  for (const [file, w] of [['pdp-plan.html', 1280], ['pdp-plan-mixed.html', 390], ['collection-empty.html', 1280], ['header-count.html', 390], ['drawer-tiered.html', 1280]]) {
    test(`AXE ${file} a ${w}px sin violaciones WCAG 2.2 AA`, async ({ page }) => {
      await go(page, file, w, 900);
      if (file === 'drawer-tiered.html') await page.locator('cart-drawer').evaluate((el) => el.open());
      await page.addScriptTag({ url: `/${SITE}/axe.min.js` });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      });
      expect(violations).toEqual([]);
    });
  }
});
