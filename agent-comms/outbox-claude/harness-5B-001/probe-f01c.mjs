// 5B-002, F01. Sonda: en que momento el navegador suelta el foco y a donde va en cada ruta.
// Uso (desde esta carpeta, con los sitios ya renderizados): node probe-f01c.mjs [carpeta] ; CHROMIUM_PATH opcional.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const server = spawn('python3', ['-m', 'http.server', '8125', '--bind', '127.0.0.1', '--directory', (process.argv[2] || fileURLToPath(new URL('.', import.meta.url)))], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const state = (page) => page.evaluate(() => { const d = document.querySelector('dialog.product-zoom'); const a = document.activeElement; return d.contains(a) ? (a.getAttribute('aria-label') || a.textContent.trim()) : a.tagName; });
for (const site of ['site-5b001', 'site']) {
  const row = [];
  const fresh = async () => { const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }); await page.goto(`http://127.0.0.1:8125/${site}/pdp-zoom.html`, { waitUntil: 'networkidle' }); await page.locator('[data-zoom-open]').first().click(); return page; };
  let page = await fresh(); await page.locator('[data-zoom-in]').click(); await page.locator('[data-zoom-reset]').click(); row.push(['Reset (clic)', await state(page)]); await page.close();
  page = await fresh(); await page.locator('[data-zoom-in]').focus(); for (let i = 0; i < 3; i += 1) await page.keyboard.press('Enter'); row.push(['Acercar al maximo (Enter x3)', await state(page)]);
  for (let i = 0; i < 3; i += 1) await page.keyboard.press('Enter'); row.push(['Enter x3 mas desde ahi', await state(page) + ` / abierto=${await page.evaluate(() => document.querySelector('dialog.product-zoom').open)}`]); await page.close();
  page = await fresh(); await page.locator('[data-zoom-in]').click(); await page.locator('[data-zoom-out]').focus(); await page.keyboard.press('Enter'); row.push(['Alejar a 1x (Enter)', await state(page)]); await page.close();
  page = await fresh(); await page.locator('[data-zoom-step="1"]').focus(); for (let i = 0; i < 3; i += 1) await page.keyboard.press('Enter'); row.push(['Siguiente hasta la 4/4', await state(page)]); await page.close();
  page = await fresh(); await page.locator('[data-zoom-step="1"]').click(); await page.locator('[data-zoom-step="-1"]').focus(); await page.keyboard.press('Enter'); row.push(['Anterior hasta la 1/4', await state(page)]); await page.close();
  console.log(site); row.forEach(([k, v]) => console.log('  ' + k.padEnd(30) + v));
}
await browser.close(); server.kill();
