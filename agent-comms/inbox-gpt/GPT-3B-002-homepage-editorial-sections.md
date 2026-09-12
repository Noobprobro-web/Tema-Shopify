# Directiva de Implementación: GPT-3B-002 (Secciones Editoriales de Homepage y Armado de Index)

```text
ID: GPT-3B-002
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3B.2 (Sprint 2: Secciones Editoriales de Homepage y Sustitución de Placeholder en Index)
Fecha: 2026-09-12
Estado: AUTORIZADA PARA EJECUCIÓN INMEDIATA TRAS APROBACIÓN DE GPT-3B-001
```

---

## 1. Visión y Propósito

Con el Sprint 3B.1 aprobado sin reservas (tokens CSS, Sticky Cart Bar, Size Guide Modal, Cart Drawer Merchandising y Announcement Bar), iniciamos **Sprint 3B.2: Secciones Editoriales de Homepage**.

El objetivo es codificar en Shopify Liquid y CSS las 5 secciones maestras diseñadas en los blueprints `couture-homepage-sections-1440.svg` y `couture-homepage-sections-390.svg`, sustituyendo definitivamente el `main-placeholder` en `templates/index.json` por una experiencia editorial inmersiva, de alto impacto y de rendimiento ultra-rápido.

---

## 2. Archivos Permitidos y Alcance Cerrado

### Archivos Permitidos:
- `sections/hero-editorial.liquid` (NUEVO: Split Hero asimétrico con media responsive y CTAs dobles).
- `sections/curated-showcase.liquid` (NUEVO: Vitrina curatorial 1+2 con pestañas de colección accesibles).
- `sections/brand-manifesto.liquid` (NUEVO: Cita editorial de gran escala y manifiesto de marca).
- `sections/bento-discovery.liquid` (NUEVO: Cuadrícula Bento asimétrica con bloques de descubrimiento).
- `sections/marquee.liquid` (NUEVO: Cinta continua / ticker editorial con pausa accesible y reduced motion).
- `templates/index.json` (MODIFICAR: Sustituir `main-placeholder` por la secuencia editorial canónica).
- `assets/base.css` (MODIFICAR: Estilos de layout, tipografía y responsive de las nuevas 5 secciones).
- `assets/theme.js` (MODIFICAR: Lógica de pestañas en `curated-showcase` si se requiere web component accesible).
- `locales/en.default.json` (MODIFICAR: Añadir nuevas cadenas para homepage y secciones).
- `agent-comms/outbox-gpt/GPT-3B-002-homepage-editorial-sections.md` (NUEVO: Reporte de entrega).

### Archivos Excluidos:
- `sections/main-product.liquid` y `sections/cart-drawer.liquid` (estabilizados en GPT-3B-001).
- `sections/main-collection.liquid` (reservado para GPT-3B-003).
- `templates/*.json` (plantillas secundarias reservadas para GPT-3B-004).

---

## 3. Especificaciones de las Secciones

### 1. `sections/hero-editorial.liquid` (Editorial Split Hero)
- **Estructura Visual:** Asimétrica (60/40 o 55/45). Imagen editorial dominante a sangre o con margen refinado, acompañada de un panel de texto con `eyebrow`, titular en `Playfair Display`, bajada de texto y dos botones (`primary` y `text/secondary`).
- **Settings:**
  - `image_desktop`, `image_mobile` (con `responsive-image` y `fetchpriority="high"` en la primera imagen).
  - `heading`, `subheading`, `eyebrow`.
  - `button_primary_label`, `button_primary_url`.
  - `button_secondary_label`, `button_secondary_url`.
  - `layout_split`: select (`image_first`, `text_first`).
  - `color_scheme`.

### 2. `sections/curated-showcase.liquid` (Curated Showcase 1+2)
- **Estructura Visual:** Composición 1+2. Una imagen de atmósfera editorial o producto destacado en formato vertical grande, flanqueada por 2 tarjetas de producto (`snippets/product-card.liquid`) apiladas.
- **Pestañas de Colección:**
  - Soporte para hasta 3 colecciones seleccionables como pestañas (`role="tablist"`, `role="tab"`, `role="tabpanel"`) con navegación por teclado accesible.
- **Settings & Blocks:**
  - `heading`, `subheading`, `color_scheme`.
  - Bloques de tipo `collection_tab` (máximo 3) con `collection`, `tab_label`, e imagen editorial representativa.

### 3. `sections/brand-manifesto.liquid` (Brand Manifesto)
- **Estructura Visual:** Sección respirada, centrada o con alineación editorial a la izquierda.
- **Contenido:**
  - Cita editorial destacada en tipografía grande (`font-family: var(--font-heading-family)`, serif fluido).
  - Cita o autor (`eyebrow` con tracking `0.12em`).
  - Enlace de llamado a la acción editorial (*"Read the Atelier Journal"* o *"Our Craft"*).
  - `color_scheme` configurable para crear contrastes de sección (ej. tono `surface` o `scheme-2`).

### 4. `sections/bento-discovery.liquid` (Bento Discovery Grid)
- **Estructura Visual:** Grilla Bento asimétrica moderna (3 a 4 celdas en desktop, carrusel o apilamiento limpio en móvil).
- **Tipos de Celdas (Blocks):**
  - `card_featured`: Tarjeta grande (2 columnas de ancho o vertical) con imagen, título de colección y CTA.
  - `card_editorial`: Tarjeta de texto y atmósfera con fondo tonal.
  - `card_product`: Tarjeta de producto directo.
- **Accesibilidad:** Todo enlace de tarjeta debe tener tap target accesible y labels descriptivos.

### 5. `sections/marquee.liquid` (Editorial Ticker)
- **Estructura Visual:** Cinta horizontal sutil (36-48px de alto) que corre entre secciones editoriales con texto tipográfico y separadores gráficos sutiles (asterisco o rombo de atelier).
- **Accesibilidad:**
  - Velocidad moderada y configurable.
  - Pausa al recibir hover o foco de teclado (`:hover`, `:focus-within`).
  - Si `prefers-reduced-motion: reduce` está activo, se muestra de forma estática sin animación.

### 6. Configuración de `templates/index.json`
- Sustituir `main-placeholder` por la composición canónica de las nuevas secciones con presets por defecto listos para previsualización inmediata.

---

## 4. Criterios de Aceptación y Validación

1. `node --check assets/theme.js` retorna código `0`.
2. `npx shopify theme check` reporta **0 ofensas** en todos los archivos.
3. Todas las cadenas de storefront están en `locales/en.default.json` (cero cadenas en inglés hardcodeadas en Liquid).
4. La navegación por pestañas en `curated-showcase` y el ticker de `marquee` respetan accesibilidad y WCAG 2.2 AA.
5. Tap targets >= 44x44px en todos los botones y enlaces interactivos.
6. Informe entregado en `agent-comms/outbox-gpt/GPT-3B-002-homepage-editorial-sections.md`.
7. **No realizar commit ni push.**
