async (page) => {
  const ctx = page.context();
  const S = [['contour','contour-ho5kbo9x.myshopify.com','/collections/living'],['maison','maison-10oym9w0.myshopify.com','/collections/serving-tea'],['annex','annex-r0zzjfjf.myshopify.com','/collections/limited-editions'],['atelier','sartorial-atelier.myshopify.com','/collections/all'],['edition','sartorial-edition.myshopify.com','/collections/all'],['archive','sartorial-archive.myshopify.com','/collections/all']];
  const AXE = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
  const out = {};
  for (const [k, h, coll] of S) {
    const p = await ctx.newPage();
    await p.setViewportSize({width: 1440, height: 900});
    await p.goto('https://' + h + '/', {waitUntil: 'load'}); await p.waitForTimeout(2500);
    await p.screenshot({path: '.playwright-mcp/shot-' + k + '-d-fold.jpg', type: 'jpeg', quality: 60});
    // scroll through to trigger lazy/animations then full page
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(1200);
    await p.screenshot({path: '.playwright-mcp/shot-' + k + '-d-full.jpg', type: 'jpeg', quality: 45, fullPage: true});
    const r = {height: await p.evaluate(() => document.body.scrollHeight)};
    if (['atelier', 'edition', 'archive'].includes(k)) {
      await p.addScriptTag({url: AXE});
      r.axeHome = await p.evaluate(async () => (await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']}, resultTypes: ['violations']})).violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 3).map(n => n.target.join(' ').slice(0, 90)), s: (v.nodes[0] && v.nodes[0].any[0] && v.nodes[0].any[0].message || '').slice(0, 140)})));
      await p.goto('https://' + h + '/', {waitUntil: 'load'}); await p.waitForTimeout(1500);
      const tabs = []; for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none'); return a.tagName + '[' + (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) + ']' + (ring ? '' : '{NO-RING}'); })); }
      r.tabOrder = tabs;
    }
    await p.goto('https://' + h + coll, {waitUntil: 'load'}); await p.waitForTimeout(2000);
    await p.screenshot({path: '.playwright-mcp/shot-' + k + '-d-coll.jpg', type: 'jpeg', quality: 60});
    await p.setViewportSize({width: 390, height: 844});
    await p.goto('https://' + h + '/', {waitUntil: 'load'}); await p.waitForTimeout(1500);
    await p.screenshot({path: '.playwright-mcp/shot-' + k + '-m-home.jpg', type: 'jpeg', quality: 60});
    r.mOverflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    try {
      const m = p.locator('button[aria-label*="menu" i]:visible, summary[aria-label*="menu" i]:visible, [aria-controls*="enu" i]:visible, [aria-controls*="rawer" i]:visible').first();
      await m.click({timeout: 3000}); await p.waitForTimeout(900);
      r.menu = await p.evaluate(() => { const a = document.activeElement; return {focus: a.tagName + '[' + (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 25) + ']', inDialog: !!a.closest('dialog,[role=dialog],[aria-modal=true]'), modal: [...document.querySelectorAll('[aria-modal=true],dialog[open]')].filter(e => e.getBoundingClientRect().width > 0).length}; });
      await p.screenshot({path: '.playwright-mcp/shot-' + k + '-m-menu.jpg', type: 'jpeg', quality: 60});
      const leaks = []; for (let i = 0; i < 20; i++) { await p.keyboard.press('Tab'); leaks.push(await p.evaluate(() => !!document.activeElement.closest('dialog,[role=dialog],[aria-modal=true]'))); }
      r.menuTrapLeaks = leaks.filter(x => !x).length;
      await p.keyboard.press('Escape'); await p.waitForTimeout(600);
      r.menuEsc = await p.evaluate(() => { const a = document.activeElement; return a.tagName + '[' + (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 25) + ']'; });
    } catch (e) { r.menu = 'ERR ' + e.message.slice(0, 90); }
    out[k] = r; await p.close();
  }
  return JSON.stringify(out);
}
