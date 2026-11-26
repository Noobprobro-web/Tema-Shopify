import { expect, test } from '@playwright/test';
import { baseCss } from './support/r3-support.mjs';

const longCountry = 'Saint Helena, Ascension and Tristan da Cunha (SHP £)';
const languageToggle = `<div class="localization-form__toggle" role="group" aria-label="Language">
  <span class="localization-form__item is-active" aria-current="true"><span class="visually-hidden">Current language: English</span>
    <span aria-hidden="true">EN</span></span>
  <span class="localization-form__divider" aria-hidden="true">/</span>
  <button class="localization-form__item localization-form__btn" type="submit" name="language_code" value="es">ES</button>
</div>`;

function drawer({ direction, languages, countries = 2, noJs = false }) {
  const options = Array.from({ length: Math.max(0, countries - 2) }, (_, i) =>
    `<option value="extra-${i}">Additional market ${i + 1} (USD $)</option>`).join('');
  const countrySelector = countries > 1 ? `<div class="localization-form__country-wrapper">
    <div class="localization-form__country-select-wrapper">
      <label class="visually-hidden" for="drawer-country">Country</label>
      <select id="drawer-country" class="localization-form__country" name="country_code">
        <option value="SH" selected>${longCountry}</option><option value="US">United States (USD $)</option>${options}
      </select>
    </div>
    <button type="submit" class="button button--secondary localization-form__country-submit">Update preferences</button>
  </div>` : '';
  return `<!doctype html><html lang="en" dir="${direction}" class="${noJs ? 'no-js' : 'js'}">
    <head><meta charset="utf-8"><style>${baseCss()}</style></head><body>
    <theme-drawer><div class="drawer-overlay" data-drawer-overlay>
      <div class="drawer-panel color-scheme-1" data-drawer-panel role="dialog" aria-modal="true" aria-label="Menu">
        <div class="drawer-panel__header"><span class="h3">Menu</span></div>
        <div class="mobile-nav__localization">${countrySelector || languages ? `<localization-form class="localization-form localization-form--header-mobile" data-localization-form>
          <form class="localization-form__form" action="/localization" method="post">
            ${languages ? languageToggle : ''}${countrySelector}
          </form>
        </localization-form>` : ''}</div>
      </div>
    </div></theme-drawer></body></html>`;
}

async function measureCountrySelector(page) {
  return page.getByRole('dialog').evaluate((panel) => {
    const localization = panel.querySelector('.mobile-nav__localization');
    const select = localization.querySelector('select');
    const button = localization.querySelector('.localization-form__country-submit');
    const wrapper = select.parentElement;
    const box = panel.getBoundingClientRect();
    const selectRect = select.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const style = getComputedStyle(localization);
    const chevron = getComputedStyle(wrapper, '::after');
    const left = buttonRect.left - box.left;
    const right = box.right - buttonRect.right;
    return {
      left,
      right,
      inlineStart: style.direction === 'rtl' ? right : left,
      inlineEnd: style.direction === 'rtl' ? left : right,
      selectLeft: selectRect.left - box.left,
      selectRight: box.right - selectRect.right,
      paddingLeft: parseFloat(style.paddingLeft),
      paddingRight: parseFloat(style.paddingRight),
      buttonHeight: buttonRect.height,
      buttonWraps: buttonRect.top >= selectRect.bottom,
      appearance: getComputedStyle(select).appearance,
      chevron: chevron.content,
    };
  });
}

function expectInsideDrawer(geometry, description) {
  expect.soft(geometry.left, description).toBeGreaterThanOrEqual(geometry.paddingLeft - 1);
  expect.soft(geometry.right, description).toBeGreaterThanOrEqual(geometry.paddingRight - 1);
  expect.soft(geometry.inlineEnd, description).toBeGreaterThanOrEqual(geometry.inlineStart - 1);
  expect.soft(geometry.selectLeft, description).toBeGreaterThanOrEqual(geometry.paddingLeft - 1);
  expect.soft(geometry.selectRight, description).toBeGreaterThanOrEqual(geometry.paddingRight - 1);
  expect.soft(geometry.buttonHeight, description).toBeGreaterThanOrEqual(44);
}

for (const direction of ['ltr', 'rtl']) {
  for (const languages of [false, true]) {
    test(`mobile country selector fits the drawer with a long country name (${direction}, language selector ${languages ? 'on' : 'off'})`, async ({ page }) => {
      await page.setContent(drawer({ direction, languages }));
      await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('SH');
      await expect(page.getByRole('combobox').locator('option')).toHaveCount(2);
      await expect(page.getByRole('group', { name: 'Language' })).toHaveCount(languages ? 1 : 0);
      for (const width of [360, 392, 414]) {
        await page.setViewportSize({ width, height: 844 });
        const geometry = await measureCountrySelector(page);
        expectInsideDrawer(geometry, `${direction} at ${width}px, language selector ${languages ? 'on' : 'off'}`);
        expect.soft(geometry.buttonWraps, `${direction} at ${width}px: button wraps below the long country`).toBe(true);
        expect.soft(geometry.chevron, `${direction} at ${width}px: enhanced chevron remains`).toBe('""');
      }
    });
  }
}

test('mobile localization tolerates a single market and many markets with the native select', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.setContent(drawer({ direction: 'ltr', languages: false, countries: 1 }));
  await expect(page.locator('.mobile-nav__localization')).toBeHidden();
  await page.setContent(drawer({ direction: 'ltr', languages: true, countries: 1 }));
  await expect(page.getByRole('group', { name: 'Language' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Country' })).toHaveCount(0);

  for (const direction of ['ltr', 'rtl']) {
    await page.setContent(drawer({ direction, languages: true, countries: 12, noJs: true }));
    await expect(page.getByRole('combobox').locator('option')).toHaveCount(12);
    const geometry = await measureCountrySelector(page);
    expectInsideDrawer(geometry, `${direction} at 360px: native select with 12 markets`);
    expect(geometry.appearance).toBe('auto');
    expect(geometry.chevron).toBe('none');
  }
});
