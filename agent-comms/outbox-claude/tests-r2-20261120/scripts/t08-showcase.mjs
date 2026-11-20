// 8. curated-showcase on the home page: no JS -> panels stacked with titles; with JS -> normal tabs.
import { chromium, ctxFor, newCtx, nav, save, sleep, pace, O, shot, THEMES, watch, themeConsole } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive').split(',');
const probe = () => {
  const root = document.querySelector('curated-showcase') || document.querySelector('[id*=curated_showcase], [id*=curated-showcase]'); if (!root) return { found: false };
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
  const panels = [...root.querySelectorAll('.curated-showcase__panel')]; const tabs = [...root.querySelectorAll('[role=tab], .curated-showcase__tab')];
  const tl = root.querySelector('.curated-showcase__tabs');
  return { found: true, noJsClass: document.documentElement.classList.contains('no-js'), jsClass: document.documentElement.classList.contains('js'), nTabs: tabs.length, tabsContainerVisible: tl ? vis(tl) : null, tabsVisible: tabs.filter(vis).length, nPanels: panels.length,
    panels: panels.map((p, i) => { const t = p.querySelector('.curated-showcase__panel-title'); const imgs = [...p.querySelectorAll('img')]; return { i, visible: vis(p), hidden: p.hidden, display: getComputedStyle(p).display, title: t ? { text: t.textContent.trim().slice(0, 40), visible: vis(t) } : null, imgs: imgs.length, imgsLoaded: imgs.filter((m) => m.complete && m.naturalWidth > 0).length, top: Math.round(p.getBoundingClientRect().top + scrollY), h: Math.round(p.getBoundingClientRect().height), text: (p.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60) }; }), defined: !!customElements.get('curated-showcase') };
};
try {
  for (const preset of which) {
    for (const mode of ['mobile', 'desktop']) {
      const run = { preset, mode };
      // sin JS
      let ctx = await newCtx(browser, mode === 'mobile' ? 390 : 1280, 844, mode === 'mobile' ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true, javaScriptEnabled: false } : { javaScriptEnabled: false }); let page = await ctx.newPage();
      try {
        await pace(); await page.goto(`${O}/?preview_theme_id=${THEMES[preset]}`, { waitUntil: 'load' });
        const html = await page.content(); const m = html.match(/Shopify\.theme\s*=\s*\{[^}]*\}/); run.identityNoJs = m ? m[0].slice(0, 110) : null; if (!m || !m[0].includes(THEMES[preset]) || !/unpublished/.test(m[0])) throw new Error('PREVIEW_IDENTITY ' + run.identityNoJs);
        run.nojs = await page.evaluate(probe);
        const el = page.locator('curated-showcase').first(); if (await el.count()) { await el.scrollIntoViewIfNeeded(); await sleep(500); await el.screenshot({ path: `/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots/showcase-${preset}-${mode}-nojs.png` }); }
        const n = run.nojs;
        run.nojsPass = n.found && n.nPanels >= 2 && n.panels.every((p) => p.visible) && n.panels.slice(1).every((p) => p.title && p.title.visible) && n.tabsVisible === 0;
        run.nojsStacked = n.found && n.panels.every((p, i, a) => i === 0 || p.top >= a[i - 1].top + a[i - 1].h - 2);
      } catch (e) { run.errorNoJs = String(e).slice(0, 300); }
      await ctx.close();
      // con JS
      ctx = await ctxFor(browser, mode); page = await ctx.newPage(); const w = watch(page);
      try {
        await nav(page, '/', THEMES[preset], 1500); run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
        run.js = await page.evaluate(probe);
        const tabs = page.locator('curated-showcase [role=tab]'); const nt = await tabs.count();
        if (nt >= 2) { await tabs.nth(1).scrollIntoViewIfNeeded(); await tabs.nth(1).click(); await sleep(800); run.jsAfterClick = await page.evaluate(probe); await page.keyboard.press('ArrowLeft'); await sleep(500); run.jsAfterArrow = await page.evaluate(() => [...document.querySelectorAll('curated-showcase [role=tab]')].map((t) => t.getAttribute('aria-selected'))); }
        const jsv = run.js; run.jsPass = jsv.found && jsv.defined && jsv.nTabs >= 2 && jsv.tabsVisible >= 2 && jsv.panels.filter((p) => p.visible).length === 1 && (!run.jsAfterClick || (run.jsAfterClick.panels[1].visible && !run.jsAfterClick.panels[0].visible));
        await page.locator('curated-showcase').first().screenshot({ path: `/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots/showcase-${preset}-${mode}-js.png` }).catch(() => {});
      } catch (e) { run.errorJs = String(e).slice(0, 300); }
      run.consoleTheme = themeConsole(w); out.runs.push(run); await ctx.close();
    }
  }
} finally { await browser.close(); }
save('08-showcase.json', out);
for (const r of out.runs) console.log(r.preset, r.mode, r.errorNoJs || r.errorJs || '', JSON.stringify({ nojs: r.nojs && { panels: r.nojs.nPanels, vis: r.nojs.panels?.map((p) => p.visible + ':' + (p.title ? p.title.visible : 'notitle')).join(','), tabsVis: r.nojs.tabsVisible }, nojsPass: r.nojsPass, stacked: r.nojsStacked, js: r.js && { tabs: r.js.nTabs, visPanels: r.js.panels?.filter((p) => p.visible).length, defined: r.js.defined }, jsPass: r.jsPass }));
