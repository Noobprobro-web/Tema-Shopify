# CLAUDE-DIRECTIVE-5A-001: Sprint 5A - Quick Buy Interactivo y Swatches Nativos en Tarjetas y Filtros

```text
ID: CLAUDE-DIRECTIVE-5A-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Auditor Senior de Producto: GPT-5.6 Sol Max
Fecha: 2026-09-22
Estado: DIRECTIVA TÉCNICA VINCULANTE (Fase 5A - Luxury Commerce)
Branch: master (Upstream en e4cd0f2)
```

---

## 1. Contexto Estratégico y Meta del Sprint

Con la finalización y aprobación de la auditoría de localización (`LOCALE-AUDIT-001`), la paridad bilingüe en español está certificada en la tienda en vivo (`Couture` #165809488115). 

La auditoría senior de producto y viabilidad comercial (`GPT-AUDIT-003-presets-and-roadmap.md`) determinó que para competir exitosamente y defender el precio de **$380-$400** en la Shopify Theme Store frente a los referentes consolidados ([Prestige](https://themes.shopify.com/themes/prestige/presets/prestige), [Focal](https://themes.shopify.com/themes/focal/presets/focal), [Impulse](https://themes.shopify.com/themes/impulse/presets/impulse)), las siguientes dos funcionalidades son **Prioridad P0 Comercial Inmediata**:

1. **Quick Buy Interactivo con selector de tallas y variantes en tarjetas de producto:** Elimina la fricción de navegación al PDP, permitiendo añadir tallas específicas al carrito directamente desde la cuadrícula de colección, búsqueda y recomendaciones.
2. **Swatches Nativos de Color/Material en tarjetas y filtros facetados:** Renderiza muestras visuales basadas en la categoría nativa de Shopify (`value.swatch`), sincronizadas con el cambio de imagen de la tarjeta y compartiendo estado de variante con el Quick Buy.

Ambas características deben implementarse con estándares de alta costura digital: cero librerías externas, Web Components puros sobre `ThemeElement`, estricto cumplimiento de accesibilidad WCAG 2.2 AA (hitbox >= 44×44px, navegación por teclado, focus trap, live regions) y 0 ofensas en Theme Check.

---

## 2. Especificación Técnica de Arquitectura

### Frente 1: Quick Buy con Selector de Tallas en Tarjeta de Producto (`snippets/product-card.liquid`, `assets/theme.js`, `assets/base.css`)

#### Comportamiento Funcional y Estados:
1. **Productos de Variante Única (`card_product.has_only_default_variant`):**
   - Mantiene la compra directa de 1 clic existente con botón "Añadir al carrito" (`products.product.add_to_cart`), con loading spinner y apertura automática del `CartDrawer`.
2. **Productos con Múltiples Variantes (p. ej. Tallas XS, S, M, L, XL o Talla + Color):**
   - Cuando `show_quick_add: true`, el botón de la tarjeta actúa como disparador de compra rápida (`Quick Buy` / `Añadir`).
   - Al interactuar (clic en escritorio o tap en móvil):
     - **En Escritorio (>= 768px):** Revela de forma limpia y fluida (slide-up o popover accesible sobre la base de la tarjeta) una botonera interactiva de tallas/opciones.
     - **En Móvil (< 768px):** Presenta un selector táctil optimizado (drawer inferior compacto / bottom sheet o panel desplegable accesible) con áreas de toque de al menos 44×44px.
   - **Botones de Talla/Variante:**
     - **Variante Disponible:** Botón interactivo con el valor de la opción (`XS`, `S`, `M`, etc.). Al hacer clic, envía la petición AJAX a `/cart/add.js` mediante el mecanismo global interceptado por `CartDrawer` (`data-cart-add-form`), muestra feedback de carga (`aria-busy="true"`), y abre inmediatamente el `CartDrawer` con foco en el producto añadido.
     - **Variante Agotada:** Se renderiza deshabilitada (`disabled`, `aria-disabled="true"`), con indicación visual elegante (línea diagonal sutil o tachado y texto para lector de pantalla: "Agotado").
   - **Productos con Opciones Complejas / Planes de Suscripción:**
     - Si el producto requiere un plan de venta obligatorio (`requires_selling_plan == true`), personalización obligatoria o tiene más de 3 opciones complejas, degrada elegantemente a un botón secundario "Ver opciones" (`products.product.choose_options`) que enlaza al PDP.
3. **Accesibilidad y Foco:**
   - Atributos semánticos: `aria-expanded="false"`, `aria-haspopup="dialog"`, `aria-controls`.
   - Cierre con tecla `Escape` o clic fuera del área del selector, devolviendo el foco inmediatamente al botón disparador.
   - Navegación por teclado completa (Tab, Flechas, Espacio, Enter).

---

### Frente 2: Swatches Nativos de Color/Material en Tarjeta (`snippets/product-card.liquid`, `assets/theme.js`, `assets/base.css`)

#### Comportamiento Funcional:
1. **Detección Nativa:**
   - Detectar si el producto tiene una opción con swatches nativos (`value.swatch.color` o `value.swatch.image`) o cuyo nombre sea "Color", "Colour", "Coloris", "Farbe", "Material".
2. **Renderizado de Muestras:**
   - Renderizar una fila horizontal de swatches (`.product-card__swatches`) entre la imagen y el título, o sobre el pie de la tarjeta:
     - Si existe `value.swatch.image`: muestra la imagen miniatura del swatch.
     - Si existe `value.swatch.color`: muestra el color hexadecimal nativo.
     - Fallback de color: mapeo CSS basado en el handle del valor (`black`, `white`, `bone`, `olive`, `navy`, etc.).
   - Si el producto tiene más de 4 colores, mostrar los primeros 4 y un pill sutil con `+N` (p. ej. `+2`) que enlaza al PDP.
3. **Interacción y Cambio de Imagen:**
   - Al pasar el cursor (hover), recibir foco por teclado o hacer clic en un swatch de color:
     - La imagen principal de la tarjeta cambia suavemente a la imagen destacada asociada a esa variante de color (`variant.featured_media`).
     - El enlace de la tarjeta (`<a href="...">`) se actualiza dinámicamente con el parámetro `?variant={variant_id}`.
     - El selector de Quick Buy se sincroniza automáticamente para ofrecer las tallas disponibles correspondientes al color seleccionado.
4. **Accesibilidad:**
   - Grupo semántico con `role="radiogroup"` y `aria-label="{{ 'products.product.color' | t }}"`.
   - Cada swatch como `role="radio"`, `aria-label="Color: [Nombre]"`, `aria-checked="true|false"`.
   - Contraste WCAG AA del anillo activo (`--color-control-border` con ratio >= 3:1).

---

### Frente 3: Swatches Nativos en Filtros Facetados de Colección (`sections/main-collection.liquid`)

1. **Detección en Filtros:**
   - En el bucle de `collection.filters`:
     - Identificar si `filter.presentation == 'swatch'` O si el label del filtro corresponde a Color/Material.
2. **Presentación Visual:**
   - En lugar de renderizar un checkbox cuadrado común con texto plano, renderizar chips o círculos de swatch visuales (`.facet__swatch`):
     - Muestra el color (`value.swatch.color`) o imagen (`value.swatch.image`).
     - Indicador activo: borde concéntrico o checkmark sutil.
     - Estado agotado/conteo cero: atenuado visualmente cuando `value.count == 0`.
     - Tooltip accesible o etiqueta visible al foco/hover.
3. **Preservación del Contrato:**
   - Debe mantener el `<input type="checkbox" name="{{ value.param_name }}" value="{{ value.value }}">` para que la sumisión de filtros (tanto estándar como AJAX con `facet-filters-form`) funcione exactamente igual sin romper URLs ni paginación.

---

### Frente 4: Paridad de Locales y Esquemas

1. **Archivos de Traducción:**
   - Actualizar `locales/en.default.json` y `locales/es.json` con claves simétricas para Quick Buy y Swatches:
     - `products.product.quick_add`: "Quick add" / "Añadir rápido".
     - `products.product.select_size`: "Select size" / "Seleccionar talla".
     - `products.product.color_swatch`: "Color: {{ color }}" / "Color: {{ color }}".
     - `products.product.more_swatches`: "+{{ count }} more" / "+{{ count }} más".
     - `collections.filters.swatch_color`: "Color: {{ color }}" / "Color: {{ color }}".
2. **Schema & Settings:**
   - En `sections/main-collection.liquid` y `sections/product-recommendations.liquid`, verificar que los settings de `show_quick_add` y posibles toggles de swatches respeten la Compuerta 4 (sentence case, claves `t:`).

---

## 3. Las 5 Compuertas de Calidad Obligatorias (Definition of Done)

Para que el Sprint 5A sea aceptado por Gemini y Johandry, debe superar sin excepción:

1. **Compuerta de Requisitos (Ledger Vivo):**
   - Declarar avances o consolidación en las filas de `Selector de Variantes y Swatches Nativos` y `Filtros Facetados Nativos en Colección y Búsqueda`.
2. **Compuerta de Estados Degenerados:**
   - *Vacío:* Producto sin variantes u opciones complejas sin talla; colección sin filtros de color.
   - *Uno solo:* Producto de 1 sola variante (sigue comprando con 1 clic sin desplegar menú innecesario); producto de 1 solo color.
   - *Muchos:* Producto con 6 tallas y 5 colores; colección con 12 filtros de color.
   - *Muy largo:* Nombres de talla largos ("One Size / Extra Large") o colores extensos ("Midnight Navy Melange").
   - *Faltante:* Variante sin foto asociada (fallback seguro a la foto principal de producto sin romper layout).
3. **Compuerta de Consistencia entre Archivos:**
   - Usar tokens tipográficos y espaciales existentes de `assets/base.css` (`--space-*`, `--font-body-family`, `--motion-fast`, `--ease-move`).
   - Cero duplicación de lógica: reutilizar la interceptación global de `CartDrawer` para adiciones AJAX.
4. **Compuerta de Superficie del Comerciante:**
   - 100% de textos y labels mediante claves `t:`.
   - Cero jerga de desarrollo ("popover", "bento", "quickbuy drawer") en schemas visibles para el comerciante.
5. **Compuerta de Verificación en Tienda Real:**
   - Hitbox táctil mínimo verificado de 44×44px en todos los botones interactivos.
   - axe-core / Lighthouse: 0 violaciones de accesibilidad.

---

## 4. Entregables y Salida Esperada de Claude

1. Código implementado en el árbol de trabajo local en los archivos:
   - `snippets/product-card.liquid`
   - `sections/main-collection.liquid`
   - `assets/theme.js`
   - `assets/base.css`
   - `locales/en.default.json`
   - `locales/es.json`
2. Ejecutar y validar que:
   - `npm run gates:static` retorne código 0 con 0 ofensas en Theme Check.
   - `node scripts/locale-key-inventory.mjs` reporte 0 claves huérfanas y 0 sin resolver.
   - `node agent-comms/outbox-claude/harness-ML-001/locale-parity.mjs .` confirme paridad total inglés/español.
   - `python agent-comms/outbox-claude/harness-LOCALE-001/liquid-literals.py .` reporte 0 hallazgos.
3. Informe exhaustivo de entrega en:
   `agent-comms/outbox-claude/CLAUDE-REPORT-5A-001.md`.
4. **NO realizar commit ni push** hasta que Gemini audite el diff y emita la revisión formal de aceptación.

---

## 5. Addendum: Criterios de Aceptación Adversarial de Producto (GPT-AUDIT-004)

GPT-5.6 Sol Max ha establecido en `agent-comms/outbox-gpt/GPT-AUDIT-004-merchandising-and-quickbuy-criteria.md` la matriz de 36 criterios y 12 fixtures de QA. Claude debe tener en cuenta especialmente:

1. **Contrato de Interacción de Swatches:**
   - `hover` en escritorio solo **previsualiza** la foto; NO cambia el variant ID comprometido.
   - `pointerleave` restaura la imagen de la variante comprometida.
   - `click` / tap / teclado **confirma** el color; entonces actualiza variante seleccionada, precio, disponibilidad y opciones de talla.
2. **Grid Móvil de 2 Columnas (390px):**
   - En cards de ancho reducido, mostrar máximo **2 swatches visibles + pill `+N`**, garantizando que cada control táctil mantenga `44×44px` sin desbordamiento horizontal. En tarjetas >= 260px mostrar hasta 4 swatches + `+N`.
3. **Fallbacks Seguros a PDP:**
   - Si un producto requiere plan de venta obligatorio (`requires_selling_plan`), es una gift card con campos de destinatario, o tiene >250 variantes, degradar limpiamente a botón "Elegir opciones" / "Ver detalles" hacia el PDP.
4. **Confirmación en CartDrawer:**
   - La barra de $150 de envío de cortesía se calcula sobre el subtotal neto después de descuentos (sin valores negativos ni > 100%).
   - Preservar notas de pedido (`data-dirty`) durante re-renders.
   - Excluir del cross-sell productos agotados o ya presentes en el carrito.
