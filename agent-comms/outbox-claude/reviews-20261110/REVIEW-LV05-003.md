# REVIEW-LV05-003. Tercera revisión de LV-05 (CN-1 y CN-2)

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `8a6a3b79cf64afc2fa56845867a42ce0694ee700` (task/lv05, worktree `wt-lv05`). Diff revisado: `239ab06..8a6a3b7`, que toca `assets/base.css`, `snippets/product-card.liquid` y `docs/requirements-ledger.md`. Diff total desde `lote-e-claude`: los mismos 3 archivos.
No modifiqué el repo ni hice commit o push. `git status --short` sale vacío.

## Veredicto

**ACEPTADO CON CONDICIONES.**

CN-1 queda resuelta para nombres largos: a 320 px se pasa de leer 1-2 caracteres a leer 11-12, y el `title` lleva el nombre completo. CN-2 también: el ledger es coherente y `ledger-verify` no da incoherencias. No hay scroll horizontal, solapes ni desalineación de títulos, el "+N" es accesible y cuenta bien, y el orden de foco es correcto. Theme Check da `[]`.

La condición nueva es una regresión. La reducción a 1 o 2 piezas se aplica a todo el grupo marcado `--text`, aunque los nombres sean cortos y quepan. Afecta al caso más común de las tallas, y a los grupos de color en los que un solo valor no tiene swatch.

Condiciones:
1. **CN-3 (P2, regresión).** La reducción a 1 o 2 piezas no debe afectar a filas que caben enteras. Ejemplo: XS/S/M/XL en g4 a 1280 (fila de 310 px) muestran 2 tallas y "+2", cuando 239ab06 mostraba las 4. Hoy la regla depende solo de `product-card__swatch-group--text` (`snippets/product-card.liquid:188`, `assets/base.css:2061-2081`) y no de si hay piezas `--text-min`. Una opción es marcar el grupo solo cuando algún valor visible tiene más de 5 caracteres, y con eso se arreglan también los grupos de color mixtos. Una alternativa es calcular los umbrales a partir del ancho real.
2. **CN-4 (P3, coherencia).** El comentario de `assets/base.css:2053` dice "unos 8 caracteres visibles", mientras que el commit y el ledger dicen 6. Lo medido como mínimo es 6, con nombres como "Charcoal Grey Marl" o "WWWW…". Hay que unificar el texto.
3. Sigue vigente: D-03 y la fila del ledger necesitan evidencia de R-Demo en la tienda real.

## 1. Lo que el autor afirma, comprobado

- **title.** Está en `snippets/product-card.liquid:258` (radio) y `:281` (enlace), con `value.name | escape`, y el `aria-label` se mantiene en `:257` y `:280`. En el árbol de accesibilidad de Chromium (CDP), el radio tiene el nombre "Size: Midnight Navy Heather" y la descripción `null`: el `title` no añade una lectura redundante. Limitación conocida: el `title` no aparece con teclado ni en táctil, pero ahora el texto visible ya es legible, así que lo acepto.
- **Ancho mínimo.** `--card-swatch-text-min: 4.75rem`, es decir 76 px (`assets/base.css:2003`, `:2127-2136`). Solo se aplica a nombres de más de 5 caracteres (`product-card.liquid:226-234`).
- **1, 2 o 4 piezas.** Con fila < 196 px se muestra 1 swatch más la píldora `--text`. Entre 196 y 270 px, 2 más `--narrow`. Entre 270 y 348 px, 2 más `--narrow`. Desde 348 px, 4 más `--wide` (`base.css:2057-2081`). La píldora nueva está en `product-card.liquid:293-303`.
- **Ledger.** `docs/requirements-ledger.md` tiene 2 filas nuevas, LV05-NF01 (`código completo`) y LV05-V01 (`ausente`), y un encabezado de 63 filas. `node scripts/ledger-verify.mjs` (sin `--fix`) devuelve "Incoherencias: 0" con exit 0. Los IDs nuevos no chocan con el NF-01 de BOARD.md.

## 2. Prueba propia con Playwright

Arnés: `scratchpad/review-lv05-003/r3.js`, escrito por mí, que reproduce el markup de 8a6a3b7: clases de slot, `title`, grupo `--text` y las tres píldoras. Lo ejecuté con el CSS y el markup de 8a6a3b7 (`v3.*`) y con los de 239ab06 (`v2.*`) para comparar. Las capturas están en `v3-{g4-long30,g4-sizes4,g4-mixed}-{320,390,768,1280}.png`.

Casos: nombres largos con 30 valores (radio y enlace), 2 y 1 valores largos, una palabra gigante, WWWW/MMMM de 20 caracteres, tallas XS/S/M/XL con 4, 6 y 103 valores, grupo mixto de colores con un valor sin swatch, y vendor mezclado. Rejillas: g4, g2, lista, recs, recently viewed, search, 404, article, bento y curated.

### Legibilidad (caracteres visibles / total), g4

| Ancho | 239ab06 | 8a6a3b7 |
|---|---|---|
| 320 (fila 148 px) | 2 swatches, 1-2/21 | 1 swatch, 11-12/21, + "+29" |
| 390 (fila 183) | 2, 4-5/21 | 1, 16-18/21, + "+29" |
| 768 (fila 182) | 2, 4-5/21 | 1, 16-18/21 |
| 1280 (fila 310) | 4, 3-5/21 | 2, 15-16/23, + "+28" |

Mínimos observados en 8a6a3b7: 6/18 y 6/20, en g2 o search con 4 piezas en una fila de unos 368 px. En bento a 320 px (fila de 128 px, fuera del alcance) se leen 7/21.

### "+N"
- Hay una sola píldora visible por tarjeta en todos los casos, y su número coincide siempre con los valores totales menos los swatches visibles. (La única incoherencia del log, `g4-long2 c2`, viene de un fixture mal hecho en mi arnés: 4 valores con total 1.)
- El nombre accesible es `aria-label` "+N more" (`products.product.more_swatches`, también en ES) y el texto visible lleva `aria-hidden`. Mide 44×44 y no rompe la fila: 0 solapes, 0 overflow, alto de 44.

### Foco
Tab en g4-long30 a 320: radio "Size: Midnight Navy Heather", "+29 more", el título y la siguiente tarjeta. A 1280: el radio, "+28 more" y el título. Hay un único tab stop por radiogroup, que `refreshTabStop` (`assets/theme.js:2087-2092`) mantiene con ResizeObserver, y los elementos ocultos no reciben foco. El `:focus-visible` está activo en todos los pasos.

### Scroll, alineación y regresiones
- `scrollWidth` es igual al viewport a 320, 390, 768 y 1280. No hay ítems fuera de la tarjeta ni objetivos de menos de 44 px.
- El desfase entre títulos es 0 en todas las rejillas del alcance y anchos. vendorMix sigue en 23,9 px (LV05-V01) y bento en 25 px a 1280, que está excluido a propósito, igual que antes.
- LV05-NF01: no hay etiquetas fuera del botón, solapes ni filas de dos líneas.
- **Regresión CN-3**, comparando 239ab06 con 8a6a3b7:
  - Tallas XS/S/M/XL en g4: a 320 se pasa de "XS S +2" a "XS +3", y a 1280 de las 4 tallas a "XS S +2" (captura `v3-g4-sizes4-1280.png`, con espacio de sobra).
  - Grupo mixto (3 colores y 1 valor sin swatch) en g4: a 320 se pasa de 2 colores a 1 color y "+5", y a 1280 de 4 piezas a 2 colores y "+4". También en article a 320.

## 3. ¿2 swatches de texto y "+N" a 1280 es razonable?

Con nombres largos sí, y es mejor que lo anterior: 4 piezas con 3-5 caracteres no dejaban identificar ningún valor, y 2 piezas con 15-16 caracteres sí. Aun así, la fila de 310 px admite 3 piezas de 76 px más la píldora (3×76+44 = 272), y el esquema salta de 2 a 4 sin un nivel de 3. Es una mejora opcional, no la exijo. Con nombres cortos no es razonable, porque caben las 4 (CN-3).

## 4. Theme Check, alcance y credenciales
- `npx shopify version` devuelve 4.8.0, y `npx shopify theme check --output json` devuelve `[]` con exit 0 (`review-lv05-003/tc.json`).
- Los archivos tocados son los 3 declarados. No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en las líneas añadidas, sin coincidencias.
