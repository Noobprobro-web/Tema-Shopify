import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/home/user/Tema-Shopify/');
const { chromium, request } = require('playwright');
const H = 'sartorial-theme-kvkzl39t.myshopify.com', O = 'https://' + H;
const THEMES = { sartorial: '190316839216', imprint: '190316871984', archive: '190316904752' };
const only = (process.env.LV_PRESETS || 'sartorial,imprint,archive').split(',');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
async function nav(page, path, id) {
  for (let a = 0; a < 3; a++) {
    const w = Math.max(0, 2500 - (Date.now() - last)); if (w) await sleep(w); last = Date.now();
    const r = await page.goto(`${O}${path}${path.includes('?') ? '&' : '?'}preview_theme_id=${id}`, { waitUntil: 'load' });
    if (r && r.status() === 429) { const ra = Number(r.headers()['retry-after']) || 30 * (a + 1); console.error('429 wait', ra); await sleep(ra * 1000); continue; }
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
    await sleep(500);
    return r ? r.status() : 0;
  }
  throw new Error('429 persistente');
}
const vendors = {};
{ const c0 = await request.newContext({ baseURL: O }); await c0.post('/password', { form: { form_type: 'storefront_password', utf8: '✓', password: process.env.STOREFRONT_PASSWORD }, maxRedirects: 0 });
  await sleep(1500); const pj = await c0.get(`/collections/fixtures/products.json?preview_theme_id=${THEMES.sartorial}`); const j = await pj.json(); for (const p of j.products) vendors[p.title] = p.vendor; await c0.dispose(); }
console.log('vendors', JSON.stringify(vendors));
const out = { vendorsFromProductsJson: vendors, generatedAt: new Date().toISOString(), results: [] };
const browser = await chromium.launch();
try {
  for (const preset of only) {
    const id = THEMES[preset];
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    // unlock with API client in same jar
    const pr = await ctx.request.post(`${O}/password`, { form: { form_type: 'storefront_password', utf8: '✓', password: process.env.STOREFRONT_PASSWORD }, maxRedirects: 0 });
    if (pr.status() !== 302 && pr.status() !== 303) throw new Error('auth ' + pr.status());
    const page = await ctx.newPage();
    for (const [vw, vh] of [[390, 844], [320, 640]]) {
      for (const scale of [100, 125, 150]) for (const mode of ['real-vendors','one-long-vendor','vendor-on-some','no-vendor']) {
        await page.setViewportSize({ width: vw, height: vh });
        const css = `html{font-size:${scale}% !important}`;
        const row = { preset, themeId: id, viewport: vw, fontScale: scale, mode };
        // identity on first
        // --- collection fixtures: V01 + CN7
        const st = await nav(page, '/collections/fixtures', id); await page.addStyleTag({ content: css }); await sleep(400);
        row.collectionStatus = st;
        await page.evaluate(() => { try { localStorage.setItem('theme:grid-columns', '4'); } catch {} }); 
        const btn = page.locator('[data-grid-view="4"]').first(); if (await btn.count()) await btn.click({ force: true }).catch(() => {}); await sleep(300);
        if (mode !== 'no-vendor') await page.evaluate(({ vendors, mode }) => {
          document.querySelectorAll('.product-card').forEach((c, i) => {
            const h = c.querySelector('.product-card__title'); if (!h || c.querySelector('.product-card__vendor')) return; if (mode === 'vendor-on-some' && i % 2 === 1) return;
            const name = (h.textContent || '').trim(); let v = vendors[name] || 'Vendor';
            if (mode === 'one-long-vendor' && i % 3 === 0) v = 'Maison de Confection Artisanale Internationale & Fils Associes SA';
            const p = document.createElement('p'); p.className = 'product-card__vendor'; p.title = v; p.textContent = v; h.parentNode.insertBefore(p, h);
          });
        }, { vendors, mode });
        await sleep(300);
        row.identity = await page.evaluate(() => ({ id: window.Shopify?.theme?.id, role: window.Shopify?.theme?.role }));
        row.collection = await page.evaluate(() => {
          const cards = [...document.querySelectorAll('.product-card')];
          const de = document.documentElement;
          return {
            overflowX: de.scrollWidth - de.clientWidth, cols: (() => { const g = document.querySelector('.collection-products'); const gg = document.querySelector('.product-grid'); return gg ? getComputedStyle(gg).gridTemplateColumns.split(' ').length + ':' + gg.getAttribute('data-grid-columns') : null; })(),
            cards: cards.map((c) => {
              const t = c.querySelector('.product-card__title'), m = c.querySelector('.product-card__media'), v = c.querySelector('.product-card__vendor');
              const cr = c.getBoundingClientRect();
              const sw = [...c.querySelectorAll('.product-card__swatch-item,.product-card__swatch-group > *')];
              const group = c.querySelector('.product-card__swatch-group');
              const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
              return {
                title: (t?.textContent || '').trim().slice(0, 40), titleLen: (t?.textContent || '').trim().length,
                vendor: v ? v.textContent.trim().slice(0, 40) : null, vendorLen: v ? v.textContent.trim().length : 0,
                top: Math.round(cr.top + scrollY), left: Math.round(cr.left), width: Math.round(cr.width), right: Math.round(cr.right),
                titleOffset: t && m ? Math.round((t.getBoundingClientRect().top - m.getBoundingClientRect().bottom) * 10) / 10 : null,
                titleTopAbs: t ? Math.round((t.getBoundingClientRect().top + scrollY) * 10) / 10 : null,
                swatchVisible: group ? [...group.querySelectorAll('.card-swatch')].filter(vis).length : null,
                swatchTotal: group ? group.querySelectorAll('.card-swatch').length : null,
                swatchFit: group ? (group.getAttribute('data-swatch-fit') ?? group.getAttribute('data-swatch-fit-px')) : null,
                swatchFitAttr: group ? (group.hasAttribute('data-swatch-fit-px') ? 'px' : 'rem') : null,
                groupOverflow: group ? group.scrollWidth - group.clientWidth : null,
                cardOverflowRight: Math.round(cr.right - innerWidth),
              };
            }),
          };
        });
        // row misalignment: within same visual row (same top), spread of titleTopAbs
        const rows = {};
        for (const c of row.collection.cards) (rows[c.top] ||= []).push(c);
        row.collection.rowSpreads = Object.entries(rows).map(([top, cs]) => ({ top: +top, n: cs.length, titleTopSpread: Math.round((Math.max(...cs.map((c) => c.titleTopAbs)) - Math.min(...cs.map((c) => c.titleTopAbs))) * 10) / 10, vendors: cs.map((c) => c.vendorLen) }));
        row.collection.maxRowSpread = Math.max(0, ...row.collection.rowSpreads.map((r) => r.titleTopSpread));
        out.results.push(row);
        console.log(preset, vw, scale, row.mode, 'colOverflow', row.collection.overflowX, 'maxRowSpread', row.collection.maxRowSpread, 'cols', row.collection.cols);
      }
    }
    await ctx.close();
  }
} finally { await browser.close(); }
fs.writeFileSync('/home/user/Tema-Shopify/agent-comms/outbox-claude/tests-rc2-20261114/05b-lv05-collection-V01-CN7.json', JSON.stringify(out, null, 1));
