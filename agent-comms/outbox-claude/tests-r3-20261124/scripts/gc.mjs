import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const ctx=await newCtx(b,DESK); const p=await ctx.newPage(); const R={};
await nav(p,'/products/gift-card',{settle:1500});
R.form=await p.evaluate(()=>({fields:[...document.querySelectorAll('form[action*="/cart/add"] input:not([type=hidden]),form[action*="/cart/add"] textarea,form[action*="/cart/add"] select')].map(i=>i.name+':'+i.type+':'+(i.labels?.[0]?.textContent.trim().slice(0,30)||'')),text:document.querySelector('form[action*="/cart/add"]')?.innerText.replace(/\n+/g,' | ').slice(0,400)}));
await p.locator('form[action*="/cart/add"] input[type=checkbox]').first().check({force:true}).catch(()=>{}); await sleep(500);
const em=p.locator('input[name="properties[Recipient email]"]'); 
if(await em.count()){ await p.locator('input[name="properties[Recipient email]"]').fill('buyer@example.com'); }
await p.locator('input[name="properties[Recipient name]"]').fill('Test Name').catch(()=>{});
await p.locator('form[action*="/cart/add"] [data-add-to-cart]').first().click(); await sleep(3500);
R.drawer=await p.evaluate(()=>document.querySelector('cart-drawer [data-cart-drawer-content]')?.innerText.replace(/\n+/g,' | ').slice(0,500));
await shot(p,'d-gift-drawer');
out('gc',R); console.log(JSON.stringify(R,null,1)); await b.close();
