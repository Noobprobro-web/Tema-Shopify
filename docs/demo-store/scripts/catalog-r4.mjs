#!/usr/bin/env node
// Deterministic, dry-run-only planner for the R4 demo catalog. It never sends a Shopify mutation.
// Admin write operations are emitted as handle/value selectors so an authorized operator can
// resolve current resource IDs when the demo stores exist.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOG_COPY, COLLECTIONS, FIXTURE_TITLES, GIFT_CARD_COPY, PRESET_VENDORS, PRODUCT_COPY } from './catalog-r4-data.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const STORES = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'catalog-r4-stores.json'), 'utf8'));
const CREATED_PRODUCTS = JSON.parse(readFileSync(join(ROOT, 'docs/demo-store/created-products-imprint-archive.json'), 'utf8'));
const IMPRINT = JSON.parse(readFileSync(join(ROOT, 'docs/demo-import/data/imprint.json'), 'utf8'));
const ARCHIVE = JSON.parse(readFileSync(join(ROOT, 'docs/demo-import/data/archive.json'), 'utf8'));
const PRODUCT_CSV_PATH = join(ROOT, 'docs/demo-store/products.csv');
const AUTHOR_NAME = 'proyect-shopi';
const BASELINE_CSV_NOTE = 'Historical source CSV. This is not a live Shopify Admin read.';

const csvRows = (text) => {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(value);
      value = '';
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }
  if (value || row.length) {
    row.push(value.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows;
};

const readProductCsv = () => {
  const [header, ...rows] = csvRows(readFileSync(PRODUCT_CSV_PATH, 'utf8'));
  const products = new Map();
  rows.forEach((values) => {
    const record = Object.fromEntries(header.map((key, index) => [key, values[index] || '']));
    const handle = record.Handle;
    if (!handle) return;
    let product = products.get(handle);
    if (!product || record.Title) {
      product = product || { handle, variants: [] };
      Object.assign(product, {
        title: record.Title || product.title || '',
        body: record['Body (HTML)'] || product.body || '',
        vendor: record.Vendor || product.vendor || '',
        status: record.Status || product.status || '',
        tags: record.Tags || product.tags || '',
        options: product.options || [1, 2, 3].map((number) => ({
          name: record[`Option${number} Name`],
        })).filter((option) => option.name),
      });
      products.set(handle, product);
    }
    const options = [1, 2, 3].map((number) => ({
      name: product.options[number - 1]?.name || '',
      value: record[`Option${number} Value`] || '',
    })).filter((option) => option.name && option.value);
    product.variants.push({ options, sku: record['Variant SKU'], variantImage: record['Variant Image'] || null });
  });
  return products;
};

const csvProducts = readProductCsv();
const stable = (value) => JSON.stringify(value);
const optionMediaIntents = (product) => {
  const intents = [];
  for (const variant of product.variants) {
    const colorOrFinish = variant.options.filter((option) => /color|finish/i.test(option.name));
    if (!colorOrFinish.length) continue;
    const selector = { product_handle: product.handle, options: variant.options };
    intents.push({
      key: `ProductVariant:${stable(selector)}:featured_media`,
      selector,
      field: 'featured_media',
      before: null,
      after: {
        media_selector: {
          match_fields: ['alt_text', 'original_filename'],
          values: colorOrFinish.map((option) => option.value),
          normalization: 'case-insensitive; compare complete option value and filename/alt tokens',
        },
      },
      mutation: 'productVariantUpdate + variant media association',
      baseline_source: 'products.csv has no variant image assignment; live state was not checked.',
    });
  }
  return intents;
};

const action = (plan, resource, selector, field, before, after, mutation, baseline_source) => ({
  key: `${resource}:${stable(selector)}:${field}`,
  plan,
  resource,
  selector,
  field,
  before,
  after,
  mutation,
  baseline_source,
});

const t1Intents = (store) => {
  const intents = [];
  for (const [handle, description] of Object.entries(PRODUCT_COPY)) {
    const product = csvProducts.get(handle);
    if (!product) continue;
    const after = `<p>${description}</p>`;
    intents.push(action('t1', 'Product', { handle }, 'descriptionHtml', product.body || '', after,
      'productUpdate', BASELINE_CSV_NOTE));
  }

  // One handle-independent filter covers the 31 current Studio Demo products, including products
  // that were added after the seed CSV. Live execution must query and compare each result first.
  intents.push(action('t1', 'Product', { query: 'vendor:"Studio Demo"' }, 'vendor', 'Studio Demo',
    PRESET_VENDORS[store.preset], 'productUpdate (one product per returned handle)',
    'Expected count 31 comes from the R4 brief; no live Admin query was run.'));

  for (const [handle, title] of Object.entries(FIXTURE_TITLES)) {
    const product = csvProducts.get(handle);
    const before = product?.title || null;
    intents.push(action('t1', 'Product', { handle }, 'title', before, title, 'productUpdate',
      product ? BASELINE_CSV_NOTE : 'Fixture handle from R4 inventory; current title requires a live read.'));
  }

  for (const product of csvProducts.values()) intents.push(...optionMediaIntents(product)
    .map((intent) => ({ ...intent, plan: 't1', resource: 'ProductVariant', mutation: intent.mutation })));

  for (const [handle, copy] of Object.entries(BLOG_COPY)) {
    const source = handle === 'welcome-to-the-demo-store'
      ? { title: 'Welcome to the demo store', body: '<p>This store is used to preview the theme. Replace this article with your own news.</p>', tags: ['news'] }
      : { title: 'How to read the size chart', body: '<p>Sizes in this demo go from XS to XL. Replace this text with your own measurements and advice.</p>', tags: ['guide'] };
    intents.push(action('t1', 'Article', { blog_handle: 'news', handle }, 'title', source.title, copy.title,
      'articleUpdate', 'docs/demo-store/blog.md')); 
    intents.push(action('t1', 'Article', { blog_handle: 'news', handle }, 'body', source.body, copy.body,
      'articleUpdate', 'docs/demo-store/blog.md'));
    intents.push(action('t1', 'Article', { blog_handle: 'news', handle }, 'tags', source.tags, copy.tags,
      'articleUpdate', 'docs/demo-store/blog.md'));
    intents.push(action('t1', 'Article', { blog_handle: 'news', handle }, 'author', 'Demo store', AUTHOR_NAME,
      'articleUpdate', 'Author supplied by Johandry in this task reply.'));
  }
  intents.push(action('t1', 'Article', { blog_handle: 'news', handle: 'long-title-article-test' }, 'published', true, false,
    'articleUpdate', 'docs/demo-store/blog.md; unpublish without deleting'));
  intents.push(action('t1', 'Article', { blog_handle: 'news', handle: 'long-title-article-test' }, 'tags', ['test'], [],
    'articleUpdate', 'docs/demo-store/blog.md'));
  intents.push(action('t1', 'Product', { handle: 'gift-card' }, 'descriptionHtml',
    '<p>This is a gift card for the store.</p>', `<p>${GIFT_CARD_COPY}</p>`, 'productUpdate',
    'R4 task describes the visible gift-card text; current live body requires a read.'));
  intents.push(action('t1', 'Product', { handle: 'gift-card' }, 'templateSuffix', null, 'gift-card',
    'productUpdate', 'Template assignment requires a live catalog read.'));
  for (const handle of ['empty-test', 'single-product-test']) {
    intents.push(action('t1', 'Collection', { handle, publication: 'Online Store' }, 'published', true, false,
      'collectionUnpublish', 'R4 task identifies these collections as test-only; do not delete.'));
  }
  return intents;
};

const priorStatus = new Map(CREATED_PRODUCTS.created.map(({ handle, status, variants, inventory_per_variant, publishedOnlineStore }) => [
  handle,
  { status, variants, inventory_per_variant, publishedOnlineStore },
]));

const catalogPlanIntents = (plan, store) => {
  const preset = plan === 't2' ? 'imprint' : 'archive';
  const catalog = preset === 'imprint' ? IMPRINT : ARCHIVE;
  const intents = [];
  for (const product of catalog.products) {
    const previous = priorStatus.get(product.handle);
    if (!previous || previous.status !== 'DRAFT') continue;
    intents.push(action(plan, 'Product', { handle: product.handle }, 'status', 'DRAFT', 'ACTIVE',
      'productUpdate', 'Historical QA import snapshot; target demo store is not created yet.'));
    intents.push(action(plan, 'ProductVariant', { product_handle: product.handle, variant_options: 'all' }, 'inventoryQuantity', 0,
      8, 'inventorySetQuantities', 'Resolve the default active fulfillment location by name and verify it; no location ID is embedded.'));
    intents.push(action(plan, 'Product', { handle: product.handle, publication: 'Online Store' }, 'published', false, true,
      'publishablePublish', 'Historical QA import snapshot; target demo store is not created yet.'));
  }
  for (const collection of COLLECTIONS[preset]) {
    const source = catalog.collections.find((item) => item.handle === collection.handle);
    intents.push(action(plan, 'Collection', { handle: collection.handle }, 'definition', null, {
      title: collection.title,
      rule_tag: collection.tag,
      product_order: source?.order || 'best-selling',
    }, 'collectionCreate or collectionUpdate by handle (idempotent upsert)',
    `docs/demo-import/data/${preset}.json`));
  }
  if (plan === 't2' && store.role === 'qa') {
    intents.push({
      key: 'Product:structured-tote:skip-on-qa', plan, resource: 'Product',
      selector: { handle: 'structured-tote' }, field: 'import', before: 'existing Sartorial product', after: null,
      mutation: null, skipped: true, reason: 'Never overwrite the QA store’s Sartorial structured-tote.',
    });
  } else if (plan === 't2' && store.role === 'demo') {
    const tote = catalog.products.find((product) => product.handle === 'structured-tote');
    intents.push(action(plan, 'Product', { handle: 'structured-tote' }, 'productSet', null, { ...tote, status: 'ACTIVE' },
      'productSet (upsert by handle; Imprint source only)', 'docs/demo-import/data/imprint.json'));
    intents.push(action(plan, 'ProductVariant', { product_handle: 'structured-tote', variant_options: 'all' }, 'inventoryQuantity', 0,
      8, 'inventorySetQuantities', 'Resolve the default active fulfillment location by name; no location ID is embedded.'));
    intents.push(action(plan, 'Product', { handle: 'structured-tote', publication: 'Online Store' }, 'published', false, true,
      'publishablePublish', 'Imprint demo import plan; publish only after productSet and inventory verification.'));
  }
  return intents;
};

const requiredPlan = (store, plan) => {
  if (!['t1', 't2', 't3'].includes(plan)) throw new Error('--plan must be t1, t2 or t3.');
  if (plan === 't2' && store.role === 'demo' && store.preset !== 'imprint') throw new Error('T2 can target only QA or the allowlisted Imprint demo.');
  if (plan === 't3' && store.role === 'demo' && store.preset !== 'archive') throw new Error('T3 can target only QA or the allowlisted Archive demo.');
};

export function buildPlan({ storeAlias, plan, currentValues = null }) {
  const store = STORES[storeAlias];
  if (!store) throw new Error(`Store is not allowlisted: ${storeAlias}`);
  requiredPlan(store, plan);
  const intents = plan === 't1' ? t1Intents(store) : catalogPlanIntents(plan, store);
  const targetState = {};
  const changes = [];
  const skipped = [];
  for (const intent of intents) {
    if (intent.skipped) {
      skipped.push(intent);
      continue;
    }
    const current = currentValues && Object.hasOwn(currentValues, intent.key)
      ? currentValues[intent.key]
      : intent.before;
    targetState[intent.key] = intent.after;
    if (stable(current) === stable(intent.after)) continue;
    changes.push({ ...intent, before: current });
  }
  const pendingStore = !store.domain;
  return {
    targetState,
    document: {
      schema_version: 1,
      plan,
      mode: 'dry-run',
      deterministic: true,
      idempotent: true,
      store: { alias: storeAlias, domain: store.domain, role: store.role, preset: store.preset },
      baseline: {
        source: plan === 't1' ? 'docs/demo-store/products.csv and docs/demo-store/blog.md' : `docs/demo-import/data/${plan === 't2' ? 'imprint' : 'archive'}.json + historical import inventory`,
        live_admin_read: false,
        note: pendingStore
          ? 'Destination demo store does not exist yet. Select and reread its resources before applying these operations.'
          : 'No Admin API credentials are configured; before-values are source snapshots, not a live store read.',
      },
      changes,
      skipped,
      change_count: changes.length,
      skipped_count: skipped.length,
      mutations_sent: 0,
      operations: changes.map(({ resource, selector, field, before, after, mutation }) => ({
        mutation,
        resource,
        selector,
        field,
        before,
        after,
      })),
      safety: {
        no_resource_ids_embedded: true,
        no_theme_publish_or_delete: true,
        no_product_or_collection_delete: true,
        no_shop_settings_or_metafields: true,
        apply_supported: false,
        reason_apply_disabled: 'R4 execution is dry-run only; an authorized operator must reread and apply emitted operations.',
      },
    },
  };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const flag = (name) => {
    const index = args.indexOf(name);
    return index < 0 ? null : args[index + 1] || null;
  };
  const storeAlias = flag('--store');
  const plan = flag('--plan');
  if (args.includes('--apply')) {
    process.stderr.write('Refusing --apply: this R4 planner is dry-run-only and sends no mutations.\n');
    process.exitCode = 2;
  } else if (!storeAlias || !plan) {
    process.stderr.write('Usage: node catalog-r4.mjs --store <allowlisted-alias> --plan t1|t2|t3 [--out path]\n');
    process.exitCode = 2;
  } else {
    try {
      const { document } = buildPlan({ storeAlias, plan });
      const defaultOut = join(ROOT, 'docs/demo-store/plans', `catalog-r4-${storeAlias}-${plan}.json`);
      const outputPath = resolve(flag('--out') || defaultOut);
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`);
      process.stdout.write(`${JSON.stringify({ output: outputPath, store: document.store, plan, changes: document.change_count, skipped: document.skipped_count, mutations_sent: document.mutations_sent, live_admin_read: document.baseline.live_admin_read })}\n`);
    } catch (error) {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 2;
    }
  }
}

