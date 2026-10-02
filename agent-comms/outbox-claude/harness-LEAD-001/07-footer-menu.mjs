// LEAD-001 · M-01: añade las políticas al menú `footer` (menuUpdate) conservando los ítems existentes.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/07-footer-menu.mjs <atelier|edition|archive> [--dry-run]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [preset, flag] = process.argv.slice(2);
const dryRun = flag === '--dry-run';
const store = `sartorial-${preset}.myshopify.com`;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lead001-menu-'));

function execute(query, variables, allowMutations = false) {
  const queryFile = path.join(tmp, 'op.graphql');
  fs.writeFileSync(queryFile, query);
  const args = ['shopify', 'store', 'execute', '--store', store, '--json', '--query-file', queryFile];
  if (variables) {
    const varFile = path.join(tmp, 'vars.json');
    fs.writeFileSync(varFile, JSON.stringify(variables));
    args.push('--variable-file', varFile);
  }
  if (allowMutations) args.push('--allow-mutations');
  const out = execFileSync('npx', args, { encoding: 'utf8', shell: process.platform === 'win32', stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(out.slice(out.indexOf('{')));
}

const state = execute(`query FooterInputs {
  shop { shopPolicies { id type title url } }
  menus(first: 10, query: "handle:footer") { nodes { id handle title items { id title type url resourceId } } }
}`);
const menu = state.menus.nodes.find((m) => m.handle === 'footer');
if (!menu) throw new Error(`${store}: no existe el menú footer`);

// Orden y títulos en inglés (idioma de las demos); el tema ya traduce el resto de la interfaz.
const POLICY_ORDER = [
  ['REFUND_POLICY', 'Refund policy'],
  ['SHIPPING_POLICY', 'Shipping policy'],
  ['PRIVACY_POLICY', 'Privacy policy'],
  ['TERMS_OF_SERVICE', 'Terms of service'],
  ['CONTACT_INFORMATION', 'Contact information'],
];
const keep = menu.items.filter((item) => item.type !== 'SHOP_POLICY');
const search = keep.filter((item) => item.type === 'SEARCH');
const rest = keep.filter((item) => item.type !== 'SEARCH');
const policies = POLICY_ORDER.map(([type, title]) => {
  const policy = state.shop.shopPolicies.find((p) => p.type === type);
  if (!policy) throw new Error(`${store}: falta la política ${type}; ejecuta antes 06-apply-policies.mjs`);
  return { title, type: 'SHOP_POLICY', resourceId: policy.id };
});
const toInput = ({ id, title, type, url, resourceId }) =>
  Object.fromEntries(Object.entries({ id, title, type, url: resourceId ? undefined : url, resourceId }).filter(([, v]) => v != null));
const items = [...search.map(toInput), ...policies, ...rest.map(toInput)];

console.log(`${store} footer → ${items.map((i) => i.title).join(' · ')}`);
if (dryRun) process.exit(0);

const result = execute(
  `mutation UpdateFooter($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
  menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
    menu { id items { title type url } }
    userErrors { field message }
  }
}`,
  { id: menu.id, title: menu.title, handle: menu.handle, items },
  true
);
const payload = result.menuUpdate;
fs.writeFileSync(path.join(here, `results-07-footer-${preset}.json`), JSON.stringify(payload, null, 2));
console.log(payload.userErrors.length ? `ERROR ${JSON.stringify(payload.userErrors)}` : payload.menu.items.map((i) => `${i.title} ${i.url}`).join('\n'));
