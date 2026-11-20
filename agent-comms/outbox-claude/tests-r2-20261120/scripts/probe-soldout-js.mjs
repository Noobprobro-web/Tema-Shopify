import { chromium, ctxFor, nav, THEMES, sleep } from './common.mjs';
const b = await chromium.launch(); const ctx = await ctxFor(b, 'desktop'); const page = await ctx.newPage();
await nav(page, '/products/fixture-many-variants?variant=68445343514928', THEMES.sartorial, 2500);
console.log(JSON.stringify(await page.evaluate(() => ({
  url: location.href.replace(/preview_theme_id=\d+/, ''),
  forms: [...document.querySelectorAll('form[action*="/cart/add"]')].map((f) => ({ id: f.id, hidden: [...f.querySelectorAll('input[name=id]')].map((i) => i.value + ':' + i.disabled), buttons: [...f.querySelectorAll('button[type=submit],button[name=add]')].map((x) => ({ text: x.textContent.trim().replace(/\s+/g, ' '), disabled: x.disabled, ariaDisabled: x.getAttribute('aria-disabled') })), selects: [...f.querySelectorAll('select')].map((s) => s.value + ':' + s.disabled) })),
  radios: [...document.querySelectorAll('input[type=radio]:checked')].map((r) => r.name + '=' + r.value), status: document.querySelector('[data-variant-status]')?.textContent.trim(), vs: document.querySelector('variant-selects')?.dataset ? Object.keys(document.querySelector('variant-selects').dataset) : null,
})), null, 1));
await b.close();
