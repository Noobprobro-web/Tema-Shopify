import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
// The archived entry point keeps all generated files in the original ignored directory.
const root = process.cwd();
await readFile(path.join(root, 'AGENTS.md'));
const here = path.join(root, '.tmp/gpt-audit-4b-005');
const snapshot = path.join(here, 'theme');
await mkdir(snapshot, { recursive: true });
const dirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'listings'];
const hashes = {};
async function inspect(dir) {
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const name = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await inspect(name);
    else hashes[name] = createHash('sha256').update(await readFile(path.join(root, name))).digest('hex');
  }
}
for (const dir of dirs) {
  await cp(path.join(root, dir), path.join(snapshot, dir), { recursive: true });
  await inspect(dir);
}
await writeFile(path.join(here, 'baseline-hashes.json'), JSON.stringify(hashes, null, 2));
console.log(JSON.stringify({ snapshot, files: Object.keys(hashes).length, themeJs: hashes['assets/theme.js'] }));
