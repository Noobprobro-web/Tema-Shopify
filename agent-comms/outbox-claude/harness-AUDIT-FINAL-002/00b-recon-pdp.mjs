import { STORES, launch, unlock } from './lib.mjs';
const browser = await launch();
for (const [name, store] of Object.entries(STORES)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const main = document.querySelector('main');
    const d = (el) => el.localName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
    return {
      sections: [...document.querySelectorAll('main [id^="shopify-section-"]')].map((s) => s.id.split('__')[1] + ':' + Math.round(s.getBoundingClientRect().height)),
      custom: [...new Set([...main.querySelectorAll('*')].map((e) => e.localName).filter((n) => n.includes('-')))],
      buttons: [...main.querySelectorAll('button, [role="button"], summary, input[type=radio], select, input[type=number], textarea')].map((b) => d(b).slice(0, 90) + ' | ' + (b.getAttribute('aria-label') || b.textContent.trim().slice(0, 30) || b.name || '') + ' | exp=' + b.getAttribute('aria-expanded') + ' ctl=' + b.getAttribute('aria-controls') + (b.disabled ? ' DISABLED' : '')),
      dialogs: [...document.querySelectorAll('[role="dialog"], dialog')].map((x) => d(x).slice(0, 80) + ' modal=' + x.getAttribute('aria-modal')),
      live: [...main.querySelectorAll('[aria-live], [role="status"], [role="alert"]')].map((x) => d(x).slice(0, 70) + ' live=' + x.getAttribute('aria-live') + ' role=' + x.getAttribute('role') + ' txt=' + x.textContent.trim().slice(0, 40)),
      price: main.querySelector('.price')?.textContent.replace(/\s+/g, ' ').trim(),
      inventory: main.querySelector('product-inventory')?.outerHTML.slice(0, 600),
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
    };
  });
  console.log(`\n===== ${name} ${store.products[0]} =====\n` + JSON.stringify(info, null, 1));
  await context.close();
}
await browser.close();
