# tests-sizes-20261115: PR #10 (card image `sizes`) en tienda real

Fecha 2026-11-15 · tienda sartorial-theme-kvkzl39t · cabeza de PR #10 = `1c111bc9d802a94e1eebf250ebf7ed33ad9de33d` (la primera pasada con 27ee155 quedo sustituida; las medidas "after" son de 1c111bc).
Escritura solo en rc3 no publicados (Sartorial 190317920560, Imprint 190317953328, Archive 190317986096, role UNPUBLISHED verificado por Admin y por `Shopify.theme.role` en cada navegacion). Sin carrito, navegadores en serie, sin bucles 429.

## 1. Subida (themeFilesUpsert, URL raw al SHA)
9 archivos por tema: assets/theme.js, sections/{main-404,main-article,main-collection,main-search,product-recommendations,recently-viewed}.liquid, snippets/{card-sizes,product-card}.liquid. No se tocaron templates/*.json ni config/settings_data.json. userErrors vacios en los 3.
Verificacion por lectura: `checksumMd5` + `size` de la Admin API de los 9 archivos en los 3 temas coinciden con md5/bytes del repo en 1c111bc (los 27 pares). SHA-256 esperado en `00-upload-expected-sha256.txt` (raw.githubusercontent == git show). Limite: Admin no expone SHA-256 y el CDN sirve theme.js minificado (`05-theme-js-sha256.json`, no comparable), asi que la igualdad se demuestra por MD5+tamano, no por SHA-256.

## 2. sizes vs candidato (pxW = ancho real de pixeles del candidato; necesario = caja x DPR)
Datos: `02-after-sizes.json` (390@2, 1280@1, 1280@2), `02-after-sizes-1600.json` (1600@1/@2), `01-before-sizes.json`. Margen minimo = pxW - necesario.
| Preset | Pagina | sizes real (1280 / movil) | caja 390 / 1280 | Veredicto |
|---|---|---|---|---|
| Sartorial, Archive | /collections/all, /permanent-collection (vista 2 por defecto) | `(min-width:1300px) 650px, (min-width:48rem) calc(100vw / 2), calc(100vw / 1)` | 350 / 452 | OK, 0 tarjetas bajo lo necesario (antes 33 y 22 bajo lo necesario a 390) |
| Imprint | idem (vista 4) | `(min-width:1300px) 325px, (min-width:48rem) calc(100vw / 4), calc(100vw / 2)` | 169 / 218 | OK (sin cambio de bytes) |
| los 3 | /search?q=coat | `(min-width:1300px) 434px, (min-width:62rem) calc(100vw / 3), (min-width:48rem) calc(100vw / 2), calc(100vw / 1)` | 350 / 392 | OK (antes 22 bajo lo necesario) |
| los 3 | ficha: recomendaciones + vistos recientemente | `(min-width:1300px) 325px, (min-width:62rem) calc(100vw / 4), (min-width:48rem) calc(100vw / 3), calc(100vw / 2)` | 167 / 298 | OK, margen minimo 22 px |
Candidato < necesario: 0 en 390@2, 1280@1, 1280@2. A 1600@2, 2 tarjetas (sartorial y archive, /collections/all): el placeholder `fixture-triangle.jpg` (producto sin imagen) tiene srcset hasta 960 px y la caja pide 964 (faltan 4 px, imperceptible, no es una tarjeta de producto real).

## 3. Conmutador de rejilla (`03-grid-views.json`, 168 filas)
Vistas 2, 4, lista a 390, 800 y 1280 (DPR 2, 2, 1, 2), en /collections/all y /permanent-collection, en 3 presets: clic, recarga con la vista guardada en localStorage y pagina 2 (solo /collections/all pagina). Resultado: cada tarjeta lleva el `sizes` de la vista activa (data-sizes-2/-4/-list del ul): 0 discrepancias; 0 tarjetas con candidato < caja x DPR (margen minimo 32 px); 0 desbordes horizontales; botones aria-pressed coherentes con la vista. Con la pagina 2 guardada en lista: n=28 (sartorial/archive) y 7 (imprint), 0 discrepancias.

## 4. Capturas (scratchpad, sin commitear)
Revisadas Sartorial /collections/all a 390 y 1280@2, Imprint /collections/all 390, Archive vistos recientemente 390: fotos nitidas, sin saltos de layout ni desbordes (Sartorial a 390 es una columna a ancho completo por defecto, como antes).

## 5. Regresion harness (`04-harness-read-only.json`)
run.mjs intacto (SHA-256 103c1551...4292f), `--read-only --store=sartorial-theme-kvkzl39t...` sobre los 3 presets: scope completed_with_limits, 132 checks; el conjunto de resultados por preset/check es identico al de tests-rc3-20261114/14-01-ro-regression.json (axe y teclado sin cambios, sin fallos).

## 6. Coste de peso de imagenes, /collections/all a 390@2 (KB transferidos, scroll completo)
| Preset | Antes (rc3 sin cambio) | Despues | Delta |
|---|---|---|---|
| Sartorial | 868 | 2261 | +1393 (x2,6) |
| Archive | 868 | 2261 | +1393 |
| Imprint | 579 | 579 | 0 |
Causa: en vista 2 el movil pasa de 1 columna servida con 50vw (candidato 480) a calc(100vw / 1) (candidato 800 para caja 350 x DPR 2). Es el coste de eliminar la imagen borrosa; el mayor salto es 2,6x en bajada de colecciones largas en DPR 2. A 1280@2: 1444 a 5552 KB (sartorial/archive, 960 vs 480 px). Nota: la linea base de Archive 1280@2 en collection/search/pdp quedo sin medir (run cortado por mi timeout); las otras 33 de 36 combinaciones si.

## Archivos
scripts/{common,measure-sizes,grid-views,theme-js-sha}.mjs, 01-before, 02-after (+1600, +logs), 03-grid-views, 04-harness-read-only, 05-theme-js-sha256, 00-upload-expected-sha256.txt.
