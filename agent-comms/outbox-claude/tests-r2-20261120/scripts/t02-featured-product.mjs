// 2. Featured product media strip: mobile swipe/keyboard, all media reachable, no display:none; desktop unchanged.
import { chromium, ctxFor, nav, save, sleep, shot, watch, THEMES, themeConsole } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const SEC = { media: '[id$="__fp_media"]', serra: '[id$="__fp_serra"]' };
const geom = (secSel) => () => {};
try {
  for (const preset of which) for (const mode of ['mobile', 'desktop']) {
    const ctx = await ctxFor(browser, mode); const page = await ctx.newPage(); const w = watch(page); const run = { preset, mode, products: {} };
    try {
      await nav(page, '/pages/std-test', THEMES[preset], 1500);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      for (const [key, sel] of Object.entries(SEC)) {
        const r = { };
        await page.locator(sel).first().scrollIntoViewIfNeeded(); await sleep(500);
        r.info = await page.evaluate((s) => {
          const root = document.querySelector(s); const g = root.querySelector('.featured-product__gallery'); const items = [...g.querySelectorAll('.featured-product__media')];
          const gr = g.getBoundingClientRect(); const cs = getComputedStyle(g);
          return { display: cs.display, overflowX: cs.overflowX, snap: cs.scrollSnapType, tabindex: g.getAttribute('tabindex'), role: g.getAttribute('role'), label: g.getAttribute('aria-label'), clientWidth: g.clientWidth, scrollWidth: g.scrollWidth, scrollable: g.scrollWidth > g.clientWidth, gw: Math.round(gr.width), n: items.length,
            items: items.map((m) => { const c = getComputedStyle(m); const r2 = m.getBoundingClientRect(); const kind = m.querySelector('model-viewer') ? '3d' : m.querySelector('video, theme-video, [data-video]') ? 'video' : m.querySelector('img') ? 'image' : 'other'; return { id: m.dataset.productMediaId, kind, display: c.display, visibility: c.visibility, order: c.order, selected: m.hasAttribute('data-selected'), left: Math.round(r2.left), w: Math.round(r2.width), label: m.getAttribute('aria-label') }; }), docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
        }, sel);
        r.noDisplayNone = r.info.items.every((i) => i.display !== 'none' && i.visibility !== 'hidden');
        if (mode === 'mobile') {
          r.initialScroll = await page.evaluate((s) => document.querySelector(s + ' .featured-product__gallery').scrollLeft, sel);
          // swipe tactil real (CDP) hasta alcanzar cada elemento
          const cdp = await ctx.newCDPSession(page);
          const reached = new Set(); const log = [];
          const box = await page.locator(sel + ' .featured-product__gallery').boundingBox();
          const snapshot = async () => page.evaluate((s) => { const g = document.querySelector(s + ' .featured-product__gallery'); const gr = g.getBoundingClientRect(); return { sl: Math.round(g.scrollLeft), vis: [...g.querySelectorAll('.featured-product__media')].map((m, i) => { const r2 = m.getBoundingClientRect(); const ov = Math.min(r2.right, gr.right) - Math.max(r2.left, gr.left); return { i, ov: Math.round(ov), w: Math.round(r2.width) }; }) }; }, sel);
          let s0 = await snapshot(); s0.vis.forEach((v) => { if (v.ov > v.w * 0.5) reached.add(v.i); });
          const swipe = async (x0, y0, dx) => { const pts = 8; await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] }); for (let i = 1; i <= pts; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: Math.round(x0 + (dx * i) / pts), y: y0 }] }); await sleep(16); } await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
          for (let k = 0; k < 6; k++) {
            // start on the sliver of the next item (right edge of the strip) so a 3D viewer cannot capture the gesture
            const startX = Math.round(box.x + box.width - 12); const startY = Math.round(box.y + 40);
            await swipe(startX, startY, -Math.round(box.width * 0.55));
            await sleep(900); const s = await snapshot(); log.push(s.sl); s.vis.forEach((v) => { if (v.ov > v.w * 0.5) reached.add(v.i); });
          }
          r.swipe = { scrollLefts: log, reachedIdx: [...reached], allReached: reached.size === r.info.n, maxScroll: r.info.scrollWidth - r.info.clientWidth };
          await shot(page, `fp-${preset}-${key}-mobile-swiped`);
          // teclado: foco en la region, flechas
          await page.evaluate((s) => { const g = document.querySelector(s + ' .featured-product__gallery'); g.scrollLeft = 0; }, sel); await sleep(500);
          await page.locator(sel + ' .featured-product__gallery').focus(); await page.keyboard.press('ArrowRight'); await sleep(600); const kbReached = new Set([0]);
          const a = await page.evaluate((s) => document.querySelector(s + ' .featured-product__gallery').scrollLeft, sel);
          for (let k = 0; k < 8; k++) { await page.keyboard.press('ArrowRight'); await sleep(500); const sn = await snapshot(); sn.vis.forEach((v) => { if (v.ov > v.w * 0.5) kbReached.add(v.i); }); } await page.keyboard.press('End'); await sleep(900);
          const b = await page.evaluate((s) => document.querySelector(s + ' .featured-product__gallery').scrollLeft, sel);
          r.keyboard = { afterArrowRight: Math.round(a), afterEnd: Math.round(b), movesWithKeys: a > 0 || b > 0, allReachedByArrows: kbReached.size === r.info.n, reachedIdx: [...kbReached], focusableRegion: await page.evaluate((s) => document.querySelector(s + ' .featured-product__gallery').tabIndex, sel) };
          // elementos interactivos de los medios alcanzables por Tab (3D, video)
          r.tabIntoMedia = await page.evaluate((s) => [...document.querySelectorAll(s + ' .featured-product__gallery button, ' + s + ' .featured-product__gallery model-viewer, ' + s + ' .featured-product__gallery video, ' + s + ' .featured-product__gallery [tabindex]')].map((e) => e.tagName.toLowerCase() + ':' + (e.getAttribute('aria-label') || '').slice(0, 30) + ':tab=' + e.tabIndex), sel);
          // simulacion CSS del orden: la 3a media seleccionada sale primero
          if (key === 'serra') {
            r.orderSim = await page.evaluate((s) => { const g = document.querySelector(s + ' .featured-product__gallery'); const items = [...g.querySelectorAll('.featured-product__media')]; items.forEach((m) => m.removeAttribute('data-selected')); items[2].setAttribute('data-selected', ''); g.scrollLeft = 0; return new Promise((res) => setTimeout(() => { const lefts = items.map((m) => Math.round(m.getBoundingClientRect().left)); res({ thirdIsFirst: lefts[2] === Math.min(...lefts), lefts }); items[2].removeAttribute('data-selected'); }, 200)); }, sel);
            // cambio de variante real: scroll al final y cambiar talla
            await page.evaluate((s) => { document.querySelector(s + ' .featured-product__gallery').scrollLeft = 10000; }, sel); await sleep(500);
            const slBefore = await page.evaluate((s) => Math.round(document.querySelector(s + ' .featured-product__gallery').scrollLeft), sel);
            const radios = page.locator(sel + ' input[type=radio]:not(:checked)');
            const nr = await radios.count(); r.variantInputs = nr;
            if (nr) { const lab = page.locator(sel + ' label[for="' + await radios.first().getAttribute('id') + '"]'); await lab.click().catch(async () => { await radios.first().check({ force: true }); }); await sleep(1500); }
            const slAfter = await page.evaluate((s) => Math.round(document.querySelector(s + ' .featured-product__gallery').scrollLeft), sel);
            r.variantChange = { before: slBefore, after: slAfter, selectedMarked: await page.evaluate((s) => document.querySelectorAll(s + ' [data-selected]').length, sel), note: 'no variant of serra-coat has a featured media, so data-selected is never set and updateMedia() (assets/theme.js:1411) skips scrollTo' };
          }
        } else {
          r.desktop = await page.evaluate((s) => { const g = document.querySelector(s + ' .featured-product__gallery'); const items = [...g.querySelectorAll('.featured-product__media')]; return { tabindexAttr: g.getAttribute('tabindex'), tabIndexProp: g.tabIndex, emptyTab0: g.getAttribute('tabindex') === '0' && g.scrollWidth <= g.clientWidth, display: getComputedStyle(g).display, flexDirection: getComputedStyle(g).flexDirection, mediaWidths: items.map((m) => Math.round(m.getBoundingClientRect().width)), galleryW: Math.round(g.getBoundingClientRect().width), horizontallyScrollable: g.scrollWidth > g.clientWidth, order: items.map((m) => getComputedStyle(m).order) }; }, sel);
          r.noTabindexEmpty = !r.desktop.emptyTab0;
        }
        await page.locator(sel).first().screenshot({ path: `/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots/fp-${preset}-${key}-${mode}.png` }).catch(() => {});
        run.products[key] = r;
      }
    } catch (e) { run.error = String(e).slice(0, 500); }
    run.consoleTheme = themeConsole(w);
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('02-featured-product.json', out);
for (const r of out.runs) for (const [k, p] of Object.entries(r.products || {})) console.log(r.preset, r.mode, k, r.error || JSON.stringify({ n: p.info.n, kinds: p.info.items.map((i) => i.kind).join(','), noNone: p.noDisplayNone, scrollable: p.info.scrollable, swipeAll: p.swipe?.allReached, kb: p.keyboard?.movesWithKeys, vc: p.variantChange && `${p.variantChange.before}->${p.variantChange.after}`, sim: p.orderSim?.thirdIsFirst, d: p.desktop && `${p.desktop.display} tab=${p.desktop.tabindexAttr} empty=${p.desktop.emptyTab0} scroll=${p.desktop.horizontallyScrollable}` }));
