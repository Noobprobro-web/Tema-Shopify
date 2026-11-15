import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, 'harness-AUDIT-360-002');
const HTML_DIR = path.join(HARNESS_DIR, 'html-validation');
if (!fs.existsSync(HTML_DIR)) fs.mkdirSync(HTML_DIR, { recursive: true });

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

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'collection', path: '/collections/all' },
  { name: 'product', path: '/products/qa5a-f04-colour-size' },
  { name: 'cart', path: '/cart' },
  { name: 'search', path: '/search?q=coat' },
  { name: '404', path: '/404' }
];

async function validateNuRemote(html) {
  try {
    const res = await fetch('https://validator.w3.org/nu/?out=json', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'User-Agent': 'Mozilla/5.0 (ShopifyThemeAudit/2.0)'
      },
      body: html
    });
    if (res.ok) {
      const data = await res.json();
      return data.messages || [];
    }
    return [{ type: 'info', message: `W3C validator returned HTTP ${res.status}` }];
  } catch (err) {
    return [{ type: 'info', message: `W3C remote validation skipped/error: ${err.message}` }];
  }
}

async function runHtmlAudit() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const theme of THEMES) {
    results[theme.name] = {};
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.addCookies(cookiePairs);

    for (const pageDef of PAGES) {
      const page = await context.newPage();
      const url = `https://tema-qkqpke0j.myshopify.com${pageDef.path}${pageDef.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
      console.log(`[Role 16 - HTML] Validating ${theme.name} -> ${pageDef.name}...`);

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await page.waitForTimeout(600);

        const html = await page.content();
        const htmlFilePath = path.join(HTML_DIR, `${theme.name}_${pageDef.name}.html`);
        fs.writeFileSync(htmlFilePath, html, 'utf8');

        // Domestic DOM structure validation: Duplicate IDs, broken ARIA refs, invalid nesting
        const domAnalysis = await page.evaluate(() => {
          const idMap = {};
          const duplicateIds = [];
          document.querySelectorAll('[id]').forEach(el => {
            const id = el.id.trim();
            if (!id) return;
            if (idMap[id]) {
              idMap[id].count++;
              idMap[id].elements.push(el.tagName + (el.className ? '.' + el.className.split(' ').join('.') : ''));
            } else {
              idMap[id] = { count: 1, elements: [el.tagName] };
            }
          });

          for (const [id, data] of Object.entries(idMap)) {
            if (data.count > 1) {
              duplicateIds.push({ id, count: data.count, elements: data.elements });
            }
          }

          // Broken ARIA controls / labelledby / describedby
          const brokenAria = [];
          ['aria-controls', 'aria-labelledby', 'aria-describedby'].forEach(attr => {
            document.querySelectorAll(`[${attr}]`).forEach(el => {
              const refs = el.getAttribute(attr).split(/\s+/).filter(Boolean);
              refs.forEach(targetId => {
                if (!document.getElementById(targetId)) {
                  brokenAria.push({
                    element: el.tagName,
                    attribute: attr,
                    targetId,
                    snippet: el.outerHTML.slice(0, 100)
                  });
                }
              });
            });
          });

          // Invalid nesting: button inside a, a inside a, form inside form
          const nestingIssues = [];
          document.querySelectorAll('a button, a a, form form').forEach(el => {
            nestingIssues.push({
              tag: el.tagName,
              parent: el.parentElement ? el.parentElement.tagName : null,
              snippet: el.outerHTML.slice(0, 80)
            });
          });

          return {
            duplicateIds,
            brokenAria,
            nestingIssues
          };
        });

        // Remote Nu HTML validation
        const nuMessages = await validateNuRemote(html);
        const nuErrors = nuMessages.filter(m => m.type === 'error');
        const nuWarnings = nuMessages.filter(m => m.type === 'info' && m.subType === 'warning');

        results[theme.name][pageDef.name] = {
          raw_html: `harness-AUDIT-360-002/html-validation/${theme.name}_${pageDef.name}.html`,
          duplicate_ids_count: domAnalysis.duplicateIds.length,
          duplicate_ids: domAnalysis.duplicateIds,
          broken_aria_count: domAnalysis.brokenAria.length,
          broken_aria: domAnalysis.brokenAria,
          nesting_issues_count: domAnalysis.nestingIssues.length,
          nesting_issues: domAnalysis.nestingIssues,
          nu_validator: {
            total_messages: nuMessages.length,
            errors_count: nuErrors.length,
            warnings_count: nuWarnings.length,
            errors: nuErrors.slice(0, 10)
          }
        };
      } catch (err) {
        results[theme.name][pageDef.name] = { error: err.message };
      }

      await page.close();
    }
    await context.close();
  }

  await browser.close();

  const summaryPath = path.join(HARNESS_DIR, 'report-16-html-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[Role 16] HTML validation finished. Summary written to ${summaryPath}`);
}

runHtmlAudit().catch(err => {
  console.error('[Role 16] Error running audit:', err);
  process.exit(1);
});
