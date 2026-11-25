import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

const promos = {
  sartorial: [
    ['New forms', 'Explore pieces from the current collection.', '/collections/new-forms'],
    ['Tailoring', 'A closer look at cut and proportion.', '/collections/tailoring'],
  ],
  imprint: [
    ['Daily objects', 'Tools and pieces for work and everyday use.', '/collections/daily-objects'],
    ['Desk and study', 'Explore the pieces for your workspace.', '/collections/desk-and-study'],
  ],
  archive: [
    ['Permanent archive', 'Browse garments and objects from the archive.', '/collections/permanent-archive'],
    ['Selected pieces', 'A considered view across the collection.', '/collections/all'],
  ],
};

test('R4 C4 each preset has a full header group with its own two promo links and copy', () => {
  const root = readJson('sections/header-group.json');
  for (const [preset, entries] of Object.entries(promos)) {
    const group = readJson(`listings/${preset}/sections/header-group.json`);
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
