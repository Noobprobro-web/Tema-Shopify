import { chromium, newCtx, nav, THEMES, sleep, SHOTS } from './common.mjs';
const b = await chromium.launch(); const ctx = await newCtx(b, 390, 844, { deviceScaleFactor: 2, hasTouch: true, isMobile: true }); const page = await ctx.newPage();
await nav(page, '/pages/std-test', THEMES.sartorial, 1500);
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
await page.evaluate(() => document.querySelector('[data-slideshow-toggle]')?.click());
const targets = { announcement: '.announcement-bar a, [id*=announcement] a', slideTrack: '[data-slideshow-track]', richBtn: '[id$="__rich_text"] a.button', belt: '[id$="__featured_collection"] a[href*="leather-belt"]' };
for (const [k, sel] of Object.entries(targets)) {
  const l = page.locator(sel).first(); if (!(await l.count())) { console.log(k, 'no encontrado'); continue; }
  await l.scrollIntoViewIfNeeded(); await page.keyboard.press('Shift'); await l.focus(); await page.keyboard.press('Shift'); await sleep(250);
  const r = await page.evaluate(() => { const e = document.activeElement; const f = (c) => `${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor} off ${c.outlineOffset} bs ${c.boxShadow.slice(0, 60)}`; const cs = getComputedStyle(e); const rc = e.getBoundingClientRect(); return { tag: e.tagName, cls: String(e.className).slice(0, 50), fv: e.matches(':focus-visible'), self: f(cs), after: f(getComputedStyle(e, '::after')), rect: [Math.round(rc.left), Math.round(rc.top), Math.round(rc.width), Math.round(rc.height)], bg: cs.backgroundColor, color: cs.color, td: cs.textDecorationLine }; });
  console.log(k, JSON.stringify(r));
  await page.screenshot({ path: `${SHOTS}/dbg-fv-${k}.png` });
}
await b.close();
