import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const REPO = 'C:/Users/Johan/OneDrive/Documentos/Drive/Tema Shopify';
const require = createRequire(`${REPO}/package.json`);
const { chromium } = require('@playwright/test');

const builds = {
  HEAD: {
    theme: execSync('git show HEAD:assets/theme.js', { cwd: REPO, maxBuffer: 1e8 }).toString(),
    zoom: execSync('git show HEAD:assets/product-zoom.js', { cwd: REPO, maxBuffer: 1e8 }).toString(),
  },
  WORKTREE: {
    theme: readFileSync(`${REPO}/assets/theme.js`, 'utf8'),
    zoom: readFileSync(`${REPO}/assets/product-zoom.js`, 'utf8'),
  },
};

const page = (body) => `<!doctype html><html class="js"><head><meta charset="utf-8"><title>h</title></head><body>${body}
<script src="/theme.js"></script><script src="/product-zoom.js"></script></body></html>`;

const variant = (id, colour, size, available) => ({
  id, title: `${colour} / ${size}`, available, options: [colour, size], price: '$100.00', price_cents: 10000,
  compare_at_price: null, compare_at_price_cents: null, unit_price: null, unit_reference_value: null,
  unit_reference_unit: null, featured_media_id: null, quantity_min: 1, quantity_increment: 1, quantity_max: null,
  requires_selling_plan: false, selling_plan_allocations: [],
});
const VARIANTS = [
  variant(1, 'Camel', 'S', false), variant(2, 'Camel', 'M', false), variant(3, 'Camel', 'L', true),
  variant(4, 'Black', 'S', true), variant(5, 'Black', 'M', true), variant(6, 'Black', 'L', false),
  variant(7, 'Bone', 'S', false), variant(8, 'Bone', 'M', false), variant(9, 'Bone', 'L', false),
];
const radio = (pos, name, value, checked) => `<input id="o-${pos}-${value}" type="radio" name="${name}" value="${value}" data-option-position="${pos}"${checked ? ' checked' : ''}>
<label for="o-${pos}-${value}"><span>${value}</span><span data-unavailable-label hidden>x</span></label>`;

const PAGES = {
  variants: page(`<variant-selects data-add-to-cart-text="Add to cart" data-sold-out-text="Sold out" data-unavailable-text="Unavailable" data-money-format="\${{amount}}">
<fieldset>${['Camel', 'Black', 'Bone'].map((v) => radio(1, 'Colour', v, v === 'Camel')).join('')}</fieldset>
<fieldset>${['S', 'M', 'L'].map((v) => radio(2, 'Size', v, v === 'L')).join('')}</fieldset>
<form id="pf" data-cart-add-form><input type="hidden" name="id" value="3" data-variant-id>
<button type="submit" name="add" data-add-to-cart><span data-add-to-cart-text>Add to cart</span></button></form>
<script type="application/json" data-variant-json>${JSON.stringify(VARIANTS)}</script></variant-selects>`),

  sticky: page(`<section data-section-id="main"><div style="height:200px"></div>
<form id="pf"><input type="hidden" name="id" value="3"><input type="number" name="quantity" value="1">
<button type="submit" name="add" data-add-to-cart><span data-add-to-cart-text>Add to cart</span></button></form>
<div style="height:4000px"></div>
<sticky-cart-bar data-product-form-id="pf" style="position:fixed;bottom:0;left:0" aria-hidden="true" inert>
<button type="button" data-sticky-submit aria-label="Add"><span data-sticky-label>Add to cart</span></button></sticky-cart-bar></section>`),

  cart: page(`<form data-cart-add-form data-quick-buy-form id="qa1"><input type="hidden" name="id" value="1"><button type="submit" name="add">A</button></form>
<form data-cart-add-form data-quick-buy-form id="qa2"><input type="hidden" name="id" value="2"><button type="submit" name="add">B</button></form>
<cart-drawer data-cart-add-url="/cart/add.js" data-cart-change-url="/cart/change.js" data-cart-url="/cart" data-section-id="cart-drawer"
 data-error-message="Error" data-added-message="Added" data-item-count="0">
<div data-cart-drawer-overlay hidden></div><div data-cart-drawer-panel><button data-cart-drawer-close>Close</button>
<div data-cart-drawer-content></div><div role="status" data-cart-drawer-status></div></div></cart-drawer>`),

  zoom: page(`<section data-section-id="s"><button id="opener" data-zoom-open="0">open</button>
<product-zoom data-status-template="[index]/[total] [zoom]%"><dialog data-zoom-dialog>
<button data-zoom-close>x</button><button data-zoom-in>+</button><button data-zoom-out>-</button><button data-zoom-reset>r</button>
<output data-zoom-status></output><span data-zoom-counter></span>
<div data-zoom-track style="width:300px;height:300px;overflow:auto"><div data-zoom-slide data-media-id="1">
<img alt="" data-width="1000" data-ratio="1" data-srcset="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div></div>
</dialog></product-zoom></section>`),
};

const drawerHtml = (lines) => `<cart-drawer data-item-count="${lines.length}"><div data-cart-drawer-content>${lines
  .map((id) => `<div class="cart-drawer-item__title"><a href="/products/p${id}?variant=${id}">P${id}</a></div>`).join('')}</div></cart-drawer>`;

async function run(label, build) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 375, height: 800 } });
  const server = { cart: [], held: [], sectionReads: 0 };
  await context.route('http://harness.test/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === '/theme.js') return route.fulfill({ contentType: 'text/javascript', body: build.theme });
    if (url.pathname === '/product-zoom.js') return route.fulfill({ contentType: 'text/javascript', body: build.zoom });
    if (url.pathname === '/cart/add.js') {
      const id = /name="id"\r\n\r\n(\d+)/.exec(request.postData() || '')?.[1];
      server.held.push({ id, route });
      if (server.held.length < 2) return;
      // Llegaron A y B; Shopify aplica B antes que A y contesta A primero.
      const [a, b] = server.held;
      server.cart.push(b.id);
      const bLines = [...server.cart];
      server.cart.push(a.id);
      const aLines = [...server.cart];
      const reply = (held, lines) => held.route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ variant_id: Number(held.id), product_title: `P${held.id}`, sections: { 'cart-drawer': drawerHtml(lines) } }),
      });
      await reply(a, aLines);
      await new Promise((r) => setTimeout(r, 150));
      await reply(b, bLines);
      return;
    }
    if (url.pathname === '/cart' && url.searchParams.get('section_id')) {
      server.sectionReads += 1;
      return route.fulfill({ contentType: 'text/html', body: drawerHtml(server.cart) });
    }
    const name = url.pathname.slice(1);
    if (PAGES[name]) return route.fulfill({ contentType: 'text/html', body: PAGES[name] });
    return route.fulfill({ status: 404, body: '' });
  });

  const p = await context.newPage();
  const out = {};

  // A360-05
  await p.goto('http://harness.test/variants');
  const state = () => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-option-position]')].map((i) => [
    i.value, `${i.disabled ? 'disabled' : 'enabled'}/${document.querySelector(`label[for="${i.id}"] [data-unavailable-label]`).hidden ? 'ok' : 'SOLD'}`,
  ])));
  out.variantsCamelL = await state();
  await p.click('label[for="o-1-Black"]');
  out.variantsBlackL = await state();
  await p.click('label[for="o-2-S"]');
  out.blackS_atcDisabled = await p.$eval('[data-add-to-cart]', (b) => b.disabled);
  await p.click('label[for="o-1-Camel"]');
  out.camelS_atcDisabled = await p.$eval('[data-add-to-cart]', (b) => b.disabled);

  // A360-04
  await p.goto('http://harness.test/sticky');
  await p.evaluate(() => window.scrollTo(0, 2000));
  await p.waitForFunction(() => document.querySelector('sticky-cart-bar').hasAttribute('data-visible'));
  await p.focus('[data-sticky-submit]');
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForFunction(() => !document.querySelector('sticky-cart-bar').hasAttribute('data-visible'));
  out.stickyFocusAfterHide = await p.evaluate(() => {
    const a = document.activeElement;
    return a === document.body ? 'BODY' : a.matches('[data-add-to-cart]') ? 'primary ATC' : a.outerHTML.slice(0, 60);
  });

  // A360-03
  await p.goto('http://harness.test/cart');
  await p.evaluate(() => { document.getElementById('qa1').requestSubmit(); document.getElementById('qa2').requestSubmit(); });
  await p.waitForTimeout(1200);
  out.cartServer = server.cart;
  out.cartDrawer = await p.$$eval('.cart-drawer-item__title a', (as) => as.map((a) => new URL(a.href).searchParams.get('variant')));
  out.cartSectionReads = server.sectionReads;

  // A360-11
  await p.goto('http://harness.test/zoom');
  await p.click('#opener');
  out.zoomOpenBodyLock = await p.evaluate(() => document.body.hasAttribute('data-modal-open'));
  await p.evaluate(() => document.querySelector('product-zoom').remove());
  await p.waitForTimeout(200);
  out.zoomAfterUnloadBodyLock = await p.evaluate(() => document.body.hasAttribute('data-modal-open'));

  await browser.close();
  console.log(`\n=== ${label} ===\n${JSON.stringify(out, null, 1)}`);
}

for (const [label, build] of Object.entries(builds)) await run(label, build);
