import { chromium } from 'playwright';

async function testCls(reducedMotion) {
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
              outerHTML: node ? node.outerHTML.slice(0, 200) : null,
              previousRect: s.previousRect ? { x: s.previousRect.x, y: s.previousRect.y, width: s.previousRect.width, height: s.previousRect.height } : null,
              currentRect: s.currentRect ? { x: s.currentRect.x, y: s.currentRect.y, width: s.currentRect.width, height: s.currentRect.height } : null
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

  const res = await page.goto('http://127.0.0.1:9292/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    return {
      cls: window.__cls,
      shifts: window.__shifts,
      title: document.title,
      reducedMotionAttr: document.documentElement.dataset.reducedMotion || null,
      animationsAttr: document.documentElement.dataset.animations || null
    };
  });

  await browser.close();
  return data;
}

async function run() {
  console.log('Testing Normal Motion (no-preference)...');
  const normal = await testCls(false);
  console.log('Normal CLS:', normal.cls);
  console.log('Testing Reduced Motion (reduce)...');
  const reduced = await testCls(true);
  console.log('Reduced CLS:', reduced.cls);
  console.log('Reduced Shifts Detail:');
  console.log(JSON.stringify(reduced.shifts, null, 2));
}

run().catch(console.error);
