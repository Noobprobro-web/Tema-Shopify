import { chromium } from '/home/claude/w2/node_modules/@playwright/test/index.mjs';
import fs from 'node:fs';
const SD = JSON.parse(fs.readFileSync('/home/claude/w2/config/settings_data.json', 'utf8'));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const PAGES = [
  ['home.html', null], ['pdp-multi.html', async (p) => { await p.fill('[data-quantity-input]', '2'); await p.dispatchEvent('[data-quantity-input]', 'change'); await p.evaluate(() => document.querySelector('sticky-cart-bar').setVisible(true)); }],
  ['cart-long.html', null], ['bundle.html', null],
  ['home.html#drawer', async (p) => { await p.click('.site-header__cart'); await p.waitForTimeout(600); await p.evaluate(() => { const s = document.querySelector('[data-cart-status]'); s.hidden = false; s.textContent = 'Item added to your cart.'; }); }],
  ['home.html#search', async (p) => { await p.click('.predictive-search__trigger'); await p.fill('[id^=PredictiveSearchPanel] input[type=search]', 'coat'); await p.waitForTimeout(900); }],
];
const audit = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (m) { const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; } const s = c.match(/color\(srgb ([^)]+)\)/); if (s) { const v = s[1].split(/[ /]+/).filter(Boolean).map(Number); return [v[0] * 255, v[1] * 255, v[2] * 255, v[3] ?? 1]; } return null; };
  const lum = ([r, g, bb]) => { const f = (x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bb); };
  const blend = (top, under) => { const a = top[3]; return [top[0] * a + under[0] * (1 - a), top[1] * a + under[1] * (1 - a), top[2] * a + under[2] * (1 - a), 1]; };
  const bgOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('linear-gradient(rgba(0, 0, 0, 0)')) return null; const c = parse(cs.backgroundColor); if (c && c[3] > 0) { stack.push(c); if (c[3] >= 1) break; } if (e.matches('img,video,picture,svg')) return null; } let base = [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i], base); return base; };
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (el.closest('[hidden],[inert],[aria-hidden="true"] .visually-hidden,.visually-hidden,script,style,noscript,.skip-link')) continue;
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (el.closest('.hero-editorial--cinematic .hero-editorial__content, .lookbook__media, [class*="__media"]')) continue;
    let op = 1; for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
    if (op < 0.5) continue;
    const bg = bgOf(el); if (!bg) continue; const fgc = parse(cs.color); if (!fgc) continue;
    const fg = blend([fgc[0], fgc[1], fgc[2], fgc[3] * op], bg);
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700; const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    if (ratio < need) out.push({ sel: (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : el.tagName.toLowerCase()), text: t.textContent.trim().slice(0, 30), ratio: +ratio.toFixed(2), need, disabled: !!el.closest(':disabled,[aria-disabled="true"]') });
  }
  return out;
};
const results = {};
for (const preset of ['Sartorial', 'Edition', 'Archive']) {
  const schemes = SD.presets[preset].color_schemes;
  for (const [sid, sc] of Object.entries(schemes)) {
    const s = sc.settings;
    const css = `[class^='color-'],[class*=' color-']{--color-background:${s.background}!important;--gradient-background:${s.background}!important;--color-foreground:${s.text}!important;--color-button:${s.button}!important;--color-button-label:${s.button_label}!important;--color-link:${s.secondary_button_label}!important;--color-border:${s.border}!important;--color-shadow:${s.shadow}!important;}`;
    const fails = new Map();
    for (const [file, fn] of PAGES) for (const w of [390, 1440]) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      await p.goto(`http://127.0.0.1:8099/preset-${preset}/${file.split('#')[0]}`, { waitUntil: 'networkidle' });
      await p.addStyleTag({ content: css }); if (fn) await fn(p); await p.waitForTimeout(300);
      for (const f of await p.evaluate(audit)) { const k = `${f.sel} | ${f.text}`; if (!fails.has(k) || fails.get(k).ratio > f.ratio) fails.set(k, { ...f, page: file, w }); }
      await p.close();
    }
    results[`${preset}/${sid}`] = [...fails.values()];
    console.log(preset, sid, 'fallos:', fails.size, [...fails.values()].slice(0, 6).map((f) => `${f.sel} "${f.text}" ${f.ratio}<${f.need}${f.disabled ? ' (disabled)' : ''}`).join(' ; '));
  }
}
fs.writeFileSync('/tmp/claude-0/-home-claude/d73764fe-4b4e-52bf-897c-0328b17337e3/scratchpad/ml/dom-contrast.json', JSON.stringify(results, null, 1));
await b.close();
