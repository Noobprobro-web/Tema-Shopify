import { request } from '/home/user/Tema-Shopify/node_modules/playwright/index.mjs';
const H='https://sartorial-theme-kvkzl39t.myshopify.com';
const ctx=await request.newContext();
await ctx.post(H+'/password',{form:{form_type:'storefront_password',utf8:'✓',password:process.env.STOREFRONT_PASSWORD},maxRedirects:0});
for(const h of ['fixture-media-3d-video','serra-coat','fixture-many-variants']){
 const r=await ctx.get(`${H}/products/${h}.js`); const j=await r.json();
 console.log(h,j.variants.map(v=>v.id+':'+v.title+':'+(v.featured_media?v.featured_media.position:'-')).join(' '));
}
