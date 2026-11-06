# GPT-RA-RB-READONLY-20261106-004

ID: GPT-RA-RB-READONLY-20261106-004

Estado: corrida parcial `read-only`, `scopeResult=failed`; 18 fallos axe pendientes de revisión de nodos/origen. Lote 0 y R-A/R-B abiertos; no avanzar a Lote C.

Decisión requerida: revisar los nodos y el origen de los hallazgos axe antes de atribuirlos al tema, priorizarlos o proponer correcciones. El impacto `serious` de axe no confirma por sí solo un P1 del proyecto.

Resumen en 5 líneas:
1. La corrida produjo 114 checks: 78 `passed`, 18 `failed`, 18 `observed` y cero `not_run`.
2. Pasaron acceso/identidad, página, teclado, overflow horizontal, menú, drawer vacío e idioma visible dentro de las aserciones del arnés.
3. Los 18 `axe_smoke` fallaron; sus resúmenes observados registran `frame-title` en 18 scans y `label-content-name-mismatch` en siete.
4. Se bloquearon 701 solicitudes; hCaptcha tiene 3/4/4 ocurrencias sin vínculo acreditado con un check o página fallida.
5. Los tres contextos cerraron; `--cart` no se ejecutó y no hubo mutaciones de carrito, por lo que B-03/B-04 siguen pendientes.

Archivos tocados:
- `agent-comms/outbox-gpt/GPT-RA-RB-READONLY-20261106-004.md`.
- `agent-comms/outbox-claude/CLAUDE-CLOUD-STATUS.md`.

Desviaciones (Nivel 1 o Nivel 2): ninguna; documentación de un artefacto existente, sin cambios de código o tienda.

Hallazgos extra fuera de alcance (con parche listo): ninguno acreditado; no se propone un parche del tema sin revisar los nodos.

Verificación: lectura local del [JSON examinado](./harness-GPT-RA-RB-001/results/RA-RB-read-only-20261106T050717175Z-fbbef87d-ebf1-4c92-82b9-e89c8e6deb70.json), agrupación de checks y selección de reglas/resúmenes de axe, sesiones y avisos seguros. Exit 0. El coordinador comunicó una revisión independiente de los resúmenes axe que coincide con las reglas detalladas aquí. Esta tarea documental no ejecutó el arnés, Gate, Shopify ni comprobaciones de credenciales; no modificó código ni JSON. No cierra filas del requirements ledger.

Lista de afirmaciones falsables:
1. `mode=read-only`, `scopeResult=failed`; 114 checks = 78 `passed`, 18 `failed`, 18 `observed`, cero `not_run`.
2. Los 18 `page_access`, 18 `keyboard_tab_smoke`, 18 `horizontal_overflow`, 9 `menu_viewport_cross`, 6 `empty_cart_drawer_keyboard_state` y 6 `language_visible_name_match` están `passed`, junto a tres `storefront_access`.
3. Los 18 fallos son `axe_smoke/AXE_VIOLATIONS_PRESENT`; los 18 `axe_rule_summary` son `observed/AUTOMATED_SCAN_REQUIRES_SOURCE_REVIEW`.
4. Cada scan registra `frame-title`, impacto `serious`, `nodeCount=1`; siete scans también registran `label-content-name-mismatch/serious` según la tabla.
5. Las tres sesiones tienen `contextClosed=true`, `cartMutationsAllowed=false`, `cartTouched=false` y 248/233/220 bloqueos.
6. `routeOperationFailed=false` en Sartorial y `true` en Imprint/Archive; el artefacto no identifica aquí una causa de esas banderas.

## Alcance y comprobaciones

Fuente: `RA-RB-read-only-20261106T050717175Z-fbbef87d-ebf1-4c92-82b9-e89c8e6deb70`, iniciada a `2026-11-06T05:07:17.176Z` y finalizada a `2026-11-06T05:08:27.072Z`. Aplica la política revisada D28 de GET/HEAD a los tres hosts exactos autorizados; otros hosts y las mutaciones fuera del modo carrito quedan bloqueados como avisos. El JSON indica que la comprobación de temas no publicados es externa al arnés y corresponde al coordinador; no se sustituye esa precondición por un check interno.

| Grupo | Aprobados | Fallidos | Observados | No ejecutados |
|---|---|---|---|---|
| Acceso/autenticación e identidad | 3 | 0 | 0 | 0 |
| Acceso a páginas | 18 | 0 | 0 | 0 |
| Teclado | 18 | 0 | 0 | 0 |
| Overflow horizontal | 18 | 0 | 0 | 0 |
| Cruce de viewport del menú | 9 | 0 | 0 | 0 |
| Teclado de drawer vacío | 6 | 0 | 0 | 0 |
| Nombre visible de idioma | 6 | 0 | 0 | 0 |
| Axe smoke / resumen de reglas | 0 | 18 | 18 | 0 |
| Total | 78 | 18 | 18 | 0 |

Estos pases describen las aserciones del arnés, sin certificar contraste visual, lector de pantalla, todas las matrices R-A/R-B ni Theme Store. Los casos de drawer vacío ahora se ejecutaron y pasaron; no equivalen a pruebas de mutación/reconciliación o nota de B-03/B-04.

## Axe: reglas y revisión pendiente

Todos los scans usan axe 4.10.2 y registran `frame-title`, impacto `serious`, un nodo por scan: home, colección y producto de cada preset en los dos anchos, 390×844 y 1280×800. El JSON permite identificar la regla, pero no conserva HTML, selector ni identidad del frame; no permite atribuirlo aún a tema, barra de preview o un tercero.

| `label-content-name-mismatch`, impacto `serious` | Scans afectados | `nodeCount` por scan |
|---|---|---|
| Sartorial, producto | 390 y 1280 | 1 en cada uno |
| Imprint, home | 390 y 1280 | 2 en cada uno |
| Imprint, producto | 1280 | 1 |
| Archive, producto | 390 y 1280 | 1 en cada uno |

Son siete apariciones de scan; no se suman sus contadores como nodos únicos entre páginas o viewports. `serious` es la clasificación de impacto de axe y no una prioridad P1 confirmada del proyecto. Los checks fallidos contienen el motivo agregado `AXE_VIOLATIONS_PRESENT`; las reglas se obtienen de sus resúmenes observados. Revisar los nodos/origen antes de decidir defecto, prioridad o parche.

## Avisos de red y sesiones

| Preview | ID | Solicitudes bloqueadas | Contexto cerrado | Mutaciones de carrito permitidas/tocadas |
|---|---|---|---|---|
| Sartorial | `190232297715` | 248 | `true` | `false/false` |
| Imprint | `190232330483` | 233 | `true` | `false/false` |
| Archive | `190232363251` | 220 | `true` | `false/false` |
| Total | — | 701 | Tres cerrados | Modo `--cart` no ejecutado |

Los avisos conservan los hosts `error-analytics-sessions-production.shopifysvc.com`, `js.hcaptcha.com`, `monorail-edge.shopifysvc.com` y `otlp-http-production.shopifysvc.com`, además de POST same-origin bloqueados por ser mutaciones. Los hosts de aviso no hacen fallar por sí solos una compuerta; los resultados funcionales se evalúan por sus aserciones. Las 3/4/4 ocurrencias de `js.hcaptcha.com` no tienen una asociación acreditada a check o página fallida; no se afirma que causen los hallazgos axe. Las banderas de operación de routing en Imprint/Archive requieren conservar su incertidumbre y tampoco establecen causalidad.

R-A/R-B y Lote 0 permanecen abiertos. B-03/B-04 y `--cart` siguen sin ejecutar, C-R0-4 pendiente de Johandry y no se avanza a Lote C. Mantener revisión independiente de cada cambio, preflight de credenciales sin mostrar valores y configuración autorizada, solo previews no publicadas, sin checkout/pago ni credenciales en archivos/logs; parar por falta/duda de credenciales, P0/P1 nuevo confirmado o cambio fuera del plan.
