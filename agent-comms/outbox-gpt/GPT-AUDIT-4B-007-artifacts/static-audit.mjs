import { readFile, readdir, writeFile } from 'node:fs/promises';
const locale = JSON.parse(await readFile('locales/en.default.schema.json','utf8'));
const urls=[];
const occurrences = new Map();
function inspect(value,file,source) {
  if(!value || typeof value!=='object')return;
  if(value.type==='url') {
    const info=value.info;
    const resolved=info?.startsWith('t:')?info.slice(2).split('.').reduce((o,k)=>o?.[k],locale):null;
    const needle=`"id": "${value.id}"`;
    const key=file+':'+value.id;
    const previous=occurrences.get(key)??-1;
    const index=source.indexOf(needle,previous+1);
    occurrences.set(key,index);
    urls.push({file,line:source.slice(0,index).split('\n').length,id:value.id,info,resolved,targetOfF09:info==='t:sections.all.link_destination_info',pass:typeof resolved==='string'});
  }
  for(const child of Object.values(value))inspect(child,file,source);
}
const config=await readFile('config/settings_schema.json','utf8');inspect(JSON.parse(config),'config/settings_schema.json',config);
for(const name of await readdir('sections')) {
  if(!name.endsWith('.liquid'))continue;
  const source=await readFile(`sections/${name}`,'utf8');
  const schema=source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if(schema)inspect(JSON.parse(schema[1]),`sections/${name}`,source);
}
const targeted=urls.filter(r=>r.targetOfF09).length;
const result={urlSettings:urls.length,targetedByF09:targeted,alreadyHadOtherInfo:urls.length-targeted,pass:targeted===10&&urls.every(r=>r.pass),urls};
await writeFile('.tmp/gpt-audit-4b-007/static-results.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
