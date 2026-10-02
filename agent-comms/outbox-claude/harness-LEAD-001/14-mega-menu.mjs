// LEAD-001 · Mega menu: da hijos al enlace "Catalog" de main-menu para que el desplegable del tema
// (snippets/mega-menu.liquid, asociado por nombre al bloque mega_menu_promo "Catalog") se abra.
// Conserva el id, el titulo y el tipo de cada enlace de primer nivel existente.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/14-mega-menu.mjs <atelier|edition|archive> [--dry-run]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [preset, flag] = process.argv.slice(2);
const store = `sartorial-${preset}.myshopify.com`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lead001-mega-'));

const PLAN = {
  atelier: {
    collections: ['new-forms', 'permanent-collection', 'tailoring'],
    signature: ['nove-blazer', 'serra-coat', 'doppio-trench'],
  },
  edition: {
    collections: ['daily-objects', 'leather-goods', 'desk-and-study'],
    signature: ['structured-tote', 'east-west-shoulder-bag', 'leather-desk-mat'],
  },
  archive: {
    collections: ['permanent-archive', 'restored-pieces'],
    signature: ['1990-pinstripe-double-breasted-jacket', '1994-cashmere-cocoon-coat', '1999-technical-cotton-trench'],
  },
}[preset];
if (!PLAN) throw new Error('preset desconocido');

function execute(query, variables, allowMutations = false) {
  const queryFile = path.join(tmp, 'op.graphql');
  const varFile = path.join(tmp, 'vars.json');
  fs.writeFileSync(queryFile, query);
  fs.writeFileSync(varFile, JSON.stringify(variables || {}));
  const args = ['shopify', 'store', 'execute', '--store', store, '--json', '--query-file', queryFile, '--variable-file', varFile];
  if (allowMutations) args.push('--allow-mutations');
  const out = execFileSync('npx', args, { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(out.slice(out.indexOf('{')));
}

const aliases = [
  ...PLAN.collections.map((h, i) => `c${i}: collectionByIdentifier(identifier: { handle: "${h}" }) { id title handle }`),
  ...PLAN.signature.map((h, i) => `p${i}: productByIdentifier(identifier: { handle: "${h}" }) { id title handle }`),
];
const data = execute(`query MegaInputs {
  menus(first: 5, query: "handle:main-menu") { nodes { id handle title items { id title type url resourceId } } }
  ${aliases.join('\n  ')}
}`);
const menu = data.menus.nodes.find((m) => m.handle === 'main-menu');
const collections = PLAN.collections.map((_, i) => data[`c${i}`]).filter(Boolean);
const products = PLAN.signature.map((_, i) => data[`p${i}`]).filter(Boolean);
if (collections.length !== PLAN.collections.length || products.length !== PLAN.signature.length) {
  throw new Error(`${store}: falta alguna colección o producto del plan`);
}

const children = [
  {
    title: 'Collections',
    type: 'CATALOG',
    url: '/collections/all',
    items: collections.map((c) => ({ title: c.title, type: 'COLLECTION', resourceId: c.id })),
  },
  {
    title: 'Signature pieces',
    type: 'CATALOG',
    url: '/collections/all',
    items: products.map((p) => ({ title: p.title, type: 'PRODUCT', resourceId: p.id })),
  },
];
const keep = ({ id, title, type, url, resourceId }) =>
  Object.fromEntries(Object.entries({ id, title, type, url: resourceId ? undefined : url, resourceId }).filter(([, v]) => v != null));
const items = menu.items.map((item) => (item.title === 'Catalog' ? { ...keep(item), items: children } : keep(item)));
if (!items.some((i) => i.items)) throw new Error(`${store}: no hay enlace "Catalog" en main-menu`);

console.log(`${store} main-menu → ${items.map((i) => i.title + (i.items ? ` [${i.items.map((c) => `${c.title}: ${c.items.map((g) => g.title).join(', ')}`).join(' | ')}]` : '')).join(' · ')}`);
if (flag === '--dry-run') process.exit(0);

const result = execute(`mutation UpdateMain($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
  menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
    menu { id items { title url items { title url items { title url } } } }
    userErrors { field message }
  }
}`, { id: menu.id, title: menu.title, handle: menu.handle, items }, true).menuUpdate;
fs.writeFileSync(path.join(here, `results-14-mega-menu-${preset}.json`), JSON.stringify(result, null, 2));
console.log(result.userErrors.length ? `ERROR ${JSON.stringify(result.userErrors)}` : 'ok');
