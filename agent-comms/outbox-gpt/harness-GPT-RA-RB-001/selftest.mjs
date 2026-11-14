// Local self-test for run.mjs. No network, no browser, no store, no credentials:
// it loads run.mjs as a module (main() is cut off, like run-b02.mjs does) and
// exercises the redaction guard, safeCode, the store/theme allowlist and the
// request policy with synthetic values only.
//   node agent-comms/outbox-gpt/harness-GPT-RA-RB-001/selftest.mjs
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const OLD = 'tema-qkqpke0j.myshopify.com';
const NEW = 'sartorial-theme-kvkzl39t.myshopify.com';
const source = await readFile(join(HERE, 'run.mjs'), 'utf8');
const marker = '\ntry {\n  await main();\n}';
const cut = source.lastIndexOf(marker);
if (!(cut > 0 && source.indexOf(marker) === cut)) throw new Error('RUNNER_LAYOUT_NOT_EXPECTED');
const moduleText = `${source.slice(0, cut)}
export { resolveTarget, safeCode, buildInventorySecretGuard, safeWarningSource, requestDecision, routeEvent, isExternalHostFetchFailure, ORIGIN, READ_HOSTS, INVENTORY_HOSTS, AUTHORIZED_THEME_IDS, PREVIEWS, TARGET, KNOWN_STORES, ROUTES, verifyPreview };
export function installGuard(environment) { inventorySecretGuard = buildInventorySecretGuard(environment); return inventorySecretGuard; }
`;
const dir = await mkdtemp(join(tmpdir(), 'ra-rb-selftest-'));
const file = join(dir, 'runner-copy.mjs');
await writeFile(file, moduleText);
await writeFile(join(dir, 'stores.json'), await readFile(join(HERE, 'stores.json')));
async function load(argv, storesText = null) {
  const saved = process.argv;
  process.argv = [saved[0], saved[1], ...argv];
  let target = file;
  if (storesText !== null) { // synthetic stores.json in its own directory (stores.json is read next to the runner copy)
    const sub = await mkdtemp(join(dir, 'syn-'));
    target = join(sub, 'runner-copy.mjs');
    await writeFile(target, moduleText);
    await writeFile(join(sub, 'stores.json'), storesText);
  }
  try { return await import(`${pathToFileURL(target).href}?v=${randomUUID()}`); } finally { process.argv = saved; }
}

let passed = 0;
let failed = 0;
const check = (name, ok, extra = '') => { if (ok) passed += 1; else failed += 1; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` :: ${extra}` : ''}`); };
const throwsNothing = (fn) => { try { return fn(); } catch (error) { return { threw: error?.name || 'Error' }; } };

try {
  const noFlag = await load(['--read-only']);
  const oldRun = await load(['--read-only', `--store=${OLD}`]);
  const newRun = await load(['--read-only', `--store=${NEW}`]);
  const storesText = await readFile(join(HERE, 'stores.json'), 'utf8');
  const target = (argv, text = storesText) => noFlag.resolveTarget(argv, () => text);

  // ---- 1. Redaction guard
  const secretEnv = { STOREFRONT_PASSWORD: 'abcdef', SHOPIFY_CLI_THEME_TOKEN: 'tk1' };
  {
    const guard = noFlag.installGuard({ ...secretEnv, OLDPWD: '/', PWD: '/home/user', UNRELATED_KEY: 'ab' });
    const path = noFlag.safeWarningSource('https://monorail-edge.shopifysvc.com/v1/produce_batch');
    check('OLDPWD="/" y PWD no redactan paths', path.pathname === '/v1/produce_batch' && path.host === 'monorail-edge.shopifysvc.com' && path.redacted === false, `redacted=${path.redacted}`);
    check('valor corto de variable no secreta (UNRELATED_KEY, 2 caracteres) no se redacta', guard.matches('/products/ab-ab') === false);
    const pw = noFlag.safeWarningSource('https://shop.example.com/x/abcdef/y');
    check('STOREFRONT_PASSWORD de 6 letras SI se redacta aunque sea corto', pw.redacted === true && pw.pathname === null && pw.redactionReason === 'SECRET_MATCH', `reason=${pw.redactionReason}`);
    check('STOREFRONT_PASSWORD redacta tambien su forma codificada/mayusculas', guard.matches('/x/%41BCDEF/y') === true);
    const token = noFlag.safeWarningSource('https://shop.example.com/a/tk1');
    check('SHOPIFY_CLI_THEME_TOKEN corto (3 caracteres) SI se redacta', token.redacted === true && token.pathname === null);
  }
  {
    const guard = noFlag.installGuard({ ...secretEnv, OTHER_SECRET: '12345678', SHORT_SECRET: '1234567', OLDPWD: '/some/long/directory' });
    check('otra variable secreta de >= 8 caracteres se sigue protegiendo', guard.matches('/p/12345678/q') === true);
    check('otra variable secreta de 7 caracteres no se protege (umbral minimo 8)', guard.matches('/p/1234567/q') === false);
    check('OLDPWD largo tampoco entra (excluido por nombre)', guard.matches('/some/long/directory/x') === false);
    const huge = noFlag.buildInventorySecretGuard({ ...secretEnv, BIG_TOKEN: 'x'.repeat(16385) });
    check('valor gigante sigue marcando el guardian como no disponible (cierre en fallo)', huge.unavailable === true && huge.matches('/a') === true);
  }

  // ---- 2. safeCode
  const named = (name, message) => Object.assign(new Error(message), { name });
  check('safeCode: TargetClosedError por nombre', noFlag.safeCode(named('TargetClosedError', 'x')) === 'TARGET_CLOSED');
  check('safeCode: TargetClosedError por mensaje de Playwright', noFlag.safeCode(new Error('Target page, context or browser has been closed')) === 'TARGET_CLOSED' && noFlag.safeCode(new Error('Request context disposed.')) === 'TARGET_CLOSED');
  check('safeCode: ECONNRESET/EPIPE/ETIMEDOUT en el mensaje', ['read ECONNRESET', 'write EPIPE', 'connect ETIMEDOUT 1.2.3.4:443'].every((m) => noFlag.safeCode(new Error(m)) === 'NETWORK_ERROR'));
  check('safeCode: socket hang up y net::ERR_ desconocido', noFlag.safeCode(new Error('socket hang up')) === 'NETWORK_ERROR' && noFlag.safeCode(new Error('net::ERR_SOMETHING_NEW at https://x')) === 'NETWORK_ERROR');
  check('safeCode: error.code de Node (EPIPE) sigue siendo un codigo fijo', noFlag.safeCode(Object.assign(new Error('m'), { code: 'EPIPE' })) === 'NETWORK_EPIPE');
  check('safeCode: net::ERR_ conocido de Chromium conserva su codigo', noFlag.safeCode(new Error('net::ERR_ABORTED')) === 'CHROMIUM_ERR_ABORTED');
  check('safeCode: TimeoutError y desconocido no cambian', noFlag.safeCode(named('TimeoutError', 'x')) === 'PLAYWRIGHT_TIMEOUT' && noFlag.safeCode(new Error('whatever https://secret.example/?t=1')) === 'HARNESS_OPERATION_FAILED');
  check('safeCode: nunca devuelve el mensaje', !/secret|https/.test(noFlag.safeCode(new Error('read ECONNRESET https://secret.example/?t=1'))));

  // ---- 3. Store / theme allowlist
  check('sin --store: STORE_FLAG_REQUIRED y origen nulo', target(['--read-only']).error === 'STORE_FLAG_REQUIRED' && noFlag.ORIGIN === null && noFlag.READ_HOSTS.size === 0 && noFlag.AUTHORIZED_THEME_IDS.size === 0);
  check('dominio fuera de la lista: STORE_NOT_ALLOWED', ['evil.myshopify.com', `${OLD}.evil.com`, `x${OLD}`, `https://${OLD}`, OLD.toUpperCase(), '', ` ${OLD}`].every((d) => target([`--store=${d}`]).error === 'STORE_NOT_ALLOWED'));
  check('--store duplicado: STORE_FLAG_DUPLICATED', target([`--store=${OLD}`, `--store=${NEW}`]).error === 'STORE_FLAG_DUPLICATED');
  const envBefore = process.env.STORE;
  process.env.STORE = OLD; process.env.SHOPIFY_FLAG_STORE = OLD; process.env.STOREFRONT_ORIGIN = `https://${OLD}`;
  check('variables de entorno de dominio se ignoran (sin flag sigue fallando)', target(['--read-only']).error === 'STORE_FLAG_REQUIRED');
  delete process.env.SHOPIFY_FLAG_STORE; delete process.env.STOREFRONT_ORIGIN; if (envBefore === undefined) delete process.env.STORE; else process.env.STORE = envBefore;
  check('tienda antigua: 3 themes de stores.json', oldRun.TARGET.error === null && oldRun.ORIGIN === `https://${OLD}` && oldRun.PREVIEWS.map((p) => p.id).join() === '190232297715,190232330483,190232363251', oldRun.PREVIEWS.map((p) => p.preset).join());
  check('tienda antigua conserva sus rutas', oldRun.ROUTES.home === '/' && oldRun.ROUTES.collection === '/collections/the-permanent-collection' && oldRun.ROUTES.product === '/products/wool-waistcoat' && oldRun.ROUTES.cart === '/cart');
  check('tienda nueva: 3 temas no publicados, origen propio', newRun.TARGET.error === null && newRun.ORIGIN === `https://${NEW}` && newRun.PREVIEWS.map((p) => `${p.preset}:${p.id}`).join() === 'sartorial:190300356912,imprint:190300455216,archive:190300422448');
  check('tienda nueva: rutas propias (permanent-collection / serra-coat)', newRun.ROUTES.collection === '/collections/permanent-collection' && newRun.ROUTES.product === '/products/serra-coat' && newRun.ROUTES.home === '/');
  check('el tema publicado test-data (190299111728) NO esta en stores.json (ni Horizon/debut)', !storesText.includes('190299111728') && !/horizon|debut/i.test(storesText));
  check('los IDs de la tienda antigua no se autorizan en la nueva', !newRun.AUTHORIZED_THEME_IDS.has('190232297715') && !oldRun.AUTHORIZED_THEME_IDS.has('190300356912'));
  check('READ_HOSTS e INVENTORY_HOSTS solo contienen la tienda elegida', oldRun.READ_HOSTS.has(OLD) && !oldRun.READ_HOSTS.has(NEW) && newRun.READ_HOSTS.has(NEW) && !newRun.READ_HOSTS.has(OLD) && newRun.INVENTORY_HOSTS.has(NEW) && !newRun.INVENTORY_HOSTS.has(OLD));
  const mutate = (fn) => { const doc = JSON.parse(storesText); fn(doc); return JSON.stringify(doc); };
  const bad = {
    'JSON roto': '{',
    'schema distinto': mutate((d) => { d.schema = 2; }),
    'tercera tienda': mutate((d) => { d.stores['evil.myshopify.com'] = { themes: [] }; }),
    'falta una tienda conocida': mutate((d) => { delete d.stores[NEW]; }),
    'ID repetido entre tiendas': mutate((d) => { d.stores[NEW].themes.push({ preset: 'x', id: '190232297715' }); }),
    'ID no numerico': mutate((d) => { d.stores[NEW].themes.push({ preset: 'x', id: '12ab34567' }); }),
    'ID corto': mutate((d) => { d.stores[NEW].themes.push({ preset: 'x', id: '123' }); }),
    'ID como numero': mutate((d) => { d.stores[NEW].themes.push({ preset: 'x', id: 190232999999 }); }),
    'clave extra en el tema': mutate((d) => { d.stores[NEW].themes.push({ preset: 'x', id: '190232999999', extra: 1 }); }),
    'clave extra en la tienda': mutate((d) => { d.stores[NEW].note = 'x'; }),
    'preset invalido': mutate((d) => { d.stores[NEW].themes.push({ preset: 'Bad Preset', id: '190232999999' }); }),
    'falta routes': mutate((d) => { delete d.stores[NEW].routes; }),
    'routes con clave extra': mutate((d) => { d.stores[NEW].routes.cart = '/cart'; }),
    'routes sin product': mutate((d) => { delete d.stores[NEW].routes.product; }),
    'ruta de coleccion con query': mutate((d) => { d.stores[NEW].routes.collection = '/collections/a?x=1'; }),
    'ruta de coleccion con mayusculas': mutate((d) => { d.stores[NEW].routes.collection = '/collections/Permanent'; }),
    'ruta de coleccion con subruta': mutate((d) => { d.stores[NEW].routes.collection = '/collections/a/products/b'; }),
    'ruta de producto de otro tipo': mutate((d) => { d.stores[NEW].routes.product = '/collections/serra-coat'; }),
    'ruta de producto sin barra inicial': mutate((d) => { d.stores[NEW].routes.product = 'products/serra-coat'; }),
    'ruta de producto absoluta (otro host)': mutate((d) => { d.stores[NEW].routes.product = 'https://evil.example/products/x'; }),
    'ruta de producto protocolo-relativa': mutate((d) => { d.stores[NEW].routes.product = '//evil.example/products/x'; }),
    'ruta de producto con salto de linea final': mutate((d) => { d.stores[NEW].routes.product = '/products/serra-coat\n'; }),
    'ruta no es cadena': mutate((d) => { d.stores[NEW].routes.product = 5; }),
    'routes es un array': mutate((d) => { d.stores[NEW].routes = ['/collections/a', '/products/b']; }),
    '__proto__ como tienda': storesText.replace('"stores": {', '"stores": { "__proto__": { "themes": [] },'),
  };
  for (const [label, text] of Object.entries(bad)) check(`stores.json invalido (${label}) se rechaza`, target([`--store=${NEW}`], text).error === 'STORES_FILE_INVALID');
  check('stores.json con un ID nuevo valido se acepta solo para su tienda', (() => { const text = mutate((d) => { d.stores[NEW].themes.push({ preset: 'sartorial', id: '190232999999' }); }); const a = target([`--store=${NEW}`], text); const b = target([`--store=${OLD}`], text); return a.error === null && a.themes.length === 4 && b.themes.length === 3; })());
  // Claves de tienda duplicadas: JSON.parse se queda con la ultima sin avisar.
  {
    const dupNew = storesText.replace(`"${NEW}": {`, `"${NEW}": { "themes": [], "routes": { "collection": "/collections/a", "product": "/products/b" } },\n    "${NEW}": {`);
    const dupOld = storesText.replace(`"${OLD}": {`, `"${OLD}": { "themes": [], "routes": { "collection": "/collections/a", "product": "/products/b" } },\n    "${OLD}": {`);
    check('el texto de prueba con clave duplicada es JSON valido (JSON.parse lo aceptaria en silencio)', (() => { try { JSON.parse(dupNew); JSON.parse(dupOld); return dupNew !== storesText && dupOld !== storesText; } catch { return false; } })());
    check('clave de tienda duplicada (nueva o antigua) se rechaza con STORES_FILE_DUPLICATE_KEY', target([`--store=${NEW}`], dupNew).error === 'STORES_FILE_DUPLICATE_KEY' && target([`--store=${OLD}`], dupOld).error === 'STORES_FILE_DUPLICATE_KEY' && target([`--store=${OLD}`], dupNew).error === 'STORES_FILE_DUPLICATE_KEY');
    check('sin duplicados el mismo texto se acepta', target([`--store=${NEW}`]).error === null && target([`--store=${OLD}`]).error === null);
  }
  check('resolveTarget no lanza ante un lector de archivo que falla', throwsNothing(() => noFlag.resolveTarget([`--store=${OLD}`], () => { throw new Error('ENOENT'); })).error === 'STORES_FILE_INVALID');

  // ---- 4. Politica de peticiones (sin red)
  const decide = (run, method, url, kind = 'document', context = 'browser', session = { mode: 'read-only' }) => run.requestDecision(session, method, url, kind, context, true);
  check('tienda antigua: GET a su host permitido; GET a la tienda nueva bloqueado', decide(oldRun, 'GET', `https://${OLD}/`).allowed === true && decide(oldRun, 'GET', `https://${NEW}/`).allowed === false);
  check('tienda nueva: GET a su host permitido; GET a la antigua bloqueado', decide(newRun, 'GET', `https://${NEW}/`).allowed === true && decide(newRun, 'GET', `https://${OLD}/`).allowed === false);
  check('sin tienda: todo GET de tienda bloqueado (cierre en fallo)', decide(noFlag, 'GET', `https://${OLD}/`).allowed === false && decide(noFlag, 'GET', `https://${NEW}/`).allowed === false);
  check('POST /password: una sola vez por sesion (authPostAllowed)', (() => { const s = { mode: 'cart', authPostAllowed: true }; const first = decide(newRun, 'POST', `https://${NEW}/password`, 'fetch', 'api', s); return first.allowed === true && decide(newRun, 'POST', `https://${NEW}/password`, 'fetch', 'api', { mode: 'cart', authPostAllowed: false }).allowed === false; })());
  check('mutaciones bloqueadas fuera del carrito autorizado', ['/cart/add.js', '/cart/change.js', '/checkout', '/admin/x'].every((p) => decide(newRun, 'POST', `https://${NEW}${p}`, 'fetch', 'api', { mode: 'read-only' }).allowed === false));
  check('carrito: solo add/update/clear con sesion cart autorizada', (() => { const s = { mode: 'cart', cartWriteEnabled: true, cartAuthorization: true, cleanupInProgress: false, previewVerified: true }; return ['/cart/add.js', '/cart/update.js', '/cart/clear.js'].every((p) => decide(newRun, 'POST', `https://${NEW}${p}`, 'fetch', 'api', s).allowed === true) && decide(newRun, 'POST', `https://${NEW}/cart/change.js`, 'fetch', 'api', s).allowed === false && decide(newRun, 'POST', `https://${OLD}/cart/add.js`, 'fetch', 'api', s).allowed === false; })());
  check('un fallo de fetch a un tema ajeno no cuenta como asset autorizado', (() => { const err = new Error('x'); return newRun.isExternalHostFetchFailure('fetch', true, 'GET', `https://cdn.shopify.com/cdn/shop/t/190232297715/assets/a.js`, err) === true; })(), 'el ID de la tienda antigua ya no esta autorizado en la nueva (host externo = solo aviso)');
  check('en la tienda antigua ese mismo asset sigue siendo fallo real', oldRun.isExternalHostFetchFailure('fetch', true, 'GET', `https://cdn.shopify.com/cdn/shop/t/190232297715/assets/a.js`, new Error('x')) === false);

  // ---- 4b. Rol del tema en el navegador (C1): ejecuta el verifyPreview real con un window sintetico
  {
    const NEWID = '190300356912';
    const MAIN_ID = '190299111728'; // test-data, tema publicado de la tienda nueva
    const runVerify = async (run, themeId, shopifyTheme, host = NEW) => {
      const session = { themeId, previewVerified: false };
      const fakePage = { url: () => `https://${host}/?preview_theme_id=${themeId}`, evaluate: async (fn, arg) => { globalThis.window = { Shopify: { theme: shopifyTheme } }; try { return fn(arg); } finally { delete globalThis.window; } } };
      try { await run.verifyPreview(fakePage, session); return { ok: true, verified: session.previewVerified }; } catch (error) { return { ok: false, code: error?.message, verified: session.previewVerified }; }
    };
    const accepted = await runVerify(newRun, NEWID, { id: Number(NEWID), role: 'unpublished' });
    check("rol 'unpublished' con ID autorizado se acepta", accepted.ok === true && accepted.verified === true, JSON.stringify(accepted));
    for (const role of ['main', 'development', 'demo', 'archived', 'locked', 'Unpublished', ' unpublished', '', null, undefined, 7]) {
      const result = await runVerify(newRun, NEWID, { id: Number(NEWID), role });
      check(`rol ${JSON.stringify(role) ?? 'undefined'} se rechaza con PREVIEW_ROLE_NOT_UNPUBLISHED`, result.ok === false && result.code === 'PREVIEW_ROLE_NOT_UNPUBLISHED' && result.verified === false, JSON.stringify(result));
    }
    check("'development' se rechaza a proposito: las previews de este harness son temas unpublished, un tema de desarrollo no es un destino valido", (await runVerify(newRun, NEWID, { id: Number(NEWID), role: 'development' })).code === 'PREVIEW_ROLE_NOT_UNPUBLISHED');
    check('sin Shopify.theme o ID distinto: PREVIEW_ID_NOT_VERIFIED (antes que el rol)', (await runVerify(newRun, NEWID, undefined)).code === 'PREVIEW_ID_NOT_VERIFIED' && (await runVerify(newRun, NEWID, { id: 1, role: 'unpublished' })).code === 'PREVIEW_ID_NOT_VERIFIED');
    // El tema publicado puesto (por error) en stores.json: el ID pasa la lista, el rol lo para.
    const doc = JSON.parse(storesText); doc.stores[NEW].themes.push({ preset: 'test-data', id: MAIN_ID });
    const poisonedRun = await load(['--read-only', `--store=${NEW}`], JSON.stringify(doc));
    check('sintetico: 190299111728 en stores.json queda autorizado por ID (la lista no es la defensa)', poisonedRun.TARGET.error === null && poisonedRun.AUTHORIZED_THEME_IDS.has(MAIN_ID));
    const mainServed = await runVerify(poisonedRun, MAIN_ID, { id: Number(MAIN_ID), role: 'main' });
    check('sintetico: el tema publicado con su ID en stores.json NO pasa verifyPreview (rol main)', mainServed.ok === false && mainServed.code === 'PREVIEW_ROLE_NOT_UNPUBLISHED' && mainServed.verified === false, JSON.stringify(mainServed));
  }

  // ---- 5. Fase del evento de ruta
  const page = { url: () => `https://${NEW}/` };
  const wf = oldRun.routeEvent({ page, teardownStarted: false }, 'fetch', 'GET', `https://${OLD}/a`, named('TargetClosedError', 'x'));
  const td = oldRun.routeEvent({ page, teardownStarted: true }, 'fetch', 'GET', `https://${OLD}/a`, named('TargetClosedError', 'x'));
  check('routeEvent: phase workflow/teardown y codigo fijo', wf.phase === 'workflow' && td.phase === 'teardown' && td.code === 'TARGET_CLOSED' && td.stage === 'fetch');
} finally {
  await rm(dir, { recursive: true, force: true });
}
console.log(`\nRESUMEN ${passed}/${passed + failed} comprobaciones correctas`);
process.exitCode = failed === 0 ? 0 : 1;
