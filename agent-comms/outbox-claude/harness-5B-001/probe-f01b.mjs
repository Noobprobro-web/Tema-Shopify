// 5B-002, F01. Sonda: en que momento el navegador suelta el foco y a donde va en cada ruta.
// Uso (desde esta carpeta, con los sitios ya renderizados): node probe-f01b.mjs [carpeta] ; CHROMIUM_PATH opcional.
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const server = spawn('python3', ['-m', 'http.server', '8124', '--bind', '127.0.0.1', '--directory', (process.argv[2] || fileURLToPath(new URL('.', import.meta.url)))], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('http://127.0.0.1:8124/site/pdp-zoom.html', { waitUntil: 'networkidle' });
await page.locator('[data-zoom-open]').first().click();
await page.locator('[data-zoom-in]').click();
console.log(await page.evaluate(() => {
  const z = document.querySelector('product-zoom'); const r = z.resetButton; r.focus();
  const log = [['antes', document.activeElement === r]];
  r.hidden = true; log.push(['tras hidden', document.activeElement.tagName]);
  r.hidden = false; r.focus(); log.push(['refocus', document.activeElement === r]);
  z.outButton.focus(); z.outButton.disabled = true; log.push(['tras disabled', document.activeElement.tagName]);
  z.outButton.disabled = false; r.focus();
  const orig = z.apply.bind(z); let inside;
  z.apply = () => { orig(); inside = document.activeElement.tagName + ' ' + (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent.trim()); };
  z.zoomTo(1); log.push(['tras zoomTo', inside]);
  return JSON.stringify(log);
}));
await browser.close(); server.kill();
