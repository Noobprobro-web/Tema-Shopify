# Auditoría visual (solo lectura): sartorial-archive.myshopify.com

- Fecha: 2026-10-01. Viewports: escritorio 1440x900 (`d-*`) y móvil 390x844 (`m-*`), con capturas de página completa y de viewport (`*-top.png`).
- Método: Node + Playwright con `harness-AUDIT-FINAL-002/lib.mjs` (`unlock` con cookies cacheadas y navegación espaciada). Un solo proceso cada vez y ningún 429 durante la sesión.
- Scripts: `01-pages.mjs` (capturas y métricas de 14 URL x 2 viewports), `02-interactions.mjs` (menú, drawer, filtros, PDP, carrito y métricas de políticas), `03-probes.mjs` (sondas puntuales). Los datos en bruto están en `results-01-pages.json`, `results-02-interactions.json` y `results-03-probes.json`.
- No se tocó el tema ni los datos de la tienda. El carrito se vació al final con `POST /cart/clear.js`: `item_count` = 0 en los dos contextos.

**Artefactos de captura, que no son defectos:** en las capturas de página completa la cabecera sticky y el enlace "Skip to content" salen pintados a media página. Es un efecto de `fullPage` de Playwright sobre elementos `position: fixed/sticky`. El `.skip-link` está fuera de pantalla (`transform: translateY(-107px)`) y no aparece en ninguna captura de viewport. Algunas capturas `m-*-top.png` salen desplazadas porque `scroll-behavior: smooth` estaba animando el `scrollTo(0,0)`.

**Cambio de configuración durante la auditoría:** en la primera pasada (`d-404-top.png`, `d-pdp-jacket-top.png`) "CATALOG" aparece sin chevron, es decir, sin desplegable. En la segunda pasada, minutos después (`d-header-closed.png`, `d-header-catalog-click.png`), el menú `main-menu` ya tenía hijos y se abre un mega menú. Alguien modificó el menú de la tienda mientras corría la auditoría. Lo que sigue describe el estado final.

---

## Hallazgos

### P1: roto

**P1-1. Las páginas de políticas (las 5, y sobre todo Terms of service) salen sin estilos del tema: titulares gigantes, palabras partidas, margen cero arriba y abajo.**
- URL: `/policies/terms-of-service` (también privacy, refund, shipping y contact-information), en escritorio y móvil.
- Capturas: `d-pol-terms.png`, `d-pol-terms-top.png`, `d-pol-terms-mid.png`, `m-pol-terms.png`, `m-pol-terms-top2.png`, `d-pol-privacy.png`, `m-pol-privacy.png`.
- Qué se ve:
  - En escritorio el H1 "Terms of service" mide **123.2px** y se apila palabra a palabra ("Terms / of / service"). Ocupa toda la primera pantalla.
  - Los H2 ("Section 3 – Accuracy of information") miden **79.2px** en una columna de 472px. Salen una o dos palabras por línea y la palabra se **parte a mitad**: "informatio / n" en las secciones 3, 5, 6 y 9 (`d-pol-terms-mid.png`).
  - En móvil el H1 mide 44px y los H2 35.2px, que se ve grande pero no se rompe.
  - El H1 está **centrado** y los H2 y el cuerpo están alineados a la izquierda.
  - Espaciado: **0px** entre el borde inferior del header y el H1, **0px** entre cada H2 y su párrafo, solo 16px entre un párrafo y el H2 siguiente, y **0px** entre el último párrafo y el footer (`h1TopMinusHeaderBottom: 0`, `gapAfterH2: [0,0,0,0]`, `lastTextToFooter: 0`).
  - Gutters en escritorio: el contenedor `.shopify-policy__container` tiene `max-width: 511.68px` (65ch) y `padding: 0 20px`, centrado a 464px de cada borde, con el texto a 484px. La cabecera y el footer usan el gutter del tema (nav y footer a 70px), así que la columna legal queda estrecha y flotando, sin relación con la retícula del resto del sitio. En móvil el texto queda a 20px de cada lado, alineado con el header (20px), así que el problema de "márgenes" en móvil es vertical (0px arriba y abajo) y de escala tipográfica, no lateral.
  - Tamaños de cuerpo: `p` 16px/25.6px con `margin-bottom: 16px`.
- DOM: las rutas `/policies/*` no usan ninguna plantilla del tema. Shopify inyecta `<div class="shopify-policy__container"><div class="shopify-policy__title"><h1>…</h1></div><div class="shopify-policy__body"><div class="rte">…</div></div></div>` directamente en `content_for_layout` (`layout/theme.liquid:129-131`). No se carga ninguna sección (la lista de secciones solo tiene header, footer y cart-drawer).
- Causa en el tema:
  - **Ningún archivo del repo estila `.shopify-policy__container`, `.shopify-policy__title` ni `.shopify-policy__body`.** `grep -rn "shopify-policy"` sobre `assets/ layout/ sections/ snippets/ templates/ listings/ config/ locales/` devuelve 0 resultados.
  - Por eso el H1 y los H2 caen en la escala de portada global: `assets/base.css:218-222` (`h1 { font-size: calc(clamp(2.5rem, 9vw, 7rem) * scale) }`) y `assets/base.css:224-228` (`h2 { clamp(2rem, 5vw, 4.5rem) }`), con `--font-heading-scale` = 1.1.
  - El corte a mitad de palabra viene de `body { overflow-wrap: anywhere; }` en `assets/base.css:116`, heredado por los H2.
  - Los márgenes a 0 vienen del reset `assets/base.css:188-199`/`201-212` (`margin-block-start: 0; margin-block-end: 0` en encabezados).
  - El tema ya tiene un diseño correcto para textos legales: `.main-policy__body` en `assets/base.css:7500-7531` (70ch, H2 a `clamp(1.375rem, 2.5vw, 1.75rem)`, `margin-block-start: var(--space-2xl)`, `h2 + * { margin-block-start: var(--space-sm) }`), además de `.main-policy__title` en `base.css:5335` y en las media queries `:6233` y `:6302`. Pero solo se aplica a `templates/page.policy.json` → `sections/main-policy.liquid` (páginas `/pages/*` con esa plantilla), nunca a `/policies/*`.
  - El centrado del H1 y el `max-width: 65ch` + `padding: 0 20px` del contenedor no vienen del tema: no hay `65ch` ni `shopify-policy` en `base.css`. Es el estilo por defecto que pone Shopify y que el tema no sobrescribe.
- Arreglo probable (no aplicado): reglas en `base.css` para `.shopify-policy__container` (ancho y padding con `.container`/`--page-gutter`, `padding-block: var(--section-spacing)`), `.shopify-policy__title h1` (escala de `.main-policy__title`, alineada a la izquierda) y `.shopify-policy__body h2/h3/p` (reutilizar las reglas de `.main-policy__body`, con `overflow-wrap: normal` en los títulos).

### P2: feo o confuso

**P2-1. En un producto único agotado el stepper deja subir la cantidad y muestra un total en vivo, por ejemplo "Total for 3 $4,500.00".**
- URL: `/products/1990-pinstripe-double-breasted-jacket`, en escritorio y móvil. Captura: `d-pdp-pinstripe--qty3.png` (y `m-pdp-pinstripe--qty3.png`).
- Datos: `/products/…js` devuelve `available: false` y `quantity_rule.max: null`. En el DOM el input no tiene `max`, el botón **+ está habilitado**, un clic lleva la cantidad a 2 ("Total for 2 $3,000.00") y escribiendo 3 sale "Total for 3 $4,500.00". Todo esto mientras el botón dice "SOLD OUT" y está deshabilitado.
- Causa:
  - `sections/main-product.liquid:401` solo toma `quantity_rule.max`, y `:443` solo deshabilita + si existe ese máximo.
  - `assets/theme.js:965-971` (`updateQuantityRules`) solo fija un máximo de inventario cuando `qty > 0 && qty <= threshold`. Con inventario 0 (agotado) no se pone ningún tope.
  - `updateLineTotal` (`assets/theme.js:895-948`) no comprueba si la variante está disponible.
  - De paso, sin `max` el input numérico de Chrome usa su ancho intrínseco por defecto, y por eso el stepper mide **259px** en la chaqueta frente a **126px** en el pañuelo (`d-pdp-jacket-top.png` frente a `d-pdp-silk-top.png`). La rejilla es `minmax(2.25rem, 1fr)` en `assets/base.css:2458`.
- Nota de datos de tienda: el brief dice "stock 1", pero la chaqueta está **agotada** en la tienda (`available: false`; el filtro muestra "Out of stock 1"). Probablemente quedó así por un pedido de prueba anterior.

**P2-2. En el cart drawer y en /cart el botón + sigue activo para una pieza única y el mensaje de error es engañoso.**
- URL: drawer tras "Add to cart" de `1997-printed-silk-square`, y `/cart`, en escritorio y móvil. Capturas: `d-cart-drawer-open.png`, `d-cart-drawer-plus.png`, `m-cart-drawer-open.png`, `d-cart-page-top.png`.
- Qué se ve: con la cantidad en 1, + está habilitado. Al pulsarlo, el drawer muestra "**Only 1 item was added to your cart due to availability.**", cuando en realidad no se añadió nada y el ítem ya estaba en el carrito. En /cart el + también está activo.
- Causa: `sections/cart-drawer.liquid:227` y `:256`, y `sections/main-cart-items.liquid:120`, solo usan `item.variant.quantity_rule.max` y no la existencia en inventario. El texto es el `description` del 422 de Shopify, que el tema muestra tal cual.
- En la PDP del pañuelo (disponible, inventario 1) el comportamiento **sí es correcto**: `max="1"`, + deshabilitado, escribir 3 vuelve a 1 y no aparece total en vivo (por diseño solo sale cuando la cantidad es mayor que 1, `theme.js:917-922`).

**P2-3. Página de contacto: los H2 son más grandes que el H1.**
- URL: `/pages/contact`, escritorio. Captura: `d-page-contact.png`.
- Qué se ve: "Your inquiry" y "Before you write" (H2, 79.2px) se ven más grandes que el título de página "Contact" (H1, 4rem x 1.1 = 70.4px). "Before you write" ocupa dos líneas. La jerarquía queda invertida. En móvil no pasa.
- Causa: `sections/main-contact.liquid:60` y `:162` son `<h2>` sin clase, así que heredan la escala global de `assets/base.css:224-228` (`clamp(2rem, 5vw, 4.5rem)`), mientras que `.main-contact__title` está acotado en `base.css:5337`, `:6235` y `:6304`.

**P2-4. Las tarjetas promo del mega menú salen sin imagen, con un gran hueco y copy que no encaja.**
- URL: cualquier página, escritorio, clic en "CATALOG". Captura: `d-header-catalog-click.png`.
- Qué se ve: el mega menú abre bien (clic, `aria-expanded=true`, panel de 1440x325, Escape lo cierra). Pero las dos tarjetas de la derecha ("New Arrivals / Explore the autumn edit" y "Capsule Wardrobe / Pieces made in small series") salen solo como texto, **sin imagen**: el DOM no contiene `<img>`. Ambas enlazan a `/collections/all`. Su copy (novedades de otoño, series pequeñas) contradice el concepto de archivo de piezas únicas.
- Causa (configuración): `sections/header-group.json:28-39` referencia `shopify://shop_images/manifesto-01.jpg` y `capsule-look-01.jpg`. En la tienda archive no se resuelven (no hay imagen renderizada), seguramente porque esos ficheros no existen en Files de esta tienda o porque el header-group desplegado es el genérico del repo y no uno propio de la variante (no hay `listings/archive/sections/header-group.json`). El snippet `snippets/mega-menu.liquid:100-153` pinta la tarjeta aunque no haya imagen.
- Hover: pasar el ratón por encima de "CATALOG" **no** abre nada (`d-header-catalog-hover.png`). Solo abre con clic. Es coherente con `<theme-disclosure>`, pero conviene saberlo.

**P2-5. El producto destacado de la home es la chaqueta agotada.**
- URL: `/`, escritorio y móvil. Captura: `d-home.png` (sección `featured_product`).
- Qué se ve: el bloque grande de producto de la home muestra "SOLD OUT", pastillas tachadas ("Restored ×", "FR 40 / US 8 ×") y el botón deshabilitado. En la colección Restored Pieces y en el 404 pasa igual. También es el primer elemento de "Signature pieces" en el mega menú.
- Causa: datos de la tienda (inventario de `1990-pinstripe-double-breasted-jacket` = 0) más la elección del producto en `listings/archive/templates/index.json` (`featured_product`). No es un defecto del tema.

**P2-6. Los filtros en móvil ocupan la primera pantalla de la colección.**
- URL: `/collections/all` y las demás colecciones, móvil. Capturas: `m-facets-open.png`, `m-coll-restored.png`.
- Qué se ve: "Filter and sort" (Availability, Price, Sort by y APPLY) va en línea encima de la rejilla, sin drawer ni botón para mostrarlos u ocultarlos. El primer producto empieza a unos 780px. Funciona, pero el primer producto no aparece en la primera pantalla.
- Causa: `sections/main-collection.liquid:57-240`, un `<form class="facets">` siempre visible con `<details>` por filtro. No hay variante de drawer en móvil.

### P3: pulido

| # | Página / viewport | Captura | Problema | Causa probable |
|---|---|---|---|---|
| P3-1 | `/` (marquee) frente a `/pages/contact` | `d-home.png`, `d-page-contact.png` | Incoherencia de copy: el marquee dice "PRIVATE APPOINTMENTS IN KYOTO & PARIS", la home "Acquired from private estates in Paris & Antwerp" y contacto "Showroom: By appointment / Milan" | `listings/archive/templates/index.json:58` (marquee), `:35`; `templates/page.contact.json:73` (y default `sections/main-contact.liquid:251`) |
| P3-2 | `/pages/contact` | `d-page-contact.png` | "Studio hours: Monday to Friday" frente a "Showroom appointments: Tuesday through Friday". "Direct studio contacts" no da ningún email ni teléfono. La FAQ menciona "Made-to-order work" en una tienda de piezas únicas | `templates/page.contact.json:42`, `:72` (contenido genérico, no hay versión archive en `listings/archive/templates/`) |
| P3-3 | `/collections/all` | `d-coll-all.png` | El título de la colección es "Products", el genérico de Shopify para `/collections/all`, mientras el menú la llama "Catalog" | Configuración de la tienda (sin colección `all` personalizada) |
| P3-4 | `/products/does-not-exist`, escritorio | `d-404-top.png` | El campo de búsqueda mide 164px y el placeholder se corta: "Search products anc…" | `sections/main-404.liquid` (fila input+botón en una columna estrecha); en móvil se ve bien (350px) |
| P3-5 | `/products/does-not-exist` | `d-404-top.png`, `m-404.png` | "POPULAR PIECES / CONTINUE EXPLORING" va en serif con mayúsculas a tamaño medio, un estilo que no se repite en ningún otro título del tema | `sections/main-404.liquid` (estilo del encabezado de recomendaciones; no localizado en CSS) |
| P3-6 | Drawer y /cart | `d-cart-drawer-open.png`, `d-cart-page-top.png` | Formato de moneda mixto: línea "$450.00" frente a subtotal "$450.00 USD" | `sections/cart-drawer.liquid:475`, `sections/main-cart-items.liquid:195` (`money_with_currency`) |
| P3-7 | Menú móvil abierto | `m-menu-drawer-open.png`, `m-menu-drawer-catalog.png` | Línea divisoria huérfana bajo "Contact" sin nada debajo (no hay selector de país ni idioma) | `assets/base.css:6407-6410` (`.mobile-nav__localization` con `border-block-start` y padding aunque esté vacío); `sections/header.liquid:123-125` |
| P3-8 | PDP, escritorio | `d-pdp-silk-top.png` | El punto del indicador de inventario ("Low stock: 1 left") sobresale unos 4px a la izquierda de la columna, y las etiquetas "Condition:"/"Size:" van 4px más adentro que "Quantity". Para una pieza única, "Low stock: 1 left" suena a stock de catálogo y no a "1 of 1" | `snippets/product-inventory.liquid` y estilos de fieldset/legend de variantes (observación visual, no medida a fondo) |
| P3-9 | PDP | `d-pdp-silk-top.png` | "ADD TO CART" va en negrita y "BUY IT NOW" (botón dinámico de Shopify) en peso normal | Estilo del dynamic checkout no igualado |
| P3-10 | `/collections/restored-pieces`, escritorio | `d-coll-restored.png` | La tarjeta editorial "The record begins with the maker" se estira a toda la altura de la fila (unos 590px), con el texto arriba, el botón abajo y un gran bloque marrón vacío en medio | Probable: la tarjeta editorial de `sections/main-collection.liquid` se estira a la altura de la fila de la rejilla (no verificado en CSS) |
| P3-11 | Colecciones, móvil | `m-coll-all.png`, `m-coll-restored.png` | Todas las tarjetas muestran "CHOOSE OPTIONS" aunque cada producto tiene una sola variante (Condition y Size con un valor cada una) | `snippets/product-card.liquid:362`/`:444` (decide por opciones, no por número de variantes) |
| P3-12 | `/` | `d-home.png` | Dos altas de newsletter seguidas: la sección "New entries in the archive" y, justo debajo, "Notes from the studio" en el footer | `listings/archive/templates/index.json` (sección newsletter) más el bloque newsletter del footer |

---

## Lo que está correcto

- **Sin scroll horizontal** en ninguna de las 14 URL a 390px ni a 1440px (`scrollWidth == clientWidth` en todas, `results-01-pages.json`). No hay imágenes rotas, ni "translation missing", ni errores de Liquid, ni placeholders.
- Home: hero, manifiesto, marquee (con botón de pausa), pestañas de colecciones, lookbook con hotspots, producto destacado, newsletter y footer se ven bien en los dos viewports (`d-home.png`, `m-home.png`).
- Header: "HOME / CATALOG / CONTACT", logo centrado e iconos. El mega menú de Catalog abre con clic y cierra con Escape (`aria-expanded` sincronizado). El drawer móvil abre (`aria-expanded=true`), el submenú Catalog se despliega con su jerarquía (`m-menu-drawer-catalog.png`) y la tecla Escape lo cierra.
- Colecciones: 12, 12 y 3 productos. Filtros Availability (In stock 11 / Out of stock 1) y Price, Sort by con 9 opciones y conmutador de rejilla. Las tres colecciones se ven bien en escritorio.
- PDP del pañuelo (pieza única disponible): `max=1`, + y − deshabilitados, escribir 3 se recorta a 1, no aparece total de línea porque la cantidad es 1, y el precio sale como "$450.00".
- **"Regular price" no se filtra a la vista:** la cadena está en un `<span class="visually-hidden">` dentro de `.price` y del total de línea, y no aparece en ninguna captura. No hay solapes en el bloque de precio. El total en vivo, cuando aparece, calcula bien (2 x $1,500 = $3,000.00 y 3 x $1,500 = $4,500.00); el problema es que aparezca en un producto agotado (P2-1).
- Carrito: el drawer abre al añadir, con miniatura, opciones, subtotal y CHECKOUT/View cart (`d-cart-drawer-open.png`, `m-cart-drawer-open.png`). /cart muestra la línea, el subtotal, UPDATE CART y CHECKOUT, sin overflow en móvil.
- `/search?q=silk`: 4 resultados, pestañas All/Products/Journal/Pages, filtros y orden por relevancia (`d-search-silk.png`).
- 404: devuelve status 404, "Object not found.", búsqueda, "Return to collection" y 3 productos sugeridos.
- `/pages/contact`: formulario, FAQ en acordeón y bloque de contactos sin roturas en móvil (`m-page-contact.png`). Es la única página `/pages/*` enlazada en el header, el footer y los menús.
- Footer: logo, newsletter, enlaces a las 5 políticas, iconos de pago y copyright. Gutters de 70px en escritorio y 20px en móvil, alineados con el header.
