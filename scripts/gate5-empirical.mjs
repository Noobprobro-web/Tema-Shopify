import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:9292';
const AXE_PATH = path.join(REPO_ROOT, 'tests', 'vendor', 'axe.min.js');
const REPORTS_DIR = path.join(REPO_ROOT, 'docs', 'gate5-reports');

async function runAudit() {
  console.log('='.repeat(70));
  console.log(`INICIANDO AUDITORIA EMPIRICA GATE 5 (TIENDA REAL / DEV SERVER)`);
  console.log(`Target: ${BASE_URL}`);
  console.log('='.repeat(70));

  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const axeSource = await fs.readFile(AXE_PATH, 'utf8');

  const browser = await chromium.launch({ headless: true });
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    pages: {},
    summary: {
      totalViolations: 0,
      headingFailures: 0,
      tapTargetFailures: 0,
      overflowFailures: 0,
      maxCLS: 0,
    }
  };

  // Step 1: Discover catalog products from /collections/all
  console.log('\n[1/5] Descubriendo catalogo en /collections/all...');
  const discoveryContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const discoveryPage = await discoveryContext.newPage();
  await discoveryPage.goto(`${BASE_URL}/collections/all`, { waitUntil: 'domcontentloaded' });

  const productHrefs = await discoveryPage.locator('a[href*="/products/"]').evaluateAll(anchors => {
    return [...new Set(anchors.map(a => {
      const url = new URL(a.href);
      return url.pathname;
    }))];
  });
  console.log(`Productos detectados en catalogo: ${productHrefs.length}`);
  console.log(productHrefs.slice(0, 5));
  await discoveryContext.close();

  // Determine pages to test
  const sampleProduct = productHrefs[0] || '/products/qa-08-on-sale';
  const testPages = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collections/all' },
    { name: 'PDP', path: sampleProduct },
    { name: 'Search', path: '/search?q=sartorial' },
    { name: '404', path: '/404-nonexistent-page' },
  ];

  // Test across Mobile and Desktop
  const viewports = [
    { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
    { name: 'desktop', width: 1280, height: 900, isMobile: false, hasTouch: false }
  ];

  for (const pageDef of testPages) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`Auditando pagina: [${pageDef.name}] ${pageDef.path}`);
    console.log(`------------------------------------------------------------`);

    results.pages[pageDef.name] = {
      path: pageDef.path,
      mobile: {},
      desktop: {}
    };

    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch,
        userAgent: vp.isMobile
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          : undefined
      });

      const page = await context.newPage();

      // Script to track CWV (CLS & LCP) before page loads
      await page.addInitScript(() => {
        window.__cwv = { cls: 0, lcp: 0 };
        try {
          const poCls = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                window.__cwv.cls += entry.value;
              }
            }
          });
          poCls.observe({ type: 'layout-shift', buffered: true });

          const poLcp = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
              window.__cwv.lcp = lastEntry.startTime;
            }
          });
          poLcp.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {}
      });

      const response = await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'load', timeout: 30000 });
      const status = response ? response.status() : 0;
      await page.waitForTimeout(1000); // Allow settled layout and animations

      // CWV metrics
      const cwv = await page.evaluate(() => window.__cwv || { cls: 0, lcp: 0 });
      if (cwv.cls > results.summary.maxCLS) results.summary.maxCLS = cwv.cls;

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docEl = document.documentElement;
        const scrollWidth = docEl.scrollWidth;
        const clientWidth = docEl.clientWidth;
        const hasOverflow = scrollWidth > clientWidth;
        return { scrollWidth, clientWidth, hasOverflow };
      });
      if (overflow.hasOverflow) results.summary.overflowFailures++;

      // Check Heading Hierarchy
      const headings = await page.evaluate(() => {
        const list = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return list.map(el => ({
          tag: el.tagName.toLowerCase(),
          level: parseInt(el.tagName.replace('H', ''), 10),
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
          visible: el.offsetParent !== null || window.getComputedStyle(el).display !== 'none'
        }));
      });

      const h1s = headings.filter(h => h.tag === 'h1');
      const h1Count = h1s.length;
      let headingOrderErrors = [];
      let prevLevel = 0;
      for (const h of headings) {
        if (!h.visible) continue;
        if (prevLevel > 0 && h.level > prevLevel + 1) {
          headingOrderErrors.push(`Salto de nivel invalido: de h${prevLevel} a h${h.level} ("${h.text}")`);
        }
        prevLevel = h.level;
      }
      if (h1Count !== 1) {
        headingOrderErrors.push(`Se esperaban exactamente 1 <h1>, encontrados: ${h1Count}`);
      }
      if (headingOrderErrors.length > 0) results.summary.headingFailures++;

      // Tap Target audit for mobile
      let tapTargetViolations = [];
      if (vp.isMobile) {
        tapTargetViolations = await page.evaluate(() => {
          const MIN_SIZE = 44;
          const interactive = Array.from(document.querySelectorAll('button, a, input, select, summary, [role="button"]'));
          const issues = [];

          for (const el of interactive) {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
            if (rect.width === 0 || rect.height === 0) continue;

            const isInlineAnchor = el.tagName === 'A' && style.display === 'inline';
            if (isInlineAnchor) continue;

            if (rect.width < MIN_SIZE || rect.height < MIN_SIZE) {
              const text = (el.textContent || el.getAttribute('aria-label') || el.value || '').trim().slice(0, 30);
              const selector = el.tagName.toLowerCase() + (el.className ? `.${Array.from(el.classList).slice(0, 2).join('.')}` : '');
              issues.push({
                selector,
                text,
                width: Math.round(rect.width * 10) / 10,
                height: Math.round(rect.height * 10) / 10
              });
            }
          }
          return issues;
        });

        if (tapTargetViolations.length > 0) {
          results.summary.tapTargetFailures++;
        }
      }

      // Run axe-core accessibility audit
      await page.evaluate(axeSource);
      const axeResults = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
          }
        });
      });

      const violations = axeResults.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length
      }));

      results.summary.totalViolations += violations.length;

      const pageVpResult = {
        status,
        cwv: {
          cls: Math.round(cwv.cls * 1000) / 1000,
          lcpMs: Math.round(cwv.lcp)
        },
        overflow,
        headings: {
          count: headings.length,
          h1Count,
          errors: headingOrderErrors
        },
        tapTargets: {
          checked: vp.isMobile,
          violationsCount: tapTargetViolations.length,
          sampleViolations: tapTargetViolations.slice(0, 5)
        },
        axe: {
          passes: axeResults.passes.length,
          violationsCount: violations.length,
          violations
        }
      };

      results.pages[pageDef.name][vp.name] = pageVpResult;

      console.log(`  [${vp.name.toUpperCase()}] HTTP ${status} | CLS: ${pageVpResult.cwv.cls} | LCP: ${pageVpResult.cwv.lcpMs}ms | Overflow: ${overflow.hasOverflow ? 'FAIL' : 'PASS'}`);
      console.log(`    h1: ${h1Count} | Heading Errors: ${headingOrderErrors.length} | axe Violations: ${violations.length}`);
      if (vp.isMobile) {
        console.log(`    Tap target violations (<44px): ${tapTargetViolations.length}`);
      }
      if (violations.length > 0) {
        for (const v of violations) {
          console.log(`      * [${v.impact}] ${v.id}: ${v.description} (${v.nodes} nodos)`);
        }
      }

      await context.close();
    }
  }

  // Interactive component test: Cart Drawer focus management & keyboard navigation
  console.log(`\n------------------------------------------------------------`);
  console.log(`Auditando interactividad y teclado: Cart Drawer`);
  console.log(`------------------------------------------------------------`);
  const cartContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const cartPage = await cartContext.newPage();
  await cartPage.goto(`${BASE_URL}/`, { waitUntil: 'load' });

  let cartDrawerAudit = {
    triggerExists: false,
    drawerOpened: false,
    focusInside: false,
    escapeCloses: false,
    focusRestored: false
  };

  const cartTrigger = cartPage.locator('[aria-controls="CartDrawer"], a[href="/cart"]').first();
  if (await cartTrigger.count() > 0) {
    cartDrawerAudit.triggerExists = true;
    await cartTrigger.click();
    await cartPage.waitForTimeout(500);

    const drawer = cartPage.locator('#CartDrawer, cart-drawer[open], dialog[open], [data-drawer-open]').first();
    cartDrawerAudit.drawerOpened = (await drawer.count() > 0) && (await drawer.isVisible());

    const activeInDrawer = await cartPage.evaluate(() => {
      const drawerEl = document.querySelector('#CartDrawer') || document.querySelector('cart-drawer');
      return drawerEl && drawerEl.contains(document.activeElement);
    });
    cartDrawerAudit.focusInside = activeInDrawer;

    // Press Escape
    await cartPage.keyboard.press('Escape');
    await cartPage.waitForTimeout(500);
    const drawerStillOpen = await cartPage.locator('cart-drawer[open], [data-drawer-open]').count() > 0;
    cartDrawerAudit.escapeCloses = !drawerStillOpen;

    const activeIsTrigger = await cartPage.evaluate(() => {
      const trigger = document.querySelector('[aria-controls="CartDrawer"], a[href="/cart"]');
      return document.activeElement === trigger;
    });
    cartDrawerAudit.focusRestored = activeIsTrigger;
  }
  results.cartDrawerAudit = cartDrawerAudit;
  console.log('Resultado Cart Drawer:', cartDrawerAudit);
  await cartContext.close();

  // Save JSON report
  const jsonPath = path.join(REPORTS_DIR, 'gate5-empirical-results.json');
  await fs.writeFile(jsonPath, JSON.stringify(results, null, 2), 'utf8');

  // Generate Markdown report
  let md = `# Reporte de Auditoria Empirica - Compuerta 5 (Tienda Real)\n\n`;
  md += `**Fecha de ejecucion:** ${results.timestamp}\n`;
  md += `**URL Base:** \`${results.baseUrl}\` (Shopify Theme Dev Proxy)\n\n`;
  md += `## 1. Resumen Ejecutivo\n\n`;
  md += `| Metrica | Resultado | Umbral Requerido | Estado |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  md += `| **Violaciones axe-core (WCAG 2.1/2.2 AA)** | **${results.summary.totalViolations}** | 0 | ${results.summary.totalViolations === 0 ? 'PASA' : 'ATENCION'} |\n`;
  md += `| **Jerarquia de Encabezados (h1 unico)** | **${results.summary.headingFailures} fallos** | 0 fallos | ${results.summary.headingFailures === 0 ? 'PASA' : 'CORREGIR'} |\n`;
  md += `| **Desbordamiento Horizontal (Mobile 390px)** | **${results.summary.overflowFailures} fallos** | 0 fallos | ${results.summary.overflowFailures === 0 ? 'PASA' : 'CORREGIR'} |\n`;
  md += `| **Cumulative Layout Shift (CLS)** | **${results.summary.maxCLS.toFixed(4)}** | < 0.1 | ${results.summary.maxCLS < 0.1 ? 'PASA' : 'MEJORAR'} |\n`;
  md += `| **Areas Tactiles Movil (<44px)** | **${results.summary.tapTargetFailures} fallos** | 0 fallos | ${results.summary.tapTargetFailures === 0 ? 'PASA' : 'REVISAR'} |\n\n`;

  md += `## 2. Detalle por Plantilla\n\n`;
  for (const [pageName, data] of Object.entries(results.pages)) {
    md += `### Plantilla: ${pageName} (\`${data.path}\`)\n\n`;
    md += `- **Movil (390x844):**\n`;
    md += `  - HTTP Status: \`${data.mobile.status}\`\n`;
    md += `  - CWV: CLS = \`${data.mobile.cwv.cls}\`, LCP = \`${data.mobile.cwv.lcpMs}ms\`\n`;
    md += `  - Overflow: \`${data.mobile.overflow.hasOverflow ? 'Si (scrollWidth: ' + data.mobile.overflow.scrollWidth + 'px)' : 'No (perfecto)'}\`\n`;
    md += `  - Encabezados: \`${data.mobile.headings.h1Count} <h1>\`, Errores orden: \`${data.mobile.headings.errors.length}\`\n`;
    if (data.mobile.headings.errors.length > 0) {
      data.mobile.headings.errors.forEach(err => { md += `    - *${err}*\n`; });
    }
    md += `  - Tap Targets (<44px): \`${data.mobile.tapTargets.violationsCount}\`\n`;
    if (data.mobile.tapTargets.sampleViolations && data.mobile.tapTargets.sampleViolations.length > 0) {
      data.mobile.tapTargets.sampleViolations.forEach(v => {
        md += `    - \`${v.selector}\` ("${v.text}"): ${v.width}x${v.height}px\n`;
      });
    }
    md += `  - axe-core: \`${data.mobile.axe.violationsCount}\` violaciones (${data.mobile.axe.passes} reglas superadas)\n`;
    if (data.mobile.axe.violations && data.mobile.axe.violations.length > 0) {
      data.mobile.axe.violations.forEach(v => {
        md += `    - **[${v.impact}]** \`${v.id}\`: ${v.description} (${v.nodes} nodos) - [Ref](${v.helpUrl})\n`;
      });
    }

    md += `- **Desktop (1280x900):**\n`;
    md += `  - HTTP Status: \`${data.desktop.status}\`\n`;
    md += `  - CWV: CLS = \`${data.desktop.cwv.cls}\`, LCP = \`${data.desktop.cwv.lcpMs}ms\`\n`;
    md += `  - axe-core: \`${data.desktop.axe.violationsCount}\` violaciones (${data.desktop.axe.passes} reglas superadas)\n\n`;
  }

  md += `## 3. Interactividad y Foco por Teclado (Cart Drawer)\n\n`;
  md += `- Disparador presente: \`${cartDrawerAudit.triggerExists ? 'Si' : 'No'}\`\n`;
  md += `- Apertura de Drawer: \`${cartDrawerAudit.drawerOpened ? 'Si' : 'No'}\`\n`;
  md += `- Foco entra al Drawer: \`${cartDrawerAudit.focusInside ? 'Si' : 'No'}\`\n`;
  md += `- Escape cierra el Drawer: \`${cartDrawerAudit.escapeCloses ? 'Si' : 'No'}\`\n`;
  md += `- Foco restaurado al disparador: \`${cartDrawerAudit.focusRestored ? 'Si' : 'No'}\`\n\n`;

  const mdPath = path.join(REPORTS_DIR, 'gate5-empirical-report.md');
  await fs.writeFile(mdPath, md, 'utf8');

  console.log(`\nInformes guardados exitosamente:`);
  console.log(`- ${jsonPath}`);
  console.log(`- ${mdPath}`);

  await browser.close();
  return results;
}

runAudit().catch(err => {
  console.error('Error fatal durante la auditoria:', err);
  process.exit(1);
});
