# REVIEW-LV05-002. Re-revisión independiente de LV-05 v2 + NF-01

Fecha: 2026-11-10. Revisor: Claude (subagente, solo lectura).
Commit: `239ab06f85a78665f44e22e597116c268b044064`, rama local `task/lv05`, worktree `wt-lv05`. Diffs revisados: `605459c..239ab06` y `lote-e-claude..239ab06`.
No modifiqué el repo ni hice commit o push. Mis archivos están en `scratchpad/review-lv05-002/`.

## Veredicto

**ACEPTADO CON CONDICIONES.**

C1 y NF-01 quedan resueltos. No hay scroll horizontal en ningún ancho ni caso probado, el nombre accesible completo existe en el markup real y Theme Check da `[]`. La condición nueva es visual: a 320 y 390 px la elipsis deja los swatches de texto largos casi ilegibles ("Mi…", "O…"), y no hay tooltip ni otra vía visual al nombre completo.

Condiciones:
1. **CN-1 (P2, visual).** Hay que dar a los usuarios videntes, de ratón y de teclado, una forma de ver el nombre completo de un swatch de texto recortado. Las opciones son mostrar el valor seleccionado en texto, un tooltip visible en hover y focus, o renderizar menos swatches de texto en tarjetas estrechas. Un `title` solo sirve de parche, porque no aparece con el teclado ni en móvil. Los lectores de pantalla no se ven afectados (ver 2).
2. **CN-2 (registro).** Hay que registrar en el ledger NF-01 como corregido en 239ab06 y el desfase con vendor mezclado (unos 24 px) como pendiente. Hoy solo está en el comentario `assets/base.css:2057-2058`, y este commit no toca ningún ledger. Las menciones "NF-01" de `agent-comms/BOARD.md` y otros archivos parecen pertenecer a una numeración anterior: conviene usar un ID que no choque.
3. Sigue vigente (plan v4.1): D-03 no se cierra con un arnés local y necesita evidencia de R-Demo en la tienda real.

## 1. Condiciones de REVIEW-LV05-001

- **C1, resuelta.** `assets/base.css:2062` excluye `[data-grid-columns='2']` y `.search-results-grid` de la regla base, y `assets/base.css:2074-2081` las vuelve a añadir dentro de `@media (min-width: 48rem)`. Ese breakpoint coincide con el paso a 2 columnas de `base.css:5184/5200` (product-grid 2) y de `base.css:6716/6745` (search). Medido en el `::before` de una tarjeta sin swatches: g2 y search a 320, 390 y 767 dan `content:none` con 1 columna, y a 768 dan `44px` con 2 columnas. g4, recs, rv, 404 y article siguen en 44 px desde 320 (2 columnas). El comentario `base.css:2052-2058` ya describe bien el alcance.
- **C2, resuelta en código y pendiente en el registro (CN-2).** `.card-swatch.card-swatch--text` (`base.css:2086`, especificidad 0,2,0) gana sobre `.card-swatch` (`base.css:2126-2129`, 0,1,0). En mi arnés, con el CSS de `lote-e-claude`, las etiquetas se salen del botón en todos los casos de texto ("label escapes button"). Con 239ab06 no se sale ninguna. La fila mide 44 px en todos los casos (`base.css:2009`) y la reserva usa la misma variable (`base.css:1920`, `:2071`, `:2079`), así que ahora coinciden por diseño.
- **C3, documentada en el comentario.** El desfase persiste: 23,9 px en vendorMix a 320, 390, 768 y 1280.

## 2. Elipsis, nombre accesible, foco y tooltip

- **aria-label en el markup real.** El modo interactivo (radio) está en `snippets/product-card.liquid:234` y el modo enlace en `snippets/product-card.liquid:256`, ambos `aria-label="{{ 'products.product.color_swatch' | t: option: swatch_option.name, value: value.name }}"`. La clave está en `locales/en.default.json:403` y `locales/es.json:403` (`"{{ option }}: {{ value }}"`), y usa el nombre completo del valor. La etiqueta visible lleva `aria-hidden="true"` (`product-card.liquid:215`), así que el lector de pantalla lee solo el nombre completo. El `ariaSnapshot` de Playwright muestra `radio "Size: Midnight Navy Heather Organic Loopback"` con el texto completo en los cuatro anchos.
- **Foco visible.** Con Tab y flechas, el elemento enfocado cumple `:focus-visible`, con un outline de 2px sólido en el color de primer plano y offset de 3px (`base.css:2117-2120`). Las capturas `after-focus-{320,390,768,1280}.png` muestran que el anillo no se recorta.
- **Tooltip: no hay.** El atributo `title` es `null`, y ni `product-card.liquid` ni `theme.js` crean una. Las capturas `after-textMax-320.png` y `-390.png` muestran que los valores largos se quedan en 2 o 3 caracteres ("Mi…", "O…"). Un usuario vidente no puede saber qué opción elige, porque la información solo existe para el lector de pantalla. Esa es CN-1. Los valores cortos (XS, S, M, XL) no se recortan.
- 2.5.3 Label in Name: el texto visible recortado es un prefijo del valor contenido en el nombre accesible, así que es aceptable.

## 3. nowrap y scroll horizontal

- El límite de swatches no es un setting: está fijo en `snippets/product-card.liquid:44` (`swatch_limit = 4`). Por debajo de 270 px de contenedor se ven 2 swatches y la píldora (`base.css:2032-2048`). En `config/settings_schema.json` no hay ningún límite de swatches. Probé 30 y 103 valores, lo que da píldoras +28/+26 y +101/+99, con 3 dígitos.
- `documentElement.scrollWidth` es igual a `innerWidth` a 320, 390, 768 y 1280, con 15 rejillas y todos los casos. No hay scroll horizontal.
- Ningún swatch ni píldora se sale de la tarjeta ni del viewport, no hay overflow de fila y todos los objetivos miden 44 px o más (los botones de texto, entre 44 y 336 px) en todas las rejillas del alcance.
- Una sola excepción, fuera del alcance y ya presente antes: en **bento** a 320, mi stub da una fila de 128 px y la píldora se monta 4 px sobre el segundo swatch. Con `lote-e-claude` el mismo caso ya se solapaba, saltaba a una segunda línea (88 px) y desbordaba 130>128. No genera scroll. Conviene confirmarlo con el markup real de bento.

## 4. Prueba propia con Playwright

Arnés: `scratchpad/review-lv05-002/r2.js`, escrito por mí. Usa Chromium de `/opt/pw-browsers` y el CSS extraído con `git show` de 239ab06 (`after.css`) y de `lote-e-claude` (`base0.css`). Las salidas están en `after.json`, `base0.json` y las capturas `after-*.png`, más las sondas `probe.js` y `probe2.js`.

Casos: texto largo con 30 valores en modo radio y en modo enlace, una palabra gigante sin espacios, "WWWW…"/"MMMM…", 103 valores con píldora de 3 dígitos, solo color, vendor mezclado, sin swatches y valores cortos XS/S/M/XL. Rejillas: product-grid 4, 2 y lista, recs, recently viewed, search, 404, article, bento y curated. Anchos: 320, 390, 768 y 1280.

Desfase máximo entre títulos de una misma fila (px), con 239ab06:

| Rejilla / caso | 320 | 390 | 768 | 1280 |
|---|---|---|---|---|
| g4 textMax, giant, shortMax, color, none | 0 | 0 | 0 | 0 |
| g4 vendorMix | 23,9 | 23,9 | 23,9 | 23,9 |
| g2, search, recs, rv, 404, article | 0 | 0 | 0 | 0 |
| lista, curated | 0 | 0 | 0 | 0 |
| bento (excluido a propósito) | 0 | 0 | 0 | 25 |

Con `lote-e-claude` la mayoría de esas filas daban 50 px.

## 5. Theme Check, alcance y credenciales

- `npx shopify version` devuelve 4.8.0, y `npx shopify theme check --output json` devuelve `[]` con exit 0 (`review-lv05-002/tc.json`).
- `git diff --name-only lote-e-claude..239ab06` devuelve solo `assets/base.css`, y `605459c..239ab06` también: +42/-13.
- No hay credenciales: busqué token, secret, password, api key, shpat_, shpss_, bearer y URLs en el diff total, sin coincidencias.
- `git status --short` en el worktree sale vacío.
