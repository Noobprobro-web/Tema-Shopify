// Mide sizes/srcset reales, caja renderizada, candidato elegido vs necesario y peso de imagenes. Solo lectura (GET).
// Uso: TAG=before|after [PRESETS=..] [SHOTS=dir] node measure-sizes.mjs
import { chromium, THEMES, newCtx, nav, save, presets, sleep } from './common.mjs';
const TAG = process.env.TAG || 'after';
const SHOTS = process.env.SHOTS || '';
const VPS = (process.env.VPS || '390x844@2,1280x800@1,1280x800@2').split(',').map((s) => { const [a, d] = s.split('@'); const [w, h] = a.split('x'); return { w: +w, h: +h, dpr: +d }; });
const PAGES = [['all', '/collections/all'], ['collection', '/collections/permanent-collection'], ['search', '/search?q=coat'], ['pdp', '/products/serra-coat']];
const out = { script: 'measure-sizes.mjs', tag: TAG, at: new Date().toISOString(), rows: [] };
async function scrollAll(page, vh) {
  for (let i = 0; i < 80; i++) { const done = await page.evaluate((s) => { window.scrollBy(0, s); return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2; }, Math.round(vh * 0.8)); await sleep(220); if (done) break; }
  await sleep(900); await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
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
const b = await chromium.launch();
try {
  for (const preset of presets) for (const vp of VPS) {
    const ctx = await newCtx(b, vp.w, vp.h, { deviceScaleFactor: vp.dpr }); const page = await ctx.newPage();
    const bytes = new Map(); page.on('response', async (r) => { try { const u = r.url(); if (!/\/cdn\/shop\/|cdn\.shopify\.com/.test(u) || !(r.headers()['content-type'] || '').startsWith('image/')) return; const cl = Number(r.headers()['content-length']); bytes.set(u, cl || (await r.body()).length); } catch {} });
    let handles = [];
    for (const [key, path] of PAGES) {
      if (key === 'pdp') { for (const h of handles.filter((x) => x !== 'serra-coat').slice(0, 2)) { await nav(page, '/products/' + h, THEMES[preset], 800); } }
      bytes.clear();
      const status = await nav(page, path, THEMES[preset], 700); await scrollAll(page, vp.h);
      if (key === 'all') handles = await page.evaluate(() => [...new Set([...document.querySelectorAll('.product-card a[href*="/products/"]')].map((a) => a.getAttribute('href').split('/products/')[1].split('?')[0]))]);
      if (key === 'pdp') { await sleep(1500); await scrollAll(page, vp.h); }
      const cards = await page.evaluate(collect);
      const ident = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      const total = [...bytes.values()].reduce((a, c) => a + c, 0);
      const rows = cards.filter((c) => c.boxW > 0 && c.complete && c.pxW > 0);
      const cardBytes = new Set(); const curs = await page.evaluate(() => [...document.querySelectorAll('.product-card img')].map((i) => i.currentSrc)); let cb = 0; for (const u of new Set(curs)) { if (bytes.has(u)) cb += bytes.get(u); }
      out.rows.push({ tag: TAG, preset, page: key, vp: `${vp.w}@${vp.dpr}`, status, ident, nCards: cards.length, nMeasured: rows.length, imgBytesTotal: total, imgCount: bytes.size, cardImgBytes: cb, cards });
      console.log(TAG, preset, key, `${vp.w}@${vp.dpr}`, 'st', status, ident.role, 'cards', cards.length, 'meas', rows.length, 'under', rows.filter((c) => c.pxW < c.needed).length, 'KB', Math.round(total / 1024), 'cardKB', Math.round(cb / 1024));
      if (SHOTS) {
        const sels = key === 'pdp' ? ['product-recommendations .product-card', 'recently-viewed .product-card'] : ['.product-card'];
        for (const [i, s] of sels.entries()) { const el = page.locator(s).first(); if (await el.count()) { await el.scrollIntoViewIfNeeded().catch(() => {}); await sleep(500); await page.screenshot({ path: `${SHOTS}/${TAG}-${preset}-${key}${i}-${vp.w}@${vp.dpr}.png` }).catch(() => {}); } }
      }
    }
    await ctx.close();
  }
} finally { await b.close(); save(`${TAG === 'before' ? '01-before' : '02-after'}-sizes${process.env.SUFFIX || ''}.json`, out); }
