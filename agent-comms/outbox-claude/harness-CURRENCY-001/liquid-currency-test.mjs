import { Liquid } from 'liquidjs';
import fs from 'node:fs';
// Uso: necesita liquidjs@10 (npm install --no-save liquidjs@10 en la raiz del repo) y luego
// node agent-comms/outbox-claude/harness-CURRENCY-001/liquid-currency-test.mjs
// Renderiza el bloque del <select> de snippets/localization-selectors.liquid con mercados simulados.
const src = fs.readFileSync(new URL('../../../snippets/localization-selectors.liquid', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const block = src.slice(src.indexOf('          <label class="visually-hidden" for="{{ localization_form_id }}-country">'), src.indexOf('</select>') + 9);
const engine = new Liquid();
engine.registerFilter('t', (k) => ({ 'general.localization.currency': 'Currency' }[k] || 'MISSING:' + k));
const C = (iso, name, cur, sym) => ({ iso_code: iso, name, currency: { iso_code: cur, symbol: sym } });
const all = { AT: C('AT', 'Austria', 'EUR', '€'), CA: C('CA', 'Canada', 'CAD', '$'), DE: C('DE', 'Germany', 'EUR', '€'), ES: C('ES', 'Spain', 'EUR', '€'), US: C('US', 'United States', 'USD', '$') };
const cases = [
  ['tienda actual, pais US', ['ES', 'US'], 'US'],
  ['tienda actual, pais ES', ['ES', 'US'], 'ES'],
  ['5 paises, pais ES', ['AT', 'CA', 'DE', 'ES', 'US'], 'ES'],
  ['5 paises, pais US', ['AT', 'CA', 'DE', 'ES', 'US'], 'US'],
];
for (const [label, list, cur] of cases) {
  const html = await engine.parseAndRender(block, { localization_form_id: 'LocalizationForm-header', localization: { available_countries: list.map((c) => all[c]), country: all[cur] } });
  const opts = [...html.matchAll(/<option value="(\w+)"( selected)?>([^<]*)<\/option>/g)].map((m) => m[1] + '=' + m[3] + (m[2] ? '*' : ''));
  console.log(label.padEnd(24), '|', opts.join('  '), '| label:', (html.match(/>([^<]*)<\/label>/) || [])[1]);
}
