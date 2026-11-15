import { chromium } from 'playwright';
import fs from 'fs';
import os from 'os';
import path from 'path';

// La contraseña del storefront llega SIEMPRE por entorno: nunca se versiona en el repositorio.
const pwd = process.env.STOREFRONT_PASSWORD;
if (!pwd) throw new Error('STOREFRONT_PASSWORD no está definida: expórtala antes de ejecutar este arnés.');

// Las cookies de sesión del storefront se guardan FUERA del repositorio (nunca en git).
const STATE_DIR = process.env.AUDIT_STATE_DIR || path.join(os.tmpdir(), 'sartorial-audit-360-001');
fs.mkdirSync(STATE_DIR, { recursive: true });
const outFile = path.join(STATE_DIR, 'storefront-cookies.txt');

async function getCookies() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[name="password"]', pwd);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);

  const cookies = await context.cookies();
  console.log('Cookies count:', cookies.length);
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  fs.writeFileSync(outFile, cookieHeader, 'utf8');
  console.log('Saved cookies string (names):', cookies.map(c => c.name).join(', '));
  console.log('Saved outside the repository to:', outFile);
  await browser.close();
}

getCookies();
