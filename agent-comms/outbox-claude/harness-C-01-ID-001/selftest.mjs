#!/usr/bin/env node
// C-01 · prueba SINTETICA local de identity.mjs y measure.mjs. Sin tienda ni red:
// la identidad usa directorios simulados y un doble del CLI; la medicion usa el
// fixture de synthetic.mjs con el base.css de "antes" (258ca4f, base del lote sin
// C-01) y "despues" (e8f17e5, lote-c-impl = lote-e-claude).
// Uso: node selftest.mjs [--write-results]
import { execFile } from 'node:child_process';
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { HARNESS_DIR, resolveCommit, sha256 } from './lib.mjs';
import { buildFixture, serve } from './synthetic.mjs';

const run = promisify(execFile);
const BEFORE = resolveCommit('258ca4f');
const AFTER = resolveCommit('e8f17e5');
const WRITE = process.argv.includes('--write-results');
const tmp = mkdtempSync(path.join(os.tmpdir(), 'c01-selftest-'));
const checks = [];

async function node(script, args, env = {}) {
  const clean = { ...process.env };
  delete clean.SHOPIFY_FLAG_STORE;
  delete clean.SHOPIFY_CLI_THEME_TOKEN;
  try {
    const { stdout, stderr } = await run(process.execPath, [path.join(HARNESS_DIR, script), ...args], { env: { ...clean, ...env }, maxBuffer: 64 * 1024 * 1024 });
    return { code: 0, stdout, stderr };
  } catch (e) {
    return { code: e.code, stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

function check(name, ok, detail = '') {
  checks.push({ name, ok: Boolean(ok), detail });
  process.stdout.write(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` · ${detail}` : ''}\n`);
}

try {
  // ---------- Identidad ----------
  const src = path.join(tmp, 'pulled');
  const exp = async (commit, preset, id) => node('build-export.mjs', ['--commit', commit, '--preset', preset, '--out', path.join(src, id)]);
  await exp(BEFORE, 'Sartorial', '111');
  await exp(AFTER, 'Sartorial', '222');
  await exp(AFTER, 'Sartorial', '333');
  appendFileSync(path.join(src, '333', 'assets/base.css'), '\n/* deriva */\n');
  await exp(AFTER, 'Imprint', '444');
  // Lo que Shopify hace con una plantilla JSON guardada: comentario y otro formato.
  const tpl = path.join(src, '444', 'templates/collection.json');
  writeFileSync(tpl, `/*\n * auto-generated header\n */\n${JSON.stringify(JSON.parse(readFileSync(tpl, 'utf8')))}`);

  const sim = await node('identity.mjs', [
    '--pulled-dir', src, '--candidates', `${BEFORE},${AFTER}`, '--out', path.join(tmp, 'id-sim.json'),
    '--target', `111:${BEFORE}:Sartorial`, '--target', `222:${AFTER}:Sartorial`,
    '--target', `333:${AFTER}:Sartorial`, '--target', `444:${AFTER}:Imprint`, '--target', `222:${BEFORE}:Sartorial`,
  ]);
  const idSim = JSON.parse(readFileSync(path.join(tmp, 'id-sim.json'), 'utf8'));
  const byIdx = idSim.targets;
  check('identidad: antes exacto', byIdx[0].ok && byIdx[0].candidates.find((c) => c.commit === BEFORE).matches && !byIdx[0].candidates.find((c) => c.commit === AFTER).matches);
  check('identidad: despues exacto', byIdx[1].ok && byIdx[1].candidates.find((c) => c.commit === AFTER).matches);
  check('identidad: deriva en base.css detectada', !byIdx[2].ok && byIdx[2].files.some((f) => f.file === 'assets/base.css' && f.status === 'mismatch'));
  check('identidad: plantilla JSON reformateada aceptada como normalized', byIdx[3].ok && byIdx[3].files.some((f) => f.file === 'templates/collection.json' && f.status === 'normalized'));
  check('identidad: despues contra commit antes falla', !byIdx[4].ok && byIdx[4].files.some((f) => f.file === 'assets/base.css' && f.status === 'mismatch'));
  check('identidad: exit 1 si algun objetivo falla', sim.code === 1);

  const full = await node('identity.mjs', ['--pulled-dir', src, '--full', '--target', `111:${BEFORE}:Sartorial`, '--out', path.join(tmp, 'id-full.json')]);
  const idFull = JSON.parse(readFileSync(path.join(tmp, 'id-full.json'), 'utf8'));
  check('identidad --full: arbol completo exacto', full.code === 0 && idFull.targets[0].compared > 50 && idFull.targets[0].files.every((f) => f.status === "exact"), `${idFull.targets[0].compared} archivos`);
  rmSync(path.join(src, '111', 'snippets/price.liquid'));
  writeFileSync(path.join(src, '111', 'snippets/extra.liquid'), 'x');
  const fullBad = await node('identity.mjs', ['--pulled-dir', src, '--full', '--target', `111:${BEFORE}:Sartorial`, '--out', path.join(tmp, 'id-full-bad.json')]);
  const idFullBad = JSON.parse(readFileSync(path.join(tmp, 'id-full-bad.json'), 'utf8'));
  const st = (f) => idFullBad.targets[0].files.find((x) => x.file === f)?.status;
  check('identidad --full: falta y sobra detectados', fullBad.code === 1 && st('snippets/price.liquid') === 'missing-remote' && st('snippets/extra.liquid') === 'extra-remote');

  // Falla cerrado sin credenciales: no llama al CLI.
  const log = path.join(tmp, 'stub.log');
  const stub = path.join(HARNESS_DIR, 'selftest', 'stub-shopify.mjs');
  const closed = await node('identity.mjs', ['--target', `222:${AFTER}:Sartorial`], { SHOPIFY_CLI_BIN: stub, STUB_LOG: log, STUB_SOURCE: src });
  check('identidad: sin credenciales sale 2 y no invoca el CLI', closed.code === 2 && !existsSync(log) && /SHOPIFY_FLAG_STORE, SHOPIFY_CLI_THEME_TOKEN/.test(closed.stderr));
  const partial = await node('identity.mjs', ['--target', `222:${AFTER}:Sartorial`], { SHOPIFY_CLI_BIN: stub, STUB_LOG: log, STUB_SOURCE: src, SHOPIFY_FLAG_STORE: 'stub.example' });
  check('identidad: con una sola variable sale 2', partial.code === 2 && !existsSync(log) && /SHOPIFY_CLI_THEME_TOKEN/.test(partial.stderr));

  // Con el doble del CLI: el token nunca aparece en argv, salida ni informe.
  const SENTINEL = `selftest-sentinel-${process.pid}-token`;
  const env = { SHOPIFY_CLI_BIN: stub, STUB_LOG: log, STUB_SOURCE: src, STUB_UNPUBLISHED: '222,444', SHOPIFY_FLAG_STORE: 'stub.example', SHOPIFY_CLI_THEME_TOKEN: SENTINEL };
  const viaCli = await node('identity.mjs', ['--target', `222:${AFTER}:Sartorial`, '--target', `444:${AFTER}:Imprint`, '--out', path.join(tmp, 'id-cli.json')], env);
  const logText = readFileSync(log, 'utf8');
  const reportText = readFileSync(path.join(tmp, 'id-cli.json'), 'utf8');
  check('identidad via CLI: preflight + pull --only y exit 0', viaCli.code === 0 && /"list"/.test(logText) && /"--only","assets\/base.css"/.test(logText));
  check('identidad via CLI: sin token en argv, salida ni informe', ![logText, viaCli.stdout, viaCli.stderr, reportText].some((t) => t.includes(SENTINEL)));
  const live = await node('identity.mjs', ['--target', `1:${AFTER}:Sartorial`], env);
  check('identidad via CLI: tema no unpublished se rechaza antes del pull', live.code === 2 && !readFileSync(log, 'utf8').split('\n').some((l) => l.includes('"pull","--theme","1"')));

  // ---------- Medicion ----------
  const site = path.join(tmp, 'site');
  buildFixture(site, {
    before: { commit: BEFORE },
    after: { commit: AFTER },
    before2: { commit: BEFORE },
    tamper: { commit: AFTER, extraCss: '\n@media (min-width: 62rem) { .collection-main__body { gap: 4rem; } }\n' },
  });
  const { server, origin } = await serve(site);
  const presets = ['Sartorial', 'Imprint', 'Archive'];
  const cells = (b, a, q = '') => presets.flatMap((p) => [
    { preset: p, stage: 'before', themeId: '0', commit: b.commit, url: `${origin}/collections/${p.toLowerCase()}?stage=${b.stage}${q}` },
    { preset: p, stage: 'after', themeId: '0', commit: a.commit, url: `${origin}/collections/${p.toLowerCase()}?stage=${a.stage}${q}` },
  ]);
  const measure = async (name, plan) => {
    const planFile = path.join(tmp, `${name}.plan.json`);
    const out = path.join(tmp, `${name}.json`);
    writeFileSync(planFile, JSON.stringify(plan, null, 2));
    const r = await node('measure.mjs', ['--plan', planFile, '--out', out]);
    return { ...r, result: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null, out };
  };
  const B = { stage: 'before', commit: BEFORE };
  const A = { stage: 'after', commit: AFTER };
  try {
    const base = await measure('C01-SINTETICO-hide', { label: 'SINTETICO antes 258ca4f / despues e8f17e5, barra oculta', synthetic: true, previewBar: 'hide', cells: cells(B, A) });
    const mob = base.result.pairs.filter((p) => p.viewport === '390x844');
    const desk = base.result.pairs.filter((p) => p.viewport === '1280x800');
    check('medicion hide: 390 sube en los 3 presets', mob.every((p) => p.verdict === 'SUBE'), mob.map((p) => `${p.preset} ${p.deltaPx}px`).join(', '));
    check('medicion hide: 1280 sin cambios en los 3 presets', desk.every((p) => p.verdict === 'SIN_CAMBIOS'));
    check('medicion hide: CSS servido = commit y exit 0', base.code === 0 && base.result.rows.every((r) => r.syntheticCssIdentity === 'match'));

    const bar = await measure('C01-SINTETICO-measure', { label: 'SINTETICO con barra de preview simulada de 56 px medida', synthetic: true, previewBar: 'measure', cells: cells(B, A, '&previewbar=56') });
    check('medicion measure: barra medida 56 px y mismo veredicto', bar.code === 0 && bar.result.rows.every((r) => r.capture?.barHeight === 56 && r.usefulViewportHeight === r.capture.height - 56));

    const nul = await measure('C01-SINTETICO-null', { synthetic: true, previewBar: 'hide', cells: cells(B, { stage: 'before2', commit: BEFORE }) });
    check('control nulo: antes vs antes queda IGUAL_SIN_JUSTIFICAR (exit 1)', nul.code === 1 && nul.result.pairs.filter((p) => p.viewport === '390x844').every((p) => p.verdict === 'IGUAL_SIN_JUSTIFICAR'));

    const tam = await measure('C01-SINTETICO-tamper', { synthetic: true, previewBar: 'hide', cells: cells(B, { stage: 'tamper', commit: AFTER }) });
    // tamper sirve CSS distinto del commit: el script lo marca y el par queda INVALIDO.
    check('CSS servido distinto del commit invalida el par (exit 2)', tam.code === 2 && tam.result.rows.some((r) => r.syntheticCssIdentity === 'mismatch'));

    const nobar = await measure('C01-SINTETICO-nobar', { synthetic: true, previewBar: 'measure', cells: cells(B, A) });
    check('measure sin barra visible: celdas invalidas (exit 2)', nobar.code === 2 && nobar.result.pairs.every((p) => p.verdict === 'INVALIDO'));

    const noid = await measure('C01-store-sin-identidad', { synthetic: false, previewBar: 'hide', cells: cells(B, A) });
    check('modo tienda sin informe de identidad: no mide (exit 2)', noid.code === 2 && noid.result === null);

    // Deteccion de cambio de layout de escritorio: mismo CSS identificado con regla extra
    // de escritorio declarada como el "despues" de un commit sintetico propio.
    const tamperSha = sha256(readFileSync(path.join(site, 'tamper', 'assets', 'base.css')));
    const deskCells = cells(A, { stage: 'tamper', commit: AFTER }).map((c) => (c.stage === 'after' ? { ...c, expectedBaseCssSha256: tamperSha } : c));
    const tamDesk = await measure('C01-SINTETICO-desk', { synthetic: true, previewBar: 'hide', cells: deskCells });
    const deskPairs = tamDesk.result.pairs.filter((p) => p.viewport === '1280x800');
    check('cambio de layout solo en 1280 detectado (CAMBIO_LAYOUT, exit 1)', tamDesk.code === 1 && deskPairs.every((p) => p.verdict === 'CAMBIO_LAYOUT'), deskPairs.map((p) => `${p.preset}: ${Object.keys(p.diffs).join('/')}`).join('; '));

    if (WRITE) {
      const dir = path.join(HARNESS_DIR, 'results');
      mkdirSync(dir, { recursive: true });
      for (const r of [base, bar]) cpSync(r.out, path.join(dir, path.basename(r.out)));
    }
  } finally {
    server.close();
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const failed = checks.filter((c) => !c.ok);
if (WRITE) writeFileSync(path.join(HARNESS_DIR, 'results', 'selftest-summary.json'), `${JSON.stringify({ tag: 'SINTETICO', before: BEFORE, after: AFTER, checks }, null, 2)}\n`);
process.stdout.write(`${checks.length - failed.length}/${checks.length} comprobaciones\n`);
process.exit(failed.length ? 1 : 0);
