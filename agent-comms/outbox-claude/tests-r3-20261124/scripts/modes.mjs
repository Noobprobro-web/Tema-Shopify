import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out,cartCall} from './lib2.mjs';
import {execSync} from 'child_process';
const modes=[['both',['1','3000','5000']],['ship-only',['1','3000','-']],['gift-only',['1','-','5000']],['none-thresholds',['1','-','-']],['disabled',['0','3000','5000']]];
const b=await chromium.launch(); const R={};
for (const [name,args] of modes){
 execSync(`python3 setdrawer.py ${args.join(' ')}`); await sleep(10000);
 const ctx=await newCtx(b,DESK); const p=await ctx.newPage(); await nav(p,'/');
 const a=await cartCall(p,'/cart/add.js',{id:68442276921648,quantity:1}); if(a[0]!==200) console.log('ADD FAIL',name,a);
 for (const q of [1,2,3]){
  if(q>1){ await sleep(2500); const c=await cartCall(p,'/cart/change.js',{line:1,quantity:q}); if(c[0]!==200) console.log('CHG FAIL',name,q,c[0]); }
  await nav(p,'/'); await p.locator('.site-header__cart').click(); await sleep(2500);
  R[`${name}-q${q}`]=await p.evaluate(()=>{const r=document.querySelector('cart-drawer [data-cart-rewards]');const sub=document.querySelector('cart-drawer')?.innerText.match(/\$[\d,.]+ USD/)?.[0];return {sub,bar:r?{msg:r.querySelector('.cart-rewards__message')?.textContent.trim(),progress:r.style.cssText,now:r.querySelector('[role=progressbar]')?.getAttribute('aria-valuenow'),milestones:r.querySelector('.cart-rewards__milestones')?.innerText.replace(/\n/g,' / '),markers:r.querySelectorAll('.cart-rewards__marker').length}:null}});
  if(q===2) await shot(p,'drawer-'+name+'-q2',{clip:{x:1040,y:0,width:400,height:900}});
 }
 await ctx.close();
}
out('modes',R); for(const [k,v] of Object.entries(R)) console.log(k,JSON.stringify(v)); await b.close();
