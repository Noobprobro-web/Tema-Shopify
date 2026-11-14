# CLAUDE-TO-GPT-IMAGENES-DEMO-001: Producir y subir las fotos de la demo (tienda nueva)

```text
ID: CLAUDE-TO-GPT-IMAGENES-DEMO-001
De: Claude (Opus 5.5 Extra) · Líder técnico temporal (CLAUDE-HANDOFF-LEAD-001)
Para: GPT-6 Sol Max (generación de imagen y acceso a la tienda nueva)
Autorizado por: Johandry / Ruiz Digital
Fecha: 2026-11-14
Estado: ACTIVO
Escritor único de esta carpeta ahora: Claude
Entrega: agent-comms/outbox-gpt/GPT-IMAGENES-DEMO-001.md (cabecera RULES.md §1.4)
Reglamento: agent-comms/RULES.md (leer entero antes de empezar)
```

## 0. Resumen

Generar y subir **68 fotos de producto**, **8 imágenes de colección** y **48 imágenes para secciones del tema** (tres presets) en `sartorial-theme-kvkzl39t.myshopify.com`. Las imágenes de producto y de colección se asignan en el admin. Las de sección solo se suben a Archivos y se entrega una tabla de asignación; las asigna Claude o Johandry en el editor en las 3 previews ya subidas (UNPUBLISHED).

Fuentes leídas para esta orden: `docs/demo-store/{products.csv,README.md,collections.md,pages.md,blog.md,SETUP-TIENDA-NUEVA.md}`, `docs/demo-import/{D-01-catalogo-y-fotos.md,sartorial-photos.csv,imprint-photos.csv,archive-photos.csv}`, `listings/{sartorial,imprint,archive}/templates/*.json`, `sections/{hero-editorial,bento-discovery,lookbook,curated-showcase,brand-manifesto,main-product,main-collection,complete-the-look}.liquid` y `assets/base.css`.

## 1. Alcance exacto

**Dentro:**
- Solo la tienda `sartorial-theme-kvkzl39t.myshopify.com`.
- Solo los 20 productos de la tabla 1.2, identificados por handle (nunca por título).
- Las 8 colecciones de la tabla 3.2.
- Archivos (Contenido > Archivos) para las imágenes de sección (tabla 4).

**Fuera (no tocar, no subir nada):**
- `gift-card` y cualquier producto archivado.
- Los tres borradores de prueba: `test-1-variant`, `test-250-variants`, `test-252-variants`. Siguen sin imagen.
- `leather-belt`: **sin imagen a propósito** (fixture "producto sin imagen").
- Las colecciones de estados límite `empty-test`, `single-product-test` y `test-fixtures`: sin imagen.
- Los 24 productos de Imprint y Archive existen (9 ACTIVE y 15 DRAFT; `docs/demo-store/created-products-imprint-archive.json`) y no tienen imágenes, pero no están en el alcance de esta orden salvo que se indique: sus fotos de producto irán en una orden aparte. Sus imágenes de sección sí se suben (tablas 4.2 y 4.3), porque son del tema.
- Cualquier imagen o producto ajeno a esta orden: no borrar, no reordenar, no reemplazar.
- Metafields, apps, publicación de temas, descripciones, precios, inventario, menús, páginas: no tocar.
- Las fotos ya existentes en `demo-assets/` (están en el equipo de Johandry, no en el repo): no se usan como entrada obligatoria. Si GPT tiene acceso a las de Archive (GPT-TASK-016/017), puede usarlas como referencia de estilo para el preset Archive.

### 1.1 Verificación previa obligatoria (antes de cualquier escritura)

1. Hacer una **lectura** de la tienda (nombre y dominio `myshopify`) y comprobar que es `sartorial-theme-kvkzl39t.myshopify.com`. Si no coincide, **parar** y avisar. No usar `tema-qkqpke0j` en ningún caso.
2. Leer por handle los 20 productos de 1.2 y confirmar que existen, que `leather-belt` y los tres `[TEST]` tienen 0 medios, y registrar el número de medios previo de cada producto (para no pisar nada).
3. Si falta algún handle, no crearlo: anotarlo en el informe y seguir con el resto.

### 1.2 Tabla de productos (68 imágenes)

Handles, títulos y variantes salen de `docs/demo-store/products.csv`. Encuadre por defecto: ver 2.3.

| # | handle | Título | Colores / variantes | Nº img | Notas de encuadre (orden = orden en Admin; la 1.ª es la destacada) |
|---|---|---|---|---|---|
| 1 | `serra-coat` | Serra Coat | Bone, Camel, Ink × XS-XL | 4 | 1 Camel frontal entero; 2 Bone frontal; 3 Ink frontal; 4 detalle de solapa/costura. Fixture agotado (Camel / M): la foto Camel debe ser la principal |
| 2 | `doppio-trench` | Doppio Trench | Black, Stone × XS-XL | **12** | Ver 1.3. Fixture galería 10+ |
| 3 | `cocoon-cardigan-coat` | Cocoon Cardigan-Coat | Charcoal, Oat × S-L | 3 | 1 Charcoal frontal; 2 Oat frontal; 3 detalle de tejido |
| 4 | `nove-blazer` | Nove Blazer | Black, Navy × XS-XL | 3 | 1 Black frontal; 2 Navy frontal; 3 espalda o detalle de solapa. Aparece en lookbook y curated-showcase: mismo estilo que la imagen de sección |
| 5 | `cropped-tailored-jacket` | Cropped Tailored Jacket | Forest, Sand × 5 tallas × Wool blend / Linen blend | 3 | 1 Sand frontal; 2 Forest frontal; 3 detalle de tejido |
| 6 | `pleated-wide-trouser` | Pleated Wide Trouser | Black, Ecru × 24-34 | 3 | 1 Black cuerpo entero (cintura a bajos); 2 Ecru; 3 detalle de pinzas |
| 7 | `cigarette-trouser` | Cigarette Trouser | Black, Grey × 24-34 | 3 | 1 Black entero; 2 Grey; 3 detalle de bajo |
| 8 | `cashmere-rib-crew` | Cashmere Rib Crew | Charcoal, Navy, Oat × XS-XL | 3 | 1 Charcoal; 2 Oat; 3 Navy |
| 9 | `fine-merino-turtleneck` | Fine Merino Turtleneck | Black, Cream × XS-XL | 2 | 1 Black frontal; 2 Cream frontal |
| 10 | `oversized-alpaca-knit` | Oversized Alpaca Knit | Heather, Moss × S-L | 3 | 1 Heather; 2 Moss; 3 detalle de punto |
| 11 | `poplin-column-shirt` | Poplin Column Shirt | Pale blue, White × XS-XL | 3 | 1 White frontal; 2 Pale blue frontal; 3 detalle de cuello y puño |
| 12 | `silk-charmeuse-blouse` | Silk Charmeuse Blouse | Ink, Ivory × XS-XL | 3 | 1 Ivory frontal; 2 Ink; 3 detalle de tela. Es un hotspot del lookbook |
| 13 | `striped-cotton-shirt` | Striped Cotton Shirt | Blue stripe, Grey stripe × XS-XL | 2 | 1 Blue stripe; 2 Grey stripe |
| 14 | `bias-cut-slip-dress` | Bias-Cut Slip Dress | Black, Champagne × XS-L | 3 | 1 Champagne; 2 Black; 3 espalda |
| 15 | `wrap-wool-skirt` | Wrap Wool Skirt | Black, Camel × 1-2 | 3 | 1 Camel; 2 Black; 3 detalle del cruce |
| 16 | `pleated-midi-skirt` | Pleated Midi Skirt | Navy, Olive × XS-XL | 3 | 1 Navy; 2 Olive; 3 detalle de plisado en movimiento (sin persona identificable) |
| 17 | `cashmere-scarf` | Cashmere Scarf | Default Title (1 variante) | 3 | 1 plegada sobre superficie neutra; 2 anudada en maniquí; 3 detalle de flecos. Producto de la colección de 1 producto |
| 18 | `silk-twill-square` | Silk Twill Square | Navy, Rust, Sage | 2 | 1 Navy desplegada; 2 doblada con Rust y Sage visibles. **Tiene imagen pero no descripción (fixture): no escribir descripción**. Sin texto ni estampado figurativo reconocible: motivo geométrico abstracto |
| 19 | `structured-tote` | Structured Tote | Black, Tan | 4 | 1 Black frontal; 2 Tan frontal; 3 interior abierto (escala); 4 detalle de costura y asa |
| 20 | `long-title-fixture-wrap-coat` | Long Title Fixture Double-Faced Wool and Cashmere Wrap Coat... (120 caracteres) | Black, Navy × S-L | 3 | 1 Navy frontal; 2 Black; 3 detalle de cuello. No incluir el título en la imagen |
| | **Total** | | | **68** | |

No tienen imagen: `leather-belt`, `test-1-variant`, `test-250-variants`, `test-252-variants`.

### 1.3 Plano de las 12 imágenes de `doppio-trench`

| Orden | Archivo | Plano |
|---|---|---|
| 1 | `doppio-trench-1.jpg` | Black, frontal entero, abrochado |
| 2 | `doppio-trench-2.jpg` | Black, tres cuartos, cinturón anudado |
| 3 | `doppio-trench-3.jpg` | Black, espalda |
| 4 | `doppio-trench-4.jpg` | Black, detalle de cuello y solapa |
| 5 | `doppio-trench-5.jpg` | Black, detalle de botonadura doble |
| 6 | `doppio-trench-6.jpg` | Black, puño y manga |
| 7 | `doppio-trench-7.jpg` | Stone, frontal entero, abierto |
| 8 | `doppio-trench-8.jpg` | Stone, tres cuartos, cinturón anudado |
| 9 | `doppio-trench-9.jpg` | Stone, espalda |
| 10 | `doppio-trench-10.jpg` | Stone, detalle de tejido |
| 11 | `doppio-trench-11.jpg` | Prenda doblada sobre superficie neutra |
| 12 | `doppio-trench-12.jpg` | Interior y forro abierto |

Debe quedar **exactamente 12** (no 11 ni 13). El valor "muchos" (10+) es el objetivo de la compuerta 2.

## 2. Especificaciones técnicas

### 2.1 Formato y tamaños

Cálculos a partir de `assets/base.css` (aspect-ratio reales del tema) y de `docs/demo-import/*-photos.csv` (anchos mínimos).

| Uso | Relación | Tamaño mínimo (px) | Evidencia en el tema |
|---|---|---|---|
| Producto (galería y tarjetas) | **4:5 vertical** | 1638 × 2048 (lado largo 2048) | Tarjetas `aspect-ratio: 4 / 5` (`assets/base.css:1860, 2994, 4768`); galería usa `--gallery-ratio` de la 1.ª imagen, con 0.8 como valor por defecto y límites 0.667-1.5 (`sections/main-product.liquid:52`). Todas las imágenes de un producto deben ser 4:5 para que la galería no salte |
| Imagen de colección (banner) | **21:9 panorámico** (el tema recorta a 21:8) | 2400 × 1030 | `assets/base.css:5827` (`aspect-ratio: 21 / 8`, `object-fit: cover`). Con 16:9 el tema recortaría arriba y abajo. Componer con el sujeto en la franja central (60 % del alto) |
| Héroe de portada, escritorio | **3:2 horizontal** | 2400 × 1600 | `sections/hero-editorial.liquid` (hero 65/35, alto 85 vh, `object-fit: cover`). Dejar el sujeto en el tercio visual; sin elementos clave en los bordes |
| Héroe, móvil | 4:5 vertical | 1200 × 1500 | `hero_editorial.image_mobile` |
| Lookbook, escritorio | **16:9** | 2400 × 1350 | `assets/base.css:4105 y 6422` (16 / 9). Las 4 prendas (hotspots) deben ser visibles y separadas |
| Lookbook, móvil | 4:5 vertical | 1200 × 1500 | Los hotspots deben seguir sobre cada prenda tras el recorte |
| Complete the look | 4:5 vertical | 1600 × 2000 (escritorio) y 1200 × 1500 (móvil) | `sections/complete-the-look.liquid` |
| Curated showcase (editorial) | 4:5 vertical | 1600 × 2000 | `sections/curated-showcase.liquid:97` |
| Brand manifesto | 4:5 vertical | 1200 × 1500 | `sections/brand-manifesto.liquid:50` |
| Bento discovery (solo Imprint) | featured 3:2; editorial 4:5 | 1600 × 1067; 1200 × 1500 | `sections/bento-discovery.liquid:38,58,107` |
| Promoción de menú desktop / tile de colección | 4:5 vertical | 800 × 1000 (tile 960 × 1200) | `sections/header.liquid` (`mega_menu_promo` `image_1`/`image_2`), tile en `main-collection` |
| About: héroe | 21:9 | 2400 × 1030 | `assets/base.css:8075` (`--about-story-ratio: 21 / 9`) |
| About: galería | 4:5 vertical | 1200 × 1500 | `assets/base.css:8166` |

- Formato: **JPG** (calidad ≥ 85, sRGB). WebP solo si el flujo lo da nativo; en ese caso nombrar `.webp` y avisarlo. Sin GIF animado, sin PNG con transparencia.
- Peso: ≤ 20 MB por archivo (límite de Shopify), idealmente < 3 MB.
- Si la generación no da el tamaño mínimo, escalar (upscale) sin añadir detalle inventado o regenerar. Registrar el tamaño real subido.

### 2.2 Contenido prohibido

Sin texto legible, números, logotipos, etiquetas con marca, monogramas, marcas reales, personas identificables (rostros reconocibles). Alternativas permitidas: maniquí de sastre sin marcas, cuerpo recortado (cuello hacia abajo), solo prenda sobre percha o superficie, plano cenital. Tampoco: sellos de calidad, procedencia geográfica, "hecho a mano" ni cualquier afirmación visual que contradiga C-08 (las descripciones ya no declaran origen ni oficio). Sin marcas de agua. Sin manos con defectos anatómicos: si salen, regenerar.

### 2.3 Dirección de arte por preset

Coherencia: misma luz, mismo fondo y misma paleta dentro de un preset. Entre productos de Sartorial, mismo "estudio".

| Preset | Fondo y luz | Paleta | Objetos / temas | Referencias en repo |
|---|---|---|---|---|
| **Sartorial** | Estudio neutro de sastrería: fondo crema grisáceo, tono hueso o piedra claro; luz suave lateral de ventana, sombras largas y suaves; maniquí de lino crudo sin marcas o prenda sobre percha de madera clara | Hueso, piedra, negro, azul marino, camel, bosque | Prendas de la tabla 1.2; tejidos y costuras; sin escenas de calle | `docs/demo-import/sartorial-photos.csv`, `listings/sartorial/templates/index.json` |
| **Imprint** | Mesa de trabajo: superficie de madera clara o piedra cálida, luz de ventana lateral, profundidad de campo corta; ambiente de escritorio | Cuero coñac, crema, latón mate, verde oliva, negro | Piel (carteras, portafolios), objetos de escritorio (alfombrilla, pisapapeles, bandeja, tarjetero); sin electrónicos con marca (portátiles/móviles, solo siluetas) | `docs/demo-import/imprint-photos.csv`, `listings/imprint/templates/index.json` |
| **Archive** | Galería-museo de indumentaria en penumbra: muros de yeso envejecido en tonos piedra y ocre, paneles verde oliva, suelo de madera oscura; foco cálido cenital; maniquí de lino crudo sobre plinto de nogal | Piedra, ocre, verde oliva, nogal, negro | Piezas vintage restauradas, etiquetas **ilegibles o en blanco**, costuras, plegado de almacén | `docs/demo-import/archive-photos.csv`, GPT-TASK-016 y 017 (dirección ya aprobada) |

### 2.4 Nombres de archivo

- Producto: `<handle>-<n>.jpg`, con `<n>` = posición en la galería (1 = destacada). Ejemplo `serra-coat-1.jpg`.
- Colección: `collection-<handle>.jpg`. Ejemplo `collection-tailoring.jpg`.
- Sección: `<preset>-<slot>.jpg`, con los nombres exactos de la tabla 4 (`sartorial-hero-desktop.jpg`, etc.).
- Minúsculas, sin espacios ni tildes. Si Shopify añade un sufijo al subir, registrar el nombre final.

### 2.5 Texto alternativo (inglés neutro)

Regla: describe lo que se ve, ≤ 125 caracteres, sin "image of", sin repetir el título entero, sin claims (origen, material no verificable, "handmade"). Formato por producto: `<Title>, <color>, <plano>`. Ejemplos: `Serra Coat in camel, front view on a tailor's form`; `Doppio Trench in black, detail of the collar`.

Tabla de alt por producto (todos los textos pueden ajustarse si el resultado visual difiere; el alt debe describir la imagen real):

| handle | Alt por orden |
|---|---|
| `serra-coat` | 1 `Serra Coat in camel, front view on a tailor's form` · 2 `Serra Coat in bone, front view` · 3 `Serra Coat in ink, front view` · 4 `Serra Coat, close view of the lapel and stitching` |
| `doppio-trench` | 1 `Doppio Trench in black, front view, buttoned` · 2 `Doppio Trench in black, three-quarter view with belt tied` · 3 `Doppio Trench in black, back view` · 4 `Doppio Trench in black, collar and lapel detail` · 5 `Doppio Trench in black, double-breasted buttons` · 6 `Doppio Trench in black, sleeve and cuff` · 7 `Doppio Trench in stone, front view, open` · 8 `Doppio Trench in stone, three-quarter view with belt tied` · 9 `Doppio Trench in stone, back view` · 10 `Doppio Trench in stone, close view of the fabric` · 11 `Doppio Trench folded on a neutral surface` · 12 `Doppio Trench, open to show the lining` |
| `cocoon-cardigan-coat` | 1 `Cocoon Cardigan-Coat in charcoal, front view` · 2 `Cocoon Cardigan-Coat in oat, front view` · 3 `Cocoon Cardigan-Coat, close view of the knit` |
| `nove-blazer` | 1 `Nove Blazer in black, front view on a tailor's form` · 2 `Nove Blazer in navy, front view` · 3 `Nove Blazer, back view and lapel detail` |
| `cropped-tailored-jacket` | 1 `Cropped Tailored Jacket in sand, front view` · 2 `Cropped Tailored Jacket in forest, front view` · 3 `Cropped Tailored Jacket, close view of the weave` |
| `pleated-wide-trouser` | 1 `Pleated Wide Trouser in black, full length` · 2 `Pleated Wide Trouser in ecru, full length` · 3 `Pleated Wide Trouser, close view of the front pleats` |
| `cigarette-trouser` | 1 `Cigarette Trouser in black, full length` · 2 `Cigarette Trouser in grey, full length` · 3 `Cigarette Trouser, close view of the hem` |
| `cashmere-rib-crew` | 1 `Cashmere Rib Crew in charcoal, front view` · 2 `Cashmere Rib Crew in oat, front view` · 3 `Cashmere Rib Crew in navy, front view` |
| `fine-merino-turtleneck` | 1 `Fine Merino Turtleneck in black, front view` · 2 `Fine Merino Turtleneck in cream, front view` |
| `oversized-alpaca-knit` | 1 `Oversized Alpaca Knit in heather, front view` · 2 `Oversized Alpaca Knit in moss, front view` · 3 `Oversized Alpaca Knit, close view of the knit` |
| `poplin-column-shirt` | 1 `Poplin Column Shirt in white, front view` · 2 `Poplin Column Shirt in pale blue, front view` · 3 `Poplin Column Shirt, collar and cuff detail` |
| `silk-charmeuse-blouse` | 1 `Silk Charmeuse Blouse in ivory, front view` · 2 `Silk Charmeuse Blouse in ink, front view` · 3 `Silk Charmeuse Blouse, close view of the fabric` |
| `striped-cotton-shirt` | 1 `Striped Cotton Shirt in blue stripe, front view` · 2 `Striped Cotton Shirt in grey stripe, front view` |
| `bias-cut-slip-dress` | 1 `Bias-Cut Slip Dress in champagne, front view` · 2 `Bias-Cut Slip Dress in black, front view` · 3 `Bias-Cut Slip Dress, back view` |
| `wrap-wool-skirt` | 1 `Wrap Wool Skirt in camel, front view` · 2 `Wrap Wool Skirt in black, front view` · 3 `Wrap Wool Skirt, close view of the wrap closure` |
| `pleated-midi-skirt` | 1 `Pleated Midi Skirt in navy, front view` · 2 `Pleated Midi Skirt in olive, front view` · 3 `Pleated Midi Skirt, close view of the pleats` |
| `cashmere-scarf` | 1 `Cashmere Scarf folded on a neutral surface` · 2 `Cashmere Scarf draped on a tailor's form` · 3 `Cashmere Scarf, close view of the fringe` |
| `silk-twill-square` | 1 `Silk Twill Square in navy, laid flat` · 2 `Silk Twill Square folded, with rust and sage versions` |
| `structured-tote` | 1 `Structured Tote in black, front view` · 2 `Structured Tote in tan, front view` · 3 `Structured Tote, open to show the interior` · 4 `Structured Tote, close view of the stitching and handle` |
| `long-title-fixture-wrap-coat` | 1 `Wrap coat in navy, front view` · 2 `Wrap coat in black, front view` · 3 `Wrap coat, close view of the collar` |

Alt de colecciones y secciones: tablas 3.2 y 4.

## 3. Dónde van

### 3.1 Productos (bloque A)

- Vía Admin API `productCreateMedia` o Admin > producto > Media. Subir cada archivo con su `alt`.
- **Orden** exactamente el de la tabla 1.2 (1 = destacada). Tras subir, reordenar con `productReorderMedia` si hace falta y verificar leyendo `media(first: 20)` ordenado.
- Opcional, solo si es sencillo: asociar la imagen de cada color a su variante (`productVariantAppendMedia`). No es criterio de aceptación.
- No sobrescribir medios existentes de otras fuentes. Si un producto ya traía medios, no tocarlo y anotarlo en el informe.
- No crear ni editar variantes, precios, inventario, descripciones, tags ni estado.
- Si falla la generación o la subida de una imagen concreta: dejar constancia (handle, posición, causa), no sustituir por un placeholder, y seguir con el resto.
- **Avisar al terminar este bloque** (mensaje con nº de productos completos y fallos).

### 3.2 Colecciones (bloque B)

Imagen destacada de colección (`collectionUpdate` con `image`, o Admin > colección > Image). Una distinta por colección, 21:9 (2.1). El `collection.image` se usa en `sections/main-collection.liquid:43-52` como banner y en el listado de colecciones; Sartorial y Archive lo muestran, **Imprint no** (`listings/imprint/templates/collection.json:23`), por eso no hay imágenes de colección para Imprint.

| handle | Título | Archivo | Motivo visual | Alt |
|---|---|---|---|---|
| `the-autumn-series` | The Autumn Series | `collection-the-autumn-series.jpg` | Selección otoñal: abrigo, punto y blazer en percha, tonos camel y bosque | `Autumn pieces hanging in a studio: a coat, a knit and a blazer` |
| `new-forms` | New forms | `collection-new-forms.jpg` | Prendas nuevas, siluetas escultóricas (trench, cocoon) | `Sculptural coats and knitwear arranged in a studio` |
| `permanent-collection` | Permanent collection | `collection-permanent-collection.jpg` | Básicos atemporales: camisa, pantalón, jersey doblados | `Folded shirts, trousers and knitwear on a stone surface` |
| `tailoring` | Tailoring | `collection-tailoring.jpg` | Blazer y pantalón en maniquí de sastre, detalles de solapa | `Tailored blazer and trousers on a form, with cloth swatches` |
| `knitwear` | Knitwear | `collection-knitwear.jpg` | Pila de jerseys, texturas de punto | `A stack of knitted sweaters in neutral tones` |
| `outerwear` | Outerwear | `collection-outerwear.jpg` | Abrigos en percha, hilera | `A row of coats on wooden hangers` |
| `accessories` | Accessories | `collection-accessories.jpg` | Bolso, pañuelo de seda, bufanda sobre superficie | `A structured tote, a silk square and a scarf on a neutral surface` |
| `new-arrivals` | New arrivals | `collection-new-arrivals.jpg` | Composición mixta de novedades (trench, punto, vestido) | `New arrivals laid out in a studio: a trench, a knit and a dress` |

- Verificar primero (lectura) que cada colección existe; si falta, no crearla: anotar y seguir.
- No añadir imagen a `empty-test`, `single-product-test` ni `test-fixtures`.
- **Avisar al terminar este bloque.**

### 3.3 Imágenes de sección (bloque C): solo a Archivos

Los JSON del repo prohíben referencias `shopify://shop_images/`, así que **no se asignan en el tema**. Subir cada archivo a **Contenido > Archivos** (`fileCreate`, tipo imagen, con `alt`) y devolver la tabla 4 rellena (archivo, id, URL del CDN, alt). Sin asignar nada en ningún tema. No tocar ningún tema: ni el tema MAIN de la tienda (`test-data`) ni las 3 previews. **Avisar al terminar este bloque.**

## 4. Imágenes de sección: tabla de asignación recomendada

Columnas: archivo, relación y tamaño mínimo (px), sección y setting donde la usará Claude o Johandry, motivo. El alt aquí es el que se debe poner en Archivos; en el editor, el alt se escribe en `image_alt` cuando exista.

### 4.1 Sartorial (17)

| Archivo | Tamaño | Sección > setting | Motivo y alt |
|---|---|---|---|
| `sartorial-hero-desktop.jpg` | 3:2 · 2400×1600 | hero-editorial > `image_desktop` | Look de sastrería sobre maniquí, luz lateral. Alt: `Tailored jacket on a form in a neutral studio` |
| `sartorial-hero-mobile.jpg` | 4:5 · 1200×1500 | hero-editorial > `image_mobile` | Recorte vertical de la misma escena. Mismo alt |
| `sartorial-showcase-new-forms.jpg` | 4:5 · 1600×2000 | curated-showcase > bloque New forms > `editorial_image` | Pieza escultórica. Alt: `A sculptural coat in a studio` |
| `sartorial-showcase-permanent.jpg` | 4:5 · 1600×2000 | curated-showcase > bloque Permanent collection > `editorial_image` | Básico atemporal. Alt: `A pressed shirt and a wool trouser on a stone surface` |
| `sartorial-showcase-tailoring.jpg` | 4:5 · 1600×2000 | curated-showcase > bloque Tailoring salon > `editorial_image` | Blazer o detalle de sastrería. Alt: `A navy blazer on a tailor's form` |
| `sartorial-lookbook-desktop.jpg` | 16:9 · 2400×1350 | lookbook > `image_desktop` | Un look con las 4 prendas separadas y visibles: blazer, pantalón, blusa de seda y bufanda (los 4 hotspots). Alt: `A tailored look with blazer, wide trousers, silk blouse and scarf` |
| `sartorial-lookbook-mobile.jpg` | 4:5 · 1200×1500 | lookbook > `image_mobile` | Mismo look; los hotspots deben seguir sobre cada prenda |
| `sartorial-complete-the-look-desktop.jpg` | 4:5 · 1600×2000 | complete-the-look > `image_desktop` | El conjunto nove-blazer + silk-charmeuse-blouse + pleated-wide-trouser. Alt: `Blazer, silk blouse and wide trousers worn together` |
| `sartorial-complete-the-look-mobile.jpg` | 4:5 · 1200×1500 | complete-the-look > `image_mobile` | Mismo conjunto |
| `sartorial-manifesto.jpg` | 4:5 · 1200×1500 | brand-manifesto > `image` | Detalle de tejido y patrón, sin reclamos. Alt: `Wool cloth and a pattern piece on a worktable` |
| `sartorial-collection-tile.jpg` | 4:5 · 960×1200 | main-collection > promotion tile > `image` | Sastrería (enlaza a /collections/tailoring). Alt: `Tailored jacket on a form` |
| `sartorial-menu-new-forms.jpg` | 4:5 · 800×1000 | header > mega menu promo > `image_1` | New forms. Alt: `Sculptural coat on a form` |
| `sartorial-menu-permanent.jpg` | 4:5 · 800×1000 | header > mega menu promo > `image_2` | Permanent collection. Alt: `Folded knitwear and shirts` |
| `sartorial-about-hero.jpg` | 21:9 · 2400×1030 | main-about > hero_story > `image` | Estudio de sastrería, sin afirmar lugar ni taller. Alt: `A tailoring studio with garments on forms` |
| `sartorial-about-1.jpg` | 4:5 · 1200×1500 | main-about > atelier_gallery > `image_1` | Detalle de prueba de prenda. Alt: `A garment being fitted on a form` |
| `sartorial-about-2.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_2` | Tela y patrón. Alt: `Cloth and a paper pattern` |
| `sartorial-about-3.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_3` | Pieza terminada en maniquí. Alt: `A finished coat on a tailor's form` |

### 4.2 Imprint (17; sin banner de colección)

| Archivo | Tamaño | Sección > setting | Motivo y alt |
|---|---|---|---|
| `imprint-hero-desktop.jpg` | 3:2 · 2400×1600 | hero-editorial > `image_desktop` | Carteras y objetos de escritorio en uso. Alt: `Leather goods and desk objects on a wooden table` |
| `imprint-hero-mobile.jpg` | 4:5 · 1200×1500 | hero-editorial > `image_mobile` | Recorte vertical. Mismo alt |
| `imprint-bento-featured.jpg` | 3:2 · 1600×1067 | bento-discovery > card_featured > `image` | Set de escritorio: alfombrilla, folio y pisapapeles. Alt: `A leather desk mat with a folio and a paperweight` |
| `imprint-bento-editorial.jpg` | 4:5 · 1200×1500 | bento-discovery > card_editorial > `image` | Detalle de piel. Alt: `Close view of stitched leather` |
| `imprint-showcase-daily.jpg` | 4:5 · 1600×2000 | curated-showcase > Daily objects > `editorial_image` | Objetos de uso diario. Alt: `Everyday carry objects on a table` |
| `imprint-showcase-workspace.jpg` | 4:5 · 1600×2000 | curated-showcase > Workspace > `editorial_image` | Escritorio y estudio. Alt: `A tidy desk with stationery and a tray` |
| `imprint-showcase-leather.jpg` | 4:5 · 1600×2000 | curated-showcase > Leather goods > `editorial_image` | Bolsos y piel pequeña. Alt: `A leather bag and small leather goods` |
| `imprint-complete-the-look-desktop.jpg` | 4:5 · 1600×2000 | complete-the-look > `image_desktop` | Folio, tarjetero y bandeja juntos. Alt: `A document folio, a cardholder and a valet tray together` |
| `imprint-complete-the-look-mobile.jpg` | 4:5 · 1200×1500 | complete-the-look > `image_mobile` | Mismo conjunto |
| `imprint-manifesto.jpg` | 4:5 · 1200×1500 | brand-manifesto > `image` | Material en la mesa. Alt: `Leather and brass hardware on a workbench` |
| `imprint-collection-tile.jpg` | 4:5 · 960×1200 | main-collection > tile > `image` | Daily objects. Alt: `Daily carry objects on a table` |
| `imprint-menu-leather.jpg` | 4:5 · 800×1000 | header > mega menu promo > `image_1` | Leather goods. Alt: `A leather bag on a table` |
| `imprint-menu-desk.jpg` | 4:5 · 800×1000 | header > mega menu promo > `image_2` | Desk and study. Alt: `A desk with a leather mat and a paperweight` |
| `imprint-about-hero.jpg` | 21:9 · 2400×1030 | main-about > hero_story > `image` | Piel o escritorio, sin afirmar taller. Alt: `Leather goods arranged on a wooden desk` |
| `imprint-about-1.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_1` | Canto de piel. Alt: `Close view of a leather edge` |
| `imprint-about-2.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_2` | Objetos de escritorio en uso. Alt: `Desk objects in use` |
| `imprint-about-3.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_3` | Pieza terminada a escala. Alt: `A leather piece next to a hand-sized ruler` |

### 4.3 Archive (14)

Dirección de arte: ver 2.3 y GPT-TASK-016/017 (galería-museo en penumbra).

| Archivo | Tamaño | Sección > setting | Motivo y alt |
|---|---|---|---|
| `archive-hero-desktop.jpg` | 3:2 · 2400×1600 | hero-editorial > `image_desktop` | Una pieza de archivo, luz de museo. Alt: `A vintage coat on a form in a dim gallery` |
| `archive-hero-mobile.jpg` | 4:5 · 1200×1500 | hero-editorial > `image_mobile` | Recorte vertical |
| `archive-manifesto.jpg` | 4:5 · 1200×1500 | brand-manifesto > `image` | Etiqueta en blanco, costura o tela. Alt: `Close view of a seam and a blank label` |
| `archive-showcase-permanent.jpg` | 4:5 · 1600×2000 | curated-showcase > permanent-archive > `editorial_image` | Pieza del archivo permanente. Alt: `A vintage jacket on a form` |
| `archive-showcase-restored.jpg` | 4:5 · 1600×2000 | curated-showcase > Selected pieces > `editorial_image` | Pieza restaurada. Alt: `A restored garment on a plinth` |
| `archive-lookbook-desktop.jpg` | 16:9 · 2400×1350 | lookbook > `image_desktop` | Un encuadre con tres piezas separadas y visibles: abrigo, gabardina y combinación de seda (3 hotspots). Alt: `Three vintage garments on forms in a gallery` |
| `archive-lookbook-mobile.jpg` | 4:5 · 1200×1500 | lookbook > `image_mobile` | Mismo encuadre; los hotspots deben seguir sobre cada pieza |
| `archive-collection-tile.jpg` | 4:5 · 960×1200 | main-collection > tile > `image` | Permanent archive. Alt: `Vintage garments on forms` |
| `archive-menu-permanent.jpg` | 4:5 · 800×1000 | header > mega menu promo > `image_1` | Permanent archive. Alt: `A vintage coat on a form` |
| `archive-menu-restored.jpg` | 4:5 · 800×1000 | header > mega menu promo > `image_2` | Restored pieces. Alt: `A restored garment on a plinth` |
| `archive-about-hero.jpg` | 21:9 · 2400×1030 | main-about > hero_story > `image` | Archivo sin lugar, fecha ni procedencia. Alt: `A gallery with garments on forms` |
| `archive-about-1.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_1` | Etiqueta o costura. Alt: `Close view of a seam` |
| `archive-about-2.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_2` | Almacenamiento o manipulación. Alt: `Garments on racks in storage` |
| `archive-about-3.jpg` | 4:5 · 1200×1500 | atelier_gallery > `image_3` | Pieza terminada en maniquí. Alt: `A finished garment on a form` |

Total de archivos de sección: 17 + 17 + 14 = **48**. Total de imágenes de la orden: 68 + 8 + 48 = **124**.

## 5. Reglas de seguridad y limpieza

1. Verificar la tienda con una lectura antes de la primera escritura (1.1) y repetirlo si se reinicia la sesión.
2. Escrituras permitidas, solo estas: subir medios a los 20 productos de 1.2, añadir imagen a las 8 colecciones de 3.2, crear archivos de imagen en Contenido > Archivos.
3. Prohibido: metafields, apps, publicar o editar temas, borrar productos o imágenes, tocar los productos excluidos de la sección 1, cambiar estado de productos.
4. Sin datos personales ni credenciales en archivos, informes, alt, nombres de archivo ni mensajes. Nada de tokens, contraseñas ni `.secrets`.
5. No usar `tema-qkqpke0j`.
6. Si falla una imagen: constancia en el informe (qué, por qué) y seguir. No inventar éxitos ni marcar como hecho lo no verificado.
7. Una lectura final por producto/colección/archivo confirmará lo subido y se pega literal en el informe (RULES §1.3).

## 6. Entrega

Informe en `agent-comms/outbox-gpt/GPT-IMAGENES-DEMO-001.md` con la cabecera de `RULES.md` §1.4:

```text
ID: GPT-IMAGENES-DEMO-001
Estado:
Decisión requerida:
Resumen en 5 líneas:
Archivos tocados:
Desviaciones (Nivel 1 o Nivel 2):
Hallazgos extra fuera de alcance (con parche listo):
Verificación (comando, resultado y qué demuestra/qué no):
Lista de afirmaciones falsables numeradas:
```

Y, en el cuerpo:
1. **Manifiesto de producto:** `handle → [archivo, id de media, alt, orden]`, una fila por imagen (68 filas esperadas), más nº de medios previos y finales por producto.
2. **Colecciones con imagen:** `handle → [archivo, id de imagen, alt]` (8 esperadas).
3. **Archivos de sección:** tabla 4 rellena con id de archivo, URL del CDN y tamaño real en px de cada uno (48 esperados).
4. **Fallos y omisiones:** imágenes no generadas o no subidas, con causa.
5. **Comprobaciones de exclusión:** medios en `leather-belt` y en los tres `[TEST]` (esperado 0).
6. **Estados de ledger:** solo `cumplido`, `código completo`, `no verificado` o `ausente`. **No cerrar filas del ledger**: eso lo hace Claude con evidencia. Esta entrega es datos de demo, no evidencia de tema.

**Plazo:** sin fecha. Avisar al terminar cada bloque (A productos, B colecciones, C secciones) con un mensaje corto antes de empezar el siguiente.

## 7. Criterios de aceptación (verificables)

| # | Criterio | Cómo se verifica |
|---|---|---|
| 1 | La tienda leída es `sartorial-theme-kvkzl39t.myshopify.com` | Salida pegada de la lectura inicial |
| 2 | Cada uno de los 20 productos de 1.2 tiene exactamente el nº de imágenes de la tabla, en el orden pedido | Lectura `media(first: 20)` por handle |
| 3 | `doppio-trench` tiene **12** imágenes | Misma lectura |
| 4 | `leather-belt`, `test-1-variant`, `test-250-variants`, `test-252-variants` y `gift-card` tienen **0** medios nuevos | Lectura por handle |
| 5 | `silk-twill-square` tiene 2 imágenes y su descripción sigue vacía | Lectura de `descriptionHtml` |
| 6 | Todas las imágenes de producto son 4:5 y ≥ 2048 px de lado largo | Dimensiones leídas del medio o del archivo |
| 7 | Cada imagen tiene alt en inglés conforme a 2.5 y ninguna contiene texto, logotipos ni rostros reconocibles | Revisión visual y lectura del alt |
| 8 | Nombres de archivo `<handle>-<n>.jpg` y `<n>` coincide con el orden | Manifiesto |
| 9 | Las 8 colecciones de 3.2 tienen imagen distinta, 21:9 y ≥ 2400 px de ancho; las 3 de prueba no tienen | Lectura `collection.image` |
| 10 | Los 48 archivos de sección están en Archivos con alt y el nombre exacto de la tabla 4 | Lectura de `files` |
| 11 | No hay cambios en temas, metafields, apps, precios, inventario, estado ni en medios preexistentes ajenos | Comparación de la lectura previa con la final |
| 12 | El informe usa la cabecera §1.4, no contiene credenciales ni datos personales y no cierra filas del ledger | Revisión |

### Qué revisará Claude después

1. Abrir el informe y cotejar los 124 elementos del manifiesto con la tienda por lectura (no por el relato del informe, RULES §4.1): imagen cargada (estado `READY`), alt presente, orden correcto, 12 en `doppio-trench`, 0 en `leather-belt` y en los `[TEST]`.
2. Muestreo visual: al menos una imagen por producto y por colección, buscando texto, logotipos, personas identificables, manos defectuosas y desajuste de color con el alt.
3. Con los temas subidos (preset por preset), asignar las 48 imágenes de sección según la tabla 4, comprobar el recorte real (hero, lookbook con hotspots, banner 21:8) y registrar la evidencia en la tienda real (compuerta 5), en escritorio y móvil.
4. Las filas del ledger relacionadas (fotos de demo, estados degenerados "muchos" y "faltante") las cierra Claude solo con esa evidencia.

## 8. Notas

- El tema recorta el banner de colección a 21:8 (`assets/base.css:5827`); por eso se pide 21:9 con el sujeto centrado. Si GPT solo puede generar 16:9, avisarlo y entregar 16:9 con margen vertical amplio; Claude lo valida en tienda.
- `structured-tote` también existe en el CSV de Imprint con otro producto. En esta tienda es el bolso de Sartorial; no mezclar.
- Pendiente: orden aparte para las fotos de producto de Imprint/Archive, empezando por los 9 ACTIVE que referencian las plantillas. Esta orden no las cubre.
