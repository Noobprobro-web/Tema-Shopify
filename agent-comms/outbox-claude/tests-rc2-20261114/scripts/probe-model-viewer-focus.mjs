import { createRequire } from 'module';
const require = createRequire('/home/user/Tema-Shopify/');
const { chromium } = require('playwright');
const O='https://sartorial-theme-kvkzl39t.myshopify.com';
const b=await chromium.launch();
for (const [preset,id] of [['imprint','190316871984'],['sartorial','190316839216']]) {
const ctx=await b.newContext({viewport:{width:1280,height:800}});
await ctx.request.post(O+'/password',{form:{form_type:'storefront_password',utf8:'✓',password:process.env.STOREFRONT_PASSWORD},maxRedirects:0});
const p=await ctx.newPage();
await p.goto(`${O}/products/fixture-media-3d-video?preview_theme_id=${id}`,{waitUntil:'load'}); await p.waitForTimeout(2500);
const seen=[];
for(let i=0;i<40;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(120);
 const r=await p.evaluate(()=>{const e=document.activeElement; if(!e||e===document.body) return {body:true};
  const cs=getComputedStyle(e); const rc=e.getBoundingClientRect(); let inert=false,hid=false,op=1,anc=null; for(let n=e;n;n=n.parentElement){ if(n.inert) inert=true; const s=getComputedStyle(n); if(s.visibility==='hidden'||s.display==='none') hid=true; if(+s.opacity<0.05) {op=+s.opacity;anc=anc||n.tagName.toLowerCase()+'.'+n.className.toString().split(' ')[0];} }
  return {tag:e.tagName.toLowerCase(),cls:e.className.toString().slice(0,50),aria:e.getAttribute('aria-label'),w:Math.round(rc.width),h:Math.round(rc.height),inert,hid,op,anc,inShadow:!!e.shadowRoot};});
 if(r.body||r.inert||r.hid||r.op<0.05||r.w===0||r.h===0) seen.push([i,r]);
}
console.log(preset, JSON.stringify(seen).slice(0,1500));
await ctx.close();}
await b.close();
