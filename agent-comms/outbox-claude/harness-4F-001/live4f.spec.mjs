import { test, expect } from '@playwright/test';

/* Sprint 4F-001. Paginas renderizadas desde el Liquid real (r4f/render4f.mjs): header
   group, secciones, cajon del carrito, base.css y theme.js del arbol de trabajo. Con
   BUILD=before se ejecutan contra el arbol anterior para demostrar que cada guarda muerde. */
const DIR = process.env.BUILD === 'before' ? '/r4f-before' : '/r4f';
const go = async (page, file, w, h) => {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`${DIR}/${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.waitForTimeout(250);
};
const paintTop = (page, sel) => page.evaluate((s) => {
  const close = document.querySelector(s); const r = close.getBoundingClientRect();
  const inert = [...document.querySelectorAll('[inert]')].filter((e) => !e.contains(close));
  inert.forEach((e) => e.removeAttribute('inert'));
  const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  inert.forEach((e) => e.setAttribute('inert', ''));
  return top?.closest('button') === close;
}, sel);

test.describe('4F-001 correcciones de la auditoria en vivo', () => {
  test('T1 checkout acelerado bajo Checkout en el cajon y en la pagina de carrito', async ({ page }) => {
    for (const [file, scope] of [['home.html', 'cart-drawer'], ['cart.html', 'main']]) {
      await go(page, file, 1280, 800);
      const r = await page.evaluate((sc) => { const root = document.querySelector(sc); const w = root.querySelector('.cart__dynamic-checkout'); const c = root.querySelector('button[name=checkout]'); return w ? { below: w.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_PRECEDING } : null; }, scope);
      expect(r, file).not.toBeNull();
      expect(r.below, file).toBeTruthy();
    }
  });

  test('T2 el boton Cerrar del menu y del buscador pinta por encima de la barra de anuncio', async ({ page }) => {
    await go(page, 'home.html', 390, 690);
    await page.click('.site-header__menu-button'); await page.waitForTimeout(400);
    expect(await paintTop(page, '[id^=MobileMenu] [data-drawer-close]')).toBe(true);
    await go(page, 'home.html', 1440, 900);
    await page.click('.predictive-search__trigger'); await page.waitForTimeout(400);
    expect(await paintTop(page, '[id^=PredictiveSearchPanel] button[aria-label="Close"]')).toBe(true);
  });

  for (const [w, h] of [[390, 690], [1280, 800]]) {
    test(`T3 contraste del texto del hero sobre pixeles reales a ${w}px`, async ({ page }) => {
      await go(page, 'home.html', w, h); await page.waitForTimeout(400);
      const boxes = await page.evaluate(() => ['.hero-editorial__intro .eyebrow', '.hero-editorial__heading', '.hero-editorial__subheading p'].map((s) => { const el = document.querySelector(s); const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return { s, x: r.x, y: r.y, w: r.width, h: r.height, color: c.color, px: parseFloat(c.fontSize) }; }));
      await page.addStyleTag({ content: '.hero-editorial__content *{color:transparent !important}' }); await page.waitForTimeout(150);
      const png = (await page.screenshot()).toString('base64');
      const res = await page.evaluate(async ({ png, boxes }) => {
        const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
        const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        const lum = (r, gg, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
        return boxes.map((b) => { let m = b.color.match(/[\d.]+/g).map(Number); if (b.color.startsWith('color(')) m = m.map((v) => v * 255);
          const lf = lum(m[0], m[1], m[2]); const d = g.getImageData(Math.round(b.x), Math.round(b.y), Math.round(b.w), Math.round(b.h)).data; const L = [];
          for (let i = 0; i < d.length; i += 8) L.push(lum(d[i], d[i + 1], d[i + 2])); L.sort((a, z) => a - z); const lb = L[Math.floor(L.length * 0.98)];
          return { s: b.s, ratio: (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05), need: b.px >= 24 ? 3 : 4.5 }; });
      }, { png, boxes });
      for (const r of res) expect(r.ratio, `${r.s} ${r.ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(r.need);
    });
  }

  test('T4 la galeria no deja celdas vacias con 0, 1 o 3 imagenes', async ({ page }) => {
    for (const [file, first] of [['pdp-single.html', 'full'], ['pdp-none.html', 'full'], ['pdp-three.html', 'full'], ['pdp-multi.html', 'half']]) {
      await go(page, file, 1440, 900);
      const r = await page.evaluate(() => { const g = document.querySelector('.product-gallery').getBoundingClientRect().width; const items = [...document.querySelectorAll('.product-gallery__item, .product-gallery__placeholder')].map((i) => i.getBoundingClientRect()); const rows = {}; items.forEach((i) => { rows[Math.round(i.top)] = (rows[Math.round(i.top)] || 0) + i.width; }); return { g, first: items[0].width, rowsFull: Object.values(rows).every((wsum) => wsum >= g - 20) }; });
      expect(r.rowsFull, file).toBe(true);
      if (first === 'full') expect(Math.round(r.first), file).toBe(Math.round(r.g));
    }
  });

  test('T5 el boton de enviar del buscador no se parte con el campo vacio', async ({ page }) => {
    await go(page, 'home.html', 1440, 900);
    await page.click('.predictive-search__trigger'); await page.waitForTimeout(400);
    const width = () => page.evaluate(() => document.querySelector('[id^=PredictiveSearchPanel] button[type=submit]').getBoundingClientRect());
    const empty = await width();
    expect(empty.width).toBeGreaterThan(80); expect(empty.height).toBeLessThan(60);
    await page.fill('[id^=PredictiveSearchPanel] input[type=search]', 'coat'); await page.waitForTimeout(700);
    const typed = await width();
    expect(Math.round(typed.width)).toBe(Math.round(empty.width));
  });

  test('T6 a 1366x650 el pie del cajon queda entero y el aviso no lo tapa', async ({ page }) => {
    await go(page, 'home.html', 1366, 650);
    await page.click('.site-header__cart'); await page.waitForTimeout(600);
    await page.evaluate(() => { const s = document.querySelector('[data-cart-status]'); s.hidden = false; s.textContent = 'Item added to your cart.'; });
    const r = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); const rect = (s) => d.querySelector(s).getBoundingClientRect(); const ck = rect('button[name=checkout]'); const vc = rect('.cart-drawer__view-cart'); const ms = rect('[data-cart-status]'); const ov = (a, b) => Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)); return { ckIn: ck.bottom <= innerHeight, vcIn: vc.bottom <= innerHeight, ovCk: ov(ck, ms), ovVc: ov(vc, ms) }; });
    expect(r).toEqual({ ckIn: true, vcIn: true, ovCk: 0, ovVc: 0 });
  });

  test('T7 carrusel movil con contador y titulo en la primera pantalla', async ({ page }) => {
    await go(page, 'pdp-multi.html', 390, 690);
    const r = await page.evaluate(() => { const t = document.querySelector('.product-gallery__items'); return { snap: getComputedStyle(t).scrollSnapType, scrollable: t.scrollWidth > t.clientWidth, focusable: t.tabIndex === 0, titleTop: document.querySelector('h1').getBoundingClientRect().top, pager: document.querySelector('[data-gallery-pager]')?.hidden === false }; });
    expect(r.snap).toContain('x'); expect(r.scrollable).toBe(true); expect(r.focusable).toBe(true); expect(r.pager).toBe(true);
    expect(r.titleTop).toBeLessThan(690);
    await page.click('[data-gallery-step="1"]'); await page.waitForTimeout(600);
    expect(await page.textContent('[data-gallery-current]')).toBe('2');
    await go(page, 'pdp-multi.html', 1440, 900);
    expect(await page.evaluate(() => ({ pager: document.querySelector('[data-gallery-pager]').hidden, tab: document.querySelector('.product-gallery__items').hasAttribute('tabindex') }))).toEqual({ pager: true, tab: false });
  });

  test('T8 cabecera sticky; con animaciones full el menu sigue cubriendo la ventana', async ({ page }) => {
    await go(page, 'home.html', 390, 690);
    await page.evaluate(() => { document.documentElement.dataset.animations = 'full'; window.scrollTo(0, 1500); }); await page.waitForTimeout(400);
    const r = await page.evaluate(() => { const h = document.querySelector('.site-header').getBoundingClientRect(); return { top: Math.round(h.top), offset: getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim(), height: Math.round(document.querySelector('.site-header').parentElement.getBoundingClientRect().height) }; });
    expect(r.top).toBe(0); expect(r.offset).toBe(`${r.height}px`);
    await page.click('.site-header__menu-button'); await page.waitForTimeout(400);
    const o = await page.evaluate(() => { const b = document.querySelector('[data-drawer-overlay]').getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; });
    expect(o).toEqual([390, 690]);
  });

  test('T9 las miniaturas del buscador piden 72/144/216 px, no el original', async ({ page }) => {
    /* El endpoint real es /search/suggest.json en la raiz de la tienda; aqui se sirve el
       fixture de la carpeta de la build para no depender de la raiz del harness. */
    const fixture = `/tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/harness${DIR}/search/suggest.json`;
    await page.route('**/search/suggest.json*', (route) => route.fulfill({ path: fixture, contentType: 'application/json' }));
    await go(page, 'home.html', 1440, 900);
    await page.click('.predictive-search__trigger'); await page.fill('[id^=PredictiveSearchPanel] input[type=search]', 'coat'); await page.waitForTimeout(800);
    const img = await page.evaluate(() => { const i = document.querySelector('.predictive-search__media img'); return { src: i.getAttribute('src'), srcset: i.getAttribute('srcset') || '' }; });
    expect(img.src).toContain('width=144');
    expect(img.srcset.split(',').length).toBe(3);
  });

  test('T10 el HTML residual de la pagina no toca el tema', async ({ page }) => {
    await go(page, 'docs-residual.html', 1440, 900);
    const r = await page.evaluate(() => ({ style: document.querySelectorAll('main style').length, script: document.querySelectorAll('main script').length, ran: document.documentElement.dataset.residualScript || 'no', headerMax: getComputedStyle(document.querySelector('.site-header')).maxWidth, font: getComputedStyle(document.body).fontFamily.split(',')[0].trim(), kept: document.querySelectorAll('.main-documentation__page-content p').length }));
    expect(r).toEqual({ style: 0, script: 0, ran: 'no', headerMax: 'none', font: 'Assistant', kept: 2 });
  });
});
