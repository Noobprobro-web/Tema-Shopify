# REVIEW-X1-001: rama task/x1 (06447d2..41a6e29)

Revisión independiente y de solo lectura del worktree `wt-x1`, que queda limpio (sin cambios, commits ni push). Todo lo mío está en `/tmp/claude-0/-home-claude/3d846690-f2ab-5a56-81c7-4b0f6854bf89/scratchpad/rev-x1/`.

## Veredictos

| Commit | Veredicto |
|---|---|
| a895c7d click fantasma, foco del carrito, carrito desde el menú | ACEPTADO CON CONDICIONES (C-A) |
| e5da3b1 anuncio de precio en [data-variant-status] | ACEPTADO |
| 41a6e29 LV-03 compensación de la barra de scroll | ACEPTADO CON CONDICIONES (C-C) |

## (a) a895c7d: descarte del click fantasma

Arnés propio `rev-x1/x1.cjs`, casos A1 a A9, con isMobile+hasTouch, solo hasTouch, ratón y touch events por CDP.

Lo que funciona:
- A1: un toque fuera, sobre el enlace `#under`, cierra el menú, el foco va a trigger y el enlace no se activa. Sin el commit, el enlace sí se activaba.
- A2: un tap real en `#under` después de cerrar funciona a los 0, 60, 200 y 500 ms, porque el pointerdown nuevo libera el descarte.
- A3: Enter en el disparador 50 ms después del toque reabre el menú, porque el click fantasma ya se consumió.
- A5: con ratón no se descarta nada (`pointerType === 'mouse'`). Enter y un clic inmediatos funcionan.
- A6: en un dispositivo híbrido, toque fuera y clic de ratón 50 ms después: el clic pasa.
- A8: toque en el overlay del carrito: el foco vuelve a `#cart` y no hay click fantasma. Sin el commit, el foco caía en MainContent.
- A9: carrito abierto desde el menú, Escape y resize a 1280: el foco queda en d-shop. Sin el commit, caía en BODY.
- A4c: el descarte caduca a los 800 ms y no deja listeners colgados.

Lo que falla. Condición **C-A**:
- A4 y A4b: si el gesto que empieza en el overlay no termina en click (un arrastre o scroll táctil cierra el cajón en pointerdown y Chrome no emite click), el descarte se queda armado hasta 800 ms. En ese tiempo se come el siguiente click que no venga de un pointerdown:
  - Enter en el disparador no reabre el menú.
  - `el.click()` no activa el enlace, y así es como activan los lectores de pantalla que no generan pointerdown (TalkBack, acceso por teclado o switch).
- Arreglo propuesto: que `swallow` ignore los clicks con `event.detail === 0` (teclado, AT y `click()` programático) y que `pointercancel` libere el descarte. Volver a pasar A4 y A4b.

Nota menor:
- A7: con una pulsación larga de más de 800 ms en el overlay, el click llega después de que caduca el descarte y activa el enlace de debajo. El foco queda bien. Lo dejo como información.

## (b) e5da3b1: anuncio de precio

- El arnés del autor D-02-A da 79/79.
- Mi copia ampliada (`rev-x1/q.cjs`, casos Q-1 a Q-3, en PDP y en featured) da 85/85:
  - Q-1: cinco cambios seguidos producen cinco escrituras, una por cambio, y el texto final es el correcto.
  - Q-2: volver a elegir la misma variante no reanuncia.
  - Q-3: agotada y vuelta dan dos anuncios, y solo el de la variante disponible lleva precio.
- El precio sale de la cadena ya formateada con `| money`, así que respeta la moneda (probado con `€…,.. EUR`). Con un money format con HTML (`<span class=money>`), el anuncio sale sin etiquetas.
- Con la plantilla ES ("Variante disponible."), Q-1 a Q-3 pasan. La clave existe en `en.default.json` y en `es.json`, que son los únicos locales del tema.
- Cuando hay suscripción, el precio del plan no se duplica (P-2 a P-6 del autor).

## (c) 41a6e29: LV-03

Arnés propio con la barra clásica activa (`--hide-scrollbars` desactivado).

Lo que funciona:
- C1: a 1280 la barra mide 15px. Con la búsqueda o el carrito abiertos, `--scrollbar-compensation` vale 15px y el logo no se mueve (sin el commit se movía 7.5px). Al cerrar, la variable y el padding se liberan.
- C2: cajones anidados, menú y luego carrito desde el menú a 600px: la compensación se mantiene en el traspaso (una sola mutación de body) y el logo no se mueve. Se libera al cerrar.
- C3: móvil isMobile a 390, con barra superpuesta: compensación 0 y sin salto.
- C5: con zoom de pellizco x2, compensación 0.
- C6: página corta, sin barra: compensación 0.
- C7: resize con el bloqueo puesto: se libera al cerrar.
- El arnés del autor LV-03 da 27/27.

Lo que falla. Condición **C-C**:
- C4: en móvil, si algo de la página desborda en horizontal (aquí, un bloque de 700px a 390), Chrome reduce la escala para que quepa. Entonces `innerWidth - clientWidth` da 310 y body recibe `padding-right: 310px` al abrir el menú: un salto grande detrás del overlay. En base.css no hay `overflow-x` en html ni en body que lo evite.
- Arreglo propuesto: medir `documentElement.clientWidth` antes y después de bloquear y compensar solo la diferencia (o limitarla, por ejemplo a ≤ 32px). Volver a pasar C1 a C7.

Nota menor:
- Los elementos `position: fixed` centrados, como `.sticky-cart-bar`, siguen moviéndose 7.5px bajo el overlay. Es menor y no lo condiciono.

## (d) Regresiones

| Arnés | Fix | Base |
|---|---|---|
| Mío de B-01 (`rev-b01/review.cjs`) | 52/52 (el click fantasma ya no se produce) | — |
| Del autor de B-01 (`focus.cjs`) | 29/29 | — |
| Del autor X1-B01-TAP | 64/64 | — |
| D-02-Q (`harness-d02q/harness.js`) | 32/32 | 32/32 |
| D-02-Q (`harness-d02q/harness-drawer.js`) | 26/26 | 26/26 |
| D-02-Q (`rev-d02q-2/review2-harness.js`) | 34/34 | 34/34 |
| C2 (`rev-d02q-2/c2-harness.js`) | 13/13 | 13/13 |

D-02-A queda cubierto en (b). Mi `x1.cjs` da 28/31 con fix: las 3 fallas son A4, A4b y C4. Sin el commit da 24/31, con fallas distintas en los casos que este commit corrige. No hay errores de página.

## Comprobaciones

- `node --check assets/theme.js`: OK.
- Theme Check 4.8.0 sobre un git archive limpio de 41a6e29: `[]`, exit 0.
- El diff no contiene credenciales.
