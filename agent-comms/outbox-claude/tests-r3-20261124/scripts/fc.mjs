import {chromium,DESK,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const R={};
const ctx=await newCtx(b,{...DESK,viewport:{width:1280,height:900},forcedColors:'active',colorScheme:'light'}); const p=await ctx.newPage();
R.matches=null;
for (const [n,u] of [['collection','/collections/all'],['product','/products/serra-coat']]){
 await nav(p,u,{settle:1500}); R.matches=await p.evaluate(()=>matchMedia('(forced-colors: active)').matches);
 await p.evaluate(()=>document.querySelectorAll('.facets details').forEach(d=>d.open=true)); await sleep(300);
 R[n]=await p.evaluate(()=>{const sel='button,input:not([type=hidden]):not([type=radio]):not([type=checkbox]),select,textarea,.product-card,.button,label[class*=swatch],label[class*=option],[class*=quantity-stepper]';
  return [...document.querySelectorAll(sel)].filter(e=>{const r=e.getBoundingClientRect();return r.width>8&&r.height>8}).map(e=>{const cs=getComputedStyle(e);const bw=['Top','Right','Bottom','Left'].map(s=>parseFloat(cs['border'+s+'Width'])*(cs['border'+s+'Style']==='none'?0:1));return {el:e.tagName.toLowerCase()+'.'+String(e.className).split(' ')[0],cls:String(e.className).slice(0,40),maxBorder:Math.max(...bw),outline:cs.outlineStyle!=='none'}}).filter(x=>x.maxBorder===0).reduce((a,x)=>{a[x.el]=(a[x.el]||0)+1;return a},{})});
 await shot(p,'fc-'+n);
}
// focus ring check: tab to first buttons
await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
R.focus=await p.evaluate(()=>{const e=document.activeElement;const cs=getComputedStyle(e);return {el:e.tagName+'.'+String(e.className).slice(0,30),outline:cs.outlineStyle+' '+cs.outlineWidth,color:cs.outlineColor}});
out('fc',R); console.log(JSON.stringify(R,null,1)); await b.close();
