import { chromium } from 'playwright';

async function inspect(reduced) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? 'reduce' : 'no-preference'
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:9292/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const el = document.querySelector('.hero-editorial__content');
    if (!el) return null;
    const cs = getComputedStyle(el);
    const beforeCs = getComputedStyle(el, '::before');
    return {
      el: {
        animation: cs.animation,
        animationName: cs.animationName,
        transition: cs.transition,
        opacity: cs.opacity,
        transform: cs.transform,
        willChange: cs.willChange
      },
      before: {
        position: beforeCs.position,
        inset: beforeCs.inset,
        top: beforeCs.top,
        height: beforeCs.height,
        background: beforeCs.background?.slice(0, 50),
        animation: beforeCs.animation,
        animationName: beforeCs.animationName,
        transition: beforeCs.transition,
        willChange: beforeCs.willChange
      }
    };
  });

  await browser.close();
  return data;
}

async function run() {
  console.log('NORMAL:', JSON.stringify(await inspect(false), null, 2));
  console.log('REDUCED:', JSON.stringify(await inspect(true), null, 2));
}

run().catch(console.error);
