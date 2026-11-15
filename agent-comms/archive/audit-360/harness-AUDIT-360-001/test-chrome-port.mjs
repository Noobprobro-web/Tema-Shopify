import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const USER_DATA = path.join(process.cwd(), 'harness-AUDIT-360-001', 'chrome-profile');

if (!fs.existsSync(USER_DATA)) {
  fs.mkdirSync(USER_DATA, { recursive: true });
}

// 1. Launch Chrome process directly
const chrome = spawn(CHROME_PATH, [
  '--remote-debugging-port=9222',
  `--user-data-dir=${USER_DATA}`,
  '--headless=new',
  '--no-first-run',
  '--no-default-browser-check'
], { stdio: 'ignore', detached: false });

console.log('Chrome spawned, PID:', chrome.pid);

async function run() {
  // Give Chrome 2s to open port
  await new Promise(r => setTimeout(r, 2000));

  // Connect via playwright CDP to set cookies and navigate
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const context = browser.contexts()[0];
  
  const cookiesStr = fs.readFileSync('harness-AUDIT-360-001/storefront-cookies.txt', 'utf8');
  const cookiePairs = cookiesStr.split('; ').map(pair => {
    const [name, ...rest] = pair.split('=');
    return { name, value: rest.join('='), domain: 'tema-qkqpke0j.myshopify.com', path: '/' };
  });
  await context.addCookies(cookiePairs);

  const page = await context.newPage();
  await page.goto('https://tema-qkqpke0j.myshopify.com/?preview_theme_id=165809488115&pb=0', { waitUntil: 'domcontentloaded' });
  console.log('Page loaded in Chrome. URL:', page.url(), 'Title:', await page.title());

  // Close page and disconnect CDP (leaving Chrome running)
  await page.close();
  await browser.close();

  console.log('Ready for Lighthouse on port 9222!');
}

run().catch(err => {
  console.error('Error:', err);
  chrome.kill();
  process.exit(1);
});
