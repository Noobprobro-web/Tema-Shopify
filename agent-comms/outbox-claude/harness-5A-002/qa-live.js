// Sprint 5A, Compuerta 5. Pegar en la consola de la colección de la tienda (o con javascript_tool).
// Carga axe-core 4.10.2 desde cdnjs y deja window.qa con tres mediciones:
//   qa.targets()  áreas interactivas de tarjeta, panel y filtros: menores de 44x44, solapes y desborde.
//   qa.axe()      axe-core con WCAG 2.0/2.1/2.2 A y AA más best-practice.
//   qa.card(h)    tarjeta cuyo enlace contiene el handle h.
await new Promise((res, rej) => { if (window.axe) return res(); const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js'; s.onload = res; s.onerror = () => rej(new Error('axe load failed')); document.head.appendChild(s); });
window.qa = {
  vis: (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && e.getClientRects().length > 0; },
  targets(scope = document) {
    const sel = '.product-card [data-card-swatch], .product-card a.card-swatch, .product-card .card-swatch-more, .product-card__action .button, .product-card__action button, .product-card__action a, [data-quick-buy-panel][open] button, .facet__swatch-value, .facet__value';
    const els = [...scope.querySelectorAll(sel)].filter(qa.vis);
    const rows = els.map((e) => { const r = e.getBoundingClientRect(); return { el: e, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, r, label: (e.getAttribute('aria-label') || e.textContent).trim().replace(/\s+/g, ' ').slice(0, 28), kind: e.matches('[data-card-swatch], a.card-swatch') ? 'swatch' : e.matches('.card-swatch-more') ? 'more' : e.closest('[data-quick-buy-panel]') ? 'panel' : e.matches('.facet__swatch-value') ? 'facet-swatch' : e.matches('.facet__value') ? 'facet' : 'action' }; });
    const small = rows.filter((x) => x.w < 44 - 0.01 || x.h < 44 - 0.01);
    const overlaps = [];
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) { const a = rows[i].r, b = rows[j].r; const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left); const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ix > 0.5 && iy > 0.5 && !rows[i].el.contains(rows[j].el) && !rows[j].el.contains(rows[i].el)) overlaps.push([rows[i].label, rows[j].label, Math.round(ix), Math.round(iy)]); }
    const byKind = {}; rows.forEach((x) => { const k = byKind[x.kind] ||= { n: 0, minW: 1e9, minH: 1e9 }; k.n++; k.minW = Math.min(k.minW, x.w); k.minH = Math.min(k.minH, x.h); });
    return { total: rows.length, byKind, small: small.map((x) => [x.kind, x.label, x.w, x.h]), overlaps, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  },
  async axe(ctx = document) { const r = await axe.run(ctx, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, resultTypes: ['violations'] }); return r.violations.map((v) => ({ id: v.id, impact: v.impact, tags: v.tags.filter((t) => t.startsWith('wcag') || t === 'best-practice').join(','), n: v.nodes.length, target: v.nodes.slice(0, 2).map((n) => n.target.join(' ')) })); },
  card: (h) => document.querySelector(`.product-card a[href*="${h}"]`)?.closest('.product-card'),
};
