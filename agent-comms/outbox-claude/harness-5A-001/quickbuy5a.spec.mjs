import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Sprint 5A. Coleccion renderizada desde el Liquid real (render5a.mjs) con theme.js y base.css
   reales. SITE=site-es corre la misma bateria sobre el render en espanol. */
// Carpeta con site-en/ y site-es/ generados por render5a.mjs (por defecto, esta misma carpeta).
const ROOT = process.env.HARNESS_DIR || path.dirname(fileURLToPath(import.meta.url));
const SITE = process.env.SITE || 'site-en';
const ES = SITE === 'site-es';
const ADD = JSON.parse(fs.readFileSync(`${ROOT}/${SITE}/add-responses.json`, 'utf8'));
const FX = JSON.parse(fs.readFileSync(`${ROOT}/${SITE}/fixture.json`, 'utf8'));
const L = ES
  ? { quick: 'Añadir rápido', add: 'Añadir al carrito', sold: 'Agotado', size: 'Seleccionar talla', choose: 'Elegir opciones', unavailable: 'Opción no disponible' }
  : { quick: 'Quick add', add: 'Add to cart', sold: 'Sold out', size: 'Select size', choose: 'Choose options', unavailable: 'Option unavailable' };
const variantId = (key, ...options) => FX[key].variants.find((v) => options.every((o, i) => v.options[i] === o)).id;

const card = (page, key) => page.locator(`article.product-card[data-product-id="${FX[key].id}"]`);
// En escritorio la rejilla de 4 columnas con filtros deja tarjetas de ~218px (2 swatches);
// grid: '2' da tarjetas anchas (4 swatches) para las pruebas que recorren los cuatro.
async function go(page, w = 1280, h = 900, { grid = null } = {}) {
  if (grid) await page.addInitScript((value) => { try { localStorage.setItem('theme:grid-columns', value); } catch {} }, grid);
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`/${SITE}/collection.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
}
async function mockAdd(page, { status = 200, delay = 0, body = null } = {}) {
  const posts = [];
  await page.route('**/cart/add.js', async (route) => {
    const form = route.request().postData() || '';
    const id = Number((form.match(/name="id"\r\n\r\n(\d+)/) || [])[1]);
    posts.push(id);
    if (delay) await new Promise((r) => setTimeout(r, delay));
    if (status !== 200) return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(ADD[id]) });
  });
  return posts;
}
const activeInfo = (page) => page.evaluate(() => {
  const a = document.activeElement;
  return { tag: a?.tagName, text: (a?.querySelector('.quick-buy__value-label') || a)?.textContent?.trim().slice(0, 60), inDrawer: Boolean(a?.closest('cart-drawer')), inPanel: Boolean(a?.closest('[data-quick-buy-panel]')), href: a?.getAttribute('href'), trigger: a?.hasAttribute('data-quick-buy-trigger') ?? false, card: a?.closest('article')?.dataset.productId || null };
});

test.describe(`5A Quick Buy y swatches (${SITE})`, () => {
  test('A1 variante unica: un clic, aria-busy, cajon abierto con foco en la linea anadida', async ({ page }) => {
    await go(page);
    const posts = await mockAdd(page, { delay: 250 });
    const button = card(page, 'single').locator('.product-card__form button[name="add"]');
    await expect(button).toHaveText(L.add);
    await expect(card(page, 'single').locator('[data-quick-buy-trigger]')).toHaveCount(0);
    await button.click();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    expect(posts).toEqual([variantId('single', 'Default Title')]);
    const a = await activeInfo(page);
    expect(a.inDrawer).toBe(true);
    expect(a.href).toContain(`variant=${posts[0]}`);
    await page.keyboard.press('Escape');
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(0);
  });

  test('A2 solo talla (escritorio): panel no modal, foco en la primera talla, agotada deshabilitada con texto', async ({ page }) => {
    await go(page);
    const c = card(page, 'sizeOnly');
    const trigger = c.locator('[data-quick-buy-trigger]');
    await expect(trigger).toHaveText(L.quick);
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    const panel = c.locator('[data-quick-buy-panel]');
    await expect(panel).toHaveAttribute('open', '');
    expect(await panel.evaluate((d) => d.matches(':modal'))).toBe(false);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel.locator('.quick-buy__title')).toHaveText(L.size);
    expect((await activeInfo(page)).text).toBe('XS');
    const s = panel.locator('.quick-buy__value[data-option-value="S"]');
    await expect(s).toBeDisabled();
    await expect(s).toHaveAttribute('aria-disabled', 'true');
    await expect(s.locator('[data-quick-buy-state]')).toHaveText(L.sold);
    await expect(s.locator('[data-quick-buy-state]')).not.toHaveAttribute('hidden', '');
    // Flechas saltan la agotada; Escape cierra y devuelve el foco al disparador.
    await page.keyboard.press('ArrowRight');
    expect((await activeInfo(page)).text).toBe('M');
    await page.keyboard.press('End');
    expect((await activeInfo(page)).text).toContain('One Size / Extra Large');
    await page.keyboard.press('Escape');
    await expect(panel).not.toHaveAttribute('open', '');
    expect((await activeInfo(page)).trigger).toBe(true);
    // Clic fuera cierra sin robar el foco.
    await trigger.click();
    await page.locator('.collection-main__title').click();
    await expect(panel).not.toHaveAttribute('open', '');
  });

  test('A3 anadir una talla: POST con su id, panel cerrado, foco en la linea, al cerrar vuelve al disparador', async ({ page }) => {
    await go(page);
    const posts = await mockAdd(page, { delay: 200 });
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').click();
    const m = c.locator('.quick-buy__value[data-option-value="M"]');
    await m.click();
    await expect(m).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    expect(posts).toEqual([variantId('sizeOnly', 'M')]);
    await expect(c.locator('[data-quick-buy-panel]')).not.toHaveAttribute('open', '');
    await expect(c.locator('[data-quick-buy-trigger]')).toHaveAttribute('aria-expanded', 'false');
    expect((await activeInfo(page)).href).toContain(`variant=${posts[0]}`);
    await page.keyboard.press('Escape');
    const a = await activeInfo(page);
    expect(a.trigger).toBe(true);
    expect(a.card).toBe(String(FX.sizeOnly.id));
  });

  test('A4 doble toque en una talla: una sola peticion', async ({ page }) => {
    await go(page);
    const posts = await mockAdd(page, { delay: 400 });
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').click();
    await c.locator('.quick-buy__value[data-option-value="L"]').dblclick();
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    expect(posts.length).toBe(1);
  });

  test('A5 error del servidor: mensaje dentro del panel, panel abierto, talla reactivada', async ({ page }) => {
    await go(page);
    await mockAdd(page, { status: 422, body: { status: 422, message: 'Cart Error', description: 'All 1 Cigarette Trouser - M are in your cart.' } });
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').click();
    const m = c.locator('.quick-buy__value[data-option-value="M"]');
    await m.click();
    const error = c.locator('[data-quick-buy-panel] [data-product-form-error]');
    await expect(error).toHaveText('All 1 Cigarette Trouser - M are in your cart.');
    await expect(error).toBeVisible();
    await expect(c.locator('[data-quick-buy-panel]')).toHaveAttribute('open', '');
    await expect(m).toBeEnabled();
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(0);
  });

  test('B1 color y talla: fila de 4 swatches mas "+1", Ink marcado, radiogroup con nombre', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const c = card(page, 'colorSize');
    const group = c.locator('[data-card-swatches]');
    await expect(group).toHaveAttribute('role', 'radiogroup');
    await expect(group).toHaveAttribute('aria-label', 'Color');
    await expect(c.locator('[data-card-swatch]')).toHaveCount(4);
    await expect(c.locator('.card-swatch-more--wide')).toHaveText('+1');
    await expect(c.locator('.card-swatch-more--wide')).toHaveAttribute('aria-label', ES ? '+1 más' : '+1 more');
    await expect(c.locator('.card-swatch-more--narrow')).toBeHidden();
    const ink = c.locator('[data-card-swatch][data-swatch-value="Ink"]');
    await expect(ink).toHaveAttribute('aria-checked', 'true');
    await expect(ink).toHaveAttribute('aria-label', 'Color: Ink');
    await expect(ink).toHaveAttribute('tabindex', '0');
    await expect(c.locator('[data-card-swatch][tabindex="0"]')).toHaveCount(1);
    // Olive no tiene ninguna talla disponible: marcado como agotado y descrito.
    const olive = c.locator('[data-card-swatch][data-swatch-value="Olive"]');
    await expect(olive).toHaveClass(/card-swatch--sold-out/);
    const described = await olive.getAttribute('aria-describedby');
    expect(await page.locator(`#${described}`).textContent()).toBe(L.sold);
    // Colores nativos, imagen nativa y respaldo por nombre.
    const bg = await c.locator('.card-swatch__color').evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundImage + '|' + getComputedStyle(e).backgroundColor));
    expect(bg).toHaveLength(3);
    expect(bg[0]).toContain('rgb(29, 35, 49)');
    expect(bg[2]).toContain('url(');
    // SW-01: sin swatch nativo se ve el nombre; nunca un color deducido del nombre.
    await expect(olive.locator('.card-swatch__text')).toHaveText('Olive');
    await expect(olive.locator('.card-swatch__color')).toHaveCount(0);
  });

  test('B2 elegir color: imagen, enlaces y tallas cambian juntos; sin foto vuelve a la del producto', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const c = card(page, 'colorSize');
    const img = c.locator('.product-card__image--primary');
    const originalSrc = await img.getAttribute('src');
    await c.locator('[data-card-swatch][data-swatch-value="Bone"]').click();
    await expect(c.locator('[data-card-swatch][data-swatch-value="Bone"]')).toHaveAttribute('aria-checked', 'true');
    await expect(img).toHaveAttribute('src', /doppio-trench/);
    expect(await img.getAttribute('srcset')).toContain('480w');
    await expect(c.locator('product-card-variants')).toHaveAttribute('data-variant-media', '');
    const boneM = variantId('colorSize', 'Bone', 'M');
    for (const link of await c.locator('[data-card-link]').all()) await expect(link).toHaveAttribute('href', `/products/serra-coat?variant=${boneM}`);
    await c.locator('[data-quick-buy-trigger]').click();
    const panel = c.locator('[data-quick-buy-panel]');
    await expect(panel.locator('.quick-buy__value[data-option-value="XS"]')).toBeDisabled();
    await expect(panel.locator('.quick-buy__value[data-option-value="S"]')).toBeDisabled();
    await expect(panel.locator('.quick-buy__value[data-option-value="M"]')).toBeEnabled();
    await expect(panel.locator('.quick-buy__value[data-option-value="M"]')).toHaveAttribute('data-variant-id', String(boneM));
    expect((await activeInfo(page)).text).toBe('M');
    await page.keyboard.press('Escape');
    // Clay: sin XL (combinacion inexistente) => "Opcion no disponible".
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').click();
    await c.locator('[data-quick-buy-trigger]').click();
    const xl = panel.locator('.quick-buy__value[data-option-value="XL"]');
    await expect(xl).toBeDisabled();
    await expect(xl.locator('[data-quick-buy-state]')).toHaveText(L.unavailable);
    await page.keyboard.press('Escape');
    // Olive: ni foto propia ni tallas disponibles. 5A-003 (GPT-AUDIT-005 H2, SW-06): el
    // disparador pasa a "Agotado" e inactivo en vez de abrir un selector sin salida.
    await c.locator('[data-card-swatch][data-swatch-value="Olive"]').click();
    await expect(img).toHaveAttribute('src', originalSrc);
    await expect(c.locator('product-card-variants')).not.toHaveAttribute('data-variant-media', '');
    const trigger = c.locator('[data-quick-buy-trigger]');
    await expect(trigger).toBeDisabled();
    await expect(trigger).toHaveText(L.sold);
    await trigger.click({ force: true });
    await c.locator('product-card-variants').evaluate((el) => el.open());
    await expect(panel).not.toHaveAttribute('open', '');
    // Otro color con existencias devuelve la compra rapida.
    await c.locator('[data-card-swatch][data-swatch-value="Ink"]').click();
    await expect(trigger).toBeEnabled();
    await expect(trigger).toHaveText(L.quick);
    await trigger.click();
    await expect(panel).toHaveAttribute('open', '');
    expect(await panel.locator('.quick-buy__value:not([disabled])').count()).toBeGreaterThan(0);
  });

  test('B3 teclado en swatches: flechas con ciclo, Home y End, tabindex itinerante', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const c = card(page, 'colorSize');
    await c.locator('[data-card-swatch][data-swatch-value="Ink"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Bone"]')).toHaveAttribute('aria-checked', 'true');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Bone"]')).toBeFocused();
    await page.keyboard.press('End');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Olive"]')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Ink"]')).toBeFocused();
    await expect(c.locator('[data-card-swatch][aria-checked="true"]')).toHaveCount(1);
    await expect(c.locator('[data-card-swatch][tabindex="0"]')).toHaveCount(1);
    await page.keyboard.press('Home');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Ink"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('B4 cursor: previsualiza sin seleccionar y restaura al salir', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const c = card(page, 'colorSize');
    const img = c.locator('.product-card__image--primary');
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').hover();
    await expect(img).toHaveAttribute('src', /cocoon-cardigan/);
    await expect(c.locator('[data-card-swatch][data-swatch-value="Ink"]')).toHaveAttribute('aria-checked', 'true');
    await page.mouse.move(2, 2);
    await expect(img).not.toHaveAttribute('src', /cocoon-cardigan/);
  });

  test('B5 color como unica opcion: compra directa sincronizada con el swatch', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const posts = await mockAdd(page);
    const c = card(page, 'colorOnly');
    const button = c.locator('[data-quick-buy-direct]');
    await expect(button).toHaveText(L.add);
    await expect(c.locator('[data-quick-buy-trigger]')).toHaveCount(0);
    await c.locator('[data-card-swatch][data-swatch-value="Grey"]').click();
    await expect(button).toBeDisabled();
    await expect(button).toHaveText(L.sold);
    await c.locator('[data-card-swatch][data-swatch-value="Camel"]').click();
    await expect(button).toBeEnabled();
    await expect(button).toHaveText(L.add);
    await expect(c.locator('[data-quick-buy-id]')).toHaveValue(String(variantId('colorOnly', 'Camel')));
    await button.click();
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    expect(posts).toEqual([variantId('colorOnly', 'Camel')]);
  });

  test('C1 degradaciones: tres opciones, dos opciones libres y suscripcion van a la ficha; agotado deshabilitado', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    for (const key of ['threeOptions', 'sizeFit', 'subscription', 'optionalPlan', 'giftCard', 'manyVariants', 'combined']) {
      const link = card(page, key).locator('.product-card__action a.button');
      await expect(link).toHaveText(L.choose);
      await expect(link).toHaveAttribute('href', FX[key].url);
      await expect(card(page, key).locator('[data-quick-buy-trigger], form')).toHaveCount(0);
    }
    const sold = card(page, 'soldOut').locator('.product-card__action button');
    await expect(sold).toBeDisabled();
    await expect(sold).toHaveText(L.sold);
    // Tres opciones con color: los swatches siguen cambiando imagen y enlace.
    await card(page, 'threeOptions').locator('[data-card-swatch][data-swatch-value="Bone"]').click();
    await expect(card(page, 'threeOptions').locator('.product-card__action a.button')).toHaveAttribute('href', /variant=/);
  });

  test('D1 movil 390: hoja inferior modal, fondo inerte, clic en el fondo y Escape cierran', async ({ page }) => {
    await go(page, 390, 740);
    const c = card(page, 'colorSize');
    await c.locator('[data-quick-buy-trigger]').scrollIntoViewIfNeeded();
    await c.locator('[data-quick-buy-trigger]').click();
    const panel = c.locator('[data-quick-buy-panel]');
    expect(await panel.evaluate((d) => d.matches(':modal'))).toBe(true);
    await page.waitForTimeout(800);
    const box = await panel.boundingBox();
    expect(Math.round(box.y + box.height)).toBe(740);
    expect(Math.round(box.width)).toBe(390);
    await expect(panel.locator('.quick-buy__product')).toBeVisible();
    await expect(page.locator('body')).toHaveAttribute('data-modal-open', '');
    await page.mouse.click(195, 40);
    await expect(panel).not.toHaveAttribute('open', '');
    await expect(page.locator('body')).not.toHaveAttribute('data-modal-open', '');
    expect((await activeInfo(page)).trigger).toBe(true);
    await c.locator('[data-quick-buy-trigger]').click();
    await page.keyboard.press('Escape');
    await expect(panel).not.toHaveAttribute('open', '');
    expect((await activeInfo(page)).trigger).toBe(true);
  });

  test('D2 movil 390: anadir desde la hoja cierra el modal antes de abrir el cajon', async ({ page }) => {
    await go(page, 390, 740);
    const posts = await mockAdd(page, { delay: 150 });
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').scrollIntoViewIfNeeded();
    await c.locator('[data-quick-buy-trigger]').click();
    await c.locator('.quick-buy__value[data-option-value="XL"]').click();
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    await expect(c.locator('[data-quick-buy-panel]')).not.toHaveAttribute('open', '');
    expect(posts).toEqual([variantId('sizeOnly', 'XL')]);
    const a = await activeInfo(page);
    expect(a.inDrawer).toBe(true);
    // El cajon es usable: nada fuera de el queda por encima ni el modal sigue en la capa superior.
    expect(await page.evaluate(() => document.querySelectorAll('dialog:modal').length)).toBe(0);
  });


  test('C2 listado combinado y mas de 250 variantes: swatches como enlaces, sin mapa de variantes', async ({ page }) => {
    await go(page);
    const combined = card(page, 'combined');
    await expect(combined.locator('[data-card-swatch]')).toHaveCount(0);
    await expect(combined.locator('.product-card__swatch-group')).toHaveAttribute('role', 'list');
    await expect(combined.locator('a.card-swatch[aria-label="Color: Bone"]')).toHaveAttribute('href', '/products/doppio-trench-bone');
    await expect(combined.locator('[data-card-variants]')).toHaveCount(0);
    const many = card(page, 'manyVariants');
    await expect(many.locator('[data-card-variants]')).toHaveCount(0);
    await expect(many.locator('[data-card-swatch]')).toHaveCount(0);
    await expect(many.locator('a.card-swatch')).toHaveCount(2);
  });

  test('P1 precio: el color comprometido actualiza precio, oferta y "desde"; el cursor no', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const c = card(page, 'colorSize');
    const values = c.locator('.price__values');
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').hover();
    await expect(values).not.toContainText('$1080.00');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Ink"]')).toHaveAttribute('aria-checked', 'true');
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').click();
    await expect(values.locator('[data-current-price]')).toHaveText('$1080.00');
    await expect(values.locator('[data-compare-price]')).toBeHidden();
    await c.locator('[data-card-swatch][data-swatch-value="Bone"]').click();
    await expect(values.locator('[data-current-price]')).toHaveText('$980.00');
    await expect(values.locator('[data-compare-price]')).toHaveText('$1200.00');
    await expect(values.locator('[data-compare-price]')).toBeVisible();
    await expect(c.locator('[data-sale-badge]')).toBeVisible();
    await c.locator('[data-card-swatch][data-swatch-value="Ink"]').click();
    await expect(values).toContainText(`${ES ? 'Desde' : 'From'}$980.00`);
    await expect(c.locator('[data-sale-badge]')).toBeHidden();
    // Tallas de Ink con precios distintos: cada talla muestra el suyo antes del toque.
    await c.locator('[data-quick-buy-trigger]').click();
    await expect(c.locator('.quick-buy__value[data-option-value="One Size / Extra Large"] [data-quick-buy-price]')).toHaveText('$1020.00');
    await expect(c.locator('.quick-buy__value[data-option-value="M"] [data-quick-buy-price]')).toHaveText('$980.00');
    await page.keyboard.press('Escape');
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').click();
    await c.locator('[data-quick-buy-trigger]').click();
    await expect(c.locator('.quick-buy__value[data-option-value="M"] [data-quick-buy-price]')).toBeHidden();
  });

  test('P2 carrera de imagenes A -> B -> C: gana la ultima', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    await page.route('**/img/doppio-trench-01.jpg*', async (route) => { await new Promise((r) => setTimeout(r, 900)); return route.continue(); });
    const c = card(page, 'colorSize');
    const img = c.locator('.product-card__image--primary');
    await c.locator('[data-card-swatch][data-swatch-value="Bone"]').click();
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').click();
    await expect(img).toHaveAttribute('src', /cocoon-cardigan/);
    await page.waitForTimeout(1300);
    await expect(img).toHaveAttribute('src', /cocoon-cardigan/);
    await expect(img).toHaveAttribute('alt', 'Coat in clay');
  });

  test('P3 cambiar de talla con una alta en vuelo: una sola peticion, con la talla original', async ({ page }) => {
    await go(page);
    const posts = await mockAdd(page, { delay: 600 });
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').click();
    await c.locator('.quick-buy__value[data-option-value="M"]').click();
    await expect(c.locator('.quick-buy__value[data-option-value="L"]')).toBeDisabled();
    await expect(c.locator('[data-quick-buy-panel]')).toHaveAttribute('aria-busy', 'true');
    await c.locator('.quick-buy__value[data-option-value="L"]').click({ force: true });
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    expect(posts).toEqual([variantId('sizeOnly', 'M')]);
    expect((await activeInfo(page)).href).toContain(`variant=${variantId('sizeOnly', 'M')}`);
  });

  test('P4 respuesta 503 en HTML: mensaje localizado, sin falso exito, talla recuperable', async ({ page }) => {
    await go(page);
    await page.route('**/cart/add.js', (route) => route.fulfill({ status: 503, contentType: 'text/html', body: '<html><body>Service unavailable</body></html>' }));
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').click();
    await c.locator('.quick-buy__value[data-option-value="M"]').click();
    const expected = await page.locator('cart-drawer').getAttribute('data-error-message');
    await expect(c.locator('[data-quick-buy-panel] [data-product-form-error]')).toHaveText(expected);
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(0);
    await expect(c.locator('.quick-buy__value[data-option-value="M"]')).toBeEnabled();
    await expect(c.locator('.quick-buy__value[data-option-value="L"]')).toBeEnabled();
    await expect(c.locator('.quick-buy__value[data-option-value="S"]')).toBeDisabled();
  });

  test('P5 Tab no sale del panel de escritorio (ciclo entre Cerrar y las tallas)', async ({ page }) => {
    await go(page);
    const c = card(page, 'sizeOnly');
    await c.locator('[data-quick-buy-trigger]').click();
    await expect(c.locator('.quick-buy__value[data-option-value="XS"]')).toBeFocused();
    await page.waitForTimeout(50);
    await page.keyboard.press('End');
    expect((await activeInfo(page)).text).toContain('One Size');
    await page.keyboard.press('Tab');
    const a = await activeInfo(page);
    expect(a.inPanel).toBe(true);
    expect(await page.evaluate(() => document.activeElement.hasAttribute('data-quick-buy-close'))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    expect((await activeInfo(page)).text).toContain('One Size');
  });

  for (const [w, h, grid, shown, more] of [[390, 740, null, 2, '+3'], [1280, 900, null, 2, '+3'], [1280, 900, '2', 4, '+1']]) {
    test(`S1 swatches visibles a ${w}px (rejilla ${grid || 'por defecto'}): ${shown} mas "${more}" y un tab stop visible`, async ({ page }) => {
      await go(page, w, h, { grid });
      const c = card(page, 'colorSize');
      const visible = await c.locator('[data-card-swatch]').evaluateAll((els) => els.filter((e) => e.getClientRects().length > 0).length);
      expect(visible).toBe(shown);
      const pills = await c.locator('.card-swatch-more').evaluateAll((els) => els.filter((e) => e.getClientRects().length > 0).map((e) => e.textContent.trim()));
      expect(pills).toEqual([more]);
      const stop = await c.locator('[data-card-swatch][tabindex="0"]').evaluateAll((els) => els.map((e) => e.getClientRects().length > 0));
      expect(stop).toEqual([true]);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
    });
  }

  test('S2 si la tarjeta se estrecha y el color comprometido queda oculto, el tab stop pasa al primero visible', async ({ page }) => {
    await go(page, 1280, 900, { grid: '2' });
    const c = card(page, 'colorSize');
    await c.locator('[data-card-swatch][data-swatch-value="Clay"]').click();
    await page.locator('[data-grid-view="4"]').click();
    await expect(c.locator('[data-card-swatch][data-swatch-value="Clay"]')).toBeHidden();
    await expect(c.locator('[data-card-swatch][data-swatch-value="Ink"]')).toHaveAttribute('tabindex', '0');
    await expect(c.locator('[data-card-swatch][data-swatch-value="Clay"]')).toHaveAttribute('aria-checked', 'true');
  });

  for (const [w, h] of [[1280, 900], [390, 740]]) {
    test(`E1 areas de toque >= 44x44 a ${w}px (tarjetas, swatches, +N, panel)`, async ({ page }) => {
      await go(page, w, h);
      await card(page, 'sizeOnly').locator('[data-quick-buy-trigger]').click();
      const small = await page.evaluate(() => {
        const sel = '.product-card [data-card-swatch], .product-card .card-swatch-more, .product-card__action .button, .product-card [data-quick-buy-panel][open] button';
        return [...document.querySelectorAll(sel)].filter((e) => e.getClientRects().length > 0).map((e) => {
          const r = e.getBoundingClientRect();
          return { cls: e.className, text: e.textContent.trim().slice(0, 20), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
        }).filter((r) => r.w < 44 || r.h < 44);
      });
      expect(small).toEqual([]);
    });

    test(`E2 sin desborde horizontal a ${w}px, tambien con el panel abierto y titulo largo`, async ({ page }) => {
      await go(page, w, h);
      await card(page, 'longTitle').locator('[data-quick-buy-trigger]').click();
      const r = await page.evaluate(() => {
        const cardEl = document.querySelector('article.product-card[data-product-id="109"]');
        const panel = cardEl.querySelector('[data-quick-buy-panel]');
        const cr = cardEl.getBoundingClientRect();
        const pr = panel.getBoundingClientRect();
        return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, modal: panel.matches(':modal'), panelInside: panel.matches(':modal') || (pr.left >= cr.left - 0.5 && pr.right <= cr.right + 0.5) };
      });
      expect(r.sw).toBe(r.cw);
      expect(r.panelInside).toBe(true);
    });
  }

  for (const [w, h, open] of [[1280, 900, null], [1280, 900, 'colorSize'], [390, 740, 'sizeOnly']]) {
    test(`F1 axe-core sin violaciones a ${w}px${open ? ' con panel abierto' : ''}`, async ({ page }) => {
      await go(page, w, h);
      if (open) {
        await card(page, open).locator('[data-quick-buy-trigger]').click();
        await page.mouse.move(1, 1);
        await page.waitForTimeout(900);
      }
      await page.addScriptTag({ url: `/${SITE}/axe.min.js` });
      const result = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return r.violations.map((v) => ({ id: v.id, n: v.nodes.length, t: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
      });
      expect(result).toEqual([]);
    });
  }

  test('G1 filtros: color con swatch conserva el contrato del checkbox; activo, vacio y respaldo', async ({ page }) => {
    await go(page);
    const color = page.locator('.facet').filter({ hasText: 'Color' }).first();
    const items = color.locator('.facet__swatch-value');
    await expect(items).toHaveCount(12);
    const inputs = await color.locator('input[type="checkbox"]').evaluateAll((els) => els.map((e) => ({ name: e.name, value: e.value, checked: e.checked, disabled: e.disabled, label: e.getAttribute('aria-label') })));
    expect(inputs.every((i) => i.name === 'filter.v.option.color')).toBe(true);
    expect(inputs.find((i) => i.value === 'ink')).toMatchObject({ checked: true, label: 'Color: Ink' });
    expect(inputs.find((i) => i.value === 'grey').disabled).toBe(true);
    await expect(color.locator('.facet__swatch-value--empty')).toHaveCount(1);
    const ring = await color.locator('input[value="ink"] + .facet__swatch').evaluate((e) => getComputedStyle(e).boxShadow);
    expect(ring).not.toBe('none');
    const noSwatch = await color.locator('input[value="camel"] + .facet__swatch').evaluate((e) => getComputedStyle(e).backgroundImage);
    expect(noSwatch).toContain('repeating-linear-gradient');
    await expect(color.locator('input[value="camel"] ~ .facet__swatch-label')).toHaveText('Camel');
    const unknown = await color.locator('input[value="pistachio"] + .facet__swatch').evaluate((e) => getComputedStyle(e).backgroundImage);
    expect(unknown).toContain('repeating-linear-gradient');
    // Material por nombre, con swatch de imagen; Talla sigue como lista de texto.
    await expect(page.locator('.facet').filter({ hasText: 'Material' }).first().locator('.facet__swatch-value')).toHaveCount(2);
    await expect(page.locator('.facet').filter({ hasText: 'Size' }).first().locator('.facet__value')).toHaveCount(4);
  });

  test('G2 filtros: marcar un swatch y aplicar envia los mismos parametros de siempre (AJAX)', async ({ page }) => {
    await go(page);
    let requested = null;
    await page.route('**/collections/all?*', (route) => { requested ??= route.request().url(); route.fulfill({ status: 500, body: '' }); });
    await page.route('**/collections/all', (route) => route.fulfill({ contentType: 'text/html', body: '<html></html>' }));
    const color = page.locator('.facet').filter({ hasText: 'Color' }).first();
    await color.locator('label[for$="-2"]').first().click();
    await page.locator('.facets__actions button[type="submit"]').click();
    await expect.poll(() => requested).not.toBeNull();
    const url = new URL(requested);
    expect(url.searchParams.getAll('filter.v.option.color').sort()).toEqual(['ink', 'white']);
    expect(url.searchParams.get('section_id')).toBe('template--t__main');
  });

  test('G3 filtros: el foco de teclado se ve sobre el circulo', async ({ page }) => {
    await go(page);
    const input = page.locator('.facet').filter({ hasText: 'Color' }).first().locator('input[value="bone"]');
    await input.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const outline = await input.evaluate((e) => getComputedStyle(e.nextElementSibling).outlineStyle);
    expect(outline).toBe('solid');
    await page.keyboard.press('Space');
    await expect(input).toBeChecked();
  });

  test('H1 producto sin imagen: marcador y compra rapida funcionan', async ({ page }) => {
    await go(page);
    const posts = await mockAdd(page);
    const c = card(page, 'noImage');
    await expect(c.locator('.product-card__media-placeholder')).toHaveCount(1);
    await c.locator('[data-quick-buy-trigger]').click();
    await c.locator('.quick-buy__value[data-option-value="L"]').click();
    await expect(page.locator('cart-drawer[data-open]')).toHaveCount(1);
    expect(posts).toEqual([variantId('noImage', 'L')]);
  });

  test('H2 titulo con comillas y &: aria sin doble escape', async ({ page }) => {
    await go(page);
    const c = card(page, 'longTitle');
    const describedBy = await c.locator('[data-quick-buy-trigger]').getAttribute('aria-describedby');
    const title = await page.locator(`#${describedBy}`).textContent();
    expect(title.trim()).toContain('Placket & "Storm" Collar');
    await expect(c.locator('.quick-buy__product')).toHaveText(/Placket & "Storm" Collar/);
  });
});

test.describe(`5A sin JavaScript (${SITE})`, () => {
  test.use({ javaScriptEnabled: false });
  test('N1 el disparador se oculta y queda el enlace a la ficha; la compra de variante unica sigue siendo un formulario', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/${SITE}/collection.html`);
    const c = card(page, 'sizeOnly');
    await expect(c.locator('[data-quick-buy-trigger]')).toBeHidden();
    await expect(c.locator('.quick-buy__fallback')).toBeVisible();
    await expect(c.locator('.quick-buy__fallback')).toHaveText(L.choose);
    await expect(c.locator('[data-quick-buy-panel]')).toBeHidden();
    await expect(card(page, 'single').locator('form[action="/cart/add"] button[name="add"]')).toBeVisible();
  });
});
