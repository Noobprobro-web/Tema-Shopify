# Auditoría visual en vivo: sartorial-atelier.myshopify.com

- Fecha: 2026-10-01
- Alcance: solo lectura. No se modificó ningún archivo del tema, ningún dato de la tienda ni nada del repositorio fuera de esta carpeta. El carrito de prueba se vació al final con `POST /cart/clear.js` (estado final `item_count: 0`, desktop y móvil).
- Viewports: desktop 1440x900 y móvil 390x844 (isMobile + touch). Capturas de página completa; las páginas largas se recortaron en `tiles/` para leerlas.
- Navegación: Playwright con `harness-AUDIT-FINAL-002/lib.mjs` (cookies cacheadas, una navegación cada 2,5 s, un solo proceso). Hubo cuatro 429 de Cloudflare; el helper esperó y reintentó. No se cuentan como defectos.
- Scripts y resultados en bruto: `01-home.mjs` … `08-misc.mjs`, `results-*.json`.

> **Aviso sobre el menú (cambió durante la auditoría).** En la primera pasada (`01-home.mjs`, `02-header.mjs`) "Catalog" era un enlace plano: ni hover ni clic abrían nada, y el clic llevaba a `/collections/all` (`header-desktop-hover-catalog.png`). Unos minutos después, en todas las pasadas siguientes, el menú principal ya tenía elementos anidados y "Catalog" se renderizaba como mega menú (`results-04-header-recheck.json`). Alguien cambió la configuración del menú mientras yo auditaba. Abajo se reportan los dos estados.

---

## 1. Hallazgos (ordenados por severidad)

### P1 (roto)

**P1-1. Las páginas de políticas (`/policies/*`) no tienen estilos del tema: títulos gigantes cortados a mitad de palabra en una columna estrecha y sin márgenes verticales.** Es lo que el dueño describe como "márgenes dañados".
- Páginas: las 5 políticas, en desktop y en móvil. La peor es `terms-of-service`.
- Evidencia: `policy-terms-of-service-desktop.png` (y `tiles/policy-terms-of-service-desktop-00…03.png`), `policy-terms-of-service-mobile.png`, `policy-contact-information-desktop.png`, `tiles/policy-privacy-policy-desktop-01.png`, `policy-refund-policy-mobile.png`.
- Medidas reales (`results-07-policies.json`):

| | Desktop 1440 | Móvil 390 |
|---|---|---|
| `.shopify-policy__container` | max-width 511,68px (65ch), centrado; left/right = 464px; padding 20px | ancho 390, padding 20px |
| Texto (`.shopify-policy__body .rte`) | x = 484 → 956 (472px de ancho) | x = 20 → 370 |
| Contenedor del header / footer (`.container`) | x = 70 → 1370 (1300px) | x = 20 → 370 |
| h1 | **117,6px** Libre Baskerville, centrado | 42px |
| h2 | **75,6px**, margin-top 0 | 33,6px, margin-top 0 |
| p | 16px / 25,6px, margin-bottom 16px | igual |
| Hueco header → h1 | **0px** (el contenedor empieza en y = 122, justo donde termina el header) | 0px |
| Hueco último párrafo → footer | **0px** | 0px |

- Qué se ve:
  - Desktop: "Terms / of / service" ocupa tres líneas de 117px. Cada h2 ("Section 1 – Online store terms") ocupa 3 o 4 líneas de 75px dentro de una columna de 472px.
  - **Palabras partidas a mitad**: "Informatio / n" (Terms §9 y Privacy "Personal Informatio / n Sources") y "Contact inform / ation" en el h1 de contact-information.
  - El h1 va centrado y el cuerpo alineado a la izquierda.
  - La columna de 472px no se alinea con el gutter de 70px del header ni del footer.
  - Entre párrafo y h2 solo hay 16px. El título toca el header y el último párrafo toca el footer.
  - En móvil el gutter lateral (20px) sí coincide con el del header, así que no hay texto de borde a borde. El problema en móvil es la jerarquía: h2 de 33,6px casi del tamaño del h1 (42px), con 0px encima y 16px debajo del párrafo anterior.
- Causa en el código:
  - Shopify sirve `/policies/*` con su propio marcado (`.shopify-policy__container`, `.shopify-policy__title`, `.shopify-policy__body > .rte`) dentro de `<main class="site-main">` (`layout/theme.liquid:129-130`, sin padding). La única hoja que lo estiliza es la de Shopify, `policy-*.css`: `.shopify-policy__container{max-width:65ch;margin:0 auto;padding:0 20px}` y `.shopify-policy__title{text-align:center}`.
  - El repo no tiene **ninguna** regla para estas clases: `grep -rn "shopify-policy"` sobre assets, sections, snippets, layout y templates devuelve 0 resultados.
  - Por eso los encabezados heredan las escalas de display globales: `assets/base.css:218-222` (h1 = `clamp(2.5rem, 9vw, 7rem) × --font-heading-scale` → 117,6px) y `assets/base.css:224-228` (h2 = `clamp(2rem, 5vw, 4.5rem)` → 75,6px). `assets/base.css:188-198` pone `margin-block-start: 0` y `:201-216` pone `margin-block-end: 0`.
  - `.rte` (`assets/base.css:340-356`) no reduce la escala de los encabezados.
  - El corte a mitad de palabra viene de `body { overflow-wrap: anywhere; }` (`assets/base.css:116`) combinado con encabezados más anchos que la columna.
  - El tema ya trae un tratamiento cuidado para textos legales, pero solo se aplica a la sección `main-policy` (plantilla `templates/page.policy.json` → `sections/main-policy.liquid:18,57`, CSS `.main-policy__body` en `assets/base.css:7500-7527`: 70ch, h2 a `clamp(1.375rem, 2.5vw, 1.75rem)`, ritmo vertical con `--space-*`). Esa sección no actúa sobre `/policies/*`.
  - Arreglo sugerido (no aplicado): añadir reglas para `.shopify-policy__container/__title/__body` que reutilicen las de `.main-policy__*` (padding vertical, h1/h2 a escala de lectura, `overflow-wrap: normal` en encabezados).

### P2 (feo o confuso)

**P2-1. Dos sistemas de gutter: las secciones no se alinean entre sí ni con el header.**
- Página: home, desktop (`tiles/home-desktop-00…06.png`, `results-02-header.json > gutters`). En móvil la diferencia es 16 frente a 20px y se nota menos.
- A 1440px, el header, featured-product, newsletter y footer empiezan en x = 70. Curated-showcase, lookbook, complete-the-look y brand-manifesto empiezan en x = 32. Al bajar por la home, el borde izquierdo salta 38px tres veces (por ejemplo, el título "Serra Coat" y su imagen quedan metidos respecto a "Objects in quiet conversation").
- Causa: `.container` = `min(100% - 2×--page-gutter(20px), --page-width 1300px)` (`assets/base.css:29-30, 299-300`), mientras que las secciones editoriales usan `min(100% - 2×--page-gutter-desktop(32px), --container-max-width 1440px)` (`assets/base.css:32-33, 3086-3087, 3820-3823, 4168-4170, 4801-4803`).

**P2-2. Dos formularios de newsletter casi idénticos seguidos.**
- Página: home, desktop y móvil (`tiles/home-desktop-05/06.png`, `tiles/home-mobile-04/05.png`).
- La sección "Notes from the atelier" va inmediatamente seguida del bloque del footer "Notes from the studio", con el mismo texto ("New objects, material studies and private previews, sent with restraint.") y otro campo de email más.
- Causa: configuración. Sección `newsletter` en `templates/index.json` más el bloque de newsletter del footer (`sections/footer-group.json`).

**P2-3. Mega menú: solo se abre con clic, no con hover, y las tarjetas promo están sin imagen.**
- Página: todas, desktop (`header-desktop-catalog-hover-v2.png` vs `header-desktop-catalog-click-v2.png`).
- Con hover, `aria-expanded` sigue en `false` y no se abre nada. Con clic se abre bien: "View all Catalog", columnas "Collections" y "Signature pieces", y dos promos de solo texto ("New Arrivals", "Capsule Wardrobe") que dejan un gran hueco vacío en el centro.
- Causa: comportamiento de disclosure por clic (`assets/theme.js:180`, `snippets/mega-menu.liquid`). Las promos usan las imágenes `image_n` del bloque `mega_menu_promo`, que no están cargadas (`snippets/mega-menu.liquid:96-141`). Es configuración de la tienda.
- El texto "View all Catalog" sale de `general.navigation.view_all` = "View all {{ title }}" (`locales/en.default.json:14`, `snippets/mega-menu.liquid:78`) y suena raro (P3).

### P3 (pulido)

| # | Página / viewport | Captura | Problema | Causa probable |
|---|---|---|---|---|
| P3-1 | Drawer de menú móvil | `header-mobile-drawer-open.png`, `header-mobile-drawer-catalog-expanded.png` | Línea divisoria y bloque vacío bajo los enlaces: el contenedor de localización se pinta aunque no haya selectores. | `sections/header.liquid:123-125` envuelve `localization-selectors` sin condición; `assets/base.css:6407-6410` le da padding y borde superior. |
| P3-2 | PDP desktop y móvil | `pdp-nove-blazer-desktop-qty1.png` vs `pdp-nove-blazer-desktop-qty3.png` | Al pasar de 1 a 2 en cantidad aparece la línea "Total for N" y empuja todo lo de abajo unos 31px (salto de layout). | `.product-form__line-total[data-empty]{display:none}` (`assets/base.css:4995-4997`). Reservar la altura evitaría el salto. |
| P3-3 | PDP y featured-product | `pdp-nove-blazer-desktop-qty1.png`, `tiles/home-desktop-03.png` | "BUY IT NOW" (botón dinámico de Shopify) tiene otro peso y tracking que "ADD TO CART" (700, mayúsculas con tracking). | Estilo propio del botón acelerado de Shopify; el tema no lo iguala. |
| P3-4 | PDP | idem | La etiqueta "Size: 34" va 4px más adentro (x = 953) que "Quantity", el precio y el título (x = 949). | Padding por defecto de `legend`/`fieldset` en el selector de variantes. |
| P3-5 | Todas las PDP | `pdp-silk-charmeuse-blouse-mobile-qty3.png` | Todos los productos muestran el eyebrow "LINEA NOVE": la blusa, el tote, etc. | Datos: los 24 productos tienen `vendor = "LINEA NOVE"` (`results-08-misc.json`); el bloque vendor lo imprime (`sections/main-product.liquid:192-195`). |
| P3-6 | PDP | `tiles/pdp-nove-blazer-desktop-full-00.png` | Copy contradictorio: "Returns subject to our store policy" junto a un acordeón titulado "Shipping & complimentary returns". La featured-product de la home dice "Complimentary express courier \| Dispatched within 24 hours" para otro producto. | Contenido o metacampos del producto. |
| P3-7 | Búsqueda `?q=bag` | `search-bag-desktop.png` | "bag" devuelve "Structured Tote", un producto que encaja más con la tienda Edition que con Atelier. | Datos: `structured-tote` está en el catálogo de Atelier (`/products.json`). |
| P3-8 | 404 desktop | `404-desktop.png` | El input de búsqueda mide 164px y el placeholder se corta: "Search products anc…". | Ancho del formulario en `sections/main-404.liquid` (columna izquierda estrecha). |
| P3-9 | Colecciones, móvil | `tiles/coll-all-mobile-00.png` | Los filtros (Availability, Price, Sort, Apply) van en línea antes del grid y empujan el primer producto a y ≈ 670. Con 1 producto por fila, `/collections/all` mide unos 16.500px. | Decisión de diseño (`sections/main-collection.liquid`). Valorar un drawer de filtros en móvil. |
| P3-10 | `/collections/all` | `coll-all-desktop.png` | El título es "Products" (nombre por defecto de Shopify). | Configuración: no hay una colección con handle `all` y un título propio. |
| P3-11 | Colecciones, desktop | `tiles/coll-all-desktop-01.png` | La tarjeta promo "Cloth remembers the shape of daily life" deja unos 400px de bloque mostaza vacío entre el texto y el botón (iguala la altura de la tarjeta de imagen). | Tarjeta promocional del grid estirada a la altura de la fila. |
| P3-12 | Cajón y `/cart` | `cart-drawer-desktop-added.png`, `cart-page-desktop.png` | El subtotal muestra "$2,300.00 USD" y el resto del sitio "$1,150.00" sin divisa. La línea muestra el total de línea sin el precio unitario. En `/cart` sigue el botón "UPDATE CART" aunque el JS ya actualiza en vivo. | Uso de `money_with_currency` en subtotal (convención aceptable); plantilla del carrito. |
| P3-13 | Home, lookbook | `tiles/home-desktop-02.png` | El hotspot 4 cae sobre el suelo, sin ninguna prenda debajo. | Configuración de coordenadas del hotspot. |
| P3-14 | Contacto | `page-contact-desktop.png` | "Direct studio contacts" lista áreas ("Showroom appointments / Tuesday through Friday") sin email ni teléfono. Arriba dice "Monday to Friday". | Contenido de la sección. |
| P3-15 | Home, curated showcase, móvil | `tiles/home-mobile-00.png` | La pestaña "[03] TA…" se corta en el borde. Es scroll horizontal intencionado, pero no hay degradado ni otra pista de que se puede desplazar. | Diseño de pestañas en `sections/curated-showcase.liquid`. |

---

## 2. Lo que funciona bien (verificado)

- **Sin scroll horizontal**: `scrollWidth == clientWidth` en todas las páginas a 390 y a 1440 (home, 4 colecciones, 2 PDP, carrito, 5 políticas, contacto, búsqueda, 404). Solo la pista del marquee sale del viewport, que es lo esperado.
- **Sin imágenes rotas, sin placeholders, sin "translation missing"** en ninguna página.
- **Total de línea en la PDP: correcto y limpio.**
  - Nove Blazer: cantidad 3 con el botón + muestra "Total for 3 **$3,450.00**" (1.150 × 3). Silk Charmeuse Blouse: "Total for 3 **$1,560.00**" (520 × 3).
  - El precio unitario de arriba no cambia. El texto "Regular price" es `visually-hidden` y no aparece en pantalla, ni en el precio ni en el total.
  - Formato de moneda correcto, sin solapes, en desktop y móvil.
  - Capturas: `pdp-*-qty1.png` / `pdp-*-qty3.png`.
- **Cambio de variante**: elegir la talla 42 actualiza la etiqueta "Size: 42", el estado del botón y la URL `?variant=`, y el total de línea se mantiene. No se puede comprobar el cambio de precio o de imagen porque en esta tienda todas las variantes tienen el mismo precio y no tienen imagen propia (`results-05-pdp.json > productJson`). Capturas: `pdp-*-variant-switched.png`.
- **Carrito**:
  - Añadir abre el drawer con el mensaje "Item added to your cart" (`cart-drawer-*-added.png`).
  - El + del drawer sube a 2 y el subtotal se recalcula a $2,300.00 (`cart-drawer-*-qty2.png`).
  - `/cart` coincide con el drawer (`cart-page-*.png`).
  - El carrito se vació al final.
- **Mega menú (estado nuevo)**: se abre con clic, la flecha gira, el panel queda alineado con el gutter del header. El drawer móvil muestra el árbol anidado con su disclosure (`header-mobile-drawer-catalog-expanded.png`). Esc cierra el drawer.
- **Header y footer**: logo centrado, iconos alineados, burbuja del carrito con contador, footer con métodos de pago y enlaces de políticas.
- **Colecciones**: filtros Availability/Price, Sort, selector de grid de 2 o 4 columnas (1 o 2 en móvil), Quick add en móvil, conteo de productos correcto (24 / 8 / 17 / 5).
- **Contacto, búsqueda y 404**: maquetación cuidada. La 404 responde con status 404 y propone productos.
- **Consola**: sin errores del tema. Solo aparece ruido de Shopify/Shop Pay (CSP de shop.app, 403 de pay, avisos de preload y de WOFF2).

## 3. Índice de capturas

- Home: `home-desktop.png`, `home-mobile.png`
- Header: `header-desktop-hover-catalog.png` (menú plano), `header-desktop-catalog-hover-v2.png`, `header-desktop-catalog-click-v2.png`, `header-mobile-drawer-open.png`, `header-mobile-drawer-open-v2.png`, `header-mobile-drawer-catalog-expanded.png`
- Colecciones: `coll-{all,new-forms,permanent,tailoring}-{desktop,mobile}.png`
- PDP: `pdp-{nove-blazer,silk-charmeuse-blouse}-{desktop,mobile}-{full,qty1,qty3,variant-switched}.png`
- Carrito: `cart-drawer-{desktop,mobile}-{added,qty2}.png`, `cart-page-{desktop,mobile}.png`
- Políticas: `policy-{terms-of-service,privacy-policy,refund-policy,shipping-policy,contact-information}-{desktop,mobile}.png`
- Otras: `page-contact-*.png`, `search-bag-*.png`, `404-*.png`
- Recortes: `tiles/`
