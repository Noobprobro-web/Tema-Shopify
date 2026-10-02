import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const out = {};
const errs = [];
const browser = await launch();
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  await unlock(ctx, BASE);
  const page = await ctx.newPage();
  attachConsole(page, errs);
  const r = await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  // scroll to trigger lazy/motion
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `home-${vp}.png`, fullPage: true });
  out[vp] = await page.evaluate(() => {
    const links = (sel) => [...document.querySelectorAll(sel + ' a[href]')].map(a => ({ text: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), href: a.getAttribute('href') }));
    const sections = [...document.querySelectorAll('main > *, main .shopify-section, [id^="shopify-section"]')].map(s => ({ id: s.id, cls: s.className.toString().slice(0, 100), h: Math.round(s.getBoundingClientRect().height) }));
    const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(0, 120));
    return {
      status: null,
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
      header: links('header'), footer: links('footer'),
      mainLinks: links('main'),
      sections, brokenImgs: imgs,
      wide: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 15).map(e => e.tagName + '.' + e.className.toString().slice(0, 60) + ' right=' + Math.round(e.getBoundingClientRect().right)),
    };
  });
  out[vp].status = r && r.status();
  await ctx.close();
}
await browser.close();
fs.writeFileSync('results-01-home.json', JSON.stringify({ out, errs }, null, 2));
console.log(JSON.stringify({ out, errs }, null, 1).slice(0, 12000));
