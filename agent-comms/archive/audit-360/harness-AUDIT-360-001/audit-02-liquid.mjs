import fs from 'fs';
import path from 'path';

const REPO = process.cwd();

const sectionsDir = path.join(REPO, 'sections');
const snippetsDir = path.join(REPO, 'snippets');
const templatesDir = path.join(REPO, 'templates');
const layoutDir = path.join(REPO, 'layout');

const report = {
  sectionsWithCustomLiquid: [],
  sectionsWithAppBlock: [],
  sectionsWithPresets: [],
  designModeUsages: [],
  emptyStateChecks: [],
  missingImageChecks: [],
  paginationChecks: [],
  loopsWithoutLimits: [],
  filesChecked: 0
};

function scanLiquid(filePath) {
  const relPath = path.relative(REPO, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  report.filesChecked++;

  // 1. Check schema if section
  if (filePath.includes(path.sep + 'sections' + path.sep)) {
    const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    if (schemaMatch) {
      try {
        const schema = JSON.parse(schemaMatch[1]);
        if (schema.presets && schema.presets.length > 0) {
          report.sectionsWithPresets.push(relPath);
        }
        if (schema.blocks) {
          const hasApp = schema.blocks.some(b => b.type === '@app');
          const hasCustomLiquid = schema.blocks.some(b => b.type === 'custom_liquid');
          if (hasApp) report.sectionsWithAppBlock.push(relPath);
          if (hasCustomLiquid) report.sectionsWithCustomLiquid.push(relPath);
        }
      } catch (e) {
        // schema parse error (already checked by gates, but good to know)
      }
    }
  }

  // 2. Check design_mode
  if (content.includes('design_mode')) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('design_mode')) {
        report.designModeUsages.push({ file: relPath, line: idx + 1, code: line.trim() });
      }
    });
  }

  // 3. Loops without limits in liquid
  const forMatches = content.matchAll(/\{%-?\s*for\s+(\w+)\s+in\s+([^\s%]+)([\s\S]*?)%-?\}/g);
  for (const m of forMatches) {
    const [full, item, target, rest] = m;
    // If target is collection.products or search.results or blog.articles or items without limit or paginate
    if (['collection.products', 'collections', 'search.results', 'blog.articles'].includes(target)) {
      if (!rest.includes('limit:') && !content.includes('paginate')) {
        report.loopsWithoutLimits.push({ file: relPath, loop: full.trim() });
      }
    }
  }

  // 4. Missing image checks
  if (content.includes('placeholder_svg_tag')) {
    report.missingImageChecks.push(relPath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walkDir(full);
    else if (item.name.endsWith('.liquid')) scanLiquid(full);
  }
}

walkDir(sectionsDir);
walkDir(snippetsDir);
walkDir(templatesDir);
walkDir(layoutDir);

fs.writeFileSync(
  path.join(REPO, 'harness-AUDIT-360-001/report-02-liquid.json'),
  JSON.stringify(report, null, 2)
);

console.log('Liquid architecture audit finished. Total liquid files scanned:', report.filesChecked);
console.log('Sections with presets:', report.sectionsWithPresets.length);
console.log('Sections with @app:', report.sectionsWithAppBlock);
console.log('Sections with custom_liquid block:', report.sectionsWithCustomLiquid);
console.log('Design mode usages:', report.designModeUsages.length);
console.log('Loops without limits:', report.loopsWithoutLimits);
