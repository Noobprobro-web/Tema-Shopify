/* CLAUDE-DIRECTIVE-AUDIT-FINAL-001, Track 2. Sonda de CLS y LCP por proxy (versión final).
   Con el panel del navegador oculto Chrome no pinta: no emite paint, largest-contentful-paint ni
   layout-shift, y retrasa los temporizadores hasta 1 min. Esta sonda:
   - carga la página real (GET) en un iframe srcdoc del mismo origen, con un rastreador inyectado
     al principio del <head>;
   - mide la geometría de todo lo visible en cada evento que puede mover el diseño (carga de cada
     imagen, hoja o script, fuentes, mutaciones del DOM, DOMContentLoaded, load, scroll);
   - cuenta un desplazamiento solo si el elemento se movió respecto a la ventana Y respecto al
     documento, así el scroll no cuenta y los elementos fijos tampoco;
   - puntúa con la fórmula de Chrome (fracción de impacto x fracción de distancia) y suma sin
     ventanas de sesión: es una cota superior;
   - empieza a contar cuando base.css está cargada (antes Chrome no pinta).
   Las esperas usan MessageChannel porque setTimeout se retrasa en páginas ocultas.
   Control positivo: imagen sin dimensiones sobre un párrafo -> p y42->399, CLS~0.0502. */

window.__sleepMC = (ms) => new Promise((resolve) => {
  const ch = new MessageChannel(); const t = performance.now();
  ch.port1.onmessage = () => { if (performance.now() - t >= ms) { ch.port1.close(); resolve(); } else ch.port2.postMessage(0); };
  ch.port2.postMessage(0);
});
window.__frameLoad = (frame, maxMs) => new Promise((resolve) => {
  let done = false;
  frame.addEventListener('load', () => { if (!done) { done = true; resolve('load'); } }, { once: true });
  window.__sleepMC(maxMs).then(() => { if (!done) { done = true; resolve('timeout'); } });
});

window.__cwvTracker = function tracker() {
  const S = (window.__cls = { score: 0, shifts: [], snaps: 0, started: false, startAt: null, fontsDone: 0, scrolls: [] });
  let prev = new Map(); let prevSY = 0; let prevSX = 0;
  const SEL = 'header, nav, main, section, footer, h1, h2, h3, h4, p, a, button, img, picture, video, svg, input, select, label, li, span, form, dl, dt, dd, [class*="card"], [class*="price"]';
  const CELL = 8;
  const inVp = (a) => a.x < innerWidth && a.x + a.w > 0 && a.y < innerHeight && a.y + a.h > 0;
  const snap = (reason) => {
    if (!S.started || !document.body) return;
    S.snaps += 1;
    const sy = scrollY; const sx = scrollX; const dsy = sy - prevSY; const dsx = sx - prevSX;
    if (dsy || dsx) S.scrolls.push(`${reason}@${Math.round(performance.now())}: ${prevSY}->${sy}`);
    const next = new Map(); const moved = []; let maxDist = 0;
    for (const el of document.querySelectorAll(SEL)) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cur = { x: r.left, y: r.top, w: r.width, h: r.height };
      next.set(el, cur);
      const p = prev.get(el);
      if (!p) continue;
      const vdx = cur.x - p.x; const vdy = cur.y - p.y; const ddx = vdx + dsx; const ddy = vdy + dsy;
      const movedV = Math.abs(vdx) >= 1 || Math.abs(vdy) >= 1;
      const movedD = Math.abs(ddx) >= 1 || Math.abs(ddy) >= 1;
      if (movedV && movedD && (inVp(p) || inVp(cur))) {
        moved.push([p, cur, el]);
        maxDist = Math.max(maxDist, Math.min(Math.max(Math.abs(vdx), Math.abs(vdy)), Math.max(Math.abs(ddx), Math.abs(ddy))));
      }
    }
    prev = next; prevSY = sy; prevSX = sx;
    if (!moved.length) return;
    const cols = Math.ceil(innerWidth / CELL); const rows = Math.ceil(innerHeight / CELL);
    const grid = new Uint8Array(cols * rows); let count = 0;
    const mark = (a) => {
      const x0 = Math.max(0, Math.floor(a.x / CELL)); const x1 = Math.min(cols, Math.ceil((a.x + a.w) / CELL));
      const y0 = Math.max(0, Math.floor(a.y / CELL)); const y1 = Math.min(rows, Math.ceil((a.y + a.h) / CELL));
      for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) { const i = y * cols + x; if (!grid[i]) { grid[i] = 1; count += 1; } }
    };
    moved.forEach(([a, b]) => { mark(a); mark(b); });
    const s = (count / (cols * rows)) * Math.min(1, maxDist / Math.max(innerWidth, innerHeight));
    S.score += s;
    const label = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className || '').split(' ')[0]}`;
    S.shifts.push({ reason, t: Math.round(performance.now()), s: +s.toFixed(4), n: moved.length,
      top: moved.slice(0, 3).map(([a, b, el]) => `${label(el)} y${Math.round(a.y)}->${Math.round(b.y)} x${Math.round(a.x)}->${Math.round(b.x)}`) });
  };
  let queued = false;
  const schedule = (reason) => { if (queued) return; queued = true; queueMicrotask(() => { queued = false; snap(reason); }); };
  const start = () => { if (S.started) return; S.started = true; S.startAt = Math.round(performance.now()); snap('start'); };
  const watchCss = (link) => {
    if (!/base\.css/.test(link.href || '')) return;
    if (link.sheet) { try { link.sheet.cssRules; start(); return; } catch (e) { /* aún cargando */ } }
    link.addEventListener('load', () => { start(); }, { once: true });
  };
  new MutationObserver((list) => {
    for (const m of list) m.addedNodes.forEach((n) => { if (n.tagName === 'LINK') watchCss(n); });
    schedule('mutation');
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'src', 'srcset'] });
  document.addEventListener('load', (e) => snap('load:' + (e.target.tagName || '').toLowerCase()), true);
  document.addEventListener('DOMContentLoaded', () => snap('dcl'));
  window.addEventListener('load', () => snap('window-load'));
  window.addEventListener('scroll', () => snap('scroll'), { passive: true });
  if (document.fonts) document.fonts.addEventListener('loadingdone', () => { S.fontsDone += 1; snap('fonts'); });
  let ticks = 0;
  const iv = setInterval(() => { snap('tick'); ticks += 1; if (ticks > 20) clearInterval(iv); }, 1000);
};

// Carga url en un iframe srcdoc de vw x vh y devuelve CLS proxy, candidato a LCP y recursos bloqueantes.
window.__cwvRun = async (url, vw, vh) => {
  const html = await fetch(url, { credentials: 'same-origin' }).then((r) => r.text());
  const inject = `<script>(${window.__cwvTracker.toString()})()<\/script>`;
  const doc = html.replace(/<head([^>]*)>/i, (m) => `${m}${inject}`);
  document.querySelectorAll('iframe[data-cwv]').forEach((f) => f.remove());
  const frame = document.createElement('iframe');
  frame.dataset.cwv = '';
  frame.style.cssText = `position:fixed;left:0;top:0;width:${vw}px;height:${vh}px;border:0;z-index:2147483647;background:#fff`;
  document.body.append(frame);
  const loaded = window.__frameLoad(frame, 25000);
  frame.srcdoc = doc;
  const how = await loaded;
  await window.__sleepMC(4000);
  const w = frame.contentWindow; const d = frame.contentDocument; const S = w.__cls || {};
  const clip = (r) => Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
  const sy = w.scrollY; w.scrollTo(0, 0);
  let best = null;
  d.querySelectorAll('img, video, h1, h2, h3, p, [class*="heading"]').forEach((el) => {
    const r = el.getBoundingClientRect(); const cs = w.getComputedStyle(el);
    if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
    const a = clip(r); if (a > 0 && (!best || a > best.a)) best = { el, a };
  });
  let lcp = null;
  if (best) {
    const el = best.el; const src = el.currentSrc || el.poster || '';
    lcp = { tag: el.tagName.toLowerCase(), cls: String(el.className).split(' ')[0], areaPct: +(best.a / (vw * vh) * 100).toFixed(1),
      loading: el.getAttribute('loading'), fetchpriority: el.getAttribute('fetchpriority'),
      srcWidth: src ? new URL(src, location.href).searchParams.get('width') : null, renderedW: Math.round(el.getBoundingClientRect().width) };
  }
  const blocking = w.performance.getEntriesByType('resource').filter((e) => e.renderBlockingStatus === 'blocking').map((e) => new URL(e.name).pathname.split('/').pop());
  const lazyAtf = [...d.querySelectorAll('img[loading="lazy"]')].filter((i) => { const r = i.getBoundingClientRect(); return r.width && r.top < vh && r.bottom > 0 && r.left < vw; }).length;
  const noDims = [...d.querySelectorAll('img')].filter((i) => !(i.getAttribute('width') && i.getAttribute('height'))).length;
  const out = { url: url.replace(location.origin, ''), vw, vh, how, theme: w.Shopify?.theme?.name, clsProxy: +(S.score || 0).toFixed(4),
    finalScrollY: sy, scrolls: (S.scrolls || []).slice(0, 5), shifts: (S.shifts || []).slice(0, 6), lcp, blocking, lazyAtf, imgsSinDimensiones: noDims,
    shopifyXr: !!d.querySelector('script[src*="shopify-xr"]') };
  frame.remove();
  return out;
};
// Uso: se lanza en cola y se consulta después, porque cada llamada de la herramienta corta a los 45 s.
// const pages = ['/', '/collections/the-permanent-collection', '/products/serra-coat'];
// for (const t of [165809488115, 166186909939, 166186942707, 166187041011]) for (const [w, h] of [[1280, 800], [375, 812], [360, 780]])
//   for (const p of pages) rows.push(await __cwvRun(`${p}?preview_theme_id=${t}`, w, h));
// Aviso: no lanzar dos colas a la vez. La cookie de vista previa se comparte y una carga puede devolver otro tema
// (pasó una vez: Archive 375 Home devolvió Couture; se repitió sola).
