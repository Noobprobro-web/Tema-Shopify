# Entrega GPT-R4-001

Fecha: 2026-11-25. Estado: implementación lista para revisión de Claude; sin aplicación de cambios a tiendas.

## 1. Rama, commits y PR

- Rama nueva `gpt/r4-ficha-demo`, desde `origin/master` verificado en `44c7cbe5dec8c5f188af12484e264bf493d36032`.
- Commits R4: `73ce4a1` Ajusta sticky de ficha y producto destacado; `3694d9b` Prioriza el medio de variante en las galerías; `f40649b` Muestra todos los medios del producto destacado; `171a24f` Corrige búsqueda, selector de país y estado del carrito; `e7723f1` Afina 404, tarjeta regalo y vacíos de búsqueda y blog; `585359c` Adapta el copy de Imprint y Archive y sus mega menús; `c3af0fb` Añade planes secos idempotentes de catálogo T1-T3; `de943d4` Prepara overlays de home para las tres demos.
- El primer push de la rama se aceptó. La creación del PR borrador con `gh pr create --draft` devolvió `Post "https://api.github.com/graphql": Forbidden`; no pude obtener un enlace ni confirmar un PR. Reintentar tras el push final.
- No se tocó `agent-comms/BOARD.md`, no se hizo force-push y no se publicó ni borró ningún tema.

## 2. Cambios por paquete y localizadores finales

- **C1 · M-10/M-06:** `assets/theme.js:295` observa el alto del panel y header, aplica/retira la condición sticky y limpia observadores; montaje en `assets/theme.js:596` y `:872`. CSS condicional en `assets/base.css:5116`, `:1399`, `:9090`. El medio seleccionado aparece primero en `sections/main-product.liquid:45` y `sections/featured-product.liquid:39`; el zoom conserva su índice sobre `zoom_images` en `sections/main-product.liquid:68`. En la galería móvil se conserva el orden e índice del carrusel.
- **C1 · M-15:** se quitó la regla que ocultaba imágenes desde la sexta en `assets/base.css` (galería destacada, alrededor de `:10819`).
- **C2 · M-13/M-16/M-19/M-20:** selección del término al abrir predictiva en `assets/theme.js:6064`; estado vacío anunciado solo por lector de pantalla en `assets/theme.js:4001` y `:4414`; wrapper del selector de país limitado al `<select>` en el snippet de localización y chevron asociado en `assets/base.css:7630`; se quitó la repetición de tipo de resultado en `snippets/predictive-search.liquid`.
- **C3 · M-17/M-18/M-27/M-28:** composición del buscador 404 en `assets/base.css:7367`; etiqueta aprobada “Popular pieces” en `locales/en.default.json:432`; plantilla `templates/product.gift-card.json` omite el acordeón `composition_care`; estado de página de blog fuera de rango en `sections/main-blog.liquid:184`; textos de búsqueda sin resultados en `locales/en.default.json:663`, `locales/es.json:663` y `assets/theme.js`.
- **C4 · M-14:** copy de Imprint/Archive y cabeceras completas por preset en `listings/{sartorial,imprint,archive}/sections/header-group.json`; Sartorial también en `sections/header-group.json`. Copia editorial en `listings/imprint/templates/index.json`, `listings/archive/templates/index.json` y `listings/archive/templates/collection.json`.
- **T1–T3:** scripts, allowlist y datos en `docs/demo-store/scripts/catalog-r4.mjs:1`, `catalog-r4-data.mjs:1`, `catalog-r4-stores.json:1`. Planes guardados en `docs/demo-store/plans/catalog-r4-*.json`. El autor provisional solicitado, `proyect-shopi`, está en `catalog-r4.mjs:16`.
- **P1:** los tres overlays están en `docs/demo-store/overlays/{sartorial,imprint,archive}/{templates/index.json,sections/header-group.json}`. Fuentes de imagen pendientes y procedimiento de aplicación están en `docs/demo-store/overlays/README.md:5`.

## 3. Ledger: propuesta para Claude

No propongo cerrar filas que necesitan una tienda real. Dejar en `código completo` y referenciar los tests nuevos:

- `PDP: variante y medio seleccionado` / M-06 — `tests/r4-product-layout.spec.mjs` y `sections/main-product.liquid:45`; falta asociar medios con T1 y comprobar la ficha en tienda.
- `Sticky product information` / M-10 — `tests/r4-product-layout.spec.mjs`; falta subir un tema sin publicar y probar storefront real.
- Búsqueda, localización y mensajes del carrito / M-13, M-16, M-19, M-20 — `tests/r4-header-search-cart.spec.mjs`, `tests/r3-cart.spec.mjs`.
- 404, tarjeta regalo, blog y búsqueda predictiva / M-17, M-18, M-27, M-28 — `tests/r4-minor-template.spec.mjs`; la plantilla de regalo y los textos necesitan aplicación/observación en tienda.
- Copy específico de presets / M-14 — `tests/r4-preset-copy.spec.mjs`; aplicación visual por preset pendiente.
- Overlays P1 — `tests/r4-demo-overlays.spec.mjs`; valida JSON y handles contra los catálogos de origen, no que los handles ya existan en tiendas demo.
- **3 Tiendas Demo Auténticas** permanece `no verificado` (fila 121 de `docs/requirements-ledger.md`); T1–T3 y P1 están preparados, pero no se ejecutaron en las tiendas destino.

## 4. Pruebas y gates

Los nuevos tests se ejecutaron con Playwright/Chromium del sistema (`/usr/bin/chromium`) y configuración temporal en `/tmp/r4-playwright.config.mjs`, porque el navegador administrado de Playwright no estaba disponible en este entorno.

- `tests/r4-product-layout.spec.mjs`: 2 pruebas de M-10 fallaron con el código anterior y pasaron con C1a; con C1b las pruebas de galería/foco/móvil también fallaron antes y pasaron después (6 pasaron al completar C1).
- `tests/r4-featured-product-media.spec.mjs`: CSS anterior falló al ocultar medios desde la sexta; 1 pasó después.
- `tests/r4-header-search-cart.spec.mjs` y `tests/r3-cart.spec.mjs`: M-13/M-16/M-19/M-20 fallaron con los assets anteriores; las 5 pasaron después.
- `tests/r4-minor-template.spec.mjs`: 4 fallaron en el estado previo a C3; 4 pasaron después.
- `tests/r4-preset-copy.spec.mjs`: 2 fallaron antes de C4; 2 pasaron después.
- `tests/r4-catalog-runs.spec.mjs`: falló en el estado previo porque no existía el planificador; 5 pasaron después. Incluye repetición idempotente, allowlist, tutela del `structured-tote`, activación de Imprint y ausencia de mutaciones.
- `tests/r4-demo-overlays.spec.mjs`: 4 fallaron antes de P1 por falta de archivos; 4 pasaron después.
- Suite T/P1 combinada: **9 pasaron**. No se usó un servidor Shopify para los tests de fuente/configuración.
- `npm run gates:static` pasó después de cada commit C1, C2, C3, C4, T1–T3 y P1. En el gate P1: 898 JSON válidos; hooks sin contratos rotos; locales sin claves estáticas sin resolver; ledger sin incoherencias; Theme Check: 111 archivos, cero ofensas; sintaxis JS correcta; empaquetado de gate: 111 archivos, sin referencias internas.

## 5. Planes secos T1–T3

Se generaron seis archivos de plan. `mutations_sent` es 0 y `baseline.live_admin_read` es `false` en todos. Los `qa` usan CSV/snapshot histórico, no una lectura actual de Admin. Los alias de Imprint/Archive no tienen dominio: solo describen el objetivo futuro. Las credenciales de Admin API no están configuradas.

| Plan | Cambios planeados | Omitidos | Nota |
| --- | ---: | ---: | --- |
| `catalog-r4-qa-t1.json` | 731 | 0 | Sartorial; selectores sin IDs fijos. Vendor usa una consulta de selección cuyo conteo esperado (31) viene del encargo y requiere lectura en vivo antes de aplicar. |
| `catalog-r4-demo-sartorial-pending-t1.json` | 731 | 0 | Plan para tienda no creada. |
| `catalog-r4-qa-t2.json` | 24 | 1 | Omite explícitamente el `structured-tote` de Sartorial en QA. |
| `catalog-r4-demo-imprint-pending-t2.json` | 27 | 0 | Importa la versión Imprint del tote, activa/inventaría/publica según plan, 7 borradores del snapshot y 3 colecciones. Ninguna prenda. |
| `catalog-r4-qa-t3.json` | 26 | 0 | Solo plan; no aplicado en QA. |
| `catalog-r4-demo-archive-pending-t3.json` | 26 | 0 | Ocho borradores y dos colecciones según el snapshot, para tienda no creada. |

Los scripts son deliberadamente dry-run-only: `--apply` se rechaza. No hay mutaciones ni lecturas de verificación que reportar. Antes de aplicar, la persona autorizada debe leer el estado actual, resolver la ubicación activa por nombre y verificar cada escritura. Las salidas no contienen IDs de Shopify ni credenciales.

Reconciliación de copy: el punto T1 del encargo menciona el sufijo de preview, mientras §5 y el plan R4 piden quitar el meta-texto “Replace this text…”. Se sustituyó por descripciones editoriales y se eliminó ese meta-texto. Pido a Claude confirmar esta lectura antes de aplicar T1.

## 6. ZIP, manifiesto y subida

Pendiente completar después del empaquetado canónico final. Conteo esperado: 111 archivos. No se subieron los tres temas R4 ni se comprobó Shopify en servidor: no hay credenciales de Admin y las tiendas Imprint/Archive siguen sin dominio.

## 7. Copy nuevo/cambiado para aprobación (D35)

Única excepción ya aprobada: “Popular pieces” (D66). El nombre de autor `proyect-shopi` queda provisional y debe confirmarse antes de publicar.

- **Nombres ficticios de marca por preset:** Sartorial “Line & Form”; Imprint “Field & Form”; Archive “Archive Index”. Fixture renames: “Studio Form Coat”; “Multi-Option Knit”; “Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt, Oversized Collar and Longline Shape”; “Ribbed Cotton Jersey Tee”; “Cotton Jersey Long-Sleeve Tee”; “Double-Faced Wool and Cashmere Wrap Coat with a Detachable Belt and Oversized Collar in Soft Ink Navy”.
- **Descripciones de productos** (ubicación: `docs/demo-store/scripts/catalog-r4-data.mjs:8-30`; valores del plan T1): Serra Coat — “A long wrap coat with a quiet line through the body.”; Doppio Trench — “A double-breasted trench with a clean, straight profile.”; Cocoon Cardigan-Coat — “An open-front knit coat with a rounded silhouette.”; Nove Blazer — “A single-breasted blazer with notch lapels.”; Cropped Tailored Jacket — “A cropped jacket with a compact shape and considered proportions.”; Pleated Wide Trouser — “A wide-leg trouser with front pleats.”; Cigarette Trouser — “A straight trouser with a narrow leg.”; Cashmere Rib Crew — “A ribbed crew-neck knit.”; Fine Merino Turtleneck — “A fine-gauge turtleneck with a close, clean line.”; Oversized Alpaca Knit — “An oversized jumper with a dropped shoulder.”; Poplin Column Shirt — “A long, straight shirt with a clean collar.”; Silk Charmeuse Blouse — “A fluid blouse with a soft collar.”; Striped Cotton Shirt — “A striped shirt with a classic collar.”; Bias-Cut Slip Dress — “A slip dress cut on the bias with narrow straps.”; Wrap Wool Skirt — “A midi wrap skirt with a clean front.”; Pleated Midi Skirt — “A pleated midi skirt with a fluid line.”; Leather Belt — “A plain belt with a metal buckle.”; Cashmere Scarf — “A wide scarf in one size.”; Silk Twill Square — “A square scarf in silk twill, shaped for versatile styling.”; Structured Tote — “A structured tote bag with two handles.”; long-title fixture — “A double-faced wool and cashmere wrap coat with a detachable belt and oversized collar.” El meta-texto “Replace this text…” se elimina.
- **Blog y gift card** (`catalog-r4-data.mjs:41-54`): “A study in proportion” con “A line begins at the shoulder, then softens through the body. We look at proportion as a way to bring ease to the pieces worn every day.”; “How to read garment measurements” con “Compare the measurements below each size with a similar piece that fits you well. Check the shoulder, chest and length before choosing a size.”; regalo: “A gift card for a piece chosen by its recipient.”. Autor: “proyect-shopi”; etiquetas nuevas `journal`, `tailoring`, `guide`, `fit`.
- **404 y búsqueda:** inglés “Popular pieces” (aprobado); inglés “No matches for ‘[terms]’. Try a different search or view all results.”; español “Piezas populares”; “No hay resultados para «[terms]». Prueba otra búsqueda o consulta todos los resultados.”. Se propone en blog español “No hay ensayos en esta página. Vuelve al diario para consultar todas las historias.”; inglés: “There are no essays on this page. Return to the journal to browse all stories.”.
- **Imprint** (`listings/imprint/templates/index.json`): “Desk objects and accessories for work and everyday routines.”; “Browse the collection”; “Technical studio”; “Daily objects”; “Desk and study”; “Daily carry”; “Everyday carry systems”; “Object details”; “The collection”; “Collection, product, process”; “A denser view of the working collection.”; “Leather goods”; “Desk objects for daily use”; “A modular carry”; “Pieces for daily carry”; “An arrangement of pieces for work and everyday routines.”; “An arrangement for work and daily routines.”; “Studio principles”; “Useful forms begin with the work they do.”; “Studio notes”.
- **Archive** (`listings/archive/templates/index.json`, `listings/archive/templates/collection.json`): “Catalog / the house”; “Curatorial notes”; “Archive collection”; “Permanent archive”; “Garments and objects”; “Selected pieces”; “The archive”; “Archive pieces”; “Collection highlights”; “Explore the collection.”. Header group presets: “Explore the collection”, “New forms”, “Permanent collection”, “Tailoring”, “Daily objects”, “Desk and study”, “Leather goods”, “Restored pieces”, con sus subtítulos de los JSON de `listings/*/sections/header-group.json`.

## 8. Hallazgos

- **Corregidos en código/preset:** M-06, M-10, M-13, M-14, M-15, M-16, M-17, M-18 (plantilla, la asignación sigue pendiente), M-19, M-20, M-27 y M-28.
- **Abiertos por dependencia de catálogo/tienda:** M-01 (client transfer y publicación), M-02/M-03 (planes T1 aún sin aplicar), M-04 (tienda Imprint aún no tiene catálogo aplicado), M-05 (asociar medio a variante con T1), M-07 (imágenes DP-025 pendientes), M-08/M-09 (overlays aún no aplicados), M-11/M-12 (mercado Canadá y pagos de prueba sin verificar), M-18 (asignar template `gift-card`), M-32 (auditoría manual completa de tienda y dispositivos). M-14 también necesita observar el copy del preset en tienda.
- **Residual/desviación:** no fue posible leer ni mutar el Admin de Shopify; los alias demo son placeholders sin dominio. Los planes presentan valores de origen/snapshot histórico. Copy D35 y autoría provisional requieren aprobación. No se pudo validar la ZIP R4 en Shopify.

## 9. T4 para Johandry

- [ ] Confirmar en Dev Dashboard si `sartorial-theme-kvkzl39t` es development o client transfer (DP-024).
- [ ] Crear tres tiendas client transfer, una por preset (D67).
- [ ] Asignar a cada tienda su nombre, que también es el logo de texto.
- [ ] Configurar Bogus Gateway o Shopify Payments en modo de prueba y desactivar otros métodos de pago.
- [ ] Habilitar ventas y envío a Canadá o retirar ese mercado.
- [ ] Elegir y acreditar derechos de imagen (DP-025); subir recursos de las tres photo maps.
- [ ] Facilitar credenciales Admin por variable de entorno o ejecutar con acceso los planes T1–T3, con lectura y verificación.
- [ ] Aplicar overlays a temas sin publicar, verificar y publicar cada preset mediante el proceso de Johandry.
- [ ] Aprobar el copy nuevo de §7 y confirmar autor `proyect-shopi` (D35).

## 10. Riesgo y desviaciones

Sin mutaciones ni cambios publicados. Nivel 1: ninguno conocido. Nivel 2: catálogo, imágenes, credenciales, revisión de copy, comprobación de carga de ZIP y auditoría de las tres tiendas quedan pendientes antes de la entrega a Theme Store.
