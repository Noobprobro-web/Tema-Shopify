export const PRESET_VENDORS = Object.freeze({
  sartorial: 'Line & Form',
  imprint: 'Field & Form',
  archive: 'Archive Index',
});

export const PRESET_AUTHORS = Object.freeze({
  sartorial: 'Mara Ellery',
  imprint: 'Eli Mercer',
  archive: 'Rowan Vale',
});

// Editorial copy uses only details already present in the source product names and descriptions.
export const PRODUCT_COPY = Object.freeze({
  'serra-coat': 'A long wrap coat with a quiet line through the body.',
  'doppio-trench': 'A double-breasted trench with a clean, straight profile.',
  'cocoon-cardigan-coat': 'An open-front knit coat with a rounded silhouette.',
  'nove-blazer': 'A single-breasted blazer with notch lapels.',
  'cropped-tailored-jacket': 'A cropped jacket with a compact shape and considered proportions.',
  'pleated-wide-trouser': 'A wide-leg trouser with front pleats.',
  'cigarette-trouser': 'A straight trouser with a narrow leg.',
  'cashmere-rib-crew': 'A ribbed crew-neck knit.',
  'fine-merino-turtleneck': 'A fine-gauge turtleneck with a close, clean line.',
  'oversized-alpaca-knit': 'An oversized jumper with a dropped shoulder.',
  'poplin-column-shirt': 'A long, straight shirt with a clean collar.',
  'silk-charmeuse-blouse': 'A fluid blouse with a soft collar.',
  'striped-cotton-shirt': 'A striped shirt with a classic collar.',
  'bias-cut-slip-dress': 'A slip dress cut on the bias with narrow straps.',
  'wrap-wool-skirt': 'A midi wrap skirt with a clean front.',
  'pleated-midi-skirt': 'A pleated midi skirt with a fluid line.',
  'leather-belt': 'A plain belt with a metal buckle.',
  'cashmere-scarf': 'A wide scarf in one size.',
  'silk-twill-square': 'A square scarf in silk twill, shaped for versatile styling.',
  'structured-tote': 'A structured tote bag with two handles.',
  'long-title-fixture-wrap-coat': 'A double-faced wool and cashmere wrap coat with a detachable belt and oversized collar.',
});

export const FIXTURE_TITLES = Object.freeze({
  'fixture-media-3d-video': {
    title: 'Studio Form Object',
    source: 'Historical R2 storefront probe; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-many-variants': {
    title: 'Many-Variant Tailored Jacket',
    source: 'Historical R2 storefront probe and created-fixtures snapshot; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-long-title': {
    title: 'Double-Breasted Merino Overcoat with a Detachable Collar',
    source: 'Historical R2 storefront probe and created-fixtures snapshot; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-single-variant-no-vendor': {
    title: 'Ribbed Cotton Jersey Tee',
    source: 'Historical created-fixtures snapshot; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-with-vendor': {
    title: 'Cotton Jersey Long-Sleeve Tee',
    source: 'Historical created-fixtures snapshot; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-focal-point': {
    title: 'Focal-Point Scarf',
    source: 'Historical R2 storefront probe and created-fixtures snapshot; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-color-only': {
    title: 'Leather Belt in Three Colors',
    source: 'Historical R2 storefront probe; search by exact handle and skip if missing.',
    conditional: true,
  },
  'fixture-long-swatches': {
    title: 'Long-Swatch Overshirt',
    source: 'Historical R2 storefront probe and created-fixtures snapshot; search by exact handle and skip if missing.',
    conditional: true,
  },
  'long-title-fixture-wrap-coat': {
    title: 'Double-Faced Wool and Cashmere Wrap Coat with Detachable Belt, Oversized Collar and Longline Silhouette in Soft Ink Navy',
    source: 'docs/demo-store/products.csv',
    conditional: false,
  },
});

export const BLOG_COPY = Object.freeze({
  'welcome-to-the-demo-store': {
    title: 'A study in proportion',
    body: '<p>A line begins at the shoulder, then softens through the body. We look at proportion as a way to bring ease to the pieces worn every day.</p>',
    tags: ['journal', 'tailoring'],
  },
  'how-to-read-the-size-chart': {
    title: 'How to read garment measurements',
    body: '<p>Lay a similar piece flat and compare its shoulder, chest and length with the measurements in this size guide. Choose the closest match.</p>',
    tags: ['guide', 'fit'],
  },
});

export const GIFT_CARD_COPY = 'A gift card for a piece chosen by its recipient.';

export const COLLECTIONS = Object.freeze({
  imprint: [
    { handle: 'daily-objects', title: 'Daily objects', tag: 'daily-objects' },
    { handle: 'desk-and-study', title: 'Desk and study', tag: 'desk-and-study' },
    { handle: 'leather-goods', title: 'Leather goods', tag: 'leather-goods' },
  ],
  archive: [
    { handle: 'permanent-archive', title: 'Permanent archive', tag: 'permanent-archive' },
    { handle: 'restored-pieces', title: 'Restored pieces', tag: 'restored-pieces' },
  ],
});

