import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel:'chromium', headless:true });
const context = await browser.newContext({ viewport:{width:390,height:844} });
const page = await context.newPage();
const base='http://127.0.0.1:9292';
const results=[];
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function run(name, fn) {
  try { const detail=await fn(); results.push({name,detail}); console.log(JSON.stringify({name,detail})); }
  catch(e) { results.push({name,error:e.message}); console.log(JSON.stringify({name,error:e.message})); }
  await writeFile('.tmp/gpt-audit-4b-005/browser-results.json',JSON.stringify({results,errors},null,2));
}
async function goto(path) {
  await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.ThemeCore?.initialized);
}
const state=()=>page.evaluate(()=>({focus:document.activeElement?.outerHTML.slice(0,220),cartOpen:document.querySelector('cart-drawer')?.isOpen,cartInert:!!document.querySelector('cart-drawer')?.closest('[inert]'),guideOpen:document.querySelector('size-guide-modal')?.isOpen,menuOpen:document.querySelector('theme-drawer')?.hasAttribute('data-open'),count:document.querySelector('cart-drawer')?.dataset.itemCount}));
try {
 await run('catalog-mobile',async()=>{
  const outputs=[];
  for(const handle of ['qa-01-long-title','qa-02-no-image','qa-15-no-description','qa-06-many-variants','qa-18-many-images','qa-13-expensive','qa-12-free']) {
    await goto('/products/'+handle);
    outputs.push(await page.evaluate(()=>({url:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1s:document.querySelectorAll('main h1').length,heading:document.querySelector('main h1')?.textContent.trim(),images:document.querySelectorAll('[data-product-media-id]').length,variants:document.querySelector('variant-selects')?.variants?.length,emptyDescription:[...document.querySelectorAll('.product-description')].map(e=>e.textContent.trim()),small:[...document.querySelectorAll('main button, main input, main select, main summary')].filter(e=>!e.closest('[hidden],[inert]')&&e.getClientRects().length&&!e.classList.contains('visually-hidden')).map(e=>({tag:e.tagName,label:e.getAttribute('aria-label')||e.textContent.trim().slice(0,60),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).filter(e=>e.w<44||e.h<44)})));
  }
  await page.screenshot({path:'.tmp/gpt-audit-4b-005/free-mobile.png',fullPage:true});
  return outputs;
 });
 await run('pdp-quantity-and-money',async()=>{
  await goto('/products/qa-08-on-sale');
  return page.evaluate(()=>{
    const element=document.querySelector('variant-selects');
    const input=element.quantityInput;
    const form=element.querySelector('[data-cart-add-form]');
    const values=['0','-2','abc','','1.5','2','3'].map(v=>{input.value=v;input.dispatchEvent(new Event('input',{bubbles:true}));return {input:v,stored:input.value,valid:form.checkValidity(),total:element.lineTotal.textContent.trim()};});
    const cases=[['JPY','\u00a5{{ amount_no_decimals }}',125000],['EUR','{{ amount_with_comma_separator }} \u20ac',125050],['EUR space','{{ amount_with_space_separator }} \u20ac',125050],['HTML entity','{{ amount_with_comma_separator }}&nbsp;&euro;',125050],['missing price','${{amount}}',null]];
    input.value='2';
    const original={...element.currentVariant},originalFormat=element.moneyFormat;
    const money=cases.map(([name,format,cents])=>{element.moneyFormat=format;element.currentVariant={...original,price_cents:cents,compare_at_price_cents:null};element.updateLineTotal();return {name,cents,format,total:element.querySelector('[data-line-total-current]').textContent};});
    element.currentVariant=original;element.moneyFormat=originalFormat;
    return {values,money};
  });
 });
 await run('double-click',async()=>{
  await goto('/products/qa-16-single-char');
  await context.request.post(base+'/cart/clear.js');
  let posts=0;
  await page.route('**/cart/add.js',async route=>{posts++;await new Promise(r=>setTimeout(r,500));await route.continue();});
  const button=page.locator('variant-selects [data-add-to-cart]');
  await button.click({clickCount:2,delay:40});
  await page.waitForFunction(()=>document.querySelector('cart-drawer')?.isOpen);
  await page.waitForTimeout(300);
  const cart=await (await context.request.get(base+'/cart.js')).json();
  await page.unroute('**/cart/add.js');
  return {posts,itemCount:cart.item_count,state:await state()};
 });
 await run('note-and-quantity-focus',async()=>{
  const note=page.locator('#CartDrawerNote');
  const quantity=page.locator('[data-cart-quantity]').first();
  await note.fill('AUDIT do not lose this gift note');
  await quantity.fill('2');
  const response=page.waitForResponse(r=>r.url().includes('/cart/change.js'));
  await quantity.press('Tab');
  await response;
  await page.waitForFunction(()=>document.querySelector('[data-cart-quantity]')?.value==='2'&&document.querySelector('cart-drawer').dataset.itemCount==='2');
  await page.waitForTimeout(300);
  const cart=await (await context.request.get(base+'/cart.js')).json();
  const beforeTab=await state();
  await page.keyboard.press('Tab');
  return {noteAfter:await note.inputValue(),serverNote:cart.note,beforeTab,afterTab:await state()};
 });
 await run('same-count-cart-sync',async()=>{
  await page.keyboard.press('Escape');
  await context.request.post(base+'/cart/clear.js');
  await context.request.post(base+'/cart/add.js',{data:{items:[{id:51271413989619,quantity:2}]}});
  await page.locator('.site-header__cart').click();
  await page.waitForTimeout(1200);
  const cart=await (await context.request.get(base+'/cart.js')).json();
  return {server:cart.items.map(i=>({title:i.title,quantity:i.quantity})),drawer:await page.locator('[data-cart-drawer-content] .cart-item__title').allTextContents(),text:(await page.locator('[data-cart-drawer-content]').textContent()).trim().slice(0,300)};
 });
 await run('empty-quantity-removes-item',async()=>{
  await goto('/products/qa-16-single-char');
  await page.locator('.site-header__cart').click();
  const quantity=page.locator('[data-cart-quantity]').first();
  await quantity.fill('');
  const response=page.waitForResponse(r=>r.url().includes('/cart/change.js'));
  await quantity.press('Tab');
  await response;await page.waitForTimeout(400);
  const cart=await (await context.request.get(base+'/cart.js')).json();
  return {itemCount:cart.item_count,state:await state()};
 });
 await run('nested-nav-cart',async()=>{
  await goto('/products/qa-16-single-char');
  await page.evaluate(()=>{const nav=document.querySelector('theme-drawer nav');const a=document.createElement('a');a.href='/cart';a.textContent='Audit merchant cart link';a.id='audit-cart-menu-link';nav.append(a);});
  await page.locator('theme-drawer [data-drawer-trigger]').click();
  await page.locator('#audit-cart-menu-link').click();
  await page.waitForTimeout(400);
  const before=await state();
  await page.keyboard.press('Tab');const tab=await state();
  await page.keyboard.press('Escape');const escape1=await state();
  await page.keyboard.press('Escape');const escape2=await state();
  return {fixture:'One additional cart URL link inside the existing merchant nav; no JS changed',before,tab,escape1,escape2};
 });
 await run('cart-500-error',async()=>{
  await goto('/products/qa-16-single-char');
  await page.route('**/cart/add.js',r=>r.fulfill({status:500,contentType:'text/html',body:'<h1>Temporary server error</h1>'}));
  const button=page.locator('variant-selects [data-add-to-cart]');
  await button.click();
  await page.locator('[data-product-form-error]:visible').waitFor();
  const result={message:await page.locator('[data-product-form-error]').textContent(),buttonEnabled:await button.isEnabled()};
  await page.unroute('**/cart/add.js');return result;
 });
} finally {
 await context.request.post(base+'/cart/clear.js').catch(()=>{});
 await writeFile('.tmp/gpt-audit-4b-005/browser-results.json',JSON.stringify({results,errors},null,2));
 await browser.close();
}
