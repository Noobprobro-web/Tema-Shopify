# B-02 sin JS: captura del POST nativo a /cart/add

Corrige la causa del 0/12 de B-02 en tienda. Sin JS el formulario de producto navega con un POST nativo a `/cart/add` (sin `.js`). La política D28 (`harness-GPT-RA-RB-001/run.mjs:26,260`) solo autoriza POST a `/cart/add.js`, `/cart/update.js` y `/cart/clear.js` en modo `--cart`, así que el envío se abortaba como `MUTATION_BLOCKED` y el caso quedaba como error de red. Enviarlo además mutaría el carrito, prohibido por DP-004.

## Qué hace `capture.mjs`

- `installNativeCartAddCapture(context, { origin, mainFrameOf })` registra una ruta que Playwright ejecuta antes que el router D28 si se instala después de él. Solo reconoce una navegación de documento del marco principal, POST, mismo origen exacto y ruta exacta `/cart/add` o `/<locale>/cart/add`, sin query ni fragmento.
- Lee el cuerpo (multipart o urlencoded), responde `route.abort('blockedbyclient')` y guarda en memoria solo `id`, `quantity`, `selling_plan` y `properties[...]`. Queda registrado como `CAPTURED_NOT_SENT`. Toda otra petición sigue al router D28 con `route.fallback()`.
- El módulo no contiene `continue`, `fetch` ni `fulfill`. Si una mutación obtiene respuesta (`requestfinished`), el caso falla con `REQUEST_REACHED_SERVER`.
- `runNoJsVariantCase(page, log, { formSelector, variantA, variantB, expected })` falla cerrado antes de tocar la página si A o B no son ids numéricos, si A es igual a B, si `expected.variantId` no es B o si `expected.productHasSellingPlans` no es booleano. Luego exige que la página cargada muestre A, elige B en `select[name=id]`, lee la opción seleccionada y `FormData(form)`, envía y da `PASS` o `FAIL`.
- El `abort` va en un `finally`: si leer el cuerpo o la cabecera lanza, la ruta queda resuelta igual y el caso da `PAYLOAD_PARSE_FAILED`.

### Regla de PASS

Es `PASS` solo si hay una captura y el id enviado es exactamente `[B]`, igual a la opción visible y a `FormData.getAll('id')`, y la cantidad coincide.

Plan (`selling_plan`), sin filtrar vacíos: con plan esperado lo enviado debe ser exactamente `[plan]`. Sin plan esperado se acepta `[]` siempre y `[""]` solo si el producto no tiene planes (`productHasSellingPlans: false`). Un plan esperado en un producto sin planes, varios valores o un vacío en un producto con planes dan `FAIL`. Lo enviado debe coincidir además con `FormData.getAll('selling_plan')`.

Propiedades: `expected.properties` nulo o ausente equivale a `{}`. Una clave enviada que no se espera da `PAYLOAD_PROPERTIES_UNEXPECTED`; una esperada que falta o cambia da `PAYLOAD_PROPERTIES_MISMATCH`. Los valores de las propiedades no salen de memoria.

## Excepción a D28

No amplía la allowlist: `/cart/add` sigue sin autorización en D28 y nunca sale del navegador. La excepción es solo de clasificación: el aborto de esta ruta cuenta como captura y no como fallo de red. Como cambio del arnés, necesita revisión independiente antes de usarse en tienda.

## Runner B-02 (`run-b02.mjs`)

`node run-b02.mjs --fixture=<fixture.json>`. No modifica `harness-GPT-RA-RB-001/run.mjs`: lee ese archivo, exige su SHA-256 revisado (`D28_RUNNER_SHA256`), quita solo la llamada final a `main()`, añade exports y lo importa desde un directorio temporal propio que se borra al cargar. Si run.mjs cambia, el runner no arranca (`D28_SOURCE_DIGEST_NOT_EXPECTED`). La política D28 (`requestDecision`, `createRouter`, `requestViaPolicy`, 429) se usa tal cual.

Reglas:

- Modo único `b02-no-js`. `--cart` da `B02_CART_MODE_REJECTED`; `--read-only` e `--inventory`, `B02_MODE_NOT_SUPPORTED`. La sesión fija `mode`, `cartWriteEnabled`, `cartAuthorization` y `cleanupInProgress` como propiedades no escribibles, y se comprueban antes de instalar rutas y antes de cada caso. Así la regla de run.mjs:260 nunca autoriza `/cart/add.js` (C1): ese POST va a D28 y se bloquea como `MUTATION_BLOCKED`.
- El contexto se crea con `javaScriptEnabled: false`. En cada caso una sonda inserta un script y exige que no se ejecute (`JAVASCRIPT_NOT_DISABLED`).
- Rutas en orden fijo: router D28 primero y captura después, comprobado (`ROUTE_ORDER_NOT_EXPECTED`).
- Cada caso vuelve a cargar su URL con `preview_theme_id`, porque el aborto deja la página en `chrome-error`. Sin JS `window.Shopify` no existe, así que la identidad se lee del script inline `Shopify.theme = {...};`: el id debe ser el del fixture y el rol `unpublished`, además de `assertStorePage` de D28.
- Credenciales solo por entorno: `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN`. Si falta alguna, falla cerrado antes de abrir el navegador. Un argumento con nombre de credencial se rechaza, y el fixture no puede tener claves de ese tipo. La contraseña solo se usa en el POST `/password` de D28; el token solo se exige presente.
- El informe (`results/B02-*.json`) se arma por lista blanca: códigos, ids numéricos, conteos `capturedNotSent`, `reachedServer` y bloqueos de D28. No lleva cookies, cabeceras, cuerpos, URL completas ni valores de propiedades. Nunca se serializa el log de capturas, y cada cadena pasa por el guardia de secretos de D28.
- Entre casos espera al menos 1 s. Si D28 marca un fallo de ruta (por ejemplo 429 agotado), el resto de casos no se ejecuta (`D28_ROUTE_OPERATION_FAILED`).

Fixture: `{ "themeId", "cases": [{ "id", "surface": "pdp"|"featured", "path", "formSelector", "variantA", "variantB", "loadVariantInUrl", "quantity", "sellingPlan", "productHasSellingPlans", "properties" }] }`. Sin claves extra, máximo 24 casos, tema dentro de los IDs autorizados de D28.

## Precondiciones antes de usarlo en tienda

1. Preflight de CLI justo antes de cada ejecución: `shopify theme list --store <tienda> --role unpublished --no-input` y confirmar que el ID del fixture sigue sin publicar. El runner no ejecuta la CLI; solo comprueba el rol en la página. Si el preflight no lo confirma, no se ejecuta.
2. Preview no publicada: el tema del fixture tiene que ser uno de los IDs autorizados de D28 y no ser el tema publicado.
3. Fixtures con selector nativo visible sin JS: `select[name="id"]` visible, input hidden `id` deshabilitado, B disponible y distinta de A, al menos una variante agotada en el catálogo del caso, producto destacado configurado en la home para los casos `featured`, y ningún plan ni propiedad salvo los declarados (`productHasSellingPlans` y `properties` según el producto real).
4. 429: se respeta `Retry-After` y backoff exponencial (1, 2 y 4 s, máximo 3 reintentos) mediante `fetchWith429Retries` de D28, y nunca se acorta el retraso del servidor. Los casos se separan al menos 1 s. Si se agotan los reintentos, la ejecución se detiene.
5. Modo no cart siempre; si alguien necesita el smoke de carrito, es run.mjs `--cart`, no este runner.

## Verificación local

`PLAYWRIGHT_MODULE=<node_modules>/playwright/index.mjs node local-test.mjs` levanta un servidor Node con páginas de producto sintéticas sin JS. Cubre 3 presets × PDP/destacado × catálogo disponible/con agotada, la URL de variante agotada y seis negativos. Salida en `salida-local.txt`.

`PLAYWRIGHT_MODULE=... node conditions-test.mjs` cubre las condiciones de REVIEW-B02H-001 y los negativos del revisor (R1 a R9, W1 a W3) adaptados a la API nueva, contra un servidor local. La regla de carrito se prueba con `requestDecision` real de run.mjs, sin red. Salida en `salida-condiciones.txt`.
