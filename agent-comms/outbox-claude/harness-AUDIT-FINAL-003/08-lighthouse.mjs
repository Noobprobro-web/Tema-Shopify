// Eje 3: Lighthouse 13 oficial (rendimiento + accesibilidad) en home, colección y producto, móvil y
// escritorio, por tienda. Es el criterio de la Theme Store (media >= 60 rendimiento, >= 90 accesibilidad).
// Las tiendas tienen contraseña: (1) un Chromium con perfil persistente la introduce por el formulario
// normal y se cierra; (2) para cada pasada se arranca ese mismo perfil con caché HTTP vacía y Lighthouse
// se conecta por el puerto de depuración con --disable-storage-reset (si no, borraría la sesión).
// Playwright NO queda conectado durante la medición (si lo está, la pestaña de Lighthouse no pinta).
// Los informes completos y el perfil quedan fuera del repositorio (tmp); aquí solo se guarda el resumen.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { chromium } from 'playwright';
import { STORES, unlock } from './lib.mjs';

const PORT = 9334;
const only = process.argv[2];
const TMP = path.join(os.tmpdir(), 'sartorial-audit-final-003', 'lighthouse');
fs.mkdirSync(TMP, { recursive: true });
const SUMMARY = new URL('./results-08-lighthouse' + (only ? '-' + only : '') + '.json', import.meta.url);
const CHROME = chromium.executablePath();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];

async function startChrome(profile, cacheDir) {
  const child = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, '--disk-cache-dir=' + cacheDir, '--no-first-run', '--no-default-browser-check', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { const ok = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.ok).catch(() => false); if (ok) return child; await sleep(250); }
  child.kill();
  throw new Error('Chromium no abrió el puerto de depuración');
}
async function stopChrome(child) { child.kill(); for (let i = 0; i < 40; i++) { const up = await fetch(`http://127.0.0.1:${PORT}/json/version`).then(() => true).catch(() => false); if (!up) return; await sleep(250); } }

for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const profile = path.join(TMP, 'profile-' + name);
  {
    const context = await chromium.launchPersistentContext(profile, { headless: true });
    await unlock(context, store.url);
    await context.close();
    await sleep(1500);
  }
  const pages = { home: '/', collection: '/collections/all', product: '/products/' + store.products[0] };
  for (const [kind, p] of Object.entries(pages)) {
    for (const form of ['mobile', 'desktop']) {
      const report = path.join(TMP, `${name}-${kind}-${form}.json`);
      const cacheDir = path.join(TMP, `cache-${name}-${kind}-${form}-${Date.now()}`);
      let rec = { store: name, page: kind, path: p, form };
      let chrome = null;
      try {
        chrome = await startChrome(profile, cacheDir);
        const cmd = `npx -y lighthouse@13 "${store.url + p}" --port=${PORT} --disable-storage-reset --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="${report}" --quiet --max-wait-for-load=60000${form === 'desktop' ? ' --preset=desktop' : ''}`;
        const r = spawnSync(cmd, { shell: true, encoding: 'utf8', timeout: 240000 });
        if (r.status !== 0) throw new Error('lighthouse salió con ' + r.status + ' ' + (r.signal || '') + ' ' + String(r.stderr || '').slice(-300));
        const lh = JSON.parse(fs.readFileSync(report, 'utf8'));
        const a = lh.audits;
        const num = (id) => (a[id] && typeof a[id].numericValue === 'number' ? a[id].numericValue : null);
        rec = { ...rec, lighthouse: lh.lighthouseVersion, finalUrl: (lh.finalDisplayedUrl || '').replace(store.url, ''), runtimeError: lh.runtimeError ? lh.runtimeError.code : null,
          performance: lh.categories.performance.score === null ? null : Math.round(lh.categories.performance.score * 100), accessibility: Math.round(lh.categories.accessibility.score * 100), bestPractices: Math.round(lh.categories['best-practices'].score * 100), seo: Math.round(lh.categories.seo.score * 100),
          fcp: Math.round(num('first-contentful-paint')), lcp: Math.round(num('largest-contentful-paint')), tbt: Math.round(num('total-blocking-time')), cls: +Number(num('cumulative-layout-shift')).toFixed(4), si: Math.round(num('speed-index')),
          lcpElement: (() => { const m = JSON.stringify(a['lcp-breakdown-insight']?.details || a['largest-contentful-paint-element']?.details || {}).match(/"snippet":"(.{0,160}?)(?<!\\)"/); return m ? m[1].replace(/\\"/g, '"').slice(0, 150) : null; })(),
          totalBytesKb: Math.round((num('total-byte-weight') || 0) / 1024),
          a11yFails: lh.categories.accessibility.auditRefs.map((ref) => a[ref.id]).filter((x) => x && x.score !== null && x.score < 1 && !['notApplicable', 'manual', 'informative'].includes(x.scoreDisplayMode)).map((x) => x.id),
          insightsFailing: Object.values(a).filter((x) => /-insight$/.test(x.id) && x.score !== null && x.score < 1).map((x) => x.id.replace('-insight', '')),
          bestPracticesFails: lh.categories['best-practices'].auditRefs.map((ref) => a[ref.id]).filter((x) => x && x.score !== null && x.score < 1 && !['notApplicable', 'manual', 'informative'].includes(x.scoreDisplayMode)).map((x) => x.id),
          seoFails: lh.categories.seo.auditRefs.map((ref) => a[ref.id]).filter((x) => x && x.score !== null && x.score < 1 && !['notApplicable', 'manual', 'informative'].includes(x.scoreDisplayMode)).map((x) => x.id),
          consoleErrors: (a['errors-in-console']?.details?.items || []).map((i) => String(i.description).slice(0, 110)),
          runWarnings: (lh.runWarnings || []).map((w) => w.slice(0, 140)),
        };
        if (/\/password/.test(lh.finalDisplayedUrl || '')) rec.invalid = 'la sesión no se conservó (acabó en /password)';
        if ((lh.runWarnings || []).some((w) => /429|status code/i.test(w)) || a['http-status-code']?.score === 0) rec.invalid = 'respuesta no 200 (posible 429)';
      } catch (e) {
        rec.error = String(e.message).slice(0, 400);
      } finally {
        if (chrome) await stopChrome(chrome);
        try { fs.rmSync(cacheDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 400 }); } catch (e) { /* Windows puede retener la caché unos instantes; es temporal y no afecta al resultado */ }
      }
      out.push(rec);
      fs.writeFileSync(SUMMARY, JSON.stringify(out, null, 1));
      console.log(rec.error ? `${name} ${kind} ${form} ERROR ${rec.error}` : `${name.padEnd(8)} ${kind.padEnd(10)} ${form.padEnd(7)} perf=${rec.performance} a11y=${rec.accessibility} bp=${rec.bestPractices} seo=${rec.seo} | FCP=${rec.fcp} LCP=${rec.lcp} TBT=${rec.tbt} CLS=${rec.cls} SI=${rec.si} | ${rec.totalBytesKb}KB | a11yFails=[${rec.a11yFails}] bpFails=[${rec.bestPracticesFails}] seoFails=[${rec.seoFails}] insights=[${rec.insightsFailing}] ${rec.invalid || ''} ${rec.finalUrl} ${rec.runWarnings.join(' / ')}`);
      await sleep(12000);
    }
  }
}
const ok = out.filter((r) => !r.error && !r.invalid && r.performance !== null);
for (const s of [...new Set(ok.map((r) => r.store))]) {
  const rows = ok.filter((r) => r.store === s);
  const avg = (k) => Math.round(rows.reduce((acc, r) => acc + r[k], 0) / rows.length);
  console.log(`MEDIA ${s}: rendimiento=${avg('performance')} accesibilidad=${avg('accessibility')} (n=${rows.length}; umbral Theme Store 60 / 90)`);
}
