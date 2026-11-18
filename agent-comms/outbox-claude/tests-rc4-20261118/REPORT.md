# Pruebas en tienda real, temas rc4 (2026-11-18)

Tienda de desarrollo `sartorial-theme-kvkzl39t.myshopify.com`. Temas NO PUBLICADOS creados desde `origin/feat/audit-integration` (PR #14) en el SHA `9e4359fe16ea6322a741f0170e873ebeae144d83`: Sartorial rc4 `190452203824`, Imprint rc4 `190452236592`, Archive rc4 `190452269360` (`10-themes-rc4.json`). Rol `UNPUBLISHED`, `processing:false` y MD5 de `config/settings_data.json` igual al export en los 3. `run.mjs` SHA `103c1551…4292f` antes y después. Sin 429. Sin secretos en esta carpeta (0 coincidencias de `$STOREFRONT_PASSWORD` y `$SHOPIFY_CLI_THEME_TOKEN`). No se corrigió nada: solo se prueba y se informa.

Export: `build-export.mjs --commit 9e4359f --preset <P>` (93 archivos tras borrar solo en la copia las 4 rutas de documentación y soporte; sin `release-notes.md`). Diferencia con el ZIP de envío: el empaquetador además recorta los bloques `docs-only` de `assets/base.css`/`theme.js` y las claves de locale; este export no lo hace (procedimiento de tests-rc2/rc3).

## Resultados

| Comprobación | Resultado | Evidencia (`archivo:check`) |
|---|---|---|
| UX-01 galería carrusel a 390 px (DPR 2, touch, isMobile), `serra-coat` (4 fotos), 3 presets | PASA: fotos en fila (no apiladas), pista con scroll, swipe táctil real mueve la pista y el contador, siguiente/anterior, un solo slide no inert, zoom abre y cierra, sin desborde | `15-ux01-gallery.json:runs[].checks` |
| UX-01 `fixture-media-3d-video` a 390 px, 3 presets | PASA con observación: siguiente/anterior, slide activo no inert, vídeo reproduce, anuncio de estado. El swipe que empieza sobre el visor 3D no mueve el carrusel (el visor captura el gesto); solo el botón «siguiente» avanza (marcado como `swipeOn3dCaptured`, no como fallo) | `15-ux01-gallery.json` (`notes`, `afterGutterSwipeRight`) |
| UX-01 a 1280 px (3 presets, 2 productos) | PASA: paginador oculto, 0 slides inert, pista no desplazable, sin desborde, zoom abre y cierra | `15-ux01-gallery.json` (`mode: desktop`) |
| Capturas UX-01 miradas | Sartorial `serra-coat` swipe y zoom, Sartorial 3D+vídeo, Imprint 3D, Archive escritorio. Franja gris bajo el vídeo en el slide 2 (vídeo 350x350 en slide de 384 px de alto); aviso estético | `ux01-*.png` en el scratchpad de la sesión (fuera del repo) |
| 7 secciones nuevas en `/pages/std-test`, 390 y 1280, 3 presets: presentes, sin imágenes rotas, sin desborde horizontal | PASA (secciones presentes y con altura; sin desborde en los 6 casos) | `16-sections-page.json:checks.allSectionsPresent, noHorizontalOverflow` |
| `image-with-text` en escritorio | FALLA: a 1280 px queda en una columna (imagen de 1240x1550 y texto debajo) en los 3 presets; alturas de 1930-1967 px | `16-sections-page.json:sections[image_with_text].h`; `scripts/probe-image-with-text-grid.mjs` (grid `1240px`) |
| Consola sin errores propios | PASA: 0 errores del tema. Excluidos y contados aparte (`consolePlatform`): fallos de red del túnel a `shopifysvc.com`, `shop.app`, barra de preview y `shopify-xr.js` 404 | `16-sections-page.json:consoleTheme`; `18-home.json:consoleTheme` |
| axe (wcag2a, wcag2aa, wcag21aa, best-practice) en `/pages/std-test` | PASA sin violaciones del tema. Solo `frame-title` en `#PBarNextFrame` (barra de preview de Shopify, ya visto en rc3). `incomplete`: `color-contrast` 4-5 nodos y `frame-tested` 1 | `16-sections-page.json:axeTheme, axe.incomplete` |
| Teclado (Tab/Shift+Tab) en `/pages/std-test` | PASA: se alcanzan las 7 secciones, orden del DOM, 0 paradas en slides inert, 0 foco oculto, Shift+Tab simétrico en los 6 casos | `17-keyboard-motion.json:checks` |
| Indicador de foco visible | FALLA parcial: la pista `.slideshow__track` (parada de tabulación) no muestra anillo en Sartorial ni Imprint (diferencia de píxeles nula y captura mirada; `outline` calculado 2 px offset -4 px queda cubierto por los slides). Falsos positivos descartados a mano: `collection-list` (el anillo va en el `media` de la tarjeta, captura mirada), enlace del anuncio (ya existe `outline` calculado) | `17-keyboard-motion.json:noIndicator`; `scripts/probe-focus-computed.mjs`; `dbg-fv-slideTrack.png` |
| Slideshow: siguiente, anterior, puntos, pausa, autoplay | PASA en los 6 casos (autoplay avanza a 3 s, pausa se mantiene, objetivos táctiles mínimo 24x24) | `16-sections-page.json:slideshow` |
| Slideshow con `prefers-reduced-motion: reduce` | PASA: no avanza solo en 8 s, botón de pausa oculto, «siguiente» funciona | `17-keyboard-motion.json` (entradas `reducedMotion`) |
| Vídeo, petición a terceros antes de Play | PASA: 0 peticiones a youtube/vimeo/ytimg/googlevideo antes de Play | `16-sections-page.json:video.thirdPartyBeforePlay` |
| Vídeo, Play crea el reproductor | FALLA para YouTube (`video_url`): no se crea ningún iframe y no hay peticiones; el hosted (`shopify://files/videos/fx.mp4`) sí crea `<video>` y reproduce | `16-sections-page.json:video.play0/play1`; `scripts/probe-youtube-play.mjs` (la plantilla contiene `Liquid error … external_video_url does not support VideoUrlDrop`) |
| Contraste del texto sobre imagen del slideshow (píxeles bajo cada texto, percentil 5) | FALLA con las imágenes y overlays de prueba. Diapositiva 1 (overlay 30, el valor por defecto): eyebrow 12 px 2,2-3,3:1 y texto 16 px 3,0-4,4:1 (mediana 4,0-6,5); título 2,5-3,8:1 (umbral 3); peor en Archive. Diapositivas 2 (overlay 20) y 3 (overlay 0) peor, hasta 1,0:1 sobre blusa blanca. La imagen es clara; depende de la foto, pero el valor por defecto no la protege | `16-sections-page.json:contrastOnImage` |
| Home de los 3 presets a 390 y 1280 | PASA: 0 errores propios, 0 violaciones axe, 0 desbordes, 0 errores Liquid, sin huecos entre secciones. Capturas miradas (marcadores de imagen esperados: no hay imágenes de sección). Sección `capsule` mide 0 px en Sartorial e Imprint (handle vacío, no pinta nada) | `18-home.json` |
| Regresión `run.mjs --read-only` | FALLA: 84 passed, 36 observed, 6 failed, 6 not_run (rc3: 90/36/0/6). Los 6 fallos son `axe_smoke` `heading-order` (moderate) en la colección, 3 presets x 2 anchos. Teclado 24/24 passed | `19-ro-regression.json:checks` (`axe_smoke` `AXE_VIOLATIONS_PRESENT`) |
| Regresión `run.mjs --cart` | PASA: 18/18; carrito final vacío y nota vacía verificados en los 3 presets, contexto cerrado | `20-cart-regression.json:sessions[].finalCartCleanup` |

## Fallos reales (sin corregir)

1. **`image-with-text` no es de dos columnas en escritorio.** `assets/section-standard-b.css:317` y `:341`: `calc(var(--image-text-media-fr, 1) * 1fr)` no es válido (`fr` no admite `calc`), la declaración se descarta y queda una columna. Fuente de la variable: `sections/image-with-text.liquid:58` (número sin unidad).
2. **Vídeo de YouTube/Vimeo (`video_url`) no se reproduce.** `sections/video.liquid:118` (`external_video_url` sobre el `video_url` del ajuste): Liquid devuelve `external_video_url does not support VideoUrlDrop` y la plantilla queda sin reproductor. El caso hosted funciona. Probable también en el editor.
3. **`heading-order` en la colección (regresión frente a rc3).** `sections/main-collection.liquid:84-95` mete el `h2` «Filter and sort» dentro de un `<details class="facets__disclosure">` cerrado, así que los `h3` de tarjeta (`snippets/product-card.liquid:362`) siguen al `h1` sin `h2` visible. axe objetivo `#CardTitle-template--…__main-15428356899120`.
4. **Foco invisible en la pista del slideshow.** `assets/section-standard-b.css:32-34` (`outline-offset: -4px`) con `.slideshow__slide { position: relative }` (`:38`) tapa el contorno; la pista es parada de tabulación (`assets/section-standard-b.js:56`). Visible en Sartorial e Imprint.
5. **Contraste del texto del slideshow sobre imágenes claras.** `sections/slideshow.liquid:274` (`overlay_opacity` por defecto 30) y `assets/section-standard-b.css:81` (`.slideshow__veil`): el velo por defecto no garantiza 4,5:1 (eyebrow de 12 px es el peor).
6. Observación, no fallo: swipe sobre el visor 3D de la ficha no desplaza el carrusel móvil (`product-gallery`, `assets/theme.js` ~L510-640); y franja vacía bajo el vídeo del slide 2.

## Residuos en la tienda

- Temas nuevos (no publicados): Sartorial rc4 `190452203824`, Imprint rc4 `190452236592`, Archive rc4 `190452269360`.
- `templates/page.std-test.json` en los 3 rc4 (copia en `21-page.std-test.json.template`).
- Página «Std test» `gid://shopify/Page/164230955312` (handle `std-test`, publicada, plantilla `std-test`).
- No se creó blog ni artículos (existía `news` con 3). Nada borrado.
- Archivos de ZIP temporales en el scratchpad de la sesión (fuera de la tienda).
- Cambio local sin commit en el checkout principal: `agent-comms/outbox-gpt/harness-GPT-RA-RB-001/stores.json` y `selftest.mjs` con los IDs rc4 (selftest 96/96).
