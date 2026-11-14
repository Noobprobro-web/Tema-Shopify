# GPT-RA-RB-READONLY-20261106-003

ID: GPT-RA-RB-READONLY-20261106-003

Estado: tercera corrida parcial R-A/R-B, `scopeResult=failed`; revisión independiente y atribución de hallazgos pendientes.

Decisión requerida: revisar la carga mediante un inventario seguro de rutas, o diferir esta verificación. No ampliar permisos por categoría de recurso sin identificar rutas autorizadas. R-A/R-B permanecen incompletas.

Resumen en 5 líneas:
1. Las tres previews se verificaron por Shopify CLI como no publicadas inmediatamente antes de esta corrida.
2. Los 114 checks mantienen 56 `passed`, 34 `failed`, 18 `observed` y 6 `not_run`.
3. Los fallos siguen en axe 10, overflow 15 y menú 9; la causa no está atribuida al tema o al arnés.
4. La allowlist externa exacta y las tres raíces de previews no resolvieron el resultado: aún se bloquearon 587 solicitudes, 26 `other_theme_root` por preset.
5. Los tres contextos cerraron; modo carrito deshabilitado, sin mutaciones de carrito y B-03/B-04 pendientes.

Archivos tocados:
- `agent-comms/outbox-gpt/GPT-RA-RB-READONLY-20261106-003.md`.
- `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.

Desviaciones (Nivel 1 o Nivel 2): ninguna; documentación de una corrida existente. Informes 001/002 conservados.

Hallazgos extra fuera de alcance (con parche listo): ninguno acreditado; no se propone parche de tema sin atribución.

Verificación: lectura local del [JSON examinado](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T005225752Z-126f1e94-b0d1-4a89-9484-07367383a8f2.json) mediante `Get-Content -Raw | ConvertFrom-Json`, agrupación de checks y lectura de campos seguros de sesión/`deniedResourceSummary`. Exit 0. La verificación de temas no publicados y el alcance del ajuste de allowlist proceden del informe del coordinador. Esta tarea documental no ejecutó Shopify, el arnés, Gate ni comprobaciones de credenciales; no cambió código, JSON ni el requirements ledger.

Lista de afirmaciones falsables:
1. `mode=read-only`, `scopeResult=failed`; 114 checks = 56 `passed`, 34 `failed`, 18 `observed`, 6 `not_run`.
2. Pasaron los tres `storefront_access`, 18 `page_access` y 18 `keyboard_tab_smoke`.
3. Fallaron 10 `axe_smoke` (4/4/2 por preset), 15 `horizontal_overflow` (6/5/4) y 9 `menu_viewport_cross` (3 cada uno).
4. Los tres contextos registran `contextClosed=true`, `cartMutationsAllowed=false` y 195/193/199 `blockedRequests`, total 587.
5. Cada `deniedResourceSummary` contiene 26 `other_theme_root/known_static/REQUEST_OUTSIDE_ALLOWLIST`.
6. Los seis casos de drawer vacío quedaron `not_run/CART_PAGE_CONFIGURED`.

## Alcance y resultados

Fuente: `RA-RB-read-only-20261106T005225752Z-126f1e94-b0d1-4a89-9484-07367383a8f2`, iniciada a `2026-11-06T00:52:25.754Z` y finalizada a `2026-11-06T00:54:31.840Z`. Justo antes, el coordinador verificó por Shopify CLI el inventario `ALL_THREE_UNPUBLISHED`. El arnés comprobó acceso y la identidad de cada preview en home, colección y producto a 390×844 y 1280×800.

| Preview | ID | Estado previo por CLI | Contexto cerrado | Solicitudes bloqueadas | Axe fallido | Overflow fallido | Menú fallido |
|---|---|---|---|---|---|---|---|
| Sartorial | `190232297715` | No publicado | `true` | 195 | 4 | 6 | 3 |
| Imprint | `190232330483` | No publicado | `true` | 193 | 4 | 5 | 3 |
| Archive | `190232363251` | No publicado | `true` | 199 | 2 | 4 | 3 |
| Total | — | Tres no publicados | Tres cerrados | 587 | 10 | 15 | 9 |

El conjunto continúa `failed`; los 56 checks aprobados no constituyen aceptación de R-A/R-B. Axe tiene ocho scans aprobados y diez fallidos. Los 18 checks de teclado pasaron las aserciones del smoke, sin medir contraste de foco ni certificar lector de pantalla. Los 18 `observed` son resúmenes axe pendientes de revisión de fuente y los seis `not_run` son casos de drawer vacío por configuración de carrito como página.

## Recursos bloqueados y atribución pendiente

Según el alcance informado por el coordinador, esta corrida ya permite las rutas externas exactas revisadas y las tres raíces de las previews autorizadas. Sus conteos y grupos de fallo son iguales a los de la [segunda corrida](./GPT-RA-RB-READONLY-20261106-002.md), pese al ajuste. Esto no demuestra un defecto del tema ni del arnés; la carga sigue restringida.

| Categoría segura de denegación | Sartorial | Imprint | Archive |
|---|---|---|---|
| `other_theme_root`, estático conocido, fuera de allowlist | 26 | 26 | 26 |
| `external`, estático conocido, fuera de allowlist | 50 | 52 | 52 |
| `other_store`, estático conocido, comercio/cuenta/admin restringido | 12 | 12 | 12 |
| `external`, estático conocido, comercio/cuenta/admin restringido | 12 | 12 | 12 |
| `other_store`, mutación bloqueada | 57 | 56 | 66 |
| `external`, mutación bloqueada | 12 | 11 | 5 |
| `other_store`, estático conocido, fuera de allowlist | 26 | 24 | 26 |

Las siete categorías suman las 195/193/199 solicitudes bloqueadas. `other_theme_root` indica una raíz de tema que no coincide con ninguno de los tres IDs permitidos; el resumen no guarda el ID ni una ruta libre. No se amplía esa categoría de forma general. Los contadores y enums no identifican qué recurso produjo cada fallo, y los 587 bloqueos impiden atribuir todavía axe, overflow o menú al tema o al arnés. Las tres sesiones registran `routeOperationFailed=false`; no se presenta un P0/P1 confirmado a partir de esta evidencia parcial.

Se necesita un inventario seguro de rutas para revisar qué lecturas estáticas son autorizadas y necesarias, con su revisión independiente antes de ejecutar; si no se puede obtener dentro del alcance/confidencialidad vigente, diferir esta verificación y mantener la limitación explícita. La repetición con el mismo acceso incompleto no certifica R-A/R-B.

## Pendientes y reglas vigentes

`--cart` continúa deshabilitado y no hubo mutaciones de carrito. B-03/B-04 y sus matrices siguen pendientes; los casos drawer no ejecutados no prueban un fallo del drawer. El inventario de tres previews no publicadas queda como evidencia para revisión de C-R0-3, sin cerrar Lote 0. C-R0-4 y otras dependencias de Johandry permanecen preparadas y marcadas.

Mantener preflight de `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN` sin mostrar valores, configuración autorizada y parada si falta alguna o hay duda de credenciales. Solo temas no publicados, revisión independiente de cada cambio, sin checkout/pago ni credenciales en archivos/logs. Continuar el plan autorizado tras revisar estos hallazgos y completar o marcar las pruebas pendientes; detenerse por P0/P1 nuevo o cambio fuera del plan.
