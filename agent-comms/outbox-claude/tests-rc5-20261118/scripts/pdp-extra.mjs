// Ficha movil 390: bloques de confianza/entrega ausentes sin contenido, 'From' sin tachado, bajo stock (HTML del snippet), errores de consola.
import { chromium, newCtx, nav, save, sleep, watch, overflowX, shot, THEMES, presets } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [], fromScan: [] };
const browser = await chromium.launch();
const platform = (c) => /ERR_TUNNEL_CONNECTION_FAILED|shopifysvc|shop\.app|preview-bar|bugsnag|postMessage|shopify-xr\.js|Refused to execute script|monorail|api\/collect|Failed to fetch/.test((c.text || '') + (c.url || ''));
try {
  for (const preset of presets) {
    const ctx = await newCtx(browser, 390, 844, { deviceScaleFactor: 2, hasTouch: true, isMobile: true }); const page = await ctx.newPage(); const w = watch(page);
    if (preset === presets[0]) { // buscar tarjetas con 'From' en la coleccion completa
      await nav(page, '/collections/all', THEMES[preset], 800);
      out.fromScan = await page.evaluate(() => [...document.querySelectorAll('.product-card')].map((c) => { const p = c.querySelector('.price'); return { title: c.querySelector('.product-card__title')?.textContent.trim().slice(0, 30), href: c.querySelector('a[href*="/products/"]')?.getAttribute('href'), price: p ? p.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : null, from: /from/i.test(p?.textContent || ''), strike: !!p?.querySelector('s, del, .price__compare:not([hidden])') }; }));
    }
    for (const slug of ['serra-coat', 'fixture-media-3d-video', 'fixture-many-variants']) {
      const r = { preset, slug };
      try {
        await nav(page, `/products/${slug}`, THEMES[preset], 900);
        r.blocks = await page.evaluate(() => ({ trust: document.querySelectorAll('.product-trust, [class*="trust"]').length, trustText: [...document.querySelectorAll('.product-trust, [class*="product-trust"]')].map((e) => e.textContent.trim().slice(0, 40)), delivery: document.querySelectorAll('[class*="lead-time"], [class*="delivery"]').length, deliveryText: [...document.querySelectorAll('[class*="lead-time"], [class*="delivery"]')].map((e) => e.textContent.trim().slice(0, 40)), editorNotice: !!document.querySelector('[class*="editor-notice"], [class*="editor"]:not(script)'), designMode: !!window.Shopify?.designMode }));
        r.price = await page.evaluate(() => { const p = document.querySelector('.product-info .price, main .price'); return { text: p?.textContent.replace(/\s+/g, ' ').trim().slice(0, 80), strikeVisible: !!p && [...p.querySelectorAll('s, del, .price__compare')].some((e) => { const rr = e.getBoundingClientRect(); return rr.width > 0 && getComputedStyle(e).display !== 'none' && !e.hidden; }) }; });
        r.inventory = await page.evaluate(() => { const i = document.querySelector('product-inventory'); return i ? { state: i.dataset.stockState, msg: i.querySelector('[data-inventory-message]')?.textContent.trim(), one: i.dataset.lowStockTemplateOne, tpl: i.dataset.lowStockTemplate, generic: i.dataset.lowStockGeneric } : null; });
        r.overflow = (await overflowX(page)).overflow;
      } catch (e) { r.error = String(e).slice(0, 300); }
      out.runs.push(r);
    }
    // plantilla con umbral 10: el texto de bajo stock se pinta y cambia con la variante
    try { await nav(page, '/products/serra-coat?view=lowstock', THEMES[preset], 900); out.runs.push({ preset, slug: 'serra-coat?view=lowstock', inventory: await page.evaluate(() => { const i = document.querySelector('product-inventory'); return i ? { state: i.dataset.stockState, msg: i.querySelector('[data-inventory-message]')?.textContent.trim(), one: i.dataset.lowStockTemplateOne, tpl: i.dataset.lowStockTemplate } : null; }) }); } catch (e) { out.runs.push({ preset, slug: 'lowstock', error: String(e).slice(0, 200) }); }
    out.runs.push({ preset, consoleTheme: [...w.console.filter((c) => c.type === 'error' && !platform(c))], pageerrorsTheme: w.pageerrors.filter((e) => !platform({ text: e })), platformCount: w.console.filter(platform).length });
    await ctx.close();
  }
} finally { await browser.close(); save('27-pdp-extra.json', out); }
console.log('from', JSON.stringify(out.fromScan.filter((c) => c.from || c.strike).map((c) => [c.title, c.price, c.strike])));
for (const r of out.runs) console.log(JSON.stringify(r).slice(0, 420));
