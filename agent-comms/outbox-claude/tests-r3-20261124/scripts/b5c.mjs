import {chromium,DESK,newCtx,nav,out,sleep} from './lib2.mjs';
const b=await chromium.launch(); const ctx=await newCtx(b,DESK); const p=await ctx.newPage(); await nav(p,'/');
await p.locator('[data-predictive-search-open]:visible').first().click(); await sleep(400);
const inp=p.locator('[data-predictive-search-panel] input[name=q]').first();
const txt=()=>p.evaluate(()=>document.querySelector('[data-predictive-search-panel]').innerText.replace(/\n+/g,' | ')+' || live:'+[...document.querySelectorAll('[data-predictive-search-panel] [aria-live],[data-predictive-search-panel] [role=status]')].map(e=>e.textContent.trim()).join('/'));
await p.route('**/search/suggest.json*',r=>r.abort()); await inp.fill('abortq'); await sleep(1500); const e1=await txt();
await p.unroute('**/search/suggest.json*'); await inp.fill('abortqz'); await sleep(1500); const e2=await txt();
await inp.fill('zzzqqq'); await sleep(1800); const e3=await txt();
// reopen after failure retries
await p.route('**/search/suggest.json*',r=>r.abort()); await inp.fill('serra'); await sleep(1500);
await p.keyboard.press('Escape'); await sleep(300); await p.unroute('**/search/suggest.json*');
await p.locator('[data-predictive-search-open]:visible').first().click(); await sleep(2000); const e4=await txt();
const R={abort:e1,afterRecover:e2,empty:e3,reopenAfterFail:e4}; out('b5c',R); console.log(R); await b.close();
