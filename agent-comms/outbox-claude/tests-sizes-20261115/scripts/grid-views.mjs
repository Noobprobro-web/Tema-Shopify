// Conmutador de rejilla (2, 4, lista) en /collections/all y /collections/permanent-collection: sizes por vista, recarga con vista guardada y paginacion.
import { chromium, THEMES, newCtx, nav, save, presets, sleep } from './common.mjs';
const out = { script: 'grid-views.mjs', at: new Date().toISOString(), rows: [] };
const VPS = [[390, 844, 2], [800, 900, 2], [1280, 800, 1], [1280, 800, 2]];
const PATHS = ['/collections/all', '/collections/permanent-collection'];
async function scrollAll(page, vh) {
  for (let i = 0; i < 80; i++) { const done = await page.evaluate((s) => { window.scrollBy(0, s); return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2; }, Math.round(vh * 0.8)); await sleep(200); if (done) break; }
  await sleep(800); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}
async function collect() {
  const parse = (ss) => (ss || '').split(',').map((x) => x.trim().split(/\s+/)).filter((p) => p[1]).map((p) => ({ url: p[0], w: parseInt(p[1], 10) }));
  const sect = (el) => el.closest('recently-viewed') ? 'recently-viewed' : el.closest('product-recommendations') ? 'recommendations' : el.closest('.main-product,[class*=product-main]') ? 'main' : 'grid';
  const px = async (u) => { try { const i = new Image(); i.src = u; await i.decode(); return i.naturalWidth; } catch { return null; } };
  const imgs = [...document.querySelectorAll('.product-card img')];
  const res = [];
  for (const img of imgs) {
    const r = img.getBoundingClientRect(); const dpr = window.devicePixelRatio; const cands = parse(img.getAttribute('srcset'));
    const cur = img.currentSrc; const chosen = cands.find((c) => cur && (cur === c.url || cur.split('?')[0] + '?' + (cur.split('?')[1] || '') === c.url || c.url.includes(new URL(cur).search))) || null;
    const widthParam = cur ? Number(new URL(cur).searchParams.get('width')) || null : null; const pxW = cur ? await px(cur) : null;
    res.push({ section: sect(img), secondary: /secondary/.test(img.className) || !!img.closest('[class*=secondary]'), sizes: img.getAttribute('sizes'), loading: img.getAttribute('loading'), boxW: Math.round(r.width * 100) / 100, boxH: Math.round(r.height), needed: Math.ceil(r.width * dpr), cssNatural: img.naturalWidth, pxW, widthParam, complete: img.complete, chosenDesc: chosen ? chosen.w : null, cands: cands.map((c) => c.w), cur: cur ? cur.slice(-60) : null, srcsetN: cands.length });
  }
  return res;
}

async function check(page, vh, expectView) {
  await scrollAll(page, vh);
  const st = await page.evaluate(() => { const ul = document.querySelector('[data-product-list]'); return { view: ul?.dataset.gridColumns, pressed: [...document.querySelectorAll('[data-grid-view]')].filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.gridView), ds: ul ? { 2: ul.getAttribute('data-sizes-2'), 4: ul.getAttribute('data-sizes-4'), list: ul.getAttribute('data-sizes-list') } : null, cols: ul ? getComputedStyle(ul).gridTemplateColumns.split(' ').length : null, docX: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
  const cards = (await page.evaluate(collect)).filter((c) => c.boxW > 0 && c.complete && c.pxW > 0);
  const want = st.ds?.[st.view];
  const wrongSizes = cards.filter((c) => c.sizes !== want).length;
  const under = cards.filter((c) => c.pxW < c.needed).map((c) => ({ box: c.boxW, needed: c.needed, px: c.pxW, sizes: c.sizes }));
  return { expectView, ...st, n: cards.length, wrongSizes, underN: under.length, under: under.slice(0, 5), minMargin: cards.length ? Math.min(...cards.map((c) => c.pxW - c.needed)) : null, sample: cards[0] ? { sizes: cards[0].sizes, box: cards[0].boxW, px: cards[0].pxW, needed: cards[0].needed } : null };
}
const b = await chromium.launch();
try {
  for (const preset of presets) for (const [w, h, dpr] of VPS) {
    const ctx = await newCtx(b, w, h, { deviceScaleFactor: dpr }); const page = await ctx.newPage();
    for (const path of PATHS) {
      await nav(page, path, THEMES[preset], 600);
      for (const view of ['2', '4', 'list']) {
        const btn = page.locator(`[data-grid-view="${view}"]`).first();
        let step = 'click';
        if (!(await btn.isVisible().catch(() => false))) { out.rows.push({ preset, vp: `${w}@${dpr}`, path, step: 'click', view, skipped: 'button not visible' }); console.log(preset, `${w}@${dpr}`, path, view, 'button hidden'); }
        else { await btn.click(); await sleep(500); const r = await check(page, h, view); out.rows.push({ preset, vp: `${w}@${dpr}`, path, step: 'click', ...r }); console.log(preset, `${w}@${dpr}`, path, 'click', view, 'active', r.view, 'n', r.n, 'wrongSizes', r.wrongSizes, 'under', r.underN, 'minMargin', r.minMargin, 'cols', r.cols, 'docX', r.docX); }
        // recarga con la vista guardada
        await nav(page, path, THEMES[preset], 600);
        const stored = await page.evaluate(() => { try { return localStorage.getItem('theme:grid-columns'); } catch { return null; } });
        const r2 = await check(page, h, view); out.rows.push({ preset, vp: `${w}@${dpr}`, path, step: 'reload', stored, ...r2 }); console.log(preset, `${w}@${dpr}`, path, 'reload stored', stored, 'active', r2.view, 'n', r2.n, 'wrongSizes', r2.wrongSizes, 'under', r2.underN, 'minMargin', r2.minMargin);
      }
      // paginacion con la ultima vista guardada
      const nextHref = await page.evaluate(() => document.querySelector('.pagination a[href*="page="]')?.getAttribute('href') || null);
      if (nextHref) { await nav(page, nextHref, THEMES[preset], 600); const r3 = await check(page, h, 'saved'); out.rows.push({ preset, vp: `${w}@${dpr}`, path, step: 'page2', ...r3 }); console.log(preset, `${w}@${dpr}`, path, 'page2 active', r3.view, 'n', r3.n, 'wrongSizes', r3.wrongSizes, 'under', r3.underN, 'minMargin', r3.minMargin); }
      else { out.rows.push({ preset, vp: `${w}@${dpr}`, path, step: 'page2', skipped: 'no pagination' }); console.log(preset, path, 'no pagination'); }
      await page.evaluate(() => { try { localStorage.removeItem('theme:grid-columns'); } catch {} });
    }
    await ctx.close();
  }
} finally { await b.close(); save('03-grid-views.json', out); }
