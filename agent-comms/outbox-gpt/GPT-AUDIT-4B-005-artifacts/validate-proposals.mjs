import {cp,readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {createHash} from 'node:crypto';
const base='.tmp/gpt-audit-4b-005',root=process.cwd(),combined=base+'/proposals/combined';
if(!path.resolve(combined).startsWith(root+path.sep+'.tmp'+path.sep))throw new Error('Unsafe target');
await mkdir(combined,{recursive:true});
for(const dir of ['assets','config','layout','locales','sections','snippets','templates','listings'])await cp(dir,combined+'/'+dir,{recursive:true});
const manifest=JSON.parse(await readFile(base+'/proposals/manifest.json','utf8'));
for(const item of manifest){
 const result=spawnSync('git',['apply','--directory='+combined,'--',base+'/proposals/'+item.id+'.patch'],{encoding:'utf8'});
 if(result.status!==0)throw new Error(item.id+': '+result.stderr);
}
const syntax=spawnSync(process.execPath,['--check',combined+'/assets/theme.js'],{encoding:'utf8'});if(syntax.status!==0)throw new Error(syntax.stderr);
let jsonCount=0;
async function validate(dir){for(const e of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+e.name;if(e.isDirectory())await validate(file);else if(file.endsWith('.json')){JSON.parse(await readFile(file,'utf8'));jsonCount++;}else if(file.endsWith('.liquid')){const raw=await readFile(file,'utf8'),schema=raw.match(/{%[-]?\s*schema\s*[-]?%}([\s\S]*?){%[-]?\s*endschema\s*[-]?%}/);if(schema){JSON.parse(schema[1]);jsonCount++;}}}}
await validate(combined);
const hashes=JSON.parse(await readFile(base+'/baseline-hashes.json','utf8')),modified=[];
for(const [file,hash]of Object.entries(hashes))if(createHash('sha256').update(await readFile(file)).digest('hex')!==hash)modified.push(file);
const result={proposedPatches:manifest.length,combinedApply:'PASS in ignored copy only',nodeCheck:syntax.status,jsonAndSchemasParsed:jsonCount,productionFilesChangedSinceSnapshot:modified};
await writeFile(base+'/proposal-validation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
