import { chromium, THEMES, newCtx, nav, save, presets } from './common.mjs';
const out = { script: 'probe-3d-focus.mjs (after-fix)', at: new Date().toISOString(), runs: [] };
const b = await chromium.launch();
try {
  for (const preset of presets) for (const vw of [390, 1280]) for (let rep = 1; rep <= 5; rep++) {
    const ctx = await newCtx(b, vw, vw === 390 ? 844 : 800);
    const row = { preset, vw, rep, hits: [], model: null };
    try {
      const page = await ctx.newPage();
      row.status = await nav(page, '/products/fixture-media-3d-video', THEMES[preset], 1500);
      row.model = await page.evaluate(() => [...document.querySelectorAll('model-viewer')].map((m) => { const r = m.getBoundingClientRect(); const cs = getComputedStyle(m); return { w: Math.round(r.width), h: Math.round(r.height), inert: m.inert, display: cs.display, widthCss: cs.width, minH: cs.minHeight, parentW: Math.round(m.parentElement.getBoundingClientRect().width), parentCls: m.parentElement.className, defined: !!customElements.get('model-viewer'), anyInertAnc: !!m.closest('[inert]') }; }));
      for (let i = 0; i < 45; i++) {
        await page.keyboard.press('Tab'); await page.waitForTimeout(100);
        const r = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const rc = e.getBoundingClientRect(); let inert = false, hid = false; for (let n = e; n; n = n.parentElement) { if (n.inert) inert = true; const s = getComputedStyle(n); if (s.visibility === 'hidden' || s.display === 'none') hid = true; } return { tag: e.tagName.toLowerCase(), cls: String(e.className).slice(0, 60), aria: e.getAttribute('aria-label'), w: Math.round(rc.width), h: Math.round(rc.height), inert, hid }; });
        if (r && (r.tag === 'model-viewer' || r.w < 1 || r.h < 1 || r.inert || r.hid)) row.hits.push({ step: i + 1, ...r });
      }
      row.failing = row.hits.filter((h) => h.w < 1 || h.h < 1 || h.inert || h.hid);
    } catch (e) { row.error = String(e.message).slice(0, 200); }
    out.runs.push(row); await ctx.close();
    console.log(preset, vw, rep, 'failing', row.failing?.length, 'model', JSON.stringify(row.model?.map((m) => [m.w, m.h, m.inert, m.defined])));
  }
} finally { await b.close(); save('13-3d-after-fix.json', out); }
