import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const run = async (base, tag) => {
  const shot = async (file, w, h, name, fn) => { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto(`${base}/${file}`, { waitUntil: 'networkidle' }); await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; }); await p.waitForTimeout(400); if (fn) await fn(p); await p.waitForTimeout(500); await p.screenshot({ path: `shots/${tag}-${name}.png` }); await p.close(); };
  await shot('home.html', 390, 690, 'hero-390');
  await shot('home.html', 1280, 800, 'hero-1280');
  await shot('home.html', 390, 690, 'menu-390', async (p) => { await p.click('.site-header__menu-button'); });
  await shot('home.html', 1280, 800, 'search-empty-1280', async (p) => { await p.click('.predictive-search__trigger'); });
  await shot('home.html', 1366, 650, 'drawer-650', async (p) => { await p.click('.site-header__cart'); await p.waitForTimeout(500); await p.evaluate(() => { const s = document.querySelector('[data-cart-status]'); s.hidden = false; s.textContent = 'Item added to your cart.'; }); });
  await shot('pdp-multi.html', 390, 690, 'pdp-390');
  await shot('pdp-single.html', 1280, 800, 'pdp-single-1280');
  await shot('home.html', 390, 690, 'sticky-390', async (p) => { await p.evaluate(() => window.scrollTo(0, 1200)); });
  await shot('home.html', 1280, 800, 'search-typed-1280', async (p) => { await p.click('.predictive-search__trigger'); await p.fill('[id^=PredictiveSearchPanel] input[type=search]', 'coat'); await p.waitForTimeout(800); });
};
import fs from 'node:fs'; fs.mkdirSync('shots', { recursive: true });
await run('http://127.0.0.1:8131', 'after');
await run('http://127.0.0.1:8132', 'before');
await b.close();
