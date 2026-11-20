import fs from 'fs';
const dir = process.argv[2] || 'raw';
const med = (a) => { a = a.filter(Number.isFinite).sort((x, y) => x - y); const n = a.length; return n ? (n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2) : NaN; };
const recs = fs.readdirSync(dir).filter((f) => /^[A-Za-z0-9]+-.*-\d+\.json$/.test(f) && !/run\.log/.test(f)).map((f) => JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8')));
const by = {}; for (const r of recs) (by[`${r.page}|${r.theme}`] ||= []).push(r);
const out = [];
for (const [k, v] of Object.entries(by).sort()) {
  const [page, theme] = k.split('|');
  const g = (grp) => med(v.map((r) => r.mainthread.find((x) => x.group === grp)?.duration ?? 0));
  const js = (r) => r.network.filter((x) => /\.js(\?|$)/.test(x.url) && /cdn\/shop\//.test(x.url)).reduce((t, x) => t + (x.transferSize || 0), 0);
  const css = (r) => r.network.filter((x) => /\.css(\?|$)/.test(x.url) && /cdn\/shop\//.test(x.url)).reduce((t, x) => t + (x.transferSize || 0), 0);
  const sd = (a) => { const m = a.reduce((s, x) => s + x, 0) / a.length; return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
  out.push({ page, theme, n: v.length, tbtMedian: Math.round(med(v.map((r) => r.tbtMs))), tbtMin: Math.round(Math.min(...v.map((r) => r.tbtMs))), tbtMax: Math.round(Math.max(...v.map((r) => r.tbtMs))), tbtSd: Math.round(sd(v.map((r) => r.tbtMs))), perfMedian: med(v.map((r) => r.performance)), scriptEval: Math.round(g('scriptEvaluation')), styleLayout: Math.round(g('styleLayout')), paintCompositeRender: Math.round(g('paintCompositeRender')), parseHTML: Math.round(g('parseHTML')), other: Math.round(g('other')), longTasksMedianCount: med(v.map((r) => r.longTasks.length)), longTasksMaxMs: Math.round(med(v.map((r) => Math.max(0, ...r.longTasks.map((x) => x.duration))))), themeJsBootupTotal: med(v.map((r) => r.themeJsBootup.total ?? NaN)), themeJsScripting: med(v.map((r) => r.themeJsBootup.scripting ?? NaN)), themeJsParse: med(v.map((r) => r.themeJsBootup.parse ?? NaN)), themeJsTransfer: med(v.map((r) => r.themeJsTransferSize)), docTransfer: med(v.map((r) => r.docTransferSize)), jsTransferTotal: med(v.map(js)), cssTransferTotal: med(v.map(css)) });
}
console.log(JSON.stringify(out, null, 1));
fs.writeFileSync(process.argv[3] || 'ab-summary.json', JSON.stringify(out, null, 1));
