// Generic page capture: node 03-pages.mjs name=/path ...
import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const targets = process.argv.slice(2).map(a => [a.slice(0, a.indexOf('=')), a.slice(a.indexOf('=') + 1)]);
const results = {}; const errs = [];
const browser = await launch();
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  await unlock(ctx, BASE);
  const page = await ctx.newPage(); attachConsole(page, errs);
  for (const [name, path] of targets) {
    const r = await page.goto(BASE + '/' + path, { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${name}-${vp}.png`, fullPage: true });
    results[`${name}-${vp}`] = await page.evaluate(() => {
      const cw = document.documentElement.clientWidth;
      return {
        url: location.pathname + location.search, title: document.title,
        scrollW: document.documentElement.scrollWidth, clientW: cw,
        h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().slice(0, 80)),
        mainCls: [...(document.querySelector('main')?.children || [])].map(c => c.id.replace(/shopify-section-template--\d+__/, '') + ' ' + c.className.toString().slice(0, 60)),
        brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.src.slice(0, 100)),
        placeholders: [...document.querySelectorAll('svg.placeholder-svg, .placeholder, [class*="placeholder"]')].filter(e => e.offsetParent).length,
        overflow: [...document.querySelectorAll('main *')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.right > cw + 1 || r.left < -1); }).filter(e => !e.closest('[class*="marquee"],[class*="slider"],[class*="carousel"],[class*="scroller"],[class*="tabs"]')).slice(0, 8).map(e => e.tagName + '.' + e.className.toString().slice(0, 50) + ' L' + Math.round(e.getBoundingClientRect().left) + ' R' + Math.round(e.getBoundingClientRect().right)),
        translationMissing: (document.body.innerText.match(/translation missing[^\n]*/gi) || []).slice(0, 5),
        textSample: document.querySelector('main')?.innerText.replace(/\s+/g, ' ').slice(0, 600),
      };
    });
    results[`${name}-${vp}`].status = r && r.status();
  }
  await ctx.close();
}
await browser.close();
const file = `results-03-${targets.map(t => t[0]).join('_').slice(0, 60)}.json`;
fs.writeFileSync(file, JSON.stringify({ results, errs: errs.filter(e => !/shop\.app|pay\.shopify|403/.test(e.text)) }, null, 2));
console.log(JSON.stringify(results, null, 1));
console.log('ERRS', JSON.stringify(errs.filter(e => !/shop\.app|pay\.shopify|403/.test(e.text))));
