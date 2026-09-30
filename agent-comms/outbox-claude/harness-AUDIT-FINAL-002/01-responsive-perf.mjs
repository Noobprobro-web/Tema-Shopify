// Eje 2 + Eje 3: overflow horizontal, atributos LCP, CLS, consola y red, por tienda x página x viewport.
import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from './lib.mjs';

const VIEWPORTS = [
  { name: '375', width: 375, height: 667, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: true },
  { name: '1440', width: 1440, height: 900, mobile: false },
];

const ALLOWED_HOSTS = [/\.myshopify\.com$/, /(^|\.)shopify\.com$/, /(^|\.)shopifycdn\.com$/, /(^|\.)shopifysvc\.com$/, /(^|\.)shopifycloud\.com$/, /(^|\.)shop\.app$/, /(^|\.)shopifyapps\.com$/];

const INIT = () => {
  window.__cwv = { shifts: [], lcp: null };
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__cwv.shifts.push({
          t: Math.round(e.startTime),
          v: e.value,
          src: (e.sources || []).slice(0, 3).map((s) => {
            const n = s.node;
            if (!n || n.nodeType !== 1) return '(text/removed)';
            return n.localName + (n.id ? '#' + n.id : '') + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
          }),
        });
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      const e = list.getEntries().pop();
      const n = e.element;
      window.__cwv.lcp = {
        t: Math.round(e.startTime),
        size: e.size,
        url: (e.url || '').split('?')[0].split('/').pop(),
        el: n ? n.localName + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.') : '') : null,
        fetchpriority: n && n.getAttribute ? n.getAttribute('fetchpriority') : null,
        loading: n && n.getAttribute ? n.getAttribute('loading') : null,
      };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}
};

function clsScore(shifts) {
  // Ventanas de sesión estándar (gap 1 s, máx 5 s).
  let max = 0, cur = 0, start = 0, last = -Infinity;
  for (const s of shifts) {
    if (s.t - last > 1000 || s.t - start > 5000) { cur = 0; start = s.t; }
    cur += s.v; last = s.t;
    if (cur > max) max = cur;
  }
  return +max.toFixed(4);
}

const MEASURE = () => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== document.body && p !== de; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) return true;
      if (cs.position === 'fixed') return false;
    }
    return false;
  };
  const offenders = [];
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 0.5 || r.left < -0.5) {
      if (clipped(el)) continue;
      if (cs.position === 'fixed' && (r.left >= vw || r.right <= 0)) continue; // drawers fuera de lienzo
      offenders.push({ el: el.localName + (el.id ? '#' + el.id : '') + '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.'), l: Math.round(r.left), r: Math.round(r.right), pos: cs.position });
    }
  }
  const imgs = [...document.querySelectorAll('img')];
  const foldY = window.innerHeight;
  const imgInfo = imgs.map((i) => {
    const r = i.getBoundingClientRect();
    return {
      top: Math.round(r.top + window.scrollY),
      vis: r.width > 0 && r.height > 0,
      loading: i.getAttribute('loading'),
      fp: i.getAttribute('fetchpriority'),
      srcset: !!i.getAttribute('srcset'),
      sizes: i.getAttribute('sizes'),
      wh: !!(i.getAttribute('width') && i.getAttribute('height')),
      alt: i.getAttribute('alt'),
      src: (i.currentSrc || i.src || '').split('?')[0].split('/').pop(),
      inHero: !!i.closest('editorial-hero, .hero, [class*="hero"]'),
    };
  });
  const hero = imgInfo.filter((i) => i.inHero);
  return {
    vw,
    innerWidth: window.innerWidth,
    scrollWidth: de.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    htmlOverflowX: getComputedStyle(de).overflowX,
    bodyOverflowX: getComputedStyle(document.body).overflowX,
    offenders: offenders.slice(0, 8),
    offenderCount: offenders.length,
    hero,
    imgTotal: imgs.length,
    eager: imgInfo.filter((i) => i.loading !== 'lazy').length,
    eagerBelowFold: imgInfo.filter((i) => i.vis && i.loading !== 'lazy' && i.top > foldY * 1.5).map((i) => i.src + '@' + i.top),
    lazyAboveFold: imgInfo.filter((i) => i.vis && i.loading === 'lazy' && i.top < foldY * 0.6).map((i) => i.src + '@' + i.top),
    highPriority: imgInfo.filter((i) => i.fp === 'high').map((i) => i.src),
    noDims: imgInfo.filter((i) => !i.wh).map((i) => i.src),
    noAltAttr: imgInfo.filter((i) => i.alt === null).map((i) => i.src),
    noSrcset: imgInfo.filter((i) => i.vis && !i.srcset).map((i) => i.src),
    blockingScripts: [...document.querySelectorAll('head script[src]')].filter((s) => !s.defer && !s.async && s.type !== 'module').map((s) => s.src.split('?')[0]),
    stylesheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => new URL(l.href).host + '/' + l.href.split('?')[0].split('/').pop()),
    fontPreloads: [...document.querySelectorAll('link[rel="preload"]')].map((l) => l.as + ':' + l.href.split('?')[0].split('/').pop()),
    fontDisplay: [...document.styleSheets].flatMap((s) => { try { return [...s.cssRules]; } catch (e) { return []; } }).filter((r) => r.constructor.name === 'CSSFontFaceRule').map((r) => r.style.getPropertyValue('font-family') + ':' + r.style.getPropertyValue('font-display')),
  };
};

const out = [];
const only = process.argv[2];
const JSONL = new URL('./results-01-responsive-perf' + (only ? '-' + only : '') + '.jsonl', import.meta.url);
fs.writeFileSync(JSONL, '');
const line = (r) => r.error ? r.store + ' ' + r.vp + ' ' + r.path + ' ERROR ' + r.error : r.store.padEnd(8) + ' ' + r.vp.padEnd(5) + ' ' + r.path.padEnd(52) + ' ' + r.status + ' ovf=' + r.overflow.load + '/' + r.overflow.end + ' off=' + r.overflow.offenderCount + ' CLS=' + r.clsLoad + '/' + r.clsTotal + ' LCP=' + (r.lcp ? r.lcp.t + 'ms ' + r.lcp.el + ' fp=' + r.lcp.fetchpriority + ' ld=' + r.lcp.loading : '-') + ' ext=' + r.external.length + ' con=' + r.console.length + ' fail=' + r.failed.length;
const emit = (r) => { out.push(r); fs.appendFileSync(JSONL, JSON.stringify(r) + '\n'); console.log(line(r)); };
const browser = await launch();
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const paths = ['/', '/collections/all', '/collections', ...store.products.map((h) => '/products/' + h), '/cart', '/search?q=a', '/pages/this-does-not-exist'];
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1 });
    await context.addInitScript(INIT);
    await unlock(context, store.url);
    for (const p of paths) {
      const page = await context.newPage();
      const logs = [];
      const hosts = new Map();
      const failed = [];
      attachConsole(page, logs);
      page.on('request', (r) => { try { const h = new URL(r.url()).host; if (h) hosts.set(h, (hosts.get(h) || 0) + 1); } catch (e) {} });
      page.on('response', (r) => { if (r.status() >= 400 && !(p.includes('does-not-exist') && r.url().includes('does-not-exist'))) failed.push(r.status() + ' ' + r.url().slice(0, 140)); });
      let status = 0;
      try {
        const resp = await page.goto(store.url + p, { waitUntil: 'load', timeout: 60000 });
        status = resp.status();
        await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
        const atLoad = await page.evaluate(MEASURE);
        const cwvLoad = await page.evaluate(() => JSON.parse(JSON.stringify(window.__cwv)));
        // Recorrido completo para disparar lazy/reveal y medir CLS de scroll.
        await page.evaluate(async () => {
          const h = () => document.documentElement.scrollHeight;
          for (let y = 0; y < h(); y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
          window.scrollTo(0, h());
          await new Promise((r) => setTimeout(r, 600));
        });
        const atEnd = await page.evaluate(MEASURE);
        const cwvEnd = await page.evaluate(() => JSON.parse(JSON.stringify(window.__cwv)));
        const external = [...hosts.keys()].filter((h) => !ALLOWED_HOSTS.some((re) => re.test(h)));
        emit({
          store: name, path: p, vp: vp.name, status,
          overflow: { load: atLoad.scrollWidth - atLoad.vw, end: atEnd.scrollWidth - atEnd.vw, vw: atLoad.vw, sw: atLoad.scrollWidth, swEnd: atEnd.scrollWidth, htmlOX: atLoad.htmlOverflowX, bodyOX: atLoad.bodyOverflowX, offenders: atEnd.offenders, offenderCount: atEnd.offenderCount },
          lcp: cwvLoad.lcp,
          clsLoad: clsScore(cwvLoad.shifts), clsTotal: clsScore(cwvEnd.shifts),
          shiftTop: cwvEnd.shifts.sort((a, b) => b.v - a.v).slice(0, 3).map((s) => ({ v: +s.v.toFixed(4), t: s.t, src: s.src })),
          hero: atLoad.hero,
          img: { total: atLoad.imgTotal, eager: atLoad.eager, eagerBelowFold: atLoad.eagerBelowFold, lazyAboveFold: atLoad.lazyAboveFold, high: atLoad.highPriority, noDims: atLoad.noDims, noAltAttr: atLoad.noAltAttr, noSrcset: atLoad.noSrcset },
          head: { blockingScripts: atLoad.blockingScripts, stylesheets: atLoad.stylesheets, preloads: atLoad.fontPreloads, fontDisplay: [...new Set(atLoad.fontDisplay)] },
          hosts: [...hosts.keys()], external,
          console: logs, failed,
        });
      } catch (e) {
        emit({ store: name, path: p, vp: vp.name, status, error: String(e.message).slice(0, 200) });
      }
      await page.close();
    }
    await context.close();
  }
}
await browser.close();
