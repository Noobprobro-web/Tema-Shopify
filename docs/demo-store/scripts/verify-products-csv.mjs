// Offline validator for ../products.csv. Usage: node docs/demo-store/scripts/verify-products-csv.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { HEADER } from './build-products-csv.mjs';

const dir = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(dir, '..', 'products.csv'), 'utf8');
function parse(t){const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}else if(c==='"')q=true;else if(c===','){r.push(f);f=''}else if(c==='\n'){r.push(f);rows.push(r);r=[];f=''}else f+=c}return rows}
const all = parse(text); const head = all.shift();
let fail = 0; const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) fail++;};
ok(JSON.stringify(head)===JSON.stringify(HEADER),'header matches expected columns ('+head.length+')');
ok(all.every(r=>r.length===head.length),'every row has '+head.length+' fields');
const ix = Object.fromEntries(head.map((h,i)=>[h,i]));
const by = new Map();
for (const r of all){ if(!by.has(r[ix.Handle])) by.set(r[ix.Handle],[]); by.get(r[ix.Handle]).push(r); }
const skus = new Set(); let dupSku=0;
for (const r of all){ const s=r[ix['Variant SKU']]; if(skus.has(s)) dupSku++; skus.add(s); }
ok(dupSku===0,'SKU unique ('+skus.size+')');
// handles contiguous & first row has title
let prev=null, seen=new Set(), contiguous=true;
for (const r of all){ const h=r[ix.Handle]; if(h!==prev){ if(seen.has(h)) contiguous=false; seen.add(h); prev=h; } }
ok(contiguous,'rows of each handle are contiguous');
ok([...by.values()].every(rs=>rs[0][ix.Title]!==''),'first row of each handle has Title');
ok([...by.keys()].every(h=>/^[a-z0-9-]+$/.test(h)),'handles are lowercase slugs');
// variant combos unique per handle
let dupCombo=0; for(const [h,rs] of by){ const s=new Set(rs.map(r=>[r[ix['Option1 Value']],r[ix['Option2 Value']],r[ix['Option3 Value']]].join('|'))); if(s.size!==rs.length) dupCombo++; }
ok(dupCombo===0,'no duplicate option combinations');
console.log('\nproducts: '+by.size+' | variant rows: '+all.length);
console.log('handle'.padEnd(34)+'status'.padEnd(8)+'vars'.padStart(5)+'  opts');
for (const [h,rs] of by){ const f=rs[0]; const names=[f[ix['Option1 Name']],f[ix['Option2 Name']],f[ix['Option3 Name']]].filter(Boolean);
  console.log(h.padEnd(34)+f[ix.Status].padEnd(8)+String(rs.length).padStart(5)+'  '+names.join('/')); }
const n=(h)=>by.get(h)?.length;
ok(n('test-1-variant')===1,'[TEST] 1 variant = 1');
ok(n('test-250-variants')===250,'[TEST] 250 variants = '+n('test-250-variants'));
ok(n('test-252-variants')===252,'[TEST] 252 variants = '+n('test-252-variants'));
ok(['test-1-variant','test-250-variants','test-252-variants'].every(h=>by.get(h)[0][ix.Status]==='draft'),'test products are draft');
ok(by.get('long-title-fixture-wrap-coat')[0][ix.Title].length===120,'long title length = '+by.get('long-title-fixture-wrap-coat')[0][ix.Title].length);
ok(by.get('silk-twill-square')[0][ix['Body (HTML)']]==='','silk-twill-square has no description');
ok(by.get('cashmere-scarf').length===1&&by.get('cashmere-scarf')[0][ix['Option1 Value']]==='Default Title','cashmere-scarf = 1 variant Default Title');
const three=[...by].filter(([h,rs])=>rs[0][ix['Option3 Name']]&&!h.startsWith('test-')).map(([h])=>h);
ok(three.length===1,'3-option live product: '+three.join(','));
const so=by.get('serra-coat').filter(r=>r[ix['Variant Inventory Qty']]==='0'&&r[ix['Variant Inventory Policy']]==='deny');
ok(so.length===1&&by.get('serra-coat').length===15,'serra-coat: 15 variants, 1 sold out (qty 0, deny)');
ok(all.every(r=>r[ix['Image Src']]===''),'no external image URLs (Image Src empty)');
ok([...by.values()].every(rs=>['active','draft'].includes(rs[0][ix.Status])),'Status values valid');
ok(all.every(r=>/^\d+\.\d{2}$/.test(r[ix['Variant Price']])),'prices are decimals');
console.log('\ncollections (active products only, by tag):');
const tagCount={};
for(const [h,rs] of by){ if(rs[0][ix.Status]!=='active') continue; for(const t of rs[0][ix.Tags].split(',').map(x=>x.trim()).filter(Boolean)) tagCount[t]=(tagCount[t]||0)+1; }
for(const t of ['autumn-series','permanent','tailoring','knitwear','outerwear','accessories','new-arrival','single-product-test','tag-that-no-product-has']) console.log('  tag '+t.padEnd(26)+(tagCount[t]||0));
ok(tagCount['single-product-test']===1,'single-product-test collection has exactly 1 product');
ok(!tagCount['tag-that-no-product-has'],'empty-test collection has 0 products');
const templateHandles=['serra-coat','nove-blazer','pleated-wide-trouser','silk-charmeuse-blouse','cashmere-scarf','doppio-trench','cashmere-rib-crew','wrap-wool-skirt','oversized-alpaca-knit'];
ok(templateHandles.every(h=>by.has(h)&&by.get(h)[0][ix.Status]==='active'),'all Sartorial/root template product handles exist and are active');
const live=[...by].filter(([h,rs])=>rs[0][ix.Status]==='active').length;
console.log('live (active): '+live+' | draft: '+(by.size-live));
process.exit(fail?1:0);
