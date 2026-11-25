#!/usr/bin/env node
/*
 * json-validate.mjs
 *
 * Valida que TODO archivo .json del repositorio parsee. Existe porque Shopify
 * Theme Check solo inspecciona las carpetas de tema: los nueve templates de
 * /listings/, que son los que abre el revisor de la Theme Store para juzgar
 * cada preset, quedan fuera de su alcance. Un JSON roto ahi no lo detecta
 * ninguna otra compuerta.
 *
 * Uso: node scripts/json-validate.mjs
 * Sin dependencias. Sale 1 si algun archivo no parsea.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// scratch/ guarda los volcados de shopify theme pull: Shopify los exporta con una
// cabecera de comentario /* */ delante del objeto, asi que no parsean como JSON y no
// son archivos del tema. Sin esta exclusion la compuerta nunca puede salir 0.
const SKIP = new Set(['node_modules', '.git', '.tmp', 'test-results', 'playwright-report', 'dist', 'scratch']);

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

// Reja shop_images: una URI shopify://shop_images/ apunta a la biblioteca de
// archivos de UNA tienda concreta. En el tema publicado o en un preset de /listings/
// se rompe en cualquier otra tienda. Solo se veta ese prefijo: shopify://collections/,
// products/, apps/ etc. son referencias validas. startsWith sobre valores, sin regex.
const THEME_DIRS = new Set(['layout', 'sections', 'snippets', 'templates', 'config', 'locales', 'assets', 'blocks', 'listings']);
const SHOP_IMAGES = 'shopify://shop_images/';

function findShopImages(node, at, out) {
  if (typeof node === 'string') {
    if (node.startsWith(SHOP_IMAGES)) out.push({ at, value: node });
  } else if (Array.isArray(node)) {
    node.forEach((item, i) => findShopImages(item, `${at}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      const seg = /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
      findShopImages(value, at + seg, out);
    }
  }
  return out;
}

// Defaults vacios: Shopify rechaza al subir un ajuste de schema (seccion, bloque o
// config/settings_schema.json) con "default": "" ("default can't be blank"). Theme Check y
// el resto de compuertas no lo ven; solo lo detecta el servidor. Un ajuste sin default
// queda vacio igualmente, que es lo que se pretende al escribir "".
function findBlankDefaults(node, at, out) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => findBlankDefaults(item, `${at}[${i}]`, out));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      const seg = /^[A-Za-z_$][\w$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
      if (key === 'default' && typeof value === 'string' && value.trim() === '') {
        out.push({ at: at + seg, id: node.id ?? node.type ?? '?' });
      } else {
        findBlankDefaults(value, at + seg, out);
      }
    }
  }
  return out;
}

// Extrae el JSON de {% schema %} de un .liquid y devuelve los defaults vacios.
export function blankDefaultsInLiquid(source) {
  const match = /\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/.exec(source);
  if (!match) return [];
  return findBlankDefaults(JSON.parse(match[1]), '$', []);
}

// Autoprueba: el detector tiene que fallar con el codigo defectuoso (R3, S1) y pasar sin el.
function selfTest() {
  const bad = '{% schema %}{"settings":[{"type":"text","id":"caption","label":"x","default":""}]}{% endschema %}';
  const ok = '{% schema %}{"settings":[{"type":"text","id":"caption","label":"x"}]}{% endschema %}';
  const badBlock = '{% schema %}{"blocks":[{"type":"b","settings":[{"type":"text","id":"t","default":"  "}]}]}{% endschema %}';
  if (blankDefaultsInLiquid(bad).length !== 1) throw new Error('autoprueba: no detecta default vacio');
  if (blankDefaultsInLiquid(badBlock).length !== 1) throw new Error('autoprueba: no detecta default en blanco en bloque');
  if (blankDefaultsInLiquid(ok).length !== 0) throw new Error('autoprueba: falso positivo');
}

const files = await walk(REPO);
const failures = [];
const shopImages = [];
const blankDefaults = [];
selfTest();

for (const file of files) {
  const rel = path.relative(REPO, file).split(path.sep).join('/');
  try {
    // Los JSON de Shopify pueden traer BOM; JSON.parse no lo tolera.
    const data = JSON.parse((await readFile(file, 'utf8')).replace(/^﻿/, ''));
    if (THEME_DIRS.has(rel.split('/')[0])) {
      for (const hit of findShopImages(data, '$', [])) shopImages.push({ rel, ...hit });
    }
    if (rel === 'config/settings_schema.json') {
      for (const hit of findBlankDefaults(data, '$', [])) blankDefaults.push({ rel, ...hit });
    }
  } catch (error) {
    failures.push({ rel, message: error.message });
  }
}

for (const dir of ['sections', 'blocks', 'snippets']) {
  let names = [];
  try { names = await readdir(path.join(REPO, dir)); } catch { /* carpeta opcional */ }
  for (const name of names.filter((n) => n.endsWith('.liquid'))) {
    const rel = `${dir}/${name}`;
    try {
      for (const hit of blankDefaultsInLiquid(await readFile(path.join(REPO, rel), 'utf8'))) {
        blankDefaults.push({ rel, ...hit });
      }
    } catch (error) {
      failures.push({ rel, message: `schema: ${error.message}` });
    }
  }
}

const inListings = files.filter((f) => f.includes(`${path.sep}listings${path.sep}`)).length;
console.log('-'.repeat(70));
console.log('JSON VALIDATE');
console.log('-'.repeat(70));
console.log(`Archivos .json comprobados: ${files.length}`);
console.log(`  de ellos en /listings/:    ${inListings}  <- fuera del alcance de Theme Check`);
console.log(`Fallos de parseo:           ${failures.length}`);
for (const f of failures) console.log(`  ${f.rel}: ${f.message}`);
console.log(`URIs shopify://shop_images/: ${shopImages.length}  <- solo carpetas de tema y /listings/`);
for (const h of shopImages) console.log(`  ${h.rel} ${h.at}: ${h.value}`);
console.log(`Schemas con "default" vacio: ${blankDefaults.length}  <- Shopify los rechaza al subir`);
for (const h of blankDefaults) console.log(`  ${h.rel} ${h.at} (ajuste ${h.id})`);

console.log('\nALCANCE: comprueba que el JSON parsee. No comprueba que el schema');
console.log('sea semanticamente valido para Shopify: eso lo cubre Theme Check');
console.log('en las carpetas de tema, y nadie en /listings/.');

if (failures.length > 0 || shopImages.length > 0 || blankDefaults.length > 0) process.exitCode = 1;
