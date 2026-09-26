import { chromium } from 'playwright';
import fs from 'fs';
import { execSync } from 'child_process';

const content = fs.readFileSync('scratch/test-ps-axe-live.mjs', 'utf8');
const pwdMatch = content.match(/fill\([^,]+,\s*['"]([^'"]+)['"]\)/);
const pwd = pwdMatch ? pwdMatch[1] : '';

async function test() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--remote-debugging-port=9222']
  });

  const page = await browser.newPage();
  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[name="password"]', pwd);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);

  console.log('Logged in. Current URL:', page.url());

  // Test lighthouse CLI connecting to port 9222
  try {
    const res = execSync('npx lighthouse --port=9222 "https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115&pb=0" --output=json --output-path=harness-AUDIT-360-001/lh-test.json --chrome-flags="--headless" --only-categories=performance,accessibility --quiet', { stdio: 'inherit' });
    console.log('Lighthouse ran successfully!');
    if (fs.existsSync('harness-AUDIT-360-001/lh-test.json')) {
      const data = JSON.parse(fs.readFileSync('harness-AUDIT-360-001/lh-test.json', 'utf8'));
      console.log('Perf score:', data.categories.performance?.score * 100);
      console.log('A11y score:', data.categories.accessibility?.score * 100);
    }
  } catch (err) {
    console.error('Lighthouse exec error:', err.message);
  } finally {
    await browser.close();
  }
}

test();
