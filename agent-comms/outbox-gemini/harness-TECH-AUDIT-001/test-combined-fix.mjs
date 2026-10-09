import { chromium } from 'playwright';

async function testCombinedFix() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  // Test combination of CSS fixes + font-display: optional or swap
  await page.route('**/base.css*', async (route) => {
    const response = await route.fetch();
    let body = await response.text();

    const additionalCss = `
      /* Fix 1: Make header brand centered and stable */
      @media (min-width: 62rem) {
        .site-header__inner {
          grid-template-columns: 1fr auto 1fr;
        }
        .site-header__brand {
          justify-self: center;
          width: max-content;
        }
      }

      /* Fix 2: Radial gradient without unconstrained ::before shift */
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
        border-radius: var(--border-radius-sm, 4px);
      }
    `;

    body += '\n' + additionalCss;
    await route.fulfill({
      response,
      body,
      headers: {
        ...response.headers(),
        'content-type': 'text/css; charset=utf-8'
      }
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
    shifts: window.__shifts
  }));

  console.log('CLS WITH COMBINED CSS FIX (still swap):', res.cls);
  console.log('Shifts:', JSON.stringify(res.shifts, null, 2));

  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await browser.close();
}

testCombinedFix().catch(console.error);
