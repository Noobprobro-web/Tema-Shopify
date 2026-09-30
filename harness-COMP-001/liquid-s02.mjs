// COMP-001 (S-02): renderiza sections/complete-the-look.liquid real (antes y despues) con liquidjs 10.
// Uso: npm install --no-save liquidjs@10 && node harness-COMP-001/liquid-s02.mjs
import { Liquid } from 'liquidjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const en = JSON.parse(fs.readFileSync(path.join(repo, 'locales/en.default.json'), 'utf8'));
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const engine = new Liquid({ root: [path.join(repo, 'snippets')], extname: '.liquid', dynamicPartials: true });
engine.registerFilter('t', (key, ...args) => {
  const v = key.split('.').reduce((o, k) => o?.[k], en);
  if (typeof v !== 'string') return 'MISSING:' + key;
  const vars = {};
  for (const a of args) if (Array.isArray(a)) vars[a[0]] = a[1];
  return v.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => esc(vars[k] ?? ''));
});
engine.registerFilter('money', (c) => '$' + (Number(c) / 100).toFixed(2));
engine.registerFilter('placeholder_svg_tag', (name) => `<svg data-placeholder="${name}"></svg>`);

const variant = (id, available = true) => ({ id, title: 'Default Title', price: 12000, compare_at_price: null, available, requires_selling_plan: false, quantity_rule: { min: 1 } });
const product = (handle, available = true) => {
  const v = variant(handle.length * 1000, available);
  return { title: handle, url: '/products/' + handle, variants_count: 1, variants: [v], selected_or_first_available_variant: v, requires_selling_plan: false, has_only_default_variant: true, featured_media: null };
};
const block = (id, p) => ({ id, type: 'bundle_product', shopify_attributes: '', settings: { product: p } });
const section = (blocks) => ({ id: 'template--1__set', blocks, settings: { heading: 'Complete the look', eyebrow: 'Look 03', description: '', caption: '', color_scheme: 'scheme-1', image_desktop: null, image_mobile: null, image_alt: '' } });

const CASES = [
  ['vacio, tienda', [], false],
  ['vacio, editor', [], true],
  ['producto borrado (bloque sin producto), tienda', [block('a', null), block('b', null)], false],
  ['1 producto, tienda', [block('a', product('structured-tote'))], false],
  ['1 producto agotado, tienda', [block('a', product('leather-belt', false))], false],
  ['4 productos, tienda', ['a', 'b', 'c', 'd'].map((k, i) => block(k, product('p' + i))), false],
];

const source = (file) => fs.readFileSync(file, 'utf8').replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/, '');
const files = { antes: path.join(repo, 'harness-COMP-001/.before/sections/complete-the-look.liquid'), despues: path.join(repo, 'sections/complete-the-look.liquid') };

for (const [ver, file] of Object.entries(files)) {
  const tpl = engine.parse(source(file));
  console.log(`== ${ver}`);
  for (const [label, blocks, designMode] of CASES) {
    const html = (await engine.render(tpl, {
      section: section(blocks), request: { design_mode: designMode }, settings: { default_color_scheme: 'scheme-1' },
      shop: { money_format: '${{amount}}' }, routes: { cart_add_url: '/cart/add', cart_url: '/cart' },
    })).trim();
    const has = (re) => re.test(html);
    const items = (html.match(/data-bundle-item/g) || []).length;
    const count = (html.match(/data-bundle-count>\s*([^<]*)</) || [])[1]?.trim() ?? '-';
    console.log(`  ${label.padEnd(46)} bytes=${String(html.length).padEnd(6)} seccion=${has(/<complete-the-look/) ? 'si' : 'NO'} aviso-editor=${has(/complete-the-look__empty/) ? 'SI' : 'no'} total-0=${has(/\$0\.00/) ? 'SI' : 'no'} items=${items} contador="${count}"`);
  }
}
