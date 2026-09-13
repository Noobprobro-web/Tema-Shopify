# CLAUDE-BLUEPRINT-001: Blueprint de Experiencia Premium ($380–$400)

```text
ID: CLAUDE-BLUEPRINT-001
Autor: Claude (Auditor Senior UX/UI, Consultor Editorial y de Producto)
Para: Johandry (dueño del proyecto) y Gemini Flash 3.8 High (cerebro y arquitecto)
Ejecución posterior: GPT-5.6 Sol Max
Fase: 4 (QA, Presets y Preparación Theme Store), en paralelo a GPT-4A-001
Modo: READ-ONLY. Propuesta conceptual y técnica, no código de producción
Fecha: 2026-09-13
```

---

## 0. Hallazgo previo que cambia el presupuesto de los pilares 1 y 3

Antes de entrar en materia, algo que encontré al preparar esta propuesta y que reduce bastante el costo estimado del Pilar 3.

**Los tokens CSS que hacen falta para diferenciar los presets ya existen en `base.css`. Lo que falta es emitirlos desde `settings_schema.json` y `theme.liquid`.** Verificado por conteo de uso:

| Variable en `:root` | Veces usada en `base.css` | ¿La emite `theme.liquid` desde un setting? |
| --- | --- | --- |
| `--border-width` | **21** | No |
| `--font-letter-spacing-eyebrow` | **8** | No |
| `--page-gutter-desktop` | **5** | No |
| `--font-letter-spacing-heading` | **3** (h1, h2, h3) | No |
| `--radius-card` | **0** (token muerto) | No |
| `--radius-input` | pocas | No |

O sea: el grosor de borde, el tracking de encabezados y el tracking de eyebrows ya están cableados en las 21, 3 y 8 reglas que los consumen. Conectarlos es **una línea en `theme.liquid` y un bloque en el schema por cada uno**. No hay que tocar `base.css` para esos tres. Eso cambia la conversación de "hay que refactorizar el CSS" a "hay que exponer lo que ya está construido".

**Y un bug pequeño que sale del mismo análisis.** Hay dos variables de radio de botón y no son la misma:

```
--button-radius: 0;    <- la emite theme.liquid desde settings.button_radius. Usada 1 vez: .button (base.css:333)
--radius-button: 2px;  <- hardcodeada. Usada 2 veces: .sticky-cart-bar__submit (1323) y .cart-cross-sell__button (1934)
```

Consecuencia: el slider "Button corner radius" del comerciante **no llega ni a la barra fija de compra ni al botón de cross-sell del carrito**. Un merchant que pone radio 12px ve botones redondeados en el PDP y esquinados en la barra sticky. Como el tema no está publicado, no hay compatibilidad hacia atrás que proteger, así que lo limpio es unificar en una sola variable dentro del mismo sprint (ver setting 5 del Pilar 3).

---

# Pilar 1: El Hero Editorial Definitivo

## 1.1 Decisión de arquitectura: una sección, dos modos

**Recomiendo una sola sección con un selector de modo, no dos secciones.**

El argumento no es el ahorro de código, es el comerciante. Los ocho settings de contenido (eyebrow, heading, subheading, dos botones con sus URLs, alt, esquema de color) son idénticos en ambos modos. Solo cambia la presentación. Con dos secciones, un merchant que empieza en Split y quiere probar Cinematic tiene que borrar la sección, agregar otra y retipear todo su copy. Con una sección y un `select`, cambia una perilla y ve el resultado.

El obstáculo histórico para esto era que el editor de Shopify mostraba todos los settings siempre, así que un modo de dos opciones producía una barra lateral con veinte controles de los cuales la mitad no hacían nada. **Eso ya está resuelto.** Shopify soporta `visible_if` en settings de sección, de bloque y globales, con operadores `==`, `!=`, `and`, `or`, `not`, y referencias a `section.settings`, `block.settings` y `settings`:

```json
"visible_if": "{{ section.settings.layout_mode == 'cinematic' }}"
```

Con eso, el merchant en modo Split ve seis controles y en modo Cinematic ve otros nueve, y nunca los ve mezclados. Esta es la pieza que hace viable la sección única.

Renombrar la sección de `"Editorial split hero"` a **`"Editorial hero"`**, porque el nombre actual describe uno de los dos modos.

## 1.2 Schema propuesto

Agrupado con settings de tipo `header` para que la barra lateral se lea como un panel y no como una lista.

```
GRUPO: Layout
  layout_mode            select    [split, cinematic]              default: split
  split_ratio            select    [55_45, 60_40, 50_50]           visible_if: split
  layout_split           select    [image_first, text_first]       visible_if: split
  height_desktop         select    [natural, 60, 75, 90, 100]      visible_if: cinematic
  height_mobile          select    [natural, 60, 75, 90, 100]      visible_if: cinematic

GRUPO: Media
  media_type             select    [image, video]                  visible_if: cinematic
  image_desktop          image_picker
  image_mobile           image_picker
  image_alt              text
  video                  video                                    visible_if: cinematic AND media_type == video
  video_poster           image_picker                             visible_if: cinematic AND media_type == video
  enable_video_mobile    checkbox  default: false                  visible_if: cinematic AND media_type == video

GRUPO: Overlay
  overlay_style          select    [none, scrim, gradient_bottom, gradient_behind_text]   visible_if: cinematic
  overlay_opacity        range     0..90 step 5 unit %  default 35 visible_if: cinematic AND overlay_style != none

GRUPO: Contenido
  content_position_x     select    [start, center, end]            visible_if: cinematic
  content_position_y     select    [start, center, end]            visible_if: cinematic
  text_alignment         text_alignment                            (tipo nativo de Shopify)
  content_width          range     26..60 step 2 unit rem  default 38
  heading_tag            select    [h1, h2]
  eyebrow                text
  heading                inline_richtext
  subheading             richtext
  button_primary_label   text
  button_primary_url     url
  button_secondary_label text
  button_secondary_url   url
  color_scheme           color_scheme
```

### Notas de diseño sobre settings concretos

**`overlay_style` importa más que `overlay_opacity`.** Esta es la decisión que separa un hero de $380 de uno de $50. Un scrim plano al 35% sobre una fotografía de campaña la aplana entera: mata el rango tonal por el que la marca pagó al fotógrafo. Por eso propongo cuatro valores y no un simple on/off:

- `none`: sin overlay. Para imágenes que ya tienen zona muerta donde va el texto.
- `scrim`: velo uniforme. El clásico. Útil y honesto, pero es el que aplana.
- `gradient_bottom`: degradado de abajo hacia arriba. Preserva el tercio superior intacto y oscurece solo donde vive el texto. **Este debería ser el default.**
- `gradient_behind_text`: degradado radial anclado a la posición del bloque de contenido. Es el más sofisticado: la imagen queda casi intacta y solo hay densidad justo detrás de la tipografía.

El scrim no debe ser negro hardcodeado. Debe salir del esquema de color, con el mismo patrón que el tema ya usa en los cinco overlays de modal:

```css
--hero-scrim: color-mix(in srgb, var(--color-shadow) calc(var(--hero-overlay-opacity) * 1%), transparent);
```

Así el scrim de Archive es marrón cálido y el de Studio es neutro frío, sin un solo setting adicional. Ese detalle es exactamente la clase de cosa que hace que tres presets se sientan como tres casas distintas.

**Punto focal.** Hoy el hero no lo usa, y en modo full-bleed con `object-fit: cover` es indispensable: la misma foto recortada a 100vh en desktop y a 75vh en móvil pierde la cara del modelo si el recorte es centrado. Shopify ya expone el punto focal que el merchant fija en el admin, y el tema ya lo lee en otro lugar (el swatch del variant picker usa `value.swatch.image.presentation.focal_point`). Aplicarlo aquí es una línea:

```liquid
style="object-position: {{ hero_image.presentation.focal_point }};"
```

Esto además cubre el requisito "Image focal point support" del checklist de la Theme Store, que hoy el tema cumple solo parcialmente.

**`heading_tag`.** Resuelve el P1-28 de la auditoría (dos `<h1>` si el hero se agrega a una plantilla de producto). Sugiero default calculado, no fijo:

```liquid
assign hero_tag = section.settings.heading_tag
if hero_tag == blank
  assign hero_tag = 'h2'
  if request.page_type == 'index'
    assign hero_tag = 'h1'
  endif
endif
```

El merchant nunca tiene que pensarlo, y quien lo necesite puede forzarlo.

**`content_position_x` / `content_position_y` en vez de un select de nueve valores.** Dos ejes separados se mapean directo a `place-items` en CSS y se leen mejor en la barra lateral que una lista de "Arriba izquierda, Arriba centro, Arriba derecha...". Y `text_alignment` va aparte a propósito: un bloque anclado abajo a la izquierda puede tener el texto centrado dentro de sí. Son dos decisiones distintas y merchants de moda las usan distinto.

## 1.3 Video de fondo

**Usar el tipo de setting `video` de Shopify, no `video_url`.** El tipo `video` da un video alojado en Shopify que se renderiza con `video_tag`, sin iframe de YouTube, sin cookies de terceros, sin logotipo ajeno encima de la campaña. `video_url` con YouTube o Vimeo es inaceptable en un hero de lujo: mete un iframe de tercero con su propio branding y arruina el LCP.

Reglas de comportamiento:

1. **El poster es el elemento LCP, no el video.** El `<video>` lleva `poster` con la imagen `video_poster` (o el primer frame), `preload="none"`, `muted`, `loop`, `playsinline`. El poster se renderiza además como `<img>` eager con `fetchpriority="high"` debajo del video, de modo que el navegador tenga un candidato LCP que pinta en el primer viaje. El video se adjunta después.
2. **Móvil apagado por defecto.** `enable_video_mobile` en `false`. Autoplay en móvil quema datos del cliente, muchas veces lo bloquea el sistema operativo, y en una tienda de lujo la primera impresión no puede depender de un permiso del navegador. El merchant que lo quiera lo activa.
3. **Reduced motion.** Si `prefers-reduced-motion: reduce`, no hay autoplay: se muestra el poster con un botón de reproducir. El tema ya tiene `reducedMotionQuery` en `theme.js:2320`, se reusa.
4. **Control de pausa obligatorio.** WCAG 2.2.2 exige mecanismo de pausa para cualquier contenido que se reproduce solo por más de cinco segundos. **Esto no es opcional y los revisores de Shopify lo prueban.** El tema ya tiene exactamente este componente dos veces: `.marquee-banner__toggle` y `.announcement-bar__control`, ambos a 44px con estilos de `:focus-visible` resueltos. Se reusa el patrón, se ubica en una esquina inferior con opacidad baja y se sube en hover y focus. Cero código nuevo de accesibilidad.
5. **El video es decorativo.** Sin pista de audio, sin contenido informativo. Va con `aria-hidden="true"` y toda la información vive en el heading y el subheading. Así no hace falta transcripción ni captions, que sería el otro camino y no lo quieres.

## 1.4 CLS y LCP

El problema actual, concreto. `hero-editorial.liquid:35-45` emite un `<source media="(max-width: 47.99rem)">` con `srcset` y `sizes` pero **sin `width` ni `height`**. El `<img>` de respaldo sí los trae vía `image_tag`, pero con las dimensiones de la imagen **desktop**. El navegador calcula el aspect-ratio reservado a partir de los atributos del `<img>`, así que si el desktop es 16:9 y el móvil es 4:5, reserva la caja equivocada y el layout salta cuando llega la imagen real.

Hay dos soluciones y conviene aplicar las dos, porque cubren los dos modos.

**Modo Cinematic: el CLS desaparece por construcción.** La sección tiene altura declarada por el merchant (`height_desktop` / `height_mobile` en `vh` o `dvh`), la imagen es `object-fit: cover` dentro de esa caja, y la caja existe antes de que llegue el primer byte de imagen. No hay nada que reservar porque ya está reservado. Este es un argumento fuerte a favor de recomendar Cinematic como el modo del preset por defecto.

**Modo Split: reservar la caja con `aspect-ratio` por breakpoint, desde Liquid, sin JS.**

```liquid
{%- liquid
  assign ratio_desktop = section.settings.image_desktop.aspect_ratio | default: 1.5
  assign ratio_mobile = section.settings.image_mobile.aspect_ratio | default: ratio_desktop
-%}
<div class="hero-editorial__media"
     style="--hero-ratio-mobile: {{ ratio_mobile }}; --hero-ratio-desktop: {{ ratio_desktop }};">
```

```css
.hero-editorial__media { aspect-ratio: var(--hero-ratio-mobile); }
@media (min-width: 48rem) {
  .hero-editorial__media { aspect-ratio: var(--hero-ratio-desktop); }
}
```

`image.aspect_ratio` es una propiedad real del objeto image de Liquid. Con esto la caja correcta está reservada en ambos breakpoints antes de que cargue nada, CLS queda en cero, y no se ejecuta una línea de JavaScript.

**Y aparte, arreglar la causa raíz: poner `width` y `height` en el `<source>`.** Los navegadores modernos los usan para derivar el aspect-ratio del candidato seleccionado dentro de `<picture>`. Es la corrección estándar y vale hacerla aunque el `aspect-ratio` ya cubra el caso, porque protege cualquier otro `<picture>` que se agregue después.

**LCP.** Lo que ya está bien y no hay que tocar: `prioritize: true` en el hero produce `loading="eager"` más `fetchpriority="high"`, y `base.css` se carga con `preload: true`. Lo que hay que cuidar al agregar el video es no crear un segundo candidato pesado que compita: por eso el poster es el LCP y el video llega después. Una prueba concreta para la checklist de QA: con el video activado, el LCP medido en móvil no debe empeorar más de 100ms respecto al mismo hero solo con imagen. Si empeora más, el video se adjunta demasiado pronto.

## 1.5 Orden del DOM y legibilidad

En modo Cinematic el media y el contenido se apilan en la misma celda de grid, así que el orden del DOM es libre y define el orden de lectura. Va primero el media (no es focusable) y después el bloque de contenido, que es como se lee visualmente.

Un riesgo que conviene anticipar, porque es el que rompe la accesibilidad de todos los heroes full-bleed del mercado: el merchant sube una foto clara, deja el overlay en 10% y el texto blanco queda ilegible. El tema no puede medir el contraste de una foto. Lo que sí puede hacer es hacer que el camino fácil sea el correcto: `gradient_bottom` como default, opacidad por defecto en 35 y no en 0, y un `info` en el setting de opacidad que diga en una línea que por debajo de 20% conviene verificar la legibilidad sobre la imagen real. Eso es todo lo que se puede hacer honestamente, y es más de lo que hacen la mayoría.

---

# Pilar 2: La Galería de Producto de Lujo, sin librerías

## 2.0 Corrección de breakpoint antes de empezar

La pregunta plantea móvil por debajo de 768px. **El breakpoint real de este tema es 62rem, o sea 992px.** `base.css:3059-3066` es donde `.product-main__layout` pasa a dos columnas y donde `.product-main__layout--grid .product-gallery` pasa a `repeat(2, minmax(0,1fr))`. Por debajo de eso, incluido todo el rango de tablet, hoy se ve el apilado vertical.

Si el carrusel se implementa con corte en 768px, las tablets entre 768px y 992px quedan con una galería en columna única a ancho completo, que es el peor de los dos mundos. **El corte del carrusel debe ser el mismo 62rem que el resto del PDP.**

## 2.1 Móvil y tablet (< 62rem): carrusel con scroll-snap

### La decisión de UX principal: peek en vez de dots

La pregunta ofrece dots o contador tipográfico "01 / 06". Mi recomendación es **contador tipográfico más peek, y cero dots.**

El razonamiento. Los dots resuelven dos problemas a la vez: decir cuántas imágenes hay y decir que hay más a la derecha. El contador resuelve el primero muy bien y el segundo nada. Pero el segundo tiene una solución mejor que los dots y que además es más bonita: **dejar asomar el borde de la siguiente imagen**. Un slide al 88vw con gutter deja un centímetro de la siguiente foto visible, y eso comunica "hay más" de forma inmediata, sin agregar un solo elemento de interfaz. Es lo que hace la prensa impresa de moda cuando una foto se sale del pliego.

Resultado: el contador da la posición, el peek da la continuidad, y la galería no tiene ni un punto ni una flecha ensuciando una fotografía de campaña. Eso es lo que se siente de $380.

### Implementación

```css
.product-gallery--carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  gap: var(--space-2);
  scrollbar-width: none;
}
.product-gallery--carousel::-webkit-scrollbar { display: none; }

.product-gallery--carousel .product-gallery__item {
  flex: 0 0 88%;
  scroll-snap-align: center;
}
```

Notas sobre esto:

- `scrollbar-width: none` más la regla `::-webkit-scrollbar` porque **`scrollbar-width` no existe en Safari ni en iOS Safari**, que es el navegador principal del público objetivo. Ese detalle ya causa un problema hoy en `.curated-showcase__tabs` (`base.css:2107`), donde `scrollbar-width: thin` es la única afordancia de scroll y en iOS no hace nada. Vale arreglarlo de paso.
- `overscroll-behavior-inline: contain` evita que el swipe horizontal en el último slide dispare el gesto de "atrás" del navegador.
- El track necesita `tabindex="0"` para que sea navegable con teclado. Un contenedor de scroll con tabindex es scrolleable con flechas de forma nativa, sin JS.

### Accesibilidad sin construir un widget de carrusel completo

No hace falta el patrón ARIA de carrusel con `role="tablist"` y botones de rotación, que es pesado y frágil. Basta el patrón de región agrupada:

```html
<div class="product-gallery product-gallery--carousel"
     role="group"
     aria-label="{{ 'products.product.media_gallery' | t }}"
     tabindex="0">
  <figure role="group" aria-label="Image 1 of 6"> ... </figure>
```

El usuario de lector de pantalla entra a la región, oye cuántas hay, y recorre cada figura con su posición anunciada. El usuario de teclado hace scroll con flechas. Nadie tiene que aprender un widget.

### El contador

Actualizarlo con `IntersectionObserver` sobre los slides, no con un listener de `scroll`. Es más barato, no necesita throttling y no dispara en cada frame:

```js
class ProductGallery extends ThemeElement {
  connectedCallback() {
    this.startListening();
    this.items = Array.from(this.querySelectorAll('[data-product-media-id]'));
    this.counter = this.querySelector('[data-gallery-counter]');
    this.observer = new IntersectionObserver(
      (entries) => { /* actualiza índice y textContent del contador */ },
      { root: this, threshold: 0.6 }
    );
    this.items.forEach((item) => this.observer.observe(item));
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }
}
```

Sigue la convención de `ThemeElement` que ya usa el tema (`startListening`, `listen`, `stopListening`, `disconnectedCallback` llamando a `super`). El `IntersectionObserver` se desconecta a mano porque el `AbortController` de `ThemeElement` no lo cubre.

El contador debe ser `aria-hidden="true"`: la posición ya se anuncia en el `aria-label` de cada slide y duplicarla es ruido.

### La sincronización con el variant picker, que hoy falta

Esto es un hueco real del tema, no una mejora cosmética. `theme.js:536-537` hace esto al cambiar de variante:

```js
productSection?.querySelectorAll('[data-product-media-id]').forEach((media) => {
  media.toggleAttribute('data-selected', String(media.dataset.productMediaId) === String(variant?.featured_media_id));
});
```

Marca el media de la variante, y nada más. En el apilado vertical actual, un cliente que elige "Negro" en móvil recibe una marca visual en una figura que está seiscientos píxeles más abajo y que nunca ve. La galería no se mueve.

Con el carrusel esto se resuelve naturalmente y hay que resolverlo: al cambiar de variante, el carrusel hace scroll hasta el media de esa variante. Acoplamiento suelto vía evento, que es coherente con la arquitectura del tema:

```js
// en VariantSelects, después de marcar el media
this.dispatchEvent(new CustomEvent('variant:media', {
  bubbles: true,
  detail: { mediaId: variant?.featured_media_id },
}));

// en ProductGallery
this.listen(this, 'variant:media', (event) => this.scrollToMedia(event.detail.mediaId));
```

Y el scroll debe respetar reduced motion:

```js
const behavior = this.reducedMotion.matches ? 'auto' : 'smooth';
target.scrollIntoView({ behavior, inline: 'center', block: 'nearest' });
```

Detalle con beneficio colateral: esto le da por fin un consumidor a `[data-reduced-motion]`, el atributo que `theme.js:2320-2330` escribe en cada visita y que hoy no lee ninguna regla CSS ni ninguna línea de JS (P1-45 de la auditoría).

### Ampliar imagen

**Usar `<dialog>` nativo con `showModal()`.** Da foco atrapado, cierre con Escape, backdrop y gestión de inert sin escribir una línea. El tema tiene un patrón propio de modal muy bien hecho, así que la pregunta legítima es si conviene mezclar dos patrones. Mi lectura es que sí, por dos razones: primero, es menos código y menos superficie de bug en el componente más visual del PDP; segundo, el soporte de `<dialog>` arranca en Safari 15.4, o sea **es más amplio que `color-mix()` (Safari 16.2), que el tema ya usa para definir cuatro tokens core**. La línea base ya está por encima del requisito.

Dentro del dialog va el mismo track con scroll-snap a viewport completo, con `object-fit: contain` y sin bloquear el pinch-zoom del sistema. Un cliente que quiere ver la textura de un tejido va a hacer pinch, y bloquearlo con `user-scalable=no` es el error clásico.

El disparador es la propia figura, con `cursor: zoom-in`, y un botón de cerrar de 44px reusando `.icon-button`.

## 2.2 Desktop (≥ 62rem)

**Mantener el mosaico editorial de dos columnas como default.** Ya está construido (`base.css:3065-3067`), es lo que hace Prestige, y es coherente con el posicionamiento del tema: en desktop, una casa de moda quiere que su fotografía se vea grande y en composición, no en miniaturas.

Lo que sí agregar es una tercera opción al setting `media_layout`, que hoy tiene `stack` y `grid`:

```
media_layout: select [stack, grid, thumbnails]  default: grid
```

- `stack`: una columna, imágenes grandes a ancho completo de la columna de media. Para productos con dos o tres fotos muy trabajadas.
- `grid`: el mosaico de dos columnas actual. El default.
- `thumbnails`: una imagen principal grande con una tira vertical de miniaturas pegada al lado. Para el merchant con doce fotos por producto, donde el mosaico se vuelve un scroll largo.

La columna de detalles ya es `position: sticky` en desktop (`base.css:3068-3071`), así que en cualquiera de los tres modos el precio y el botón de compra siguen a la vista mientras el cliente recorre la fotografía. Eso ya está bien resuelto.

Sobre hover-zoom: no lo recomiendo. Una lupa que sigue el cursor es un tic de tema de $50 y además es un problema táctil. La afordancia correcta en desktop es la misma que en móvil: `cursor: zoom-in` y clic para abrir el lightbox a viewport completo. Restringido y consistente.

## 2.3 Video y 3D dentro de la galería

El problema actual, en sus palabras, es que se sienten como un añadido torpe. Coincido, y la causa es concreta. Hoy `main-product.liquid:38` hace esto:

```liquid
{{ media | media_tag: image_size: '1200x', controls: true, class: 'product-gallery__media' }}
```

`controls: true` pone un reproductor con cromo de navegador en medio de una galería editorial. Un rectángulo negro con barra de progreso gris en medio de fotografía de campaña. Y el modelo 3D (línea 40) queda peor: sin las librerías del visor, es un póster inerte que no rota.

**La regla que lo arregla: la galería es una galería de imágenes fijas. Siempre. Sin excepción.**

Cada pieza de media, sea foto, video o modelo, se renderiza como su frame de póster, con la misma proporción y el mismo tratamiento que el resto. El ritmo visual de la galería nunca se rompe. Lo único que distingue a un video o a un modelo es **una insignia discreta en una esquina**: un glifo de reproducción, un glifo de cubo. Mismo tamaño, misma posición, mismo peso tipográfico que el resto del sistema de iconos.

Al activar la pieza, el póster se reemplaza en su lugar por el reproductor real o el visor 3D. La caja no cambia de tamaño porque el póster ya reservó la proporción. Eso es lo que hace que se sienta orgánico: la galería se ve como un pliego de revista hasta que el cliente decide que quiere movimiento.

Consecuencias técnicas:

1. `snippets/icon.liquid` necesita dos iconos nuevos, `play` y `model`, en el mismo estilo de trazo 1.5 del set actual.
2. El video va con `preload="none"`, `poster` desde `media.preview_image`, **sin autoplay nunca dentro de la galería**, y `controls` solo después de la activación.
3. Las librerías de 3D se cargan **condicionalmente**, solo si el producto tiene un modelo:

```liquid
{%- assign model_media = product.media | where: 'media_type', 'model' -%}
{%- if model_media.size > 0 -%}
  {{ 'model-viewer-ui.css' | shopify_asset_url | stylesheet_tag }}
  <script src="{{ 'model-viewer-ui.min.js' | shopify_asset_url }}" defer></script>
  <script src="{{ 'shopify-xr.js' | shopify_asset_url }}" defer></script>
{%- endif -%}
```

Esto cierra el P0-5 de la auditoría (media 3D declarada y no funcional) sin cargarle un kilobyte a los productos que no tienen modelos, que son el 99%.
4. En el lightbox, video y 3D toman el viewport completo, que es donde de verdad se aprecian. La galería es para hojear, el lightbox es para examinar.
5. Reduced motion: nada se reproduce solo, en ningún caso, en ninguna parte de la galería.

---

# Pilar 3: Expansión exacta de `settings_schema.json`

## 3.1 Los 10 settings

Ordenados por impacto visual por unidad de trabajo. Los tres primeros son los que de verdad hacen que Studio no parezca Couture.

### 1. `heading_letter_spacing`

```json
{
  "type": "select",
  "id": "heading_letter_spacing",
  "label": "t:settings_schema.typography.settings.heading_letter_spacing.label",
  "options": [
    { "value": "-0.02em", "label": "Tight" },
    { "value": "0",       "label": "Normal" },
    { "value": "0.02em",  "label": "Wide" },
    { "value": "0.06em",  "label": "Extra wide" }
  ],
  "default": "0"
}
```

Deliberadamente un `select` con valores nombrados y no un `range`. Un range invita a que el merchant ponga 7px de tracking en un display serif y arruine la tipografía. Cuatro opciones curadas dan exactamente los tres looks que necesitan los presets y ninguno feo. Emite `--font-letter-spacing-heading`, que **ya está consumido en h1, h2 y h3**. Una línea en `theme.liquid`.

### 2. `heading_text_transform`

```json
{ "type": "select", "id": "heading_text_transform",
  "options": [ { "value": "none", "label": "As typed" }, { "value": "uppercase", "label": "Uppercase" } ],
  "default": "none" }
```

Variable nueva `--font-heading-transform`, cableada en el bloque de h1 a h6.

### 3. `eyebrow_style`

El control más importante de los tres. Hoy `.eyebrow` tiene `text-transform: uppercase` y `letter-spacing: 0.12em` hardcodeados (`base.css:302-309`), consumidos en ocho reglas. Los eyebrows aparecen en todas las secciones editoriales, así que este solo control cambia el carácter de todo el sitio.

```json
{ "type": "select", "id": "eyebrow_style",
  "options": [
    { "value": "uppercase_wide",  "label": "Uppercase, wide spacing" },
    { "value": "uppercase_tight", "label": "Uppercase, tight spacing" },
    { "value": "sentence",        "label": "Sentence case" },
    { "value": "small_caps",      "label": "Small caps" }
  ],
  "default": "uppercase_wide" }
```

Un setting, dos variables (`--font-eyebrow-transform` y `--font-letter-spacing-eyebrow`), porque en tipografía esas dos cosas siempre se mueven juntas y separarlas solo produce combinaciones malas.

Beneficio colateral: resuelve el P1-46 de la auditoría. El eyebrow de 10px en mayúsculas con 0.12em de tracking dentro del popover del lookbook sobre fotografía es el peor punto de legibilidad del tema. Con `sentence` deja de serlo.

### 4. `button_style`

```json
{ "type": "select", "id": "button_style",
  "options": [
    { "value": "solid",     "label": "Solid" },
    { "value": "outline",   "label": "Outline" },
    { "value": "underline", "label": "Underline" }
  ],
  "default": "solid" }
```

Diferenciador enorme por muy poco CSS. Un botón outline de hairline sobre crema es Couture; el mismo HTML con fill near-black es Studio. Se implementa con un atributo en `<body>` o una clase, más tres bloques de reglas.

### 5. `corner_style`

Reemplaza a `button_radius` y de paso arregla el bug de las dos variables descrito en la sección 0.

```json
{ "type": "select", "id": "corner_style",
  "options": [
    { "value": "square",  "label": "Square" },
    { "value": "soft",    "label": "Soft" },
    { "value": "rounded", "label": "Rounded" }
  ],
  "default": "square" }
```

Un control que emite las tres variables de radio de forma coherente: `--radius-button`, `--radius-card` (hoy token muerto, hay que cablearlo) y `--radius-input`. Imposible producir la combinación fea de botones redondos con imágenes cuadradas. Y `--button-radius` se elimina, unificando en `--radius-button` en las tres reglas que hoy están partidas.

Como el tema no está publicado, este reemplazo no rompe nada de nadie.

### 6. `border_thickness`

```json
{ "type": "range", "id": "border_thickness", "min": 1, "max": 3, "step": 1, "unit": "px",
  "default": 1 }
```

Emite `--border-width`, **ya consumido en 21 reglas**. Una línea en `theme.liquid` y tres presets quedan estructuralmente distintos: Couture con hairline de 1px, Archive con regla de catálogo de 2px.

### 7. `border_contrast`

```json
{ "type": "range", "id": "border_contrast", "min": 20, "max": 100, "step": 10, "unit": "%",
  "default": 60,
  "info": "t:settings_schema.layout.settings.border_contrast.info" }
```

Este tiene doble función y por eso lo pongo en la lista aunque parezca menor.

La primera es estética: controla si los bordes son un susurro o una declaración.

La segunda es cumplimiento. La auditoría encontró que `--color-border` está hoy en **1.25:1** contra el fondo, cuando la regla 1.4.11 de WCAG pide 3:1 para los límites de controles de interfaz, y esa variable está en los `input`, `select`, `textarea`, en `.variant-picker__label` y en `.selling-plans__choice`. O sea: los campos de formulario y los chips de talla no tienen borde perceptible. Es uno de los cuatro fallos que ponen en riesgo el mínimo de 90 de Lighthouse.

Aquí está la clave del arreglo, y es una distinción que el tema ya tiene construida y no está aprovechando: **hay dos variables de borde, no una.**

- `--color-border` está en controles interactivos. **Tiene que llegar a 3:1.**
- `--color-border-hairline` está en separadores decorativos. **Puede quedarse en 1.16:1 sin problema.**

O sea que no hay que elegir entre accesibilidad y estética. Los hairlines editoriales que dan el aire de lujo se quedan exactamente como están, y solo suben de contraste los bordes que delimitan algo que el cliente toca. Los valores de paleta que propongo abajo ya están calculados para cumplir esto.

### 8. `product_card_image_ratio`

```json
{ "type": "select", "id": "product_card_image_ratio",
  "options": [
    { "value": "4 / 5", "label": "Portrait" },
    { "value": "1 / 1", "label": "Square" },
    { "value": "3 / 4", "label": "Tall portrait" },
    { "value": "auto",  "label": "Natural" }
  ],
  "default": "4 / 5" }
```

Hoy `aspect-ratio: 4/5` está hardcodeado en `base.css:1456`. Es la diferencia visual más grande entre una grilla de moda y una de objetos de diseño, y ahora mismo el merchant no la puede tocar.

### 9. `product_card_style`

```json
{ "type": "select", "id": "product_card_style",
  "options": [
    { "value": "minimal", "label": "Minimal" },
    { "value": "framed",  "label": "Framed" }
  ],
  "default": "minimal" }
```

`minimal` es la tarjeta actual sin borde. `framed` la mete en una caja con borde visible y padding, que es el lenguaje de entrada de catálogo que necesita Archive.

### 10. `grid_density`

```json
{ "type": "select", "id": "grid_density",
  "options": [
    { "value": "comfortable", "label": "Comfortable" },
    { "value": "compact",     "label": "Compact" }
  ],
  "default": "comfortable" }
```

Emite el gap de grilla y los conteos de columna por breakpoint. Una grilla apretada de cuadrados se lee como catálogo de estudio; una amplia de retratos se lee como galería.

### Extra si hay presupuesto: `enable_reveal_animation`

Checkbox, default activado, gated detrás de `prefers-reduced-motion: no-preference` con el patrón que el tema ya tiene en `base.css:5225`. Studio apagado, que su carácter es instantáneo y clínico. Couture encendido, con fade-up lento.

## 3.2 Matriz completa de los tres presets

Advertencias antes de la tabla.

**Sobre las fuentes.** Los handles del `font_picker` hay que verificarlos contra la biblioteca real de Shopify antes de escribir `settings_data.json`, porque un handle inválido rompe el preset en silencio. Los que pongo son los esperados, no los confirmados.

**Sobre los colores.** Los ratios que anoto los calculé a mano con la fórmula de WCAG. Hay que reverificarlos con un checker antes de cerrar, pero están elegidos con margen y todos los bordes cruzan 3:1 a propósito.

**Sobre lo que un preset puede y no puede hacer.** Un preset en `settings_data.json` solo varía settings de `settings_schema.json`. **No cambia contenido de secciones ni el orden del homepage.** Eso vive en `templates/*.json` y en la demo store. La mitad de la sensación de "tres tiendas distintas" la pone el preset y la otra mitad la pone el contenido.

### Tipografía y layout

| Setting | Couture | Studio | Archive |
| --- | --- | --- | --- |
| `type_heading_font` | `baskerville_n4` | `archivo_n4` | `bitter_n4` |
| `heading_scale` | 110 | 95 | 115 |
| `heading_letter_spacing` | `0` | `-0.02em` | `0` |
| `heading_text_transform` | `none` | `none` | `none` |
| `type_body_font` | `assistant_n4` | `archivo_n4` | `pt_serif_n4` |
| `body_scale` | 100 | 100 | 105 |
| `eyebrow_style` | `uppercase_wide` | `sentence` | `uppercase_tight` |
| `page_width` | 1300 | 1600 | 1200 |
| `page_gutter` | 24 | 32 | 24 |
| `section_spacing` | 96 | 56 | 72 |
| `grid_density` | `comfortable` | `compact` | `comfortable` |
| `logo_width` | 140 | 110 | 160 |

La jugada tipográfica de cada uno, explícita:

**Couture** vive del contraste entre un serif display y un sans neutro. Escala alta, tracking cero, ritmo vertical de 96px. El aire es lo que comunica el precio.

**Studio** usa **la misma sans para encabezados y cuerpo**, escala por debajo de 100 y tracking negativo. Eso último es la firma del minimalismo contemporáneo y hoy el tema no lo puede expresar. Y los eyebrows en sentence case, no en mayúsculas: un estudio de diseño no grita. Ancho de página 1600 y espaciado 56 para densidad en vez de aire.

**Archive** sube el cuerpo a 105% porque lo heritage se lee, no se ojea. Serif en ambos niveles, ancho angosto de 1200 como un libro, eyebrows en mayúsculas con tracking corto y numeral de índice.

### Forma

| Setting | Couture | Studio | Archive |
| --- | --- | --- | --- |
| `button_style` | `outline` | `solid` | `solid` |
| `corner_style` | `square` | `square` | `soft` |
| `border_thickness` | 1 | 1 | 2 |
| `border_contrast` | 50 | 60 | 90 |
| `product_card_image_ratio` | `4 / 5` | `1 / 1` | `3 / 4` |
| `product_card_style` | `minimal` | `minimal` | `framed` |
| `enable_reveal_animation` | true | false | true |
| `cart_type` | `drawer` | `drawer` | `drawer` |
| `show_cart_count` | true | true | true |

### Color: Couture

Crema cálido y tinta, con latón en oscuro.

```json
"scheme-1": {
  "background": "#F7F3EA", "background_gradient": "", "text": "#1D1B18",
  "button": "#1D1B18", "button_label": "#FFFFFF", "secondary_button_label": "#1D1B18",
  "border": "#8F8574", "shadow": "#1D1B18"
},
"scheme-2": {
  "background": "#1D1B18", "background_gradient": "", "text": "#F8F4EB",
  "button": "#D8A85D", "button_label": "#1D1B18", "secondary_button_label": "#F8F4EB",
  "border": "#7A7061", "shadow": "#000000"
}
```

Ratios calculados: texto sobre fondo ~16:1. Etiqueta de botón sobre botón ~16:1 en claro y ~8:1 sobre el latón en oscuro. Bordes en 3.3:1 y 3.5:1, o sea cruzando el umbral de 1.4.11 por poco, que es exactamente lo que quieres: cumple sin dejar de ser un hairline. El `#CAC2B5` actual estaba en 2.36:1 y no pasaba.

### Color: Studio

Blanco puro y negro. Cero calidez, cero grises cálidos. El acento es la ausencia de acento.

```json
"scheme-1": {
  "background": "#FFFFFF", "background_gradient": "", "text": "#111111",
  "button": "#111111", "button_label": "#FFFFFF", "secondary_button_label": "#111111",
  "border": "#949494", "shadow": "#111111"
},
"scheme-2": {
  "background": "#111111", "background_gradient": "", "text": "#FAFAFA",
  "button": "#FAFAFA", "button_label": "#111111", "secondary_button_label": "#FAFAFA",
  "border": "#666666", "shadow": "#000000"
}
```

Bordes en 3.03:1 y 3.31:1. El scheme-2 es la inversión literal del scheme-1, que es la gramática correcta para este preset: no un modo oscuro, un negativo.

### Color: Archive

Arcilla y marrón profundo, con óxido. Y en oscuro, oliva y no negro, que es lo que separa heritage de minimalismo.

```json
"scheme-1": {
  "background": "#EFE6D9", "background_gradient": "", "text": "#2E241C",
  "button": "#8A5A3B", "button_label": "#FFF8F0", "secondary_button_label": "#2E241C",
  "border": "#8A7860", "shadow": "#2E241C"
},
"scheme-2": {
  "background": "#2F3327", "background_gradient": "", "text": "#EFE6D9",
  "button": "#B5885C", "button_label": "#241F19", "secondary_button_label": "#EFE6D9",
  "border": "#838972", "shadow": "#1A1D16"
}
```

Ratios: texto 12.3:1 y 10.5:1. Etiqueta sobre botón 5.6:1 y 5.2:1. Bordes 3.5:1 y 3.6:1, más altos a propósito porque `border_contrast: 90` es parte de la identidad de Archive.

### El detalle de firma de cada uno

Si hay que elegir una sola cosa que un merchant recuerde de cada preset:

**Couture: el hairline y el silencio.** Un borde de 1px, 96px de ritmo, botones outline, y el media que escala a 260ms con easing lento. La quietud es el lujo.

**Couture ya existe como default del tema.** Y aquí conviene la decisión de nombre pendiente: como Shopify exige que un preset comparta el nombre del tema, lo más limpio es que el tema se llame **Couture**. Cumple el formato (una palabra, ocho caracteres) y ya es el ancla estética.

**Studio: cero serifas y números tabulares.** Todo en una sola sans, recortes cuadrados, y `font-variant-numeric: tabular-nums` en los precios para que la columna de precios de la grilla alinee dígito con dígito. Ese detalle tipográfico casi nadie lo hace y es lo que grita estudio de diseño. Vale agregarlo al CSS de `.price` bajo el preset, aunque no sea un setting.

**Archive: la regla de 2px y el vendor visible.** Cada producto se lee como una entrada de catálogo, enmarcada, con el fabricante a la vista y un numeral de índice en el eyebrow. Es el único preset donde `show_vendor` va en `true` por defecto en las secciones que lo exponen.

### Las tres demo stores

Recordatorio de presupuesto, porque es el costo que más se subestima. Shopify pide una demo store por preset, con catálogo del tamaño y la industria correctos, texto auténtico y derechos sobre todos los assets.

| | Couture | Studio | Archive |
| --- | --- | --- | --- |
| Industria | Prêt-à-porter de mujer | Objetos y accesorios de diseño | Denim, cuero o textil heritage |
| Catálogo | 18 a 30 productos | 40 a 60 productos | 25 a 40 productos |
| Fotografía | Campaña 4:5, cuerpo entero | Producto sobre fondo neutro, cuadrado | Grano, archivo, 3:4 |
| Hero | Cinematic full-bleed con video | Split editorial | Cinematic con imagen fija |
| Sección protagonista | Lookbook interactivo | Bento discovery | Brand manifesto |
| Complete the look | Cápsula de 3 piezas | No | Sí, de 2 piezas |

---

# Pilar 4: Pulido Editorial y Reglas de Nomenclatura

## 4.1 La regla que resuelve el problema de raíz

El tema tiene hoy dos vocabularios mezclados. La solución no es elegir uno, es separarlos limpiamente y aplicar una regla distinta a cada lado.

**Vocabulario de vitrina (locales, lo que lee el cliente).** Puede y debe ser elevado. "Atelier", "pieces", "complimentary", "curated", "objects". Esta es la voz de la marca y es el mejor activo editorial que tiene el tema. No hay que diluirla.

**Vocabulario de editor (labels, info, nombres de sección y de setting).** Tiene que ser plano, estándar de Shopify, y entendible al instante en Múnich, Tokio y Nueva York por alguien que no es técnico y que quizá está leyendo en su segundo idioma. **Cero voz de marca.**

Hoy hay fuga en las dos direcciones y eso es lo que hay que arreglar:

- Fuga de marca hacia el editor: `"Atelier gift threshold"`. Un sastre en Múnich no sabe qué es un "atelier gift".
- Fuga de editor hacia la vitrina: `sections.complete_the_look.empty` dice **"Choose two to four products in the theme editor to build this look."** Ese texto se le muestra al **cliente** si el merchant no configuró la sección. Un comprador en el sitio de una casa de moda leyendo instrucciones sobre el theme editor es un fallo de producto. La sección debe no renderizar nada cuando está vacía y el aviso debe vivir en un `info` del schema.

## 4.2 Cart contra bag: recomendación definitiva

**Estandarizar en "cart", en los 14 strings.**

Sé que "bag" suena más a casa de moda, y en una tienda propia sería mi recomendación. Aquí no, por tres razones:

1. El requisito de la Theme Store pide terminología de Shopify. "Cart" lo es; "bag" no.
2. El checkout de Shopify dice cart y el merchant no lo puede cambiar. Un tema que dice "bag" en el drawer y manda al cliente a una página que dice "cart" genera una costura visible justo en el momento de pagar.
3. Traducido no cambia nada. Alemán da "Warenkorb" en los dos casos.

Si aun así quieren "bag" como firma de marca, entonces tiene que ser **un setting** (`cart_terminology`, con dos valores) para que el merchant de Tokio pueda cambiarlo, y los 14 strings tienen que seguirlo. Lo que no puede quedar es la mezcla actual: "bag" en dos lugares y "cart" en todos los demás.

Cambios concretos si van por "cart":

```
sections.complete_the_look.add_selected.one    "Add {{ count }} piece · {{ total }}"
sections.complete_the_look.add_selected.other  "Add {{ count }} pieces · {{ total }}"
schema description de complete-the-look        "...before adding it to your cart."
```

De paso, ese `|` como separador parece artefacto de plantilla más que decisión tipográfica. El punto medio (`·`) es el separador correcto en composición editorial.

## 4.3 Diez reglas de nomenclatura para los schemas

Esto es para que Gemini lo pueda usar como criterio de aceptación mecánico, sin discutir caso por caso.

1. **Sentence case siempre.** "Show cart note", no "Show Cart Note". Aplica a labels, nombres de sección, nombres de bloque y opciones de select.
2. **Cero vocabulario de marca en el editor.** Si un término solo tiene sentido dentro de Atelier Flow, no va en un label.
3. **Cero términos de developer.** Prohibidos: popover, intent, cross-sell, hook, wrapper, toggle, tier, slug, viewport.
4. **Nombrar el resultado, no el mecanismo.** "Free shipping message" en vez de "Tiered rewards progress".
5. **Toda dependencia externa va en un `info`.** Si el setting necesita una app, una tarifa de envío, un descuento automático o un metafield, el `info` lo nombra. Sin excepción.
6. **Todo setting numérico declara unidad y supuesto de moneda en el `info`.**
7. **Las opciones de select se nombran por resultado.** "Two per row" en vez de "Fewer columns".
8. **Todo label vía clave `t:` en `en.default.schema.json`.** Hoy `settings_schema.json`, header, footer y custom-liquid usan claves y todas las demás secciones hardcodean inglés; incluso dentro de `settings_schema.json` conviven las dos formas (`show_cart_count` traducido, `cart_type` y `show_cart_note` en inglés plano). Medio camino es peor que cualquiera de los dos extremos.
9. **Máximo 40 caracteres por label,** para que no se parta en dos líneas en la barra lateral.
10. **Agrupar con settings de tipo `header`** cuando una sección pase de ocho settings.

## 4.4 Tabla de renombrado

| Dónde | Actual | Propuesto | Motivo |
| --- | --- | --- | --- |
| `cart-drawer` | "Atelier gift threshold" | "Gift threshold" + `info`: "Requires an automatic discount in Discounts that matches this amount." | Regla 2 y regla 5 |
| `cart-drawer` | "Free shipping threshold" | igual + `info`: "In your store currency. Requires a free shipping rate in Settings > Shipping." | Regla 5 y 6 |
| `cart-drawer` | "Show tiered rewards progress" | "Show free shipping and gift progress" | Regla 4 |
| `cart-drawer` | "Cross-sell heading" | "Complementary products heading" | Regla 3 |
| `cart-drawer` | "Fallback cross-sell collection" | "Collection to suggest from" | Regla 3 y 4 |
| `lookbook` | "Preferred popover position" | "Product card position" | Regla 3 |
| `product-recommendations` | "Recommendation intent" | "Recommendation type" + `info`: "Complementary products require the Search & Discovery app." | Regla 3 y 5 |
| `main-collection` | "Fewer columns" / "More columns" | "Two per row" / "Four per row" | Regla 7 |
| `main-product` | "Size Guide & Measurements" (default) | "Size guide and measurements" | Regla 1, y unifica con la clave de locale que hoy dice otra cosa |
| `main-product` | "Pickup hours note" | Mover a theme settings | Es global, no pertenece a la plantilla de producto |
| `marquee` | "Loop duration" | igual + `info`: "Lower values scroll faster." | Regla 6 |
| `hero-editorial` | "Editorial split hero" | "Editorial hero" | El nombre describe uno de dos modos |

## 4.5 Los defaults en mayúsculas

Ocho defaults del tema están escritos en MAYÚSCULAS: `"THE EDIT / COUTURE 01"`, `"CURATED EDIT / 02"`, `"THE HAND AND THE MATERIAL / 03"`, `"MACRO STUDY / MATERIAL 07"`, `"DISCOVER BY FORM / 04"`, `"[01] FEATURED COLLECTION"`, `"[02] MATERIAL STUDY"`, `"FORM / MATERIAL / MOVEMENT"`.

Dos problemas. El primero es que `.eyebrow` ya aplica `text-transform: uppercase`, así que el texto se convierte dos veces y el merchant que quiera sentence case no puede, porque el CSS se lo impide. Con el nuevo `eyebrow_style` eso se resuelve, pero los defaults tienen que escribirse en sentence case para que el setting tenga algo que hacer.

El segundo es peor: los numerales `/ 01` a `/ 04` están acoplados al orden de las secciones en el homepage. El merchant reordena o borra una y la numeración queda mintiendo, sin que nada le avise que esos números los mantiene él a mano. O se les pone un `info` que lo diga, o se eliminan de los defaults.

Propuesta: sentence case y sin numeral. `"The edit"`, `"Curated selection"`, `"The hand and the material"`, `"Discover by form"`. Archive puede recuperar el numeral como parte de su identidad, ahí sí a propósito.

## 4.6 Términos de marca que deberían ser settings

Hay cinco palabras horneadas en los locales que definen el carácter del tema y que el merchant solo puede cambiar editando un archivo de traducción, que es justo lo que un merchant no técnico no hace:

```
blogs.blog.empty                "No essays have been published yet."
blogs.blog.article_count        "{{ count }} essays"
search.tabs.articles            "Journal"
not_found.title                 "Object not found in the atelier."
list_collections.product_count  "{{ count }} pieces"
```

Un joyero va a amar esto. Un merchant de calzado que publica guías de cuidado va a odiar que sus artículos sean "essays".

Sugerencia: subir a settings los cuatro términos de más fricción (nombre del blog, sustantivo de artículo, sustantivo de producto, nombre de la casa) y dejar el resto de la voz en los locales. La personalidad se mantiene y la trampa desaparece.

---

# 5. Evaluación del trabajo hasta ahora

Me pidieron opinión franca, así que va franca, con evidencia y sin adornos.

## 5.1 Lo que GPT-5.6 Sol Max hizo bien, y es más de lo que parece

He auditado bastantes temas de Shopify. La mayoría de los que cumplen todo el checklist están mal hechos por dentro. Este es el caso contrario, y es mucho mejor punto de partida.

Cinco cosas concretas que no se improvisan:

**La mejora progresiva es real, no decorativa.** Los facetados tienen un `type="submit"` nativo dentro del `<form method="get">`, los selling plans tienen un `<select name="selling_plan">` de respaldo, hay `<noscript>` funcional en tres secciones, y las clases `js-only` y `no-js-only` se usan de verdad. Casi nadie sostiene esto hasta el final.

**El manejo de foco e inert en el cart drawer.** No solo pone `inert` en el panel: recorre los hermanos del fondo, los marca, y **restaura el estado previo al cerrar** en vez de limpiar a ciegas. Ese detalle es de alguien que ya se quemó con ese bug.

**El tratamiento de reduced motion es mejor que el de Dawn.** Cinco animaciones gated detrás de `no-preference` más un kill switch universal, y el marquee no se congela sino que se reestructura en lista estática con el grupo `aria-hidden` duplicado y el botón de pausa removidos. Eso es entender la regla, no cumplirla.

**La disciplina de tokens.** 5.315 líneas de CSS y cero colores hardcodeados fuera del bloque `:root`. Ni uno.

**La interceptación del link de carrito** (`theme.js:1136-1148`): captura cualquier `<a>` cuyo pathname coincida con `routes.cart_url`, excluyendo los del propio drawer, y abre el drawer con JS o navega a `/cart` sin JS. Un solo handler, cero atributos extra en el markup, degradación perfecta. Es elegante.

## 5.2 El patrón de las debilidades, que es lo útil

Los hallazgos de la auditoría no están repartidos al azar. Se agrupan en tres sitios, y los tres son de alcance, no de competencia.

**Uno: los estados degenerados.** La colección vacía que dice "No products match your selection" cuando no hay ningún filtro aplicado. La barra de recompensas encima del carrito vacío. El tile de promoción repitiéndose en las nueve páginas de la paginación. Dos bloques con `position_in_grid: 4` por default colisionando en el mismo slot. Los dos `case` sin `else`. Cada componente funciona; el caso degenerado de cada componente no se caminó.

**Dos: las costuras entre componentes.** Y esta es la más interesante. El `150` en tres archivos sin fuente única. `Intl.NumberFormat` en `complete-the-look` mientras todo el resto usa el filtro `money` de Liquid. El guard que pregunta por `collection.image` y el render que usa `collection.featured_image`. `--button-radius` contra `--radius-button`. `[data-reduced-motion]` escrito por el JS y leído por nadie. Cada una de esas es una decisión correcta dentro de un archivo que contradice una decisión de otro archivo.

**Tres: el lado del comerciante.** Los schemas funcionan pero no están diseñados. Labels en vocabulario de developer, defaults en mayúsculas, sin `info` donde hay dependencias externas, traducción a medias. GPT construyó muy bien la vitrina y trató el editor como configuración, no como la segunda superficie de producto que es.

## 5.3 Lo que yo cambiaría del proceso, no de la persona

Los tres patrones anteriores son exactamente lo que produce un flujo de directivas cerradas por archivo. No es un defecto del implementador, es un efecto del formato: si el encargo dice "implementa el cart drawer", el cart drawer sale impecable y nadie mira si el `150` que acaba de escribir ya existe en el announcement bar.

Dos criterios de aceptación que le sugiero a Gemini agregar a cada directiva, y que cuestan poco:

**Pase de estado degenerado.** Antes de dar por cerrada una entrega, recorrer los cinco casos: vacío, uno solo, muchos, muy largo, y faltante. Cinco minutos por componente, y se caen ocho de los hallazgos P1 de la auditoría.

**Pase de consistencia entre archivos.** Una sola pregunta antes de cerrar: ¿este valor, este formato o esta variable ya existen en otro archivo del tema? Eso solo se caen los cinco hallazgos de costura.

## 5.4 Una cosa sobre la medición

"56 archivos, 0 ofensas en Theme Check" y "faltan tres features obligatorias de la Theme Store" son ambas verdaderas al mismo tiempo, y eso no es culpa de GPT. Theme Check valida sintaxis, filtros deprecados y esquemas. No sabe nada de si existe un selector de moneda, ni de si hay búsqueda predictiva, ni de si el contraste llega a 4.5:1.

La sugerencia es que el status del proyecto reporte dos métricas separadas y nunca una sola: **salud técnica** (Theme Check, sintaxis) y **cobertura de requisitos** (el checklist oficial, ítem por ítem, con casilla). Hoy la primera está en verde y se está leyendo como si cubriera a la segunda. Ese es el único riesgo real de proceso que veo en el proyecto, y se arregla con una tabla.

## 5.5 Dónde está el proyecto, en una frase

Tienen un tema bien construido con agujeros de requisito enumerables y dos decisiones de producto pendientes que ya tomaron. Eso es una posición de sprint, no de refactor. Y el hecho de que GPT-4A-001 ya esté corriendo sobre los P0 el mismo día de la auditoría dice más del equipo que cualquier cosa que yo pueda evaluar del código.

---

## 6. Secuencia recomendada para Fase 4

Un orden que respeta las dependencias reales entre los cuatro pilares.

| Orden | Trabajo | Por qué va ahí |
| --- | --- | --- |
| 1 | GPT-4A-001, los P0 de cumplimiento (ya en marcha) | Sin esto no hay submission |
| 2 | Agregar a GPT-4A-001 el escape de los cinco atributos (P0-8) | Mismos dos archivos que el filtro de precio. Cinco `\| escape` |
| 3 | Los 10 settings globales + arreglo de `--radius-button` | Bloquea los presets, y `border_contrast` cierra parte de P0-9 |
| 4 | Padding por sección | Es el multiplicador de diferenciación más grande entre presets |
| 5 | Hero de dos modos | Decisión de producto ya tomada, alto impacto en percepción |
| 6 | Galería de PDP con carrusel, lightbox y media unificada | Cierra P0-5 (librerías 3D) y el hueco de sincronización de variante |
| 7 | Renombrado de schemas y traducción completa a `t:` | Barato, y toca todos los archivos, mejor hacerlo de una sola pasada |
| 8 | Los 3 presets en `settings_data.json` | Solo tiene sentido después de 3 y 4 |
| 9 | Las 3 demo stores | El trabajo de contenido más largo. Arrancar la búsqueda de assets en paralelo desde ya |
| 10 | Lighthouse, axe, y el checklist de 18 pruebas de la auditoría | Validación final |

Quedo a disposición para auditar la especificación técnica que salga de esto antes de que GPT la ejecute, para redactar el copy y los strings de locale de los pilares 1 y 2, o para revisar los `info` de los settings nuevos uno por uno.

Claude, Auditor UX/UI y Editorial
CLAUDE-BLUEPRINT-001, modo READ-ONLY, 2026-09-13
