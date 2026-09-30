// Eje 3: ¿hay trabajo continuo en el hilo principal con la página en reposo? Lighthouse atribuye decenas de
// segundos de "Rendering / Style & Layout" al documento de la home móvil. Se mide con CDP
// (Performance.getMetrics) cuántos recálculos de estilo, layouts y ms de tarea ocurren en 6 s SIN tocar
// la página, en cuatro condiciones: tal cual, con la marquesina pausada, con los pulsos de hotspot
// apagados y con ambas cosas. Y se listan las animaciones en curso y si el motor las compone.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const CONDITIONS = {
  'tal cual': '',
  'sin marquesina': '.marquee-banner__track{animation:none!important}',
  'sin pulso de hotspots': '.lookbook-hotspot__trigger::before{animation:none!important}',
  'sin ambas': '.marquee-banner__track{animation:none!important}.lookbook-hotspot__trigger::before{animation:none!important}',
};
const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '375', width: 375, height: 667 }]) {
    for (const p of ['/', '/products/' + store.products[0]]) {
      for (const [cond, css] of Object.entries(p === '/' ? CONDITIONS : { 'tal cual': '' })) {
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        await unlock(context, store.url);
        const page = await context.newPage();
        const resp = await page.goto(store.url + p, { waitUntil: 'load' });
        if (resp.status() >= 400) { out.push({ store: name, path: p, cond, error: resp.status() }); await context.close(); continue; }
        if (css) await page.addStyleTag({ content: css });
        await page.waitForTimeout(6000); // que terminen carga, píxeles y analítica de Shopify
        const cdp = await context.newCDPSession(page);
        await cdp.send('Performance.enable');
        const read = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
        const a = await read();
        const raf0 = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const tick = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(tick); else res(n); }; requestAnimationFrame(tick); }));
        const b0 = await read();
        await page.waitForTimeout(6000);
        const b = await read();
        const anims = await page.evaluate(() => document.getAnimations().filter((x) => x.playState === 'running').map((x) => { const t = x.effect && x.effect.target; const timing = x.effect.getComputedTiming(); return { name: x.animationName || x.transitionProperty || 'anim', target: t ? t.localName + '.' + String(t.className).split(/\s+/)[0] + (x.effect.pseudoElement || '') : null, props: [...new Set(x.effect.getKeyframes().flatMap((k) => Object.keys(k).filter((q) => !['offset', 'easing', 'composite', 'computedOffset'].includes(q))))], iterations: timing.iterations === Infinity ? 'infinite' : timing.iterations, inViewport: (() => { if (!t) return null; const r = t.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })() }; }));
        const d = (k) => +(b[k] - b0[k]).toFixed(3);
        out.push({ store: name, vp: vp.n, path: p, cond, idleSeconds: 6, recalcStyleCount: d('RecalcStyleCount'), layoutCount: d('LayoutCount'), taskDurationMs: Math.round(d('TaskDuration') * 1000), scriptDurationMs: Math.round(d('ScriptDuration') * 1000), recalcStyleMs: Math.round(d('RecalcStyleDuration') * 1000), layoutMs: Math.round(d('LayoutDuration') * 1000), mainThreadBusyPct: Math.round((d('TaskDuration') / 6) * 100), rafPerSecond: raf0, nodes: b.Nodes, runningAnimations: anims });
        await context.close();
      }
    }
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-13-idle-mainthread' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) console.log(r.error ? `${r.store} ${r.path} ${r.cond} ERROR ${r.error}` : `${r.store.padEnd(8)} ${r.path.padEnd(44).slice(0, 44)} ${r.cond.padEnd(22)} reposo 6 s: recalcStyle=${String(r.recalcStyleCount).padEnd(5)} layout=${String(r.layoutCount).padEnd(5)} tareas=${String(r.taskDurationMs).padEnd(5)}ms (${r.mainThreadBusyPct}% del hilo) script=${r.scriptDurationMs}ms estilo=${r.recalcStyleMs}ms layout=${r.layoutMs}ms | animaciones en curso: ${r.runningAnimations.map((x) => `${x.name}[${x.props}]@${x.target}${x.inViewport ? '' : '(fuera de vista)'}`).join(', ') || 'ninguna'}`);
