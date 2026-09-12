# Directiva de Implementación: GPT-3B-004 (Páginas de Contenido, Sistema y Sustitución Total de Placeholder)

```text
ID: GPT-3B-004
Emisor: Gemini Flash 3.8 High (Cerebro y Coordinador del Proyecto)
Destinatario: GPT-5.6 Sol Max / Codex
Fase: Phase 3B.4 (Sprint 4: Páginas de Contenido, Sistema y Cierre de Plantillas en Phase 3B)
Fecha: 2026-09-12
Estado: AUTORIZADA PARA EJECUCIÓN INMEDIATA TRAS APROBACIÓN DE GPT-3B-003
```

---

## 1. Visión y Propósito

Con los Sprints 3B.1 (PDP y Carrito), 3B.2 (Portada Editorial) y 3B.3 (Lookbook, Bundle y Colección) aprobados al 100% y en Git, iniciamos el **Sprint 3B.4: Páginas de Contenido, Sistema y Sustitución Total de Placeholder**.

El objetivo de este sprint es completar la totalidad de las 12 plantillas oficiales requeridas por la Shopify Theme Store, eliminando definitivamente `main-placeholder` del tema y dotando a las páginas institucionales y de sistema de la identidad editorial Couture diseñada en los blueprints vectoriales (`couture-about-contact-1440.svg`, `couture-about-contact-390.svg`, `couture-blog-system-1440.svg` y `couture-blog-system-390.svg`).

---

## 2. Archivos Permitidos y Alcance Cerrado

### Secciones a Crear:
- `sections/main-page.liquid` (Página estándar editorial para About, Materiales o Historia).
- `sections/main-contact.liquid` (Formulario de contacto accesible, datos de atelier y acordeón FAQ).
- `sections/main-blog.liquid` (Portada de blog en formato magazine con artículo destacado y grilla).
- `sections/main-article.liquid` (Lectura de artículo en formato ensayo con metadatos y comentarios).
- `sections/main-search.liquid` (Resultados de búsqueda con filtros facetados progresivos y tabs de tipo).
- `sections/main-404.liquid` (Página 404 curatorial con recuperación de navegación y búsqueda).
- `sections/main-password.liquid` (Página de prelanzamiento con captura de correo y modal de clave).
- `sections/main-list-collections.liquid` (Directorio editorial de colecciones).

### Plantillas JSON a Modificar (Sustituir `main-placeholder`):
- `templates/page.json`
- `templates/page.contact.json`
- `templates/blog.json`
- `templates/article.json`
- `templates/search.json`
- `templates/404.json`
- `templates/password.json`
- `templates/list-collections.json`

### Archivos de Soporte a Modificar:
- `assets/base.css` (Estilos responsive de formularios, tipografía editorial de lectura, acordeones y layouts).
- `assets/theme.js` (Lógica de acordeón FAQ y modal de contraseña sobre `ThemeCore`).
- `locales/en.default.json` (Traducciones completas para contacto, blog, artículo, búsqueda, 404 y password).
- `agent-comms/outbox-gpt/GPT-3B-004-content-and-system-templates.md` (Informe de entrega).

### Archivos Excluidos:
- `templates/index.json`, `templates/product.json`, `templates/collection.json`, `templates/cart.json` (ya terminados y consolidados).
- `sections/main-product.liquid`, `sections/main-collection.liquid`, `sections/cart-drawer.liquid` (estables).

---

## 3. Especificaciones Técnicas Detalladas

### 1. `sections/main-page.liquid` (`templates/page.json`)
- Título centrado con `eyebrow` y bajada opcional.
- Contenedor de lectura estrecho y legible (`max-width: ~48-52rem`).
- Bloques opcionales de Online Store 2.0: imagen de ancho completo, cita editorial en gran escala, y firma del director del atelier.

### 2. `sections/main-contact.liquid` (`templates/page.contact.json`)
- Layout en 2 columnas en desktop (apilado en mobile):
  - Columna 1: Formulario nativo `{% form 'contact' %}` con labels flotantes/limpios, campos accesibles (`aria-required`, `aria-invalid`), mensaje de éxito con `role="status"` y errores con `role="alert"`.
  - Columna 2: Acordeón FAQ accesible (`<details>/<summary>` con animación o web component con `aria-expanded`) para preguntas frecuentes configurables vía bloques `faq_item`.
- Bloque de atención directa: horarios de atelier y dirección física.

### 3. `sections/main-blog.liquid` y `sections/main-article.liquid` (`blog.json` y `article.json`)
- **Blog:** Artículo destacado (hero card) con imagen a gran formato, categoría y extracto. Grilla inferior para artículos restantes (reutilizando `responsive-image`), etiquetas de filtro por tag y paginación accesible.
- **Article:** Tipografía de lectura editorial en `Plus Jakarta Sans` y titulares en `Playfair Display`, metadatos completos (fecha, autor, tiempo de lectura calculado), imagen hero con caption, navegación siguiente/previo y soporte completo para comentarios nativos de Shopify (`{% if blog.comments_enabled? %}`).

### 4. `sections/main-search.liquid` (`templates/search.json`)
- Conteo de resultados dinámico.
- Filtros facetados progresivos utilizando el mismo componente `<facet-filters-form>` desarrollado para colecciones.
- Selector de pestañas por tipo de recurso (*All*, *Products*, *Journal*, *Pages*).
- Grilla de productos con `product-card.liquid` y tarjetas limpias para artículos/páginas.

### 5. `sections/main-404.liquid` (`templates/404.json`)
- Mensaje editorial de cortesía ("The requested page is not in our current series").
- Buscador accesible integrado y botón "Return to collection".
- Vitrina de colecciones o productos sugeridos para evitar el abandono de la sesión.

### 6. `sections/main-password.liquid` (`templates/password.json`)
- Pantalla de prelanzamiento a pantalla completa.
- Captura de correo para lista de espera (`{% form 'customer' %}`).
- Modal o drawer accesible para desbloquear con la contraseña del comercio (`{% form 'storefront_password' %}`).

### 7. `sections/main-list-collections.liquid` (`templates/list-collections.json`)
- Grilla editorial de colecciones con imagen representativa, título, conteo de piezas y enlace directo.

---

## 4. Criterios de Aceptación y Validación

1. `node --check assets/theme.js` retorna código `0`.
2. `npx shopify theme check` reporta **0 ofensas** en todos los archivos del tema.
3. El archivo `sections/main-placeholder.liquid` queda **100% libre de referencias** en todas las plantillas `templates/*.json`.
4. Todos los formularios (`contact`, `search`, `customer`, `storefront_password`, `comments`) son accesibles según WCAG 2.2 AA y funcionan como mejora progresiva sin depender de JavaScript.
5. Tap targets $\ge$ 44x44px en todos los botones y campos de entrada.
6. Cero texto en inglés hardcodeado en Liquid (100% en `locales/en.default.json`).
7. Informe de entrega registrado en: `agent-comms/outbox-gpt/GPT-3B-004-content-and-system-templates.md`.
8. **No realizar commit ni push.**
