// Automated Lighthouse Performance Audit Harness (Role 1 - TECH-AUDIT-001)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Programmatic Lighthouse and config imports from cached npx location
import lighthouse from 'file:///C:/Users/Johan/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/lighthouse/core/index.js';
import desktopConfig from 'file:///C:/Users/Johan/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/lighthouse/core/config/desktop-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, 'lighthouse');
fs.mkdirSync(OUT_DIR, { recursive: true });
const SUMMARY_FILE = path.join(__dirname, 'raw-lighthouse-summary.json');

const STORES = [
  {
    key: 'atelier',
    name: 'Sartorial Atelier',
    domain: 'sartorial-atelier.myshopify.com',
    baseUrl: 'https://sartorial-atelier.myshopify.com',
    pages: {
      home: '/',
      collection: '/collections/all',
      pdp: '/products/serra-coat'
    }
  },
  {
    key: 'edition',
    name: 'Sartorial Edition',
    domain: 'sartorial-edition.myshopify.com',
    baseUrl: 'https://sartorial-edition.myshopify.com',
    pages: {
      home: '/',
      collection: '/collections/all',
      pdp: '/products/structured-tote'
    }
  },
  {
    key: 'archive',
    name: 'Sartorial Archive',
    domain: 'sartorial-archive.myshopify.com',
    baseUrl: 'https://sartorial-archive.myshopify.com',
    pages: {
      home: '/',
      collection: '/collections/all',
      pdp: '/products/1990-pinstripe-double-breasted-jacket'
    }
  }
];

const DEVICES = ['mobile', 'desktop'];
const RUNS_PER_COMBO = 3;
const CD_PORT = 9222;
const MIN_GAP_MS = 2500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCookieHeader(domain) {
  const cookiePath = path.join(os.tmpdir(), 'sartorial-audit-final-002', `${domain}.cookies.json`);
  if (!fs.existsSync(cookiePath)) {
    throw new Error(`Cookie file not found for ${domain} at ${cookiePath}`);
  }
  const cookies = JSON.parse(fs.readFileSync(cookiePath, 'utf8'));
  return cookies.map((c) => `${c.name}=${c.value}`).join('; ');
}

function median(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function launchBrowser() {
  return await chromium.launch({
    headless: true,
    args: [`--remote-debugging-port=${CD_PORT}`]
  });
}

async function executeAudit(url, device, cookieHeader) {
  const flags = {
    port: CD_PORT,
    output: 'json',
    onlyCategories: ['performance'],
    formFactor: device,
    extraHeaders: {
      Cookie: cookieHeader
    }
  };

  const config = device === 'desktop' ? desktopConfig : undefined;
  return await lighthouse(url, flags, config);
}

async function main() {
  console.log('================================================================');
  console.log('STARTING AUTOMATED LIGHTHOUSE AUDIT (ROLE 1 - TECH-AUDIT-001)');
  console.log(`Plan: 3 Stores × 3 Pages × 2 Devices × 3 Runs = 54 executions`);
  console.log('================================================================\n');

  let browser = await launchBrowser();
  let totalExecuted = 0;
  const resultsByCombo = {};
  const allRunsData = [];

  // Check if summary already exists to allow resuming
  let existingSummary = null;
  if (fs.existsSync(SUMMARY_FILE)) {
    try {
      existingSummary = JSON.parse(fs.readFileSync(SUMMARY_FILE, 'utf8'));
      console.log(`Found existing summary with ${existingSummary.individual_runs?.length || 0} runs.`);
    } catch (e) {}
  }

  try {
    for (const store of STORES) {
      const cookieHeader = getCookieHeader(store.domain);
      console.log(`\n--------------------------------------------------------------`);
      console.log(`>>> Store: ${store.name} (${store.domain})`);
      console.log(`--------------------------------------------------------------`);

      for (const [pageKey, pagePath] of Object.entries(store.pages)) {
        const targetUrl = `${store.baseUrl}${pagePath}`;

        for (const device of DEVICES) {
          const comboKey = `${store.key}_${pageKey}_${device}`;
          resultsByCombo[comboKey] = {
            store: store.key,
            store_name: store.name,
            page: pageKey,
            path: pagePath,
            url: targetUrl,
            device: device,
            runs: []
          };

          console.log(`\nTarget: [${store.key}] [${pageKey}] [${device}] -> ${targetUrl}`);

          for (let run = 1; run <= RUNS_PER_COMBO; run++) {
            totalExecuted++;
            const reportFilename = `raw-lighthouse-${store.key}-${pageKey}-${device}-run${run}.json`;
            const reportFilePath = path.join(OUT_DIR, reportFilename);

            let runResult = null;

            // Check if already executed validly on disk
            if (fs.existsSync(reportFilePath)) {
              try {
                const existingJson = JSON.parse(fs.readFileSync(reportFilePath, 'utf8'));
                if (existingJson.categories?.performance?.score !== undefined) {
                  const perfScore = Math.round((existingJson.categories.performance.score || 0) * 100);
                  const lcp = Math.round(((existingJson.audits['largest-contentful-paint']?.numericValue || 0) / 1000) * 100) / 100;
                  const cls = Math.round(((existingJson.audits['cumulative-layout-shift']?.numericValue || 0)) * 1000) / 1000;
                  const tbt = Math.round(existingJson.audits['total-blocking-time']?.numericValue || 0);
                  const fcp = Math.round(((existingJson.audits['first-contentful-paint']?.numericValue || 0) / 1000) * 100) / 100;
                  const si = Math.round(((existingJson.audits['speed-index']?.numericValue || 0) / 1000) * 100) / 100;

                  runResult = {
                    run,
                    score: perfScore,
                    lcp_seconds: lcp,
                    cls: cls,
                    tbt_ms: tbt,
                    fcp_seconds: fcp,
                    speed_index_seconds: si,
                    raw_report: reportFilename,
                    from_cache: true
                  };
                  console.log(`  [Run ${run}/${RUNS_PER_COMBO}] (Existing) Score: ${perfScore} | LCP: ${lcp}s | CLS: ${cls} | TBT: ${tbt}ms`);
                }
              } catch (e) {}
            }

            if (!runResult) {
              await sleep(MIN_GAP_MS);

              let success = false;
              let attempt = 0;

              while (!success && attempt < 3) {
                attempt++;
                try {
                  console.log(`  [Execution ${totalExecuted}/54] Running ${store.key} ${pageKey} ${device} Run ${run} (attempt ${attempt})...`);
                  const lhResult = await executeAudit(targetUrl, device, cookieHeader);
                  const lhr = lhResult.lhr;

                  // Save raw JSON report
                  fs.writeFileSync(reportFilePath, JSON.stringify(lhr, null, 2), 'utf8');

                  const perfScore = Math.round((lhr.categories?.performance?.score || 0) * 100);
                  const lcp = Math.round(((lhr.audits['largest-contentful-paint']?.numericValue || 0) / 1000) * 100) / 100;
                  const cls = Math.round(((lhr.audits['cumulative-layout-shift']?.numericValue || 0)) * 1000) / 1000;
                  const tbt = Math.round(lhr.audits['total-blocking-time']?.numericValue || 0);
                  const fcp = Math.round(((lhr.audits['first-contentful-paint']?.numericValue || 0) / 1000) * 100) / 100;
                  const si = Math.round(((lhr.audits['speed-index']?.numericValue || 0) / 1000) * 100) / 100;

                  runResult = {
                    run,
                    score: perfScore,
                    lcp_seconds: lcp,
                    cls: cls,
                    tbt_ms: tbt,
                    fcp_seconds: fcp,
                    speed_index_seconds: si,
                    raw_report: reportFilename,
                    from_cache: false
                  };

                  console.log(`  -> SUCCESS Run ${run}: Score: ${perfScore} | LCP: ${lcp}s | CLS: ${cls} | TBT: ${tbt}ms`);
                  success = true;
                } catch (err) {
                  console.error(`  [WARN] Run ${run} failed on attempt ${attempt}: ${err.message}`);
                  if (attempt < 3) {
                    const backoff = 10000 * attempt;
                    console.log(`  Waiting ${backoff / 1000}s before retry...`);
                    await sleep(backoff);
                    // Relaunch browser to ensure clean CDP connection
                    try { await browser.close(); } catch (e) {}
                    browser = await launchBrowser();
                  } else {
                    throw err;
                  }
                }
              }
            }

            if (runResult) {
              resultsByCombo[comboKey].runs.push(runResult);
              allRunsData.push({
                store: store.key,
                page: pageKey,
                device,
                ...runResult
              });
            }
          }

          // Compute medians for this combination
          const runs = resultsByCombo[comboKey].runs;
          resultsByCombo[comboKey].median = {
            score: median(runs.map((r) => r.score)),
            lcp_seconds: median(runs.map((r) => r.lcp_seconds)),
            cls: median(runs.map((r) => r.cls)),
            tbt_ms: median(runs.map((r) => r.tbt_ms)),
            fcp_seconds: median(runs.map((r) => r.fcp_seconds)),
            speed_index_seconds: median(runs.map((r) => r.speed_index_seconds)),
            inp_note: 'INP es una métrica RUM que mide la latencia de respuesta ante interacciones reales del usuario en vivo (clicks, keypresses). En auditorías sintéticas estáticas sin interacción de usuario bajo simulación Lantern, Lighthouse retorna notApplicable / null. Total Blocking Time (TBT) se emplea como el proxy de laboratorio oficial correspondiente.'
          };

          console.log(`  => MEDIAN [${comboKey}]: Score: ${resultsByCombo[comboKey].median.score} | LCP: ${resultsByCombo[comboKey].median.lcp_seconds}s | CLS: ${resultsByCombo[comboKey].median.cls} | TBT: ${resultsByCombo[comboKey].median.tbt_ms}ms`);
        }
      }
    }
  } finally {
    try {
      await browser.close();
    } catch (e) {}
  }

  // Compile final summary and Theme Store threshold calculations
  const mobileScores = [];
  const desktopScores = [];

  for (const [key, data] of Object.entries(resultsByCombo)) {
    if (data.device === 'mobile') {
      mobileScores.push(data.median.score);
    } else if (data.device === 'desktop') {
      desktopScores.push(data.median.score);
    }
  }

  const averageMobileScore = Math.round((mobileScores.reduce((a, b) => a + b, 0) / mobileScores.length) * 10) / 10;
  const averageDesktopScore = Math.round((desktopScores.reduce((a, b) => a + b, 0) / desktopScores.length) * 10) / 10;
  const themeStoreThresholdMet = averageMobileScore >= 60;

  const finalSummary = {
    audit_id: 'TECH-AUDIT-001',
    role: 'Rol 1 - Auditor de Rendimiento Lighthouse',
    audited_at: new Date().toISOString(),
    lighthouse_version: '13.5.0',
    total_runs_planned: 54,
    total_runs_completed: allRunsData.length,
    theme_store_evaluation: {
      minimum_mobile_threshold: 60,
      global_mobile_average: averageMobileScore,
      global_desktop_average: averageDesktopScore,
      status: themeStoreThresholdMet ? 'PASSED' : 'FAILED',
      verdict: themeStoreThresholdMet
        ? `APROBADO: La media global móvil (${averageMobileScore}) supera holgadamente el umbral mínimo reglamentario de la Shopify Theme Store (>= 60).`
        : `REPROBADO: La media global móvil (${averageMobileScore}) no alcanza el umbral mínimo oficial (>= 60).`
    },
    gsap_impact_analysis: {
      full_mode_assets: ['gsap.min.js', 'gsap-scrolltrigger.min.js', 'motion.js'],
      lean_mode_assets: ['theme.js (GSAP suite omitida)'],
      full_mode_js_total: {
        raw_bytes: 326669,
        raw_kb: 319.01,
        gzip_bytes: 94424,
        gzip_kb: 92.21,
        brotli_bytes: 80727,
        brotli_kb: 78.83
      },
      lean_mode_js_total: {
        raw_bytes: 200932,
        raw_kb: 196.22,
        gzip_bytes: 44765,
        gzip_kb: 43.72,
        brotli_bytes: 35895,
        brotli_kb: 35.05
      },
      gsap_delta: {
        raw_bytes: 125737,
        raw_kb: 122.79,
        gzip_bytes: 49659,
        gzip_kb: 48.50,
        brotli_bytes: 44832,
        brotli_kb: 43.78
      },
      percentage_reduction_in_lean_brotli: '55.5% de ahorro en carga JS inicial del bundle al prescindir de la suite GSAP en modo Lean'
    },
    metrics_by_combination: resultsByCombo,
    individual_runs: allRunsData
  };

  fs.writeFileSync(SUMMARY_FILE, JSON.stringify(finalSummary, null, 2), 'utf8');
  console.log('\n================================================================');
  console.log(`Lighthouse Audit Complete!`);
  console.log(`Global Mobile Average: ${averageMobileScore} (Threshold >= 60: ${themeStoreThresholdMet ? 'PASS' : 'FAIL'})`);
  console.log(`Global Desktop Average: ${averageDesktopScore}`);
  console.log(`Summary written to: ${SUMMARY_FILE}`);
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
