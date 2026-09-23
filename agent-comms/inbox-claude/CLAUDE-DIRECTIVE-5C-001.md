# CLAUDE-DIRECTIVE-5C-001: Track 1 - Mega Menú Editorial y Pulido P2-01 (Sprint 5C)

```text
ID: CLAUDE-DIRECTIVE-5C-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-23
Estado: DIRECTIVA TÉCNICA VINCULANTE (SPRINT 5C - TRACK 1)
Alcance asignado: Mega Menú Editorial Multicolumna en Cabecera + Pulido P2-01 en product-zoom.js
Track paralelo: GPT-6 Sol Max ejecuta el Track 2 (PDP Confianza, Inventario y Recently Viewed)
```

---

## 1. Contexto y Reparto de Trabajo

Para maximizar la velocidad y aprovechar la máxima capacidad de razonamiento de ambos modelos (Opus 5.5 Extra y GPT-6 Sol Max), Johandry ha dividido el Sprint 5C en dos tracks paralelos sin colisión de archivos:
- **Track 1 (Claude):** Arquitectura de Navegación Editorial en Cabecera (`header.liquid`, `snippets/mega-menu.liquid`) y Pulido P2-01 en `assets/product-zoom.js`.
- **Track 2 (GPT-6):** Merchandising en PDP (Inventario reactivo, acordiones de sastrería) y sección de Productos Vistos Recientemente (`recently-viewed.liquid`).

---

## 2. Especificación Técnica de Implementación (Track 1)

### A. Mega Menú Editorial en Cabecera (`sections/header.liquid` y `snippets/mega-menu.liquid`)
* **Control de Complejidad:**
  - Extraer el marcado y lógica del mega menú al snippet `snippets/mega-menu.liquid` para que `sections/header.liquid` mantenga su `LiquidComplexity` holgadamente bajo el límite de Theme Check.
* **Bloques de Schema en `header.liquid`:**
  - Tipo de bloque: `mega_menu_promo` (nombre: `t:sections.header.blocks.mega_menu_promo.name`).
  - Settings:
    - `menu_item`: `text`, label: `t:sections.header.blocks.mega_menu_promo.settings.menu_item.label`, info: `t:sections.header.blocks.mega_menu_promo.settings.menu_item.info` (nombre del enlace de 1er nivel que activa el mega menú, ej. "Catalog" o "Catálogo", insensible a mayúsculas).
    - `image_1`: `image_picker`, label `t:sections.header.blocks.mega_menu_promo.settings.image_1.label`.
    - `heading_1`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.heading_1.label`.
    - `subheading_1`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.subheading_1.label`.
    - `link_1`: `url`, label `t:sections.header.blocks.mega_menu_promo.settings.link_1.label`.
    - `image_2`: `image_picker`, label `t:sections.header.blocks.mega_menu_promo.settings.image_2.label`.
    - `heading_2`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.heading_2.label`.
    - `subheading_2`: `text`, label `t:sections.header.blocks.mega_menu_promo.settings.subheading_2.label`.
    - `link_2`: `url`, label `t:sections.header.blocks.mega_menu_promo.settings.link_2.label`.
* **Renderizado y Estructura en Grid:**
  - Si un enlace de 1er nivel tiene subenlaces (`link.links != blank`) y coincide con un bloque `mega_menu_promo` (o tiene 3 niveles de navegación):
    - Se despliega a ancho completo del contenedor como `.desktop-nav__mega-menu`.
    - **Área de Categorías (Izquierda/Centro):** Cada enlace de 2º nivel encabeza una columna (`<a class="mega-menu__column-title">`), y sus enlaces de 3er nivel se listan debajo (`<ul class="mega-menu__sublist">`).
    - **Área Promocional (Derecha):** Hasta 2 tarjetas editoriales con imagen en proporción vertical de lujo (4:5 o 3:4), `loading="lazy"`, tipografía estilizada y enlaces con tap targets >= 44 px.
  - Si el enlace solo tiene un nivel de hijos sin bloque promocional asociado, conserva el dropdown clásico `.desktop-nav__panel`.
  - En móvil (`mobile-nav`), mantener el acordeón jerárquico actual sin alteraciones para preservar la ergonomía táctil intacta.
  - **Accesibilidad:** Cero trampas de foco; navegación limpia con `Tab`; cierre inmediato con tecla `Escape`; sincronización reactiva de `aria-expanded` mediante `<theme-disclosure>`. Cero JS adicional.

### B. Pulido P2-01 en `assets/product-zoom.js`
* En `layout()` (líneas 71-86):
  - Guardar `const previousScale = this.scale;`.
  - Tras calcular la escala ajustada y ejecutar `apply()`:
    - Si `this.dialog.open && this.scale !== previousScale`, invocar `this.announce();`.
  - Esto garantiza que al girar el dispositivo o redimensionar la ventana con zoom activo, la región viva anuncie de inmediato el porcentaje exacto reajustado (subsanando el hallazgo de GPT-6 Sol Max).
  - Mantener `assets/product-zoom.js` estrictamente < 12 KB sin minificar.

### C. Estilos CSS en `assets/base.css`
* Añadir al final de `assets/base.css` el bloque claramente delimitado:
  `/* -------------------------------------------------------------------------- */`
  `/* 5C-001. Mega Menú Editorial Multicolumna                                   */`
  `/* -------------------------------------------------------------------------- */`
  - Clases: `.desktop-nav__mega-menu`, `.mega-menu__grid`, `.mega-menu__columns`, `.mega-menu__column`, `.mega-menu__promos`, `.mega-menu__promo-card`, etc.
  - Diseñado con variables semánticas existentes (`--space-*`, `--color-*`, `--font-*`).

### D. Localización (Locales)
* Añadir claves bilingües con paridad total en `locales/en.default.json`, `locales/es.json` y `locales/en.default.schema.json` bajo el espacio de nombres `sections.header.*`.

---

## 3. Protocolo de Entrega

* Trabajar en el árbol de trabajo local **sin hacer commit ni push**.
* Reportar todos los cambios con líneas exactas, comandos y evidencias en:
  `agent-comms/outbox-claude/CLAUDE-REPORT-5C-001.md`.
