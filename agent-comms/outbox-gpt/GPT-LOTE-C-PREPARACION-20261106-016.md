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
- C-07: fixtures de variantes autorizados y entorno correspondiente.
- C-04-P/N/R: destino del contenido/paquete, nomenclatura adicional (Haute Couture) y versión/notas. Lo ya decidido se conserva; las ampliaciones requieren resolución.
- R-D / G2 Lighthouse: arnés configurado para las 18 celdas, una corrida por celda, móvil 390×844 y escritorio 1280×800. El umbral acordado por Johandry es móvil <70 como riesgo con propuesta de mejora dentro del plan. La revisión estática del runner fue aceptada; falta ejecutar porque Lighthouse no está disponible localmente y la instalación temporal devolvió E404 para `import-in-the-middle` tanto en el registry configurado como en npmjs.org. No hay métrica nueva ni diagnóstico de C-03.
- D19: resolver revisor Opus de contexto limpio o cambio explícito del requisito. GPT solo ofrece apoyo auxiliar hasta esa resolución.

No se ejecutaron pruebas ni tienda, no se editó código/D28, no se reconstruyó ZIP y no hubo commit/push en esta tarea. Solo preparación documental y enlace en STATUS; no cierre de Lote 0 ni inicio formal de C.

## Addendum de prevalencia — 2026-11-06

El cuerpo anterior conserva el estado de su snapshot y los hechos de las pruebas que allí se citaron. Sus afirmaciones «Lote 0 no cerrado», «preflight fallido sin corrida posterior» y «bloqueo por falta de Opus» quedaron superadas por la decisión de Johandry del 2026-11-06 y por la revisión independiente `CLAUDE-REVIEW-LOTE-0-CIERRE-001`: Lote 0 está cerrado solo en alcance D19 con condiciones trasladables. El preflight elevado posterior confirmó como `unpublished` las tres previews autorizadas. La corrida `T181805513Z`, que era la posterior al preflight de ese snapshot, sí ocurrió, no mutó el carrito y falló en el scope por `HARNESS_OPERATION_FAILED` en un GET del runtime Shopify; luego hubo lecturas adicionales y la `T190050695Z` acabó `completed_with_limits`. R-A/R-B completas y su aceptación siguen pendientes. T-2 Sartorial sigue `UNKNOWN`; las lecturas nuevas están autorizadas, pero no se debe mutar ni limpiar ese contexto. El cierre D19 no inicia ni certifica R-D/G2, R-Demo o las tareas C/D.

Este addendum no altera el resultado ni la evidencia histórica de los intentos anteriores. Para el estado actual prevalecen `CLAUDE-CLOUD-STATUS.md`, `docs/decisions.md` y el informe final más reciente de `outbox-gpt`.

## Addendum de revisión y preparación local — 2026-11-06

- **R-C / C-04-P3:** el ledger mantiene estado y cifras históricas, pero ahora precisa que CLS 0.022/0.003/0.001 son valores conservados en el ledger sin fuente confirmada aquí. El informe citado documenta una corrida contra el proxy local `http://127.0.0.1:9292`, con CLS global 0.1519 y resultados por plantilla distintos; no corrobora tienda real ni esos tres valores. La corrección documental fue aceptada independientemente en SHA-256 `EBB826D3EDFD4936942964B2E314508B77AE9F5E56E82B167C70391A42BCDF4A`.
- **C-04-P:** la implementación local excluye exactamente `templates/page.documentation.json` y `templates/page.support.json` del ZIP mediante `scripts/package-theme-zip.mjs`; ambas plantillas y las secciones quedan en el repo. La aceptación de paquete depende de inspeccionar el ZIP generado y de confirmar que no quedan afirmaciones equivalentes en sus contenidos.
- **C-04-R:** `release-notes.md` conserva `1.1.0` como propuesta; metadata del tema queda en `1.0.0` hasta que Johandry apruebe versión y notas. Falta inspeccionar el candidato final.
- **C-04 soporte:** titularidad, endpoint Formspree, SLA de 24 horas laborables y canales no tienen aprobación acreditada; siguen marcados para Johandry. No se considera G3 aceptado ni publicación autorizada.
- **C-04-N/N-P3:** corrección local de nomenclatura en docs de merchant y solo dos comentarios CSS; el reviewer R-C aceptó los diffs locales en su snapshot, sin certificar coherencia de las páginas publicadas.
- **C-05:** inventario estático de `main-page`, `main-documentation`, `main-support`, `main-about`, `main-policy`, `main-faq` y `main-contact`: cada sección define un H1 y al menos un preset, no declara `enabled_on`/`disabled_on`, y cada una aparece en su plantilla `page*.json` homónima. Propuesta para revisión: restringirlas a plantillas del tipo `page`, no a templates alternos específicos, porque Shopify define `enabled_on.templates` por tipos de página. Esa restricción no garantiza por sí sola que un comerciante no agregue otra sección con H1 a una plantilla `page`; se debe validar editor e instalación y la jerarquía resultante antes de modificar schemas. No se aplicó restricción ni se afirma defecto de editor. Fuente: [Section schema de Shopify](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema), [JSON templates](https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates).
- **C-06:** hipótesis registrada en `sections/header.liquid:191`: el setting `link_list` entrega objeto `linklist` o blank, mientras `<shopify-account menu>` espera string. No se reemplaza por `.handle` sin reproducción con cuentas acreditadas. Fuentes: [Shopify Account component](https://shopify.dev/docs/api/storefront-web-components/components/shopify-account), [link_list setting](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings).
- **C-07:** `main-product.liquid:727` y `featured-product.liquid:477` recorren `product.variants`; Shopify documenta el límite de 250 variantes accesibles en Liquid y cuenta total separada. La conducta para 251+ y la solución quedan pendientes de fixtures autorizados y verificación en tienda; no se crea producto ni metafield. Fuentes: [high-variant products](https://shopify.dev/docs/storefronts/themes/product-merchandising/variants/support-high-variant-products), [Liquid product object](https://shopify.dev/docs/api/liquid/objects/product).
- **C-01/C-03 y C-02/C-07/R-Demo:** siguen sin cierre funcional. El Lighthouse no se ejecutó por el E404 de dependencia ya descrito; C-02, fixtures de suscripción/variantes, importación y revisión R-Demo requieren tienda/decisiones de Johandry. Las lecturas R-A/R-B `T190050695Z` dan axe/teclado smoke con límites, no sustituyen los baselines Lighthouse ni las matrices completas.
- **R-C global:** el revisor independiente rechazó la completitud porque faltaban baseline/regresión, editor/instalación, ZIP final y algunas dependencias de Johandry. Esos elementos permanecen delimitados arriba; el rechazo no se presenta como aceptación parcial global.
