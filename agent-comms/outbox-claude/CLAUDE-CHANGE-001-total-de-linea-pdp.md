# CLAUDE-CHANGE-001: Total de línea en la página de producto

```text
ID: CLAUDE-CHANGE-001
Autor: Claude
Solicitado por: Johandry (decisión tomada: total de línea aparte, no multiplicar el precio)
Archivos afectados: 4
Aplicable sin tokens de GPT. Listo para pegar
Fecha: 2026-09-13
```

## Qué hace y qué no hace

**Hace:** cuando el cliente sube la cantidad por encima de 1, aparece una línea nueva debajo del selector de cantidad con el total de esa línea. Si el producto está en oferta, muestra también el total comparativo tachado, así que el cliente ve cuánto ahorra en la compra completa y no solo por unidad.

**No hace:** no toca el precio principal ni el comparativo de arriba. Se quedan siendo el precio unitario.

## Por qué así y no multiplicando el precio

En moda el precio del PDP es el unitario por convención y el total vive en el carrito. Multiplicarlo en la página produce tres contradicciones dentro de la misma pantalla:

1. **Shop Pay Installments.** `{{ form | payment_terms }}` calcula las cuotas sobre el precio de la variante, no sobre la cantidad. Con el precio multiplicado se leería "4 pagos de $472" al lado de un precio de $5.670.
2. **Precio unitario legal de la UE.** `variant.unit_price` es por unidad por definición. Un "por litro" junto a un precio que ya no es por unidad es incoherente.
3. **El comparativo.** Un tachado de $300 que pasa a $900 se lee como subida de precio, no como subtotal.

El total de línea aparte da la misma transparencia sin ninguna de las tres, y además permite mostrar el ahorro total, que es la parte comercialmente útil del comparativo.

---

## Edit 1 de 4: `sections/main-product.liquid`

### 1a. Atributos nuevos en `<variant-selects>`

**Buscar** la última línea de atributos del tag:

```liquid
      data-per-delivery-template="{{ 'products.product.purchase_options.per_delivery' | t: price: '[price]' | escape }}"
    >
```

**Reemplazar por:**

```liquid
      data-per-delivery-template="{{ 'products.product.purchase_options.per_delivery' | t: price: '[price]' | escape }}"
      data-money-format="{{ shop.money_format | strip_html | escape }}"
      data-line-total-template="{{ 'products.product.line_total' | t: quantity: '[quantity]' | escape }}"
    >
```

`strip_html` está a propósito: algunas tiendas tienen `money_format` con markup del tipo `<span class=money>${{amount}}</span>`, y sin quitarlo las etiquetas aparecerían como texto.

### 1b. El elemento nuevo en el bloque `quantity`

**Buscar** el bloque completo (líneas 294 a 309 de la versión actual):

```liquid
            {%- when 'quantity' -%}
              <div class="product-form__quantity" {{ block.shopify_attributes }}>
                <label for="Quantity-{{ section.id }}">{{ 'products.product.quantity' | t }}</label>
                <input
                  id="Quantity-{{ section.id }}"
                  type="number"
                  name="quantity"
                  form="{{ product_form_id }}"
                  value="{{ selected_variant.quantity_rule.min | default: 1 }}"
                  min="{{ selected_variant.quantity_rule.min | default: 1 }}"
                  step="{{ selected_variant.quantity_rule.increment | default: 1 }}"
                  {% if selected_variant.quantity_rule.max != blank %}max="{{ selected_variant.quantity_rule.max }}"{% endif %}
                  inputmode="numeric"
                  data-quantity-input
                >
              </div>
```

**Reemplazar por:**

```liquid
            {%- when 'quantity' -%}
              <div class="product-form__quantity" {{ block.shopify_attributes }}>
                <label for="Quantity-{{ section.id }}">{{ 'products.product.quantity' | t }}</label>
                <input
                  id="Quantity-{{ section.id }}"
                  type="number"
                  name="quantity"
                  form="{{ product_form_id }}"
                  value="{{ selected_variant.quantity_rule.min | default: 1 }}"
                  min="{{ selected_variant.quantity_rule.min | default: 1 }}"
                  step="{{ selected_variant.quantity_rule.increment | default: 1 }}"
                  {% if selected_variant.quantity_rule.max != blank %}max="{{ selected_variant.quantity_rule.max }}"{% endif %}
                  inputmode="numeric"
                  data-quantity-input
                >

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
              </div>
```

Nota de accesibilidad: la región viva se queda siempre en el DOM y se vacía cuando la cantidad es 1. Un `aria-live` vacío no anuncia nada, y así se evita el doble anuncio que produce alternar `hidden` sobre una región viva. El `aria-atomic="true"` hace que se lea como una unidad, "Total for 3, was 9,000 dollars, 5,670 dollars", en vez de leer los números sueltos.

### 1c. Centavos en el JSON de variantes

**Buscar**, dentro de `data-variant-json`:

```liquid
              "price": {{ variant.price | money | json }},
              "compare_at_price": {% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | money | json }}{% else %}null{% endif %},
```

**Reemplazar por:**

```liquid
              "price": {{ variant.price | money | json }},
              "price_cents": {{ variant.price | json }},
              "compare_at_price": {% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | money | json }}{% else %}null{% endif %},
              "compare_at_price_cents": {% if variant.compare_at_price > variant.price %}{{ variant.compare_at_price | json }}{% else %}null{% endif %},
```

Y **en el mismo JSON**, dentro de `selling_plan_allocations`, buscar:

```liquid
                    "price": {{ allocation.price | money | json }},
                    "compare_at_price": {% if allocation.compare_at_price > allocation.price %}{{ allocation.compare_at_price | money | json }}{% else %}null{% endif %},
```

**Reemplazar por:**

```liquid
                    "price": {{ allocation.price | money | json }},
                    "price_cents": {{ allocation.price | json }},
                    "compare_at_price": {% if allocation.compare_at_price > allocation.price %}{{ allocation.compare_at_price | money | json }}{% else %}null{% endif %},
                    "compare_at_price_cents": {% if allocation.compare_at_price > allocation.price %}{{ allocation.compare_at_price | json }}{% else %}null{% endif %},
```

Los centavos hacen falta en las dos partes porque `updatePrice` usa `this.currentAllocation || variant` como fuente, así que con un plan de suscripción activo el total tiene que salir del precio del plan y no del de la variante.

**Por qué centavos y no parsear el texto formateado.** Hoy el JSON solo guarda el precio ya formateado (`{{ variant.price | money }}`). Multiplicar eso obligaría a parsear una cadena con separadores locales, que es exactamente la clase de bug del filtro de precio que se acaba de arreglar: en una tienda con formato `1.234,56` el parseo se equivoca por tres órdenes de magnitud. Con centavos crudos la aritmética es entera y exacta.

---

## Edit 2 de 4: `assets/theme.js`

### 2a. El formateador de moneda, a nivel de módulo

Colocarlo junto a las otras utilidades del módulo, antes de `class ThemeElement`.

```js
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

Cubre los siete marcadores que usa Shopify, así que funciona igual en una tienda en dólares, en una en euros con coma decimal, en una suiza con apóstrofo y en una en yenes sin decimales. Respeta el formato que el comerciante configuró, que es el punto: no inventa uno.

### 2b. Cachear las referencias en `connectedCallback`

**Buscar**, dentro de `class VariantSelects`:

```js
      this.currentVariant = this.getInitialVariant();
      this.cachePurchaseOptionElements();
```

**Reemplazar por:**

```js
      this.quantityInput = this.querySelector('[data-quantity-input]');
      this.lineTotal = this.querySelector('[data-line-total]');

      if (this.quantityInput && this.lineTotal) {
        this.listen(this.quantityInput, 'input', () => this.updateLineTotal());
        this.listen(this.quantityInput, 'change', () => this.updateLineTotal());
      }

      this.currentVariant = this.getInitialVariant();
      this.cachePurchaseOptionElements();
```

Los dos eventos a propósito: `input` da respuesta inmediata al escribir, y `change` cubre el caso de los botones de incremento del navegador y el de pegar un valor.

### 2c. El método nuevo

Agregarlo **inmediatamente después** del cierre de `updatePrice(variant) { ... }`.

```js
    updateLineTotal() {
      if (!this.lineTotal || !this.quantityInput) return;

      const label = this.lineTotal.querySelector('[data-line-total-label]');
      const compare = this.lineTotal.querySelector('[data-line-total-compare]');
      const compareValue = this.lineTotal.querySelector('[data-line-total-compare-value]');
      const current = this.lineTotal.querySelector('[data-line-total-current]');

      const clear = () => {
        this.lineTotal.setAttribute('data-empty', '');
        if (label) label.textContent = '';
        if (current) current.textContent = '';
        if (compareValue) compareValue.textContent = '';
        if (compare) compare.hidden = true;
      };

      const source = this.currentAllocation || this.currentVariant;
      const unitCents = Number(source?.price_cents);
      const quantity = Number.parseInt(this.quantityInput.value, 10);

      if (!Number.isFinite(unitCents) || !Number.isFinite(quantity) || quantity <= 1) {
        clear();
        return;
      }

      const format = this.dataset.moneyFormat;
      const template = this.dataset.lineTotalTemplate || '';

      if (label) label.textContent = template.replace('[quantity]', String(quantity));
      if (current) current.textContent = formatMoney(unitCents * quantity, format);

      const compareCents = Number(source?.compare_at_price_cents);
      const hasCompare = Number.isFinite(compareCents) && compareCents > unitCents;

      if (compare) compare.hidden = !hasCompare;
      if (compareValue) compareValue.textContent = hasCompare ? formatMoney(compareCents * quantity, format) : '';

      this.lineTotal.removeAttribute('data-empty');
    }
```

### 2d. Llamarlo cuando cambie el precio

**Buscar** el final de `updatePrice`, que hoy es el cierre del bloque de `unitPrice`:

```js
          if (reference) {
            const referenceValue = variant.unit_reference_value === 1 ? '' : variant.unit_reference_value;
            reference.textContent = `${referenceValue || ''}${variant.unit_reference_unit || ''}`;
          }
        }
      }
    }
```

**Reemplazar por:**

```js
          if (reference) {
            const referenceValue = variant.unit_reference_value === 1 ? '' : variant.unit_reference_value;
            reference.textContent = `${referenceValue || ''}${variant.unit_reference_unit || ''}`;
          }
        }
      }

      this.updateLineTotal();
    }
```

Con eso el total se recalcula también al cambiar de variante y al activar o desactivar un plan de suscripción, no solo al mover la cantidad. Y como `updateQuantityRules` puede recortar el valor de la cantidad al cambiar de variante (por `quantity_max`), el total queda consistente con el valor recortado.

---

## Edit 3 de 4: `locales/en.default.json`

Dentro de `products.product`, junto a `quantity`:

```json
"line_total": "Total for {{ quantity }}",
```

Decisión editorial: "Total for 3" y no "Subtotal" ni "3 × $1,890 = $5,670". "Subtotal" es vocabulario de carrito y aquí no estamos en el carrito. Y la forma con la multiplicación explícita es correcta pero ruidosa: el cliente ya sabe cuántos pidió porque acaba de escribirlo.

---

## Edit 4 de 4: `assets/base.css`

Agregar junto a las reglas de `.product-form__quantity`.

```css
.product-form__line-total {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  margin-block-start: var(--space-xs);
  gap: var(--space-xs);
  color: var(--color-foreground-muted);
  font-size: 0.875rem;
}

.product-form__line-total[data-empty] {
  display: none;
}

.product-form__line-total s {
  opacity: 0.68;
}

.product-form__line-total [data-line-total-current] {
  color: var(--color-foreground);
  font-weight: 700;
}
```

Tres decisiones deliberadas. `0.875rem` es exactamente 14px, el piso de legibilidad: la auditoría encontró 48 declaraciones por debajo de eso y no quiero sumar la 49. El `opacity: 0.68` es el mismo valor que ya usa `.price__compare`, que da 5.86:1 contra el fondo por defecto y pasa 4.5:1. Y el `flex-wrap` es para 360px, donde la etiqueta y los dos montos no caben en una línea.

---

## Casos borde cubiertos

| Caso | Comportamiento |
| --- | --- |
| Cantidad 1 | La línea no se muestra. Región viva vacía, no anuncia nada |
| Campo de cantidad vacío o con texto inválido | `Number.parseInt` da `NaN`, se limpia y no se muestra `NaN` en pantalla |
| Producto sin bloque de cantidad en la plantilla | `this.lineTotal` es null, el método retorna de inmediato |
| Producto con plan de suscripción activo | El total sale del precio del plan, no del de la variante |
| Producto sin comparativo | El tachado queda oculto |
| Comparativo menor o igual al precio | El tachado queda oculto. Misma condición que usa `price.liquid` |
| Cambio de variante que recorta la cantidad por `quantity_max` | `updatePrice` llama al método, así que el total refleja el valor recortado |
| Tienda en euros con formato `1.234,56` | Aritmética en centavos enteros, formateo con el `money_format` del comerciante |
| Tienda en yenes sin decimales | El marcador `amount_no_decimals` da 0 decimales |
| Sin JavaScript | La línea no aparece. No hay degradación porque no hay nada que degradar |

## Qué verificar en la tienda de desarrollo

1. `qa-08-on-sale`, que tiene comparativo. Subir a 3 y comprobar que aparecen los dos totales y que el tachado es el mayor.
2. `qa-06-many-variants`. Cambiar de variante con la cantidad en 5 y comprobar que el total se recalcula.
3. `qa-13-expensive` con la tienda en EUR y formato `1.234,56`. Comprobar que el total sale `37.500,00 €` y no `37,500.00`.
4. `qa-15-no-description` sin comparativo. Comprobar que solo aparece un monto.
5. Con un lector de pantalla, subir la cantidad y comprobar que se anuncia una sola vez y como frase completa.
6. A 360px de ancho, comprobar que la línea envuelve y no desborda.

## Un arreglo gratis que habilita este cambio

El `formatMoney` de 2a resuelve además el hallazgo **P1-14** de la auditoría. Hoy `CompleteTheLook` formatea el total del capsule con `Intl.NumberFormat`, que ignora el `money_format` del comerciante, así que el total del set puede mostrarse con un formato distinto al de cada pieza en la misma pantalla.

El reemplazo es sustituir el cuerpo de su método `formatMoney` por una llamada a esta función, pasándole el `money_format` como atributo de datos igual que aquí.

**No lo incluyo en este cambio a propósito.** `AGENTS.md` pide mantener los cambios pequeños y fáciles de revisar, y mezclar un arreglo de otro componente con una feature nueva rompe esa regla. Queda anotado para que Gemini lo encargue como su propio cambio, y ya no cuesta trabajo de diseño porque el helper va a estar puesto.

## Nota de protocolo

Entrego esto como bloques listos para pegar y no escribiendo directo en los archivos del tema, para que se mantenga el modo READ-ONLY y la compuerta de revisión de Gemini. Si prefieres que lo aplique yo directamente sobre los cuatro archivos, dilo y lo hago en una pasada.
