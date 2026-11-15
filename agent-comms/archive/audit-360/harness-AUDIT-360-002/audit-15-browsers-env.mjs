import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, 'harness-AUDIT-360-002');
const BROWSERS_DIR = path.join(HARNESS_DIR, 'browsers-env');
if (!fs.existsSync(BROWSERS_DIR)) fs.mkdirSync(BROWSERS_DIR, { recursive: true });

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
  { name: 'product', path: '/products/qa5a-f04-colour-size' }
];

async function runBrowserEnvAudit() {
  const results = {
    cross_browser: {},
    no_js: {},
    reflow_320: {},
    zoom_200: {},
    wcag_text_spacing: {},
    forced_colors: {},
    reduced_motion: {},
    slow_3g: {}
  };

  // 1. Cross-Browser Engines: Chromium, Firefox, WebKit
  console.log('[Role 15] Running cross-browser matrix (Chromium, Firefox, WebKit)...');
  const browserEngines = [
    { name: 'chromium', engine: chromium },
    { name: 'firefox', engine: firefox },
    { name: 'webkit', engine: webkit }
  ];

  for (const b of browserEngines) {
    results.cross_browser[b.name] = {};
    const instance = await b.engine.launch({ headless: true });
    for (const theme of THEMES) {
      results.cross_browser[b.name][theme.name] = {};
      const context = await instance.newContext({ viewport: { width: 1280, height: 800 } });
      await context.addCookies(cookiePairs);

      for (const p of PAGES) {
        const page = await context.newPage();
        const pageErrors = [];
        page.on('pageerror', err => pageErrors.push(err.message));

        const url = `https://tema-qkqpke0j.myshopify.com${p.path}${p.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
        try {
          const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
          await page.waitForTimeout(600);

          const layoutData = await page.evaluate(() => {
            return {
              title: document.title,
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
              h1Count: document.querySelectorAll('h1').length,
              imagesCount: document.querySelectorAll('img').length,
              brokenImagesCount: Array.from(document.querySelectorAll('img')).filter(img => img.naturalWidth === 0 && img.src).length
            };
          });

          results.cross_browser[b.name][theme.name][p.name] = {
            status: res ? res.status() : null,
            errors: pageErrors,
            layout: layoutData
          };
        } catch (err) {
          results.cross_browser[b.name][theme.name][p.name] = { error: err.message };
        }
        await page.close();
      }
      await context.close();
    }
    await instance.close();
  }

  // 2. No-JS Mode
  console.log('[Role 15] Running No-JS audit on Chromium...');
  const cr = await chromium.launch({ headless: true });
  const noJsContext = await cr.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
  await noJsContext.addCookies(cookiePairs);

  for (const theme of THEMES) {
    results.no_js[theme.name] = {};
    for (const p of PAGES) {
      const page = await noJsContext.newPage();
      const url = `https://tema-qkqpke0j.myshopify.com${p.path}${p.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const evalData = await page.evaluate(() => {
          return {
            hasNav: !!document.querySelector('nav, [role="navigation"]'),
            hasAddToCart: !!document.querySelector('button[type="submit"][name="add"], input[type="submit"][name="add"], form[action*="/cart/add"] button'),
            visiblePrice: !!document.querySelector('.price, [class*="price"]'),
            h1Present: !!document.querySelector('h1'),
            bodyTextLength: document.body.innerText.length
          };
        });
        results.no_js[theme.name][p.name] = evalData;
      } catch (e) {
        results.no_js[theme.name][p.name] = { error: e.message };
      }
      await page.close();
    }
  }
  await noJsContext.close();

  // 3. Reflow at 320px (WCAG 1.4.10)
  console.log('[Role 15] Testing Reflow at 320px width...');
  const reflowContext = await cr.newContext({ viewport: { width: 320, height: 568 } });
  await reflowContext.addCookies(cookiePairs);

  for (const theme of THEMES) {
    results.reflow_320[theme.name] = {};
    for (const p of PAGES) {
      const page = await reflowContext.newPage();
      const url = `https://tema-qkqpke0j.myshopify.com${p.path}${p.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(500);
        const reflowData = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;
          const overflow = scrollW > clientW;
          return {
            clientWidth: clientW,
            scrollWidth: scrollW,
            hasHorizontalScroll: overflow,
            overflowDelta: overflow ? scrollW - clientW : 0
          };
        });
        results.reflow_320[theme.name][p.name] = reflowData;
      } catch (e) {
        results.reflow_320[theme.name][p.name] = { error: e.message };
      }
      await page.close();
    }
  }
  await reflowContext.close();

  // 4. Zoom 200% (WCAG 1.4.4)
  console.log('[Role 15] Testing 200% Zoom (deviceScaleFactor: 2, 640x400 view)...');
  const zoomContext = await cr.newContext({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 });
  await zoomContext.addCookies(cookiePairs);

  for (const theme of THEMES) {
    results.zoom_200[theme.name] = {};
    for (const p of PAGES) {
      const page = await zoomContext.newPage();
      const url = `https://tema-qkqpke0j.myshopify.com${p.path}${p.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(500);
        const zoomData = await page.evaluate(() => {
          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;
          return {
            scrollWidth: scrollW,
            clientWidth: clientW,
            hasHorizontalScroll: scrollW > clientW
          };
        });
        results.zoom_200[theme.name][p.name] = zoomData;
      } catch (e) {
        results.zoom_200[theme.name][p.name] = { error: e.message };
      }
      await page.close();
    }
  }
  await zoomContext.close();

  // 5. WCAG 1.4.12 Text Spacing Override
  console.log('[Role 15] Testing WCAG 1.4.12 Text Spacing Override...');
  const textSpacingContext = await cr.newContext({ viewport: { width: 1280, height: 800 } });
  await textSpacingContext.addCookies(cookiePairs);

  for (const theme of THEMES) {
    results.wcag_text_spacing[theme.name] = {};
    for (const p of PAGES) {
      const page = await textSpacingContext.newPage();
      const url = `https://tema-qkqpke0j.myshopify.com${p.path}${p.path.includes('?') ? '&' : '?'}preview_theme_id=${theme.id}&pb=0`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(500);

        // Inject WCAG 1.4.12 CSS
        const spacingResult = await page.evaluate(() => {
          const style = document.createElement('style');
          style.id = 'wcag-text-spacing';
          style.textContent = `
            * {
              line-height: 1.5 !important;
              letter-spacing: 0.12em !important;
              word-spacing: 0.16em !important;
            }
            p {
              margin-bottom: 2em !important;
            }
          `;
          document.head.appendChild(style);

          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;
          return {
            hasHorizontalScroll: scrollW > clientW + 2,
            scrollWidth: scrollW,
            clientWidth: clientW
          };
        });
        results.wcag_text_spacing[theme.name][p.name] = spacingResult;
      } catch (e) {
        results.wcag_text_spacing[theme.name][p.name] = { error: e.message };
      }
      await page.close();
    }
  }
  await textSpacingContext.close();

  // 6. prefers-reduced-motion and forced-colors
  console.log('[Role 15] Testing prefers-reduced-motion and forced-colors...');
  const a11yFeaturesContext = await cr.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
    forcedColors: 'active',
    colorScheme: 'dark'
  });
  await a11yFeaturesContext.addCookies(cookiePairs);

  for (const theme of THEMES) {
    const page = await a11yFeaturesContext.newPage();
    const url = `https://tema-qkqpke0j.myshopify.com/?preview_theme_id=${theme.id}&pb=0`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(500);

      const mediaQueryChecks = await page.evaluate(() => {
        return {
          matchesReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          matchesForcedColors: window.matchMedia('(forced-colors: active)').matches,
          bodyColor: getComputedStyle(document.body).color,
          bodyBg: getComputedStyle(document.body).backgroundColor
        };
      });
      results.reduced_motion[theme.name] = mediaQueryChecks;
    } catch (e) {
      results.reduced_motion[theme.name] = { error: e.message };
    }
    await page.close();
  }
  await a11yFeaturesContext.close();

  // 7. Slow 3G emulation
  console.log('[Role 15] Testing Slow 3G Network Emulation on Sartorial Home...');
  const cdpContext = await cr.newContext({ viewport: { width: 375, height: 667 } });
  await cdpContext.addCookies(cookiePairs);
  const slowPage = await cdpContext.newPage();
  const cdp = await cdpContext.newCDPSession(slowPage);

  // Slow 3G: 400ms RTT, 400kbps down, 400kbps up
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 400,
    downloadThroughput: (400 * 1024) / 8,
    uploadThroughput: (400 * 1024) / 8
  });

  const t0 = Date.now();
  try {
    await slowPage.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=166186909939&pb=0', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const loadTimeMs = Date.now() - t0;
    const slowMetrics = await slowPage.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        duration: nav ? Math.round(nav.duration) : null
      };
    });
    results.slow_3g['Sartorial_home'] = {
      wallClockMs: loadTimeMs,
      performanceNav: slowMetrics
    };
  } catch (e) {
    results.slow_3g['Sartorial_home'] = { error: e.message };
  }
  await slowPage.close();
  await cdpContext.close();

  await cr.close();

  const finalOutPath = path.join(HARNESS_DIR, 'report-15-browsers-env.json');
  fs.writeFileSync(finalOutPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[Role 15] Audit complete. Output written to ${finalOutPath}`);
}

runBrowserEnvAudit().catch(err => {
  console.error('[Role 15] Error running audit:', err);
  process.exit(1);
});
