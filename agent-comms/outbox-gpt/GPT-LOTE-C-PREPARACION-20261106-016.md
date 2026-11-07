# GPT-LOTE-C-PREPARACION-20261106-016

Estado: preparación documental; Lote 0 no cerrado. La secuencia formal del Lote C no ha empezado; H-1 es una tarea adelantada ya implementada/aceptada. Este informe no es una directiva ni autorización de tienda o implementación.

Fuentes: plan [V4.1](./GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md), matriz d28 transmitida por coordinación el 2026-11-06, D19/D23/D28 y evidencia enlazada en [STATUS](../outbox-claude/CLAUDE-CLOUD-STATUS.md). Revisión para evidencia de cierre D19: ACCEPTED; este informe sigue siendo preparación, no directiva, ejecución o aceptación completa del Lote C.

## Puerta de cierre Lote 0

| Condición D19 | Evidencia y pendiente |
|---|---|
| C-R0-1, ficha | Aceptación histórica de ficha disponible; contrastar con el candidato vigente en la revisión de cierre. No se presenta como recertificada aquí. |
| C-R0-2, ZIP reproducible y hash | Empaquetador y aceptación históricos disponibles. ZIP/hash del candidato actual pendientes de regenerar y revisar después de C-04-P/C-04-R; no trasladar el hash antiguo al candidato futuro. |
| C-R0-3, previews no publicadas | Los tres IDs tuvieron confirmaciones CLI previas. El último preflight falló dos veces: no confirma su estado actual ni demuestra publicación. Reconfirmar antes de cualquier prueba autorizada. |
| C-R0-4, fixture de suscripción | Preparado/marcado pendiente de Johandry. Puede quedar pendiente de forma expresa por D28; no crear productos, planes, apps ni metafields para suplirlo. |

D19 exige un revisor Opus nuevo de contexto limpio para el cierre formal. Opus no está disponible entre los agentes actuales: una revisión GPT puede ser auxiliar, pero no sustituye ese requisito. Johandry debe resolver la disponibilidad o modificar expresamente el requisito; mientras tanto no se declara cierre formal. C-R0-2 actualizado es dependencia del candidato final tras las decisiones de paquete/notas: no se supone completado ni se usa para declarar que la secuencia C ya comenzó.

El antiguo carrito Archive `T112804500Z` sigue desconocido tras 429 con disposición `LEAVE_TO_EXPIRE`, expresamente no bloqueante para Lote 0. La nueva sesión limpia no lo verificó, limpió ni acreditó caducado.

## Evidencia R-A/R-B y límites

Lectura `T112604093Z`: 132 checks totales = 96 aprobados, cero fallidos, 36 observados; 18 axe smoke aprobados, cero routing fatal y 25 avisos acotados. No equivale a 132 aserciones aprobadas. Cart smoke mínimo: Sartorial/Imprint aprobados en `T112804500Z`; nueva sesión Archive `T153117264Z`, 6/6, alta/nota y clear/update/read 200, vacío/nota vacía verificados y contexto cerrado. Véanse [informe 012](./GPT-RA-RB-CART-VERIFY-20261106-012.md) e [informe 014](./GPT-RA-RB-ARCHIVE-RETRY-20261106-014.md).

El intento final de lectura quedó en preflight: ambas variables secretas estaban SET sin valores, runner revisado; dos consultas humanas de temas no publicados terminaron exit 1, ningún ID confirmado. No se lanzó el harness ni hubo JSON o escritura nueva en tienda; no hay otra corrida posterior que subsane este límite. Véase [informe 015](./GPT-RA-RB-PREFLIGHT-20261106-015.md).

| Matriz pendiente | Cobertura que aún falta; no sustituida por smoke |
|---|---|
| R-A / A-03 | Contraste por esquemas, fondos, estados y reduce-motion. |
| R-A / A-02 | Configuraciones controladas y valores respaldados, incluidos circa_year/gsm; aprobación de settings/datos por Johandry. |
| R-A / C-08 | Claims, ausencias y destinos con verdad/fuentes aprobadas; no inventar respaldo. |
| R-B / B-01 | Matrices de editor/menú y carrito desde menú. |
| R-B / B-02 | Sin JS, A→B, disponibilidad y URL. |
| R-B / B-03 | Respuesta perdida y reconciliación; variantes, featured, quick-add, sticky, complete-the-look, min/step, múltiples líneas y planes. No está autorizado cart/change para cantidad/borrado. |
| R-B / B-04 | Nota limpia/sucia/oculta; pending, ediciones, HTTP/JSON/echo, timeouts, concurrencia y último artículo; checkout nativo no se envía. |
| R-B / B-05 | Cambio real de idioma pendiente: POST localization no autorizado; comprobar requisito de axe/versión, sin afirmar que el smoke lo satisface. |

R-A/R-B completos y su aceptación independiente continúan pendientes. Checkout/pago no están certificados ni se ejecutan. Estas carencias no se ocultan por el pase del smoke ni por LEAVE_TO_EXPIRE.

## Secuencia C preparada, condicionada a Lote 0

Tras cierre/decisión formal de Lote 0 y antes de escribir: directiva y revisión prospectiva R-D, lista cerrada de archivos, criterios/evidencia y decisiones necesarias. La reconfirmación de previews y el preflight de presencia sin valores son obligatorios antes de tienda; duda de credenciales detiene. No se inicia trabajo dependiente con permisos/contratos sin resolver.

| Tarea del plan | Preparación y condición para iniciar |
|---|---|
| C-01 | Jerarquía de sección/controles de colección móvil: baseline de viewport útil, rutas cerradas en R-D; regresión de filtros, teclado y vacío. Después de Lote 0/R-D. |
| C-02 | Instalación del ZIP en tienda de desarrollo limpia y comparación raíz/listing por preset. Johandry crea/autoriza la tienda y decide resultado canónico; pendiente. |
| C-03 | Perfilado; intervención CSS/JS solo si G2 por preset o build final falla umbral vigente y hay diagnóstico causal. Si cumple, diferir documentadamente. No activar por hipótesis. |
| C-04 | Soporte/documentación y destinos veraces: titularidad, canales, URLs, instrucciones y claims aprobados por Johandry. Sin mensajes de prueba ni publicación implícitos. |
| C-04-P | Destino del contenido vendedor/plantillas y alcance de retirada del paquete según decisión explícita/D23; preservar repo. Inspeccionar ZIP y claim de presets. Confirmar el contrato antes de aplicar. |
| C-04-N | Nomenclatura y copy acotados del plan; confirmar decisiones adicionales, incluido Haute Couture, y permisos de tienda/web. Sin renombrado técnico o histórico masivo. |
| C-04-R | Borrador de notas: retiro de lecturas de metafields y carga manual; Johandry decide versión/política. Versión/notas dentro del ZIP final y reconstrucción/hash después. |
| C-04-P3 | Redacción de medición histórica con límites y fuente acreditada; conservar cifras/estados y no certificar por cambiar texto. |
| C-04-N-P3 | Solo comentarios CSS obsoletos en lista cerrada/base vigente; sin cambios ejecutables. |
| C-05 | Inspección de schemas/contextos válidos y H1 en siete secciones del plan; propuesta antes de restricción, seguida de editor/instalación autorizados. |
| C-06 | Reproducir contrato real de shopify-account en entorno/cuentas acreditados; distinguir hipótesis de defecto, y estimar arreglo solo tras diagnóstico. |
| C-07 | Fixtures autorizados por Johandry y estrategia oficial contrastada: 1, 250 y 251+ variantes en PDP/featured; conservar guards, no truncar arbitrariamente. |
| H-1 | Excepción histórica adelantada: implementada/aceptada; prueba integral de contraste sigue en R-A. No significa inicio de la secuencia formal C. |

## Dependencias preparadas de Johandry

- A-01/C-R0-4: fixture de selling plan/suscripción autorizado; pendiente, sin creación autónoma.
- A-02: aprobación de settings, contenido factual y valores respaldados, incluidos circa_year/gsm.
- C-08: verdad/fuentes de claims y destinos aprobados; nunca suplir con promesas sin respaldo.
- B-05: decisión expresa de alcance del endpoint POST de localización antes de cambio real de idioma.
- C-02: tienda de desarrollo limpia, permisos y resultado canónico por preset.
- C-07: fixtures de variantes autorizados y entorno correspondiente. La decisión sin JavaScript que figuraba pendiente en el borrador quedó resuelta por Johandry el 2026-11-06: enlaces GET con `option_values` para más de 250 variantes.
- C-04-P/N/R: destino del contenido/paquete, nomenclatura adicional (Haute Couture) y versión/notas. Lo ya decidido se conserva; las ampliaciones requieren resolución.
- R-D / G2 Lighthouse: este punto describe el snapshot anterior; las 18 mediciones posteriores y sus límites constan en el addendum vigente al final. El umbral acordado por Johandry es móvil <70 como riesgo con propuesta de mejora dentro del plan.
- D19: resolver revisor Opus de contexto limpio o cambio explícito del requisito. GPT solo ofrece apoyo auxiliar hasta esa resolución.

No se ejecutaron pruebas ni tienda, no se editó código/D28, no se reconstruyó ZIP y no hubo commit/push en esta tarea. Solo preparación documental y enlace en STATUS; no cierre de Lote 0 ni inicio formal de C.

## Addendum de prevalencia — 2026-11-06

El cuerpo anterior conserva el estado de su snapshot y los hechos de las pruebas que allí se citaron. Sus afirmaciones «Lote 0 no cerrado», «preflight fallido sin corrida posterior» y «bloqueo por falta de Opus» quedaron superadas por la decisión de Johandry del 2026-11-06 y por la revisión independiente `CLAUDE-REVIEW-LOTE-0-CIERRE-001`: Lote 0 está cerrado solo en alcance D19 con condiciones trasladables. El preflight elevado posterior confirmó como `unpublished` las tres previews autorizadas. La corrida `T181805513Z`, que era la posterior al preflight de ese snapshot, sí ocurrió, no mutó el carrito y falló en el scope por `HARNESS_OPERATION_FAILED` en un GET del runtime Shopify; luego hubo lecturas adicionales y la `T190050695Z` acabó `completed_with_limits`. R-A/R-B completas y su aceptación siguen pendientes. T-2 Sartorial sigue `UNKNOWN`; las lecturas nuevas están autorizadas, pero no se debe mutar ni limpiar ese contexto. El cierre D19 no inicia ni certifica R-D/G2, R-Demo o las tareas C/D.

Este addendum no altera el resultado ni la evidencia histórica de los intentos anteriores. Para el estado actual prevalecen `CLAUDE-CLOUD-STATUS.md`, `docs/decisions.md` y el informe final más reciente de `outbox-gpt`.

## Addendum de revisión y preparación local — 2026-11-06

- **R-C / C-04-P3:** el ledger mantiene estado y cifras históricas, pero ahora precisa que CLS 0.022/0.003/0.001 son valores conservados en el ledger sin fuente confirmada aquí. El informe citado documenta una corrida contra el proxy local `http://127.0.0.1:9292`, con CLS global 0.1519 y resultados por plantilla distintos; no corrobora tienda real ni esos tres valores. La corrección documental fue aceptada independientemente en SHA-256 `EBB826D3EDFD4936942964B2E314508B77AE9F5E56E82B167C70391A42BCDF4A`.
- **C-04-P:** la implementación local excluye exactamente `templates/page.documentation.json` y `templates/page.support.json` del ZIP mediante `scripts/package-theme-zip.mjs`; ambas plantillas y las secciones quedan en el repo. El candidato de `2fed90b195122ae32d79283f0e757b05e0140148` se generó dos veces: 93 archivos, SHA-256 `b62d6b82f1b368a0570a9ba869a5bd82ff8a47737ca98797ac15ccb0d97f643b`, huella de contenido `158664dba1967b6a1adf9bec6db882a391f0d771dafc622b64765f3845f3a33d`. El ZIP no contiene las dos plantillas, sí contiene `release-notes.md`, y no contiene las dos afirmaciones de preset retiradas; Theme Check del ZIP extraído inspeccionó 89 archivos sin offenses. La revisión independiente aceptó C-04-P para este ZIP candidato y C-04-R como borrador; verificó ambos ZIP, su extracción exacta y Theme Check, sin aprobar instalación ni versión.
- **C-04-R:** `release-notes.md` conserva `1.1.0` como propuesta; metadata del tema queda en `1.0.0` hasta que Johandry apruebe versión y notas. La inspección independiente del candidato fue aceptada como borrador; versión y notas siguen pendientes de Johandry.
- **C-04 soporte:** titularidad, endpoint Formspree, SLA de 24 horas laborables y canales no tienen aprobación acreditada; siguen marcados para Johandry. No se considera G3 aceptado ni publicación autorizada.
- **C-04-N/N-P3:** corrección local de nomenclatura en docs de merchant y solo dos comentarios CSS; el reviewer R-C aceptó los diffs locales en su snapshot, sin certificar coherencia de las páginas publicadas.
- **C-05:** inventario estático de `main-page`, `main-documentation`, `main-support`, `main-about`, `main-policy`, `main-faq` y `main-contact`: cada sección define un H1 y al menos un preset, no declara `enabled_on`/`disabled_on`, y cada una aparece en su plantilla `page*.json` homónima. Propuesta para revisión: restringirlas a plantillas del tipo `page`, no a templates alternos específicos, porque Shopify define `enabled_on.templates` por tipos de página. Esa restricción no garantiza por sí sola que un comerciante no agregue otra sección con H1 a una plantilla `page`; se debe validar editor e instalación y la jerarquía resultante antes de modificar schemas. No se aplicó restricción ni se afirma defecto de editor. Fuente: [Section schema de Shopify](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema), [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates).
- **C-06:** hipótesis registrada en `sections/header.liquid:191`: el setting `link_list` entrega objeto `linklist` o blank, mientras `<shopify-account menu>` espera string. No se reemplaza por `.handle` sin reproducción con cuentas acreditadas. Fuentes: [Shopify Account component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-account), [link_list setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings).
- **C-07:** `main-product.liquid:727` y `featured-product.liquid:477` recorren `product.variants`; Shopify documenta el límite de 250 variantes accesibles en Liquid y cuenta total separada. La conducta para 251+ y la solución quedan pendientes de fixtures autorizados y verificación en tienda; no se crea producto ni metafield. Fuentes: [high-variant products](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products), [Liquid product object](https://shopify.dev/docs/api/liquid/objects/product).
- **C-01/C-03 y C-02/C-07/R-Demo:** siguen sin cierre funcional. C-01 requiere baseline de viewport útil/primera tarjeta y regresiones de filtros, teclado y vacío; no depende de Lighthouse. En C-03 se midieron 18 celdas Lighthouse, pero G2 y su diagnóstico siguen sin aceptación por los fallos y límites detallados en el addendum siguiente. C-02, fixtures de suscripción/variantes, importación y revisión R-Demo requieren tienda o decisiones de Johandry. R-Demo ocurre después de R-C, en el cierre D. Las lecturas R-A/R-B `T190050695Z` aportan axe/teclado smoke con límites, no certifican las matrices completas.
- **R-C global:** el revisor independiente rechazó la completitud porque faltaban baseline/regresión, editor/instalación, ZIP final y algunas dependencias de Johandry en su snapshot. La revisión posterior del ZIP candidato resolvió solo ese artefacto. Esos elementos permanecen delimitados arriba; el rechazo no se presenta como aceptación parcial global.

## Addendum vigente: Lighthouse en tres previews — 2026-11-06

El preflight elevado confirmó los tres IDs como `unpublished`, exit 0 y sin error de autenticación. Lighthouse 13.4.1 midió 18/18 celdas, una corrida por celda, con identidad verificada. El SHA-256 del runner usado en estas corridas y aceptado por revisión independiente era `ca483d17166bd02ff05b7fc88ba35624cb5ffa161b98851bfdeb882e669dbcbf`.

| Preset | Móvil home / colección / producto | Escritorio home / colección / producto | Accesibilidad Lighthouse |
|---|---|---|---|
| Sartorial | 88 / 83 / 82 | 100 / 100 / 100 | 97 en las seis |
| Imprint | 88 / 79 / 82 | 100 / 100 / 100 | 97 en las seis |
| Archive | 91 / 80 / 85 | 100 / 100 / 100 | 97 en las seis |

Cada JSON registra `executionResult=failed`: `/favicon.ico` devolvió HTTP 404 y `/services/login_with_shop/authorize` registró `CHROMIUM_ERR_ABORTED` en el dominio de tienda. Además, 17–18 eventos de fuentes ShopifySans/GTStandard en `cdn.shopify.com` llegaron con `responseErrorReason=Failed`; la causa es desconocida. Lighthouse 13.4.1 emitió en stderr en Imprint/Archive un `TypeError: Cannot read properties of undefined (reading 'url')` del trace processor; ese mensaje no figura en los JSON. Las métricas son observaciones diagnósticas bajo estas limitaciones, no baseline aceptada ni certificación. Ningún rendimiento móvil fue menor de 70. Las tres corridas verificaron identidad, cerraron contexto/navegador, no tocaron carrito ni checkout y registraron cero 429. Los bloqueos de analítica, pixels y Shop Pay se registraron como avisos; los hosts/rutas registrados carecen de query. El logger final registra solo el enum de esquema para `data:`, sin payload.

Evidencia: `harness-GPT-RD-001/results/lighthouse-20261107T013234.775Z-9a9d2760-fbeb-491f-9ddb-2281abdf3312.json` (Sartorial), `harness-GPT-RD-001/results/lighthouse-20261107T013738.441Z-01f87a97-a048-4fbb-a9b5-22dfe513fb0e.json` (Imprint), `harness-GPT-RD-001/results/lighthouse-20261107T014011.347Z-aa3310c1-4b23-4e91-9f49-989e478743c5.json` (Archive).

Cada uno de los tres JSON finales contiene una contradicción de autenticación: `previews[0].auth.result=not_run` coexiste con `previews[0].auth.auth.result=passed` y los status de autenticación 200/302/200. Ese campo contradictorio no sirve para probar el estado de autenticación. La identidad del tema se registra por separado en `previews[0].identityVerified=true` y en `results[*].identityVerified=true` para las seis celdas de cada corrida. Las puntuaciones siguen siendo observaciones de ejecuciones `failed`, no baseline aceptada. En cada JSON, `blockedHostAttention=true` y hay cinco entradas `unclassified_blocked_host` del host bloqueado `shopify-assets.shopifycdn.com`, con las rutas `/shopifycloud/admin-ui-foundations/experimental/2cff7.svg`, `/shopifycloud/admin-ui-foundations/experimental/c565d.svg`, `/shopifycloud/admin-ui-foundations/icons/10aef.svg`, `/shopifycloud/admin-ui-foundations/icons/5d254.svg` y `/shopifycloud/admin-ui-foundations/icons/bef77.svg`. No está demostrado si ese host es necesario para el tema; la allowlist no se amplió y queda pendiente determinar su necesidad.


R-C global permanece `INCOMPLETE`: faltan verificaciones en previews, fixtures, editor/instalación y decisiones de Johandry, además de G2 aceptado y diagnóstico causal. Las R-D prospectivas de C-01/C-05/C-07 fueron sustituidas por el dictamen trazable de Claude que se enlaza abajo. Los dictámenes no constituyen aceptación funcional. R-Demo es posterior a R-C y pertenece al cierre D. El ZIP candidato ya recibió aceptación independiente para C-04-P y C-04-R como borrador; no aprueba instalación ni versión.

## Propuestas locales C-01, C-05 y C-07 — 2026-11-06

Estas son propuestas para directiva y revisión; no representan implementación, aceptación ni prueba nueva en tienda.

### C-01: colección, viewport y regresión

En la misma preview, comparar antes/después el viewport útil y la posición de la primera tarjeta usando el mismo viewport en cada par. Las matrices 390×844 y 1280×800 pueden ejecutarse por separado; no se comparan viewports distintos como antes/después. La propuesta incluye verificar filtros, reset, estado vacío y navegación por teclado, incluida la tecla Escape y la devolución del foco. No fija un umbral cuantitativo ni crea fixtures; la decisión sobre criterios y la validación en preview siguen pendientes. C-01 conserva su baseline y regresión independientes de Lighthouse.

#### C-01 — borrador de directiva para R-D

**R-D de Claude Opus 5.5: APROBADA CON CONDICIONES.** [Dictamen completo, §1](../outbox-claude/CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001.md), sobre `258ca4f59910ebf3c024901a25f0010d69b13856` (2026-11-06). Estas condiciones sustituyen el dictamen anterior y prevalecen sobre el borrador histórico de esta sección.

C01-1. Matriz por preset (3) × viewport (390×844, 1280×800) × antes/después, mismo tema y colección.

C01-2. Criterio de aceptación sin umbral numérico: a 390×844 la primera tarjeta sube o queda igual con justificación; no desaparece ni se oculta ningún control de filtro u orden; a 1280×800 no hay diferencia de layout.

C01-3. Barra de preview controlada y script de medición versionado con su SHA-256.

C01-4. Escape y foco solo si se introduce un disclosure; en ese caso, reutilizar el contrato de `ThemeDrawer` (B-01) o devolver a R-D.

C01-5. Persistencia del estado abierto/cerrado tras el re-render de `FacetFiltersForm`, sin tocar `theme.js`; si no es posible, devolver a R-D.

C01-6. Elemento LCP y CLS registrados antes y después como observación.

- **Objetivo:** evaluar la jerarquía y controles de colección móvil preservando filtros, teclado y vacío, sin atribuir conversión no medida ni incorporar TT-26 de Atelier/Contour.
- **Ámbito propuesto para revisión:** `sections/main-collection.liquid` y `assets/base.css` para una eventual intervención de jerarquía; el alcance se cierra en R-D antes de escribir. Si la solución exige otros archivos o comportamiento AJAX, devolver la propuesta a revisión. Este borrador no autoriza implementación.
- **Baseline y evidencia:** en la preview autorizada y el mismo catálogo/settings, registrar dimensión efectiva de viewport útil y posición de la primera tarjeta antes y después. Para cada par se conserva idéntico viewport, entorno y estado de scroll: 390×844 antes/después por separado de 1280×800 antes/después. No comparar distintos viewports como si fueran un par antes/después; no fijar umbral no aprobado.
- **Regresión:** aplicar y limpiar filtros, comprobar reset y estado sin resultados, recorrer controles con teclado, Escape y devolución de foco. Adjuntar resultados y evidencia de viewport útil/primera tarjeta en cada par. Usar datos existentes, sin crear fixtures; si falta el estado necesario, registrarlo como dependencia pendiente.
- **Salida para R-D:** lista de archivos cerrada, diff propuesto y criterios verificables sujetos a revisión independiente; sin patch, tienda ni aceptación durante esta preparación.

### C-05: tipos de página y contrato de H1

Las siete secciones inventariadas siguen siendo `main-page`, `main-documentation`, `main-support`, `main-about`, `main-policy`, `main-faq` y `main-contact`. Una directiva debe separar la restricción de tipos `page` del contrato de jerarquía H1: `enabled_on` para `page` no asegura un único H1 si el comerciante agrega dos secciones con H1. La propuesta requiere prueba en editor e instalación antes de decidir un cambio de schema; no se ha aplicado cambio de schema ni aceptado funcionalmente.

#### C-05 — matriz propuesta para editor e instalación

**R-D de Claude Opus 5.5: APROBADA CON CONDICIONES.** [Dictamen completo, §2](../outbox-claude/CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001.md), sobre `258ca4f59910ebf3c024901a25f0010d69b13856` (2026-11-06). Estas condiciones sustituyen el dictamen anterior y prevalecen sobre el borrador histórico de esta sección.

C05-1. Registrar como hallazgo estático el H1 vacío fuera de `page`.

C05-2. Evaluar `limit: 1` de sección junto a `enabled_on`.

C05-3. Decidir el tratamiento de `main-documentation`/`main-support` en el ZIP, coordinado con C-04-P/D23.

C05-4. La instalación y el guardado en editor requieren tienda C-02 o autorización expresa de Johandry; sin ella, la matriz queda pendiente.

C05-5. Evidencia de preservación mediante diff JSON por lectura, no solo por inspección visual.

Johandry autorizó la implementación local el 2026-11-06. La matriz de instalación y editor queda pendiente de la tienda limpia de C-02.

No se ha ejecutado esta matriz. Probar los defaults homónimos tanto en la instalación derivada del repositorio como en el ZIP candidato, registrando el artefacto y el resultado de cada caso:

| Plantilla | Sección default | Plantilla en repo | Plantilla en ZIP candidato |
|---|---|---|---|
| `page.json` | `main-page` | Presente | Incluida |
| `page.documentation.json` | `main-documentation` | Presente | Excluida |
| `page.support.json` | `main-support` | Presente | Excluida |
| `page.about.json` | `main-about` | Presente | Incluida |
| `page.policy.json` | `main-policy` | Presente | Incluida |
| `page.faq.json` | `main-faq` | Presente | Incluida |
| `page.contact.json` | `main-contact` | Presente | Incluida |

- **Defaults y alternativas:** abrir cada plantilla y su sección homónima en el editor, con datos existentes, y repetir en páginas alternativas del tipo `page`; registrar disponibilidad de sección y jerarquía H1. En el ZIP no dar por instaladas las plantillas de documentación/soporte excluidas ni reconstruirlas silenciosamente; registrar su ausencia como resultado esperado del alcance del paquete. La exclusión indicada corresponde a las plantillas, no afirma por sí sola la ausencia de las secciones del paquete.
- **Dos secciones con H1:** en una copia autorizada de página, intentar insertar dos de las secciones que generan H1 y comprobar el DOM/jerarquía resultante. `enabled_on` para `page` regula disponibilidad por tipo de plantilla y no garantiza por sí solo un H1 único; si aparecen dos, la resolución del contrato H1 requiere directiva propia, sin presumir que la restricción de tipo la resuelva.
- **Contextos fuera de `page`:** comprobar disponibilidad/inserción en home, producto y colección, y registrar el comportamiento observado antes y después de cualquier restricción propuesta. No aplicar una restricción durante esta preparación.
- **Preservación:** en ambas instalaciones, comparar antes/después settings, bloques y contenido existentes de las siete secciones y de las páginas alternativas; verificar que no se pierdan al instalar, abrir/guardar o evaluar la propuesta. Registrar diferencias y mantener el caso pendiente si no hay datos suficientes, sin reemplazar contenido de comerciante.
- **Decisión y evidencia:** conservar resultados por plantilla/artefacto/contexto, H1 observado y preservación de settings/contenido; distinguir lo ausente por diseño en ZIP de un fallo de instalación. R-D debe revisar una directiva y su alcance después de estas pruebas. No aplicar schema ni declarar aceptación antes de verificar editor e instalación; esta matriz es solo propuesta.

### C-07: propuesta para productos con muchas variantes

El investigador distingue el límite de 250 elementos de `product.variants` en Liquid y Ajax frente a `product.variants_count`, que expresa el total. La paginación GraphQL con cursores devuelve hasta 250 recursos por página. El [changelog de Shopify](https://shopify.dev/changelog/posts/the-product-variant-limit-is-now-2048-for-all-merchants) documenta un máximo de 2.048 variantes por producto para todos los comerciantes. No se debe poner un token Admin en el tema. La propuesta es resolver la selección mediante `options_with_values` y `product_option_value`, enviar los `option_values` en un GET y usar Section Rendering para obtener el estado de variante correspondiente, antes de permitir la compra. Es una estrategia propuesta, no una solución implementada ni aceptada funcionalmente.

La matriz propuesta cubre fixtures de 1, 250 y 251+ variantes, combinaciones inexistentes y evitar la compra de una variante equivocada; además disponibilidad, inventario, precio, medios, selling plans, foco y accesibilidad. Los fixtures dependen de Johandry. En el borrador histórico se exigía una decisión previa para la vía sin JavaScript. Johandry la resolvió el 2026-11-06: enlaces GET con `option_values` para más de 250 variantes y envío deshabilitado con variante nula.

#### C-07 — borrador de directiva para R-D

**R-D de Claude Opus 5.5: APROBADA CON CONDICIONES.** [Dictamen completo, §3–4](../outbox-claude/CLAUDE-REVIEW-LOTE-C-PROPUESTAS-001.md), sobre `258ca4f59910ebf3c024901a25f0010d69b13856` (2026-11-06). Estas condiciones sustituyen el dictamen anterior y prevalecen sobre el borrador histórico de esta sección.

C07-1 (bloqueante). Nombrar y corregir H7-1 en la directiva, con prueba de enlace profundo.

C07-2 (bloqueante). Fuente única de resolución con más de 250 (H7-2): JSON no emitido o marcado como incompleto y no usado para resolver.

C07-3 (bloqueante). Manejo de `null` en servidor y cliente, y barrido de consumidores Liquid (H7-3).

C07-4 (bloqueante). Contrato de `theme:variant-change` y de la barra sticky (H7-4).

C07-5 (bloqueante). Vía concreta para featured con identidad verificable; si implica archivo nuevo, autorización Nivel 2 de Johandry antes de escribir (H7-5).

C07-6. Preservar la semántica A360-05 en el HTML del servidor (H7-6).

C07-7. Fixtures según §3.5 y regresión de guardas.

C07-8. Foco, `aria-busy`, anuncio único y ATC deshabilitado sin pérdida de foco.

C07-9. Corregir la cita del límite de 2048 al changelog oficial.

C07-10. Decisión sin JS según §4, registrada en `docs/decisions.md` antes de implementar.

Johandry clasificó H7-1 como P1 y ordenó corregirlo primero dentro de C-07. Autorizó la sección mínima de estado de variante (Nivel 2) y eligió GET con enlaces `option_values` sin JS para más de 250 variantes. Con variante nula el botón se deshabilita y no se envía `id` vacío. Decisión registrada en `docs/decisions.md`.

**Actualización técnica 2026-11-07:** para más de 250 variantes, el destacado navega a su PDP por GET `option_values` con y sin JavaScript. Conserva el resto de la selección en cada enlace. Solo la PDP usa Section Rendering sobre su propia instancia y ajustes. El endpoint mínimo de featured se evaluó, pero se retiró al adoptar la navegación. La autorización de Nivel 2 queda como antecedente del borrador, no como un archivo exigido.

- **Contrato histórico anterior a la actualización:** en PDP y producto destacado, resolver la combinación escogida mediante `options_with_values`/`product_option_value` y un GET de Section Rendering con `option_values` cuando el producto supere 250 variantes. Nunca seleccionar silenciosamente una variante por defecto cuando la combinación no existe, no está resuelta o no corresponde; no permitir comprar una variante distinta de la elegida. Conservar el comportamiento vigente para 250 o menos.
- **Identidad y contexto de producto destacado:** `featured-product` puede tener `settings.product` distinto del `product` de la URL. Section Rendering no permite pasar settings arbitrarios; si el ID de sección no existe en el contexto consultado puede producir render por defecto o error. Validar en la respuesta la identidad del producto y de la variante que corresponden a la sección solicitante antes de aplicar cualquier estado. Fuente: [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering).
- **Errores y concurrencia:** ante HTTP 404, respuesta `null`, ausencia de producto o ID de producto/variante equivocado, no aplicar la respuesta ni permitir enviar una variante distinta de la elegida. Mantener deshabilitado el envío/ATC mientras se resuelve la selección y después de un fallo; volver a habilitarlo solo con una respuesta válida y vigente cuyas identidades de producto y variante estén verificadas. Controlar solicitudes concurrentes con secuencia y/o `AbortController` y comprobación de vigencia para que una respuesta obsoleta nunca sustituya una selección más reciente.
- **Archivos propuestos para el alcance cerrado:** `sections/main-product.liquid`, `sections/featured-product.liquid`, `assets/theme.js` y `snippets/variant-no-js-select.liquid`. `snippets/price.liquid` es condicional: solo incluirlo si se demuestra que es necesario y R-D acepta expresamente esa inclusión. Excluir product-card y complete-the-look; cualquier ampliación exige una directiva adicional. Este borrador no autoriza escritura.
- **Puntos de partida verificables:** controles PDP en `main-product.liquid:256`, ID oculto en 489, selector sin JS en 492, selling plans desde 500 y bucle de variantes en 727; controles del producto destacado en `featured-product.liquid:148`, ID en 232, selector sin JS en 235, selling plans desde 243 y bucle de variantes en 477. En `assets/theme.js`, `VariantSelects` parte de 585, parsea JSON en 632 y contempla selección/availability/formularios/precio/cantidad/medios/estado/URL en 643–1098. `variant-no-js-select.liquid:24` contiene el bucle y su comentario de límite está en 43. Los localizadores son referencias del snapshot, no sustituyen revisar el diff.
- **Sincronización exigida:** ID de variante, disponibilidad y estado de compra/ATC, precio, precio comparado y unitario, cantidad, medios, selling plans, URL, estado anunciado y foco deben reflejar la misma selección resuelta. Mantener el contrato de planes de venta y no introducir un token Admin en el tema.
- **Sin JavaScript:** el fallback truncado de más de 250 variantes corresponde al borrador histórico y quedó sustituido por la decisión de Johandry del 2026-11-06. Se conservan los controles nativos para 250 o menos. Por encima de 250 se usan enlaces GET con `option_values` y solo se envía el `id` de una variante resuelta.
- **Matriz de aceptación vigente:** con 1 y 250 variantes, verificar que la selección inline y los controles nativos conservan ID, cantidad y estado. Con 251+ variantes, probar el destacado en home y en la ficha de otro producto, con JavaScript habilitado y deshabilitado. Verificar que cada enlace contiene un ID por opción en su orden, conserva las opciones no cambiadas, navega al PDP correcto y que el PDP permite la compra válida respetando mínimo e incremento. Para combinación inexistente, verificar botón deshabilitado y ausencia de ID en FormData. En el selector inline de PDP, comprobar enlace profundo posterior a 250, 404, respuesta nula, identidad equivocada y concurrencia. Cubrir disponibilidad, inventario, cantidad, precio, medios, planes, foco y anuncios. Se requieren los fixtures de Johandry y autorización de tienda para cualquier prueba de carrito.
- **Salida y bloqueos:** especificación/diff propuesto y evidencia por celda para revisión independiente R-D; los fixtures y su verificación en tienda siguen pendientes. La decisión sin JS se tomó el 2026-11-06 y su verificación requiere los fixtures autorizados. No implementar ni ejecutar tienda durante esta preparación.

Fuentes oficiales para la propuesta: [productos con muchas variantes](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products), [objeto Liquid product](https://shopify.dev/docs/api/liquid/objects/product), [Ajax Product API](https://shopify.dev/docs/api/ajax/reference/product), [paginación GraphQL](https://shopify.dev/docs/api/usage/pagination-graphql), [Admin GraphQL ProductVariant](https://shopify.dev/docs/api/admin-graphql/latest/objects/ProductVariant) y [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering).

### Diagnóstico estático y logger de autenticación

`layout/theme.liquid:10` emite el enlace favicon solo cuando `settings.favicon` no está vacío. El análisis estático no acredita el valor de ese setting ni la causa del 404 en preview. `templates/product.json:36` activa `show_dynamic_checkout`, y `sections/main-product.liquid:653` condiciona `payment_button`: es una pista posible para el aborto de Shop login, no una causalidad demostrada. Ambas hipótesis requieren reproducción en preview/editor.

La corrección posterior del logger de autenticación en `run.mjs`, SHA-256 `62191316247eaf31bd7004b7dac3d8f449bbc29c56717e36ea95a3774621668c`, recibió aceptación independiente. Los JSON históricos se conservan sin reescritura y la contradicción de sus campos de autenticación sigue vigente para interpretar esas corridas; no se acredita una prueba nueva ni un G2 aceptado.
