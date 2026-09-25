import { Liquid } from 'liquidjs';
const engine = new Liquid();
const inv = `{%- liquid
  assign inventory_block = section.blocks | where: 'type', 'inventory_status' | first
  assign inventory_cap = inventory_block.settings.threshold | default: 0 | plus: 1
-%}{{ variant.inventory_quantity | at_most: inventory_cap }}`;
const state = (q, th) => (q <= 0 ? 'preorder/soldOut' : q <= th ? `lowStock(${q})` : 'inStock');
const other = { type: 'price', settings: {} };
for (const [name, blocks, qty] of [
  ['sin bloque, 57 uds', [other], 57], ['umbral 5, 57 uds', [other, { type: 'inventory_status', settings: { threshold: 5 } }], 57],
  ['umbral 5, 3 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], 3], ['umbral 5, 6 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], 6],
  ['umbral 5, -2 uds', [{ type: 'inventory_status', settings: { threshold: 5 } }], -2], ['umbral 0, 4 uds', [{ type: 'inventory_status', settings: { threshold: 0 } }], 4]]) {
  const out = Number(await engine.parseAndRender(inv, { section: { blocks }, variant: { inventory_quantity: qty } }));
  const th = blocks.find((b) => b.type === 'inventory_status')?.settings.threshold ?? NaN;
  console.log(name.padEnd(22), '| emite', String(out).padStart(3), '| estado antes', state(qty, th).padEnd(16), '| después', state(out, th));
}
const title = `{{ t.size | divided_by: 61 | floor | at_most: 1 }}`;
for (const t of ['Serra Coat', 'x'.repeat(60), 'x'.repeat(61), 'F10 Oversized Double-Faced Wool and Cashmere Belted Wrap Coat with Raglan Sleeves, Concealed Placket, Detachable Storm Collar and Horn Buttons']) {
  console.log(`título de ${String(t.length).padStart(3)} caracteres -> data-long-title="${await engine.parseAndRender(title, { t })}"`);
}
