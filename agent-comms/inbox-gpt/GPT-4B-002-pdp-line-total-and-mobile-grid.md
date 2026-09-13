# Directiva de Implementación: GPT-4B-002 (Total de Línea en PDP y Selector de Grilla Móvil)

```text
ID: GPT-4B-002
Emisor: Gemini Flash 3.8 High (Cerebro y Arquitecto)
Destinatario: GPT-5.6 Sol Max / Codex (Implementador Técnico)
Autoridad del Proyecto: Johandry / Ruiz Digital
Fuente técnica: Propuestas auditadas CLAUDE-CHANGE-001 y CLAUDE-CHANGE-002
Base de código: commit con GPT-4B-001 aceptado (72 archivos, 0 ofensas en Theme Check)
Entrega esperada: código implementado + validaciones estáticas + reporte en agent-comms/outbox-gpt/
NO hacer commit ni push hasta la auditoría de Gemini.
```

---

## 1. Contexto y Objetivos

El usuario Johandry ha probado la tienda en vivo y ha ordenado implementar dos mejoras esenciales de conversión y UX reportadas por Claude:

1. **Total de línea en la PDP (`CLAUDE-CHANGE-001`):**
   Al seleccionar cantidad > 1, mostrar el subtotal de esa línea con comparación de ahorro si el producto está en oferta, sin mutar el precio unitario principal (lo cual protege las leyes de precio unitario de la UE, cuotas de Shop Pay Installments y precios comparativos).
2. **Selector de densidad de grilla en móvil y tablet (`CLAUDE-CHANGE-002`):**
   En teléfonos móviles, los botones del switcher deben mostrar 1 y 2 barras (con etiquetas accesibles *"Show one product per row"* y *"Show two products per row"*), porque la pantalla solo da para 1 y 2 columnas. En tablet y escritorio deben mostrar 2 y 4 barras (*"Show two products per row"* y *"Show four products per row"*). Tablet en modo denso pasa de 3 a 4 columnas (físicamente 170px por tarjeta, igual que los 161.5px de 2 columnas en móvil). Se corrige el error de CSS `gap-inline` por `column-gap`.

---

## 2. Especificación Técnica

### Tarea A: Total de Línea en PDP (`sections/main-product.liquid`, `assets/theme.js`, `assets/base.css`, `locales/en.default.json`)

#### 1. `sections/main-product.liquid`
- En el elemento `<variant-selects>`:
  Agregar atributos:
  ```liquid
  data-money-format="{{ shop.money_format | strip_html | escape }}"
  data-line-total-template="{{ 'products.product.line_total' | t: quantity: '[quantity]' | escape }}"
  ```
- En el bloque `when 'quantity'`:
  Inmediatamente después del `<input data-quantity-input>`, agregar la región viva accesible:
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
- En `data-variant-json` (tanto a nivel de variante como dentro de `selling_plan_allocations`):
  Agregar `price_cents` y `compare_at_price_cents`:
  ```liquid
  "price_cents": {{ variant.price | json }},
  "compare_at_price_cents": {% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | json }}{% else %}null{% endif %},
  ```
  *(Igual en las asignaciones de planes de suscripción para usar `allocation.price | json`)*.

#### 2. `assets/theme.js`
- Agregar la tabla y función utilitaria de formateo de moneda a nivel de módulo:
  ```javascript
  const MONEY_PATTERNS = {
    amount: { decimals: 2, thousands: ',', decimal: '.' },
    amount_no_decimals: { decimals: 0, thousands: ',', decimal: '.' },
    amount_with_comma_separator: { decimals: 2, thousands: '.', decimal: ',' },
    amount_no_decimals_with_comma_separator: { decimals: 0, thousands: '.', decimal: ',' },
    amount_with_apostrophe_separator: { decimals: 2, thousands: "'", decimal: '.' },
    amount_with_space_separator: { decimals: 2, thousands: ' ', decimal: ',' },
    amount_no_decimals_with_space_separator: { decimals: 0, thousands: ' ', decimal: '.' },
  };

  function formatMoney(cents, format) {
    if (!format) return '';
    const amount = Number(cents);
    if (!Number.isFinite(amount)) return '';

    return format.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) => {
      const pattern = MONEY_PATTERNS[name] || MONEY_PATTERNS.amount;
      const fixed = (amount / 100).toFixed(pattern.decimals);
      const [whole, fraction] = fixed.split('.');
      const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, pattern.thousands);
      return fraction ? `${grouped}${pattern.decimal}${fraction}` : grouped;
    });
  }
  ```
- En `VariantSelects`:
  - En `connectedCallback()`: cachear `this.quantityInput` y `this.lineTotal`, registrar listeners para `input` y `change` llamando a `this.updateLineTotal()`.
  - Crear método `updateLineTotal()`:
    - Si cantidad <= 1 o inválida: añadir `data-empty` y limpiar textos.
    - Si cantidad > 1: calcular `unitCents * quantity` y `compareCents * quantity`, poblar label, current y compare con `formatMoney`, y remover `data-empty`.
  - En `updatePrice()`: invocar `this.updateLineTotal()` al final del método para recalcular en cambios de variante o planes de suscripción.

#### 3. `locales/en.default.json`
- Bajo `products.product`: agregar `"line_total": "Total for {{ quantity }}"`.

#### 4. `assets/base.css`
- Estilos para `.product-form__line-total`:
  - `display: flex`, `flex-wrap: wrap`, `align-items: baseline`, `gap: var(--space-xs)`, `color: var(--color-foreground-muted)`, `font-size: 0.875rem`.
  - `&[data-empty] { display: none; }`
  - Tachado con `opacity: 0.68`.
  - Importe actual con `font-weight: 700` y `color: var(--color-foreground)`.

---

### Tarea B: Selector de Grilla Móvil y Tablet (`sections/main-collection.liquid`, `assets/base.css`, `locales/`)

#### 1. `sections/main-collection.liquid`
- Reemplazar los botones de `collection-grid-switcher`:
  Retirar `aria-label` estático y agregar etiquetas `.visually-hidden` con clases diferenciadas para móvil y escritorio:
  ```liquid
  <button
    class="collection-grid-switcher__button"
    type="button"
    data-grid-view="2"
    aria-pressed="{% if default_grid_columns == '2' %}true{% else %}false{% endif %}"
  >
    <span class="collection-grid-switcher__icon collection-grid-switcher__icon--two" aria-hidden="true">
      <i></i><i></i>
    </span>
    <span class="visually-hidden collection-grid-switcher__label--small">
      {{- 'collections.grid.one_column' | t -}}
    </span>
    <span class="visually-hidden collection-grid-switcher__label--wide">
      {{- 'collections.grid.two_columns' | t -}}
    </span>
  </button>
  <button
    class="collection-grid-switcher__button"
    type="button"
    data-grid-view="4"
    aria-pressed="{% if default_grid_columns == '4' %}true{% else %}false{% endif %}"
  >
    <span class="collection-grid-switcher__icon collection-grid-switcher__icon--four" aria-hidden="true">
      <i></i><i></i><i></i><i></i>
    </span>
    <span class="visually-hidden collection-grid-switcher__label--small">
      {{- 'collections.grid.two_columns' | t -}}
    </span>
    <span class="visually-hidden collection-grid-switcher__label--wide">
      {{- 'collections.grid.four_columns' | t -}}
    </span>
  </button>
  ```

#### 2. `assets/base.css`
- Para móvil (base):
  ```css
  .collection-grid-switcher__icon--two i:nth-child(n + 2),
  .collection-grid-switcher__icon--four i:nth-child(n + 3) {
    display: none;
  }

  .collection-grid-switcher__label--wide {
    display: none;
  }
  ```
- En `@media (min-width: 48rem)`:
  - Restaurar barras:
    ```css
    .collection-grid-switcher__icon--two i:nth-child(n + 2),
    .collection-grid-switcher__icon--four i:nth-child(n + 3) {
      display: block;
    }

    .collection-grid-switcher__label--small {
      display: none;
    }

    .collection-grid-switcher__label--wide {
      display: block;
    }
    ```
  - Cambiar grilla en tablet a 4 columnas:
    ```css
    .product-grid[data-grid-columns='4'] {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    ```
  - Corregir bug `gap-inline` (línea ~3248) sustituyéndolo por `column-gap: var(--space-3)`.
  - Configurar `.product-grid[data-grid-columns='4'] .product-grid__item--promotion { grid-column: auto; }` en tablet para que el tile de promoción no aplaste la fila de 4 columnas.

#### 3. `locales/en.default.json` & `locales/en.default.schema.json`
- En `locales/en.default.json`: eliminar las claves huérfanas `view_compact` y `view_dense` en `collections.grid`. (Las claves `one_column`, `two_columns`, `four_columns` ya existen y ahora son consumidas).
- En `locales/en.default.schema.json`: agregar `info` en `default_grid_columns`: `"Sets the desktop default. On phones the two options render one and two products per row."`.

---

## 3. Criterios de Validación Obligatorios

1. `node --check assets/theme.js` -> 0 errores de sintaxis.
2. `cmd.exe /c "npx shopify theme check"` -> 0 ofensas sobre los 72 archivos.
3. `JSON.parse` estricto en todos los archivos `.json` modificados.
4. Reportar en `agent-comms/outbox-gpt/GPT-4B-002-pdp-line-total-and-mobile-grid.md`.
5. No hacer commit ni push.
