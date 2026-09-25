import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to storefront password page...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[name="password"]', '1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);
  console.log('Logged in to storefront. Current URL:', page.url());

  // Navigate to homepage with Couture preview
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });

  // Inject axe-core
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });

  // Open predictive search
  console.log('Opening predictive search...');
  await page.click('[data-predictive-search-open]');
  await page.waitForTimeout(500);

  // Type search term
  console.log('Searching for "the"...');
  await page.fill('predictive-search input[type="search"]', 'the');
  await page.waitForTimeout(1000);

  // Run axe on predictive-search
  const axeResultsWithTerms = await page.evaluate(async () => {
    const ps = document.querySelector('predictive-search');
    const res = await axe.run(ps, { resultTypes: ['violations'] });
    return res.violations.map(v => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.description}`);
  });
  console.log('axe violations with results ("the"):', axeResultsWithTerms);

  // Type term with no results
  console.log('Searching for "xyznoresults999"...');
  await page.fill('predictive-search input[type="search"]', 'xyznoresults999');
  await page.waitForTimeout(1000);

  const axeResultsEmpty = await page.evaluate(async () => {
    const ps = document.querySelector('predictive-search');
    const res = await axe.run(ps, { resultTypes: ['violations'] });
    return res.violations.map(v => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.description}`);
  });
  console.log('axe violations with no results ("xyznoresults999"):', axeResultsEmpty);

  // Also check Sartorial
  console.log('\nChecking Sartorial theme...');
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186909939', { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });
  await page.click('[data-predictive-search-open]');
  await page.waitForTimeout(500);
  await page.fill('predictive-search input[type="search"]', 'coat');
  await page.waitForTimeout(1000);

  const axeSartorial = await page.evaluate(async () => {
    const ps = document.querySelector('predictive-search');
    const res = await axe.run(ps, { resultTypes: ['violations'] });
    return res.violations.map(v => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.description}`);
  });
  console.log('axe violations on Sartorial ("coat"):', axeSartorial);

  await browser.close();
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
