# GPT-RA-RB-READONLY-20261106-007

ID: GPT-RA-RB-READONLY-20261106-007

Estado: cuarta corrida diagnóstica posterior a D28, `read-only`, exit 1, `executionResult=failed`, `scopeResult=failed`. R-A/R-B y Lote 0 abiertos; Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: revisar los hallazgos axe y los errores de routing sin atribuir fuente o prioridad por las categorías emitidas. La evidencia no sustenta un P0/P1 nuevo confirmado ni la necesidad causal de hosts bloqueados.

Resumen en 5 líneas:
1. Preflight inmediato aprobado: dos variables `SET` sin valores, snapshot revisado confirmado y tres IDs no publicados por Shopify CLI exit 0.
2. Una sola corrida sin reintentos: 114 checks = 78 `passed`, 18 `failed`, 18 `observed`, cero `not_run`.
3. Axe mantiene iframes sin título de categoría CDN fuera de sección Shopify y enlaces/botones con aria-label en región principal dentro de sección, sin atribución de fuente.
4. Tres contextos cerrados; eventos de routing 2/1/4 coherentes con las tres banderas `true`; carrito sin tocar.
5. Hubo 670 bloqueos; un host registrado no prueba necesidad ni causalidad respecto de un check.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Desviaciones: ninguna. Hallazgos fuera de alcance con parche: ninguno acreditado.

Verificación: esta tarea documenta la corrida autorizada y la posterior lectura local ya realizadas, sin repetir pruebas ni comprobar credenciales o acceder a tienda. No cambia código, D28, JSON, commits, push ni filas del ledger.

## Preflight y resultado

Justo antes se verificaron únicamente `STOREFRONT_PASSWORD=SET` y `SHOPIFY_CLI_THEME_TOKEN=SET`, sin valores. El snapshot `6E3BBF6949819A338ADB351AA9DB1BCBE5941B564D04AC7EC199F96D1A88264E` coincidió con el revisado. Shopify CLI `theme list --role unpublished` terminó exit 0 y confirmó `190232297715`, `190232330483`, `190232363251`.

Fuente: [JSON completo](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T054357624Z-e31e192f-5bf0-4643-825b-f6ed48b6954c.json), iniciado a `2026-11-06T05:43:57.626Z` y finalizado a `2026-11-06T05:45:07.659Z`.

| Grupo | `passed` | `failed` | `observed` | `not_run` |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Página / teclado / overflow | 18 + 18 + 18 | 0 | 0 | 0 |
| Menú / drawer vacío / idioma visible | 9 + 6 + 6 | 0 | 0 | 0 |
| Axe smoke y resumen | 0 | 18 | 18 | 0 |
| Total | 78 | 18 | 18 | 0 |

Los fallos son `axe_smoke/AXE_VIOLATIONS_PRESENT`; los resúmenes son `observed/AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`. Los pases describen las aserciones del arnés, sin aceptación completa R-A/R-B ni certificación de accesibilidad o Theme Store.

## Axe y metadata segura

| Clase / regla | Impacto axe | Scans | Apariciones / metadata |
|---|---|---|---|
| Violación `frame-title` | `serious` | 18 | 18 `iframe`; `main_document`, `iframeTitlePresent=false`, `iframeSourceCategory=shopify_cdn`, `landmarkRegion=other_or_none`, `withinShopifySection=false`. |
| Violación `label-content-name-mismatch` | `serious` | 7 | 9 apariciones: 4 `a`, 5 `button`; `main_document`, `landmarkRegion=main`, `withinShopifySection=true`, `hasAriaLabel=true`. |
| Incompleto `aria-valid-attr-value` | `critical` | 2 | 8 `button`; `main_document`, región `main`, `withinShopifySection=true`, `hasAriaLabel=true`. |
| Incompleto `color-contrast` | `serious` | 18 | 146 apariciones: 43 `a`, 12 `button`, 2 `h1`, 1 `other`, 11 `p`, 12 `select`, 65 `span`; todas `main_document` y `withinShopifySection=true`, en regiones header/main/other. |

No hay nodos omitidos ni unresolved; los códigos diagnósticos son `null`. Son apariciones repetidas entre scans, no nodos DOM únicos. `withinShopifySection=true` solo indica que hay un ancestro con el prefijo esperado; no guarda su ID ni demuestra autoría del tema, archivo:línea o identidad del recurso. La categoría CDN tampoco identifica el iframe concreto. `serious`/`critical` de axe no confirma prioridad P1; los estados incompletos no son violaciones confirmadas.

La metadata no conserva selectores, HTML, texto, valores de atributos/formularios, URLs completas, cookies o credenciales. Estas categorías no bastan para atribuir una corrección al código del tema sin revisar fuente y nodos de forma autorizada.

## Sesiones y eventos de routing

| Preview / ID | Bloqueos | Contexto cerrado | `routeOperationFailed` | Eventos / omitidos | Carrito tocado / mutaciones permitidas |
|---|---|---|---|---|---|
| Sartorial / `190232297715` | 237 | `true` | `true` | 2 / 0 | `false` / `false` |
| Imprint / `190232330483` | 230 | `true` | `true` | 1 / 0 | `false` / `false` |
| Archive / `190232363251` | 203 | `true` | `true` | 4 / 0 | `false` / `false` |
| Total | 670 | Tres cerrados | Coherentes con eventos | 7 / 0 | `--cart` no ejecutado |

El snapshot final mantiene las banderas coherentes con sus eventos. Esto describe esta corrida y no reescribe la discrepancia de la [corrida anterior](./GPT-RA-RB-READONLY-20261106-006.md). Todos los eventos tienen `stage=fetch`, `pageKind=home`, `method=GET`, sin query; los códigos son tres `HARNESS_OPERATION_FAILED` y cuatro `PLAYWRIGHT_TIMEOUT`.

| Host | Path seguro | Código | Sartorial / Imprint / Archive |
|---|---|---|---|
| `tema-qkqpke0j.myshopify.com` | `/cart` | `HARNESS_OPERATION_FAILED` | 1 / 1 / 1 |
| `cdn.shopify.com` | `/shopifycloud/shop-js/modules/v2/chunk.validators_09U1U9sZ.esm.js` | `PLAYWRIGHT_TIMEOUT` | 1 / 0 / 1 |
| `cdn.shopify.com` | `/shopifycloud/shop-js/modules/v2/chunk.hooks_NQw5b9qv.esm.js` | `PLAYWRIGHT_TIMEOUT` | 0 / 0 / 1 |
| `cdn.shopify.com` | `/shopifycloud/shop-js/modules/v2/chunk.utils_DaVKdWdI.esm.js` | `PLAYWRIGHT_TIMEOUT` | 0 / 0 / 1 |

Son requests de hosts ya permitidos. El código genérico no identifica la causa del error y los timeouts de módulos no demuestran por sí solos un defecto funcional del tema o su relación con axe.

## Avisos y estado pendiente

Los avisos suman los 670 bloqueos: `error-analytics-sessions-production.shopifysvc.com` 18, `js.hcaptcha.com` 11, `monorail-edge.shopifysvc.com` 12, `otlp-http-production.shopifysvc.com` 149 y mutaciones same-origin bloqueadas 480. El registro de hosts no acredita que sean necesarios ni que causen un fallo. No se vinculan hCaptcha, telemetry o mutaciones bloqueadas con los hallazgos axe sin evidencia adicional; tampoco se autoriza un host por aparecer en el diagnóstico.

No hay soporte para un P0/P1 nuevo confirmado en este artefacto. R-A/R-B y Lote 0 siguen abiertos; B-03/B-04 y `--cart` no se ejecutaron, C-R0-4 sigue pendiente de Johandry y Lote C no se inició. Mantener preflight sin valores, solo previews no publicadas, revisión independiente por cambio y demás reglas vigentes. Sin reintentos ni pruebas adicionales en esta tarea documental.
