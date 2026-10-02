// Sondas puntuales de solo lectura: hueco política→footer, input 404, promo del mega menú, submenú móvil.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const OUT = fileURLToPath(new URL('.', import.meta.url));
const BASE = STORES.archive.url;
const R = {};
const log = (k, v) => { R[k] = v; console.log(k, JSON.stringify(v).slice(0, 1200)); };
const browser = await launch();
for (const [vp, viewport] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport, isMobile: vp === 'm', hasTouch: vp === 'm' });
  await unlock(context, BASE);
  const page = await context.newPage();
  await page.goto(BASE + '/policies/terms-of-service', { waitUntil: 'load' }); await page.waitForTimeout(1500);
  log(`${vp}-terms-gaps`, await page.evaluate(() => {
    const c = document.querySelector('.shopify-policy__container');
    const last = c.querySelector('.shopify-policy__body').lastElementChild;
    const footer = document.querySelector('footer, .shopify-section-group-footer-group');
    const h1 = c.querySelector('h1');
    const header = document.querySelector('header');
    const s = getComputedStyle(h1);
    return { h1FontSize: s.fontSize, h1Align: getComputedStyle(c.querySelector('.shopify-policy__title')).textAlign, h1TopMinusHeaderBottom: Math.round(h1.getBoundingClientRect().top - header.getBoundingClientRect().bottom), lastTextToFooter: Math.round(footer.getBoundingClientRect().top - last.getBoundingClientRect().bottom), headerInner: (() => { const n = document.querySelector('.site-header__desktop-nav, header [aria-controls^="MobileMenu-"]'); const r = n && n.getBoundingClientRect(); return r && Math.round(r.left); })(),
      shopifyPolicyStyleTag: [...document.querySelectorAll('style')].map((t) => t.textContent).filter((t) => t.includes('shopify-policy')).map((t) => t.replace(/\s+/g, ' ').slice(0, 600)) };
  }));
  await page.goto(BASE + '/products/does-not-exist', { waitUntil: 'load' }); await page.waitForTimeout(1200);
  log(`${vp}-404-input`, await page.evaluate(() => { const i = document.querySelector('main input[type="search"], main input[name="q"]'); const r = i && i.getBoundingClientRect(); return i && { w: Math.round(r.width), placeholder: i.placeholder, scrollW: i.scrollWidth }; }));
  if (vp === 'd') {
    log('d-mega-promo', await page.evaluate(() => { const p = document.querySelector('.desktop-nav__mega-menu'); return p && { promoHTML: [...p.querySelectorAll('a')].slice(-2).map((a) => a.outerHTML.replace(/\s+/g, ' ').slice(0, 400)) }; }));
  } else {
    await page.locator('header [aria-controls^="MobileMenu-"]').first().click(); await page.waitForTimeout(1000);
    const sub = page.locator('.drawer-panel [aria-controls^="MobileMenu-"]').first();
    if (await sub.count()) { await sub.click(); await page.waitForTimeout(800); }
    await page.screenshot({ path: OUT + 'm-menu-drawer-catalog.png' });
    log('m-submenu', await page.evaluate(() => document.querySelector('.drawer-panel')?.innerText.replace(/\s+/g, ' ').slice(0, 400)));
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(OUT + 'results-03-probes.json', JSON.stringify(R, null, 1));
