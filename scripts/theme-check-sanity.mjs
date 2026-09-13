#!/usr/bin/env node
/*
 * theme-check-sanity.mjs
 *
 * Comprueba que Theme Check es capaz de detectar errores antes de que
 * confiemos en un resultado en verde. Copia solo las carpetas del tema a un
 * sandbox dentro del repositorio, inyecta tres errores de clases distintas,
 * ejecuta Theme Check y verifica que los tres se reporten.
 *
 * Un verde de Theme Check sobre el repo solo es evidencia si este script
 * termina en 0. Si termina en 1, la compuerta no funciona y hay que
 * averiguar por qué antes de seguir.
 *
 * Uso: node scripts/theme-check-sanity.mjs [--keep]
 * Sin dependencias. Node 18 o superior. Funciona en Windows, macOS y Linux.
 */

import { cp, mkdir, rm, readFile, writeFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const REPO = path.resolve(import.meta.dirname, '..');
const SANDBOX = path.join(REPO, '.tmp', 'theme-check-sanity');
const KEEP = process.argv.includes('--keep');

// Solo carpetas de tema. Nunca .git, node_modules, listings, docs ni agent-comms.
const THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'blocks'];

/*
 * Cada mutacion se ejecuta en su propia pasada, con el archivo restaurado
 * entre una y otra. Esto no es por prolijidad: un error de sintaxis Liquid
 * detiene el parseo del archivo, asi que dos mutaciones en el mismo archivo
 * se tapan entre si y la segunda nunca se reporta. Probado: agrupar
 * LiquidHTMLSyntaxError y TranslationKeyExists en un solo archivo hace que
 * la segunda no aparezca, y el script concluiria en falso que la compuerta
 * no detecta claves de traduccion.
 */
const MUTATIONS = [
  {
    check: 'LiquidHTMLSyntaxError',
    file: 'sections/main-page.liquid',
    apply: (src) => `${src}\n{% if true %}\n`,
    why: 'etiqueta Liquid sin cerrar',
  },
  {
    check: 'TranslationKeyExists',
    file: 'sections/main-blog.liquid',
    apply: (src) => `${src}\n{{ 'sanity.key.that.does.not.exist' | t }}\n`,
    why: 'clave de traduccion inexistente',
  },
  {
    check: 'ValidSchemaTranslations',
    file: 'sections/main-placeholder.liquid',
    apply: (src) => src.replace(/"name":\s*"[^"]*"/, '"name": "t:sanity.schema.key.that.does.not.exist"'),
    why: 'clave t: de schema inexistente',
  },
];

function fail(message) {
  console.error(`\n[theme-check-sanity] FALLO: ${message}`);
  process.exit(1);
}

// Guarda de ruta: el sandbox tiene que quedar dentro del repositorio.
const relative = path.relative(REPO, SANDBOX);
if (relative.startsWith('..') || path.isAbsolute(relative)) {
  fail(`el sandbox quedaria fuera del repositorio: ${SANDBOX}`);
}

await rm(SANDBOX, { recursive: true, force: true });
await mkdir(SANDBOX, { recursive: true });

let copied = 0;
for (const dir of THEME_DIRS) {
  const from = path.join(REPO, dir);
  try {
    await access(from);
  } catch {
    continue; // carpeta opcional, por ejemplo blocks
  }
  await cp(from, path.join(SANDBOX, dir), { recursive: true });
  copied += 1;
}

if (copied === 0) fail('no se copio ninguna carpeta de tema, revisa la ruta del repositorio');
console.log(`[theme-check-sanity] sandbox en .tmp/theme-check-sanity con ${copied} carpetas de tema`);

function runThemeCheck() {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const targetPath = process.platform === 'win32' ? `"${SANDBOX}"` : SANDBOX;
  const run = spawnSync(npx, ['shopify', 'theme', 'check', '--path', targetPath], {
    encoding: 'utf8',
    env: { ...process.env, CI: '1', SHOPIFY_CLI_NO_ANALYTICS: '1' },
    shell: process.platform === 'win32',
  });
  if (run.error) fail(`no se pudo ejecutar Theme Check: ${run.error.message}`);
  return `${run.stdout || ''}${run.stderr || ''}`;
}

const notDetected = [];

for (const mutation of MUTATIONS) {
  const target = path.join(SANDBOX, mutation.file);
  let original;
  try {
    original = await readFile(target, 'utf8');
  } catch {
    fail(`no existe el archivo a mutar: ${mutation.file}. Ajusta MUTATIONS.`);
  }

  const mutated = mutation.apply(original);
  if (mutated === original) fail(`la mutacion de ${mutation.check} no cambio ${mutation.file}`);

  await writeFile(target, mutated, 'utf8');
  const output = runThemeCheck();
  await writeFile(target, original, 'utf8');

  const detected = output.includes(mutation.check);
  console.log(
    `[theme-check-sanity] ${detected ? 'detectado ' : 'NO DETECTADO '}`
    + `${mutation.check} (${mutation.why}) en ${mutation.file}`,
  );
  if (!detected) notDetected.push({ ...mutation, output });
}

// Con los archivos ya restaurados, el sandbox debe volver a estar limpio.
const baseline = runThemeCheck();
const baselineClean = /no offenses found/i.test(baseline);

if (!KEEP) await rm(path.join(REPO, '.tmp'), { recursive: true, force: true });

if (notDetected.length > 0) {
  console.error(notDetected[0].output);
  fail(
    `Theme Check no reporto ${notDetected.map((m) => m.check).join(', ')}. `
    + 'La compuerta no detecta esas clases de error, asi que un verde no prueba nada sobre ellas.',
  );
}

if (!baselineClean) {
  console.error(baseline);
  fail('el sandbox restaurado no quedo limpio, asi que las mutaciones no se revirtieron bien');
}

console.log(
  `\n[theme-check-sanity] OK. Las ${MUTATIONS.length} clases se detectaron por separado `
  + 'y el sandbox restaurado volvio a 0 ofensas.',
);
console.log(
  '[theme-check-sanity] ALCANCE DE ESTA PRUEBA: demuestra que esos tres checks estan activos '
  + 'y que disparan sobre archivos de tema. No demuestra cobertura exhaustiva de todas las '
  + 'referencias de traduccion. Para eso corre scripts/locale-key-inventory.mjs.',
);
