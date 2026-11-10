ID: CLAUDE-REVIEW-LOTE-D-ENTREGABLES-001
Tipo: revisión independiente, solo lectura, de D-01, D-01-N y D-01-L
Revisor: subagente Claude (Opus 5.5), distinto del escritor de los entregables (commit `0a42709`, ajuste en `2fed90b`)
Rama revisada: `lote-e-claude` = `origin/lote-c-impl` = `e8f17e5`, leída en un worktree temporal de scratch (eliminado al terminar)
Fecha: 2026-11-10
Sin commit, sin push, sin escritura en tienda y sin tocar el directorio principal del repo.

## Veredictos

| Entregable | Veredicto | Motivo principal |
|---|---|---|
| D-01 catálogo y fotos | ACEPTADO CON CONDICIONES | CSV válidos y reproducibles; las afirmaciones de origen y fabricación de Sartorial no están en la lista de verificación |
| D-01-N navegación | ACEPTADO CON CONDICIONES | Sin enlaces rotos; el destino About del menú principal muestra copy instructivo y placeholders SVG y no tiene fila de fotos |
| D-01-L idioma y tallas | ACEPTADO CON CONDICIONES | Propuesta coherente y todo lo no real marcado como pendiente; el ítem no se puede cerrar hasta que Johandry aporte las tallas reales |

Alcance del dictamen: acepta los entregables como preparación para importación manual (D23, `docs/decisions.md:242`). No autoriza importar, activar ni publicar, y no sustituye a R-Demo (`GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:316,379`), que exige catálogo desplegado y capturas nuevas.

## Base y reproducibilidad

1. Los entregables no cambian entre la base del brief (`6e9523b`) y `e8f17e5`: `git diff --stat 6e9523b e8f17e5 -- docs/demo-import scripts/demo-import.mjs listings templates sections/header-group.json sections/footer-group.json` sale vacío.
2. `node scripts/demo-import.mjs check` da `OK: 0 errores` (sartorial 24 productos, 253 variantes, 7 colecciones; imprint 13, 38, 3; archive 12, 12, 2).
3. `node scripts/demo-import.mjs build` seguido de `git diff --exit-code docs/demo-import` sale con 0: los seis CSV se regeneran byte a byte desde `docs/demo-import/data/*.json`.
4. Los seis CSV son ASCII puro (UTF-8 válido, sin BOM, LF).

## 1. Alcance y criterios del plan

Criterios (`agent-comms/outbox-gpt/GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:301-303`):

- D-01: "Sin placeholders ni fixtures de QA en rutas comerciales; fotos pertinentes y catálogo aprobado". El paquete cubre Home, PLP y PDP: comprobé por script que cada `image_picker` vacío de las secciones activas de `listings/<preset>/templates/{index,collection,product}.json` tiene una fila en `<preset>-photos.csv` (todos cubiertos; solo falta `video_poster` de `hero-editorial`, irrelevante porque `media_type` es `image` en `listings/*/templates/index.json:11`). Cada producto tiene filas de vista en su CSV de fotos, y `bias-cut-slip-dress` tiene las cuatro vistas de V-07 (frente, espalda, lateral, detalle). Los fixtures QA (LV-24) se tratan sin retirarlos a ciegas (`docs/demo-import/D-01-catalogo-y-fotos.md:47`), como exige el plan. El catálogo queda en `draft` y pendiente de aprobación (`D-01-catalogo-y-fotos.md:40,46`). Cumple como preparación.
- D-01-N: "Navegación útil por preset, enlaces y páginas reales; no inventar destinos". Cumple salvo la condición N-1 (About).
- D-01-L: "UI y contenido coherentes para el mercado definido; tallas con datos reales. No traducir o inventar medidas". Cumple como propuesta; el cierre depende de los datos de Johandry (L-1).

## 2. Validez de los CSV para Shopify

Fuente oficial: https://help.shopify.com/en/manual/products/import-export/using-csv (consultada el 2026-11-10).

Script independiente del generador: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d01-scripts/validate_csv.py` (módulo `csv` de Python). Resultado: **0 errores** en los tres CSV de productos. Comprueba número de columnas por fila, cabecera sin duplicados, handle en minúsculas con guiones, filas de variante contiguas, campos de producto solo en la primera fila, combinaciones de opciones únicas, Option2 coherente, `Title`/`Default Title`, precio `\d+\.\d{2}` mayor que 0, `Status`, `Published`, tracker, cantidad, política, fulfillment, booleanos, HTML de `Body` equilibrado, ausencia de columnas de metafield y ausencia de URLs o credenciales.

| Aspecto | Resultado | Evidencia |
|---|---|---|
| Columnas y Handle | Válido. Usa los nombres clásicos (`Handle`, `Body (HTML)`, `Variant Price`…). La página oficial dice: "Shopify maintains backward compatibility with older column names, but you should consider updating to the current format". Para variantes, el handle es obligatorio y está en todas las filas | `scripts/demo-import.mjs:19-25`; `docs/demo-import/sartorial-products.csv:1` |
| Variantes y opciones | Válido. Máximo 3 opciones (aquí 2). Producto sin opciones con `Option1 Name=Title` y `Option1 Value=Default Title`, como indica la documentación ("this value should be Default Title"). Máximo 20 variantes por producto, muy por debajo del tope de 100 del script | `scripts/demo-import.mjs:84-120,192`; `docs/demo-import/archive-products.csv:2` |
| Estados draft/active | Válido. Valores permitidos `active`, `draft`, `archived`; las 49 primeras filas llevan `draft` y `Published=FALSE`. Las filas de variante dejan `Status` vacío (como el export clásico); la documentación dice "If this column is present, then it needs a value", así que conviene confirmarlo en la importación de prueba del paso 2 | `scripts/demo-import.mjs:104-116`; `docs/demo-import/data/*.json:6` |
| Imágenes | No hay columnas de imagen; las fotos van por lista aparte. Correcto y documentado. Los `*-photos.csv` son listas de trabajo, no archivos importables, y el documento lo deja claro | `D-01-catalogo-y-fotos.md:16,20,42-45` |
| Precios | Válido. "Only include the monetary value without a currency symbol", con punto decimal y dos cifras. La moneda (USD) solo consta en `data/sartorial.json:11` y en CLAUDE-DEMO-001; no aparece en `D-01-catalogo-y-fotos.md` | `sartorial-products.csv:2` (`1890.00`) |
| SKU | Columna ausente. Es opcional; según la documentación solo "can't be blank if you use a custom fulfillment service", y aquí es `manual`. Recomendable para una demo realista, no bloqueante | `scripts/demo-import.mjs:19-25,102` |
| Inventario | Sartorial e Imprint: tracker vacío, sin cantidad, `deny`: inventario no rastreado, todas las variantes siempre disponibles. Archive: `shopify`, 1, `deny`. La documentación limita `Inventory quantity` a "Shopify stores that have a single location"; el documento no lo advierte | `data/sartorial.json:7`; `data/imprint.json:7`; `data/archive.json:7`; `archive-products.csv:2-13` |

Observaciones menores sobre el documento: `D-01-catalogo-y-fotos.md:22` dice que las colecciones no se importan por CSV; el formato actual tiene una columna `Collection` "(import only)". No cambia nada porque todas son automáticas por etiqueta. El orden manual en colecciones automáticas aparece como opción de orden de colección en https://help.shopify.com/en/manual/products/collections/collection-layout ("If you select Manual, then you can rearrange your products"), aunque esa página no nombra las automáticas; conviene verlo en la prueba.

## 3. Menús frente a colecciones y páginas

- `scripts/demo-import.mjs:223-240` rechaza cualquier enlace a colección, página, producto o política no definida. `check` pasa, así que todos los destinos de `D-01-N-navegacion.md:76-91` existen en los entregables.
- Las tres plantillas de página existen: `templates/page.about.json`, `templates/page.faq.json`, `templates/page.contact.json`.
- Los handles de menú coinciden con el tema: `sections/header-group.json:31` (`menu_item: "Catalog"`), `:47` (`main-menu`); `sections/footer-group.json:8` (`footer`).
- Las URLs de política siguen el formato relativo `/policies/<slug>` que documenta https://shopify.dev/docs/api/liquid/objects/policy (ejemplo `"/policies/refund-policy"`). `D-01-N-navegacion.md:105` obliga a retirar el enlace si la política no se publica.
- Imprint usa `desk-and-study`, igual que `listings/imprint/templates/index.json:25` (comprobado por `check`); el aviso sobre `desk-study` está en `D-01-catalogo-y-fotos.md:33`.
- Sartorial tiene productos con etiquetas `shirting`, `dresses`, `skirts` y `bags` sin colección ni entrada de menú (`data/sartorial.json`); solo se alcanzan por `/collections/all` y colecciones transversales. No es un enlace roto; queda como sugerencia.

## 4. Idioma y tallas

- Todo el contenido de los CSV está en inglés: 0 coincidencias de palabras españolas comunes en los tres CSV de productos. El vestido lleva la frase inglesa citada (`D-01-L-idioma.md:126`).
- Comparé cada cifra de las 24 descripciones de Sartorial con `agent-comms/outbox-claude/CLAUDE-DEMO-001-couture-demo-store.md:39-170`: cuatro centímetros, 4 % de elastano, 19 micras, 120 hilos, 180 × 45 cm, trece pulgadas, 90 cm y tallas 70-85 coinciden. No se añadieron medidas ni tablas.
- Las escalas de talla se marcan como propuestas con su fuente y su conflicto (`D-01-L-idioma.md:129-134`; `data/sartorial.json:9-12`), incluido el 34-40 observado en sartorial-atelier frente al XS-XL propuesto.
- La guía de tallas queda fuera (D-02-T), correcto (`D-01-L-idioma.md:122,150`).

## 5. Riesgos legales y de contenido (C-08, RC-07)

- "Haute Couture": 0 apariciones fuera de `agent-comms/` y `.agents/` (`grep -rli "haute couture"`), ni en `listings/` ni en `docs/demo-import/`. La única "couture" es el nombre de archivo fuente en `data/sartorial.json:4`.
- Marcas reales: no aparece ninguna casa o certificación conocida en los CSV (búsqueda de una lista de casas y certificaciones textiles). El vendor `LINEA NOVE` es ficticio y su búsqueda de marca está pendiente (`D-01-catalogo-y-fotos.md:57`; `data/sartorial.json:12`). Una búsqueda web rápida (`"Linea Nove" brand clothing`) no devolvió una marca con ese nombre; el resultado más cercano es [Novepuntonove](https://www.fashionmodeldirectory.com/brands/novepuntonove/). No sustituye una búsqueda en USPTO o EUIPO.
- Fotos: ninguna foto entra en el repo; todas las filas están en `pending Johandry` y los derechos se piden de forma explícita (`D-01-catalogo-y-fotos.md:53`; `GPT-PENDIENTES-JOHANDRY-001.md:28`).
- Credenciales: 0 URLs, tokens, `myshopify` o contraseñas en `docs/demo-import/` y `scripts/demo-import.mjs`.
- Imprint y Archive: las afirmaciones (full-grain, vegetable-tanned, solid brass, años, restauración, tallas de etiqueta) siguen en el texto, pero con `draft` y verificación obligatoria antes de activar (`D-01-catalogo-y-fotos.md:55-56`; `data/imprint.json:8-12`; `data/archive.json:8-13`; plan `:237`). Aceptable como preparación.
- **Hueco: Sartorial.** Sus descripciones afirman como hechos origen, fabricación y sostenibilidad, sin respaldo y sin figurar en ninguna lista de verificación:
  - "woven in Biella" (`sartorial-products.csv:2`);
  - "Egyptian cotton gabardine" (`:17`), que además es una denominación con certificación propia;
  - "Alpaca spun in Arequipa" (`:27`);
  - "recycled down" (`:37`), afirmación ambiental;
  - "Knitted at a family factory in Umbria that has worked with the house since the first collection" (`:112`), promesa de fabricación con historia de marca inventada;
  - "vegetable-tanned" (`:240`);
  - "Fits a thirteen-inch laptop" (`:251`);
  - "comes from the house's archive studio" (`:253`).

  `D-01-catalogo-y-fotos.md:55-56` solo enumera Imprint y Archive, y `data/sartorial.json:8-13` no menciona afirmaciones. La fuente CLAUDE-DEMO-001 solo advierte de la marca (`:13-17`). Esto choca con C-08 (plan `:195`: "Sin respaldo no se inventan promesas", incluidas las de fabricación) y con el trato que el propio paquete da a Imprint.

## 6. Contenido de SebastianDev017/atelier

Contrasté los tres CSV de productos con los cuatro CSV de demo del clon local `/home/claude/sebastiandev017/atelier/demo/` (commit `1576d06`: `products.csv`, `atelier-products-v3.csv`, `annex-products-v1.csv`, `maison-products-v1.csv`) y con sus copias en `/home/claude/themes/atelier-*/demo/`. Script: `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-d01-scripts/overlap.py`. Resultado: 0 handles comunes, 0 títulos comunes y 0 secuencias comunes de seis palabras en las descripciones. Atelier no tiene un generador equivalente (`grep` de `size_scales`, `photo_slots`, `demo-import`, `LINEA NOVE`, Biella, Arequipa y Umbria: 0 archivos). No hay copia.

## Condiciones

### D-01

- **D-1 (bloquea activar Sartorial):** añadir las afirmaciones de Sartorial de la sección 5 a la lista de verificación de `D-01-catalogo-y-fotos.md:50-57` y a `data/sartorial.json` `pending_data`, o neutralizarlas antes de activar. Johandry decide si una marca ficticia puede declarar origen y materiales.
- **D-2:** añadir filas de fotos para `templates/page.about.json` (hero y galería de `main-about`), porque esa página es destino del menú principal (ver N-1).
- **D-3 (P3):** en el documento, indicar que los precios están en USD y que la tienda debe tener esa moneda; que `Variant Inventory Qty` solo sirve con una única ubicación (Archive); que Sartorial e Imprint quedan sin inventario rastreado, sin estados de agotado en la demo, y que eso lo decide Johandry; y que el handle `structured-tote` existe en Sartorial (`sartorial-products.csv:251`) y en Imprint (`imprint-products.csv:2`), así que chocaría si dos presets compartieran tienda.
- **D-4 (P3):** en la importación de prueba del paso 2 (`D-01-catalogo-y-fotos.md:40`), confirmar que Shopify acepta `Status` vacío en las filas de variante y el orden manual en colecciones automáticas. Valorar una columna SKU.

### D-01-N

- **N-1:** About figura en el menú principal de los tres presets (`D-01-N-navegacion.md:86`), pero `templates/page.about.json:11` trae copy instructivo ("Tell the story of how the house began…") y las imágenes vacías caen en `placeholder_svg_tag` (`sections/main-about.liquid:52-53,131-135`). Eso es un placeholder en una ruta comercial. `D-01-N-navegacion.md:114` pide el texto, pero no las fotos ni el riesgo. Hace falta texto aprobado y fotos antes de enlazarla, o quitarla del menú hasta entonces.
- **N-2 (P3):** el paso 6 (`D-01-N-navegacion.md:108`) solo cambia los enlaces de la tarjeta del mega menú. Los textos `heading_1` "New Arrivals", `subheading_1` "Explore the autumn edit" y `heading_2` "Capsule Wardrobe" (`sections/header-group.json:33-38`) son raíz y compartidos, y no casan con Imprint ni con Archive ni con los nombres de colección de las fotos `image_1` e `image_2`. Incluir los textos en el paso 6.
- **N-3:** la aprobación de la arquitectura de menú por Johandry sigue pendiente (`D-01-N-navegacion.md:113`; `GPT-PENDIENTES-JOHANDRY-001.md:26`).

### D-01-L

- **L-1:** el CSV de Sartorial ya lleva como valores de opción las tallas propuestas (XS-XL, 24-34 pares, 70-85, 1-2). No importar hasta que Johandry fije la escala real; si cambia, regenerar con `build` y validar con `check` (`D-01-L-idioma.md:143`). D-01-L no se cierra con valores propuestos.
- **L-2:** las tallas de etiqueta de Archive aparecen como hecho en el texto ("Single piece. Label size: FR 38 / US 6.", `archive-products.csv:2`, generado en `scripts/demo-import.mjs:80`). Son propuestas de GPT-REPORT-014 (`D-01-L-idioma.md:136`): deben confirmarse pieza a pieza antes de activar, junto con el resto de afirmaciones de Archive.
- **L-3:** la decisión de mercado e idioma, y la despublicación de `/es` si no se traduce todo, sigue en manos de Johandry (`D-01-L-idioma.md:140-142`).

## Afirmaciones falsables

1. `git diff --stat 6e9523b e8f17e5 -- docs/demo-import scripts/demo-import.mjs` está vacío.
2. `node scripts/demo-import.mjs build` en `e8f17e5` no cambia ningún byte de `docs/demo-import/`.
3. `validate_csv.py` reporta `ISSUES 0` en los tres CSV de productos.
4. Ningún CSV de productos tiene una columna `Variant SKU` ni columnas de imagen o de metafield.
5. `grep -c "Biella\|Arequipa\|Umbria\|Egyptian\|recycled" docs/demo-import/D-01-catalogo-y-fotos.md` da 0.
6. `templates/page.about.json:11` contiene "Tell the story of how the house began".
7. `overlap.py` da 0 handles, 0 títulos y 0 secuencias de seis palabras comunes con `atelier/demo/*.csv`.
8. `grep -rli "haute couture"` fuera de `agent-comms/`, `.agents/` y `.git/` no devuelve archivos.

## Fuentes

- [Shopify Help Center: Using CSV files to import and export products](https://help.shopify.com/en/manual/products/import-export/using-csv)
- [Shopify Help Center: Collection layout](https://help.shopify.com/en/manual/products/collections/collection-layout)
- [shopify.dev: Liquid object policy](https://shopify.dev/docs/api/liquid/objects/policy)
- [Fashion Model Directory: Novepuntonove](https://www.fashionmodeldirectory.com/brands/novepuntonove/) (resultado más cercano de la búsqueda de "Linea Nove")
