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

  // Navigate to Couture
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });

  console.log('\n--- 2. Testing Country/Currency Switch to Spain (EUR €) ---');
  const initialCountry = await page.$eval('#LocalizationForm-header select[name="country_code"] option:checked', el => el.text);
  console.log('Initial Selected Country in Header:', initialCountry);

  // Switch to ES
  console.log('Selecting ES in #LocalizationForm-header...');
  await page.selectOption('#LocalizationForm-header select[name="country_code"]', 'ES');
  
  // Submit the form
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.evaluate(() => {
      document.querySelector('#LocalizationForm-header').requestSubmit();
    })
  ]);
  console.log('Navigated after country change. New URL:', page.url());

  const countryAfter = await page.evaluate(() => {
    const activeOpt = document.querySelector('#LocalizationForm-header select[name="country_code"] option:checked');
    const prices = Array.from(document.querySelectorAll('.price, .hero-editorial, product-card .price'))
      .map(p => p.textContent.replace(/\s+/g, ' ').trim())
      .filter(t => t.length > 0 && /\d/.test(t))
      .slice(0, 6);
    return {
      selectedCountry: activeOpt?.text,
      samplePrices: prices
    };
  });
  console.log('State after country switch:', JSON.stringify(countryAfter, null, 2));

  console.log('\n--- 3. Testing Accelerated Checkout with Active Payment Provider (Fila 63) ---');
  // Check PDP
  await page.goto('https://tema-qkqpke0j.myshopify.com/products/serra-coat?preview_theme_id=165809488115', { waitUntil: 'networkidle' });
  const pdpCheckout = await page.evaluate(() => {
    const dynContainer = document.querySelector('.product-form__dynamic-checkout');
    const shopifyPayButton = document.querySelector('.shopify-payment-button');
    const button = document.querySelector('.shopify-payment-button__button');
    return {
      hasContainer: !!dynContainer,
      hasPaymentButton: !!shopifyPayButton,
      buttonText: button?.textContent?.trim(),
      buttonVisible: button ? window.getComputedStyle(button).display !== 'none' : false,
      buttonClasses: button?.className
    };
  });
  console.log('PDP Accelerated Checkout:', JSON.stringify(pdpCheckout, null, 2));

  // Add to cart and check Cart Drawer
  console.log('Adding Serra Coat to cart...');
  await page.click('button[type="submit"][name="add"]');
  await page.waitForTimeout(2000);

  const cartDrawerData = await page.evaluate(() => {
    const drawer = document.querySelector('cart-drawer');
    const dynCheckout = document.querySelector('cart-drawer .cart__dynamic-checkout');
    const additionalBtns = document.querySelector('cart-drawer [data-shopify="dynamic-checkout-cart"]');
    const iframes = Array.from(document.querySelectorAll('cart-drawer iframe')).map(i => i.id || i.name);
    return {
      drawerOpen: drawer?.hasAttribute('open') || drawer?.classList.contains('is-open') || drawer?.dataset.open === 'true',
      hasDynContainer: !!dynCheckout,
      dynCheckoutHTML: dynCheckout?.innerHTML?.slice(0, 400),
      additionalBtnsPresent: !!additionalBtns,
      iframes: iframes
    };
  });
  console.log('Cart Drawer Data:', JSON.stringify(cartDrawerData, null, 2));

  // Navigate to /cart page
  console.log('Navigating to /cart...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/cart?preview_theme_id=165809488115', { waitUntil: 'networkidle' });
  const cartPageData = await page.evaluate(() => {
    const dynCheckout = document.querySelector('.cart__dynamic-checkout');
    const iframes = Array.from(document.querySelectorAll('.main-cart iframe')).map(i => i.id || i.name);
    return {
      hasDynContainer: !!dynCheckout,
      dynCheckoutHTML: dynCheckout?.innerHTML?.slice(0, 400),
      iframes: iframes
    };
  });
  console.log('Cart Page Data:', JSON.stringify(cartPageData, null, 2));

  // Clear cart
  await page.evaluate(async () => {
    await fetch('/cart/clear.js', { method: 'POST' });
  });

  console.log('\n--- 4. Checking Footer Payment Icons on Mobile (375x812) (Fila 82) ---');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });
  const mobileFooter = await page.evaluate(() => {
    const payments = document.querySelector('.site-footer__payments');
    const list = document.querySelector('.site-footer__payment-list');
    const svgs = list ? Array.from(list.querySelectorAll('svg')) : [];
    const hScroll = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return {
      hasPayments: !!payments,
      svgCount: svgs.length,
      svgTitles: svgs.map(s => s.querySelector('title')?.textContent || s.getAttribute('aria-label') || 'unnamed'),
      hScrollPx: hScroll
    };
  });
  console.log('Mobile Footer Payments:', JSON.stringify(mobileFooter, null, 2));

  await browser.close();
}

run().catch(console.error);
