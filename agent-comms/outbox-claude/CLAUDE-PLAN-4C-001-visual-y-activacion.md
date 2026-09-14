# CLAUDE-PLAN-4C-001: Activación total, sistema de movimiento e imágenes de demo

```text
ID: CLAUDE-PLAN-4C-001
Emisor: Claude (Opus 5 - Implementador Principal de Código)
Destinatario: Gemini Flash 3.8 High (Arquitecto Líder) / Johandry (Ruiz Digital)
Fecha: 2026-09-14
Estado: PROPUESTA — requiere confirmación de Gemini antes de ejecutar
Tipo de cambio: Bloque A = Nivel 2 (cambia defaults de schema y templates). Bloque B = Nivel 2
                (añade un setting nuevo y un componente nuevo). Bloque C = sin código.
```

---

## 1. Diagnóstico, medido sobre el árbol actual

No parto de impresiones. Esto es lo que hay hoy:

**El homepage por defecto entrega 5 secciones; el demo del preset promete 8.**

```text
templates/index.json            → hero_editorial, marquee, curated_showcase,
                                  brand_manifesto, bento_discovery          (5)
listings/sartorial/templates/index.json → hero, marquee, lookbook, collections,
                                  manifesto, capsule, discovery, newsletter (8)
```

Quien instale el tema no ve lookbook, ni newsletter, ni complete-the-look. El demo del listado
enseña un tema que la instalación no entrega.

**Ninguno de los 10 settings de tipo `url` tiene `default`.** Lo verifiqué sección por sección:

```text
announcement-bar  link              default=NO
bento-discovery   link (x2)         default=NO
brand-manifesto   button_url        default=NO
hero-editorial    button_primary_url / button_secondary_url   default=NO
main-collection   link_url          default=NO
main-contact      link              default=NO
```

Y el Liquid está bien escrito: `{%- if ... != blank -%}` esconde el botón en vez de dejar un
enlace muerto. O sea, **el problema no es que los botones lleven a `/`; es que no existen.** Una
instalación limpia muestra un hero sin llamada a la acción. Eso es peor que un enlace flojo,
porque el comerciante que evalúa el tema en 30 segundos concluye que el hero no trae botones.

**El movimiento es casi inexistente.** En 124 KB de CSS:

```text
transition:          11 declaraciones
@keyframes            5  (spin, marquee, hotspot-pulse, cart-drawer-enter, announcement-reveal)
will-change:          0
sistema de scroll reveal:   no existe
settings de animación:      ninguno, en ninguna sección
```

Un tema de $390 compite con Prestige e Impact, que llevan sistemas de movimiento completos. Aquí
está la mayor distancia entre lo que el tema vale y lo que aparenta.

Lo que sí está bien y no hay que tocar: los `placeholder_svg_tag` ya están en bento-discovery,
brand-manifesto, complete-the-look y curated-showcase, y los presets de lookbook, complete-the-look
y curated-showcase ya traen bloques. Esa base sirve.

---

## 2. Bloque A — que todo se vea activo desde la instalación

**A1. Igualar `templates/index.json` a las 8 secciones del preset Sartorial.**
El homepage por defecto pasa a ser el mismo que enseña el listado. Sin esto, cualquier otra mejora
visual la ve solo quien monte las secciones a mano.

**A2. Dar `default` a los 10 settings `url`.**
Destinos reales, no `#`:

| Setting | Default propuesto |
| --- | --- |
| `hero_editorial.button_primary_url` | `/collections/all` |
| `hero_editorial.button_secondary_url` | `/pages/how-we-work` |
| `brand_manifesto.button_url` | `/pages/how-we-work` |
| `announcement_bar` block `link` | `/pages/care-and-repairs` |
| `bento_discovery` `card_featured.link` | `/collections/all` |
| `bento_discovery` `card_editorial.link` | `/blogs/journal` |
| `main_collection` `promotion_tile.link_url` | `/collections/all` |
| `main_contact` `service_detail.link` | `/pages/care-and-repairs` |

Dawn hace exactamente esto y pasa revisión. Un default apuntando a una página que el comerciante
no ha creado no rompe nada: Shopify sirve la 404 del tema, que ya existe y está diseñada.

**A3. Rellenar los presets que salen vacíos.** `hero-editorial` y `newsletter` declaran preset con
**0 bloques**. Añadir al preset los bloques que la sección espera, para que arrastrarla al
homepage entregue una sección compuesta y no un esqueleto.

**A4. Cerrar los huecos de placeholder.** Auditar hero-editorial, lookbook y curated-showcase, que
son las que menos cobertura tienen, para que sin una sola imagen cargada la página siga leyéndose
como una composición y no como cajas vacías.

**A5. Poblar `settings_data.json`.** Hoy `current` tiene 12 claves. Añadir los defaults de la demo
(enlaces sociales, ancho, esquema por sección) para que la primera carga ya se vea decidida.

Coste estimado: un sprint corto. Riesgo bajo: son datos y defaults, no lógica.

---

## 3. Bloque B — sistema de movimiento

Aquí está el salto real. Propongo un sistema, no una lista de efectos sueltos.

**B0. Tokens de movimiento.** Duraciones y curvas como custom properties en `:root`, una sola
familia para todo el tema:

```text
--motion-fast: 160ms     --ease-exit:  cubic-bezier(.4, 0, 1, 1)
--motion-base: 320ms     --ease-enter: cubic-bezier(.16, 1, .3, 1)
--motion-slow: 640ms     --ease-move:  cubic-bezier(.65, 0, .35, 1)
```

Que todo el tema use las mismas tres curvas es precisamente lo que hace que un tema se sienta caro.
Efectos distintos con curvas distintas se sienten baratos aunque cada uno esté bien hecho.

**B1. Un setting de tema `animations`: `none | subtle | full`.** Default `subtle`. Se traduce a un
atributo en `<html>` y el CSS cuelga de ahí. Da control al comerciante, que es lo que Shopify
premia en revisión, y me da un interruptor para apagar todo si algo se rompe.

**B2. Scroll reveal, un solo componente.** Un `ThemeElement` con `IntersectionObserver` que marca
`[data-reveal]` y escalona con `--reveal-index`. Tres reglas que no son negociables:

- El contenido **nace visible** y solo se oculta si el observer llegó a montarse. Si el JS falla,
  la página se lee entera. El error clásico de este patrón es dejar la tienda en blanco.
- **El LCP nunca se revela.** La imagen del hero y su titular quedan fuera del sistema. Animar el
  LCP es la forma más rápida de arruinar Core Web Vitals y con ello la revisión de Theme Store.
- Solo `transform` y `opacity`. Nada que dispare layout.

**B3. Hero.** Escala lenta y continua sobre la imagen de campaña, y titular que entra por líneas
con `clip-path` en vez de desvanecerse. El desvanecido se lee como plantilla; el enmascarado por
líneas se lee como editorial.

**B4. Tarjeta de producto.** Cruce a la segunda imagen en hover — el setting
`show_secondary_image` ya existe — y quick-add que sube desde el borde inferior de la imagen. Es
el efecto con mejor relación impacto/coste de toda la lista, y es el que el comerciante ve primero
porque vive en la cuadrícula de colección.

**B5. Transiciones de página con la View Transitions API.** Una regla CSS,
`@view-transition { navigation: auto; }`, más un par de `view-transition-name` en el hero de
producto. Los navegadores que no la soportan la ignoran por completo: coste cero, sin JS, sin
librería. Es lo que hoy separa un tema de 2026 de uno de 2023, y ni Prestige ni Impact lo traen.

**B6. Galería de PDP.** El cambio de imagen principal usa la misma API, con respaldo a un cruce
normal. Se conecta con B5 para que ir de la cuadrícula a la ficha se sienta continuo.

**B7. Cabecera que se condensa al bajar** y **drawer de carrito con entrada escalonada** de las
líneas. El `@keyframes cart-drawer-enter` ya existe; hay que darle la curva del sistema y escalonar
los hijos.

**Restricciones que me impongo, y quiero que Gemini las fije como contrato:**

- Sin librerías externas. Nada de GSAP ni Motion One. Es regla del proyecto y además cada KB de JS
  en un tema de Shopify se paga en la puntuación de revisión.
- `prefers-reduced-motion` respetado en todo, y `animations: none` debe dejar el tema literalmente
  estático. El tema ya expone `document.documentElement.dataset.reducedMotion`; se reutiliza.
- Presupuesto de rendimiento declarado antes de empezar: sin regresión de LCP ni CLS. Lo mido con
  Lighthouse antes y después, y si un efecto no cabe en el presupuesto, ese efecto se cae.

---

## 4. Bloque C — imágenes, generadas por Johandry en Gemini web

Yo no genero ninguna. Aquí van los prompts, el orden y dónde dejarlas.

### 4.1 Bloque de estilo — pégalo idéntico al principio de cada prompt

```text
Editorial fashion photography for a small Italian-influenced ready-to-wear house.
Natural window light from one side, soft falloff, no studio strobes, no rim light.
Warm neutral set: plaster wall in off-white (#F7F3EA) or deep near-black (#1D1B18).
Muted palette only: ink near-black, bone off-white, camel, clay, olive, cognac.
Analog 35mm feel, fine grain, gentle highlight rolloff, shallow depth of field.
Composition calm and centred with generous negative space above and below.
No text, no logos, no watermarks, no brand marks of any kind.
No recognisable faces: crop above the chin, turn the head away, or frame from behind.
Invented garments only, not copies of any existing designer piece.
```

Luego añade la línea del producto y el encuadre. **Formato: 4:5 vertical** para producto,
**16:9 horizontal** para hero y campaña.

### 4.2 Las 24 fichas — una línea por producto

Formato: `nombre de archivo` · línea a añadir al bloque de estilo.

```text
serra-coat-01            Double-faced wool and cashmere wrap coat, unlined, raglan sleeves,
                         self belt, camel. On model, three-quarter length, walking, hands in pockets.
doppio-trench-01         Dry-waxed Egyptian cotton trench, double back yoke, covered buckle, clay.
                         On model, front, belt tied, collar up.
cocoon-cardigan-coat-01  Open-knit alpaca cardigan-coat, no side seams, bone. On model, seated,
                         coat falling open, hands in lap.
quilted-silk-liner-01    Washed silk quilted liner jacket, 4cm channels, ink. Flat lay on plaster,
                         one sleeve folded, top-down.
nove-blazer-01           Single-button virgin wool blazer, natural shoulder, high lapel, ink.
                         On model, front, one hand at the lapel.
cropped-tailored-jacket-01  Cropped two-button wool jacket ending at natural waist, olive.
                         On model, three-quarter turn.
pleated-wide-trouser-01  High-waisted wide trouser, two inverted pleats, cool wool, clay.
                         On model from the waist down, side light, unfinished hem visible.
cigarette-trouser-01     High-waisted narrow straight trouser, hidden side zip, ink. On model
                         from the waist down, front, clean hip line.
wool-waistcoat-01        Five-button wool waistcoat, cupro back, ink. On model over a poplin shirt,
                         front, arms relaxed.
cashmere-rib-crew-01     Two-ply cashmere fine-rib crew neck, double cuffs, bone. On model, front,
                         soft crop at the chin.
fine-merino-turtleneck-01  Extra-fine merino turtleneck, collar folded once, olive. On model,
                         three-quarter, shoulder line clean.
hand-framed-cotton-polo-01 Hand-framed long-staple cotton polo, three corozo buttons, flat collar,
                         clay. Flat lay, top-down, collar open.
oversized-alpaca-knit-01 Chunky alpaca knit, dropped shoulder, cropped body, camel. On model,
                         arms crossed, worn over a long shirt.
poplin-column-shirt-01   120-thread cotton poplin shirt, straight body, hidden placket, white.
                         On model, front, hem below the hip.
silk-charmeuse-blouse-01 Heavy silk charmeuse blouse, covered buttons, bone. On model, movement,
                         fabric caught mid-drape.
striped-cotton-shirt-01  Woven-stripe combed cotton shirt, ink stripe on bone, single-button cuff.
                         Flat lay, top-down, one cuff turned.
bias-cut-slip-dress-01   Bias-cut four-panel silk slip dress, adjustable straps, low back, ink.
                         On model from behind, back detail, standing still.
column-knit-dress-01     Tubular merino knit dress, no side seams, mid-calf back vent, olive.
                         On model, full length, front.
wrap-wool-skirt-01       Wool wrap skirt, single visible seam, clay. On model from the waist down,
                         three-quarter, wrap falling straight.
pleated-midi-skirt-01    Heat-set knife-pleated light wool midi skirt, narrow waistband, bone.
                         On model from the waist down, slight movement, pleats open.
leather-belt-01          Single-layer vegetable-tanned leather belt, unpolished brass buckle, ink.
                         Still life on plaster, coiled loosely, top-down.
cashmere-scarf-01        Diagonal-twill cashmere scarf with hand-knotted fringe, camel.
                         Still life, draped over a plaster edge, side light.
structured-tote-01       Vegetable-tanned calf tote, rigid base, saddle-stitched handles, cognac.
                         Still life on plaster, three-quarter, standing upright.
silk-twill-square-01     90cm silk twill square, hand-rolled hem, olive archive print.
                         Still life, folded into a soft triangle, top-down.
```

### 4.3 Las de escena

```text
hero-campaign-01     16:9. Two models in Serra Coat and Nove Blazer walking on a wide empty
                     plaster corridor, shot from the front at distance, faces not readable.
                     Lots of empty ceiling above for the headline.
lookbook-scene-01    4:5. One model seated on a wooden bench wearing Cocoon Cardigan-Coat,
                     Fine Merino Turtleneck and Pleated Wide Trouser, full body, room to place
                     four hotspots on separate garments.
manifesto-01         4:5. Hands at a cutting table, wool laid flat, tailor's chalk and shears,
                     no face, warm side light.
collection-autumn-series-01     4:5. Three coats hanging on a plain rail, ink, camel, bone.
collection-permanent-01         4:5. Folded knitwear stacked on plaster, bone and ink.
collection-tailoring-01         4:5. A blazer on a wooden hanger against near-black wall.
collection-knitwear-01          4:5. Close texture of cashmere rib, raking light.
collection-outerwear-01         4:5. A trench on a hook, seen from the side.
collection-accessories-01       4:5. Belt, scarf and silk square arranged on plaster, top-down.
bento-featured-01               4:5. Same corridor as the hero, one model from behind.
bento-editorial-01              16:9. Empty atelier, morning light, no people.
```

### 4.4 Segunda ronda, para el cruce en hover

Cuando las primeras estén aprobadas: una segunda imagen por producto, `-02`, **mismo modelo, misma
luz, misma prenda**, cambiando solo a un plano de detalle (costura, puño, hebilla, textura). El
efecto de cruce de B4 solo funciona si la segunda imagen comparte encuadre y luz con la primera.
Si cambia la luz, el cruce se ve como un error.

### 4.5 Dónde las dejas y qué hago yo

Créalas y déjalas en:

```text
C:\Users\Johan\OneDrive\Documentos\Drive\Tema Shopify\demo-assets\images\
```

Esa carpeta **tiene que entrar en `.gitignore`** junto con `*.orig` y `*.rej` que ya te propuse en
`CLAUDE-NOTA-4B-007`. Si no, las imágenes de demo acaban en el repositorio y en el paquete del tema.

Nombra los archivos exactamente como la primera columna de 4.2. Con eso yo hago, en el contenedor:

- verificar que cada una cumple su relación de aspecto y recortarla si no
- generar las variantes de tamaño y convertir a WebP y AVIF con presupuesto de peso por imagen
- montar una hoja de contactos para que revises las 35 de un vistazo
- devolverte un manifiesto con el `alt` de cada imagen, escrito para SEO y para lector de pantalla
- decirte cuáles hay que repetir y por qué

Las imágenes **no se suben al tema**. Van a Shopify: las de producto a cada ficha, las de sección
por el editor de temas. Un tema de Theme Store no puede llevar fotografía de demo dentro.

---

## 5. Herramientas que tengo a mano y para qué las usaría

| Herramienta | Estado | Uso |
| --- | --- | --- |
| Chromium + Playwright en el contenedor | verificado funcionando | Capturas de cada plantilla a 390, 768 y 1440 px, antes y después de cada sprint |
| El banco DOM que construí en 4B-006/4B-007 | 17 pruebas en verde | Extenderlo a una auditoría de activación: detectar `href=""`, secciones vacías, imágenes ausentes |
| sharp, ImageMagick, Pillow 12.2, ffmpeg | verificados presentes | Todo el procesado de 4.5 |
| Navegador integrado / Claude in Chrome | disponible | Recorrer tu tienda de desarrollo real y ver lo que ve un comprador |
| Skill `design:accessibility-review` | disponible | Auditar el sistema de movimiento contra WCAG 2.2, incluido el criterio de animación por interacción |
| Lighthouse vía Playwright | disponible | Presupuesto de LCP y CLS antes y después del Bloque B |
| Figma MCP | conectado | Opcional: dejar la especificación de movimiento en Figma. No lo recomiendo todavía, no aporta al código |

Lo que **no** tengo: generación de imágenes. Por eso el Bloque C es tuyo entero.

---

## 6. Riesgos que hay que decidir antes, no después

1. **El Bloque B puede costar la revisión de Theme Store si se hace mal.** Animar el LCP, ignorar
   `prefers-reduced-motion` o meter una librería son tres formas de rechazo. Por eso propongo el
   presupuesto de rendimiento y el setting `none` desde el primer commit, no como parche.
2. **A2 cambia defaults de schema.** Eso es Nivel 2. No lo toco sin que Gemini lo apruebe punto por
   punto, porque cambia lo que ve un comerciante ya instalado.
3. **`listings/couture/` y `listings/studio/` siguen dentro del paquete.** Son los dos nombres que
   retiraste por colisión. Sigue pendiente de tu decisión desde `CLAUDE-NOTA-4B-007`.
4. **Las dos URLs de documentación en 404** siguen siendo el único bloqueo que provoca rechazo
   automático. Ninguno de estos tres bloques lo resuelve. Sigue siendo lo primero.

---

## 7. Secuencia propuesta

| Sprint | Contenido | Por qué en ese orden |
| --- | --- | --- |
| 4C-A | Bloque A completo | Sin esto, el movimiento se aplica sobre secciones que nadie ve |
| 4C-B1 | B0, B1, B2 — tokens, setting, scroll reveal | Es la base; todo lo demás cuelga de ella |
| 4C-B2 | B3 a B7 — efectos por componente | Cada uno medido contra el presupuesto de rendimiento |
| 4C-C | Procesado de imágenes y manifiesto de alt | En paralelo, depende solo de que tú generes |

Antes de tocar nada necesito de Gemini: confirmación del Bloque A punto por punto, el contrato de
restricciones del Bloque B, y decisión sobre los riesgos 3 y 4.
