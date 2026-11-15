import fs from 'node:fs';
import path from 'node:path';
import { Liquid, Tag, Hash } from 'liquidjs';

const ROOT = '/home/claude/w2';
const OUT = '/tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/render/site';
fs.mkdirSync(OUT, { recursive: true });

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const locales = JSON.parse(read('locales/en.default.json'));
const settingsData = JSON.parse(read('config/settings_data.json'));
const cur = settingsData.current || settingsData;

const FONTS = {
  libre_baskerville_n4: { family: 'Libre Baskerville', fallback_families: 'serif', style: 'normal', weight: '400' },
  assistant_n4: { family: 'Assistant', fallback_families: 'sans-serif', style: 'normal', weight: '400' },
};
const font = (h) => FONTS[h] || { family: 'Georgia', fallback_families: 'serif', style: 'normal', weight: '400' };

const settings = {
  ...cur,
  type_body_font: font(cur.type_body_font),
  type_heading_font: font(cur.type_heading_font),
  color_schemes: Object.entries(cur.color_schemes).map(([id, v]) => ({ id, settings: v.settings })),
  default_color_scheme: { id: cur.default_color_scheme || 'scheme-1' },
};

// ---------- engine ----------
const engine = new Liquid({
  root: [path.join(ROOT, 'snippets'), path.join(ROOT, 'sections')],
  extname: '.liquid',
  jsTruthy: true,
  strictFilters: false,
  strictVariables: false,
});

const lookup = (key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), locales);
engine.registerFilter('t', function (key, ...args) {
  let out = lookup(String(key));
  if (out == null) return `[missing: ${key}]`;
  if (typeof out === 'object') out = out.other ?? Object.values(out)[0];
  const named = {};
  for (let i = 0; i < args.length; i += 2) named[args[i]] = args[i + 1];
  // liquidjs passes named args as a single object in some call shapes
  if (args.length === 1 && typeof args[0] === 'object') Object.assign(named, args[0]);
  return String(out).replace(/\{\{\s*(\w+)\s*\}\}/g, (m, n) => (n in named ? named[n] : m));
});
const handleize = (s) =>
  String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
engine.registerFilter('handleize', handleize);
engine.registerFilter('handle', handleize);
engine.registerFilter('asset_url', (s) => `assets/${s}`);
engine.registerFilter('stylesheet_tag', (href) => `<link rel="stylesheet" href="${href}">`);
engine.registerFilter('script_tag', (src) => `<script src="${src}"></script>`);
engine.registerFilter('image_url', () => '');
engine.registerFilter('font_modify', (f) => f);
engine.registerFilter('font_face', () => '');
engine.registerFilter('money', (v) => `$${(Number(v) / 100).toFixed(2)}`);
engine.registerFilter('money_with_currency', (v) => `$${(Number(v) / 100).toFixed(2)} USD`);
engine.registerFilter('placeholder_svg_tag', (s, cls) =>
  `<svg class="${cls || ''}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ddd6c8"/><path d="M20 70 L40 45 L55 62 L70 48 L85 70 Z" fill="#b9ae99"/><circle cx="35" cy="30" r="8" fill="#b9ae99"/></svg>`);
engine.registerFilter('inline_asset_content', (s) => '');
engine.registerFilter('image_tag', () => '');
engine.registerFilter('within', (s) => s);
engine.registerFilter('link_to', (s, url) => `<a href="${url}">${s}</a>`);
engine.registerFilter('metafield_text', (s) => s);
engine.registerFilter('highlight', (s) => s);

// {% schema %} ... {% endschema %} -> nothing
class SwallowTag extends Tag {
  constructor(token, remainTokens, liquid, endTag) {
    super(token, remainTokens, liquid);
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on(`tag:${endTag}`, () => stream.stop()).on('template', () => {}).on('end', () => stream.stop());
    stream.start();
  }
  render() { return ''; }
}
engine.registerTag('schema', class extends SwallowTag { constructor(t, r, l) { super(t, r, l, 'endschema'); } });
engine.registerTag('javascript', class extends SwallowTag { constructor(t, r, l) { super(t, r, l, 'endjavascript'); } });

// {% style %} -> <style>...</style>
engine.registerTag('style', class extends Tag {
  constructor(token, remainTokens, liquid) {
    super(token, remainTokens, liquid);
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on('tag:endstyle', () => stream.stop())
      .on('template', (tpl) => this.tpls.push(tpl))
      .on('end', () => stream.stop());
    stream.start();
  }
  *render(ctx, emitter) {
    emitter.write('<style>');
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write('</style>');
  }
});

// {% form 'contact' %} -> <form>
engine.registerTag('form', class extends Tag {
  constructor(token, remainTokens, liquid) {
    super(token, remainTokens, liquid);
    this.tpls = [];
    const stream = this.liquid.parser.parseStream(remainTokens);
    stream.on('tag:endform', () => stream.stop())
      .on('template', (tpl) => this.tpls.push(tpl))
      .on('end', () => stream.stop());
    stream.start();
  }
  *render(ctx, emitter) {
    emitter.write('<form method="post" action="/contact#contact_form" accept-charset="UTF-8" class="contact-form">');
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    emitter.write('</form>');
  }
});

for (const t of ['sections', 'section', 'paginate', 'endpaginate', 'liquid_noop']) {
  if (t === 'sections' || t === 'section') {
    engine.registerTag(t, class extends Tag { render() { return ''; } });
  }
}

// ---------- helpers ----------
function blocksFrom(tplSection) {
  const order = tplSection.block_order || Object.keys(tplSection.blocks || {});
  return order.map((id, i) => {
    const b = tplSection.blocks[id];
    return {
      id, type: b.type, settings: b.settings || {}, index: i, index0: i,
      shopify_attributes: '',
    };
  });
}

// Shopify aplica los valores por defecto del schema a todo ajuste que la plantilla JSON
// no declare. Sin esto el mock apaga cosas que en la tienda salen encendidas (el buscador
// de la FAQ, por ejemplo) y se revisa una pagina que no es la que ve el comerciante.
function schemaOf(src) {
  const m = src.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  return m ? JSON.parse(m[1]) : {};
}
function withDefaults(settings, defs) {
  const out = { ...(settings || {}) };
  for (const d of defs || []) {
    if (d && d.id && !(d.id in out) && 'default' in d) out[d.id] = d.default;
  }
  return out;
}

async function renderSection(sectionFile, tplFile, page) {
  const tpl = JSON.parse(read(`templates/${tplFile}`));
  const sec = tpl.sections[tpl.order[0]];
  const src = read(`sections/${sectionFile}`);
  const schema = schemaOf(src);
  const byType = Object.fromEntries((schema.blocks || []).map((b) => [b.type, b.settings]));
  const blocks = blocksFrom(sec).map((b) => ({ ...b, settings: withDefaults(b.settings, byType[b.type]) }));
  const section = { id: 'main', settings: withDefaults(sec.settings, schema.settings), blocks, type: sec.type };
  const ctx = {
    settings, section, page, blocks,
    request: { page_type: 'page', locale: { iso_code: 'en', direction: 'ltr' }, design_mode: false },
    shop: { name: 'LINEA NOVE', money_format: '${{amount}}' },
    routes: { root_url: '/', cart_url: '/cart', search_url: '/search', account_url: '/account' },
    form: {},
    canonical_url: 'https://example.com',
    page_title: page.title,
  };
  return { html: await engine.parseAndRender(src, ctx), ctx };
}

const styleBlock = read('layout/theme.liquid').split('{% style %}')[1].split('{% endstyle %}')[0];

async function shell({ title, body, animations = 'subtle' }) {
  const css = await engine.parseAndRender(styleBlock, { settings });
  return `<!doctype html>
<html class="no-js" lang="en" dir="ltr" data-animations="${animations}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="stylesheet" href="fonts.css">
<link rel="stylesheet" href="assets/base.css">
<style>${css}</style>
<script src="assets/theme.js" defer="defer"></script>
<script>
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');
window.theme = window.theme || {};
window.theme.moneyFormat = '\${{amount}}';
document.documentElement.dataset.moneyFormat = window.theme.moneyFormat;
</script>
</head>
<body class="template-page color-${settings.default_color_scheme.id}">
<a class="skip-link" href="#MainContent">Skip to content</a>
<main id="MainContent" class="site-main" tabindex="-1">
${body}
</main>
</body></html>`;
}

const jobs = [
  { out: 'documentation.html', section: 'main-documentation.liquid', tpl: 'page.documentation.json', page: { title: 'Documentation', content: '', handle: 'documentacion' } },
  { out: 'support.html', section: 'main-support.liquid', tpl: 'page.support.json', page: { title: 'Support', content: '', handle: 'support' } },
  { out: 'faq.html', section: 'main-faq.liquid', tpl: 'page.faq.json', page: { title: 'Frequently asked questions', content: '', handle: 'faq' } },
  { out: 'about.html', section: 'main-about.liquid', tpl: 'page.about.json', page: { title: 'About', content: '', handle: 'about' } },
  { out: 'policy.html', section: 'main-policy.liquid', tpl: 'page.policy.json', page: { title: 'Terms of service', content: '', handle: 'terms-of-service' } },
];

for (const j of jobs) {
  try {
    const { html } = await renderSection(j.section, j.tpl, j.page);
    fs.writeFileSync(path.join(OUT, j.out), await shell({ title: j.page.title, body: html }));
    const missing = (html.match(/\[missing: [^\]]+\]/g) || []);
    console.log(`OK  ${j.out.padEnd(20)} ${html.length} bytes` + (missing.length ? `  MISSING KEYS: ${[...new Set(missing)].join(', ')}` : ''));
  } catch (e) {
    console.log(`ERR ${j.out}: ${e.message.split('\n')[0]}`);
  }
}
