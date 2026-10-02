import fs from 'node:fs';
import {unlock,STORES} from '../../../outbox-claude/harness-AUDIT-FINAL-002/lib.mjs';
import {chromium} from 'playwright';
const out='agent-comms/outbox-gpt/harness-GPT-018/role-01-buyer';
const browser=await chromium.launch({headless:true,channel:'chrome'});
for(const [key,store] of Object.entries(STORES)){
 const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
 await unlock(ctx,store.url);const page=await ctx.newPage();
 for(const [name,url] of [['home',store.url],['pdp',store.url+'/products/'+store.products[0]],['cart',store.url+'/cart']]){
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});await page.screenshot({path:`${out}/${key}-${name}-desktop.png`,fullPage:true});
  fs.writeFileSync(`${out}/${key}-${name}.json`,JSON.stringify({url:page.url(),status:response?.status(),text:await page.locator('body').innerText(),controls:await page.locator('input,select,button').evaluateAll(es=>es.map(e=>({tag:e.tagName,type:e.type,name:e.name,text:e.innerText,value:e.value,label:e.getAttribute('aria-label')})))},null,2));
  if(name==='pdp'){await page.setViewportSize({width:390,height:844});await page.screenshot({path:`${out}/${key}-${name}-mobile.png`,fullPage:true});await page.setViewportSize({width:1440,height:1000});}
 }
 await ctx.close();
}
await browser.close();
