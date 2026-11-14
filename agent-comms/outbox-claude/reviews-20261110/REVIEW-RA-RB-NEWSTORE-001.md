```text
ID: REVIEW-RA-RB-NEWSTORE-001
Estado: ACEPTADO CON CONDICIONES (sin P1; 2 P2 y 7 P3). Las dos corridas son válidas como humo R-A/R-B en la tienda nueva. Ninguna cierra filas del ledger.
Decisión requerida: Johandry/Gemini. (1) Confirmar expresamente el SHA 103c1551…292f (D32 lo deja pendiente) y commitear run.mjs, selftest.mjs, README.md y los 3 JSON juntos. (2) No citar «serra-coat» como producto probado sin la salvedad de §5. (3) Decidir si D30 cubre de forma expresa la tienda sartorial-theme-kvkzl39t (D28 restringía PD-8 a tema-qkqpke0j).
Resumen en 5 líneas:
1. Higiene: 0 apariciones de STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN (en claro, URL-encoded, JSON-escaped, base64 y minúsculas). 0 «://», 0 cookie/set-cookie/token/authorization/bearer, 0 query strings, 0 preview_theme_id y 0 menciones de la tienda antigua. Todos los hosts son de Shopify, más js.hcaptcha.com (bloqueado).
2. Validez: R-A tiene 3 sesiones, cada una con 30 passed, 12 observed y 2 not_run (selector de idioma no renderizado), 0 failed y 0 eventos 429. R-B tiene 6/6 passed: carrito inicial vacío, 1 línea, drawer visible a 390 y a 1280, eco exacto de la nota y limpieza con 200/200/200, 0 líneas, nota vacía y contextClosed. interventionRequired=false.
3. TEARDOWN_TARGET_CLOSED (1 por corrida) está bien clasificado. Es un GET a /cdn/shopifycloud/checkout-web/assets/…js, un asset de plataforma y no del tema, cortado al cerrar el contexto. En R-B ocurrió después de la limpieza verificada. El JSON fallido anterior tiene el mismo patrón (1 TARGET_CLOSED por sesión, 3 en total) y recuentos de checks idénticos. No oculta ningún fallo real.
4. Recuentos axe incomplete: 17 de 18 vistas son idénticas a las del JSON fallido. Solo cambia Sartorial PDP 1280 (color-contrast pasa de 7 a 8, con «footer 2» en lugar de «other_or_none 1»). Las clasificaciones de ANALISIS-ARIA-VALID-ATTR-COLECCION-001 siguen valiendo.
5. Ledger: aportan humo en tienda real a las filas 47, 48, 49, 50 y 67. Ninguna cambia de estado: todas siguen en «código completo». B-04 no tiene fila propia en el ledger y la corrida no ejercita su interfaz.
Archivos tocados: solo este informe (nuevo). No edité código ni JSON. Sin commit ni push.
Desviaciones (Nivel 1 o Nivel 2): ninguna. No usé mcp__Shopify__* ni comandos de Shopify, no hice peticiones a tiendas y no abrí .secrets. Las variables de entorno solo se compararon en memoria; no imprimí sus valores. selftest.mjs se ejecutó sin red y con `env -u` de ambas variables.
Hallazgos extra fuera de alcance: P3-6 (contraste de secciones de home y footer sin analizar).
Verificación: §1 a §7 (comandos y salidas resumidas).
Lista de afirmaciones falsables numeradas: §9.
```

## 1. Integridad del runner

| Comprobación | Resultado |
|---|---|
| `sha256sum run.mjs` | `103c1551fc1d639e93a882900885ba9283d8c260d49c938543d6299ac1a4292f`, coincide con el encargo, `run-b02.mjs:29` y D32 (diff sin commitear de `docs/decisions.md`) |
| `node --check run.mjs` | OK |
| `env -u STOREFRONT_PASSWORD -u SHOPIFY_CLI_THEME_TOKEN node selftest.mjs` | `RESUMEN 96/96 comprobaciones correctas`, incluidas (g) TARGET_CLOSED en `request_setup` y (h) en `redirect_validation` durante el teardown, que siguen fallando |
| `stores.json` | Sin cambios respecto a HEAD (`git diff --quiet` OK). Último commit `f81774e`. La ruta de producto de la tienda nueva es `/products/serra-coat` |
| Vínculo resultado-SHA | **Circunstancial.** Los JSON no guardan el SHA del runner. Indicios: el mtime de run.mjs es 14:59:59Z, anterior al inicio de la primera corrida nueva (15:03:11Z). La cadena `TEARDOWN_TARGET_CLOSED` solo existe en el código nuevo (diff run.mjs:534-545, 618-620). Con 5c03c139… las mismas corridas habrían fallado, como la de 14:49 |

## 2. Higiene (punto 1)

Script Python con `-I` sobre los 3 JSON. Lee las variables de entorno en memoria y no las imprime.

| Patrón | read-only 150311 | cart 150443 | read-only 144907 (fallido) |
|---|---|---|---|
| STOREFRONT_PASSWORD (en claro, %-enc, +-enc, JSON-esc, base64, minúsculas) | 0 | 0 | 0 |
| SHOPIFY_CLI_THEME_TOKEN (mismas formas) | 0 | 0 | 0 |
| `://` / `https://` / `http://` | 0 | 0 | 0 |
| cookie, set-cookie, token, authorization, bearer, shpat_ y afines | 0 | 0 | 0 |
| `?clave=` y `preview_theme_id` | 0 / 0 | 0 / 0 | 0 / 0 |
| `_secure`, `storefront_digest`, `_shopify_y`, `cart=` | 0 | 0 | 0 |
| «password» | 3, todas `"pathClass": "password_auth"` | 1, ídem | 3, ídem |
| `tema-qkqpke0j` | 0 | 0 | 0 |

Hosts serializados: `sartorial-theme-kvkzl39t.myshopify.com`, `shop.app`, `shopify-assets.shopifycdn.com`, `monorail-edge.shopifysvc.com`, `otlp-http-production.shopifysvc.com`, `error-analytics-sessions-production.shopifysvc.com`, y `js.hcaptcha.com` (solo en read-only, `GET /1/api.js`, `HOST_NOT_ALLOWED`). Todos aparecen como peticiones **bloqueadas**. hCaptcha es la protección antibots de formularios de Shopify y también figura en el JSON anterior. No es un dominio inesperado. Las rutas (`pathname`) que se serializan son de assets y endpoints de plataforma, sin query.

## 3. Validez (punto 2)

### R-A (`…150311681Z…`)
- `target.themeIds` = 190300356912 / 190300455216 / 190300422448. Coincide con `stores.json` para sartorial, imprint y archive.
- Identidad: `storefront_access` = `{unlocked: true, previewIdVerified: true}` en cada preset. `verifyPreview` (run.mjs:264-271) exige `Shopify.theme.id === themeId` **y** `Shopify.theme.role === 'unpublished'`. Se ejecuta en cada `goto` (run.mjs:279) y antes de cada mutación. Por eso pasar `storefront_access` y cada `page_access` implica que el rol era `unpublished`. **El valor del rol no se serializa** (ver P3-1).
- Recuento por preset: 30 passed, 12 observed (axe_rule_summary y axe_platform_warning de la barra de preview) y 2 not_run (`LANGUAGE_CONTROL_NOT_RENDERED`). 0 failed.
- `rateLimitEvents`: [] en las 3 sesiones. `routeFailureEvents`: [] en las 3. `routeOperationFailed`: false. `contextClosed`: true. `interventionRequired`: false. `historicalIncidents`: [].
- Axe: `violations: []` en las 18 vistas (3 presets × 3 páginas × 2 anchos). `nodesOmitted` = 0.

### R-B (`…150443564Z…`, Sartorial 190300356912)
- `cartInitiallyEmptyVerified: true`. Se exige en run.mjs:897-898 antes de habilitar escrituras.
- `cart_pdp_add_one_line`: `oneLineVerified`, `oneItemVerified`, 200, `reconciledAfter429: false`.
- `populated_cart_drawer_viewport`: 390×844 y 1280×800 con `visible: true`.
- `cart_note_exact_api_echo`: `exactEchoVerified: true`, 200, `noteValueStored: false`. La nota es UUID + `\n  ` + emoji (run.mjs:946).
- `final_same_session_cart_cleanup`: clear 200, update 200, read 200, `itemCount 0`, `emptyVerified`, `noteEmptyVerified`. `contextClosed: true`.
- Mutaciones permitidas: 1 `POST fetch cart_post` del navegador (add.js) y 3 `POST api cart_post` (nota, clear y update de la nota). Son exactamente las 4 esperadas. Las POST bloqueadas son de analítica o plataforma: monorail, fec, `/api/collect` y `/api/2026-01/graphql.json`. Ninguna es una operación de carrito del tema.
- `rateLimitEvents: []`, `popupsClosed: 0`, `interventionRequired: false`.

## 4. TEARDOWN_TARGET_CLOSED (punto 3)

| Corrida | Evento | Sesión | Fase | Página | Recurso |
|---|---|---|---|---|---|
| 150311 (nueva) | aviso (`routeWarningEvents`) | imprint | teardown, fetch | home | GET `/cdn/shopifycloud/checkout-web/assets/c1/91e796b6…js` |
| 150443 (cart) | aviso | sartorial | teardown, fetch | product | GET `/cdn/shopifycloud/checkout-web/assets/c1/c1adaf81…js` |
| 144907 (fallida) | **fallo** (`routeFailureEvents`) en las 3 sesiones | sartorial, imprint, archive | teardown, fetch | home | GET `checkout-web/assets/c1/…js` |

- La regla de degradación (run.mjs:542-545) exige `teardownStarted`, que no sea /cart/add.js, stage fetch o fulfill, GET o HEAD, que no sea CheckError y `safeCode === 'TARGET_CLOSED'`. Los 5 eventos la cumplen. En los 3 JSON el recurso es un asset de `checkout-web` de Shopify (prefetch de checkout acelerado), no del tema (`/cdn/shop/t/<id>/`).
- La corrida fallida tiene **los mismos recuentos de checks** que la nueva (30/12/2 por preset, 0 failed). Su único motivo de fallo eran esos 3 eventos, así que no había otro fallo debajo.
- En R-B el aviso llega después de la limpieza: `finalCartCleanup` está verificado y run.mjs:1101 (`requireThat(!cartTouched || cleanupVerified)`) se ejecuta antes de `context.close()`.
- Que haya 1 por corrida (y no 1 por sesión, como en la fallida) es variación de temporización. Es coherente con que el GET dependa de un prefetch tardío.

Conclusión: la clasificación como aviso es correcta y no oculta un fallo real (ver el matiz de P3-2).

## 5. Producto añadido (punto 5)

El informe no guarda ni handle ni variante (`expectedCartLine` solo vive en memoria). Lo que se puede acreditar:
1. `ROUTES.product = TARGET.routes.product` (run.mjs:60) se toma de `stores.json`, que no cambió desde `f81774e`: `/products/serra-coat`.
2. `goto` exige 2xx, `<main>` visible e identidad del preview (run.mjs:275-280).
3. Todos los `goto` registran exactamente 1 salto de redirección de documento de la tienda: 10 en cada sesión read-only (10 navegaciones) y 2 en cart (home tras la autenticación + producto, índices 2 y 15 de `requestDecisions`). El patrón es uniforme, típico de la redirección del preview y no de una redirección de handle propia del producto. **Pero el destino del salto no se serializa.**
4. `pageKind: "product"` en el aviso de R-B no prueba nada: `page.url()` conserva la URL original aunque `route.fulfill` sirva un cuerpo redirigido.

Veredicto: es **inferible** que fue serra-coat, pero **no se puede demostrar** con el artefacto (P2-2).

## 6. Recuentos axe incomplete y ANALISIS-ARIA-VALID-ATTR-COLECCION-001

Comparación vista a vista entre 144907 (fuente del análisis) y 150311: **17 de 18 vistas son idénticas** en reglas, recuentos y `sectionFamily`.
- aria-valid-attr-value no cambia: 10 en `main_collection` (todas las colecciones), 4 en `lookbook` en Sartorial home, 3 en Archive home, 0 en Imprint home y 2 `other_or_none` en las PDP. Siguen valiendo los falsos positivos del análisis (quick add `product-card.liquid:390-393`, hotspots `lookbook.liquid:95-97`) y el «probable» de la PDP.
- color-contrast: header 6 a 1280 y 1 a 390 en las 3 presets, sin cambio. Imprint colección: 26 a 1280 (header 6 + main_collection 20) y 12 a 390 (1 + 11), sin cambio. Se mantiene «no concluyente» para esos 20 nodos.
- **Única diferencia: Sartorial PDP 1280.** color-contrast pasa de 7 a 8. Antes había header 6 + `other_or_none` 1 (button). Ahora hay header 6 + `footer` 2 (other, a). En la misma vista, el teclado pasa de 32/0/0 a 29 usables, 2 pasos en iframe externo y 1 en body (ver P3-3).
- El análisis no cubre el color-contrast de `curated_showcase`, `complete_the_look` y `hero_editorial` en home, ni el `footer` en PDP y Archive home. Los recuentos coinciden entre corridas, pero siguen sin clasificar (P3-6).

## 7. Aportación al ledger (punto 4)

Ninguna corrida de humo cierra filas. Estados actuales y estados después de este informe:

| Fila (línea) | Estado | Aporta | NO aporta |
|---|---|---|---|
| Contraste de texto (47) | `código completo` → `código completo` | 0 violaciones axe en 18 vistas de la tienda nueva | No mide contraste visual: los nodos `color-contrast` incomplete siguen ahí (limit `NO_SCREEN_READER_OR_VISUAL_CONTRAST_CERTIFICATION`). No prueba el hover H-1 de Archive. |
| Contraste no-texto, A-03 (48) | `código completo` → `código completo` | Nada específico | No mide el anillo de foco technical/heritage. `visualContrastStillRequired: true` en cada `keyboard_tab_smoke` |
| Teclado e indicador de foco, A-03 (49) | `código completo` → `código completo` | En Imprint y Archive (y Sartorial), 32 Tab por vista sin foco oculto ni inert. Se ve un indicador CSS en 27-31 de 32 pasos (`cssIndicatorIsObservationOnly`) | El recorrido es de 32 Tab, no completo. La heurística (run.mjs:840-850) solo mira outline/box-shadow del propio elemento y no clasifica los 1-5 pasos sin indicador. No mide el contraste del anillo ni el orden lógico |
| Focus trap en modales/drawers, B-01 (50) | `código completo` → `código completo` | `menu_viewport_cross` 3/3 por preset: al cruzar el corte quedan `aria-expanded=false`, sin `data-drawer-open`, foco usable y `main` no inert. `empty_cart_drawer_keyboard_state` abre y cierra con foco inicial usable | No hay ciclo de Tab dentro del drawer ni prueba de Escape. Tampoco comprueba que el foco vuelva al disparador ni que se restaure el scroll |
| Alta al carrito sin duplicar líneas, B-03 (67) | `código completo` → `código completo` | Camino feliz en tienda real: 1 clic da exactamente 1 línea, sin 429 | No simula la respuesta perdida, que es el objeto de B-03 (`cartBaseline`, `showUnconfirmedAdd`). El producto no queda acreditado (§5) |
| B-04 (nota) | Sin fila propia en el ledger (grep `B-04` en `docs/requirements-ledger.md`: 0). BOARD:64 la da como `código completo` | Solo que la API de Shopify devuelve la nota exacta | La nota se escribe por `/cart/update.js` y no por la interfaz. `show_cart_note` tiene `default: false` (`config/settings_schema.json:271-276`, `config/settings_data.json:78`). No se renderiza ni se usa el campo del tema. PD-3 sigue como limitación (D28) |
| Transversal | — | — | Lectores de pantalla, móvil real (390 es una ventana de escritorio), contraste visual y checkout: todo **no verificado** |

## 8. Hallazgos

**P1:** ninguno.

**P2-1 · Trazabilidad del runner.** Los JSON no registran el SHA de run.mjs. run.mjs, selftest.mjs y README.md (103c1551…) están sin commitear, y D32 deja pendiente la confirmación expresa de Johandry del valor final. Condición: confirmar el SHA y commitear runner y resultados juntos. Sin eso, la evidencia de §1 sigue siendo circunstancial. Recomendación futura: serializar `runnerSha256` en el informe.

**P2-2 · Producto no acreditable.** El informe R-B no permite demostrar que la línea fue serra-coat (§5). Condición: citar la corrida como «PDP configurada en stores.json (serra-coat), sin verificación de handle en el artefacto». Recomendación futura: guardar un booleano fijo, por ejemplo `productRouteMatchedConfiguredHandle`, comprobado en el DOM, sin guardar IDs.

**P3-1.** El campo `unpublishedPreflight: "required_external_coordinator_check"` (run.mjs:1053) quedó obsoleto: el rol ya se comprueba en el navegador (run.mjs:269). Además, el JSON no serializa `roleVerified`. Puede confundir a un auditor.

**P3-2.** `teardownStarted = true` se asigna al principio del `finally` (run.mjs:1080), **antes** de la limpieza del carrito. Por eso la ventana de degradación también cubre la limpieza, no solo `context.close()`. El riesgo es acotado: solo GET o HEAD, solo `TARGET_CLOSED`, y la limpieza va por API con estado verificado. Mejora opcional: un indicador `contextClosing` justo antes de run.mjs:1102.

**P3-3.** Hay no determinismo en Sartorial PDP 1280: teclado con 29 pasos usables, 2 en iframe y 1 en body (antes 32/0/0) y color-contrast en el footer. Lo más probable es un iframe de checkout acelerado que esta vez se renderizó, con `/api/2026-01/graphql.json` bloqueado (limit `RESOURCE_FILTERING_CAN_AFFECT_RESULTS`). No es un fallo, pero el paso con foco en `body` merece mirarse en la prueba manual.

**P3-4.** `populated_cart_drawer_viewport` solo comprueba `data-open` y que el panel esté visible. No comprueba que la línea se renderice dentro. A 1280 puede tratarse del mismo drawer abierto a 390 tras el cambio de tamaño (sin clic). «Drawer poblado» se infiere del estado de `/cart.js`, no del DOM.

**P3-5.** De 1 a 5 pasos de Tab por vista no muestran indicador según la heurística, de forma uniforme en las 3 presets. No es un defecto demostrado. Hay que clasificarlos a mano en la verificación de A-03.

**P3-6 (fuera de alcance).** Los nodos color-contrast incomplete de `curated_showcase`, `complete_the_look`, `hero_editorial` y `footer` no están clasificados en ningún análisis.

**P3-7 · Autorización.** D28 (decisions.md:257) limita PD-8 a «previews no publicadas de `tema-qkqpke0j`». D30 (decisions.md:369) autoriza «pruebas de carrito en previews no publicadas» sin nombrar la tienda. La corrida R-B cumple D30 al pie de la letra: preview `unpublished`, sesión propia, carrito vacío al inicio y limpieza verificada en `finally`. Según el encargo, la sesión la autorizó. Recomiendo dejar escrito que D30 cubre `sartorial-theme-kvkzl39t`, para que una lectura de D28 no la excluya. Ese registro corresponde a Johandry y Gemini.

## 9. Afirmaciones falsables

1. `sha256sum agent-comms/outbox-gpt/harness-GPT-RA-RB-001/run.mjs` devuelve `103c1551…292f`.
2. `selftest.mjs` sin red y sin las 2 variables imprime `RESUMEN 96/96`.
3. Los 3 JSON contienen 0 apariciones de los valores de STOREFRONT_PASSWORD y SHOPIFY_CLI_THEME_TOKEN (5 codificaciones) y 0 de `://`.
4. R-A 150311 tiene 0 checks `failed`, 0 `rateLimitEvents` y 0 `routeFailureEvents`, y exactamente 1 `routeWarningEvents` (imprint, `TEARDOWN_TARGET_CLOSED`, GET, checkout-web).
5. R-B 150443 tiene 6/6 passed, `finalCartCleanup` = 200/200/200 con itemCount 0, y 4 POST `cart_post` permitidas.
6. El JSON fallido 144907 tiene 3 `routeFailureEvents` TARGET_CLOSED en teardown (1 por sesión) y recuentos de checks idénticos a 150311.
7. Los recuentos de axe incomplete coinciden en 17 de 18 vistas entre 144907 y 150311. La excepción es Sartorial product 1280 (color-contrast 7 → 8).
8. Cada sesión read-only registra 10 saltos de redirección de documento de la tienda, y la de cart registra 2.
9. `grep -c "B-04" docs/requirements-ledger.md` devuelve 0.
10. `config/settings_data.json:78` contiene `"show_cart_note": false`.
