import fs from 'fs';
const r=JSON.parse(fs.readFileSync(process.argv[2]));
console.log('#',r.mode,r.scopeResult,r.executionResult,'interv',JSON.stringify(r.interventionRequired));
const tot={};
for(const c of r.checks){
  const k=`${c.preset}`; tot[c.result]=(tot[c.result]||0)+1;
  const d=c.details||{};
  const where=`${c.preset}/${d.page||''}/${d.width||''}`;
  if(c.name==='axe_rule_summary'){
    const v=(d.violations||[]).map(x=>`${x.ruleId}:${x.nodeCount}(${x.impact})`).join(',');
    const i=(d.incomplete||[]).map(x=>`${x.ruleId}:${x.nodeCount}`).join(',');
    console.log('AXE',where,'viol=['+v+']','incomplete=['+i+']');
  } else if(c.result!=='passed') console.log(c.result.toUpperCase(),where,c.name,c.reason,JSON.stringify(d).slice(0,300));
}
console.log('totals',JSON.stringify(tot));
for(const s of r.sessions) console.log('session',s.preset,s.themeId,'routeFail',s.routeOperationFailed,'cartTouched',s.cartTouched,'cleanup',JSON.stringify(s.finalCartCleanup),'429s',s.rateLimitEvents.length,'closed',s.contextClosed);
