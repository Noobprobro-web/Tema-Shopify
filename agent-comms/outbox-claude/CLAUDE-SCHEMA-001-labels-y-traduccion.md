# CLAUDE-SCHEMA-001: Traducción completa de schemas y renombrado de labels

```text
ID: CLAUDE-SCHEMA-001
Autor: Claude
Archivo asociado: en.default.schema.json (360 strings, reemplaza locales/en.default.schema.json)
Cierra: P1-34 (traducción a medias) y la tabla de nomenclatura 4.4 de CLAUDE-BLUEPRINT-001
No consume tokens de GPT para redactar. Solo para aplicar los reemplazos en los .liquid
Fecha: 2026-09-13
```

## Qué resuelve

Hoy el tema está traducido a medias. `settings_schema.json`, `header.liquid`, `footer.liquid` y `custom-liquid.liquid` usan claves `t:`. Las otras 22 secciones hardcodean inglés. Y dentro del propio `settings_schema.json` conviven las dos formas: `show_cart_count` está traducido, `cart_type` y `show_cart_note` no.

Medio camino es peor que cualquiera de los dos extremos, porque un traductor que abra el tema encuentra la mitad de la interfaz fuera de su alcance.

## Los números

- **275 strings literales** repartidos en 26 secciones con schema.
- **185 claves únicas** en el archivo nuevo. La diferencia son 90 duplicados que ahora apuntan al namespace compartido `sections.all.*`.
- **0 claves del mapa faltan** en el JSON. Validado programáticamente: cada `t:` del mapa resuelve a un string real del archivo.

Ese namespace compartido es la decisión estructural del archivo. "Color scheme" aparece en 20 secciones, "Image alternative text" en 8, "Show vendor" en 5. Con claves por sección eso son 33 strings que un traductor traduce 33 veces y que se desincronizan en cuanto alguien edita una. Con `sections.all.*` son 3.

## Cómo aplicarlo

1. Reemplazar `locales/en.default.schema.json` por el archivo adjunto.
2. En cada `.liquid`, cambiar cada valor literal por su clave según la tabla de abajo.
3. Correr `shopify theme check`. La regla que valida claves de schema debe quedar en cero.

El paso 2 es mecánico y es lo único que necesita a alguien tocando archivos. Si GPT sigue sin tokens, se puede hacer a mano sección por sección, empezando por las que el merchant ve primero: `hero-editorial`, `main-product`, `main-collection` y `cart-drawer`.

## Renombrados aplicados, y por qué

Estos no son traducciones, son cambios de texto. Vienen de las diez reglas de nomenclatura de la sección 4.3 del blueprint.

| Antes | Ahora | Regla |
| --- | --- | --- |
| Atelier gift threshold | Gift amount, con `info` sobre el descuento automático | Sin vocabulario de marca en el editor |
| Free shipping threshold | Free shipping amount, con `info` sobre la tarifa de envío | Declarar la dependencia externa |
| Show tiered rewards progress | Show free shipping and gift progress | Nombrar el resultado, no el mecanismo |
| Cross-sell heading | Suggested products heading | Sin jerga de industria |
| Fallback cross-sell collection | Collection to suggest from | Sin jerga |
| Preferred popover position | Product card position | "Popover" es término de developer |
| Recommendation intent | Recommendation type, con `info` sobre Search & Discovery | "Intent" es nombre de parámetro de API |
| Fewer columns / More columns | Two per row / Four per row | Opciones nombradas por resultado |
| Desktop columns: Two / Three / Four | Two per row / Three per row / Four per row | Igual |
| Media layout: Stack / Grid | Single column / Two columns / Large image with thumbnails | Igual, y agrega el tercer modo del blueprint |
| Editorial split hero | Editorial hero | El nombre describía uno de dos modos |
| Eyebrow | Small label | Nadie fuera de diseño editorial sabe qué es un eyebrow |
| Atmosphere image, Material image, Editorial image | Image | Vocabulario de marca en el editor |
| Media label | Image label | Igual |
| Atelier signature (bloque) | Signature | Igual |
| Featured object (bloque) | Featured product | Igual |
| Editorial spotlight image | Spotlight image | Igual |
| Featured collection card / Editorial card | Collection card / Story card | Más corto y más claro |
| Bento discovery | Mixed content grid | "Bento" es jerga de diseño de 2024 |
| Interactive lookbook | Shoppable image | Dice qué hace |
| Complete the look | Shop the set | Dice qué hace |
| Curated showcase | Collection tabs | Dice qué es |
| Editorial marquee | Scrolling text | Dice qué es |
| Brand manifesto | Brand statement | "Manifesto" suena a interno |
| Newsletter | Email signup | Terminología de Shopify |
| Main 404 / Main cart / Main collection / Main product ... | 404 page / Cart page / Collection page / Product information ... | "Main" es nombre de archivo, no de sección |
| Enable sticky cart bar | Show sticky add to cart bar | Sentence case y verbo consistente con los demás "Show" |
| Use tonal surface background | Use a tinted background | Sin jerga |
| Keep only one FAQ open | Open one question at a time | Se lee mejor |
| Direct contacts color scheme | Contact cards color scheme | Coincide con el nombre del bloque |
| Position in product grid | Place after this many products | Dice qué hace el número |

Los nombres de sección visibles en el editor cambian bastante. Eso es deliberado: un comerciante que abre "Agregar sección" y ve **Shoppable image**, **Shop the set**, **Collection tabs** y **Mixed content grid** entiende su catálogo de opciones sin leer documentación. Con **Interactive lookbook**, **Complete the look**, **Curated showcase** y **Bento discovery** tiene que adivinar cuatro veces. La sofisticación de la marca vive en la vitrina, no en la barra lateral del editor.

## Nuevos `info` que antes no existían

Nueve dependencias externas que el comerciante no podía adivinar:

- `free_shipping_threshold`: necesita una tarifa de envío gratis en Configuración. Sin ella, la vitrina promete algo que el checkout no cumple.
- `atelier_gift_threshold`: necesita un descuento automático en Descuentos.
- `intent` de recomendaciones: los complementarios necesitan la app Search & Discovery, y sin ella la sección queda oculta.
- `show_quick_add`: solo aparece en productos de una sola variante.
- `cross_sell_product`: los productos con opciones se agregan en su primera variante disponible, así que conviene elegir productos de variante única.
- `page_content` de la guía de tallas: los campos de medidas son richtext y **no soportan tablas**. Para una tabla real hay que usar una página.
- `position_in_grid`: se mueve al final de la grilla si la colección tiene menos productos.
- `video` del hero: se reproduce en silencio y en bucle, y conviene mantenerlo bajo 10 segundos.
- `enable_video_mobile`: apagado por defecto para ahorrar datos del cliente.

## Tres notas de aplicación

**`pickup_hours_note`** está hoy en los settings de `main-product`, o sea es un texto global que solo se edita entrando a la plantilla de producto. El archivo incluye la clave en los dos lugares: en `settings_schema.product.*` por si se mueve a theme settings, que es lo que recomiendo, y en `main_product.settings.*` por si se queda donde está. Cualquiera de las dos funciona.

**Los settings del blueprint que aún no existen** ya están traducidos en el archivo: `heading_letter_spacing`, `heading_text_transform`, `eyebrow_style`, `corner_style`, `border_thickness`, `border_contrast`, `grid_density`, `enable_reveal_animation`, `product_card_image_ratio`, `product_card_style`, `button_style`, y todos los del hero dual. Cuando GPT los implemente, la traducción ya está puesta y no hay que volver. Claves de schema sin usar no rompen nada ni las reporta Theme Check.

**`--button-radius` desaparece.** El archivo ya no tiene `layout.settings.button_radius` porque el blueprint lo reemplaza por `corner_style`, que arregla además el bug de las dos variables de radio. Si por alguna razón se decide mantener `button_radius`, hay que volver a agregar esa clave.

---

# Mapa de reemplazo de labels a claves `t:`

Generado desde los schemas reales del repo y validado contra `en.default.schema.json`.

Regla: un label que se repite igual en varias secciones apunta a `sections.all.*` y se reusa. Un label propio o renombrado apunta al namespace de su seccion o bloque.


## `sections/announcement-bar.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Announcement bar | `t:sections.announcement_bar.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `auto_rotate` label | Auto-rotate announcements | `t:sections.announcement_bar.settings.auto_rotate.label` |
| `change_slides_speed` label | Change announcement every | `t:sections.announcement_bar.settings.change_slides_speed.label` |
| bloque `announcement` name | Announcement | `t:sections.announcement_bar.blocks.announcement.name` |
| `text` label | Text | `t:sections.all.text.label` |
| `link` label | Link | `t:sections.all.link.label` |
| `presets.name` | Announcement bar | `t:sections.announcement_bar.presets.name` |

## `sections/bento-discovery.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Bento discovery | `t:sections.bento_discovery.name` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `subheading` label | Subheading | `t:sections.all.subheading.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| bloque `card_featured` name | Featured collection card | `t:sections.bento_discovery.blocks.card_featured.name` |
| `collection` label | Collection | `t:sections.all.collection.label` |
| `image` label | Image | `t:sections.all.image.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `link` label | Custom link | `t:sections.bento_discovery.blocks.card_featured.settings.link.label` |
| bloque `card_editorial` name | Editorial card | `t:sections.bento_discovery.blocks.card_editorial.name` |
| `image` label | Atmosphere image | `t:sections.bento_discovery.blocks.card_editorial.settings.image.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `body` label | Body | `t:sections.all.body.label` |
| `link_label` label | Link label | `t:sections.all.link_label.label` |
| `link` label | Link | `t:sections.all.link.label` |
| bloque `card_product` name | Product card | `t:sections.bento_discovery.blocks.card_product.name` |
| `product` label | Product | `t:sections.all.product.label` |
| `presets.name` | Bento discovery | `t:sections.bento_discovery.presets.name` |

## `sections/brand-manifesto.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Brand manifesto | `t:sections.brand_manifesto.name` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `quote` label | Statement | `t:sections.brand_manifesto.settings.quote.label` |
| `author` label | Author or attribution | `t:sections.brand_manifesto.settings.author.label` |
| `body` label | Body | `t:sections.all.body.label` |
| `button_label` label | Button label | `t:sections.all.button_label.label` |
| `button_url` label | Button link | `t:sections.all.button_url.label` |
| `image` label | Material image | `t:sections.brand_manifesto.settings.image.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `media_label` label | Media label | `t:sections.brand_manifesto.settings.media_label.label` |
| `use_surface_background` label | Use tonal surface background | `t:sections.brand_manifesto.settings.use_surface_background.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| bloque `detail` name | Material detail | `t:sections.brand_manifesto.blocks.detail.name` |
| `label` label | Label | `t:sections.brand_manifesto.blocks.detail.settings.label.label` |
| `value` label | Value | `t:sections.brand_manifesto.blocks.detail.settings.value.label` |
| `presets.name` | Brand manifesto | `t:sections.brand_manifesto.presets.name` |

## `sections/cart-drawer.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Cart drawer | `t:sections.cart_drawer.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `enable_tiered_progress` label | Show tiered rewards progress | `t:sections.cart_drawer.settings.enable_tiered_progress.label` |
| `free_shipping_threshold` label | Free shipping threshold | `t:sections.cart_drawer.settings.free_shipping_threshold.label` |
| `atelier_gift_threshold` label | Atelier gift threshold | `t:sections.cart_drawer.settings.atelier_gift_threshold.label` |
| `cross_sell_heading` label | Cross-sell heading | `t:sections.cart_drawer.settings.cross_sell_heading.label` |
| `cross_sell_collection` label | Fallback cross-sell collection | `t:sections.cart_drawer.settings.cross_sell_collection.label` |
| bloque `cross_sell_product` name | Cross-sell product | `t:sections.cart_drawer.blocks.cross_sell_product.name` |
| `product` label | Product | `t:sections.all.product.label` |

## `sections/complete-the-look.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Complete the look | `t:sections.complete_the_look.name` |
| `image_desktop` label | Desktop image | `t:sections.all.image_desktop.label` |
| `image_mobile` label | Mobile image | `t:sections.all.image_mobile.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `description` label | Description | `t:sections.all.description.label` |
| `caption` label | Image caption | `t:sections.all.caption.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| bloque `bundle_product` name | Bundle product | `t:sections.complete_the_look.blocks.bundle_product.name` |
| `product` label | Product | `t:sections.all.product.label` |
| `product` info | Choose two to four products for a complete capsule. | `t:sections.complete_the_look.blocks.bundle_product.settings.product.info` |
| `presets.name` | Complete the look | `t:sections.complete_the_look.presets.name` |

## `sections/curated-showcase.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Curated showcase | `t:sections.curated_showcase.name` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `subheading` label | Subheading | `t:sections.all.subheading.label` |
| `show_secondary_image` label | Show second image on hover | `t:sections.all.show_secondary_image.label` |
| `show_vendor` label | Show vendor | `t:sections.all.show_vendor.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| bloque `collection_tab` name | Collection tab | `t:sections.curated_showcase.blocks.collection_tab.name` |
| `collection` label | Collection | `t:sections.all.collection.label` |
| `tab_label` label | Tab label | `t:sections.curated_showcase.blocks.collection_tab.settings.tab_label.label` |
| `editorial_image` label | Editorial spotlight image | `t:sections.curated_showcase.blocks.collection_tab.settings.editorial_image.label` |
| `presets.name` | Curated showcase | `t:sections.curated_showcase.presets.name` |

## `sections/footer.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `show_newsletter` label | Show newsletter signup | `t:sections.footer.settings.show_newsletter.label` |
| `newsletter_heading` label | Newsletter heading | `t:sections.footer.settings.newsletter_heading.label` |
| `newsletter_text` label | Newsletter text | `t:sections.footer.settings.newsletter_text.label` |

## `sections/hero-editorial.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Editorial split hero | `t:sections.hero_editorial.name` |
| `image_desktop` label | Desktop image | `t:sections.all.image_desktop.label` |
| `image_mobile` label | Mobile image | `t:sections.all.image_mobile.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `image_alt` info | Describe the image for customers using screen readers. | `t:sections.hero_editorial.settings.image_alt.info` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `subheading` label | Subheading | `t:sections.all.subheading.label` |
| `button_primary_label` label | Primary button label | `t:sections.hero_editorial.settings.button_primary_label.label` |
| `button_primary_url` label | Primary button link | `t:sections.hero_editorial.settings.button_primary_url.label` |
| `button_secondary_label` label | Secondary button label | `t:sections.hero_editorial.settings.button_secondary_label.label` |
| `button_secondary_url` label | Secondary button link | `t:sections.hero_editorial.settings.button_secondary_url.label` |
| `layout_split` label | Desktop layout | `t:sections.hero_editorial.settings.layout_split.label` |
| `layout_split` opcion 1 | Image first (60 / 40) | `t:sections.hero_editorial.settings.layout_split.options__1.label` |
| `layout_split` opcion 2 | Text first (40 / 60) | `t:sections.hero_editorial.settings.layout_split.options__2.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `presets.name` | Editorial split hero | `t:sections.hero_editorial.presets.name` |

## `sections/lookbook.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Interactive lookbook | `t:sections.lookbook.name` |
| `image_desktop` label | Desktop image | `t:sections.all.image_desktop.label` |
| `image_mobile` label | Mobile image | `t:sections.all.image_mobile.label` |
| `image_alt` label | Image alternative text | `t:sections.lookbook.settings.image_alt.label` |
| `image_alt` info | Describe the complete editorial scene, not the products already named by hotspots. | `t:sections.lookbook.settings.image_alt.info` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `description` label | Description | `t:sections.all.description.label` |
| `caption` label | Caption | `t:sections.all.caption.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| bloque `hotspot` name | Product hotspot | `t:sections.lookbook.blocks.hotspot.name` |
| `product` label | Product | `t:sections.all.product.label` |
| `horizontal_position` label | Horizontal position | `t:sections.lookbook.blocks.hotspot.settings.horizontal_position.label` |
| `vertical_position` label | Vertical position | `t:sections.lookbook.blocks.hotspot.settings.vertical_position.label` |
| `popover_position` label | Preferred popover position | `t:sections.lookbook.blocks.hotspot.settings.popover_position.label` |
| `popover_position` opcion 1 | Top | `t:sections.lookbook.blocks.hotspot.settings.popover_position.options__1.label` |
| `popover_position` opcion 2 | Right | `t:sections.lookbook.blocks.hotspot.settings.popover_position.options__2.label` |
| `popover_position` opcion 3 | Bottom | `t:sections.lookbook.blocks.hotspot.settings.popover_position.options__3.label` |
| `popover_position` opcion 4 | Left | `t:sections.lookbook.blocks.hotspot.settings.popover_position.options__4.label` |
| `presets.name` | Interactive lookbook | `t:sections.lookbook.presets.name` |

## `sections/main-404.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main 404 | `t:sections.main_404.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `recommendation_collection` label | Recommendation collection | `t:sections.main_404.settings.recommendation_collection.label` |
| `products_to_show` label | Products to show | `t:sections.all.products_to_show.label` |

## `sections/main-article.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main article | `t:sections.main_article.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `show_author` label | Show author | `t:sections.main_article.settings.show_author.label` |
| `hero_caption` label | Hero image caption | `t:sections.main_article.settings.hero_caption.label` |
| `comments_per_page` label | Comments per page | `t:sections.main_article.settings.comments_per_page.label` |
| bloque `pull_quote` name | Pull quote | `t:sections.main_article.blocks.pull_quote.name` |
| `quote` label | Quote | `t:sections.all.quote.label` |
| `attribution` label | Attribution | `t:sections.all.attribution.label` |
| bloque `featured_product` name | Featured object | `t:sections.main_article.blocks.featured_product.name` |
| `product` label | Product | `t:sections.all.product.label` |

## `sections/main-blog.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main blog | `t:sections.main_blog.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `featured_article` label | Featured article | `t:sections.main_blog.settings.featured_article.label` |
| `articles_per_page` label | Articles per page | `t:sections.main_blog.settings.articles_per_page.label` |
| `show_tag_filters` label | Show tag filters | `t:sections.main_blog.settings.show_tag_filters.label` |
| `show_excerpts` label | Show excerpts | `t:sections.main_blog.settings.show_excerpts.label` |
| `show_author` label | Show featured article author | `t:sections.main_blog.settings.show_author.label` |
| `show_date` label | Show publication dates | `t:sections.main_blog.settings.show_date.label` |

## `sections/main-cart-items.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main cart | `t:sections.main_cart_items.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `show_vendor` label | Show vendor | `t:sections.all.show_vendor.label` |

## `sections/main-collection.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main collection | `t:sections.main_collection.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `products_per_page` label | Products per page | `t:sections.main_collection.settings.products_per_page.label` |
| `show_collection_image` label | Show collection image | `t:sections.main_collection.settings.show_collection_image.label` |
| `default_grid_columns` label | Default grid density | `t:sections.main_collection.settings.default_grid_columns.label` |
| `default_grid_columns` opcion 1 | Fewer columns | `t:sections.main_collection.settings.default_grid_columns.options__1.label` |
| `default_grid_columns` opcion 2 | More columns | `t:sections.main_collection.settings.default_grid_columns.options__2.label` |
| `show_secondary_image` label | Show second image | `t:sections.all.show_secondary_image.label` |
| `show_vendor` label | Show vendor | `t:sections.all.show_vendor.label` |
| `show_quick_add` label | Show quick add | `t:sections.all.show_quick_add.label` |
| bloque `promotion_tile` name | Promotion tile | `t:sections.main_collection.blocks.promotion_tile.name` |
| `position_in_grid` label | Position in product grid | `t:sections.main_collection.blocks.promotion_tile.settings.position_in_grid.label` |
| `image` label | Image | `t:sections.all.image.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `text` label | Text | `t:sections.all.text.label` |
| `link_label` label | Link label | `t:sections.all.link_label.label` |
| `link_url` label | Link | `t:sections.main_collection.blocks.promotion_tile.settings.link_url.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |

## `sections/main-contact.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main contact and FAQ | `t:sections.main_contact.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `intro` label | Introduction | `t:sections.all.intro.label` |
| `studio_hours` label | Studio hours | `t:sections.main_contact.settings.studio_hours.label` |
| `showroom_address` label | Showroom address | `t:sections.main_contact.settings.showroom_address.label` |
| `single_open_faq` label | Keep only one FAQ open | `t:sections.main_contact.settings.single_open_faq.label` |
| `service_color_scheme` label | Direct contacts color scheme | `t:sections.main_contact.settings.service_color_scheme.label` |
| bloque `faq_item` name | FAQ item | `t:sections.main_contact.blocks.faq_item.name` |
| `question` label | Question | `t:sections.main_contact.blocks.faq_item.settings.question.label` |
| `answer` label | Answer | `t:sections.main_contact.blocks.faq_item.settings.answer.label` |
| `open_by_default` label | Open by default | `t:sections.main_contact.blocks.faq_item.settings.open_by_default.label` |
| bloque `service_detail` name | Direct contact | `t:sections.main_contact.blocks.service_detail.name` |
| `title` label | Title | `t:sections.main_contact.blocks.service_detail.settings.title.label` |
| `detail` label | Detail | `t:sections.main_contact.blocks.service_detail.settings.detail.label` |
| `link` label | Link | `t:sections.all.link.label` |
| `presets.name` | Main contact and FAQ | `t:sections.main_contact.presets.name` |

## `sections/main-list-collections.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main collection list | `t:sections.main_list_collections.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `intro` label | Introduction | `t:sections.all.intro.label` |
| `collections_per_page` label | Collections per page | `t:sections.main_list_collections.settings.collections_per_page.label` |
| `columns_desktop` label | Desktop columns | `t:sections.main_list_collections.settings.columns_desktop.label` |
| `columns_desktop` opcion 1 | Two | `t:sections.main_list_collections.settings.columns_desktop.options__1.label` |
| `columns_desktop` opcion 2 | Three | `t:sections.main_list_collections.settings.columns_desktop.options__2.label` |
| `columns_desktop` opcion 3 | Four | `t:sections.main_list_collections.settings.columns_desktop.options__3.label` |

## `sections/main-page.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main page | `t:sections.main_page.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `intro` label | Introduction | `t:sections.all.intro.label` |
| bloque `image` name | Full-width image | `t:sections.main_page.blocks.image.name` |
| `image` label | Image | `t:sections.all.image.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `caption` label | Caption | `t:sections.all.caption.label` |
| bloque `quote` name | Editorial quote | `t:sections.main_page.blocks.quote.name` |
| `quote` label | Quote | `t:sections.all.quote.label` |
| `attribution` label | Attribution | `t:sections.all.attribution.label` |
| bloque `signature` name | Atelier signature | `t:sections.main_page.blocks.signature.name` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `note` label | Note | `t:sections.main_page.blocks.signature.settings.note.label` |
| `name` label | Name | `t:sections.main_page.blocks.signature.settings.name.label` |
| `role` label | Role | `t:sections.main_page.blocks.signature.settings.role.label` |
| `presets.name` | Main page | `t:sections.main_page.presets.name` |

## `sections/main-password.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main password | `t:sections.main_password.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `image` label | Editorial image | `t:sections.main_password.settings.image.label` |
| `image_alt` label | Image alternative text | `t:sections.all.image_alt.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `text` label | Text | `t:sections.main_password.settings.text.label` |
| `opening_note` label | Opening note | `t:sections.main_password.settings.opening_note.label` |

## `sections/main-product.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main product | `t:sections.main_product.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `media_layout` label | Media layout | `t:sections.main_product.settings.media_layout.label` |
| `media_layout` opcion 1 | Stack | `t:sections.main_product.settings.media_layout.options__1.label` |
| `media_layout` opcion 2 | Grid | `t:sections.main_product.settings.media_layout.options__2.label` |
| `enable_sticky_cart` label | Enable sticky cart bar | `t:sections.main_product.settings.enable_sticky_cart.label` |
| `pickup_hours_note` label | Pickup hours note | `t:sections.main_product.settings.pickup_hours_note.label` |
| `pickup_hours_note` info | Optional shared hours information shown with pickup locations. | `t:sections.main_product.settings.pickup_hours_note.info` |
| bloque `vendor` name | Vendor | `t:sections.main_product.blocks.vendor.name` |
| bloque `title` name | Title | `t:sections.main_product.blocks.title.name` |
| bloque `price` name | Price | `t:sections.main_product.blocks.price.name` |
| bloque `variant_picker` name | Variant picker | `t:sections.main_product.blocks.variant_picker.name` |
| bloque `size_guide` name | Size guide | `t:sections.main_product.blocks.size_guide.name` |
| `guide_title` label | Title | `t:sections.main_product.blocks.size_guide.settings.guide_title.label` |
| `model_fit_info` label | Model fit information | `t:sections.main_product.blocks.size_guide.settings.model_fit_info.label` |
| `show_model_fit_below` label | Show model fit below trigger | `t:sections.main_product.blocks.size_guide.settings.show_model_fit_below.label` |
| `page_content` label | Additional size guide page | `t:sections.main_product.blocks.size_guide.settings.page_content.label` |
| `size_table_cm` label | Measurements in centimeters | `t:sections.main_product.blocks.size_guide.settings.size_table_cm.label` |
| `size_table_in` label | Measurements in inches | `t:sections.main_product.blocks.size_guide.settings.size_table_in.label` |
| bloque `quantity` name | Quantity | `t:sections.main_product.blocks.quantity.name` |
| bloque `buy_buttons` name | Buy buttons | `t:sections.main_product.blocks.buy_buttons.name` |
| `show_dynamic_checkout` label | Show dynamic checkout buttons | `t:sections.main_product.blocks.buy_buttons.settings.show_dynamic_checkout.label` |
| bloque `description` name | Description | `t:sections.main_product.blocks.description.name` |

## `sections/main-search.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Main search | `t:sections.main_search.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `results_per_page` label | Results per page | `t:sections.main_search.settings.results_per_page.label` |
| `show_secondary_image` label | Show second product image | `t:sections.all.show_secondary_image.label` |
| `show_vendor` label | Show product vendor | `t:sections.all.show_vendor.label` |
| `show_quick_add` label | Show product quick add | `t:sections.all.show_quick_add.label` |

## `sections/marquee.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Editorial marquee | `t:sections.marquee.name` |
| `speed` label | Loop duration | `t:sections.marquee.settings.speed.label` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| bloque `item` name | Text item | `t:sections.marquee.blocks.item.name` |
| `text` label | Text | `t:sections.all.text.label` |
| `presets.name` | Editorial marquee | `t:sections.marquee.presets.name` |

## `sections/newsletter.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Newsletter | `t:sections.newsletter.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.all.heading.label` |
| `text` label | Text | `t:sections.newsletter.settings.text.label` |
| `presets.name` | Newsletter | `t:sections.newsletter.presets.name` |

## `sections/product-recommendations.liquid`

| Campo | Valor literal actual | Reemplazar por |
| --- | --- | --- |
| `"name"` | Product recommendations | `t:sections.product_recommendations.name` |
| `color_scheme` label | Color scheme | `t:sections.all.color_scheme.label` |
| `intent` label | Recommendation intent | `t:sections.product_recommendations.settings.intent.label` |
| `intent` opcion 1 | Related products | `t:sections.product_recommendations.settings.intent.options__1.label` |
| `intent` opcion 2 | Complementary products | `t:sections.product_recommendations.settings.intent.options__2.label` |
| `eyebrow` label | Eyebrow | `t:sections.all.eyebrow.label` |
| `heading` label | Heading | `t:sections.product_recommendations.settings.heading.label` |
| `products_to_show` label | Products to show | `t:sections.all.products_to_show.label` |
| `columns_desktop` label | Desktop columns | `t:sections.all.columns_desktop.label` |
| `columns_desktop` opcion 1 | Two | `t:sections.all.columns_desktop.options__1.label` |
| `columns_desktop` opcion 2 | Three | `t:sections.all.columns_desktop.options__2.label` |
| `columns_desktop` opcion 3 | Four | `t:sections.all.columns_desktop.options__3.label` |
| `show_secondary_image` label | Show second image | `t:sections.all.show_secondary_image.label` |
| `show_vendor` label | Show vendor | `t:sections.all.show_vendor.label` |
| `show_quick_add` label | Show quick add | `t:sections.all.show_quick_add.label` |
| `presets.name` | Product recommendations | `t:sections.product_recommendations.presets.name` |
