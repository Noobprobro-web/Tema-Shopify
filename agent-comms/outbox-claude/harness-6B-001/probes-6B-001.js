/* CLAUDE-DIRECTIVE-6B-001. Sondas de solo lectura ejecutadas en la tienda viva con
   ?preview_theme_id=<tema> (Couture 165809488115, Sartorial 166186909939) a 1280x800 y 375x812.
   El panel del navegador estaba oculto (visibilityState "hidden"): no corre requestAnimationFrame,
   los setTimeout se agrupan a ~1 s, el evento close de <dialog> no llega y las teclas reales no
   siempre se entregan. Por eso se instala un rAF de prueba y algunas acciones se despachan desde JS. */

window.__sleep = (ms) => new Promise((r) => setTimeout(r, ms));
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);

/* ---------- Contraste (filas 46 y 47) ---------- */
window.__cv = document.createElement('canvas').getContext('2d');
window.__rgb = (c) => { __cv.clearRect(0, 0, 1, 1); __cv.fillStyle = '#000'; __cv.fillStyle = c; __cv.fillRect(0, 0, 1, 1); const d = __cv.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
window.__lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
window.__ratio = (a, b) => { const L1 = __lum(a), L2 = __lum(b); return +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2); };
window.__bg = (el) => { let e = el; while (e) { const c = __rgb(getComputedStyle(e).backgroundColor); if (c[3] > 0.99) return c; e = e.parentElement; } return __rgb(getComputedStyle(document.body).backgroundColor); };

// axe-core 4.10.2 (cdnjs), solo la regla color-contrast.
window.__axeRun = async () => {
  if (!window.axe) { const src = await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js').then((r) => r.text()); (0, eval)(src); }
  const r = await axe.run(document, { runOnly: ['color-contrast'], resultTypes: ['violations', 'incomplete'] });
  return { violations: r.violations.flatMap((v) => v.nodes.map((n) => n.target.join(' '))), incomplete: r.incomplete.reduce((a, v) => a + v.nodes.length, 0) };
};

// Bordes de controles y chips de variante contra el fondo que los rodea (1.4.11).
window.__nonText = (sel) => [...document.querySelectorAll(sel)].filter((e) => e.getClientRects().length).slice(0, 4).map((e) => {
  const cs = getComputedStyle(e); return { sel, border: cs.borderTopColor, width: cs.borderTopWidth, ratio: __ratio(__rgb(cs.borderTopColor), __bg(e.parentElement)) };
});

// Botones: texto contra su relleno, borde y relleno contra la página.
window.__buttons = () => [...document.querySelectorAll('.button, .shopify-payment-button__button, .localization-form__item, .localization-form__country')]
  .filter((b) => b.getClientRects().length && b.getBoundingClientRect().width > 0).slice(0, 14).map((b) => {
    const cs = getComputedStyle(b); const own = __rgb(cs.backgroundColor); const bg = own[3] > 0.99 ? own : __bg(b.parentElement); const outer = __bg(b.parentElement);
    return `${b.className.toString().split(' ')[0]} "${b.textContent.replace(/\s+/g, ' ').trim().slice(0, 22)}" texto ${__ratio(__rgb(cs.color), bg)}` + (parseFloat(cs.borderTopWidth) > 0 ? ` | borde ${__ratio(__rgb(cs.borderTopColor), outer)}` : '');
  });

// Texto del hero sobre la foto: se dibuja la imagen real (mismo origen) con object-fit: cover y
// object-position, se aplica el velo que corresponda (lineal .hero-editorial__overlay o radial en
// .hero-editorial__content::before) y se mide cada píxel bajo las cajas de línea del texto.
window.__heroPixels2 = async () => {
  const h = document.querySelector('.hero-editorial'); const img = h.querySelector('.hero-editorial__media img'); const ov = h.querySelector('.hero-editorial__overlay');
  const bmp = await createImageBitmap(await fetch(img.currentSrc || img.src).then((r) => r.blob()));
  const ir = img.getBoundingClientRect(); const cv = document.createElement('canvas'); cv.width = Math.round(ir.width); cv.height = Math.round(ir.height); const cx = cv.getContext('2d');
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  const scale = Math.max(cv.width / bmp.width, cv.height / bmp.height); const dw = bmp.width * scale, dh = bmp.height * scale;
  cx.drawImage(bmp, (cv.width - dw) * px, (cv.height - dh) * py, dw, dh);
  const hr = h.getBoundingClientRect(); const ovCss = ov ? getComputedStyle(ov).backgroundImage : '';
  const m = ovCss.match(/linear-gradient\(to top, rgba\(0, 0, 0, ([\d.]+)\), rgba\(0, 0, 0, 0\) ([\d.]+)%\)/);
  const linAlpha = (y) => { if (!m) return 0; const a = parseFloat(m[1]); const stop = parseFloat(m[2]) / 100; const fb = (hr.bottom - y) / hr.height; return fb >= stop ? 0 : a * (1 - fb / stop); };
  const cm = getComputedStyle(h.querySelector('.hero-editorial__content'), '::before').backgroundImage.match(/rgba\(0, 0, 0, ([\d.]+)\) 72%/);
  const radial = cm ? parseFloat(cm[1]) : 0; const res = {};
  for (const [k, sel] of [['eyebrow', '.hero-editorial__content .eyebrow'], ['heading', '.hero-editorial__heading'], ['subheading', '.hero-editorial__subheading']]) {
    const e = h.querySelector(sel); if (!e) continue; const L = __lum(__rgb(getComputedStyle(e).color));
    const rg = document.createRange(); rg.selectNodeContents(e); const lums = [];
    for (const r of [...rg.getClientRects()].filter((x) => x.width > 2)) {
      const x0 = Math.max(0, Math.round(r.left - ir.left)), y0 = Math.max(0, Math.round(r.top - ir.top)); const w = Math.min(cv.width - x0, Math.round(r.width)), hh = Math.min(cv.height - y0, Math.round(r.height));
      if (w <= 0 || hh <= 0) continue; const d = cx.getImageData(x0, y0, w, hh).data;
      for (let i = 0; i < d.length; i += 16) { const keep = (1 - linAlpha(r.top + Math.floor(i / 4 / w))) * (1 - radial); lums.push(__lum([d[i] * keep, d[i + 1] * keep, d[i + 2] * keep])); }
    }
    lums.sort((a, b) => a - b); const rat = (bl) => +((Math.max(L, bl) + 0.05) / (Math.min(L, bl) + 0.05)).toFixed(2);
    res[k] = `${getComputedStyle(e).fontSize} ${getComputedStyle(e).fontWeight} | peor ${rat(lums[lums.length - 1])} | p95 ${rat(lums[Math.floor(lums.length * 0.95)])} | mediana ${rat(lums[Math.floor(lums.length / 2)])}`;
  }
  return { theme: Shopify.theme.name, vw: innerWidth, veloLineal: m ? `${m[1]}@${m[2]}%` : 'ninguno', veloRadial: radial, res };
};

/* ---------- Filtros (fila 76) y región viva de filtros (fila 53) ---------- */
window.__net = window.__net || [];
if (!window.__fw) { const of = window.fetch; window.fetch = function (u) { const s = String((u && u.url) || u); if (s.includes('section_id')) window.__net.push(decodeURIComponent(s.replace(location.origin, ''))); return of.apply(this, arguments); }; window.__fw = true; }
window.__ff = () => document.querySelector('facet-filters-form');
window.__state = () => { const ff = __ff(); const live = document.querySelector('[data-facet-live-region]'); const bar = ff.querySelector('.facets__active-filters');
  return { url: decodeURIComponent(location.pathname + location.search), count: ff.querySelector('[data-results-status]')?.textContent.trim(), live: live?.textContent.trim(), headCount: ff.querySelector('.facets__count')?.textContent.trim() || null, cards: ff.querySelectorAll('.product-card').length,
    pills: bar ? [...bar.querySelectorAll('a')].map((p) => p.textContent.replace(/\s+/g, ' ').trim() + ' -> ' + decodeURIComponent(p.getAttribute('href'))) : [], hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth }; };

/* ---------- Ficha: regiones vivas (53), medios (72) y zoom (73) ---------- */
window.__lives = () => [...document.querySelectorAll('[aria-live], [role=status], [role=alert]')].map((e) => `${e.id || e.className.toString().split(' ')[0]} [${e.getAttribute('aria-live') || e.getAttribute('role')}] "${e.textContent.replace(/\s+/g, ' ').trim().slice(0, 80)}"`);

// pauseMedia: se meten un <video> y dos iframes (YouTube, Vimeo) con espías en la diapositiva 0 y se
// cambia de diapositiva con la API del componente <product-gallery> (carrusel a 375 px).
window.__pauseTest = async () => {
  const gal = [...document.querySelectorAll('*')].find((e) => typeof e.goToSlide === 'function'); const s0 = gal.slides[0]; const calls = [];
  const v = document.createElement('video'); v.pause = () => calls.push('video.pause'); s0.append(v);
  const yt = document.createElement('iframe'); yt.setAttribute('src', 'about:blank#youtube-test'); s0.append(yt); await __sleep(200); yt.contentWindow.postMessage = (msg) => calls.push('youtube ' + msg);
  const vm = document.createElement('iframe'); vm.setAttribute('src', 'about:blank#vimeo-test'); s0.append(vm); await __sleep(200); vm.contentWindow.postMessage = (msg) => calls.push('vimeo ' + msg);
  gal.goToSlide(1, true); await __sleep(400); const status = gal.carouselStatus?.textContent; v.remove(); yt.remove(); vm.remove();
  return { calls, status };
};

window.__zoomState = () => { const z = document.querySelector('product-zoom'); const d = z.querySelector('dialog'); const a = document.activeElement;
  return { open: d.open, modal: d.matches(':modal'), bodyModal: document.body.hasAttribute('data-modal-open'), focusInDialog: d.contains(a), focus: (a.getAttribute('aria-label') || a.tagName), scale: z.scale, transform: z.fit?.img?.style.transform || '', status: z.querySelector('[role=status]')?.textContent.trim() }; };

// Pellizco con dos punteros táctiles y arrastre con uno, sobre la pista del zoom.
window.__pinch = async () => {
  const z = document.querySelector('product-zoom'); const r = z.track.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const pe = (type, id, x, y) => z.track.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', isPrimary: id === 11, clientX: x, clientY: y }));
  pe('pointerdown', 11, cx - 30, cy); pe('pointerdown', 12, cx + 30, cy); await __sleep(50);
  pe('pointermove', 11, cx - 60, cy); pe('pointermove', 12, cx + 60, cy); await __sleep(80);
  pe('pointermove', 11, cx - 90, cy); pe('pointermove', 12, cx + 90, cy); await __sleep(80);
  const afterPinch = __zoomState(); pe('pointerup', 11, cx - 90, cy); pe('pointerup', 12, cx + 90, cy); await __sleep(80);
  pe('pointerdown', 13, cx, cy); await __sleep(30); pe('pointermove', 13, cx + 40, cy + 60); await __sleep(80); const afterDrag = __zoomState(); pe('pointerup', 13, cx + 40, cy + 60);
  return { afterPinch, afterDrag };
};
