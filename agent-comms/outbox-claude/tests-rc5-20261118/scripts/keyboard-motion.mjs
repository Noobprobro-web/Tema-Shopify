// /pages/std-test: teclado (Tab/Shift+Tab, orden y foco visible) y slideshow con prefers-reduced-motion.
import { chromium, newCtx, nav, save, sleep, shot, THEMES, presets } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const desc = () => {
  const e = document.activeElement; if (!e || e === document.body) return null;
  const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); const sc = e.closest('[id^=shopify-section]');
  const bs = cs.boxShadow; const ow = parseFloat(cs.outlineWidth) || 0;
  let fv = false; try { fv = e.matches(':focus-visible'); } catch {}
  const inertAnc = !!e.closest('[inert]');
  return { tag: e.tagName.toLowerCase(), name: (e.getAttribute('aria-label') || e.textContent || e.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 40), section: sc ? sc.id.split('__').pop() : null, w: Math.round(r.width), h: Math.round(r.height), inViewport: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, visibility: cs.visibility, inert: inertAnc, outline: `${cs.outlineStyle} ${ow}px`, boxShadow: bs === 'none' ? null : bs.slice(0, 40), focusVisible: fv, indicator: (cs.outlineStyle !== 'none' && ow > 0) || bs !== 'none' };
};
try {
  for (const preset of presets) for (const mode of ['mobile', 'desktop']) {
    const mobile = mode === 'mobile';
    const ctx = await newCtx(browser, mobile ? 390 : 1280, mobile ? 844 : 800, mobile ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {});
    const page = await ctx.newPage(); const run = { preset, mode };
    try {
      await nav(page, '/pages/std-test', THEMES[preset], 1500);
      // pausar autoplay para que el orden sea estable
      await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
      await page.evaluate(() => { document.querySelector('[data-slideshow-toggle]')?.click(); scrollTo(0, 0); document.activeElement?.blur(); });
      await sleep(400);
      const seq = []; let prevPos = null; let orderViolations = [];
      for (let i = 0; i < 170; i++) {
        await page.keyboard.press('Tab'); await sleep(150);
        const d = await page.evaluate(desc); if (!d) { seq.push({ i, none: true }); continue; }
        const pos = await page.evaluate(() => { const e = document.activeElement; window.__prev = window.__prev || null; const r = window.__prev ? !!(window.__prev.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING) : true; window.__prev = e; return r; });
        d.i = i; d.afterPrev = pos;
        // indicador de foco por diferencia de pixeles (con foco frente a sin foco)
        try {
          const box = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return { x: Math.max(0, r.left - 10), y: Math.max(0, r.top - 10), width: Math.min(innerWidth, r.width + 20), height: Math.min(innerHeight, r.height + 20), vis: r.bottom > 0 && r.top < innerHeight }; });
          if (box.vis && box.width > 2 && box.height > 2) {
            // diferencia a pagina completa del viewport (el indicador puede estar en otro elemento, p. ej. el contenedor de la tarjeta)
            const a = await page.screenshot();
            const hnd = await page.evaluateHandle(() => document.activeElement); await page.evaluate(() => document.activeElement.blur()); await sleep(80);
            const b2 = await page.screenshot();
            await hnd.evaluate((e) => e.focus()); await sleep(80);
            d.pixelIndicator = !a.equals(b2);
          } else d.pixelIndicator = null;
        } catch (e) { d.pixelIndicator = null; d.pixelErr = String(e).slice(0, 60); }
        seq.push(d); if (!pos) orderViolations.push(`${i}:${d.tag}:${d.name}`);
        if (d.section === 'video_hosted' && /footer|Footer/.test(d.name)) break;
        const inFooter = await page.evaluate(() => !!document.activeElement.closest('footer, [id*=footer]'));
        if (inFooter) { d.footer = true; break; }
      }
      const inMain = seq.filter((s) => s.section && /^(slideshow|image_with_text|featured_collection|collection_list|blog_posts|rich_text|video_external|video_hosted)$/.test(s.section));
      run.tabCount = seq.length; run.mainStops = inMain.map((s) => `${s.i}:${s.section}:${s.tag}:${s.name}`);
      run.sectionsReached = [...new Set(inMain.map((s) => s.section))];
      run.noIndicator = seq.filter((s) => !s.none && s.pixelIndicator === false).map((s) => `${s.i}:${s.tag}:${s.name}:${s.section}`);
      run.notVisible = seq.filter((s) => !s.none && (!s.inViewport && !s.footer || s.visibility !== 'visible' || s.inert || s.w < 1 || s.h < 1)).map((s) => `${s.i}:${s.tag}:${s.name}:vp=${s.inViewport},vis=${s.visibility},inert=${s.inert},${s.w}x${s.h}`);
      run.orderViolations = orderViolations;
      run.stopsOnInertSlides = inMain.filter((s) => s.section === 'slideshow' && s.inert).length;
      // Shift+Tab: retroceder 6 pasos y comparar con la secuencia
      const back = []; for (let k = 0; k < 6; k++) { await page.keyboard.press('Shift+Tab'); await sleep(60); back.push(await page.evaluate(desc)); }
      const lastIdx = seq.length - 1; run.shiftTab = back.map((b, k) => ({ got: b ? `${b.tag}:${b.name}` : null, expected: seq[lastIdx - 1 - k] ? `${seq[lastIdx - 1 - k].tag}:${seq[lastIdx - 1 - k].name}` : null }));
      run.shiftTabMatches = run.shiftTab.every((x) => x.got === x.expected);
      run.checks = { allSectionsReachable: run.sectionsReached.length >= 6, focusAlwaysVisibleIndicator: run.noIndicator.length === 0, focusNeverHidden: run.notVisible.length === 0, orderMonotonic: run.orderViolations.length === 0, noStopOnInertSlide: run.stopsOnInertSlides === 0, shiftTabSymmetric: run.shiftTabMatches };
      // captura del foco en el slideshow
      await page.evaluate(() => { scrollTo(0, 0); }); await page.locator('[data-slideshow-next]').focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab'); await sleep(200); await shot(page, `kbd-${preset}-${mode}-slideshow-focus`);
    } catch (e) { run.error = String(e).slice(0, 400); }
    out.runs.push(run); await ctx.close();
    // reduced motion
    const ctx2 = await newCtx(browser, mobile ? 390 : 1280, mobile ? 844 : 800, { reducedMotion: 'reduce' });
    const p2 = await ctx2.newPage(); const rm = { preset, mode, reducedMotion: true };
    try {
      await nav(p2, '/pages/std-test', THEMES[preset], 1500);
      const idx = () => p2.evaluate(() => [...document.querySelectorAll('[data-slideshow-dot]')].findIndex((x) => x.getAttribute('aria-current') === 'true'));
      await p2.locator('[data-slideshow-track]').scrollIntoViewIfNeeded(); await sleep(300);
      rm.toggleLabel = await p2.locator('[data-slideshow-toggle]').getAttribute('aria-label').catch(() => null);
      rm.toggleHidden = await p2.locator('[data-slideshow-toggle]').evaluate((e) => e.hidden).catch(() => null); rm.idx0 = await idx(); await sleep(8000); rm.idxAfter8s = await idx(); rm.autoplayAdvancedUnderReducedMotion = rm.idx0 !== rm.idxAfter8s;
      rm.behaviorOnNext = await p2.evaluate(() => getComputedStyle(document.querySelector('[data-slideshow-track]')).scrollBehavior);
      await p2.locator('[data-slideshow-next]').click(); await sleep(300); rm.nextWorks = (await idx()) === (rm.idx0 + 1) % 3 || (await idx()) !== rm.idx0;
      rm.transitions = await p2.evaluate(() => [...document.querySelectorAll('[data-slideshow-slide],.slideshow__veil')].slice(0, 2).map((e) => getComputedStyle(e).transitionDuration));
      rm.check = { noAutoAdvance: !rm.autoplayAdvancedUnderReducedMotion, nextWorks: rm.nextWorks, toggleHidden: rm.toggleHidden === true };
    } catch (e) { rm.error = String(e).slice(0, 300); }
    out.runs.push(rm); await ctx2.close();
  }
} finally { await browser.close(); }
out.failedChecks = out.runs.flatMap((r) => Object.entries(r.checks || r.check || {}).filter(([, v]) => v === false).map(([k]) => `${r.preset}/${r.mode}${r.reducedMotion ? '/rm' : ''}:${k}`));
save('17-keyboard-motion.json', out);
console.log(JSON.stringify({ failed: out.failedChecks, errors: out.runs.filter((r) => r.error).map((r) => r.error) }, null, 1));
