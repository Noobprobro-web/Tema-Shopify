// 10. Home of the 3 presets: console, axe, neutral copy (no loose numbering), no half-built sections.
import { chromium, newCtx, nav, save, sleep, watch, axe, overflowX, SHOTS, THEMES, presets } from './common.mjs';
import fs from 'fs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const platform = (c) => /ERR_TUNNEL_CONNECTION_FAILED|shopifysvc|shop\.app|preview-bar|bugsnag|postMessage|shopify-xr\.js|Refused to execute script/.test((c.text || '') + (c.url || ''));
try {
  for (const preset of presets) for (const mode of ['mobile', 'desktop']) {
    const mobile = mode === 'mobile';
    const ctx = await newCtx(browser, mobile ? 390 : 1280, mobile ? 844 : 800, mobile ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {});
    const page = await ctx.newPage(); const w = watch(page); const run = { preset, mode };
    try {
      await nav(page, '/', THEMES[preset], 1500);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      // forzar reveals y lazy
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await sleep(120); }
      await page.evaluate(() => scrollTo(0, 0)); await sleep(500);
      run.sections = await page.evaluate(() => [...document.querySelectorAll('main .shopify-section, #MainContent > [id^=shopify-section]')].map((s) => { const r = s.getBoundingClientRect(); const txt = s.textContent.replace(/\s+/g, ' ').trim(); const hd = s.querySelector('h1,h2,h3'); return { id: s.id.split('__').pop(), h: Math.round(r.height), textLen: txt.length, imgs: s.querySelectorAll('img').length, brokenImgs: [...s.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length, heading: hd ? hd.textContent.trim().slice(0, 40) : null, liquidError: /Liquid error|Liquid syntax error/.test(s.innerHTML) }; }));
      run.liquidErrorsInPage = await page.evaluate(() => (document.body.innerHTML.match(/Liquid (syntax )?error[^<]{0,120}/g) || []).slice(0, 10));
      run.tinySections = run.sections.filter((s) => s.h < 60 || (s.textLen < 3 && s.imgs === 0)).map((s) => `${s.id}:${s.h}px`);
      run.bigGaps = await page.evaluate(() => { const ss = [...document.querySelectorAll('#MainContent > [id^=shopify-section]')]; const gaps = []; for (let i = 1; i < ss.length; i++) { const a = ss[i - 1].getBoundingClientRect(), b = ss[i].getBoundingClientRect(); const g = Math.round(b.top - a.bottom); if (Math.abs(g) > 2) gaps.push(`${ss[i - 1].id.split('__').pop()}->${ss[i].id.split('__').pop()}:${g}`); } return gaps; });
      run.looseNumbering = await page.evaluate(() => { const t = document.querySelector('main').innerText; const pats = [/(^|\s)\/\s?\d{1,3}\b/g, /\bLOOK\s?\d+/gi, /\bPLATE\s+[IVXL]+\b/gi, /\bFIG\.?\s?\d+/gi, /\bN[o°º]\.?\s?\d{2,}/g, /\blorem\b/gi, /\b0\d\s?\/\s?0\d\b/g]; const hits = []; pats.forEach((p) => { (t.match(p) || []).forEach((m) => hits.push(m.trim())); }); return [...new Set(hits)].slice(0, 12); });
      run.visibleText = await page.evaluate(() => document.querySelector('main').innerText.replace(/\s+/g, ' ').slice(0, 700));
      run.overflow = await overflowX(page);
      run.axe = await axe(page); run.axeTheme = run.axe.violations.filter((v) => !v.targets.every((x) => /PBar|preview-bar/.test(x)));
      run.consoleTheme = [...w.console.filter((c) => c.type === 'error' && !platform(c)), ...w.pageerrors.filter((e) => !/shopifycloud|shopifysvc|trekkie|monorail|storefront-features|preview-bar|web-pixels|shop\.app/.test(e)).map((e) => ({ type: 'pageerror', text: e }))];
      run.consolePlatform = w.console.filter(platform).length;
      // capturas por tramos
      const full = `${SHOTS}/home-${preset}-${mode}-full.png`; await page.screenshot({ path: full, fullPage: true });
      run.fullShot = full; run.pageHeight = H;
    } catch (e) { run.error = String(e).slice(0, 400); }
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('10-home.json', out);
for (const r of out.runs) console.log(r.preset, r.mode, 'h', r.pageHeight, 'ov', r.overflow?.overflow, 'axeTheme', r.axeTheme?.length, 'consoleTheme', r.consoleTheme?.length, 'tiny', r.tinySections, 'liq', r.liquidErrorsInPage?.length, r.error || '');
