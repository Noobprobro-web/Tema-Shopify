import { test, expect } from '@playwright/test';

/* Estas paginas se sirven desde el Liquid real: la plantilla JSON pasa por liquidjs con los
   valores por defecto del schema, el mismo base.css y las mismas dos familias tipograficas
   de la tienda. Lo que se mide aqui es lo que ve el comerciante en un portatil. */

const PAGES = ['documentation', 'support', 'faq', 'about', 'policy'];

test.describe('4E-003 escala tipografica de las paginas nativas', () => {
  for (const name of PAGES) {
    test(`T1 ${name}: el titulo de pagina no usa la escala de portada`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(`/real-${name}.html`);
      const px = await page.locator('main h1').first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      // 4rem es la escala de pagina de utilidad del tema; el clamp de portada llega a 117.6 px.
      expect(px).toBeLessThanOrEqual(64);
      expect(px).toBeGreaterThanOrEqual(40);
    });
  }

  test('T2 el titulo de documentacion cabe en una linea y no se parte a mitad de palabra', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/real-documentation.html');
    const m = await page.locator('.main-documentation__title').evaluate((el) => {
      const cs = getComputedStyle(el);
      return { h: el.getBoundingClientRect().height, lh: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) };
    });
    expect(Math.round(m.h / m.lh)).toBe(1);
  });

  test('T3 documentacion: encabezados y texto comparten un unico borde derecho', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/real-documentation.html');
    const m = await page.evaluate(() => {
      const r = (s) => Math.round(document.querySelector(s).getBoundingClientRect().right);
      return { title: r('.doc-section__title'), body: r('.doc-section__content'), preset: r('.doc-preset'), snippet: r('.doc-snippet') };
    });
    expect(m.title).toBe(m.body);
    expect(m.preset).toBe(m.body);
    expect(m.snippet).toBe(m.body);
  });

  test('T4 soporte: los tres titulos de apartado son de apartado, no de portada', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/real-support.html');
    const sizes = await page.locator('.main-support__section-title').evaluateAll((els) =>
      els.map((el) => parseFloat(getComputedStyle(el).fontSize)));
    expect(sizes.length).toBe(3);
    for (const s of sizes) expect(s).toBeLessThanOrEqual(40);
  });

  test('T5 soporte: las dos columnas terminan a la misma altura', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/real-support.html');
    const d = await page.evaluate(() => {
      const [a, b] = Array.from(document.querySelector('.main-support__layout').children);
      return Math.abs(a.getBoundingClientRect().height - b.getBoundingClientRect().height);
    });
    // Antes de mover el alcance del soporte a su propia banda, la diferencia era de 358 px.
    expect(d).toBeLessThan(120);
  });

  test('T6 soporte: el titulo de una tarjeta de alcance cabe en una linea', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/real-support.html');
    const lines = await page.locator('.main-support__policy-title').last().evaluate((el) => {
      const cs = getComputedStyle(el);
      return Math.round(el.getBoundingClientRect().height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize)));
    });
    expect(lines).toBe(1);
  });

  test('T7 FAQ: el primer grupo se separa de la cabecera igual que los demas', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/real-faq.html');
    const gaps = await page.evaluate(() => {
      const groups = Array.from(document.querySelectorAll('.main-faq__group'));
      return groups.map((g) => Math.round(g.getBoundingClientRect().top - g.previousElementSibling.getBoundingClientRect().bottom));
    });
    for (const g of gaps) expect(g).toBeGreaterThanOrEqual(24);
  });

  test('T8 ninguna de las cinco paginas scrollea en horizontal a 390 px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const name of PAGES) {
      await page.goto(`/real-${name}.html`);
      const m = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(m.doc, name).toBeLessThanOrEqual(m.win);
    }
  });
});
