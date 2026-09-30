// Eje 1: axe-core 4.10.2 (WCAG 2.0/2.1/2.2 A+AA) sobre páginas y estados abiertos (menú, carrito, zoom).
// axe se inyecta como herramienta de prueba (AXE_PATH); no forma parte del tema.
import fs from 'node:fs';
import { STORES, launch, unlock } from './lib.mjs';

const AXE = fs.readFileSync(process.env.AXE_PATH, 'utf8');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function runAxe(page, label) {
  await page.evaluate(AXE + '\n;window.__axeReady = true;').catch(async () => { await page.addScriptTag({ content: AXE }); });
  const res = await page.evaluate(async (tags) => {
    const r = await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
    const slim = (list) => list.map((v) => ({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length, nodes: v.nodes.slice(0, 5).map((n) => ({ target: n.target.join(' ').slice(0, 110), html: n.html.slice(0, 140), why: (n.any[0] || n.all[0] || n.none[0] || {}).message?.slice(0, 200), data: (() => { const d = (n.any[0] || {}).data; return d && d.contrastRatio ? { cr: d.contrastRatio, fg: d.fgColor, bg: d.bgColor, fs: d.fontSize, fw: d.fontWeight, msgKey: d.messageKey } : (d && d.messageKey ? { msgKey: d.messageKey } : undefined); })() })) }));
    return { violations: slim(r.violations), incomplete: slim(r.incomplete) };
  }, TAGS);
  return { label, ...res };
}

const out = [];
const browser = await launch();
const only = process.argv[2];
for (const [name, store] of Object.entries(STORES)) {
  if (only && only !== name) continue;
  for (const vp of [{ n: '375', width: 375, height: 667 }, { n: '1440', width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
    await unlock(context, store.url);
    const page = await context.newPage();
    const go = async (p) => { await page.goto(store.url + p, { waitUntil: 'networkidle' }); await page.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300)); }); };
    const push = async (label) => out.push({ store: name, vp: vp.n, ...(await runAxe(page, label)) });

    await go('/'); await push('home');
    if (vp.n === '375') {
      await page.locator('.site-header__menu-button').first().click(); await page.waitForTimeout(700); await push('home+menu-abierto');
      await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    }
    await page.locator('.predictive-search__trigger').first().click(); await page.waitForTimeout(500);
    await page.keyboard.type('le', { delay: 60 }); await page.waitForTimeout(1500); await push('home+busqueda-predictiva');
    await page.keyboard.press('Escape'); await page.keyboard.press('Escape'); await page.waitForTimeout(400);

    await go('/collections/all'); await push('collection');
    await go('/products/' + store.products[0]); await push('pdp');
    await page.locator('.product-gallery__zoom-trigger').first().click().catch(() => {}); await page.waitForTimeout(700); await push('pdp+zoom');
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await page.locator('.product-form__submit').first().click(); await page.waitForTimeout(2500); await push('pdp+carrito-drawer-lleno');
    await page.keyboard.press('Escape');
    await go('/cart'); await push('cart-lleno');
    await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
    await go('/cart'); await push('cart-vacio');
    await go('/search?q=le'); await push('search');
    await go('/pages/no-existe-404'); await push('404');
    await context.close();
  }
}
await browser.close();
fs.writeFileSync(new URL('./results-02b-axe' + (only ? '-' + only : '') + '.json', import.meta.url), JSON.stringify(out, null, 1));
for (const r of out) {
  console.log(`${r.store.padEnd(8)} ${r.vp.padEnd(5)} ${r.label.padEnd(28)} violations=${r.violations.length} (${r.violations.map((v) => v.id + '×' + v.n).join(', ')}) incomplete=${r.incomplete.map((v) => v.id + '×' + v.n).join(', ')}`);
  for (const v of r.violations) for (const n of v.nodes) console.log(`     [${v.impact}] ${v.id}: ${n.target} ${n.data ? JSON.stringify(n.data) : ''} :: ${n.why || ''}`);
}
