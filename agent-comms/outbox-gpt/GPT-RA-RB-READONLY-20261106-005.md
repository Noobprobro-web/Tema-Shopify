# GPT-RA-RB-READONLY-20261106-005

ID: GPT-RA-RB-READONLY-20261106-005

Estado: evidencia parcial `read-only`, `scopeResult=failed`, exit 1. R-A/R-B y Lote 0 abiertos; Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: revisar el origen de los nodos axe y las banderas de routing antes de atribuir defectos o prioridades. No se propone ampliar hosts ni corregir el tema sin evidencia causal.

Resumen en 5 líneas:
1. Preflight inmediato aprobado: ambas variables `SET`, sin valores, y tres IDs confirmados no publicados por Shopify CLI exit 0.
2. Una sola corrida, sin reintentos: 114 checks = 78 `passed`, 18 `failed`, 18 `observed`, cero `not_run`.
3. Los 18 fallos son axe; la instrumentación emite únicamente tags/contextos/códigos fijos y contadores, sin acreditar identidad de recurso o tema.
4. Tres contextos cerrados; `routeOperationFailed=true` en los tres sin explicación; carrito sin tocar y `--cart` no ejecutado.
5. Hubo 694 bloqueos, incluido el nuevo host `shopify-assets.shopifycdn.com`; su registro no prueba necesidad ni causalidad.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.

Desviaciones: ninguna. Hallazgos fuera de alcance con parche: ninguno acreditado.

Verificación: la ejecución autorizada y la posterior lectura local del JSON ya realizadas se documentan aquí; esta tarea no repitió pruebas, comprobó credenciales ni ejecutó tienda, código o Gate. No cambia código, D28, JSON, commits, push ni filas del ledger.

## Ejecución y checks

Preflight inmediatamente anterior: `STOREFRONT_PASSWORD=SET`, `SHOPIFY_CLI_THEME_TOKEN=SET` (solo presencia), y `shopify theme list --role unpublished` en la tienda autorizada terminó con exit 0 y confirmó `190232297715`, `190232330483`, `190232363251`. La única ejecución `--read-only` duró de `2026-11-06T05:19:59.133Z` a `2026-11-06T05:21:24.624Z`.

Fuente: [JSON completo](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T051959132Z-0d1a684d-f284-4d70-ab6e-f39da6750c75.json), ruta `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T051959132Z-0d1a684d-f284-4d70-ab6e-f39da6750c75.json`.

| Grupo | `passed` | `failed` | `observed` | `not_run` |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Página / teclado / overflow | 18 + 18 + 18 | 0 | 0 | 0 |
| Menú / drawer vacío / idioma visible | 9 + 6 + 6 | 0 | 0 | 0 |
| Axe smoke y resumen | 0 | 18 | 18 | 0 |
| Total | 78 | 18 | 18 | 0 |

Los 18 `axe_smoke` fallaron con `AXE_VIOLATIONS_PRESENT`; los 18 `axe_rule_summary` quedaron `observed/AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`. Los pases son aserciones del arnés, sin aceptación completa R-A/R-B ni certificación visual, de lector de pantalla o Theme Store.

## Axe y evidencia de nodos

| Clase | Regla / impacto axe | Scans | Apariciones de nodos emitidas |
|---|---|---|---|
| Violación | `frame-title` / `serious` | 18 | 18 `iframe`, todos `main_document` |
| Violación | `label-content-name-mismatch` / `serious` | 5 | 7: 4 `a`, 3 `button`, todos `main_document` |
| Incompleto | `aria-valid-attr-value` / `critical` | 2 | 8 `button`, todos `main_document` |
| Incompleto | `color-contrast` / `serious` | 18 | 145: 42 `a`, 12 `button`, 2 `h1`, 10 `p`, 12 `select`, 67 `span`, todos `main_document` |

No hubo nodos omitidos ni categorías unresolved/iframe_document en la evidencia emitida; los códigos diagnósticos son `null`. Los contadores son apariciones entre scans, no nodos DOM únicos. Un `iframe/main_document` es un elemento iframe del documento principal; no identifica su origen o contenido. Los estados incompletos requieren revisión y no equivalen a violaciones confirmadas. El impacto axe `serious`/`critical` no confirma P1 del proyecto ni defecto del tema.

La clasificación no guarda selectores, HTML, texto, atributos, valores de formularios, URLs, cookies o credenciales. Estos límites preservan privacidad y también impiden atribuir todavía autoría/identidad o preparar un parche de fuente concreto.

## Sesiones y avisos

| Preview / ID | Bloqueos | `contextClosed` | `routeOperationFailed` | `cartTouched` / `cartMutationsAllowed` |
|---|---|---|---|---|
| Sartorial / `190232297715` | 219 | `true` | `true` | `false` / `false` |
| Imprint / `190232330483` | 244 | `true` | `true` | `false` / `false` |
| Archive / `190232363251` | 231 | `true` | `true` | `false` / `false` |
| Total | 694 | Tres cerrados | Tres banderas sin causa explicada | `--cart` no ejecutado |

Avisos agregados: `error-analytics-sessions-production.shopifysvc.com` 22; `js.hcaptcha.com` 11; `monorail-edge.shopifysvc.com` 9; `otlp-http-production.shopifysvc.com` 151; nuevo host `shopify-assets.shopifycdn.com` 7; mutaciones same-origin bloqueadas 494. Los hosts distintos de la tienda quedan bloqueados por la política de hosts/analytics; los POST same-origin se bloquearon por mutación en modo lectura.

Un host registrado no demuestra que sea necesario ni que cause un check fallido. El nuevo host de assets queda identificado para revisión, sin autorización automática. Tampoco se relaciona hCaptcha con los hallazgos axe ni se explica una bandera de routing mediante un aviso sin evidencia adicional.

B-03/B-04 y el modo carrito siguen sin probar; Gate 5 histórico conserva su pase y limpieza verificada dentro de su propio alcance. R-A/R-B y Lote 0 permanecen abiertos, C-R0-4 pendiente de Johandry y Lote C no iniciado. Mantener preflight sin valores, solo previews no publicadas, revisión independiente por cambio y demás reglas vigentes.
