import { chromium, THEMES, newCtx, nav, save, presets } from './common.mjs';
const out = { script: 'probe-14-featured-3d.mjs', at: new Date().toISOString(), template: 'templates/index.c14fp.json (/?view=c14fp)', runs: [] };
const b = await chromium.launch();
try {
  for (const preset of presets) for (const vw of [390, 1280]) {
    const ctx = await newCtx(b, vw, vw === 390 ? 844 : 800);
    const row = { preset, vw, sections: [], tabHits: [] };
    try {
      const page = await ctx.newPage();
      row.status = await nav(page, '/?view=c14fp', THEMES[preset], 1500);
      row.sections = await page.evaluate(() => [...document.querySelectorAll('section.featured-product')].map((s) => {
        const med = [...s.querySelectorAll('.featured-product__media')].map((f) => {
          const fr = f.getBoundingClientRect(); const m = f.querySelector('model-viewer'); const v = f.querySelector('video'); const i = f.querySelector('img');
          const el = m || v || i; const r = el ? el.getBoundingClientRect() : null; const cs = m ? getComputedStyle(m) : null;
          return { kind: m ? 'model' : v ? 'video' : i ? 'image' : 'other', figW: Math.round(fr.width), figH: Math.round(fr.height), w: r && Math.round(r.width), h: r && Math.round(r.height), ratio: r && r.height ? +(r.width / r.height).toFixed(3) : null,
            aspect: cs?.aspectRatio, minH: cs?.minHeight, wrapW: m ? Math.round(m.parentElement.getBoundingClientRect().width) : null, wrapCls: m ? m.parentElement.className : null, defined: m ? !!customElements.get('model-viewer') : null };
        });
        const ph = s.querySelector('.featured-product__placeholder'); const pr = ph?.getBoundingClientRect();
        return { id: s.dataset.sectionId, media: med, placeholder: pr ? { w: Math.round(pr.width), h: Math.round(pr.height) } : null, docOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      }));
      for (let i = 0; i < 70; i++) {
        await page.keyboard.press('Tab'); await page.waitForTimeout(80);
        const r = await page.evaluate(() => { const e = document.activeElement; if (!e || !e.closest || !e.closest('.featured-product__media')) return null; const rc = e.getBoundingClientRect(); const cs = getComputedStyle(e); let inert = false, hid = false; for (let n = e; n; n = n.parentElement) { if (n.inert) inert = true; const s = getComputedStyle(n); if (s.visibility === 'hidden' || s.display === 'none') hid = true; } return { tag: e.tagName.toLowerCase(), w: Math.round(rc.width), h: Math.round(rc.height), focusVisible: e.matches(':focus-visible'), outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineOffset: cs.outlineOffset, inert, hid, sec: e.closest('section.featured-product')?.dataset.sectionId }; });
        if (r) row.tabHits.push({ step: i + 1, ...r });
      }
      row.failing = row.tabHits.filter((h) => h.w < 1 || h.h < 1 || h.inert || h.hid || ((h.tag === 'model-viewer' || h.tag === 'video') && (h.outlineStyle === 'none' || h.outlineWidth === '0px')));
    } catch (e) { row.error = String(e.message).slice(0, 200); }
    out.runs.push(row); await ctx.close();
    console.log(preset, vw, 'failing', row.failing?.length, 'tabHits', row.tabHits.length, JSON.stringify(row.sections.map((s) => s.media.map((m) => [m.kind, m.w, m.h]))));
  }
} finally { await b.close(); save('14-featured-3d.json', out); }
