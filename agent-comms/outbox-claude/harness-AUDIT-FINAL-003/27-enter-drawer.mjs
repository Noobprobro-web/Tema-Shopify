// P-07: Enter dentro del campo de cantidad del drawer debe actualizar por AJAX sin abandonar el drawer.
// También mide el estado del botón "+" en la ficha al cargar (hallazgo R-02) en una pieza única.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const out = {};
const browser = await launch();
for (const name of (process.argv[2] ? [process.argv[2]] : Object.keys(STORES))) {
  const store = STORES[name];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  // Producto con stock suficiente para pedir 3: en Archive las piezas son únicas, se usa la cápsula de otra
  // tienda no: se toma el primer producto disponible del catálogo con más de 2 unidades vendibles.
  const handle = name === 'archive' ? null : store.products[0];
  const o = (out[name] = {});
  if (handle) {
    await page.goto(store.url + '/products/' + handle, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.locator('main [id$="__main"] .product-form__submit').first().click();
    await page.waitForTimeout(2500);
    const q = page.locator('.cart-drawer__panel [data-cart-quantity]').first();
    const startUrl = page.url();
    const posts = [];
    page.on('request', (r) => { if (r.method() === 'POST') posts.push(r.url().replace(store.url, '').split('?')[0]); });
    await q.fill('3');
    let navigated = false;
    await Promise.all([page.waitForNavigation({ timeout: 5000 }).then(() => { navigated = true; }).catch(() => {}), q.press('Enter')]);
    await page.waitForTimeout(2500);
    o.enter = await page.evaluate(async () => { const c = await (await fetch('/cart.js')).json(); const p = document.querySelector('.cart-drawer__panel'); const a = document.activeElement; return { drawerOpen: !!p && !p.inert, apiCount: c.item_count, domQty: p?.querySelector('[data-cart-quantity]')?.value, subtotal: p?.querySelector('.cart-summary__subtotal strong')?.textContent.trim(), focus: a.localName + '.' + String(a.className).split(/\s+/)[0] + '|' + (a.getAttribute('aria-label') || '').slice(0, 40) }; });
    o.enter.navigated = navigated || page.url() !== startUrl;
    o.enter.url = page.url().replace(store.url, '');
    o.enter.posts = posts;
    await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  } else o.enter = 'no aplicable: todas las piezas tienen 1 unidad';
  // R-02: estado inicial del "+" en la ficha de la primera pieza de la tienda.
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
  await page.waitForTimeout(800);
  o.plusAtLoad = await page.evaluate(() => { const m = document.querySelector('main [id$="__main"]'); const i = m.querySelector('[data-quantity-input]'); const inc = m.querySelector('[data-quantity-button="increase"]'); return { value: i.value, max: i.getAttribute('max'), plusDisabled: inc.disabled }; });
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-27-enter-drawer.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
