# GPT-RA-RB-READONLY-20261106-002

ID: GPT-RA-RB-READONLY-20261106-002

Estado: segunda ejecución parcial R-A/R-B, `scopeResult=failed`; revisión independiente y atribución de hallazgos pendientes.

Decisión requerida: revisar los fallos y la carga restringida antes de corregir el tema o aceptar R-A/R-B. El [informe 001](./GPT-RA-RB-READONLY-20261106-001.md) se conserva como antecedente.

Resumen en 5 líneas:
1. El coordinador verificó por Shopify CLI `ALL_THREE_UNPUBLISHED` justo antes de la corrida de las tres previews autorizadas.
2. El arnés produjo 114 checks: 56 `passed`, 34 `failed`, 18 `observed` y 6 `not_run`.
3. Pasaron autenticación, acceso, identidad de tema y los 18 checks de teclado; el conjunto R-A/R-B no está aprobado.
4. Los fallos son 10 de axe, 15 de overflow y 9 de menú, sin causa atribuida al tema o al arnés; aún hubo 586 solicitudes bloqueadas.
5. Los tres contextos cerraron; modo carrito deshabilitado, sin mutaciones de carrito y B-03/B-04 pendientes.

Archivos tocados:
- `agent-comms/outbox-gpt/GPT-RA-RB-READONLY-20261106-002.md`.
- `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.

Desviaciones (Nivel 1 o Nivel 2): ninguna; documentación de una corrida existente. No se cambia tema, arnés ni JSON.

Hallazgos extra fuera de alcance (con parche listo): ninguno acreditado por este análisis; no se propone un parche sin atribución.

Verificación: lectura local del [JSON examinado](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T003245426Z-4b6d5785-2690-44ef-9d76-fbddde7fca44.json) mediante `Get-Content -Raw | ConvertFrom-Json`, agrupación de checks y selección de campos de sesión/decisiones de solicitudes. Exit 0. La comprobación CLI de temas no publicados procede del informe del coordinador; esta tarea documental no ejecutó Shopify, Gate, el arnés ni comprobaciones de credenciales. No cierra filas del requirements ledger.

Lista de afirmaciones falsables:
1. `mode=read-only` y `scopeResult=failed`; se seleccionaron los tres IDs de la tabla.
2. Los 114 checks se distribuyen en 56 `passed`, 34 `failed`, 18 `observed` y 6 `not_run`.
3. Los tres `storefront_access`, 18 `page_access` y 18 `keyboard_tab_smoke` están `passed`.
4. `axe_smoke` tiene 10 `failed` y 8 `passed`; sus fallos se distribuyen 4/4/2 por preset.
5. `horizontal_overflow` falla 15 veces (6/5/4) y `menu_viewport_cross` falla 9 veces (3 por preset).
6. Las tres sesiones registran `contextClosed=true`, `cartMutationsAllowed=false` y 200/199/187 `blockedRequests`, total 586.
7. Los seis `empty_cart_drawer_keyboard_state` están `not_run/CART_PAGE_CONFIGURED`.

## Alcance e inventario

Fuente: `RA-RB-read-only-20261106T003245426Z-4b6d5785-2690-44ef-9d76-fbddde7fca44`, iniciada a `2026-11-06T00:32:45.427Z` y finalizada a `2026-11-06T00:34:24.969Z`. El coordinador informó verificación Shopify CLI `ALL_THREE_UNPUBLISHED` inmediatamente antes de esta corrida; el arnés también validó el ID seleccionado en cada sesión.

| Preview | ID | No publicada antes de la corrida | Acceso/identidad | Contexto cerrado | Solicitudes bloqueadas |
|---|---|---|---|---|---|
| Sartorial | `190232297715` | Verificado por CLI | `passed` | `true` | 200 |
| Imprint | `190232330483` | Verificado por CLI | `passed` | `true` | 199 |
| Archive | `190232363251` | Verificado por CLI | `passed` | `true` | 187 |

Se mantienen home, colección y producto a 390×844 y 1280×800. Los 18 `page_access` y 18 checks de teclado pasaron sus aserciones; el smoke de teclado no mide contraste de foco ni certifica lector de pantalla.

## Resultados y carga restringida

| Grupo | Sartorial | Imprint | Archive | Total |
|---|---|---|---|---|
| `axe_smoke` fallido | 4 | 4 | 2 | 10 |
| `horizontal_overflow` fallido | 6 | 5 | 4 | 15 |
| `menu_viewport_cross` fallido | 3 | 3 | 3 | 9 |
| Solicitudes bloqueadas | 200 | 199 | 187 | 586 |

Los 18 estados `observed` son resúmenes axe que requieren revisión de fuente. Los seis `not_run` corresponden al drawer vacío porque está configurado carrito como página. El conjunto tiene `scopeResult=failed`; no se presenta como aprobado.

La política de solicitudes aún restringe recursos necesarios para representar completamente la tienda. Entre los grupos bloqueados de esta corrida figuran:

| Grupo bloqueado | Sartorial | Imprint | Archive |
|---|---|---|---|
| Scripts store fuera de allowlist | 38 | 38 | 38 |
| Scripts Shopify CDN fuera de allowlist | 50 | 52 | 52 |
| Stylesheets store fuera de allowlist | 12 | 12 | 12 |
| Scripts Shopify CDN restringidos por comercio/cuenta/admin | 12 | 12 | 12 |
| Scripts store restringidos por comercio/cuenta/admin | 12 | 12 | 12 |

También se bloquearon mutaciones; la tabla muestra grupos seleccionados y no pretende sumar todas las 586 decisiones. Las tres sesiones registran `routeOperationFailed=false`. El cambio respecto de la primera corrida (795 bloqueos y 19 fallos) no permite atribuir una causa a cada resultado ni demostrar una regresión del tema, porque la ejecución continúa restringida. Los fallos axe, overflow y menú quedan pendientes de revisión sin atribución al tema o al arnés; no se presenta un P0/P1 confirmado ni se propone parche de tema.

## Pendientes y continuación

El modo carrito sigue deshabilitado y las tres sesiones registran `cartMutationsAllowed=false`; no hubo mutaciones de carrito. B-03/B-04 y sus matrices de reconciliación, respuesta perdida, nota/navegación y limpieza no se ejecutaron. Los seis casos de drawer vacío no ejecutados tampoco prueban un fallo del drawer.

Esta evidencia parcial no acepta R-A/R-B ni cierra el Lote 0. La verificación de las tres previews no publicadas queda disponible para la revisión independiente de C-R0-3; C-R0-4 y otras dependencias de Johandry permanecen marcadas. Revisar los hallazgos y recursos bloqueados, completar las pruebas autorizadas pendientes y seguir con cierre del Lote 0 y Lote C según el plan.

Antes de nuevas pruebas en tienda, comprobar que existen `STOREFRONT_PASSWORD` y `SHOPIFY_CLI_THEME_TOKEN` sin mostrar valores, validar la configuración autorizada y detenerse si falta alguna o existe duda. Mantener solo temas no publicados, revisión independiente de cada cambio, no checkout/pago ni credenciales en archivos/logs, y parada por P0/P1 nuevo o cambio fuera del plan.
