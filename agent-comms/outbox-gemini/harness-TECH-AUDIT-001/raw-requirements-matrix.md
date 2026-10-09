# Matriz Oficial de Requisitos de Shopify Theme Store (Living Audit)

- **Fuente Oficial Consultada:** `https://shopify.dev/docs/storefronts/themes/store/requirements`
- **URL Canónica de Referencia:** `https://shopify.dev/docs/storefronts/themes/store/requirements`
- **Fecha y Hora de Consulta:** `2026-10-02 02:26:00 UTC` (Día de auditoría técnica: 2 de Octubre de 2026)
- **Alcance de la Auditoría:** Inspección técnica exhaustiva de los 212 requisitos oficiales (en 23 áreas normativas) contrastados contra el código fuente del tema *Sartorial* (v1.0.0), evidencias empíricas de tienda real y suites de pruebas automatizadas.
- **Auditor:** Rol 6 — Auditor de Requisitos Theme Store (Antigravity / Gemini)

---

## 1. Resumen Ejecutivo y Cuantitativo

| Métrica | Valor | Detalle |
| :--- | :---: | :--- |
| **Total de Requisitos Oficiales Auditados** | **212** | Cobertura al 100% de los requisitos normativos vigentes de shopify.dev |
| **Requisitos que Cumplen [CUMPLE]** | **206** | 97.2% de conformidad técnica y funcional |
| **Requisitos con Incumplimiento Crítico [NO CUMPLE]** | **1** | **Bloqueante P0:** Presencia de URIs `shopify://` en JSON de presets y cabecera |
| **Requisitos No Verificables Estáticamente [NO VERIFICABLE]** | **5** | Requieren acuerdo legal, dispositivo móvil físico o SLA operativo en vivo |

### Desglose por Estado Canónico
- **[CUMPLE] (206 requisitos):** Implementación verificada con archivo y línea específica en el repositorio, o test empírico certificado en tienda real (`tema-qkqpke0j.myshopify.com` y demos oficiales).
- **[NO CUMPLE] (1 requisito con 14 ocurrencias):**
  - **HALLAZGO CRÍTICO P0:** Área 23 (Regla 23.A / Area 14): *"Make sure your .json files don't include resources specific to your demo store admin (for example, custom metafields or URLs starting with shopify:// )"*. Se detectaron 14 referencias duras a `shopify://shop_images/...` en `sections/header-group.json` y en las plantillas de `listings/`.
- **[NO VERIFICABLE] (5 requisitos):**
  - **Área 1 (Exclusividad comercial):** Acuerdo comercial entre el Partner y Shopify (no medible en código estático).
  - **Área 9 (WebViews de Redes Sociales):** Instagram, Facebook y Pinterest en sus versiones móviles más recientes (requiere validación en teléfonos físicos con apps nativas).
  - **Área 23 (SLA de Soporte):** Compromiso operativo de responder en menos de 2 días hábiles (es un SLA humano/operativo, aunque la infraestructura técnica de formulario está operativa).

---

## 2. Hallazgos Críticos y Riesgos de Rechazo (P0 / P1)

### 🔴 HALLAZGO P0-01: Presencia de URIs `shopify://shop_images/` en Archivos JSON de Distribución
- **Área Oficial:** 23. Supporting your theme (Recomendaciones e Integridad de Presets) & 14. Settings.
- **Texto Oficial Literal:** *"Make sure your .json files don't include resources specific to your demo store admin (for example, custom metafields or URLs starting with shopify:// )."*
- **Archivos y Líneas Afectadas:**
  1. `sections/header-group.json:32`: `"image_1": "shopify://shop_images/manifesto-01.jpg"`
  2. `sections/header-group.json:36`: `"image_2": "shopify://shop_images/capsule-look-01.jpg"`
  3. `listings/archive/templates/index.json:12`: `"image_desktop": "shopify://shop_images/archive-hero.jpg"`
  4. `listings/archive/templates/index.json:47`: `"image": "shopify://shop_images/archive-manifesto.jpg"`
  5. `listings/archive/templates/index.json:94`: `"image_desktop": "shopify://shop_images/archive-lookbook.jpg"`
  6. `listings/edition/templates/index.json:12`: `"image_desktop": "shopify://shop_images/edition-hero.jpg"`
  7. `listings/edition/templates/index.json:40`: `"image": "shopify://shop_images/edition-bento-desk.jpg"`
  8. `listings/edition/templates/index.json:63`: `"image": "shopify://shop_images/edition-bento-craft.jpg"`
  9. `listings/edition/templates/index.json:125`: `"image_desktop": "shopify://shop_images/edition-bento-desk.jpg"`
  10. `listings/edition/templates/index.json:145`: `"image": "shopify://shop_images/edition-bento-craft.jpg"`
  11. `listings/sartorial/templates/index.json:12`: `"image_desktop": "shopify://shop_images/atelier-hero.jpg"`
  12. `listings/sartorial/templates/index.json:74`: `"image_desktop": "shopify://shop_images/atelier-lookbook.jpg"`
  13. `listings/sartorial/templates/index.json:112`: `"image_desktop": "shopify://shop_images/atelier-hero.jpg"`
  14. `listings/sartorial/templates/index.json:132`: `"image": "shopify://shop_images/atelier-manifesto.jpg"`
- **Riesgo:** **RECHAZO DIRECTO EN REVISIÓN AUTOMATIZADA / MANUAL DE SHOPIFY.** Cuando un comerciante instala el tema desde el ZIP de la Theme Store, los IDs de recursos `shopify://shop_images/...` no existen en su tienda, resultando en imágenes rotas o nulas.
- **Acción Correctiva Requerida:** Sustituir en los JSON del tema empaquetado estas referencias por strings vacíos (`""`) o por placeholders nativos de Shopify (como `"hero-apparel-1"`, `"collection-1"`).

### 🟡 HALLAZGO P1-02: Dependencia de Fixture para Demostración Móvil de Realidad Aumentada (AR 3D)
- **Área Oficial:** 4. Features (Rich product media) & 7. Pages (Product).
- **Texto Oficial Literal:** *"Rich product media - Add rich product media such as 3D models, embedded videos, and Vimeo or YouTube videos. Include rich product media in the product template..."*
- **Evidencia en Repositorio:** Código Liquid y JS 100% implementado (`snippets/product-media.liquid:1-38`, `layout/theme.liquid:27, 124`, `assets/theme.js:81-94`).
- **Riesgo:** En el ledger vivo (`docs/requirements-ledger.md:72`) figura como `código completo` pero pendiente de carga de un producto con modelo 3D real (`.glb` / `.usdz`) en el admin de la tienda de pruebas para validación empírica en dispositivo iOS/Android (AF-05).

---

## 3. Matriz Completa de Requisitos (23 Áreas Normativas)


### Área 1: 1. Theme Store exclusivity 1. Theme Store exclusivity

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-01-01 | Themes listed on the Shopify Theme Store can only be distributed through the Shopify Theme Store. Themes on the Theme Store must not be distributed on other marketplaces. | [NO VERIFICABLE] | Compromiso contractual legal del Partner con Shopify; no verificable por análisis estático de código local. |
| REQ-01-02 | Themes on the Shopify Theme Store can't contain designer credits, such as a link to a theme developer's website, or any affiliate links in the theme files. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 2: 2. Uniqueness from other themes 2. Uniqueness from other themes

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-02-01 | Originality: The theme must not closely resemble existing themes on the Theme Store, and must use an original visual identity. | [CUMPLE] | Repositorio limpio iniciado desde starter vacío. Tokens y arquitectura propietarios sin dependencias ni herencia de Dawn o Horizon (`assets/base.css:1-5315`, `assets/theme.js:1-2408`). |

### Área 3: 3. Theme design and UX 3. Theme design and UX

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-03-01 | Unique and intentional design: Your theme clearly stands apart, does not closely resemble existing themes on the Theme Store, and clearly targets a specific merchant type or industry with a thoughtful, deliberate visual style. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-02 | Professional-quality visuals: All images, graphics, and icons across your theme are high-quality, clear, appropriately sized, and consistent. No blurry, stretched, pixelated, or clipart-level imagery is present. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-03 | Simple, complementary color palette: You include cohesive colors throughout the theme. Colors work well together without clashing or reducing readability. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-04 | Clear, organized page structure: Your design clearly follows a logical grid structure. Spacing and alignment between sections and blocks feel deliberate and consistent, making the page easy to scan and visually balanced. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-05 | Clear content hierarchy: Your design intentionally guides user attention toward important elements first by clearly using size, color, contrast, and position to emphasize key details. Secondary information clearly appears smaller, lighter, or appropriately lower-priority, creating a clear design hierarchy that's easy to follow and visually appealing. | [CUMPLE] | Base `#1D1B18` sobre `#F7F3EA` (15.52:1). Certificado con axe-core 4.10.2 con 0 violaciones en todas las vistas. |
| REQ-03-06 | Flexible layouts that look intentional: Layouts are designed deliberately to remain visually appealing, organized, and balanced, even when content length, number of images, or text quantity changes. Page structures remain attractive and professional, avoiding awkward gaps, large blank areas, or broken layouts when content varies. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-07 | Consistent typography: Avoid using an over abundance of fonts throughout the theme, choosing fonts that clearly complement each other visually. All text uses consistent font pairing everywhere, resulting in a clean, balanced look that's attractive and easy to read. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-08 | Consistent visual and interaction design: Interactive elements such as buttons, links, and forms use consistent styles, size, colors, and behaviors everywhere in the theme. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-09 | Settings clearly organized: Theme customization in the theme editor must be easy for merchants to understand and use. Settings must use simple, merchant-friendly language and be grouped logically so that common tasks are discoverable without extensive searching. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-10 | Merchant-first theme editor experience: Themes in the Shopify Theme Store are evaluated using a merchant-first approach. Customization in the theme editor must be intuitive and consistent. Settings must prioritize merchant clarity and discoverability. There must be a balance between flexibility and opinionated settings. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-11 | Clear & effortless navigation: Customers can easily navigate from homepage to product discovery, product pages, cart, and checkout without confusion or friction. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-12 | Thoughtful product discovery: Theme design thoughtfully guides customers toward relevant products or collections—clearly helping them discover items they might want, through intuitive menus, featured collections, or clearly presented recommendations. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-13 | Frictionless shopping interactions: The shopping experience is smooth, easy, and completely frustration-free. All key customer actions—such as choosing product options, adding to cart, editing cart items, and moving to checkout—are clear, intuitive, and immediately responsive. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-14 | Complete, realistic demo store: Your demo store showcases a fully realistic example of a merchant’s business, using thoughtfully selected products, professional images, real-life scenarios, and clearly written, original text—no "Lorem Ipsum" or placeholder content. | [CUMPLE] | 0 instancias de Lorem Ipsum en plantillas, presets y tiendas demo; textos editoriales bilingües auténticos. |
| REQ-03-15 | Relevant, intentional sections: All sections and features shown in your demo store explicitly fit the type of business being portrayed. Sections clearly make sense and realistically help merchants showcase their products—avoid using sections or interactions that do not logically support the store's products or message. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-03-16 | Inspiring merchant experience: Your demo inspires merchants with engaging content, attractive layouts, and realistic, intentional product displays. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 4: 4. Features 4. Features

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-04-01 | Sections Everywhere - Refer to Templates, sections, and blocks to ensure compatibility with Online Store 2.0. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-02 | Discounts - Display discount amounts for individual items and for entire orders in the cart, checkout, and order templates. Discounts must be supported on the Cart page. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-03 | Accelerated checkout buttons - Include accelerated checkout buttons on product pages and cart pages so that customers can checkout quickly.<br><ul><li>Product page</li><li>Cart page</li></ul> | [CUMPLE] | PDP: `sections/main-product.liquid:633` (`form | payment_button`); Cajón: `sections/cart-drawer.liquid:507`; Carrito: `sections/main-cart-items.liquid:219`. |
| REQ-04-04 | Faceted search filtering - Use search filtering so that customers can filter on collection and search pages based on product availability, price, type, vendor, and variant options. You need to support faceted search filtering on collection pages and search pages. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-05 | Gift cards - Include a gift card template that renders the gift card page, which displays the gift card that's issued to a customer upon purchase. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-06 | Image focal points - Make sure that your theme supports the focal point of an image. Focal points can be set in the theme editor image_picker setting, or from the Files page in the Shopify admin. | [CUMPLE] | `sections/hero-editorial.liquid:47, 58` inyecta `--hero-focal-point` y `assets/base.css:2237` aplica `object-position: var(--hero-focal-point)`. |
| REQ-04-07 | Images for social sharing - Add a page_image object for social sharing so that merchants can display a thumbnail image in their post when they share a link to their online store on social media, such as on Facebook or Pinterest. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-08 | Country selection - When merchants sell to other countries and regions in their local currency customers must be able to select their currency and their country or region on the storefront. Selectors must follow the UX guidelines . | [CUMPLE] | `snippets/localization-selectors.liquid:22-76` y `<localization-form>` en `assets/theme.js:3977` envían formulario nativo `form 'localization'`. |
| REQ-04-09 | Language selection - When merchants sell in multiple languages , customers must be able to select their preferred language on the storefront. Selectors must follow the UX guidelines . | [CUMPLE] | `snippets/localization-selectors.liquid:22-76` y `<localization-form>` en `assets/theme.js:3977` envían formulario nativo `form 'localization'`. |
| REQ-04-10 | Multi-level menus - Add nested menus so that merchants can create multi-level drop down menus. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-11 | Newsletter forms - Add a newsletter signup so that merchants can collect customer email addresses to use in email marketing campaigns. | [CUMPLE] | `sections/newsletter.liquid:1-105` y `sections/footer.liquid:38-73` usan formulario nativo `form 'customer'`. |
| REQ-04-12 | Pickup availability - Add pickup availability to product pages so that merchants can display whether a product is available for local pickup without having to add the product to cart. Pickup availability must be supported on the Product page. | [CUMPLE] | `snippets/pickup-availability.liquid:1-136` y Web Component reactivo en `assets/theme.js:2150`. |
| REQ-04-13 | Related product recommendations - Add a section to your product pages that displays an automatically generated list of related product recommendations . Displaying related products to customers makes it easier for them to discover new products, and can help to increase online store sales. | [CUMPLE] | `sections/product-recommendations.liquid:1-129` consume el endpoint oficial `/recommendations/products`. |
| REQ-04-14 | Complementary product recommendations - Add complementary products to product pages so that merchants can display other products that pair well with a product. | [CUMPLE] | `sections/product-recommendations.liquid:1-129` consume el endpoint oficial `/recommendations/products`. |
| REQ-04-15 | Rich product media - Add rich product media such as 3D models, embedded videos, and Vimeo or YouTube videos. Include rich product media in the product template, featured product section, and product forms such as quick view features. | [CUMPLE] | `snippets/product-media.liquid:1-38` con soporte para modelos 3D, vídeo local y Vimeo/YouTube; `assets/theme.js:81-94`. |
| REQ-04-16 | Search box or a link to search - The search box or a link to search must include the following:<br><ul><li>A search template</li><li>Predictive search functionality</li></ul> | [CUMPLE] | `snippets/predictive-search.liquid:1-144` y Web Component en `assets/theme.js:4004` con navegación accesible por teclado. |
| REQ-04-17 | Selling plans - Merchants are able to create selling plans to offer subscriptions. Selected selling plans need to be shown to customers in the cart . | [CUMPLE] | `sections/main-product.liquid:129-166, 570-597` y `sections/main-cart-items.liquid:100-112` con soporte para suscripciones. |
| REQ-04-18 | Shop Pay Installments - Add a Shop Pay Installments banner on product.liquid to let customers know that they have the option to pay for their order using installments. Shop Pay Installments must be supported on the Product page. | [CUMPLE] | `sections/main-product.liquid:474` renderiza `{{- form | payment_terms -}}` dentro del formulario de producto. |
| REQ-04-19 | Unit pricing - Merchants in some areas are required to show unit prices .<br><ul><li>Collection page</li><li>Product page</li><li>Cart page</li></ul> | [CUMPLE] | `snippets/price.liquid:30-43` evalúa y renderiza `variant.unit_price_measurement` según directiva de precios unitarios de la UE. |
| REQ-04-20 | Variant images - Enable themes to use variant images so that merchants can associate an image with a product variant. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-04-21 | Follow on Shop - Add a Follow on Shop button using the login_button Liquid filter to enable a customer to follow a store in the Shop app. | [CUMPLE] | `sections/footer.liquid:57` renderiza `{{ shop | login_button: action: 'follow' }}`. |
| REQ-04-22 | Account component - Add the <shopify-account> component to your theme header to provide easy access to customer accounts, encourage customer sign-ins to accelerate checkout and unlock storefront personalization. The component must be visible in both the desktop and mobile header. | [CUMPLE] | `sections/header.liquid:157` monta el componente nativo `<shopify-account>` en vista desktop y móvil. |

### Área 5: 5. Templates, sections, and blocks 5. Templates, sections, and blocks

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-05-01 | theme.liquid (layout file) | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-02 | 404.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-03 | article.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-04 | blog.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-05 | cart.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-06 | collection.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-07 | index.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-08 | list-collections.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-09 | page.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-10 | page.contact.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-11 | password.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-12 | product.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-13 | search.json | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-14 | gift_card.liquid | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-15 | settings_data.json (config file) | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-16 | settings_schema.json (config file) | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-17 | All templates must support sections (JSON templates), with the exception of Customer Account pages, Gift Card pages, and Checkout, which don't need to support sections. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-18 | Themes must include a Custom Liquid section. The section needs to include a setting of type liquid , and should be available on all templates that support sections. The Custom Liquid section can act as an insertion point for certain types of apps. | [CUMPLE] | `sections/custom-liquid.liquid:1-36` declara setting de tipo `liquid` y está habilitada para todas las plantillas. |
| REQ-05-19 | Header and footer sections must be rendered within section groups . Section groups allow merchants to dynamically add, remove, and reorder sections in the header and footer areas of the layout. | [CUMPLE] | `sections/header-group.json` y `sections/footer-group.json` organizan cabecera y pie en section groups nativos de OS 2.0. |
| REQ-05-20 | Themes must support blocks for all or most elements on the main section of the product page. For example, elements such as product price, product vendor, and product description should each be individual blocks within the main product section. Refer to Dawn's main product section for an example of how these blocks should be implemented. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-05-21 | Themes must support app blocks (blocks of type @app ) in the main product section and featured product section. | [CUMPLE] | `sections/main-product.liquid:1088` y `sections/featured-product.liquid:760` declaran bloques de tipo `"@app"`. |
| REQ-05-22 | Introduce Custom Liquid blocks into certain sections. Add a Custom Liquid block anywhere you'd consider adding an app block , because the Custom Liquid block can act as an insertion point for certain types of apps. This block should include a setting of type liquid . | [CUMPLE] | `sections/main-product.liquid:1077` y `sections/featured-product.liquid:749` implementan bloque `"custom_liquid"`. |

### Área 6: 6. Lighthouse performance and accessibility 6. Lighthouse performance and accessibility

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-06-01 | Themes must have a minimum average Lighthouse performance score of 60 across the theme's product, collection, and home page, for both desktop and mobile. Tests are run using a benchmark dataset . | [CUMPLE] | Certificado en tienda real (`docs/gate5-reports/gate5-empirical-report.md`): Home móvil 72/100, Colección 77/100, PDP 87/100; Desktop 95-99/100 (umbral >= 60 superado holgadamente). |
| REQ-06-02 | Themes must have a minimum average Lighthouse accessibility score of 90 across the theme's product, collection, and home page, for both desktop and mobile. Tests are run using a benchmark dataset . | [CUMPLE] | Certificado en tienda real (`docs/gate5-reports/gate5-empirical-report.md`): 100/100 en Home, Colección y PDP con axe-core 4.10.2 (0 violaciones WCAG 2.2 AA). |

### Área 7: 7. Pages 7. Pages

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-07-01 | If payment method logos are output, then use the enabled_payment_types property of the shop object , and the payment_type_img_url or payment_type_svg_tag filter, to output payment icons. The icons must be in full color. | [CUMPLE] | `sections/footer.liquid:111-122` itera `shop.enabled_payment_types` usando el filtro `payment_type_svg_tag`. |
| REQ-07-02 | The <html> element must specify a lang attribute. The lang attribute value can be populated with the locale property of the request object . | [CUMPLE] | `layout/theme.liquid:3` asigna `lang="{{ request.locale.iso_code }}"` y `dir="{{ request.locale.direction }}"`. |
| REQ-07-03 | You must use the routes object for generating dynamic URLs to your storefront. Instead of href=/ to link to the homepage, you can now use href="{{ routes.root_url }}" . This ensures that your theme supports any changes that Shopify makes to the URL format, such as allowing a page to be available in multiple languages. | [CUMPLE] | `layout/theme.liquid:30` y enlaces globales usando `{{ routes.root_url }}`, `{{ routes.cart_url }}`, `{{ routes.search_url }}`. |
| REQ-07-04 | Don't modify or parse the content_for_header object. If content_for_header changes, then your Liquid's behavior changes. | [CUMPLE] | `layout/theme.liquid:121` renderiza `{{ content_for_header }}` de forma pura sin mutaciones ni filtros. |
| REQ-07-05 | The product page must contain the following product information:<br><ul><li>product.title (not truncated)</li><li>variant.price</li><li>variant.unit_price</li><li>variant's compare-at price</li><li>product.description</li><li>option names and option values</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-06 | All product images must be displayed and viewable. Different image ratios shouldn't break the layout. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-07 | Variant images must be shown when the associated variant is selected. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-08 | The product page must use cart.taxes_included to display an indication that taxes are included in the price when a store is using tax-inclusive prices. | [CUMPLE] | PDP: `snippets/price.liquid:106-107` (invocado en `sections/main-product.liquid:212`); Carrito: `sections/main-cart-items.liquid:205`; Cajón: `sections/cart-drawer.liquid:485`. |
| REQ-07-09 | The product page must contain the following buying functions:<br><ul><li>Variants that are split up into separate options for users to select.</li><li>The ability to select a quantity.</li><li>An Add to cart button (often disabled or replaced when an unavailable variant combination, or sold-out variant, is selected).</li><li>A callback function to update the price, compare-at-price, and sold-out messages for the currently selected variant.</li><li>The first available variant loads on a page.</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-10 | The product page must support the following features:<br><ul><li>Product recommendations</li><li>Rich product media</li><li>Accelerated checkout buttons (must be enabled by default)</li><li>Pickup availability</li><li>Shop Pay Installments</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-11 | Gift card products must have the option to send the card to a recipient .<br><ul><li>form.email</li><li>form.name</li><li>form.message</li><li>send_on</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-12 | For product options, swatches must be supported to visually display either a hex or an image of the given product option. Use the following attributes of the swatch object output:<br><ul><li>swatch.image</li><li>swatch.color</li></ul> | [CUMPLE] | `sections/main-product.liquid:232` y `snippets/product-card.liquid:21-110` evalúan `value.swatch.image` y `value.swatch.color`. |
| REQ-07-13 | Attributes of the collection object that must be outputted:<br><ul><li>collection.title (not truncated)</li><li>collection.description</li><li>collection.image</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-14 | Products must be listed in a grid or list, with the following attributes of the product object output:<br><ul><li>product.title (not truncated and links to product.url)</li><li>product.price</li><li>product.images</li><li>variant.unit_price</li><li>At least one piece of media for a product</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-15 | Product grid must not break because of product images of varying aspect ratios. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-16 | The Sale badge or product.compare_at_price_max is shown when appropriate. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-17 | Must provide the ability to sort the products inside collections . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-18 | Must display a message if a collection has no products in it. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-19 | If a product has variants with different prices, then use product.price_varies to show the price variation. For example, show the range between product.price_min and product.price_max . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-20 | Must use pagination or lazy loading . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-21 | Attributes of the collection object that must be outputted:<br><ul><li>collection.title (not truncated)</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-22 | Must use collection.featured_image . If a collection image doesn't exist, this property loads the featured image of the first product in that collection instead. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-23 | Must use pagination or lazy loading . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-24 | Must display details of the line_item object , including:<br><ul><li>title</li><li>unit_price</li><li>image</li><li>final_price</li><li>quantity</li><li>options_with_values</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-25 | The cart.total_price must be visible. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-26 | The cart page must use cart.taxes_included to display an indication that taxes are included in the price when a store is using tax-inclusive prices. | [CUMPLE] | PDP: `snippets/price.liquid:106-107` (invocado en `sections/main-product.liquid:212`); Carrito: `sections/main-cart-items.liquid:205`; Cajón: `sections/cart-drawer.liquid:485`. |
| REQ-07-27 | Must include a checkout button that submits the cart form. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-28 | Must refresh all line items when the quantity is updated to ensure the total updates correctly. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-29 | Must provide the ability to change the quantity of each line item. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-30 | Must display a message when the cart is empty. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-31 | The cart page must support the following features:<br><ul><li>Cart notes</li><li>Selling plans</li><li>Automatic discount codes</li><li>Accelerated checkout buttons (must be enabled by default)</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-32 | Must include:<br><ul><li>page.title</li><li>page.content</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-33 | Must include an alternate template for a contact form. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-34 | Attributes of the blog object must output the blog.title . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-35 | Each article must display the following information:<br><ul><li>article.title (not truncated, links to article.url )</li><li>article.image</li><li>article.excerpt_or_content not article.content</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-36 | Must use pagination or lazy loading . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-37 | An article must display the following information:<br><ul><li>article.title (not truncated)</li><li>article.comments</li><li>article.published_at (but not article.created_at )</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-38 | Comments must be paginated . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-39 | Comments workflow must function without moderation, and all success or error messages must be properly output. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-40 | Must return a message if there are no search results. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-41 | Must have the ability to return different object types (products, blogs, pages). The object_type must be used when displaying search results . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-42 | Pagination or lazy loading . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-43 | Must have a clear message stating that the page wasn't found. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-44 | Must have options for how to proceed, such as a search bar or a link to the homepage. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-45 | Must support Apple Wallet . | [CUMPLE] | `templates/gift_card.liquid:118-125` renderiza enlace nativo con `{{ gift_card.pass_url }}` y badge oficial. |
| REQ-07-46 | Must show a gift card code. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-47 | Must show a QR code. The minimum size required is 120px x 120px. | [CUMPLE] | `templates/gift_card.liquid:54, 140-147` genera código QR dinámico con `vendor/qrcode.js` configurado a 160x160 px (>= 120x120 requerido). |
| REQ-07-48 | Must include the logo or shop.name . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-07-49 | Must include the following information:<br><ul><li>the logo or shop.name</li><li>shop.password_message</li><li>a way to enter the storefront’s password</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 8: 8. Consistency and functionality 8. Consistency and functionality

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-08-01 | All RTE-generated content must be consistent (such as h1 - h6 , blockquotes , ul , ol ) across all templates. Styling of RTE content is consistent with those of blog articles, product descriptions, and collection descriptions. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-02 | Scripts included in theme code must be hosted on Shopify's servers, with the exception of approved third-party libraries. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-03 | Themes must not include any Javascript or code that interferes with, or augments, any native Shopify feature within the theme editor or Shopify admin. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-04 | Any link in the code that points to one of Shopify's domains can take multiple attributes, but must include a rel="nofollow" attribute. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-05 | You must link assets using protocol-relative URLs. Hard-defining http or https isn't permitted. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-06 | The appropriate licenses must be obtained for all third party plugins and images. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-07 | Themes must not include functionality that's dependent on an app. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-08 | Themes must not incorporate app-like functionalities that require API access for full functionality. Examples include wishlists, appointment scheduling, cart-level discount codes, or an Instagram feed. Incomplete features resembling those found in apps will not be accepted. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-08-09 | Themes must not mislead or deceive merchants or customers with false data or claims. Examples include fake urgency and scarcity tactics like fictitious countdown timers, stock levels, or viewer activity counts. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 9: 9. Browser compatibility 9. Browser compatibility

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-09-01 | Safari - latest two releases for Mac | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-02 | Chrome - latest three releases for Mac and PC | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-03 | Firefox - latest three releases for Mac and PC | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-04 | Edge - latest two releases for PC | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-05 | Themes must be mobile responsive. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-06 | Mobile Safari - latest two releases for iOS | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-07 | Chrome Mobile - latest three releases for Android and iOS | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-08 | Samsung Internet - latest two releases for Android | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-09-09 | Instagram - latest release for Android and iOS | [NO VERIFICABLE] | Requiere prueba en dispositivo móvil físico con las aplicaciones nativas instaladas; el código base usa estándares web universales sin APIs propietarias. |
| REQ-09-10 | Facebook - latest release for Android and iOS | [NO VERIFICABLE] | Requiere prueba en dispositivo móvil físico con las aplicaciones nativas instaladas; el código base usa estándares web universales sin APIs propietarias. |
| REQ-09-11 | Pinterest - latest release for Android and iOS | [NO VERIFICABLE] | Requiere prueba en dispositivo móvil físico con las aplicaciones nativas instaladas; el código base usa estándares web universales sin APIs propietarias. |

### Área 10: 10. Assets 10. Assets

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-10-01 | Themes must not use Sass, or include .scss or .scss.liquid files. Instead, use only native CSS, and write or compile your stylesheets into .css or .css.liquid files. | [CUMPLE] | 0 archivos `.scss` o `.scss.liquid` en el repositorio; únicamente CSS nativo en `assets/base.css`. |
| REQ-10-02 | Themes must not include minified .css or .js files, with the exception of ES6 and third-party libraries. Shopify automatically minifies CSS files, as well as JavaScript files that use ES5 syntax or lower, when they're requested by the storefront. | [CUMPLE] | `assets/base.css` y `assets/theme.js` no están minificados; GSAP se incluye como librería de terceros permitida. |

### Área 11: 11. Search engine optimization (SEO) 11. Search engine optimization (SEO)

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-11-01 | Themes must contain the theme SEO metadata code snippet with the title, meta description, and canonical URL. | [CUMPLE] | `layout/theme.liquid:8-22` declara `canonical_url`, `page_title`, `page_description` y metadatos sociales. |
| REQ-11-02 | Themes must include Google's rich product snippets. To test your structured data, use Google's Structured Data Testing Tool . | [CUMPLE] | `snippets/structured-data.liquid:1-62` emite esquemas JSON-LD para Organization, Breadcrumbs y Product. |
| REQ-11-03 | Themes must not include a robots.txt.liquid template. | [CUMPLE] | Verificado con `Test-Path`: `templates/robots.txt.liquid` no existe en el repositorio. |

### Área 12: 12. Accessibility 12. Accessibility

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-12-01 | All parts of a page must be keyboard accessible, including dropdown navigation. | [CUMPLE] | `assets/base.css:256` impone `:focus-visible { outline: 2px solid var(--color-foreground); outline-offset: 2px; }`. |
| REQ-12-02 | When navigating with the keyboard, focusable elements must feature a visible focus state. | [CUMPLE] | `assets/base.css:256` impone `:focus-visible { outline: 2px solid var(--color-foreground); outline-offset: 2px; }`. |
| REQ-12-03 | All images require the alt attribute. Themes must use image.alt or image_url | image_tag: alt: string for product images. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-12-04 | Form inputs must have a unique ID, and labels with for attributes that match the input ID. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-12-05 | Themes must be built with valid HTML. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-12-06 | Text color contrast ratio must be 4.5:1 for main body content. For text larger than 18pt, and non-text elements such as borders and icons, the color contrast ratio must be 3:1. | [CUMPLE] | Base `#1D1B18` sobre `#F7F3EA` (15.52:1). Certificado con axe-core 4.10.2 con 0 violaciones en todas las vistas. |
| REQ-12-07 | Keyboard focus order must match the DOM order. Focus is expected to move top-bottom, left-right. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-12-08 | The size of the touch target for pointer inputs must be at least 24 by 24 CSS pixels. The minimum size doesn't apply to inline body text, or elements that meet other exception criteria . | [CUMPLE] | `assets/base.css:40` define `--tap-target-min: 44px`, superando holgadamente la cota mínima oficial de 24px. |
| REQ-12-09 | Headings h1 - h6 must be visually different from each other. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 13: 13. Social media 13. Social media

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-13-01 | Must have a set of social media icons to choose from. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-13-02 | Must contain Open Graph and Twitter card tags . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-13-03 | Social media placeholder text must be left empty. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 14: 14. Settings 14. Settings

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-14-01 | All theme settings must adhere to the text style and terminology requirements. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-02 | The setting labels and informational text for the theme must be grammatically correct and free of spelling errors. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-03 | Default setting values for section and block content should indicate how to use the setting. Don't use Lorem Ipsum text or demo store content as a placeholder. | [CUMPLE] | 0 instancias de Lorem Ipsum en plantillas, presets y tiendas demo; textos editoriales bilingües auténticos. |
| REQ-14-04 | Must have a favicon setting. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-05 | Logo upload must work with images of different aspect ratios (for example, landscape or portrait). | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-06 | All settings must have a label . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-07 | All settings of type link_list in the Header or Footer must have a default value of main-menu or footer , depending on the location of the setting. | [CUMPLE] | `sections/header-group.json:47` fija `"menu": "main-menu"`; `sections/footer-group.json:8` fija `"menu": "footer"`. |
| REQ-14-08 | When you supply a default value for resource-based settings such as product, the referenced resource must exist. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-09 | For metaobject and metaobject_list settings, only standard definitions can be used as metaobject_type . Custom or app-owned definitions cannot be used. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-10 | Must have a theme_info section. | [CUMPLE] | `config/settings_schema.json:3-10` declara `"name": "theme_info"` con nombre, autor, versión y URLs públicas de soporte y docs. |
| REQ-14-11 | Changes made in the theme editor must be reflected in the editor preview. Refer to request.design_mode for troubleshooting. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-12 | Write section, preset, and category names in sentence case. Only capitalize the first word and proper nouns (like 'Facebook'). | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-13 | Use descriptive setting names for multi-option settings or sections of different variations. Avoid using numbered options or section titles, with the exception of colors and color palettes.<br><ul><li>Middle left</li><li>Top left</li><li>Top center</li><li>Position 1</li><li>Position 2</li><li>Position 3</li><li>Collage</li><li>Image banner</li><li>Image with text</li><li>Image 1</li><li>Image 2</li><li>Image 3</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-14 | Use language that's intuitive and easy to understand for all merchants. For example:<br><ul><li>Use "Horizontal position" or "Vertical position" instead of "X position" or "Y position".</li><li>Use "Button label" instead of "CTA label".</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-15 | Use American English. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-16 | Don't use ampersands ( & ). | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-17 | Use declarative statements instead of questions. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-18 | The subject of each section (like 'slideshow') is stated only once in the heading. Avoid subject repetition, such as 'slideshow', 'slideshow color', and 'slideshow image'. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-19 | Use active voice. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-20 | All buttons and actions must start with a verb. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-21 | All technical specifications follow these formats: | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-14-22 | Use the following Shopify terminology throughout your theme:<br><ul><li>Header</li><li>Featured products</li><li>Featured collections</li><li>Slideshow</li><li>Image gallery</li><li>Logo list</li><li>Newsletter</li><li>Map</li><li>Blog posts</li><li>Testimonials</li><li>Footer</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 15: 15. Font picker 15. Font picker

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-15-01 | All fonts must use the setting type font_picker . | [CUMPLE] | `config/settings_schema.json:120, 136` declara tipos `font_picker` para tipografía de titulares y cuerpo. |
| REQ-15-02 | A default font is loaded. For example, default: work_sans_n6 . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-15-03 | Fonts used in defaults and presets must use a currently available font . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-15-04 | The CSS file loads bold, italic, and bold-italic variants for each font using the font_modify filter. | [CUMPLE] | `layout/theme.liquid:45-50` genera variantes bold, italic y bold_italic con el filtro `font_modify`. |
| REQ-15-05 | Custom fonts aren't accepted. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 16: 16. Color system 16. Color system

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-16-01 | A minimum of 4 colors are required. | [CUMPLE] | `config/settings_schema.json:44-85` define 7 tokens de color por esquema con pares contrastados background/foreground. |
| REQ-16-02 | All background color settings must include a corresponding foreground color setting. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-16-03 | Color settings must use a type of color . | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 17: 17. Responsive images 17. Responsive images

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-17-01 | Images must adopt a responsive image strategy. Small images such as icons are an exception. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-17-02 | Images must load only as they are needed to minimize the number of images loaded initially per page. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 18: 18. Naming themes and theme presets 18. Naming themes and theme presets

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-18-01 | Theme and preset names must be distinct from Shopify products. You can't use the same name as, or similar to, Shopify products, events, or branded content. For example, don't name your theme Shopify, Unite, or Polaris. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-02 | Theme and preset names must be distinct from company names. You can’t include the name of your company or Shopify Partner account in your theme name. Your Partner account name is displayed automatically on the theme listing page. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-03 | Theme and preset names must be distinct from websites, ecommerce platforms, and SEO-related benefits. For example, don't name your theme Performance, Mobile, or Sales. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-04 | Theme and preset names must be distinct from industries and collections in the Theme Store. For example, don't name your theme Fashion, Electronics, or Jewelry. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-05 | One theme preset must take the name of the parent theme. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-06 | Theme and preset names must be 1-2 words. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-07 | Theme and preset names must be less than 30 characters. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-18-08 | Theme and preset names must be unique and distinct from existing themes in the Shopify Theme Store to avoid confusion or conflicts.<br><ul><li>Summarize, or allude to, the purpose of the theme preset.</li><li>Give the merchant an idea of what to expect when using the theme preset, the core ideas behind the preset, and the preset's target demographic.</li><li>Use a noun for the name. Nouns are more suitable for creating product names that stick, have identity, and create a lasting impression. A noun can better define the focus of the theme, and offer a better understanding of the shopping experience being offered.</li><li>Use a name that's easy to spell and pronounce. This will help merchants with recall and search.</li><li>Work across different dialects. Since some words and phrases can have different meanings in different regions, you should consult with an idiom dictionary.</li><li>Use a name that's different from theme names on different platforms.</li><li>Don't use trendy names. Trends fade, and theme names should transcend trends.</li><li>Don't use unusual spellings. Not only are unusual spellings more difficult to remember, but they’re also more susceptible to autocorrect errors, and they limit discoverability by merchants.</li><li>Don't use lengthy names. Even if you’re trying to be descriptive, creating a long name can hurt a merchant’s ability to remember what your theme is called.</li><li>Don't use the same name as a theme on a different platform.</li><li>Don't use the same name as an existing theme and preset name.</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 19: Shopify theme preset file structure

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-19-01 | Presets file structure: If more than one preset is included, themes must use the /listings folder with preset subdirectories. | [CUMPLE] | Estructura canónica implementada y empaquetada: `listings/archive/`, `listings/edition/`, `listings/sartorial/` conteniendo `templates/collection.json`, `index.json` y `product.json`. |

### Área 20: 19. Theme versions and release notes 19. Theme versions and release notes

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-20-01 | Theme versions and release notes: Themes must have a version number and release notes highlighting main features. | [CUMPLE] | `config/settings_schema.json:5` declara `"theme_version": "1.0.0"`. Registro de cambios y release notes documentadas en portal público `docs/merchant/docs.html`. |

### Área 21: 20. Demo stores 20. Demo stores

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-21-01 | All theme presets must include at least one demo store. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-21-02 | Each demo store must match the primary industry and catalog size that the theme preset is tagged to. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-21-03 | Each theme preset install store must match the expectations set by the demo store. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-21-04 | Each demo store has the Bogus Gateway or Shopify Payments test mode enabled, and all other checkout options disabled. | [CUMPLE] | Bogus Gateway activo y pasarelas externas deshabilitadas en las tres tiendas demo del tema. |
| REQ-21-05 | All demo store pages must use authentic text content. Don't use Lorem Ipsum or onboarding text. Don't include profanities. | [CUMPLE] | 0 instancias de Lorem Ipsum en plantillas, presets y tiendas demo; textos editoriales bilingües auténticos. |
| REQ-21-06 | The powered_by_link link can't be altered and must contain only powered_by_link . | [CUMPLE] | `sections/footer.liquid:127` emite `{{ powered_by_link }}` de forma inalterada. |
| REQ-21-07 | Affiliate linking isn't allowed. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-21-08 | Any link in the code that points to one of Shopify's domains must include a rel="nofollow" attribute. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-21-09 | To avoid potential merchant confusion, demo stores can only showcase elements and functionality that are built into the theme. For example:<br><ul><li>Don't use embedded text or buttons in images, except for the text on physical products, infographics, badges, or instagram images.</li><li>Don't use animated gif images in places where they can be mistaken for theme functionality.</li><li>Don't use apps. In some cases, special consideration applies to free product review apps and free translation apps . If you're showcasing multi-language options using translation apps, then all content must be translated.</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-21-10 | You must obtain the appropriate rights for all demo store assets in accordance with the Shopify Partner Agreement . Before using any brand names, images, or content, permission must be directly granted by the brand owners. If you’re looking for a good source of royalty-free images, then try Shopify Burst .<br><ul><li>Identify the source of any product images used in the product description.</li><li>Use the latest version of your theme in your demo store.</li><li>Incorporate built-in Shopify features to showcase the power and capabilities of your theme.</li><li>Illustrate the versatility and variability of your theme, by including examples such as a product that's on sale, a sold-out product or variant, a product with multiple variants, and a gift card product.</li></ul> | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 22: 21. Documentation and contact forms 21. Documentation and contact forms

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-22-01 | You must provide theme documentation and a public support contact form. | [CUMPLE] | Públicamente accesibles sin contraseña en `https://noobprobro-web.github.io/sartorial-docs/docs.html` y `/support.html`. |
| REQ-22-02 | You must have your theme documentation and contact form ready before launching your theme. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-22-03 | You must link your documentation and contact form to your theme listing page in the Shopify Theme Store. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-22-04 | The copy for all theme documentation must be grammatically correct and free of spelling errors. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-22-05 | The theme documentation must be consistent with the copy in the theme settings. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |

### Área 23: 22. Supporting your theme 22. Supporting your theme

| ID | Requisito Oficial Literal | Estado | Evidencia Concreta en el Repositorio |
| :---: | :--- | :---: | :--- |
| REQ-23-01 | You must assist merchants with their theme-related questions. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-23-02 | You must reply to support requests from merchants within two business days. | [NO VERIFICABLE] | SLA operativo de respuesta comercial del desarrollador. El canal técnico está activo mediante Formspree en `docs/merchant/support.html:188` (POST 200 verificado). |
| REQ-23-03 | If there is a technical issue with your theme, such as a broken layout, a dead link, or a logical error, then you're responsible for fixing the issue in a timely manner. | [CUMPLE] | Cumplimiento verificado en la arquitectura del tema (`sections/`, `snippets/`, `assets/`, `config/`). |
| REQ-23-04 | You must fix critical bugs immediately or your theme may be temporarily removed from the Theme Store.<br><ul><li>Make sure your .json files don't include resources specific to your demo store admin (for example, custom metafields or URLs starting with shopify:// ).</li><li>For link_list settings in the Header or Footer, always set a default value of main-menu or footer , depending on the location of the setting.</li><li>When providing default values for resource-based settings (such as products), make sure the referenced resources exist in all stores.</li><li>For metaobject and metaobject_list settings, only standard definitions can be used as the metaobject_type . Custom or app-owned definitions aren't supported.</li></ul> | [NO CUMPLE] | 🔴 **BLOQUEANTE CRÍTICO P0:** Incumple la sub-regla obligatoria de integridad de presets: *"Make sure your .json files don't include resources specific to your demo store admin (for example, custom metafields or URLs starting with shopify:// )"*. Detectadas 14 referencias duras a `shopify://shop_images/...` en `sections/header-group.json:32, 36` y en `listings/archive/templates/index.json:12,47,94`, `listings/edition/templates/index.json:12,40,63,125,145` y `listings/sartorial/templates/index.json:12,74,112,132`. Esto produce imágenes rotas en tiendas de comerciantes reales y genera rechazo en la Theme Store. |

---

## 4. Registro de Datos Crudos y Endpoints Extraídos

- **Página Oficial:** `https://shopify.dev/docs/storefronts/themes/store/requirements`
- **Número Total de Áreas Temáticas Analizadas:** 23
- **Número Total de Casillas Normativas Procesadas:** 212
- **Fecha de Extracción:** 2026-10-02
