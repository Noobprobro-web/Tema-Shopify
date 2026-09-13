#!/usr/bin/env node
/*
 * locale-key-inventory.mjs
 *
 * Inventario exhaustivo de referencias de traduccion frente a los archivos de
 * locales. Theme Check ya valida las referencias estaticas; este script agrega
 * lo que Theme Check no da:
 *
 *   1. El recuento, para poder afirmar cobertura en lugar de suponerla.
 *   2. Las referencias construidas en tiempo de ejecucion, que NINGUN linter
 *      estatico puede verificar y que por lo tanto hay que revisar a mano.
 *   3. Las claves huerfanas, definidas en los locales y nunca referenciadas.
 *   4. Las carpetas fuera del alcance de Theme Check, como /listings.
 *
 * Uso: node scripts/locale-key-inventory.mjs
 * Sale con codigo 1 si hay referencias sin resolver.
 * Sin dependencias. Node 18 o superior.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');
const SCAN_DIRS = ['layout', 'sections', 'snippets', 'templates', 'blocks', 'config', 'listings'];

const STATIC_T = /(['"])([A-Za-z0-9_.]+)\1\s*\|\s*t(?![A-Za-z0-9_])/g;
const ANY_T = /\|\s*t(?![A-Za-z0-9_])/g;
const SCHEMA_T = /"t:([A-Za-z0-9_.]+)"/g;

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(liquid|json)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function flatten(node, prefix = '', out = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    const dotted = prefix ? `${prefix}.${key}` : key;
    out.set(dotted, value);
    if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, dotted, out);
  }
  return out;
}

const storefront = flatten(JSON.parse(await readFile(path.join(REPO, 'locales/en.default.json'), 'utf8')));
const schema = flatten(JSON.parse(await readFile(path.join(REPO, 'locales/en.default.schema.json'), 'utf8')));

const files = (await Promise.all(SCAN_DIRS.map((d) => walk(path.join(REPO, d))))).flat();

const staticRefs = new Map();   // clave -> [archivo...]
const schemaRefs = new Map();
const dynamicRefs = [];         // { file, line, text }

for (const file of files) {
  const rel = path.relative(REPO, file).split(path.sep).join('/');
  const src = await readFile(file, 'utf8');

  for (const match of src.matchAll(STATIC_T)) {
    if (!staticRefs.has(match[2])) staticRefs.set(match[2], []);
    staticRefs.get(match[2]).push(rel);
  }
  for (const match of src.matchAll(SCHEMA_T)) {
    if (!schemaRefs.has(match[1])) schemaRefs.set(match[1], []);
    schemaRefs.get(match[1]).push(rel);
  }

  // Toda invocacion de `| t` que no venga de un literal entre comillas se
  // construye en tiempo de ejecucion y no es verificable estaticamente.
  const staticPositions = new Set([...src.matchAll(STATIC_T)].map((m) => m.index + m[0].length));
  for (const match of src.matchAll(ANY_T)) {
    const end = match.index + match[0].length;
    if ([...staticPositions].some((p) => Math.abs(p - end) <= 2)) continue;
    const line = src.slice(0, match.index).split('\n').length;
    const text = src.split('\n')[line - 1].trim();
    dynamicRefs.push({ file: rel, line, text: text.length > 110 ? `${text.slice(0, 110)}...` : text });
  }
}

const unresolvedStorefront = [...staticRefs].filter(([key]) => !storefront.has(key));
const unresolvedSchema = [...schemaRefs].filter(([key]) => !schema.has(key));

// Huerfanas: una hoja cuenta como usada si ella o cualquier ancestro se referencia.
function orphans(defined, refs) {
  const referenced = [...refs.keys()];
  return [...defined]
    .filter(([, value]) => typeof value === 'string')
    .map(([key]) => key)
    .filter((key) => !referenced.some((ref) => key === ref || key.startsWith(`${ref}.`)));
}

const orphanStorefront = orphans(storefront, staticRefs);
const orphanSchema = orphans(schema, schemaRefs);

const line = (n = 74) => '-'.repeat(n);
console.log(line());
console.log('INVENTARIO DE CLAVES DE TRADUCCION');
console.log(line());
console.log(`Archivos escaneados:            ${files.length} (incluye /listings, fuera de Theme Check)`);
console.log(`Referencias estaticas | t:      ${staticRefs.size} claves distintas`);
console.log(`Referencias de schema t::       ${schemaRefs.size} claves distintas`);
console.log(`Claves en en.default.json:        ${[...storefront].filter(([, v]) => typeof v === 'string').length} hojas`);
console.log(`Claves en en.default.schema.json: ${[...schema].filter(([, v]) => typeof v === 'string').length} hojas`);
console.log();
console.log(`Sin resolver en storefront:     ${unresolvedStorefront.length}`);
console.log(`Sin resolver en schema:         ${unresolvedSchema.length}`);
console.log(`Construidas en runtime:         ${dynamicRefs.length}  <- no verificables por ningun linter`);
console.log(`Huerfanas en storefront:        ${orphanStorefront.length}`);
console.log(`Huerfanas en schema:            ${orphanSchema.length}`);

for (const [label, rows] of [['SIN RESOLVER (storefront)', unresolvedStorefront], ['SIN RESOLVER (schema)', unresolvedSchema]]) {
  if (rows.length === 0) continue;
  console.log(`\n${label}`);
  for (const [key, where] of rows) console.log(`  ${key}  <-  ${[...new Set(where)].join(', ')}`);
}

if (dynamicRefs.length > 0) {
  console.log('\nREFERENCIAS CONSTRUIDAS EN RUNTIME (revisar a mano)');
  for (const ref of dynamicRefs) console.log(`  ${ref.file}:${ref.line}  ${ref.text}`);
}

if (orphanStorefront.length > 0) {
  console.log('\nHUERFANAS EN STOREFRONT (definidas y nunca referenciadas)');
  for (const key of orphanStorefront) console.log(`  ${key}`);
}
if (orphanSchema.length > 0) {
  console.log('\nHUERFANAS EN SCHEMA (definidas y nunca referenciadas)');
  for (const key of orphanSchema) console.log(`  ${key}`);
}

console.log(`\n${line()}`);
const bad = unresolvedStorefront.length + unresolvedSchema.length;
if (bad > 0) {
  console.error(`FALLO: ${bad} referencias sin resolver.`);
  process.exit(1);
}
console.log('OK: todas las referencias estaticas resuelven contra los locales.');
if (dynamicRefs.length > 0) {
  console.log(`AVISO: ${dynamicRefs.length} referencias se construyen en runtime y quedan sin cobertura estatica.`);
}
