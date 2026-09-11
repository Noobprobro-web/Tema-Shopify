# Matriz Oficial de Criterios de Aceptación: Shopify Theme Store (2025–2026)

Fuente oficial: [Shopify Dev - Theme Store Requirements](https://shopify.dev/docs/storefronts/themes/store/requirements)

Esta matriz resume los 22 apartados normativos oficiales que Shopify exige para la aprobación en el Shopify Theme Store. Sirve como referencia técnica de QA y diseño para todo el ciclo de desarrollo.

---

## 1. Arquitectura y Estructura Técnica (Online Store 2.0)

| Requisito | Criterio de Aceptación Oficial | Verificación / QA |
| :--- | :--- | :--- |
| **Código Base Original** | Prohibido derivar de Dawn o Horizon. Solo se admite código 100% original o el starter oficial `shopify/skeleton-theme`. | Inspección de repositorios y diffs de arquitectura. |
| **Plantillas JSON** | Todas las plantillas principales deben ser formato JSON: `index.json`, `product.json`, `collection.json`, `list-collections.json`, `cart.json`, `blog.json`, `article.json`, `page.json`, `page.contact.json`, `search.json`, `404.json`, `password.json`. | Existencia y validación de sintaxis JSON en `/templates`. |
| **Plantillas Liquid Especiales** | `theme.liquid` (layout principal) y `gift_card.liquid` (plantilla Liquid obligatoria). | Render y comprobación de tags globales. |
| **Section Groups** | Soporte para grupos de secciones en cabecera y pie (`sections/header-group.json`, `sections/footer-group.json`). | Posibilidad de añadir/reordenar secciones en Header/Footer en Theme Editor. |
| **App Blocks (`@app`)** | Las secciones y plantillas clave deben soportar bloques de aplicaciones (`@app`) para evitar inyección de código de terceros. | Añadir bloques de apps en editor sin errores. |
| **Ajustes y Schema** | Configuración mediante `settings_schema.json` y schemas en cada sección con tipos válidos. Terminología estandarizada de Shopify. | `shopify theme check` sin errores de schema. |
| **Exclusiones de empaquetado** | Prohibido incluir `config/markets.json` en el paquete final del tema. | Revisar contenido antes de `theme package`. |

---

## 2. Performance y Core Web Vitals (CWV)

| Requisito | Criterio de Aceptación Oficial | Verificación / QA |
| :--- | :--- | :--- |
| **Puntaje Lighthouse** | Promedio de Lighthouse Performance **>= 60** en móvil en Home, Colección y Producto (evaluado con catálogo real). Objetivo técnico recomendado: **85–95+**. | Lighthouse CI / Chrome DevTools en móvil simulado. |
| **Optimización de Recursos** | Sin librerías JS pesadas (jQuery, frameworks SPA). JavaScript modular vanilla (Web Components / ES Modules) diferido (`defer`). | Inspección de red (`Network`) y waterfall. |
| **Cero CSS/SCSS obsoleto** | No usar `.scss` ni `.scss.liquid` (deprecados). CSS modular vanilla limpio. Prohibido minificar código fuente propio dentro del tema. | `shopify theme check` y estructura de assets. |
| **Imágenes Responsivas** | Uso de filtros `image_url` con `srcset` y atributo `sizes` adaptativo. Punto focal nativo (`image.presentation.focal_point`). | Inspección de elementos `<img>` y cambio de viewport. |
| **LCP y CLS** | Atributo `fetchpriority="high"` en imagen de hero principal. `loading="lazy"` en imágenes bajo el pliegue. Dimensiones `width` y `height` explícitas para evitar saltos (CLS < 0.1). | DevTools Performance y métricas Web Vitals. |

---

## 3. Accesibilidad (WCAG 2.1 / 2.2 AA)

| Requisito | Criterio de Aceptación Oficial | Verificación / QA |
| :--- | :--- | :--- |
| **Contraste de Color** | Mínimo 4.5:1 para texto normal y 3:1 para texto grande y elementos de interfaz interactivos. | Auditoría con axe-core y Wave. |
| **Navegación por Teclado** | Navegación completa por Tab sin bloqueos. Indicador `:focus-visible` claramente visible en todos los elementos interactivos. | Prueba manual solo con teclado (Tab, Shift+Tab, Enter, Space). |
| **Drawers y Modales** | Trampa de foco (focus trap) al abrir drawer de carrito, menú móvil o quick-view. Cierre con tecla Escape y devolución del foco al botón detonador. | Prueba de apertura/cierre con teclado y lector de pantalla. |
| **Áreas de Toque Táctil** | Objetos táctiles mínimos de 24x24 px (ideal 44x44 px para botones primarios en mobile). | Inspección de estilos táctiles en móvil. |
| **Semántica y Live Regions** | Jerarquía estricta de encabezados (`h1` único por página, seguido de `h2`–`h6`). `aria-live` para anunciar cambios dinámicos (añadir al carrito, variantes, filtros). | Prueba con NVDA / VoiceOver y axe-core. |
| **Formularios y Medios** | Inputs vinculados con `<label for="...">`. Atributos `alt` obligatorios en imágenes descriptivas y vacíos (`alt=""`) en decorativas. | Inspección de tags HTML y checks de accesibilidad. |
| **Skip Link y Reduced Motion** | Enlace "Saltar al contenido" (`#main-content`) al inicio de `theme.liquid`. Media query `@media (prefers-reduced-motion: reduce)` para apagar transiciones. | Emulación en DevTools de `prefers-reduced-motion`. |

---

## 4. Funcionalidades Comerciales Obligatorias

| Requisito | Criterio de Aceptación Oficial | Verificación / QA |
| :--- | :--- | :--- |
| **Checkout Acelerado** | Botones de checkout dinámico en PDP y Carrito (`additional_checkout_buttons`). No alterar colores corporativos de Shopify/marcas. | Visualización de Shop Pay, PayPal, etc. en test mode. |
| **Filtros Facetados Nativos** | Filtros nativos de colección y búsqueda mediante el objeto Liquid `filter` (precio, disponibilidad, tipo, variantes, metaobjetos). | Filtrado interactivo en PLP y Search. |
| **Búsqueda Predictiva** | Autocompletado rápido consumiendo `/search/suggest.json` (productos, colecciones, artículos, páginas). | Búsqueda en vivo con render accesible. |
| **Web Component de Cuenta** | Integración del componente web obligatorio `<shopify-account>` en cabecera desktop y móvil. | Prueba de estados de cliente logueado y anónimo. |
| **Follow on Shop** | Botón oficial Follow on Shop (`{{ shop \| login_button: action: 'follow' }}`). | Footer / PDP en mercados compatibles. |
| **Planes de Venta / Suscripción** | Compatibilidad nativa de Selling Plans en PDP y en el carrito (visualización clara de recurrencia y precio con descuento). | Producto con selling plan asignado. |
| **Shop Pay Installments** | Banner de pago a plazos en PDP (`{{ form \| payment_terms }}`). | Producto elegible en EE.UU./test. |
| **Precio Unitario (Unit Pricing)** | Desglose de precio por unidad (`variant.unit_price`) en Colección, PDP y Carrito (requisito legal UE). | Producto configurado con unidad de medida. |
| **Variantes y Swatches** | Soporte de swatches nativos de categoría (`swatch.image` / `swatch.color`). Carga inicial de la primera variante disponible. | Selección de variante y cambio dinámico de precio/URL. |
| **Pickup Availability** | Disponibilidad de recogida en tienda local en PDP si está configurada en la tienda. | Consulta de disponibilidad por sucursal. |
| **Recomendaciones Nativas** | Secciones de productos relacionados (`intent=related`) y complementarios (`intent=complementary`). | Consumo de `/recommendations/products`. |
| **Medios Enriquecidos** | Soporte de galería para Modelos 3D (`model-viewer`), Videos nativos y Videos externos (YouTube/Vimeo). | Producto con medios 3D y video. |
| **Plantilla Gift Card** | Soporte de Apple Wallet y formulario con campos de destinatario (`form.email`, `form.name`, `form.message`, `send_on`). | Generación de tarjeta de regalo de prueba. |
| **Selector de Moneda/Idioma** | Selectores mediante el formulario oficial `{% form 'localization' %}` sin hacks de cookies externas. | Cambio fluido de mercado/moneda. |

---

## 5. Empaquetado, Presets y Documentación

| Requisito | Criterio de Aceptación Oficial | Verificación / QA |
| :--- | :--- | :--- |
| **Estructura de Presets** | Máximo 4 presets por tema. Si hay más de un preset, incluir carpeta `/listings/<preset-name>/templates/` y `/listings/<preset-name>/sections/`. | Estructura en zip para submission. |
| **Nombres de Tema y Presets** | Nombres basados en sustantivos memorables, no tendenciosos ni copiados de otros temas o plataformas. | Validación contra directorio de Shopify Theme Store. |
| **Paridad de Instalación** | Al instalar el tema o cambiar de preset, el diseño, tipografía, paleta y layout deben ser idénticos a la demo (usando textos coherentes y placeholders elegantes). | Comparativa de demo vs fresh install. |
| **Límites de Archivo** | Archivo `.zip` total < 50 MB. Archivos individuales < 20 MB. | Comprobación de peso final de assets. |
| **Documentación y Soporte** | Documentación para merchants con FAQ, tutoriales, política de soporte y formulario de contacto accesible y móvil. | Enlaces funcionales en settings_schema. |
