import { chromium, ctxFor, nav, THEMES, sleep, O, pace, save } from './common.mjs';
const cand = { complete: 68442254901552, minimal: 68442255163696, hydrogen: 68442255065392, compareAt: 68442254868784, oxygen: 68442255360304, liquid: 68442255458608, multiLoc: 68442255294768, inventoryNotTracked: 68442254508336, waxSub: 68442254770480 };
const b = await chromium.launch(); const ctx = await ctxFor(b, 'desktop'); const page = await ctx.newPage(); const out = { tried: {} };
try {
  await nav(page, '/', THEMES.sartorial, 800);
  for (const [k, id] of Object.entries(cand)) {
    await pace(3000);
    const r = await page.evaluate(async (id) => { await fetch('/cart/clear.js', { method: 'POST' }); const a = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id, quantity: 3 }] }) }); const st = a.status; let j = null; try { j = await (await fetch('/cart.js')).json(); } catch {} return { st, items: j?.items?.map((i) => ({ q: i.quantity, orig: i.original_line_price, fin: i.final_line_price, disc: i.line_level_discount_allocations.map((d) => d.discount_application.title) })), cartDisc: j?.cart_level_discount_applications?.map((d) => d.title) }; }, id);
    out.tried[k] = r; console.log(k, JSON.stringify(r)); if (r.items?.some((i) => i.disc.length) || r.cartDisc?.length) { out.hit = { k, id, r }; break; }
  }
} finally {
  for (let i = 0; i < 4; i++) { await pace(3000); try { const c = await ctx.request.post(`${O}/cart/clear.js`); const g = await ctx.request.get(`${O}/cart.js`); const j = JSON.parse(await g.text()); out.cleanup = { clear: c.status(), itemCount: j.item_count }; if (j.item_count === 0) break; } catch { await sleep(20000); } }
  await b.close(); save('07b-discount-probe.json', out);
}
