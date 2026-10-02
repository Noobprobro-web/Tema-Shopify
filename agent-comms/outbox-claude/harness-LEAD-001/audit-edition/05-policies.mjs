import fs from 'node:fs';
import { STORES, launch, unlock } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.edition.url;
const out = {};
const browser = await launch();
const pols = ['terms-of-service', 'privacy-policy', 'refund-policy', 'shipping-policy', 'contact-information'];
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport: size });
  await unlock(context, BASE);
  const page = await context.newPage();
  for (const p of pols) {
    const r = await page.goto(BASE + '/policies/' + p, { waitUntil: 'load', timeout: 60000 }); await page.waitForTimeout(1800);
    await page.screenshot({ path: `policy-${p}-${vp}.png`, fullPage: true });
    await page.screenshot({ path: `policy-${p}-${vp}-top.png` });
    out[p + '-' + vp] = { status: r && r.status(), ...(await page.evaluate(() => {
      const box = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { cls: e.localName + '.' + String(e.className).slice(0, 60), left: Math.round(b.left), right: Math.round(document.documentElement.clientWidth - b.right), width: Math.round(b.width), maxWidth: cs.maxWidth, padL: cs.paddingLeft, padR: cs.paddingRight, marL: cs.marginLeft, marR: cs.marginRight }; };
      const font = (e) => { if (!e) return null; const cs = getComputedStyle(e); return { tag: e.localName, cls: String(e.className).slice(0, 40), fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, ff: cs.fontFamily.slice(0, 40), mt: cs.marginTop, mb: cs.marginBottom, text: e.textContent.trim().slice(0, 50) }; };
      const main = document.querySelector('main');
      const cont = document.querySelector('.shopify-policy__container');
      const chain = []; let e = cont; while (e && e !== document.body) { chain.push(e.localName + (e.id ? '#' + e.id : '') + (e.className ? '.' + String(e.className).replace(/\s+/g, '.').slice(0, 60) : '')); e = e.parentElement; }
      const body = document.querySelector('.shopify-policy__body');
      const h2s = body ? [...body.querySelectorAll('h1,h2,h3,h4,h5,h6,strong')].slice(0, 6).map(font) : [];
      const ps = body ? [...body.querySelectorAll('p,li')].slice(0, 3).map(font) : [];
      const de = document.documentElement;
      return {
        classesPresent: ['.shopify-policy__container', '.shopify-policy__title', '.shopify-policy__body', '.rte'].map(s => s + ':' + document.querySelectorAll(s).length),
        chain,
        main: box(main), container: box(cont), title: box(document.querySelector('.shopify-policy__title')), bodyBox: box(body),
        headerContainer: box(document.querySelector('.site-header .container, header .container')),
        footerContainer: box(document.querySelector('.site-footer .container')),
        h1: font(document.querySelector('.shopify-policy__title h1, main h1')), headings: h2s, paras: ps,
        bodyChildTags: body ? [...(body.querySelector('.rte') || body).children].slice(0, 15).map(c => c.localName + ':' + c.textContent.trim().slice(0, 30)) : [],
        bodyLen: body?.innerText.length,
        bodyFirst: body?.innerHTML.slice(0, 600),
        sw: de.scrollWidth, cw: de.clientWidth,
        mainH: Math.round(main?.getBoundingClientRect().height || 0),
      };
    })) };
  }
  await context.close();
}
await browser.close();
fs.writeFileSync('results-05.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify({ tos_d: out['terms-of-service-desktop'], tos_m: out['terms-of-service-mobile'] }, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k, v.status, 'cont', v.container?.left, v.container?.right, v.container?.maxWidth, 'hdr', v.headerContainer?.left, 'h1', v.h1?.fs, 'len', v.bodyLen, 'sw', v.sw, v.cw);
