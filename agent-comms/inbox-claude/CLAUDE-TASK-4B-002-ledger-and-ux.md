# Directiva de Implementación Técnica: CLAUDE-TASK-4B-002

```text
ID: CLAUDE-TASK-4B-002
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto Líder)
Destinatario: Claude (Opus 5) — En rol de Implementador Principal de Código
Autoridad del Proyecto: Johandry / Ruiz Digital (Dueño del Proyecto)
Alcance: 
  1. Bloque A: CLAUDE-CHANGE-001 (PDP Line Total) + CLAUDE-CHANGE-002 (Grid Switcher)
  2. Bloque B: CLAUDE-AUDIT-002 COMPLETO (Controles muertos, templates y regiones vivas)
  3. Bloque C: Cierre de los 7 Requisitos Parciales de Código del Ledger Vivo
  4. Bloque D: Hallazgos Críticos de la Auditoría Senior de GPT (Custom Liquid en PDP y Onboarding en Lookbook)
Meta: 100% de cumplimiento en código del tema
Base de código: 72 archivos, 0 ofensas en Shopify Theme Check (commit c2e1153)
Regla: Cero dependencias externas. Cero ofensas en Theme Check. 100% t: en schemas.
```

---

## 1. Misión del Encargo

Johandry ha encomendado a **Claude** la ejecución técnica de todas las tareas pendientes de código del proyecto, incluyendo las propuestas de UX/conversión, la auditoría `CLAUDE-AUDIT-002`, los 7 parciales del Ledger Vivo y dos ajustes clave reportados por el auditor senior GPT.

---

## 2. Especificación Técnica por Bloques

### Bloque A: Propuestas de Conversión y UX

#### A1. Total de Línea en PDP (`CLAUDE-CHANGE-001`)
- **`sections/main-product.liquid`:**
  - En `<variant-selects>`, inyectar los atributos:
    ```liquid
    data-money-format="{{ shop.money_format | strip_html | escape }}"
    data-line-total-template="{{ 'products.product.line_total' | t: quantity: '[quantity]' | escape }}"
    ```
  - En el bloque `when 'quantity'`, inmediatamente después del input de cantidad:
    ```liquid
    <p
      class="product-form__line-total"
      data-line-total
      data-empty
      aria-live="polite"
      aria-atomic="true"
    >
      <span data-line-total-label></span>
      <s data-line-total-compare hidden>
        <span class="visually-hidden">{{ 'products.product.regular_price' | t }}</span>
        <span data-line-total-compare-value></span>
      </s>
      <span data-line-total-current></span>
    </p>
    ```
  - En el script `data-variant-json` (tanto en la variante principal como en `selling_plan_allocations`):
    ```liquid
    "price_cents": {{ variant.price | json }},
    "compare_at_price_cents": {% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | json }}{% else %}null{% endif %},
    ```
    *(y en selling_plan_allocations con `allocation.price`)*.
- **`assets/theme.js`:**
  - Agregar constante `MONEY_PATTERNS` y función `formatMoney(cents, format)` a nivel de módulo con soporte para los 7 tokens de formato monetario de Shopify.
  - En el Web Component `VariantSelects`:
    - Cachear `this.quantityInput` y `this.lineTotal` en `connectedCallback()`.
    - Escuchar eventos `input` y `change` en `quantityInput` para llamar a `this.updateLineTotal()`.
    - Implementar `updateLineTotal()`: si cantidad <= 1 o inválida, poner `data-empty` y limpiar; si > 1, calcular subtotales `unitCents * quantity` y `compareCents * quantity`, formatear con `formatMoney` y remover `data-empty`.
    - Llamar a `this.updateLineTotal()` al final de `updatePrice()`.
- **`assets/base.css`:**
  - Reglas para `.product-form__line-total`: `display: flex`, `flex-wrap: wrap`, `align-items: baseline`, `gap: var(--space-xs)`, `color: var(--color-foreground-muted)`, `font-size: 0.875rem`. `&[data-empty] { display: none; }`. Compare tachado con `opacity: 0.68`. Precio actual con `font-weight: 700; color: var(--color-foreground)`.
- **`locales/en.default.json`:**
  - Agregar `"line_total": "Total for {{ quantity }}"` bajo `products.product`.

#### A2. Selector de Densidad de Grilla Móvil/Tablet (`CLAUDE-CHANGE-002`)
- **`sections/main-collection.liquid`:**
  - Actualizar los botones de `collection-grid-switcher`:
    - Botón 1 (`data-grid-view="2"`): Icono con 2 barras (`<i></i><i></i>`), etiquetas duales `.collection-grid-switcher__label--small` (`{{ 'collections.grid.one_column' | t }}`) y `.collection-grid-switcher__label--wide` (`{{ 'collections.grid.two_columns' | t }}`).
    - Botón 2 (`data-grid-view="4"`): Icono con 4 barras (`<i></i><i></i><i></i><i></i>`), etiquetas duales `.collection-grid-switcher__label--small` (`{{ 'collections.grid.two_columns' | t }}`) y `.collection-grid-switcher__label--wide` (`{{ 'collections.grid.four_columns' | t }}`).
- **`assets/base.css`:**
  - En CSS móvil: ocultar segunda barra en icono de 2 y barras 3-4 en icono de 4 (`display: none;`). Ocultar `.collection-grid-switcher__label--wide`.
  - En `@media (min-width: 48rem)`: restaurar barras (`display: block;`), ocultar `.collection-grid-switcher__label--small`, mostrar `.collection-grid-switcher__label--wide`.
  - Grilla de 4 columnas en tablet: `.product-grid[data-grid-columns='4'] { grid-template-columns: repeat(4, minmax(0, 1fr)); }`.
  - Corregir el error de CSS `gap-inline` por `column-gap: var(--space-3)`.
  - Evitar que el tile de promoción aplaste la fila en tablet: `.product-grid[data-grid-columns='4'] .product-grid__item--promotion { grid-column: auto; }`.
- **`locales/en.default.json` & `locales/en.default.schema.json`:**
  - En `locales/en.default.json`: eliminar las claves huérfanas `view_compact` y `view_dense` en `collections.grid`.
  - En `locales/en.default.schema.json`: agregar `info` en `default_grid_columns`: `"Sets the desktop default. On phones the two options render one and two products per row."`.

---

### Bloque B: Eliminación de Controles Muertos (`CLAUDE-AUDIT-002`)

#### B1. `sections/hero-editorial.liquid`
- Reemplazar la condición de botones para validar que existan etiqueta Y destino (cero fallback a `/`):
  ```liquid
  {%- liquid
    assign has_primary_button = false
    assign has_secondary_button = false
    if section.settings.button_primary_label != blank and section.settings.button_primary_url != blank
      assign has_primary_button = true
    endif
    if section.settings.button_secondary_label != blank and section.settings.button_secondary_url != blank
      assign has_secondary_button = true
    endif
  -%}
  {%- if has_primary_button or has_secondary_button -%}
    <div class="hero-editorial__actions">
      {%- if has_primary_button -%}
        <a class="button hero-editorial__button" href="{{ section.settings.button_primary_url | escape }}">
          <span>{{ section.settings.button_primary_label | escape }}</span>
          {% render 'icon', name: 'arrow', size: 18 %}
        </a>
      {%- endif -%}
      {%- if has_secondary_button -%}
        <a class="button button--secondary hero-editorial__button" href="{{ section.settings.button_secondary_url | escape }}">
          <span>{{ section.settings.button_secondary_label | escape }}</span>
          {% render 'icon', name: 'arrow', size: 18 %}
        </a>
      {%- endif -%}
    </div>
  {%- endif -%}
  ```

#### B2. `sections/brand-manifesto.liquid`
- Reemplazar líneas 34-42 para validar etiqueta Y URL, y escapar la URL:
  ```liquid
  {%- if section.settings.button_label != blank and section.settings.button_url != blank -%}
    <a
      class="button button--secondary brand-manifesto__button"
      href="{{ section.settings.button_url | escape }}"
    >
      <span>{{ section.settings.button_label | escape }}</span>
      {% render 'icon', name: 'arrow', size: 18 %}
    </a>
  {%- endif -%}
  ```

#### B3. `templates/index.json`
- Limpiar URLs fantasmas:
  - En `hero_editorial`: remover `"button_secondary_url": "/"` y no definir `button_secondary_label` si no hay URL.
  - En `brand_manifesto`: remover `"button_url": "/"`.
  - En `bento_discovery.blocks.bento_editorial`: remover `"link": "/"`.
  - En `curated_showcase`: dejar un solo bloque de pestaña apuntando a `"collection": "all"` en el template de fábrica para que no existan pestañas vacías.

#### B4. `sections/main-collection.liquid` (Cierre P1-22)
- En el contenedor del switcher de grilla, agregar la clase `js-only`:
  ```liquid
  <div class="collection-grid-switcher js-only" ...>
  ```

#### B5. Región Viva Persistente para Conteo de Resultados (`sections/main-collection.liquid` & `assets/theme.js`)
- En `sections/main-collection.liquid`:
  - Retirar `aria-live="polite"` del elemento `<p class="collection-products__count">` dentro de `<facet-filters-form>`.
  - Colocar inmediatamente antes de `<facet-filters-form>` un contenedor persistente accesible fuera del árbol reemplazado:
    ```liquid
    <div class="visually-hidden" aria-live="polite" aria-atomic="true" data-facet-live-region></div>
    ```
- En `assets/theme.js` (en `FacetFiltersForm`):
  - Tras ejecutar `this.innerHTML = nextElement.innerHTML;`, copiar el texto del conteo de resultados a la región viva persistente:
    ```javascript
    const countEl = this.querySelector('.collection-products__count');
    const liveRegion = this.parentElement?.querySelector('[data-facet-live-region]');
    if (countEl && liveRegion) {
      liveRegion.textContent = countEl.textContent;
    }
    ```

---

### Bloque C: Cierre de los 7 Requisitos Parciales del Ledger Vivo

#### C1. Punto Focal Nativo (Row 35) & Dimensiones Explícitas para CLS (Row 37)
- **`sections/hero-editorial.liquid`:**
  - En `<picture>` móvil (para `video_poster` y `hero_image`):
    En `<source media="(max-width: 47.99rem)" ...>` agregar:
    ```liquid
    width="{{ section.settings.image_mobile.width }}"
    height="{{ section.settings.image_mobile.height }}"
    ```
  - En `.hero-editorial__media`:
    Inyectar la variable de punto focal:
    ```liquid
    style="--hero-focal-point: {{ hero_image.presentation.focal_point | default: 'center' }};"
    ```
- **`assets/base.css`:**
  - En `.hero-editorial__image`:
    ```css
    .hero-editorial__image {
      object-fit: cover;
      object-position: var(--hero-focal-point, center);
    }
    ```

#### C2. Navegación por Teclado e Indicador de Foco (Row 48)
- **`assets/base.css`:**
  - Línea ~386:
    ```css
    .site-main:focus:not(:focus-visible) {
      outline: 0;
    }
    ```
  - En `.curated-showcase__tab:focus-visible`:
    ```css
    outline-offset: -2px;
    ```

#### C3. Áreas Táctiles Mínimas >= 44x44px (Row 50)
- **`assets/base.css`:**
  - Línea ~3341 (`.desktop-nav__submenu a, .desktop-nav__grandchildren a`):
    Actualizar `min-height: 36px;` a:
    ```css
    min-height: var(--tap-target-min, 44px);
    ```
  - En `.gift-card-recipient__toggle`:
    ```css
    .gift-card-recipient__toggle {
      display: inline-flex;
      min-height: var(--tap-target-min, 44px);
      align-items: center;
      font-weight: 700;
    }
    ```

#### C4. Jerarquía Estricta de Encabezados (Row 51)
- **`sections/hero-editorial.liquid`:**
  - Línea ~5:
    ```liquid
    assign default_heading_tag = 'h1'
    if template.name != 'index'
      assign default_heading_tag = 'h2'
    endif
    assign heading_tag = section.settings.heading_tag | default: default_heading_tag
    ```
- **`sections/main-404.liquid`:**
  - Línea ~36:
    ```liquid
    <h2 id="NotFoundRecommendations-{{ section.id }}" class="main-404__recommendations-heading">{{ 'not_found.recommendations' | t }}</h2>
    ```
- **`assets/base.css`:**
  - Regla para `.main-404__recommendations-heading`:
    ```css
    .main-404__recommendations-heading {
      font-size: 1.125rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-block-end: var(--space-md);
    }
    ```

#### C5. Precios Comparativos y Descuentos con `price_varies` (Row 67)
- **`snippets/price.liquid`:**
  - Lógica de oferta:
    ```liquid
    if target_is_product and product.compare_at_price_max > product.price
      assign on_sale = true
      assign compare_price = product.compare_at_price_max
    endif
    ```
  - En `price__values`, bajo `{%- if price_varies -%}`:
    ```liquid
    {%- if price_varies -%}
      <span>{{ 'products.product.price_from' | t }}</span>
      <span data-current-price>{{ current_price | money }}</span>
      {%- if on_sale and compare_price > current_price -%}
        <span class="visually-hidden">{{ 'products.product.regular_price' | t }}</span>
        <s class="price__compare" data-compare-price>{{ compare_price | money }}</s>
      {%- endif -%}
    ```

#### C6. Selector de Ordenamiento en Búsqueda sin Filtros (Row 76)
- **`sections/main-search.liquid`:**
  - Renderizar `SearchSortBy` siempre que `search.performed and search.results_count > 0`:
    ```liquid
    {%- if search.performed and search.results_count > 0 -%}
      <div class="main-search__sort-bar">
        <div class="facets__sort">
          <label for="SearchSortBy-{{ section.id }}">{{ 'collections.filters.sort_by' | t }}</label>
          <select id="SearchSortBy-{{ section.id }}" name="sort_by" data-facet-sort>
            {%- for option in search.sort_options -%}
              <option value="{{ option.value }}"{% if option.value == sort_by %} selected{% endif %}>
                {{- option.name | escape -}}
              </option>
            {%- endfor -%}
          </select>
        </div>
      </div>
    {%- endif -%}
    ```

---

### Bloque D: Hallazgos Críticos de la Auditoría GPT

#### D1. Bloque `custom_liquid` en `sections/main-product.liquid`
- **Render:** En el bloque `case block.type` (alrededor de línea 490):
  ```liquid
  {%- when 'custom_liquid' -%}
    <div class="product-main__custom-liquid" {{ block.shopify_attributes }}>
      {{- block.settings.custom_liquid -}}
    </div>
  ```
- **Schema:** En la lista de bloques permitidos del schema de `main-product.liquid`, agregar:
  ```json
  {
    "type": "custom_liquid",
    "name": "t:sections.main_product.blocks.custom_liquid.name",
    "settings": [
      {
        "type": "liquid",
        "id": "custom_liquid",
        "label": "t:sections.main_product.blocks.custom_liquid.settings.custom_liquid.label"
      }
    ]
  }
  ```
- **Locales:** Agregar las claves en `locales/en.default.schema.json` bajo `sections.main_product.blocks.custom_liquid`.

#### D2. Onboarding Placeholders en Hotspots de `sections/lookbook.liquid`
- En `sections/lookbook.liquid:69`:
  Cuando `hotspot_product == blank`:
  En lugar de descartar con `{% continue %}` (lo que deja el lookbook vacío en tiendas recién instaladas), renderizar un hotspot de bienvenida (onboarding):
  - Título fallback: `{{ 'onboarding.product_title' | t | default: 'Featured Item' }}`
  - Precio fallback: `{{ 18000 | money }}`
  - Popover renderiza un `placeholder_svg_tag: 'product-1'` en lugar de quedar en blanco.

---

## 3. Criterios de Aceptación y Validación

1. **JavaScript:** `node --check assets/theme.js` -> 0 errores.
2. **Shopify Theme Check:** `npx shopify theme check` -> 0 ofensas sobre los 72 archivos.
3. **JSON estricto:** `templates/index.json`, `locales/en.default.json`, `locales/en.default.schema.json` válidos.
4. **Reporte:** Entregar en `agent-comms/outbox-claude/CLAUDE-IMPL-4B-002-ledger-and-ux.md`.
