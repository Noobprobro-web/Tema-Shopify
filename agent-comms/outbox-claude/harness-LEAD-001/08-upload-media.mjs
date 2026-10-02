// LEAD-001 · B-04/M-02: sustituye la foto principal de cada producto por la imagen aprobada en demo-assets/<preset>/.
// Flujo por producto: stagedUploadsCreate → POST del archivo → productUpdate(media) → espera READY → productDeleteMedia (fotos viejas).
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/08-upload-media.mjs <edition|archive> [handle,handle...] [--dry-run]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const args = process.argv.slice(2);
const preset = args[0];
const dryRun = args.includes('--dry-run');
const onlyArg = args.find((a, i) => i > 0 && !a.startsWith('--'));
const store = `sartorial-${preset}.myshopify.com`;
const assetDir = path.join(root, 'demo-assets', preset);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lead001-media-'));
const resultsFile = path.join(here, `results-08-media-${preset}.jsonl`);

function execute(query, variables, allowMutations = false) {
  const queryFile = path.join(tmp, 'op.graphql');
  const varFile = path.join(tmp, 'vars.json');
  fs.writeFileSync(queryFile, query);
  fs.writeFileSync(varFile, JSON.stringify(variables || {}));
  const cli = ['shopify', 'store', 'execute', '--store', store, '--json', '--query-file', queryFile, '--variable-file', varFile];
  if (allowMutations) cli.push('--allow-mutations');
  const out = execFileSync('npx', cli, { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(out.slice(out.indexOf('{')));
}

// alt-text.csv: handle,"alt"
const altByHandle = Object.fromEntries(
  fs.readFileSync(path.join(assetDir, 'alt-text.csv'), 'utf8')
    .split(/\r?\n/).slice(1).filter(Boolean)
    .map((line) => { const i = line.indexOf(','); return [line.slice(0, i), line.slice(i + 1).replace(/^"|"$/g, '')]; })
);

let handles = fs.readdirSync(assetDir).filter((f) => /-01\.jpg$/.test(f)).map((f) => f.replace(/-01\.jpg$/, ''));
if (onlyArg) handles = handles.filter((h) => onlyArg.split(',').includes(h));

for (const handle of handles) {
  const file = path.join(assetDir, `${handle}-01.jpg`);
  const alt = altByHandle[handle];
  if (!alt) throw new Error(`${handle}: sin alt en alt-text.csv`);

  const before = execute(`query MediaStatus($handle: String!) {
  productByIdentifier(identifier: { handle: $handle }) {
    id
    media(first: 10) { nodes { id status alt ... on MediaImage { image { url } } } }
  }
}`, { handle }).productByIdentifier;
  if (!before) { console.log(`${handle}: producto no encontrado en ${store}`); continue; }
  const oldIds = before.media.nodes.map((m) => m.id);
  console.log(`${handle}: ${oldIds.length} media actual(es) → nueva ${path.basename(file)} (${(fs.statSync(file).size / 1024).toFixed(0)} KB)`);
  if (dryRun) continue;

  // 1. Destino de subida firmado.
  const staged = execute(`mutation Staged($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets { url resourceUrl parameters { name value } }
    userErrors { field message }
  }
}`, { input: [{ resource: 'IMAGE', filename: path.basename(file), mimeType: 'image/jpeg', httpMethod: 'POST', fileSize: String(fs.statSync(file).size) }] }, true).stagedUploadsCreate;
  if (staged.userErrors.length) throw new Error(`${handle}: ${JSON.stringify(staged.userErrors)}`);
  const target = staged.stagedTargets[0];

  // 2. Subida del binario.
  const form = new FormData();
  for (const { name, value } of target.parameters) form.append(name, value);
  form.append('file', new Blob([fs.readFileSync(file)], { type: 'image/jpeg' }), path.basename(file));
  const upload = await fetch(target.url, { method: 'POST', body: form });
  if (!upload.ok) throw new Error(`${handle}: subida ${upload.status} ${await upload.text()}`);

  // 3. Asociar como media del producto.
  const created = execute(`mutation AddMedia($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
  productUpdate(product: $product, media: $media) {
    product { id media(first: 10) { nodes { id status alt mediaContentType } } }
    userErrors { field message }
  }
}`, { product: { id: before.id }, media: [{ originalSource: target.resourceUrl, alt, mediaContentType: 'IMAGE' }] }, true).productUpdate;
  if (created.userErrors.length) throw new Error(`${handle}: ${JSON.stringify(created.userErrors)}`);
  const newMedia = created.product.media.nodes.find((m) => !oldIds.includes(m.id));

  // 4. Esperar a que Shopify procese la nueva imagen antes de retirar las viejas.
  let status = newMedia?.status;
  for (let i = 0; i < 20 && status !== 'READY'; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const now = execute(`query MediaStatus($handle: String!) {
  productByIdentifier(identifier: { handle: $handle }) {
    id
    media(first: 10) { nodes { id status alt ... on MediaImage { image { url } } } }
  }
}`, { handle }).productByIdentifier;
    status = now.media.nodes.find((m) => m.id === newMedia.id)?.status;
    if (status === 'FAILED') throw new Error(`${handle}: el procesamiento de la imagen falló`);
  }
  if (status !== 'READY') throw new Error(`${handle}: la imagen no llegó a READY (${status}); no se borran las viejas`);

  // 5. Retirar las fotos anteriores (las de Atelier/Unsplash).
  let deleted = [];
  if (oldIds.length) {
    const del = execute(`mutation DropMedia($productId: ID!, $mediaIds: [ID!]!) {
  productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
    deletedMediaIds
    mediaUserErrors { field message }
  }
}`, { productId: before.id, mediaIds: oldIds }, true).productDeleteMedia;
    if (del.mediaUserErrors.length) throw new Error(`${handle}: ${JSON.stringify(del.mediaUserErrors)}`);
    deleted = del.deletedMediaIds;
  }

  const row = { store, handle, product: before.id, newMedia: newMedia.id, status, deleted };
  fs.appendFileSync(resultsFile, JSON.stringify(row) + '\n');
  console.log(`  ok · READY · borradas ${deleted.length}`);
}
