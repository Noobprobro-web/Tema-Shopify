import { chromium } from 'playwright';
import fs from 'fs';

const cookiesStr = fs.readFileSync('harness-AUDIT-360-001/storefront-cookies.txt', 'utf8');
const cookiePairs = cookiesStr.split('; ').map(pair => {
  const [name, ...rest] = pair.split('=');
  return { name, value: rest.join('='), domain: 'tema-qkqpke0j.myshopify.com', path: '/' };
});

const results = {
  theme_id: 165809488115,
  features: {}
};

async function testCommerce() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addCookies(cookiePairs);
  const page = await context.newPage();

  // 1. Homepage & General
  console.log('1. Checking Homepage...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.homepage = {
    title: await page.title(),
    has_header: await page.locator('.site-header, header').count() > 0,
    has_footer: await page.locator('.site-footer, footer').count() > 0,
    has_cart_drawer: await page.locator('cart-drawer, #CartDrawer').count() > 0
  };

  // 2. Product Detail Page (qa5a-f04-colour-size)
  console.log('2. Checking PDP (Variants, Gallery, Forms)...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/products/qa5a-f04-colour-size?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  const pdpData = await page.evaluate(() => {
    const form = document.querySelector('product-form form, form[action*="/cart/add"]');
    const variantSelects = document.querySelectorAll('variant-selects, variant-radios, select[name="id"], input[name="id"]');
    const price = document.querySelector('.price, [data-price]');
    const unitPrice = document.querySelector('.price__unit');
    const installments = document.querySelector('[data-shopify-payment-terms], .shopify-payment-terms, form[action*="/cart/add"] [data-shopify-payment-terms]');
    const pickupAvailability = document.querySelector('pickup-availability, [data-pickup-availability]');
    const recipientForm = document.querySelector('recipient-form, [data-recipient-form]');
    const addToCartBtn = document.querySelector('button[name="add"], [type="submit"][name="add"]');

    return {
      has_add_to_cart_form: !!form,
      variant_selectors_count: variantSelects.length,
      price_text: price?.innerText?.trim(),
      has_unit_price: !!unitPrice,
      has_installments: !!installments,
      has_pickup_availability: !!pickupAvailability,
      has_recipient_form: !!recipientForm,
      btn_text: addToCartBtn?.innerText?.trim(),
      btn_disabled: addToCartBtn?.disabled
    };
  });
  results.features.pdp_f04 = pdpData;

  // 2b. Check Sold Out PDP (qa5a-f02-sold-out)
  console.log('2b. Checking Sold Out PDP...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/products/qa5a-f02-sold-out?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.pdp_sold_out = await page.evaluate(() => {
    const btn = document.querySelector('button[name="add"], [type="submit"][name="add"]');
    const badges = Array.from(document.querySelectorAll('.badge, [data-badge]')).map(b => b.innerText.trim());
    return {
      btn_text: btn?.innerText?.trim(),
      btn_disabled: btn?.disabled,
      badges: badges
    };
  });

  // 2c. Check Subscription PDP (qa5a-f06-subscription)
  console.log('2c. Checking Subscription PDP...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/products/qa5a-f06-subscription?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.pdp_subscription = await page.evaluate(() => {
    const sellingPlanGroup = document.querySelector('selling-plan-groups, [data-selling-plan-groups], .selling-plan-groups');
    const sellingPlanInputs = document.querySelectorAll('input[name="selling_plan"]');
    return {
      has_selling_plan_container: !!sellingPlanGroup,
      selling_plan_inputs_count: sellingPlanInputs.length
    };
  });

  // 3. Test Gift Card recipient form if gift card product exists
  console.log('3. Checking Gift Card / Recipient Form...');
  const gcRes = await page.goto('https://tema-qkqpke0j.myshopify.com/products/gift-card?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  if (gcRes.status() === 200) {
    results.features.gift_card = await page.evaluate(() => {
      const recipient = document.querySelector('recipient-form, .recipient-form');
      return {
        exists: true,
        has_recipient_form: !!recipient
      };
    });
  } else {
    results.features.gift_card = { exists: false, status: gcRes.status() };
  }

  // 4. Cart Drawer & Cart Page
  console.log('4. Checking Cart Drawer & Cart Page...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/cart?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.cart_page = await page.evaluate(() => {
    const emptyState = document.querySelector('.cart__empty, .cart-empty, [data-cart-empty]');
    const cartItems = document.querySelector('.cart-items, main-cart-items, [data-cart-items]');
    const checkoutBtn = document.querySelector('button[name="checkout"], [type="submit"][name="checkout"]');
    return {
      has_cart_container: !!(emptyState || cartItems),
      empty_state_visible: !!emptyState,
      has_checkout_btn: !!checkoutBtn
    };
  });

  // 5. Predictive Search & Search Page
  console.log('5. Checking Search...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/search?q=coat&preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.search_page = await page.evaluate(() => {
    const resultsContainer = document.querySelector('.search-results, [data-search-results], #product-grid');
    const filterContainer = document.querySelector('facet-filters-form, .facets, .search-filters');
    const sortSelect = document.querySelector('select[name="sort_by"], [data-sort-by]');
    return {
      has_results_container: !!resultsContainer,
      has_filters: !!filterContainer,
      has_sort_by: !!sortSelect
    };
  });

  // 6. Blog & Article
  console.log('6. Checking Blog / Articles...');
  const blogRes = await page.goto('https://tema-qkqpke0j.myshopify.com/blogs/news?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.blog = { status: blogRes.status() };
  if (blogRes.status() === 200) {
    const firstArticle = await page.$('article a, .article-card a');
    if (firstArticle) {
      const artUrl = await firstArticle.getAttribute('href');
      await page.goto(`https://tema-qkqpke0j.myshopify.com${artUrl}?preview_theme_id=165809488115&pb=0`, { waitUntil: 'domcontentloaded' });
      results.features.article = await page.evaluate(() => {
        const commentForm = document.querySelector('form[action*="/comments"]');
        const commentsList = document.querySelector('#comments, .comments-list');
        return {
          has_comment_form: !!commentForm,
          has_comments_list: !!commentsList
        };
      });
    }
  }

  // 7. Customer Accounts & 404
  console.log('7. Checking 404 & Account...');
  const res404 = await page.goto('https://tema-qkqpke0j.myshopify.com/404-nonexistent-page?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.page_404 = {
    status: res404.status(),
    has_home_link: await page.locator('a[href="/"], a[href*="routes.root_url"]').count() > 0
  };

  const loginRes = await page.goto('https://tema-qkqpke0j.myshopify.com/account/login?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.customer_login = {
    status: loginRes.status(),
    has_customer_login_form: await page.locator('form[action*="/account/login"]').count() > 0,
    has_recover_password_form: await page.locator('form[action*="/recover"]').count() > 0
  };

  // 8. Localization selectors (Country/Currency/Language)
  console.log('8. Checking Localization selectors...');
  await page.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  results.features.localization = await page.evaluate(() => {
    const countryForms = document.querySelectorAll('form[action*="/localization"]');
    const selects = document.querySelectorAll('select[name="country_code"], select[name="language_code"]');
    return {
      localization_forms_count: countryForms.length,
      selects_count: selects.length
    };
  });

  fs.writeFileSync('harness-AUDIT-360-001/report-07-commerce.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Commerce audit finished!');
  await browser.close();
}

testCommerce().catch(err => {
  console.error('Commerce audit error:', err);
  process.exit(1);
});
