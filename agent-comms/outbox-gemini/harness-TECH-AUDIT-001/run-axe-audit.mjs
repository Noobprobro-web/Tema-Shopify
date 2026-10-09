// Harness for Automated Accessibility Audit (axe-core 4.10.2) - Role 2 (TECH-AUDIT-001)
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

const URLS_JSON_PATH = path.join(__dirname, 'raw-env-and-urls.json');
const RAW_OUTPUT_PATH = path.join(__dirname, 'raw-axe-accessibility.json');
const AXE_PATH = path.join(ROOT_DIR, 'tests', 'vendor', 'axe.min.js');

if (!fs.existsSync(AXE_PATH)) {
  throw new Error(`axe.min.js no encontrado en ${AXE_PATH}`);
}
const AXE_SOURCE = fs.readFileSync(AXE_PATH, 'utf8');

// Read URLs inventory
const rawConfig = JSON.parse(fs.readFileSync(URLS_JSON_PATH, 'utf8'));
const storesInventory = rawConfig.stores_inventory;

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

async function injectAxe(page) {
  await page.addScriptTag({ path: AXE_PATH }).catch(async () => {
    await page.evaluate(AXE_SOURCE + '\n;window.__axeReady = true;');
  });
}

async function runAxe(page) {
  await injectAxe(page);
  return await page.evaluate(async () => {
    if (!window.axe) throw new Error('axe-core is not defined on window');
    const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
    const r = await axe.run(document, {
      runOnly: { type: 'tag', values: tags },
      resultTypes: ['violations', 'incomplete']
    });

    const slimNodes = (nodes) => (nodes || []).map((n) => ({
      target: n.target,
      html: n.html,
      failureSummary: n.failureSummary,
      any: (n.any || []).map((c) => ({ id: c.id, message: c.message, data: c.data })),
      all: (n.all || []).map((c) => ({ id: c.id, message: c.message, data: c.data })),
      none: (n.none || []).map((c) => ({ id: c.id, message: c.message, data: c.data }))
    }));

    const violations = (r.violations || []).map((v) => ({
      id: v.id,
      impact: v.impact,
      tags: v.tags,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodesCount: v.nodes.length,
      nodes: slimNodes(v.nodes)
    }));

    const incomplete = (r.incomplete || []).map((inc) => ({
      id: inc.id,
      impact: inc.impact,
      tags: inc.tags,
      description: inc.description,
      help: inc.help,
      helpUrl: inc.helpUrl,
      nodesCount: inc.nodes.length,
      nodes: slimNodes(inc.nodes)
    }));

    return {
      violations,
      incomplete,
      passesCount: (r.passes || []).length,
      inapplicableCount: (r.inapplicable || []).length
    };
  });
}

console.log('================================================================');
console.log(' INICIANDO AUDITORÍA DE ACCESIBILIDAD AUTOMÁTICA AXE-CORE (ROL 2)');
console.log(' axe-core v4.10.2 | Tags: wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa');
console.log(` Output: ${RAW_OUTPUT_PATH}`);
console.log('================================================================\n');

const allEvaluations = [];
const browser = await launch();

try {
  for (const [storeKey, storeData] of Object.entries(storesInventory)) {
    console.log(`\n============================================================`);
    console.log(` TIENDA: ${storeKey.toUpperCase()} (${storeData.domain})`);
    console.log(`============================================================`);

    // -------------------------------------------------------------
    // FASE A: ESCRITORIO (1440x900)
    // -------------------------------------------------------------
    console.log(`\n>>> [1/2] Iniciando contexto Desktop (1440x900)...`);
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      reducedMotion: 'no-preference'
    });

    console.log(`Desbloqueando sesión storefront para ${storeKey} (Desktop)...`);
    await unlock(desktopContext, storeData.base_url);
    console.log(`Desbloqueo exitoso.`);

    const desktopPage = await desktopContext.newPage();

    for (const item of storeData.urls) {
      await paceNavigation();
      const targetUrl = item.url;
      console.log(`[DESKTOP] (${item.id}/${storeData.urls.length}) Navegando: ${item.type} -> ${targetUrl}`);

      const resp = await desktopPage.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      }).catch((err) => {
        console.error(`  Error cargando ${targetUrl}:`, err.message);
        return null;
      });

      if (resp && resp.status() === 429) {
        console.warn(`  [429 Recibido] Esperando 60s antes de reintentar...`);
        await sleep(60000);
        await desktopPage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      }

      await desktopPage.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});

      // Scroll suave para cargar componentes e imágenes diferidas
      await desktopPage.evaluate(async () => {
        const maxScroll = Math.min(document.documentElement.scrollHeight, 4000);
        for (let y = 0; y < maxScroll; y += 800) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 150));
      }).catch(() => {});

      // Interacción para URL 15 ("menu_open")
      if (item.id === 15 || item.type === 'menu_open') {
        console.log(`  Disparando apertura de menú/mega-menú en Desktop...`);
        const desktopToggle = desktopPage.locator('.desktop-nav__toggle, [data-disclosure-trigger]').first();
        if (await desktopToggle.isVisible().catch(() => false)) {
          await desktopToggle.click().catch(() => {});
          await desktopPage.waitForTimeout(700);
        } else {
          const menuBtn = desktopPage.locator('.site-header__menu-button, [data-drawer-trigger]').first();
          if (await menuBtn.isVisible().catch(() => false)) {
            await menuBtn.click().catch(() => {});
            await desktopPage.waitForTimeout(700);
          }
        }
      }

      // 1. Escenario Desktop Normal Motion
      await desktopPage.emulateMedia({ reducedMotion: 'no-preference' });
      const axeNormal = await runAxe(desktopPage);
      allEvaluations.push({
        store: storeKey,
        store_domain: storeData.domain,
        url_id: item.id,
        url_type: item.type,
        url: item.url,
        scenario: 'desktop_normal',
        device: 'desktop',
        viewport: { width: 1440, height: 900 },
        reduced_motion: 'no-preference',
        violations_count: axeNormal.violations.length,
        violations: axeNormal.violations,
        incomplete_count: axeNormal.incomplete.length,
        incomplete: axeNormal.incomplete,
        passes_count: axeNormal.passesCount,
        inapplicable_count: axeNormal.inapplicableCount
      });

      // 2. Escenario Desktop Reduced Motion
      await desktopPage.emulateMedia({ reducedMotion: 'reduce' });
      const axeReduced = await runAxe(desktopPage);
      allEvaluations.push({
        store: storeKey,
        store_domain: storeData.domain,
        url_id: item.id,
        url_type: item.type,
        url: item.url,
        scenario: 'desktop_reduced',
        device: 'desktop',
        viewport: { width: 1440, height: 900 },
        reduced_motion: 'reduce',
        violations_count: axeReduced.violations.length,
        violations: axeReduced.violations,
        incomplete_count: axeReduced.incomplete.length,
        incomplete: axeReduced.incomplete,
        passes_count: axeReduced.passesCount,
        inapplicable_count: axeReduced.inapplicableCount
      });

      // Restaurar media
      await desktopPage.emulateMedia({ reducedMotion: 'no-preference' });

      console.log(`    -> Violaciones: normal=${axeNormal.violations.length}, reduced=${axeReduced.violations.length} | Incompletas: normal=${axeNormal.incomplete.length}, reduced=${axeReduced.incomplete.length}`);
    }

    await desktopContext.close();

    // -------------------------------------------------------------
    // FASE B: MOBILE (390x844)
    // -------------------------------------------------------------
    console.log(`\n>>> [2/2] Iniciando contexto Mobile (390x844)...`);
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      reducedMotion: 'no-preference'
    });

    console.log(`Desbloqueando sesión storefront para ${storeKey} (Mobile)...`);
    await unlock(mobileContext, storeData.base_url);
    console.log(`Desbloqueo exitoso.`);

    const mobilePage = await mobileContext.newPage();

    for (const item of storeData.urls) {
      await paceNavigation();
      const targetUrl = item.url;
      console.log(`[MOBILE] (${item.id}/${storeData.urls.length}) Navegando: ${item.type} -> ${targetUrl}`);

      const resp = await mobilePage.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      }).catch((err) => {
        console.error(`  Error cargando ${targetUrl}:`, err.message);
        return null;
      });

      if (resp && resp.status() === 429) {
        console.warn(`  [429 Recibido] Esperando 60s antes de reintentar...`);
        await sleep(60000);
        await mobilePage.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      }

      await mobilePage.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});

      // Scroll suave para cargar componentes diferidos
      await mobilePage.evaluate(async () => {
        const maxScroll = Math.min(document.documentElement.scrollHeight, 4000);
        for (let y = 0; y < maxScroll; y += 800) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 150));
      }).catch(() => {});

      // Interacción para URL 15 ("menu_open")
      if (item.id === 15 || item.type === 'menu_open') {
        console.log(`  Disparando apertura de cajón de menú móvil...`);
        const menuBtn = mobilePage.locator('.site-header__menu-button, [data-drawer-trigger]').first();
        if (await menuBtn.isVisible().catch(() => false)) {
          await menuBtn.click().catch(() => {});
          await mobilePage.waitForTimeout(700);
        }
      }

      // 3. Escenario Mobile Normal Motion
      await mobilePage.emulateMedia({ reducedMotion: 'no-preference' });
      const axeNormal = await runAxe(mobilePage);
      allEvaluations.push({
        store: storeKey,
        store_domain: storeData.domain,
        url_id: item.id,
        url_type: item.type,
        url: item.url,
        scenario: 'mobile_normal',
        device: 'mobile',
        viewport: { width: 390, height: 844 },
        reduced_motion: 'no-preference',
        violations_count: axeNormal.violations.length,
        violations: axeNormal.violations,
        incomplete_count: axeNormal.incomplete.length,
        incomplete: axeNormal.incomplete,
        passes_count: axeNormal.passesCount,
        inapplicable_count: axeNormal.inapplicableCount
      });

      // 4. Escenario Mobile Reduced Motion
      await mobilePage.emulateMedia({ reducedMotion: 'reduce' });
      const axeReduced = await runAxe(mobilePage);
      allEvaluations.push({
        store: storeKey,
        store_domain: storeData.domain,
        url_id: item.id,
        url_type: item.type,
        url: item.url,
        scenario: 'mobile_reduced',
        device: 'mobile',
        viewport: { width: 390, height: 844 },
        reduced_motion: 'reduce',
        violations_count: axeReduced.violations.length,
        violations: axeReduced.violations,
        incomplete_count: axeReduced.incomplete.length,
        incomplete: axeReduced.incomplete,
        passes_count: axeReduced.passesCount,
        inapplicable_count: axeReduced.inapplicableCount
      });

      // Restaurar media
      await mobilePage.emulateMedia({ reducedMotion: 'no-preference' });

      console.log(`    -> Violaciones: normal=${axeNormal.violations.length}, reduced=${axeReduced.violations.length} | Incompletas: normal=${axeNormal.incomplete.length}, reduced=${axeReduced.incomplete.length}`);
    }

    await mobileContext.close();

    // Guardado intermedio de seguridad tras cada tienda
    const interimPayload = {
      audit_metadata: {
        role: 'Rol 2 - Accesibilidad Automática axe-core',
        id: 'TECH-AUDIT-001',
        timestamp: new Date().toISOString(),
        axe_version: '4.10.2',
        in_progress: true,
        evaluations_so_far: allEvaluations.length
      },
      evaluations: allEvaluations
    };
    fs.writeFileSync(RAW_OUTPUT_PATH, JSON.stringify(interimPayload, null, 2), 'utf8');
    console.log(`[Seguridad] Guardado intermedio actualizado (${allEvaluations.length} evaluaciones).`);
  }
} finally {
  await browser.close();
}

// -------------------------------------------------------------
// SÍNTESIS Y AGREGACIÓN
// -------------------------------------------------------------
console.log('\nCalculando métricas globales de accesibilidad...');

const summary = {
  total_evaluations: allEvaluations.length,
  violations_by_impact: {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0
  },
  violations_by_store: {},
  violations_by_scenario: {
    desktop_normal: { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
    desktop_reduced: { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
    mobile_normal: { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 },
    mobile_reduced: { critical: 0, serious: 0, moderate: 0, minor: 0, total: 0 }
  },
  unique_violations_by_rule: {}
};

for (const key of Object.keys(storesInventory)) {
  summary.violations_by_store[key] = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    total: 0
  };
}

for (const ev of allEvaluations) {
  for (const v of ev.violations) {
    const impact = v.impact || 'minor';
    if (summary.violations_by_impact[impact] !== undefined) {
      summary.violations_by_impact[impact] += (v.nodesCount || 1);
    }
    if (summary.violations_by_store[ev.store]) {
      summary.violations_by_store[ev.store][impact] += (v.nodesCount || 1);
      summary.violations_by_store[ev.store].total += (v.nodesCount || 1);
    }
    if (summary.violations_by_scenario[ev.scenario]) {
      summary.violations_by_scenario[ev.scenario][impact] += (v.nodesCount || 1);
      summary.violations_by_scenario[ev.scenario].total += (v.nodesCount || 1);
    }

    if (!summary.unique_violations_by_rule[v.id]) {
      summary.unique_violations_by_rule[v.id] = {
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        occurrences: 0,
        affected_nodes_total: 0,
        examples: []
      };
    }
    summary.unique_violations_by_rule[v.id].occurrences += 1;
    summary.unique_violations_by_rule[v.id].affected_nodes_total += (v.nodesCount || 1);
    if (summary.unique_violations_by_rule[v.id].examples.length < 5) {
      summary.unique_violations_by_rule[v.id].examples.push({
        store: ev.store,
        url_type: ev.url_type,
        scenario: ev.scenario,
        nodes: v.nodes
      });
    }
  }
}

const finalPayload = {
  audit_metadata: {
    role: 'Rol 2 - Accesibilidad Automática axe-core',
    id: 'TECH-AUDIT-001',
    timestamp: new Date().toISOString(),
    axe_version: '4.10.2',
    rules_tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    total_stores: Object.keys(storesInventory).length,
    urls_per_store: 15,
    scenarios_per_url: 4,
    total_evaluations: allEvaluations.length,
    scenarios: [
      { id: 'desktop_normal', device: 'desktop', viewport: { width: 1440, height: 900 }, reduced_motion: 'no-preference' },
      { id: 'desktop_reduced', device: 'desktop', viewport: { width: 1440, height: 900 }, reduced_motion: 'reduce' },
      { id: 'mobile_normal', device: 'mobile', viewport: { width: 390, height: 844 }, reduced_motion: 'no-preference' },
      { id: 'mobile_reduced', device: 'mobile', viewport: { width: 390, height: 844 }, reduced_motion: 'reduce' }
    ]
  },
  summary,
  evaluations: allEvaluations
};

fs.writeFileSync(RAW_OUTPUT_PATH, JSON.stringify(finalPayload, null, 2), 'utf8');

console.log(`\n============================================================`);
console.log(` AUDITORÍA FINALIZADA EXITOSAMENTE`);
console.log(` Evaluaciones completadas: ${allEvaluations.length} / 180`);
console.log(` Archivo crudo generado: ${RAW_OUTPUT_PATH}`);
console.log(` Violaciones Críticas: ${summary.violations_by_impact.critical}`);
console.log(` Violaciones Serias:   ${summary.violations_by_impact.serious}`);
console.log(` Violaciones Moderadas:${summary.violations_by_impact.moderate}`);
console.log(` Violaciones Menores:  ${summary.violations_by_impact.minor}`);
console.log(`============================================================\n`);
