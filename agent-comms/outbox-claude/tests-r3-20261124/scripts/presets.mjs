import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out,watch,bad} from './lib2.mjs';
import {execSync} from 'child_process';
const b=await chromium.launch(); const R={};
for (const name of ['Imprint','Archive','Sartorial']){
 execSync(`python3 preset.py ${name}`); await sleep(14000);
 for (const [vn,vo] of [['d',DESK],['m',MOB]]){
  const ctx=await newCtx(b,vo); const p=await ctx.newPage(); const w=watch(p);
  for (const [pn,u] of [['home','/'],['bento','/pages/faq?view=g5b'],['pdp','/products/doppio-trench']]){
   const s=await nav(p,u,{settle:1500}); const bd=await bad(p);
   if(pn==='bento'){ await p.locator('main .shopify-section').nth(2).evaluate(e=>e.scrollIntoView({block:'start'})); await sleep(1200);} 
   await shot(p,`preset-${name}-${vn}-${pn}`);
   R[`${name}-${vn}-${pn}`]={s,bad:bd,errs:[...new Set(w.pageerrors)].filter(x=>!/Failed to fetch/.test(x)),heading:await p.evaluate(()=>getComputedStyle(document.querySelector('h1,h2')).fontFamily.slice(0,40)),overflow:await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)};
  }
  await ctx.close();
 }
}
out('presets',R); for(const [k,v] of Object.entries(R)) console.log(k,v.s,v.bad.length?v.bad:'ok',v.errs.length?v.errs:'',v.overflow>1?'OVF'+v.overflow:'',v.heading); await b.close();
