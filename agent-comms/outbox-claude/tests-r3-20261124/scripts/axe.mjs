import {chromium,DESK,MOB,newCtx,nav,sleep,out,cartCall} from './lib2.mjs';
import fs from 'fs';
const src=fs.readFileSync('/home/user/Tema-Shopify/tests/vendor/axe.min.js','utf8');
const pages=[['home','/'],['collection','/collections/all'],['product','/products/serra-coat'],['product-doppio','/products/doppio-trench'],['cart','/cart'],['search','/search?q=coat'],['blog','/blogs/news'],['article','/blogs/news/welcome-to-the-demo-store'],['404','/nope-404'],['faq','/pages/faq'],['contact','/pages/contact'],['about','/pages/about'],['g5a-featured','/pages/faq?view=g5a'],['g5b-bento','/pages/faq?view=g5b'],['g5c-ctl-lookbook','/pages/faq?view=g5c'],['sizeguide-pdp','/products/serra-coat?view=g7']];
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/'); await cartCall(p,'/cart/add.js',{id:68442276921648,quantity:1}); await sleep(1500);
 for (const [n,u] of pages){
  await nav(p,u,{settle:1200});
  await p.evaluate(src); 
  const r=await p.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']},resultTypes:['violations']});return {v:window.axe.version,violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.slice(0,3).map(n=>n.target.join(' ').slice(0,90))}))}});
  R[`${vn}-${n}`]=r.violations; console.log(vn,n,r.violations.map(v=>v.id+'('+v.impact+'x'+v.nodes+')').join(', ')||'clean');
 }
 await ctx.close();
}
out('axe',R); await b.close();
