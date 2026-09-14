import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const browser = await chromium.launch({ channel: 'chromium', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://127.0.0.1:9292/products/qa-09-price-varies', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(() => window.ThemeCore?.initialized);
  const products = (await (await context.request.get('http://127.0.0.1:9292/products.json?limit=250')).json()).products;
  const report = { errors, products: products.map(p => ({ handle:p.handle, title:p.title, images:p.images.length, variants:p.variants, descriptionLength:p.body_html?.length })),
    page: await page.evaluate(async () => ({ url:location.href, theme:window.Shopify?.theme, money:window.theme?.moneyFormat,
      elements:[...document.querySelectorAll('variant-selects,cart-drawer,theme-drawer,size-guide-modal,complete-the-look,predictive-search,announcement-bar')].map(e=>({tag:e.tagName, data:{...e.dataset}})),
      html:document.querySelector('cart-drawer')?.outerHTML,
      themeScript:[...document.scripts].map(s=>s.src).find(s=>s.includes('/theme.js')),
      variants:document.querySelector('variant-selects')?.variantData,
    })) };
  const js = await (await context.request.get(report.page.themeScript)).body();
  report.themeJsSha256 = createHash('sha256').update(js).digest('hex');
  const deployed = await context.request.get('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115');
  report.deployed = { status:deployed.status(), url:deployed.url(), passwordPage:(await deployed.text()).includes('storefront_password') };
  await writeFile('.tmp/gpt-audit-4b-007/inventory.json', JSON.stringify(report,null,2));
  console.log(JSON.stringify({...report,products:report.products.map(p=>({handle:p.handle,variants:p.variants.length,images:p.images,titleLength:p.title.length})),page:{...report.page,html:undefined}}));
} finally { await browser.close(); }
