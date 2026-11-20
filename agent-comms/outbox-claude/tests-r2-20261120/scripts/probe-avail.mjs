import { request } from '/home/user/Tema-Shopify/node_modules/playwright/index.mjs';
const H='https://sartorial-theme-kvkzl39t.myshopify.com';
const ctx=await request.newContext();
await ctx.post(H+'/password',{form:{form_type:'storefront_password',utf8:'✓',password:process.env.STOREFRONT_PASSWORD},maxRedirects:0});
const j=await (await ctx.get(`${H}/products/fixture-many-variants.js`)).json();
const v=j.variants.find(v=>v.id===68445343514928);console.log(JSON.stringify({id:v.id,title:v.title,available:v.available,inv:v.inventory_management,pol:v.inventory_policy}), j.variants.filter(v=>!v.available).length);
