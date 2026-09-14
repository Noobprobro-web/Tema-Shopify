import { chromium } from '@playwright/test';
import { writeFile, readFile } from 'node:fs/promises';
const base='http://127.0.0.1:9292',output='.tmp/gpt-audit-4b-007';
const inventory=JSON.parse(await readFile(`${output}/inventory.json`,'utf8'));
const candidate=process.env.AUDIT_CANDIDATE?await readFile(process.env.AUDIT_CANDIDATE,'utf8'):null;
const id=inventory.products.find(p=>p.handle==='qa-16-single-char').variants[0].id;
const browser=await chromium.launch({channel:'chromium',headless:true});
const results=[];
async function json(context,path,data){const r=data===undefined?await context.request.get(base+path):await context.request.post(base+path,{data});if(!r.ok())throw new Error(`${path} ${r.status()}`);return r.json();}
async function go(page,path='/products/qa-09-price-varies'){await page.goto(base+path,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.ThemeCore?.initialized);}
async function open(page){const response=page.waitForResponse(r=>new URL(r.url()).searchParams.get('section_id')==='cart-drawer');await page.locator('.site-header__cart').click();await response;await page.waitForTimeout(150);}
async function run(name,fn){
  const context=await browser.newContext({viewport:{width:390,height:900}}),page=await context.newPage();page.setDefaultTimeout(12000);
  if(candidate)await page.route('**/assets/theme.js?*',route=>route.fulfill({contentType:'text/javascript',body:candidate}));
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  try{results.push({name,...await fn(context,page),pageErrors});}catch(error){results.push({name,harnessError:error.stack,pageErrors});}
  finally{await page.unrouteAll({behavior:'ignoreErrors'});await json(context,'/cart/update.js',{note:''}).catch(()=>{});await json(context,'/cart/clear.js',{}).catch(()=>{});await context.close();await writeFile(`${output}/edge-results${candidate?'-proposed':''}.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results.at(-1)));}
}
try{
  await run('rAF-announcement-disconnect',async(context,page)=>{
    await go(page);
    const result=await page.evaluate(()=>{
      const original=document.querySelector('announcement-bar');
      const copy=original.cloneNode(true);
      const item=copy.querySelector('[data-announcement-item]');item.parentElement.append(item.cloneNode(true));
      copy.dataset.singleAnnouncement='false';
      copy.querySelectorAll('button').forEach(b=>b.hidden=false);
      const native=requestAnimationFrame,frames=[];window.requestAnimationFrame=cb=>{frames.push(cb);return frames.length;};
      try{
        document.body.append(copy);
        const activeTimer=copy.timer!==null;
        copy.dispatchEvent(new FocusEvent('focusout',{bubbles:true}));
        copy.remove();
        frames.forEach(cb=>cb(performance.now()));
        return {fixture:'Clone of real Liquid announcement; second item for rotating branch',activeTimer,queuedFrames:frames.length,timerAfterRemoval:copy.timer,isConnected:copy.isConnected,pass:activeTimer&&frames.length===1&&copy.timer===null&&!copy.isConnected};
      }finally{window.requestAnimationFrame=native;copy.remove();}
    });
    return result;
  });
  await run('rAF-password-disconnect',async(context,page)=>{
    await go(page,'/password');
    return page.evaluate(()=>{
      const original=document.querySelector('password-modal'),copy=original.cloneNode(true);
      original.remove();
      const error=document.createElement('div');error.dataset.passwordError='';copy.querySelector('form.storefront-password-form').prepend(error);
      const native=requestAnimationFrame,frames=[];window.requestAnimationFrame=cb=>{frames.push(cb);return frames.length;};
      try{document.querySelector('main').append(copy);copy.remove();frames.forEach(cb=>cb(performance.now()));return {fixture:'Real password markup clone, synthetic error marker, delayed rAF',frames:frames.length,connected:copy.isConnected,open:copy.isOpen,bodyModal:document.body.hasAttribute('data-modal-open'),pass:frames.length===1&&!copy.isOpen&&!document.body.hasAttribute('data-modal-open')};}
      finally{window.requestAnimationFrame=native;copy.remove();}
    });
  });
  await run('closed-header-unmount-while-cart-open',async(context,page)=>{
    await json(context,'/cart/add.js',{items:[{id,quantity:1}]});await go(page);await open(page);
    return page.evaluate(()=>{
      const c=document.querySelector('cart-drawer'),n=document.querySelector('theme-drawer');
      const before={cartOpen:c.isOpen,menuOpen:n.hasAttribute('data-open'),bodyDrawer:document.body.hasAttribute('data-drawer-open'),overflow:getComputedStyle(document.body).overflow};
      n.remove();
      const after={cartOpen:c.isOpen,bodyDrawer:document.body.hasAttribute('data-drawer-open'),overflow:getComputedStyle(document.body).overflow};
      return {fixture:'Native disconnectedCallback via removal of closed menu; models Theme Editor section unload',before,after,pass:after.bodyDrawer};
    });
  });
  await run('network-disconnection-four-flows',async(context,page)=>{
    await json(context,'/cart/add.js',{items:[{id,quantity:1}]});
    const rows=[];
    for(const flow of ['addItem','addCrossSell','changeLine','addSelectedItems']){
      await go(page);
      if(flow==='addCrossSell'||flow==='changeLine')await open(page);
      const path=flow==='changeLine'?'**/cart/change.js':'**/cart/add.js';
      const handler=route=>route.abort('failed');await page.route(path,handler);
      if(flow==='addItem')await page.locator('variant-selects [data-add-to-cart]').first().click();
      if(flow==='addCrossSell')await page.locator('[data-cross-sell-add]').first().click();
      if(flow==='changeLine'){await page.locator('[data-cart-quantity]').fill('2');await page.locator('[data-cart-quantity]').press('Tab');}
      if(flow==='addSelectedItems')await page.locator('[data-complete-look-submit]').click();
      const selector=flow==='addItem'?'variant-selects [data-product-form-error]':flow==='addSelectedItems'?'[data-bundle-error]':'[data-cart-error]';
      await page.locator(selector).first().waitFor({state:'visible'});
      const message=await page.locator(selector).first().textContent();
      const expected=await page.locator(flow==='addSelectedItems'?'complete-the-look':'cart-drawer').getAttribute('data-error-message');
      rows.push({flow,message,expected,pass:message===expected});await page.unroute(path,handler);
    }
    return {pass:rows.every(r=>r.pass),rows};
  });
  await run('keyboard-native-menu-cart-and-loops',async(context,page)=>{
    await json(context,'/cart/add.js',{items:[{id,quantity:1}]});await go(page);
    await page.locator('theme-drawer').evaluate(e=>{const a=document.createElement('a');a.href='/cart';a.id='AuditMenuCart';a.textContent='Cart';e.panel.append(a);});
    await page.locator('[data-drawer-trigger]').click();await page.locator('#AuditMenuCart').click();
    await page.waitForTimeout(400);
    const initial=await page.evaluate(()=>({menu:document.querySelector('theme-drawer').hasAttribute('data-open'),cart:document.querySelector('cart-drawer').isOpen,inert:Boolean(document.querySelector('cart-drawer').panel.closest('[inert]'))}));
    const escaped=[];
    for(const key of [...Array(20).fill('Tab'),...Array(20).fill('Shift+Tab')]){await page.keyboard.press(key);const focused=await page.evaluate(()=>({tag:document.activeElement.tagName,inside:document.querySelector('cart-drawer').contains(document.activeElement)}));if(!focused.inside)escaped.push({key,...focused});}
    await page.keyboard.press('Escape');
    const returnToMenu=await page.locator('[data-drawer-trigger]').evaluate(e=>e===document.activeElement);
    return {pass:!initial.menu&&initial.cart&&!initial.inert&&escaped.length===0&&returnToMenu,initial,escaped,returnToMenu,scope:'Actual mouse/keyboard; fixture cart link added to merchant menu DOM'};
  });
  await run('hostile-catalog-smoke-mobile',async(context,page)=>{
    const rows=[];
    for(const path of ['/collections/all?filter.v.price.gte=999999999','/products/qa-16-single-char','/products/qa-06-many-variants','/products/qa-01-long-title','/products/qa-02-no-image','/products/qa-15-no-description']){
      await go(page,path);
      const row=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('main h1')].map(e=>e.textContent.trim()),variants:document.querySelector('variant-selects')?.variantData?.length,cart:!!document.querySelector('cart-drawer')}));
      rows.push({path,...row,pass:row.width===row.scrollWidth&&row.h1.length===1&&row.cart});
    }
    return {pass:rows.every(r=>r.pass),rows,limit:'Catalog has max 24 variants, 4 images, 124 title characters. No 50/250 variant or 10-image certification.'};
  });
  await run('PDP-featured-native-empty-quantity-submit',async(context,page)=>{
    await go(page);let adds=0;page.on('request',r=>{if(r.url().includes('/cart/add.js'))adds++;});const rows=[];
    for(const index of [0,1]){
      const v=page.locator('variant-selects').nth(index);await v.locator('[data-quantity-input]').fill('');
      await v.locator('[data-add-to-cart]').click();
      rows.push(await v.evaluate(e=>{const q=e.querySelector('[data-quantity-input]'),b=e.querySelector('[data-add-to-cart]');return {required:q.required,valid:q.checkValidity(),sameForm:q.form===b.form,noValidate:b.form.noValidate,value:q.value};}));
    }
    return {pass:adds===0&&rows.every(r=>r.required&&!r.valid&&r.sameForm&&!r.noValidate),adds,rows};
  });
}finally{await browser.close();console.log(JSON.stringify({checks:results.length,failed:results.filter(r=>r.pass===false).map(r=>r.name),harnessErrors:results.filter(r=>r.harnessError).map(r=>r.name)}));if(results.some(r=>r.pass===false||r.harnessError))process.exitCode=2;}
