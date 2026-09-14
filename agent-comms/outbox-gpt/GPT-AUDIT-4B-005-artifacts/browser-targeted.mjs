import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chromium',headless:true});
const base='http://127.0.0.1:9292',results=[];
async function run(name,fn){
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();page.setDefaultTimeout(10000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{const detail=await fn(page,context);results.push({name,detail,errors});}
 catch(e){results.push({name,error:e.message,errors});}
 finally{await page.unrouteAll({behavior:'ignoreErrors'});await context.request.post(base+'/cart/clear.js').catch(()=>{});await context.close();}
 console.log(JSON.stringify(results.at(-1)));
 await writeFile('.tmp/gpt-audit-4b-005/targeted-results.json',JSON.stringify(results,null,2));
}
async function goto(page,handle='qa-16-single-char'){
 await page.goto(base+'/products/'+handle,{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForFunction(()=>window.ThemeCore?.initialized);
}
const focus=page=>page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id,insideCart:!!document.activeElement.closest('cart-drawer'),insideSearch:!!document.activeElement.closest('predictive-search'),cartInert:!!document.querySelector('cart-drawer').closest('[inert]'),cartOpen:document.querySelector('cart-drawer').isOpen,sizeOpen:document.querySelector('size-guide-modal')?.isOpen,bodyInert:[...document.body.children].filter(e=>e.inert).map(e=>e.id||e.tagName)}));
try{
 await run('note-loss-and-focus',async(page,ctx)=>{
  await goto(page);await page.locator('variant-selects [data-add-to-cart]').click();
  await page.locator('#CartDrawerNote').waitFor({state:'visible'});
  await page.locator('#CartDrawerNote').fill('AUDIT gift note');
  const q=page.locator('[data-cart-quantity]').first();await q.fill('2');await q.press('Tab');
  await page.waitForFunction(()=>document.querySelector('cart-drawer').dataset.itemCount==='2');
  const cart=await(await ctx.request.get(base+'/cart.js')).json();
  const current=await focus(page);await page.keyboard.press('Tab');
  return {note:await page.locator('#CartDrawerNote').inputValue(),serverNote:cart.note,focusAfterReplacement:current,nextTab:await focus(page)};
 });
 await run('same-count-stale-cart',async(page,ctx)=>{
  await goto(page);await page.locator('variant-selects [data-add-to-cart]').click();
  await page.waitForFunction(()=>document.querySelector('cart-drawer')?.isOpen);
  const before=await page.locator('[data-cart-drawer-content] h3').allTextContents();
  await page.keyboard.press('Escape');
  await ctx.request.post(base+'/cart/clear.js');
  await ctx.request.post(base+'/cart/add.js',{data:{items:[{id:51271413989619,quantity:1}]}});
  await page.locator('.site-header__cart').click();await page.waitForTimeout(800);
  const cart=await(await ctx.request.get(base+'/cart.js')).json();
  return {before,drawer:await page.locator('[data-cart-drawer-content] h3').allTextContents(),server:cart.items.map(i=>i.title),count:cart.item_count};
 });
 await run('variant-switch-in-flight',async(page,ctx)=>{
  await goto(page,'qa-09-price-varies');let posts=0;
  await page.route('**/cart/add.js',async route=>{posts++;await new Promise(r=>setTimeout(r,1400));await route.continue();});
  const b=page.locator('variant-selects [data-add-to-cart]');await b.click();
  await page.locator('variant-selects label.variant-picker__label').nth(1).click();
  const reenabled=await b.isEnabled();const busy=await b.getAttribute('aria-busy');
  if(reenabled)await b.click();
  await page.waitForTimeout(3300);
  const cart=await(await ctx.request.get(base+'/cart.js')).json();
  return {reenabled,busy,posts,items:cart.items.map(i=>({title:i.title,quantity:i.quantity})),buttonEnabled:await b.isEnabled()};
 });
 await run('add-response-over-size-guide',async(page)=>{
  await goto(page);
  await page.route('**/cart/add.js',async route=>{await new Promise(r=>setTimeout(r,1400));await route.continue();});
  await page.locator('variant-selects [data-add-to-cart]').click();
  await page.locator('[data-size-guide-open]').click();
  await page.waitForFunction(()=>document.querySelector('cart-drawer').isOpen);
  await page.waitForTimeout(100);
  const initial=await focus(page);await page.keyboard.press('Tab');const tab=await focus(page);
  await page.screenshot({path:'.tmp/gpt-audit-4b-005/nested-modal-mobile.png',fullPage:false});
  return {initial,tab};
 });
 await run('size-guide-tab-cycle',async(page)=>{
  await goto(page);await page.locator('[data-size-guide-open]').click();
  await page.locator('[data-size-guide-unit="cm"]').focus();
  const steps=[];for(let i=0;i<4;i++){await page.keyboard.press('Tab');steps.push(await focus(page));}
  await page.keyboard.press('Escape');return {steps,escape:await focus(page)};
 });
 await run('bundle-empty-and-post',async(page,ctx)=>{
  await goto(page);const choices=page.locator('[data-bundle-select]');const count=await choices.count();
  for(let i=0;i<count;i++)await choices.nth(i).uncheck();
  const empty=await page.locator('complete-the-look').evaluate(e=>({disabled:e.submitButton.disabled,label:e.submitButton.textContent.trim(),total:e.totalOutput.textContent}));
  for(let i=0;i<count;i++)await choices.nth(i).check();
  let posts=0,body;
  await page.route('**/cart/add.js',async route=>{posts++;body=route.request().postDataJSON();await route.continue();});
  await page.locator('complete-the-look').evaluate(e=>e.submitButton.click());
  await page.waitForFunction(()=>document.querySelector('cart-drawer').isOpen);
  const cart=await(await ctx.request.get(base+'/cart.js')).json();
  return {count,empty,posts,itemsPosted:body.items,cartItems:cart.item_count};
 });
 await run('predictive-race-and-focus',async(page)=>{
  await goto(page);const seen=[],failed=[];
  page.on('requestfailed',r=>{if(r.url().includes('/search/suggest'))failed.push(r.url());});
  await page.route('**/search/suggest.json?**',async route=>{const q=new URL(route.request().url()).searchParams.get('q');seen.push(q);await new Promise(r=>setTimeout(r,q==='slow'?900:100));await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({resources:{results:{products:[{title:q,price:'1250.50',available:true,url:'/products/qa-16-single-char'}]}}})}).catch(()=>{});});
  await page.locator('[data-predictive-search-open]').click();
  const input=page.locator('[data-predictive-search-input]');await input.fill('slow');await page.waitForTimeout(300);await input.fill('fast');await page.waitForTimeout(1200);
  const latest=await page.locator('[data-predictive-search-results]').textContent();
  await input.fill('slow');await page.waitForTimeout(300);await input.fill('');await page.waitForTimeout(1100);
  const cleared={text:await page.locator('[data-predictive-search-results]').textContent(),expanded:await input.getAttribute('aria-expanded')};
  await input.fill('fast');await page.waitForTimeout(600);
  await page.locator('a[role="option"]').first().focus();const keyboard=[];
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');keyboard.push(await focus(page));}
  await page.keyboard.press('Escape');
  return {seen,aborted:failed.length,latest,cleared,keyboard,escape:await focus(page)};
 });
 await run('predictive-500',async(page)=>{
  await goto(page);await page.route('**/search/suggest.json?**',r=>r.fulfill({status:500,contentType:'text/html',body:'Unavailable'}));
  await page.locator('[data-predictive-search-open]').click();await page.locator('[data-predictive-search-input]').fill('coat');await page.waitForTimeout(600);
  return {status:await page.locator('[data-predictive-search-status]').textContent(),results:await page.locator('[data-predictive-search-results]').textContent()};
 });
 await run('disconnect-cart-during-add',async(page)=>{
  await goto(page);await page.route('**/cart/add.js',async route=>{const response=await route.fetch();await new Promise(r=>setTimeout(r,900));await route.fulfill({response});});
  await page.locator('variant-selects [data-add-to-cart]').click();
  await page.evaluate(()=>{window.auditDetached=document.querySelector('cart-drawer');window.auditDetached.remove();});
  await page.waitForTimeout(1800);
  return page.evaluate(()=>({connected:window.auditDetached.isConnected,detachedOpen:window.auditDetached.isOpen,bodyScrollLocked:document.body.hasAttribute('data-drawer-open'),focus:document.activeElement.tagName}));
 });
}finally{await browser.close();}
