import { createRequire } from 'module';
const require = createRequire('/home/user/Tema-Shopify/');
const { request } = require('playwright');
const H='https://sartorial-theme-kvkzl39t.myshopify.com';
const ctx = await request.newContext({ baseURL: H });
let r = await ctx.post('/password', { form: { form_type:'storefront_password', utf8:'✓', password: process.env.STOREFRONT_PASSWORD } });
console.log('auth', r.status());
for (const p of ['/products/fixture-many-variants','/products/fixture-long-swatches','/products/fixture-long-title','/products/fixture-media-3d-video','/products/fixture-with-vendor','/collections/fixtures']) {
  await new Promise(s=>setTimeout(s,1500));
  r = await ctx.get(p+'?preview_theme_id=190316839216');
  console.log(p, r.status(), r.url().split('?')[0].replace(H,''));
}
await ctx.dispose();
