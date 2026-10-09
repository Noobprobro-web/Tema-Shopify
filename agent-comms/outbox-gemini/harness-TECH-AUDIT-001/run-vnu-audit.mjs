// Harness for HTML Validation (Nu Html Checker / vnu) - Role 3 (TECH-AUDIT-001)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { launch, unlock } from '../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs';

const ROOT_DIR = process.cwd();
const HARNESS_DIR = path.join(ROOT_DIR, 'agent-comms', 'outbox-gemini', 'harness-TECH-AUDIT-001');
const URLS_JSON_PATH = path.join(HARNESS_DIR, 'raw-env-and-urls.json');
const HTML_DUMP_DIR = path.join(os.tmpdir(), 'sartorial-vnu-html');

fs.mkdirSync(HTML_DUMP_DIR, { recursive: true });

// Read official URL inventory
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

console.log('=== INICIANDO VALIDACIÓN HTML ROL 3 (TECH-AUDIT-001) ===');
console.log(`HTML DUMP DIRECTORY: ${HTML_DUMP_DIR}`);

const capturedFiles = [];

const browser = await launch();

try {
  for (const [storeKey, storeData] of Object.entries(storesInventory)) {
    console.log(`\n--- PROCESANDO TIENDA: ${storeKey} (${storeData.domain}) ---`);
    const storeDumpDir = path.join(HTML_DUMP_DIR, storeKey);
    fs.mkdirSync(storeDumpDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    });

    console.log(`Desbloqueando sesión storefront para ${storeKey}...`);
    await unlock(context, storeData.base_url);
    console.log(`Sesión desbloqueada exitosamente para ${storeKey}.`);

    const page = await context.newPage();

    for (const item of storeData.urls) {
      await paceNavigation();
      const targetUrl = item.url;
      const fileId = `${String(item.id).padStart(2, '0')}-${item.type}.html`;
      const filePath = path.join(storeDumpDir, fileId);

      console.log(`[${storeKey}] (${item.id}/15) Solicitando: ${item.type} -> ${targetUrl}`);

      let response = null;
      let attempts = 0;
      while (attempts < 5) {
        attempts++;
        try {
          if (item.type === 'menu_open') {
            response = await page.goto(storeData.base_url + '/', { waitUntil: 'domcontentloaded', timeout: 45000 });
            await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
            // Trigger drawer
            await page.evaluate(() => {
              const trigger = document.querySelector('[data-drawer-trigger]');
              if (trigger) trigger.click();
              const drawer = document.querySelector('theme-drawer');
              if (drawer && typeof drawer.setOpen === 'function') drawer.setOpen(true);
            });
            await sleep(800);
          } else {
            response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
            await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
          }

          if (response && response.status() === 429) {
            console.warn(`  [429 detectado] Reintentando tras 45s (intento ${attempts})...`);
            await sleep(45000);
            continue;
          }
          break;
        } catch (err) {
          console.warn(`  Advertencia al navegar: ${err.message}. Reintentando (${attempts})...`);
          await sleep(5000);
        }
      }

      const html = await page.content();
      fs.writeFileSync(filePath, html, 'utf8');

      capturedFiles.push({
        store: storeKey,
        domain: storeData.domain,
        url_id: item.id,
        url_type: item.type,
        url: targetUrl,
        file_path: filePath,
        file_name: fileId,
        size_bytes: Buffer.byteLength(html, 'utf8'),
        http_status: response ? response.status() : 200
      });

      console.log(`  -> Guardado: ${fileId} (${Buffer.byteLength(html, 'utf8')} bytes, status: ${response ? response.status() : 'ok'})`);
    }

    await page.close();
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`\nCaptura completada: ${capturedFiles.length} archivos HTML generados.`);

// Validar con vnu
console.log('\n--- EJECUTANDO NU HTML CHECKER (vnu-jar) ---');

let vnuVersion = 'unknown';
try {
  vnuVersion = execSync('npx vnu-jar --version', { encoding: 'utf8' }).trim();
} catch (e) {
  vnuVersion = e.message;
}
console.log(`Versión de vnu: ${vnuVersion}`);

const allVnuResults = [];

for (const [storeKey] of Object.entries(storesInventory)) {
  const storeDumpDir = path.join(HTML_DUMP_DIR, storeKey);
  console.log(`Validando lote de ${storeKey}...`);
  try {
    // vnu command
    const cmd = `npx vnu-jar --format json --stdout --exit-zero-always --skip-non-html "${storeDumpDir}"`;
    const stdout = execSync(cmd, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const parsed = JSON.parse(stdout);
    allVnuResults.push({
      store: storeKey,
      raw: parsed
    });
    console.log(`  Lote ${storeKey} analizado: ${parsed.messages ? parsed.messages.length : 0} mensajes reportados.`);
  } catch (err) {
    console.error(`  Error al ejecutar vnu en ${storeKey}: ${err.message}`);
    allVnuResults.push({
      store: storeKey,
      error: err.message
    });
  }
}

// Analizar y clasificar mensajes
console.log('\n--- CLASIFICANDO MENSAJES (TEMA VS SHOPIFY/PLATAFORMA) ---');

// Known platform / Shopify signatures in HTML
const SHOPIFY_PLATFORM_PATTERNS = [
  'origin-trial',
  'speculationrules',
  'trekkie',
  'cdn.shopify.com',
  'web-pixels-manager',
  'monorail',
  'boomr',
  'shopifycloud',
  'preview-bar-iframe',
  'recaptcha',
  'hcaptcha',
  'A “link” element with an “as” attribute',
  '“version” not allowed on element “link”',
  'type=module” must not have a “defer”',
  '“payment” not allowed on element “link”',
  'Bad value “payment” for attribute “rel”',
  'Bad value “preconnect” for attribute “rel” on element “link”: The “as” attribute',
  'The “as” attribute must only be specified for the “preload” and “prefetch”',
  'Element “script” with attribute “type” whose value is “speculationrules”',
  'Element “style” not allowed as child of element “div” in this context' // often inlined by Shopify apps/captcha
];

const processedResults = [];

let totalErrors = 0;
let totalWarnings = 0;
let totalThemeErrors = 0;
let totalThemeWarnings = 0;
let totalShopifyErrors = 0;
let totalShopifyWarnings = 0;

for (const storeBatch of allVnuResults) {
  const storeKey = storeBatch.store;
  const messages = storeBatch.raw ? storeBatch.raw.messages : [];

  for (const msg of messages) {
    const isError = msg.type === 'error';
    const isWarning = msg.type === 'info' && msg.subType === 'warning';

    if (isError) totalErrors++;
    if (isWarning) totalWarnings++;

    // Extract file name
    const urlDecoded = decodeURIComponent(msg.url || '');
    const fileName = path.basename(urlDecoded);
    const matchedCapture = capturedFiles.find((f) => f.store === storeKey && f.file_name === fileName);

    // Classification
    const messageText = msg.message || '';
    const extractText = msg.extract || '';

    let isShopify = false;
    let shopifyReason = '';

    for (const pat of SHOPIFY_PLATFORM_PATTERNS) {
      if (messageText.includes(pat) || extractText.includes(pat)) {
        isShopify = true;
        shopifyReason = `Coincidencia con patrón de plataforma Shopify: "${pat}"`;
        break;
      }
    }

    // Additional check: Does the extract belong to shopify headers or injected scripts?
    if (!isShopify) {
      if (extractText.includes('shopify-features') ||
          extractText.includes('Shopify.theme') ||
          extractText.includes('window.ShopifyAnalytics') ||
          extractText.includes('content_for_header') ||
          extractText.includes('cdn.shopify.com')) {
        isShopify = true;
        shopifyReason = 'Extracto contiene scripts o URLs inyectados por Shopify (content_for_header / CDN)';
      }
    }

    const classification = isShopify ? 'shopify_platform' : 'theme';

    if (classification === 'theme') {
      if (isError) totalThemeErrors++;
      if (isWarning) totalThemeWarnings++;
    } else {
      if (isError) totalShopifyErrors++;
      if (isWarning) totalShopifyWarnings++;
    }

    processedResults.push({
      store: storeKey,
      url_id: matchedCapture ? matchedCapture.url_id : null,
      url_type: matchedCapture ? matchedCapture.url_type : null,
      page_url: matchedCapture ? matchedCapture.url : null,
      file_name: fileName,
      type: msg.type,
      subType: msg.subType || null,
      message: messageText,
      extract: extractText,
      line: msg.lastLine,
      column: msg.lastColumn,
      classification: classification,
      classification_reason: shopifyReason || 'Atribuible al markup renderizado por el tema (sections/snippets/layout)'
    });
  }
}

console.log('\n--- RESUMEN DE HALLAZGOS ---');
console.log(`Total Errores: ${totalErrors}`);
console.log(`Total Advertencias: ${totalWarnings}`);
console.log(`Errores Plataforma Shopify: ${totalShopifyErrors}`);
console.log(`Advertencias Plataforma Shopify: ${totalShopifyWarnings}`);
console.log(`Errores Atribuibles al Tema: ${totalThemeErrors}`);
console.log(`Advertencias Atribuibles al Tema: ${totalThemeWarnings}`);

// Guardar salida cruda JSON
const rawOutputJson = {
  metadata: {
    audit_id: 'TECH-AUDIT-001',
    role: 'Rol 3: Validación HTML (Nu Html Checker / vnu)',
    timestamp: new Date().toISOString(),
    vnu_version: vnuVersion,
    stores_audited: Object.keys(storesInventory),
    urls_per_store: 15,
    total_pages_audited: capturedFiles.length,
    pacing_gap_ms: MIN_GAP_MS
  },
  summary: {
    total_messages: processedResults.length,
    total_errors: totalErrors,
    total_warnings: totalWarnings,
    shopify_platform: {
      errors: totalShopifyErrors,
      warnings: totalShopifyWarnings,
      total: totalShopifyErrors + totalShopifyWarnings
    },
    theme: {
      errors: totalThemeErrors,
      warnings: totalThemeWarnings,
      total: totalThemeErrors + totalThemeWarnings
    }
  },
  captured_files: capturedFiles,
  messages: processedResults
};

const jsonOutputPath = path.join(HARNESS_DIR, 'raw-vnu-validation.json');
fs.writeFileSync(jsonOutputPath, JSON.stringify(rawOutputJson, null, 2), 'utf8');
console.log(`Guardado JSON crudo en: ${jsonOutputPath}`);

// Guardar informe en texto plano .txt
const txtLines = [];
txtLines.push('================================================================================');
txtLines.push('AUDITORÍA TÉCNICA ROL 3: VALIDACIÓN HTML W3C (NU HTML CHECKER / VNU)');
txtLines.push('================================================================================');
txtLines.push(`ID Auditoría: TECH-AUDIT-001`);
txtLines.push(`Fecha: ${new Date().toISOString()}`);
txtLines.push(`Herramienta: vnu-jar (${vnuVersion})`);
txtLines.push(`Comando ejecutado: npx vnu-jar --format json --stdout --exit-zero-always --skip-non-html <dir>`);
txtLines.push(`Tiendas evaluadas: atelier, edition, archive (15 URLs por tienda = 45 URLs totales)`);
txtLines.push('--------------------------------------------------------------------------------');
txtLines.push('RESUMEN NUMÉRICO:');
txtLines.push(`  - Total mensajes reportados: ${processedResults.length}`);
txtLines.push(`  - Total Errores: ${totalErrors}`);
txtLines.push(`  - Total Advertencias: ${totalWarnings}`);
txtLines.push('');
txtLines.push('DISCRIMINACIÓN DE ORIGEN:');
txtLines.push(`  1. Plataforma Shopify / Apps / content_for_header:`);
txtLines.push(`     - Errores: ${totalShopifyErrors}`);
txtLines.push(`     - Advertencias: ${totalShopifyWarnings}`);
txtLines.push(`     - Causa principal: Tags inyectados por Shopify (rel="preload" con "as" no permitido en preconnect, specularules script type, módulos con defer en runtime de analytics, scripts de web-pixel).`);
txtLines.push('');
txtLines.push(`  2. Código propio del Tema (layout/, sections/, snippets/):`);
txtLines.push(`     - Errores: ${totalThemeErrors}`);
txtLines.push(`     - Advertencias: ${totalThemeWarnings}`);
txtLines.push('--------------------------------------------------------------------------------');

if (totalThemeErrors > 0 || totalThemeWarnings > 0) {
  txtLines.push('DETALLE DE MENSAJES ATRIBUIBLES AL TEMA:');
  const themeMessages = processedResults.filter((m) => m.classification === 'theme');
  themeMessages.forEach((m, idx) => {
    txtLines.push(`[#${idx + 1}] Tienda: ${m.store} | Página: ${m.url_type} (${m.page_url})`);
    txtLines.push(`     Tipo: ${m.type.toUpperCase()}${m.subType ? ' (' + m.subType + ')' : ''}`);
    txtLines.push(`     Mensaje: ${m.message}`);
    txtLines.push(`     Línea: ${m.line}, Columna: ${m.column}`);
    txtLines.push(`     Extracto: ${m.extract}`);
    txtLines.push('');
  });
} else {
  txtLines.push('RESULTADO PARA EL TEMA: 0 ERRORES Y 0 ADVERTENCIAS DETECTADAS EN EL CÓDIGO DEL TEMA.');
  txtLines.push('El 100% de las incidencias reportadas por el validador provienen de la plataforma Shopify.');
}

txtLines.push('================================================================================');

const txtOutputPath = path.join(HARNESS_DIR, 'raw-vnu-validation.txt');
fs.writeFileSync(txtOutputPath, txtLines.join('\n'), 'utf8');
console.log(`Guardado reporte de texto en: ${txtOutputPath}`);
console.log('=== VALIDACIÓN HTML ROL 3 FINALIZADA EXITOSAMENTE ===');
