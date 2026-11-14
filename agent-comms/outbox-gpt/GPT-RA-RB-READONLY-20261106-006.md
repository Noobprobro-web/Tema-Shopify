# GPT-RA-RB-READONLY-20261106-006

ID: GPT-RA-RB-READONLY-20261106-006

Estado: evidencia parcial `read-only`, `scopeResult=failed`, exit 1. R-A/R-B y Lote 0 abiertos; Lote C no iniciado. Revisión documental independiente pendiente.

Decisión requerida: revisar el origen de los hallazgos axe y la discrepancia de routing antes de atribuir defectos o prioridades. La evidencia no sustenta un P0/P1 nuevo ni la necesidad causal de un host bloqueado.

Resumen en 5 líneas:
1. Preflight inmediato aprobado: ambas variables `SET` sin valores, snapshot revisado confirmado y tres IDs no publicados por Shopify CLI exit 0.
2. Una corrida sin reintentos: 114 checks = 78 `passed`, 18 `failed`, 18 `observed`, cero `not_run`.
3. Axe registra iframes sin título de categoría CDN y enlaces/botones con aria-label en el contenido principal, sin identidad de recurso o fuente de repo.
4. Tres contextos cerrados y carrito sin tocar; 32 eventos de routing, con bandera `false` de Sartorial pese a sus seis eventos.
5. Hubo 725 bloqueos; el registro de host/path no demuestra necesidad ni causalidad respecto de un check fallido.

Archivos tocados: este informe y `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`. Desviaciones: ninguna. Hallazgos fuera de alcance con parche: ninguno acreditado.

Verificación: se documentan la corrida autorizada y la lectura local de su JSON ya realizadas. Esta tarea no repitió pruebas, comprobó credenciales ni ejecutó tienda o Gate; no cambia código, D28, JSON, commits, push ni filas del ledger.

## Preflight y resultado

Inmediatamente antes se verificaron solo `STOREFRONT_PASSWORD=SET` y `SHOPIFY_CLI_THEME_TOKEN=SET`, sin mostrar valores. El snapshot SHA-256 `0DFB03EE19BEFB0140BAA34906120EE7D29E45885EAA40750FBDB209B58FBF99` coincidió con el revisado. Shopify CLI `theme list --role unpublished` terminó exit 0 y confirmó `190232297715`, `190232330483`, `190232363251`.

Fuente: [JSON completo](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T053144224Z-9f4328f7-ac4d-42c0-b0a1-ff6e3473b869.json), iniciado a `2026-11-06T05:31:44.225Z` y finalizado a `2026-11-06T05:32:56.881Z`.

| Grupo | `passed` | `failed` | `observed` | `not_run` |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Página / teclado / overflow | 18 + 18 + 18 | 0 | 0 | 0 |
| Menú / drawer vacío / idioma visible | 9 + 6 + 6 | 0 | 0 | 0 |
| Axe smoke y resumen | 0 | 18 | 18 | 0 |
| Total | 78 | 18 | 18 | 0 |

Los fallos son `axe_smoke/AXE_VIOLATIONS_PRESENT`; los resúmenes son `observed/AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`. Los pases describen las aserciones del arnés, sin aceptación completa R-A/R-B ni certificación de accesibilidad/Theme Store.

## Axe y metadata segura

| Clase / regla | Impacto axe | Scans | Apariciones / metadata |
|---|---|---|---|
| Violación `frame-title` | `serious` | 18 | 18 `iframe`; `main_document`, `iframeTitlePresent=false`, `iframeSourceCategory=shopify_cdn`, `themeSectionAncestor=other_or_none`. |
| Violación `label-content-name-mismatch` | `serious` | 7 | 9 apariciones: 4 `a`, 5 `button`; `main_document`, ancestro `main`, `hasAriaLabel=true`. |
| Incompleto `aria-valid-attr-value` | `critical` | 2 | 8 `button`; `main_document`, ancestro `main`, `hasAriaLabel=true`. |
| Incompleto `color-contrast` | `serious` | 18 | 143 apariciones, todas `main_document`: 38 `a`, 12 `button`, 2 `h1`, 3 `other`, 11 `p`, 12 `select`, 65 `span`; ancestros header/main/other. |

No hay nodos omitidos ni unresolved en la evidencia emitida; los códigos diagnósticos son `null`. Son apariciones repetidas entre scans, no nodos DOM únicos. La categoría `shopify_cdn` no identifica el frame concreto ni demuestra si pertenece al tema, plataforma, preview o un tercero. El impacto `serious`/`critical` de axe no confirma prioridad P1 del proyecto; los estados incompletos requieren revisión y no equivalen a violaciones confirmadas.

No se guardan selectores, HTML, texto, valores de atributos/formularios, URLs completas, cookies o credenciales. La metadata permite ubicar categorías generales y no identificar todavía un archivo:línea del repo o preparar un parche con fuente confirmada.

## Sesiones y eventos de routing

| Preview / ID | Bloqueos | Contexto cerrado | `routeOperationFailed` | Eventos / omitidos | Carrito tocado / mutaciones permitidas |
|---|---|---|---|---|---|
| Sartorial / `190232297715` | 259 | `true` | `false` | 6 / 0 | `false` / `false` |
| Imprint / `190232330483` | 249 | `true` | `true` | 18 / 0 | `false` / `false` |
| Archive / `190232363251` | 217 | `true` | `true` | 8 / 0 | `false` / `false` |
| Total | 725 | Tres cerrados | Discrepancia en Sartorial | 32 / 0 | `--cart` no ejecutado |

Sartorial tiene seis eventos aunque su bandera es `false`. No se interpreta esa bandera como ausencia de fallos ni se atribuye un mecanismo temporal/de serialización sin revisión. Todos los eventos registran `stage=fetch`, `pageKind=home`, `method=GET`; los códigos son 5 `HARNESS_OPERATION_FAILED` y 27 `PLAYWRIGHT_TIMEOUT`. `pageKind` es el contexto registrado, no una prueba de causa del error.

Host de tienda `tema-qkqpke0j.myshopify.com`, código `HARNESS_OPERATION_FAILED`; conteos Sartorial / Imprint / Archive:

| Path sin query | S / I / A |
|---|---|
| `/cart` | 1 / 1 / 1 |
| `/web-pixels@b8a4071cw5df52f02p06561c06md4694b52/custom/web-pixel-shopify-custom-pixel@0530/sandbox/modern/` | 1 / 0 / 0 |
| `/web-pixels@b8a4071cw5df52f02p06561c06md4694b52/web-pixel-shopify-app-pixel@0530/sandbox/worker.modern.js` | 1 / 0 / 0 |

Host `cdn.shopify.com`, código `PLAYWRIGHT_TIMEOUT`. Cada basename de la tabla se añade al prefijo exacto `/shopifycloud/shop-js/modules/v2/`, sin query:

| Basename | S / I / A |
|---|---|
| `chunk.Button_XvIkyY1l.esm.js` | 1 / 2 / 0 |
| `chunk.colors_CaG6LKvC.esm.js` | 0 / 2 / 1 |
| `chunk.context_IZTYG4gY.esm.js` | 0 / 2 / 1 |
| `chunk.css_BSSuWG3y.esm.js` | 0 / 2 / 1 |
| `chunk.debounce_C-IIq26m.esm.js` | 1 / 2 / 1 |
| `chunk.ShopLogin_BDL3tvey.esm.js` | 0 / 1 / 0 |
| `chunk.useEventListener_UUODl-9x.esm.js` | 0 / 1 / 0 |
| `chunk.utils_DaVKdWdI.esm.js` | 1 / 1 / 0 |
| `chunk.validators_09U1U9sZ.esm.js` | 0 / 2 / 0 |
| `chunk.windoid_B8u1tqUt.esm.js` | 0 / 1 / 0 |
| `chunk.zoom_DPO8oG6U.esm.js` | 0 / 1 / 0 |
| `chunk.ShopIcon_CwQcMTOb.esm.js` | 0 / 0 / 1 |

Archive añade un evento para cada path CDN `/shopifycloud/preview-bar/assets/theme-admin-next.css` y `/static/fonts/shopifyinter/v0/styles.css`. Son hosts ya permitidos; los timeouts no son bloqueos de host y no acreditan por sí solos un defecto funcional del tema.

## Hosts bloqueados y límites

Avisos agregados: `error-analytics-sessions-production.shopifysvc.com` 21, `js.hcaptcha.com` 10, `monorail-edge.shopifysvc.com` 34, `otlp-http-production.shopifysvc.com` 153 y mutaciones same-origin bloqueadas 507; suman los 725 bloqueos. No se registró aviso de `shopify-assets.shopifycdn.com` en esta corrida; su aparición anterior no se reutiliza como prueba de la actual.

Registrar un host o path no demuestra que sea necesario ni que cause un check fallido. No se atribuyen los hallazgos axe a hCaptcha, a los avisos o a los timeouts sin evidencia adicional. Las categorías y códigos actuales no sustentan un P0/P1 nuevo confirmado ni autorizan ampliar hosts o cambiar el tema.

R-A/R-B y Lote 0 permanecen abiertos; B-03/B-04 y `--cart` siguen sin probar, C-R0-4 pendiente de Johandry y Lote C no iniciado. Mantener preflight sin valores, solo previews no publicadas, revisión independiente por cambio y demás reglas vigentes. No hubo reintento de esta corrida ni nuevas pruebas en esta tarea documental.
