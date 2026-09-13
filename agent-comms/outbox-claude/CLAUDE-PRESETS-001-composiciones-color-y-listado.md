# CLAUDE-PRESETS-001: Composiciones por preset, 15 esquemas de color, feature titular y brief de fotografía

```text
ID: CLAUDE-PRESETS-001
Autor: Claude (auditor UX/UI, consultor editorial y de producto)
Para: Johandry (decisión de la feature titular) y Gemini (encargo de empaquetado para GPT)
Modo: READ-ONLY. Especificación, no código
Fecha: 2026-09-13
Contenido: 1 composiciones /listings, 2 quince esquemas, 3 feature titular y listado,
           4 escenario hostil del Theme Editor
```

---

## 0. Dos restricciones del inventario actual que condicionan las tres composiciones

Antes de las composiciones, lo que hay disponible para componer. El tema tiene once secciones de cuerpo y **le faltan dos que todos los temas premium tienen**:

- **No hay sección de colección destacada.** Un producto o una grilla en el homepage solo puede venir por `Collection tabs` o por la tarjeta de producto de `Mixed content grid`.
- **No hay sección de producto destacado.** Y esa es, además, una de las dos ubicaciones donde el requisito oficial nombra explícitamente el soporte de bloques `@app`.

Las tres composiciones de abajo están diseñadas dentro de esa restricción y funcionan. Pero Gemini debería registrar las dos ausencias como filas del ledger antes del empaquetado, porque la de producto destacado toca un requisito.

Segunda restricción, y es la que decidió el orden de Archive. Pensé en abrir Archive con `Brand statement` antes del hero, porque una casa heritage lidera con quién es y no con una campaña. **No se puede.** `brand-manifesto.liquid:21` emite el statement como `<h2>`, y el hero es el que lleva el `<h1>`. Un `h2` antes del `h1` en el DOM es una violación de orden de encabezados que axe reporta como `heading-order`, y eso pega directo en el mínimo de 90 de Lighthouse. Archive diferencia con el **tratamiento** del hero, no con el orden.

---

# 1. Las tres composiciones editoriales

Nombres de sección según el renombrado ya aplicado en `en.default.schema.json`. Cada composición va en `/listings/<preset>/templates/index.json`.

## 1.1 `/listings/couture` — la casa editorial

**Tesis: la campaña primero, el producto después. Se lee como una revista.**

| # | Sección | `type` | Settings clave |
| --- | --- | --- | --- |
| H1 | Announcement bar | `announcement-bar` | 3 bloques, `auto_rotate: true`, `change_slides_speed: 6`, `color_scheme: scheme-2` |
| H2 | Header | `header` | `color_scheme: scheme-1` |
| 1 | Editorial hero | `hero-editorial` | `layout_mode: cinematic`, `media_type: video`, `height_desktop: 90`, `height_mobile: 75`, `overlay_style: gradient_bottom`, `overlay_opacity: 40`, `content_position_x: start`, `content_position_y: end`, `text_alignment: left`, `content_width: 38`, `heading_tag: h1`, `enable_video_mobile: false`, `color_scheme: scheme-2` |
| 2 | Scrolling text | `marquee` | 4 bloques de procedencia, `speed: 38`, `color_scheme: scheme-2` |
| 3 | **Shoppable lookbook** | `lookbook` | 4 marcadores, `color_scheme: scheme-1` |
| 4 | Collection tabs | `curated-showcase` | 3 tabs con colección asignada, `show_secondary_image: true`, `show_vendor: false`, `color_scheme: scheme-1` |
| 5 | Brand statement | `brand-manifesto` | 4 bloques de detalle, `use_surface_background: true`, `color_scheme: scheme-3` |
| 6 | **Complete the look** | `complete-the-look` | 3 bloques de producto, `color_scheme: scheme-1` |
| 7 | Mixed content grid | `bento-discovery` | 3 tarjetas: colección, historia, producto. `color_scheme: scheme-1` |
| 8 | Email signup | `newsletter` | `color_scheme: scheme-3` |
| F1 | Footer | `footer` | `show_newsletter: false`, `color_scheme: scheme-2` |

**Por qué el lookbook en la posición 3.** Un revisor de la Theme Store recorre dos pantallas antes de formarse un juicio. La feature que diferencia al tema tiene que estar dentro de esas dos pantallas, no en la posición 7.

**Por qué `show_newsletter: false` en el footer.** La sección `Email signup` en posición 8 ya cubre la captura. Tenerla dos veces en la misma página es el error de "más es mejor" que abarata un tema premium.

**Por qué lookbook y Complete the look en la misma página, separados.** Son mecánicas distintas, hotspots que llevan al PDP contra multi-add con selección de variante, pero se parecen visualmente. Posiciones 3 y 6 con cuatro secciones de por medio es la mitigación. Couture es el único preset que muestra las dos.

## 1.2 `/listings/studio` — el estudio de objetos

**Tesis: la grilla es el diseño. Sin narrativa editorial, sin modelos, sin movimiento.**

| # | Sección | `type` | Settings clave |
| --- | --- | --- | --- |
| H1 | Announcement bar | `announcement-bar` | **1 solo bloque**, `auto_rotate: false`, `color_scheme: scheme-1` |
| H2 | Header | `header` | `color_scheme: scheme-1` |
| 1 | Editorial hero | `hero-editorial` | `layout_mode: split`, `split_ratio: 50_50`, `layout_split: image_first`, `heading_tag: h1`, `content_width: 34`, `color_scheme: scheme-1` |
| 2 | Collection tabs | `curated-showcase` | 3 tabs, `show_secondary_image: false`, `show_vendor: false`, `color_scheme: scheme-1` |
| 3 | **Mixed content grid** | `bento-discovery` | 4 tarjetas: colección, producto, producto, historia. `color_scheme: scheme-3` |
| 4 | Complete the look | `complete-the-look` | 3 objetos como set de escritorio, `color_scheme: scheme-1` |
| 5 | Brand statement | `brand-manifesto` | **2 bloques de detalle**, `use_surface_background: false`, `media_label` vacío, `color_scheme: scheme-4` |
| 6 | Email signup | `newsletter` | `color_scheme: scheme-3` |
| F1 | Footer | `footer` | `show_newsletter: false`, `color_scheme: scheme-2` |

**Lo que Studio NO usa: `lookbook` ni `marquee`.** Un estudio de producto no fotografía editoriales de moda con modelos, y un marquee que se desliza es ruido en un lenguaje que se define por la quietud. Omitir dos secciones es diferenciación estructural, no una carencia: es lo que hace que Studio no se lea como Couture con otra fuente.

**Seis secciones de cuerpo contra las ocho de Couture**, con `section_spacing: 56` contra `96`. Studio es medible más corto y más denso, y eso se siente al hacer scroll antes de leer una sola palabra.

**Un solo anuncio sin rotación.** La restricción como declaración de carácter.

**Nota de documentación:** un comerciante que compre Studio no verá el lookbook en su demo y puede no saber que existe. Eso se resuelve en la documentación, no cambiando la composición.

## 1.3 `/listings/archive` — el catálogo de herencia

**Tesis: la procedencia primero. Se lee como un impreso encuadernado con índice.**

| # | Sección | `type` | Settings clave |
| --- | --- | --- | --- |
| H1 | Announcement bar | `announcement-bar` | 2 bloques, `auto_rotate: true`, `change_slides_speed: 8`, `color_scheme: scheme-2` |
| H2 | Header | `header` | `color_scheme: scheme-1` |
| 1 | Editorial hero | `hero-editorial` | `layout_mode: cinematic`, **`media_type: image`**, `height_desktop: 75`, `height_mobile: 75`, **`overlay_style: scrim`**, `overlay_opacity: 55`, **`content_position_x: center`, `content_position_y: center`**, `text_alignment: center`, `content_width: 30`, `heading_tag: h1`, `color_scheme: scheme-2` |
| 2 | Brand statement | `brand-manifesto` | 4 bloques, `use_surface_background: true`, `media_label` con numeral de índice, `color_scheme: scheme-3` |
| 3 | Scrolling text | `marquee` | 3 bloques con año de fundación y procedencia, `speed: 46`, `color_scheme: scheme-4` |
| 4 | Collection tabs | `curated-showcase` | **2 tabs**, `show_secondary_image: false`, **`show_vendor: true`**, `color_scheme: scheme-1` |
| 5 | **Shoppable lookbook** | `lookbook` | **3 marcadores**, `color_scheme: scheme-5` |
| 6 | Mixed content grid | `bento-discovery` | 3 tarjetas con **dos de historia** y una de colección. `color_scheme: scheme-1` |
| 7 | Email signup | `newsletter` | `color_scheme: scheme-3` |
| F1 | Footer | `footer` | **`show_newsletter: true`**, `color_scheme: scheme-2` |

**Lo que Archive NO usa: `complete-the-look`.** Una casa heritage vende piezas individuales con historia, no cápsulas curadas. Y sí usa `lookbook`, porque el lookbook de archivo es exactamente el formato de esa categoría.

**Brand statement en posición 2**, inmediatamente después del hero y no enterrado en la 5. Es el cambio de jerarquía que hace que Archive se lea como una casa que cuenta de dónde viene antes de vender.

**El hero con velo uniforme al 55% y texto centrado**, contra el degradado inferior con texto abajo a la izquierda de Couture. Misma sección, dos lenguajes distintos.

**`show_vendor: true` y `show_newsletter: true` en el footer.** Archive es el único preset con fabricante visible en las tarjetas y con captura de correo en el footer, porque el catálogo de herencia lista al fabricante y el pie de un catálogo lleva la suscripción.

## 1.4 Tabla comparativa, para que la diferenciación sea verificable

| | Couture | Studio | Archive |
| --- | --- | --- | --- |
| Secciones de cuerpo | 8 | 6 | 7 |
| Modo de hero | Cinematográfico con video | Split 50/50 | Cinematográfico con imagen fija |
| Overlay del hero | Degradado inferior 40% | No aplica | Velo uniforme 55% |
| Posición del texto del hero | Abajo izquierda | Columna izquierda | Centro centro |
| Usa `lookbook` | Sí, posición 3 | **No** | Sí, posición 5 |
| Usa `complete-the-look` | Sí | Sí | **No** |
| Usa `marquee` | Sí | **No** | Sí |
| Anuncios | 3 rotando a 6s | 1 fijo | 2 rotando a 8s |
| Vendor en tarjetas | No | No | **Sí** |
| Newsletter en footer | No | No | **Sí** |
| Tabs de colección | 3 | 3 | **2** |
| Espaciado de sección | 96 | 56 | 72 |

Ninguna de las tres comparte modo de hero, ni conjunto de secciones, ni número de secciones. Un revisor que instale los tres presets ve tres tiendas.

## 1.5 Qué plantillas van en cada `/listings`

El requisito pide "a unique set of templates showcasing each preset". Mi recomendación de alcance, de mayor a menor retorno:

- **`index.json` en los tres.** Obligatorio, es donde vive toda la diferenciación de arriba.
- **`collection.json` en los tres.** Studio con `default_grid_columns: 4` y sin tile de promoción; Couture con 2 columnas y un tile en posición 4; Archive con 2 columnas, tile en posición 3 y `show_vendor: true`. Tres páginas de colección visiblemente distintas por muy poco trabajo.
- **`product.json` en los tres.** Studio con `media_layout: grid`; Couture con `grid` y el bloque `size_guide` activado; Archive con `thumbnails` y sin `size_guide`. Y **los tres deben incluir el bloque `size_guide` y un bloque `@app`** en el `block_order`, porque hoy el `product.json` base no los trae y eso deja la feature apagada de fábrica.
- El resto de plantillas puede compartirse. No aportan diferenciación y triplicar archivos sin razón es superficie de mantenimiento.

**Punto a verificar antes de empaquetar:** la estructura exacta de carpetas y qué archivos acepta `/listings/<preset>/` la confirma la documentación de empaquetado, no la de requisitos. Gemini ya confirmó que el requisito existe; el contrato a nivel de archivo hay que leerlo en la guía de packaging antes de que GPT genere los JSON, porque un `listings` mal armado se descubre en el zip.

---

# 2. Los quince esquemas de color

Cinco por preset. Los roles son los mismos en los tres, lo que cambia es la paleta.

| Rol | Uso |
| --- | --- |
| `scheme-1` | Página por defecto. Fondo claro |
| `scheme-2` | Inverso. Footer, marquee, hero cinematográfico |
| `scheme-3` | Superficie tonal. Brand statement, email signup |
| `scheme-4` | Acento. Tile de promoción, marquee de Archive, brand statement de Studio |
| `scheme-5` | Suave. Estados vacíos, lookbook de Archive |

## 2.1 Método de verificación

Los contrastes se calcularon con la fórmula de luminancia relativa de WCAG 2.x, con linealización sRGB, mediante script. Cuatro comprobaciones por esquema:

- `text` sobre `background` debe dar **4.5:1** o más, regla 1.4.3
- `button_label` sobre `button` debe dar **4.5:1** o más, regla 1.4.3
- `secondary_button_label` sobre `background` debe dar **4.5:1** o más
- `border` sobre `background` debe dar **3:1** o más, regla 1.4.11, que es el fallo que la auditoría encontró en el valor actual de 1.25:1

Los sesenta pares pasan. Un solo valor necesitó ajuste: el borde de `Couture / scheme-4` daba 2.74:1 con `#7C5F2B` y quedó en `#6E5325`, que da 3.31:1. Se eligió el valor que apenas cruza el umbral en lugar de uno más oscuro, para que siga leyéndose como hairline y no como regla pesada.

Recordatorio de la arquitectura que hace esto posible sin sacrificar estética: el tema tiene **dos** variables de borde, `--color-border` para controles interactivos y `--color-border-hairline` derivada para separadores decorativos. Solo la primera necesita 3:1. Los hairlines editoriales se mantienen finos.

## 2.2 Couture

Crema cálido, tinta y latón.

| Esquema | background | text | button | button_label | secondary | border | shadow |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Página | `#F7F3EA` | `#1D1B18` | `#1D1B18` | `#FFFFFF` | `#1D1B18` | `#8F8574` | `#1D1B18` |
| 2 Inverso | `#1D1B18` | `#F8F4EB` | `#D8A85D` | `#1D1B18` | `#F8F4EB` | `#7A7061` | `#000000` |
| 3 Superficie | `#EDE7DA` | `#1D1B18` | `#1D1B18` | `#FFFFFF` | `#1D1B18` | `#8A8070` | `#1D1B18` |
| 4 Acento latón | `#D8A85D` | `#1D1B18` | `#1D1B18` | `#F7F3EA` | `#1D1B18` | `#6E5325` | `#1D1B18` |
| 5 Suave | `#FBF9F4` | `#2A2621` | `#1D1B18` | `#FFFFFF` | `#2A2621` | `#9A8F7C` | `#1D1B18` |

Contrastes: texto 15.52, 15.65, 13.95, 7.92, 14.28. Etiqueta de botón 17.18, 7.92, 17.18, 15.52, 17.18. Bordes 3.28, 3.53, 3.15, 3.31, 3.03.

`background_gradient` vacío en los cinco.

## 2.3 Studio

Blanco puro, casi negro y un solo acento frío. Cero calidez.

| Esquema | background | text | button | button_label | secondary | border | shadow |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Página | `#FFFFFF` | `#111111` | `#111111` | `#FFFFFF` | `#111111` | `#949494` | `#111111` |
| 2 Inverso | `#111111` | `#FAFAFA` | `#FAFAFA` | `#111111` | `#FAFAFA` | `#666666` | `#000000` |
| 3 Superficie | `#F2F2F2` | `#111111` | `#111111` | `#FFFFFF` | `#111111` | `#8C8C8C` | `#111111` |
| 4 Acento pizarra | `#2E3440` | `#F0F2F5` | `#F0F2F5` | `#2E3440` | `#F0F2F5` | `#79808C` | `#000000` |
| 5 Suave | `#FAFAFA` | `#1A1A1A` | `#111111` | `#FFFFFF` | `#1A1A1A` | `#919191` | `#111111` |

Contrastes: texto 18.88, 18.09, 16.87, 11.14, 16.67. Etiqueta de botón 18.88, 18.09, 18.88, 11.14, 18.88. Bordes 3.03, 3.29, 3.00, 3.14, 3.02.

El `scheme-2` es la inversión literal del `scheme-1`, que es la gramática correcta de este preset: no es un modo oscuro, es un negativo. Y el único color con matiz en toda la paleta es el `#2E3440` del acento.

## 2.4 Archive

Arcilla, marrón profundo, óxido y oliva.

| Esquema | background | text | button | button_label | secondary | border | shadow |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 Página | `#EFE6D9` | `#2E241C` | `#8A5A3B` | `#FFF8F0` | `#2E241C` | `#8A7860` | `#2E241C` |
| 2 Inverso oliva | `#2F3327` | `#EFE6D9` | `#B5885C` | `#241F19` | `#EFE6D9` | `#838972` | `#1A1D16` |
| 3 Superficie | `#E4D8C6` | `#2E241C` | `#8A5A3B` | `#FFF8F0` | `#2E241C` | `#7E6A54` | `#2E241C` |
| 4 Acento óxido | `#8A5A3B` | `#FFF8F0` | `#FFF8F0` | `#8A5A3B` | `#FFF8F0` | `#D8BFA6` | `#2E241C` |
| 5 Suave | `#F5EFE5` | `#2E241C` | `#8A5A3B` | `#FFF8F0` | `#2E241C` | `#8D7C64` | `#2E241C` |

Contrastes: texto 12.27, 10.46, 10.78, 5.53, 13.25. Etiqueta de botón 5.53, 5.17, 5.53, 5.53, 5.53. Bordes 3.44, 3.56, 3.66, 3.31, 3.53.

**El inverso es oliva oscuro y no casi negro.** Ese es el detalle que separa heritage de minimalismo: si el `scheme-2` de Archive fuera `#111111`, Archive sería Couture con otra fuente.

---

# 3. La feature titular, el listado y el brief de fotografía

## 3.1 El problema que hay que resolver antes de escribir el listado

A este precio un tema se vende por **una** cosa. Prestige vende pulido editorial, Impact vende conversión, Broadcast vende video. Un listado con cuarenta features no tiene titular, tiene inventario, y el comerciante que decide en ocho segundos no lee inventarios.

El tema tiene tres candidatas reales. Las tres están construidas y funcionan.

## 3.2 Candidata A: el lookbook comprable

**La promesa:** convierte la fotografía de campaña en superficie de venta. El cliente toca un punto sobre la imagen y llega al producto.

**A favor:** es la que mejor fotografía y la que mejor se ve en una captura de pantalla. Encaja perfecto con el nicho declarado.

**En contra, y pesa:** es la que impone más carga al comerciante. Exige fotografía editorial con productos colocados en escena, que una casa pequeña no siempre tiene. Y el tema hoy tiene una debilidad real ahí: el lookbook ofrece imagen de escritorio e imagen móvil pero **un solo juego de coordenadas de hotspot**, así que si los dos encuadres difieren los marcadores del móvil caen en el aire. Vender el tema por su feature más frágil es cómo se generan reembolsos y reseñas de dos estrellas.

**Competitivamente:** es una categoría conocida. No es tierra virgen.

## 3.3 Candidata B: Complete the look

**La promesa, y es medible:** el cliente añade tres piezas al carrito en un clic, eligiendo talla de cada una, sin salir de la página. Sube unidades por transacción.

**A favor:** está genuinamente bien construida y eso es raro. Maneja selección de variante por pieza, detecta productos que exigen plan de suscripción y los deriva a su PDP, tiene estado de agotado por pieza, y tiene respaldo sin JavaScript. La mayoría de los temas que dicen tener multi-add añaden la primera variante disponible y generan devoluciones. Y no impone carga de contenido: funciona con fotografía de producto normal.

**En contra:** es menos fotogénica que el lookbook. Su valor se explica, no se mira.

**Competitivamente:** pocos temas lo hacen bien de verdad, y es el único de los tres donde el tema es demostrablemente mejor que el promedio.

## 3.4 Candidata C: la barra de recompensas por tramos

**La promesa:** progreso visible hacia envío gratis y regalo, con cross-sell de un clic en el drawer.

**A favor:** atractivo comercial inmediato.

**En contra, y la descarta:** es la feature más clonada del mercado, cualquier app la hace, y hoy el tema promete dos cosas que no puede entregar sin que el comerciante configure aparte una tarifa de envío y un descuento automático. Titular una campaña con una promesa que depende de configuración externa es frágil.

## 3.5 Mi recomendación, y no es la obvia

**Titula con B y fotografía con A.**

El titular y la imagen de portada no tienen que ser la misma cosa, y para un tema de moda la jugada inteligente es **reclamar el beneficio comercial y mostrar lo bonito**. El copy dice "vende el look completo en un solo add to cart", que es una promesa verificable y defendible en soporte. La primera captura de pantalla muestra el lookbook a pantalla completa, que es lo que hace que el comerciante haga clic.

Eso además protege el flanco: si el lookbook fuera el titular, la limitación de coordenadas móviles sería un defecto en la promesa central. Como hero visual, es una imagen preciosa que además hay que arreglar antes de lanzar.

**Condición de la recomendación:** el arreglo de las coordenadas móviles del lookbook entra al alcance antes de la submission. Si no entra, la candidata A no puede ni ser el hero visual.

## 3.6 Taglines

Todos bajo 70 caracteres, contados.

| Uso | Tagline | Caracteres |
| --- | --- | --- |
| **Tema, principal** | Editorial fashion that sells the whole look, not one piece. | 59 |
| Tema, alternativa corta | Sell the complete look in one add to cart. | 42 |
| Preset Couture | Editorial fashion that sells the whole look, not one piece. | 59 |
| Preset Studio | Dense, square, quiet. For objects that speak for themselves. | 60 |
| Preset Studio, alternativa | A grid so clean the products do all the talking. | 48 |
| Preset Archive | Heritage catalogue pages, with provenance on every line. | 56 |
| Preset Archive, alternativa | Built like a printed catalogue, sold like a modern store. | 57 |

## 3.7 Tres highlights por preset

Para el listado. Cada uno nombra una feature real y el beneficio, en ese orden.

**Couture**

1. Shop the set. Three pieces, one add to cart, sizes chosen for each.
2. A shoppable lookbook that turns campaign photography into a storefront.
3. Full-bleed cinematic hero with video, and a gradient that keeps the image intact.

**Studio**

1. A square, four-up grid with tabular prices that align down the column.
2. Mixed content grid: collections, products and stories in one composition.
3. No serifs, tight tracking, and a negative dark mode instead of a dimmed one.

**Archive**

1. Framed product cards with the maker's name on every entry.
2. Brand statement above the fold, because provenance is the product.
3. Two-pixel rules, warm olive dark mode, and a catalogue index numeral.

## 3.8 Brief de fotografía

Esto es lo que evita comprar a ciegas. Ordenado por preset y con la proporción exacta, que es lo que determina si una imagen sirve o no.

### Couture, once piezas de catálogo más cuatro de escena

| Uso | Cantidad | Proporción | Qué tiene que estar en cuadro |
| --- | --- | --- | --- |
| Hero cinematográfico, video | 1 clip de 8 a 10 s | 16:9, sin audio | Movimiento lento, tela en movimiento, **el tercio inferior izquierdo relativamente vacío** porque ahí va el texto |
| Póster del video | 1 | 16:9 | Un frame representativo del clip, no una foto distinta |
| Producto de catálogo | 24 | **4:5 retrato** | Cuerpo entero o tres cuartos, fondo neutro consistente en las 24 |
| Segunda imagen por producto | 11 mínimo | 4:5 | Detalle de material o vista trasera, para el hover |
| Escena de lookbook | 1 | 3:2 apaisada | **Cuatro productos del catálogo visibles y separados en el cuadro**, porque los marcadores necesitan espacio. Y el encuadre móvil tiene que ser el mismo recorte, no otra toma |
| Escena de Complete the look | 1 | 4:5 | Las tres piezas del set puestas juntas |
| Brand statement | 1 | 1:1 | Macro de material, hilo, costura o textura |
| Tarjeta editorial del grid | 1 | 4:5 | Atmósfera, sin producto identificable |

### Studio, cuatro piezas más el catálogo

| Uso | Cantidad | Proporción | Qué tiene que estar en cuadro |
| --- | --- | --- | --- |
| Hero split | 1 | 3:4 vertical | Un solo objeto sobre fondo plano, mucho aire. Es media columna, no pantalla completa |
| Producto de catálogo | 40 a 60 | **1:1 cuadrado** | Objeto centrado, fondo neutro idéntico en todos. La consistencia es el diseño |
| Tarjetas del grid mixto | 3 | 1:1 y 4:5 | Dos de producto, una de atmósfera de taller |
| Brand statement | 0 | | Studio no lleva imagen aquí. `media_label` vacío |

**Sin escena de lookbook y sin video.** Studio ahorra las dos piezas más caras del brief, y eso no es casualidad: es coherencia de preset.

### Archive, seis piezas más el catálogo

| Uso | Cantidad | Proporción | Qué tiene que estar en cuadro |
| --- | --- | --- | --- |
| Hero cinematográfico, imagen fija | 1 | 3:2 | **Composición centrada con el centro despejado**, porque el texto va centrado sobre un velo al 55% |
| Producto de catálogo | 25 a 40 | **3:4 retrato** | Grano visible, luz cálida, producto sobre superficie de madera o lino |
| Segunda imagen por producto | 12 mínimo | 3:4 | Detalle de desgaste, herraje o etiqueta |
| Escena de lookbook | 1 | 3:2 | **Tres productos visibles**, tratamiento de archivo |
| Brand statement | 1 | 1:1 | Manos trabajando, herramienta o taller |
| Tarjetas de historia del grid | 2 | 4:5 | Documento, archivo, o retrato de oficio |

### Tres reglas que aplican a las tres

1. **Derechos comerciales con derecho a sublicencia**, porque la demo store es pública y las imágenes van dentro del paquete del tema. Una licencia editorial no alcanza.
2. **Sin texto incrustado en las imágenes.** El requisito lo prohíbe salvo en contenido de producto o infografía.
3. **El encuadre móvil de cada imagen de escena tiene que ser el mismo recorte que el de escritorio.** Es la mitigación de la limitación de coordenadas del lookbook, y aplica también al hero para no romper el punto focal.

---

# 4. Escenario hostil del Theme Editor

El catálogo de `CLAUDE-QA-001` prueba el storefront. Esto prueba el editor, que es donde vive la mitad de los hallazgos P1 y donde ocurre la tercera pasada de Johandry.

## 4.1 Los cuatro estados, sección por sección

Para cada sección con bloques, recorrer: **cero bloques, máximo de bloques, todos los settings vacíos, todos los settings en su longitud máxima.**

| Sección | Cero bloques | Máximo | Predicción de qué se rompe |
| --- | --- | --- | --- |
| Collection tabs | 0 tabs | 3 tabs | **Con 0 tabs queda el encabezado y un contenedor de pestañas vacío.** Y con tabs sin colección asignada se renderizan pestañas que abren a nada, que es el estado en que venía el `index.json` original |
| Brand statement | 0 detalles | 4 detalles | Con 0, la lista de definición queda vacía. Revisar que no imprima el contenedor |
| Mixed content grid | 0 tarjetas | 4 tarjetas | Con 4 del mismo tipo, `card_featured` no tiene `limit` propio, así que se puede llenar de cuatro tarjetas de colección y el bento pierde toda su jerarquía |
| Shoppable lookbook | 0 marcadores | 6 marcadores | Con 6 en posiciones por defecto, todos caen en 35% y 45%, o sea **apilados uno encima de otro** |
| Complete the look | 0 productos | 4 productos | Con 0 aparece el string `complete_the_look.empty`, que le dice al **cliente** que use el theme editor. Ese texto no debería verse nunca en vitrina |
| Scrolling text | 0 items | 8 items | Con 0, el track vacío sigue animándose |
| Announcement bar | 0 anuncios | 5 anuncios | Con 0, revisar que la barra no se renderice vacía con sus controles de pausa |
| Contact and FAQ | 0 preguntas y 0 contactos | 12 y 6 | Encabezados de sección sin contenido debajo |
| Collection page | 0 tiles | 2 tiles | Los dos tiles traen `position_in_grid: 4` por defecto, así que **colisionan en el mismo slot de fábrica** |
| Product information | Quitar todos los bloques | Todos más `@app` | Un PDP sin bloque de precio ni de compra. ¿Se puede guardar? ¿Qué ve el cliente? |

## 4.2 Longitud máxima en settings de texto

Pegar 200 caracteres en cada campo de texto de una línea y 2.000 en cada richtext. Los que más probablemente rompan, por lo que vi en el CSS:

- `promotion_tile.heading`, porque tiene `max-width: 14ch` y va a envolver en muchas líneas cortas
- `hero-editorial.heading` en modo cinematográfico con `content_width: 30`
- `announcement-bar.text`, porque el item es `white-space: nowrap` dentro de un viewport con `overflow: hidden`
- `curated-showcase.tab_label`, porque la tira de tabs es `min-width: max-content` y nunca envuelve
- `brand-manifesto.quote`, que además **pierde los saltos de línea** porque usa `escape` sin `newline_to_br`

## 4.3 Secciones puestas donde no deben

- Agregar `Editorial hero` a una plantilla de producto. Debería producir **dos `<h1>`**, que es el hallazgo P1-28 y la razón del setting `heading_tag`.
- Agregar tres `Editorial hero` al homepage. Tres `<h1>` y tres candidatos LCP compitiendo.
- Agregar `Email signup` dos veces en la misma página.

## 4.4 Opciones de variante extremas, para sumar al catálogo hostil

Tres productos más para `qa-catalogo-hostil.csv`:

| Handle | Qué prueba |
| --- | --- |
| `qa-19-long-option-value` | Una opción `Color` con el valor `Deep Forest Green with Tonal Stitching`, 37 caracteres. Revienta los chips del variant picker, que son `flex-wrap` con `gap: 6px` y `min-width: 44px` |
| `qa-20-twelve-values` | Una opción `Size` con doce valores de 34 a 56. Revienta el layout del selector y prueba el `gap` de 6px entre objetivos de 44px, que es el hallazgo P1-47 |
| `qa-21-single-value-option` | Tres opciones donde la primera tiene un solo valor. Caso degenerado: un radiogroup de un solo botón, que no debería renderizarse como selector |

Se generan igual que los otros dieciocho, con los mismos encabezados de CSV.

## 4.5 Cómo se registra el resultado

Cada fila de 4.1 a 4.4 que rompa algo se convierte en una fila del ledger o en un hallazgo nuevo con su `archivo:línea`. Las que no rompan nada se anotan como verificadas con la fecha de la prueba. Ese recorrido es la evidencia de la compuerta 2 de la Definition of Done, que hoy no tiene ninguna prueba adjunta.

---

## 5. Lo que necesita decisión de Johandry antes de que Gemini encargue el empaquetado

1. **La feature titular.** Mi recomendación es titular con Complete the look y fotografiar con el lookbook, con la condición de que el arreglo de coordenadas móviles del lookbook entre al alcance.
2. **Los taglines**, entre la principal y la alternativa de cada preset.
3. **El alcance de `/listings`**: si se hacen los tres `index.json` solamente, o también `collection.json` y `product.json`, que es mi recomendación.
4. **Las dos secciones ausentes**: si se agrega producto destacado antes de la submission, dado que es una ubicación que el requisito nombra para bloques `@app`.

Con esas cuatro cerradas, el encargo de empaquetado para GPT queda sin ambigüedad.
