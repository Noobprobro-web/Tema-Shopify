import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// Helper to find all sections
const sectionsDir = path.join(ROOT, 'sections');
const sectionFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));

const report = {
  non_t_labels: [],
  non_t_info: [],
  non_t_presets: [],
  title_case_labels_en: [],
  forbidden_internal_terms: [],
  locale_parity: {
    missing_in_es: [],
    missing_in_en: [],
    empty_values_en: [],
    empty_values_es: []
  },
  presets_in_settings_data: []
};

// 1. Check schema labels in all sections and settings_schema.json
const schemaHolders = [
  ...sectionFiles.map(f => ({ name: `sections/${f}`, content: fs.readFileSync(path.join(sectionsDir, f), 'utf8') })),
  { name: 'config/settings_schema.json', content: fs.readFileSync(path.join(ROOT, 'config', 'settings_schema.json'), 'utf8') }
];

const FORBIDDEN_TERMS = ['popover', 'intent', 'bento', 'atelier gift', 'lorem ipsum'];

for (const holder of schemaHolders) {
  let schemaJson = null;
  if (holder.name.endsWith('.liquid')) {
    const match = holder.content.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
    if (match) {
      try {
        schemaJson = JSON.parse(match[1]);
      } catch (e) {
        // syntax error
      }
    }
  } else {
    try {
      schemaJson = JSON.parse(holder.content);
    } catch (e) {}
  }

  if (!schemaJson) continue;

  function traverse(obj, pathStr) {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach((item, idx) => traverse(item, `${pathStr}[${idx}]`));
      return;
    }

    // Check label
    if (obj.label && typeof obj.label === 'string') {
      if (!obj.label.startsWith('t:')) {
        report.non_t_labels.push({ file: holder.name, path: pathStr, label: obj.label });
      }
      for (const term of FORBIDDEN_TERMS) {
        if (obj.label.toLowerCase().includes(term)) {
          report.forbidden_internal_terms.push({ file: holder.name, path: pathStr, field: 'label', term, value: obj.label });
        }
      }
    }

    // Check info
    if (obj.info && typeof obj.info === 'string') {
      if (!obj.info.startsWith('t:')) {
        report.non_t_info.push({ file: holder.name, path: pathStr, info: obj.info });
      }
      for (const term of FORBIDDEN_TERMS) {
        if (obj.info.toLowerCase().includes(term)) {
          report.forbidden_internal_terms.push({ file: holder.name, path: pathStr, field: 'info', term, value: obj.info });
        }
      }
    }

    // Check preset name
    if (pathStr.includes('presets') && obj.name && typeof obj.name === 'string') {
      if (!obj.name.startsWith('t:') && holder.name !== 'config/settings_schema.json') {
        report.non_t_presets.push({ file: holder.name, path: pathStr, name: obj.name });
      }
    }

    for (const [k, v] of Object.entries(obj)) {
      if (k !== 'label' && k !== 'info') {
        traverse(v, `${pathStr}.${k}`);
      }
    }
  }

  traverse(schemaJson, holder.name);
}

// 2. Check locales parity
const enLocale = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', 'en.default.json'), 'utf8'));
const esLocale = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', 'es.json'), 'utf8'));

function flattenKeys(obj, prefix = '') {
  let keys = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(keys, flattenKeys(v, fullKey));
    } else {
      keys[fullKey] = v;
    }
  }
  return keys;
}

const enFlat = flattenKeys(enLocale);
const esFlat = flattenKeys(esLocale);

for (const [k, v] of Object.entries(enFlat)) {
  if (!(k in esFlat)) {
    report.locale_parity.missing_in_es.push(k);
  }
  if (v === '' || v === null || v === undefined) {
    report.locale_parity.empty_values_en.push(k);
  }
  // Check Title Case in English schema translations
  if (k.startsWith('sections.') || k.startsWith('settings_schema.')) {
    if (typeof v === 'string' && v.trim().length > 0) {
      // Check if title case: words of 4+ letters capitalized when not first word
      const words = v.trim().split(/\s+/);
      if (words.length >= 2) {
        const titleCasedWords = words.slice(1).filter(w => /^[A-Z][a-z]{3,}$/.test(w) && !['Shopify', 'Liquid', 'HTML', 'CSS', 'URL', 'JavaScript'].includes(w));
        if (titleCasedWords.length > 0) {
          report.title_case_labels_en.push({ key: k, value: v, words: titleCasedWords });
        }
      }
    }
  }
}

for (const [k, v] of Object.entries(esFlat)) {
  if (!(k in enFlat)) {
    report.locale_parity.missing_in_en.push(k);
  }
  if (v === '' || v === null || v === undefined) {
    report.locale_parity.empty_values_es.push(k);
  }
}

// 3. Check settings_data.json presets
const settingsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'settings_data.json'), 'utf8'));
if (settingsData.presets) {
  report.presets_in_settings_data = Object.keys(settingsData.presets);
}

fs.writeFileSync(path.join(ROOT, 'harness-AUDIT-360-001', 'report-08-merchant-editor.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('Merchant & Editor audit completed:');
console.log(`- Non-t: labels: ${report.non_t_labels.length}`);
console.log(`- Non-t: info: ${report.non_t_info.length}`);
console.log(`- Non-t: presets: ${report.non_t_presets.length}`);
console.log(`- Forbidden internal terms: ${report.forbidden_internal_terms.length}`);
console.log(`- Missing in ES: ${report.locale_parity.missing_in_es.length}`);
console.log(`- Missing in EN: ${report.locale_parity.missing_in_en.length}`);
console.log(`- Title case labels in EN schema: ${report.title_case_labels_en.length}`);
console.log(`- Presets in settings_data: ${report.presets_in_settings_data.join(', ')}`);
