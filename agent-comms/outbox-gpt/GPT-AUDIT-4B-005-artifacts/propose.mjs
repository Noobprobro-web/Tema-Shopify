import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const base='.tmp/gpt-audit-4b-005/proposals';
const summaries=[];
function once(source,from,to){const n=source.split(from).length-1;if(n!==1)throw new Error('Expected one occurrence, got '+n+' for '+from.slice(0,90));return source.replace(from,to);}
async function propose(id,changes){
 let patch='';const lines=[];
 for(const[file,transform]of Object.entries(changes)){
  const raw=await readFile(file,'utf8'),source=raw.replace(/\r\n/g,'\n'),next=transform(source);
  if(source===next)throw new Error(id+' no change '+file);
  const dir=path.join(base,id),before=path.join(dir,'before',file),after=path.join(dir,'after',file);
  await mkdir(path.dirname(before),{recursive:true});await mkdir(path.dirname(after),{recursive:true});
  await writeFile(before,source);await writeFile(after,next);
  const diff=spawnSync('git',['diff','--no-index','--',before,after],{encoding:'utf8'});
  if(diff.status!==1)throw new Error(diff.stderr||'diff failed');
  patch+=diff.stdout.replace(/^diff --git .+$/m,`diff --git a/${file} b/${file}`).replace(/^--- .+$/m,`--- a/${file}`).replace(/^\+\+\+ .+$/m,`+++ b/${file}`);
  lines.push(file);
 }
 const target=path.join(base,id+'.patch');await writeFile(target,patch);
 const check=spawnSync('git',['apply','--check','--',target],{encoding:'utf8'});
 if(check.status!==0)throw new Error(id+' dry run failed: '+check.stderr);
 if(changes['assets/theme.js']){const r=spawnSync(process.execPath,['--check',path.join(base,id,'after/assets/theme.js')],{encoding:'utf8'});if(r.status!==0)throw new Error(r.stderr);}
 const summary={id,files:lines,applyCheck:check.status,patchLines:patch.split('\n').length};summaries.push(summary);console.log(JSON.stringify(summary));
}
await propose('F01',{'assets/theme.js':s=>once(s,
`    open(trigger = null) {
      if (this.isOpen) return;

      this.returnFocusTarget = trigger || document.activeElement;`,
`    open(trigger = null) {
      if (this.isOpen || !this.isConnected) return;

      let returnTarget = trigger || document.activeElement;
      const sourceMenu = returnTarget?.closest('theme-drawer[data-open]');
      if (sourceMenu) returnTarget = sourceMenu.querySelector('[data-drawer-trigger]');
      document.querySelectorAll('theme-drawer[data-open], predictive-search[data-open]')
        .forEach((dialog) => dialog.setOpen(false));
      document.querySelectorAll('size-guide-modal[data-open], pickup-availability[data-open], password-modal[data-open]')
        .forEach((dialog) => dialog.close(false));
      this.returnFocusTarget = returnTarget;`)});
await propose('F02',{'assets/theme.js':s=>{
 s=once(s,`        button.disabled = !purchaseOptionValid;`,`        button.disabled = !purchaseOptionValid || button.form?.dataset.cartAddPending === 'true';`);
 s=once(s,`    async addItem(form, submitter) {
      this.clearMessages(form);`,`    async addItem(form, submitter) {
      if (form.dataset.cartAddPending === 'true') return;
      form.dataset.cartAddPending = 'true';
      this.clearMessages(form);`);
 return once(s,`      } finally {
        this.setFormBusy(form, submitter, false);
      }`,`      } finally {
        delete form.dataset.cartAddPending;
        this.setFormBusy(form, submitter, false);
        const variants = form.closest('variant-selects');
        if (variants?.isConnected) variants.updateForms(variants.currentVariant);
      }`);
}});
await propose('F03',{'assets/theme.js':s=>once(s,`    async syncCart() {
      const response = await fetch(this.dataset.cartJsonUrl, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return;

      const cart = await response.json();
      if (Number(this.dataset.itemCount) === Number(cart.item_count)) return;

      const sectionHtml = await this.requestSection();`, `    async syncCart() {
      const sectionHtml = await this.requestSection();`)});
await propose('F04',{'assets/theme.js':s=>{
 s=once(s,`      this.listen(this, 'change', (event) => this.handleDrawerChange(event));`,`      this.listen(this, 'change', (event) => this.handleDrawerChange(event));
      this.listen(this, 'input', (event) => {
        if (event.target.matches('textarea[name="note"]')) event.target.dataset.dirty = 'true';
      });`);
 return once(s,`      currentContent.replaceWith(nextContent);
      this.dataset.itemCount = nextDrawer.dataset.itemCount;`,`      const previousNote = currentContent.querySelector('textarea[name="note"][data-dirty="true"]');
      const nextNote = nextContent.querySelector('textarea[name="note"]');
      if (previousNote && nextNote) {
        nextNote.value = previousNote.value;
        nextNote.dataset.dirty = 'true';
      }
      const active = document.activeElement;
      const restoreFocus = this.isOpen && (currentContent.contains(active) || active === document.body);
      currentContent.replaceWith(nextContent);
      if (restoreFocus) {
        const target = active.id ? nextContent.querySelector('#' + CSS.escape(active.id)) : null;
        (target || this.querySelector('[data-cart-drawer-close]'))?.focus();
      }
      this.dataset.itemCount = nextDrawer.dataset.itemCount;`);
}});
const qtyChanges={'assets/theme.js':s=>once(s,`      const quantity = Math.max(0, Number.parseInt(quantityInput.value, 10) || 0);`,`      if (!quantityInput.checkValidity() && quantityInput.value !== '0') {
        quantityInput.reportValidity();
        return;
      }
      const quantity = Number(quantityInput.value);`)};
for(const file of ['sections/main-product.liquid','sections/featured-product.liquid'])qtyChanges[file]=s=>once(s,'                  data-quantity-input','                  required\n                  data-quantity-input');
qtyChanges['sections/cart-drawer.liquid']=s=>once(s,'                      data-cart-quantity','                      required\n                      data-cart-quantity');
await propose('F05',qtyChanges);
const filters={};
for(const file of ['sections/main-collection.liquid','sections/main-search.liquid'])filters[file]=s=>{
 const redundant=`  assign money_uses_comma_decimal = false
  if shop.money_format contains 'amount_with_comma_separator' or shop.money_with_currency_format contains 'amount_with_comma_separator'
    assign money_uses_comma_decimal = true
  endif
`;
 s=once(s,redundant,'');
 const block=/^(\s*)assign range_max_value = filter\.range_max \| money_without_currency[^]*?^\1endif\n/m;
 const hits=[...s.matchAll(new RegExp(block.source,'gm'))];if(hits.length!==1)throw new Error('price block count '+hits.length);
 return s.replace(block,(_,indent)=>`${indent}assign range_max_value = filter.range_max | divided_by: 100.0\n${indent}assign minimum_filter_value = filter.min_value.value | divided_by: 100.0\n${indent}assign maximum_filter_value = filter.max_value.value | divided_by: 100.0\n`);
};
await propose('F06',filters);
await propose('F07',{'assets/theme.js':s=>{
 s=once(s,'  // The seven amount tokens Shopify allows inside money_format / money_with_currency_format.','  // Amount patterns supported by Shopify currency formatting.');
 s=once(s,`    amount_with_space_separator: { precision: 2, thousands: ' ', decimal: ',' },`,`    amount_with_space_separator: { precision: 2, thousands: ' ', decimal: ',' },
    amount_with_period_and_space_separator: { precision: 2, thousands: ' ', decimal: '.' },`);
 s=once(s,`    const amount = Math.round(Number(cents));`,`    if (typeof cents !== 'number' && (typeof cents !== 'string' || cents.trim() === '')) return '';
    const amount = Math.round(Number(cents));`);
 const start=s.indexOf('    const fallback =',s.indexOf('  const formatMoney'));
 const end=s.indexOf('    const fixed =',start);
 if(start<0||end<0)throw new Error('money boundary');
 s=s.slice(0,start)+`    const template = [format, window.theme?.moneyFormat, document.documentElement.dataset.moneyFormat]
      .find((candidate) => typeof candidate === 'string'
        && Object.hasOwn(MONEY_PATTERNS, candidate.match(MONEY_TOKEN)?.[1]));
    if (!template) return '';
    const token = template.match(MONEY_TOKEN)[1];
    const pattern = MONEY_PATTERNS[token];
    const decoder = document.createElement('textarea');
    decoder.innerHTML = template.replace(/</g, '&lt;');
    const textTemplate = decoder.value;
`+s.slice(end);
 s=once(s,'    return template.replace(MONEY_TOKEN, value);','    return textTemplate.replace(MONEY_TOKEN, value);');
 return once(s,'      const showTotal = Number.isFinite(quantity)','      const showTotal = priceSource?.price_cents != null\n        && priceSource.price_cents !== \'\'\n        && Number.isFinite(quantity)');
}});
const escaped={};
for(const dir of ['sections','snippets','layout'])for(const file of await readdir(dir))if(file.endsWith('.liquid')){
 const name=dir+'/'+file,source=await readFile(name,'utf8');
 const pattern=/\{\{[^]*?\}\}/g;
 const fix=s=>s.replace(pattern,token=>/\|\s*t(?:\s|:)/.test(token)?token.replace(/\| escape(?=\s*[-]?\}\})/,'| escape_once'):token);
 if(fix(source)!==source)escaped[name]=fix;
}
await propose('F08',escaped);
const infoChanges={};
for(const file of ['config/settings_schema.json',...(await readdir('sections')).filter(n=>n.endsWith('.liquid')).map(n=>'sections/'+n)]){
 const source=await readFile(file,'utf8');
 const pattern=/\{\s*"type":\s*"url",[^{}]*?\}/g;
 if(![...source.matchAll(pattern)].some(m=>!m[0].includes('"info"')))continue;
 infoChanges[file]=s=>s.replace(pattern,block=>block.includes('"info"')?block:block.replace(/^(\s*)"label": ("[^"]+")(,?)/m,(_,indent,label,comma)=>`${indent}"label": ${label},\n${indent}"info": "t:sections.all.link_destination_info"${comma}`));
}
infoChanges['locales/en.default.schema.json']=s=>once(s,'  "sections": {','  "sections": {').replace(/("all": \{)/,`$1\n      "link_destination_info": "Choose a store page or paste the full HTTPS address. External pages must stay publicly accessible.",`);
await propose('F09',infoChanges);
await propose('F10',{'assets/theme.js':s=>{
 const from='        const result = await response.json();';const count=s.split(from).length-1;if(count!==4)throw new Error('cart JSON count '+count);
 return s.replaceAll(from,`        const result = await response.json().catch(() => {
          throw new Error(this.dataset.errorMessage);
        });`);
}});
await writeFile(base+'/manifest.json',JSON.stringify(summaries,null,2));
