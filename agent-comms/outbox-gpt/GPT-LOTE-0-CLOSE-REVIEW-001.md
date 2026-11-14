# GPT-LOTE-0-CLOSE-REVIEW-001

ID: GPT-LOTE-0-CLOSE-REVIEW-001

Estado: cierre no aceptado por el revisor independiente, según dictamen comunicado por el coordinador. Lote 0 no cerrado; R-A/R-B incompletas. No avanzar a Lote C.

Decisión vigente: el revisor rechazó cerrar con la evidencia actual. Se requiere resolver o acotar las brechas y presentar evidencia adicional para una nueva revisión; el inventario seguro añadido no constituye aceptación ni cierre.

Resumen en 5 líneas:
1. Gate 5 pasó en el intento 4/5 y verificó carrito vacío/sin nota; un intento quedó sin usar.
2. Shopify CLI confirmó las tres previews no publicadas inmediatamente antes de la última corrida de lectura.
3. R-A/R-B tienen seis JSON: uno abortado en autenticación y cinco corridas con 114 registros; la última tiene 56 `passed`, 34 `failed`, 18 `observed`, 6 `not_run`.
4. Sus fallos axe/overflow/menú siguen sin atribución porque hubo 587 solicitudes bloqueadas; no existe base local segura para admitir rutas Shopify de runtime arbitrarias.
5. El revisor no aceptó el cierre; C-R0-4 sigue pendiente de Johandry y R-A/R-B incompletas, sin avanzar a Lote C.

Archivos tocados:
- `agent-comms/outbox-gpt/GPT-LOTE-0-CLOSE-REVIEW-001.md`.
- `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.

Desviaciones (Nivel 1 o Nivel 2): ninguna; paquete documental sin cambios de código, tema, arnés ni JSON.

Hallazgos extra fuera de alcance (con parche listo): ninguno; no se propone parche del tema sin atribución de fuente.

Verificación: inventario local de seis JSON, selección de `scopeResult`, número de checks/sesiones y cierres; lectura del estado vigente y comprobación de referencias de fuente en `layout/theme.liquid`. Las lecturas terminaron con exit 0. El inventario completo de rutas locales y la comprobación Shopify CLI proceden del informe del coordinador. Esta tarea no ejecutó tienda, Gate, arnés, credenciales, empaquetado, commit ni push. HEAD local al preparar el paquete: `0337be1`, rama `lote-d`, con cambios sin commit; no se afirma identidad entre ese SHA y las previews.

Lista de afirmaciones falsables:
1. El [JSON Gate 5](./GATE5-DIAGNOSTIC-20261105T233916860Z-d5d1ed33-f9c2-4df8-8309-9d397a68da6b.json) registra `passed`, 24 checks aprobados, cuatro observados, cero fallidos/no ejecutados y limpieza verificada.
2. El [último JSON R-A/R-B](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T005225752Z-126f1e94-b0d1-4a89-9484-07367383a8f2.json) registra `scopeResult=failed`, 114 checks = 56/34/18/6 y 587 solicitudes bloqueadas.
3. Los fallos de esa corrida se distribuyen en axe 10, overflow 15 y menú 9; no tienen una causa acreditada por este paquete.
4. Las tres sesiones registran `contextClosed=true` y `cartMutationsAllowed=false`; los seis casos de drawer están `not_run/CART_PAGE_CONFIGURED`.
5. `layout/theme.liquid:35,40` repite el mismo recurso literal `model-viewer-ui.css`; los scripts referenciados en líneas 95 y 144 usan filtros Liquid de assets.
6. C-R0-4 depende de Johandry y no queda cumplida por estas pruebas.

## Condiciones de cierre y evidencia

| Condición | Evidencia disponible | Estado presentado al revisor |
|---|---|---|
| C-R0-1: ficha | [GEMINI-FICHA-LOTE-0-BASE-001](../outbox-gemini/GEMINI-FICHA-LOTE-0-BASE-001.md), citada en la [R-0](../outbox-gemini/GEMINI-REVIEW-LOTE-0-R0-002.md). | Aceptación histórica registrada; no regenerada en esta tarea. |
| C-R0-2: ZIP regenerable | `scripts/package-theme-zip.mjs`, [revisión ZIP aceptada](../outbox-claude/CLAUDE-REVIEW-LOTE-0-ZIP-001.md); SHA-256 canónico histórico `f001627e44022b5731e8fe04413def41aa3b2e4331b193cc8be184582e2ce585`. | Aceptación histórica registrada; no se crea un ZIP nuevo ni se atribuye el hash al código actual sin regenerarlo. |
| C-R0-3: previews Imprint/Archive no publicadas | Coordinador informó Shopify CLI `ALL_THREE_UNPUBLISHED` antes de la última corrida; IDs Sartorial `190232297715`, Imprint `190232330483`, Archive `190232363251`. Los checks de acceso/identidad pasaron. | Evidencia lista para revisión de cierre; no constituye prueba completa R-A/R-B. |
| C-R0-4: fixture de suscripción | Dependencia explícita de Johandry; el [README del arnés](./harness-GPT-RA-RB-001/README.md) la mantiene como `C_R0_4_SUBSCRIPTION_FIXTURE_PENDING_JOHANDRY`. | Pendiente de Johandry; no se crean productos, planes, apps ni metafields. |
| Gate 5 | [Informe 005](./GPT-GATE5-CONSOLE-DIAGNOSTIC-20261105-005.md) y su JSON: intento 4/5 `passed`; carrito con `emptyVerified=true`, `noteEmptyVerified=true`, `itemCount=0`, `noteEmpty=true`, verificados por lectura final. | Superado dentro del alcance de su arnés; no sustituye las matrices R-A/R-B. |

Los tres avisos de Gate 5 (CDN 404, CSP/403 de fuente desconocida) no cumplen el criterio de fallo por fuente de tienda/assets. Los cuatro checks observados de toggles/subtotal carecen de aserción definida y no se presentan como funcionalidad certificada.

## R-A/R-B: resultado y cobertura incompleta

El directorio `harness-GPT-RA-RB-001/results/` contiene seis JSON `read-only`: `T002052881Z` abortó en autenticación con tres checks; `T002416742Z`, `T003245426Z`, `T003925932Z`, `T004602511Z` y `T005225752Z` contienen 114 registros cada uno. Son corridas del arnés con alcance limitado, sin aceptación completa de R-A/R-B. Los [informes 001](./GPT-RA-RB-READONLY-20261106-001.md), [002](./GPT-RA-RB-READONLY-20261106-002.md) y [003](./GPT-RA-RB-READONLY-20261106-003.md) conservan la evolución documentada y sus límites.

| Última corrida `T005225752Z` | Sartorial | Imprint | Archive | Total |
|---|---|---|---|---|
| Fallos axe | 4 | 4 | 2 | 10 |
| Fallos overflow | 6 | 5 | 4 | 15 |
| Fallos menú | 3 | 3 | 3 | 9 |
| Solicitudes bloqueadas | 195 | 193 | 199 | 587 |

Pasaron 18 `page_access`, 18 `keyboard_tab_smoke` y los tres accesos/autenticaciones con identidad de tema. Los 18 resúmenes axe son observaciones que requieren revisión. Los seis casos de drawer vacío no se ejecutaron por configuración de carrito como página. `--cart` permanece deshabilitado: B-03/B-04, mutaciones/reconciliación, respuesta perdida, nota/navegación y limpieza de esas matrices no fueron probadas. El pase de limpieza de Gate 5 no las sustituye.

No se atribuyen los fallos axe, overflow o menú al tema mientras la carga permanece restringida. La última corrida todavía denegó 26 recursos `other_theme_root` por preset —ninguna de esas raíces coincide con los tres IDs permitidos—, 50/52/52 estáticos externos, 12 recursos restringidos store y 12 externos por preset, además de mutaciones. Todos los contextos cerraron; la ejecución de lectura no realizó mutaciones de carrito.

## Inventario local y riesgo residual

El inventario local informado por el coordinador halló una única URL CDN literal única para `model-viewer-ui.css`, repetida en `layout/theme.liquid:35,40`. Los scripts Shopify se generan mediante `asset_url`/`shopify_asset_url` (por ejemplo líneas 95 y 144); el código local no aporta rutas externas exactas para todos los recursos que Shopify inyecta en runtime. Admitir las rutas externas exactas revisadas y las tres raíces autorizadas de preview dejó sin cambio los grupos de fallo.

No hay base segura para permitir de forma arbitraria rutas Shopify de runtime u otras raíces de tema. Esa ampliación podría desbordar el alcance de lectura aprobado y no garantizaría una carga fiel. Corresponde obtener un inventario seguro y revisable de rutas, o diferir la verificación afectada y mantenerla como incompleta. No se propone una allowlist amplia, un parche del tema ni una reclasificación de fallos sin fuente.

## Inventario seguro posterior y dictamen recibido

El [inventario `T011824411Z`](./harness-GPT-RA-RB-001/results/RA-RB-inventory-20261106T011824411Z-a5641940-1005-4403-b197-065ffd7d3b0c.json) terminó `scopeResult=inventory_only`, `executionResult=completed`. Registra 32/31/32 ocurrencias elegibles, 11/10/11 muestras emitidas, cero ocurrencias redactadas/truncadas y tres contextos cerrados. En cada preset, el resumen contiene `other_theme_root` con los sufijos de fuente `base_css`, `theme_js` y `product_zoom_js`; las muestras incluyen cinco recursos de host externo fijo por preset y otros bloques store/plataforma. El [informe de inventario](./GPT-RA-RB-RESOURCE-INVENTORY-20261106-001.md) conserva solo categorías y conteos.

El artefacto retiene fingerprints salados, sin rutas/query crudos ni IDs runtime. Los sufijos reconocibles no prueban la identidad de una raíz de tema ni la equivalencia con el repo. El código fuente genera sus assets mediante `asset_url`/`shopify_asset_url`; este inventario no autoriza rutas runtime arbitrarias ni resuelve la atribución de los fallos anteriores. Las referencias de prueba R-A/R-B siguen inconclusas.

El coordinador comunicó que el revisor independiente no acepta el cierre con la evidencia actual. Lote 0 permanece abierto; no avanzar a Lote C. Esta actualización registra ese resultado sin atribuirle razones o condiciones adicionales que no consten en el dictamen comunicado. C-R0-4 y las brechas funcionales enumeradas siguen pendientes; corresponde reunir evidencia suficiente y volver a revisión.

## Solicitud original al agente independiente (antecedente)

Emitir un dictamen explícito sobre una de estas salidas:

1. **Cierre condicional de Lote 0**, solo si las condiciones históricas de ficha/ZIP, el inventario de previews y Gate 5 bastan para ese alcance, manteniendo C-R0-4 pendiente de Johandry y R-A/R-B sin aceptación completa, con sus fallos y pruebas de carrito pendientes enumerados.
2. **Pruebas adicionales antes del cierre**, indicando condiciones bloqueantes concretas, evidencia faltante, alcance permitido y dependencias de Johandry; identificar si es viable un inventario seguro de recursos o si debe diferirse la prueba.

La solicitud anterior se conserva como antecedente; el cierre no fue aceptado. No se declara Lote 0 cerrado ni se continúa a Lote C. Los entregables de Lote D también conservan la revisión independiente pendiente.

Mantener preflight de existencia de `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN` sin mostrar valores, configuración temporal autorizada y parada por ausencia/duda de credenciales. Solo previews no publicadas, sin checkout/pago, sin credenciales en archivos/logs y con revisión de un agente distinto por cambio. No escribir productos, apps, configuración ni metafields para cubrir las dependencias.
