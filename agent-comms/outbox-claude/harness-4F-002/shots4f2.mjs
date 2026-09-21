import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const run = async (dir, tag) => {
  const base = `http://127.0.0.1:8099/${dir}`;
  const shot = async (file, w, h, name, fn, clip) => { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(`${base}/${file}`, { waitUntil: 'networkidle' }); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; }); if (fn) await fn(p); await p.waitForTimeout(900); await p.screenshot(clip ? { path: `shots/${tag}-${name}.png`, clip } : { path: `shots/${tag}-${name}.png` }); await p.close(); };
  await shot('cart-long.html', 1440, 900, 'cart-1440', null, { x: 0, y: 0, width: 1440, height: 900 });
  await shot('cart-long.html', 390, 844, 'cart-390', null, { x: 0, y: 0, width: 390, height: 844 });
  await shot('home.html', 390, 690, 'header-390', null, { x: 0, y: 0, width: 390, height: 130 });
  await shot('home.html', 360, 690, 'header-360', null, { x: 0, y: 0, width: 360, height: 130 });
  await shot('bundle.html', 1440, 900, 'bundle-1of3', async (p) => { const bx = p.locator('complete-the-look input[type="checkbox"]'); await bx.nth(1).uncheck(); await bx.nth(2).uncheck(); await p.locator('[data-bundle-count]').scrollIntoViewIfNeeded(); }, null);
  if (tag === 'after') {
    await shot('pdp-multi.html', 1440, 900, 'pdp-accordion-1440', async (p) => { await p.locator('.product-details__summary').first().click(); await p.locator('.product-details__accordion').first().scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -250)); }, { x: 0, y: 0, width: 1440, height: 900 });
    await shot('pdp-multi.html', 390, 844, 'pdp-accordion-390', async (p) => { await p.locator('.product-details__summary').nth(1).click(); await p.locator('.product-details__accordion').first().scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -120)); }, { x: 0, y: 0, width: 390, height: 844 });
  }
};
await run('r4f2', 'after');
await run('r4f2-before', 'before');
await b.close();
