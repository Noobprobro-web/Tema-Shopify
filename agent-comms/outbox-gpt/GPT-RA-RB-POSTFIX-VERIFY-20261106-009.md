# GPT-RA-RB-POSTFIX-VERIFY-20261106-009

ID: GPT-RA-RB-POSTFIX-VERIFY-20261106-009

Estado: verificación remota post-fix única, exit 1, `executionResult=failed`, `scopeResult=failed`. No prueba el resultado del parche local: no se había realizado theme push de las correcciones. R-A/R-B y Lote 0 abiertos; Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: conservar la separación entre corrección local aceptada y tema remoto servido. No clasificar esta corrida como fallo del parche local ni atribuir causa a hosts o routing sin evidencia.

Resumen en 5 líneas:
1. Preflight aprobado: dos variables `SET` sin valores y tres IDs confirmados no publicados por Shopify CLI exit 0.
2. Una corrida sin reintentos: 132 checks = 89 `passed`, 7 `failed`, 36 `observed`, cero `not_run`.
3. Quedan siete scans remotos con `label-content-name-mismatch`; la barra de preview exacta produjo 18 avisos observados.
4. Routing final coherente, eventos 5/1/2; tres contextos cerrados, carrito sin tocar y 722 bloqueos.
5. No hubo theme push de las correcciones locales antes de la corrida; los fallos remotos no demuestran fallo del parche local ni cierran R-A/R-B/Lote 0.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Desviaciones: ninguna. Hallazgos fuera de alcance con parche: ninguno acreditado por este análisis documental.

Verificación: se documentan la corrida autorizada y la lectura local de su JSON ya realizadas. Esta tarea no repitió pruebas, comprobó credenciales ni accedió a tienda; no cambia código, D28, JSON, commits, push ni filas del ledger.

## Preflight, identidad y resultado

Justo antes se verificaron solo `STOREFRONT_PASSWORD=SET` y `SHOPIFY_CLI_THEME_TOKEN=SET`, sin valores. Shopify CLI `theme list --role unpublished` terminó exit 0 y confirmó `190232297715`, `190232330483`, `190232363251`. SHA-256 del harness local ejecutado: `B6CB9E929E9E37FF4ED52FE14B2FEDA8128DA8E08FA33363521E140B885FEB37`.

Fuente: [JSON completo](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T061420874Z-52ecff9a-9cf7-46ce-99f4-4403185e1f77.json), iniciado a `2026-11-06T06:14:20.875Z` y finalizado a `2026-11-06T06:15:31.086Z`.

**No se había efectuado theme push de las correcciones locales.** El ID de preview correcto no prueba que sus assets/plantillas reflejen el parche local. Esta verificación utiliza el harness local actualizado contra el contenido remoto servido; por tanto, no se clasifica como fallo del parche local ni como verificación funcional de ese parche desplegado.

| Grupo | `passed` | `failed` | `observed` | `not_run` |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Página / teclado / overflow | 18 + 18 + 18 | 0 | 0 | 0 |
| Menú / drawer vacío / idioma visible | 9 + 6 + 6 | 0 | 0 | 0 |
| Axe smoke | 11 | 7 | 0 | 0 |
| Resumen axe / aviso de plataforma | 0 | 0 | 18 + 18 | 0 |
| Total | 89 | 7 | 36 | 0 |

## Axe: fallos remotos y avisos

Los siete `axe_smoke/AXE_VIOLATIONS_PRESENT` corresponden a `label-content-name-mismatch`, impacto axe `serious`, con nueve apariciones: cuatro enlaces `bento_discovery/bento_discovery_link` y cinco botones `main_product/sticky_add_button`, todos en documento principal, región main, dentro de sección Shopify y con aria-label. No son nueve nodos DOM únicos ni P1 confirmado.

| Scan remoto fallido | Ancho | Apariciones |
|---|---|---|
| Sartorial, producto | 390 / 1280 | 1 en cada scan |
| Imprint, home | 390 / 1280 | 2 en cada scan |
| Imprint, producto | 390 / 1280 | 1 en cada scan |
| Archive, producto | 1280 | 1 |

El filtro local exacto de barra de preview produjo 18 checks `axe_platform_warning=observed/SHOPIFY_PREVIEW_BAR_WARNING_ONLY`, una aparición por scan, 18 en total. No se presenta ese aviso de plataforma como fallo del tema; tampoco se amplía el filtro a otras familias. Los 18 resúmenes axe son observaciones pendientes de revisión de fuente.

Incompletos no confirmados: `aria-valid-attr-value/critical`, dos scans y ocho apariciones; `color-contrast/serious`, 18 scans y 147 apariciones. Son estados que requieren revisión, no violaciones confirmadas ni prioridades P0/P1 por sí solos. La ausencia de correspondencia demostrada con el parche servido impide concluir por qué persisten los hallazgos remotos.

## Routing, contextos y carrito

| Preview / ID | Bloqueos | Contexto cerrado | `routeOperationFailed` | Eventos / omitidos | Carrito tocado / mutaciones permitidas |
|---|---|---|---|---|---|
| Sartorial / `190232297715` | 249 | `true` | `true` | 5 / 0 | `false` / `false` |
| Imprint / `190232330483` | 257 | `true` | `true` | 1 / 0 | `false` / `false` |
| Archive / `190232363251` | 216 | `true` | `true` | 2 / 0 | `false` / `false` |
| Total | 722 | Tres cerrados | Coherentes con eventos | 8 / 0 | `--cart` no ejecutado |

Todos los eventos son `stage=fetch`, `method=GET`: tres `HARNESS_OPERATION_FAILED` en `/cart` del host de tienda, `pageKind=home`, uno por preset; cinco `PLAYWRIGHT_TIMEOUT` en `cdn.shopify.com`. Estos últimos usan el prefijo sin query `/shopifycloud/shop-js/modules/v2/`: Sartorial registra `chunk.useEventListener_UUODl-9x.esm.js` y `chunk.validators_09U1U9sZ.esm.js` una vez cada uno en home y producto; Archive registra `chunk.utils_DaVKdWdI.esm.js` una vez en producto. Las banderas son coherentes con este snapshot y no explican por sí solas los fallos axe.

Los avisos suman los 722 bloqueos: `error-analytics-sessions-production.shopifysvc.com` 19, `js.hcaptcha.com` 11, `monorail-edge.shopifysvc.com` 46, `otlp-http-production.shopifysvc.com` 149, `shopify-assets.shopifycdn.com` 2 y mutaciones same-origin bloqueadas 495. Registrar el host no demuestra necesidad ni causalidad; su aparición no autoriza ampliarlo ni vincula hCaptcha o telemetry con un check fallido.

## Estado pendiente

La verificación post-fix única tuvo autorización separada de las cinco corridas diagnósticas ya consumidas y no se reintentó. No hubo `--cart`; B-03/B-04 siguen sin probar, C-R0-4 pendiente de Johandry y R-A/R-B/Lote 0 abiertos. Lote C no iniciado. La evidencia remota no acredita el parche local desplegado, por lo que no se declara fallo del parche local, cierre ni certificación. Mantener preflight sin valores, solo previews no publicadas y revisión independiente por cambio.
