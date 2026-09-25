/* CLAUDE-DIRECTIVE-AUDIT-FINAL-001, Tracks 3 y 4. Sondas de solo lectura.
   Las páginas de la tienda no se pueden cargar en un iframe con src (la respuesta de error del
   marco queda en otro origen), así que se piden con fetch (GET, misma sesión de vista previa) y se
   pintan en un iframe srcdoc del ancho pedido. Las media queries responden al ancho del iframe.

   __axeRunSrcdoc(url, vw, vh): axe-core 4.10.2 (cdnjs) con las etiquetas wcag2a, wcag2aa, wcag21a,
     wcag21aa y wcag22aa, más una pasada aparte de best-practice. Se excluye la barra de vista previa
     de Shopify, que no es del tema.
   __degRun(url, vw, vh): scroll horizontal, elementos que se salen del ancho, título y número de
     líneas, estado vacío, tarjetas, marcadores de imagen ausente, paginación, variantes y medios.
   Nota: con el panel oculto, setTimeout se retrasa hasta 1 min. En la ejecución real las esperas
   se cambiaron por __frameLoad + __sleepMC (MessageChannel), definidos en cwv-proxy.js. */

window.__axeRunSrcdoc = async (url, vw, vh) => {
  const html = await fetch(url, { credentials: 'same-origin' }).then((r) => r.text());
  const frame = document.createElement('iframe');
  frame.style.cssText = `position:fixed;left:0;top:0;width:${vw}px;height:${vh}px;border:0;z-index:2147483646;background:#fff`;
  document.body.append(frame);
  frame.srcdoc = html;
  const t0 = Date.now();
  await new Promise((r) => setTimeout(r, 1500));
  while (Date.now() - t0 < 25000) {
    const d = frame.contentDocument;
    if (d && d.readyState === 'complete' && d.body && d.body.children.length) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  await new Promise((r) => setTimeout(r, 2500));
  const w = frame.contentWindow;
  const d = frame.contentDocument;
  w.eval(window.__axeSrc); // fuente de https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js
  const sels = ['#preview-bar-iframe', '#PBarNextFrameWrapper', '#preview-bar', '#shopify-section-preview-bar', '[id^="shopify-pc__banner"]'];
  const exclude = sels.filter((s) => d.querySelector(s)).map((s) => [s]);
  const ctx = { include: [d.documentElement], exclude };
  const res = await w.axe.run(ctx, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations', 'incomplete'] });
  const bp = await w.axe.run(ctx, { runOnly: { type: 'tag', values: ['best-practice'] }, resultTypes: ['violations'] });
  const out = {
    url, vw, theme: w.Shopify?.theme?.name,
    violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })),
    incomplete: res.incomplete.map((v) => `${v.id}:${v.nodes.length}`),
    bp: bp.violations.map((v) => `${v.id}(${v.impact}):${v.nodes.length}`),
    hScroll: d.documentElement.scrollWidth - d.documentElement.clientWidth,
  };
  frame.remove();
  return out;
};

window.__degRun = async (url, vw, vh) => {
  const response = await fetch(url, { credentials: 'same-origin' });
  const html = await response.text();
  const frame = document.createElement('iframe');
  frame.style.cssText = `position:fixed;left:0;top:0;width:${vw}px;height:${vh}px;border:0;z-index:2147483645;background:#fff`;
  document.body.append(frame);
  frame.srcdoc = html;
  const t0 = Date.now();
  await new Promise((r) => setTimeout(r, 1500));
  while (Date.now() - t0 < 20000) {
    const d = frame.contentDocument;
    if (d && d.readyState === 'complete' && d.body && d.body.children.length) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  await new Promise((r) => setTimeout(r, 2000));
  const w = frame.contentWindow;
  const d = frame.contentDocument;
  const vwIn = d.documentElement.clientWidth;
  const clipped = (e) => { let p = e.parentElement; while (p && p !== d.body) { if (/(auto|scroll|hidden|clip)/.test(w.getComputedStyle(p).overflowX)) return true; p = p.parentElement; } return false; };
  const overflow = [...d.querySelectorAll('main *')].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width && w.getComputedStyle(e).position !== 'fixed' && !clipped(e) && (r.right > vwIn + 1 || r.left < -1);
  }).slice(0, 5).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]}`);
  const q = (s) => d.querySelector(s);
  const txt = (s) => q(s)?.textContent.replace(/\s+/g, ' ').trim().slice(0, 90);
  const h1 = q('main h1');
  const out = {
    url, vw, status: response.status, theme: w.Shopify?.theme?.name,
    hScroll: d.documentElement.scrollWidth - vwIn, overflow,
    h1: txt('main h1'),
    h1Lines: h1 ? Math.round(h1.getBoundingClientRect().height / (parseFloat(w.getComputedStyle(h1).lineHeight) || 1)) : null,
    empty: txt('.main-blog__empty, .collection-products__empty, .cart-empty, .cart-drawer__empty, [class*="empty"]'),
    cards: d.querySelectorAll('main .product-card').length,
    placeholders: d.querySelectorAll('main .product-card__media-placeholder, main .product-gallery__placeholder').length,
  };
  frame.remove();
  return out;
};
