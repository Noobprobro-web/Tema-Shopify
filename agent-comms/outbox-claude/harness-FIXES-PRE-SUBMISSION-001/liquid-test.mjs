// Prueba con liquidjs el Liquid cambiado, leido tal cual del arbol de trabajo.
import { Liquid } from 'liquidjs';
import { readFileSync } from 'fs';
const ROOT = process.env.HOME + '/mnt/Tema Shopify/';
const read = (p) => readFileSync(ROOT + p, 'utf8').replace(/\r\n/g, '\n');
const engine = new Liquid();
const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('no encontrado: ' + a); return s.slice(i, j + b.length); };

// 1. product-card: card_key y los ids que salen de el
const card = read('snippets/product-card.liquid');
const keyCode = between(card, "  assign card_key = section.id", "  assign swatch_sold_out_id = 'SwatchSoldOut-' | append: card_key\n");
const tpl1 = `{%- liquid\n${keyCode}-%}{{ card_title_id }}|{{ quick_add_id }}|{{ quick_buy_id }}|{{ swatch_sold_out_id }}`;
const base = { section: { id: 'template--1__collections' }, card_product: { id: 10146342109427 } };
for (const [label, extra] of [['sin sufijo', {}], ['sufijo vacio', { card_id_suffix: '' }], ['tab A', { card_id_suffix: 'tab_a' }], ['tab B', { card_id_suffix: 'tab_b' }]]) {
  console.log(`product-card ${label.padEnd(12)} -> ${await engine.parseAndRender(tpl1, { ...base, ...extra })}`);
}

// 2. brand-manifesto: el indice sale como <dd> dentro del <div> del <dl>
const man = read('sections/brand-manifesto.liquid');
const dl = between(man, '<dl class="brand-manifesto__details">', '</dl>');
const out2 = await engine.parseAndRender(dl, { section: { blocks: [1, 2, 3].map((n) => ({ shopify_attributes: '', settings: { label: 'L' + n, value: 'V' + n } })) } });
console.log('brand-manifesto ->', out2.replace(/\s+/g, ' ').slice(0, 230));
console.log('  span dentro del dl:', /<span/.test(out2), '| dd de indice:', (out2.match(/brand-manifesto__index/g) || []).length);

// 3. recently-viewed: el bucle respeta products_to_show aunque lleguen mas resultados
const rv = read('sections/recently-viewed.liquid');
let grid = between(rv, '{%- if search.performed', '{%- endif -%}\n      </ul>');
grid = grid.replace(/\{% render 'product-card',[\s\S]*?%\}/, '[card {{ result.id }}]');
const results = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, object_type: 'product' }));
const out3 = await engine.parseAndRender(grid, { search: { performed: true, results_count: 10, results }, section: { settings: { products_to_show: 4 } } });
console.log('recently-viewed products_to_show=4 con 10 resultados -> tarjetas:', (out3.match(/\[card/g) || []).length);

// 4. main-product: la rama custom_liquid del case
const mp = read('sections/main-product.liquid');
const branch = between(mp, "{%- when 'custom_liquid' -%}", '</div>\n');
const out4 = await engine.parseAndRender(`{%- case block.type -%}${branch}{%- endcase -%}`, { block: { type: 'custom_liquid', shopify_attributes: 'data-x', settings: { custom_liquid: '<p>hola</p>' } } });
console.log('main-product custom_liquid ->', out4.replace(/\s+/g, ' ').trim());
const schema = JSON.parse(between(mp, '{% schema %}', '{% endschema %}').slice(12, -15));
console.log('  bloques del schema:', schema.blocks.map((b) => b.type).join(', '));
