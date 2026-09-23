import { test, expect } from '@playwright/test';

/* Sprint 5C-001. Cabecera renderizada desde el Liquid real (render5c.mjs) con theme.js y
   base.css reales. SITE=site (ingles), site-es (espanol) o site-before (arbol previo, para
   ver que las pruebas detectan la ausencia del mega menu). */
const SITE = process.env.SITE || 'site';
const ES = SITE.endsWith('-es');
const L = ES
  ? { viewAll: (t) => `Ver todo en ${t}`, featured: 'Destacados' }
  : { viewAll: (t) => `View all ${t}`, featured: 'Featured' };
const PROMO = /img\/promo-[abc]\.png/;

async function go(page, file = 'mega.html', w = 1280, h = 900) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`/${SITE}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
}
const toggle = (page, name) => page.locator('.desktop-nav__toggle', { hasText: name });
const disclosure = (page, name) => page.locator('.desktop-nav__disclosure', { has: toggle(page, name) });
const panel = (page, name) => disclosure(page, name).locator('[data-disclosure-panel]');
// Espera a que termine la entrada del panel (animacion de 160 ms) antes de medir.
const settle = (page) => page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => {}))));
const texts = (locator) => locator.evaluateAll((els) => els.map((el) => el.textContent.trim()));
const activeText = (page) => page.evaluate(() => {
  const a = document.activeElement;
  return (a.querySelector('.mega-menu__promo-heading')?.textContent || a.getAttribute('aria-label') || a.textContent || a.querySelector('img')?.alt || '').trim().replace(/\s+/g, ' ');
});

test.describe(`5C-001 mega menu (${SITE})`, () => {
  test('M1 estructura: tres niveles en columnas, tarjetas del bloque, panel clasico sin bloque y bloques que no aplican', async ({ page }) => {
    await go(page);
    const catalog = panel(page, 'Catalog');
    await expect(disclosure(page, 'Catalog')).toHaveClass(/desktop-nav__disclosure--mega/);
    await expect(catalog).toHaveClass(/desktop-nav__mega-menu/);
    await expect(catalog.locator('.mega-menu__view-all')).toHaveText(L.viewAll('Catalog'));
    expect(await texts(catalog.locator('.mega-menu__column-title'))).toEqual(['Women', 'Men', 'Accessories', 'The Autumn Series']);
    expect(await texts(catalog.locator('.mega-menu__column').first().locator('.mega-menu__sublist a'))).toEqual(['Coats', 'Knitwear', 'Tailoring']);
    await expect(catalog.locator('.mega-menu__column').last().locator('.mega-menu__sublist')).toHaveCount(0);
    await expect(catalog.locator('.mega-menu__promos')).toHaveAttribute('aria-label', L.featured);
    expect(await texts(catalog.locator('.mega-menu__promo-heading'))).toEqual(['The Autumn Series', 'Made to measure']);
    // Con titulo, la foto es decorativa dentro del enlace: alt vacio.
    expect(await catalog.locator('.mega-menu__promo-image').evaluateAll((imgs) => imgs.map((i) => [i.alt, i.loading]))).toEqual([['', 'lazy'], ['', 'lazy']]);
    expect(await page.content()).not.toContain('Duplicate, should not render');
    expect(await page.content()).not.toContain('Should not render');

    // Dos niveles sin bloque: el panel clasico, igual que antes.
    const journal = panel(page, 'Journal');
    await expect(disclosure(page, 'Journal')).not.toHaveClass(/--mega/);
    await expect(journal).toHaveAttribute('class', 'desktop-nav__panel color-scheme-1');
    expect(await texts(journal.locator('.desktop-nav__submenu a'))).toEqual([L.viewAll('Journal'), 'Stories', 'Interviews']);

    // Dos niveles con bloque (" Atelier ", con espacios): mega menu. Tarjeta 1 solo foto con
    // enlace, cuyo alt nombra el enlace; tarjeta 2 sin enlace.
    const atelier = panel(page, 'Atelier');
    await expect(atelier).toHaveClass(/desktop-nav__mega-menu/);
    const cards = atelier.locator('.mega-menu__promo-card');
    await expect(cards).toHaveCount(2);
    expect(await cards.evaluateAll((els) => els.map((el) => el.tagName))).toEqual(['A', 'DIV']);
    await expect(cards.first().locator('img')).toHaveAttribute('alt', 'Atelier interior');
    await expect(page.locator('.desktop-nav > li > a.desktop-nav__link')).toHaveText(['Home', 'Contact']);
  });

  test('M2 cero fotos de tarjeta antes de abrir; al abrir, solo las del panel abierto', async ({ page }) => {
    const urls = [];
    page.on('request', (r) => { if (PROMO.test(r.url())) urls.push(r.url().split('/').pop()); });
    await go(page);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, -1200);
    await page.waitForLoadState('networkidle');
    expect(urls).toEqual([]);
    await toggle(page, 'Catalog').click();
    await expect.poll(() => urls.filter((u) => /^promo-[ab]\.png/.test(u)).length).toBe(2);
    await page.waitForLoadState('networkidle');
    expect(urls.some((u) => u.startsWith('promo-c.png'))).toBe(false);
    // 15rem a DPR 1: el candidato de 240 o 320, nunca el de 800.
    for (const u of urls) expect(Number(new URL(`http://x/${u}`).searchParams.get('width'))).toBeLessThanOrEqual(320);
  });

  test('M3 teclado: Enter abre, Tab recorre el panel en orden y sale sin trampa, Escape cierra y devuelve el foco', async ({ page }) => {
    await go(page);
    const trigger = toggle(page, 'Catalog');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel(page, 'Catalog')).toBeVisible();
    const order = [];
    for (let i = 0; i < 14; i += 1) {
      await page.keyboard.press('Tab');
      order.push(await activeText(page));
    }
    expect(order).toEqual([
      L.viewAll('Catalog'), 'Women', 'Coats', 'Knitwear', 'Tailoring', 'Men', 'Coats', 'Knitwear',
      'Accessories', 'Scarves', 'Gloves', 'The Autumn Series', 'The Autumn Series', 'Made to measure',
    ]);
    // El siguiente Tab sale del panel al siguiente enlace de primer nivel: no hay trampa.
    await page.keyboard.press('Tab');
    await expect(toggle(page, 'Journal')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await activeText(page)).toBe('Made to measure');
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel(page, 'Catalog')).toBeHidden();
    await expect(trigger).toBeFocused();
    // Flecha abajo desde el disparador abre y entra en el panel.
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(await activeText(page)).toBe(L.viewAll('Catalog'));
  });

  for (const [w, h] of [[992, 800], [1280, 900], [1440, 900]]) {
    test(`M4 ${w}px: panel a todo el ancho bajo la cabecera, tarjetas a la derecha en 4:5 y objetivos de 44 px`, async ({ page }) => {
      await go(page, 'mega.html', w, h);
      await toggle(page, 'Catalog').click();
      await settle(page);
      const box = await panel(page, 'Catalog').boundingBox();
      const header = await page.locator('.site-header').boundingBox();
      expect(Math.abs(box.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.x + box.width - w)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.y - (header.y + header.height))).toBeLessThanOrEqual(1);
      expect(box.y + box.height).toBeLessThanOrEqual(h);
      const columns = await panel(page, 'Catalog').locator('.mega-menu__columns').boundingBox();
      const promos = await panel(page, 'Catalog').locator('.mega-menu__promos').boundingBox();
      expect(promos.x).toBeGreaterThanOrEqual(columns.x + columns.width);
      const ratios = await panel(page, 'Catalog').locator('.mega-menu__promo-media').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width / el.getBoundingClientRect().height));
      for (const r of ratios) expect(r).toBeCloseTo(0.8, 2);
      const small = await panel(page, 'Catalog').locator('a').evaluateAll((as) => as.map((a) => [a.textContent.trim(), Math.round(a.getBoundingClientRect().height)]).filter(([, hh]) => hh < 44));
      expect(small).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }

  test('M5 raton: el disparador alterna y un clic fuera cierra; abrir un menu no mueve la pagina (CLS 0)', async ({ page }) => {
    await go(page);
    await page.evaluate(() => {
      window.__shift = 0;
      new PerformanceObserver((list) => list.getEntries().forEach((e) => { window.__shift += e.value; })).observe({ type: 'layout-shift' });
    });
    const trigger = toggle(page, 'Catalog');
    const before = await page.locator('main h1').boundingBox();
    await trigger.click();
    await expect(panel(page, 'Catalog')).toBeVisible();
    expect(await page.locator('main h1').boundingBox()).toEqual(before);
    await trigger.click();
    await expect(panel(page, 'Catalog')).toBeHidden();
    await trigger.click();
    await page.mouse.click(10, 880);
    await expect(panel(page, 'Catalog')).toBeHidden();
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.__shift)).toBe(0);
  });

  test('M6 movil 390: el menu lateral no cambia y no se pide ninguna foto de tarjeta', async ({ page }) => {
    const urls = [];
    page.on('request', (r) => { if (PROMO.test(r.url())) urls.push(r.url()); });
    await go(page, 'mega.html', 390, 844);
    await expect(page.locator('.site-header__desktop-nav')).toBeHidden();
    await page.locator('.site-header__menu-button').click();
    const drawer = page.locator('.mobile-nav');
    await expect(drawer).toBeVisible();
    expect(await texts(drawer.locator(':scope > li > a, :scope > li > theme-disclosure > .mobile-nav__toggle'))).toEqual(['Home', 'Catalog', 'Journal', 'Atelier', 'Contact']);
    await drawer.locator('.mobile-nav__toggle', { hasText: 'Catalog' }).click();
    await expect(drawer.locator('.mobile-nav__grandchildren').first()).toBeVisible();
    await expect(page.locator('.mobile-nav .mega-menu__promos')).toHaveCount(0);
    await page.waitForLoadState('networkidle');
    expect(urls).toEqual([]);
  });

  for (const name of ['Catalog', 'Atelier']) {
    test(`M7 axe 1280 con ${name} abierto: 0 violaciones WCAG 2.2 AA`, async ({ page }) => {
      await go(page);
      await toggle(page, name).click();
      await page.waitForLoadState('networkidle');
      await page.addScriptTag({ url: `/${SITE}/axe.min.js` });
      const violations = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
      });
      expect(violations).toEqual([]);
    });
  }

  test('M8 sin JS: el panel se lee en la cabecera, con columnas y sin tarjetas', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 }, baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto(`/${SITE}/mega.html`, { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveClass(/no-js/);
    const catalog = panel(page, 'Catalog');
    await expect(catalog.locator('.mega-menu__column-title').first()).toBeVisible();
    await expect(catalog.locator('.mega-menu__sublist a').first()).toBeVisible();
    await expect(catalog.locator('.mega-menu__promos')).toBeHidden();
    const small = await catalog.locator('.mega-menu__columns a').evaluateAll((as) => as.filter((a) => Math.round(a.getBoundingClientRect().height) < 44).length);
    expect(small).toBe(0);
    await context.close();
  });

  test('M9 menu traducido: "Catálogo" se asocia al bloque "Catalog" por el handle del enlace', async ({ page }) => {
    await go(page, 'mega-es-titles.html');
    await expect(disclosure(page, 'Catálogo')).toHaveClass(/--mega/);
    expect(await texts(panel(page, 'Catálogo').locator('.mega-menu__column-title'))).toEqual(['Mujer', 'Hombre', 'Accesorios', 'La serie de otoño']);
    expect(await texts(panel(page, 'Catálogo').locator('.mega-menu__promo-heading'))).toEqual(['The Autumn Series', 'Made to measure']);
    // Atelier no tiene bloque en esta pagina y solo dos niveles: panel clasico.
    await expect(disclosure(page, 'Atelier')).not.toHaveClass(/--mega/);
  });

  test('M10 tres niveles sin bloques: mega menu solo con columnas; la cabecera por defecto sigue con el panel clasico', async ({ page }) => {
    await go(page, 'mega-noblocks.html');
    await expect(disclosure(page, 'Catalog')).toHaveClass(/--mega/);
    await expect(panel(page, 'Catalog').locator('.mega-menu__promos')).toHaveCount(0);
    await toggle(page, 'Catalog').click();
    await settle(page);
    const columns = await panel(page, 'Catalog').locator('.mega-menu__columns').boundingBox();
    const container = await panel(page, 'Catalog').locator('.mega-menu__grid').boundingBox();
    expect(Math.abs(columns.width - container.width)).toBeLessThanOrEqual(1);
    await expect(disclosure(page, 'Atelier')).not.toHaveClass(/--mega/);

    await go(page, 'classic.html');
    await expect(page.locator('.desktop-nav__mega-menu')).toHaveCount(0);
    const classic = panel(page, 'Catalog');
    await expect(classic).toHaveAttribute('class', 'desktop-nav__panel color-scheme-1');
    expect(await texts(classic.locator('.desktop-nav__submenu > li > a'))).toEqual([
      L.viewAll('Catalog'), 'Outerwear', 'Knitwear', 'Tailoring', 'Accessories', 'The Autumn Series', 'The Permanent Collection',
    ]);
  });
});
