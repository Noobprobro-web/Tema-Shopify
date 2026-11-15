import fs from 'fs';
import path from 'path';

const pwdMatch = fs.readFileSync('scratch/test-ps-axe-live.mjs', 'utf8').match(/fill\([^,]+,\s*['"]([^'"]+)['"]\)/);
const pwd = pwdMatch ? pwdMatch[1] : '';

function checkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(full);
    } else {
      const content = fs.readFileSync(full, 'utf8');
      if (pwd && content.includes(pwd)) {
        console.error('VIOLATION: Found password in', full);
        process.exit(1);
      }
    }
  }
}

checkDir('harness-AUDIT-360-001');
checkDir('.agents/teamwork/audit360');

const reportContent = fs.readFileSync('agent-comms/outbox-gemini/GEMINI-REPORT-AUDIT-360-001.md', 'utf8');
if (pwd && reportContent.includes(pwd)) {
  console.error('VIOLATION: Found password in GEMINI-REPORT-AUDIT-360-001.md');
  process.exit(1);
}

const boardContent = fs.readFileSync('agent-comms/BOARD.md', 'utf8');
if (pwd && boardContent.includes(pwd)) {
  console.error('VIOLATION: Found password in BOARD.md');
  process.exit(1);
}

console.log('CLEAN: No password found in any files created or modified in this task!');
