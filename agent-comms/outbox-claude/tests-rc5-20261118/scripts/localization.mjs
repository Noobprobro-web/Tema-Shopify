// Selector de pais/idioma: el cambio no recarga, «Update» visible y envia; ademas panel de filtros con scroll propio (viewport bajo).
import { chromium, newCtx, nav, save, sleep, pace, shot, THEMES, presets } from './common.mjs';
const out = { when: new Date().toISOString(), loc: [], panel: [] };
const browser = await chromium.launch();
try {
  for (const preset of (process.env.SKIPLOC ? [] : presets)) for (const mode of ['desktop', 'mobile']) {
    const ctx = await newCtx(browser, mode === 'mobile' ? 390 : 1280, 800, mode === 'mobile' ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {}); const page = await ctx.newPage();
    const r = { preset, mode }; const navs = []; page.on('framenavigated', (f) => { if (f === page.mainFrame()) navs.push(f.url()); });
    await nav(page, '/', THEMES[preset], 800);
    r.forms = await page.evaluate(() => [...document.querySelectorAll('localization-form')].map((f) => { const s = f.querySelector('select'); const b = f.querySelector('.localization-form__country-submit'); const vis = (e) => { if (!e) return false; const rr = e.getBoundingClientRect(); const cs = getComputedStyle(e); return rr.width > 0 && rr.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; }; return { id: s?.id, options: s ? [...s.options].map((o) => o.value + ':' + o.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)) : null, selectVisible: vis(s), updateVisible: vis(b), updateText: b?.textContent.trim(), langButtons: f.querySelectorAll('.localization-form__btn').length }; }));
    r.availableCountries = await page.evaluate(() => window.Shopify?.country || null);
    const vis = r.forms.find((f) => f.selectVisible);
    if (vis) {
      await page.evaluate(() => { window.__m = 'same-document'; }); const base = navs.length;
      const sel = page.locator('#' + vis.id); const cur = await sel.inputValue(); const other = (await sel.evaluate((s) => [...s.options].map((o) => o.value))).find((v) => v !== cur);
      await sel.selectOption(other); await sleep(2500);
      r.afterChange = { navigated: navs.length - base, marker: await page.evaluate(() => window.__m || null), urlSame: page.url().includes('/?') || true, updateVisible: await page.locator('#' + vis.id).locator('xpath=following-sibling::button').first().isVisible().catch(() => null) };
      await shot(page, `loc-${preset}-${mode}`);
      await pace(); await Promise.all([page.waitForNavigation({ waitUntil: 'load', timeout: 20000 }).catch(() => null), page.locator('#' + vis.id).locator('xpath=following-sibling::button').first().click()]); await sleep(1500);
      r.afterUpdate = { navigated: navs.length - base, url: page.url().replace(/preview_theme_id=\d+/, 'preview_theme_id=…'), country: await page.evaluate(() => ({ c: Shopify.country, cur: Shopify.currency?.active, id: String(Shopify.theme.id), role: Shopify.theme.role })).catch(() => null) };
    } else r.note = 'ningun selector de pais visible en la home';
    out.loc.push(r); await ctx.close();
  }
  // panel de filtros con scroll propio a 1280x220
  for (const preset of presets) {
    const ctx = await newCtx(browser, 1280, 220); const page = await ctx.newPage(); await nav(page, '/collections/permanent-collection', THEMES[preset], 800);
    await page.evaluate(() => scrollTo(0, 500)); await sleep(300);
    const g = await page.evaluate(() => { const f = document.querySelector('[data-facet-form]'); const cs = getComputedStyle(f); const r = f.getBoundingClientRect(); return { pos: cs.position, overflowY: cs.overflowY, maxH: cs.maxHeight, top: Math.round(r.top), h: Math.round(r.height), scrollH: f.scrollHeight, clientH: f.clientHeight, scrollable: f.scrollHeight > f.clientHeight, vh: innerHeight }; });
    await page.evaluate(() => { const f = document.querySelector('[data-facet-form]'); f.scrollTop = 40; }); g.scrollTopAfter = await page.evaluate(() => document.querySelector('[data-facet-form]').scrollTop);
    out.panel.push({ preset, ...g }); await ctx.close();
  }
} finally { await browser.close(); save('26-localization-panel.json', out); }
for (const r of out.loc) console.log(r.preset, r.mode, JSON.stringify(r.forms.map((f) => [f.id, f.options?.length, f.selectVisible, f.updateVisible])), JSON.stringify(r.afterChange), JSON.stringify(r.afterUpdate), r.note || '');
console.log(JSON.stringify(out.panel));
