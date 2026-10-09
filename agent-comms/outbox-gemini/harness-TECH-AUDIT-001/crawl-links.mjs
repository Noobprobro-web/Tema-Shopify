// Script de rastreo exhaustivo de enlaces y URLs públicas (Rol 5)
// TECH-AUDIT-001: sartorial-atelier, sartorial-edition, sartorial-archive + GitHub Pages

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';

// Configuración de tiendas y credenciales
const STORES = {
  atelier: {
    name: 'Sartorial Atelier',
    url: 'https://sartorial-atelier.myshopify.com',
    key_products: ['serra-coat', 'nove-blazer', 'pleated-wide-trouser', 'silk-charmeuse-blouse']
  },
  edition: {
    name: 'Sartorial Edition',
    url: 'https://sartorial-edition.myshopify.com',
    key_products: ['structured-tote', 'leather-desk-mat', 'milled-brass-paperweight', 'leather-document-folio']
  },
  archive: {
    name: 'Sartorial Archive',
    url: 'https://sartorial-archive.myshopify.com',
    key_products: ['1990-pinstripe-double-breasted-jacket', '1999-technical-cotton-trench', '1998-bias-cut-silk-slip']
  }
};

const PUBLIC_URLS = {
  documentation: 'https://noobprobro-web.github.io/sartorial-docs/docs.html',
  support: 'https://noobprobro-web.github.io/sartorial-docs/support.html'
};

const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD;
if (!STORE_PASSWORD) {
  console.error('[SECURITY FATAL] STOREFRONT_PASSWORD environment variable is required.');
  process.exit(1);
}
const MIN_GAP_MS = Number(process.env.AUDIT_MIN_GAP_MS || 2500);
const STATE_DIR = process.env.AUDIT_STATE_DIR || path.join(os.tmpdir(), 'sartorial-audit-final-003');
fs.mkdirSync(STATE_DIR, { recursive: true });

const stateFile = (storeUrl) => path.join(STATE_DIR, new URL(storeUrl).host + '.cookies.json');

let lastRequestTime = 0;
async function enforcePacing() {
  const elapsed = Date.now() - lastRequestTime;
  const wait = Math.max(0, MIN_GAP_MS - elapsed);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastRequestTime = Date.now();
}

async function unlockStore(context, storeUrl) {
  const file = stateFile(storeUrl);
  if (fs.existsSync(file)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(file, 'utf8'));
      await context.addCookies(cookies);
      console.log(`[AUTH] Cookies inyectadas desde caché para ${storeUrl}`);
    } catch (e) {
      console.warn(`[AUTH] Error leyendo cookies cacheadas: ${e.message}`);
    }
  }

  const page = await context.newPage();
  let unlocked = false;

  for (let attempt = 0; attempt < 4 && !unlocked; attempt++) {
    await enforcePacing();
    const resp = await page.goto(`${storeUrl}/cart`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (resp && resp.status() === 429) {
      console.warn(`[AUTH 429] Esperando 30s para reintentar desbloqueo...`);
      await new Promise((r) => setTimeout(r, 30000));
      continue;
    }

    if (!page.url().includes('/password')) {
      unlocked = true;
      break;
    }

    console.log(`[AUTH] Desbloqueando con contraseña para ${storeUrl} (intento ${attempt + 1})...`);
    const input = page.locator('input[type="password"]');
    if ((await input.count()) > 0) {
      await input.first().fill(STORE_PASSWORD);
      await Promise.all([page.waitForLoadState('domcontentloaded'), input.first().press('Enter')]);
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    }

    unlocked = !page.url().includes('/password');
    if (!unlocked) {
      console.warn(`[AUTH] Intento ${attempt + 1} falló, esperando ${30 * (attempt + 1)}s...`);
      await new Promise((r) => setTimeout(r, 30000 * (attempt + 1)));
    }
  }

  if (unlocked) {
    fs.writeFileSync(file, JSON.stringify(await context.cookies(storeUrl)));
    console.log(`[AUTH] Sesión confirmada y guardada en caché para ${storeUrl}`);
  }
  await page.close();

  if (!unlocked) {
    throw new Error(`No se pudo desbloquear ${storeUrl}`);
  }
  return unlocked;
}

// Verifica una URL pública externa (GitHub Pages)
async function auditPublicUrls(browser) {
  console.log(`\n========================================`);
  console.log(`1. VERIFICACIÓN DE URLS PÚBLICAS GITHUB PAGES`);
  console.log(`========================================`);

  const results = {};
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const [key, targetUrl] of Object.entries(PUBLIC_URLS)) {
    console.log(`\n[PUBLIC] Auditando ${key}: ${targetUrl}`);
    const t0 = performance.now();
    let resp = null;
    let error = null;

    try {
      await enforcePacing();
      resp = await page.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });
    } catch (e) {
      error = e.message;
    }
    const latencyMs = Number((performance.now() - t0).toFixed(2));

    let title = '';
    let headings = [];
    let pageLinks = [];
    let inPageAnchors = [];
    let brokenAnchors = [];

    if (resp && resp.ok()) {
      title = await page.title();
      headings = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h1, h2, h3')).map((h) => ({
          tag: h.tagName,
          text: h.textContent.trim().slice(0, 80),
          id: h.id || null
        }));
      });

      // Extraer y validar enlaces internos y anclas en la página pública
      const extracted = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a')).map((a) => {
          const href = a.getAttribute('href') || '';
          return {
            href,
            text: a.textContent.trim().slice(0, 60),
            rawHref: a.href
          };
        });

        // Revisar anclas
        const anchors = links.filter((l) => l.href.startsWith('#') && l.href.length > 1);
        const broken = [];
        for (const anc of anchors) {
          const targetId = anc.href.slice(1);
          const el = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
          if (!el) {
            broken.push({ anchor: anc.href, text: anc.text });
          }
        }

        return { links, broken };
      });

      pageLinks = extracted.links;
      brokenAnchors = extracted.broken;
    }

    results[key] = {
      requested_url: targetUrl,
      final_url: page.url(),
      status: resp ? resp.status() : null,
      status_text: resp ? resp.statusText() : null,
      latency_ms: latencyMs,
      ok: resp ? resp.ok() : false,
      title,
      headings_sample: headings.slice(0, 10),
      total_links_found: pageLinks.length,
      broken_anchors_in_doc: brokenAnchors,
      error
    };

    console.log(`  -> Estado HTTP: ${results[key].status} (${results[key].latency_ms} ms)`);
    console.log(`  -> Título: "${results[key].title}"`);
    console.log(`  -> Total enlaces encontrados en página: ${pageLinks.length}`);
    console.log(`  -> Anclas rotos en página: ${brokenAnchors.length}`);
  }

  await context.close();
  return results;
}

// Helper para peticiones HTTP con pacing y reintentos automáticos ante 429
async function safeRequestGet(context, targetUrl, maxRetries = 8) {
  let resp = null;
  let err = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await enforcePacing();
    const t0 = performance.now();
    try {
      resp = await context.request.get(targetUrl, { maxRedirects: 5, timeout: 25000 });
      const latencyMs = Number((performance.now() - t0).toFixed(2));
      if (resp.status() === 429) {
        console.warn(`  [429 RATE LIMIT] Recibido 429 en ${targetUrl}. Esperando 60s (intento ${attempt + 1}/${maxRetries})...`);
        await new Promise((r) => setTimeout(r, 60000));
        continue;
      }
      return {
        resp,
        status: resp.status(),
        statusText: resp.statusText(),
        finalUrl: resp.url(),
        latencyMs,
        error: null
      };
    } catch (e) {
      err = e.message;
      if (attempt < maxRetries - 1) {
        console.warn(`  [REQ WARN] Error de red en ${targetUrl}: ${e.message}. Reintentando en 3s...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  return {
    resp: null,
    status: null,
    statusText: null,
    finalUrl: null,
    latencyMs: null,
    error: err || 'Max retries reached'
  };
}

// Rastreador integral de una tienda demo
async function crawlStore(browser, storeKey, storeInfo) {
  console.log(`\n========================================`);
  console.log(`RASTREO TIENDA: ${storeInfo.name} (${storeInfo.url})`);
  console.log(`========================================`);

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlockStore(context, storeInfo.url);

  const host = new URL(storeInfo.url).host;
  const storeOrigin = new URL(storeInfo.url).origin;

  // 1. Obtener catálogo para armar seed pages exhaustivas
  console.log(`[DISCOVERY] Obteniendo inventario de colecciones y productos...`);
  const colRes = await safeRequestGet(context, `${storeInfo.url}/collections.json?limit=250`);
  const collections = (colRes.resp ? (await colRes.resp.json()).collections : []) || [];

  const prodRes = await safeRequestGet(context, `${storeInfo.url}/products.json?limit=250`);
  const products = (prodRes.resp ? (await prodRes.resp.json()).products : []) || [];

  console.log(`  -> ${collections.length} colecciones encontradas`);
  console.log(`  -> ${products.length} productos encontrados`);

  // Construir lista de seed pages clave para visitar en navegador
  const seedPages = [
    { type: 'home', url: `${storeInfo.url}/` },
    { type: 'collection_all', url: `${storeInfo.url}/collections/all` },
    ...collections.map((c) => ({ type: 'collection', url: `${storeInfo.url}/collections/${c.handle}` })),
    ...storeInfo.key_products.map((h) => ({ type: 'pdp', url: `${storeInfo.url}/products/${h}` })),
    { type: 'cart', url: `${storeInfo.url}/cart` },
    { type: 'search', url: `${storeInfo.url}/search` },
    { type: 'contact', url: `${storeInfo.url}/pages/contact` },
    { type: 'privacy_policy', url: `${storeInfo.url}/policies/privacy-policy` },
    { type: 'refund_policy', url: `${storeInfo.url}/policies/refund-policy` },
    { type: 'shipping_policy', url: `${storeInfo.url}/policies/shipping-policy` },
    { type: 'terms_policy', url: `${storeInfo.url}/policies/terms-of-service` },
    { type: 'contact_policy', url: `${storeInfo.url}/policies/contact-information` }
  ];

  const visitedUrls = new Set();
  const allExtractedLinks = [];
  const linkOccurrencesMap = new Map();
  const inPageAnchorChecks = [];
  const pageNavResults = [];

  const page = await context.newPage();

  // Visitar cada seed page
  for (const seed of seedPages) {
    if (visitedUrls.has(seed.url)) continue;
    visitedUrls.add(seed.url);

    console.log(`\n[SEED ${seed.type}] Navegando a ${seed.url}...`);
    const t0 = performance.now();
    await enforcePacing();

    let response = null;
    let navError = null;

    try {
      response = await page.goto(seed.url, { waitUntil: 'load', timeout: 35000 });
      await page.waitForTimeout(500); // permitir hidratación ligera
    } catch (e) {
      navError = e.message;
      console.warn(`  [ERROR] Fallo al cargar ${seed.url}: ${e.message}`);
    }

    const latencyMs = Number((performance.now() - t0).toFixed(2));
    const status = response ? response.status() : null;
    const finalUrl = page.url();

    pageNavResults.push({
      url: seed.url,
      type: seed.type,
      status,
      status_text: response ? response.statusText() : null,
      final_url: finalUrl,
      redirected: response ? response.request().redirectedFrom() !== null : false,
      latency_ms: latencyMs,
      error: navError
    });

    console.log(`  -> Estado HTTP: ${status} en ${latencyMs} ms (URL final: ${finalUrl})`);

    if (response && response.status() === 200) {
      // Extraer enlaces en la página con contexto DOM
      const pageLinks = await page.evaluate((currentOrigin) => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map((a) => {
          const href = a.getAttribute('href') || '';
          let location = 'body';
          if (a.closest('header, .site-header, .header')) location = 'header';
          else if (a.closest('footer, .site-footer, .footer')) location = 'footer';
          else if (a.closest('nav, .nav, .desktop-nav, .mobile-nav')) location = 'navigation';
          else if (a.closest('[role="dialog"], .drawer, .cart-drawer')) location = 'drawer/dialog';
          else if (a.closest('main, .site-main, #MainContent')) location = 'main';

          // Chequeo de ancla inmediato en el DOM de la página actual
          let inPageTargetFound = null;
          let inPageTargetTag = null;
          if (href.startsWith('#') && href.length > 1) {
            const targetId = href.slice(1);
            const el = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
            inPageTargetFound = !!el;
            inPageTargetTag = el ? el.tagName : null;
          }

          return {
            href,
            text: a.textContent.trim().slice(0, 100),
            ariaLabel: a.getAttribute('aria-label') || '',
            location,
            rawHref: a.href,
            inPageTargetFound,
            inPageTargetTag
          };
        });
      }, storeOrigin);

      console.log(`  -> ${pageLinks.length} enlaces encontrados en DOM`);

      for (const pl of pageLinks) {
        let resolvedUrl = null;
        let isInternal = false;
        let isAnchorOnly = false;
        let hash = null;
        let urlWithoutHash = null;

        try {
          if (pl.href.startsWith('#')) {
            isAnchorOnly = true;
            hash = pl.href.slice(1);
            resolvedUrl = `${seed.url.split('#')[0]}#${hash}`;
            urlWithoutHash = seed.url.split('#')[0];
            isInternal = true;
          } else if (pl.href.startsWith('/') || pl.href.startsWith(storeOrigin)) {
            const u = new URL(pl.href, storeOrigin);
            resolvedUrl = u.href;
            hash = u.hash ? u.hash.slice(1) : null;
            urlWithoutHash = `${u.origin}${u.pathname}${u.search}`;
            isInternal = true;
          } else if (/^https?:\/\//i.test(pl.href)) {
            const u = new URL(pl.href);
            resolvedUrl = u.href;
            hash = u.hash ? u.hash.slice(1) : null;
            urlWithoutHash = `${u.origin}${u.pathname}${u.search}`;
            isInternal = (u.host === host);
          } else {
            // mailto, tel, javascript, etc.
            resolvedUrl = pl.href;
            isInternal = false;
          }
        } catch (e) {
          resolvedUrl = pl.href;
        }

        const linkRecord = {
          source_page: seed.url,
          source_type: seed.type,
          href_raw: pl.href,
          text: pl.text || pl.ariaLabel || '(sin texto)',
          location: pl.location,
          resolved_url: resolvedUrl,
          url_without_hash: urlWithoutHash,
          hash,
          is_internal: isInternal,
          is_anchor_only: isAnchorOnly
        };

        allExtractedLinks.push(linkRecord);

        // Agrupar apariciones por resolved_url
        if (resolvedUrl) {
          if (!linkOccurrencesMap.has(resolvedUrl)) {
            linkOccurrencesMap.set(resolvedUrl, []);
          }
          linkOccurrencesMap.get(resolvedUrl).push(linkRecord);
        }

        // Si fue ancla en la página actual
        if (isAnchorOnly && hash) {
          inPageAnchorChecks.push({
            source_page: seed.url,
            anchor: `#${hash}`,
            target_id: hash,
            found: pl.inPageTargetFound,
            target_tag: pl.inPageTargetTag,
            link_text: pl.text
          });
        }
      }
    }
  }

  // 2. Extraer todos los URLs internos únicos sin hash para verificar código HTTP
  const uniqueInternalUrlsToTest = new Set();
  const crossPageAnchorsToTest = [];

  for (const l of allExtractedLinks) {
    if (l.is_internal && l.url_without_hash) {
      uniqueInternalUrlsToTest.add(l.url_without_hash);
      if (l.hash && !l.is_anchor_only) {
        crossPageAnchorsToTest.push({
          source_page: l.source_page,
          url: l.url_without_hash,
          hash: l.hash,
          link_text: l.text
        });
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`[HTTP VERIFICATION] Verificando ${uniqueInternalUrlsToTest.size} URLs internas únicas para ${storeInfo.name}...`);
  console.log(`========================================`);

  const urlTestResults = {};
  const brokenLinks = [];
  const redirectLinks = [];

  // Crear mapa rápido con resultados ya obtenidos en seed navigation
  for (const nav of pageNavResults) {
    const cleanNavUrl = nav.url.split('#')[0];
    if (nav.status !== null) {
      urlTestResults[cleanNavUrl] = {
        url: cleanNavUrl,
        status: nav.status,
        status_text: nav.status_text,
        final_url: nav.final_url,
        redirected: nav.redirected,
        latency_ms: nav.latency_ms,
        verified_via: 'seed_page_navigation',
        error: nav.error
      };

      if (nav.status >= 400) {
        brokenLinks.push(urlTestResults[cleanNavUrl]);
      } else if (nav.redirected || (nav.final_url && nav.final_url !== cleanNavUrl)) {
        redirectLinks.push(urlTestResults[cleanNavUrl]);
      }
    }
  }

  // Para los URLs restantes, hacer GET con session cookies respetando pacing
  let testedCount = 0;
  for (const targetUrl of uniqueInternalUrlsToTest) {
    if (urlTestResults[targetUrl]) {
      continue; // Ya verificado
    }

    testedCount++;
    console.log(`[CHECK ${testedCount}] GET ${targetUrl}...`);
    const req = await safeRequestGet(context, targetUrl);
    const redirected = (req.finalUrl && req.finalUrl !== targetUrl);

    const testItem = {
      url: targetUrl,
      status: req.status,
      status_text: req.statusText,
      final_url: req.finalUrl,
      redirected,
      latency_ms: req.latencyMs,
      verified_via: 'context_request_get',
      error: req.error
    };

    urlTestResults[targetUrl] = testItem;
    console.log(`  -> Status: ${req.status} (${req.latencyMs} ms)${redirected ? ' -> Redirigido a: ' + req.finalUrl : ''}`);

    if (!req.status || req.status >= 400) {
      brokenLinks.push(testItem);
      console.error(`  [BROKEN LINK 4xx/5xx] ${targetUrl} respondió ${req.status}`);
    } else if (redirected) {
      redirectLinks.push(testItem);
    }
  }

  // 3. Verificación de anclas cross-page (`/path#anchor`)
  const uniqueCrossPageAnchors = [];
  const seenCrossAnchors = new Set();
  for (const cross of crossPageAnchorsToTest) {
    const key = `${cross.url}#${cross.hash}`;
    if (!seenCrossAnchors.has(key)) {
      seenCrossAnchors.add(key);
      uniqueCrossPageAnchors.push(cross);
    }
  }

  console.log(`\n[ANCHOR VERIFICATION] Verificando anclas cruzadas únicas (${uniqueCrossPageAnchors.length})...`);
  const crossPageAnchorResults = [];

  for (const cross of uniqueCrossPageAnchors) {
    await enforcePacing();
    let anchorFound = false;
    let targetTag = null;
    let error = null;

    try {
      await page.goto(cross.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const check = await page.evaluate((targetHash) => {
        const el = document.getElementById(targetHash) || document.querySelector(`[name="${targetHash}"]`);
        return {
          found: !!el,
          tag: el ? el.tagName : null
        };
      }, cross.hash);

      anchorFound = check.found;
      targetTag = check.tag;
    } catch (e) {
      error = e.message;
    }

    crossPageAnchorResults.push({
      source_page: cross.source_page,
      url: cross.url,
      hash: `#${cross.hash}`,
      target_id: cross.hash,
      found: anchorFound,
      target_tag: targetTag,
      link_text: cross.link_text,
      error
    });
  }

  // Identificar anclas rotas totales
  const brokenAnchors = [
    ...inPageAnchorChecks.filter((a) => !a.found && a.target_id !== '' && a.target_id !== '0'),
    ...crossPageAnchorResults.filter((a) => !a.found)
  ];

  await page.close();
  await context.close();

  const storeSummary = {
    store_name: storeInfo.name,
    store_url: storeInfo.url,
    total_links_found: allExtractedLinks.length,
    unique_resolved_urls_count: linkOccurrencesMap.size,
    unique_internal_urls_tested: Object.keys(urlTestResults).length,
    total_anchors_tested: inPageAnchorChecks.length + crossPageAnchorResults.length,
    status_200_count: Object.values(urlTestResults).filter((r) => r.status === 200).length,
    redirects_count: redirectLinks.length,
    broken_links_count: brokenLinks.length,
    broken_anchors_count: brokenAnchors.length
  };

  console.log(`\nRESUMEN ${storeInfo.name}:`);
  console.log(`  - Total enlaces extraídos en DOM: ${storeSummary.total_links_found}`);
  console.log(`  - URLs internas únicas testeadas: ${storeSummary.unique_internal_urls_tested}`);
  console.log(`  - Respuestas HTTP 200 OK: ${storeSummary.status_200_count}`);
  console.log(`  - Redirecciones detectadas: ${storeSummary.redirects_count}`);
  console.log(`  - Enlaces rotos (404/500/err): ${storeSummary.broken_links_count}`);
  console.log(`  - Anclas rotas detectadas: ${storeSummary.broken_anchors_count}`);

  return {
    summary: storeSummary,
    broken_links: brokenLinks,
    broken_anchors: brokenAnchors,
    redirects: redirectLinks,
    in_page_anchors: inPageAnchorChecks,
    cross_page_anchors: crossPageAnchorResults,
    urls_tested: urlTestResults,
    all_links_sample: allExtractedLinks.slice(0, 50)
  };
}

async function main() {
  const timestamp = new Date().toISOString();
  console.log(`Iniciando Tech Audit 001 - Rol 5: Rastreo de Enlaces y URLs Públicas`);
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Pacing mínimo entre llamadas: ${MIN_GAP_MS} ms`);

  const browser = await chromium.launch({ headless: true });
  const crawlResults = {
    audit_id: 'TECH-AUDIT-001-ROLE-05',
    timestamp,
    configuration: {
      min_gap_ms: MIN_GAP_MS,
      stores_audited: Object.keys(STORES),
      public_urls: PUBLIC_URLS
    },
    public_urls: {},
    stores: {}
  };

  try {
    // 1. Audit public URLs
    crawlResults.public_urls = await auditPublicUrls(browser);

    // 2. Audit each store sequentially
    for (const [key, storeInfo] of Object.entries(STORES)) {
      crawlResults.stores[key] = await crawlStore(browser, key, storeInfo);
    }
  } finally {
    await browser.close();
  }

  // 3. Resumen global
  let totalLinks = 0;
  let totalUniqueUrls = 0;
  let totalBrokenLinks = 0;
  let totalBrokenAnchors = 0;
  let totalRedirects = 0;

  for (const s of Object.values(crawlResults.stores)) {
    totalLinks += s.summary.total_links_found;
    totalUniqueUrls += s.summary.unique_internal_urls_tested;
    totalBrokenLinks += s.summary.broken_links_count;
    totalBrokenAnchors += s.summary.broken_anchors_count;
    totalRedirects += s.summary.redirects_count;
  }

  crawlResults.overall_summary = {
    total_stores_audited: Object.keys(crawlResults.stores).length,
    total_links_extracted: totalLinks,
    total_unique_internal_urls_verified: totalUniqueUrls,
    total_broken_links_found: totalBrokenLinks,
    total_broken_anchors_found: totalBrokenAnchors,
    total_redirects_found: totalRedirects,
    public_documentation_status: crawlResults.public_urls.documentation?.status,
    public_support_status: crawlResults.public_urls.support?.status
  };

  // 4. Guardar archivo crudo
  const outDir = path.join(process.cwd(), 'agent-comms', 'outbox-gemini', 'harness-TECH-AUDIT-001');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'raw-links-crawl.json');

  fs.writeFileSync(outFile, JSON.stringify(crawlResults, null, 2), 'utf8');
  console.log(`\n========================================`);
  console.log(`AUDITORÍA COMPLETADA EXITOSAMENTE`);
  console.log(`Archivo crudo guardado en: ${outFile}`);
  console.log(`Tamaño: ${fs.statSync(outFile).size} bytes`);
  console.log(`========================================`);
}

main().catch((err) => {
  console.error('FATAL ERROR en crawl-links.mjs:', err);
  process.exit(1);
});
