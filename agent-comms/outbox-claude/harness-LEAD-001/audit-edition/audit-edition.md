# Auditoría visual en vivo: sartorial-edition.myshopify.com

- **Fecha:** 2026-10-01
- **Alcance:** solo lectura. No se modificó ningún archivo del tema ni dato de la tienda. El carrito de prueba se vació al final con `POST /cart/clear.js`; `item_count` quedó en 0 en las dos sesiones.
- **Viewports:** escritorio 1440x900 y móvil 390x844.
- **Método:** Node + Playwright con `harness-AUDIT-FINAL-002/lib.mjs` (cookies cacheadas y navegación espaciada). Un solo proceso a la vez. No hubo ningún 429.
- **Archivos:** los scripts `01-…07-*.mjs`, los resultados `results-0N.json` y las capturas están en esta carpeta.

> **Aviso de deriva durante la auditoría.** En la primera pasada (script 01), el menú principal era plano (Home / Catalog / Contact) y no había desplegable. Minutos después (scripts 02 y 03), "Catalog" ya tenía hijos y nietos y abría un **mega menú**. Alguien cambió el menú de la tienda mientras auditaba. Se informan los dos estados.

## Leyenda de severidad

- **P1:** roto.
- **P2:** feo o confuso.
- **P3:** pulido.

---

## Hallazgos

### P1-01. Las páginas de políticas de Shopify no tienen estilo del tema; "Terms of service" se ve roto

- **URL:** `/policies/terms-of-service`. Afecta igual a privacy, refund, shipping y contact-information.
- **Viewports:** escritorio y móvil.
- **Capturas:** `policy-terms-of-service-desktop-top.png`, `policy-terms-of-service-desktop.png`, `policy-terms-of-service-mobile-top.png`, `policy-terms-of-service-mobile.png`, `policy-contact-information-desktop.png`.

**Qué se ve**

- **H1 enorme en una columna estrecha.**
  - En escritorio, el H1 mide **112px** ("Terms of service" ocupa 2 líneas centradas) dentro de una columna de **472px**.
  - En "Contact information", el H1 **se parte a mitad de palabra**: "informati / on". Es un defecto visible (P1).
- **H2 a tamaño de titular de portada.**
  - Cada H2 ("Section 1 – Online store terms") mide **72px** en escritorio y 32px en móvil, con `margin-top: 0` y `margin-bottom: 0`.
  - Resultado: bloques de 3 líneas gigantes pegados al párrafo de abajo, sin aire entre secciones.
  - Jerarquía invertida: H2 a 72px frente a párrafos a 16px.
- **Sin padding vertical.**
  - El título empieza exactamente donde acaba la cabecera (`titleTop 122 = headerBottom 122`).
  - El texto acaba exactamente donde empieza el footer (`containerBottom 3852 = footerTop 3852`).
- **Alineación.** El título está centrado y el cuerpo alineado a la izquierda.
- **Medidas de márgenes (via `page.evaluate`):**

| Viewport | Contenedor de la política | Cabecera y footer (`.container`) |
|---|---|---|
| Escritorio | `.shopify-policy__container`: left 464 / right 464, max-width 65ch (511.68px), padding 20px. Cuerpo de 472px. | left/right 70px (ancho 1300) |
| Móvil | left 0 / right 0 con padding 20px, es decir, texto a 20px | 20px |

  - En móvil los márgenes laterales coinciden con la cabecera. El "feo" en móvil viene de la tipografía y del espaciado vertical, no del gutter.

**Contenedores DOM**

```
main#MainContent.site-main
  > div.shopify-policy__container
      > div.shopify-policy__title > h1
      > div.shopify-policy__body > div.rte > h2 / p …
```

Las únicas reglas para esas clases las inyecta Shopify (`policy-0e156355.css`):
- `.shopify-policy__container { max-width:65ch; margin:0 auto; padding-inline:20px }`
- `.shopify-policy__title { text-align:center }`

**Causa probable (tema)**

- `grep` de `shopify-policy` en `assets/`, `sections/`, `snippets/`, `layout/` y `templates/` da **0 coincidencias**. El tema no estiliza `.shopify-policy__*`.
- Las rutas `/policies/*` no usan plantilla del tema. `sections/main-policy.liquid` y su CSS (`assets/base.css:7485-7530`: `.main-policy__body` a 70ch, h2 con `clamp(1.375rem…1.75rem)` y `margin-block-start: var(--space-2xl)`) solo se aplican a páginas con `templates/page.policy.json`. **Nunca llegan a `/policies/*`.**
- Por eso se aplican los estilos globales de encabezado:
  - `assets/base.css:218-221`: `h1 { font-size: calc(clamp(2.5rem, 9vw, 7rem) * var(--font-heading-scale)) }`
  - `assets/base.css:224-227`: `h2 { clamp(2rem, 5vw, 4.5rem) … }`
  - `assets/base.css:187-199` y `201-216`: `margin-block-start: 0` y `margin-block-end: 0`
- El corte "informati/on" viene de `assets/base.css:116` (`body { overflow-wrap: anywhere; }`) combinado con un H1 de 112px en 472px.
- No hay padding de sección porque `main.site-main` (`layout/theme.liquid:129-130`) no aporta padding y el contenedor de Shopify tampoco.

### P2-01. Variantes de color sin imagen propia

- **URL:** `/products/structured-tote` (Finish: Black box calf / Saddle tan / Deep olive) y `/products/milled-brass-paperweight` (Natural brass / Dark patina).
- **Viewports:** los dos.
- **Capturas:** `pdp-structured-tote-desktop-tan-compact-qty3.png`, `cart-drawer-desktop.png`, `cart-page-desktop.png`.

**Qué se ve**
- Al elegir "Saddle tan", el precio y la URL `?variant=` se actualizan, pero la galería sigue mostrando el bolso **negro**.
- El carrito muestra "Finish: Saddle tan" con foto negra.

**Causa: contenido de la tienda.** `/products/structured-tote.js` tiene 1 imagen y las 6 variantes tienen `featured_image: none`. El paperweight tiene 1 imagen y 2 variantes sin media. No es un fallo del JS del tema: el precio sí cambia ($680 → $580 en Compact).

### P2-02. Lista de colecciones con un duplicado y la colección "Home page" visible

- **URL:** `/collections`.
- **Capturas:** `collections-desktop.png`, `collections-mobile.png`.

**Qué se ve:** dos tarjetas "Desk & Study" (6 piezas cada una) y una tarjeta "Home page" (1 pieza).

**Causa: configuración de la tienda.** `/collections.json` devuelve:
- `desk-study | Desk & Study`
- `desk-and-study | Desk & Study`
- `frontpage | Home page`

Hay que borrar o despublicar `desk-study` y ocultar `frontpage`. Además, Desk & Study y Leather Goods usan la misma imagen de portada (el estuche del bolígrafo).

### P2-03. Gutter desktop inconsistente en la home (el borde izquierdo salta 70 → 32 → 70px)

- **URL:** `/` a 1440px.
- **Capturas:** `home-desktop.png`, `home-desktop-manifesto-inview.png`.

**Qué se ve.** Borde izquierdo medido por sección:

| Sección | Borde izquierdo |
|---|---|
| Cabecera | 70 |
| Hero | 33 |
| Discovery | 32 |
| Collections (showcase) | 32 |
| Featured product | 71 |
| Capsule | 32 |
| Manifesto | 32 |
| Newsletter | 70 |
| Footer | 70 |

El logo y el menú no alinean con el contenido de la mayoría de secciones.

**Causa.**
- `.container` usa `min(100% - 2*--page-gutter, --page-width)` (1300px): `assets/base.css:299-300`.
- Hero, bento, showcase, manifesto y complete-the-look usan `--page-gutter-desktop: 32px` y `--container-max-width: 1440px`:
  - `assets/base.css:32-33`
  - `assets/base.css:3751` (hero)
  - `assets/base.css:3818-3824` (showcase, manifesto, bento)
  - `assets/base.css:4800-4804` (complete-the-look)

### P3-01. Mega menú: solo se abre con clic, y las tarjetas promo no tienen imagen y su texto no encaja

- **URL:** `/` en escritorio.
- **Capturas:** `header-desktop-hover-0.png` (hover: no abre), `header-desktop-click-0.png` (clic: abre).
- **Estado inicial (script 01):** sin hijos, sin chevron y sin desplegable, como se esperaba. Captura: `header-desktop-hover-catalog.png`.

**Qué se ve (estado actual)**
- Hover sobre "Catalog" deja `aria-expanded="false"`. Con clic se abre un panel de 1440x324 con:
  - columnas "Collections" (Daily Objects / Leather Goods / Desk & Study)
  - "Signature pieces" (3 productos)
  - dos promos solo de texto: "New Arrivals — Explore the autumn edit" y "Capsule Wardrobe — Pieces made in small series"
- Las promos flotan a la derecha sin imagen y el panel queda desequilibrado.
- "Capsule Wardrobe" y "autumn edit" son copy de moda, no de objetos de escritorio y piel.
- "VIEW ALL CATALOG" suena forzado.
- Las dos promos y "Collections" enlazan a `/collections/all`.

**Causa**
- Apertura solo por clic: decisión documentada en `snippets/mega-menu.liquid:17-19` (`<theme-disclosure>`, "Sin JS nuevo").
- Promos sin imagen: bloque `mega_menu_promo` del header sin `image_1`/`image_2` (`snippets/mega-menu.liquid:100-153`). Es configuración de la tienda.
- Texto "View all …": clave `general.navigation.view_all`.

**En móvil el drawer funciona bien:** acordeón Catalog con jerarquía visible. Captura: `header-mobile-menu-open-2.png`.

### P3-02. Mensaje de envío distinto en home y PDP

- **Capturas:** `home-desktop.png` frente a `pdp-structured-tote-desktop-qty3.png`.
- **Qué se ve:** el featured product de la home dice "Worldwide express courier | Dispatch in 24 hours". El PDP del mismo producto dice el genérico "Delivery times and costs confirmed at checkout / Returns subject to our store policy".
- **Causa.** `listings/edition/templates/product.json:42` y `:49` tienen `delivery_text: ""` y `returns_text: ""`, así que se usa el fallback de `sections/main-product.liquid:655-672`. En cambio, `listings/edition/templates/index.json:101` sí rellena `delivery_text`.

### P3-03. Pestañas del showcase cortadas en móvil sin indicar que se puede deslizar

- **URL:** `/` a 390px.
- **Captura:** `home-mobile-showcase-tabs.png`.
- **Qué se ve:** "[03] LIMITED STU…" queda cortado en el borde. El scroll horizontal funciona (`overflow-x: auto`, scrollWidth 393 > 358) y no desborda la página, pero no hay máscara, degradado ni indicador.
- **Causa:** `assets/base.css:3122-3128` (`.curated-showcase__tabs` sin `mask-image` ni `scroll-padding`).

### P3-04. Dos formularios de newsletter seguidos al final de la home

- **Captura:** `home-desktop.png` y `home-mobile.png` (final de la página).
- **Qué se ve:** la sección "Edition notes — New studies, occasionally" va inmediatamente seguida del bloque "Notes from the studio" del footer, con otro campo de email.
- **Causa:** contenido. La sección `newsletter` está en `listings/edition/templates/index.json` y también hay un bloque newsletter en `sections/footer-group.json`.

### P3-05. Carrito: etiqueta "Quantity" pesada en el drawer

- **Captura:** `cart-drawer-desktop.png`.
- **Qué se ve:** la etiqueta "Quantity" va en negrita y a tamaño de título dentro de una línea compacta. Es un detalle de pulido, no un defecto.

---

## Selector de cantidad y total de línea (punto 4, sin defectos)

| Producto | Qty 1 | Qty 3 (con "+") | ¿Correcto? |
|---|---|---|---|
| Structured tote (Black/Standard) $680 | sin total, oculto (`data-empty`, `display:none`) | "Total for 3 **$2,040.00**" bajo el selector | Sí (680×3) |
| Tote Saddle tan / Compact $580 | — | "Total for 3 **$1,740.00**", recalculado al cambiar variante | Sí |
| Milled brass paperweight $110 | sin total | "Total for 3 **$330.00**" | Sí |

- **Capturas de antes y después:** `pdp-*-qty1.png` y `pdp-*-qty3.png` (escritorio y móvil).
- **"Regular price" no se filtra.**
  - Ese texto está en el DOM dentro de `<s data-line-total-compare hidden>` con `.visually-hidden` (clip `rect(0,0,0,0)`, ancho 0). Por eso aparece en `textContent` pero **no en `innerText` ni en pantalla**.
  - Tampoco se ve junto al precio unitario: el texto visible es solo "$680.00".
- No hay solapes.
- El formato de moneda es correcto (`$2,040.00`).
- El botón "Add to cart" no cambia su texto.
- **Implementación:** `sections/main-product.liquid:448-461`, `assets/theme.js:896-948` y `assets/base.css:4985-5006`.

## Lo que se ve correcto

- **Home:**
  - todas las secciones renderizan contenido;
  - sin imágenes rotas ni placeholders;
  - sin scroll horizontal a 390 (`scrollWidth = clientWidth`).
  - Los huecos en blanco de `home-desktop.png` y `home-mobile.png` (capsule y manifesto) son **un artefacto de la animación de entrada al hacer captura fullPage**. Vistos en viewport están completos (`home-*-capsule-inview.png`, `home-*-manifesto-inview.png`).
- **Bento "Desk & Study":** la tarjeta "[01] System — Objects for the desk" navega a `/collections/desk-and-study` (verificado con clic).
- **Colecciones** `all` (13), `daily-objects` (8), `leather-goods` (10) y `desk-and-study` (6):
  - status 200;
  - filtros de Availability y Price y sort visibles en sidebar (escritorio) y apilados (móvil);
  - conmutador de grid;
  - sin overflow.
  - El "Skip to content" y la cabecera montada sobre el H1 en `collection-all-mobile.png` y `search-q-leather-desktop.png` son artefactos de fullPage. En viewport están bien (`collection-all-mobile-top-viewport.png`, `search-q-leather-desktop-top-viewport.png`).
- **Drawer del carrito:**
  - se abre al añadir, con "Item added to your cart…";
  - el "+" del drawer pasa de 3 a 4 y el subtotal sube de $1,740 a $2,320;
  - `/cart` coincide con `/cart.js` (4 × $580 = $2,320.00 USD);
  - se vació al final.
- **`/pages/contact`:** formulario completo, FAQ en acordeón y bloque de contactos directos. Sin overflow.
- **`/search?q=leather`:** 12 resultados y pestañas All / Products / Journal / Pages.
- **`/search?q=zzzzqqq`:** estado vacío con CTA.
- **404 (`/products/does-not-exist`):** diseñado ("Object not found"), con buscador y productos sugeridos.
- **Páginas `/pages/*` enlazadas:** solo hay `/pages/contact` en cabecera, footer y menús. `/pages/about` y `/pages/faq` dan 404 pero **no están enlazadas**, así que no es un defecto.
- **Drawer de menú móvil:** abre, cierra y muestra la jerarquía.
- **Consola:** solo errores de terceros (CSP de shop.app / Shop Pay, 403 de shop.app). Ninguno del tema.
