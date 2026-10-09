import { chromium } from 'playwright';

async function testFontDisplayOptional() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  // Intercept HTML and replace font-display: swap with font-display: optional
  await page.route('http://127.0.0.1:9292/', async (route) => {
    const response = await route.fetch();
    let body = await response.text();
    body = body.replaceAll('font-display: swap', 'font-display: optional');
    body = body.replaceAll('font_display: swap', 'font_display: optional');

    await route.fulfill({
      response,
      body,
      headers: {
        ...response.headers(),
        'content-type': 'text/html; charset=utf-8'
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

  console.log('CLS WITH font-display: optional:', res.cls);
  console.log('Shifts:', JSON.stringify(res.shifts, null, 2));

  await page.unrouteAll({ behavior: 'ignoreErrors' });
  await browser.close();
}

testFontDisplayOptional().catch(console.error);
