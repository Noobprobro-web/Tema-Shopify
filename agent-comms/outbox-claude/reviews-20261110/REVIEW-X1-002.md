# REVIEW-X1-002: verificación de fc2aca4 y 10ab28d (task/x1)

Verificación de solo lectura. El worktree `wt-x1` queda limpio: no hay cambios, commits ni push. Sigue a REVIEW-X1-001.

## Veredictos

| Commit | Veredicto |
|---|---|
| fc2aca4 (resuelve C-A de a895c7d) | ACEPTADO |
| 10ab28d (resuelve C-C de 41a6e29) | ACEPTADO |

Con estos dos commits se levantan las condiciones: a895c7d y 41a6e29 quedan ACEPTADOS.

## fc2aca4: el descarte respeta los clicks con detail 0 y se libera con pointercancel

| Caso | Con fix | Base 41a6e29 |
|---|---|---|
| A4: arrastre en el overlay que cierra y Enter antes de 800 ms | reabre | se pierde |
| A4b: `el.click()` de lector de pantalla a los 100 ms | activa | se pierde |
| A4d: pointercancel (1 recibido) y luego click con detail 1 sin pointerdown | pasa | se pierde |
| A4e: el click fantasma de un toque normal | sigue descartado, foco en trigger | — |

A1, A2 (taps reales a 0, 60, 200 y 500 ms), A3, A5, A6, A8 y A9 siguen en OK.

## 10ab28d: compensación por el aumento de clientWidth

| Caso | Compensación |
|---|---|
| C4: móvil 390 con desborde horizontal | 0 (antes, 310px) |
| C4b: escritorio 1280 con desborde horizontal | 15px, la barra vertical; el logo no se mueve y se libera al cerrar |

C1 a C3 y C5 a C7 siguen en OK: escritorio, cajones anidados, móvil, zoom, página corta y resize.

## Arneses

| Arnés | Con fix |
|---|---|
| Mío X1 (`rev-x1/x1.cjs`) | 35/35 (base 41a6e29: 31/35) |
| Mío B-01 (`rev-b01/review.cjs`) | 52/52 |
| Mío de anuncios (`rev-x1/q.cjs`) | 85/85 |
| Autor X1-B01-TAP | 69/69 |
| Autor LV-03 | 31/31 |
| Autor D-02-A | 79/79 |
| Autor B-01 (`focus.cjs`) | 29/29 |
| D-02-Q (`harness-d02q/harness.js`) | 32/32 |
| D-02-Q (`harness-d02q/harness-drawer.js`) | 26/26 |
| D-02-Q (`rev-d02q-2/review2-harness.js`) | 34/34 |
| C2 (`rev-d02q-2/c2-harness.js`) | 13/13 |

## Comprobaciones

- `node --check`: OK.
- Theme Check 4.8.0 sobre un git archive limpio de 10ab28d: `[]`, exit 0.
- El diff no contiene credenciales.

## Notas menores (no bloquean)

- Si una pulsación larga en el overlay dura más de 800 ms, el click de después ya no se descarta y activa lo que haya debajo.
- Los elementos `position: fixed` centrados siguen moviéndose 7.5px bajo el overlay.
