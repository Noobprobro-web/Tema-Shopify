import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const HARNESS_DIR = path.join(ROOT, 'harness-AUDIT-360-002');
const CONTRAST_DIR = path.join(HARNESS_DIR, 'contrast');
if (!fs.existsSync(CONTRAST_DIR)) fs.mkdirSync(CONTRAST_DIR, { recursive: true });

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

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(colorStr) {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return { r: 255, g: 255, b: 255, a: 1 };
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1
  };
}

async function runContrastAudit() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  for (const theme of THEMES) {
    results[theme.name] = {};
    for (const vp of [{ name: 'desktop', width: 1280, height: 800 }, { name: 'mobile', width: 375, height: 667 }]) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      await context.addCookies(cookiePairs);
      const page = await context.newPage();

      const url = `https://tema-qkqpke0j.myshopify.com/?preview_theme_id=${theme.id}&pb=0`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(600);

        const heroContrast = await page.evaluate(() => {
          const hero = document.querySelector('.hero-editorial, .hero, [class*="hero"]');
          if (!hero) return { found: false };

          const heading = hero.querySelector('h1, h2, .hero-editorial__heading, [class*="heading"]');
          const subheading = hero.querySelector('.hero-editorial__subheading, [class*="subheading"], p');
          const overlay = hero.querySelector('.hero-editorial__overlay, [class*="overlay"]');

          const headingCs = heading ? getComputedStyle(heading) : null;
          const subCs = subheading ? getComputedStyle(subheading) : null;
          const overlayCs = overlay ? getComputedStyle(overlay) : null;
          const heroCs = getComputedStyle(hero);

          return {
            found: true,
            heroClass: hero.className,
            overlayOpacityVar: heroCs.getPropertyValue('--hero-overlay-opacity').trim() || null,
            overlayBg: overlayCs ? overlayCs.backgroundColor : null,
            headingColor: headingCs ? headingCs.color : null,
            subheadingColor: subCs ? subCs.color : null,
            headingText: heading ? heading.innerText.trim().slice(0, 50) : null,
            subheadingText: subheading ? subheading.innerText.trim().slice(0, 50) : null
          };
        });

        // Calculate contrast against dark overlay (black with overlay opacity)
        if (heroContrast.found) {
          const opacity = parseFloat(heroContrast.overlayOpacityVar) || 0.6;
          // Simulated effective background: blend black (0,0,0) at opacity over white/light image (approx 200, 200, 200)
          const effR = Math.round(200 * (1 - opacity));
          const effG = Math.round(200 * (1 - opacity));
          const effB = Math.round(200 * (1 - opacity));
          const bgLum = luminance(effR, effG, effB);

          let headingRatio = null;
          let subRatio = null;
          if (heroContrast.headingColor) {
            const hc = parseRgb(heroContrast.headingColor);
            headingRatio = contrastRatio(luminance(hc.r, hc.g, hc.b), bgLum);
          }
          if (heroContrast.subheadingColor) {
            const sc = parseRgb(heroContrast.subheadingColor);
            subRatio = contrastRatio(luminance(sc.r, sc.g, sc.b), bgLum);
          }

          results[theme.name][vp.name] = {
            ...heroContrast,
            effectiveBgRgb: `rgb(${effR}, ${effG}, ${effB})`,
            calculatedHeadingContrast: headingRatio ? headingRatio.toFixed(2) + ':1' : null,
            calculatedSubheadingContrast: subRatio ? subRatio.toFixed(2) + ':1' : null,
            passesWcagAAHeading: headingRatio ? headingRatio >= 3.0 : null, // large text
            passesWcagAASubheading: subRatio ? subRatio >= 4.5 : null // body text
          };
        } else {
          results[theme.name][vp.name] = { found: false };
        }
      } catch (err) {
        results[theme.name][vp.name] = { error: err.message };
      }

      await page.close();
      await context.close();
    }
  }

  await browser.close();

  const outPath = path.join(CONTRAST_DIR, 'hero-contrast-summary.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`[Role 06 - Contrast] Contrast audit complete. Output written to ${outPath}`);
}

runContrastAudit().catch(err => {
  console.error('[Role 06 - Contrast] Error:', err);
  process.exit(1);
});
