import {chromium,DESK,newCtx,nav,sleep,shot} from './lib2.mjs';
const b=await chromium.launch(); 
for (const fc of ['none','active']){ const ctx=await newCtx(b,{...DESK,viewport:{width:1280,height:900},forcedColors:fc}); const p=await ctx.newPage(); await nav(p,'/collections/all',{settle:1200});
 console.log(fc,await p.evaluate(()=>{const e=document.querySelector('[data-grid-view]');return e?{html:e.outerHTML.slice(0,400),after:getComputedStyle(e,'::before').content+'|'+getComputedStyle(e,'::after').content+'|'+getComputedStyle(e,'::before').backgroundImage.slice(0,40)}:null}));
 const el=p.locator('[data-grid-view]').first(); if(await el.count()) await el.screenshot({path:`shots/gridbtn-${fc}.png`}); await ctx.close(); }
await b.close();
