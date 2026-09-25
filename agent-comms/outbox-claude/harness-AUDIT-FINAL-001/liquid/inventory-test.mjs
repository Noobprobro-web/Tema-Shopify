import { Liquid } from 'liquidjs';
const engine = new Liquid();
const tpl = `{%- liquid
  assign inventory_cap = 1
  for block in section.blocks
    if block.type == 'inventory_status'
      assign inventory_cap = block.settings.threshold | plus: 1
    endif
  endfor
-%}{{ variant.inventory_quantity | at_most: inventory_cap }}`;
const cases = [
  ['sin bloque de inventario, 57 uds', [], 57],
  ['umbral 5, 57 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], 57],
  ['umbral 5, 3 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], 3],
  ['umbral 5, 6 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], 6],
  ['umbral 5, -2 uds (preventa)', [{ type: 'inventory_status', settings: { threshold: 5 } }], -2],
  ['umbral 5, 0 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], 0],
];
// Estado que calcula ProductInventory.update() (assets/theme.js:1018-1031) con el valor emitido.
const state = (q, threshold) => (q <= 0 ? 'preorder/soldOut' : q <= threshold ? 'lowStock(' + q + ')' : 'inStock');
for (const [name, blocks, qty] of cases) {
  const out = Number(await engine.parseAndRender(tpl, { section: { blocks }, variant: { inventory_quantity: qty } }));
  const th = blocks[0]?.settings.threshold ?? 0;
  console.log(name.padEnd(30), '| emite', String(out).padStart(3), '| estado antes', state(qty, th).padEnd(16), '| después', state(out, th));
}
