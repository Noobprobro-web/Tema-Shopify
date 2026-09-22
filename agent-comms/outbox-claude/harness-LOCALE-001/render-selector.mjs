import { Liquid } from 'liquidjs';
import fs from 'node:fs';
// Uso: node render-selector.mjs <raiz-del-tema>  (requiere liquidjs solo en el arnés, nunca en el tema)
const root = process.argv[2] || '.';
const src = fs.readFileSync(root + '/snippets/localization-selectors.liquid', 'utf8');
for (const [iso, file] of [['en', 'en.default.json'], ['es', 'es.json']]) {
  const dict = JSON.parse(fs.readFileSync(`${root}/locales/${file}`, 'utf8'));
  const engine = new Liquid();
  const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  engine.registerFilter('t', (key, ...args) => {
    let v = key.split('.').reduce((o, k) => o && o[k], dict);
    if (typeof v !== 'string') return `MISSING(${key})`;
    const vars = Object.fromEntries(args.filter(Array.isArray));
    return v.replace(/{{\s*(\w+)\s*}}/g, (_, k) => esc(vars[k] ?? ''));
  });
  engine.registerFilter('handle', (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  engine.registerTag('form', { parse(tok, rem) { this.tpl = []; const s = this.liquid.parser.parseStream(rem); s.on('tag:endform', () => s.stop()).on('template', (t) => this.tpl.push(t)).on('end', () => { throw new Error('no endform'); }); s.start(); }, *render(ctx, em) { em.write('<form>'); yield this.liquid.renderer.renderTemplates(this.tpl, ctx, em); em.write('</form>'); } });
  const langs = [{ iso_code: 'en', endonym_name: 'English' }, { iso_code: 'es', endonym_name: 'español' }];
  const out = await engine.parseAndRender(src, { context: 'header', localization: { available_languages: langs, language: langs.find((l) => l.iso_code === iso), available_countries: [{}] } });
  const m = out.match(/<span class="visually-hidden">([^<]*)<\/span>/);
  console.log(iso, '→', JSON.stringify(m && m[1]), out.includes('MISSING') ? 'MISSING' : 'ok', /sections\.collection_template|active\)/.test(out) ? 'LITERAL' : 'sin literal');
}
