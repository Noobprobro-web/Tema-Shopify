#!/usr/bin/env node
// Selftest sin tienda: servidor HTTP local sintetico que simula /password (302 + cookie)
// y las paginas /, /collections/x, /products/y. Usa una contrasena FICTICIA.
// Uso: node scripts/lighthouse-mobile.selftest.mjs

import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FAKE_PASSWORD = 'fake-selftest-password-NOT-REAL';
const FAKE_COOKIE = 'fake-digest-cookie-value-123';
const here = dirname(fileURLToPath(import.meta.url));

const html = (title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="Synthetic page"></head><body><main><h1>${title}</h1><p>Synthetic selftest content.</p></main></body></html>`;

let rateLimitedOnce = false;
// Modo del servidor sintetico para los casos de redireccion ('normal' | 'redirect-302' | 'redirect-noloc' | 'redirect-js').
let mode = 'normal';
let otherPort = 0;
// Segundo servidor (otro puerto) que sirve 200 sin autenticacion: destino de las redirecciones.
const other = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(html('Other')); });
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const authed = (req.headers.cookie || '').includes(`storefront_digest=${FAKE_COOKIE}`);
  if (url.pathname === '/password' && req.method === 'POST') {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      const ok = new URLSearchParams(body).get('password') === FAKE_PASSWORD;
      if (ok) { res.writeHead(302, { Location: '/', 'Set-Cookie': `storefront_digest=${FAKE_COOKIE}; Path=/; HttpOnly` }); }
      else { res.writeHead(302, { Location: '/password' }); }
      res.end();
    });
    return;
  }
  if (url.pathname === '/password') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(html('Password')); }
  if (!authed) { res.writeHead(302, { Location: '/password' }); return res.end(); }
  if (url.pathname === '/' && mode === 'redirect-302') { res.writeHead(302, { Location: `http://127.0.0.1:${otherPort}/` }); return res.end(); }
  if (url.pathname === '/' && mode === 'redirect-noloc') { res.writeHead(302); return res.end(); }
  if (url.pathname === '/' && mode === 'redirect-js') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(`<!doctype html><title>r</title><script>location.replace('http://127.0.0.1:${otherPort}/')</script>`); }
  // Un 429 unico con Retry-After para ejercitar el backoff.
  if (url.pathname === '/collections/x' && !rateLimitedOnce) {
    rateLimitedOnce = true;
    res.writeHead(429, { 'Retry-After': '1' });
    return res.end();
  }
  const titles = { '/': 'Home', '/collections/x': 'Collection', '/products/y': 'Product' };
  if (titles[url.pathname]) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(html(titles[url.pathname])); }
  res.writeHead(404); res.end();
});

function runScript(args, password, { signalAfterAuth } = {}) {
  return new Promise((resolve) => {
    let out = '';
    let sent = false;
    const c = spawn('node', [join(here, 'lighthouse-mobile.mjs'), ...args], { env: { ...process.env, STOREFRONT_PASSWORD: password } });
    c.stdout.on('data', (d) => {
      out += d; process.stdout.write(d);
      // Envia la senal con la medicion ya en curso (tras autenticar y lanzar Lighthouse).
      if (signalAfterAuth && !sent && /Autenticacion OK/.test(out)) { sent = true; setTimeout(() => c.kill(signalAfterAuth), 4000); }
    });
    c.stderr.on('data', (d) => { out += d; process.stderr.write(d); });
    c.on('close', (code) => resolve({ code, out }));
  });
}
const lhDirs = async () => (await readdir(tmpdir())).filter((n) => n.startsWith('lh-mobile-'));

const assert = (cond, msg) => { if (!cond) { console.error(`SELFTEST FAIL: ${msg}`); process.exitCode = 1; throw new Error(msg); } console.log(`ok - ${msg}`); };

await new Promise((r) => server.listen(0, '127.0.0.1', r));
await new Promise((r) => other.listen(0, '127.0.0.1', r));
otherPort = other.address().port;
const origin = `http://127.0.0.1:${server.address().port}`;
const dir = await mkdtemp(join(tmpdir(), 'lh-selftest-'));
try {
  const outFile = join(dir, 'summary.json');
  const ok = await runScript([`--origin=${origin}`, '--theme=123456789', '--pages=home,collection:x,product:y', '--runs=3', `--out=${outFile}`, '--selftest'], FAKE_PASSWORD);
  assert(ok.code === 0, 'exit 0 con credenciales ficticias correctas');
  const raw = await readFile(outFile, 'utf8');
  const json = JSON.parse(raw);
  assert(json.pages.length === 3, 'tres paginas en el resumen');
  assert(json.pages.every((p) => p.performanceScores.length === 3 && typeof p.median.performance === 'number' && p.median.lcpMs >= 0 && typeof p.median.cls === 'number' && p.median.tbtMs >= 0 && p.median.fcpMs > 0 && p.median.siMs >= 0), 'cada pagina con 3 puntuaciones y medianas Perf/LCP/CLS/TBT/FCP/SI');
  assert(json.presets.mobile && typeof json.presets.mobile.averagePerformanceOfMedians === 'number', 'promedio del preset mobile');
  assert(json.lighthouseVersion === '13.6.0', `version de Lighthouse ${json.lighthouseVersion}`);
  assert(!raw.includes(FAKE_PASSWORD) && !raw.includes(FAKE_COOKIE), 'el JSON no contiene la contrasena ni la cookie ficticias');
  assert(!/preview_theme_id|storefront_digest|127\.0\.0\.1|http/i.test(raw), 'el JSON no contiene URLs, query de preview ni nombre de cookie');
  assert(!ok.out.includes(FAKE_PASSWORD) && !ok.out.includes(FAKE_COOKIE), 'los logs no contienen la contrasena ni la cookie ficticias');
  assert(/429, esperando/.test(ok.out), 'se ejercito el backoff ante 429');

  const bad = await runScript([`--origin=${origin}`, '--theme=123456789', '--pages=home', '--runs=3', `--out=${join(dir, 'bad.json')}`, '--selftest'], 'wrong-fake-password');
  assert(bad.code === 3, 'exit 3 con autenticacion fallida');

  const notAllowed = await runScript(['--origin=https://example.myshopify.com', '--theme=1', '--pages=home', `--out=${join(dir, 'x.json')}`], FAKE_PASSWORD);
  assert(notAllowed.code === 2, 'origen fuera de la allowlist rechazado (exit 2)');

  // C2: claves de argumento fuera de la lista cerrada.
  const base = [`--origin=${origin}`, '--theme=1', '--pages=home', `--out=${join(dir, 'a.json')}`, '--selftest'];
  const pw = await runScript([...base, '--password=SECRETO-ARG'], FAKE_PASSWORD);
  assert(pw.code === 2 && !pw.out.includes('SECRETO-ARG'), '--password=... rechazado (exit 2) sin repetir el valor');
  const unk = await runScript([...base, '--foo=bar'], FAKE_PASSWORD);
  assert(unk.code === 2 && !unk.out.includes('bar'), 'clave desconocida rechazada (exit 2)');
  const pagesColon = await runScript([`--origin=${origin}`, '--theme=1', '--pages=collection:x:resto', `--out=${join(dir, 'b.json')}`, '--selftest'], FAKE_PASSWORD);
  assert(pagesColon.code === 2, '--pages con mas de un ":" rechazado (exit 2)');

  // C3: redireccion a otro origen invalida la ejecucion (exit 4).
  mode = 'redirect-302';
  const r302 = await runScript([...base.slice(0, 3), `--out=${join(dir, 'c.json')}`, '--selftest', '--runs=3'], FAKE_PASSWORD);
  assert(r302.code === 4, 'preflight 3xx hacia otro origen (otro puerto) -> exit 4');
  mode = 'redirect-noloc';
  const rnl = await runScript([...base.slice(0, 3), `--out=${join(dir, 'e.json')}`, '--selftest', '--runs=3'], FAKE_PASSWORD);
  assert(rnl.code === 4, 'preflight 302 sin Location -> exit 4 (cuenta como otro origen)');
  mode = 'redirect-js';
  const rjs = await runScript([...base.slice(0, 3), `--out=${join(dir, 'd.json')}`, '--selftest', '--runs=3'], FAKE_PASSWORD);
  assert(rjs.code === 4 && /origen distinto/.test(rjs.out), 'Lighthouse termina en otro origen (redireccion JS) -> exit 4');
  mode = 'normal';

  // C1: SIGINT / SIGTERM con una ejecucion en curso no dejan /tmp/lh-mobile-* ni procesos.
  for (const [sig, code] of [['SIGINT', 130], ['SIGTERM', 143]]) {
    const before = new Set(await lhDirs());
    const r = await runScript([...base.slice(0, 3), `--out=${join(dir, 'e.json')}`, '--selftest', '--runs=3'], FAKE_PASSWORD, { signalAfterAuth: sig });
    await new Promise((res) => setTimeout(res, 1500));
    const left = (await lhDirs()).filter((n) => !before.has(n));
    assert(r.code === code, `${sig} -> exit ${code} (fue ${r.code})`);
    assert(left.length === 0, `${sig}: no queda ningun directorio /tmp/lh-mobile-* (${left.join(',') || 'ninguno'})`);
    // Los procesos auxiliares de Chromium pueden tardar unos segundos en desaparecer.
    let ps = spawnSync('pgrep', ['-fa', 'lh-mobile-']);
    for (let i = 0; i < 10 && !ps.error && ps.status === 0; i++) { await new Promise((res) => setTimeout(res, 1000)); ps = spawnSync('pgrep', ['-fa', 'lh-mobile-']); }
    if (!ps.error && ps.status === 0) console.error(`procesos restantes: ${String(ps.stdout).replace(/\S*password\S*/gi, '').slice(0, 300)}`);
    assert(ps.error || ps.status === 1, `${sig}: sin procesos que usen un perfil lh-mobile-*`);
  }
  console.log('SELFTEST OK');
} finally {
  server.close();
  other.close();
  await rm(dir, { recursive: true, force: true });
}
