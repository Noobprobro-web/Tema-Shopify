import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const presets = {
  sartorial: { products: ['serra-coat', 'nove-blazer', 'silk-charmeuse-blouse', 'pleated-wide-trouser', 'cashmere-scarf'], collections: ['new-forms', 'permanent-collection', 'tailoring'] },
  imprint: { products: ['structured-tote', 'leather-desk-mat', 'folded-valet-tray', 'leather-document-folio', 'four-slot-cardholder'], collections: ['daily-objects', 'desk-and-study', 'leather-goods'] },
  archive: { products: ['1989-structured-wool-waistcoat', '1990-pinstripe-double-breasted-jacket', '1994-cashmere-cocoon-coat'], collections: ['permanent-archive', 'restored-pieces'] },
};

for (const [preset, expected] of Object.entries(presets)) {
  test(`${preset} overlay uses only handles in its destination catalog and leaves imagery empty`, () => {
    const overlay = JSON.parse(readFileSync(`docs/demo-store/overlays/${preset}/templates/index.json`, 'utf8'));
    const header = JSON.parse(readFileSync(`docs/demo-store/overlays/${preset}/sections/header-group.json`, 'utf8'));
    const catalog = JSON.parse(readFileSync(`docs/demo-import/data/${preset}.json`, 'utf8'));
    const productHandles = new Set(catalog.products.map(({ handle }) => handle));
    const collectionHandles = new Set(catalog.collections.map(({ handle }) => handle));
    const references = [];
    const visit = (value) => {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        if (key === 'product' && typeof child === 'string' && child) references.push(['product', child]);
        if (key === 'collection' && typeof child === 'string' && child && child !== 'all') references.push(['collection', child]);
        visit(child);
      }
    };
    visit(overlay);
    expect(references.length).toBeGreaterThan(0);
    for (const [kind, handle] of references) expect(kind === 'product' ? productHandles.has(handle) : collectionHandles.has(handle), `${kind} ${handle}`).toBe(true);
    for (const handle of expected.products) expect(productHandles.has(handle)).toBe(true);
    for (const handle of expected.collections) expect(collectionHandles.has(handle)).toBe(true);
    expect(header.sections.header.blocks.mega_menu_promo_catalog.settings.image_1).toBe('');
    expect(header.sections.header.blocks.mega_menu_promo_catalog.settings.image_2).toBe('');
    expect(JSON.stringify(overlay)).not.toMatch(/"(?:image|image_desktop|image_mobile|editorial_image)"\s*:\s*"[^"]+/);
  });
}

test('all overlays document asset dependencies and unpublished-theme application', () => {
  const instructions = readFileSync('docs/demo-store/overlays/README.md', 'utf8');
  expect(instructions).toContain('DP-025');
  expect(instructions).toContain('unpublished');
  expect(instructions).toContain('never');
  expect(instructions).toContain('docs/demo-import/sartorial-photos.csv');
  expect(instructions).toContain('docs/demo-import/imprint-photos.csv');
  expect(instructions).toContain('docs/demo-import/archive-photos.csv');
  expect(instructions).toContain('header promo `image_1` (New forms) and `image_2` (Tailoring)');
  expect(instructions).toContain('header promo `image_1` (Permanent archive) and `image_2` (Restored pieces)');
});

test('archive header promo names the collection it links to', () => {
  const header = JSON.parse(readFileSync('docs/demo-store/overlays/archive/sections/header-group.json', 'utf8'));
  const promo = header.sections.header.blocks.mega_menu_promo_catalog.settings;
  expect(promo.link_2).toBe('/collections/restored-pieces');
  expect(promo.heading_2).toBe('Restored pieces');
});
