// Slide 2 (titulo largo) a 1280x800: ¿el contenido se sale del slide? (el eyebrow y el titulo quedan por encima del borde)
import { chromium, newCtx, nav, save, sleep, THEMES, presets } from './common.mjs';
const browser = await chromium.launch(); const out = [];
try { for (const preset of presets) { for (const [w, h] of [[1280, 800], [1440, 900], [1024, 768]]) {
  const ctx = await newCtx(browser, w, h); const page = await ctx.newPage();
  await nav(page, '/pages/std-test', THEMES[preset], 1200);
  const r = await page.evaluate(() => { const slides = [...document.querySelectorAll('[data-slideshow-slide]')]; return slides.map((s, i) => { const sr = s.getBoundingClientRect(); const els = [...s.querySelectorAll('.eyebrow,h1,h2,h3,.rte,a.button')].map((e) => e.getBoundingClientRect()); const top = Math.min(...els.map((r) => r.top)), bot = Math.max(...els.map((r) => r.bottom)); const cs = getComputedStyle(s); return { i: i + 1, slideH: Math.round(sr.height), contentH: Math.round(bot - top), contentTopMinusSlideTop: Math.round(top - sr.top), contentBotMinusSlideBot: Math.round(bot - sr.bottom), overflow: cs.overflow, headingPx: parseFloat(getComputedStyle(s.querySelector('h1,h2,h3')).fontSize) }; }); });
  out.push({ preset, vw: w, vh: h, slides: r }); await ctx.close(); } } } finally { await browser.close(); }
save('22-slide-clip.json', out);
for (const o of out) console.log(o.preset, o.vw, JSON.stringify(o.slides.map((s) => [s.i, s.slideH, s.contentH, s.contentTopMinusSlideTop, s.contentBotMinusSlideBot, s.headingPx])));
