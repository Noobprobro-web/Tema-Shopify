import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const R={}; const ctx=await newCtx(b,DESK); const p=await ctx.newPage();
for (const h of ['serra-coat','doppio-trench']){
 await nav(p,'/products/'+h,{settle:1500});
 R[h+'-attrs']=await p.evaluate(()=>({fmt:document.querySelector('variant-selects')?.dataset.moneyFormat,tpl:document.querySelector('variant-selects')?.dataset.lineTotalTemplate}));
 await p.locator('input[name=quantity]').first().fill('3'); await p.locator('input[name=quantity]').first().press('Tab'); await sleep(800);
 R[h+'-qty3']=await p.evaluate(()=>({total:[...document.querySelectorAll('[data-line-total],[class*=line-total]')].map(e=>e.innerText.replace(/\n+/g,' ')).filter(Boolean),price:document.querySelector('.product-price,.price')?.innerText.replace(/\n+/g,' ')}));
 // select another variant
 const r=p.locator('variant-selects input[type=radio]:not(:checked)').first(); await r.evaluate(i=>i.closest('label')?.click()); await sleep(900);
 R[h+'-variant']=await p.evaluate(()=>({price:document.querySelector('.product-price,.price')?.innerText.replace(/\n+/g,' '),total:[...document.querySelectorAll('[data-line-total],[class*=line-total]')].map(e=>e.innerText.replace(/\n+/g,' ')).filter(Boolean),ent:/&(amp|pound|euro|#)\w*;|<span|<\/?[a-z]+>/i.test(document.querySelector('main').innerText)}));
 R[h+'-pickup']=await p.evaluate(()=>({present:!!document.querySelector('pickup-availability,[data-pickup-availability],.pickup-availability'),text:document.querySelector('pickup-availability,[data-pickup-availability],.pickup-availability')?.innerText.slice(0,150)}));
 await shot(p,'d-pdp-qty3-'+h);
}
out('money',R); console.log(JSON.stringify(R,null,1)); await b.close();
