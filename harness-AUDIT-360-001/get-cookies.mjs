import { chromium } from 'playwright';
import fs from 'fs';

const content = fs.readFileSync('scratch/test-ps-axe-live.mjs', 'utf8');
const pwdMatch = content.match(/fill\([^,]+,\s*['"]([^'"]+)['"]\)/);
const pwd = pwdMatch ? pwdMatch[1] : '';

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
  fs.writeFileSync('harness-AUDIT-360-001/storefront-cookies.txt', cookieHeader, 'utf8');
  console.log('Saved cookies string (names):', cookies.map(c => c.name).join(', '));
  await browser.close();
}

getCookies();
