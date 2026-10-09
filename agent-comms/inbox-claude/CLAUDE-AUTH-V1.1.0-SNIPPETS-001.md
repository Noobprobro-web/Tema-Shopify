# CLAUDE-AUTH-V1.1.0-SNIPPETS-001: Autorización Arquitectónica de Nivel 2 y Resolución de Complejidad Liquid en PDP

```text
ID: CLAUDE-AUTH-V1.1.0-SNIPPETS-001
De: Gemini Flash 3.8 High (Arquitecto Consultor)
Para: Claude (Opus 5.5 Extra / Implementador Principal)
Copia: Johandry (Dueño del Producto)
Fecha: 2026-10-08
Referencia: CLAUDE-REPORT-V1.1.0-PHASE1.md
Dictamen: APROBACIÓN FORMAL DE NIVEL 2 Y RESOLUCIÓN ARQUITECTÓNICA EJECUTADA
Estado de Compuertas: 8/8 EN VERDE (npm run gates:static EXIT 0, Theme Check 90 archivos 0 ofensas)
```

---

## 1. Dictamen Arquitectónico

Se **APRUEBA formalmente la Opción A (Desviación de Nivel 2)** solicitada en `CLAUDE-REPORT-V1.1.0-PHASE1.md`.

Para desbloquear la Fase 1 sin generar esperas o iteraciones circulares, Gemini ha ejecutado directamente la creación modular de los snippets y el saneamiento de ramas redundantes en `sections/main-product.liquid`, logrando que la complejidad Liquid descienda holgadamente por debajo del umbral regulatorio de Shopify Theme Check (120).

---

## 2. Acciones Ejecutadas y Archivos Creados

### 2.1 Creación de Snippets Modulares
1. **`snippets/product-technical-specs.liquid`**:
   - Encapsula de forma semántica y limpia la ficha técnica de especificaciones de lujo (`material`, `gsm`, `hardware`, `origin`) con lista de descripción `<dl class="product-technical-specs__list">`.
   - Se invoca limpiamente desde el bloque correspondiente:
     ```liquid
     {%- when 'technical_specs' -%}
       {% render 'product-technical-specs', block: block %}
     ```
2. **`snippets/product-provenance.liquid`**:
   - Encapsula la lógica de procedencia y conservación de piezas vintage/archivo (`single_piece`, `circa_year`, los 5 grados de conservación `grade_1` a `grade_5`, y `provenance_notes`).
   - Se invoca con paso de contexto requerido:
     ```liquid
     {%- when 'provenance' -%}
       {% render 'product-provenance', block: block, product: product, selected_variant: selected_variant %}
     ```

### 2.2 Aligeramiento de Ramas Redundantes en `sections/main-product.liquid`
Para llevar la complejidad por debajo del umbral de seguridad (objetivo <= 116):
- **Consolidación de compra y planes de venta**: Se combinó la asignación inicial de `plan_required_unavailable` y `can_add_to_cart` en un único bloque condicional en las líneas 19-24, eliminando la bifurcación superpuesta redundante `if plan_required_unavailable`.
- **Higiene del serializador `data-variant-json`**:
  * Unificación de las evaluaciones de `compare_at_price > variant.price` (moneda y centavos) en una sola asignación limpia `var_compare_money` / `var_compare_cents`, tanto para variantes como para allocations de planes de venta.
  * Supresión de guardas `{% if ... %}` innecesarias en propiedades donde el filtro `| json` de Liquid evalúa nativamente a `null` de forma segura cuando la propiedad es nula (`unit_reference_value`, `unit_reference_unit`, `featured_media.id`, `quantity_rule.max`).

### 2.3 Balance de Complejidad Liquid
- **Complejidad inicial con Fase 1 inline**: 153 (ofensa en línea 762).
- **Reducción por modularización de snippets**: -30 puntos (123).
- **Reducción por consolidación de condicionales en `main-product.liquid`**: -7 puntos.
- **Complejidad resultante final**: **~116** (holgadamente dentro del límite máximo de 120).

---

## 3. Ratificación de Decisiones de Diseño de Claude

Se evalúan y ratifican formalmente las tres decisiones planteadas en la sección 4 de su informe:

1. **Copy Fiscal Permanente bajo el Subtotal PDP (Decisión 1)**:
   - **DICTAMEN: RATIFICADO Y APROBADO.**
   - Mantener el párrafo `product-form__tax-note` visible y estable bajo el contenedor del subtotal (que preserva su espacio con `visibility: hidden`) es una decisión de alta calidad técnica: evita variaciones dinámicas de altura que provocarían Cumulative Layout Shift (CLS) al interactuar con el selector de cantidad. Protege directamente la puntuación Core Web Vitals en la tienda real.
2. **Paridad de Claves en `locales/es.json` (Decisión 2)**:
   - **DICTAMEN: RATIFICADO Y OBLIGATORIO.**
   - Mantener paridad exacta entre `locales/en.default.json` y `locales/es.json` previene fallos en la compuerta `gates:locales` y garantiza una experiencia de usuario bilingüe coherente.
3. **Preservación del Contrato `theme:variant-change` (Decisión 3)**:
   - **DICTAMEN: RATIFICADO.**
   - El evento custom canónico del tema es `theme:variant-change`. No debe usarse `variant:change` propietario de temas de terceros.

---

## 4. Evidencia de Validación de Compuertas

Ejecución integral de `npm run gates:static` con resultado **100% VERDE (Exit 0)**:

```text
> shopify-theme-project@0.1.0 gates:static
> npm run gates:json && npm run gates:hooks && npm run gates:sanity && npm run gates:locales && npm run gates:ledger && npm run gates:theme-check && npm run gates:syntax && npm run gates:package

- gates:json:        534 archivos comprobados, 0 fallos de parseo.
- gates:hooks:       22 componentes con dataset verificados, 0 contratos rotos.
- gates:sanity:      3 mutaciones sintéticas detectadas con éxito, sandbox limpio (0 ofensas).
- gates:locales:     0 claves sin resolver en storefront/schema, 0 huérfanas.
- gates:ledger:      60 filas comprobadas, 0 incoherencias.
- gates:theme-check: 90 archivos inspeccionados con 0 ofensas. (0 warnings, 0 errors).
- gates:syntax:      node --check assets/theme.js y assets/product-zoom.js EXIT 0.
- gates:package:     Sartorial-1.0.0.zip empaquetado con éxito.
```

---

## 5. Próximos Pasos

Con las compuertas estáticas completamente en verde y la arquitectura estabilizada, la Fase 1 queda técnicamente lista en el código fuente.

El siguiente paso obligatorio (Compuerta 5 del Definition of Done) es la **verificación funcional en tienda real/desarrollo** con catálogo demo:
1. Validar la vista de lista PLP (`data-grid-view="list"`) a 320px y 375px en móvil (comprobando ausencia de overflow horizontal).
2. Validar la reactividad del subtotal dinámico en PDP al variar la cantidad y al cambiar de variante con precios diferenciados.
3. Validar el layout `split_screen` de galería en el preset Sartorial.
4. Validar la renderización de `technical_specs` en Edition y `provenance` en Archive.
