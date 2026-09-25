import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('--- 1. Logging into Storefront ---');
  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[name="password"]', '1234');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);
  console.log('Logged in. Current URL:', page.url());

  // Navigate to Couture
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });

  console.log('\n--- 2. Checking Payment Icons in Footer (Fila 82) ---');
  const paymentData = await page.evaluate(() => {
    const footer = document.querySelector('.site-footer');
    const payments = document.querySelector('.site-footer__payments');
    const list = document.querySelector('.site-footer__payment-list');
    const items = list ? Array.from(list.querySelectorAll('.site-footer__payment-item')) : [];
    const svgs = list ? Array.from(list.querySelectorAll('svg')) : [];
    return {
      hasPaymentsContainer: !!payments,
      itemCount: items.length,
      svgCount: svgs.length,
      svgTitles: svgs.map(s => s.querySelector('title')?.textContent || s.getAttribute('aria-label') || 'unnamed'),
      hScroll: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  console.log('Payment Icons Data:', JSON.stringify(paymentData, null, 2));

  console.log('\n--- 3. Checking Country / Currency Selector (Fila 79) ---');
  const localizationData = await page.evaluate(() => {
    const form = document.querySelector('#LocalizationForm-header');
    const select = document.querySelector('select[name="country_code"]');
    const options = select ? Array.from(select.options).map(o => ({ value: o.value, text: o.text, selected: o.selected })) : [];
    return {
      hasForm: !!form,
      hasCountrySelect: !!select,
      optionsCount: options.length,
      options: options,
      action: form?.getAttribute('action'),
      method: form?.getAttribute('method'),
      hasDataLocalizationSelect: select?.hasAttribute('data-localization-select')
    };
  });
  console.log('Localization Selectors Data:', JSON.stringify(localizationData, null, 2));

  // If country select exists, let's test switching country/currency!
  if (localizationData.optionsCount > 1) {
    console.log('\n--- Testing Country / Currency Switch ---');
    const targetOption = localizationData.options.find(o => !o.selected);
    if (targetOption) {
      console.log(`Switching country to ${targetOption.value} (${targetOption.text})...`);
      // Select the option and trigger change
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.selectOption('select[name="country_code"]', targetOption.value)
      ]);
      console.log('Navigation complete. New URL:', page.url());

      const pricesAfterSwitch = await page.evaluate(() => {
        const prices = Array.from(document.querySelectorAll('.price, .price__regular, .hero-editorial, product-card .price'))
          .map(p => p.textContent.replace(/\s+/g, ' ').trim())
          .filter(t => t.length > 0 && /\d/.test(t))
          .slice(0, 5);
        const activeCountry = document.querySelector('select[name="country_code"] option:checked')?.text;
        return {
          activeCountry,
          samplePrices: prices
        };
      });
      console.log('Prices after currency switch:', JSON.stringify(pricesAfterSwitch, null, 2));
    }
  }

  console.log('\n--- 4. Checking Accelerated Checkout & Additional Checkout Buttons (Fila 63) ---');
  // First check on PDP
  await page.goto('https://tema-qkqpke0j.myshopify.com/products/serra-coat?preview_theme_id=165809488115', { waitUntil: 'networkidle' });
  const pdpCheckout = await page.evaluate(() => {
    const dynamicButtonContainer = document.querySelector('.product-form__dynamic-checkout');
    const paymentButton = document.querySelector('.shopify-payment-button');
    const button = document.querySelector('.shopify-payment-button__button');
    return {
      hasContainer: !!dynamicButtonContainer,
      hasPaymentButton: !!paymentButton,
      buttonText: button?.textContent?.trim(),
      buttonVisible: button ? window.getComputedStyle(button).display !== 'none' : false
    };
  });
  console.log('PDP Accelerated Checkout:', JSON.stringify(pdpCheckout, null, 2));

  // Now add product to cart and check Cart Drawer and /cart
  console.log('Adding product to cart...');
  await page.click('button[type="submit"][name="add"]');
  await page.waitForTimeout(1500);

  const drawerCheckout = await page.evaluate(() => {
    const drawer = document.querySelector('cart-drawer');
    const dynamicCheckout = document.querySelector('.cart__dynamic-checkout');
    const addButtons = document.querySelector('.cart__dynamic-checkout .shopify-payment-button, [data-shopify="dynamic-checkout-cart"]');
    const rawButtons = document.querySelectorAll('.shopify-cleanslate, iframe[id*="shopify"]');
    return {
      drawerOpen: drawer?.hasAttribute('open') || drawer?.classList.contains('is-open'),
      hasDynamicCheckoutContainer: !!dynamicCheckout,
      dynamicCheckoutContent: dynamicCheckout ? dynamicCheckout.innerHTML.slice(0, 300) : null,
      rawButtonsCount: rawButtons.length
    };
  });
  console.log('Cart Drawer Accelerated Checkout:', JSON.stringify(drawerCheckout, null, 2));

  // Check /cart page
  console.log('Checking /cart page...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/cart?preview_theme_id=165809488115', { waitUntil: 'networkidle' });
  const cartPageCheckout = await page.evaluate(() => {
    const dynamicCheckout = document.querySelector('.cart__dynamic-checkout');
    return {
      hasDynamicCheckoutContainer: !!dynamicCheckout,
      dynamicCheckoutContent: dynamicCheckout ? dynamicCheckout.innerHTML.slice(0, 300) : null
    };
  });
  console.log('Cart Page Accelerated Checkout:', JSON.stringify(cartPageCheckout, null, 2));

  // Clean up cart
  console.log('Cleaning up cart...');
  await page.evaluate(async () => {
    await fetch('/cart/clear.js', { method: 'POST' });
  });

  console.log('\n--- 5. Checking Mobile Responsiveness (375x812) ---');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });
  const mobileData = await page.evaluate(() => {
    const hScroll = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const payments = document.querySelector('.site-footer__payments');
    return {
      horizontalScrollPx: hScroll,
      paymentsVisible: !!payments
    };
  });
  console.log('Mobile Responsiveness:', JSON.stringify(mobileData, null, 2));

  await browser.close();
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
