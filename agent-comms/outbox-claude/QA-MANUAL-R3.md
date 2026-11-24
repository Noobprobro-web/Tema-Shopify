# QA manual R3 en navegador real: Sartorial, Archive e Imprint (62ce5ab)

Fecha: 2026-11-24. Auditor: Claude (QA, rol comprador y revisor del Theme Store).
Temas revisados: "Sartorial R3 (62ce5ab)" (190695473456), "Archive R3 (62ce5ab)" (190695506224), "Imprint R3 (62ce5ab)" (190695538992). Confirmé el nombre en la barra de vista previa y además con `Shopify.theme.name` en cada página antes de anotar resultados.

## Cómo se hizo

Escritorio en Claude in Chrome. La ventana no se dejó redimensionar (Chrome maximizado con escala 125 %), así que el viewport real de escritorio fue 1536 x 674 CSS px, no 1440. Para 1440 x 900 y para móvil 390 x 844 usé el navegador integrado (emulación de viewport con user agent táctil de Android). Teclado real (Tab, Shift+Tab, Enter, Escape, flechas, espacio) en Chrome, comprobando `document.activeElement` tras cada paso. Consola leída en ambos navegadores.

Incidencias del entorno que afectan a la fiabilidad:
1. Había otra sesión trabajando a la vez en el mismo perfil de Chrome. Me cerró el grupo de pestañas una vez y cambió la cookie de vista previa (una página de carrito llegó a cargar con "Archive R3" en vez de "Sartorial R3"; el carrito también es compartido). A partir de ahí añadí `preview_theme_id` a cada URL y verifiqué el tema en cada lectura. Lo que no pude volver a verificar lo marco como tal.
2. En el navegador integrado las capturas a veces salían desactualizadas o en blanco aunque el DOM estaba bien, y las teclas no siempre llegaban a la página. En móvil me apoyé en mediciones del DOM; las capturas móviles no son concluyentes.
3. El navegador integrado avisó de que una página escribió en el portapapeles del sistema durante una entrada sintética. No identifiqué qué script lo hizo (pudo ser la página de contraseña publicada o la barra de vista previa). Lo dejo anotado, sin atribuirlo al tema.

## 1. Tabla de defectos

Leyenda de preset: S = Sartorial, A = Archive, I = Imprint. "3/3" = visto en los tres.

| # | Severidad | Preset | Página y URL | Viewport e idioma | Pasos para reproducir | Resultado esperado | Resultado observado (visto / supuesto) | Captura |
|---|---|---|---|---|---|---|---|---|
| 1 | Alta | 3/3 | Portada `/?preview_theme_id=…` | 1440 y 1536, EN | Abrir la portada, recorrerla entera, medir las secciones `featured_product` y `capsule` | Si el preset incluye la ficha destacada y "complete the look", que se vean con un producto de demo o con un placeholder; si no, que no estén en el preset | **Visto:** ambas secciones existen en el DOM de los tres presets pero miden 0 px de alto y no tienen contenido. En S deja un hueco grande entre "View all new forms" y el lookbook. "Complete the look" no se pudo probar por esto | `S-desktop-home-hueco-featured-capsule` (ss_4352bt0q4) |
| 2 | Alta | S, I vistos; A supuesto | Portada, sección de colecciones curadas con pestañas | 1536, EN | Cambiar de pestaña con flechas (S: New forms / Permanent collection / Tailoring salon; I: Daily objects / Workspace / Leather goods) | Cada pestaña muestra su propia colección | **Visto:** las tres pestañas de S y las tres de I enlazan a `/collections/all` y muestran los mismos 3 productos (chaqueta pinstripe, abrigo cocoon, slip de seda). En Imprint, "Daily objects" y "Leather goods" enseñan ropa de sastrería. En A vi la primera pestaña con los mismos productos; **supongo** lo mismo en la segunda | `S-desktop-home-pestanas-identicas` (ss_2459zm0zn) |
| 3 | Media | 3/3 | Cabecera, selector de país | 1536 y 1440, EN | Mirar la cabecera de escritorio junto a "United States (USD $)" | Flecha del desplegable junto al select | **Visto:** el chevron del select (`.localization-form__country-wrapper::after`, `right: 5.6px`) cae encima del borde derecho del botón "Update preferences", porque el wrapper envuelve select y botón. El select queda sin indicador visible de desplegable | `S-desktop-header-chevron-localizacion` (zoom guardado) |
| 4 | Media | 3/3 | Portada (hero, lookbook, manifesto), mega menú, rejilla mixta de I, artículos del blog | 1536, EN | Abrir portada y menú Catalog | Imágenes de demo coherentes con el estilo de cada preset | **Visto:** el hero, el lookbook ("Silhouettes in Motion" en S, "Collection highlights" en A), el manifesto, las dos tarjetas promocionales del mega menú, las teselas "EDC systems" / "Leather goods" de I y las portadas de artículos son placeholders SVG o bloques grises | `S-desktop-home-hero-placeholder` (ss_1697fvaqr), `I-desktop-home-rejilla-placeholder` |
| 5 | Media | 3/3 (contenido de tienda) | Fichas, colección, búsqueda, blog | Todos, EN | Abrir `/products/doppio-trench`, `/blogs/news`, buscar "coat" | Contenido de demo presentable | **Visto:** vendor "Studio Demo" en fichas y tarjetas de A; descripciones "Demo product for theme preview. Replace this text with your own description."; artículos "Welcome to the demo store" y "A very long article title used to test…", autor "Demo store", etiqueta "test"; productos "Fixture …" salen en colección, búsqueda predictiva y "recently viewed". Es catálogo, no código, pero un revisor lo ve | `S-desktop-pdp-texto-demo` (ss_22308uqc4) |
| 6 | Media | 3/3 (datos) | `/products/doppio-trench`, `/products/serra-coat` | 1536 y 390, EN | En Doppio Trench elegir Stone; en Serra Coat dejar Ink | La imagen principal muestra el color elegido | **Visto:** con Stone se sigue viendo el trench negro; con Ink se ve el abrigo camel. Ninguna variante del catálogo tiene `featured_media`, así que **no se puede verificar** el cambio de imagen por variante del tema. Precio, URL `?variant=`, disponibilidad y botón sí se actualizan bien | `S-desktop-pdp-stone-muestra-negro` (ss_9969f0snt) |
| 7 | Baja | S visto | Búsqueda predictiva (cabecera) | 1536, EN | Abrir buscador, escribir "tailoring" | Un solo rótulo de grupo | **Visto:** aparece el encabezado "COLLECTIONS" y, debajo, cada resultado lleva otra vez la etiqueta "COLLECTIONS" (en plural, para un solo resultado). Además el `h2` del grupo tiene `role="presentation"` y pierde su semántica de encabezado | `S-desktop-predictiva-collections-duplicado` (ss_7609yisio) |
| 8 | Baja | S visto | Página `/cart` | 1536, EN | Con 3 líneas, pulsar "+" con Enter | Comportamiento coherente con el cajón (el cajón actualiza en vivo) | **Visto:** la cantidad pasa a 2 pero el subtotal y el carrito no cambian hasta pulsar "Update cart", que recarga la página entera y deja el foco en `body`. Sin aviso de que hay cambios pendientes | sin captura (verificado con `/cart.js`) |
| 9 | Baja | S visto | `/search?q=size` | 1536, EN | Buscar desde la cabecera y pulsar Enter | La búsqueda general incluye artículos o la pestaña "All" aparece activa | **Visto:** sin `type`, la página marca "Products" como actual y no lista el artículo "How to read the size chart". Solo aparece al pulsar "All" (`type=product,article,page`) | `S-desktop-busqueda-products-por-defecto` (ss_6207elf8k) |
| 10 | Baja | S visto | 404 `/blogs` o `/nope-404` | 1536, EN | Abrir una URL inexistente | Placeholder legible y titular natural | **Visto:** el campo de búsqueda es tan estrecho que el placeholder se corta en "Search products and"; el titular "POPULAR PIECES / CONTINUE EXPLORING" se lee como dos rótulos pegados | `S-desktop-404-placeholder-cortado` (ss_5209txoue) |
| 11 | Baja | S visto | `/products/gift-card` | 1536, EN | Abrir la tarjeta regalo | Sin bloques de cuidado de prenda | **Visto:** muestra el acordeón "Care" con texto sobre materiales y acabados. Probablemente plantilla compartida; convendría una plantilla `product.gift-card` en el preset | sin captura |
| 12 | Baja | S visto | Cajón de carrito | 1536, EN | Añadir Doppio Trench (en oferta) | Precio tachado coherente con la ficha | **Visto:** la línea solo muestra $945.50, sin el compare-at $1,190.00 que sí aparece en ficha, tarjeta y predictiva | `S-desktop-cajon-sin-tachado` (ss_6496itrm8) |
| 13 | Baja | S visto | Cajón de carrito vacío | 1536, EN | Eliminar la última línea con Enter | Mensaje de estado limpio | **Visto:** queda visible "Removed Doppio Trench - Stone / XS from your cart. 0 items" encima de "Your cart is currently empty." (texto redundante y visible; el foco sí va correctamente al mensaje de vacío) | `S-desktop-cajon-vacio-mensaje` (ss_5177zz3gr) |
| 14 | Baja | 3/3 | Textos | Todos, EN | Leer cabecera, mega menú, portadas | Rótulos coherentes en mayúsculas/minúsculas y sin jerga | **Visto:** mezcla de Title Case ("New Arrivals", "Explore Catalog", "Capsule Wardrobe", "Archive Entries", "Studio Modular Systems", "Curated Archival Garments") con sentence case ("New forms", "Permanent collection"). En I, "Membrane telemetry", "Blueprint analysis", "System inventory", "Inspect system inventory" suenan a jerga interna. Footer genérico: "Store updates / Subscribe to our newsletter." El logo de texto es "Sartorial Theme" en los tres presets | ver capturas de portada |
| 15 | Baja | S visto (390) | `/collections/all` | 390, táctil, EN | Abrir colección en móvil | Acceso a quick add o a "Choose options" coherente | **Visto:** en táctil no se renderiza ningún botón de quick add; solo una tarjeta (Cropped Tailored Jacket) muestra "Choose options". **Supongo** que es intencional (hover), pero queda incoherente entre tarjetas | sin captura fiable (pane) |
| 16 | Baja (configuración de tienda) | S visto | Cualquier ficha con mercado Canadá | 390, EN | Navegar con país Canada (asignado por geolocalización) | Productos disponibles | **Visto:** con Canada todos los productos salen "Sold out" y los precios bajan un 5 % (Doppio $898.23 / $1,130.50). Con United States todo vuelve a la normalidad. No es del tema, pero un revisor fuera de EE. UU. vería la tienda agotada | sin captura fiable (pane) |

No reproducido: en Chrome medí una vez `scrollWidth 1536 > clientWidth 1521` en `/cart` con Archive, pero fue durante el cambio de cookie causado por la otra sesión. Lo repetí en Archive a 1440, 1536 y 390 con 1 y 3 líneas y no hay desborde. No lo cuento como defecto.

## 2. Lo que funciona bien

No vi ningún "Liquid error" ni "Translation missing", y no hay desborde horizontal a 390 ni a 1440 en portada, colección, ficha (título largo, 18 y 40 variantes), carrito, búsqueda, blog, artículo, 404 y contraseña, en los tres presets. Chrome no registró errores de JavaScript del tema; los únicos errores en consola eran 404 esperados y un CSP de shop.app (componente de cuenta de Shopify). En cabecera, el skip link, el mega menú (Enter abre, Escape cierra y devuelve el foco a "Catalog", con `aria-expanded` correcto) y el menú móvil (foco atrapado, Escape devuelve al botón) funcionan bien, y el foco es visible en todos los controles. La búsqueda predictiva es un combobox con `aria-activedescendant`, mantiene el foco dentro, Escape devuelve al disparador y cerrar y reabrir mientras carga conserva la consulta y los resultados. En los filtros, el foco se queda en el checkbox al aplicar; al quitar el filtro va al contador de productos; un precio por encima del máximo se ajusta a 2800 sin romper nada. En la ficha, el cambio de variante con flechas actualiza precio, URL, disponibilidad, botón y etiquetas "Option unavailable". El lightbox atrapa el foco y lo devuelve al cerrar, y el 3D y el vídeo cargan con controles y textos alternativos. En el cajón, añadir lleva el foco a Cerrar; tras "+", escribir cantidad o eliminar, el foco se queda en el control (o va al mensaje de vacío), los anuncios `aria-live` son correctos y Escape devuelve el foco a "Add to cart". También funcionan bien el formulario de destinatario de la tarjeta regalo, las pestañas de la portada (patrón tablist con flechas), el botón de pausa del marquee (cambia su etiqueta Pause/Play), el blog (el destacado no se repite en la rejilla y el filtro por etiqueta marca `aria-current`) y el diálogo de contraseña (foco atrapado y devuelto).

## 3. Lo que no pude probar y por qué

1. "Complete the look" y la ficha destacada de portada: las secciones salen vacías (defecto 1).
2. Slideshow: ninguno de los tres presets lo incluye en portada.
3. Cambio de imagen por variante: el catálogo no tiene imágenes asignadas a variantes (defecto 6).
4. Guía de tallas y texto de reglas de cantidad: ningún producto los tiene (revisé el HTML de las 45 fichas).
5. Barra de envío gratis, regalo y nota del pedido: no aparecen ni en el cajón ni en `/cart` de S. **Supongo** que están desactivados en ajustes; no entré al admin para confirmarlo.
6. Paginación del blog: solo hay 3 artículos.
7. Envío de newsletter, pago y checkout: fuera de los límites. Solo validé el campo (tipo email, `required`, etiqueta accesible).
8. Teclado completo en móvil, Archive e Imprint: el navegador integrado no entregaba bien las teclas y Chrome compartía sesión con otro agente. En A e I solo hice render, desbordes, contenido, cambio de variante con flechas (Imprint, Leather Desk Mat: $260 a $310 correcto) y consola.
9. Capturas móviles: en el navegador integrado salían en blanco o desactualizadas, así que no las uso como evidencia.
10. Viewport exacto de 1440 en Chrome: la ventana no se pudo redimensionar (ver "Cómo se hizo").

## 4. Veredicto

Hoy no pasaría la revisión del Theme Store. Lo que veo en el navegador indica que el código funciona: accesibilidad de teclado, gestión del foco, ausencia de errores y responsive están a buen nivel. Lo que lo frena es sobre todo cómo se presentan los presets:
1. Secciones de portada que salen vacías en los tres presets (defecto 1).
2. Pestañas curadas que enseñan el mismo contenido, incoherente con el preset en Imprint (defecto 2).
3. Hero, lookbook y teselas sin imágenes (defecto 4).
4. Texto de demo y productos "Fixture" visibles (defecto 5).
5. El chevron del selector de país pisando el botón (defecto 3), visible en todas las páginas.
6. En la ficha de producto, el botón "Add to cart" queda fuera de pantalla en ventanas de escritorio de poca altura (N1, hallado en la verificación en pantalla real). Es el defecto de código más importante de esta ronda.

Supuesto: con 1 a 4 resueltos en los JSON de los presets y en el catálogo de la tienda demo, más el arreglo de CSS del 3, la revisión debería centrarse ya en detalles menores (7 a 15).

## Verificación en pantalla real (uso del ordenador)

Fecha: 2026-11-24, de 19:09 a 19:17 (hora del equipo). Las capturas de evidencia son del escritorio real (uso del ordenador, Chrome en modo solo lectura). La navegación, los clics y las mediciones se hicieron con Claude in Chrome en una pestaña nueva. Las capturas no se guardaron como archivo; las cito por hora y contenido ("CU 19:12 cajón").

**Viewport real**
1. Escritorio: 1536 x 674 CSS px. La ventana de Chrome está maximizada en una pantalla de 1920 x 1080 al 125 %, y `resize_window` no tuvo efecto (`innerWidth` siguió en 1536).
2. 1440: ventana emergente abierta desde la pestaña y redimensionada por script a `innerWidth` 1440 (`clientWidth` 1425 con barra de desplazamiento). La altura quedó en 688 px por el tamaño de la pantalla.
3. 390: misma ventana emergente con `innerWidth` 390 (`clientWidth` 375 por la barra de desplazamiento de escritorio). Puntero de ratón, **no táctil** (`hover: none` = false). No pude abrir DevTools ni emular táctil.
4. La barra de vista previa de Shopify y el aviso "Claude empezó a depurar este navegador" tapan parte de la ventana. Ninguno de los dos es del tema.

**Comprobación de tema:** cada URL llevaba `preview_theme_id`, y antes de cada anotación comprobé que `Shopify.theme.name` daba el preset esperado. No hubo cambio de cookie ni otra sesión trabajando durante esta pasada.

| # | Estado | Preset | Qué vi en pantalla | Captura |
|---|---|---|---|---|
| 1 | Distinto | S, I (featured_product + capsule); A (solo featured_product) | **Visto:** las secciones miden 0 px y están vacías. Pero en S están **después** del lookbook, no entre "View all new forms" y el lookbook, y no dejan hueco: el paso lookbook → manifesto es limpio. El espacio entre "View all new forms" y el lookbook (96 px) es el espaciado normal entre secciones. Archive no tiene sección `capsule`. El defecto real es que la ficha destacada y "complete the look" no se ven en ningún preset, no un hueco | CU 19:10 S portada (zona del lookbook y del manifesto) |
| 2 | Confirmado (A visto) | 3/3 | **Visto:** S "Tailoring salon", A "Selected pieces" (A solo tiene 2 pestañas) e I "Daily objects" muestran la chaqueta pinstripe, el abrigo cocoon y el slip. Todas las pestañas enlazan a `/collections/all` | CU 19:11 S, A e I pestañas |
| 3 | Confirmado | 3/3 | **Visto** con zoom a 1536 y en la emergente de 1440: el chevron queda dentro del borde derecho de "UPDATE PREFERENCES" | CU 19:10 zoom de la cabecera |
| 4 | Confirmado | 3/3 | **Visto:** hero con dibujo SVG de placeholder en S y A; manifesto de S con placeholder; teselas de I "Collection, product, process" con placeholder; tarjetas del mega menú ("New Arrivals", "Capsule Wardrobe") como bloques beis lisos; portadas del blog como bloques grises | CU 19:10, 19:11, 19:17 |
| 5 | Confirmado | 3/3 | **Visto:** "STUDIO DEMO" también encima del título de la ficha en S, A e I (no solo en las tarjetas de A); "Demo product for theme preview…"; "Fixture Long Title…" y "Fixture Many Variants Jacket" en la predictiva; "Welcome to the demo store" en el blog; tarjeta regalo con "This is a gift card for the store" | CU 19:12 ficha, 19:14 predictiva, 19:17 blog |
| 6 | Confirmado | S | **Visto:** Doppio con Stone muestra el trench negro (también en la miniatura del cajón); Serra con Ink muestra el abrigo camel | CU 19:12, 19:17 |
| 7 | Confirmado | S | **Visto:** el rótulo "COLLECTIONS" y, debajo, otra vez "COLLECTIONS" sobre "Tailoring". Los dos `h2` (Products y Collections) tienen `role="presentation"` | CU 19:14 predictiva |
| 8 | Confirmado | S | **Visto:** tras "+" en Serra, el campo pasa a 2 pero el subtotal sigue en $3,806.00 y la cabecera en "4 items"; `/cart.js` sigue en 1. "Update cart" recarga la página (5 items, $3,780.00 en la línea) y deja el foco en `BODY` con `scrollY` 0 | CU 19:13 y 19:14 /cart |
| 9 | Confirmado | S | **Visto:** `/search?q=size` con la pestaña "Products" activa (`aria-current=page`); el artículo "How to read the size chart" no aparece | CU 19:14 búsqueda |
| 10 | Confirmado (solo escritorio) | S | **Visto** a 1536: el placeholder se corta en "Search products and" (campo de 139 px) y el rótulo dice "POPULAR PIECES / CONTINUE EXPLORING". A 390 el placeholder sale completo | CU 19:14 404; 390 en la emergente |
| 11 | Confirmado | S | **Visto:** el acordeón "CARE" con el texto de materiales y acabados en `/products/gift-card` | CU 19:14 tarjeta regalo |
| 12 | Confirmado | S | **Visto:** la línea de Doppio Stone/XS en el cajón solo dice $945.50; la ficha muestra $945.50 junto a $1,190.00 tachado. En `/cart`, Doppio Black/S (x2) tampoco tiene tachado | CU 19:12 cajón |
| 13 | Confirmado | S | **Visto:** "Removed Doppio Trench - Stone / XS from your cart. 0 items" encima de "Your cart is currently empty." y "CONTINUE SHOPPING" | CU 19:13 cajón vacío |
| 14 | Confirmado | 3/3 | **Visto:** "New Arrivals" y "Capsule Wardrobe" junto a "New forms" en el mega menú; "Archive Entries" (A); "Studio Modular Systems" y "System inventory" (I); el logo "Sartorial Theme" en los tres. A 390 el logo ocupa dos líneas | CU 19:11, 19:15 |
| 15 | Distinto | S (390, puntero de ratón) | **Visto:** las 24 tarjetas tienen botón ("Add to cart", "Quick add" o "Choose options", según las variantes). Con puntero fino, `.product-card__action` tiene `opacity: 0` hasta hover, regla dentro de `(hover: hover) and (pointer: fine)`, así que ocupa 44 px en blanco bajo el precio. **Supuesto:** en táctil la regla no aplica y el botón se vería. No pude emular táctil, así que no confirmo ni descarto lo que se vio en el pane | CU 19:15 emergente 390 |
| 16 | No verificado | — | Chrome estaba en United States. No cambié a Canada para no alterar el mercado ni la moneda del carrito compartido | — |
| No reproducido | Se mantiene | A | **Visto:** en Archive `/cart`, `scrollWidth` = `clientWidth` a 1440 (1425) y a 390 (377), con 3 líneas. Sin desborde en pantalla | CU 19:17 emergente |

### Defectos nuevos

| # | Severidad | Preset | Página y URL | Viewport e idioma | Pasos para reproducir | Resultado esperado | Resultado observado (visto / supuesto) | Captura |
|---|---|---|---|---|---|---|---|---|
| N1 | Media | 3/3 | `/products/doppio-trench` | 1536 x 674 y 1440 x 688, EN | Abrir la ficha y hacer scroll por la galería | "Add to cart" visible o alcanzable sin recorrer toda la galería | **Visto:** la columna de detalles es sticky (`.product-main__details`, `top: 101px`) y mide 876 px en S, 897 en A y 892 en I, más que el viewport. El botón queda fijo en `top` 695 px (S), fuera de pantalla, mientras se recorre una galería de 9.642 px. Solo aparece al llegar al final, unos 8.500 px de scroll después. En la emergente de 1440 x 688 pasa igual. **Supuesto:** afecta a cualquier ventana de escritorio de menos de unos 740 px de alto, que es habitual en portátiles de 1366 x 768 o con escalado del 125 %. A 390 no pasa (el botón está en el flujo normal) | CU 19:12 S ficha; CU 19:16 emergente 1440; CU 19:17 I ficha |
| N2 | Baja | S | Cualquier página con `?q=` (p. ej. `/search?q=size`) | 1536, EN | Abrir el buscador de la cabecera y escribir | El texto previo seleccionado o el cursor al final | **Visto:** el diálogo se abre con "size" ya escrito y el cursor en la posición 0 (`selectionStart` = `selectionEnd` = 0). Al escribir "tailoring" queda "tailoringsize" | CU 19:14 predictiva |

### ¿Cambia el veredicto?

No cambia el resultado: hoy no pasaría la revisión del Theme Store. Sí cambian tres cosas:
1. N1 es un defecto de código en la ficha de producto de los tres presets y pasa a la lista de bloqueantes. Ya lo añadí como punto 6 del veredicto principal.
2. El defecto 1 no deja hueco visible. Sigue siendo un problema de preset porque la ficha destacada y "complete the look" no se ven.
3. El defecto 15 no se reproduce con ratón y no se pudo probar en táctil.

Los defectos 2 a 14 quedan confirmados en pantalla real.

### Incidencias del entorno en esta pasada
1. La primera pestaña creada quedó en segundo plano detrás de una pestaña de YouTube del usuario, en la misma ventana, así que la pantalla real no mostraba la tienda. La cerré y creé otra; a los 30 s la pestaña del grupo "Auditoría QA" quedó al frente. No hice clic en la interfaz de Chrome.
2. `resize_window` no funciona con la ventana maximizada. Para 1440 y 390 usé una ventana emergente abierta con un clic real en un botón temporal que inyecté en la página (solo en mi pestaña, sin tocar el tema). La emergente mostró una vez el globo de Google Translate de Chrome, que no es del tema.
3. Carrito compartido: al empezar tenía Doppio Black/S x2, Gift Card $25 y Serra Ink/XS. Para probar el cajón vacío los quité y luego los repuse por `/cart/add.js` (las mismas cantidades, en otro orden). La línea Doppio Stone/XS que añadí ya no está. Serra pasó a 2 en la prueba de `/cart` y volvió a 1.
4. No hizo falta la contraseña del escaparate (la cookie ya existía). No entré al admin, no cambié de mercado, no envié formularios de newsletter ni de pago y no disparé diálogos del navegador.
5. No vi interferencias de otra sesión: `Shopify.theme.name` coincidió siempre con el `preview_theme_id` pedido.
