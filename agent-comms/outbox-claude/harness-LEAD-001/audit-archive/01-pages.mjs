// Auditoría visual de solo lectura: capturas de página completa + métricas, escritorio y móvil.
import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
import { fileURLToPath } from 'node:url';
const OUT = fileURLToPath(new URL('.', import.meta.url));
const BASE = STORES.archive.url;
const PAGES = [
  ['home', '/'],
  ['coll-all', '/collections/all'],
  ['coll-permanent', '/collections/permanent-archive'],
  ['coll-restored', '/collections/restored-pieces'],
  ['pdp-jacket', '/products/1990-pinstripe-double-breasted-jacket'],
  ['pdp-silk', '/products/1997-printed-silk-square'],
  ['pol-privacy', '/policies/privacy-policy'],
  ['pol-refund', '/policies/refund-policy'],
  ['pol-shipping', '/policies/shipping-policy'],
  ['pol-terms', '/policies/terms-of-service'],
  ['pol-contact', '/policies/contact-information'],
  ['page-contact', '/pages/contact'],
  ['search-silk', '/search?q=silk'],
  ['404', '/products/does-not-exist'],
];
const extra = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : [];
const VIEWPORTS = [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]];
const results = [];
const browser = await launch();
for (const [vp, viewport] of VIEWPORTS) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: vp === 'm', hasTouch: vp === 'm' });
  await unlock(context, BASE);
  const page = await context.newPage();
  for (const [name, path] of [...PAGES, ...extra]) {
    let resp;
    for (let i = 0; i < 3; i++) {
      resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 }).catch((e) => null);
      const t = await page.title().catch(() => '');
      if (resp && resp.status() !== 429 && !/just a moment|attention required/i.test(t)) break;
      await page.waitForTimeout(30000);
    }
    await page.waitForTimeout(1500);
    // Recorrer la página para disparar lazy-load y reveals.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); }
      window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 600));
    });
    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const vw = de.clientWidth;
      const over = [];
      if (de.scrollWidth > vw) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > vw + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed') over.push(`${el.localName}.${String(el.className).slice(0, 50)} L${Math.round(r.left)} R${Math.round(r.right)}`);
          if (over.length > 12) break;
        }
      }
      const brokenImgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.src.slice(0, 100));
      const placeholders = document.querySelectorAll('.placeholder-svg, svg.placeholder, [class*="placeholder"]').length;
      const txt = document.body.innerText;
      const missing = (txt.match(/translation missing[^\n]*/gi) || []).slice(0, 5);
      const liquidErr = (txt.match(/Liquid (error|syntax error)[^\n]*/gi) || []).slice(0, 5);
      return { title: document.title, h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim().slice(0, 80)), scrollW: de.scrollWidth, clientW: vw, height: de.scrollHeight, over, brokenImgs, placeholders, missing, liquidErr,
        sections: [...document.querySelectorAll('main [id^="shopify-section-"], [id^="shopify-section-"]')].map((s) => s.id.replace('shopify-section-', '').slice(0, 60)) };
    });
    const file = `${vp}-${name}.png`;
    await page.screenshot({ path: OUT + file, fullPage: true }).catch((e) => console.error('shot', e.message));
    await page.screenshot({ path: OUT + `${vp}-${name}-top.png` }).catch(() => {});
    const r = { vp, name, path, status: resp ? resp.status() : null, finalUrl: page.url(), file, ...metrics };
    results.push(r);
    console.log(JSON.stringify(r));
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(OUT + 'results-01-pages' + (extra.length ? '-extra' : '') + '.json', JSON.stringify(results, null, 1));
