import { chromium, newCtx, nav, THEMES, sleep } from './common.mjs';
const b = await chromium.launch(); const ctx = await newCtx(b, 1280, 800); const page = await ctx.newPage();
const reqs=[]; page.on('request', r=>{ if(/youtube|ytimg|google/.test(r.url())) reqs.push(r.url().slice(0,120)); });
await nav(page, '/pages/std-test', THEMES.sartorial, 1500);
console.log(await page.evaluate(() => { const f = document.querySelectorAll('theme-video-poster')[0]; return { tpl: f.querySelector('template')?.innerHTML.slice(0,400), playHidden: f.querySelector('[data-video-play]')?.hidden }; }));
await page.locator('[data-video-play]').first().click(); await sleep(2500);
console.log(await page.evaluate(() => { const f = document.querySelectorAll('theme-video-poster')[0]; return { html: f.innerHTML.slice(0,700) }; }), reqs);
await b.close();
