import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const res = {}; const errs = [];
const browser = await launch();
// desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(ctx, BASE);
  const page = await ctx.newPage(); attachConsole(page, errs);
  await page.goto(BASE + '/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
  res.headerHTML = await page.evaluate(() => { const h = document.querySelector('.section-header, header'); return h ? h.outerHTML.slice(0, 5000) : null; });
  res.gutters = await page.evaluate(() => {
    const q = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { sel: s, left: Math.round(r.left), right: Math.round(window.innerWidth - r.right), w: Math.round(r.width) }; };
    const sec = [...document.querySelectorAll('[id^="shopify-section"]')].map(s => {
      const inner = s.querySelector('.page-width, [class*="container"], [class*="__inner"], [class*="wrapper"]') ;
      // find first heading or text element
      const t = s.querySelector('h1,h2,h3,p,a,img,input');
      const r = t && t.getBoundingClientRect();
      return { id: s.id.replace(/shopify-section-(template|sections)--\d+__/, ''), firstEl: t && t.tagName + '.' + (t.className||'').toString().slice(0,40), left: r && Math.round(r.left), innerCls: inner && inner.className.toString().slice(0,60), innerLeft: inner && Math.round(inner.getBoundingClientRect().left) };
    });
    return { sec, logo: q('header a[href="/"]:not(nav a)'), nav: q('header nav a'), cart: q('header a[href="/cart"]') };
  });
  const catalog = page.locator('header a[href="/collections/all"]:visible').first();
  await catalog.hover(); await page.waitForTimeout(800);
  await page.screenshot({ path: 'header-desktop-hover-catalog.png', clip: { x: 0, y: 0, width: 1440, height: 500 } });
  res.afterHover = await page.evaluate(() => ({
    details: [...document.querySelectorAll('header details')].map(d => d.open),
    expanded: [...document.querySelectorAll('header [aria-expanded]')].map(e => e.tagName + ':' + e.getAttribute('aria-expanded') + ':' + (e.textContent||'').trim().slice(0,20)),
    visibleMenus: [...document.querySelectorAll('header [class*="mega"], header [class*="dropdown"], header [class*="submenu"]')].filter(e => e.offsetParent).map(e => e.className.toString().slice(0,60)),
  }));
  // Click Catalog: it's a link, will navigate
  await Promise.all([page.waitForLoadState('load').catch(()=>{}), catalog.click()]);
  await page.waitForTimeout(1500);
  res.afterClickUrl = page.url();
  await ctx.close();
}
// mobile
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await unlock(ctx, BASE);
  const page = await ctx.newPage(); attachConsole(page, errs);
  await page.goto(BASE + '/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
  const toggles = await page.evaluate(() => [...document.querySelectorAll('header button, header summary')].map(b => ({ t: b.tagName, cls: b.className.toString().slice(0,60), label: b.getAttribute('aria-label'), vis: !!b.offsetParent, text: b.textContent.trim().slice(0,30) })));
  res.mobileToggles = toggles;
  const btn = page.locator('header button:visible, header summary:visible').first();
  await btn.click(); await page.waitForTimeout(1200);
  await page.screenshot({ path: 'header-mobile-drawer-open.png' });
  res.drawer = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, bodyOverflow: getComputedStyle(document.body).overflow, links: [...document.querySelectorAll('a')].filter(a => { const r = a.getBoundingClientRect(); return a.offsetParent && r.width && r.top < 844 && r.top > 0; }).map(a => a.textContent.trim().slice(0,30)) }));
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  await page.screenshot({ path: 'header-mobile-drawer-after-esc.png' });
  await ctx.close();
}
await browser.close();
fs.writeFileSync('results-02-header.json', JSON.stringify({ res, errs }, null, 2));
console.log(JSON.stringify({ ...res, headerHTML: undefined }, null, 1), JSON.stringify(errs));
