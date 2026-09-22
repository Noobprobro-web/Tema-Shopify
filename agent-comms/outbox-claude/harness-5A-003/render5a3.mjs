// Sprint 5A-003. Copia de harness-5A-001/render5a.mjs con las paginas de CLAUDE-DIRECTIVE-5A-003
// al final (ficha con plan exigido, cabecera con logos y menus, coleccion vacia, doble escape y
// cajon). Uso (desde esta carpeta): OUT_DIR=site node render5a3.mjs; en espanol:
// OUT_DIR=site-es LOCALE_FILE=locales/es.json LOCALE_ISO=es node render5a3.mjs.
// Sprint 5A. Render fiel de la coleccion: el Liquid real de main-collection y product-card
// (liquidjs), con los valores por defecto del schema, el {% style %} real de theme.liquid y los
// assets reales del tema. Uso (desde esta carpeta):
//   OUT_DIR=site-en node render5a.mjs
//   OUT_DIR=site-es LOCALE_FILE=locales/es.json node render5a.mjs
// Dependencias: liquidjs y @playwright/test. Las fotos de demostracion se copian desde IMG_DIR si
// se indica; si no, se generan marcadores PNG de color liso con el mismo nombre y proporcion.
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid, Tag, Value } from 'liquidjs';

// Por defecto, la raiz del tema es tres niveles arriba de esta carpeta (agent-comms/outbox-claude/harness-5A-003).
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
// 5A-003: paginas para las 8 correcciones de CLAUDE-DIRECTIVE-5A-003.
// =====================================================================================
linklists['main-menu'].handle = 'main-menu';
linklists.footer = { ...links([['About', '/pages/about'], ['FAQ', '/pages/faq'], ['Support', '/pages/support']]), handle: 'footer' };
const productTpl5 = JSON.parse(read('templates/product.json'));
const hgBase = JSON.parse(read('sections/header-group.json'));
const headerKey = Object.keys(hgBase.sections).find((k) => hgBase.sections[k].type === 'header');
const withHeader = (extra) => ({ ...hgBase, sections: { ...hgBase.sections, [headerKey]: { ...hgBase.sections[headerKey], settings: { ...hgBase.sections[headerKey].settings, ...extra } } } });
const optionValue = (name, extra) => Object.assign(new String(name), { name, swatch: null, available: true, selected: false, ...extra });

// Ficha con variantes a medida: [{ title, plan, available }]. Sin grupos de planes, como F06.
function pdpProduct(id, title, handle, spec) {
  const base = makeProduct([{ ...pImgs[0], id: id * 10 }]);
  const single = spec.length === 1;
  const variants = spec.map((v, i) => ({ ...base.variants[0], id: id * 100 + i, title: v.title, options: [v.title], option1: v.title, available: v.available ?? true, requires_selling_plan: Boolean(v.plan), selling_plan_allocations: [], featured_media: base.media[0] }));
  const optionName = single ? 'Title' : 'Size';
  return {
    ...base, id, title, handle, url: `/products/${handle}`, has_only_default_variant: single,
    options: [optionName],
    options_with_values: [{ name: optionName, position: 1, selected_value: spec[0].title, values: spec.map((v, i) => optionValue(v.title, { selected: i === 0, available: v.available ?? true })) }],
    variants, selected_or_first_available_variant: variants[0], selected_variant: variants[0], first_available_variant: variants[0],
    requires_selling_plan: spec.every((v) => v.plan), selling_plan_groups: [],
  };
}
const cart0 = emptyCart;
const pdpMain = [['main-product', 'template--t__main', productTpl5.sections.main]];
const f06 = pdpProduct(601, 'F06 Subscription Only Care Kit', 'f06-subscription', [{ title: 'Default Title', plan: true }]);
await page('pdp-plan.html', { title: 'PDP plan', template: 'product', product: f06, cart: cart0, main: pdpMain, extraBody: '<section style="height:1600px" class="section"></section>' });
const mixed = pdpProduct(602, 'O\'Brien & Co "Care" kit', 'mixed-plan', [{ title: 'S' }, { title: 'M', plan: true }, { title: 'L', available: false }]);
await page('pdp-plan-mixed.html', { title: 'PDP plan mixed', template: 'product', product: mixed, cart: cart0, main: pdpMain, extraBody: '<section style="height:1600px" class="section"></section>' });
const normal = pdpProduct(603, 'Wool Waistcoat', 'wool-waistcoat-5a3', [{ title: 'S' }, { title: 'M' }]);
await page('pdp-normal.html', { title: 'PDP normal', template: 'product', product: normal, cart: cart0, main: pdpMain });

// Cabecera: logos de tres proporciones con dos anchos del ajuste "Logo width".
const logoImg = { wide: img('logo-wide.png', 960, 240, 'LINEA NOVE', 9101), square: img('logo-square.png', 400, 400, 'LINEA NOVE', 9102), tall: img('logo-tall.png', 240, 480, 'LINEA NOVE', 9103) };
const home = [['main-placeholder', 'template--t__main', { settings: {}, blocks: {} }]];
for (const [ratio, image] of Object.entries(logoImg)) {
  for (const width of [80, 240]) {
    settings.logo = image; settings.logo_width = width;
    await page(`header-logo-${ratio}-${width}.html`, { title: `Logo ${ratio} ${width}`, template: 'index', cart: cart0, main: home });
  }
}
settings.logo = null; settings.logo_width = 140;

// Menu secundario: por defecto (main-menu, igual al principal) y con un menu propio.
await page('header-default.html', { title: 'Header default', template: 'index', cart: cart0, main: home });
await page('header-secondary.html', { title: 'Header secondary', template: 'index', cart: cart0, main: home, hgOverride: withHeader({ secondary_menu: 'footer' }) });
const cart3 = { ...cartWith5(3) };
function cartWith5(qty) { return { item_count: qty, 'empty?': qty === 0, empty: qty === 0, currency: { iso_code: 'USD', symbol: '$' }, total_price: 30000 * qty, note: '', cart_level_discount_applications: [], taxes_included: false, items: [] }; }
await page('header-count.html', { title: 'Header count', template: 'index', cart: cart3, main: home });

// Coleccion vacia: sin filtros, con un filtro activo y la coleccion "all" vacia.
const noFilters = filters.map((f) => ({ ...f, active_values: [], values: (f.values || []).map((v) => ({ ...v, active: false })), min_value: f.min_value ? { ...f.min_value, value: null } : f.min_value, max_value: f.max_value ? { ...f.max_value, value: null } : f.max_value }));
const emptyCollection = (extra) => ({ title: 'Winter Edit', url: '/collections/winter-edit', handle: 'winter-edit', description: '', products: [], products_count: 0, all_products_count: 0, filters: noFilters, sort_options: [{ value: 'manual', name: 'Featured' }], sort_by: 'manual', default_sort_by: 'manual', featured_image: null, image: null, ...extra });
await page('collection-empty.html', { title: 'Empty', template: 'collection', cart: cart0, main: [['main-collection', 'template--t__main', mainConf]], globals: { collection: emptyCollection({}) } });
await page('collection-empty-filtered.html', { title: 'Empty filtered', template: 'collection', cart: cart0, main: [['main-collection', 'template--t__main', mainConf]], globals: { collection: emptyCollection({ filters, all_products_count: 12, sort_by: 'price-ascending' }) } });
await page('collection-all-empty.html', { title: 'All empty', template: 'collection', cart: cart0, main: [['main-collection', 'template--t__main', mainConf]], globals: { collection: emptyCollection({ title: 'Products', handle: 'all', url: '/collections/all' }) } });

// Doble escape: busqueda con & y apostrofo en el titulo del placeholder.
await page('search-escape.html', { title: 'Search escape', template: 'search', cart: cart0, main: [['main-placeholder', 'template--t__main', { settings: {}, blocks: {} }]], globals: { search: { performed: true, terms: 'Niño & O\'Brien <b>' } } });

// Cajon: progreso por niveles activado a mano, por encima del umbral del obsequio.
const cartRich = { ...cartWith5(1), total_price: 30000 };
await page('drawer-tiered.html', { title: 'Drawer tiered', template: 'index', cart: cartRich, main: home, drawerConf: { settings: { enable_tiered_progress: true }, blocks: {} } });
await page('drawer-default.html', { title: 'Drawer default', template: 'index', cart: cartRich, main: home });
console.log('OK 5A-003 pages');

// Dependencias estaticas del sitio de prueba: assets reales del tema, axe y fotos.
fs.cpSync(path.join(ROOT, 'assets'), path.join(OUT, 'assets'), { recursive: true });
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
