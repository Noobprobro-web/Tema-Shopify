import { expect, test } from '@playwright/test';

test.describe('4E-001 paginas nativas', () => {
  test('documentacion: el indice servido por Liquid marca el apartado en pantalla al hacer scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/docs.html');
    await page.waitForTimeout(250);

    const current = () => page.evaluate(() => document.querySelector('[data-anchor-link][aria-current]')?.getAttribute('href') || null);
    // arranca marcando el primero, que es el que ocupa la mitad superior
    expect(await current()).toBe('#quick-start');

    await page.evaluate(() => document.getElementById('presets').scrollIntoView());
    await page.waitForFunction(() => document.querySelector('[data-anchor-link][aria-current]')?.getAttribute('href') === '#presets', null, { timeout: 4000 });

    await page.evaluate(() => document.getElementById('cart').scrollIntoView());
    await page.waitForFunction(() => document.querySelector('[data-anchor-link][aria-current]')?.getAttribute('href') === '#cart', null, { timeout: 4000 });

    // y solo uno a la vez
    expect(await page.evaluate(() => document.querySelectorAll('[data-anchor-link][aria-current]').length)).toBe(1);
  });

  test('paginas legales: el indice se construye desde los h2 del contenido del comerciante', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/legal.html');
    await page.waitForTimeout(250);

    const built = await page.evaluate(() => {
      const nav = document.querySelector('anchor-nav');
      return {
        hidden: nav.hasAttribute('hidden'),
        entries: [...nav.querySelectorAll('[data-anchor-link]')].map((a) => [a.getAttribute('href'), a.textContent.trim()]),
        headingIds: [...document.querySelectorAll('#MainPolicyBody-x h2')].map((h) => h.id),
        // el h3 no entra: el indice es de apartados, no de subapartados
        h3Linked: [...document.querySelectorAll('[data-anchor-link]')].some((a) => a.textContent.trim() === 'Accounts'),
      };
    });
    expect(built.hidden, 'deja de estar oculto al construirse').toBe(false);
    expect(built.entries).toEqual([
      ['#MainPolicySection-x-1', 'Overview'],
      ['#MainPolicySection-x-2', 'Online store terms'],
      ['#MainPolicySection-x-3', 'Changes to the service'],
    ]);
    expect(built.headingIds).toEqual(['MainPolicySection-x-1', 'MainPolicySection-x-2', 'MainPolicySection-x-3']);
    expect(built.h3Linked).toBe(false);

    await page.evaluate(() => document.getElementById('MainPolicySection-x-3').scrollIntoView());
    await page.waitForFunction(() => document.querySelector('[data-anchor-link][aria-current]')?.textContent.trim() === 'Changes to the service', null, { timeout: 4000 });
  });

  test('un solo encabezado no genera indice: el desplegable no llega a aparecer', async ({ page }) => {
    await page.goto('/legal-one.html');
    await page.waitForTimeout(250);
    const state = await page.evaluate(() => {
      const nav = document.querySelector('anchor-nav');
      return { hidden: nav.hasAttribute('hidden'), entries: nav.querySelectorAll('[data-anchor-link]').length };
    });
    expect(state.hidden, 'sigue oculto').toBe(true);
    expect(state.entries).toBe(0);
  });

  test('el boton de copiar solo existe con portapapeles, y copia el fragmento', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/docs.html');
    await page.waitForTimeout(250);

    const button = page.locator('[data-copy-trigger]');
    await expect(button, 'revelado por copy-text').toBeVisible();
    await button.click();
    await page.waitForTimeout(150);

    const after = await page.evaluate(async () => ({
      clipboard: await navigator.clipboard.readText(),
      label: document.querySelector('[data-copy-label]').textContent.trim(),
      status: document.querySelector('[data-copy-status]').textContent.trim(),
    }));
    expect(after.clipboard).toBe('Sartorial-1.0.0.zip');
    expect(after.label, 'la etiqueta confirma').toBe('Copied');
    expect(after.status, 'y se anuncia en una region viva aparte').toBe('Copied');

    // vuelve a su estado en reposo
    await page.waitForFunction(() => document.querySelector('[data-copy-label]').textContent.trim() === 'Copy', null, { timeout: 4000 });
  });

  test('sin portapapeles el boton de copiar no llega a mostrarse', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    });
    await page.goto('/docs.html');
    await page.waitForTimeout(250);
    expect(await page.locator('[data-copy-trigger]').isVisible()).toBe(false);
    // y el fragmento sigue legible
    expect(await page.locator('.doc-snippet__code').textContent()).toContain('Sartorial-1.0.0.zip');
  });

  test('a 390 px ninguna de las dos paginas scrollea en horizontal y los objetivos tactiles llegan a 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    for (const url of ['/docs.html', '/legal.html']) {
      await page.goto(url);
      await page.waitForTimeout(250);
      const m = await page.evaluate(() => ({
        docScrollW: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        summary: Math.round(document.querySelector('.anchor-nav__summary').getBoundingClientRect().height),
        links: [...document.querySelectorAll('.anchor-nav__link')].map((a) => Math.round(a.getBoundingClientRect().height)),
      }));
      expect(m.docScrollW, `${url} sin scroll horizontal`).toBeLessThanOrEqual(m.viewport);
      expect(m.summary, `${url} resumen >= 44`).toBeGreaterThanOrEqual(44);
      for (const h of m.links) expect(h, `${url} enlace >= 44`).toBeGreaterThanOrEqual(44);
    }
    const copy = await page.evaluate(() => null);
    expect(copy).toBe(null);
  });

  test('el fragmento de codigo desborda dentro de su caja, nunca en la pagina', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto('/docs.html');
    await page.evaluate(() => {
      document.querySelector('#DocSnippet-a').textContent = 'shopify theme push --unpublished --path=. --store=my-very-long-store-handle.myshopify.com';
    });
    await page.waitForTimeout(150);
    const m = await page.evaluate(() => {
      const pre = document.querySelector('.doc-snippet__code');
      return {
        scrolls: pre.scrollWidth > pre.clientWidth,
        docScrollW: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        copyH: Math.round(document.querySelector('.doc-snippet__copy').getBoundingClientRect().height),
      };
    });
    expect(m.scrolls, 'el bloque es el que scrollea').toBe(true);
    expect(m.docScrollW, 'la pagina no').toBeLessThanOrEqual(m.viewport);
    expect(m.copyH).toBeGreaterThanOrEqual(44);
  });
});
