import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out,watch,bad} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); const w=watch(p);
 const s=await nav(p,'/pages/faq?view=g5a',{settle:2500}); R[vn+'-status']=s; R[vn+'-bad']=await bad(p);
 // scroll through to trigger lazy
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0)}); await sleep(1500);
 R[vn+'-sections']=await p.evaluate(()=>[...document.querySelectorAll('main .shopify-section')].map(s=>{const id=s.id;const h=s.querySelector('h1,h2,h3')?.textContent.trim().slice(0,40);const cards=s.querySelectorAll('.product-card,.collection-card,[class*=collection-card]').length;const grid=s.querySelector('[class*=grid],[class*=list]');
  const imgs=[...s.querySelectorAll('img')].filter(i=>i.getBoundingClientRect().width>0).slice(0,6).map(i=>({w:Math.round(i.getBoundingClientRect().width),cur:i.currentSrc.replace(/^.*\/files\//,'').replace(/.*width=/,'w=').slice(0,40),curW:i.naturalWidth,sizes:i.sizes?.slice(0,60)}));
  return {id:id.slice(-24),h,cards,cols:grid?getComputedStyle(grid).gridTemplateColumns.split(' ').length:null,boxW:Math.round(s.getBoundingClientRect().width),imgs:imgs.slice(0,3),thumbs:s.querySelectorAll('[class*=thumb]').length,media:s.querySelectorAll('[data-media-id]').length}}));
 R[vn+'-errs']=[...new Set(w.pageerrors)].filter(x=>!/Failed to fetch/.test(x));
 await shot(p,vn+'-g5a',{fullPage:true});
 const s2=await nav(p,'/pages/faq?view=g5b',{settle:2000}); R[vn+'-g5b-status']=s2;
 await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0)}); await sleep(1200);
 R[vn+'-bento']=await p.evaluate(()=>[...document.querySelectorAll('.bento-discovery,[class*=bento]')].filter(e=>e.matches('section,.shopify-section,.bento-discovery')).slice(0,6).map(s=>({id:s.id?.slice(-10),blocks:s.querySelectorAll('.bento-discovery__card,[class*=bento__card],[class*=bento-card],article').length,w:Math.round(s.getBoundingClientRect().width),h:Math.round(s.getBoundingClientRect().height)})));
 await shot(p,vn+'-g5b',{fullPage:true});
 await ctx.close();
}
out('g5',R); console.log(JSON.stringify(R,null,1).slice(0,6000)); await b.close();
