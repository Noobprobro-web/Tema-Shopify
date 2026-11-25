import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { buildPlan } from '../docs/demo-store/scripts/catalog-r4.mjs';

test('T1 emits deterministic, idempotent operations using the supplied provisional author', () => {
  const first = buildPlan({ storeAlias: 'qa', plan: 't1' });
  const repeated = buildPlan({ storeAlias: 'qa', plan: 't1' });

  expect(first.document.mode).toBe('dry-run');
  expect(first.document.mutations_sent).toBe(0);
  expect(first.document).toEqual(repeated.document);
  expect(first.document.changes.some((item) => item.resource === 'Article' && item.field === 'author' && item.after === 'proyect-shopi')).toBe(true);
  expect(first.document.changes.some((item) => item.mutation === 'collectionUnpublish')).toBe(true);
  expect(first.document.baseline.live_admin_read).toBe(false);
  expect(first.document.safety.no_resource_ids_embedded).toBe(true);
  expect(JSON.stringify(first.document)).not.toMatch(/gid:\/\/shopify\//i);

  const alreadyApplied = buildPlan({ storeAlias: 'qa', plan: 't1', currentValues: first.targetState });
  expect(alreadyApplied.document.change_count).toBe(0);
});

test('T2 QA preserves the Sartorial structured tote and targets no apparel', () => {
  const { document } = buildPlan({ storeAlias: 'qa', plan: 't2' });
  expect(document.mutations_sent).toBe(0);
  expect(document.skipped.some(({ selector, reason }) => selector.handle === 'structured-tote' && /Never overwrite/.test(reason))).toBe(true);
  expect(document.changes.some(({ selector }) => /coat|shirt|trouser|dress/i.test(selector.handle || ''))).toBe(false);
  expect(document.changes.every(({ mutation }) => mutation !== 'productDelete' && mutation !== 'collectionDelete')).toBe(true);
});

test('T2 Imprint plan includes its tote and idempotent collection upserts', () => {
  const result = buildPlan({ storeAlias: 'demo-imprint-pending', plan: 't2' });
  const { document } = result;
  expect(document.store.domain).toBeNull();
  expect(document.baseline.note).toContain('does not exist yet');
  const toteImport = document.changes.find(({ selector, field }) => selector.handle === 'structured-tote' && field === 'productSet');
  expect(toteImport.after.status).toBe('ACTIVE');
  expect(document.changes.some(({ selector, field, after }) => selector.product_handle === 'structured-tote' && field === 'inventoryQuantity' && after === 8)).toBe(true);
  expect(document.changes.some(({ selector, mutation }) => selector.handle === 'structured-tote' && mutation === 'publishablePublish')).toBe(true);
  expect(document.changes.filter(({ mutation }) => /collectionCreate or collectionUpdate/.test(mutation))).toHaveLength(3);
  expect(buildPlan({ storeAlias: 'demo-imprint-pending', plan: 't2', currentValues: result.targetState }).document.change_count).toBe(0);
});

test('T3 Archive plan emits its two collections, without applying mutations', () => {
  const result = buildPlan({ storeAlias: 'demo-archive-pending', plan: 't3' });
  expect(result.document.changes.filter(({ mutation }) => /collectionCreate or collectionUpdate/.test(mutation))).toHaveLength(2);
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
  const titles = document.changes.filter(({ field, selector, resource }) => field === 'title' && resource === 'Product' && selector.handle);
  expect(titles.some(({ after }) => after.length === 120)).toBe(true);
  const manyVariants = titles.find(({ selector }) => selector.handle === 'fixture-many-variants');
  expect(manyVariants.after).toMatch(/jacket/i);
  expect(manyVariants.after).not.toMatch(/knit/i);
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
