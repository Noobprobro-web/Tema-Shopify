// X1 / LV-03. Compensacion de la barra de scroll al bloquear el scroll (menu, carrito, busqueda,
// guia de tallas). Sintetico y local: Chromium de Playwright SIN --hide-scrollbars (barra clasica de
// escritorio), CSS y JS reales del tema. Sin red ni credenciales.
// Uso: node lv03.cjs <repo> <fix|base> [ref]   (base: theme.js y base.css de ref, por defecto e5da3b1)
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const repo = path.resolve(process.argv[2]);
const mode = process.argv[3] || 'fix';
const ref = process.argv[4] || 'e5da3b1';
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
  <size-guide-modal class="size-guide" data-default-unit="cm">
    <button id="sg-trigger" class="size-guide__trigger" type="button" aria-expanded="false" aria-haspopup="dialog" aria-controls="SG" data-size-guide-open><span>Size guide</span></button>
    <div class="size-guide-modal__overlay" data-size-guide-overlay hidden>
      <section id="SG" class="size-guide-modal__panel color-scheme-1" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="SG-Title" tabindex="-1" data-size-guide-panel inert>
        <header class="size-guide-modal__header"><h2 id="SG-Title" class="size-guide-modal__title">Size guide</h2>
          <button id="sg-close" class="icon-button" type="button" aria-label="Close" data-size-guide-close>X</button></header>
        <div class="size-guide-modal__body"><p>Body</p></div></section></div></size-guide-modal>
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


const D = { width: 1280, height: 800 };
const T = { width: 767, height: 900 };

(async () => {
  const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
  let fails = 0; let checks = 0; const errors = [];
  const check = (label, cond, extra = '') => { checks += 1; if (!cond) fails += 1; console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${label}${extra ? ` -> ${extra}` : ''}`); };
  const settle = (p) => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const geo = (p) => p.evaluate(() => {
    const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return Math.round(b.left * 100) / 100; };
    return { brand: r('#brand'), cart: r('#cart'), text: r('#bodytext'), main: Math.round(document.querySelector('#MainContent').getBoundingClientRect().width * 100) / 100,
      bar: window.innerWidth - document.documentElement.clientWidth, comp: document.body.style.getPropertyValue('--scrollbar-compensation'),
      pad: getComputedStyle(document.body).paddingRight, lock: document.body.hasAttribute('data-drawer-open') || document.body.hasAttribute('data-modal-open') };
  });
  const ctxFor = async (vp, mobile = false) => {
    const ctx = await browser.newContext({ viewport: vp, ...(mobile ? { isMobile: true, hasTouch: true } : {}) });
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
    await p.waitForFunction(() => customElements.get('theme-drawer') && customElements.get('cart-drawer') && customElements.get('size-guide-modal'));
    await settle(p);
    return { ctx, p };
  };
  const same = (a, b) => ['brand', 'cart', 'text', 'main'].every((k) => Math.abs(a[k] - b[k]) < 0.5);
  const diff = (a, b) => ['brand', 'cart', 'text', 'main'].map((k) => `${k}${(b[k] - a[k]).toFixed(1)}`).join(' ');
  const surfaces = [
    ['menu', (p) => p.evaluate(() => document.querySelector('theme-drawer').setOpen(true)), (p) => p.keyboard.press('Escape')],
    ['carrito', (p) => p.click('#cart'), (p) => p.keyboard.press('Escape')],
    ['busqueda', (p) => p.click('#s-trigger'), (p) => p.keyboard.press('Escape')],
    ['guia de tallas', (p) => p.click('#sg-trigger'), (p) => p.keyboard.press('Escape')],
  ];

  console.log(`LV-03 mode=${mode}${mode === 'base' ? ` ref=${ref}` : ''}`);
  for (const vp of [D, T]) {
    for (const [name, openIt, closeIt] of surfaces) {
      if (vp === T && name === 'menu') continue;
      console.log(`\nL ${vp.width} ${name}`); const { ctx, p } = await ctxFor(vp);
      const g0 = await geo(p); await openIt(p); await settle(p); await settle(p); const g1 = await geo(p);
      check(`${vp.width} ${name}: hay barra clasica antes de abrir`, g0.bar > 0, `bar=${g0.bar}`);
      check(`${vp.width} ${name}: bloqueado y 0 px de desplazamiento`, g1.lock && same(g0, g1), `${diff(g0, g1)} comp=${g1.comp || '-'}`);
      await closeIt(p); await settle(p); const g2 = await geo(p);
      check(`${vp.width} ${name}: al cerrar, sin bloqueo, sin compensacion y en su sitio`, !g2.lock && !g2.comp && g2.pad === '0px' && same(g0, g2), `${diff(g0, g2)} pad=${g2.pad}`);
      await ctx.close();
    }
  }
  { console.log('\nL 767 menu por el disparador'); const { ctx, p } = await ctxFor(T);
    const g0 = await geo(p); await p.click('#trigger'); await settle(p); const g1 = await geo(p);
    check('767 menu: 0 px de desplazamiento', g1.lock && same(g0, g1), diff(g0, g1));
    await p.click('#m-cart'); await settle(p); await settle(p); const g2 = await geo(p);
    check('menu -> carrito desde el menu: sigue bloqueado y sin desplazamiento', g2.lock && same(g0, g2), `${diff(g0, g2)} comp=${g2.comp}`);
    await p.keyboard.press('Escape'); await settle(p); const g3 = await geo(p);
    check('cerrar carrito: sin compensacion', !g3.lock && !g3.comp && same(g0, g3), diff(g0, g3)); await ctx.close(); }
  { console.log('\nL 1280 pagina corta (sin barra)'); const { ctx, p } = await ctxFor(D);
    await p.evaluate(() => { document.querySelectorAll('#MainContent > div, #under').forEach((e) => e.remove()); }); await settle(p);
    const g0 = await geo(p); await p.click('#cart'); await settle(p); const g1 = await geo(p);
    check('sin barra: compensacion 0', g0.bar === 0 && g1.lock && !g1.comp && same(g0, g1), `bar=${g0.bar} comp=${g1.comp || '-'}`); await ctx.close(); }
  { console.log('\nL movil 390 (isMobile, barra superpuesta)'); const { ctx, p } = await ctxFor({ width: 390, height: 844 }, true);
    const g0 = await geo(p); await p.tap('#trigger'); await settle(p); const g1 = await geo(p);
    check('movil: compensacion 0 y sin desplazamiento', g0.bar === 0 && g1.lock && !g1.comp && g1.pad === '0px' && same(g0, g1), `bar=${g0.bar} comp=${g1.comp || '-'} pad=${g1.pad}`); await ctx.close(); }

  for (const [label, vp, mobile] of [['movil 390 (isMobile)', { width: 390, height: 844 }, true], ['escritorio 1280', D, false]]) {
    console.log(`\nL ${label} con desborde horizontal`); const { ctx, p } = await ctxFor(vp, mobile);
    await p.evaluate((w) => { const d = document.createElement('div'); d.id = 'wide'; d.style.cssText = `width:${w}px;height:10px;background:#ccc`; document.querySelector('#MainContent').prepend(d); }, vp.width + 310);
    await settle(p);
    const g0 = await geo(p);
    if (mobile) await p.tap('#trigger'); else await p.click('#cart');
    await settle(p); await settle(p); const g1 = await geo(p);
    const comp = parseFloat(g1.comp || '0');
    console.log(`  info innerWidth-clientWidth=${await p.evaluate(() => window.innerWidth - document.documentElement.clientWidth)} comp=${g1.comp || '-'} pad=${g1.pad}`);
    check(`${label} con desborde: compensacion igual a la barra real (${mobile ? 0 : 15} px)`, g1.lock && comp === (mobile ? 0 : g0.bar) && comp <= 32, `comp=${g1.comp || '-'} bar=${g0.bar}`);
    check(`${label} con desborde: sin desplazamiento`, same(g0, g1), diff(g0, g1));
    await ctx.close();
  }

  check('sin errores de pagina', errors.length === 0, errors.join(' | '));
  console.log(`\nRESULTADO mode=${mode}: ${checks - fails}/${checks} OK, ${fails} FAIL`);
  await browser.close();
  process.exitCode = fails ? 1 : 0;
})();
