// Tema «Sartorial pkg»: muestra (home, coleccion, ficha, std-test) buscando roturas por la transformacion del empaquetador.
import { chromium, newCtx, nav, save, sleep, watch, axe, overflowX, shot, THEMES } from './common.mjs';
const out = { when: new Date().toISOString(), theme: THEMES.pkg, runs: [] };
const browser = await chromium.launch();
const platform = (c) => /ERR_TUNNEL_CONNECTION_FAILED|shopifysvc|shop\.app|preview-bar|bugsnag|postMessage|shopify-xr\.js|Refused to execute script|monorail|api\/collect|Failed to fetch/.test((c.text || '') + (c.url || ''));
try {
  for (const [vw, mobile] of [[1280, false], [390, true]]) {
    const ctx = await newCtx(browser, vw, 800, mobile ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {}); const page = await ctx.newPage(); const w = watch(page);
    const bad = []; page.on('response', (r) => { if (r.status() >= 400 && /cdn\.shopify\.com|myshopify\.com/.test(r.url()) && !/shopifysvc|monorail|api\/collect|wpm|\.well-known|shopify-xr/.test(r.url())) bad.push({ s: r.status(), u: r.url().slice(0, 140) }); });
    for (const p of ['/', '/collections/permanent-collection', '/products/serra-coat', '/pages/std-test', '/cart', '/search?q=coat', '/blogs/news', '/404x']) {
      const run = { vw, path: p }; const b0 = bad.length;
      try {
        await nav(page, p, THEMES.pkg, 1000).catch(async (e) => { if (p === '/404x' && /PREVIEW_IDENTITY/.test(String(e))) { run.note = 'identidad no comprobable en 404 de tema'; } else throw e; });
        run.text = await page.evaluate(() => { const t = document.body.innerText; return { translationMissing: (t.match(/translation missing[^\n]{0,80}/gi) || []).slice(0, 5), rawKeys: (t.match(/\b(?:sections|general|products|collections|templates|cart|blogs|accessibility)\.[a-z_]+\.[a-z_.]+\b/g) || []).slice(0, 5), liquidError: (t.match(/Liquid (?:error|syntax error)[^\n]{0,100}/gi) || []).slice(0, 3), len: t.length }; });
        run.docsLeak = await page.evaluate(() => ({ docsCssRules: [...document.styleSheets].reduce((n, s) => { try { return n + [...s.cssRules].filter((r) => /documentation|support-page|docs-only/i.test(r.cssText.slice(0, 200))).length; } catch { return n; } }, 0), docsNodes: document.querySelectorAll('[class*="documentation"], [class*="support-page"]').length }));
        run.overflow = (await overflowX(page)).overflow; run.h1 = await page.evaluate(() => document.querySelectorAll('h1').length);
        const a = await axe(page); run.axe = a.violations.filter((v) => !v.targets.every((x) => /PBar/.test(x))).map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes }));
        if (vw === 1280 || p === '/') await shot(page, `pkg-${vw}-${p.replace(/\W+/g, '_')}`);
      } catch (e) { run.error = String(e).slice(0, 300); }
      run.badResponses = bad.slice(b0); out.runs.push(run);
    }
    out.runs.push({ vw, consoleTheme: w.console.filter((c) => c.type === 'error' && !platform(c)), pageerrorsTheme: w.pageerrors.filter((e) => !platform({ text: e })), failedTheme: w.failed.filter((f) => !/shopifysvc|monorail|collect|ERR_ABORTED|cdn\.shopify\.com\/shopifycloud\/(?:shop|web-pixels)/.test(f.url)).slice(0, 10) });
    await ctx.close();
  }
} finally { await browser.close(); save('31-pkg-check.json', out); }
for (const r of out.runs) console.log(JSON.stringify(r.path ? { vw: r.vw, p: r.path, err: r.error, tm: r.text?.translationMissing.length, raw: r.text?.rawKeys, liq: r.text?.liquidError.length, docs: r.docsLeak, ov: r.overflow, h1: r.h1, axe: r.axe?.map((a) => a.id), bad: r.badResponses } : r).slice(0, 500));
