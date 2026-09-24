/* UNIFIED-POLISH-001. Auditoría visual de solo lectura sobre la página abierta (se ejecuta tras
   navegar a /<locale>/?preview_theme_id=<id>). Devuelve:
   - clsLoad / clsAfterScroll: suma de layout-shift sin interacción, al cargar y tras recorrer la página.
   - hOverflow: si el documento es más ancho que la ventana.
   - imgs / imgsNotLoaded: imágenes de <main> que no terminaron de cargar tras recorrer la página dos veces.
   - midWordBreaks: textos de <main> y del header cuyo salto de línea cae dentro de una palabra
     (dos letras seguidas en líneas distintas). Se mide con Range.getClientRects carácter a carácter.
   Nota: el panel del navegador integrado puede estar oculto; por eso se recorre la página con
   scroll instantáneo y esperas con setTimeout (requestAnimationFrame no avanza en segundo plano). */
window.__audit = async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  if (document.readyState !== 'complete') await new Promise((r) => addEventListener('load', r, { once: true }));
  await sleep(1200);
  let clsLoad = 0; for (const e of performance.getEntriesByType('layout-shift')) if (!e.hadRecentInput) clsLoad += e.value;
  document.documentElement.style.scrollBehavior = 'auto';
  for (let pass = 0; pass < 2; pass++) {
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += Math.round(innerHeight * 0.7)) { scrollTo(0, y); await sleep(350); }
  }
  scrollTo(0, 0); await sleep(600);
  let clsAfter = 0; for (const e of performance.getEntriesByType('layout-shift')) if (!e.hadRecentInput) clsAfter += e.value;
  const sec = (el) => (el.closest('.shopify-section')?.id || '').replace(/^shopify-section-(template--\d+__|sections--\d+__)/, '');
  const imgs = [...document.querySelectorAll('main img')].filter((i) => i.getAttribute('src') || i.getAttribute('srcset'));
  const notLoaded = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => sec(i) + ' ' + (i.currentSrc || i.getAttribute('src') || '').split('/').pop().split('?')[0]);
  const breaks = [];
  const range = document.createRange();
  for (const root of [document.querySelector('main'), document.querySelector('header')].filter(Boolean)) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement; if (!p || p.closest('script,style,noscript,template,[hidden],[aria-hidden="true"]')) continue;
      if (!p.getClientRects().length || getComputedStyle(p).visibility === 'hidden') continue;
      const s = n.data; let prevTop = null, prevCh = '';
      for (let i = 0; i < s.length; i++) {
        range.setStart(n, i); range.setEnd(n, i + 1); const r = range.getClientRects()[0]; if (!r || !r.width) { prevCh = s[i]; continue; }
        const top = Math.round(r.top);
        if (prevTop !== null && Math.abs(top - prevTop) > 3 && /\p{L}/u.test(prevCh) && /\p{L}/u.test(s[i])) {
          const cs = getComputedStyle(p);
          breaks.push({ section: sec(p), tag: p.tagName.toLowerCase(), text: s.trim().replace(/\s+/g, ' ').slice(0, 60), at: s.slice(Math.max(0, i - 8), i) + '|' + s.slice(i, i + 6), fontSize: cs.fontSize, width: Math.round(p.getBoundingClientRect().width), overflowWrap: cs.overflowWrap, hyphens: cs.hyphens });
          break;
        }
        prevTop = top; prevCh = s[i];
      }
    }
  }
  return {
    theme: Shopify.theme.name + ' ' + Shopify.theme.id, locale: Shopify.locale, vw: innerWidth + 'x' + innerHeight,
    clsLoad: +clsLoad.toFixed(4), clsAfterScroll: +clsAfter.toFixed(4),
    hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    imgs: imgs.length, imgsNotLoaded: notLoaded, midWordBreaks: breaks,
  };
};
