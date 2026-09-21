# CLAUDE-REPORT-4F-001: Correcciones P0 y P1 de la auditoría en vivo

```text
ID: CLAUDE-REPORT-4F-001 (responde a CLAUDE-DIRECTIVE-4F-001)
Estado: código completo en las 10 tareas. Gates estáticos 8/8 en verde, harness 86/86.
        Nada está "cumplido": falta Gate 5 en tema-qkqpke0j.myshopify.com (lista en §9).
Decisión requerida:
  1. Gemini: aceptar o revertir las desviaciones Nivel 1 D1 a D11 (§4). La que más pesa es
     D3: la opción ya existente "Gradient behind the text only" ahora hace lo que dice su
     etiqueta, y eso cambia lo que ve cualquier tienda que ya la tuviera elegida.
  2. Gemini: autorizar (o no) los parches fuera de alcance H1 a H8 (§5). Ninguno está aplicado.
  3. Gemini: corregir la fila "Checkout Acelerado" del ledger (H3): hoy dice `cumplido` con
     una evidencia que nunca apuntó a botones de checkout.
  4. Johandry o Gemini: subir el tema a la tienda de desarrollo para ejecutar Gate 5.
Resumen en 5 líneas:
  1. Checkout acelerado en el cajón y en la página de carrito; el pie del cajón cabe entero a 1366x650.
  2. La cabecera es sticky (sección a z-index 150) y los botones Cerrar del menú y del buscador pintan por encima de la barra de anuncio.
  3. Texto del hero de 1.13:1 a ≥5.56:1 (peor píxel) a 390, 1280 y 1440 px con un velo radial ceñido al texto.
  4. Galería de producto: sin celdas vacías con 0, 1 o 3 imágenes; por debajo de 62rem es un carrusel con scroll-snap, contador y anuncio accesible; el título sube de y=1990 a y=652 a 390 px.
  5. Buscador estable a 96x52 con una sola cruz, miniaturas a 72/144/216 px y páginas nativas blindadas contra <style> y <script> residuales.
Archivos tocados: 10 (§3). templates/product.json no se tocó. Fuera de la lista: ninguno.
Desviaciones (Nivel 1 o Nivel 2): 11 de Nivel 1 (§4). Ninguna de Nivel 2.
Hallazgos extra fuera de alcance (con parche listo): 8 (§5).
Verificación (comando, resultado y qué demuestra/qué no): §6.
Lista de afirmaciones falsables numeradas: §10.
```

---

## 1. Qué se midió y con qué

Las páginas de prueba no son maquetas: `render4f.mjs` renderiza el Liquid real del árbol de
trabajo con liquidjs (header group, hero con la imagen real de campaña, cajón con una línea,
fichas de producto con 0, 1, 3 y 4 imágenes, carrito, y una página de documentación con HTML
residual) y carga el `base.css` y el `theme.js` reales. El mismo script renderiza el árbol
anterior (los originales tal como estaban en el dispositivo al empezar), de modo que cada
medida tiene su "antes" y su "después" sobre el mismo HTML y las mismas imágenes.

El "antes" reproduce las cifras de CLAUDE-AUDIT-LIVE-001 medidas en la tienda: subtítulo del
hero 1.19:1 a 390 px, botón SEARCH de 44x125, 401 px vacíos junto a la imagen única. Eso da
confianza en el método, no sustituye a Gate 5.

Artefactos en `agent-comms/outbox-claude/harness-4F-001/` (§8).

---

## 2. Antes y después, por tarea

| Tarea | Medida | Antes | Después |
| :--- | :--- | :--- | :--- |
| T1 | Botones acelerados en la página de carrito | ausentes | 416x44, debajo de Checkout |
| T1 | Botones acelerados en el cajón (1366x650) | ausentes | fila en y=538–582, entre Checkout y View cart |
| T2 | Elemento superior en el centro de Cerrar, menú móvil 390 | `A.announcement-bar__link` | el propio botón |
| T2 | Ídem, buscador 1440 | `A.announcement-bar__link` | el propio botón |
| T3 390 | eyebrow (12 px, pide 4.5) mediana/peor | 1.76 / 1.63 | 8.03 / 7.66 |
| T3 390 | h1 (44 px, pide 3) | 2.10 / 1.48 | 8.30 / 6.09 |
| T3 390 | subtítulo (16 px, pide 4.5) | 1.19 / 1.13 | 6.98 / 5.56 |
| T3 390 | botón secundario (14 px, pide 4.5) | 4.33 / 2.90 | 8.45 / 6.47 |
| T3 1280 | eyebrow / h1 / subtítulo / secundario (peor) | 1.49 / 1.52 / 1.32 / 3.49 | 6.60 / 5.62 / 6.45 / 7.33 |
| T3 1440 | eyebrow / h1 / subtítulo / secundario (peor) | 1.67 / 1.64 / 1.41 / 3.60 | 6.16 / 5.56 / 6.47 / 7.33 |
| T4 | 1 imagen, escritorio (galería de 814 px) | 401 px + 401 vacíos | 814 px |
| T4 | Sin imágenes (placeholder) | 401 px | 814 px |
| T4 | 3 imágenes | 401 / 401 / 401 (celda vacía) | 814 arriba + 401 / 401 |
| T4 | 4 imágenes | 2x2 | 2x2 (sin cambio) |
| T5 | Botón SEARCH con el campo vacío | 44x125 (letra a letra) | 96x52 |
| T5 | Botón SEARCH con texto | 96x52 | 96x52 |
| T5 | Cruces visibles con texto | 1 propia + la nativa de WebKit (azul) | 1 (ver `shots/crop-search-before.png` y `crop-search-after.png`) |
| T6 | Cajón 1366x650 con aviso "Item added" | Checkout 593–637 tapado 20 px por el aviso; View cart en 653–701, fuera de pantalla | aviso en 79–127 bajo la cabecera; Checkout 482–526; View cart 590–638; 0 px de solape |
| T7 | Galería a 390x690, 4 imágenes: alto | 1774 px | 436 px |
| T7 | Top del título del producto | 1990 | 652 (dentro de la primera pantalla) |
| T7 | Top del botón de compra | 2265 | 927 |
| T7 | Tras pulsar "Next" | n/a | contador 2, scrollLeft 350, anuncio "View product media 2" |
| T7 | A 1440 px | rejilla | rejilla; pager oculto; pista sin tabindex |
| T8 | Top de la cabecera tras bajar 1500 px | -1455 | 0 |
| T8 | `--header-offset` / `scroll-padding-top` | no existía / auto | 77px / 77px |
| T8 | Overlay del menú con `data-animations=full` y cabecera condensada | 390x690 | 390x690 (el blur no encierra al menú) |
| T9 | Miniatura de sugerencia | original sin `width` | `&width=144`, srcset 72w/144w/216w, `sizes="72px"` |
| T10 | `<style>` / `<script>` dentro de main | 1 / 1 | 0 / 0 |
| T10 | El script residual se ejecutó | sí | no |
| T10 | max-width de `.site-header` / fuente del body | 840px / system-ui | none / Assistant |
| T10 | Párrafos legítimos conservados | 2 | 2 |

Fuente: `harness-4F-001/before.json` y `after.json`, salida literal de `node measure4f.mjs before|after`.
El campo `nativeCancel` de los JSON no sirve de evidencia: `getComputedStyle` no lee el pseudo-elemento nativo y devuelve "auto" en las dos builds; la prueba de la cruz son los recortes de captura.
El contraste se mide sobre píxeles reales de la captura (mediana y peor píxel de fondo en la
caja de cada elemento contra el color computado del texto), no con Lighthouse (ver H6).

---

## 3. Archivos tocados, líneas exactas

Recuento con `diff original actual | grep -c '^>'` / `'^<'`:

```text
assets/base.css                 +335 -13
assets/theme.js                 +169 -7
sections/header.liquid          +23  -0
sections/cart-drawer.liquid     +28  -2
sections/main-cart-items.liquid +11  -0
sections/hero-editorial.liquid  +8   -2
sections/main-product.liquid    +49  -1
sections/main-documentation.liquid +27 -2
sections/main-support.liquid    +27  -2
templates/index.json            +2   -2
```

Comprobación de alcance: el md5 de los 71 archivos de tema del árbol de trabajo contra el
dispositivo difiere exactamente en estos 10; los otros 61 son idénticos. Los 10 originales del
dispositivo no cambiaron desde que se copiaron (mismo md5 que la copia de trabajo inicial).

### T1. Checkout acelerado
- `sections/cart-drawer.liquid:484-495`: comentario y bloque `{%- if additional_checkout_buttons -%}<div class="cart__dynamic-checkout">{{ content_for_additional_checkout_buttons }}</div>`, justo debajo del botón `name="checkout"` y antes de View cart.
- `sections/main-cart-items.liquid:208-218`: el mismo bloque debajo de `.cart-summary__actions`.
- `assets/base.css:7090-7107`: `.cart__dynamic-checkout` (ancho 100 %, margen superior `--space-2`) y, sobre el propio `shopify-accelerated-checkout-cart`, las variables oficiales: `block-size` e `inline-size` a `--tap-target-min` (44 px, dentro del rango 25–55 de Shopify), radio `--button-radius`, esqueleto `--color-surface`.

### T2. Apilamiento
- `sections/header.liquid:6-28`: comentario con la escalera y `{% style %}.js #shopify-section-{{ section.id }} { position: sticky; top: 0; z-index: 150; }{% endstyle %}`. La causa real no era 20 contra 21: el menú y el buscador viven dentro de la cabecera, así que ningún z-index interno podía salir de su contexto de apilamiento. Subir la sección entera por encima de la barra (21) lo resuelve para todo lo que vive dentro.
- `assets/base.css:7109-7114`: `.password-modal__overlay { z-index: 240 }` (estaba en 90 y la cabecera a 150 le habría tapado el cierre).
- Escalera resultante: barra de anuncio 21, sticky ATC 40, popover del lookbook 120, cabecera 150, cajón 200, guía de tallas 220, pickup 230, modal de contraseña 240.

### T3. Hero
- `sections/hero-editorial.liquid:49`: la sección recibe `hero-editorial--overlay-{{ section.settings.overlay_style }}`.
- `sections/hero-editorial.liquid:126-133`: con `gradient_content` ya no se pinta el `<span>` que oscurecía la imagen entera; el velo va pegado al texto.
- `assets/base.css:7145-7191`: subtítulo del hero cinematográfico a `--color-foreground`; `--hero-scrim-alpha: max(0.6, var(--hero-overlay-opacity))`; `.hero-editorial__content::before` con `inset: -50%` y `radial-gradient(closest-side, …)` opaco hasta el 72 % del radio (las esquinas de la caja del texto están al 70.7 %) y caída escalonada hasta 0 al 100 %.
- `templates/index.json:13-14`: demo a `"overlay_style": "gradient_content"`, `"overlay_opacity": 60` (antes `gradient_bottom`, 40).
- Eliminada la regla muerta `.hero-editorial__overlay--gradient_content` (original `base.css:2450-2453`).

### T4. Galería sin huecos
- `assets/base.css:7193-7206`: `.product-gallery__item:only-child, .product-gallery__placeholder { grid-column: 1 / -1 }` y, desde 62rem en la rejilla, la primera imagen de un número impar a todo el ancho.

### T5. Buscador
- `assets/base.css:7300-7338`: `appearance: none` en `::-webkit-search-cancel-button` y `::-webkit-search-decoration`; icono en la columna 1; campo en `2 / 4` con `padding-inline-end: var(--tap-target-min)`; limpiar en la columna 3 con `z-index: 1`; SEARCH con `white-space: nowrap` y, desde 48rem, fila 1 columna 4.

### T6. Cajón en pantallas bajas
- `sections/cart-drawer.liquid:74-81`: los avisos `role="status"` y `role="alert"` salen del pie y van justo debajo de la cabecera, fuera de la zona que se desplaza.
- `sections/cart-drawer.liquid:131-137` y `:442`: `<div class="cart-drawer__scroll" data-cart-scroll>` envuelve líneas y recomendaciones.
- `assets/theme.js:1879-1887` (`CartDrawer.renderSection`): guarda y restaura el `scrollTop` de la pista al re-renderizar.
- `assets/base.css:7340-7396`: panel `overflow: hidden`; cabecera, avisos, barra de recompensas y pie `flex-shrink: 0`; la pista `flex: 1 1 auto; min-height: 7rem; overflow-y: auto`; `.cart-drawer__content` con `min-height: 0; overflow-y: auto` como último recurso; con `max-height: 45rem` se compacta el aire de cabecera, recompensas y pie.

### T7. Carrusel móvil
- `sections/main-product.liquid:17-27`: `gallery_ratio` (relación de la primera imagen acotada a 0.667–1.5) y `gallery_is_carousel` (layout distinto de thumbnails y más de 1 medio).
- `sections/main-product.liquid:37,39`: `--gallery-ratio` y `data-gallery-track`.
- `sections/main-product.liquid:55-90`: pager nacido `hidden` con Previous/Next (`general.pagination.*`), contador `aria-hidden` "1 / N" y `<p class="visually-hidden" aria-live="polite" data-gallery-status>` que anuncia con la plantilla `products.product.view_media`.
- `assets/theme.js:337-340` y `:364-469` (`ProductGallery.initCarousel`, `syncCarouselMode`, `slideIndexFromScroll`, `syncSlide`, `applySlide`, `goToSlide`): índice leído del scroll (dedo, trackpad o teclado), botones deshabilitados en los extremos, salto a la imagen de la variante elegida, `tabindex="0"` en la pista solo en modo carrusel (axe `scrollable-region-focusable`), scroll suave salvo `prefers-reduced-motion`, RTL por valor absoluto.
- `assets/base.css:7208-7298`: estilos del pager y, por debajo de 62rem, pista `display: flex; overflow-x: auto; scroll-snap-type: x mandatory`, diapositivas `flex: 0 0 100%; scroll-snap-align: start; scroll-snap-stop: always`, imágenes con `aspect-ratio: var(--gallery-ratio)` y `max-height: 55svh`. Sin JS la pista sigue deslizándose y conserva la barra de scroll.

### T8. Cabecera sticky
- `sections/header.liquid:21-27` (la misma regla de T2): lo sticky es la sección, porque un `<header>` sticky dentro de un envoltorio de su misma altura nunca se pega.
- `assets/theme.js:3810-3857` (`initHeaderScrollState`): publica la altura real en `--header-offset` con un ResizeObserver (0 si la sección no es sticky), vuelve a enlazar en `shopify:section:load`.
- `assets/base.css:7116-7143`: `scroll-padding-block-start: var(--header-offset)` (WCAG 2.4.11) y columnas sticky de ficha, producto destacado, facetas y navegación de documentación y políticas desplazadas por la cabecera.
- `assets/base.css:7473-7507` (B7): el estado condensado cambia sombra y fondo, no altura; el desenfoque va en `::before` para que `backdrop-filter` no convierta la cabecera en bloque contenedor del menú y el buscador (`position: fixed`).

### T9. Miniaturas
- `assets/theme.js:3413-3427`: `sizedUrl(width)` con `URL.searchParams.set('width', …)`; `src` a 144, `srcset` 72w/144w/216w, `sizes="72px"`.

### T10. HTML residual
- `sections/main-documentation.liquid:35-61` y `sections/main-support.liquid:57-83`: si `page.content` contiene `<style` o `<script`, se eliminan esos bloques enteros con `split` y se conserva el resto con su formato; si no queda nada, no se pinta el contenedor.

---

## 4. Desviaciones de Nivel 1

Ninguna toca un `id`, un `default` de schema, las opciones de un select ni archivos fuera de la lista.

- **D1. T7 a 62rem, no a 48rem.** Entre 48 y 62rem la ficha sigue siendo de una columna (el layout de dos columnas empieza en 62rem), así que a 48rem una tablet vertical seguiría apilando cuatro imágenes antes del título. El corte coincide con el del layout.
- **D2. T8 sin cambio de altura al condensar.** Una cabecera pegada que encoge desplaza todo el contenido a mitad de scroll (CLS). La condensación es sombra y fondo; el blur pasó a `::before` (ver T8).
- **D3. T3 sin opción nueva.** El select ya tenía "Gradient behind the text only" (`gradient_content`), pero pintaba un degradado de izquierda a derecha sobre toda la imagen. Ahora es literalmente eso: un velo ceñido al bloque de texto que lo sigue a cualquier posición. Añadir una opción habría sido Nivel 2 y habría dejado dos opciones con el mismo nombre. Efecto para el comerciante: quien ya la tuviera elegida verá la imagen más limpia y el texto más legible. El suelo de opacidad de 60 % hace que el deslizador entre 0 y 55 % no cambie nada con esta opción (ver H4).
- **D4. T6 más allá de la directiva.** La directiva pedía `min-height: 0; overflow-y: auto` en el contenido y `flex-shrink: 0` en el pie. Con solo eso, a 650 px el aviso seguía dentro del pie y lo empujaba. Por eso: avisos fuera del pie, pista desplazable propia, conservación del scroll al re-renderizar y compactación con `max-height: 45rem`.
- **D5. T1 sin forzar apilado vertical.** No se usa la clase `additional-checkout-buttons--vertical`: Shopify pone los botones en fila si caben. Apilados, a 650 px el pie volvía a desbordar. Las variables van sobre `shopify-accelerated-checkout-cart`, como recomienda la documentación de Shopify (heredadas desde el contenedor pueden perder frente a los valores por defecto del elemento).
- **D6. T2 modal de contraseña a 240.** Consecuencia directa de subir la cabecera a 150.
- **D7. T5 sin pista vacía fija.** La directiva proponía columnas fijas 3 y 4. Con la columna 3 reservada quedaba un hueco de 44 px entre el campo vacío y SEARCH. El campo ocupa `2 / 4` y la cruz aparece dentro de él.
- **D8. T10 sin `strip_html: 'style'`.** `strip_html` no acepta argumentos y quita todas las etiquetas: habría borrado el formato del contenido (párrafos, enlaces, listas). La alternativa "no pintar si contiene `<style>`" habría escondido contenido legítimo. Se quitan solo los bloques `<style>` y `<script>`, incluido el script (en la tienda reescribía estilos en tiempo de ejecución).
- **D9. T4 más allá de `:only-child`.** El placeholder de producto sin imágenes tenía el mismo hueco, y con 3 imágenes la tercera dejaba una celda vacía. Se usa la regla del producto destacado: impar, la primera a todo el ancho.
- **D10. Regla CSS muerta eliminada.** `.hero-editorial__overlay--gradient_content` ya no tiene elemento al que aplicarse.
- **D11. T9 con `srcset`.** Además de `width=144`, densidades 1x/2x/3x de una miniatura de 72 px: en pantallas 1x baja la de 72.

---

## 5. Hallazgos extra fuera de alcance (parches listos, no aplicados)

**H1. La marca de texto pisa los iconos de la cabecera en móvil.** Solape medido entre `.site-header__brand` y `.site-header__actions`: 41 px a 360, 26 a 390, 6 a 430. Causa: tres columnas `minmax(0, 1fr) auto minmax(0, 1fr)` y tres iconos de 44 px (132 px) en una columna de unos 83 px.
- Opción A (solo CSS, `assets/base.css:577` y `:637`). Medido: 0 px de solape en 360/390/430, pero la marca se descentra (centro en 160 en vez de 195 a 390) y se trunca con elipsis a 360 y 390:
  ```css
  .site-header__inner { grid-template-columns: minmax(max-content, 1fr) minmax(0, auto) minmax(max-content, 1fr); }
  .site-header__brand { min-width: 0; }
  ```
- Opción B (decisión de diseño): sacar el icono de cuenta al menú móvil por debajo de 48rem. Con dos iconos, "LINEA NOVE" cabe centrada a 390. Toca `header.liquid` y el menú; necesita visto bueno.

**H2. En el menú móvil, "Shop" sale 6 px a la derecha de "Home" y "Contact".** Es el padding por defecto del `<button>` (medido: texto de Shop en x=26, el resto en x=20). Parche en `assets/base.css:753`:
```css
.mobile-nav__toggle { padding-inline: 0; }
```

**H3. Fila del ledger "Checkout Acelerado" en `cumplido` con evidencia falsa.** Cita `sections/cart-drawer.liquid:262`, que en el original es el botón de quitar línea; antes de este sprint ni el cajón ni la página de carrito tenían `additional_checkout_buttons` (`grep -n additional_checkout` en los originales: 0 resultados en ambos archivos). Propuesta de fila:
```text
| **Checkout Acelerado (`additional_checkout_buttons`)** | Official Requirements: Cart & PDP | `código completo` | PDP `sections/main-product.liquid:570-571` (`form | payment_button`); cajón `sections/cart-drawer.liquid:491-495`; carrito `sections/main-cart-items.liquid:214-218`. Pendiente Gate 5: ver los botones renderizados en la tienda con una pasarela que los ofrezca. | Claude | Sprint 4F-001 |
```

**H4. La ayuda de "Overlay strength" no cuenta el suelo de 60 %.** Dice "Below 20% you may need to check that the text is still readable on your image." y con `gradient_content` nada baja de 60. Parche en `locales/en.default.schema.json`, `sections.hero_editorial.settings.overlay_opacity.info`:
```json
"info": "Below 20% you may need to check that the text is still readable on your image. With the gradient behind the text only, the strength never goes below 60% so the text stays readable."
```

**H5. El filtro de HTML residual está duplicado.** `snippets/` no estaba en la lista. Parche: crear `snippets/page-content.liquid` con el bloque `{%- liquid … -%}` de `main-documentation.liquid:42-59`, parametrizado con `class_name`, y sustituir en las dos secciones por:
```liquid
{%- render 'page-content', content: page.content, class_name: 'main-documentation__page-content' -%}
```
Misma clase de defecto, sin filtrar, en otras 6 secciones y un bloque (barrido `grep -rn "page.content" sections/`): `main-about.liquid:27`, `main-contact.liquid:36`, `main-faq.liquid:54`, `main-page.liquid:20`, `main-placeholder.liquid:51`, `main-policy.liquid:57` y la guía de tallas en `main-product.liquid:315` (`block.settings.page_content.content`). Con el snippet, cada una es un cambio de una línea.

**H6. El 100/100 de accesibilidad del BOARD no cubre el hero.** Lighthouse y axe no evalúan texto sobre imágenes de fondo (axe los deja como "incomplete"), por eso convivían un 100 y un subtítulo a 1.19:1. Propuesta: para texto sobre imagen, Gate 5 usa el muestreo de píxeles (el test T3 de `live4f.spec.mjs`), no Lighthouse.

**H7. Los botones del hero se parten en varias líneas (preexistente).** "Discover the collection": 92 px de alto (3 líneas) a 768, 58 px a 1024 y 1280, 52 px a 1440. Parche en `assets/base.css:3172` (medido: 52 px, una línea, en todos los anchos; se apilan hasta que caben en fila):
```css
.hero-editorial__actions { grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); }
```

**H8. Cajón con nota de pedido a 1366x650.** Con `show_cart_note` activo, el pie ya no cabe en el alto que queda: en reposo Checkout está en 593–637 (visible) pero View cart queda en 700, y se llega desplazando el contenido (el modo de último recurso). A 560 px, lo mismo. Propuesta para un sprint siguiente: la nota del cajón dentro de un `<details>` cerrado por defecto.

---

## 6. Verificación

### 6.1 Compuertas estáticas
```text
$ npm run gates:static ; echo "exit $?"
exit 0
JSON VALIDATE ........ Archivos .json comprobados: 39 · Fallos de parseo: 0
DATASET HOOKS ........ Componentes con data-* de contrato: 18 · Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
LOCALES .............. OK: todas las referencias estaticas resuelven contra los locales.
LEDGER ............... Filas de requisito: 53 (39 cumplido, 12 código completo, 2 no verificado, 0 ausente) · Incoherencias: 0
THEME CHECK .......... 85 files inspected with no offenses found.
SYNTAX ............... node --check assets/theme.js (sin salida)
PACKAGE .............. Your local theme was packaged in Sartorial-1.0.0.zip
```
Demuestra: JSON válido, contrato data-* intacto, claves `t:` resueltas, 0 ofensas de Theme Check, JS parseable, paquete generado. No demuestra: nada de comportamiento ni de lo que se ve.

### 6.2 Harness de Playwright (Chromium)
```text
$ npx playwright test --config harness/pw.config.mjs
86 passed (1.2m)          # 75 tests previos + 11 de live4f.spec.mjs
```
Transparencia: en la primera corrida completa `verify.spec.mjs › F04` (nota de pedido y foco tras re-render) falló una vez. Aislado pasó 4/4, con `--repeat-each 40 --workers 8` pasó 40/40, y las dos corridas completas siguientes dieron 86/86. Lo trato como un test inestable bajo carga, no como regresión, pero queda anotado porque F04 toca el re-render del cajón que este sprint modificó.

### 6.3 Las guardas muerden
```text
$ BUILD=before npx playwright test --config harness/pw.config.mjs live4f
11 failed
```
Los 11 fallan por su aserción, no por errores de montaje: T1 wallets `null`; T2 `paintTop` false; T3 eyebrow 1.63:1 y 1.49:1 contra 4.5; T4 `rowsFull` false en pdp-single; T5 ancho 44 contra >80; T6 solapes distintos de 0; T7 `scroll-snap-type` "none"; T8 top -1455 contra 0; T9 sin `width=144`; T10 `<style>` presente.

### 6.4 Qué NO demuestra todo esto
- El render es liquidjs, no Shopify. Filtros y objetos se comportan igual en lo que usa este sprint, pero no es el servidor real.
- Los botones acelerados están simulados (dos botones dentro de `shopify-accelerated-checkout-cart` que leen las variables). En la tienda los pinta Shopify con su shadow DOM: altura real, número de botones y si caben en fila solo se ven en Gate 5.
- Solo Chromium. Safari iOS no está probado: scroll-snap, `::-webkit-search-cancel-button`, `svh` y el sticky dentro de la sección hay que verlos en un iPhone.
- El deslizamiento con el dedo no se probó con eventos táctiles reales: el test mueve la pista con scroll y botones.
- El reenlace de la cabecera en el editor de temas (`shopify:section:load`) no se probó en el editor.

---

## 7. Compuerta 2: estados degenerados

| Componente | Vacío | Uno | Muchos | Muy largo | Faltante |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Checkout acelerado | carrito vacío: el bloque está dentro de la rama con líneas, no se pinta | 1 línea: medido | n/a | n/a | tienda sin pasarelas acelerada: `additional_checkout_buttons` es falso, no queda contenedor vacío |
| Cajón 650 px | n/a | 1 línea: medido | pista con scroll propio, `min-height: 7rem` | nota de pedido activa: H8 | sin aviso: el hueco del aviso no existe (`hidden`) |
| Galería | placeholder a todo el ancho | 1 imagen a todo el ancho, sin pager | 4 medido; N genérico (contador "i / N") | n/a | imagen muy vertical u horizontal: relación acotada 0.667–1.5 y `object-fit: contain` |
| Hero | sin imagen: el velo no depende de la imagen | 1 bloque de texto | n/a | titular largo: el velo es relativo a la caja del texto, crece con ella | sin subtítulo: nada cambia |
| Miniaturas | producto sin imagen: no se crea `<img>` | 1 resultado medido | n/a | URL con parámetros previos: `searchParams.set` los conserva | URL inválida: `catch` devuelve la original |
| HTML residual | página vacía: sin contenedor | solo `<style>`: queda vacío, sin contenedor | varios bloques: todos | n/a | `<style>` sin cerrar: se corta desde ahí (falla hacia seguro). No filtra `<STYLE>` en mayúsculas |

---

## 8. Artefactos (`agent-comms/outbox-claude/harness-4F-001/`)

- `render4f.mjs`: render de las páginas de prueba desde el Liquid real (antes y después).
- `measure4f.mjs`: todas las medidas de §2. `before.json` y `after.json`: su salida literal.
- `live4f.spec.mjs`: los 11 tests (con `BUILD=before` corren contra el árbol anterior).
- `shots4f.mjs` y `shots/`: capturas antes y después (hero 390 y 1280, menú 390, buscador vacío y con texto, cajón 650, ficha 390, imagen única 1280, cabecera sticky 390).
- Las rutas de los scripts son las del entorno de Claude; para correrlos en otra máquina hay que cambiar `THEME_ROOT` y la ruta de Chromium.

---

## 9. Ledger y Gate 5

Filas que toca este sprint (propuesta; el ledger lo escribe Gemini):
- **Checkout Acelerado**: de `cumplido` a `código completo`, con la evidencia de H3.
- **Contraste de Texto >= 4.5:1**: sigue en `código completo`; añadir `assets/base.css:7145-7191`, `sections/hero-editorial.liquid:126-133` y las cifras de §2.
- **Live Regions**: añadir `sections/main-product.liquid:88` (anuncio del carrusel).
- **Búsqueda Predictiva**: añadir `assets/theme.js:3413-3427` (miniaturas acotadas).
- **Medios Enriquecidos**: añadir el carrusel móvil, `sections/main-product.liquid:55-90`.
- Fila nueva sugerida: **Foco no oculto por la cabecera (WCAG 2.4.11)**, `código completo`, `assets/base.css:7116-7143` y `assets/theme.js:3810-3857`.

Gate 5 en la tienda, en este orden:
1. Carrito con 1 producto: botones acelerados visibles bajo Checkout en el cajón y en /cart, a 390 y a 1366x650.
2. Menú móvil y buscador a 390 y 1440: el botón Cerrar se ve entero y responde.
3. Home a 390, 1280 y 1440: contraste del hero con el método de píxeles (T3 de `live4f.spec.mjs` apuntado a la tienda).
4. Ficha con 1 imagen y con 4, en escritorio y en un iPhone: sin huecos; carrusel con dedo, contador y VoiceOver.
5. Buscador en Safari: una sola cruz; SEARCH a 96 px con el campo vacío.
6. Bajar en home y en ficha: cabecera pegada, CLS en Lighthouse ≤ 0.1, Tab por la página sin que el foco quede debajo de la cabecera.
7. /pages/documentation y /pages/support con la página que tenía el `<style>`: cabecera y tipografía intactas.

---

## 10. Afirmaciones falsables

1. `npm run gates:static` sobre el árbol entregado termina con código 0 y Theme Check informa "85 files inspected with no offenses found".
2. Solo cambian los 10 archivos de §3; los otros 61 archivos de tema son idénticos byte a byte a los del dispositivo antes del sprint.
3. `grep -n "if additional_checkout_buttons" sections/cart-drawer.liquid sections/main-cart-items.liquid` da exactamente una línea en cada archivo (491 y 214).
4. En el render, a 390 px con el menú abierto, `document.elementFromPoint` en el centro de Cerrar devuelve el botón; en el árbol anterior devuelve `a.announcement-bar__link`.
5. Tras `scrollTo(0, 1500)` a 390 px, el top de `.site-header` es 0 y `--header-offset` vale su altura (77px en el render).
6. Con `data-animations="full"` y la cabecera condensada, el overlay del menú mide 390x690.
7. Peor píxel de contraste del texto del hero después del cambio: ≥5.56:1 en los cuatro elementos a 390, 1280 y 1440 px.
8. En la ficha con una imagen, a 1440 px, la imagen mide lo mismo que la galería (814 px en el render).
9. Con tres imágenes, en escritorio, la primera ocupa el ancho completo y las otras dos comparten fila.
10. A 390x690 con 4 imágenes, el top del título del producto es menor que 690.
11. Tras pulsar Next, `[data-gallery-current]` dice "2" y `[data-gallery-status]` dice "View product media 2".
12. A 1440 px el pager tiene `hidden` y la pista no tiene `tabindex`.
13. Con el campo de búsqueda vacío, `.predictive-search__submit` mide 96x52 a 1280 px; con texto, lo mismo.
14. A 1366x650 con el aviso visible, Checkout y View cart están dentro de la ventana y el aviso no solapa a ninguno.
15. La miniatura de sugerencia tiene `width=144` en `src` y tres candidatos en `srcset`.
16. En la página de documentación con HTML residual no queda ningún `<style>` ni `<script>` dentro de `main`, el script no se ejecuta y los dos párrafos legítimos siguen ahí.
17. `live4f.spec.mjs` pasa 11/11 contra el árbol entregado y falla 11/11 contra el anterior.
18. El harness completo pasa 86/86.
19. No hay strings en inglés nuevos en Liquid: el pager usa `general.pagination.previous`, `general.pagination.next` y `products.product.view_media`; el contador solo lleva números y "/".
20. No hay `git commit` ni `git push` de este sprint.
