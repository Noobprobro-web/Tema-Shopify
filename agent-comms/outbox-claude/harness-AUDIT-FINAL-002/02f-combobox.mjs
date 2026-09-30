// Eje 1: búsqueda predictiva como combobox ARIA con una consulta que sí devuelve resultados en cada
// tienda (02d usó "le", que en estos catálogos da 0 sugerencias). Comprueba aria-expanded,
// aria-activedescendant, anuncio en la región viva, flechas, Escape y peticiones por pulsación.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const QUERY = { atelier: 'coat', edition: 'leather', archive: 'silk' };
const STATE = () => {
  const i = document.querySelector('.predictive-search__input');
  const list = document.getElementById(i.getAttribute('aria-controls'));
  const act = i.getAttribute('aria-activedescendant');
  const actEl = act ? document.getElementById(act) : null;
  return {
    role: i.getAttribute('role'), expanded: i.getAttribute('aria-expanded'), autocomplete: i.getAttribute('aria-autocomplete'), controlsExists: !!list, listRole: list?.getAttribute('role') || list?.querySelector('[role="listbox"]')?.getAttribute('role') || null,
    options: list ? list.querySelectorAll('[role="option"]').length : 0, groups: list ? [...list.querySelectorAll('[role="group"], h3, h2')].map((g) => g.textContent.trim().slice(0, 20)) : [],
    active: act, activeText: actEl ? actEl.textContent.replace(/\s+/g, ' ').trim().slice(0, 40) : null, activeSelected: actEl ? actEl.getAttribute('aria-selected') : null,
    focusStaysOnInput: document.activeElement === i,
    status: [...document.querySelectorAll('predictive-search [role="status"], predictive-search [aria-live]')].map((n) => n.textContent.trim().slice(0, 60)).filter(Boolean),
    value: i.value,
  };
};

const out = {};
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await unlock(context, store.url);
  const page = await context.newPage();
  const reqs = [];
  page.on('request', (r) => { if (r.url().includes('/search/suggest')) reqs.push(r.url().split('?')[1].slice(0, 60)); });
  const statuses = [];
  page.on('response', (r) => { if (r.url().includes('/search/suggest')) statuses.push(r.status()); });
  await page.goto(store.url + '/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const trig = page.locator('.predictive-search__trigger').first();
  await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  const o = (out[name] = { query: QUERY[name] });
  o.opened = await page.evaluate(STATE);
  await page.keyboard.type(QUERY[name], { delay: 70 });
  await page.waitForTimeout(2200);
  o.typed = await page.evaluate(STATE);
  o.requests = { count: reqs.length, keystrokes: QUERY[name].length, statuses: [...statuses] };
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(150);
  o.down1 = await page.evaluate(STATE);
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(150);
  o.down2 = await page.evaluate(STATE);
  await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp'); await page.waitForTimeout(150);
  o.upToInput = await page.evaluate(STATE);
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  o.esc1 = await page.evaluate(STATE);
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  o.esc2 = await page.evaluate(() => ({ panelOpen: !document.querySelector('[id^="PredictiveSearchPanel-"]').inert, focusOnTrigger: document.activeElement?.matches('.predictive-search__trigger'), triggerExpanded: document.querySelector('.predictive-search__trigger').getAttribute('aria-expanded') }));
  // Enter con opción activa navega al resultado; sin opción activa, a /search.
  await trig.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  await page.keyboard.type(QUERY[name], { delay: 70 }); await page.waitForTimeout(2000);
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(150);
  const target = await page.evaluate(() => { const i = document.querySelector('.predictive-search__input'); const el = document.getElementById(i.getAttribute('aria-activedescendant')); return el ? (el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || el.closest('a')?.getAttribute('href')) : null; });
  await Promise.all([page.waitForNavigation({ timeout: 10000 }).catch(() => null), page.keyboard.press('Enter')]);
  o.enterOnOption = { expected: target ? target.split('?')[0] : null, landed: page.url().replace(store.url, '').split('?')[0] };
  await context.close();
}
await browser.close();
fs.writeFileSync(new URL('./results-02f-combobox' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const [s, o] of Object.entries(out)) {
  console.log(`\n## ${s} q="${o.query}" peticiones=${o.requests.count}/${o.requests.keystrokes} pulsaciones estados=${o.requests.statuses}`);
  for (const k of ['opened', 'typed', 'down1', 'down2', 'upToInput', 'esc1']) { const v = o[k]; console.log(`  ${k.padEnd(10)} role=${v.role} expanded=${v.expanded} autocomplete=${v.autocomplete} list=${v.listRole} options=${v.options} active=${v.active ? v.active.slice(-24) : null} "${v.activeText}" sel=${v.activeSelected} focoEnInput=${v.focusStaysOnInput} value="${v.value}" status=${JSON.stringify(v.status)} grupos=${JSON.stringify(v.groups)}`); }
  console.log('  esc2', JSON.stringify(o.esc2), 'enterOnOption', JSON.stringify(o.enterOnOption));
}
