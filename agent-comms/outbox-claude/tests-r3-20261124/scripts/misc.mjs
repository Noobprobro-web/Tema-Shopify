import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out,cartCall} from './lib2.mjs';
const b=await chromium.launch(); const R={};
const small=(p,root)=>p.evaluate(root=>{const r=document.querySelector(root);if(!r)return null;return [...r.querySelectorAll('button,a[href],input:not([type=hidden]),select,summary,[role=button]')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0&&getComputedStyle(e).visibility!=='hidden'}).map(e=>{const b=e.getBoundingClientRect();return {el:e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+'.'+String(e.className).split(' ')[0],label:(e.getAttribute('aria-label')||e.textContent||e.name||'').trim().slice(0,28),w:Math.round(b.width),h:Math.round(b.height)}}).filter(x=>x.w<44||x.h<44)},root);
// mobile overlays
{ const ctx=await newCtx(b,MOB); const p=await ctx.newPage(); await nav(p,'/products/serra-coat',{settle:1200});
  await cartCall(p,'/cart/add.js',{id:68442276921648,quantity:1}); await sleep(2500);
  await nav(p,'/',{settle:1200});
  await p.locator('[data-predictive-search-open]:visible').first().click(); await sleep(500); R.touch_search=await small(p,'[data-predictive-search-panel]'); await shot(p,'m-search-open'); await p.keyboard.press('Escape'); await sleep(400);
  await p.locator('.site-header__cart').click(); await sleep(2500); R.touch_drawer=await small(p,'[data-cart-drawer-panel]'); await shot(p,'m-drawer-open'); await p.keyboard.press('Escape'); await sleep(400);
  // size guide
  await nav(p,'/products/leather-desk-mat',{settle:1200}); const sg=p.locator('button:has-text("size guide"), [data-size-guide-open], button[aria-controls*=size]').first(); R.sizeguide_trigger=await sg.count();
  if(R.sizeguide_trigger){ await sg.click(); await sleep(600); R.touch_sizeguide=await small(p,'dialog[open], [role=dialog]:not([aria-hidden=true])'); await shot(p,'m-sizeguide'); }
  await ctx.close(); }
// password modal
{ const ctx=await newCtx(b,MOB,false); const p=await ctx.newPage(); await nav(p,'/password',{settle:1200}); const op=p.locator('button:has-text("password"), [data-password-open], button[aria-haspopup=dialog]').first(); R.pw_trigger=await op.count(); if(R.pw_trigger){await op.click(); await sleep(600); R.touch_password=await small(p,'[role=dialog]:not([aria-hidden=true]), dialog[open]'); await shot(p,'m-password-modal');} await ctx.close(); }
out('misc',R); console.log(JSON.stringify(R,null,1).slice(0,5000)); await b.close();
