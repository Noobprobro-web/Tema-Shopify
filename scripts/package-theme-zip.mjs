#!/usr/bin/env node
/*
 * package-theme-zip.mjs
 *
 * Empaquetador determinista del ZIP del tema (decision D21, Johandry 2026-11-04).
 *
 * CONTRATO DETERMINISTA. Para una misma revision de git (historial completo,
 * no superficial) y una misma implementacion de zlib, la salida es identica bit
 * a bit entre ejecuciones; entre maquinas lo es si comparten esa implementacion
 * de zlib (ver mas abajo). Con otra zlib el contenido sigue igual y lo prueba la
 * huella de contenido (--expect-content-sha256), que no depende de zlib:
 *   - Fuente: blobs de git de la revision (git ls-tree -r + git cat-file),
 *     nunca el arbol de trabajo. Los bytes son LF tal como estan en git; si un
 *     blob de texto incluido contiene CR (0x0D) el script falla (no hay
 *     normalizacion). Regla de texto: extension .liquid .json .css .js .svg .md
 *     .txt y ademas sin bytes NUL; cualquier otro blob (p. ej. PNG, fuentes) se
 *     trata como binario y no se inspecciona.
 *   - Inclusion: assets/ config/ layout/ locales/ sections/ snippets/
 *     templates/ listings/ y, si existen en la revision, blocks/ y
 *     update_extension.json (raiz; lo incluye el CLI 4.8.0). release-notes.md
 *     no se empaqueta. Menos las rutas de EXCLUDED_PATHS. Coincide con el
 *     `listings/**\/*` del CLI 4.8.0 (condicion (b) de la R0-002).
 *   - Orden: alfabetico por bytes UTF-8 de la ruta. Sin entradas de directorio.
 *   - Fecha: fecha de committer UTC del ultimo commit que modifico las rutas
 *     incluidas en esa revision (git log -1 --format="%H %ct" <rev> -- <dirs
 *     incluidos y archivos de raiz>, con :(exclude) por cada EXCLUDED_PATHS;
 *     los borrados cuentan; pathspecs :(literal), sin magia),
 *     convertida a fecha/hora DOS en UTC. DOS guarda segundos en pasos de 2 s:
 *     los segundos impares se redondean hacia abajo (floor al par). Sin campos
 *     extra (no extended timestamp). Un commit que solo toca documentacion no
 *     cambia el hash.
 *   - Metadatos: version made by = Unix (3) con version 2.0 (0x0314),
 *     external_attr = 0o100644 << 16, flags 0x0800 (UTF-8) por entrada, solo en
 *     las entradas cuya ruta no es ASCII; en las demas 0. Sin comentario ni
 *     extra.
 *   - Compresion: Deflate (metodo 8), zlib nivel 9, memLevel 8, windowBits 15
 *     (flujo raw), estrategia por defecto. El flujo comprimido depende de la
 *     implementacion de zlib: por eso se imprime process.versions.zlib. El hash
 *     canonico es reproducible con la misma version de zlib (y, en la practica,
 *     con las que emiten el mismo flujo para estos parametros).
 *   - CRC-32 con zlib.crc32 (Node >= 20.15/22.2) o implementacion propia.
 *
 * USO
 *   node scripts/package-theme-zip.mjs [--rev <rev>] --out <ruta.zip>
 *        [--expect-count N] [--expect-sha256 HEX] [--expect-content-sha256 HEX]
 *   --rev           revision git (por defecto HEAD).
 *   --out           ZIP de salida (obligatorio). Se rechaza una ruta dentro de
 *                   los directorios del tema del repo; usar una ruta fuera del
 *                   repo o ignorada (*.zip esta en .gitignore).
 *   Al empaquetar se avisa (sin fallar) de las referencias internas que queden en
 *   los archivos de texto del tema; ver INTERNAL_REFERENCE_PATTERN.
 *   --expect-count  falla (exit 1) si el numero de archivos no coincide.
 *   --expect-sha256 falla (exit 1) si el SHA-256 del ZIP no coincide.
 *   --expect-content-sha256  idem para la huella de contenido: SHA-256 (hex) del
 *                   texto formado por una linea por archivo, en el orden del
 *                   ZIP, `ruta\0tamano_decimal\0sha256_hex_del_contenido\n`
 *                   (ruta en UTF-8, NUL real entre campos, LF tras cada linea,
 *                   incluida la ultima). No depende de zlib ni de la fecha.
 *
 * CLON SUPERFICIAL: en un clon --depth N la fecha saldria del commit frontera y
 * el hash cambiaria; si ese es el caso el script falla con exit 1 (ejecutar
 * `git fetch --unshallow`).
 *
 * COMO VERIFICAR: generar dos veces en rutas distintas y comparar SHA-256;
 * generar con otra revision que solo cambie documentacion y comparar; revisar
 * con `unzip -t` y con zipfile de Python. Sin dependencias npm.
 */

import { deepStrictEqual } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Directorios del tema incluidos (prefijo de ruta). */
const INCLUDE_DIRS = [
  'assets/', 'config/', 'layout/', 'locales/', 'sections/', 'snippets/',
  'templates/', 'listings/', 'blocks/', // blocks/ solo si existe en la revision.
];
/**
 * Archivos de la raiz incluidos si existen en la revision. release-notes.md ya no
 * se empaqueta: las notas de version se entregan en el formulario del envio.
 */
const INCLUDE_ROOT_FILES = ['update_extension.json'];
/**
 * Internal-reference check (warning only for now). Theme files must not carry
 * task ids, people or tooling names. Occurrences are listed after packaging so
 * they can be cleaned up; they do not fail the build yet. Paths in
 * INTERNAL_REFERENCE_ALLOWED_PATHS are skipped.
 */
const INTERNAL_REFERENCE_PATTERN = /agent-comms|Johandry|GPT-|CLAUDE-|LEAD-|AUDIT|Sprint|\b[0-9][A-Z]-[0-9]{3}\b/g;
const INTERNAL_REFERENCE_ALLOWED_PATHS = [];
/**
 * Rutas exactas (relativas a la raiz) que se omiten del ZIP sin borrarse del
 * repo. C-04-P conserva las plantillas de documentación solo en el repositorio.
 */
const EXCLUDED_PATHS = [
  'templates/page.documentation.json',
  'templates/page.support.json',
  // Secciones de documentacion del vendedor: solo las usan las plantillas excluidas (D23).
  'sections/main-documentation.liquid',
  'sections/main-support.liquid',
];

/**
 * Contenido solo del repositorio. Las secciones de documentacion y soporte del
 * vendedor se quedan en el repo pero no viajan en el ZIP (ver EXCLUDED_PATHS). Su
 * CSS y JS llevan delimitadores de texto estables que se eliminan al empaquetar:
 *   CSS: a comment line `docs-only:start` ... a comment line `docs-only:end`
 *   JS:  the same two markers as `//` line comments
 * JSON no admite comentarios: las claves de locale se borran por su ruta exacta.
 * El empaquetado falla si falta un delimitador esperado, si quedan desparejados o
 * si tras quitarlos sigue habiendo alguna referencia en archivos del ZIP.
 */
const DOCS_ONLY_DELIMITED = {
  'assets/base.css': { start: '/* docs-only:start */', end: '/* docs-only:end */' },
  'assets/theme.js': { start: '// docs-only:start', end: '// docs-only:end' },
};
/** Rutas de clave a borrar por archivo de locale. El esquema usa `sections.*`, el resto claves de primer nivel. */
const DOCS_ONLY_LOCALE_KEYS = {
  schema: [['sections', 'main_documentation'], ['sections', 'main_support']],
  storefront: [['documentation'], ['support']],
};
/** Referencias que no deben sobrevivir en ningun archivo de texto del ZIP. */
const DOCS_ONLY_LEFTOVER = /main-documentation|main-support|support-form|\bdoc-[a-z]|copy-text|CopyText|data-copy-|main_documentation|main_support|docs-only/;
const DOCS_ONLY_LEFTOVER_KEYS = /['"]\s*(documentation|support)\.[a-z_]/;

function stripDelimited(p, text, { start, end }) {
  const lines = text.split('\n');
  const out = [];
  let open = false;
  let blocks = 0;
  for (const line of lines) {
    const t = line.trim();
    if (t === start) {
      if (open) fail('docs-only: delimitador de inicio anidado en ' + p);
      open = true;
      blocks++;
    } else if (t === end) {
      if (!open) fail('docs-only: delimitador de fin sin inicio en ' + p);
      open = false;
    } else if (!open) {
      out.push(line);
    }
  }
  if (open) fail('docs-only: bloque sin cerrar en ' + p);
  if (blocks === 0) fail('docs-only: faltan los delimitadores esperados en ' + p);
  return out.join('\n');
}

/** Borra una clave de un JSON de locale por texto (conserva el formato) y comprueba el resultado. */
function removeJsonKey(p, text, keyPath) {
  const lines = text.split('\n');
  const depth = keyPath.length;
  const key = keyPath[depth - 1];
  const indent = '  '.repeat(depth);
  const idx = lines.findIndex((l) => l.startsWith(indent + '"' + key + '": {') && l.trimEnd().endsWith('{'));
  if (idx === -1) fail('docs-only: falta la clave ' + keyPath.join('.') + ' en ' + p);
  let close = -1;
  for (let i = idx + 1; i < lines.length; i++) {
    if (lines[i] === indent + '}' || lines[i] === indent + '},') { close = i; break; }
  }
  if (close === -1) fail('docs-only: no se encontro el cierre de ' + keyPath.join('.') + ' en ' + p);
  const hadComma = lines[close].endsWith(',');
  lines.splice(idx, close - idx + 1);
  if (!hadComma && idx > 0 && lines[idx - 1].endsWith(',')) lines[idx - 1] = lines[idx - 1].slice(0, -1);
  return lines.join('\n');
}

function stripLocale(p, text) {
  const kind = p.endsWith('.schema.json') ? 'schema' : 'storefront';
  let out = text;
  for (const kp of DOCS_ONLY_LOCALE_KEYS[kind]) out = removeJsonKey(p, out, kp);
  const after = JSON.parse(out);
  const expected = JSON.parse(text);
  for (const kp of DOCS_ONLY_LOCALE_KEYS[kind]) {
    let node = expected;
    for (const k of kp.slice(0, -1)) node = node[k];
    delete node[kp[kp.length - 1]];
  }
  deepStrictEqual(after, expected);
  return out;
}

function applyDocsOnly(entries) {
  for (const e of entries) {
    if (!isTextBlob(e)) continue;
    let text = e.data.toString('utf8');
    if (DOCS_ONLY_DELIMITED[e.path]) text = stripDelimited(e.path, text, DOCS_ONLY_DELIMITED[e.path]);
    else if (/^locales\/[^/]+\.json$/.test(e.path)) text = stripLocale(e.path, text);
    else continue;
    e.data = Buffer.from(text, 'utf8');
  }
  const bad = [];
  for (const e of entries) {
    if (!isTextBlob(e)) continue;
    e.data.toString('utf8').split('\n').forEach((line, i) => {
      if (DOCS_ONLY_LEFTOVER.test(line) || DOCS_ONLY_LEFTOVER_KEYS.test(line)) bad.push(e.path + ':' + (i + 1));
    });
  }
  if (bad.length) fail('docs-only: quedan referencias a contenido solo del repositorio en el ZIP:\n  ' + bad.join('\n  '));
}

function fail(msg) {
  console.error('[package-theme-zip] ERROR: ' + msg);
  process.exit(1);
}

function git(args, opts = {}) {
  return execFileSync('git', args, { cwd: REPO, maxBuffer: 1 << 28, ...opts });
}

function parseArgs(argv) {
  const out = { rev: 'HEAD', out: null, count: null, sha: null, csha: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => {
      if (i + 1 >= argv.length) fail('falta valor para ' + a);
      return argv[++i];
    };
    if (a === '--rev') out.rev = val();
    else if (a === '--out') out.out = val();
    else if (a === '--expect-count') out.count = Number(val());
    else if (a === '--expect-sha256') out.sha = val().toLowerCase();
    else if (a === '--expect-content-sha256') out.csha = val().toLowerCase();
    else fail('argumento desconocido: ' + a);
  }
  if (!out.out) fail('--out es obligatorio');
  if (out.count !== null && !Number.isInteger(out.count)) fail('--expect-count debe ser entero');
  return out;
}

let crcTable = null;
function crc32(buf) {
  if (typeof zlib.crc32 === 'function') return zlib.crc32(buf) >>> 0;
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Epoch (s) -> {time, date} DOS en UTC; segundos impares se redondean abajo. */
function dosDateTime(epoch) {
  const d = new Date(epoch * 1000);
  const y = d.getUTCFullYear();
  if (y < 1980 || y > 2107) fail('fecha fuera del rango DOS: ' + d.toISOString());
  return {
    time: (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | (d.getUTCSeconds() >> 1),
    date: ((y - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate(),
  };
}

function isIncluded(p) {
  if (EXCLUDED_PATHS.includes(p)) return false;
  return INCLUDE_ROOT_FILES.includes(p) || INCLUDE_DIRS.some((d) => p.startsWith(d));
}

const TEXT_EXT = ['.liquid', '.json', '.css', '.js', '.svg', '.md', '.txt'];
/** Texto = extension de TEXT_EXT y sin NUL; lo demas es binario (no se inspecciona CR). */
function isTextBlob(e) {
  return TEXT_EXT.some((x) => e.path.toLowerCase().endsWith(x)) && !e.data.includes(0x00);
}

function collect(commit) {
  const raw = git(['ls-tree', '-r', '-z', '--full-tree', commit]).toString('utf8');
  const entries = [];
  for (const rec of raw.split('\0')) {
    if (!rec) continue;
    const tab = rec.indexOf('\t');
    const [mode, type, sha] = rec.slice(0, tab).split(' ');
    const p = rec.slice(tab + 1);
    if (!isIncluded(p)) continue;
    if (type !== 'blob' || (mode !== '100644' && mode !== '100755')) {
      fail('entrada no soportada (' + mode + ' ' + type + '): ' + p);
    }
    entries.push({ path: p, sha, nameBuf: Buffer.from(p, 'utf8') });
  }
  entries.sort((a, b) => Buffer.compare(a.nameBuf, b.nameBuf));
  for (const e of entries) {
    e.data = git(['cat-file', 'blob', e.sha]);
    if (isTextBlob(e) && e.data.includes(0x0d)) fail('el blob contiene CR (se exige LF): ' + e.path);
  }
  applyDocsOnly(entries);
  return entries;
}

/** Lists internal-reference matches in the text files that go into the ZIP. Warning only. */
function warnInternalReferences(entries) {
  const found = [];
  for (const e of entries) {
    if (!isTextBlob(e) || INTERNAL_REFERENCE_ALLOWED_PATHS.includes(e.path)) continue;
    const lines = e.data.toString('utf8').split('\n');
    lines.forEach((line, i) => {
      const hits = line.match(INTERNAL_REFERENCE_PATTERN);
      if (hits) found.push({ path: e.path, line: i + 1, hits: [...new Set(hits)] });
    });
  }
  if (found.length === 0) {
    console.log('referencias internas: ninguna');
    return;
  }
  const files = new Set(found.map((f) => f.path));
  console.warn('[package-theme-zip] AVISO: ' + found.length + ' lineas con referencias internas en ' + files.size + ' archivos (no falla el empaquetado):');
  for (const f of found) console.warn('  ' + f.path + ':' + f.line + '  ' + f.hits.join(', '));
}

function buildZip(entries, dos) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const e of entries) {
    const utf8 = e.nameBuf.some((b) => b > 0x7f);
    const flags = utf8 ? 0x0800 : 0;
    const comp = zlib.deflateRawSync(e.data, { level: 9, memLevel: 8, windowBits: 15, strategy: zlib.constants.Z_DEFAULT_STRATEGY });
    const crc = crc32(e.data);
    if (e.data.length > 0xfffffffe || comp.length > 0xfffffffe) fail('archivo demasiado grande (zip64 no soportado): ' + e.path);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(flags, 6);
    lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(dos.time, 10);
    lh.writeUInt16LE(dos.date, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(comp.length, 18);
    lh.writeUInt32LE(e.data.length, 22);
    lh.writeUInt16LE(e.nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    parts.push(lh, e.nameBuf, comp);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE((3 << 8) | 20, 4); // Unix, 2.0
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(flags, 8);
    ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(dos.time, 12);
    ch.writeUInt16LE(dos.date, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(comp.length, 20);
    ch.writeUInt32LE(e.data.length, 24);
    ch.writeUInt16LE(e.nameBuf.length, 28);
    ch.writeUInt16LE(0, 30); // extra
    ch.writeUInt16LE(0, 32); // comment
    ch.writeUInt16LE(0, 34); // disk
    ch.writeUInt16LE(0, 36); // internal attrs
    ch.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    ch.writeUInt32LE(offset, 42);
    central.push(ch, e.nameBuf);

    offset += 30 + e.nameBuf.length + comp.length;
  }
  const cdBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, cdBuf, eocd]);
}

let shallowBoundary = new Set();

function main() {
  const args = parseArgs(process.argv.slice(2));
  const outPath = path.resolve(args.out);

  const rel = path.relative(REPO, outPath).split(path.sep).join('/');
  const relCmp = rel.toLowerCase(); // siempre en minusculas: rechaza Layout/ y LAYOUT/ tambien en Linux
  const inRepo = !relCmp.startsWith('..') && !path.isAbsolute(rel);
  if (inRepo && (INCLUDE_DIRS.some((d) => relCmp.startsWith(d)) || INCLUDE_ROOT_FILES.some((f) => relCmp === f))) {
    fail('--out cae dentro de un directorio o archivo del tema: ' + rel);
  }
  if (path.extname(outPath).toLowerCase() !== '.zip') fail('--out debe terminar en .zip: ' + args.out);
  if (existsSync(outPath) && statSync(outPath).isDirectory()) fail('--out es un directorio existente: ' + args.out);

  let commit;
  try {
    commit = git(['rev-parse', '--verify', args.rev + '^{commit}'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    fail('revision no resoluble: ' + args.rev);
  }

  if (git(['rev-parse', '--is-shallow-repository']).toString().trim() === 'true') {
    const shallowFile = path.resolve(REPO, git(['rev-parse', '--git-path', 'shallow']).toString().trim());
    const boundary = existsSync(shallowFile) ? readFileSync(shallowFile, 'utf8').split('\n') : [];
    shallowBoundary = new Set(boundary.filter(Boolean));
  }

  const entries = collect(commit);
  if (entries.length === 0) fail('la revision no contiene archivos del tema');

  const specs = [
    ...INCLUDE_DIRS.map((d) => ':(literal)' + d),
    ...INCLUDE_ROOT_FILES.map((f) => ':(literal)' + f),
    ...EXCLUDED_PATHS.map((x) => ':(literal,exclude)' + x),
  ];
  const logOut = git(['-c', 'log.showSignature=false', 'log', '-1', '--format=%H %ct', commit, '--', ...specs]).toString().trim();
  const m = /^([0-9a-f]{40}) (\d+)$/.exec(logOut);
  if (!m) fail('no se pudo obtener la fecha de committer');
  if (shallowBoundary.has(m[1])) {
    fail('clon superficial: el commit ' + m[1] + ' es frontera y la fecha seria incorrecta; ejecutar `git fetch --unshallow`');
  }
  const epoch = Number(m[2]);
  const dos = dosDateTime(epoch);

  warnInternalReferences(entries);

  const zip = buildZip(entries, dos);
  const sha256 = createHash('sha256').update(zip).digest('hex');
  const manifest = Buffer.concat(entries.map((e) => Buffer.concat([
    e.nameBuf,
    Buffer.from('\0' + e.data.length + '\0' + createHash('sha256').update(e.data).digest('hex') + '\n'),
  ])));
  const contentSha = createHash('sha256').update(manifest).digest('hex');

  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, zip);

  console.log('rev:      ' + args.rev + ' -> ' + commit);
  console.log('fecha:    ' + epoch + ' (' + new Date(epoch * 1000).toISOString() + '), DOS UTC con floor a 2 s');
  console.log('archivos: ' + entries.length);
  console.log('tamano:   ' + zip.length + ' bytes');
  console.log('sha256:   ' + sha256);
  console.log('contenido:' + ' ' + contentSha + ' (huella independiente de zlib)');
  console.log('zlib:     ' + process.versions.zlib + ' (node ' + process.versions.node + ')');
  console.log('salida:   ' + outPath);

  let bad = false;
  if (args.count !== null && args.count !== entries.length) {
    console.error('[package-theme-zip] FALLO: se esperaban ' + args.count + ' archivos, hay ' + entries.length);
    bad = true;
  }
  if (args.sha !== null && args.sha !== sha256) {
    console.error('[package-theme-zip] FALLO: SHA-256 esperado ' + args.sha + ', obtenido ' + sha256);
    bad = true;
  }
  if (args.csha !== null && args.csha !== contentSha) {
    console.error('[package-theme-zip] FALLO: huella de contenido esperada ' + args.csha + ', obtenida ' + contentSha);
    bad = true;
  }
  if (bad) process.exit(1);
}

main();
