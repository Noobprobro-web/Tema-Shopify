import fs from 'fs';
import path from 'path';

const pwdMatch = fs.readFileSync('scratch/test-ps-axe-live.mjs', 'utf8').match(/fill\([^,]+,\s*['"]([^'"]+)['"]\)/);
const pwd = pwdMatch ? pwdMatch[1] : '';

function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(full);
    } else {
      const content = fs.readFileSync(full, 'utf8');
      if (pwd && content.includes(pwd)) {
        console.error('RULE 10 VIOLATION: Found storefront password in', full);
        process.exit(1);
      }
    }
  }
}

checkDir('harness-AUDIT-360-002');
checkDir('.agents/teamwork/audit360-002');

if (fs.existsSync('cobertura-360-002.csv')) {
  const c = fs.readFileSync('cobertura-360-002.csv', 'utf8');
  if (pwd && c.includes(pwd)) {
    console.error('RULE 10 VIOLATION: Found storefront password in cobertura-360-002.csv');
    process.exit(1);
  }
}

if (fs.existsSync('agent-comms/BOARD.md')) {
  const b = fs.readFileSync('agent-comms/BOARD.md', 'utf8');
  if (pwd && b.includes(pwd)) {
    console.error('RULE 10 VIOLATION: Found storefront password in BOARD.md');
    process.exit(1);
  }
}

console.log('RULE 10 VERIFIED: Zero plaintext passwords present in any audit 002 files.');
