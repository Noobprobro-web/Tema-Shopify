# CLAUDE-AUDIT-LIVE-001: Auditoría de la tienda en vivo

**Tema:** Sartorial 1.0.0 (nombre en el admin: *Couture*, #165809488115, `role: main`)
**Tienda:** `tema-qkqpke0j.myshopify.com`
**Fecha:** 2026-09-21
**Autor:** Claude (Implementador Principal / auditor técnico)
**Alcance:** solo lectura. Ningún cambio de código, ningún commit.

---

## 0. Qué build se auditó y cómo

**El build publicado es el árbol local de 4E-003**, minificado por el CDN de Shopify. Lo comprobé descargando `base.css` y `theme.js` desde la tienda y buscando marcadores que solo existen desde 4E-003: la escala de títulos con `.main-documentation__title, .main-support__title, …`, la medida de 68ch en `.main-documentation__body`, `.main-faq__group{margin-block-start}` sin selector adyacente, `.main-support__section-title` y el margen propio de `.main-support__policies`. Todos presentes. La diferencia de tamaño con el fichero local (123 202 frente a 124 291 caracteres sin espacios) la explica la minificación: ceros iniciales quitados (211 casos), `::before` pasado a `:before` y comillas de atributos eliminadas.

**Método.** Navegador integrado de Claude con la ventana maximizada: escritorio real a 1518×694, emulación a 1440×900 y 1280×800 para medidas, y 390×690 para móvil (a 390×844 el panel escalaba la vista y congelaba las capturas). Todo lo que figura abajo está medido en el DOM, no estimado:

- contraste de todo el texto sobre fondo plano, y **muestreo de píxeles del hero en canvas** componiendo el degradado del overlay, para medir el texto que va sobre fotografía;
- tamaños táctiles, desbordes horizontales, jerarquía de encabezados, landmarks, IDs duplicados, imágenes sin `alt` o sin dimensiones;
- orden y visibilidad del foco con **teclas reales** (Tab, Mayús+Tab, Escape);
- diálogos: `role`, `aria-modal`, `inert`, bloqueo de scroll, trampa de foco y devolución del foco;
- `elementsFromPoint` para saber qué tapa a qué.

**Límites.** Lighthouse no está disponible en el panel, así que las puntuaciones de Theme Store se infieren de los fallos medidos, no de un informe. La herramienta no puede simular la **activación** con Enter o Espacio (la tecla llega, pero el navegador no la convierte en clic), así que la activación por teclado no está probada; Tab y Escape sí. Las cifras de red están contaminadas por la barra de vista previa del admin y por el prefetch del checkout de Shopify (119 peticiones que no son del tema). Las páginas nativas de 4E no se pueden auditar en vivo porque no están activas (ver D-06).

---

## 1. Calificación técnica global: **6.0 / 10**

| Dimensión | Nota | Por qué |
|---|---|---|
| Arquitectura JS y accesibilidad de componentes | 8.5 | Diálogos, combobox, stepper y facetas están al nivel de Prestige o Focal |
| Rendimiento del código del tema | 8.0 | 18 KB gz de CSS, 18 KB gz de JS diferido, una sola imagen eager |
| Ejecución visual en vivo (escritorio) | 5.0 | Contraste del hero, lookbook recortado, hueco en la ficha, cabeceras de panel tapadas |
| Responsive y móvil | 5.0 | Sin carrusel en la ficha, filtros que empujan los productos bajo el pliegue |
| Tienda demo como escaparate | 3.0 | Productos de QA publicados, descripciones en español, catálogo sin variantes |
| Conformidad Theme Store a día de hoy | 4.0 | Falta el checkout acelerado en el carrito; el hero hunde la accesibilidad de la home |

**Lectura.** El código de interacción es de gama alta. Lo que ve un revisor o un comprador al abrir la tienda no lo es: cuatro defectos visuales muy evidentes en las tres páginas que Shopify puntúa (home, colección, ficha) y una demo que no cumple las normas de contenido. Ninguno es difícil. Con los P0 cerrados, el tema está en 8 o más.

---

## 2. Fortalezas técnicas y de diseño

**Diálogos ejemplares.** Menú móvil, buscador y carrito: `role="dialog"` con `aria-modal`, el foco entra en el primer control, `main` pasa a `inert`, el scroll de fondo se bloquea, Escape cierra y **el foco vuelve exactamente al disparador**. Verificado en los tres, con teclas reales.

**Buscador predictivo como combobox de verdad.** Las flechas mueven `aria-activedescendant` sin sacar el foco del campo, hay región de estado para el número de resultados y Escape devuelve el foco a la lupa.

**Stepper y selector de variantes.** Botones de 44×44 con etiquetas localizadas ("Decrease quantity for …"), `−` deshabilitado en el mínimo; variantes en pastillas de 44 px con el radio oculto de forma accesible y combinaciones no disponibles marcadas.

**Barra de compra fija bien hecha.** Está `inert` y `aria-hidden` mientras no se ve, aparece solo cuando el botón principal sale de pantalla y el `body` recibe 80 px de relleno para que no tape el pie.

**Barra de envío gratis accesible.** `role="progressbar"` con `aria-valuetext` legible ("Complimentary Shipping and Atelier Gift unlocked") y el mensaje en una región `status`.

**Facetas sin recarga.** Re-render por AJAX en unos 330 ms, `pushState`, y el recuento de resultados se replica en una región viva que está fuera del bloque que se reemplaza, así que el lector de pantalla no pierde el nodo.

**Foco visible y ordenado.** El enlace de salto es lo primero, se ve, y el orden de foco sigue el DOM de izquierda a derecha y de arriba abajo. El quick add se revela también con `:focus-within`, no solo con hover, y se queda visible en pantallas táctiles sin mover ni un píxel de la rejilla.

**Payload contenido.** `base.css` 18 KB gzip, `theme.js` 18 KB gzip y diferido, solo la imagen del hero es eager y lleva `fetchpriority="high"`, 22 imágenes lazy, cero scripts de terceros del tema. Todas las imágenes tienen `alt`, ningún campo sin etiqueta, ningún desborde horizontal a 390 ni a 1518 en las páginas auditadas, rejilla de colección uniforme a 4:5.

**Diseño editorial con carácter.** La ficha técnica del manifiesto, el total de cápsula de *Complete the look*, el bento y la marquesina con botón de pausa (WCAG 2.2.2) son lo mejor visualmente de la home.

---

## 3. Puntos débiles, inconsistencias y fricciones

### 3.1 Código del tema

**V-01 · El texto del hero no se lee (portada, escritorio y móvil).** Contraste medido sobre los píxeles reales de la foto con el overlay aplicado:

| Elemento | 1280 px (mediana / peor 10 %) | 390 px (mediana / peor 10 %) | Mínimo WCAG |
|---|---|---|---|
| H1 "Form in quiet movement" | 2.06 / 1.65 | 2.08 / 1.71 | 3:1 |
| Eyebrow 12 px | 1.80 / 1.52 | 1.77 / 1.66 | 4.5:1 |
| Subtítulo 16 px | **1.48** / 1.37 | **1.19** / 1.10 | 4.5:1 |
| Botón secundario 14 px | 4.19 / 3.78 | 4.33 / 3.17 | 4.5:1 |

A 390 px el subtítulo es literalmente invisible. Causa doble: el overlay `gradient_bottom` al 40 % se desvanece a 0 en el 72 % de la altura justo donde está el texto (`content_position_y: end`) sobre una pared casi blanca; y `.hero-editorial__subheading` usa `--color-foreground-muted` encima de fotografía (`base.css:2384-2389`), un gris que nunca es seguro sobre imagen. Ajustes de la demo en `templates/index.json`.

**V-02 · La barra de anuncio pinta encima de los paneles y tapa sus botones de cerrar.** En el menú móvil el botón Cerrar (44×44 en y 16-60) queda **entero** bajo la barra de anuncio (y 0-45); en el panel de búsqueda de escritorio quedan tapados 29 de sus 44 px y el título "Search the atelier". Causa: `.site-header` es `position: relative; z-index: 20` (`base.css:566-568`) y crea un contexto de apilamiento; el `.drawer-overlay` (z-index 100) y el buscador viven dentro de ella, así que su 100 no sale de ese 20; `.announcement-bar` tiene `z-index: 21` (`base.css:424-426`) y pinta por encima. Como la barra está `inert`, el clic la atraviesa, pero **el foco se coloca en un botón que nadie ve**: fallo de WCAG 2.2 **2.4.11 Focus Not Obscured (AA)**.

**V-03 · Lookbook recortado y con hotspots desalineados (portada, escritorio).** El escenario pasa a `aspect-ratio: 16/10` (`base.css:4189`) y `17/9` (`base.css:4235`) con `object-fit: cover` sobre una foto vertical 4:5. A 1518 px solo se ve la franja del 28.7 % al 71.3 % de la imagen: sin cabeza ni piernas. Los hotspots se colocan en porcentaje del contenedor, no de la imagen, y caen en la foto en y = 41.8 / 55.5 / 43.5 / 58 %: el 4, que en móvil señala las botas, apunta al banco vacío. Además la fuente es de 750 px y se estira a 1797 px físicos.

**V-04 · Hueco de 401 px en todas las fichas reales (escritorio).** `.product-main__layout--grid .product-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)) }` (`base.css:3560-3562`). Con una sola imagen, que es el caso de 40 de 41 productos, la foto ocupa la primera columna y la segunda queda vacía entre la galería y el bloque de compra.

**V-05 · "SEARCH" en vertical al abrir el buscador.** Con el campo vacío el botón mide 44×125 y las letras se apilan una por línea. Causa: la fila es `44px 1fr 44px auto` (`base.css:6168`) y el botón de borrar está `hidden`, así que sale del flujo y el botón de enviar cae en la pista de 44 px; `overflow-wrap: anywhere` del `body` (`base.css:109`) hace el resto. Con texto escrito el botón pasa a 96×52. Aparte, la × azul nativa de WebKit no está suprimida y convive con la × del tema: dos botones de borrar.

**V-06 · El pie del carrito se solapa en pantallas bajas.** A 694 px de alto y con una sola línea, el mensaje "Item added to your cart." tapa 20 px del botón Checkout y deja "View cart" (y 683-731) debajo del mensaje y fuera de pantalla. Causa: `.cart-drawer__content` es `flex: 1` sin `min-height: 0` ni scroll propio (`base.css:2100`) y `.cart-drawer__message` es un hermano flex (`base.css:2330`), así que el pie desborda por debajo del mensaje. Un portátil de 1366×768 con la barra del navegador está en esa altura. Riesgo de 2.4.11.

**V-07 · La cabecera fija no existe.** `.site-header` es relativa dentro de una sección estática; tras bajar 1500 px está en y = -1390. El JS pone `data-header-scrolled` (`theme.js:3682-3697`) y el CSS condensa y difumina la cabecera (`base.css:7162-7184`) sobre un elemento que ya salió de pantalla: función muerta. En este precio el comprador espera la opción de cabecera fija.

**V-08 · La ficha en móvil no tiene carrusel.** Los tres modos de galería (`stack`, `grid`, `thumbnails`, `main-product.liquid:667-672`) apilan en vertical en móvil. Con cuatro imágenes de proporciones mezcladas el título y el precio empiezan en y = 2028: tres pantallas de scroll antes de ver qué se compra. La mejora aprobada nº 2 de `contexto-maestro.md` ("galería con slider y miniaturas en móvil") no está implementada, y la galería no tiene ajuste de proporción para normalizar imágenes dispares.

**V-09 · En móvil la colección no enseña ningún producto en la primera pantalla.** Los filtros van en línea (270 px), luego el orden y el botón Apply; la primera tarjeta empieza en y = 692 en una pantalla de 690.

**V-10 · Las facetas exigen Apply y pierden el foco.** Marcar "In stock" no hace nada hasta pulsar Apply. Tras Apply el foco cae al `body`: el botón no tiene `id` (`main-collection.liquid:171`) y la restauración busca `document.activeElement.id` (`theme.js:1943` y `1966`).

**V-11 · Las miniaturas del buscador descargan el original.** `image.src = imageUrl` sin parámetro de ancho ni `srcset` (`theme.js:3293-3302`): imágenes de 1856 px para cajas de 72×90. Se nota como cajas vacías mientras cargan.

**V-12 · Placeholders sin estilo.** No hay ninguna regla `::placeholder` en `base.css`; el gris por defecto del navegador (#757575) da 3.73:1 en el pie oscuro y 3.74:1 en el fondo arena del newsletter.

**V-13 · El foco del icono de cuenta no es del tema.** `<shopify-account>` (`header.liquid:185`) pinta su anillo naranja por defecto (#E59700, 0.8 px): 2.17:1 contra el crema e inconsistente con el anillo oscuro del resto de la cabecera.

**V-14 · Una frase dentro del índice de encabezados.** La cita del manifiesto es un `<h2>` dentro de un `<blockquote>` (`brand-manifesto.liquid:19-21`): entra en el esquema de encabezados como si fuera un título de sección y en móvil ocupa cinco líneas a 38 px.

**V-15 · 24 regiones vivas inútiles en la colección.** `.price__badges` lleva `aria-live="polite"` en todas las tarjetas (`snippets/price.liquid:91`) aunque sus insignias no cambian nunca fuera de la ficha.

**V-16 · Dos newsletters seguidos en la portada.** La sección "Notes from the atelier" y el mismo bloque, con el mismo texto, en el pie.

**V-17 · Anillo de foco fino.** 1.6 px con 2.4 px de separación: cumple 2.4.7, pero queda por debajo de los 2 px que pide 2.4.13 (AAA) y se pierde en pantallas de baja densidad.

### 3.2 Contenido y configuración de la tienda

**D-01 · 17 productos de QA publicados** (`qa-01` a `qa-18`). El primer producto de `/collections/all` (orden A-Z) es "A" con una imagen de relleno de 1400×1400; en la segunda fila aparece otra de 1200×1500. El buscador ofrece "Free sample $0.00" con otra imagen de relleno. También están "No image at all", "Completely sold out", "Ultra tall image 2:5".

**D-02 · Las 24 descripciones reales están en español** en una tienda con toda la interfaz en inglés (por ejemplo, Cocoon Cardigan-Coat: "Alpaca hilada en Arequipa, tejida en punto abierto…").

**D-03 · El catálogo real no tiene variantes.** Solo los dos productos de QA tienen opciones. El selector de variantes, las muestras de color, la guía de tallas, la talla en *Complete the look* (cuyo texto dice "select its size") y el camino "Choose options" nunca aparecen con un producto de LINEA NOVE. La opción Color no tiene datos de muestra.

**D-04 · 40 de 41 productos tienen una sola imagen.** No hay imagen secundaria al pasar el cursor (la opción está activa en la plantilla) ni galería que enseñar.

**D-05 · Imágenes de campaña de baja resolución.** El hero se sirve a 1200 px aunque el Liquid pide hasta 2400w (Shopify recorta en el ancho del original); el lookbook, a 750 px. Ambos se ven blandos en escritorio y en pantallas retina.

**D-06 · Las páginas nativas no están activas y las antiguas rompen el sitio.** `/pages/documentacion` renderiza `main-page` y `/pages/support` renderiza `main-contact`, las dos con el HTML pegado en el cuerpo. Ese HTML trae un `<style>` con selectores globales que secuestran el tema: `header { max-width: 840px; margin: 3rem auto }`, `main { max-width: 840px }`, `footer { … }`, `body { font-family: -apple-system…; padding: 0 1.5rem }`, más reglas de `h1` y `h2`. A 1518 px la cabecera del sitio queda metida en una columna central, el menú se parte en dos líneas y Assistant se sustituye por la fuente del sistema. Cada página tiene dos H1, y Support tiene además un formulario con `action="mailto:support@ruizdigital.com"` junto al formulario del tema. `/pages/documentation`, `/pages/faq`, `/pages/about` y `/pages/policy` devuelven 404.

**D-07 · Pie y políticas.** `/policies/terms-of-service`, `refund-policy` y `shipping-policy` devuelven 404; solo existe la de privacidad. El menú del pie tiene "Search" y "Your Privacy Choices"; no hay redes ni medios de pago. El selector de país e idioma está bien programado (`snippets/localization-selectors.liquid`) pero no aparece porque la tienda tiene un solo mercado y un solo idioma.

**D-08 · La tienda se llama "Tema".** Es el logo de la cabecera y la línea de copyright; la marca LINEA NOVE no está aplicada.

**D-09 · Menú principal plano y con páginas del vendedor.** Home, Catalog, Contact, Documentation, Support, sin ningún submenú: el desplegable y la navegación con flechas de 4E-002 no se ven en la demo, y la documentación del tema está en el menú de una tienda de moda.

**D-10 · "Atelier Gift" a partir de 250 $** se anuncia en el carrito sin ningún regalo real detrás.

**D-11 · La colección "all" ordena alfabéticamente por defecto**, que es lo que pone los productos de QA delante.

---

## 4. Vulnerabilidades y riesgos en Theme Store

Contrastado con los [requisitos oficiales de Theme Store](https://shopify.dev/docs/storefronts/themes/store/requirements).

**R-01 · Falta el checkout acelerado en el carrito (bloqueante).** El requisito pide botones de checkout acelerado "en las páginas de producto y de carrito". Buscando en todo el tema, `additional_checkout_buttons` y `content_for_additional_checkout_buttons` no aparecen en ningún sitio; solo la ficha y el producto destacado tienen `dynamic-checkout`. El cajón (`cart-drawer.liquid:465`) y la página de carrito (`main-cart-items.liquid:204`) solo tienen el botón Checkout. Además la propia documentación del tema afirma que el cajón los tiene ("Accelerated checkout buttons", bloque `doc_cart` de `page.documentation.json`): hay que corregir el código, no el texto.

**R-02 · Accesibilidad Lighthouse ≥ 90 de media en home, colección y ficha, escritorio y móvil.** V-01 es un fallo de contraste de texto grande y normal en la home en las dos resoluciones, más V-12. Descuento probable en la home.

**R-03 · Productos complementarios.** El tema los soporta (`product-recommendations.liquid`, `intent: complementary`), pero la plantilla de producto de la demo solo tiene una sección con `intent: related`. El revisor no los va a ver.

**R-04 · Muestras de color.** Están implementadas con `value.swatch` (`main-product.liquid:130-134`), pero ninguna opción de la demo tiene datos de muestra.

**R-05 · Normas de la tienda demo.** Se pide "un ejemplo totalmente realista del negocio de un comerciante… texto original y claramente escrito" y se recomienda incluir productos rebajados, variantes agotadas, artículos con varias opciones y tarjetas regalo. D-01, D-02, D-03 y D-06 lo contradicen directamente.

**R-06 · Foco y teclado.** Los requisitos exigen estados de foco visibles en toda la página. V-02 y V-06 son fallos de 2.4.11 (WCAG 2.2 AA).

**R-07 · Imágenes responsive.** "Las imágenes deben adoptar una estrategia responsive": las miniaturas del buscador (V-11) no la tienen.

**R-08 · Biblioteca de bloques de la ficha escasa para el precio.** `main-product.liquid` ofrece vendor, title, price, variant_picker, size_guide, quantity, buy_buttons, description y `@app`. No hay contenido plegable (composición, cuidados, envíos), texto libre, Liquid propio ni bloque de complementarios. No es un requisito, pero Prestige, Impulse y Focal lo traen de serie.

---

## 5. Plan de acción priorizado

Tipo: **C** código del tema · **D** demo o contenido · **A** configuración en el admin.

### P0: bloquean el envío o son lo primero que se ve

| # | Tarea | Dónde | Tipo | Aceptación |
|---|---|---|---|---|
| 1 | Añadir checkout acelerado al cajón y a la página de carrito: `{%- if additional_checkout_buttons -%}<div class="cart__dynamic-checkout">{{ content_for_additional_checkout_buttons }}</div>{%- endif -%}` bajo el botón Checkout | `cart-drawer.liquid:465`, `main-cart-items.liquid:204` | C | Botones visibles con Shopify Payments en modo prueba |
| 2 | Contraste del hero: en modo cinemático el subtítulo usa `--color-foreground`, nunca el muted; opción de degradado ceñido al bloque de texto; demo con `gradient_content` o `scrim` | `base.css:2384-2389`, `hero-editorial.liquid:126-127`, `templates/index.json` | C+D | Con la sonda de canvas del arnés: mediana ≥ 4.5 en el texto de 16 px y ≥ 3 en el H1, a 390 y a 1280 |
| 3 | Sacar menú y buscador del contexto de apilamiento de la cabecera: quitar el `z-index` de `.site-header` o pasar los paneles a la capa superior con `<dialog>.showModal()` | `base.css:424-426` y `566-568`, `header.liquid` | C | `elementsFromPoint` en el centro de cada Cerrar devuelve el propio botón y se ve en la captura |
| 4 | Galería con una sola imagen a todo el ancho: `.product-gallery__item:only-child { grid-column: 1 / -1; }` | `base.css:3560-3562` | C | A 1518 px la imagen ocupa 814 px y no queda hueco |
| 5 | Botón de búsqueda estable: `grid-column: 3` para borrar y `grid-column: 4` para enviar (o borrar con `visibility: hidden`) y `input[type='search']::-webkit-search-cancel-button { appearance: none; }` | `base.css:5987-6015` y `6168` | C | El botón mide 96 px con el campo vacío y con texto; una sola × |
| 6 | Limpiar la demo: despublicar los 17 `qa-*` del canal Online Store, traducir las 24 descripciones, asignar las cinco plantillas, vaciar el HTML pegado, crear las páginas FAQ, About y Policy, crear las políticas, nombre de tienda LINEA NOVE | Admin | D+A | Ningún `qa-` en `/products.json`, ningún `<style>` en `main`, ningún 404 en los enlaces |

### P1: calidad visible de gama alta

| # | Tarea | Dónde | Tipo | Aceptación |
|---|---|---|---|---|
| 7 | Modelo de scroll del cajón: `.cart-drawer__content { min-height: 0; overflow-y: auto; }`, pie con `flex-shrink: 0` y el mensaje dentro de la cabecera o como aviso que no tape acciones | `base.css:2063`, `2100`, `2315`, `2330` | C | A 1366×650, Checkout y View cart enteros y visibles |
| 8 | Carrusel táctil en la ficha móvil (`scroll-snap` más contador o puntos) y ajuste de proporción de galería (adaptar, vertical, cuadrada) | `main-product.liquid`, `base.css`, `theme.js` | C | Título y precio visibles en la primera pantalla a 390×690 |
| 9 | Lookbook: el escenario adopta la proporción de la imagen (`aspect-ratio: {{ image.aspect_ratio }}` con altura máxima) o los hotspots se calculan en coordenadas de imagen; imagen apaisada para escritorio en la demo | `lookbook.liquid`, `base.css:4189` y `4235` | C+D | Cada hotspot sobre su prenda a 390, 1280 y 1518 |
| 10 | Ajuste de cabecera fija (desactivada, siempre, al subir) con `position: sticky` en la sección; revisar que `min-height` no anule el estado condensado | `header.liquid`, `base.css:566` y `7162-7184`, `theme.js:3682` | C | La cabecera sigue en pantalla tras 1500 px y se condensa |
| 11 | Filtros en un cajón tras un botón "Filter and sort" en móvil, reutilizando el componente de cajón | `main-collection.liquid`, `base.css` | C | Primera fila de productos visible a 390×690 |
| 12 | Facetas: aplicar las casillas al cambiar (con 300 ms de espera) y dejar Apply para el precio; `id` estable en Apply y foco de respaldo en el encabezado de resultados | `main-collection.liquid:171`, `theme.js:1943-1968` | C | Tras filtrar, `document.activeElement` no es `body` |
| 13 | Miniaturas del buscador: `url.searchParams.set('width', '144')` y `srcset` de 72w, 144w y 216w | `theme.js:3293-3302` | C | Ninguna petición de imagen sin `width=` al buscar |
| 14 | Demo con variantes de talla (XS a XL) y color con muestras, de 3 a 5 imágenes por producto, hero de 2400 px o más, lookbook de 1600 px o más, sección de complementarios en la ficha y dos mercados o idiomas para enseñar la localización | Admin, `templates/product.json` | D+A | Selector, muestras, imagen secundaria, galería y selector de país visibles con productos reales |
| 15 | Bloques de ficha: contenido plegable, texto, Liquid propio y complementarios; guía de tallas activa en la plantilla | `main-product.liquid` (schema) | C | Los cuatro bloques disponibles en el editor |

### P2: pulido

| # | Tarea | Dónde | Tipo |
|---|---|---|---|
| 16 | `::placeholder` según el esquema de color con contraste ≥ 4.5:1 | `base.css` | C |
| 17 | `shopify-account:focus-within` con el mismo anillo que el resto de la cabecera | `base.css` | C |
| 18 | La cita del manifiesto como `<p>` y un encabezado de sección propio (visible o `visually-hidden`) | `brand-manifesto.liquid:19-21` | C |
| 19 | `aria-live` en las insignias de precio solo en la ficha | `snippets/price.liquid:91` | C |
| 20 | Anillo de foco de 2 px | `--focus-width` en `base.css` | C |
| 21 | Un solo newsletter en la portada de la demo | `templates/index.json` o pie | D |
| 22 | Quitar "Atelier Gift" o respaldarlo con un descuento automático; orden por defecto "Featured" en "all" | Admin | D+A |
| 23 | Documentation y Support fuera del menú principal, al pie o al menú secundario; menú principal con submenús para lucir el desplegable | Admin | D+A |

---

## 6. Lo que no se pudo comprobar en vivo

El desplegable de escritorio y la navegación con flechas (el menú no tiene submenús), el menú secundario (no configurado), las muestras de color (sin datos), modelos 3D y AR, tarjetas regalo, las cinco plantillas nativas (no asignadas o páginas inexistentes), la activación con Enter y Espacio (limitación de la herramienta) y las puntuaciones reales de Lighthouse. Cuando la demo esté limpia y las plantillas asignadas, conviene repetir esta auditoría con Lighthouse en local sobre el mismo conjunto de páginas.

Durante la prueba del carrito añadí un producto al carrito de la sesión del navegador integrado y lo vacié al terminar.
