# GPT-DIRECTIVE-5C-001: Track 2 - Merchandising PDP, Confianza y Vistos Recientemente (Sprint 5C)

```text
ID: GPT-DIRECTIVE-5C-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: GPT-6 Sol Max (Implementador & Auditor Senior de Producto)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-23
Estado: DIRECTIVA TÉCNICA VINCULANTE (SPRINT 5C - TRACK 2)
Alcance asignado: Sección Recently Viewed + Capa de Confianza e Inventario PDP + Anuncio Cart Drawer
Track paralelo: Claude Opus 5.5 Extra ejecuta el Track 1 (Mega Menú Editorial y Pulido P2-01)
```

---

## 1. Contexto y Reparto de Trabajo

Para maximizar la velocidad y aprovechar la máxima capacidad de ambos modelos, Johandry ha dividido el Sprint 5C en dos tracks paralelos sin colisión de archivos:
- **Track 1 (Claude):** Navegación Editorial en Cabecera (`header.liquid`, `snippets/mega-menu.liquid`) y Pulido P2-01 en `assets/product-zoom.js`.
- **Track 2 (GPT-6):** Merchandising en PDP (Inventario reactivo, acordiones de sastrería, capa de confianza) y sección de Productos Vistos Recientemente (`recently-viewed.liquid`).

---

## 2. Especificación Técnica de Implementación (Track 2)

### A. Sección Nativa de Productos Vistos Recientemente (`sections/recently-viewed.liquid`)
* **Archivo Nuevo:** `sections/recently-viewed.liquid`:
  - Web Component `<recently-viewed>` en `assets/theme.js` (o inline si se prefiere desacoplar).
  - Almacena en `localStorage` la clave `'theme:recently-viewed'` como un array JSON de IDs o handles de producto (máximo 8 elementos, más recientes al frente).
  - En la PDP (`sections/main-product.liquid`), el componente añade automáticamente el producto actual al array local.
  - En la sección `sections/recently-viewed.liquid`:
    - El marcado inicial se renderiza con el atributo `hidden` si no hay productos disponibles.
    - El Web Component lee `localStorage`, excluye el ID/handle del producto actual (si está en PDP para no recomendarse a sí mismo), y si hay elementos guardados, realiza una petición ligera a Shopify Section Rendering API:
      `${routes.search_url}?section_id=${this.sectionId}&type=product&q=${query}`
      (donde `query` busca por IDs `id:X OR id:Y` o handles).
    - Inyecta las tarjetas de producto en el grid reutilizando `snippets/product-card.liquid` con sus swatches y quick buy ya certificados.
  - Schema de la sección:
    - `"name": "t:sections.recently_viewed.name"`
    - Settings: `heading` (default: "Recently viewed" / "Vistos recientemente"), `eyebrow`, `products_to_show` (range 2 a 8, default 4), `columns_desktop` (range 2 a 4, default 4), `color_scheme`, y toggles para `show_secondary_image`, `show_vendor`, `show_quick_add`.
    - Preset: `"Recently viewed"`.

### B. Capa de Confianza, Inventario y Acordiones PDP
* **En `sections/main-product.liquid` y `sections/featured-product.liquid`:**
  - Mantener la complejidad controlada extrayendo los nuevos bloques a snippets:
    - `snippets/product-inventory.liquid`: Indicador de inventario.
    - `snippets/product-accordion.liquid`: Pestañas y acordiones.
  - **Bloque 1: `inventory_status` (Indicador de stock en tiempo real):**
    - Settings:
      - `threshold`: `range` de 1 a 20 (default 5, label `t:sections.main_product.blocks.inventory_status.settings.threshold.label`, info `t:sections.main_product.blocks.inventory_status.settings.threshold.info`).
      - `show_count`: `checkbox` (default `true`, label `t:sections.main_product.blocks.inventory_status.settings.show_count.label`).
    - Lógica y reactividad:
      - En servidor y en JavaScript (`VariantSelects` vía evento `theme:variant-change`):
        - Si `variant.available`:
          - Si `variant.inventory_management == 'shopify'` y `variant.inventory_quantity <= threshold` y `variant.inventory_quantity > 0`:
            Muestra aviso de stock bajo con punto de advertencia sutil: `"Low stock: only {{ count }} left"` / `"Pocas existencias: solo quedan {{ count }}"`.
          - Si `variant.inventory_quantity > threshold` o inventario no gestionado por Shopify:
            Muestra `"In stock, ready to ship"` / `"En existencias, listo para enviar"` con punto neutro/verde.
          - Si `variant.inventory_policy == 'continue'` y `variant.inventory_quantity <= 0`:
            Muestra `"Available for pre-order"` / `"Disponible bajo pedido"`.
        - Si no disponible:
          Muestra `"Sold out"` / `"Agotado"`.
  - **Bloque 2: `shipping_lead_time` / `trust_badges` (Compromiso y despacho):**
    - Settings: texto de plazo estimado de entrega, política de devoluciones ("Free 30-day returns and exchanges"), e iconos opcionales (camión, reloj, escudo, regla).
  - **Bloque 3: `collapsible_tab` (Acordiones de sastrería y cuidado):**
    - Settings: `heading` (ej. "Materials & Care"), `icon` (selección opcional), `content` (`richtext`), y `page` (`page` picker opcional).
    - Marcado: `<details class="product-accordion">` nativo con `<summary>`, accesible, foco visible y animación fluida.

### C. Anuncio Accesible en Cart Drawer
* En `CartDrawer.addItem` (`assets/theme.js`):
  - Al agregar un artículo con éxito, actualizar la región viva de accesibilidad anunciando el nombre del producto y variante agregada:
    `"Added {{ title }} - {{ variant }} to cart"` / `"Añadido {{ title }} - {{ variant }} al carrito"`.

### D. Estilos CSS en `assets/base.css`
* Añadir al final de `assets/base.css` el bloque claramente delimitado:
  `/* -------------------------------------------------------------------------- */`
  `/* 5C-002. PDP Confianza, Inventario y Recently Viewed                        */`
  `/* -------------------------------------------------------------------------- */`
  - Clases para acordiones, indicador de stock con punto de pulso y grid de recently viewed.

### E. Localización Bilingüe Estricta (Paridad 100%)
* Incorporar todas las claves nuevas en `locales/en.default.json`, `locales/es.json` y `locales/en.default.schema.json` bajo `sections.recently_viewed.*` y `sections.main_product.blocks.*`.

---

## 3. Protocolo de Entrega

* Trabajar en el árbol de trabajo local **sin hacer commit ni push**.
* Reportar todos los cambios con líneas exactas, comandos y evidencias en:
  `agent-comms/outbox-gpt/GPT-REPORT-5C-001.md`.
