import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/',{settle:1200});
 R[vn]=await p.evaluate(()=>[...document.querySelectorAll('select[name=country_code]')].map(s=>{const f=s.closest('form');const btn=f.querySelector('button[type=submit]');const r=s.getBoundingClientRect();const br=btn.getBoundingClientRect();return {id:s.id,selVisible:r.width>0,btnVisible:br.width>0,btnBox:[Math.round(br.width),Math.round(br.height)],selBox:[Math.round(r.width),Math.round(r.height)],btnText:btn.textContent.trim(),jsHidden:getComputedStyle(btn).display}}));
 const sel=p.locator('select[name=country_code]:visible').first(); 
 if(await sel.count()){ const reqs=[]; p.on('request',r=>{if(r.method()==='POST')reqs.push(r.url().replace(/^.*\/\/[^/]+/,''))}); await sel.selectOption('CA'); await sleep(2500); R[vn+'-after-select']={reqs,country:await p.evaluate(()=>window.Shopify?.country),url:p.url().replace(/^.*\/\/[^/]+/,'')}; await shot(p,vn+'-country-after'); }
 await ctx.close();
}
out('loc',R); console.log(JSON.stringify(R,null,1)); await b.close();
