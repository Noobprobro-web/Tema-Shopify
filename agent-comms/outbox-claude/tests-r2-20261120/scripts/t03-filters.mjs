// 3. Collection filters with keyboard: price debounce (one request), focus kept, last value uncheck, manual fold, skip link + Back.
import { chromium, ctxFor, nav, save, sleep, shot, watch, THEMES, themeConsole, pace, O } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive').split(',');
const PATH = '/collections/permanent-collection';
const sect = (u) => /section_id=/.test(u);
try {
  for (const preset of which) {
    const ctx = await ctxFor(browser, 'desktop'); const page = await ctx.newPage(); const w = watch(page); const run = { preset, path: PATH, steps: {} };
    try {
      await nav(page, PATH, THEMES[preset], 1200);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      const facetNames = await page.evaluate(() => [...document.querySelectorAll('details.facet')].map((d) => ({ name: d.querySelector('summary')?.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), open: d.open, inputs: [...d.querySelectorAll('input')].map((i) => i.name + ':' + i.type).slice(0, 4) })));
      run.facets = facetNames;
      // ---- precio: 50, Tab, 200
      const priceGroup = page.locator('details.facet', { has: page.locator('input[type=number]') }).first();
      if (!(await priceGroup.evaluate((e) => e.open))) { await priceGroup.locator('summary').click(); await sleep(300); }
      const gte = priceGroup.locator('input[type=number]').first(); const lte = priceGroup.locator('input[type=number]').nth(1);
      const reqs = []; const onReq = (r) => { if (/filter\.v\.price/.test(r.url()) || sect(r.url())) reqs.push(r.url().replace(/^.*?\/collections/, '/collections').replace(/preview_theme_id=\d+&?/, '').slice(0, 160)); }; page.on('request', onReq);
      await gte.click(); await page.keyboard.type('50', { delay: 80 }); await page.keyboard.press('Tab'); await sleep(150);
      const focusAfterTab = await page.evaluate(() => document.activeElement?.name || document.activeElement?.tagName);
      await page.keyboard.type('200', { delay: 80 }); await sleep(2500);
      page.off('request', onReq);
      run.steps.price = { requests: reqs, count: reqs.length, bothParamsCount: reqs.filter((u) => /gte=50/.test(u) && /lte=200/.test(u)).length, onlyGte50: reqs.filter((u) => /gte=50/.test(u) && !/lte=/.test(u)).length, focusAfterTab,
        value: await lte.inputValue().catch(() => null), gteValue: await page.locator('input[name="filter.v.price.gte"]').first().inputValue().catch(() => null),
        activeName: await page.evaluate(() => document.activeElement?.name || document.activeElement?.tagName), activeValue: await page.evaluate(() => document.activeElement?.value), url: page.url().replace(/preview_theme_id=\d+&?/, '').slice(0, 200) };
      run.steps.price.pass = run.steps.price.count === 1 && run.steps.price.bothParamsCount === 1 && run.steps.price.value === '200' && run.steps.price.activeName === 'filter.v.price.lte';
      await shot(page, `filters-${preset}-price`);
      // ---- plegado manual con filtro activo (precio activo): plegar Availability y repintar
      const groups = page.locator('details.facet'); const nG = await groups.count();
      let availIdx = -1; for (let i = 0; i < nG; i++) { if (await groups.nth(i).locator('input[type=checkbox]').count()) { availIdx = i; break; } }
      const avail = groups.nth(availIdx);
      if (!(await avail.evaluate((e) => e.open))) { await avail.locator('summary').click(); await sleep(300); }
      // plegar a mano el grupo de precio (filtro activo) y marcar disponibilidad para provocar repintado
      const priceSum = priceGroup.locator('summary'); await priceSum.click(); await sleep(300);
      const foldedBefore = !(await page.locator('details.facet', { has: page.locator('input[type=number]') }).first().evaluate((e) => e.open));
      const cb = page.locator('details.facet').nth(availIdx).locator('input[type=checkbox]:not([disabled])').first(); const cbId = await cb.getAttribute('id');
      const rP = page.waitForResponse((r) => sect(r.url()), { timeout: 8000 }).catch(() => null);
      await cb.check({ force: true }); await rP; await sleep(1500);
      run.steps.foldManual = { foldedBeforeRepaint: foldedBefore, priceOpenAfterRepaint: await page.locator('details.facet', { has: page.locator('input[type=number]') }).first().evaluate((e) => e.open), pass: null };
      run.steps.foldManual.pass = foldedBefore && !run.steps.foldManual.priceOpenAfterRepaint;
      // ---- desmarcar el ultimo valor activo del grupo Availability (checkbox): grupo abierto y foco en la casilla
      const cb2 = page.locator('#' + cbId); const wasChecked = await cb2.isChecked().catch(() => null);
      const availOpenBefore = await page.locator('details.facet').nth(availIdx).evaluate((e) => e.open);
      const rP2 = page.waitForResponse((r) => sect(r.url()), { timeout: 8000 }).catch(() => null);
      await cb2.focus(); await page.keyboard.press('Space'); await rP2; await sleep(1500);
      run.steps.uncheckLast = await page.evaluate(({ id, idx }) => { const g = document.querySelectorAll('details.facet')[idx]; const el = document.getElementById(id); return { groupOpen: !!g?.open, focusId: document.activeElement?.id, focusOnCheckbox: document.activeElement === el, checked: el?.checked, tag: document.activeElement?.tagName }; }, { id: cbId, idx: availIdx });
      run.steps.uncheckLast.wasChecked = wasChecked; run.steps.uncheckLast.groupOpenBefore = availOpenBefore;
      run.steps.uncheckLast.pass = run.steps.uncheckLast.groupOpen && run.steps.uncheckLast.focusOnCheckbox;
      run.steps.uncheckLast.url = page.url().replace(/preview_theme_id=\d+&?/, '').slice(0, 160);
      // ---- desmarcar el ultimo valor de OTRO grupo: precio (limpiar los dos campos)
      // ---- skip link + Atras
      await nav(page, PATH, THEMES[preset], 800);
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
      await page.keyboard.press('Tab'); await sleep(200);
      const skip = await page.evaluate(() => { const e = document.activeElement; return { tag: e.tagName, href: e.getAttribute('href'), text: (e.textContent || '').trim().slice(0, 30) }; });
      const urlBefore = page.url(); const reqs2 = []; const on2 = (r) => reqs2.push({ u: r.url().slice(0, 120), t: r.resourceType() }); page.on('request', on2);
      await page.keyboard.press('Enter'); await sleep(800);
      const urlAfter = page.url(); const hashChanged = urlAfter !== urlBefore;
      const reqsAfterSkip = reqs2.length;
      await page.goBack({ waitUntil: 'commit' }).catch(() => {}); await sleep(2500);
      page.off('request', on2);
      run.steps.skipBack = { skip, hashChanged, urlAfterSkip: urlAfter.replace(/preview_theme_id=\d+&?/, '').slice(-60), requestsDuringSkip: reqsAfterSkip, requestsAfterBack: reqs2.slice(reqsAfterSkip), urlAfterBack: page.url().replace(/preview_theme_id=\d+&?/, '').slice(-80), pass: reqs2.length - reqsAfterSkip === 0 };
    } catch (e) { run.error = String(e).slice(0, 500); }
    run.consoleTheme = themeConsole(w);
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('03-filters.json', out);
for (const r of out.runs) console.log(r.preset, r.error || JSON.stringify({ price: r.steps.price && { n: r.steps.price.count, both: r.steps.price.bothParamsCount, v: r.steps.price.value, act: r.steps.price.activeName, pass: r.steps.price.pass }, fold: r.steps.foldManual, unch: r.steps.uncheckLast, skip: r.steps.skipBack && { n: r.steps.skipBack.requestsAfterBack.length, hash: r.steps.skipBack.hashChanged, pass: r.steps.skipBack.pass } }));
