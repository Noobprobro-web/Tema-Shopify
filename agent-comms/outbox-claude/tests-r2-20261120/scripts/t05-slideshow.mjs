// 5. Slideshow: ArrowRight over a slide link keeps focus, track role/name, 120-char title no clipping, contrast on light photos.
import { chromium, ctxFor, nav, save, sleep, shot, watch, THEMES, themeConsole, SHOTS } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const SS = '[id$="__slideshow_link"]';
async function contrast(page, sel, preset, mode) {
  const res = []; const n = await page.locator(sel + ' [data-slideshow-slide]').count();
  // the sticky header and the preview bar are not part of the slide: hide them while sampling the real background
  await page.addStyleTag({ content: '#PBarNextFrameWrapper, [id^=shopify-section-header], header.site-header, .site-header, [id*=header-group], [class*=skip] { visibility: hidden !important; }' });
  for (let i = 0; i < n; i++) {
    await page.evaluate(({ s, idx }) => { document.querySelectorAll(s + ' [data-slideshow-slide]')[idx].scrollIntoView({ inline: 'start', block: 'nearest' }); }, { s: sel, idx: i }); await sleep(900);
    const info = await page.evaluate(({ s, idx }) => { const slide = document.querySelectorAll(s + ' [data-slideshow-slide]')[idx]; const els = [...slide.querySelectorAll('.eyebrow, h1, h2, h3, .rte, .rte p')].filter((e, k, a) => a.indexOf(e) === k && !(e.matches('.rte') && e.querySelector('p'))); return els.map((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { cls: String(e.className).slice(0, 30) || e.tagName, text: (e.textContent || '').trim().slice(0, 24), rect: [r.left, r.top + scrollY, r.width, r.height], color: cs.color, size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) }; }).filter((e) => e.rect[2] > 0 && e.rect[3] > 0 && e.text); }, { s: sel, idx: i });
    await page.evaluate(({ s, idx }) => { document.querySelectorAll(s + ' [data-slideshow-slide]')[idx].querySelectorAll('.eyebrow,h1,h2,h3,.rte,a.button,a').forEach((e) => { e.dataset.vis = e.style.visibility; e.style.visibility = 'hidden'; }); }, { s: sel, idx: i });
    const buf = await page.screenshot({ fullPage: true });
    await page.evaluate(({ s, idx }) => { document.querySelectorAll(s + ' [data-slideshow-slide]')[idx].querySelectorAll('.eyebrow,h1,h2,h3,.rte,a.button,a').forEach((e) => { e.style.visibility = e.dataset.vis || ''; }); }, { s: sel, idx: i });
    const dpr = await page.evaluate(() => devicePixelRatio);
    const meas = await page.evaluate(async ({ b64, picks, dpr }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
      const L = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const lf = (r, g, b) => 0.2126 * L(r) + 0.7152 * L(g) + 0.0722 * L(b);
      return picks.map((p) => { const m = p.color.match(/[\d.]+/g).map(Number); const tl = lf(m[0], m[1], m[2]); const [rx, ry, rw, rh] = p.rect; const sx = Math.max(0, Math.floor(rx * dpr)), sy = Math.max(0, Math.floor(ry * dpr)), sw = Math.min(img.width - sx, Math.floor(rw * dpr)), sh = Math.min(img.height - sy, Math.floor(rh * dpr)); if (sw < 2 || sh < 2) return { ...p, skipped: true }; const d = x.getImageData(sx, sy, sw, sh).data; const ra = []; for (let k = 0; k < d.length; k += 16) { const bl = lf(d[k], d[k + 1], d[k + 2]); ra.push((Math.max(tl, bl) + 0.05) / (Math.min(tl, bl) + 0.05)); } ra.sort((a, b2) => a - b2); const q = (f) => Math.round(ra[Math.floor(ra.length * f)] * 100) / 100; return { ...p, min: Math.round(ra[0] * 100) / 100, p5: q(0.05), median: q(0.5), bgLum: 0 }; }); }, { b64: buf.toString('base64'), picks: info, dpr });
    res.push(...meas.map((m) => { const large = m.size >= 24 || (m.size >= 18.66 && m.weight >= 700); const need = large ? 3 : 4.5; return { slide: i + 1, el: m.cls, text: m.text, size: m.size, need, min: m.min, p5: m.p5, median: m.median, pass: m.skipped ? null : m.p5 >= need }; }));
    await page.locator(sel + ' [data-slideshow-slide]').nth(i).screenshot({ path: `${SHOTS}/slideshow-${preset}-${mode}-slide${i + 1}.png` }).catch(() => {});
  }
  return res;
}
try {
  for (const preset of which) for (const mode of ['mobile', 'desktop']) {
    const ctx = await ctxFor(browser, mode); const page = await ctx.newPage(); const w = watch(page); const run = { preset, mode };
    try {
      await nav(page, '/pages/std-test', THEMES[preset], 1500);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      await page.locator(SS).first().scrollIntoViewIfNeeded(); await sleep(600);
      run.track = await page.evaluate((s) => { const t = document.querySelector(s + ' [data-slideshow-track]'); return { role: t.getAttribute('role'), roledescription: t.getAttribute('aria-roledescription'), label: t.getAttribute('aria-label'), tabindex: t.getAttribute('tabindex') }; }, SS);
      run.trackOk = !!run.track.role && !!run.track.label;
      // titulo de 120 caracteres: sin recorte
      run.clip = await page.evaluate((s) => { const root = document.querySelector(s); const slides = [...root.querySelectorAll('[data-slideshow-slide]')]; const slide = slides[0]; const h = slide.querySelector('h1,h2,h3'); const sr = slide.getBoundingClientRect(); const hr = h.getBoundingClientRect(); const cs = getComputedStyle(h); const content = slide.querySelector('[class*=slideshow__content]'); const cr = content ? content.getBoundingClientRect() : null; const vp = root.querySelector('.slideshow__viewport').getBoundingClientRect(); const eb = slide.querySelector('.eyebrow'); const ebr = eb?.getBoundingClientRect(); const btn = slide.querySelector('a.button'); const links = [...slide.querySelectorAll('.rte a')].map((a) => { const r = a.getBoundingClientRect(); return { top: Math.round(r.top - vp.top), bottom: Math.round(r.bottom - vp.top) }; });
        return { len: h.textContent.trim().length, fontSize: cs.fontSize, lineClamp: cs.webkitLineClamp, textOverflow: cs.textOverflow, headingTopInViewport: Math.round(hr.top - vp.top), headingBottomInViewport: Math.round(hr.bottom - vp.top), slideH: Math.round(sr.height), vpH: Math.round(vp.height), contentTop: cr ? Math.round(cr.top - vp.top) : null, contentBottom: cr ? Math.round(cr.bottom - vp.top) : null, eyebrowTop: ebr ? Math.round(ebr.top - vp.top) : null, headingScrollH: h.scrollHeight, headingClientH: h.clientHeight, slideScrollH: slide.scrollHeight, slideClientH: slide.clientHeight, links }; }, SS);
      const c = run.clip; run.clipOk = c.len === 120 && c.headingTopInViewport >= 0 && c.headingBottomInViewport <= c.vpH && (c.eyebrowTop == null || c.eyebrowTop >= 0) && c.links.every((l) => l.top >= 0 && l.bottom <= c.vpH);
      await page.locator(SS).first().screenshot({ path: `${SHOTS}/slideshow-${preset}-${mode}-long.png` }).catch(() => {});
      // flecha derecha sobre un enlace de la diapositiva
      const link = page.locator(SS + ' [data-slideshow-slide] .rte a').first(); await link.focus(); await sleep(300);
      const idxOf = () => page.evaluate((s) => [...document.querySelectorAll(s + ' [data-slideshow-dot]')].findIndex((x) => x.getAttribute('aria-current') === 'true'), SS);
      const i0 = await idxOf(); const act0 = await page.evaluate(() => document.activeElement.tagName + ':' + (document.activeElement.textContent || '').trim().slice(0, 20));
      await page.keyboard.press('ArrowRight'); await sleep(900);
      run.arrowOnLink = await page.evaluate(() => ({ tag: document.activeElement.tagName, text: (document.activeElement.textContent || '').trim().slice(0, 25), isBody: document.activeElement === document.body, inert: !!document.activeElement.closest('[inert]') }));
      run.arrowOnLink.slideBefore = i0; run.arrowOnLink.slideAfter = await idxOf(); run.arrowOnLink.focusBefore = act0; run.arrowOnLink.pass = !run.arrowOnLink.isBody && !run.arrowOnLink.inert;
      // foco en la pista y flecha derecha: cambia de slide y el foco queda en la pista
      await page.locator(SS + ' [data-slideshow-track]').focus(); const j0 = await idxOf(); await page.keyboard.press('ArrowRight'); await sleep(900);
      run.arrowOnTrack = { slideBefore: j0, slideAfter: await idxOf(), active: await page.evaluate(() => document.activeElement.tagName + '.' + String(document.activeElement.className).slice(0, 25)) };
      // enlace dentro de slide con autoplay activo (primera slideshow): el foco no cae a BODY al avanzar
      await page.locator('[id$="__slideshow"]').first().scrollIntoViewIfNeeded(); await sleep(600);
      const btn = page.locator('[id$="__slideshow"] [data-slideshow-slide] a.button').first(); await btn.focus(); await sleep(200);
      const tgl = page.locator('[id$="__slideshow"] [data-slideshow-toggle]').first(); const paused0 = await tgl.getAttribute('aria-label');
      await sleep(5200);
      run.autoplayWithFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, isBody: document.activeElement === document.body, text: (document.activeElement.textContent || '').trim().slice(0, 20), inInertSlide: !!document.activeElement.closest('[inert]') }));
      run.autoplayWithFocus.slideAfter = await page.evaluate(() => [...document.querySelectorAll('[id$="__slideshow"] [data-slideshow-dot]')].findIndex((x) => x.getAttribute('aria-current') === 'true'));
      run.autoplayWithFocus.togglePaused = paused0; run.autoplayWithFocus.pass = !run.autoplayWithFocus.isBody && !run.autoplayWithFocus.inInertSlide;
      // contraste sobre fotos
      await page.locator(SS).first().scrollIntoViewIfNeeded(); await sleep(500);
      run.contrast = await contrast(page, SS, preset, mode); run.contrastOk = run.contrast.every((r) => r.pass !== false);
    } catch (e) { run.error = String(e).slice(0, 500); }
    run.consoleTheme = themeConsole(w);
    out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('05-slideshow.json', out);
for (const r of out.runs) console.log(r.preset, r.mode, r.error || JSON.stringify({ track: r.track, trackOk: r.trackOk, clipOk: r.clipOk, clip: r.clip && [r.clip.contentTop, r.clip.contentBottom, r.clip.vpH, r.clip.eyebrowTop], arrowLink: r.arrowOnLink && [r.arrowOnLink.tag, r.arrowOnLink.isBody, r.arrowOnLink.pass, r.arrowOnLink.slideBefore + '>' + r.arrowOnLink.slideAfter], autoplayFocus: r.autoplayWithFocus && [r.autoplayWithFocus.tag, r.autoplayWithFocus.pass], contrastOk: r.contrastOk, minP5: r.contrast && Math.min(...r.contrast.map((x) => x.p5 ?? 99)) }));
