#!/usr/bin/env node
/*
 * dataset-hooks.mjs
 *
 * Cruza, POR COMPONENTE, los data-* que cada Web Component LEE contra los que
 * emite el Liquid que lo monta.
 *
 * Existe por un error real: al unificar el formateo de moneda, un `cp` masivo
 * sobreescribio dos archivos Liquid y dejo a `theme.js` leyendo un
 * `data-money-format` que ese componente ya no recibia. Ningun otro gate lo
 * detecta: Theme Check no cruza JS con Liquid, y el sintoma en produccion
 * habria sido un precio mal formateado en busqueda predictiva.
 *
 * Una primera version de este script comprobaba si el atributo existia en
 * CUALQUIER Liquid, y no detectaba el fallo porque otro componente si lo
 * emitia. El alcance por componente es el que sirve.
 *
 * Exentas: las claves que el propio JS escribe (dataset.x = ...), que son
 * estado de runtime y no contrato con Liquid.
 *
 * Uso: node scripts/dataset-hooks.mjs
 * Sin dependencias. Sale 1 si un contrato esta roto.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS_FILE = path.join(REPO, 'assets', 'theme.js');
const LIQUID_DIRS = ['sections', 'snippets', 'layout', 'templates', 'blocks'];

const toAttribute = (camel) => `data-${camel.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

async function collect(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(full, out);
    else if (entry.name.endsWith('.liquid')) {
      out.push({ rel: path.relative(REPO, full).split(path.sep).join('/'), body: await readFile(full, 'utf8') });
    }
  }
  return out;
}

const js = await readFile(JS_FILE, 'utf8');
const files = (await Promise.all(LIQUID_DIRS.map((d) => collect(path.join(REPO, d))))).flat();

// Claves que el propio JS escribe: exentas en todo el archivo.
const written = new Set();
for (const m of js.matchAll(/dataset\.([A-Za-z][A-Za-z0-9]*)\s*=[^=]/g)) written.add(m[1]);
for (const m of js.matchAll(/delete\s+[^;]*?dataset\.([A-Za-z][A-Za-z0-9]*)/g)) written.add(m[1]);

// class X extends ThemeElement { ... }  ->  cuerpo por llaves balanceadas.
const classes = new Map();
for (const m of js.matchAll(/class\s+([A-Za-z0-9_]+)\s+extends\s+[A-Za-z0-9_.]+\s*\{/g)) {
  let depth = 0;
  let i = m.index + m[0].length - 1;
  const start = i;
  for (; i < js.length; i += 1) {
    if (js[i] === '{') depth += 1;
    else if (js[i] === '}') { depth -= 1; if (depth === 0) break; }
  }
  classes.set(m[1], js.slice(start, i));
}

// customElements.define('tag', Class)
const tagOf = new Map();
for (const m of js.matchAll(/customElements\.define\(\s*['"]([a-z][a-z0-9-]*)['"]\s*,\s*([A-Za-z0-9_]+)\s*\)/g)) {
  tagOf.set(m[2], m[1]);
}

const rows = [];
const broken = [];

for (const [className, body] of classes) {
  const tag = tagOf.get(className);
  if (!tag) continue;
  const keys = new Set();
  for (const m of body.matchAll(/this\.dataset\.([A-Za-z][A-Za-z0-9]*)/g)) {
    if (!written.has(m[1])) keys.add(m[1]);
  }
  if (keys.size === 0) continue;

  const mounts = files.filter((f) => f.body.includes(`<${tag}`));
  if (mounts.length === 0) {
    broken.push(`<${tag}> (${className}) lee ${keys.size} data-* y ningún Liquid lo monta`);
    continue;
  }
  const missing = [];
  for (const key of [...keys].sort()) {
    const attr = toAttribute(key);
    const emitters = mounts.filter((f) => f.body.includes(attr));
    if (emitters.length === 0) {
      missing.push(`${attr} (lo monta ${mounts.map((f) => f.rel).join(', ')} y ninguno lo emite)`);
    }
  }
  rows.push({ tag, className, keys: keys.size, mounts: mounts.length, missing: missing.length });
  for (const m of missing) broken.push(`<${tag}>: ${m}`);
}

console.log('-'.repeat(74));
console.log('DATASET HOOKS  (contrato JS <-> Liquid, por componente)');
console.log('-'.repeat(74));
console.log(`Componentes con data-* de contrato: ${rows.length}`);
console.log(`Exentas por escritura en runtime:   ${[...written].sort().join(', ') || 'ninguna'}`);
for (const r of rows) {
  const flag = r.missing ? `  <-- ${r.missing} SIN EMITIR` : '';
  console.log(`  ${`<${r.tag}>`.padEnd(28)} ${String(r.keys).padStart(2)} claves  ${r.mounts} montaje(s)${flag}`);
}
console.log(`\nContratos rotos: ${broken.length}`);
for (const b of broken) console.log(`  ${b}`);

console.log('\nALCANCE: comprueba que el Liquid que monta el componente emita el atributo.');
console.log('No comprueba que esté dentro de la etiqueta de apertura ni que su valor');
console.log('sea válido en runtime.');

if (broken.length > 0) process.exitCode = 1;
