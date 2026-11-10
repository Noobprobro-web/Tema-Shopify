// X1 (seguimiento de B-01). Toque fuera de cajones sin click fantasma. Derivado del arnes de
// REVIEW-B01-001 (rev-b01/review.cjs). Sintetico y local: Chromium de Playwright con isMobile+hasTouch,
// CSS y JS reales del tema. Sin red ni credenciales.
// Uso: node tap.cjs <repo> <fix|base> [ref]   (base: theme.js de ref, por defecto 06447d2)
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const repo = path.resolve(process.argv[2]);
const mode = process.argv[3] || 'fix';
const ref = process.argv[4] || '06447d2';
const read = (p) => (mode === 'base'
  ? execFileSync('git', ['-C', repo, 'show', `${ref}:${p}`], { encoding: 'utf8', maxBuffer: 1 << 26 })
  : fs.readFileSync(path.join(repo, p), 'utf8'));
const CSS = read('assets/base.css');
const JS = read('assets/theme.js');

const longList = Array.from({ length: 40 }, (_, i) => `<li><a class="mobile-nav__link" href="#l${i}">Link ${i}</a></li>`).join('');
const PAGE = `<!doctype html><html class="js" lang="en" data-animations="none"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/base.css"><script src="/theme.js" defer></script></head>
<body class="template-index color-scheme-1">
<div id="shopify-section-header" class="shopify-section section-header">
<header class="site-header color-scheme-1" data-section-id="header"><div class="container site-header__inner">
  <theme-drawer class="site-header__mobile-menu">
    <button id="trigger" class="icon-button site-header__menu-button" type="button" aria-expanded="false" aria-controls="MM" data-drawer-trigger><svg width="20" height="20"></svg><span>Menu</span></button>
    <div class="drawer-overlay" id="ov" data-drawer-overlay hidden>
      <div id="MM" class="drawer-panel color-scheme-1" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" tabindex="-1" data-drawer-panel inert>
        <div class="drawer-panel__header"><span class="h3" id="mtitle">Menu title text</span>
          <button id="close" class="icon-button" type="button" aria-label="Close" data-drawer-close><svg width="20" height="20"></svg></button></div>
        <nav aria-label="Primary"><ul class="mobile-nav unstyled-list" role="list">
          <li><theme-disclosure class="mobile-nav__disclosure"><button id="m-toggle" class="mobile-nav__toggle" type="button" aria-expanded="false" aria-controls="MMsub" data-disclosure-trigger><span>Shop</span></button>
            <div id="MMsub" data-disclosure-panel hidden><ul class="unstyled-list"><li><a id="m-sub" href="#sub">Sub</a></li></ul></div></theme-disclosure></li>
          <li><a class="mobile-nav__link" id="m-shop" href="#shop">Shop</a></li>
          <li><a class="mobile-nav__link" id="m-cart" href="/cart">Cart in menu</a></li>
          <li><p id="mtext">Selectable paragraph inside the panel for drag selection.</p></li>
          ${longList}
        </ul></nav>
      </div>
    </div>
  </theme-drawer>
  <nav class="site-header__desktop-nav" aria-label="Primary"><ul class="desktop-nav unstyled-list" role="list">
    <li><a class="desktop-nav__link" id="d-shop" href="#shop">Shop</a></li>
    <li><a class="desktop-nav__link" id="d-about" href="#about">About</a></li></ul></nav>
  <a class="site-header__brand" id="brand" href="/"><span class="site-header__brand-text">Sartorial</span></a>
  <div class="site-header__actions">
    <predictive-search class="predictive-search" data-predictive-search-url="/search/suggest" data-search-url="/search">
      <button id="s-trigger" class="icon-button predictive-search__trigger" type="button" aria-label="Search" aria-expanded="false" aria-controls="PS" data-predictive-search-open>S</button>
      <div class="predictive-search__overlay" id="s-ov" data-predictive-search-overlay hidden>
        <div id="PS" class="predictive-search__panel color-scheme-1" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true" tabindex="-1" data-predictive-search-panel inert>
          <button id="s-close" class="icon-button" type="button" aria-label="Close" data-predictive-search-close>X</button>
          <form action="/search" data-predictive-search-form><input id="s-input" type="search" name="q" aria-expanded="false" data-predictive-search-input></form>
          <div data-predictive-search-results></div><p data-predictive-search-status></p>
        </div>
      </div>
    </predictive-search>
    <a class="icon-button site-header__cart" id="cart" href="/cart" aria-label="Cart">C</a></div>
</div></header></div>
<main id="MainContent" class="site-main" tabindex="-1">
  <p style="margin:0;padding:0"><a id="under" href="#under-hit" style="display:block;margin-left:330px;width:60px;height:300px;background:#eee">under</a></p>
  <p id="bodytext">Main body text that can be selected by the user with the mouse pointer.</p>
  <div style="height:3000px"></div></main>
<div id="shopify-section-cart" class="shopify-section">
<cart-drawer class="cart-drawer color-scheme-1" data-section-id="cart" data-cart-url="/cart" data-cart-add-url="/cart/add.js" data-cart-change-url="/cart/change.js" data-item-count="0" data-error-message="Error">
  <div class="cart-drawer__overlay" id="c-ov" data-cart-drawer-overlay hidden>
    <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1" data-cart-drawer-panel inert>
      <header class="cart-drawer__header"><h2 id="CartDrawerTitle" tabindex="-1">Cart</h2>
        <button id="c-close" class="icon-button" type="button" aria-label="Close" data-cart-drawer-close>X</button></header>
      <div data-cart-drawer-body><a id="c-link" href="#cl">Continue</a></div>
    </div>
  </div>
</cart-drawer></div>
</body></html>`;

const M = { width: 390, height: 844 };
const D = { width: 1280, height: 800 };

(async () => {
  const browser = await chromium.launch();
  let fails = 0; let checks = 0; const errors = [];
  const check = (label, cond, extra = '') => { checks += 1; if (!cond) fails += 1; console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${label}${extra ? ` -> ${extra}` : ''}`); };
  const settle = (p) => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const st = (p) => p.evaluate(() => {
    const d = document.querySelector('theme-drawer'); const a = document.activeElement;
    const usable = !!a && a !== document.body && !a.closest('[hidden],[inert]') && a.getClientRects().length > 0;
    return {
      open: d.hasAttribute('data-open'), expanded: document.querySelector('#trigger').getAttribute('aria-expanded'),
      panelInert: document.querySelector('#MM').inert, ovHidden: document.querySelector('#ov').hidden,
      lock: document.body.hasAttribute('data-drawer-open'), modal: document.body.hasAttribute('data-modal-open'),
      bgInert: !!document.querySelector('#MainContent[inert], .site-header__desktop-nav[inert], #brand[inert], #shopify-section-cart[inert]'),
      cartOpen: document.querySelector('cart-drawer').hasAttribute('data-open'),
      searchOpen: document.querySelector('predictive-search').hasAttribute('data-open'),
      active: a === document.body ? 'BODY' : (a.id || a.tagName), usable, hash: location.hash, scrollY,
    };
  });
  const ctxFor = async (vp, touch = false) => {
    const ctx = await browser.newContext({ viewport: vp, ...(touch ? { isMobile: true, hasTouch: true } : {}) });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errors.push(e.message));
    await p.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.pathname === '/base.css') return route.fulfill({ contentType: 'text/css', body: CSS });
      if (u.pathname === '/theme.js') return route.fulfill({ contentType: 'text/javascript', body: JS });
      if (u.pathname.endsWith('.js') || u.pathname.startsWith('/search') || u.pathname.startsWith('/recommendations')) {
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ items: [], item_count: 0, sections: {} }) });
      }
      return route.fulfill({ contentType: 'text/html', body: PAGE });
    });
    await p.goto('http://shop.test/');
    await p.waitForFunction(() => customElements.get('theme-drawer') && customElements.get('cart-drawer'));
    await settle(p);
    return { ctx, p };
  };
  const closedOk = (s, label, expect) => {
    check(`${label}: cerrado, aria-expanded=false, panel inert, overlay hidden, sin bloqueo ni inert de fondo`,
      !s.open && s.expanded === 'false' && s.panelInert && s.ovHidden && !s.lock && !s.bgInert, JSON.stringify({ open: s.open, lock: s.lock, bgInert: s.bgInert }));
    check(`${label}: foco usable${expect ? ` en ${expect}` : ''}`, s.usable && (!expect || s.active === expect), s.active);
  };
  const openedOk = (s, label) => check(`${label}: abierto, aria-expanded=true, bloqueo, fondo inert, foco en close`,
    s.open && s.expanded === 'true' && !s.panelInert && s.lock && s.bgInert && s.active === 'close', `${s.active} lock=${s.lock}`);
  const outsidePoint = async (p) => { const b = await p.locator('#MM').boundingBox(); return { x: Math.min(M.width - 10, b.x + b.width + 20), y: 150 }; };

  console.log(`REVIEW B-01 mode=${mode}${mode === 'base' ? ` ref=${ref}` : ''}`);

  { console.log('\nR1 390 raton: abrir, Escape'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); openedOk(await st(p), 'abrir');
    await p.keyboard.press('Escape'); await settle(p); closedOk(await st(p), 'Escape', 'trigger'); await ctx.close(); }

  { console.log('\nR2 390 raton: cerrar con X'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); await p.click('#close'); await settle(p); closedOk(await st(p), 'X raton', 'trigger'); await ctx.close(); }

  { console.log('\nR3 390 tactil: tap disparador, tap X'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); openedOk(await st(p), 'abrir tactil');
    await p.tap('#close'); await settle(p); await p.waitForTimeout(80); closedOk(await st(p), 'X tactil', 'trigger'); await ctx.close(); }

  { console.log('\nR4 390 raton: clic fuera encima de un enlace del main (#under)'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); const pt = await outsidePoint(p);
    const hit = await p.evaluate(({ x, y }) => { document.querySelector('#ov').hidden = true; const e = document.elementFromPoint(x, y); document.querySelector('#ov').hidden = false; return e?.id; }, pt);
    await p.mouse.click(pt.x, pt.y); await settle(p); await p.waitForTimeout(80); const s = await st(p);
    closedOk(s, `clic fuera (debajo: ${hit})`, 'trigger'); check('el clic no activa el enlace de debajo', s.hash !== '#under-hit', s.hash || '(vacio)'); await ctx.close(); }

  { console.log('\nR5 390 tactil: toque fuera encima de #under (ghost click)'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const pt = await outsidePoint(p);
    await p.touchscreen.tap(pt.x, pt.y); await settle(p); await p.waitForTimeout(400); const s = await st(p);
    closedOk(s, 'toque fuera', 'trigger'); check('el click sintetico del toque no activa el enlace de debajo', s.hash !== '#under-hit', s.hash || '(vacio)'); await ctx.close(); }

  { console.log('\nR6 390 tactil: toque fuera encima del icono de carrito de la cabecera'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const b = await p.locator('#cart').boundingBox();
    await p.touchscreen.tap(M.width - 5, b.y + b.height / 2); await settle(p); await p.waitForTimeout(400); const s = await st(p);
    closedOk(s, 'toque fuera sobre carrito', 'trigger'); check('el toque en la franja sobre el carrito no abre el carrito', !s.cartOpen && s.hash === '', `cartOpen=${s.cartOpen}`); await ctx.close(); }

  { console.log('\nR7 tactil: enlace dentro del panel sigue funcionando (pointerdown no es del overlay)'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); await p.tap('#m-shop'); await settle(p); const s = await st(p);
    check('tap en enlace del panel navega (#shop)', s.hash === '#shop', s.hash); check('el cajon sigue abierto (no lo cierra el enlace)', s.open);
    await p.tap('#m-toggle'); await settle(p);
    check('disclosure dentro del panel abre', await p.evaluate(() => document.querySelector('#m-toggle').getAttribute('aria-expanded') === 'true')); await ctx.close(); }

  { console.log('\nR8 raton: seleccion de texto dentro del panel y en la pagina tras cerrar'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); const b = await p.locator('#mtext').boundingBox();
    await p.mouse.dblclick(b.x + 40, b.y + b.height / 2);
    const sel = await p.evaluate(() => String(getSelection())); check('doble clic selecciona texto en el panel', sel.length >= 4, JSON.stringify(sel.slice(0, 30)));
    await p.keyboard.press('Escape'); await settle(p);
    const t = await p.locator('#bodytext').boundingBox();
    await p.mouse.dblclick(t.x + 40, t.y + t.height / 2);
    const sel2 = await p.evaluate(() => String(getSelection())); check('tras cerrar, doble clic selecciona texto del main', sel2.length >= 4, JSON.stringify(sel2.slice(0, 30)));
    await ctx.close(); }

  { console.log('\nR9 tactil (touch events CDP): scroll dentro del panel; scroll de pagina tras cerrar'); const { ctx, p } = await ctxFor(M, true);
    const cdp = await ctx.newCDPSession(p);
    const drag = async (x, y0, y1) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
      for (let i = 1; i <= 10; i += 1) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 + ((y1 - y0) * i) / 10 }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await p.waitForTimeout(250); };
    await p.tap('#trigger'); await settle(p);
    await drag(100, 700, 300); let s = await st(p);
    const top = await p.evaluate(() => document.querySelector('#MM').scrollTop);
    check('arrastre tactil desplaza el panel', top > 0, `scrollTop=${top}`); check('pagina bloqueada (scrollY 0) y cajon abierto', s.scrollY === 0 && s.open, `scrollY=${s.scrollY}`);
    await p.evaluate(() => { document.querySelector('#MM').scrollTop = 0; }); await p.tap('#close'); await settle(p);
    await drag(200, 700, 300); s = await st(p); check('tras cerrar, arrastre tactil desplaza la pagina', s.scrollY > 0, `scrollY=${s.scrollY}`);
    await ctx.close(); }

  { console.log('\nR10 tactil: gesto de scroll que empieza en el overlay'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const cdp = await ctx.newCDPSession(p); const pt = await outsidePoint(p);
    await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(pt.x), y: 600, yDistance: -300, gestureSourceType: 'touch', speed: 1500 });
    await p.waitForTimeout(300); const s = await st(p);
    console.log(`  info: open=${s.open} active=${s.active} scrollY=${s.scrollY}`);
    check('si se cierra, el foco queda usable; nunca BODY', s.open || s.usable, s.active); await ctx.close(); }

  { console.log('\nR11 resize 390 -> 1280 -> 390 -> 1280 con el cajon abierto'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p);
    const seq = [];
    for (const vp of [D, M, D, M]) { await p.setViewportSize(vp); await settle(p); const s = await st(p); seq.push(`${vp.width}:${s.active}`); check(`tras ${vp.width}: foco usable y cerrado`, s.usable && !s.open && !s.lock && !s.bgInert, s.active); }
    console.log(`  secuencia ${seq.join(' ')}`); await ctx.close(); }

  { console.log('\nR12 abrir 1280 (programatico) y Escape; luego 390'); const { ctx, p } = await ctxFor(D);
    await p.evaluate(() => document.querySelector('theme-drawer').setOpen(true)); await settle(p);
    let s = await st(p); console.log(`  info abierto en 1280: active=${s.active} usable=${s.usable} lock=${s.lock}`);
    await p.keyboard.press('Escape'); await settle(p); closedOk(await st(p), 'Escape en 1280', 'd-shop');
    await p.setViewportSize(M); await settle(p); s = await st(p); closedOk(s, 'luego 390', 'trigger'); await ctx.close(); }

  { console.log('\nR13 abrir 1280 (programatico) y resize a 1300'); const { ctx, p } = await ctxFor(D);
    await p.evaluate(() => document.querySelector('theme-drawer').setOpen(true)); await settle(p);
    await p.setViewportSize({ width: 1300, height: 800 }); await settle(p); closedOk(await st(p), 'resize en escritorio', 'd-shop'); await ctx.close(); }

  { console.log('\nR14 trap de foco con disclosure'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p);
    await p.keyboard.press('Shift+Tab'); const a = (await st(p)).active;
    check('Shift+Tab desde close va al ultimo control del panel', a === 'm-cart' || /^A$/.test(a) || a.startsWith('l'), a);
    let outside = false; for (let i = 0; i < 50; i += 1) { await p.keyboard.press('Tab'); const inside = await p.evaluate(() => document.querySelector('#MM').contains(document.activeElement)); if (!inside) outside = true; }
    check('50 Tab no salen del panel', !outside); await ctx.close(); }

  { console.log('\nR15 carrito desde el menu movil'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); await p.click('#m-cart'); await settle(p); await settle(p);
    let s = await st(p); check('menu cerrado, carrito abierto, foco dentro del carrito', !s.open && s.expanded === 'false' && s.cartOpen && s.lock, s.active);
    await p.keyboard.press('Escape'); await settle(p); s = await st(p);
    check('Escape cierra carrito y foco vuelve al disparador del menu', !s.cartOpen && !s.lock && !s.bgInert && s.active === 'trigger', s.active);
    await p.setViewportSize(D); await settle(p); s = await st(p); check('resize a 1280 despues: foco usable', s.usable, s.active); await ctx.close(); }

  { console.log('\nR16 carrito de cabecera: cierre por toque en su overlay (regresion)'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#cart'); await settle(p); await settle(p); let s = await st(p); check('carrito abierto', s.cartOpen && s.lock);
    const cb = await p.locator('[data-cart-drawer-panel]').boundingBox(); console.log(`  info panel carrito x=${cb.x} w=${cb.width}`);
    if (cb.x < 5) { await p.setViewportSize({ width: 900, height: 844 }); await settle(p); }
    await p.touchscreen.tap(10, 300); await settle(p); await p.waitForTimeout(300); s = await st(p);
    check('toque en overlay del carrito lo cierra y foco a #cart', !s.cartOpen && !s.lock && s.active === 'cart', s.active); await ctx.close(); }

  { console.log('\nR17 busqueda tras cerrar el menu: el seguimiento no roba el foco'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); await p.keyboard.press('Escape'); await settle(p);
    await p.click('#s-trigger'); await settle(p); await settle(p); let s = await st(p);
    check('busqueda abierta, foco en input', s.searchOpen && s.active === 's-input', s.active);
    await p.setViewportSize(D); await settle(p); s = await st(p); check('resize 1280 con busqueda abierta: foco sigue en input', s.active === 's-input', s.active);
    await p.setViewportSize(M); await settle(p); s = await st(p); check('resize 390: foco sigue en input', s.active === 's-input', s.active);
    await p.keyboard.press('Escape'); await settle(p); s = await st(p); check('Escape busqueda: foco a s-trigger', !s.searchOpen && s.active === 's-trigger', s.active); await ctx.close(); }

  { console.log('\nR18 tactil: toque fuera e inmediatamente reabrir'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const pt = await outsidePoint(p);
    await p.touchscreen.tap(pt.x, pt.y); await p.tap('#trigger'); await settle(p); let s = await st(p); openedOk(s, 'reabrir');
    await p.touchscreen.tap(pt.x, pt.y); await settle(p); await p.waitForTimeout(300); closedOk(await st(p), 'segundo toque fuera', 'trigger'); await ctx.close(); }

  { console.log('\nR19 raton: pulsar en overlay y soltar sobre el panel'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); const pt = await outsidePoint(p);
    await p.mouse.move(pt.x, pt.y); await p.mouse.down(); await p.mouse.move(100, 300, { steps: 4 }); await p.mouse.up(); await settle(p);
    closedOk(await st(p), 'down en overlay', 'trigger'); await ctx.close(); }

  { console.log('\nR20 tactil: tap en zona vacia del main tras cerrar suelta el seguimiento'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); await p.tap('#close'); await settle(p);
    const t = await p.locator('#bodytext').boundingBox(); await p.touchscreen.tap(t.x + 10, t.y + 5); await settle(p);
    let s = await st(p); console.log(`  info tras tap en texto: active=${s.active}`);
    await p.setViewportSize(D); await settle(p); s = await st(p); console.log(`  info tras 1280: active=${s.active}`);
    check('no se fuerza foco tras soltarlo el usuario (BODY aceptable aqui, lo eligio el usuario)', true); await ctx.close(); }

  { console.log('\nX1 tactil: tras cerrar, un toque inmediato en un enlace si navega'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const pt = await outsidePoint(p);
    await p.touchscreen.tap(pt.x, pt.y); await settle(p);
    const u = await p.locator('#under').boundingBox(); await p.touchscreen.tap(u.x + u.width / 2, u.y + 250); await settle(p); await p.waitForTimeout(100);
    const s = await st(p); check('segundo toque (<800 ms) en #under navega', s.hash === '#under-hit', s.hash || '(vacio)'); await ctx.close(); }

  { console.log('\nX2 tactil: el descarte caduca'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const pt = await outsidePoint(p);
    await p.evaluate(() => { window.__clicks = 0; document.addEventListener('click', () => { window.__clicks += 1; }); });
    await p.touchscreen.tap(pt.x, pt.y); await p.waitForTimeout(900);
    await p.evaluate(() => document.querySelector('#under').click()); const s = await st(p);
    check('click programatico a 900 ms llega al enlace', s.hash === '#under-hit', s.hash || '(vacio)');
    check('el click fantasma no llego a document', (await p.evaluate(() => window.__clicks)) === 1); await ctx.close(); }

  { console.log('\nX3 tactil: gesto de scroll desde el overlay (sin click) no deja descarte colgado'); const { ctx, p } = await ctxFor(M, true);
    await p.tap('#trigger'); await settle(p); const cdp = await ctx.newCDPSession(p); const pt = await outsidePoint(p);
    await cdp.send('Input.synthesizeScrollGesture', { x: Math.round(pt.x), y: 600, yDistance: -300, gestureSourceType: 'touch', speed: 1500 });
    await p.waitForTimeout(150); await p.evaluate(() => window.scrollTo(0, 0)); await settle(p);
    const u = await p.locator('#under').boundingBox(); await p.touchscreen.tap(u.x + u.width / 2, u.y + 250); await settle(p);
    const s = await st(p); check('toque siguiente en #under navega', s.hash === '#under-hit', s.hash || '(vacio)'); check('foco usable', s.usable, s.active); await ctx.close(); }

  { console.log('\nX4 raton: clic fuera y clic inmediato en enlace'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); const pt = await outsidePoint(p);
    await p.mouse.click(pt.x, pt.y); await settle(p); let s = await st(p);
    check('clic fuera no activa #under', s.hash !== '#under-hit', s.hash || '(vacio)');
    await p.click('#under'); s = await st(p); check('clic siguiente en #under navega (sin descarte con raton)', s.hash === '#under-hit', s.hash || '(vacio)'); await ctx.close(); }

  { console.log('\nX5 tactil 900: toque en overlay del carrito sobre un enlace'); const { ctx, p } = await ctxFor({ width: 900, height: 844 }, true);
    await p.tap('#cart'); await settle(p); await settle(p);
    const cb = await p.locator('[data-cart-drawer-panel]').boundingBox(); const u = await p.locator('#under').boundingBox();
    const x = u.x + u.width / 2; console.log(`  info panel x=${Math.round(cb.x)} under x=${Math.round(u.x)}`);
    await p.touchscreen.tap(x, u.y + 150); await settle(p); await p.waitForTimeout(300); const s = await st(p);
    check('carrito cerrado y foco en #cart', !s.cartOpen && !s.lock && s.active === 'cart', s.active);
    check('el enlace de debajo no se activa', s.hash !== '#under-hit', s.hash || '(vacio)'); await ctx.close(); }

  { console.log('\nX6 carrito desde el menu, resize a 1280 y Escape'); const { ctx, p } = await ctxFor(M);
    await p.click('#trigger'); await settle(p); await p.click('#m-cart'); await settle(p); await settle(p);
    await p.setViewportSize(D); await settle(p); await p.keyboard.press('Escape'); await settle(p); const s = await st(p);
    check('foco usable tras cerrar el carrito con el disparador oculto', !s.cartOpen && s.usable, s.active); await ctx.close(); }

  check('sin errores de pagina', errors.length === 0, errors.join(' | '));
  console.log(`\nRESULTADO mode=${mode}: ${checks - fails}/${checks} OK, ${fails} FAIL`);
  await browser.close();
  process.exitCode = fails ? 1 : 0;
})();
