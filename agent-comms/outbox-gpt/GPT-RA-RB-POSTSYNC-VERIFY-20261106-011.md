# GPT-RA-RB-POSTSYNC-VERIFY-20261106-011

ID: GPT-RA-RB-POSTSYNC-VERIFY-20261106-011

Estado: verificación post-sync única, exit 1, `executionResult=failed`, `scopeResult=failed` por routing; cero checks fallidos. R-A/R-B y Lote 0 abiertos; Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: revisar los cinco eventos de routing sin confundirlos con fallos funcionales de labels. No cerrar R-A/R-B/Lote 0 ni atribuir necesidad/causalidad de hosts por su registro.

Resumen en 5 líneas:
1. Preflight aprobado: dos variables `SET` sin valores y tres IDs no publicados por Shopify CLI exit 0.
2. Una corrida sin reintentos: 132 checks = 96 `passed`, cero `failed`, 36 `observed`, cero `not_run`.
3. Los 18 scans axe pasaron con regla de labels disponible; mismatches cero frente a siete scans pre-sync con el mismo harness.
4. El resultado global falla por cinco eventos de routing; tres contextos cerrados y carrito sin tocar.
5. Hay 707 bloqueos sin prueba de necesidad causal; la corrección se refleja en labels observados, sin afirmar equivalencia byte a byte ni certificación completa.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Desviaciones: ninguna. Hallazgos fuera de alcance con parche: ninguno acreditado por este análisis documental.

Verificación: se documentan la única corrida autorizada posterior a la sincronización y la lectura local de su JSON ya realizadas. Esta tarea no repitió pruebas, comprobó credenciales ni accedió a tienda; no cambia código, D28, JSON, commits, push ni filas del ledger.

## Preflight, identidad y checks

Justo antes se verificaron solo `STOREFRONT_PASSWORD=SET` y `SHOPIFY_CLI_THEME_TOKEN=SET`, sin valores. Shopify CLI `theme list --role unpublished` terminó exit 0 y confirmó `190232297715`, `190232330483`, `190232363251`. El harness ejecutado tuvo SHA-256 `B6CB9E929E9E37FF4ED52FE14B2FEDA8128DA8E08FA33363521E140B885FEB37`, igual al de la verificación pre-sync.

Fuente: [JSON completo](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T063316265Z-e1af05a5-ec5e-4d24-8bb2-f7aa9fbb0c88.json), iniciado a `2026-11-06T06:33:16.267Z` y finalizado a `2026-11-06T06:34:27.998Z`.

| Grupo | `passed` | `failed` | `observed` | `not_run` |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Página / teclado / overflow | 18 + 18 + 18 | 0 | 0 | 0 |
| Menú / drawer vacío / idioma visible | 9 + 6 + 6 | 0 | 0 | 0 |
| Axe smoke | 18 | 0 | 0 | 0 |
| Resumen axe / aviso de plataforma | 0 | 0 | 18 + 18 | 0 |
| Total | 96 | 0 | 36 | 0 |

## Evidencia servida de labels y límites axe

| Observación comparable | Pre-sync `T061420874Z` | Post-sync `T063316265Z` |
|---|---|---|
| Axe smoke | 11 aprobados / 7 fallidos | 18 aprobados / 0 fallidos |
| Scans con `label-content-name-mismatch` | 7 | 0 |
| Apariciones de esa violación | 9: 4 enlaces bento, 5 botones sticky | 0 |
| Regla de labels disponible | Incluida en el harness | `labelNameRuleAvailable=true` en 18/18 scans |
| Avisos exactos de preview-bar | 18 | 18 |

La corrección de nombres accesibles se refleja en el comportamiento remoto de labels observado: las familias bento/sticky que antes generaban mismatches ya no figuran como violaciones en ninguno de los 18 scans, con el mismo harness y los mismos IDs/recorridos. La mejora se obtiene del JSON post-sync, no se infiere solo del push. Esto no prueba equivalencia byte a byte entre archivos locales y servidos ni certifica todos los controles/estados no observados; la ausencia de una violación no es una aserción separada de presencia de cada control.

No hay violations axe. Se conservan 18 `axe_platform_warning=observed/SHOPIFY_PREVIEW_BAR_WARNING_ONLY`, una aparición por scan, y 18 resúmenes observados. Los únicos hallazgos axe restantes son **incompletos**, no violaciones confirmadas: `aria-valid-attr-value/critical` en dos scans y ocho apariciones; `color-contrast/serious` en 18 scans y 144 apariciones. El impacto de un incompleto no confirma P0/P1 ni sustituye revisión de contraste visual o lector de pantalla.

## Routing, contexto y carrito

| Preview / ID | Bloqueos | Contexto cerrado | `routeOperationFailed` | Eventos / omitidos | Carrito tocado / mutaciones permitidas |
|---|---|---|---|---|---|
| Sartorial / `190232297715` | 260 | `true` | `true` | 2 / 0 | `false` / `false` |
| Imprint / `190232330483` | 231 | `true` | `true` | 2 / 0 | `false` / `false` |
| Archive / `190232363251` | 216 | `true` | `true` | 1 / 0 | `false` / `false` |
| Total | 707 | Tres cerrados | Coherentes con eventos | 5 / 0 | `--cart` no ejecutado |

Los cinco eventos son `stage=fetch`, `pageKind=home`, `method=GET`, sin query:

| Host | Path seguro | Código | Sartorial / Imprint / Archive |
|---|---|---|---|
| `tema-qkqpke0j.myshopify.com` | `/cart` | `HARNESS_OPERATION_FAILED` | 1 / 1 / 1 |
| `cdn.shopify.com` | `/shopifycloud/shop-js/modules/v2/chunk.validators_09U1U9sZ.esm.js` | `PLAYWRIGHT_TIMEOUT` | 1 / 1 / 0 |

El global `failed` proviene de las banderas de routing; ninguno de los 132 checks tiene resultado `failed`. Las banderas son coherentes con los eventos del snapshot final, pero los códigos genéricos/timeouts no identifican su causa ni prueban un defecto funcional del tema.

## Avisos y pendientes

Los avisos suman los 707 bloqueos: `error-analytics-sessions-production.shopifysvc.com` 19, `js.hcaptcha.com` 11, `monorail-edge.shopifysvc.com` 26, `otlp-http-production.shopifysvc.com` 154, `shopify-assets.shopifycdn.com` 4 y mutaciones same-origin bloqueadas 493. El registro no demuestra que un host sea necesario ni que cause un check o evento fallido; su aparición no amplía la autorización.

La corrida única post-sync se ejecutó sin reintento y sin `--cart`. B-03/B-04 siguen sin probar, C-R0-4 pendiente de Johandry y R-A/R-B/Lote 0 abiertos; Lote C no iniciado. Los 96 pases no son aceptación completa ni certificación Theme Store. Mantener preflight sin valores, solo previews no publicadas, revisión independiente por cambio y demás reglas vigentes.
