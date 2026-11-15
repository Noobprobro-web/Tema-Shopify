async (page) => {
  const ctx = page.context();
  const S = [['contour','contour-ho5kbo9x.myshopify.com'],['maison','maison-10oym9w0.myshopify.com'],['annex','annex-r0zzjfjf.myshopify.com'],['atelier','sartorial-atelier.myshopify.com'],['edition','sartorial-edition.myshopify.com'],['archive','sartorial-archive.myshopify.com']];
  const PDP = {contour: '/products/handwoven-wool-throw-natural', maison: '/products/wide-serving-bowl', annex: '/products/field-notes-botanical-print'};
  const INIT = `window.__v={lcp:0,cls:0,fcp:0,lt:0,ltCount:0};try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__v.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__v.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.name==='first-contentful-paint')window.__v.fcp=e.startTime}).observe({type:'paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__v.ltCount++;if(e.duration>50)window.__v.lt+=e.duration-50}}).observe({type:'longtask',buffered:true});}catch(e){}`;
  const measure = async (url) => {
    const runs = [];
    for (let i = 0; i < 2; i++) {
      const p = await ctx.newPage();
      await p.setViewportSize({width: 390, height: 844});
      await p.addInitScript(INIT);
      const cdp = await ctx.newCDPSession(p);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
      await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8});
      await cdp.send('Emulation.setCPUThrottlingRate', {rate: 4});
      await p.goto(url, {waitUntil: 'load', timeout: 90000}); await p.waitForTimeout(3000);
      const v = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const res = performance.getEntriesByType('resource'); return Object.assign({}, window.__v, {ttfb: n.responseStart, load: n.loadEventEnd, kb: Math.round((res.reduce((a, r) => a + (r.transferSize || 0), 0) + n.transferSize) / 1024), req: res.length + 1}); });
      runs.push(v); await p.close();
    }
    const med = k => Math.round(runs.map(r => r[k]).sort((a, b) => a - b)[0]);
    return {lcp: med('lcp'), fcp: med('fcp'), tbt: med('lt'), cls: Math.max(...runs.map(r => r.cls)).toFixed(3), ttfb: med('ttfb'), load: med('load'), kb: runs[0].kb, req: runs[0].req};
  };
  const out = {};
  for (const [k, h] of S) {
    out[k] = {home: await measure('https://' + h + '/')};
    if (PDP[k]) out[k].pdp = await measure('https://' + h + PDP[k]);
  }
  return JSON.stringify(out);
}
