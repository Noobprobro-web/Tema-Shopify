import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pages = [
  ['home.html', null], ['pdp-multi.html', async (p) => { await p.fill('[data-quantity-input]', '2'); await p.dispatchEvent('[data-quantity-input]', 'change'); await p.evaluate(() => document.querySelector('sticky-cart-bar').setVisible(true)); }],
  ['cart-long.html', null], ['bundle.html', null],
  ['home.html#drawer', async (p) => { await p.click('.site-header__cart'); await p.waitForTimeout(500); await p.evaluate(() => { const s = document.querySelector('[data-cart-status]'); s.hidden = false; s.textContent = s.closest('cart-drawer').dataset.addedMessage || 'x'; }); }],
  ['home.html#search', async (p) => { await p.click('.predictive-search__trigger'); await p.waitForTimeout(400); }],
  ['home.html#menu', async (p) => { if (await p.locator('.site-header__menu-button').isVisible()) { await p.click('.site-header__menu-button'); await p.waitForTimeout(400); } }],
];
const out = {};
for (const L of ['en', 'es']) for (const w of [360, 390, 768, 1440]) for (const [file, fn] of pages) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(`http://127.0.0.1:8099/ml-${L}/${file.split('#')[0]}`, { waitUntil: 'networkidle' });
  if (fn) await fn(p);
  await p.waitForTimeout(250);
  const r = await p.evaluate(() => {
    const de = document.documentElement;
    const vis = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0 && !e.closest('[hidden],[inert]'); };
    const clipped = [...document.querySelectorAll('button, .button, a.button, label, .eyebrow, h1, h2, h3, .sticky-cart-bar__meta, .sticky-cart-bar__total, [class*="__title"], [class*="summary"], .desktop-nav__link, .desktop-nav__toggle')]
      .filter(vis).filter((e) => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible')
      .map((e) => (e.className || e.tagName).toString().split(' ')[0] + ': ' + e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40));
    const buttons = [...document.querySelectorAll('button, .button')].filter(vis).map((e) => ({ t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), h: Math.round(e.getBoundingClientRect().height), lh: parseFloat(getComputedStyle(e).lineHeight) || 20, fs: parseFloat(getComputedStyle(e).fontSize) }))
      .filter((x) => x.t && x.h > Math.max(56, x.fs * 1.6 * 2 + 10));
    const offRight = [...document.querySelectorAll('main *, header *, cart-drawer *, sticky-cart-bar *')].filter(vis).filter((e) => e.getBoundingClientRect().right > de.clientWidth + 1 && !e.closest('[style*="overflow"],.product-gallery__items,.marquee-banner,.curated-showcase__tabs')).slice(0, 3).map((e) => (e.className || e.tagName).toString().split(' ')[0]);
    return { overflowX: de.scrollWidth - de.clientWidth, clipped: [...new Set(clipped)].slice(0, 8), tallButtons: buttons.slice(0, 6), offRight };
  });
  out[`${L}|${w}|${file}`] = r;
  await p.close();
}
await b.close();
for (const w of [360, 390, 768, 1440]) for (const [file] of pages) {
  const en = out[`en|${w}|${file}`], es = out[`es|${w}|${file}`];
  const diff = JSON.stringify(en) !== JSON.stringify(es);
  if (diff) console.log(`${w} ${file}\n  en ${JSON.stringify(en)}\n  es ${JSON.stringify(es)}`);
}
console.log('done');
