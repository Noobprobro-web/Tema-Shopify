// Que landmarks (region con nombre) comparten nombre en /pages/std-test (explica landmark-unique tras el PR #20).
import { chromium, newCtx, nav, save, THEMES } from './common.mjs';
const browser = await chromium.launch(); const out = {};
try {
  for (const preset of ['sartorial', 'pkg']) {
    const ctx = await newCtx(browser, 1280, 800); const page = await ctx.newPage();
    await nav(page, '/pages/std-test', THEMES[preset], 1000);
    out[preset] = await page.evaluate(() => {
      const sel = 'section[aria-label],section[aria-labelledby],[role=region][aria-label],[role=region][aria-labelledby],aside,nav[aria-label],[role=complementary],[role=navigation],form[aria-label],[role=form],[role=search]';
      const items = [...document.querySelectorAll(sel)].map((e) => { let name = e.getAttribute('aria-label'); const lb = e.getAttribute('aria-labelledby'); if (!name && lb) name = lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent.trim()).join(' '); return { tag: e.tagName.toLowerCase(), role: e.getAttribute('role'), name, cls: String(e.className).slice(0, 50), section: e.closest('[id^=shopify-section]')?.id.split('__').pop() }; });
      const by = {}; for (const i of items) { const k = (i.role || i.tag) + '|' + i.name; (by[k] ||= []).push(i.section || i.cls); }
      return { items, duplicates: Object.entries(by).filter(([, v]) => v.length > 1).map(([k, v]) => ({ k, where: v })) };
    });
    await ctx.close();
  }
} finally { await browser.close(); }
save('21-landmarks.json', out);
for (const [p, v] of Object.entries(out)) console.log(p, JSON.stringify(v.duplicates));
