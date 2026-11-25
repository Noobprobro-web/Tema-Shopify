import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/collections/all',{settle:1500});
 if(vn==='m'){ await p.locator('.facets__disclosure-summary').first().click().catch(()=>{}); await sleep(400);} 
 else { const d=p.locator('details.facets__disclosure'); if(!(await d.evaluate(e=>e.open).catch(()=>true))) await p.locator('.facets__disclosure-summary').first().click(); }
 await p.evaluate(()=>document.querySelectorAll('.facets details').forEach(d=>d.open=true)); await sleep(300); const delay={on:true}; const reqs=[]; await p.route(/section_id|filter\.v|sort_by/,async r=>{reqs.push(r.request().url().replace(/^.*\/\/[^/]+/,'').slice(0,120)); if(delay.on) await sleep(3000); r.continue().catch(()=>{});});
 const cb=p.locator('input[name="filter.v.availability"][value="1"]').first();
 cb.check({force:true,noWaitAfter:true}).catch(()=>{}); await sleep(400);
 // move focus to the sort control during the request
 const sort=p.locator('select[name=sort_by], #SortBy, [name=sort_by]').first(); const hasSort=await sort.count();
 if(hasSort){ await sort.focus(); }
 await sleep(4500);
 R[vn+'-focus-moved']={hasSort,active:await p.evaluate(()=>document.activeElement?.name||document.activeElement?.tagName+'.'+document.activeElement?.className?.toString().slice(0,30)),url:p.url().replace(/^.*\/\/[^/]+/,''),cards:await p.locator('.product-card').count(),reqs:[...reqs]};
 // untouched focus returns
 reqs.length=0; await p.evaluate(()=>document.activeElement?.blur());
 const cb2=p.locator('input[name="filter.v.availability"][value="0"]').first(); await cb2.focus(); await p.keyboard.press('Space'); await sleep(4800);
 R[vn+'-focus-untouched']={active:await p.evaluate(()=>document.activeElement?.name||document.activeElement?.tagName),checked:await p.locator('input[name="filter.v.availability"][value="0"]').first().isChecked(),url:p.url().replace(/^.*\/\/[^/]+/,'')};
 delay.on=false; await p.unroute(/section_id|filter\.v|sort_by/);
 await p.evaluate(()=>document.querySelectorAll('.facets details').forEach(d=>d.open=true)); await sleep(300);
 const lte=p.locator('input[name="filter.v.price.lte"]').first(); await lte.fill('99999'); await lte.press('Tab'); await sleep(2500);
 R[vn+'-price-over']={lteVal:await lte.inputValue(),url:p.url().replace(/^.*\/\/[^/]+/,''),cards:await p.locator('.product-card').count()};
 const gte=p.locator('input[name="filter.v.price.gte"]').first(); await gte.fill('5000'); await gte.press('Tab'); await sleep(2500);
 R[vn+'-price-gte-over']={gteVal:await gte.inputValue(),lteVal:await p.locator('input[name="filter.v.price.lte"]').first().inputValue(),url:p.url().replace(/^.*\/\/[^/]+/,''),cards:await p.locator('.product-card').count(),empty:(await p.locator('main').innerText()).match(/no products|no results|nothing/i)?.[0]||null};
 await shot(p,vn+'-filters-price-over');
 await ctx.close();
}
out('filt1',R); console.log(JSON.stringify(R,null,1)); await b.close();
