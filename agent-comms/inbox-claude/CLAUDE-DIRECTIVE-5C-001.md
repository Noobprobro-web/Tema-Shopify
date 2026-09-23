# CLAUDE-DIRECTIVE-5C-001: Mega Menú Editorial, Vistos Recientemente y Confianza PDP (Sprint 5C)

```text
ID: CLAUDE-DIRECTIVE-5C-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Disciplina Técnica)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-23
Estado: DIRECTIVA TÉCNICA VINCULANTE (SPRINT 5C)
Meta: Trilogía de Lujo ($380 USD tier): Navegación Editorial, Retención con Vistos Recientemente y Conversión PDP con Cero Dependencias
```

---

## 1. Contexto Estratégico y Objetivos

Con la certificación formal y cierre del Sprint 5B (`GPT-AUDIT-008`), Johandry ha autorizado la ejecución simultánea de las 3 grandes iniciativas comerciales de alta gama para posicionar a **Sartorial** al nivel de los temas más cotizados de la Shopify Theme Store (*Prestige*, *Focal* e *Impulse*):

1. **Mega Menú Editorial Multicolumna:** Navegación por categorías de 2º y 3er nivel con soporte para hasta 2 tarjetas promocionales editoriales por menú con imágenes lazy.
2. **Productos Vistos Recientemente (Recently Viewed):** Sección nativa con almacenamiento en `localStorage` y renderizado dinámico con Section Rendering API, reutilizando `product-card.liquid` con sus swatches y quick buy ya certificados.
3. **Capa de Confianza e Inventario en PDP:** Indicador de existencias reactivo a variantes ("*Low stock: only X left*"), tiempos estimados de entrega/devoluciones y acordiones enriquecidos de composición/sastrería.
4. **Pulidos de Calidad P2:** Subsanación de P2-01 (actualización de live region en resize de zoom) y anuncio sonoro detallado en Cart Drawer al añadir producto.

---

## 2. Especificación Técnica de Implementación

### MÓDULO 1: Mega Menú Editorial en Cabecera (`sections/header.liquid`)
* **Modularidad y Complejidad:**
  - Extraer el renderizado del mega menú a `snippets/mega-menu.liquid` para mantener la complejidad Liquid de `sections/header.liquid` muy por debajo del límite de Theme Check.
* **Bloques de Schema en `header.liquid`:**
  - Tipo de bloque: `mega_menu_promo` (nombre: `t:sections.header.blocks.mega_menu_promo.name`).
  - Settings:
    - `menu_item`: `text`, label: `t:sections.header.blocks.mega_menu_promo.settings.menu_item.label`, info: `t:sections.header.blocks.mega_menu_promo.settings.menu_item.info` (nombre del enlace de 1er nivel que activa el mega menú, ej. "Catalog" o "Catálogo", insensible a mayúsculas/minúsculas).
    - `image_1`: `image_picker`, label `t:sections.header.blocks.mega_menu_promo.settings.image_1.label`.
    - `heading_1`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.heading_1.label`.
    - `subheading_1`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.subheading_1.label`.
    - `link_1`: `url`, label `t:sections.header.blocks.mega_menu_promo.settings.link_1.label`.
    - `image_2`: `image_picker`, label `t:sections.header.blocks.mega_menu_promo.settings.image_2.label`.
    - `heading_2`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.heading_2.label`.
    - `subheading_2`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.subheading_2.label`.
    - `link_2`: `url`, label `t:sections.header.blocks.mega_menu_promo.settings.link_2.label`.
* **Renderizado y Arquitectura:**
  - Si un enlace de 1er nivel tiene subenlaces (`link.links != blank`) y existe un bloque `mega_menu_promo` que coincide con su título (o si `link.levels > 1` y se habilita mega menú), se renderiza el mega menú desplegable a pantalla completa/contenedor.
  - Distribución en grid:
    - Columnas de navegación: Cada enlace de 2º nivel encabeza una columna (`<a class="mega-menu__column-title">`), y sus enlaces de 3er nivel se listan debajo (`<ul class="mega-menu__sublist">`).
    - Zona promocional (derecha): Hasta 2 tarjetas editoriales con relación de aspecto elegante (ej. 4:5 o 3:4), imagen con `loading="lazy"`, tipografía refinada y enlace interactivo con tap target >= 44 px.
  - Si el enlace solo tiene un nivel de hijos sin bloque promocional, conserva el dropdown clásico `.desktop-nav__panel`.
  - En móvil (`mobile-nav`), mantener el acordeón jerárquico actual sin alteraciones para no romper la ergonomía táctil.
  - Accesibilidad: Cero trampas de foco; navegación fluida con `Tab`; cierre inmediato con tecla `Escape`; atributo `aria-expanded` reactivo sincronizado con `<theme-disclosure>`.

---

### MÓDULO 2: Sección Nativa de Productos Vistos Recientemente
* **Archivo Nuevo:** `sections/recently-viewed.liquid`:
  - Web Component `<recently-viewed>` en `assets/theme.js` (o asset modular dedicado).
  - Almacena en `localStorage` la clave `'theme:recently-viewed'` como un array JSON de IDs o handles de producto (máximo 8 elementos, más recientes al frente).
  - En la PDP (`sections/main-product.liquid`), el componente añade automáticamente el producto actual al array local.
  - En la sección `sections/recently-viewed.liquid`:
    - El marcado inicial se renderiza con el atributo `hidden` si no hay productos disponibles en servidor.
    - El Web Component lee `localStorage`, excluye el ID/handle del producto actual (si está en PDP para no recomendarse a sí mismo), y si hay elementos guardados, realiza una petición ligera a Shopify Section Rendering API:
      `${routes.search_url}?section_id=${this.sectionId}&type=product&q=${query}`
      (donde `query` busca por IDs `id:X OR id:Y` o handles).
    - Inyecta las tarjetas de producto en el grid reutilizando `snippets/product-card.liquid` con sus swatches y quick buy.
  - Schema de la sección:
    - `"name": "t:sections.recently_viewed.name"`
    - Settings: `heading` (default: "Recently viewed" / "Vistos recientemente"), `eyebrow`, `products_to_show` (range 2 a 8, default 4), `columns_desktop` (range 2 a 4, default 4), `color_scheme`, y toggles para `show_secondary_image`, `show_vendor`, `show_quick_add`.
    - Preset: `"Recently viewed"`.

---

### MÓDULO 3: Capa de Confianza, Inventario y Acordiones PDP
* **En `sections/main-product.liquid` (y soporte en `featured-product.liquid`):**
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

---

### MÓDULO 4: Pulidos de Retención y Accesibilidad
1. **Subsanación de P2-01 en `assets/product-zoom.js`:**
   - En el método `layout()` (líneas 71-86): Si el diálogo está abierto (`this.dialog.open`) y la escala sufre un reajuste (`this.scale` varía por cambio de orientación o resize), invocar `this.announce()` para que la región viva informe de inmediato el porcentaje exacto adaptado.
2. **Anuncio Detallado en Cart Drawer:**
   - En `CartDrawer.addItem` (`assets/theme.js`): Al agregar un artículo con éxito, actualizar la región viva de accesibilidad anunciando el nombre del producto y variante agregada:
     `"Added {{ title }} - {{ variant }} to cart"` / `"Añadido {{ title }} - {{ variant }} al carrito"`.

---

### MÓDULO 5: Localización Bilingüe Estricta (Paridad 100%)
* Incorporar todas las claves nuevas en `locales/en.default.json`, `locales/es.json` y `locales/en.default.schema.json`.
* Comprobar que `npm run gates:locales` y `node harness-ML-001/locale-parity.mjs .` arrojen **0 diferencias y 0 huérfanas**.

---

### MÓDULO 6: Pruebas y Compuertas de Calidad (DoD)
1. `npm run gates:static` debe finalizar con código de salida `0`:
   - Theme Check: 0 ofensas (sin errores ni advertencias, `LiquidComplexity` <= 120).
   - Locales: 100% paridad storefront y schema.
   - Syntax: JS válido.
   - Ledger Verify: 0 incoherencias.
2. Crear o ampliar el arnés de pruebas automatizadas para verificar los nuevos componentes.
3. Asegurar que `assets/product-zoom.js` se mantenga < 12 KB sin minificar.

---

## 3. Protocolo de Entrega

* Trabajar en el árbol de trabajo local **sin hacer commit ni push**.
* Reportar todos los cambios con líneas exactas, comandos y evidencias en:
  `agent-comms/outbox-claude/CLAUDE-REPORT-5C-001.md`.
