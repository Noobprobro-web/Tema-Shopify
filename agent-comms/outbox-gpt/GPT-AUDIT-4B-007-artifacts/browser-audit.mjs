import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
const base = 'http://127.0.0.1:9292';
const output = '.tmp/gpt-audit-4b-007';
const inventory = JSON.parse(await readFile(`${output}/inventory.json`, 'utf8'));
const candidate = process.env.AUDIT_CANDIDATE ? await readFile(process.env.AUDIT_CANDIDATE,'utf8') : null;
const id = handle => inventory.products.find(p => p.handle === handle).variants[0].id;
const browser = await chromium.launch({ channel: 'chromium', headless: true });
const results = [];
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return {promise,resolve}; };
const delay = ms => new Promise(r => setTimeout(r, ms));
const bounded = promise => Promise.race([promise, delay(20000).then(() => { throw new Error('Probe synchronization timed out'); })]);
async function json(context, path, data) {
  const response = data === undefined ? await context.request.get(base + path) : await context.request.post(base + path, {data});
  if (!response.ok()) throw new Error(`Shopify ${path}: ${response.status()} ${(await response.text()).slice(0,180)}`);
  return response.json();
}
async function setup(page, path = '/products/qa-09-price-varies') {
  const response = await page.goto(base + path, {waitUntil:'domcontentloaded',timeout:60000});
  if (!response.ok()) throw new Error(`Page ${response.status()}: ${await page.title()}`);
  await page.waitForFunction(() => window.ThemeCore?.initialized);
}
async function seed(context) {
  await json(context, '/cart/add.js', {items:[{id:id('qa-16-single-char'),quantity:1}]});
}
async function openCart(page) {
  const response = page.waitForResponse(r => new URL(r.url()).searchParams.get('section_id') === 'cart-drawer');
  await page.locator('.site-header__cart').click();
  await response;
  await page.waitForTimeout(120);
}
async function state(page) {
  return page.evaluate(() => {
    const drawer = document.querySelector('cart-drawer');
    return {
      count:drawer.dataset.itemCount,
      quantity:drawer.querySelector('[data-cart-quantity]')?.value,
      note:drawer.querySelector('[name="note"]')?.value,
      dirty:drawer.querySelector('[name="note"]')?.dataset.dirty,
      focus:{tag:document.activeElement.tagName,id:document.activeElement.id,inCart:drawer.contains(document.activeElement)},
      open:[...document.querySelectorAll('theme-drawer[data-open],cart-drawer[data-open],size-guide-modal[data-open],predictive-search[data-open]')].map(e=>({tag:e.localName,inert:Boolean(e.panel?.closest('[inert]'))})),
      body:{drawer:document.body.hasAttribute('data-drawer-open'),modal:document.body.hasAttribute('data-modal-open')},
    };
  });
}
async function run(name, callback, width = 390) {
  if (process.argv[2] && !new RegExp(process.argv[2]).test(name)) return;
  const context = await browser.newContext({viewport:{width,height:900}});
  const page = await context.newPage();
  if (candidate) await page.route('**/assets/theme.js?*',route=>route.fulfill({contentType:'text/javascript',body:candidate}));
  page.setDefaultTimeout(12000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  try {
    const evidence = await callback({context,page});
    results.push({name,...evidence,pageErrors:errors});
  } catch(error) {
    results.push({name,harnessError:error.stack,pageErrors:errors});
  } finally {
    await page.unrouteAll({behavior:'ignoreErrors'});
    await json(context,'/cart/update.js',{note:''}).catch(()=>{});
    await json(context,'/cart/clear.js',{}).catch(()=>{});
    await context.close();
    await writeFile(`${output}/browser-results${candidate ? '-proposed' : process.argv[2] ? '-focused' : ''}.json`,JSON.stringify(results,null,2));
    console.log(JSON.stringify(results.at(-1)));
  }
}

try {
  await run('F01-directional-dialog-matrix', async ({page}) => {
    const matrix = [];
    const tags = ['theme-drawer','cart-drawer','size-guide-modal','predictive-search'];
    for (const first of tags) for (const second of tags) {
      if (first === second) continue;
      await setup(page);
      for (const tag of [first,second]) {
        await page.evaluate(tag => { const e = document.querySelector(tag); if (e.setOpen) e.setOpen(true); else e.open(); }, tag);
        await page.waitForTimeout(90);
      }
      const before = await state(page);
      await page.keyboard.press('Tab');
      const afterTab = await state(page);
      if (first === 'cart-drawer' && second === 'predictive-search') await page.screenshot({path:`${output}/dialog-cart-to-search-mobile${candidate ? '-proposed' : ''}.png`});
      await page.keyboard.press('Escape');
      const afterEscape = await state(page);
      matrix.push({first,second,before,afterTab,afterEscape,pass:before.open.length===1 && !before.open[0].inert && afterEscape.open.length===0});
    }
    return {pass:matrix.every(r=>r.pass),kind:'Real components; public opening APIs, not inaccessible native clicks',matrix};
  });

  await run('F03-stale-open-response-after-mutation',async ({context,page}) => {
    await seed(context);
    await setup(page);
    const captured = deferred(), release = deferred();
    let intercepted = false;
    await page.route('**/cart?section_id=cart-drawer',async route => {
      if (intercepted) return route.continue();
      intercepted = true;
      const response = await route.fetch();
      captured.resolve();
      await release.promise;
      await route.fulfill({response});
    });
    try {
      await page.locator('.site-header__cart').click();
      await bounded(captured.promise);
      await page.locator('[data-cart-quantity]').fill('2');
      await page.locator('[data-cart-quantity]').press('Tab');
      await page.waitForFunction(()=>document.querySelector('cart-drawer').dataset.itemCount==='2');
      const fresh = await state(page);
      const server = await json(context,'/cart.js');
      release.resolve();
      await page.waitForTimeout(600);
      const late = await state(page);
      await page.screenshot({path:`${output}/stale-cart-mobile${candidate ? '-proposed' : ''}.png`});
      return {pass:Number(late.count)===server.item_count,fresh,late,server:{item_count:server.item_count,total_price:server.total_price,quantities:server.items.map(i=>i.quantity)}};
    } finally {release.resolve();}
  });

  await run('F02-pending-variant-duplicate-submit',async ({context,page}) => {
    await seed(context);
    await json(context,'/cart/clear.js',{});
    await setup(page);
    const captured = deferred(), release = deferred();
    let calls = 0;
    await page.route('**/cart/add.js',async route=>{calls++;captured.resolve();await release.promise;await route.continue();});
    try {
      await page.locator('variant-selects [data-add-to-cart]').first().click();
      await bounded(captured.promise);
      await page.locator('variant-selects .variant-picker__label').nth(1).click();
      const pending = await page.evaluate(()=>{
        const v=document.querySelector('variant-selects'),button=v.querySelector('[data-add-to-cart]');
        button.form.requestSubmit(button);
        return {disabled:button.disabled,pending:button.form.dataset.cartAddPending,variant:v.currentVariant.id};
      });
      await page.waitForTimeout(150);
      release.resolve();
      await page.waitForFunction(()=>document.querySelector('cart-drawer').isOpen);
      await page.waitForFunction(()=>!document.querySelector('[data-cart-add-pending]'));
      const cart=await json(context,'/cart.js');
      return {pass:calls===1&&cart.item_count===1&&pending.disabled&&pending.pending==='true',calls,pending,cart:cart.items.map(i=>({variant_id:i.variant_id,quantity:i.quantity}))};
    } finally {release.resolve();}
  });

  await run('F04-native-note-and-focus-mutations',async ({context,page})=>{
    await seed(context);await setup(page);await openCart(page);
    await page.locator('#CartDrawerNote').fill('Keep this unsaved draft: gift for Ada');
    await page.locator('[data-cart-quantity]').fill('2');
    await page.locator('[data-cart-quantity]').press('Tab');
    await page.waitForFunction(()=>document.querySelector('cart-drawer').dataset.itemCount==='2');
    const quantity=await state(page);
    await page.locator('[data-cross-sell-add]').first().click();
    await page.waitForFunction(()=>document.querySelector('cart-drawer').dataset.itemCount==='3');
    await page.waitForTimeout(50);
    const crossSell=await state(page);
    return {pass:[quantity,crossSell].every(s=>s.note==='Keep this unsaved draft: gift for Ada'&&s.dirty==='true'&&s.focus.inCart),quantity,crossSell};
  });

  await run('F03-same-count-other-tab',async ({context,page})=>{
    await seed(context);await setup(page);await openCart(page);
    await page.keyboard.press('Escape');
    await json(context,'/cart/clear.js',{});
    await json(context,'/cart/add.js',{items:[{id:id('qa-08-on-sale'),quantity:1}]});
    await openCart(page);
    const drawer=await state(page);
    const titles=await page.locator('[data-cart-drawer-content]').innerText();
    const expectedTitle=inventory.products.find(p=>p.handle==='qa-08-on-sale').title;
    return {pass:drawer.count==='1'&&titles.includes(expectedTitle),drawer,expectedTitle,titles:titles.slice(0,400)};
  });

  await run('F10-sixteen-HTML-mutation-errors',async ({context,page})=>{
    await seed(context);await setup(page);
    const rows=[];
    for(const flow of ['addItem','addCrossSell','changeLine','addSelectedItems']) {
      if(flow==='addCrossSell'||flow==='changeLine') await openCart(page);
      if(flow==='addSelectedItems') await page.keyboard.press('Escape');
      for(const status of [500,502,503,429]) {
        const url=flow==='changeLine'?'**/cart/change.js':'**/cart/add.js';
        const handler=route=>route.fulfill({status,contentType:'text/html',body:'<h1>Upstream failure</h1>'});
        await page.route(url,handler);
        if(flow==='addItem') await page.locator('variant-selects [data-add-to-cart]').first().click();
        if(flow==='addCrossSell') await page.locator('[data-cross-sell-add]').first().click();
        if(flow==='changeLine') {
          await page.locator('[data-cart-quantity]').fill(status===500?'2':status===502?'3':status===503?'4':'5');
          await page.locator('[data-cart-quantity]').press('Tab');
        }
        if(flow==='addSelectedItems') await page.locator('[data-complete-look-submit]').click();
        const selector=flow==='addItem'?'variant-selects [data-product-form-error]':flow==='addSelectedItems'?'[data-bundle-error]':'[data-cart-error]';
        await page.locator(selector).first().waitFor({state:'visible'});
        await page.waitForFunction(()=>![...document.querySelectorAll('[aria-busy="true"]')].some(e=>e.matches('[data-add-to-cart],[data-cross-sell-add],[data-cart-drawer-panel],[data-complete-look-submit]')));
        const message=await page.locator(selector).first().textContent();
        const expected=await page.locator(flow==='addSelectedItems'?'complete-the-look':'cart-drawer').getAttribute('data-error-message');
        rows.push({flow,status,message,expected,pass:message===expected&&!message.includes('SyntaxError')});
        await page.unroute(url,handler);
      }
      if(flow==='addCrossSell') await page.keyboard.press('Escape');
    }
    return {pass:rows.every(r=>r.pass),rows};
  },1440);

  await run('F05-quantity-required-and-clear-protection',async ({context,page})=>{
    await seed(context);await setup(page);
    const productInputs=await page.locator('variant-selects [data-quantity-input]').evaluateAll(inputs=>inputs.map(e=>{e.value='';return {required:e.required,valid:e.checkValidity(),type:e.type};}));
    await openCart(page);
    let changes=0;page.on('request',r=>{if(r.url().includes('/cart/change.js'))changes++;});
    await page.locator('[data-cart-quantity]').fill('');
    await page.locator('[data-cart-quantity]').press('Tab');
    const invalid=await page.locator('[data-cart-quantity]').evaluate(e=>({required:e.required,valid:e.checkValidity(),value:e.value}));
    await page.waitForTimeout(180);
    const cart=await json(context,'/cart.js');
    return {pass:productInputs.length===2&&productInputs.every(i=>i.required&&!i.valid)&&invalid.required&&!invalid.valid&&changes===0&&cart.item_count===1,productInputs,invalid,changes,itemCount:cart.item_count};
  });

  await run('F08-quotes-in-real-search',async ({page})=>{
    await setup(page,'/search?q='+encodeURIComponent('Silk "Ink" & dye'));
    const heading=await page.locator('main h1').innerText();
    const empty=await page.locator('main h2').allTextContents();
    await page.locator('[data-predictive-search-open]').click();
    await page.locator('[data-predictive-search-input]').fill('Silk "Ink"');
    await page.waitForFunction(()=>{const s=document.querySelector('predictive-search');return s.results.getAttribute('aria-busy')==='false'&&s.results.textContent.includes('View all');});
    const predictive=await page.locator('[data-predictive-search-results]').innerText();
    return {pass:heading.includes('"Ink"')&&!/&(quot|amp|#34);/.test(heading+empty.join('')+predictive),heading,empty,predictive};
  });

  await run('F06-price-filters-numeric-render',async ({page})=>{
    const rows=[];
    for(const path of ['/collections/all?filter.v.price.gte=1250.50','/search?q=qa&type=product&filter.v.price.gte=1250.50']) {
      await setup(page,path);
      const inputs=await page.locator('input[name*="filter.v.price"]').evaluateAll(es=>es.map(e=>({name:e.name,value:e.value,max:e.max,step:e.step,valid:e.checkValidity()})));
      rows.push({path,inputs,pass:inputs.length===2&&inputs[0].value==='1250.5'&&inputs.every(e=>e.step==='any'&&e.valid&&Number(e.max)===12500)});
    }
    return {pass:rows.every(r=>r.pass),scope:'Real Shopify Liquid in USD; no admin currency mutation',rows};
  });

  await run('F07-real-private-helper-via-debugger',async ({context,page})=>{
    await setup(page);
    const cdp=await context.newCDPSession(page);
    await cdp.send('Debugger.enable');
    const url=await page.evaluate(()=>[...document.scripts].map(s=>s.src).find(s=>s.includes('/theme.js')));
    const breakpoint=await cdp.send('Debugger.setBreakpointByUrl',{url,lineNumber:99});
    const paused=deferred();cdp.once('Debugger.paused',event=>paused.resolve(event));
    const triggering=page.evaluate(()=>document.querySelector('complete-the-look').updateSummary());
    const event=await bounded(paused.promise);
    await cdp.send('Debugger.removeBreakpoint',{breakpointId:breakpoint.breakpointId});
    const evaluation=await cdp.send('Debugger.evaluateOnCallFrame',{callFrameId:event.callFrames[0].callFrameId,returnByValue:true,expression:`(() => {
      const expected={amount:'1,250.50',amount_no_decimals:'1,251',amount_with_comma_separator:'1.250,50',amount_no_decimals_with_comma_separator:'1.251',amount_with_apostrophe_separator:"1'250.50",amount_no_decimals_with_space_separator:'1 251',amount_with_space_separator:'1 250,50',amount_with_period_and_space_separator:'1 250.50'};
      const rows=Object.entries(expected).map(([token,want])=>({token,want,got:formatMoney(125050,'{{'+token+'}}')}));
      const invalid=[null,undefined,true,false,[],{},'', '   ','12.34','1e3','1 250',NaN,Infinity].map(value=>({input:String(value),type:typeof value,got:formatMoney(value,'{{amount}}')}));
      const old=window.theme.moneyFormat,oldData=document.documentElement.dataset.moneyFormat;
      let fallback;
      try{window.theme.moneyFormat='invalid';document.documentElement.dataset.moneyFormat='invalid';fallback=formatMoney(12000,'{{unknown}}');}finally{window.theme.moneyFormat=old;if(oldData===undefined)delete document.documentElement.dataset.moneyFormat;else document.documentElement.dataset.moneyFormat=oldData;}
      return {rows,invalid,fallback,jpy:formatMoney(100000,'JPY {{ amount_no_decimals }}'),eur:formatMoney(125050,'{{ amount_with_comma_separator }} EUR'),pound:formatMoney(125050,'&pound;{{ amount }}'),markup:formatMoney(125050,'<img src=x onerror=alert(1)>{{amount}}'),integerString:formatMoney('125050','{{amount}}'),pass:rows.every(r=>r.want===r.got)&&invalid.every(r=>r.got==='')&&fallback==='$120.00'};
    })()`});
    await cdp.send('Debugger.resume');await triggering;await cdp.detach();
    if(evaluation.exceptionDetails)throw new Error(JSON.stringify(evaluation.exceptionDetails));
    return {method:'CDP breakpoint inside original helper closure; no copied helper, no production instrumentation',...evaluation.result.value};
  });

  await run('sale-and-stock-badges',async ({page})=>{
    await setup(page,'/collections/all');
    const rows=await page.locator('.badge[data-sale-badge],.badge[data-sold-out-badge]').evaluateAll(es=>es.filter(e=>!e.hidden).map(e=>{const c=getComputedStyle(e);return {label:e.textContent.trim(),sale:e.hasAttribute('data-sale-badge'),color:c.color,bg:c.backgroundColor,tokenBg:c.getPropertyValue('--color-sale-badge-bg').trim(),tokenText:c.getPropertyValue('--color-sale-badge-text').trim()};}));
    return {pass:rows.some(e=>e.sale&&e.bg!=='rgba(0, 0, 0, 0)')&&rows.some(e=>!e.sale&&e.bg==='rgba(0, 0, 0, 0)'),rows};
  },1440);

  await run('bundle-deselected-empty-no-request',async ({page})=>{
    await setup(page);let adds=0;page.on('request',r=>{if(r.url().includes('/cart/add.js'))adds++;});
    await page.locator('[data-bundle-select]').evaluateAll(es=>es.forEach(e=>{e.checked=false;e.dispatchEvent(new Event('change',{bubbles:true}));}));
    const before=await page.locator('complete-the-look').evaluate(e=>({disabled:e.submitButton.disabled,total:e.totalOutput.textContent,label:e.submitLabel.textContent}));
    await page.evaluate(()=>document.querySelector('complete-the-look').addSelectedItems());
    return {pass:before.disabled&&adds===0,before,adds};
  });
} finally {
  await browser.close();
  console.log(JSON.stringify({checks:results.length,failed:results.filter(r=>r.pass===false).map(r=>r.name),harnessErrors:results.filter(r=>r.harnessError).map(r=>r.name)}));
  if(results.some(r=>r.pass===false||r.harnessError))process.exitCode=2;
}
