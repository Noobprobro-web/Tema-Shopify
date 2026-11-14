```text
ID: REVIEW-HARNESS-PATCH-001
Estado: COMMITEAR CON CAMBIOS (1 cambio obligatorio, C1). El parche de run.mjs, stores.json, selftest.mjs y run-b02.mjs es correcto en lista cerrada de tiendas, hosts derivados, guardián de redacción, safeCode/phase y pin SHA. Falta una sola comprobación: el harness admite el tema MAIN si su ID se añade a stores.json.
Decisión requerida: Gemini/Johandry. (a) Aprobar C1 (comprobación de rol `unpublished` en verifyPreview de run.mjs), que cambia el SHA y obliga a re-fijar D28_RUNNER_SHA256 y a registrar el SHA final en D32. (b) Opcional: fijar también el SHA de stores.json en run-b02 (P2-1).
Resumen en 5 líneas:
1. --store solo acepta, por igualdad exacta, los dos dominios de KNOWN_STORES (run.mjs:16, 26). Ni entorno, ni URL, ni stores.json añaden dominios. READ_HOSTS, INVENTORY_HOSTS, ORIGIN y la política salen de la tienda elegida. No queda ningún literal de la tienda antigua que dé acceso con --store=nueva (selftest y prueba adversarial).
2. Si alguien pone 190299111728 (test-data, MAIN) en stores.json, resolveTarget lo acepta y verifyPreview (run.mjs:255-259) solo compara el ID. Solo lo pararía el preflight externo, que es humano. run-b02.mjs:180 ya exige role === 'unpublished'; run.mjs no (C1).
3. Guardián: las dos credenciales siempre se protegen; PWD/OLDPWD se excluyen por nombre exacto; el resto necesita ≥8 caracteres. Con valores ficticios: 0 fugas en 11 formas de URL ni en routeEvent con mensaje de error que contiene ambos valores.
4. safeCode solo devuelve códigos fijos. phase es informativo: la política de fallo (run.mjs:225) no cambia y un fallo en teardown sigue haciendo fallar la corrida. --cart sigue exigiendo carrito inicial vacío (run.mjs:877) y limpieza verificada (run.mjs:1062-1083).
5. sha256sum run.mjs = 6a35997506cdb15c361eb066d0975e5c0675cc475a73309d62e9dc5d699fccc0 = run-b02.mjs:29. loadD28Policy calcula el hash y construye el módulo sobre el mismo buffer, sin TOCTOU sobre run.mjs. B-02 sigue anclado a la tienda antigua (run-b02.mjs:32). Tests: selftest 47/47, conditions 49/49, local 31/31.
Archivos tocados: solo este informe (nuevo). Sin commit ni push. No se editó código.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No usé mcp__Shopify__* ni comandos de Shopify y no hice peticiones a ninguna tienda. No abrí .secrets. Los tests corrieron con `env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN` y servidores locales 127.0.0.1. Para conditions-test y local-test pasé PLAYWRIGHT_MODULE=/home/user/Tema-Shopify/node_modules/playwright/index.mjs: la primera ejecución sin esa variable falló con ERR_MODULE_NOT_FOUND, porque el harness B-02 no tiene node_modules propio.
Hallazgos extra fuera de alcance (con parche listo): C1 con parche en §4. P2-1 y P3-1 a P3-4 sin parche obligatorio.
Verificación (comando, resultado y qué demuestra/qué no): §6. Demuestra la lógica en local con valores sintéticos. NO demuestra el comportamiento en la tienda real, ni que Shopify.theme.role valga 'unpublished' en la preview real de la tienda nueva (no verificado).
Lista de afirmaciones falsables numeradas: §7.
```

## 1. Lista cerrada de tiendas y stores.json

| Punto | Evidencia | Estado |
| :--- | :--- | :--- |
| Lista cerrada exacta | `KNOWN_STORES` congelado con los dos dominios (run.mjs:16). `resolveTarget` exige un único `--store=` (run.mjs:23-24) y `KNOWN_STORES.includes(host)` (run.mjs:26), es decir, igualdad estricta de cadena. La prueba adversarial rechaza `OLD/`, `OLD.`, mayúsculas, `https://OLD`, espacio inicial, prefijo y sufijo (selftest.mjs:80 y adv.mjs) | código completo |
| Entorno o URL no aportan dominio | `TARGET` solo se calcula a partir de `args` (run.mjs:46), sin leer `process.env`. selftest.mjs:82-85 define STORE, SHOPIFY_FLAG_STORE y STOREFRONT_ORIGIN y sigue dando STORE_FLAG_REQUIRED | código completo |
| stores.json no añade tiendas | El número de claves debe ser 2 y deben estar las dos conocidas (run.mjs:33). `schema === 1` y no se admiten claves extra en la raíz (run.mjs:32), en cada tienda ni en cada tema (run.mjs:38, 40) | código completo |
| Hosts derivados | `ORIGIN = TARGET.origin` (run.mjs:48). `READ_HOSTS` (run.mjs:56) e `INVENTORY_HOSTS` (run.mjs:65) contienen solo `TARGET.host` como host de tienda. Todas las comparaciones de tienda usan `ORIGIN`: run.mjs:117, 143, 162, 251, 262, 282, 316, 424, 456-477, 520, 538, 562, 779, 900. El axe de iframes recibe `storeOrigin: ORIGIN` (run.mjs:728) | código completo |
| Sin literales residuales | `grep -n "qkqpke0j\|kvkzl39t\|1902\|myshopify" run.mjs` → solo run.mjs:16 (KNOWN_STORES) y run.mjs:101 (`historicalIncidents`, que es dato del informe y solo se emite si `TARGET.host === LEGACY_STORE`). El regex de IDs de tema fijos de la versión anterior pasa a `AUTHORIZED_THEME_IDS` (run.mjs:514) | código completo |
| Sin tienda | Con `TARGET.error` no nulo: `ORIGIN === null`, `READ_HOSTS` vacío y todo GET a la tienda bloqueado (selftest.mjs:79, 112). main() se para en run.mjs:1016, antes de importar Playwright (run.mjs:1021) | código completo |
| Prototype pollution | JSON.parse crea `__proto__` como propiedad propia. Una tienda `__proto__` sube el recuento a 3 → STORES_FILE_INVALID. `__proto__` en un tema → clave extra → STORES_FILE_INVALID. `({}).x` sigue undefined (adv.mjs). `Object.hasOwn` (run.mjs:33) evita resolver por la cadena de prototipos | código completo |
| IDs repetidos | `seen` es global a las dos tiendas (run.mjs:35, 40-41) → rechazo (selftest.mjs:96). Presets repetidos con IDs distintos se aceptan, sin impacto de seguridad | código completo |
| Claves JSON duplicadas | JSON.parse se queda con la última aparición sin avisar. Una entrada de tienda duplicada puede esconder IDs: `{NEW:[], OLD:[], NEW:[{id:190299111728}]}` → se autoriza 190299111728 (adv.mjs `dupKeyLastWins2`). Afecta a la revisión humana del diff, no a la lista de dominios (P3-1) | no verificado en revisión de diffs |
| Ruta y symlink | `STORES_FILE = resolve(HERE, 'stores.json')` (run.mjs:18): es relativa al script, no al cwd, y no la cambia ningún flag. readFileSync sigue symlinks, pero el contenido pasa la misma validación, así que un symlink solo puede alterar IDs de las dos tiendas conocidas, nunca dominios. Un error de lectura → STORES_FILE_INVALID sin lanzar (selftest.mjs:106) | código completo |

## 2. IDs de tema y tema MAIN

- `AUTHORIZED_THEME_IDS` sale solo de los temas de la tienda elegida (run.mjs:43, 49-50). Los IDs de la tienda antigua no se autorizan en la nueva (selftest.mjs:88, 116-117). `isThemeAsset` usa ese set (run.mjs:514).
- `--theme` duplicado → THEME_FLAG_DUPLICATED (run.mjs:1017). Si falta, se seleccionan todas las previews de la tienda. Con la tienda nueva vacía, `selected.length === 0` → THEME_NOT_ALLOWED (run.mjs:1018). Arrastrado de antes: `--theme=` vacío selecciona todas (run.mjs:77-78, adv.mjs `emptyThemeSelects: 3`) (P3-2).
- Preflight externo: sigue documentado y obligatorio (README:11-20). Sigue siendo externo y humano.
- Navegador: `verifyPreview` exige `String(Shopify.theme.id) === session.themeId` y que ese ID esté en AUTHORIZED_THEME_IDS (run.mjs:255-259). También se ejecuta antes de cada POST de carrito (run.mjs:546-548).
- **Tema MAIN (C1): ausente en run.mjs.** Si se añade `{preset:'test-data', id:'190299111728'}` a la tienda nueva en stores.json, `resolveTarget` lo acepta (adv.mjs `mainIdAccepted`). `?preview_theme_id=<id MAIN>` sirve el tema publicado con `Shopify.theme.id` igual, así que verifyPreview pasa y --cart podría mutar el carrito sobre el tema live. Hoy no es explotable, porque la lista de la tienda nueva está vacía y el ID tendría que entrar en un commit revisado. Aun así, el harness no lo impide por sí mismo, y run-b02.mjs:180 ya aplica la comprobación equivalente (`PREVIEW_ROLE_NOT_UNPUBLISHED`, cubierta por conditions-test C3).

## 3. Guardián de redacción

- `ALWAYS_GUARDED_NAMES` (run.mjs:364) se evalúa antes de la exclusión por nombre y del umbral (run.mjs:370-374). Una STOREFRONT_PASSWORD de 6 caracteres y un token de 3 se redactan (selftest.mjs:53-56).
- `PWD`/`OLDPWD`: `/^(?:OLD)?PWD$/i` es un nombre exacto, sin distinguir mayúsculas (run.mjs:371). La regex de nombres conserva `pwd` (run.mjs:372), así que `MY_PWD_SECRET` largo sigue protegido. Es más conservador que el parche de REVIEW-RB-CART-001 §5.1, y es correcto.
- Umbral ≥8 para el resto (run.mjs:365, 373), con selftest en 7 y en 8 (selftest.mjs:60-61). Un valor >16384 deja el guardián en `unavailable` y cierra en fallo (run.mjs:374, selftest.mjs:63-64).
- Prueba de fugas con valores ficticios (`PW='Zq7fakePw'`, `TK='shptka_FAKE0000tok'`, OLDPWD='/'): 0 apariciones en 11 variantes. Las variantes son: path en claro, path codificado 1 y 2 veces, query, fragment, host, mayúsculas, userinfo, NFKD y ancho completo. Query y fragment nunca se emiten (safeWarningSource solo emite hostname y pathname, run.mjs:386-401). Un `routeEvent` con `page.url()` y un mensaje de error que contienen PW y TK serializa `code: NETWORK_ERROR`, `pathname: null` y `SECRET_MATCH`, sin el mensaje. `pageKind` es una categoría fija.
- Otras superficies: el nombre del archivo solo usa `mode` fijo, la fecha y un UUID (run.mjs:80). Por consola solo salen el basename y códigos (run.mjs:966, 1111). `target.host` sale de KNOWN_STORES y `themeIds` de stores.json validado. No se registran headers.
- Arrastrado de antes y no introducido por el parche (P3-3): un secreto partido entre host y path (`zq7f.com` + `/akePw`) no se detecta, porque cada campo se compara por separado (run.mjs:391-394). Es un riesgo teórico muy bajo: exigiría que una petición del navegador construyera ese host.
- P3-4: nada liga las credenciales a la tienda. Con `--store=nueva` y la contraseña de la antigua, esa contraseña se envía por POST /password a la otra tienda. Las dos tiendas son del mismo dueño y el README:20 lo advierte. No bloquea.

## 4. safeCode, phase y teardown; cambio C1

- safeCode (run.mjs:190-206): las nuevas ramas devuelven solo `TARGET_CLOSED`, `NETWORK_EPIPE` o `NETWORK_ERROR`. El mensaje solo se usa en `.test()` y nunca se serializa (selftest.mjs:69-76). CheckError sigue teniendo prioridad (run.mjs:191), así que los errores del protocolo 429 no se reclasifican.
- `phase` (run.mjs:504) depende de `teardownStarted`, que se pone a true al principio del finally de la sesión (run.mjs:1059). El resultado final sigue calculándose en run.mjs:225 con `checks.failed || routeOperationFailed`, sin mirar phase. Un evento en teardown sigue marcando `routeOperationFailed` (saveReport, run.mjs:214-216) → failed. **La política no se ha relajado.**
- Parche mínimo C1 (run.mjs:257-258). Lee el rol en el mismo `evaluate` y exige `unpublished`, igual que run-b02.mjs:180:
  ```js
  const identity = await page.evaluate(() => ({ id: typeof window.Shopify?.theme?.id !== 'undefined' ? String(window.Shopify.theme.id) : null, role: typeof window.Shopify?.theme?.role === 'string' ? window.Shopify.theme.role : null }));
  requireThat(identity.id === session.themeId && AUTHORIZED_THEME_IDS.has(session.themeId), 'PREVIEW_ID_NOT_VERIFIED');
  requireThat(identity.role === 'unpublished', 'PREVIEW_ROLE_NOT_UNPUBLISHED');
  ```
  Además: un caso en selftest.mjs, recalcular `D28_RUNNER_SHA256` (run-b02.mjs:29), registrar el SHA final en D32 y volver a pasar las tres suites. Opcional, como defensa en profundidad: un `DENIED_THEME_IDS = ['190299111728']` en resolveTarget → STORES_FILE_INVALID. No lo exijo, porque el rol cubre cualquier tema publicado futuro sin depender de un literal. Que `Shopify.theme.role` valga `unpublished` en la preview real: **no verificado** (B-02 ya depende de ello).

## 5. run-b02.mjs y pin

- `sha256sum run.mjs` = `6a35997506cdb15c361eb066d0975e5c0675cc475a73309d62e9dc5d699fccc0`, igual que run-b02.mjs:29. loadD28Policy lee `source` una vez, calcula el hash (run-b02.mjs:97) y construye el módulo con ese mismo `source` (run-b02.mjs:98-103), así que no hay TOCTOU sobre run.mjs. La prueba de manipulación sigue en conditions-test (línea 121, `D28_SOURCE_DIGEST_NOT_EXPECTED`) y pasa.
- process.argv (run-b02.mjs:112-118): se sustituye por `[node, script, --store=D28_STORE]` y se restaura en `finally`. run.mjs lee `args` de forma síncrona al evaluarse (run.mjs:17, 46) y `import()` no resuelve hasta terminar la evaluación, así que el valor se lee dentro de la ventana. `store` es un único elemento de argv: no puede inyectar `--cart` ni otro flag (un valor que no sea igual a un dominio da STORE_NOT_ALLOWED). Ningún llamador pasa `store` (run-b02.mjs:288, conditions-test.mjs:106, 264), y parseArgs no lo admite como argumento CLI (run-b02.mjs:45-51). **B-02 no puede tocar la tienda nueva por accidente**: su ORIGIN y sus READ_HOSTS son los de la antigua.
- **P2-1 (opcional):** stores.json se copia sin pin (run-b02.mjs:110), así que el `AUTHORIZED_THEME_IDS` que valida el fixture de B-02 ya no queda cubierto por `D28_RUNNER_SHA256`. Antes los IDs estaban dentro de run.mjs. El rol `unpublished` de run-b02.mjs:180 lo mitiga, y el README de RA-RB lo declara («stores.json is not part of that pin»). Si se quiere mantener la garantía anterior, añadir `D28_STORES_SHA256` y comprobarlo sobre el buffer leído antes de escribir la copia.

## 6. Verificación (comandos y salida)

```text
$ git status -sb   (alcance)
 M agent-comms/outbox-claude/harness-B-02-STORE-001/README.md
 M agent-comms/outbox-claude/harness-B-02-STORE-001/run-b02.mjs
 M agent-comms/outbox-gpt/harness-GPT-RA-RB-001/README.md
 M agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs
?? agent-comms/outbox-gpt/harness-GPT-RA-RB-001/selftest.mjs
?? agent-comms/outbox-gpt/harness-GPT-RA-RB-001/stores.json
$ sha256sum agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs
6a35997506cdb15c361eb066d0975e5c0675cc475a73309d62e9dc5d699fccc0
$ node --check run.mjs / selftest.mjs / run-b02.mjs  → OK x3 ; JSON.parse(stores.json) → ok
$ git diff --check -- (los dos directorios) → exit 0
$ env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN node selftest.mjs
RESUMEN 47/47 comprobaciones correctas   (exit 0)
$ PLAYWRIGHT_MODULE=…/node_modules/playwright/index.mjs node conditions-test.mjs
PASS C3 identidad sin JS: tema incorrecto o publicado no se envia :: {"a":["PREVIEW_ID_NOT_VERIFIED"],"b":["PREVIEW_ROLE_NOT_UNPUBLISHED"]}
RESUMEN 49/49 comprobaciones correctas; POST recibidos por el servidor: 0   (exit 0)
$ PLAYWRIGHT_MODULE=… node local-test.mjs
RESUMEN 31/31 comprobaciones del arnes correctas   (exit 0)
$ node adv.mjs   (scratchpad, copia de run.mjs sin main(), valores ficticios)
dupKeyLastWins2: ["190299111728"] ; protoKey/protoTheme: STORES_FILE_INVALID ; polluted: undefined
mainIdAccepted: { error: null, themes: [{ preset: "test-data", id: "190299111728" }] }
emptyThemeSelects: 3 ; storeTrailing/storeDotted: STORE_NOT_ALLOWED ; leaks: [] ; routeEventLeak: false
```

Ninguno de estos comandos hizo peticiones a una tienda. No cierran ninguna fila del ledger.

## 7. Documentación

- README de RA-RB: coherente con el código en la lista cerrada, los errores (`STORE_FLAG_REQUIRED/DUPLICATED`, `STORE_NOT_ALLOWED`, `STORES_FILE_INVALID`), los hosts derivados, el guardián (PWD/OLDPWD, ≥8, siempre las dos credenciales), `TARGET_CLOSED`/`NETWORK_ERROR`, `phase` sin cambio de política, el selftest y el pin. Si se aplica C1, añadir el rol `unpublished` a README:20 («requires `Shopify.theme.id` to match…»).
- README de B-02: coherente con run-b02.mjs:95-118 y con el anclaje `D28_STORE`.
- docs/decisions.md D32 sigue diciendo «SHA a registrar tras el parche en curso». Hay que registrar el SHA final en el mismo commit (6a359975…fccc0, o el nuevo si se aplica C1).

## Hallazgos

| ID | Sev. | Archivo:línea | Hallazgo |
| :--- | :--- | :--- | :--- |
| C1 | P1 (condición de commit) | run.mjs:255-259 | verifyPreview no exige `Shopify.theme.role === 'unpublished'`. Un ID MAIN en stores.json (p. ej. 190299111728) se admitiría y --cart podría operar sobre el tema live. run-b02.mjs:180 ya lo exige |
| P2-1 | P2 | run-b02.mjs:110 | stores.json no está fijado por SHA, así que el `AUTHORIZED_THEME_IDS` de B-02 queda fuera del pin. Mitigado por el rol en run-b02.mjs:180 |
| P3-1 | P3 | run.mjs:29 | Las claves JSON duplicadas se resuelven a la última aparición sin avisar y pueden ocultar un ID en la revisión del diff |
| P3-2 | P3 | run.mjs:77-78 | `--theme=` vacío selecciona todas las previews. Viene de antes del parche |
| P3-3 | P3 | run.mjs:391-394 | Un secreto partido entre host y path no se detecta. Viene de antes y el riesgo es teórico |
| P3-4 | P3 | run.mjs:1019-1020 | Las credenciales no están ligadas a `--store`: la contraseña de una tienda puede enviarse a la otra |

## Veredicto

**COMMITEAR CON CAMBIOS.** Lista mínima exacta:
1. Aplicar C1 en run.mjs:257-258 (§4) y añadir el caso al selftest.
2. Recalcular `D28_RUNNER_SHA256` en run-b02.mjs:29 con `sha256sum`.
3. Registrar el SHA final en D32 de docs/decisions.md.
4. Volver a pasar selftest (48/48 o los casos que haya), conditions-test 49/49 y local-test 31/31.

P2-1 y los P3 no bloquean.

## 8. Afirmaciones falsables

1. `sha256sum run.mjs` devuelve `6a35997506cdb15c361eb066d0975e5c0675cc475a73309d62e9dc5d699fccc0`, que es el literal de run-b02.mjs:29.
2. `grep -n "qkqpke0j\|kvkzl39t" run.mjs` solo devuelve run.mjs:16 y run.mjs:101.
3. run.mjs no lee `process.env` para calcular TARGET, ORIGIN, READ_HOSTS ni INVENTORY_HOSTS (run.mjs:46-65).
4. Un stores.json con una tienda `__proto__` o con una tercera tienda da STORES_FILE_INVALID.
5. Un stores.json con la tienda nueva duplicada y el ID en la segunda aparición autoriza ese ID.
6. Con 190299111728 en la lista de la tienda nueva, resolveTarget devuelve `error: null`. run.mjs:255-259 no consulta `Shopify.theme.role`.
7. run-b02.mjs:180 exige `theme.role === 'unpublished'`.
8. Con STOREFRONT_PASSWORD de 6 caracteres y OLDPWD="/", el path `/v1/produce_batch` no se redacta y `/x/abcdef/y` sí (selftest.mjs:50-53).
9. run.mjs:225 no hace referencia a `phase`, y un routeFailureEvent en teardown deja `routeOperationFailed=true`.
10. selftest 47/47, conditions-test 49/49 y local-test 31/31, todos con exit 0 y sin variables de credencial.
11. loadD28Policy construye el módulo a partir del mismo `source` cuyo SHA comprueba (run-b02.mjs:96-103).
