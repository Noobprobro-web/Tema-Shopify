#!/usr/bin/env node
/*
 * ledger-verify.mjs
 *
 * Compuerta estructural del Requirements Ledger. Comprueba lo que una maquina
 * puede comprobar y NADA MAS.
 *
 * QUE VERIFICA
 *   1. Vocabulario cerrado: solo cumplido, codigo completo, no verificado, ausente.
 *   2. Integridad de fila: las seis columnas presentes y no vacias.
 *   3. Aritmetica: el conteo del encabezado coincide con la tabla. --fix lo reescribe.
 *   4. Localizadores: toda cita "archivo:linea" existe y la linea esta en rango.
 *
 * QUE NO VERIFICA, Y NUNCA DEBE
 *   Si una evidencia es PERTINENTE al requisito. Que la linea 58 exista no
 *   demuestra que pruebe nada. Este script jamas marca una fila como cumplida
 *   ni cambia un estado: solo falla por incoherencias mecanicas. El juicio
 *   sobre suficiencia de evidencia es humano y sigue siendo de Gemini.
 *
 * Uso: node scripts/ledger-verify.mjs [--fix]
 * Sin dependencias. Sale 1 si hay incoherencias.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEDGER = path.join(REPO, 'docs', 'requirements-ledger.md');
const FIX = process.argv.includes('--fix');

const VOCABULARY = ['cumplido', 'código completo', 'no verificado', 'ausente'];
const SEARCH_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'scripts', 'tests', 'blocks', 'listings'];

const problems = [];
const note = (kind, line, message) => problems.push({ kind, line, message });

// ---- indice de nombres de archivo, para resolver citas sin carpeta ----
async function indexFiles(dir, index = new Map()) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return index; }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await indexFiles(full, index);
    else {
      if (!index.has(entry.name)) index.set(entry.name, []);
      index.get(entry.name).push(full);
    }
  }
  return index;
}

const index = new Map();
for (const dir of SEARCH_DIRS) await indexFiles(path.join(REPO, dir), index);

const source = await readFile(LEDGER, 'utf8');
const lines = source.split('\n');

// ---- 1, 2 y 4: filas ----
const states = [];
for (let i = 0; i < lines.length; i += 1) {
  const raw = lines[i];
  if (!raw.trim().startsWith('| **')) continue;
  const cells = raw.split(/(?<!\\)\|/).map((c) => c.trim());
  // | Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
  const [, requisito, fuente, estado, evidencia, dueno, sprint] = cells;
  const n = i + 1;

  if (cells.length - 2 !== 6) {
    note('estructura', n, `la fila tiene ${cells.length - 2} columnas y deben ser 6`);
  }
  for (const [name, value] of [['Fuente', fuente], ['Evidencia', evidencia], ['Dueño', dueno], ['Sprint', sprint]]) {
    if (!value) note('estructura', n, `columna ${name} vacía en "${requisito.replace(/\*/g, '').slice(0, 50)}"`);
  }

  const match = estado.match(/^`([^`]+)`$/);
  if (!match) {
    note('vocabulario', n, `estado sin backticks o ilegible: ${estado.slice(0, 60)}`);
    continue;
  }
  const state = match[1];
  states.push(state);
  if (!VOCABULARY.includes(state)) {
    note('vocabulario', n, `estado "${state}" fuera del vocabulario cerrado (${VOCABULARY.join(', ')})`);
  }

  for (const loc of evidencia.matchAll(/([A-Za-z0-9_\-/.]+\.(?:liquid|json|js|css|mjs)):(\d+)(?:\s*[-–]\s*(\d+))?/g)) {
    const [whole, file, from, to] = loc;
    let target = path.join(REPO, file);
    let exists = index.has(path.basename(file))
      && (index.get(path.basename(file)).includes(target) || !file.includes('/'));
    if (!file.includes('/')) {
      const candidates = index.get(path.basename(file)) || [];
      if (candidates.length === 0) { note('localizador', n, `${whole}: el archivo no existe`); continue; }
      if (candidates.length > 1) { note('localizador', n, `${whole}: nombre ambiguo, ${candidates.length} coincidencias`); continue; }
      target = candidates[0];
      exists = true;
    } else if (!(index.get(path.basename(file)) || []).includes(target)) {
      note('localizador', n, `${whole}: el archivo no existe en esa ruta`);
      continue;
    }
    const total = (await readFile(target, 'utf8')).split('\n').length;
    const last = Number(to || from);
    if (Number(from) < 1 || last > total) {
      note('localizador', n, `${whole}: fuera de rango, el archivo tiene ${total} líneas`);
    }
  }
}

// ---- 3: aritmética del encabezado ----
const counts = Object.fromEntries(VOCABULARY.map((v) => [v, 0]));
for (const s of states) if (s in counts) counts[s] += 1;

const summary = `CONTEO CALCULADO: ${states.length} filas | `
  + VOCABULARY.map((v) => `${counts[v]} ${v}`).join(' | ');

const headerLine = lines.findIndex((l) => l.startsWith('CONTEO'));
if (headerLine === -1) {
  note('aritmética', 0, 'no se encontró la línea CONTEO en el encabezado');
} else if (lines[headerLine] !== summary) {
  note('aritmética', headerLine + 1, `el encabezado dice "${lines[headerLine]}" y la tabla dice "${summary}"`);
  if (FIX) {
    lines[headerLine] = summary;
    const desglose = lines.findIndex((l) => l.startsWith('Desglose'));
    if (desglose !== -1) lines[desglose] = `Desglose recalculado por scripts/ledger-verify.mjs el ${new Date().toISOString().slice(0, 10)}.`;
    await writeFile(LEDGER, lines.join('\n'), 'utf8');
    console.log('[ledger-verify] encabezado reescrito con el conteo real');
  }
}

// ---- informe ----
console.log('-'.repeat(70));
console.log('LEDGER VERIFY');
console.log('-'.repeat(70));
console.log(`Filas de requisito: ${states.length}`);
for (const v of VOCABULARY) console.log(`  ${String(counts[v]).padStart(3)}  ${v}`);
const fuera = states.filter((s) => !VOCABULARY.includes(s));
if (fuera.length) console.log(`  ${String(fuera.length).padStart(3)}  FUERA DE VOCABULARIO`);

const byKind = problems.reduce((acc, p) => ({ ...acc, [p.kind]: (acc[p.kind] || 0) + 1 }), {});
console.log(`\nIncoherencias: ${problems.length}`, problems.length ? byKind : '');
for (const p of problems) console.log(`  [${p.kind}] línea ${p.line}: ${p.message}`);

console.log(`\n${'-'.repeat(70)}`);
console.log('ALCANCE: esta compuerta comprueba vocabulario, estructura, aritmética y');
console.log('localizadores. NO comprueba que una evidencia pruebe su requisito, y');
console.log('nunca marca una fila como cumplida. Eso sigue siendo juicio humano.');

if (problems.length > 0 && !(FIX && problems.every((p) => p.kind === 'aritmética'))) {
  process.exitCode = 1;
}
