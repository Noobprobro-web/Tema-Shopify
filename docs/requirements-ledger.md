# Requirements Ledger: Shopify Theme Store (Living Audit)

```text
CONTEO VIVO: 36 / 45 CUMPLIDOS (26 COMPLETOS + 10 CÓDIGO VERIFICADO)
Desglose actual: 36 Cumplido | 4 Parcial | 0 Ausente | 5 No Verificado
Última sincronización: 2026-09-13 (Evidencia local GPT-4B-001; pendiente dictamen Gemini)
Fuente oficial: https://shopify.dev/docs/storefronts/themes/store/requirements
Regla de oro: "Theme Check pasa" NO es evidencia. Solo referencias de código o pruebas en tienda real.
```

---

## 1. Arquitectura y Estructura Online Store 2.0

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Código Base 100% Original** | Shopify Theme Store Specs | `cumplido` | Repositorio limpio desde starter vacío. Cero dependencias de Dawn/Horizon. Tokens y arquitectura propietarios. | GPT / Gemini | Phase 1-2 |
| **12 Plantillas JSON OS 2.0** | Official Requirements: Templates | `cumplido` | `templates/*.json` (12 plantillas válidas, 0 placeholders). `GEMINI-012`. | GPT | Sprint 3B.4 |
| **Plantilla Líquida Gift Card** | Official Requirements: Templates | `cumplido` | `templates/gift_card.liquid:1-105` con Apple Wallet y código QR nativo. | GPT | Sprint 2A |
| **Section Groups en Header y Footer** | Official Requirements: Sections | `cumplido` | `sections/header-group.json` y `sections/footer-group.json`. | GPT | Sprint 2A |
| **Bloques de Aplicación (`@app`)** | Official Requirements: App Integration | `cumplido` | `sections/main-product.liquid` y `sections/featured-product.liquid` declaran y renderizan `@app`; producto destacado también ofrece bloque Custom Liquid localizado. Theme Check: 72 archivos, 0 ofensas. | GPT | Sprint 4B |
| **Schemas Válidos y Settings (100% t: Localizados)** | Official Requirements: Settings | `cumplido` | 26 bloques `{% schema %}` y `settings_schema.json` 100% traducidos con claves `t:` (cero strings literales, Gate 4 de DoD satisfecha). `GEMINI-013`. | Gemini / GPT | Phase 4 |
| **Exclusión de `config/markets.json`** | Official Requirements: Packaging | `cumplido` | Archivo ausente en el repositorio (verificado con find_by_name). | Gemini | Phase 2A |

---

## 2. Performance y Core Web Vitals (CWV)

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lighthouse Performance >= 60 Móvil** | Official Requirements: Performance | `no verificado` | Pendiente de medición en tienda de desarrollo real con catálogo completo. | Gemini | Phase 4 QA |
| **JavaScript Modular Vanilla (Zero Libs)** | Official Requirements: Performance | `cumplido` | `assets/theme.js:1-2408` (Web Components puros sobre `ThemeElement`). Cero frameworks externos. | GPT | Sprint 2A-3B |
| **Cero CSS/SCSS Obsoleto y No Minificado** | Official Requirements: Performance | `cumplido` | `assets/base.css:1-5315` estructurado y legible. Cero archivos `.scss` o `.scss.liquid`. | GPT | Sprint 2A-3B |
| **Imágenes Responsivas (`srcset`, `sizes`)** | Official Requirements: Media | `cumplido` | `snippets/responsive-image.liquid:1-42` usando `image_tag` adaptativo por contexto. | GPT | Sprint 2B |
| **Punto Focal Nativo (`focal_point`)** | Acceptance Matrix / Official Specs | `parcial` | `snippets/responsive-image.liquid:30` lo lee, pero `hero-editorial.liquid` no lo aprovecha en su layout. | GPT | Sprint 3B.2 |
| **Optimización LCP (`fetchpriority="high"`)** | Official Requirements: Performance | `cumplido` | `snippets/responsive-image.liquid:11` y `sections/hero-editorial.liquid:37` (`prioritize: true`). | GPT | Sprint 3B.2 |
| **Dimensiones Explícitas (CLS < 0.1)** | Official Requirements: Performance | `parcial` | `snippets/responsive-image.liquid:27` emite width/height, pero `<source>` móvil en `hero-editorial.liquid:35-45` no los declara. | GPT | Sprint 3B.2 |

---

## 3. Accesibilidad (WCAG 2.2 AA)

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lighthouse Accesibilidad >= 90** | Official Requirements: Accessibility | `no verificado` | Pendiente de auditoría axe-core/Lighthouse en tienda conectada. | Gemini | Phase 4 QA |
| **Contraste de Texto >= 4.5:1** | WCAG 2.2 AA (1.4.3) | `cumplido (código)` | Base cumple (`#1c1917` sobre `#faf8f5`). Corregido `.button[aria-busy]` a opacidad 1 (`base.css:5215`, ratio 4.5:1+) y texto unselected en complete-the-look (`base.css:3447`, ratios 6.49:1 y 8.60:1). `GPT-4A-001`. | GPT | Sprint 4A |
| **Contraste de Interfaz No-Texto >= 3:1** | WCAG 2.2 AA (1.4.11) | `cumplido (código)` | `--color-control-border` introducido (`base.css:5224-5250`) con ratios 4.39:1 (Couture claro) y 6.35:1 (Couture oscuro) en inputs, chips y selectors. `GPT-4A-001`. | GPT | Sprint 4A |
| **Navegación por Teclado e Indicador de Foco** | WCAG 2.2 AA (2.4.7) | `parcial` | `:focus-visible` definido en `base.css:239`, pero anulado en `base.css:384` (`.site-main:focus { outline: 0 }`) y recortado en tabs (`base.css:2102`). | GPT | Sprint 2A |
| **Focus Trap y Gestión en Modales/Drawers** | WCAG 2.2 AA (2.4.3) | `cumplido` | `sections/cart-drawer.liquid`, `assets/theme.js:1010-1080` y `assets/theme.js:2780-2810` (inert, focus trap, escape, restore focus en búsqueda predictiva). | GPT | Sprint 4A |
| **Áreas Táctiles Mínimas (>= 44x44 px)** | WCAG 2.2 AA (2.5.8) | `parcial` | 45+ reglas usan `--tap-target-min: 44px`. Newsletter y búsqueda usan 52px en acciones primarias (`base.css:5270, 5380`). Pendiente ajuste de submenu desktop (36px). | GPT | Sprint 4A |
| **Jerarquía Estricta de Encabezados (h1 único)** | WCAG 2.2 AA (1.3.1) | `parcial` | `hero-editorial.liquid:22` emite `<h1>` sin restricción a `index`, y `main-404.liquid:36` usa `<h2 class="eyebrow">` visualmente idéntico a label. | GPT | Sprint 3B.2 |
| **Labels Asociados en Formularios** | WCAG 2.2 AA (3.3.2) | `cumplido` | `sections/main-contact.liquid:38-75`, `snippets/gift-card-recipient.liquid:50-80`, `snippets/predictive-search.liquid:30-60` con `<label for="...">`. | GPT | Sprint 4A |
| **Live Regions (`aria-live`)** | WCAG 2.2 AA (4.1.3) | `cumplido` | `sections/cart-drawer.liquid:17`, `sections/main-product.liquid:52`, `snippets/pickup-availability.liquid:31`, `snippets/predictive-search.liquid:83`. | GPT | Sprint 4A |
| **Skip to Content Link** | WCAG 2.2 AA (2.4.1) | `cumplido` | `layout/theme.liquid:34-37` (`#MainContent`), `assets/base.css:380-388`. | GPT | Sprint 2A |
| **Soporte de `prefers-reduced-motion`** | WCAG 2.2 AA (2.3.3) | `cumplido` | `assets/base.css:5225-5245` (animaciones en `no-preference`, lista estática para marquee). | GPT | Sprint 3B.2 |

---

## 4. Funcionalidades Comerciales Obligatorias (Storefront)

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Checkout Acelerado (`additional_checkout_buttons`)** | Official Requirements: Cart & PDP | `cumplido` | `sections/main-product.liquid:178`, `sections/cart-drawer.liquid:262`. | GPT | Sprint 2B |
| **Shop Pay Installments (`form \| payment_terms`)** | Official Requirements: PDP | `cumplido` | `sections/main-product.liquid:174` dentro del formulario de producto nativo. | GPT | Sprint 3B.5 |
| **Precio Unitario (UE Legal)** | Official Requirements: Pricing | `cumplido` | `snippets/price.liquid:30-43` (`variant.unit_price_measurement`). | GPT | Sprint 2B |
| **Selector de Variantes y Swatches Nativos** | Official Requirements: Product | `cumplido` | `sections/main-product.liquid:102-127` soportando `swatch.image` y `swatch.color`. | GPT | Sprint 3B.5 |
| **Precios Comparativos y Descuentos** | Official Requirements: Pricing | `parcial` | `snippets/price.liquid:15-28`, pero cuando `price_varies` no muestra comparativo ni badge de oferta. | GPT | Sprint 2B |
| **Planes de Venta / Suscripciones** | Official Requirements: Subscriptions | `cumplido` | `sections/main-product.liquid:129-166` (soporte variante y producto, fallback no-js). | GPT | Sprint 3B.5 |
| **Disponibilidad de Retiro Local (Pickup)** | Official Requirements: Pickup | `cumplido` | `snippets/pickup-availability.liquid:1-136` y Web Component reactivo en `assets/theme.js:2150`. | GPT | Sprint 3B.5 |
| **Destinatario de Gift Cards** | Official Requirements: Gift Cards | `cumplido` | `snippets/gift-card-recipient.liquid:1-149` con campos nativos validados por Shopify. | GPT | Sprint 3B.5 |
| **Recomendaciones Nativas de Producto** | Official Requirements: Recommendations | `cumplido` | `sections/product-recommendations.liquid:1-129` consumiendo `routes.product_recommendations_url`. | GPT | Sprint 3B.5 |
| **Medios Enriquecidos y Modelos 3D** | Official Requirements: Media | `cumplido (código)` | `snippets/product-media.liquid:1-40`, `layout/theme.liquid:122` (`shopify-xr.js`), CSS responsive de `.product-gallery__view-in-space` en `assets/base.css:5490-5510`. Pendiente test AR en móvil real. | GPT-4A | Sprint 4A |
| **Follow on Shop** | Official Requirements: Shop App | `cumplido` | `sections/footer.liquid:57` (`shop \| login_button: action: 'follow'`). | GPT | Sprint 2A |
| **Cuentas de Cliente Modernas (`<shopify-account>`)** | Official Requirements: Accounts (Jul 2026) | `cumplido` | `sections/header.liquid:157`. Cero plantillas customers/* deprecadas. | GPT | Sprint 2A |
| **Filtros Facetados Nativos en Colección y Búsqueda** | Official Requirements: Filters | `cumplido (código)` | `sections/main-collection.liquid:104-118` y `sections/main-search.liquid:135-149` con normalización de coma decimal europea, espacios, miles y apóstrofes. `GPT-4A-001`. | GPT | Sprint 4A |
| **Ordenamiento (Sorting) en Colección y Búsqueda** | Official Requirements: Filters | `parcial` | `sections/main-collection.liquid:138` funciona, pero en `main-search.liquid:80` se pierde si no hay filtros activos. | GPT | Sprint 3B.4 |
| **Búsqueda Predictiva (`/search/suggest`)** | Official Requirements: Search | `cumplido (código)` | Web Component `<predictive-search>` en `assets/theme.js:2415-2820`, snippet `snippets/predictive-search.liquid:1-125`, CSS en `assets/base.css:5335-5490`. Debounce, listbox WAI-ARIA, 4 tipos de entidad. Pendiente tienda real. | GPT-4A | Sprint 4A |
| **Selector de País / Moneda (`form 'localization'`)** | Official Requirements: Markets | `cumplido (código)` | `<localization-form>` en `assets/theme.js:2390-2410`, `snippets/localization-selectors.liquid`, CSS en `assets/base.css:5224-5250`. Auto-submit en `change`, fallback sin JS. | GPT-4A | Sprint 4A |
| **Selector de Idioma (`form 'localization'`)** | Official Requirements: Markets | `cumplido (código)` | `<localization-form>` en `assets/theme.js:2390-2410`, `snippets/localization-selectors.liquid`, CSS en `assets/base.css:5224-5250`. Auto-submit en `change`, fallback sin JS. | GPT-4A | Sprint 4A |
| **Formulario de Newsletter en Storefront** | Official Requirements: Customer Engagement | `cumplido (código)` | `sections/newsletter.liquid:1-95`, `sections/footer.liquid:12-32`, layout responsive y targets en `assets/base.css:5255-5330`. | GPT-4A | Sprint 4A |
| **Iconos de Métodos de Pago en Footer** | Official Requirements: Trust & Footer | `cumplido (código)` | `sections/footer.liquid:66-73` (`payment_type_svg_tag`), layout flex y dimensiones mínimas en `assets/base.css:5280-5305`. | GPT-4A | Sprint 4A |

---

## 5. SEO, Metadatos y Datos Estructurados

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Datos Estructurados JSON-LD** | Official Requirements: SEO | `cumplido` | `snippets/structured-data.liquid:1-62` (Organization, Breadcrumbs y Product nativo). | GPT | Sprint 3B.5 |
| **Metadatos Open Graph Completos** | Official Requirements: SEO / Social | `cumplido` | `snippets/social-meta-tags.liquid:1-35` (og:title, og:type, og:url, og:image, og:description) renderizado en `layout/theme.liquid:24`. | GPT-4A / Gemini | Sprint 4A |
| **Metadatos Twitter Cards** | Official Requirements: SEO / Social | `cumplido` | `snippets/social-meta-tags.liquid:37-48` (twitter:card, twitter:title, twitter:description, twitter:image). | GPT-4A / Gemini | Sprint 4A |
| **URLs Canónicas y Títulos Únicos** | Official Requirements: SEO | `cumplido` | `layout/theme.liquid:11-22` (`canonical_url`, `page_title`, `page_description`). | GPT | Sprint 2A |

---

## 6. Presets, Empaquetado y Soporte Comercial

| Requisito | Fuente | Estado | Evidencia | Dueño | Sprint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Alineación de Nombre: Tema vs Preset** | Official Requirements: Naming | `cumplido` | `config/settings_schema.json:4` (`theme_name: "Couture"`) coincide con `config/settings_data.json:42` (`presets.Couture`). Decisión Johandry D1. | Johandry / Gemini | Phase 4 |
| **Validación de Nombre contra Reglamento y Marcas** | Official Requirements: Naming | `no verificado` | Pendiente verificar colisiones de marca en clases 25/42 y directorio oficial de la Theme Store. | Johandry | Phase 4 |
| **Presets Diferenciados (1 a 4)** | Official Requirements: Presets | `cumplido (código)` | `config/settings_data.json` contiene Couture, Studio y Archive con cinco esquemas cada uno; `/listings/<preset>/templates/` incluye nueve overrides diferenciados. `Couture-1.0.0.zip` empaquetado con `/listings/`. Pendiente smoke test de instalación en las tres demos. | Claude / GPT | Sprint 4B |
| **`theme_info` Comercial y Soporte Real** | Official Requirements: Support & Info | `parcial` | URLs declaradas en `config/settings_schema.json:3-9`. Páginas destino de soporte y docs pendientes de publicar en ruizdigital.com, Hito 4.6. | Johandry | Phase 4 |
| **3 Tiendas Demo Auténticas (Sin Lorem Ipsum)** | Official Requirements: Demos | `no verificado` | Pendiente de producción de catálogo, copy y assets con derechos para las 3 demos. | Johandry / Claude | Phase 4 |
