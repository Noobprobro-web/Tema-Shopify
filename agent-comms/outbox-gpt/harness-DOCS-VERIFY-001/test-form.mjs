import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root = new URL('./', import.meta.url);
const source = fs.readFileSync(new URL('fixed/support.html', root), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
for (const mode of ['success', 'http-error', 'network-error', 'timeout']) {
  let submit, resolve, reject, timer, calls = 0, resets = 0;
  const attrs = {}, status = {setAttribute(k,v){attrs[k]=v;},textContent:''}, button={disabled:false};
  const form={action:'https://formspree.io/f/xyezvvjo',querySelector(s){return s.includes('status')?status:button;},addEventListener(_,fn){submit=fn;},reset(){resets++;}};
  const fetch=(_,options)=>{calls++; assert.equal(options.headers.Accept,'application/json'); return new Promise((a,b)=>{resolve=a; reject=b; options.signal.addEventListener('abort',()=>b(new Error('aborted')));});};
  vm.runInNewContext(source,{document:{querySelector:()=>form},window:{fetch,FormData:class{},AbortController},fetch,FormData:class{},AbortController,setTimeout(fn,ms){assert.equal(ms,30000);timer=fn;return 1;},clearTimeout(){timer=null;}});
  submit({preventDefault(){}}); submit({preventDefault(){}});
  assert.equal(calls,1); assert.equal(button.disabled,true); assert.equal(attrs['data-state'],'pending');
  if(mode==='success') resolve({ok:true});
  if(mode==='http-error') resolve({ok:false});
  if(mode==='network-error') reject(new Error('offline'));
  if(mode==='timeout') timer();
  await new Promise(setImmediate);
  assert.equal(button.disabled,false); assert.equal(timer,null);
  assert.equal(attrs['data-state'],mode==='success'?'success':'error');
  assert.equal(resets,mode==='success'?1:0);
  console.log(`PASS ${mode}: one request, button recovers, ${resets?'reset':'input preserved'}`);
}
const {spawnSync}=await import('node:child_process');
const patches=[];
for(const file of ['docs.html','support.html']){
 const result=spawnSync('git',['diff','--no-index','--','original/'+file,'fixed/'+file],{encoding:'utf8',cwd:fileURLToPath(root)});
 assert.equal(result.status,1);
 assert.ok(result.stdout.includes('diff --git'));
 patches.push(result.stdout.replaceAll('a/original/','a/').replaceAll('b/fixed/','b/'));
}
fs.writeFileSync(new URL('sartorial-docs-fixes.diff',root),patches.join(''));
