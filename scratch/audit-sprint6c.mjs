import { chromium } from 'playwright';

async function audit() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. Login
  await page.goto('https://tema-qkqpke0j.myshopify.com/password', { waitUntil: 'domcontentloaded' });
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await passwordInput.fill(***ROTATED_STOREFRONT_CREDENTIAL***);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.keyboard.press('Enter')
    ]);
  }

  console.log('=== 1. Inspecting Hero in Sartorial (#166186909939) ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=166186909939', { waitUntil: 'domcontentloaded' });

  const heroData = await page.evaluate(() => {
    const hero = document.querySelector('.hero-editorial');
    const heroImage = document.querySelector('.hero-editorial__image');
    const heroMedia = document.querySelector('.hero-editorial__media');
    const eyebrow = document.querySelector('.hero-editorial .eyebrow');
    const heading = document.querySelector('.hero-editorial__heading');
    const subheading = document.querySelector('.hero-editorial__subheading');

    return {
      classes: hero?.className,
      heroStyle: hero?.getAttribute('style'),
      heroMediaStyle: heroMedia?.getAttribute('style'),
      imageStyle: heroImage?.getAttribute('style'),
      computedObjectPosition: heroImage ? getComputedStyle(heroImage).objectPosition : null,
      computedObjectFit: heroImage ? getComputedStyle(heroImage).objectFit : null,
      eyebrowText: eyebrow?.textContent?.trim(),
      eyebrowColor: eyebrow ? getComputedStyle(eyebrow).color : null,
      eyebrowFontSize: eyebrow ? getComputedStyle(eyebrow).fontSize : null,
      headingColor: heading ? getComputedStyle(heading).color : null,
      subheadingColor: subheading ? getComputedStyle(subheading).color : null,
      heroOverlayClass: document.querySelector('.hero-editorial__overlay')?.className
    };
  });
  console.log('Sartorial Hero Data:', JSON.stringify(heroData, null, 2));

  console.log('\n=== 2. Inspecting Hero in Couture (#165809488115) ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115', { waitUntil: 'domcontentloaded' });

  const coutureHeroData = await page.evaluate(() => {
    const hero = document.querySelector('.hero-editorial');
    const heroImage = document.querySelector('.hero-editorial__image');
    const heroMedia = document.querySelector('.hero-editorial__media');
    return {
      classes: hero?.className,
      heroMediaStyle: heroMedia?.getAttribute('style'),
      computedObjectPosition: heroImage ? getComputedStyle(heroImage).objectPosition : null,
      computedObjectFit: heroImage ? getComputedStyle(heroImage).objectFit : null,
    };
  });
  console.log('Couture Hero Data:', JSON.stringify(coutureHeroData, null, 2));

  console.log('\n=== 3. Inspecting PDP Rich Media & shopify-xr (F04 Knit) ===');
  await page.goto('https://tema-qkqpke0j.myshopify.com/products/f04-colour-and-size-knit?preview_theme_id=165809488115', { waitUntil: 'domcontentloaded' });

  const pdpMediaData = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src);
    const hasShopifyXr = scripts.some(s => s.includes('shopify-xr'));
    const modelViewerUi = document.querySelector('#ModelViewerStyle');
    const viewInSpace = document.querySelector('.product-gallery__view-in-space, [data-shopify-xr]');
    const gallery = document.querySelector('product-gallery');

    return {
      hasShopifyXrScript: hasShopifyXr,
      hasModelViewerUiStyle: !!modelViewerUi,
      hasViewInSpaceButton: !!viewInSpace,
      hasProductGalleryElement: !!gallery
    };
  });
  console.log('PDP Media Data (Image-only product):', JSON.stringify(pdpMediaData, null, 2));

  await browser.close();
  console.log('\nAudit script complete.');
}

audit().catch(err => {
  console.error(err);
  process.exit(1);
});
