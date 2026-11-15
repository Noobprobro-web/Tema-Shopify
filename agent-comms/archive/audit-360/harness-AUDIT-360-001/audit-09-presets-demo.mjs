import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const report = {
  presets_found: [],
  listings_structure: {},
  placeholder_copy_found: [],
  placeholder_images_found: [],
  preset_differences: {},
  demo_store_requirements_gap: []
};

// 1. Read settings_data.json
const settingsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'config', 'settings_data.json'), 'utf8'));
report.presets_found = ['current (Couture)', ...Object.keys(settingsData.presets || {})];

// Check fonts and key settings across presets
for (const [presetName, presetConfig] of Object.entries(settingsData.presets || {})) {
  report.preset_differences[presetName] = {
    font_heading: presetConfig.font_heading,
    font_body: presetConfig.font_body,
    colors: {
      accent: presetConfig.color_accent,
      background: presetConfig.color_background,
      text: presetConfig.color_text
    }
  };
}
report.preset_differences['current (Couture)'] = {
  font_heading: settingsData.current.font_heading,
  font_body: settingsData.current.font_body,
  colors: {
    accent: settingsData.current.color_accent,
    background: settingsData.current.color_background,
    text: settingsData.current.color_text
  }
};

// 2. Check listings/ structure
const listingsDir = path.join(ROOT, 'listings');
if (fs.existsSync(listingsDir)) {
  const dirs = fs.readdirSync(listingsDir).filter(f => fs.statSync(path.join(listingsDir, f)).isDirectory());
  for (const d of dirs) {
    const tmplDir = path.join(listingsDir, d, 'templates');
    if (fs.existsSync(tmplDir)) {
      report.listings_structure[d] = fs.readdirSync(tmplDir);
    } else {
      report.listings_structure[d] = 'missing templates/';
    }
  }
}

// 3. Scan all templates and listings for lorem / placeholder
function scanJsonFiles(dir, relPrefix = '') {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const rel = relPrefix ? `${relPrefix}/${f}` : f;
    if (fs.statSync(full).isDirectory()) {
      scanJsonFiles(full, rel);
    } else if (f.endsWith('.json')) {
      const text = fs.readFileSync(full, 'utf8');
      if (/lorem\s+ipsum/i.test(text)) {
        report.placeholder_copy_found.push({ file: rel, match: 'lorem ipsum' });
      }
      const onboardingImages = text.match(/(lifestyle|product|collection|hero)-(apparel-)?[0-9]/g);
      if (onboardingImages) {
        report.placeholder_images_found.push({ file: rel, matches: [...new Set(onboardingImages)] });
      }
    }
  }
}

scanJsonFiles(path.join(ROOT, 'templates'), 'templates');
if (fs.existsSync(listingsDir)) {
  scanJsonFiles(listingsDir, 'listings');
}

// 4. Document gaps for 3 demo stores based on shopify.dev requirements
report.demo_store_requirements_gap = [
  {
    requirement: "Demo stores must be distinct Client Transfer development stores",
    status: "GAP / P0",
    detail: "Currently only 1 development store (tema-qkqpke0j.myshopify.com) exists with 4 theme IDs. Shopify requires 3 public demo stores for Sartorial, Edition, and Archive, each with distinct catalogs and URLs."
  },
  {
    requirement: "Test payment gateway or Bogus Gateway enabled",
    status: "GAP / P1",
    detail: "Bogus Gateway is not enabled on tema-qkqpke0j.myshopify.com (store checkout requires real payment / password)."
  },
  {
    requirement: "No password protection on demo stores",
    status: "GAP / P0",
    detail: "Storefront password is enabled because development stores cannot disable password without transfer or active plan."
  },
  {
    requirement: "Authentic, high-quality photography with valid commercial licenses",
    status: "DOCUMENTATION REQUIRED / P1",
    detail: "Images used in demo catalog (Serra coat, Nove blazer, etc.) must have confirmed commercial licenses on file."
  }
];

fs.writeFileSync(path.join(ROOT, 'harness-AUDIT-360-001', 'report-09-presets-demo.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('Presets & Demo audit completed!');
console.log(`- Presets found: ${report.presets_found.join(', ')}`);
console.log(`- Listings structure: ${Object.keys(report.listings_structure).join(', ')}`);
console.log(`- Placeholder copy found: ${report.placeholder_copy_found.length}`);
console.log(`- Placeholder images found: ${report.placeholder_images_found.length}`);
