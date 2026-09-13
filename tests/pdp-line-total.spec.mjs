import { expect, test } from '@playwright/test';

const explicitProductPath = process.env.PDP_PATH;

function formatWithDelimiters(cents, precision = 2, thousands = ',', decimal = '.') {
  const amount = Number(cents) / 100;
  const fixed = amount.toFixed(precision);
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return fraction === undefined ? grouped : `${grouped}${decimal}${fraction}`;
}

function formatMoney(cents, template) {
  const match = template.match(/\{\{\s*(amount(?:_no_decimals|_with_comma_separator|_no_decimals_with_comma_separator|_with_apostrophe_separator)?)\s*\}\}/);
  if (!match) throw new Error(`Unsupported Shopify money format: ${template}`);

  const formats = {
    amount: () => formatWithDelimiters(cents, 2, ',', '.'),
    amount_no_decimals: () => formatWithDelimiters(cents, 0, ',', '.'),
    amount_with_comma_separator: () => formatWithDelimiters(cents, 2, '.', ','),
    amount_no_decimals_with_comma_separator: () => formatWithDelimiters(cents, 0, '.', ','),
    amount_with_apostrophe_separator: () => formatWithDelimiters(cents, 2, "'", '.'),
  };

  return template.replace(match[0], formats[match[1]]());
}

async function productCandidates(page) {
  if (explicitProductPath) return [explicitProductPath];

  await page.goto('/collections/all', { waitUntil: 'domcontentloaded' });
  const hrefs = await page.locator('a[href*="/products/"]').evaluateAll((anchors) => (
    [...new Set(anchors.map((anchor) => anchor.href))]
  ));

  return hrefs.slice(0, 24);
}

async function inspectProduct(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const root = page.locator('variant-selects[data-line-total-template]').first();
  if (await root.count() === 0) return null;

  await expect(root).toBeVisible();
  const variants = JSON.parse(await root.locator('[data-variant-json]').textContent());
  return { root, variants };
}

function supportsRequestedQuantities(variant) {
  const min = Number(variant.quantity_min ?? 1);
  const increment = Number(variant.quantity_increment ?? 1);
  const max = variant.quantity_max === null ? Infinity : Number(variant.quantity_max);
  return !variant.requires_selling_plan && min <= 1 && increment === 1 && max >= 3;
}

async function openEligibleProduct(page, { compare = false } = {}) {
  const candidates = await productCandidates(page);

  for (const candidate of candidates) {
    const inspected = await inspectProduct(page, candidate);
    if (!inspected) continue;

    const variant = inspected.variants.find((item) => (
      supportsRequestedQuantities(item)
      && (!compare || Number(item.compare_at_price_cents) > Number(item.price_cents))
    ));
    if (!variant) continue;

    const target = new URL(candidate, page.url());
    target.searchParams.set('variant', variant.id);
    const selected = await inspectProduct(page, target.href);
    if (!selected) continue;

    const selectedId = await selected.root.locator('[data-variant-id]').first().inputValue();
    const selectedVariant = selected.variants.find((item) => String(item.id) === selectedId);
    if (!selectedVariant || !supportsRequestedQuantities(selectedVariant)) continue;

    return { ...selected, variant: selectedVariant, url: target.href };
  }

  return null;
}

async function setQuantity(input, value) {
  await input.evaluate((element, nextValue) => {
    element.value = nextValue;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

async function expectLineTotalHidden(lineTotal) {
  await expect(lineTotal).toHaveAttribute('data-empty', '');
  await expect(lineTotal).toBeHidden();
  await expect(lineTotal).not.toContainText('NaN');
}

test.describe('PDP line total', () => {
  test('keeps unit price immutable and handles valid and hostile quantities', async ({ page }) => {
    const context = await openEligibleProduct(page);
    expect(context, 'No eligible product with quantity 1-3 was found. Set PDP_PATH to a test product.').not.toBeNull();

    const { root, variant } = context;
    const quantity = root.locator('[data-quantity-input]');
    const lineTotal = root.locator('[data-line-total]');
    const lineLabel = lineTotal.locator('[data-line-total-label]');
    const lineCurrent = lineTotal.locator('[data-line-total-current]');
    const unitCurrent = root.locator('[data-current-price]').first();
    const moneyFormat = await root.getAttribute('data-money-format');
    const labelTemplate = await root.getAttribute('data-line-total-template');
    const initialUnitPrice = await unitCurrent.textContent();

    await setQuantity(quantity, '1');
    await expectLineTotalHidden(lineTotal);

    for (const value of [2, 3, 2]) {
      await setQuantity(quantity, String(value));
      await expect(lineTotal).toBeVisible();
      await expect(lineTotal).not.toHaveAttribute('data-empty', '');
      await expect(lineLabel).toHaveText(labelTemplate.replace('[quantity]', String(value)));
      await expect(lineCurrent).toHaveText(formatMoney(Number(variant.price_cents) * value, moneyFormat));
      await expect(unitCurrent).toHaveText(initialUnitPrice);
    }

    for (const value of ['', '0', '-1', 'abc']) {
      await setQuantity(quantity, value);
      await expectLineTotalHidden(lineTotal);
      await expect(lineTotal).toHaveText('');
      await expect(unitCurrent).toHaveText(initialUnitPrice);
    }

    await setQuantity(quantity, '1');
    await expectLineTotalHidden(lineTotal);
    await expect(lineTotal).toHaveText('');
    await expect(unitCurrent).toHaveText(initialUnitPrice);
  });

  test('renders and clears the compare-at line total when catalog data permits', async ({ page }) => {
    const context = await openEligibleProduct(page, { compare: true });
    test.skip(!context, 'The connected catalog has no eligible compare-at-price variant.');

    const { root, variant } = context;
    const quantity = root.locator('[data-quantity-input]');
    const lineTotal = root.locator('[data-line-total]');
    const compare = lineTotal.locator('[data-line-total-compare]');
    const compareValue = lineTotal.locator('[data-line-total-compare-value]');
    const moneyFormat = await root.getAttribute('data-money-format');

    await setQuantity(quantity, '2');
    await expect(compare).toBeVisible();
    await expect(compareValue).toHaveText(formatMoney(Number(variant.compare_at_price_cents) * 2, moneyFormat));
    await expect.poll(() => compare.evaluate((element) => getComputedStyle(element).textDecorationLine)).toContain('line-through');

    await setQuantity(quantity, '1');
    await expect(compare).toBeHidden();
    await expect(compareValue).toHaveText('');
  });
});
