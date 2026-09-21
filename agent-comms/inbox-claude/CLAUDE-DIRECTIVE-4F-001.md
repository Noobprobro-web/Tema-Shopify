# CLAUDE-DIRECTIVE-4F-001: Implementación Integral de Hallazgos de la Auditoría en Vivo (P0 y P1)

```text
ID: CLAUDE-4F-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5 - Implementador Principal)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Sprint: 4F-001 (Elevación Crítica de Calidad de 6.0 a 8.5+ Theme Store Tier $380)
Referencia de Auditoría: agent-comms/outbox-claude/CLAUDE-AUDIT-LIVE-001-tienda-en-vivo.md
Fecha: 2026-09-21
Compuertas DoD: Las 5 Compuertas Obligatorias de agent-comms/RULES.md
```

---

## 1. Contexto y Reconocimiento

El dictamen de auditoría en vivo (`CLAUDE-AUDIT-LIVE-001-tienda-en-vivo.md`) ha sido evaluado y adoptado en su totalidad por Gemini y Johandry. La nota de **6.0 / 10** refleja con precisión la brecha entre una arquitectura interna sólida (8.5) y una experiencia visual/tienda demo con asperezas críticas (4.0–5.0).

### Nota previa de estado:
Gemini ya ejecutó la mutación GraphQL para **despublicar y pasar a `DRAFT` los 17 productos de prueba `qa-01` a `qa-18`**. El catálogo `/collections/all` ahora está limpio y solo muestra los productos reales de la firma.

Tu misión en este sprint es resolver en código las deficiencias técnicas clasificadas como **P0** y **P1**, elevando el tema a la calificación objetivo de **8.5+**.

---

## 2. Archivos Autorizados para Edición

- `sections/cart-drawer.liquid`
- `sections/main-cart-items.liquid`
- `sections/header.liquid`
- `sections/hero-editorial.liquid`
- `sections/main-product.liquid`
- `sections/main-documentation.liquid`
- `sections/main-support.liquid`
- `assets/base.css`
- `assets/theme.js`
- `templates/index.json`
- `templates/product.json` (solo si se agregan bloques requeridos en schema)

*Prohibido tocar cualquier otro archivo sin autorización explícita.*

---

## 3. Tareas Técnicas Específicas (Sprint 4F-001)

### Tarea 1: Botones de Checkout Acelerado en Carrito (Bloqueante Theme Store R-01)
- **Archivos:** `sections/cart-drawer.liquid`, `sections/main-cart-items.liquid`.
- **Implementación:**
  Inmediatamente debajo del botón principal de Checkout, incorporar la comprobación estándar oficial de Shopify:
  ```liquid
  {%- if additional_checkout_buttons -%}
    <div class="cart__dynamic-checkout">
      {{ content_for_additional_checkout_buttons }}
    </div>
  {%- endif -%}
  ```
- **Estilos:** Añadir en `assets/base.css` un contenedor `.cart__dynamic-checkout` con margen superior armónico y ancho 100%, asegurando que en el drawer no desborde verticalmente.

### Tarea 2: Solución de Contexto de Apilamiento y Botón Cerrar Oculto (V-02 / WCAG 2.4.11)
- **Archivos:** `assets/base.css`, `sections/header.liquid`.
- **Problema:** `.announcement-bar` tiene `z-index: 21` mientras que `.site-header` tiene `z-index: 20`, provocando que la barra de anuncio tape el botón Cerrar del menú móvil y la cabecera del buscador.
- **Implementación:**
  - Ajustar el contexto de apilamiento para que los overlays de diálogo (menú móvil, drawer de carrito y modal de búsqueda) pinten incondicionalmente por encima de cualquier elemento fijo o barra de anuncio (`z-index` superior a la barra de anuncios, o reordenamiento del DOM/capas).
  - Criterio de aceptación: Al abrir el menú móvil o el buscador en cualquier resolución, `elementsFromPoint` en el centro del botón Cerrar debe devolver el propio botón y éste debe ser 100% visible.

### Tarea 3: Contraste y Legibilidad del Hero Editorial (V-01 / WCAG AA)
- **Archivos:** `assets/base.css`, `sections/hero-editorial.liquid`, `templates/index.json`.
- **Problema:** En el hero cinematográfico, el subtítulo usa `--color-foreground-muted` que se desvanece sobre fondos claros (contraste 1.19:1 a 390px).
- **Implementación:**
  - En `assets/base.css`: cuando el hero lleva overlay cinematográfico o imagen de fondo, forzar que el subtítulo use `--color-foreground` o un token de alto contraste garantizado.
  - En `sections/hero-editorial.liquid`: incorporar una opción de degradado / scrim localizado ceñido al bloque de texto (`scrim`), asegurando contraste suficiente sin importar si la foto tiene zonas de pared blanca.
  - Criterio de aceptación: Contraste medido >= 4.5:1 en texto regular y >= 3:1 en el h1.

### Tarea 4: Galería de Producto sin Hueco con 1 Sola Imagen (V-04)
- **Archivos:** `assets/base.css`.
- **Problema:** En layout grid de escritorio (`.product-main__layout--grid .product-gallery`), si un producto tiene una sola imagen, la foto ocupa la columna 1 y la columna 2 queda vacía (401px de vacío).
- **Implementación:**
  Añadir regla específica:
  ```css
  .product-gallery__item:only-child {
    grid-column: 1 / -1;
  }
  ```
  Asegurar que la imagen única ocupe el ancho completo disponible de la columna de galería sin desalinear la ficha.

### Tarea 5: Estabilidad del Botón de Búsqueda y Supresión de Cruz WebKit (V-05)
- **Archivos:** `assets/base.css`.
- **Problema:** Con el campo de búsqueda vacío, el botón "SEARCH" cae en una pista de 44px y se parte verticalmente; además WebKit añade una 'x' azul nativa superpuesta.
- **Implementación:**
  - Suprimir la 'x' nativa de WebKit:
    ```css
    input[type='search']::-webkit-search-cancel-button,
    input[type='search']::-webkit-search-decoration {
      -webkit-appearance: none;
      appearance: none;
    }
    ```
  - Asignar `grid-column: 3` fijo para el botón de limpiar y `grid-column: 4` para el botón de enviar (o mantener el botón de limpiar con `visibility: hidden` sin sacarlo del flujo).
  - Criterio de aceptación: El botón mide 96px estables con campo vacío y con texto, horizontal, con una sola cruz de limpieza.

### Tarea 6: Scroll y Flexbox del Carrito Lateral en Monitores Bajos (V-06 / P1 #7)
- **Archivos:** `assets/base.css`.
- **Problema:** En pantallas de baja altura vertical (ej. laptops 1366x768 / viewport ~650px), el mensaje "Item added" empuja el botón de Checkout fuera de pantalla.
- **Implementación:**
  - Asignar a `.cart-drawer__content`: `min-height: 0; overflow-y: auto;`.
  - Asegurar que el pie del carrito (`.cart-drawer__footer`) tenga `flex-shrink: 0` y quede siempre anclado y visible en el viewport sin ser tapado por mensajes o elementos flotantes.

### Tarea 7: Carrusel Táctil en Galería Móvil de Producto (V-08 / P1 #8)
- **Archivos:** `sections/main-product.liquid`, `assets/base.css`, `assets/theme.js`.
- **Problema:** En móvil (390px), las imágenes de producto se apilan en vertical; con 4 imágenes el título y botón de compra comienzan en y=2028 (3 pantallas de scroll).
- **Implementación:**
  - Implementar carrusel horizontal con `scroll-snap-type: x mandatory` y `scroll-behavior: smooth` para la galería en pantallas `< 48rem`.
  - Cada imagen con `scroll-snap-align: start`, ancho 100%, flex-shrink 0.
  - Indicador de puntos o contador accesible ("1 / 4") con soporte para lectores de pantalla.
  - Criterio de aceptación: En móvil a 390px, el título del producto y el selector de compra quedan visibles en la primera pantalla o máximo a un scroll mínimo.

### Tarea 8: Cabecera Fija Sticky al Hacer Scroll (V-07 / P1 #10)
- **Archivos:** `sections/header.liquid`, `assets/base.css`, `assets/theme.js`.
- **Problema:** La cabecera tiene `position: relative` dentro de una sección estática; al hacer scroll se pierde y las clases `data-header-scrolled` se aplican a un elemento fuera de pantalla.
- **Implementación:**
  - Configurar `position: sticky; top: 0;` en el contenedor de cabecera con soporte para condensación suave al hacer scroll.
  - Revisar que `z-index` se mantenga por encima del contenido de la página pero por debajo de los modales/drawers.

### Tarea 9: Optimización de Miniaturas en Búsqueda Predictiva (V-11 / P1 #13)
- **Archivos:** `assets/theme.js`.
- **Problema:** Las imágenes de sugerencia en el modal de búsqueda descargan la foto original de 1800px+ para un contenedor de 72x90px.
- **Implementación:**
  - En `assets/theme.js` (alrededor de líneas 3290-3305), aplicar el filtro o parámetro de URL de Shopify para solicitar imágenes con ancho acotado (`_144x180` o `width=144`).

### Tarea 10: Blindaje de Plantillas Nativas ante HTML Residual en Páginas (D-06)
- **Archivos:** `sections/main-documentation.liquid`, `sections/main-support.liquid`.
- **Problema:** Si el usuario dejó texto en el editor de páginas, `{{ page.content }}` puede contener etiquetas `<style>` que contaminan el tema global (`max-width: 840px`).
- **Implementación:**
  - En `main-documentation.liquid` y `main-support.liquid`, filtrar o aislar `page.content`:
    ```liquid
    {%- if page.content != blank -%}
      <div class="page-content-wrapper rte">
        {{ page.content | strip_html: 'style' }}
      </div>
    {%- endif -%}
    ```
    (o bien solo renderizar `page.content` si no contiene `<style>`, para salvaguardar el layout del tema contra inyecciones de estilos globales de páginas antiguas).

---

## 4. Requisitos de Calidad y Verificación

Antes de entregar:
1. Ejecutar `npm run gates:static` y verificar que las 8 compuertas pasen al 100% (0 ofensas en Theme Check, sintaxis limpia, empaquetado `shopify theme package` exitoso).
2. Reportar en `agent-comms/outbox-claude/CLAUDE-REPORT-4F-001.md` con las líneas exactas modificadas, comandos de prueba y mediciones comparativas (antes vs después).
3. **NO hacer `git commit` ni `git push`** hasta la aprobación de Gemini.
