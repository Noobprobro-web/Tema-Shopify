import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STOREFRONT_PASSWORD = process.env.STOREFRONT_PASSWORD;
if (!STOREFRONT_PASSWORD) {
  throw new Error('STOREFRONT_PASSWORD is not set. Export it before running this script.');
}

const ARTIFACT_DIR = 'C:/Users/Johan/.gemini/antigravity/brain/30c4bfa2-ce88-4892-a967-adc7f0c3609e';

const THEMES = [
  { name: 'sartorial', id: '166186909939', label: 'Sartorial (Editorial Lujo)' },
  { name: 'imprint', id: '166186942707', label: 'Imprint (Minimalista Monocromo)' },
  { name: 'archive', id: '166187041011', label: 'Archive (Heritage / Tradición)' },
];

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Developer-store file references (shopify://shop_images/...) resolve to nothing in a clean
// install, so they must never reach the JSON that travels inside the theme ZIP. Only this
// scheme is cleared: shopify://collections/, shopify://products/ and shopify://apps/ are
// legitimate links and are left untouched.
const SHOP_FILE_URI_PREFIX = 'shopify://shop_images/';

// Every theme JSON a preset refresh is allowed to rewrite. All of them ship inside the ZIP,
// so all of them go through writeThemeJson().
const THEME_JSON_TARGETS = [
  'listings/sartorial/templates/index.json',
  'listings/imprint/templates/index.json',
  'listings/archive/templates/index.json',
  'sections/header-group.json',
];

// Recursive on purpose: a settings value can sit inside blocks inside sections inside a
// template, so the walk cannot stop at the first level, and it keys off the value prefix
// instead of a list of known image settings, which would go stale on the next new setting.
export function sanitizeShopFileUris(input, keyPath = '') {
  const cleared = [];

  if (typeof input === 'string') {
    if (input.startsWith(SHOP_FILE_URI_PREFIX)) {
      cleared.push({ key: keyPath || '(root)', uri: input });
      return { value: '', cleared };
    }
    return { value: input, cleared };
  }

  if (Array.isArray(input)) {
    const value = input.map((item, index) => {
      const result = sanitizeShopFileUris(item, `${keyPath}[${index}]`);
      cleared.push(...result.cleared);
      return result.value;
    });
    return { value, cleared };
  }

  if (input !== null && typeof input === 'object') {
    const value = {};
    for (const [key, item] of Object.entries(input)) {
      const result = sanitizeShopFileUris(item, keyPath ? `${keyPath}.${key}` : key);
      cleared.push(...result.cleared);
      value[key] = result.value;
    }
    return { value, cleared };
  }

  return { value: input, cleared };
}

function reportCleared(label, cleared) {
  if (cleared.length === 0) {
    console.log(`No developer-store image URIs in ${label}.`);
    return;
  }
  console.log(`Cleared ${cleared.length} developer-store image URI(s) in ${label}:`);
  for (const entry of cleared) {
    console.log(`  ${entry.key} <- ${entry.uri}`);
  }
}

// The one write path for anything this script persists into the theme. Sanitizing here
// rather than at the call sites means a future preset writer cannot forget to do it.
export async function writeThemeJson(relativePath, data) {
  const { value, cleared } = sanitizeShopFileUris(data);
  reportCleared(relativePath, cleared);

  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  if (serialized.includes(SHOP_FILE_URI_PREFIX)) {
    throw new Error(`${relativePath} still carries ${SHOP_FILE_URI_PREFIX} after sanitizing. Nothing was written.`);
  }

  await writeFile(path.join(REPO_ROOT, relativePath), serialized, 'utf8');
  console.log(`Wrote ${relativePath}`);
}

// Read-only preflight. Screenshots of a reinfected preset set would certify a state that
// cannot ship, so the capture stops before it touches the storefront and names the keys.
async function assertThemeJsonClean() {
  const offenders = [];

  for (const relativePath of THEME_JSON_TARGETS) {
    const source = await readFile(path.join(REPO_ROOT, relativePath), 'utf8');
    const { cleared } = sanitizeShopFileUris(JSON.parse(source.replace(/^\uFEFF/, '')));
    for (const entry of cleared) {
      offenders.push(`${relativePath}: ${entry.key} = ${entry.uri}`);
    }
  }

  if (offenders.length > 0) {
    throw new Error(
      `Found ${offenders.length} developer-store image URI(s) in theme JSON. Clear them before capturing:\n  ${offenders.join('\n  ')}`
    );
  }

  console.log(`Checked ${THEME_JSON_TARGETS.length} theme JSON files: no ${SHOP_FILE_URI_PREFIX} references.`);
}

async function capture() {
  await assertThemeJsonClean();

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
    await input.fill(STOREFRONT_PASSWORD);
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

// Only capture when this file is the entry point: sanitizeShopFileUris and writeThemeJson
// are exported for reuse, and importing them must not open a browser.
const isDirectRun = process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  capture().catch((err) => {
    console.error('Capture failed:', err);
    process.exit(1);
  });
}
