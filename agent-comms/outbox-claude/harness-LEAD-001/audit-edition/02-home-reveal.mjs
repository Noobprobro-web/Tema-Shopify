import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.edition.url;
const out = {};
const browser = await launch();
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport: size });
  await unlock(context, BASE);
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
  for (const key of ['capsule', 'manifesto']) {
    const sel = `[id^="shopify-section-"][id$="__${key}"]`;
    await page.locator(sel).scrollIntoViewIfNeeded();
    await page.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 40); }, sel);
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `home-${vp}-${key}-inview.png` });
    out[vp + '-' + key] = await page.evaluate((s) => {
      const el = document.querySelector(s);
      const hidden = [...el.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return (cs.opacity === '0' || cs.visibility === 'hidden') && e.getBoundingClientRect().height > 20; }).slice(0, 10).map(e => e.localName + '.' + String(e.className).slice(0, 70) + ' op=' + getComputedStyle(e).opacity + ' h=' + Math.round(e.getBoundingClientRect().height));
      const items = [...el.querySelectorAll('li, [class*="item"]')].map(e => e.localName + '.' + String(e.className).slice(0, 50) + ' h=' + Math.round(e.getBoundingClientRect().height) + ' op=' + getComputedStyle(e).opacity + ' txt=' + e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)).slice(0, 20);
      const imgs = [...el.querySelectorAll('img')].map(i => ({ src: i.currentSrc.slice(-60), w: i.naturalWidth, op: getComputedStyle(i).opacity, h: Math.round(i.getBoundingClientRect().height) }));
      return { hidden, items, imgs, text: el.innerText.replace(/\s+/g, ' ').slice(0, 400), html: el.innerHTML.length };
    }, sel);
  }
  await context.close();
}
await browser.close();
fs.writeFileSync('results-02.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
