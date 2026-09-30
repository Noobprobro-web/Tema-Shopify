# CLAUDE-REPORT-AUDIT-FINAL-002: Auditoría técnica en vivo de las 3 tiendas demo

```text
ID: CLAUDE-REPORT-AUDIT-FINAL-002
De: Claude (Opus 5.5 Extra) · Implementador Principal y Auditor Técnico
Para: Gemini Flash 3.8 High (orquestador) · Johandry / Ruiz Digital
Responde a: agent-comms/inbox-claude/CLAUDE-DIRECTIVE-AUDIT-FINAL-002.md
Fecha: 2026-09-30
Estado: ENTREGADO. Auditoría de solo lectura: no se modificó ningún archivo del tema ni ninguna tienda.

Decisión requerida:
  Gemini   → autorizar un sprint corto de corrección con los parches P-01 a P-07 (Nivel 1, ya escritos;
             P-01, P-02, P-03 y P-05 además validados en navegador) y decidir P-08b y T-09 (Nivel 2).
  Johandry → completar el contenido de las demos (D-01 a D-04) y borrar las bases de datos de Chrome
             copiadas en scratch/ (X-01).

Resumen en 5 líneas:
  1. Veredicto: BLOQUEANTES DETECTADOS. Un solo bloqueante técnico (T-01): el foco de teclado es invisible
     sobre fotografía oscura en la galería de la ficha (Archive) y en los hotspots del lookbook.
  2. Lo demás pasa: 0 px de desbordamiento a 375/768/1440, axe 0 violaciones en 63 estados, Lighthouse
     accesibilidad 100 en 18/18, rendimiento medio 76 / 89 / 84, trampas de foco sin fugas, carrito coherente.
  3. Cuatro hallazgos de severidad media con parche de una a seis líneas: CLS al hacer scroll rápido en la
     ficha, marquesina que desborda con "reducir movimiento", LCP con loading=lazy en rejillas y un error
     no capturado al saltar al checkout.
  4. Las demos no ejercitan media docena de funciones del tema (tallas, agotado, oferta, galería de varias
     imágenes, mega menú, nota de pedido, guía de tallas): no se pudieron auditar en vivo y el revisor tampoco
     las verá.
  5. Todos los números salen de 22 scripts (más lib.mjs) y sus salidas crudas en harness-AUDIT-FINAL-002/.

Archivos tocados:
  agent-comms/outbox-claude/CLAUDE-REPORT-AUDIT-FINAL-002.md (este informe)
  agent-comms/outbox-claude/harness-AUDIT-FINAL-002/ (23 archivos .mjs, salidas results-*, 15 capturas)
  Ningún archivo de assets/, sections/, snippets/, layout/, templates/, config/, locales/ ni docs/.

Desviaciones (Nivel 1 o Nivel 2): ninguna. No hay implementación.

Hallazgos extra fuera de alcance (con parche listo): X-01 a X-03, sección 6.

Verificación (comando, resultado y qué demuestra / qué no): sección 7.

Lista de afirmaciones falsables numeradas: sección 8 (A1 a A16).

Filas del ledger: no se cierra ni se edita ninguna. Los hallazgos contradicen evidencia de filas hoy en
`cumplido`: 47 y 48 (T-01), 37 (T-02), 55 (T-03), 36 (T-04). Gemini decide si bajan a `código completo`
hasta que se desplieguen los parches.
```

---

## 1. Veredicto técnico formal

**BLOQUEANTES DETECTADOS** (1 bloqueante técnico, 4 hallazgos medios, 9 bajos).

El bloqueante es **T-01**: en la ficha de producto de Archive el primer elemento enfocable del contenido (la imagen de la galería, que abre el zoom) no muestra ningún indicador de foco, y en el lookbook de Atelier y Archive el anillo de foco de los hotspots apenas se distingue. El requisito 12 de la Theme Store lo pide de forma literal ("focusable elements must feature a visible focus state") y basta un recorrido con el tabulador por esa ficha para verlo. Ni axe ni Lighthouse lo detectan: las dos herramientas dan la página por buena. Se corrige con dos reglas CSS (P-01), ya probadas en el navegador sobre la tienda real.

Con T-01 corregido, el tema queda en **APTO CON OBSERVACIONES** en lo técnico. Los umbrales formales de Lighthouse de la Theme Store (rendimiento ≥ 60 y accesibilidad ≥ 90 de media entre home, colección y producto, móvil y escritorio) se cumplen hoy en las tres tiendas.

Este veredicto cubre solo los cuatro ejes de la directiva. Los bloqueos comerciales que GPT documenta en `GPT-AUDIT-015` (pasarela de pago sin activar, URLs de documentación y soporte en 404, fotografía de producto incongruente) siguen abiertos y tampoco permiten el envío.

---

## 2. Matriz de verificación técnica

Leyenda: ✔ pasa · ✖ falla · ◐ pasa con reserva · n/e no ejercitable en esa demo (la función existe en el tema pero la tienda no la tiene configurada).

### Eje 1. Accesibilidad (WCAG 2.2 AA)

| Comprobación | Atelier | Edition | Archive |
|---|---|---|---|
| Recorrido con Tab en la home, 375 y 1440 px: paradas del tema / mismas paradas con Shift+Tab | ✔ 41 y 43 / iguales | ✔ 47 y 49 / iguales | ✔ 35 y 37 / iguales |
| Orden de foco = orden del DOM (saltar → anuncio → cabecera → secciones → pie) | ✔ | ✔ | ✔ |
| Paradas sin indicador de foco declarado / tapadas ≥ 50 % por la cabecera fija | ✔ 0 / 0 | ✔ 0 / 0 | ✔ 0 / 0 |
| Contraste mínimo del anillo sobre fondo sólido (mínimo 3:1) | ✔ 13.95:1 | ✔ 11.14:1 | ✔ 7.58:1 |
| **Anillo de foco sobre fotografía: imagen de la galería de la ficha** | ✔ mediana 8.85 a 14.06:1 | ✔ 12.87 a 17.02:1 | **✖ mediana 1.16:1 a 1440 px; 95 % del anillo por debajo de 3:1 (T-01)** |
| **Anillo de foco sobre fotografía: hotspots del lookbook** | **✖ mediana 1.77 a 4.48:1; 37 a 81 % por debajo de 3:1 (T-01)** | n/e (sin lookbook) | **✖ mediana 1.25 a 1.97:1; 67 a 100 % por debajo de 3:1 (T-01)** |
| Trampa de foco del menú móvil (30 Tab + 30 Shift+Tab, Escape) | ✔ 0 fugas, foco vuelve, `aria-expanded` true→false | ✔ ídem | ✔ ídem |
| Trampa del drawer de carrito, vacío y con artículos | ✔ 0 fugas, foco vuelve al icono; fondo `inert` | ✔ ídem | ✔ ídem |
| Trampa del zoom de la ficha (`<dialog>` nativo) | ✔ 0 fugas, foco vuelve a la imagen | ✔ ídem | ✔ ídem |
| Trampa de la búsqueda predictiva y del popover del lookbook | ✔ / ✔ | ✔ / n/e | ✔ / ✔ |
| Modal de guía de tallas | n/e | n/e | n/e |
| Añadir al carrito con teclado: drawer abre, foco dentro, Escape devuelve el foco al botón | ✔ | ✔ | ✔ |
| Región viva al añadir (`role="status"`, `aria-live="polite"`, visible, no inerte) | ✔ "Item added to your cart. Serra Coat" | ✔ incluye la variante | ✔ incluye la variante |
| Región viva al cambiar de variante | n/e (sin variantes) | ✔ "Deep olive / Compact: Variant available." | n/e (un solo valor por opción) |
| Error de carrito anunciado (`role="alert"`) | ✔ al pedir 999 | ✔ al pedir 999 | ✔ al pedir 2 de una pieza única |
| Búsqueda predictiva como combobox (`aria-expanded`, `aria-activedescendant`, recuento anunciado) | ✔ 7 opciones, 1 petición por 4 pulsaciones | ✔ 8 opciones, 1 por 7 | ✔ 1 opción, 1 por 4 |
| Pestañas del showcase (tabindex itinerante, flechas, Home, `aria-selected`, panel oculto sincronizado) | ✔ | ✔ | ✔ |
| Texto sobre imagen (hero con `scrim`/`gradient_content`, etiqueta del manifiesto): peor píxel | ✔ 5.24:1 (15 muestras) | ✔ 16.87:1 (3 muestras; su hero es partido, sin texto sobre foto) | ✔ 5.35:1 texto normal, 4.74:1 titular grande (15 muestras) |
| axe-core 4.10.2, etiquetas WCAG 2.0 a 2.2 A y AA, 21 estados por tienda | ✔ 0 violaciones | ✔ 0 | ✔ 0 |
| Lighthouse 13.5 accesibilidad, 6 pasadas por tienda | ✔ 100 en las 6 | ✔ 100 en las 6 | ✔ 100 en las 6 |
| Objetivos táctiles menores de 24 × 24 px sin holgura (2.5.8) | ✔ 0 | ✔ 0 | ✔ 0 |
| `lang`, un solo `h1`, sin saltos de encabezado, skip link operativo, zoom no bloqueado | ✔ | ✔ | ✔ |
| `prefers-reduced-motion`: sin animaciones en curso, scroll sin suavizado | ✔ | ✔ | ✔ |

### Eje 2. Disciplina responsiva y estados límite

| Comprobación | Atelier | Edition | Archive |
|---|---|---|---|
| `scrollWidth − clientWidth` a 375, 768 y 1440 px, tras carga y tras recorrer la página (10, 10 y 9 rutas por viewport) | ✔ 0 px en 30 mediciones | ✔ 0 px en 30 | ✔ 0 px en 27 |
| El 0 no está enmascarado: `overflow-x` de `html` y `body` | ✔ `visible` | ✔ `visible` | ✔ `visible` |
| Reflow a 320 px (WCAG 1.4.10) en home, colección, ficha y carrito | ✔ 0 px | ✔ 0 px | ✔ 0 px |
| **Reflow a 320 px con "reducir movimiento" activo** | **✖ 4 px en la home (T-03)** | ✔ 0 px (sin marquesina) | **✖ 36 px en la home (T-03)** |
| Títulos y proveedores hostiles inyectados (156 caracteres con espacios y 92 sin espacios) en 16 a 18 componentes, 375/768/1440 | ✔ 98 inyecciones, 0 desbordes, recortes o solapes | ✔ 110, 0 | ✔ 110, 0 |
| Cápsula sin productos no emite nodos | ✔ por código (`complete-the-look.liquid:62`); la cápsula está poblada | ✔ ídem | ✔ la sección no está en la plantilla: 0 nodos |
| "Vistos recientemente" en primera visita | ✔ `hidden`, contenedor de 0 px, sin margen ni borde | ✔ ídem | ✔ ídem |
| Recomendaciones antes de cargar | ◐ contenedor de 1 px a propósito (`base.css:4857`); origen de T-02 | ◐ ídem | ◐ ídem |
| Cantidad inválida en la ficha (0, −3, 1.5, vacío) | ✔ validación nativa, 0 peticiones, foco al campo | ✔ ídem | ✔ ídem |

### Eje 3. Rendimiento y Core Web Vitals

| Comprobación | Atelier | Edition | Archive |
|---|---|---|---|
| Imagen del hero: `fetchpriority="high"`, `loading="eager"`, `srcset`, `sizes`, `width`/`height` | ✔ `sizes="100vw"` | ✔ `sizes="(min-width: 62rem) 50vw, 100vw"` | ✔ `sizes="100vw"` |
| Elemento LCP de la home | ✔ la imagen del hero | ✔ imagen del hero (≥ 768 px); el `h1` a 375 px | ✔ la imagen del hero |
| Imágenes sin `width`/`height`, sin `alt` o sin `srcset` | ✔ 0 / 0 / 0 | ✔ 0 / 0 / 0 | ✔ 0 / 0 / 0 |
| Imágenes bajo el pliegue con `loading="lazy"` | ◐ todas menos la del producto destacado, que además lleva `fetchpriority="high"` a y ≈ 2 900 a 3 900 px (T-06) | ◐ ídem | ◐ ídem |
| **Imagen LCP con `loading="lazy"` en colección, lista de colecciones, búsqueda y 404** | **✖ (T-04)** | **✖ (T-04)** | **✖ (T-04)** |
| CLS de carga, sin interacción, 87 mediciones | ✔ 0 a 0.0015 | ✔ 0 a 0.0132 | ✔ 0 a 0.0311 |
| CLS de Lighthouse | ✔ 0 a 0.0425 | ✔ 0 a 0.0136 | ✔ 0 a 0.0323 |
| CLS al abrir menú, carrito, zoom y popovers | ✔ sin desplazamientos (capas fijas) | ✔ | ✔ |
| **CLS en la ficha con scroll de rueda real, tema sin parchear** | **✖ 0.36 a 0.39 en 3 de 4 pasadas rápidas; 0 a 0.02 a ritmo de lectura (T-02)** | **✖ 0.38 a 0.83 en 3 de 6 rápidas; 0.08 a ritmo de lectura en móvil (T-02)** | **✖ 0.37 a 0.77 en 3 de 4 rápidas (T-02)** |
| Lighthouse rendimiento móvil: home / colección / producto | 55 / 57 / 76 | 82 / 76 / 83 | 63 / 79 / 71 |
| Lighthouse rendimiento escritorio: home / colección / producto | 91 / 83 / 96 | 99 / 94 / 99 | 99 / 99 / 91 |
| **Media de rendimiento (umbral Theme Store 60)** | ✔ **76** | ✔ **89** | ✔ **84** |
| Errores JavaScript no capturados en páginas del tema | ✔ 0 | ✔ 0 | ✔ 0 |
| **Error no capturado al pasar de la tienda al checkout** | **✖ `InvalidStateError` (T-05)** | **✖ 2 de 2** | **✖ 1 de 1** |
| Dependencias externas del tema | ✔ 0. Solo hosts de Shopify | ✔ 0 | ✔ 0 |
| Scripts bloqueantes del tema / estilos en `<body>` | ✔ 0 / 0 (`theme.js` con `defer`) | ✔ 0 / 0 | ✔ 0 / 0 |
| Peso servido del tema (minificado por Shopify, comprimido) | `base.css` 21.4 KB, `theme.js` 23.8 KB, `product-zoom.js` 3.2 KB | igual | igual |
| Fuentes | ✔ `font-display: swap` | ✔ | ✔ |

### Eje 4. Flujo transaccional

| Comprobación | Atelier | Edition | Archive |
|---|---|---|---|
| Cambio de variante: `id`, `?variant=`, precio, inventario, barra fija y región viva | n/e: los 24 productos tienen una sola variante | ✔ 50 a 86 ms en 7 cambios; $680 → $580 al pasar a Compact; las 4 fichas clave | n/e: una opción con un solo valor |
| Flechas dentro del grupo de radios | n/e | ✔ | ✔ (grupo de un radio) |
| Variante agotada o no disponible | n/e | n/e: 0 variantes agotadas en el catálogo | n/e |
| Indicador de inventario | ✔ "In stock, ready to ship" | ✔ ídem | ✔ "Low stock: 1 left" |
| Producto destacado de la home: variante y añadir | ✔ añade | ✔ cambia el `id` sin tocar la URL y añade | ✔ añade |
| Añadir producto simple → drawer, contador, subtotal, etiqueta accesible | ✔ DOM = `/cart.js` | ✔ | ✔ |
| Botón + una vez | ✔ 1 → 2 | ✔ 1 → 2 | ✔ rechazado con aviso (pieza única) |
| Ráfaga de 4 clics en + | ✔ DOM 5 = API 5 (un clic cae mientras el formulario está ocupado) | ✔ DOM 6 = API 6 | ✔ DOM 1 = API 1; las respuestas 422 se absorben sin desincronizar |
| Cantidad tecleada (2 y 999) | ✔ 2; 999 → 25 con "Only 25 items were added…" | ✔ ídem | ✔ se queda en 1 con el aviso |
| Eliminar línea | ✔ estado vacío, foco al botón Cerrar | ✔ | ✔ |
| Bundle completo (3 piezas) y total reactivo al desmarcar | ✔ $2,250 → $1,100 → añade 3 líneas | ✔ $620 → $250 → añade 3 líneas | n/e (sin cápsula) |
| Nota de pedido | n/e: `show_cart_note` = false | n/e | n/e |
| Botón Checkout del drawer | ✔ llega a `/checkouts/…` | ✔ | ✔ |
| Buy it now | ✔ llega al checkout | ✔ | ✔ |
| Página `/cart` | ✔ líneas, subtotal y checkout | ✔ | ✔ |
| **Enter dentro del campo de cantidad del drawer** | ◐ aplica la cantidad pero saca al comprador a `/cart` (T-07) | ◐ ídem | ◐ ídem |
| **Cantidad de la ficha frente al stock** | ✔ | ✔ | ◐ deja elegir 3 de una pieza única y muestra "Total for 3 … $4,500.00" (T-09) |

El pago en sí no entra en esta auditoría: se comprobó que se llega a la pantalla de checkout, no que se pueda pagar. `GPT-AUDIT-015` H1 documenta que las tres tiendas muestran "This store can't accept payments right now".

---

## 3. Tabla de hallazgos

Las citas `archivo:línea` son del árbol local. El código desplegado es el mismo: los tres temas sirven `base.css`, `theme.js` y `product-zoom.js` con idéntico tamaño (153 498, 124 270 y 9 241 bytes) y contienen los marcadores buscados (`results-07-parity-catalog.json`).

### Alta / Bloqueante

| ID | Tienda | Componente y localizador | Comportamiento observado | Recomendación |
|---|---|---|---|---|
| **T-01** | Archive (ficha), Atelier y Archive (lookbook) | Indicador de foco sobre fotografía. `assets/base.css:261-264` (`:focus-visible`, un solo color), `:8009-8011` (`.product-gallery__zoom-trigger:focus-visible`, `outline-offset: -3px`), `:4232-4251` (`.lookbook-hotspot__trigger`). URLs: `sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket` y la sección Lookbook de las home de Atelier y Archive. | El anillo es de 2 px en el color de primer plano del esquema (oscuro) y se pinta directamente sobre la foto. Sobre imagen oscura desaparece. Midiendo los píxeles que cambian al enfocar: en la galería de Archive a 1440 px la mediana de contraste anillo/foto es 1.16:1 y el 95 % queda por debajo de 3:1; en los hotspots de Archive, mediana 1.25 a 1.97:1 y 67 a 100 % por debajo; en los de Atelier, 1.77 a 4.48:1 y 37 a 81 %. Capturas: `evidence/archive-pdp-zoom-trigger-focus.png` (no se ve nada) y `evidence/archive-lookbook-hotspot-focus.png`. En Edition y en la galería de Atelier pasa porque las fotos son claras: depende de la imagen del comerciante. Incumple WCAG 2.4.7 y 1.4.11 y el requisito 12 de la Theme Store. | Anillo de dos tonos en los controles que viven sobre una imagen (P-01): el contorno oscuro queda entre dos bandas del color de fondo y contrasta sobre cualquier foto. Probado en Archive: `evidence/archive-pdp-zoom-trigger-focus-PARCHE.png` y `evidence/archive-lookbook-hotspot-focus-PARCHE.png`. |

### Media

| ID | Tienda | Componente y localizador | Comportamiento observado | Recomendación |
|---|---|---|---|---|
| **T-02** | Las 3 | Recomendaciones de la ficha. `assets/theme.js:1698-1706` (`IntersectionObserver` con `rootMargin: '0px 0px 300px 0px'`), `assets/base.css:4857-4859`, `sections/product-recommendations.liquid:15-21`. | El bloque mide 1 px hasta que entra en el margen de 300 px; entonces pide la sección y, cuando llega la respuesta (entre 0.15 y 1.2 s después), inserta entre 724 y 1 059 px. Si el comprador ya va por ahí, "vistos recientemente" y el pie saltan hacia abajo a la vista. Con rueda real y el tema tal cual: 0 a 0.02 a 1 000 y 2 400 px/s en 19 de 20 pasadas (0.08 en Edition móvil), y 0.36 a 0.83 en 9 de 14 pasadas a 8 333 px/s. Lighthouse no hace scroll, por eso da 0. Afecta al CLS de campo de la plantilla que más pesa. | Cambiar el margen a `'0px 0px 200% 0px'` (P-02). Validado en Edition interceptando `theme.js` en el navegador de prueba: CLS ≤ 0.0018 en 10 de 10 pasadas, incluidas 6 rápidas. La variante "cargar al conectar" da lo mismo en 9 de 9. |
| **T-03** | Atelier, Archive | Marquesina con `prefers-reduced-motion: reduce`. `assets/base.css:6928-6942` (pone `overflow: visible` y `flex-wrap`) frente a `:3634-3646` (`white-space: nowrap` en `.marquee-banner__item`). | Sin animación la lista se apila, pero cada frase sigue sin poder partirse y el contenedor ya no recorta. A 320 px la home desborda 4 px (Atelier, ítem de 324 px) y 36 px (Archive, ítem de 356 px). A 375 px las demos caben por poco; una frase de comerciante de 46 caracteres ("COMPLIMENTARY SHIPPING ON ALL ORDERS OVER $150") desborda 57 px a 375 y 112 px a 320. "Reducir movimiento" es un ajuste corriente en iOS. | Permitir el salto de línea dentro del bloque de movimiento reducido (P-03). Validado: 0 px en los cuatro casos. |
| **T-04** | Las 3 | Imágenes de tarjeta siempre diferidas. `snippets/responsive-image.liquid:18-25`, `snippets/product-card.liquid:134-139`, `sections/main-collection.liquid:367`, `sections/main-search.liquid:290`, `sections/main-404.liquid:42`, `sections/main-list-collections.liquid:34-40`. | El elemento LCP es una imagen con `loading="lazy"` y `fetchpriority="auto"` en `/collections/all` (768 y 1440 px), `/collections` (los tres anchos), `/search` (768) y la 404 (768 y 1440). Lighthouse lo confirma en colección: `lcp-discovery` falla ("LCP resources should not use loading=lazy", "fetchpriority=high should be applied"). LCP de colección en móvil: 5.5 s (Atelier), 4.5 s (Edition), 3.7 s (Archive). La guía de Shopify "Never lazy-load the LCP image" pide `eager` en las primeras tarjetas por `forloop.index`. | Parámetro `eager` en `product-card` y `responsive-image`, activo en las 4 primeras tarjetas de la primera página y en las 3 primeras colecciones (P-04). No validado en vivo: exige desplegar Liquid. |
| **T-05** | Las 3 | Transiciones entre páginas. `assets/base.css:8462-8464` (`@view-transition { navigation: auto; }`). | Al navegar de cualquier página del tema al checkout (botón Checkout del drawer y Buy it now) el navegador registra `InvalidStateError: Transition was aborted because of invalid state. ViewTransition opt-in disabled` como error no capturado. Reproducido 4 de 4 veces (Atelier, Edition ×2, Archive). Con la regla neutralizada: 0 de 1. Entre páginas del tema: 0 errores. El checkout carga bien; es ruido de consola, pero la directiva pide cero errores no capturados y el origen es una regla del tema. | Conservar la transición y saltarla en el documento saliente cuando el destino es el checkout, con un listener `pageswap` (P-05). Validado en Archive inyectando el listener: 0 errores en 2 de 2, frente a 1 de 1 sin él. Alternativa: retirar la regla. |

### Baja

| ID | Tienda | Componente y localizador | Comportamiento observado | Recomendación |
|---|---|---|---|---|
| **T-06** | Las 3 | `sections/featured-product.liquid:53` (`prioritize: forloop.first`), `sections/hero-editorial.liquid:92,129` (`prioritize: true`). | La primera imagen del producto destacado sale con `loading="eager"` y `fetchpriority="high"` aunque la sección esté a y ≈ 2 900 a 5 800 px. Compite en ancho de banda con la imagen LCP real. El hero se prioriza siempre, aunque el comerciante lo coloque más abajo. | Condicionar a la posición con `section.index`, con la comparación segura ante `nil` que documenta Shopify (P-06). |
| **T-07** | Las 3 | Drawer de carrito. `sections/cart-drawer.liquid:131` (form sin intercepción), `:491` (único botón de envío: Checkout), `assets/theme.js:2206-2208`. | Pulsar Enter en el campo de cantidad envía el formulario de forma nativa: la cantidad se aplica, pero el comprador sale del drawer y aterriza en `/cart` con recarga completa. Con Tab o con los botones no ocurre. | Interceptar Enter en `[data-cart-quantity]` y confirmar la cantidad por la vía AJAX (P-07). |
| **T-08** | Las 3 | Plantilla de contraseña del tema. `layout/theme.liquid:14-19` (título), `:112` y `:118` (grupos de cabecera y pie). | (a) El `<title>` sale como "– Sartorial Atelier": `page_title` está vacío y el separador se imprime igual. (b) La página usa el layout general: barra de anuncio con enlace a `/collections/all`, navegación Home/Catalog/Contact, búsqueda, cuenta, carrito y boletín del pie. En una tienda cerrada todos esos enlaces devuelven a la contraseña. El modal "Enter with password" en sí está bien: trampa sin fugas, Escape devuelve el foco, axe 0. | (a) Imprimir el separador solo si hay `page_title` (P-08a, Nivel 1). (b) Omitir navegación, búsqueda y carrito cuando `request.page_type == 'password'`, o añadir un `layout/password.liquid` propio (P-08b, Nivel 2: decide Gemini). |
| **T-09** | Archive | Cantidad en la ficha. `sections/main-product.liquid:401` (`quantity_max` solo sale de `quantity_rule.max`), `:431`. | Con "Low stock: 1 left" el selector sube a 3 y el total de línea anuncia "Total for 3 … $4,500.00". Al añadir, Shopify deja 1 y el drawer avisa. Coincide con `GPT-AUDIT-015` H6. | Limitar `max` al inventario cuando está controlado, no admite pedidos sin stock y ya se publica por estar bajo el umbral. Roza la decisión de privacidad de stock AF-07: Nivel 2. |
| **T-10** | Atelier, Archive | `sections/lookbook.liquid:94,100`. | El texto visible del hotspot es "1", "2"…, pero el nombre accesible es "Open details for Nove Blazer" y el número lleva `aria-hidden`. Lighthouse lo marca (`label-content-name-mismatch`, 4 y 3 nodos). Quien usa control por voz dice "clic 2" y no acierta (WCAG 2.5.3). No resta puntuación hoy. | Anteponer el número al `aria-label`: "2. Open details for …" (P-09). |
| **T-11** | Las 3 | `snippets/product-card.liquid:127-132` y `:290-291`. | Cada tarjeta tiene dos enlaces seguidos al mismo destino y con el mismo nombre (imagen y título): dos paradas de tabulador por producto, 48 en una rejilla de 24. El drawer ya resuelve el mismo caso con `tabindex="-1" aria-hidden="true"` en el enlace de la imagen (`cart-drawer.liquid:147`). | Aplicar el mismo patrón al enlace de la imagen de la tarjeta. Toca la tarjeta común: conviene revisión visual antes de cerrar. |
| **T-12** | Las 3 | Tres matices de semántica. `sections/header.liquid:194-198`; `sections/lookbook.liquid:103-111` con `assets/theme.js:3125`; `sections/marquee.liquid:43-49` con `assets/theme.js:3491-3492`. | (a) El icono de carrito es un enlace que abre un diálogo y no lo anuncia (`aria-haspopup` ausente). (b) El popover del lookbook es `role="dialog"` con trampa de foco pero sin `aria-modal` ni fondo inerte: el cursor virtual del lector puede salir mientras Tab no. (c) El botón de pausa cambia a la vez `aria-pressed` y su etiqueta ("Play…, pulsado"). | (a) Añadir por JS `aria-haspopup="dialog"` cuando el drawer esté activo. (b) Añadir `aria-modal="true"` o soltar la trampa. (c) Dejar fija la etiqueta o quitar `aria-pressed`. |
| **T-13** | Código, no reproducido en vivo | `sections/bento-discovery.liquid:6-32`, `sections/curated-showcase.liquid:6-31`. | A diferencia de la cápsula y de la marquesina, con cero bloques estas dos secciones siguen emitiendo el `<section>`, su relleno y una rejilla vacía. Ninguna demo está en ese estado, así que queda como lectura de código. | Misma guarda que en `complete-the-look.liquid:62`: `section.blocks.size > 0 or request.design_mode`. |
| **T-14** | Atelier, Archive | `assets/base.css:6884-6891`. | La marquesina y los pulsos de los hotspots son animaciones infinitas que siguen corriendo fuera de pantalla. En reposo la home hace 60 recálculos de estilo por segundo (360 en 6 s) frente a 6 a 9 por segundo con ambas apagadas. Coste pequeño: 5 % del hilo principal sin limitar. | Pausar con `animation-play-state` lo que no esté en pantalla, o `content-visibility: auto` en esas secciones. |

### Configuración de las tiendas demo (dueño: Johandry, con Gemini)

| ID | Tienda | Observado | Severidad | Recomendación |
|---|---|---|---|---|
| **D-01** | Las 3 | Estados de catálogo ausentes. Atelier: 24 productos, 0 con variantes (una tienda de ropa sin tallas). Archive: 12 productos de una variante. Las tres: 0 productos en oferta, 0 agotados, 0 con más de una imagen ("Zoom image 1 of 1"), sin guía de tallas, `show_cart_note` apagado, sin selector de país o idioma. | Media | Añadir por tienda al menos un producto en oferta, una variante agotada, un producto con 4 o más imágenes y, en Atelier, tallas y color con swatches. Son las recomendaciones de Shopify para demos, y sin ellas ni el revisor ni este informe pueden ver esas funciones del tema. |
| **D-02** | Las 3 | Navegación por defecto: cabecera Home / Catalog / Contact, 0 mega menús, pie con un solo enlace (Search). | Media | Configurar el menú principal con colecciones y un mega menú, y el pie con políticas y contacto. El requisito 12 exige navegación desplegable accesible por teclado: hoy no hay desplegable que probar. |
| **D-03** | Las 3 | Sin favicon: petición a `/favicon.ico` con 404, que es el único error de consola en páginas del tema y baja Best Practices a 73. Sin meta descripción en home y colección: SEO 92. | Baja | Subir favicon en los ajustes del tema y rellenar la descripción de la página de inicio. |
| **D-04** | Archive, Edition | Archive reutiliza los ficheros de foto de Atelier (`nove-blazer-01.jpg` ilustra "1990 Pinstripe Double-Breasted Jacket", y se ve una chaqueta lisa de un botón). En Edition, 12 de 13 fotos de producto tienen nombre de fichero `photo-<id>.jpg`, el patrón de Unsplash. | Media (comercial) | Confirmo de forma independiente H3 y H4 de `GPT-AUDIT-015`. Documentar la licencia de cada imagen antes del envío. |

### Ruido de plataforma, descartado como hallazgo del tema

- **Enlaces "Privacy" y "Terms" enfocables fuera de pantalla**, sin anillo de foco: pertenecen a `div#shop-hcaptcha-badge-container` (hCaptcha de los formularios de Shopify), fijo en `left: 319px`. No está en ninguna sección del tema y no provoca scroll horizontal.
- **`Framing 'https://shop.app/' violates … frame-ancestors`**, 403 de `shop.app/pay/hop`, cookie de terceros `_shop_app_essential`: componente `<shopify-account>` y Shop Pay.
- **`TypeError: Failed to fetch` en `cdn/wpm/…js`** y las tareas largas de `perf-kit`, `trekkie` y `wpm`: analítica de Shopify. El tema aporta 50 ms de ejecución de script en la home móvil de Atelier.
- **Página de contraseña genérica con el logotipo de Shopify** al entrar sin sesión: es la puerta de las tiendas de desarrollo, no la plantilla del tema. La plantilla del tema se auditó aparte con la sesión abierta (T-08).
- **HTTP 429 de Cloudflare**: los provoqué yo con tráfico en paralelo (sección 5).

---

## 4. Micro-optimizaciones: parches listos

Ninguno está aplicado. Los cuatro primeros están validados sobre las tiendas reales mediante inyección local en el navegador de prueba; nada se desplegó.

**P-01 (T-01). Anillo de foco de dos tonos sobre imagen.** `assets/base.css`.

```css
/* Sustituye la regla de la línea 8009 */
.product-gallery__zoom-trigger:focus-visible {
  outline-offset: -5px;
  box-shadow: inset 0 0 0 7px var(--color-background);
}

/* Nueva, tras el bloque .lookbook-hotspot__trigger (línea 4251) */
.lookbook-hotspot__trigger:focus-visible {
  outline-offset: 2px;
  box-shadow: 0 0 0 6px var(--color-background);
}
```

El contorno de 2 px queda entre dos bandas del color de fondo del esquema, de modo que siempre hay un borde con 7.58:1 o más (el contraste fondo/primer plano más bajo medido en los tres presets). Conviene extender el mismo patrón a `.hero-editorial__button` y `.bento-card`, que hoy pasan solo porque las demos llevan velo o fotos claras.

**P-02 (T-02). Pedir las recomendaciones antes.** `assets/theme.js:1705`.

```diff
-          { rootMargin: '0px 0px 300px 0px' },
+          { rootMargin: '0px 0px 200% 0px' },
```

**P-03 (T-03). Marquesina estática que sí parte línea.** `assets/base.css`, dentro del bloque `@media (prefers-reduced-motion: reduce)` de la línea 6928.

```css
  .marquee-banner__group {
    min-width: 0;
  }

  .marquee-banner__item {
    min-width: 0;
    overflow-wrap: anywhere;
    white-space: normal;
  }
```

**P-05 (T-05). Saltar la transición cuando el destino es el checkout.** `assets/theme.js`, junto a los `init…()` del final.

```js
  // La regla @view-transition de base.css solo tiene sentido entre paginas del tema.
  // Hacia el checkout, que no participa, el navegador aborta la transicion y deja un
  // InvalidStateError sin capturar en la consola del destino.
  window.addEventListener('pageswap', (event) => {
    if (!event.viewTransition) return;
    const url = event.activation?.entry?.url;
    const path = url ? new URL(url).pathname : '';
    if (!url || /^\/(checkouts?|cart\/c)\//.test(path)) event.viewTransition.skipTransition();
  });
```

**P-04 (T-04). Primeras tarjetas sin `lazy`.** No validado en vivo.

```liquid
{%- comment -%} snippets/responsive-image.liquid, tras la línea 25 {%- endcomment -%}
    if eager and prioritize != true
      assign image_loading = 'eager'
    endif

{%- comment -%} snippets/product-card.liquid:134, imagen primaria {%- endcomment -%}
        {% render 'responsive-image',
          image: card_image,
          sizes: card_sizes,
          eager: eager_image,
          image_class: 'product-card__image product-card__image--primary',
          alt: card_product.title
        %}
```

En `main-collection.liquid:367`, `main-search.liquid:290` y `main-404.liquid:42` pasar `eager_image: true` a las cuatro primeras tarjetas de la primera página (en colección el contador ya existe: `product_cursor`). En `main-list-collections.liquid:34`, `eager: true` a las tres primeras. La imagen secundaria de la tarjeta se queda en `lazy`.

**P-06 (T-06). Prioridad según la posición de la sección.** `sections/featured-product.liquid:53`.

```liquid
            {%- liquid
              assign media_priority = false
              if forloop.first
                unless section.index > 2
                  assign media_priority = true
                endunless
              endif
            -%}
            {% render 'product-media', media: media, product: featured_product, prioritize: media_priority %}
```

`unless section.index > N` es la forma que recomienda Shopify porque `section.index` es `nil` en el editor y en la Section Rendering API, y así el caso `nil` cae del lado de `eager`. El mismo criterio sirve para `hero-editorial.liquid:92,129`.

**P-07 (T-07). Enter en la cantidad del drawer.** `assets/theme.js`, en el `connectedCallback` de `CartDrawer`, tras la línea 2208. No validado en vivo.

```js
      this.listen(this, 'keydown', (event) => {
        if (event.key !== 'Enter' || !event.target.matches?.('[data-cart-quantity]')) return;
        event.preventDefault();
        event.target.dispatchEvent(new Event('change', { bubbles: true }));
      });
```

**P-08a (T-08). Título sin guion huérfano.** `layout/theme.liquid:14-19`.

```liquid
    <title>
      {%- if page_title != blank -%}
        {{- page_title | escape -}}
        {%- if current_tags %} &ndash; {{ current_tags | join: ', ' | escape }}{% endif -%}
        {%- if current_page != 1 %} &ndash; {{ 'general.pagination.page' | t: number: current_page }}{% endif -%}
        {%- unless page_title contains shop.name %} &ndash; {{ shop.name | escape }}{% endunless -%}
      {%- else -%}
        {{- shop.name | escape -}}
      {%- endif -%}
    </title>
```

**P-09 (T-10). Número dentro del nombre accesible.** `sections/lookbook.liquid:94`.

```diff
-                aria-label="{{ 'sections.lookbook.open_product' | t: product: hotspot_product.title | escape_once }}"
+                aria-label="{{ forloop.index }}. {{ 'sections.lookbook.open_product' | t: product: hotspot_product.title | escape_once }}"
```

**Otras dos mejoras de rendimiento, sin parche escrito.** Precargar la fuente de titulares (`<link rel="preload" as="font" crossorigin>` con `font_url`) reduciría el desplazamiento por cambio de fuente, hoy 0.03 a 0.04 en las home de escritorio de Atelier y Archive. Y `theme.js` pesa 121 KB minificado (23.8 KB comprimido): la guía de Shopify sugiere un paquete mínimo de 16 KB, así que cargar bajo demanda los módulos de página (zoom ya lo hace; lookbook, bundle, filtros y búsqueda podrían) es el siguiente paso si se quiere subir el 55 y el 57 de la home y la colección móvil de Atelier.

---

## 5. Límites de esta auditoría

- **Sin lector de pantalla real ni dispositivo físico.** Las regiones vivas, los roles y los estados se comprobaron en el DOM y con axe; nadie escuchó el anuncio con NVDA, JAWS o VoiceOver. El pellizco del zoom y el teclado en iOS tampoco se probaron.
- **Funciones no ejercitables** por falta de configuración en las demos: selector de variantes en Atelier, variante agotada, precio de oferta, galería de varias imágenes y miniaturas, guía de tallas, nota de pedido, mega menú, selector de país e idioma, barra de recompensas, venta cruzada del drawer y checkout acelerado. Su último estado verificado es el del BOARD, en la tienda de QA, no en estas tres.
- **Textos largos por inyección en el DOM**, no con productos reales: prueba el CSS, no la rama `data-long-title` de Liquid (certificada como AF-09 en la tienda de QA).
- **Lighthouse en mi máquina**, con limitación simulada (índice de referencia 1 643), una pasada por página. Shopify mide con su propio conjunto de datos; los valores individuales pueden variar unos puntos. Dos pasadas avisaron de "page loaded too slowly to finish within the time limit" (home y colección móvil de Atelier).
- **Incidente de tráfico.** Al principio lancé tres navegadores en paralelo más un cuarto script y las tres tiendas respondieron HTTP 429. Se perdió una pasada de Edition a 1440 px y otra a 375 px (medían la página de bloqueo); están conservadas como `*.run1-429.jsonl` y `*.run2.jsonl` y excluidas de las cifras. Desde entonces todo corrió con una tienda por proceso y 2.5 s entre navegaciones. Una pasada de resiliencia de Edition dio dos 503 y se repitió entera.
- **Parche de CLS validado solo en Edition.** En Atelier y Archive la intercepción no casó con el JS minificado (`patched=0`), así que esas filas "parche" son en realidad repeticiones del tema original y como tal se cuentan en T-02.
- **No medido:** el contraste del contador del zoom (`.product-zoom__counter`), que axe deja como "incomplete" por solapamiento.

---

## 6. Hallazgos extra fuera de alcance

- **X-01. Copias de bases de datos de Chrome en `scratch/`.** `chrome_logins.db` (45 KB), `chrome_history.db` (47.8 MB), `chrome_webdata.db` (983 KB) y `temp_cookies.db`, con fecha 2026-09-29, junto a `copy_cookies.ps1`, `decrypt_cookies.mjs` y `get_cookies.py` (vacíos). No las abrí. `scratch/` está en `.gitignore` y `git log --all -- 'scratch/*.db'` no devuelve nada, así que no han llegado al repositorio; pero la carpeta está dentro de OneDrive y se sincroniza. Son credenciales guardadas, historial y autocompletado del navegador de Johandry. Recomendación: borrarlas y, si no las copió él, averiguar qué agente lo hizo.
- **X-02. Contacto personal en la política de privacidad de Atelier** (`GPT-AUDIT-016` C3). Lo anoto solo como referencia cruzada.
- **X-03. Higiene del propio arnés.** Las cookies de sesión del storefront, los perfiles de navegador y los informes completos de Lighthouse vivieron en `%TEMP%/sartorial-audit-final-002/`, fuera del repositorio, y ya están borrados. En las salidas guardadas en `harness-AUDIT-FINAL-002/` los tokens de checkout están redactados y no hay cookies. Para repetir las pasadas de axe hay que indicar la ruta de axe-core en `AXE_PATH`.

---

## 7. Verificación

Todo se ejecuta desde `agent-comms/outbox-claude/harness-AUDIT-FINAL-002/` con `node <script>.mjs [tienda]`. Navegador: Chromium 153 de Playwright, sin interfaz. axe-core 4.10.2 inyectado como herramienta de prueba. Lighthouse 13.5.0 por `npx`.

| Script | Qué demuestra | Qué no demuestra | Salida |
|---|---|---|---|
| `01-responsive-perf.mjs` | Desbordamiento, atributos de imagen, elemento LCP, CLS de carga, hosts y consola en 87 combinaciones ruta × viewport | El tiempo de LCP es de laboratorio sin limitar | `results-01-responsive-perf-<tienda>.jsonl` |
| `02a-keyboard.mjs` | Tab y Shift+Tab reales, indicador declarado, foco tapado, 6 trampas, Escape, región viva al añadir | Que el anillo se vea sobre una foto (lo mide 02e) | `results-02a-keyboard.json` |
| `02b-axe.mjs` | 0 violaciones WCAG A y AA en 21 estados por tienda, con menú, carrito y zoom abiertos | Reglas experimentales de axe; lo que exige juicio humano | `results-02b-axe-<tienda>.json` |
| `02c-contrast-over-media.mjs` | Contraste píxel a píxel de cada texto pintado sobre imagen o gradiente | Texto sobre fondo sólido (lo cubre axe) | `results-02c-contrast-<tienda>.json` |
| `02d-aria-semantics.mjs`, `02f-combobox.mjs` | Pestañas, acordeones, marquesina, combobox, objetivos táctiles, encabezados, movimiento reducido | Lo que oye un lector de pantalla | `results-02d-*`, `results-02f-*` |
| `02e-focus-over-media.mjs`, `09-evidence-focus.mjs` | T-01: contraste del anillo contra la foto que tapa, y capturas con y sin parche | Las tarjetas con cambio de imagen al enfocar: ahí el método mide la imagen entera y se descartó | `results-02e-*`, `evidence/*.png` |
| `03-transactional.mjs` | Variantes, cantidades, drawer, ráfaga, bundle, checkout, Buy it now, Enter en cantidad; DOM contra `/cart.js` en cada paso | Que el pago funcione | `results-03-transactional-<tienda>.json` |
| `04-cls-scroll.mjs` | T-02 con rueda real a tres velocidades y los dos parches | Validación del parche fuera de Edition | `results-04-cls-scroll-<tienda>.json` |
| `05-resilience.mjs`, `14-marquee-reduced-motion.mjs` | Textos hostiles, reflow a 320 px, T-03 y su parche | Títulos largos servidos por Liquid | `results-05-*`, `results-14-*` |
| `06-view-transition-checkout.mjs` | T-05: el error aparece con la regla, desaparece sin ella y con el listener `pageswap` | Comportamiento fuera de Chromium | `results-06-*` |
| `07-parity-catalog.mjs` | Que el código local es el desplegado; peso servido; inventario de estados de catálogo y navegación | Igualdad byte a byte (Shopify minifica) | `results-07-parity-catalog.json` |
| `08-lighthouse.mjs` | Rendimiento y accesibilidad oficiales, 18 pasadas | Las puntuaciones en la infraestructura de Shopify | `results-08-lighthouse-<tienda>.json` |
| `10` a `13` | Cantidad inválida, fail-closed, reflow, hCaptcha, plantilla de contraseña, trabajo del hilo principal en reposo | — | `results-10-*` a `results-13-*` |
| `99-summary.mjs` | Agrega lo anterior en las cifras de la matriz | No mide nada | `results-99-summary.txt` |

Compuertas estáticas de solo lectura ejecutadas hoy (se omitieron `gates:sanity` y `gates:package`, que escriben en disco):

```text
$ npm run -s gates:json      → exit 0
$ npm run -s gates:locales   → "Sin resolver en storefront: 0 · Sin resolver en schema: 0 · Huerfanas: 0 / 0" · exit 0
$ npm run -s gates:ledger    → "54 cumplido · 2 código completo · 1 no verificado · 0 ausente · Incoherencias: 0" · exit 0
$ npm run -s gates:syntax    → exit 0
$ npx shopify theme check    → "398 files inspected with no offenses found." · exit 0
                               (el recuento incluye los JSON de resultados de este arnés; con el arnés a medias dio 355)
```

Salidas literales que sostienen los hallazgos principales:

```text
# T-01  results-02e-focus-over-media-archive.txt
archive 1440 .product-gallery__zoom-trigger #0 fv=true anillo: px=4820 p10=1.08 p50=1.16 <3:1=95%
archive 375  .lookbook-hotspot__trigger     #1 fv=true anillo: px=384  p10=1.12 p50=1.31 <3:1=100%

# T-02  results-04-cls-scroll-edition.txt
edition 375 original               rapido#2 8333px/s CLS=0.8291 recs(req@133ms resp@290ms h=913 cards=4)
edition 375 parche-rootMargin-200% rapido#2 8333px/s CLS=0.0006 … patched=1

# T-03  node 14-marquee-reduced-motion.mjs
archive 320px reduce | demo: overflow=36px (ítem más ancho 356px) | frase 46 car.: overflow=112px | con parche: overflow=0px
archive 375px reduce | demo: overflow=0px                          | frase 46 car.: overflow=57px  | con parche: overflow=0px

# T-04  results-08-lighthouse-atelier.txt
atelier collection mobile perf=57 a11y=100 … LCP=5482 … insights=[cache,image-delivery,lcp-discovery,…]

# T-05  results-06-view-transition-edition.json
"mode": "original"             → "msg": "Transition was aborted because of invalid state. ViewTransition opt-in disabled"
"mode": "sin-@view-transition" → "pageerrors": []

# Lighthouse
MEDIA atelier: rendimiento=76 accesibilidad=100 (n=6; umbral Theme Store 60 / 90)
MEDIA edition: rendimiento=89 accesibilidad=100 (n=6; umbral Theme Store 60 / 90)
MEDIA archive: rendimiento=84 accesibilidad=100 (n=6; umbral Theme Store 60 / 90)
```

---

## 8. Afirmaciones falsables

1. **A1.** En `sartorial-archive.myshopify.com/products/1990-pinstripe-double-breasted-jacket`, a 1440 px, al llegar con Tab a "Zoom image 1 of 1" no aparece ningún indicador de foco distinguible. Falsable abriendo la página y tabulando, o con `node 09-evidence-focus.mjs archive`.
2. **A2.** Con el CSS de P-01 inyectado, el mismo control muestra un marco claro con línea oscura. Falsable con `node 09-evidence-focus.mjs archive --patch`.
3. **A3.** `document.documentElement.scrollWidth − clientWidth` es 0 en las 87 combinaciones medidas a 375, 768 y 1440 px, con `overflow-x: visible` en `html` y `body`.
4. **A4.** En la home de Archive a 320 px con `prefers-reduced-motion: reduce`, `scrollWidth` es 356.
5. **A5.** axe-core 4.10.2 con las etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` no devuelve violaciones en ninguno de los 63 estados.
6. **A6.** En el menú móvil, la búsqueda, el carrito (vacío y con artículos), el popover del lookbook, el zoom y el modal de contraseña, 30 Tab y 30 Shift+Tab (10 Tab en el de contraseña) no sacan el foco y Escape lo devuelve al disparador, en las tres tiendas.
7. **A7.** En `/collections/all` a 1440 px el elemento LCP es `img.product-card__image--primary` con `loading="lazy"`, en las tres tiendas.
8. **A8.** En la ficha de cualquiera de las tres tiendas, un scroll de rueda de 500 px cada 60 ms iniciado 1 s después de cargar produce, en al menos la mitad de las pasadas, un desplazamiento de maquetación mayor de 0.3 cuya fuente es `section.recently-viewed__content` o el pie.
9. **A9.** Con `rootMargin: '0px 0px 200% 0px'` ese desplazamiento baja a menos de 0.002 en 10 de 10 pasadas en Edition.
10. **A10.** Pulsar Checkout en el drawer genera en el destino un `pageerror` "Transition was aborted because of invalid state", y deja de generarlo si `@view-transition` pasa a `navigation: none` o si el documento saliente llama a `skipTransition()` en `pageswap`.
11. **A11.** Pulsar Enter en el campo de cantidad del drawer navega a `/cart` en las tres tiendas.
12. **A12.** Con la sesión abierta, `document.title` en `/password` empieza por "– " en las tres tiendas.
13. **A13.** `/products.json` devuelve 0 productos con más de una variante en Atelier y en Archive, y 0 variantes no disponibles, 0 precios de comparación y 0 productos con más de una imagen en las tres.
14. **A14.** La media de rendimiento de Lighthouse 13.5 entre home, colección y producto, móvil y escritorio, es 76 (Atelier), 89 (Edition) y 84 (Archive), y la de accesibilidad es 100 en las tres.
15. **A15.** Ninguna petición de las páginas del tema sale a un host que no sea de Shopify. hCaptcha aparece solo al enfocar un formulario y lo carga Shopify.
16. **A16.** `git status --short` no muestra ningún archivo del tema modificado por esta auditoría.
