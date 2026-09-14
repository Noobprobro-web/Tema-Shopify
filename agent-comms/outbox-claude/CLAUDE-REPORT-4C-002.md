# CLAUDE-REPORT-4C-002: Sistema de Movimiento Cinemático (Bloque B)

```text
ID: CLAUDE-REPORT-4C-002
Emisor: Claude (Opus 5 - Implementador Principal de Código)
Destinatario: Gemini Flash 3.8 High (Arquitecto Líder) / Johandry (Ruiz Digital)
Responde a: CLAUDE-DIRECTIVE-4C-002
Fecha: 2026-09-14
Estado: ENTREGADO
Decisión requerida: Autorización de commit/push. Una desviación de diseño en B4 que
                    necesita tu visto bueno (§4).
Commit/push realizado: NO
Base: 490aa1e
```

---

## 1. Resumen

B0 a B7 implementados. 8 compuertas en código 0, Theme Check **74 archivos, 0 ofensas**.

El banco de pruebas pasa **24 de 24**: 7 pruebas nuevas del sistema de movimiento más las 17
de los sprints 4B-006 y 4B-007, sin regresión.

Cero librerías externas. Cero dependencias nuevas. `assets/theme.js` crece 3,6 KB y
`assets/base.css` 6,8 KB, todo CSS nativo y JavaScript vanilla sobre la arquitectura existente.

| Punto | Estado |
| --- | --- |
| B0 Tokens de movimiento | Implementado. **12 de 12** transiciones dispersas migradas |
| B1 Setting maestro `animations` | Implementado, con clave localizada |
| B2 Motor de scroll reveal | Implementado, con 3 pruebas de que nada queda oculto |
| B3 Hero cinemático | Implementado, con el LCP intacto |
| B4 Tarjeta de producto | Implementado **con una desviación de diseño: §4** |
| B5 View Transitions API | Implementado |
| B6 Galería de PDP | Implementado |
| B7 Cabecera y cart drawer | Implementado |

---

## 2. La regla sagrada, verificada y no solo afirmada

El fallo grave posible en este sprint es dejar contenido escondido para siempre. El sistema tiene
una sola puerta: el CSS solo oculta un elemento cuando `<html>` lleva `data-reveal-ready`, y ese
atributo lo escribe `initScrollReveal` **únicamente** si hay `IntersectionObserver`, el comerciante
no eligió `animations: none` y el visitante no pidió reducir movimiento.

No lo dejo en la palabra. Monté el `theme.js` y el `base.css` reales en Chromium y medí la
opacidad computada de los elementos en los tres escenarios de fallo:

```text
✓ contenido nace visible: sin IntersectionObserver nada se oculta
✓ contenido nace visible: con animations=none nada se oculta
✓ contenido nace visible: con prefers-reduced-motion nada se oculta
✓ el LCP del hero nunca entra en el reveal
✓ lo que esta bajo el pliegue se oculta y se revela al llegar
✓ el escalonado reinicia en cada rejilla
✓ la cabecera se condensa al bajar y vuelve al subir
```

En los tres primeros, `data-reveal-ready` no llega a existir y cada elemento medido da
`opacity: 1`. En el cuarto, `.hero-editorial [data-reveal]` devuelve **0 nodos**: ni la imagen de
campaña ni nada dentro del hero entra jamás al sistema. El motor lo garantiza por dos vías
independientes: `.hero-editorial` no está en la lista de objetivos, y además hay un
`node.closest('.hero-editorial')` que descarta cualquier coincidencia futura.

Las dos llaves de apagado están en `base.css:6253` (comerciante) y `:6265` (visitante). La del
visitante es un bloque `@media (prefers-reduced-motion: reduce)` global con `!important`, así que
**gana sobre cualquier elección del comerciante**, incluido `full`. Dentro apaga también las
transiciones de página: `@view-transition { navigation: none; }`.

---

## 3. B0: la migración se hizo por intención, no por valor

La directiva pide sustituir las transiciones dispersas por los tokens. Había 12. **No las mapeé
por número**, porque snapping mecánico de 220ms a 320ms habría vuelto un 45% más lento algo que ya
estaba bien. Cada una se asignó por lo que hace:

| Rol | Token | Casos |
| --- | --- | --- |
| Realimentación de estado (hover de botón, giro de chevron, subrayado de pestaña) | `--motion-fast` + `--ease-move` | `.button`, `.shopify-payment-button`, toggles de nav, `.curated-showcase__tab`, `.faq-item__icon` |
| Entrada de superficie (cruce de imagen, drawer, video del hero, barra de progreso) | `--motion-base` + `--ease-enter` | `.product-card__image` opacidad, `cart-drawer`, `.hero-editorial__video`, `.cart-rewards__fill` |
| Escala de imagen | `--motion-slow` + `--ease-move` | `.product-card__image` transform, `.curated-showcase__spotlight-image`, `.bento-card__image` |

Quedan **0 transiciones sin token** en `base.css`. Lo verifiqué contando las líneas con
`transition:` que no contienen `var(--motion-`.

Añadí dos tokens que la directiva no enumera y que el sistema necesitaba: `--reveal-shift: 12px`
y `--reveal-stagger: 60ms`. La distancia se queda corta a propósito: por encima de unos 16px el
desplazamiento deja de leerse como asentamiento y empieza a leerse como carga lenta.

---

## 4. Desviación en B4, y por qué

La directiva pide que el Quick-Add **se deslice desde el borde inferior de la tarjeta o la imagen**.
Lo implementé como **entrada en el sitio que ya ocupa**, no como superposición sobre la foto.
Razón:

`.product-card__action` vive dentro de `.product-card__content`, debajo del precio, y
`.product-card__media` es un `<a>`. Superponerlo sobre la imagen exige **mover el bloque dentro del
`<a>`**, y un `<form>` dentro de un ancla es HTML inválido: haría falta reestructurar
`snippets/product-card.liquid` convirtiendo el enlace en un `<div>` con un ancla interior. Ese
snippet lo usan colección, búsqueda, recomendaciones y curated-showcase; es el componente más
reutilizado del tema. Reestructurarlo en el mismo sprint que estrena el motor de reveal me parece
mal reparto de riesgo.

Las dos alternativas sin reestructurar son peores:

- **Anclarlo al borde inferior de la tarjeta** con `position: absolute` tapa el precio.
- **Ocultarlo y revelarlo en flujo sin reservar espacio** hace crecer y encoger la tarjeta en
  hover, lo que desplaza toda la rejilla. Es CLS puro en la página de colección.

Lo que entregué (`base.css:1753`) conserva **siempre** el espacio del botón, así que no mueve un
píxel, y anima solo `opacity` y `transform`. Solo se aplica bajo `@media (hover: hover) and
(pointer: fine)`: en pantallas táctiles el botón está visible y es directamente pulsable, como pide
la directiva. También responde a `:focus-within`, así que quien navega con teclado lo ve aparecer al
tabular dentro de la tarjeta.

**Si prefieres la superposición sobre la imagen, la hago en un sprint propio** donde el único
cambio sea `product-card.liquid` y pueda verificar el cruce de imágenes, el foco y el grid con
capturas antes y después. No la meto de contrabando aquí.

El resto de B4 sí está completo: el cruce primaria/secundaria ahora usa `--motion-base` y
`--ease-enter`, y la escala de la imagen `--motion-slow`.

---

## 5. Archivos y líneas

| Archivo | Líneas | Qué |
| --- | --- | --- |
| `assets/base.css` | 45-55 | B0: tokens de movimiento y de reveal en `:root` |
| `assets/base.css` | 12 sitios | B0: migración de las transiciones dispersas |
| `assets/base.css` | 1753-1780 | B4: entrada del Quick-Add sin desplazamiento |
| `assets/base.css` | 6142-6291 | Bloque del sistema: B5, B2, B3, B6, B7 y las 2 llaves |
| `assets/theme.js` | 3219-3233 | B2: lista de objetivos y tope de escalonado |
| `assets/theme.js` | 3235-3277 | B2: `initScrollReveal` |
| `assets/theme.js` | 3279-3293 | B7: `initHeaderScrollState` |
| `assets/theme.js` | 3295-3296 | Arranque de los dos |
| `layout/theme.liquid` | 3 | B1: `data-animations` en `<html>` |
| `config/settings_schema.json` | 197-224 | B1: grupo y setting `animations` |
| `locales/en.default.schema.json` | `settings_schema.animations` | B1: 5 claves nuevas |
| `sections/cart-drawer.liquid` | 125-130 | B7: `--item-index` por línea |

Ningún archivo nuevo. `snippets/product-card.liquid` **no se tocó** (ver §4).

Detalles de implementación que conviene conocer al revisar:

- El escalonado se calcula **entre hermanos**, no por sección, así que cada rejilla empieza en 0 en
  vez de heredar el conteo de la anterior. Hay prueba de ello.
- El índice se topa en 7 (`REVEAL_STAGGER_CAP`). Sin tope, una rejilla de 40 productos tardaría más
  de dos segundos en terminar de entrar y el escalonado dejaría de leerse como ritmo.
- `will-change` se pone al observar y se retira en `[data-revealed]`. Dejarlo permanente reserva una
  capa de composición por elemento y castiga la memoria en rejillas largas.
- El observer hace `unobserve` en cuanto revela, y se vuelve a registrar en
  `shopify:section:load` para que el editor de temas funcione.
- El listener de scroll de la cabecera es pasivo y solo escribe cuando el estado **cambia**, así que
  no toca el DOM en la inmensa mayoría de los eventos.

---

## 6. Verificación

```text
$ npm run gates:static
Fallos de parseo:           0
Contratos rotos: 0
[theme-check-sanity] OK. Las 3 clases se detectaron por separado y el sandbox restaurado
                    volvio a 0 ofensas.
OK: todas las referencias estaticas resuelven contra los locales.
Incoherencias: 0
│  74 files inspected with no offenses found.                                  │
│  Your local theme was packaged in Sartorial-1.0.0.zip                        │
EXIT=0

$ node --check assets/theme.js
(sin salida, codigo 0)

$ npx playwright test  (banco completo)
  24 passed (12.0s)
```

`gates:locales` en verde confirma la Compuerta 4: las 5 claves nuevas de `animations` resuelven
contra `locales/en.default.schema.json`. No hay ningún literal sin `t:` en lo que añadí.

**Un artefacto de prueba, no del producto:** la prueba de la cabecera falló en la primera pasada
porque `base.css:97` declara `scroll-behavior: smooth` y mi `scrollTo` era animado; esperaba 150 ms
fijos en vez del valor real de `scrollY`. Corregí la prueba, no el código. Lo anoto porque el
resultado intermedio quedó registrado.

---

## 7. Afirmaciones falsables

1. `npm run gates:static` termina en código 0; Theme Check, 74 archivos, 0 ofensas.
2. `node --check assets/theme.js` sale con código 0.
3. `base.css` no contiene ninguna línea `transition:` sin `var(--motion-…)`.
4. Sin `IntersectionObserver`, con `animations: none` o con `prefers-reduced-motion: reduce`,
   `<html>` **no** recibe `data-reveal-ready` y todo elemento medido da `opacity: 1`.
5. `.hero-editorial [data-reveal]` devuelve 0 nodos.
6. `--reveal-index` reinicia en 0 en cada rejilla y se topa en 7.
7. El bloque `@media (prefers-reduced-motion: reduce)` usa `!important` y por tanto vence a
   `animations: full`.
8. `snippets/product-card.liquid` no fue modificado.
9. Se añadieron 5 claves de traducción, todas bajo `settings_schema.animations`.
10. Las 17 pruebas de 4B-006 y 4B-007 siguen en verde.
11. No se ejecutó `git commit` ni `git push`.

---

## 8. Lo que queda

- **Decidir §4:** si quieres el Quick-Add superpuesto sobre la imagen, lo hago en un sprint
  dedicado a `product-card.liquid`.
- **Medición de rendimiento real.** Este sprint se verificó contra correctitud, no contra
  Lighthouse. El presupuesto que acordamos —cero regresión de LCP y CLS— hay que medirlo en la
  tienda de desarrollo, y eso te toca a ti o a Gemini. Mi diseño lo protege (el LCP no se anima,
  solo se usan `transform` y `opacity`, `will-change` se retira), pero **protegido no es medido**.
- Las páginas `/pages/documentation` y `/pages/support` siguen sin existir. Es el único bloqueo que
  provoca rechazo automático en Theme Store.
