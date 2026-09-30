// Eje 3 (CLS): reproduce el desplazamiento de maquetación de la PDP con scroll real de rueda a dos
// velocidades, y repite la medición con assets/theme.js interceptado para validar el parche propuesto
// (rootMargin de ProductRecommendations de 300px a 200%). La intercepción es solo local al navegador
// de prueba: no se modifica ni se despliega nada en las tiendas.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const INIT = () => {
  window.__shifts = [];
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__shifts.push({ t: Math.round(e.startTime), v: e.value, y: Math.round(window.scrollY), src: (e.sources || []).slice(0, 2).map((s) => { const n = s.node; return n && n.nodeType === 1 ? n.localName + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '') : '(texto)'; }) });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
};
const cls = (shifts) => { let max = 0, cur = 0, start = 0, last = -Infinity; for (const s of shifts) { if (s.t - last > 1000 || s.t - start > 5000) { cur = 0; start = s.t; } cur += s.v; last = s.t; if (cur > max) max = cur; } return +max.toFixed(4); };

// 'rapido' se repite: el resultado depende de una carrera entre el scroll y la respuesta del servidor.
const SPEEDS = { lectura: { dy: 100, every: 100 }, moderado: { dy: 120, every: 50 }, rapido: { dy: 500, every: 60 }, 'rapido#2': { dy: 500, every: 60 }, 'rapido#3': { dy: 500, every: 60 } };
// Shopify sirve el JS minificado: la cadena puede venir con comillas dobles y sin espacios.
const MARGIN = /rootMargin:\s*["']0px 0px 300px 0px["']/;
const MODES = { original: null, 'parche-rootMargin-200%': 'rootMargin:"0px 0px 200% 0px"', 'parche-carga-inmediata': 'rootMargin:"0px 0px 100000px 0px"' };
const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '1440', width: 1440, height: 900 }]) {
    for (const mode of Object.keys(MODES)) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      await context.addInitScript(INIT);
      let patched = 0;
      if (mode !== 'original') {
        await context.route(/\/assets\/theme\.js/, async (route) => {
          const resp = await route.fetch();
          let body = await resp.text();
          patched = (body.match(new RegExp(MARGIN, 'g')) || []).length;
          body = body.replace(MARGIN, MODES[mode]);
          await route.fulfill({ response: resp, body });
        });
      }
      await unlock(context, store.url);
      const page = await context.newPage();
      // Sembrar "vistos recientemente" con otra ficha para cubrir el caso con la sección poblada.
      await page.goto(store.url + '/products/' + store.products[1], { waitUntil: 'load' });
      await page.waitForTimeout(1200);
      for (const [speed, cfg] of Object.entries(SPEEDS)) {
        const resp = await page.goto(store.url + '/products/' + store.products[0], { waitUntil: 'load', timeout: 60000 });
        if (resp.status() >= 400) { out.push({ store: name, vp: vp.n, mode, speed, error: resp.status() }); await page.waitForTimeout(30000); continue; }
        // El usuario empieza a desplazarse ~1 s después de ver la página.
        await page.waitForTimeout(1000);
        await page.mouse.move(vp.width / 2, vp.height / 2);
        const t0 = Date.now();
        let reqAt = null, respAt = null;
        const onReq = (r) => { if (r.url().includes('/recommendations/products')) reqAt = Date.now() - t0; };
        const onResp = (r) => { if (r.url().includes('/recommendations/products')) respAt = Date.now() - t0; };
        page.on('request', onReq); page.on('response', onResp);
        for (let i = 0; i < 400; i++) {
          await page.mouse.wheel(0, cfg.dy);
          await page.waitForTimeout(cfg.every);
          const atEnd = await page.evaluate(() => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4);
          if (atEnd && i > 5) break;
        }
        await page.waitForTimeout(2500);
        page.off('request', onReq); page.off('response', onResp);
        const shifts = await page.evaluate(() => window.__shifts);
        const state = await page.evaluate(() => ({ recs: (() => { const r = document.querySelector('product-recommendations'); return r ? { hidden: r.hidden, h: Math.round(r.getBoundingClientRect().height), cards: r.querySelectorAll('.product-card').length } : null; })(), rv: (() => { const r = document.querySelector('recently-viewed'); return r ? { hidden: r.hidden, h: Math.round(r.getBoundingClientRect().height) } : null; })(), docH: document.documentElement.scrollHeight }));
        out.push({ store: name, vp: vp.n, mode, patched, speed, pxPerSec: Math.round((cfg.dy * 1000) / cfg.every), cls: cls(shifts), recReqMs: reqAt, recRespMs: respAt, top: [...shifts].sort((a, b) => b.v - a.v).slice(0, 2).map((s) => ({ v: +s.v.toFixed(4), t: s.t, y: s.y, src: s.src })), ...state });
      }
      await context.close();
    }
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-04-cls-scroll' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) console.log(r.error ? `${r.store} ${r.vp} ${r.mode} ${r.speed} ERROR ${r.error}` : `${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.mode.padEnd(24)} ${r.speed.padEnd(9)} ${String(r.pxPerSec).padStart(5)}px/s CLS=${String(r.cls).padEnd(7)} recs(req@${r.recReqMs}ms resp@${r.recRespMs}ms h=${r.recs?.h} cards=${r.recs?.cards}) rv(h=${r.rv?.h} hidden=${r.rv?.hidden}) patched=${r.patched} top=${JSON.stringify(r.top)}`);
