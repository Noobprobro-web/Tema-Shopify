# Directiva de Implementación: GPT-3B-001 (Tokens Semánticos, Conversión PDP y Merchandising de Carrito)

```text
ID: GPT-3B-001
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3B.1 (Sprint 1: Tokens Semánticos, Conversión PDP y Merchandising de Carrito)
Fecha: 2026-09-12
Estado: AUTORIZADA PARA EJECUCIÓN INMEDIATA
```

---

## 1. Visión y Propósito

El usuario ha autorizado formalmente el inicio de **Phase 3B: Implementación Técnica en Shopify Liquid, CSS y Vanilla JS**.
Tras haber completado y aprobado el 100% de los blueprints en Figma (Phase 3A.1 a 3A.5), este primer sprint (**GPT-3B-001**) traduce los módulos de mayor impacto en conversión y los componentes críticos aprobados en `couture-top-tier-merchandising-1440.svg` y `couture-top-tier-merchandising-390.svg` a código de producción de Online Store 2.0.

El resultado debe mantener **0 ofensas en Shopify Theme Check**, 100% WCAG 2.2 AA, y cero dependencias externas, utilizando exclusivamente Web Components nativos construidos sobre `ThemeCore`.

---

## 2. Archivos Permitidos y Alcance Cerrado

### Archivos Permitidos:
- `assets/base.css` (tokens semánticos, utilidades y estilos de nuevos componentes).
- `assets/theme.js` (Web Components `<sticky-cart-bar>`, `<size-guide-modal>` y lógica de cross-sell en carrito).
- `sections/main-product.liquid` (integración de Sticky Cart Bar y bloque `size_guide`).
- `sections/cart-drawer.liquid` (barra de progreso escalonada de envío gratis/regalo y módulo 1-click cross-sell).
- `sections/announcement-bar.liquid` (NUEVO: barra superior editorial con soporte rotativo/estático y enlaces).
- `sections/header-group.json` (declaración de la sección `announcement-bar` en el grupo del header).
- `locales/en.default.json` (nuevas claves de traducción sin hardcoding).
- `agent-comms/outbox-gpt/GPT-3B-001-core-conversion-components.md` (informe de entrega de Codex).

### Archivos Excluidos (NO tocar en este sprint):
- `sections/main-collection.liquid` (reservado para sprint de colección GPT-3B-003).
- `templates/index.json` y nuevas secciones de homepage (reservado para GPT-3B-002).
- `templates/*.json` (plantillas secundarias reservadas para GPT-3B-004).
- `layout/theme.liquid` (salvo que sea estrictamente necesario registrar algo global no cubierto).

---

## 3. Especificaciones Técnicas Detalladas

### Requisito 1: Tokens Semánticos en `assets/base.css`
Alinear las variables semánticas de `:root` y los esquemas de color con `docs/design-tokens.json` y la paleta Couture:
1. Exponer en `:root`:
   - `--color-surface: #F3EFEA;`
   - `--color-surface-subtle: #EDE7DE;`
   - `--color-border-hairline: #EDE7DE;`
   - `--color-foreground-muted: #605A53;`
   - `--color-accent: #786C5E;`
   - `--radius-card: 0px;`
   - `--radius-button: 2px;`
   - `--radius-input: 0px;`
   - `--tap-target-min: 44px;`
   - `--font-letter-spacing-eyebrow: 0.12em;`
   - `--font-letter-spacing-heading: -0.02em;`
2. Asegurar que las variables de esquema (`.color-scheme-1`, etc.) definan coherentemente sus superficies y bordes para garantizar contraste mínimo WCAG 2.2 AA (>= 4.5:1).

### Requisito 2: Sticky Cart Bar en PDP (`sections/main-product.liquid` + `assets/theme.js`)
1. **Web Component `<sticky-cart-bar>`:**
   - Debe heredar de `ThemeCore.ThemeElement` y gestionar eventos con `AbortController`.
   - Utilizar `IntersectionObserver` para observar el botón principal de compra (`[data-add-to-cart]` dentro de `variant-selects`).
   - Cuando el botón principal sale del viewport hacia arriba, la barra se desliza suavemente desde abajo (`position: fixed; bottom: 0; left: 0; width: 100%; z-index: 40;`).
   - Se oculta de nuevo cuando el botón de compra vuelve a ser visible.
2. **Contenido de la Barra:**
   - Miniatura del producto (48x48 o 56x56px), título truncado elegantemente, precio reactivo a la variante.
   - Selector o indicador de variante actual sincronizado.
   - Botón `Add to Cart` que dispara el formulario de producto principal con estados de loading y deshabilitado si está agotado.
   - En mobile: compacto (<=64px de alto), botón visible con tap target >= 44px.
3. **Control de Configuración:**
   - Ajuste en `sections/main-product.liquid`: checkbox `enable_sticky_cart` (default: `true`).

### Requisito 3: Modal de Guía de Tallas & Fit del Modelo (`sections/main-product.liquid` + `assets/theme.js`)
1. **Bloque `size_guide` en `sections/main-product.liquid`:**
   - Tipo de bloque: `"type": "size_guide"`, `"limit": 1`.
   - Settings del bloque:
     - `guide_title`: texto (default: `"Size Guide & Measurements"`).
     - `model_fit_info`: texto (default: `"Model is 178cm / 5'10\" wearing size S"`).
     - `page_content`: `page` (página de Shopify opcional con tabla de medidas).
     - `size_table_cm`: richtext o tabla configurable.
     - `size_table_in`: richtext o tabla configurable en pulgadas.
2. **Interacción y Accesibilidad:**
   - Botón disparador con icono de percha o regla, ubicado elegantemente junto al label de tallas o como bloque independiente.
   - Modal accesible con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `trapFocus`, cierre con `Escape` y botón de cierre (`Close`) con tap target >= 44x44px.
   - Conmutador de unidades accesible: selector de pestañas `CM / INCHES` que intercambia las medidas sin recargar la página.
   - Bloque informativo de fit del modelo visible tanto en el modal como de forma opcional debajo de la guía.

### Requisito 4: Cart Drawer Merchandising Top-Tier (`sections/cart-drawer.liquid` + `assets/theme.js`)
1. **Barra de Progreso Escalonada de Envío Gratis & Regalo de Atelier:**
   - Settings en `sections/cart-drawer.liquid`:
     - `free_shipping_threshold`: número en centavos o monto entero (default: `150` para $150).
     - `atelier_gift_threshold`: número (default: `250` para $250).
     - `enable_tiered_progress`: checkbox (default: `true`).
   - Lógica visual:
     - Barra de progreso delgada (4-6px) con relleno acentuado y marcas escalonadas.
     - Mensajes dinámicos según `cart.total_price`:
       - Menor a umbral 1: *"Add [monto faltante] for Complimentary Shipping"*
       - Entre umbral 1 y 2: *"Complimentary Shipping unlocked! Add [monto faltante] for an Atelier Gift"*
       - Mayor o igual a umbral 2: *"Complimentary Shipping & Atelier Gift unlocked"*
     - Reactivo a las actualizaciones del Section Rendering API cuando el usuario modifica cantidades.
2. **In-Drawer 1-Click Complementary Additions (Cross-Sell):**
   - Settings en `sections/cart-drawer.liquid`:
     - `cross_sell_collection`: `collection` opcional, o bloque de tipo `cross_sell_product` (máximo 2 productos recomendados).
     - `cross_sell_heading`: texto (default: `"Complimentary Additions"`).
   - Card compacta dentro del drawer:
     - Imagen miniatura (64x64px), título, precio formateado y botón `+ Add` en 1 clic.
     - Si el producto ya está en el carrito, se oculta o se marca como agregado.
     - El botón `+ Add` envía un POST asíncrono a `routes.cart_add_url` y refresca el Section Rendering del `cart-drawer` sin recargar la página ni perder el foco.

### Requisito 5: Announcement Bar Global (`sections/announcement-bar.liquid` + `sections/header-group.json`)
1. **Nueva Sección `sections/announcement-bar.liquid`:**
   - Bloques repetibles de tipo `announcement` con texto, enlace opcional, y soporte para auto-rotación accesible o carrusel pausado con `prefers-reduced-motion`.
   - Altura estandarizada (36-44px), tipografía `Micro/Eyebrow` con tracking `0.12em`.
   - Esquema de color configurable (`color_scheme`).
2. **Inclusión en `sections/header-group.json`:**
   - Añadir `announcement-bar` como primera sección del grupo, previa a `header`.

### Requisito 6: Localizaciones y Cero Ofensas en Theme Check
1. **Traducciones en `locales/en.default.json`:**
   - Registrar cada cadena merchant-facing bajo `products.product.*`, `sections.cart.*` y `sections.announcement_bar.*`.
   - Prohibido dejar texto en inglés hardcodeado en Liquid.
2. **Shopify Theme Check:**
   - Ejecutar `npx shopify theme check` y confirmar **0 ofensas**.
3. **Validación JS:**
   - `node --check assets/theme.js` (0 errores).

---

## 4. Criterios de Aceptación

1. `npx shopify theme check` reporta **0 ofensas**.
2. `node --check assets/theme.js` termina con código de salida `0`.
3. El botón de Sticky Cart Bar aparece y desaparece correctamente mediante `IntersectionObserver`.
4. El Modal de Guía de Tallas atrapa y restaura el foco, soporta conmutador `CM / INCHES` y se cierra con tecla `Escape`.
5. La barra de progreso de envío gratis/regalo y el botón de cross-sell en 1 clic funcionan reactivamente en el Cart Drawer.
6. Todos los controles interactivos tienen tap targets mínimos de 44x44px y contrastes WCAG 2.2 AA.
7. Se genera el informe de entrega en `agent-comms/outbox-gpt/GPT-3B-001-core-conversion-components.md`.
8. No realizar commit ni push de Git (Gemini auditará y autorizará el commit).
