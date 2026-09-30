// Shared helpers for CLAUDE-REPORT-AUDIT-FINAL-002 live harness.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';

export const STORES = {
  atelier: {
    url: 'https://sartorial-atelier.myshopify.com',
    products: ['serra-coat', 'nove-blazer', 'pleated-wide-trouser', 'silk-charmeuse-blouse'],
  },
  edition: {
    url: 'https://sartorial-edition.myshopify.com',
    products: ['structured-tote', 'leather-desk-mat', 'milled-brass-paperweight', 'leather-document-folio'],
  },
  archive: {
    url: 'https://sartorial-archive.myshopify.com',
    products: ['1990-pinstripe-double-breasted-jacket', '1999-technical-cotton-trench', '1998-bias-cut-silk-slip'],
  },
};

// Storefront password comes from the directive; overridable, never a secret token.
export const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD || '1234';

// Las cookies de sesión del storefront se guardan FUERA del repositorio (nunca en git):
// reutilizarlas evita un login por contexto, que dispara el limitador de intentos de Shopify.
const STATE_DIR = process.env.AUDIT_STATE_DIR || path.join(os.tmpdir(), 'sartorial-audit-final-002');
fs.mkdirSync(STATE_DIR, { recursive: true });
const stateFile = (storeUrl) => path.join(STATE_DIR, new URL(storeUrl).host + '.cookies.json');

export async function launch() {
  return chromium.launch({ headless: true });
}

// Ritmo de navegación. Las tiendas de desarrollo responden 429 (Cloudflare) ante ráfagas de un mismo
// origen; no se elude: se espacia cada navegación y, si llega un 429, se espera y se reintenta.
const MIN_GAP_MS = Number(process.env.AUDIT_MIN_GAP_MS || 2500);
let lastNavigation = 0;
function pace(context) {
  if (context.__paced) return;
  context.__paced = true;
  context.on('page', (page) => {
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      for (let attempt = 0; ; attempt++) {
        const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastNavigation));
        if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
        lastNavigation = Date.now();
        const response = await goto(url, options);
        if (!response || response.status() !== 429 || attempt >= 8 || !/myshopify\.com/.test(url)) return response;
        console.error(`  [429] ${url.slice(0, 90)} → espera 60 s (intento ${attempt + 1})`);
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    };
  });
}

export async function unlock(context, storeUrl) {
  pace(context);
  const file = stateFile(storeUrl);
  if (fs.existsSync(file)) {
    try { await context.addCookies(JSON.parse(fs.readFileSync(file, 'utf8'))); } catch (e) {}
  }
  const page = await context.newPage();
  let unlocked = false;
  for (let attempt = 0; attempt < 4 && !unlocked; attempt++) {
    const resp = await page.goto(`${storeUrl}/cart`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    if (resp && resp.status() === 429) { await page.waitForTimeout(30000); continue; }
    if (!page.url().includes('/password')) { unlocked = true; break; }
    const input = page.locator('input[type="password"]');
    if ((await input.count()) > 0) {
      await input.first().fill(STORE_PASSWORD);
      await Promise.all([page.waitForLoadState('domcontentloaded'), input.first().press('Enter')]);
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    }
    unlocked = !page.url().includes('/password');
    if (!unlocked) await page.waitForTimeout(30000 * (attempt + 1));
  }
  if (unlocked) fs.writeFileSync(file, JSON.stringify(await context.cookies(storeUrl)));
  await page.close();
  if (!unlocked) throw new Error('No se pudo desbloquear ' + storeUrl + ' (¿limitador de intentos de contraseña?)');
  return unlocked;
}

export function attachConsole(page, sink) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') sink.push({ type: m.type(), text: m.text().slice(0, 300), url: page.url() });
  });
  page.on('pageerror', (e) => sink.push({ type: 'pageerror', text: String(e.message).slice(0, 300), url: page.url() }));
}
