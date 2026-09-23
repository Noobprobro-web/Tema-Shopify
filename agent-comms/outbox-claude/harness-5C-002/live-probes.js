/* 5C-002. Sondas que se ejecutaron en la tienda viva (consola del navegador, 1280 x 800,
   DPR 1,25, con ?preview_theme_id=<id>). Solo leen el DOM; no cambian nada de la tienda.
   Uso: pegar el archivo en la consola y llamar a las funciones en el orden de cada apartado del
   informe. El teclado se pulsa de verdad (Tab, Enter, Escape, ArrowDown); estas funciones solo
   miden lo que queda despues. */

// 1. CLS: acumulado desde la carga (buffered) y desde que se instala el observador.
window.probeCLS = () => {
  window.__cls = { load: 0, after: 0, installed: performance.now() };
  new PerformanceObserver((list) => list.getEntries().forEach((e) => {
    if (e.hadRecentInput) return;
    if (e.startTime < window.__cls.installed) window.__cls.load += e.value;
    else window.__cls.after += e.value;
  })).observe({ type: 'layout-shift', buffered: true });
  return 'observando';
};

// 2. Panel y tarjetas 4:5 del desplegable abierto: caja, proporcion, copia elegida y bytes.
window.probePanel = () => {
  const d = document.querySelector('.desktop-nav theme-disclosure[data-open]');
  if (!d) return 'ningun desplegable abierto';
  const p = d.querySelector('[data-disclosure-panel]').getBoundingClientRect();
  const cards = [...d.querySelectorAll('.mega-menu__promo-image')].map((img) => {
    const b = img.getBoundingClientRect();
    const aspect = img.getAttribute('width') / img.getAttribute('height');
    const painted = aspect > 0.8 ? b.height * aspect : b.width;
    const entry = performance.getEntriesByName(img.currentSrc)[0];
    return {
      box: `${Math.round(b.width)}x${Math.round(b.height)}`,
      ratio: +(b.width / b.height).toFixed(3),
      sourceAspect: +aspect.toFixed(3),
      paintedCssPx: Math.round(painted),
      neededDevicePx: Math.round(painted * devicePixelRatio),
      chosen: new URL(img.currentSrc).searchParams.get('width'),
      sizes: img.sizes,
      complete: img.complete,
      transferSize: entry ? entry.transferSize : null,
    };
  });
  const small = [...d.querySelectorAll('[data-disclosure-panel] a')].filter((a) => a.getBoundingClientRect().height < 44).length;
  return { panel: [p.left, p.top, p.right, p.bottom].map(Math.round), cards, anchorsUnder44: small, hscroll: document.documentElement.scrollWidth > innerWidth, cls: window.__cls };
};

// 3. Foco tapado (WCAG 2.4.11). Antes de pulsar Tab: scroll instantaneo, porque con la pestana
//    en segundo plano el scroll suave no avanza y el rectangulo mediria la posicion de antes.
window.probeObscuredSetup = () => { document.documentElement.style.scrollBehavior = 'auto'; return 'ok'; };
window.probeObscured = () => {
  const a = document.activeElement;
  const b = a.getBoundingClientRect();
  const covered = [...document.querySelectorAll('[data-disclosure-panel]')]
    .filter((p) => !p.hidden && !p.contains(a))
    .map((p) => {
      const q = p.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, q.right) - Math.max(b.left, q.left));
      const h = Math.max(0, Math.min(b.bottom, q.bottom) - Math.max(b.top, q.top));
      return Math.round((w * h * 100) / Math.max(1, b.width * b.height));
    });
  const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
  return {
    focused: (a.getAttribute('aria-label') || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
    inHeader: !!a.closest('.site-header'),
    coveredPct: Math.max(0, ...covered),
    centreHits: a === hit || a.contains(hit) ? 'target' : hit?.closest('[data-disclosure-panel]') ? 'panel' : hit?.tagName,
    open: document.querySelectorAll('.desktop-nav theme-disclosure[data-open]').length,
  };
};

// 4. Rejilla de la ficha de producto: que hijos ocupan celda y donde cae la ficha.
window.probePDP = () => {
  const L = document.querySelector('.product-main__layout');
  const cs = getComputedStyle(L);
  const g = document.querySelector('product-gallery').getBoundingClientRect();
  const d = document.querySelector('.product-main__details').getBoundingClientRect();
  const atc = document.querySelector('.product-form__submit, [name="add"]')?.getBoundingClientRect();
  return {
    theme: `${Shopify.theme.name} ${Shopify.theme.id} ${Shopify.theme.role}`,
    columns: cs.gridTemplateColumns,
    rows: cs.gridTemplateRows,
    rowGap: cs.rowGap,
    children: [...L.children].map((c) => `${c.tagName.toLowerCase()}/${Math.round(c.getBoundingClientRect().height)}`),
    gallery: [g.left, g.top, g.right, g.bottom].map(Math.round),
    details: [d.left, d.top].map(Math.round),
    detailsMinusGallery: Math.round(d.top - g.bottom),
    addToCartPageY: atc ? Math.round(atc.top + scrollY) : null,
  };
};
