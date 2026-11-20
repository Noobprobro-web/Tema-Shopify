// 9. model-viewer-ui.css: 0 requests on a product without 3D, exactly 1 with 3D; flicker (capture at 50 ms and 500 ms after DOMContentLoaded).
import { chromium, ctxFor, nav, save, sleep, pace, O, shot, THEMES, watch, themeConsole, newCtx } from './common.mjs';
const out = { when: new Date().toISOString(), runs: [] };
const browser = await chromium.launch();
const which = (process.env.PRESETS || 'sartorial,imprint,archive,pkg').split(',');
const SHEET = /model-viewer-ui\.css/;
const SHOTS = '/tmp/claude-0/-home-user-Tema-Shopify/48068f27-de8d-56a7-8d32-7f4b623543a8/scratchpad/t6/shots';
try {
  for (const preset of which) for (const [kind, path] of [['no3d', '/products/serra-coat'], ['with3d', '/products/fixture-media-3d-video']]) {
    const ctx = await ctxFor(browser, 'desktop'); const page = await ctx.newPage(); const w = watch(page); const run = { preset, kind, path };
    try {
      await pace();
      const t0 = Date.now();
      let dcl = null; page.on('domcontentloaded', () => { dcl = Date.now(); });
      const shots = {};
      const nav1 = page.goto(`${O}${path}?preview_theme_id=${THEMES[preset]}`, { waitUntil: 'domcontentloaded' });
      await nav1; await page.waitForFunction(() => document.readyState !== 'loading'); const dcl0 = Date.now();
      await sleep(Math.max(0, 50 - (Date.now() - dcl0)));
      shots.t50 = await page.evaluate(() => { const l = document.getElementById('ModelViewerUIStyles'); return { linkPresent: !!l, sheetLoaded: !!l && !!l.sheet, mvUiPresent: !!document.querySelector('.shopify-model-viewer-ui'), mvDefined: !!customElements.get('model-viewer'), poster: !!document.querySelector('model-viewer')?.shadowRoot }; });
      const buf50 = await page.screenshot({ path: `${SHOTS}/3d-${preset}-${kind}-50ms.png` });
      await sleep(Math.max(0, 500 - (Date.now() - dcl0)));
      shots.t500 = await page.evaluate(() => { const l = document.getElementById('ModelViewerUIStyles'); return { linkPresent: !!l, sheetLoaded: !!l && !!l.sheet, mvUiPresent: !!document.querySelector('.shopify-model-viewer-ui') }; });
      await page.screenshot({ path: `${SHOTS}/3d-${preset}-${kind}-500ms.png` });
      await page.waitForLoadState('load'); await sleep(2500);
      run.identity = await page.evaluate(() => ({ id: String(Shopify.theme.id), role: Shopify.theme.role }));
      run.shots = shots; run.sheetRequests = w.requests.filter((u) => SHEET.test(u)); run.count = run.sheetRequests.length;
      run.linkTags = await page.evaluate(() => [...document.querySelectorAll('link[href*="model-viewer-ui"]')].map((l) => l.id + ':' + (l.sheet ? 'loaded' : 'noSheet')));
      run.mvRequests = w.requests.filter((u) => /model-viewer|shopify-xr|3d-model|\.glb/.test(u)).map((u) => u.replace(/\?.*/, '').slice(-70)).slice(0, 8);
      run.pass = kind === 'no3d' ? run.count === 0 : run.count === 1;
    } catch (e) { run.error = String(e).slice(0, 300); }
    run.consoleTheme = themeConsole(w); out.runs.push(run); await ctx.close();
  }
} finally { await browser.close(); }
save('09-3d-sheet.json', out);
for (const r of out.runs) console.log(r.preset, r.kind, r.error || `sheetReq=${r.count} pass=${r.pass} t50=${JSON.stringify(r.shots?.t50)} t500=${JSON.stringify(r.shots?.t500)} links=${r.linkTags}`);
