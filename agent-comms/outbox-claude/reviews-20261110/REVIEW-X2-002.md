# REVIEW-X2-002. Badge de la tarjeta sin región en vivo (`badges_live`)

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `02640138f645b1c94c4c9f355721d776632da751` (task/x2, worktree `wt-x2`). El diff `dbcfeb1..0264013` toca `snippets/price.liquid` (+3/-1) y `snippets/product-card.liquid` (+1/-1). No modifiqué el repo ni hice commit o push, y `git status --short` sale vacío. Mis archivos están en `scratchpad/review-x2-002/`.

## Veredicto

**ACEPTADO.**

En la tarjeta, un swatch agotado se anuncia una sola vez, por su descripción. Las llamadas a `price.liquid` que no pasan el parámetro conservan `aria-live="polite"`. No hay regresiones de layout y Theme Check 4.8.0 da `[]`. Esto cierra la recomendación P3 de REVIEW-X2-001 §3 (opción A).

## Comprobaciones

- **Código.**
  - `snippets/price.liquid:104`: `{% unless badges_live == false %} aria-live="polite"{% endunless %}`. En Liquid, `nil == false` es falso, así que si el parámetro no llega sigue siendo una región en vivo.
  - `snippets/product-card.liquid:334` pasa `badges_live: false`. Es la única llamada que lo hace (busqué `badges_live` en `sections/` y `snippets/`).
- **Liquid real (liquidjs 10.30.1, `price.js`)** renderizando `price.liquid` con cada forma de llamada:

| Llamada | Contenedor de badges |
|---|---|
| main-product y featured-product (sin parámetro, `show_badges: true`) | `aria-live="polite"` |
| curated-showcase (sin parámetro) | `aria-live="polite"` |
| `badges_live: true`, `nil` o `'false'` (cadena) | `aria-live="polite"` |
| product-card (`badges_live: false`) | sin `aria-live` |
| complete-the-look y lookbook (`show_badges: false`) | sin bloque de badges, igual que antes |

La búsqueda, las recomendaciones, recently viewed, 404, article y las colecciones usan `product-card`, así que heredan el comportamiento de la tarjeta. Ni la compra rápida ni el carrito llaman a `price.liquid`: solo existen las llamadas de `sections/{main-product,featured-product,curated-showcase,complete-the-look,lookbook}.liquid` y la de `snippets/product-card.liquid`.

- **Árbol accesible con el `theme.js` real (`axx2b.js`, EN y ES).** Con el foco en el radio marcado, ArrowRight hasta el swatch agotado. El foco se anuncia "Color: S {desc: Sold out}" (ES: "Agotado"). `updatePrice()` muestra el badge, pero ya no tiene ningún ancestro `aria-live`, `role=status` ni `role=alert`, y el árbol de CDP no contiene ningún nodo con la propiedad `live` (`liveax.js`). Resultado: **un solo anuncio**. El badge sigue visible y legible en el modo lectura. En un producto agotado completo, el badge se lee una vez en el flujo, sin descripción en los radios.
- **Regresiones.** `data-swatch-fit` coincide 38/38. La suite `r5.js` (letra al 100/125/150 % y zoom al 200 %, a 320, 390 y 1280) da salida idéntica a dbcfeb1.
- **Theme Check 4.8.0** (`--path wt-x2`) devuelve `[]` con exit 0. No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en las líneas añadidas de `origin/lote-e-claude...0264013`, sin coincidencias.

Sigue abierta la observación P3 de REVIEW-X2-001 §5: el `title` de los swatches de color repite el nombre como descripción. No afecta a este commit.
