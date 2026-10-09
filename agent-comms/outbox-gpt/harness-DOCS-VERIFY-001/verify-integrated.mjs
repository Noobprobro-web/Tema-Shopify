import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const output = path.join(root, 'agent-comms/outbox-gpt/harness-DOCS-VERIFY-001');
const browser = await chromium.launch({headless:true,channel:'chrome'});
const results = [];
for (const width of [320,375,1440]) {
  const page = await browser.newPage({viewport:{width,height:900}});
  for (const file of ['docs.html','support.html']) {
    await page.goto(pathToFileURL(path.join(root,'docs/merchant',file)).href);
    const geometry = await page.evaluate(() => ({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
    if(geometry.scrollWidth>geometry.clientWidth) throw Error(JSON.stringify({file,width,...geometry}));
    await page.screenshot({path:path.join(output,`integrated-${file}-${width}.png`),fullPage:true});
    results.push({file,width,...geometry});
  }
  await page.close();
}
for (const mode of ['success','http-error','network-error','timeout']) {
  const page = await browser.newPage({viewport:{width:375,height:812}});
  if(mode==='timeout') await page.addInitScript(() => {const original=window.setTimeout; window.setTimeout=(fn,ms,...args)=>original(fn,ms===30000?150:ms,...args);});
  let requests=0;
  await page.route('https://formspree.io/**',async route => {
    requests++;
    if(mode==='timeout') return;
    if(mode==='network-error') return route.abort('failed');
    await route.fulfill({status:mode==='success'?200:500,contentType:'application/json',body:'{}'});
  });
  await page.goto(pathToFileURL(path.join(root,'docs/merchant/support.html')).href);
  const button=page.getByRole('button',{name:'Send Support Ticket'});
  await button.click();
  expect(requests).toBe(0);
  await page.getByLabel('Your Name',{exact:true}).fill('QA verification');
  await page.getByLabel('Your Email Address').fill('invalid');
  await page.getByLabel('Shopify Store URL').fill('example.myshopify.com');
  await page.getByLabel('Detailed Description').fill('Automated intercepted QA request.');
  await button.click();
  expect(requests).toBe(0);
  await page.getByLabel('Your Email Address').fill('qa@example.com');
  await page.locator('form').evaluate(form=>{form.requestSubmit();form.dispatchEvent(new Event('submit',{cancelable:true}));});
  await expect(button).toBeEnabled();
  await expect(page.locator('[data-form-status]')).toHaveAttribute('data-state',mode==='success'?'success':'error');
  expect(requests).toBe(1);
  await expect(page.getByLabel('Detailed Description')).toHaveValue(mode==='success'?'':'Automated intercepted QA request.');
  results.push({mode,requests,nativeValidation:true,buttonRecovered:true,inputsPreserved:mode!=='success'});
  await page.close();
}
await browser.close();
fs.writeFileSync(path.join(output,'integrated-results.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
