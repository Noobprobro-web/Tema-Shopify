import {chromium,DESK,MOB,newCtx,nav,sleep} from './lib2.mjs';
const b=await chromium.launch();
for(const [vn,vo] of [['d',DESK],['m',MOB]]){
const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/pages/faq?view=g5a',{settle:1500});
console.log(vn,await p.evaluate(()=>{const s=document.querySelector('main .shopify-section');return [...s.querySelectorAll('.featured-product__gallery > *')].map((e,i)=>{const cs=getComputedStyle(e);const img=e.querySelector('img');return i+':'+cs.display+':'+Math.round(e.getBoundingClientRect().height)+':'+(img?img.loading:'')+':'+(e.hidden?'hidden':'')})}));
await ctx.close();}
await b.close();
