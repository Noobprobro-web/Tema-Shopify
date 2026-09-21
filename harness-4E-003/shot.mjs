import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const base = 'http://127.0.0.1:8123';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

const targets = process.argv.slice(2);
for (const name of targets) {
  for (const [label, width] of [['desktop', 1280], ['mobile', 390]]) {
    const p = await b.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e).split('\n')[0]));
    p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });
    await p.goto(`${base}/${name}.html`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    // recorrer la pagina para disparar los reveals antes de la captura completa
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 500) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(90); }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700);
    const m = await p.evaluate(() => ({
      docW: document.documentElement.scrollWidth,
      winW: window.innerWidth,
      bodyH: document.body.scrollHeight,
      hidden: Array.from(document.querySelectorAll('[data-reveal]:not([data-revealed])')).length,
      over: Array.from(document.querySelectorAll('body *')).filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > window.innerWidth + 1;
      }).slice(0, 6).map((el) => el.tagName.toLowerCase() + '.' + (el.className.toString().split(' ')[0] || '') + ' right=' + Math.round(el.getBoundingClientRect().right)),
    }));
    console.log(`${name} ${label} ${width}px  scrollW=${m.docW} winW=${m.winW} height=${m.bodyH} unrevealed=${m.hidden}` +
      (m.over.length ? `\n   OVERFLOW: ${m.over.join(' | ')}` : '') + (errs.length ? `\n   JS: ${[...new Set(errs)].join(' | ')}` : ''));
    await p.screenshot({ path: `shots/${name}-${label}.png`, fullPage: true });
    await p.close();
  }
}
await b.close();
