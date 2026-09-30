// Sondas puntuales que cierran cabos de los otros scripts:
//  a) qué elemento produce el desbordamiento a 320 px (WCAG 1.4.10 Reflow);
//  b) cantidad 0 / negativa en la ficha + Add to cart;
//  c) de quién son los enlaces "Privacy" / "Terms" enfocables fuera de pantalla;
//  d) página de contraseña (sin sesión): título, cabecera, modal de contraseña;
//  e) estado vacío de recomendaciones / vistos recientemente (fail-closed) en primera visita.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const OFFENDERS = () => {
  const de = document.documentElement; const vw = de.clientWidth;
  const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body && p !== de; p = p.parentElement) { if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) return true; } return false; };
  const d = (el) => el.localName + (el.id ? '#' + el.id.slice(0, 30) : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
  const list = [];
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 0.5 && !clipped(el) && cs.position !== 'fixed' && !el.closest('.visually-hidden')) list.push({ el: d(el), section: (el.closest('[id^="shopify-section-"]')?.id || '').split('__').pop(), right: Math.round(r.right), w: Math.round(r.width), minW: cs.minWidth, ws: cs.whiteSpace, text: el.children.length === 0 ? el.textContent.trim().slice(0, 40) : '' });
  }
  return { scrollWidth: de.scrollWidth, clientWidth: vw, offenders: list.slice(0, 12) };
};

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const o = (out[name] = {});

  // d) Página de contraseña: contexto limpio, sin cookies y sin intentar entrar.
  {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();
    const resp = await page.goto(store.url + '/password', { waitUntil: 'load' }).catch(() => null);
    await page.waitForTimeout(1200);
    o.password = await page.evaluate(() => ({ title: document.title, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()), headerNavLinks: [...document.querySelectorAll('header a, .site-header a, [id^="MobileMenu"] a')].map((a) => a.textContent.trim() || a.getAttribute('aria-label')).filter(Boolean).slice(0, 12), hasSearch: !!document.querySelector('.predictive-search__trigger'), hasCart: !!document.querySelector('.site-header__cart'), footerNewsletter: !!document.querySelector('.site-footer form'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, metaRobots: document.querySelector('meta[name="robots"]')?.content || null }));
    o.password.status = resp ? resp.status() : null;
    const trigger = page.locator('password-modal button, [data-password-open]').first();
    if (await trigger.count()) {
      await trigger.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
      const open = await page.evaluate(() => { const d = document.querySelector('password-modal [role="dialog"], password-modal dialog'); const a = document.activeElement; return { dialog: !!d, modal: d?.getAttribute('aria-modal') || (d?.localName === 'dialog' ? 'native' : null), focusIn: !!(d && d.contains(a)), active: a.localName + '#' + a.id, label: a.labels && a.labels[0] ? a.labels[0].textContent.trim() : null, type: a.type, autocomplete: a.autocomplete }; });
      let escapes = 0; for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); if (!(await page.evaluate(() => { const d = document.querySelector('password-modal [role="dialog"], password-modal dialog'); return d && d.contains(document.activeElement); }))) escapes++; }
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
      o.password.modal = { ...open, tabEscapes: escapes, escReturnsToTrigger: await page.evaluate(() => !!document.activeElement.closest('password-modal') && document.activeElement.localName === 'button') };
    }
    // Un enlace de la cabecera desde la página de contraseña: ¿a dónde lleva?
    const link = page.locator('header a[href="/collections/all"], .desktop-nav__link, .mobile-nav__link').first();
    o.password.navLinkHref = (await link.count()) ? await link.getAttribute('href') : null;
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  // a) Reflow a 320 px.
  o.reflow320 = {};
  for (const p of ['/', '/collections/all', '/products/' + store.products[0], '/cart']) {
    await page.goto(store.url + p, { waitUntil: 'load' });
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    o.reflow320[p] = await page.evaluate(OFFENDERS);
  }

  // c) Enlaces Privacy / Terms fuera de pantalla.
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  o.offscreenLinks = await page.evaluate(() => [...document.querySelectorAll('a.privacy, a.terms')].map((a) => { const r = a.getBoundingClientRect(); const chain = []; for (let p = a; p && p !== document.body; p = p.parentElement) chain.push(p.localName + (p.id ? '#' + p.id : '') + (p.className && typeof p.className === 'string' ? '.' + p.className.split(/\s+/)[0] : '')); const host = a.closest('[class*="captcha"], [class*="grecaptcha"], [id*="captcha"], div[style*="position"]'); return { href: a.href.slice(0, 60), x: Math.round(r.left), chain: chain.slice(0, 6).join(' < '), inThemeSection: !!a.closest('[id^="shopify-section-"]'), hostStyle: host ? (host.getAttribute('style') || '').slice(0, 140) : null, tabindex: a.getAttribute('tabindex') }; }));
  o.docOverflowWithBadge = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  // b) Cantidad inválida en la ficha.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  o.invalidQty = {};
  for (const val of ['0', '-3', '1.5', '']) {
    const qi = page.locator('main [id$="__main"] [data-quantity-input]').first();
    await qi.fill(val); await page.keyboard.press('Tab');
    const posts = [];
    const onReq = (r) => { if (r.method() === 'POST' && /cart\/add/.test(r.url())) posts.push(r.postData()?.match(/name="quantity"\r?\n\r?\n([^\r\n]*)/)?.[1] ?? 'post'); };
    page.on('request', onReq);
    await page.locator('main [id$="__main"] .product-form__submit').first().click();
    await page.waitForTimeout(1800);
    page.off('request', onReq);
    o.invalidQty[val === '' ? '(vacío)' : val] = await page.evaluate(() => { const i = document.querySelector('main [id$="__main"] [data-quantity-input]'); const err = document.querySelector('main [id$="__main"] [data-product-form-error]'); const panel = document.querySelector('.cart-drawer__panel'); return { valueAfter: i.value, valid: i.checkValidity(), validationMessage: i.validationMessage.slice(0, 60), focusOnInput: document.activeElement === i, formError: err && !err.hidden ? err.textContent.trim().slice(0, 80) : null, drawerOpened: !panel.inert }; });
    o.invalidQty[val === '' ? '(vacío)' : val].addRequests = posts;
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status));
  }

  // e) Fail-closed: primera visita, sin historial de vistos recientemente.
  await page.evaluate(() => { try { Object.keys(localStorage).forEach((k) => /recent/i.test(k) && localStorage.removeItem(k)); } catch (e) {} });
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  o.failClosed = await page.evaluate(() => { const box = (sel) => { const n = document.querySelector(sel); if (!n) return null; const w = n.closest('[id^="shopify-section-"]'); const r = w.getBoundingClientRect(); const cs = getComputedStyle(w); return { hidden: n.hidden, busy: n.getAttribute('aria-busy'), wrapperHeight: Math.round(r.height), wrapperMargin: cs.marginTop + '/' + cs.marginBottom, wrapperBorder: cs.borderTopWidth + '/' + cs.borderBottomWidth, wrapperPadding: cs.paddingTop + '/' + cs.paddingBottom, childNodes: n.children.length }; }; return { recentlyViewed: box('recently-viewed'), recommendations: box('product-recommendations'), emptySectionWrappers: [...document.querySelectorAll('[id^="shopify-section-"]')].filter((s) => s.id !== 'shopify-section-cart-drawer' && s.getBoundingClientRect().height === 0).map((s) => s.id.split('__').pop()) }; });
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  o.homeEmptyWrappers = await page.evaluate(() => [...document.querySelectorAll('main [id^="shopify-section-"]')].map((s) => ({ id: s.id.split('__').pop(), h: Math.round(s.getBoundingClientRect().height), kids: s.children.length })).filter((s) => s.h < 4));
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-10-misc' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
