import fs from 'node:fs';import {chromium} from 'playwright';import {unlock,STORES} from '../../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs';
const out='agent-comms/outbox-gpt/harness-GPT-018/role-01-buyer';const key=process.argv[2];const store=STORES[key];if(key==='archive')store.products[0]=store.products[1];
const browser=await chromium.launch({headless:true,channel:'chrome'});const ctx=await browser.newContext({viewport:{width:390,height:844}});await unlock(ctx,store.url);const page=await ctx.newPage();const errors=[];page.on('requestfailed',r=>errors.push({url:r.url(),error:r.failure()}));page.on('pageerror',e=>errors.push({error:e.message}));
await page.goto(store.url+'/products/'+store.products[0],{waitUntil:'domcontentloaded'});
const add=page.waitForResponse(r=>r.url().includes('/cart/add')&&r.request().method()==='POST');
await page.getByRole('button',{name:'Add to cart',exact:true}).first().click();const added=await add;fs.writeFileSync(`${out}/${key}-add-response.json`,await added.text());console.log('ADD',added.status());
await page.goto(store.url+'/cart',{waitUntil:'domcontentloaded'});await page.screenshot({path:`${out}/${key}-cart-mobile-added.png`,fullPage:true});
await page.getByRole('button',{name:/check out|checkout/i}).first().click();await page.waitForLoadState('domcontentloaded');
await page.screenshot({path:`${out}/${key}-checkout.png`,fullPage:true});
async function save(stage){fs.writeFileSync(`${out}/${key}-${stage}.json`,JSON.stringify({url:page.url(),text:await page.locator('body').innerText(),inputs:await page.locator('input,select,button').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.type,name:e.name,text:e.innerText,value:e.value,label:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder')}))),frames:page.frames().map(f=>f.url())},null,2));await page.screenshot({path:`${out}/${key}-${stage}.png`,fullPage:true});}
await save('checkout');
await page.getByRole('textbox',{name:'Email',exact:true}).fill(`sartorial-audit-018-${key}@example.com`);
await page.getByRole('textbox',{name:'First name',exact:true}).fill('Audit');await page.getByRole('textbox',{name:'Last name',exact:true}).fill('Test');
await page.getByRole('textbox',{name:'Address',exact:true}).fill('123 Test Street');await page.getByRole('textbox',{name:'City',exact:true}).fill('New York');await page.getByRole('combobox',{name:'State',exact:true}).selectOption({label:'New York'});await page.getByRole('textbox',{name:'ZIP code',exact:true}).fill('10001');await page.getByRole('textbox',{name:'ZIP code',exact:true}).press('Tab');
await save('address-filled');await page.getByText(/Bogus|credit card|no shipping/i).first().waitFor({timeout:20000}).catch(()=>{});await save('payment-stage');fs.writeFileSync(`${out}/${key}-network-errors.json`,JSON.stringify(errors,null,2));
await browser.close();
