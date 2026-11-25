import {chromium,DESK,MOB,newCtx,watch,nav,bad,shot,ident,out,SH} from './lib2.mjs';
import fs from 'fs'; fs.mkdirSync(SH,{recursive:true});
const pages=[['home','/'],['collection','/collections/all'],['product','/products/serra-coat'],['cart','/cart'],['search','/search?q=coat'],['search-empty','/search?q=zzzzqq'],['blog','/blogs/news'],['article','/blogs/news/welcome-to-the-demo-store'],['article-long','/blogs/news/long-title-article-test'],['404','/this-page-does-not-exist'],['collection-empty','/collections/empty-test'],['collection-single','/collections/single-product-test'],['list-collections','/collections'],['gift-card','/products/gift-card'],['product-3d','/products/fixture-media-3d-video'],['page-faq','/pages/faq'],['page-contact','/pages/contact'],['page-about','/pages/about'],['page-support','/pages/support'],['page-docs','/pages/documentation'],['policy','/policies/refund-policy']];
const b=await chromium.launch(); const res=[];
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
  const ctx=await newCtx(b,vo); const page=await ctx.newPage(); const w=watch(page);
  for (const [n,p] of pages){ w.console.length=w.pageerrors.length=w.failed.length=0;
    const s=await nav(page,p); const id=await ident(page); const bd=await bad(page);
    const key=`${vn}-${n}`; await shot(page,key,{fullPage:true}).catch(()=>{});
    const ov=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    const r={view:vn,page:n,path:p,status:s,theme:id.id+'/'+id.role,bad:bd,console:[...w.console],pageerrors:[...w.pageerrors],failed:w.failed.filter(f=>!/analytics|monorail|shop_events|trekkie|cdn\.shopify.*sentry|google|facebook/i.test(f)),overflowX:ov};
    res.push(r); console.log(key,s,id.role,bd.length?'BAD '+bd.join(';'):'ok',w.console.length?'C'+w.console.length:'',w.pageerrors.length?'PE'+w.pageerrors.length:'',ov>1?'OVF'+ov:'');
  }
  // password page, unauthenticated
  const c2=await newCtx(b,vo,false); const p2=await c2.newPage(); const w2=watch(p2);
  const s=await nav(p2,'/password'); const bd=await bad(p2); await shot(p2,`${vn}-password`,{fullPage:true});
  res.push({view:vn,page:'password',status:s,theme:JSON.stringify(await ident(p2)),bad:bd,console:w2.console,pageerrors:w2.pageerrors,failed:w2.failed}); console.log(vn,'password',s,bd);
  await ctx.close(); await c2.close();
}
out('b1',res); await b.close();
