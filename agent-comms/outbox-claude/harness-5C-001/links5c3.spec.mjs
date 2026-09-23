import { test, expect } from '@playwright/test';

/* 5C-003. Enlaces de las tarjetas del mega menu con prefijo de idioma o de mercado (GPT-AUDIT-010,
   P1). Sitios renderizados con render5c.mjs y ROOT_URL:
     SITE=site-5c3      ROOT_URL=/        (idioma por defecto)
     SITE=site-5c3-es   ROOT_URL=/es      (espanol en subcarpeta)
     SITE=site-5c3-mkt  ROOT_URL=/en-ca   (mercado con subcarpeta)
   SPEC=links5c3.spec.mjs para ejecutar este archivo. */
const SITE = process.env.SITE || 'site-5c3';
const ROOT_URL = process.env.ROOT_URL || '/';
const P = ROOT_URL === '/' ? '' : ROOT_URL;

// Orden del DOM: Catalog (2 tarjetas), Journal (2), Atelier (2).
const EXPECTED = [
  `${P}/collections/all`, // "/collections/all" pasa por routes.all_products_collection_url
  `${P}/pages/appointments`, // ruta interna: se prefija
  'https://example.com/lookbook?a=1&b=2', // externa: intacta
  '//cdn.example.com/look', // protocolo relativo: intacta
  ROOT_URL === '/es' || ROOT_URL === '/' ? '/es/pages/about' : `${P}/es/pages/about`, // ya localizada para /es: intacta en /es
  `${P}/eshop`, // empieza por "/es" sin ser "/es/": se prefija
];

async function go(page, file) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`/${SITE}/${file}`, { waitUntil: 'networkidle' });
}

test.describe(`5C-003 enlaces de tarjeta (${SITE}, root ${ROOT_URL})`, () => {
  test('L1 seis tipos de enlace: solo se prefijan las rutas internas, y el & sale escapado en el HTML', async ({ page, request }) => {
    await go(page, 'mega-links.html');
    const hrefs = await page.$$eval('.desktop-nav .mega-menu__promo-card', (cards) => cards.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual(EXPECTED);
    const html = await (await request.get(`/${SITE}/mega-links.html`)).text();
    expect(html).toContain('href="https://example.com/lookbook?a=1&amp;b=2"');
  });

  test('L2 cabecera desplegada: las dos promociones de Catalog llevan a la coleccion completa del idioma activo', async ({ page }) => {
    await go(page, 'deployed.html');
    const cards = page.locator('.desktop-nav .mega-menu__promo-card');
    await expect(cards).toHaveCount(2);
    expect(await cards.evaluateAll((els) => els.map((a) => a.getAttribute('href')))).toEqual([`${P}/collections/all`, `${P}/collections/all`]);
    // Un clic real en la primera tarjeta pide esa URL.
    await page.locator('.desktop-nav__toggle', { hasText: 'Catalog' }).click();
    const [req] = await Promise.all([
      page.waitForRequest((r) => r.isNavigationRequest()),
      cards.first().click(),
    ]);
    expect(new URL(req.url()).pathname).toBe(`${P}/collections/all`);
  });
});
