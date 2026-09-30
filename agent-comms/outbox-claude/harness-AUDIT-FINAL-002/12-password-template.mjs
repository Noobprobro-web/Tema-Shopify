// La plantilla de contraseña DEL TEMA (templates/password.json + sections/main-password.liquid).
// Sin sesión, estas tiendas de desarrollo sirven la puerta genérica de Shopify (no es del tema: ver 11).
// Con la sesión ya abierta, /password renderiza la plantilla del tema, que es la que verá el visitante
// de la tienda de un comerciante real. Se audita título, cabecera, modal, overflow y axe.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const AXE = process.env.AXE_PATH ? fs.readFileSync(process.env.AXE_PATH, 'utf8') : null;
fs.mkdirSync(new URL('./evidence/', import.meta.url), { recursive: true });
const file = (n) => new URL('./evidence/' + n, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/%20/g, ' ');
const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const o = (out[name] = {});
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await unlock(context, store.url);
    const page = await context.newPage();
    const resp = await page.goto(store.url + '/password', { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const v = (o[vp.n] = { status: resp.status() });
    v.page = await page.evaluate(() => ({ url: location.pathname, title: document.title, titleStartsWithDash: /^\s*[–-]/.test(document.title), template: document.body.className, h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 60)), themed: !!document.querySelector('link[href*="base.css"]'), headerNav: [...document.querySelectorAll('.desktop-nav__link, .mobile-nav__link')].map((a) => a.textContent.trim() + '→' + a.getAttribute('href')), headerControls: { menu: !!document.querySelector('.site-header__menu-button'), search: !!document.querySelector('.predictive-search__trigger'), account: !!document.querySelector('shopify-account'), cart: !!document.querySelector('.site-header__cart'), announcement: !!document.querySelector('announcement-bar') }, footer: { newsletter: !!document.querySelector('.site-footer form'), links: [...document.querySelectorAll('.site-footer a')].map((a) => a.textContent.trim()) }, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, passwordTrigger: !!document.querySelector('password-modal'), layoutHasPasswordLayout: document.documentElement.className }));
    if (AXE) { await page.evaluate(AXE); v.axe = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] }); return r.violations.map((x) => x.id + '×' + x.nodes.length + ' ' + x.nodes[0].target.join(' ').slice(0, 80)); }); }
    const trig = page.locator('password-modal button').first();
    if (await trig.count()) {
      await trig.focus(); const label = await trig.evaluate((b) => ({ text: b.textContent.trim(), exp: b.getAttribute('aria-expanded'), controls: b.getAttribute('aria-controls') }));
      await page.keyboard.press('Enter'); await page.waitForTimeout(600);
      const open = await page.evaluate(() => { const d = document.querySelector('password-modal [role="dialog"], password-modal dialog'); const a = document.activeElement; return { dialog: d ? d.localName + '/' + (d.getAttribute('aria-modal') || (d.open ? 'native-open' : '')) : null, labelled: !!(d && (d.getAttribute('aria-labelledby') || d.getAttribute('aria-label'))), focusIn: !!(d && d.contains(a)), active: a.localName + '[' + a.type + ']', inputLabel: a.labels && a.labels[0] ? a.labels[0].textContent.trim() : null, autocomplete: a.getAttribute('autocomplete'), trigExp: document.querySelector('password-modal button').getAttribute('aria-expanded') }; });
      let escapes = 0; for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); if (!(await page.evaluate(() => { const d = document.querySelector('password-modal [role="dialog"], password-modal dialog'); return d && d.contains(document.activeElement); }))) escapes++; }
      if (AXE) v.axeModal = await page.evaluate(async () => { const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] }); return r.violations.map((x) => x.id + '×' + x.nodes.length); });
      await page.keyboard.press('Escape'); await page.waitForTimeout(500);
      v.modal = { trigger: label, ...open, tabEscapes: escapes, escReturnsFocus: await trig.evaluate((b) => document.activeElement === b), trigExpAfter: await trig.getAttribute('aria-expanded') };
    }
    if (vp.n === '1440') await page.screenshot({ path: file(`${name}-password-template-1440.jpg`), type: 'jpeg', quality: 55 });
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-12-password-template' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
