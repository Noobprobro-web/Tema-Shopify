#!/usr/bin/env node
// C-01 · exporta a un directorio limpio el tema exacto de (commit, preset), listo
// para un `shopify theme push` completo (sin --only, sin --nodelete). Es el mismo
// contenido que identity.mjs espera encontrar despues en la preview.
//
// Uso: node build-export.mjs --commit <sha> --preset <Sartorial|Imprint|Archive> --out <dir>
// Escribe <dir>/../<nombre>.manifest.json con el SHA-256 de cada archivo.
// No toca la tienda ni la red.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { expectedTheme, presetKey, resolveCommit, sha256 } from './lib.mjs';

const args = process.argv.slice(2);
const get = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const ref = get('--commit');
const preset = get('--preset');
const out = get('--out');
if (!ref || !preset || !out) {
  process.stderr.write('build-export: uso --commit <sha> --preset <preset> --out <dir>\n');
  process.exit(2);
}
const dir = path.resolve(out);
if (existsSync(dir) && readdirSync(dir).length) {
  process.stderr.write('build-export: el directorio de salida debe estar vacio\n');
  process.exit(2);
}
const commit = resolveCommit(ref);
const key = presetKey(preset);
const files = expectedTheme(commit, key);
const manifest = { commit, preset: key, files: {} };
for (const [file, { buf }] of [...files].sort(([a], [b]) => a.localeCompare(b))) {
  const target = path.join(dir, file);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, buf);
  manifest.files[file] = sha256(buf);
}
const manifestPath = `${dir.replace(/[\\/]+$/, '')}.manifest.json`;
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`export commit=${commit.slice(0, 7)} preset=${key} files=${files.size} manifest=${path.basename(manifestPath)}\n`);
