async (page) => {
  const ctx = page.context();
  const STORES = {
    contour: 'contour-ho5kbo9x.myshopify.com',
    maison: 'maison-10oym9w0.myshopify.com',
    annex: 'annex-r0zzjfjf.myshopify.com',
    atelier: 'sartorial-atelier.myshopify.com',
    edition: 'sartorial-edition.myshopify.com',
    archive: 'sartorial-archive.myshopify.com',
  };
  const INIT = `
    window.__v = {lcp:0, lcpEl:'', cls:0, fcp:0};
    try {
      new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__v.lcp = e.startTime; const el = e.element; window.__v.lcpEl = el ? (el.tagName + '.' + (el.className||'').toString().slice(0,60)) : ''; } }).observe({type:'largest-contentful-paint', buffered:true});
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({type:'layout-shift', buffered:true});
      new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name==='first-contentful-paint') window.__v.fcp = e.startTime; }).observe({type:'paint', buffered:true});
    } catch(e) {}
  `;
  const METRICS = () => {
    const q = (s) => [...document.querySelectorAll(s)];
    const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
    const res = performance.getEntriesByType('resource');
    const nav = performance.getEntriesByType('navigation')[0] || {};
    const sum = (f, k='transferSize') => Math.round(res.filter(f).reduce((a, r) => a + (r[k] || 0), 0) / 1024);
    const isJS = r => r.initiatorType === 'script' || /\.js(\?|$)/.test(r.name);
    const isCSS = r => /\.css(\?|$)/.test(r.name);
    const isFont = r => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name);
    const isImg = r => r.initiatorType === 'img' || /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/.test(r.name);
    const hosts = [...new Set(res.map(r => new URL(r.name).host))].filter(h => h !== location.host && !/shopify|shopifycdn|shopifysvc/.test(h));
    const themeAssets = res.filter(r => /\/cdn\/shop\/t\/\d+\/assets\//.test(r.name)).map(r => ({f: r.name.split('/assets/')[1].split('?')[0], kb: Math.round((r.decodedBodySize||0)/1024), tkb: Math.round((r.transferSize||0)/1024)}));
    const accName = (el) => (el.getAttribute('aria-label') || '').trim() || (el.getAttribute('aria-labelledby') ? 'lb' : '') || (el.textContent || '').trim() || (el.getAttribute('title') || '') || (el.querySelector('img[alt]:not([alt=""]), svg title') ? 'img' : '') || (el.value || '');
    const btnNoName = q('button, a[href], [role=button]').filter(el => vis(el) && !accName(el)).map(el => el.outerHTML.slice(0, 120));
    const ids = q('[id]').map(e => e.id); const dupIds = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
    const inputsNoLabel = q('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea').filter(el => vis(el) && !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('title')).map(el => el.outerHTML.slice(0, 120));
    const imgs = q('img');
    const ce = [...new Set(q('*').map(e => e.localName).filter(n => n.includes('-') && customElements.get(n)))];
    const ld = q('script[type="application/ld+json"]').map(s => { try { const j = JSON.parse(s.textContent); return [].concat(j).map(x => x['@type']).join(','); } catch (e) { return 'INVALID'; } });
    const h = q('h1,h2,h3,h4,h5,h6').filter(vis).map(e => e.tagName + ':' + e.textContent.trim().replace(/\s+/g, ' ').slice(0, 50));
    const sections = q('[id^="shopify-section"]').map(s => { const id = s.id.replace(/^shopify-section-(template--\d+__|sections--\d+__)?/, ''); return id.replace(/_[A-Za-z0-9]{6}$/, ''); });
    const root = getComputedStyle(document.documentElement);
    let rootVars = 0; for (let i = 0; i < root.length; i++) if (root[i].startsWith('--')) rootVars++;
    const bodyCS = getComputedStyle(document.body);
    const h1 = document.querySelector('h1'); const h1CS = h1 ? getComputedStyle(h1) : null;
    const headBlockingJS = q('head script[src]').filter(s => !s.defer && !s.async && s.type !== 'module').map(s => s.src.split('/').pop().split('?')[0]);
    return {
      url: location.pathname + location.search, title: document.title,
      theme: window.Shopify && Shopify.theme ? Shopify.theme.schema_name + ' ' + Shopify.theme.schema_version + ' (' + Shopify.theme.name + ')' : null,
      lang: document.documentElement.lang, metaDesc: (document.querySelector('meta[name=description]') || {}).content || null,
      og: !!document.querySelector('meta[property="og:image"]'), canonical: !!document.querySelector('link[rel=canonical]'),
      vitals: Object.assign({}, window.__v || {}, {ttfb: Math.round(nav.responseStart || 0), dcl: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0)}),
      weight: {htmlKB: Math.round((nav.transferSize||0)/1024), htmlDecodedKB: Math.round((nav.decodedBodySize||0)/1024), jsKB: sum(isJS), jsDecodedKB: sum(isJS,'decodedBodySize'), cssKB: sum(isCSS), cssDecodedKB: sum(isCSS,'decodedBodySize'), fontKB: sum(isFont), imgKB: sum(isImg), totalKB: sum(() => true) + Math.round((nav.transferSize||0)/1024), requests: res.length + 1, jsFiles: res.filter(isJS).length, cssFiles: res.filter(isCSS).length, fontFiles: res.filter(isFont).length},
      thirdPartyHosts: hosts, themeAssets, headBlockingJS,
      dom: {nodes: document.getElementsByTagName('*').length, depth: (() => { let m = 0; const w = (n, d) => { if (d > m) m = d; for (const c of n.children) w(c, d + 1); }; w(document.body, 1); return m; })()},
      sections, customElements: ce,
      a11y: {
        h1: q('h1').length, headings: h.slice(0, 40), skipLink: !!q('a[href^="#"]').find(a => /skip|saltar|main|contenido/i.test(a.textContent + a.className)),
        landmarks: {header: q('header,[role=banner]').length, nav: q('nav,[role=navigation]').length, main: q('main,[role=main]').length, footer: q('footer,[role=contentinfo]').length},
        imgs: imgs.length, imgNoAlt: imgs.filter(i => !i.hasAttribute('alt')).length, imgEmptyAlt: imgs.filter(i => i.getAttribute('alt') === '').length,
        btnNoName: btnNoName.length, btnNoNameSample: btnNoName.slice(0, 5), dupIds: dupIds.slice(0, 10), dupIdCount: dupIds.length, inputsNoLabel: inputsNoLabel.slice(0, 5),
        ariaLive: q('[aria-live]').length, dialogs: q('dialog,[role=dialog]').length,
      },
      images: {lazy: imgs.filter(i => i.loading === 'lazy').length, eager: imgs.filter(i => i.loading !== 'lazy').length, fetchHigh: imgs.filter(i => i.getAttribute('fetchpriority') === 'high').length, srcset: imgs.filter(i => i.srcset).length, sizesAttr: imgs.filter(i => i.sizes).length, noDims: imgs.filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length, preloads: q('link[rel=preload]').map(l => (l.as || '') + ':' + l.href.split('/').pop().split('?')[0].slice(0, 50))},
      design: {rootVars, bodyFont: bodyCS.fontFamily.slice(0, 80), bodySize: bodyCS.fontSize, bodyColor: bodyCS.color, bodyBg: bodyCS.backgroundColor, h1Font: h1CS ? h1CS.fontFamily.slice(0, 80) : null, h1Size: h1CS ? h1CS.fontSize : null, h1Weight: h1CS ? h1CS.fontWeight : null, h1Transform: h1CS ? h1CS.textTransform : null, fonts: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, '') + ' ' + f.weight + (f.style !== 'normal' ? ' ' + f.style : '')))].slice(0, 20)},
      jsonld: ld,
      links: {collections: [...new Set(q('a[href*="/collections/"]').map(a => new URL(a.href).pathname).filter(p => /^\/collections\/[^/]+$/.test(p)))].slice(0, 12), products: [...new Set(q('a[href*="/products/"]').map(a => new URL(a.href).pathname.replace(/^\/collections\/[^/]+/, '')).filter(p => /^\/products\/[^/]+$/.test(p)))].slice(0, 8)},
    };
  };

  const which = (globalThis.__which || Object.keys(STORES));
  const out = {};
  for (const key of which) {
    const host = STORES[key];
    const p = await ctx.newPage();
    await p.addInitScript(INIT);
    await p.setViewportSize({width: 1440, height: 900});
    const r = {};
    // home
    await p.goto('https://' + host + '/', {waitUntil: 'load'}); await p.waitForTimeout(2500);
    r.home = await p.evaluate(METRICS);
    // collection: prefer /collections/all then first nav collection
    const coll = r.home.links.collections.find(c => c !== '/collections/all') || '/collections/all';
    await p.goto('https://' + host + coll, {waitUntil: 'load'}); await p.waitForTimeout(2000);
    r.collection = await p.evaluate(METRICS);
    r.collection.extra = await p.evaluate(() => {
      const q = s => [...document.querySelectorAll(s)];
      return {
        productCards: new Set(q('a[href*="/products/"]').map(a => new URL(a.href).pathname.replace(/^\/collections\/[^/]+/, ''))).size,
        filterForm: !!document.querySelector('form[id*=Facet], form[id*=facet], form[class*=facet], form[class*=filter], [class*=facets] form, facet-filters-form, [data-filters]'),
        filterInputs: q('input[name^="filter."]').length, sort: !!document.querySelector('select[name=sort_by], [name=sort_by]'),
        pagination: !!document.querySelector('[class*=paginat], nav[aria-label*=agin], a[href*="page=2"]'),
        quickAdd: q('button, a').filter(b => /quick|rápid|add to cart|añadir/i.test((b.textContent||'') + (b.getAttribute('aria-label')||'') + b.className)).length,
        swatches: q('[class*=swatch]').length,
      };
    });
    // product
    const prod = r.collection.links.products[0] || r.home.links.products[0];
    if (prod) {
      await p.goto('https://' + host + prod, {waitUntil: 'load'}); await p.waitForTimeout(2500);
      r.product = await p.evaluate(METRICS);
      r.product.extra = await p.evaluate(() => {
        const q = s => [...document.querySelectorAll(s)];
        const form = document.querySelector('form[action*="/cart/add"]');
        return {
          variantRadios: q('input[type=radio][name*="ption"], variant-selects input[type=radio], fieldset input[type=radio]').length,
          variantSelects: q('select[name*="ption"], select[name=id], variant-selects select').length,
          fieldsets: q('fieldset').length, legends: q('fieldset legend').length,
          media: q('[class*=media] img, [class*=gallery] img').length, videos: q('video, iframe[src*=youtube], iframe[src*=vimeo], model-viewer').length,
          zoom: q('[class*=zoom], [data-zoom], [aria-label*=oom]').length,
          qty: !!document.querySelector('input[name=quantity]'), atc: !!(form && form.querySelector('[type=submit]')),
          dynamicCheckout: !!document.querySelector('.shopify-payment-button, shopify-accelerated-checkout, [data-shopify=payment-button]'),
          installments: !!document.querySelector('shopify-payment-terms'), pickup: !!document.querySelector('[class*=pickup]'),
          recommendations: !!document.querySelector('product-recommendations, [class*=recommendation], [data-url*=recommendations]'),
          sticky: q('[class*=sticky]').filter(e => /atc|cart|buy|add/i.test(e.className)).length,
          accordions: q('details').length, share: !!document.querySelector('[class*=share]'),
          breadcrumbs: !!document.querySelector('nav[aria-label*=read], [class*=breadcrumb]'),
          sizeGuide: q('a,button').some(e => /size guide|guía de tallas|size chart/i.test(e.textContent)),
          reviews: !!document.querySelector('[class*=review], [class*=rating]'),
          priceEl: (document.querySelector('[class*=price]') || {}).textContent?.trim().replace(/\s+/g, ' ').slice(0, 60),
          productTitle: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 80),
        };
      });
    }
    // search
    await p.goto('https://' + host + '/search?q=a&type=product', {waitUntil: 'load'}); await p.waitForTimeout(1500);
    r.search = await p.evaluate(() => ({results: new Set([...document.querySelectorAll('a[href*="/products/"]')].map(a => new URL(a.href).pathname)).size, h1: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 80)}));
    // 404
    const resp = await p.goto('https://' + host + '/pages/zz-no-existe-404', {waitUntil: 'load'});
    r.notFound = await p.evaluate(() => ({h1: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 80), links: document.querySelectorAll('main a').length}));
    r.notFound.status = resp ? resp.status() : null;
    out[key] = r;
    await p.close();
  }
  return JSON.stringify(out);
}
