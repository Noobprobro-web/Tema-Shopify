// B-03 (alta con respuesta perdida / tardia) y B-04 (nota: lento, sin red, en curso). Carrito SOLO en previews rc3; limpieza verificada en finally.
import { chromium, O, THEMES, newCtx, nav, save, sleep, pace, presets } from './common.mjs';
const out = { script: 'probe-b03-b04-cart.mjs', at: new Date().toISOString(), runs: [] };
const PDP = '/products/serra-coat';
const cartRead = async (ctx) => { for (let a = 0; a < 4; a++) { await pace(1500); const r = await ctx.request.get(`${O}/cart.js`); const t = await r.text(); if (r.status() === 429 || t.trim().startsWith('<')) { out.waits = (out.waits || 0) + 1; await sleep((Number(r.headers()['retry-after']) || 20 * (a + 1)) * 1000); continue; } const j = JSON.parse(t); return { status: r.status(), item_count: j.item_count, lines: j.items.map((i) => ({ variant_id: i.variant_id, quantity: i.quantity })), note: j.note ?? '' }; } throw new Error('cart.js no legible'); };
const cartClear = async (ctx) => { await pace(1500); const a = await ctx.request.post(`${O}/cart/clear.js`); await pace(1500); const b = await ctx.request.post(`${O}/cart/update.js`, { data: { note: '' } }); const rd = await cartRead(ctx); return { clearStatus: a.status(), updateStatus: b.status(), readStatus: rd.status, itemCount: rd.item_count, noteEmpty: rd.note === '', emptyVerified: rd.item_count === 0 && rd.note === '' }; };
const drawerState = (page) => page.evaluate(() => { const d = document.querySelector('cart-drawer'); const vis = (e) => !!e && !e.hidden && e.getClientRects().length > 0; const err = d?.querySelector('[data-cart-error]'); const st = d?.querySelector('[data-cart-status]'); const un = d?.querySelector('[data-cart-uncertain]'); const btn = document.querySelector('[data-add-to-cart]');
  return { drawerOpen: d?.hasAttribute('data-open') ?? null, lines: d ? d.querySelectorAll('[data-cart-item-key]').length : null, lineQty: d ? [...d.querySelectorAll('[data-cart-quantity]')].map((q) => q.value) : null, errorVisible: vis(err), errorText: vis(err) ? err.textContent.trim().slice(0, 140) : null, statusText: st && !st.hidden ? st.textContent.trim().slice(0, 100) : null, uncertainVisible: vis(un), addBtnDisabled: btn ? btn.disabled : null, addBtnBusy: btn ? btn.getAttribute('aria-busy') : null, url: location.pathname }; });
const addClick = async (page) => { await page.locator('[data-add-to-cart]').first().click({ timeout: 8000 }); };
const prep = async (ctx, page, preset) => { const c = await cartClear(ctx); if (!c.emptyVerified) throw new Error('cart not empty before scenario'); await nav(page, PDP, THEMES[preset], 900); };
process.on('uncaughtException', (e) => console.log('uncaught (ignorado)', String(e.message).slice(0, 80)));
const b = await chromium.launch();
try { for (const preset of presets) {
  const ctx = await newCtx(b, 390, 844, { reducedMotion: 'reduce' }); const page = await ctx.newPage(); const run = { preset, themeId: THEMES[preset], b03: {}, b04: {}, cleanup: null };
  try {
    const init = await cartRead(ctx); run.initialEmpty = init.item_count === 0; if (init.item_count !== 0) throw new Error('initial cart not empty');
    // ---- B-03
    if (!process.env.ONLY_B04) {
    const sc = async (name, handler, wait = 3500, recovery = false) => {
      await prep(ctx, page, preset); let hits = 0;
      await page.route('**/cart/add.js*', async (route) => { hits += 1; try { await handler(route, hits); } catch {} });
      await addClick(page); await sleep(wait);
      const ui = await drawerState(page); const server = await cartRead(ctx);
      const row = { addRequests: hits, ui, server };
      await page.unroute('**/cart/add.js*');
      if (recovery) { await page.reload({ waitUntil: 'load' }).catch(() => {}); await sleep(1200); await addClick(page).catch(() => {}); await sleep(3500); row.afterRecovery = { ui: await drawerState(page), server: await cartRead(ctx) }; }
      run.b03[name] = row; console.log(preset, 'B03', name, 'req', hits, 'srvQty', JSON.stringify(server.lines), 'ui.lines', ui.lines, 'uncertain', ui.uncertainVisible, 'err', ui.errorVisible, 'btnDisabled', ui.addBtnDisabled);
    };
    await sc('S1_abort_before_server', (route) => route.abort(), 3500, true);
    await sc('S2_applied_then_response_lost', async (route) => { await route.fetch(); await route.abort(); });
    await sc('S3_late_fulfill_after_deadline_applied', async (route) => { const r = await route.fetch(); await sleep(11500); await route.fulfill({ response: r }).catch(() => {}); }, 15500);
    await sc('S3b_late_abort_after_deadline_not_applied', async (route) => { await sleep(11500); await route.abort().catch(() => {}); }, 14500, true);
    // S4 necesita doble envio: se hace aparte
    { await prep(ctx, page, preset); let hits = 0; await page.route('**/cart/add.js*', async (route) => { hits += 1; await sleep(2500); await route.continue().catch(() => {}); });
      const btn = page.locator('[data-add-to-cart]').first(); await btn.click(); await btn.click({ force: true, timeout: 1500 }).catch(() => {}); await page.keyboard.press('Enter').catch(() => {}); await sleep(7000);
      const ui = await drawerState(page); const server = await cartRead(ctx); await page.unroute('**/cart/add.js*');
      run.b03.S4_double_submit_in_flight = { addRequests: hits, ui, server }; console.log(preset, 'B03 S4 req', hits, 'srv', JSON.stringify(server.lines)); }
    }
    // ---- B-04
    const noteScenario = async (name, noteRoute, extra) => {
      await prep(ctx, page, preset); await addClick(page); await page.waitForSelector('#CartDrawerNote', { state: 'visible', timeout: 10000 }); await sleep(600);
      let hits = 0; await page.route('**/cart/update.js*', async (route) => { hits += 1; try { await noteRoute(route, hits, page); } catch {} });
      const ta = page.locator('#CartDrawerNote'); await ta.fill('Nota B-04 uno'); await sleep(200);
      const urlBefore = page.url(); await page.locator('#CartDrawerViewCart').click({ timeout: 5000 }).catch(() => {});
      if (extra) await extra(page);
      await sleep(5500);
      const ui = await page.evaluate(() => { const ta = document.querySelector('#CartDrawerNote'); const err = document.querySelector('cart-drawer [data-cart-error]'); const st = document.querySelector('cart-drawer [data-cart-status]'); return { path: location.pathname, taPresent: !!ta, taValueLen: ta ? ta.value.length : null, taDirty: ta ? ta.dataset.dirty ?? null : null, errorText: err && !err.hidden ? err.textContent.trim().slice(0, 140) : null, statusText: st && !st.hidden ? st.textContent.trim().slice(0, 80) : null }; }).catch((e) => ({ evalError: String(e.message).slice(0, 80) }));
      await page.unroute('**/cart/update.js*').catch(() => {}); const server = await cartRead(ctx);
      run.b04[name] = { updateRequests: hits, navigatedAway: !!ui.path && ui.path !== new URL(urlBefore).pathname, ui, serverNoteLen: server.note.length, serverNoteEquals: server.note === 'Nota B-04 uno', serverLines: server.lines };
      console.log(preset, 'B04', name, 'req', hits, 'path', ui.path, 'err', !!ui.errorText, 'dirty', ui.taDirty, 'srvNote', server.note.length);
    };
    await noteScenario('N2_slow_over_deadline', async (route) => { await sleep(4500); await route.continue().catch(() => {}); });
    await noteScenario('N3_offline', (route) => route.abort());
    await noteScenario('N4_edit_while_in_flight', async (route) => { await sleep(1800); await route.continue().catch(() => {}); }, async (page) => { await sleep(300); await page.locator('#CartDrawerNote').press('End').catch(() => {}); await page.locator('#CartDrawerNote').type(' extra', { delay: 20 }).catch(() => {}); });
    await noteScenario('N1_fast_baseline', (route) => route.continue());
  } catch (e) { run.error = String(e.message).slice(0, 250); console.log(preset, 'ERROR', run.error); }
  finally { try { await page.unrouteAll({ behavior: 'ignoreErrors' }); } catch {} try { run.cleanup = await cartClear(ctx); } catch (e) { run.cleanup = { error: String(e.message).slice(0, 120) }; } await ctx.close(); run.contextClosed = true; console.log(preset, 'cleanup', JSON.stringify(run.cleanup)); }
  out.runs.push(run);
} } finally { await b.close(); save(process.env.ONLY_B04 ? '10-b04-notes-sartorial.json' : '09-b03-b04-cart.json', out); }
