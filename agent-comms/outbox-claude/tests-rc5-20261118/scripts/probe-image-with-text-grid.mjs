import { chromium, newCtx, nav, THEMES, sleep } from './common.mjs';
const b = await chromium.launch(); const ctx = await newCtx(b, 1280, 800); const page = await ctx.newPage();
await nav(page, '/pages/std-test', THEMES.sartorial, 1500);
console.log(await page.evaluate(() => { const i = document.querySelector('.image-text__inner'); const c = getComputedStyle(i); const m=i.querySelector('.image-text__media').getBoundingClientRect(), cp=i.querySelector('.image-text__copy').getBoundingClientRect(); return { display: c.display, cols: c.gridTemplateColumns, w: i.getBoundingClientRect().width, media:[m.left,m.top,m.width,m.height], copy:[cp.left,cp.top,cp.width,cp.height], copyOpacity:getComputedStyle(i.querySelector('.image-text__copy')).opacity, copyReveal: i.querySelector('.image-text__copy').outerHTML.slice(0,200) }; }));
await b.close();
