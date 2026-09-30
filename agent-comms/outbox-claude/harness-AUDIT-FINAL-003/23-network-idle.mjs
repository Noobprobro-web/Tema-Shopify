// ¿Por qué la home de Atelier ya no alcanza "networkidle"? Registra las peticiones que siguen
// saliendo después del evento load durante 15 s, agrupadas por host y ruta.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const out = {};
const browser = await launch();
for (const name of (process.argv[2] ? [process.argv[2]] : Object.keys(STORES))) {
  const store = STORES[name];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  const reqs = [];
  let loaded = false;
  const t0 = Date.now();
  page.on('request', (r) => { if (loaded) { const u = new URL(r.url()); reqs.push({ t: Date.now() - t0, type: r.resourceType(), host: u.host, path: u.pathname.slice(0, 70), initiator: (() => { try { const f = r.frame(); const fu = f && f.url(); return fu && fu !== page.url() ? 'iframe:' + (new URL(fu).host || fu.slice(0, 20)) : 'page'; } catch (e) { return 'worker/otro'; } })() }); } });
  const resp = await page.goto(store.url + '/', { waitUntil: 'load' });
  loaded = true;
  const tLoad = Date.now() - t0;
  await page.waitForTimeout(15000);
  const byKey = {};
  for (const r of reqs) { const k = r.host + r.path.replace(/[0-9a-f]{8,}/g, '…') + ' [' + r.type + ', ' + r.initiator + ']'; byKey[k] = (byKey[k] || 0) + 1; }
  out[name] = { status: resp.status(), loadMs: tLoad, requestsAfterLoad: reqs.length, top: Object.entries(byKey).sort((a, b) => b[1] - a[1]).slice(0, 15), lastRequestAtMs: reqs.length ? reqs.at(-1).t : null, frames: page.frames().map((f) => f.url().split('?')[0].slice(0, 90)) };
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-23-network-idle.json', import.meta.url), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
