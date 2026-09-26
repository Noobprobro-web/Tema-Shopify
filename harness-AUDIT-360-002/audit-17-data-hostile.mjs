import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, 'harness-AUDIT-360-002');
const DATA_DIR = path.join(HARNESS_DIR, 'data-formats');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const cookiesStr = fs.readFileSync('harness-AUDIT-360-001/storefront-cookies.txt', 'utf8');
const cookiePairs = cookiesStr.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: 'tema-qkqpke0j.myshopify.com', path: '/' };
});

const THEMES = [
  { name: 'Couture', id: '165809488115' },
  { name: 'Sartorial', id: '166186909939' },
  { name: 'Edition', id: '166186942707' },
  { name: 'Archive', id: '166187041011' }
];

// Static analysis of Liquid & JS price handling
function analyzeCodebasePriceHandling() {
  const liquidDir = path.join(ROOT, 'snippets');
  const jsDir = path.join(ROOT, 'assets');
  const findings = [];

  // Check snippets/price.liquid
  const priceLiquidPath = path.join(liquidDir, 'price.liquid');
  if (fs.existsSync(priceLiquidPath)) {
    const content = fs.readFileSync(priceLiquidPath, 'utf8');
    const usesMoney = content.includes('money');
    const usesMoneyWithCurrency = content.includes('money_with_currency');
    const hasUnitPrice = content.includes('unit_price');
    const hasCompareAt = content.includes('compare_at_price');
    findings.push({
      file: 'snippets/price.liquid',
      usesMoney,
      usesMoneyWithCurrency,
      hasUnitPrice,
      hasCompareAt
    });
  }

  // Check JS files for manual currency formatting (e.g. toFixed(2), regex for $ or .)
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  const jsFindings = [];
  for (const f of jsFiles) {
    const c = fs.readFileSync(path.join(jsDir, f), 'utf8');
    const lines = c.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('toFixed(2)')) {
        jsFindings.push({ file: `assets/${f}`, line: idx + 1, issue: 'Hardcoded toFixed(2) assumes 2 decimals (fails for JPY/KRW)', code: line.trim() });
      }
      if (line.includes('Intl.NumberFormat') && !line.includes('shop.currency')) {
        jsFindings.push({ file: `assets/${f}`, line: idx + 1, issue: 'Intl.NumberFormat usage check', code: line.trim() });
      }
    });
  }

  return { liquid: findings, js: jsFindings };
}

async function runDataFormatsAudit() {
  const browser = await chromium.launch({ headless: true });
  const results = {
    codebase_static_analysis: analyzeCodebasePriceHandling(),
    rendered_hostile_tests: {}
  };

  for (const theme of THEMES) {
    results.rendered_hostile_tests[theme.name] = {};
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.addCookies(cookiePairs);
    const page = await context.newPage();

    // Test products on live store: long title, quotes in vendor, special characters
    const testHandles = [
      'qa-01-long-title',
      'qa-05-quoted-vendor',
      'qa-11-special-chars',
      'qa-13-expensive',
      'qa5a-f04-colour-size'
    ];

    for (const handle of testHandles) {
      const url = `https://tema-qkqpke0j.myshopify.com/products/${handle}?preview_theme_id=${theme.id}&pb=0`;
      try {
        const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (res.status() === 200) {
          await page.waitForTimeout(500);
          const pdpData = await page.evaluate(() => {
            const h1 = document.querySelector('h1');
            const price = document.querySelector('.price, [class*="price"]');
            const vendor = document.querySelector('.product__vendor, [class*="vendor"]');
            const atc = document.querySelector('button[type="submit"][name="add"], form[action*="/cart/add"] button');

            let atcBounding = null;
            if (atc) {
              const r = atc.getBoundingClientRect();
              atcBounding = { top: Math.round(r.top), left: Math.round(r.left), visibleAboveFold: r.top < 800 };
            }

            return {
              titleText: h1 ? h1.innerText.slice(0, 100) : null,
              titleHeight: h1 ? Math.round(h1.getBoundingClientRect().height) : null,
              priceText: price ? price.innerText.trim() : null,
              vendorText: vendor ? vendor.innerText.trim() : null,
              atcBounding,
              horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
            };
          });

          results.rendered_hostile_tests[theme.name][handle] = {
            status: 200,
            data: pdpData
          };
        } else {
          results.rendered_hostile_tests[theme.name][handle] = {
            status: res.status(),
            note: 'Handle not populated on live store'
          };
        }
      } catch (e) {
        results.rendered_hostile_tests[theme.name][handle] = { error: e.message };
      }
    }

    await page.close();
    await context.close();
  }

  await browser.close();

  const outPath = path.join(HARNESS_DIR, 'report-17-data-formats.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[Role 17] Data and formats audit complete. Output written to ${outPath}`);
}

runDataFormatsAudit().catch(err => {
  console.error('[Role 17] Error running audit:', err);
  process.exit(1);
});
