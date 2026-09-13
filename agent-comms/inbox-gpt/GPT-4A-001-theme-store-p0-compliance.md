# Directiva de Implementación: GPT-4A-001 (Resolución de P0 Theme Store Compliance & Seguridad)

```text
ID: GPT-4A-001
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 4A (Sprint 1: Cumplimiento de P0 Mandatorios de Shopify Theme Store)
Fecha: 2026-09-13
Autoridad: Autorizado por Johandry (Dueño del Proyecto) y Gemini Flash 3.8 High
```

---

## 1. Visión y Propósito

Tras la exhaustiva auditoría independiente `CLAUDE-AUDIT-001`, se detectaron requisitos comerciales mandatorios de Shopify que el compilador sintáctico `theme check` no audita, pero que causan **rechazo automático en la Theme Store**. 

Este sprint (**GPT-4A-001**) implementa con rigor absoluto los requisitos P0 obligatorios, la sanitización de atributos y el endurecimiento de accesibilidad antes de abordar los refinamientos de layout visual.

---

## 2. Archivos Permitidos y Alcance

### Archivos Permitidos:
- `sections/header.liquid` (Búsqueda predictiva y selectores de país/idioma).
- `sections/footer.liquid` (Newsletter storefront, selectores de país/idioma y métodos de pago `shop.enabled_payment_types`).
- `sections/newsletter.liquid` (NUEVO: Sección modular de newsletter para cualquier plantilla).
- `snippets/predictive-search.liquid` (NUEVO: Scaffolding y modal/drawer de búsqueda predictiva).
- `snippets/localization-selectors.liquid` (NUEVO: Formularios accesibles de país/moneda e idioma).
- `snippets/social-meta-tags.liquid` (NUEVO: Open Graph y Twitter Cards completos).
- `snippets/product-media.liquid` / `sections/main-product.liquid` (Carga condicional de scripts 3D `model-viewer-ui` y `shopify-xr`).
- `sections/main-collection.liquid` y `sections/main-search.liquid` (Fix de comas decimales en filtros de precio + `step="any"` + escapado de `value.value`).
- `sections/cart-drawer.liquid` y `sections/main-cart-items.liquid` (Escapado de `aria-label` en remover ítem + ajuste multimoneda en umbral de envío).
- `layout/theme.liquid` (Render de `social-meta-tags` y soporte de assets 3D).
- `config/settings_schema.json` (`theme_info`: autor "Ruiz Digital", URLs comerciales de soporte/docs, y tema alineado con presets).
- `assets/base.css` (Estilos de predictiva, localización, newsletter, ajustes de contraste en `aria-busy` y bordes de inputs).
- `assets/theme.js` (Web Components `<predictive-search>` y `<localization-form>` sobre `ThemeElement`).
- `locales/en.default.json` (Claves de traducción para predictiva, localización, newsletter y accesibilidad).
- `agent-comms/outbox-gpt/GPT-4A-001-theme-store-p0-compliance.md` (Informe de entrega).

### Archivos Excluidos:
- Resto de secciones y plantillas (`hero-editorial`, `bento-discovery`, `templates/*.json`, etc. se abordan en el siguiente sprint de producto).

---

## 3. Especificaciones Técnicas Detalladas

### 1. Selectores de País/Moneda e Idioma (`snippets/localization-selectors.liquid`)
- Usar `{%- form 'localization', id: form_id -%}` oficial de Shopify.
- Si `localization.available_countries.size > 1`, renderizar selector de país y moneda (`localization.country.name` + `localization.country.currency.iso_code` + `localization.country.currency.symbol`).
- Si `localization.available_languages.size > 1`, renderizar selector de idioma (`language.endonym_name`).
- Web Component `<localization-form>` que somete el formulario al cambiar o botón submit nativo en `.no-js`.
- Integrarlo en el `footer.liquid` (versión principal) y en el menú de navegación móvil del `header.liquid`.
- **Ajuste de Recompensas en Carrito:** En `cart-drawer.liquid`, asegurar que el cálculo de `free_shipping_threshold` no cause absurdos en monedas como JPY (usar conversión por `localization.country.currency.rate` si está disponible o manejar la comparación proporcional a la divisa activa).

### 2. Búsqueda Predictiva Accesible (`<predictive-search>`)
- Web Component `<predictive-search>` que consume `routes.predictive_search_url` (`/search/suggest?q=...&resources[type]=product,collection,page,article&section_id=predictive-search`).
- Input accesible con atributos WAI-ARIA combobox: `role="combobox"`, `aria-expanded="false"`, `aria-haspopup="listbox"`, `aria-autocomplete="list"`, `aria-controls="predictive-search-results"`.
- Despliega resultados en vivo: miniatura de producto, título, precio comparativo, estado agotado y botón "Ver todos los resultados para [q]".
- Si no hay resultados, muestra estado accesible `predictive_search.no_results`.
- En `.no-js`, el input actúa como formulario nativo que navega a `routes.search_url`.

### 3. Formulario de Newsletter en Storefront
- En `sections/footer.liquid` y en la nueva sección modular `sections/newsletter.liquid`:
  - Usar `{%- form 'customer', class: 'newsletter-form' -%}`.
  - Inputs requeridos: `<input type="hidden" name="contact[tags]" value="newsletter">` e `<input type="email" name="contact[email]" required>`.
  - Manejo de éxito con `form.posted_successfully?` y de errores con `form.errors`.
  - Iconos de métodos de pago en el footer: renderizar `shop.enabled_payment_types` con `{{ type | payment_type_svg_tag }}` (requisito clave de confianza).

### 4. Metadatos de `theme_info` (`config/settings_schema.json`)
- Actualizar el bloque `theme_info`:
  - `theme_author`: `"Ruiz Digital"`.
  - `theme_name`: `"Atelier Flow"`.
  - `theme_documentation_url`: `"https://ruizdigital.com/themes/atelier-flow/docs"`.
  - `theme_support_url`: `"https://ruizdigital.com/themes/atelier-flow/support"`.
- En `config/settings_data.json`: Asegurar que el preset principal se llame `"Atelier Flow"` (para cumplir con la regla estricta de Shopify: *One preset must share the parent theme's name*).

### 5. Carga Condicional de Media 3D y Realidad Aumentada (AR)
- Si `product.media` contiene modelos 3D (`media.media_type == 'model'`):
  - Cargar condicionalmente `{{ 'shopify-xr.js' | shopify_asset_url | script_tag }}` y el CSS/JS necesario para que `<model-viewer>` rote y active el botón AR de Shopify.

### 6. Metadatos Completos Open Graph y Twitter (`snippets/social-meta-tags.liquid`)
- Renderizar en `<head>` de `layout/theme.liquid`:
  - `og:site_name`, `og:url`, `og:title`, `og:type` (`product`, `article` o `website`), `og:description`.
  - `og:image`, `og:image:secure_url`, `og:image:width`, `og:image:height`.
  - `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

### 7. Corrección de Filtros de Precio y Sanitización HTML
- En `main-collection.liquid` y `main-search.liquid`:
  - Manejar correctamente monedas con coma decimal (`amount_with_comma_separator`) para no truncar los valores de `filter.min_value.value` y `filter.range_max`.
  - Añadir `step="any"` a los inputs `type="number"` de precios para evitar validaciones fallidas nativas en el navegador.
  - Escapar atributos: `value="{{ value.value | escape }}"`, `href="{{ block.settings.link_url | escape }}"`.
  - En `cart-drawer.liquid` y `main-cart-items.liquid`: Escapar `aria-label="{{ 'sections.cart.remove_item' | t: title: item.title | escape }}"`.

### 8. Endurecimiento de Accesibilidad y Contraste
- En `assets/base.css`:
  - Botones con `aria-busy="true"`: Ajustar opacidad para que el texto conserve siempre un ratio $\ge 4.5:1$ contra el fondo del botón.
  - Ajustar `--color-border` en controles de formulario para cumplir con WCAG 1.4.11 ($\ge 3:1$ de contraste contra la superficie).
  - Asegurar que `.complete-the-look__item:not([data-selected])` mantenga legibilidad de texto y precio sin caer a 3.84:1.

---

## 4. Criterios de Aceptación y Validación

1. `node --check assets/theme.js` retorna código `0`.
2. `npx shopify theme check` reporta **0 ofensas**.
3. Validación de todos los JSON (`settings_schema.json`, `settings_data.json`, `locales/en.default.json`).
4. Navegación por teclado accesible con Escape y Focus Traps en la búsqueda predictiva y selectores de idioma.
5. Informe completo de entrega en: `agent-comms/outbox-gpt/GPT-4A-001-theme-store-p0-compliance.md`.
6. **No realizar commit ni push.**
