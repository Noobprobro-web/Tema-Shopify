#!/usr/bin/env node
// Registra en Shopify las traducciones al español del contenido de la tienda
// (plantillas JSON, grupo de cabecera, títulos de páginas, enlaces de menú,
// menús, colecciones y el cuerpo de la página de políticas).
// Sin dependencias: Node 18+ (fetch y crypto nativos).
//
// Modos
//   --check                     Valida el diccionario contra las plantillas locales (sin red).
//   --snapshot <archivo.json>   Planifica contra una instantánea de translatableResources.
//   --store <tienda.myshopify.com>  Planifica contra la tienda en vivo (requiere SHOPIFY_ADMIN_TOKEN).
//   --apply                     Con --store: ejecuta translationsRegister.
//   --verify                    Con --store: relee translations(locale) y compara.
//   --emit <carpeta>            Escribe los lotes como documentos GraphQL + variables.
//   --data <archivo>            Diccionario (por defecto scripts/translations/es.storefront.json).
//   --theme-id <id>             Tema cuyas plantillas se traducen (por defecto el publicado).
//
// Seguridad: solo se registra una traducción si sha256(inglés del diccionario)
// coincide con el digest vivo. Si el comerciante cambió el texto inglés, la
// entrada se informa como "desfasada" y no se registra.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const ROOT = process.cwd();
const DATA = opt('--data', path.join(ROOT, 'scripts/translations/es.storefront.json'));
const API = process.env.SHOPIFY_API_VERSION || '2026-04';
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const LOCALE = data.locale;
const SKIP = /\.(anchor|code|image|image_desktop|image_mobile|video)$/;
const RESOURCE_TYPES = ['ONLINE_STORE_THEME_JSON_TEMPLATE', 'ONLINE_STORE_THEME_SECTION_GROUP', 'PAGE', 'LINK', 'MENU', 'COLLECTION'];

function tagSeq(html) { return (html.match(/<\/?[a-z0-9]+/gi) || []).join(' '); }
function stripJsonComment(t) { return t.replace(/^\s*\/\*[\s\S]*?\*\//, ''); }
function flattenLocal(file) {
  const p = file.startsWith('sections/') ? path.join(ROOT, file) : path.join(ROOT, 'templates', file);
  if (!fs.existsSync(p)) return null;
  const j = JSON.parse(stripJsonComment(fs.readFileSync(p, 'utf8')));
  const out = {};
  for (const [sid, s] of Object.entries(j.sections || {})) {
    for (const [k, v] of Object.entries(s.settings || {})) if (typeof v === 'string') out[`${sid}.${k}`] = v;
    for (const [bid, b] of Object.entries(s.blocks || {})) for (const [k, v] of Object.entries(b.settings || {})) if (typeof v === 'string') out[`${sid}.${bid}.${k}`] = v;
  }
  return out;
}

// ---------- --check: diccionario frente a plantillas locales ----------
function check() {
  let ok = 0, ready = 0, needsPatch = [], problems = [];
  for (const [file, entries] of Object.entries(data.theme)) {
    const local = flattenLocal(file);
    if (!local) { problems.push(`${file}: archivo local inexistente`); continue; }
    for (const [p, e] of Object.entries(entries)) {
      if (!e.es || !e.es.trim()) problems.push(`${file} ${p}: traducción vacía`);
      if (tagSeq(e.en) !== tagSeq(e.es)) problems.push(`${file} ${p}: etiquetas HTML distintas`);
      if (e.en === e.es) problems.push(`${file} ${p}: traducción idéntica al inglés`);
      if (p in local) {
        if (local[p] !== e.en) problems.push(`${file} ${p}: el inglés local cambió`);
        else if (e.pending_deploy) ready++;
        else ok++;
      } else if (e.pending_deploy) needsPatch.push(`${file} ${p}`);
      else problems.push(`${file} ${p}: no existe en la plantilla local`);
    }
  }
  for (const t of data.titles) if (!t.es || t.es === t.en) problems.push(`título "${t.en}": traducción vacía o idéntica`);
  for (const [h, b] of Object.entries(data.page_bodies || {})) if (tagSeq(b.en) !== tagSeq(b.es)) problems.push(`cuerpo ${h}: etiquetas HTML distintas`);
  console.log(`check: ${ok} entradas de tema coinciden con las plantillas locales, ${ready} listas para registrar tras el despliegue, ${needsPatch.length} requieren declarar el valor en la plantilla, ${data.titles.length} títulos, ${Object.keys(data.page_bodies || {}).length} cuerpos de página`);
  needsPatch.forEach((x) => console.log('  REQUIERE PARCHE DE PLANTILLA ' + x));
  problems.forEach((x) => console.log('  PROBLEMA ' + x));
  console.log(problems.length ? `check: ${problems.length} problemas` : 'check: 0 problemas');
  return problems.length ? 1 : 0;
}

// ---------- planificación ----------
function themeFileFromResource(rid) {
  const m = rid.match(/OnlineStoreTheme(JsonTemplate|SectionGroup)\/([^?]+)/);
  if (!m) return null;
  return m[1] === 'SectionGroup' ? `sections/${m[2]}.json` : `${m[2]}.json`;
}
function plan(resources, themeId) {
  const batches = [], report = { registered: 0, stale: [], untranslated: [], skipped: 0, pendingLive: [] };
  const titleMap = new Map(data.titles.map((t) => [t.en, t.es]));
  const seenTheme = new Set();
  const keep = new Set(data.keep_source || []);
  for (const r of resources) {
    if (themeId && /OnlineStoreTheme/.test(r.resourceId) && !r.resourceId.includes(`theme_id=${themeId}`)) continue;
    const tr = [];
    const file = themeFileFromResource(r.resourceId);
    const handle = (r.translatableContent.find((c) => c.key === 'handle') || {}).value;
    for (const c of r.translatableContent) {
      let entry = null;
      if (file) {
        const prefix = `section.${file}.`;
        if (!c.key.startsWith(prefix)) continue;
        const p = c.key.slice(prefix.length).replace(/:[a-z0-9]+$/, '');
        if (SKIP.test(p)) { report.skipped++; continue; }
        seenTheme.add(`${file} ${p}`);
        entry = data.theme[file] && data.theme[file][p];
        if (!entry && keep.has(c.value)) { report.skipped++; continue; }
        if (!entry) { if (c.value && !/^(shopify:\/\/|\/)/.test(c.value)) report.untranslated.push(`${r.resourceId} ${c.key} = ${JSON.stringify(c.value).slice(0, 70)}`); continue; }
      } else if (c.key === 'title') {
        if (!titleMap.has(c.value)) { report.untranslated.push(`${r.resourceId} title = ${c.value}`); continue; }
        entry = { en: c.value, es: titleMap.get(c.value) };
      } else if (c.key === 'body_html' && c.value) {
        entry = (data.page_bodies || {})[handle];
        if (!entry) { report.untranslated.push(`${r.resourceId} body_html (${handle})`); continue; }
      } else continue;
      if (sha(entry.en) !== c.digest) { report.stale.push(`${r.resourceId} ${c.key}`); continue; }
      tr.push({ locale: LOCALE, key: c.key, value: entry.es, translatableContentDigest: c.digest });
    }
    if (tr.length) { batches.push({ resourceId: r.resourceId, translations: tr }); report.registered += tr.length; }
  }
  for (const [file, entries] of Object.entries(data.theme)) for (const [p, e] of Object.entries(entries)) {
    if (!seenTheme.has(`${file} ${p}`)) report.pendingLive.push(`${file} ${p}${e.pending_deploy ? ' (pending_deploy)' : ''}`);
  }
  return { batches, report };
}
function printReport({ batches, report }) {
  console.log(`plan: ${report.registered} traducciones en ${batches.length} recursos; ${report.skipped} claves omitidas a propósito (anclas, imágenes, archivos, nombres propios)`);
  console.log(`plan: ${report.stale.length} desfasadas, ${report.untranslated.length} sin traducción en el diccionario, ${report.pendingLive.length} entradas del diccionario sin clave viva`);
  report.stale.forEach((x) => console.log('  DESFASADA ' + x));
  report.untranslated.forEach((x) => console.log('  SIN TRADUCCIÓN ' + x));
  report.pendingLive.forEach((x) => console.log('  SIN CLAVE VIVA ' + x));
}

// ---------- emisión de lotes GraphQL ----------
function chunk(batches, maxTranslations = 60) {
  const out = []; let cur = [], n = 0;
  for (const b of batches) {
    if (cur.length && n + b.translations.length > maxTranslations) { out.push(cur); cur = []; n = 0; }
    cur.push(b); n += b.translations.length;
  }
  if (cur.length) out.push(cur);
  return out;
}
function toGraphql(group) {
  const vars = {}, defs = [], body = [];
  group.forEach((b, i) => {
    defs.push(`$r${i}: ID!`, `$t${i}: [TranslationInput!]!`);
    body.push(`  a${i}: translationsRegister(resourceId: $r${i}, translations: $t${i}) { userErrors { field message code } translations { key locale } }`);
    vars[`r${i}`] = b.resourceId; vars[`t${i}`] = b.translations;
  });
  return { query: `mutation TranslateStorefront(${defs.join(', ')}) {\n${body.join('\n')}\n}`, variables: vars };
}

// ---------- API en vivo ----------
async function gql(store, query, variables) {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!token) throw new Error('Falta SHOPIFY_ADMIN_TOKEN');
  const res = await fetch(`https://${store}/admin/api/${API}/graphql.json`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const j = await res.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}
async function fetchResources(store) {
  const all = [];
  for (const type of RESOURCE_TYPES) {
    let after = null;
    do {
      const d = await gql(store, `query($type: TranslatableResourceType!, $after: String) { translatableResources(resourceType: $type, first: 50, after: $after) { pageInfo { hasNextPage endCursor } nodes { resourceId translatableContent { key value digest } } } }`, { type, after });
      const c = d.translatableResources; all.push(...c.nodes); after = c.pageInfo.hasNextPage ? c.pageInfo.endCursor : null;
    } while (after);
  }
  return all;
}
async function publishedThemeId(store) {
  const d = await gql(store, `{ themes(first: 1, roles: [MAIN]) { nodes { id } } }`);
  return d.themes.nodes[0].id.split('/').pop();
}

async function main() {
  if (flag('--check')) process.exit(check());
  let resources, themeId = opt('--theme-id', null);
  const store = opt('--store', null);
  if (opt('--snapshot', null)) resources = JSON.parse(fs.readFileSync(opt('--snapshot'), 'utf8'));
  else if (store) { themeId = themeId || await publishedThemeId(store); resources = await fetchResources(store); }
  else { console.log('Uso: --check | --snapshot <archivo> | --store <tienda> [--apply] [--verify] [--emit <carpeta>]'); process.exit(2); }
  const result = plan(resources, themeId);
  printReport(result);
  const groups = chunk(result.batches);
  if (opt('--emit', null)) {
    const dir = opt('--emit'); fs.mkdirSync(dir, { recursive: true });
    groups.forEach((g, i) => {
      const { query, variables } = toGraphql(g);
      fs.writeFileSync(path.join(dir, `batch-${i + 1}.graphql`), query + '\n');
      fs.writeFileSync(path.join(dir, `batch-${i + 1}.variables.json`), JSON.stringify(variables, null, 2) + '\n');
    });
    console.log(`emit: ${groups.length} lotes en ${dir}`);
  }
  if (store && flag('--apply')) {
    let errors = 0;
    for (const g of groups) {
      const { query, variables } = toGraphql(g);
      const d = await gql(store, query, variables);
      for (const [alias, v] of Object.entries(d)) for (const e of v.userErrors) { errors++; console.log(`  ERROR ${alias} ${e.code} ${e.message}`); }
    }
    console.log(`apply: ${result.report.registered} traducciones enviadas, ${errors} errores`);
    if (errors) process.exit(1);
  }
  if (store && flag('--verify')) {
    let missing = 0;
    for (const b of result.batches) {
      const d = await gql(store, `query($id: ID!, $l: String!) { translatableResource(resourceId: $id) { translations(locale: $l) { key value outdated } } }`, { id: b.resourceId, l: LOCALE });
      const got = new Map(d.translatableResource.translations.map((t) => [t.key, t]));
      for (const t of b.translations) { const g = got.get(t.key); if (!g || g.value !== t.value || g.outdated) { missing++; console.log(`  NO VERIFICADA ${b.resourceId} ${t.key}`); } }
    }
    console.log(`verify: ${result.report.registered - missing}/${result.report.registered} traducciones vivas y al día`);
    if (missing) process.exit(1);
  }
  if (result.report.stale.length) process.exit(1);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
