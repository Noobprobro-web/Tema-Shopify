import fs from 'fs';
import path from 'path';

const REPO = process.cwd();

const themeJsPath = path.join(REPO, 'assets/theme.js');
const zoomJsPath = path.join(REPO, 'assets/product-zoom.js');

const report = {
  sectionEvents: [],
  fetchCalls: [],
  abortControllerUsages: [],
  customElements: [],
  globalListenersWithoutCleanup: [],
  noJsSupport: []
};

function analyzeJs(file, content) {
  const lines = content.split('\n');

  // Custom elements defined
  const ceMatches = content.matchAll(/class\s+(\w+)\s+extends\s+(?:HTMLElement|ThemeElement)\s*\{/g);
  for (const m of ceMatches) {
    const className = m[1];
    const hasConnected = content.includes(`${className}`) && /connectedCallback\s*\(/.test(content);
    const hasDisconnected = content.includes(`${className}`) && /disconnectedCallback\s*\(/.test(content);
    report.customElements.push({
      file,
      className,
      hasConnected,
      hasDisconnected
    });
  }

  // Section events
  lines.forEach((l, idx) => {
    if (l.includes('shopify:section:') || l.includes('shopify:block:')) {
      report.sectionEvents.push({ file, line: idx + 1, code: l.trim() });
    }
  });

  // Fetch calls
  lines.forEach((l, idx) => {
    if (l.includes('fetch(')) {
      const surrounding = lines.slice(Math.max(0, idx - 5), Math.min(lines.length, idx + 15)).join('\n');
      const hasCatch = surrounding.includes('.catch(') || surrounding.includes('catch (');
      const hasSignal = surrounding.includes('signal');
      report.fetchCalls.push({
        file,
        line: idx + 1,
        code: l.trim(),
        hasCatch,
        hasSignal
      });
    }
  });

  // AbortController
  lines.forEach((l, idx) => {
    if (l.includes('AbortController')) {
      report.abortControllerUsages.push({ file, line: idx + 1, code: l.trim() });
    }
  });
}

analyzeJs('assets/theme.js', fs.readFileSync(themeJsPath, 'utf8'));
analyzeJs('assets/product-zoom.js', fs.readFileSync(zoomJsPath, 'utf8'));

// Check noscript in Liquid files
function scanNoJs(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) scanNoJs(full);
    else if (item.name.endsWith('.liquid')) {
      const c = fs.readFileSync(full, 'utf8');
      if (c.includes('<noscript') || c.includes('no-js')) {
        report.noJsSupport.push(path.relative(REPO, full));
      }
    }
  }
}
scanNoJs(path.join(REPO, 'layout'));
scanNoJs(path.join(REPO, 'sections'));
scanNoJs(path.join(REPO, 'snippets'));

fs.writeFileSync(
  path.join(REPO, 'harness-AUDIT-360-001/report-03-javascript.json'),
  JSON.stringify(report, null, 2)
);

console.log('JS audit completed:');
console.log('Custom elements detected:', report.customElements.length);
console.log('Fetch calls total:', report.fetchCalls.length);
const unhandledFetch = report.fetchCalls.filter(f => !f.hasCatch);
console.log('Fetch calls without immediate catch:', unhandledFetch.length);
const unsignaledFetch = report.fetchCalls.filter(f => !f.hasSignal);
console.log('Fetch calls without signal/AbortController:', unsignaledFetch.length);
console.log('Section events detected:', report.sectionEvents);
