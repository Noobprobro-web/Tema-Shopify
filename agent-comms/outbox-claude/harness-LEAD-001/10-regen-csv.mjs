// LEAD-001 · B-04/M-02: actualiza Image Src / Image Alt Text de scratch/sartorial_<preset>_products.csv
// con la imagen que la tienda sirve hoy, para que una reimportación en 1 clic no reponga las fotos viejas.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/10-regen-csv.mjs <edition|archive>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const preset = process.argv[2];
const store = `sartorial-${preset}.myshopify.com`;
const csvPath = path.join(root, 'scratch', `sartorial_${preset}_products.csv`);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lead001-csv-'));

// CSV mínimo con comillas RFC 4180 (los cuerpos HTML llevan comas y comillas).
function parse(text) {
  const rows = []; let row = []; let field = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}
const quote = (v) => (/[",\r\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);

const rows = parse(fs.readFileSync(csvPath, 'utf8'));
const header = rows[0];
const col = (name) => header.indexOf(name);
const [iHandle, iSrc, iAlt] = [col('Handle'), col('Image Src'), col('Image Alt Text')];

const handles = [...new Set(rows.slice(1).map((r) => r[iHandle]).filter(Boolean))];
const queryFile = path.join(tmp, 'q.graphql');
const aliases = handles.map((h, n) => `p${n}: productByIdentifier(identifier: { handle: "${h}" }) { handle featuredMedia { alt preview { image { url } } } }`);
fs.writeFileSync(queryFile, `query { ${aliases.join('\n')} }`);
const out = execFileSync('npx', ['shopify', 'store', 'execute', '--store', store, '--json', '--query-file', queryFile],
  { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'ignore'] });
const data = JSON.parse(out.slice(out.indexOf('{')));
const live = Object.fromEntries(Object.values(data).filter(Boolean).map((p) => [p.handle, p.featuredMedia]));

let changed = 0;
for (const r of rows.slice(1)) {
  if (!r[iSrc]) continue; // solo la fila con imagen de cada producto
  const media = live[r[iHandle]];
  const url = media?.preview?.image?.url?.split('?')[0];
  if (!url) continue;
  if (r[iSrc] !== url) { r[iSrc] = url; changed++; }
  if (media.alt) r[iAlt] = media.alt;
}
fs.writeFileSync(csvPath, rows.map((r) => r.map(quote).join(',')).join('\n') + '\n');
console.log(`${path.relative(root, csvPath)}: ${changed} Image Src actualizadas de ${handles.length} productos`);
