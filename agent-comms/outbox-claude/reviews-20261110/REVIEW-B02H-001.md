# REVIEW-B02H-001: arnés B-02 sin JS (commit 9e5cbbf)

Revisión independiente en solo lectura del commit `9e5cbbf53ffe84a4862f5565433331b5167df8a0` (rama `task/b02h`). Rutas relativas a `agent-comms/outbox-claude/harness-B-02-STORE-001/` salvo que se indique otra cosa. No se modificó el worktree (`git status` limpio antes y después).

## Veredicto: ACEPTADO CON CONDICIONES

El aborto es seguro y falla cerrado en todas las vías probadas, y la allowlist D28 no cambia. Antes de usarlo en tienda faltan tres cosas: precondiciones en `runNoJsVariantCase`, la integración real en el runner (hoy solo existe en el README) y algunas notas de fixtures.

## 1. Seguridad del aborto

Lo que está bien:
- El commit solo añade 4 archivos y no toca `outbox-gpt/harness-GPT-RA-RB-001/run.mjs`. `CART_POST_PATHS` sigue en run.mjs:26 y la regla de mutaciones en run.mjs:256-262.
- capture.mjs:33-42 solo captura una navegación de documento del marco principal con POST, mismo origen exacto, ruta `/cart/add` o `/<locale>/cart/add` y sin query ni hash. Todo lo demás pasa a `route.fallback()` (capture.mjs:136-144), así que D28 bloquea cualquier POST fuera de `CART_POST_PATHS`. El módulo no tiene `continue`, `fetch` ni `fulfill`.
- Redirección y 429: la petición capturada se aborta sin hacer ninguna petición, así que no hay salto ni reintento posible. `fetchWith429Retries` (run.mjs:127) y la regla `POST_REDIRECT_NOT_ALLOWED` (run.mjs:528) solo actúan sobre lo que D28 permite.
- Orden de registro: Playwright ejecuta antes la ruta registrada más tarde, y el README:18-22 indica instalarla justo después de `createRouter` (run.mjs:984). Si el orden se invierte o la captura no se instala, D28 aborta y el caso da `NO_NATIVE_CART_ADD_CAPTURED` sin enviar nada (R1 y R2).
- `requestfinished` (capture.mjs:125-130) detecta cualquier mutación que reciba respuesta, también una que D28 haya completado con `route.fulfill`.

Hallazgos:
- **C1 (condición).** En modo `--cart`, D28 sí permite un POST de navegación del marco principal a `/cart/add.js` (run.mjs:260, `context === 'api' || primaryFrame`). La captura lo deja pasar a D28 (capture.mjs:38 `AJAX_ENDPOINT`) y solo lo marca después como `UNEXPECTED_MUTATION_REQUEST`. Si una plantilla con `action` a `.js` se ejecutara en modo cart, mutaría el carrito. El runner de B-02 tiene que rechazar `mode === 'cart'` o `cartWriteEnabled` antes de instalar la captura, y el README tiene que decirlo.
- **m1.** El comentario de capture.mjs:146-147 dice que primero se aborta, pero el código espera a `headerValue` (capture.mjs:149) antes del `abort` (capture.mjs:150). Si `headerValue` lanza, el handler lanza sin resolver la ruta. R9 muestra que en ese caso la petición no llega al servidor, pero sí deja una promesa rechazada sin manejar. Recomiendo `try { ... } finally { await route.abort(...) }`.
- **m2.** Las capturas no pasan por `recordRequest` de D28 (run.mjs:289), así que el JSON de D28 no las muestra. El runner tiene que volcar `log.captures.length` y `CAPTURED_NOT_SENT` a su informe.

## 2. Validación (evaluateCase, capture.mjs:89-116)

Casos que sí detecta: varios ids (`PAYLOAD_ID_NOT_SINGLE`, negativo local y R6 con `form=` externo), id vacío (R5), un id que no coincide con lo esperado, con lo mostrado o con FormData (capture.mjs:96-99), opción deshabilitada (capture.mjs:100), `selling_plan` no esperado (R8) y un payload que no se puede parsear o `text/plain` (R7, capture.mjs:200-201).

Posibles falsos PASS, todos reproducidos:
- **C2 (condición), W3.** `runNoJsVariantCase` (capture.mjs:178-203) no comprueba que A estuviera cargada, que `variantB !== A` ni que `expected.variantId === variantB`. Con `variantB = A` da PASS sin que haya cambio de variante. Hoy esto solo se valida fuera, en local-test.mjs:145,149. Hay que moverlo dentro de la función.
- **m3, W1.** capture.mjs:103 filtra los `selling_plan` vacíos, así que `["5",""]` contra un esperado de 5 da PASS. Además, el plan no se contrasta con `FormData.getAll('selling_plan')`.
- **m4, W2.** Si `expected.properties` es null (capture.mjs:105), se aceptan propiedades inesperadas. Recomiendo exigir `{}` explícito o que no haya ninguna propiedad.

## 3. Allowlist y datos sensibles

La allowlist no se amplía (ver sección 1). La evidencia (capture.mjs:114) guarda solo ids, cantidad, plan, claves de propiedades y pathnames. No guarda cookies, cabeceras ni valores. `parseError` lleva códigos fijos de 60 caracteres como máximo. Un aviso (m5): `log.captures[].payload.properties` sí guarda los valores en memoria. El runner no debe serializar `log` entero, y el README debería advertirlo.

## 4. Ejecución

- `node --check` sale OK en capture.mjs, local-test.mjs y el script de negativos.
- local-test.mjs da 31/31 con exit 0, y la salida es idéntica a salida-local.txt quitando los puertos (`b02h-rerun.txt` en el scratchpad).
- Negativos propios en `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/b02h-neg/neg-review.mjs` dan 12/12, con salida en `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/b02h-neg/salida-neg.txt`. Hubo 0 POST en el servidor en todos:
  - R1: orden invertido.
  - R2: sin captura.
  - R3: `target` a iframe.
  - R4: `target=_blank` (popup).
  - R5: id vacío.
  - R6: id extra con `form=`.
  - R7: `text/plain`.
  - R8: `selling_plan` no esperado.
  - R9: un handler que lanza.
  - W1 a W3: las debilidades de la sección 2.
- Observación: después del aborto, la página queda en `chrome-error://chromewebdata/`, así que cada caso tiene que recargar la página y volver a verificar el preview.

## 5. README

- Lo que documenta: el orden de registro, el origen y las rutas por variables de entorno y la verificación local.
- **C3 (condición).** El runner no tiene modo B-02 ni `javaScriptEnabled: false` (run.mjs:44 y run.mjs:977). La integración del README:18-22 es solo una instrucción, y ese cambio del runner necesita su propia revisión.
- Precondiciones de fixtures que faltan en el README:
  - `select[name="id"]` visible sin JS.
  - Input hidden `id` deshabilitado.
  - B disponible y distinta de A, y al menos una variante agotada.
  - Producto destacado configurado en la home.
  - Ningún plan ni propiedad salvo los esperados.
  - Recarga entre casos.
  - Modo no cart (C1).
