# CLAUDE-R3-IMPL-001: Implementación de la ronda R3 (parte de Claude)

```text
ID: CLAUDE-R3-IMPL-001 (continúa CLAUDE-R3-ANALISIS-001)
Fecha: 2026-11-24
Rama: claude/clever-gauss-ddhyr2 (PR en borrador #23 contra master @ 2e94454). Código de la ronda en HEAD 8dcedc2.
Estado: ENTREGADO, código completo. Compuerta 5 ABIERTA para toda la ronda: nada de R3 se ha probado en tienda real ni en móvil simulado.
        No publicable hasta integrar el PR de GPT (dependencia de la ADENDA-A, punto a).
Decisión requerida (Johandry): aprobar los textos de la sección 8 (D35); decidir DP-017 a DP-020; confirmar DP-007 a DP-016.
Resumen en 5 líneas:
  1. 11 commits (84523a9..8dcedc2) cierran en código 48 entradas de hallazgo asignadas a Claude (algunas agrupan IDs equivalentes, como AS-03/FB-34); FB-36 no se implementa a propósito.
  2. 10 hallazgos quedan aplazados según el análisis (AS-08, FB-18, FB-38, FB-48, FB-51, G-PERF-06, FO-13, FB-58, FO-09 JS, FO-14).
  3. 43 tests Playwright sin tienda (R3 más slideshow-reconnect) pasan; cada test R3 falla con el código previo y pasa con el nuevo.
  4. Ledger: 21 filas existentes actualizadas (10 pasan de cumplido a código completo porque se tocó su código) y 20 filas nuevas en la sección 8.
  5. Pendiente: PR de GPT, copy aprobado, claves huérfanas, ZIP y manifiesto finales, y la compuerta 5 en sartorial-theme-kvkzl39t (D38).
Archivos tocados por esta entrega: docs/requirements-ledger.md, docs/decisions-pending.md y este archivo. Nada del tema.
Desviaciones: ninguna en esta entrega. En la ronda: Nivel 2 dentro de DP-010 (defaults del bento y de los umbrales del cajón, sección 8).
Hallazgos extra fuera de alcance: sección 10.
Verificación: sección 9.
```

Fuentes: `CLAUDE-R3-ANALISIS-001.md` (plan, reparto y evidencia previa), `agent-comms/inbox-gpt/GPT-TASK-R3-001-copy-plantillas.md`, `agent-comms/inbox-gpt/GPT-TASK-R3-001-ADENDA-A.md`, `docs/decisions-pending.md` y el diff `2e94454..8dcedc2`. Las líneas citadas son de `8dcedc2`.

---

## 1. Alcance

- **Entra:** los hallazgos con dueño Claude (C) de la tabla 3 de `CLAUDE-R3-ANALISIS-001` y la revisión de rich media en la vista rápida.
- **No entra:** los archivos de GPT (lista 5.1 del análisis). Su PR (`gpt/r3-copy-plantillas`) no está integrado.
- **Commits:**

| Commit | Contenido |
| --- | --- |
| `84523a9` | Auditorías archivadas, análisis y encargo a GPT (solo documentación) |
| `e49fb72` | Claves de locale y ajustes de schema |
| `862266e` | Carrito: umbrales, propiedades de tarjeta regalo, ganchos de foco |
| `e1266ec` | `theme.js` fase 1: diálogos y foco |
| `fa11181` | Ficha de producto: reglas de cantidad, variantes sin JS, medios |
| `9843c0e` | CSS, bento y curated showcase |
| `aff2572` | `theme.js` fase 2: carrito |
| `cd401b1` | Botón sin JS con variante agotada, `sizes` de tarjeta única, claves de tarjeta regalo, ADENDA-A |
| `bc666b7` | `theme.js` fase 3: búsqueda, filtros, precios |
| `317a797` | Tests Playwright R3 |
| `8dcedc2` | Seis correcciones de una revisión independiente |

---

## 2. Estado por hallazgo

Leyenda de cobertura: nombre del test (archivo `tests/r3-*.spec.mjs`); "sin test (Liquid puro)"; "solo lectura de código" (JS o CSS sin test propio).

### 2.1 Diálogos, foco y accesibilidad

| ID | Estado | Commit | Evidencia | Cobertura |
| --- | --- | --- | --- | --- |
| AS-01 | hecho | `e1266ec` | `assets/theme.js:2129` (no abre con `aria-busy`), `:2190` (cierra por la ruta completa antes de sustituir) | «AS-01 opening the panel while the variant request is in flight leaves no trap, inert page or scroll lock» |
| FB-03 | hecho | `e1266ec` | `assets/theme.js:4951-4952` (`--header-offset` en el margen superior) | solo lectura de código |
| FB-04 | hecho | `e1266ec` | `dismissFromOverlay` (`assets/theme.js:55`) en `:1883`, `:5795`, `:5941` | «FB-04 tapping the … backdrop closes it and the synthesized click never reaches the page» (3) |
| FB-21 | hecho | `e1266ec` | `assets/theme.js:3286-3289`, `:5221-5223` | «FB-21 after a 422 the focus is handed back to the add button, which is usable again» |
| FB-22 | hecho | `e1266ec` | `assets/theme.js:5342` (sin `aria-pressed`; GPT puede quitar el estático, ADENDA-A b) | solo lectura de código |
| FB-23 | hecho | `e1266ec` | `assets/theme.js:4203` | solo lectura de código |
| FB-24 (carril) | hecho | `bc666b7` | `assets/theme.js:682`, `:692` (`role="group"`) | solo lectura de código |
| FB-25 | hecho | `9843c0e` | `assets/base.css:3623-3634` (`outline` `Highlight`) | solo lectura de código |
| FB-26 (featured) | hecho | `e49fb72`, `fa11181`, `8dcedc2` | `sections/featured-product.liquid:58-62` (con respaldo si `section.index` es nil) | sin test (Liquid puro) |
| FB-35 | hecho | `e1266ec` | `assets/theme.js:1007` (se elimina, no se deshabilita: conserva el Enter) | «FB-35 with JavaScript only the enhanced add button remains and Enter submits through it» |

### 2.2 Ficha de producto y featured product

| ID | Estado | Commit | Evidencia | Cobertura |
| --- | --- | --- | --- | --- |
| FO-05 / DP-007 | hecho con salvedad: sin tabla de precios por volumen | `e49fb72`, `fa11181`, `9843c0e`, `bc666b7`, `8dcedc2` | `snippets/quantity-rule.liquid:17-44`; `sections/main-product.liquid:411`, `:426-428`; `sections/featured-product.liquid:275`, `:290-292`; `assets/theme.js:1381-1404`; `assets/base.css:6008` | «FO-05 the quantity rule shows only what applies to the selected variant», «FO-05 a template that repeats the marker is filled everywhere (Spanish increment text)», «each visible part of the quantity rule takes its own line and hidden parts take none» |
| AS-04 / DP-013 | hecho con salvedad: comprobación duplicada (riesgo c) | `fa11181`, `cd401b1` | `snippets/variant-no-js-select.liquid:100-125`, `:138`; `snippets/product-submit-button.liquid:23-50` | sin test (Liquid puro) |
| SO-04 | hecho | `fa11181`, `8dcedc2` | `snippets/quick-add-mode.liquid:16` (también `single`); `snippets/product-card.liquid:107`, `:119`, `:524` («View product») | sin test (Liquid puro) |
| AS-06 / FB-31 | hecho | `fa11181` | `sections/main-product.liquid:95-108` | sin test (Liquid puro) |
| FB-05 | hecho | `fa11181`, `9843c0e` | `sections/featured-product.liquid:116`; `assets/base.css:10766` (solo recorta imágenes) | sin test (Liquid y CSS) |
| FB-15 | hecho | `fa11181` | `snippets/size-guide-measurements.liquid:12-27`, `:67`, `:84` | sin test (Liquid puro) |
| FB-32 (featured) | hecho | `fa11181` | `sections/featured-product.liquid:101-104`, `:124` | sin test (Liquid puro) |
| FO-06 (`main-product`) | hecho | `fa11181` | `sections/main-product.liquid:17-21`, `:31-35`, `:47-51`, `:58-61` | solo lectura de código |
| FO-07 | hecho | `fa11181` | `sections/featured-product.liquid:80` (`escape_once`) | sin test (Liquid puro) |
| G-SEC-04 | hecho | `fa11181` | `sections/video.liquid:129` (`dnt=1`) | sin test (Liquid puro) |

### 2.3 Carrito

| ID | Estado | Commit | Evidencia | Cobertura |
| --- | --- | --- | --- | --- |
| AS-02 | hecho con salvedad (riesgo b, DP-018) | `aff2572` | `assets/theme.js:4069`, `:4089-4092`, `:4096-4099` | «AS-02 opening the drawer keeps unsent edits on the cart page, and a clean page is still refreshed», «AS-02 a change made in the drawer refreshes the cart page but keeps the note typed there» |
| FB-02 | hecho | `e49fb72`, `862266e`, `aff2572`, `8dcedc2` | `sections/cart-drawer.liquid:82`; `assets/theme.js:3880-3884`, `:3923-3927` | «FB-02 a quantity change is announced in the status region, and a removal keeps its own message» |
| FB-10 | hecho | `e49fb72`, `862266e`, `9843c0e` | `sections/cart-drawer.liquid:9-67`, `:154-176`; `assets/base.css:3272` | «a single milestone label sits at the end of the bar, where its marker is; two labels keep both ends»; el cálculo Liquid, sin test |
| FB-20 | hecho con salvedad (riesgo a) | `862266e`, `aff2572` | `sections/cart-drawer.liquid:415`, `:426`; `assets/theme.js:4125-4129`, `:4173-4180` | «FB-20 focus stays on … when the drawer repaints» (2) |
| FB-30 | hecho | `aff2572` | `assets/theme.js:6861` | «FB-30 typing 0 in a cart page quantity field is kept instead of being snapped to the minimum» |
| SO-08 | hecho | `862266e`, `cd401b1` | `sections/cart-drawer.liquid:246-259`; `sections/main-cart-items.liquid:72-85` | sin test (Liquid puro) |
| FB-36 | **no hecho** (DP-017) | — | Un `abort` por plazo llegaría a los llamadores como error silenciado: el comprador no vería nada aunque el cambio se hubiera aplicado. Hacerlo bien exige un estado de resultado incierto con mensaje, que ya no es de riesgo bajo. | — |

### 2.4 Búsqueda, filtros y precios

| ID | Estado | Commit | Evidencia | Cobertura |
| --- | --- | --- | --- | --- |
| AS-03 / FB-34 | hecho | `e49fb72`, `bc666b7` | `assets/theme.js:5984-5998`, `:6014`, `:6056`, `:6118`, `:6139-6142`; `snippets/predictive-search.liquid:22` | «AS-03 closing during the debounce and reopening relaunches the query and clears the busy state», «AS-03 closing while the request is in flight and reopening relaunches it and clears the busy state», «AS-03 a failed request says the search failed, not "no results"; an empty answer still says "no results"» |
| AS-05 / FB-19 | hecho | `bc666b7`, `8dcedc2` | `assets/theme.js:4553-4562`, `:4609` | «AS-05 focus that moved to another control meanwhile is not pulled back, and untouched focus still returns to its control», «AS-05 focus that moved to a product link inside the component returns to the control that started the request», «AS-05 focus that moved outside the filters is respected too» |
| FB-33 | hecho | `bc666b7` | `assets/theme.js:4440-4456`, `:4462` | «FB-33 a price above the range maximum is clamped and still reaches the AJAX request» |
| AS-09 / FB-01 (JS) | hecho; la parte Liquid es de GPT | `bc666b7` | `assets/theme.js:181-199` (`decodeEntities`, `moneyText`) y 19 salidas (`:1167` a `:5030`) | «AS-09 prices that arrive with HTML entities or markup are painted as plain text» |
| AS-10 | hecho con salvedad (riesgo e) | `bc666b7` | `assets/theme.js:6222-6238` | «AS-10 a strike-through price only appears when both amounts belong to the same offer» |
| FB-53 | hecho | `bc666b7` | `assets/theme.js:204-220`, usado en `:1300` y `:5054` | solo lectura de código |
| FB-47 | hecho | `bc666b7` | `assets/theme.js:6965-6986` | solo lectura de código |

### 2.5 Maquetación y secciones de portada

| ID | Estado | Commit | Evidencia | Cobertura |
| --- | --- | --- | --- | --- |
| FB-06 | hecho | `9843c0e` | `assets/base.css:10842-10858`; `sections/curated-showcase.liquid:92-95`, `:115` | «FB-06 a lone spotlight is capped at 44rem, centered and shorter; two products keep the wide layout» |
| FB-07 | hecho | `9843c0e` | `assets/base.css:406-409` | «FB-07 a very long unbroken title breaks inside a two-column card at …px» |
| FB-08 | hecho con salvedad: falta `collection-list` (GPT, sección 5) | `9843c0e`, `cd401b1` | `assets/section-standard-a.css:109-112`; `sections/featured-collection.liquid:43-47` | «FB-08 the single card takes the whole capped track at …px» |
| FB-13 | hecho | `9843c0e` | `assets/base.css:8750` | «FB-13 with the index hidden the text uses the full width; once it shows, two columns return» |
| FB-14 | hecho | `9843c0e` | `assets/base.css:7530-7532`, `:7631-7632` | solo lectura de código |
| FB-16 | hecho | `9843c0e` | `assets/base.css:165-176` | «FB-16 a video iframe is capped to the column and keeps a 16:9 box; other embeds only get capped» |
| FB-17 | hecho | `9843c0e`, `8dcedc2` | `sections/bento-discovery.liquid:14-20`, `:48`; `assets/base.css:4830`, `:4840-4868` | 8 tests «FB-17 …» de `r3-layout.spec.mjs` |
| FB-49 | hecho | `9843c0e` | `assets/base.css:5049-5051` | solo lectura de código |
| SO-02 / FB-39 (DP-009) | hecho | `9843c0e` | `sections/bento-discovery.liquid:188` | sin test (Liquid puro) |
| SO-03 / FB-41 | hecho | `9843c0e` | `sections/bento-discovery.liquid:131-142`; `assets/base.css:4461-4480` | sin test (Liquid y CSS) |
| FB-09, FO-01 (bento, DP-010) | hecho | `9843c0e` | `sections/bento-discovery.liquid:217`, `:262`, `:295` | sin test (schema) |
| FO-04 (bento) | hecho | `9843c0e` | `sections/bento-discovery.liquid:57-66`, `:112-120` | sin test (Liquid puro) |
| FB-37 | hecho (comentarios) | `9843c0e`, `bc666b7` | `assets/theme.js:5498-5499`; `assets/base.css:8151`, `:8155`. No se envolvió más código en `docs-only`: el índice de anclas lo usan también las páginas legales | solo lectura de código |

### 2.6 Locale y schema

| ID | Estado | Commit | Evidencia |
| --- | --- | --- | --- |
| FB-55 | hecho | `e49fb72` | `locales/en.default.schema.json:1470` («Position in grid» con `info`) |
| FB-11 (DP-008) | hecho: aceptado como residual, solo `info` | `e49fb72` | `locales/en.default.schema.json:1410` |
| FO-03 | **pendiente**: GPT propone el texto de `not_found.*` y el default de `newsletter`; Claude lo aplica en la integración | — | `locales/en.default.json:427`, `locales/es.json:427` |
| G-I18N-04 | **pendiente**: GPT propone el texto | — | `locales/en.default.schema.json:23` («Atelier») |

### 2.7 Aplazados (según el análisis, sin cambios)

AS-08 (Combined Listings, DP-012); FB-18, FB-38, FB-48, FB-51 y G-PERF-06 (rendimiento y CLS estimados, a la espera de la medición de DP-005, DP-014); FO-13 (tokens de 44 px, fila verde); FB-58 (solo decidible en tienda); FO-09 parte JS; FO-14.

### 2.8 Revisión de la vista rápida (rich media)

El tema no tiene vista rápida de ficha. El único modal de producto es el selector de opciones del quick add (`snippets/product-card.liquid:445-446`, diálogo `quick-buy__panel`), y no muestra medios. Según la lectura del código no hay incumplimiento estricto del requisito de rich media («product forms such as quick view features»), pero un revisor podría interpretarlo de otro modo. No se abre hallazgo: queda como **DP-020** y como fila `no verificado` en el ledger.

---

## 3. Las cinco compuertas

1. **Requisitos (ledger): se cumple para esta entrega.** Filas declaradas en la sección 4, cada una con evidencia `archivo:línea` de `8dcedc2` o con el nombre de su test. `npm run gates:ledger`: 0 incoherencias.
2. **Estados degenerados: parcial.** Cubiertos en tests sin tienda: un solo bloque y cuatro bloques en el bento, un solo producto en curated showcase y en `std-grid`, títulos largos, una sola etapa de recompensas, búsqueda vacía o con error, plantilla de cantidad con el marcador repetido. Cubiertos solo en el Liquid y sin ejecutar: producto sin medios y con más de 6 medios en featured product, guía de tallas con una o ninguna tabla, bento sin producto, umbrales vacíos. **Abierto:** 40 variantes, 200 productos paginados, precios con decimales y símbolos largos, y catálogo hostil; todo eso exige tienda.
3. **Consistencia entre archivos: se cumple, con dos salvedades.** Los precios en JS pasan por `moneyText` o `formatMoney`, sin `Intl`. Los umbrales del cajón ya no se repiten en duro. El ancho de 448 px está en `.std-grid--single` y en `featured-collection` con un comentario que los liga. Salvedades: (a) la comprobación del modo enlaces sin JS está duplicada entre `snippets/product-submit-button.liquid:23-45` y `snippets/variant-no-js-select.liquid:100-123`; (b) `sections/collection-list.liquid` (GPT) todavía no usa los 448 px.
4. **Superficie del comerciante: abierta.** Todos los labels nuevos o cambiados usan claves `t:`, en sentence case, y los ajustes con dependencia externa (umbrales, pieza única) llevan `info`. Quedan abiertos: la aprobación de los textos (D35, sección 8), la etiqueta «Atelier» (G-I18N-04, pendiente de GPT) y el texto de FO-03.
5. **Tienda real: ABIERTA para toda la ronda.** Nada de R3 se ha probado en tienda real ni en móvil simulado. Los 2 tests de `tests/pdp-line-total.spec.mjs` necesitan storefront y no se han ejecutado contra este código. Por eso ninguna fila de R3 pasa a `cumplido`, y las 10 filas `cumplido` cuyo código se tocó pasan a `código completo`. Plan en la sección 6.

---

## 4. Filas del ledger cerradas o modificadas

Ninguna fila queda cerrada como `cumplido`. Recuento final: **97 filas: 37 `cumplido`, 55 `código completo`, 4 `no verificado` y 1 `ausente`.** Antes de esta entrega: 77 filas, 47 `cumplido` y 30 `código completo`.

**Pasan de `cumplido` a `código completo`** porque R3 cambia su código y no se ha probado en tienda (se añade la evidencia de R3 y lo que falta):

- Imágenes Responsivas (FB-32, FB-08, FB-06)
- Optimización LCP (AS-06/FB-31)
- Live Regions (FB-02, AS-03/FB-34)
- Precio Unitario (AS-09)
- Precios Comparativos y Descuentos (FB-53, AS-10)
- Disponibilidad de Retiro Local (AS-01)
- Filtros Facetados (AS-05, FB-33)
- Búsqueda Predictiva (AS-03/FB-34, AS-10, FB-04)
- Selector de País / Moneda (FB-14)
- Formulario de Newsletter (FB-47)

**Siguen en `código completo`, con la evidencia de R3 añadida:** Focus Trap (AS-01, FB-04, FB-20), Selector de Variantes (AS-04, FB-35, FB-25), Planes de Venta (AS-04, AS-09), Medios Enriquecidos (FB-05, FO-07). En la sección 7 también se actualizan los localizadores, que R3 desplazó: Tira de Medios Móvil (FB-05, FB-32), Botón de Compra sin JS (AS-04), Cantidad Mínima en Quick Add (SO-04), Filtros con Debounce (FB-33), Slideshow, Vídeo y Secciones Estándar (G-SEC-04, FB-08) y Anuncio de Recompensas (FB-10).

**Corrección de nombre:** en Presets Diferenciados, «Edition» pasa a «Imprint» (comprobado en `config/settings_data.json` y `listings/imprint/`). La fila sigue `cumplido` porque su código no cambia.

**Filas nuevas (sección 8):**

| Fila | Estado |
| --- | --- |
| Reglas de cantidad visibles en ficha y producto destacado (FO-05) | `código completo` |
| Variantes sin JS con reglas de cantidad o planes distintos (AS-04) | `código completo` |
| Importes con `money_format` con entidades o HTML (AS-09/FB-01) | `código completo` |
| Barra de recompensas del cajón con etapas configurables (FB-10) | `código completo` |
| Página de carrito y cajón sincronizados sin perder ediciones (AS-02/FB-30) | `código completo` |
| Propiedades de tarjeta regalo traducidas en el carrito (SO-08) | `código completo` |
| Bento discovery: rejilla, enlaces y estados vacíos | `código completo` |
| Curated showcase con un solo producto (FB-06) | `código completo` |
| Tarjeta única en featured collection y collection list (FB-08) | `no verificado` (falta la parte de GPT) |
| Títulos de producto largos en tarjeta (FB-07) | `código completo` |
| Contenido incrustado en texto enriquecido (FB-16) | `código completo` |
| Página legal sin índice a todo el ancho (FB-13) | `código completo` |
| Swatches seleccionados en colores forzados (FB-25) | `código completo` |
| Guía de tallas con una o ninguna tabla (FB-15) | `código completo` |
| Menú desplegable largo con cabecera fija (FB-49) | `código completo` |
| Foco y nombres accesibles en controles (FB-03, FB-21, FB-22, FB-23, FB-24, FB-26, FB-35) | `código completo` |
| Rich media en formularios de producto tipo vista rápida | `no verificado` (DP-020) |
| Cambio de línea del carrito con red colgada (FB-36) | `ausente` (DP-017) |
| Textos nuevos o cambiados de R3 (D35) | `no verificado` (aprobación de Johandry y propuestas de GPT) |
| Comentarios de código en inglés (FO-06, FB-37) | `no verificado` (falta `main-faq` de GPT y la revisión cruzada) |

**Mantenidas en `cumplido` a propósito**, aunque R3 toca algo cercano: Checkout Acelerado (FB-20 solo añade `data-focus-key` al contenedor y no cambia qué se renderiza), Destinatario de Gift Cards (el formulario de la ficha no cambia; la parte del carrito tiene fila propia) y Schemas Válidos (siguen 100 % con claves `t:`).

---

## 5. Compromisos, riesgos e integración con GPT

**Compromisos y riesgos conocidos tras la revisión independiente:**

- **(a) FB-20 con pago acelerado.** Los botones de Shop Pay viven en shadow DOM y `querySelector` no los alcanza, así que el foco probablemente siga cayendo en Cerrar. Solo se confirma en tienda.
- **(b) AS-02.** Si /cart tiene ediciones sin enviar, un cambio del carrito desde otra pestaña deja la página desactualizada hasta la siguiente mutación. Los `updates[]` son posicionales. Decisión abierta en **DP-018**.
- **(c) Duplicación.** La comprobación del modo enlaces sin JS está repetida entre `snippets/product-submit-button.liquid` y `snippets/variant-no-js-select.liquid`.
- **(d) Slideshow.** `sections/slideshow.liquid:31` tiene el mismo hueco con `section.index` nil que se corrigió en featured product. Es preexistente y no se tocó. Decisión abierta en **DP-019**.
- **(e) AS-10.** Si el payload de la búsqueda predictiva no trae variantes y dos variantes comparten precio pero solo una está rebajada, se tacha igualmente.

**Dependencia de integración con GPT (bloqueante para publicar):** el CSS de R3 hace que `.std-grid--single` sea una sola pista de 448 px (`assets/section-standard-a.css:109-112`). `sections/collection-list.liquid`, que es archivo de GPT, sigue calculando `sizes` por columnas, así que con una sola colección la imagen se pediría unas 4 veces más pequeña de lo que se muestra. Está pedido a GPT en la ADENDA-A, punto a). **El PR de Claude no debe considerarse publicable sin ese cambio.**

**Vista rápida:** ver la sección 2.8 y DP-020.

---

## 6. Plan de pruebas en tienda real (compuerta 5)

Tienda `sartorial-theme-kvkzl39t` (D38). Cada prueba en escritorio de 1280 px y en móvil de 390 px con `isMobile` y `hasTouch`, salvo donde se indica. Por prioridad:

| # | Prueba | Cierra |
| --- | --- | --- |
| 1 | Producto con reglas de cantidad (mínimo, incremento, máximo) en `/es`: texto correcto al cargar y al cambiar a una variante con otra regla y a una sin regla; lectura con `aria-describedby` | Reglas de cantidad visibles (FO-05) |
| 2 | Sin JS: variantes que difieren en regla o en planes (deben salir enlaces), y variante agotada (no debe salir el botón nativo habilitado) | AS-04, Botón de Compra sin JS, Planes de Venta |
| 3 | Cajón: anuncio del cambio de cantidad; foco en Checkout y en Shop Pay tras repintar; umbrales vacíos, solo envío, solo regalo y ambos | FB-02, FB-20 (riesgo a), FB-10, Live Regions, Focus Trap, Anuncio de Recompensas |
| 4 | /cart con nota sin enviar: abrir el cajón la conserva; cambiar en el cajón repinta y la conserva; 0 en una línea la elimina | AS-02 (riesgo b), FB-30 |
| 5 | Búsqueda predictiva con red lenta y cortada (cerrar y reabrir, mensaje de error) y con el payload real de `suggest` para el tachado | AS-03/FB-34, AS-10 (riesgo e), Búsqueda Predictiva, Precios Comparativos |
| 6 | Filtros con red lenta (mover el foco durante la petición) y precio fuera de rango | AS-05, FB-33, Filtros Facetados, Filtros con Debounce |
| 7 | `money_format` con entidades (`&pound;{{amount}}`) y con HTML (`<span class=money>${{amount}}</span>`) en ficha, tarjetas, quick add, planes y precio unitario | AS-09/FB-01, Precio Unitario |
| 8 | Featured product con más de 6 medios, con vídeo y 3D en las posiciones 6 o posteriores, a 1280 px; `sizes` y LCP en la ficha con miniaturas | FB-05, FB-32, AS-06, Medios Enriquecidos, Imágenes Responsivas, LCP, Tira de Medios |
| 9 | Bento con 1, 2, 3 y 4 bloques, con el destacado primero y al final, y con un producto vacío; preset Imprint | Bento discovery |
| 10 | Tarjeta única en featured collection y collection list (tras integrar a GPT): `currentSrc` a 390 y 1280 px; curated showcase con un producto | FB-08, FB-06 |
| 11 | Selector de país con 2 mercados y una etiqueta «país (moneda)» larga | FB-14 |
| 12 | Windows con contraste alto (forced-colors) en tarjetas, filtros y ficha | FB-25 |
| 13 | Táctil real (no emulado) en los fondos de la guía de tallas, el modal de contraseña y la búsqueda predictiva | FB-04 |
| 14 | Lector de pantalla (NVDA o VoiceOver): anuncios del cajón y de la predictiva, regiones de featured product, botón del marquee | FB-02, FB-22, FB-26, Foco y nombres accesibles |
| 15 | Resto: guía de tallas con solo cm, solo in y ambas; política con y sin encabezados; vídeo y mapa incrustados en una página; menú desplegable largo; dos formularios `customer` en una página; tarjeta regalo con destinatario en en/es; 2 tests de `tests/pdp-line-total.spec.mjs` | FB-15, FB-13, FB-16, FB-49, FB-47, SO-08 |

---

## 7. Pasos de integración que quedan (en serie)

1. GPT entrega su PR, con la ADENDA-A a) y b).
2. Fusionar los dos PR en `master`, y luego `npm run gates:static` y Playwright.
3. Johandry aprueba el copy (D35): la sección 8 de esta entrega y la tabla de la entrega de GPT.
4. Claude aplica el copy aprobado de GPT en `locales/` (FO-03, G-I18N-04 y lo que proponga). Borra las claves huérfanas de FO-04 (`sections.homepage.manifesto.material_image_alt`, `password.image_alt`, `sections.complete_the_look.image_alt`, `sections.lookbook.image_alt`) y reescribe el `info` `sections.hero_editorial.settings.image_alt.info`.
5. Ledger: añadir las filas declaradas por GPT y cerrar la de tarjeta única cuando esté su `collection-list`.
6. Regenerar la ZIP y `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`, una sola vez y con todo integrado.
7. Compuerta 5 según la sección 6. Solo entonces se pueden pasar filas a `cumplido`.

---

## 8. Textos para aprobación de Johandry (D35)

Sacados del diff `2e94454..8dcedc2` de `locales/en.default.json`, `locales/es.json`, `locales/en.default.schema.json` y de los schemas de `sections/bento-discovery.liquid` y `sections/cart-drawer.liquid`. `[x]` es un marcador que se sustituye en tiempo de ejecución.

### 8.1 Storefront: claves nuevas (no había texto anterior)

| Clave | Inglés | Español |
| --- | --- | --- |
| `sections.cart.quantity_updated` | Quantity of {{ title }} updated to {{ quantity }}. | Cantidad de {{ title }} actualizada a {{ quantity }}. |
| `sections.cart.gift_card_properties.email` | Recipient email | Correo del destinatario |
| `sections.cart.gift_card_properties.name` | Recipient name | Nombre del destinatario |
| `sections.cart.gift_card_properties.message` | Message | Mensaje |
| `sections.cart.gift_card_properties.send_on` | Send on | Enviar el |
| `sections.cart.shipping_unlocked` | Free shipping unlocked | Envío gratuito desbloqueado |
| `sections.cart.gift_remaining` | Add {{ amount }} for a gift | Añade {{ amount }} para recibir un obsequio |
| `sections.cart.gift_unlocked` | Gift unlocked | Obsequio desbloqueado |
| `sections.featured_product.region_label_numbered` | Featured product {{ number }} | Producto destacado {{ number }} |
| `products.product.view_product` | View product | Ver producto |
| `products.product.quantity_rules.min` | Minimum {{ quantity }} | Mínimo {{ quantity }} |
| `products.product.quantity_rules.max` | Maximum {{ quantity }} | Máximo {{ quantity }} |
| `products.product.quantity_rules.increment` | Sold in multiples of {{ quantity }} | De {{ quantity }} en {{ quantity }} |
| `predictive_search.error` | We could not load suggestions. Press enter to search the full catalog. | No pudimos cargar las sugerencias. Pulsa Enter para buscar en todo el catálogo. |

Nota de copy: en inglés «enter» va en minúscula y en español «Enter» en mayúscula; conviene unificarlo.

### 8.2 Editor del tema (`locales/en.default.schema.json`, solo inglés: el tema no trae schema en español)

| Clave | Antes | Ahora |
| --- | --- | --- |
| `sections.main_collection.blocks.promotion_tile.settings.position_in_grid.label` | Place after this many products | Position in grid |
| `sections.main_collection.blocks.promotion_tile.settings.position_in_grid.info` | Moves to the end of the grid when the collection has fewer products. | Position the tile takes in the grid. For example, 4 makes it the fourth item. Moves to the end of the grid when the collection has fewer products. |
| `sections.cart_drawer.settings.free_shipping_threshold.info` | Match your actual shipping rates and eligible markets in Settings > Shipping and delivery. This amount does not create a shipping rate, make express shipping free, or guarantee eligibility at checkout. | (igual) + « Leave empty or enter 0 to skip this step and show only the gift.» |
| `sections.cart_drawer.settings.atelier_gift_threshold.info` | Match an actual gift offer and its eligibility conditions. Configure any required products and discounts in Shopify. This amount does not add a gift or create a discount. | (igual) + « Leave empty or enter 0 to skip this step and show only free shipping.» |
| `sections.main_product.blocks.provenance.settings.show_unique_piece.info` | Requires documented uniqueness and a reviewed single physical item. Size variants, untracked inventory or overselling make the item ineligible. | (igual) + « This setting applies to every product that displays this block.» |

### 8.3 Defaults de schema (Nivel 2, DP-010)

| Archivo, ajuste | Antes | Ahora |
| --- | --- | --- |
| `bento-discovery`, sección, `eyebrow` | DISCOVER BY FORM / 04 | Discover by form |
| `bento-discovery`, bloque `card_featured`, `eyebrow` | [01] FEATURED COLLECTION | Featured collection |
| `bento-discovery`, bloque `card_editorial`, `eyebrow` | [02] MATERIAL STUDY | Material study |
| `bento-discovery`, bloque `card_featured`, `heading` | Sculptural layers | (sin default) |
| `bento-discovery`, bloque `card_featured`, `link` | /collections/all | (sin default) |
| `cart-drawer`, `free_shipping_threshold` | 150 | (sin default) |
| `cart-drawer`, `atelier_gift_threshold` | 250 | (sin default) |

Los dos umbrales del cajón no figuran en la tabla de la ADENDA-A d). Efecto: si el comerciante activa la barra (`enable_tiered_progress`, que por defecto está apagado) y no escribe importes, no se muestra nada. Ningún preset fija esos valores, así que las demos no cambian. Los `info` explican cómo saltarse una etapa, pero no dicen que con los dos vacíos no hay barra.

### 8.4 Pendientes de propuesta de GPT

- **FO-03:** `not_found.eyebrow` («Error / Archive index»), `not_found.title` («Object not found.») y `not_found.message` (en: «The requested page is not in our current series. It may have moved into the archive.»; es: «La página que buscas no forma parte de la serie actual. Es posible que haya pasado al archivo.»), en `locales/en.default.json:427` y `locales/es.json:427`. También el default de `sections/newsletter.liquid`.
- **G-I18N-04:** `settings_schema.animations.settings.motion_style.options.atelier` = «Atelier» (`locales/en.default.schema.json:23`).

---

## 9. Verificación

| Comando (en `8dcedc2` más esta documentación) | Resultado | Qué demuestra | Qué no demuestra |
| --- | --- | --- | --- |
| `npx playwright test tests/r3-cart.spec.mjs tests/r3-dialogs-focus.spec.mjs tests/r3-layout.spec.mjs tests/r3-search-filters-price.spec.mjs tests/slideshow-reconnect.spec.mjs` | `43 passed (16.9s)` | El JS y el CSS reales del repo se comportan como describen los tests, sobre marcado que reproduce el de los Liquid | El Liquid real, Shopify, la red real, móvil o lectores de pantalla |
| `npm run gates:ledger` | `Filas de requisito: 97` (37 / 55 / 4 / 1), `Incoherencias: 0` | Vocabulario, columnas, aritmética y que cada `archivo:línea` exista | Que la evidencia pruebe el requisito |
| `npm run gates:json` | sin errores | Que el JSON parsea | La semántica de los schemas |
| `npm run gates:static` | exit 0; Theme Check: `107 files inspected with no offenses found.` | Las compuertas estáticas del repo | Nada empírico |
| `gates:package` (dentro de `gates:static`) | `archivos: 107`, `sha256: 4ff4c1e597908e139f9fb1618fa0ffcb71e77f1d42dbd267caf4b9c5f59b2c7e` | Esta documentación no viaja en la ZIP | Que la ZIP sea la final (falta integrar a GPT) |

Afirmaciones falsables:

1. `git diff 2e94454..8dcedc2 -- locales/` añade exactamente las 14 claves de storefront de 8.1 en cada idioma y cambia exactamente las 5 cadenas de schema de 8.2.
2. `snippets/product-card.liquid` no muestra medios en `quick-buy__panel`, y ningún Liquid del tema define otra vista rápida.
3. `sections/slideshow.liquid:31` usa `section.index` sin respaldo para nil.
4. Ningún preset fija `free_shipping_threshold` ni `atelier_gift_threshold`, porque `rg` no los encuentra en `config/` ni en `listings/`.
5. La ZIP de `8dcedc2` tiene 107 archivos y el sha256 de arriba, y el commit de esta entrega no lo cambia, porque la fecha sale del último commit que toca rutas del tema.

---

## 10. Hallazgos extra fuera de alcance (sin tocar)

- La fila «Validación de Nombre contra Reglamento y Marcas» del ledger también cita el preset «Edition». No se corrige porque esta entrega solo tenía mandato para la fila de presets.
- Varias filas ajenas a R3 citan líneas de `assets/theme.js` y `assets/base.css` que R3 ha desplazado (por ejemplo, Recomendaciones del Cajón, `assets/theme.js:2865-2866`). `gates:ledger` no lo detecta porque solo comprueba el rango. Conviene un barrido en la integración.
- `agent-comms/RULES.md` (compuerta 5) sigue nombrando la tienda `tema-qkqpke0j.myshopify.com`. La vigente es `sartorial-theme-kvkzl39t` (D38). Lo corrige Gemini o Johandry.

---

## 11. Actualización del 2026-11-24 (después de `72aaee1`)

```text
Estado: textos aprobados por Johandry ("apruebo los textos, adelante con tus recomendaciones") y aplicados
        en los archivos de Claude. Compuerta 5 sigue ABIERTA. Rama de Claude en 97e050d. La de GPT, en 792d58f y sin fusionar, ya trae sus correcciones de la ADENDA-B, que están sin revisar.
Decisiones: DP-007 a DP-018 pasan a docs/decisions.md (D44 a D55). Siguen pendientes DP-019 y DP-020, que no
            tenían recomendación inequívoca, y se abren DP-021 (voz editorial), DP-022 (subida a la tienda) y DP-023
            (copy D6 que GPT añadió después de la entrega aprobada).
Ledger: 5 filas actualizadas, sin cambios de estado. 97 filas: 37 cumplido, 55 código completo,
        4 no verificado y 1 ausente.
ZIP desde 97e050d: 107 archivos, sha256 eaaaaaabfd86663e89fc9203923b0e9179dcdfcb73ff76a5bba5f3eb8a673547.
     El manifiesto no se regenera hasta la integración.
```

### 11.1 Commits nuevos

| Commit | Contenido |
| --- | --- |
| `26363b2` | Solo documentación. Revisión de la rama de GPT (`agent-comms/reviews/CLAUDE-review-GPT-R3-001.md`) y encargo de correcciones (`agent-comms/inbox-gpt/GPT-TASK-R3-001-ADENDA-B-correcciones.md`) |
| `a1339ae` | Aplica los textos aprobados en `locales/` y en los schemas de Claude: `info` del interruptor de la barra del cajón (`sections/cart-drawer.liquid:456`), defaults de `sections/newsletter.liquid` y respaldo de `section.index` vacío en `sections/slideshow.liquid:31-35` |
| `97e050d` | Ajustes de coherencia: eyebrow de la 404 «Error»; pestañas «Articles» / «Artículos»; eyebrow del newsletter «Newsletter» / «Boletín» |

### 11.2 Textos aplicados

Fuente: diff `72aaee1..97e050d`. Si `a1339ae` dejó un valor intermedio, se indica.

**Storefront** (`locales/en.default.json` y `locales/es.json`)

| Clave | Antes (en / es) | Ahora (en / es) | Origen |
| --- | --- | --- | --- |
| `not_found.eyebrow` | Error / Archive index / Error / Índice del archivo | Error / Error (en `a1339ae` fue «Error 404») | **criterio del líder** (GPT proponía «Page not found», que repite el título) |
| `not_found.title` | Object not found. / Página no encontrada. | Page not found / Página no encontrada. (es sin cambios) | GPT |
| `not_found.message` | The requested page is not in our current series. It may have moved into the archive. / La página que buscas no forma parte de la serie actual. Es posible que haya pasado al archivo. | The page you requested could not be found. / No se ha encontrado la página que buscas. | GPT |
| `sections.complete_the_look.add_selected.one` | Add {{ count }} piece to bag \| {{ total }} / Añadir {{ count }} pieza \| {{ total }} | Add {{ count }} item to cart \| {{ total }} / Añadir {{ count }} artículo al carrito \| {{ total }} | GPT |
| `sections.complete_the_look.add_selected.other` | Add {{ count }} pieces to bag \| {{ total }} / Añadir {{ count }} piezas \| {{ total }} | Add {{ count }} items to cart \| {{ total }} / Añadir {{ count }} artículos al carrito \| {{ total }} | GPT |
| `sections.complete_the_look.total_label` | Capsule total / Total de la cápsula | Total / Total | GPT |
| `search.results.article` | Journal / Diario | Article / Artículo | GPT |
| `search.tabs.articles` | Journal / Diario | Articles / Artículos | líder, para cuadrar con el singular |
| `predictive_search.articles` | Journal / Diario | Articles / Artículos | líder, para cuadrar con el singular |
| `newsletter.eyebrow` | Private correspondence / Correspondencia privada | Newsletter / Boletín | **criterio del líder** (sin propuesta) |
| `newsletter.heading` | Notes from the studio / Notas del estudio | Store updates / Novedades de la tienda | GPT |
| `predictive_search.error` | …Press enter… / (es ya decía «Pulsa Enter») | …Press Enter… / sin cambios | nota de copy de §8.1 |

**Editor** (`locales/en.default.schema.json`, solo inglés)

| Clave | Antes | Ahora | Origen |
| --- | --- | --- | --- |
| `settings_schema.animations.settings.motion_style.options.atelier` | Atelier | Classic | GPT (G-I18N-04) |
| `sections.hero_editorial.settings.image_alt.info` | Describe the image for customers using a screen reader. Leave empty to use the heading. | Describes the image for screen readers. Leave blank to use the image's own alternative text, or none when a heading already explains it. | GPT proponía «Describe the image for screen reader users. Leave blank to use the image's alt text.»; la redacción aplicada es del líder |
| `sections.cart_drawer.settings.enable_tiered_progress.info` | (no existía) | The bar stays hidden until at least one threshold is set, and when customers shop in a currency other than the store currency. | recomendación aprobada; redacción del líder |

**Defaults de schema** (`sections/newsletter.liquid`)

| Ajuste | Antes | Ahora | Origen |
| --- | --- | --- | --- |
| `eyebrow` | Private correspondence | Newsletter | **criterio del líder** |
| `heading` | Notes from the atelier | Store updates | **criterio del líder** (coincide con `newsletter.heading`) |

Además de los dos textos de criterio del líder que se registran en D44, hay otras tres redacciones del líder que no estaban literalmente en lo aprobado: el `info` del alt del hero, el `info` del interruptor del cajón y el plural «Articles». No consta que se hayan presentado a Johandry palabra por palabra y siguen siendo revisables.

Nota de copy: el `info` del interruptor del cajón se puede leer mal. Una redacción más clara sería «The bar is hidden until at least one threshold is set. It is also hidden when customers shop in a currency other than the store currency.».

Localizadores del schema que cambian respecto a §2.6 y §8: FB-55 está ahora en `:1471`, FB-11 en `:1411` y los `info` del cajón en `:1184-1195`. «Atelier» sigue en `:23`.

### 11.3 Estado de la rama de GPT y de los pull requests

| | Estado |
| --- | --- |
| `gpt/r3-copy-plantillas` | La revisión se hizo sobre `94f7b03`. Después GPT publicó `03cddcb` (`fix(r3): repair blog pagination and edge cases`, 17:04 UTC) y `792d58f` (actualiza su entrega, 17:10 UTC): declara aplicados D1 a D6 de la ADENDA-B. La Adenda A ya estaba aplicada, incluido el `sizes` de collection-list. **Sigue sin considerarse fusionable** hasta que Claude revise esos dos commits. |
| PR #24 (GPT) | Abierto en borrador. |
| PR #23 (Claude) | Abierto en borrador. HEAD `97e050d` más este commit de documentación. No es publicable sin el PR #24. |
| Encargos a GPT | ADENDA-B (obligatoria): entregada en `03cddcb`, pendiente de revisión. ADENDA-C, nueva: su copy queda aprobado y se le informa de los textos ya aplicados. El default «bag» → «cart» de `sections/complete-the-look.liquid` ya está hecho en su rama (línea 408 en `792d58f`; en `94f7b03` era la línea 404 y decía «bag»), así que no se le pide nada nuevo. |
| Copy D6 de GPT | Llegó en `03cddcb`, después de la entrega que Johandry aprobó: «Engineered for high telemetry» → «Objects for everyday use» (Imprint), descripción del lookbook de `templates/index.json` → «Explore the collection.», se retira el bloque CTA sin URL de `templates/page.faq.json` y el default «Contact us» de `sections/main-faq.liquid` queda vacío. No está en D44; queda en DP-023, con recomendación de aprobarlo. |

### 11.4 `scripts/translations/es.storefront.json` (comprobación)

- **Qué es:** el diccionario de `scripts/translate-storefront.mjs`. Ese script registra por la Admin API (`translationsRegister`) las traducciones al español del **contenido de la tienda**: valores de las plantillas JSON, el grupo de cabecera, páginas, enlaces, menús y colecciones. Ninguna entrada de `package.json` ni del CI lo invoca.
- **No regenera `locales/es.json`:** solo escribe con `--emit` (lotes GraphQL). Sus rutas, por ejemplo `index.json` → `newsletter.eyebrow`, son ajustes de sección de `templates/index.json`, no claves de locale. No puede revertir los textos de R3.
- **Está desincronizado, pero desde antes de R3:** `node scripts/translate-storefront.mjs --check` da «89 problemas» tanto en `master` (`2e94454`) como en esta rama. R3 de Claude no toca plantillas. Tras fusionar la rama de GPT, que cambia copy de `templates/` y `listings/`, aumentarán las entradas desfasadas.
- **No causa daño silencioso:** el script solo registra una traducción si el sha256 del inglés coincide con el texto vivo. Una entrada desfasada se informa y no se registra.
- **Pendiente (paso 7 de 11.5):** antes de registrar traducciones en la tienda para la compuerta 5, regenerar el diccionario contra las plantillas integradas. Mientras tanto, el contenido de plantillas que haya cambiado se verá en inglés en `/es`. No se edita en esta entrega.

### 11.5 Pasos que quedan para la integración (en serie)

1. Hecho por GPT en `03cddcb`, sin revisar: correcciones de `sections/main-blog.liquid` según la ADENDA-B (D1 y D2 obligatorios, D3 a D5 recomendados), D6 y el default «bag». Si la revisión pide algo más, va en la misma rama y sin force-push.
2. Claude revisa `03cddcb` y `792d58f` con una nueva revisión en `agent-comms/reviews/`; Johandry decide DP-023 (copy D6).
3. Fusionar los PR #23 y #24 en `master`, y luego `npm run gates:static` y Playwright.
4. Tras la fusión, borrar las claves huérfanas de locale. Son 5: `sections.lookbook.image_alt`, `sections.complete_the_look.image_alt`, `sections.homepage.manifesto.material_image_alt`, `password.image_alt` y `sections.homepage.marquee.region_label`. `sections.slideshow.region_label` vuelve a usarse desde `a1339ae`.
5. Ledger: añadir las filas de GPT y cerrar la de tarjeta única.
6. Regenerar la ZIP y `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`, una sola vez.
7. Regenerar `scripts/translations/es.storefront.json` contra las plantillas integradas (11.4) antes de registrar traducciones.
8. Compuerta 5 en `sartorial-theme-kvkzl39t` según §6, después de que se resuelva DP-022 (subida del tema de desarrollo, no antes de la integración).
