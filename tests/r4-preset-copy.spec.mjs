import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

const promos = {
  sartorial: [
    ['New forms', 'Explore pieces from the current collection.', '/collections/all'],
    ['Tailoring', 'A closer look at cut and proportion.', '/collections/all'],
  ],
  imprint: [
    ['Daily objects', 'Tools and pieces for work and everyday use.', '/collections/all'],
    ['Desk and study', 'Explore the pieces for your workspace.', '/collections/all'],
  ],
  archive: [
    ['Permanent archive', 'Browse garments and objects from the archive.', '/collections/all'],
    ['Selected pieces', 'A considered view across the collection.', '/collections/all'],
  ],
};

test('R4 C4 each preset has a full header group with its own two promo links and copy', () => {
  const root = readJson('sections/header-group.json');
  for (const [preset, entries] of Object.entries(promos)) {
    const listingGroupPath = `listings/${preset}/sections/header-group.json`;
    if (preset === 'sartorial') {
      expect(existsSync(new URL(`../${listingGroupPath}`, import.meta.url))).toBe(false);
    }
    const group = preset === 'sartorial' ? root : readJson(listingGroupPath);
    expect(Object.keys(group.sections)).toEqual(['announcement_bar', 'header']);
    expect(group.order).toEqual(root.order);
    expect(group.sections.announcement_bar).toEqual(root.sections.announcement_bar);
    const settings = group.sections.header.blocks.mega_menu_promo_catalog.settings;
    for (const [index, [heading, subheading, link]] of entries.entries()) {
      const slot = index + 1;
      expect(settings[`heading_${slot}`]).toBe(heading);
      expect(settings[`subheading_${slot}`]).toBe(subheading);
      expect(settings[`link_${slot}`]).toBe(link);
      expect(settings[`image_${slot}`]).toBe('');
    }
    const expected = structuredClone(root);
    const expectedSettings = expected.sections.header.blocks.mega_menu_promo_catalog.settings;
    for (const [index, [heading, subheading, link]] of entries.entries()) {
      const slot = index + 1;
      expectedSettings[`heading_${slot}`] = heading;
      expectedSettings[`subheading_${slot}`] = subheading;
      expectedSettings[`link_${slot}`] = link;
    }
    expect(group).toEqual(expected);
  }
});

const jsonFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return jsonFiles(path);
  return path.endsWith('.json') ? [path] : [];
});

test('R4A-1 all packaged and listing links use neutral collection URLs', () => {
  const files = ['sections/header-group.json', ...jsonFiles('listings')];
  for (const path of files) {
    const json = JSON.parse(readFileSync(path, 'utf8'));
    const visit = (value) => {
      if (typeof value === 'string' && value.startsWith('/collections/')) {
        expect(value, `${path}: ${value}`).toMatch(/^\/collections\/(?:all)?$/);
      } else if (Array.isArray(value)) {
        value.forEach(visit);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach(visit);
      }
    };
    visit(json);
  }
});

test('R4A-1 only demo overlays carry collection handles from their own catalog', () => {
  const collections = {
    sartorial: ['new-forms', 'tailoring'],
    imprint: ['daily-objects', 'desk-and-study'],
    archive: ['permanent-archive', 'restored-pieces'],
  };
  for (const [preset, handles] of Object.entries(collections)) {
    const settings = readJson(`docs/demo-store/overlays/${preset}/sections/header-group.json`)
      .sections.header.blocks.mega_menu_promo_catalog.settings;
    for (const [index, handle] of handles.entries()) {
      expect(settings[`link_${index + 1}`]).toBe(`/collections/${handle}`);
      const catalog = readJson(`docs/demo-import/data/${preset}.json`);
      expect(catalog.collections.some((collection) => collection.handle === handle)).toBe(true);
    }
  }
});

test('R4 C4 Imprint and Archive presets use sentence-case storefront copy without internal labels', () => {
  const imprint = readJson('listings/imprint/templates/index.json');
  const archive = readJson('listings/archive/templates/index.json');
  const archiveCollection = readJson('listings/archive/templates/collection.json');
  expect(imprint.sections.discovery.blocks.collection.settings.eyebrow).toBe('Daily carry');
  expect(imprint.sections.discovery.blocks.story.settings.eyebrow).toBe('Object details');
  expect(imprint.sections.collections.settings.eyebrow).toBe('The collection');
  expect(imprint.sections.collections.settings.heading).toBe('Desk objects for daily use');
  expect(imprint.sections.hero.settings.button_primary_label).toBe('Browse the collection');
  expect(archive.sections.collections.settings.heading).toBe('Archive pieces');
  expect(archive.sections.hero.settings.eyebrow).toBe('Catalog / the house');
  expect(archiveCollection.sections.main.blocks.catalogue_note.settings.eyebrow).toBe('From the archive');
  expect(archiveCollection.sections.main.blocks.catalogue_note.settings.heading).toBe('Selected garments and objects');

  const visibleCopy = JSON.stringify({ imprint, archive, archiveCollection }).toLowerCase();
  for (const internalTerm of ['telemetry', 'blueprint analysis', 'system inventory', 'studio modular systems', 'archive entries', 'curated archival garments']) {
    expect(visibleCopy).not.toContain(internalTerm);
  }
});
