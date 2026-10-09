import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const repository='Noobprobro-web/sartorial-docs';
const expected='925b42c8540e9bb43ba998e55b4553f4ee44357a';
const output='agent-comms/outbox-gpt/harness-DOCS-VERIFY-001';
function api(endpoint,payload){
  const args=['api',`repos/${repository}/${endpoint}`];
  if(payload){const file=path.join(output,'publish-payload.json');fs.writeFileSync(file,JSON.stringify(payload));args.push('--method',endpoint.startsWith('git/refs/')?'PATCH':'POST','--input',file);}
  const result=spawnSync('gh',args,{encoding:'utf8'});
  if(result.status!==0)throw Error(result.stderr);
  return JSON.parse(result.stdout);
}
const branch=api('branches/main');
if(branch.commit.sha!==expected)throw Error('Remote head changed; stop and inspect');
const tree=api('git/trees',{base_tree:branch.commit.commit.tree.sha,tree:['docs.html','support.html'].map(file=>({path:file,mode:'100644',type:'blob',content:fs.readFileSync(`docs/merchant/${file}`,'utf8')}))});
const commit=api('git/commits',{message:'Sync merchant documentation: native CSS motion, mobile layout and support form recovery',tree:tree.sha,parents:[expected]});
const latest=api('branches/main');
if(latest.commit.sha!==expected)throw Error('Remote changed before publish; commit prepared only');
const ref=api('git/refs/heads/main',{sha:commit.sha,force:false});
const evidence={previous:expected,commit:commit.sha,url:`https://github.com/${repository}/commit/${commit.sha}`,tree:tree.sha,ref};
fs.writeFileSync(path.join(output,'publication-results.json'),JSON.stringify(evidence,null,2));
console.log(JSON.stringify(evidence,null,2));
