import { expect, test } from '@playwright/test';

const overflowOf = (page, sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  const r = el.getBoundingClientRect();
  return {
    scrollW: el.scrollWidth, clientW: el.clientWidth,
    right: Math.round(r.right), viewport: document.documentElement.clientWidth,
    docScrollW: document.documentElement.scrollWidth,
  };
}, sel);

async function installFetch(page) {
  await page.evaluate(() => {
    window.__calls = [];
    const hostile = document.querySelector('[data-cart-drawer-content]').innerHTML;
    const section = (qty) => `<cart-drawer data-item-count="${qty}" data-cart-count-label="${qty} items"><div data-cart-drawer-content>${hostile.replace(/value="\d+"/, `value="${qty}"`)}</div><span data-cart-drawer-count>${qty}</span></cart-drawer>`;
    window.__qty = 2;
    window.fetch = (input, init = {}) => {
      const url = String(input);
      const body = init.body && typeof init.body === 'string' ? JSON.parse(init.body) : null;
      window.__calls.push({ url, body });
      if (url.includes('/cart/change')) {
        window.__qty = body.quantity;
        // Como Shopify: la seccion se renderiza en el momento de procesar ESTA peticion,
        // no cuando la respuesta llega. Una respuesta tardia trae HTML viejo.
        const html = section(window.__qty);
        // Latencia inversa al orden de salida: la primera peticion responde la ultima,
        // asi el reordenamiento es determinista (el peor caso, no uno aleatorio).
        window.__changeCalls = (window.__changeCalls || 0) + 1;
        const delay = Math.max(10, 130 - window.__changeCalls * 10);
        return new Promise((r) => setTimeout(() => r(new Response(JSON.stringify({ sections: { 'cart-drawer': html } }), { status: 200, headers: { 'Content-Type': 'application/json' } })), delay));
      }
      return Promise.resolve(new Response(section(window.__qty), { status: 200, headers: { 'Content-Type': 'text/html' } }));
    };
  });
}

test.describe('4D-001 rómpelo todo', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('titulo de 160 caracteres con token de 60 sin espacios no desborda la tarjeta ni la pagina', async ({ page }) => {
    await page.goto('/stress.html');
    await page.waitForTimeout(200);
    const card = await overflowOf(page, '#card-long');
    const title = await overflowOf(page, '#card-long .product-card__title');
    expect(card.scrollW, 'card scrollWidth <= clientWidth').toBeLessThanOrEqual(card.clientW + 1);
    expect(title.scrollW, 'title scrollWidth <= clientWidth').toBeLessThanOrEqual(title.clientW + 1);
    expect(card.docScrollW, 'sin scroll horizontal de pagina').toBeLessThanOrEqual(card.viewport);
    // y las dos tarjetas siguen alineadas en la misma fila (la larga no empujo a la otra)
    const rows = await page.evaluate(() => [...document.querySelectorAll('.product-card')].map((c) => Math.round(c.getBoundingClientRect().top)));
    expect(rows[0]).toBe(rows[1]);
  });

  test('modal de guia de tallas con titulo hostil: abre, no desborda, Escape cierra y devuelve foco', async ({ page }) => {
    await page.goto('/stress.html');
    await page.waitForTimeout(200);
    await page.click('[data-size-guide-open]');
    await expect(page.locator('size-guide-modal')).toHaveAttribute('data-open', '');
    const t = await overflowOf(page, '#sg-title');
    expect(t.scrollW).toBeLessThanOrEqual(t.clientW + 1);
    const panel = await overflowOf(page, '[data-size-guide-panel]');
    expect(panel.right).toBeLessThanOrEqual(panel.viewport);
    // foco dentro
    expect(await page.evaluate(() => document.querySelector('size-guide-modal').contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('size-guide-modal')).not.toHaveAttribute('data-open', '');
    expect(await page.evaluate(() => document.activeElement?.hasAttribute('data-size-guide-open'))).toBe(true);
  });

  test('cart drawer: linea con titulo hostil y 6 opciones largas no desborda el panel', async ({ page }) => {
    await page.goto('/stress.html');
    await installFetch(page);
    await page.click('#page-cart-link');
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
    await page.waitForTimeout(200);
    const line = await overflowOf(page, '#line-long');
    const panel = await overflowOf(page, '[data-cart-drawer-panel]');
    expect(line.scrollW).toBeLessThanOrEqual(line.clientW + 1);
    expect(panel.scrollW, 'el panel no scrollea horizontalmente').toBeLessThanOrEqual(panel.clientW + 1);
  });

  test('cart drawer: la trampa de foco es impenetrable con Tab y Shift+Tab', async ({ page }) => {
    await page.goto('/stress.html');
    await installFetch(page);
    await page.click('#page-cart-link');
    await expect(page.locator('cart-drawer')).toHaveAttribute('data-open', '');
    await page.waitForTimeout(150);
    const inside = () => page.evaluate(() => document.querySelector('[data-cart-drawer-panel]').contains(document.activeElement));
    for (let i = 0; i < 12; i += 1) { await page.keyboard.press('Tab'); expect(await inside(), `Tab #${i + 1}`).toBe(true); }
    for (let i = 0; i < 12; i += 1) { await page.keyboard.press('Shift+Tab'); expect(await inside(), `Shift+Tab #${i + 1}`).toBe(true); }
    await page.keyboard.press('Escape');
    await expect(page.locator('cart-drawer')).not.toHaveAttribute('data-open', '');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('page-cart-link');
  });

  test('cart drawer: apertura y cierre rapidos (10 ciclos) dejan un solo estado coherente', async ({ page }) => {
    await page.goto('/stress.html');
    await installFetch(page);
    const baselineInert = await page.evaluate(() => document.querySelectorAll('[inert]').length);
    for (let i = 0; i < 10; i += 1) {
      await page.evaluate(() => document.querySelector('cart-drawer').open(document.getElementById('page-cart-link')));
      await page.evaluate(() => document.querySelector('cart-drawer').close(true));
    }
    await page.waitForTimeout(300);
    const s = await page.evaluate(() => ({
      open: document.querySelector('cart-drawer').hasAttribute('data-open'),
      bodyLock: document.body.hasAttribute('data-drawer-open'),
      panelInert: document.querySelector('[data-cart-drawer-panel]').inert,
      inertLeft: document.querySelectorAll('[inert]').length,
      pageInert: document.getElementById('page').hasAttribute('inert'),
      pending: document.querySelector('cart-drawer').pendingMutations,
    }));
    expect(s.open).toBe(false);
    expect(s.bodyLock).toBe(false);
    expect(s.panelInert).toBe(true);
    // los paneles cerrados nacen inert (cart + size guide); lo que no puede pasar es que
    // el contenido de la pagina se quede inert tras cerrar
    expect(s.inertLeft, 'no queda inert de mas').toBe(baselineInert);
    expect(s.pageInert, '<main> no se queda inert').toBe(false);
    expect(s.pending).toBe(0);
  });

  test('rafaga de 12 cambios de cantidad con latencias desordenadas: el DOM termina en el ultimo valor', async ({ page }) => {
    await page.goto('/stress.html');
    await installFetch(page);
    await page.click('#page-cart-link');
    await page.waitForTimeout(200);
    await page.evaluate(() => { window.__calls.length = 0; });

    const finalQty = await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      const seq = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      // sin await entre ellas: todas en vuelo a la vez
      const ps = seq.map((q) => drawer.changeLine(1, q).catch(() => {}));
      await Promise.all(ps);
      await new Promise((r) => setTimeout(r, 250));
      return {
        dom: document.querySelector('[data-cart-quantity]').value,
        server: window.__qty,
        pending: drawer.pendingMutations,
        error: document.querySelector('[data-cart-error]').textContent.trim(),
      };
    });
    expect(finalQty.pending).toBe(0);
    expect(finalQty.error).toBe('');
    // el ultimo POST que salio decide; el DOM no puede mostrar un valor anterior
    expect(Number(finalQty.dom)).toBe(finalQty.server);
    // economia: la ultima respuesta si se pinto, asi que no hace falta un GET de sincronizacion
    const gets = await page.evaluate(() => window.__calls.filter((c) => c.url.includes('section_id=')).length);
    expect(gets).toBe(0);
  });

  test('rafaga cuya ULTIMA mutacion falla: el drawer se resincroniza con el servidor y muestra el error', async ({ page }) => {
    await page.goto('/stress.html');
    await installFetch(page);
    await page.click('#page-cart-link');
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      window.__calls.length = 0;
      const realFetch = window.fetch;
      window.fetch = (input, init = {}) => {
        const body = init.body && typeof init.body === 'string' ? JSON.parse(init.body) : null;
        if (String(input).includes('/cart/change') && body?.quantity === 9) {
          window.__calls.push({ url: String(input), body });
          // el servidor rechaza solo la ultima (p. ej. stock insuficiente); las previas si aplicaron
          return new Promise((r) => setTimeout(() => r(new Response(JSON.stringify({ description: 'Solo quedan 8 unidades' }), { status: 422, headers: { 'Content-Type': 'application/json' } })), 10));
        }
        return realFetch(input, init);
      };
    });

    const out = await page.evaluate(async () => {
      const drawer = document.querySelector('cart-drawer');
      const ps = [5, 6, 7, 8, 9].map((q) => drawer.changeLine(1, q).catch((e) => drawer.showError(e.message)));
      await Promise.all(ps);
      await new Promise((r) => setTimeout(r, 300));
      return {
        dom: document.querySelector('[data-cart-quantity]').value,
        server: window.__qty,
        pending: drawer.pendingMutations,
        error: document.querySelector('[data-cart-error]').textContent.trim(),
        gets: window.__calls.filter((c) => c.url.includes('section_id=')).length,
      };
    });
    expect(out.pending).toBe(0);
    // el servidor quedo en 8 (la ultima peticion valida); el DOM debe reflejarlo, no 5 ni 9
    expect(out.server).toBe(8);
    expect(Number(out.dom)).toBe(8);
    // exactamente un GET de resincronizacion, y el error sigue visible tras el repintado
    expect(out.gets).toBe(1);
    expect(out.error).toBe('Solo quedan 8 unidades');
  });
});
