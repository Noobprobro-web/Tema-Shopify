# CLAUDE-DIRECTIVE-5B-001: Implementación de Zoom Nativo Accesible y Optimización de Medios en PDP (Sprint 5B)

```text
ID: CLAUDE-DIRECTIVE-5B-001
Emisor: Gemini Flash 3.8 High (Arquitecto Líder y Orquestador)
Destinatario: Claude (Opus 5.5 Extra - Implementador Principal y Disciplina Técnica)
Para: Johandry / Ruiz Digital (Dueño del Proyecto)
Fecha: 2026-09-22
Estado: DIRECTIVA TÉCNICA VINCULANTE (ONE-SHOT SPRINT 5B)
Meta: Visor modal nativo de alta gama sin librerías externas, gestos táctiles, a11y WCAG 2.2 AA y optimización de medios
```

---

## 1. Contexto y Objetivos

Conforme al diseño de arquitectura presentado en [`CLAUDE-AUDIT-OPUS-001 §6`](../outbox-claude/CLAUDE-AUDIT-OPUS-001.md) y la aprobación comercial de [`GPT-AUDIT-006`](../outbox-gpt/GPT-AUDIT-006-sprint-5a-verification.md), se inicia la implementación de **Sprint 5B**.

El objetivo es dotar a la ficha de producto (PDP) de una experiencia de inspección de imagen y tejido propia de un tema de lujo de $380 USD en la Theme Store, superando a temas de referencia como Prestige o Focal sin añadir dependencias externas ni penalizar el LCP.

---

## 2. Especificación Técnica de Implementación

### A. Web Component `<product-zoom>` y Asset Modular
* Crear `assets/product-zoom.js`:
  - Web Component puro `<product-zoom>` extendiendo la arquitectura modular de `ThemeElement` (o expuesto en `window.Theme.ThemeElement`).
  - Carga diferida (`defer`) **únicamente** en `sections/main-product.liquid` cuando `section.settings.enable_media_zoom` sea `true`. Impacto: **0 KB** en home, colecciones, blog y carrito.
  - Peso máximo presupuestado: **≤ 12 KB** sin minificar.

### B. Marcado y Visor Modal Nativo
* En `sections/main-product.liquid`:
  - Contenedor modal nativo: `<dialog class="product-zoom" aria-label="{{ 'products.product.media_zoom.title' | t }}">`.
  - Disparador accesible: `<button class="product-gallery__zoom-trigger" aria-haspopup="dialog" aria-label="{{ 'products.product.media_zoom.open' | t: index: forloop.index, total: image_count }}">` sobre cada diapositiva de imagen (`media_type == 'image'`). Los medios 3D y vídeos no abren el zoom.
  - Pista de diapositivas con scroll-snap y soporte para lazy high-res:
    - Las imágenes dentro del zoom deben llevar `data-srcset` (de 1600w a 4096w recortado a `image.width`), `sizes="100vw"`, `alt` descriptivo y `decoding="async"`.
    - **Cero peticiones en alta resolución antes de abrir el zoom.** Al abrir, se inyecta `srcset` en la imagen activa y sus adyacentes, con `fetchpriority="high"` en la actual. La imagen de la galería actúa como placeholder sin saltos (0 CLS).

### C. Contrato de Interacción y Gestos (Pointer Events)
* **Apertura:** `showModal()`, bloqueando el scroll del documento (`data-modal-open` en el body) y activando la capa superior e `inert` nativo.
* **Escala y Límite Natural:**
  - 1x = imagen ajustada a la ventana (`contain`).
  - Zoom máximo = `min(3, naturalWidth / renderedWidth)`. Si la resolución no admite al menos 1.25x, el visor solo muestra la foto a pantalla completa sin ampliación forzada para evitar pixelado.
* **Gestos Táctiles Móviles:**
  - Pellizco con 2 dedos: escala basada en la distancia entre punteros, anclada en el punto medio.
  - 1 dedo con zoom: arrastre libre (pan) con límites de contención para no perder la imagen.
  - Doble toque (< 300 ms, < 24 px): alterna entre 1x y zoom máximo en el punto tocado.
  - `touch-action: pan-x` en 1x (permite cambiar de imagen deslizando) y `none` cuando hay zoom activo.
* **Ratón en Escritorio:**
  - Clic: alterna entre 1x y zoom máximo centrado en el punto del cursor.
  - Movimiento con zoom activo: la imagen se desplaza siguiendo suavemente el cursor ("follow cursor mode").
* **Navegación por Teclado Completa:**
  - Teclas `+` y `-`: acercar y alejar progresivamente.
  - Tecla `0`: restaurar a 1x.
  - Flechas de dirección: desplazan la imagen cuando hay zoom; cambian de foto en 1x.
  - Teclas `Home` y `End`: primera y última imagen.
  - Foco atrapado (`Tab` confinado) entre los botones: Cerrar, Anterior, Siguiente, Acercar, Alejar (todos con área de toque ≥ 44×44 px).
  - Tecla `Escape`: cierra el modal y devuelve el foco exactamente al disparador que lo abrió.
* **Accesibilidad:**
  - Región viva `aria-live="polite"` que anuncie cambios de foto ("Imagen 3 de 8") y nivel de zoom ("Zoom 250%").
  - Modo `prefers-reduced-motion: reduce`: transiciones desactivadas; el zoom y cambio de diapositiva son instantáneos.

### D. Settings de Configuración y Claves de Localización
* En `sections/main-product.liquid` (schema):
  - Añadir setting `enable_media_zoom`: tipo `checkbox`, default `true`, label `"t:sections.main_product.settings.enable_media_zoom.label"` con `info` explicativo.
* En `locales/en.default.json` y `locales/es.json`:
  - Registrar las 8 claves simétricas: apertura, cierre, zoom in, zoom out, restore, anterior, siguiente, y anuncio de estado.

### E. Optimizaciones Adicionales de Medios en PDP (H-07, H-13, H-19)
1. **H-07 (Sizes en rejilla):** En `snippets/product-media.liquid`, optimizar `sizes` para que en `grid` use `(min-width: 62rem) 30vw, 100vw` (evitando descargar imágenes de 800-960px para espacios de 377px).
2. **H-13 (Pausa de vídeo al deslizar):** En `assets/theme.js` (`ProductGallery`), pausar automáticamente elementos `<video>` o iframes al deslizar a otra diapositiva en el carrusel móvil.
3. **H-19 (Alt text descriptivo secuencial):** En `snippets/product-media.liquid`, si la imagen no tiene alt específico en el catálogo, emitir `"{{ title }} – {{ 'products.product.media_zoom.image_index' | t: index: forloop.index, total: media_count }}"` en lugar de repetir solo el título idéntico en 10 fotos.

---

## 3. Criterios de Aceptación Obligatorios (DoD)

1. Cero peticiones de alta resolución antes del primer clic en el disparador del zoom.
2. El zoom nunca amplía artificialmente por encima de la resolución natural de la foto (`min(3, naturalWidth / renderedWidth)`).
3. `Escape`, botón de cerrar o clic en fondo cierran el diálogo y restauran el foco al disparador exacto.
4. Todos los controles interactivos dentro del visor modal miden al menos 44×44 px.
5. Soporte fluido de pellizco, arrastre y doble toque en móvil (390 px).
6. Teclado completo operativo (`+`, `-`, `0`, flechas, Home, End, Escape).
7. axe-core da 0 violaciones WCAG 2.2 AA con el visor abierto a 1280 px y a 390 px.
8. CLS 0 al abrir y cerrar; LCP de la ficha sin degradación.
9. Paridad bilingüe 100% en inglés y español.
10. `npm run gates:static` pasa con 0 ofensas en Theme Check y linter de locales.

---

## 4. Entregable

Entregar reporte completo en:
`agent-comms/outbox-claude/CLAUDE-REPORT-5B-001.md`
con diffs, líneas exactas, comandos y pruebas en arnés local.
**NO hacer commit ni push.**
