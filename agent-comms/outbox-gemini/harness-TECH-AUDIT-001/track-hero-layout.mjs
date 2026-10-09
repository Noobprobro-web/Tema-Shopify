import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce'
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__log = [];
    const record = (event) => {
      const hero = document.querySelector('.hero-editorial__content');
      const heading = document.querySelector('.hero-editorial__heading');
      const sub = document.querySelector('.hero-editorial__subheading');
      const act = document.querySelector('.hero-editorial__actions');
      const brand = document.querySelector('.site-header__brand');
      window.__log.push({
        t: performance.now(),
        event,
        hero: hero ? { y: hero.offsetTop, h: hero.offsetHeight, rect: hero.getBoundingClientRect() } : null,
        heading: heading ? { h: heading.offsetHeight, text: heading.innerText } : null,
        sub: sub ? { y: sub.offsetTop, h: sub.offsetHeight } : null,
        act: act ? { y: act.offsetTop, h: act.offsetHeight } : null,
        brand: brand ? { w: brand.offsetWidth, x: brand.offsetLeft } : null
      });
    };

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        record('mutation: ' + m.type + ' ' + (m.target.className || m.target.nodeName));
      }
    });
    mo.observe(document.documentElement, { attributes: true, subtree: true, childList: true });

    document.fonts.ready.then(() => {
      record('fonts.ready');
    });

    setInterval(() => {
      record('interval');
    }, 50);
  });

  await page.goto('http://127.0.0.1:9292/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const logs = await page.evaluate(() => window.__log);
  console.log('Sampled log around font loading:');
  let prevH = 0;
  for (const entry of logs) {
    if (entry.hero && entry.hero.h !== prevH) {
      console.log(`[${entry.t.toFixed(1)}ms] ${entry.event} -> Hero H=${entry.hero.h}, Y=${entry.hero.rect.y.toFixed(1)}, Heading H=${entry.heading?.h}, Brand W=${entry.brand?.w}, Brand X=${entry.brand?.x}`);
      prevH = entry.hero.h;
    } else if (entry.event === 'fonts.ready') {
      console.log(`[${entry.t.toFixed(1)}ms] FONTS.READY -> Hero H=${entry.hero?.h}, Y=${entry.hero?.rect.y.toFixed(1)}, Heading H=${entry.heading?.h}, Brand W=${entry.brand?.w}, Brand X=${entry.brand?.x}`);
    }
  }

  await browser.close();
}

run().catch(console.error);
