# GPT-AUDIT-016 — Sartorial Archive vs. Annex, auditoría anterior a remediación

Fecha: 2026-09-30. Responsable: GPT, auditoría comercial especializada en archivo patrimonial. Estado: evidencia de la visita **antes** de cambios posteriores. No cierra filas del ledger ni certifica el tema completo.

## Método y alcance

- Navegación real de Chrome por las tiendas públicas [Archive](https://sartorial-archive.myshopify.com/) y [Annex](https://annex-r0zzjfjf.myshopify.com/). Revisé home, [Permanent Archive](https://sartorial-archive.myshopify.com/collections/permanent-archive), [Restored Pieces](https://sartorial-archive.myshopify.com/collections/restored-pieces), las 12 PDP, Contact, carrito, drawer y checkout hasta antes de pagar. Contrasté los nombres de recursos con el [catálogo Atelier](https://sartorial-atelier.myshopify.com/collections/all) y probé Annex home más dos PDP.
- Desktop 1536 px y simulación de viewport **390 px** (`innerWidth=390`, ancho de contenido 375, `scrollWidth=375` tras carga en home, colección y PDP Archive). Inspección visual, texto accesible y DOM de enlaces e imágenes. No se envió un pedido ni formulario.
- El carrito inicial de Archive ya tenía una chaqueta 1990. Añadí la pieza 1989 para probar drawer y la retiré; comprobé retorno a 1 artículo y $1,500 USD.
- Fuente normativa: [Shopify, Theme Store requirements](https://shopify.dev/docs/storefronts/themes/store/requirements) exige demos comerciales realistas con contenido auténtico e imágenes pertinentes, pasarela de prueba y derechos sobre recursos; [rechazos comunes](https://shopify.dev/docs/storefronts/themes/store/review-process/common-theme-rejections) incluye demos poco realistas y contenido sin licencia.

## Dictamen de esta tienda

**NO APTA antes de remediación.** La dirección de arte museística es clara, la colección de 12 piezas y la subcolección restaurada de 3 son coherentes, y la ficha/carrito calculan bien una compra de 1 unidad. La narrativa de procedencia es incompatible con la representación visual de varias piezas y el checkout no admite pagos de prueba. La evidencia del registro de procedencia se limita a afirmaciones en copy; no vi nombre del maker, historial de adquisición ni certificado individual en las 12 PDP.

## Hallazgos priorizados y falsables

| ID | Prioridad | Hallazgo y prueba | Acción recomendada / dueño |
|---|---|---|---|
| AR-01 | P0 | En checkout de Archive con 1990 Pinstripe Double-Breasted Jacket, subtotal $1,500, aparece **“This store can’t accept payments right now”** y `Pay now` deshabilitado. | Johandry: activar Bogus Gateway o Shopify Payments test mode y probar pedido; requerido por Shopify. |
| AR-02 | P0 | Las 12 PDP de Archive enlazan fotos cuyos nombres base coinciden con productos contemporáneos del catálogo Atelier (matriz abajo). La foto 1990 muestra exactamente el Nove Blazer actual, liso y de un botón, mientras la descripción dice chaqueta de rayas con seis botones; 1994 Document Portfolio muestra un tote vertical de dos asas; 1991 Leather Column Skirt muestra una falda de aspecto textil cruzada. | Johandry/contenido: fotos propias, individualizadas y correspondientes a cada pieza o reescribir títulos/descripciones de acuerdo con los objetos; acreditar derechos. |
| AR-03 | P0 | Home afirma “Acquired from private estates in Paris & Antwerp”, “Maker named and catalogued with every object” y “Numbered museum-grade accession certificate”. Las 12 PDP muestran códigos `AR-YYYY-NN` y afirmación “1 of 1”, pero ninguna identifica maker, propietarios previos, fechas de adquisición, tratamientos ni muestra certificado. | Johandry/contenido: aportar documentación verificable por pieza o retirar afirmaciones de procedencia y autenticidad no sustentadas. Esto es riesgo de credibilidad, no prueba de falsedad histórica. |
| AR-04 | P1 | [PDP 1990](https://sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket) en desktop y 390 px deja pulsar `+` de 1 a 2 y muestra **“Total for 2 $3,000.00”** mientras indica **“Low stock: 1 left”** y “1 of 1”. El carrito observado sólo tenía una unidad. | Claude/Gemini: coherencia entre selector, total mostrado y inventario; evaluar todos los productos 1 de 1. |
| AR-05 | P1 | En home, [“READ ARCHIVE NOTES”](https://sartorial-archive.myshopify.com/collections/permanent-archive) abre una lista de productos; en ambas colecciones, [“READ THE STORY”](https://sartorial-archive.myshopify.com/collections/all) abre el catálogo general. No hay página con notas o historia prometida. | Johandry/contenido: crear contenido editorial real o renombrar CTAs con destino veraz. |
| AR-06 | P1 | El ticker de home promete **“PRIVATE APPOINTMENTS IN KYOTO & PARIS”**; [Contact](https://sartorial-archive.myshopify.com/pages/contact) muestra showroom **“By appointment / Milan”** y horario CET. | Johandry: confirmar ciudades reales y alinear home, Contact y FAQ. |
| AR-07 | P1 | Home dice “museum-grade conservation”; featured 1990 promete “Climate-controlled archival transport / Insured courier”. Las PDP genéricas sólo dicen costos/tiempos en checkout, sin detalle específico de embalaje o seguro. Acordeón de cuidado afirma que composición exacta está “in the description above”; las descripciones dan materiales generales, sin porcentajes ni composición exacta. | Johandry/contenido: concretar y verificar conservación, logística y composición por pieza. |
| AR-08 | P1 | Navegación desktop y drawer móvil: Home, Catalog, Contact. Footer: únicamente Search; no acceso directo a las dos colecciones, historia, contacto ni políticas. En 390 px, la colección pone el formulario de filtros completo antes de la primera tarjeta, ocupando casi la primera pantalla. | Gemini/Johandry: mejorar rutas de descubrimiento y jerarquía móvil; poblar menú y footer. |
| AR-09 | P2 | [Permanent Archive](https://sartorial-archive.myshopify.com/collections/permanent-archive) muestra 12 y [Restored Pieces](https://sartorial-archive.myshopify.com/collections/restored-pieces) 3 (1999, 1995, 1990), concordantes con condición “Restored”. Filtros expuestos: Availability y Price, sin era, talla, material o condición. `Price, low to high` funcionó: primeros resultados $450, $650, $720. | Johandry/Gemini: enriquecer taxonomía sólo si responde a merchandising real. |
| AR-10 | P1 | Lookbook [home](https://sartorial-archive.myshopify.com/) muestra rótulos legibles de marcas de moda de terceros en cajas del fondo. Se debe verificar derecho de uso y evitar implicar asociación con marcas. | Johandry: auditoría de permisos de imagen y marca. **No concluyo que haya infracción** sólo por la imagen. |

## Matriz de las 12 fichas

La coincidencia de nombre base de archivo con Atelier es comprobable en el `src` de imagen principal de cada PDP. No calculé hash de bytes; por ello la matriz prueba la correspondencia de archivos y de catálogo, mientras los tres casos señalados en AR-02 se confirmaron visualmente.

| Pieza Archive (PDP) | Precio | Condición | Imagen principal | Correspondencia de nombre en Atelier |
|---|---:|---|---|---|
| [1999 Technical Cotton Trench](https://sartorial-archive.myshopify.com/products/1999-technical-cotton-trench) | $1,690 | Restored | `doppio-trench-01.jpg` | [Doppio Trench](https://sartorial-atelier.myshopify.com/products/doppio-trench) |
| [1998 Bias-Cut Silk Evening Slip](https://sartorial-archive.myshopify.com/products/1998-bias-cut-silk-slip) | $1,450 | Pristine / Museum Grade | `bias-cut-slip-dress-01.jpg` | [Bias-Cut Slip Dress](https://sartorial-atelier.myshopify.com/products/bias-cut-slip-dress) |
| [1997 Printed Silk Square](https://sartorial-archive.myshopify.com/products/1997-printed-silk-square) | $450 | Excellent vintage | `silk-twill-square-01.jpg` | [Silk Twill Square](https://sartorial-atelier.myshopify.com/products/silk-twill-square) |
| [1996 Satin Evening Jacket](https://sartorial-archive.myshopify.com/products/1996-satin-evening-jacket) | $2,100 | Excellent vintage | `cropped-tailored-jacket-01.jpg` | [Cropped Tailored Jacket](https://sartorial-atelier.myshopify.com/products/cropped-tailored-jacket) |
| [1995 Asymmetric Wool Cape](https://sartorial-archive.myshopify.com/products/1995-asymmetric-wool-cape) | $1,850 | Restored | `cocoon-cardigan-coat-01.jpg` | [Cocoon Cardigan-Coat](https://sartorial-atelier.myshopify.com/products/cocoon-cardigan-coat) |
| [1994 Leather Document Portfolio](https://sartorial-archive.myshopify.com/products/1994-leather-document-portfolio) | $780 | Excellent vintage | `structured-tote-01.jpg` | [Structured Tote](https://sartorial-atelier.myshopify.com/products/structured-tote) |
| [1994 Double-Faced Cashmere Cocoon Coat](https://sartorial-archive.myshopify.com/products/1994-cashmere-cocoon-coat) | $2,800 | Pristine / Museum Grade | `serra-coat-01.jpg` | [Serra Coat](https://sartorial-atelier.myshopify.com/products/serra-coat) |
| [1993 Wool Tuxedo Trouser](https://sartorial-archive.myshopify.com/products/1993-wool-tuxedo-trouser) | $840 | Pristine / Museum Grade | `pleated-wide-trouser-01.jpg` | [Pleated Wide Trouser](https://sartorial-atelier.myshopify.com/products/pleated-wide-trouser) |
| [1992 Silk Twill Blouse](https://sartorial-archive.myshopify.com/products/1992-silk-twill-blouse) | $650 | Excellent vintage | `silk-charmeuse-blouse-01.jpg` | [Silk Charmeuse Blouse](https://sartorial-atelier.myshopify.com/products/silk-charmeuse-blouse) |
| [1991 Leather Column Skirt](https://sartorial-archive.myshopify.com/products/1991-leather-column-skirt) | $950 | Excellent vintage | `wrap-wool-skirt-01.jpg` | [Wrap Wool Skirt](https://sartorial-atelier.myshopify.com/products/wrap-wool-skirt) |
| [1990 Pinstripe Double-Breasted Jacket](https://sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket) | $1,500 | Restored | `nove-blazer-01.jpg` | [Nove Blazer](https://sartorial-atelier.myshopify.com/products/nove-blazer) |
| [1989 Structured Wool Waistcoat](https://sartorial-archive.myshopify.com/products/1989-structured-wool-waistcoat) | $720 | Excellent vintage | `wool-waistcoat-01.jpg` | [Wool Waistcoat](https://sartorial-atelier.myshopify.com/products/wool-waistcoat) |

Las 12 PDP presentaron una variante de condición y una de talla preseleccionadas, aviso `Low stock: 1 left`, `Add to cart` y `Buy it now`. Cada una mostró una sola foto de producto distintiva en la galería principal; para precios de hasta $2,800 faltan vistas de construcción, etiqueta, desgaste, restauración y escala que soporten el relato de archivo. No encontré imagen principal rota; la carga diferida del home/colecciones mostró inicialmente cuadros vacíos en captura de página completa, pero se cargaron al desplazarse, incluido el lookbook.

## Comercio y móvil

- Drawer móvil: añadir 1989 Waistcoat por $720 al carrito que ya tenía 1990 Jacket por $1,500 produjo 2 líneas y subtotal correcto **$2,220 USD**. No vi campo de nota de pedido en drawer ni carrito. Se eliminó sólo la pieza añadida y quedó el estado previo de 1 línea/$1,500.
- [Carrito](https://sartorial-archive.myshopify.com/cart): 1990, condición Restored, talla FR 40 / US 8, cantidad 1, subtotal $1,500. Checkout se abrió y mostró línea y total $1,500, pero pago inhabilitado.
- Home móvil: portada legible, ambos CTA visibles y sin desplazamiento horizontal. Colección móvil: 12 productos, filtro extenso antes de primera ficha; sin overflow tras estabilizar carga. PDP móvil: foto y titular legibles; selector permitió 2/$3,000 para la pieza 1 de 1. Drawer de menú sólo contiene Home, Catalog y Contact.
- La cápsula comercial oculta no dejó hueco en la home. Las recomendaciones de PDP aparecen como “You may also consider” con enlaces de fallback por colección; Recently Viewed se pobló al navegar entre las doce fichas. No se probó ausencia de recomendaciones ni catálogo vacío.

## Comparación delimitada con Annex

- [Annex home](https://annex-r0zzjfjf.myshopify.com/) ofrece acceso directo a Limited Editions, Originals, Photography, About us, Contact, FAQ, guía visual de escala y framing, además de enlaces a seis políticas. Archive gana singularidad de dirección artística, pero queda detrás en arquitectura de información y explicación precompra.
- Annex no es referencia impecable: el footer muestra literalmente **“Share your store’s story, shipping, returns, or contact details here.”** La [PDP Dusk over Heather](https://annex-r0zzjfjf.myshopify.com/products/dusk-over-heather-original) aparece agotada y su breadcrumb apunta a **Photography** aunque es Oil on Canvas; [Cascade](https://annex-r0zzjfjf.myshopify.com/products/cascade-photograph) también se observó agotada. No usé esas PDP para afirmar superioridad transaccional de Annex.
- Home Annex a 390 px conservó hero y CTA principal visibles sin overflow (`innerWidth=390`, `scrollWidth=375`).

## Límites

No inspeccioné Shopify Admin, licencias, facturas, certificados, hashes de imágenes ni estado de inventario de backend. No introduje datos personales ni completé un pedido. No hice auditoría de red exhaustiva de recursos secundarios ni pruebas de múltiples navegadores/dispositivos físicos. Las afirmaciones sobre procedencia y derechos deben verificarse con el comerciante. Los resultados corresponden al momento de navegación y pueden cambiar tras despliegues.
