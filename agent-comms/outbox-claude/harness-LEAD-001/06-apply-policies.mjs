// LEAD-001 · M-01: crea/actualiza las 4 políticas con shopPolicyUpdate vía `shopify store execute`.
// Requiere `shopify store auth --store <tienda> --scopes ...,write_legal_policies` hecho por Johandry.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/06-apply-policies.mjs <atelier|edition|archive> "<Nombre tienda>" [contact_url]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [preset, shopName, contactUrl = '/pages/contact'] = process.argv.slice(2);
if (!preset || !shopName) throw new Error('uso: 06-apply-policies.mjs <preset> "<Nombre tienda>" [contact_url]');
const store = `sartorial-${preset}.myshopify.com`;

const templates = JSON.parse(fs.readFileSync(path.join(here, '05-policies.json'), 'utf8'));
const values = { '{{shop_name}}': shopName, '{{contact_url}}': contactUrl, '{{country}}': 'United States' };
const mutation = `mutation UpsertPolicy($policy: ShopPolicyInput!) {
  shopPolicyUpdate(shopPolicy: $policy) { shopPolicy { type title url } userErrors { field message } }
}`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lead001-policies-'));
const queryFile = path.join(tmp, 'mutation.graphql');
fs.writeFileSync(queryFile, mutation);
const results = [];
for (const type of ['REFUND_POLICY', 'SHIPPING_POLICY', 'TERMS_OF_SERVICE', 'CONTACT_INFORMATION']) {
  let body = templates[type];
  for (const [token, value] of Object.entries(values)) body = body.replaceAll(token, value);
  if (body.includes('{{')) throw new Error(`${type}: marcador sin resolver`);
  const varFile = path.join(tmp, `${type}.json`);
  fs.writeFileSync(varFile, JSON.stringify({ policy: { type, body } }));
  const out = execFileSync(
    'npx',
    ['shopify', 'store', 'execute', '--store', store, '--json', '--allow-mutations', '--query-file', queryFile, '--variable-file', varFile],
    { encoding: 'utf8', shell: process.platform === 'win32' }
  );
  const data = JSON.parse(out.slice(out.indexOf('{')));
  const payload = data.shopPolicyUpdate;
  results.push({ store, type, policy: payload?.shopPolicy, userErrors: payload?.userErrors });
  console.log(`${store} ${type.padEnd(20)} ${payload?.userErrors?.length ? 'ERROR ' + JSON.stringify(payload.userErrors) : 'ok ' + payload?.shopPolicy?.url}`);
}
fs.writeFileSync(path.join(here, `results-06-policies-${preset}.json`), JSON.stringify(results, null, 2));
