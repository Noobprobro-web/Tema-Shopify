import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const SEL = '.hero-editorial__heading, .product-main__title, .featured-product__title, .collection-main__title, .cart-page__header h1, .bento-discovery__heading, .brand-manifesto__quote h2, .complete-the-look__heading, .product-recommendations__header h2, .main-search__title, .lookbook__heading, .curated-showcase__heading';
for (const scale of [1.0, 1.1, 1.3]) for (const w of [360, 1440]) {
  const res = [];
  for (const file of ['home.html', 'pdp-multi.html', 'cart-long.html', 'bundle.html']) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`http://127.0.0.1:8099/preset-Archive/${file}`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(([sel, k]) => {
      const out = [];
      document.querySelectorAll(sel).forEach((e) => { const fs = parseFloat(getComputedStyle(e).fontSize); e.style.fontSize = `${fs * k}px`; });
      document.querySelectorAll(sel).forEach((e) => {
        const cs = getComputedStyle(e); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15; const r = e.getBoundingClientRect();
        // longest word must fit without breaking mid-word
        const range = document.createRange(); let broken = false;
        out.push({ cls: e.className.split(' ')[0] || e.tagName, fs: Math.round(parseFloat(cs.fontSize)), lines: Math.round(r.height / lh), over: e.scrollWidth > e.clientWidth + 1 || r.right > document.documentElement.clientWidth });
      });
      return { items: out, docOver: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    }, [SEL, scale]);
    res.push(...r.items.map((i) => ({ ...i, file })), ...(r.docOver ? [{ cls: 'DOC', over: r.docOver, file }] : []));
    await p.close();
  }
  console.log(`escala ${scale} @${w}: ` + res.map((x) => `${x.cls.replace(/^.*__/, '')} ${x.fs ?? ''}px/${x.lines ?? ''}l${x.over ? ' DESBORDA' : ''}`).join(' · '));
}
await b.close();
