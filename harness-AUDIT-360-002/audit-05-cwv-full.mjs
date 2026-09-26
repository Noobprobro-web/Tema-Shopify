import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, 'harness-AUDIT-360-002');
const CWV_DIR = path.join(HARNESS_DIR, 'cwv');
if (!fs.existsSync(CWV_DIR)) fs.mkdirSync(CWV_DIR, { recursive: true });

const cookiesStr = fs.readFileSync('harness-AUDIT-360-001/storefront-cookies.txt', 'utf8');
const cookiePairs = cookiesStr.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: 'tema-qkqpke0j.myshopify.com', path: '/' };
});

const THEMES = [
  { name: 'Couture', id: '165809488115' },
  { name: 'Sartorial', id: '166186909939' },
  { name: 'Edition', id: '166186942707' },
  { name: 'Archive', id: '166187041011' }
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'collection', path: '/collections/all' },
  { name: 'product', path: '/products/qa5a-f04-colour-size' }
];

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667, isMobile: true },
  { name: 'desktop', width: 1280, height: 800, isMobile: false }
];

function median(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const matrix = {};

  for (const theme of THEMES) {
    matrix[theme.name] = {};
    for (const pageDef of PAGES) {
      matrix[theme.name][pageDef.name] = {};
      for (const vp of VIEWPORTS) {
        console.log(`[CWV 72] Auditing ${theme.name} -> ${pageDef.name} [${vp.name}]...`);
        const runData = [];

        for (let r = 1; r <= 3; r++) {
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            isMobile: vp.isMobile
          });
          await context.addCookies(cookiePairs);
          const page = await context.newPage();

          await page.addInitScript(() => {
            window.__perf = { lcp: 0, cls: 0, lcpElement: '' };
            new PerformanceObserver((entryList) => {
              for (const entry of entryList.getEntries()) {
                window.__perf.lcp = entry.startTime;
                window.__perf.lcpElement = entry.element ? entry.element.tagName + '.' + (entry.element.className || '') : '';
              }
            }).observe({ type: 'largest-contentful-paint', buffered: true });

            new PerformanceObserver((entryList) => {
              for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                  window.__perf.cls += entry.value;
                }
              }
            }).observe({ type: 'layout-shift', buffered: true });
          });

          const url = `https://tema-qkqpke0j.myshopify.com${pageDef.path}?preview_theme_id=${theme.id}&pb=0`;
          await page.goto(url, { waitUntil: 'load' });
          await page.waitForTimeout(1200);

          const metrics = await page.evaluate(() => {
            const nav = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            const fcpEntry = paint.find(p => p.name === 'first-contentful-paint');
            const resources = performance.getEntriesByType('resource');
            let js = 0, css = 0, img = 0, font = 0;
            resources.forEach(res => {
              const size = res.transferSize || 0;
              if (res.initiatorType === 'script' || res.name.endsWith('.js')) js += size;
              else if (res.initiatorType === 'css' || res.initiatorType === 'link' || res.name.endsWith('.css')) css += size;
              else if (res.initiatorType === 'img' || /\.(png|jpe?g|webp|avif|gif|svg)/.test(res.name)) img += size;
              else if (/\.(woff2?|ttf|otf)/.test(res.name)) font += size;
            });

            return {
              fcp: fcpEntry ? fcpEntry.startTime : 0,
              lcp: window.__perf.lcp,
              cls: window.__perf.cls,
              ttfb: nav ? nav.responseStart - nav.requestStart : 0,
              domLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
              lcpElement: window.__perf.lcpElement,
              transferSizes: { js, css, img, font }
            };
          });

          const record = {
            theme: theme.name,
            theme_id: theme.id,
            page: pageDef.name,
            viewport: vp.name,
            run: r,
            metrics: {
              lcp_ms: Math.round(metrics.lcp),
              cls: Number(metrics.cls.toFixed(4)),
              fcp_ms: Math.round(metrics.fcp),
              ttfb_ms: Math.round(metrics.ttfb),
              dom_loaded_ms: Math.round(metrics.domLoaded)
            },
            transfer_sizes_bytes: metrics.transferSizes,
            lcp_element: metrics.lcpElement
          };

          const rawFile = path.join(CWV_DIR, `${theme.name}_${pageDef.name}_${vp.name}_run${r}.json`);
          fs.writeFileSync(rawFile, JSON.stringify(record, null, 2), 'utf8');
          runData.push(record);

          await page.close();
          await context.close();
        }

        const lcps = runData.map(d => d.metrics.lcp_ms);
        const clss = runData.map(d => d.metrics.cls);
        const fcps = runData.map(d => d.metrics.fcp_ms);
        const ttfbs = runData.map(d => d.metrics.ttfb_ms);

        matrix[theme.name][pageDef.name][vp.name] = {
          runs: runData.map(d => ({
            run: d.run,
            lcp_ms: d.metrics.lcp_ms,
            cls: d.metrics.cls,
            raw_file: `harness-AUDIT-360-002/cwv/${theme.name}_${pageDef.name}_${vp.name}_run${d.run}.json`
          })),
          median_lcp_ms: Math.round(median(lcps)),
          average_lcp_ms: Math.round(average(lcps)),
          median_cls: Number(median(clss).toFixed(4)),
          average_cls: Number(average(clss).toFixed(4)),
          median_fcp_ms: Math.round(median(fcps)),
          median_ttfb_ms: Math.round(median(ttfbs))
        };
      }
    }
  }

  await browser.close();

  // Summary per theme and device
  const summaryByDevice = {};
  for (const theme of THEMES) {
    summaryByDevice[theme.name] = {};
    for (const vp of VIEWPORTS) {
      const allThemeVpLcps = [];
      const allThemeVpClss = [];
      for (const pageDef of PAGES) {
        const item = matrix[theme.name][pageDef.name][vp.name];
        allThemeVpLcps.push(item.median_lcp_ms);
        allThemeVpClss.push(item.median_cls);
      }
      summaryByDevice[theme.name][vp.name] = {
        avg_lcp_ms: Math.round(average(allThemeVpLcps)),
        avg_cls: Number(average(allThemeVpClss).toFixed(4))
      };
    }
  }

  const finalOutput = {
    total_runs: 72,
    matrix,
    summary_by_device: summaryByDevice
  };

  fs.writeFileSync(path.join(HARNESS_DIR, 'report-05-cwv-matrix.json'), JSON.stringify(finalOutput, null, 2), 'utf8');
  console.log('All 72 CWV runs completed and raw files saved in harness-AUDIT-360-002/cwv/!');
}

run().catch(err => {
  console.error('CWV 72 run error:', err);
  process.exit(1);
});
