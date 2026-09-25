import { Liquid } from 'liquidjs';
const engine = new Liquid();
// Shopify entrega search.terms ya escapado en HTML (comprobado en vivo: "Tom & Jerry" -> url_encode da Tom+%26amp%3B+Jerry).
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const actual = `{%- assign encoded_terms = terms | url_encode -%}{{ encoded_terms }}`;
const patched = `{%- assign plain_terms = terms | replace: '&quot;', '"' | replace: '&#39;', "'" | replace: '&lt;', '<' | replace: '&gt;', '>' | replace: '&amp;', '&' -%}{%- assign encoded_terms = plain_terms | url_encode -%}{{ encoded_terms }}`;
for (const raw of ['Tom & Jerry', '12" frame', "O'Neil", '<b>x</b>', 'a &amp; b', 'coat']) {
  const terms = escapeHtml(raw);
  const a = await engine.parseAndRender(actual, { terms });
  const b = await engine.parseAndRender(patched, { terms });
  const back = decodeURIComponent(b.replace(/\+/g, ' '));
  console.log(JSON.stringify(raw).padEnd(16), '| actual:', a.padEnd(34), '| parche:', b.padEnd(24), '| vuelve a', JSON.stringify(back), back === raw ? 'OK' : 'DISTINTO');
}
