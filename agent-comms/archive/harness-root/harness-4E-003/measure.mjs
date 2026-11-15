import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://127.0.0.1:8123/documentation.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(300);
const sel = ['.container', '.main-documentation__header', '.main-documentation__title', '.rte.lede',
  '.main-documentation__layout', '.main-documentation__nav', '.main-documentation__body',
  '.doc-section', '.doc-section__content', '.doc-preset', '.doc-snippet'];
console.log(await p.evaluate((sels) => sels.map((s) => {
  const el = document.querySelector(s);
  if (!el) return s + ' :: MISSING';
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return `${s.padEnd(34)} x=${Math.round(r.x)} w=${Math.round(r.width)}  max-width=${cs.maxWidth} font-size=${cs.fontSize} word-break=${cs.wordBreak} overflow-wrap=${cs.overflowWrap} hyphens=${cs.hyphens}`;
}).join('\n'), sel));
console.log('--- grid ---');
console.log(await p.evaluate(() => {
  const l = document.querySelector('.main-documentation__layout');
  const cs = getComputedStyle(l);
  return `display=${cs.display} grid-template-columns=${cs.gridTemplateColumns} gap=${cs.gap} align-items=${cs.alignItems}`;
}));
await b.close();
