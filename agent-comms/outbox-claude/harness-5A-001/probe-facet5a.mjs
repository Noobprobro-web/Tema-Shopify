// Mide las etiquetas de los swatches de filtro (area de toque) y el desborde horizontal. Requiere el servidor del arnes en :8105.
import { chromium } from 'playwright';
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const w of [1280, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://127.0.0.1:8105/site-en/collection.html', { waitUntil: 'networkidle' });
  const r = await p.locator('.facet__swatch-value').evaluateAll((els) => els.map((e) => { const b = e.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height), e.getClientRects().length > 0]; }));
  const vis = r.filter((x) => x[2]);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(w, 'swatch labels', r.length, 'visible', vis.length, 'min w', Math.min(...vis.map((x) => x[0])), 'min h', Math.min(...vis.map((x) => x[1])), 'overflow', overflow);
}
await b.close();
