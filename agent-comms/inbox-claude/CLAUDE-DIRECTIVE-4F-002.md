# CLAUDE-DIRECTIVE-4F-002: Resolución de Hallazgos Comerciales y UX de GPT-5.6 Sol Max

```text
ID: CLAUDE-DIRECTIVE-4F-002
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Sprint: 4F-002 (Refinamiento Comercial y Correcciones de Interacción de la Auditoría GPT-AUDIT-002)
Referencia de Auditoría: agent-comms/outbox-gpt/GPT-AUDIT-002-browser-ux-critique.md
Fecha: 2026-09-21
Compuertas DoD: Las 5 Compuertas Obligatorias de agent-comms/RULES.md
```

---

## 1. Contexto

GPT-5.6 Sol Max ha emitido su dictamen comercial (`GPT-AUDIT-002`). Aunque comenzó su auditoría antes del despliegue de 4F-001 (por lo que reportó temas que 4F-001 ya mitigó, como el contraste del hero y el z-index de anuncio), descubrió **5 puntos de fricción reales en código** que debemos resolver de inmediato para blindar la experiencia comercial.

Johandry ha configurado e integrado el acceso a la tienda para Claude, por lo que este sprint tiene **alcance completo (Código + Configuración de Tienda y Contenido)**.

Tu misión en **Sprint 4F-002** es ejecutar tanto las correcciones de código frontend como la reconciliación y creación de páginas y navegación en la tienda para erradicar los 404 y dejar la experiencia al 100%.

---

## 2. Archivos Autorizados para Edición

- `sections/main-product.liquid`
- `sections/main-cart-items.liquid`
- `sections/cart-drawer.liquid`
- `assets/base.css`
- `assets/theme.js`
- `templates/index.json`
- `locales/en.default.json` (solo si se requieren strings para acordeones o plural de bundle)

---

## 3. Tareas Técnicas Específicas (Sprint 4F-002)

### Tarea 1: Confirmación de Cantidad y Total en Sticky ATC (UX-05)
- **Archivos:** `sections/main-product.liquid`, `assets/base.css`, `assets/theme.js`.
- **Problema:** Cuando el comprador selecciona cantidad > 1 en el PDP (ej. 2 unidades = $960), la barra inferior fija muestra el precio unitario ($480) y "Add to cart" sin indicar que se añadirán 2 unidades ni el total acumulado. Al hacer clic añade las 2 unidades por $960, generando sorpresa o desconfianza.
- **Implementación:**
  - En el Web Component `<sticky-atc>` / `StickyAddToCart` en `assets/theme.js` y `main-product.liquid`:
    Sincronizar dinámicamente la cantidad seleccionada en el formulario principal. Si `quantity > 1`, mostrar el total de línea o un badge de cantidad en el botón o junto al precio: ej. `2 × $480 ($960)` o `Add 2 to cart · $960`.
  - Criterio de aceptación: Si la cantidad es 1, muestra precio unitario. Si es 2 o más, la barra refleja explícitamente cuántas unidades se añadirán y el importe total correspondiente.

### Tarea 2: Sincronización y Corrección de Desborde Horizontal en `/cart` (UX-06)
- **Archivos:** `sections/main-cart-items.liquid`, `assets/base.css`, `assets/theme.js`.
- **Problema:** 
  1. En `/cart` a 1440px desktop, `document.scrollWidth = 1490px` (desborde horizontal de 50px) porque el stepper de cantidad y el botón Remove exceden el margen derecho del contenedor.
  2. Si el usuario está en `/cart` y abre el cart drawer lateral para eliminar o mutar una línea, la página `/cart` de fondo no se refresca y queda desincronizada mostrando items eliminados hasta que se recarga manualmente con F5.
- **Implementación:**
  - En `assets/base.css`: acotar el layout de `.cart-items` y `.cart-item` para que ninguna columna o acción exceda el 100% del contenedor o genere scroll horizontal a 1440px ni en ninguna resolución (`scrollWidth === clientWidth`).
  - En `assets/theme.js`: cuando el carrito emita o reciba mutaciones (`cart:updated`), si la página actual es `/cart`, actualizar también la sección de items del carrito mediante AJAX Section Rendering API (`?section_id=main-cart-items`) o sincronizar el DOM para evitar líneas fantasma.

### Tarea 3: Bloques Plegables en Ficha de Producto (Acordeones de Envíos / Cuidados) (UX-09)
- **Archivos:** `sections/main-product.liquid`, `assets/base.css`.
- **Problema:** La PDP carece de bloques de contenido plegable para "Materials & Care" y "Shipping & Returns", fundamentales para un tema de moda de \$380.
- **Implementación:**
  - Añadir al schema de `sections/main-product.liquid` el tipo de bloque `collapsible_tab`:
    - Settings: `heading` (text), `content` (richtext), `page` (opcional page picker).
  - Renderizarlo en Liquid mediante `<details class="product-details__accordion">` con flecha animada y estilo editorial acorde al sistema visual de Sartorial.
  - Asegurar que en `templates/product.json` se incluyan por defecto dos bloques plegables: "Composition & Care" y "Shipping & Complimentary Returns".

### Tarea 4: Corrección de Plural en Bundle y Destinos de Enlaces Editoriales (UX-08 / UX-12)
- **Archivos:** `sections/complete-the-look.liquid`, `templates/index.json`, `locales/en.default.json`.
- **Problema:** 
  1. En Complete the Look, cuando hay 1 elemento seleccionado el texto dice "1 of 3 item selected" en singular en vez de "1 of 3 items selected".
  2. En `templates/index.json`, los enlaces de "Read our process" apuntaban a `/collections/all` en vez de `/pages/about`, y las coordenadas de los hotspots 2 y 4 del lookbook necesitan ajuste fino sobre las prendas.
- **Implementación:**
  - Ajustar el string localizado o lógica Liquid/JS para pluralización correcta (`item` vs `items`).
  - Corregir en `templates/index.json` los destinos de los enlaces editoriales para que apunten a sus páginas semánticas correspondientes.

### Tarea 5: Reconciliación de Páginas Nativas y Navegación en la Tienda (UX-01 / UX-02 / UX-03)
- **Ámbito:** Tienda en vivo / Admin / GraphQL / Storefront.
- **Objetivos:**
  1. Asegurar que las 5 páginas nativas existan, no devuelvan 404 y tengan asignada su plantilla nativa:
     - `/pages/documentation` -> plantilla `page.documentation` (cuerpo limpio, sin HTML con `<style>` ni `mailto:`).
     - `/pages/support` -> plantilla `page.support` (cuerpo limpio, sin HTML con `mailto:`).
     - `/pages/faq` -> plantilla `page.faq`.
     - `/pages/about` -> plantilla `page.about`.
     - `/pages/policy` -> plantilla `page.policy`.
  2. Navegación en Header:
     - Crear estructura de submenú bajo "Catalog" para lucir el dropdown de lujo.
     - Mover los accesos de "Documentation" y "Support" al footer menu.
  3. Identidad de tienda:
     - Ajustar el nombre comercial de la tienda a "LINEA NOVE" o "Sartorial" (en lugar de "Tema").

---

## 4. Requisitos de Calidad

1. Ejecutar `npm run gates:static` (las 8 compuertas deben mantenerse al 100%, 0 ofensas en Theme Check).
2. Verificar con Playwright que `document.documentElement.scrollWidth === document.documentElement.clientWidth` en `/cart` a 1440px y 390px.
3. Reportar en `agent-comms/outbox-claude/CLAUDE-REPORT-4F-002.md`.
4. NO hacer git commit ni git push.
