import {chromium,DESK,MOB,newCtx,nav,out,shot,sleep,bad} from './lib2.mjs';
const label=process.argv[2]; const paths=process.argv.slice(3);
const b=await chromium.launch(); const ctx=await newCtx(b,DESK); const p=await ctx.newPage(); const R={};
for (const path of paths){
 const s=await nav(p,path);
 R[path]=await p.evaluate(()=>({h:document.querySelector('h1')?.textContent.trim(),featured:[...document.querySelectorAll('.main-blog__featured h2, .main-blog__featured h1 ~ *')].length?document.querySelector('.main-blog__featured .main-blog__featured-title, .main-blog__featured h2')?.textContent.trim():null,hasFeatured:!!document.querySelector('.main-blog__featured'),latestHeading:document.querySelector('.main-blog__latest-heading')?.innerText.replace(/\n+/g,' | ')||null,cards:[...document.querySelectorAll('.article-card__title')].map(e=>e.textContent.trim()),empty:document.querySelector('.main-blog__empty')?.textContent.trim()||null,pag:[...document.querySelectorAll('.pagination a,.pagination [aria-current]')].map(e=>e.textContent.trim()),tags:[...document.querySelectorAll('.main-blog__tag')].map(e=>e.textContent.trim()+(e.getAttribute('aria-current')?'*':''))}));
 R[path].status=s; R[path].bad=await bad(p);
 await shot(p,'blog-'+label+'-'+path.replace(/[^a-z0-9]+/gi,'_'),{fullPage:true});
}
out('blog-'+label,R); console.log(JSON.stringify(R,null,1)); await b.close();
