import { readFile, writeFile } from 'node:fs/promises';
const spans={
  'assets/theme.js':[[57,124],[216,251],[599,605],[894,925],[1106,1140],[1291,1301],[1377,1434],[1464,1660],[1725,1748],[2206,2268],[2425,2438],[2476,2489],[2550,2566],[2579,2612],[2710,2746]],
  'sections/main-product.liquid':[[299,315]],'sections/featured-product.liquid':[[151,168]],
  'sections/cart-drawer.liquid':[[198,219]],'sections/main-collection.liquid':[[108,119],[124,153]],
  'sections/main-search.liquid':[[40,45],[139,175],[277,280]],
  'snippets/predictive-search.liquid':[[1,36]],'assets/base.css':[[63,73],[979,995]],
};
let evidence='Source: master bee742b. Line numbers are 1-based.\n';
for(const [file,ranges] of Object.entries(spans)){
  const lines=(await readFile(file,'utf8')).split(/\r?\n/);
  for(const [first,last] of ranges)evidence+=`\n${file}:L${first}-L${last}\n`+lines.slice(first-1,last).map((s,i)=>`${first+i}: ${s}`).join('\n')+'\n';
}
await writeFile('.tmp/gpt-audit-4b-007/source-evidence.txt',evidence);
console.log(JSON.stringify({files:Object.keys(spans).length,spans:Object.values(spans).flat().length}));
