import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chromium', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:9292/collections/all', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(() => window.ThemeCore?.initialized, { timeout: 20000 });
  const response = await context.request.get('http://127.0.0.1:9292/products.json?limit=250');
  const data = await response.json();
  const products = data.products.map(p => ({ handle:p.handle, title:p.title, images:p.images.length, variants:p.variants.length, options:p.options, descriptionLength:p.body_html?.length, id:p.variants[0]?.id, price:p.variants[0]?.price }));
  const report = { url:page.url(), products, errors, page: await page.evaluate(() => ({ title:document.title, money:window.theme?.moneyFormat, overflow:document.documentElement.scrollWidth, headings:[...document.querySelectorAll('main h1, main h2, main h3')].map(e=>[e.tagName,e.textContent.trim()]), collectionLinks:[...document.querySelectorAll('a[href*="collections/"]')].map(e=>e.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)===i) })) };
  await page.screenshot({ path:'.tmp/gpt-audit-4b-005/collection-desktop.png', fullPage:true });
  await writeFile('.tmp/gpt-audit-4b-005/inventory.json', JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
