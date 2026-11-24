import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const R={};
const ctx=await newCtx(b,{...MOB,javaScriptEnabled:false}); const p=await ctx.newPage();
await nav(p,'/products/serra-coat');
const info=()=>p.evaluate(()=>{const f=document.querySelector('form[action*="/cart/add"]');const btn=f?.querySelector('[type=submit]');
 return {url:location.search,variantLinks:[...document.querySelectorAll('variant-selects a[href*="variant="]')].length,radios:document.querySelectorAll('variant-selects input[type=radio]').length,noscriptLinks:[...document.querySelectorAll('noscript a,[class*=no-js] a')].length,selectName:f?.querySelector('select')?.name,idVal:f?.querySelector('[name=id]')?.value,btn:btn&&{text:btn.textContent.trim(),disabled:btn.disabled,visible:btn.getBoundingClientRect().height>0},nativeSubmitCount:f?.querySelectorAll('button[type=submit],input[type=submit]').length,html:document.querySelector('variant-selects')?.innerHTML.slice(0,0)}});
R.initial=await info(); await shot(p,'nojs-serra-initial');
await nav(p,'/products/serra-coat?variant=68442277151024'); R.soldout=await info(); await shot(p,'nojs-serra-soldout');
R.soldoutSelected=await p.evaluate(()=>[...document.querySelectorAll('variant-selects input:checked')].map(i=>i.value));
// option change without JS: does the page offer links/submit to navigate?
R.optionControls=await p.evaluate(()=>[...document.querySelectorAll('variant-selects label, variant-selects a')].slice(0,12).map(e=>e.tagName+':'+(e.getAttribute('href')||e.textContent.trim().slice(0,12))));
// submit available variant
await nav(p,'/products/serra-coat?variant=68442277183792');
const before=R.initial; 
await p.locator('form[action*="/cart/add"] [type=submit]').first().click(); await p.waitForLoadState('load'); await sleep(800);
R.afterSubmit={url:p.url().replace(/preview_theme_id=\d+/,'preview'),title:await p.title(),cartText:(await p.locator('main').innerText()).replace(/\n+/g,' | ').slice(0,300)};
await shot(p,'nojs-after-submit');
out('nojs',R); console.log(JSON.stringify(R,null,1)); await b.close();
