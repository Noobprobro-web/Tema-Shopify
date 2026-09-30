async (page) => {
  const ctx = page.context();
  const targets = [['contour','contour-ho5kbo9x.myshopify.com','/products/handwoven-wool-throw-natural'],['maison','maison-10oym9w0.myshopify.com','/products/wide-serving-bowl'],['annex','annex-r0zzjfjf.myshopify.com','/products/cascade-photograph']];
  const AXE = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';
  const runAxe = async (p) => {
    try {
      await p.addScriptTag({url: AXE});
      return await p.evaluate(async () => {
        const r = await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']}, resultTypes: ['violations']});
        return r.violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 3).map(n => n.target.join(' ').slice(0, 90)), s: (v.nodes[0] && v.nodes[0].any[0] && v.nodes[0].any[0].message || '').slice(0, 140)}));
      });
    } catch (e) { return 'AXE-ERR ' + e.message.slice(0, 120); }
  };
  const focusInfo = () => {
    const a = document.activeElement; if (!a || a === document.body) return 'BODY';
    const cs = getComputedStyle(a); const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
    const name = (a.getAttribute('aria-label') || a.textContent || a.value || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    const dlg = a.closest('dialog,[role=dialog],[aria-modal=true]');
    return a.tagName + (a.id ? '#' + a.id : '') + '[' + name + ']' + (ring ? '' : '{NO-RING}') + (dlg ? '{in-dialog}' : '');
  };
  const openDialogs = () => [...document.querySelectorAll('dialog[open],[role=dialog],[aria-modal=true],cart-drawer,[class*=drawer]')].filter(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 50 && r.height > 50 && cs.visibility !== 'hidden' && cs.display !== 'none' && r.right > 0 && r.left < innerWidth; }).map(e => e.tagName + '.' + String(e.className).slice(0, 40) + (e.getAttribute('aria-modal') ? '[modal]' : '') + (e.getAttribute('aria-label') ? '[' + e.getAttribute('aria-label').slice(0, 20) + ']' : ''));
  const out = {};
  for (const [key, host, pdp] of targets) {
    const p = await ctx.newPage(); const r = {};
    await p.setViewportSize({width: 1440, height: 900});
    await p.goto('https://' + host + '/', {waitUntil: 'load'}); await p.waitForTimeout(2000);
    r.axeHome = await runAxe(p);
    // keyboard: first 8 tab stops
    await p.goto('https://' + host + '/', {waitUntil: 'load'}); await p.waitForTimeout(1500);
    const tabs = []; for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(focusInfo)); }
    r.tabOrder = tabs;
    // search open
    try {
      const sBtn = p.locator('header a[href*="/search"], header button[aria-label*="earch" i], header [aria-controls*="earch" i], header summary[aria-label*="earch" i], button[aria-label*="Search" i]').first();
      await sBtn.click({timeout: 3000}); await p.waitForTimeout(800);
      const inp = p.locator('input[type=search]:visible, input[name=q]:visible').first();
      await inp.fill('lin', {timeout: 3000}); await p.waitForTimeout(1800);
      r.search = await p.evaluate(() => ({focus: document.activeElement && document.activeElement.tagName + ':' + (document.activeElement.getAttribute('role') || '') + ':' + (document.activeElement.getAttribute('aria-expanded') || ''), results: [...document.querySelectorAll('[role=option], [id*=predictive] a, [class*=predictive] a, [class*=search] a[href*="/products/"]')].filter(e => e.getBoundingClientRect().height > 0).length, listbox: !!document.querySelector('[role=listbox]'), live: [...document.querySelectorAll('[aria-live]')].map(e => e.textContent.trim().slice(0, 50)).filter(Boolean), url: location.pathname, dialogs: 0}));
      r.search.dialogs = await p.evaluate(openDialogs);
      await p.keyboard.press('Escape'); await p.waitForTimeout(500);
      r.searchAfterEsc = await p.evaluate(focusInfo);
    } catch (e) { r.search = 'ERR ' + e.message.slice(0, 100); }
    // PDP + add to cart
    if (pdp) {
      await p.goto('https://' + host + pdp, {waitUntil: 'load'}); await p.waitForTimeout(2000);
      r.axePdp = await runAxe(p);
      await p.goto('https://' + host + pdp, {waitUntil: 'load'}); await p.waitForTimeout(1500);
      try {
        const btn = p.locator('form[action*="/cart/add"] button[type=submit]:visible, form[action*="/cart/add"] [name=add]:visible, button[name=add]:visible, main button:has-text("Add to cart"):visible, main button:has-text("Add to bag"):visible').first();
        r.atcLabel = (await btn.textContent({timeout: 3000})).trim().replace(/\s+/g, ' ').slice(0, 40);
        await btn.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
        r.afterAdd = await p.evaluate(() => ({url: location.pathname}));
        r.afterAddFocus = await p.evaluate(focusInfo);
        r.afterAddDialogs = await p.evaluate(openDialogs);
        r.cartCount = await p.evaluate(async () => (await (await fetch('/cart.js')).json()).item_count);
        r.live = await p.evaluate(() => [...document.querySelectorAll('[aria-live],[role=status]')].map(e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)).filter(Boolean));
        await p.screenshot({path: '.playwright-mcp/shot-' + key + '-cart.jpg', type: 'jpeg', quality: 60});
        // trap check: tab 25 times, see if focus leaves dialog
        const trail = []; for (let i = 0; i < 25; i++) { await p.keyboard.press('Tab'); trail.push(await p.evaluate(focusInfo)); }
        r.trapLeaks = trail.filter(t => !t.includes('{in-dialog}')).length; r.trapSample = trail.slice(0, 6);
        await p.keyboard.press('Escape'); await p.waitForTimeout(700);
        r.afterEsc = {focus: await p.evaluate(focusInfo), dialogs: await p.evaluate(openDialogs)};
        // clean cart
        await p.evaluate(async () => { await fetch('/cart/clear.js', {method: 'POST'}); });
      } catch (e) { r.cart = 'ERR ' + e.message.slice(0, 140); }
    }
    // mobile menu
    await p.setViewportSize({width: 390, height: 844});
    await p.goto('https://' + host + '/', {waitUntil: 'load'}); await p.waitForTimeout(1500);
    await p.screenshot({path: '.playwright-mcp/shot-' + key + '-m-home.jpg', type: 'jpeg', quality: 60});
    r.mobileOverflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    r.smallTargets = await p.evaluate(() => [...document.querySelectorAll('header a, header button, header summary')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 24 || b.height < 24); }).map(e => (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 20) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)));
    try {
      const m = p.locator('header button[aria-label*="enu" i]:visible, header summary[aria-label*="enu" i]:visible, header [aria-controls*="enu" i]:visible, header [aria-controls*="rawer" i]:visible, header button[class*=menu]:visible, header summary:visible').first();
      await m.click({timeout: 3000}); await p.waitForTimeout(900);
      r.menu = {expanded: await m.getAttribute('aria-expanded'), focus: await p.evaluate(focusInfo), dialogs: await p.evaluate(openDialogs)};
      await p.screenshot({path: '.playwright-mcp/shot-' + key + '-m-menu.jpg', type: 'jpeg', quality: 60});
      await p.keyboard.press('Escape'); await p.waitForTimeout(600);
      r.menuAfterEsc = {focus: await p.evaluate(focusInfo), expanded: await m.getAttribute('aria-expanded')};
    } catch (e) { r.menu = 'ERR ' + e.message.slice(0, 100); }
    out[key] = r; await p.close();
  }
  return JSON.stringify(out);
}
