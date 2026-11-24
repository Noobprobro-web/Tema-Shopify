import {chromium,DESK,MOB,newCtx,nav,sleep,shot,out} from './lib2.mjs';
const b=await chromium.launch(); const R={};
for (const [vn,vo,vw] of [['m',MOB,'g5'],['m',MOB,'g6'],['m',MOB,'g7'],['d',DESK,'g7']]){
 const ctx=await newCtx(b,vo); const p=await ctx.newPage(); await nav(p,'/products/serra-coat?view='+vw,{settle:1500});
 const trig=p.locator('[data-size-guide-open]'); R[vn+vw+'-triggers']=await trig.count();
 for (let i=0;i<await trig.count();i++){
  await trig.nth(i).scrollIntoViewIfNeeded(); await trig.nth(i).click(); await sleep(700);
  const info=await p.evaluate(()=>{const o=[...document.querySelectorAll('[data-size-guide-overlay]')].find(x=>!x.hidden);const d=o?.querySelector('[role=dialog]');const tabs=[...(o?.querySelectorAll('[role=tab],button[aria-selected]')||[])].map(t=>t.textContent.trim());const small=[...(o?.querySelectorAll('button,a[href]')||[])].map(e=>{const b=e.getBoundingClientRect();return e.textContent.trim().slice(0,14)+':'+Math.round(b.width)+'x'+Math.round(b.height)});return {open:!!o,title:d?.getAttribute('aria-label')||d?.querySelector('h2')?.textContent.trim(),text:d?.innerText.replace(/\n+/g,' | ').slice(0,260),tabs,targets:small,active:document.activeElement?.tagName+':'+(document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent.trim().slice(0,14))}});
  R[`${vn}${vw}-guide${i}`]=info; if(i===0) await shot(p,vn+vw+'-sizeguide');
  // tap on backdrop (corner of overlay)
  const ov=p.locator('[data-size-guide-overlay]:not([hidden])'); const box=await ov.boundingBox();
  if(vn==='m'){ await p.touchscreen.tap(box.x+4,box.y+4); } else { await p.mouse.click(box.x+4,box.y+4); }
  await sleep(700);
  R[`${vn}${vw}-guide${i}-afterBackdrop`]=await p.evaluate(()=>({stillOpen:[...document.querySelectorAll('[data-size-guide-overlay]')].some(x=>!x.hidden),active:document.activeElement?.getAttribute('data-size-guide-open')!==null?'trigger':document.activeElement?.tagName}));
  if(R[`${vn}${vw}-guide${i}-afterBackdrop`].stillOpen){ await p.keyboard.press('Escape'); await sleep(500);} 
 }
 await ctx.close();
}
out('sg',R); console.log(JSON.stringify(R,null,1)); await b.close();
