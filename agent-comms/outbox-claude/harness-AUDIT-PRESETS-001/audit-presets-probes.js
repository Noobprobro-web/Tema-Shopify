/* AUDIT-PRESETS-001. Sondas de solo lectura que se ejecutaron en la tienda viva, en la pestaña del
   storefront con la sesión abierta y ?preview_theme_id=<tema>. Ninguna escribe en la tienda.
   El viewport se emuló con el navegador del panel (1280x800, 1366x768, 1024x768, 768x1024,
   375x812, 360x780). El panel no pinta fotogramas (requestAnimationFrame no avanza), así que:
   - las imágenes loading="lazy" se fuerzan a eager en la pestaña para comprobar que cargan;
   - el evento close de <dialog> no llega (ni en un <dialog> de prueba), ver informe §4.3. */

// Frente 1. Palabras partidas (header, main, footer), scroll horizontal, imágenes y CLS.
window.__run = async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  if (document.readyState !== 'complete') await new Promise((r) => addEventListener('load', r, { once: true }));
  await sleep(1000);
  document.documentElement.style.scrollBehavior = 'auto';
  const H = document.documentElement.scrollHeight;
  for (let y = 0; y < H; y += Math.round(innerHeight * 0.7)) { scrollTo(0, y); await sleep(250); }
  scrollTo(0, 0); await sleep(400);
  let cls = 0; for (const e of performance.getEntriesByType('layout-shift')) if (!e.hadRecentInput) cls += e.value;
  const sec = (el) => (el.closest('.shopify-section')?.id || '').replace(/^shopify-section-(template--\d+__|sections--\d+__)/, '');
  const imgs = [...document.querySelectorAll('main img, header img, footer img')].filter((i) => i.getAttribute('src') || i.getAttribute('srcset'));
  const pend = imgs.filter((i) => !(i.complete && i.naturalWidth > 0));
  const res = await Promise.all(pend.map((i) => new Promise((ok) => {
    const t = setTimeout(() => ok({ ok: false, why: 'timeout ' + sec(i) }), 15000);
    i.addEventListener('load', () => { clearTimeout(t); ok({ ok: i.naturalWidth > 0 }); }, { once: true });
    i.addEventListener('error', () => { clearTimeout(t); ok({ ok: false, why: 'error ' + sec(i) }); }, { once: true });
    i.loading = 'eager'; if (i.complete && i.naturalWidth > 0) { clearTimeout(t); ok({ ok: true }); }
  })));
  const fails = res.filter((r) => !r.ok).map((r) => r.why);
  const brk = []; const range = document.createRange();
  for (const root of [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')].filter(Boolean)) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement; if (!p || p.closest('script,style,noscript,template,[hidden],[aria-hidden="true"]')) continue;
      if (!p.getClientRects().length) continue; const cs = getComputedStyle(p); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const s = n.data; let pt = null, pc = '';
      for (let i = 0; i < s.length; i++) {
        range.setStart(n, i); range.setEnd(n, i + 1); const r = range.getClientRects()[0]; if (!r || !r.width) { pc = s[i]; continue; }
        const top = Math.round(r.top);
        if (pt !== null && Math.abs(top - pt) > 3 && /\p{L}/u.test(pc) && /\p{L}/u.test(s[i])) { brk.push(sec(p) + ' "' + s.slice(Math.max(0, i - 10), i) + '|' + s.slice(i, i + 6) + '"'); break; }
        pt = top; pc = s[i];
      }
    }
  }
  const de = document.documentElement;
  return { t: Shopify.theme.name, loc: Shopify.locale, vw: innerWidth, cls: +cls.toFixed(4), hScroll: de.scrollWidth - de.clientWidth, img: (imgs.length - fails.length) + '/' + imgs.length, fails, breaks: brk };
};

// Frente 3. Centrado del hero: desplazamiento de cada bloque respecto al eje de su columna.
window.__centers = () => {
  const c = document.querySelector('.hero-editorial__content'); const cr = c.getBoundingClientRect(); const cc = (cr.left + cr.right) / 2;
  const tc = (el) => { const rg = document.createRange(); rg.selectNodeContents(el); const tr = [...rg.getClientRects()].filter((r) => r.width > 2); return Math.round((Math.min(...tr.map((r) => r.left)) + Math.max(...tr.map((r) => r.right))) / 2 - cc); };
  const q = (s) => c.querySelector(s);
  return { vw: innerWidth, eyebrow: tc(q('.eyebrow, .hero-editorial__eyebrow')), h1: tc(q('.hero-editorial__heading')), sub: tc(q('.hero-editorial__subheading')) };
};

// Frente 4. Estado del mega menú (se usa entre pulsaciones reales de ArrowDown, Tab y Escape).
window.__mm = () => {
  const d = [...document.querySelectorAll('.desktop-nav theme-disclosure')]; const a = document.activeElement;
  return { open: d.filter((x) => x.hasAttribute('data-open')).length, expanded: d.map((x) => x.querySelector('[aria-expanded]')?.getAttribute('aria-expanded')), focus: (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 40), inPanel: !!a.closest('[data-disclosure-panel]'), inHeader: !!a.closest('.site-header') };
};

// Frente 4. Ficha: rejilla, ATC, inventario al cambiar de variante, zoom y mega menú.
window.__pdp = async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); await sleep(1000);
  const L = document.querySelector('.product-main__layout'); const atc = () => document.querySelector('.product-form__submit');
  const inv = () => document.querySelector('.product-inventory')?.textContent.trim().replace(/\s+/g, ' ');
  const pick = async (v) => { [...document.querySelectorAll('variant-selects input')].find((i) => i.value === v).click(); await sleep(1200); return [...document.querySelectorAll('variant-selects input:checked')].map((i) => i.value).join('/') + ' -> ' + inv() + ' | ' + atc().textContent.trim().replace(/\s+/g, ' ') + (atc().disabled ? ' (off)' : ''); };
  const out = { theme: Shopify.theme.name, cols: getComputedStyle(L).gridTemplateColumns, kids: [...L.children].map((c) => c.tagName.toLowerCase()).join(','), atcBottom: Math.round(atc().getBoundingClientRect().bottom), vh: innerHeight, start: inv() };
  out.camelS = await pick('Camel'); out.oliveS = await pick('Olive'); out.oliveXL = await pick('XL');
  document.querySelectorAll('[data-zoom-open]')[0].click(); await sleep(500);
  const d = document.querySelector('product-zoom dialog');
  out.zoomOpen = d.open && d.matches(':modal') && document.body.hasAttribute('data-modal-open') && d.contains(document.activeElement);
  d.close(); await sleep(300); out.zoomClosed = !d.open;
  const tog = [...document.querySelectorAll('.desktop-nav [aria-expanded]')].find((b) => /cat/i.test(b.textContent));
  tog.click(); await sleep(300); out.megaOpen = tog.getAttribute('aria-expanded');
  out.megaCards = [...document.querySelectorAll('.desktop-nav .mega-menu__promo-card')].map((a) => a.getAttribute('href')).join(' ');
  tog.click(); await sleep(200); out.megaClosed = tog.getAttribute('aria-expanded');
  return out;
};
