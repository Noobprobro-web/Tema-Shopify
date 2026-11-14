#!/usr/bin/env node
// Medicion aproximada de Lighthouse movil contra una tienda Shopify protegida.
// Ver scripts/lighthouse-mobile.README.md. Sin dependencias nuevas: usa Playwright
// (ya instalado) y `npx --yes lighthouse@<version fijada>`.
//
// STOREFRONT_PASSWORD se lee SOLO del entorno. Nunca se imprime ni va en argv.

import { spawn } from 'node:child_process';
import { mkdtemp, rm, readFile, writeFile, mkdir } from 'node:fs/promises';
import { rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium } from 'playwright';

export const LIGHTHOUSE_VERSION = '13.6.0'; // publicada 2026-10-27 (>= 2 semanas); ver README
const ALLOWED_HOSTS = ['tema-qkqpke0j.myshopify.com', 'sartorial-theme-kvkzl39t.myshopify.com'];
const MIN_VALID_RUNS = 3;
const MAX_ATTEMPTS_PER_RUN = 3;
const MIN_GAP_MS = 1000;
const MAX_BACKOFF_MS = 120000;
const HANDLE_RE = /^[a-z0-9][a-z0-9_-]{0,254}$/i;
const PRESET = 'mobile';
const LIGHTHOUSE_TIMEOUT_MS = 180000;
const ALLOWED_ARGS = ['origin', 'theme', 'pages', 'runs', 'out'];
// Variables de entorno que ni Chromium ni el subproceso de Lighthouse deben heredar.
const SECRET_ENV = ['STOREFRONT_PASSWORD', 'SHOPIFY_CLI_THEME_TOKEN'];

// Estado de limpieza compartido con los manejadores de SIGINT/SIGTERM.
const state = { tmp: null, context: null, child: null, cleaning: false };

function envWithout(keys) {
  const env = { ...process.env };
  for (const k of keys) delete env[k];
  return env;
}
function killChild() {
  const pid = state.child?.pid;
  if (!pid) return;
  try { process.kill(-pid, 'SIGKILL'); } catch { try { process.kill(pid, 'SIGKILL'); } catch { /* ya terminado */ } }
}
// Playwright se lanza con handleSIGINT/handleSIGTERM desactivados: sin estos manejadores
// saldria sin pasar por `finally` y dejaria el perfil (con la BD Cookies) en disco.
async function onSignal(sig, code) {
  if (state.cleaning) return;
  state.cleaning = true;
  console.error(`Interrumpido (${sig}): cerrando navegador y borrando el perfil temporal.`);
  killChild();
  try { await Promise.race([state.context?.close(), sleep(5000)]); } catch { /* ignorar */ }
  if (state.tmp) { try { rmSync(state.tmp, { recursive: true, force: true }); } catch { /* ignorar */ } }
  process.exit(code);
}
process.on('SIGINT', () => { onSignal('SIGINT', 130); });
process.on('SIGTERM', () => { onSignal('SIGTERM', 143); });

class ExitError extends Error {
  constructor(message, code) { super(message); this.exitCode = code; }
}
// Lanza en vez de salir, para que el bloque finally borre el directorio temporal.
function fail(msg, code = 1) {
  throw new ExitError(msg, code);
}

function parseArgs(argv) {
  const out = { runs: 3 };
  for (const a of argv) {
    if (a === '--selftest') { out.selftest = true; continue; }
    const m = /^--([a-z]+)=(.*)$/.exec(a);
    // Lista cerrada. El mensaje nunca repite el argumento (podria llevar un secreto).
    if (!m || !ALLOWED_ARGS.includes(m[1])) fail(`argumento no reconocido (se omite su contenido); admitidos: ${ALLOWED_ARGS.map((k) => `--${k}`).join(', ')}`, 2);
    out[m[1]] = m[2];
  }
  return out;
}

function validateOrigin(origin, selftest) {
  let u;
  try { u = new URL(origin); } catch { fail('--origin no es una URL valida', 2); }
  if (selftest) {
    if (u.protocol !== 'http:' || u.hostname !== '127.0.0.1') fail('en --selftest el origen debe ser http://127.0.0.1:<puerto>', 2);
    return u.origin;
  }
  if (u.protocol !== 'https:' || !ALLOWED_HOSTS.includes(u.hostname) || u.port || u.pathname !== '/' || u.search || u.username) {
    fail(`--origin debe ser https://<dominio> con dominio en la allowlist: ${ALLOWED_HOSTS.join(', ')}`, 2);
  }
  return u.origin;
}

function parsePages(spec) {
  if (!spec) fail('falta --pages=home,collection:<handle>,product:<handle>', 2);
  return spec.split(',').map((raw) => {
    const parts = raw.trim().split(':');
    if (parts.length > 2) return fail(`pagina invalida en --pages (demasiados ":"): "${raw}"`, 2);
    const [kind, handle] = parts;
    if (kind === 'home' && !handle) return { kind, handle: null, path: '/' };
    if ((kind === 'collection' || kind === 'product') && handle && HANDLE_RE.test(handle)) {
      return { kind, handle, path: `/${kind === 'collection' ? 'collections' : 'products'}/${handle}` };
    }
    return fail(`pagina invalida en --pages: "${raw}"`, 2);
  });
}

function freePort() {
  return new Promise((res, rej) => {
    const s = createServer();
    s.once('error', rej);
    s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => res(port)); });
  });
}

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
};
const round = (n, d = 0) => { const f = 10 ** d; return Math.round(n * f) / f; };

function retryAfterMs(headerValue, attempt) {
  const secs = Number(headerValue);
  if (Number.isFinite(secs) && secs >= 0) return Math.min(secs * 1000, MAX_BACKOFF_MS);
  if (headerValue) {
    const t = Date.parse(headerValue);
    if (!Number.isNaN(t)) return Math.min(Math.max(t - Date.now(), 0), MAX_BACKOFF_MS);
  }
  return Math.min(2000 * 2 ** attempt, MAX_BACKOFF_MS);
}

// Quita query de preview, origen y cualquier rastro de secretos de un texto de log.
function scrub(text, secrets) {
  let t = String(text).replace(/https?:\/\/[^\s"']+/g, '<url>').replace(/preview_theme_id=\d+/g, 'preview_theme_id=<id>');
  for (const s of secrets) if (s) t = t.split(s).join('<redacted>');
  return t.slice(0, 600);
}

function runLighthouse({ url, port, outFile }) {
  return new Promise((resolveP) => {
    // --port: Lighthouse se conecta al Chromium ya autenticado (mismo perfil/cookies).
    // Preset movil por defecto (emulacion Moto G Power + throttling simulado); no se pasan flags de preset.
    const args = ['--yes', `lighthouse@${LIGHTHOUSE_VERSION}`, url, `--port=${port}`,
      '--only-categories=performance', '--output=json', `--output-path=${outFile}`, '--quiet'];
    // detached: grupo propio para poder matar npx y su arbol (timeout o senal).
    const child = spawn('npx', args, { stdio: ['ignore', 'ignore', 'pipe'], detached: true, env: envWithout(SECRET_ENV) });
    state.child = child;
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; killChild(); }, LIGHTHOUSE_TIMEOUT_MS);
    child.stderr.on('data', (d) => { if (stderr.length < 20000) stderr += d; });
    child.on('error', (e) => { clearTimeout(timer); resolveP({ code: -1, stderr: String(e.message) }); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (state.child === child) state.child = null;
      resolveP({ code, stderr: timedOut ? `timeout tras ${LIGHTHOUSE_TIMEOUT_MS / 1000}s` : stderr });
    });
  });
}

async function authenticate(context, origin, password) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await context.request.post(`${origin}/password`, {
      form: { form_type: 'storefront_password', utf8: '✓', password },
      maxRedirects: 0,
      failOnStatusCode: false,
    });
    if (res.status() === 429) { await sleep(retryAfterMs(res.headers()['retry-after'], attempt)); continue; }
    const loc = res.headers()['location'] || '';
    const cookies = await context.cookies(origin);
    const hasDigest = cookies.some((c) => c.name === 'storefront_digest');
    const redirectedBack = /\/password(\?|$)/.test(loc);
    if (res.status() >= 300 && res.status() < 400 && hasDigest && !redirectedBack) return;
    return fail('autenticacion fallida en /password (contrasena rechazada o respuesta inesperada)', 3);
  }
  return fail('autenticacion fallida: 429 persistente en /password', 3);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selftest = !!args.selftest;
  const origin = validateOrigin(args.origin, selftest);
  if (!/^\d+$/.test(args.theme || '')) fail('--theme debe ser un id numerico', 2);
  const pages = parsePages(args.pages);
  const runs = Number(args.runs);
  if (!Number.isInteger(runs) || runs < MIN_VALID_RUNS || runs > 10) fail(`--runs debe ser un entero entre ${MIN_VALID_RUNS} y 10`, 2);
  if (!args.out) fail('falta --out=<ruta del JSON resumido>', 2);
  const password = process.env.STOREFRONT_PASSWORD;
  if (!password) fail('STOREFRONT_PASSWORD no esta definida en el entorno', 2);
  const secrets = [password];

  process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
  const tmp = await mkdtemp(join(tmpdir(), 'lh-mobile-'));
  state.tmp = tmp;
  let context;
  let exitCode = 0;
  try {
    const port = await freePort();
    context = await chromium.launchPersistentContext(join(tmp, 'profile'), {
      headless: true,
      viewport: null, // no aplicar emulacion de Playwright a pestanas nuevas: la pone Lighthouse
      args: ['--no-sandbox', `--remote-debugging-port=${port}`, '--remote-debugging-address=127.0.0.1'],
      env: envWithout(SECRET_ENV), // Playwright pasaria process.env por defecto
      handleSIGINT: false,
      handleSIGTERM: false,
    });
    state.context = context;
    await authenticate(context, origin, password);
    console.log('Autenticacion OK (cookie de sesion solo en perfil temporal).');

    const results = [];
    let lhVersion = null;
    let first = true;
    for (const pg of pages) {
      const url = `${origin}${pg.path}?preview_theme_id=${args.theme}`;
      const label = pg.handle ? `${pg.kind}:${pg.handle}` : pg.kind;
      const valid = [];
      for (let i = 0; i < runs; i++) {
        let done = false;
        for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_RUN && !done; attempt++) {
          if (!first) await sleep(MIN_GAP_MS);
          first = false;
          // Preflight: respeta 429 y detecta cookie no aceptada (redireccion a /password).
          const pre = await context.request.get(url, { maxRedirects: 0, failOnStatusCode: false });
          const loc = pre.headers()['location'] || '';
          if (pre.status() === 429) {
            const wait = retryAfterMs(pre.headers()['retry-after'], attempt);
            console.log(`[${label}] 429, esperando ${Math.round(wait / 1000)}s`);
            await sleep(wait);
            continue;
          }
          if (/\/password(\?|$)/.test(loc)) fail(`[${label}] la tienda redirige a /password: sesion no valida`, 3);
          if (pre.status() >= 300 && pre.status() < 400) {
            // Una redireccion a otro origen haria medir una pagina que no es la solicitada: exit 4
            // (medicion invalida, no es un fallo de autenticacion).
            let target = null;
            try { target = loc ? new URL(loc, url).origin : null; } catch { /* Location invalida */ }
            // Location ausente (loc vacio) => target null => cuenta como otro origen.
            if (target !== origin) fail(`[${label}] el preflight redirige (HTTP ${pre.status()}) fuera del origen solicitado; medicion invalida`, 4);
          }
          if (pre.status() >= 400) { console.log(`[${label}] HTTP ${pre.status()} en preflight, reintento`); await sleep(2000 * 2 ** attempt); continue; }

          const outFile = join(tmp, `lh-${Date.now()}-${i}-${attempt}.json`);
          const r = await runLighthouse({ url, port, outFile });
          let lhr = null;
          try { lhr = JSON.parse(await readFile(outFile, 'utf8')); } catch { /* sin salida */ }
          const score = lhr?.categories?.performance?.score;
          let finalPath = '';
          let finalOrigin = '';
          try { const f = new URL(lhr.finalDisplayedUrl); finalPath = f.pathname; finalOrigin = f.origin; } catch { /* sin URL final */ }
          const errMsg = lhr?.runtimeError?.message || '';
          if (/429/.test(errMsg)) { await sleep(retryAfterMs(null, attempt)); continue; }
          if (!lhr || r.code !== 0 || lhr.runtimeError || typeof score !== 'number' || finalPath.startsWith('/password')) {
            console.log(`[${label}] ejecucion ${i + 1} intento ${attempt + 1} invalida: ${scrub(errMsg || r.stderr || 'sin salida', secrets)}`);
            continue;
          }
          if (finalOrigin !== origin) fail(`[${label}] Lighthouse termino en un origen distinto al solicitado; medicion invalida`, 4);
          if (lhr.configSettings?.formFactor !== 'mobile' || lhr.configSettings?.throttlingMethod !== 'simulate') {
            fail('Lighthouse no uso el perfil movil con throttling simulado; medicion descartada', 4);
          }
          const a = lhr.audits || {};
          const metrics = {
            lcpMs: a['largest-contentful-paint']?.numericValue,
            cls: a['cumulative-layout-shift']?.numericValue,
            tbtMs: a['total-blocking-time']?.numericValue,
            fcpMs: a['first-contentful-paint']?.numericValue,
            siMs: a['speed-index']?.numericValue,
          };
          if (!Object.values(metrics).every((v) => typeof v === 'number' && Number.isFinite(v))) {
            console.log(`[${label}] ejecucion ${i + 1} intento ${attempt + 1} invalida: metricas ausentes o no numericas`);
            continue;
          }
          lhVersion = lhr.lighthouseVersion;
          valid.push({ performance: Math.round(score * 100), ...metrics });
          console.log(`[${label}] ejecucion ${i + 1}/${runs}: performance ${valid.at(-1).performance}`);
          done = true;
        }
      }
      if (valid.length < MIN_VALID_RUNS) fail(`[${label}] solo ${valid.length} ejecuciones validas (minimo ${MIN_VALID_RUNS})`, 4);
      const med = (k) => median(valid.map((v) => v[k]));
      results.push({
        kind: pg.kind,
        handle: pg.handle,
        preset: PRESET,
        validRuns: valid.length,
        performanceScores: valid.map((v) => v.performance),
        median: {
          performance: round(med('performance'), 1),
          lcpMs: round(med('lcpMs')),
          cls: round(med('cls'), 3),
          tbtMs: round(med('tbtMs')),
          fcpMs: round(med('fcpMs')),
          siMs: round(med('siMs')),
        },
      });
    }

    const avg = results.reduce((s, r) => s + r.median.performance, 0) / results.length;
    const summary = {
      generatedAt: new Date().toISOString(),
      lighthouseVersion: lhVersion,
      pinnedLighthouse: LIGHTHOUSE_VERSION,
      note: 'Medicion aproximada desde contenedor (CPU/red distintas a Shopify); throttling simulado de Lighthouse.',
      pages: results,
      presets: { [PRESET]: { averagePerformanceOfMedians: round(avg, 1), minPerformanceOfMedians: Math.min(...results.map((r) => r.median.performance)) } },
    };
    const outPath = resolve(args.out);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(summary, null, 2) + '\n');
    console.log(`Resumen escrito en ${args.out}`);
    console.log(results.map((r) => `${r.handle ? `${r.kind}:${r.handle}` : r.kind}: mediana ${r.median.performance}`).join(' | '));
  } catch (e) {
    if (state.cleaning) await new Promise(() => {}); // el manejador de senal limpia y sale
    console.error(`ERROR: ${scrub(e?.message || e, secrets)}`);
    exitCode = e?.exitCode || 1;
  } finally {
    try { await context?.close(); } catch { /* ignorar */ }
    await rm(tmp, { recursive: true, force: true });
  }
  process.exit(exitCode);
}

main().catch((e) => {
  console.error(`ERROR: ${e?.message || e}`);
  process.exit(e?.exitCode || 1);
});
