#!/usr/bin/env node
// C-01 · medicion de la primera tarjeta de coleccion, antes/despues, segun la R-D
// (CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001 §1.5):
//   C01-1 matriz preset x viewport (390x844, 1280x800) x antes/despues;
//   C01-2 a 390x844 la primera tarjeta sube, o queda igual con justificacion, y no
//         desaparece ningun control de filtro u orden; a 1280x800 no cambia el layout;
//   C01-3 barra de preview ocultada ('hide') o medida ('measure') igual en ambos estados,
//         y este script y capture.mjs registrados con su SHA-256;
//   C01-6 LCP y CLS como observacion, sin compuerta.
// La lectura en pagina la hace capture.mjs de GPT sin modificar (SHA fijado abajo).
//
// Uso:
//   node measure.mjs --plan plan.json --out result.json [--screens <dir>]
//   en serie sobre el mismo tema (procedimiento recomendado):
//   node measure.mjs --plan plan.json --stage before --out before-rows.json
//   (push completo del despues al mismo ID, identity.mjs --full)
//   node measure.mjs --plan plan.json --stage after --before before-rows.json --out result.json
// plan.json:
//   { "label": "...", "synthetic": false,
//     "identityReport": "identity.json" | { "before": "id-before.json", "after": "id-after.json" },
//     "previewBar": "hide" | "measure", "previewBarTimeoutMs": 15000,
//     "allowDistinctThemes": false,
//     "justifications": { "Imprint": "texto si la tarjeta queda igual" },
//     "cells": [ { "preset": "Sartorial", "stage": "before", "themeId": "123",
//                  "commit": "<sha>", "path": "/collections/<handle>" } ] }
// En tienda la URL se construye como https://$SHOPIFY_FLAG_STORE<path>?preview_theme_id=<themeId>;
// si la celda trae "url", su preview_theme_id debe ser el themeId. Si la tienda pide
// contrasena, se usa STOREFRONT_PASSWORD del entorno (nunca del plan ni de argv).
// Fuera de modo sintetico exige un informe de identity.mjs en modo tienda y --full,
// con ok=true para cada themeId, commit y preset, y que la pagina servida exponga
// Shopify.theme.id igual al themeId; si no, no mide. Antes y despues deben usar el
// mismo themeId salvo allowDistinctThemes. Ante un 429 espera Retry-After y reintenta.
// Las URL no se copian al resultado (solo su ruta).
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPO, presetKey, resolveCommit, sha256, sha256File, showFile } from './lib.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const SELF = fileURLToPath(import.meta.url);
const CAPTURE = path.join(REPO, 'agent-comms/outbox-gpt/harness-GPT-C01-COLLECTION-001/capture.mjs');
const CAPTURE_SHA256 = 'ce2dab82057f939d5f49d9b386fc4ff244336f829808276ff29cf7bc52f9d1eb';
const VIEWPORTS = [{ width: 390, height: 844 }, { width: 1280, height: 800 }];
const TOLERANCE_PX = 0.5;
// Mismos selectores que capture.mjs: la altura que registra capture y la que se
// oculta o se espera aqui salen del mismo elemento.
const BAR_SELECTORS = '#preview-bar-iframe, #ShopifyPreviewBar, shopify-preview-bar';
const MAX_429_RETRIES = 3;
const MAX_RETRY_AFTER_S = 120;

function die(code, message) {
  process.stderr.write(`measure: ${message}\n`);
  process.exit(code);
}

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const planPath = arg('--plan');
const outPath = arg('--out');
const screens = arg('--screens');
const onlyStage = arg('--stage');
const beforePath = arg('--before');
if (!planPath || !outPath) die(2, 'uso --plan plan.json --out result.json [--screens dir] [--stage before|after [--before rows.json]]');
if (onlyStage && !['before', 'after'].includes(onlyStage)) die(2, '--stage debe ser before o after');
if (onlyStage === 'after' && !beforePath) die(2, '--stage after exige --before con las filas del antes');
if (beforePath && onlyStage !== 'after') die(2, '--before solo vale con --stage after');
const SELF_SHA256 = sha256File(SELF);
const STOREFRONT_PASSWORD = process.env.STOREFRONT_PASSWORD || '';

const captureSrc = readFileSync(CAPTURE, 'utf8');
if (sha256(captureSrc) !== CAPTURE_SHA256) die(2, 'capture.mjs no coincide con el SHA-256 fijado por la R-D');
const captureFn = captureSrc.replace(/^export default\s+/m, '').trim().replace(/;\s*$/, '');

const planRaw = readFileSync(planPath);
const plan = JSON.parse(planRaw);
// La contrasena de la tienda solo puede venir del entorno.
const hasPasswordKey = (v) => v && typeof v === 'object' && Object.entries(v).some(([k, x]) => /password|token/i.test(k) || hasPasswordKey(x));
if (hasPasswordKey(plan)) die(2, 'el plan no puede contener contrasenas ni tokens; usa STOREFRONT_PASSWORD en el entorno');
if (!['hide', 'measure'].includes(plan.previewBar)) die(2, 'previewBar debe ser hide o measure');
if (!Array.isArray(plan.cells) || plan.cells.length === 0) die(2, 'plan sin celdas');
const store = !plan.synthetic;
plan.cells.forEach((cell, i) => {
  cell.index = i;
  cell.preset = presetKey(cell.preset);
  if (!['before', 'after'].includes(cell.stage)) die(2, `stage no valido: ${cell.stage}`);
  if (!/^\d+$/.test(String(cell.themeId))) die(2, 'themeId debe ser numerico');
  cell.themeId = String(cell.themeId);
  cell.commit = resolveCommit(cell.commit);
  cell.target = cellUrl(cell);
});

// URL de la celda. En tienda: origen de SHOPIFY_FLAG_STORE y preview_theme_id = themeId.
function cellUrl(cell) {
  let url;
  if (cell.url) url = new URL(cell.url);
  else if (cell.path && store) {
    const host = (process.env.SHOPIFY_FLAG_STORE || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!host) die(2, 'la celda usa path y falta SHOPIFY_FLAG_STORE en el entorno');
    if (!cell.path.startsWith('/')) die(2, 'path debe empezar por /');
    url = new URL(cell.path, `https://${host}`);
  } else die(2, `celda ${cell.preset}/${cell.stage} sin url ni path`);
  if (store) {
    const given = url.searchParams.get('preview_theme_id');
    if (given !== null && given !== cell.themeId) die(2, `preview_theme_id de la URL no coincide con themeId en ${cell.preset}/${cell.stage}`);
    url.searchParams.set('preview_theme_id', cell.themeId);
  }
  return url;
}

// Mismo tema antes y despues (R-D §1.4), salvo alternativa declarada.
const sameTheme = (preset) => new Set(plan.cells.filter((c) => c.preset === preset).map((c) => c.themeId)).size === 1;
if (store && !onlyStage) {
  for (const preset of new Set(plan.cells.map((c) => c.preset))) {
    if (sameTheme(preset)) die(2, `${preset}: antes y despues en el mismo tema exigen medicion en serie (--stage before, push, --stage after)`);
  }
}

// Filas del antes (medicion en serie). Deben venir de este mismo plan y script.
let beforeRun = null;
if (beforePath) {
  beforeRun = JSON.parse(readFileSync(beforePath, 'utf8'));
  if (!beforeRun.partial || beforeRun.stage !== 'before') die(2, '--before no es un resultado parcial de --stage before');
  if (beforeRun.planSha256 !== sha256(planRaw)) die(2, '--before se midio con otro plan');
  if (beforeRun.scripts?.measure?.sha256 !== SELF_SHA256) die(2, '--before se midio con otra version de measure.mjs');
}

// Identidad: fuera de sintetico, sin informe valido no se mide.
const stagesToMeasure = onlyStage ? [onlyStage] : ['before', 'after'];
const identity = {};
if (store) {
  if (!plan.identityReport) die(2, 'falta identityReport; ejecuta identity.mjs --full antes de medir');
  for (const stage of stagesToMeasure) {
    const ref = typeof plan.identityReport === 'string' ? plan.identityReport : plan.identityReport[stage];
    if (!ref) die(2, `falta identityReport para ${stage}`);
    const reportPath = path.resolve(path.dirname(planPath), ref);
    if (!existsSync(reportPath)) die(2, `no existe el informe de identidad de ${stage}; ejecuta identity.mjs --full tras el push`);
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    if (report.mode !== 'store') die(2, 'el informe de identidad no procede de la tienda');
    if (report.scope !== 'full') die(2, `el informe de identidad de ${stage} no es --full (scope=${report.scope}); no se mide`);
    for (const cell of plan.cells.filter((c) => c.stage === stage)) {
      const t = report.targets.find((x) => String(x.themeId) === cell.themeId && x.preset === cell.preset && x.expectedCommit === cell.commit);
      if (!t || !t.ok) die(2, `identidad no acreditada para ${cell.preset}/${cell.stage} (tema ${cell.themeId})`);
      // En serie, el informe del despues tiene que ser posterior a la medicion del antes.
      if (stage === 'after' && beforeRun && beforeRun.rows.some((r) => r.themeId === cell.themeId)) {
        if (!(Date.parse(report.startedAt) > Date.parse(beforeRun.finishedAt))) {
          die(2, `el informe de identidad del despues (${cell.preset}) no es posterior a la medicion del antes`);
        }
      }
    }
    identity[stage] = { file: path.relative(REPO, reportPath), sha256: sha256File(reportPath), scope: report.scope, startedAt: report.startedAt };
  }
}

async function probe(page, barHeight) {
  return page.evaluate((barHeight) => {
    const visible = (el) => {
      if (!el) return false;
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
        && !el.closest('[hidden], [inert]');
    };
    const form = document.querySelector('[data-facet-form]');
    const controls = [];
    if (form) {
      form.querySelectorAll('details.facet > summary').forEach((el, i) => controls.push({ key: `facet:${i}:${el.textContent.trim()}`, visible: visible(el) }));
      const sort = form.querySelector('[data-facet-sort]');
      controls.push({ key: 'sort', visible: visible(sort) });
      const submit = form.querySelector('button[type="submit"]');
      controls.push({ key: 'submit', visible: visible(submit) });
    }
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    const body = document.querySelector('.collection-main__body');
    const firstCard = document.querySelector('[data-product-list] > li > article.product-card[data-product-id]');
    const usefulHeight = innerHeight - barHeight;
    return {
      controls,
      usefulViewportHeight: usefulHeight,
      firstCardVisibleInUsefulViewport: firstCard ? firstCard.getBoundingClientRect().top < usefulHeight : false,
      layout: {
        header: rect('.collection-main__header'),
        banner: rect('.collection-main__banner'),
        facets: rect('[data-facet-form]'),
        grid: rect('[data-product-grid]'),
        firstCard: rect('[data-product-list] > li > article.product-card'),
        bodyColumns: body ? getComputedStyle(body).gridTemplateColumns : null,
        bodyGap: body ? getComputedStyle(body).rowGap : null,
        facetsPosition: form ? getComputedStyle(form).position : null,
      },
    };
  }, barHeight);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Navega respetando los 429: espera Retry-After (tope 120 s) y reintenta hasta 3 veces.
async function gotoRespecting429(page, url, row) {
  for (let attempt = 0; ; attempt += 1) {
    const res = await page.goto(url, { waitUntil: 'load' });
    if (!res || res.status() !== 429) return res;
    if (attempt >= MAX_429_RETRIES) throw new Error(`429 persistente tras ${MAX_429_RETRIES} reintentos`);
    const retryAfter = Number(res.headers()['retry-after']);
    const wait = Math.min(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 30, MAX_RETRY_AFTER_S);
    row.rateLimitRetries = (row.rateLimitRetries || 0) + 1;
    await sleep(wait * 1000);
  }
}

// Tienda con contrasena: rellena el formulario de /password con STOREFRONT_PASSWORD.
async function passStorefrontPassword(page, url, row) {
  if (new URL(page.url()).pathname !== '/password') return;
  if (!STOREFRONT_PASSWORD) throw new Error('la tienda pide contrasena y falta STOREFRONT_PASSWORD en el entorno');
  const input = page.locator('form input[type="password"]').first();
  await input.fill(STOREFRONT_PASSWORD);
  await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), input.press('Enter')]);
  row.storefrontLogin = true;
  await gotoRespecting429(page, url, row);
  if (new URL(page.url()).pathname === '/password') throw new Error('login de tienda fallido');
}

// Tema que sirve la pagina. En tienda es obligatorio y debe ser el themeId esperado.
async function checkServedTheme(page, cell, row) {
  const served = await page.evaluate(() => (window.Shopify && window.Shopify.theme && window.Shopify.theme.id != null ? String(window.Shopify.theme.id) : null));
  row.servedThemeId = served;
  if (served === null && store) throw new Error('la pagina no expone Shopify.theme.id; no se puede acreditar el tema servido');
  if (served !== null && served !== cell.themeId) throw new Error(`tema servido ${served} distinto del themeId ${cell.themeId}`);
}

async function measureCell(browser, cell, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'en-US', reducedMotion: 'reduce' });
  const page = await context.newPage();
  const servedCss = [];
  page.on('response', async (res) => {
    if (/\/base\.css$/.test(new URL(res.url()).pathname)) {
      try { servedCss.push(sha256(await res.body())); } catch { /* cuerpo no disponible */ }
    }
  });
  const url = cell.target.href;
  const row = { cellIndex: cell.index, preset: cell.preset, stage: cell.stage, themeId: cell.themeId, commit: cell.commit, viewport: `${viewport.width}x${viewport.height}`, path: cell.target.pathname };
  try {
    await gotoRespecting429(page, url, row);
    await passStorefrontPassword(page, url, row);
    await checkServedTheme(page, cell, row);
    if (plan.previewBar === 'hide') {
      await page.addStyleTag({ content: `${BAR_SELECTORS} { display: none !important; } html { margin-top: 0 !important; padding-bottom: 0 !important; }` });
    } else {
      // La barra de Shopify se inyecta de forma asincrona: se espera a que sea visible.
      try {
        await page.waitForSelector(BAR_SELECTORS, { state: 'visible', timeout: plan.previewBarTimeoutMs ?? 15000 });
      } catch {
        throw new Error('la barra de preview no aparecio visible a tiempo');
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const meta = { preset: cell.preset, stage: cell.stage, themeId: cell.themeId, width: viewport.width, height: viewport.height, dpr: 1, previewBar: plan.previewBar === 'hide' ? 'hidden' : 'measure' };
    row.capture = await page.evaluate(`(${captureFn})(${JSON.stringify(meta)})`);
    Object.assign(row, await probe(page, row.capture.barHeight));
    row.servedBaseCssSha256 = [...new Set(servedCss)];
    if (screens) {
      mkdirSync(screens, { recursive: true });
      await page.screenshot({ path: path.join(screens, `${cell.preset}-${row.viewport}-${cell.stage}.png`) });
    }
  } catch (error) {
    let msg = String(error.message || error).split('\n')[0].replace(/https?:\/\/\S+/g, '<url>');
    if (STOREFRONT_PASSWORD) msg = msg.split(STOREFRONT_PASSWORD).join('<redacted>');
    row.error = msg;
  } finally {
    await context.close();
  }
  return row;
}

const close = (a, b) => (a == null && b == null) || (a != null && b != null && Math.abs(a - b) <= TOLERANCE_PX);
function rectDiff(a, b) {
  if (!a && !b) return null;
  if (!a || !b) return 'presente solo en un estado';
  const keys = ['x', 'y', 'width', 'height'].filter((k) => !close(a[k], b[k]));
  return keys.length ? keys.map((k) => `${k} ${a[k].toFixed(2)}→${b[k].toFixed(2)}`).join(', ') : null;
}

function judge(before, after) {
  const issues = [];
  if (before.error || after.error) return { verdict: 'INVALIDO', issues: [before.error, after.error].filter(Boolean) };
  const b = before.capture;
  const a = after.capture;
  if (b.collectionPath !== a.collectionPath) issues.push('coleccion distinta');
  if (b.firstCardProductId !== a.firstCardProductId) issues.push('primera tarjeta con producto distinto');
  if (b.previewBar !== a.previewBar || !close(b.barHeight, a.barHeight)) issues.push('barra de preview tratada distinto');
  if (before.themeId !== after.themeId && !plan.allowDistinctThemes) issues.push('antes y despues en temas distintos (R-D: mismo tema); declara allowDistinctThemes para la alternativa');
  if (issues.length) return { verdict: 'INVALIDO', issues };

  const mobile = a.width < 768;
  const delta = a.firstCardTop - b.firstCardTop;
  const lostControls = before.controls.filter((c) => c.visible && !after.controls.find((x) => x.key === c.key && x.visible)).map((c) => c.key);
  const hiddenControls = after.controls.filter((c) => !c.visible).map((c) => c.key);
  const out = { firstCardTopBefore: b.firstCardTop, firstCardTopAfter: a.firstCardTop, deltaPx: Number(delta.toFixed(2)), lostControls, hiddenControls };
  if (mobile) {
    if (lostControls.length || hiddenControls.length) return { ...out, verdict: 'FALLA_CONTROLES', pass: false };
    if (delta < -TOLERANCE_PX) return { ...out, verdict: 'SUBE', pass: true };
    if (delta <= TOLERANCE_PX) {
      const why = plan.justifications?.[after.preset];
      return { ...out, verdict: why ? 'IGUAL_JUSTIFICADO' : 'IGUAL_SIN_JUSTIFICAR', justification: why ?? null, pass: Boolean(why) };
    }
    return { ...out, verdict: 'BAJA', pass: false };
  }
  const diffs = {};
  for (const key of ['header', 'banner', 'facets', 'grid', 'firstCard']) {
    const d = rectDiff(before.layout[key], after.layout[key]);
    if (d) diffs[key] = d;
  }
  for (const key of ['bodyColumns', 'bodyGap', 'facetsPosition']) {
    if (before.layout[key] !== after.layout[key]) diffs[key] = `${before.layout[key]} → ${after.layout[key]}`;
  }
  const changed = Object.keys(diffs).length > 0;
  return { ...out, diffs, verdict: changed ? 'CAMBIO_LAYOUT' : 'SIN_CAMBIOS', pass: !changed };
}

const startedAt = new Date().toISOString();
const browser = await chromium.launch();
const rows = [];
try {
  for (const cell of plan.cells.filter((c) => stagesToMeasure.includes(c.stage))) {
    for (const viewport of VIEWPORTS) rows.push(await measureCell(browser, cell, viewport));
  }
} finally {
  await browser.close();
}
const finishedAt = new Date().toISOString();

// En sintetico el CSS servido no pasa por Shopify: debe ser el del commit.
if (plan.synthetic) {
  for (const row of rows) {
    // Un fixture sintetico con CSS inyectado declara su SHA esperado en la celda.
    const cell = plan.cells[row.cellIndex];
    const want = cell.expectedBaseCssSha256 ?? sha256(showFile(row.commit, 'assets/base.css'));
    row.syntheticCssIdentity = row.servedBaseCssSha256?.includes(want) ? (cell.expectedBaseCssSha256 ? 'match-declared' : 'match') : 'mismatch';
    if (row.syntheticCssIdentity === 'mismatch' && !row.error) row.error = 'base.css servido no es el del commit (sintetico)';
  }
}

const scripts = {
  measure: { file: path.relative(REPO, SELF), sha256: SELF_SHA256 },
  capture: { file: path.relative(REPO, CAPTURE), sha256: CAPTURE_SHA256 },
};

if (onlyStage === 'before') {
  const ok = rows.every((r) => !r.error);
  const partial = { id: 'C-01-MEASURE', partial: true, stage: 'before', label: plan.label ?? null, synthetic: Boolean(plan.synthetic), tag: plan.synthetic ? 'SINTETICO' : 'TIENDA', previewBar: plan.previewBar, scripts, planSha256: sha256(planRaw), identity, startedAt, finishedAt, rows };
  writeFileSync(outPath, `${JSON.stringify(partial, null, 2)}\n`);
  for (const r of rows) process.stdout.write(`${r.error ? 'FAIL' : 'ok  '} ${r.preset} ${r.viewport} before${r.error ? ` ${r.error}` : ` top=${r.capture.firstCardTop}`}\n`);
  process.stdout.write(`partial before ok=${ok}\n`);
  process.exit(ok ? 0 : 2);
}
if (beforeRun) {
  rows.unshift(...beforeRun.rows);
  identity.before = beforeRun.identity?.before ?? null;
}

const pairs = [];
for (const preset of [...new Set(plan.cells.map((c) => c.preset))]) {
  for (const { width, height } of VIEWPORTS) {
    const vp = `${width}x${height}`;
    const before = rows.filter((r) => r.preset === preset && r.viewport === vp && r.stage === 'before');
    const after = rows.filter((r) => r.preset === preset && r.viewport === vp && r.stage === 'after');
    if (before.length !== 1 || after.length !== 1) {
      pairs.push({ preset, viewport: vp, verdict: 'INVALIDO', issues: ['se necesita exactamente un antes y un despues'], pass: false });
      continue;
    }
    pairs.push({ preset, viewport: vp, beforeTheme: before[0].themeId, afterTheme: after[0].themeId, ...judge(before[0], after[0]) });
  }
}

const allPresets = new Set(plan.cells.map((c) => c.preset)).size === 3;
const conclusive = pairs.every((p) => p.verdict !== 'INVALIDO') && (plan.synthetic || allPresets);
const result = {
  id: 'C-01-MEASURE',
  label: plan.label ?? null,
  synthetic: Boolean(plan.synthetic),
  tag: plan.synthetic ? 'SINTETICO' : 'TIENDA',
  previewBar: plan.previewBar,
  scripts,
  planSha256: sha256(planRaw),
  serial: Boolean(beforeRun),
  identity: store ? identity : null,
  rows,
  pairs,
  conclusive,
  pass: conclusive && pairs.every((p) => p.pass),
  notCovered: 'aplicar/limpiar filtros, orden, vacio, estado tras AJAX y GET sin JS (C01-4/C01-5) se prueban aparte',
};
writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);
for (const p of pairs) {
  process.stdout.write(`${p.pass ? 'PASS' : 'FAIL'} ${p.preset} ${p.viewport} ${p.verdict} delta=${p.deltaPx ?? '-'}px${p.diffs && Object.keys(p.diffs).length ? ` diffs=${Object.keys(p.diffs).join(',')}` : ''}\n`);
}
process.stdout.write(`conclusive=${conclusive} pass=${result.pass}\n`);
process.exit(!conclusive ? 2 : result.pass ? 0 : 1);
