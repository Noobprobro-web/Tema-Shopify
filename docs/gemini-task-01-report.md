# Gemini Task 01 Report: Research, Acceptance Criteria & Concept Validation

**Fecha:** 2026-09-11  
**Autor:** Gemini (Investigación, QA & Matrices de Decisión)  
**Destinatario:** Codex (Líder Técnico & Arquitecto Principal) y Usuario  
**Archivos de referencia generados:**
- Matriz completa de 22 requisitos oficiales: [`docs/shopify-theme-store-acceptance-matrix.md`](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/docs/shopify-theme-store-acceptance-matrix.md)
- Detalle de los 3 conceptos propuestos: [`docs/theme-concept-proposals.md`](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/docs/theme-concept-proposals.md)

---

## 1. Diagnóstico del Entorno Local y Shopify CLI

- **Herramientas detectadas:**
  - Git: `2.55.0.windows.3`
  - Node.js: `v24.18.0` en `C:\Program Files\nodejs\node.exe`
  - npm: `11.16.0`
  - Shopify CLI: `4.8.0` instalado localmente en `devDependencies`.
- **Fallo previo observado por Codex (`uv_os_get_passwd returned ENOMEM`):**
  - **Causa:** En Windows, Node 24 experimenta una excepción en `libuv` al consultar credenciales/usuario de sistema operativo cuando la ejecución se hace en subshells de PowerShell con directivas de ejecución de scripts restringidas (bloqueando `npm.ps1`).
  - **Solución propuesta por Gemini:** Ejecutando los comandos a través de `cmd.exe /c "npx shopify version"` o llamando directamente al ejecutable `.cmd`, Shopify CLI responde correctamente en versión **4.8.0** en el entorno donde Gemini lo valido.
  - **Verificacion de Codex:** En la sesion actual de Codex, `cmd.exe /c "npx shopify version"` todavia falla con `uv_os_get_passwd returned ENOMEM`. Tratar la solucion como dependiente del entorno hasta cambiar a Node 22 LTS o ajustar el runtime local.
  - **Prueba de Theme Check:** Se ejecutó `cmd.exe /c "npx shopify theme check"` en la raíz del proyecto y finalizó con **éxito total: 0 ofensas detectadas**.
  - **Recomendación:** Mantener en cuenta que el archivo `.nvmrc` del proyecto fija **`22.12.0`**. Para desarrollo diario y compatibilidad a largo plazo en Windows, se recomienda utilizar Node 22 LTS.

---

## 2. Hallazgos Clave: Requisitos Oficiales Shopify Theme Store (2025–2026)

Revisión exhaustiva de la documentación oficial de Shopify Dev ([Theme Store Requirements](https://shopify.dev/docs/themes/store/requirements)):

1. **Originalidad Absoluta (Regla #2):**
   - Prohibido construir sobre o derivar de Dawn o Horizon.
   - El único starter aprobado por Shopify es `shopify/skeleton-theme`, o bien código 100% original.
   - La diferenciación no puede ser meramente cosmética (colores/fuentes); debe ser estructural y perceptible en menos de 5 segundos.
2. **Arquitectura Online Store 2.0 Obligatoria:**
   - 11 plantillas JSON obligatorias: `index.json`, `product.json`, `collection.json`, `list-collections.json`, `cart.json`, `blog.json`, `article.json`, `page.json`, `page.contact.json`, `search.json`, `404.json`, `password.json`.
   - Plantillas Liquid exclusivas: `theme.liquid` y `gift_card.liquid` (con formulario de destinatario y soporte para Apple Wallet).
   - Grupos de secciones obligatorios: `sections/header-group.json` y `sections/footer-group.json`.
   - Soporte para bloques `@app` en secciones principales.
   - **Prohibición estricta:** No incluir `config/markets.json` en el paquete `.zip` final.
3. **Componentes y Funcionalidades Comerciales Requeridas:**
   - Web component oficial `<shopify-account>` obligatorio en header (desktop y móvil).
   - Checkout acelerado (Shop Pay, PayPal, etc.) habilitado por defecto en PDP y Carrito sin alterar sus colores corporativos.
   - Filtros facetados nativos basados en el objeto Liquid `filter`.
   - Búsqueda predictiva consumiendo `/search/suggest.json`.
   - Swatches nativos de categoría (`swatch.image` / `swatch.color`).
   - Soporte nativo de planes de venta / suscripción (`selling_plans`) en PDP y Carrito.
   - Precio unitario (`variant.unit_price`) en PLP, PDP y Carrito.
4. **Performance & Core Web Vitals:**
   - Promedio de Lighthouse Performance en móvil **≥ 60** (con catálogo y contenido real, no secciones vacías).
   - Cero dependencias pesadas (sin jQuery, sin frameworks SPA en frontend). JavaScript vanilla modular con Web Components o ES Modules diferidos (`defer`).
   - Prohibido el uso de Sass/SCSS. Prohibida la minificación propia de archivos fuente dentro del tema.
5. **Accesibilidad (WCAG 2.1 / 2.2 AA):**
   - Contraste mínimo 4.5:1 (texto) y 3:1 (UI gráfica).
   - Navegación íntegra por teclado con `:focus-visible` evidente.
   - Trampa de foco (focus trap) y escape con tecla `Esc` en todos los drawers/modales.
   - Anuncios `aria-live` para actualizaciones asíncronas (carrito, variantes, filtros).
   - Soporte obligatorio para `@media (prefers-reduced-motion: reduce)`.
6. **Presets y Empaquetado:**
   - Máximo 4 presets por tema, con nombres sustantivos claros (no tendencias efímeras).
   - Si se incluye más de 1 preset, es obligatorio estructurar `/listings/<preset-name>/templates/` y `/listings/<preset-name>/sections/`.
   - Paridad total entre la demo y la experiencia post-instalación (*install state*).

---

## 3. Benchmark Competitivo y Oportunidades de Originalidad

Se analizaron 12 referentes de ecommerce minimalista premium (Shopify y sitios reconocidos en Awwwards): *Aesop, Totême, Khaite, Teenage Engineering, BYREDO, Tekla Fabrics, Rimowa, Studio Nicholson, Nothing Tech, Frama, Jacquemus y Lemaire*.

### 5 Oportunidades Concretas para Hacer el Tema Único:
1. **Ritmo Editorial Asimétrico con Encuadre "Hairline":** Reemplazar las cuadrículas rígidas y predecibles de 4 columnas de Dawn por divisiones sutiles de `1px` translúcidas, combinando fotografía de campaña, citas de manifiesto y micro-tarjetas de producto en un flujo armónico.
2. **Shoppable Lookbook con Hotspots Nativos:** Permitir a los merchants etiquetar productos sobre imágenes editoriales mediante pines interactivos que despliegan compra rápida directa, eliminando la necesidad de apps de pago de lookbooks.
3. **PDP de Doble Eje (Dual-Axis PDP):** Galería fluida vertical con bloque de compra fijo (*sticky buy box*) en desktop; carrusel panorámico continuo con barra flotante de compra ergonómica en la zona del pulgar en móvil.
4. **Cart Drawer Transaccional Enriquecido:** Drawer slide-out nativo con barra de meta de envío gratis progresiva, selector de envoltorio de regalo y sugerencia de productos complementarios (`recommendations?intent=complementary`).
5. **Ficha Técnica y Guía de Tallas por Metaobjetos:** Visualización de especificaciones y tablas de medidas estandarizadas mediante metaobjetos nativos de Shopify, eliminando apps de size charts y popups intrusivos.

---

## 4. Validación del Concepto: `Atelier Flow`

Se valida y respalda plenamente la hipótesis de Codex en [`docs/strategy-brief.md`](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/docs/strategy-brief.md):
- **Concepto rector:** **`Atelier Flow`** (Minimalismo editorial para marcas premium de producto físico).
- **Merchant Target:** Moda contemporánea, sastrería, calzado, marroquinería, joyería de autor, fragancias y objetos de diseño.
- **Presets MVP propuestos:**
  1. **Couture:** Alta moda, monocromático estricto, serif editorial refinada, fotografía de estudio espaciosa.
  2. **Studio:** Lino crudo, tonos arena y terracota suave, sans cálida; ideal para marcas de lino, cerámica de autor y joyería artesanal.
  3. **Archive:** Estética urbana/streetwear de lujo, modo oscuro carbón, micro-etiquetas monospace técnicas y alto contraste.

---

## 5. Riesgos Específicos para `Atelier Flow` y Mitigación

| Riesgo Técnico | Impacto en Theme Store | Estrategia de Mitigación |
| :--- | :--- | :--- |
| **Pines / Hotspots en Lookbooks** | Saltos de diseño (CLS) o fallos de accesibilidad táctil en móvil. | Coordenadas en porcentajes (`%`) vía CSS custom properties; botones con `aria-expanded` y etiquetas descriptivas legibles por lectores de pantalla. |
| **Fotografía Editorial Pesada** | Caída en Lighthouse móvil (< 60) por retraso en LCP. | Atributos `srcset` automatizados con `image_url`, dimensiones `width`/`height` explícitas, `loading="lazy"` estricto y solo `fetchpriority="high"` en la primera imagen del pliegue. |
| **Exceso de Motion Editorial** | Rechazo por accesibilidad o sensación de lentitud en la compra. | Animaciones sutiles vía CSS nativo aceleradas por hardware (`transform`, `opacity`); desactivación automática con `@media (prefers-reduced-motion: reduce)`. |
| **Paridad de Instalación** | Rechazo si la demo no coincide con la tienda recién instalada. | Diseñar plantillas JSON de presets con textos coherentes y placeholders elegantes (`image \| placeholder_svg_tag`). |

---

## 6. Matriz de Plantillas y Secciones Requeridas para el MVP

### Plantillas:
- Layout: `layout/theme.liquid`
- JSON Obligatorias (11): `index.json`, `product.json`, `collection.json`, `list-collections.json`, `cart.json`, `search.json`, `404.json`, `page.json`, `page.contact.json`, `blog.json`, `article.json`, `password.json`
- Liquid Especial: `templates/gift_card.liquid`
- Grupos: `sections/header-group.json`, `sections/footer-group.json`

### Secciones Core MVP:
1. `sections/header.liquid` (Navegación multinivel + `<shopify-account>` + selector de idioma/moneda).
2. `sections/footer.liquid` (Newsletter + Follow on Shop + métodos de pago + políticas).
3. `sections/main-product.liquid` (Galería responsiva + swatches de categoría + bloques `@app` + installments).
4. `sections/main-collection.liquid` (Filtros facetados nativos con Liquid `filter` + toggle de cuadrícula).
5. `sections/main-cart-drawer.liquid` (Carrito deslizable con barra de envío gratis y selling plans).
6. `sections/shoppable-lookbook.liquid` (Imagen/video con pines interactivos de compra directa).
7. `sections/split-editorial.liquid` (Manifiesto de marca + imagen de campaña + micro-producto).
8. `sections/predictive-search.liquid` (Resultados predictivos accesibles).
9. `sections/sticky-cart-bar.liquid` (Barra móvil ergonómica en zona de pulgar para PDP).

---

## 7. Recomendación de División de Roles para Fase 2

### Codex (Líder Técnico & Arquitecto):
1. Estructurar el árbol de carpetas base del tema (`layout`, `templates`, `sections`, `snippets`, `assets`, `config`, `locales`).
2. Implementar el layout principal `layout/theme.liquid` con etiquetas requeridas (`content_for_header`, `content_for_layout`, skip-link accesible).
3. Definir la arquitectura CSS de base (tokens de diseño, variables semánticas, sistema de colores y tipografía con Font Picker de Shopify, sin Sass).
4. Configurar la estrategia de scripts vanilla/Web Components para componentes interactivos.

### Gemini (Investigación, QA & Contenido):
1. Diseñar el sistema de tokens y paletas de color para los 3 presets (*Couture*, *Studio*, *Archive*) verificando contraste accesible (WCAG AA).
2. Redactar los schemas Liquid y documentación técnica de las secciones diferenciales (`shoppable-lookbook`, `sticky-cart-bar`, `main-cart-drawer`).
3. Diseñar la batería de pruebas de accesibilidad y performance (checklist de Theme Check y Lighthouse CI) para validar cada incremento de código.
