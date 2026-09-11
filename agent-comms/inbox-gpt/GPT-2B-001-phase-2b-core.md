# Tarea: GPT-2B-001 (Phase 2B Commerce Foundation)

```text
ID: GPT-2B-001
Owner: GPT-5.6 Sol Max (o Codex cuando disponga de tokens)
Modelo: GPT-5.6 Sol Max
Estado: listo para ejecucion (autorizado por usuario)
Decision requerida: Implementar el nucleo de comercio de Phase 2B cumpliendo estrictamente los requisitos P0, P1 y P2 aprobados por Gemini y autorizados por el usuario.
```

## Objetivo

Implementar la base transaccional de comercio de Phase 2B (`main-product`, `main-collection`, `main-cart-items`, `cart-drawer`, selector de variantes, filtros facetados y snippets atómicos de comercio) sustituyendo los placeholders de estas 3 plantillas, manteniendo compatibilidad con Online Store 2.0 y cero errores en Theme Check.

---

## Contexto Mínimo

- Phase 2A fue aprobada (`d69825a`) dejando `layout/theme.liquid`, `assets/base.css`, `assets/theme.js` (con `ThemeCore.ThemeElement` y `ThemeDrawer`), `header-group`, `footer-group` y 12 plantillas JSON con `sections/main-placeholder.liquid`.
- En `GEMINI-003`, Gemini y Codex validaron la preparación técnica con veredicto `READY WITH CHANGES`.
- El usuario ha autorizado formalmente el alcance de Phase 2B.

---

## Archivos Permitidos

1. `layout/theme.liquid` (para incluir la sección `cart-drawer` antes de `</body>`).
2. `config/settings_schema.json` (para añadir ajustes de carrito).
3. `locales/en.default.json` (para agregar todas las claves de texto de comercio con `| t`).
4. `assets/theme.js` (para registrar custom elements `<variant-selects>`, `<cart-drawer>`, `<facet-filters-form>` extendiendo `ThemeCore.ThemeElement`).
5. `assets/base.css` (para estilos base y layout de producto, rejilla de colección y drawer de carrito).
6. `sections/main-product.liquid` (NUEVO: sección principal de producto con soporte para `@app`).
7. `sections/main-collection.liquid` (NUEVO: catálogo con filtros facetados progresivos).
8. `sections/main-cart-items.liquid` (NUEVO: tabla/lista de carrito para plantilla `cart.json`).
9. `sections/cart-drawer.liquid` (NUEVO: sección global de carrito deslizable).
10. `snippets/price.liquid` (NUEVO: renderizado unificado de precios, compare-at, unit-price e impuestos).
11. `snippets/responsive-image.liquid` (NUEVO: renderizado de imagen con `image_tag`, `srcset` y lazy loading).
12. `snippets/product-card.liquid` (NUEVO: tarjeta de producto desacoplada y reutilizable).
13. `snippets/icon.liquid` (NUEVO: catálogo SVG nativo sin dependencias).
14. `templates/product.json` (actualizar para montar `main-product`).
15. `templates/collection.json` (actualizar para montar `main-collection`).
16. `templates/cart.json` (actualizar para montar `main-cart-items`).

## Archivos Excluidos (No modificar)

- `sections/main-placeholder.liquid` (debe preservarse para las otras 9 plantillas JSON).
- `templates/` (todas las demás plantillas JSON excepto `product`, `collection` y `cart`).
- `agent-comms/` y `docs/` (gestión reservada para Gemini y usuario).

---

## Criterios de Aceptación Obligatorios (P0, P1, P2)

### P0 (Críticos):
1. **Cart Drawer Global:** `sections/cart-drawer.liquid` debe renderizarse en `layout/theme.liquid`, comunicarse vía Ajax API (`/cart.js`, `/cart/add.js`, `/cart/change.js`), soportar actualización por Section Rendering API y respetar `cart.taxes_included`.
2. **Bloques `@app` en Producto:** El schema de `main-product.liquid` debe incluir `{ "type": "@app" }` y su renderizado en Liquid (`{% when '@app' %}{% render block %}`) en la columna de detalles.
3. **Contratos de Snippets Atómicos:**
   - `price.liquid`: soporta `product` o `variant`, `show_badges`, `unit_price`.
   - `responsive-image.liquid`: usa `image_tag` nativo de Shopify con `srcset` adaptativo.
   - `product-card.liquid`: reutilizable en colección y recomendaciones, usa `price.liquid` e `responsive-image.liquid`.
   - `icon.liquid`: soporta iconos básicos (`close`, `cart`, `chevron`, `check`, `arrow`, `spinner`).
4. **Herencia de Custom Elements:** `<variant-selects>`, `<cart-drawer>` y `<facet-filters-form>` deben extender de `window.ThemeCore.ThemeElement` y usar `this.listen(...)` para limpieza de listeners.

### P1 (Estructura y Experiencia Merchant):
5. **Settings de Carrito:** En `settings_schema.json` agregar en la sección `cart`:
   - `cart_type`: select con opciones `"drawer"` (default) y `"page"`.
   - `show_cart_note`: checkbox (default `false`).
6. **Exclusión de `sticky-cart-bar`:** NO implementar la barra adhesiva móvil en esta fase; queda para Phase 3.
7. **Filtros Facetados Progresivos:** En `main-collection.liquid`, el formulario de filtros debe funcionar nativamente con GET sin JS (`<form action="{{ collection.url }}">`), y enriquecerse con el custom element `<facet-filters-form>` interceptando el evento para fetch vía Section Rendering API y `history.pushState`.
8. **Actualización de JSON:** Actualizar `templates/product.json`, `templates/collection.json` y `templates/cart.json` para montar sus respectivas secciones reales.

### P2 (Accesibilidad y Localización):
9. **Variantes Accesibles:** Selector con radio buttons (`role="radiogroup"`), indicación de no disponibles con `aria-disabled="true"`, sincronización de URL (`?variant=ID`) con `history.replaceState` y anuncio `aria-live`.
10. **Cero Textos Hardcodeados:** Todo texto de interfaz debe usar `| t` y estar declarado en `locales/en.default.json`.

---

## Validaciones Obligatorias Antes de Entregar

- `node --check assets/theme.js` sin errores de sintaxis.
- Parseo estricto y válido de todos los archivos JSON modificados o creados.
- `shopify theme check` sin ofensas críticas (o validación equivalente de sintaxis Liquid).
- `git diff --check` limpio sin problemas de whitespace o caracteres inválidos.

---

## Entregable

Reporte de implementación en:
`agent-comms/outbox-gpt/GPT-2B-001-phase-2b-core.md`

Siguiendo el formato de entrega:
```text
ID: GPT-2B-001
Estado: completado
Decision requerida: Revision y aceptacion de Phase 2B por Gemini.
Resumen en 5 lineas:
...
```
