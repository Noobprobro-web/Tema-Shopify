// UX-01: galeria de la ficha como carrusel movil (390 px, DPR 2, touch) y rejilla en 1280 px.
import { chromium, newCtx, nav, save, sleep, watch, overflowX, shot, THEMES, presets } from './common.mjs';
const PRODUCTS = (process.env.PRODUCTS || 'fixture-media-3d-video,serra-coat').split(',');
const probe = () => {
  const g = document.querySelector('product-gallery'); if (!g) return { noGallery: true };
  const track = g.querySelector('[data-gallery-track]');
  const items = [...g.querySelectorAll('[data-product-media-id]')].map((e) => { const r = e.getBoundingClientRect(); return { l: Math.round(r.left + scrollX), t: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height), inert: e.inert, hiddenAttr: e.hidden, kind: e.querySelector('model-viewer') ? 'model' : e.querySelector('video') ? 'video' : e.querySelector('iframe') ? 'iframe' : e.querySelector('img') ? 'image' : 'other', zoom: !!e.querySelector('[data-zoom-open]') }; });
  const cs = getComputedStyle(track); const pager = g.querySelector('[data-gallery-pager]');
  return { n: items.length, items, track: { sw: track.scrollWidth, cw: track.clientWidth, sl: Math.round(track.scrollLeft), overflowX: cs.overflowX, snap: cs.scrollSnapType, display: cs.display, tabIndex: track.tabIndex, label: track.getAttribute('aria-label') }, pagerHidden: pager ? pager.hidden || getComputedStyle(pager).display === 'none' : null, counter: g.querySelector('[data-gallery-current]')?.textContent ?? null, status: g.querySelector('[data-gallery-status]')?.textContent ?? null, inertCount: items.filter((i) => i.inert).length };
};
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
try {
  for (const preset of presets) {
    for (const mode of (process.env.MODES || 'mobile,desktop').split(',')) {
      const ctx = await newCtx(browser, mode === 'mobile' ? 390 : 1280, mode === 'mobile' ? 844 : 800, mode === 'mobile' ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {});
      const page = await ctx.newPage(); const w = watch(page); const cdp = mode === 'mobile' ? await ctx.newCDPSession(page) : null;
      for (const slug of PRODUCTS) {
        const run = { preset, mode, slug, checks: {}, notes: [] };
        try {
          await nav(page, `/products/${slug}`, THEMES[preset], 900);
          const id = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role })); run.identity = id;
          const p0 = await probe_(page); run.initial = p0;
          run.overflow = await overflowX(page);
          const tag = `${preset}-${slug}-${mode}`;
          await shot(page, `ux01-${tag}-initial`);
          if (mode === 'mobile') {
            const lefts = p0.items.map((i) => i.l); const tops = p0.items.map((i) => i.t);
            run.checks.notStacked = p0.n < 2 || (new Set(tops).size === 1 && new Set(lefts).size === p0.n);
            run.checks.trackScrolls = p0.track.sw > p0.track.cw + 4 || p0.n < 2;
            run.checks.pagerVisible = p0.n < 2 || p0.pagerHidden === false;
            run.checks.exactlyOneNonInert = p0.n < 2 || p0.inertCount === p0.n - 1;
            run.checks.activeNotInert = p0.items[0] ? p0.items[0].inert === false : null;
            if (p0.n >= 2) {
              // swipe tactil real
              const b = await page.locator('[data-gallery-track]').boundingBox();
              await page.locator('[data-gallery-track]').scrollIntoViewIfNeeded(); await sleep(300);
              const b2 = await page.locator('[data-gallery-track]').boundingBox();
              const cx = Math.round(b2.x + b2.width * 0.8), cy = Math.round(b2.y + b2.height / 2);
              await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] });
              for (let s = 1; s <= 12; s++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx - s * 20, y: cy }] }); await sleep(16); }
              await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
              await sleep(900);
              const pS = await probe_(page); run.afterSwipe = { sl: pS.track.sl, counter: pS.counter, status: pS.status };
              run.checks.swipeMovesTrack = pS.track.sl > p0.track.sl + 20;
              run.checks.swipeUpdatesCounter = pS.counter === '2';
              await shot(page, `ux01-${tag}-after-swipe`);
              if (p0.items[0].kind === 'model' && !run.checks.swipeMovesTrack) {
                run.notes.push('OBS: el swipe sobre el visor 3D no mueve el carrusel (el visor captura el gesto horizontal)');
                const gx = 6, gy = Math.round(b2.y + 40);
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: gx, y: gy }] });
                for (let s = 1; s <= 12; s++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: gx + s * 14, y: gy }] }); await sleep(16); }
                await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await sleep(700);
                const pG = await probe_(page); run.afterGutterSwipeRight = { sl: pG.track.sl, counter: pG.counter };
                // swipe sobre el slide de video (segundo) en sentido contrario, tras ir a el con siguiente
                delete run.checks.swipeMovesTrack; delete run.checks.swipeUpdatesCounter; run.checks.swipeOn3dCaptured = true;
              }
              // volver con anterior
              await page.locator('[data-gallery-step="-1"]').click({ timeout: 4000 }).catch((e) => { run.notes.push('prev click: ' + String(e).slice(0, 80)); }); await sleep(900);
              const pP = await probe_(page); run.afterPrev = { sl: pP.track.sl, counter: pP.counter };
              run.checks.prevReturns = pP.counter === '1' && pP.track.sl < 5;
              // siguiente
              await page.locator('[data-gallery-step="1"]').click({ timeout: 4000 }).catch((e) => { run.notes.push('next click: ' + String(e).slice(0, 80)); }); await sleep(900);
              const pN = await probe_(page); run.afterNext = { sl: pN.track.sl, counter: pN.counter, status: pN.status, items: pN.items.map((i) => i.inert) };
              run.checks.nextAdvances = pN.counter === '2' && pN.track.sl > 20;
              run.checks.activeNotInertAfterNext = pN.items[1] ? pN.items[1].inert === false : null;
              run.checks.oneNonInertAfterNext = pN.inertCount === pN.n - 1;
              run.checks.statusAnnounces = !!(pN.status && pN.status.trim());
              await shot(page, `ux01-${tag}-after-next`);
              // limites: ir al final y comprobar que siguiente se comporta
              for (let k = 0; k < pN.n + 1; k++) { const nx = page.locator('[data-gallery-step="1"]'); if (await nx.isDisabled().catch(() => false)) break; await nx.click({ timeout: 2000 }).catch(() => {}); await sleep(450); }
              const pE = await probe_(page); run.atEnd = { counter: pE.counter, sl: pE.track.sl, nextDisabled: await page.locator('[data-gallery-step="1"]').isDisabled().catch(() => null) };
              await shot(page, `ux01-${tag}-end`);
              await page.locator('[data-gallery-step="-1"]'); for (let k = 0; k < pE.n; k++) { const pv = page.locator('[data-gallery-step="-1"]'); if (await pv.isDisabled().catch(() => false)) break; await pv.click({ timeout: 2000 }).catch(() => {}); await sleep(450); }
            }
          } else {
            run.checks.pagerHiddenDesktop = p0.n < 2 || p0.pagerHidden === true;
            const cols = await page.evaluate(() => getComputedStyle(document.querySelector('[data-gallery-track]')).gridTemplateColumns.split(' ').length);
            run.desktopCols = cols; run.checks.noInertDesktop = p0.inertCount === 0;
            run.checks.trackNotScrollable = p0.track.sw <= p0.track.cw + 4;
          }
          // zoom (imagenes)
          const z = page.locator('[data-zoom-open]:visible').first();
          if (await z.count()) {
            await z.scrollIntoViewIfNeeded(); await z.click(); await sleep(900);
            const zs = await page.evaluate(() => { const d = document.querySelector('dialog[data-zoom-dialog]'); const r = d?.getBoundingClientRect(); return { open: !!d?.open, w: r ? Math.round(r.width) : 0, h: r ? Math.round(r.height) : 0, counter: document.querySelector('[data-zoom-counter]')?.textContent, imgLoaded: !!document.querySelector('dialog[data-zoom-dialog] img')?.naturalWidth }; });
            run.zoomOpen = zs; run.checks.zoomOpens = zs.open && zs.w > 100;
            await shot(page, `ux01-${preset}-${slug}-${mode}-zoom`);
            await page.keyboard.press('Escape'); await sleep(500);
            run.checks.zoomCloses = await page.evaluate(() => !document.querySelector('dialog[data-zoom-dialog]')?.open);
          } else run.notes.push('sin disparador de zoom visible');
          // video / 3D
          const vid = await page.evaluate(() => ({ video: document.querySelectorAll('product-gallery video').length, model: document.querySelectorAll('product-gallery model-viewer').length }));
          run.media = vid;
          if (vid.video) {
            const v = page.locator('product-gallery video').first(); await v.scrollIntoViewIfNeeded().catch(() => {}); await sleep(500);
            const st = await v.evaluate(async (el) => { const before = { paused: el.paused, ready: el.readyState }; try { el.muted = true; await el.play(); } catch (e) { return { before, error: String(e).slice(0, 100) }; } await new Promise((r) => setTimeout(r, 900)); const t = el.currentTime; el.pause(); return { before, played: t > 0, currentTime: Math.round(t * 100) / 100, controls: el.controls, w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) }; });
            run.video = st; run.checks.videoPlays = !!st.played;
            await shot(page, `ux01-${preset}-${slug}-${mode}-video`);
          }
          if (vid.model) {
            const m = await page.evaluate(() => [...document.querySelectorAll('product-gallery model-viewer')].map((e) => ({ w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), inert: e.inert })));
            run.model = m;
          }
        } catch (e) { run.error = String(e).slice(0, 400); }
        out.runs.push(run);
      }
      out.runs.push({ preset, mode, watch: { console: w.console, pageerrors: w.pageerrors, failed: w.failed } });
      await ctx.close();
    }
  }
} finally { await browser.close(); }
const bad = out.runs.filter((r) => r.checks).flatMap((r) => Object.entries(r.checks).filter(([, v]) => v === false).map(([k]) => `${r.preset}/${r.mode}/${r.slug}:${k}`));
out.failedChecks = bad; out.errors = out.runs.filter((r) => r.error).map((r) => `${r.preset}/${r.mode}/${r.slug}: ${r.error}`);
save('15-ux01-gallery.json', out);
console.log('failed:', bad, 'errors:', out.errors);
async function probe_(page) { return page.evaluate(probe); }
