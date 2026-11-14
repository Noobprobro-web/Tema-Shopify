```text
ID: REVIEW-HARNESS-PATCH-003
Estado: COMMITEAR CON CAMBIOS. La clasificación `isTeardownClosedReadFailure` es correcta y no se puede activar fuera del caso previsto. `releaseRoutes` (unrouteAll antes de close) hay que quitarlo: abre una ventana en la que las peticiones nuevas del navegador salen SIN pasar por la política (reproducido en local), y además no evita el TARGET_CLOSED.
Decisión requerida: Gemini/Johandry. Aplicar los cambios C1 a C3 (§4), recalcular el SHA y luego autorizar el commit. El SHA d8c56bcf…ab76 NO debe quedar como final.
Resumen en 5 líneas:
1. La degradación exige a la vez: teardownStarted === true, que no sea /cart/add.js, stage fetch|fulfill, método GET|HEAD, que no sea CheckError y safeCode === 'TARGET_CLOSED' (run.mjs:542-545). A stage fetch solo se llega después de `decision.allowed` (run.mjs:567-568, 583). teardownStarted solo se asigna en run.mjs:1085, que es la primera línea del finally por preview.
2. BLOQUEANTE: unrouteAll vacía los patrones de interceptación (playwright-core coreBundle.js:62551-62561). En la prueba sintética llegaron al servidor 6, 5 y 0 POST sin ruta en las 3 pruebas con unrouteAll, y 0, 0 y 0 sin él.
3. unrouteAll no evita el TARGET_CLOSED: el handler en vuelo sigue ejecutándose y su route.fulfill falla igual (1 aviso por prueba, con y sin unrouteAll). Lo que corrige el scopeResult es solo la clasificación.
4. Timeouts: con 'ignoreErrors', unrouteAll NO espera a los handlers (stop() solo pone una bandera, coreBundle.js:60168-60170). La premisa de «hasta 15 s» es falsa. Queda una llamada al protocolo con kNoTimeout (medida en 2-8 ms), con el mismo riesgo de bloqueo que context.close().
5. Tests: node --check OK en los 5 archivos; selftest 95/95, conditions 49/49 (0 POST) y local 31/31; sin JSON nuevo en results/. El pin d8c56bcf…ab76 coincide en sha256sum, run-b02.mjs:29 y D32. B-02 sigue anclado a tema-qkqpke0j (run-b02.mjs:32).
Archivos tocados: solo este informe (nuevo). Sin commit ni push. No edité código.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No usé mcp__Shopify__* ni comandos de Shopify y no abrí .secrets. La prueba de bypass usó un servidor HTTP en 127.0.0.1 y un script propio en el scratchpad. La primera tanda de tests corrió con STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN presentes en el entorno: no imprimí sus valores y los tests no salen a la red de la tienda. La repetí con `env -u` y los resultados son idénticos.
Hallazgos extra fuera de alcance: P3-8 (§5).
Verificación: §3.
Lista de afirmaciones falsables numeradas: §6.
```

## 1. Clasificación como aviso (punto 1)

- Condición: run.mjs:542-545. Se evalúa en el `catch` del router (run.mjs:623). Los avisos van a `routeWarningEvents`, no a `routeFailureEvents`, y no ponen `routeOperationFailed` (run.mjs:623-629).
- **Host no permitido:** sale en `policy_abort` con `return` antes de cualquier `fetch` (run.mjs:568). Una redirección a un host no permitido lanza `PolicyBlocked` en `redirect_validation` (run.mjs:497 y 597-600), así que la stage nunca es fetch|fulfill. No se degrada.
- **POST o mutación:** quedan fuera por el método (solo GET|HEAD). `/cart/add.js` también queda fuera por `cartAddRequest` (redundante: ya es POST). El POST de carrito pasa por `preview_validation` (run.mjs:571), que también está excluida. Esto está cubierto por (d) y (d2).
- **Error de red real:** `safeCode` comprueba primero `net::ERR_*` y `error.code` (run.mjs:203-206), luego el `name` y después el mensaje (run.mjs:210-213). Un ECONNRESET, socket hang up, CHROMIUM_* o PLAYWRIGHT_TIMEOUT en teardown sigue fallando, como prueba (c). Un GET que falló durante el workflow se clasifica en el momento del catch con `teardownStarted=false`, así que falla (b). No hay un catch diferido: el error se clasifica en cuanto ocurre.
- **error.name falsificado o mensaje con 'TargetClosedError':** esos errores los crea Playwright en el proceso Node, y el contenido de la página no los controla. Un mensaje que contenga solo la palabra «TargetClosedError» no casa con la regex de run.mjs:212, porque exige la frase completa. Lo que queda es teórico: una URL incluida en el log de error con la frase literal «Request context disposed». Las URL llevan los espacios como %20, así que no es práctico. Además seguiría haciendo falta el teardown y un GET permitido. El riesgo no es nuevo de este parche (ver P3-8).
- **teardownStarted:** solo hay dos asignaciones, `false` al crear la sesión (run.mjs:1059) y `true` en run.mjs:1085, la primera línea del `finally` por preview. Es un campo por sesión (el router lo recibe por closure), así que la preview B no hereda el teardown de A. Matiz aceptable: en `--cart`, la fase teardown incluye `cleanupCart` y `holdForManualCleanup`. Un GET que reciba TARGET_CLOSED ahí sería aviso, pero la limpieza se verifica aparte con `cleanupVerified`.
- **Evento:** usa `routeEvent` (run.mjs:508-516) con stage, phase, código fijo, pageKind, método y `safeWarningSource` (host y ruta seguros). No incluye el mensaje. `reason: 'TEARDOWN_TARGET_CLOSED'` es una constante, y el tope es de 50 avisos más un contador de omitidos (run.mjs:535). Punto (4): OK.

## 2. `releaseRoutes` (puntos 2 y 3)

- Orden en `--cart`: cleanupCart → check → holdForManualCleanup si no está verificado (run.mjs:1087-1094) → `requireThat(cleanupVerified)` (run.mjs:1109) → `releaseRoutes` (1110) → `close` (1111). En la guarda final el orden es holdForManualCleanup → releaseRoutes → close (run.mjs:1121-1123). El orden es el que se esperaba.
- El problema: `_unrouteInternal` deja `_routes = []` y llama a `setNetworkInterceptionPatterns` con patrones vacíos (coreBundle.js:62551-62561). Desde ese momento hasta que `close()` termina, Chromium envía las peticiones nuevas directamente a la red. No pasan por `requestDecision`, y en las pruebas incluyeron POST con keepalive y sendBeacon en pagehide. En `--cart` el carrito ya se verificó, pero los scripts del tema o de Shopify (analítica, beacons de pagehide, actualizaciones del carrito con debounce) pueden emitir peticiones que la política bloquea. Eso rompe la invariante «ninguna petición sale sin política». La ventana es de milisegundos, pero se reprodujo.
- Beneficio: ninguno. Nuestro handler captura todos sus errores, así que `_ignoreException` no cambia nada, y el TARGET_CLOSED del fulfill en vuelo ocurre igual.
- Timeouts: con 'ignoreErrors' no hay espera por los handlers. La única espera es la llamada al protocolo con `kNoTimeout`, que se colgaría solo si el navegador se cuelga, igual que `context.close()`. No es un bloqueo nuevo.

## 3. Verificación

| Comando | Resultado |
|---|---|
| `node --check` en run.mjs, selftest.mjs, run-b02.mjs, conditions-test.mjs y local-test.mjs | OK los 5 |
| `env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN node selftest.mjs` | `RESUMEN 95/95 comprobaciones correctas` |
| `… PLAYWRIGHT_MODULE=… node conditions-test.mjs` | `RESUMEN 49/49 comprobaciones correctas; POST recibidos por el servidor: 0` |
| `… PLAYWRIGHT_MODULE=… node local-test.mjs` | `RESUMEN 31/31 comprobaciones del arnes correctas` |
| `sha256sum run.mjs` | `d8c56bcff17e7da3577dac0f3c96fccd8825da57c711952c5289c519824dab76`, igual que en run-b02.mjs:29 y D32 |
| `ls results` antes y después | 26 archivos en ambos. El único sin rastrear (`RA-RB-read-only-20261114T144907417Z-…json`) es de la corrida real y ya estaba antes |
| Prueba de bypass (servidor en 127.0.0.1, Chromium, 3+3 pruebas) | POST sin ruta que llegaron al servidor tras unrouteAll: 6, 5 y 0. Sin unrouteAll: 0, 0 y 0. 1 TARGET_CLOSED en el handler por prueba en los dos casos |

- Tests nuevos: el selftest carga el texto real de run.mjs, cortado en `main()` (selftest.mjs:15-21), y usa el `createRouter` real. Cubre (a) aviso en teardown, (b) fallo en workflow, (c) ECONNRESET, socket hang up, código Node ECONNRESET y error genérico en teardown, (d) POST /cart/clear.js y (d2) /cart/add.js, y (e) el wrapper. Huecos menores, que no bloquean: no prueba la stage `fulfill` ni TARGET_CLOSED en `request_setup` o `redirect_validation` durante el teardown (por código, ambos fallan). La prueba (e) solo comprueba la llamada con mocks y no detecta el bypass.
- No demuestra el comportamiento en la tienda real (no verificado).

## 4. Cambios exactos (C1 a C3)

- **C1 (run.mjs):** borrar `await releaseRoutes(context);` (run.mjs:1110) y `await releaseRoutes(session.context);` (run.mjs:1122). Borrar también la función `releaseRoutes` con su comentario (run.mjs:546-550). Si después se quiere evitar el ruido, la opción segura es una bandera `session.closing` que haga `route.abort()` de inmediato. No hace falta: la clasificación ya resuelve el scopeResult.
- **C2 (selftest.mjs y README.md):** quitar `releaseRoutes` del export y los dos checks (e) del selftest (el total pasa a 93/93). En el README, cambiar la frase «before each `context.close()` the runner calls `context.unrouteAll(...)` … after the verified cart cleanup» por: «routes stay installed until `context.close()`, so no request bypasses the policy during closure; in `--cart` mode the close happens only after the verified cart cleanup».
- **C3 (pin):** recalcular `sha256sum run.mjs` y actualizar run-b02.mjs:29 y D32. En D32 hay que quitar «y el cierre libera antes las rutas con `unrouteAll({ behavior: 'ignoreErrors' })`» y poner el nuevo SHA. Después, volver a correr selftest, conditions y local.

## 5. Hallazgo extra

- **P3-8 (no bloquea, ya existía):** el fallback por mensaje de `safeCode` (run.mjs:212) compara contra el texto completo del error de Playwright, que puede incluir URLs del log de llamadas. Endurecimiento opcional: exigir `error?.name === 'TargetClosedError'` en `isTeardownClosedReadFailure` en lugar de `safeCode(...) === 'TARGET_CLOSED'`. El test (a) usa ese `name`, así que seguiría pasando.

## 6. Afirmaciones falsables

1. `teardownStarted = true` aparece solo en run.mjs:1085 (`grep -n "teardownStarted = "`).
2. A stage `fetch` o `fulfill` solo se llega después de `decision.allowed` (run.mjs:568 → 583).
3. `RouteHandler.stop('ignoreErrors')` no espera (coreBundle.js:60168-60170, playwright-core 1.63.0).
4. Después de `unrouteAll`, los patrones de interceptación quedan vacíos (coreBundle.js:62551-62561).
5. En la prueba sintética, con unrouteAll llegaron POST sin política al servidor (6 y 5 en dos de 3 pruebas). Sin él, 0 en las 3.
6. selftest 95/95, conditions 49/49 (0 POST) y local 31/31, con las credenciales quitadas del entorno.
7. `sha256sum run.mjs` = d8c56bcf…ab76, igual que en run-b02.mjs:29 y D32. D28_STORE = tema-qkqpke0j.myshopify.com (run-b02.mjs:32).

## Reverificación (C1 a C3 aplicados)

Veredicto: **COMMITEAR.** Las mismas reglas que antes: solo local, sin Shopify, sin editar código, sin commit y sin imprimir credenciales.

1. `grep -rn "releaseRoutes\|unrouteAll"` en harness-GPT-RA-RB-001/ (sin results/) da 0 coincidencias, incluido el README. La frase documental de README.md:87 ya no nombra unrouteAll: «routes stay installed until `context.close()`». El orden en `--cart` es: teardownStarted (run.mjs:1080) → cleanupCart y holdForManualCleanup si no está verificado (1089) → `requireThat(cleanupVerified)` (1104) → `context.close()` (1105). En la guarda final es `holdForManualCleanup` (1115) → `session.context.close()` (1116).
2. Se conservan `isTeardownClosedReadFailure` (run.mjs:542) y el aviso `TEARDOWN_TARGET_CLOSED` (run.mjs:619). Los casos nuevos usan el `createRouter` real, exportado del texto de run.mjs: (f) da aviso en fulfill; (g) en request_setup y (h) en redirect_validation siguen fallando. El export ya no incluye `releaseRoutes`.
3. `sha256sum run.mjs` da `103c1551fc1d639e93a882900885ba9283d8c260d49c938543d6299ac1a4292f`, igual que en run-b02.mjs:29 y en D32 (docs/decisions.md:371). D32 no menciona unrouteAll, dice que `d8c56bcf…` quedó sustituido tras esta revisión y deja pendiente la confirmación de Johandry. D28_STORE sigue en tema-qkqpke0j.myshopify.com (run-b02.mjs:32).
4. Resultados con `env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN` y PLAYWRIGHT_MODULE local. `node --check` pasa en run.mjs, selftest.mjs y run-b02.mjs.

   | Prueba | Resultado |
   |---|---|
   | selftest | `RESUMEN 96/96` |
   | conditions | `RESUMEN 49/49; POST recibidos por el servidor: 0` |
   | local | `RESUMEN 31/31` |
   | results/ | 26 archivos antes y 26 después |
5. Prueba sintética de Chromium (127.0.0.1). Con la secuencia actual (ruta instalada hasta `close()`, sin unrouteAll), llegaron al servidor 0, 0 y 0 POST en 3 pruebas. El control con unrouteAll, repetido, dio 12, 0 y 10. El TARGET_CLOSED del handler en vuelo aparece en ambos casos, así que lo sigue absorbiendo la clasificación como aviso. Límite: la prueba reproduce la secuencia de cierre con un router sintético, no el router real de run.mjs, porque su política exige el origen de la tienda. Que run.mjs ya no llame a unrouteAll lo prueba el punto 1.
