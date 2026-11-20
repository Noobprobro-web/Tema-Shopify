// 4. Video: 0 third-party requests before Play; Shift+Tab from the next link reaches the player after Play.
import { chromium, ctxFor, nav, save, sleep, shot, watch, THEMES, themeConsole } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const SECS = ['video_external', 'video_hosted', 'video_poster', 'video_yt_poster'];
const TP = /youtube|youtu\.be|vimeo|ytimg|googlevideo|ggpht|doubleclick/;
try {
  for (const preset of which) for (const mode of ['mobile', 'desktop']) {
    const ctx = await ctxFor(browser, mode); const page = await ctx.newPage(); const w = watch(page); const run = { preset, mode, videos: {} };
    try {
      await nav(page, '/pages/std-test', THEMES[preset], 1500);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      run.thirdPartyBeforePlay = w.requests.filter((u) => TP.test(u));
      // desplazarse por todos los videos sin pulsar Play
      for (const s of SECS) { await page.locator(`[id$="__${s}"]`).first().scrollIntoViewIfNeeded(); await sleep(400); }
      run.thirdPartyAfterScrollNoPlay = w.requests.filter((u) => TP.test(u));
      for (const s of SECS) {
        const sel = `[id$="__${s}"]`; const v = {};
        await page.locator(sel).first().scrollIntoViewIfNeeded(); await sleep(300);
        v.poster = await page.evaluate((q) => { const r = document.querySelector(q); const img = r.querySelector('[data-video-poster] img'); return { hasImg: !!img, loaded: img ? img.complete && img.naturalWidth > 0 : null, src: img?.currentSrc?.slice(0, 90) || null }; }, sel);
        const before = w.requests.length;
        const btn = page.locator(sel + ' [data-video-play]').first(); await btn.focus({ timeout: 5000 }); await page.keyboard.press('Enter'); await sleep(2500);
        v.created = await page.evaluate((q) => { const r = document.querySelector(q); const f = r.querySelector('iframe'); const vd = r.querySelector('video'); return { iframe: f?.src?.slice(0, 80) || null, iframeTitle: f?.title || null, video: !!vd, controls: vd?.controls ?? null, activeTag: document.activeElement?.tagName, activeInside: r.contains(document.activeElement) }; }, sel);
        v.newThirdParty = w.requests.slice(before).filter((u) => TP.test(u)).map((u) => u.slice(0, 80)).slice(0, 4);
        // foco al player: si no esta dentro, enfocarlo (iframe/video) para simular Tab desde dentro
        const player = page.locator(sel + ' iframe, ' + sel + ' video').first();
        await player.focus({ timeout: 3000 }).catch(() => {});
        await page.keyboard.press('Tab'); await sleep(300);
        v.afterTab = await page.evaluate((q) => { const e = document.activeElement; return { tag: e.tagName, text: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30), insideVideo: document.querySelector(q).contains(e) }; }, sel);
        await page.keyboard.press('Shift+Tab'); await sleep(300);
        v.afterShiftTab = await page.evaluate((q) => { const e = document.activeElement; const r = document.querySelector(q); return { tag: e.tagName, title: e.title || null, insideVideo: r.contains(e), isPlayer: ['IFRAME', 'VIDEO'].includes(e.tagName) }; }, sel);
        v.pass = v.afterShiftTab.isPlayer || v.afterShiftTab.insideVideo;
        // y desde el enlace posterior real: ir al siguiente enfocable fuera del bloque y Shift+Tab
        const nextLinkOk = await page.evaluate((q) => { const r = document.querySelector(q); const all = [...document.querySelectorAll('a[href],button,input,select,textarea,summary,iframe,video[controls],[tabindex]')].filter((x) => !x.disabled && x.tabIndex >= 0 && x.getClientRects().length); const after = all.find((e) => !r.contains(e) && (r.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING)); if (!after) return null; after.focus(); return (after.getAttribute('aria-label') || after.textContent || after.tagName).trim().slice(0, 40); }, sel);
        await sleep(200); await page.keyboard.press('Shift+Tab'); await sleep(300);
        v.fromNextLink = { nextLink: nextLinkOk, landed: await page.evaluate((q) => { const e = document.activeElement; return { tag: e.tagName, insideVideo: document.querySelector(q).contains(e), name: (e.getAttribute('aria-label') || e.title || e.textContent || '').trim().slice(0, 30) }; }, sel) };
        v.fromNextLink.pass = v.fromNextLink.landed.insideVideo;
        await shot(page, `video-${preset}-${mode}-${s}`);
        run.videos[s] = v;
      }
    } catch (e) { run.error = String(e).slice(0, 500); }
    run.consoleTheme = themeConsole(w);
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('04-video.json', out);
for (const r of out.runs) console.log(r.preset, r.mode, r.error || `tpBefore=${r.thirdPartyBeforePlay.length}/${r.thirdPartyAfterScrollNoPlay.length}`, Object.entries(r.videos || {}).map(([k, v]) => `${k}:created=${v.created.iframe ? 'iframe' : v.created.video ? 'video' : 'none'} sTab=${v.afterShiftTab.tag}/${v.pass} next=${v.fromNextLink.pass}(${v.fromNextLink.landed.tag})`).join(' | '));
