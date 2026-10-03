// =============================================================================
// MOTION-002 / T5. Arnes de verificacion del motor de animacion NATIVO.
//
// Sustituye a harness-LEAD-001/13-motion-check.mjs, que medía el motor GSAP y
// buscaba `data-motion-pending` y `window.ScrollTrigger`. Aquí se verifica el
// contrato nuevo:
//
//   data-reveal=""              pendiente de coreografia
//   data-reveal="done"          asentado (el gesto termino)
//   data-revealed               marca del motor IntersectionObserver
//   html[data-reveal-ready]     el motor JS arranco
//   html[data-animations]       none | subtle | full
//
// La seleccion de motor es 100% cascada CSS (@supports (animation-timeline: view())).
// El JS del tema no consulta CSS.supports, y este arnes tampoco se lo exige: solo
// observa el resultado.
//
// AXIOMA que se persigue: ningun elemento puede quedar oculto permanentemente, en
// ninguna combinacion de soporte / JS / modo. Todo lo demas (CLS, keyframes, numero
// de animaciones) es secundario frente a eso.
//
// REGLA DE ORO DEL ARNES: ninguna metrica puede dar VERDE por no haberse podido
// medir. Cada fila lleva `measured` y `noMeasureReason`, y el veredicto agregado
// solo puede ser APTO si TODAS las filas se midieron de verdad. Un navegador que no
// arranca, una ruta 404, un PerformanceObserver no soportado o una preferencia de
// Firefox que el navegador ignora producen INCOMPLETO, nunca APTO.
//
// NO ejecuta ninguna escritura en el repositorio fuera de esta carpeta.
//
// Uso y variables de entorno: ver README.md de esta misma carpeta.
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, firefox } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const evidence = path.join(here, 'evidence');
const resultsFile = path.join(here, 'results-01-motion-check.json');

// -----------------------------------------------------------------------------
// 0. Configuracion. Todo parametrizable por entorno; ningun literal de credencial.
// -----------------------------------------------------------------------------
const EXPLICIT_BASE = (process.env.MOTION_BASE_URL || '').replace(/\/+$/, '') || null;
const STORE_KEY = process.env.MOTION_STORE || 'atelier';
const VIEWPORT = { width: 1440, height: 900 };
const CLS_MAX = 0.1;
const TAB_PRESSES = 40;
const TAB_MIN_FOCUSABLES = 5; // por debajo de esto el recorrido de teclado NO es concluyente
const SHORT_ROUTE_MAX_SCROLL = 900; // px de scroll por encima de los cuales una ruta no es "corta"
const MID_GESTURE_WINDOW = [0.3, 0.7]; // franja de progreso que se considera "a mitad de gesto"

// Keyframes que introduce MOTION-002. Se comprueba cuales se observan de verdad en
// `document.getAnimations()`; los que no aparezcan se listan como no observados (son
// informativos: cada uno vive en secciones concretas que la tienda puede no tener).
const EXPECTED_KEYFRAMES = [
  'scroll-rise',
  'scroll-fade',
  'scroll-line-rise',
  'scroll-unveil',
  'scroll-unveil-settle',
  'hero-parallax',
  'marquee-drift',
];

// Un destino local (`shopify theme dev`) no tiene pagina de contrasena: solo en ese
// caso se permite correr sin STOREFRONT_PASSWORD, y hay que pedirlo explicitamente
// con MOTION_BASE_URL. El destino por defecto es una tienda demo real y SIEMPRE
// exige la contrasena por entorno.
const localTarget = Boolean(EXPLICIT_BASE) && !/\.myshopify\.com$/i.test(new URL(EXPLICIT_BASE).hostname);

if (!localTarget && !process.env.STOREFRONT_PASSWORD) {
  throw new Error(
    'STOREFRONT_PASSWORD no esta definida. La contrasena del storefront llega SIEMPRE por entorno '
    + '(CLAUDE.md:23): exportala antes de ejecutar este arnes, o apunta MOTION_BASE_URL a un '
    + '`shopify theme dev` local (http://127.0.0.1:9292), que no pide contrasena.',
  );
}

// El inventario de tiendas y el desbloqueo con reintentos 429 NO se duplican aqui:
// son el patron compartido de harness-AUDIT-FINAL-003/lib.mjs (Gate 3, consistencia
// entre archivos). Se importa en diferido para que un destino local no arrastre su
// guardia de contrasena.
const LIB_URL = new URL('../harness-AUDIT-FINAL-003/lib.mjs', import.meta.url);
let lib = null;
if (!localTarget) {
  try {
    lib = await import(LIB_URL.href);
  } catch (error) {
    throw new Error(
      `No se pudo cargar el patron compartido ${LIB_URL.pathname}: ${error.message}. `
      + 'Si ese arnes se movio, pasa MOTION_BASE_URL y MOTION_ROUTES a mano.',
    );
  }
}

const store = lib && lib.STORES[STORE_KEY];
if (!localTarget && !store) {
  throw new Error(`MOTION_STORE="${STORE_KEY}" no existe. Disponibles: ${Object.keys(lib.STORES).join(', ')}.`);
}

const BASE = EXPLICIT_BASE || store.url;
const PRODUCT_HANDLE = process.env.MOTION_PRODUCT || (store ? store.products[0] : null);

// Las 4 rutas del contrato. Si no hay handle de producto resoluble (destino local sin
// MOTION_PRODUCT) la ruta de ficha se deja fuera y se anota: no se inventa un handle.
const missingRouteNotes = [];
const DEFAULT_ROUTES = ['/', '/collections/all', PRODUCT_HANDLE ? `/products/${PRODUCT_HANDLE}` : null, '/pages/about']
  .filter(Boolean);
if (!PRODUCT_HANDLE) {
  missingRouteNotes.push('Ruta de ficha omitida: sin MOTION_PRODUCT ni inventario de tienda. Pasala con MOTION_PRODUCT=<handle>.');
}
const ROUTES = (process.env.MOTION_ROUTES || DEFAULT_ROUTES.join(',')).split(',').map((r) => r.trim()).filter(Boolean);

// Modo de movimiento forzado. El tema lo sirve desde `settings.animations` y el motor
// scroll-driven SOLO vive en `full`; si la tienda estuviera en `subtle` la metrica de
// animaciones scroll-driven seria legitimamente 0 y no habriamos probado nada. Forzar
// `full` lo hace independiente del ajuste publicado, y el valor nativo se registra
// igualmente en cada fila para que quede a la vista.
const FORCE_MODE = process.env.MOTION_FORCE_MODE === '' ? null : (process.env.MOTION_FORCE_MODE || 'full');

// G11. Impresion. Se ejecuta en los proyectos Chromium (los unicos con page.pdf()).
// MOTION_PRINT=0 la desactiva; MOTION_PRINT_ONLY=1 corre SOLO G0 y G11 (sin recorrido,
// sin teclado, sin degenerados): sirve para medir la llave de papel sin castigar el
// limitador de la tienda con todo lo demas.
const PRINT_ONLY = process.env.MOTION_PRINT_ONLY === '1';
const PRINT_CHECK = PRINT_ONLY || process.env.MOTION_PRINT !== '0';
// Hijos animados de B8 que NO llevan [data-reveal] propio: las lineas de los siete
// encabezados con mascara (b) y el medio del unveil (c). Mismo marcado que base.css.
const PRINT_HEADERS = '.lookbook__header, .curated-showcase__header, .complete-the-look__header, '
  + '.bento-discovery__header, .product-recommendations__header, .brand-manifesto__statement, .main-about__quote';
const PRINT_CHILD_SELECTOR = [
  `:is(${PRINT_HEADERS})[data-reveal] > *`,
  `:is(${PRINT_HEADERS})[data-reveal] > :is(.flow, div) > *`,
  ':is(.brand-manifesto__media, .complete-the-look__media, .lookbook__media, .main-about__gallery-item)[data-reveal] :is(img, svg, video)',
].join(', ');

// -----------------------------------------------------------------------------
// 1. Proyectos Playwright. Tres perfiles; `MOTION_PROJECTS` o argv[2] seleccionan.
//    - chromium-full:  motor nativo (@supports si). Rama principal.
//    - chromium-reduce: prefers-reduced-motion: reduce. Nada animado, nada oculto.
//    - firefox-no-scroll-driven: scroll-driven DESACTIVADO por preferencia. Ejerce la
//      rama `@supports not`, la que nadie mira: es la prueba mas valiosa del arnes.
// -----------------------------------------------------------------------------
const ALL_PROJECTS = [
  {
    name: 'chromium-full',
    browser: 'chromium',
    engine: chromium,
    launch: {},
    context: { reducedMotion: 'no-preference' },
    scenario: 'full',
    forceMode: FORCE_MODE,
    printCheck: true,
  },
  {
    name: 'chromium-reduce',
    browser: 'chromium',
    engine: chromium,
    launch: {},
    context: { reducedMotion: 'reduce' },
    scenario: 'reduce',
    forceMode: FORCE_MODE,
    printCheck: true,
  },
  {
    name: 'firefox-no-scroll-driven',
    browser: 'firefox',
    engine: firefox,
    launch: { firefoxUserPrefs: { 'layout.css.scroll-driven-animations.enabled': false } },
    context: { reducedMotion: 'no-preference' },
    scenario: 'fallback',
    forceMode: FORCE_MODE,
    // Aqui se EXIGE que el navegador NO soporte scroll-driven: si lo soporta, la
    // preferencia no hizo efecto y estariamos midiendo el motor nativo creyendo que
    // medimos el respaldo. Eso es NO MEDIBLE, no un aprobado.
    requireNoNativeSupport: true,
  },
];

const selected = (process.env.MOTION_PROJECTS || process.argv[2] || '').split(',').map((s) => s.trim()).filter(Boolean);
const PROJECTS = selected.length ? ALL_PROJECTS.filter((p) => selected.includes(p.name)) : ALL_PROJECTS;
if (!PROJECTS.length) {
  throw new Error(`Ningun proyecto coincide con "${selected.join(',')}". Disponibles: ${ALL_PROJECTS.map((p) => p.name).join(', ')}.`);
}

fs.mkdirSync(evidence, { recursive: true });

// -----------------------------------------------------------------------------
// 2. Guiones que corren DENTRO de la pagina.
//    Se declaran como funciones sueltas porque Playwright las serializa: no pueden
//    cerrar sobre nada del modulo, asi que todo entra por argumento.
// -----------------------------------------------------------------------------

// CLS. `clsSupported` es la clave de la honestidad de esta metrica: Firefox no
// implementa la entrada `layout-shift`, y sin esta bandera un 0 de Firefox se leeria
// como "no hubo desplazamiento" cuando en realidad es "no se pudo medir".
const INIT_CLS = () => {
  window.__motionCls = 0;
  window.__motionClsEntries = 0;
  window.__motionClsSupported = false;
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.hadRecentInput) continue;
        window.__motionCls += entry.value;
        window.__motionClsEntries += 1;
      }
    });
    observer.observe({ type: 'layout-shift', buffered: true });
    window.__motionClsSupported = true;
  } catch (error) {
    window.__motionClsSupported = false;
  }
};

// Modo de movimiento. Se escribe lo antes posible para llegar antes que theme.js
// (que lee `root.dataset.animations` al arrancar), y se guarda el valor nativo que
// trajo el marcado del layout antes de pisarlo.
const INIT_MODE = (mode) => {
  window.__motionNativeAnimations = null;
  const apply = () => {
    const root = document.documentElement;
    if (!root) return false;
    if (window.__motionNativeAnimations === null) {
      window.__motionNativeAnimations = root.getAttribute('data-animations');
    }
    root.setAttribute('data-animations', mode);
    return true;
  };
  if (!apply()) {
    // El guion puede correr antes de que el parser cree <html>: se espera a verlo.
    const observer = new MutationObserver(() => { if (apply()) observer.disconnect(); });
    observer.observe(document, { childList: true, subtree: true });
  }
  document.addEventListener('DOMContentLoaded', apply, { once: true });
};

// Estado del motor + pruebas de ausencia de GSAP + inventario de scripts.
const READ_STATE = () => {
  const root = document.documentElement;
  const all = document.getAnimations ? document.getAnimations() : [];
  const scrollDriven = all.filter((a) => a.timeline && a.timeline.constructor.name !== 'DocumentTimeline');
  const srcs = Array.from(document.querySelectorAll('script[src]')).map((s) => s.src);
  const inline = Array.from(document.querySelectorAll('script:not([src])'));

  return {
    // --- 1) soporte declarado por el navegador (informativo: el tema no lo consulta)
    support: {
      viewTimeline: CSS.supports('animation-timeline: view()'),
      // El @supports del tema encadena las dos: hubo versiones que aceptaban view()
      // pero no la sintaxis de dos valores de animation-range.
      animationRange: CSS.supports('animation-range: entry 0% entry 100%'),
    },
    // --- modo efectivo y nativo
    mode: {
      native: window.__motionNativeAnimations ?? root.getAttribute('data-animations'),
      effective: root.getAttribute('data-animations'),
    },
    // --- 2/3) estado del motor
    engine: {
      revealReady: root.hasAttribute('data-reveal-ready'),
      pending: document.querySelectorAll('[data-reveal=""]').length,
      settled: document.querySelectorAll('[data-reveal="done"]').length,
      decorated: document.querySelectorAll('[data-reveal]').length,
      revealedMark: document.querySelectorAll('[data-revealed]').length,
    },
    animations: {
      total: all.length,
      scrollDriven: scrollDriven.length,
      timelineKinds: [...new Set(all.map((a) => (a.timeline ? a.timeline.constructor.name : 'null')))].sort(),
      scrollDrivenNames: [...new Set(scrollDriven.map((a) => a.animationName || 'anonima'))].sort(),
      names: [...new Set(all.map((a) => a.animationName).filter(Boolean))].sort(),
    },
    // --- 4) GSAP fuera
    gsap: {
      gsapUndefined: window.gsap === undefined,
      scrollTriggerUndefined: window.ScrollTrigger === undefined,
    },
    // --- 5) ningun script de gsap/motion
    scripts: {
      total: srcs.length,
      srcs: [...new Set(srcs)],
      // Se marca aparte lo que es del TEMA (assets del tema en el CDN de la tienda)
      // de lo que sirve la plataforma: un script de Shopify que casualmente lleve
      // "motion" en el nombre no puede tumbar al tema, pero queda anotado.
      offenders: [...new Set(srcs.filter((s) => /gsap|motion/i.test(s)))],
      themeOffenders: [...new Set(srcs.filter((s) => /gsap|motion/i.test(s) && /\/cdn\/shop\/t\/|\/assets\//.test(s)))],
      inlineGsapMentions: inline.filter((s) => /\bgsap\b|ScrollTrigger/.test(s.textContent || '')).length,
    },
    // --- pruebas de que la pagina CARGO y de que theme.js CORRIO (anti falso verde).
    //     Sin el segundo control, "0 animaciones / 0 pendientes / 0 ocultos" podria venir
    //     de que el motor nunca existio en esa carga, y se leeria como aprobado.
    loaded: {
      title: document.title.slice(0, 120),
      hasMain: Boolean(document.querySelector('main')),
      bodyChildren: document.body ? document.body.children.length : 0,
      docHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
      noJsClass: root.classList.contains('no-js'),
      themeJsRan: Boolean(window.customElements
        && ['theme-drawer', 'cart-drawer', 'marquee-banner', 'theme-disclosure']
          .some((tag) => window.customElements.get(tag))),
    },
  };
};

// Elementos que han quedado efectivamente invisibles. Se mira CUALQUIER [data-reveal],
// no solo los pendientes: un "done" invisible seria igual de grave.
const READ_HIDDEN = () => Array.from(document.querySelectorAll('[data-reveal]'))
  .map((node) => {
    const style = getComputedStyle(node);
    const opacity = parseFloat(style.opacity);
    const clipped = style.clipPath.startsWith('inset(100%');
    if (opacity >= 0.05 && !clipped && style.visibility !== 'hidden') return null;
    return {
      sel: node.localName + (node.className ? '.' + String(node.className).trim().split(/\s+/)[0] : ''),
      reveal: node.getAttribute('data-reveal'),
      revealed: node.hasAttribute('data-revealed'),
      opacity: Number.isFinite(opacity) ? opacity : null,
      clipPath: clipped ? style.clipPath : null,
      visibility: style.visibility,
    };
  })
  .filter(Boolean);

// Objetivos pendientes ordenados por posicion: candidatos a captura a mitad de gesto.
const PICK_PROBES = (max) => {
  document.querySelectorAll('[data-motion-harness]').forEach((n) => n.removeAttribute('data-motion-harness'));
  const pending = Array.from(document.querySelectorAll('[data-reveal=""]'))
    .map((node) => ({ node, top: node.getBoundingClientRect().top + window.scrollY }))
    .filter((e) => e.top > window.innerHeight * 0.5)
    .sort((a, b) => a.top - b.top);
  if (!pending.length) return [];
  const picks = [];
  const step = Math.max(1, Math.floor(pending.length / max));
  for (let i = 0; i < pending.length && picks.length < max; i += step) picks.push(pending[i]);
  return picks.map((entry, index) => {
    entry.node.setAttribute('data-motion-harness', String(index));
    return {
      index,
      top: Math.round(entry.top),
      sel: entry.node.localName + (entry.node.className ? '.' + String(entry.node.className).trim().split(/\s+/)[0] : ''),
    };
  });
};

// Progreso real del gesto sobre un objetivo marcado. `progress` sale del timing
// calculado de la animacion scroll-driven; en la rama de respaldo no hay animacion
// (es una transition) y vuelve null, por eso se devuelve tambien la opacidad: en el
// respaldo es ella la que prueba que el elemento esta a medio entrar.
const READ_PROBE = (index) => {
  const node = document.querySelector(`[data-motion-harness="${index}"]`);
  if (!node) return { found: false };
  const anims = node.getAnimations ? node.getAnimations() : [];
  const scroll = anims.filter((a) => a.timeline && a.timeline.constructor.name !== 'DocumentTimeline');
  let progress = null;
  for (const anim of scroll) {
    const timing = anim.effect && anim.effect.getComputedTiming ? anim.effect.getComputedTiming() : null;
    if (timing && typeof timing.progress === 'number') { progress = timing.progress; break; }
  }
  const style = getComputedStyle(node);
  return {
    found: true,
    progress,
    opacity: parseFloat(style.opacity),
    clipPath: style.clipPath.startsWith('inset(') ? style.clipPath : null,
    animations: anims.map((a) => a.animationName || 'anonima'),
    scrollDriven: scroll.length,
    rectTop: Math.round(node.getBoundingClientRect().top),
  };
};

// Elemento enfocado: se sube por los ancestros buscando una capa invisible.
const READ_FOCUS = () => {
  const el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return { landed: false };
  const id = el.localName + (el.className ? '.' + String(el.className).trim().split(/\s+/)[0] : '');
  let node = el;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    const opacity = parseFloat(style.opacity);
    const clipped = style.clipPath.startsWith('inset(100%');
    if (opacity < 0.05 || clipped || style.visibility === 'hidden') {
      return {
        landed: true,
        id,
        culprit: node.localName + (node.className ? '.' + String(node.className).trim().split(/\s+/)[0] : ''),
        opacity: Number.isFinite(opacity) ? opacity : null,
        clipPath: clipped ? style.clipPath : null,
        visibility: style.visibility,
      };
    }
    node = node.parentElement;
  }
  return { landed: true, id };
};

// Inventario del catalogo, para resolver los estados degenerados con el contenido
// REAL de la tienda en vez de con handles supuestos.
const READ_CATALOG = async () => {
  const out = { ok: false, error: null, collections: [], products: [] };
  try {
    const cs = await (await fetch('/collections.json?limit=250')).json();
    const ps = await (await fetch('/products.json?limit=250')).json();
    out.collections = (cs.collections || []).map((c) => ({
      handle: c.handle,
      title: c.title,
      count: typeof c.products_count === 'number' ? c.products_count : null,
    }));
    out.products = (ps.products || []).map((p) => ({
      handle: p.handle,
      titleLength: (p.title || '').length,
      images: (p.images || []).length,
      variants: (p.variants || []).length,
    }));
    out.ok = true;
  } catch (error) {
    out.error = String(error && error.message ? error.message : error);
  }
  return out;
};

// `/collections.json` no siempre trae `products_count`; cuando falta se pregunta por
// la coleccion. Dos productos bastan para distinguir vacia / unica / varias.
const COUNT_COLLECTION = async (handle) => {
  try {
    const r = await fetch(`/collections/${handle}/products.json?limit=3`);
    if (!r.ok) return null;
    const json = await r.json();
    return (json.products || []).length;
  } catch (error) {
    return null;
  }
};

// Impresion (G11). Corre con la pagina ya en media print y SIN haber hecho scroll: es
// el caso real de alguien que abre la pagina y pulsa Imprimir. Mira cada [data-reveal]
// y sus hijos animados (los que tienen animaciones o son lineas/medio de B8) y anota
// por que quedarian fuera del papel: opacidad < 1, visibility hidden, clip-path que
// recorta caja o transform distinto de la identidad. Los nodos sin caja (display: none,
// p. ej. un cajon cerrado) no se pintan en papel ni en pantalla: se cuentan aparte.
const READ_PRINT = (childSelector) => {
  const root = document.documentElement;
  const describe = (node) => node.localName
    + (node.id ? `#${node.id}` : '')
    + (typeof node.className === 'string' && node.className.trim() ? '.' + node.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const toPx = (value, ref) => (String(value).endsWith('%') ? (parseFloat(value) * ref) / 100 : parseFloat(value));
  // Fraccion de la caja que recorta un inset(); null si la forma no es inset().
  const clipFraction = (clip, rect) => {
    if (!clip || clip === 'none') return 0;
    const m = clip.match(/^inset\(([^)]*?)(?:\s+round[^)]*)?\)$/);
    if (!m) return null;
    const v = m[1].trim().split(/\s+/);
    const [t, r, b, l] = [v[0], v[1] ?? v[0], v[2] ?? v[0], v[3] ?? v[1] ?? v[0]];
    const h = rect.height || 1;
    const w = rect.width || 1;
    const vert = (Math.max(0, toPx(t, h)) + Math.max(0, toPx(b, h))) / h;
    const horiz = (Math.max(0, toPx(l, w)) + Math.max(0, toPx(r, w))) / w;
    return Number(Math.max(vert, horiz).toFixed(3));
  };
  const readTransform = (value) => {
    if (!value || value === 'none') return null;
    try {
      const mx = new DOMMatrixReadOnly(value);
      const tx = mx.m41; const ty = mx.m42; const sx = Math.hypot(mx.a, mx.b); const sy = Math.hypot(mx.c, mx.d);
      const off = Math.abs(tx) > 0.5 || Math.abs(ty) > 0.5 || Math.abs(sx - 1) > 0.005 || Math.abs(sy - 1) > 0.005;
      return off ? { tx: Number(tx.toFixed(1)), ty: Number(ty.toFixed(1)), sx: Number(sx.toFixed(3)), sy: Number(sy.toFixed(3)) } : null;
    } catch (error) {
      return { raw: value };
    }
  };

  const reveal = Array.from(document.querySelectorAll('[data-reveal]'));
  const targets = new Map();
  reveal.forEach((node) => targets.set(node, 'reveal'));
  reveal.forEach((node) => node.querySelectorAll('*').forEach((child) => {
    if (targets.has(child)) return;
    const animated = child.getAnimations ? child.getAnimations().length > 0 : false;
    if (animated || child.matches(childSelector)) targets.set(child, 'hijo');
  }));

  const hidden = [];
  let inspected = 0;
  let notRendered = 0;
  for (const [node, role] of targets) {
    if (!node.getClientRects().length) { notRendered += 1; continue; }
    inspected += 1;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const opacity = parseFloat(style.opacity);
    const clip = clipFraction(style.clipPath, rect);
    const transform = readTransform(style.transform);
    const reasons = [];
    if (opacity < 0.999) reasons.push(`opacity ${opacity}`);
    if (style.visibility === 'hidden') reasons.push('visibility hidden');
    if (clip === null) reasons.push(`clip-path no evaluable ${style.clipPath}`);
    else if (clip > 0.01) reasons.push(`clip-path ${style.clipPath} (recorta ${Math.round(clip * 100)}%)`);
    if (transform) reasons.push(`transform ${style.transform}`);
    if (!reasons.length) continue;
    const anims = node.getAnimations ? node.getAnimations() : [];
    hidden.push({
      sel: describe(node),
      role,
      reveal: node.closest('[data-reveal]') ? node.closest('[data-reveal]').getAttribute('data-reveal') : null,
      revealHost: role === 'hijo' ? describe(node.closest('[data-reveal]')) : null,
      reasons,
      transform,
      animations: anims.map((a) => ({
        name: a.animationName || a.transitionProperty || 'anonima',
        playState: a.playState,
        timeline: a.timeline ? a.timeline.constructor.name : 'null',
        progress: a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().progress : null,
      })),
    });
  }

  return {
    media: { print: matchMedia('print').matches, screen: matchMedia('screen').matches },
    scrollY: Math.round(window.scrollY),
    revealReady: root.hasAttribute('data-reveal-ready'),
    mode: root.getAttribute('data-animations'),
    decorated: reveal.length,
    pending: document.querySelectorAll('[data-reveal=""]').length,
    targets: targets.size,
    inspected,
    notRendered,
    hidden,
  };
};

// -----------------------------------------------------------------------------
// 3. Utilidades de Node.
// -----------------------------------------------------------------------------
const slugify = (route) => (route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home').slice(0, 48);

// Recorrido real con rueda: el motor es scroll, asi que el gesto tiene que ser scroll
// y no un salto de scrollTo. Devuelve el maximo de animaciones scroll-driven vistas
// durante el trayecto: tomar el maximo quita fragilidad de muestreo (una animacion
// fuera de rango puede no estar en getAnimations en un instante concreto).
async function traverse(page, { step = 320, settleMs = 110 } = {}) {
  let maxScrollDriven = 0;
  let maxTotal = 0;
  const names = new Set();
  let guard = 0;
  for (;;) {
    const metrics = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      h: document.documentElement.scrollHeight,
      ih: window.innerHeight,
    }));
    const snapshot = await page.evaluate(() => {
      const all = document.getAnimations ? document.getAnimations() : [];
      const scroll = all.filter((a) => a.timeline && a.timeline.constructor.name !== 'DocumentTimeline');
      return { total: all.length, scroll: scroll.length, names: all.map((a) => a.animationName).filter(Boolean) };
    });
    maxScrollDriven = Math.max(maxScrollDriven, snapshot.scroll);
    maxTotal = Math.max(maxTotal, snapshot.total);
    snapshot.names.forEach((n) => names.add(n));

    if (metrics.y + metrics.ih >= metrics.h - 2) break;
    if (++guard > 400) break; // pagina de scroll infinito: no se cuelga el arnes
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(settleMs);
  }
  // Se da aire a la guardia de fin de pagina y a la ultima transicion del respaldo.
  await page.waitForTimeout(2600);
  return { maxScrollDriven, maxTotal, names: [...names].sort(), iterations: guard };
}

// Coloca un objetivo a mitad de su rango y captura. Verifica el progreso en vez de
// confiar en una posicion calculada: asi la captura PRUEBA que es media animacion.
async function captureMidGesture(page, project, slug, probes) {
  const shots = [];
  for (const probe of probes) {
    let best = null;

    // Fase gruesa: acercar el objetivo al pliegue a zancadas. Sin esto, un objetivo a
    // 5000 px de distancia no se alcanzaria nunca con pasos de 90 px y la captura saldria
    // de un sitio cualquiera: un PNG inutil presentado como evidencia.
    for (let i = 0; i < 80; i++) {
      const approach = await page.evaluate(READ_PROBE, probe.index);
      if (!approach.found) break;
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      if (approach.rectTop <= viewportHeight * 1.1) break;
      await page.mouse.wheel(0, Math.min(1200, Math.max(200, approach.rectTop - viewportHeight)));
      await page.waitForTimeout(80);
    }

    // Fase fina: pasos cortos hasta que el progreso cae en la franja de medio gesto.
    for (let i = 0; i < 40; i++) {
      const reading = await page.evaluate(READ_PROBE, probe.index);
      if (!reading.found) break;
      const inWindow = typeof reading.progress === 'number'
        && reading.progress > MID_GESTURE_WINDOW[0] && reading.progress < MID_GESTURE_WINDOW[1];
      // En la rama de respaldo no hay progreso; se usa la opacidad intermedia.
      const midByOpacity = reading.progress === null && reading.opacity > 0.05 && reading.opacity < 0.95;
      if (inWindow || midByOpacity) { best = reading; break; }
      if (!best || (reading.progress ?? 0) > (best.progress ?? 0)) best = reading;
      // Si ya se paso del rango no tiene sentido seguir bajando por este objetivo.
      if (typeof reading.progress === 'number' && reading.progress >= MID_GESTURE_WINDOW[1]) break;
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(70);
    }
    const file = `${project}-${slug}-mid-${String(probe.index + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: path.join(evidence, file), type: 'png' });
    shots.push({
      file: path.join('evidence', file),
      target: probe.sel,
      progress: best && typeof best.progress === 'number' ? Number(best.progress.toFixed(3)) : null,
      opacity: best ? Number(best.opacity.toFixed(3)) : null,
      clipPath: best ? best.clipPath : null,
      animations: best ? best.animations : [],
      scrollDrivenOnTarget: best ? best.scrollDriven : null,
      midGesture: Boolean(best && ((typeof best.progress === 'number'
        && best.progress > MID_GESTURE_WINDOW[0] && best.progress < MID_GESTURE_WINDOW[1])
        || (best.progress === null && best.opacity > 0.05 && best.opacity < 0.95))),
      note: best ? null : 'El objetivo marcado desaparecio del DOM antes de la captura.',
    });
  }
  return shots;
}

// 40 tabulaciones. `distinctFocusables` existe para que "0 focos invisibles" no pueda
// ser verde cuando el foco nunca salio de <body>.
async function keyboardPass(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const invisible = [];
  const seen = new Set();
  let landed = 0;
  for (let i = 0; i < TAB_PRESSES; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(60);
    const read = await page.evaluate(READ_FOCUS);
    if (!read.landed) continue;
    landed += 1;
    seen.add(read.id);
    if (!read.culprit) continue;
    // Se concede el tiempo del gesto: el manejador focusin del tema asienta el
    // contenedor del foco, y juzgar antes de eso seria un falso rojo.
    await page.waitForTimeout(450);
    const again = await page.evaluate(READ_FOCUS);
    if (again.culprit) invisible.push({ tab: i + 1, ...again });
  }
  return {
    tabs: TAB_PRESSES,
    landed,
    distinctFocusables: seen.size,
    invisibleFocus: invisible,
    measured: seen.size >= TAB_MIN_FOCUSABLES,
    noMeasureReason: seen.size >= TAB_MIN_FOCUSABLES
      ? null
      : `El foco solo alcanzo ${seen.size} elementos distintos en ${TAB_PRESSES} tabulaciones: recorrido no concluyente (pagina sin elementos enfocables, o un dialogo atrapando el foco).`,
  };
}

// -----------------------------------------------------------------------------
// 4. Medicion de una ruta.
// -----------------------------------------------------------------------------
async function measureRoute(context, project, route, options = {}) {
  const slug = slugify(route);
  const row = {
    project: project.name,
    scenario: project.scenario,
    route,
    status: null,
    measured: false,
    noMeasureReason: null,
    failures: [],
    warnings: [],
    errors: [],
  };

  const page = await context.newPage();
  page.on('pageerror', (e) => row.errors.push(String(e.message).slice(0, 200)));
  page.on('console', (m) => { if (m.type() === 'error') row.errors.push(m.text().slice(0, 200)); });

  try {
    const response = await page.goto(BASE + route, { waitUntil: 'load' });
    row.status = response ? response.status() : null;
    await page.waitForTimeout(1500);

    const state = await page.evaluate(READ_STATE);
    Object.assign(row, {
      support: state.support,
      mode: { ...state.mode, forced: project.forceMode || null },
      atLoad: state.engine,
      animationsAtLoad: state.animations,
      gsap: state.gsap,
      scripts: state.scripts,
      loaded: {
        ...state.loaded,
        scrollable: Math.max(0, state.loaded.docHeight - state.loaded.innerHeight),
      },
    });

    // --- Puerta previa: ¿cargo la pagina? Sin esto, todo lo que sigue daria 0 y
    //     un 0 se leeria como aprobado.
    if (!row.status || row.status >= 400 || !state.loaded.hasMain || state.loaded.bodyChildren === 0) {
      row.noMeasureReason = `La ruta no rindio contenido util (HTTP ${row.status}, main=${state.loaded.hasMain}, hijos de body=${state.loaded.bodyChildren}): las metricas de esta fila no son concluyentes.`;
      return row;
    }

    // --- Captura a mitad de gesto (antes de recorrer: luego todo esta asentado).
    if (options.capture !== false) {
      const probes = await page.evaluate(PICK_PROBES, 3);
      row.probes = probes.length;
      row.midGesture = probes.length
        ? await captureMidGesture(page, project.name, slug, probes)
        : [];
      if (!probes.length) {
        row.warnings.push('Sin objetivos pendientes bajo el pliegue: no hay gesto que capturar en esta ruta.');
      }
    }

    // --- Recorrido completo de la pagina.
    const walk = await traverse(page);
    row.traverse = walk;
    const after = await page.evaluate(READ_STATE);
    row.afterScroll = after.engine;
    row.animationsAfterScroll = after.animations;
    row.hiddenAfterScroll = await page.evaluate(READ_HIDDEN);
    row.scrollDrivenMax = walk.maxScrollDriven;

    // --- CLS.
    const cls = await page.evaluate(() => ({
      supported: window.__motionClsSupported === true,
      value: typeof window.__motionCls === 'number' ? Number(window.__motionCls.toFixed(4)) : null,
      entries: window.__motionClsEntries ?? null,
    }));
    row.cls = cls;

    // --- Teclado: se recarga para arrancar desde arriba con todo por revelar.
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1200);
    row.keyboard = await keyboardPass(page);

    row.measured = true;
  } catch (error) {
    row.noMeasureReason = `Excepcion durante la medicion: ${String(error && error.message ? error.message : error).slice(0, 300)}`;
  } finally {
    await page.close().catch(() => {});
  }

  return row;
}

// G11. Impresion sin scroll. La pagina carga en pantalla (como la abre una persona),
// NO se hace scroll, se cambia a media print y se lee. Luego page.pdf() deja la prueba
// en papel. Juicio en la propia funcion: es una fila de otra naturaleza que las de M1-M8.
async function measurePrint(context, project, route) {
  const slug = slugify(route);
  const row = {
    project: project.name,
    scenario: project.scenario,
    route,
    kind: 'print',
    status: null,
    measured: false,
    noMeasureReason: null,
    failures: [],
    warnings: [],
    errors: [],
  };
  const page = await context.newPage();
  page.on('pageerror', (e) => row.errors.push(String(e.message).slice(0, 200)));
  try {
    const response = await page.goto(BASE + route, { waitUntil: 'load' });
    row.status = response ? response.status() : null;
    await page.waitForTimeout(1500);
    const state = await page.evaluate(READ_STATE);
    row.loaded = state.loaded;
    row.support = state.support;
    row.mode = { ...state.mode, forced: project.forceMode || null };
    row.screenAtLoad = state.engine;
    if (!row.status || row.status >= 400 || !state.loaded.hasMain || state.loaded.bodyChildren === 0) {
      row.noMeasureReason = `La ruta no rindio contenido util (HTTP ${row.status}).`;
      return row;
    }
    if (!state.loaded.themeJsRan) {
      row.noMeasureReason = 'theme.js no llego a correr: sin motor no hay nada pendiente que probar en papel.';
      return row;
    }

    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(400);
    const print = await page.evaluate(READ_PRINT, PRINT_CHILD_SELECTOR);
    row.print = print;
    if (!print.media.print) {
      row.noMeasureReason = 'emulateMedia no aplico: matchMedia(print) sigue en false.';
      return row;
    }
    if (print.scrollY !== 0) {
      row.noMeasureReason = `La pagina no esta en scroll 0 (scrollY=${print.scrollY}): no es el caso "imprimir sin recorrer".`;
      return row;
    }

    const file = path.join(evidence, `print-${project.name}-${slug}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    row.pdf = { file: path.relative(here, file), bytes: fs.statSync(file).size };
    // Segunda lectura tras generar el PDF: confirma que el estado no dependia del
    // momento de la lectura.
    row.printAfterPdf = await page.evaluate(READ_PRINT, PRINT_CHILD_SELECTOR);
    row.measured = true;

    const hidden = [...print.hidden, ...row.printAfterPdf.hidden.filter((h) => !print.hidden.some((x) => x.sel === h.sel))];
    hidden.forEach((h) => row.failures.push(`Oculto en papel: ${h.sel}${h.revealHost ? ` (dentro de ${h.revealHost})` : ''} [${h.role}, data-reveal="${h.reveal}"] :: ${h.reasons.join('; ')}`));
    // Control anti-vacio: en full con motor listo tiene que haber algo pendiente al cargar
    // sin scroll; si no, "0 ocultos" no probaria la llave de papel.
    row.printExercised = print.revealReady && state.engine.pending > 0;
    if (project.scenario === 'full' && !row.printExercised) {
      row.warnings.push(`Nada pendiente al cargar sin scroll (pend=${state.engine.pending}, ready=${print.revealReady}): la llave de papel no se ejercita en esta ruta.`);
    }
    if (project.scenario === 'reduce') {
      row.warnings.push(`reduce: ready=${print.revealReady}, decorados=${print.decorated}. La llave 2 ya lo deja todo visible; la fila prueba que el papel no lo rompe.`);
    }
  } catch (error) {
    row.noMeasureReason = `Excepcion durante la medicion de impresion: ${String(error && error.message ? error.message : error).slice(0, 300)}`;
  } finally {
    await page.close().catch(() => {});
  }
  row.verdict = row.measured ? (row.failures.length ? 'FALLA' : 'PASA') : 'NO_MEDIBLE';
  return row;
}

// -----------------------------------------------------------------------------
// 5. Evaluacion de una fila contra el contrato. Separada de la medicion a proposito:
//    el JSON guarda lo MEDIDO, y el juicio se recalcula desde ahi.
// -----------------------------------------------------------------------------
function judge(row, project) {
  if (!row.measured) {
    row.verdict = 'NO_MEDIBLE';
    return row;
  }
  const fail = (code, detail) => row.failures.push(`${code}: ${detail}`);
  const warn = (code, detail) => row.warnings.push(`${code}: ${detail}`);
  const nativeSupported = row.support.viewTimeline && row.support.animationRange;
  row.nativeEngineAvailable = nativeSupported;

  // M0b · Control positivo. Si theme.js no se ejecuto, TODOS los ceros de esta fila
  // (animaciones, pendientes, ocultos) vienen de que el motor no existio, no de que
  // funcione. Es un fallo duro de la migracion, no un "no medible": el tema degrada sin
  // esconder nada, pero la coreografia no existe.
  if (!row.loaded.themeJsRan) {
    fail('M0b', 'theme.js no se ejecuto en esta carga (ningun custom element del tema quedo definido): el motor de revelado no existe y ninguna metrica del motor es concluyente.');
  }

  // M2 · AXIOMA. Nada pendiente al final del recorrido, nada invisible.
  if (row.afterScroll.pending > 0) {
    fail('M2', `${row.afterScroll.pending} elemento(s) siguen con data-reveal="" tras recorrer la pagina: potencialmente invisibles.`);
  }
  if (row.hiddenAfterScroll.length > 0) {
    fail('M2', `${row.hiddenAfterScroll.length} elemento(s) [data-reveal] quedan ocultos (opacidad <0.05, clip-path inset(100% o visibility hidden): ${row.hiddenAfterScroll.map((h) => h.sel).slice(0, 6).join(', ')}.`);
  }

  // M3 · animaciones scroll-driven.
  if (project.scenario === 'reduce') {
    if (row.scrollDrivenMax > 0) {
      fail('M3', `Con prefers-reduced-motion: reduce se crearon ${row.scrollDrivenMax} animaciones scroll-driven; deben ser 0.`);
    }
    if (row.afterScroll.decorated > 0) {
      fail('R1', `Con reduce hay ${row.afterScroll.decorated} elementos [data-reveal]; el motor no debe decorar nada.`);
    }
    if (row.afterScroll.pending > 0) {
      fail('R2', `Con reduce quedan ${row.afterScroll.pending} pendientes.`);
    }
    if (row.atLoad.revealReady || row.afterScroll.revealReady) {
      fail('R3', 'Con reduce <html> lleva data-reveal-ready; el motor no debe arrancar.');
    }
  } else if (project.scenario === 'fallback') {
    // Rama @supports not. Aqui NO debe haber timelines de scroll, y el revelado tiene
    // que llegar por IntersectionObserver.
    if (project.requireNoNativeSupport && nativeSupported) {
      row.prefEffective = false;
      row.noMeasureReason = 'El navegador declara soporte de animation-timeline: view() a pesar de la preferencia layout.css.scroll-driven-animations.enabled=false. La rama de respaldo NO se ejercito: resultado no concluyente.';
      // El axioma anti-invisible NO depende de que rama se haya ejercitado: si M2 ya
      // encontro algo oculto, eso es FALLA y no se disuelve en un "no medible".
      row.verdict = row.failures.length ? 'FALLA' : 'NO_MEDIBLE';
      return row;
    }
    row.prefEffective = true;
    if (row.scrollDrivenMax > 0) {
      fail('F1', `Sin soporte scroll-driven aparecen ${row.scrollDrivenMax} animaciones con timeline de scroll: imposible, revisa la medicion.`);
    }
    if (!row.afterScroll.revealReady) {
      fail('F2', 'El motor IntersectionObserver no arranco (<html> sin data-reveal-ready) en la rama de respaldo.');
    }
    if (row.afterScroll.decorated > 0 && row.afterScroll.revealedMark === 0) {
      fail('F3', `Hay ${row.afterScroll.decorated} elementos decorados y ninguno con data-revealed: el respaldo no revelo nada.`);
    }
    if (row.afterScroll.decorated === 0) {
      warn('F3', 'Ningun elemento fue decorado en esta ruta: todo estaba sobre el pliegue. La rama de respaldo no se ejercito aqui.');
    }
  } else {
    // Rama nativa.
    if (!nativeSupported) {
      warn('M3', `El navegador no soporta el motor nativo (view-timeline=${row.support.viewTimeline}, animation-range=${row.support.animationRange}): la exigencia de animaciones scroll-driven no aplica en esta fila.`);
      row.m3Applicable = false;
    } else if (row.mode.effective !== 'full') {
      warn('M3', `html[data-animations]="${row.mode.effective}": el motor scroll-driven solo vive en "full", asi que la exigencia no aplica. Fuerza el modo con MOTION_FORCE_MODE=full.`);
      row.m3Applicable = false;
    } else if (row.scrollDrivenMax === 0 && row.afterScroll.decorated === 0 && row.atLoad.decorated === 0) {
      // Ni un objetivo decorado en toda la ruta: no hay coreografia que exigir aqui. Se
      // declara no aplicable con el motivo, en vez de un rojo que no significa nada.
      warn('M3', 'La ruta no decoro ni un objetivo ([data-reveal] = 0 antes y despues del recorrido): no hay coreografia scroll-driven que exigir. Revisa si la tienda tiene esas secciones configuradas.');
      row.m3Applicable = false;
    } else if (row.scrollDrivenMax === 0) {
      row.m3Applicable = true;
      fail('M3', `Con soporte nativo y modo full no se observo ni una animacion scroll-driven durante el recorrido, pese a haber ${row.afterScroll.decorated} objetivo(s) decorado(s).`);
    } else {
      row.m3Applicable = true;
    }
    // El motor se apaga a proposito en modo none: solo se exige que arranque cuando el
    // modo efectivo lo permite.
    if (row.mode.effective !== 'none' && !row.afterScroll.revealReady) {
      fail('M0', 'El motor JS no arranco: <html> sin data-reveal-ready (y el modo no es none ni reduce).');
    }
  }

  // M4 · GSAP fuera.
  if (!row.gsap.gsapUndefined) fail('M4', 'window.gsap esta definido: queda motor GSAP cargado.');
  if (!row.gsap.scrollTriggerUndefined) fail('M4', 'window.ScrollTrigger esta definido: queda ScrollTrigger cargado.');

  // M5 · ningun script de gsap/motion.
  if (row.scripts.themeOffenders.length) {
    fail('M5', `Scripts del tema con "gsap"/"motion" en la URL: ${row.scripts.themeOffenders.join(', ')}.`);
  }
  const foreign = row.scripts.offenders.filter((s) => !row.scripts.themeOffenders.includes(s));
  if (foreign.length) {
    warn('M5', `Scripts NO del tema cuya URL contiene "gsap"/"motion" (plataforma o app, no tumban al tema): ${foreign.join(', ')}.`);
  }
  if (row.scripts.inlineGsapMentions > 0) {
    fail('M5', `${row.scripts.inlineGsapMentions} script(s) en linea mencionan gsap/ScrollTrigger.`);
  }

  // M6 · CLS.
  if (!row.cls.supported) {
    warn('M6', 'Este navegador no implementa la entrada layout-shift: el CLS de esta fila es NO MEDIBLE, no 0.');
    row.cls.value = null;
  } else if (row.cls.value === null) {
    warn('M6', 'No se pudo leer el acumulador de CLS.');
  } else if (row.cls.value >= CLS_MAX) {
    fail('M6', `CLS durante el scroll = ${row.cls.value} (limite ${CLS_MAX}).`);
  }

  // M7 · 40 tabulaciones.
  if (!row.keyboard.measured) {
    warn('M7', row.keyboard.noMeasureReason);
  } else if (row.keyboard.invisibleFocus.length) {
    fail('M7', `${row.keyboard.invisibleFocus.length} tabulacion(es) aterrizan en un elemento invisible: ${row.keyboard.invisibleFocus.map((f) => `${f.id} dentro de ${f.culprit}`).slice(0, 4).join(' | ')}.`);
  }

  // M8 · captura a mitad de gesto.
  if (Array.isArray(row.midGesture) && row.midGesture.length && !row.midGesture.some((s) => s.midGesture)) {
    warn('M8', 'Se guardaron capturas, pero ninguna quedo con el gesto a medio recorrido: revisa los PNG a mano antes de darlas por evidencia.');
  }

  row.verdict = row.failures.length ? 'FALLA' : 'PASA';
  return row;
}

// -----------------------------------------------------------------------------
// 6. Estados degenerados (Gate 2). Se resuelven contra el catalogo REAL. Lo que no
//    sea alcanzable con el contenido de la tienda se marca alcanzable: false con su
//    motivo; el arnes no inventa un resultado.
// -----------------------------------------------------------------------------
async function resolveDegenerate(page) {
  const catalog = await page.evaluate(READ_CATALOG);
  const states = [];
  const push = (estado, ruta, alcanzable, motivo) => states.push({ estado, ruta, alcanzable, motivo });

  if (!catalog.ok) {
    for (const estado of ['vacio', 'unico', 'masivo', 'muy-largo', 'falta-imagen']) {
      push(estado, null, false, `No se pudo inventariar el catalogo (/collections.json, /products.json): ${catalog.error}.`);
    }
    return { catalog, states };
  }

  // Los recuentos que la API no da se preguntan coleccion a coleccion (maximo 12 para
  // no castigar el limitador de la tienda).
  const collections = [];
  for (const c of catalog.collections.slice(0, 40)) {
    let count = c.count;
    if (count === null && collections.filter((x) => x.probed).length < 12) {
      count = await page.evaluate(COUNT_COLLECTION, c.handle);
      collections.push({ ...c, count, probed: true });
      continue;
    }
    collections.push({ ...c, count, probed: false });
  }

  const empty = collections.find((c) => c.count === 0);
  push('vacio', empty ? `/collections/${empty.handle}` : null, Boolean(empty),
    empty ? `Coleccion "${empty.title}" con 0 productos.` : 'Ninguna coleccion publica de esta tienda tiene 0 productos.');

  const single = collections.find((c) => c.count === 1);
  push('unico', single ? `/collections/${single.handle}` : null, Boolean(single),
    single ? `Coleccion "${single.title}" con 1 producto.` : 'Ninguna coleccion publica de esta tienda tiene exactamente 1 producto.');

  // "Masivo": la rejilla mas grande disponible. Aviso importante: `products_per_page`
  // es un ajuste de seccion (min 8, max 48, por defecto 24, sections/main-collection.liquid)
  // y NO se puede pedir por URL, asi que "50 por pagina" es inalcanzable desde fuera;
  // el techo real del tema son 48.
  push('masivo', '/collections/all', catalog.products.length > 0,
    `/collections/all con ${catalog.products.length} productos en catalogo. products_per_page es ajuste de seccion (max 48): 50 por pagina no es alcanzable desde la URL; se mide la rejilla rendida tal cual.`);

  const long = catalog.products.find((p) => p.titleLength >= 120);
  push('muy-largo', long ? `/products/${long.handle}` : null, Boolean(long),
    long ? `Producto "${long.handle}" con titulo de ${long.titleLength} caracteres.` : 'Ningun producto de esta tienda tiene un titulo de 120+ caracteres.');

  const noImage = catalog.products.find((p) => p.images === 0);
  push('falta-imagen', noImage ? `/products/${noImage.handle}` : null, Boolean(noImage),
    noImage ? `Producto "${noImage.handle}" sin imagenes: cae en placeholder_svg_tag.` : 'Ningun producto de esta tienda esta sin imagenes. El placeholder de las secciones del homepage depende de ajustes de seccion y no se puede provocar desde la URL: se detecta por DOM si aparece.');

  const oneImage = catalog.products.find((p) => p.images === 1);
  push('unica-imagen-galeria', oneImage ? `/products/${oneImage.handle}` : null, Boolean(oneImage),
    oneImage ? `Producto "${oneImage.handle}" con 1 sola imagen de galeria.` : 'Ningun producto de esta tienda tiene exactamente 1 imagen.');

  return { catalog: { collections, products: catalog.products.length }, states };
}

// Mide una ruta degenerada con el nucleo del contrato (sin teclado ni capturas: eso
// ya se cubrio en las 4 rutas principales; aqui interesa el axioma anti-invisible).
async function measureDegenerate(context, entry) {
  const page = await context.newPage();
  const out = { ...entry, measured: false, noMeasureReason: null, failures: [] };
  try {
    const response = await page.goto(BASE + entry.ruta, { waitUntil: 'load' });
    out.status = response ? response.status() : null;
    await page.waitForTimeout(1200);
    const pre = await page.evaluate(READ_STATE);
    if (!out.status || out.status >= 400 || !pre.loaded.hasMain) {
      out.noMeasureReason = `La ruta no rindio contenido util (HTTP ${out.status}).`;
      return out;
    }
    out.themeJsRan = pre.loaded.themeJsRan;
    // Mismo control positivo que en las rutas principales: sin theme.js, los ceros no
    // prueban nada.
    if (!pre.loaded.themeJsRan) out.failures.push('theme.js no se ejecuto en esta carga: el motor de revelado no existe.');
    const walk = await traverse(page, { step: 420, settleMs: 90 });
    const post = await page.evaluate(READ_STATE);
    out.engine = post.engine;
    out.hidden = await page.evaluate(READ_HIDDEN);
    out.scrollDrivenMax = walk.maxScrollDriven;
    out.grid = await page.evaluate(() => ({
      cards: document.querySelectorAll('.product-grid__item').length,
      emptyState: Boolean(document.querySelector('.collection__empty, .product-grid__empty')),
      // "falta el asset": el unveil tiene que actuar sobre el <svg> del placeholder.
      placeholderSvgInReveal: document.querySelectorAll('[data-reveal] svg').length,
      placeholderUnveiled: Array.from(document.querySelectorAll('[data-reveal] svg'))
        .map((s) => (s.getAnimations ? s.getAnimations().map((a) => a.animationName || 'anonima') : []))
        .flat(),
      marqueeItemsPerGroup: (() => {
        const group = document.querySelector('.marquee-banner__group');
        return group ? group.children.length : null;
      })(),
      longestHeading: Math.max(0, ...Array.from(document.querySelectorAll('h1, h2, h3, .product-card__title'))
        .map((h) => h.textContent.trim().length)),
      galleryItems: document.querySelectorAll('.product-gallery__item, .product-gallery__media').length,
    }));
    out.scrollable = Math.max(0, post.loaded.docHeight - post.loaded.innerHeight);
    if (post.engine.pending > 0) out.failures.push(`Quedan ${post.engine.pending} elementos con data-reveal="" tras recorrer ${entry.estado}.`);
    if (out.hidden.length > 0) out.failures.push(`${out.hidden.length} elementos [data-reveal] quedan ocultos en ${entry.estado}.`);
    out.measured = true;
  } catch (error) {
    out.noMeasureReason = `Excepcion: ${String(error && error.message ? error.message : error).slice(0, 240)}`;
  } finally {
    await page.close().catch(() => {});
  }
  out.verdict = out.measured ? (out.failures.length ? 'FALLA' : 'PASA') : 'NO_MEDIBLE';
  return out;
}

// -----------------------------------------------------------------------------
// 7. Ejecucion.
// -----------------------------------------------------------------------------
const results = {
  harness: 'MOTION-002',
  task: 'T5',
  script: '01-motion-check.mjs',
  timestamp: new Date().toISOString(),
  base: BASE,
  store: localTarget ? null : STORE_KEY,
  config: {
    viewport: VIEWPORT,
    routes: ROUTES,
    shortRoute: process.env.MOTION_SHORT_ROUTE || null,
    forceMode: FORCE_MODE,
    clsMax: CLS_MAX,
    tabPresses: TAB_PRESSES,
    projects: PROJECTS.map((p) => p.name),
    localTarget,
    notes: missingRouteNotes,
  },
  contract: {
    attributes: ['data-reveal=""', 'data-reveal="done"', 'data-revealed', 'html[data-reveal-ready]', 'html[data-animations]'],
    expectedKeyframes: EXPECTED_KEYFRAMES,
  },
  projects: [],
  degenerate: { resolved: null, rows: [] },
  shortRoute: null,
  keyframes: { expected: EXPECTED_KEYFRAMES, observed: [], notObserved: EXPECTED_KEYFRAMES.slice() },
  gates: [],
  summary: {},
  verdict: 'INCOMPLETO',
};

const observedKeyframes = new Set();
let degenerateResolved = null;
// ¿Hay algun proyecto que NO sea reduce? De ser asi, los estados degenerados y la ruta
// corta se miden en uno de esos: medirlos bajo reduce daria ceros vacios.
const preferNonReduce = PROJECTS.some((p) => p.scenario !== 'reduce');

for (const project of PROJECTS) {
  const record = { name: project.name, browser: project.browser, scenario: project.scenario, launched: false, skipped: null, browserVersion: null, rows: [], printRows: [] };
  results.projects.push(record);

  let browser = null;
  try {
    browser = await project.engine.launch({ headless: true, ...project.launch });
    record.launched = true;
    record.browserVersion = browser.version();
  } catch (error) {
    // Un navegador que no arranca NO puede pasar por verde: la fila queda NO MEDIBLE
    // y el veredicto agregado baja a INCOMPLETO.
    record.skipped = `No se pudo lanzar ${project.browser}: ${String(error && error.message ? error.message : error).slice(0, 200)}. Instalalo con: npx playwright install ${project.browser}`;
    console.error(`[${project.name}] ${record.skipped}`);
    continue;
  }

  try {
    const context = await browser.newContext({ viewport: VIEWPORT, ...project.context });
    await context.addInitScript(INIT_CLS);
    if (project.forceMode) await context.addInitScript(INIT_MODE, project.forceMode);
    if (!localTarget) await lib.unlock(context, BASE);

    for (const route of (PRINT_ONLY ? [] : ROUTES)) {
      const row = judge(await measureRoute(context, project, route), project);
      record.rows.push(row);
      (row.traverse ? row.traverse.names : []).forEach((n) => observedKeyframes.add(n));
      (row.animationsAtLoad ? row.animationsAtLoad.names : []).forEach((n) => observedKeyframes.add(n));
      (row.animationsAfterScroll ? row.animationsAfterScroll.names : []).forEach((n) => observedKeyframes.add(n));
      console.log(
        `[${project.name}] ${route.padEnd(30)} ${String(row.verdict).padEnd(11)} http=${row.status} `
        + `soporte=${row.support ? `${row.support.viewTimeline}/${row.support.animationRange}` : '-'} `
        + `themeJs=${row.loaded ? row.loaded.themeJsRan : '-'} `
        + `modo=${row.mode ? row.mode.effective : '-'} ready=${row.afterScroll ? row.afterScroll.revealReady : '-'} `
        + `pend=${row.afterScroll ? row.afterScroll.pending : '-'} ocultos=${row.hiddenAfterScroll ? row.hiddenAfterScroll.length : '-'} `
        + `scrollAnim=${row.scrollDrivenMax ?? '-'} gsap=${row.gsap ? !row.gsap.gsapUndefined : '-'} `
        + `cls=${row.cls ? (row.cls.supported ? row.cls.value : 'n/d') : '-'} `
        + `focoInv=${row.keyboard ? row.keyboard.invisibleFocus.length : '-'} err=${row.errors.length}`,
      );
      row.failures.forEach((f) => console.log(`    FALLA  ${f}`));
      row.warnings.forEach((w) => console.log(`    aviso  ${w}`));
      if (row.noMeasureReason) console.log(`    n/m    ${row.noMeasureReason}`);
    }

    // Los estados degenerados y la ruta corta se miden UNA vez, en el primer proyecto
    // que arranque: el axioma anti-invisible ya se cruza con los tres escenarios en las
    // 4 rutas principales, y repetirlos aqui solo castigaria el limitador de la tienda.
    //
    // PERO nunca bajo `reduce` si hay otro proyecto disponible: con reduce el motor no
    // decora nada, asi que "0 pendientes" seria cierto y vacio a la vez, y G8/G9 darian
    // verde sin haber probado la coreografia. Si solo se pidio reduce, se mide igual y
    // las puertas lo degradan a NO_MEDIBLE.
    if (PRINT_CHECK && project.printCheck) {
      for (const route of ROUTES) {
        const row = await measurePrint(context, project, route);
        record.printRows.push(row);
        const p = row.print || {};
        console.log(
          `[${project.name}] PRINT ${route.padEnd(24)} ${String(row.verdict).padEnd(11)} http=${row.status} `
          + `modo=${p.mode ?? '-'} ready=${p.revealReady ?? '-'} pendPantalla=${row.screenAtLoad ? row.screenAtLoad.pending : '-'} `
          + `objetivos=${p.inspected ?? '-'}/${p.targets ?? '-'} sinCaja=${p.notRendered ?? '-'} ocultos=${p.hidden ? p.hidden.length : '-'} `
          + `pdf=${row.pdf ? row.pdf.file + ' (' + row.pdf.bytes + ' B)' : '-'}`,
        );
        row.failures.forEach((f) => console.log(`    FALLA  ${f}`));
        row.warnings.forEach((w) => console.log(`    aviso  ${w}`));
        if (row.noMeasureReason) console.log(`    n/m    ${row.noMeasureReason}`);
      }
    }

    if (!PRINT_ONLY && !degenerateResolved && (!preferNonReduce || project.scenario !== 'reduce')) {
      const probe = await context.newPage();
      try {
        await probe.goto(BASE + '/', { waitUntil: 'load' });
        degenerateResolved = await resolveDegenerate(probe);
      } catch (error) {
        degenerateResolved = { catalog: null, states: [], error: String(error && error.message ? error.message : error) };
      } finally {
        await probe.close().catch(() => {});
      }
      results.degenerate.resolved = degenerateResolved;
      results.degenerate.measuredBy = project.name;
      results.degenerate.scenario = project.scenario;

      for (const entry of degenerateResolved.states) {
        if (!entry.alcanzable || !entry.ruta) {
          results.degenerate.rows.push({ ...entry, measured: false, verdict: 'NO_ALCANZABLE', noMeasureReason: entry.motivo });
          console.log(`[degenerado] ${String(entry.estado).padEnd(22)} NO_ALCANZABLE  ${entry.motivo}`);
          continue;
        }
        const row = await measureDegenerate(context, entry);
        results.degenerate.rows.push(row);
        console.log(
          `[degenerado] ${String(row.estado).padEnd(22)} ${String(row.verdict).padEnd(13)} ${row.ruta} `
          + `pend=${row.engine ? row.engine.pending : '-'} ocultos=${row.hidden ? row.hidden.length : '-'} `
          + `tarjetas=${row.grid ? row.grid.cards : '-'} svgEnReveal=${row.grid ? row.grid.placeholderSvgInReveal : '-'} `
          + `titularMax=${row.grid ? row.grid.longestHeading : '-'}`,
        );
        row.failures.forEach((f) => console.log(`    FALLA  ${f}`));
      }

      // Ruta corta: guardia de fin de pagina. Preferencia: la indicada por entorno; si
      // no, la coleccion de 1 producto que haya salido del catalogo; si no, /pages/contact.
      const singleState = degenerateResolved.states.find((s) => s.estado === 'unico' && s.alcanzable);
      const shortRoute = process.env.MOTION_SHORT_ROUTE || (singleState ? singleState.ruta : '/pages/contact');
      const shortRow = await measureDegenerate(context, { estado: 'ruta-corta', ruta: shortRoute, alcanzable: true, motivo: 'Guardia de fin de pagina: rango de entrada que puede no completarse nunca.' });
      // Si la ruta no era corta de verdad, NO prueba la guardia. Se degrada a no medible,
      // salvo que ya traiga fallos: un oculto sigue siendo un oculto.
      if (shortRow.measured && !shortRow.failures.length && shortRow.scrollable > SHORT_ROUTE_MAX_SCROLL) {
        shortRow.warnings = [`La ruta tiene ${shortRow.scrollable} px de scroll: no es realmente corta, asi que NO prueba la guardia de fin de pagina. Pasa otra con MOTION_SHORT_ROUTE.`];
        shortRow.verdict = 'NO_MEDIBLE';
        shortRow.noMeasureReason = shortRow.warnings[0];
      }
      results.shortRoute = { ...shortRow, measuredBy: project.name, scenario: project.scenario };
      console.log(`[ruta-corta] ${String(shortRow.verdict).padEnd(13)} ${shortRoute} scroll=${shortRow.scrollable ?? '-'}px pend=${shortRow.engine ? shortRow.engine.pending : '-'}`);
    }

    await context.close();
  } catch (error) {
    // Un desbloqueo que no sale (limitador de contrasena de Shopify) o un fallo
    // inesperado NO deben tirar el proceso sin escribir resultados: el motivo se anota
    // en el proyecto, el veredicto baja a INCOMPLETO y el JSON se escribe igual.
    record.error = String(error && error.message ? error.message : error).slice(0, 400);
    record.skipped = record.skipped || `Proyecto interrumpido: ${record.error}`;
    console.error(`[${project.name}] ${record.skipped}`);
  } finally {
    await browser.close().catch(() => {});
  }
}

// -----------------------------------------------------------------------------
// 8. Keyframes observados y puertas agregadas.
// -----------------------------------------------------------------------------
results.keyframes.observed = EXPECTED_KEYFRAMES.filter((k) => observedKeyframes.has(k));
results.keyframes.notObserved = EXPECTED_KEYFRAMES.filter((k) => !observedKeyframes.has(k));
results.keyframes.allObservedNames = [...observedKeyframes].sort();

const allRows = results.projects.flatMap((p) => p.rows);
const degenRows = results.degenerate.rows.filter((r) => r.verdict !== 'NO_ALCANZABLE');
const judgeable = [...allRows, ...degenRows, ...(results.shortRoute ? [results.shortRoute] : [])];

// Un proyecto que arranco pero se interrumpio a medias tampoco esta completo: `skipped`
// cubre los dos casos (no arranco / se quedo a medias).
const notLaunched = results.projects.filter((p) => !p.launched || p.skipped);
const notMeasured = judgeable.filter((r) => r.verdict === 'NO_MEDIBLE');
// Se cuenta por `failures`, NO por `verdict`: cualquier degradacion posterior a
// NO_MEDIBLE no puede enterrar un fallo duro ya detectado.
const failed = judgeable.filter((r) => (r.failures || []).length > 0);
const printRows = results.projects.flatMap((p) => p.printRows || []);
failed.push(...printRows.filter((r) => r.failures.length));
notMeasured.push(...printRows.filter((r) => r.verdict === 'NO_MEDIBLE'));

const gate = (id, nombre, estado, detalle) => results.gates.push({ id, nombre, estado, detalle });

gate('G0', 'Todos los proyectos arrancaron y terminaron',
  notLaunched.length ? 'NO_MEDIBLE' : 'PASA',
  notLaunched.length ? notLaunched.map((p) => `${p.name}: ${p.skipped}`).join(' | ') : `${results.projects.length} proyecto(s) completados.`);

if (!PRINT_ONLY) {
const axiomRows = judgeable.filter((r) => r.measured);
const axiomBreaches = axiomRows.filter((r) => (r.afterScroll ? r.afterScroll.pending : (r.engine ? r.engine.pending : 0)) > 0
  || ((r.hiddenAfterScroll || r.hidden || []).length > 0));
gate('G1', 'Axioma anti-invisible: 0 pendientes y 0 ocultos tras recorrer',
  axiomRows.length === 0 ? 'NO_MEDIBLE' : (axiomBreaches.length ? 'FALLA' : 'PASA'),
  axiomRows.length === 0 ? 'Ninguna fila se midio.' : (axiomBreaches.length
    ? axiomBreaches.map((r) => `${r.project || r.estado} ${r.route || r.ruta}`).join(', ')
    : `${axiomRows.length} fila(s) medidas sin un solo elemento oculto.`));

const nativeRows = allRows.filter((r) => r.scenario === 'full' && r.measured && r.m3Applicable === true);
gate('G2', 'Motor nativo: animaciones scroll-driven > 0 en modo full con soporte',
  nativeRows.length === 0 ? 'NO_MEDIBLE' : (nativeRows.some((r) => r.scrollDrivenMax === 0) ? 'FALLA' : 'PASA'),
  nativeRows.length === 0
    ? 'Ninguna fila cumplio las condiciones (soporte nativo + modo full): el motor nativo NO se ejercito.'
    : `${nativeRows.length} fila(s): ${nativeRows.map((r) => `${r.route}=${r.scrollDrivenMax}`).join(', ')}.`);

const reduceRows = allRows.filter((r) => r.scenario === 'reduce' && r.measured);
gate('G3', 'prefers-reduced-motion: reduce apaga el motor por completo',
  reduceRows.length === 0 ? 'NO_MEDIBLE' : (reduceRows.some((r) => r.failures.length) ? 'FALLA' : 'PASA'),
  reduceRows.length === 0 ? 'El escenario reduce no se midio.' : reduceRows.map((r) => `${r.route}: reveal=${r.afterScroll.decorated} scrollAnim=${r.scrollDrivenMax} ready=${r.afterScroll.revealReady}`).join(' | '));

const fallbackRows = allRows.filter((r) => r.scenario === 'fallback');
const fallbackMeasured = fallbackRows.filter((r) => r.verdict === 'PASA' || r.verdict === 'FALLA');
gate('G4', 'Rama @supports not: el respaldo IntersectionObserver revela',
  fallbackMeasured.length === 0 ? 'NO_MEDIBLE' : (fallbackMeasured.some((r) => r.failures.length) ? 'FALLA' : 'PASA'),
  fallbackMeasured.length === 0
    ? (fallbackRows.length ? fallbackRows.map((r) => r.noMeasureReason).filter(Boolean)[0] : 'El proyecto de Firefox no corrio.')
    : `${fallbackMeasured.length} fila(s) con data-revealed presente y nada oculto.`);

const gsapRows = judgeable.filter((r) => r.measured && r.gsap);
gate('G5', 'GSAP erradicado (window.gsap/ScrollTrigger y scripts del tema)',
  gsapRows.length === 0 ? 'NO_MEDIBLE' : (gsapRows.some((r) => !r.gsap.gsapUndefined || !r.gsap.scrollTriggerUndefined || r.scripts.themeOffenders.length || r.scripts.inlineGsapMentions) ? 'FALLA' : 'PASA'),
  gsapRows.length === 0 ? 'Ninguna fila se midio.' : `${gsapRows.length} fila(s) sin gsap ni ScrollTrigger y sin script del tema con "gsap"/"motion".`);

const clsRows = allRows.filter((r) => r.measured && r.cls && r.cls.supported && r.cls.value !== null);
gate('G6', `CLS durante el scroll < ${CLS_MAX}`,
  clsRows.length === 0 ? 'NO_MEDIBLE' : (clsRows.some((r) => r.cls.value >= CLS_MAX) ? 'FALLA' : 'PASA'),
  clsRows.length === 0
    ? 'Ningun navegador de los ejecutados implementa layout-shift: el CLS no se midio (Firefox nunca lo hace).'
    : `maximo ${Math.max(...clsRows.map((r) => r.cls.value))} en ${clsRows.length} fila(s).`);

const kbRows = allRows.filter((r) => r.measured && r.keyboard && r.keyboard.measured);
gate('G7', `${TAB_PRESSES} tabulaciones sin foco invisible (WCAG 2.4.7 / 2.4.11)`,
  kbRows.length === 0 ? 'NO_MEDIBLE' : (kbRows.some((r) => r.keyboard.invisibleFocus.length) ? 'FALLA' : 'PASA'),
  kbRows.length === 0 ? 'Ningun recorrido de teclado fue concluyente.' : `${kbRows.length} recorrido(s), ${kbRows.reduce((a, r) => a + r.keyboard.distinctFocusables, 0)} destinos distintos, 0 invisibles.`);

// Bajo `reduce` el motor no decora nada: cualquier 0 de estas dos puertas seria cierto
// y vacio al mismo tiempo, asi que se declara NO MEDIBLE salvo que haya fallos reales.
const degenVacuous = results.degenerate.scenario === 'reduce';
const degenVacuousNote = degenVacuous
  ? ' MEDIDO BAJO prefers-reduced-motion: reduce, donde el motor no decora nada: no prueba la coreografia. Ejecuta tambien chromium-full.'
  : '';

gate('G8', 'Guardia de fin de pagina en ruta corta',
  !results.shortRoute ? 'NO_MEDIBLE'
    : ((results.shortRoute.failures || []).length ? 'FALLA'
      : (results.shortRoute.verdict === 'PASA' && !degenVacuous ? 'PASA' : 'NO_MEDIBLE')),
  results.shortRoute
    ? `${results.shortRoute.ruta}: scroll=${results.shortRoute.scrollable ?? 'n/d'}px, pendientes=${results.shortRoute.engine ? results.shortRoute.engine.pending : 'n/d'}. ${results.shortRoute.noMeasureReason || ''}${degenVacuousNote}`.trim()
    : 'No se midio.');

const degenReachable = results.degenerate.rows.filter((r) => r.verdict !== 'NO_ALCANZABLE');
gate('G9', 'Estados degenerados (Gate 2 del proyecto)',
  degenReachable.length === 0 ? 'NO_MEDIBLE'
    : (degenReachable.some((r) => r.verdict === 'FALLA') ? 'FALLA'
      : (degenVacuous || degenReachable.some((r) => r.verdict === 'NO_MEDIBLE') ? 'NO_MEDIBLE' : 'PASA')),
  `${results.degenerate.rows.map((r) => `${r.estado}=${r.verdict}`).join(', ') || 'Sin resolver.'}${degenVacuousNote}`);

const capturas = allRows.flatMap((r) => r.midGesture || []);
gate('G10', 'Capturas a mitad de gesto',
  capturas.length === 0 ? 'NO_MEDIBLE' : (capturas.some((s) => s.midGesture) ? 'PASA' : 'NO_MEDIBLE'),
  `${capturas.length} PNG en evidence/, ${capturas.filter((s) => s.midGesture).length} con el gesto verificado a medio recorrido.`);
}

if (PRINT_CHECK) {
  const printMeasured = printRows.filter((r) => r.measured);
  const printFull = printMeasured.filter((r) => r.scenario === 'full');
  const exercised = printFull.filter((r) => r.printExercised);
  gate('G11', 'Contenido revelado al imprimir (media print sin scroll + PDF)',
    printMeasured.length === 0 ? 'NO_MEDIBLE'
      : (printMeasured.some((r) => r.failures.length) ? 'FALLA'
        : (printRows.some((r) => r.verdict === 'NO_MEDIBLE') || (printFull.length && !exercised.length) || printMeasured.some((r) => !r.pdf) ? 'NO_MEDIBLE' : 'PASA')),
    printMeasured.length === 0
      ? 'Ninguna fila de impresion se midio (solo corre en proyectos Chromium).'
      : printRows.map((r) => `${r.project} ${r.route}: pend=${r.screenAtLoad ? r.screenAtLoad.pending : 'n/d'} ocultos=${r.print ? r.print.hidden.length : 'n/d'} pdf=${r.pdf ? 'si' : 'no'}`).join(' | '));
}

results.summary = {
  rowsTotal: judgeable.length,
  rowsMeasured: judgeable.filter((r) => r.measured).length,
  rowsFailed: failed.length,
  rowsNotMeasured: notMeasured.length,
  projectsIncomplete: notLaunched.map((p) => ({ name: p.name, launched: p.launched, reason: p.skipped })),
  hardFailures: failed.flatMap((r) => (r.failures || []).map((f) => `${r.project || r.estado} ${r.route || r.ruta} :: ${f}`)),
  notMeasuredReasons: notMeasured.map((r) => `${r.project || r.estado} ${r.route || r.ruta} :: ${r.noMeasureReason}`),
};

// Veredicto. APTO exige que no haya ni un fallo duro Y que no quede nada sin medir:
// un 0 que viene de "no se pudo medir" jamas cuenta como aprobado.
if (results.gates.some((g) => g.estado === 'FALLA') || failed.length) results.verdict = 'NO_APTO';
else if (results.gates.some((g) => g.estado === 'NO_MEDIBLE') || notMeasured.length || notLaunched.length) results.verdict = 'INCOMPLETO';
else results.verdict = 'APTO';

fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

console.log('\n--- PUERTAS -------------------------------------------------------------');
for (const g of results.gates) console.log(`${g.id.padEnd(4)} ${g.estado.padEnd(11)} ${g.nombre}\n     ${g.detalle}`);
console.log('\nKeyframes observados :', results.keyframes.observed.join(', ') || '(ninguno)');
console.log('Keyframes NO vistos  :', results.keyframes.notObserved.join(', ') || '(ninguno)');
console.log(`\nVEREDICTO: ${results.verdict}  (filas ${results.summary.rowsMeasured}/${results.summary.rowsTotal} medidas, ${results.summary.rowsFailed} con fallo)`);
console.log(`Resultados: ${resultsFile}`);
if (results.verdict === 'NO_APTO') process.exitCode = 1;
