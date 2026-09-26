import fs from 'fs';
import path from 'path';

const CWV_DIR = path.join(process.cwd(), 'harness-AUDIT-360-002', 'cwv');
const files = fs.readdirSync(CWV_DIR).filter(f => f.endsWith('.json'));

const records = [];
for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(CWV_DIR, file), 'utf8'));
  records.push(content);
}

// Group by theme, page, viewport
const groups = {};
for (const r of records) {
  const vp = r.viewport || (r.device === 'mobile' ? 'mobile' : 'desktop');
  const key = `${r.theme}_${r.page}_${vp}`;
  if (!groups[key]) groups[key] = [];
  groups[key].push(r);
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

const tableData = [];
for (const [key, runs] of Object.entries(groups)) {
  const [theme, page, device] = key.split('_');
  const lcps = runs.map(r => r.metrics ? r.metrics.lcp_ms : (r.lcp || 0));
  const clss = runs.map(r => r.metrics ? r.metrics.cls : (r.cls || 0));
  const fpts = runs.map(r => r.metrics ? r.metrics.fcp_ms : (r.fcp || 0));
  const ttfbs = runs.map(r => r.metrics ? r.metrics.ttfb_ms : 0);

  tableData.push({
    theme,
    page,
    device,
    runs_count: runs.length,
    runs_lcp_ms: lcps,
    median_lcp_ms: Math.round(median(lcps)),
    mean_lcp_ms: Math.round(mean(lcps)),
    runs_cls: clss,
    median_cls: parseFloat(median(clss).toFixed(4)),
    mean_cls: parseFloat(mean(clss).toFixed(4)),
    runs_fcp_ms: fpts,
    median_fcp_ms: Math.round(median(fpts)),
    mean_fcp_ms: Math.round(mean(fpts)),
    median_ttfb_ms: Math.round(median(ttfbs))
  });
}

// By theme and device summary
const themeDeviceSummary = {};
for (const row of tableData) {
  const tdKey = `${row.theme}_${row.device}`;
  if (!themeDeviceSummary[tdKey]) themeDeviceSummary[tdKey] = { lcp: [], cls: [], fcp: [] };
  themeDeviceSummary[tdKey].lcp.push(row.median_lcp_ms);
  themeDeviceSummary[tdKey].cls.push(row.median_cls);
  themeDeviceSummary[tdKey].fcp.push(row.median_fcp_ms);
}

const themeDeviceStats = {};
for (const [tdKey, metrics] of Object.entries(themeDeviceSummary)) {
  themeDeviceStats[tdKey] = {
    mean_lcp_ms: Math.round(mean(metrics.lcp)),
    mean_cls: parseFloat(mean(metrics.cls).toFixed(4)),
    mean_fcp_ms: Math.round(mean(metrics.fcp))
  };
}

const output = {
  total_runs: records.length,
  table: tableData,
  theme_device_summary: themeDeviceStats
};

fs.writeFileSync(path.join(process.cwd(), 'harness-AUDIT-360-002', 'cwv-72-aggregated.json'), JSON.stringify(output, null, 2), 'utf8');
console.log('Aggregated CWV data saved cleanly to harness-AUDIT-360-002/cwv-72-aggregated.json');
