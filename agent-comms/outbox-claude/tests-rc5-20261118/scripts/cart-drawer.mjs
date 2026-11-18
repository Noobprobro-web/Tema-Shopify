// Cajon del carrito: foco tras editar cantidad (Enter / Tab), +/-, precio tachado. Carrito solo en temas rc5; limpieza verificada en finally.
import { chromium, newCtx, nav, save, sleep, pace, O, shot, THEMES } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const MOB = { deviceScaleFactor: 2, hasTouch: true, isMobile: true };
const describe = () => { const a = document.activeElement; const line = a?.closest?.('[data-cart-item-key]'); return { tag: a?.tagName, id: a?.id || null, name: a?.getAttribute?.('name'), label: (a?.getAttribute?.('aria-label') || a?.textContent || '').trim().slice(0, 50), isClose: !!a?.matches?.('[data-cart-drawer-close]'), isBody: a === document.body, inDrawer: !!a?.closest?.('cart-drawer, [data-cart-drawer-panel]'), lineKey: line?.dataset.cartItemKey || null, lineIndex: line ? [...document.querySelectorAll('[data-cart-item-key]')].indexOf(line) : null }; };
async function cleanup(ctx) {
  const res = { cleared: false };
  for (let i = 0; i < 3 && !res.cleared; i++) { await pace(); const r = await ctx.request.post(`${O}/cart/clear.js`); res.clearStatus = r.status(); if (r.status() === 429) { await sleep(20000); continue; } await pace(); const u = await ctx.request.post(`${O}/cart/update.js`, { data: { note: '' } }); res.noteStatus = u.status(); await pace(); const c = await ctx.request.get(`${O}/cart.js`); const j = await c.json(); res.itemCount = j.item_count; res.note = j.note; res.cleared = j.item_count === 0 && !j.note; }
  return res;
}
async function run(preset, mode) {
  const ctx = await newCtx(browser, mode === 'mobile' ? 390 : 1280, mode === 'mobile' ? 844 : 800, mode === 'mobile' ? MOB : {}); const page = await ctx.newPage();
  const r = { preset, mode, steps: {} };
  try {
    await nav(page, '/', THEMES[preset], 600);
    r.add = await page.evaluate(async () => { const res = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: [{ id: 68442277413168, quantity: 2 }, { id: 68442277937456, quantity: 1 }] }) }); const j = await res.json(); return { status: res.status, lines: (j.items || []).map((i) => [i.handle, i.quantity, i.original_line_price, i.final_line_price]) }; });
    await nav(page, '/', THEMES[preset], 800);
    const link = page.locator('a[href$="/cart"]:visible').first(); await link.click(); await sleep(1500);
    r.steps.open = await page.evaluate(() => ({ open: document.querySelector('cart-drawer')?.hasAttribute('data-open'), items: document.querySelectorAll('[data-cart-item-key]').length, focus: (() => { const a = document.activeElement; return { tag: a.tagName, close: a.matches('[data-cart-drawer-close]') }; })() }));
    await shot(page, `cart-${preset}-${mode}-open`);
    const input = (n) => page.locator('[data-cart-item-key]').nth(n).locator('[data-cart-quantity]');
    const waitChange = () => page.waitForResponse((x) => /cart\/(change|update)/.test(x.url()), { timeout: 10000 }).catch(() => null);
    // Enter
    await input(0).click(); await input(0).fill('3'); const w1 = waitChange(); await page.keyboard.press('Enter'); const resp1 = await w1; await sleep(1800);
    r.steps.enter = { response: resp1 ? resp1.status() : null, focus: await page.evaluate(describe), qty: await input(0).inputValue() };
    // Tab
    await input(0).click(); await input(0).fill('2'); const w2 = waitChange(); await page.keyboard.press('Tab'); const resp2 = await w2; await sleep(1800);
    r.steps.tab = { response: resp2 ? resp2.status() : null, focus: await page.evaluate(describe), qty: await input(0).inputValue() };
    // +/-
    const plus = page.locator('[data-cart-item-key]').nth(0).locator('[data-quantity-button="increase"]'); const w3 = waitChange(); await plus.click(); await w3; await sleep(1800);
    r.steps.plus = { focus: await page.evaluate(describe), qty: await input(0).inputValue() };
    const minus = page.locator('[data-cart-item-key]').nth(0).locator('[data-quantity-button="decrease"]'); const w4 = waitChange(); await minus.click(); await w4; await sleep(1800);
    r.steps.minus = { focus: await page.evaluate(describe), qty: await input(0).inputValue() };
    // precio tachado / etiquetas ocultas
    r.steps.price = await page.evaluate(() => [...document.querySelectorAll('[data-cart-item-key]')].map((li) => { const p = li.querySelector('.cart-drawer-item__price'); const s = p?.querySelector('s, del, .price__compare'); return { title: li.querySelector('a')?.textContent.trim().slice(0, 30), priceHtml: p?.innerHTML.replace(/\s+/g, ' ').slice(0, 600), hasStrike: !!s, strikeDecoration: s ? getComputedStyle(s).textDecorationLine : null, hiddenLabels: [...(p?.querySelectorAll('.visually-hidden') || [])].map((e) => e.textContent.trim()) }; }));
    await shot(page, `cart-${preset}-${mode}-after`);
  } catch (e) { r.error = String(e).slice(0, 400); }
  finally { r.finalCartCleanup = await cleanup(ctx).catch((e) => ({ error: String(e).slice(0, 200) })); await ctx.close(); }
  out.runs.push(r);
}
try { await run('sartorial', 'desktop'); await run('imprint', 'desktop'); await run('archive', 'desktop'); await run('sartorial', 'mobile'); }
finally { await browser.close(); save('25-cart-drawer.json', out); }
for (const r of out.runs) console.log(r.preset, r.mode, r.error || '', 'open', r.steps.open?.open, 'enter', JSON.stringify(r.steps.enter?.focus), r.steps.enter?.qty, '| tab', JSON.stringify(r.steps.tab?.focus), r.steps.tab?.qty, '| plus', r.steps.plus?.focus?.id, '| minus', r.steps.minus?.focus?.id, '| strike', r.steps.price?.map((p) => p.hasStrike + ':' + p.hiddenLabels.join('/')), '| clean', JSON.stringify(r.finalCartCleanup));
