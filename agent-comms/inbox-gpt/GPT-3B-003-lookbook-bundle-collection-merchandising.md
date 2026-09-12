# Directiva de Implementación: GPT-3B-003 (Lookbook, Capsule Bundle y Merchandising de Colección)

```text
ID: GPT-3B-003
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3B.3 (Sprint 3: Lookbook Interactivo, Capsule Bundle y Merchandising de Colección)
Fecha: 2026-09-12
Estado: AUTORIZADA PARA EJECUCIÓN INMEDIATA TRAS APROBACIÓN DE GPT-3B-002
```

---

## 1. Visión y Propósito

Con los Sprints 3B.1 (Conversión PDP/Cart) y 3B.2 (Portada Editorial) aprobados sin reservas, iniciamos **Sprint 3B.3: Lookbook Interactivo, Capsule Bundle y Merchandising Dinámico de Colección**.

Este sprint traduce a código de producción los módulos clave de descubrimiento visual y venta agrupada diseñados en `couture-top-tier-merchandising-1440.svg`, `couture-top-tier-merchandising-390.svg` y `couture-collection-catalog-1440.svg`. Los compradores deben poder explorar looks editoriales mediante puntos táctiles interactivos, comprar conjuntos completos en un solo clic, y disfrutar de una experiencia de catálogo flexible con conmutador de columnas y tarjetas promocionales integradas.

---

## 2. Archivos Permitidos y Alcance Cerrado

### Archivos Permitidos:
- `sections/lookbook.liquid` (NUEVO: Fotografía editorial con hotspots interactivos y tarjetas emergentes de producto).
- `sections/complete-the-look.liquid` (NUEVO: Bundle de conjunto con checkboxes reactivos, cálculo dinámico de precio total y compra combinada).
- `sections/main-collection.liquid` (MODIFICAR: Conmutador de vista de cuadrícula 2 vs 4 columnas y tarjeta promocional `promotion_tile` dentro de la grilla).
- `assets/base.css` (MODIFICAR: Estilos de hotspots, popovers, grillas de ensemble, conmutador de columnas y promo tiles).
- `assets/theme.js` (MODIFICAR: Web Components `<editorial-lookbook>` y `<complete-the-look>` sobre `ThemeElement`).
- `locales/en.default.json` (MODIFICAR: Cadenas para lookbook, conjunto y conmutador de vista).
- `agent-comms/outbox-gpt/GPT-3B-003-lookbook-bundle-collection-merchandising.md` (NUEVO: Informe de entrega).

### Archivos Excluidos:
- `templates/index.json` (estabilizado en GPT-3B-002; se mantendrá intacto salvo si se desea añadir lookbook como sección opcional en presets futuros).
- `sections/main-product.liquid` y `sections/cart-drawer.liquid` (estabilizados en GPT-3B-001).
- `templates/*.json` secundarios (reservados para GPT-3B-004).

---

## 3. Especificaciones Técnicas Detalladas

### 1. `sections/lookbook.liquid` (Interactive Hotspot Lookbook)
- **Estructura:**
  - Imagen editorial principal en gran escala (desktop y mobile).
  - Bloques repetibles de tipo `hotspot` (hasta 6 por sección).
- **Settings del Bloque `hotspot`:**
  - `product`: selector de producto asociado.
  - `horizontal_position`: range 0 a 100% (eje X).
  - `vertical_position`: range 0 a 100% (eje Y).
  - `popover_position`: select (`top`, `bottom`, `left`, `right`).
- **Web Component `<editorial-lookbook>` en `assets/theme.js`:**
  - Puntos interactivos con `role="button"`, `aria-haspopup="dialog"`, `aria-expanded="false"`.
  - Animación sutil de pulso en el botón (desactivada si `prefers-reduced-motion: reduce`).
  - Al activar (click o enter), abre la mini-tarjeta del producto flotante con miniatura, título, precio formateado y enlace al PDP.
  - Cierre accesible con tecla `Escape` o clic fuera del popover. Foco atrapado o devuelto limpiamente al botón de hotspot al cerrar.

### 2. `sections/complete-the-look.liquid` (Shoppable Capsule Bundle)
- **Estructura Visual:**
  - Disposición en 2 columnas: a un lado la imagen editorial del conjunto completo, al otro la lista de 2 a 4 prendas individuales del look.
- **Interacción y Lógica en `<complete-the-look>`:**
  - Cada prenda cuenta con un checkbox de selección individual (`checked` por defecto), miniatura, título, selector de variante simplificado y precio.
  - Barra de resumen inferior con:
    - Contador de artículos seleccionados (*"2 of 3 items selected"*).
    - Suma dinámica reactiva del precio total de los items marcados (`total_price`).
    - Botón de compra grupal: *"Add Look to Bag • $XXX"* (o texto localizado correspondiente).
    - Al pulsar el botón, despacha un POST asíncrono a `routes.cart_add_url` con el array `items: [...]` de todas las variantes seleccionadas, abriendo el Cart Drawer y refrescando la Section Rendering API sin recargar la página.

### 3. `sections/main-collection.liquid` (Merchandising Top-Tier)
- **Conmutador de Grilla (Grid View Switcher):**
  - Botones accesibles junto al conteo de productos: `2 Columns` vs `4 Columns` (en mobile: `1 Column` vs `2 Columns`).
  - Utiliza atributo `data-grid-columns="2"` o `"4"` en el contenedor de productos.
  - Soporte de teclado y `aria-pressed` para indicar la vista activa.
- **Promotion Tile (`promotion_tile` block):**
  - Permite al merchant insertar 1 o 2 bloques de tipo `promotion_tile` que se intercalan orgánicamente en la grilla de productos en una posición configurable (setting `position_in_grid`, ej. posición 4 o 8).
  - Estructura del tile: fondo tonal (`color_scheme` o superficie sutil), imagen opcional, eyebrow, título editorial y enlace (ej. *"Read the Autumn Field Notes"* o *"Book a Private Atelier Appointment"*).
  - Si la colección tiene menos productos que la posición del tile, se muestra al final de los resultados.

---

## 4. Criterios de Aceptación y Validación

1. `node --check assets/theme.js` retorna código `0`.
2. `npx shopify theme check` reporta **0 ofensas** en todos los archivos.
3. El Lookbook es 100% operable por teclado y accesible según WCAG 2.2 AA.
4. El Capsule Bundle suma los precios reactivamente y agrega múltiples prendas en un solo POST al Cart Drawer.
5. El conmutador de columnas de la colección altera visualmente el grid sin provocar saltos ni overflow.
6. El Promotion Tile se posiciona correctamente entre los productos de la colección sin romper el loop de paginación.
7. Todas las cadenas nuevas de storefront residen en `locales/en.default.json` (cero texto hardcodeado).
8. Informe de entrega registrado en: `agent-comms/outbox-gpt/GPT-3B-003-lookbook-bundle-collection-merchandising.md`.
9. **No realizar commit ni push.**
