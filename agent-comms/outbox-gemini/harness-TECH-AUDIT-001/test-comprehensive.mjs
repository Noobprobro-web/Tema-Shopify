import { chromium } from 'playwright';

async function runComprehensiveTest() {
  const browser = await chromium.launch({ headless: true });

  const testConfig = async (name, { injectCss = '', useOptional = false, usePreload = false }) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();

    if (injectCss) {
      await page.route('**/base.css*', async (route) => {
        const response = await route.fetch();
        let body = await response.text();
        body += '\n' + injectCss;
        await route.fulfill({
          response,
          body,
          headers: { ...response.headers(), 'content-type': 'text/css; charset=utf-8' }
        });
      });
    }

    if (useOptional || usePreload) {
      await page.route('http://127.0.0.1:9292/', async (route) => {
        const response = await route.fetch();
        let body = await response.text();
        if (useOptional) {
          // Replace heading font-display swap with optional
          body = body.replace(
            /(settings\.type_heading_font[\s\S]*?font_display:\s*')swap(')/g,
            '$1optional$2'
          );
          body = body.replaceAll("font-display: swap;\n  font-family: \"Libre Baskerville\"", "font-display: optional;\n  font-family: \"Libre Baskerville\"");
          body = body.replaceAll("font-display: swap;\n  font-family: Libre Baskerville", "font-display: optional;\n  font-family: Libre Baskerville");
          // in {% style %} block in theme.liquid
          body = body.replace(/(@font-face\s*\{[^}]*?font-family:\s*["']?Libre Baskerville["']?[^}]*?font-display:\s*)swap/g, '$1optional');
        }
        if (usePreload) {
          const preloads = `
            <link rel="preload" href="/cdn/fonts/libre_baskerville/librebaskerville_n4.2ec9ee517e3ce28d5f1e8e453be94723049b71a2.woff2?h1=c2FydG9yaWFsLWVkaXRpb24uY29t&hmac=3db86e929b350ae22c1db6865201ec51feaa7771761d497c21ae9b43343ef068" as="font" type="font/woff2" crossorigin>
            <link rel="preload" href="/cdn/fonts/assistant/assistant_n4.9120912a469cad1cc292572851508ca49d12e768.woff2?h1=c2FydG9yaWFsLWVkaXRpb24uY29t&hmac=98a3b5a76ae8d30e32b4b47eb2212260f8fbcaae4d385f0efb6241a87e5b583f" as="font" type="font/woff2" crossorigin>
          `;
          body = body.replace('<head>', '<head>' + preloads);
        }
        await route.fulfill({
          response,
          body,
          headers: { ...response.headers(), 'content-type': 'text/html; charset=utf-8' }
        });
      });
    }

    await page.addInitScript(() => {
      window.__shifts = [];
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value;
            window.__shifts.push({
              value: entry.value,
              startTime: entry.startTime,
              sources: (entry.sources || []).map(s => ({
                tag: s.node?.tagName,
                cls: s.node?.className,
                prev: s.previousRect ? [Math.round(s.previousRect.x), Math.round(s.previousRect.y), Math.round(s.previousRect.width), Math.round(s.previousRect.height)] : null,
                curr: s.currentRect ? [Math.round(s.currentRect.x), Math.round(s.currentRect.y), Math.round(s.currentRect.width), Math.round(s.currentRect.height)] : null
              }))
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto('http://127.0.0.1:9292/', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const res = await page.evaluate(() => ({
      cls: Number(window.__cls.toFixed(4)),
      shiftCount: window.__shifts.length,
      shifts: window.__shifts
    }));

    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await context.close();
    return res;
  };

  const results = {};

  console.log('Testing Baseline...');
  results.baseline = await testConfig('Baseline', {});
  console.log('Baseline CLS:', results.baseline.cls);

  console.log('Testing CSS Fix Only...');
  const cssFix = `
    /* CSS Fix for Header Grid and Hero Scrim */
    @media (min-width: 62rem) {
      .site-header__inner {
        grid-template-columns: 1fr auto 1fr;
      }
      .site-header__brand {
        justify-self: center;
      }
    }
    .hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__content::before {
      display: none !important;
    }
    .hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__content {
      background: radial-gradient(
        ellipse at bottom left,
        rgb(0 0 0 / var(--hero-scrim-alpha)) 40%,
        rgb(0 0 0 / calc(var(--hero-scrim-alpha) * 0.7)) 70%,
        transparent 100%
      );
      padding: var(--space-md);
    }
  `;
  results.cssFix = await testConfig('CSS Fix', { injectCss: cssFix });
  console.log('CSS Fix CLS:', results.cssFix.cls);

  console.log('Testing CSS Fix + Heading Font Optional...');
  results.cssFixAndOptional = await testConfig('CSS Fix + Optional', { injectCss: cssFix, useOptional: true });
  console.log('CSS Fix + Optional CLS:', results.cssFixAndOptional.cls);

  console.log('Testing Optional Alone...');
  results.optionalAlone = await testConfig('Optional Alone', { useOptional: true });
  console.log('Optional Alone CLS:', results.optionalAlone.cls);

  await browser.close();
  return results;
}

runComprehensiveTest().then(r => {
  console.log('\nFINAL COMPARISON SUMMARY:');
  console.log(JSON.stringify(r, null, 2));
}).catch(console.error);
