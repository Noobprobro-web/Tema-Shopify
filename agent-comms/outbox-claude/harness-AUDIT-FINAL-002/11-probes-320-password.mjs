// Tres cabos sueltos:
//  a) overflow a 320 px solo aparece con prefers-reduced-motion: ¿qué elemento lo causa?
//  b) enlaces Privacy/Terms enfocables fuera de pantalla: ¿tema o plataforma (hCaptcha)?
//  c) página de contraseña servida sin sesión: qué layout usa cada tienda (captura incluida).
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

fs.mkdirSync(new URL('./evidence/', import.meta.url), { recursive: true });
const file = (n) => new URL('./evidence/' + n, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/%20/g, ' ');
const OFFENDERS = () => {
  const de = document.documentElement; const vw = de.clientWidth;
  const d = (el) => el.localName + (el.id ? '#' + el.id.slice(0, 30) : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
  const clippedBy = (el) => { for (let p = el.parentElement; p && p !== document.body && p !== de; p = p.parentElement) { if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) return d(p); } return null; };
  const list = [];
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 0.5 && !clippedBy(el) && cs.position !== 'fixed' && !el.closest('.visually-hidden')) list.push({ el: d(el), section: (el.closest('[id^="shopify-section-"]')?.id || '').split('__').pop(), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), position: cs.position, animation: cs.animationName, overflowX: cs.overflowX, ws: cs.whiteSpace });
  }
  return { scrollWidth: de.scrollWidth, clientWidth: vw, offenders: list.slice(0, 10) };
};

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const o = (out[name] = {});
  // c) contraseña, sin cookies.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const resp = await page.goto(store.url + '/password', { waitUntil: 'load' }).catch(() => null);
    await page.waitForTimeout(1500);
    o.password = await page.evaluate(() => ({ url: location.pathname, title: document.title, bodyClass: document.body.className, stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href.split('?')[0].split('/').pop()), h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 50)), hasThemeHeader: !!document.querySelector('.site-header'), navLinks: [...document.querySelectorAll('.desktop-nav__link')].map((a) => a.textContent.trim()), passwordModal: !!document.querySelector('password-modal'), passwordInputs: document.querySelectorAll('input[type="password"]').length, textSample: document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 160), bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 40), mainSection: [...document.querySelectorAll('[id^="shopify-section-"]')].map((s) => s.id.split('__').pop()).join(',') }));
    o.password.status = resp ? resp.status() : null;
    await page.screenshot({ path: file(`${name}-password-1440.jpg`), type: 'jpeg', quality: 60 });
    await context.close();
  }
  // a) 320 px, con y sin movimiento reducido.
  for (const rm of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ viewport: { width: 320, height: 640 }, reducedMotion: rm });
    await unlock(context, store.url);
    const page = await context.newPage();
    await page.goto(store.url + '/', { waitUntil: 'load' });
    await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(700);
    o['home320-' + rm] = await page.evaluate(OFFENDERS);
    if (rm === 'reduce') {
      // b) hCaptcha: enfocar el campo del boletín suele cargar el widget.
      await page.setViewportSize({ width: 375, height: 667 });
      await page.locator('[id^="NewsletterEmail"], #FooterNewsletterEmail').first().focus().catch(() => {});
      await page.waitForTimeout(4000);
      o.offscreenLinks = await page.evaluate(() => [...document.querySelectorAll('a.privacy, a.terms')].map((a) => { const r = a.getBoundingClientRect(); const chain = []; for (let p = a; p && p !== document.body; p = p.parentElement) chain.push(p.localName + (p.id ? '#' + p.id : '') + (p.className && typeof p.className === 'string' && p.className ? '.' + p.className.split(/\s+/)[0] : '')); const fixed = (() => { for (let p = a; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.position === 'fixed' || cs.position === 'absolute') return p.localName + ' ' + cs.position + ' left=' + cs.left + ' right=' + cs.right + ' bottom=' + cs.bottom + ' vis=' + cs.visibility; } return null; })(); return { text: a.textContent.trim(), host: new URL(a.href).host, x: Math.round(r.left), chain: chain.slice(0, 7).join(' < '), inThemeSection: !!a.closest('[id^="shopify-section-"]'), positioned: fixed }; }));
      o.captchaScripts = await page.evaluate(() => [...document.querySelectorAll('script[src*="captcha"], iframe[src*="captcha"]')].map((n) => n.src.split('?')[0].slice(0, 80)));
    }
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-11-probes' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
