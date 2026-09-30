import { STORES, launch, unlock } from './lib.mjs';

const browser = await launch();
for (const [name, store] of Object.entries(STORES)) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ok = await unlock(context, store.url);
  const page = await context.newPage();
  const resp = await page.goto(store.url + '/', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('[id^="shopify-section-"]')].map((s) => ({
      id: s.id.replace('shopify-section-', ''),
      cls: s.className,
      h: Math.round(s.getBoundingClientRect().height),
      kids: s.children.length,
    }));
    const customEls = [...new Set([...document.querySelectorAll('*')].map((e) => e.localName).filter((n) => n.includes('-')))];
    const dialogs = [...document.querySelectorAll('[role="dialog"], dialog')].map((d) => ({ tag: d.localName, id: d.id, cls: d.className, modal: d.getAttribute('aria-modal'), label: d.getAttribute('aria-label') || d.getAttribute('aria-labelledby') }));
    const live = [...document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')].map((d) => ({ tag: d.localName, id: d.id, cls: d.className, live: d.getAttribute('aria-live'), role: d.getAttribute('role') }));
    const expanded = [...document.querySelectorAll('[aria-expanded]')].map((d) => ({ tag: d.localName, cls: d.className.toString().slice(0, 60), exp: d.getAttribute('aria-expanded'), controls: d.getAttribute('aria-controls'), label: (d.getAttribute('aria-label') || d.textContent.trim()).slice(0, 40) }));
    return { title: document.title, theme: window.Shopify && window.Shopify.theme, sections, customEls, dialogs, live, expanded };
  });
  console.log(`\n===== ${name} unlocked=${ok} status=${resp.status()} =====`);
  console.log(JSON.stringify(info, null, 1));
  // product handles actually available
  const prods = await page.evaluate(async () => {
    const r = await fetch('/products.json?limit=250');
    const j = await r.json();
    return j.products.map((p) => ({ h: p.handle, v: p.variants.length, opts: p.options.map((o) => o.name + ':' + o.values.length).join('|'), avail: p.variants.filter((v) => v.available).length, imgs: p.images.length, title: p.title.length }));
  });
  console.log('PRODUCTS', JSON.stringify(prods));
  await context.close();
}
await browser.close();
