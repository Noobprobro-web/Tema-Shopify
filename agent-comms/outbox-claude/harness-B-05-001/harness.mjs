// Harness B-05 (SINTETICO + ESTATICO). Renderiza el Liquid REAL con mini.py (no traduce a mano),
// sirve assets/base.css y assets/theme.js reales y usa axe 4.10.2 local. Sin red, tiendas ni credenciales.
// Uso (desde la raiz del repo): PLAYWRIGHT_BROWSERS_PATH=<ruta de navegadores de Playwright> node agent-comms/outbox-claude/harness-B-05-001/harness.mjs [repo]
// "base" = snippet en BASE_REV (git show, por defecto 1fee9e2); "fix" = snippet del arbol de trabajo.
import http from 'node:http'; import fs from 'node:fs'; import os from 'node:os'; import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process'; import { createRequire } from 'node:module';
const D = new URL('.', import.meta.url).pathname;
const R = process.argv[2] || new URL('../../../', import.meta.url).pathname.replace(/\/$/, '');
const { chromium } = createRequire(`${R}/package.json`)('playwright');
const OUT = process.env.OUT || fs.mkdtempSync(`${os.tmpdir()}/b05-`);
const BASE_REV = process.env.BASE_REV || '1fee9e2';
const SN = 'snippets/localization-selectors.liquid';
const log = (...a) => console.log(...a); let bad = 0; const FAIL = (m) => { bad++; log('  [FALLA] ' + m); };
const sh = (c, a) => spawnSync(c, a, { cwd: R, encoding: 'utf8' });
fs.mkdirSync(OUT, { recursive: true });
const baseLq = `${OUT}/base.liquid`; fs.writeFileSync(baseLq, sh('git', ['show', `${BASE_REV}:${SN}`]).stdout);
// WORK_SNIPPET (opcional) sustituye al snippet del arbol de trabajo: se usa para la corrida en rojo con el snippet de BASE_REV.
const WORK = process.env.WORK_SNIPPET || `${R}/${SN}`;
const work = fs.readFileSync(WORK, 'utf8');

// ---- C-3 fidelidad (cadena fija, conteo exacto) ----
log('== C-3 fidelidad del Liquid real (grep -F) ==');
const cnt = (s) => work.split(s).length - 1;
const FID = [
  ['aria-label="{{ language_code_label | escape }}, {{ \'general.localization.update\' | t }}: {{ language.endonym_name | capitalize | escape }}"', 1],
  ['{%- assign language_code_label = language.iso_code | upcase -%}', 1],
  ['{{- language_code_label -}}', 2], ['language_code_label', 4], ['aria-label=', 2], ['name="language_code"', 1]];
for (const [s, n] of FID) { const c = cnt(s); log(`  ${c === n ? 'ok ' : 'NO '} ${c}/${n}  ${s.slice(0, 70)}`); if (c !== n) FAIL('fidelidad ' + s.slice(0, 40)); }

// ---- C-4 H-10 sobre el Liquid ----
log('== C-4 / H-10 bloque de pais sobre el Liquid ==');
const blk = (txt) => { const L = txt.split('\n'); const a = L.findIndex((l) => l === '      {%- if show_country_selector -%}');
  const b = L.findIndex((l, i) => i > a && l === '      {%- endif -%}'); return L.slice(a, b + 1).join('\n'); };
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const sb = sha(blk(fs.readFileSync(baseLq, 'utf8'))), sw = sha(blk(work));
log(`  sha256 bloque pais base=${sb.slice(0, 16)} fix=${sw.slice(0, 16)} ${sb === sw ? 'IGUAL' : 'DISTINTO'}`); if (sb !== sw) FAIL('bloque de pais distinto');
const rng = (txt) => { const L = txt.split('\n'); return [L.findIndex((l) => l === '      {%- if show_language_selector -%}') + 1, L.findIndex((l) => l === '      {%- if show_country_selector -%}')]; };
const [ob, oe] = rng(fs.readFileSync(baseLq, 'utf8')), [nb, ne] = rng(work);
const df = sh('git', ['diff', '-U0', BASE_REV, '--', SN]).stdout; let hunks = 0, fuera = 0;
for (const m of df.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
  hunks++; const os_ = +m[1], oc = m[2] === undefined ? 1 : +m[2], ns = +m[3], nc = m[4] === undefined ? 1 : +m[4];
  const inOld = os_ >= ob && os_ + Math.max(oc, 1) - 1 < oe, inNew = ns >= nb && ns + Math.max(nc, 1) - 1 < ne;
  log(`  hunk -${os_},${oc} +${ns},${nc} (bloque idioma base ${ob}-${oe - 1}, fix ${nb}-${ne - 1}) ${inOld && inNew ? 'dentro' : 'FUERA'}`); if (!(inOld && inNew)) fuera++; }
log(`  hunks=${hunks} fuera_del_bloque_idioma=${fuera}`); if (fuera) FAIL('hunks fuera del bloque de idioma');

// ---- paginas ----
const g = spawnSync('python3', ['-I', '-B', `${D}gen.py`, baseLq, WORK, `${OUT}/pages`], { encoding: 'utf8', env: { ...process.env, REPO: R, PYTHONDONTWRITEBYTECODE: '1' } });
log(g.stdout.trim()); if (g.status) { log(g.stderr); process.exit(2); }
if (!g.stdout.includes('distintos: 0')) FAIL('H-10b bloques de pais renderizados distintos');

// theme.js real de THEME_REV (por defecto HEAD), via git show: aisla los cambios sin commit de otras tareas.
const THEME_JS = sh('git', ['show', `${process.env.THEME_REV || 'HEAD'}:assets/theme.js`]).stdout;
const axe = fs.readFileSync(`${R}/tests/vendor/axe.min.js`, 'utf8');
const srv = http.createServer((q, s) => {
  const u = new URL(q.url, 'http://x');
  if (u.pathname === '/base.css') { s.writeHead(200, { 'content-type': 'text/css' }); return s.end(fs.readFileSync(`${R}/assets/base.css`)); }
  if (u.pathname === '/theme.js') { s.writeHead(200, { 'content-type': 'text/javascript' }); return s.end(THEME_JS); }
  if (u.pathname === '/localization') { let b = ''; q.on('data', (c) => (b += c)); return q.on('end', () => { s.writeHead(200, { 'content-type': 'text/plain' }); s.end('POST ' + b); }); }
  const f = `${OUT}/pages${u.pathname}.html`; if (!fs.existsSync(f)) { s.writeHead(404); return s.end(); }
  let h = fs.readFileSync(f, 'utf8'); if (u.searchParams.get('nojs')) h = h.replace('class="js"', 'class="no-js"');
  s.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); s.end(h);
});
await new Promise((r) => srv.listen(0, r)); const port = srv.address().port;
const b = await chromium.launch(); const box = {}; const names = {}; const summary = {};
const EXP = { en2: 'ES, Update preferences: Español', es2: 'EN, Actualizar preferencias: English' };
log('== Casos (JS real con theme.js / sin JS), H-1 palabra, H-3 regla forzada, H-4 etiquetas, H-5 teclado ==');
for (const v of ['base', 'fix']) for (const c of ['en2', 'es2', 'en5', 'rtl', 'empty', 'one']) for (const w of [390, 1280]) for (const js of [true, false]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: js });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message.slice(0, 90)));
  await p.goto(`http://localhost:${port}/${v}-${c}${js ? '' : '?nojs=1'}`); await p.waitForLoadState('load');
  if (js) await p.waitForFunction(() => !!customElements.get('localization-form'), null, { timeout: 5000 }).catch(() => errs.push('localization-form NO definido'));
  const out = []; let ok = 0, ko = 0;
  for (const f of ['header', 'header-mobile', 'footer']) {
    const btns = p.locator(`#LocalizationForm-${f} button[name="language_code"]`);
    for (let i = 0; i < await btns.count(); i++) {
      const bt = btns.nth(i); if (!(await bt.isVisible())) continue;
      const vis = (await bt.innerText()).trim(); const snap = await bt.ariaSnapshot();
      const name = (snap.match(/button "([^"]*)"/) || [])[1] ?? snap;
      const esc = vis.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pass = new RegExp('^' + esc + '($|[^\\p{L}\\p{N}])', 'iu').test(name); pass ? ok++ : ko++;
      const r = await bt.boundingBox(); box[`${v}|${c}|${w}|${js}|${f}|${i}`] = `${vis}|${Math.round(r.width * 10)}x${Math.round(r.height * 10)}`;
      out.push(`${f}:${vis}=>"${name}"${pass ? '' : ' [FALLA palabra]'}`);
      if (v === 'fix' && EXP[c] && i === 0 && name !== EXP[c]) FAIL(`H-2 ${c} ${f}: "${name}" != "${EXP[c]}"`);
      if (v === 'fix' && c === 'empty' && !name.startsWith('IT,')) FAIL('H-8d nombre no empieza por el codigo');
    }
  }
  // H-7 idioma activo intacto
  if (v === 'fix' && c !== 'one') {
    const act = await p.locator('#LocalizationForm-footer [aria-current="true"]').evaluate((e) => ({ hid: e.querySelector('.visually-hidden')?.textContent, vis: e.querySelector('[aria-hidden="true"]')?.textContent }));
    const want = c === 'es2' ? 'Idioma actual: Español' : 'Current language: English';
    if (act.hid !== want || !act.vis) FAIL(`H-7 ${c}: ${JSON.stringify(act)}`);
  }
  if (v === 'fix' && c === 'one' && (await p.locator('button[name="language_code"]').count())) FAIL('H-8a un solo idioma pinta botones');
  let ax = 'sin-js';
  if (js) {
    await p.addScriptTag({ content: axe });
    ax = await p.evaluate(async () => {
      const r = await axe.run(document, { runOnly: { type: 'rule', values: ['label-content-name-mismatch'] } });
      const t = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
      const n = (a) => a.filter((x) => x.id === 'label-content-name-mismatch').reduce((s, x) => s + x.nodes.length, 0);
      return { v: n(r.violations), inc: n(r.incomplete), pass: n(r.passes), inap: r.inapplicable.length, tags: t.violations.map((x) => x.id + ':' + x.nodes.length).join(',') || '0', inTags: [...t.passes, ...t.violations, ...t.inapplicable, ...t.incomplete].some((x) => x.id === 'label-content-name-mismatch') };
    });
    if (v === 'fix' && (ax.v || ax.inc)) FAIL(`H-3 ${c} ${w}: ${JSON.stringify(ax)}`);
    if (v === 'fix' && c !== 'one' && !ax.pass) FAIL(`H-3 sin passes ${c} ${w}`);
    summary[`${v}|${c}|${w}`] = ax.tags;
    ax = `regla v=${ax.v} inc=${ax.inc} pass=${ax.pass} inap=${ax.inap} | tags v=${ax.tags} reglaEnTags=${ax.inTags}`;
  }
  const grp = (await p.locator('#LocalizationForm-footer').count()) ? (await p.locator('#LocalizationForm-footer').ariaSnapshot()).replace(/\n\s*/g, ' / ') : 'sin formulario';
  const target = w === 390 ? 'footer' : 'header'; let kb = 'sin boton';
  if (await p.locator(`#LocalizationForm-${target} button[name="language_code"]`).count()) {
    let reached = false, fv = false;
    for (let i = 0; i < 20 && !reached; i++) {
      await p.keyboard.press('Tab');
      [reached, fv] = await p.evaluate((t) => { const a = document.activeElement; return [a?.name === 'language_code' && a.closest('form')?.id === 'LocalizationForm-' + t, a?.matches(':focus-visible')]; }, target);
    }
    let post = null; p.on('request', (r) => { if (r.url().endsWith('/localization')) post = r.postData(); });
    const first = await p.evaluate(() => document.activeElement?.value);
    if (reached) { await p.keyboard.press('Enter'); await p.waitForLoadState('load'); await p.waitForTimeout(200); }
    kb = `tab=${reached} focusVisible=${fv} post=${post}`;
    if (v === 'fix' && (!reached || !fv || post !== `language_code=${first}&country_code=US`)) FAIL(`H-5/H-6 ${c} ${w} js=${js}: ${kb}`);
  }
  log(`${v} ${c} ${w} js=${js} | palabra ok=${ok} falla=${ko} | ${ax} | ${kb} | errores_no_ViewTransition=${errs.filter((e) => !/ViewTransition/.test(e)).length}`);
  for (const o of out) log('    ' + o);
  if (js && w === 390 && c !== 'one') log('    grupo footer: ' + grp.slice(0, 260));
  if (v === 'fix' && ko) FAIL(`H-1 ${c} ${w} js=${js}: ${ko} botones sin la palabra`);
  if (v === 'fix' && errs.some((e) => !/ViewTransition/.test(e))) FAIL('pageerror ' + errs[0]);
  await ctx.close();
}
let dif = 0, tot = 0; for (const k of Object.keys(box)) if (k.startsWith('base|')) { tot++; if (box[k] !== box['fix' + k.slice(4)]) { dif++; log('H-9 distinto', k, box[k], box['fix' + k.slice(4)]); } }
log(`H-9 (solo prueba que el texto visible y la caja del boton no cambian) cajas comparadas=${tot} distintas=${dif}`); if (dif) FAIL('H-9');
for (const k of Object.keys(summary)) if (k.startsWith('fix|') && summary[k] !== summary['base' + k.slice(3)]) FAIL('H-4 etiquetas WCAG distintas ' + k);
log(bad ? `RESULTADO: ${bad} FALLO(S) en la variante fix` : 'RESULTADO: todo OK en la variante fix');
await b.close(); srv.close(); process.exit(bad ? 1 : 0);
