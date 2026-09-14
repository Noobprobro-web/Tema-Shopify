import { spawnSync } from 'node:child_process';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory=path.dirname(fileURLToPath(import.meta.url));
const output='.tmp/gpt-audit-4b-007';
const combined=`${output}/proposals/combined`;
await mkdir(`${combined}/assets`,{recursive:true});
await copyFile('assets/theme.js',`${combined}/assets/theme.js`);
const results=[];
for(const id of ['R01','R02','R03','R04']){
  const patch=path.join(directory,'patches',`${id}.patch`);
  const check=spawnSync('git',['apply','--check','--whitespace=error',patch],{encoding:'utf8'});
  const apply=spawnSync('git',['apply',`--directory=${combined}`,patch],{encoding:'utf8'});
  results.push({id,applyCheck:check.status,applyToTemporaryCombined:apply.status,stderr:check.stderr+apply.stderr});
  if(check.status||apply.status)throw new Error(JSON.stringify(results.at(-1)));
}
const syntax=spawnSync(process.execPath,['--check',`${combined}/assets/theme.js`],{encoding:'utf8'});
const verification={results,combinedSyntax:syntax.status};
await writeFile(`${output}/combined-patch-validation.json`,JSON.stringify(verification,null,2));
console.log(JSON.stringify(verification));
if(syntax.status)throw new Error(syntax.stderr);
const env={...process.env,AUDIT_CANDIDATE:`${combined}/assets/theme.js`};
if(process.argv.includes('--validate-only'))process.exit(0);
for(const [name,args] of [['browser-audit.mjs',['F01-|F03-|F02-|F04-|F10-']],['edge-audit.mjs',[]]]){
  const child=spawnSync(process.execPath,[`${directory}/${name}`,...args],{env,stdio:'inherit'});
  console.log(JSON.stringify({candidateSuite:name,exitCode:child.status}));
  if(child.status)process.exitCode=1;
}
