import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, 'harness-AUDIT-360-002');
const AXE_DIR = path.join(HARNESS_DIR, 'axe');
const KB_DIR = path.join(HARNESS_DIR, 'keyboard');
if (!fs.existsSync(AXE_DIR)) fs.mkdirSync(AXE_DIR, { recursive: true });
if (!fs.existsSync(KB_DIR)) fs.mkdirSync(KB_DIR, { recursive: true });

const axeSource = fs.readFileSync('tests/vendor/axe.min.js', 'utf8');

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
  { name: 'blog', path: '/blogs/news' },
  { name: '404', path: '/404' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'mobile_small', width: 360, height: 640 }
];

async function runA11y() {
  const browser = await chromium.launch({ headless: true });
  const allViolations = [];
  const keyboardTraces = {};

  for (const theme of THEMES) {
    for (const pageDef of PAGES) {
      for (const vp of VIEWPORTS) {
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        await context.addCookies(cookiePairs);
        const page = await context.newPage();

        const url = `https://tema-qkqpke0j.myshopify.com${pageDef.path}${pageDef.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
        console.log(`[axe] Auditing ${theme.name} -> ${pageDef.name} [${vp.name}]...`);
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(800);
          await page.evaluate(axeSource);

          const results = await page.evaluate(async () => {
            const r = await axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
            return {
              violations: r.violations.map(v => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                help: v.help,
                helpUrl: v.helpUrl,
                nodes: v.nodes.map(n => ({ html: n.html, target: n.target, failureSummary: n.failureSummary }))
              })),
              passes_count: r.passes.length,
              inapplicable_count: r.inapplicable.length
            };
          });

          const rawAxeFile = path.join(AXE_DIR, `${theme.name}_${pageDef.name}_${vp.name}.json`);
          fs.writeFileSync(rawAxeFile, JSON.stringify(results, null, 2), 'utf8');

          if (results.violations.length > 0) {
            allViolations.push({
              theme: theme.name,
              page: pageDef.name,
              viewport: vp.name,
              raw_file: `harness-AUDIT-360-002/axe/${theme.name}_${pageDef.name}_${vp.name}.json`,
              violations: results.violations
            });
          }
        } catch (err) {
          console.error(`Error auditing ${theme.name} ${pageDef.name} ${vp.name}:`, err.message);
        }

        await page.close();
        await context.close();
      }
    }

    // Keyboard Tab and Shift+Tab traversal on Home, Collection, Product, Cart, Search
    console.log(`[Keyboard Trace] Tracing focus order on ${theme.name}...`);
    const kbContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await kbContext.addCookies(cookiePairs);

    for (const kbPage of ['home', 'collection', 'product', 'cart', 'search']) {
      const pagePath = kbPage === 'home' ? '/' : (kbPage === 'product' ? '/products/qa5a-f04-colour-size' : (kbPage === 'search' ? '/search?q=coat' : `/${kbPage}`));
      const kbUrl = `https://tema-qkqpke0j.myshopify.com${pagePath}${pagePath.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
      const kbPageInst = await kbContext.newPage();
      try {
        await kbPageInst.goto(kbUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await kbPageInst.waitForTimeout(800);

        // Tab sequence trace (press Tab 25 times)
        const trace = [];
        for (let step = 1; step <= 25; step++) {
          await kbPageInst.keyboard.press('Tab');
          await kbPageInst.waitForTimeout(50);
          const focusedInfo = await kbPageInst.evaluate((stepNum) => {
            const el = document.activeElement;
            if (!el || el === document.body) return null;
            const rect = el.getBoundingClientRect();
            // Check if element is visually obscured by another element on top
            const topEl = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            const isObscured = topEl !== null && !el.contains(topEl) && !topEl.contains(el);

            return {
              step: stepNum,
              tag: el.tagName,
              id: el.id || null,
              className: el.className || null,
              accessibleName: el.getAttribute('aria-label') || el.innerText?.slice(0, 40)?.trim() || el.getAttribute('title') || '',
              role: el.getAttribute('role') || el.tagName.toLowerCase(),
              boundingBox: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
              isObscured
            };
          }, step);

          if (focusedInfo) trace.push(focusedInfo);
        }

        const kbFile = path.join(KB_DIR, `${theme.name}_${kbPage}_tab_sequence.json`);
        fs.writeFileSync(kbFile, JSON.stringify(trace, null, 2), 'utf8');
        keyboardTraces[`${theme.name}_${kbPage}`] = {
          count: trace.length,
          raw_file: `harness-AUDIT-360-002/keyboard/${theme.name}_${kbPage}_tab_sequence.json`,
          obscured_count: trace.filter(t => t.isObscured).length
        };
      } catch (e) {
        console.error(`KB trace error on ${theme.name} ${kbPage}:`, e.message);
      }
      await kbPageInst.close();
    }
    await kbContext.close();
  }

  await browser.close();

  const summary = {
    total_audited: THEMES.length * PAGES.length * VIEWPORTS.length,
    total_violations_found: allViolations.length,
    violations: allViolations,
    keyboard_traces: keyboardTraces
  };

  fs.writeFileSync(path.join(HARNESS_DIR, 'report-06-a11y-summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  console.log(`A11y and Keyboard audit finished. Total violations: ${allViolations.length}`);
}

runA11y().catch(err => {
  console.error('A11y run error:', err);
  process.exit(1);
});
