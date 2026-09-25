import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://tema-qkqpke0j.myshopify.com/password');
  await page.fill('input[name="password"]', ***ROTATED_STOREFRONT_CREDENTIAL***);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);

  await page.goto('https://tema-qkqpke0j.myshopify.com?preview_theme_id=165809488115', { waitUntil: 'networkidle' });

  const shopInfo = await page.evaluate(async () => {
    let suggestions = null;
    try {
      const res = await fetch('/browsing_context_suggestions.json');
      suggestions = await res.json();
    } catch(e) {
      suggestions = e.message;
    }

    return {
      shopify: window.Shopify,
      suggestions: suggestions,
      forms: Array.from(document.querySelectorAll('form')).map(f => ({
        id: f.id,
        action: f.getAttribute('action'),
        inputs: Array.from(f.querySelectorAll('input, select')).map(i => `${i.name}=${i.value}`)
      })),
      allSelects: Array.from(document.querySelectorAll('select')).map(s => ({
        name: s.name,
        options: Array.from(s.options).map(o => o.text)
      })),
      footerHTML: document.querySelector('.site-footer')?.innerHTML.slice(0, 1000)
    };
  });

  console.log('Shop Info:', JSON.stringify(shopInfo, null, 2));

  await browser.close();
}

run().catch(console.error);
