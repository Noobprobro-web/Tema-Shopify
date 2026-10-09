import { chromium } from 'playwright';

async function testCssFix(injectedCss) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  // Intercept base.css and append the injected CSS fix
  await page.route('**/base.css*', async (route) => {
    const response = await route.fetch();
    let body = await response.text();
    body += '\n' + injectedCss;
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

  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await browser.close();
  return res;
}

async function run() {
  console.log('--- Test 1: Baseline (no fix) ---');
  const base = await testCssFix('');
  console.log('Baseline CLS:', base.cls);

  console.log('\n--- Test 2: Hero overlay contain / transform ---');
  const fix1 = await testCssFix(`
    .hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__content::before {
      contain: layout paint;
    }
  `);
  console.log('Fix 1 (contain layout paint) CLS:', fix1.cls);
  console.log('Fix 1 shifts:', JSON.stringify(fix1.shifts, null, 2));

  console.log('\n--- Test 3: Overlay on inner instead of content::before ---');
  const fix2 = await testCssFix(`
    .hero-editorial--cinematic.hero-editorial--overlay-gradient_content .hero-editorial__content::before {
      display: none !important;
    }
  `);
  console.log('Fix 2 (no content::before) CLS:', fix2.cls);
  console.log('Fix 2 shifts:', JSON.stringify(fix2.shifts, null, 2));
}

run().catch(console.error);
