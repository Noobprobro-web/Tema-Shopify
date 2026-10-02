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

const files = await walk(REPO);
const failures = [];
const shopImages = [];

for (const file of files) {
  const rel = path.relative(REPO, file).split(path.sep).join('/');
  try {
    // Los JSON de Shopify pueden traer BOM; JSON.parse no lo tolera.
    const data = JSON.parse((await readFile(file, 'utf8')).replace(/^﻿/, ''));
    if (THEME_DIRS.has(rel.split('/')[0])) {
      for (const hit of findShopImages(data, '$', [])) shopImages.push({ rel, ...hit });
    }
  } catch (error) {
    failures.push({ rel, message: error.message });
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

console.log('\nALCANCE: comprueba que el JSON parsee. No comprueba que el schema');
console.log('sea semanticamente valido para Shopify: eso lo cubre Theme Check');
console.log('en las carpetas de tema, y nadie en /listings/.');

if (failures.length > 0 || shopImages.length > 0) process.exitCode = 1;
