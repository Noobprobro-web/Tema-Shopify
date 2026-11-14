// Generates ../products.csv (Shopify product import format). No network.
// Usage: node docs/demo-store/scripts/build-products-csv.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'products.csv');
export const HEADER = ['Handle','Title','Body (HTML)','Vendor','Product Category','Type','Tags','Published','Option1 Name','Option1 Value','Option2 Name','Option2 Value','Option3 Name','Option3 Value','Variant SKU','Variant Grams','Variant Inventory Tracker','Variant Inventory Qty','Variant Inventory Policy','Variant Fulfillment Service','Variant Price','Variant Compare At Price','Variant Requires Shipping','Variant Taxable','Variant Barcode','Image Src','Image Position','Image Alt Text','Gift Card','SEO Title','SEO Description','Variant Image','Variant Weight Unit','Cost per item','Status'];
const VENDOR = 'Studio Demo';
const ALPHA = ['XS','S','M','L','XL'];
const WAIST = ['24','26','28','30','32','34'];
const BELT = ['70','75','80','85'];
const body = (t) => `<p>${t}</p>`;
const NOTE = 'Demo product for theme preview. Replace this text with your own description.';

// opts: [{name, values}] up to 3. extra(variantValues[]) -> {qty, policy, price, compare}
const products = [];
const P = (o) => products.push(o);
const tag = (...t) => t.join(', ');

P({ handle:'serra-coat', title:'Serra Coat', type:'Coats', tags:tag('outerwear','autumn-series','permanent','new-arrival','b02-sold-out-fixture'), price:1890.0, body:body('A long wrap coat in a neutral palette, shown with three colours and five sizes. '+NOTE),
  opts:[{name:'Color',values:['Ink','Camel','Bone']},{name:'Size',values:ALPHA}], variant:(v)=> (v[0]==='Camel'&&v[1]==='M')?{qty:0}:{} });
P({ handle:'doppio-trench', title:'Doppio Trench', type:'Coats', tags:tag('outerwear','autumn-series','new-arrival','many-images-fixture'), price:945.5, compare:1190.0, body:body('A double-breasted trench in two colours. '+NOTE), opts:[{name:'Color',values:['Stone','Black']},{name:'Size',values:ALPHA}] });
P({ handle:'cocoon-cardigan-coat', title:'Cocoon Cardigan-Coat', type:'Coats', tags:tag('outerwear','knitwear','autumn-series'), price:1275.0, body:body('An open-front knit coat with a rounded shape. '+NOTE), opts:[{name:'Color',values:['Oat','Charcoal']},{name:'Size',values:['S','M','L']}] });
P({ handle:'nove-blazer', title:'Nove Blazer', type:'Jackets', tags:tag('tailoring','permanent'), price:745.0, body:body('A single-breasted blazer with notch lapels. '+NOTE), opts:[{name:'Color',values:['Black','Navy']},{name:'Size',values:ALPHA}] });
P({ handle:'cropped-tailored-jacket', title:'Cropped Tailored Jacket', type:'Jackets', tags:tag('tailoring','autumn-series','three-options-fixture'), price:612.75, body:body('A cropped jacket offered in two colours and two fabric options. '+NOTE), opts:[{name:'Size',values:['XS','S','M','L','XL']},{name:'Color',values:['Sand','Forest']},{name:'Material',values:['Wool blend','Linen blend']}] });
P({ handle:'pleated-wide-trouser', title:'Pleated Wide Trouser', type:'Trousers', tags:tag('tailoring','permanent'), price:318.0, body:body('A wide-leg trouser with front pleats. '+NOTE), opts:[{name:'Color',values:['Black','Ecru']},{name:'Size',values:WAIST}] });
P({ handle:'cigarette-trouser', title:'Cigarette Trouser', type:'Trousers', tags:tag('tailoring','permanent'), price:289.95, body:body('A slim straight trouser. '+NOTE), opts:[{name:'Color',values:['Black','Grey']},{name:'Size',values:WAIST}] });
P({ handle:'cashmere-rib-crew', title:'Cashmere Rib Crew', type:'Knitwear', tags:tag('knitwear','permanent'), price:395.0, body:body('A ribbed crew-neck knit. '+NOTE), opts:[{name:'Color',values:['Oat','Navy','Charcoal']},{name:'Size',values:ALPHA}] });
P({ handle:'fine-merino-turtleneck', title:'Fine Merino Turtleneck', type:'Knitwear', tags:tag('knitwear','permanent'), price:228.0, body:body('A fine-gauge turtleneck. '+NOTE), opts:[{name:'Color',values:['Black','Cream']},{name:'Size',values:ALPHA}] });
P({ handle:'oversized-alpaca-knit', title:'Oversized Alpaca Knit', type:'Knitwear', tags:tag('knitwear','autumn-series','new-arrival'), price:342.5, body:body('An oversized jumper with a dropped shoulder. '+NOTE), opts:[{name:'Color',values:['Heather','Moss']},{name:'Size',values:['S','M','L']}] });
P({ handle:'poplin-column-shirt', title:'Poplin Column Shirt', type:'Shirts', tags:tag('shirting','permanent'), price:164.0, body:body('A long straight shirt. '+NOTE), opts:[{name:'Color',values:['White','Pale blue']},{name:'Size',values:ALPHA}] });
P({ handle:'silk-charmeuse-blouse', title:'Silk Charmeuse Blouse', type:'Shirts', tags:tag('shirting','autumn-series'), price:278.0, body:body('A fluid blouse with a soft collar. '+NOTE), opts:[{name:'Color',values:['Ivory','Ink']},{name:'Size',values:ALPHA}] });
P({ handle:'striped-cotton-shirt', title:'Striped Cotton Shirt', type:'Shirts', tags:tag('shirting','permanent'), price:149.0, body:body('A striped shirt with a classic collar. '+NOTE), opts:[{name:'Color',values:['Blue stripe','Grey stripe']},{name:'Size',values:ALPHA}] });
P({ handle:'bias-cut-slip-dress', title:'Bias-Cut Slip Dress', type:'Dresses', tags:tag('dresses','autumn-series'), price:365.0, body:body('A slip dress with narrow straps. '+NOTE), opts:[{name:'Color',values:['Black','Champagne']},{name:'Size',values:['XS','S','M','L']}] });
P({ handle:'wrap-wool-skirt', title:'Wrap Wool Skirt', type:'Skirts', tags:tag('skirts','autumn-series'), price:259.0, body:body('A midi wrap skirt. '+NOTE), opts:[{name:'Color',values:['Camel','Black']},{name:'Size',values:['1','2']}] });
P({ handle:'pleated-midi-skirt', title:'Pleated Midi Skirt', type:'Skirts', tags:tag('skirts','permanent'), price:224.0, body:body('A pleated midi skirt. '+NOTE), opts:[{name:'Color',values:['Navy','Olive']},{name:'Size',values:ALPHA}] });
P({ handle:'leather-belt', title:'Leather Belt', type:'Accessories', tags:tag('accessories','permanent','no-image-fixture'), price:98.0, body:body('A plain belt with a metal buckle. '+NOTE), opts:[{name:'Color',values:['Black','Tan']},{name:'Size',values:BELT}] });
P({ handle:'cashmere-scarf', title:'Cashmere Scarf', type:'Accessories', tags:tag('accessories','permanent','single-variant-fixture','single-product-test'), price:185.0, body:body('A wide scarf in one size. '+NOTE), opts:[] });
P({ handle:'silk-twill-square', title:'Silk Twill Square', type:'Accessories', tags:tag('accessories','autumn-series','no-description-fixture'), price:135.0, body:'', opts:[{name:'Color',values:['Rust','Navy','Sage']}] });
P({ handle:'structured-tote', title:'Structured Tote', type:'Bags', tags:tag('accessories','bags','permanent'), price:520.0, body:body('A structured tote bag with two handles. '+NOTE), opts:[{name:'Color',values:['Black','Tan']}] });
const LONG = 'Long Title Fixture Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt and Oversized Collar in Soft Ink Navy';
P({ handle:'long-title-fixture-wrap-coat', title:LONG, type:'Coats', tags:tag('outerwear','long-title-fixture'), price:1499.99, body:body('Fixture with a 120-character title. '+NOTE), opts:[{name:'Color',values:['Navy','Black']},{name:'Size',values:['S','M','L']}] });

// Test fixtures (draft)
const seq = (prefix, n) => Array.from({length:n},(_,i)=>`${prefix} ${i+1}`);
const TEST = (handle,title,dims,tagx) => ({ handle,title,type:'Test',tags:tag('test-fixture',tagx),price:10.0,body:body('Test fixture. Do not publish.'),draft:true,test:true,
  opts: dims.length ? [{name:'Size',values:seq('Size',dims[0])},{name:'Color',values:seq('Color',dims[1])},{name:'Material',values:seq('Material',dims[2])}] : [] });
P(TEST('test-1-variant','[TEST] 1 variant',[], 'c07-1'));
P(TEST('test-250-variants','[TEST] 250 variants',[10,5,5],'c07-250'));
P(TEST('test-252-variants','[TEST] 252 variants',[7,6,6],'c07-252'));

const esc = (s) => { s = String(s ?? ''); return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s; };
function combos(opts){ if(!opts.length) return [[]]; return opts.reduce((acc,o)=>acc.flatMap(a=>o.values.map(v=>[...a,v])),[[]]); }
const rows = [];
for (const p of products) {
  const status = p.draft ? 'draft' : 'active';
  const opts = p.opts.length ? p.opts : [{name:'Title',values:['Default Title']}];
  const vs = combos(opts);
  vs.forEach((v,i)=>{
    const first = i===0;
    const x = p.variant ? p.variant(v) : {};
    const qty = x.qty ?? 8;
    const sku = (p.test ? 'TST-' : 'DEM-') + p.handle.toUpperCase().replace(/[^A-Z0-9]+/g,'-').slice(0,24) + '-' + String(i+1).padStart(3,'0');
    const r = {
      'Handle':p.handle,'Title':first?p.title:'','Body (HTML)':first?p.body:'','Vendor':first?VENDOR:'','Product Category':'','Type':first?p.type:'','Tags':first?p.tags:'','Published':first?(p.draft?'FALSE':'TRUE'):'',
      'Option1 Name':first?opts[0].name:'','Option1 Value':v[0],
      'Option2 Name':first&&opts[1]?opts[1].name:'','Option2 Value':opts[1]?v[1]:'',
      'Option3 Name':first&&opts[2]?opts[2].name:'','Option3 Value':opts[2]?v[2]:'',
      'Variant SKU':sku,'Variant Grams':p.test?'0':'500',
      'Variant Inventory Tracker':p.test?'':'shopify','Variant Inventory Qty':p.test?'':String(qty),'Variant Inventory Policy':'deny','Variant Fulfillment Service':'manual',
      'Variant Price':(x.price??p.price).toFixed(2),'Variant Compare At Price':p.compare?p.compare.toFixed(2):'','Variant Requires Shipping':'TRUE','Variant Taxable':'TRUE','Variant Barcode':'',
      'Image Src':'','Image Position':'','Image Alt Text':'','Gift Card':first?'FALSE':'',
      'SEO Title':first?p.title.slice(0,70):'','SEO Description':'','Variant Image':'','Variant Weight Unit':'kg','Cost per item':'','Status':status };
    rows.push(HEADER.map(h=>esc(r[h])).join(','));
  });
}
writeFileSync(OUT, [HEADER.join(','),...rows].join('\n')+'\n');
console.log(`wrote ${OUT}: ${products.length} products, ${rows.length} variant rows`);
