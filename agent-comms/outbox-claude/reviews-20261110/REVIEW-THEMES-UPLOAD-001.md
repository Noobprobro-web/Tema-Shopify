```text
ID: REVIEW-THEMES-UPLOAD-001
Estado: ACEPTADO CON CONDICIONES. Los 3 temas de preview existen, estan UNPUBLISHED, tienen 82 archivos con las mismas rutas, y los archivos comunes coinciden con el repo. Pero Imprint y Archive referencian 9 productos que no existen en la tienda (hotspots, bundle, bento, producto destacado).
Decision requerida: Gemini/Johandry. (a) Crear los 9 productos faltantes o reapuntar las referencias a handles existentes en Imprint y Archive. (b) Confirmar que el cambio de checksum de templates/index.json respecto al export 76dd94d es solo reserializacion de Shopify.
Resumen en 5 lineas:
1. Tienda correcta (sartorial-theme-kvkzl39t). Sartorial/Imprint/Archive: UNPUBLISHED; MAIN sigue siendo test-data (190299111728); Horizon y debut-vintage-theme no se tocaron despues de su creacion.
2. Los 3 temas tienen 82 archivos con rutas identicas, sin main-documentation, main-support ni page.documentation/page.support.
3. settings_data.json: current correcto en los 3; cero shopify://shop_images y cero shopify://collections.
4. Los 78 archivos comunes tienen el mismo checksumMd5 en los tres. Solo difieren collection.json, index.json, product.json y settings_data.json.
5. Rotas: Imprint 5 productos (leather-desk-mat, milled-brass-paperweight, leather-document-folio, four-slot-cardholder, folded-valet-tray). Archive 4 productos (1994-cashmere-cocoon-coat, 1999-technical-cotton-trench, 1998-bias-cut-silk-slip, 1990-pinstripe-double-breasted-jacket). Sartorial: 0.
Archivos tocados: solo este informe (nuevo). Sin commit ni push. Sin mutaciones en Shopify.
Desviaciones: ninguna. Solo get-shop-info y graphql_query (lectura). No se abrio .secrets. No se imprimio ninguna credencial.
Filas del ledger: ninguna cerrada.
```

## 1. Tabla de comprobaciones

| # | Comprobacion | Resultado | Estado |
| :--- | :--- | :--- | :--- |
| 0 | get-shop-info | domain = sartorial-theme-kvkzl39t.myshopify.com | cumplido |
| 1a | Roles de los 3 temas | Sartorial 190300356912, Archive 190300422448 e Imprint 190300455216: role UNPUBLISHED, processing false | cumplido |
| 1b | MAIN | test-data 190299111728 es el unico MAIN. updatedAt 2026-11-14T04:45:12Z, anterior a la creacion de los previews (05:36:08Z en adelante) | cumplido |
| 1c | Horizon y debut-vintage-theme | Horizon 190299046192 UNPUBLISHED, updatedAt 04:45:12Z. debut-vintage-theme 190299078960 UNPUBLISHED, updatedAt 04:44:55Z. Ambos anteriores a los previews | cumplido |
| 2 | Archivos por tema (hasNextPage false) | 82 en cada tema (3 assets, 2 config, 2 layout, 3 locales, 33 sections, 23 snippets, 16 templates). Mismas rutas. Ausentes en los tres: sections/main-documentation.liquid, sections/main-support.liquid, templates/page.documentation.json, templates/page.support.json | cumplido |
| 3a | settings_data.json `current` | Sartorial = "Sartorial", Imprint = "Imprint", Archive = "Archive" | cumplido |
| 3b | Referencias residuales | Cero apariciones de `shopify://shop_images` y `shopify://collections` en los tres cuerpos (los tres presets estan presentes en cada tema) | cumplido |
| 4 | Comparacion cruzada | 78 archivos comunes con el mismo checksumMd5 en los tres (comparados fila a fila). Difieren solo templates/collection.json, templates/index.json, templates/product.json y config/settings_data.json | cumplido |
| 5 | Coherencia con el repo (md5 de `git show 76dd94d:<ruta>` y del export Sartorial) | Coinciden con el checksum de Shopify en 11 archivos: assets/base.css, assets/theme.js, layout/theme.liquid, sections/header.liquid, sections/footer.liquid, sections/main-product.liquid, sections/lookbook.liquid, snippets/product-card.liquid, locales/en.default.json, config/settings_schema.json, templates/cart.json. En los 3 temas, collection.json, product.json y settings_data.json coinciden con el export de su preset | cumplido |
| 5b | templates/index.json vs export | El checksum de index.json en Shopify NO coincide con el export en ningun preset (Sartorial d852f70b... export, 426bdaa5... en Shopify). El export no trae el comentario de cabecera y usa JSON compacto. Es coherente con reserializacion de Shopify, pero no se comparo el contenido byte a byte | no verificado |
| 6a | JSON de los 3 templates por tema (sin el comentario inicial) | Los 9 cuerpos se leyeron completos y son JSON bien formado a simple vista. No se ejecuto un parser sobre ellos | codigo completo |
| 6b | `type` de seccion referenciado existe como sections/<type>.liquid | Tipos usados: hero-editorial, marquee, curated-showcase, lookbook, featured-product, complete-the-look, brand-manifesto, newsletter, bento-discovery, main-collection, main-product, product-recommendations, recently-viewed. Todos existen en los tres temas | cumplido |
| 6c | Handles de colecciones | Solo `all` (coleccion virtual del storefront; no sale en la lista de Admin, que tiene 14 colecciones). Sin referencias a otras colecciones | cumplido |
| 6d | Handles de productos, Sartorial | nove-blazer, pleated-wide-trouser, silk-charmeuse-blouse, cashmere-scarf, serra-coat: existen, ACTIVE y publicados | cumplido |
| 6e | Handles de productos, Imprint | structured-tote existe (ACTIVE). Inexistentes: leather-desk-mat, milled-brass-paperweight (bento-discovery, index.json), leather-document-folio, four-slot-cardholder, folded-valet-tray (complete-the-look, index.json) | ausente (5 referencias rotas) |
| 6f | Handles de productos, Archive | Inexistentes: 1994-cashmere-cocoon-coat, 1999-technical-cotton-trench, 1998-bias-cut-silk-slip (hotspots de lookbook) y 1990-pinstripe-double-breasted-jacket (featured-product), todos en index.json | ausente (4 referencias rotas) |
| 7 | Enlaces /collections, /pages, /products | Los unicos enlaces no vacios son `/collections/all` (button_primary_url del hero en los tres temas), que resuelve. Todos los demas link_url, link, button_url y button_secondary_url estan vacios | cumplido |

## 2. Condiciones

- C1. Imprint: crear los productos leather-desk-mat, milled-brass-paperweight, leather-document-folio y four-slot-cardholder, y folded-valet-tray, o reapuntar los 5 bloques a handles existentes (por ejemplo structured-tote, leather-belt). Mientras tanto, bento-discovery y complete-the-look de Imprint se renderizan sin esos productos.
- C2. Archive: crear o reapuntar los 4 handles. El featured-product de Archive queda sin producto y los 3 hotspots de lookbook quedan sin popover.
- C3. Confirmar que la diferencia de checksum de index.json es reserializacion. Basta con comparar el JSON parseado del export con el cuerpo en Shopify.

## 3. Limites de esta revision

- Solo se leyeron los cuerpos de settings_data.json, collection.json, index.json y product.json. El resto de archivos se comparo por checksum, no por contenido.
- Los tipos de bloque dentro de las secciones (por ejemplo `quantity_selector`, `technical_specs`, `provenance`) no se contrastaron con los schemas de cada seccion.
- La renderizacion real de los previews en navegador no se probo, asi que no hay evidencia de la Compuerta 5.
- Los 12 md5 se calcularon localmente con `git show 76dd94d:<ruta> | md5sum` y con el export de scratchpad.
- Los nodos de `products` se listaron con first:100 y hasNextPage false (40 productos). Los productos de prueba en DRAFT o ARCHIVED no cuentan como existentes para el storefront.
