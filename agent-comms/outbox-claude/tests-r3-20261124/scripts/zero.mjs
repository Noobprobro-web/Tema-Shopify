import {chromium,DESK,MOB,newCtx,nav,sleep,shot,cartCall,out} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/'); await cartCall(p,'/cart/add.js',{id:68442276921648,quantity:1}); await sleep(2500);
 await nav(p,'/cart'); 
 const reqs=[]; p.on('request',r=>{if(/cart/.test(r.url())&&r.method()!=='GET')reqs.push(r.method()+' '+r.url().replace(/^.*\/\/[^/]+/,''))});
 R[vn+'-attrs']=await p.evaluate(()=>{const i=document.querySelector('#CartQuantity-1');return {min:i.min,step:i.step,type:i.type,required:i.required}});
 await p.locator('#CartQuantity-1').fill('0'); await p.locator('#CartQuantity-1').press('Tab'); await sleep(4000);
 R[vn+'-after-tab']={reqs:[...reqs],lines:await p.locator('#CartQuantity-1').count(),valid:await p.evaluate(()=>document.querySelector('#CartQuantity-1')?.validity?.valid)};
 await shot(p,vn+'-cart-zero-tab');
 if(await p.locator('#CartQuantity-1').count()){ await p.locator('button[name=update]:visible, [name=update]').first().click().catch(()=>{}); await p.waitForLoadState('load'); await sleep(2500);
  R[vn+'-after-update']={text:(await p.locator('main').innerText()).replace(/\n+/g,' | ').slice(0,200),reqs:[...reqs]}; }
 await ctx.close();
}
out('zero',R); console.log(JSON.stringify(R,null,1)); await b.close();
