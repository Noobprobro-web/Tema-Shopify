#!/usr/bin/env node
// Lote D (D-01, D-01-N, D-01-L): genera y comprueba los entregables de importacion manual.
// Fuente: docs/demo-import/data/<preset>.json. Salida: docs/demo-import/<preset>-products.csv
// y docs/demo-import/<preset>-photos.csv. No contacta ninguna tienda ni lee credenciales.
//
// Uso:
//   node scripts/demo-import.mjs build   -> escribe los CSV
//   node scripts/demo-import.mjs check   -> valida datos, CSV y referencias de plantillas (exit 1 si falla)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'docs', 'demo-import');
const PRESETS = ['sartorial', 'imprint', 'archive'];
const MAX_VARIANTS = 100;

const PRODUCT_COLUMNS = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags', 'Published',
  'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
  'Variant Price', 'Variant Requires Shipping', 'Variant Taxable',
  'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
  'Variant Fulfillment Service', 'Gift Card', 'Status',
];
const PHOTO_COLUMNS = [
  'Preset', 'Surface', 'Section or block', 'Setting', 'Min width (px)', 'Orientation',
  'Subject', 'Product handle', 'View', 'Alt text hint', 'Status',
];

function csvCell(value) {
  const s = value === undefined || value === null ? '' : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(columns, rows) {
  return [columns, ...rows.map((r) => columns.map((c) => r[c]))]
    .map((r) => r.map(csvCell).join(','))
    .join('\n') + '\n';
}
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (quoted) throw new Error('CSV: comilla sin cerrar');
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function loadData(preset) {
  return JSON.parse(fs.readFileSync(path.join(DIR, 'data', `${preset}.json`), 'utf8'));
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Devuelve las opciones de un producto como [{name, values}] (0 a 2 opciones).
function productOptions(data, p) {
  if (p.option1) return [p.option1, p.option2].filter(Boolean);
  const opts = [];
  if (p.colors && p.colors.length) opts.push({ name: 'Color', values: p.colors });
  const scale = p.sizes ? data.size_scales[p.sizes] : undefined;
  if (p.sizes && scale === undefined) throw new Error(`${p.handle}: escala de talla desconocida ${p.sizes}`);
  if (scale && scale.length) opts.push({ name: 'Size', values: scale });
  return opts;
}

function productBody(p) {
  let html = `<p>${escapeHtml(p.body)}</p>`;
  if (p.label_size) html += `<p>Single piece. Label size: ${escapeHtml(p.label_size)}.</p>`;
  return html;
}

function variantRows(data, p) {
  const opts = productOptions(data, p);
  let combos = [[]];
  for (const o of opts) combos = combos.flatMap((c) => o.values.map((v) => [...c, v]));
  if (!opts.length) combos = [['Default Title']];
  const inv = data.inventory || {};
  return combos.map((combo, i) => {
    const price = p.prices_by_option2 && opts[1] ? p.prices_by_option2[combo[1]] : p.price;
    const row = {
      Handle: p.handle,
      'Option1 Value': combo[0],
      'Option2 Value': combo[1] ?? '',
      'Variant Price': Number(price).toFixed(2),
      'Variant Requires Shipping': 'TRUE',
      'Variant Taxable': 'TRUE',
      'Variant Inventory Tracker': inv.tracker || '',
      'Variant Inventory Qty': inv.tracker ? String(inv.qty ?? '') : '',
      'Variant Inventory Policy': inv.policy || 'deny',
      'Variant Fulfillment Service': 'manual',
    };
    if (i === 0) {
      Object.assign(row, {
        Title: p.title,
        'Body (HTML)': productBody(p),
        Vendor: data.vendor || '',
        Type: p.type,
        Tags: p.tags.join(', '),
        Published: data.status === 'active' ? 'TRUE' : 'FALSE',
        'Option1 Name': opts[0] ? opts[0].name : 'Title',
        'Option2 Name': opts[1] ? opts[1].name : '',
        'Gift Card': 'FALSE',
        Status: data.status,
      });
    }
    return row;
  });
}

function buildProductsCsv(data) {
  return toCsv(PRODUCT_COLUMNS, data.products.flatMap((p) => variantRows(data, p)));
}

function photoViewsFor(data, p) {
  const v = data.photo_views;
  if (v[p.handle]) return v[p.handle];
  if (v.accessories && (p.tags.includes('accessories'))) return v.accessories;
  return v.default;
}

function buildPhotosCsv(data) {
  const rows = data.photo_slots.map((s) => ({
    Preset: data.preset, Surface: s.surface, 'Section or block': s.section, Setting: s.setting,
    'Min width (px)': s.min_width, Orientation: s.orientation, Subject: s.subject,
    'Product handle': '', View: '', 'Alt text hint': '', Status: 'pending Johandry',
  }));
  for (const p of data.products) {
    for (const view of photoViewsFor(data, p)) {
      rows.push({
        Preset: data.preset, Surface: 'PDP and cards', 'Section or block': 'product media (admin)',
        Setting: 'product image', 'Min width (px)': 2000, Orientation: 'portrait 4:5',
        Subject: p.title, 'Product handle': p.handle, View: view,
        'Alt text hint': `${p.title}, ${view.charAt(0).toLowerCase()}${view.slice(1)}`,
        Status: 'pending Johandry',
      });
    }
  }
  return toCsv(PHOTO_COLUMNS, rows);
}

function stripJsonComment(text) {
  return text.replace(/^﻿/, '').replace(/^\s*\/\*[\s\S]*?\*\//, '');
}

// Referencias de un JSON de plantilla: settings product/collection y URLs internas.
function templateRefs(file) {
  const json = JSON.parse(stripJsonComment(fs.readFileSync(path.join(ROOT, file), 'utf8')));
  const refs = { products: new Set(), collections: new Set(), pages: new Set() };
  (function walk(node, key) {
    if (Array.isArray(node)) return node.forEach((n) => walk(n, key));
    if (node && typeof node === 'object') {
      if (node.disabled === true) return;
      return Object.entries(node).forEach(([k, v]) => walk(v, k));
    }
    if (typeof node !== 'string' || !node) return;
    if (key === 'product') refs.products.add(node);
    if (key === 'collection') refs.collections.add(node);
    for (const m of node.matchAll(/\/(collections|products|pages)\/([a-z0-9-]+)/g)) {
      refs[m[1] === 'collections' ? 'collections' : m[1] === 'products' ? 'products' : 'pages'].add(m[2]);
    }
  })(json, '');
  return refs;
}

function checkPreset(preset, errors) {
  const err = (m) => errors.push(`[${preset}] ${m}`);
  const data = loadData(preset);
  const handles = new Set();
  let variants = 0;
  for (const p of data.products) {
    if (handles.has(p.handle)) err(`handle duplicado ${p.handle}`);
    handles.add(p.handle);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.handle)) err(`handle no valido ${p.handle}`);
    if (!p.title || !p.type || !p.body) err(`${p.handle}: falta title, type o body`);
    if (!(Number(p.price) > 0)) err(`${p.handle}: precio no valido`);
    const opts = productOptions(data, p);
    if (opts.length > 3) err(`${p.handle}: mas de 3 opciones`);
    const rows = variantRows(data, p);
    variants += rows.length;
    if (rows.length > MAX_VARIANTS) err(`${p.handle}: ${rows.length} variantes > ${MAX_VARIANTS}`);
    const combos = new Set(rows.map((r) => `${r['Option1 Value']}|${r['Option2 Value']}`));
    if (combos.size !== rows.length) err(`${p.handle}: combinaciones de opciones repetidas`);
    if (p.prices_by_option2) {
      for (const v of opts[1].values) if (!(Number(p.prices_by_option2[v]) > 0)) err(`${p.handle}: falta precio para ${v}`);
    }
    for (const r of rows) if (!/^\d+\.\d{2}$/.test(r['Variant Price'])) err(`${p.handle}: precio de variante no numerico`);
  }
  if (!['active', 'draft'].includes(data.status)) err(`status no valido ${data.status}`);

  const collections = new Map(data.collections.map((c) => [c.handle, c]));
  for (const c of data.collections) {
    const members = data.products.filter((p) => p.tags.includes(c.tag)).map((p) => p.handle);
    if (!members.length) err(`coleccion ${c.handle} sin productos`);
    if (c.order) {
      const a = [...members].sort().join(','), b = [...c.order].sort().join(',');
      if (a !== b) err(`coleccion ${c.handle}: el orden manual no coincide con los productos de la etiqueta ${c.tag}`);
    }
  }
  const pages = new Set(data.pages.map((p) => p.handle));
  const policies = new Set(data.policies);

  // Referencias de plantillas de la presentacion.
  for (const file of data.listing_templates) {
    const refs = templateRefs(file);
    for (const h of refs.products) if (!handles.has(h)) err(`${file}: producto ${h} no esta en el CSV`);
    for (const h of refs.collections) if (h !== 'all' && !collections.has(h)) err(`${file}: coleccion ${h} no esta definida`);
    for (const h of refs.pages) if (!pages.has(h)) err(`${file}: pagina ${h} no esta definida`);
  }

  // Menus: cada enlace apunta a un destino creado por estos entregables.
  const checkUrl = (url, where) => {
    let m;
    if (url === '/collections/all' || url === '/') return;
    if ((m = url.match(/^\/collections\/([a-z0-9-]+)$/))) { if (!collections.has(m[1])) err(`${where}: coleccion ${m[1]} no definida`); return; }
    if ((m = url.match(/^\/pages\/([a-z0-9-]+)$/))) { if (!pages.has(m[1])) err(`${where}: pagina ${m[1]} no definida`); return; }
    if ((m = url.match(/^\/products\/([a-z0-9-]+)$/))) { if (!handles.has(m[1])) err(`${where}: producto ${m[1]} no definido`); return; }
    if ((m = url.match(/^\/policies\/([a-z-]+)$/))) { if (!policies.has(m[1])) err(`${where}: politica ${m[1]} no listada`); return; }
    err(`${where}: destino no reconocido ${url}`);
  };
  for (const [menu, items] of Object.entries(data.menus)) {
    for (const it of items) {
      checkUrl(it.url, `menu ${menu} / ${it.title}`);
      for (const ch of it.children || []) checkUrl(ch.url, `menu ${menu} / ${it.title} / ${ch.title}`);
    }
  }
  if (!data.menus['main-menu'].some((i) => i.title === 'Catalog')) {
    err('main-menu sin elemento «Catalog»: sections/header-group.json engancha el mega menu a ese titulo');
  }

  // CSV generados al dia y legibles.
  for (const [name, build, cols] of [
    [`${preset}-products.csv`, buildProductsCsv, PRODUCT_COLUMNS],
    [`${preset}-photos.csv`, buildPhotosCsv, PHOTO_COLUMNS],
  ]) {
    const file = path.join(DIR, name);
    if (!fs.existsSync(file)) { err(`${name} no existe; ejecutar build`); continue; }
    const text = fs.readFileSync(file, 'utf8');
    if (text !== build(data)) err(`${name} desactualizado respecto de data/${preset}.json; ejecutar build`);
    const rows = parseCsv(text);
    if (rows[0].join(',') !== cols.join(',')) err(`${name}: cabecera inesperada`);
    for (const [i, r] of rows.entries()) if (r.length !== cols.length) err(`${name}: fila ${i + 1} con ${r.length} columnas`);
  }
  return { products: data.products.length, variants, collections: data.collections.length };
}

const mode = process.argv[2];
if (mode === 'build') {
  for (const preset of PRESETS) {
    const data = loadData(preset);
    fs.writeFileSync(path.join(DIR, `${preset}-products.csv`), buildProductsCsv(data));
    fs.writeFileSync(path.join(DIR, `${preset}-photos.csv`), buildPhotosCsv(data));
    console.log(`${preset}: CSV escritos`);
  }
} else if (mode === 'check') {
  const errors = [];
  for (const preset of PRESETS) {
    const s = checkPreset(preset, errors);
    console.log(`${preset}: ${s.products} productos, ${s.variants} variantes, ${s.collections} colecciones`);
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`FALLO: ${errors.length} error(es)`);
    process.exit(1);
  }
  console.log('OK: 0 errores');
} else {
  console.error('Uso: node scripts/demo-import.mjs build|check');
  process.exit(2);
}
