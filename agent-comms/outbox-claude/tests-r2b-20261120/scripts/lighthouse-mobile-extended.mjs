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
const ALLOWED_ARGS = ['origin', 'theme', 'themes', 'pages', 'runs', 'out'];
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
    if (kind === 'page' && handle && HANDLE_RE.test(handle)) return { kind, handle, path: `/pages/${handle}` };
    if (kind === 'search' && handle && /^[a-z0-9]+$/i.test(handle)) return { kind, handle, path: `/search?q=${handle}&` };
    return fail(`pagina invalida en --pages: "${raw}"`, 2);
  });
}

function basenameOut(o) { return o.split('/').pop().replace(/\.json$/, ''); }
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
      '--only-categories=performance,accessibility,best-practices,seo', '--output=json', `--output-path=${outFile}`, '--quiet'];
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

// Autentica como lo haria una persona y como lo hace el arnes que funciona: GET /password,
// se rellena el formulario REAL de la pagina (incluye authenticity_token) y se envia. La
// tienda real NO emite una cookie `storefront_digest` (usa _shopify_essential, etc.), asi que
// el exito se comprueba con lo observable: tras navegar a /?preview_theme_id=<id> no se vuelve
// a /password, Shopify.theme.id coincide con --theme y Shopify.theme.role === 'unpublished'.
async function authenticate(context, origin, password, themeId) {
  const page = await context.newPage();
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      const form = await page.goto(`${origin}/password`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (form?.status() === 429) { await sleep(retryAfterMs(form.headers()['retry-after'], attempt)); continue; }
      const field = page.locator('form[action$="/password"] input[type=password]').first();
      if (!form?.ok() || (await field.count()) !== 1) return fail('autenticacion fallida: /password no devolvio el formulario esperado', 3);
      await field.fill(password);
      const [submit] = await Promise.all([
        page.waitForResponse((r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/password', { timeout: 30000 }),
        field.press('Enter'),
      ]);
      if (submit.status() === 429) { await sleep(retryAfterMs(submit.headers()['retry-after'], attempt)); continue; }
      await page.waitForLoadState('domcontentloaded');
      const home = await page.goto(`${origin}/?preview_theme_id=${themeId}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (home?.status() === 429) { await sleep(retryAfterMs(home.headers()['retry-after'], attempt)); continue; }
      if (new URL(page.url()).pathname.startsWith('/password')) return fail('autenticacion fallida en /password (contrasena rechazada)', 3);
      const theme = await page.evaluate(() => ({ id: window.Shopify?.theme?.id == null ? null : String(window.Shopify.theme.id), role: typeof window.Shopify?.theme?.role === 'string' ? window.Shopify.theme.role : null }));
      if (theme.id !== String(themeId)) return fail('autenticacion OK pero Shopify.theme.id no coincide con --theme; medicion invalida', 3);
      if (theme.role !== 'unpublished') return fail('el tema indicado no es un tema no publicado (Shopify.theme.role); medicion rechazada', 3);
      return;
    }
    return fail('autenticacion fallida: 429 persistente en /password', 3);
  } catch (e) {
    if (e instanceof ExitError) throw e;
    return fail(`autenticacion fallida: ${scrub(String(e?.message || e).split('\n')[0], [password])}`, 3);
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selftest = !!args.selftest;
  const origin = validateOrigin(args.origin, selftest);
  // --themes=A:id,B:id activa el modo A/B intercalado (A B A B ...). Sin --themes, un solo tema (--theme).
  const themeList = args.themes
    ? args.themes.split(',').map((x) => { const [label, id] = x.split(':'); if (!/^[A-Za-z0-9_-]+$/.test(label || '') || !/^\d+$/.test(id || '')) fail('--themes invalido (etiqueta:id,etiqueta:id)', 2); return { label, id }; })
    : [{ label: 'T', id: args.theme }];
  if (!themeList.every((t) => /^\d+$/.test(t.id || ''))) fail('--theme debe ser un id numerico', 2);
  args.theme = themeList[0].id;
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
    await authenticate(context, origin, password, args.theme);
    console.log('Autenticacion OK (cookie de sesion solo en perfil temporal).');

    // Identidad de cada tema (Shopify.theme.id y role) antes de medir.
    for (const t of themeList.slice(1)) {
      const pg0 = await context.newPage();
      await sleep(MIN_GAP_MS);
      await pg0.goto(`${origin}/?preview_theme_id=${t.id}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const th0 = await pg0.evaluate(() => ({ id: String(window.Shopify?.theme?.id), role: window.Shopify?.theme?.role }));
      await pg0.close();
      if (th0.id !== String(t.id) || th0.role !== 'unpublished') fail(`identidad del tema ${t.label} no coincide: ${JSON.stringify(th0)}`, 3);
      console.log(`Identidad OK ${t.label}: ${th0.id} ${th0.role}`);
    }
    const results = [];
    let lhVersion = null;
    let first = true;
    const rawDir = join(dirname(resolve(args.out)), 'raw');
    await mkdir(rawDir, { recursive: true });
    for (const pg of pages) {
      const label = pg.handle ? `${pg.kind}:${pg.handle}` : pg.kind;
      const valid = Object.fromEntries(themeList.map((t) => [t.label, []]));
      for (let i = 0; i < runs; i++) {
        for (const th of themeList) { // A B A B ...: misma ronda, mismo minuto
          const url = `${origin}${pg.path}${pg.kind === 'search' ? '' : '?'}preview_theme_id=${th.id}`;
          let done = false;
          for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_RUN && !done; attempt++) {
            if (!first) await sleep(MIN_GAP_MS);
            first = false;
            const pre = await context.request.get(url, { maxRedirects: 0, failOnStatusCode: false });
            const loc = pre.headers()['location'] || '';
            if (pre.status() === 429) { const wait = retryAfterMs(pre.headers()['retry-after'], attempt); console.log(`[${label}/${th.label}] 429, esperando ${Math.round(wait / 1000)}s`); await sleep(wait); continue; }
            if (/\/password(\?|$)/.test(loc)) fail(`[${label}] la tienda redirige a /password: sesion no valida`, 3);
            if (pre.status() >= 300 && pre.status() < 400) {
              let target = null;
              try { target = loc ? new URL(loc, url).origin : null; } catch { /* Location invalida */ }
              if (target !== origin) fail(`[${label}] el preflight redirige (HTTP ${pre.status()}) fuera del origen solicitado; medicion invalida`, 4);
            }
            if (pre.status() >= 400) { console.log(`[${label}/${th.label}] HTTP ${pre.status()} en preflight, reintento`); await sleep(2000 * 2 ** attempt); continue; }
            const outFile = join(tmp, `lh-${Date.now()}-${i}-${attempt}.json`);
            const r = await runLighthouse({ url, port, outFile });
            let lhr = null;
            try { lhr = JSON.parse(await readFile(outFile, 'utf8')); } catch { /* sin salida */ }
            const score = lhr?.categories?.performance?.score;
            let finalPath = ''; let finalOrigin = '';
            try { const f = new URL(lhr.finalDisplayedUrl); finalPath = f.pathname; finalOrigin = f.origin; } catch { /* sin URL final */ }
            const errMsg = lhr?.runtimeError?.message || '';
            if (/429/.test(errMsg)) { await sleep(retryAfterMs(null, attempt)); continue; }
            if (!lhr || r.code !== 0 || lhr.runtimeError || typeof score !== 'number' || finalPath.startsWith('/password')) { console.log(`[${label}/${th.label}] ejecucion ${i + 1} intento ${attempt + 1} invalida: ${scrub(errMsg || r.stderr || 'sin salida', secrets)}`); continue; }
            if (finalOrigin !== origin) fail(`[${label}] Lighthouse termino en un origen distinto al solicitado; medicion invalida`, 4);
            if (lhr.configSettings?.formFactor !== 'mobile' || lhr.configSettings?.throttlingMethod !== 'simulate') fail('Lighthouse no uso el perfil movil con throttling simulado; medicion descartada', 4);
            const a = lhr.audits || {};
            const nr = (a['network-requests']?.details?.items || []);
            const doc = nr.find((x) => x.resourceType === 'Document') || {};
            const tj = nr.find((x) => /\/assets\/theme\.js(\?|$)/.test(x.url)) || {};
            const boot = (a['bootup-time']?.details?.items || []);
            const tjBoot = boot.find((x) => /\/assets\/theme\.js(\?|$)/.test(x.url)) || {};
            const rec = {
              theme: th.label, themeId: th.id, page: label, pass: i + 1,
              performance: Math.round(score * 100),
              accessibility: Math.round((lhr.categories.accessibility?.score ?? NaN) * 100),
              bestPractices: Math.round((lhr.categories['best-practices']?.score ?? NaN) * 100),
              seo: Math.round((lhr.categories.seo?.score ?? NaN) * 100),
              lcpMs: a['largest-contentful-paint']?.numericValue, cls: a['cumulative-layout-shift']?.numericValue,
              tbtMs: a['total-blocking-time']?.numericValue, fcpMs: a['first-contentful-paint']?.numericValue, siMs: a['speed-index']?.numericValue,
              docTransferSize: doc.transferSize, docResourceSize: doc.resourceSize,
              themeJsTransferSize: tj.transferSize, themeJsBootup: { total: tjBoot.total, scripting: tjBoot.scripting, parse: tjBoot.scriptParseCompile },
              mainthread: (a['mainthread-work-breakdown']?.details?.items || []).map((x) => ({ group: x.group, duration: x.duration })),
              bootup: boot.map((x) => ({ url: String(x.url).replace(/\?.*$/, '').slice(0, 160), total: x.total, scripting: x.scripting, parse: x.scriptParseCompile })),
              longTasks: (a['long-tasks']?.details?.items || []).map((x) => ({ url: String(x.url).replace(/\?.*$/, '').slice(0, 160), duration: x.duration, start: x.startTime })),
              network: nr.map((x) => ({ url: String(x.url).replace(/\?.*$/, '').slice(0, 200), transferSize: x.transferSize, resourceSize: x.resourceSize, type: x.resourceType })),
            };
            if (![rec.tbtMs, rec.lcpMs, rec.cls].every((v) => Number.isFinite(v))) { console.log(`[${label}/${th.label}] ejecucion ${i + 1} invalida: metricas ausentes`); continue; }
            lhVersion = lhr.lighthouseVersion;
            await writeFile(join(rawDir, `${th.label}-${label.replace(/[^a-z0-9_-]/gi, '_')}-${i + 1}.json`), JSON.stringify(rec));
            valid[th.label].push(rec);
            console.log(`[${label}/${th.label}] pasada ${i + 1}/${runs}: perf ${rec.performance} TBT ${Math.round(rec.tbtMs)} doc ${rec.docTransferSize}`);
            done = true;
          }
        }
      }
      for (const th of themeList) {
        const v = valid[th.label];
        if (v.length < MIN_VALID_RUNS) fail(`[${label}/${th.label}] solo ${v.length} ejecuciones validas (minimo ${MIN_VALID_RUNS})`, 4);
        const med = (k) => median(v.map((x) => x[k]));
        results.push({
          kind: pg.kind, handle: pg.handle, theme: th.label, themeId: th.id, preset: PRESET, validRuns: v.length,
          performanceScores: v.map((x) => x.performance), tbtMsRuns: v.map((x) => Math.round(x.tbtMs)),
          median: { performance: round(med('performance'), 1), accessibility: round(med('accessibility'), 1), bestPractices: round(med('bestPractices'), 1), seo: round(med('seo'), 1), lcpMs: round(med('lcpMs')), cls: round(med('cls'), 3), tbtMs: round(med('tbtMs')), fcpMs: round(med('fcpMs')), siMs: round(med('siMs')), docTransferSize: round(med('docTransferSize')), themeJsTransferSize: round(med('themeJsTransferSize')), themeJsBootupTotalMs: round(median(v.map((x) => x.themeJsBootup.total ?? 0)), 1), themeJsBootupScriptingMs: round(median(v.map((x) => x.themeJsBootup.scripting ?? 0)), 1) },
        });
      }
    }

    const avg = results.reduce((s, r) => s + r.median.performance, 0) / results.length; // media de todos los temas medidos
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
    console.log(results.map((r) => `${r.theme} ${r.handle ? `${r.kind}:${r.handle}` : r.kind}: mediana ${r.median.performance} TBT ${r.median.tbtMs}`).join(' | '));
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
