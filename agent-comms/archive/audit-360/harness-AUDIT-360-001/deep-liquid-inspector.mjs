import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const report = {
  missing_section_settings: [],
  missing_block_settings: [],
  missing_global_settings: [],
  missing_storefront_translations: [],
  missing_schema_translations: [],
  missing_snippets: [],
  missing_assets: [],
  liquid_syntax_anomalies: [],
  empty_truthiness_risks: []
};

// 1. Load global settings schema
const settingsSchemaJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'settings_schema.json'), 'utf8'));
const globalSettingIds = new Set();
for (const section of settingsSchemaJson) {
  if (section.settings && Array.isArray(section.settings)) {
    for (const s of section.settings) {
      if (s.id) globalSettingIds.add(s.id);
    }
  }
}

// 2. Load locales
const enLocale = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', 'en.default.json'), 'utf8'));
const enSchemaLocale = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', 'en.default.schema.json'), 'utf8'));

function getNestedValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[p];
  }
  return curr;
}

// 3. Find all snippets and assets
const snippetFiles = new Set(fs.readdirSync(path.join(ROOT, 'snippets')).map(f => f.replace(/\.liquid$/, '')));
const assetFiles = new Set(fs.readdirSync(path.join(ROOT, 'assets')));

// 4. Find all liquid files
function findLiquidFiles(dir) {
  let res = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.tmp', 'harness-AUDIT-360-001', 'scratch', 'tests', 'docs', 'dist'].includes(entry.name)) continue;
      res = res.concat(findLiquidFiles(full));
    } else if (entry.name.endsWith('.liquid')) {
      res.push(full);
    }
  }
  return res;
}

const allLiquidFiles = findLiquidFiles(ROOT);
console.log(`Analyzing ${allLiquidFiles.length} Liquid files in detail...`);

for (const file of allLiquidFiles) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // Extract schema if present
  let schema = null;
  const schemaMatch = content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (schemaMatch) {
    try {
      schema = JSON.parse(schemaMatch[1]);
    } catch (e) {
      report.liquid_syntax_anomalies.push({ file: rel, error: 'Schema JSON parse error: ' + e.message });
    }
  }

  const sectionSettingIds = new Set();
  const blockSettingIds = new Map(); // blockType -> Set of ids

  if (schema) {
    if (schema.settings && Array.isArray(schema.settings)) {
      schema.settings.forEach(s => { if (s.id) sectionSettingIds.add(s.id); });
    }
    if (schema.blocks && Array.isArray(schema.blocks)) {
      schema.blocks.forEach(b => {
        const bSet = new Set();
        if (b.settings && Array.isArray(b.settings)) {
          b.settings.forEach(s => { if (s.id) bSet.add(s.id); });
        }
        blockSettingIds.set(b.type, bSet);
      });
    }

    // Check schema translation keys
    function checkSchemaT(obj, p) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => checkSchemaT(item, `${p}[${idx}]`));
        return;
      }
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v === 'string' && v.startsWith('t:')) {
          const tKey = v.slice(2);
          const val = getNestedValue(enSchemaLocale, tKey);
          if (val === undefined) {
            report.missing_schema_translations.push({ file: rel, path: `${p}.${k}`, key: v });
          }
        } else if (typeof v === 'object') {
          checkSchemaT(v, `${p}.${k}`);
        }
      }
    }
    checkSchemaT(schema, 'schema');
  }

  // Scan line by line
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;

    // A. Section settings references: section.settings.xyz
    const sectionMatches = line.matchAll(/section\.settings\.([a-zA-Z0-9_-]+)/g);
    for (const m of sectionMatches) {
      const id = m[1];
      if (schema && !sectionSettingIds.has(id)) {
        report.missing_section_settings.push({ file: rel, line: lineNum, id, context: line.trim() });
      }
    }

    // B. Global settings references: settings.xyz
    // Avoid matches like block.settings or section.settings
    const globalMatches = line.matchAll(/(?<![a-zA-Z0-9_.])settings\.([a-zA-Z0-9_-]+)/g);
    for (const m of globalMatches) {
      const id = m[1];
      if (!globalSettingIds.has(id)) {
        report.missing_global_settings.push({ file: rel, line: lineNum, id, context: line.trim() });
      }
    }

    // C. Translation references: 'xyz' | t or "xyz" | t
    const tMatches = line.matchAll(/['"]([a-zA-Z0-9_.-]+)['"]\s*\|\s*t\b/g);
    for (const m of tMatches) {
      const tKey = m[1];
      // Skip dynamic liquid parts or placeholder patterns
      if (tKey.includes('{{') || tKey.includes('{%')) continue;
      const val = getNestedValue(enLocale, tKey);
      if (val === undefined) {
        report.missing_storefront_translations.push({ file: rel, line: lineNum, key: tKey, context: line.trim() });
      }
    }

    // D. Render snippet references: render 'xyz' or render "xyz"
    const renderMatches = line.matchAll(/{%-?\s*render\s+['"]([a-zA-Z0-9_-]+)['"]/g);
    for (const m of renderMatches) {
      const snippet = m[1];
      if (!snippetFiles.has(snippet)) {
        report.missing_snippets.push({ file: rel, line: lineNum, snippet, context: line.trim() });
      }
    }

    // E. Asset URL references: 'xyz' | asset_url or "xyz" | asset_url
    const assetMatches = line.matchAll(/['"]([a-zA-Z0-9_.-]+)['"]\s*\|\s*asset_url\b/g);
    for (const m of assetMatches) {
      const asset = m[1];
      if (!assetFiles.has(asset) && !asset.includes('{{')) {
        report.missing_assets.push({ file: rel, line: lineNum, asset, context: line.trim() });
      }
    }
  });
}

fs.writeFileSync(path.join(ROOT, 'harness-AUDIT-360-001', 'deep-liquid-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('\n--- DEEP LIQUID CROSS-REFERENCE RESULTS ---');
console.log(`- Missing section settings: ${report.missing_section_settings.length}`);
console.log(`- Missing global settings: ${report.missing_global_settings.length}`);
console.log(`- Missing storefront translations: ${report.missing_storefront_translations.length}`);
console.log(`- Missing schema translations: ${report.missing_schema_translations.length}`);
console.log(`- Missing snippets: ${report.missing_snippets.length}`);
console.log(`- Missing assets: ${report.missing_assets.length}`);
console.log(`- Syntax anomalies: ${report.liquid_syntax_anomalies.length}`);
