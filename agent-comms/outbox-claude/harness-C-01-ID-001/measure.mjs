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
// Uso: node measure.mjs --plan plan.json --out result.json [--screens <dir>]
// plan.json:
//   { "label": "...", "synthetic": false, "identityReport": "identity.json",
//     "previewBar": "hide" | "measure",
//     "justifications": { "Imprint": "texto si la tarjeta queda igual" },
//     "cells": [ { "preset": "Sartorial", "stage": "before", "themeId": "123",
//                  "commit": "<sha>", "url": "<url de la coleccion en esa preview>" } ] }
// Fuera de modo sintetico exige un informe de identity.mjs con ok=true para cada
// themeId, commit y preset; si no, sale con 2 sin medir. Las URL no se copian al
// resultado (solo su ruta), para no guardar parametros de preview.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
const BAR_SELECTORS = '#preview-bar-iframe, #PBarNextFrameWrapper, #ShopifyPreviewBar, shopify-preview-bar';

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
if (!planPath || !outPath) die(2, 'uso --plan plan.json --out result.json [--screens dir]');

const captureSrc = readFileSync(CAPTURE, 'utf8');
if (sha256(captureSrc) !== CAPTURE_SHA256) die(2, 'capture.mjs no coincide con el SHA-256 fijado por la R-D');
const captureFn = captureSrc.replace(/^export default\s+/m, '').trim().replace(/;\s*$/, '');

const planRaw = readFileSync(planPath);
const plan = JSON.parse(planRaw);
if (!['hide', 'measure'].includes(plan.previewBar)) die(2, 'previewBar debe ser hide o measure');
if (!Array.isArray(plan.cells) || plan.cells.length === 0) die(2, 'plan sin celdas');
for (const cell of plan.cells) {
  cell.preset = presetKey(cell.preset);
  if (!['before', 'after'].includes(cell.stage)) die(2, `stage no valido: ${cell.stage}`);
  if (!/^\d+$/.test(String(cell.themeId))) die(2, 'themeId debe ser numerico');
  cell.commit = resolveCommit(cell.commit);
}

// Identidad: fuera de sintetico, sin informe valido no se mide.
let identity = null;
if (!plan.synthetic) {
  if (!plan.identityReport) die(2, 'falta identityReport; ejecuta identity.mjs antes de medir');
  const reportPath = path.resolve(path.dirname(planPath), plan.identityReport);
  identity = JSON.parse(readFileSync(reportPath, 'utf8'));
  if (identity.mode !== 'store') die(2, 'el informe de identidad no procede de la tienda');
  for (const cell of plan.cells) {
    const t = identity.targets.find((x) => String(x.themeId) === String(cell.themeId) && x.preset === cell.preset);
    if (!t || !t.ok || t.expectedCommit !== cell.commit) {
      die(2, `identidad no acreditada para ${cell.preset}/${cell.stage} (tema ${cell.themeId})`);
    }
  }
  identity = { file: path.relative(REPO, reportPath), sha256: sha256File(reportPath), scope: identity.scope };
}

async function probe(page) {
  return page.evaluate((barSelectors) => {
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
    const bar = document.querySelector(barSelectors);
    const barBox = bar ? bar.getBoundingClientRect() : null;
    const barHeight = barBox && visible(bar) ? barBox.height : 0;
    const firstCard = document.querySelector('[data-product-list] > li > article.product-card[data-product-id]');
    const usefulHeight = innerHeight - barHeight;
    return {
      controls,
      usefulViewportHeight: usefulHeight,
      barOverlaysBottom: barBox ? barBox.bottom >= innerHeight - 1 : null,
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
  }, BAR_SELECTORS);
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
  const url = new URL(cell.url);
  const row = { preset: cell.preset, stage: cell.stage, themeId: String(cell.themeId), commit: cell.commit, viewport: `${viewport.width}x${viewport.height}`, path: url.pathname };
  try {
    await page.goto(cell.url, { waitUntil: 'load' });
    if (plan.previewBar === 'hide') {
      await page.addStyleTag({ content: `${BAR_SELECTORS} { display: none !important; } html { margin-top: 0 !important; padding-bottom: 0 !important; }` });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const meta = { preset: cell.preset, stage: cell.stage, themeId: String(cell.themeId), width: viewport.width, height: viewport.height, dpr: 1, previewBar: plan.previewBar === 'hide' ? 'hidden' : 'measure' };
    row.capture = await page.evaluate(`(${captureFn})(${JSON.stringify(meta)})`);
    Object.assign(row, await probe(page));
    row.servedBaseCssSha256 = [...new Set(servedCss)];
    if (screens) {
      mkdirSync(screens, { recursive: true });
      await page.screenshot({ path: path.join(screens, `${cell.preset}-${row.viewport}-${cell.stage}.png`) });
    }
  } catch (error) {
    row.error = String(error.message || error).split('\n')[0].replace(/https?:\/\/\S+/g, '<url>');
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

const browser = await chromium.launch();
const rows = [];
try {
  for (const cell of plan.cells) for (const viewport of VIEWPORTS) rows.push(await measureCell(browser, cell, viewport));
} finally {
  await browser.close();
}

// En sintetico el CSS servido no pasa por Shopify: debe ser el del commit.
if (plan.synthetic) {
  for (const [i, row] of rows.entries()) {
    // Un fixture sintetico con CSS inyectado declara su SHA esperado en la celda.
    const cell = plan.cells[Math.floor(i / VIEWPORTS.length)];
    const want = cell.expectedBaseCssSha256 ?? sha256(showFile(row.commit, 'assets/base.css'));
    row.syntheticCssIdentity = row.servedBaseCssSha256?.includes(want) ? (cell.expectedBaseCssSha256 ? 'match-declared' : 'match') : 'mismatch';
    if (row.syntheticCssIdentity === 'mismatch' && !row.error) row.error = 'base.css servido no es el del commit (sintetico)';
  }
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
  scripts: {
    measure: { file: path.relative(REPO, SELF), sha256: sha256File(SELF) },
    capture: { file: path.relative(REPO, CAPTURE), sha256: CAPTURE_SHA256 },
  },
  planSha256: sha256(planRaw),
  identity,
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
