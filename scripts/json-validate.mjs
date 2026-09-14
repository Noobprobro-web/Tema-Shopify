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
const SKIP = new Set(['node_modules', '.git', '.tmp', 'test-results', 'playwright-report', 'dist']);

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

const files = await walk(REPO);
const failures = [];

for (const file of files) {
  const rel = path.relative(REPO, file).split(path.sep).join('/');
  try {
    // Los JSON de Shopify pueden traer BOM; JSON.parse no lo tolera.
    JSON.parse((await readFile(file, 'utf8')).replace(/^﻿/, ''));
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

console.log('\nALCANCE: comprueba que el JSON parsee. No comprueba que el schema');
console.log('sea semanticamente valido para Shopify: eso lo cubre Theme Check');
console.log('en las carpetas de tema, y nadie en /listings/.');

if (failures.length > 0) process.exitCode = 1;
