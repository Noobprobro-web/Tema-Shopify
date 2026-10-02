import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.edition.url;
const out = { collections: {} };
const browser = await launch();
const go = async (page, p) => { const r = await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1800); return r && r.status(); };
const reveal = (page) => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600)); });
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport: size });
  await unlock(context, BASE);
  const page = await context.newPage();
  await go(page, '/');
  out[vp + '-nav'] = await page.evaluate(() => ({
    desktopNav: document.querySelector('.site-header__desktop-nav')?.innerHTML.replace(/\s+/g, ' ').replace(/<svg.*?<\/svg>/g, '<svg/>').slice(0, 2500),
    mobileNav: [...document.querySelectorAll('.mobile-nav > li')].map(li => li.innerText.replace(/\s+/g, ' ').trim()),
    gutters: (() => { const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.right)]; }; return { headerInner: r('.site-header .container, .site-header__inner, header .container'), headerNav: r('.site-header__desktop-nav'), menuBtn: r('.site-header__menu-button'), logo: r('.site-header__logo, .site-header [class*="logo"]'), heroMedia: r('.editorial-hero img'), heroContainer: r('.editorial-hero .container, .editorial-hero > *'), bentoContainer: r('.bento-discovery .container'), footerContainer: r('.site-footer .container'), newsletterContainer: r('.newsletter-section .container') }; })(),
  }));
  if (vp === 'desktop') {
    const toggles = page.locator('.desktop-nav__toggle');
    out.toggles = await toggles.count();
    for (let i = 0; i < out.toggles; i++) {
      const t = toggles.nth(i);
      const name = (await t.innerText()).trim();
      await t.hover(); await page.waitForTimeout(800);
      const afterHover = await t.getAttribute('aria-expanded');
      await page.screenshot({ path: `header-desktop-hover-${i}.png`, clip: { x: 0, y: 0, width: 1440, height: 700 } });
      await t.click(); await page.waitForTimeout(900);
      const afterClick = await t.getAttribute('aria-expanded');
      const panel = await page.evaluate((id) => { const p = document.getElementById(id); if (!p) return null; const b = p.getBoundingClientRect(); return { hidden: p.hidden, cls: p.className, h: Math.round(b.height), w: Math.round(b.width), left: Math.round(b.left), links: [...p.querySelectorAll('a')].map(a => a.innerText.trim() + '→' + a.getAttribute('href')) }; }, await t.getAttribute('aria-controls'));
      await page.screenshot({ path: `header-desktop-click-${i}.png`, clip: { x: 0, y: 0, width: 1440, height: 700 } });
      out['toggle-' + i] = { name, afterHover, afterClick, panel };
      await page.keyboard.press('Escape');
    }
  } else {
    await page.locator('.site-header__menu-button').click(); await page.waitForTimeout(1000);
    const mt = page.locator('.mobile-nav__toggle');
    out.mobileToggles = await mt.count();
    if (out.mobileToggles) { await mt.first().click(); await page.waitForTimeout(800); }
    await page.screenshot({ path: `header-mobile-menu-open-2.png` });
    out.mobileMenuOpen = await page.evaluate(() => [...document.querySelectorAll('.drawer-panel a, .drawer-panel button')].filter(a => a.offsetHeight > 0).map(a => a.innerText.trim().replace(/\s+/g, ' ') + '→' + (a.getAttribute('href') || a.getAttribute('aria-expanded'))));
    await page.keyboard.press('Escape');
  }
  for (const c of ['all', 'daily-objects', 'leather-goods', 'desk-and-study']) {
    const st = await go(page, '/collections/' + c);
    await reveal(page);
    await page.screenshot({ path: `collection-${c}-${vp}.png`, fullPage: true });
    out.collections[c + '-' + vp] = { st, ...(await page.evaluate(() => {
      const de = document.documentElement;
      return {
        title: document.querySelector('h1')?.innerText, cards: document.querySelectorAll('.product-card, [class*="product-card"]').length,
        cardTitles: [...document.querySelectorAll('.product-card__title, .product-card h3, .product-card a[class*="title"]')].map(e => e.innerText.trim()).slice(0, 30),
        facets: [...document.querySelectorAll('form[id*="acet"], .facets, [class*="facet"]')].slice(0, 3).map(f => f.localName + '.' + String(f.className).slice(0, 50)),
        sort: !!document.querySelector('select[name="sort_by"], [name="sort_by"]'), count: document.querySelector('[class*="count"]')?.innerText,
        brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0).length,
        sw: de.scrollWidth, cw: de.clientWidth,
        wide: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > de.clientWidth + 1 && e.getBoundingClientRect().width > 0 && getComputedStyle(e).position !== 'fixed').slice(0, 5).map(e => e.localName + '.' + String(e.className).slice(0, 50)),
        empty: document.querySelector('[class*="empty"]')?.innerText?.slice(0, 120),
      };
    })) };
  }
  // open filter UI on all
  await go(page, '/collections/all');
  const ftrig = page.locator('button:has-text("Filter"), summary:has-text("Filter"), [data-facets-trigger], button[aria-controls*="acet"]').first();
  out['filterTrigger-' + vp] = await ftrig.count();
  if (out['filterTrigger-' + vp] && await ftrig.isVisible()) { await ftrig.click(); await page.waitForTimeout(1200); await page.screenshot({ path: `collection-all-${vp}-filters-open.png` }); }
  await context.close();
}
await browser.close();
fs.writeFileSync('results-03.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
