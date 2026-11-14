# REVIEW-LV05-005. Quinta revisión de LV-05 (CN-5: letra grande y zoom)

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `cd4461c75d05a93be570e6e772000cde5234a70d` (task/lv05, worktree `wt-lv05`). El diff de la rama desde su merge-base con `lote-e-claude` toca `assets/base.css`, `docs/requirements-ledger.md`, `snippets/card-swatch-fit.liquid` y `snippets/product-card.liquid`.
No modifiqué el repo ni hice commit o push, y `git status --short` sale vacío. Mis archivos están en `scratchpad/review-lv05-005/`. Reutilicé liquidjs 10.30.1 de `review-lv05-004/lj/`.

## Veredicto

**ACEPTADO CON CONDICIONES.**

CN-5 queda cerrada. Con la letra al 125 % y al 150 % y con zoom al 200 %, ya no hay solapes, desbordes de fila ni objetivos de menos de 44 px en ninguna rejilla. Los swatches no añaden scroll horizontal en ningún caso, y quitan el que añadían en 239ab06 a zoom 200 %. El Liquid real coincide con la estimación en los 30 casos. LV-05, LV05-NF01, CN-1 y CN-3 se mantienen. Theme Check da `[]` y no hay credenciales.

Condiciones:
1. **CN-6 (P2, información perdida).** La comprobación pedida falla: con una fila de menos de 88 px no queda ningún "+N" ni para la vista ni para el lector de pantalla. Por debajo de 88 px (`assets/base.css:2178-2189`) se ve un solo swatch y ningún contador, y por debajo de 44 px (`base.css:2192-2196`) desaparece todo el grupo, también el radiogroup. Esto pasa en la rejilla de 2 columnas con zoom al 200 % en móviles de 320 y 390 px (filas de 68 y 86 px), justo el caso de los usuarios con baja visión. Medido en el árbol de accesibilidad: a 320 px con zoom 200 hay 6 contadores en toda la página, frente a 41 a 100 %, y en todas las tarjetas g4 aparece "(no pill, N hidden)". Propuesta: entre 44 y 88 px, mostrar solo el contador con el total ("+N", 44 px), en lugar de un swatch sin contador. Por debajo de 44 px, dejar un texto `visually-hidden` del tipo "N colores", o el contador en su lugar.
2. **CN-7 (P3, filas de color).** Las bandas escalan con rem, pero un swatch de color mide 44 px fijos. Con la letra al 125 % y al 150 % a 320 y 390 px, las filas de color pasan de mostrar 2 a mostrar 1 con "+N", aunque en 239ab06 cabían 2 sin ningún problema (filas de 139 a 179 px). Las tallas cortas también pierden piezas a 150 % y 390 px (1 en vez de 2). Es conservador y no rompe nada, pero empeora las filas de color frente a 239ab06. Propuesta: bandas en px para las filas solo de color, o que la estimación de color no escale con rem.
3. Sigue vigente: falta la evidencia de R-Demo en la tienda real.

## 1. Liquid real frente a la estimación

`render5.js` renderiza el `product-card.liquid` completo de cd4461c, más `card-swatch-fit.liquid`, sacados con `git archive`. Hay 15 fixtures, cada uno en modo radio y en modo enlace: los de la revisión 004 más color4, color2 y color30.

Resultado (`v5-fit-compare.json`): **30/30 coincidencias** con la función del harness del autor, que ahora también se aplica a las filas de color. Ejemplos: color5 y color30 → `a1 b2 c3 d4 e4 f4 g4 h4`; color2 → `a2…h2`; tallas 4 → `a1 b2 c4 d4…`. El atributo se escribe siempre (`product-card.liquid:184`), las clases `--n2..n4` ya no dependen del tipo de fila, y las píldoras `--k1..k4` llevan `aria-label` (`:288-299`).

## 2. Playwright: letra 100/125/150 % y zoom 200 %

Arnés: `r5.js`. La letra del navegador se cambia con CDP `Page.setFontSizes` (16, 20 y 24 px; la raíz medida da 16, 20 y 24 px y afecta también a las media queries). El zoom al 200 % se simula con `deviceScaleFactor: 2` y el viewport a la mitad. Anchos: 320, 390 y 1280. Comparo 239ab06 (`v2-*`) con cd4461c (`v5-*`), las dos con su Liquid real y su CSS real. Logs: `v5-r5.log` y `v2-r5.log`. Capturas: `v5-{cond}-{w}.png`.

Incidencias en las rejillas del alcance (solapes, desbordes de fila o tarjeta, objetivos de menos de 44 px):

| Condición | 239ab06 | cd4461c |
|---|---|---|
| 100 % (320/390/1280) | bento: solape de 4 px a 320 | 0 |
| 125 % a 320 | Mixed short con objetivo de 41 px; bento con solape de 37 px | 0 |
| 150 % a 320 | solapes de 1 a 70 px y objetivos de 36 px en g4-b, 404, art, bento y curated | 0 |
| 150 % a 1280 | objetivo de 40 px (Mixed long) | 0 |
| Zoom 200 %, 320 y 390 | solapes de 7 a 64 px, desbordes de 20 px, objetivos de 24 px y scroll causado por los swatches | 0 dentro de g4, g2, lista, recs, rv, search, 404 y article |

- **Filas de color frente a 239ab06.** A 100 % mejoran o se quedan igual: en lista a 320 se ven 4 piezas en vez de 2 más "+2", y a 390 3 más "+27" en vez de 2 más "+28". A 125 y 150 % en 320 y 390 empeoran de 2 a 1 (CN-7). Con zoom 200 % se pasa de 2 colores solapados (objetivos de 24 px) a 1 color sin contador (CN-6).
- **"+N".** Cuando se ve, siempre coincide con los ocultos y lleva `aria-label` "+N more". Con 0 swatches visibles no hay contador (CN-6).
- **Títulos.** Desfase 0 en el alcance en todas las condiciones, salvo zoom 200 % a 320 (g4-a 13 px, g4-b 13 y art 15,5). Ese desfase sale idéntico en 239ab06. Lo produce la altura del bloque de media de mi fixture (73 frente a 85 px con tarjetas de 58 px de ancho), no los swatches.
- **NF-01, CN-1 y CN-3.** No hay solapes. El `title` y el `aria-label` se mantienen. A 1280 al 100 % las tallas cortas siguen mostrando 4 sin "+N", y los nombres largos 3 piezas legibles con "+27".

## 3. Hallazgo aparte: scroll horizontal no causado por los swatches (LV05-R01, preexistente)

`reflow.js` mide `scrollWidth` en cuatro variantes: la página completa, sin swatches, sin bento ni curated, y sin ninguna de las dos cosas.

| Condición | 239ab06 completa | 239ab06 sin swatches | cd4461c completa | cd4461c sin swatches | sin bento ni curated (ambas) |
|---|---|---|---|---|---|
| Letra 150 %, 320 | 332/320 | 332 | 332/320 | 332 | 320 |
| Zoom 200 %, 320 (160 CSS px) | 247/160 | 237 | 237/160 | 237 | 160 (cd4461c); 166 en 239ab06 por swatches de g4 y recs |
| Zoom 200 %, 390 (195 CSS px) | 247/195 | 237 | 237/195 | 237 | 195 |
| Zoom 400 % en 1280 (320 CSS px, el caso de 1.4.10) | 320 | 320 | 320 | 320 | 320 |

- La afirmación del autor se confirma: ese scroll ya existía antes y viene de los contenedores bento y curated (título y precio sobresalen 12-48 px). Las rejillas del alcance hacen reflow sin scroll, y cd4461c elimina el scroll extra que causaban los swatches en 239ab06 (166 frente a 160).
- **Severidad: P3.** El criterio WCAG 1.4.10 Reflow se mide a 320 CSS px (1280 con zoom al 400 %), y ahí pasa sin scroll. Los fallos aparecen a 160 y 195 CSS px, que quedan por debajo de lo que exige el criterio, y con la letra al 150 % a 320 px, que corresponde más a 1.4.4 Resize Text, con 12 px de desborde en bento. Es mejora de robustez, no un incumplimiento AA demostrado.
- **Limitación:** en mi arnés, bento y curated son aproximaciones (`.bento-discovery__grid` con `.bento-discovery__item`, y `.curated-showcase__supporting`). Las secciones reales (`sections/bento-discovery.liquid:31-120`, `sections/curated-showcase.liquid`) tienen otra estructura (`bento-card`, paneles y spotlight). Hay que confirmar LV05-R01 con el markup real de esas secciones antes de priorizarlo. Debería registrarse en el ledger como hallazgo separado de LV-05.

## 4. Theme Check, alcance, ledger y credenciales
- `npx shopify version` devuelve 4.8.0, y `npx shopify theme check --output json` devuelve `[]` con exit 0 (`review-lv05-005/tc.json`).
- `node scripts/ledger-verify.mjs` (sin `--fix`) da 63 filas e "Incoherencias: 0".
- No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en las líneas añadidas de `lote-e-claude...cd4461c`, sin coincidencias.
