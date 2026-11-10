#!/usr/bin/env node
// C-01 · identidad de previews. Baja archivos de cada tema no publicado con
// `shopify theme pull` y compara el SHA-256 de cada uno con el commit esperado
// (mas el overlay del preset). No usa el hash del asset servido: Shopify puede
// transformarlo al servirlo; el pull devuelve el archivo almacenado.
//
// Uso:
//   node identity.mjs --target <themeId>:<commit>:<preset> [--target ...]
//        [--full] [--paths a,b] [--candidates sha1,sha2] [--out report.json]
//        [--pulled-dir <dir>]     # simulacion: <dir>/<themeId>/ ya contiene el pull
//
// Credenciales solo por entorno, leidas por el propio CLI:
//   SHOPIFY_FLAG_STORE         dominio de la tienda
//   SHOPIFY_CLI_THEME_TOKEN    contrasena de Theme Access
// Si falta alguna (y no hay --pulled-dir) sale con codigo 2 sin tocar la red.
// Nunca imprime valores ni pasa credenciales por argv. Solo lectura: no hay
// push, publish ni delete en este script.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  C01_PATHS, REPO, THEME_DIRS, compareBytes, expectedTheme, presetKey, resolveCommit, sha256, sha256File,
} from './lib.mjs';

const SELF = fileURLToPath(import.meta.url);
const REQUIRED_ENV = ['SHOPIFY_FLAG_STORE', 'SHOPIFY_CLI_THEME_TOKEN'];

function fail(code, message) {
  process.stderr.write(`identity: ${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const opts = { targets: [], full: false, paths: null, candidates: [], out: null, pulledDir: null, keep: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) fail(2, `falta valor para ${arg}`);
      i += 1;
      return value;
    };
    if (arg === '--target') {
      const [themeId, commit, preset] = next().split(':');
      if (!/^\d+$/.test(themeId || '') || !commit || !preset) fail(2, '--target espera <themeId>:<commit>:<preset>');
      opts.targets.push({ themeId, ref: commit, preset: presetKey(preset) });
    } else if (arg === '--full') opts.full = true;
    else if (arg === '--paths') opts.paths = next().split(',').filter(Boolean);
    else if (arg === '--candidates') opts.candidates = next().split(',').filter(Boolean);
    else if (arg === '--out') opts.out = path.resolve(next());
    else if (arg === '--pulled-dir') opts.pulledDir = path.resolve(next());
    else if (arg === '--keep-pull') opts.keep = true;
    else if (arg === '--help' || arg === '-h') {
      process.stdout.write(readFileSync(SELF, 'utf8').split('\n').filter((l) => l.startsWith('//')).join('\n') + '\n');
      process.exit(0);
    } else fail(2, `argumento desconocido: ${arg}`);
  }
  if (opts.targets.length === 0) fail(2, 'indica al menos un --target');
  if (opts.full && opts.paths) fail(2, '--full y --paths son excluyentes');
  if (opts.paths) {
    for (const p of opts.paths) {
      if (p.includes('..') || path.isAbsolute(p) || !THEME_DIRS.includes(p.split('/')[0])) fail(2, `ruta fuera del tema: ${p}`);
    }
  }
  return opts;
}

function cliCommand() {
  if (process.env.SHOPIFY_CLI_BIN) return process.env.SHOPIFY_CLI_BIN;
  const local = path.join(REPO, 'node_modules', '.bin', process.platform === 'win32' ? 'shopify.cmd' : 'shopify');
  return existsSync(local) ? local : 'shopify';
}

// Ejecuta el CLI sin eco. Devuelve solo codigo y stdout (para el JSON de theme list);
// stderr se descarta para no reflejar nada del entorno en el informe.
function runCli(args) {
  const bin = cliCommand();
  const viaNode = /\.(c|m)?js$/.test(bin);
  const result = spawnSync(viaNode ? process.execPath : bin, viaNode ? [bin, ...args] : args, {
    env: { ...process.env, SHOPIFY_CLI_NO_ANALYTICS: '1', NO_COLOR: '1' },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: result.error ? -1 : result.status, stdout: result.stdout || '' };
}

function preflight(themeIds) {
  const { status, stdout } = runCli(['theme', 'list', '--role', 'unpublished', '--json', '--no-color']);
  if (status !== 0) fail(2, `theme list devolvio ${status}; se detiene antes de cualquier pull`);
  let list;
  try {
    list = JSON.parse(stdout.slice(stdout.indexOf('[')));
  } catch {
    fail(2, 'theme list no devolvio JSON interpretable');
  }
  const unpublished = new Set(list.filter((t) => t.role === 'unpublished').map((t) => String(t.id)));
  for (const id of themeIds) {
    if (!unpublished.has(id)) fail(2, `el tema ${id} no figura como unpublished; no se baja nada`);
  }
  return [...unpublished].filter((id) => themeIds.includes(id));
}

function pullTheme(themeId, paths, dest) {
  const args = ['theme', 'pull', '--theme', themeId, '--path', dest, '--no-color'];
  if (paths) for (const p of paths) args.push('--only', p);
  const { status } = runCli(args);
  if (status !== 0) fail(1, `theme pull del tema ${themeId} devolvio ${status}`);
}

function walk(dir, base = dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}

function compareTarget(dir, expected, paths) {
  const remote = new Set(walk(dir).filter((f) => THEME_DIRS.includes(f.split('/')[0])));
  const scope = paths ?? [...new Set([...expected.keys(), ...remote])].sort();
  const files = [];
  for (const file of scope) {
    const want = expected.get(file);
    const has = remote.has(file);
    if (!want && !has) {
      files.push({ file, status: 'absent-both' });
      continue;
    }
    if (!want) {
      files.push({ file, status: 'extra-remote', remoteSha256: sha256File(path.join(dir, file)) });
      continue;
    }
    if (!has) {
      files.push({ file, status: 'missing-remote', expectedSha256: sha256(want.buf), source: want.source });
      continue;
    }
    const actual = readFileSync(path.join(dir, file));
    files.push({
      file,
      status: compareBytes(file, want.buf, actual),
      expectedSha256: sha256(want.buf),
      remoteSha256: sha256(actual),
      source: want.source,
    });
  }
  const bad = files.filter((f) => !['exact', 'normalized', 'absent-both'].includes(f.status));
  return { ok: bad.length === 0, compared: files.length, failures: bad.length, files };
}

const opts = parseArgs(process.argv.slice(2));
const simulated = Boolean(opts.pulledDir);
if (!simulated) {
  const missing = REQUIRED_ENV.filter((name) => !process.env[name] || !process.env[name].trim());
  if (missing.length) fail(2, `faltan variables de entorno: ${missing.join(', ')}. No se ejecuta nada`);
}

const paths = opts.full ? null : (opts.paths ?? C01_PATHS);
const report = {
  id: 'C-01-ID',
  mode: simulated ? 'simulated' : 'store',
  scope: opts.full ? 'full' : 'paths',
  script: { file: path.relative(REPO, SELF), sha256: sha256File(SELF) },
  startedAt: new Date().toISOString(),
  preflightUnpublished: null,
  targets: [],
};

if (!simulated) report.preflightUnpublished = preflight(opts.targets.map((t) => t.themeId));

const tmpRoot = simulated ? null : mkdtempSync(path.join(os.tmpdir(), 'c01-pull-'));
try {
  for (const target of opts.targets) {
    const commit = resolveCommit(target.ref);
    const dir = simulated ? path.join(opts.pulledDir, target.themeId) : path.join(tmpRoot, target.themeId);
    if (simulated && !existsSync(dir)) fail(2, `simulacion sin directorio para ${target.themeId}`);
    if (!simulated) pullTheme(target.themeId, paths, dir);
    const result = compareTarget(dir, expectedTheme(commit, target.preset), paths);
    const candidates = [];
    for (const ref of opts.candidates) {
      const c = resolveCommit(ref);
      candidates.push({ commit: c, matches: compareTarget(dir, expectedTheme(c, target.preset), paths).ok });
    }
    report.targets.push({ themeId: target.themeId, preset: target.preset, expectedCommit: commit, ...result, candidates });
  }
} finally {
  if (tmpRoot && !opts.keep) rmSync(tmpRoot, { recursive: true, force: true });
}

report.finishedAt = new Date().toISOString();
report.ok = report.targets.every((t) => t.ok);
const json = `${JSON.stringify(report, null, 2)}\n`;
if (opts.out) writeFileSync(opts.out, json);
for (const t of report.targets) {
  const cand = t.candidates.filter((c) => c.matches).map((c) => c.commit.slice(0, 7)).join(',') || '-';
  process.stdout.write(`${t.ok ? 'OK  ' : 'FAIL'} theme=${t.themeId} preset=${t.preset} commit=${t.expectedCommit.slice(0, 7)} compared=${t.compared} failures=${t.failures} candidates=${cand}\n`);
  for (const f of t.files.filter((x) => !['exact', 'normalized', 'absent-both'].includes(x.status))) {
    process.stdout.write(`     ${f.status} ${f.file}\n`);
  }
}
if (!opts.out) process.stdout.write(json);
process.exit(report.ok ? 0 : 1);

