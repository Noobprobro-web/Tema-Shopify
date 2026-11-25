import {chromium,DESK,newCtx,nav,out,sleep,TID} from './lib2.mjs';
import fs from 'fs';
const prods=JSON.parse(fs.readFileSync('inv/_products.json')).products.map(p=>p.handle);
const b=await chromium.launch(); const ctx=await newCtx(b,DESK); const p=await ctx.newPage(); await nav(p,'/');
const R={};
for (const h of prods){
 R[h]=await p.evaluate(async (h)=>{const r=await fetch(`/products/${h}`,{headers:{Accept:'text/html'}});const t=await r.text();const d=new DOMParser().parseFromString(t,'text/html');
  const vj=d.querySelector('[data-variant-json]');let v=[];try{v=JSON.parse(vj.textContent)}catch{}
  return {s:r.status,nv:v.length,qmin:[...new Set(v.map(x=>x.quantity_min))],qinc:[...new Set(v.map(x=>x.quantity_increment))],qmax:[...new Set(v.map(x=>x.quantity_max))],plan:v.some(x=>x.requires_selling_plan),sp:!!d.querySelector('[name=selling_plan],[data-selling-plan]'),qrule:!!d.querySelector('.quantity-rule,[data-quantity-rule]'),sizeguide:/size[- ]guide/i.test(t),pickup:!!d.querySelector('[data-pickup],.pickup-availability,pickup-availability'),video:/<video|data-media-type="(video|external_video)"/.test(t),model:/model-viewer|data-media-type="model"/.test(t)}},h);
 await sleep(900);
}
out('scan',R); for(const [h,v] of Object.entries(R)) if(v.qmin.some(x=>x!=1)||v.qinc.some(x=>x!=1)||v.qmax.some(x=>x!=null)||v.plan||v.sp||v.qrule||v.pickup||v.video||v.model||v.sizeguide) console.log(h,JSON.stringify(v));
await b.close();
