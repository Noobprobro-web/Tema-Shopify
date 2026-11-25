import {chromium,DESK,MOB,newCtx,nav,out,shot,sleep} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/');
 const open=async()=>{await p.locator('[data-predictive-search-open]:visible').first().click(); await sleep(400);};
 const input=()=>p.locator('[data-predictive-search-panel] input[type=search], [data-predictive-search-panel] input[name=q]').first();
 const panelText=()=>p.evaluate(()=>{const r=document.querySelector('[data-predictive-search-panel] [data-predictive-search-results], [data-predictive-search-panel] [id^=predictive-search-results]');return r?r.innerText.replace(/\n+/g,' | ').slice(0,900):'(none)'});
 await open(); await input().fill('trench'); await sleep(1800);
 R[vn+'-trench']=await panelText();
 R[vn+'-trench-html']=await p.evaluate(()=>{const s=document.querySelectorAll('[data-predictive-search-panel] .predictive-search__price-row, [data-predictive-search-panel] [class*=price]');return [...s].slice(0,6).map(e=>e.outerHTML.slice(0,300))});
 await shot(p,vn+'-predictive-trench');
 await input().fill('fixture many'); await sleep(1800); R[vn+'-range']=await panelText();
 // slow network: delay suggest 3s, close during request and reopen
 let delay=true; await p.route('**/search/suggest.json*',async r=>{ if(delay) await sleep(3000); r.continue().catch(()=>{});});
 await input().fill('serra'); await sleep(500);
 const busyBefore=await p.evaluate(()=>document.querySelector('[data-predictive-search-panel] [aria-busy]')?.getAttribute('aria-busy'));
 await p.keyboard.press('Escape'); await sleep(300);
 const closed=await p.evaluate(()=>document.querySelector('[data-predictive-search-panel]').getAttribute('aria-hidden'));
 delay=false; await open(); await sleep(2500);
 R[vn+'-slow']={busyBefore,closed,afterReopen:await panelText(),busyAfter:await p.evaluate(()=>document.querySelector('[data-predictive-search-panel] [aria-busy]')?.getAttribute('aria-busy')),focus:await p.evaluate(()=>document.activeElement.tagName+'.'+document.activeElement.name)};
 await p.unroute('**/search/suggest.json*');
 // abort
 await p.route('**/search/suggest.json*',r=>r.abort());
 await input().fill('abortq'); await sleep(1500); R[vn+'-abort']=await panelText(); await shot(p,vn+'-predictive-error');
 await p.unroute('**/search/suggest.json*');
 // empty
 await input().fill('zzzqqq'); await sleep(1800); R[vn+'-empty']=await panelText();
 await ctx.close();
}
out('b5b',R); console.log(JSON.stringify(R,null,1)); await b.close();
