import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { unlock, STORES } from '../../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs';

const out = 'agent-comms/outbox-gpt/harness-GPT-018/role-09-a11y';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
for (const [key, store] of Object.entries(STORES)) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' });
  await unlock(context, store.url);
  const page = await context.newPage();
  const result = { store: key, flows: [], pageErrors: [] };
  page.on('pageerror', e => result.pageErrors.push(String(e.message)));
  const product = key === 'archive' ? store.products[1] : store.products[0];
  const currentFocus = () => page.evaluate(() => {
    const e = document.activeElement, cs = getComputedStyle(e);
    return { tag: e.tagName, inputType: e.type || null, role: e.getAttribute('role') || e.tagName, name: (e.getAttribute('aria-label') || e.labels?.[0]?.innerText || e.innerText || e.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 100), checked: e.getAttribute('aria-checked') ?? e.checked ?? null, disabled: e.disabled || false, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, boxShadow: cs.boxShadow };
  });
  const capture = async (mode, stage, extra = {}) => {
    await page.screenshot({ path: path.join(out, `${key}-${mode}-${stage}.png`), fullPage: false });
    return { stage, url: page.url(), focus: await currentFocus(), ...extra };
  };
  const tabUntil = async (predicate, max = 100) => {
    for (let n = 1; n <= max; n++) {
      await page.keyboard.press('Tab');
      const f = await currentFocus();
      if (predicate(f)) return { focus: f, tabs: n };
    }
    return null;
  };
  const visibleCart = () => page.evaluate(() => {
    const text = document.body.innerText;
    return { dialogs: [...document.querySelectorAll('[role=dialog]')].filter(d => !!d.getClientRects().length).map(d => d.getAttribute('aria-label') || d.getAttribute('aria-labelledby')), quantityControls: [...document.querySelectorAll('button')].filter(b => /increase quantity/i.test(b.getAttribute('aria-label') || b.innerText)).map(b => ({ name: b.getAttribute('aria-label') || b.innerText.trim(), disabled: b.disabled, accessibleName: b.getAttribute('aria-label') })), textTail: text.slice(-1000) };
  });

  for (const mode of ['full', 'reduced']) {
    await page.emulateMedia({ reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
    await page.goto(`${store.url}/cart`, { waitUntil: 'domcontentloaded' });
    const oldCart = await visibleCart();
    if (!/cart is currently empty/i.test(oldCart.textTail)) {
      const oldRemove = await tabUntil(f => /remove/i.test(f.name), 80);
      if (oldRemove) {
        const clearPromise = page.waitForResponse(r => /\/cart\/change(?:\.js)?(?:\?|$)/.test(r.url()), { timeout: 10000 }).catch(e => ({ error: e.message }));
        await page.keyboard.press('Enter'); await clearPromise;
      }
    }
    await page.goto(`${store.url}/products/${product}`, { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    const radio = await tabUntil(f => f.role === 'radio' || (f.tag === 'INPUT' && f.inputType === 'radio'), 80);
    if (!radio) { result.flows.push({ mode, product, outcome: 'No product option radio reached by Tab within 80 steps.' }); continue; }
    const variantBefore = radio.focus;
    await page.keyboard.press('ArrowRight');
    const variantAfter = await currentFocus();
    const variant = await capture(mode, 'variant-focused', { variantBefore, variantAfter });

    const add = await tabUntil(f => /add to cart/i.test(f.name), 50);
    if (!add) { result.flows.push({ mode, product, variant, outcome: 'Add to cart not reached by Tab within 50 steps.' }); continue; }
    const addFocus = await capture(mode, 'add-focused', { addTabsFromOption: add.tabs });
    const addResponsePromise = page.waitForResponse(r => /\/cart\/add(?:\.js)?(?:\?|$)/.test(r.url()), { timeout: 15000 }).catch(e => ({ error: e.message }));
    await page.keyboard.press('Enter');
    const addResponse = await addResponsePromise;
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    const afterAdd = await capture(mode, 'after-add', { cart: await visibleCart(), addResponse: addResponse.status ? { status: addResponse.status(), url: addResponse.url() } : addResponse });
    const qty = await tabUntil(f => /increase quantity/i.test(f.name) && !f.disabled, 70);
    let qtyFocus = null, afterQty = null;
    let postQtyFocusTabs = qty?.tabs ?? 70;
    if (qty) {
      qtyFocus = await capture(mode, 'quantity-focused', { tabsAfterAdd: qty.tabs });
      const changePromise = page.waitForResponse(r => /\/cart\/change(?:\.js)?(?:\?|$)/.test(r.url()), { timeout: 10000 }).catch(e => ({ error: e.message }));
      await page.keyboard.press('Enter');
      const changeResponse = await changePromise;
      afterQty = await capture(mode, 'after-quantity', { cart: await visibleCart(), changeResponse: changeResponse.status ? { status: changeResponse.status(), url: changeResponse.url() } : changeResponse });
    }
    const remove = await tabUntil(f => /remove/i.test(f.name), 100);
    if (!remove) { result.flows.push({ mode, product, variant, addFocus, afterAdd, qtyFocus, afterQty, quantityOutcome: qty ? null : 'No enabled increase control reached by Tab.', outcome: 'Could not reach a remove control by Tab.' }); continue; }
    const removeFocus = await capture(mode, 'remove-focused', { tabsAfterQuantity: postQtyFocusTabs + remove.tabs });
    const removePromise = page.waitForResponse(r => /\/cart\/change(?:\.js)?(?:\?|$)/.test(r.url()), { timeout: 10000 }).catch(e => ({ error: e.message }));
    await page.keyboard.press('Enter');
    const removeResponse = await removePromise;
    const afterRemove = await capture(mode, 'after-remove', { cart: await visibleCart(), removeResponse: removeResponse.status ? { status: removeResponse.status(), url: removeResponse.url() } : removeResponse });
    result.flows.push({ mode, product, variant, addFocus, afterAdd, qtyFocus, afterQty, quantityOutcome: qty ? null : 'No enabled increase control reached by Tab.', removeFocus, afterRemove });
    if (!/cart is currently empty/i.test(afterRemove.cart.textTail)) {
      result.flows.at(-1).emptyCart = 'After remove, no explicit empty-cart text in visible text sample.';
    }
  }
  fs.writeFileSync(path.join(out, `${key}-pdp-cart-results.json`), JSON.stringify(result, null, 2));
  console.log(`${key}: ${result.flows.length} flow records`);
  await context.close();
}
await browser.close();
