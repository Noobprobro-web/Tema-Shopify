# B-02 sin JS: captura del POST nativo a /cart/add

Corrige la causa del 0/12 de B-02 en tienda. Sin JS el formulario de producto navega con un POST nativo a `/cart/add` (sin `.js`). La política D28 (`harness-GPT-RA-RB-001/run.mjs:26,260`) solo autoriza POST a `/cart/add.js`, `/cart/update.js` y `/cart/clear.js` en modo `--cart`, así que el envío se abortaba como `MUTATION_BLOCKED` y el caso quedaba como error de red. Enviarlo además mutaría el carrito, prohibido por DP-004.

## Qué hace `capture.mjs`

- `installNativeCartAddCapture(context, { origin, mainFrameOf })` registra una ruta que Playwright ejecuta antes que el router D28 si se instala después de él. Solo reconoce una navegación de documento del marco principal, POST, mismo origen exacto y ruta exacta `/cart/add` o `/<locale>/cart/add`, sin query ni fragmento.
- Lee el cuerpo (multipart o urlencoded), responde `route.abort('blockedbyclient')` y guarda en memoria solo `id`, `quantity`, `selling_plan` y `properties[...]`. Queda registrado como `CAPTURED_NOT_SENT`. Toda otra petición sigue al router D28 con `route.fallback()`.
- El módulo no contiene `continue`, `fetch` ni `fulfill`. Si una mutación obtiene respuesta (`requestfinished`), el caso falla con `REQUEST_REACHED_SERVER`.
- `runNoJsVariantCase` elige B en `select[name=id]`, lee la opción seleccionada y `new FormData(form).getAll('id')`, envía y da `PASS` o `FAIL`. Es `PASS` solo si hay una captura, un único id igual a B, a la opción visible y a FormData, y si cantidad, plan y propiedades coinciden. Los valores de las propiedades no salen de memoria.

## Excepción a D28

No amplía la allowlist: `/cart/add` sigue sin autorización en D28 y nunca sale del navegador. La excepción es solo de clasificación: el aborto de esta ruta cuenta como captura y no como fallo de red. Como cambio del arnés, necesita revisión independiente antes de usarse en tienda.

## Integración en tienda

En el runner D28, con `javaScriptEnabled: false`, justo después de `context.route('**/*', createRouter(session))`:

```js
const capture = await installNativeCartAddCapture(context, { origin: ORIGIN, mainFrameOf: () => session.page.mainFrame() });
```

Origen, ID de tema y rutas de producto y destacado van por entorno (`STOREFRONT_ORIGIN`, `STOREFRONT_THEME_ID`, `STOREFRONT_PRODUCT_PATH`, `STOREFRONT_FEATURED_PATH`) y los IDs A/B se toman del fixture. Aquí no hay credenciales.

## Verificación local

`PLAYWRIGHT_MODULE=<node_modules>/playwright/index.mjs node local-test.mjs` levanta un servidor Node con páginas de producto sintéticas sin JS. Cubre 3 presets × PDP/destacado × catálogo disponible/con agotada, la URL de variante agotada y seis negativos. Salida en `salida-local.txt`.
