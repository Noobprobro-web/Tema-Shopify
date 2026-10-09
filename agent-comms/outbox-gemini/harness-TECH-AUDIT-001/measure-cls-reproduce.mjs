import { chromium } from 'playwright';

async function testCls(reducedMotion, doScroll = true) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference'
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__shifts = [];
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cls += entry.value;
          const sources = (entry.sources || []).map(s => {
            const node = s.node;
            return {
              tag: node ? node.tagName : null,
              id: node ? node.id : null,
              className: node ? (node.className || '').toString() : null,
              outerHTML: node ? node.outerHTML.slice(0, 160) : null,
              previousRect: s.previousRect ? { x: Math.round(s.previousRect.x), y: Math.round(s.previousRect.y), width: Math.round(s.previousRect.width), height: Math.round(s.previousRect.height) } : null,
              currentRect: s.currentRect ? { x: Math.round(s.currentRect.x), y: Math.round(s.currentRect.y), width: Math.round(s.currentRect.width), height: Math.round(s.currentRect.height) } : null
            };
          });
          window.__shifts.push({
            value: entry.value,
            startTime: entry.startTime,
            sources
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('http://127.0.0.1:9292/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const clsBeforeScroll = await page.evaluate(() => Number(window.__cls.toFixed(4)));

  if (doScroll) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 300) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(2600);
  }

  const data = await page.evaluate((clsPre) => {
    return {
      clsBeforeScroll: clsPre,
      clsFinal: Number(window.__cls.toFixed(4)),
      shifts: window.__shifts
    };
  }, clsBeforeScroll);

  await browser.close();
  return data;
}

async function run() {
  console.log('Testing Normal Motion WITH scroll...');
  const normal = await testCls(false, true);
  console.log('Normal CLS before scroll:', normal.clsBeforeScroll, 'final:', normal.clsFinal);

  console.log('\nTesting Reduced Motion NO scroll (just sitting 4s)...');
  const reducedNoScroll = await testCls(true, false);
  console.log('Reduced CLS NO scroll:', reducedNoScroll.clsBeforeScroll, 'final:', reducedNoScroll.clsFinal);
  console.log('Shifts (no scroll):', JSON.stringify(reducedNoScroll.shifts, null, 2));

  console.log('\nTesting Reduced Motion WITH scroll...');
  const reducedWithScroll = await testCls(true, true);
  console.log('Reduced CLS WITH scroll before:', reducedWithScroll.clsBeforeScroll, 'final:', reducedWithScroll.clsFinal);
  console.log('Shifts (with scroll):', JSON.stringify(reducedWithScroll.shifts, null, 2));
}

run().catch(console.error);
