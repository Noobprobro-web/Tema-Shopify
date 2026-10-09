import { chromium } from 'playwright';

async function testExactPatch() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  // Patch HTML: preloads + font-display: optional on headings
  await page.route('http://127.0.0.1:9292/', async (route) => {
    const response = await route.fetch();
    let body = await response.text();

    const preloads = `
      <link rel="preload" href="/cdn/fonts/libre_baskerville/librebaskerville_n4.2ec9ee517e3ce28d5f1e6c6e75efd8a97e59c189.woff2" as="font" type="font/woff2" crossorigin>
      <link rel="preload" href="/cdn/fonts/assistant/assistant_n4.9120912a469cad1cc292572851508ca49d12e768.woff2" as="font" type="font/woff2" crossorigin>
    `;
    body = body.replace('<head>', '<head>' + preloads);

    // Replace font-display: swap on Libre Baskerville font-face declarations
    body = body.replaceAll(
      'font-family: "Libre Baskerville";\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;',
      'font-family: "Libre Baskerville";\n  font-weight: 400;\n  font-style: normal;\n  font-display: optional;'
    );
    body = body.replaceAll(
      'font-family: "Libre Baskerville";\n  font-weight: 700;\n  font-style: normal;\n  font-display: swap;',
      'font-family: "Libre Baskerville";\n  font-weight: 700;\n  font-style: normal;\n  font-display: optional;'
    );
    body = body.replaceAll(
      'font-family: "Libre Baskerville";\n  font-weight: 400;\n  font-style: italic;\n  font-display: swap;',
      'font-family: "Libre Baskerville";\n  font-weight: 400;\n  font-style: italic;\n  font-display: optional;'
    );
    body = body.replaceAll(
      'font-family: "Libre Baskerville";\n  font-weight: 700;\n  font-style: italic;\n  font-display: swap;',
      'font-family: "Libre Baskerville";\n  font-weight: 700;\n  font-style: italic;\n  font-display: optional;'
    );

    await route.fulfill({
      response,
      body,
      headers: { ...response.headers(), 'content-type': 'text/html; charset=utf-8' }
    });
  });

  // Patch base.css: header centering & hero scrim stability
  await page.route('**/base.css*', async (route) => {
    const response = await route.fetch();
    let body = await response.text();

    const patchCss = `
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

    body += '\n' + patchCss;
    await route.fulfill({
      response,
      body,
      headers: { ...response.headers(), 'content-type': 'text/css; charset=utf-8' }
    });
  });

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

  console.log('PATCH VERIFICATION:');
  console.log('CLS under reduced motion:', res.cls);
  console.log('Shifts:', JSON.stringify(res.shifts, null, 2));

  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await browser.close();
  return res;
}

testExactPatch().catch(console.error);
