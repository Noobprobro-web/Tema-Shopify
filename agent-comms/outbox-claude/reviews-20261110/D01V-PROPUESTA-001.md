# D-01-V: inventario y propuesta de copy (narrativa y CTA)

Base: rama `lote-e-claude`, commit `e8f17e5`, leída con `git show`. Solo lectura: no hay commits, pushes ni cambios en el repo.
Destinatario de la aprobación: Johandry. Copy en inglés. Hasta que Johandry apruebe, ningún texto de esta propuesta se escribe en `listings/*/templates/*.json` ni en `templates/*.json`.

Criterios de la propuesta: tono neutro y descriptivo; sin "Haute Couture"; sin marcas reales; sin afirmaciones de bespoke, procedencia, restauración, estado, año, origen, materiales o ingeniería sin respaldo; ningún texto de instrucción interna visible; cada CTA apunta a un destino que el repo declara o que Johandry debe crear.

Fuentes de criterio: `docs/decisions.md` (2026-09-11: evitar "Atelier" como nombre final; 2026-11-04 D26: ocultar bloques vacíos y quitar textos por defecto), `docs/demo-import/data/{sartorial,imprint,archive}.json` (`pending_data`, `collections`, `pages`, `menus`), `GPT-PLAN-IMPLEMENTACION-SARTORIAL-001-v4.1.md:304` (D-01-V), y `PLAN-DIA-20261110.md` §2.5.

## 1. Resumen

| Concepto | Número | Detalle |
|---|---|---|
| Textos narrativos y de etiqueta inventariados | 57 | Sartorial 12, Imprint 15, Archive 12, raíz 17 (incluye page.about y page.faq), etiquetas de producto 1 |
| CTA y enlaces de tarjeta | 28 | Sartorial 7, Imprint 9, Archive 6, raíz index 5, raíz faq 1 |
| CTA rotos (destino no existe en el repo) | 2 | C-R2 y C-R4 apuntan a `/collections/the-autumn-series`, que solo se declara si la tienda se crea |
| CTA sin etiqueta visible | 2 | C-I7 y C-A4, pestañas con `tab_label` vacío |
| CTA con destino de sistema a confirmar | 2 | C-S1 y C-R1 apuntan a `/collections/all` |
| CTA que dependen de crear un destino declarado | 22 | Colecciones y páginas declaradas en `docs/demo-import/data/*.json` |
| Textos con afirmación que hay que respaldar o retirar | 39 | Ver columna "Respaldo" en §3 |
| Apariciones de "VIEW TECHNICAL SPECS" | 0 | Retirada, como indica el plan |
| Apariciones de "Haute Couture" | 0 | No hace falta retirarla |
| Errores de hecho en copy actual | 1 | S-11: "double-breasted jacket", pero `nove-blazer` tiene una botonadura y solapa alta |

## 2. Destinos de CTA (28)

| ID | Ruta:línea | Texto actual | Destino | Estado |
|---|---|---|---|---|
| C-S1 | listings/sartorial/templates/index.json:22-23 | Discover the collection | /collections/all | Ruta de sistema de Shopify, no declarada en el repo. Confirmar |
| C-S2 | listings/sartorial/templates/index.json:24-25 | Explore tailoring | /collections/tailoring | Declarada en sartorial.json, crear |
| C-S3 | listings/sartorial/templates/index.json:46 | New forms (pestaña) | /collections/new-forms | Declarada, crear |
| C-S4 | listings/sartorial/templates/index.json:47 | Permanent collection (pestaña) | /collections/permanent-collection | Declarada, crear |
| C-S5 | listings/sartorial/templates/index.json:48 | Tailoring salon (pestaña) | /collections/tailoring | Declarada, crear |
| C-S6 | listings/sartorial/templates/index.json:121-122 | Explore tailoring | /collections/tailoring | Declarada, crear |
| C-S7 | listings/sartorial/templates/collection.json:13-14 | Explore tailoring | /collections/tailoring | Declarada, crear |
| C-I1 | listings/imprint/templates/index.json:22-23 | Inspect system inventory | /collections/daily-objects | Declarada, crear |
| C-I2 | listings/imprint/templates/index.json:24-25 | Explore desk and study | /collections/desk-and-study | Declarada, crear |
| C-I3 | listings/imprint/templates/index.json:50-51 | Tarjeta "EDC systems" | /collections/desk-and-study | Declarada, crear |
| C-I4 | listings/imprint/templates/index.json:69-70 | Explore leather goods | /collections/leather-goods | Declarada, crear |
| C-I5 | listings/imprint/templates/index.json:88 | Daily objects (pestaña) | /collections/daily-objects | Declarada, crear |
| C-I6 | listings/imprint/templates/index.json:89 | Workspace (pestaña) | /collections/desk-and-study | Declarada, crear |
| C-I7 | listings/imprint/templates/index.json:90 | (vacía, pestaña) | /collections/leather-goods | Sin etiqueta: CTA sin texto visible |
| C-I8 | listings/imprint/templates/index.json:156-157 | Inspect collection | /collections/daily-objects | Declarada, crear |
| C-I9 | listings/imprint/templates/collection.json:13-14 | Explore daily objects | /collections/daily-objects | Declarada, crear |
| C-A1 | listings/archive/templates/index.json:23-24 | Enter the catalogue | /collections/permanent-archive | Declarada, crear |
| C-A2 | listings/archive/templates/index.json:25-26 | View the selection | /collections/restored-pieces | Declarada, crear. Nombre pendiente de confirmar (ver D3) |
| C-A3 | listings/archive/templates/index.json:38-39 | View the archive | /collections/permanent-archive | Declarada, crear |
| C-A4 | listings/archive/templates/index.json:61 | (vacía, pestaña) | /collections/permanent-archive | Sin etiqueta: CTA sin texto visible |
| C-A5 | listings/archive/templates/index.json:62 | Selected pieces (pestaña) | /collections/restored-pieces | Declarada, crear |
| C-A6 | listings/archive/templates/collection.json:13-14 | View the archive | /collections/permanent-archive | Declarada, crear |
| C-R1 | templates/index.json:23-24 | Discover the collection | /collections/all | Ruta de sistema de Shopify. Confirmar |
| C-R2 | templates/index.json:25-26 | Explore the series | /collections/the-autumn-series | ROTO hasta crearla o cambiar destino (D2) |
| C-R3 | templates/index.json:102-103 | About us | /pages/about | Página declarada, crear |
| C-R4 | templates/index.json:117 | Tarjeta "Sculptural layers" | /collections/the-autumn-series | ROTO hasta crearla o cambiar destino (D2) |
| C-R5 | templates/index.json:127 | Explore the story | /pages/about | Página declarada, crear |
| C-F1 | templates/page.faq.json:47-48 | Contact us | /pages/contact | Página declarada, crear |

## 3. Textos narrativos y de etiqueta

Columna "Respaldo": Sí = contiene una afirmación que Johandry debe respaldar o retirar; Bajo = etiqueta neutra; No = sin afirmación.

### 3.1 Sartorial (listings/sartorial/templates/)

| ID | Ruta:línea | Texto actual | Respaldo | Propuesta (EN) |
|---|---|---|---|---|
| S-01 | index.json:19 | SARTORIAL / 01 | No | NEW SEASON |
| S-02 | index.json:20 | The Master Tailor's Cut | Sí: "master tailor" sugiere un artesano o servicio a medida | New season tailoring |
| S-03 | index.json:21 | Sculptural tailoring cut in considered proportions. | Sí: adjetivos de valor | Jackets, trousers, knitwear and accessories. |
| S-04 | index.json:32-35 | PROPORTION / CUT / DRAPE; TAILORING; SILHOUETTE STUDIES; SARTORIAL | Bajo: "drape" describe caída no documentada | CUT / LAYERS / DETAIL; TAILORING; SILHOUETTES; COLLECTION |
| S-05 | index.json:46-48 | Pestañas: New forms, Permanent collection, Tailoring salon | Sí: "salon" sugiere un servicio o espacio no documentado | New forms, Permanent collection, Tailoring |
| S-06 | index.json:52-53 | SARTORIAL / 02; Selected Silhouettes | Bajo | SELECTION / 02; Selected pieces |
| S-07 | index.json:69-72 | PRESENTATION / SALON 01; Silhouettes in Motion; "Observe the architectural drape, proportion and movement of each silhouette."; caption vacío | Sí: describe fotos y movimiento no verificados | IMAGES / 01; Pieces in detail; "Select a point to see each piece."; caption vacío |
| S-08 | index.json:106-109 | SALON ENSEMBLE / LOOK 03; Complete the Look; "Select the full tailored composition: the double-breasted jacket, the blouse, and the pleated trouser."; caption "Tailoring composition photographed in salon light." | Sí: "double-breasted" es falso según la ficha de nove-blazer (una botonadura). "photographed in salon light" describe fotos no verificadas. Carrito del bloque: confirmar en tienda | LOOK 03; Complete the look; "Add the jacket, blouse and pleated trouser to your cart together."; "Jacket, blouse and trouser, shown together." |
| S-09 | index.json:118-123 | THE MASTER TAILOR'S MANIFESTO / 03; "True bespoke luxury lives in the invisible mastery of the cut."; botón Explore tailoring; ATELIER ARCHIVE / STUDY 07 | Sí: "bespoke", "mastery", "archive" y "Atelier" son afirmaciones de servicio, procedencia y nombre | NOTE / 03; "Cut, layering and detail, piece by piece."; Shop tailoring; DETAIL STUDY 07 |
| S-10 | index.json:132-134 | PRIVATE SALON CORRESPONDENCE; The Master Tailor's Gazette; text vacío | Sí: "private salon" y "gazette" describen un boletín inexistente | NEWSLETTER; "Get news on new arrivals."; text vacío (D5) |
| S-11 | collection.json:10-12 | ATELIER SARTORIAL / 01; Cloth remembers the shape of daily life; "Follow a material study from cloth to finished silhouette." | Sí: "material study" y el nombre "Atelier" | TAILORING; Tailored pieces; "Browse the tailored pieces in this collection." |
| S-12 | product.json:60-61 (Care) | Care depends on the material and finish of each piece. If you are unsure how to care for it, contact us before cleaning it. | Bajo: genérico | Care depends on the material and finish of each piece. Contact us if you are unsure how to care for it. |

### 3.2 Imprint (listings/imprint/templates/)

| ID | Ruta:línea | Texto actual | Respaldo | Propuesta (EN) |
|---|---|---|---|---|
| I-01 | index.json:19 | TECHNICAL STUDIO / SPECIFICATION 01 | Sí: "technical studio" y "specification" sugieren ingeniería no documentada | COLLECTION / 01 |
| I-02 | index.json:20 | Engineered utility, precise discipline | Sí: "engineered" y "precise" | Bags and desk objects for daily use |
| I-03 | index.json:21 | Modular gear and desk objects for daily carry. | Sí: "modular" y material implícito (leather) pendiente de GPT-REPORT-014 | Leather goods, daily objects and desk pieces. (D4) |
| I-04 | index.json:22-23 | Inspect system inventory | No: texto poco claro | Shop daily objects (C-I1) |
| I-05 | index.json:24-25 | Explore desk and study | No | Shop desk and study (C-I2) |
| I-06 | index.json:48-51 | [01] MEMBRANE TELEMETRY; EDC systems | Sí: "membrane telemetry" y "EDC systems" son jerga sin base | [01] WORKSPACE; Desk and study (C-I3) |
| I-07 | index.json:69-72 | Explore leather goods; [04] BLUEPRINT ANALYSIS; Leather goods | Sí: "blueprint analysis" y material "leather" pendiente de datos | Shop leather goods; [04] COLLECTION; Leather goods (C-I4) |
| I-08 | index.json:79-81 | GRID STUDY / 02; Collection, product, process; "A denser view of the working collection." | Bajo | COLLECTION / 02; Browse the collections; "All leather goods, daily objects and desk pieces." |
| I-09 | index.json:88-90 | Pestañas: Daily objects; Workspace; (vacía) | No, pero la pestaña vacía es un defecto | Daily objects; Desk and study; Leather goods (C-I7 corregido) |
| I-10 | index.json:94-95 | SYSTEM INVENTORY / 03; Studio Modular Systems | Sí: "Studio Modular Systems" es un nombre de estudio no documentado | PRODUCTS / 03; Featured products |
| I-11 | index.json:109-117 y product.json:64-70 | Bloque technical_specs con heading "Technical specifications" y campos material, gsm, hardware, origin vacíos | Sí si se rellena. Con campos vacíos no se pinta. Riesgo: los valores se guardan por bloque y se muestran igual en todos los productos (snippets/product-technical-specs.liquid) | Sin copy. No rellenar hasta decidir el modelo por producto (D12) |
| I-12 | index.json:141-144 | EDC MODULAR CAPSULE / 05; The Complete Utility Rig; "A modular rig for daily carry, field telemetry and technical desk deployment."; caption "A modular arrangement for daily work." | Sí: "field telemetry", "technical desk deployment" y "complete" | SET / 05; Complete the set; "Three pieces shown together: document folio, four-slot cardholder and folded valet tray."; "Three pieces for daily carry and desk use." |
| I-13 | index.json:153-158 | STUDIO PRINCIPLES / 06; "Form follows engineering tolerance."; Inspect collection; TECHNICAL REPORT / 01 | Sí: "engineering tolerance" y "technical report" implican datos de ingeniería | NOTE / 06; "Simple forms, made for daily use."; Shop daily objects (C-I8); DETAIL 01 |
| I-14 | index.json:167-169 | TECHNICAL DISPATCH; Engineering telemetry & field updates; text vacío | Sí | UPDATES; New arrivals and restocks; text vacío (D5) |
| I-15 | collection.json:10-12 | TECHNICAL SPEC / 01; Engineered for high telemetry; "Toggle between compact 4-column matrix and detailed 2-column inspection view." | Sí. El texto es una instrucción de interfaz, no copy de venta. Retirar | COLLECTION / 01; Daily objects; "Pieces for everyday carry." |

### 3.3 Archive (listings/archive/templates/)

| ID | Ruta:línea | Texto actual | Respaldo | Propuesta (EN) |
|---|---|---|---|---|
| A-01 | index.json:20 | CATALOGUE I / THE HOUSE | Bajo: "the house" | COLLECTION / I |
| A-02 | index.json:21-22 | Objects with a remembered life; "A catalogue of garments and objects." | Sí: "remembered life" implica historia o procedencia | Selected garments and objects; "Browse by collection." |
| A-03 | index.json:23-26 | Enter the catalogue; View the selection | Sí en "View the selection" (apunta a restored-pieces) | Browse the collection; View selected pieces (D3) |
| A-04 | index.json:35-37 | CURATORIAL PROTOCOL / ARCHIVE 02; "What endures carries the indelible record of its creation." | Sí: "indelible record" y "protocol" | NOTE / 02; "Each piece is shown with its details." |
| A-05 | index.json:38-40 | View the archive; PLATE II / ARCHIVE COLLECTION | Bajo | View the collection; DETAIL 02 |
| A-06 | index.json:48-50 | THE PERMANENT ARCHIVE; CURATED GARMENTS & OBJECTS; CURATED SELECTIONS & ACCESSIONS | Sí: "permanent", "curated" y "accessions" implican fondo de archivo | COLLECTION; GARMENTS AND OBJECTS; SELECTED PIECES |
| A-07 | index.json:61-62 | Pestañas: (vacía); Selected pieces | Pestaña vacía: defecto | All pieces (C-A4 corregido); Selected pieces |
| A-08 | index.json:66-67 | INDEX III / THE VAULT; Archive Entries | Sí: "vault" | INDEX / 03; Pieces |
| A-09 | index.json:82-85 | PLATE V / CURATED SELECTIONS; Three objects from the archive record; "Explore each piece through the points placed across the composition."; caption "Garment study room with curated archival selections." | Sí: "archive record" y "curated archival" implican procedencia | SELECTION / 05; Three selected pieces; "Select a point to see each piece."; "Three selected pieces, shown together." |
| A-10 | index.json:99-104 y product.json:67-71 | Bloque "Archival provenance" con provenance_notes vacío | Sí: publicar procedencia sin documentación está prohibido (pending_data). Ocultar si vacío | Provenance (solo si hay notas aprobadas por pieza) (D6) |
| A-11 | index.json:124-126 | ARCHIVAL GAZETTE; New vault accession notices; text vacío | Sí: "vault accession notices" promete un contenido inexistente | UPDATES; New arrivals; text vacío (D5) |
| A-12 | collection.json:10-14 | CURATED SELECTIONS / ARCHIVE; Curated Archival Garments; "Browse the catalogue."; View the archive | Sí: "curated archival" | COLLECTION; Garments and objects; "Browse all pieces in this collection."; Shop the collection (C-A6) |

### 3.4 Raíz (templates/, preset Sartorial usa index.json según sartorial.json)

| ID | Ruta:línea | Texto actual | Respaldo | Propuesta (EN) |
|---|---|---|---|---|
| R-01 | templates/index.json:20-22 | THE EDIT / SARTORIAL 01; Form in quiet movement; "A study in quiet movement. Sculptural layers and tactile materials." | Sí: "tactile materials" | NEW SEASON / 01; New season tailoring; "Jackets, trousers, knitwear and accessories." |
| R-02 | templates/index.json:23-24 | Discover the collection | No (C-R1) | Shop all |
| R-03 | templates/index.json:25-26 | Explore the series | No, destino roto (C-R2) | Shop new forms, con destino /collections/new-forms (D2) |
| R-04 | templates/index.json:36, 42 | FORM / MATERIAL / MOVEMENT; DESIGNED TO GATHER CHARACTER | Sí leve: "character" | CUT / LAYERS / DETAIL; EVERYDAY WEAR |
| R-05 | templates/index.json:86-87 | CURATED EDIT / 02; Selected forms for the season | Bajo | SELECTION / 02; Featured pieces |
| R-06 | templates/index.json:98-99 | THE HAND AND THE MATERIAL / 03; "Objects gain meaning through the hands that make them." | Sí: "hands" y "material" | NOTE / 03; "Shown piece by piece, with its details." |
| R-07 | templates/index.json:115-117 | [01] APPAREL / FEATURED; Sculptural layers; link /collections/the-autumn-series | Sí: "sculptural". Destino roto (C-R4) | [01] OUTERWEAR; Outerwear; destino /collections/outerwear (ya declarada en sartorial.json) |
| R-08 | templates/index.json:123-127 | [02] MATERIAL STUDY; Carried close; "An editorial study in proportion, tactility and daily use."; Explore the story | Sí: "material study", "tactility" | [02] ACCESSORIES; Accessories; "Browse the accessories collection."; Shop accessories (destino /collections/accessories, ya declarada) |
| R-09 | templates/index.json:143-145 | DISCOVER BY FORM / 04; A wardrobe, a room, a way of living; "Three studies. One material language." | Sí | SHOP BY CATEGORY / 04; Shop by category; "Browse by collection." |
| R-10 | templates/index.json:189-192 | CAMPAIGN STUDY / LOOK 01; Objects in quiet conversation; "Move through the composition and discover each piece."; caption "A study in proportion, texture and daily movement." | Sí: "texture" y "movement" | LOOK 01; Featured pieces; "Select a point to see each piece."; "Featured pieces, shown together." |
| R-11 | templates/index.json:224-227 | SHOPPABLE CAPSULE / LOOK 03; Complete the look; "Choose each piece, select its size and add the full composition at once."; caption "Soft architecture photographed in natural atelier light." | Sí: la función de añadir todo el conjunto debe verificarse en tienda (bloque complete-the-look, theme.js). Caption: describe una foto no verificada | LOOK 03; Complete the look; "Choose each piece and its size, then add the selected pieces to your cart."; "Pieces shown together." |
| R-12 | templates/index.json:235-237 | Private correspondence; Notes from the atelier; text vacío | Sí: "private" y "atelier" | NEWSLETTER; Get news on new arrivals; text vacío (D5) |
| R-13 | templates/index.json:102-103 | About us | No (C-R3) | About us |
| R-14 | templates/page.about.json:10-11 | The atelier; "Tell the story of how the house began, who makes the work, and what it is made from. Two or three paragraphs are usually enough." | Sí, y es una instrucción interna: no puede publicarse | No publicar hasta que Johandry aporte texto aprobado (D7). Heading propuesto: About |
| R-15 | templates/page.about.json:17 | "A garment is finished when nothing else can be taken away." | Sí: frase de marca sin autor | Pendiente de aprobación de Johandry; sin cambio propuesto |
| R-16 | templates/page.about.json:25-27 | Inside the studio; caption vacío | Bajo: "studio" | Inside the collection (si la página se publica) |
| R-17 | templates/page.faq.json:47-48 | Contact us | No (C-F1) | Contact us |

### 3.5 Etiquetas de producto compartidas

| ID | Ruta:línea | Texto actual | Respaldo | Propuesta (EN) |
|---|---|---|---|---|
| P-01 | sartorial product.json:89 y 101-102; imprint y archive product.json:100 y 112-113 | Continue the study; Recently viewed; Pieces you considered | No | Keep "Recently viewed" y cambiar "Continue the study" a "You may also like"; "Pieces you considered" a "Recently viewed pieces" |

Total en §3: 57 filas de texto (S 12, I 15, A 12, R 17, P 1). Varias filas agrupan varios textos del mismo bloque, por eso el número de textos sueltos es mayor.

## 4. Destinos que Johandry debe crear o confirmar

| Destino | Usado por | Estado en repo | Acción |
|---|---|---|---|
| /collections/all | C-S1, C-R1 | No declarada; ruta de sistema | Confirmar que la tienda la sirve |
| /collections/tailoring | C-S2, C-S5, C-S6, C-S7, S-09 | Declarada en sartorial.json | Crear y poblar |
| /collections/new-forms | C-S3, R-03 propuesto | Declarada | Crear |
| /collections/permanent-collection | C-S4 | Declarada | Crear |
| /collections/the-autumn-series | C-R2, C-R4 (rotos) | Declarada solo "si la tienda usa la plantilla raíz"; el preset Sartorial sí la usa | Decisión D2: crear o redirigir |
| /collections/outerwear | R-07 propuesto | Declarada | Crear |
| /collections/accessories | R-08 propuesto | Declarada | Crear |
| /collections/daily-objects | C-I1, C-I5, C-I8, C-I9 | Declarada | Crear |
| /collections/desk-and-study | C-I2, C-I3, C-I6 | Declarada | Crear |
| /collections/leather-goods | C-I4, C-I7 | Declarada | Crear |
| /collections/permanent-archive | C-A1, C-A3, C-A4, C-A6 | Declarada | Crear |
| /collections/restored-pieces | C-A2, C-A5 | Declarada | Crear, con decisión D3 sobre el nombre |
| /pages/about | C-R3, C-R5 propuesto, R-14 | Declarada en pages | Crear solo con texto aprobado |
| /pages/contact | C-F1 | Declarada | Crear |
| Bloque complete-the-look (carrito conjunto) | S-08, R-11, I-12 | Código en theme.js (bundle) | Verificar en tienda que añade todas las piezas elegidas |

## 5. Decisiones para Johandry

| ID | Decisión | Afecta |
|---|---|---|
| D1 | Aprobar o corregir el copy propuesto, tono y alcance | Todos |
| D2 | /collections/the-autumn-series: crearla o usar new-forms y outerwear en su lugar. La propuesta usa lo segundo | C-R2, C-R4, R-03, R-07 |
| D3 | Confirmar el nombre y el contenido de restored-pieces y permanent-archive. El nombre "restored" afirma restauración, y pending_data pide confirmarla | C-A2, C-A5, A-03 |
| D4 | Retirar de la copy los materiales (leather, brass, wool, silk) hasta que GPT-REPORT-014 tenga datos verificados | I-03, I-07, S-02 |
| D5 | Newsletter y bloques "gazette", "updates" o "notes" sin texto: rellenarlos y tener formulario operativo, u ocultarlos. Conecta con LV-21 | S-10, I-14, A-11, R-12 |
| D6 | Procedencia por pieza: sin documentación, ocultar el bloque "Archival provenance" | A-10 |
| D7 | Página About: no publicar con el texto actual, que es instrucción interna. Johandry aporta texto aprobado | R-14, R-15, R-16 |
| D8 | Crear las páginas about, contact y faq con su plantilla | C-R3, C-R5, C-F1 |
| D9 | Confirmar que el bloque complete-the-look añade todas las piezas elegidas en una acción | S-08, R-11, I-12 |
| D10 | Asignar etiqueta a las pestañas vacías (leather-goods y permanent-archive) | C-I7, C-A4 |
| D11 | Retirar "Atelier" de la copy visible, como indica docs/decisions.md (2026-09-11) | S-09, S-11, R-12, R-14 |
| D12 | Bloque technical_specs: confirmar si se queda por bloque o pasa a datos por producto antes de rellenarlo | I-11 |

## 6. Fuera de alcance observado

- Las descripciones de producto en `docs/demo-import/data/sartorial.json` tienen afirmaciones de la misma familia: "woven in Biella", "The cut that gives the house its name", "A floating canvas, hand-stitched at the chest". Son textos de producto, no de D-01-V, y están en el mismo riesgo.
- `templates/page.documentation.json` y `templates/page.support.json` son documentación para comerciantes. Si se publican en la demo, sus frases sobre el tema también necesitan revisión.
- El campo `delivery_text` y `returns_text` vacíos son ajustes de envío, no narrativa.
- No hay "Haute Couture" en ningún archivo del repo, fuera de los documentos de auditoría.

## 7. Verificaciones pendientes

- Que `/collections/all` se sirva en la tienda de destino.
- Que el bloque complete-the-look añada las piezas elegidas (D9).
- Que las pestañas con etiqueta vacía no pinten un título de colección por defecto (D10).
- Que `templates/index.json` esté en uso por el preset Sartorial en la tienda de destino. `sartorial.json` lo lista en `listing_templates`.
