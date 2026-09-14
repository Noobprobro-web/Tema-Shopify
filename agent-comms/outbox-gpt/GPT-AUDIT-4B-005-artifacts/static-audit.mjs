import {readFile,readdir,writeFile} from 'node:fs/promises';
const results={untranslated:[],missingInfo:[],defaults:[],presets:{}};
function walk(value,fn,keys=[]) { if(value&&typeof value==='object') {fn(value,keys);for(const [k,v]of Object.entries(value))walk(v,fn,[...keys,k]);} }
const files=['config/settings_schema.json',...(await readdir('sections')).filter(n=>n.endsWith('.liquid')).map(n=>'sections/'+n)];
for(const file of files) {
 const source=await readFile(file,'utf8');
 const match=file.endsWith('.liquid')?source.match(/{%[-]?\s*schema\s*[-]?%}([\s\S]*?){%[-]?\s*endschema\s*[-]?%}/):null;
 const schema=JSON.parse(match?match[1]:source);
 walk(schema,(v,keys)=>{
   const at=needle=>source.slice(0,source.indexOf(needle)).split('\n').length;
   if(v.type&&v.id&&['url','product','collection','page','blog','product_list','collection_list','metaobject','metaobject_list','link_list'].includes(v.type)&&!v.info)results.missingInfo.push({file,line:at('"id": "'+v.id+'"'),type:v.type,id:v.id});
   for(const key of ['label','info','content']) if(typeof v[key]==='string'&&!v[key].startsWith('t:'))results.untranslated.push({file,keys:[...keys,key],value:v[key]});
   if(typeof v.default==='string'&&!v.default.startsWith('t:')&&['url','link_list','page','product','collection'].includes(v.type)) results.defaults.push({file,type:v.type,id:v.id,value:v.default});
 });
}
const data=JSON.parse(await readFile('config/settings_data.json','utf8'));
results.themeInfo=JSON.parse(await readFile('config/settings_schema.json','utf8'))[0];
results.presetNames=Object.keys(data.presets);
for(const dir of await readdir('listings')){
 results.presets[dir]={};
 for(const file of await readdir('listings/'+dir+'/templates')){
  const t=JSON.parse(await readFile('listings/'+dir+'/templates/'+file,'utf8'));
  results.presets[dir][file]={order:t.order.map(id=>({id,...t.sections[id]})),topKeys:Object.keys(t)};
 }
}
await writeFile('.tmp/gpt-audit-4b-005/static-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
