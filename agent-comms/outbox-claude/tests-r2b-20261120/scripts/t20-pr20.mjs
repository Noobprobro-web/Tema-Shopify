// Parte B: retest del delta del PR #20 (numeracion suelta del curated-showcase, pie alineado a la derecha, aria-label unico de slideshows).
// Uso: PRESETS=sartorial,imprint,archive,pkg node t20-pr20.mjs
import { chromium, newCtx, nav, save, sleep, pace, watch, axe, overflowX, shot, O, THEMES, themeConsole } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const MOB = { deviceScaleFactor: 2, hasTouch: true, isMobile: true };
const rxSlash = /\d\d\s*\/\s*\d\d/g;
const rxBracket = /\[\d\d\]/g;
const themeAxe = (a) => a.violations.filter((v) => !v.targets.every((x) => /PBar|preview-bar/.test(x))).map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes, targets: v.targets }));
const probe = () => {
  const root = document.querySelector('curated-showcase'); if (!root) return { found: false };
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'; };
  const panels = [...root.querySelectorAll('.curated-showcase__panel')];
  const tabs = [...root.querySelectorAll('[role=tab]')];
  return {
    found: true, nTabs: tabs.length, nPanels: panels.length, tabsVisible: tabs.filter(vis).length,
    tabs: tabs.map((t) => ({ text: t.textContent.replace(/\s+/g, ' ').trim(), ariaLabel: t.getAttribute('aria-label'), selected: t.getAttribute('aria-selected'), tabindex: t.getAttribute('tabindex'), hasBracket: /\[\d+\]/.test(t.textContent) })),
    panels: panels.map((p, i) => { const t = p.querySelector('.curated-showcase__panel-title'); return { i, visible: vis(p), hidden: p.hidden, title: t ? { text: t.textContent.trim().slice(0, 40), visible: vis(t) } : null, top: Math.round(p.getBoundingClientRect().top + scrollY), h: Math.round(p.getBoundingClientRect().height) }; }),
  };
};
// Alineacion del pie de cada panel visible: enlace pegado al borde derecho del contenido, sin desbordar.
const footerProbe = () => [...document.querySelectorAll('curated-showcase .curated-showcase__footer')].map((f, i) => {
  const r = f.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return { i, visible: false };
  const cs = getComputedStyle(f); const a = f.querySelector('a'); const ar = a ? a.getBoundingClientRect() : null;
  const padR = parseFloat(cs.paddingRight) || 0;
  return { i, visible: true, justify: cs.justifyContent, footerLeft: Math.round(r.left), footerRight: Math.round(r.right), linkLeft: ar && Math.round(ar.left), linkRight: ar && Math.round(ar.right), rightGap: ar ? Math.round((r.right - padR) - ar.right) : null, scrollOver: f.scrollWidth - f.clientWidth, childCount: f.children.length, text: f.innerText.replace(/\s+/g, ' ').trim().slice(0, 80), linkWithinViewport: ar ? ar.right <= document.documentElement.clientWidth + 1 && ar.left >= -1 : null };
});
try {
  for (const preset of which) {
    for (const mode of ['mobile', 'desktop']) {
      const mob = mode === 'mobile'; const run = { preset, mode, theme: THEMES[preset] };
      const ctx = await newCtx(browser, mob ? 390 : 1280, mob ? 844 : 800, mob ? MOB : {}); const page = await ctx.newPage(); const w = watch(page);
      try {
        // --- home
        await nav(page, '/', THEMES[preset], 1500);
        run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < H; y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await sleep(100); }
        await page.evaluate(() => scrollTo(0, 0)); await sleep(400);
        run.visibleText = await page.evaluate(() => document.body.innerText);
        run.numberingSlash = [...new Set(run.visibleText.match(rxSlash) || [])];
        run.numberingBracket = [...new Set(run.visibleText.match(rxBracket) || [])];
        // contexto de cada coincidencia (para descartar fechas o precios)
        run.numberingContext = [...run.visibleText.matchAll(/.{0,30}(\d\d\s*\/\s*\d\d|\[\d\d\]).{0,30}/g)].map((m) => m[0].replace(/\s+/g, ' ')).slice(0, 8);
        run.visibleTextLen = run.visibleText.length; delete run.visibleText;
        run.overflow = (await overflowX(page)).overflow;
        run.homeAxe = themeAxe(await axe(page));
        run.showcase = await page.evaluate(probe);
        // nombre accesible de cada pestana segun el motor del navegador (getByRole)
        if (run.showcase.found) {
          run.tabNames = [];
          for (let i = 0; i < run.showcase.nTabs; i++) {
            const label = run.showcase.tabs[i].text;
            run.tabNames.push({ expected: label, byRole: await page.getByRole('tab', { name: label, exact: true }).count() });
          }
          run.tabNamesOk = run.tabNames.every((t) => t.byRole === 1 && !/\[\d/.test(t.expected));
          const sc = page.locator('curated-showcase').first(); await sc.scrollIntoViewIfNeeded(); await sleep(400);
          run.footers = await page.evaluate(footerProbe);
          // pie de cada pestana: activar cada una y medir
          run.footersByTab = [];
          const tabs = page.locator('curated-showcase [role=tab]'); const nt = await tabs.count();
          for (let i = 0; i < nt; i++) { await tabs.nth(i).click(); await sleep(500); run.footersByTab.push({ tab: i, footers: (await page.evaluate(footerProbe)).filter((f) => f.visible) }); await page.locator('curated-showcase').first().screenshot({ path: `${process.env.SHOTS_DIR}/pr20-showcase-${preset}-${mode}-tab${i}.png` }).catch(() => {}); }
          run.footerOk = run.footersByTab.every((t) => t.footers.length === 1 && t.footers[0].justify === 'flex-end' && Math.abs(t.footers[0].rightGap) <= 2 && t.footers[0].scrollOver <= 0 && t.footers[0].linkWithinViewport && t.footers[0].childCount === 1);
          // --- teclado
          const kb = { steps: [] };
          await tabs.nth(0).click(); await sleep(300); await tabs.nth(0).focus();
          const sel = () => page.evaluate(() => ({ selected: [...document.querySelectorAll('curated-showcase [role=tab]')].map((t) => t.getAttribute('aria-selected')).indexOf('true'), focus: [...document.querySelectorAll('curated-showcase [role=tab]')].indexOf(document.activeElement), visiblePanels: [...document.querySelectorAll('curated-showcase .curated-showcase__panel')].filter((p) => p.getBoundingClientRect().height > 0).length }));
          kb.start = await sel();
          for (const key of ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'End', 'Home']) { await page.keyboard.press(key); await sleep(350); kb.steps.push({ key, ...(await sel()) }); }
          // Tab desde la pestana activa entra al panel (enlace del pie o contenido)
          await page.keyboard.press('Tab'); await sleep(200);
          kb.afterTab = await page.evaluate(() => { const a = document.activeElement; return { tag: a?.tagName, inPanel: !!a?.closest('.curated-showcase__panel'), text: (a?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) }; });
          run.keyboard = kb;
          run.keyboardOk = nt < 2 || (kb.steps[0].selected === 1 && kb.steps[0].focus === 1 && kb.steps.every((s) => s.visiblePanels === 1));
        }
        run.homeConsole = themeConsole(w);
        // --- std-test: dos slideshows, landmark-unique
        await nav(page, '/pages/std-test', THEMES[preset], 1200);
        const H2 = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < H2; y += 600) { await page.evaluate((v) => scrollTo(0, v), y); await sleep(80); }
        await page.evaluate(() => scrollTo(0, 0)); await sleep(300);
        run.slideshowLabels = await page.evaluate(() => [...document.querySelectorAll('section.slideshow')].map((s) => ({ id: s.closest('[id^=shopify-section]')?.id.split('__').pop(), label: s.getAttribute('aria-label') })));
        run.slideshowLabelsUnique = run.slideshowLabels.length >= 2 && new Set(run.slideshowLabels.map((s) => s.label)).size === run.slideshowLabels.length;
        const a2 = await axe(page); run.stdAxe = themeAxe(a2);
        run.stdLandmarkUnique = a2.violations.filter((v) => v.id === 'landmark-unique').length;
        run.stdOverflow = (await overflowX(page)).overflow;
        run.stdConsole = themeConsole(w).slice(run.homeConsole.length);
      } catch (e) { run.error = String(e).slice(0, 400); }
      out.runs.push(run); await ctx.close();
    }
    // --- sin JS (solo 390 y 1280 en la misma corrida): paneles apilados y pestanas ocultas
    for (const mode of ['mobile', 'desktop']) {
      const mob = mode === 'mobile'; const run = { preset, mode, nojs: true };
      const ctx = await newCtx(browser, mob ? 390 : 1280, 844, mob ? { ...MOB, javaScriptEnabled: false } : { javaScriptEnabled: false }); const page = await ctx.newPage();
      try {
        await pace(); await page.goto(`${O}/?preview_theme_id=${THEMES[preset]}`, { waitUntil: 'load' });
        const html = await page.content(); const m = html.match(/Shopify\.theme\s*=\s*\{[^}]*\}/); run.identityNoJs = m ? m[0].slice(0, 110) : null;
        if (!m || !m[0].includes(THEMES[preset]) || !/unpublished/.test(m[0])) throw new Error('PREVIEW_IDENTITY ' + run.identityNoJs);
        run.probe = await page.evaluate(probe); run.footers = await page.evaluate(footerProbe);
        const n = run.probe;
        run.stackedOk = n.found && n.nPanels >= 2 && n.panels.every((p) => p.visible) && n.panels.every((p, i, a) => i === 0 || p.top >= a[i - 1].top + a[i - 1].h - 2) && n.panels.slice(1).every((p) => p.title && p.title.visible) && n.tabsVisible === 0;
        run.noBracketVisible = !/\[\d\d\]/.test(await page.evaluate(() => document.body.innerText)) && !/\d\d\s*\/\s*\d\d/.test(await page.evaluate(() => document.body.innerText));
        run.footersOk = run.footers.filter((f) => f.visible).every((f) => f.justify === 'flex-end' && Math.abs(f.rightGap) <= 2 && f.scrollOver <= 0);
        await page.locator('curated-showcase').first().screenshot({ path: `${process.env.SHOTS_DIR}/pr20-showcase-${preset}-${mode}-nojs.png` }).catch(() => {});
      } catch (e) { run.error = String(e).slice(0, 300); }
      out.runs.push(run); await ctx.close();
    }
  }
} finally { await browser.close(); }
save(process.env.OUTNAME || '20-pr20.json', out);
for (const r of out.runs) console.log(JSON.stringify(r.nojs
  ? { preset: r.preset, mode: r.mode, nojs: true, stacked: r.stackedOk, noNumbering: r.noBracketVisible, footersOk: r.footersOk, err: r.error }
  : { preset: r.preset, mode: r.mode, slash: r.numberingSlash, bracket: r.numberingBracket, homeAxe: r.homeAxe?.map((a) => a.id), tabNamesOk: r.tabNamesOk, footerOk: r.footerOk, kbOk: r.keyboardOk, ov: r.overflow, cons: r.homeConsole?.length, slides: r.slideshowLabels?.map((s) => s.label), uniq: r.slideshowLabelsUnique, stdAxe: r.stdAxe?.map((a) => a.id), stdCons: r.stdConsole?.length, err: r.error }));
