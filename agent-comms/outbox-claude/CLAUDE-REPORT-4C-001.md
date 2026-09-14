# CLAUDE-REPORT-4C-001: Activación Total (Bloque A) y Micro-Ajustes Gate 5

```text
ID: CLAUDE-REPORT-4C-001
Emisor: Claude (Opus 5 - Implementador Principal de Código)
Destinatario: Gemini Flash 3.8 High (Arquitecto Líder) / Johandry (Ruiz Digital)
Responde a: CLAUDE-DIRECTIVE-4C-001
Fecha: 2026-09-14
Estado: ENTREGADO CON UNA ESCALACIÓN
Decisión requerida: (1) resolver el punto 3 de la Parte 1, escalado y NO implementado.
                    (2) autorización de commit/push.
Commit/push realizado: NO
```

---

## 1. Resumen

De los 9 puntos de la directiva: **6 implementados**, **2 verificados como ya cumplidos** (no
requerían código), **1 escalado sin implementar** porque rompe la PDP.

Las 8 compuertas estáticas terminan en código 0 con Theme Check en **74 archivos, 0 ofensas**.

| Punto | Resultado |
| --- | --- |
| P1.1 Contraste botón de pago | Implementado, con 2 correcciones al CSS propuesto |
| P1.2 Área táctil de la marca | Implementado y medido: 44×44 px |
| **P1.3 `aspect-ratio: 1/1` en galería** | **NO implementado. Escalado — recorta el 58% de la foto** |
| P1.4 Higiene `.gitignore` | Implementado |
| A1 Homepage a 8 secciones | Implementado y validado contra los 8 schemas |
| A2 Defaults en settings `url` | Implementado: 8 de 8 settings de sección |
| A3 Poblar presets vacíos | **Ya cumplido sin código.** Esas secciones no tienen bloques |
| A4 Cobertura `placeholder_svg_tag` | **Ya cumplido sin código.** Las 3 secciones ya la tenían |
| A5 Poblar `settings_data.json` | Implementado: 2 claves. Las otras 7 deben quedar vacías |

---

## 2. La escalación: `aspect-ratio: 1 / 1` recorta más de la mitad de cada foto

La directiva pide `aspect-ratio: 1 / 1` en `.product-gallery__item` (`assets/base.css:1014`) para
reservar espacio antes de que cargue la imagen. **No lo implementé.** Lo medí primero.

`.product-gallery__item` es el `<figure>` contenedor y ya trae `overflow: hidden`. La imagen
interior es `.product-gallery__image { width: 100% }` sin altura fija, así que conserva su
proporción intrínseca. Al forzar el contenedor a cuadrado, una foto vertical se sale y se corta.

Monté la regla real con una imagen 4:5 —la proporción que el propio `CLAUDE-DEMO-001` especifica
para la fotografía de producto— y medí:

```text
                         alto del <figure>   alto de la <img>
HOY (sin aspect-ratio)        1003 px             1000 px
CON aspect-ratio: 1/1          420 px             1000 px   <- 580 px recortados
```

**Se pierde el 58% de la imagen.** En la captura adjunta (`aspect-ratio-pdp.png`) las marcas
"MIDDLE" y "HEM" desaparecen por completo: en una prenda real, el bajo del abrigo deja de verse.
En la página más importante de un tema de moda, y en todas las fotos verticales a la vez.

Y el problema que busca resolver ya está resuelto. El tema renderiza la galería con
`snippets/product-media.liquid` sobre `responsive-image`, que usa el filtro `image_tag` de Shopify:
**`image_tag` emite `width` y `height`**, así que el navegador ya conoce la proporción y reserva el
espacio antes de descargar. Es el mecanismo estándar contra CLS y ya está en su sitio. Coherente
con esto, tu propia medición de Gate 5 da **CLS 0.001 en PDP**.

Si el shift de pie de página en escritorio es reproducible, el camino correcto no es cuadrar el
contenedor sino, por ejemplo, dar al `<figure>` una proporción igual a la de la imagen, o reservar
altura mínima en el contenedor del carrusel. **Necesito la medición de escritorio que lo
reproduce** —la directiva cita el número móvil— antes de proponer nada. Quedo a la espera.

---

## 3. Parte 1: micro-ajustes aplicados

### 3.1 Botón de pago dinámico — `assets/base.css:358-368`

Implementado, con dos correcciones al CSS de la directiva:

**Corrección 1: `var(--duration-default)` no existe.** El tema no declara **ningún** token de
duración: cero `--duration`, cero `--transition`, cero `--ease` en los 124 KB de `base.css`. Con la
variable indefinida, `transition: opacity var(--duration-default) ease` es una declaración
**inválida y el navegador la descarta entera**.

**Corrección 2: la transición apuntaba a la propiedad equivocada.** El `:hover` cambia
`background-color`, pero la transición propuesta anima `opacity`. Aunque la duración hubiese sido
válida, no habría animado nada.

Usé el literal que ya emplea `.button` en la línea 347 del mismo archivo, que es la convención
existente del tema:

```css
.shopify-payment-button__button--unbranded {
  border-radius: var(--button-radius);
  background-color: var(--color-foreground) !important;
  color: var(--color-background) !important;
  transition: background-color 180ms ease, color 180ms ease;
}
```

No introduzco un token de duración aquí a propósito: el sistema de tokens de movimiento es el
punto B0 del Sprint 4C-002 y le corresponde a él definirlo una sola vez para todo el tema.

Verificado en Chromium con el `base.css` real:

```text
boton pago bg/color: #1c1917 / #faf8f5
contraste          : 16.50:1   PASS AA
transicion         : background-color, color   0.18s, 0.18s
```

16.50:1, por encima del >12:1 que estimaba la directiva. `--color-foreground` y `--color-background`
están declarados en `:root` (`base.css:2` y `:6`), así que la regla resuelve en cualquier página
sin depender de la clase de esquema.

### 3.2 Área táctil de la marca — `assets/base.css:617-620`

`min-width` y `min-height` con `var(--tap-target-min)`, que ya existía declarado en `:root`
(`base.css:40`). La regla ya era `display: inline-flex` con `align-items: center`, así que los
mínimos aplican sin tocar la maqueta. Medido a 390 px con la marca en texto plano:

```text
marca movil: 44 x 44   PASS (>=44px)
```

### 3.3 `.gitignore`

Añadidos `*.orig`, `*.rej`, `demo-assets/` y `Claude outputs/`. Los dos primeros cierran el agujero
que describí en `CLAUDE-NOTA-4B-007`, por el que un respaldo de `patch` llegó a empaquetarse dentro
del zip del tema.

---

## 4. Parte 2: Bloque A

### 4.1 A1 — homepage a 8 secciones

`templates/index.json` pasa de 5 a 8 secciones, con el orden del demo del listado:

```text
hero_editorial → marquee → lookbook → curated_showcase → brand_manifesto
               → complete_the_look → bento_discovery → newsletter
```

Además de las tres secciones nuevas, se enriquecen las existentes hasta igualar el demo: marquee de
3 a 4 líneas, curated-showcase de **1 a 3 pestañas**, brand-manifesto de 3 a 4 detalles, y el hero
pasa a modo `cinematic` con `overlay_style: gradient_bottom` y `heading_tag: h1`.

Dos decisiones que me aparté del listado, ambas para que una instalación **sin contenido** se vea
bien:

- **`media_type: "image"` en vez de `"video"`.** El listado apunta a un video que solo existe en la
  tienda demo. La cadena del Liquid es video → imagen → placeholder, así que ambas opciones acaban
  en el placeholder; pero con `image` el comerciante ve el modo que corresponde a lo que tiene, en
  vez de "video" seleccionado y nada que mostrar.
- **Las URLs de los botones se omiten del template.** Las aporta el default del schema que añade
  A2. Una sola fuente de verdad, igual que hace Dawn.

Validé el template contra los 8 schemas: cada `type` de bloque existe, cada `id` de setting existe,
ningún `max_blocks` superado.

```text
VALIDACION templates/index.json contra los 8 schemas: 0 problemas
```

Es una comprobación que Theme Check **no** hace sobre plantillas JSON. Propongo adoptarla como
novena compuerta; queda a tu criterio.

### 4.2 A2 — defaults en los settings `url`

Aplicados los **8 settings de sección** que enumera la directiva:

```text
sections/hero-editorial.liquid:385    button_primary_url    -> /collections/all
sections/hero-editorial.liquid:398    button_secondary_url  -> /pages/how-we-work
sections/brand-manifesto.liquid:120   button_url            -> /pages/how-we-work
sections/announcement-bar.liquid:129  link                  -> /pages/care-and-repairs
sections/bento-discovery.liquid:218   card_featured.link    -> /collections/all
sections/bento-discovery.liquid:265   card_editorial.link   -> /blogs/journal
sections/main-collection.liquid:461   promotion_tile.link_url -> /collections/all
sections/main-contact.liquid:311      service_detail.link   -> /pages/care-and-repairs
```

**Sobre el "10" del encabezado de A2:** el tema tiene 13 settings de tipo `url`. 8 son de sección y
son los que la directiva enumera. Los **5 restantes son los enlaces sociales** de
`config/settings_schema.json`, y **no deben llevar default**: un default ahí mandaría el pie de
página de cada comerciante al Instagram de otra persona. El número 10 viene de mi propio recuento
de 4B-006, que contaba los que no tenían `info`, no los que necesitan `default`. Los 8 son los
correctos.

Con esto se cierra, por fin, el defecto con el que empezó este encargo: `button_secondary_label`
vale **"Explore lookbook"** y no tenía URL, así que el botón no se renderizaba.

### 4.3 A3 — ya cumplido, sin código

La directiva pide poblar los bloques por defecto en los presets de `hero-editorial` y `newsletter`.
**Esas dos secciones no definen ningún tipo de bloque:**

```text
sections/hero-editorial.liquid   blocks definidos: []   presets: [(nombre, 0 bloques)]
sections/newsletter.liquid       blocks definidos: []   presets: [(nombre, 0 bloques)]
```

No es que su preset esté incompleto: son secciones de solo-settings por diseño, y sus settings ya
traen copy por defecto (eyebrow, heading, subheading, labels). Lo único que les faltaba eran las
dos URLs del hero, que es exactamente lo que arregla A2. No añadí bloques inventados.

### 4.4 A4 — ya cumplido, sin código

Las tres secciones ya tenían `placeholder_svg_tag`:

```text
hero-editorial.liquid:122     'lifestyle-1'
lookbook.liquid:61            'lifestyle-2'
curated-showcase.liquid:104   'product-1'  (+ una segunda cobertura en :129)
```

### 4.5 A5 — `config/settings_data.json`

Solo **dos** settings tenían default de schema sin declararse en `current`: `cart_type` (`drawer`) y
`show_cart_note` (`false`). Añadidos, para que el archivo diga qué entrega la instalación en vez de
dejarlo implícito.

Los **7 restantes se quedan sin valor a propósito**: `logo` y `favicon` son `image_picker` —Shopify
no admite defaults ahí, y un tema no puede traer el logo de su comerciante— y los 5 enlaces sociales
por la misma razón del apartado 4.2.

**Nota de proceso:** mi primera versión re-serializó el JSON entero y produjo un diff de 199 líneas
para añadir 2 claves, porque expandió los objetos de esquema de color que estaban en una línea. Lo
descarté y lo rehice como edición textual mínima. El diff final son **4 líneas**.

---

## 5. Verificación

```text
$ npm run gates:static
Archivos .json comprobados: 34
Fallos de parseo:           0
Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado
                    volvio a 0 ofensas.
OK: todas las referencias estaticas resuelven contra los locales.
Filas de requisito: 53
Incoherencias: 0
│  74 files inspected with no offenses found.                                  │
│  Your local theme was packaged in Sartorial-1.0.0.zip                        │
EXIT=0
```

Comprobaciones adicionales, fuera de las compuertas:

```text
templates/index.json contra los 8 schemas   : 0 problemas
schemas de las 6 secciones tocadas parsean  : OK, 8 defaults presentes
marca movil a 390px                         : 44 x 44   PASS
contraste boton de pago                     : 16.50:1   PASS AA
```

Sobre traducciones `t:`: **no añadí ni un solo label, setting ni string nuevo**. Solo valores
`default` sobre settings que ya existían con su label ya localizado, y contenido de plantilla, que
no pasa por el sistema de traducción de schema. No hay claves nuevas que traducir, y `gates:locales`
lo confirma en verde.

---

## 6. Archivos tocados

| Archivo | Líneas | Qué |
| --- | --- | --- |
| `assets/base.css` | 358-368, 617-620 | Botón de pago, área táctil de la marca |
| `.gitignore` | +4 | `*.orig`, `*.rej`, `demo-assets/`, `Claude outputs/` |
| `templates/index.json` | reescrito | 5 → 8 secciones |
| `config/settings_data.json` | 75-77 | `cart_type`, `show_cart_note` |
| `sections/hero-editorial.liquid` | 385, 398 | 2 defaults `url` |
| `sections/brand-manifesto.liquid` | 120 | 1 default `url` |
| `sections/announcement-bar.liquid` | 129 | 1 default `url` |
| `sections/bento-discovery.liquid` | 218, 265 | 2 defaults `url` |
| `sections/main-collection.liquid` | 461 | 1 default `url` |
| `sections/main-contact.liquid` | 311 | 1 default `url` |

`assets/theme.js` **no se tocó** en este sprint.

---

## 7. Afirmaciones falsables

1. `npm run gates:static` termina en código 0; Theme Check, 74 archivos y 0 ofensas.
2. `.product-gallery__item` **no** lleva `aspect-ratio` en el árbol entregado.
3. Con `aspect-ratio: 1/1`, una imagen 4:5 pierde 580 de sus 1000 px de alto dentro del `<figure>`.
4. `--duration-default` no está declarado en `assets/base.css`, ni antes ni después de este sprint.
5. `templates/index.json` declara 8 secciones y valida sin errores contra los 8 schemas.
6. Los 8 settings `url` de sección tienen `default`; los 5 sociales no, deliberadamente.
7. `hero-editorial` y `newsletter` declaran `"blocks": []`.
8. El diff de `config/settings_data.json` contra el árbol previo es de 4 líneas.
9. No se añadió ninguna clave de traducción nueva.
10. No se ejecutó `git commit` ni `git push`.

---

## 8. Lo que queda

- **Decidir el punto 3.** Necesito la medición de escritorio que reproduce el shift de pie de página.
- Sprint 4C-002, Bloque B de movimiento, con el contrato ya acordado.
- Las dos URLs de documentación y soporte: DP-001 cierra el dónde (`/pages/documentation` y
  `/pages/support`), pero las páginas todavía no existen. Sigue siendo el único bloqueo que provoca
  rechazo automático.
