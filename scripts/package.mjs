import { execSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const listingsDir = resolve(rootDir, 'listings');
const backupDir = resolve(rootDir, '.listings_tmp');

let renamed = false;

try {
  if (existsSync(listingsDir)) {
    renameSync(listingsDir, backupDir);
    renamed = true;
  }

  console.log('Running shopify theme package without listings/ directory...');
  execSync('npx shopify theme package', { stdio: 'inherit', cwd: rootDir });
  console.log('Package created successfully.');
} catch (error) {
  console.error('Packaging failed:', error);
  process.exitCode = 1;
} finally {
  if (renamed && existsSync(backupDir)) {
    renameSync(backupDir, listingsDir);
    console.log('Restored listings/ directory.');
  }
}
