// 6. Purchase without JS with a sold-out variant selected via ?variant=.
import { chromium, ctxFor, newCtx, nav, save, sleep, pace, O, THEMES, shot, watch, themeConsole } from './common.mjs';
const SOLD = '68445343514928', OTHER = '68445343482160'; // Black / M (sold out, tracked 0) ; Black / S (untracked, available)
const out = { when: new Date().toISOString(), soldVariant: SOLD, otherVariant: OTHER, runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const URLP = `/products/fixture-many-variants?variant=${SOLD}`;
const probe = () => {
  const form = document.querySelector('form[action*="/cart/add"]'); const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !e.closest('[hidden]'); }; const allBtns = form ? [...form.querySelectorAll('button[type=submit], button[name=add]')].map((x) => ({ text: x.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), disabled: x.disabled, visible: vis(x) })) : []; const btn = form ? [...form.querySelectorAll('button[type=submit], button[name=add]')].find(vis) : null;
  const sels = form ? [...form.querySelectorAll('select')].map((s) => ({ name: s.name, id: s.id, value: s.value, disabled: s.disabled, options: [...s.options].map((o) => ({ v: o.value, t: o.textContent.trim().slice(0, 40), dis: o.disabled })) })) : [];
  const hid = form ? [...form.querySelectorAll('input[name=id]')].map((i) => ({ type: i.type, value: i.value, disabled: i.disabled })) : [];
  const radios = form ? [...form.querySelectorAll('input[type=radio]')].map((r) => ({ name: r.name, value: r.value, checked: r.checked, disabled: r.disabled })).slice(0, 12) : [];
  const links = [...document.querySelectorAll('[data-option-link], a[href*="variant="]')].length;
  return { allBtns, hasForm: !!form, btnDisabled: btn ? btn.disabled || btn.hasAttribute('disabled') || btn.getAttribute('aria-disabled') === 'true' : null, btnText: btn?.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) ?? null, btnAriaDisabled: btn?.getAttribute('aria-disabled') ?? null, selects: sels, hiddenIds: hid, radiosCount: radios.length, radios, variantLinks: links, soldBanner: (document.querySelector('[data-variant-status]')?.textContent || '').trim().slice(0, 80) };
};
try {
  for (const preset of which) {
    const run = { preset };
    // --- sin JS
    let ctx = await newCtx(browser, 390, 844, { javaScriptEnabled: false }); let page = await ctx.newPage();
    try {
      await pace(); await page.goto(`${O}${URLP}&preview_theme_id=${THEMES[preset]}`, { waitUntil: 'load' });
      const html = await page.content(); const m = html.match(/Shopify\.theme\s*=\s*\{[^}]*\}/); run.identity = m ? m[0].slice(0, 120) : null;
      if (!m || !m[0].includes(THEMES[preset]) || !/unpublished/.test(m[0])) throw new Error('PREVIEW_IDENTITY ' + run.identity);
      run.nojs = await page.evaluate(probe);
      await shot(page, `nojs-${preset}-soldout`);
      const nsel = run.nojs.selects.length;
      // elegir otra variante con el select nativo (si existe)
      if (nsel) { const sel = page.locator('form[action*="/cart/add"] select').first(); await sel.selectOption(OTHER).catch((e) => { run.selectErr = String(e).slice(0, 120); }); run.afterSelect = await page.evaluate(() => { const s = document.querySelector('form[action*="/cart/add"] select'); return { value: s?.value }; }); }
      run.nojsPass = { buttonEnabled: run.nojs.btnDisabled === false, hasNativeSelect: nsel > 0 && run.nojs.selects[0].options.some((o) => o.v === OTHER && !o.dis), canPickOther: run.afterSelect?.value === OTHER };
      // compra real sin JS solo en un preset (carrito limpio verificado)
      if (preset === 'sartorial' && run.nojsPass.buttonEnabled && run.nojsPass.canPickOther) {
        try {
          await pace(); await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), page.locator('form[action*="/cart/add"] [type=submit]').first().click()]);
          const cartUrl = page.url(); await pace(); const cj = await ctx.request.get(`${O}/cart.js`); const c = await cj.json();
          run.nojsPurchase = { urlAfter: cartUrl.replace(/\?.*/, ''), items: c.items.map((i) => ({ variant: i.variant_id, q: i.quantity })), added: c.items.some((i) => String(i.variant_id) === OTHER) };
        } finally {
          await pace(); const cl = await ctx.request.post(`${O}/cart/clear.js`); await pace(); const c2 = await (await ctx.request.get(`${O}/cart.js`)).json(); run.nojsPurchase = { ...(run.nojsPurchase || {}), cleanup: { status: cl.status(), itemCount: c2.item_count } };
        }
      }
    } catch (e) { run.errorNoJs = String(e).slice(0, 400); }
    await ctx.close();
    // --- con JS
    ctx = await ctxFor(browser, 'mobile'); page = await ctx.newPage(); const w = watch(page);
    try {
      await nav(page, URLP, THEMES[preset], 1500);
      run.js = await page.evaluate(probe); run.js.status = await page.evaluate(() => (document.querySelector('[data-variant-status]')?.textContent || '').trim().slice(0, 80));
      run.jsSoldOutDisabled = run.js.btnDisabled === true || /sold out/i.test(run.js.btnText || '');
      await shot(page, `js-${preset}-soldout`);
      // elegir una variante disponible con JS: el boton se habilita
      const radio = page.locator('input[type=radio][value="S"]').first();
      if (await radio.count()) { await page.locator(`label[for="${await radio.getAttribute('id')}"]`).first().click().catch(() => {}); await sleep(1500); run.jsAfterPick = await page.evaluate(probe); run.jsAfterPickEnabled = run.jsAfterPick.btnDisabled === false; }
    } catch (e) { run.errorJs = String(e).slice(0, 400); }
    run.consoleTheme = themeConsole(w);
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('06-nojs-soldout.json', out);
for (const r of out.runs) console.log(r.preset, r.errorNoJs || '', JSON.stringify({ nojs: r.nojs && { dis: r.nojs.btnDisabled, text: r.nojs.btnText, selects: r.nojs.selects.map((s) => s.name + ':' + s.value + ':' + s.options.length), hid: r.nojs.hiddenIds, radios: r.nojs.radiosCount, links: r.nojs.variantLinks }, pass: r.nojsPass, purchase: r.nojsPurchase, js: r.js && { dis: r.js.btnDisabled, text: r.js.btnText, status: r.js.status }, jsAfterPickEnabled: r.jsAfterPickEnabled }));
