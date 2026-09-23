# CLAUDE-REPORT-5B-001: Zoom nativo accesible y medios de la ficha (Sprint 5B)

```text
ID: CLAUDE-REPORT-5B-001 (responde a CLAUDE-DIRECTIVE-5B-001)
Estado: ENTREGADO. Sin commit ni push. Working tree listo para la auditoría de Gemini.
Base: master b1125bd (el código del tema es el de bba9977; 19b4dea y b1125bd solo tocan docs).
Decisión requerida:
  1. Gemini: auditar el diff (12 archivos: 10 del tema y 2 de tooling, +734 -13) y autorizar
     commit y despliegue.
  2. Gemini: aceptar o revertir las desviaciones de Nivel 1 D1 a D10 (§4). Ninguna cambia un id
     existente. El ajuste nuevo enable_media_zoom es el Nivel 2 que autoriza la directiva.
  3. Johandry: autorizar la colección qa-sprint-5b de CLAUDE-AUDIT-OPUS-001 §6.8 para la
     Compuerta 5 en vivo (pellizco en un iPhone real, vídeo de YouTube real, 10 o más fotos).
  4. Johandry: con las fotos actuales de la demo (928 y 1856 px de ancho) el zoom útil es de
     1,0x a 1,3x. Para vender "zoom de tejido" hacen falta originales de 3000 px o más (§6, R3).
Resumen en 5 líneas:
  1. <product-zoom> en assets/product-zoom.js (11.970 bytes, 3.892 en gzip, sin dependencias),
     cargado con defer solo por la ficha y solo con el ajuste activo: 0 bytes en colección y
     en la ficha con el ajuste apagado (medido).
  2. <dialog> con showModal(): cero peticiones de alta resolución antes de abrir; al abrir, la
     foto de la galería hace de marcador y el srcset (1600 a 4096 w, sin pasar del original)
     llega a la actual con fetchpriority high y a sus dos vecinas.
  3. Zoom máximo min(3, natural / pintado); por debajo de 1,25x no hay zoom. Pellizco anclado en
     el punto medio, arrastre, doble toque, clic con "seguir cursor", teclado completo, Tab
     atrapado, Escape al disparador exacto, región viva, movimiento reducido y 44 px.
  4. H-07 (sizes 30vw en rejilla), H-13 (pausa de <video>, YouTube y Vimeo al cambiar de
     diapositiva) y H-19 (alt "Título – Image n of N" sin alt de catálogo).
  5. Arnés 5B: 16/16 en inglés y 16/16 en español; 16/16 fallan en el árbol previo. gates:static
     exit 0; 118 archivos sin ofensas en la carpeta de Johandry; arneses anteriores sin cambios.
Archivos tocados: 10 del tema (§2), package.json y scripts/dataset-hooks.mjs (las compuertas
  ahora cubren product-zoom.js, D9 y D10), este informe y agent-comms/outbox-claude/harness-5B-001/
  (nuevo: render5b.mjs, zoom5b.spec.mjs, pw.config.mjs y 5B-001-theme.diff).
Desviaciones (Nivel 1 o Nivel 2): D1 a D10 de Nivel 1 (§4). Nivel 2 autorizado: enable_media_zoom.
Hallazgos extra y riesgos: §6. Dos defectos propios que el arnés encontró antes de entregar (§6.1).
Verificación (comando, resultado y qué demuestra/qué no): §7.
Lista de afirmaciones falsables numeradas: §10.
```

---

## 1. Qué cambia para el comprador y el comerciante

| Tarea | Antes | Ahora |
|---|---|---|
| Ver una foto en grande | No había visor. La foto de la galería era todo | Clic o toque en cualquier foto abre un visor a pantalla completa en esa foto. La lupa de 44 px en la esquina marca que se puede |
| Ampliar en móvil | Solo el zoom del navegador, que movía toda la página | Pellizco anclado entre los dedos, arrastre con un dedo, doble toque que alterna 1x y máximo en el punto tocado, botón "Reset zoom" / "Restablecer zoom" |
| Ampliar en escritorio | Nada | Clic alterna 1x y máximo en el punto del cursor; con zoom, la foto sigue al cursor para recorrer el tejido |
| Teclado y lector | Nada | `+` `-` `0`, flechas (desplazan con zoom, cambian de foto sin él), Home, End, Escape. Tab no sale del visor. "Image 3 of 4, zoom 150%" / "Imagen 3 de 4, zoom 150 %" en región viva |
| Foto pequeña (600 px) | | Se ve a pantalla completa sin ampliar más allá de sus píxeles; "Zoom in" queda inactivo |
| Vídeo y 3D | | No abren el visor. Conservan sus controles |
| Vídeo al deslizar el carrusel | Seguía sonando fuera de la vista (solo se pausaba en el modo miniaturas) | `<video>` se pausa; YouTube y Vimeo reciben la orden de pausa |
| Descarga de fotos en rejilla de escritorio | Cada foto pedía el ancho de 60vw aunque ocupa media columna | 30vw por foto; la primera, si el total es impar, sigue en 60vw porque ocupa las dos columnas |
| Alt sin texto de catálogo | Diez fotos con el mismo alt ("Serra Coat") | "Serra Coat – Image 2 of 5" / "Serra Coat – Imagen 2 de 5". El alt del catálogo se respeta; con una sola foto, el título |
| Comerciante | | "Enable image zoom" en la sección de producto, activo de serie, con una nota sobre subir fotos de 3000 px o más |

---

## 2. Archivos tocados (árbol final, líneas exactas)

| Archivo | Cambio | Líneas |
|---|---|---|
| `assets/product-zoom.js` | nuevo, +288 | todo el archivo (§3) |
| `assets/theme.js` | +23 -2 | 78 (selector de `data-modal-open`), 81-94 (`pauseMedia`), 459-461 (`applySlide`), 498 (`selectMedia`), 4226-4234 (`ThemeCore` expone `syncDialogScrollLocks`) |
| `assets/base.css` | +188 | 7774-7960, bloque "5B-001. Zoom de imagen de la ficha" |
| `sections/main-product.liquid` | +49 -1 | 44-55 (estado del zoom), 76-100 (sizes y disparador), 169-171 (render del visor), 835-841 (ajuste) |
| `snippets/product-zoom.liquid` | nuevo, +115 | marcado del visor (D1) |
| `snippets/media-alt.liquid` | nuevo, +18 | alt de H-19 (D2) |
| `snippets/product-media.liquid` | +4 -2 | 8 (documenta `sizes`), 11-12 |
| `locales/en.default.json` | +12 | 386-397, `products.product.media_zoom` |
| `locales/es.json` | +12 | 386-397 |
| `locales/en.default.schema.json` | +4 | 951-954 |
| `package.json` | +1 -1 | 15, `gates:syntax` (D9) |
| `scripts/dataset-hooks.mjs` | +20 -7 | lee todos los `assets/*.js` y clases anónimas (D10) |

El diff unificado completo está en `harness-5B-001/5B-001-theme.diff` (931 líneas).

### 2.1 main-product.liquid
```liquid
# sections/main-product.liquid:49-55, dentro del {%- liquid %} inicial (comentario en 44-48)
assign zoom_images = product.media | where: 'media_type', 'image'
assign zoom_enabled = false
if section.settings.enable_media_zoom and zoom_images.size > 0
  assign zoom_enabled = true
endif
assign zoom_position = 0
assign odd_media = product.media.size | modulo: 2
```
```liquid
# sections/main-product.liquid:76-100, dentro del bucle de la galería (resumido)
assign media_sizes = '(min-width: 62rem) 60vw, 100vw'
if section.settings.media_layout == 'grid' and product.media.size > 1
  unless forloop.first and odd_media == 1
    assign media_sizes = '(min-width: 62rem) 30vw, 100vw'
  endunless
endif
{% render 'product-media', media: media, product: product, prioritize: forloop.first, sizes: media_sizes %}
{%- if zoom_enabled and media.media_type == 'image' -%}
  {%- assign zoom_position = zoom_position | plus: 1 -%}
  <button class="product-gallery__zoom-trigger" type="button" aria-haspopup="dialog"
    aria-label="{{ 'products.product.media_zoom.open' | t: index: zoom_position, total: zoom_images.size | escape_once }}"
    data-zoom-open="{{ zoom_position | minus: 1 }}">
    <span class="product-gallery__zoom-icon" aria-hidden="true">{%- render 'icon', name: 'search', size: 18 -%}</span>
  </button>
{%- endif -%}
```
Línea 169: `{%- if zoom_enabled -%}{% render 'product-zoom', product: product, images: zoom_images %}{%- endif -%}`, fuera de `<product-gallery>` y dentro de la sección. Ajuste en 835-841: checkbox `enable_media_zoom`, label e info con `t:sections.main_product.settings.enable_media_zoom.*`, default `true`.

### 2.2 snippets/product-zoom.liquid (visor)
- `<product-zoom data-status-template="…status con [index] [total] [zoom]…">` y dentro `<dialog class="product-zoom" aria-label="{{ 'products.product.media_zoom.title' | t | escape_once }}">`.
- Barra superior: contador visual `1 / N` (`aria-hidden`), "Reset zoom" (texto, oculto a 1x) y Cerrar.
- Pista `role="group" tabindex="0"` con `aria-label` de la galería y una `<figure>` por imagen:
  ```liquid
  <img class="product-zoom__image" src="data:image/gif;base64,R0lGOD…" data-srcset="{{ zoom_srcset }}"
    sizes="100vw" width="{{ zoom_width }}" height="{{ zoom_height }}" alt="{{ zoom_alt | escape_once }}"
    decoding="async" draggable="false" data-width="{{ zoom_width }}" data-ratio="{{ zoom_image.aspect_ratio }}">
  ```
  `zoom_width = image.width | at_most: 4096`. Candidatos 1600, 2000, 2400, 3000 y 3600 cuando son menores que ese ancho, más el propio ancho: una foto de 3000 px da `1600w, 2000w, 2400w, 3000w`; una de 600 px, solo `600w`.
- Barra inferior: Anterior, Alejar, Acercar, Siguiente (`icon-button`, 44 px).
- `<p class="visually-hidden" aria-live="polite" aria-atomic="true">`.
- `<script src="{{ 'product-zoom.js' | asset_url }}" defer="defer"></script>`, solo aquí.

### 2.3 theme.js (H-13 y dos piezas compartidas)
```diff
-    document.body.toggleAttribute('data-modal-open', Boolean(document.querySelector('…, product-card-variants[data-modal]')));
+    document.body.toggleAttribute('data-modal-open', Boolean(document.querySelector('…, product-card-variants[data-modal], product-zoom[data-open]')));
+  const pauseMedia = (container) => {
+    container.querySelectorAll('video').forEach((video) => video.pause());
+    container.querySelectorAll('iframe').forEach((frame) => {
+      const source = frame.getAttribute('src') || '';
+      if (source.includes('youtube')) {
+        frame.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
+      } else if (source.includes('vimeo')) {
+        frame.contentWindow?.postMessage('{"method":"pause"}', '*');
+      }
+    });
+  };
@@ applySlide(index, announce)
       this.currentSlide = index;
+      this.slides.forEach((slide, position) => {
+        if (position !== index) pauseMedia(slide);
+      });
@@ selectMedia(mediaId, announce)
-        if (!selected) item.querySelector('video')?.pause();
+        if (!selected) pauseMedia(item);
@@ window.ThemeCore
+    syncDialogScrollLocks,
```

### 2.4 product-media.liquid y media-alt.liquid (H-07, H-19)
```diff
-{%- assign media_alt = media.alt | default: product.title -%}
+{%- capture media_alt -%}{% render 'media-alt', media: media, product: product %}{%- endcapture -%}
+{%- assign media_sizes = sizes | default: '(min-width: 62rem) 60vw, 100vw' -%}
-      sizes: '(min-width: 990px) 60vw, 100vw',
+      sizes: media_sizes,
```
```liquid
{%- if media.alt != blank -%}
  {{- media.alt -}}
{%- elsif product.media.size > 1 -%}
  {{- product.title }} – {{ 'products.product.media_zoom.image_index' | t: index: media.position, total: product.media.size -}}
{%- else -%}
  {{- product.title -}}
{%- endif -%}
```
El snippet devuelve texto sin escapar y quien lo pinta lo escapa una vez (`image_tag` en la galería, `escape_once` en el visor).

### 2.5 Locales (en | es), `products.product.media_zoom`
| Clave | en | es |
|---|---|---|
| title | Image zoom | Zoom de imagen |
| open | Zoom image {{ index }} of {{ total }} | Ampliar imagen {{ index }} de {{ total }} |
| close | Close zoom | Cerrar zoom |
| zoom_in | Zoom in | Acercar |
| zoom_out | Zoom out | Alejar |
| reset | Reset zoom | Restablecer zoom |
| previous | Previous image | Imagen anterior |
| next | Next image | Imagen siguiente |
| status | Image {{ index }} of {{ total }}, zoom {{ zoom }}% | Imagen {{ index }} de {{ total }}, zoom {{ zoom }} % |
| image_index | Image {{ index }} of {{ total }} | Imagen {{ index }} de {{ total }} |

Schema: "Enable image zoom" con info "Opens product images in a full-screen viewer with click, pinch and keyboard zoom. Zoom stops at the resolution of the uploaded file: for close-up detail, upload images at least 3000 px wide."

---

## 3. product-zoom.js: contrato del componente

`customElements.define('product-zoom', class extends window.ThemeCore.ThemeElement { … })`, clase anónima, sin globales nuevas. Hereda `listen` (AbortController: todo se desmonta en `disconnectedCallback`), `trapFocus` y `syncDialogScrollLocks` de `ThemeCore`.

| Pieza | Líneas | Qué hace |
|---|---|---|
| `connectedCallback` | 8-40 | Un solo `click` delegado en la sección para `[data-zoom-open]`; botones; `keydown` y `close` del diálogo; `scroll` de la pista con rAF; Pointer Events; `touchmove` no pasivo que cancela solo con 2 dedos o con zoom; `resize` |
| `open` | 47-58 | `showModal()`, `data-open` en el componente (y `data-modal-open` en body vía `syncDialogScrollLocks`), dirección RTL, `trapFocus` con foco en Cerrar, `layout()` y `goTo(index, false)` |
| `handleClose` | 60-69 | Evento `close` (Escape nativo, Cerrar o fondo): libera el foco, limpia gestos, vuelve a 1x, quita `data-open` y enfoca el disparador exacto |
| `layout` | 72-88 | 1x = `min(ancho de pista, alto × proporción, ancho natural)`; `max = min(3, natural / 1x)`. Fija ancho y alto en píxeles: sin salto al llegar la foto grande |
| `select` y `load` | 107-138 | Cambia de foto a 1x, pide la actual y sus vecinas, contador y anuncio. `load`: `fetchPriority = 'high'` en la actual, `src` = `currentSrc` de la galería y, tras `decode()`, `srcset` |
| `apply` | 151-168 | Acota el desplazamiento, `translate3d() scale()`, `data-zoomable` (máx ≥ 1,25), `data-zoomed`, estado de Acercar, Alejar y Reset; si el botón con foco queda inactivo u oculto, el foco pasa al siguiente disponible |
| `zoomTo` | 170-183 | Punto fijo t' = P − (P − t)·s'/s. Por debajo de 1,01 vuelve a 1. El primer zoom cambia `sizes` al ancho ampliado para que el srcset suba de candidato |
| `handlePointer` | 198-241 | Pellizco absoluto desde el estado inicial: escala por la razón de distancias y la foto sigue al punto medio. Arrastre táctil con un dedo; ratón con "seguir cursor" |
| `tap` | 244-262 | Ratón: clic en la foto alterna; fuera y a 1x, cierra. Táctil: doble toque < 300 ms y < 24 px alterna; un toque fuera a 1x cierra tras 300 ms |
| `handleKey` | 264-280 | `+`/`=`, `-`/`_`, `0`, Home, End, flechas (desplazan un 15 % con zoom; sin zoom cambian de foto, invertidas en RTL) |
| `announce` | 282-287 | Rellena la plantilla traducida: "Image 3 of 4, zoom 250%" |

CSS (base.css 7774-7960): `touch-action: pan-x` en la diapositiva a 1x y `none` con `data-zoomed`; `will-change: transform` y transición anulada solo con `data-gesture`; transición de `transform` con `--motion-fast`, que los interruptores globales de movimiento (`prefers-reduced-motion` y `data-animations='none'`) ya anulan; `.no-js` oculta el disparador.

---

## 4. Desviaciones de Nivel 1 (reversibles, sin tocar ids)

| # | Directiva o §6 | Implementado | Por qué |
|---|---|---|---|
| D1 | Marcado en main-product.liquid | `snippets/product-zoom.liquid`, que solo pinta main-product | Con el marcado dentro, Theme Check daba LiquidComplexity 121 > 120 en la sección |
| D2 | Alt de H-19 en product-media.liquid | `snippets/media-alt.liquid`, usado por product-media y por el visor | El mismo alt en la galería y en el zoom sin duplicar la regla |
| D3 | 8 claves | 10: las 8 más `title` (aria-label del diálogo, que la propia directiva cita) e `image_index` (la de H-19, también citada) | Las dos las pide el texto de la directiva |
| D4 | `aria-label` con `forloop.index` y `image_count` | Posición entre imágenes (`zoom_position`) y total de imágenes | Con un vídeo en medio, `forloop.index` daría "Zoom image 5 of 4". Así coincide con el contador del visor |
| D5 | Anuncio "Imagen 3 de 8" y "Zoom 250%" | Un solo anuncio: "Image 3 of 8, zoom 250%" | Una región atómica, sin que el segundo mensaje pise al primero |
| D6 | Tab entre Cerrar, Anterior, Siguiente, Acercar y Alejar | Además la pista (`role="group"`, `tabindex="0"`) y "Reset zoom", visible solo con zoom | La pista enfocable da nombre a la galería y recibe las flechas sin robar el foco a un botón; Reset es el atajo táctil de volver a 1x |
| D7 | §6.3: al cerrar, la galería se sitúa en la última foto vista | El foco vuelve al disparador exacto y la galería no se mueve | La directiva exige el disparador exacto; mover la galería dejaría el foco en una foto fuera de la vista |
| D8 | `src` del zoom | GIF transparente en línea hasta abrir; al abrir, `currentSrc` de la galería y luego el srcset | Cero peticiones y marcador sin salto |
| D9 | `gates:syntax` solo miraba theme.js | `node --check assets/theme.js && node --check assets/product-zoom.js` | Sin esto, un error de sintaxis en el asset nuevo pasaría las compuertas |
| D10 | `gates:hooks` solo leía theme.js y clases con nombre | Lee todos los `assets/*.js` y `customElements.define('tag', class extends …)` | `<product-zoom>` lee `data-status-template`; con el script anterior ese contrato no se comprobaba. Prueba negativa en §7.1 |

Además: el `sizes` por defecto del snippet pasa de `990px` a `62rem`, el mismo corte de base.css (16 media queries con `min-width: 62rem`). Afecta también a `featured-product`, que usa el snippet sin pasar `sizes`: 2 px de diferencia en el corte.

---

## 5. Compuertas de la directiva (DoD §3)

| # | Criterio | Evidencia | Estado |
|---|---|---|---|
| 1 | 0 peticiones en alta resolución antes del primer clic | Z1: recorrido de toda la página sin abrir, 0 URLs ≥ 1600 w y 0 `srcset` en el visor. Al abrir en la foto 1: pide large y demo (vecina), no soft ni small; `fetchPriority` high | arnés |
| 2 | Nunca por encima de la resolución natural | Z2: foto de 3000 px, máx 3 y matriz de transformación 3,00; foto de 928 px, máx entre 1,25 y 1,6 y la matriz no lo pasa; foto de 600 px, máx 1, no ampliable y Acercar inactivo | arnés |
| 3 | Escape, Cerrar y fondo cierran y devuelven el foco exacto | Z3 (teclado y ratón, disparador 2 de 4) y Z7 (toque fuera a 1x). `data-modal-open` entra y sale | arnés |
| 4 | Controles ≥ 44×44 | Z4 a 1280 y 390 con zoom: los 6 botones visibles (Reset, Cerrar, Anterior, Alejar, Acercar, Siguiente) miden 44 o más | arnés |
| 5 | Pellizco, arrastre y doble toque a 390 | Z7 con toques CDP reales: doble toque a máx y de vuelta, pellizco fuera del centro con x = P(1 − s) al píxel, arrastre, Reset, deslizar a la foto 2 | arnés; iPhone real pendiente (R1) |
| 6 | Teclado completo | Z5 (+, -, 0, flechas, Home, End, anuncios), Z2, Z3, Z4 | arnés |
| 7 | axe 0 violaciones con el visor abierto a 1280 y 390 | AXE × 2 (wcag2a, 2aa, 21a, 21aa, 22aa) con zoom 1,5x | arnés |
| 8 | CLS 0 y LCP sin degradar | Z13: CLS 0 al abrir, cambiar de foto y cerrar. LCP: mismo elemento, misma URL, `fetchpriority=high` y la misma mediana en 5 cargas (§7.3) | arnés; Lighthouse en vivo pendiente |
| 9 | Paridad bilingüe | 394 claves en y es, mismos placeholders, 0 problemas; arnés 16/16 en es | compuertas |
| 10 | gates:static | exit 0; Theme Check 0 ofensas (84 archivos en la copia, 118 en la carpeta de Johandry) | compuertas |

Presupuesto: `product-zoom.js` pesa 11.970 bytes sin minificar (288 líneas), bajo 12 KB se lea como 12.000 o como 12.288 bytes. 3.892 bytes en gzip.

---

## 6. Hallazgos, riesgos y estados degenerados

### 6.1 Defectos propios que el arnés encontró antes de entregar
- **Clic para alejar no funcionaba en escritorio.** Con zoom, `pointerdown` captura el puntero en la pista y el `pointerup` llega con `target` = pista, así que `tap()` creía que el clic era fuera de la foto. Ahora usa el `target` del `pointerdown` (`handlePointer`, línea 239). Z6 falla sin el arreglo ("Expected: 1, Received: 3").
- **El pellizco derivaba del punto medio.** El navegador entrega un `pointermove` por dedo; con el cálculo incremental, cada evento intermedio movía el ancla y a 3x la foto quedaba 5,8 px fuera. El pellizco ahora se calcula siempre desde su estado inicial (líneas 220-225): el resultado solo depende de la posición final de los dedos y, de paso, dos dedos que se desplazan también mueven la foto. Z7 lo comprueba al píxel.
- **Arnés con assets copiados.** `render5b.mjs` copiaba `assets/` y servía una versión vieja. Ahora lo enlaza al árbol bajo prueba (con copia de respaldo si el sistema no admite enlaces).

### 6.2 Riesgos
- **R1, Safari iOS.** Chromium con toques CDP no reproduce el pellizco nativo de iOS. La defensa es doble (`touch-action: none` con zoom y `touchmove` no pasivo que cancela con 2 dedos), pero hay que probarlo en un iPhone real en la Compuerta 5.
- **R2, YouTube y Vimeo.** La pausa por `postMessage` exige que el iframe de Shopify tenga la API activa (`enablejsapi=1` en YouTube). El arnés comprueba que el mensaje sale con el formato de cada plataforma, no que el reproductor real lo obedezca. Verificar en vivo con un vídeo externo.
- **R3, fotografía.** Con las fotos de la demo (928 × 1152 y 1856 × 2304) el visor es útil para ver en grande, pero el zoom real queda entre 1x y 1,3x. Es el comportamiento pedido (nunca pixelar). La info del ajuste lo explica al comerciante.
- **R4, editor de temas.** Si el comerciante activa el ajuste con la ficha abierta en el editor, la sección se vuelve a pintar pero un `<script>` insertado así no se ejecuta: el zoom aparece al recargar la vista previa. Con el ajuste activo de serie, el caso normal no lo sufre. Al reordenar o volver a pintar la sección, `disconnectedCallback` cierra el diálogo y el componente nuevo se monta solo.
- **R5, peso.** Fuera de la ficha, 0 bytes de JS. El CSS del visor vive en base.css como pedía §6.2 (+4.306 bytes, +811 en gzip) porque el disparador tiene que pintarse con la galería sin salto. El HTML de la ficha crece con cada foto (el srcset lleva hasta 6 URLs): +7,3 KB para 4 fotos en el arnés.
- **R6, RTL.** El código invierte flechas y desplazamiento con `direction: rtl`, pero el tema no trae un idioma RTL y no está probado.

### 6.3 Estados degenerados
| Estado | Resultado | Cómo se comprueba |
|---|---|---|
| Ajuste apagado | Sin disparadores, sin `<product-zoom>` y sin petición de product-zoom.js | Z12 |
| Colección y resto de páginas | 0 peticiones de product-zoom.js | Z12 |
| Producto solo con vídeo o 3D | `zoom_images.size` 0: sin visor ni script | lectura de 44-55 |
| Producto sin medios | Marcador de la galería, sin zoom | lectura de 44-55 |
| Una sola foto | Contador "1 / 1", Anterior y Siguiente inactivos, alt = título | Z11 |
| Foto menor que la ventana (600 px) | Pantalla completa sin ampliar; clic no hace nada, "Zoom in" inactivo | Z2 |
| Foto mayor de 4096 px | `data-width` y último candidato en 4096 | lectura de product-zoom.liquid |
| Sin JS | `.no-js` oculta el disparador; la galería queda igual que antes | base.css 7791 |
| Vídeo en medio de las fotos | No abre el zoom; las etiquetas cuentan solo imágenes (D4) | Z9, Z11 |
| Alt de catálogo presente | Se respeta ("Detail of the collar") | Z11 |
| Cambio de tamaño u orientación con el visor abierto | `layout()` recalcula 1x y máximo y mantiene la foto | lectura de 72-88 |
| Movimiento reducido | Cambio de foto instantáneo y transición de escala 0 s | Z8 |

---

## 7. Verificación

### 7.1 Compuertas (copia en la nube, árbol final, carpetas `site*` del arnés fuera del árbol)
```text
$ npm run gates:static                                                        exit 0
  Archivos .json comprobados: 42 | Fallos de parseo: 0
  JS leido: assets/product-zoom.js, assets/theme.js | <product-zoom> 1 claves 1 montaje(s) | Contratos rotos: 0
  [theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado volvio a 0 ofensas.
  Claves en en.default.json: 394 hojas | Sin resolver en storefront: 0 | Sin resolver en schema: 0 | Huerfanas en storefront: 0
  Filas de requisito: 53 | Incoherencias: 0
  84 files inspected with no offenses found.
  > node --check assets/theme.js && node --check assets/product-zoom.js      ok
  Your local theme was packaged in Sartorial-1.0.0.zip   (98 archivos; incluye assets/product-zoom.js, snippets/media-alt.liquid y snippets/product-zoom.liquid)
$ paridad en/es (claves y placeholders {{ }})                                  394 / 394, 0 problemas
$ wc -c assets/product-zoom.js ; gzip -9c | wc -c                             11970 ; 3892
```
Antes del sprint: 384 claves y 82 archivos sin ofensas. Con las carpetas `site*` del arnés dentro del árbol, Theme Check cuenta 90 archivos, porque lee sus JSON de fixtures; por eso no se entregan.

Prueba negativa de D10: en una copia con `data-status-template` renombrado, el `dataset-hooks.mjs` nuevo sale con 1 y "`<product-zoom>`: data-status-template (lo monta snippets/product-zoom.liquid y ninguno lo emite)"; el script anterior sale con 0 y 0 contratos rotos.

### 7.2 En la carpeta de Johandry (después de entregar)
```text
md5sum -c (16 archivos, LF)                                    16/16 OK
npm run gates:json | gates:hooks | gates:locales | gates:ledger | gates:syntax    exit 0 los cinco
  Archivos .json comprobados: 70, 0 fallos | Contratos rotos: 0 | 394 hojas, 0 sin resolver | 53 filas, 0 incoherencias
./node_modules/.bin/shopify theme check --no-color             118 files inspected with no offenses found.   exit 0
node harness-ML-001/locale-parity.mjs .                        es.json: 394 claves, 0 problemas
python3 harness-LOCALE-001/liquid-literals.py .                48 archivos Liquid, 0 hallazgos
grep "| t: ... | escape" en sections snippets layout templates  0
git status --short (tema)   M: base.css, theme.js, 3 locales, main-product, product-media, package.json,
                            dataset-hooks.mjs (+ main-search.liquid, solo CRLF, previo)
                            ??: product-zoom.js, media-alt.liquid, product-zoom.liquid, harness-5B-001/
git diff --ignore-cr-at-eol --stat                             9 files changed, 313 insertions(+), 13 deletions(-)
```
No corrí `gates:sanity` (deja un sandbox que el puente no puede borrar) ni `gates:package` (sobrescribe `Sartorial-1.0.0.zip`) en la carpeta de Johandry; los dos pasan en la copia.

### 7.3 Arnés 5B (`harness-5B-001/`: Liquid real con liquidjs, `theme.js`, `product-zoom.js` y `base.css` reales, Chromium)
```text
SITE=site         16 passed      SITE=site-es     16 passed
SITE=site-before (árbol b1125bd)  16 failed
```
| Prueba | Qué comprueba | En el árbol previo falla con |
|---|---|---|
| Z1 | 0 alta resolución antes de abrir; actual y vecina al abrir; fetchpriority | no hay disparador |
| Z2 | máx 3, entre 1,25 y 1,6, y 1 según la foto; matriz real; `sizes` sube a un candidato ≥ 2000 | no hay disparador |
| Z3 | Escape, Cerrar y fondo; foco exacto; `data-modal-open` | no hay disparador |
| Z4 × 2 | 44 px y Tab atrapado a 1280 y 390 | no hay disparador |
| Z5 | teclado y anuncios | no hay disparador |
| Z6 | clic alterna, "seguir cursor", clic con zoom vuelve a 1x | no hay disparador |
| Z7 | táctil 390: doble toque, pellizco anclado, arrastre, Reset, deslizar, toque fuera cierra y devuelve el foco | no hay disparador |
| Z8 | movimiento reducido | no hay disparador |
| Z9 | H-13: `pause()` al salir del vídeo; `pauseVideo` al iframe de YouTube; vídeo sin disparador | "Expected: > 0, Received: 0" |
| Z10 | H-07: 30vw en la segunda foto, 60vw en la primera impar y en pila; `currentSrc` ≤ 640 w | "Expected (min-width: 62rem) 30vw, 100vw, Received (min-width: 990px) 60vw, 100vw" |
| Z11 | H-19: alts secuenciales, alt real intacto, etiqueta "Zoom image 3 of 4", una sola foto | alts "Serra Coat" repetidos |
| Z12 | ajuste apagado y colección sin script; ficha con 1 petición | "Expected: 1, Received: 0" |
| Z13 | CLS 0 al abrir, cambiar y cerrar | no hay disparador |
| AXE × 2 | 0 violaciones WCAG 2.2 AA, visor abierto y ampliado | no hay disparador |

LCP y bytes (5 cargas por caso, Chromium local, sin red real):
```text
site-before 1280  LCP .product-gallery__image zoom-large.png?width=800 high eager  mediana 132 ms  CLS 0       408.017 B
site        1280  LCP .product-gallery__image zoom-large.png?width=800 high eager  mediana 132 ms  CLS 0       432.645 B
site-before  390  LCP .product-gallery__image zoom-large.png?width=480 high eager  mediana  96 ms  CLS 0,0160  407.493 B
site         390  LCP .product-gallery__image zoom-large.png?width=480 high eager  mediana  96 ms  CLS 0,0137  432.121 B
```
Demuestra que el elemento LCP, su petición y su prioridad no cambian. No sustituye a Lighthouse en la tienda. El CLS de carga a 390 existe antes y después (no es del visor; el del visor es 0, Z13). Los +24,6 KB son product-zoom.js (11.970, diferido), base.css (+4.306), theme.js (+1.029) y el HTML (+7.323); las fotos del arnés son PNG lisos servidos igual para cualquier `width`, así que el ahorro de H-07 no se ve aquí.

### 7.4 Arneses anteriores (renders regenerados desde el árbol final, assets enlazados)
```text
Arnés 5A-003 (28 pruebas)             en 28/28   es 28/28
Arnés 5A (colección, 36 pruebas)      en 36/36   es 36/36
Arnés heredado 4B a 4F (106 pruebas)  101/106; los 5 fallos son typescale T1, los mismos 5 que antes del sprint (E6 de 5A-003)
```

### 7.5 Comandos del arnés 5B (desde `agent-comms/outbox-claude/harness-5B-001/`, con liquidjs y @playwright/test)
```text
OUT_DIR=site node render5b.mjs
OUT_DIR=site-es LOCALE_FILE=locales/es.json LOCALE_ISO=es node render5b.mjs
OUT_DIR=site-before THEME_ROOT=<árbol en b1125bd> node render5b.mjs
SITE=site    npx playwright test -c pw.config.mjs
SITE=site-es npx playwright test -c pw.config.mjs
SITE=site-before npx playwright test -c pw.config.mjs
```
`CHROMIUM_PATH` opcional. Servidor en 127.0.0.1:8112. Resultados en el temporal del sistema (`PW_OUTPUT` para cambiarlo), fuera del árbol. Las fotos son PNG lisos generados con el tamaño de cada fixture (3000, 1856, 928 y 600 px de ancho).

---

## 8. Compuerta 5 pendiente (en vivo, con autorización de Johandry)
1. Colección `qa-sprint-5b` de CLAUDE-AUDIT-OPUS-001 §6.8 (10 o más fotos, 21:9, 2:5, 600 px, vídeo, vídeo externo, 3D, sin fotos, una foto).
2. iPhone real: pellizco, doble toque, arrastre y que la página no haga su propio zoom (R1).
3. Vídeo de YouTube real: se pausa al deslizar (R2).
4. Lighthouse de la ficha antes y después (LCP y CLS) y axe con el visor abierto, en y es.

---

## 9. Filas del ledger propuestas (Gemini decide; no edité `docs/requirements-ledger.md`)
| Requisito | Fuente | Estado propuesto | Evidencia |
|---|---|---|---|
| **Zoom de imagen nativo y accesible en la ficha** | WCAG 2.2 AA (2.1.1, 2.4.3, 2.5.8, 4.1.3) / Official Requirements: Product | `código completo` | `assets/product-zoom.js:1-288`, `snippets/product-zoom.liquid`, `sections/main-product.liquid:44-55,76-100,169-171,835-841`, `assets/base.css:7774-7960`. Arnés 5B 16/16 en y es. Cierra con la Compuerta 5 (§8) |
| **Imágenes Responsivas (`srcset`, `sizes`)** (fila 34) | Official Requirements: Media | sigue `cumplido` | Añadir: H-07, `sizes` por disposición en `sections/main-product.liquid:76-86` y `snippets/product-media.liquid:12` |
| **Medios Enriquecidos y Modelos 3D** (fila 72) | Official Requirements: Media | sigue `código completo` | Añadir: H-13, `assets/theme.js:81-94,459-461,498`. Pendiente test de YouTube real |
| **Texto alternativo de imágenes de producto** | WCAG 2.2 AA (1.1.1) | `código completo` | `snippets/media-alt.liquid`, arnés Z11; cierra con catálogo real en vivo |

---

## 10. Afirmaciones falsables
1. `wc -c assets/product-zoom.js` da 11970 y `node --check` pasa.
2. El único `<script>` que carga product-zoom.js es `snippets/product-zoom.liquid:115`, y ese snippet solo lo renderiza `sections/main-product.liquid:170`, dentro de `{%- if zoom_enabled -%}`.
3. Ningún `<img>` del visor lleva `srcset` en el HTML servido; solo `data-srcset`.
4. El `srcset` de una foto de 3000 px es `1600w, 2000w, 2400w, 3000w`; el de una de 600 px, `600w`; ninguno pasa de 4096.
5. `fit.max = min(3, data-width / ancho a 1x)`, y `zoomTo` no aplica escala si `fit.max < 1.25`.
6. Al cerrar por cualquier vía, `document.activeElement` es el botón `[data-zoom-open]` que abrió el visor.
7. Con el visor abierto, `document.body` tiene `data-modal-open`; al cerrar, no.
8. Todos los botones visibles del visor miden 44 × 44 px o más a 1280 y 390.
9. `en.default.json` y `es.json` tienen 394 claves con los mismos placeholders; `products.product.media_zoom` tiene 10.
10. `sections/main-product.liquid` declara `enable_media_zoom` con `"default": true` y label e info con `t:`.
11. En la rejilla con 5 medios, la primera foto lleva `sizes="(min-width: 62rem) 60vw, 100vw"` y las demás `(min-width: 62rem) 30vw, 100vw`; en pila, todas 60vw.
12. Una foto sin alt de catálogo en un producto de 5 medios en posición 2 lleva alt "Serra Coat – Image 2 of 5" (es: "Imagen 2 de 5").
13. Al pasar de diapositiva en el carrusel, se llama `pause()` en cada `<video>` fuera de la vista y cada iframe de YouTube recibe `{"event":"command","func":"pauseVideo","args":""}`.
14. `npm run gates:static` sale con 0 en el árbol entregado, y `gates:hooks` lista `<product-zoom>` con 1 clave y 0 contratos rotos.
15. El arnés 5B pasa 16/16 en `site` y `site-es` y falla 16/16 en `site-before`.
16. No hay commit: `git log -1` en la carpeta de Johandry sigue en b1125bd.
