// Automated Responsive Matrix and Visual Geometry Audit (Role 4 - TECH-AUDIT-001)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Validate storefront password before importing harness library
if (!process.env.STOREFRONT_PASSWORD) {
  console.error('[SECURITY FATAL] STOREFRONT_PASSWORD environment variable is required.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');

const { launch, unlock } = await import('../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs');

const OUTPUT_JSON_PATH = path.join(__dirname, 'raw-responsive-matrix.json');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// Viewports configuration (8 required widths, standard height 850px)
const VIEWPORTS = [
  { width: 320, height: 850, label: 'Mobile Mini (320px)' },
  { width: 375, height: 850, label: 'Mobile Standard (375px)' },
  { width: 390, height: 850, label: 'Mobile Modern (390px)' },
  { width: 768, height: 850, label: 'Tablet Portrait (768px)' },
  { width: 1024, height: 850, label: 'Tablet Landscape / Laptop (1024px)' },
  { width: 1280, height: 850, label: 'Desktop Standard (1280px)' },
  { width: 1440, height: 850, label: 'Desktop Widescreen (1440px)' },
  { width: 1920, height: 850, label: 'Desktop Full HD (1920px)' }
];

// Target stores and key pages
const STORES = {
  atelier: {
    handle: 'sartorial-atelier',
    domain: 'sartorial-atelier.myshopify.com',
    baseUrl: 'https://sartorial-atelier.myshopify.com',
    pages: [
      { key: 'home', path: '/', url: 'https://sartorial-atelier.myshopify.com/' },
      { key: 'collection', path: '/collections/all', url: 'https://sartorial-atelier.myshopify.com/collections/all' },
      { key: 'pdp', path: '/products/serra-coat', url: 'https://sartorial-atelier.myshopify.com/products/serra-coat' }
    ]
  },
  edition: {
    handle: 'sartorial-edition',
    domain: 'sartorial-edition.myshopify.com',
    baseUrl: 'https://sartorial-edition.myshopify.com',
    pages: [
      { key: 'home', path: '/', url: 'https://sartorial-edition.myshopify.com/' },
      { key: 'collection', path: '/collections/all', url: 'https://sartorial-edition.myshopify.com/collections/all' },
      { key: 'pdp', path: '/products/structured-tote', url: 'https://sartorial-edition.myshopify.com/products/structured-tote' }
    ]
  },
  archive: {
    handle: 'sartorial-archive',
    domain: 'sartorial-archive.myshopify.com',
    baseUrl: 'https://sartorial-archive.myshopify.com',
    pages: [
      { key: 'home', path: '/', url: 'https://sartorial-archive.myshopify.com/' },
      { key: 'collection', path: '/collections/all', url: 'https://sartorial-archive.myshopify.com/collections/all' },
      { key: 'pdp', path: '/products/1990-pinstripe-double-breasted-jacket', url: 'https://sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket' }
    ]
  }
};

const MIN_GAP_MS = 2500;
let lastNav = 0;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function paceNavigation() {
  const elapsed = Date.now() - lastNav;
  const wait = Math.max(0, MIN_GAP_MS - elapsed);
  if (wait > 0) {
    await sleep(wait);
  }
  lastNav = Date.now();
}

console.log('================================================================');
console.log(' AUDITORÍA DE MATRIZ RESPONSIVE Y GEOMETRÍA VISUAL (ROL 4)');
console.log(' 3 Tiendas × 3 Páginas Clave × 8 Viewports = 72 Estados');
console.log(` Screenshots Dir: ${SCREENSHOTS_DIR}`);
console.log(` Raw JSON Output: ${OUTPUT_JSON_PATH}`);
console.log('================================================================\n');

const startTime = Date.now();
const allResults = [];
let overallHorizontalOverflows = 0;
let overallCollisions = 0;
let overallClippings = 0;

const browser = await launch();

try {
  for (const [storeKey, store] of Object.entries(STORES)) {
    console.log(`\n============================================================`);
    console.log(` PROCESANDO TIENDA: ${store.handle.toUpperCase()}`);
    console.log(` URL Base: ${store.baseUrl}`);
    console.log(`============================================================`);

    const context = await browser.newContext({
      viewport: { width: 1280, height: 850 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    });

    console.log(`  Desbloqueando sesión storefront (${store.handle})...`);
    await unlock(context, store.baseUrl);
    console.log(`  Sesión desbloqueada con éxito.`);

    const page = await context.newPage();

    for (const pageItem of store.pages) {
      await paceNavigation();
      console.log(`\n  --- Cargando página: [${pageItem.key.toUpperCase()}] ${pageItem.url} ---`);

      const resp = await page.goto(pageItem.url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      }).catch((err) => {
        console.error(`  Error cargando ${pageItem.url}:`, err.message);
        return null;
      });

      if (resp && resp.status() === 429) {
        console.warn(`  [429 Recibido] Esperando 60s antes de reintentar...`);
        await sleep(60000);
        await page.goto(pageItem.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      }

      await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});

      // Breve desplazamiento para asegurar carga de lazy assets y cálculo de layout
      await page.evaluate(async () => {
        const maxScroll = Math.min(document.documentElement.scrollHeight, 2500);
        for (let y = 0; y < maxScroll; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 100));
      }).catch(() => {});

      // Evaluar los 8 anchos de pantalla
      for (const vp of VIEWPORTS) {
        // Ajustar tamaño del viewport
        await page.setViewportSize({ width: vp.width, height: vp.height });
        // Asegurar scroll al inicio y disparar evento de redimensión para observer/media queries
        await page.evaluate(() => {
          window.scrollTo(0, 0);
          window.dispatchEvent(new Event('resize'));
        });
        await sleep(350); // Tiempo para estabilización de CSS y transiciones

        // Inspección geométrica exhaustiva en el DOM del navegador
        const geometry = await page.evaluate(({ vpWidth, vpHeight }) => {
          const winWidth = window.innerWidth;
          const winHeight = window.innerHeight;
          const docEl = document.documentElement;
          const body = document.body;

          const docScrollWidth = docEl.scrollWidth;
          const docClientWidth = docEl.clientWidth;
          const bodyScrollWidth = body ? body.scrollWidth : 0;
          const maxDocWidth = Math.max(docScrollWidth, bodyScrollWidth);
          const overflowDelta = maxDocWidth - winWidth;
          const hasPageHorizontalOverflow = overflowDelta > 1;

          // 1. Identificar elementos específicos causantes del desborde horizontal
          const culprits = [];
          if (hasPageHorizontalOverflow) {
            const allEls = document.querySelectorAll('*');
            for (const el of allEls) {
              if (el.nodeType !== 1) continue;
              const tag = el.tagName.toLowerCase();
              if (['script', 'style', 'noscript', 'template', 'svg', 'path'].includes(tag)) continue;

              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

              const rect = el.getBoundingClientRect();
              if (rect.width <= 0 || rect.height <= 0) continue;

              // Si el borde derecho desborda el ancho del viewport
              if (rect.right > winWidth + 1.5) {
                // Verificar si algún ancestro contiene el overflow (overflow-x: hidden/clip/auto/scroll)
                let isClipped = false;
                let parent = el.parentElement;
                while (parent && parent !== document.documentElement && parent !== body) {
                  const pStyle = window.getComputedStyle(parent);
                  const ox = pStyle.overflowX;
                  if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') {
                    isClipped = true;
                    break;
                  }
                  parent = parent.parentElement;
                }

                if (!isClipped) {
                  let sel = tag;
                  if (el.id) {
                    sel = `#${el.id}`;
                  } else if (el.className && typeof el.className === 'string') {
                    const cls = el.className.trim().split(/\s+/).filter(c => !c.includes(':') && !c.includes('['));
                    if (cls.length > 0) sel = `${tag}.${cls.slice(0, 2).join('.')}`;
                  }

                  culprits.push({
                    tag,
                    selector: sel,
                    rect: {
                      left: Math.round(rect.left),
                      right: Math.round(rect.right),
                      width: Math.round(rect.width),
                      height: Math.round(rect.height)
                    },
                    scrollWidth: el.scrollWidth,
                    overflowPixels: Math.round(rect.right - winWidth),
                    textSnippet: (el.innerText || '').slice(0, 50).trim()
                  });
                }
              }
            }
          }

          // 2. Detección de solapes indeseados (bounding box collisions de elementos de texto/botones)
          const textCandidateEls = Array.from(document.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, button, a.button, a.btn, .btn, .button, [role="button"], .price, .badge, .product-card__title, .product-card__price, .card__heading, label'
          )).filter(el => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
            // Descartar elementos accesibles ocultos (visually-hidden)
            if (style.position === 'absolute' && (style.clip === 'rect(0px, 0px, 0px, 0px)' || style.clipPath === 'inset(50%)' || style.width === '1px' || style.height === '1px')) {
              return false;
            }
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;
            // Solo considerar elementos visibles dentro o próximos al viewport inicial (scrollY = 0)
            if (rect.bottom < 0 || rect.top > winHeight * 2) return false;
            const text = el.innerText ? el.innerText.trim() : '';
            return text.length > 0;
          });

          const collisions = [];
          for (let i = 0; i < textCandidateEls.length; i++) {
            const elA = textCandidateEls[i];
            const rectA = elA.getBoundingClientRect();

            for (let j = i + 1; j < textCandidateEls.length; j++) {
              const elB = textCandidateEls[j];
              // Si uno contiene al otro (relación padre/hijo o ancestro/descendiente), no es solape
              if (elA.contains(elB) || elB.contains(elA)) continue;

              const rectB = elB.getBoundingClientRect();

              // Calcular intersección 2D AABB
              const xLeft = Math.max(rectA.left, rectB.left);
              const xRight = Math.min(rectA.right, rectB.right);
              const yTop = Math.max(rectA.top, rectB.top);
              const yBottom = Math.min(rectA.bottom, rectB.bottom);

              const overlapWidth = Math.max(0, xRight - xLeft);
              const overlapHeight = Math.max(0, yBottom - yTop);

              // Solape visual significativo (al menos 15px de ancho y 10px de alto)
              if (overlapWidth >= 15 && overlapHeight >= 10) {
                const tagA = elA.tagName.toLowerCase();
                const tagB = elB.tagName.toLowerCase();
                const classA = typeof elA.className === 'string' ? elA.className : '';
                const classB = typeof elB.className === 'string' ? elB.className : '';

                // Descartar solape legítimo si uno es badge sobre tarjeta
                const isBadgeA = classA.includes('badge');
                const isBadgeB = classB.includes('badge');

                const styleA = window.getComputedStyle(elA);
                const styleB = window.getComputedStyle(elB);
                const isFixedOrSticky = styleA.position === 'fixed' || styleA.position === 'sticky' ||
                                        styleB.position === 'fixed' || styleB.position === 'sticky';

                collisions.push({
                  elementA: {
                    tag: tagA,
                    class: classA.slice(0, 50),
                    text: (elA.innerText || '').slice(0, 40).trim(),
                    rect: { left: Math.round(rectA.left), top: Math.round(rectA.top), width: Math.round(rectA.width), height: Math.round(rectA.height) }
                  },
                  elementB: {
                    tag: tagB,
                    class: classB.slice(0, 50),
                    text: (elB.innerText || '').slice(0, 40).trim(),
                    rect: { left: Math.round(rectB.left), top: Math.round(rectB.top), width: Math.round(rectB.width), height: Math.round(rectB.height) }
                  },
                  overlap: {
                    width: Math.round(overlapWidth),
                    height: Math.round(overlapHeight)
                  },
                  isBadgeOverlay: isBadgeA || isBadgeB,
                  isFixedOrSticky
                });
              }
            }
          }

          // 3. Detección de textos cortados (elementos con scrollWidth > clientWidth y overflow: hidden/clip)
          const clippedElements = [];
          const textElsToCheck = Array.from(document.querySelectorAll(
            'h1, h2, h3, h4, h5, h6, p, a, button, span, label, .price, .product-card__title, .card__heading'
          )).filter(el => {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') return false;
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;
            const text = el.innerText ? el.innerText.trim() : '';
            if (text.length === 0) return false;

            const ox = style.overflowX;
            const isHiddenX = ox === 'hidden' || ox === 'clip';
            // ScrollWidth mayor que clientWidth por más de 2px
            return isHiddenX && (el.scrollWidth > el.clientWidth + 2);
          });

          for (const el of textElsToCheck) {
            const style = window.getComputedStyle(el);
            const tag = el.tagName.toLowerCase();
            const className = typeof el.className === 'string' ? el.className.trim() : '';
            const textSnippet = (el.innerText || '').slice(0, 50).trim();
            const hasEllipsis = style.textOverflow === 'ellipsis';

            let sel = tag;
            if (el.id) {
              sel = `#${el.id}`;
            } else if (className) {
              sel = `${tag}.${className.split(/\s+/).slice(0, 2).join('.')}`;
            }

            clippedElements.push({
              tag,
              selector: sel,
              text: textSnippet,
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              difference: el.scrollWidth - el.clientWidth,
              textOverflow: style.textOverflow,
              hasEllipsis,
              isEllipsisTruncation: hasEllipsis,
              isHardClip: !hasEllipsis
            });
          }

          return {
            windowInnerWidth: winWidth,
            docScrollWidth,
            bodyScrollWidth,
            maxDocWidth,
            hasPageHorizontalOverflow,
            overflowDelta: hasPageHorizontalOverflow ? Math.round(overflowDelta) : 0,
            culpritsCount: culprits.length,
            culprits: culprits.slice(0, 10),
            collisionsCount: collisions.length,
            collisions: collisions.slice(0, 15),
            clippedCount: clippedElements.length,
            clippedElements: clippedElements.slice(0, 15)
          };
        }, { vpWidth: vp.width, vpHeight: vp.height });

        // Tomar captura de pantalla representativa (above-the-fold)
        const screenshotFileName = `${storeKey}_${pageItem.key}_${vp.width}px.png`;
        const screenshotFilePath = path.join(SCREENSHOTS_DIR, screenshotFileName);
        await page.screenshot({ path: screenshotFilePath, fullPage: false });

        if (geometry.hasPageHorizontalOverflow) {
          overallHorizontalOverflows++;
        }
        if (geometry.collisionsCount > 0) {
          overallCollisions += geometry.collisionsCount;
        }
        if (geometry.clippedCount > 0) {
          overallClippings += geometry.clippedCount;
        }

        const stateRecord = {
          store: storeKey,
          store_handle: store.handle,
          store_domain: store.domain,
          page_key: pageItem.key,
          page_path: pageItem.path,
          page_url: pageItem.url,
          viewport: {
            width: vp.width,
            height: vp.height,
            label: vp.label
          },
          screenshot_file: screenshotFileName,
          screenshot_relative_path: `screenshots/${screenshotFileName}`,
          geometry: {
            window_inner_width: geometry.windowInnerWidth,
            doc_scroll_width: geometry.docScrollWidth,
            body_scroll_width: geometry.bodyScrollWidth,
            max_doc_width: geometry.maxDocWidth,
            has_horizontal_overflow: geometry.hasPageHorizontalOverflow,
            overflow_delta_px: geometry.overflowDelta,
            culprits_count: geometry.culpritsCount,
            culprits: geometry.culprits,
            collisions_count: geometry.collisionsCount,
            collisions: geometry.collisions,
            clipped_count: geometry.clippedCount,
            clipped_elements: geometry.clippedElements
          }
        };

        allResults.push(stateRecord);

        // Feedback por consola
        const overflowStatus = geometry.hasPageHorizontalOverflow
          ? `ALERTA OVERFLOW: +${geometry.overflowDelta}px (${geometry.culpritsCount} culpables)`
          : 'OK (0px overflow)';
        const colStatus = geometry.collisionsCount > 0 ? `Solapes: ${geometry.collisionsCount}` : 'Sin solapes';
        const clipStatus = geometry.clippedCount > 0 ? `Clipped: ${geometry.clippedCount}` : 'Sin clipping';

        console.log(`    [${vp.width}px] ${overflowStatus} | ${colStatus} | ${clipStatus}`);
      }
    }

    await page.close();
    await context.close();
  }
} finally {
  await browser.close();
}

const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

// Consolidación de datos crudos
const outputData = {
  audit_metadata: {
    id: 'TECH-AUDIT-001',
    role: 'Rol 4: Auditor de Matriz Responsive y Geometría Visual',
    timestamp: new Date().toISOString(),
    elapsed_seconds: Number(elapsedSeconds),
    total_evaluations: allResults.length,
    stores_count: Object.keys(STORES).length,
    pages_per_store: 3,
    viewports_count: VIEWPORTS.length,
    viewports: VIEWPORTS
  },
  summary: {
    total_rendered_states: allResults.length,
    horizontal_overflow_detected_states: overallHorizontalOverflows,
    total_collisions_detected: overallCollisions,
    total_clipped_text_detected: overallClippings,
    breakdown_by_viewport: VIEWPORTS.map(vp => {
      const vpResults = allResults.filter(r => r.viewport.width === vp.width);
      const overflows = vpResults.filter(r => r.geometry.has_horizontal_overflow);
      const collisions = vpResults.reduce((acc, r) => acc + r.geometry.collisions_count, 0);
      const clippings = vpResults.reduce((acc, r) => acc + r.geometry.clipped_count, 0);
      return {
        width: vp.width,
        label: vp.label,
        evaluations: vpResults.length,
        states_with_overflow: overflows.length,
        overflow_delta_max: overflows.length ? Math.max(...overflows.map(o => o.geometry.overflow_delta_px)) : 0,
        total_collisions: collisions,
        total_clippings: clippings
      };
    }),
    breakdown_by_store: Object.keys(STORES).map(storeKey => {
      const storeResults = allResults.filter(r => r.store === storeKey);
      const overflows = storeResults.filter(r => r.geometry.has_horizontal_overflow);
      const collisions = storeResults.reduce((acc, r) => acc + r.geometry.collisions_count, 0);
      const clippings = storeResults.reduce((acc, r) => acc + r.geometry.clipped_count, 0);
      return {
        store: storeKey,
        evaluations: storeResults.length,
        states_with_overflow: overflows.length,
        total_collisions: collisions,
        total_clippings: clippings
      };
    })
  },
  evaluations: allResults
};

fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(outputData, null, 2), 'utf8');

console.log('\n================================================================');
console.log(' AUDITORÍA RESPONSIVE FINALIZADA CON ÉXITO');
console.log(` Estados evaluados: ${allResults.length} / 72 requeridos`);
console.log(` Estados con desborde horizontal: ${overallHorizontalOverflows}`);
console.log(` Solapes de texto detectados: ${overallCollisions}`);
console.log(` Textos recortados detectados: ${overallClippings}`);
console.log(` Archivo JSON generado: ${OUTPUT_JSON_PATH}`);
console.log(` Tiempo total: ${elapsedSeconds}s`);
console.log('================================================================\n');
