// C-01 · fixture SINTETICO: marcado de sections/main-collection.liquid
// renderizado a mano (con los settings de listings/<preset>/templates/collection.json
// y las variables :root de cada preset) servido con el base.css de un commit.
// No ejecuta Liquid ni JS del tema; sirve para comprobar el CSS y el medidor.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PRESETS, parseThemeJson, showFile } from './lib.mjs';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Imagen de tarjeta y de banner como SVG local con dimensiones intrinsecas.
const svg = (w, h, fill) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${fill}"/></svg>`)}`;

function card(i, showVendor) {
  const id = 9000000 + i;
  return `<li class="product-grid__item">
  <article class="product-card" data-product-id="${id}">
    <product-card-variants class="product-card__variants">
      <a class="product-card__media" href="/products/p-${i}" aria-label="Product ${i}" data-card-link>
        <img class="product-card__image product-card__image--primary" src="${svg(800, 1000, '#d9d2c5')}" width="800" height="1000" alt="Product ${i}" loading="eager">
      </a>
      <div class="product-card__content">
        ${showVendor ? '<p class="product-card__vendor">Synthetic vendor</p>' : ''}
        <h3 class="product-card__title" id="CardTitle-${id}"><a href="/products/p-${i}" data-card-link>Synthetic product ${i}</a></h3>
        <div class="price"><span class="price__regular">$${(120 + i * 5).toFixed(2)}</span></div>
      </div>
    </product-card-variants>
  </article>
</li>`;
}

function promotion(block, sectionId) {
  const s = block.settings;
  return `<li class="product-grid__item product-grid__item--promotion">
  <article class="promotion-tile color-${esc(s.color_scheme || 'scheme-1')}" aria-labelledby="PromotionTileTitle-${sectionId}">
    <div class="promotion-tile__content flow">
      ${s.eyebrow ? `<p class="eyebrow">${esc(s.eyebrow)}</p>` : ''}
      ${s.heading ? `<h3 id="PromotionTileTitle-${sectionId}" class="promotion-tile__heading">${esc(s.heading)}</h3>` : ''}
      ${s.text ? `<div class="promotion-tile__text rte">${s.text}</div>` : ''}
      ${s.link_label ? `<a class="button button--secondary promotion-tile__link" href="${esc(s.link_url)}"><span>${esc(s.link_label)}</span></a>` : ''}
    </div>
  </article>
</li>`;
}

const FILTERS = [
  { label: 'Availability', values: ['In stock', 'Out of stock'], param: 'filter.v.availability' },
  { label: 'Size', values: ['XS', 'S', 'M', 'L'], param: 'filter.v.option.size' },
  { label: 'Product type', values: ['Jacket', 'Trousers', 'Shirt'], param: 'filter.p.product_type' },
];

export function renderCollection({ commit, preset, cssHref, products = 8 }) {
  const listing = parseThemeJson(showFile(commit, `listings/${preset.toLowerCase()}/templates/collection.json`));
  const section = listing.sections.main;
  const st = section.settings;
  const presetSettings = parseThemeJson(showFile(commit, 'config/settings_data.json')).presets[preset];
  const sid = 'template--synthetic__main';
  const cols = st.default_grid_columns || '4';

  const slots = [];
  const blocks = (section.block_order || []).map((k) => section.blocks[k]);
  let cursor = 0;
  const total = products + blocks.length;
  for (let pos = 1; pos <= total; pos += 1) {
    const block = blocks.find((b) => Math.min(b.settings.position_in_grid || 4, products + 1) === pos);
    if (block) slots.push(promotion(block, sid));
    else if (cursor < products) slots.push(card((cursor += 1), st.show_vendor));
  }

  const facets = FILTERS.map((f, fi) => `<details class="facet">
            <summary class="facet__summary"><span>${f.label}</span></summary>
            <div class="facet__content"><ul class="facet__values unstyled-list">
              ${f.values.map((v, vi) => `<li><label class="facet__value" for="Filter-${sid}-${fi}-${vi}"><input id="Filter-${sid}-${fi}-${vi}" type="checkbox" name="${f.param}" value="${esc(v)}"><span>${esc(v)}</span><span aria-hidden="true">3</span></label></li>`).join('')}
            </ul></div>
          </details>`).join('\n          ');

  const banner = st.show_collection_image
    ? `<figure class="collection-main__banner"><img class="collection-main__banner-image" src="${svg(2400, 1350, '#bfb6a6')}" width="2400" height="1350" alt="Synthetic collection" fetchpriority="high"></figure>`
    : '';

  return `<!doctype html>
<html class="js" lang="en" data-animations="${esc(presetSettings.animations)}" data-motion-style="${esc(presetSettings.motion_style)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SINTETICO ${preset} collection</title>
<style>
  :root {
    --font-body-family: Georgia, serif; --font-body-style: normal; --font-body-weight: 400;
    --font-heading-family: Georgia, serif; --font-heading-style: normal; --font-heading-weight: 400;
    --font-body-scale: ${presetSettings.body_scale / 100}; --font-heading-scale: ${presetSettings.heading_scale / 100};
    --page-width: ${presetSettings.page_width}px; --page-gutter: ${presetSettings.page_gutter}px;
    --section-spacing: ${presetSettings.section_spacing}px; --button-radius: ${presetSettings.button_radius}px;
  }
  .color-scheme-1 { --color-background: #f6f2ea; --gradient-background: #f6f2ea; --color-foreground: #1d1b18; --color-button: #1d1b18; --color-button-label: #fff; --color-link: #2a2621; --color-border: #9a8f7c; --color-shadow: #1d1b18; }
  .color-scheme-4 { --color-background: #1d1b18; --gradient-background: #1d1b18; --color-foreground: #f6f2ea; --color-button: #f6f2ea; --color-button-label: #1d1b18; --color-link: #f6f2ea; --color-border: #9a8f7c; --color-shadow: #000; }
  .synthetic-header { height: 72px; border-bottom: 1px solid #9a8f7c; }
</style>
<link rel="stylesheet" href="${esc(cssHref)}">
<script>
  // Barra de preview simulada: ?previewbar=<alto> anade un iframe fijo abajo, como Shopify.
  addEventListener('DOMContentLoaded', () => {
    const h = Number(new URLSearchParams(location.search).get('previewbar'));
    if (h > 0) {
      const f = document.createElement('iframe');
      f.id = 'preview-bar-iframe';
      f.title = 'Synthetic preview bar';
      f.style.cssText = 'position:fixed;left:0;bottom:0;width:100%;height:' + h + 'px;border:0;background:#333;z-index:2147483647';
      document.body.append(f);
    }
  });
</script>
</head>
<body class="color-scheme-1">
<header class="synthetic-header" aria-label="Synthetic header"></header>
<main id="MainContent">
<div class="visually-hidden" aria-live="polite" aria-atomic="true" data-facet-live-region></div>
<facet-filters-form data-section-id="${sid}" data-default-grid-columns="${cols}">
  <section class="section collection-main color-${esc(st.color_scheme || 'scheme-1')}" data-facet-section>
    <div class="container flow">
      <header class="collection-main__header flow">
        <p class="eyebrow">Collection</p>
        <h1 class="collection-main__title">Synthetic ${preset}</h1>
        <div class="collection-main__description rte"><p>Synthetic collection used to measure C-01.</p></div>
      </header>
      ${banner}
      <div class="collection-main__body">
        <form class="facets" action="/collections/${preset.toLowerCase()}" method="get" data-facet-form>
          <div class="facets__heading cluster"><h2 class="facets__title">Filters</h2></div>
          ${facets}
          <div class="facets__sort">
            <label for="SortBy-${sid}">Sort by</label>
            <select id="SortBy-${sid}" name="sort_by" data-facet-sort>
              <option value="manual" selected>Featured</option><option value="price-ascending">Price, low to high</option>
            </select>
          </div>
          <div class="facets__actions cluster"><button class="button" type="submit">Apply</button></div>
        </form>
        <div class="collection-products" data-product-grid aria-busy="false">
          <div class="collection-products__toolbar">
            <p class="collection-products__count" data-results-status tabindex="-1">${products} products</p>
          </div>
          <ul class="product-grid unstyled-list" data-product-list data-grid-columns="${cols}">
            ${slots.join('\n            ')}
          </ul>
        </div>
      </div>
    </div>
  </section>
</facet-filters-form>
</main>
</body>
</html>
`;
}

// stages: { before: { commit, css? }, after: {...}, ... }. css opcional sustituye al del commit.
export function buildFixture(root, stages) {
  for (const [stage, { commit, extraCss = '' }] of Object.entries(stages)) {
    const dir = path.join(root, stage);
    mkdirSync(path.join(dir, 'assets'), { recursive: true });
    writeFileSync(path.join(dir, 'assets', 'base.css'), Buffer.concat([showFile(commit, 'assets/base.css'), Buffer.from(extraCss)]));
    for (const preset of PRESETS) {
      mkdirSync(path.join(dir, 'collections'), { recursive: true });
      writeFileSync(path.join(dir, 'collections', `${preset.toLowerCase()}.html`), renderCollection({ commit, preset, cssHref: `/${stage}/assets/base.css` }));
    }
  }
}

export function serve(root) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8' };
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    // /collections/<preset>?stage=<stage> -> <stage>/collections/<preset>.html (misma ruta en ambos estados).
    const m = rel.match(/^collections\/([a-z]+)$/);
    if (m) rel = `${url.searchParams.get('stage') || ''}/collections/${m[1]}.html`;
    const file = path.resolve(root, rel);
    if (!file.startsWith(path.resolve(root))) { res.writeHead(403).end(); return; }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}
