import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chromium',headless:true});
const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();
const base='http://127.0.0.1:9292',out={};
page.setDefaultTimeout(15000);
async function goto(path){await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>window.ThemeCore?.initialized);}
try{
 await goto('/products/qa-16-single-char');
 await ctx.request.post(base+'/cart/add.js',{data:{items:[{id:51271418872051,quantity:1}]}});
 const payload='</textarea><img src="/audit-missing-image" onerror="document.documentElement.dataset.auditNote=1"><textarea>';
 const noteResponse=await ctx.request.post(base+'/cart/update.js',{data:{note:payload}});
 await goto('/cart');await page.waitForTimeout(500);
 out.cartNoteInjection={apiStatus:noteResponse.status(),marker:await page.evaluate(()=>document.documentElement.dataset.auditNote||null),images:await page.locator('img[src="/audit-missing-image"]').count(),note:(await(await ctx.request.get(base+'/cart.js')).json()).note};
 await ctx.request.post(base+'/cart/update.js',{data:{note:''}});
 await ctx.request.post(base+'/cart/clear.js');
 await goto('/products/qa-09-price-varies');
 const requests=[];
 await page.route('**/cart/add.js',async route=>{const data=route.request().postData();await new Promise(r=>setTimeout(r,1000));const response=await route.fetch();requests.push({status:response.status(),body:data?.match(/name="id"\r?\n\r?\n(\d+)/)?.[1]});await route.fulfill({response});});
 const button=page.locator('variant-selects [data-add-to-cart]');await button.click();
 const options=page.locator('variant-selects label.variant-picker__label');await options.nth(1).click();await options.nth(0).click();
 out.concurrent={enabled:await button.isEnabled(),busy:await button.getAttribute('aria-busy')};await button.click();
 await page.waitForTimeout(4500);out.concurrent.requests=requests;
 out.concurrent.items=(await(await ctx.request.get(base+'/cart.js')).json()).items.map(i=>({title:i.title,quantity:i.quantity}));
 await page.unrouteAll({behavior:'wait'});
 await goto('/products/qa-13-expensive');
 out.money8=await page.evaluate(()=>{const e=document.querySelector('variant-selects');e.quantityInput.value='2';e.moneyFormat='{{ amount_with_period_and_space_separator }} EUR';e.updateLineTotal();return e.querySelector('[data-line-total-current]').textContent;});
 await goto('/search?q=THIS_PRODUCT_DOES_NOT_EXIST_976&type=product');out.emptySearch=await page.locator('main').innerText();
 await goto('/collections/all?filter.v.price.gte=999999999');out.emptyCollection=await page.locator('main').innerText();
 await goto('/search?q=Single+variant%2C+quick+add+visible&type=product');out.singleSearch=await page.locator('main').innerText();
 await goto('/products/qa-16-single-char');
 await page.locator('[data-predictive-search-open]').click();await page.locator('[data-predictive-search-input]').fill('sale');
 await page.waitForTimeout(1600);
 out.predictiveReal={text:await page.locator('[data-predictive-search-results]').textContent(),template:await page.locator('predictive-search').getAttribute('data-view-all-template'),links:await page.locator('[data-predictive-search-results] a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),role:e.getAttribute('role')})))};
}catch(e){out.error=e.message;}finally{
 await page.unrouteAll({behavior:'ignoreErrors'});
 await ctx.request.post(base+'/cart/update.js',{data:{note:''}}).catch(()=>{});await ctx.request.post(base+'/cart/clear.js').catch(()=>{});
 await writeFile('.tmp/gpt-audit-4b-005/final-probes.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out));await browser.close();
}
