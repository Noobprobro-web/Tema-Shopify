ID: CLAUDE-VISUAL-VERIFY-IMAGES-001
Estado: entregado (solo lectura; sin cambios en tienda ni en temas)
Base: origin/master 37bdbc0. Temas no publicados rc3 (Shopify.theme.id y role=unpublished verificados): Sartorial 190317920560, Imprint 190317953328, Archive 190317986096.
Metodo: Playwright/Chromium en serie, 390 px (DPR 2) y 1280 px (DPR 1). Lighthouse 13.6.0 movil, mediana de 3, 4 categorias (copia ampliada del script del repo, fuera del repo). Mediciones aproximadas desde contenedor. Capturas no subidas.

## Verificacion visual (29 imagenes nuevas)

| Comprobacion | Imprint | Archive | Sartorial (silk-twill-square) |
| --- | --- | --- | --- |
| Recorte 4:5 en galeria (390/1280), 9 fichas | OK, sin cortes de cabeza ni de producto | OK | OK (2 imagenes) |
| Imagen estirada / huecos | no (caja 350x438 y 382x478 = 4:5) | no | no |
| Carrusel movil 2-4 imagenes | OK: 1/4 -> 4/4 avanzan, contador correcto | OK | apilado, sin carrusel |
| Zoom (1280) | OK, 1280x1600 contain | OK | no probado |
| Hover 2.ª imagen en tarjeta | desactivado por preset (collection.json:25 show_secondary_image false) | OK, se ve la 2.ª | n/a |
| img sin alt o alt vacio en DOM | 0 | 0 | 0 |
| width/height en todas las img (CLS) | si (1640x2050), CLS 0 | si | si |
| Primera imagen de ficha | eager + fetchpriority=high | eager + high | eager + high |
| Resto de la galeria | lazy | lazy | lazy |
| Tarjeta con 2 imagenes: 2.ª rota | no, 2.ª carga bien | no | no |
| Scroll horizontal | no | no | no |

Formato servido: WebP via CDN (srcset 320-1200 en tarjetas; galeria 480/800/1600 segun sizes).

## Desvios (sin corregir)

| # | Sev. | Desvio | Archivo:linea probable |
| --- | --- | --- | --- |
| 1 | Media | Tarjetas nitidas solo a medias en cuadricula de 1 columna movil (Archive y Sartorial, default_grid_columns=2): caja 350 px CSS a DPR 2 necesita ~700 px, se sirve width=480 (upscale ~1,46x). En escritorio 2 columnas (caja 452 px) se sirve width=320 (upscale ~1,4x). `sizes` fijo '(min-width: 990px) 25vw, 50vw' no sigue el ajuste de columnas | snippets/product-card.liquid:30 (card_sizes); columnas en sections/main-collection.liquid:6 y listings/*/templates/collection.json:24 |
| 2 | Baja | 1994-cashmere-cocoon-coat 2.ª imagen (`-2-double-face.jpg`, v=1794762120) se sirve como image/jpeg, no WebP: 150 KB a 800 px frente a 60-115 KB de sus hermanas WebP. Probable archivo con perfil/formato que el CDN no recomprime. Tambien cashmere-scarf-1 (antiguo) en jpeg | contenido de Files/media, no del tema; revisar el JPG subido (GPT) |
| 3 | Baja | Sartorial silk-twill-square: variante por defecto "Rust" pero la imagen 1 (nueva, pos. 1) es navy; la imagen de la variante Rust es la 2 | datos de producto (featured_media de variante), no del tema |
| 4 | Baja | Sin miniaturas en los presets verificados (carrusel con flechas y contador); no es fallo, solo constatar | sections/main-product.liquid:130-150 |
| 5 | Info | Imprint: hueco vertical grande bajo la imagen de tarjeta (reserva de fila de variantes/swatches) en 390 px; preexistente, no ligado a las imagenes nuevas | snippets/product-card.liquid (bloque swatches) |

## Lighthouse movil (mediana de 3; antes = lighthouse-20261114, despues = esta ejecucion)

| Preset / pagina | Perf antes -> despues | LCP ms antes -> despues | TBT ms | CLS | A11y / BP / SEO (despues) |
| --- | --- | --- | --- | --- | --- |
| Imprint ficha leather-desk-mat (antes: serra-coat) | 85 -> 80 | 1694 -> 3061 | 519 -> 344 | 0 | 97 / 96 / 100 |
| Imprint coleccion all (antes: permanent-collection) | 85 -> 75 | 1354 -> 2484 | 527 -> 870 | 0 | 97 / 96 / 92 |
| Imprint coleccion permanent-collection (control) | 85 -> 85 | 1354 -> 1360 | 527 -> 503 | 0 | 97 / 96 / 92 |
| Archive ficha 1994-cashmere-cocoon-coat (antes: serra-coat) | 83 -> 80 | 2123 -> 3277 | 442 -> 358 | 0 | 97 / 96 / 100 |
| Archive coleccion all (antes: permanent-collection) | 82 -> 81 | 1348 -> 1965 | 591 -> 597 | 0 | 97 / 96 / 92 |
| Archive coleccion permanent-collection (control) | 82 -> 89 | 1348 -> 1789 | 591 -> 381 | 0 | 97 / 96 / 92 |
| Sartorial ficha serra-coat (referencia) | 87 -> 82 | 1409 -> 2433 | 444 -> 425 | 0 | 97 / 96 / 100 |

Puntuaciones sueltas: Imprint desk-mat 88/80/78; Imprint all 75/69/78; Archive coat 79/80/80; Sartorial serra-coat 77/84/82. Ninguna mediana <70. Sin bajar de 70 en mediana, pero Imprint all tiene una ejecucion en 69.

## Diagnostico LCP de ficha >3 s (Imprint 3061 ms, Archive 3277 ms)

- No es la imagen: Lighthouse no marca uses-responsive-images, modern-image-formats, offscreen-images, prioritize-lcp-image ni lcp-lazy-loaded; la imagen LCP se sirve WebP 800 px (83-95 KB) con eager + fetchpriority=high (snippets/responsive-image.liquid:30-36 via sections/main-product.liquid:100 prioritize: forloop.first). unsized-images pasa.
- Causa probable: ruta critica de CSS/JS con throttling simulado. base.css (271 KB sin minificar, 140 KiB sin usar) bloquea el render (layout/theme.liquid:54) y theme.js (275 KB, 208 KiB sin usar, bootup 1,6-1,7 s) con defer (layout/theme.liquid:95). FCP 1,2-2,2 s y LCP = FCP + descarga de imagen.
- Misma tendencia en la ficha de referencia serra-coat (LCP 2433 frente a 1409 antes) y en permanent-collection: la deriva es ruido del contenedor/CDN (varianza de +-10 puntos entre las 3 ejecuciones), no regresion por las 29 imagenes. Las 29 imagenes nuevas pesan 83-152 KB por foto servida y no cambian el peso total (2,1-2,4 MB, mayoria JS/CSS).
- Sin preload de la imagen LCP (no hay <link rel=preload as=image> en layout/theme.liquid ni main-product.liquid); fetchpriority=high lo compensa en parte. Mejora posible: preload explicito con imagesrcset/imagesizes de la primera imagen y partir base.css.
- Recomendacion (no aplicada): repetir la medicion en horas distintas antes de dar el LCP por regresion; los 3 s no se reproducen en la referencia de ayer.
