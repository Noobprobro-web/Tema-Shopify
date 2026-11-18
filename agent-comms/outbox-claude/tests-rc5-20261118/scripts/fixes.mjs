// Reverifica de los fallos rc4: image-with-text 2 columnas, heading-order, anillo de foco del slideshow.
import { chromium, newCtx, nav, save, sleep, watch, axe, overflowX, SHOTS, shot, THEMES, presets } from './common.mjs';
import fs from 'fs';
const out = { when: new Date().toISOString(), iwt: [], headingOrder: [], focusRing: [] };
const browser = await chromium.launch();
try {
  // 1. image-with-text
  for (const preset of presets) for (const vw of [1024, 1280, 1440, 390]) {
    const ctx = await newCtx(browser, vw, 800); const page = await ctx.newPage();
    await nav(page, '/pages/std-test?view=iwt', THEMES[preset], 1200);
    const r = await page.evaluate(() => [...document.querySelectorAll('section.image-text')].map((s) => { const inner = s.querySelector('.image-text__inner'), m = s.querySelector('.image-text__media'), c = s.querySelector('.image-text__copy'); const mr = m.getBoundingClientRect(), cr = c.getBoundingClientRect(); return { heading: s.querySelector('h1,h2,h3')?.textContent.trim(), cols: getComputedStyle(inner).gridTemplateColumns, colVar: s.style.getPropertyValue('--image-text-columns'), mediaW: Math.round(mr.width), copyW: Math.round(cr.width), mediaLeft: Math.round(mr.left), copyLeft: Math.round(cr.left), sideBySide: Math.abs(mr.top - cr.top) < 80 && mr.right <= cr.left + 2 || Math.abs(mr.top - cr.top) < 80 && cr.right <= mr.left + 2, h: Math.round(s.getBoundingClientRect().height), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }; }));
    out.iwt.push({ preset, vw, sections: r });
    if (vw === 1280 && preset === 'sartorial') await page.screenshot({ path: `${SHOTS}/iwt-${preset}-1280.png`, fullPage: true });
    await ctx.close();
  }
  // 2. axe heading-order
  for (const preset of presets) for (const vw of [390, 1280]) for (const p of ['/collections/permanent-collection', '/collections/all', '/search?q=coat&type=product']) {
    const ctx = await newCtx(browser, vw, 800, vw < 600 ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {}); const page = await ctx.newPage();
    await nav(page, p, THEMES[preset], 1000);
    const a = await axe(page);
    out.headingOrder.push({ preset, vw, path: p, violations: a.violations.filter((v) => !v.targets.every((x) => /PBar/.test(x))).map((v) => ({ id: v.id, impact: v.impact, targets: v.targets })), headingOrderViolation: a.violations.some((v) => v.id === 'heading-order') });
    await ctx.close();
  }
  // 3. anillo de foco de la pista del slideshow con Tab
  for (const preset of presets) for (const vw of [1280, 390]) {
    const ctx = await newCtx(browser, vw, 800, vw < 600 ? { deviceScaleFactor: 2, hasTouch: true, isMobile: true } : {}); const page = await ctx.newPage();
    await nav(page, '/pages/std-test', THEMES[preset], 1500);
    await page.evaluate(() => document.querySelector('[data-slideshow-toggle]')?.click()); // pausa autoplay
    await page.locator('[data-slideshow-track]').scrollIntoViewIfNeeded(); await sleep(600);
    const vp = page.locator('.slideshow__viewport').first(); const box = await vp.boundingBox();
    const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.width, vw), height: Math.min(box.height, 700) };
    await page.evaluate(() => document.activeElement?.blur());
    const before = await page.screenshot({ clip });
    let reached = false;
    await page.evaluate(() => { const t = document.querySelector('[data-slideshow-track]'); const prev = [...document.querySelectorAll('a,button,[tabindex]')].filter((e) => e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING).pop(); (prev || document.body).focus(); });
    for (let i = 0; i < 6 && !reached; i++) { await page.keyboard.press('Tab'); reached = await page.evaluate(() => document.activeElement?.matches('[data-slideshow-track]')); }
    await sleep(300);
    const after = await page.screenshot({ clip });
    fs.mkdirSync(SHOTS, { recursive: true }); fs.writeFileSync(`${SHOTS}/focus-${preset}-${vw}.png`, after);
    const diff = await page.evaluate(async ({ a, b }) => { const load = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); return { d: x.getImageData(0, 0, i.width, i.height).data, w: i.width, h: i.height }; }; const A = await load(a), B = await load(b); let n = 0, edge = 0; for (let y = 0; y < A.h; y++) for (let x2 = 0; x2 < A.w; x2++) { const k = (y * A.w + x2) * 4; if (Math.abs(A.d[k] - B.d[k]) + Math.abs(A.d[k + 1] - B.d[k + 1]) + Math.abs(A.d[k + 2] - B.d[k + 2]) > 30) { n++; if (x2 < 12 || y < 12 || x2 > A.w - 12 || y > A.h - 12) edge++; } } return { changed: n, changedAtEdge: edge }; }, { a: before.toString('base64'), b: after.toString('base64') });
    const cs = await page.evaluate(() => { const v = document.querySelector('.slideshow__viewport'); const a = getComputedStyle(v, '::after'); return { content: a.content, boxShadow: a.boxShadow.slice(0, 140), supportsHas: CSS.supports('selector(:has(*))') }; });
    out.focusRing.push({ preset, vw, reachedByTab: reached, ...diff, ...cs, shot: `focus-${preset}-${vw}.png` });
    await ctx.close();
  }
} finally { await browser.close(); }
save('23-fixes-reverify.json', out);
console.log('iwt', out.iwt.filter((x) => x.vw >= 1024).map((x) => `${x.preset}/${x.vw}: ` + x.sections.map((s) => `${s.sideBySide ? 'ok' : 'NO'}(${s.mediaW}/${s.copyW})`).join(' ')).join('\n'));
console.log('heading-order', out.headingOrder.filter((x) => x.headingOrderViolation).length, 'de', out.headingOrder.length, 'otros:', out.headingOrder.filter((x) => x.violations.length && !x.headingOrderViolation).map((x) => x.preset + x.vw + x.path + JSON.stringify(x.violations.map((v) => v.id))));
console.log('focus', JSON.stringify(out.focusRing.map((f) => [f.preset, f.vw, f.reachedByTab, f.changed, f.changedAtEdge])));
