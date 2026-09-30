// Agrega los resultados crudos del arnés en las cifras que cita el informe (matriz por tienda).
// No mide nada: solo lee los results-*.json / .jsonl ya escritos, para que cada número sea trazable.
import fs from 'node:fs';

const here = (f) => new URL('./' + f, import.meta.url);
const has = (f) => fs.existsSync(here(f));
const json = (f) => (has(f) ? JSON.parse(fs.readFileSync(here(f), 'utf8')) : null);
const jsonl = (f) => (has(f) ? fs.readFileSync(here(f), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);
const rng = (a) => (a.length ? `${Math.min(...a)}–${Math.max(...a)}` : 'n/d');
const STORES = ['atelier', 'edition', 'archive'];

for (const s of STORES) {
  console.log(`\n================ ${s.toUpperCase()} ================`);
  // 01
  const r01 = jsonl(`results-01-responsive-perf-${s}.jsonl`).filter((r) => !r.error && r.status !== 429 && !(r.lcp && r.lcp.el === 'p.description'));
  console.log(`[01] filas válidas=${r01.length} (por viewport: ${['375', '768', '1440'].map((v) => v + ':' + r01.filter((r) => r.vp === v).length).join(' ')})`);
  console.log(`     overflow máx (carga/final) = ${Math.max(...r01.map((r) => r.overflow.load))}/${Math.max(...r01.map((r) => r.overflow.end))} px; html/body overflow-x = ${[...new Set(r01.map((r) => r.overflow.htmlOX + '/' + r.overflow.bodyOX))]}`);
  console.log(`     infractores sin recorte (todos .visually-hidden): ${[...new Set(r01.flatMap((r) => r.overflow.offenders.map((o) => o.el)))]}`);
  console.log(`     CLS de carga (sin scroll) rango = ${rng(r01.map((r) => r.clsLoad))}; páginas con CLS carga > 0.1 = ${r01.filter((r) => r.clsLoad > 0.1).length}`);
  const pdp = r01.filter((r) => r.path.startsWith('/products/'));
  console.log(`     PDP CLS tras scroll sintético (500px/120ms): rango = ${rng(pdp.map((r) => r.clsTotal))}; > 0.1 en ${pdp.filter((r) => r.clsTotal > 0.1).length}/${pdp.length}; fuentes = ${[...new Set(pdp.flatMap((r) => r.shiftTop.filter((x) => x.v > 0.05).flatMap((x) => x.src.map((y) => y.split('.').slice(0, 3).join('.').replace(/sections--\d+/, 'sections')))))]}`);
  console.log(`     no-PDP CLS total máx = ${Math.max(...r01.filter((r) => !r.path.startsWith('/products/')).map((r) => r.clsTotal))}`);
  for (const v of ['375', '768', '1440']) { const h = r01.find((r) => r.path === '/' && r.vp === v); if (h) console.log(`     home@${v}: LCP=${h.lcp?.el} fp=${h.lcp?.fetchpriority} ld=${h.lcp?.loading} t=${h.lcp?.t}ms | hero=${JSON.stringify(h.hero.map((i) => ({ ld: i.loading, fp: i.fp, srcset: i.srcset, sizes: i.sizes, wh: i.wh })))} | eager=${h.img.eager}/${h.img.total} high=[${h.img.high}] eagerBajoPliegue=[${h.img.eagerBelowFold}]`); }
  console.log(`     LCP con loading=lazy: ${r01.filter((r) => r.lcp && r.lcp.loading === 'lazy').map((r) => r.vp + ':' + r.path.split('?')[0]).join(', ')}`);
  console.log(`     imágenes sin width/height=${Math.max(...r01.map((r) => r.img.noDims.length))} sin alt=${Math.max(...r01.map((r) => r.img.noAltAttr.length))} sin srcset=${Math.max(...r01.map((r) => r.img.noSrcset.length))}`);
  console.log(`     hosts=${[...new Set(r01.flatMap((r) => r.hosts))].join(', ')} | externos no Shopify=${[...new Set(r01.flatMap((r) => r.external))].length} | scripts bloqueantes=${Math.max(...r01.map((r) => r.head.blockingScripts.length))} | hojas=${[...new Set(r01.flatMap((r) => r.head.stylesheets.map((x) => x.split('/').pop())))]} | font-display=${[...new Set(r01.flatMap((r) => r.head.fontDisplay.map((x) => x.split(':')[1])))]}`);
  console.log(`     consola: pageerror=${r01.flatMap((r) => r.console).filter((c) => c.type === 'pageerror').length} error=${[...new Set(r01.flatMap((r) => r.console).filter((c) => c.type === 'error').map((c) => c.text.slice(0, 70)))].join(' || ')} | peticiones >=400: ${[...new Set(r01.flatMap((r) => r.failed))].length}`);

  // 02a
  const k = json('results-02a-keyboard.json');
  if (k && k[s]) for (const vp of ['375', '1440']) { const o = k[s][vp]; const w = o.homeWalk.filter((x) => x.el !== '(body)'); const theme = w.filter((x) => !/^a\.(privacy|terms)$/.test(x.el)); console.log(`[02a] @${vp} home: ${w.length} paradas (${theme.length} del tema), inverso=${o.homeWalkReverse.filter((x) => !x.startsWith('(body)')).length}, sin indicador (tema)=${theme.filter((x) => !x.outline && !x.boxShadow).length}, tapadas=${theme.filter((x) => x.inView && x.coveredPct >= 50).length}, contraste mín. del anillo sobre fondo sólido=${Math.min(...theme.filter((x) => x.outlineContrast != null && !x.overImage).map((x) => x.outlineContrast))}; PDP ${o.pdpWalk.filter((x) => x.el !== '(body)').length} paradas; trampas: ${o.traps.map((t) => t.name + '=' + (t.skipped ? 'n/a' : t.navigated ? 'NAVEGA' : `${t.trap.escapes === 0 ? 'ok' : 'FUGA'}/${t.afterEscape.focusOnTrigger ? 'foco↩' : 'SIN-RETORNO'}/${t.open.exp ?? '-'}→${t.afterEscape.exp ?? '-'}`)).join(' ')}; ATC→drawer foco dentro=${o.atc.focusInside}, Esc→ATC=${o.atc.afterEscape.isAtc}, live="${o.atc.live[0]?.txt}"`); }

  // 02b
  const ax = json(`results-02b-axe-${s}.json`) || (json('results-02b-axe.json') || []).filter((r) => r.store === s);
  if (ax && ax.length) { console.log(`[02b] axe: ${ax.length} estados; con violaciones=${ax.filter((r) => r.violations.length).length}; reglas=${JSON.stringify(ax.flatMap((r) => r.violations.map((v) => v.id)).reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {}))}; incomplete=${JSON.stringify(ax.flatMap((r) => r.incomplete.map((v) => v.id)).reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {}))}`); for (const r of ax.filter((x) => x.violations.length)) for (const v of r.violations) console.log(`      ${r.vp} ${r.label}: [${v.impact}] ${v.id} ×${v.n} → ${v.nodes[0].target} ${v.nodes[0].data ? JSON.stringify(v.nodes[0].data) : ''}`); }

  // 02c
  const c = json(`results-02c-contrast-${s}.json`);
  if (c) { const ok = c.filter((r) => !r.error); console.log(`[02c] texto sobre medio: ${ok.length} muestras; FAIL=${ok.filter((r) => r.verdict === 'FAIL').length}; peor píxel mín=${ok.length ? Math.min(...ok.map((r) => r.min)) : 'n/d'}; p5 mín=${ok.length ? Math.min(...ok.map((r) => r.p5)) : 'n/d'}; secciones=${[...new Set(ok.map((r) => r.section))]}`); for (const r of ok.filter((x) => x.verdict !== 'PASS')) console.log(`      ${r.vp} ${r.path} ${r.section} ${r.verdict} min=${r.min} p5=${r.p5} need=${r.need} "${r.text}"`); }

  // 02e
  const f = json(`results-02e-focus-over-media-${s}.json`);
  if (f) for (const sel of ['.hero-editorial__button', '.lookbook-hotspot__trigger', '.product-gallery__zoom-trigger', '.bento-card--featured', '.marquee-banner__toggle']) { const rows = f.filter((r) => r.sel === sel && r.ring && r.ring.p50 !== null); if (rows.length) console.log(`[02e] ${sel}: n=${rows.length} anillo p50 ${rng(rows.map((r) => r.ring.p50))}, % píxeles <3:1 ${rng(rows.map((r) => r.ring.below3Pct))}, outline=${rows[0].outline}`); }

  // 04
  const cl = json(`results-04-cls-scroll-${s}.json`);
  if (cl) for (const mode of [...new Set(cl.map((r) => r.mode))]) console.log(`[04] ${mode} (parcheado=${[...new Set(cl.filter((r) => r.mode === mode).map((r) => r.patched))]}): ${cl.filter((r) => r.mode === mode).map((r) => `${r.vp}/${r.speed}=${r.error ? 'ERR' : r.cls}`).join(' ')}`);

  // 05
  const rs = json(`results-05-resilience-${s}.json`);
  if (rs) { const t = rs.filter((r) => r.kind); console.log(`[05] inyecciones=${t.length}; con desbordamiento/recorte/solape=${t.filter((r) => r.docOverflow > 0 || r.clippedX > 0 || r.overflowsParent > 1 || r.outOfViewport > 0 || r.overlap).length}; reflow 320: ${rs.filter((r) => r.reflow320 !== undefined).map((r) => r.path.split('/').slice(0, 2).join('/') + '=' + r.reflow320).join(' ')}`); }
}
const lh = ['atelier', 'edition', 'archive'].flatMap((s) => json(`results-08-lighthouse-${s}.json`) || []).concat(json('results-08-lighthouse.json') || []);
if (lh.length) { console.log('\n[08] Lighthouse'); for (const r of lh) console.log(r.error ? `  ${r.store} ${r.page} ${r.form} ERROR` : `  ${r.store.padEnd(8)} ${r.page.padEnd(10)} ${r.form.padEnd(7)} perf=${r.performance} a11y=${r.accessibility} LCP=${r.lcp} TBT=${r.tbt} CLS=${r.cls} ${r.invalid || ''}`); }
