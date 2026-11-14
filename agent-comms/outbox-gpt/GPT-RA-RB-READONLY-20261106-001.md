# GPT-RA-RB-READONLY-20261106-001

ID: GPT-RA-RB-READONLY-20261106-001

Estado: evidencia parcial R-A/R-B; `scopeResult=failed`. Revisión independiente y atribución de hallazgos pendientes.

Decisión requerida: revisar la fuente de los fallos antes de corregir el tema o aceptar R-A/R-B. Este informe no solicita otra autorización para el trabajo ya aprobado.

Resumen en 5 líneas:
1. El arnés `read-only` produjo 114 checks: 71 `passed`, 19 `failed`, 18 `observed` y 6 `not_run`.
2. Pasaron acceso/autenticación e identidad de las tres previews, 18 `page_access` y los 18 checks de teclado.
3. Axe tuvo 16 checks aprobados y dos fallidos en home de Imprint; el conjunto R-A/R-B no está aprobado.
4. Los fallos son 8 de overflow horizontal, 9 de cruce de viewport del menú y 2 de axe; su causa aún no está atribuida.
5. Se bloquearon 795 solicitudes y cerraron los tres contextos; el modo carrito estaba deshabilitado y B-03/B-04 no se ejecutaron.

Archivos tocados:
- `agent-comms/outbox-gpt/GPT-RA-RB-READONLY-20261106-001.md`.
- `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.

Desviaciones (Nivel 1 o Nivel 2): ninguna; documentación de una corrida existente. No se cambia código del tema ni del arnés.

Hallazgos extra fuera de alcance (con parche listo): ninguno acreditado; no se propone un parche sin atribución de fuente.

Verificación: lectura local del [JSON examinado](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T002416742Z-c4b769c9-3cf1-4733-a71d-34486beadb98.json) mediante `Get-Content -Raw | ConvertFrom-Json`, agrupación de checks y selección de campos de sesión, y lectura del [README del arnés](./harness-GPT-RA-RB-001/README.md). Las lecturas y agrupaciones terminaron con exit 0. Esta tarea documental no ejecutó Gate, el arnés, Shopify ni comprobaciones de credenciales. No cierra filas del requirements ledger.

Lista de afirmaciones falsables:
1. `mode=read-only` y `scopeResult=failed`; la corrida abarca los tres IDs autorizados indicados en la tabla.
2. Los 114 checks se distribuyen exactamente en 71 `passed`, 19 `failed`, 18 `observed` y 6 `not_run`.
3. Los tres `storefront_access`, 18 `page_access` y 18 `keyboard_tab_smoke` están `passed`.
4. `axe_smoke` tiene 16 `passed` y 2 `failed`; los dos fallos son home de Imprint en 390×844 y 1280×800.
5. Las sesiones registran `contextClosed=true`, `cartMutationsAllowed=false` y 283/265/247 `blockedRequests`.
6. Los seis `empty_cart_drawer_keyboard_state` están `not_run/CART_PAGE_CONFIGURED`; B-03/B-04 siguen deshabilitadas según el README.

## Alcance de la corrida

Fuente: `RA-RB-read-only-20261106T002416742Z-c4b769c9-3cf1-4733-a71d-34486beadb98`, iniciada a `2026-11-06T00:24:16.743Z` y finalizada a `2026-11-06T00:25:36.199Z`. Sus checks de acceso a página abarcan home, colección y producto a 390×844 y 1280×800.

| Preview autorizada | ID | Acceso/autenticación e identidad | Contexto cerrado | Solicitudes bloqueadas |
|---|---|---|---|---|
| Sartorial | `190232297715` | `passed` | `true` | 283 |
| Imprint | `190232330483` | `passed` | `true` | 265 |
| Archive | `190232363251` | `passed` | `true` | 247 |

El alcance autorizado sigue limitado a temas no publicados. El JSON valida la identidad seleccionada, pero no contiene una comprobación del rol de publicación; por sí solo no acredita que cada tema permanezca no publicado. La tarea documental no cambia ese estado ni realiza escrituras en Shopify.

## Resultados y hallazgos pendientes de atribución

| Resultado | Número | Qué representa |
|---|---|---|
| `passed` | 71 | Checks definidos por el arnés que cumplieron su aserción. |
| `failed` | 19 | Fallos agrupados abajo; no atribuibles todavía al tema o al arnés. |
| `observed` | 18 | Resúmenes `axe_rule_summary`, con `AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`. |
| `not_run` | 6 | Casos de drawer vacío, `CART_PAGE_CONFIGURED`, en los dos anchos de cada preview. |

| Check / motivo | Número | Distribución y límite |
|---|---|---|
| `horizontal_overflow` / `HORIZONTAL_OVERFLOW` | 8 | Sartorial home/colección en ambos anchos (4); Imprint colección en ambos (2); Archive colección en ambos (2). |
| `menu_viewport_cross` / `HARNESS_OPERATION_FAILED` | 9 | Secuencias 1, 2 y 3 en cada una de las tres previews. El motivo genérico no acredita la causa. |
| `axe_smoke` / `AXE_VIOLATIONS_PRESENT` | 2 | Home de Imprint en 390×844 y 1280×800; el resumen registra `label-content-name-mismatch`, impacto `serious`, dos nodos por scan. |

No se adjudican estos 19 resultados al tema ni al arnés antes de revisar la fuente. La política bloqueó 795 solicitudes, incluidas fuentes fuera de su allowlist; esas restricciones pueden impedir una carga visual/funcional representativa. El número de bloqueos no demuestra por sí solo la causa de cada fallo. No se presenta ninguno como un P0/P1 confirmado ni se aplica un parche a partir de este informe.

Los 18 `keyboard_tab_smoke` pasaron sus aserciones de navegación; sus indicadores CSS son observaciones y no una medición de contraste de foco. Axe pasó en 16 scans y falló en dos; usa axe local 4.10.2 y una lista fija de reglas. Ese resultado no certifica contraste visual, lector de pantalla ni accesibilidad completa. El JSON también registra cero WebSockets bloqueados, cero popups cerrados y `routeOperationFailed=false` en las tres sesiones.

## Pruebas pendientes y continuación

El modo `--cart` está deshabilitado (`CART_MODE_DISABLED_PENDING_REVIEW`) y no contiene implementación de mutaciones de carrito en esta versión. No se ejecutaron B-03/B-04 ni sus casos de respuesta perdida, reconciliación, nota, navegación, cantidades o limpieza. La navegación a un carrito configurado como página dejó los seis casos de drawer vacío como `not_run`; eso no prueba un fallo del drawer.

Esta corrida es evidencia parcial y no aceptación completa R-A/R-B, cierre del Lote 0 ni certificación de Theme Store. Mantener pendientes las matrices no cubiertas por el arnés y las dependencias de Johandry, incluida C-R0-4 de suscripción; no crear productos, planes, apps o metafields para cubrirlas. La revisión independiente debe atribuir los hallazgos y decidir el trabajo dentro del plan antes de su aceptación. Después corresponde completar previews/pruebas, cierre del Lote 0 con revisor distinto y Lote C según la autorización vigente.

Antes de nuevas pruebas en tienda, comprobar que existen `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN` sin mostrar valores, validar la configuración autorizada y detenerse si falta alguna o hay duda de credenciales. Se mantienen las reglas de temas no publicados, revisión de cada cambio, no checkout/pago, no credenciales en archivos/logs y parada por P0/P1 nuevo o cambio fuera del plan.
