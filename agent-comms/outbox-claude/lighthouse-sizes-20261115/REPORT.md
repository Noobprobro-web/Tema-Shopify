ID: CLAUDE-LIGHTHOUSE-SIZES-001
Estado: entregado (solo medicion; sin cambios de codigo del tema)
Base: origin/master 5c993ca. Temas rc3 NO PUBLICADOS (verificado role=unpublished): Sartorial 190317920560, Imprint 190317953328, Archive 190317986096, con el codigo del PR #10 (1c111bc, nuevo `sizes`).
Tema de control creado: «Sartorial rc3-oldsizes» 190352425264 (UNPUBLISHED), via stagedUploadsCreate + themeCreate.
Metodo: Lighthouse 13.6.0 movil (simulado), 4 categorias, copia ampliada del script (`lighthouse-mobile-extended.mjs`, con pagina `search:<q>` y bytes de imagen por pasada; el script del repo no se toco). En serie, un navegador a la vez. Mediana de 3 pasadas; 5 pasadas donde la dispersion fue >8 puntos y en los pares antes/despues de Sartorial. Sin 429. Medicion aproximada desde contenedor (ver README del script).

## Tema oldsizes
Export `build-export` de Sartorial en 1c111bc (identico por md5 al rc3 desplegado en los archivos comprobados: base.css, theme.js, product-card, main-collection, main-search) con los 8 archivos del PR #10 devueltos a su version de master y sin `snippets/card-sizes.liquid` (82 archivos, md5 de 5 archivos verificados en el tema creado). Diferencias vs rc3: solo los archivos del PR #10 (`oldsizes-vs-rc3-diff.txt`; las 4 filas "Only in p/ ... documentation/support" son del export y NO estan en el rc3 desplegado, asi que no cuentan). No se uso `package-theme-zip.mjs` porque produce el ZIP generico con los 3 presets y no el contenido Sartorial desplegado.

## Resultados (mediana; entre corchetes, pasadas sueltas; img = transferencia de imagenes de Lighthouse sin scroll)

| Pagina | Antes (mismo momento, oldsizes) | Despues (rc3 con PR #10) | Img KB antes -> despues | LCP ms antes -> despues | TBT ms antes -> despues | Previo historico |
| --- | --- | --- | --- | --- | --- | --- |
| Sartorial /collections/all (5 pasadas) | 82 [76 82 82 79 84] | 81 [73 83 81 85 66] | 335 -> 833 (x2,5) | 2397 -> 2246 | 558 -> 557 | no medido |
| Sartorial /collections/all (3 pasadas) | 77 [71 79 77] | 76 [79 76 74] | 335 -> 833 | 2066 -> 3144 | 787 -> 554 | |
| Sartorial permanent-collection (5) | 80 [82 74 78 80 81] | 84 [80 84 85 84 87] | 213 -> 490 | 1914 -> 1758 | 714 -> 509 | 79 (20261114) |
| Sartorial search?q=coat (5 / 3) | 81 [81 79 84 83 76] | 87 [87 87 84] | 210 -> 546 | 2232 -> 1397 | 675 -> 425 | no medido |
| Sartorial ficha serra-coat (control; 5 / 3) | 77 [75 81 66 78 77] | 74 [71 77 74] | 294 -> 294 (igual) | 2965 -> 3181 | 572 -> 578 | 82 (15b), 87 (14) |
| Imprint /collections/all (5; 3-run 77) | n/a | 75 [71 78 74 78 75] | n/a -> 322 | 2054 | 808 | 75 (15b) |
| Imprint permanent-collection | n/a | 80 [80 84 79] | 249 | 1369 | 753 | 85 (15b), 85 (14) |
| Imprint search?q=coat | n/a | 83 [86 81 83] | 546 | 1387 | 483 | no medido |
| Archive /collections/all (5; 3-run 80) | n/a | 78 [64 80 78 77 88] | n/a -> 833 | 2378 | 655 | 81 (15b) |
| Archive permanent-collection | n/a | 83 [80 83 84] | 490 | 1761 | 601 | 89 (15b), 82 (14) |
| Archive search?q=coat | n/a | 81 [81 83 78] | 546 | 1374 | 631 | no medido |

A11y 97 / Best practices 96 / SEO 92 (colecciones), 100 (ficha), 61 (busqueda: noindex esperado de /search; no relacionado) en todas las paginas y temas; CLS ~0. JSON crudos en `raw-3runs/`, `raw-5runs/`, `raw-old-ctl/` (con `lhr/` por pasada: lista de imagenes, ancho y KB).

## Diagnostico
- El aumento de bytes es real y proviene solo de imagenes: en Sartorial /collections/all las mismas 10 fotos pasan de candidato 480w (13-52 KB cada una, total 335 KB) a 800w (25-150 KB, total 833 KB). Sin otro cambio: total de la pagina 2138 -> 2618 KB (+480 KB, igual al delta de imagen). Coincide con tu x2,6 (tu medicion carga ademas las imagenes lazy al hacer scroll; Lighthouse no hace scroll, por eso 335 -> 833 y no 868 -> 2261).
- Causa: con `default_grid_columns` = 2 el movil pasa a 1 columna y `sizes` a `calc(100vw / 1)`: 390 px x DPR 1,75 (Lighthouse) = 683 px -> candidato 800w (en DPR 2: 780 -> 800w). Antes `50vw` = 195 px -> 480w (con upscale ~1,46x, tarjeta algo borrosa). Imprint (4 columnas por defecto -> 2 en movil) no cambia. Archive tiene el mismo ajuste que Sartorial (mismos 833 KB).
- Efecto en puntuacion: no detectable. Pares medidos en el mismo momento: /collections/all 82 -> 81 (5 pasadas) y 77 -> 76 (3), permanent-collection 80 -> 84, busqueda 81 -> 87, control 77 -> 74. Ninguna baja supera 5 puntos; la mayor (-3) esta dentro de la dispersion entre pasadas (hasta 19-24 puntos en 5 pasadas por ruido del contenedor). El LCP no es la imagen de tarjeta: en el 3-run sube 2066 -> 3144 pero en el 5-run baja 2397 -> 2246. Referencia de ruido: Imprint permanent-collection, cuyo codigo de imagenes no cambia (249 KB), cayo de 85 a 80 entre sesiones. Que Lighthouse no penalice se explica porque el throttling simulado cuenta la imagen LCP y el main thread; los ~500 KB extra se descargan tras el LCP y las imagenes bajo el pliegue son lazy.
- Riesgo que Lighthouse no mide: en 4G real, +~500 KB en la primera pantalla y mas con el scroll (+1,4 MB en tu prueba) en una coleccion de 24 productos. El Theme Store mide el score de laboratorio (media de home, coleccion y ficha >= 60; aqui 74-87), asi que no es bloqueante.

## Veredicto
El nuevo `sizes` NO degrada la puntuacion Lighthouse movil mas de 5 puntos (diferencia medida entre -3 y +6 con pares simultaneos, dentro del ruido). Si degrada el peso de imagenes (x2,5 en Sartorial y Archive, sin cambio en Imprint). Fusionable por rendimiento de laboratorio; la decision queda en el equilibrio nitidez/bytes.

## Mitigaciones (NO aplicadas)
1. Tope movil: en `card-sizes` usar un ancho efectivo menor para 1 columna, p. ej. `calc(100vw * 0.8)` en lugar de `calc(100vw / 1)` (312 px x 1,75 = 546 -> candidato 640w, ~35 % menos bytes que 800w, upscale <= 1,2x en DPR 2).
2. Candidato intermedio: ya existe 640w; anadir 720w (`srcset_widths` en product-card.liquid:54) cubre 390 px a DPR 1,75-1,85 sin saltar a 800w; ahorro ~15-20 %.
3. Dos columnas por defecto en movil (Sartorial y Archive: `default_grid_columns` 4 en listings/*/templates/collection.json:24): vuelve a ~335 KB, a costa de cambiar el diseno y la densidad del escaparate.
4. Limitar el candidato maximo en movil a 800w y no servir 960/1200 en DPR 3 (hoy no se sirven en 390 px).
5. Medir 2 y 3 antes de elegir: la nitidez en tarjeta grande es el motivo del cambio, no rendimiento de laboratorio.

## Pendiente / limites
Medicion aproximada de contenedor, no certificacion. «Sartorial rc3-oldsizes» queda creado (no publicado); se puede borrar a peticion tuya. Archive/Imprint «antes» no medido (solo Sartorial se aisla con la copia).
