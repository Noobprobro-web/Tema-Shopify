// Render fiel para 4F-001 y 4F-002: el Liquid real de cada seccion (liquidjs), con los valores por
// defecto del schema, el {% style %} real de theme.liquid, base.css y theme.js reales.
import fs from 'node:fs';
import path from 'node:path';
import { Liquid, Tag, Value } from 'liquidjs';

const ROOT = process.env.THEME_ROOT || '/home/claude/w2';
const OUT = path.resolve(process.env.OUT_DIR || 'site');
fs.mkdirSync(OUT, { recursive: true });
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const locales = JSON.parse(read('locales/en.default.json'));
const cur = JSON.parse(read('config/settings_data.json')).current;
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
async function page(file, { title, main, cart, template = 'index', product = null, pageObj = null, extraBody = '' }) {
  const hg = JSON.parse(read('sections/header-group.json'));
  const base = { shop: { name: 'LINEA NOVE', currency: 'USD', customer_accounts_enabled: true, money_format: '${{amount}}' }, routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', search_url: '/search', predictive_search_url: '/search/suggest', all_products_collection_url: '/collections/all', product_recommendations_url: '/recommendations/products' }, request: { page_type: template, locale: { iso_code: 'en', direction: 'ltr' }, design_mode: false }, template: { name: template }, localization: { available_countries: [{}], available_languages: [{}], country: { currency: { iso_code: 'USD' } } }, cart, search: { terms: '' }, product, page: pageObj, additional_checkout_buttons: true, content_for_additional_checkout_buttons: WALLETS, linklists };
  for (const k of Object.keys(GLOBALS)) delete GLOBALS[k];
  Object.assign(GLOBALS, base, { settings });
  let headerGroup = '';
  for (const key of hg.order) headerGroup += await renderSection(hg.sections[key].type, `sections--t__${key}`, hg.sections[key], base);
  let mainHtml = '';
  for (const [type, id, conf] of main) mainHtml += await renderSection(type, id, conf, base);
  const drawer = await renderSection('cart-drawer', 'sections--t__cart-drawer', { settings: {}, blocks: {} }, base);
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

const productMulti = makeProduct(pImgs.map((m, i) => ({ ...m, id: 900 + i })));
const productSingle = makeProduct([{ ...pImgs[0], id: 950 }]);
productMulti.media.forEach((m) => { m.preview_image = m; IMAGES[m.src] = m; });
const variantFor = (p) => p.variants[0];
const cartWith = (p) => ({ item_count: 1, 'empty?': false, empty: false, currency: { iso_code: 'USD' }, total_price: 98000, note: '', cart_level_discount_applications: [], taxes_included: false, items: [{ key: '501:abc', id: 501, index: 0, quantity: 1, title: p.title, product_title: p.title, variant_title: null, url: p.url, image: p.media[0], final_price: 98000, final_line_price: 98000, original_price: 98000, original_line_price: 98000, line_level_discount_allocations: [], properties: {}, selling_plan_allocation: null, product: p, variant: variantFor(p), unit_price_measurement: null, discounts: [] }] });

const index = JSON.parse(read('templates/index.json'));
const productTpl = JSON.parse(read('templates/product.json'));
const docsTpl = JSON.parse(read('templates/page.documentation.json'));

await page('home.html', { title: 'Home', template: 'index', cart: cartWith(productMulti), main: [['hero-editorial', 'template--t__hero', { ...index.sections.hero_editorial, settings: { ...index.sections.hero_editorial.settings, image_desktop: 'shopify://shop_images/hero-campaign-01.jpg' } }]], extraBody: '<section style="height:2400px;padding:2rem" class="section"><h2>Filler</h2><p>Scroll room for sticky header tests.</p></section>' });
await page('pdp-multi.html', { title: 'PDP multi', template: 'product', product: productMulti, cart: cartWith(productMulti), main: [['main-product', 'template--t__main', productTpl.sections.main]], extraBody: '<section style="height:1600px" class="section"></section>' });
await page('pdp-single.html', { title: 'PDP single', template: 'product', product: productSingle, cart: cartWith(productSingle), main: [['main-product', 'template--t__main', productTpl.sections.main]], extraBody: '<section style="height:1600px" class="section"></section>' });
const residual = '<style>:root{--bg:#FAF8F5}body{font-family:system-ui;padding:0 1.5rem}header{max-width:840px;margin:3rem auto}main{max-width:840px}</style><h2>Legacy intro</h2><p>Kept paragraph with <strong>formatting</strong>.</p><script>document.documentElement.dataset.residualScript="ran"</script><p>Second kept paragraph.</p>';
await page('docs-residual.html', { title: 'Docs residual', template: 'page', cart: cartWith(productMulti), pageObj: { title: 'Documentation', content: residual, handle: 'documentacion' }, main: [['main-documentation', 'template--t__docs', docsTpl.sections.main]] });

const productThree = makeProduct(pImgs.slice(0, 3).map((m, i) => ({ ...m, id: 960 + i })));
const productNone = makeProduct([]);
globalThis.__PRODUCTS__ = Object.fromEntries(['p-a', 'p-b', 'p-c'].map((h, i) => {
  const p = makeProduct([{ ...pImgs[i], id: 980 + i }]);
  const v = { ...p.variants[0], id: 601 + i, price: [98000, 42000, 36000][i], requires_selling_plan: false };
  return [h, { ...p, id: 200 + i, handle: h, title: ['Cocoon Cardigan-Coat', 'Fine Merino Turtleneck', 'Pleated Wide Trouser'][i], url: `/products/${h}`, variants: [v], selected_or_first_available_variant: v, first_available_variant: v, variants_count: 1 }];
}));
await page('pdp-three.html', { title: 'PDP three', template: 'product', product: productThree, cart: cartWith(productMulti), main: [['main-product', 'template--t__main', productTpl.sections.main]] });
await page('pdp-none.html', { title: 'PDP none', template: 'product', product: productNone, cart: cartWith(productMulti), main: [['main-product', 'template--t__main', productTpl.sections.main]] });
const cartTpl = JSON.parse(read('templates/cart.json'));
const cartMainKey = cartTpl.order.find((k) => cartTpl.sections[k].type === 'main-cart-items');
await page('cart.html', { title: 'Cart', template: 'cart', cart: cartWith(productMulti), main: [['main-cart-items', 'template--t__cart', cartTpl.sections[cartMainKey]]] });
fs.mkdirSync(path.join(OUT, 'search'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'search', 'suggest.json'), JSON.stringify({ resources: { results: { products: [{ title: 'Serra Coat', url: '/products/serra-coat', price: '1890.00', available: true, featured_image: { url: 'https://cdn.shopify.com/s/files/1/0854/1978/6483/files/serra-coat-01.jpg?v=1789427381', alt: 'Serra coat' } }], collections: [], pages: [], articles: [], queries: [] } } }));

// ---------- 4F-002 ----------
const emptyCart = { item_count: 0, 'empty?': true, empty: true, currency: { iso_code: 'USD' }, total_price: 0, note: '', cart_level_discount_applications: [], taxes_included: false, items: [] };
const longTitle = 'Cocoon Cardigan-Coat in hand-spun alpaca and merino, knitted open and assembled without side seams, limited series 07';
const productLong = { ...makeProduct([{ ...pImgs[1], id: 970 }]), title: longTitle, handle: 'long-coat', url: '/products/long-coat' };
const cartLong = cartWith(productMulti);
cartLong.items.push({ ...cartLong.items[0], key: '502:def', id: 502, index: 1, quantity: 3, title: longTitle, product_title: longTitle, url: productLong.url, image: productLong.media[0], final_line_price: 294000, original_line_price: 294000, product: productLong });
cartLong.item_count = 4; cartLong.total_price = 392000;
await page('cart-long.html', { title: 'Cart long', template: 'cart', cart: cartLong, main: [['main-cart-items', 'template--t__cart', cartTpl.sections[cartMainKey]]] });

// Secciones del carrito vacio, tal como las devuelve la Section Rendering API.
{
  const hg = JSON.parse(read('sections/header-group.json'));
  const base = { shop: { name: 'LINEA NOVE', currency: 'USD', money_format: '${{amount}}' }, routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', all_products_collection_url: '/collections/all' }, request: { page_type: 'cart', locale: { iso_code: 'en', direction: 'ltr' } }, template: { name: 'cart' }, cart: emptyCart, additional_checkout_buttons: true, content_for_additional_checkout_buttons: WALLETS, linklists };
  for (const k of Object.keys(GLOBALS)) delete GLOBALS[k];
  Object.assign(GLOBALS, base, { settings });
  const drawerHtml = await renderSection('cart-drawer', 'sections--t__cart-drawer', { settings: {}, blocks: {} }, base);
  const pageHtml = await renderSection('main-cart-items', 'template--t__cart', cartTpl.sections[cartMainKey], base);
  fs.writeFileSync(path.join(OUT, 'sections-empty.json'), JSON.stringify({ 'sections--t__cart-drawer': drawerHtml, 'template--t__cart': pageHtml }));
  console.log('OK sections-empty.json');
}

// Bundle con tres piezas para el plural.
{
  const ctl = index.sections.complete_the_look || { type: 'complete-the-look', settings: {}, blocks: {}, block_order: [] };
  const conf = { ...ctl, blocks: { b1: { type: 'bundle_product', settings: { product: 'p-a' } }, b2: { type: 'bundle_product', settings: { product: 'p-b' } }, b3: { type: 'bundle_product', settings: { product: 'p-c' } } }, block_order: ['b1', 'b2', 'b3'] };
  await page('bundle.html', { title: 'Bundle', template: 'index', cart: cartWith(productMulti), main: [['complete-the-look', 'template--t__ctl', conf]] });
}
