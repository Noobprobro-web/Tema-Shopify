import { chromium, newCtx, nav, THEMES, sleep, shot } from './common.mjs';
const b = await chromium.launch(); const ctx = await newCtx(b, 1280, 800); const page = await ctx.newPage();
await nav(page, '/pages/std-test', THEMES.sartorial, 1500);
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
await page.evaluate(() => document.querySelector('[data-slideshow-toggle]')?.click());
await page.locator('[id$="__collection_list"] a').first().focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await sleep(300);
console.log(await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); const a = getComputedStyle(e, '::after'); const p = getComputedStyle(e.parentElement); const f=(c)=>`${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor} off ${c.outlineOffset} bs ${c.boxShadow.slice(0,50)}`; return { cls: e.className, fv: e.matches(':focus-visible'), self: f(cs), after: f(a)+' '+a.content, parent: f(p), parentCls: e.parentElement.className, imgOutline: (()=>{const i=e.querySelector('img'); return i? f(getComputedStyle(i)):null})() }; }));
await shot(page, 'dbg-collection-focus');
await b.close();
