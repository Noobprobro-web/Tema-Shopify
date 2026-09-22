#!/usr/bin/env node
/*
 * locale-parity.mjs (MULTI-LANG-001)
 * Compara cada locales/*.json de storefront con locales/en.default.json.
 * Theme Check (MatchingTranslations) ya detecta claves que faltan o sobran; este script
 * detecta lo que Theme Check no ve, verificado con una mutacion en MULTI-LANG-001:
 *   1. Variables {{ x }} que se pierden, se renombran o se inventan en la traduccion.
 *   2. Etiquetas HTML distintas en las claves *_html.
 *   3. Valores vacios o que no son cadenas.
 *   4. Grupos plurales (one/other) incompletos.
 * Uso: node locale-parity.mjs [raiz-del-tema]
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '.');
const dir = path.join(ROOT, 'locales');
const flatten = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) => {
  const key = prefix ? `${prefix}.${k}` : k;
  return v && typeof v === 'object' ? flatten(v, key) : [[key, v]];
});
const vars = (s) => [...String(s).matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)].map((m) => m[1]).sort().join(',');
const tags = (s) => [...String(s).matchAll(/<\/?[a-z][\w-]*/gi)].map((m) => m[0].toLowerCase()).sort().join(',');

const base = new Map(flatten(JSON.parse(await readFile(path.join(dir, 'en.default.json'), 'utf8'))));
const files = (await readdir(dir)).filter((f) => f.endsWith('.json') && !f.includes('schema') && f !== 'en.default.json');
let failures = 0;

for (const file of files) {
  const map = new Map(flatten(JSON.parse(await readFile(path.join(dir, file), 'utf8'))));
  const problems = [];
  for (const [key, value] of base) {
    if (!map.has(key)) { problems.push(`falta ${key}`); continue; }
    const t = map.get(key);
    if (typeof t !== 'string' || t.trim() === '') problems.push(`vacia ${key}`);
    else {
      if (vars(value) !== vars(t)) problems.push(`variables ${key}: [${vars(value)}] -> [${vars(t)}]`);
      if (key.endsWith('_html') && tags(value) !== tags(t)) problems.push(`html ${key}`);
    }
  }
  for (const key of map.keys()) if (!base.has(key)) problems.push(`sobra ${key}`);
  const plural = [...base.keys()].filter((k) => /\.(one|other)$/.test(k)).map((k) => k.replace(/\.(one|other)$/, ''));
  for (const group of new Set(plural)) {
    if (!map.has(`${group}.one`) || !map.has(`${group}.other`)) problems.push(`plural incompleto ${group}`);
  }
  console.log(`${file}: ${map.size} claves, ${problems.length} problemas`);
  problems.forEach((p) => console.log(`  ${p}`));
  failures += problems.length;
}
if (!files.length) console.log('No hay locales de storefront ademas de en.default.json.');
process.exit(failures ? 1 : 0);
