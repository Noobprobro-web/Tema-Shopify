import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const command=process.platform==='win32'?'npm.cmd':'npm';
const result=spawnSync(command,['run','gates:static'],{shell:process.platform==='win32',encoding:'utf8',maxBuffer:8*1024*1024});
await writeFile('.tmp/gpt-audit-4b-007/gates-static.log',`Command: ${command} run gates:static\nExit: ${result.status}\n${result.stdout}\n${result.stderr}`);
console.log(JSON.stringify({command:`${command} run gates:static`,exit:result.status,log:'.tmp/gpt-audit-4b-007/gates-static.log'}));
process.exitCode=result.status??1;
