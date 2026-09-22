import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const T = [
  ['home.html', '.hero-editorial__heading', 'Hero h1'],
  ['home.html', '.site-header__brand-text', 'Marca'],
  ['home.html', '.hero-editorial__subheading', 'Subtitulo hero'],
  ['pdp-multi.html', '.product-main__title', 'Titulo de producto'],
  ['pdp-multi.html', '.product-main__description', 'Descripcion (cuerpo)'],
  ['pdp-multi.html', '.product-details__heading', 'Titulo acordeon'],
  ['cart-long.html', '.cart-page__header h1', 'H1 carrito'],
  ['cart-long.html', '.cart-item__title', 'Titulo de linea'],
  ['bundle.html', '.complete-the-look__heading, .complete-the-look h2', 'H2 de seccion'],
  ['bundle.html', '.eyebrow', 'Eyebrow'],
];
const rows = [];
for (const preset of ['Sartorial', 'Edition', 'Archive']) for (const w of [360, 390, 1440]) {
  const cache = {};
  for (const [file, sel, name] of T) {
    if (!cache[file]) { const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.goto(`http://127.0.0.1:8099/preset-${preset}/${file}`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); cache[file] = p; }
    const p = cache[file];
    const r = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; const words = e.textContent.trim().split(/\s+/); return { fs: +parseFloat(cs.fontSize).toFixed(1), ff: cs.fontFamily.split(',')[0].replace(/"/g, ''), lines: Math.round(r.height / lh), elw: Math.round(r.width), over: e.scrollWidth > e.clientWidth + 1, docOver: document.documentElement.scrollWidth - document.documentElement.clientWidth }; }, sel);
    rows.push({ preset, w, name, ...r });
  }
  for (const p of Object.values(cache)) await p.close();
}
await b.close();
const names = [...new Set(rows.map((r) => r.name))];
for (const w of [360, 390, 1440]) {
  console.log(`\n== ${w}px   (tamaño px / lineas)   Sartorial | Edition | Archive`);
  for (const n of names) {
    const cell = (p) => { const r = rows.find((x) => x.preset === p && x.w === w && x.name === n); return r && r.fs ? `${r.fs}px/${r.lines}l${r.over ? ' CORTE' : ''}${r.docOver ? ' DESBORDE' + r.docOver : ''}` : '-'; };
    console.log(`  ${n.padEnd(22)} ${cell('Sartorial').padEnd(16)} ${cell('Edition').padEnd(16)} ${cell('Archive')}`);
  }
}
console.log('\nfuentes:', [...new Set(rows.map((r) => `${r.preset}:${r.name}:${r.ff}`))].filter((x) => /Hero h1|Descripcion/.test(x)).join(' ; '));
