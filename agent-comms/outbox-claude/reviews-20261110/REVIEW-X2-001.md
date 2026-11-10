# REVIEW-X2-001. Estado "Sold out" de los swatches solo donde aplica

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `dbcfeb1d660fe8248b9a28669142537089c0d2e1` (task/x2, worktree `wt-x2`), sobre `origin/lote-e-claude` `06447d2`, que ya contiene LV-05 `cfe8b4f`. El diff `origin/lote-e-claude...dbcfeb1` toca solo `snippets/product-card.liquid` (+20/-5). No modifiqué el repo ni hice commit o push, y `git status --short` sale vacío. Mis archivos están en `scratchpad/review-x2/`.

## Veredicto

**ACEPTADO.**

El texto "Sold out" ya no aparece suelto en el flujo de lectura ni queda pegado al conteo. Solo se renderiza cuando un swatch visible de un producto disponible está agotado, con `hidden`, y llega únicamente como descripción de ese swatch. Si el producto entero está agotado, lo anuncia solo el badge. Se verificó en EN y ES. No hay regresiones de LV-05, Theme Check 4.8.0 da `[]` y no hay credenciales.

Recomendación no bloqueante (P3): la doble lectura de "Sold out" al elegir un swatch agotado (ver 3).

## 1. Liquid real (liquidjs 10.30.1) y árbol accesible, EN y ES

- **Markup.** El flag por valor está en `product-card.liquid:212-218` (`swatch_available == false and card_product.available`). `aria-describedby` solo con ese flag, en radio (`:262-264`) y en enlace (`:285-287`). El span se renderiza solo si se usó (`:320-322`), con `hidden`.
- **Render** (`renderx2.js`, con filtros `t` (one/other), `json` y `money`, y fuentes de `git archive dbcfeb1`):

| Caso | Span `SwatchSoldOut` | `aria-describedby` | Badge del precio |
|---|---|---|---|
| Disponible (todos los valores) | no se renderiza | 0 | oculto |
| Agotado completo (`product.available` false) | no se renderiza | 0 | visible, "Sold out" / "Agotado" |
| Parcial, 1 valor agotado (radio y enlace) | `hidden`, "Sold out" / "Agotado" | 1, en ese swatch | oculto |
| Parcial, 2 valores agotados | `hidden` | 2 | oculto |
| Agotado solo el 6.º valor (no se renderiza, límite 4) | no se renderiza | 0 | oculto |

- **Árbol accesible** (CDP `getFullAXTree` y `ariaSnapshot`, `axx2.js`):
  - En el parcial, el radio queda como `Color: S {desc: Sold out}` (ES: `{desc: Agotado}`), y el flujo de lectura ya no contiene texto suelto: "Regular price $240.00".
  - En el enlace, igual: `{desc: Sold out}`.
  - En el agotado completo, los radios no llevan descripción de agotado y el flujo dice "Regular price $240.00 Sold out" una sola vez, por el badge.
  - En filas de 40 y 70 px (`ax6b.js`), el árbol muestra "30 options available" o "6 options available" sin el "Sold out" que antes iba pegado (comparado con REVIEW-LV05-006 §4).

## 2. Regresiones LV-05 (cfe8b4f)

Ejecuté mis suites de las revisiones 005 y 006 con el Liquid y el CSS de dbcfeb1 (el `base.css` es idéntico al de cfe8b4f):
- `r5.js`: letra al 100/125/150 % y zoom al 200 % a 320, 390 y 1280, es decir 12 condiciones con unas 15 rejillas cada una. La salida es **idéntica** a cfe8b4f (`diff` vacío).
- `r5-768.js`: 768 px, también idéntico.
- `ax6.js`: 42 sondas de ancho de fila con el árbol accesible, **idénticas**.
- `data-swatch-fit`: 38/38 coincidencias con el port del autor, ahora con 4 fixtures nuevos de agotado.

No reproduje los "94 casos" del harness del autor (`harness-lv05/run-x2.js`). La cobertura de arriba es mía e independiente.

## 3. Badge en vivo más descripción al elegir un swatch agotado

Lo reproduje cargando el `assets/theme.js` real con una URL base válida: con el foco en el radio marcado, ArrowRight hasta el swatch agotado.
- El lector anuncia el foco: "Color: S, radio, checked, **Sold out**" (la descripción).
- `updatePrice()` (`assets/theme.js:2326-2327`) quita `hidden` al badge dentro de `.price__badges[aria-live="polite"]` (`snippets/price.liquid:102-108`), y la región en vivo añade "**Sold out**".
- Resultado: dos lecturas seguidas de la misma palabra. Medido igual en ES: "Agotado" dos veces.

**¿Es una duplicación molesta?** Sí, pero leve: P3. Son una o dos palabras con prioridad polite (algunos lectores la descartan o la encolan tras el foco) y solo ocurre al elegir un valor agotado. Al volver a un valor disponible el badge se oculta sin anunciarse. No hay pérdida ni contradicción de información.

**Cómo resolverlo.** Recomiendo la opción A:
- **A (recomendada).** Mantener `aria-describedby`, porque es la única vía en el modo enlace (sin JS de selección), cuando se entra con Tab a un radio ya agotado y en el estado inicial. Además, quitar `aria-live` del badge en el contexto de tarjeta: pasar a `render 'price'` un parámetro (por ejemplo `live_badges: false`) desde `product-card.liquid:334` y conservar la región en vivo en la ficha de producto. Es coherente con la tarjeta, donde el cambio de precio tampoco se anuncia en vivo.
- **B.** Quitar `aria-describedby` solo a los radios interactivos y dejarlo en los enlaces. Esto pierde el estado al enfocar con Tab un radio marcado que ya estaba agotado, así que no la recomiendo.

## 4. Theme Check, alcance y credenciales
- Theme Check 4.8.0 (`npx shopify` del worktree `wt-lv05`, con `--path wt-x2`) devuelve `[]` con exit 0 (`review-x2/tc48.json`). `wt-x2` no tiene `node_modules` y `npx` allí resolvió la CLI 5.0.1, que también da 0 issues (`tc.json`). La de referencia es la 4.8.0.
- No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en las líneas añadidas, sin coincidencias.

## 5. Observación aparte (preexistente desde 8a6a3b7, P3)

Los swatches de **color** llevan `title="{{ value.name }}"` además del `aria-label` "Color: Navy". Chromium expone ese `title` como descripción, y el árbol muestra `Color: Navy {desc: Navy}`, así que el lector repite el nombre. En los de texto no pasa, porque el `title` coincide con el contenido. Propuesta: poner `title` solo en los swatches de texto, que son los que se recortan con elipsis, o aceptar la verbosidad. Cuando hay `aria-describedby` agotado, esa descripción sustituye al `title`.
