import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = process.cwd();
const output = path.join(root, '.tmp/gpt-audit-4b-007');
const snapshot = path.join(output, 'theme');
await mkdir(snapshot, { recursive: true });
const dirs = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'listings'];
const hashes = {};
async function inspect(dir) {
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const name = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await inspect(name);
    else hashes[name] = createHash('sha256').update(await readFile(path.join(root, name))).digest('hex');
  }
}
for (const dir of dirs) {
  await cp(path.join(root, dir), path.join(snapshot, dir), { recursive: true });
  await inspect(dir);
}
await writeFile(path.join(output, 'baseline-hashes.json'), JSON.stringify(hashes, null, 2));
const configPath = path.join(snapshot, 'config/settings_data.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
config.current.show_cart_note = true;
config.current.sections ||= {};
config.current.sections['cart-drawer'] = {
  type: 'cart-drawer', settings: { enable_tiered_progress: true },
  blocks: { audit_cross_sell: { type: 'cross_sell_product', settings: { product: 'qa-08-on-sale' } } },
  block_order: ['audit_cross_sell'],
};
await writeFile(configPath, JSON.stringify(config, null, 2));
const templatePath = path.join(snapshot, 'templates/product.json');
const template = JSON.parse(await readFile(templatePath, 'utf8'));
template.sections.main.blocks.audit_size = { type: 'size_guide', settings: {} };
template.sections.main.block_order.splice(4, 0, 'audit_size');
template.sections.audit_bundle = {
  type: 'complete-the-look', settings: {},
  blocks: { a: { type: 'bundle_product', settings: { product: 'qa-16-single-char' } }, b: { type: 'bundle_product', settings: { product: 'qa-08-on-sale' } } },
  block_order: ['a', 'b'],
};
template.sections.audit_featured = {
  type: 'featured-product', settings: { product: 'qa-16-single-char' },
  blocks: { title: { type: 'title', settings: {} }, quantity: { type: 'quantity_selector', settings: {} }, buy: { type: 'buy_buttons', settings: {} } },
  block_order: ['title', 'quantity', 'buy'],
};
template.order.push('audit_bundle', 'audit_featured');
await writeFile(templatePath, JSON.stringify(template, null, 2));
console.log(JSON.stringify({ files: Object.keys(hashes).length, themeJs: hashes['assets/theme.js'], snapshot, fixtureChanges: ['cart notes', 'cross-sell', 'size guide', 'bundle', 'featured product'] }));
