// Interacciones de solo lectura (menu, drawer, filtros, PDP, carrito) + métricas de políticas.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const OUT = fileURLToPath(new URL('.', import.meta.url));
const BASE = STORES.archive.url;
const R = {};
const log = (k, v) => { R[k] = v; console.log(k, JSON.stringify(v).slice(0, 1500)); };
async function go(page, path) {
  for (let i = 0; i < 3; i++) {
    const resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 }).catch(() => null);
    if (resp && resp.status() !== 429) break;
    await page.waitForTimeout(30000);
  }
  await page.waitForTimeout(1500);
}
const policyMetrics = () => {
  const rect = (el) => { if (!el) return null; const r = el.getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(window.innerWidth - r.right), width: Math.round(r.width), top: Math.round(r.top + scrollY) }; };
  const cs = (el, props) => { if (!el) return null; const s = getComputedStyle(el); return Object.fromEntries(props.map((p) => [p, s[p]])); };
  const cont = document.querySelector('.shopify-policy__container');
  const title = document.querySelector('.shopify-policy__title');
  const body = document.querySelector('.shopify-policy__body');
  const h1 = document.querySelector('main h1');
  const h2s = [...document.querySelectorAll('main h2')];
  const p = document.querySelector('main .shopify-policy__body p') || document.querySelector('main p');
  const logo = document.querySelector('header a[href="/"]');
  const firstNav = document.querySelector('header nav a');
  const footerCont = document.querySelector('footer .container') || document.querySelector('footer');
  const main = document.querySelector('main');
  const gaps = h2s.slice(0, 4).map((h) => { const prev = h.previousElementSibling; return prev ? Math.round(h.getBoundingClientRect().top - prev.getBoundingClientRect().bottom) : null; });
  const afterGaps = h2s.slice(0, 4).map((h) => { const n = h.nextElementSibling; return n ? Math.round(n.getBoundingClientRect().top - h.getBoundingClientRect().bottom) : null; });
  const titleEl = title || h1;
  const mainChildren = [...main.children].map((c) => c.localName + '.' + String(c.className).slice(0, 60) + '#' + c.id);
  const titleInner = title && [...title.querySelectorAll('*')].map((e) => e.localName + '.' + e.className);
  return {
    vw: innerWidth, mainChildren, titleTag: titleEl && titleEl.outerHTML.slice(0, 200), titleInner,
    containerClass: cont && cont.className, container: rect(cont), containerStyle: cs(cont, ['maxWidth', 'paddingLeft', 'paddingRight', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom']),
    title: rect(titleEl), titleStyle: cs(titleEl, ['fontSize', 'lineHeight', 'textAlign', 'marginTop', 'marginBottom']),
    body: rect(body), bodyStyle: cs(body, ['maxWidth', 'fontSize', 'lineHeight']),
    h2Count: h2s.length, h2Style: cs(h2s[0], ['fontSize', 'lineHeight', 'marginTop', 'marginBottom', 'overflowWrap', 'wordBreak', 'hyphens', 'textWrap']), h2Heights: h2s.slice(0, 10).map((h) => Math.round(h.getBoundingClientRect().height)),
    gapBeforeH2: gaps, gapAfterH2: afterGaps,
    pStyle: cs(p, ['fontSize', 'lineHeight', 'marginTop', 'marginBottom']),
    logo: rect(logo), firstNavLink: rect(firstNav), footer: rect(footerCont),
    headerBottom: Math.round(document.querySelector('header')?.getBoundingClientRect().bottom + scrollY),
    scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
  };
};
const browser = await launch();
for (const [vp, viewport] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport, isMobile: vp === 'm', hasTouch: vp === 'm' });
  await unlock(context, BASE);
  const page = await context.newPage();
  // ---------- Home: header / menu ----------
  await go(page, '/');
  log(`${vp}-links`, await page.evaluate(() => ({
    header: [...document.querySelectorAll('header a[href]')].map((a) => [a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), a.getAttribute('href')]),
    footer: [...document.querySelectorAll('footer a[href]')].map((a) => [a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), a.getAttribute('href')]),
    pagesLinks: [...new Set([...document.querySelectorAll('a[href*="/pages/"]')].map((a) => a.getAttribute('href')))],
    skipLink: (() => { const s = document.querySelector('.skip-link'); if (!s) return null; const r = s.getBoundingClientRect(); const c = getComputedStyle(s); return { r: [r.left, r.top, r.width, r.height].map(Math.round), op: c.opacity, clip: c.clip, clipPath: c.clipPath, transform: c.transform, position: c.position }; })(),
    marquee: (document.querySelector('[id*="marquee"]') || {}).innerText?.replace(/\s+/g, ' ').slice(0, 400),
    megaMenus: document.querySelectorAll('header .mega-menu, header details, header [aria-haspopup]').length,
    headerExpanded: [...document.querySelectorAll('header [aria-expanded]')].map((e) => [e.localName, (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 30), e.getAttribute('aria-expanded')]),
  })));
  if (vp === 'd') {
    await page.screenshot({ path: OUT + 'd-header-closed.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });
    const tog = page.locator('.desktop-nav__toggle').first();
    const panelInfo = () => page.evaluate(() => { const b = document.querySelector('.desktop-nav__toggle'); const p = b && document.getElementById(b.getAttribute('aria-controls')); const r = p && p.getBoundingClientRect(); return { label: b && b.innerText.trim(), expanded: b && b.getAttribute('aria-expanded'), panelHidden: p && p.hidden, panelClass: p && p.className, rect: r && [r.left, r.top, r.width, r.height].map(Math.round), text: p && p.innerText.replace(/\s+/g, ' ').slice(0, 400), imgs: p && [...p.querySelectorAll('img')].map((i) => [i.complete, i.naturalWidth, i.currentSrc.slice(-60)]) }; });
    if (await tog.count()) {
      await tog.hover(); await page.waitForTimeout(900);
      await page.screenshot({ path: OUT + 'd-header-catalog-hover.png', clip: { x: 0, y: 0, width: 1440, height: 700 } });
      log('d-catalog-hover', await panelInfo());
      await tog.click(); await page.waitForTimeout(1500);
      await page.screenshot({ path: OUT + 'd-header-catalog-click.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
      log('d-catalog-click', await panelInfo());
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
      log('d-catalog-escape', await panelInfo());
    } else log('d-catalog', 'no toggle');
  } else {
    await page.screenshot({ path: OUT + 'm-header-closed.png' });
    const toggle = page.locator('header [aria-controls^="MobileMenu-"]').first();
    await toggle.click(); await page.waitForTimeout(1200);
    await page.screenshot({ path: OUT + 'm-menu-drawer-open.png' });
    log('m-drawer', await page.evaluate(() => ({ expanded: document.querySelector('header [aria-controls^="MobileMenu-"]').getAttribute('aria-expanded'), text: document.querySelector('.drawer-panel')?.innerText.replace(/\s+/g, ' ').slice(0, 300), links: [...document.querySelectorAll('.drawer-panel a[href]')].map((a) => [a.textContent.trim().slice(0, 30), a.getAttribute('href')]) })));
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  }
  // ---------- Collection filters ----------
  await go(page, '/collections/all');
  log(`${vp}-facets`, await page.evaluate(() => ({ facets: [...document.querySelectorAll('.facet__summary')].map((s) => s.textContent.trim().replace(/\s+/g, ' ')), sort: [...document.querySelectorAll('[data-facet-sort] option')].map((o) => o.textContent.trim()), cards: document.querySelectorAll('.product-card').length, formRect: (() => { const f = document.querySelector('.facets'); if (!f) return null; const r = f.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); })() })));
  const summary = page.locator('.facet__summary').first();
  if (await summary.count()) {
    if (!(await summary.isVisible())) { const t = page.locator('button', { hasText: /filter/i }).first(); if (await t.count()) { await t.click().catch(() => {}); await page.waitForTimeout(800); } }
    if (await summary.isVisible()) { await summary.click(); await page.waitForTimeout(600); }
    await page.locator('.facets').first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: OUT + `${vp}-facets-open.png` });
  }
  // ---------- Policies ----------
  for (const pol of ['privacy-policy', 'refund-policy', 'shipping-policy', 'terms-of-service', 'contact-information']) {
    await go(page, '/policies/' + pol);
    log(`${vp}-policy-${pol}`, await page.evaluate(policyMetrics));
    if (pol === 'terms-of-service') {
      await page.evaluate(() => { const h = [...document.querySelectorAll('main h2')][3]; h && h.scrollIntoView({ block: 'center' }); });
      await page.waitForTimeout(600);
      await page.screenshot({ path: OUT + `${vp}-pol-terms-mid.png` });
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
      await page.screenshot({ path: OUT + `${vp}-pol-terms-top2.png` });
    }
  }
  // ---------- PDPs ----------
  for (const h of ['1990-pinstripe-double-breasted-jacket', '1997-printed-silk-square']) {
    await go(page, '/products/' + h);
    const js = await page.evaluate(async (h) => { const r = await fetch(`/products/${h}.js`); const j = await r.json(); return j.variants.map((v) => ({ id: v.id, available: v.available, price: v.price, compare: v.compare_at_price, qrule: v.quantity_rule })); }, h);
    const read = () => page.evaluate(() => {
      const q = document.querySelector('[data-quantity-input]');
      const plus = document.querySelector('[data-quantity-button="increase"]');
      const minus = document.querySelector('[data-quantity-button="decrease"]');
      const lt = document.querySelector('[data-line-total]');
      const info = document.querySelector('.product-main__info');
      const priceEl = info && info.querySelector('.price');
      const stepper = document.querySelector('[data-quantity-stepper]');
      const atc = document.querySelector('[name="add"]');
      return { value: q?.value, min: q?.min, max: q?.getAttribute('max'), valid: q?.checkValidity(), plusDisabled: plus?.disabled, minusDisabled: minus?.disabled, lineTotalText: lt?.innerText.trim(), lineTotalEmpty: lt?.hasAttribute('data-empty'), lineTotalDisplay: lt && getComputedStyle(lt).display, priceText: priceEl?.innerText.replace(/\s+/g, ' ').trim(), priceHTML: priceEl?.outerHTML.replace(/\s+/g, ' ').slice(0, 700), stepperWidth: stepper && Math.round(stepper.getBoundingClientRect().width), inventoryText: document.querySelector('product-inventory')?.innerText.trim(), atc: atc?.innerText.trim(), atcDisabled: atc?.disabled, visibleRegularPrice: /regular price|sale price/i.test(info?.innerText || '') };
    });
    const before = await read();
    const plus = page.locator('[data-quantity-button="increase"]').first();
    let afterPlus = null;
    if (await plus.count()) { await plus.click({ force: true }).catch(() => {}); await page.waitForTimeout(500); afterPlus = await read(); }
    const q = page.locator('[data-quantity-input]').first();
    let typed = null;
    if (await q.count()) {
      await q.fill('3'); await q.dispatchEvent('input'); await q.dispatchEvent('change'); await page.waitForTimeout(600); typed = await read();
      await page.locator('.product-main__info').first().screenshot({ path: OUT + `${vp}-pdp-${h.slice(5, 15)}-qty3.png` }).catch(() => {});
      await q.fill('1'); await q.dispatchEvent('change'); await page.waitForTimeout(400);
    }
    log(`${vp}-pdp-${h}`, { js, before, afterPlus, typed });
    await page.locator('.product-main__info').first().screenshot({ path: OUT + `${vp}-pdp-${h.slice(5, 15)}-info.png` }).catch(() => {});
  }
  // ---------- Cart ----------
  await go(page, '/products/1997-printed-silk-square');
  const atc = page.locator('[name="add"]').first();
  if (await atc.isEnabled().catch(() => false)) {
    await atc.click(); await page.waitForTimeout(3000);
    await page.screenshot({ path: OUT + `${vp}-cart-drawer-open.png` });
    log(`${vp}-drawer`, await page.evaluate(() => { const p = document.querySelector('[data-cart-drawer-panel]'); return { vis: p && getComputedStyle(p).visibility, text: p?.innerText.replace(/\s+/g, ' ').slice(0, 700), qty: [...document.querySelectorAll('[data-cart-drawer-panel] input[type=number]')].map((i) => [i.value, i.getAttribute('max')]), plus: [...document.querySelectorAll('[data-cart-drawer-panel] [data-quantity-button="increase"], [data-cart-drawer-panel] button[name="plus"]')].map((b) => b.disabled) }; }));
    const dplus = page.locator('[data-cart-drawer-panel] button[name="plus"], [data-cart-drawer-panel] [data-quantity-button="increase"]').first();
    if ((await dplus.count()) && (await dplus.isEnabled())) { await dplus.click(); await page.waitForTimeout(3000); await page.screenshot({ path: OUT + `${vp}-cart-drawer-plus.png` }); log(`${vp}-drawer-after-plus`, await page.evaluate(() => document.querySelector('[data-cart-drawer-panel]')?.innerText.replace(/\s+/g, ' ').slice(0, 700))); }
    await go(page, '/cart');
    await page.screenshot({ path: OUT + `${vp}-cart-page.png`, fullPage: true });
    await page.screenshot({ path: OUT + `${vp}-cart-page-top.png` });
    log(`${vp}-cartpage`, await page.evaluate(() => ({ text: document.querySelector('main')?.innerText.replace(/\s+/g, ' ').slice(0, 700), scrollW: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })));
  } else log(`${vp}-atc`, 'disabled');
  await page.evaluate(async () => { await fetch('/cart/clear.js', { method: 'POST' }); });
  log(`${vp}-cart-cleared`, await page.evaluate(async () => (await (await fetch('/cart.js')).json()).item_count));
  await context.close();
}
await browser.close();
fs.writeFileSync(OUT + 'results-02-interactions.json', JSON.stringify(R, null, 1));
