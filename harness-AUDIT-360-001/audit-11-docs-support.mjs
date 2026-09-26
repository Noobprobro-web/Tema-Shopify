import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const report = {
  theme_info: {},
  support_form_fields: {
    has_name: false,
    has_email: false,
    has_store_url: false,
    has_store_url_example: false,
    has_storefront_password: false,
    has_description: false,
    has_file_attachment: false,
    has_auto_responder_backend: false
  },
  settings_documented_vs_schema: {
    documented_settings_count: 0,
    schema_settings_count: 0,
    missing_in_docs: []
  },
  external_urls: []
};

// 1. Check theme_info in config/settings_schema.json
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'settings_schema.json'), 'utf8'));
const themeInfo = schema.find(s => s.name === 'theme_info');
if (themeInfo) {
  report.theme_info = {
    name: themeInfo.theme_name,
    author: themeInfo.theme_author,
    version: themeInfo.theme_version,
    documentation_url: themeInfo.theme_documentation_url,
    support_url: themeInfo.theme_support_url
  };
}

// 2. Check support.html
const supportHtml = fs.readFileSync(path.join(ROOT, 'docs', 'merchant', 'support.html'), 'utf8');
report.support_form_fields.has_name = supportHtml.includes('name="name"');
report.support_form_fields.has_email = supportHtml.includes('name="email"');
report.support_form_fields.has_store_url = supportHtml.includes('name="store_url"');
report.support_form_fields.has_store_url_example = supportHtml.includes('your-store.myshopify.com') || supportHtml.includes('myshopify.com');
report.support_form_fields.has_storefront_password = supportHtml.includes('password') && supportHtml.includes('name="password"');
report.support_form_fields.has_description = supportHtml.includes('name="message"') || supportHtml.includes('name="description"');
report.support_form_fields.has_file_attachment = supportHtml.includes('type="file"');
report.support_form_fields.has_auto_responder_backend = !supportHtml.includes('action="mailto:');

// 3. Check docs.html settings coverage
const docsHtml = fs.readFileSync(path.join(ROOT, 'docs', 'merchant', 'docs.html'), 'utf8');

// Collect all schema setting labels from en.default.schema.json
const enSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales', 'en.default.schema.json'), 'utf8'));
function collectLabels(obj) {
  let labels = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object') {
      if (v.label && typeof v.label === 'string') {
        labels.push(v.label);
      }
      labels = labels.concat(collectLabels(v));
    }
  }
  return labels;
}

const allLabels = [...new Set(collectLabels(enSchema))];
report.settings_documented_vs_schema.schema_settings_count = allLabels.length;

let docCount = 0;
const missing = [];
for (const label of allLabels) {
  if (docsHtml.toLowerCase().includes(label.toLowerCase())) {
    docCount++;
  } else {
    missing.push(label);
  }
}
report.settings_documented_vs_schema.documented_settings_count = docCount;
report.settings_documented_vs_schema.missing_in_docs = missing.slice(0, 15); // sample of 15

fs.writeFileSync(path.join(ROOT, 'harness-AUDIT-360-001', 'report-11-docs-support.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('Documentation & Support audit complete:');
console.log('Theme info URLs:', report.theme_info);
console.log('Support form compliance:', report.support_form_fields);
console.log(`Documented settings: ${docCount} / ${allLabels.length}`);
