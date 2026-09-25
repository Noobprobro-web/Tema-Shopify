import { chromium } from 'playwright';

async function testPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[type="password"]', ***ROTATED_STOREFRONT_CREDENTIAL***);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  for (const slug of ['documentation', 'support']) {
    await page.goto(`https://tema-qkqpke0j.myshopify.com/pages/${slug}`);
    const text = await page.locator('main').innerText();
    console.log(`=== SLUG: ${slug} ===`);
    console.log(text.slice(0, 400));
  }
  await browser.close();
}

testPages().catch(console.error);
