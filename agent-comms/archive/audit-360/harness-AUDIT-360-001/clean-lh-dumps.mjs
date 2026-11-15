import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('harness-AUDIT-360-001/lh-port-result.json', 'utf8'));

const summary = {
  finalUrl: raw.finalUrl,
  fetchTime: raw.fetchTime,
  scores: {
    performance: Math.round(raw.categories.performance?.score * 100),
    accessibility: Math.round(raw.categories.accessibility?.score * 100)
  },
  metrics: {
    fcp: raw.audits['first-contentful-paint']?.displayValue,
    lcp: raw.audits['largest-contentful-paint']?.displayValue,
    cls: raw.audits['cumulative-layout-shift']?.displayValue,
    tbt: raw.audits['total-blocking-time']?.displayValue,
    speedIndex: raw.audits['speed-index']?.displayValue
  }
};

fs.writeFileSync('harness-AUDIT-360-001/lh-summary.json', JSON.stringify(summary, null, 2), 'utf8');
if (fs.existsSync('harness-AUDIT-360-001/lh-port-result.json')) fs.unlinkSync('harness-AUDIT-360-001/lh-port-result.json');
if (fs.existsSync('harness-AUDIT-360-001/lh-test-result.json')) fs.unlinkSync('harness-AUDIT-360-001/lh-test-result.json');
console.log('Clean summary written and raw dumps deleted.');
