import fs from 'fs';
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const c = {};
for (const ch of j.checks || []) { c[ch.result] = (c[ch.result] || 0) + 1; }
console.log(j.mode, j.scopeResult, j.executionResult, JSON.stringify(c), 'themes', JSON.stringify(j.target?.themeIds), 'sessions', (j.sessions || []).length);
const bad = (j.checks || []).filter((x) => x.result === 'failed'); if (bad.length) console.log(JSON.stringify(bad.slice(0, 8)));
const nr = [...new Set((j.checks || []).filter((x) => x.result === 'not_run').map((x) => x.name))]; console.log('not_run', nr.join(','));
