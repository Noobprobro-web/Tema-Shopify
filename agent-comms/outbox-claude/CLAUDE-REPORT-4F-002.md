# CLAUDE-REPORT-4F-002: Fricciones comerciales de GPT-AUDIT-002 y reconciliación de la tienda

```text
ID: CLAUDE-REPORT-4F-002 (responde a CLAUDE-DIRECTIVE-4F-002)
Estado: código completo en T1–T4. T5 aplicado en la tienda viva y verificado (páginas y
        menús); el nombre de la tienda queda pendiente de un paso manual (§5.3).
        Gates estáticos 8/8, harness 106/106. Nada del código de este sprint está en la
        tienda todavía: Gate 5 empieza cuando Gemini despliegue (§9).
Decisión requerida:
  1. Gemini: desplegar con cuidado templates/index.json. La copia de la tienda tiene datos
     del editor (imágenes, productos, colecciones) que la copia local no tiene; subir la
     local los borraría. Parche de fusión en §6, H1.
  2. Johandry: cambiar el nombre de la tienda a LINEA NOVE en el admin, DESPUÉS del
     despliegue (§5.3). Si se cambia antes, el nombre pisa la lupa a 390 px en la tienda.
  3. Gemini: ratificar las desviaciones D1–D8 (§4), sobre todo D1 (tres archivos fuera de
     la lista de la cabecera de la directiva, nombrados en el texto de sus tareas).
  4. Johandry: aprobar o sustituir el texto demo de /pages/policy y de los acordeones (§5.2).
Resumen en 5 líneas:
  1. La barra fija dice "2 × $980.00" y "Total $1,960.00" con cantidad 2 o más; con 1, solo el precio unitario.
  2. /cart ya no desborda (1500 → 1440 px a 1440; 422 → 390 a 390) y se actualiza cuando el cajón borra o cambia una línea.
  3. Nuevo bloque "Collapsible tab" en la ficha, con dos por defecto: composición y cuidados, envíos y devoluciones.
  4. "1 of 3 items selected"; enlaces editoriales a destinos reales; hotspots sobre sus prendas; el del cinturón fuera porque no hay cinturón en la foto.
  5. Tienda: las 5 páginas responden 200 con su plantilla, Catalog tiene 6 colecciones y Documentation y Support están en el footer.
Archivos tocados: 9 del tema (§3) + configuración de la tienda (§5). Ningún commit ni push.
Desviaciones (Nivel 1 o Nivel 2): 8 (§4); D1 es formalmente Nivel 2 por lista de archivos.
Hallazgos extra fuera de alcance (con parche listo): 5 (§6).
Verificación (comando, resultado y qué demuestra/qué no): §7.
Lista de afirmaciones falsables numeradas: §10.
```

---

## 1. Método

Igual que en 4F-001: `render4f2.mjs` renderiza el Liquid real del árbol de trabajo con liquidjs (ficha con cantidad y barra fija, carrito con una línea y carrito con título de 120 caracteres y cantidad 3, cajón, bundle de tres piezas, home con cabecera) y carga `base.css` y `theme.js` reales. El mismo script renderiza el árbol anterior (los originales del dispositivo antes del sprint). Cada test de `live4f2.spec.mjs` corre contra las dos builds: 20/20 pasan en la nueva y 20/20 fallan en la anterior, cada uno por su aserción.

La parte de tienda (T5) se hizo por la Admin API conectada a `tema-qkqpke0j.myshopify.com` y se verificó con peticiones reales al storefront desde el navegador integrado.

---

## 2. Antes y después

| Tarea | Medida | Antes | Después |
| :--- | :--- | :--- | :--- |
| T1 | Barra fija, cantidad 1 | "$980.00" | "$980.00" |
| T1 | Barra fija, cantidad 2 | "$980.00" (añadía 2) | "2 × $980.00" + "Total $1,960.00" |
| T1 | Barra fija, cantidad 3 | "$980.00" | "3 × $980.00" + "Total $2,940.00" |
| T1 | Cantidad 12, variante larga, 360 px | n/a | "12 × $980.00" entero; "Total $11,760.00" entero en su línea; se recorta la variante |
| T1 | Nombre accesible del botón con 2 | "Add Cocoon Cardigan-Coat to cart" | "Add Cocoon Cardigan-Coat to cart, quantity 2" |
| T2 | scrollWidth de /cart a 1440 / 1280 / 1024 / 768 / 390 / 360 | 1500 / 1390 / 1134 / 878 / 422 / 422 | 1440 / 1280 / 1024 / 768 / 390 / 360 |
| T2 | Ancho del stepper en /cart | 265 px (campo a su ancho intrínseco) | 144 px (mismo tope que el cajón) |
| T2 | Borrar desde el cajón estando en /cart | la página seguía con la línea | la página muestra el carrito vacío sin recargar |
| T2 | Secciones pedidas en la mutación | solo el cajón | `["sections--t__cart-drawer","template--t__cart"]` |
| T3 | Acordeones en la ficha | 0 | 2, cerrados, fila de 56 px, flecha girada 180° al abrir |
| T4 | Bundle con 1 de 3 piezas | "1 of 3 item selected" | "1 of 3 items selected" |
| T4 | Hotspot 2 (merino) | rodilla/pantalón | sobre el jersey, en 17:9, 16:10 y 4:5 |
| T4 | Hotspot 3 (pantalón) | borde derecho del cárdigan | sobre el pantalón en los tres encuadres |
| T4 | Hotspot 4 (cinturón) | banco | retirado: no hay cinturón en la foto |
| Cabecera | Solape nombre/iconos a 360 / 390 / 430 | 41 / 26 / 6 px | 0 / 0 / 0 px |
| T5 | /pages/documentation, faq, about, policy | 404 | 200 con su plantilla |
| T5 | /pages/documentacion | 200 con HTML y `<style>` propios | redirige a /pages/documentation |
| T5 | /pages/support | plantilla contact + HTML con `mailto:` | plantilla support, sin `mailto:` |
| T5 | Menú principal | Home, Catalog, Contact, Documentation, Support | Home, Catalog (6 colecciones), Contact |
| T5 | Footer | Search, Your Privacy Choices | Search, About, FAQ, Shipping & returns, Documentation, Support, Your Privacy Choices |

Capturas en `harness-4F-002/shots/` (antes y después de /cart a 1440 y 390, cabecera a 360 y 390, bundle, acordeones, barra fija y hotspots).

---

## 3. Archivos tocados, líneas exactas

```text
assets/base.css                      +162 -0   (7400-7562, bloque "Sprint 4F-002")
assets/theme.js                      +118 -7
sections/main-product.liquid          +68 -1
sections/main-cart-items.liquid        +6 -1
sections/complete-the-look.liquid      +6 -1
templates/index.json                  +18 -25
templates/product.json                +17 -1
locales/en.default.json                +3 -0
locales/en.default.schema.json         +9 -0
```
`sections/cart-drawer.liquid` estaba autorizado y no hizo falta tocarlo.

### T1. Barra fija con cantidad y total
- `sections/main-product.liquid:679-681`: plantillas `data-quantity-price-template`, `data-total-template` y `data-quantity-label-template` sobre `<sticky-cart-bar>` (claves `products.product.sticky_*`).
- `sections/main-product.liquid:713-721`: el precio lleva la clase `sticky-cart-bar__price`; nuevo `<p class="sticky-cart-bar__total" data-sticky-total hidden>` en su propia línea.
- `assets/theme.js:948-981` (`StickyCartBar.connectedCallback`): toma la cantidad del campo del formulario (`form.elements.namedItem('quantity')`, vale dentro o con `form=""`) y observa con un MutationObserver el total de línea que ya pinta `VariantSelects`. La barra no hace una segunda cuenta: copia el total de la ficha, así no puede discrepar.
- `assets/theme.js:992-993, 1043-1044`: los cambios de variante y de plan guardan el precio unitario y llaman a `renderQuantity`.
- `assets/theme.js:1048-1076` (`renderQuantity`): cantidad 1 → precio unitario; 2 o más → "N × precio" y "Total X"; actualiza el `aria-label`.
- `assets/base.css:7404-7446`: línea de datos en flex (se recorta la variante, nunca "N × precio"); el total en su línea; con el total visible, la reserva inferior del documento sube a 5rem (5.75rem desde 48rem) para que nada quede bajo la barra.
- `locales/en.default.json:390-392`: `sticky_add_quantity_to_cart`, `sticky_quantity_price`, `sticky_total`.

### T2. /cart sin desborde y sincronizada
- `assets/base.css:7448-7475`: `.cart-item__stepper { max-width: 9rem }` (el cajón ya lo tenía); controles en flex con wrap, así Remove baja de línea en vez de salirse; Remove con alto táctil de 44 px.
- `sections/main-cart-items.liquid:6-11`: `data-cart-page data-section-id="{{ section.id }}"` en la sección.
- `assets/theme.js:1926-1961` (`cartPageSection`, `renderSectionIds`, `renderCartPage`): cada mutación del cajón pide también la sección de la página en la misma llamada (`sections`), y la reemplaza con el mismo estado del servidor. Si la respuesta no la trae, la pide con `?section_id=`; si eso falla, el cajón queda bien y no se muestra error.
- `assets/theme.js:1731, 1788, 1834, 2582-2584`: `addItem`, `addCrossSell`, `changeLine` y el bundle usan `renderSectionIds()`.
- `assets/theme.js:1888-1889, 1918`: `syncCart` y `renderCartResponse` llaman a `renderCartPage`.

### T3. Acordeones
- `sections/main-product.liquid:588-620`: `{%- when 'collapsible_tab' -%}` con `<details class="product-details__accordion">`, flecha `chevron-down` y contenido: el texto y, si hay página elegida, su contenido detrás. Sin título o sin contenido no se pinta nada.
- `sections/main-product.liquid:868-891`: bloque `collapsible_tab` en el schema con `heading` (reusa `sections.all.heading.label`), `content` (reusa `sections.all.text.label`) y `page`.
- `locales/en.default.schema.json:1011-1019`: nombre del bloque y etiqueta e info del selector de página.
- `templates/product.json:35-60`: `composition_care` y `shipping_returns` después de la descripción.
- `assets/base.css:7477-7534`: hilo fino, títulos en versalitas, fila de 56 px, flecha que gira con `--motion-base` y la misma entrada del contenido que las respuestas del FAQ.

### T4. Plural, enlaces y hotspots
- `sections/complete-the-look.liquid:287-293` y `assets/theme.js:2531-2533`: la forma se elige por el total de piezas del look, no por las seleccionadas. Las cadenas no cambian.
- `templates/index.json:24-26`: hero, primario a `/collections/all` explícito; secundario "Explore the series" → `/collections/the-autumn-series` (antes "Explore lookbook" → `/collections`, el directorio).
- `templates/index.json:150`: "Read our process" → `/pages/about` (antes `/collections/all`).
- `templates/index.json:161-164`: "Sculptural layers" → `/collections/the-autumn-series`, su propia colección, alineado con la tienda.
- `templates/index.json:172-173`: "Carried close / Explore the story" → `/pages/about`.
- `templates/index.json:206-230`: hotspot 2 a (52, 10) escritorio y (52, 27) móvil, popover abajo; hotspot 3 a (56, 74) y (54, 66); hotspot 4 retirado del bloque y del orden.

### Cabecera móvil (decisión de Johandry en este sprint)
- `assets/base.css:7536-7562`: por debajo de 48rem la marca se alinea a la izquierda y el botón de menú queda solo con icono; la palabra "Menu" sigue siendo su nombre accesible.

---

## 4. Desviaciones

- **D1 (Nivel 2 por lista, autorizada por el texto de las tareas).** `sections/complete-the-look.liquid` y `templates/product.json` no están en la lista de la sección 2 de la directiva, pero las Tareas 3 y 4 los nombran. `locales/en.default.schema.json` tampoco está: la lista autoriza `en.default.json` "para acordeones", y las etiquetas de un bloque nuevo solo pueden ir en el locale de schema si se respeta Gate 4. Son tres claves. Pido ratificación.
- **D2. El plural se arregló en la lógica, no en las cadenas.** El sustantivo concuerda con el total ("of 3 items"), así que la forma se elige por el total. Con un look de una sola pieza sale "1 of 1 item selected".
- **D3. Hotspot 4 retirado, no movido.** La foto no tiene cinturón (sí botas, y no hay producto de botas en el catálogo). GPT lo plantea así: si la pieza no aparece, fuera. El hotspot 3 también estaba mal colocado (sobre el cárdigan) y se corrigió: misma clase de defecto.
- **D4. Etiqueta del botón secundario del hero.** "Explore lookbook" no tiene un destino estable: el lookbook es una sección de la home y su id depende de la plantilla. Pasa a "Explore the series" → la colección de temporada, para que etiqueta y destino coincidan.
- **D5. Mayúsculas de los acordeones por defecto.** "Composition & care" y "Shipping & complimentary returns", en sentence case como el resto de títulos del tema.
- **D6. Textos por defecto alineados con el FAQ ya publicado.** Envío en tres días hábiles, devoluciones en catorce días y el trabajo a medida sin devolución, igual que `templates/page.faq.json`. Una primera versión decía 30 días y la corregí antes de entregar.
- **D7. La barra fija pone el total en una línea propia.** En una sola línea, con 12 unidades a 360 px, "Total $11,760.00" se cortaba.
- **D8. Cabecera móvil.** No lo pedía la directiva: el nuevo nombre lo provocaba. Johandry eligió la opción en este sprint. Afecta también a logos en imagen por debajo de 48rem: quedan alineados a la izquierda.

---

## 5. Tienda: qué se cambió

Todo por Admin GraphQL, con confirmación previa de Johandry en el chat. Ninguna página ni menú se borró.

### 5.1 Páginas
| Página | Acción | Resultado verificado |
| :--- | :--- | :--- |
| Documentation (id 138740007155) | handle `documentacion` → `documentation` con redirección automática; plantilla `documentation`; cuerpo vaciado | 200, `.main-documentation`, 1 h1, 0 `<style>`, 0 `mailto:`; /pages/documentacion redirige |
| Support (id 138740039923) | plantilla `contact` → `support`; cuerpo vaciado | 200, `.main-support`, formulario a `/contact`, 0 `mailto:` |
| FAQ (id 142267646195) | creada, plantilla `faq`, título "Frequently asked questions" | 200, `.main-faq`, 4 categorías |
| About (id 142267678963) | creada, plantilla `about` | 200, `.main-about`, 3 pilares |
| Shipping & returns (id 142267711731) | creada en /pages/policy, plantilla `policy`, texto demo | 200, `.main-policy`, 6 apartados h2 (el índice lateral se construye con ellos) |

El HTML que tenían Documentation y Support no se pierde: es el de `docs/merchant/docs.html` y `docs/merchant/support.html`, versionados en el repo (commit `ffbf586`).

### 5.2 Texto demo que necesita el visto bueno de Johandry
`/pages/policy` y los dos acordeones por defecto llevan un texto demo en inglés para LINEA NOVE. Envío gratis desde $150 (lo dice la barra de anuncio), despacho en tres días hábiles y devolución gratuita en catorce días (como el FAQ). Es texto de demostración, no una política legal.

### 5.3 Nombre de la tienda: pendiente, paso manual
La Admin API no permite cambiar el nombre de la tienda. En el navegador integrado el admin pide verificar la conexión y luego iniciar sesión; no paso verificaciones de bots ni escribo contraseñas. Johandry: Configuración › Detalles de la tienda › Nombre: "LINEA NOVE". **Hacerlo después del despliegue de este sprint**: sin la regla de `base.css:7536-7562`, "LINEA NOVE" pisa la lupa 26 px a 390 px en la tienda.

### 5.4 Menús
- `main-menu`: Home · Catalog (Outerwear, Knitwear, Tailoring, Accessories, The Autumn Series, The Permanent Collection) · Contact. El desplegable añade solo "View all Catalog".
- `footer`: Search · About · FAQ · Shipping & returns · Documentation · Support · Your Privacy Choices.
- Fuera quedaron las colecciones "Home page" y "Prueba" (de pruebas).

---

## 6. Hallazgos extra

**H1. `templates/index.json` de la tienda y el local no son el mismo archivo.** La tienda tiene lo que se configuró en el editor: `image_desktop` con `shopify://shop_images/...` en hero, manifiesto, bento, lookbook y bundle; productos en hotspots, bento y bundle; colecciones en la vitrina. El local no los tiene, por la regla de cero `shopify://` en el código. Subir el local tal cual borra todo eso. Parche de fusión, solo estas claves sobre el archivo de la tienda:
```text
sections.hero_editorial.settings.button_primary_url      = "/collections/all"
sections.hero_editorial.settings.button_secondary_label  = "Explore the series"
sections.hero_editorial.settings.button_secondary_url    = "/collections/the-autumn-series"
sections.brand_manifesto.settings.button_url             = "/pages/about"
sections.bento_discovery.blocks.bento_featured.settings.link  = "/collections/the-autumn-series"
sections.bento_discovery.blocks.bento_editorial.settings.link = "/pages/about"
sections.lookbook.blocks.hotspot_2.settings: horizontal_position 52, vertical_position 10,
    horizontal_position_mobile 52, vertical_position_mobile 27, popover_position "bottom"
sections.lookbook.blocks.hotspot_3.settings: horizontal_position 56, vertical_position 74,
    horizontal_position_mobile 54, vertical_position_mobile 66
sections.lookbook: borrar el bloque hotspot_4 y quitarlo de block_order
```
`templates/product.json` es idéntico en la tienda y en local (md5 `fbf75e22…`), así que ese se puede subir directo.

**H2. La documentación y el soporte viven en una tienda con contraseña.** /pages/documentation y /pages/support ya funcionan, pero `tema-qkqpke0j` está protegida y nadie de fuera puede abrirlas. `theme_info` sigue apuntando a `ruizdigital.com/themes/sartorial/docs` y `/support`, sin publicar. La fila del ledger "theme_info Comercial y Soporte Real" sigue en `no verificado` (dueño: Johandry).

**H3. El formulario de soporte no se probó enviando.** Ahora es el formulario nativo `/contact` de la plantilla support, que llega al correo de la tienda. No lo envié: enviar un formulario necesita permiso expreso. Lo que pide GPT en UX-03 (envío de prueba y recepción) queda para Johandry.

**H4. La composición del lookbook recorta la foto en escritorio.** La imagen es vertical (928×1152) en un marco 17:9: en escritorio solo se ve del 29 % al 71 % de su alto, sin cabeza ni botas. Por eso no hay prenda para un cuarto hotspot. Recomendación de producción: una foto horizontal para escritorio (`image_desktop`) y la vertical para móvil (`image_mobile`).

**H5. Los fixtures de 4F-001 tenían el JSON de variantes roto.** En `render4f.mjs` faltaba `requires_selling_plan` y `VariantSelects` no arrancaba en las páginas de prueba. No afecta a la tienda, pero ningún test de 4F-001 ejercitó el cambio de variante. Corregido en `render4f2.mjs`.

---

## 7. Verificación

### 7.1 Compuertas estáticas
```text
$ npm run gates:static ; echo "exit $?"
exit 0
JSON VALIDATE ... Fallos de parseo: 0
DATASET HOOKS ... Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
LOCALES ......... Sin resolver en storefront: 0 · Sin resolver en schema: 0 · Huerfanas en storefront: 0
                  (Huerfanas en schema: 62, las mismas 62 de 4F-001)
LEDGER .......... Incoherencias: 0
THEME CHECK ..... 85 files inspected with no offenses found.
PACKAGE ......... Your local theme was packaged in Sartorial-1.0.0.zip
```

### 7.2 Harness
```text
$ npx playwright test --config harness/pw.config.mjs
106 passed (1.5m)        # 75 previos + 11 de 4F-001 + 20 de 4F-002
$ BUILD=before npx playwright test --config harness/pw.config.mjs live4f2
20 failed                # cada uno por su aserción (§2, columna "Antes")
```

### 7.3 Tienda viva (peticiones reales al storefront)
```text
/pages/documentation 200 h1=1 main=1 style=0 mailto=no .main-documentation
/pages/support       200 h1=1 main=1 style=0 mailto=no .main-support  form=/contact
/pages/faq           200 h1=1 main=1 style=0 mailto=no .main-faq
/pages/about         200 h1=1 main=1 style=0 mailto=no .main-about
/pages/policy        200 h1=1 main=1 style=0 mailto=no .main-policy (6 h2)
/pages/documentacion 200 → /pages/documentation
header: Home · Catalog [View all Catalog, 6 colecciones] · Contact
footer: Search, About, FAQ, Shipping & returns, Documentation, Support, Your Privacy Choices
```

### 7.4 Qué NO demuestra
- Nada de T1–T4 ni de la cabecera está en la tienda: el tema publicado es el de 4F-001. Las cifras de §2 son del render local con el Liquid real, no de Shopify.
- El test de sincronización de /cart simula las respuestas de `/cart/change.js` con el HTML real de las secciones. Que Shopify acepte dos secciones en `sections` está documentado, pero no lo he visto en la tienda.
- Solo Chromium. Safari iOS pendiente, sobre todo la barra fija con cantidad y `:has()` en la reserva inferior (Safari lo soporta desde 15.4).
- No hay capturas de la tienda: el navegador integrado no pinta si la ventana de Claude está detrás de otra. Las comprobaciones de §7.3 son del DOM servido.
- La redirección de /pages/documentacion la crea Shopify; la comprobé con `fetch` (URL final), no con un 301 explícito.

---

## 8. Compuerta 2: estados degenerados

| Componente | Vacío | Uno | Muchos | Muy largo | Faltante |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Barra fija | sin bloque de cantidad: precio unitario | cantidad 1: precio unitario | 12 unidades: "12 × $980.00" + total en su línea | variante de 40 caracteres: se recorta la variante | sin `price_cents`: "N × precio" sin total |
| /cart | carrito vacío tras borrar desde el cajón: estado vacío | 1 línea medida | 2 líneas medidas | título de 120 caracteres a 360–1440 px: 0 px de desborde | sin sección de página en la respuesta: se pide aparte |
| Acordeón | sin título o sin contenido: no se pinta | 1 bloque | N bloques forman una sola lista sin doble hilo | contenido largo: `max-width: 64ch` | página elegida sin contenido: solo el texto |
| Bundle | 0 seleccionadas: "Select at least one piece" | 1 de 3: "items" | 3 de 3 | n/a | look de 1 pieza: "1 of 1 item selected" |
| Cabecera | n/a | n/a | n/a | nombre de 10 caracteres a 360: se recorta con puntos suspensivos, sin solape | con logo en imagen: alineado a la izquierda (D8) |

---

## 9. Gate 5 tras el despliegue

1. /products/cashmere-rib-crew a 390: cantidad 2 y 3, bajar hasta la barra, comprobar texto y que lo añadido al carrito coincide.
2. /cart con una línea a 1440 y 390: `document.documentElement.scrollWidth === clientWidth`.
3. En /cart abrir el cajón, borrar la línea, cerrar: la página muestra el vacío sin recargar.
4. Ficha: abrir y cerrar los dos acordeones con ratón, teclado y VoiceOver.
5. Home: bundle a 1 de 3; lookbook en escritorio y móvil con los tres puntos sobre sus prendas.
6. Cambiar el nombre a LINEA NOVE y comprobar la cabecera a 360 y 390.

Filas del ledger (propuesta; lo escribe Gemini): ninguna cambia de estado. "theme_info" sigue en `no verificado` (H2). "Live Regions" y "Áreas táctiles" pueden sumar como evidencia `main-product.liquid:721` y `base.css:7471-7475` (Remove a 44 px).

---

## 10. Afirmaciones falsables

1. `npm run gates:static` termina con código 0 y Theme Check informa 0 ofensas en 85 archivos.
2. Solo cambian los 9 archivos de §3; `sections/cart-drawer.liquid` es idéntico al del dispositivo.
3. En la ficha, con cantidad 2, `[data-sticky-price]` dice "2 × $980.00" y `[data-sticky-total]` "Total $1,960.00"; con cantidad 1, el total está `hidden`.
4. El total de la barra es siempre el texto de `[data-line-total-current]` con la plantilla "Total …"; nunca se calcula aparte.
5. En `cart.html` y `cart-long.html`, a 1440, 1280, 1024, 768, 390 y 360 px, `scrollWidth === clientWidth`.
6. Al borrar desde el cajón en /cart, la petición a `/cart/change.js` lleva `sections: ["sections--t__cart-drawer","template--t__cart"]` y la página queda con `.cart-empty` sin recargar.
7. Si la respuesta no trae la sección de la página, se hace exactamente una petición a `/cart?section_id=template--t__cart`.
8. La ficha renderiza 2 `details.product-details__accordion` cerrados; al abrir uno, su flecha tiene `transform: matrix(-1, 0, 0, -1, 0, 0)`.
9. Con 1 pieza marcada de 3, `[data-bundle-count]` dice "1 of 3 items selected".
10. `templates/index.json` no tiene `hotspot_4` y ningún enlace editorial apunta a `/collections` ni a `/collections/all`, salvo el botón primario del hero.
11. A 360, 390 y 430 px, el nombre "LINEA NOVE" no se solapa con los iconos de la cabecera y el botón de menú mide 44 px o más, con nombre accesible "Menu".
12. En la tienda, /pages/documentation, /support, /faq, /about y /policy responden 200 con `.main-documentation`, `.main-support`, `.main-faq`, `.main-about` y `.main-policy`, y ninguna contiene `mailto:` ni `<style>` en `main`.
13. /pages/documentacion termina en /pages/documentation.
14. El menú principal de la tienda tiene 3 entradas y Catalog tiene 6 hijas; Documentation y Support están en `footer` y no en `main-menu`.
15. El nombre de la tienda sigue siendo "Tema" (paso manual pendiente, §5.3).
16. No hay `git commit` ni `git push` de este sprint.
