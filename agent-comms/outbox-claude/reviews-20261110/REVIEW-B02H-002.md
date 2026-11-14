# REVIEW-B02H-002: re-revisión del arnés B-02 sin JS (commit 1bb6bd2)

Es una re-revisión independiente, en solo lectura, del commit `1bb6bd2` de `task/b02h`, hecha sobre las condiciones de REVIEW-B02H-001. Las rutas son relativas a `agent-comms/outbox-claude/harness-B-02-STORE-001/`. No modifiqué el worktree: `git status` estaba limpio antes y después de la revisión.

## Veredicto: ACEPTADO

Las tres condiciones quedan cerradas y lo comprobé por mi cuenta. Quedan observaciones menores que no bloquean.

## Condiciones

**C1 (no usar modo cart). Cerrada.**
- run-b02.mjs:43-44 rechaza `--cart`, `--read-only` e `--inventory`.
- La sesión fija `mode`, `cartWriteEnabled`, `cartAuthorization` y `cleanupInProgress` como propiedades no escribibles ni configurables (run-b02.mjs:113-118). Esas propiedades se vuelven a comprobar antes de las rutas y antes de cada caso (run-b02.mjs:120-125, :129, :232).
- Lo verifiqué con la política D28 real cargada desde run.mjs:
  - N1: `requestDecision` no permite ningún POST a `/cart/add.js`, `/cart/update.js`, `/cart/clear.js`, `/cart/change.js`, `/cart/add`, `/es/cart/add.js` ni `/cart`, ni en contexto browser ni en api.
  - N2: `requestViaPolicy` corta esas peticiones con `API_REQUEST_BLOCKED_BY_POLICY` antes de llegar a `fetch`, con 0 llamadas.
  - N3: el `createRouter` real aborta con `blockedbyclient` un POST de navegación del marco principal a `/cart/add.js`, sin `fetch` ni `fulfill`.
  - N4 y N5: no se puede reconfigurar la sesión, y una copia con propiedades escribibles se rechaza.

**C2 (falsos PASS). Cerrada.**
- `casePreconditionFailures` (capture.mjs:216-226) exige ids numéricos, que A sea distinta de B, que el id esperado sea B y que `productHasSellingPlans` sea booleano.
- `runNoJsVariantCase` exige que la página esté cargada en A (capture.mjs:242).
- El id enviado tiene que ser exactamente `[B]` (capture.mjs:130).
- `selling_plan` ya no filtra los valores vacíos y se compara con FormData (capture.mjs:94-103).
- Las propiedades `null` cuentan como `{}`, y una clave extra da FAIL (capture.mjs:108-115).
- El abort está en un `finally` (capture.mjs:180-187), lo que cierra el hallazgo m1 anterior.
- Mis casos W1, W2 y W3 de la primera revisión ahora dan FAIL. También dan FAIL los casos nuevos B8 a B15:
  - B8: hidden id habilitado.
  - B9: B deshabilitada.
  - B10: página cargada en B.
  - B11: `/es/cart/add.js`.
  - B12: cantidad 0.
  - B13: plan duplicado `[5,5]`.
  - B14: propiedad extra junto a la esperada.
  - B15: select oculto.

**C3 (integración en el runner). Cerrada.**
- run-b02.mjs:92-110 carga D28 sin cambios:
  - El SHA-256 coincide con el actual de run.mjs: `0f9369...cb84`.
  - Solo recorta la llamada final a `main()` (run.mjs:1050), y con ella el `saveReport` de D28, así que al importarlo no se escribe ningún informe. El directorio `results/` de D28 tenía 21 archivos antes y después.
  - En el código de nivel superior que queda no hay efectos con red ni con disco.
- El contexto se crea con `javaScriptEnabled: false` y una sonda lo comprueba en cada caso (run-b02.mjs:220, :244-245).
- El orden de rutas es fijo y está comprobado (run-b02.mjs:128-137).
- La página se recarga en cada caso (run-b02.mjs:241-243) y la identidad sin JS se verifica por id y rol `unpublished` (run-b02.mjs:157-170).
- El README:28-53 documenta el runner, el fixture y las precondiciones, incluido el selector nativo visible y el modo no cart.

## Secretos (run-b02.mjs)

- Las credenciales solo se leen del entorno, y si faltan el runner falla cerrado (run-b02.mjs:51-55, N10). Un argumento o una clave de fixture con nombre de credencial se rechaza (run-b02.mjs:45, :59-62, N6).
- La contraseña solo viaja en el POST `/password` de D28. Ahí D28 valida 302/303 y el destino, y apaga `authPostAllowed` antes del `fetch` (run.mjs:404-425).
- El informe se arma por lista blanca (run-b02.mjs:182-202) y pasa por el guardia de secretos de D28 (run-b02.mjs:204-215). N7 muestra que elimina el secreto exacto, en mayúsculas y anidado. N8 muestra que, sin guardia, todo queda en `null`.
- Por consola solo salen el nombre del archivo y códigos (run-b02.mjs:304, :309).
- La copia temporal de D28 solo contiene código fuente, se crea con modo 600 y se borra.

## Ejecución

- `node --check` pasa en los 4 `.mjs`.
- `local-test.mjs` da 31/31 y `conditions-test.mjs` da 49/49, los dos con exit 0.
- Mis negativos nuevos, `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/b02h-neg/neg-review-2.mjs`, dan 25/25 con 0 POST en el servidor. La salida está en `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/b02h-neg/salida-neg-2.txt`.

## Observaciones menores (no bloquean)

- **o1.** `report.result` (run-b02.mjs:265) no tiene en cuenta `totals.nonCaptureMutations`. Si hay una mutación durante `goto`, fuera de la ventana del caso, D28 la bloquea igual, pero el resultado no da FAIL. Conviene sumarla.
- **o2.** La ruta real `createRouter` en navegador con la sesión B-02 solo está probada de forma unitaria (N3), porque `ORIGIN` es HTTPS fijo. La primera ejecución en tienda conviene hacerla supervisada.
- **o3.** El preflight `shopify theme list --role unpublished` es manual (README:46). El runner solo comprueba el rol dentro de la página.
- **o4.** Si en el entorno hay secretos muy cortos, el guardia redacta de más. Eso falla del lado seguro.
