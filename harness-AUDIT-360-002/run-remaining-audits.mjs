import { spawn } from 'child_process';
import path from 'path';

const SCRIPTS = [
  'harness-AUDIT-360-002/audit-06-contrast-real.mjs',
  'harness-AUDIT-360-002/audit-15-browsers-env.mjs',
  'harness-AUDIT-360-002/audit-16-html-nu.mjs',
  'harness-AUDIT-360-002/audit-17-data-hostile.mjs'
];

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n========================================`);
    console.log(`STARTING: ${scriptPath}`);
    console.log(`========================================\n`);

    const p = spawn('node', [scriptPath], { stdio: 'inherit' });
    p.on('close', code => {
      if (code === 0) {
        console.log(`SUCCESS: ${scriptPath}`);
        resolve();
      } else {
        console.error(`FAILED with exit code ${code}: ${scriptPath}`);
        resolve(); // Continue with next script even if one fails
      }
    });
    p.on('error', err => {
      console.error(`ERROR launching ${scriptPath}:`, err);
      resolve();
    });
  });
}

async function main() {
  for (const s of SCRIPTS) {
    await runScript(s);
  }
  console.log('\nAll audit scripts finished!\n');
}

main().catch(console.error);
