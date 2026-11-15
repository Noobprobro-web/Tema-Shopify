import fs from 'fs';
import path from 'path';

const REPO = process.cwd();

const report = {
  exclusivity: {},
  prohibitedFiles: {},
  themeInfo: {},
  presets: {},
  requiredTemplates: {},
  requiredFeatures: {},
  customLiquid: {},
  blocksApp: {},
  supportDocs: {}
};

// 1. Prohibited files
const prohibited = [
  'config/markets.json',
  'templates/robots.txt.liquid',
  'layout/password.liquid' // remote issue
];
for (const p of prohibited) {
  report.prohibitedFiles[p] = fs.existsSync(path.join(REPO, p));
}

// Check for .scss or .scss.liquid files
function findFiles(dir, ext) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) res = res.concat(findFiles(full, ext));
    else if (item.name.endsWith(ext)) res.push(full);
  }
  return res;
}
report.prohibitedFiles['scss_files'] = findFiles(REPO, '.scss').concat(findFiles(REPO, '.scss.liquid'));

// 2. Credits / external developer links in theme code
const themeDirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const creditMatches = [];
for (const dir of themeDirs) {
  const files = findFiles(path.join(REPO, dir), '');
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    if (/ruizdigital\.com|designed by|developed by/i.test(content)) {
      creditMatches.push({ file: path.relative(REPO, f) });
    }
  }
}
report.exclusivity.creditMatches = creditMatches;

// 3. theme_info in settings_schema.json
const schema = JSON.parse(fs.readFileSync(path.join(REPO, 'config/settings_schema.json'), 'utf8'));
const themeInfo = schema.find(s => s.name === 'theme_info');
report.themeInfo = themeInfo || null;

// 4. Presets in settings_data.json and listings/
const settingsData = JSON.parse(fs.readFileSync(path.join(REPO, 'config/settings_data.json'), 'utf8'));
report.presets.names = Object.keys(settingsData.presets || {});
report.presets.listingsFolders = fs.existsSync(path.join(REPO, 'listings')) ? fs.readdirSync(path.join(REPO, 'listings')) : [];

// 5. Required templates
const requiredTemplates = [
  'layout/theme.liquid',
  'templates/404.json',
  'templates/article.json',
  'templates/blog.json',
  'templates/cart.json',
  'templates/collection.json',
  'templates/index.json',
  'templates/list-collections.json',
  'templates/page.json',
  'templates/page.contact.json',
  'templates/password.json',
  'templates/product.json',
  'templates/search.json',
  'templates/gift_card.liquid',
  'config/settings_data.json',
  'config/settings_schema.json'
];
for (const t of requiredTemplates) {
  report.requiredTemplates[t] = fs.existsSync(path.join(REPO, t));
}

// 6. Section groups
const sectionGroups = [
  'sections/header-group.json',
  'sections/footer-group.json'
];
for (const sg of sectionGroups) {
  report.requiredFeatures[sg] = fs.existsSync(path.join(REPO, sg));
}

// 7. Custom Liquid section and blocks
report.customLiquid['custom-liquid.liquid'] = fs.existsSync(path.join(REPO, 'sections/custom-liquid.liquid'));
const mainProductContent = fs.readFileSync(path.join(REPO, 'sections/main-product.liquid'), 'utf8');
report.blocksApp['main-product_app_block'] = mainProductContent.includes('"type": "@app"');
report.blocksApp['main-product_custom_liquid_block'] = mainProductContent.includes('"type": "custom_liquid"');

const featuredProductContent = fs.readFileSync(path.join(REPO, 'sections/featured-product.liquid'), 'utf8');
report.blocksApp['featured-product_app_block'] = featuredProductContent.includes('"type": "@app"');
report.blocksApp['featured-product_custom_liquid_block'] = featuredProductContent.includes('"type": "custom_liquid"');

// 8. Documentation and support check
report.supportDocs = {
  docsHtml: fs.existsSync(path.join(REPO, 'docs/merchant/docs.html')),
  supportHtml: fs.existsSync(path.join(REPO, 'docs/merchant/support.html'))
};

fs.writeFileSync(
  path.join(REPO, 'harness-AUDIT-360-001/report-01-requirements.json'),
  JSON.stringify(report, null, 2)
);
console.log('Requirements report generated successfully:');
console.log(JSON.stringify(report, null, 2));
