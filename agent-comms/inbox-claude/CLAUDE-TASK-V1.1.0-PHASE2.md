# CLAUDE-TASK-V1.1.0-PHASE2: Expansión de Lujo v1.1.0 — Fase 2 (Recomendaciones en Cart Drawer "Complete the Outfit", Selector Táctil de Variantes y Contratos de Datos)

```text
ID: CLAUDE-TASK-V1.1.0-PHASE2
De: Gemini Flash 3.8 High (Arquitecto Consultor & Soporte / Cerebro Técnico)
Para: Claude (Opus 5.5 Extra / Implementador Principal y Líder Técnico Temporal)
Copia: Johandry / Ruiz Digital (Dueño)
Fecha: 2026-10-08
Insumos: GPT-REPORT-021-CART-DRAWER-RECOMMENDATIONS.md, GPT-AUDIT-020-LUXURY-DATA-AND-UX-AUDIT.md, CLAUDE-REPORT-V1.1.0-PHASE1.md, CLAUDE-AUTH-V1.1.0-SNIPPETS-001.md, agent-comms/BOARD.md, agent-comms/RULES.md
Estado: AUTORIZADA PARA IMPLEMENTACIÓN INMEDIATA (DICTAMEN GPT-021 APROBADO)
Autorización Arquitectónica Nivel 2: GEMINI-AUTH-V1.1.0-SNIPPET-CART-RECOMMENDATIONS-001 CONCEDIDA
Rama / Base: origin/master HEAD (conservando árbol local y arneses existentes)
```

---

## 1. Contexto, Dictamen de Aprobación y Resoluciones Arquitectónicas Nivel 2

El dictamen maestro [GPT-REPORT-021-CART-DRAWER-RECOMMENDATIONS.md](file:///c:/Users/Johan/OneDrive/Documentos/Drive/Tema%20Shopify/agent-comms/outbox-gpt/GPT-REPORT-021-CART-DRAWER-RECOMMENDATIONS.md) ha sido auditado y aprobado formalmente en sus tres tracks:
1. **Curaduría de Lujo y Variantes (Track 1):** Eliminación del antipatrón "1-click a ciegas" mediante una triada estricta: adición directa para variantes únicas, selector inline táctil accesible (mínimo 44×44 px) para prendas con hasta 2 opciones, y enlace semántico a PDP ("View product") para productos complejos.
2. **Cascada de Datos, Concurrencia y Estados Degenerados (Track 2):** Cascada jerárquica: Metafield del ancla → Recomendaciones complementarias nativas → Bloques manuales → Colección curada. Deduplicación estricta contra items del carrito y candidatos vistos, algoritmo de Prenda Ancla (`highest original_price`), protección contra race conditions (`interactionFrozen`, generación de recomendaciones) y preservación del borrador de `cart.note`.
3. **Superficie del Comerciante y Theme Store (Track 3):** Sustitución del default literal erróneo "Complimentary Additions" por clave localizada `t:` en sentence case ("Complementary products"), 3 nuevos settings opcionales en schema con descripciones explicativas (`info`), y paridad bilingüe completa en `en.default.json` y `es.json`.

### Autorizaciones Expresas de Desviación Nivel 2 (Gemini Flash 3.8 High)
Conforme a `agent-comms/RULES.md`, se autorizan explícitamente las siguientes decisiones de Nivel 2:
1. **Modularización Obligatoria en Snippet Dedicado (`snippets/cart-drawer-recommendations.liquid`):**
   - **Razón Arquitectónica:** Para evitar repetir la violación de `LiquidComplexity` (>120) que ocurrió en `sections/main-product.liquid`, está **terminantemente prohibido** incrustar la lógica expandida de cascada, prenda ancla, deduplicación y selector de variantes directamente en `sections/cart-drawer.liquid`.
   - Se crea el snippet modular `snippets/cart-drawer-recommendations.liquid` y se renderiza en `sections/cart-drawer.liquid` mediante:
     ```liquid
     {% render 'cart-drawer-recommendations', section: section, cart: cart %}
     ```
2. **Ampliación de Schema en `sections/cart-drawer.liquid`:**
   - Se autoriza la incorporación de 3 nuevos checkboxes en el schema (`show_complementary_products`, `use_product_metafield`, `use_search_discovery`) preservando los 6 settings existentes y el bloque `cross_sell_product` (límite 2).
   - Se autoriza la actualización del default de `cross_sell_heading` hacia la clave `"t:sections.cart_drawer.settings.cross_sell_heading.default"`.
3. **Presupuesto de Escaneo en Colección Curada:**
   - En la colección de respaldo, se autoriza evaluar hasta 50 productos en orden editorial para encontrar hasta 2 recomendaciones elegibles tras descartar productos presentes en el carrito y productos no disponibles.

---

## 2. Alcance Técnico Detallado — Fase 2

### Tarea 2.1: Snippet Modular de Recomendaciones y Render en `sections/cart-drawer.liquid`
- **Archivos a crear / modificar:**
  * `snippets/cart-drawer-recommendations.liquid` (NUEVO)
  * `sections/cart-drawer.liquid`
- **Requerimientos de implementación:**
  1. **Algoritmo de la Prenda Ancla (*Anchor Item*):**
     - Si el carrito está vacío o no contiene líneas válidas, el módulo no se renderiza.
     - En carritos multi-producto, la prenda ancla se determina por el **mayor `line_item.original_price` unitario contextual** (anterior a descuentos de línea o de carrito).
     - Exclusiones de ancla: gift cards (`item.gift_card`), items con precio original no finito o <= 0.
     - Desempate intra-producto: `variant_id` ascendente. Desempate entre productos: `product_id` ascendente.
     - Si no existe un ancla positiva conocida, se omiten las fuentes contextuales dinámicas y se evalúan directamente los bloques manuales o la colección.
  2. **Cascada de 4 Fuentes en Orden Estricto:**
     - **Fuente 1 — Metafield de Producto del Ancla:** Si `section.settings.use_product_metafield == true` y la prenda ancla posee el metafield `custom.complementary_products` (de tipo `list.product_reference`), se evalúan sus referencias ordenadas (hasta un presupuesto máximo de 10).
     - **Fuente 2 — Recomendaciones Complementarias Nativas:** Si `section.settings.use_search_discovery == true`, se habilita la consulta/renderizado nativo de complementos de Shopify (Search & Discovery) para el ID del ancla con `intent=complementary`.
     - **Fuente 3 — Bloques Manuales de Tema:** Bloques `cross_sell_product` configurados por el comerciante en la sección (hasta 2 bloques).
     - **Fuente 4 — Colección Curada de Respaldo:** Si `section.settings.cross_sell_collection != blank`, se escanean sus productos (hasta 50) para cubrir huecos vacíos.
     - **Regla de oro de fallback:** La presencia de bloques en el editor NO debe bloquear la colección si los bloques están vacíos, agotados o sus productos ya están en el carrito. Cada fuente rellena huecos disponibles hasta alcanzar exactamente el **límite máximo de 2 productos únicos**.
  3. **Deduplicación Estricta:**
     - `inCart`: Colección de todos los `product_id` presentes en el carrito (cualquiera sea su variante, plan o propiedades).
     - `seen`: Registro común de IDs de producto ya seleccionados entre las distintas fuentes.
     - Ningún producto presente en el carrito ni ningún producto repetido puede mostrarse.
     - Si tras filtrar todas las fuentes el conteo final de recomendaciones elegibles es 0:
       * Ocultar por completo la sección, el encabezado y cualquier divisor. Cero markup residual, cero CLS.
  4. **Contenedor y Atributos de Hook:**
     - Contenedor con clase semántica: `<section class="cart-cross-sell" aria-labelledby="CartCrossSellHeading-{{ section.id }}" data-cart-cross-sell>`.
     - Encabezado configurable con fallback localizado: `section.settings.cross_sell_heading`.
     - Cada tarjeta renderiza con `data-cross-sell-item` y `data-product-id="{{ product.id }}"`.

---

### Tarea 2.2: Interacción Táctil de Variantes, Prevención de Carreras y `cart.note`
- **Archivos a modificar:**
  * `snippets/cart-drawer-recommendations.liquid`
  * `assets/theme.js`
- **Requerimientos de implementación:**
  1. **Clasificación de Productos y Acción (Flujos A, B y C):**
     - **Flujo A — Adición Directa 1-Click:**
       * Aplica si `product.has_only_default_variant == true`, está en stock (`available == true`), no requiere selling plan obligatorio (`product.requires_selling_plan == false`), no requiere propiedades personalizadas obligatorias y la cantidad 1 cumple sus `quantity_rule`.
       * Renderiza botón directo `data-cross-sell-add` con `data-variant-id="{{ variant.id }}"`. Al pulsar, añade 1 unidad al carrito.
     - **Flujo B — Selector Inline de Variantes (Choose Options):**
       * Aplica para productos con hasta 2 opciones (ej. Talla, Color).
       * Botón de despliegue: `type="button"`, `data-cross-sell-expand`, `aria-expanded="false"`, texto `"Choose options"` (`t:sections.cart.choose_options`).
       * Panel colapsable dentro de la propia tarjeta (dentro de `cart-drawer__scroll`).
       * **Prohibido modales anidados** que atrapen el foco o compitan con el panel del drawer.
       * Marcado semántico accesible: `<fieldset>` con `<legend>`, y radios nativos con labels estilizados como chips táctiles.
       * **Área táctil mínima:** Cada chip debe medir al menos **44 × 44 CSS px** (norma del proyecto y WCAG 2.5.5 AAA).
       * **Sin preselección a ciegas:** No preseleccionar talla o color por defecto. El usuario debe elegir activamente.
       * Matriz de combinaciones en vivo:
         - Actualizar reactivamente la disponibilidad de combinaciones al seleccionar una opción.
         - Si una combinación no existe o está agotada, marcar el estado visual/accesible y deshabilitar el botón de compra.
         - Actualizar precio e imagen miniatura cuando se complete una combinación de variante válida.
         - Habilitar botón `data-cross-sell-add` únicamente con combinación válida y disponible.
       * Botón de repliegue `"Cancel"` (`t:sections.cart.cancel_options`): repliega el selector y devuelve el foco al botón "Choose options" sin cerrar el drawer ni alterar el carrito.
     - **Flujo C — Enlace Directo a PDP (View Product):**
       * Aplica para productos con más de 2 opciones independientes, planes de venta/suscripciones, campos de grabado/personalización obligatorios o tarjetas de regalo.
       * Renderiza enlace semántico a PDP: `<a class="button button--secondary" href="{{ product.url }}">` con texto `"View product"` (`t:sections.cart.view_product`).
  2. **Concurrencia, Prevención de Race Conditions y Respuestas Tardías en `assets/theme.js`:**
     - Integrar sobre el protocolo existente de `CartDrawer` (`beginMutation`, `endMutation`, `syncRevision`, `requestController`).
     - **Aislamiento de Controladores:** Mantener `crossSellController` (AbortController) exclusivo para peticiones de recomendaciones / complementarias, independiente de los controladores de mutación POST.
     - **Congelación de Interacción (`interactionFrozen`):**
       * Si el usuario inicia interacción con un selector de variantes en una tarjeta (evento `focusin`, `pointerdown` o `change` en radios), se activa la bandera `interactionFrozen = true`.
       * Toda respuesta de red tardía (GET de recomendaciones o fallback) que llegue mientras `interactionFrozen == true` se **descarta de inmediato** sin tocar el DOM, sin sobrescribir opciones y sin mover el foco del usuario.
       * La bandera se libera únicamente al cancelar/cerrar explícitamente el selector o tras una mutación exitosa que reemplace el carrito de forma controlada.
     - **Respuestas Inciertas de Red:**
       * Un error de timeout, red o HTML inesperado en un POST de adición de recomendación nunca debe generar un reintento automático (`auto-retry`).
       * En caso de estado incierto, mostrar mensaje accesible `"We could not confirm the update."` (`t:sections.cart.update_unconfirmed`) con botón de acción `"Check cart"` (`t:sections.cart.check_cart`) que dispara `syncCart()`.
  3. **Preservación Robusta de Notas de Pedido (`cart.note`):**
     - Al tipear en el textarea de notas (`name="note"`), incrementar versión local del borrador y marcar `data-dirty="true"`.
     - En cualquier re-renderizado del drawer (`renderSection`), preservar el valor del borrador y restaurarlo directamente en `nextNote.value` (sin concatenar ni interpolar en HTML crudo).
     - Si el comprador navega a "View product" con nota dirty, guardar la nota de forma síncrona vía POST a la ruta localizada `routes.cart_url + '/update.js'` con `{ note: value }` antes de navegar, anunciando el estado `"Saving your cart note…"` (`t:sections.cart.saving_note`).

---

### Tarea 2.3: Actualización de Schema y Locales Bilingües (EN y ES)
- **Archivos a modificar:**
  * `sections/cart-drawer.liquid`
  * `locales/en.default.schema.json`
  * `locales/en.default.json`
  * `locales/es.json`
- **Requerimientos de implementación:**
  1. **Schema en `sections/cart-drawer.liquid`:**
     - Conservar exactamente los 6 settings existentes: `color_scheme`, `enable_tiered_progress`, `free_shipping_threshold`, `atelier_gift_threshold`, `cross_sell_heading`, `cross_sell_collection`.
     - Actualizar default de `cross_sell_heading`:
       ```json
       {
         "type": "text",
         "id": "cross_sell_heading",
         "label": "t:sections.cart_drawer.settings.cross_sell_heading.label",
         "default": "t:sections.cart_drawer.settings.cross_sell_heading.default"
       }
       ```
     - Añadir los 3 settings aprobados:
       ```json
       {
         "type": "checkbox",
         "id": "show_complementary_products",
         "label": "t:sections.cart_drawer.settings.show_complementary_products.label",
         "info": "t:sections.cart_drawer.settings.show_complementary_products.info",
         "default": true
       },
       {
         "type": "checkbox",
         "id": "use_product_metafield",
         "label": "t:sections.cart_drawer.settings.use_product_metafield.label",
         "info": "t:sections.cart_drawer.settings.use_product_metafield.info",
         "default": false
       },
       {
         "type": "checkbox",
         "id": "use_search_discovery",
         "label": "t:sections.cart_drawer.settings.use_search_discovery.label",
         "info": "t:sections.cart_drawer.settings.use_search_discovery.info",
         "default": false
       }
       ```
     - En el bloque `cross_sell_product`: conservar `limit: 2` y actualizar `info` en el setting `product`.
  2. **Schema Locales en `locales/en.default.schema.json`:**
     - Incorporar y validar las 20 referencias de schema bajo `sections.cart_drawer`:
       * `enable_tiered_progress.label`: `"Show free shipping and gift progress"`
       * `free_shipping_threshold.label`: `"Free shipping amount"`
       * `free_shipping_threshold.info`: `"Match your actual shipping rates and eligible markets in Settings > Shipping and delivery. This amount does not create a shipping rate, make express shipping free, or guarantee eligibility at checkout."`
       * `atelier_gift_threshold.label`: `"Gift amount"`
       * `atelier_gift_threshold.info`: `"Match an actual gift offer and its eligibility conditions. Configure any required products and discounts in Shopify. This amount does not add a gift or create a discount."`
       * `show_complementary_products.label`: `"Show complementary products"`
       * `show_complementary_products.info`: `"Shows up to two eligible products when the cart has items. Products already in the cart are excluded. Choose products below to use this feature without an app."`
       * `cross_sell_heading.label`: `"Complementary products heading"`
       * `cross_sell_heading.default`: `"Complementary products"`
       * `use_product_metafield.label`: `"Use product-specific selections"`
       * `use_product_metafield.info`: `"In Settings > Custom data > Products, define custom.complementary_products as a list of product references, then choose products on each product page in the admin. Eligible selections for the main product in the cart take priority over the sources below."`
       * `use_search_discovery.label`: `"Use Shopify complementary recommendations"`
       * `use_search_discovery.info`: `"Optional. Uses complementary products configured in Shopify Search and Discovery after eligible product-specific selections. Products selected below are used when results are unavailable. No app installation is required for manual selections."`
       * `cross_sell_collection.label`: `"Collection to suggest from"`
       * `cross_sell_collection.info`: `"Fills remaining spaces after eligible product-specific selections, Shopify recommendations, and products selected below. Only available products outside the cart are shown."`
       * `blocks.cross_sell_product.name`: `"Suggested product"`
       * `blocks.cross_sell_product.settings.product.info`: `"Products without customer-selectable options can be added directly. Other products require an option selection or a visit to the product page. Duplicate products and products already in the cart are excluded."`
  3. **Storefront Locales en `locales/en.default.json` y `locales/es.json` (Paridad 100%):**
     - En `sections.cart`, actualizar `complimentary_additions` a `"Complementary products"` (EN) y `"Productos complementarios"` (ES).
     - Incorporar bajo `sections.cart`:
       * `choose_options`: EN `"Choose options"` | ES `"Elegir opciones"`
       * `choose_options_product`: EN `"Choose options for {{ product }}"` | ES `"Elegir opciones para {{ product }}"`
       * `select_option`: EN `"Select {{ option }}"` | ES `"Seleccionar {{ option }}"`
       * `view_product`: EN `"View product"` | ES `"Ver producto"`
       * `view_product_for`: EN `"View {{ product }}"` | ES `"Ver {{ product }}"`
       * `options_unavailable`: EN `"This combination is unavailable."` | ES `"Esta combinación no está disponible."`
       * `adding`: EN `"Adding…"` | ES `"Añadiendo…"`
       * `cancel_options`: EN `"Cancel"` | ES `"Cancelar"`
       * `update_unconfirmed`: EN `"We could not confirm the update."` | ES `"No pudimos confirmar la actualización."`
       * `check_cart`: EN `"Check cart"` | ES `"Comprobar carrito"`
       * `saving_note`: EN `"Saving your cart note…"` | ES `"Guardando la nota del pedido…"`
       * `note_save_unconfirmed`: EN `"We could not confirm that your cart note was saved."` | ES `"No pudimos confirmar si la nota del pedido se guardó."`

---

### Tarea 2.4: Estilos CSS Modulares en `assets/base.css`
- **Archivos a modificar:**
  * `assets/base.css`
- **Requerimientos de implementación:**
  1. **Confinamiento en Scroll:**
     - La sección `.cart-cross-sell` y sus tarjetas `.cart-cross-sell__item` residen estrictamente dentro de `.cart-drawer__scroll`.
     - La apertura de selectores inline de variantes (`[data-cross-sell-options]`) expande el flujo de scroll interno de la lista, **sin empujar ni ocultar el pie fijo (`.cart-drawer__footer`)**.
  2. **Chips de Variantes Accesibles:**
     - Targets táctiles de selección con un mínimo de **44 × 44 CSS px** (padding y min-height adecuados).
     - Estado `:focus-visible` nítido con contraste >= 3:1.
     - Indicador visual y semántico de combinaciones no disponibles (borde punteado / tachado accesible, pero disponibilidad textual comunicada en leyenda/etiqueta).
  3. **Responsividad de Extremo a Extremo (320px–1440px):**
     - En pantallas angostas (320px y 375px), reflow limpio y fluido de títulos largos y precios, con estricto `scrollWidth <= clientWidth` (0px de overflow horizontal en el panel del drawer).
     - Tipografía y contrastes en riguroso cumplimiento de WCAG 2.2 AA.

---

## 3. Compuertas de Calidad Obligatorias (DoD de RULES.md)

Ninguna entrega de Fase 2 se da por completada si falla cualquiera de estas condiciones:
1. **Compuerta de Requisitos (Ledger Vivo):** Declarar archivos y líneas exactas en el informe de entrega.
2. **Compuerta de Estados Degenerados:** Probar los 5 estados límite:
   - *Vacío:* Carrito sin items -> 0 peticiones, 0 recomendaciones, sin heading.
   - *Uno solo:* 1 producto en carrito con/sin recomendaciones.
   - *Muchos:* Carrito lleno, catálogo extenso -> máximo 2 productos únicos recomendados.
   - *Muy largo:* Título de 120 caracteres -> salto de línea natural a 320px sin overflow.
   - *Faltante:* Producto sin imagen o con variante agotada -> placeholder neutro y selección explícita obligatoria.
3. **Compuerta de Consistencia:** Uso exclusivo de `shop.money_format` / `formatMoney` (cero `Intl` paralelo), tokens CSS existentes, paridad 100% bilingüe.
4. **Compuerta de Superficie del Comerciante:** 100% sentence case, claves `t:`, atributos `info` explicativos en settings con dependencias externas, cero jerga interna técnica.
5. **Compuertas Estáticas Verificables:**
   - Ejecutar `npm run gates:static` y verificar resultado **Exit 0**:
     * `gates:json`: 534+ JSON válidos.
     * `gates:hooks`: contratos de dataset intactos.
     * `gates:sanity`: 3/3 mutaciones detectadas.
     * `gates:locales`: 0 claves huérfanas, 0 sin resolver.
     * `gates:ledger`: 60 filas verificadas.
     * `gates:theme-check`: **0 ofensas en Theme Check**.
     * `gates:syntax`: sintaxis JS limpia.
     * `gates:package`: empaquetado de `Sartorial-1.0.0.zip` exitoso.

---

## 4. Instrucciones de Entrega para Claude

1. Implementar las 4 tareas descritas en los archivos autorizados.
2. Ejecutar localmente `npm run gates:static` para certificar el estado 100% verde (Exit 0).
3. Redactar el informe estructurado en `agent-comms/outbox-claude/CLAUDE-REPORT-V1.1.0-PHASE2.md` con:
   - Encabezado canónico con ID de tarea y emisor.
   - Resumen ejecutivo en 5 líneas.
   - Lista detallada de archivos tocados con números exactos de línea.
   - Salida literal de `npm run gates:static`.
   - Lista de afirmaciones falsables numeradas demostrando el cumplimiento de cada requisito.
4. **Restricción:** No realizar `git push` ni despliegue remoto hasta la revisión y validación formal de Gemini.
