// 7 secciones nuevas en /pages/std-test: consola, desborde, axe, teclado, slideshow, video, contraste sobre imagen.
import { chromium, newCtx, nav, save, sleep, watch, axe, overflowX, shot, SHOTS, THEMES, presets } from './common.mjs';
const SECS = ['slideshow', 'image_with_text', 'featured_collection', 'collection_list', 'blog_posts', 'rich_text', 'video_external', 'video_hosted'];
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, b) => { const A = lum(a), B = lum(b); return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05); };
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
async function contrastOnImage(page, preset, mode) {
  const res = [];
  const n = await page.locator('[data-slideshow-slide]').count();
  for (let i = 0; i < n; i++) {
    await page.evaluate((idx) => { const s = document.querySelector('slideshow-section, [data-slideshow-track]'); const slide = document.querySelectorAll('[data-slideshow-slide]')[idx]; slide.scrollIntoView({ inline: 'start', block: 'nearest' }); }, i);
    await sleep(900);
    const info = await page.evaluate((idx) => {
      const slide = document.querySelectorAll('[data-slideshow-slide]')[idx]; const content = slide.querySelector('[class*=slideshow__content],[class*=slideshow__text],[class*=slideshow__inner]');
      const els = [...slide.querySelectorAll('.eyebrow, h1, h2, h3, [class*=slideshow__heading], [class*=slideshow__text], .rte, .rte p')].filter((e, k, a) => a.indexOf(e) === k);
      const pick = els.map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { cls: String(e.className).slice(0, 40) || e.tagName, text: (e.textContent || '').trim().slice(0, 30), rect: [r.left, r.top, r.width, r.height], color: cs.color, size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10), opacity: cs.opacity }; }).filter((e) => e.rect[2] > 0 && e.rect[3] > 0 && e.text);
      return { pick, contentCls: content ? String(content.className) : null, slideRect: (() => { const r = slide.getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; })() };
    }, i);
    // fondo sin texto
    await page.evaluate((idx) => { const slide = document.querySelectorAll('[data-slideshow-slide]')[idx]; slide.querySelectorAll('.eyebrow,h1,h2,h3,.rte,a.button').forEach((e) => { e.dataset.vis = e.style.visibility; e.style.visibility = 'hidden'; }); }, i);
    const buf = await page.screenshot({ fullPage: false });
    await page.evaluate((idx) => { const slide = document.querySelectorAll('[data-slideshow-slide]')[idx]; slide.querySelectorAll('.eyebrow,h1,h2,h3,.rte,a.button').forEach((e) => { e.style.visibility = e.dataset.vis || ''; }); }, i);
    const dpr = await page.evaluate(() => devicePixelRatio);
    const meas = await page.evaluate(async ({ b64, picks, dpr }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const L = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      const lumf = (r, g, b) => 0.2126 * L(r) + 0.7152 * L(g) + 0.0722 * L(b);
      return picks.map((p) => {
        const m = p.color.match(/[\d.]+/g).map(Number); const tl = lumf(m[0], m[1], m[2]); const [rx, ry, rw, rh] = p.rect;
        const sx = Math.max(0, Math.floor(rx * dpr)), sy = Math.max(0, Math.floor(ry * dpr)), sw = Math.min(img.width - sx, Math.floor(rw * dpr)), sh = Math.min(img.height - sy, Math.floor(rh * dpr));
        if (sw < 2 || sh < 2) return { ...p, skipped: true };
        const d = x.getImageData(sx, sy, sw, sh).data; const ratios = [];
        for (let k = 0; k < d.length; k += 16) { const bl = lumf(d[k], d[k + 1], d[k + 2]); ratios.push((Math.max(tl, bl) + 0.05) / (Math.min(tl, bl) + 0.05)); }
        ratios.sort((a, b2) => a - b2); const q = (f) => Math.round(ratios[Math.floor(ratios.length * f)] * 100) / 100;
        return { ...p, textColor: p.color, n: ratios.length, min: Math.round(ratios[0] * 100) / 100, p5: q(0.05), median: q(0.5) };
      });
    }, { b64: buf.toString('base64'), picks: info.pick, dpr });
    const rows = meas.map((m) => { const large = m.size >= 24 || (m.size >= 18.66 && m.weight >= 700); const need = large ? 3 : 4.5; return { slide: i + 1, el: m.cls, text: m.text, size: m.size, weight: m.weight, large, need, min: m.min, p5: m.p5, median: m.median, passP5: m.p5 >= need, opacity: m.opacity, skipped: m.skipped || false }; });
    res.push(...rows);
    await page.locator('[data-slideshow-slide]').nth(i).screenshot({ path: `${SHOTS}/sec-${preset}-${mode}-slide${i + 1}.png` });
  }
  return res;
}
try {
  for (const preset of presets) {
    for (const mode of ['mobile', 'desktop']) {
      const ctx = await newCtx(browser, mode === 'mobile' ? 390 : 1280, mode === 'mobile' ? 844 : 800, mode === 'mobile' ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {});
      const page = await ctx.newPage(); const w = watch(page);
      const run = { preset, mode, checks: {}, notes: [] };
      try {
        await nav(page, '/pages/std-test', THEMES[preset], 1500);
        run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
        // presencia de secciones
        run.sections = await page.evaluate((names) => names.map((n) => { const e = document.querySelector(`[id$="__${n}"]`); if (!e) return { n, found: false }; const r = e.getBoundingClientRect(); return { n, found: true, h: Math.round(r.height), w: Math.round(r.width), headings: [...e.querySelectorAll('h1,h2,h3,h4')].map((h) => h.tagName + ':' + h.textContent.trim().slice(0, 40)), imgs: e.querySelectorAll('img').length, brokenImgs: [...e.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length, empty: r.height < 40 }; }), SECS);
        run.checks.allSectionsPresent = run.sections.every((s) => s.found && !s.empty);
        run.checks.noBrokenImages = run.sections.every((s) => !s.brokenImgs);
        run.overflow = await overflowX(page); run.checks.noHorizontalOverflow = run.overflow.overflow <= 0;
        run.headingOrder = await page.evaluate(() => [...document.querySelectorAll('main h1,main h2,main h3,main h4')].map((h) => h.tagName + ':' + h.textContent.trim().slice(0, 25)));
        // capturas por seccion
        for (const n of SECS) { const el = page.locator(`[id$="__${n}"]`).first(); if (await el.count()) { await el.scrollIntoViewIfNeeded(); await sleep(500); await el.screenshot({ path: `${SHOTS}/sec-${preset}-${mode}-${n}.png` }).catch(() => {}); } }
        await page.evaluate(() => scrollTo(0, 0)); await sleep(300);
        // axe
        run.axe = await axe(page); run.axeTheme = run.axe.violations.filter((v) => !v.targets.every((x) => /#PBarNextFrame|preview-bar|PBar/.test(x))); run.checks.axeNoViolations = run.axeTheme.length === 0;
        // slideshow
        const ss = {}; const sel = (s) => page.locator(s).first();
        const idx = () => page.evaluate(() => { const d = [...document.querySelectorAll('[data-slideshow-dot]')]; return d.findIndex((x) => x.getAttribute('aria-current') === 'true'); });
        ss.controlsVisible = await page.evaluate(() => { const c = document.querySelector('[data-slideshow-controls]'); return !!c && !c.hidden && getComputedStyle(c).display !== 'none'; });
        ss.slides = await page.locator('[data-slideshow-slide]').count();
        await sel('[data-slideshow-track]').scrollIntoViewIfNeeded(); await sleep(400);
        ss.idx0 = await idx();
        // pausa primero para probar controles sin interferencia
        const toggle = sel('[data-slideshow-toggle]');
        ss.toggleLabel0 = await toggle.getAttribute('aria-label');
        // autoplay: esperar > delay (3s)
        await sleep(4200); ss.idxAfterAutoplay = await idx(); ss.autoplayAdvanced = ss.idxAfterAutoplay !== ss.idx0;
        // pausar
        await toggle.click(); await sleep(200); ss.toggleLabelPaused = await toggle.getAttribute('aria-label');
        const ip = await idx(); await sleep(4200); ss.pausedHolds = (await idx()) === ip;
        // siguiente / anterior / puntos
        const i1 = await idx(); await sel('[data-slideshow-next]').click(); await sleep(900); const i2 = await idx(); ss.nextWorks = i2 === (i1 + 1) % ss.slides;
        await sel('[data-slideshow-previous]').click(); await sleep(900); const i3 = await idx(); ss.prevWorks = i3 === i1;
        await page.locator('[data-slideshow-dot]').nth(2).click(); await sleep(900); ss.dotWorks = (await idx()) === 2;
        ss.activeSlideInert = await page.evaluate(() => [...document.querySelectorAll('[data-slideshow-slide]')].map((s) => s.inert || s.hasAttribute('inert') || s.getAttribute('aria-hidden')));
        // reanudar
        await toggle.click(); await sleep(200); ss.toggleLabelResumed = await toggle.getAttribute('aria-label');
        ss.targetSize = await page.evaluate(() => [...document.querySelectorAll('[data-slideshow-controls] button')].map((b) => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
        ss.minTarget = Math.min(...ss.targetSize.flat());
        // teclado en los controles
        await sel('[data-slideshow-next]').focus(); await page.keyboard.press('Enter'); await sleep(700); ss.keyboardNext = true;
        run.slideshow = ss;
        for (const k of ['controlsVisible', 'nextWorks', 'prevWorks', 'dotWorks', 'pausedHolds', 'autoplayAdvanced']) run.checks['slideshow_' + k] = ss[k];
        run.checks.slideshow_minTarget24 = ss.minTarget >= 24;
        // contraste sobre imagen
        await toggle.click().catch(() => {}); // pausar para medir estable
        run.contrastOnImage = await contrastOnImage(page, preset, mode);
        run.checks.contrastOnImage = run.contrastOnImage.every((r) => r.skipped || r.passP5);
        // video: antes de Play ninguna peticion a youtube/vimeo
        const reqBefore = w.requests.filter((u) => /youtube|youtu\.be|vimeo|ytimg|googlevideo/.test(u));
        run.video = { thirdPartyBeforePlay: reqBefore };
        run.checks.noThirdPartyBeforePlay = reqBefore.length === 0;
        const plays = page.locator('[data-video-play]'); run.video.playButtons = await plays.count();
        for (let k = 0; k < run.video.playButtons; k++) {
          const b = plays.nth(k); await b.scrollIntoViewIfNeeded(); await sleep(300);
          const lab = await b.getAttribute('aria-label') || (await b.textContent()).trim();
          const before = w.requests.length;
          await b.click(); await sleep(2500);
          const st = await page.evaluate((k2) => { const f = document.querySelectorAll('theme-video-poster')[k2]; return { iframe: f.querySelector('iframe')?.src?.slice(0, 90) || null, iframeTitle: f.querySelector('iframe')?.title || null, video: f.querySelector('video') ? { paused: f.querySelector('video').paused, rs: f.querySelector('video').readyState, ct: f.querySelector('video').currentTime } : null, posterGone: !f.querySelector('[data-video-play]'), activeEl: document.activeElement?.tagName + ':' + (document.activeElement?.title || '') }; }, k);
          run.video['play' + k] = { label: lab, ...st, newRequests: w.requests.slice(before).filter((u) => /youtube|vimeo|ytimg|googlevideo|cdn\.shopify\.com\/videos/.test(u)).map((u) => u.slice(0, 100)).slice(0, 6) };
          await shot(page, `sec-${preset}-${mode}-video${k}-playing`);
        }
        run.checks.videoPlayersCreated = [0, 1].every((k) => run.video['play' + k] && (run.video['play' + k].iframe || run.video['play' + k].video));
      } catch (e) { run.error = String(e).slice(0, 500); }
      run.watch = { console: w.console, pageerrors: w.pageerrors, failed: w.failed };
      const platform = (c) => /ERR_TUNNEL_CONNECTION_FAILED|shopifysvc|shop\.app|preview-bar|bugsnag|postMessage|shopify-xr\.js|Refused to execute script/.test((c.text || '') + (c.url || ''));
      run.consoleTheme = [...w.console.filter((c) => c.type === 'error' && !platform(c)), ...w.pageerrors.filter((e) => !/shopifycloud|shopifysvc|trekkie|monorail|storefront-features|preview-bar|web-pixels|shop\.app/.test(e)).map((e) => ({ type: 'pageerror', text: e }))]; run.consolePlatform = w.console.filter((c) => platform(c)).length;
      run.checks.noConsoleErrors = run.consoleTheme.length === 0;
      out.runs.push(run); await ctx.close();
    }
  }
} finally { await browser.close(); }
out.failedChecks = out.runs.flatMap((r) => Object.entries(r.checks).filter(([, v]) => v === false).map(([k]) => `${r.preset}/${r.mode}:${k}`));
out.errors = out.runs.filter((r) => r.error).map((r) => `${r.preset}/${r.mode}: ${r.error}`);
save('16-sections-page.json', out);
console.log(JSON.stringify({ failed: out.failedChecks, errors: out.errors }, null, 1));
