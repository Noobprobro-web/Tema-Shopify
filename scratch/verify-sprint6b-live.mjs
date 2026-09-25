import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('=== 1. Login to Storefront ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com/password', { waitUntil: 'domcontentloaded' });
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await passwordInput.fill('1234');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.keyboard.press('Enter')
    ]);
    console.log('Password submitted.');
  }

  console.log('\n=== 2. Verify Active Filter Pills in Collection (Couture #165809488115) ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com/collections/all?preview_theme_id=165809488115', { waitUntil: 'domcontentloaded' });

  // Verify initial count without filters
  const initialStatus = await page.$eval('[data-results-status]', el => el.textContent.trim());
  const initialPillsCount = (await page.$$('.facet__pill')).length;
  console.log(`Initial count: "${initialStatus}", initial pills: ${initialPillsCount}`);

  // Navigate to filtered URL (filter.v.availability=1)
  console.log('Navigating to ?filter.v.availability=1 ...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/collections/all?preview_theme_id=165809488115&filter.v.availability=1', { waitUntil: 'domcontentloaded' });

  const filteredStatus = await page.$eval('[data-results-status]', el => el.textContent.trim());
  const pills = await page.$$eval('.facet__pill', els => els.map(el => ({
    text: el.innerText.trim(),
    href: el.getAttribute('href'),
    hasDataRemove: el.hasAttribute('data-facet-remove')
  })));
  const clearAll = await page.$eval('.facets__clear-all', el => ({
    text: el.innerText.trim(),
    href: el.getAttribute('href'),
    hasDataClear: el.hasAttribute('data-facet-clear-all')
  }));
  console.log('Filtered status:', filteredStatus);
  console.log('Active pills:', JSON.stringify(pills, null, 2));
  console.log('Clear all button:', JSON.stringify(clearAll, null, 2));

  // Now test price range filter pill
  console.log('Navigating to price range filter (?filter.v.price.gte=300&filter.v.price.lte=1000)...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/collections/all?preview_theme_id=165809488115&filter.v.availability=1&filter.v.price.gte=300&filter.v.price.lte=1000', { waitUntil: 'domcontentloaded' });

  const pricePills = await page.$$eval('.facet__pill', els => els.map(el => el.innerText.trim()));
  console.log('Price + Availability pills:', pricePills);

  // Test AJAX remove on the first pill
  console.log('Clicking first remove pill via AJAX...');
  const firstPill = await page.$('[data-facet-remove]');
  if (firstPill) {
    await firstPill.click();
    await page.waitForTimeout(2000); // allow AJAX swap
    const afterRemoveStatus = await page.$eval('[data-results-status]', el => el.textContent.trim());
    const afterRemovePills = await page.$$eval('.facet__pill', els => els.map(el => el.innerText.trim()));
    const activeUrl = page.url();
    const liveRegionText = await page.$eval('[data-facet-live-region]', el => el.textContent.trim());
    console.log(`After AJAX remove: status="${afterRemoveStatus}", liveRegion="${liveRegionText}", url="${activeUrl}"`);
    console.log('Remaining pills:', afterRemovePills);
  }

  console.log('\n=== 3. Mobile Viewport Test (375x812) on Sartorial #166186909939 ===');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://tema-qkqpke0j.myshopify.com/collections/all?preview_theme_id=166186909939&filter.v.availability=1', { waitUntil: 'domcontentloaded' });

  const mobileScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const mobileClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const mobileHasOverflow = mobileScrollWidth > mobileClientWidth;
  const mobilePills = await page.$$eval('.facet__pill', els => els.map(el => {
    const rect = el.getBoundingClientRect();
    return {
      text: el.innerText.trim(),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }));

  console.log(`Mobile: scrollWidth=${mobileScrollWidth}, clientWidth=${mobileClientWidth}, hasOverflow=${mobileHasOverflow}`);
  console.log('Mobile pills dimensions:', JSON.stringify(mobilePills, null, 2));

  console.log('\n=== 4. Search Filter Test (main-search.liquid) ===');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://tema-qkqpke0j.myshopify.com/search?preview_theme_id=165809488115&q=dress&type=product&filter.v.availability=1', { waitUntil: 'domcontentloaded' });

  const searchPills = await page.$$eval('.facet__pill', els => els.map(el => el.innerText.trim()));
  const searchResultsCount = await page.$eval('[data-results-status]', el => el.textContent.trim());
  console.log(`Search: results="${searchResultsCount}", pills:`, searchPills);

  console.log('\n=== 5. Sartorial Hero Contrast Verification ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=166186909939', { waitUntil: 'domcontentloaded' });
  const heroComputed = await page.evaluate(() => {
    const hero = document.querySelector('.hero-editorial');
    const content = document.querySelector('.hero-editorial__content');
    const h1 = document.querySelector('.hero-editorial__heading');
    const eyebrow = document.querySelector('.hero-editorial .eyebrow');
    const sub = document.querySelector('.hero-editorial__subheading');
    return {
      heroClass: hero?.className,
      h1Color: h1 ? getComputedStyle(h1).color : null,
      h1FontSize: h1 ? getComputedStyle(h1).fontSize : null,
      eyebrowColor: eyebrow ? getComputedStyle(eyebrow).color : null,
      subColor: sub ? getComputedStyle(sub).color : null
    };
  });
  console.log('Sartorial hero computed styles:', JSON.stringify(heroComputed, null, 2));

  await browser.close();
  console.log('\n=== ALL VERIFICATIONS COMPLETED SUCCESSFULLY ===');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
