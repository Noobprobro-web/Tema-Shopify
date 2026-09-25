import { Liquid } from 'liquidjs';
const engine = new Liquid();
const head = `{%- if v contains '/uploads/' and v contains 'https://' -%}LINK{%- else -%}TEXTO{%- endif -%}`;
const patch = `{%- assign property_scheme = v | slice: 0, 8 | downcase -%}{%- if v contains '/uploads/' and property_scheme == 'https://' -%}LINK{%- else -%}TEXTO{%- endif -%}`;
for (const v of ['https://cdn.shopify.com/s/files/1/0/uploads/foto.png', 'javascript:alert(1)//https://cdn.shopify.com/uploads/x', 'JavaScript:alert(1)//https://x/uploads/', 'HTTPS://cdn.shopify.com/uploads/a.png', 'data:text/html,<b>x</b>//https://x/uploads/', 'Texto normal']) {
  console.log(v.slice(0, 55).padEnd(56), '| HEAD 02194ee:', (await engine.parseAndRender(head, { v })).padEnd(6), '| propuesta:', await engine.parseAndRender(patch, { v }));
}
