import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const cookiesStr = fs.readFileSync('harness-AUDIT-360-001/storefront-cookies.txt', 'utf8');
const cookiePairs = cookiesStr.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: 'tema-qkqpke0j.myshopify.com', path: '/' };
});

const axeSource = fs.readFileSync('tests/vendor/axe.min.js', 'utf8');

const THEMES = [
  { name: 'Couture', id: '165809488115' },
  { name: 'Sartorial', id: '166186909939' },
  { name: 'Edition', id: '166186942707' },
  { name: 'Archive', id: '166187041011' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'mobile_small', width: 360, height: 640 }
];

const auditResults = {
  axe_violations: [],
  small_touch_targets: [],
  hero_contrast: {},
  heading_hierarchy: {},
  focus_visible_check: []
};

async function runA11yAudit() {
  const browser = await chromium.launch({ headless: true });

  for (const theme of THEMES) {
    console.log(`\n================ Testing Theme: ${theme.name} (${theme.id}) ================`);

    for (const vp of VIEWPORTS) {
      console.log(`--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      await context.addCookies(cookiePairs);
      const page = await context.newPage();

      // 1. Homepage
      const homeUrl = `https://tema-qkqpke0j.myshopify.com/?preview_theme_id=${theme.id}&pb=0`;
      await page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);
      await page.evaluate(axeSource);

      // Run axe on full page
      const axeHome = await page.evaluate(async () => {
        const res = await axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
        return res.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length }));
      });
      if (axeHome.length > 0) {
        auditResults.axe_violations.push({ theme: theme.name, page: 'home', viewport: vp.name, violations: axeHome });
      }

      // Check tap targets on home
      const smallTargets = await page.evaluate(() => {
        const elements = document.querySelectorAll('button, a, input, select, summary');
        const list = [];
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          // Filter visible elements
          if (rect.width > 0 && rect.height > 0 && (rect.width < 24 || rect.height < 24)) {
            // Check if inline text link (exemption in WCAG 2.2 Target Size Minimum)
            const style = window.getComputedStyle(el);
            if (style.display !== 'inline') {
              list.push({
                tag: el.tagName,
                text: el.innerText?.slice(0, 30)?.trim(),
                className: el.className,
                w: Math.round(rect.width),
                h: Math.round(rect.height)
              });
            }
          }
        });
        return list;
      });
      if (smallTargets.length > 0) {
        auditResults.small_touch_targets.push({ theme: theme.name, viewport: vp.name, count: smallTargets.length, items: smallTargets.slice(0, 5) });
      }

      // Test Drawer Open
      try {
        const cartBtn = page.locator('a[href*="/cart"], button[aria-controls*="CartDrawer"]').first();
        if (await cartBtn.count() > 0) {
          await cartBtn.click();
          await page.waitForTimeout(600);
          const axeDrawer = await page.evaluate(async () => {
            const drawer = document.querySelector('cart-drawer, #CartDrawer');
            if (!drawer) return [];
            const res = await axe.run(drawer, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
            return res.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }));
          });
          if (axeDrawer.length > 0) {
            auditResults.axe_violations.push({ theme: theme.name, page: 'cart_drawer_open', viewport: vp.name, violations: axeDrawer });
          }
          // Close drawer
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400);
        }
      } catch (e) {}

      // Test Predictive Search Open
      try {
        const searchBtn = page.locator('[data-predictive-search-open], button[aria-controls*="Search"]').first();
        if (await searchBtn.count() > 0) {
          await searchBtn.click();
          await page.waitForTimeout(500);
          const searchInput = page.locator('predictive-search input[type="search"]').first();
          if (await searchInput.count() > 0) {
            await searchInput.fill('wool');
            await page.waitForTimeout(800);
            const axeSearch = await page.evaluate(async () => {
              const ps = document.querySelector('predictive-search');
              if (!ps) return [];
              const res = await axe.run(ps, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
              return res.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }));
            });
            if (axeSearch.length > 0) {
              auditResults.axe_violations.push({ theme: theme.name, page: 'search_open', viewport: vp.name, violations: axeSearch });
            }
          }
        }
      } catch (e) {}

      // Measure Hero Contrast on Desktop & Mobile
      if (vp.name === 'desktop' || vp.name === 'mobile') {
        const heroContrast = await page.evaluate(() => {
          const hero = document.querySelector('.hero-editorial');
          if (!hero) return null;
          const heading = hero.querySelector('.hero-editorial__heading, h1, h2');
          const subheading = hero.querySelector('.hero-editorial__subheading, p');
          const overlay = hero.querySelector('.hero-editorial__overlay');
          const hStyle = heading ? window.getComputedStyle(heading) : null;
          const sStyle = subheading ? window.getComputedStyle(subheading) : null;
          const oStyle = overlay ? window.getComputedStyle(overlay) : null;

          return {
            heading_color: hStyle?.color,
            heading_font_size: hStyle?.fontSize,
            subheading_color: sStyle?.color,
            subheading_font_size: sStyle?.fontSize,
            overlay_bg: oStyle?.backgroundColor,
            overlay_opacity: oStyle?.opacity
          };
        });
        auditResults.hero_contrast[`${theme.name}_${vp.name}`] = heroContrast;
      }

      await page.close();
      await context.close();
    }
  }

  // Heading hierarchy check on Couture
  const pageH = await browser.newPage();
  await pageH.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  const headings = await pageH.evaluate(() => {
    const list = {};
    for (let i = 1; i <= 6; i++) {
      const el = document.querySelector(`h${i}`);
      if (el) {
        const style = window.getComputedStyle(el);
        list[`h${i}`] = {
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          fontFamily: style.fontFamily?.split(',')[0]
        };
      }
    }
    return list;
  });
  auditResults.heading_hierarchy = headings;
  await pageH.close();

  await browser.close();

  fs.writeFileSync('harness-AUDIT-360-001/report-06-accessibility.json', JSON.stringify(auditResults, null, 2), 'utf8');
  console.log('\nAccessibility audit complete!');
  console.log(`- Total axe violation instances: ${auditResults.axe_violations.length}`);
  console.log(`- Small touch targets entries: ${auditResults.small_touch_targets.length}`);
}

runA11yAudit().catch(err => {
  console.error('A11y audit error:', err);
  process.exit(1);
});
