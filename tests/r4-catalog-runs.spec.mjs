import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync as readTmp, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildPlan } from '../docs/demo-store/scripts/catalog-r4.mjs';

test('T1 emits deterministic planning intents with a fictitious editorial author per preset', () => {
  const first = buildPlan({ storeAlias: 'qa', plan: 't1' });
  const repeated = buildPlan({ storeAlias: 'qa', plan: 't1' });

  expect(first.document.mode).toBe('dry-run');
  expect(first.document.mutations_sent).toBe(0);
  expect(first.document).toEqual(repeated.document);
  expect(first.document.intents.some((item) => item.resource === 'Article' && item.field === 'author' && item.target_value === 'Mara Ellery')).toBe(true);
  expect(first.document.intents.some((item) => item.mutation === 'collectionUnpublish')).toBe(true);
  expect(first.document.baseline.live_admin_read).toBe(false);
  expect(first.document.safety.no_resource_ids_embedded).toBe(true);
  expect(JSON.stringify(first.document)).not.toMatch(/gid:\/\/shopify\//i);
  expect(first.document).not.toHaveProperty('idempotent');
  expect(first.document).not.toHaveProperty('operations');
  expect(first.document).not.toHaveProperty('targetState');
  expect(first.document).not.toHaveProperty('changes');
  for (const [alias, author] of [['demo-sartorial-pending', 'Mara Ellery'], ['demo-imprint-pending', 'Eli Mercer'], ['demo-archive-pending', 'Rowan Vale']]) {
    expect(buildPlan({ storeAlias: alias, plan: 't1' }).document.intents
      .filter((item) => item.resource === 'Article' && item.field === 'author')
      .every((item) => item.target_value === author)).toBe(true);
  }
  expect(JSON.stringify(first.document)).not.toContain('proyect-shopi');
  expect(first.document.plan_kind).toBe('mutation-intents');
  expect(first.document.executable_graphql).toBe(false);
  expect(first.document.baseline.live_store_read).toBe(false);

});

test('T2 QA preserves the Sartorial structured tote and targets no apparel', () => {
  const { document } = buildPlan({ storeAlias: 'qa', plan: 't2' });
  expect(document.mutations_sent).toBe(0);
  expect(document.skipped.some(({ selector, reason }) => selector.handle === 'structured-tote' && /Never overwrite/.test(reason))).toBe(true);
  expect(document.intents).toHaveLength(0);
  expect(document.skipped.length).toBeGreaterThan(0);
  expect(document.skipped.every((item) => item.skipped && item.reason)).toBe(true);
  expect(document.intents.every(({ field }) => !['status', 'published', 'inventoryQuantity'].includes(field))).toBe(true);
});

test('T2 and T3 QA contain no product activation, inventory, publication, or collection intents', () => {
  for (const plan of ['t2', 't3']) {
    const { document } = buildPlan({ storeAlias: 'qa', plan });
    expect(document.intents).toHaveLength(0);
    expect(document.skipped.length).toBeGreaterThan(0);
    expect(document.skipped.every((item) => item.skipped && item.reason)).toBe(true);
  }
});

test('T2 Imprint plan includes its tote and idempotent collection upserts', () => {
  const result = buildPlan({ storeAlias: 'demo-imprint-pending', plan: 't2' });
  const { document } = result;
  expect(document.store.domain).toBeNull();
  expect(document.baseline.note).toContain('does not exist yet');
  const toteImport = document.intents.find(({ selector, field }) => selector.handle === 'structured-tote' && field === 'productSet');
  expect(toteImport.target_value.status).toBe('ACTIVE');
  expect(document.intents.some(({ selector, field, target_value }) => selector.product_handle === 'structured-tote' && field === 'inventoryQuantity' && target_value === 8)).toBe(true);
  expect(document.intents.some(({ selector, mutation }) => selector.handle === 'structured-tote' && mutation === 'publishablePublish')).toBe(true);
  expect(document.intents.filter(({ mutation }) => /collectionCreate or collectionUpdate/.test(mutation))).toHaveLength(3);
});

test('T3 Archive plan emits its two collections, without applying mutations', () => {
  const result = buildPlan({ storeAlias: 'demo-archive-pending', plan: 't3' });
  expect(result.document.intents.filter(({ mutation }) => /collectionCreate or collectionUpdate/.test(mutation))).toHaveLength(2);
  expect(result.document.mutations_sent).toBe(0);
  expect(result.document.safety.apply_supported).toBe(false);
});

test('catalog planner rejects stores outside the explicit allowlist', () => {
  expect(() => buildPlan({ storeAlias: 'unknown.myshopify.com', plan: 't1' })).toThrow(/not allowlisted/);
});

test('R4A-4 keeps a 120-character product title, correct jacket type, and conditional fixture handles', () => {
  const csvHandles = new Set(readFileSync(new URL('../docs/demo-store/products.csv', import.meta.url), 'utf8')
    .split(/\r?\n/).slice(1).map((line) => line.split(',')[0]).filter(Boolean));
  const { document } = buildPlan({ storeAlias: 'qa', plan: 't1' });
  const titles = document.intents.filter(({ field, selector, resource }) => field === 'title' && resource === 'Product' && selector.handle);
  expect(titles.some(({ target_value }) => target_value.length === 120)).toBe(true);
  const manyVariants = titles.find(({ selector }) => selector.handle === 'fixture-many-variants');
  expect(manyVariants.target_value).toMatch(/jacket/i);
  expect(manyVariants.target_value).not.toMatch(/knit/i);
  for (const intent of titles) {
    if (!csvHandles.has(intent.selector.handle)) {
      expect(intent.condition).toMatchObject({ lookup_by_handle: true, skip_if_missing: true });
      expect(intent.baseline_source).toMatch(/buscar y omitir si no existe/i);
    }
  }
  for (const handle of ['fixture-focal-point', 'fixture-color-only', 'fixture-long-title', 'fixture-long-swatches']) {
    expect(titles.some(({ selector }) => selector.handle === handle)).toBe(true);
  }
});

test('R4A-9 renames the demo article to match its title and records no redirect intent', () => {
  const { document } = buildPlan({ storeAlias: 'qa', plan: 't1' });
  expect(document.intents.some(({ resource, field, selector, target_value }) => resource === 'Article'
    && field === 'handle' && selector.handle === 'welcome-to-the-demo-store' && target_value === 'a-study-in-proportion')).toBe(true);
  expect(document.redirects_planned).toBe(false);
  expect(document.redirect_note).toMatch(/No se planifican redirecciones/i);
});

test('R4A copy removes unsupported size-chart placement and preserves editorial naming', () => {
  const { document } = buildPlan({ storeAlias: 'qa', plan: 't1' });
  const measurementArticle = document.intents.find(({ resource, selector, field }) => resource === 'Article'
    && selector.handle === 'how-to-read-the-size-chart' && field === 'body');
  expect(measurementArticle.target_value).not.toMatch(/below each size/i);
  expect(measurementArticle.target_value).toContain('size guide');
});

test('R4A-10 CLI accepts an inventory target and defaults to eight', () => {
  const dir = mkdtempSync(join(tmpdir(), 'r4-inventory-'));
  try {
    const output = join(dir, 'plan.json');
    execFileSync(process.execPath, ['docs/demo-store/scripts/catalog-r4.mjs', '--store', 'demo-imprint-pending', '--plan', 't2', '--inventory', '3', '--out', output]);
    expect(JSON.parse(readTmp(output, 'utf8')).inventory_target).toBe(3);
    expect(buildPlan({ storeAlias: 'demo-imprint-pending', plan: 't2' }).document.inventory_target).toBe(8);
    expect(() => buildPlan({ storeAlias: 'demo-imprint-pending', plan: 't2', inventory: -1 })).toThrow(/non-negative integer/i);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
