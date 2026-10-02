ID: GPT-018-LISTING-DRAFT
Estado: Borrador EN con notas de evaluación ES; no enviado ni aprobado.
Decisión requerida: Johandry fijar nombres/precio y activos finales después de la auditoría.
Resumen en 5 líneas:
1. Sartorial es el nombre matriz; Atelier es la identidad de la primera demo.
2. Cada preset recibe posicionamiento propio sin promesas de conversión/rendimiento no medidas.
3. Características separadas por evidencia runtime y source.
4. Capturas oficiales aún requieren producción en dimensiones exactas.
5. Naming Edition/Editions y DP-003 permanecen por resolver.
Archivos tocados: este borrador y carpeta role-07-listing.
Desviaciones (Nivel 1 o Nivel 2): ninguna aplicada.
Hallazgos extra fuera de alcance (con parche listo): ninguno.
Verificación (comando, resultado y qué demuestra/qué no): length checks y fuentes en informe rol7; no envío de ficha.
Lista de afirmaciones falsables numeradas: ver matriz de evidencia y capturas.

# Public-facing draft — English

**Theme: Sartorial**

**Description:** Sartorial gives considered collections an editorial setting. Pair expressive typography with image-led storytelling, connect products through shoppable compositions, and bring product details into a focused buying experience. Three distinct directions suit tailoring, leather goods and archival collections.

**Metadata description:** An editorial theme for fashion and design-led collections, with lookbook hotspots, curated product sections and detailed product pages.

| Current demo identity | Technical preset in local source | Tagline | Suggested primary industry |
|---|---|---|---|
| Atelier | Sartorial | Editorial design for considered wardrobes | Clothing |
| Edition | Edition | A precise showcase for leather goods and everyday objects | Bags |
| Archive | Archive | An editorial setting for vintage and collected pieces | Clothing |

**Atelier / Sartorial description:** Create a composed setting for tailoring and seasonal wardrobes. Warm surfaces, editorial typography and shoppable looks give each silhouette room to tell its story.

**Edition description:** Present leather goods and everyday objects with architectural clarity. Precise spacing and product-focused compositions bring materials, proportions and options into view.

**Archive description:** Give collected pieces an editorial context. Rich tones and catalogue-inspired compositions place imagery, condition and individual product details at the centre of discovery.

## Three highlights

| Title | Description |
|---|---|
| Editorial storytelling | Show materials, silhouettes and collection stories through image-led sections and a distinctive typographic rhythm. |
| Shop the composition | Connect products with lookbook hotspots and complete-the-look sections, keeping editorial context close to the purchase. |
| Details that guide decisions | Bring images, product options and expandable information together in a focused product page. |

For Edition, illustrate the second highlight with a coordinated desk collection. For Archive, illustrate an archival lookbook; do not suggest bundle availability if its demo does not display a bundle.

## Feature copy

- Editorial banners and collection storytelling.
- Lookbook sections with product hotspots.
- Complete-the-look product compositions.
- Product option selectors and expandable product information.
- Quick add and a slide-out cart.
- Related product recommendations.
- Product image zoom, predictive search and a sticky purchase bar — confirm against the final deployed package before selecting listing feature tags.

**Support links:** [Documentation](https://noobprobro-web.github.io/sartorial-docs/docs.html) · [Support form](https://noobprobro-web.github.io/sartorial-docs/support.html).

# Notas de evaluación — español

## Nombres y precio

No renombrar por este borrador. Source `config/settings_data.json:80,100,120` contiene Sartorial/Edition/Archive. La primera tienda se presenta como Sartorial Atelier. Mantener distinción en envío: Shopify exige un preset con nombre matriz. Edition se parece al tema existente Editions; resolver con Johandry antes de fijar nombre. Alternativas exploratorias **Folio / Stillform** para Edition: no investigadas ni autorizadas, no listas para usar. DP-003 cubre clearance de nombres; no afirmar disponibilidad de esas alternativas.

Precio $380: objetivo proporcionado por el usuario, no precio publicado ni validación de valor. Evitar `best`, conversión garantizada, 100% accesible, puntuaciones Lighthouse, libre de dependencias, fotografía incluida, certificados de procedencia o servicios profesionales de restauración.

## Evidencia de capacidades

| Claim | Evidencia | Límite |
|---|---|---|
| Editorial home / opciones | role-01-buyer/*-home.json y *-pdp.json, campos URL/status/text | Muestra puntual 3 tiendas, no todas las variantes |
| Hotspots / complete the look | sections/lookbook.liquid y sections/complete-the-look.liquid; atelier-home.json | No afirmar que Archive muestre bundle |
| Quick add / recomendaciones | atelier-pdp.json texto QUICK ADD y You may also consider | No algoritmo propietario ni aumento de ventas probado |
| Zoom | sections/main-product.liquid:760 | Integración source, no test funcional de este rol |
| Search | sections/header.liquid:186 | Integración source, no cobertura de teclado aquí |
| Sticky purchase | sections/main-product.liquid:767–836 | Source, no certificación accesibilidad |
| Soporte público | GET docs/support 200 guardados role-06-merchant | Formulario no enviado |

## Capturas y textos de imagen

Norma consultada: [Shopify listing](https://shopify.dev/docs/storefronts/themes/store/review-process/listings). Por demo: homepage desktop 1000×1248 o 2000×2496; móvil 750×1334. Alt obligatorio; sin marco de navegador ni texto añadido; móvil distinto. Highlights: tres por preset, imágenes 1600×1200, título ≤30 y descripción ≤140. Tagline ≤70. Seleccionar sólo funciones nativas. Nombres quedan fijados al subir. No se encontró límite numérico de descripción SEO en esta página; no inventarlo.

| Activo necesario | Página/estado | Captura propuesta | Alt EN |
|---|---|---|---|
| Atelier home desktop + móvil | sartorial-atelier.myshopify.com/ tras cargar hero nuevo | Desktop viewport 1000×1248 DPR1; mobile 375×667 DPR2 | Sartorial Atelier homepage with an editorial fashion banner and collection navigation. |
| Edition home desktop + móvil | sartorial-edition.myshopify.com/ tras fotos variantes | Mismas dimensiones oficiales | Edition homepage presenting leather goods in a split editorial layout. |
| Archive home desktop + móvil | sartorial-archive.myshopify.com/ tras hero/copy final | Mismas dimensiones oficiales | Archive homepage with catalogue-inspired typography and curated garments. |
| Highlight 1 por preset | Home, hero + sección editorial | 1600×1200; pantalla limpia y imagen final | Editorial imagery and typography in the [preset] homepage. |
| Highlight 2 Atelier | Home lookbook, hotspot abierto; cápsula aparte si cabe sin montaje engañoso | 1600×1200 | Product hotspot linking a styled look to its product. |
| Highlight 2 Edition | Home colección escritorio / set visible | 1600×1200 | Coordinated leather goods shown in a shoppable product composition. |
| Highlight 2 Archive | Home lookbook con producto disponible | 1600×1200 | An archival garment linked from a catalogue lookbook. |
| Highlight 3 cada preset | PDP Serra Coat / Structured Tote / producto Archive disponible | 1600×1200; opciones y detalles legibles | Product imagery, options and expandable details in [preset]. |

Las capturas role01 `*-home-desktop.png`, `*-pdp-desktop.png` y `*-pdp-mobile.png` son evidencia reutilizable para composición y QA. Sus viewports registrados 1440×1000/390×844 no corresponden a los tamaños de entrega; no subir como definitivas ni estirar para cumplir. No hay homepage móvil oficial en el inventario de esta pasada. Rehacer tras sustituir arte y cerrar contenido. No usar checkout/pago como captura de función exclusiva del tema.

Las etiquetas anteriores son alt/caption de ficha; no quemarlas dentro de homepage screenshot. No se generaron capturas nuevas ni se alteraron imágenes de auditoría.
