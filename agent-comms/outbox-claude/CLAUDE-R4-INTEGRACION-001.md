# CLAUDE-R4-INTEGRACION-001: integración de la ronda R4 y cierre de defectos

Fecha: 2026-11-25. Rama `claude/clever-gauss-ddhyr2`. Base: fusión de `origin/gpt/r4-ficha-demo` (`7091958`) sin conflictos (`51281d3`), más el commit de correcciones `233e683`.

## Hecho

| Punto | Cambio | Verificación |
|---|---|---|
| Barra fija R4A-7 | El fixture usa `<product-gallery>` de 3000 px dentro de `.product-main__layout`; el test comprueba columna no sticky (`data-sticky-fits` ausente, `position: static`) y barra de compra visible solo tras bajar (`tests/r4-product-layout.spec.mjs:115`) | Con `theme.js` y `base.css` de `master` fallan los 3 tests R4A-7 (columna `sticky`); con los actuales pasan |
| Ledger filas 39, 85, 130 | Rehechas desde el texto de `master`; se conserva evidencia y pendientes previos y se añade la de R4 con localizadores del código integrado (`assets/theme.js:1583-1599`, reordenado `:1590-1598`, `moveMediaToStart` `:330-351`). También se corrigen citas obsoletas de la fila 85 (`pauseMedia` `assets/theme.js:144-154`; carga 3D `layout/theme.liquid:31-37,151-180`) | `npm run gates:ledger`: 0 incoherencias |
| Desplazamiento al medio seleccionado | `assets/theme.js:748`: solo desplaza si la parte superior no es visible | Nuevo test `tests/r4-product-layout.spec.mjs:92` (imagen de 1400 px con la parte superior visible): falla sin el cambio, pasa con él; el caso que sí debe desplazar (`:62`) sigue pasando |
| Nombres de fixtures | Ver lista más abajo | Los planes regenerados y `tests/r4-catalog-runs.spec.mjs` pasan |
| Artículo de tallas | Remite a la guía de tallas de cada ficha y a medir una prenda similar | Plan regenerado |
| Overlay archive | Promo del encabezado: «Restored pieces» + subtítulo propio; README y test alineados (`tests/r4-demo-overlays.spec.mjs`, caso nuevo) | Test |
| Texto de planificador y zoom | `catalog-r4.mjs` ya no afirma idempotencia; comentario junto a `refreshZoomLabels` (`assets/theme.js:760-762`) | Revisión |

Los seis planes de `docs/demo-store/plans/` se regeneraron con `buildPlan` (sin la CLI de escritura); antes de editar, la regeneración desde el árbol limpio reproducía los archivos guardados, y solo cambian los textos modificados.

## Verificación

`npm run gates:static` pasa (JSON, hooks, sanity, locales, ledger, Theme Check 111 archivos sin ofensas, sintaxis, empaquetado). `npx playwright test --trace off` con todos los specs salvo `tests/pdp-line-total.spec.mjs`: 94 pasan, dos pasadas. No se ha probado en tienda real ni en móvil real (compuerta 5 pendiente).

## ZIP

`node scripts/package-theme-zip.mjs --out Sartorial-1.0.0.zip --expect-count 111` desde `233e683`: 111 archivos, 334049 bytes, sha256 `22510df7aae7cc9397e7d1e89a808b83df9ae7a230d3c02b3363fa3e293c1041`, huella de contenido `a83f1ea17b1d1ee6d04eb57c6bc64d842188c5ad40421b8c13589d5fbaf8729c`, zlib 1.3.1-e00f703 (node 22.23.5). `unzip -t` sin errores, `node --check` correcto en los tres JS extraídos, referencias internas: ninguna. Manifiesto en `docs/demo-store/ZIP-FINAL-MANIFEST-1.0.0.txt`. Validado en tienda: NO.

Frente a la ZIP de GPT (`c3b46161…`) cambia un solo archivo: `assets/theme.js`. El sha256 global difiere además por la versión de zlib (1.3.2.1 en la de GPT); la huella de contenido es la comparable.

## Copy pendiente de aprobación

De la revisión (`agent-comms/reviews/CLAUDE-review-GPT-R4-001.md`, §H): las claves de locales (`blogs.blog.page_out_of_range`, `not_found.recommendations`, `predictive_search.no_results`), los textos de cabeceras de los tres presets, `listings/imprint/templates/index.json`, `listings/archive/templates/index.json` y `collection.json`, vendors, descripciones de producto, títulos y cuerpo del blog, tarjeta regalo y autor del blog (`proyect-shopi`, D35, que además lleva una errata).

Nuevo en esta ronda:

- Fixtures: «Sculptural Ceramic Vase» (`fixture-media-3d-video`), «Wool Field Jacket» (`fixture-many-variants`), «Fringed Wool Scarf» (`fixture-focal-point`), «Woven Leather Belt» (`fixture-color-only`), «Cotton Twill Overshirt» (`fixture-long-swatches`).
- Cuerpo del artículo de tallas: «Lay a similar piece flat and compare its shoulder, chest and length with the size guide on each product page. Measure a similar piece you already own and choose the closest match.»
- Promo del encabezado de Archive (solo overlay de la demo): «Restored pieces» / «Pieces from the archive, gathered in one place.» Los listings siguen con «Selected pieces».
