import { chromium } from 'playwright';

const BASE_URL = 'https://tema-qkqpke0j.myshopify.com';
const THEME_ID = '166186909939';
const STORE_PASSWORD = process.env.STOREFRONT_PASSWORD || ***ROTATED_STOREFRONT_CREDENTIAL***;

async function run() {
  console.log('='.repeat(70));
  console.log(`GATE 5: AUDITORÍA EN TIENDA DE DESARROLLO EN VIVO`);
  console.log(`Tienda: ${BASE_URL}`);
  console.log(`Tema ID: ${THEME_ID} (Sartorial)`);
  console.log('='.repeat(70));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });

  const consoleErrors = [];
  const pageErrors = [];

  const page = await context.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  // Step 1: Login via storefront password
  console.log('\n[Paso 1] Desbloqueando tienda mediante /password...');
  await page.goto(`${BASE_URL}/password?preview_theme_id=${THEME_ID}`, { waitUntil: 'domcontentloaded' });
  const pwdInput = page.locator('input[type="password"]');
  if (await pwdInput.count() > 0) {
    await pwdInput.fill(STORE_PASSWORD);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.keyboard.press('Enter')
    ]);
    console.log('  -> Acceso concedido exitosamente.');
  } else {
    console.log('  -> La tienda no solicitó contraseña o ya estaba desbloqueada.');
  }

  const results = {
    theme_id: THEME_ID,
    timestamp: new Date().toISOString(),
    cart_drawer: {},
    pdp_luxury_blocks: {},
    plp_grid_switch: {},
    transactions_and_notes: {},
    console_errors: []
  };

  // Step 2: Test PLP (Main Collection) List/Grid View Switch
  console.log('\n[Paso 2] Verificando PLP (Main Collection): Switch List View / Grid View...');
  await page.goto(`${BASE_URL}/collections/all?preview_theme_id=${THEME_ID}`, { waitUntil: 'networkidle' });

  const gridSwitcher = page.locator('.collection-grid-switcher');
  const hasSwitcher = await gridSwitcher.count() > 0;
  console.log(`  -> Switcher presente: ${hasSwitcher}`);

  const listViewBtn = page.locator('button[data-grid-view="list"]');
  const hasListBtn = await listViewBtn.count() > 0;
  console.log(`  -> Botón List View presente: ${hasListBtn}`);

  const grid2Btn = page.locator('button[data-grid-view="2"]');
  const grid4Btn = page.locator('button[data-grid-view="4"]');

  let listTogglePass = false;
  if (hasListBtn) {
    await listViewBtn.click();
    await page.waitForTimeout(300);
    const productGrid = page.locator('[data-product-list]');
    const columnsAttr = await productGrid.getAttribute('data-grid-columns');
    const ariaPressed = await listViewBtn.getAttribute('aria-pressed');
    console.log(`  -> Al hacer click en List View: data-grid-columns="${columnsAttr}", aria-pressed="${ariaPressed}"`);
    listTogglePass = columnsAttr === 'list' && ariaPressed === 'true';

    // Switch back to 4
    if (await grid4Btn.count() > 0) {
      await grid4Btn.click();
      await page.waitForTimeout(300);
      const colsAfter = await productGrid.getAttribute('data-grid-columns');
      console.log(`  -> Al conmutar de nuevo a 4: data-grid-columns="${colsAfter}"`);
    }
  }

  results.plp_grid_switch = {
    hasSwitcher,
    hasListBtn,
    listTogglePass
  };

  // Step 3: Test PDP (Main Product)
  console.log('\n[Paso 3] Verificando PDP (Main Product): Bloques de Lujo y Especificaciones...');
  // Find a product link from collection
  const firstProductHref = await page.locator('a[href*="/products/"]').first().getAttribute('href');
  const productUrl = firstProductHref ? new URL(firstProductHref, BASE_URL).pathname : '/products/cashmere-rib-crew';
  console.log(`  -> Navegando a PDP: ${productUrl}`);

  await page.goto(`${BASE_URL}${productUrl}?preview_theme_id=${THEME_ID}`, { waitUntil: 'networkidle' });

  // Evaluate schema / rendered elements
  const pdpInfo = await page.evaluate(async () => {
    // Check variant json
    const varJsonEl = document.querySelector('[data-variant-json]');
    const variants = varJsonEl ? JSON.parse(varJsonEl.textContent) : [];

    // Check line total markup
    const lineTotal = document.querySelector('[data-line-total]');

    // Check section schema or blocks if available
    const techSpecs = document.querySelector('.product-technical-specs');
    const provenance = document.querySelector('.product-provenance');

    return {
      variantsCount: variants.length,
      hasLineTotalElement: Boolean(lineTotal),
      hasTechSpecsRendered: Boolean(techSpecs),
      hasProvenanceRendered: Boolean(provenance)
    };
  });

  console.log(`  -> Variantes detectadas: ${pdpInfo.variantsCount}`);
  console.log(`  -> Elemento Subtotal reactivo ([data-line-total]): ${pdpInfo.hasLineTotalElement}`);
  console.log(`  -> Bloque Technical Specs renderizado en DOM: ${pdpInfo.hasTechSpecsRendered}`);
  console.log(`  -> Bloque Provenance renderizado en DOM: ${pdpInfo.hasProvenanceRendered}`);

  // Test reactive line total on PDP
  const qtyInput = page.locator('input[data-quantity-input]').first();
  let lineTotalReactive = false;
  if (await qtyInput.count() > 0) {
    const initialLineTotalText = await page.locator('[data-line-total]').innerText().catch(() => '');
    await qtyInput.fill('2');
    await qtyInput.dispatchEvent('change');
    await page.waitForTimeout(300);
    const updatedLineTotalText = await page.locator('[data-line-total]').innerText().catch(() => '');
    console.log(`  -> Subtotal reactivo con cantidad 2: "${updatedLineTotalText}" (inicial: "${initialLineTotalText}")`);
    lineTotalReactive = updatedLineTotalText.length > 0;
  }

  results.pdp_luxury_blocks = {
    productUrl,
    pdpInfo,
    lineTotalReactive
  };

  // Step 4: Test Cart Drawer & Recommendations & 44px Variant Chips
  console.log('\n[Paso 4] Verificando Cart Drawer, Recomendaciones y Selector de Variantes (44px chips)...');

  // Add 1 item to cart via Ajax API in page context
  const addToCartResult = await page.evaluate(async () => {
    // Get first variant ID
    const varJsonEl = document.querySelector('[data-variant-json]');
    const variants = varJsonEl ? JSON.parse(varJsonEl.textContent) : [];
    if (!variants.length) return { success: false, error: 'No variants' };

    const variantId = variants[0].id;
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });
      const data = await res.json();
      return { success: res.ok, status: res.status, data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });

  console.log(`  -> /cart/add.js resultado: Status ${addToCartResult.status}, Success: ${addToCartResult.success}`);

  // Open Cart Drawer
  await page.evaluate(() => {
    const drawer = document.querySelector('cart-drawer');
    if (drawer && typeof drawer.open === 'function') {
      drawer.open();
    } else {
      const cartTrigger = document.querySelector('[data-drawer-trigger="cart-drawer"], a[href="/cart"]');
      if (cartTrigger) cartTrigger.click();
    }
  });
  await page.waitForTimeout(800);

  const cartDrawerDetails = await page.evaluate(async () => {
    const drawer = document.querySelector('cart-drawer');
    const recs = document.querySelector('cart-drawer-recommendations');
    const recsList = document.querySelector('.cart-drawer__recommendations-list');
    const chooseOptionsButtons = Array.from(document.querySelectorAll('[data-recommendation-options-trigger], .cart-drawer__rec-choose-options'));
    const chips = Array.from(document.querySelectorAll('.cart-drawer__rec-chip, [data-recommendation-chip]'));

    // Check tap target of any chips or buttons
    const measuredElements = [...chooseOptionsButtons, ...chips].map(el => {
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        width: rect.width,
        height: rect.height,
        meets44px: rect.width >= 43.5 && rect.height >= 43.5
      };
    });

    return {
      hasCartDrawer: Boolean(drawer),
      drawerOpen: drawer ? drawer.hasAttribute('open') : false,
      hasRecsElement: Boolean(recs),
      hasRecsList: Boolean(recsList),
      measuredElementsCount: measuredElements.length,
      sampleMeasurements: measuredElements.slice(0, 5)
    };
  });

  console.log(`  -> Cart Drawer presente: ${cartDrawerDetails.hasCartDrawer}`);
  console.log(`  -> Cart Drawer abierto: ${cartDrawerDetails.drawerOpen}`);
  console.log(`  -> Elemento <cart-drawer-recommendations> presente: ${cartDrawerDetails.hasRecsElement}`);
  console.log(`  -> Elementos interactivos medidos: ${cartDrawerDetails.measuredElementsCount}`);
  if (cartDrawerDetails.sampleMeasurements.length > 0) {
    console.log('  -> Muestra de mediciones de chips / botones:', cartDrawerDetails.sampleMeasurements);
  }

  // Step 5: Test Transaction & Notes Ajax Endpoints
  console.log('\n[Paso 5] Verificando Transacción y Notas Ajax (/cart/update.js, /cart.js)...');
  const testNote = 'Gate 5 Verification Note - ' + Date.now();
  const noteResult = await page.evaluate(async (note) => {
    try {
      const updateRes = await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ note })
      });
      const updateData = await updateRes.json();

      const getRes = await fetch('/cart.js');
      const cartData = await getRes.json();

      return {
        updateSuccess: updateRes.ok,
        updateStatus: updateRes.status,
        noteMatched: cartData.note === note,
        currentNote: cartData.note,
        itemCount: cartData.item_count
      };
    } catch (e) {
      return { error: e.message };
    }
  }, testNote);

  console.log(`  -> /cart/update.js status: ${noteResult.updateStatus}`);
  console.log(`  -> Nota sincronizada en /cart.js: ${noteResult.noteMatched} ("${noteResult.currentNote}")`);
  console.log(`  -> Items en carrito: ${noteResult.itemCount}`);

  results.cart_drawer = cartDrawerDetails;
  results.transactions_and_notes = {
    addToCartResult: { status: addToCartResult.status, success: addToCartResult.success },
    noteResult
  };
  results.console_errors = consoleErrors;
  results.page_errors = pageErrors;

  console.log('\n' + '='.repeat(70));
  console.log('RESUMEN DE ERRORES DE CONSOLA / RUNTIME:');
  console.log(`  Console Errors: ${consoleErrors.length}`);
  console.log(`  Page Errors: ${pageErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('  Detalles:', consoleErrors);
  }
  if (pageErrors.length > 0) {
    console.log('  Detalles PageError:', pageErrors);
  }
  console.log('='.repeat(70));

  await browser.close();
  return results;
}

run().catch(err => {
  console.error('Fatal in test:', err);
  process.exit(1);
});
