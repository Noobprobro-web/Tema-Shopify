// 1. Footer social icons: 9 visible, target >=44, accessible name, focus visible, axe.
import { chromium, ctxFor, nav, save, sleep, shot, watch, axe, THEMES, themeConsole, axeTheme } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const NET = ['instagram','facebook','x','youtube','tiktok','pinterest','snapchat','vimeo','tumblr'];
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const path = process.env.PATHNAME || '/';
const tag = process.env.TAG || 'social';
try {
  for (const preset of which) for (const mode of ['mobile', 'desktop']) {
    const ctx = await ctxFor(browser, mode); const page = await ctx.newPage(); const w = watch(page); const run = { preset, mode };
    try {
      await nav(page, path, THEMES[preset], 1200);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      await page.locator('.site-footer__social').first().scrollIntoViewIfNeeded().catch(() => {}); await sleep(400);
      run.links = await page.evaluate(() => [...document.querySelectorAll('.site-footer__social a')].map((a) => {
        const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); const svg = a.querySelector('svg');
        const hidden = a.querySelector('.visually-hidden');
        const name = (a.getAttribute('aria-label') || a.getAttribute('aria-labelledby') || (a.textContent || '')).trim();
        const sr = svg ? svg.getBoundingClientRect() : null;
        return { href: a.href, name, nameSource: a.getAttribute('aria-label') ? 'aria-label' : hidden ? 'visually-hidden text' : 'text', w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, visible: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none', svgW: sr ? Math.round(sr.width) : null, svgHidden: svg ? svg.getAttribute('aria-hidden') : null };
      }));
      run.count = run.links.length; run.allVisible = run.links.every((l) => l.visible); run.minTarget = Math.min(...run.links.map((l) => Math.min(l.w, l.h)));
      run.allNamed = run.links.every((l) => l.name.length >= 1);
      run.hasNetworks = NET.every((n) => run.links.some((l) => l.href.includes(n === 'x' ? 'x.com' : n)));
      // overlaps / wrapping
      run.rows = await page.evaluate(() => { const ys = new Set([...document.querySelectorAll('.site-footer__social a')].map((a) => Math.round(a.getBoundingClientRect().top))); return ys.size; });
      // foco con Tab
      await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
      const first = page.locator('.site-footer__social a').first(); const seen = []; let reached = 0;
      await page.keyboard.press('Home').catch(() => {});
      // llevar el foco justo antes del primer enlace social
      await first.evaluate((e) => { const all = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,[tabindex]')].filter((x) => !x.disabled && x.tabIndex >= 0 && x.getClientRects().length); const i = all.indexOf(e); (all[i - 1] || document.body).focus(); });
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press('Tab'); await sleep(120);
        const d = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); const ow = parseFloat(cs.outlineWidth) || 0; let fv = false; try { fv = e.matches(':focus-visible'); } catch {} const r = e.getBoundingClientRect(); return { inSocial: !!e.closest('.site-footer__social'), name: (e.textContent || '').trim(), outline: `${cs.outlineStyle} ${ow}px ${cs.outlineColor}`, boxShadow: cs.boxShadow === 'none' ? null : cs.boxShadow.slice(0, 50), focusVisible: fv, inViewport: r.top >= 0 && r.bottom <= innerHeight }; });
        seen.push(d); if (d.inSocial) reached++;
        if (i === 0 && d.inSocial) { await sleep(700); d.inViewport = await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }); await page.locator('.site-footer__social').first().screenshot({ path: `${process.env.SHOTS_DIR || '/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots'}/${tag}-${preset}-${mode}-focus.png` }); }
      }
      run.focus = { reached, allIndicator: seen.filter((s) => s.inSocial).every((s) => s.focusVisible && ((parseFloat(s.outline.split(' ')[1]) > 0 && !s.outline.startsWith('none')) || s.boxShadow)), seen };
      
      await page.locator('.site-footer__social').first().screenshot({ path: `${process.env.SHOTS_DIR || '/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots'}/${tag}-${preset}-${mode}-icons.png` }).catch(() => {});
      run.axe = await axe(page); run.axeTheme = axeTheme(run.axe);
    } catch (e) { run.error = String(e).slice(0, 400); }
    run.consoleTheme = themeConsole(w);
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save(`01-${tag}.json`, out);
for (const r of out.runs) console.log(r.preset, r.mode, r.error || `n=${r.count} vis=${r.allVisible} min=${r.minTarget} named=${r.allNamed} nets=${r.hasNetworks} rows=${r.rows} tabReach=${r.focus?.reached} focusInd=${r.focus?.allIndicator} axe=${r.axeTheme?.map(v=>v.id).join(',')||0} console=${r.consoleTheme.length}`);
