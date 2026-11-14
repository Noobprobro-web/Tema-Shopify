#!/usr/bin/env node
// C-01 · comprobacion previa a borrar previews temporales. Solo lee archivos:
// no invoca el CLI ni borra nada. Imprime los IDs que se pueden borrar.
//
// Uso: node cleanup-check.mjs --dir $C01
//   $C01/ledger.jsonl            una linea JSON por tema creado: {"preset","name","id"}
//   $C01/list-0-<preset>.json    `shopify theme list --json` justo antes del push de ese preset
//   $C01/list-final.json         `shopify theme list --json` justo antes de borrar
// Sale con 0 solo si todas las entradas del ledger son borrables; con 1 si alguna no.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { deleteCandidates } from './lib.mjs';

const argv = process.argv.slice(2);
const i = argv.indexOf('--dir');
const dir = i >= 0 ? argv[i + 1] : null;
if (!dir) {
  process.stderr.write('cleanup-check: uso --dir <directorio de trabajo>\n');
  process.exit(2);
}
const readList = (file) => {
  const text = readFileSync(file, 'utf8');
  return JSON.parse(text.slice(text.indexOf('[')));
};
const ledgerFile = path.join(dir, 'ledger.jsonl');
if (!existsSync(ledgerFile)) {
  process.stderr.write('cleanup-check: falta ledger.jsonl\n');
  process.exit(2);
}
const ledger = readFileSync(ledgerFile, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
const listsBefore = {};
for (const preset of new Set(ledger.map((e) => e.preset))) {
  const file = path.join(dir, `list-0-${String(preset).toLowerCase()}.json`);
  if (existsSync(file)) listsBefore[preset] = readList(file);
}
const finalFile = path.join(dir, 'list-final.json');
if (!existsSync(finalFile)) {
  process.stderr.write('cleanup-check: falta list-final.json\n');
  process.exit(2);
}
const rows = deleteCandidates({ ledger, listsBefore, listFinal: readList(finalFile) });
for (const r of rows) process.stdout.write(`${r.ok ? 'BORRABLE   ' : 'NO_BORRAR  '} ${r.id} ${r.name}${r.ok ? '' : ` · ${r.reasons.join('; ')}`}\n`);
process.exit(rows.every((r) => r.ok) ? 0 : 1);
