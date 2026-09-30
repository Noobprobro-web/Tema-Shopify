// Eje 3 (consola): ¿el pageerror "Transition was aborted because of invalid state" que aparece al
// saltar de la tienda al checkout lo provoca el @view-transition del tema (assets/base.css) o es ruido
// del checkout de Shopify? Se compara la navegación original contra una con la regla neutralizada
// solo en el navegador de prueba (intercepción local de base.css; nada se despliega).
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const RULES = () => [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules]; } catch (e) { return []; } }).filter((r) => r.constructor.name === 'CSSViewTransitionRule').map((r) => r.cssText);

const out = [];
const browser = await launch();
const name = process.argv[2] || 'edition';
const store = STORES[name];
// 'pageswap-skip' valida el parche alternativo: conservar la transición entre páginas de la tienda y
// saltarla en el documento saliente cuando el destino no es una página del tema (checkout).
const MODES = process.argv[3] ? process.argv[3].split(',') : ['desplegado', 'desplegado-2', 'desplegado-3'];
const PAGESWAP_SKIP = () => { window.addEventListener('pageswap', (event) => { if (!event.viewTransition) return; const url = event.activation && event.activation.entry ? event.activation.entry.url : null; let path = ''; try { path = url ? new URL(url).pathname : ''; } catch (e) {} if (!url || /^\/(checkouts?|cart\/c)\//.test(path)) event.viewTransition.skipTransition(); }); };
for (const mode of MODES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let patched = 0;
  if (mode.startsWith('sin')) {
    await context.route(/\/assets\/base\.css/, async (route) => {
      const resp = await route.fetch();
      let body = await resp.text();
      const re = /@view-transition\s*\{\s*navigation:\s*auto;?\s*\}/g;
      patched = (body.match(re) || []).length;
      body = body.replace(re, '@view-transition{navigation:none}');
      await route.fulfill({ response: resp, body });
    });
  }
  if (mode.startsWith('pageswap')) await context.addInitScript(PAGESWAP_SKIP);
  await unlock(context, store.url);
  const page = await context.newPage();
  const errors = [];
  const tidy = (u) => u.replace(/checkouts\/.*/, 'checkouts/<token>').replace(store.url, '');
  page.on('pageerror', (e) => errors.push({ at: tidy(page.url()), name: e.name, msg: String(e.message).slice(0, 140), stack: String(e.stack || '').split('\n').slice(1, 3).map((l) => l.trim().replace(/\?[^:]*:/, ':').slice(0, 120)) }));
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const optIn = await page.evaluate(RULES);
  await page.locator('.product-form__submit').first().click();
  await page.waitForTimeout(2500);
  const co = page.locator('.cart-drawer__panel button[name="checkout"]').first();
  await Promise.all([page.waitForURL(/checkouts/, { timeout: 30000 }).catch(() => {}), co.click()]);
  await page.waitForTimeout(5000);
  const checkoutOptIn = await page.evaluate(RULES).catch(() => 'n/d');
  const rec = { store: name, mode, patchedRules: patched, storefrontViewTransitionRules: optIn, checkoutViewTransitionRules: checkoutOptIn, landed: tidy(page.url()), pageerrors: [...errors] };
  // Storefront → storefront (ambos con opt-in): no debe haber error.
  await page.goto(store.url + '/', { waitUntil: 'load' });
  const e0 = errors.length;
  await page.locator('main a[href*="/collections/"]').first().click().catch(() => {});
  await page.waitForTimeout(2500);
  rec.storefrontToStorefront = { landed: tidy(page.url()), errors: errors.length - e0 };
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }).then((r) => r.status)).catch(() => {});
  out.push(rec);
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-06-view-transition-' + name + (process.argv[3] ? '-' + MODES.join('+').replace(/[^a-z0-9+-]/gi, '') : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
