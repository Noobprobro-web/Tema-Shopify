import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const repoRoot = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'audit360-gates-'));

console.log(`Extracting git archive HEAD to ${tempDir}...`);
execSync(`git archive HEAD | tar -x -C "${tempDir}"`, { cwd: repoRoot, stdio: 'inherit' });

// Copy or symlink node_modules and package.json if needed
console.log('Setting up node_modules link...');
const nmSource = path.join(repoRoot, 'node_modules');
const nmDest = path.join(tempDir, 'node_modules');

try {
  fs.symlinkSync(nmSource, nmDest, 'junction');
} catch (e) {
  console.log('Symlink junction failed, creating junction via cmd...');
  execSync(`mklink /J "${nmDest}" "${nmSource}"`, { shell: 'cmd.exe', stdio: 'inherit' });
}

console.log('Running npm run gates:static on archived HEAD...');
try {
  const output = execSync('npm run gates:static', {
    cwd: tempDir,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('gates:static passed successfully!');
  fs.writeFileSync(path.join(repoRoot, 'harness-AUDIT-360-001', 'gates-static-archive.log'), output);
  console.log(output);
} catch (err) {
  console.error('gates:static failed!');
  const output = (err.stdout || '') + '\n' + (err.stderr || '');
  fs.writeFileSync(path.join(repoRoot, 'harness-AUDIT-360-001', 'gates-static-archive.log'), output);
  console.error(output);
} finally {
  try {
    fs.rmSync(nmDest, { recursive: false, force: true });
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {
    console.error('Cleanup warning:', e.message);
  }
}
