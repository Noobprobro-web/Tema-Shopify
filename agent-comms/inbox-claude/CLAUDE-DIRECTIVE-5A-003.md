# CLAUDE-DIRECTIVE-5A-003: Remediación Unificada P0/P1 (GPT-AUDIT-005 + CLAUDE-AUDIT-OPUS-001) y Cierre Definitivo de Sprint 5A

```text
ID: CLAUDE-DIRECTIVE-5A-003
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Disciplina Técnica)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Estado: DIRECTIVA DE IMPLEMENTACIÓN QUIRÚRGICA VINCULANTE (ONE-SHOT BATCH)
Objetivo: Resolver de forma unificada los hallazgos críticos de GPT-AUDIT-005 y CLAUDE-AUDIT-OPUS-001
```

---

## 1. Veredicto y Contexto de Orquestación

Tanto **Opus 5.5 Extra** ([`CLAUDE-AUDIT-OPUS-001.md`](../outbox-claude/CLAUDE-AUDIT-OPUS-001.md)) como **GPT-6 Sol Max** ([`GPT-AUDIT-005-sprint-5a-adversarial.md`](../outbox-gpt/GPT-AUDIT-005-sprint-5a-adversarial.md)) han completado sus auditorías con un nivel de profundidad y complementariedad sobresaliente.

La estrategia de **freno de mano** fue un éxito rotundo:
1. **GPT-6 Sol Max** descubrió dos fallas funcionales críticas en tienda real:
   - **H1 (P0 / QB-11):** En F06 (producto con `requires_selling_plan: true` pero sin asignaciones), los botones de compra estaban activos en la PDP y arrojaban un falso mensaje de éxito en el drawer sin añadir el producto al carrito.
   - **H2 (P1-P0 / SW-06):** En la tarjeta F04, al seleccionar el color Bone (completamente agotado en todas las tallas), el botón `Quick add` permanecía activo y abría un selector sin salida con todas las tallas deshabilitadas.
2. **Opus 5.5 Extra** descubrió defectos de renderizado y cumplimiento Theme Store:
   - **H-01 (P1):** Doble escape HTML en 40 traducciones con interpolación (ej. "O'Brien" renderizado como `O&#39;Brien`, y `&` como `&amp;`).
   - **H-02 (P1):** El setting `logo_width` no tiene efecto en el DOM debido a una anulación en CSS.
   - **H-03 (P1):** Requisito Theme Store: `secondary_menu` en `header.liquid` carece de `"default": "main-menu"`.
   - **H-04 / GPT-H3 (P1):** Presencia de "Atelier Gift" en la configuración por defecto del cart drawer (violación de Merchant Surface Gate).
   - **H-05 / GPT-H4 (P1/P2):** Truncado visual de "LINEA NOVE" a 390 px en la cabecera móvil.
   - **H-09 (P2):** Colección vacía muestra texto erróneo de "sin coincidencias" aunque no haya filtros aplicados.

---

## 2. Alcance Quirúrgico de Implementación (Ola 1 Unificada)

Claude (Opus 5.5 Extra) implementará exactamente las siguientes 7 soluciones en una sola pasada:

### Tarea 1: Fail-Closed en Selling Plans sin Asignación (GPT H1 - P0)
* **Liquid (`sections/main-product.liquid`):**
  - Alrededor de líneas 550-571: verificar si `current_variant.requires_selling_plan` y `current_variant.selling_plan_allocations.size == 0`.
  - En ese caso degenerado, deshabilitar el botón de compra principal, ocultar el botón de pago acelerado dinámico y renderizar un mensaje de estado localizado claro indicando que la opción requiere un plan no disponible.
* **JavaScript (`assets/theme.js`):**
  - En `VariantSelects.isPurchaseOptionValid` (líneas 733-737): si `variant.requires_selling_plan` es verdadero pero no existe una asignación válida seleccionada, retornar `false`.
  - En `CartDrawer.addItem` (líneas 2174-2180): verificar de forma defensiva que la respuesta del servidor o el carrito actualizado contiene efectivamente la línea solicitada antes de disparar el anuncio de éxito; si no se agregó la línea, mostrar mensaje de error localizado y no anunciar falso éxito.

### Tarea 2: Sincronización del Disparador Quick Buy ante Color Agotado (GPT H2 - P0/P1)
* **JavaScript (`assets/theme.js`):**
  - En `ProductCardVariants.syncPicker` (alrededor de líneas 1783-1812): calcular si existe al menos una talla disponible para el color comprometido (`const hasAvailable = offered.some(v => v.available)`).
  - Si `hasAvailable` es `false`: deshabilitar el botón `.quick-buy__trigger`, cambiar su texto al label localizado `Sold out` / `Agotado` (`theme.strings.soldOut`), y prevenir la apertura del selector de tallas.
  - Si `hasAvailable` es `true`: habilitar el botón `.quick-buy__trigger` y restaurar el label `Quick add` / `Añadir rápido` (`theme.strings.quickAdd`).

### Tarea 3: Eliminación del Doble Escape en Traducciones (Claude H-01 - P1)
* **Liquid:**
  - En los 7 archivos con texto visible y en los atributos `aria-label`/`data-*` identificados (`sections/main-article.liquid:33`, `sections/main-blog.liquid:85`, `sections/complete-the-look.liquid:183,223`, `sections/curated-showcase.liquid:146`, `sections/main-placeholder.liquid:5,35`, `sections/cart-drawer.liquid`, `sections/main-product.liquid`):
  - Sustituir `| t: ... | escape` por la interpolación limpia sin `| escape` (o `| escape_once`), ya que el filtro `| t` de Shopify escapa de manera nativa todo contenido que no termine en `_html`.
  - Verificar que caracteres como `'`, `&`, `"`, `<` no salgan como entidades HTML visibles en pantalla.

### Tarea 4: Efectividad del Ajuste `logo_width` (Claude H-02 - P1)
* **Liquid & CSS (`sections/header.liquid` y `assets/base.css`):**
  - En `sections/header.liquid`: inyectar `--logo-width: {{ section.settings.logo_width | default: settings.logo_width | default: 140 }}px;` en el contenedor del logo o estilo en línea.
  - En `assets/base.css:650-653`: actualizar `.site-header__logo-image` para usar `width: min(var(--logo-width, 140px), 100%); height: auto; max-height: none;`.

### Tarea 5: Requisito Theme Store `secondary_menu` (Claude H-03 - P1)
* **Schema & Liquid (`sections/header.liquid`):**
  - En el setting `secondary_menu` (líneas 249-254), agregar `"default": "main-menu"`.
  - En el renderizado Liquid: asegurar que si `section.settings.secondary_menu == section.settings.menu` o si está vacío, no se duplique la barra de navegación secundaria en el encabezado.

### Tarea 6: Neutralización de Recompensas en Cart Drawer (Claude H-04 / GPT H3 - P1)
* **Schema (`sections/cart-drawer.liquid`):**
  - Cambiar el default de `enable_tiered_progress` a `false`.
* **Locales (`locales/en.default.json` y `locales/es.json`):**
  - Reemplazar "Atelier Gift" por copy neutro internacionalizable: `"Free shipping and gift unlocked"` / `"Envío gratuito y obsequio desbloqueados"`.

### Tarea 7: Ergonomía de Marca Móvil a 390 px (Claude H-05 / GPT H4 - P1/P2)
* **CSS (`assets/base.css`):**
  - Aplicar las propuestas A, B y D de Claude:
    1. Contador del carrito fuera de flujo sobre la esquina superior derecha del icono, oculto cuando es 0 (recupera ~11 px).
    2. Delimitar el botón de cuenta `shopify-account` a un ancho máximo ergonómico de 44 px (recupera ~6 px).
    3. Tipografía de marca en móvil: `font-size: clamp(1.1rem, 4.5vw, 1.5rem);` con `white-space: nowrap;`.
  - Comprobar que "LINEA NOVE" quepa limpiamente sin puntos suspensivos en viewports de 360 px y 390 px.

### Tarea 8: Texto de Colección Vacía (Claude H-09 - P2)
* **Liquid (`sections/main-collection.liquid:377-382`):**
  - Si no hay filtros activos (`active_values.size == 0` y `filter.min_value.value == nil` y `filter.max_value.value == nil`): mostrar `"sections.collection_template.empty"` ("This collection is empty" / "Esta colección está vacía") con enlace a `routes.all_products_collection_url`.
  - Si hay filtros activos: mantener `"No products match your selection"` con botón `"Clear all"`.

---

## 3. Protocolo de Verificación y Entrega

1. Ejecutar compuertas estáticas: `npm run gates:static` (Theme Check 0 ofensas, paridad bilingüe, sintaxis JS, empaquetado).
2. Probar en el arnés local los escenarios degenerados y las 8 tareas.
3. Reportar en:
   `agent-comms/outbox-claude/CLAUDE-REPORT-5A-003.md`
   con diffs exactos (`archivo:línea`) y comandos ejecutados.
4. **NO hacer commit ni push.** Gemini auditará el informe y autorizará el commit.
