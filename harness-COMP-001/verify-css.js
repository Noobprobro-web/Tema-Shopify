async (page) => {
  // COMP-001: S-03 y S-04 contra el DOM real de las demos, sustituyendo base.css por la version
  // local (antes/despues) servida por harness-COMP-001/serve.mjs. No cambia nada en la tienda.
  const ctx = page.context();
  const STORES = {atelier: 'sartorial-atelier.myshopify.com', edition: 'sartorial-edition.myshopify.com', archive: 'sartorial-archive.myshopify.com'};
  const CSS = {before: 'http://127.0.0.1:8765/harness-COMP-001/.before/assets/base.css', after: 'http://127.0.0.1:8765/assets/base.css'};
  const NAMES = {real: null, short: 'Nove', linea: 'LINEA NOVE', sartorial: 'Sartorial Atelier', long120: 'The Considered Objects Company for Tailoring, Leather Goods, Ceramics and Other Enduring Forms Made in Small Series Ltd', oneword: 'Aktiengesellschaftsverwaltungsgesellschaft'};
  const WIDTHS = [360, 390, 768, 1440];
  const probe = () => {
    const measure = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
      const text = el.textContent;
      // palabras partidas: los caracteres de una misma palabra en mas de una linea
      const node = el.firstChild; let broken = [];
      if (node && node.nodeType === 3) {
        let i = 0;
        for (const w of text.split(' ')) {
          if (w.length > 1) {
            const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + w.length);
            const tops = new Set([...range.getClientRects()].filter(q => q.width > 0).map(q => Math.round(q.top)));
            if (tops.size > 1) broken.push(w);
          }
          i += w.length + 1;
        }
      }
      const range = document.createRange(); range.selectNodeContents(el);
      const lines = new Set([...range.getClientRects()].filter(q => q.width > 0 && q.bottom <= r.bottom + 1).map(q => Math.round(q.top))).size;
      return {fs: cs.fontSize, lh: cs.lineHeight, w: Math.round(r.width), h: Math.round(r.height), lines, clampV: el.scrollHeight - el.clientHeight, overflowH: el.scrollWidth - el.clientWidth, broken, overflowPastParent: Math.round(r.right - el.parentElement.getBoundingClientRect().right)};
    };
    const hdr = document.querySelector('.site-header__inner');
    const brand = document.querySelector('.site-header__brand');
    const icons = document.querySelector('.site-header__actions');
    const overlap = brand && icons ? Math.round(brand.getBoundingClientRect().right - icons.getBoundingClientRect().left) : null;
    return {header: measure(document.querySelector('.site-header__brand-text')), headerH: hdr ? Math.round(hdr.getBoundingClientRect().height) : null, brandIconsOverlap: overlap, footer: measure(document.querySelector('.site-footer__title')), hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth};
  };
  const out = [];
  for (const [ver, cssUrl] of Object.entries(CSS)) {
    const p = await ctx.newPage();
    await p.route(/\/cdn\/shop\/t\/\d+\/assets\/base\.css/, async (route) => { const r = await route.fetch({url: cssUrl}); await route.fulfill({response: r}); });
    for (const [store, host] of Object.entries(STORES)) {
      for (const w of WIDTHS) {
        await p.setViewportSize({width: w, height: 900});
        await p.goto('https://' + host + '/', {waitUntil: 'load'});
        await p.evaluate(() => document.fonts.ready);
        const marker = await p.evaluate(() => [...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.selectorText === '.site-footer__title' && r.style.overflowWrap === 'break-word'); } catch (e) { return false; } }));
        for (const [nk, name] of Object.entries(NAMES)) {
          if (store !== 'atelier' && nk !== 'real') continue;
          if (name) await p.evaluate((n) => { const a = document.querySelector('.site-header__brand-text'); const b = document.querySelector('.site-footer__title'); if (a) a.textContent = n; if (b) b.textContent = n; }, name);
          await p.waitForTimeout(50);
          const m = await p.evaluate(probe);
          out.push({ver, store, w, name: nk, cssAfterLoaded: marker, ...m});
          if (ver === 'after' && store === 'atelier' && nk === 'sartorial' && (w === 390 || w === 1440)) {
            await p.locator('.site-header').screenshot({path: 'harness-COMP-001/shots/after-header-' + w + '.png'});
            await p.locator('.site-footer').screenshot({path: 'harness-COMP-001/shots/after-footer-' + w + '.png'});
          }
          if (ver === 'after' && store === 'atelier' && (nk === 'long120' || nk === 'oneword') && w === 390) {
            await p.locator('.site-header').screenshot({path: 'harness-COMP-001/shots/after-header-390-' + nk + '.png'});
          }
        }
      }
    }
    await p.close();
  }
  const f = (x) => x ? `${x.fs}/${x.h}px ${x.lines}L clampV=${x.clampV} ovH=${x.overflowH}${x.broken.length ? ' ROTA:' + x.broken.join('|') : ''}` : '-';
  return out.map((r) => `${r.ver.padEnd(6)} ${r.store.padEnd(7)} ${String(r.w).padEnd(4)} ${r.name.padEnd(9)} css=${r.cssAfterLoaded ? 'new' : 'old'} | HDR ${f(r.header)} hdrH=${r.headerH} gapIconos=${-r.brandIconsOverlap} | FTR ${f(r.footer)} | hScroll=${r.hScroll}`).join(String.fromCharCode(10));
}
