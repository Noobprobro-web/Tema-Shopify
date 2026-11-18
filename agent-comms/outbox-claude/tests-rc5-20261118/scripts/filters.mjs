// Filtros de coleccion: plegado movil, panel escritorio, auto-envio, Apply con/sin JS, campo q de vendor.
import { chromium, newCtx, nav, save, sleep, pace, O, shot, THEMES, presets } from './common.mjs';
const browser = await chromium.launch(); const out = { when: new Date().toISOString(), runs: [], noJs: [] };
const MOB = { deviceScaleFactor: 2, hasTouch: true, isMobile: true };
const state = (page) => page.evaluate(() => { const d = document.querySelector('.facets__disclosure'); const s = d?.querySelector('summary'); const apply = document.querySelector('.facets__actions .button'); const vis = (e) => !!e && (() => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; })(); const form = document.querySelector('[data-facet-form]'); const panel = d; const cs = panel ? getComputedStyle(panel) : null; const aside = form ? getComputedStyle(form) : null; const first = document.querySelector('.product-card'); const fr = first?.getBoundingClientRect(); return { open: !!d?.open, summaryVisible: vis(s), summaryText: s?.textContent.trim().replace(/\s+/g, ' '), applyVisible: vis(apply), products: document.querySelectorAll('.product-card').length, firstCardTop: fr ? Math.round(fr.top) : null, firstCardBottom: fr ? Math.round(fr.bottom) : null, vh: innerHeight, url: location.pathname + location.search, marker: window.__m || null, qInput: document.querySelector('[data-facet-form] input[name=q]')?.value || null, active: document.querySelector('.facets__count')?.textContent.trim() || null, formPos: aside && aside.position, formOverflowY: aside && aside.overflowY, formMaxH: aside && aside.maxHeight, formH: form && Math.round(form.getBoundingClientRect().height), formScrollH: form && form.scrollHeight, formClientH: form && form.clientHeight, discOverflowY: cs && cs.overflowY, discMaxH: cs && cs.maxHeight, discScrollH: panel && panel.scrollHeight, discClientH: panel && panel.clientHeight }; });
const identity = (page) => page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
async function js(preset, mode, path, wantQ) {
  const ctx = await newCtx(browser, mode === 'mobile' ? 390 : 1280, mode === 'mobile' ? 844 : 800, mode === 'mobile' ? MOB : {}); const page = await ctx.newPage();
  const run = { preset, mode, path, steps: {} };
  const navs = []; page.on('framenavigated', (f) => { if (f === page.mainFrame()) navs.push(f.url()); });
  await nav(page, path, THEMES[preset], 800); await page.evaluate(() => { window.__m = 'same-document'; });
  run.steps.initial = await state(page); await shot(page, `filters-${preset}-${mode}-${wantQ ? 'vendor' : 'pc'}-initial`);
  const navBase = navs.length;
  if (mode === 'mobile') { await page.locator('.facets__disclosure-summary').tap(); await sleep(400); run.steps.afterOpen = await state(page); }
  // abrir grupo Availability y marcar la primera casilla habilitada
  const group = page.locator('details.facet').first(); if (!(await group.evaluate((e) => e.open))) { await group.locator('summary').click(); await sleep(300); }
  const cb = group.locator('input[type=checkbox]:not([disabled])').first(); const cbId = await cb.getAttribute('id');
  const respP = page.waitForResponse((r) => /section_id=/.test(r.url()), { timeout: 8000 }).catch(() => null);
  await cb.check({ force: true }); const resp = await respP; await sleep(1200);
  run.steps.afterCheck = await state(page); run.steps.afterCheck.ajax = resp ? resp.status() : null; run.steps.afterCheck.fullNavigations = navs.length - navBase; run.steps.afterCheck.focusId = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
  run.steps.afterCheck.checkedKept = await page.evaluate((id) => !!document.getElementById(id)?.checked, cbId);
  await shot(page, `filters-${preset}-${mode}-${wantQ ? 'vendor' : 'pc'}-checked`);
  // ordenar
  const sortOpt = await page.evaluate(() => [...document.querySelector('[data-facet-sort]').options].map((o) => o.value));
  const resp2P = page.waitForResponse((r) => /section_id=/.test(r.url()), { timeout: 8000 }).catch(() => null);
  await page.selectOption('[data-facet-sort]', sortOpt.find((v) => /price-ascending/.test(v)) || sortOpt[1]); await resp2P; await sleep(1000);
  run.steps.afterSort = await state(page); run.steps.afterSort.fullNavigations = navs.length - navBase; run.steps.afterSort.identity = await identity(page);
  out.runs.push(run); await ctx.close();
}
async function nojs(preset, vw, path) {
  const ctx = await newCtx(browser, vw, 800, { javaScriptEnabled: false }); const page = await ctx.newPage(); const r = { preset, vw, path };
  await pace(); const resp = await page.goto(`${O}${path}${path.includes('?') ? '&' : '?'}preview_theme_id=${THEMES[preset]}`, { waitUntil: 'load' });
  let html = await page.content(); const m = html.match(/Shopify\.theme\s*=\s*\{[^}]*\}/); r.identity = m ? m[0].slice(0, 120) : null; r.identityOk = !!m && m[0].includes(THEMES[preset]) && /unpublished/.test(m[0]);
  if (!r.identityOk) throw new Error('PREVIEW_IDENTITY nojs ' + r.identity);
  const vis = (sel) => page.locator(sel).first().isVisible();
  r.summaryVisible = await vis('.facets__disclosure-summary'); r.applyVisibleClosed = await vis('.facets__actions .button');
  if (vw < 900) { await page.locator('.facets__disclosure-summary').click(); await sleep(300); }
  const group = page.locator('details.facet').first(); await group.locator('summary').click().catch(() => {}); await sleep(200);
  r.applyVisible = await vis('.facets__actions .button'); r.applyText = (await page.locator('.facets__actions .button').first().textContent()).trim();
  await page.locator('details.facet').first().locator('input[type=checkbox]:not([disabled])').first().check({ force: true }); await sleep(300);
  await pace(); await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.locator('.facets__actions .button').first().click()]);
  r.urlAfterApply = page.url().replace(/preview_theme_id=\d+/, 'preview_theme_id=…'); r.hasFilterParam = /filter\./.test(page.url());
  html = await page.content(); const m2 = html.match(/Shopify\.theme\s*=\s*\{[^}]*\}/); r.identityAfter = m2 ? m2[0].slice(0, 120) : null; r.identityAfterOk = !!m2 && m2[0].includes(THEMES[preset]) && /unpublished/.test(m2[0]);
  r.productsAfter = await page.locator('.product-card').count();
  out.noJs.push(r); await ctx.close();
}
try {
  for (const preset of presets) { for (const mode of ['mobile', 'desktop']) { await js(preset, mode, '/collections/permanent-collection', false); await js(preset, mode, '/collections/vendors?q=Sartorial%20Theme', true); } }
  for (const preset of presets) { await nojs(preset, 390, '/collections/permanent-collection'); await nojs(preset, 1280, '/collections/permanent-collection'); }
  await nojs('sartorial', 390, '/collections/vendors?q=Sartorial%20Theme');
} catch (e) { out.error = String(e).slice(0, 600); console.log(out.error); } finally { await browser.close(); }
save('24-filters.json', out);
for (const r of out.runs) { const s = r.steps; console.log(r.preset, r.mode, r.path.slice(-12), 'init open', s.initial.open, 'sum', s.initial.summaryVisible, s.initial.summaryText, 'apply', s.initial.applyVisible, 'cardTop', s.initial.firstCardTop, '/', s.initial.vh, '| afterCheck open', s.afterCheck.open, 'nav', s.afterCheck.fullNavigations, 'ajax', s.afterCheck.ajax, 'marker', s.afterCheck.marker, 'prod', s.initial.products + '>' + s.afterCheck.products, 'q', s.afterCheck.qInput, s.afterSort.qInput, 'url', s.afterSort.url.slice(0, 120)); }
for (const r of out.noJs) console.log('nojs', JSON.stringify(r));
