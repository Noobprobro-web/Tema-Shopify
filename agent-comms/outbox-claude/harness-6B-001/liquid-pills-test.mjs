import { Liquid } from 'liquidjs';
import fs from 'node:fs';
// Uso: necesita liquidjs@10 (npm install --no-save liquidjs@10 en la raiz del repo) y luego
// node agent-comms/outbox-claude/harness-6B-001/liquid-pills-test.mjs
const repo = new URL('../../../', import.meta.url).pathname.replace(/\/$/, '');
const en = JSON.parse(fs.readFileSync(repo + '/locales/en.default.json', 'utf8'));
const es = JSON.parse(fs.readFileSync(repo + '/locales/es.json', 'utf8'));
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
function mk(locale, moneyFmt) {
  const engine = new Liquid({ root: [repo + '/snippets'], extname: '.liquid', dynamicPartials: true });
  engine.registerFilter('t', (key, ...args) => { let v = key.split('.').reduce((o, k) => o?.[k], locale); if (typeof v !== 'string') return 'MISSING:' + key; const vars = {}; for (const a of args) if (Array.isArray(a)) vars[a[0]] = a[1]; return v.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => esc(vars[k] ?? '')); });
  engine.registerFilter('money', (c) => moneyFmt(Number(c)));
  return engine;
}
const usd = (c) => '$' + (c / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const eur = (c) => (c / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '&nbsp;€';
const avail = (active) => ({ type: 'boolean', label: 'Availability', param_name: 'filter.v.availability', active_values: active ? [{ label: 'In stock', url_to_remove: '/collections/all?filter.v.price.gte=100' }] : [] });
const price = (min, max) => ({ type: 'price_range', label: 'Price', url_to_remove: '/collections/all?filter.v.availability=1', min_value: { value: min }, max_value: { value: max }, active_values: [] });
const color = { type: 'list', label: 'Color', active_values: [{ label: 'Black & White', url_to_remove: '/collections/all?filter.p.m.x=1&filter.v.availability=1' }, { label: 'Camel', url_to_remove: '/collections/all?a=1' }] };
const cases = [
  ['sin filtros', [avail(false), price(null, null)], en, usd],
  ['disponibilidad', [avail(true), price(null, null)], en, usd],
  ['precio min+max', [avail(false), price(10000, 50000)], en, usd],
  ['precio solo min', [avail(false), price(10000, null)], en, usd],
  ['precio solo max (es, EUR)', [avail(false), price(null, 189000)], es, eur],
  ['color x2 + disp + precio', [avail(true), color, price(10000, 189000)], en, usd],
];
for (const [label, filters, loc, money] of cases) {
  const html = await mk(loc, money).parseAndRender("{% render 'facets-active-filters', filters: filters, clear_url: clear_url, section_id: 'template--1__main' %}", { filters, clear_url: '/collections/all?sort_by=manual&x=1' });
  const pills = [...html.matchAll(/<a class="(facet__pill|facets__clear-all)" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => m[1].replace('facet__', '').replace('facets__', '') + ' href=' + m[2] + ' | ' + m[3].replace(/<svg[\s\S]*?<\/svg>/g, '×').replace(/<span class="visually-hidden">([^<]*)<\/span>/g, '[sr:$1]').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  console.log('--', label, '| wrapper:', html.includes('facets__active-filters'), '| heading:', (html.match(/id="ActiveFilters-[^"]+">([^<]*)</) || [])[1]);
  pills.forEach((p) => console.log('   ', p));
}
