// Evidencia visual del hallazgo de foco sobre fotografía: captura el control con :focus-visible.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const name = process.argv[2] || 'archive';
// --patch inyecta SOLO en el navegador de prueba el CSS propuesto en el informe (anillo de dos tonos).
const PATCH = process.argv.includes('--patch');
const PATCH_CSS = '.product-gallery__zoom-trigger:focus-visible{outline-offset:-5px;box-shadow:inset 0 0 0 7px var(--color-background)}.lookbook-hotspot__trigger:focus-visible{outline-offset:2px;box-shadow:0 0 0 6px var(--color-background)}';
const suffix = PATCH ? '-PARCHE' : '';
const store = STORES[name];
fs.mkdirSync(new URL('./evidence/', import.meta.url), { recursive: true });
const browser = await launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await unlock(context, store.url);
const page = await context.newPage();
const shot = async (sel, nth, file, pad = 60) => {
  const loc = page.locator(sel).nth(nth);
  if (!(await loc.count())) return console.log('sin', sel);
  await loc.scrollIntoViewIfNeeded();
  await page.keyboard.press('Shift');
  await loc.focus();
  await page.waitForTimeout(400);
  const b = await loc.boundingBox();
  const clip = { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: Math.min(1440 - Math.max(0, b.x - pad), b.width + pad * 2), height: Math.min(900 - Math.max(0, b.y - pad), b.height + pad * 2) };
  await page.screenshot({ path: new URL('./evidence/' + file, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1').replace(/%20/g, ' '), clip });
  console.log(file, JSON.stringify(clip), await loc.evaluate((el) => el.matches(':focus-visible') + ' ' + getComputedStyle(el).outline));
};
await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load' });
await page.waitForTimeout(1500);
if (PATCH) await page.addStyleTag({ content: PATCH_CSS });
await shot('.product-gallery__zoom-trigger', 0, `${name}-pdp-zoom-trigger-focus${suffix}.png`, 20);
await page.goto(store.url + '/', { waitUntil: 'load' });
await page.waitForTimeout(1500);
if (PATCH) await page.addStyleTag({ content: PATCH_CSS });
await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
await shot('.lookbook-hotspot__trigger', 1, `${name}-lookbook-hotspot-focus${suffix}.png`, 70);
await shot('.lookbook-hotspot__trigger', 0, `${name}-lookbook-hotspot0-focus${suffix}.png`, 70);
await browser.close();
