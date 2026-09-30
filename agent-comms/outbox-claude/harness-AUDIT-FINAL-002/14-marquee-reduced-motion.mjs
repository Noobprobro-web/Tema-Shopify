// Eje 2: la marquesina con prefers-reduced-motion. Mide el desbordamiento con el contenido real de la
// demo a 320/375 px y con una frase de comerciante de 46 caracteres inyectada en el DOM, y valida el
// parche CSS propuesto (solo en el navegador de prueba).
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const PHRASE = 'COMPLIMENTARY SHIPPING ON ALL ORDERS OVER $150';
const PATCH = '@media (prefers-reduced-motion: reduce){.marquee-banner__item{white-space:normal;overflow-wrap:anywhere;min-width:0}.marquee-banner__group{min-width:0}}';
const M = () => { const de = document.documentElement; const items = [...document.querySelectorAll('.marquee-banner__group:not([aria-hidden="true"]) .marquee-banner__item')]; return { overflow: de.scrollWidth - de.clientWidth, widest: Math.max(0, ...items.map((i) => Math.round(i.getBoundingClientRect().width))), items: items.length, toggleVisible: (() => { const b = document.querySelector('[data-marquee-toggle]'); return !!b && getComputedStyle(b).display !== 'none'; })(), bannerHeight: Math.round(document.querySelector('marquee-banner')?.getBoundingClientRect().height || 0) }; };

const out = [];
const browser = await launch();
for (const name of (process.argv[2] ? [process.argv[2]] : ['atelier', 'archive'])) {
  const store = STORES[name];
  for (const width of [320, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 667 }, reducedMotion: 'reduce' });
    await unlock(context, store.url);
    const page = await context.newPage();
    await page.goto(store.url + '/', { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    if (!(await page.locator('marquee-banner').count())) { out.push({ store: name, width, skipped: 'sin marquesina' }); await context.close(); continue; }
    const real = await page.evaluate(M);
    await page.evaluate((t) => { const i = document.querySelector('.marquee-banner__group:not([aria-hidden="true"]) .marquee-banner__item'); i.firstChild.textContent = t; }, PHRASE);
    const injected = await page.evaluate(M);
    await page.addStyleTag({ content: PATCH });
    const patched = await page.evaluate(M);
    out.push({ store: name, width, reducedMotion: true, contenidoReal: real, frase46: injected, frase46ConParche: patched });
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-14-marquee-reduced-motion.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) console.log(r.skipped ? `${r.store} ${r.width} ${r.skipped}` : `${r.store.padEnd(8)} ${r.width}px reduce | demo: overflow=${r.contenidoReal.overflow}px (ítem más ancho ${r.contenidoReal.widest}px, alto ${r.contenidoReal.bannerHeight}) | frase 46 car.: overflow=${r.frase46.overflow}px (ítem ${r.frase46.widest}px) | con parche: overflow=${r.frase46ConParche.overflow}px (ítem ${r.frase46ConParche.widest}px, alto ${r.frase46ConParche.bannerHeight})`);
