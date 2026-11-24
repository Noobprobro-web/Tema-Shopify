import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out,cartCall,watch} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo] of [['d',DESK],['m',MOB]]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); const w=watch(p); await nav(p,'/products/serra-coat'); await sleep(1500);
 await p.locator('form[action*="/cart/add"] [data-add-to-cart]').first().click(); await sleep(3500);
 R[vn+'-open']=await p.evaluate(()=>({open:document.querySelector('cart-drawer')?.hasAttribute('data-open'),active:document.activeElement?.id||document.activeElement?.className?.slice?.(0,40),status:document.querySelector('[data-cart-status]')?.textContent.trim()}));
 // announce count
 await p.evaluate(()=>{window.__st=[];const s=document.querySelector('[data-cart-status]');new MutationObserver(()=>window.__st.push(s.textContent.trim())).observe(s,{childList:true,characterData:true,subtree:true});});
 await sleep(1000);
 await p.locator('#DrawerQuantity-1').fill('2'); await p.locator('#DrawerQuantity-1').press('Tab'); await sleep(3500);
 R[vn+'-qty']=await p.evaluate(()=>({text:document.querySelector('[data-cart-status]')?.textContent.trim(),mutations:window.__st,val:document.querySelector('#DrawerQuantity-1')?.value}));
 await sleep(2500);
 // focus on checkout then repaint through a change event
 await p.evaluate(()=>document.querySelector('cart-drawer [data-focus-key=checkout]')?.focus());
 const before=await p.evaluate(()=>document.activeElement?.dataset?.focusKey);
 await p.evaluate(()=>{const i=document.querySelector('#DrawerQuantity-1');i.value='3';i.dispatchEvent(new Event('change',{bubbles:true}));});
 await sleep(3500);
 R[vn+'-focus']=await p.evaluate(()=>({after:document.activeElement?.dataset?.focusKey||document.activeElement?.tagName+'#'+document.activeElement?.id,qty:document.querySelector('#DrawerQuantity-1')?.value}));
 R[vn+'-focus'].before=before;
 R[vn+'-dyn']=await p.evaluate(()=>({exists:!!document.querySelector('cart-drawer .cart__dynamic-checkout'),children:document.querySelector('cart-drawer .cart__dynamic-checkout')?.children.length,html:document.querySelector('cart-drawer .cart__dynamic-checkout')?.innerHTML.slice(0,200)}));
 await shot(p,vn+'-drawer-open');
 // close drawer, go to /cart
 await nav(p,'/cart'); await sleep(1000);
 await p.locator('#CartNote').fill('gift please'); // unsent
 await p.locator('.site-header__cart').click(); await sleep(2500);
 R[vn+'-cartpage-open']=await p.evaluate(()=>({drawerOpen:document.querySelector('cart-drawer')?.hasAttribute('data-open'),url:location.pathname,note:document.querySelector('#CartNote')?.value}));
 // change in drawer, check page retains note
 await sleep(2500);
 if(R[vn+'-cartpage-open'].drawerOpen){ await p.locator('#DrawerQuantity-1').fill('2'); await p.locator('#DrawerQuantity-1').press('Tab'); await sleep(3500);
  R[vn+'-cartpage-after-drawer']=await p.evaluate(()=>({note:document.querySelector('#CartNote')?.value,pageQty:document.querySelector('#CartQuantity-1')?.value}));
  await p.keyboard.press('Escape'); await sleep(800);}
 // qty 0 on /cart
 await sleep(2000);
 await p.locator('#CartQuantity-1').fill('0'); await p.locator('#CartQuantity-1').press('Tab'); await sleep(4000);
 R[vn+'-cart-zero']=await p.evaluate(()=>({lines:document.querySelectorAll('[data-cart-item-key]').length,text:document.querySelector('main')?.innerText.replace(/\n+/g,' | ').slice(0,200)}));
 await shot(p,vn+'-cart-zero');
 R[vn+'-errs']=[...new Set(w.pageerrors)].filter(x=>!/Failed to fetch/.test(x)); R[vn+'-console']=[...new Set(w.console)].filter(x=>!/TUNNEL|bugsnag|Failed to fetch|otlp|Suppressed/.test(x)).slice(0,6);
 await ctx.close();
}
out('drawer1',R); console.log(JSON.stringify(R,null,1)); await b.close();
