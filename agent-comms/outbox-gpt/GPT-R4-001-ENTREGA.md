# Entrega GPT-R4-001 — correcciones R4A

Fecha: 2026-11-25. Rama: `gpt/r4-ficha-demo`. Estado: lista para nueva revisión de Claude en el PR borrador **#26** contra `master`. Tip de esta entrega: `4ef4663` (la ZIP empaqueta el último commit que afecta al tema, `0bf5574`). No se aplicaron cambios en ninguna tienda ni se publicó o borró ningún tema.

## 1. Reconciliación de la entrega anterior

- **M-19** se corrigió en `assets/theme.js` (renderizado y anuncio de búsqueda predictiva). `snippets/predictive-search.liquid` aporta las cadenas y el marcado, pero no contiene la corrección de sustitución ni del estado vivo.
- Los JSON bajo `listings/` **sí contenían handles de colecciones demo**; no eran neutrales. Ahora los enlaces empaquetados apuntan a `/collections/all`; los handles específicos viven en los overlays.
- Los nombres de fixtures de la entrega anterior no conservaban todos los casos límite: faltaban handles vistos en R2, se perdía el límite de 120 caracteres y una chaqueta se llamaba knit. Quedó corregido y cubierto por el plan T1.
- Los planes anteriores **no eran idempotentes en el sentido del encargo**. Ahora son documentos deterministas de intenciones con valores de referencia procedentes de archivos/snapshots; no leen ni comparan con el estado actual. La idempotencia corresponde al procedimiento de aplicación con lectura previa.
- El **PR #26 ya existe**, en borrador; no se abrió otro. El tip ya no es `e8531e9`: los commits de corrección se añadieron encima de `84ff2bd`, sin rebase ni force-push.
- `npm run gates:static` pasó después de cada commit de código, tests y planes de este pase. La salida observada tras cada ejecución aparece resumida en §4; no atribuyo a un gate verificaciones que no realiza.

## 2. Cambios R4A-1 a R4A-18

En la tabla, “antes” identifica el comportamiento comprobado con `84ff2bd` (para JavaScript se usó `R3_THEME_JS=/tmp/old-theme.js`); “después” identifica el test con el código actualizado. A3 es una actualización documental del ledger; A7 añade cobertura, sin cambio funcional.

| Punto | Resultado y localizador | Test: antes → después | `gates:static` tras commit |
|---|---|---|---|
| **R4A-1** | URLs de raíz y presets neutrales; handles solo en overlays. Eliminado el duplicado Sartorial idéntico. `sections/header-group.json`, `listings/{imprint,archive}/sections/header-group.json`, `docs/demo-store/overlays/README.md`. | `tests/r4-preset-copy.spec.mjs`: fallan las aserciones por handle raíz/listing y duplicado Sartorial → 8 tests relacionados pasan, incluidos enlaces de overlay contra los catálogos. | `6684e48`, verde; 110 entradas del tema. |
| **R4A-2** | `moveMediaToStart` intercambia `sizes` en `img` y `picture > source`; `assets/theme.js:330`. | `tests/r4-product-layout.spec.mjs`: 2 tests fallan con la figura seleccionada aún a 30vw → pasan para producto y featured product a 1440 px. | `5620c4e`, verde; Theme Check 110. |
| **R4A-3** | Filas 39, 85 y 130 del ledger citan cálculo/medios actualizados y tests reales; estados intactos. `docs/requirements-ledger.md`. | No aplica: solo documentación. `npm run gates:static` ejecuta `ledger-verify`, que pasa sin incoherencias; no prueba por sí solo la evidencia humana. | `4d2c702`, verde. |
| **R4A-4** | Títulos de fixtures y búsqueda condicional por handle en `docs/demo-store/scripts/catalog-r4-data.mjs` y `catalog-r4.mjs`. | `tests/r4-catalog-runs.spec.mjs`: la aserción de título de 120 caracteres falla antes; pasa después. Comprueba también “Many-Variant Tailored Jacket”, no Knit, y búsqueda/omisión de handles ausentes. | `6efe1c3`, verde; Theme Check 110. |
| **R4A-5** | Se mide el medio ya seleccionado y se desplaza si queda por encima de `--header-offset` o bajo la ventana. `assets/theme.js:741-749`. | `tests/r4-product-layout.spec.mjs`: con JS de `84ff2bd`, medio seleccionado queda en `top=-300` aunque la galería esté parcialmente visible → queda dentro de la ventana después. La prueba C1b también se actualizó para espiar el medio seleccionado. | `c24a947` y ajuste de prueba `613dc4b`, ambos verdes. |
| **R4A-6** | Sustitución literal mediante callback en el mensaje vacío y “View all”. `assets/theme.js:6200-6220`. | Test con `a$&b`: JS de `84ff2bd` produce `a[terms]b` en el mensaje → mensaje y enlace muestran `a$&b` literalmente. | `1bdbed1`, verde; Theme Check 110. |
| **R4A-7** | Tests de barra sticky con markup del `sticky-cart-bar` de `sections/main-product.liquid`; 1440×674, 1536×674 y columna sticky a 1440×1100. `tests/r4-product-layout.spec.mjs`. | No había cobertura de estas dimensiones → 3 escenarios pasan. `sizes` se cubre con los dos tests de A2. No se renderizó Liquid real sin JS: no existe un renderer de fixtures Liquid en el repo y no añadí dependencias; se conserva la prueba de cadenas existente y queda un paso manual en §8. | `f128896`, verde; Theme Check 110. |
| **R4A-8** | T2/T3 en `role: qa` generan solo omisiones explicadas, incluidas las colecciones. `docs/demo-store/scripts/catalog-r4.mjs:197-216`. | `tests/r4-catalog-runs.spec.mjs`: antes T2 incluía activación, inventario, publicación y colecciones; la nueva expectativa de cero intenciones falla → T2 y T3 tienen 0 intenciones y 17/14 omisiones, respectivamente. | `d392ae8`, verde. |
| **R4A-9** | Artículo renombrado a `a-study-in-proportion`; `redirects_planned:false` y aviso explícito de que no se planea redirección. `catalog-r4-data.mjs:85-90`, `catalog-r4.mjs:157-166, 276-279`. | Test de intención old handle → nuevo handle y ausencia de redirección: falla por ausencia de esos campos → pasa. | `d392ae8`, verde. |
| **R4A-10** | CLI `--inventory <n>`, entero no negativo, default 8; valor incluido en todos los JSON. `catalog-r4.mjs:251-278, 312-329`. | Test CLI `--inventory 3`: el JSON anterior no contiene `inventory_target` → guarda 3; el default guarda 8; rechaza negativos. | `d392ae8`, verde. |
| **R4A-11** | Autor editorial ficticio por preset en `catalog-r4-data.mjs:7-11`; planificador usa `store.preset`. | Test de autor anterior `proyect-shopi` → nombres por preset y ningún `proyect-shopi` en el plan. | `d392ae8`, verde. Autores propuestos; pendientes de aprobación D35. |
| **R4A-12** | JSON lleva `plan_kind: mutation-intents`, `executable_graphql:false`, `baseline.live_store_read:false`; sin `idempotent`, `currentValues`, `targetState`, `operations` ni `changes`. `catalog-r4.mjs:251-305`. | Tests de forma/intenciones y determinismo: documento antiguo con `changes`/`operations` y metadato idempotente → nuevo contrato explícito; nada se aplica ni lee. | `d392ae8`, verde. |
| **R4A-13** | El status accesible anuncia el mismo mensaje de cero resultados. `assets/theme.js:6237-6243`. | Antes anunciaba `0 results` → anuncia el mensaje existente con el término. `tests/r3-search-filters-price.spec.mjs`. | Código en `1bdbed1`, test separado en `3ce82cf`; ambos commits con gate verde. |
| **R4A-14** | Comentario CSS describe el fallback de flecha nativa. `assets/base.css:7679-7681`. | Test de comentario actualizado no coincide con el texto obsoleto de `84ff2bd` → pasa. | `27f7200`, verde. |
| **R4A-15** | Mensaje fuera de rango ya no promete un enlace que no existe. `locales/en.default.json:357`, `locales/es.json:357`. | Test de copy espera frases cortas sin “return/journal” ni “volver/diario”; el locale anterior no satisface la expectativa → pasa. | `27f7200`, verde. |
| **R4A-16** | Nueva `listings/sartorial/templates/product.gift-card.json`, copia de raíz con `media_layout: split_screen` y sin acordeón de cuidado. | `tests/r4-minor-template.spec.mjs`: antes el archivo de listing no existía → ahora coincide con plantilla regalo raíz salvo layout del preset. | `27f7200`, verde; restaura el recuento del ZIP a 111. |
| **R4A-17** | `data-zoom-label-template` en `sections/main-product.liquid:123-130`; `refreshZoomLabels()` tras montaje y reordenamiento en `assets/theme.js:618-620, 766-772`. `data-zoom-open` conserva el índice de `zoom_images`. | Test en orden reordenado: JS de `84ff2bd` conserva “Zoom image 7 of 7” → anuncia “Zoom image 1 of 7” y mantiene `data-zoom-open="6"`. | `27f7200`, verde. |
| **R4A-18** | Tabla de fotos del README alinea Sartorial `image_2` con Tailoring y Archive con Selected pieces. `docs/demo-store/overlays/README.md:11,13`. | `tests/r4-demo-overlays.spec.mjs`: ahora comprueba esas dos etiquetas; test previo no tenía esas expectativas → 4 tests pasan. | Prueba añadida en `4ef4663`, gate verde. |

### Limitación de `?variant=` sin JavaScript

El repo no trae renderer Liquid ni fixtures capaces de montar `sections/main-product.liquid` con un producto de prueba. No añadí librerías. Se mantiene la prueba de estructura/cadenas Liquid en `tests/r4-product-layout.spec.mjs`; confirmar en tienda que la primera figura del HTML sin JS corresponde a `selected_media_id` y a `?variant=` queda pendiente de la checklist de §8.

## 3. Planes T1–T3 regenerados

Los seis `docs/demo-store/plans/catalog-r4-*.json` se regeneraron con `catalog-r4.mjs`; no se editaron a mano. Cada uno declara `plan_kind: mutation-intents`, `executable_graphql:false`, `mutations_sent:0`, `inventory_target:8` y `baseline.live_store_read:false`. La aplicación futura debe hacer lectura previa y revisar cada intención; los documentos no son GraphQL ni instrucciones ejecutables. QA T2/T3 no pide cambios: solo presenta omisiones con motivos.

| Archivo | Intenciones | Omitidos |
|---|---:|---:|
| `catalog-r4-qa-t1.json` | 735 | 0 |
| `catalog-r4-demo-sartorial-pending-t1.json` | 735 | 0 |
| `catalog-r4-qa-t2.json` | 0 | 17 |
| `catalog-r4-demo-imprint-pending-t2.json` | 27 | 0 |
| `catalog-r4-qa-t3.json` | 0 | 14 |
| `catalog-r4-demo-archive-pending-t3.json` | 26 | 0 |

Validé automáticamente: JSON parseable; ninguna cadena `gid://shopify/`, token o secreto; los planes QA T2/T3 tienen 0 intenciones. No se contactó Shopify Admin ni storefront.

## 4. Tests y compuertas

- **Playwright offline:** 63/63 pasaron en Chromium del sistema, con `/tmp/r4-playwright.config.mjs`, para carrito, búsqueda, layout, producto, fixtures, presets, overlays y nuevos puntos R4A.
- La pasada general de Playwright no pudo completarse: dos casos `pdp-line-total` intentaron abrir `http://127.0.0.1:9292/collections/all`; el servidor local no estaba disponible y devolvió `ERR_CONNECTION_REFUSED`. Detuve la ejecución; no se accedió a una tienda Shopify. Los tests `pdp-line-total` que requieren ese storefront quedan sin verificar aquí.
- `npm run gates:static` pasó tras cada commit de código/tests/planes: `6684e48`, `5620c4e`, `4d2c702`, `6efe1c3`, `c24a947`, `1bdbed1`, `f128896`, `d392ae8`, `27f7200`, `242df84`, `3ce82cf`, `613dc4b`, `0bf5574` y `4ef4663`.
- En la última salida completa: 898 JSON válidos; 111 archivos Theme Check sin ofensas; referencias estáticas de locale sin resolver: 0; ledger: 103 filas, 0 incoherencias; `node --check` pasa para JS; `internal references: none`; el empaquetado de gate informa 111 archivos. El gate no sustituye la revisión manual de la evidencia del ledger.

## 5. ZIP y manifiesto

Generados una sola vez al cierre, desde el último commit que cambia archivos del tema, `0bf55749e02d2ce09a92cddcbebaa394b1305b20`:

- ZIP: `Sartorial-1.0.0.zip`; 111 archivos; 333907 bytes.
- SHA-256: `c3b4616102a62167e1c0de113a1e14e9c71acd054aff1054e0b5f5482cd5e9f6`.
- Huella de contenido independiente de zlib: `2d8e42eb7b0855b3a7ed15f689d69e68ba7ac60dd59878376578295426693846`.
- Manifiesto: `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`, cabecera de 10 líneas y 111 hashes de archivo en orden ZIP; commit `6d79b3a`.
- `internal references: none`; `unzip -t` sin errores; `node --check` en `assets/theme.js` y `assets/product-zoom.js` extraídos. Declarada **no validada en tienda**.
- Respecto a la ZIP R4 de 111 entradas: R4A-1 quitó el grupo Sartorial duplicado (−1) y R4A-16 añadió la plantilla regalo Sartorial (+1). Total final: 111.
- El empaquetado del gate escribe `dist/theme.zip` en cada `gates:static`; no es la ZIP canónica. Solo se generó una vez la ZIP canónica y su manifiesto.

## 6. Copy para aprobación D35: antes → propuesta

Nada de esta lista se considera aprobado salvo **“Popular pieces”** (D66). Los autores son ficticios, no cuentas reales.

### Fixtures y catálogo T1

- `fixture-media-3d-video`: “Studio Form Coat” → “Studio Form Object”.
- `fixture-many-variants`: “Multi-Option Knit” → “Many-Variant Tailored Jacket”.
- `fixture-long-title`: “Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt, Oversized Collar and Longline Shape” → “Double-Breasted Merino Overcoat with a Detachable Collar”.
- Nuevas propuestas para handles vistos en R2: `fixture-focal-point` → “Focal-Point Scarf”; `fixture-color-only` → “Leather Belt in Three Colors”; `fixture-long-swatches` → “Long-Swatch Overshirt”. Se buscan por handle y se omiten si no existen.
- `long-title-fixture-wrap-coat`: “Long Title Fixture Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt and Oversized Collar in Soft Ink Navy” → “Double-Faced Wool and Cashmere Wrap Coat with Detachable Belt, Oversized Collar and Longline Silhouette in Soft Ink Navy” (exactamente 120 caracteres).
- Otros fixtures sin cambio de copy: “Ribbed Cotton Jersey Tee” y “Cotton Jersey Long-Sleeve Tee”.
- “Studio Demo” → vendors ficticios por preset: Sartorial “Line & Form”, Imprint “Field & Form”, Archive “Archive Index”.
- Autor anterior “proyect-shopi” → Sartorial “Mara Ellery”; Imprint “Eli Mercer”; Archive “Rowan Vale”. Pendientes de aprobación D35.

### Descripciones de productos

Para cada producto se eliminó el sufijo de demo “Demo product for theme preview. Replace this text with your own description.” y se propone el texto editorial siguiente; los fragmentos previos son el texto de origen inmediatamente anterior a ese sufijo.

| Handle | Texto anterior → nuevo |
|---|---|
| `serra-coat` | “A long wrap coat in a neutral palette, shown with three colours and five sizes.” → “A long wrap coat with a quiet line through the body.” |
| `doppio-trench` | “A double-breasted trench in two colours.” → “A double-breasted trench with a clean, straight profile.” |
| `cocoon-cardigan-coat` | “An open-front knit coat with a rounded shape.” → “An open-front knit coat with a rounded silhouette.” |
| `nove-blazer` | “A single-breasted blazer with notch lapels.” → “A single-breasted blazer with notch lapels.” |
| `cropped-tailored-jacket` | “A cropped jacket offered in two colours and two fabric options.” → “A cropped jacket with a compact shape and considered proportions.” |
| `pleated-wide-trouser` | “A wide-leg trouser with front pleats.” → “A wide-leg trouser with front pleats.” |
| `cigarette-trouser` | “A slim straight trouser.” → “A straight trouser with a narrow leg.” |
| `cashmere-rib-crew` | “A ribbed crew-neck knit.” → “A ribbed crew-neck knit.” |
| `fine-merino-turtleneck` | “A fine-gauge turtleneck.” → “A fine-gauge turtleneck with a close, clean line.” |
| `oversized-alpaca-knit` | “An oversized jumper with a dropped shoulder.” → “An oversized jumper with a dropped shoulder.” |
| `poplin-column-shirt` | “A long straight shirt.” → “A long, straight shirt with a clean collar.” |
| `silk-charmeuse-blouse` | “A fluid blouse with a soft collar.” → “A fluid blouse with a soft collar.” |
| `striped-cotton-shirt` | “A striped shirt with a classic collar.” → “A striped shirt with a classic collar.” |
| `bias-cut-slip-dress` | “A slip dress with narrow straps.” → “A slip dress cut on the bias with narrow straps.” |
| `wrap-wool-skirt` | “A midi wrap skirt.” → “A midi wrap skirt with a clean front.” |
| `pleated-midi-skirt` | “A pleated midi skirt.” → “A pleated midi skirt with a fluid line.” |
| `leather-belt` | “A plain belt with a metal buckle.” → “A plain belt with a metal buckle.” |
| `cashmere-scarf` | “A wide scarf in one size.” → “A wide scarf in one size.” |
| `silk-twill-square` | (sin descripción) → “A square scarf in silk twill, shaped for versatile styling.” |
| `structured-tote` | “A structured tote bag with two handles.” → “A structured tote bag with two handles.” |
| `long-title-fixture-wrap-coat` | “Fixture with a 120-character title.” → “A double-faced wool and cashmere wrap coat with a detachable belt and oversized collar.” |

### Artículos, handle y gift card

- `welcome-to-the-demo-store` → `a-study-in-proportion`, derivado del título nuevo. No se planifica redirección. Título anterior “Welcome to the demo store” → “A study in proportion”; cuerpo anterior “This store is used to preview the theme. Replace this article with your own news.” → “A line begins at the shoulder, then softens through the body. We look at proportion as a way to bring ease to the pieces worn every day.”; tags `news` → `journal`, `tailoring`.
- `how-to-read-the-size-chart`: título “How to read the size chart” → “How to read garment measurements”. Cuerpo anterior “Sizes in this demo go from XS to XL. Replace this text with your own measurements and advice.”; propuesta anterior de R4 “Compare the measurements below each size with a similar piece that fits you well. Check the shoulder, chest and length before choosing a size.” → “Lay a similar piece flat and compare its shoulder, chest and length with the measurements in this size guide. Choose the closest match.”; tags `guide` se mantienen y se añade `fit`.
- Gift card: “This is a gift card for the store.” → “A gift card for a piece chosen by its recipient.”
- Titular alternativo para aprobación (no aplicado): Imprint “Engineered utility, precise discipline” → **“Objects for the working day.”**

### Locales y copy de blog fuera de rango

| Clave | Inglés anterior → propuesto | Español anterior → propuesto |
|---|---|---|
| `blogs.blog.page_out_of_range` | “There are no essays on this page. Return to the journal to browse all stories.” → “There are no essays on this page.” | “No hay ensayos en esta página. Vuelve al diario para consultar todas las historias.” → “No hay ensayos en esta página.” |
| `predictive_search.no_results` | La misma frase con `[terms]` queda anunciada tal cual: “No matches for ‘[terms]’. Try a different search or view all results.” | “No hay resultados para «[terms]». Prueba otra búsqueda o consulta todos los resultados.” La sustitución ahora conserva literalmente signos `$` del término escrito. |
| `not_found.recommendations` | “Popular pieces” (aprobado D66; sin cambio) | “Piezas populares” (copy propuesto de R4). |

### Presets y cabeceras

Propuestas de Imprint: “Desk objects and accessories for work and everyday routines.”; “Browse the collection”; “Technical studio”; “Daily objects”; “Desk and study”; “Daily carry”; “Everyday carry systems”; “Object details”; “The collection”; “Collection, product, process”; “A denser view of the working collection.”; “Leather goods”; “Desk objects for daily use”; “A modular carry”; “Pieces for daily carry”; “An arrangement of pieces for work and everyday routines.”; “An arrangement for work and daily routines.”; “Studio principles”; “Useful forms begin with the work they do.”; “Studio notes”. El titular alternativo está arriba y no se aplicó.

Propuestas de Archive: “Catalog / the house”; “Curatorial notes”; “Archive collection”; “Permanent archive”; “Garments and objects”; “Selected pieces”; “The archive”; “Archive pieces”; “Collection highlights”; “Explore the collection.”

Cabeceras de presets: “Explore the collection”, “New forms”, “Permanent collection”, “Tailoring”, “Daily objects”, “Desk and study”, “Leather goods”, “Restored pieces”, con los subtítulos de los JSON de `listings/*/sections/header-group.json`. Todos pendientes de aprobación D35 salvo la etiqueta antes indicada.

## 7. Ledger y pendientes de tienda

No se cambió el estado de las filas 39, 85 ni 130; tampoco se marca como cumplido algo que requiere catálogo o storefront real. `npm run gates:static` deja el ledger sin incoherencias, pero su estado sigue sujeto a revisión de Claude.

La ZIP no se subió a Shopify y no se hizo revisión visual de producto/mercado/idioma. La asignación `templateSuffix=gift-card` requiere leer/aplicar el catálogo por un operador autorizado; la plantilla de listing ya respeta Sartorial. T1 no se ejecutó y los medios por variante siguen pendientes de comprobación real.

## 8. Checklist para Johandry

- [ ] Confirmar si `sartorial-theme-kvkzl39t` es development o client transfer (DP-024).
- [ ] Crear las tres tiendas client transfer, una por preset (D67), y darles su nombre/marca.
- [ ] Configurar gateway de prueba y desactivar métodos de pago no usados; no usar tarjetas/datos reales.
- [ ] Habilitar ventas y envío a Canadá o retirar ese mercado.
- [ ] Elegir y acreditar derechos de imagen (DP-025); subir recursos de las tres photo maps.
- [ ] Con autorización, hacer lectura previa y revisar T1–T3; decidir inventario objetivo, ubicación activa y valores de cada intención. QA T2/T3 no se aplican.
- [ ] En tema sin publicar, comprobar `?variant=` sin JS, medio primero, etiquetas de zoom, tamaños de imagen y barra sticky en las tres resoluciones de A7.
- [ ] Aplicar overlays a temas sin publicar, verificar y publicar cada preset solo por el proceso autorizado de Johandry.
- [ ] Aprobar copy D35: producto, artículos, handle/redirect, titulares de presets y los autores ficticios Mara Ellery (Sartorial), Eli Mercer (Imprint) y Rowan Vale (Archive).
- [ ] Confirmar la plantilla regalo y el mensaje de página de blog fuera de rango en tienda.

## 9. Commits de corrección

`6684e48`, `5620c4e`, `4d2c702`, `6efe1c3`, `c24a947`, `1bdbed1`, `f128896`, `d392ae8`, `27f7200`, `242df84`, `3ce82cf`, `613dc4b`, `0bf5574`, `6d79b3a` y `4ef4663`. No se tocaron `agent-comms/BOARD.md` ni `docs/decisions.md`. No se hizo push a la rama de Claude, no hubo force-push ni rebase.
