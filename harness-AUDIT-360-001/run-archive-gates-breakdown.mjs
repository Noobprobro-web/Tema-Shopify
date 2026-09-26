import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const repoRoot = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit360-breakdown-'));

console.log(`Extracting git archive HEAD to ${tempDir}...`);
execSync(`git archive HEAD | tar -x -C "${tempDir}"`, { cwd: repoRoot, stdio: 'inherit' });

const nmSource = path.join(repoRoot, 'node_modules');
const nmDest = path.join(tempDir, 'node_modules');

try {
  fs.symlinkSync(nmSource, nmDest, 'junction');
} catch (e) {
  execSync(`mklink /J "${nmDest}" "${nmSource}"`, { shell: 'cmd.exe', stdio: 'inherit' });
}

const gates = [
  'npm run gates:json',
  'npm run gates:hooks',
  'npm run gates:sanity',
  'npm run gates:locales',
  'npm run gates:ledger',
  'npm run gates:theme-check',
  'npm run gates:syntax',
  'npm run gates:package'
];

const results = {};

for (const gate of gates) {
  try {
    const out = execSync(gate, { cwd: tempDir, encoding: 'utf8', stdio: 'pipe' });
    results[gate] = { status: 'PASS', output: out.trim() };
  } catch (err) {
    results[gate] = {
      status: 'FAIL',
      output: ((err.stdout || '') + '\n' + (err.stderr || '')).trim()
    };
  }
}

fs.writeFileSync(
  path.join(repoRoot, 'harness-AUDIT-360-001', 'gates-breakdown.json'),
  JSON.stringify(results, null, 2)
);

console.log('--- GATES BREAKDOWN RESULTS ---');
for (const [k, v] of Object.entries(results)) {
  console.log(`${k}: ${v.status}`);
}

try {
  fs.rmSync(nmDest, { recursive: false, force: true });
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (e) {}
