import { request } from '/home/user/Tema-Shopify/node_modules/playwright/index.mjs';
const H='https://sartorial-theme-kvkzl39t.myshopify.com';
const ctx=await request.newContext();
const r=await ctx.post(H+'/password',{form:{form_type:'storefront_password',utf8:'✓',password:process.env.STOREFRONT_PASSWORD},maxRedirects:0});
console.log('auth',r.status(),r.headers()['retry-after']||'');
const g=await ctx.get(H+'/?preview_theme_id=190453317936');console.log('home',g.status(),g.headers()['retry-after']||'');
