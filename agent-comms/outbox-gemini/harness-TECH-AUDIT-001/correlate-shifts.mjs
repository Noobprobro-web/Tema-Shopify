import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  const networkTimeline = [];
  page.on('request', req => {
    networkTimeline.push({ type: 'req', url: req.url().slice(0, 90), time: Date.now() });
  });
  page.on('response', res => {
    networkTimeline.push({ type: 'res', status: res.status(), url: res.url().slice(0, 90), time: Date.now() });
  });

  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
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

  const t0 = Date.now();
  await page.goto('http://127.0.0.1:9292/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const shifts = await page.evaluate(() => window.__shifts);
  console.log('Shifts:');
  for (const s of shifts) {
    console.log(`[Shift @ ${s.startTime.toFixed(1)}ms] score=${s.value.toFixed(4)}`);
    for (const src of s.sources) {
      console.log(`   ${src.tag} (${src.cls}) prev=${JSON.stringify(src.prev)} -> curr=${JSON.stringify(src.curr)}`);
    }
  }

  console.log('\nNetwork events:');
  for (const ev of networkTimeline) {
    console.log(`[+${ev.time - t0}ms] ${ev.type.toUpperCase()} ${ev.status || ''} ${ev.url}`);
  }

  await browser.close();
}

run().catch(console.error);
