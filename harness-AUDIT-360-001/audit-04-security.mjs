import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Helpers
function findFiles(dir, exts) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.agents', '.tmp', 'harness-AUDIT-360-001', 'scratch', 'tests', 'docs', 'dist'].includes(entry.name)) continue;
      results = results.concat(findFiles(full, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

const liquidFiles = findFiles(ROOT, ['.liquid']);
const jsFiles = findFiles(path.join(ROOT, 'assets'), ['.js']);

const findings = {
  raw_filter_usage: [],
  unescaped_search_terms: [],
  unescaped_cart_note_properties: [],
  unescaped_metafields: [],
  inline_event_handlers: [],
  script_tag_json_raw: [],
  external_urls_dependencies: [],
  open_redirect_patterns: [],
  sensitive_data_exposure: []
};

// 1. Scan Liquid
for (const file of liquidFiles) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // Check raw filter
    if (line.includes('| raw')) {
      findings.raw_filter_usage.push({
        file: rel,
        line: lineNum,
        code: line.trim()
      });
    }

    // Check search.terms output
    if (line.includes('search.terms') && !line.includes('escape') && !line.includes('json') && !line.includes('url_encode')) {
      if (line.includes('{{') && line.includes('search.terms')) {
        findings.unescaped_search_terms.push({
          file: rel,
          line: lineNum,
          code: line.trim()
        });
      }
    }

    // Check cart.note and line_item properties
    if (line.includes('cart.note') && line.includes('{{') && !line.includes('escape') && !line.includes('json')) {
      findings.unescaped_cart_note_properties.push({
        file: rel,
        line: lineNum,
        type: 'cart.note',
        code: line.trim()
      });
    }
    if ((line.includes('.properties') || line.includes('property.first') || line.includes('property.last')) && line.includes('{{') && !line.includes('escape') && !line.includes('json')) {
      findings.unescaped_cart_note_properties.push({
        file: rel,
        line: lineNum,
        type: 'line_item.properties',
        code: line.trim()
      });
    }

    // Inline JS handlers (onclick, onload, onerror, etc.)
    const inlineMatch = line.match(/\son[a-z]+\s*=\s*["'][^"']+["']/i);
    if (inlineMatch && !line.includes('<!--')) {
      findings.inline_event_handlers.push({
        file: rel,
        line: lineNum,
        match: inlineMatch[0],
        code: line.trim()
      });
    }

    // JSON inside <script>
    if (line.includes('<script') && line.includes('json')) {
      // Check if raw or safe
    }

    // External dependencies / CDN links in liquid
    const cdnMatch = line.match(/https?:\/\/(?!schema\.org)[^\s"'>]+/i);
    if (cdnMatch && !line.includes('shopify.com') && !line.includes('w3.org') && !line.includes('xmlns') && !line.includes('ruizdigital.com')) {
      findings.external_urls_dependencies.push({
        file: rel,
        line: lineNum,
        url: cdnMatch[0],
        code: line.trim()
      });
    }
  });
}

// 2. Scan JS assets for open redirects or unescaped innerHTML
for (const file of jsFiles) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // innerHTML with unescaped variables
    if (line.includes('.innerHTML =') || line.includes('.innerHTML+=')) {
      if (line.includes('${') && !line.includes('escapeHtml') && !line.includes('encodeURIComponent')) {
        // potential innerHTML injection
      }
    }

    // window.location assignments (open redirect?)
    if (line.includes('window.location') || line.includes('location.href =')) {
      findings.open_redirect_patterns.push({
        file: rel,
        line: lineNum,
        code: line.trim()
      });
    }

    // External fetch or CDN
    const cdnMatch = line.match(/https?:\/\/[^\s"'>`]+/i);
    if (cdnMatch && !cdnMatch[0].includes('shopify.com')) {
      findings.external_urls_dependencies.push({
        file: rel,
        line: lineNum,
        url: cdnMatch[0],
        code: line.trim()
      });
    }
  });
}

fs.writeFileSync(path.join(ROOT, 'harness-AUDIT-360-001', 'report-04-security.json'), JSON.stringify(findings, null, 2), 'utf8');
console.log('Security audit finished. Findings summary:');
for (const [k, v] of Object.entries(findings)) {
  console.log(`- ${k}: ${v.length}`);
}
