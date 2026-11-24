import {chromium,DESK,newCtx,nav,out} from './lib2.mjs';
const b=await chromium.launch(); const ctx=await newCtx(b,DESK); const p=await ctx.newPage(); await nav(p,'/');
const res={};
for (const q of ['coat','trench','serra','shirt']){
 res[q]=await p.evaluate(async q=>{const u=`/search/suggest.json?q=${q}&resources[type]=product,collection,page,article&resources[limit]=8&resources[limit_scope]=all&resources[options][unavailable_products]=last`;const r=await fetch(u,{headers:{Accept:'application/json'}});const j=await r.json();const pr=j.resources.results.products||[];return {status:r.status,keys:Object.keys(j.resources.results),n:pr.length,productKeys:pr[0]?Object.keys(pr[0]):[],sample:pr.slice(0,4).map(x=>({t:x.title,price:x.price,price_min:x.price_min,price_max:x.price_max,cap:x.compare_at_price,capmin:x.compare_at_price_min,capmax:x.compare_at_price_max,available:x.available,variants:x.variants?x.variants.length:undefined,v0:x.variants&&x.variants[0]}))}},q);
}
out('b5-suggest',res); console.log(JSON.stringify(res,null,1).slice(0,3500));
await b.close();
