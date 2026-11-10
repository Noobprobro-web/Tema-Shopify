// C-01 · utilidades compartidas: contenido esperado de un tema a partir de un
// commit y un preset, hashes y normalizacion JSON. Solo lee Git; no toca la tienda.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HARNESS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HARNESS_DIR, '..', '..', '..');

// Carpetas que forman el tema servido. listings/ es material de envio a la
// Theme Store, no storefront: su contenido entra solo como overlay de preset.
export const THEME_DIRS = ['assets', 'blocks', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

// Rutas que decide C-01 (CSS, JS del filtrado, marcado de coleccion y tarjeta).
export const C01_PATHS = [
  'assets/base.css',
  'assets/theme.js',
  'layout/theme.liquid',
  'sections/main-collection.liquid',
  'snippets/product-card.liquid',
  'snippets/facets-active-filters.liquid',
  'templates/collection.json',
  'config/settings_data.json',
];

export const PRESETS = ['Sartorial', 'Imprint', 'Archive'];

export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
export const sha256File = (file) => sha256(readFileSync(file));

export function git(args, opts = {}) {
  return execFileSync('git', ['-C', REPO, ...args], { maxBuffer: 256 * 1024 * 1024, ...opts });
}

export function resolveCommit(ref) {
  if (!/^[0-9A-Za-z._\/-]+$/.test(ref)) throw new Error(`Referencia Git no valida: ${ref}`);
  return git(['rev-parse', '--verify', `${ref}^{commit}`]).toString().trim();
}

export function showFile(commit, file) {
  try {
    return git(['show', `${commit}:${file}`], { stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

function listTree(commit) {
  const out = git(['ls-tree', '-r', '--name-only', '-z', commit, '--', ...THEME_DIRS]).toString();
  return out.split('\0').filter(Boolean);
}

export function presetKey(preset) {
  const match = PRESETS.find((p) => p.toLowerCase() === String(preset).toLowerCase());
  if (!match) throw new Error(`Preset desconocido: ${preset}. Usa ${PRESETS.join(', ')}`);
  return match;
}

// Contenido esperado del tema para (commit, preset). El overlay de preset:
// templates/*.json desde listings/<preset>/templates/ y settings_data.json con
// "current" igual al nombre del preset (forma admitida por Shopify).
export function expectedTheme(commit, preset) {
  const files = new Map();
  for (const file of listTree(commit)) files.set(file, { buf: showFile(commit, file), source: file });
  if (preset) {
    const key = presetKey(preset);
    const dir = `listings/${key.toLowerCase()}/templates`;
    const listing = git(['ls-tree', '-r', '--name-only', '-z', commit, '--', dir]).toString().split('\0').filter(Boolean);
    for (const src of listing) {
      const target = `templates/${path.posix.relative(dir, src)}`;
      files.set(target, { buf: showFile(commit, src), source: src });
    }
    const settings = files.get('config/settings_data.json');
    if (settings) {
      const data = parseThemeJson(settings.buf);
      if (!data?.presets?.[key]) throw new Error(`settings_data.json de ${commit} no define el preset ${key}`);
      data.current = key;
      files.set('config/settings_data.json', {
        buf: Buffer.from(`${JSON.stringify(data, null, 2)}\n`),
        source: `config/settings_data.json (current=${key})`,
      });
    }
  }
  return files;
}

// Shopify antepone un comentario /* ... */ a las plantillas JSON y puede
// reformatearlas al guardarlas. Comparamos el valor, no el formato.
export function parseThemeJson(buf) {
  const text = buf.toString('utf8').replace(/^﻿/, '').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
  return JSON.parse(text);
}

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

// Extensiones que se tratan como texto. Todo lo demas (png, jpg, webp, gif, ico,
// woff, woff2, ttf, otf, eot, mp4, pdf...) es binario y solo admite 'exact'.
export const TEXT_EXTENSIONS = new Set(['.liquid', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.md', '.html', '.scss', '.map']);
export const isTextFile = (file) => TEXT_EXTENSIONS.has(path.posix.extname(file).toLowerCase());

// CRLF -> LF sobre bytes, sin decodificar: 0x0d seguido de 0x0a se elimina.
function crlfToLf(buf) {
  const out = Buffer.allocUnsafe(buf.length);
  let n = 0;
  for (let i = 0; i < buf.length; i += 1) {
    if (buf[i] === 0x0d && buf[i + 1] === 0x0a) continue;
    out[n] = buf[i];
    n += 1;
  }
  return out.subarray(0, n);
}

// Devuelve 'exact', 'normalized' (solo saltos de linea en texto o formato JSON) o 'mismatch'.
// Binarios: comparacion byte a byte, sin normalizar. JSON: valor canonico solo en .json.
export function compareBytes(file, expected, actual) {
  const a = Buffer.from(expected);
  const b = Buffer.from(actual);
  if (a.equals(b)) return 'exact';
  if (!isTextFile(file)) return 'mismatch';
  if (crlfToLf(a).equals(crlfToLf(b))) return 'normalized';
  if (path.posix.extname(file).toLowerCase() === '.json') {
    try {
      if (canonicalJson(parseThemeJson(a)) === canonicalJson(parseThemeJson(b))) return 'normalized';
    } catch {
      return 'mismatch';
    }
  }
  return 'mismatch';
}
