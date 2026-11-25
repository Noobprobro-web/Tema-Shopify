import {chromium,MOB,newCtx,nav,shot,sleep} from './lib2.mjs';
const b=await chromium.launch(); const ctx=await newCtx(b,{...MOB,javaScriptEnabled:false}); const p=await ctx.newPage();
await nav(p,'/products/serra-coat?variant=68442277151024');
console.log(await p.evaluate(()=>[...document.querySelectorAll('select[name=id] option')].filter(o=>/sold|M/i.test(o.textContent)).map(o=>o.textContent.trim()+' disabled='+o.disabled+' sel='+o.selected)));
await p.locator('button.no-js-only[name=add]').click(); await p.waitForLoadState('load'); await sleep(800);
console.log(p.url().replace(/preview_theme_id=\d+/,'p'),await p.title()); console.log((await p.locator('body').innerText()).replace(/\n+/g,' | ').slice(0,300));
await shot(p,'nojs-soldout-submit');
await b.close();
