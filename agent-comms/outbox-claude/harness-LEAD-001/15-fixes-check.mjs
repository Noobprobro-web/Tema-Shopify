// LEAD-001 · Verificacion de los arreglos de la auditoria visual contra `shopify theme dev`.
// Uso: node agent-comms/outbox-claude/harness-LEAD-001/15-fixes-check.mjs [base]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://127.0.0.1:9393';
const out = path.join(here, 'evidence', 'fixes');
fs.mkdirSync(out, { recursive: true });
const report = {};

const browser = await chromium.launch();
for (const [vw, vh, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const context = await browser.newContext({ viewport: { width: vw, height: vh }, reducedMotion: 'reduce' });
  const page = await context.newPage();

  // 1. Politicas
  for (const handle of ['terms-of-service', 'contact-information']) {
    await page.goto(`${base}/policies/${handle}`, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    report[`policy-${handle}-${tag}`] = await page.evaluate(() => {
      const box = (s) => document.querySelector(s)?.getBoundingClientRect();
      const fs = (s) => parseFloat(getComputedStyle(document.querySelector(s) || document.body).fontSize);
      const h1 = document.querySelector('.shopify-policy__title h1');
      return {
        containerLeft: Math.round(box('.shopify-policy__container')?.left), headerLeft: Math.round(box('.site-header .container, .site-header__inner, .site-header')?.left),
        h1: fs('.shopify-policy__title h1'), h2: document.querySelector('.shopify-policy__body h2') ? fs('.shopify-policy__body h2') : null, p: fs('.shopify-policy__body p'),
        h1Lines: h1 ? Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight || 1)) : null,
        gapTop: Math.round(box('.shopify-policy__title')?.top - box('.site-header')?.bottom),
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    await page.screenshot({ path: path.join(out, `policy-${handle}-${tag}.jpg`), type: 'jpeg', quality: 60, fullPage: true });
  }

  // 2. Alineacion de la portada: borde izquierdo de cada seccion frente al del header.
  await page.goto(`${base}/`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  report[`home-edges-${tag}`] = await page.evaluate(() => {
    const left = (s) => { const n = document.querySelector(s); return n ? Math.round(n.getBoundingClientRect().left) : null; };
    return {
      header: left('.site-header .container'), footer: left('.site-footer .container'),
      hero: left('.hero-editorial--split .hero-editorial__inner'), showcase: left('.curated-showcase__inner'), bento: left('.bento-discovery__inner'),
      manifesto: left('.brand-manifesto__inner'), lookbook: left('.lookbook__inner'), ctl: left('.complete-the-look__inner'),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });

  // 3. Contacto: h2 por debajo del h1.
  await page.goto(`${base}/pages/contact`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  report[`contact-${tag}`] = await page.evaluate(() => ({
    h1: parseFloat(getComputedStyle(document.querySelector('.main-contact__title')).fontSize),
    h2: [...document.querySelectorAll('.main-contact__layout h2')].map((n) => parseFloat(getComputedStyle(n).fontSize)),
  }));

  // 4. PDP agotada (chaqueta 1990, sin stock tras el pedido de prueba) y pieza 1-de-1 disponible.
  for (const handle of ['1990-pinstripe-double-breasted-jacket', '1997-printed-silk-square']) {
    await page.goto(`${base}/products/${handle}`, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const inc = page.locator('main [data-quantity-button="increase"]').first();
    for (let i = 0; i < 3; i++) if (await inc.isEnabled().catch(() => false)) await inc.click();
    await page.waitForTimeout(300);
    report[`pdp-${handle}-${tag}`] = await page.evaluate(() => {
      const m = document.querySelector('main');
      const q = m.querySelector('[data-quantity-input]');
      const lt = m.querySelector('[data-line-total]');
      return { value: q?.value, max: q?.getAttribute('max'), incDisabled: m.querySelector('[data-quantity-button="increase"]')?.disabled,
        lineTotalShown: lt ? !lt.hasAttribute('data-empty') : null, lineTotalText: lt?.innerText.trim(), lineTotalHeight: lt ? Math.round(lt.getBoundingClientRect().height) : null,
        atc: m.querySelector('.product-form__submit')?.innerText.trim() };
    });
  }
  await context.close();
}
await browser.close();
fs.writeFileSync(path.join(here, 'results-15-fixes-check.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
