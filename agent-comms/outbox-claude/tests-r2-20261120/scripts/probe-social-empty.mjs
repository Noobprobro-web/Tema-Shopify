import { chromium, ctxFor, nav, THEMES, save } from './common.mjs';
const b = await chromium.launch(); const out = [];
for (const mode of ['desktop', 'mobile']) { const ctx = await ctxFor(b, mode); const page = await ctx.newPage(); await nav(page, '/', THEMES.imprint, 800);
  out.push({ mode, ...(await page.evaluate(() => ({ identity: Shopify.theme.id + ':' + Shopify.theme.role, socialNav: document.querySelectorAll('.site-footer__social').length, socialLinks: document.querySelectorAll('.social-links a').length, followUsText: /follow us/i.test(document.querySelector('footer')?.innerText || ''), socialHrefs: [...document.querySelectorAll('footer a[href*="instagram"],footer a[href*="facebook"],footer a[href*="tumblr"]')].length }))) }); await ctx.close(); }
console.log(JSON.stringify(out)); save('01-social-allempty-imprint.json', out); await b.close();
