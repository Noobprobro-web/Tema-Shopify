import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.edition.url;
const out = {};
const browser = await launch();
const go = async (page, p) => { const r = await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1800); return r && r.status(); };
const reveal = (page) => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600)); });
const meta = (page) => page.evaluate(() => { const de = document.documentElement; return { title: document.title, h1: [...document.querySelectorAll('main h1')].map(h => h.innerText.trim() + ' @' + getComputedStyle(h).fontSize), text: document.querySelector('main')?.innerText.replace(/\s+/g, ' ').slice(0, 500), sw: de.scrollWidth, cw: de.clientWidth, broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(-50)), links: [...document.querySelectorAll('main a')].map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/pages')), templ: document.body.className }; });
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport: size });
  await unlock(context, BASE);
  const page = await context.newPage();
  if (vp === 'desktop') {
    await go(page, '/policies/terms-of-service');
    out.cssom = await page.evaluate(() => {
      const res = [];
      for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch (e) { continue; } for (const r of rules) { if (r.selectorText && /shopify-policy/.test(r.selectorText)) res.push({ src: sh.href ? sh.href.split('/').pop().split('?')[0] : (sh.ownerNode?.id || 'inline-style'), css: r.cssText.slice(0, 250) }); } }
      return res;
    });
    out.policyEnd = await page.evaluate(() => { const c = document.querySelector('.shopify-policy__container'); const f = document.querySelector('.site-footer, footer'); return { containerBottom: Math.round(c.getBoundingClientRect().bottom + scrollY), footerTop: Math.round(f.getBoundingClientRect().top + scrollY), titleTop: Math.round(document.querySelector('.shopify-policy__title').getBoundingClientRect().top + scrollY), headerBottom: Math.round(document.querySelector('.site-header, header').getBoundingClientRect().bottom + scrollY), titleAlign: getComputedStyle(document.querySelector('.shopify-policy__title')).textAlign }; });
    // a theme page using page.policy template, if any
    out.productJs = await page.evaluate(async () => { const p = await (await fetch('/products/structured-tote.js')).json(); return { images: p.images.map(s => s.split('/').pop().split('?')[0]), variants: p.variants.map(v => v.title + ' media=' + (v.featured_image ? v.featured_image.src.split('/').pop().split('?')[0] : 'none')) }; });
  }
  for (const p of ['/pages/contact', '/search?q=leather', '/products/does-not-exist', '/search?q=zzzzqqq', '/collections', '/pages/about', '/pages/faq']) {
    const st = await go(page, p);
    await reveal(page);
    const name = p.replace(/[/?=]+/g, '-').replace(/^-/, '');
    await page.screenshot({ path: `${name}-${vp}.png`, fullPage: true });
    out[name + '-' + vp] = { st, ...(await meta(page)) };
  }
  if (vp === 'mobile') {
    await go(page, '/collections/all');
    await page.screenshot({ path: `collection-all-mobile-top-viewport.png` });
    out.collTop = await page.evaluate(() => ({ skip: (() => { const s = document.querySelector('.skip-to-content-link, a[href="#MainContent"]'); const b = s?.getBoundingClientRect(); return s && { cls: s.className, top: Math.round(b.top), w: Math.round(b.width), focused: document.activeElement === s }; })(), h1: document.querySelector('main h1')?.getBoundingClientRect().top }));
    await go(page, '/products/structured-tote');
    out.atcMobile = await page.evaluate(() => { const b = document.querySelector('main [name="add"]'); const cs = getComputedStyle(b); return { cls: b.className, bg: cs.backgroundColor, color: cs.color, border: cs.borderColor }; });
  } else {
    await go(page, '/products/structured-tote');
    out.atcDesktop = await page.evaluate(() => { const b = document.querySelector('main [name="add"]'); const cs = getComputedStyle(b); return { cls: b.className, bg: cs.backgroundColor, color: cs.color, border: cs.borderColor }; });
  }
  await context.close();
}
await browser.close();
fs.writeFileSync('results-06.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
