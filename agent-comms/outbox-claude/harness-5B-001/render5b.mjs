// Sprint 5B-001. Render fiel de las fichas de producto con zoom: el Liquid real de main-product,
// product-media, media-alt y product-zoom (liquidjs), con los valores por defecto del schema, el
// {% style %} real de theme.liquid y los assets reales del tema. Parte de harness-5A-003/render5a3.mjs.
// Uso (desde esta carpeta):
//   OUT_DIR=site node render5b.mjs
//   OUT_DIR=site-es LOCALE_FILE=locales/es.json LOCALE_ISO=es node render5b.mjs
//   OUT_DIR=site-before THEME_ROOT=<arbol previo> node render5b.mjs
// assets/ se enlaza (no se copia) al arbol bajo prueba, para que un cambio de JS o CSS no deje
// una copia vieja servida. Dependencias: liquidjs y @playwright/test. Las fotos se copian desde
// IMG_DIR si se indica; si no, se generan marcadores PNG lisos con el tamano de cada fixture.
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid, Tag, Value } from 'liquidjs';

// Por defecto, la raiz del tema es tres niveles arriba de esta carpeta (agent-comms/outbox-claude/harness-5B-001).
const ROOT = process.env.THEME_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const OUT = path.resolve(process.env.OUT_DIR || 'site');
fs.mkdirSync(OUT, { recursive: true });
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const locales = JSON.parse(read(process.env.LOCALE_FILE || 'locales/en.default.json'));
const SD = JSON.parse(read('config/settings_data.json')); const cur = process.env.PRESET ? { ...SD.current, ...SD.presets[process.env.PRESET] } : SD.current;
const FONTS = {
  libre_baskerville_n4: { family: 'Libre Baskerville', fallback_families: 'serif', style: 'normal', weight: '400' },
  assistant_n4: { family: 'Assistant', fallback_families: 'sans-serif', style: 'normal', weight: '400' },
};
const settings = {
  ...cur,
  type_body_font: FONTS[cur.type_body_font], type_heading_font: FONTS[cur.type_heading_font],
  color_schemes: Object.entries(cur.color_schemes).map(([id, v]) => ({ id, settings: v.settings })),
  default_color_scheme: { id: cur.default_color_scheme || 'scheme-1' },
  show_cart_count: true, cart_type: 'drawer', animations: 'subtle',
};

const GLOBALS = {};
const engine = new Liquid({ root: [path.join(ROOT, 'snippets')], extname: '.liquid', jsTruthy: false, strictFilters: false, strictVariables: false, globals: GLOBALS });
const kw = (args) => { const o = {}; for (const a of args) { if (Array.isArray(a) && a.length === 2) o[a[0]] = a[1]; } return o; };
const lookup = (key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), locales);
engine.registerFilter('t', (key, ...args) => {
  let out = lookup(String(key)); if (out == null) return `[missing: ${key}]`;
  const named = kw(args);
  if (typeof out === 'object') out = (named.count === 1 ? out.one : out.other) ?? Object.values(out)[0];
  return String(out).replace(/\{\{\s*(\w+)\s*\}\}/g, (m, n) => (n in named ? named[n] : m));
});
const handleize = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
engine.registerFilter('handleize', handleize); engine.registerFilter('handle', handleize);
engine.registerFilter('asset_url', (s) => `assets/${s}`);
engine.registerFilter('money', (v) => `$${(Number(v || 0) / 100).toFixed(2)}`);
engine.registerFilter('money_with_currency', (v) => `$${(Number(v || 0) / 100).toFixed(2)} USD`);
engine.registerFilter('escape_once', (s) => String(s ?? '').replace(/&(?!amp;|lt;|gt;|quot;|#39;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
engine.registerFilter('image_url', (img, ...args) => {
  if (!img) return ''; const src = typeof img === 'string' ? img : img.src; const w = kw(args).width;
  return w ? `${src}?width=${w}` : src;
});
engine.registerFilter('image_tag', (url, ...args) => {
  const o = kw(args); const base = String(url).split('?')[0];
  const widths = String(o.widths || '').split(',').map((x) => x.trim()).filter(Boolean);
  const srcset = widths.map((w) => `${base}?width=${w} ${w}w`).join(', ');
  const img = IMAGES[base] || {}; const w = o.width || img.width || ''; const h = img.width && w ? Math.round(w / img.aspect_ratio) : (img.height || '');
  return `<img src="${url}"${srcset ? ` srcset="${srcset}"` : ''}${o.sizes ? ` sizes="${o.sizes}"` : ''} alt="${String(o.alt ?? img.alt ?? '').replace(/"/g, '&quot;')}"${o.class ? ` class="${o.class}"` : ''}${o.loading ? ` loading="${o.loading}"` : ''}${o.fetchpriority ? ` fetchpriority="${o.fetchpriority}"` : ''} width="${w}" height="${h}">`;
});
engine.registerFilter('placeholder_svg_tag', (s, cls) => `<svg class="${cls || ''}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#ddd6c8"/></svg>`);
engine.registerFilter('payment_terms', () => '<shopify-payment-terms></shopify-payment-terms>');
engine.registerFilter('payment_button', () => '<div class="shopify-payment-button"><button type="button" class="shopify-payment-button__button shopify-payment-button__button--unbranded" style="width:100%;min-height:44px">Buy it now</button></div>');
engine.registerFilter('media_tag', () => '<div class="product-gallery__media">media</div>');
engine.registerFilter('format_address', () => '');
engine.registerFilter('font_modify', (f) => f); engine.registerFilter('font_face', () => '');

class Swallow extends Tag {
  constructor(token, remain, liquid, end) { super(token, remain, liquid); const st = this.liquid.parser.parseStream(remain); st.on(`tag:${end}`, () => st.stop()).on('template', () => {}).on('end', () => st.stop()); st.start(); }
  render() { return ''; }
}
engine.registerTag('schema', class extends Swallow { constructor(t, r, l) { super(t, r, l, 'endschema'); } });
engine.registerTag('javascript', class extends Swallow { constructor(t, r, l) { super(t, r, l, 'endjavascript'); } });
const blockTag = (end, open, close) => class extends Tag {
  constructor(token, remain, liquid) {
    super(token, remain, liquid); this.tpls = []; this.rawArgs = token.args || '';
    const st = this.liquid.parser.parseStream(remain); st.on(`tag:${end}`, () => st.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => st.stop()); st.start();
  }
  *render(ctx, emitter) {
    let attrs = '';
    if (open === 'form') {
      const parts = this.rawArgs.split(/,(?=(?:[^']*'[^']*')*[^']*$)/).map((x) => x.trim()).slice(1);
      for (const part of parts) { const m = part.match(/^([\w-]+)\s*:\s*(.+)$/); if (!m) continue; const val = yield new Value(m[2], this.liquid).value(ctx); attrs += ` ${m[1]}="${val ?? ''}"`; }
      emitter.write(`<form method="post" action="/cart/add" accept-charset="UTF-8"${attrs}>`);
    } else emitter.write(`<${open}>`);
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write(`</${close}>`);
  }
};
engine.registerTag('style', blockTag('endstyle', 'style', 'style'));
engine.registerTag('form', blockTag('endform', 'form', 'form'));

// ---------- datos ----------
const IMAGES = {};
const img = (file, w, h, alt, id) => { const o = { id, src: `img/${file}`, width: w, height: h, aspect_ratio: +(w / h).toFixed(4), alt, presentation: { focal_point: '50.0% 50.0%' }, media_type: 'image' }; o.preview_image = o; IMAGES[o.src] = o; return o; };
const heroImg = img('hero-campaign-01.jpg', 1376, 768, 'Two models in a white room', 1);
const pImgs = [img('cocoon-cardigan-coat-01.jpg', 1600, 1986, 'Cardigan-coat', 11), img('serra-coat-01.jpg', 1600, 1986, 'Serra coat', 12), img('doppio-trench-01.jpg', 1600, 1986, 'Trench', 13), img('wool-waistcoat-01.jpg', 1600, 1986, 'Waistcoat', 14)];
const makeProduct = (media) => {
  const variant = { id: 501, title: 'Default Title', price: 98000, compare_at_price: null, available: true, featured_media: media[0] || null, options: ['Default Title'], option1: 'Default Title', quantity_rule: { min: 1, max: null, increment: 1 }, store_availabilities: [], requires_shipping: true, selling_plan_allocations: [], inventory_quantity: 10, inventory_management: 'shopify', inventory_policy: 'deny', requires_selling_plan: false };
  return { id: 99, title: 'Cocoon Cardigan-Coat', handle: 'cocoon-cardigan-coat', url: '/products/cocoon-cardigan-coat', vendor: 'LINEA NOVE', description: '<p>Hand-spun alpaca, knitted open and assembled without side seams.</p>', price: 98000, price_min: 98000, price_max: 98000, price_varies: false, compare_at_price: null, available: true, has_only_default_variant: true, options: ['Title'], options_with_values: [{ name: 'Title', position: 1, values: ['Default Title'], selected_value: 'Default Title' }], variants: [variant], selected_or_first_available_variant: variant, selected_variant: variant, first_available_variant: variant, featured_media: media[0] || null, featured_image: media[0] || null, media, images: media, selling_plan_groups: [], requires_selling_plan: false, tags: [], type: 'Outerwear' };
};
const links = (arr) => ({ links: arr.map(([title, url, kids]) => ({ title, url, links: kids ? kids.map(([t, u]) => ({ title: t, url: u, links: [] })) : [] })) });
const linklists = { 'main-menu': links([['Home', '/'], ['Catalog', '/collections/all', [['Outerwear', '/collections/outerwear'], ['Knitwear', '/collections/knitwear'], ['Tailoring', '/collections/tailoring'], ['Accessories', '/collections/accessories'], ['The Autumn Series', '/collections/the-autumn-series'], ['The Permanent Collection', '/collections/the-permanent-collection']]], ['Contact', '/pages/contact']]) };

function schemaOf(src) { const m = src.match(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/); return m ? JSON.parse(m[1]) : {}; }
function withDefaults(values, defs) { const out = { ...(values || {}) }; for (const d of defs || []) if (d && d.id && !(d.id in out) && 'default' in d) out[d.id] = d.default; return out; }
function resolveSettings(set, defs) { const out = withDefaults(set, defs); for (const d of defs || []) { if (d.type === 'link_list' && typeof out[d.id] === 'string') out[d.id] = linklists[out[d.id]] || { links: [] }; if (d.type === 'image_picker' && typeof out[d.id] === 'string') out[d.id] = out[d.id].includes('hero') ? heroImg : null;  if (d.type === 'product' && typeof out[d.id] === 'string') out[d.id] = (globalThis.__PRODUCTS__ || {})[out[d.id]] || null; if (d.type === 'page' && typeof out[d.id] === 'string') out[d.id] = null; } return out; }

async function renderSection(type, id, conf, ctxExtra) {
  const src = read(`sections/${type}.liquid`); const schema = schemaOf(src);
  const byType = Object.fromEntries((schema.blocks || []).map((b) => [b.type, b.settings]));
  const order = conf.block_order || Object.keys(conf.blocks || {});
  const blocks = order.map((bid) => ({ id: bid, type: conf.blocks[bid].type, settings: resolveSettings(conf.blocks[bid].settings, byType[conf.blocks[bid].type]), shopify_attributes: '' }));
  const section = { id, settings: resolveSettings(conf.settings, schema.settings), blocks, type };
  const html = await engine.parseAndRender(src, { ...ctxExtra, section, settings });
  const missing = [...new Set(html.match(/\[missing: [^\]]+\]/g) || [])];
  if (missing.length) console.log(`  ${type}: MISSING ${missing.join(', ')}`);
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}

const styleBlock = read('layout/theme.liquid').split('{% style %}')[1].split('{% endstyle %}')[0];
async function page(file, { title, main, cart, template = 'index', product = null, pageObj = null, extraBody = '', globals = {}, hgOverride = null, drawerConf = null }) {
  const hg = hgOverride || JSON.parse(read('sections/header-group.json'));
  const base = { shop: { name: 'LINEA NOVE', currency: 'USD', customer_accounts_enabled: true, money_format: '${{amount}}' }, routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', search_url: '/search', predictive_search_url: '/search/suggest', all_products_collection_url: '/collections/all', product_recommendations_url: '/recommendations/products' }, request: { page_type: template, locale: { iso_code: process.env.LOCALE_ISO || 'en', direction: 'ltr' }, design_mode: false }, template: { name: template }, localization: { available_countries: [{}], available_languages: [{}], country: { currency: { iso_code: 'USD' } } }, cart, search: { terms: '' }, product, page: pageObj, additional_checkout_buttons: true, content_for_additional_checkout_buttons: WALLETS, linklists, ...globals };
  for (const k of Object.keys(GLOBALS)) delete GLOBALS[k];
  Object.assign(GLOBALS, base, { settings });
  let headerGroup = '';
  for (const key of hg.order) headerGroup += await renderSection(hg.sections[key].type, `sections--t__${key}`, hg.sections[key], base);
  let mainHtml = '';
  for (const [type, id, conf] of main) mainHtml += await renderSection(type, id, conf, base);
  const drawer = await renderSection('cart-drawer', 'sections--t__cart-drawer', drawerConf || { settings: {}, blocks: {} }, base);
  const css = await engine.parseAndRender(styleBlock, { settings });
  const html = `<!doctype html>
<html class="no-js" lang="en" dir="ltr" data-animations="subtle"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>
<link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="assets/base.css"><style>${css}</style>
<script src="assets/theme.js" defer></script>
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');window.theme=window.theme||{};window.theme.moneyFormat='\${{amount}}';document.documentElement.dataset.moneyFormat=window.theme.moneyFormat;</script>
</head><body class="template-${template} color-scheme-1"><a class="skip-link" href="#MainContent">Skip to content</a>
${headerGroup}
<main id="MainContent" class="site-main" tabindex="-1">${mainHtml}${extraBody}</main>
${drawer}
</body></html>`;
  fs.writeFileSync(path.join(OUT, file), html);
  console.log('OK', file, html.length);
}

// Dos botones de monedero apilados, del alto que fija la propiedad publica de Shopify.
const WALLETS = '<shopify-accelerated-checkout-cart><div class="wallet-mock" style="display:flex;flex-wrap:wrap;gap:8px"><button type="button" style="flex:1 1 8rem;min-height:var(--shopify-accelerated-checkout-button-block-size,42px);border-radius:var(--shopify-accelerated-checkout-button-border-radius,4px);background:#5a31f4;color:#fff;border:0">Shop Pay</button><button type="button" style="flex:1 1 8rem;min-height:var(--shopify-accelerated-checkout-button-block-size,42px);border-radius:var(--shopify-accelerated-checkout-button-border-radius,4px);background:#000;color:#fff;border:0">G Pay</button></div></shopify-accelerated-checkout-cart>';
// ---------- 5A: colección con tarjetas en todos los estados y filtros con swatch ----------
// Shopify escapa la salida de t en claves que no terminan en _html; el arnés hace lo mismo
// para que las pruebas de nombres con & y comillas midan lo que verá la tienda.
engine.registerFilter('t', (key, ...args) => {
  let out = lookup(String(key)); if (out == null) return `[missing: ${key}]`;
  const named = kw(args);
  if (typeof out === 'object') out = (named.count === 1 ? out.one : out.other) ?? Object.values(out)[0];
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const text = String(out).replace(/\{\{\s*(\w+)\s*\}\}/g, (m, n) => (n in named ? named[n] : m));
  return String(key).endsWith('_html') ? text : esc(text);
});
engine.registerFilter('remove_last', (s, sub) => { s = String(s ?? ''); const i = s.lastIndexOf(sub); return i < 0 ? s : s.slice(0, i) + s.slice(i + sub.length); });
engine.registerTag('paginate', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.tpls = []; const st = this.liquid.parser.parseStream(remain); st.on('tag:endpaginate', () => st.stop()).on('template', (t) => this.tpls.push(t)).on('end', () => st.stop()); st.start(); }
  *render(ctx, emitter) { ctx.push({ paginate: { pages: 1, current_page: 1, parts: [], previous: null, next: null } }); yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); ctx.pop(); }
});

const IMG = (file, id, alt) => img(file, 1600, 1986, alt, id);
const photos = {
  ink: IMG('serra-coat-01.jpg', 3001, 'Coat in ink'), bone: IMG('doppio-trench-01.jpg', 3002, 'Coat in bone'), clay: IMG('cocoon-cardigan-coat-01.jpg', 3003, 'Coat in clay'),
  olive: IMG('wool-waistcoat-01.jpg', 3004, 'Coat in olive'), black: IMG('serra-coat-01.jpg', 3005, 'Scarf in black'), camel: IMG('doppio-trench-01.jpg', 3006, 'Scarf in camel'),
};
Object.values(photos).forEach((m) => { m.media_type = 'image'; });
let vid = 7000;
function product({ id, title, handle, options = [], values = {}, swatches = {}, media = [], soldOut = () => false, missing = () => false, mediaFor = () => null, price = 98000, priceFor = () => null, compareFor = () => null, requiresSellingPlan = false, sellingPlanGroups = [], giftCard = false, variantsCount = null, productUrls = {}, available = null }) {
  const combos = options.reduce((acc, name) => acc.flatMap((c) => values[name].map((v) => [...c, v])), [[]]);
  const variants = options.length === 0
    ? [{ id: ++vid, title: 'Default Title', options: ['Default Title'], available: !soldOut(['Default Title']), price, compare_at_price: null, featured_media: null, requires_selling_plan: requiresSellingPlan }]
    : combos.filter((c) => !missing(c)).map((c) => ({ id: ++vid, title: c.join(' / '), options: c, available: !soldOut(c), price: priceFor(c) ?? price, compare_at_price: compareFor(c), featured_media: mediaFor(c), requires_selling_plan: requiresSellingPlan, url: `/products/${handle}?variant=${vid}` }));
  const optionsWithValues = options.length === 0
    ? [{ name: 'Title', position: 1, values: [{ name: 'Default Title', swatch: null }] }]
    : options.map((name, i) => ({ name, position: i + 1, values: values[name].map((v) => ({ name: v, swatch: swatches[v] || null, product_url: productUrls[v] || null })) }));
  const first = variants.find((v) => v.available) || variants[0];
  const isAvailable = available ?? variants.some((v) => v.available);
  return { id, title, handle, url: `/products/${handle}`, vendor: 'LINEA NOVE', price, price_min: price, price_max: price, price_varies: false, compare_at_price: null, compare_at_price_min: null, available: isAvailable, has_only_default_variant: options.length === 0, requires_selling_plan: requiresSellingPlan, selling_plan_groups: sellingPlanGroups, 'gift_card?': giftCard, variants_count: variantsCount, options: options.length ? options : ['Title'], options_with_values: optionsWithValues, variants, selected_or_first_available_variant: first, first_available_variant: first, featured_media: media[0] || null, media, images: media, tags: [], type: 'Outerwear' };
}
const sizes6 = ['XS', 'S', 'M', 'L', 'XL', 'One Size / Extra Large'];
const colorSwatches = { Ink: { color: { rgb: '29 35 49' } }, Bone: { color: { rgb: '228 218 200' } }, Clay: { image: { ...photos.clay, src: 'img/cocoon-cardigan-coat-01.jpg', presentation: { focal_point: '40.0% 60.0%' } } } };
const P = {
  single: product({ id: 101, title: 'Wool Waistcoat', handle: 'wool-waistcoat', media: [photos.olive] }),
  sizeOnly: product({ id: 102, title: 'Cigarette Trouser', handle: 'cigarette-trouser', options: ['Size'], values: { Size: sizes6 }, media: [photos.ink, photos.bone], soldOut: (c) => c[0] === 'S' }),
  colorSize: product({ id: 103, title: 'Serra Coat', handle: 'serra-coat', options: ['Color', 'Size'], values: { Color: ['Ink', 'Bone', 'Clay', 'Olive', 'Midnight Navy Melange'], Size: sizes6 }, swatches: colorSwatches, media: [photos.ink, photos.bone, photos.clay, photos.olive], mediaFor: (c) => ({ Ink: photos.ink, Bone: photos.bone, Clay: photos.clay }[c[0]] || null), soldOut: (c) => (c[0] === 'Bone' && ['XS', 'S'].includes(c[1])) || c[0] === 'Olive', missing: (c) => c[0] === 'Clay' && c[1] === 'XL', priceFor: (c) => (c[0] === 'Clay' ? 108000 : (c[0] === 'Ink' && c[1] === 'One Size / Extra Large' ? 102000 : null)), compareFor: (c) => (c[0] === 'Bone' ? 120000 : null) }),
  colorOnly: product({ id: 104, title: 'Cashmere Scarf', handle: 'cashmere-scarf', options: ['Color'], values: { Color: ['Black', 'Camel', 'Grey'] }, media: [photos.black, photos.camel], mediaFor: (c) => ({ Black: photos.black, Camel: photos.camel }[c[0]] || null), soldOut: (c) => c[0] === 'Grey' }),
  threeOptions: product({ id: 105, title: 'Three options and twenty four variants', handle: 'qa-06-many-variants', options: ['Color', 'Size', 'Fit'], values: { Color: ['Ink', 'Bone', 'Clay'], Size: ['XS', 'S', 'M', 'L'], Fit: ['Regular', 'Long'] }, media: [photos.bone] }),
  subscription: product({ id: 106, title: 'Care kit subscription', handle: 'care-kit', media: [photos.camel], requiresSellingPlan: true }),
  soldOut: product({ id: 107, title: 'Completely sold out', handle: 'qa-07-sold-out', media: [photos.ink], soldOut: () => true }),
  noImage: product({ id: 108, title: 'No image at all', handle: 'qa-02-no-image', options: ['Size'], values: { Size: ['S', 'M', 'L'] } }),
  longTitle: product({ id: 109, title: 'Oversized Double-Faced Wool And Cashmere Belted Wrap Coat With Raglan Sleeves, Concealed Placket & "Storm" Collar', handle: 'qa-01-long-title', options: ['Color', 'Size'], values: { Color: ['Ink', 'Bone'], Size: ['S', 'M'] }, swatches: colorSwatches, media: [photos.bone], mediaFor: (c) => (c[0] === 'Bone' ? photos.bone : null) }),
  sizeFit: product({ id: 110, title: 'Pleated Wide Trouser', handle: 'pleated-wide-trouser', options: ['Size', 'Fit'], values: { Size: ['S', 'M'], Fit: ['Regular', 'Long'] }, media: [photos.clay] }),
  optionalPlan: product({ id: 111, title: 'Cashmere care service', handle: 'care-service', options: ['Size'], values: { Size: ['S', 'M'] }, media: [photos.camel], sellingPlanGroups: [{ name: 'Seasonal' }] }),
  giftCard: product({ id: 112, title: 'Gift card', handle: 'gift-card', options: ['Denomination'], values: { Denomination: ['$100', '$250'] }, media: [photos.black], giftCard: true }),
  manyVariants: product({ id: 113, title: 'Made to measure coat', handle: 'made-to-measure', options: ['Color', 'Size'], values: { Color: ['Ink', 'Bone'], Size: ['S', 'M'] }, swatches: colorSwatches, media: [photos.ink], variantsCount: 300 }),
  combined: product({ id: 114, title: 'Doppio Trench', handle: 'doppio-trench', options: ['Color', 'Size'], values: { Color: ['Ink', 'Bone'], Size: ['S', 'M'] }, swatches: colorSwatches, media: [photos.bone], productUrls: { Bone: '/products/doppio-trench-bone' } }),
};
const filterValue = (label, count, extra = {}) => ({ label, value: label.toLowerCase(), param_name: 'filter.v.option.color', count, active: false, swatch: null, image: null, ...extra });
const colorNames = ['Black', 'White', 'Ink', 'Bone', 'Camel', 'Clay', 'Olive', 'Navy', 'Burgundy', 'Grey', 'Midnight Navy Melange', 'Pistachio'];
const filters = [
  { label: 'Color', type: 'list', presentation: 'swatch', param_name: 'filter.v.option.color', active_values: [1], values: colorNames.map((n, i) => filterValue(n, n === 'Grey' ? 0 : 3 + i, { active: n === 'Ink', swatch: n === 'Ink' ? { color: { rgb: '29 35 49' } } : (n === 'Bone' ? { color: { rgb: '228 218 200' } } : null) })) },
  { label: 'Material', type: 'list', presentation: null, param_name: 'filter.p.m.custom.material', active_values: [], values: [filterValue('Wool', 8, { param_name: 'filter.p.m.custom.material', swatch: { image: { ...photos.clay, src: 'img/cocoon-cardigan-coat-01.jpg', presentation: { focal_point: '50.0% 50.0%' } } } }), filterValue('Cashmere', 4, { param_name: 'filter.p.m.custom.material' })] },
  { label: 'Size', type: 'list', presentation: 'text', param_name: 'filter.v.option.size', active_values: [], values: ['XS', 'S', 'M', 'L'].map((s) => filterValue(s, 5, { param_name: 'filter.v.option.size' })) },
  { label: 'Price', type: 'price_range', param_name: 'filter.v.price', active_values: [], range_max: 250000, min_value: { value: null, param_name: 'filter.v.price.gte' }, max_value: { value: null, param_name: 'filter.v.price.lte' } },
];
const collectionTpl = JSON.parse(read('templates/collection.json'));
const mainKey = collectionTpl.order.find((k) => collectionTpl.sections[k].type === 'main-collection');
const mainConf = { ...collectionTpl.sections[mainKey], settings: { ...collectionTpl.sections[mainKey].settings, show_quick_add: true, show_secondary_image: true, show_vendor: false, default_grid_columns: '4' }, blocks: {}, block_order: [] };
const emptyCart = { item_count: 0, 'empty?': true, empty: true, currency: { iso_code: 'USD', symbol: '$' }, total_price: 0, note: '', cart_level_discount_applications: [], taxes_included: false, items: [] };
const products = Object.values(P);
const collection = { title: 'All', url: '/collections/all', handle: 'all', description: '', products, products_count: products.length, filters, sort_options: [{ value: 'manual', name: 'Featured' }], sort_by: 'manual', default_sort_by: 'manual', featured_image: null, image: null };


await page('collection.html', { title: 'Collection 5A', template: 'collection', cart: emptyCart, main: [['main-collection', 'template--t__main', mainConf]], globals: { collection } });

// Respuestas de /cart/add.js: el cajon ya con la linea anadida, cuyo enlace lleva ?variant=.
{
  const responses = {};
  const lineFor = (p, v) => ({ key: `${v.id}:k`, id: v.id, variant_id: v.id, index: 0, quantity: 1, title: `${p.title} - ${v.title}`, product_title: p.title, variant_title: v.title, url: `${p.url}?variant=${v.id}`, image: p.media[0] || null, final_price: v.price, final_line_price: v.price, original_price: v.price, original_line_price: v.price, line_level_discount_allocations: [], properties: {}, selling_plan_allocation: null, product: p, variant: { ...v, quantity_rule: { min: 1, max: null, increment: 1 }, unit_price_measurement: null }, options_with_values: p.has_only_default_variant ? [] : p.options.map((name, i) => ({ name, value: v.options[i] })), unit_price_measurement: null, discounts: [] });
  const base = { shop: { name: 'LINEA NOVE', currency: 'USD', money_format: '${{amount}}' }, routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', all_products_collection_url: '/collections/all' }, request: { page_type: 'collection', locale: { iso_code: process.env.LOCALE_ISO || 'en', direction: 'ltr' } }, template: { name: 'collection' }, additional_checkout_buttons: true, content_for_additional_checkout_buttons: WALLETS, linklists };
  for (const p of products) {
    for (const v of p.variants) {
      const cart = { ...emptyCart, item_count: 1, 'empty?': false, empty: false, total_price: v.price, items: [lineFor(p, v)] };
      for (const k of Object.keys(GLOBALS)) delete GLOBALS[k];
      Object.assign(GLOBALS, base, { cart, settings });
      const drawerHtml = await renderSection('cart-drawer', 'sections--t__cart-drawer', { settings: {}, blocks: {} }, { ...base, cart });
      responses[v.id] = { id: v.id, variant_id: v.id, product_title: p.title, url: `${p.url}?variant=${v.id}`, sections: { 'sections--t__cart-drawer': drawerHtml } };
    }
  }
  fs.writeFileSync(path.join(OUT, 'add-responses.json'), JSON.stringify(responses));
  fs.writeFileSync(path.join(OUT, 'fixture.json'), JSON.stringify(Object.fromEntries(Object.entries(P).map(([k, p]) => [k, { id: p.id, title: p.title, url: p.url, variants: p.variants.map((v) => ({ id: v.id, options: v.options, available: v.available, media: v.featured_media?.id ?? null })) }]))));
  console.log('OK add-responses.json', Object.keys(responses).length);
}

// =====================================================================================
// 5B-001: fichas para el visor de zoom y los arreglos de medios (H-07, H-13, H-19).
// =====================================================================================
// media_tag de prueba: un <video> real (sin fuente) y un iframe con "youtube" en la ruta que
// registra los mensajes recibidos, para comprobar la pausa al deslizar sin red externa.
engine.registerFilter('media_tag', (media) => {
  if (media?.media_type === 'video') return '<video class="product-gallery__media" controls preload="none" playsinline></video>';
  if (media?.media_type === 'external_video') return '<iframe class="product-gallery__media" src="youtube-embed.html" title="Video" allow="autoplay"></iframe>';
  return '<div class="product-gallery__media">media</div>';
});
fs.writeFileSync(path.join(OUT, 'youtube-embed.html'), '<!doctype html><title>embed</title><script>window.__messages=[];addEventListener("message",(e)=>window.__messages.push(e.data));</script>');

const productTpl5 = JSON.parse(read('templates/product.json'));
const mediaImage = (file, w, h, alt, id, position) => Object.assign(img(file, w, h, alt, id), { position, media_type: 'image' });
const mediaOther = (type, id, position, poster) => ({ id, position, media_type: type, alt: '', aspect_ratio: poster.aspect_ratio, preview_image: poster });
function pdp5b(id, title, handle, media) {
  const base = makeProduct(media);
  const variant = { ...base.variants[0], id: id * 10, featured_media: media.find((m) => m.media_type === 'image') || null };
  return { ...base, id, title, handle, url: `/products/${handle}`, media, images: media.filter((m) => m.media_type === 'image'), featured_media: media[0] || null, featured_image: media[0] || null, variants: [variant], selected_or_first_available_variant: variant, selected_variant: variant, first_available_variant: variant };
}
const large = mediaImage('zoom-large.png', 3000, 3750, '', 8101, 1);
const demo = mediaImage('zoom-demo.png', 1856, 2304, '', 8102, 2);
const video = mediaOther('video', 8103, 3, mediaImage('zoom-poster.png', 1600, 900, '', 8199, 0));
const soft = mediaImage('zoom-soft.png', 928, 1152, 'Detail of the collar', 8104, 4);
const small = mediaImage('zoom-small.png', 600, 750, '', 8105, 5);
const five = pdp5b(801, 'Serra Coat', 'serra-coat-5b', [large, demo, video, soft, small]);
const single = pdp5b(802, 'Wool Waistcoat', 'wool-waistcoat-5b', [mediaImage('zoom-single.png', 2400, 3000, '', 8201, 1)]);
const withYoutube = pdp5b(803, 'Doppio Trench', 'doppio-trench-5b', [
  mediaImage('zoom-yt-a.png', 2000, 2500, '', 8301, 1),
  mediaOther('external_video', 8302, 2, mediaImage('zoom-yt-poster.png', 1280, 720, '', 8399, 0)),
  mediaImage('zoom-yt-b.png', 2000, 2500, '', 8303, 3),
]);
const cart5b = { item_count: 0, 'empty?': true, empty: true, currency: { iso_code: 'USD', symbol: '$' }, total_price: 0, note: '', cart_level_discount_applications: [], taxes_included: false, items: [] };
const main5b = (settings = {}) => [['main-product', 'template--t__main', { ...productTpl5.sections.main, settings: { ...productTpl5.sections.main.settings, ...settings } }]];
const filler = '<section style="height:1400px" class="section"></section>';
await page('pdp-zoom.html', { title: 'PDP zoom', template: 'product', product: five, cart: cart5b, main: main5b(), extraBody: filler });
await page('pdp-zoom-stack.html', { title: 'PDP zoom stack', template: 'product', product: five, cart: cart5b, main: main5b({ media_layout: 'stack' }), extraBody: filler });
await page('pdp-zoom-single.html', { title: 'PDP zoom single', template: 'product', product: single, cart: cart5b, main: main5b(), extraBody: filler });
await page('pdp-zoom-off.html', { title: 'PDP zoom off', template: 'product', product: five, cart: cart5b, main: main5b({ enable_media_zoom: false }), extraBody: filler });
await page('pdp-zoom-youtube.html', { title: 'PDP youtube', template: 'product', product: withYoutube, cart: cart5b, main: main5b(), extraBody: filler });
console.log('OK 5B-001 pages');

// Dependencias estaticas del sitio de prueba: assets reales del tema, axe y fotos.
fs.rmSync(path.join(OUT, 'assets'), { recursive: true, force: true });
try {
  fs.symlinkSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), 'dir');
} catch {
  fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
}
{
  const axe = path.join(ROOT, 'tests/vendor/axe.min.js');
  if (fs.existsSync(axe)) fs.copyFileSync(axe, path.join(OUT, 'axe.min.js'));
  if (!fs.existsSync(path.join(OUT, 'fonts.css'))) fs.writeFileSync(path.join(OUT, 'fonts.css'), '');
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const png = (w, h, [r, g, b]) => {
    const row = Buffer.alloc(1 + w * 3); for (let x = 0; x < w; x++) row.set([r, g, b], 1 + x * 3);
    const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr.set([8, 2, 0, 0, 0], 8);
    return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.concat(Array(h).fill(row)))), chunk('IEND', Buffer.alloc(0))]);
  };
  const tones = [[196, 170, 136], [120, 112, 98], [168, 150, 128], [70, 66, 60], [210, 200, 184], [150, 132, 110]];
  fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
  Object.values(IMAGES).filter((o) => o.src?.startsWith('img/')).forEach((o, i) => {
    const dest = path.join(OUT, o.src);
    const source = process.env.IMG_DIR ? path.join(process.env.IMG_DIR, path.basename(o.src)) : null;
    if (source && fs.existsSync(source)) fs.copyFileSync(source, dest);
    else if (!fs.existsSync(dest)) fs.writeFileSync(dest, png(Math.round(o.width / 8), Math.round(o.height / 8), tones[i % tones.length]));
  });
}
