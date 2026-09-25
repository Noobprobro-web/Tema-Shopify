import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // --- 1. Desktop 1280x800 ---
  console.log('=== 1. Desktop Verification (1280x800) ===');
  const contextDesktop = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await contextDesktop.newPage();

  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[name="password"]', '1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);

  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });

  const desktopLoc = await page.evaluate(() => {
    const form = document.querySelector('#LocalizationForm-header');
    const toggle = form ? form.querySelector('.localization-form__toggle') : null;
    const countryWrapper = form ? form.querySelector('.localization-form__country-wrapper') : null;
    const select = form ? form.querySelector('select[name="country_code"]') : null;
    const label = form ? form.querySelector('label[for*="country"]') : null;
    
    // Read visible text representation
    const langItems = toggle ? Array.from(toggle.querySelectorAll('.localization-form__item')).map(e => e.textContent.replace(/\s+/g, '').trim()) : [];
    const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text, selected: o.selected })) : [];
    
    // Computed styles of select
    const selectStyles = select ? window.getComputedStyle(select) : null;
    const selectRect = select ? select.getBoundingClientRect() : null;

    return {
      hasForm: !!form,
      langItems: langItems.join(' / '),
      labelVisuallyHidden: label ? label.textContent.trim() : null,
      options: options,
      selectedCurrency: options.find(o => o.selected)?.text,
      selectFontSize: selectStyles?.fontSize,
      selectFontWeight: selectStyles?.fontWeight,
      selectTextTransform: selectStyles?.textTransform,
      selectRect: selectRect ? { width: Math.round(selectRect.width), height: Math.round(selectRect.height) } : null,
      fullHeaderLocalizationText: form?.textContent?.replace(/\s+/g, ' ')?.trim()
    };
  });
  console.log('Desktop Localization:', JSON.stringify(desktopLoc, null, 2));

  // --- 2. Mobile 375x812 Drawer ---
  console.log('\n=== 2. Mobile Verification (375x812) in Drawer ===');
  const contextMobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const pageMobile = await contextMobile.newPage();

  await pageMobile.goto('https://tema-qkqpke0j.myshopify.com/password');
  await pageMobile.fill('input[name="password"]', '1234');
  await Promise.all([
    pageMobile.waitForNavigation({ waitUntil: 'networkidle' }),
    pageMobile.click('button[type="submit"]')
  ]);

  await pageMobile.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });

  // Open mobile drawer
  console.log('Opening mobile drawer...');
  await pageMobile.click('[data-menu-drawer-open]');
  await pageMobile.waitForTimeout(600);

  const mobileDrawerLoc = await pageMobile.evaluate(() => {
    const form = document.querySelector('#LocalizationForm-header-mobile');
    const toggle = form ? form.querySelector('.localization-form__toggle') : null;
    const countryWrapper = form ? form.querySelector('.localization-form__country-wrapper') : null;
    const select = form ? form.querySelector('select[name="country_code"]') : null;
    const label = form ? form.querySelector('label[for*="country"]') : null;

    const langItems = toggle ? Array.from(toggle.querySelectorAll('.localization-form__item')).map(e => e.textContent.replace(/\s+/g, '').trim()) : [];
    const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text, selected: o.selected })) : [];
    const selectRect = select ? select.getBoundingClientRect() : null;

    return {
      hasFormInDrawer: !!form,
      langItems: langItems.join(' / '),
      labelVisuallyHidden: label ? label.textContent.trim() : null,
      options: options,
      selectedCurrency: options.find(o => o.selected)?.text,
      selectRect: selectRect ? { width: Math.round(selectRect.width), height: Math.round(selectRect.height) } : null,
      fullDrawerLocalizationText: form?.textContent?.replace(/\s+/g, ' ')?.trim(),
      hScrollPx: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  console.log('Mobile Drawer Localization:', JSON.stringify(mobileDrawerLoc, null, 2));

  // --- 3. Test Sartorial Preset Desktop & Mobile ---
  console.log('\n=== 3. Sartorial Theme Check (1280x800) ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=166186909939', { waitUntil: 'networkidle' });
  const sartorialLoc = await page.evaluate(() => {
    const form = document.querySelector('#LocalizationForm-header');
    const select = form ? form.querySelector('select[name="country_code"]') : null;
    const options = select ? Array.from(select.options).map(o => o.text) : [];
    return {
      hasForm: !!form,
      options: options,
      text: form?.textContent?.replace(/\s+/g, ' ')?.trim()
    };
  });
  console.log('Sartorial Localization:', JSON.stringify(sartorialLoc, null, 2));

  await browser.close();
}

run().catch(console.error);
