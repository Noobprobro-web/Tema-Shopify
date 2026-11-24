# GPT-R3-001 — entrega

ID: GPT-TASK-R3-001 + GPT-TASK-R3-001-ADENDA-A
Estado: Implementado y publicado en gpt/r3-copy-plantillas; PR #24 abierto en borrador contra master.
Decisión requerida: aprobar el copy y los defaults Nivel 2 enumerados en D35.
Resumen en 5 líneas: Se aplicaron los cambios R3 originales y las correcciones D1–D6 de la revisión.
Se conservaron los contratos data-*, IDs, clases y elementos que consume JS/CSS.
No se cambiaron locales, ledger, ZIP ni manifiesto rastreado.
Las 8 etapas de gates:static y playwright --list finalizaron con código 0.
La prueba en tienda real y los estados visuales no se ejecutaron; se razonaron por código.
Archivos tocados: 21 archivos de código/plantilla de 3.1 y este informe.
Desviaciones (Nivel 1 o Nivel 2): Nivel 2 únicamente en defaults autorizados como base por DP-010; copy sujeto a D35/DP-011.
Hallazgos extra fuera de alcance (con parche listo): propuestas de localización/schema detalladas abajo; no se editan archivos fuera de alcance.
Verificación (comando, resultado y qué demuestra/qué no): npm run gates:static y npx playwright test --list, resultados y límites en 6.
Lista de afirmaciones falsables numeradas: A1–A8 en 8.

## 1. Dictamen previo

- **Reconciliación:** sin desacuerdo material con 2 de CLAUDE-R3-ANALISIS-001. La separación por archivo, los arreglos asignados y las dependencias con cambios de Claude son coherentes con el código inspeccionado.
- **Severidades:** mantengo **R3-AS-01 en media**, según DP-016; **R3-AS-11 en baja**, ya que solo afecta configuraciones no predeterminadas; y **R3-SO-03 / R3-SO-06 en baja**, pues dependen de configuración y el control afectado está desactivado por defecto. No vi evidencia que justifique elevarlas.
- **Reparto y decisiones:** sin desacuerdo con DP-007…DP-016 ni con el reparto. Se respetó la lista cerrada; las propuestas para D35 y los cambios de Claude quedan separados. Los defaults de schema se implementaron bajo la autorización base DP-010 y no se consideran aprobación comercial final.

## 2. Cambios

Las líneas siguientes son las líneas resultantes en esta rama. La revisión del diff contra master confirma las transformaciones “antes → después”; git diff --check no reportó errores.

| Hallazgos | Archivo y cambio (antes → después) | Verificación / casos límite razonados |
| --- | --- | --- |
| FB-12 / SO-01, FO-08 | listings/archive/templates/index.json:83-85: copy que prometía tres objetos y hotspots → “Collection highlights”, descripción genérica y caption vacío. | JSON válido en gates:json; no promete contenido cuando los marcadores no pintan productos. |
| FB-12 / SO-09 | listings/imprint/templates/collection.json:10-12: eyebrow numerado y promesa de controles/columnas → “Collection details” y texto de producto. | JSON válido; no depende de la configuración de columnas. |
| FB-12 | sections/header-group.json:34: “Explore the autumn edit” → “Explore the collection”. | JSON válido; elimina la temporada fija. |
| FO-08 | templates/index.json:227 y sections/lookbook.liquid:241, sections/complete-the-look.liquid:410: captions descriptivos por defecto → vacío. lookbook.liquid:172-174 y complete-the-look.liquid:146 también suprimen caption cuando no hay imagen. | Razonado con medio ausente: no se muestra texto que describa el placeholder. |
| FB-59 | templates/page.faq.json:47: button_label “Contact us” → vacío; no se inventa una URL. | JSON válido; evita CTA sin destino. |
| FB-42 / FB-43 | sections/main-blog.liquid:9-21,54,96-106,114-133: destacado filtrado por etiquetas, recuento y tarjetas basados en paginate.items, exclusión del destacado limitada a cuando realmente se muestra; título/lista se omiten si el remanente es 0; slash condicionado a fecha visible. | Razonado con 0, 1 y 2 artículos, incluida /tagged/ y página paginada. Con 1 artículo destacado no queda lista vacía; con 2 queda el remanente. Sin autor/fecha no se imprime metadata vacía. No probado en storefront. |
| FB-60 | sections/main-article.liquid:96-112: navegación anterior/siguiente → <nav> solo si existe uno de los artículos vecinos. | Razonado para blog de un artículo y extremos del blog: no queda landmark vacío. |
| FB-61 | sections/main-password.liquid:8-13,54: heading opcional → fallback a shop.name y escape. | Razonado con heading vacío; si también falta el nombre de tienda, revisar el contenido que da Shopify en runtime. |
| FO-11 | layout/password.liquid:131: salida directa de shop.name → shop.name | escape. | Revisado en diff; Theme Check pasó. |
| FB-27 | sections/main-search.liquid:335,343: headings de artículos/páginas h2 → h3. | Jerarquía resultante razonada respecto al h2 de lista y el h3 de producto; búsqueda runtime no ejecutada. |
| FB-24 | sections/main-collection.liquid:88-89,96-97; sections/main-search.liquid:95-96: aria-label en span genérico → número visual con aria-hidden y nombre traducido en visually-hidden, usando la clave existente. | Contrato de texto y localización verificado estáticamente; axe no ejecutado en tienda. |
| FB-50 / AS-11 | sections/main-list-collections.liquid:5-8,44: sizes fijo de 3 columnas → card-sizes con 1/2/columns_desktop. | Razonado con los ajustes 2, 3 y 4 columnas; los 2 iniciales son tabletas. Carga de imagen real no medida. |
| FO-06 | sections/main-faq.liquid:19-21: comentario Liquid en español → traducción inglesa con el mismo sentido. | Búsqueda solicitada sin resultado: rg -n "Indice del primer" sections/main-faq.liquid devuelve salida vacía. |
| FO-04 | sections/brand-manifesto.liquid:4-9,56; sections/main-password.liquid:9-13,20-27; sections/complete-the-look.liquid:4-9,132-138; sections/lookbook.liquid:4-9,54-60; sections/hero-editorial.liquid:44-53,108-114,162-168; sections/main-collection.liquid:372-378,396-402: prioridad image_alt, luego image.alt; se elimina el heading/locale como texto alternativo; si ambos alts faltan y hay encabezado visible, pasa decorative: true. | Razonado por cada patrón: override presente; override vacío con alt en Files; ambos vacíos con texto visible → imagen decorativa. Si los tres faltan, no se inventa un alt. Revisión estática; lector de pantalla no probado. |
| FO-08 / FO-01 | sections/lookbook.liquid:172-174,235,241; sections/complete-the-look.liquid:146,410; sections/brand-manifesto.liquid:95,142; sections/main-collection.liquid:591: captions condicionados a imagen; defaults sin numeración ni instrucción. | Razonado con imagen ausente/presente; requiere aprobación D35 para defaults. |
| FB-45 | sections/lookbook.liquid:70,85-100,111,117: contador propio avanza solo con productos reales; marcadores de editor conservan forloop.index. | Razonado con hotspot vacío antes de uno válido: en storefront el válido recibe 1; en editor el marcador conserva su índice de bloque. Contratos data-lookbook-trigger y aria-controls preservados. |
| FB-56 | sections/hero-editorial.liquid:98,152; sections/lookbook.liquid:45-47; sections/complete-the-look.liquid:125-127: fuente móvil añade 1100w. | Revisado en diff y Theme Check; selección y nitidez en navegador no medidas. |
| FB-01 | sections/complete-the-look.liquid:243-244,269-270: money | escape → money | escape_once. | Revisión de las cuatro salidas de precios; no se ejecutó un cambio de variante en navegador. |
| FO-09 | sections/complete-the-look.liquid:324-325,339-343: claves .one/.other seleccionadas a mano → raíz plural con count; se mantiene el caso 0 para select_items. | gates:locales resuelve las claves en inglés; el locale español conserva sus claves plurales existentes. No se probó render de Shopify con plural few/many. Se preservaron data-*-template. |
| FB-26 y adenda B | sections/marquee.liquid:15-16,52: se quitan role="region", aria-label fijo y aria-pressed="false". | gates:hooks: 0 contratos rotos. Se mantienen los cuatro data-* requeridos por el encargo/adenda. No se cambió ningún ID/clase. |
| FB-32 | sections/blog-posts.liquid:48-55: para rejilla singleton, card-sizes 1/1/1 con max_width: 448; demás casos conservan cálculo anterior. | Razonado con 1 artículo (448 px) y varios (tamaño configurado). Theme Check pasó. |
| FB-52 y adenda A | sections/collection-list.liquid:36-43,91-94: singleton usa 1 pista de 448 px, sin gap; imagen de primer producto se consulta solo si faltan imagen de bloque y destacada de colección. | Razonado con 1 colección (448 px) y 2+ (cálculo existente); con imagen propia no se evalúa fallback del producto. Theme Check pasó. |
| FB-57 / SO-06 | snippets/product-provenance.liquid:22-25: distintivo de pieza única requiere además inventory_quantity == 1. | Razonado: una variante con cantidad 30 no se etiqueta como única; cantidad exactamente 1 sí, bajo los demás criterios previos. No inspeccionado inventario real de Shopify. |

**Estados degenerados del conjunto modificado (razonamiento estático):** vacío: blog sin artículos oculta su lista; lookbook/complete-the-look sin medios no muestran caption y el look conserva su mensaje vacío existente; sin filtros no aparece contador. Uno: blog de un artículo no deja lista/nav vacía; grids singleton usan 448 px; un hotspot válido empieza en 1; distintivo exige inventario 1. Muchos: blog y búsqueda usan la página de resultados/paginación; contadores recorren la página; las fuentes conservan variantes responsive y suman 1100w. Muy largo: títulos siguen escapados y los headings usan su misma estructura; los precios pasan por escape_once; no se midió el layout con título de 120 caracteres ni moneda extrema. Faltante: alt vacío con título visible lleva decorative; medio ausente suprime caption; colección sin imagen propia llega al primer producto solo como último fallback. No se ejercitaron estos casos en una tienda real.

## 3. Ledger de requisitos

No edité docs/requirements-ledger.md (prohibido por 3.2) ni marco como cumplida ninguna fila con esta verificación estática. Solicito que Claude actualice evidencias/localizadores, sin cambiar estado, en estas filas relacionadas:

| Fila existente | Evidencia candidata en esta rama |
| --- | --- |
| Imágenes Responsivas (srcset, sizes) (línea 34) | sections/main-list-collections.liquid:5-8,44; sections/blog-posts.liquid:48-55; sections/collection-list.liquid:36-43; sections/hero-editorial.liquid:98,152; sections/lookbook.liquid:45-47; sections/complete-the-look.liquid:125-127. |
| Jerarquía Estricta de Encabezados (h1 único) (línea 52) | sections/main-search.liquid:335,343 ahora usa h3 para tarjetas de artículo/página. Esta evidencia no reemplaza la verificación axe en vivo. |
| Filtros Facetados Nativos en Colección y Búsqueda (línea 84) | sections/main-collection.liquid:88-89,96-97; sections/main-search.liquid:95-96, nombres accesibles del recuento activo. Estado sigue dependiendo de prueba empírica completa. |
| Presets Diferenciados (1 a 4) (línea 114) | Defaults/copy de Archive e Imprint en listings/archive/templates/index.json:83-85 y listings/imprint/templates/collection.json:10-12; pide aprobación D35. No afirmar cierre por este cambio. |

Los defectos R3 de blog, contraseña, lookbook, marquee, promo/caption y procedencia no tienen una fila individual en este ledger de 77 requisitos; mantenerlos como hallazgos auditables, sin inventar filas ni cambiar el total.

## 4. Copy para aprobación de Johandry (D35)

### Defaults editados en esta rama

| Archivo / ajuste | Antes | Después propuesto |
| --- | --- | --- |
| listings/archive/templates/index.json → lookbook heading | Three objects from the archive record | Collection highlights |
| listings/archive/templates/index.json → descripción | Explore each piece through the points placed across the composition. | Explore the collection. |
| listings/archive/templates/index.json → caption | Garment study room with curated archival selections. | vacío |
| listings/imprint/templates/collection.json → eyebrow | TECHNICAL SPEC / 01 | Collection details |
| listings/imprint/templates/collection.json → texto | Toggle between compact 4-column matrix and detailed 2-column inspection view. | Explore objects designed for everyday use. |
| sections/header-group.json → promo mega menú | Explore the autumn edit | Explore the collection |
| templates/index.json → caption lookbook | Garment study room with curated archival selections. | vacío |
| templates/page.faq.json → CTA sin URL | Contact us | vacío |
| sections/brand-manifesto.liquid → eyebrow | THE HAND AND THE MATERIAL / 03 | The hand and the material |
| sections/brand-manifesto.liquid → media label | MACRO STUDY / MATERIAL 07 | Material detail |
| sections/lookbook.liquid → descripción/caption | descripción con instrucción sobre puntos; caption A study in proportion, texture and daily movement. | Explore the collection. / caption vacío |
| sections/complete-the-look.liquid → caption | Soft architecture study photographed in natural atelier light. | vacío |
| sections/main-blog.liquid → eyebrow | Atelier notes / Journal | Journal |
| sections/main-collection.liquid → promoción eyebrow | Atelier note / 01 | Promotion |
| sections/main-list-collections.liquid → eyebrow | Collections / Current edition | Collections |
| sections/main-password.liquid → eyebrow / heading | Private collection / New edition / The next study opens quietly. | Coming soon / Our store is getting ready. |
| templates/index.json → lookbook description (D6) | Move through the composition and discover each piece. | Explore the collection. |
| listings/imprint/templates/collection.json → promo heading (D6) | Engineered for high telemetry | Objects for everyday use |
| sections/complete-the-look.liquid → description (D6) | Build the full composition or remove individual pieces before adding it to your bag. | Build the full composition or remove individual pieces before adding them to your cart. |
| templates/page.faq.json → CTA block (D6) | unresolved_cta with no URL | block removed from template and block_order |
| sections/main-faq.liquid → button_label default (D6) | Contact us | vacío |
| sections/bento-discovery.liquid (cambio de Claude 9843c0e) → eyebrow de sección | DISCOVER BY FORM / 04 | Discover by form |
| sections/bento-discovery.liquid (cambio de Claude 9843c0e) → eyebrow card_featured | [01] FEATURED COLLECTION | Featured collection |
| sections/bento-discovery.liquid (cambio de Claude 9843c0e) → eyebrow card_editorial | [02] MATERIAL STUDY | Material study |
| sections/bento-discovery.liquid → heading/link card_featured | Sculptural layers / /collections/all | ambos sin default |

### Propuesta para strings existentes en locales/ (Claude aplica; no editados)

| Clave/ruta | en.default.json antes → propuesta | es.json antes → propuesta |
| --- | --- | --- |
| not_found.eyebrow | Error / Archive index → Page not found | Error / Índice del archivo → Página no encontrada |
| not_found.title | Object not found. → Page not found | Página no encontrada. → conservar |
| not_found.message | The requested page is not in our current series. It may have moved into the archive. → The page you requested could not be found. | La página que buscas no forma parte de la serie actual. Es posible que haya pasado al archivo. → No se ha encontrado la página que buscas. |
| sections.complete_the_look.add_selected.one / .other | Add {{ count }} piece to bag | {{ total }} / Add {{ count }} pieces to bag | {{ total }} → Add {{ count }} item to cart | {{ total }} / Add {{ count }} items to cart | {{ total }} | Añadir {{ count }} pieza | {{ total }} / Añadir {{ count }} piezas | {{ total }} → Añadir {{ count }} artículo al carrito | {{ total }} / Añadir {{ count }} artículos al carrito | {{ total }} |
| sections.complete_the_look.total_label | Capsule total → Total | Total de la cápsula → Total |
| search.results.article | Journal → Article | Diario → Artículo |
| newsletter.heading | Notes from the studio → Store updates | Notas del estudio → Novedades de la tienda |
| sections.newsletter.liquid:83 eyebrow default (propuesta D35, no editado) | Private correspondence → Newsletter | Correspondencia privada → Boletín |
| sections.newsletter.liquid:89 heading default (propuesta D35, no editado) | Notes from the atelier → Store updates | Notas del atelier → Novedades de la tienda |

La tabla indica propuestas de copy para D35, no cambios aplicados. Conservar la estructura y las variables plurales (count, total) de las traducciones.

### Info del schema que Claude debe reescribir

En locales/en.default.schema.json, sections.hero_editorial.settings.image_alt.info (localizador identificado en la revisión del schema; confirmar línea actual antes de editar): reemplazar **“Leave empty to use the heading”** por **“Describe the image for screen reader users. Leave blank to use the image’s alt text.”** La imagen no usa el heading como alt. No edité locales/schema por estar fuera de alcance.

Propuesta para locales/en.default.schema.json:23, settings_schema...motion_style / G-I18N-04: "Atelier" → **“Classic”**, que nombra el preset de movimiento en inglés neutral. Pendiente de aplicar por Claude.

## 5. Peticiones a Claude

1. Aplicar las propuestas de locales y del texto info del hero expuestas en 4, tras comprobar claves y localizadores actuales. Cambiar “Atelier” por “Classic” para G-I18N-04. No crear claves nuevas si se pueden reutilizar las existentes.
2. Integrar los defaults de sections/bento-discovery.liquid indicados en D35 y mantener intactos los tipos/block_order de listings/imprint/templates/index.json.
3. Actualizar las cuatro filas candidatas del ledger de 3 con evidencia de esta rama y mantener sus estados; agregar evidencia adicional solo si Claude la verifica. No atribuir a pruebas estáticas el cierre de los requisitos empíricos.
4. No hay petición de añadir info al bloque promo de main-collection: la revisión confirma que ese ajuste no tiene un info en el schema. Retiro la petición anterior sobre ese control.
5. Añadir a D35 las propuestas de defaults neutrales de sections/newsletter.liquid indicadas en §4; el archivo sigue siendo de Claude y no lo edité.

## 6. Verificación, límites y no hecho

Comandos ejecutados en esta rama:

```text
npm run gates:static
```

Resultado de las ocho etapas tras el commit de corrección 03cddcb: código de salida 0. Extractos finales literales:

```text
Archivos .json comprobados: 855
Fallos de parseo:           0
Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
Sin resolver en storefront:     0
Sin resolver en schema:         0
Incoherencias: 0
│  105 files inspected with no offenses found.                                 │
internal references: none
rev:      HEAD -> 03cddcbc0279d72e8eec0eb5bb465072217e01e2
archivos: 105
sha256:   3939969b92d57cc4f0d0d8f7bd71719ead1d1b5d3b45ee0efccb7e8853692350
contenido: a162be5395db195a0f10a470f30821fce2813254b31b30ac2cf4ed9e6901f5bf
```

El subcomando de locales enumeró 6 claves huérfanas, las de fallback alt que el encargo pide dejar de usar más sections.slideshow.region_label y sections.homepage.marquee.region_label; el comando terminó OK. El gate package ahora refleja el commit 03cddcb (105 archivos); el manifiesto versionado no cambió. dist/ está ignorado. No se cambió manualmente ni se añadió al commit la ZIP/manifiesto.

```text
npx playwright test --list
```

Salida final literal: Total: 4 tests in 2 files. Solo enumera pruebas; no las ejecuta.

También: git diff --check → salida vacía, código 0. Esto comprueba whitespace, no comportamiento.

No se ejecutaron pruebas Playwright, despliegue ni Gate 5 en tema-qkqpke0j.myshopify.com; no se comprobó axe, lector de pantalla, móvil físico, layout con contenido extremo ni inventario de tienda. La lista de cinco estados degenerados de 2 es razonamiento estático, no evidencia de runtime. Ningún requisito que dependa de prueba empírica se declara cumplido.

**No hecho / fuera de alcance:** locales y schemas de traducción, ledger, JS/CSS, bento de Claude, ZIP/manifiesto y pruebas en storefront. No encontré motivo para discrepar del encargo; quedan pendientes la aprobación D35 y las verificaciones reales indicadas.

## 7. Commit y PR

Rama: gpt/r3-copy-plantillas, creada desde master en 2e944543cc0e4d857a242070bf293ffe653628a6. Commit original: cf7213e59b3b6cd3374fdd49e2adc548366f5fb7. Correcciones de revisión: 03cddcbc0279d72e8eec0eb5bb465072217e01e2. PR #24 está abierto en borrador contra master y se actualiza con los pushes a esta rama.

## 8. Afirmaciones falsables

1. A1: el diff de la rama contiene únicamente los 21 archivos listados en 2 y este informe, todos permitidos por 3.1.
2. A2: no se editó ningún archivo de assets/, config/, locales/, docs/, tests/ ni scripts/.
3. A3: npm run gates:static terminó con código 0 y mostró 0 errores JSON, 0 contratos rotos, 0 referencias sin resolver, 0 inconsistencias del ledger y 0 ofensas Theme Check.
4. A4: npx playwright test --list enumeró 4 pruebas en 2 archivos; no ejecutó pruebas.
5. A5: las excepciones permitidas de atributos en marquee.liquid y el contador visible/aria del lookbook conservaron los contratos data-*, aria-controls e IDs requeridos.
6. A6: no se modificó docs/requirements-ledger.md, ningún locale, el manifiesto versionado ni se incluyó dist/theme.zip en el diff.
7. A7: los escenarios de paginación/blog enumerados en §9 se razonaron con el código Liquid; no se renderizaron en storefront real.
8. A8: las filas de copy de 4 son propuestas para aprobación; los defaults ya están implementados bajo DP-010/DP-011 y esperan decisión D35.

## 9. Adenda B: correcciones de revisión

Este apartado complementa y, para D1–D6, reemplaza las notas de cambios de §2. Solo se tocaron archivos que ya estaban en la lista cerrada 3.1.

| ID | Cambio aplicado (líneas actuales) |
| --- | --- |
| D1 | sections/main-blog.liquid:118-128,133,136: la rejilla y el conteo de página recorren blog.articles dentro de paginate; paginate.items se usa como total del rótulo, restando el destacado solo cuando show_featured_article está activo y featured_article.blog.id == blog.id. |
| D2 | sections/main-blog.liquid:188-189: el aviso vacío usa elsif paginate.current_page > 1 or show_featured_article == false, así el blog de un solo artículo destacado no muestra un mensaje falso. |
| D3 | sections/main-blog.liquid:22-25,100-110: show_featured_author se calcula explícitamente; la fecha aparece también cuando show_author es falso y show_date es verdadero. |
| D4 | sections/complete-the-look.liquid:324-330: selected_count selecciona .one/.other según rendered_item_count; add_selected se mantiene con su clave plural raíz. |
| D5 | sections/lookbook.liquid:94: los marcadores vacíos del editor muestran un punto en vez de forloop.index; la tienda conserva la numeración de hotspots reales. |
| D6 | templates/page.faq.json:42-50, sections/main-faq.liquid:250: se eliminó el bloque CTA sin URL, su entrada de block_order y el default Contact us. templates/index.json:191 cambia la descripción ligada a hotspots vacíos por Explore the collection. listings/imprint/templates/collection.json:11 cambia Engineered for high telemetry por Objects for everyday use. sections/complete-the-look.liquid:408 cambia your bag por your cart. |

### Recorrido de estados del blog (razonamiento estático)

El recuento de artículos en lista es solo de la página actual, después de excluir un destacado que aparezca en esa página. El número del rótulo es el total filtrado entre todas las páginas menos el destacado mostrado. N es el total después de etiqueta; P es articles_per_page.

| Escenario | Destacado | Rótulo y número | Lista en esta página | Aviso vacío | Paginación |
| --- | --- | --- | --- | --- | --- |
| 0 artículos, sin etiqueta, página 1 | No | No | No | Sí | No |
| 1 artículo, sin etiqueta, página 1; es el destacado automático | Sí | No; quedan 0 | No | No | No |
| 2 artículos, sin etiqueta, página 1 y ambos caben en P | Sí | Sí; 1 restante | 1 | No | No |
| N > P, sin etiqueta, página 1 | Sí | Sí; N−1 | Artículos de blog.articles salvo el destacado si está en esta página | No | Sí |
| N > P, sin etiqueta, página 2 | No se repite el módulo destacado | Sí; N−1 | blog.articles de página 2 | No si hay artículos en página | Sí, con anterior |
| Tag activo; destacado manual lleva la etiqueta, página 1 | Sí | Total etiquetado menos 1 | Artículos etiquetados de página actual salvo el destacado | No; si hay uno total, se muestra como destacado | Según páginas filtradas |
| Tag activo; destacado manual no lleva la etiqueta, página 1 | No | Total etiquetado | Todos los artículos etiquetados de la página actual | Sí solo si el filtro no devuelve artículos | Según páginas filtradas |
| Tag activo, página 2 | No se muestra el módulo destacado | Total filtrado menos destacado si fue mostrado en página 1 | blog.articles de la página etiquetada | No si la página tiene artículos | Sí, con anterior |
| 2 artículos con P=1, página 1 | Sí | Sí; 1 restante | 0 | No | Sí |
| 2 artículos con P=1, página 2 | No se repite el módulo destacado | Sí; 1 restante | Artículo de página 2 | No | Sí, con anterior |

Estos casos se deducen de las condiciones Liquid/Shopify; no se renderizaron en una tienda. La revisión de Claude reporta 43 pruebas en su fusión de prueba, no una ejecución sobre este nuevo commit.

### Verificación posterior al commit de corrección

Comando ejecutado después de 03cddcb: npm run gates:static — código 0. La salida de package confirma que esta vez se ejecutó sobre el commit de corrección, no sobre master:

```text
Archivos .json comprobados: 855
Fallos de parseo:           0
Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
Sin resolver en storefront:     0
Sin resolver en schema:         0
Incoherencias: 0
│  105 files inspected with no offenses found.                                 │
internal references: none
rev:      HEAD -> 03cddcbc0279d72e8eec0eb5bb465072217e01e2
archivos: 105
sha256:   3939969b92d57cc4f0d0d8f7bd71719ead1d1b5d3b45ee0efccb7e8853692350
contenido: a162be5395db195a0f10a470f30821fce2813254b31b30ac2cf4ed9e6901f5bf
```
