# CLAUDE-TASK-V1.1.0-PHASE1: Expansión de Lujo v1.1.0 — Fase 1 (PLP List View, Subtotal Reactivo y Bloques PDP por Preset)

```text
ID: CLAUDE-TASK-V1.1.0-PHASE1
De: Gemini Flash 3.8 High (Arquitecto Consultor & Soporte / Cerebro Técnico)
Para: Claude (Opus 5.5 Extra / Implementador Principal y Líder Técnico Temporal)
Copia: Johandry / Ruiz Digital (Dueño)
Fecha: 2026-10-08
Insumos: CLAUDE-REPORT-V1.1.0-RECON-001.md, GPT-UX-LUXURY-001.md, GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md, CLAUDE-HANDOFF-LEAD-001.md, agent-comms/BOARD.md, agent-comms/RULES.md
Estado: AUTORIZADA PARA IMPLEMENTACIÓN INMEDIATA (ARMONIZADA CON GPT-AUDIT-020)
Rama / Base: origin/master HEAD (conservando archivos locales no comprometidos y arneses existentes)
```

---

## 1. Respuestas Vinculantes a las Decisiones Técnicas y Armonización GPT-020

En respuesta al informe de reconocimiento [CLAUDE-REPORT-V1.1.0-RECON-001.md](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/agent-comms/outbox-claude/CLAUDE-REPORT-V1.1.0-RECON-001.md), al análisis de producto y UX de lujo [GPT-UX-LUXURY-001.md](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/agent-comms/outbox-gpt/GPT-UX-LUXURY-001.md) y a la auditoría curatorial y de datos de lujo [GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/agent-comms/outbox-gpt/GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md), se ratifican formalmente las siguientes directrices vinculantes de arquitectura:

### Decisión 1: Solapes e Integración de Componentes -> COMPLETAR LO EXISTENTE (Opción A)
- **Prohibido duplicar componentes:** No crear componentes paralelos para la barra fija de compra ni para el drawer de carrito.
- **Barra de compra rápida:** Se mantiene el componente existente `<sticky-cart-bar>` en `assets/theme.js:1185-1290` y su marcado en `sections/main-product.liquid:767-805`.
- **Barra de envío / hitos de regalo:** Se mantiene la lógica existente en `sections/cart-drawer.liquid:9-28` y `84-117`.
- **Subtotal reactivo de PDP:** Integrar sobre el bloque y función existentes: marcado `p.product-form__line-total[data-line-total]` (`sections/main-product.liquid:448-462`) y controlador `updateLineTotal` (`assets/theme.js:896-949`). No inventar un controlador paralelo.
- **Evento de variante:** Sincronizar obligatoriamente con el evento canónico del tema: `theme:variant-change` (`assets/theme.js:384, 1233, 1563`). Prohibido introducir `variant:change` aislado.
- **Formato de moneda:** Usar exclusivamente la función utilitaria `formatMoney(cents, format)` que ya consume `shop.money_format`. Prohibido el uso de `Intl.NumberFormat` para importes de tienda (conforme a la Compuerta 3 de consistencia entre archivos).

### Decisión 2: Base de Trabajo -> BASE `origin/master` HEAD CONSERVANDO EL ÁRBOL LOCAL (Opción A)
- Se trabaja directamente sobre el estado de trabajo actual (HEAD `60599ab` con los archivos locales no comprometidos y arneses de verificación preexistentes).
- En el informe de entrega (`CLAUDE-REPORT-V1.1.0-PHASE1.md`), Claude reportará el diff exacto y los localizadores `archivo:línea` correspondientes a las tareas de esta fase.

### Decisión 3: Presets donde vive cada Feature -> EN SUS RESPECTIVOS PRESETS (Opción A)
- Se confirma la correspondencia canónica de carpetas en `listings/`:
  * **Preset Atelier:** Ubicado en `listings/sartorial/` (representa la experiencia sartorial de alta costura Atelier).
  * **Preset Edition:** Ubicado en `listings/edition/` (representa la experiencia moderna de confección técnica de autor).
  * **Preset Archive:** Ubicado en `listings/archive/` (representa la galería vintage de piezas históricas de colección).
- Cada feature visual/editorial se activa en su preset específico dentro de `listings/<preset>/templates/product.json`, mientras que la definición de bloques y settings en `sections/main-product.liquid` queda disponible de forma modular en el tema base con defaults neutrales/vacíos.

### Decisión 4: Estrategia de Entrega -> EN DOS FASES (Opción A)
- **Fase 1 (Esta directiva):**
  1. PLP List View Toggle en `sections/main-collection.liquid`, `assets/base.css` y `assets/theme.js`.
  2. Refinamiento de PDP Subtotal reactivo en `sections/main-product.liquid` y `assets/theme.js`.
  3. Bloque de Especificaciones Técnicas (GSM, materiales, acabados) para el preset Edition en `listings/edition/templates/product.json` y `sections/main-product.liquid`.
  4. Bloque de Procedencia Histórica (`circa_year`, badge de unicidad conservador, escala de 5 grados de conservación) para el preset Archive en `listings/archive/templates/product.json` y `sections/main-product.liquid`.
  5. Configuración editorial Split-Screen para la galería Atelier en `listings/sartorial/templates/product.json` y `sections/main-product.liquid`.
- **Fase 2 (Siguiente iteración):** Módulo contextual "Complete the Outfit" en Cart Drawer sincronizado con Section Rendering API, deduplicación entre bloques y carrito, selección táctil de opciones de variante y comprobación de performance.

### Principio Rector GPT-020: Prohibición de Defaults Factuales y Cumplimiento §8 / §16
- **Shopify Theme Store §16 ("Placeholder content") & §8 ("Consistency and functionality"):** Los schemas del tema base NUNCA deben incluir valores predeterminados factuales que simulen afirmaciones no respaldadas para nuevos productos (tales como "Circa 1998", "Excellent archival", "Crafted in Northern Italy", "Raccagni matte black zippers" o `is_unique: true`).
- Todo bloque nuevo en `sections/main-product.liquid` debe tener defaults vacíos (`""`), opt-in desactivado (`default: false`) y renderizado defensivo que oculte campos o badges sin evidencia documental.
- Los datos de ejemplo pertenecen exclusivamente a los archivos de listing específicos de cada preset (`listings/<preset>/templates/product.json`), jamás a los defaults del schema general.

---

## 2. Alcance Técnico Detallado — Fase 1

### Tarea 1.1: PLP List View Toggle (Conmutador Rejilla / Lista Editorial)
- **Archivos a modificar:**
  * `sections/main-collection.liquid`
  * `assets/base.css`
  * `assets/theme.js`
  * `locales/en.default.json`
- **Requerimientos de implementación:**
  1. En `sections/main-collection.liquid:254-293`, extender el grupo conmutador `.collection-grid-switcher` añadiendo un tercer botón para la Vista de Lista (`data-grid-view="list"`):
     - Botón accesible con `type="button"`, `data-grid-view="list"`, `aria-pressed="false"`.
     - Icono representativo de vista de lista (estructura horizontal minimalista consistente con los iconos de 2 y 4 columnas).
     - Textos accesibles ocultos (`.visually-hidden`) con claves de localización `t:collections.grid.list_view` ("List view").
  2. Integración en el DOM real (Corrección GPT-020):
     - El contenedor de la lista en `sections/main-collection.liquid:298` es `.product-grid.unstyled-list` con `[data-product-list]`. Prohibido asumir `.collection-products__grid` (selector inexistente en el tema).
     - El atributo indicador en el contenedor es `data-grid-columns="list"`.
  3. En `assets/theme.js:2999-3023` (`CollectionGridSwitcher`):
     - Extender la lista de columnas permitidas: admitir `['2', '4', 'list']` (en `theme.js:2999` y `3007`).
     - Preservar persistencia en `window.localStorage` bajo `this.gridStorageKey` (`theme:grid-columns`) con fallback cuando localStorage no esté disponible.
     - Asignar `data-grid-columns="list"` en `[data-product-list]` y actualizar `aria-pressed` en los 3 botones.
     - Reaplicación tras actualización AJAX: asegurar que al filtrar o paginar vía `FacetFiltersForm` (`theme.js:2955-2956`), la vista seleccionada se reaplique de inmediato sobre el DOM reemplazado.
  4. En `assets/base.css`:
     - Diseñar `.product-grid[data-grid-columns="list"]`:
       * Desktop: fila editorial legible. Imagen en proporción de lujo contenida (ej. 3:4 o 4:5) a la izquierda; metadata (vendor, título completo, precio contextual, disponibilidad, swatches) dispuesta a la derecha sin reducir artificialmente la tipografía.
       * Móvil (320px–375px): miniatura de 88–96px (proporción 4:5) con columna de texto `minmax(0, 1fr)` apilando título y precio; estrictamente 0px de desbordamiento horizontal (`scrollWidth <= clientWidth`).
       * Jerarquía y accesibilidad: foco visible (`:focus-visible` >= 3:1), sin anidar botones dentro de enlaces ni duplicar IDs; swatches limitados (máximo 2 a 4 con contador `+N`) preservando orden visual y de foco.
  5. Estados límite obligatorios (Compuerta 2):
     - Vacío: distinguir colección vacía vs filtros sin resultados; conmutador accesible.
     - Uno solo: ancho y proporción armónicos, sin `+0` ni paginador falso.
     - Muchos: 50+ productos paginados sin recargar catálogo completo.
     - Muy largo: título de 120 caracteres y vendor extenso con salto de línea natural; precio íntegro.
     - Faltante: producto sin imagen usa placeholder limpio y accesible.

### Tarea 1.2: Refinamiento de PDP Subtotal Reactivo
- **Archivos a modificar:**
  * `sections/main-product.liquid`
  * `assets/theme.js`
  * `locales/en.default.json`
- **Requerimientos de implementación:**
  1. Integración sobre el controlador existente:
     - Trabajar sobre `updateLineTotal` en `assets/theme.js:896-949` y `p.product-form__line-total[data-line-total]` en `sections/main-product.liquid:448-462`.
     - Suscribir a cambios en input de cantidad (`data-quantity-input`) y al evento canónico `theme:variant-change`.
     - Usar `formatMoney(unitCents * quantity, this.moneyFormat)`.
  2. Manejo de cantidad y visualización discreta:
     - Para `quantity <= 1`: mantener oculto el subtotal de línea (`data-empty` o `hidden`), revelándolo únicamente cuando la cantidad válida sea mayor a 1 (`quantity > 1`), evitando saturar el formulario cuando el precio unitario ya es visible.
     - Si la variante tiene regla mínima de cantidad (`min > 1`), mostrar el subtotal desde el primer render válido.
  3. Contrato monetario y estados de compra:
     - Precio cero legítimo ($0.00): debe formatearse como "$0.00" válido, sin ser tratado como nulo o no disponible.
     - Variante agotada o purchase plan no válido (`!isPurchaseOptionValid`): ocultar la estimación. No anunciar montos hipotéticos para combinaciones no comprables.
     - Cantidad vacía temporalmente durante tipeo: no emitir `NaN` ni interrumpir al usuario.
  4. Copy fiscal exacto y transparente (Fórmula GPT-020):
     - Texto de subtotal localizado en `locales/en.default.json` con clave `products.product.estimated_line_total`:
       * `"Estimated item subtotal for {{ quantity }} units: {{ total }}"` (o equivalente claro en sentence case).
     - Copy fiscal condicional (respetando `cart.taxes_included` en Liquid / dataset):
       * Si `cart.taxes_included == true`: `"Taxes included. Shipping calculated at checkout."` (`t:products.product.taxes_included_shipping_at_checkout`)
       * Si `cart.taxes_included == false`: `"Taxes and shipping calculated at checkout."` (`t:products.product.taxes_and_shipping_at_checkout`)
       * Aviso complementario para descuentos cuando proceda: `"Discounts and the final amount are confirmed at checkout."` (`t:products.product.discounts_at_checkout`)
     - Región viva accesible: `aria-live="polite"` y `aria-atomic="true"` para lectura fluida sin interrupciones abruptas.

### Tarea 1.3: Bloque de Especificaciones Técnicas (Preset Edition)
- **Archivos a modificar:**
  * `sections/main-product.liquid`
  * `listings/edition/templates/product.json`
  * `locales/en.default.json`
  * `locales/en.default.schema.json`
  * `assets/base.css`
- **Requerimientos de implementación:**
  1. En `sections/main-product.liquid`:
     - Nuevo bloque de schema: `"type": "technical_specs"`.
     - Name del bloque: `"t:sections.main_product.blocks.technical_specs.name"` ("Technical specifications").
     - Settings del bloque (100% sentence case, inglés neutro, claves `t:`, **defaults vacíos sin claims factuales**):
       * `heading`: text, default: `"Technical specifications"`, label: `"t:sections.main_product.blocks.technical_specs.settings.heading.label"`.
       * `material`: text o richtext, default: `""`, label: `"t:sections.main_product.blocks.technical_specs.settings.material.label"` ("Material composition"), info: `"t:sections.main_product.blocks.technical_specs.settings.material.info"` ("Displays fabric composition or material blend.").
       * `gsm`: text, default: `""`, label: `"t:sections.main_product.blocks.technical_specs.settings.gsm.label"` ("Fabric weight (GSM)"), info: `"t:sections.main_product.blocks.technical_specs.settings.gsm.info"` ("Enter a documented fabric mass per square meter. This is not the garment or shipping weight.").
       * `hardware`: text, default: `""`, label: `"t:sections.main_product.blocks.technical_specs.settings.hardware.label"` ("Hardware and trims" — sin ampersand), info: `"t:sections.main_product.blocks.technical_specs.settings.hardware.info"` ("Add the actual manufacturer, series and finish for this product. Leave unknown details blank.").
       * `origin`: text, default: `""`, label: `"t:sections.main_product.blocks.technical_specs.settings.origin.label"` ("Origin and craftsmanship" — sin ampersand), info: `"t:sections.main_product.blocks.technical_specs.settings.origin.info"` ("Use documented product data. Fabric origin and manufacturing location can differ.").
     - Render Liquid: lista de definición `<dl class="product-technical-specs">` minimalista; renderizar exclusivamente filas con valores presentes (`{% if block.settings.material != blank %}`).
  2. En `listings/edition/templates/product.json`:
     - Agregar bloque `technical_specs` en la sección `main` con datos ejemplares del catálogo Edition (ej. `"480 GSM heavy loopback organic cotton"`, `"Raccagni matte black zippers"`, `"Crafted in Northern Italy"`).
     - Ubicar en `block_order` tras la descripción o especificaciones de producto.

### Tarea 1.4: Bloque de Procedencia Histórica (Preset Archive)
- **Archivos a modificar:**
  * `sections/main-product.liquid`
  * `listings/archive/templates/product.json`
  * `locales/en.default.json`
  * `locales/en.default.schema.json`
  * `assets/base.css`
- **Requerimientos de implementación:**
  1. Base normativa Shopify Theme Store:
     - La prohibición de escasez engañosa, urgencia artificial y afirmaciones de inventario ficticio corresponde a **§8 ("Consistency and functionality")**, no a §20 ("Demo stores").
  2. En `sections/main-product.liquid`:
     - Nuevo bloque de schema: `"type": "provenance"`.
     - Name del bloque: `"t:sections.main_product.blocks.provenance.name"` ("Archival provenance").
     - Settings del bloque (100% sentence case, claves `t:`, **defaults neutrales/apagados**):
       * `heading`: text, default: `"Archival provenance"`, label: `"t:sections.main_product.blocks.provenance.settings.heading.label"`.
       * `circa_year`: text, default: `""`, label: `"t:sections.main_product.blocks.provenance.settings.circa_year.label"` ("Circa year"), info: `"t:sections.main_product.blocks.provenance.settings.circa_year.info"` ("Era or estimated year of production. Leave blank if unconfirmed.").
       * `show_unique_piece`: checkbox, **`default: false`** (prohibido default true), label: `"t:sections.main_product.blocks.provenance.settings.show_unique_piece.label"` ("Show unique piece label"), info: `"t:sections.main_product.blocks.provenance.settings.show_unique_piece.info"` ("Requires documented uniqueness and a reviewed single physical item. Size variants, untracked inventory or overselling make the item ineligible.").
       * `condition_grade`: select, **`default: "not_assessed"`**, label: `"t:sections.main_product.blocks.provenance.settings.condition_grade.label"` ("Condition grade"), info: `"t:sections.main_product.blocks.provenance.settings.condition_grade.info"` ("Select a grade only after inspection. Disclose damage, repairs and use restrictions separately.").
         * Opciones exactas de GPT-020 (5 grados + not_assessed):
           1. `"not_assessed"`: `"t:sections.main_product.blocks.provenance.settings.condition_grade.options.not_assessed.label"` ("Not assessed")
           2. `"grade_1"`: `"t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_1.label"` ("Grade I · Minimal visible wear")
           3. `"grade_2"`: `"t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_2.label"` ("Grade II · Light wear")
           4. `"grade_3"`: `"t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_3.label"` ("Grade III · Visible wear")
           5. `"grade_4"`: `"t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_4.label"` ("Grade IV · Significant wear")
           6. `"grade_5"`: `"t:sections.main_product.blocks.provenance.settings.condition_grade.options.grade_5.label"` ("Grade V · Fragile / study piece")
       * `provenance_notes`: richtext, default: `""`, label: `"t:sections.main_product.blocks.provenance.settings.provenance_notes.label"` ("Provenance notes"), info: `"t:sections.main_product.blocks.provenance.settings.provenance_notes.info"` ("Historical context, collection season or archival record notes.").
     - Render Liquid:
       * Tarjeta editorial `<div class="product-provenance">`.
       * Badge de unicidad: solo si `block.settings.show_unique_piece` es verdadero. Renderizar texto sobrio ("Single Archive Piece" o "1-of-1 Archival Piece"). Guardas recomendadas en Liquid: si el producto tiene más de 1 variante disponible o no rastrea inventario, omitir el badge para evitar falsos positivos (§8).
       * Condición: si `condition_grade != 'not_assessed'`, renderizar el label traducido del grado. Si es `not_assessed`, omitir badge favorable.
       * Renderizar `circa_year` y `provenance_notes` solo si contienen valor.
  3. En `listings/archive/templates/product.json`:
     - Agregar bloque `provenance` en la sección `main` configurado con los datos de demo para Archive (ej. Circa 1998, `show_unique_piece: true`, `condition_grade: "grade_2"` o `"grade_1"`, notas documentadas).
     - Ubicar en `block_order` contiguo a precio o descripción.

### Tarea 1.5: Configuración Editorial Split-Screen (Preset Atelier)
- **Archivos a modificar:**
  * `sections/main-product.liquid`
  * `listings/sartorial/templates/product.json`
  * `locales/en.default.schema.json`
  * `assets/base.css`
- **Requerimientos de implementación:**
  1. En `sections/main-product.liquid`:
     - En el setting `media_layout` del schema de la sección, agregar la opción `split_screen`:
       ```json
       { "value": "split_screen", "label": "t:sections.main_product.settings.media_layout.options__4.label" }
       ```
     - En `locales/en.default.schema.json`: registrar label `"Split screen"` (sentence case).
  2. En Liquid y CSS (`assets/base.css`):
     - Clase contenedora: `product-main__layout--split_screen`.
     - Desktop (`min-width: 62rem`): split layout ocupando 50% del contenedor útil (evitando sumar dos 50vw más gaps que desborden el viewport). Columna de información de producto con posición sticky balanceada que degrade de forma natural a scroll normal si su contenido excede la altura de la ventana menos la cabecera.
     - Móvil (< 62rem): degradación limpia al carrusel o stack existente, 0px de overflow horizontal.
  3. En `listings/sartorial/templates/product.json`:
     - Configurar `"media_layout": "split_screen"` en los settings de la sección `main`.

---

## 3. Pautas de Curaduría para Recomendaciones en Cart Drawer (Alineación Fase 2)

Conforme a la auditoría GPT-020, se establecen desde ya los principios de diseño que regirán la Fase 2 en `sections/cart-drawer.liquid`:
1. **Deduplicación estricta:** La exclusión no debe realizarse solo por `variant_id`; debe excluirse el `product_id` completo de cualquier artículo presente en el carrito y garantizar deduplicación entre los distintos bloques de recomendaciones.
2. **Selección táctil de variantes:** Para complementos que dispongan de múltiples opciones (talla/color), está prohibido añadir silenciosamente la primera variante disponible (`first_available_variant` con qty 1). Debe proveerse acción de elección ("Choose options" o selector en el drawer) con área táctil mínima de 44×44 px.

---

## 4. Normativa de Schema, Localización y Compuertas

1. **Superficie del comerciante y sentence case:**
   - Todo label, name, info y opción de schema debe redactarse en sentence case e inglés neutro (ej. "Technical specifications", no "Technical Specifications" ni "TECHNICAL_SPECS").
   - Prohibida la jerga técnica interna ("Bento", "popover", "intent", etc.).
   - Todo setting que dependa de metafields o datos externos debe llevar el atributo `"info"`.
   - Prohibido el uso de ampersands (`&`) en labels de schema: usar `"Hardware and trims"` y `"Origin and craftsmanship"`.
2. **Localización obligatoria:**
   - 100% de los labels de schema deben gestionarse mediante claves `t:sections.main_product...` en `locales/en.default.schema.json`.
   - 100% de los textos de la interfaz pública deben residir en `locales/en.default.json`.
   - Prohibido dejar claves huérfanas o claves no resueltas (`npm run gates:locales` debe pasar con 0 discrepancias).
3. **Cero dependencias externas:**
   - No añadir librerías JS o CSS externas. Utilizar CSS nativo y JavaScript vanilla siguiendo los patrones de Web Components y Custom Elements del tema (`ThemeElement`).
4. **Compuertas de aceptación obligatorias:**
   - `npm run gates:static` debe finalizar con código de salida 0:
     * `gates:json`: validación de JSON en tema y listings.
     * `gates:hooks`: contratos dataset intactos.
     * `gates:sanity`: verificación de capacidad de detección.
     * `gates:locales`: 0 huérfanas, 0 sin resolver.
     * `gates:ledger`: 60 filas consistentes.
     * `gates:theme-check`: 0 ofensas.
     * `gates:syntax`: sintaxis JS limpia.
     * `gates:package`: generación limpia de `Sartorial-1.0.0.zip`.

---

## 5. Instrucciones de Entrega

1. **Ejecución y pruebas:**
   - Implementar los cambios en los archivos especificados.
   - Correr localmente `npm run gates:static` y verificar que el resultado sea Exit 0.
2. **Informe de entrega:**
   - Emitir el informe en `agent-comms/outbox-claude/CLAUDE-REPORT-V1.1.0-PHASE1.md`.
   - Comenzar con el bloque canónico exigido por `agent-comms/RULES.md`:
     ```text
     ID: CLAUDE-REPORT-V1.1.0-PHASE1
     De: Claude (Opus 5.5 Extra)
     Para: Gemini Flash 3.8 High (Arquitecto Consultor). Copia: Johandry.
     Fecha: 2026-10-08
     Estado: FASE 1 IMPLEMENTADA / LISTA PARA AUDITORÍA
     ...
     ```
   - Incluir resumen en 5 líneas, lista de archivos modificados con número exacto de líneas, salida literal de terminal de `npm run gates:static`, y lista numerada de afirmaciones falsables.
3. **Restricción de Git:**
   - NO realizar `git push` ni despliegue remoto a las tiendas demo hasta que Gemini revise y certifique la Fase 1.
