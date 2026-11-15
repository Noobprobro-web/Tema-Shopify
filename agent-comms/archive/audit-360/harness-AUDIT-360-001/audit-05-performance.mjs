import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

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

async function runPerfAudit() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const theme of THEMES) {
    results[theme.name] = {};

    for (const pageDef of PAGES) {
      results[theme.name][pageDef.name] = {};

      for (const vp of VIEWPORTS) {
        console.log(`Auditing ${theme.name} -> ${pageDef.name} [${vp.name}]...`);
        const runMetrics = {
          fcp: [],
          lcp: [],
          cls: [],
          ttfb: [],
          transferSize: { js: 0, css: 0, img: 0, font: 0 },
          lcpElement: null,
          imageAudits: []
        };

        for (let run = 1; run <= 3; run++) {
          const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            isMobile: vp.isMobile
          });
          await context.addCookies(cookiePairs);
          const page = await context.newPage();

          // Performance observer script injected before doc load
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
          await page.waitForTimeout(1500);

          const metrics = await page.evaluate(() => {
            const nav = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            const fcpEntry = paint.find(p => p.name === 'first-contentful-paint');

            const resources = performance.getEntriesByType('resource');
            let js = 0, css = 0, img = 0, font = 0;
            resources.forEach(r => {
              const size = r.transferSize || 0;
              if (r.initiatorType === 'script' || r.name.endsWith('.js')) js += size;
              else if (r.initiatorType === 'css' || r.initiatorType === 'link' || r.name.endsWith('.css')) css += size;
              else if (r.initiatorType === 'img' || /\.(png|jpe?g|webp|avif|gif|svg)/.test(r.name)) img += size;
              else if (/\.(woff2?|ttf|otf)/.test(r.name)) font += size;
            });

            // Inspect hero / first image
            const firstImg = document.querySelector('img');
            const heroImg = document.querySelector('.hero-editorial__image, .product-gallery__image img, .collection-hero__image');

            return {
              fcp: fcpEntry ? fcpEntry.startTime : 0,
              lcp: window.__perf.lcp,
              cls: window.__perf.cls,
              ttfb: nav ? nav.responseStart - nav.requestStart : 0,
              domLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
              lcpElement: window.__perf.lcpElement,
              resourceSizes: { js, css, img, font },
              heroImageAttrs: heroImg ? {
                loading: heroImg.getAttribute('loading'),
                fetchpriority: heroImg.getAttribute('fetchpriority'),
                srcset: !!heroImg.getAttribute('srcset'),
                sizes: heroImg.getAttribute('sizes')
              } : null
            };
          });

          runMetrics.fcp.push(metrics.fcp);
          runMetrics.lcp.push(metrics.lcp);
          runMetrics.cls.push(metrics.cls);
          runMetrics.ttfb.push(metrics.ttfb);
          if (run === 1) {
            runMetrics.transferSize = metrics.resourceSizes;
            runMetrics.lcpElement = metrics.lcpElement;
            runMetrics.imageAudit = metrics.heroImageAttrs;
          }

          await page.close();
          await context.close();
        }

        results[theme.name][pageDef.name][vp.name] = {
          median_fcp_ms: Math.round(median(runMetrics.fcp)),
          median_lcp_ms: Math.round(median(runMetrics.lcp)),
          median_cls: Number(median(runMetrics.cls).toFixed(4)),
          median_ttfb_ms: Math.round(median(runMetrics.ttfb)),
          runs_lcp: runMetrics.lcp.map(Math.round),
          runs_cls: runMetrics.cls.map(c => Number(c.toFixed(4))),
          transfer_sizes_bytes: runMetrics.transferSize,
          image_audit: runMetrics.imageAudit
        };
      }
    }
  }

  await browser.close();

  fs.writeFileSync('harness-AUDIT-360-001/report-05-performance.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nPerformance audit finished successfully! Saved to harness-AUDIT-360-001/report-05-performance.json');
}

runPerfAudit().catch(err => {
  console.error('Perf audit error:', err);
  process.exit(1);
});
