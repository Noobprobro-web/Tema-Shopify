// LEAD-001 · M-01/R4: comprueba en vivo colección desk-and-study, políticas y enlaces del pie.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/02-m01-verify.mjs [etiqueta] [atelier,edition,archive]
// Una tienda cada vez (limitador 429): reutiliza unlock()/pace() del harness FINAL-002.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORES, launch, unlock } from '../harness-AUDIT-FINAL-002/lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const label = process.argv[2] || 'run';
const only = process.argv[3] ? process.argv[3].split(',') : Object.keys(STORES);
const out = path.join(here, `results-02-m01-${label}.jsonl`);
fs.writeFileSync(out, '');
const log = (row) => {
  fs.appendFileSync(out, JSON.stringify(row) + '\n');
  console.log(`${row.store.padEnd(8)} ${String(row.status).padEnd(4)} ${row.check} ${row.detail || ''}`);
};

const POLICIES = ['privacy-policy', 'refund-policy', 'shipping-policy', 'terms-of-service', 'contact-information'];

const browser = await launch();
try {
  for (const [store, { url }] of Object.entries(STORES).filter(([name]) => only.includes(name))) {
    const context = await browser.newContext();
    await unlock(context, url);
    const page = await context.newPage();

    for (const handle of POLICIES) {
      const response = await page.goto(`${url}/policies/${handle}`, { waitUntil: 'load' });
      const title = await page.locator('h1').first().textContent().catch(() => '');
      log({ store, check: `policy:${handle}`, status: response?.status(), detail: `${page.url().replace(url, '')} h1="${(title || '').trim()}"` });
    }

    if (store === 'edition') {
      const response = await page.goto(`${url}/collections/desk-and-study`, { waitUntil: 'load' });
      const cards = await page.locator('.product-grid__item').count();
      log({ store, check: 'collection:desk-and-study', status: response?.status(), detail: `cards=${cards}` });

      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      const bento = page.locator('a[href*="/collections/desk-and-study"]').first();
      if (await bento.count()) {
        const [nav] = await Promise.all([page.waitForNavigation({ waitUntil: 'load' }), bento.click()]);
        const title = await page.locator('h1').first().textContent().catch(() => '');
        log({ store, check: 'bento-click', status: nav?.status(), detail: `${page.url().replace(url, '')} h1="${(title || '').trim()}"` });
      } else {
        log({ store, check: 'bento-click', status: 'n/a', detail: 'no link to /collections/desk-and-study on home' });
      }
    }

    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    // Solo el menú del pie del tema (menú `footer`); otros <footer> de la página no cuentan.
    const footerLinks = await page.$$eval('.site-footer__menu a[href]', (anchors) =>
      [...new Set(anchors.map((a) => a.getAttribute('href')))].filter((href) => href.startsWith('/'))
    );
    log({ store, check: 'footer:links', status: 'info', detail: footerLinks.join(' ') });
    for (const href of footerLinks.filter((h) => /^\/(policies|collections|pages)\//.test(h))) {
      const response = await page.goto(url + href, { waitUntil: 'load' });
      log({ store, check: `footer:${href}`, status: response?.status() });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`\n→ ${path.relative(process.cwd(), out)}`);
