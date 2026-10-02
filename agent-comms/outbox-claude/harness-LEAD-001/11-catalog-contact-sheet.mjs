// LEAD-001 (copia de AUDIT-FINAL-003/28): hoja de contacto del catálogo completo de una tienda para revisión visual
// de logotipos o marcas en las fotos de producto (el texto ya se barrió en 20-compliance).
import fs from 'node:fs';
import { STORES, launch, unlock } from '../harness-AUDIT-FINAL-003/lib.mjs';

const name = process.argv[2] || 'edition';
const store = STORES[name];
fs.mkdirSync(new URL('./evidence/', import.meta.url), { recursive: true });
const file = (n) => new URL('./evidence/' + n, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/%20/g, ' ');
const browser = await launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await unlock(context, store.url);
const page = await context.newPage();
await page.goto(store.url + '/collections/all', { waitUntil: 'load' });
await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
await page.waitForTimeout(1500);
const grid = page.locator('main .product-grid, main [class*="collection-main__grid"], main ul').filter({ has: page.locator('.product-card') }).first();
await grid.screenshot({ path: file(`${name}-catalogo-completo.jpg`), type: 'jpeg', quality: 60 });
console.log('ok', file(`${name}-catalogo-completo.jpg`));
await browser.close();
