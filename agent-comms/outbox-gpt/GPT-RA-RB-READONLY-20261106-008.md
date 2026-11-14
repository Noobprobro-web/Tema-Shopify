# GPT-RA-RB-READONLY-20261106-008

ID: GPT-RA-RB-READONLY-20261106-008

Estado: quinta y última corrida diagnóstica autorizada, `read-only`, exit 1, `executionResult=failed`, `scopeResult=failed`. Cinco intentos consumidos; R-A/R-B y Lote 0 abiertos, Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: revisar las familias de hallazgos sin inferir fuente exacta, prioridad o causalidad no demostradas. Este informe no habilita otra corrida ni autoriza ampliar hosts o modificar filtros/código.

Resumen en 5 líneas:
1. Preflight aprobado: dos variables `SET` sin valores, snapshot revisado confirmado y tres IDs no publicados por Shopify CLI exit 0.
2. Una corrida sin reintentos: 114 checks = 78 `passed`, 18 `failed`, 18 `observed`, cero `not_run`.
3. Axe distingue 18 iframes de la barra de preview Shopify y diez apariciones de controles: cuatro enlaces bento y seis botones sticky.
4. Routing final coherente: banderas `true`, eventos 11/3/1 sin omitidos; tres contextos cerrados y carrito sin tocar.
5. Hubo 697 bloqueos sin prueba de necesidad causal; no se sustenta un P0/P1 nuevo confirmado y no se inicia Lote C.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Desviaciones: ninguna. Hallazgos fuera de alcance con parche: ninguno acreditado por este análisis documental.

Verificación: se documentan la corrida autorizada y la lectura local de su JSON ya realizadas. Esta tarea no repitió pruebas, comprobó credenciales ni accedió a tienda; no cambia código, D28, JSON, commits, push ni filas del ledger.

## Preflight y resultado

Justo antes se verificaron únicamente `STOREFRONT_PASSWORD=SET` y `SHOPIFY_CLI_THEME_TOKEN=SET`, sin valores. El SHA-256 del harness coincidió con el snapshot revisado `F00EAF84F7BB3E488E348C1D3AEC452CD2B35ABA1C826FC5BC225D34BE9C0CB8`. Shopify CLI `theme list --role unpublished` terminó exit 0 y confirmó `190232297715`, `190232330483`, `190232363251`.

Fuente: [JSON completo](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T055258474Z-433b57c5-56bd-4eb6-9f4a-404ca912a5a7.json), iniciado a `2026-11-06T05:52:58.475Z` y finalizado a `2026-11-06T05:54:08.677Z`.

| Grupo | `passed` | `failed` | `observed` | `not_run` |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Página / teclado / overflow | 18 + 18 + 18 | 0 | 0 | 0 |
| Menú / drawer vacío / idioma visible | 9 + 6 + 6 | 0 | 0 | 0 |
| Axe smoke y resumen | 0 | 18 | 18 | 0 |
| Total | 78 | 18 | 18 | 0 |

Los 18 fallos son `axe_smoke/AXE_VIOLATIONS_PRESENT` y los resúmenes `observed/AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`. Los pases son aserciones del arnés; no aceptan R-A/R-B completas ni certifican accesibilidad o Theme Store.

## Axe: familias observadas y límites

| Regla | Impacto axe | Scans | Apariciones / metadata exacta |
|---|---|---|---|
| `frame-title` | `serious` | 18 | 18 `iframe`, `main_document`, título ausente, `iframeSourceCategory=shopify_cdn`, `iframeSourceFamily=shopify_preview_bar`, `sectionFamily=other_or_none`, `controlFamily=other`, región `other_or_none`, `withinShopifySection=false`. |
| `label-content-name-mismatch` | `serious` | 8 | 4 `a` con `sectionFamily=bento_discovery`, `controlFamily=bento_discovery_link`; 6 `button` con `sectionFamily=main_product`, `controlFamily=sticky_add_button`. Todos `main_document`, región `main`, `withinShopifySection=true`, `hasAriaLabel=true`; familias de iframe `unset`. |

La familia fija `shopify_preview_bar` clasifica los iframes como origen externo/de plataforma Shopify conforme al predicado de CDN y familia de ruta revisado; no es un asset del tema identificado. No conserva la URL ni identifica un frame concreto. Las familias de controles derivan de coincidencias locales en memoria; no guardan selectores/clases/IDs y no demuestran por sí solas un archivo:línea, autoría exacta o equivalencia entre repo y despliegue. No se atribuyen los hallazgos a un host bloqueado.

Hay cero nodos omitidos y ningún unresolved en las violaciones emitidas; los códigos diagnósticos son `null`. Las diez apariciones de controles se repiten entre scans, por lo que no son diez nodos DOM únicos. El impacto axe `serious` no equivale a P1 confirmado del proyecto.

Los estados **incompletos**, sin confirmación de violación, son `aria-valid-attr-value/critical` en dos scans y ocho apariciones, y `color-contrast/serious` en 18 scans y 145 apariciones. Requieren revisión; tampoco sustentan por sí solos P0/P1. No se guardan HTML, texto, valores de atributos/formularios, URLs completas, cookies o credenciales.

## Routing y sesiones

| Preview / ID | Bloqueos | Contexto cerrado | `routeOperationFailed` | Eventos / omitidos | Carrito tocado / mutaciones permitidas |
|---|---|---|---|---|---|
| Sartorial / `190232297715` | 237 | `true` | `true` | 11 / 0 | `false` / `false` |
| Imprint / `190232330483` | 237 | `true` | `true` | 3 / 0 | `false` / `false` |
| Archive / `190232363251` | 223 | `true` | `true` | 1 / 0 | `false` / `false` |
| Total | 697 | Tres cerrados | Coherentes con eventos | 15 / 0 | `--cart` no ejecutado |

Los 15 eventos registran `stage=fetch`, `method=GET`: tres `HARNESS_OPERATION_FAILED` en el host de tienda para `/cart`, `pageKind=home`, uno por preset; y 12 `PLAYWRIGHT_TIMEOUT` en `cdn.shopify.com`. Los siguientes basenames CDN se añaden al prefijo exacto `/shopifycloud/shop-js/modules/v2/`, sin query:

| Basename | Contexto registrado | Sartorial / Imprint / Archive |
|---|---|---|
| `chunk.Button_XvIkyY1l.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.colors_CaG6LKvC.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.context_IZTYG4gY.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.ShopIcon_CwQcMTOb.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.ShopLogin_BDL3tvey.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.utils_DaVKdWdI.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.validators_09U1U9sZ.esm.js` | `home` | 2 / 0 / 0 |
| `chunk.windoid_B8u1tqUt.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.zoom_DPO8oG6U.esm.js` | `home` | 1 / 0 / 0 |
| `chunk.useEventListener_UUODl-9x.esm.js` | `product` | 0 / 1 / 0 |
| `chunk.validators_09U1U9sZ.esm.js` | `product` | 0 / 1 / 0 |

Las banderas finales y los eventos son coherentes en este snapshot; eso no certifica todas las condiciones posibles del arnés ni reescribe corridas anteriores. Los requests de tienda/CDN ya estaban permitidos; los errores genéricos y timeouts no prueban por sí solos un defecto del tema o una relación con axe.

## Avisos y continuación

Los 697 bloqueos se distribuyen en avisos de `error-analytics-sessions-production.shopifysvc.com` 19, `js.hcaptcha.com` 11, `monorail-edge.shopifysvc.com` 25, `otlp-http-production.shopifysvc.com` 149, `shopify-assets.shopifycdn.com` 2 y mutaciones same-origin bloqueadas 491. Un host registrado no demuestra necesidad ni causalidad, y su aparición no lo autoriza. No se vinculan hCaptcha, telemetry u otros avisos con los hallazgos axe sin evidencia adicional.

Los cinco intentos diagnósticos autorizados quedaron consumidos; no se lanza otro bajo esta autorización. No hubo reintento ni modo `--cart`. R-A/R-B y Lote 0 permanecen abiertos; B-03/B-04 siguen sin probar, C-R0-4 pendiente de Johandry y Lote C no iniciado. La evidencia no sustenta un P0/P1 nuevo confirmado. Mantener preflight sin valores, solo previews no publicadas, revisión independiente por cambio y demás reglas vigentes.
