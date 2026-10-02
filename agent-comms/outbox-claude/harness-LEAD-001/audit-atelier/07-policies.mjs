import fs from 'node:fs';
import { STORES, launch, unlock, attachConsole } from '../../harness-AUDIT-FINAL-002/lib.mjs';
const BASE = STORES.atelier.url;
const pols = ['terms-of-service', 'privacy-policy', 'refund-policy', 'shipping-policy', 'contact-information'];
const res = {}; const errs = [];
const browser = await launch();
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile' });
  await unlock(ctx, BASE);
  const page = await ctx.newPage(); attachConsole(page, errs);
  for (const p of pols) {
    const r = await page.goto(`${BASE}/policies/${p}`, { waitUntil: 'load' }); await page.waitForTimeout(2000);
    await page.screenshot({ path: `policy-${p}-${vp}.png`, fullPage: true });
    res[`${p}-${vp}`] = await page.evaluate(() => {
      const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { cls: e.className.toString().slice(0, 80), left: Math.round(r.left), right: Math.round(document.documentElement.clientWidth - r.right), width: Math.round(r.width), maxWidth: cs.maxWidth, padL: cs.paddingLeft, padR: cs.paddingRight, marL: cs.marginLeft, marR: cs.marginRight }; };
      const font = (e) => { if (!e) return null; const cs = getComputedStyle(e); return { tag: e.tagName, text: e.textContent.trim().slice(0, 40), fs: cs.fontSize, lh: cs.lineHeight, ff: cs.fontFamily.split(',')[0], fw: cs.fontWeight, mt: cs.marginTop, mb: cs.marginBottom, color: cs.color, tt: cs.textTransform, ls: cs.letterSpacing }; };
      const cont = document.querySelector('.shopify-policy__container');
      const main = document.querySelector('main');
      const body = document.querySelector('.shopify-policy__body');
      const rte = body?.querySelector('.rte') || body;
      const headerInner = document.querySelector('.site-header__inner');
      const brand = document.querySelector('.site-header__brand, .site-header__menu-button');
      const footerGrid = document.querySelector('.site-footer__grid');
      const h2s = [...(body?.querySelectorAll('h1,h2,h3,h4,h5,h6,strong') || [])].slice(0, 6).map(font);
      const ps = [...(body?.querySelectorAll('p') || [])].slice(0, 3).map(font);
      // which stylesheet rules target shopify-policy?
      const rules = [];
      for (const ss of document.styleSheets) { let cr; try { cr = ss.cssRules; } catch (e) { continue; } for (const ru of cr) { if (ru.cssText && /shopify-policy/.test(ru.cssText)) rules.push(((ss.href || 'inline<style>').split('/').pop().split('?')[0]) + ' :: ' + ru.cssText.slice(0, 220)); } }
      const tagsInBody = {}; body?.querySelectorAll('*').forEach(e => tagsInBody[e.tagName] = (tagsInBody[e.tagName] || 0) + 1);
      return {
        title: document.title, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
        mainChildren: [...(main?.children || [])].map(c => c.tagName + '.' + c.className.toString().slice(0, 60)),
        container: box(cont), body: box(body), rte: box(rte), main: box(main), headerInner: box(headerInner), headerFirst: box(brand), footerGrid: box(footerGrid),
        title_el: font(document.querySelector('.shopify-policy__title h1, .shopify-policy__title')),
        h1: font(document.querySelector('h1')),
        headings: h2s, paragraphs: ps, tagsInBody,
        bodyHTMLStart: body?.innerHTML.replace(/\s+/g, ' ').slice(0, 700),
        rules, bodyLen: body?.innerText.length,
        bodyEmpty: !body || !body.innerText.trim(),
        paddingTopMain: main && getComputedStyle(main).paddingTop,
        contTop: cont && Math.round(cont.getBoundingClientRect().top + scrollY), contBottomToFooter: cont && document.querySelector('footer, .section-footer') ? Math.round(document.querySelector('.section-footer, footer').getBoundingClientRect().top - cont.getBoundingClientRect().bottom) : null,
      };
    });
    res[`${p}-${vp}`].status = r && r.status();
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync('results-07-policies.json', JSON.stringify({ res, errs: errs.filter(e => !/shop\.app|pay\.shopify|403|preload|WebGL|NaN|adapters|OTS/.test(e.text)) }, null, 2));
const t = res['terms-of-service-desktop'];
console.log(JSON.stringify(res['terms-of-service-desktop'], null, 1));
console.log(JSON.stringify(res['terms-of-service-mobile'], null, 1));
for (const [k, v] of Object.entries(res)) console.log(k, v.status, 'cont', v.container && [v.container.left, v.container.right, v.container.maxWidth, v.container.padL], 'body', v.body && [v.body.left, v.body.right], 'hdr', v.headerInner && [v.headerInner.left], 'len', v.bodyLen, 'scrollW', v.scrollW);
