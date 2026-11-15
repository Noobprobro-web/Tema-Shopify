import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const jsFiles = ['assets/theme.js', 'assets/product-zoom.js'];

const report = {
  custom_elements: [],
  window_document_listeners: [],
  fetch_calls: [],
  inner_html_usages: [],
  console_statements: [],
  storage_usages: [],
  unhandled_promises: [],
  editor_events: []
};

for (const relFile of jsFiles) {
  const fullPath = path.join(ROOT, relFile);
  const code = fs.readFileSync(fullPath, 'utf8');
  const lines = code.split('\n');

  // Track class definitions and custom elements
  const ceMatches = code.matchAll(/customElements\.define\(\s*['"]([a-zA-Z0-9-]+)['"]\s*,\s*([a-zA-Z0-9_]+)\)/g);
  for (const m of ceMatches) {
    report.custom_elements.push({
      file: relFile,
      tag: m[1],
      className: m[2]
    });
  }

  // Scan line by line
  let inClass = null;
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Check class declaration
    const classMatch = line.match(/class\s+([a-zA-Z0-9_]+)\s+extends\s+([a-zA-Z0-9_.]+)/);
    if (classMatch) {
      inClass = classMatch[1];
    }

    // 1. Check addEventListener on window or document
    if (line.includes('window.addEventListener') || line.includes('document.addEventListener')) {
      report.window_document_listeners.push({
        file: relFile,
        line: lineNum,
        class: inClass,
        code: trimmed
      });
    }

    // 2. Check fetch calls
    if (line.includes('fetch(') || line.includes('fetch (') || line.includes('window.fetch(')) {
      // Look ahead 10 lines for catch or res.ok
      const lookahead = lines.slice(idx, idx + 15).join('\n');
      const hasCatch = lookahead.includes('catch') || lookahead.includes('try');
      const checksOk = lookahead.includes('.ok') || lookahead.includes('status === 200');
      report.fetch_calls.push({
        file: relFile,
        line: lineNum,
        hasCatch,
        checksOk,
        code: trimmed
      });
    }

    // 3. Check innerHTML
    if (line.includes('.innerHTML') || line.includes('.outerHTML') || line.includes('.insertAdjacentHTML')) {
      const hasTemplateLiteral = line.includes('`') || line.includes('${');
      report.inner_html_usages.push({
        file: relFile,
        line: lineNum,
        hasTemplateLiteral,
        code: trimmed
      });
    }

    // 4. Check console statements
    if (line.match(/console\.(log|warn|error|info|debug)\s*\(/)) {
      report.console_statements.push({
        file: relFile,
        line: lineNum,
        code: trimmed
      });
    }

    // 5. Check localStorage / sessionStorage
    if (line.includes('localStorage') || line.includes('sessionStorage')) {
      report.storage_usages.push({
        file: relFile,
        line: lineNum,
        code: trimmed
      });
    }

    // 6. Check shopify editor events
    if (line.includes('shopify:section:') || line.includes('shopify:block:')) {
      report.editor_events.push({
        file: relFile,
        line: lineNum,
        code: trimmed
      });
    }
  });
}

// Check custom elements disconnectedCallback
for (const ce of report.custom_elements) {
  const code = fs.readFileSync(path.join(ROOT, ce.file), 'utf8');
  // Find class body
  const classRegex = new RegExp(`class\\s+${ce.className}\\s+extends[\\s\\S]*?}\\s*(?:customElements|class|$)`);
  const match = code.match(classRegex);
  if (match) {
    ce.hasConnectedCallback = match[0].includes('connectedCallback');
    ce.hasDisconnectedCallback = match[0].includes('disconnectedCallback');
  }
}

fs.writeFileSync(path.join(ROOT, 'harness-AUDIT-360-001', 'deep-js-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('--- DEEP JS AUDIT RESULTS ---');
console.log(`- Custom Elements defined: ${report.custom_elements.length}`);
for (const ce of report.custom_elements) {
  console.log(`  * <${ce.tag}> (${ce.className}): connectedCallback=${ce.hasConnectedCallback}, disconnectedCallback=${ce.hasDisconnectedCallback}`);
}
console.log(`- Window/Document listeners: ${report.window_document_listeners.length}`);
console.log(`- Fetch calls: ${report.fetch_calls.length}`);
console.log(`- innerHTML usages: ${report.inner_html_usages.length}`);
console.log(`- Console statements: ${report.console_statements.length}`);
console.log(`- Storage usages: ${report.storage_usages.length}`);
console.log(`- Theme editor event hooks: ${report.editor_events.length}`);
