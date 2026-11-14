# Propuesta de copy de la demo: aprobación en bloque (D35)

Fecha: 2026-11-14. Rama `lote-e-claude`, base `c9347a9`. Autor: Claude. Destinatario: Johandry.
Estado: **PROPUESTA. No se ha cambiado ningún archivo del tema ni de la tienda.** Todo es preparación local; no se usó Shopify ni se tocó ninguna tienda.

Decisión de origen: D35 (`docs/decisions.md:374`): Claude propone el copy, los CTA, los handles, la página About y el mega menú de la demo, y Johandry los aprueba en bloque.

## 0. Cómo leer este documento

- **El documento D01V sí existe**: `agent-comms/outbox-claude/reviews-20261110/D01V-PROPUESTA-001.md` (12 decisiones D1 a D12, 57 textos y 28 CTA, hecho sobre el commit `e8f17e5`). El README de `docs/demo-store/` dice lo contrario, porque se escribió sin saber que ese archivo estaba en `reviews-20261110/`. Esa frase del README está desfasada.
- D01V ya está **parcialmente desfasado**. Desde entonces se quitaron los destinos que daban 404: los CTA de las plantillas ahora tienen URL vacía (el botón se oculta solo cuando falta el texto o la URL, `sections/hero-editorial.liquid:50-53`, `sections/brand-manifesto.liquid:34`) y todas las pestañas de colección apuntan a `all`. Por eso este documento **reconstruye cada decisión contra los archivos actuales** (líneas de hoy), conserva la numeración de textos de D01V entre paréntesis (S-xx, I-xx, A-xx, R-xx, C-xx) y añade lo que D01V no cubría: mega menú, descripciones genéricas del kit, handles, mensajes vacíos y la tienda real.
- Los pendientes N-1 (About) y N-2 (mega menú) vienen de `docs/demo-import/D-01-N-navegacion.md:55-56`.

### Dónde vive cada texto (importa para saber si hace falta commit)

| Etiqueta | Significado | ¿Commit? |
|---|---|---|
| **[REPO]** | El texto está en `templates/`, `listings/*/templates/`, `sections/` o `locales/`. Cambiarlo es un cambio de tema: commit, re-empaquetar y volver a subir el tema. | **Sí** (Gemini o tú autorizáis, no lo hago yo) |
| **[TIENDA]** | Contenido de la tienda demo `sartorial-theme-kvkzl39t` (productos, colecciones, páginas, menús, blog). No es del tema. | No, se cambia en la tienda (con D38 puedo hacerlo yo tras tu aprobación) |
| **[EDITOR]** | Ajuste del tema que se puede cambiar en el editor de la tienda sobre el tema subido, sin commit. Es solo de esa copia: si se vuelve a subir el tema desde el repo, se pierde. | No, pero no queda en el repo |

Regla que sigue cada propuesta: inglés neutro, sentence case en los textos de lectura (las líneas de etiqueta en mayúsculas del tema, como `NEW SEASON / 01`, ya son un estilo de diseño y se conservan), sin marcas reales, sin vocabulario interno («popover», «intent», «bento») ni de marca no configurable («atelier», «salon», «vault»), sin afirmar material, origen, ajuste, plazo de envío, restauración, año ni procedencia, y sin prometer rendimiento ni accesibilidad.

Cómo aprobar: marca `[x]` en cada casilla. Si prefieres la alternativa, escribe «alt» junto a la casilla. Si no marcas nada, la decisión sigue pendiente.

---

## 1. Hero y CTA por preset

Los botones del hero solo se ven si tienen texto **y** URL. Hoy el botón secundario de los tres presets tiene URL vacía, así que está oculto (el secundario de Sartorial dice «Explore tailoring» pero no se ve). Proponer una URL lo hace visible: la colección debe existir en la tienda.

### CP-01 · Hero de Sartorial `[REPO]` `[EDITOR]`
Dónde: `listings/sartorial/templates/index.json:19-26`, sección `hero`, preset Sartorial. (D01V S-01, S-02, S-03, C-S1, C-S2)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` | SARTORIAL / 01 | NEW SEASON / 01 | COLLECTION / 01 |
| `heading` | The Master Tailor's Cut | New season tailoring | Tailoring and layers |
| `subheading` | Sculptural tailoring cut in considered proportions. | Jackets, trousers, knitwear and accessories. | Browse jackets, trousers, knitwear and accessories. |
| `button_primary_label` / `url` | Discover the collection → `/collections/all` | Shop all → `/collections/all` | Discover the collection (sin cambio) |
| `button_secondary_label` / `url` | Explore tailoring → (vacía, oculto) | Shop tailoring → `/collections/tailoring` | dejar oculto |

Por qué: «Master Tailor» sugiere un artesano o servicio a medida que la demo no documenta. `tailoring` existe en la tienda (4 productos). `/collections/all` es ruta de sistema.
Aprobación: [ ] propuesta  [ ] alternativa

### CP-02 · Hero de Imprint `[REPO]` `[EDITOR]`
Dónde: `listings/imprint/templates/index.json:19-25`, sección `hero`. (D01V I-01 a I-05, C-I1, C-I2)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` | TECHNICAL STUDIO / SPECIFICATION 01 | COLLECTION / 01 | NEW IN / 01 |
| `heading` | Engineered utility, precise discipline | Bags and desk objects for daily use | Objects for daily use |
| `subheading` | Modular gear and desk objects for daily carry. | Bags, daily objects and desk pieces. | Browse bags, daily objects and desk pieces. |
| `button_primary_label` / `url` | Inspect system inventory → `/collections/all` | Shop all → `/collections/all` | Browse the collection |
| `button_secondary_label` / `url` | Explore desk and study → (vacía, oculto) | Shop desk and study → `/collections/desk-and-study` | dejar oculto |

Por qué: «engineered», «precise», «modular» y «gear» prometen ingeniería sin base. D01V D4 pide no nombrar materiales (por eso «Leather goods» sale del subtítulo). **La colección `desk-and-study` no existe todavía en la tienda** (solo están las colecciones de Sartorial): mientras no se cree, el botón secundario debe quedar oculto.
Aprobación: [ ] propuesta  [ ] alternativa

### CP-03 · Hero de Archive `[REPO]` `[EDITOR]`
Dónde: `listings/archive/templates/index.json:20-26`, sección `hero`. (D01V A-01 a A-03, C-A1, C-A2)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` | CATALOGUE I / THE HOUSE | COLLECTION / I | CATALOGUE / I |
| `heading` | Objects with a remembered life | Selected garments and objects | Garments and objects |
| `subheading` | A catalogue of garments and objects. | Browse by collection. | Browse garments and objects. |
| `button_primary_label` / `url` | Enter the catalogue → `/collections/all` | Browse the collection → `/collections/all` | Shop all |
| `button_secondary_label` / `url` | View the selection → (vacía, oculto) | View selected pieces → `/collections/permanent-archive` | dejar oculto |

Por qué: «remembered life» implica historia o procedencia sin documentar. El secundario ya no apunta a `restored-pieces` (nombre que afirma restauración, ver Pregunta 3). `permanent-archive` tampoco existe aún en la tienda.
Aprobación: [ ] propuesta  [ ] alternativa

### CP-04 · Hero de la plantilla por defecto `[REPO]` `[EDITOR]`
Dónde: `templates/index.json:20-26`, sección `hero_editorial`. Es lo que ve cualquier instalación limpia. (D01V R-01 a R-03, C-R1, C-R2)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` | THE EDIT / SARTORIAL 01 | NEW SEASON / 01 | COLLECTION / 01 |
| `heading` | Form in quiet movement | New season tailoring | Featured pieces |
| `subheading` | A study in quiet movement. Sculptural layers and tactile materials. | Jackets, trousers, knitwear and accessories. | Browse the collection. |
| `button_primary_label` / `url` | Discover the collection → `/collections/all` | Shop all → `/collections/all` | sin cambio |
| `button_secondary_label` / `url` | Browse collections → `/collections` | sin cambio | — |

Por qué: «tactile materials» es una afirmación de material. El botón secundario ya apunta a una ruta de sistema que existe en cualquier tienda y no se toca. Esta plantilla no debe llevar handles propios de la demo (regla del README).
Aprobación: [ ] propuesta  [ ] alternativa

---

## 2. Cinta de texto, pestañas de colección y encabezados de portada

Problema real de fondo: **las tres pestañas de cada preset apuntan a la misma colección `all`**, aunque la etiqueta diga «New forms», «Permanent collection» o «Tailoring salon». Quien pulsa una pestaña ve el mismo catálogo. No es un problema de texto, pero decide qué texto tiene sentido (ver CP-05).

### CP-05 · Sartorial: cinta, pestañas y encabezado `[REPO]` `[EDITOR]`
Dónde: `listings/sartorial/templates/index.json:32-35` (cinta), `:46-48` (pestañas), `:52-53` (encabezado). (S-04, S-05, S-06, C-S3 a C-S5)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Cinta, 4 textos | PROPORTION / CUT / DRAPE · TAILORING · SILHOUETTE STUDIES · SARTORIAL | CUT / LAYERS / DETAIL · TAILORING · SILHOUETTES · COLLECTION | TAILORING · KNITWEAR · OUTERWEAR · ACCESSORIES |
| `tab_label` 3 | Tailoring salon | Tailoring | sin cambio |
| Pestañas 1 y 2 | New forms · Permanent collection | sin cambio (ya son neutras) | — |
| Colección de las pestañas | `all` en las tres | **[EDITOR] en la tienda**: `new-forms`, `permanent-collection`, `tailoring` (existen, 9, 12 y 4 productos). **[REPO]**: se queda en `all` | dejar `all` también en la tienda y reducir a una sola pestaña |
| `eyebrow` / `heading` | SARTORIAL / 02 · Selected Silhouettes | SELECTION / 02 · Selected pieces | Featured pieces |

Por qué: «salon» sugiere un espacio o servicio. Para que las pestañas no mientan, en la tienda hay que apuntarlas a las colecciones reales; en el repo se mantiene `all` para no volver a introducir handles de demo en plantillas (regla de `README.md`, apartado «Theme settings»).
Aprobación: [ ] textos  [ ] colecciones de pestaña en la tienda (solo editor)  [ ] alternativa

### CP-06 · Imprint: cinta, tarjetas, pestañas y encabezados `[REPO]` `[EDITOR]`
Dónde: `listings/imprint/templates/index.json:32-34` (cinta), `:48-51` (tarjeta de colección), `:69-73` (historia), `:79-81`, `:88-90` (pestañas), `:94-95`. (I-06 a I-10, C-I3 a C-I7)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Cinta | TECHNICAL STUDIO · DAILY OBJECTS · DESK AND STUDY | COLLECTION · DAILY OBJECTS · DESK AND STUDY | BAGS · DAILY OBJECTS · DESK AND STUDY |
| Tarjeta colección `eyebrow` / `heading` | [01] MEMBRANE TELEMETRY · EDC systems | [01] WORKSPACE · Desk and study | [01] COLLECTION · Daily objects |
| Tarjeta historia `link_label` / `eyebrow` / `heading` | Explore leather goods · [04] BLUEPRINT ANALYSIS · Leather goods | Shop leather goods · [04] COLLECTION · Leather goods | Shop bags · [04] COLLECTION · Bags |
| Encabezado de pestañas | GRID STUDY / 02 · Collection, product, process · «A denser view of the working collection.» | COLLECTION / 02 · Browse the collections · «Bags, daily objects and desk pieces.» | COLLECTION / 02 · All pieces |
| Pestaña 2 | Workspace | Desk and study | sin cambio |
| Pestaña 3 | Leather goods (ya tiene etiqueta; D01V la veía vacía) | sin cambio | — |
| Encabezado destacados | SYSTEM INVENTORY / 03 · Studio Modular Systems | PRODUCTS / 03 · Featured products | Featured pieces |

Por qué: «membrane telemetry», «blueprint analysis», «EDC systems» y «Studio Modular Systems» son jerga que no describe nada comprobable. «Leather goods» es el **nombre de una colección** (handle `leather-goods`), no una afirmación de material de un producto; si prefieres no nombrar piel hasta verificarla, usa la alternativa «Bags» (ver Pregunta 3). Las colecciones de Imprint **no existen todavía en la tienda**; sus enlaces (`link` vacío) siguen sin URL.
Aprobación: [ ] propuesta  [ ] alternativa

### CP-07 · Archive: cinta, pestañas y encabezado `[REPO]` `[EDITOR]`
Dónde: `listings/archive/templates/index.json:48-50` (cinta), `:61-62` (pestañas), `:66-67`. (A-06 a A-08, C-A4, C-A5)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Cinta | THE PERMANENT ARCHIVE · CURATED GARMENTS & OBJECTS · CURATED SELECTIONS & ACCESSIONS | COLLECTION · GARMENTS AND OBJECTS · SELECTED PIECES | GARMENTS · OBJECTS · SELECTED PIECES |
| Pestaña 1 | Permanent archive | All pieces | sin cambio |
| Pestaña 2 | Selected pieces | sin cambio | — |
| Encabezado | INDEX III / THE VAULT · Archive Entries | INDEX / 03 · Pieces | INDEX / 03 · Selected pieces |

Por qué: «permanent», «curated», «accessions» y «vault» describen un fondo de archivo que no se puede acreditar.
Aprobación: [ ] propuesta  [ ] alternativa

---

## 3. Lookbook, «Complete the look» y capsulas

Estas secciones llevan texto que describe fotos y un conjunto. Requieren que las fotos existan antes de publicarse (hoy no hay fotos de tema en el repo).

### CP-08 · Sartorial: lookbook y complete the look `[REPO]` `[EDITOR]`
Dónde: `listings/sartorial/templates/index.json:69-72` (lookbook), `:106-109` (conjunto). (S-07, S-08)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Lookbook `eyebrow` / `heading` | PRESENTATION / SALON 01 · Silhouettes in Motion | IMAGES / 01 · Pieces in detail | LOOK / 01 · Featured pieces |
| Lookbook `description` | Observe the architectural drape, proportion and movement of each silhouette. | Select a point to see each piece. | Select a marker to see each piece. |
| Conjunto `eyebrow` / `heading` | SALON ENSEMBLE / LOOK 03 · Complete the Look | LOOK 03 · Complete the look | sin cambio de heading |
| Conjunto `description` | Select the full tailored composition: the double-breasted jacket, the blouse, and the pleated trouser. | Add the jacket, blouse and pleated trouser to your cart together. | Choose a size for each piece and add them to your cart. |
| Conjunto `caption` | Tailoring composition photographed in salon light. | Jacket, blouse and trouser, shown together. | caption vacío |

Por qué: **error de hecho**: `nove-blazer` es de una botonadura (`docs/demo-store/products.csv`), no «double-breasted». «Salon light» describe una foto que no existe. La frase «Add … together» exige que el botón del conjunto de verdad añada las tres piezas: hay que comprobarlo en la tienda antes de aprobar (D9 de D01V; no verificado).
Aprobación: [ ] propuesta  [ ] alternativa

### CP-09 · Imprint: capsula `[REPO]` `[EDITOR]`
Dónde: `listings/imprint/templates/index.json:141-144`. (I-12)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` / `heading` | EDC MODULAR CAPSULE / 05 · The Complete Utility Rig | SET / 05 · Complete the set | SET / 05 · Three pieces together |
| `description` | A modular rig for daily carry, field telemetry and technical desk deployment. | Three pieces shown together: document folio, four-slot cardholder and folded valet tray. | Choose a size or finish for each piece, then add them to your cart. |
| `caption` | A modular arrangement for daily work. | Three pieces for daily carry and desk use. | caption vacío |

Los tres productos existen en la tienda (`leather-document-folio` ACTIVE; confirmar los otros dos). Aprobación: [ ] propuesta  [ ] alternativa

### CP-10 · Archive: lookbook `[REPO]` `[EDITOR]`
Dónde: `listings/archive/templates/index.json:82-85`. (A-09)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` / `heading` | PLATE V / CURATED SELECTIONS · Three objects from the archive record | SELECTION / 05 · Three selected pieces | PLATE / 05 · Selected pieces |
| `description` | Explore each piece through the points placed across the composition. | Select a point to see each piece. | Select a marker to see each piece. |
| `caption` | Garment study room with curated archival selections. | Three selected pieces, shown together. | caption vacío |

Aprobación: [ ] propuesta  [ ] alternativa

### CP-11 · Plantilla por defecto: lookbook y complete the look `[REPO]` `[EDITOR]`
Dónde: `templates/index.json:189-192` (lookbook), `:224-227` (conjunto). (R-10, R-11)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Lookbook `eyebrow` / `heading` | CAMPAIGN STUDY / LOOK 01 · Objects in quiet conversation | LOOK 01 · Featured pieces | LOOK 01 · Pieces together |
| Lookbook `description` | Move through the composition and discover each piece. | Select a point to see each piece. | — |
| Lookbook `caption` | A study in proportion, texture and daily movement. | Featured pieces, shown together. | caption vacío |
| Conjunto `eyebrow` / `heading` | SHOPPABLE CAPSULE / LOOK 03 · Complete the look | LOOK 03 · Complete the look | — |
| Conjunto `description` | Choose each piece, select its size and add the full composition at once. | Choose each piece and its size, then add the selected pieces to your cart. | — |
| Conjunto `caption` | Soft architecture photographed in natural atelier light. | Pieces shown together. | caption vacío |

Aprobación: [ ] propuesta  [ ] alternativa

---

## 4. Manifiesto, tarjetas de descubrimiento y boletín

Dos observaciones transversales. (1) Los **boletines** tienen `text` vacío y un encabezado que promete un contenido («Gazette», «vault accession notices», «Notes from the atelier») que no existe; hay que decidir si se mantienen con texto neutro o se ocultan (Pregunta 4). (2) Los botones de los manifiestos tienen etiqueta pero URL vacía, así que están ocultos hoy.

### CP-12 · Sartorial: manifiesto y boletín `[REPO]` `[EDITOR]`
Dónde: `listings/sartorial/templates/index.json:118-122` y `:132-134`. (S-09, S-10)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Manifiesto `eyebrow` | THE MASTER TAILOR'S MANIFESTO / 03 | NOTE / 03 | ABOUT / 03 |
| Manifiesto `quote` | True bespoke luxury lives in the invisible mastery of the cut. | Cut, layering and detail, piece by piece. | Tailoring, knitwear and outerwear, piece by piece. |
| Manifiesto `button_label` / `url` | Explore tailoring → (vacía, oculto) | Shop tailoring → `/collections/tailoring` | dejar oculto |
| Manifiesto `media_label` (si hay foto) | ATELIER ARCHIVE / STUDY 07 | DETAIL STUDY 07 | — |
| Boletín `eyebrow` / `heading` | PRIVATE SALON CORRESPONDENCE · The Master Tailor's Gazette | NEWSLETTER · Get news on new arrivals | NEWSLETTER · Stay in touch |
| Boletín `text` | (vacío) | sin texto | Sign up to hear about new arrivals. |

Por qué: «bespoke», «mastery» y «Atelier» son afirmaciones de servicio y de procedencia; «Atelier» está además descartado como nombre (`docs/decisions.md`, 2026-09-11).
Aprobación: [ ] propuesta  [ ] alternativa

### CP-13 · Imprint: manifiesto y boletín `[REPO]` `[EDITOR]`
Dónde: `listings/imprint/templates/index.json:153-157` y `:167-169`. (I-13, I-14)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Manifiesto `eyebrow` | STUDIO PRINCIPLES / 06 | NOTE / 06 | ABOUT / 06 |
| Manifiesto `quote` | Form follows engineering tolerance. | Simple forms, made for daily use. | Objects for daily use. |
| Manifiesto `button_label` / `url` | Inspect collection → (vacía, oculto) | Shop daily objects → `/collections/daily-objects` | dejar oculto |
| Manifiesto `media_label` | TECHNICAL REPORT / 01 | DETAIL 01 | — |
| Boletín | TECHNICAL DISPATCH · Engineering telemetry & field updates | UPDATES · New arrivals and restocks | NEWSLETTER · Stay in touch |

«Made for daily use» no afirma cómo está hecho; si prefieres evitar incluso «made», usa «Simple forms for daily use». `daily-objects` no existe aún en la tienda.
Aprobación: [ ] propuesta  [ ] alternativa

### CP-14 · Archive: manifiesto y boletín `[REPO]` `[EDITOR]`
Dónde: `listings/archive/templates/index.json:35-39` y `:124-126`. (A-04, A-05, A-11)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Manifiesto `eyebrow` | CURATORIAL PROTOCOL / ARCHIVE 02 | NOTE / 02 | ABOUT / 02 |
| Manifiesto `quote` | What endures carries the indelible record of its creation. | Each piece is shown with its details. | Browse each piece and its details. |
| Manifiesto `button_label` / `url` | View the archive → (vacía, oculto) | View the collection → `/collections/permanent-archive` | dejar oculto |
| Manifiesto `media_label` | PLATE II / ARCHIVE COLLECTION | DETAIL 02 | — |
| Boletín | ARCHIVAL GAZETTE · New vault accession notices | UPDATES · New arrivals | NEWSLETTER · Stay in touch |

Aprobación: [ ] propuesta  [ ] alternativa

### CP-15 · Plantilla por defecto: manifiesto, tarjetas de descubrimiento y boletín `[REPO]` `[EDITOR]`
Dónde: `templates/index.json:86-87` (selección), `:98-103` (manifiesto), `:115-127` (tarjetas), `:143-145` (encabezado de descubrimiento), `:235-237` (boletín). (R-04 a R-09, R-12, R-13)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Marquee `:36`, `:42` | FORM / MATERIAL / MOVEMENT · DESIGNED TO GATHER CHARACTER | CUT / LAYERS / DETAIL · EVERYDAY WEAR | TAILORING · KNITWEAR · OUTERWEAR |
| Selección `eyebrow` / `heading` | CURATED EDIT / 02 · Selected forms for the season | SELECTION / 02 · Featured pieces | sin cambio |
| Manifiesto `eyebrow` / `quote` | THE HAND AND THE MATERIAL / 03 · Objects gain meaning through the hands that make them. | NOTE / 03 · Shown piece by piece, with its details. | ABOUT / 03 · Piece by piece. |
| Manifiesto `media_label` | MACRO STUDY / MATERIAL 07 | DETAIL 07 | — |
| Manifiesto botón | About us → (vacía, oculto) | sin cambio de texto; URL `/pages/about` **solo** cuando About esté aprobada (CP-19) | dejar oculto |
| Tarjeta destacada | [01] APPAREL / FEATURED · Sculptural layers · enlace vacío (cae a la colección) | [01] OUTERWEAR · Outerwear. Colección: `all` en el repo; `outerwear` en el editor | [01] FEATURED · Featured pieces |
| Tarjeta editorial | [02] MATERIAL STUDY · Carried close · «An editorial study in proportion, tactility and daily use.» · Explore the story | [02] ACCESSORIES · Accessories · «Browse the accessories collection.» · Shop accessories → `/collections/accessories` | [02] FEATURED · Featured pieces |
| Descubrimiento | DISCOVER BY FORM / 04 · A wardrobe, a room, a way of living · «Three studies. One material language.» | SHOP BY CATEGORY / 04 · Shop by category · «Browse by collection.» | SHOP / 04 · Browse the collection |
| Boletín | Private correspondence · Notes from the atelier | NEWSLETTER · Get news on new arrivals | NEWSLETTER · Stay in touch |

Por qué: la plantilla por defecto no debe llevar handles de la demo; «Outerwear» y «Accessories» como destinos son aceptables **en el editor de la tienda demo** (existen), no en el repo.
Aprobación: [ ] propuesta  [ ] alternativa

---

## 5. Página de colección y página de producto

### CP-16 · Tarjeta promocional de la página de colección `[REPO]` `[EDITOR]`
Dónde: `listings/{sartorial,imprint,archive}/templates/collection.json:10-14`. Aparece dentro de la rejilla de **todas** las colecciones del preset, así que el texto debe servir para cualquiera. (S-11, I-15, A-12, C-S7, C-I9, C-A6)

| Preset | Campo | Actual | Propuesto | Alternativa |
|---|---|---|---|---|
| Sartorial | `eyebrow` | ATELIER SARTORIAL / 01 | TAILORING | COLLECTION |
| Sartorial | `heading` | Cloth remembers the shape of daily life | Tailored pieces | Featured pieces |
| Sartorial | `text` | Follow a material study from cloth to finished silhouette. | Browse the tailored pieces in this collection. | Browse the pieces in this collection. |
| Sartorial | `link_label` / `link_url` | Explore tailoring → vacía | Shop tailoring → `/collections/tailoring` | dejar oculto |
| Imprint | `eyebrow` | TECHNICAL SPEC / 01 | COLLECTION / 01 | — |
| Imprint | `heading` | Engineered for high telemetry | Daily objects | Pieces for daily use |
| Imprint | `text` | Toggle between compact 4-column matrix and detailed 2-column inspection view. | Pieces for everyday carry. | Browse the pieces in this collection. |
| Imprint | `link_label` / `link_url` | Explore daily objects → vacía | Shop daily objects → `/collections/daily-objects` | dejar oculto |
| Archive | `eyebrow` | CURATED SELECTIONS / ARCHIVE | COLLECTION | — |
| Archive | `heading` | Curated Archival Garments | Garments and objects | Selected pieces |
| Archive | `text` | Browse the catalogue. | Browse all pieces in this collection. | Browse the collection. |
| Archive | `link_label` / `link_url` | View the archive → vacía | Shop the collection → `/collections/permanent-archive` | dejar oculto |

Por qué: el texto de Imprint es una **instrucción de interfaz** («Toggle between…»), no copy de venta, y «Curated Archival Garments» afirma un fondo curado. Un enlace fijo a una colección dentro de una tarjeta que aparece en todas las colecciones puede apuntar a la misma página en la que ya estás; si no te gusta, usa «dejar oculto».
Aprobación: [ ] propuesta  [ ] alternativa

### CP-17 · Etiquetas de la fila «recently viewed» y de recomendaciones `[REPO]` `[EDITOR]`
Dónde: `templates/product.json:89,101-102`; `listings/sartorial/templates/product.json:89,101-102`; `listings/{imprint,archive}/templates/product.json:100,112-113`. (P-01)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Recomendaciones `eyebrow` | Continue the study | You may also like | More to explore |
| Vistos `eyebrow` / `heading` | Recently viewed · Pieces you considered | Recently viewed · Recently viewed pieces | sin cambio de eyebrow; heading «Pieces you looked at» |

Por qué: «study» y «considered» son estilo interno; «You may also like» es habitual y no afirma nada. Cuatro plantillas.
Aprobación: [ ] propuesta  [ ] alternativa

### CP-18 · Bloques de ficha técnica (Imprint) y procedencia (Archive), hoy vacíos `[REPO]` `[EDITOR]`
Dónde: `listings/imprint/templates/index.json:112-117` y `product.json:67` (heading «Technical specifications», campos `material`, `gsm`, `hardware`, `origin` vacíos); `listings/archive/templates/index.json:100` y `product.json:67` (heading «Archival provenance», `provenance_notes` vacío, `condition_grade: not_assessed`). (I-11, A-10)

| Bloque | Propuesto | Alternativa |
|---|---|---|
| Ficha técnica de Imprint | **No rellenar nada** y no cambiar el heading. Con campos vacíos no se pinta | Cambiar el heading a «Details» si se va a usar |
| Procedencia de Archive | **No rellenar nada**. Ocultar mientras no haya notas aprobadas pieza a pieza | Cambiar el heading a «Notes» |

Por qué: los valores se guardan **por bloque de plantilla y se muestran iguales en todos los productos** (D12 de D01V): rellenarlos pondría el mismo material en todas las fichas. Publicar procedencia sin documentación está prohibido (`pending_data` de `archive.json`).
Aprobación: [ ] dejar vacío  [ ] alternativa

---

## 6. Páginas

### CP-19 · Página About `[REPO]` + `[TIENDA]`
Hay dos capas: la plantilla del tema (instruye, hoy visible al comprador) y el cuerpo de la página en la tienda. Esto resuelve **N-1** de `D-01-N-navegacion.md:55`.

**Capa del tema** (`templates/page.about.json:10-11,17,25-27,33`, sección `main-about`). (R-14 a R-16)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| `eyebrow` (`:33`) | Our story | About | sin cambio |
| Bloque historia `title` (`:10`) | The atelier | About this store | Who we are |
| Bloque historia `text` (`:11`) | Tell the story of how the house began, who makes the work, and what it is made from. Two or three paragraphs are usually enough. | This is a demonstration store used to preview the theme. The products, prices and photos are examples. | vacío (se oculta) |
| Bloque cita (`:17`) | A garment is finished when nothing else can be taken away. | **vacío** | mantener si apruebas la frase (no tiene autor) |
| Galería `title` (`:25`) | Inside the studio | Gallery | vacío |

**Capa de la tienda** (página `about`, plantilla `page.about`, creada el 2026-11-14 según `created-content.json`). El cuerpo propuesto es el de `pages.md`:

```html
<p>This is a demonstration store used to preview the theme. The products, prices and photos are examples and are not for sale.</p>
<p>Use this page to tell customers who you are, what you sell and how to reach you. Replace this text with your own story.</p>
```
Alternativa para la tienda: dejar el cuerpo con solo la primera frase y quitar «Use this page…» (esa segunda frase es una instrucción al comerciante, no al comprador).

Por qué: el texto actual es una **instrucción interna visible al comprador** y «atelier», «the house» y «what it is made from» prometen una historia y un origen. Con la plantilla sin imágenes aparecen placeholders SVG (`sections/main-about.liquid:52-53`): hace falta subir las cuatro fotos (hero e `image_1` a `image_3`) o aceptar que se vean los placeholders. Ver Pregunta 1.
Aprobación: [ ] texto del tema  [ ] cuerpo de la tienda  [ ] alternativa

### CP-20 · FAQ: botón final y preguntas `[REPO]` + `[TIENDA]`
Dónde: `templates/page.faq.json:42-48` (bloque final), `:62` (eyebrow). (C-F1, R-17)

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Título | Still have a question? | sin cambio | — |
| Texto | Our team is happy to help with anything not covered here. | sin cambio | Write to us if your question is not answered here. |
| `button_label` / `button_url` | Contact us → vacía (oculto) | Contact us → `/pages/contact` | dejar oculto |
| Pregunta de envío | When will my order be dispatched? · «Dispatch and delivery times depend on the item and your destination. Contact us before ordering if you need a piece by a specific date.» | sin cambio (no promete plazo) | — |
| Tallas y cuidado | Which size should I choose? / How should I care for my piece? | sin cambio (neutras) | — |

Detalle: poner la URL en la plantilla raíz introduce `/pages/contact` en el repo, y el README lo había dejado vacío a propósito para que una instalación limpia no dé 404. Las tres preguntas ya son neutras. Propuesta: **URL en el editor de la tienda demo** (la página `contact` existe), y el repo se queda vacío.
Aprobación: [ ] URL solo en el editor  [ ] URL también en el repo  [ ] alternativa

### CP-21 · Contact `[TIENDA]`
Cuerpo de la página `contact` (ya existe, «updated existing»): «Write to us about an order or a product using the form on this page. Replace this text with your own contact details.» (`pages.md`). Propuesta: quitar la segunda frase para la demo pública y dejar «Write to us about an order or a product using the form on this page.» Alternativa: sin cambio.
Aprobación: [ ] propuesta  [ ] alternativa

---

## 7. Mega menú y navegación

### CP-22 · Tarjetas promocionales del mega menú `[REPO]` `[EDITOR]`
Dónde: `sections/header-group.json:31-39`, bloque `mega_menu_promo_catalog` (hooked a «Catalog»). Resuelve **N-2**. El grupo de secciones es **común a los tres presets**.

| Ajuste | Actual | Propuesto para Sartorial (demo) | Propuesto para el repo (válido en los tres presets) |
|---|---|---|---|
| `heading_1` | New Arrivals | New forms | New arrivals |
| `subheading_1` | Explore the autumn edit | Shop the latest pieces | Shop the latest pieces |
| `link_1` | `/collections/all` | `/collections/new-forms` | `/collections/all` |
| `image_1` | vacía | foto «New forms» (`sartorial-photos.csv`, 800 px, 4:5) | vacía |
| `heading_2` | Capsule Wardrobe | Permanent collection | Shop all |
| `subheading_2` | (vacío) | Shop the core range | Browse the full catalog |
| `link_2` | `/collections/all` | `/collections/permanent-collection` | `/collections/all` |
| `image_2` | vacía | foto «Permanent collection» | vacía |

Alternativa Sartorial: tarjeta 2 = «Outerwear» → `/collections/outerwear` (si quieres otra colección distinta de la foto).
Imprint y Archive: `docs/demo-import/{imprint,archive}-photos.csv` ya reservan las fotos del mega menú a «Leather goods»/«Desk and study» y «Permanent archive»/«Restored pieces». Cuando esas colecciones existan, el texto por preset se pondría en el editor de cada tema (**[EDITOR]**, no en el repo).

Por qué: «autumn edit» fija una estación y «Capsule Wardrobe» no encaja con Imprint ni con Archive. Los enlaces antes iban a `all` y ahora la propuesta usa colecciones que sí existen en la tienda (verificado en `created-content.json`: `new-forms`, `permanent-collection`).
Aprobación: [ ] textos del repo  [ ] valores Sartorial (editor)  [ ] alternativa

### CP-23 · Elementos del menú, pie y barra de anuncio `[TIENDA]` + `[REPO]`

Menú principal (`menus.md`, ya creado en la tienda): los nombres de los hijos de **Catalog** son los títulos de las colecciones reales. Propuesta de rótulos y destinos (todos existen en la tienda):

| Elemento | Destino | Estado |
|---|---|---|
| Catalog | `/collections/all` | No renombrar: el mega menú está enganchado a ese título (`header-group.json:31`) |
| New forms | `/collections/new-forms` | Propuesto, sin cambio |
| Permanent collection | `/collections/permanent-collection` | Propuesto, sin cambio |
| Tailoring | `/collections/tailoring` | Propuesto, sin cambio |
| Knitwear | `/collections/knitwear` | Propuesto, sin cambio |
| Outerwear | `/collections/outerwear` | Propuesto, sin cambio |
| Accessories | `/collections/accessories` | Propuesto, sin cambio |
| Tailoring (primer nivel) | `/collections/tailoring` | Duplica un hijo de Catalog. Alternativa: sustituir por «New arrivals» → `/collections/new-arrivals` (existe, 3 productos) |
| About | `/pages/about` | Dejar solo si CP-19 se aprueba (si no, se quita del menú) |
| Contact | `/pages/contact` | Propuesto, sin cambio |

Pie (`footer`): FAQ, Contact, Shipping policy, Refund policy, Privacy policy, Terms of service. Sin cambio de texto. Los enlaces a políticas solo valen cuando las políticas estén publicadas (las crea Johandry a mano, D38).

Barra de anuncio `[REPO]` (`sections/header-group.json:11`): actual «Explore the collection» → `/collections/all`. Propuesta: «Shop all» (alternativa: sin cambio). Es texto compartido por los tres presets.
Aprobación: [ ] rótulos del menú  [ ] sustituir el duplicado «Tailoring»  [ ] anuncio  [ ] alternativa

---

## 8. Contenido de la tienda demo

### CP-24 · Descripciones genéricas de producto del kit `[TIENDA]`
Dónde: `docs/demo-store/products.csv` (columna `Body (HTML)`), generado por `docs/demo-store/scripts/build-products-csv.mjs:14` (`NOTE`). Está en 21 productos activos; ya están en la tienda `sartorial-theme-kvkzl39t` (`created-products.json`).

Hoy cada descripción es `A <forma>. Demo product for theme preview. Replace this text with your own description.` Ejemplos: «A single-breasted blazer with notch lapels. Demo product for theme preview. Replace this text with your own description.»

El problema: la segunda y tercera frase son **instrucciones al comerciante, visibles al comprador** de la demo, en cada ficha.

| Ajuste | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Sufijo de todas las descripciones | Demo product for theme preview. Replace this text with your own description. | **Quitar el sufijo**: la descripción se queda con la frase de forma («A single-breasted blazer with notch lapels.») | Sufijo corto «Demo product.» |
| Frase de forma | p. ej. «A long wrap coat in a neutral palette, shown with three colours and five sizes.» | sin cambio | — |
| `silk-twill-square` | descripción vacía (fixture a propósito) | sin cambio | — |

Por qué: la frase de forma solo describe corte visible y opciones, no material, origen, ajuste ni cuidado. Quitar el sufijo exige reescribir 21 descripciones en la tienda (con D38 lo haría yo) y regenerar `products.csv` (cambio en el repo del script; **requiere commit** si quieres que kit y tienda coincidan). Nota: el `README.md` pide que la demo sea idéntica a una instalación limpia; el sufijo era la forma de avisar de que es demo, el aviso ya está en About y en la barra de anuncio si se aprueba.
Aprobación: [ ] quitar el sufijo en la tienda  [ ] regenerar también el kit en el repo  [ ] alternativa

### CP-25 · Handles y títulos con palabra de material `[TIENDA]`
D01V ya lo señaló en `D-01-catalogo-y-fotos.md:68` y está en los pendientes de Johandry (`CLAUDE-CLOUD-STATUS.md:51`). Hoy los handles y títulos son parte de los **fixtures** de las pruebas, así que cambiarlos tiene coste.

| Handle | Problema | Propuesto | Alternativa |
|---|---|---|---|
| `hand-framed-cotton-polo` | «hand-framed» afirma trabajo a mano y «cotton» material (Imprint/Archive, no está en el kit Sartorial) | `cotton-polo` | dejarlo y aceptar que se ve en la URL |
| `milled-brass-paperweight` (título ya «Brass Paperweight») | «milled» y «brass» afirman proceso y material | `brass-paperweight` | `desk-paperweight` si no se confirma el metal |
| `structured-tote` | Existe en Sartorial («Structured Tote») y en Imprint («Structured Tote in Calfskin»); si comparten tienda se pisan, y «Calfskin» es material | Sartorial: `structured-leather-tote` solo si comparten tienda; título Imprint «Structured Tote» sin «in Calfskin» hasta verificar | no cambiar y mantener una sola tienda por preset |
| `cashmere-scarf`, `cashmere-rib-crew`, `silk-twill-square`, `silk-charmeuse-blouse`, `leather-belt`, `wrap-wool-skirt`, `fine-merino-turtleneck`, `oversized-alpaca-knit` | Los títulos y handles nombran un material. Las descripciones ya no lo afirman, pero el título sí lo hace | Mantener: son nombres de fixtures (`cashmere-scarf` = 1 variante, `silk-twill-square` = sin descripción, `leather-belt` = sin imagen) y el material en el nombre es habitual en un catálogo demo; el aviso de «demo» ya existe | Renombrar a `knit-scarf`, `twill-square`, `plain-belt`… y actualizar las referencias de `listings/*` y `README.md` |

Renombrar un handle rompe cualquier referencia en plantillas (las plantillas del preset Sartorial usan `cashmere-scarf`, `silk-charmeuse-blouse`, `cashmere-rib-crew` y `wrap-wool-skirt` en `listings/sartorial/templates/index.json:62-65,100-102` y `templates/index.json`), por lo que es un cambio **[REPO]+[TIENDA]**.
Aprobación: [ ] los tres primeros  [ ] mantener los demás  [ ] alternativa

### CP-26 · Mensajes de colección vacía y de estados vacíos `[REPO]`
Dónde (textos del tema, no de la tienda): `locales/en.default.json` y las secciones que los usan; hoy no están en plantillas JSON.

| Mensaje | Dónde | Actual | Propuesto | Alternativa |
|---|---|---|---|---|
| Colección sin productos | `collections.general.empty` (`locales/en.default.json:521`), usado en `sections/main-collection.liquid:413` | This collection is empty. | There are no products in this collection yet. | sin cambio (ya es neutro) |
| Filtros sin resultados | `collections.general.no_products` (`:520`) | No products match your selection. | sin cambio | — |
| Enlace de salida | `collections.general.browse_all` (`:522`) | Browse all products | sin cambio | — |
| Lista de colecciones vacía | `:395` | No collections are available yet. | sin cambio | — |
| Blog sin artículos | `:292` | No essays have been published yet. | No articles have been published yet. | sin cambio |
| Etiquetas del blog | `read_essay`, `latest`, `article_count` («essay/essays», `:286-290`) | Read the essay · Latest essays · {{ count }} essay(s) | Read the article · Latest articles · {{ count }} article(s) | sin cambio (estilo editorial) |
| Carrito vacío | `:63`, `:572` | Your cart is currently empty. | sin cambio | — |

Por qué: «essay» es estilo del tema, no describe un blog de tienda normal. Los idiomas adicionales de `locales/` (si el cambio se hace) también necesitan la clave. La demo usa la vista «colección vacía» con `empty-test` y «uno solo» con `single-product-test`.
Aprobación: [ ] colección vacía  [ ] blog  [ ] alternativa

### CP-27 · Blog y colecciones de prueba `[TIENDA]`
Dónde: `docs/demo-store/blog.md`, `collections.md`. Los tres artículos del blog `news` ya existen en la tienda.

| Elemento | Actual | Propuesto | Alternativa |
|---|---|---|---|
| Artículo 1 | «Welcome to the demo store» · «This store is used to preview the theme. Replace this article with your own news.» | sin cambio de título; cuerpo: «This store is used to preview the theme. The articles here are examples.» | sin cambio |
| Artículo 2 | «How to read the size chart» · «Sizes in this demo go from XS to XL. Replace this text with your own measurements and advice.» | **No publicar** hasta tener guía de tallas (D-02-T): promete una guía que no existe | sin cambio |
| Artículo 3 | título de 120+ caracteres (fixture) | sin cambio | — |
| Colecciones de prueba `empty-test`, `single-product-test`, `test-fixtures` | Publicadas en la tienda | **Quitar del canal Online Store** antes de mostrar la demo; no enlazar desde menús | mantener publicadas solo para las pruebas |

Aprobación: [ ] propuesta  [ ] alternativa

---

## 9. Tabla resumen

| Decisión | Archivo(s) | Estado | ¿Commit? |
|---|---|---|---|
| CP-01 Hero Sartorial | `listings/sartorial/templates/index.json:19-26` | Propuesto, pendiente de aprobar | Sí (repo) o editor |
| CP-02 Hero Imprint | `listings/imprint/templates/index.json:19-25` | Propuesto; secundario depende de crear `desk-and-study` | Sí o editor |
| CP-03 Hero Archive | `listings/archive/templates/index.json:20-26` | Propuesto; ver Pregunta 3 | Sí o editor |
| CP-04 Hero por defecto | `templates/index.json:20-26` | Propuesto | Sí o editor |
| CP-05 Sartorial cinta/pestañas | `listings/sartorial/templates/index.json:32-53` | Propuesto; pestañas con `all` es defecto de datos | Sí o editor |
| CP-06 Imprint cinta/tarjetas | `listings/imprint/templates/index.json:32-95` | Propuesto | Sí o editor |
| CP-07 Archive cinta/pestañas | `listings/archive/templates/index.json:48-67` | Propuesto | Sí o editor |
| CP-08 Sartorial lookbook/conjunto | `listings/sartorial/templates/index.json:69-109` | Propuesto; verificar «add together» en tienda | Sí o editor |
| CP-09 Imprint capsula | `listings/imprint/templates/index.json:141-144` | Propuesto | Sí o editor |
| CP-10 Archive lookbook | `listings/archive/templates/index.json:82-85` | Propuesto | Sí o editor |
| CP-11 Defecto lookbook/conjunto | `templates/index.json:189-227` | Propuesto | Sí o editor |
| CP-12 Sartorial manifiesto/boletín | `listings/sartorial/templates/index.json:118-134` | Propuesto; ver Pregunta 4 | Sí o editor |
| CP-13 Imprint manifiesto/boletín | `listings/imprint/templates/index.json:153-169` | Propuesto | Sí o editor |
| CP-14 Archive manifiesto/boletín | `listings/archive/templates/index.json:35-126` | Propuesto | Sí o editor |
| CP-15 Defecto manifiesto/tarjetas/boletín | `templates/index.json:36-237` | Propuesto | Sí o editor |
| CP-16 Tarjeta promo de colección | `listings/*/templates/collection.json:10-14` | Propuesto | Sí o editor |
| CP-17 Etiquetas recomendaciones | 4 × `product.json` | Propuesto | Sí |
| CP-18 Ficha técnica / procedencia | `listings/{imprint,archive}/templates/*.json` | Propuesto: dejar vacío | No |
| CP-19 About | `templates/page.about.json` + página `about` | Propuesto; bloqueado por fotos y Pregunta 1 | Sí (tema) + tienda |
| CP-20 FAQ botón final | `templates/page.faq.json:42-48` | Propuesto: URL solo en el editor | No (editor) |
| CP-21 Contact | página `contact` en la tienda | Propuesto | No |
| CP-22 Mega menú | `sections/header-group.json:31-39` | Propuesto (repo neutro + valores Sartorial) | Sí (repo) o editor |
| CP-23 Menús y anuncio | menús `main-menu`/`footer`; `header-group.json:11` | Propuesto | No (menús) / Sí (anuncio) |
| CP-24 Descripciones del kit | `docs/demo-store/products.csv`, `scripts/build-products-csv.mjs:14` | Propuesto: quitar sufijo | Tienda sin commit; kit con commit |
| CP-25 Handles y títulos | `docs/demo-import/data/*.json`, productos de la tienda | Propuesto parcialmente; ver Pregunta 2 | Sí + tienda |
| CP-26 Mensajes vacíos | `locales/en.default.json:286-292,521` | Propuesto | Sí |
| CP-27 Blog y colecciones de prueba | `docs/demo-store/blog.md`, `collections.md` | Propuesto | No (tienda) |

Resumen de impacto: **solo CP-18, CP-20 (en el editor), CP-21, CP-23 (menús) y CP-27 no requieren commit**. Todo lo demás vive en el repo (o en una copia del tema subido, que se pierde al volver a subirlo).

---

## 10. Preguntas abiertas (solo tú puedes decidirlas)

1. **¿Se publica About en la demo, y con qué contenido?** Hay dos caminos: (a) texto neutro de demo (CP-19) y subir las cuatro fotos (o aceptar placeholders), o (b) quitar About del menú hasta tener una historia y fotos aprobadas. La historia real de la marca («who makes the work, what it is made from») solo la conoces tú.
2. **¿Se renombran los handles y títulos con material, o se mantienen como fixtures?** CP-25: `hand-framed-cotton-polo`, `milled-brass-paperweight` y `structured-tote` (con «Calfskin») son los tres que afectan a Imprint/Archive; los títulos con «Cashmere», «Silk», «Leather» del kit Sartorial son nombres de fixtures. Renombrar rompe referencias de plantillas y de pruebas.
3. **¿Imprint y Archive usan «leather» y «restored/permanent archive» en nombres de colección?** Las colecciones se llaman `leather-goods`, `restored-pieces`, `permanent-archive` (`D-01-catalogo-y-fotos.md`). «Restored» afirma restauración y «permanent archive» un fondo; «leather» nombra un material. Si no hay respaldo, hay que renombrar las colecciones (y sus handles) antes de crearlas. Las colecciones de Imprint y Archive aún **no existen** en la tienda.
4. **¿Los boletines se ocultan o se dejan con texto neutro?** CP-12 a CP-15 proponen un encabezado neutro sin texto de apoyo. Un boletín visible exige un formulario operativo (ajustes de correo, LV-21); si no vas a configurarlo para la demo, es más honesto ocultar la sección.
5. **¿Pestañas de colección y ajustes de la tienda: solo en el editor de la tienda, o también en el repo?** Los cambios `[EDITOR]` no quedan en el repo y se pierden al volver a subir el tema; los `[REPO]` exigen commit. Decide cuáles de los textos de arriba van por cada vía (mi recomendación: textos neutros al repo, colecciones y URLs de demo solo al editor) y quién autoriza el commit (Gemini o tú).

## 11. Qué no cubre este documento

- Textos de `templates/page.documentation.json` y `page.support.json` (documentación para comerciantes, D01V §6).
- Precios, tallas y el contenido de las políticas (legal, lo escribe el comerciante).
- Descripciones de producto de Imprint y Archive (ver `D-01-catalogo-y-fotos.md:62-70`; ya se sustituyeron en la ronda C-08).
- No he verificado nada en tienda (no se consultó ninguna). Las comprobaciones pendientes están marcadas en CP-08 y CP-22.
