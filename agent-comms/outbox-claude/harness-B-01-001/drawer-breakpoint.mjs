// B-01 (TT-104 / RC-10 / G-20). Arnes SINTETICO (Chromium local, sin tienda).
// Sirve assets/base.css y assets/theme.js REALES y una pagina que traduce a mano el markup de
// theme-drawer de sections/header.liquid:34-128 y la cabecera de escritorio.
// Uso: node agent-comms/outbox-claude/harness-B-01-001/drawer-breakpoint.mjs <repo> <fix|base> [SHA]
//   fix  = lee assets/base.css y assets/theme.js de la copia de trabajo.
//   base = los lee con `git show <SHA>:...` (SHA por defecto: 1fee9e2, la base fija de B-01).
//   MOBILE=1 = contexto isMobile + hasTouch y apertura con tap, en TODOS los escenarios.
// Sin parches en memoria, sin rutas absolutas, servidor solo en 127.0.0.1 (puerto 0).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repo = path.resolve(process.argv[2] || '.');
const mode = process.argv[3] || 'fix';
const SHA = process.argv[4] || '1fee9e2';
if (!['fix', 'base'].includes(mode)) throw new Error('modo: fix | base');
const MOBILE = !!process.env.MOBILE;
const { chromium } = await import(pathToFileURL(path.join(repo, 'node_modules/playwright/index.mjs')).href);
const show = (p) => execFileSync('git', ['-C', repo, 'show', `${SHA}:${p}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
const read = (p) => (mode === 'base' ? show(p) : fs.readFileSync(path.join(repo, p), 'utf8'));
const CSS = read('assets/base.css');
const JS = read('assets/theme.js');

const PAGE = `<!doctype html><html class="js" lang="en" data-animations="none" data-motion-style="atelier"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/base.css"><script src="/theme.js" defer></script></head>
<body class="template-index color-scheme-1">
<a class="skip-link" href="#MainContent">Skip to content</a>
<div id="shopify-section-header" class="shopify-section section-header">
<header class="site-header color-scheme-1" data-section-id="header">
  <div class="container site-header__inner">
    <theme-drawer class="site-header__mobile-menu">
      <button class="icon-button site-header__menu-button" type="button" aria-expanded="false" aria-controls="MobileMenu-header" data-drawer-trigger><svg width="20" height="20"></svg><span>Menu</span></button>
      <div class="drawer-overlay" data-drawer-overlay hidden>
        <div id="MobileMenu-header" class="drawer-panel color-scheme-1" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" tabindex="-1" data-drawer-panel inert>
          <div class="drawer-panel__header"><span class="h3">Menu</span>
            <button class="icon-button" type="button" aria-label="Close" data-drawer-close><svg width="20" height="20"></svg></button></div>
          <nav aria-label="Primary"><ul class="mobile-nav unstyled-list" role="list">
            <li><theme-disclosure class="mobile-nav__disclosure">
              <button class="mobile-nav__toggle" type="button" aria-expanded="false" aria-controls="MobileMenu-header-1" data-disclosure-trigger><span>Shop</span></button>
              <div id="MobileMenu-header-1" data-disclosure-panel hidden><ul class="mobile-nav__submenu unstyled-list" role="list">
                <li><a href="#all">View all Shop</a></li><li><a href="#coats">Coats</a></li></ul></div>
            </theme-disclosure></li>
            <li><a class="mobile-nav__link" id="m-about" href="#about">About</a></li>
          </ul></nav>
        </div>
      </div>
    </theme-drawer>
    <nav class="site-header__desktop-nav" aria-label="Primary"><ul class="desktop-nav unstyled-list" role="list">
      <li><a class="desktop-nav__link" id="d-shop" href="#shop">Shop</a></li>
      <li><a class="desktop-nav__link" id="d-about" href="#about">About</a></li></ul></nav>
    <a class="site-header__logo" id="logo" href="/">Sartorial</a>
    <div class="site-header__actions"><a class="icon-button site-header__cart" id="cart" href="/cart" aria-label="Cart">C</a></div>
  </div>
</header></div>
<main id="MainContent" class="site-main" tabindex="-1">
  <a id="main-link" href="#x">Main link</a>
  <div style="height:3000px">Long content</div>
</main>
<footer id="footer"><a id="footer-link" href="#f">Footer link</a></footer>
</body></html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/base.css') { res.writeHead(200, { 'content-type': 'text/css' }); return res.end(CSS); }
  if (req.url === '/theme.js') { res.writeHead(200, { 'content-type': 'text/javascript' }); return res.end(JS); }
  res.writeHead(200, { 'content-type': 'text/html' }); res.end(PAGE);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();

const state = (page) => page.evaluate(() => {
  const d = document.querySelector('theme-drawer');
  const inertIds = ['MainContent', 'footer'].filter((id) => document.getElementById(id).inert);
  const navInert = document.querySelector('.site-header__desktop-nav').inert;
  const logoInert = document.getElementById('logo').inert;
  const ae = document.activeElement;
  return {
    open: d.hasAttribute('data-open'),
    expanded: d.querySelector('[data-drawer-trigger]').getAttribute('aria-expanded'),
    overlayHidden: d.querySelector('[data-drawer-overlay]').hidden,
    panelInert: d.querySelector('[data-drawer-panel]').inert,
    bodyLock: document.body.hasAttribute('data-drawer-open'),
    overflow: getComputedStyle(document.body).overflow,
    inert: [...inertIds, navInert ? 'desktop-nav' : null, logoInert ? 'logo' : null].filter(Boolean).join(',') || '-',
    triggerRendered: d.querySelector('[data-drawer-trigger]').getClientRects().length > 0,
    activeVisible: ae !== document.body && ae.getClientRects().length > 0,
    active: ae === document.body ? 'BODY' : (ae.id || ae.getAttribute('aria-label') || ae.className || ae.tagName),
  };
});
const fmt = (s) => `open=${s.open} expanded=${s.expanded} overlayHidden=${s.overlayHidden} panelInert=${s.panelInert} bodyLock=${s.bodyLock} overflow=${s.overflow} inert=${s.inert} triggerRendered=${s.triggerRendered} activeVisible=${s.activeVisible} active=${s.active}`;
const settle = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
let fails = 0;
const check = (label, cond) => { console.log(`  ${cond ? 'OK  ' : 'FAIL'} ${label}`); if (!cond) fails += 1; };

async function newPage(viewport, mutate) {
  const ctx = await browser.newContext({ viewport, isMobile: MOBILE, hasTouch: MOBILE });
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForFunction(() => customElements.get('theme-drawer'));
  if (mutate) await page.evaluate(mutate);
  return { ctx, page };
}
const press = async (page, selector, timeout = 2000) => {
  if (MOBILE) await page.tap(selector, { timeout }); else await page.click(selector, { timeout });
};
const openMenu = async (page) => { await press(page, '[data-drawer-trigger]'); await settle(page); };

const MUT_EMPTY = () => {
  document.querySelectorAll('.desktop-nav li').forEach((li) => li.remove());
  document.querySelectorAll('.mobile-nav li').forEach((li) => li.remove());
};
const MUT_MANY = () => {
  const links = (n, p) => Array.from({ length: n }, (_, i) => `<li><a class="desktop-nav__link" id="${p}${i + 1}" href="#${p}${i + 1}">Link ${i + 1}</a></li>`).join('');
  document.querySelector('.desktop-nav').innerHTML = links(40, 'd-');
  const subs = Array.from({ length: 5 }, (_, i) => `<li><theme-disclosure class="mobile-nav__disclosure"><button class="mobile-nav__toggle" type="button" aria-expanded="false" aria-controls="MM-${i}" data-disclosure-trigger><span>Group ${i + 1}</span></button><div id="MM-${i}" data-disclosure-panel hidden><ul class="mobile-nav__submenu unstyled-list" role="list"><li><a href="#g${i}">Item</a></li></ul></div></theme-disclosure></li>`).join('');
  const flat = Array.from({ length: 40 }, (_, i) => `<li><a class="mobile-nav__link" href="#m${i}">Mobile ${i + 1}</a></li>`).join('');
  document.querySelector('.mobile-nav').innerHTML = subs + flat;
};

// Cruce de breakpoint con comprobaciones completas. expectFocus: id esperado tras cruzar.
async function crossing(name, from, to, expectCross, opts = {}) {
  const { expectFocus = 'd-shop', mutate = null, full = true } = opts;
  const { ctx, page } = await newPage(from, mutate);
  console.log(`\n## ${name}: ${from.width}x${from.height} -> ${to.width}x${to.height} -> ${from.width}x${from.height}`);
  await openMenu(page);
  const s0 = await state(page); console.log(`  abierto  : ${fmt(s0)}`);
  await page.setViewportSize(to); await settle(page);
  const s1 = await state(page); console.log(`  cruzado  : ${fmt(s1)}`);
  if (expectCross) {
    check('tras cruzar: cerrado (data-open, aria-expanded, overlay, panel inert)', !s1.open && s1.expanded === 'false' && s1.overlayHidden && s1.panelInert);
    check('tras cruzar: sin bloqueo de scroll', !s1.bodyLock && s1.overflow !== 'hidden');
    check('tras cruzar: sin inert en fondo', s1.inert === '-');
    check(`tras cruzar: foco en elemento visible (${expectFocus})`, s1.activeVisible && s1.active === expectFocus);
    await page.keyboard.press('Tab'); await settle(page);
    const tab = await page.evaluate(() => document.activeElement.id || document.activeElement.tagName);
    check(`Tab alcanza el siguiente control (${tab})`, tab !== 'BODY' && tab !== expectFocus);
    await page.mouse.wheel(0, 600); await page.waitForTimeout(150);
    const y = await page.evaluate(() => window.scrollY);
    check(`rueda desplaza la pagina (scrollY>0: ${y > 0})`, y > 0);
  } else {
    check('sin cruce: sigue abierto con bloqueo e inert', s1.open && s1.bodyLock && s1.inert !== '-');
  }
  await page.setViewportSize(from); await settle(page);
  const s2 = await state(page); console.log(`  vuelta   : ${fmt(s2)}`);
  if (expectCross && full) {
    check('vuelta: cerrado y coherente', !s2.open && s2.expanded === 'false' && s2.overlayHidden && s2.panelInert && !s2.bodyLock && s2.inert === '-');
    await page.evaluate(() => window.scrollTo(0, 0));
    try { await press(page, '[data-drawer-trigger]'); } catch { check('reabre normalmente (trigger tapado por el overlay)', false); await ctx.close(); return; }
    await settle(page);
    const s3 = await state(page);
    check('reabre normalmente con foco en Cerrar', s3.open && s3.bodyLock && s3.active === 'Close');
    await press(page, '[data-drawer-close]'); await settle(page);
    const s4 = await state(page);
    check('Cerrar devuelve el foco al disparador', !s4.open && s4.active.includes('site-header__menu-button'));
  }
  await ctx.close();
}

async function keyboard() {
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  console.log('\n## Teclado virtual: 390x844 -> 390x420 -> 390x844 (solo cambia el alto)');
  await openMenu(page);
  await page.setViewportSize({ width: 390, height: 420 }); await settle(page);
  const s = await state(page); console.log(`  reducido : ${fmt(s)}`);
  check('sigue abierto con bloqueo, inert y foco en Cerrar', s.open && s.bodyLock && s.inert !== '-' && s.active === 'Close');
  await page.setViewportSize({ width: 390, height: 844 }); await settle(page);
  const s2 = await state(page); console.log(`  vuelta   : ${fmt(s2)}`);
  check('vuelta: sigue abierto con foco en Cerrar', s2.open && s2.bodyLock && s2.active === 'Close');
  await ctx.close();
}

async function drag() {
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  console.log('\n## Arrastre: 89 setViewportSize de 400 a 1280 sin esperar entre pasos');
  await openMenu(page);
  await page.evaluate(() => {
    const d = document.querySelector('theme-drawer'); const so = d.setOpen.bind(d);
    window.__closes = 0; d.setOpen = (o, r) => { if (!o) window.__closes += 1; return so(o, r); };
  });
  let steps = 0;
  for (let w = 400; w <= 1280; w += 10) { await page.setViewportSize({ width: w, height: 800 }); steps += 1; }
  await settle(page);
  const closes = await page.evaluate(() => window.__closes);
  const s = await state(page); console.log(`  pasos=${steps} ${fmt(s)}`);
  check('setOpen(false) exactamente 1 vez', closes === 1);
  check('estado final coherente y foco visible en d-shop', !s.open && !s.bodyLock && s.inert === '-' && s.activeVisible && s.active === 'd-shop');
  await ctx.close();
}

async function escapeRegression() {
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  console.log('\n## Regresion Escape a 390');
  await openMenu(page);
  await page.keyboard.press('Escape'); await settle(page);
  const s = await state(page); console.log(`  ${fmt(s)}`);
  check('Escape cierra y devuelve foco al disparador', !s.open && !s.bodyLock && s.active.includes('site-header__menu-button'));
  await ctx.close();
}

async function closedResize() {
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  console.log('\n## Cajon cerrado, foco en main, 390 -> 1280');
  await page.focus('#main-link');
  await page.setViewportSize({ width: 1280, height: 800 }); await settle(page);
  const s = await state(page); console.log(`  ${fmt(s)}`);
  check('foco intacto (main-link) y nada cambia', s.active === 'main-link' && !s.open && s.inert === '-');
  await ctx.close();
}

async function submenu() {
  const { ctx, page } = await newPage({ width: 390, height: 844 });
  console.log('\n## Submenu abierto, foco en enlace interior, 390 -> 1280 -> 390');
  await openMenu(page);
  await press(page, '[data-disclosure-trigger]'); await settle(page);
  await page.focus('a[href="#coats"]');
  await page.setViewportSize({ width: 1280, height: 800 }); await settle(page);
  const s = await state(page); console.log(`  ${fmt(s)}`);
  check('cerrado, sin inert, foco visible en d-shop', !s.open && s.inert === '-' && s.activeVisible && s.active === 'd-shop');
  await page.setViewportSize({ width: 390, height: 844 }); await settle(page);
  const sub = await page.evaluate(() => document.querySelector('[data-disclosure-trigger]').getAttribute('aria-expanded'));
  console.log(`  info: submenu aria-expanded tras volver: ${sub} (igual que tras un cierre por boton; PD-3)`);
  await ctx.close();
}

console.log(`B-01 arnes SINTETICO (Chromium local, sin tienda). mode=${mode}${mode === 'base' ? ` sha=${SHA}` : ''} MOBILE=${MOBILE ? 1 : 0}`);
await crossing('S1 escritorio', { width: 390, height: 844 }, { width: 1280, height: 800 }, true);
await crossing('S2 giro tableta', { width: 820, height: 1180 }, { width: 1180, height: 820 }, true);
await crossing('S3 giro movil (sin cruce)', { width: 390, height: 844 }, { width: 844, height: 390 }, false);
await crossing('S4 justo en el corte', { width: 991, height: 800 }, { width: 992, height: 800 }, true);
await crossing('Degenerado vacio (nav sin enlaces: foco al logo)', { width: 390, height: 844 }, { width: 1280, height: 800 }, true, { mutate: MUT_EMPTY, expectFocus: 'logo', full: false });
await crossing('Degenerado muchos (40 enlaces, 5 submenus)', { width: 390, height: 844 }, { width: 1280, height: 800 }, true, { mutate: MUT_MANY, expectFocus: 'd-1' });
await keyboard();
await drag();
await escapeRegression();
await closedResize();
await submenu();
console.log(`\nresumen fallos=${fails}`);
await browser.close(); server.close();
process.exitCode = fails ? 1 : 0;
