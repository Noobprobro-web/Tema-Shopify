import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out,watch,bad} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); const w=watch(p); const s=await nav(p,'/pages/faq?view=g5c',{settle:1800}); R[vn+'-status']=s; R[vn+'-bad']=await bad(p);
 for(let y=0;y<6000;y+=300){await p.evaluate(y=>scrollTo(0,y),y);await sleep(200);} 
 R[vn+'-sections']=await p.evaluate(()=>[...document.querySelectorAll('main .shopify-section')].map(s=>({id:s.id.replace(/.*__/,''),h:Math.round(s.getBoundingClientRect().height),txt:s.innerText.replace(/\n+/g,' | ').slice(0,420)})));
 // CTL interactions
 const ctl=p.locator('main .shopify-section').nth(1); await ctl.scrollIntoViewIfNeeded(); await sleep(500);
 R[vn+'-ctl3-dom']=await ctl.evaluate(e=>({checks:[...e.querySelectorAll('input[type=checkbox]')].map(c=>c.checked+':'+c.getAttribute('aria-label')?.slice(0,30)),selects:e.querySelectorAll('select').length,radios:e.querySelectorAll('input[type=radio]').length,total:e.querySelector('[data-bundle-total],[class*=total]')?.innerText.replace(/\n/g,' ').slice(0,80),btn:[...e.querySelectorAll('button')].map(x=>x.textContent.trim().slice(0,30)+(x.disabled?' (disabled)':'')).slice(0,5)}));
 await shot(p,vn+'-ctl3');
 R[vn+'-errs']=[...new Set(w.pageerrors)].filter(x=>!/Failed to fetch/.test(x));
 await ctx.close();
}
out('ctl',R); console.log(JSON.stringify(R,null,1).slice(0,7000)); await b.close();
