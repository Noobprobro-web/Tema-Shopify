import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.edition.url;
const out = {};
const cons = [];
const browser = await launch();
async function go(page, path) {
  const r = await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1800);
  return r ? r.status() : null;
}
const overflow = (page) => page.evaluate(() => {
  const de = document.documentElement;
  const wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > de.clientWidth + 1 && getComputedStyle(e).position !== 'fixed' && r.width > 0; }).slice(0, 8).map(e => e.localName + '.' + String(e.className).slice(0, 50) + ' right=' + Math.round(e.getBoundingClientRect().right));
  return { sw: de.scrollWidth, cw: de.clientWidth, wide };
});
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport: size });
  await unlock(context, BASE);
  const page = await context.newPage();
  attachConsole(page, cons);
  const st = await go(page, '/');
  // scroll through to trigger lazy/reveal
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `home-${vp}.png`, fullPage: true });
  const info = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('[id^="shopify-section-"]')].map(s => ({ id: s.id.replace('shopify-section-', ''), cls: String(s.firstElementChild?.className || '').slice(0, 60), h: Math.round(s.getBoundingClientRect().height) }));
    const header = document.querySelector('header, .header, [id*="header"]');
    const headerLinks = [...document.querySelectorAll('[id*="header"] a')].map(a => ({ t: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), h: a.getAttribute('href'), vis: a.offsetParent !== null }));
    const footerLinks = [...document.querySelectorAll('[id*="footer"] a')].map(a => ({ t: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), h: a.getAttribute('href') }));
    const bento = [...document.querySelectorAll('a')].filter(a => /desk/i.test(a.textContent)).map(a => ({ t: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), h: a.getAttribute('href'), cls: String(a.className).slice(0, 60) }));
    const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(0, 100));
    const placeholders = document.querySelectorAll('.placeholder-svg, svg.placeholder, [class*="placeholder"]').length;
    return { title: document.title, sections, headerLinks, footerLinks, bento, brokenImgs: imgs, placeholders };
  });
  out[vp] = { status: st, ...info, overflow: await overflow(page) };
  if (vp === 'desktop') {
    // hover top-level nav items
    const navItems = await page.$$eval('[id*="header"] nav a, [id*="header"] nav button, [id*="header"] nav summary', els => els.map((e, i) => ({ i, t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), tag: e.localName, exp: e.getAttribute('aria-expanded'), vis: !!(e.offsetWidth || e.offsetHeight) })));
    out.navItems = navItems;
    const loc = page.locator('[id*="header"] nav a, [id*="header"] nav button, [id*="header"] nav summary');
    const n = await loc.count();
    out.hover = [];
    for (let i = 0; i < n; i++) {
      const el = loc.nth(i);
      if (!(await el.isVisible())) continue;
      const t = (await el.textContent()).trim().replace(/\s+/g, ' ');
      await el.hover();
      await page.waitForTimeout(700);
      const vis = await page.evaluate(() => [...document.querySelectorAll('.mega-menu, [class*="mega"], [class*="dropdown"], details[open], [aria-expanded="true"]')].filter(e => e.offsetHeight > 0 && getComputedStyle(e).visibility !== 'hidden').map(e => e.localName + '.' + String(e.className).slice(0, 50)));
      out.hover.push({ t, openAfterHover: vis });
      if (/catalog/i.test(t)) await page.screenshot({ path: `header-desktop-hover-catalog.png`, clip: { x: 0, y: 0, width: 1440, height: 600 } });
    }
    // bento link
    const bento = page.locator('a[href*="desk-and-study"]').first();
    out.bentoCount = await page.locator('a[href*="desk-and-study"]').count();
    if (out.bentoCount) {
      await bento.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2600);
      await Promise.all([page.waitForLoadState('load'), bento.click()]);
      await page.waitForTimeout(1500);
      out.bentoNavigatedTo = page.url();
    }
  } else {
    // mobile menu drawer
    const btn = page.locator('[id*="header"] button[aria-controls], [id*="header"] [aria-label*="enu" i], [id*="header"] summary').first();
    out.mobileMenuBtn = await btn.count() ? await btn.evaluate(e => e.outerHTML.slice(0, 200)) : null;
    if (out.mobileMenuBtn) {
      await btn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `header-mobile-menu-open.png` });
      out.mobileMenuState = await page.evaluate(() => [...document.querySelectorAll('[role="dialog"], dialog, [class*="drawer"]')].filter(e => e.offsetHeight > 0).map(e => ({ c: e.localName + '.' + String(e.className).slice(0, 60), links: [...e.querySelectorAll('a')].filter(a => a.offsetHeight > 0).map(a => a.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)) })));
    }
  }
  await context.close();
}
await browser.close();
out.console = cons;
fs.writeFileSync('results-01.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1).slice(0, 12000));
