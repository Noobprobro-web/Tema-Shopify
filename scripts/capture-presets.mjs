import { chromium } from 'playwright';
import path from 'node:path';

const ARTIFACT_DIR = 'C:/Users/Johan/.gemini/antigravity/brain/30c4bfa2-ce88-4892-a967-adc7f0c3609e';

const THEMES = [
  { name: 'sartorial', id: '166186909939', label: 'Sartorial (Editorial Lujo)' },
  { name: 'edition', id: '166186942707', label: 'Edition (Minimalista Monocromo)' },
  { name: 'archive', id: '166187041011', label: 'Archive (Heritage / Tradición)' },
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  console.log('Logging in to storefront...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/password', { waitUntil: 'domcontentloaded' });
  const input = page.locator('input[type="password"]');
  if (await input.count() > 0) {
    await input.fill(***ROTATED_STOREFRONT_CREDENTIAL***);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle' }).catch(() => {});
    console.log('Logged in successfully. URL:', page.url());
  }

  for (const theme of THEMES) {
    const url = `https://tema-qkqpke0j.myshopify.com/?preview_theme_id=${theme.id}`;
    console.log(`Navigating to ${theme.label} at ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(async () => {
      await page.waitForLoadState('domcontentloaded');
    });

    await page.waitForTimeout(2500);

    // Remove preview bar if present
    await page.evaluate(() => {
      const bar = document.querySelector('#preview-bar-iframe, iframe[name="preview-bar"]');
      if (bar) bar.style.display = 'none';
      const root = document.querySelector(':root');
      if (root) root.style.setProperty('--preview-bar-offset', '0px');
    }).catch(() => {});

    // Hero viewport screenshot
    const heroPath = path.join(ARTIFACT_DIR, `preview-${theme.name}-hero.png`);
    await page.screenshot({ path: heroPath, fullPage: false });
    console.log(`Saved hero screenshot to ${heroPath}`);

    // Full page screenshot
    const fullPath = path.join(ARTIFACT_DIR, `preview-${theme.name}-full.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`Saved full screenshot to ${fullPath}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
