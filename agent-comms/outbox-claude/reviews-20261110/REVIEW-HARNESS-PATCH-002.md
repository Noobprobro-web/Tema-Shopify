```text
ID: REVIEW-HARNESS-PATCH-002
Estado: COMMITEAR. C1 está cerrado. Los cambios de REVIEW-HARNESS-PATCH-001 (comprobar el rol y su test, recalcular el pin, registrar el SHA en D32 y P3-1) están aplicados y se verificaron en local. P3-1 queda cerrado solo en parte: hay un bypass por escape unicode y por claves duplicadas anidadas. No bloquea, porque el rol es la defensa real.
Decisión requerida: Gemini/Johandry. Autorizar el commit. Opcional: el endurecimiento P3-5 en un parche posterior (cambia el SHA otra vez).
Resumen en 5 líneas:
1. verifyPreview (run.mjs:264-271) exige primero el ID y luego `Shopify.theme.role === 'unpublished'`, con el error fijo PREVIEW_ROLE_NOT_UNPUBLISHED. Se llama en goto, authenticate, inventory, cartSuite y en el router antes de cada POST de carrito del navegador (run.mjs:557-559). Así cubre todos los modos.
2. El selftest ejecuta el verifyPreview real (el módulo sale de run.mjs sin main()). Si se mete 190299111728 en un stores.json sintético, el ID pasa la lista pero el rol `main` lo bloquea (selftest.mjs:168-173).
3. Rutas por tienda: las regex son estrictas y anclan (JS `$` sin m). Probé 13 rutas hostiles (//host, \, %2f, \n, \r, U+2028, .., #, ?, mayúsculas, cirílico, vacío, subruta) y todas dan STORES_FILE_INVALID. ROUTES se deriva de TARGET.routes, y la tienda antigua conserva sus rutas.
4. stores.json tiene exactamente 190300356912, 190300455216 y 190300422448 en la nueva y los 3 IDs previos en la antigua, sin 190299111728, 190299046192 ni 190299078960. Un tercer dominio sigue rechazado. El pin 5c03c139…a2bc1 coincide en sha256sum, run-b02.mjs:29 y D32, y B-02 sigue anclado a la tienda antigua.
5. Tests: selftest 83/83, conditions 49/49 (0 POST) y local 31/31. No hay JSON nuevo en results/ ni temporales.
Archivos tocados: solo este informe (nuevo). Sin commit ni push. No edité código.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No usé mcp__Shopify__* ni comandos de Shopify, no hice peticiones a tiendas y no abrí .secrets. Los tests corrieron con `env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN`. Las pruebas adversariales usaron una copia en el scratchpad, ya borrada.
Hallazgos extra fuera de alcance (con parche listo): P3-5 (parche opcional de 1 línea), P3-6 y P3-7 (redacción).
Verificación (comando, resultado y qué demuestra/qué no): §5. Demuestra la lógica en local con valores sintéticos. NO demuestra que `Shopify.theme.role` valga 'unpublished' en las previews reales de la tienda nueva (no verificado). Si valiera otra cosa, todos los modos fallarían cerrados.
Lista de afirmaciones falsables numeradas: §6.
```

## 1. C1: rol del tema

| Punto | Evidencia | Estado |
| :--- | :--- | :--- |
| Orden y error fijo | run.mjs:266 lee id y rol en un único `evaluate`. :267 compara el ID con PREVIEW_ID_NOT_VERIFIED y :269 exige `role === 'unpublished'` con PREVIEW_ROLE_NOT_UNPUBLISHED. `requireThat` lanza un código fijo y no serializa ningún mensaje de la página | código completo |
| Todos los modos | `goto` → verifyPreview (run.mjs:277), así que cubre read-only, inventory y cart. También inventory_home_load (:860), cartSuite antes de autorizar (:886) y antes del add (:908), la nota (:935) y la página /cart (:801) | código completo |
| Antes de cada POST de carrito | El router lo llama con `pathClass === 'cart_post'` (run.mjs:557-559) para cualquier POST del navegador. El POST de la nota pasa por la API y va precedido de :935. Los POST de limpieza (`cleanupCart`) no lo repiten. Dependen de `cartAuthorization`, que solo se activa tras verifyPreview con el rol (:886-889). Es correcto: no conviene bloquear la limpieza (ver P3-7) | código completo |
| Tests sobre el código real | selftest.mjs:15-20 importa run.mjs cortado antes de `main()` y exporta su `verifyPreview`. No es una copia de la función | código completo |
| MAIN en stores.json | selftest.mjs:168-173: 190299111728 queda autorizado por ID y el rol `main` lo rechaza. Prueba propia: `mainId` con rol `unpublished` pero sesión de otro tema → PREVIEW_ID_NOT_VERIFIED | código completo |
| Intentos de bypass | Sin `window.Shopify` → PREVIEW_ID_NOT_VERIFIED. `'UNPUBLISHED'`, `' unpublished'`, objeto con toString y `new String(...)` → PREVIEW_ROLE_NOT_UNPUBLISHED, porque exige `typeof === 'string'` e igualdad estricta. Origen ajeno → NAVIGATION_ORIGIN_NOT_ALLOWED. `preview_theme_id` distinto → PREVIEW_QUERY_NOT_ALLOWED. El id y el rol salen de la misma instantánea, así que no se puede leer el ID de un documento y el rol de otro | código completo |
| Límite residual | Los getters los ejecuta la página: el código de la propia tienda o tema podría falsear `Shopify.theme`. Ya pasaba con el ID y está fuera del modelo de amenaza (el contenido lo escribe Shopify en `content_for_header`). El preflight externo `shopify theme list --role unpublished` sigue siendo obligatorio (README:14-20) | no verificado en tienda real |

## 2. Rutas por tienda

- run.mjs:45: `routes` es obligatorio, exactamente con 2 claves, ambas de tipo string, con `^\/collections\/[a-z0-9-]+$` y `^\/products\/[a-z0-9-]+$`. Las claves extra de la tienda (:43) y de cada tema (:48) se rechazan.
- 13 rutas hostiles → STORES_FILE_INVALID (§5). En JS, `$` sin `m` no acepta un `\n` final y la clase de caracteres excluye `%`, `\`, `/`, `.`, `?` y `#`. No hay forma de salir del origen: `goto` concatena `${ORIGIN}${ROUTES[route]}` (run.mjs:273).
- `ROUTES` (run.mjs:60) solo usa `TARGET.routes`. Con `--store=nueva` queda `/collections/permanent-collection` y `/products/serra-coat`. Con la antigua sigue `the-permanent-collection` y `wool-waistcoat`. Ya no queda ningún literal de ruta en run.mjs.

## 3. Claves duplicadas y tercer dominio

- Tercer dominio: como clave de stores.json → STORES_FILE_INVALID. Con `--store=` → STORE_NOT_ALLOWED.
- STORES_FILE_DUPLICATE_KEY (run.mjs:30) cuenta `"<dominio>"\s*:` en el texto bruto y es independiente del orden. **Bypass (P3-5):** (a) si la clave duplicada se escribe con escape (`"sartorial-theme-kvkzl39t.myshopify.com"`) y va al final, el regex no la ve, JSON.parse la decodifica y se queda con ella. Resultado: `null`, con 4 IDs que incluyen 190299111728. (b) Las claves duplicadas anidadas no se comprueban: `{"preset":"archive","id":"190300422448","id":"190299111728"}` autoriza 190299111728 sin error, y lo mismo pasa con `themes` o `stores` duplicados. Esto solo afecta a la revisión humana del diff, porque el rol (§1) sigue bloqueando cualquier tema publicado. El README:10 limita bien la afirmación («a store key that appears twice in the text»).
- Parche opcional mínimo para (a), y para (b) en la práctica: ningún valor legítimo puede contener `\` (todos están limitados por regex), así que basta con rechazar cualquier barra invertida en el texto:
  ```js
  if (typeof text === 'string' && text.includes('\\')) return refused('STORES_FILE_INVALID');
  ```
  (b) necesita además un escáner de claves por objeto o un recuento por clave, que no exijo. Cualquiera de los dos cambia el SHA: habría que volver a fijar run-b02.mjs:29 y D32.

## 4. stores.json, pin y B-02

- Tienda nueva: `190300356912` sartorial, `190300455216` imprint y `190300422448` archive. Tienda antigua: `190232297715`, `190232330483` y `190232363251`, sin cambios. `grep` no encuentra 190299111728, 190299046192 ni 190299078960 en stores.json (también lo comprueba selftest.mjs:97).
- `sha256sum run.mjs` = `5c03c13957dfd0fef8fd241f89f44d8b471da20819162e10438ed55d578a2bc1`, que coincide con run-b02.mjs:29 y con D32 (docs/decisions.md:371).
- B-02: `D28_STORE = 'tema-qkqpke0j.myshopify.com'` (run-b02.mjs:32). Durante la importación, argv solo lleva `--store=D28_STORE`. stores.json se copia junto al módulo temporal (P2-1 de la revisión 001 sigue abierto, opcional). conditions C3 confirma que el rol bloquea en B-02: `b: PREVIEW_ROLE_NOT_UNPUBLISHED`.

## 5. Verificación

```text
$ sha256sum agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs
5c03c13957dfd0fef8fd241f89f44d8b471da20819162e10438ed55d578a2bc1
$ node --check run.mjs selftest.mjs run-b02.mjs conditions-test.mjs local-test.mjs → OK x5 ; JSON.parse(stores.json) → ok
$ git diff --check -- (dos directorios del harness) → exit 0
$ env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN node selftest.mjs
RESUMEN 83/83 comprobaciones correctas   (exit 0)
$ PLAYWRIGHT_MODULE=/home/user/Tema-Shopify/node_modules/playwright/index.mjs node conditions-test.mjs
PASS C3 identidad sin JS: tema incorrecto o publicado no se envia :: {"a":["PREVIEW_ID_NOT_VERIFIED"],"b":["PREVIEW_ROLE_NOT_UNPUBLISHED"]}
RESUMEN 49/49 comprobaciones correctas; POST recibidos por el servidor: 0   (exit 0)
$ PLAYWRIGHT_MODULE=… node local-test.mjs
RESUMEN 31/31 comprobaciones del arnes correctas   (exit 0)
$ node t.mjs / t2.mjs   (scratchpad, run.mjs sin main(), valores sintéticos; borrado)
routes hostiles x13 → STORES_FILE_INVALID ; thirdKey → STORES_FILE_INVALID ; thirdFlag → STORE_NOT_ALLOWED
vp: noShopify → PREVIEW_ID_NOT_VERIFIED ; upper/roleObj/roleStringObj → PREVIEW_ROLE_NOT_UNPUBLISHED ; ok → OK
dupEscaped(last) → null, ids [...,"190299111728"] ; dupIdField → null, ids [...,"190299111728"]   (P3-5)
$ git status --short --ignored -- results/ y harness-B-02 → sin entradas nuevas ; results/: 25 archivos = 25 en git ; /tmp/ra-rb-selftest-* → ninguno
```

Ninguno de estos comandos hizo peticiones a una tienda. No cierran ninguna fila del ledger.

## 6. Afirmaciones falsables

1. Con un `Shopify.theme.role` distinto de la cadena exacta `unpublished`, verifyPreview lanza PREVIEW_ROLE_NOT_UNPUBLISHED y deja `previewVerified=false`.
2. Ningún POST de carrito del navegador sale sin pasar por verifyPreview (run.mjs:557-559).
3. Ninguna ruta de stores.json que pase la validación puede contener `/` extra, `%`, `\`, `?`, `#` ni salto de línea.
4. Con `--store=nueva`, ROUTES y AUTHORIZED_THEME_IDS no contienen ningún valor de la tienda antigua.
5. Un `\u` dentro de una clave de stores.json evita STORES_FILE_DUPLICATE_KEY (P3-5).

## Hallazgos

| ID | Sev. | Archivo:línea | Hallazgo |
| :--- | :--- | :--- | :--- |
| P3-5 | P3 | run.mjs:30 | Detección de duplicados parcial: no detecta claves con escape unicode ni duplicados anidados (`id`, `themes`, `stores`). Solo afecta a la revisión del diff, porque el rol lo bloquea. Parche opcional en §3 |
| P3-6 | P3 | docs/decisions.md:371 | D32 cierra con «ese valor queda sustituido por el del parche en curso». El SHA final ya está registrado. Cambio cosmético: «…por el SHA final indicado arriba» |
| P3-7 | P3 | README.md:20 | Dice «before every cart POST». Los POST de limpieza (`cleanupCart`) no repiten verifyPreview: dependen de `cartAuthorization`, ya verificado con el rol. Conviene precisarlo en el texto, no cambiar el código |
| P2-1 | P2 | run-b02.mjs:110 | Arrastrado de la revisión 001 y sigue opcional: stores.json no está bajo el pin de B-02 |

## Veredicto

**COMMITEAR.** C1 y los cambios obligatorios de la revisión 001 están aplicados y verificados. P3-5, P3-6, P3-7 y P2-1 son opcionales. Si se aplica P3-5, hay que recalcular run-b02.mjs:29 y D32 y volver a pasar las tres suites.
