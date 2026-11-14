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
import { HARNESS_DIR, compareBytes, resolveCommit, sha256 } from './lib.mjs';
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
  delete clean.STOREFRONT_PASSWORD;
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
  // ---------- C1: comparacion de binarios byte a byte ----------
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x80, 0x10]);
  const pngMod = Buffer.from(png); pngMod[9] = 0xff;
  const pngCrlf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0a, 0x1a, 0x0a, 0x00, 0x80, 0x10]);
  check('C1 binario identico: exact', compareBytes('assets/logo.png', png, Buffer.from(png)) === 'exact');
  check('C1 binario modificado (0x80 vs 0xff): mismatch', compareBytes('assets/logo.png', png, pngMod) === 'mismatch');
  check('C1 woff2 modificado: mismatch', compareBytes('assets/font.woff2', Buffer.from([0x77, 0x4f, 0x46, 0x32, 0xc3]), Buffer.from([0x77, 0x4f, 0x46, 0x32, 0xfe])) === 'mismatch');
  check('C1 binario sin CRLF no se normaliza: mismatch', compareBytes('assets/logo.png', png, pngCrlf) === 'mismatch');
  check('C1 texto con CRLF: normalized', compareBytes('snippets/a.liquid', Buffer.from('a\nb\n'), Buffer.from('a\r\nb\r\n')) === 'normalized');
  check('C1 texto con bytes no UTF-8 distintos: mismatch', compareBytes('assets/a.css', Buffer.from([0x61, 0x80]), Buffer.from([0x61, 0xff])) === 'mismatch');
  check('C1 JSON reformateado solo en .json: normalized vs mismatch', compareBytes('templates/a.json', Buffer.from('{"a":1,"b":2}'), Buffer.from('{\n  "b": 2,\n  "a": 1\n}')) === 'normalized'
    && compareBytes('snippets/a.liquid', Buffer.from('{"a":1,"b":2}'), Buffer.from('{\n  "b": 2,\n  "a": 1\n}')) === 'mismatch');

  // ---------- Limpieza: candidatos a borrar (cleanup-check.mjs) ----------
  {
    const cdir = path.join(tmp, 'cleanup');
    mkdirSync(cdir, { recursive: true });
    const existing = [
      { id: 190232297715, name: 'Preview Sartorial', role: 'unpublished' },
      { id: 190232330483, name: 'Preview Imprint', role: 'unpublished' },
      { id: 190232363251, name: 'Preview Archive', role: 'unpublished' },
      { id: 100, name: 'Live', role: 'live' },
      { id: 101, name: 'C01 serial Archive', role: 'unpublished' },
    ];
    writeFileSync(path.join(cdir, 'list-0-sartorial.json'), JSON.stringify(existing));
    writeFileSync(path.join(cdir, 'list-0-imprint.json'), JSON.stringify([...existing, { id: 201, name: 'C01 serial Sartorial', role: 'unpublished' }]));
    writeFileSync(path.join(cdir, 'list-final.json'), JSON.stringify([...existing,
      { id: 201, name: 'C01 serial Sartorial', role: 'unpublished' },
      { id: 202, name: 'C01 serial Imprint', role: 'unpublished' },
      { id: 300, name: 'C01 serial Imprint', role: 'main' }]));
    const ledgerLines = (entries) => writeFileSync(path.join(cdir, 'ledger.jsonl'), entries.map((e) => JSON.stringify(e)).join('\n'));
    ledgerLines([{ preset: 'Sartorial', name: 'C01 serial Sartorial', id: '201' }, { preset: 'Imprint', name: 'C01 serial Imprint', id: '202' }]);
    const good = await node('cleanup-check.mjs', ['--dir', cdir]);
    check('limpieza: temas creados por el procedimiento son borrables (exit 0)', good.code === 0 && /BORRABLE\s+201/.test(good.stdout) && /BORRABLE\s+202/.test(good.stdout));
    ledgerLines([
      { preset: 'Sartorial', name: 'C01 serial Sartorial', id: '190232297715' },
      { preset: 'Imprint', name: 'C01 serial Imprint', id: '300' },
      { preset: 'Imprint', name: 'C01 serial Sartorial', id: '201' },
      { preset: 'Sartorial', name: 'C01 serial Archive', id: '101' },
      { preset: 'Archive', name: 'C01 serial Archive', id: '101' },
    ]);
    const bad = await node('cleanup-check.mjs', ['--dir', cdir]);
    const line = (id, re) => bad.stdout.split('\n').some((l) => l.startsWith('NO_BORRAR') && l.includes(` ${id} `) && re.test(l));
    check('limpieza: exclusion fija, rol main, ID previo al push y lista previa ausente no se borran (exit 1)', bad.code === 1 && !/BORRABLE/.test(bad.stdout)
      && line('190232297715', /exclusion/) && line('300', /main/) && line('201', /ya existia/) && line('101', /ya existia/) && line('101', /falta la lista previa/));
  }

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

    // ---------- C2/C3/C4/C5: modo tienda contra el fixture ----------
    // Informes de identidad de prueba (forma de identity.mjs en modo tienda).
    const IDS = { Sartorial: '501', Imprint: '502', Archive: '503' };
    const fakeIdentity = (name, scope, stage, startedAt) => {
      const file = path.join(tmp, name);
      const commit = stage === 'before' ? BEFORE : AFTER;
      writeFileSync(file, JSON.stringify({ id: 'C-01-ID', mode: 'store', scope, startedAt, targets: presets.map((p) => ({ themeId: IDS[p], preset: p, expectedCommit: commit, ok: true })) }));
      return name;
    };
    const storeCells = (q = {}) => presets.flatMap((p) => ['before', 'after'].map((stage) => {
      const u = new URL(`${q.origin ?? origin}/collections/${p.toLowerCase()}`);
      u.searchParams.set('stage', stage);
      u.searchParams.set('preview_theme_id', q.urlThemeId ?? IDS[p]);
      for (const [k, v] of Object.entries(q.extra ?? {})) u.searchParams.set(k, v);
      return { preset: p, stage, themeId: IDS[p], commit: stage === 'before' ? BEFORE : AFTER, url: u.href };
    }));
    const runStage = async (name, plan, stage, extraArgs = [], env = {}) => {
      const planFile = path.join(tmp, `${name}.plan.json`);
      const out = path.join(tmp, `${name}.${stage}.json`);
      if (!existsSync(planFile)) writeFileSync(planFile, JSON.stringify(plan, null, 2));
      const r = await node('measure.mjs', ['--plan', planFile, '--stage', stage, ...extraArgs, '--out', out], env);
      return { ...r, result: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null, out };
    };
    const t0 = new Date(Date.now() - 60000).toISOString();

    // C2: informe de identidad sin --full no vale.
    const paths = await runStage('c2-paths', { synthetic: false, previewBar: 'hide', identityReport: { before: fakeIdentity('id-paths.json', 'paths', 'before', t0) }, cells: storeCells() }, 'before');
    check('C2 informe sin --full: no mide (exit 2)', paths.code === 2 && paths.result === null && /no es --full/.test(paths.stderr));

    // C5 + C3: serie sobre el mismo tema: antes, (push), identidad posterior, despues.
    const serialPlan = { label: 'tienda simulada en serie', synthetic: false, previewBar: 'hide', identityReport: { before: fakeIdentity('id-before.json', 'full', 'before', t0), after: 'id-after.json' }, cells: storeCells() };
    const sb = await runStage('serial', serialPlan, 'before');
    check('C3 tema servido = themeId en cada fila del antes', sb.code === 0 && sb.result.rows.length === 6 && sb.result.rows.every((r, i) => r.servedThemeId === r.themeId && !r.error), sb.result?.rows.map((r) => r.servedThemeId).join(','));
    const stale = await runStage('serial', serialPlan, 'after', ['--before', sb.out]);
    check('C5 sin informe del despues no mide (exit 2)', stale.code === 2 && stale.result === null);
    fakeIdentity('id-after.json', 'full', 'after', t0);
    const old = await runStage('serial', serialPlan, 'after', ['--before', sb.out]);
    check('C2/C5 informe del despues anterior a la medicion del antes: no mide (exit 2)', old.code === 2 && /no es posterior/.test(old.stderr));
    fakeIdentity('id-after.json', 'full', 'after', new Date(Date.now() + 1000).toISOString());
    const sa = await runStage('serial', serialPlan, 'after', ['--before', sb.out]);
    const sMob = sa.result?.pairs.filter((p) => p.viewport === '390x844') ?? [];
    check('C5 serie mismo tema: mismos deltas que la medicion de referencia y exit 0', sa.code === 0 && sa.result.serial && sa.result.pairs.every((p) => p.beforeTheme === p.afterTheme)
      && sMob.every((p) => p.deltaPx === mob.find((x) => x.preset === p.preset).deltaPx), sMob.map((p) => `${p.preset} ${p.deltaPx}px`).join(', '));
    const oneShot = await measure('c5-oneshot-store', { ...serialPlan, identityReport: 'id-before.json' });
    check('C5 tienda mismo tema sin --stage: exige serie (exit 2)', oneShot.code === 2 && /en serie/.test(oneShot.stderr));
    const distinct = cells(B, A).map((c) => (c.stage === 'after' ? { ...c, themeId: '9' } : c));
    const dis = await measure('c5-distinct', { synthetic: true, previewBar: 'hide', cells: distinct });
    const disAllowed = await measure('c5-distinct-allowed', { synthetic: true, previewBar: 'hide', allowDistinctThemes: true, cells: distinct });
    check('C5 antes y despues en temas distintos: INVALIDO salvo allowDistinctThemes', dis.code === 2 && dis.result.pairs.every((p) => p.verdict === 'INVALIDO') && disAllowed.code === 0);

    // C3: Shopify sirve otro tema (preview ignorada), URL con otro preview_theme_id, pagina sin Shopify.theme.
    const wrong = await runStage('c3-wrong', { ...serialPlan, cells: storeCells({ extra: { served_theme_id: '999' } }) }, 'before');
    check('C3 tema servido distinto del themeId: filas invalidas (exit 2)', wrong.code === 2 && wrong.result.rows.every((r) => /tema servido 999/.test(r.error || '') && !r.capture));
    const urlBad = await runStage('c3-url', { ...serialPlan, cells: storeCells({ urlThemeId: '777' }) }, 'before');
    check('C3 preview_theme_id de la URL distinto del themeId: no mide (exit 2)', urlBad.code === 2 && urlBad.result === null);
    const noShop = await measure('c3-noshopify', { synthetic: false, previewBar: 'hide', allowDistinctThemes: true, identityReport: 'id-before.json',
      cells: storeCells().map((c) => (c.stage === 'after' ? { ...c, themeId: String(Number(c.themeId) + 100), url: c.url.replace(/preview_theme_id=\d+/, `preview_theme_id=${Number(c.themeId) + 100}`) } : c)) });
    check('C3 tienda sin informe para el tema: no mide (exit 2)', noShop.code === 2 && noShop.result === null);
    const bare = await runStage('c3-bare', { ...serialPlan, cells: storeCells({ extra: { no_shopify: '1' } }) }, 'before');
    check('C3 pagina sin Shopify.theme.id en tienda: filas invalidas (exit 2)', bare.code === 2 && bare.result.rows.every((r) => /no expone Shopify.theme.id/.test(r.error || '')));
    const capSrc = readFileSync(path.join(HARNESS_DIR, '..', '..', 'outbox-gpt', 'harness-GPT-C01-COLLECTION-001', 'capture.mjs'), 'utf8');
    const measSrc = readFileSync(path.join(HARNESS_DIR, 'measure.mjs'), 'utf8');
    const capSel = capSrc.match(/querySelector\('(#preview-bar-iframe[^']*)'\)/)?.[1];
    const measSel = measSrc.match(/const BAR_SELECTORS = '([^']*)'/)?.[1];
    check('C3 selectores de barra iguales a capture.mjs', capSel && capSel === measSel, measSel);
    const lateBar = await runStage('c3-latebar', { ...serialPlan, previewBar: 'measure', previewBarTimeoutMs: 1500, cells: storeCells({ extra: { previewbar: '48' } }) }, 'before');
    check('C3 modo measure espera la barra y registra la altura de capture', lateBar.code === 0 && lateBar.result.rows.every((r) => r.capture.barHeight === 48 && r.usefulViewportHeight === r.capture.height - 48));

    // C4: 429 respetado, contrasena solo del entorno y nunca en el resultado.
    const rl = await runStage('c4-429', { ...serialPlan, cells: storeCells({ extra: { ratelimit: '1' } }) }, 'before');
    check('C4 429: espera Retry-After, reintenta y mide (exit 0)', rl.code === 0 && rl.result.rows.every((r) => !r.error)
      && presets.every((p) => rl.result.rows.some((r) => r.preset === p && r.rateLimitRetries >= 1)));
    const pwPlan = { ...serialPlan, label: 'password' };
    const pwBad = await runStage('c4-planpw', { ...pwPlan, storefrontPassword: 'x' }, 'before');
    check('C4 plan con contrasena: rechazado (exit 2)', pwBad.code === 2 && pwBad.result === null);
    const PW = `selftest-pw-${process.pid}`;
    const gated = await serve(site, { password: PW });
    try {
      const gatedPlan = { ...serialPlan, label: 'tienda con contrasena', cells: storeCells({ origin: gated.origin }) };
      const noPw = await runStage('c4-nopw', gatedPlan, 'before');
      check('C4 tienda con contrasena sin STOREFRONT_PASSWORD: filas invalidas (exit 2)', noPw.code === 2 && noPw.result.rows.every((r) => /STOREFRONT_PASSWORD/.test(r.error || '')));
      const withPw = await runStage('c4-pw', gatedPlan, 'before', [], { STOREFRONT_PASSWORD: PW });
      const pwText = readFileSync(withPw.out, 'utf8');
      check('C4 login con STOREFRONT_PASSWORD del entorno y sin rastro en el resultado', withPw.code === 0 && withPw.result.rows.every((r) => r.storefrontLogin && r.servedThemeId === r.themeId)
        && ![pwText, withPw.stdout, withPw.stderr].some((t) => t.includes(PW)));
    } finally {
      gated.server.close();
    }

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
