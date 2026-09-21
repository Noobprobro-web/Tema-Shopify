import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const BUILD = process.argv[2]; // 'after' | 'before'
const base = BUILD === 'before' ? 'http://127.0.0.1:8132' : 'http://127.0.0.1:8131';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const out = {};
const open = async (file, w, h, anim) => { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(`${base}/${file}`, { waitUntil: 'networkidle' }); if (anim) await p.evaluate((a) => { document.documentElement.dataset.animations = a; }, anim); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; }); await p.waitForTimeout(300); return p; };

// ---- T2: el boton Cerrar pinta por encima de la barra de anuncio ----
const paintTop = async (p, closeSel) => p.evaluate((sel) => {
  const close = document.querySelector(sel); const r = close.getBoundingClientRect();
  const inert = [...document.querySelectorAll('[inert]')].filter((e) => !e.contains(close)); inert.forEach((e) => e.removeAttribute('inert'));
  const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  inert.forEach((e) => e.setAttribute('inert', ''));
  return { closeRect: [Math.round(r.y), Math.round(r.bottom)], topmost: top ? (top.closest('button') === close ? 'CLOSE' : top.tagName + '.' + String(top.className).split(' ')[0]) : null };
}, closeSel);
{
  const p = await open('home.html', 390, 690);
  await p.click('.site-header__menu-button'); await p.waitForTimeout(500);
  out.T2_menu_390 = await paintTop(p, '[id^=MobileMenu] [data-drawer-close]');
  await p.close();
  const d = await open('home.html', 1440, 900);
  await d.click('.predictive-search__trigger'); await d.waitForTimeout(500);
  out.T2_search_1440 = await paintTop(d, '[id^=PredictiveSearchPanel] button[aria-label="Close"]');
  await d.close();
}

// ---- T8: cabecera sticky y drawer fixed con animaciones full ----
for (const anim of ['subtle', 'full']) {
  const p = await open('home.html', 390, 690, anim);
  await p.evaluate(() => window.scrollTo(0, 1500)); await p.waitForTimeout(400);
  const s = await p.evaluate(() => { const h = document.querySelector('.site-header'); const r = h.getBoundingClientRect(); return { headerTop: Math.round(r.top), scrolled: h.hasAttribute('data-header-scrolled'), offset: getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim(), scrollPad: getComputedStyle(document.documentElement).scrollPaddingTop }; });
  await p.click('.site-header__menu-button'); await p.waitForTimeout(500);
  s.overlayRect = await p.evaluate(() => { const r = document.querySelector('[data-drawer-overlay]').getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
  s.menuClose = await paintTop(p, '[id^=MobileMenu] [data-drawer-close]');
  out[`T8_scrolled_${anim}`] = s; await p.close();
}

// ---- T3: contraste del hero con pixeles renderizados ----
for (const [w, h] of [[390, 690], [1280, 800], [1440, 900]]) {
  const p = await open('home.html', w, h);
  await p.waitForTimeout(600);
  const boxes = await p.evaluate(() => ['.hero-editorial__intro .eyebrow', '.hero-editorial__heading', '.hero-editorial__subheading p', '.hero-editorial__actions .button--secondary span'].map((sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); const c = getComputedStyle(el); return { sel, x: r.x + scrollX, y: r.y + scrollY, w: r.width, h: r.height, color: c.color, px: parseFloat(c.fontSize), weight: +c.fontWeight }; }));
  await p.addStyleTag({ content: '.hero-editorial__content *{color:transparent !important;border-color:transparent !important;text-shadow:none !important}.hero-editorial__actions .button:not(.button--secondary){background:transparent !important}' });
  await p.waitForTimeout(200);
  const png = await p.screenshot({ fullPage: false, clip: { x: 0, y: 0, width: w, height: Math.min(h, 2000) } });
  const res = await p.evaluate(async ({ b64, boxes }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const lum = (r, gg, bb) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(bb); };
    return boxes.filter(Boolean).map((bx) => { let m = bx.color.match(/[\d.]+/g).map(Number); if (bx.color.startsWith('color(')) m = m.map((v) => v * 255); const lf = lum(m[0], m[1], m[2]);
      const d = g.getImageData(Math.round(bx.x), Math.round(bx.y), Math.max(1, Math.round(bx.w)), Math.max(1, Math.round(bx.h))).data; const L = [];
      for (let i = 0; i < d.length; i += 8) L.push(lum(d[i], d[i + 1], d[i + 2])); L.sort((a, z) => a - z);
      const cr = (lb) => (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
      const need = (bx.px >= 24 || (bx.weight >= 700 && bx.px >= 18.66)) ? 3 : 4.5;
      return { el: bx.sel.split(' ').pop(), px: Math.round(bx.px), need, median: +cr(L[L.length >> 1]).toFixed(2), worst: +cr(L[Math.floor(L.length * 0.98)]).toFixed(2), pass: cr(L[Math.floor(L.length * 0.98)]) >= need }; });
  }, { b64: png.toString('base64'), boxes });
  out[`T3_hero_${w}`] = res; await p.close();
}

// ---- T4: galeria sin huecos ----
for (const f of ['pdp-single.html', 'pdp-three.html', 'pdp-multi.html', 'pdp-none.html']) {
  const p = await open(f, 1440, 900);
  out[`T4_${f}`] = await p.evaluate(() => { const g = document.querySelector('.product-gallery'); const gr = g.getBoundingClientRect(); const items = [...g.querySelectorAll('.product-gallery__item, .product-gallery__placeholder')].map((i) => { const r = i.getBoundingClientRect(); return Math.round(r.width) + '@' + Math.round(r.x - gr.x) + ',' + Math.round(r.y - gr.y); }); return { galleryW: Math.round(gr.width), items }; });
  await p.close();
}

// ---- T7: carrusel movil ----
{
  const p = await open('pdp-multi.html', 390, 690);
  const m = await p.evaluate(() => { const t = document.querySelector('[data-gallery-track]') || document.querySelector('.product-gallery__items'); const cs = getComputedStyle(t); const title = document.querySelector('.product-main__title, h1'); const atc = document.querySelector('.product-main__info button[name=add], button[name=add]'); const pager = document.querySelector('[data-gallery-pager]');
    return { trackDisplay: cs.display, snap: cs.scrollSnapType, slideW: Math.round(t.firstElementChild.getBoundingClientRect().width), trackW: Math.round(t.clientWidth), scrollable: t.scrollWidth > t.clientWidth, tabindex: t.getAttribute('tabindex'), galleryH: Math.round(document.querySelector('.product-gallery').getBoundingClientRect().height), titleTop: Math.round(title.getBoundingClientRect().top), atcTop: atc ? Math.round(atc.getBoundingClientRect().top) : null, pagerHidden: pager ? pager.hidden : 'none', counter: pager?.querySelector('[data-gallery-current]')?.textContent, prevDisabled: pager?.querySelector('[data-gallery-step="-1"]')?.disabled }; });
  if (m.pagerHidden === false) { await p.click('[data-gallery-step="1"]'); await p.waitForTimeout(700);
    Object.assign(m, await p.evaluate(() => ({ afterNext: { counter: document.querySelector('[data-gallery-current]').textContent, scrollLeft: Math.round(document.querySelector('[data-gallery-track]').scrollLeft), status: document.querySelector('[data-gallery-status]').textContent, prevDisabled: document.querySelector('[data-gallery-step="-1"]').disabled } }))); }
  out.T7_mobile_390 = m; await p.close();
  const d = await open('pdp-multi.html', 1440, 900);
  out.T7_desktop_1440 = await d.evaluate(() => { const t = document.querySelector('[data-gallery-track]') || document.querySelector('.product-gallery__items'); const pager = document.querySelector('[data-gallery-pager]'); return { trackDisplay: getComputedStyle(t).display, tabindex: t.getAttribute('tabindex'), pagerHidden: pager ? pager.hidden : 'none' }; });
  await d.close();
}

// ---- T5: fila del buscador ----
{
  const p = await open('home.html', 1440, 900);
  await p.click('.predictive-search__trigger'); await p.waitForTimeout(500);
  const measure = () => p.evaluate(() => { const panel = document.querySelector('[id^=PredictiveSearchPanel]'); const s = panel.querySelector('button[type=submit]'); const r = s.getBoundingClientRect(); const inp = panel.querySelector('input[type=search]'); return { submit: Math.round(r.width) + 'x' + Math.round(r.height), nativeCancel: getComputedStyle(inp, '::-webkit-search-cancel-button').appearance || getComputedStyle(inp, '::-webkit-search-cancel-button').webkitAppearance, visibleClears: [...panel.querySelectorAll('.predictive-search__clear')].filter((c) => c.getBoundingClientRect().width > 0).length }; });
  out.T5_empty = await measure();
  await p.fill('[id^=PredictiveSearchPanel] input[type=search]', 'coat'); await p.waitForTimeout(900);
  out.T5_typed = await measure();
  // ---- T9: miniaturas del buscador ----
  out.T9_thumb = await p.evaluate(() => { const i = document.querySelector('.predictive-search__media img'); return i ? { src: i.getAttribute('src'), srcset: i.getAttribute('srcset'), sizes: i.getAttribute('sizes') } : 'no result image'; });
  await p.close();
}

// ---- T6: cajon a 1366x650 con aviso visible ----
{
  const p = await open('home.html', 1366, 650);
  await p.click('.site-header__cart'); await p.waitForTimeout(700);
  await p.evaluate(() => { const s = document.querySelector('[data-cart-status]'); s.hidden = false; s.textContent = 'Item added to your cart.'; });
  await p.waitForTimeout(200);
  out.T6_drawer_650 = await p.evaluate(() => { const d = document.querySelector('cart-drawer'); const q = (sel) => d.querySelector(sel); const rect = (el) => el ? [Math.round(el.getBoundingClientRect().top), Math.round(el.getBoundingClientRect().bottom)] : null;
    const checkout = q('button[name=checkout]'); const view = q('.cart-drawer__view-cart'); const msg = q('[data-cart-status]'); const wallets = q('.cart__dynamic-checkout');
    const overlap = (a, b) => (a && b) ? Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0])) : 0;
    const ck = rect(checkout), vc = rect(view), ms = rect(msg);
    return { vh: innerHeight, checkout: ck, wallets: rect(wallets), viewCart: vc, message: ms, checkoutCoveredByMessage: overlap(ck, ms), viewCartCoveredByMessage: overlap(vc, ms), checkoutInViewport: ck[1] <= innerHeight, viewCartInViewport: vc ? vc[1] <= innerHeight : null, scrollTrack: rect(q('[data-cart-scroll]')) }; });
  await p.close();
}

// ---- T1: pagina de carrito ----
{
  const p = await open('cart.html', 1280, 800);
  out.T1_cart_page = await p.evaluate(() => { const w = document.querySelector('main .cart__dynamic-checkout'); const ck = document.querySelector('main button[name=checkout]'); return w ? { wallets: Math.round(w.getBoundingClientRect().width) + 'x' + Math.round(w.getBoundingClientRect().height), belowCheckout: w.getBoundingClientRect().top >= ck.getBoundingClientRect().bottom, buttonH: Math.round(w.querySelector('button').getBoundingClientRect().height) } : 'absent'; });
  await p.close();
}

// ---- T10: HTML residual ----
{
  const p = await open('docs-residual.html', 1440, 900);
  out.T10_residual = await p.evaluate(() => ({ styleInMain: document.querySelectorAll('main style').length, scriptInMain: document.querySelectorAll('main script').length, scriptRan: document.documentElement.dataset.residualScript || 'no', headerMaxWidth: getComputedStyle(document.querySelector('.site-header')).maxWidth, bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0], keptParagraphs: document.querySelectorAll('.main-documentation__page-content p').length }));
  await p.close();
}
console.log(JSON.stringify(out, null, 1));
await b.close();
