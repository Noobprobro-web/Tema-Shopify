// LEAD-001 · Movimiento modo Full (GSAP). Comprueba contra `shopify theme dev` (127.0.0.1:9292):
//  1) carga sin errores y con GSAP activo; 2) tras recorrer la pagina no queda nada oculto;
//  3) CLS durante el scroll; 4) con prefers-reduced-motion no se oculta nada;
//  5) el foco de teclado nunca cae en un elemento invisible; 6) fotogramas a mitad de animacion.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/13-motion-check.mjs [base] [ruta,...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://127.0.0.1:9292';
const routes = (process.argv[3] || '/,/collections/all,/products/structured-tote').split(',');
const evidence = path.join(here, 'evidence', 'motion');
fs.mkdirSync(evidence, { recursive: true });
const results = [];

const hiddenNow = () => Array.from(document.querySelectorAll('[data-motion-pending], [data-reveal]'))
  .filter((n) => parseFloat(getComputedStyle(n).opacity) < 0.99 || getComputedStyle(n).clipPath.startsWith('inset(100%'))
  .map((n) => n.className.toString().split(' ')[0]);

const browser = await chromium.launch({ headless: true });
for (const reduced of [false, true]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((list) => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(base + route, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => ({
      engine: document.documentElement.dataset.motionEngine,
      gsap: Boolean(window.gsap && window.ScrollTrigger),
      triggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0,
      pending: document.querySelectorAll('[data-motion-pending]').length,
      cssRevealReady: document.documentElement.dataset.revealReady || null,
    }));

    // Recorrido lento hasta el final, con fotogramas en mitad de la pagina.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    let shot = 0;
    for (let y = 0; y <= height; y += 300) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(120);
      if (!reduced && route === '/' && shot < 6 && y > 600 && y % 900 === 0) {
        await page.screenshot({ path: path.join(evidence, `home-scroll-${String(++shot).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 55 });
      }
    }
    await page.waitForTimeout(2600);
    const afterScroll = await page.evaluate(hiddenNow);
    const cls = await page.evaluate(() => Number(window.__cls.toFixed(4)));

    // Teclado: desde arriba, 40 tabulaciones; ninguna debe aterrizar en algo invisible.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const invisibleFocus = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(60);
      const bad = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        let node = el;
        while (node && node !== document.documentElement) {
          const style = getComputedStyle(node);
          if (parseFloat(style.opacity) < 0.05 || style.visibility === 'hidden') return `${el.tagName}.${el.className.toString().split(' ')[0]} dentro de ${node.className.toString().split(' ')[0]}`;
          node = node.parentElement;
        }
        return null;
      });
      // Se da un respiro a la animacion de revelado disparada por el foco antes de juzgar.
      if (bad) { await page.waitForTimeout(400); const still = await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement).opacity)); if (still < 0.05) invisibleFocus.push(bad); }
    }

    const row = { reduced, route, ...state, hiddenAfterScroll: afterScroll, cls, invisibleFocus, errors };
    results.push(row);
    console.log(`${reduced ? 'REDUCED' : 'FULL   '} ${route.padEnd(28)} engine=${state.engine} gsap=${state.gsap} triggers=${state.triggers} pendientes=${state.pending} cssReveal=${state.cssRevealReady} ocultosTrasScroll=${afterScroll.length} CLS=${cls} focoInvisible=${invisibleFocus.length} errores=${errors.length}`);
    if (afterScroll.length) console.log('   ocultos:', afterScroll.slice(0, 8).join(', '));
    if (errors.length) console.log('   errores:', errors.slice(0, 4).join(' | '));
    await page.close();
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(path.join(here, 'results-13-motion-check.json'), JSON.stringify(results, null, 2));
