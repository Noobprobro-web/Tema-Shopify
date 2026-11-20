// 7. Cart drawer: quick add min quantity, discounted line price, rewards announcement, quantity focus (Enter/Tab). Cart only in test themes; cleanup in finally.
import { chromium, ctxFor, nav, save, sleep, pace, O, shot, THEMES, watch, themeConsole } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const preset = process.env.PRESET || 'sartorial';
const V = { cheap: 68445346005296, trench: 68442277413168, blazer: 68442277937456 };
const describe = () => { const a = document.activeElement; const line = a?.closest?.('[data-cart-item-key]'); return { tag: a?.tagName, id: a?.id || null, label: (a?.getAttribute?.('aria-label') || a?.textContent || '').trim().slice(0, 40), isClose: !!a?.matches?.('[data-cart-drawer-close]'), isBody: a === document.body, inDrawer: !!a?.closest?.('cart-drawer, [data-cart-drawer-panel]'), lineKey: line?.dataset.cartItemKey || null }; };
async function cleanup(ctx) {
  const res = { cleared: false, attempts: 0 };
  for (let i = 0; i < 5 && !res.cleared; i++) {
    res.attempts++;
    try {
      await pace(3000); const r = await ctx.request.post(`${O}/cart/clear.js`); res.clearStatus = r.status(); if (r.status() === 429) { await sleep(30000); continue; }
      await pace(3000); await ctx.request.post(`${O}/cart/update.js`, { data: { note: '' } });
      await pace(3000); const g = await ctx.request.get(`${O}/cart.js`); res.getStatus = g.status(); const t = await g.text();
      let j; try { j = JSON.parse(t); } catch { res.nonJson = t.slice(0, 60); await sleep(30000); continue; }
      res.itemCount = j.item_count; res.note = j.note; res.cleared = j.item_count === 0 && !j.note;
    } catch (e) { res.err = String(e).slice(0, 100); await sleep(15000); }
  }
  return res;
}
const cartJs = async (page) => page.evaluate(async () => { let j; for (let k = 0; k < 4; k++) { const r = await fetch('/cart.js'); try { j = await r.json(); break; } catch { await new Promise((x) => setTimeout(x, 8000)); } } return { count: j.item_count, total: j.total_price, items: j.items.map((i) => ({ v: i.variant_id, q: i.quantity, h: i.handle, orig: i.original_line_price, fin: i.final_line_price, disc: i.line_level_discount_allocations.map((d) => d.discount_application.title + ':' + d.amount), unit: i.unit_price, rule: i.quantity_rule })), cartDisc: j.cart_level_discount_applications.map((d) => d.title) }; });
for (const mode of (process.env.ONLY_REWARDS ? [] : ['desktop', 'mobile'])) {
  const ctx = await ctxFor(browser, mode); const page = await ctx.newPage(); const w = watch(page); const run = { preset, mode, steps: {} };
  try {
    await nav(page, '/collections/all', THEMES[preset], 1500);
    run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
    run.startCart = await cartJs(page); if (run.startCart.count) throw new Error('cart not empty at start');
    // --- quick add: cantidades de los formularios y regla minima
    run.quickAddForms = await page.evaluate(() => [...document.querySelectorAll('.product-card form[data-quick-buy-form] input[name=quantity]')].map((i) => ({ q: i.value, title: (i.closest('.product-card').querySelector('.product-card__title')?.textContent || '').trim().slice(0, 30) })));
    const qs = [...new Set(run.quickAddForms.map((f) => f.q))]; run.quickAddMinRuleProducts = run.quickAddForms.filter((f) => f.q !== '1');
    // clic real en el primer quick add de un solo clic
    const qb = page.locator('.product-card form[data-quick-buy-form] button[name=add]').first();
    await qb.scrollIntoViewIfNeeded(); const rp = page.waitForResponse((r) => /cart\/add/.test(r.url()), { timeout: 10000 }).catch(() => null); await qb.click(); const ra = await rp; await sleep(2000);
    run.steps.quickAdd = { status: ra?.status(), cart: await cartJs(page), drawerOpen: await page.evaluate(() => document.querySelector('cart-drawer')?.hasAttribute('data-open')), itemsInDrawer: await page.evaluate(() => document.querySelectorAll('[data-cart-item-key]').length) };
    await shot(page, `cart-${preset}-${mode}-quickadd`);
    // --- descuento: 3 uds de una linea para el automatico "Buy three, get 30 percent off"
    await page.evaluate(async () => { await fetch('/cart/clear.js', { method: 'POST' }); }); await sleep(800);
    await page.evaluate(async (v) => { await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id: v.cheap, quantity: 3 }] }) }); }, V);
    run.steps.discountTry3 = await cartJs(page);
    if (!run.steps.discountTry3.items.some((i) => i.disc.length) && !run.steps.discountTry3.cartDisc.length) {
      await page.evaluate(async (v) => { await fetch('/cart/clear.js', { method: 'POST' }); await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id: v.cheap, quantity: 1 }, { id: v.trench, quantity: 1 }, { id: v.blazer, quantity: 1 }] }) }); }, V);
      run.steps.discountTryMixed = await cartJs(page);
    }
    const dj = run.steps.discountTryMixed || run.steps.discountTry3; run.discountApplied = dj.items.some((i) => i.disc.length) || dj.cartDisc.length > 0;
    await nav(page, '/collections/all', THEMES[preset], 800);
    await page.locator('a[href$="/cart"]:visible').first().click(); await sleep(1800);
    run.steps.drawerLines = await page.evaluate(() => [...document.querySelectorAll('[data-cart-item-key]')].map((li) => ({ title: (li.querySelector('a')?.textContent || '').trim().slice(0, 30), price: (li.querySelector('.cart-drawer-item__price')?.textContent || '').trim().replace(/\s+/g, ' '), hasStrike: !!li.querySelector('.cart-drawer-item__price s'), discounts: [...li.querySelectorAll('.cart-item__discounts li')].map((x) => x.textContent.trim()), unit: (li.querySelector('.price__unit')?.textContent || '').trim() || null })));
    await shot(page, `cart-${preset}-${mode}-discount`);
    // --- foco tras teclear cantidad: Enter y Tab
    const input = (n) => page.locator('[data-cart-item-key]').nth(n).locator('[data-cart-quantity]');
    const waitChange = () => page.waitForResponse((x) => /cart\/(change|update)/.test(x.url()), { timeout: 10000 }).catch(() => null);
    await input(0).click(); await input(0).fill('4'); const w1 = waitChange(); await page.keyboard.press('Enter'); const r1 = await w1; await sleep(1800);
    run.steps.enter = { response: r1?.status() ?? null, focus: await page.evaluate(describe), qty: await input(0).inputValue() };
    await input(0).click(); await input(0).fill('2'); const w2 = waitChange(); await page.keyboard.press('Tab'); const r2 = await w2; await sleep(1800);
    run.steps.tab = { response: r2?.status() ?? null, focus: await page.evaluate(describe), qty: await input(0).inputValue() };
    run.steps.afterQty = await cartJs(page);
  } catch (e) { run.error = String(e).slice(0, 400); }
  finally { run.cleanup = await cleanup(ctx); }
  run.consoleTheme = themeConsole(w); out.runs.push(run); save('07-cart.json', out); await ctx.close();
}
// --- rewards: observer on [data-cart-status] (requires cart-drawer tiered progress enabled on the theme)
{
  const ctx = await ctxFor(browser, 'desktop'); const page = await ctx.newPage(); const run = { preset, mode: 'desktop', rewards: {} };
  try {
    await nav(page, '/collections/all', THEMES[preset], 1500);
    run.startCart = await cartJs(page); if (run.startCart.count) throw new Error('cart not empty at start');
    run.rewards.enabled = await page.evaluate(() => !!document.querySelector('[data-cart-rewards]'));
    if (run.rewards.enabled) {
      await page.evaluate(() => { window.__status = []; const el = document.querySelector('[data-cart-status]'); window.__mo = new MutationObserver(() => window.__status.push({ t: Math.round(performance.now()), text: el.textContent, hidden: el.hidden })); window.__mo.observe(el, { childList: true, characterData: true, subtree: true, attributes: true }); });
      const msg = () => page.evaluate(() => (document.querySelector('.cart-rewards__message')?.textContent || '').trim());
      run.rewards.messages = [await msg()];
      // anadir con el quick add hasta cruzar un umbral (50 y 100) o 6 intentos
      const forms = page.locator('.product-card form[data-quick-buy-form] button[name=add]'); const n = await forms.count();
      // elige la tarjeta mas barata
      const prices = await page.evaluate(() => [...document.querySelectorAll('.product-card')].map((c, i) => ({ i, form: !!c.querySelector('form[data-quick-buy-form] button[data-add-to-cart]'), price: parseFloat((c.querySelector('.price')?.textContent || '').replace(/[^0-9.,]/g, '').replace(',', '.')) || 1e9 })).filter((x) => x.form).sort((a, b) => a.price - b.price));
      run.rewards.cheapest = prices.slice(0, 2);
      const idx = prices[0]?.i;
      for (let k = 0; k < 6; k++) {
        const card = page.locator('.product-card').nth(idx); const b = card.locator('form[data-quick-buy-form] button[data-add-to-cart]').first();
        if (!(await b.count())) break;
        await b.scrollIntoViewIfNeeded().catch(() => {}); if (!(await page.evaluate(() => document.querySelector('cart-drawer')?.hasAttribute('data-open')))) { /* ok */ }
        const rp = page.waitForResponse((r) => /cart\/add/.test(r.url()), { timeout: 10000 }).catch(() => null); await b.click({ force: true }); await rp; await sleep(1800);
        // cerrar el cajon si se abrio para poder pulsar de nuevo
        await page.keyboard.press('Escape'); await sleep(500);
        const m = await msg(); run.rewards.messages.push(m);
        const c = await cartJs(page); run.rewards.lastTotal = c.total;
        if (run.rewards.messages.length > 2 && m !== run.rewards.messages[run.rewards.messages.length - 2] && run.rewards.messages.length >= 3) { /* keep going to cross 2nd threshold at most */ }
        if (c.total >= 10000) break;
      }
      run.rewards.statusEvents = await page.evaluate(() => window.__status);
      run.rewards.distinctMessages = [...new Set(run.rewards.messages)];
      run.rewards.announcedTexts = [...new Set(run.rewards.statusEvents.filter((e) => e.text).map((e) => e.text))];
      run.rewards.announcedChange = run.rewards.distinctMessages.length > 1 && run.rewards.distinctMessages.slice(1).every((m) => run.rewards.announcedTexts.some((t) => t.includes(m)));
      await shot(page, `cart-${preset}-rewards`);
    }
  } catch (e) { run.error = String(e).slice(0, 400); }
  finally { run.cleanup = await cleanup(ctx); }
  out.runs.push(run); await ctx.close();
}
await browser.close();
save(process.env.ONLY_REWARDS ? '07-cart-rewards.json' : '07-cart.json', out);
for (const r of out.runs) console.log(r.mode, r.error || '', JSON.stringify({ qaForms: r.quickAddForms && [...new Set(r.quickAddForms.map((f) => f.q))], minRule: r.quickAddMinRuleProducts?.length, qa: r.steps?.quickAdd && [r.steps.quickAdd.status, r.steps.quickAdd.cart.items.map((i) => i.q)], disc: r.discountApplied, lines: r.steps?.drawerLines, enter: r.steps?.enter && [r.steps.enter.focus.tag, r.steps.enter.focus.isClose, r.steps.enter.focus.isBody, r.steps.enter.qty], tab: r.steps?.tab && [r.steps.tab.focus.tag, r.steps.tab.focus.isBody, r.steps.tab.qty], rewards: r.rewards && { en: r.rewards.enabled, msgs: r.rewards.distinctMessages, ann: r.rewards.announcedTexts, ok: r.rewards.announcedChange }, cleanup: r.cleanup }));
